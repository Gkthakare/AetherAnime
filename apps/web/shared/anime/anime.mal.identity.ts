/**
 * Deterministic MAL identity for catalog titles, plus discovered slugs.
 *
 * Catalog IDs were verified against live MAL title pages, not guessed from search:
 *   solo-leveling      → 52299  Ore dake Level Up na Ken (TV, 12 eps)
 *   fate-stay-night    → 356    Fate/stay night (TV 2006, 24 eps)
 *   fate-zero          → 10087  Fate/Zero (2011, first cour)
 *   fate-grand-order   → 34321  Fate/Grand Order: First Order (2016 special)
 *
 * Fate entries are not interchangeable. Unknown slugs have no identity.
 * Discovered destinations use discovered-{malId} after user confirmation.
 */

import type { AnimeResolution } from './anime.types';

const MAL_IDS_BY_SLUG = {
  'solo-leveling': 52299,
  'fate-stay-night': 356,
  'fate-zero': 10087,
  'fate-grand-order': 34321,
} as const;

const DISCOVERED_SLUG = /^discovered-(\d+)$/;

export function discoveredSlugForMalId(malId: number): string {
  return `discovered-${malId}`;
}

export function discoveredMalIdFromSlug(slug: string): number | null {
  const match = DISCOVERED_SLUG.exec(slug);
  if (!match) return null;
  const malId = Number(match[1]);
  return Number.isInteger(malId) && malId > 0 ? malId : null;
}

export function malIdForSlug(slug: string): number | null {
  return (
    MAL_IDS_BY_SLUG[slug as keyof typeof MAL_IDS_BY_SLUG] ??
    discoveredMalIdFromSlug(slug)
  );
}

/** Metadata is looked up only after the local resolver has a single anime. */
export function metadataLookupTarget(
  resolution: AnimeResolution,
): string | null {
  return resolution.status === 'resolved' ? resolution.anime.slug : null;
}
