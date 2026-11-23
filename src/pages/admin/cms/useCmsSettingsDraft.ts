import { useCallback, useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import {
  loadDraftSiteSettings,
  publishCmsDraftSettings,
  saveCmsDraftSettings,
} from '@/lib/cms/service';
import type { CmsSettingsContent } from '@/lib/cms/types';
import { createCurrentSiteSettingsDraft } from './cmsSettingsDefaults';
import { errorMessage } from './cmsEditorUtils';

export function useCmsSettingsDraft() {
  const [content, setContent] = useState<CmsSettingsContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let active = true;
    loadDraftSiteSettings()
      .then((draft) => {
        if (active) setContent(draft ?? createCurrentSiteSettingsDraft());
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

  const save = useCallback(async () => {
    const actorUid = auth.currentUser?.uid;
    if (!content) return false;
    if (!actorUid) {
      setError('Your admin session is no longer available. Sign in again before saving.');
      return false;
    }
    setBusy(true);
    setError('');
    setSuccess('');
    try {
      await saveCmsDraftSettings(content, actorUid);
      setSuccess('Global settings draft saved to Firebase.');
      return true;
    } catch (cause) {
      setError(errorMessage(cause));
      return false;
    } finally {
      setBusy(false);
    }
  }, [content]);

  const publish = useCallback(async () => {
    if (!content) return;
    if (
      !window.confirm(
        'Publish these CMS settings? The current public website will not use them in this phase.',
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
      await saveCmsDraftSettings(content, actorUid);
      const version = await publishCmsDraftSettings(actorUid);
      setSuccess(`Settings published as CMS version ${version}. The current public website is unchanged.`);
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setBusy(false);
    }
  }, [content]);

  return { content, setContent, loading, busy, error, success, save, publish };
}

