import {
  Timestamp,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type {
  CmsDraftPage,
  CmsDraftSettings,
  CmsPageContent,
  CmsPageId,
  CmsPageRevision,
  CmsPublishedPage,
  CmsPublishedSettings,
  CmsSettingsContent,
} from './types';
import {
  assertCmsPageContent,
  assertCmsSettingsContent,
  getCmsPageMediaReferences,
  isCmsDraftPage,
  isCmsPublishedMedia,
  isCmsDraftSettings,
  isCmsPublishedPage,
  isCmsPublishedSettings,
} from './validation';

const pageDraft = (pageId: CmsPageId) => doc(db, 'cmsDrafts', pageId);
const pagePublished = (pageId: CmsPageId) => doc(db, 'cmsPublished', pageId);
const settingsDraft = doc(db, 'cmsSettingsDrafts', 'global');
const settingsPublished = doc(db, 'cmsSettings', 'global');

function requireRecord<T>(
  value: unknown,
  guard: (candidate: unknown) => candidate is T,
  label: string,
): T {
  if (!guard(value)) {
    throw new Error(`Stored ${label} has an unsupported or invalid CMS schema.`);
  }
  return value;
}

function getPageContent(page: CmsPageContent): CmsPageContent {
  return {
    schemaVersion: page.schemaVersion,
    pageId: page.pageId,
    seo: page.seo,
    sections: page.sections,
  };
}

export async function getPublishedPage(
  pageId: CmsPageId,
): Promise<CmsPublishedPage | null> {
  const snapshot = await getDoc(pagePublished(pageId));
  if (!snapshot.exists()) return null;
  return requireRecord(snapshot.data(), isCmsPublishedPage, `published page "${pageId}"`);
}

export async function getDraftPage(pageId: CmsPageId): Promise<CmsDraftPage | null> {
  const snapshot = await getDoc(pageDraft(pageId));
  if (!snapshot.exists()) return null;
  return requireRecord(snapshot.data(), isCmsDraftPage, `draft page "${pageId}"`);
}

export function watchPublishedPage(
  pageId: CmsPageId,
  onValue: (page: CmsPublishedPage | null) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    pagePublished(pageId),
    (snapshot) => {
      try {
        onValue(
          snapshot.exists()
            ? requireRecord(
                snapshot.data(),
                isCmsPublishedPage,
                `published page "${pageId}"`,
              )
            : null,
        );
      } catch (error) {
        onError(asError(error));
      }
    },
    (error) => onError(error),
  );
}

export async function saveDraftPage(
  content: CmsPageContent,
  actorUid: string,
): Promise<void> {
  assertCmsPageContent(content);
  requireActor(actorUid);
  const ref = pageDraft(content.pageId);

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(ref);
    const createdAt = snapshot.exists() ? snapshot.get('createdAt') : undefined;
    if (snapshot.exists() && !(createdAt instanceof Timestamp)) {
      throw new Error(`Draft page "${content.pageId}" has invalid creation metadata.`);
    }

    transaction.set(ref, {
      ...getPageContent(content),
      createdAt: createdAt ?? serverTimestamp(),
      updatedAt: serverTimestamp(),
      updatedBy: actorUid,
    });
  });
}

export async function createDraftPageIfMissing(
  pageId: CmsPageId,
  content: CmsPageContent,
  actorUid: string,
): Promise<{ status: 'imported' | 'skipped'; pageId: CmsPageId }> {
  assertCmsPageContent(content, pageId);
  requireActor(actorUid);
  const ref = pageDraft(pageId);
  return runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(ref);
    if (snapshot.exists()) {
      return { status: 'skipped', pageId };
    }
    transaction.set(ref, {
      ...getPageContent(content),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      updatedBy: actorUid,
    });
    return { status: 'imported', pageId };
  });
}

export async function publishDraftPage(
  pageId: CmsPageId,
  actorUid: string,
): Promise<number> {
  requireActor(actorUid);
  const draftRef = pageDraft(pageId);
  const publishedRef = pagePublished(pageId);
  const revisionRef = doc(collection(db, 'cmsRevisions'));

  return runTransaction(db, async (transaction) => {
    const [draftSnapshot, publishedSnapshot] = await Promise.all([
      transaction.get(draftRef),
      transaction.get(publishedRef),
    ]);
    if (!draftSnapshot.exists()) {
      throw new Error(`Cannot publish "${pageId}" because its draft does not exist.`);
    }

    const draft = requireRecord(
      draftSnapshot.data(),
      isCmsDraftPage,
      `draft page "${pageId}"`,
    );
    const referencedMedia = new Map(
      getCmsPageMediaReferences(draft).map((media) => [media.assetId, media]),
    );
    const mediaSnapshots = await Promise.all(
      [...referencedMedia.keys()].map((assetId) =>
        transaction.get(doc(db, 'cmsMediaPublished', assetId)),
      ),
    );
    for (const mediaSnapshot of mediaSnapshots) {
      if (!mediaSnapshot.exists()) {
        throw new Error(
          `Cannot publish "${pageId}" because referenced media has not been published.`,
        );
      }
      const asset: unknown = mediaSnapshot.data();
      const publishedMedia = requireRecord(
        asset,
        isCmsPublishedMedia,
        `published media "${mediaSnapshot.id}"`,
      );
      if (
        referencedMedia.get(publishedMedia.assetId)?.storagePath !==
        publishedMedia.storagePath
      ) {
        throw new Error(
          `Cannot publish "${pageId}" because a media reference does not match its published asset.`,
        );
      }
    }

    const currentPublished = publishedSnapshot.exists()
      ? requireRecord(
          publishedSnapshot.data(),
          isCmsPublishedPage,
          `published page "${pageId}"`,
        )
      : null;
    const version = (currentPublished?.version ?? 0) + 1;
    const content = getPageContent(draft);
    const publication = {
      ...content,
      version,
      publishedAt: serverTimestamp(),
      publishedBy: actorUid,
    };

    transaction.set(publishedRef, publication);
    transaction.set(revisionRef, publication);
    return version;
  });
}

