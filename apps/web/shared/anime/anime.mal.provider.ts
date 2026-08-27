/**
 * Server-side MAL metadata adapter.
 *
 * Looks up GET /v2/anime/{id} for an already-resolved CanonicalAnime.
 * Never searches MAL. Never exposes credentials.
 */

import { malIdForSlug } from './anime.mal.identity';
import { normalizeMalAnime } from './anime.mal.normalize';
import type { AnimeMetadataProvider } from './anime.metadata';
import type { CanonicalAnime } from './anime.types';

const MAL_ANIME_URL = 'https://api.myanimelist.net/v2/anime';
const MAL_FIELDS = [
  'id',
  'title',
  'alternative_titles',
  'synopsis',
  'mean',
  'rank',
  'popularity',
  'num_list_users',
  'num_scoring_users',
  'genres',
].join(',');
const MAL_TIMEOUT_MS = 5000;
const MAL_REVALIDATE_SECONDS = 60 * 60 * 24;

export type MalFetch = (
  input: string,
  init?: RequestInit,
) => Promise<Response>;

export type MalMetadataProviderOptions = {
  clientId: string;
  fetchImpl?: MalFetch;
};

export function createMalMetadataProvider(
  options: MalMetadataProviderOptions,
): AnimeMetadataProvider {
  const fetchImpl = options.fetchImpl ?? fetch;
  const clientId = options.clientId.trim();

  return {
    async getByCanonicalAnime(anime: CanonicalAnime) {
      const malId = malIdForSlug(anime.slug);
      if (malId == null || clientId.length === 0) return null;

      const url = `${MAL_ANIME_URL}/${malId}?fields=${MAL_FIELDS}`;
      try {
        const response = await fetchImpl(url, {
          headers: { 'X-MAL-CLIENT-ID': clientId },
          signal: AbortSignal.timeout(MAL_TIMEOUT_MS),
          next: { revalidate: MAL_REVALIDATE_SECONDS },
        } as RequestInit);
        if (!response.ok) return null;
        return normalizeMalAnime(await response.json());
      } catch {
        return null;
      }
    },
  };
}
