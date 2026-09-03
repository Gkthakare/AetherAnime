/**
 * Continuum discovery — curated World landmark candidates.
 *
 * Static catalog slice only. No network, no Navigator query, no invented anime.
 * Shown when the Continuum region is focused in World Idle.
 */

import { getAnimeBySlug } from '../anime/anime.repository';
import type { CanonicalAnime } from '../anime/anime.types';

import { AETHERANIME_REGION_CONTINUUM_ID } from './world.region.constants';

/** Maximum visible discovery candidates at the Continuum landmark. */
export const CONTINUUM_DISCOVERY_MAX = 3 as const;

/**
 * Ordered curated slugs — primary first, then supporting destinations.
 * All must resolve through the existing catalog provider.
 */
export const CONTINUUM_DISCOVERY_SLUGS = Object.freeze([
  'solo-leveling',
  'fate-zero',
  'fate-grand-order',
] as const);

/** True when the focused region is the Continuum discovery landmark. */
export function isContinuumDiscoveryRegion(
  regionId: string | null | undefined,
): boolean {
  return regionId === AETHERANIME_REGION_CONTINUUM_ID;
}

/**
 * Resolve real catalog anime for Continuum discovery.
 * Drops missing entries rather than fabricating placeholders.
 */
export function resolveContinuumDiscoveryCandidates(): ReadonlyArray<CanonicalAnime> {
  const candidates: CanonicalAnime[] = [];

  for (const slug of CONTINUUM_DISCOVERY_SLUGS) {
    if (candidates.length >= CONTINUUM_DISCOVERY_MAX) break;
    const anime = getAnimeBySlug(slug);
    if (anime) candidates.push(anime);
  }

  return Object.freeze(candidates);
}
