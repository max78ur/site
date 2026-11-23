import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  runTransaction,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import {
  deleteObject,
  getBlob,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { auth, db, storage } from '@/lib/firebase';
import type { CmsMediaAsset, CmsPublishedMedia } from './types';
import { isCmsMediaAsset, isCmsPublishedMedia } from './validation';

const IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
]);
const VIDEO_TYPES = new Set(['video/mp4', 'video/webm']);
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

export interface CmsDraftMediaUpload {
  asset: CmsMediaAsset;
}

export interface CmsMediaPreview {
  objectUrl: string;
  revoke: () => void;
}

export async function uploadDraftMedia(
  file: File,
  actorUid: string,
  altText: string,
  onProgress?: (percent: number) => void,
): Promise<CmsDraftMediaUpload> {
  if (!actorUid.trim() || auth.currentUser?.uid !== actorUid) {
    throw new Error('The media upload must use the current signed-in user.');
  }
  validateUpload(file, altText);

  const mediaRef = doc(collection(db, 'cmsMediaDrafts'));
  const assetId = mediaRef.id;
  const fileName = sanitizeFileName(file.name);
  const storagePath = `cms-drafts/${actorUid}/${assetId}/${fileName}`;
  const storageRef = ref(storage, storagePath);
  const upload = uploadBytesResumable(storageRef, file, {
    contentType: file.type,
    customMetadata: { assetId, uploadedBy: actorUid },
  });

  await new Promise<void>((resolve, reject) => {
    upload.on(
      'state_changed',
      (snapshot) => {
        onProgress?.(
          Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
        );
      },
      reject,
      resolve,
    );
  });

  const assetMetadata = {
    assetId,
    storagePath,
    fileName,
    contentType: file.type,
    sizeBytes: file.size,
    altText: altText.trim(),
    uploadedBy: actorUid,
    uploadedAt: serverTimestamp(),
  };

  try {
    await setDoc(mediaRef, assetMetadata);
  } catch (metadataError) {
    try {
      await deleteObject(storageRef);
    } catch (cleanupError) {
      const metadataMessage =
        metadataError instanceof Error ? metadataError.message : 'unknown write error';
      const cleanupMessage =
        cleanupError instanceof Error ? cleanupError.message : 'unknown cleanup error';
      throw new Error(
        `Media metadata could not be saved, and the uploaded object could not be cleaned up (${metadataMessage}; ${cleanupMessage}).`,
      );
    }
    throw metadataError;
  }

  const mediaSnapshot = await getDoc(mediaRef);
  const storedAsset: unknown = mediaSnapshot.data();
  if (!mediaSnapshot.exists() || !isCmsMediaAsset(storedAsset)) {
    throw new Error(`Uploaded media "${assetId}" has invalid stored metadata.`);
  }

  return { asset: storedAsset };
}

export async function listDraftMedia(): Promise<CmsMediaAsset[]> {
  const snapshot = await getDocs(collection(db, 'cmsMediaDrafts'));
  return snapshot.docs.map((document) => {
    const asset: unknown = document.data();
    if (!isCmsMediaAsset(asset) || asset.assetId !== document.id) {
      throw new Error(`Draft media "${document.id}" has invalid stored metadata.`);
    }
    return asset;
  });
}

export async function listPublishedMedia(): Promise<CmsMediaAsset[]> {
  const snapshot = await getDocs(collection(db, 'cmsMediaPublished'));
  return snapshot.docs.map((document) => {
    const asset: unknown = document.data();
    if (!isCmsPublishedMedia(asset) || asset.assetId !== document.id) {
      throw new Error(`Published media "${document.id}" has invalid stored metadata.`);
    }
    return asset;
  });
}

