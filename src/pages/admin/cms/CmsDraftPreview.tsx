import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { getCmsPageMediaReferences, isCmsPageContent } from '@/lib/cms/validation';
import { loadDraftPage, previewCmsMedia } from '@/lib/cms/service';
import { CMS_PAGE_IDS } from '@/lib/cms/types';
import type { CmsPageContent, CmsSection } from '@/lib/cms/types';
import { CmsFeedback, CmsLoading } from './CmsUi';
import { CMS_PAGE_LABELS, errorMessage } from './cmsEditorUtils';

export default function CmsDraftPreview() {
  const { pageId: routePageId } = useParams();
  const pageId = CMS_PAGE_IDS.find((candidate) => candidate === routePageId) ?? 'home';
  const routeIsValid = pageId === routePageId;
  const location = useLocation();
  const routeContent: unknown = (location.state as { content?: unknown } | null)?.content;
  const initial = isCmsPageContent(routeContent) && routeContent.pageId === pageId ? routeContent : null;
  const [content, setContent] = useState<CmsPageContent | null>(initial);
  const [loading, setLoading] = useState(!initial);
  const [error, setError] = useState('');
  const [mediaUrls, setMediaUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!routeIsValid) {
      setError('The requested CMS page does not exist.');
      setLoading(false);
      return;
    }
    if (!initial) {
      let active = true;
      loadDraftPage(pageId)
        .then((draft) => {
          if (!active) return;
          if (!draft) setError('No saved CMS draft exists for this page yet.');
          else setContent(draft);
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
    }
    return undefined;
  }, [initial, pageId, routeIsValid]);

  useEffect(() => {
    if (!content) return;
    let active = true;
    const previews: Array<() => void> = [];
    const references = getCmsPageMediaReferences(content);
    Promise.all(
      [...new Set(references.map((reference) => reference.storagePath))].map(async (path) => {
        const preview = await previewCmsMedia(path);
        if (!active) {
          preview.revoke();
          return [path, ''] as const;
        }
        previews.push(preview.revoke);
        return [path, preview.objectUrl] as const;
      }),
    )
      .then((entries) => {
        if (active) setMediaUrls(Object.fromEntries(entries.filter(([, url]) => url)));
      })
      .catch((cause: unknown) => {
        const shouldReport = active;
        active = false;
        previews.forEach((revoke) => revoke());
        previews.length = 0;
        if (shouldReport) setError(`Some media previews could not be loaded: ${errorMessage(cause)}`);
      });
    return () => {
      active = false;
      previews.forEach((revoke) => revoke());
    };
  }, [content]);

  if (loading) return <CmsLoading />;
  if (!routeIsValid) return <CmsFeedback message="The requested CMS page does not exist." />;
  if (!content) {
    return (
      <div className="grid gap-4">
        <Link to="/admin/cms/pages" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-red-700"><ArrowLeft size={16} /> Back to page editor</Link>
        <CmsFeedback message={error || 'CMS draft could not be loaded.'} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-700">Private draft preview</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-950">{CMS_PAGE_LABELS[pageId]}</h1>
        </div>
        <Link to="/admin/cms/pages" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"><ArrowLeft size={16} /> Back to editor</Link>
      </div>
      <div className="mb-5"><CmsFeedback variant="info" message="This is an isolated CMS preview. It does not update or replace the current public page." /></div>
      {error && <div className="mb-5"><CmsFeedback message={error} /></div>}
      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <header className="border-b border-slate-200 bg-slate-950 px-6 py-5 text-white sm:px-10">
          <p className="text-xs font-bold uppercase tracking-widest text-red-300">TruckAxic draft · {content.pageId}</p>
          <h2 className="mt-2 text-3xl font-bold">{content.seo.title || 'Untitled page'}</h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-300">{content.seo.description}</p>
        </header>
        {content.sections.filter((section) => section.enabled).map((section) => (
          <PreviewSection key={section.id} section={section} mediaUrls={mediaUrls} />
        ))}
        {content.sections.filter((section) => section.enabled).length === 0 && (
          <p className="p-10 text-center text-sm text-slate-500">This draft has no enabled sections.</p>
        )}
      </article>
    </div>
  );
}

function PreviewSection({ section, mediaUrls }: { section: CmsSection; mediaUrls: Record<string, string> }) {
  if (section.type === 'hero') {
    const video = section.backgroundVideo && mediaUrls[section.backgroundVideo.storagePath];
    const poster = section.poster && mediaUrls[section.poster.storagePath];
    return (
      <section className="relative isolate min-h-72 overflow-hidden bg-slate-950 px-6 py-14 text-white sm:px-10">
        {video && <video className="absolute inset-0 -z-20 h-full w-full object-cover opacity-55" src={video} poster={poster} controls muted playsInline />}
        {section.backgroundImage && mediaUrls[section.backgroundImage.storagePath] && <img className="absolute inset-0 -z-20 h-full w-full object-cover opacity-55" src={mediaUrls[section.backgroundImage.storagePath]} alt={section.backgroundImage.altText} />}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/45 to-black/20" />
        {section.eyebrow && <p className="text-xs font-bold uppercase tracking-widest text-amber-300">{section.eyebrow}</p>}
        <h2 className="mt-3 max-w-3xl text-4xl font-bold sm:text-5xl">{section.title || 'Hero heading'}</h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-white/85">{section.description}</p>
        <ActionLinks actions={section.actions} />
      </section>
    );
  }
  if (section.type === 'legal') {
    return <section className="border-b border-slate-100 px-6 py-8 sm:px-10"><h2 className="text-2xl font-bold">{section.title}</h2>{section.blocks.map((block) => <div key={block.id} className="mt-5"><h3 className="font-bold">{block.heading}</h3>{block.paragraphs.map((text, index) => <p key={index} className="mt-2 leading-7 text-slate-600">{text}</p>)}</div>)}</section>;
  }
  return (
    <section className="border-b border-slate-100 px-6 py-8 sm:px-10">
      {'eyebrow' in section && section.eyebrow && <p className="text-xs font-bold uppercase tracking-widest text-red-700">{section.eyebrow}</p>}
      {'title' in section && <h2 className="mt-1 text-2xl font-bold text-slate-950">{section.title}</h2>}
      {'description' in section && section.description && <p className="mt-2 max-w-3xl leading-7 text-slate-600">{section.description}</p>}
      {section.type === 'copy' && <div className="mt-4 grid gap-2">{section.paragraphs.map((text, index) => <p key={index} className="leading-7 text-slate-700">{text}</p>)}{section.image && mediaUrls[section.image.storagePath] && <img className="mt-4 max-h-96 rounded-xl object-cover" src={mediaUrls[section.image.storagePath]} alt={section.image.altText} />}</div>}
      {section.type === 'cards' && <div className="mt-5 grid gap-4 md:grid-cols-2">{section.cards.map((card) => <div key={card.id} className="rounded-xl border border-slate-200 p-4">{card.image && mediaUrls[card.image.storagePath] && <img className="mb-3 aspect-video w-full rounded-lg object-cover" src={mediaUrls[card.image.storagePath]} alt={card.image.altText} />}<h3 className="font-bold">{card.title}</h3>{card.subtitle && <p className="text-sm text-slate-500">{card.subtitle}</p>}<p className="mt-2 text-sm leading-6 text-slate-600">{card.description}</p>{card.features?.map((feature) => <p key={feature} className="mt-1 text-sm text-slate-600">• {feature}</p>)}</div>)}</div>}
      {section.type === 'steps' && <div className="mt-5 grid gap-3 md:grid-cols-2">{section.steps.map((item) => <div key={item.id} className="rounded-xl bg-slate-50 p-4"><h3 className="font-bold">{item.title}</h3><p className="mt-1 text-sm text-slate-600">{item.description}</p></div>)}</div>}
      {section.type === 'statistics' && <div className="mt-5 flex flex-wrap gap-4">{section.statistics.map((item) => <div key={item.id} className="min-w-32 rounded-xl bg-slate-50 p-4"><strong className="block text-2xl">{item.value}</strong><span className="text-sm text-slate-600">{item.label}</span></div>)}</div>}
      {section.type === 'testimonials' && <div className="mt-5 grid gap-4 md:grid-cols-2">{section.testimonials.map((item) => <blockquote key={item.id} className="rounded-xl bg-slate-50 p-4"><p className="leading-6">“{item.quote}”</p><footer className="mt-3 text-sm font-semibold">{item.author} · {item.role} · {item.location}</footer><p className="text-xs text-amber-700">{'★'.repeat(item.rating)}</p></blockquote>)}</div>}
      {section.type === 'faq' && <div className="mt-4 divide-y divide-slate-200">{section.questions.map((item) => <div key={item.id} className="py-3"><h3 className="font-semibold">{item.question}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{item.answer}</p></div>)}</div>}
      {section.type === 'contact' && <div className="mt-4 grid gap-3 sm:grid-cols-2">{section.details.map((item) => <div key={item.id} className="rounded-xl bg-slate-50 p-3"><p className="text-xs font-bold uppercase text-slate-500">{item.label}</p><p className="mt-1">{item.value}</p></div>)}</div>}
      {section.type === 'form-intro' && <p className="mt-3 leading-7 text-slate-600">{section.description}</p>}
      {section.type === 'call-to-action' && <ActionLinks actions={section.actions} />}
    </section>
  );
}

function ActionLinks({ actions }: { actions: Array<{ label: string; href: string; style: string }> }) {
  return (
    <div className="mt-5 flex flex-wrap gap-3">
      {actions.map((action, index) => (
        <span key={`${index}-${action.href}`} className={`rounded-lg px-4 py-2.5 text-sm font-bold ${action.style === 'primary' ? 'bg-red-700 text-white' : action.style === 'secondary' ? 'border border-white/60 text-white' : 'text-white underline'}`}>
          {action.label || 'Button label'}
          <span className="ml-2 text-xs font-normal opacity-75">{action.href}</span>
        </span>
      ))}
    </div>
  );
}

