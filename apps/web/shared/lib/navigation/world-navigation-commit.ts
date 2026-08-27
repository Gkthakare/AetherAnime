/**
 * World navigation commit — activation → canonical href comparison.
 *
 * Pure helpers only. Router mutation lives in client adapters.
 */

import type { WorldRegionActivationIntent } from '@/shared/world/world.activation';

import { matchesWorldHref, worldHref } from './world-transition';

/** Canonical href for a validated Region activation intent. */
export function worldHrefFromActivation(
  worldSlug: string,
  intent: WorldRegionActivationIntent,
): string {
  return worldHref({
    worldSlug,
    regionId: intent.regionId,
  });
}

/** Canonical href for a validated anime arrival. */
export function worldHrefFromAnimeArrival(
  worldSlug: string,
  animeSlug: string,
): string {
  return worldHref({
    worldSlug,
    animeSlug,
  });
}

/**
 * True when href matches current browser location (pathname + region/anime query).
 * Client-only — returns false during SSR.
 */
export function matchesCurrentWorldHref(href: string): boolean {
  if (typeof window === 'undefined') return false;
  return matchesWorldHref(window.location.href, href, window.location.origin);
}