export async function createMediaPreview(storagePath: string): Promise<CmsMediaPreview> {
  if (
    !storagePath.startsWith('cms-drafts/') &&
    !storagePath.startsWith('cms-published/')
  ) {
    throw new Error('The requested media path is not a CMS asset.');
  }
  const blob = await getBlob(ref(storage, storagePath));
  const objectUrl = URL.createObjectURL(blob);
  return {
    objectUrl,
    revoke: () => URL.revokeObjectURL(objectUrl),
  };
}

export async function publishDraftMedia(
  assetId: string,
  actorUid: string,
): Promise<CmsPublishedMedia> {
  if (!actorUid.trim() || auth.currentUser?.uid !== actorUid) {
    throw new Error('The media publish must use the current signed-in user.');
  }

  const draftSnapshot = await getDoc(doc(db, 'cmsMediaDrafts', assetId));
  const draftAsset: unknown = draftSnapshot.data();
  if (
    !draftSnapshot.exists() ||
    !isCmsMediaAsset(draftAsset) ||
    draftAsset.assetId !== assetId
  ) {
    throw new Error(`Draft media "${assetId}" was not found or has invalid metadata.`);
  }

  const publishedRef = doc(db, 'cmsMediaPublished', assetId);
  const publishedSnapshot = await getDoc(publishedRef);
  const currentPublished: unknown = publishedSnapshot.data();
  let currentVersion = 0;
  let previousPublished: CmsPublishedMedia | null = null;
  if (publishedSnapshot.exists()) {
    if (!isCmsPublishedMedia(currentPublished) || currentPublished.assetId !== assetId) {
      throw new Error(`Published media "${assetId}" has invalid stored metadata.`);
    }
    currentVersion = currentPublished.version;
    previousPublished = currentPublished;
  }

  const version = currentVersion + 1;
  const storagePath = `cms-published/${assetId}/${version}/${crypto.randomUUID()}-${draftAsset.fileName}`;
  const publishedStorageRef = ref(storage, storagePath);
  const blob = await getBlob(ref(storage, draftAsset.storagePath));
  const upload = uploadBytesResumable(publishedStorageRef, blob, {
    contentType: draftAsset.contentType,
    customMetadata: { assetId, version: String(version), publishedBy: actorUid },
  });

  await new Promise<void>((resolve, reject) => {
    upload.on('state_changed', undefined, reject, resolve);
  });

  const publishedAsset = {
    ...draftAsset,
    storagePath,
    uploadedBy: actorUid,
    uploadedAt: serverTimestamp(),
    version,
  };

  try {
    await runTransaction(db, async (transaction) => {
      const currentSnapshot = await transaction.get(publishedRef);
      if (currentSnapshot.exists()) {
        const currentAsset: unknown = currentSnapshot.data();
        if (
          !isCmsPublishedMedia(currentAsset) ||
          currentAsset.assetId !== assetId ||
          currentAsset.version !== currentVersion
        ) {
          throw new Error('This asset was published in another session. Reload the library and try again.');
        }
      } else if (currentVersion !== 0) {
        throw new Error('This asset changed during publishing. Reload the library and try again.');
      }
      transaction.set(publishedRef, publishedAsset);
    });
  } catch (metadataError) {
    try {
      await deleteObject(publishedStorageRef);
    } catch (cleanupError) {
      const metadataMessage =
        metadataError instanceof Error ? metadataError.message : 'unknown write error';
      const cleanupMessage =
        cleanupError instanceof Error ? cleanupError.message : 'unknown cleanup error';
      throw new Error(
        `Published media metadata could not be saved, and the uploaded object could not be cleaned up (${metadataMessage}; ${cleanupMessage}).`,
      );
    }
    throw metadataError;
  }

  const savedSnapshot = await getDoc(publishedRef);
  const savedAsset: unknown = savedSnapshot.data();
  if (!savedSnapshot.exists() || !isCmsPublishedMedia(savedAsset)) {
    throw new Error(`Published media "${assetId}" has invalid stored metadata.`);
  }
  if (
    previousPublished &&
    !(await isMediaPathReferenced(previousPublished.storagePath))
  ) {
    try {
      await deleteObject(ref(storage, previousPublished.storagePath));
    } catch (cleanupError) {
      throw new Error(
        `The new media version was published, but the previous unreferenced object could not be removed: ${cleanupError instanceof Error ? cleanupError.message : 'unknown storage error'}`,
      );
    }
  }
  return savedAsset;
}

