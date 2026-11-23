import { useState } from 'react';
import { Eye, Plus, Save, Send, Trash2 } from 'lucide-react';
import type {
  CmsCardsSection,
  CmsFaqSection,
  CmsPageId,
  CmsSection,
  CmsTestimonialsSection,
} from '@/lib/cms/types';
import { auth } from '@/lib/firebase';
import { loadCmsPublishedMedia, saveCmsDraftPage } from '@/lib/cms/service';
import type { CmsMediaAsset } from '@/lib/cms/types';
import { CmsButton, CmsFeedback, CmsField, CmsLoading, CmsMediaPicker, CmsPageTitle, CmsPanel } from './CmsUi';
import { createCmsSection, errorMessage } from './cmsEditorUtils';
import { useCmsPageDraft } from './useCmsPageDraft';
import { useCmsSettingsDraft } from './useCmsSettingsDraft';
import { useEffect } from 'react';

type ContentTab = 'services' | 'testimonials' | 'faq' | 'site';
const tabs: Array<{ id: ContentTab; label: string }> = [
  { id: 'services', label: 'Services' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'faq', label: 'FAQs' },
  { id: 'site', label: 'Navbar, footer & contact' },
];

export default function CmsContentEditor() {
  const [tab, setTab] = useState<ContentTab>('services');
  const pageId: CmsPageId = tab === 'services' ? 'services' : tab === 'testimonials' ? 'home' : 'faq';
  const pageDraft = useCmsPageDraft(pageId);
  const settingsDraft = useCmsSettingsDraft();
  const [media, setMedia] = useState<CmsMediaAsset[]>([]);
  const [mediaError, setMediaError] = useState('');
  const [pageSaving, setPageSaving] = useState(false);
  const [pageError, setPageError] = useState('');
  const [pageSuccess, setPageSuccess] = useState('');

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

  const loading = tab === 'site' ? settingsDraft.loading : pageDraft.loading;
  if (loading) return <CmsLoading />;
  if (tab === 'site' && !settingsDraft.content) {
    return <CmsFeedback message={`Global settings draft could not be loaded: ${settingsDraft.error}`} />;
  }
  if (tab !== 'site' && !pageDraft.content) {
    return <CmsFeedback message={`Content draft could not be loaded: ${pageDraft.error}`} />;
  }

  async function saveContentPage() {
    if (!pageDraft.content) return;
    const actorUid = auth.currentUser?.uid;
    if (!actorUid) {
      setPageError('Your admin session is no longer available. Sign in again before saving.');
      return;
    }
    setPageSaving(true);
    setPageError('');
    setPageSuccess('');
    try {
      await saveCmsDraftPage(pageId, pageDraft.content, actorUid);
      setPageSuccess('Content draft saved to Firebase.');
    } catch (cause) {
      setPageError(errorMessage(cause));
    } finally {
      setPageSaving(false);
    }
  }

  return (
    <div>
      <CmsPageTitle
        title="Content manager"
        description="Manage structured service, testimonial and FAQ content, plus the shared navigation, footer and contact settings."
        actions={tab === 'site' && settingsDraft.content ? (
          <div className="flex flex-wrap gap-2">
            <CmsButton variant="secondary" onClick={() => void settingsDraft.save()} disabled={settingsDraft.busy}><Save size={16} /> Save draft</CmsButton>
            <CmsButton onClick={() => void settingsDraft.publish()} disabled={settingsDraft.busy}><Send size={16} /> Publish</CmsButton>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <CmsButton variant="secondary" onClick={pageDraft.preview} disabled={!pageDraft.content}><Eye size={16} /> Preview</CmsButton>
            <CmsButton variant="secondary" onClick={() => void saveContentPage()} disabled={pageSaving || !pageDraft.content}><Save size={16} /> Save draft</CmsButton>
            <CmsButton onClick={() => void pageDraft.publish()} disabled={pageDraft.busy || !pageDraft.content}><Send size={16} /> Publish</CmsButton>
          </div>
        )}
      />
      <div className="mb-5 flex flex-wrap gap-2 border-b border-slate-200 pb-3" role="tablist" aria-label="Content editor sections">
        {tabs.map((item) => (
          <button key={item.id} type="button" role="tab" aria-selected={tab === item.id} onClick={() => setTab(item.id)} className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition ${tab === item.id ? 'bg-slate-950 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'site' && settingsDraft.content ? (
        <SiteChromeEditor
          content={settingsDraft.content}
          setContent={settingsDraft.setContent}
          error={settingsDraft.error}
          success={settingsDraft.success}
        />
      ) : pageDraft.content ? (
        <>
          {(pageError || pageDraft.error) && <div className="mb-4"><CmsFeedback message={pageError || pageDraft.error} /></div>}
          {(pageSuccess || pageDraft.success) && <div className="mb-4"><CmsFeedback message={pageSuccess || pageDraft.success} variant="success" /></div>}
          {mediaError && <div className="mb-4"><CmsFeedback message={`Published media could not be loaded: ${mediaError}`} /></div>}
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm leading-5 text-blue-900">
            <span>This editor writes a CMS draft only. Existing public website content and page components are unchanged in this phase.</span>
          </div>
          {tab === 'services' && <ServicesEditor content={pageDraft.content} setContent={pageDraft.setContent} media={media} />}
          {tab === 'testimonials' && <TestimonialsEditor content={pageDraft.content} setContent={pageDraft.setContent} />}
          {tab === 'faq' && <FaqEditor content={pageDraft.content} setContent={pageDraft.setContent} />}
        </>
      ) : null}
    </div>
  );
}

function ServicesEditor({
  content,
  setContent,
  media,
}: {
  content: NonNullable<ReturnType<typeof useCmsPageDraft>['content']>;
  setContent: (content: NonNullable<ReturnType<typeof useCmsPageDraft>['content']>) => void;
  media: CmsMediaAsset[];
}) {
  const section = content.sections.find((item): item is CmsCardsSection => item.type === 'cards');
  const current = section ?? createCmsSection('cards');
  const update = (next: CmsCardsSection) => {
    const found = content.sections.some((item) => item.id === next.id);
    setContent({ ...content, sections: found ? content.sections.map((item) => item.id === next.id ? next : item) : [...content.sections, next] });
  };
  return (
    <CmsPanel title="Services" description="Create service cards with links and optional published images.">
      <div className="grid gap-4">
        <CmsField label="Section heading" value={current.title} onChange={(title) => update({ ...current, title })} />
        <CmsField label="Introductory description" value={current.description ?? ''} onChange={(description) => update({ ...current, description })} multiline />
        <div className="flex justify-end"><CmsButton variant="secondary" onClick={() => update({ ...current, cards: [...current.cards, { id: crypto.randomUUID(), title: '', description: '' }] })}><Plus size={15} /> Add service</CmsButton></div>
        {current.cards.map((card, index) => (
          <div key={card.id} className="grid gap-3 rounded-xl border border-slate-200 p-4 md:grid-cols-2">
            <CmsField label="Service name" value={card.title} onChange={(title) => update({ ...current, cards: current.cards.map((item, i) => i === index ? { ...item, title } : item) })} />
            <CmsField label="Link" value={card.href ?? ''} onChange={(href) => update({ ...current, cards: current.cards.map((item, i) => i === index ? { ...item, href: href || undefined } : item) })} />
            <CmsField label="Description" value={card.description} onChange={(description) => update({ ...current, cards: current.cards.map((item, i) => i === index ? { ...item, description } : item) })} multiline />
            <CmsField label="Features (one per line)" value={card.features?.join('\n') ?? ''} onChange={(value) => update({ ...current, cards: current.cards.map((item, i) => i === index ? { ...item, features: value ? value.split('\n') : undefined } : item) })} multiline />
            <div className="md:col-span-2"><CmsMediaPicker label="Service image" assets={media} value={card.image} accept="image" onChange={(image) => update({ ...current, cards: current.cards.map((item, i) => i === index ? { ...item, image } : item) })} /></div>
            <div className="md:col-span-2 flex justify-end"><CmsButton variant="danger" onClick={() => update({ ...current, cards: current.cards.filter((_, i) => i !== index) })}><Trash2 size={14} /> Remove service</CmsButton></div>
          </div>
        ))}
        {current.cards.length === 0 && <p className="text-sm text-slate-500">No CMS service entries yet. The current public services remain unchanged.</p>}
      </div>
    </CmsPanel>
  );
}

function TestimonialsEditor({
  content,
  setContent,
}: {
  content: NonNullable<ReturnType<typeof useCmsPageDraft>['content']>;
  setContent: (content: NonNullable<ReturnType<typeof useCmsPageDraft>['content']>) => void;
}) {
  const section = content.sections.find((item): item is CmsTestimonialsSection => item.type === 'testimonials');
  const current = section ?? createCmsSection('testimonials');
  const update = (next: CmsTestimonialsSection) => {
    const found = content.sections.some((item) => item.id === next.id);
    setContent({ ...content, sections: found ? content.sections.map((item) => item.id === next.id ? next : item) : [...content.sections, next] });
  };
  return (
    <CmsPanel title="Testimonials" description="Manage quote text, attribution and rating in the homepage CMS draft.">
      <div className="grid gap-4">
        <CmsField label="Section heading" value={current.title} onChange={(title) => update({ ...current, title })} />
        <CmsField label="Section description" value={current.description ?? ''} onChange={(description) => update({ ...current, description })} multiline />
        <div className="flex justify-end"><CmsButton variant="secondary" onClick={() => update({ ...current, testimonials: [...current.testimonials, { id: crypto.randomUUID(), quote: '', author: '', role: '', location: '', rating: 5 }] })}><Plus size={15} /> Add testimonial</CmsButton></div>
        {current.testimonials.map((item, index) => (
          <div key={item.id} className="grid gap-3 rounded-xl border border-slate-200 p-4 md:grid-cols-2">
            <CmsField label="Quote" value={item.quote} onChange={(quote) => update({ ...current, testimonials: current.testimonials.map((entry, i) => i === index ? { ...entry, quote } : entry) })} multiline />
            <div className="grid gap-3">
              <CmsField label="Author" value={item.author} onChange={(author) => update({ ...current, testimonials: current.testimonials.map((entry, i) => i === index ? { ...entry, author } : entry) })} />
              <CmsField label="Role" value={item.role} onChange={(role) => update({ ...current, testimonials: current.testimonials.map((entry, i) => i === index ? { ...entry, role } : entry) })} />
              <CmsField label="Location" value={item.location} onChange={(location) => update({ ...current, testimonials: current.testimonials.map((entry, i) => i === index ? { ...entry, location } : entry) })} />
              <CmsField label="Rating (1–5)" type="number" min={1} max={5} value={item.rating} onChange={(rating) => update({ ...current, testimonials: current.testimonials.map((entry, i) => i === index ? { ...entry, rating: Number(rating) } : entry) })} />
            </div>
            <div className="md:col-span-2 flex justify-end"><CmsButton variant="danger" onClick={() => update({ ...current, testimonials: current.testimonials.filter((_, i) => i !== index) })}><Trash2 size={14} /> Remove</CmsButton></div>
          </div>
        ))}
        {current.testimonials.length === 0 && <p className="text-sm text-slate-500">No CMS testimonials yet.</p>}
      </div>
    </CmsPanel>
  );
}

function FaqEditor({
  content,
  setContent,
}: {
  content: NonNullable<ReturnType<typeof useCmsPageDraft>['content']>;
  setContent: (content: NonNullable<ReturnType<typeof useCmsPageDraft>['content']>) => void;
}) {
  const section = content.sections.find((item): item is CmsFaqSection => item.type === 'faq');
  const current = section ?? createCmsSection('faq');
  const update = (next: CmsFaqSection) => {
    const found = content.sections.some((item) => item.id === next.id);
    setContent({ ...content, sections: found ? content.sections.map((item) => item.id === next.id ? next : item) : [...content.sections, next] });
  };
  return (
    <CmsPanel title="Frequently asked questions" description="Questions and answers will be saved as a CMS FAQ section.">
      <div className="grid gap-4">
        <CmsField label="Section heading" value={current.title} onChange={(title) => update({ ...current, title })} />
        <CmsField label="Section description" value={current.description ?? ''} onChange={(description) => update({ ...current, description })} multiline />
        <div className="flex justify-end"><CmsButton variant="secondary" onClick={() => update({ ...current, questions: [...current.questions, { id: crypto.randomUUID(), question: '', answer: '' }] })}><Plus size={15} /> Add question</CmsButton></div>
        {current.questions.map((item, index) => (
          <div key={item.id} className="grid gap-3 rounded-xl border border-slate-200 p-4 md:grid-cols-2">
            <CmsField label="Question" value={item.question} onChange={(question) => update({ ...current, questions: current.questions.map((entry, i) => i === index ? { ...entry, question } : entry) })} />
            <CmsField label="Answer" value={item.answer} onChange={(answer) => update({ ...current, questions: current.questions.map((entry, i) => i === index ? { ...entry, answer } : entry) })} multiline />
            <div className="md:col-span-2 flex justify-end"><CmsButton variant="danger" onClick={() => update({ ...current, questions: current.questions.filter((_, i) => i !== index) })}><Trash2 size={14} /> Remove</CmsButton></div>
          </div>
        ))}
        {current.questions.length === 0 && <p className="text-sm text-slate-500">No CMS FAQ entries yet.</p>}
      </div>
    </CmsPanel>
  );
}

function SiteChromeEditor({
  content,
  setContent,
  error,
  success,
}: {
  content: ReturnType<typeof useCmsSettingsDraft>['content'] & {};
  setContent: (content: NonNullable<ReturnType<typeof useCmsSettingsDraft>['content']>) => void;
  error: string;
  success: string;
}) {
  if (!content) return null;
  return (
    <div className="grid gap-5">
      {error && <CmsFeedback message={error} />}
      {success && <CmsFeedback message={success} variant="success" />}
      <CmsFeedback variant="info" message="These starting values mirror the existing public navigation and footer in code. They are editor defaults only; public components are not connected in this phase." />
      <CmsPanel title="Navigation" description="Set labels, destinations and visibility for CMS navigation entries.">
        <div className="grid gap-3">
          {content.navigation.map((item, index) => (
            <div key={item.id} className="grid gap-3 rounded-xl border border-slate-200 p-3 md:grid-cols-[1fr_1fr_auto_auto]">
              <CmsField label="Label" value={item.label} onChange={(label) => setContent({ ...content, navigation: content.navigation.map((entry, i) => i === index ? { ...entry, label } : entry) })} />
              <CmsField label="Link" value={item.href} onChange={(href) => setContent({ ...content, navigation: content.navigation.map((entry, i) => i === index ? { ...entry, href } : entry) })} />
              <label className="flex items-center gap-2 self-end rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium">
                <input type="checkbox" checked={item.visible} onChange={(event) => setContent({ ...content, navigation: content.navigation.map((entry, i) => i === index ? { ...entry, visible: event.target.checked } : entry) })} /> Visible
              </label>
              <button type="button" aria-label="Remove navigation item" className="self-end rounded-lg p-2 text-red-700 hover:bg-red-50" onClick={() => setContent({ ...content, navigation: content.navigation.filter((_, i) => i !== index) })}><Trash2 size={17} /></button>
            </div>
          ))}
          <div className="flex justify-end"><CmsButton variant="secondary" onClick={() => setContent({ ...content, navigation: [...content.navigation, { id: crypto.randomUUID(), label: '', href: '/', visible: true }] })}><Plus size={15} /> Add navigation item</CmsButton></div>
        </div>
      </CmsPanel>
      <CmsPanel title="Footer">
        <div className="grid gap-4">
          <CmsField label="Brand name" value={content.footer.brandName} onChange={(brandName) => setContent({ ...content, footer: { ...content.footer, brandName } })} />
          <CmsField label="Brand description" value={content.footer.description} onChange={(description) => setContent({ ...content, footer: { ...content.footer, description } })} multiline />
          {content.footer.links.map((item, index) => (
            <div key={item.id} className="grid gap-3 rounded-xl border border-slate-200 p-3 md:grid-cols-[1fr_1fr_auto]">
              <CmsField label="Link label" value={item.label} onChange={(label) => setContent({ ...content, footer: { ...content.footer, links: content.footer.links.map((entry, i) => i === index ? { ...entry, label } : entry) } })} />
              <CmsField label="Destination" value={item.href} onChange={(href) => setContent({ ...content, footer: { ...content.footer, links: content.footer.links.map((entry, i) => i === index ? { ...entry, href } : entry) } })} />
              <button type="button" aria-label="Remove footer link" className="self-end rounded-lg p-2 text-red-700 hover:bg-red-50" onClick={() => setContent({ ...content, footer: { ...content.footer, links: content.footer.links.filter((_, i) => i !== index) } })}><Trash2 size={17} /></button>
            </div>
          ))}
          <div className="flex justify-end"><CmsButton variant="secondary" onClick={() => setContent({ ...content, footer: { ...content.footer, links: [...content.footer.links, { id: crypto.randomUUID(), label: '', href: '/' }] } })}><Plus size={15} /> Add footer link</CmsButton></div>
        </div>
      </CmsPanel>
      <CmsPanel title="Contact details" description="Edit the contact information represented in the existing website footer.">
        <div className="grid gap-4 md:grid-cols-2">
          <CmsField label="Address" value={content.contact.address} onChange={(address) => setContent({ ...content, contact: { ...content.contact, address } })} />
          <CmsField label="Phone" value={content.contact.phone} onChange={(phone) => setContent({ ...content, contact: { ...content.contact, phone } })} />
          <CmsField label="Email" value={content.contact.email} onChange={(email) => setContent({ ...content, contact: { ...content.contact, email } })} />
          <CmsField label="Support hours" value={content.contact.supportHours} onChange={(supportHours) => setContent({ ...content, contact: { ...content.contact, supportHours } })} />
        </div>
      </CmsPanel>
      <CmsPanel title="Settings draft preview" description="Preview of the current draft values; this is not connected to the public site in this phase.">
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 bg-slate-950 px-4 py-3 text-sm text-white">
            <strong>{content.footer.brandName}</strong>
            {content.navigation.filter((item) => item.visible).map((item) => <span key={item.id}>{item.label}</span>)}
          </div>
          <div className="grid gap-5 bg-slate-50 p-4 md:grid-cols-2">
            <div>
              <h3 className="font-bold text-slate-900">Footer links</h3>
              <ul className="mt-2 grid gap-1 text-sm text-slate-600 sm:grid-cols-2">
                {content.footer.links.map((item) => <li key={item.id}>{item.label}</li>)}
              </ul>
              <p className="mt-3 max-w-prose text-sm leading-6 text-slate-600">{content.footer.description}</p>
            </div>
            <address className="not-italic text-sm leading-6 text-slate-700">
              <h3 className="font-bold text-slate-900">Contact</h3>
              <p className="mt-2">{content.contact.address}</p>
              <p>{content.contact.phone}</p>
              <p>{content.contact.email}</p>
              <p>{content.contact.supportHours}</p>
            </address>
          </div>
        </div>
      </CmsPanel>
    </div>
  );
}

