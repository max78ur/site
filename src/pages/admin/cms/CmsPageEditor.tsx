import { useCallback, useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Eye, Plus, RefreshCw, Save, Send, Trash2 } from 'lucide-react';
import type {
  CmsAction,
  CmsCardItem,
  CmsPageId,
  CmsSection,
} from '@/lib/cms/types';
import { createCmsSection, CMS_PAGES, CMS_PAGE_LABELS, moveItem } from './cmsEditorUtils';
import {
  CmsButton,
  CmsFeedback,
  CmsField,
  CmsLoading,
  CmsMediaPicker,
  CmsPageTitle,
  CmsPanel,
  CmsSelect,
} from './CmsUi';
import { useCmsPageDraft } from './useCmsPageDraft';
import {
  importCmsDraftPageIfMissing,
  loadCmsPublishedMedia,
  loadDraftPage,
} from '@/lib/cms/service';
import type { CmsMediaAsset } from '@/lib/cms/types';
import { auth } from '@/lib/firebase';
import { PREPARED_CMS_PAGE_DRAFTS } from './preparedPageDrafts';

const sectionTypes: Array<{ value: CmsSection['type']; label: string }> = [
  { value: 'hero', label: 'Hero' },
  { value: 'copy', label: 'Text / image' },
  { value: 'cards', label: 'Cards' },
  { value: 'steps', label: 'Steps' },
  { value: 'statistics', label: 'Statistics' },
  { value: 'testimonials', label: 'Testimonials' },
  { value: 'faq', label: 'FAQs' },
  { value: 'contact', label: 'Contact details' },
  { value: 'form-intro', label: 'Form introduction' },
  { value: 'call-to-action', label: 'Call to action' },
  { value: 'legal', label: 'Legal content' },
];

