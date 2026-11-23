import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  BookOpenText,
  Brush,
  FileText,
  Film,
  Images,
  LayoutTemplate,
} from 'lucide-react';
import {
  loadCmsDraftMedia,
  loadCmsPublishedMedia,
  loadDraftPage,
  loadDraftSiteSettings,
} from '@/lib/cms/service';
import { CMS_PAGE_IDS } from '@/lib/cms/types';
import type { CmsMediaAsset } from '@/lib/cms/types';
import { CmsFeedback, CmsLoading, CmsPageTitle, CmsPanel } from './cms/CmsUi';
import { errorMessage } from './cms/cmsEditorUtils';

interface OverviewData {
  pages: number;
  hasSettings: boolean;
  draftMedia: CmsMediaAsset[];
  publishedMedia: CmsMediaAsset[];
}

const shortcuts = [
  { title: 'Edit homepage hero', detail: 'Headlines, video, poster and calls to action', to: '/admin/cms/hero', icon: Film },
  { title: 'Manage pages', detail: 'Edit page SEO and reorder sections', to: '/admin/cms/pages', icon: LayoutTemplate },
  { title: 'Update design', detail: 'Colors, typography, spacing and global links', to: '/admin/cms/design', icon: Brush },
  { title: 'Browse media', detail: 'Upload, preview and publish CMS assets', to: '/admin/cms/media', icon: Images },
  { title: 'Edit site content', detail: 'Services, testimonials, FAQs and contact details', to: '/admin/cms/content', icon: BookOpenText },
];

export default function AdminCms() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const withReadContext = <T,>(path: string, read: Promise<T>) =>
      read.catch((cause: unknown) => {
        throw new Error(`${path}: ${errorMessage(cause)}`);
      });

    Promise.all([
      Promise.all(
        CMS_PAGE_IDS.map((pageId) =>
          withReadContext(`cmsDrafts/${pageId}`, loadDraftPage(pageId)),
        ),
      ),
      withReadContext(
        'cmsSettingsDrafts/global',
        loadDraftSiteSettings(),
      ),
      withReadContext(
        'cmsMediaDrafts (list)',
        loadCmsDraftMedia(),
      ),
      withReadContext(
        'cmsMediaPublished (list)',
        loadCmsPublishedMedia(),
      ),
    ])
      .then(([pages, settings, draftMedia, publishedMedia]) => {
        if (!active) return;
        setData({
          pages: pages.filter(Boolean).length,
          hasSettings: settings !== null,
          draftMedia,
          publishedMedia,
        });
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

  return (
    <div>
      <CmsPageTitle
        title="Website CMS"
        description="Manage draft website content and published CMS snapshots. The current public pages remain code-driven until the next CMS phase."
      />
      {loading ? (
        <CmsLoading />
      ) : error ? (
        <CmsFeedback message={`Could not load CMS status: ${error}`} />
      ) : data ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatusCard label="Page drafts" value={`${data.pages} / ${CMS_PAGE_IDS.length}`} detail="Page content saved to Firestore" icon={FileText} />
            <StatusCard label="Global settings" value={data.hasSettings ? 'Draft saved' : 'Not started'} detail="Design, navigation and site details" icon={Brush} />
            <StatusCard label="Draft media" value={String(data.draftMedia.length)} detail="Private assets awaiting publishing" icon={Images} />
            <StatusCard label="Published media" value={String(data.publishedMedia.length)} detail="Assets available to published CMS content" icon={Film} />
          </div>

          <CmsPanel
            className="mt-6"
            title="CMS workspace"
            description="Choose an editor to start or continue a draft."
          >
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {shortcuts.map(({ title, detail, to, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="group rounded-xl border border-slate-200 p-4 transition hover:border-red-200 hover:bg-red-50/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-800 group-hover:bg-white">
                      <Icon aria-hidden="true" size={19} />
                    </span>
                    <ArrowUpRight aria-hidden="true" className="text-slate-400 group-hover:text-red-700" size={18} />
                  </div>
                  <h3 className="mt-4 font-bold text-slate-950">{title}</h3>
                  <p className="mt-1 text-sm leading-5 text-slate-600">{detail}</p>
                </Link>
              ))}
            </div>
          </CmsPanel>
        </>
      ) : null}
    </div>
  );
}

function StatusCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof FileText;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-600">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">{value}</p>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-red-50 text-red-700">
          <Icon aria-hidden="true" size={19} />
        </span>
      </div>
      <p className="mt-2 text-xs leading-5 text-slate-500">{detail}</p>
    </div>
  );
}

