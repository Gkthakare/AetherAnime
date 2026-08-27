'use client';

import { useEffect, useState } from 'react';

import type { AnimeMetadata } from '@/shared/anime/anime.metadata';
import { metadataResponseForSlug } from '@/shared/anime/anime.metadata';

/**
 * Enrich a resolved destination after arrival.
 * Aborts in-flight requests on unmount/slug change so a late MAL
 * response cannot overwrite a newer destination.
 */
export function useAnimeMetadata(slug: string | null): AnimeMetadata | null {
  const [response, setResponse] = useState<{
    slug: string;
    metadata: AnimeMetadata | null;
  } | null>(null);

  useEffect(() => {
    if (!slug) return undefined;

    const controller = new AbortController();
    const requestedSlug = slug;

    fetch(`/api/anime-metadata/${encodeURIComponent(requestedSlug)}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    })
      .then(async (responseBody) => {
        if (!responseBody.ok) return null;
        const body: unknown = await responseBody.json();
        if (!body || typeof body !== 'object' || !('metadata' in body)) {
          return null;
        }
        return (body as { metadata: AnimeMetadata | null }).metadata;
      })
      .then((value) => {
        if (
          metadataResponseForSlug(
            requestedSlug,
            requestedSlug,
            controller.signal.aborted,
          ) === 'ignore'
        ) {
          return;
        }
        setResponse({ slug: requestedSlug, metadata: value });
      })
      .catch(() => {
        if (
          metadataResponseForSlug(
            requestedSlug,
            requestedSlug,
            controller.signal.aborted,
          ) === 'ignore'
        ) {
          return;
        }
        setResponse({ slug: requestedSlug, metadata: null });
      });

    return () => controller.abort();
  }, [slug]);

  if (!slug) return null;
  if (response?.slug !== slug) return null;
  return response.metadata;
}
