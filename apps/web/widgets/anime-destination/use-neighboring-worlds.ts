'use client';

/**
 * Destination-local neighboring-world lookup.
 * One abortable similar request per mounted slug — never recursive.
 * Parent remounts with key={anime.slug} so state cannot leak.
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
  anime: CanonicalAnime,
  enabled: boolean,
): NeighboringWorldsState {
  const available = destinationKinshipAvailable(anime);
  const fetchedSlug = useRef<string | null>(null);
  const [state, setState] = useState<NeighboringWorldsState>({ status: 'idle' });

  useEffect(() => {
    if (!enabled || !available) return;
    if (fetchedSlug.current === anime.slug) return;

    const controller = new AbortController();
    const slug = anime.slug;

    void requestAnimeDiscovery({ kind: 'similar', slug }, controller.signal)
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
  }, [enabled, available, anime.slug]);

  if (enabled && available && state.status === 'idle') {
    return { status: 'loading' };
  }

  return state;
}
