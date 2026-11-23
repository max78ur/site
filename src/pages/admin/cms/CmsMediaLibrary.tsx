import { useEffect, useRef, useState } from 'react';
import { Image, Play, Send, Trash2, Upload } from 'lucide-react';
import {
  loadCmsDraftMedia,
  loadCmsPublishedMedia,
  previewCmsMedia,
  publishCmsDraftMedia,
  removeCmsPublishedMedia,
  replaceCmsMediaDraft,
  removeCmsDraftMedia,
  uploadCmsDraftMedia,
} from '@/lib/cms/service';
import type { CmsMediaAsset } from '@/lib/cms/types';
import { auth } from '@/lib/firebase';
import { CmsButton, CmsFeedback, CmsField, CmsLoading, CmsPageTitle, CmsPanel } from './CmsUi';
import { errorMessage } from './cmsEditorUtils';

export default function CmsMediaLibrary() {
  const [draftMedia, setDraftMedia] = useState<CmsMediaAsset[]>([]);
  const [publishedMedia, setPublishedMedia] = useState<CmsMediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyAsset, setBusyAsset] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [altText, setAltText] = useState('');
  const [progress, setProgress] = useState<number | null>(null);
  const [previewAsset, setPreviewAsset] = useState<CmsMediaAsset | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);
  const currentUser = auth.currentUser;

  async function reload() {
    const [drafts, published] = await Promise.all([loadCmsDraftMedia(), loadCmsPublishedMedia()]);
    setDraftMedia(drafts);
    setPublishedMedia(published);
  }

  useEffect(() => {
    let active = true;
    Promise.all([loadCmsDraftMedia(), loadCmsPublishedMedia()])
      .then(([drafts, published]) => {
        if (!active) return;
        setDraftMedia(drafts);
        setPublishedMedia(published);
      })
      .catch((cause: unknown) => {
        if (active) setError(errorMessage(cause));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    let revoke: () => void = () => {};
    setPreviewUrl('');
    if (previewAsset) {
      previewCmsMedia(previewAsset.storagePath)
        .then((preview) => {
          if (!active) {
            preview.revoke();
            return;
          }
          revoke = preview.revoke;
          setPreviewUrl(preview.objectUrl);
        })
        .catch((cause: unknown) => {
          if (active) setError(`Media preview failed: ${errorMessage(cause)}`);
        });
    }
    return () => {
      active = false;
      revoke();
    };
  }, [previewAsset]);

  async function handleUpload(file?: File) {
    if (!file) return;
    if (!currentUser) {
      setError('Your admin session is no longer available. Sign in again before uploading.');
      return;
    }
    setBusyAsset('upload');
    setError('');
    setSuccess('');
    setProgress(0);
    try {
      const { asset } = await uploadCmsDraftMedia(
        file,
        currentUser.uid,
        altText,
        setProgress,
      );
      await reload();
      setAltText('');
      setSuccess(`Uploaded "${asset.fileName}" as a private draft asset.`);
      if (fileInput.current) fileInput.current.value = '';
    } catch (cause) {
      setError(errorMessage(cause));
      try {
        await reload();
      } catch (refreshError) {
        setError(`${errorMessage(cause)} Refresh also failed: ${errorMessage(refreshError)}`);
      }
    } finally {
      setBusyAsset('');
      setProgress(null);
    }
  }

  async function handlePublish(asset: CmsMediaAsset) {
    if (!currentUser) {
      setError('Your admin session is no longer available. Sign in again before publishing.');
      return;
    }
    setBusyAsset(asset.assetId);
    setError('');
    setSuccess('');
    try {
      await publishCmsDraftMedia(asset.assetId, currentUser.uid);
      await reload();
      setSuccess(`Published "${asset.fileName}". Select the published asset in a page editor before publishing that page.`);
    } catch (cause) {
      setError(errorMessage(cause));
      try {
        await reload();
      } catch (refreshError) {
        setError(`${errorMessage(cause)} Refresh also failed: ${errorMessage(refreshError)}`);
      }
    } finally {
      setBusyAsset('');
    }
  }

  async function handleReplace(asset: CmsMediaAsset, file: File, nextAltText: string) {
    if (!currentUser) {
      setError('Your admin session is no longer available. Sign in again before replacing media.');
      return;
    }
    setBusyAsset(asset.assetId);
    setError('');
    setSuccess('');
    setProgress(0);
    try {
      await replaceCmsMediaDraft(asset.assetId, file, currentUser.uid, nextAltText, setProgress);
      await reload();
      setSuccess(`Replacement for "${asset.fileName}" is saved as a private draft. Publish it, then refresh page references to the latest version.`);
    } catch (cause) {
      setError(errorMessage(cause));
      try {
        await reload();
      } catch (refreshError) {
        setError(`${errorMessage(cause)} Refresh also failed: ${errorMessage(refreshError)}`);
      }
    } finally {
      setBusyAsset('');
      setProgress(null);
    }
  }

  async function handleDelete(asset: CmsMediaAsset, published = false) {
    const description = published ? 'published' : 'private draft';
    if (!window.confirm(`Permanently delete the ${description} file "${asset.fileName}"? Referenced assets cannot be deleted.`)) return;
    setBusyAsset(asset.assetId);
    setError('');
    setSuccess('');
    try {
      if (published) await removeCmsPublishedMedia(asset.assetId);
      else await removeCmsDraftMedia(asset.assetId);
      if (previewAsset?.assetId === asset.assetId) setPreviewAsset(null);
      await reload();
      setSuccess(`Deleted ${description} media "${asset.fileName}".`);
    } catch (cause) {
      setError(errorMessage(cause));
      try {
        await reload();
      } catch (refreshError) {
        setError(`${errorMessage(cause)} Refresh also failed: ${errorMessage(refreshError)}`);
      }
    } finally {
      setBusyAsset('');
    }
  }

  if (loading) return <CmsLoading />;

  return (
    <div>
      <CmsPageTitle
        title="Media library"
        description="Upload private image and video drafts, preview them with authenticated reads, and publish versioned assets for CMS pages."
      />
      {error && <div className="mb-4"><CmsFeedback message={error} /></div>}
      {success && <div className="mb-4"><CmsFeedback message={success} variant="success" /></div>}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(280px,.9fr)]">
        <div className="grid content-start gap-5">
          <CmsPanel title="Upload media" description="Images up to 10 MiB and MP4/WebM video up to 100 MiB. Uploading creates a private draft only.">
            <div className="grid gap-4">
              <CmsField label="Alternative text" value={altText} onChange={setAltText} hint="Required for accessibility. Describe the image; for decorative media, explain its context." />
              <label className="grid gap-2 text-sm font-medium text-slate-800">
                Choose image or video file
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm"
                  disabled={busyAsset === 'upload'}
                  onChange={(event) => void handleUpload(event.target.files?.[0])}
                  className="block w-full rounded-xl border border-slate-300 bg-white p-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-semibold"
                />
              </label>
              {progress !== null && <div role="status" className="text-sm text-slate-600">Uploading: {progress}%</div>}
              <div className="flex items-center gap-2 text-xs leading-5 text-slate-500">
                <Upload aria-hidden="true" size={15} />
                To replace existing content, upload the replacement as a new asset, publish it, then select it in the page editor. Existing references remain unchanged.
              </div>
            </div>
          </CmsPanel>

          <CmsPanel title={`Draft assets (${draftMedia.length})`} description="These files are private and are not available to the public website.">
            <div className="grid gap-3">
              {draftMedia.map((asset) => (
                <MediaRow key={asset.assetId} asset={asset} status="Draft" busy={busyAsset === asset.assetId} onPreview={() => setPreviewAsset(asset)} onPublish={() => void handlePublish(asset)} onReplace={(file, text) => void handleReplace(asset, file, text)} onDelete={() => void handleDelete(asset)} />
              ))}
              {draftMedia.length === 0 && <p className="rounded-xl border border-dashed border-slate-300 p-5 text-center text-sm text-slate-500">No draft media has been uploaded.</p>}
            </div>
          </CmsPanel>

          <CmsPanel title={`Published assets (${publishedMedia.length})`} description="Published assets are versioned and can be selected in page and hero drafts.">
            <div className="grid gap-3">
              {publishedMedia.map((asset) => (
                <MediaRow key={asset.assetId} asset={asset} status="Published" busy={busyAsset === asset.assetId} onPreview={() => setPreviewAsset(asset)} onReplace={(file, text) => void handleReplace(asset, file, text)} onDelete={() => void handleDelete(asset, true)} />
              ))}
              {publishedMedia.length === 0 && <p className="rounded-xl border border-dashed border-slate-300 p-5 text-center text-sm text-slate-500">No CMS media has been published.</p>}
            </div>
          </CmsPanel>
        </div>

        <div className="h-fit xl:sticky xl:top-6">
          <CmsPanel title="Preview" description={previewAsset?.fileName ?? 'Choose an asset from either list.'}>
            {previewAsset && previewUrl ? (
              previewAsset.contentType.startsWith('video/') ? (
                <video className="w-full rounded-xl bg-slate-950" src={previewUrl} controls muted playsInline />
              ) : (
                <img className="max-h-[28rem] w-full rounded-xl bg-slate-100 object-contain" src={previewUrl} alt={previewAsset.altText} />
              )
            ) : previewAsset ? (
              <div className="grid aspect-video place-items-center rounded-xl bg-slate-100 text-sm text-slate-500">Loading authenticated preview…</div>
            ) : (
              <div className="grid aspect-video place-items-center rounded-xl bg-slate-100 text-center text-sm text-slate-500">
                <Image aria-hidden="true" className="mx-auto mb-2" size={24} />
                Select an asset to preview it.
              </div>
            )}
            {previewAsset && <p className="mt-3 text-xs leading-5 text-slate-500">{previewAsset.altText || 'No alternative text'} · {formatBytes(previewAsset.sizeBytes)}</p>}
          </CmsPanel>
          <div className="mt-4">
            <CmsFeedback variant="info" message="Authenticated Blob previews may require bucket CORS configuration. If access fails, the Firebase error is shown here; no bearer download URL is generated." />
          </div>
        </div>
      </div>
    </div>
  );
}

