/**
 * Server-side MAL discovery adapter.
 *
 * Search and recommendations only. Never auto-arrives. Never exposes
 * credentials. UI receives AnimeDiscoveryCandidate, never MAL's schema.
 */

import {
  normalizeMalDiscoveryNode,
  normalizeMalDiscoveryPayload,
  type AnimeDiscoveryProvider,
} from './anime.discovery';
import { malIdForSlug } from './anime.mal.identity';
import type { CanonicalAnime } from './anime.types';

const MAL_ANIME_URL = 'https://api.myanimelist.net/v2/anime';
const MAL_DISCOVERY_FIELDS = [
  'id',
  'title',
  'alternative_titles',
  'start_date',
  'media_type',
  'num_episodes',
  'status',
  'genres',
  'studios',
  'synopsis',
  'main_picture',
].join(',');
const MAL_TIMEOUT_MS = 5000;
const MAL_REVALIDATE_SECONDS = 60 * 60 * 24;
const MAL_LIMIT = 5;

export type MalFetch = (
  input: string,
  init?: RequestInit,
) => Promise<Response>;

export type MalDiscoveryProviderOptions = {
  clientId: string;
  fetchImpl?: MalFetch;
};

async function malGet(
  fetchImpl: MalFetch,
  clientId: string,
  url: string,
): Promise<unknown> {
  const response = await fetchImpl(url, {
    headers: { 'X-MAL-CLIENT-ID': clientId },
    signal: AbortSignal.timeout(MAL_TIMEOUT_MS),
    next: { revalidate: MAL_REVALIDATE_SECONDS },
  } as RequestInit);
  if (!response.ok) return null;
  return response.json();
}

export function createMalDiscoveryProvider(
  options: MalDiscoveryProviderOptions,
): AnimeDiscoveryProvider {
  const fetchImpl = options.fetchImpl ?? fetch;
  const clientId = options.clientId.trim();

  return {
    async searchByTitle(query: string) {
      const q = query.trim().slice(0, 64);
      if (clientId.length === 0 || q.length < 3) return [];
      try {
        const url =
          `${MAL_ANIME_URL}?q=${encodeURIComponent(q)}` +
          `&limit=${MAL_LIMIT}&fields=${MAL_DISCOVERY_FIELDS}`;
        return normalizeMalDiscoveryPayload(await malGet(fetchImpl, clientId, url));
      } catch {
        return [];
      }
    },

    async getSimilarByCanonicalAnime(anime: CanonicalAnime) {
      const malId = malIdForSlug(anime.slug);
      if (clientId.length === 0 || malId == null) return [];
      try {
        const url = `${MAL_ANIME_URL}/${malId}?fields=recommendations`;
        const payload = await malGet(fetchImpl, clientId, url);
        const recommendations =
          payload &&
          typeof payload === 'object' &&
          'recommendations' in payload &&
          Array.isArray((payload as { recommendations: unknown }).recommendations)
            ? (payload as { recommendations: unknown[] }).recommendations
            : [];
        return normalizeMalDiscoveryPayload({
          data: recommendations.slice(0, MAL_LIMIT),
        }).filter((candidate) => candidate.malId !== malId);
      } catch {
        return [];
      }
    },

    async getByMalId(malId: number) {
      if (clientId.length === 0 || !Number.isInteger(malId) || malId <= 0) {
        return null;
      }
      try {
        const url = `${MAL_ANIME_URL}/${malId}?fields=${MAL_DISCOVERY_FIELDS}`;
        return normalizeMalDiscoveryNode(
          await malGet(fetchImpl, clientId, url),
        );
      } catch {
        return null;
      }
    },
  };
}
