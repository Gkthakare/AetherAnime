import { getAnimeBySlug, resolveSimilarLookupAnime } from '@/shared/anime';
import { canonicalizeDiscoveryCandidate } from '@/shared/anime/anime.discovery';
import { createMalDiscoveryProvider } from '@/shared/anime/anime.mal.discovery';
import { discoveredMalIdFromSlug } from '@/shared/anime/anime.mal.identity';

function malClientId(): string {
  return process.env.MAL_CLIENT_ID ?? '';
}

function provider() {
  return createMalDiscoveryProvider({ clientId: malClientId() });
}

/**
 * Server-only MAL discovery. Search and recommendations never auto-arrive.
 * Identity lookup by MAL id hydrates a confirmed discovered destination.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get('q')?.trim() ?? '';
  const similar = url.searchParams.get('similar')?.trim() ?? '';
  const id = url.searchParams.get('id')?.trim() ?? '';
  const discovery = provider();

  if (id.length > 0) {
    const malId = Number(id);
    const fromSlug = discoveredMalIdFromSlug(`discovered-${id}`);
    const resolvedId = fromSlug ?? (Number.isInteger(malId) ? malId : null);
    if (resolvedId == null) {
      return Response.json({ anime: null });
    }
    const candidate = await discovery.getByMalId(resolvedId);
    return Response.json({
      anime: candidate ? canonicalizeDiscoveryCandidate(candidate) : null,
    });
  }

  if (similar.length > 0) {
    const anime = resolveSimilarLookupAnime(similar);
    if (!anime) return Response.json({ candidates: [] });
    // Prefer catalog when present so titles stay authoritative; seed otherwise.
    const seed = getAnimeBySlug(similar) ?? anime;
    return Response.json({
      candidates: await discovery.getSimilarByCanonicalAnime(seed),
    });
  }

  if (query.length >= 3) {
    return Response.json({
      candidates: await discovery.searchByTitle(query),
    });
  }

  return Response.json({ candidates: [] });
}
