'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import type { CanonicalAnime } from '@/shared/anime';
import {
  matchesCurrentWorldHref,
  worldHref,
  worldHrefFromActivation,
  worldHrefFromAnimeArrival,
} from '@/shared/lib/navigation';
import type { WorldRegionActivationIntent } from '@/shared/world';

import { WorldScene } from './world-scene';
import type { WorldSceneProps } from './world-scene.types';

export type WorldSceneNavigationProps = Omit<
  WorldSceneProps,
  'onRegionActivate' | 'onAnimeArrive' | 'onAnimeClear'
>;

/**
 * Client adapter — Region activation and anime arrival → URL/history.
 *
 * Passes validated `initialRegionId` / `initialAnimeSlug` through to WorldScene.
 * Same-route query / Back / Forward update those props; WorldScene owns state
 * handoff. This adapter never writes Focus and never syncs Focus → URL.
 */
export function WorldSceneNavigation(props: WorldSceneNavigationProps) {
  const router = useRouter();
  const { slug } = props;

  const handleRegionActivate = useCallback(
    (intent: WorldRegionActivationIntent) => {
      const href = worldHrefFromActivation(slug, intent);
      if (matchesCurrentWorldHref(href)) return;
      router.push(href);
    },
    [router, slug],
  );

  const handleAnimeArrive = useCallback(
    (anime: CanonicalAnime) => {
      const href = worldHrefFromAnimeArrival(slug, anime.slug);
      if (matchesCurrentWorldHref(href)) return;
      router.push(href);
    },
    [router, slug],
  );

  const handleAnimeClear = useCallback(() => {
    const href = worldHref(slug);
    if (matchesCurrentWorldHref(href)) return;
    router.push(href);
  }, [router, slug]);

  return (
    <WorldScene
      {...props}
      onRegionActivate={handleRegionActivate}
      onAnimeArrive={handleAnimeArrive}
      onAnimeClear={handleAnimeClear}
    />
  );
}