function MediaRow({
  asset,
  status,
  busy,
  onPreview,
  onPublish,
  onReplace,
  onDelete,
}: {
  asset: CmsMediaAsset;
  status: string;
  busy: boolean;
  onPreview: () => void;
  onPublish?: () => void;
  onReplace?: (file: File, altText: string) => void;
  onDelete?: () => void;
}) {
  const isVideo = asset.contentType.startsWith('video/');
  const replacementInput = useRef<HTMLInputElement>(null);
  const [replacementAltText, setReplacementAltText] = useState(asset.altText);
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 p-3 sm:flex-row sm:items-center">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-700">
        {isVideo ? <Play aria-hidden="true" size={18} /> : <Image aria-hidden="true" size={18} />}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900">{asset.fileName}</p>
        <p className="mt-0.5 text-xs text-slate-500">{status} · {formatBytes(asset.sizeBytes)} · {asset.contentType}</p>
        <p className="mt-1 truncate text-xs text-slate-500">{asset.altText}</p>
        {onReplace && (
          <label className="mt-2 grid max-w-md gap-1 text-xs font-medium text-slate-600">
            Replacement alternative text
            <input
              value={replacementAltText}
              onChange={(event) => setReplacementAltText(event.target.value)}
              className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm text-slate-900"
            />
          </label>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <CmsButton variant="secondary" onClick={onPreview}>Preview</CmsButton>
        {onReplace && (
          <>
            <input
              ref={replacementInput}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm"
              className="sr-only"
              aria-label={`Choose replacement for ${asset.fileName}`}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) onReplace(file, replacementAltText);
                event.target.value = '';
              }}
            />
            <CmsButton variant="secondary" onClick={() => replacementInput.current?.click()} disabled={busy}>
              <Upload size={14} /> Replace
            </CmsButton>
          </>
        )}
        {onPublish && <CmsButton onClick={onPublish} disabled={busy}><Send size={14} /> Publish</CmsButton>}
        {onDelete && <CmsButton variant="danger" onClick={onDelete} disabled={busy}><Trash2 size={14} /> Delete</CmsButton>}
      </div>
    </div>
  );
}

function formatBytes(bytes: number): string {
  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MiB`
    : `${Math.max(1, Math.round(bytes / 1024))} KiB`;
}