export async function replaceDraftMedia(
  assetId: string,
  file: File,
  actorUid: string,
  altText: string,
  onProgress?: (percent: number) => void,
): Promise<CmsMediaAsset> {
  if (!actorUid.trim() || auth.currentUser?.uid !== actorUid) {
    throw new Error('The media replacement must use the current signed-in user.');
  }
  validateUpload(file, altText);

  const mediaRef = doc(db, 'cmsMediaDrafts', assetId);
  const existingDraftSnapshot = await getDoc(mediaRef);
  const existingDraft: unknown = existingDraftSnapshot.data();
  if (
    existingDraftSnapshot.exists() &&
    (!isCmsMediaAsset(existingDraft) || existingDraft.assetId !== assetId)
  ) {
    throw new Error(`Draft media "${assetId}" has invalid stored metadata.`);
  }
  if (!existingDraftSnapshot.exists()) {
    const publishedSnapshot = await getDoc(doc(db, 'cmsMediaPublished', assetId));
    const publishedAsset: unknown = publishedSnapshot.data();
    if (
      !publishedSnapshot.exists() ||
      !isCmsPublishedMedia(publishedAsset) ||
      publishedAsset.assetId !== assetId
    ) {
      throw new Error(`Media "${assetId}" was not found or has invalid published metadata.`);
    }
  }

  const fileName = sanitizeFileName(file.name);
  const storagePath = `cms-drafts/${actorUid}/${assetId}/${crypto.randomUUID()}-${fileName}`;
  const storageRef = ref(storage, storagePath);
  const upload = uploadBytesResumable(storageRef, file, {
    contentType: file.type,
    customMetadata: { assetId, uploadedBy: actorUid },
  });
  await new Promise<void>((resolve, reject) => {
    upload.on(
      'state_changed',
      (snapshot) => {
        onProgress?.(
          Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
        );
      },
      reject,
      resolve,
    );
  });

  const assetMetadata = {
    assetId,
    storagePath,
    fileName,
    contentType: file.type,
    sizeBytes: file.size,
    altText: altText.trim(),
    uploadedBy: actorUid,
    uploadedAt: serverTimestamp(),
  };
  try {
    await setDoc(mediaRef, assetMetadata);
  } catch (metadataError) {
    try {
      await deleteObject(storageRef);
    } catch (cleanupError) {
      const metadataMessage =
        metadataError instanceof Error ? metadataError.message : 'unknown write error';
      const cleanupMessage =
        cleanupError instanceof Error ? cleanupError.message : 'unknown cleanup error';
      throw new Error(
        `Replacement metadata could not be saved, and the uploaded object could not be cleaned up (${metadataMessage}; ${cleanupMessage}).`,
      );
    }
    throw metadataError;
  }

  const savedSnapshot = await getDoc(mediaRef);
  const savedAsset: unknown = savedSnapshot.data();
  if (!savedSnapshot.exists() || !isCmsMediaAsset(savedAsset)) {
    throw new Error(`Replacement media "${assetId}" has invalid stored metadata.`);
  }

  if (
    existingDraftSnapshot.exists() &&
    isCmsMediaAsset(existingDraft) &&
    existingDraft.storagePath !== storagePath &&
    !(await isMediaPathReferenced(existingDraft.storagePath))
  ) {
    try {
      await deleteObject(ref(storage, existingDraft.storagePath));
    } catch (cleanupError) {
      throw new Error(
        `The replacement draft was saved, but the previous unreferenced file could not be removed: ${cleanupError instanceof Error ? cleanupError.message : 'unknown storage error'}`,
      );
    }
  }
  return savedAsset;
}

