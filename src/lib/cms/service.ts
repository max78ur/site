import type {
  CmsPageContent,
  CmsPageId,
  CmsSettingsContent,
} from './types';
import {
  assertCmsPageContent,
  assertCmsSettingsContent,
} from './validation';
import {
  deleteDraftPage,
  deleteDraftSettings,
  getDraftPage,
  getDraftSettings,
  getPageRevisions,
  getPublishedPage,
  getPublishedSettings,
  publishDraftPage,
  publishDraftSettings,
  saveDraftPage,
  saveDraftSettings,
  createDraftPageIfMissing,
  watchPublishedPage,
  watchPublishedSettings,
} from './repository';
import {
  listDraftMedia,
  listPublishedMedia,
  createMediaPreview,
  publishDraftMedia,
  replaceDraftMedia,
  removeDraftMedia,
  removePublishedMedia,
  uploadDraftMedia,
  type CmsMediaPreview,
  type CmsDraftMediaUpload,
} from './mediaRepository';
import type { CmsMediaAsset, CmsPublishedMedia } from './types';

export async function loadPublishedPage(pageId: CmsPageId) {
  return getPublishedPage(pageId);
}

export async function loadDraftPage(pageId: CmsPageId) {
  return getDraftPage(pageId);
}

export async function saveCmsDraftPage(
  pageId: CmsPageId,
  content: CmsPageContent,
  actorUid: string,
): Promise<void> {
  assertCmsPageContent(content, pageId);
  await saveDraftPage(content, actorUid);
}

export async function importCmsDraftPageIfMissing(
  pageId: CmsPageId,
  content: CmsPageContent,
  actorUid: string,
): Promise<{ status: 'imported' | 'skipped'; pageId: CmsPageId }> {
  assertCmsPageContent(content, pageId);
  return createDraftPageIfMissing(pageId, content, actorUid);
}

export async function publishCmsDraftPage(
  pageId: CmsPageId,
  actorUid: string,
): Promise<number> {
  return publishDraftPage(pageId, actorUid);
}

export async function loadPageRevisions(pageId: CmsPageId) {
  return getPageRevisions(pageId);
}

export async function loadPublishedSiteSettings() {
  return getPublishedSettings();
}

export async function loadDraftSiteSettings() {
  return getDraftSettings();
}

export async function saveCmsDraftSettings(
  content: CmsSettingsContent,
  actorUid: string,
): Promise<void> {
  assertCmsSettingsContent(content);
  await saveDraftSettings(content, actorUid);
}

export async function publishCmsDraftSettings(actorUid: string): Promise<number> {
  return publishDraftSettings(actorUid);
}

export async function removeCmsDraftPage(pageId: CmsPageId): Promise<void> {
  await deleteDraftPage(pageId);
}

export async function removeCmsDraftSettings(): Promise<void> {
  await deleteDraftSettings();
}

export async function uploadCmsDraftMedia(
  file: File,
  actorUid: string,
  altText: string,
  onProgress?: (percent: number) => void,
): Promise<CmsDraftMediaUpload> {
  return uploadDraftMedia(file, actorUid, altText, onProgress);
}

export async function loadCmsDraftMedia() {
  return listDraftMedia();
}

export async function loadCmsPublishedMedia(): Promise<CmsMediaAsset[]> {
  return listPublishedMedia();
}

export async function previewCmsMedia(storagePath: string): Promise<CmsMediaPreview> {
  return createMediaPreview(storagePath);
}

export async function publishCmsDraftMedia(
  assetId: string,
  actorUid: string,
): Promise<CmsPublishedMedia> {
  return publishDraftMedia(assetId, actorUid);
}

export async function replaceCmsMediaDraft(
  assetId: string,
  file: File,
  actorUid: string,
  altText: string,
  onProgress?: (percent: number) => void,
): Promise<CmsMediaAsset> {
  return replaceDraftMedia(assetId, file, actorUid, altText, onProgress);
}

export async function removeCmsDraftMedia(assetId: string): Promise<void> {
  await removeDraftMedia(assetId);
}

export async function removeCmsPublishedMedia(assetId: string): Promise<void> {
  await removePublishedMedia(assetId);
}

export {
  watchPublishedPage as subscribeToPublishedPage,
  watchPublishedSettings as subscribeToPublishedSiteSettings,
};
