/**
 * Normalized destination metadata. Provider-shaped, not CanonicalAnime.
 *
 * MAL enriches an already-resolved catalog or discovered identity.
 * It does not navigate.
 */

import { discoveredMalIdFromSlug } from './anime.mal.identity';
import type { CanonicalAnime } from './anime.types';

export type AnimeMetadata = {
  readonly source: 'mal';
  readonly malId: number;
  readonly title: string;
  readonly alternateTitle: string | null;
  readonly synopsis: string | null;
  readonly score: number | null;
  readonly scoredBy: number | null;
  readonly rank: number | null;
  readonly popularity: number | null;
  readonly members: number | null;
  readonly genres: ReadonlyArray<string>;
  readonly url: string;
};

export type AnimeMetadataProvider = {
  getByCanonicalAnime(anime: CanonicalAnime): Promise<AnimeMetadata | null>;
};

/**
 * Late provider payloads apply only to the slug that requested them.
 * Aborted or mismatched responses must not overwrite a newer destination.
 */
export function metadataResponseForSlug(
  requestedSlug: string,
  activeSlug: string | null,
  aborted: boolean,
): 'apply' | 'ignore' {
  if (aborted || activeSlug == null || activeSlug !== requestedSlug) {
    return 'ignore';
  }
  return 'apply';
}

export type DestinationMetadataOverlay = {
  readonly synopsis: string;
  readonly alternateTitle: string | undefined;
  readonly genres: ReadonlyArray<string>;
  readonly score: number | null;
  readonly scoredBy: number | null;
  readonly rank: number | null;
};

/**
 * Presentation overlay. CanonicalAnime stays unchanged.
 * Discovered destinations may show MAL synopsis/genres after enrichment.
 */
export function overlayDiscoveredMetadata(
  anime: CanonicalAnime,
  metadata: AnimeMetadata | null,
): DestinationMetadataOverlay {
  const discovered = discoveredMalIdFromSlug(anime.slug) != null;
  const synopsis =
    discovered && metadata?.synopsis ? metadata.synopsis : anime.synopsis;
  const alternateTitle =
    discovered && metadata?.alternateTitle
      ? metadata.alternateTitle
      : anime.alternateTitles[0];
  const genres =
    discovered && metadata && metadata.genres.length > 0
      ? metadata.genres
      : anime.genres;

  return {
    synopsis,
    alternateTitle,
    genres,
    score: metadata?.score ?? null,
    scoredBy: metadata?.scoredBy ?? null,
    rank: metadata?.rank ?? null,
  };
}

