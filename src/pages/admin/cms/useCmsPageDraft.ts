import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '@/lib/firebase';
import { loadDraftPage, publishCmsDraftPage, saveCmsDraftPage } from '@/lib/cms/service';
import type { CmsPageContent, CmsPageId } from '@/lib/cms/types';
import { createEmptyCmsPage, errorMessage } from './cmsEditorUtils';

export function useCmsPageDraft(pageId: CmsPageId) {
  const navigate = useNavigate();
  const [content, setContent] = useState<CmsPageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadedPageId, setLoadedPageId] = useState<CmsPageId | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadedPageId(null);
    setContent(null);
    setError('');
    setSuccess('');
    loadDraftPage(pageId)
      .then((draft) => {
        if (active) {
          setContent(draft ?? createEmptyCmsPage(pageId));
          setLoadedPageId(pageId);
        }
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(errorMessage(cause));
          setLoadedPageId(pageId);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [pageId]);

  const save = useCallback(async () => {
    if (!content) return false;
    const actorUid = auth.currentUser?.uid;
    if (!actorUid) {
      setError('Your admin session is no longer available. Sign in again before saving.');
      return false;
    }
    setBusy(true);
    setError('');
    setSuccess('');
    try {
      await saveCmsDraftPage(pageId, content, actorUid);
      setSuccess('Draft saved to Firebase.');
      return true;
    } catch (cause) {
      setError(errorMessage(cause));
      return false;
    } finally {
      setBusy(false);
    }
  }, [content, pageId]);

  const publish = useCallback(async () => {
    if (!content) return;
    if (!content.seo.title.trim() || !content.sections.some((section) => section.enabled && section.title.trim())) {
      setError('Add a page title and at least one enabled section with a heading before publishing.');
      return;
    }
    if (
      !window.confirm(
        `Publish the "${pageId}" page? This updates only this page's published content; other public pages are unchanged.`,
      )
    ) {
      return;
    }
    const actorUid = auth.currentUser?.uid;
    if (!actorUid) {
      setError('Your admin session is no longer available. Sign in again before publishing.');
      return;
    }
    setBusy(true);
    setError('');
    setSuccess('');
    try {
      await saveCmsDraftPage(pageId, content, actorUid);
      const version = await publishCmsDraftPage(pageId, actorUid);
      setSuccess(
        `Published "${pageId}" as version ${version}. Only this page's public content was updated.`,
      );
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setBusy(false);
    }
  }, [content, pageId]);

  const preview = useCallback(() => {
    if (!content) return;
    navigate(`/admin/cms/preview/${pageId}`, { state: { content } });
  }, [content, navigate, pageId]);

  return {
    content,
    setContent,
    loading: loading || loadedPageId !== pageId,
    busy,
    error,
    success,
    save,
    publish,
    preview,
    setError,
  };
}

