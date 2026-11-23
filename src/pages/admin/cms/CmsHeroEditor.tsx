import { useEffect, useMemo, useState } from 'react';
import { Eye, Plus, Save, Send, Trash2 } from 'lucide-react';
import { loadCmsPublishedMedia, previewCmsMedia } from '@/lib/cms/service';
import type { CmsHeroSection, CmsMediaAsset } from '@/lib/cms/types';
import {
  CmsButton,
  CmsFeedback,
  CmsField,
  CmsLoading,
  CmsMediaPicker,
  CmsPageTitle,
  CmsPanel,
} from './CmsUi';
import { errorMessage } from './cmsEditorUtils';
import { useCmsPageDraft } from './useCmsPageDraft';

export default function CmsHeroEditor() {
  const draft = useCmsPageDraft('home');
  const [media, setMedia] = useState<CmsMediaAsset[]>([]);
  const [mediaError, setMediaError] = useState('');
  const [videoPreview, setVideoPreview] = useState('');
  const [posterPreview, setPosterPreview] = useState('');

  const hero = useMemo(
    () => draft.content?.sections.find(
      (section): section is CmsHeroSection => section.type === 'hero',
    ),
    [draft.content],
  );

  useEffect(() => {
    let active = true;
    loadCmsPublishedMedia()
      .then((items) => {
        if (active) setMedia(items);
      })
      .catch((cause: unknown) => {
        if (active) setMediaError(errorMessage(cause));
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    let revoke: () => void = () => {};
    if (hero?.backgroundVideo?.storagePath) {
      previewCmsMedia(hero.backgroundVideo.storagePath)
        .then((preview) => {
          if (!active) {
            preview.revoke();
            return;
          }
          revoke = preview.revoke;
          setVideoPreview(preview.objectUrl);
        })
        .catch((cause: unknown) => {
          if (active) setMediaError(errorMessage(cause));
        });
    } else {
      setVideoPreview('');
    }
    return () => {
      active = false;
      revoke();
    };
  }, [hero?.backgroundVideo?.storagePath]);

  useEffect(() => {
    let active = true;
    let revoke: () => void = () => {};
    if (hero?.poster?.storagePath) {
      previewCmsMedia(hero.poster.storagePath)
        .then((preview) => {
          if (!active) {
            preview.revoke();
            return;
          }
          revoke = preview.revoke;
          setPosterPreview(preview.objectUrl);
        })
        .catch((cause: unknown) => {
          if (active) setMediaError(errorMessage(cause));
        });
    } else {
      setPosterPreview('');
    }
    return () => {
      active = false;
      revoke();
    };
  }, [hero?.poster?.storagePath]);

  function updateHero(update: (current: CmsHeroSection) => CmsHeroSection) {
    if (!draft.content) return;
    const current =
      hero ??
      ({
        id: crypto.randomUUID(),
        enabled: true,
        type: 'hero',
        eyebrow: '',
        title: '',
        description: '',
        actions: [],
      } satisfies CmsHeroSection);
    const next = update(current);
    const sections = hero
      ? draft.content.sections.map((section) => (section.id === hero.id ? next : section))
      : [...draft.content.sections, next];
    draft.setContent({ ...draft.content, sections });
  }

  if (draft.loading) return <CmsLoading />;
  if (!draft.content) return <CmsFeedback message={`Homepage draft could not be loaded: ${draft.error}`} />;

  return (
    <div>
      <CmsPageTitle
        title="Homepage hero"
        description="Edit the hero draft. Media choices come from published CMS assets so any published page reference points to an available file."
        actions={
          <div className="flex flex-wrap gap-2">
            <CmsButton variant="secondary" onClick={draft.preview} disabled={draft.busy}>
              <Eye size={16} /> Preview
            </CmsButton>
            <CmsButton variant="secondary" onClick={() => void draft.save()} disabled={draft.busy}>
              <Save size={16} /> Save draft
            </CmsButton>
            <CmsButton onClick={() => void draft.publish()} disabled={draft.busy}>
              <Send size={16} /> Publish
            </CmsButton>
          </div>
        }
      />
      {draft.error && <div className="mb-4"><CmsFeedback message={draft.error} /></div>}
      {draft.success && <div className="mb-4"><CmsFeedback message={draft.success} variant="success" /></div>}
      {mediaError && <div className="mb-4"><CmsFeedback message={`Media could not be loaded or previewed: ${mediaError}`} /></div>}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(300px,.9fr)]">
        <CmsPanel title="Hero content" description="Keep headings concise and use meaningful action destinations.">
          <div className="grid gap-4">
            <CmsField label="Eyebrow" value={hero?.eyebrow ?? ''} onChange={(eyebrow) => updateHero((item) => ({ ...item, eyebrow }))} />
            <CmsField label="Heading" value={hero?.title ?? ''} onChange={(title) => updateHero((item) => ({ ...item, title }))} required />
            <CmsField label="Description" value={hero?.description ?? ''} onChange={(description) => updateHero((item) => ({ ...item, description }))} multiline />
          </div>
          <div className="mt-6 border-t border-slate-100 pt-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-slate-900">Call-to-action buttons</h3>
              <CmsButton
                variant="secondary"
                disabled={(hero?.actions.length ?? 0) >= 2}
                onClick={() => updateHero((item) => ({
                  ...item,
                  actions: [...item.actions, { label: '', href: '/', style: 'primary' }],
                }))}
              >
                <Plus size={15} /> Add button
              </CmsButton>
            </div>
            <div className="grid gap-3">
              {(hero?.actions ?? []).map((action, index) => (
                <div key={`${index}-${action.href}`} className="grid gap-3 rounded-xl border border-slate-200 p-3 sm:grid-cols-[1fr_1fr_140px_auto]">
                  <CmsField label="Label" value={action.label} onChange={(label) => updateHero((item) => ({ ...item, actions: item.actions.map((entry, i) => i === index ? { ...entry, label } : entry) }))} />
                  <CmsField label="Link" value={action.href} onChange={(href) => updateHero((item) => ({ ...item, actions: item.actions.map((entry, i) => i === index ? { ...entry, href } : entry) }))} />
                  <label className="grid gap-1.5 text-sm font-medium text-slate-800">
                    Style
                    <select className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm" value={action.style} onChange={(event) => {
                      const style = event.target.value;
                      if (style === 'primary' || style === 'secondary' || style === 'text') {
                        updateHero((item) => ({ ...item, actions: item.actions.map((entry, i) => i === index ? { ...entry, style } : entry) }));
                      }
                    }}>
                      <option value="primary">Primary</option>
                      <option value="secondary">Secondary</option>
                      <option value="text">Text</option>
                    </select>
                  </label>
                  <button type="button" aria-label="Remove action" className="self-end rounded-lg p-2 text-red-700 hover:bg-red-50" onClick={() => updateHero((item) => ({ ...item, actions: item.actions.filter((_, i) => i !== index) }))}>
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}
              {(!hero || hero.actions.length === 0) && <p className="text-sm text-slate-500">No hero buttons have been added.</p>}
            </div>
          </div>
        </CmsPanel>

        <div className="grid content-start gap-5">
          <CmsPanel title="Hero footage" description="Upload media in the Media Library, publish it, then select it here.">
            <div className="grid gap-4">
              <CmsMediaPicker label="Background video" assets={media} value={hero?.backgroundVideo} accept="video" onChange={(backgroundVideo) => updateHero((item) => ({ ...item, backgroundVideo }))} />
              <CmsMediaPicker label="Poster image" assets={media} value={hero?.poster} accept="image" onChange={(poster) => updateHero((item) => ({ ...item, poster }))} />
              <CmsMediaPicker label="Background image (optional)" assets={media} value={hero?.backgroundImage} accept="image" onChange={(backgroundImage) => updateHero((item) => ({ ...item, backgroundImage }))} />
            </div>
          </CmsPanel>
          {(videoPreview || posterPreview) && (
            <CmsPanel title="Media preview">
              <div className="overflow-hidden rounded-xl bg-slate-950">
                {videoPreview ? (
                  <video className="aspect-video w-full object-cover" src={videoPreview} poster={posterPreview || undefined} controls muted playsInline />
                ) : (
                  <img className="aspect-video w-full object-cover" src={posterPreview} alt={hero?.poster?.altText ?? 'Selected hero poster'} />
                )}
              </div>
            </CmsPanel>
          )}
        </div>
      </div>
    </div>
  );
}

