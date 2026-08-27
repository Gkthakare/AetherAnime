/**
 * AnimeRepository — catalog-backed lookup for the first slice.
 *
 * Future: provider adapters (MAL server, authorized Crunchyroll) compose here.
 * Today: CatalogAnimeProvider only.
 */

import { catalogAnimeProvider } from './catalog-anime-provider';
import { discoveredMalIdFromSlug } from './anime.mal.identity';
import type { CanonicalAnime } from './anime.types';

export function getAllAnime(): ReadonlyArray<CanonicalAnime> {
  return catalogAnimeProvider.getAll();
}

export function getAnimeById(id: string): CanonicalAnime | undefined {
  return catalogAnimeProvider.getById(id);
}

export function getAnimeBySlug(slug: string): CanonicalAnime | undefined {
  return catalogAnimeProvider.getBySlug(slug);
}

/**
 * Validate optional `?anime=` arrival metadata.
 * Returns the catalog slug, or a confirmed discovered-{malId} slug.
 */
export function resolveInitialAnimeArrival(
  animeQuery: string | string[] | undefined,
): string | undefined {
  const raw = Array.isArray(animeQuery) ? animeQuery[0] : animeQuery;
  const slug = raw?.trim();
  if (!slug) return undefined;
  if (getAnimeBySlug(slug)) return slug;
  return discoveredMalIdFromSlug(slug) != null ? slug : undefined;
}
