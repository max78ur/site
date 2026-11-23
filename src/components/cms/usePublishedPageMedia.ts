import { useEffect, useMemo, useState } from 'react';
import { getCmsPageMediaReferences } from '@/lib/cms/validation';
import type { CmsPageContent } from '@/lib/cms/types';
import { resolvePublishedMediaUrl } from '@/lib/cms/publicMedia';

export function usePublishedPageMedia(
  page: CmsPageContent | null,
): Record<string, string> {
  const paths = useMemo(
    () =>
      page
        ? [...new Set(
            getCmsPageMediaReferences(page).map((reference) => reference.storagePath),
          )]
        : [],
    [page],
  );
  const pathKey = paths.join('\n');
  const [urls, setUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    if (paths.length === 0) {
      setUrls({});
      return;
    }

    let active = true;
    setUrls({});
    Promise.all(
      paths.map(async (storagePath) => {
        try {
          const reference = page
            ? getCmsPageMediaReferences(page).find(
                (media) => media.storagePath === storagePath,
              )
            : undefined;
          if (!reference) return null;
          return [storagePath, await resolvePublishedMediaUrl(reference)] as const;
        } catch (error) {
          console.error(`Could not resolve published CMS media "${storagePath}".`, error);
          return null;
        }
      }),
    ).then((entries) => {
      if (active) {
        setUrls(
          Object.fromEntries(
            entries.filter(
              (entry): entry is readonly [string, string] => entry !== null,
            ),
          ),
        );
      }
    });

    return () => {
      active = false;
    };
  }, [page, pathKey]);

  return urls;
}

