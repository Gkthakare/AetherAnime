/**
 * Client discovery requests. Talks only to the app API, never MAL.
 */

import type {
  AnimeDiscoveryCandidate,
  DiscoveryLookup,
} from './anime.discovery';
import type { CanonicalAnime } from './anime.types';

export async function requestAnimeDiscovery(
  lookup: DiscoveryLookup,
  signal: AbortSignal,
): Promise<ReadonlyArray<AnimeDiscoveryCandidate>> {
  const params =
    lookup.kind === 'search'
      ? `q=${encodeURIComponent(lookup.query)}`
      : `similar=${encodeURIComponent(lookup.slug)}`;
  const response = await fetch(`/api/anime-discovery?${params}`, {
    signal,
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) return [];
  const body: unknown = await response.json();
  if (!body || typeof body !== 'object' || !('candidates' in body)) return [];
  const candidates = (body as { candidates: unknown }).candidates;
  return Array.isArray(candidates)
    ? (candidates as AnimeDiscoveryCandidate[])
    : [];
}

export async function requestDiscoveredAnime(
  malId: number,
  signal: AbortSignal,
): Promise<CanonicalAnime | null> {
  const response = await fetch(
    `/api/anime-discovery?id=${encodeURIComponent(String(malId))}`,
    { signal, headers: { Accept: 'application/json' } },
  );
  if (!response.ok) return null;
  const body: unknown = await response.json();
  if (!body || typeof body !== 'object' || !('anime' in body)) return null;
  const anime = (body as { anime: CanonicalAnime | null }).anime;
  return anime && typeof anime.slug === 'string' ? anime : null;
}
