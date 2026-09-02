import type { CanonicalAnime } from '@/shared/anime/anime.types';
import { getAnimeBySlug } from '@/shared/anime/anime.repository';
import { discoveredMalIdFromSlug } from '@/shared/anime/anime.mal.identity';
import type { AnimeOrigin } from './analytics.types';

export function resolveAnimeOrigin(anime: CanonicalAnime): AnimeOrigin {
  if (getAnimeBySlug(anime.slug)) {
    return 'catalog';
  }
  if (discoveredMalIdFromSlug(anime.slug) != null) {
    return 'discovered';
  }
  return 'catalog';
}
