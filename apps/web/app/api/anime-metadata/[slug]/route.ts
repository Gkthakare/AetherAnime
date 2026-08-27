import { getAnimeBySlug } from '@/shared/anime';
import { canonicalizeDiscoveryCandidate } from '@/shared/anime/anime.discovery';
import { malIdForSlug } from '@/shared/anime/anime.mal.identity';
import { createMalMetadataProvider } from '@/shared/anime/anime.mal.provider';
import type { CanonicalAnime } from '@/shared/anime';

type AnimeMetadataRouteContext = {
  params: Promise<{ slug: string }>;
};

function malClientId(): string {
  return process.env.MAL_CLIENT_ID ?? '';
}

function animeForMetadataLookup(slug: string): CanonicalAnime | null {
  const catalog = getAnimeBySlug(slug);
  if (catalog) return catalog;
  const malId = malIdForSlug(slug);
  if (malId == null) return null;
  return canonicalizeDiscoveryCandidate({
    malId,
    title: 'Discovered destination',
    alternateTitle: null,
    year: null,
    type: 'tv',
    episodeCount: null,
    status: 'finished',
    genres: [],
    studios: [],
  });
}

/**
 * Server-only MAL enrichment for an already-resolved destination slug.
 * Does not search MAL. Does not resolve navigation.
 */
export async function GET(
  _request: Request,
  context: AnimeMetadataRouteContext,
) {
  const { slug } = await context.params;
  const anime = animeForMetadataLookup(slug);
  if (!anime) {
    return Response.json({ metadata: null });
  }

  const metadata = await createMalMetadataProvider({
    clientId: malClientId(),
  }).getByCanonicalAnime(anime);

  return Response.json({ metadata });
}
