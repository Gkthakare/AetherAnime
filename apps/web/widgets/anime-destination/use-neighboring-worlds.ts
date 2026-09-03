'use client';

/**
 * Destination-local neighboring-world lookup.
 * One abortable similar request per slug — never recursive.
 */

import { useEffect, useRef, useState } from 'react';

import {
  requestAnimeDiscovery,
  type AnimeDiscoveryCandidate,
  type CanonicalAnime,
} from '@/shared/anime';

import { destinationKinshipAvailable } from './anime-destination.paths';

export type NeighboringWorldsState =
  | { readonly status: 'idle' }
  | { readonly status: 'loading' }
  | {
      readonly status: 'ready';
      readonly candidates: ReadonlyArray<AnimeDiscoveryCandidate>;
    }
  | { readonly status: 'empty' };

export function useNeighboringWorlds(
  anime: CanonicalAnime | null,
  enabled: boolean,
): NeighboringWorldsState {
  const available = anime != null && destinationKinshipAvailable(anime);
  const slug = anime?.slug ?? '';
  const fetchedSlug = useRef<string | null>(null);
  const [state, setState] = useState<NeighboringWorldsState>({ status: 'idle' });

  useEffect(() => {
    fetchedSlug.current = null;
    setState({ status: 'idle' });
  }, [slug]);

  useEffect(() => {
    if (!enabled || !available || !slug) return;
    if (fetchedSlug.current === slug) return;

    const controller = new AbortController();
    setState({ status: 'loading' });
    requestAnimeDiscovery({ kind: 'similar', slug }, controller.signal)
      .then((candidates) => {
        if (controller.signal.aborted) return;
        fetchedSlug.current = slug;
        setState(
          candidates.length > 0
            ? { status: 'ready', candidates }
            : { status: 'empty' },
        );
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        fetchedSlug.current = slug;
        setState({ status: 'empty' });
      });

    return () => controller.abort();
  }, [enabled, available, slug]);

  return state;
}