export async function getPublishedSettings(): Promise<CmsPublishedSettings | null> {
  const snapshot = await getDoc(settingsPublished);
  if (!snapshot.exists()) return null;
  return requireRecord(
    snapshot.data(),
    isCmsPublishedSettings,
    'published global settings',
  );
}

export async function getDraftSettings(): Promise<CmsDraftSettings | null> {
  const snapshot = await getDoc(settingsDraft);
  if (!snapshot.exists()) return null;
  return requireRecord(snapshot.data(), isCmsDraftSettings, 'draft global settings');
}

export function watchPublishedSettings(
  onValue: (settings: CmsPublishedSettings | null) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    settingsPublished,
    (snapshot) => {
      try {
        onValue(
          snapshot.exists()
            ? requireRecord(
                snapshot.data(),
                isCmsPublishedSettings,
                'published global settings',
              )
            : null,
        );
      } catch (error) {
        onError(asError(error));
      }
    },
    (error) => onError(error),
  );
}

export async function saveDraftSettings(
  content: CmsSettingsContent,
  actorUid: string,
): Promise<void> {
  assertCmsSettingsContent(content);
  requireActor(actorUid);

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(settingsDraft);
    const createdAt = snapshot.exists() ? snapshot.get('createdAt') : undefined;
    if (snapshot.exists() && !(createdAt instanceof Timestamp)) {
      throw new Error('Draft global settings have invalid creation metadata.');
    }

    transaction.set(settingsDraft, {
      ...content,
      createdAt: createdAt ?? serverTimestamp(),
      updatedAt: serverTimestamp(),
      updatedBy: actorUid,
    });
  });
}

export async function publishDraftSettings(actorUid: string): Promise<number> {
  requireActor(actorUid);
  const revisionRef = doc(collection(db, 'cmsSettingsRevisions'));

  return runTransaction(db, async (transaction) => {
    const [draftSnapshot, publishedSnapshot] = await Promise.all([
      transaction.get(settingsDraft),
      transaction.get(settingsPublished),
    ]);
    if (!draftSnapshot.exists()) {
      throw new Error('Cannot publish global settings because the draft does not exist.');
    }

    const draft = requireRecord(
      draftSnapshot.data(),
      isCmsDraftSettings,
      'draft global settings',
    );
    const currentPublished = publishedSnapshot.exists()
      ? requireRecord(
          publishedSnapshot.data(),
          isCmsPublishedSettings,
          'published global settings',
        )
      : null;
    const version = (currentPublished?.version ?? 0) + 1;
    const publication = {
      schemaVersion: draft.schemaVersion,
      theme: draft.theme,
      navigation: draft.navigation,
      footer: draft.footer,
      contact: draft.contact,
      version,
      publishedAt: serverTimestamp(),
      publishedBy: actorUid,
    };

    transaction.set(settingsPublished, publication);
    transaction.set(revisionRef, publication);
    return version;
  });
}

export async function getPageRevisions(
  pageId: CmsPageId,
): Promise<CmsPageRevision[]> {
  const revisionQuery = query(
    collection(db, 'cmsRevisions'),
    where('pageId', '==', pageId),
  );
  const snapshot = await getDocs(revisionQuery);
  return snapshot.docs
    .map((revision) =>
      requireRecord(
        revision.data(),
        isCmsPublishedPage,
        `revision "${revision.id}"`,
      ),
    )
    .sort((left, right) => right.publishedAt.toMillis() - left.publishedAt.toMillis());
}

export async function deleteDraftPage(pageId: CmsPageId): Promise<void> {
  await deleteDoc(pageDraft(pageId));
}

export async function deleteDraftSettings(): Promise<void> {
  await deleteDoc(settingsDraft);
}

function requireActor(actorUid: string): void {
  if (!actorUid.trim() || auth.currentUser?.uid !== actorUid) {
    throw new Error('The CMS write must use the current signed-in user.');
  }
}

function asError(error: unknown): Error {
  return error instanceof Error ? error : new Error('Unknown CMS repository error.');
}
