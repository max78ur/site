import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import type { CmsMediaReference } from './types';

export async function resolvePublishedMediaUrl(
  media: CmsMediaReference,
): Promise<string> {
  if (!media.storagePath.startsWith('cms-published/')) {
    throw new Error('Public pages can only resolve published CMS media.');
  }
  return getDownloadURL(ref(storage, media.storagePath));
}