export async function removeDraftMedia(assetId: string): Promise<void> {
  if (!assetId.trim()) throw new Error('A media asset ID is required.');

  const mediaRef = doc(db, 'cmsMediaDrafts', assetId);
  const snapshot = await getDoc(mediaRef);
  const storedAsset: unknown = snapshot.data();
  if (!snapshot.exists() || !isCmsMediaAsset(storedAsset) || storedAsset.assetId !== assetId) {
    throw new Error(`Draft media "${assetId}" was not found or has invalid metadata.`);
  }

  if (await isMediaPathReferenced(storedAsset.storagePath)) {
    throw new Error(
      `Draft media "${assetId}" is referenced by CMS content and cannot be deleted.`,
    );
  }

  await deleteObject(ref(storage, storedAsset.storagePath));
  await deleteDoc(mediaRef);
}

export async function removePublishedMedia(assetId: string): Promise<void> {
  if (!assetId.trim()) throw new Error('A media asset ID is required.');

  const mediaRef = doc(db, 'cmsMediaPublished', assetId);
  const snapshot = await getDoc(mediaRef);
  const storedAsset: unknown = snapshot.data();
  if (
    !snapshot.exists() ||
    !isCmsPublishedMedia(storedAsset) ||
    storedAsset.assetId !== assetId
  ) {
    throw new Error(`Published media "${assetId}" was not found or has invalid metadata.`);
  }
  if (await isMediaPathReferenced(storedAsset.storagePath)) {
    throw new Error(
      `Published media "${assetId}" is referenced by CMS content or a revision and cannot be deleted.`,
    );
  }

  await deleteDoc(mediaRef);
  try {
    await deleteObject(ref(storage, storedAsset.storagePath));
  } catch (cleanupError) {
    throw new Error(
      `Published media metadata was removed, but the unreferenced Storage object could not be deleted: ${cleanupError instanceof Error ? cleanupError.message : 'unknown storage error'}`,
    );
  }
}

async function isMediaPathReferenced(storagePath: string): Promise<boolean> {
  const [
    draftPages,
    publishedPages,
    revisions,
    draftSettings,
    publishedSettings,
    settingsRevisions,
  ] = await Promise.all([
    getDocs(collection(db, 'cmsDrafts')),
    getDocs(collection(db, 'cmsPublished')),
    getDocs(collection(db, 'cmsRevisions')),
    getDocs(collection(db, 'cmsSettingsDrafts')),
    getDocs(collection(db, 'cmsSettings')),
    getDocs(collection(db, 'cmsSettingsRevisions')),
  ]);
  return [
    ...draftPages.docs,
    ...publishedPages.docs,
    ...revisions.docs,
    ...draftSettings.docs,
    ...publishedSettings.docs,
    ...settingsRevisions.docs,
  ].some((page) => referencesStoragePath(page.data(), storagePath));
}

function validateUpload(file: File, altText: string): void {
  if (!altText.trim() || altText.length > 500) {
    throw new Error('Media alt text must be between 1 and 500 characters.');
  }
  const maxBytes = IMAGE_TYPES.has(file.type)
    ? MAX_IMAGE_BYTES
    : VIDEO_TYPES.has(file.type)
      ? MAX_VIDEO_BYTES
      : 0;
  if (maxBytes === 0 || file.size === 0 || file.size > maxBytes) {
    throw new Error('Unsupported media type or file size exceeds the CMS upload limit.');
  }
}

function referencesStoragePath(value: unknown, storagePath: string): boolean {
  if (Array.isArray(value)) {
    return value.some((item) => referencesStoragePath(item, storagePath));
  }
  if (!isObjectRecord(value)) return false;
  const record = value;
  if (record.storagePath === storagePath) return true;
  return Object.values(record).some((item) => referencesStoragePath(item, storagePath));
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function sanitizeFileName(fileName: string): string {
  const sanitized = fileName
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 180);
  return sanitized || 'upload';
}
