import { useEffect, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { subscribeToPublishedPage } from '@/lib/cms/service';
import { CMS_PAGE_SEO_DEFAULTS } from '@/lib/cms/pageSeoDefaults';
import type {
  CmsPageId,
  CmsPublishedPage,
  CmsPublishedSettings,
} from '@/lib/cms/types';
import CmsPageContent from './CmsPageContent';

interface PublishedPageState {
  pageId: CmsPageId;
  page: CmsPublishedPage | null;
  loading: boolean;
  failed: boolean;
}

export default function PublishedCmsPage({
  pageId,
  cmsSettings,
  fallback,
  formSlot,
  homeFallbacks = false,
}: {
  pageId: CmsPageId;
  cmsSettings: CmsPublishedSettings | null;
  fallback: ReactNode;
  formSlot?: ReactNode;
  homeFallbacks?: boolean;
}) {
  const location = useLocation();
  const [state, setState] = useState<PublishedPageState | null>(null);
  const currentState = state?.pageId === pageId ? state : null;
  const page =
    currentState?.page && currentState.page.sections.length > 0
      ? currentState.page
      : null;

  useEffect(() => {
    let active = true;
    setState({ pageId, page: null, loading: true, failed: false });

    const unsubscribe = subscribeToPublishedPage(
      pageId,
      (page) => {
        if (!active) return;
        if (page && page.pageId !== pageId) {
          console.error(
            `Published CMS document "${pageId}" has a mismatched page ID.`,
          );
          setState({ pageId, page: null, loading: false, failed: true });
          return;
        }
        setState({ pageId, page, loading: false, failed: false });
      },
      (error) => {
        if (!active) return;
        console.error(
          `Could not load published CMS page "${pageId}"; using the existing page.`,
          error,
        );
        setState({ pageId, page: null, loading: false, failed: true });
      },
    );
    return () => {
      active = false;
      unsubscribe();
    };
  }, [pageId]);

  useEffect(() => {
    const previousTitle = document.title;
    const existingDescription = document.head.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    const previousDescription = existingDescription?.getAttribute('content');
    const descriptionMeta = existingDescription ?? document.createElement('meta');
    const existingCanonical = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    const previousCanonical = existingCanonical?.getAttribute('href');
    const canonicalLink = existingCanonical ?? document.createElement('link');
    const fallbackSeo = CMS_PAGE_SEO_DEFAULTS[pageId];
    const title = page?.seo.title.trim() || fallbackSeo.title;
    const description =
      page?.seo.description.trim() || fallbackSeo.description;
    const canonicalPath = page?.seo.canonicalPath.trim() || location.pathname;
    const safeCanonicalPath =
      canonicalPath.startsWith('/') && !canonicalPath.startsWith('//')
        ? canonicalPath
        : location.pathname;
    const canonicalUrl = new URL(safeCanonicalPath, window.location.origin);
    canonicalUrl.search = '';
    canonicalUrl.hash = '';

    if (!existingDescription) {
      descriptionMeta.name = 'description';
      document.head.append(descriptionMeta);
    }
    if (!existingCanonical) {
      canonicalLink.rel = 'canonical';
      document.head.append(canonicalLink);
    }
    document.title = title;
    descriptionMeta.content = description;
    canonicalLink.href = canonicalUrl.href;

    return () => {
      document.title = previousTitle;
      if (existingDescription) {
        if (previousDescription === null) {
          existingDescription.removeAttribute('content');
        } else {
          existingDescription.content = previousDescription ?? '';
        }
      } else if (descriptionMeta) {
        descriptionMeta.remove();
      }
      if (existingCanonical) {
        if (previousCanonical === null) {
          existingCanonical.removeAttribute('href');
        } else {
          existingCanonical.href = previousCanonical ?? '';
        }
      } else {
        canonicalLink.remove();
      }
    };
  }, [
    location.pathname,
    page?.seo.canonicalPath,
    page?.seo.description,
    page?.seo.title,
    pageId,
  ]);

  return (
    <div aria-busy={currentState?.loading ?? true}>
      {page ? (
        <CmsPageContent
          page={page}
          cmsSettings={cmsSettings}
          formSlot={formSlot}
          homeFallbacks={homeFallbacks}
        />
      ) : (
        fallback
      )}
      {currentState?.loading && (
        <span className="sr-only" role="status">
          Loading published page content.
        </span>
      )}
      {currentState?.failed && (
        <span className="sr-only" role="status">
          Published content is unavailable. Showing the existing page.
        </span>
      )}
    </div>
  );
}