export default function CmsPageEditor() {
  const [pageId, setPageId] = useState<CmsPageId>('home');
  const draft = useCmsPageDraft(pageId);
  const [newSectionType, setNewSectionType] = useState<CmsSection['type']>('copy');
  const [media, setMedia] = useState<CmsMediaAsset[]>([]);
  const [mediaError, setMediaError] = useState('');

  const LEGAL_PAGE_IDS: CmsPageId[] = [
    'privacy-policy',
    'terms',
    'cookie-policy',
    'disclaimer',
    'service-agreement',
    'refund-cancellation-policy',
    'accessibility-statement',
    'data-security',
    'report-security-issue',
  ];

  const [importStatus, setImportStatus] = useState<
    'idle' | 'checking' | 'importing' | 'done'
  >('idle');
  const [pageStatuses, setPageStatuses] = useState<
    Record<CmsPageId, 'existing' | 'missing'>
  >({} as Record<CmsPageId, 'existing' | 'missing'>);
  const [report, setReport] = useState<{
    imported: string[];
    skipped: string[];
    failed: Array<{ pageId: string; error: string }>;
  } | null>(null);
  const [confirmImport, setConfirmImport] = useState(false);
  const [importSuccess, setImportSuccess] = useState('');

  const existingCount = Object.values(pageStatuses).filter(
    (status) => status === 'existing',
  ).length;
  const missingCount = Object.values(pageStatuses).filter(
    (status) => status === 'missing',
  ).length;
  const isBusy = importStatus === 'checking' || importStatus === 'importing';

  useEffect(() => {
    let active = true;
    loadCmsPublishedMedia()
      .then((items) => {
        if (active) setMedia(items);
      })
      .catch((cause: unknown) => {
        if (active) setMediaError(cause instanceof Error ? cause.message : 'Media could not be loaded.');
      });
    return () => {
      active = false;
    };
  }, []);

  const checkPreparedDraftStatus = useCallback(async () => {
    setImportStatus('checking');
    setReport(null);
    setConfirmImport(false);
    const statuses: Record<CmsPageId, 'existing' | 'missing'> = {} as Record<
      CmsPageId,
      'existing' | 'missing'
    >;
    for (const pageId of Object.keys(PREPARED_CMS_PAGE_DRAFTS) as CmsPageId[]) {
      try {
        const draft = await loadDraftPage(pageId);
        statuses[pageId] = draft ? 'existing' : 'missing';
      } catch {
        statuses[pageId] = 'missing';
      }
    }
    setPageStatuses(statuses);
    setImportStatus('idle');
  }, []);

  const importPreparedDrafts = useCallback(async () => {
    const actorUid = auth.currentUser?.uid;
    if (!actorUid) {
      draft.setError('Your admin session is no longer available. Sign in again before importing.');
      return;
    }
    const missing = Object.keys(pageStatuses)
      .filter((pid) => pageStatuses[pid as CmsPageId] === 'missing')
      .map((pid) => pid as CmsPageId);

    if (missing.length === 0) {
      setReport({ imported: [], skipped: [], failed: [] });
      setImportStatus('done');
      setImportSuccess('All prepared drafts already exist. Nothing to import.');
      return;
    }

    setImportStatus('importing');
    const imported: string[] = [];
    const skipped: string[] = [];
    const failed: Array<{ pageId: string; error: string }> = [];

    for (const pageId of missing) {
      try {
        const content = PREPARED_CMS_PAGE_DRAFTS[pageId as CmsPageId];
        const result = await importCmsDraftPageIfMissing(pageId, content, actorUid);
        if (result.status === 'imported') {
          imported.push(pageId);
        } else {
          skipped.push(pageId);
        }
      } catch (cause) {
        failed.push({
          pageId,
          error: cause instanceof Error ? cause.message : 'Import failed.',
        });
      }
    }

    setReport({ imported, skipped, failed });
    setImportStatus('done');
    setImportSuccess(
      `Import complete: ${imported.length} imported, ${skipped.length} skipped, ${failed.length} failed.`,
    );
  }, [pageStatuses, draft, auth]);

  const retryFailedImports = useCallback(async () => {
    if (!report?.failed.length) return;
    const actorUid = auth.currentUser?.uid;
    if (!actorUid) {
      draft.setError('Your admin session is no longer available. Sign in again before retrying.');
      return;
    }

    setImportStatus('importing');
    const imported: string[] = [];
    const skipped: string[] = [];
    const failed2: Array<{ pageId: string; error: string }> = [];

    for (const { pageId } of report.failed) {
      try {
        const content = PREPARED_CMS_PAGE_DRAFTS[pageId as CmsPageId];
        const result = await importCmsDraftPageIfMissing(pageId as CmsPageId, content, actorUid);
        if (result.status === 'imported') {
          imported.push(pageId);
        } else {
          skipped.push(pageId);
        }
      } catch (cause) {
        failed2.push({
          pageId,
          error: cause instanceof Error ? cause.message : 'Import failed.',
        });
      }
    }

    setReport({
      imported,
      skipped: [...(report.skipped ?? []), ...skipped],
      failed: failed2,
    });
    setImportStatus('done');
    setImportSuccess(
      `Retry complete: ${imported.length} imported, ${skipped.length} skipped, ${failed2.length} failed.`,
    );
  }, [report, draft, auth]);

  useEffect(() => {
    void checkPreparedDraftStatus();
  }, [checkPreparedDraftStatus]);

  if (!draft.content) return <CmsFeedback message={`Page draft could not be loaded: ${draft.error}`} />;

  function updateSection(index: number, section: CmsSection) {
    if (!draft.content) return;
    const sections = [...draft.content.sections];
    sections[index] = section;
    draft.setContent({ ...draft.content, sections });
  }

  return (
    <div>
      <CmsPageTitle
        title="Pages & sections"
        description="Edit CMS page metadata and sections, change their order, and control whether each section is enabled in the draft."
        actions={
          <div className="flex flex-wrap gap-2">
            <CmsButton variant="secondary" onClick={draft.preview} disabled={draft.busy}><Eye size={16} /> Preview</CmsButton>
            <CmsButton variant="secondary" onClick={() => void draft.save()} disabled={draft.busy}><Save size={16} /> Save draft</CmsButton>
            <CmsButton onClick={() => void draft.publish()} disabled={draft.busy}><Send size={16} /> Publish</CmsButton>
          </div>
        }
      />
      {draft.error && <div className="mb-4"><CmsFeedback message={draft.error} /></div>}
      {draft.success && <div className="mb-4"><CmsFeedback message={draft.success} variant="success" /></div>}
      {mediaError && <div className="mb-4"><CmsFeedback message={`Published media could not be loaded: ${mediaError}`} /></div>}

      <div className="grid gap-5">
        <CmsPanel title="Select page">
          <div className="grid gap-4 md:grid-cols-2">
            <CmsSelect
              label="Website page"
              value={pageId}
              onChange={(value) => {
                const selected = CMS_PAGES.find((page) => page.id === value);
                if (selected) setPageId(selected.id);
              }}
              options={CMS_PAGES.map((page) => ({ value: page.id, label: page.label }))}
            />
            <p className="self-end text-sm leading-6 text-slate-600">
              Saving creates a private draft. Public visitors continue to see the last published content or the existing fallback; publishing updates only this page.
            </p>
          </div>
        </CmsPanel>

        <CmsPanel title="Search metadata" description="Applied to this page on the public website after it is published.">
          <div className="grid gap-4 md:grid-cols-2">
            <CmsField label="Page title" value={draft.content.seo.title} onChange={(title) => draft.setContent({ ...draft.content!, seo: { ...draft.content!.seo, title } })} />
            <CmsField label="Canonical path" value={draft.content.seo.canonicalPath} onChange={(canonicalPath) => draft.setContent({ ...draft.content!, seo: { ...draft.content!.seo, canonicalPath } })} />
            <div className="md:col-span-2">
              <CmsField label="Meta description" value={draft.content.seo.description} onChange={(description) => draft.setContent({ ...draft.content!, seo: { ...draft.content!.seo, description } })} multiline />
            </div>
          </div>
        </CmsPanel>

        <CmsPanel title="Sections" description="Sections are saved in their displayed order. Disabled sections remain in the draft but are marked inactive.">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row">
            <div className="min-w-0 flex-1">
              <CmsSelect label="New section type" value={newSectionType} onChange={(value) => {
                const match = sectionTypes.find((option) => option.value === value);
                if (match) setNewSectionType(match.value);
              }} options={sectionTypes} />
            </div>
            <CmsButton
              onClick={() => draft.setContent({ ...draft.content!, sections: [...draft.content!.sections, createCmsSection(newSectionType)] })}
            >
              <Plus size={16} /> Add section
            </CmsButton>
          </div>
          <div className="grid gap-4">
            {draft.content.sections.map((section, index) => (
              <section key={section.id} className="rounded-2xl border border-slate-200">
                <header className="flex flex-wrap items-center gap-2 border-b border-slate-100 p-3 sm:p-4">
                  <span className="mr-auto text-sm font-bold capitalize text-slate-950">
                    {section.type.replace(/-/g, ' ')}
                    <span className="ml-2 text-xs font-medium text-slate-500">#{index + 1}</span>
                  </span>
                  <button type="button" aria-label="Move section up" disabled={index === 0} onClick={() => draft.setContent({ ...draft.content!, sections: moveItem(draft.content!.sections, index, -1) })} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-30"><ArrowUp size={16} /></button>
                  <button type="button" aria-label="Move section down" disabled={index === draft.content!.sections.length - 1} onClick={() => draft.setContent({ ...draft.content!, sections: moveItem(draft.content!.sections, index, 1) })} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-30"><ArrowDown size={16} /></button>
                  <label className="flex items-center gap-2 px-2 text-xs font-semibold text-slate-700">
                    <input type="checkbox" checked={section.enabled} onChange={(event) => updateSection(index, { ...section, enabled: event.target.checked })} />
                    Enabled
                  </label>
                  <button type="button" aria-label="Delete section" onClick={() => draft.setContent({ ...draft.content!, sections: draft.content!.sections.filter((_, i) => i !== index) })} className="rounded-lg p-2 text-red-700 hover:bg-red-50"><Trash2 size={16} /></button>
                </header>
                <div className="p-3 sm:p-4">
                  <SectionFields section={section} media={media} onChange={(next) => updateSection(index, next)} />
                </div>
              </section>
            ))}
            {draft.content.sections.length === 0 && (
              <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-600">
                This CMS page has no sections yet. Add one above; existing public content remains unchanged.
              </p>
            )}
          </div>
        </CmsPanel>

        <CmsPanel
          title="Prepared Drafts Import"
          description="Import prepared CMS page drafts into Firestore drafts. Existing drafts are never overwritten. Legal drafts are attorney-review templates requiring qualified U.S. attorney review before publication. Nothing is published."
        >
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-slate-950">
                {importStatus === 'checking'
                  ? 'Checking draft status…'
                  : importStatus === 'importing'
                    ? 'Importing…'
                    : 'Ready to import'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-600">Existing:</span>
              <span className="font-semibold text-emerald-700">{existingCount}</span>
              <span className="text-slate-600">Missing:</span>
              <span className="font-semibold text-amber-700">{missingCount}</span>
            </div>
            <div className="flex gap-2">
              <CmsButton
                variant="secondary"
                onClick={checkPreparedDraftStatus}
                disabled={isBusy}
              >
                <RefreshCw size={16} /> Refresh status
              </CmsButton>
              {missingCount > 0 && (
                <CmsButton
                  onClick={() => setConfirmImport(true)}
                  disabled={isBusy}
                >
                  Import missing prepared drafts
                </CmsButton>
              )}
            </div>
          </div>

          {confirmImport && missingCount > 0 && (
            <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm text-amber-900">
                This will create Firestore drafts for <strong>{missingCount}</strong> prepared page(s) that do
                not yet have a draft. Existing drafts will be skipped and never overwritten. Legal pages are
                attorney-review templates, not final policies. This does not publish anything.
              </p>
              <div className="mt-3 flex gap-2">
                <CmsButton variant="secondary" onClick={() => setConfirmImport(false)}>
                  Cancel
                </CmsButton>
                <CmsButton
                  onClick={() => {
                    setConfirmImport(false);
                    void importPreparedDrafts();
                  }}
                >
                  Confirm import
                </CmsButton>
              </div>
            </div>
          )}

          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left pb-2 text-slate-600">Page</th>
                <th className="text-left pb-2 text-slate-600">Status</th>
                <th className="text-left pb-2 text-slate-600">Notes</th>
              </tr>
            </thead>
            <tbody>
              {CMS_PAGES.map((page) => {
                const status = pageStatuses[page.id];
                const isLegal = LEGAL_PAGE_IDS.includes(page.id as CmsPageId);
                return (
                  <tr key={page.id} className="border-b border-slate-100">
                    <td className="py-2">
                      <span className="font-medium text-slate-900">
                        {CMS_PAGE_LABELS[page.id]}
                      </span>
                      {isLegal && (
                        <span className="ml-2 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs text-amber-800">
                          ⚖️ Attorney review
                        </span>
                      )}
                    </td>
                    <td className="py-2">
                      {status === 'existing' ? (
                        <span className="text-emerald-700">✓ Existing draft</span>
                      ) : status === 'missing' ? (
                        <span className="text-amber-700">○ Missing — ready to import</span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="py-2 text-slate-500">
                      {isLegal
                        ? 'Review template — requires qualified U.S. attorney review before publication.'
                        : 'Prepared draft content.'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {report && importStatus === 'done' && (
            <div className="mt-4 rounded-xl border p-4">
              <h3 className="font-bold text-slate-950 mb-2">Import report</h3>
              <div className="flex gap-4 text-sm mb-3">
                <span
                  className={`font-semibold ${
                    report.imported.length ? 'text-emerald-700' : 'text-slate-600'
                  }`}
                >
                  {report.imported.length} imported
                </span>
                <span
                  className={`font-semibold ${
                    report.skipped.length ? 'text-amber-700' : 'text-slate-600'
                  }`}
                >
                  {report.skipped.length} skipped
                </span>
                <span
                  className={`font-semibold ${
                    report.failed.length ? 'text-red-700' : 'text-slate-600'
                  }`}
                >
                  {report.failed.length} failed
                </span>
              </div>
              {report.imported.length && (
                <div className="mb-3">
                  <span className="text-xs font-bold text-emerald-700">Imported:</span>
                  <ul className="list-disc list-inside text-sm text-slate-700 mt-1">
                    {report.imported.map((pid) => (
                      <li key={pid}>
                        {CMS_PAGE_LABELS[pid as CmsPageId]}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {report.skipped.length && (
                <div className="mb-3">
                  <span className="text-xs font-bold text-amber-700">
                    Skipped (already existing):
                  </span>
                  <ul className="list-disc list-inside text-sm text-slate-700 mt-1">
                    {report.skipped.map((pid) => (
                      <li key={pid}>
                        {CMS_PAGE_LABELS[pid as CmsPageId]}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {report.failed.length && (
                <div className="mb-3">
                  <span className="text-xs font-bold text-red-700">Failed:</span>
                  <ul className="list-disc list-inside text-sm text-slate-700 mt-1">
                    {report.failed.map((f) => (
                      <li key={f.pageId}>
                        {CMS_PAGE_LABELS[f.pageId as CmsPageId]} — {f.error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {report.failed.length && (
                <CmsButton
                  variant="secondary"
                  onClick={retryFailedImports}
                  disabled={isBusy}
                >
                  <RefreshCw size={16} /> Retry failed imports
                </CmsButton>
              )}
            </div>
          )}
        </CmsPanel>
      </div>
    </div>
  );
}

function SectionFields({
  section,
  media,
  onChange,
}: {
  section: CmsSection;
  media: CmsMediaAsset[];
  onChange: (section: CmsSection) => void;
}) {
  const commonTitle = 'title' in section && section.type !== 'hero'
    ? <CmsField label="Section heading" value={section.title} onChange={(title) => onChange({ ...section, title })} />
    : null;
  const eyebrow = 'eyebrow' in section
    ? <CmsField label="Eyebrow" value={section.eyebrow ?? ''} onChange={(eyebrow) => onChange({ ...section, eyebrow })} />
    : null;
  const description = 'description' in section && section.type !== 'hero'
    ? <CmsField label="Description" value={section.description ?? ''} onChange={(description) => onChange({ ...section, description })} multiline />
    : null;

  return (
    <div className="grid gap-4">
      {eyebrow}
      {commonTitle}
      {description}
      {section.type === 'hero' && (
        <>
          <CmsField label="Hero title" value={section.title} onChange={(title) => onChange({ ...section, title })} />
          <CmsField label="Hero description" value={section.description} onChange={(value) => onChange({ ...section, description: value })} multiline />
          <CmsMediaPicker label="Background video" assets={media} value={section.backgroundVideo} accept="video" onChange={(backgroundVideo) => onChange({ ...section, backgroundVideo })} />
          <CmsMediaPicker label="Poster image" assets={media} value={section.poster} accept="image" onChange={(poster) => onChange({ ...section, poster })} />
          <CmsMediaPicker label="Background image (optional)" assets={media} value={section.backgroundImage} accept="image" onChange={(backgroundImage) => onChange({ ...section, backgroundImage })} />
          <ActionFields actions={section.actions} onChange={(actions) => onChange({ ...section, actions })} />
        </>
      )}
      {section.type === 'copy' && (
        <>
          <CmsField label="Paragraphs (one per line)" value={section.paragraphs.join('\n')} onChange={(value) => onChange({ ...section, paragraphs: value.split('\n') })} multiline />
          <CmsMediaPicker label="Section image" assets={media} value={section.image} accept="image" onChange={(image) => onChange({ ...section, image })} />
        </>
      )}
      {section.type === 'cards' && (
        <div className="grid gap-3">
          <div className="flex justify-end"><CmsButton variant="secondary" onClick={() => onChange({ ...section, cards: [...section.cards, { id: crypto.randomUUID(), title: '', description: '' }] })}><Plus size={15} /> Add card</CmsButton></div>
          {section.cards.map((card, index) => <CardFields key={card.id} card={card} media={media} onChange={(next) => onChange({ ...section, cards: section.cards.map((item, i) => i === index ? next : item) })} onRemove={() => onChange({ ...section, cards: section.cards.filter((_, i) => i !== index) })} />)}
        </div>
      )}
      {section.type === 'steps' && (
        <div className="grid gap-3">
          <div className="flex justify-end"><CmsButton variant="secondary" onClick={() => onChange({ ...section, steps: [...section.steps, { id: crypto.randomUUID(), title: '', description: '' }] })}><Plus size={15} /> Add step</CmsButton></div>
          {section.steps.map((item, index) => <ItemFields key={item.id} title={`Step ${index + 1}`} values={[['Title', item.title], ['Description', item.description]]} onUpdate={(i, value) => onChange({ ...section, steps: section.steps.map((entry, n) => n === index ? { ...entry, [i === 0 ? 'title' : 'description']: value } : entry) })} onRemove={() => onChange({ ...section, steps: section.steps.filter((_, n) => n !== index) })} />)}
        </div>
      )}
      {section.type === 'statistics' && (
        <div className="grid gap-3">
          <div className="flex justify-end"><CmsButton variant="secondary" onClick={() => onChange({ ...section, statistics: [...section.statistics, { id: crypto.randomUUID(), value: '', label: '' }] })}><Plus size={15} /> Add statistic</CmsButton></div>
          {section.statistics.map((item, index) => <ItemFields key={item.id} title={`Statistic ${index + 1}`} values={[['Value', item.value], ['Label', item.label]]} onUpdate={(i, value) => onChange({ ...section, statistics: section.statistics.map((entry, n) => n === index ? { ...entry, [i === 0 ? 'value' : 'label']: value } : entry) })} onRemove={() => onChange({ ...section, statistics: section.statistics.filter((_, n) => n !== index) })} />)}
        </div>
      )}
      {section.type === 'testimonials' && (
        <div className="grid gap-3">
          <div className="flex justify-end"><CmsButton variant="secondary" onClick={() => onChange({ ...section, testimonials: [...section.testimonials, { id: crypto.randomUUID(), quote: '', author: '', role: '', location: '', rating: 5 }] })}><Plus size={15} /> Add testimonial</CmsButton></div>
          {section.testimonials.map((item, index) => (
            <div key={item.id} className="grid gap-3 rounded-xl border border-slate-200 p-3 md:grid-cols-2">
              <CmsField label="Quote" value={item.quote} onChange={(quote) => onChange({ ...section, testimonials: section.testimonials.map((entry, n) => n === index ? { ...entry, quote } : entry) })} multiline />
              <div className="grid gap-3">
                <CmsField label="Author" value={item.author} onChange={(author) => onChange({ ...section, testimonials: section.testimonials.map((entry, n) => n === index ? { ...entry, author } : entry) })} />
                <CmsField label="Role" value={item.role} onChange={(role) => onChange({ ...section, testimonials: section.testimonials.map((entry, n) => n === index ? { ...entry, role } : entry) })} />
                <CmsField label="Location" value={item.location} onChange={(location) => onChange({ ...section, testimonials: section.testimonials.map((entry, n) => n === index ? { ...entry, location } : entry) })} />
                <CmsField label="Rating (1–5)" type="number" min={1} max={5} value={item.rating} onChange={(rating) => onChange({ ...section, testimonials: section.testimonials.map((entry, n) => n === index ? { ...entry, rating: Number(rating) } : entry) })} />
              </div>
              <div className="md:col-span-2 flex justify-end"><CmsButton variant="danger" onClick={() => onChange({ ...section, testimonials: section.testimonials.filter((_, n) => n !== index) })}><Trash2 size={14} /> Remove</CmsButton></div>
            </div>
          ))}
        </div>
      )}
      {section.type === 'faq' && (
        <div className="grid gap-3">
          <div className="flex justify-end"><CmsButton variant="secondary" onClick={() => onChange({ ...section, questions: [...section.questions, { id: crypto.randomUUID(), question: '', answer: '' }] })}><Plus size={15} /> Add question</CmsButton></div>
          {section.questions.map((item, index) => <div key={item.id} className="grid gap-3 rounded-xl border border-slate-200 p-3 md:grid-cols-2">
            <CmsField label="Question" value={item.question} onChange={(question) => onChange({ ...section, questions: section.questions.map((entry, n) => n === index ? { ...entry, question } : entry) })} />
            <CmsField label="Answer" value={item.answer} onChange={(answer) => onChange({ ...section, questions: section.questions.map((entry, n) => n === index ? { ...entry, answer } : entry) })} multiline />
            <div className="md:col-span-2 flex justify-end"><CmsButton variant="danger" onClick={() => onChange({ ...section, questions: section.questions.filter((_, n) => n !== index) })}><Trash2 size={14} /> Remove</CmsButton></div>
          </div>)}
        </div>
      )}
      {section.type === 'contact' && (
        <div className="grid gap-3">
          <div className="flex justify-end"><CmsButton variant="secondary" onClick={() => onChange({ ...section, details: [...section.details, { id: crypto.randomUUID(), label: '', value: '' }] })}><Plus size={15} /> Add detail</CmsButton></div>
          {section.details.map((item, index) => <ItemFields key={item.id} title={`Contact detail ${index + 1}`} values={[['Label', item.label], ['Value', item.value]]} onUpdate={(i, value) => onChange({ ...section, details: section.details.map((entry, n) => n === index ? { ...entry, [i === 0 ? 'label' : 'value']: value } : entry) })} onRemove={() => onChange({ ...section, details: section.details.filter((_, n) => n !== index) })} />)}
        </div>
      )}
      {section.type === 'form-intro' && (
        <CmsField label="Form introduction" value={section.description} onChange={(description) => onChange({ ...section, description })} multiline />
      )}
      {section.type === 'call-to-action' && (
        <ActionFields actions={section.actions} onChange={(actions) => onChange({ ...section, actions })} />
      )}
      {section.type === 'legal' && (
        <div className="grid gap-3">
          <div className="flex justify-end"><CmsButton variant="secondary" onClick={() => onChange({ ...section, blocks: [...section.blocks, { id: crypto.randomUUID(), heading: '', paragraphs: [] }] })}><Plus size={15} /> Add legal block</CmsButton></div>
          {section.blocks.map((item, index) => <div key={item.id} className="grid gap-3 rounded-xl border border-slate-200 p-3">
            <CmsField label={`Block ${index + 1} heading`} value={item.heading} onChange={(heading) => onChange({ ...section, blocks: section.blocks.map((entry, n) => n === index ? { ...entry, heading } : entry) })} />
            <CmsField label="Paragraphs (one per line)" value={item.paragraphs.join('\n')} onChange={(value) => onChange({ ...section, blocks: section.blocks.map((entry, n) => n === index ? { ...entry, paragraphs: value.split('\n') } : entry) })} multiline />
            <div className="flex justify-end"><CmsButton variant="danger" onClick={() => onChange({ ...section, blocks: section.blocks.filter((_, n) => n !== index) })}><Trash2 size={14} /> Remove</CmsButton></div>
          </div>)}
        </div>
      )}
    </div>
  );
}

function ActionFields({ actions, onChange }: { actions: CmsAction[]; onChange: (actions: CmsAction[]) => void }) {
  return (
    <div className="grid gap-3 rounded-xl bg-slate-50 p-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-slate-800">Buttons</h3>
        <CmsButton variant="secondary" disabled={actions.length >= 2} onClick={() => onChange([...actions, { label: '', href: '/', style: 'primary' }])}><Plus size={14} /> Add button</CmsButton>
      </div>
      {actions.map((action, index) => <div key={`${index}-${action.href}`} className="grid gap-3 md:grid-cols-[1fr_1fr_140px_auto]">
        <CmsField label="Label" value={action.label} onChange={(label) => onChange(actions.map((entry, i) => i === index ? { ...entry, label } : entry))} />
        <CmsField label="Link" value={action.href} onChange={(href) => onChange(actions.map((entry, i) => i === index ? { ...entry, href } : entry))} />
        <CmsSelect label="Style" value={action.style} onChange={(style) => {
          if (style === 'primary' || style === 'secondary' || style === 'text') onChange(actions.map((entry, i) => i === index ? { ...entry, style } : entry));
        }} options={[{ value: 'primary', label: 'Primary' }, { value: 'secondary', label: 'Secondary' }, { value: 'text', label: 'Text' }]} />
        <button type="button" aria-label="Remove button" onClick={() => onChange(actions.filter((_, i) => i !== index))} className="self-end rounded-lg p-2 text-red-700 hover:bg-red-50"><Trash2 size={16} /></button>
      </div>)}
    </div>
  );
}

function CardFields({
  card,
  media,
  onChange,
  onRemove,
}: {
  card: CmsCardItem;
  media: CmsMediaAsset[];
  onChange: (card: CmsCardItem) => void;
  onRemove: () => void;
}) {
  return (
    <div className="grid gap-3 rounded-xl border border-slate-200 p-3 md:grid-cols-2">
      <CmsField label="Title" value={card.title} onChange={(title) => onChange({ ...card, title })} />
      <CmsField label="Subtitle" value={card.subtitle ?? ''} onChange={(subtitle) => onChange({ ...card, subtitle })} />
      <CmsField label="Description" value={card.description} onChange={(description) => onChange({ ...card, description })} multiline />
      <div className="grid gap-3">
        <CmsField label="Link (optional)" value={card.href ?? ''} onChange={(href) => onChange({ ...card, href: href || undefined })} />
        <CmsField label="Features (one per line)" value={card.features?.join('\n') ?? ''} onChange={(value) => onChange({ ...card, features: value ? value.split('\n') : undefined })} multiline />
      </div>
      <div className="md:col-span-2"><CmsMediaPicker label="Image" assets={media} value={card.image} accept="image" onChange={(image) => onChange({ ...card, image })} /></div>
      <div className="md:col-span-2 flex justify-end"><CmsButton variant="danger" onClick={onRemove}><Trash2 size={14} /> Remove card</CmsButton></div>
    </div>
  );
}

function ItemFields({
  title,
  values,
  onUpdate,
  onRemove,
}: {
  title: string;
  values: Array<[string, string]>;
  onUpdate: (index: number, value: string) => void;
  onRemove: () => void;
}) {
  return (
    <div className="grid gap-3 rounded-xl border border-slate-200 p-3 md:grid-cols-[1fr_1fr_auto]">
      {values.map(([label, value], index) => <CmsField key={label} label={label} value={value} onChange={(next) => onUpdate(index, next)} multiline={label === 'Description'} />)}
      <div className="flex items-end justify-between gap-3 md:col-span-3">
        <span className="text-xs font-semibold text-slate-500">{title}</span>
        <CmsButton variant="danger" onClick={onRemove}><Trash2 size={14} /> Remove</CmsButton>
      </div>
    </div>
  );
}

