/**
 * Application discovery model. MAL search is an adapter, not the resolver.
 *
 * AnimeDiscoveryCandidate is never CanonicalAnime. User confirmation
 * canonicalizes, then arriveAnime() runs.
 */

import { getAllAnime } from './anime.repository';
import {
  discoveredSlugForMalId,
  malIdForSlug,
} from './anime.mal.identity';
import { asFiniteNumber, asRecord, asString, namedList } from './anime.mal.parse';
import {
  malMainPicturePoster,
  validateAnimePosterSource,
} from './anime.poster';
import type { AnimeIntent } from './anime.intent';
import type {
  AnimeResolution,
  AnimeStatus,
  AnimeType,
  CanonicalAnime,
} from './anime.types';

export type AnimeDiscoveryCandidate = {
  readonly malId: number;
  readonly title: string;
  readonly alternateTitle: string | null;
  readonly year: number | null;
  readonly type: AnimeType;
  readonly episodeCount: number | null;
  readonly status: AnimeStatus;
  readonly genres: ReadonlyArray<string>;
  readonly studios: ReadonlyArray<string>;
  readonly synopsis?: string | null;
  /**
   * Validated presentation artwork (local path or MAL CDN URL), or null.
   * Omitted on hand-built fixtures means null. Never a raw MAL `main_picture` object.
   */
  readonly poster?: string | null;
};

export type AnimeDiscoveryProvider = {
  searchByTitle(query: string): Promise<ReadonlyArray<AnimeDiscoveryCandidate>>;
  getSimilarByCanonicalAnime(
    anime: CanonicalAnime,
  ): Promise<ReadonlyArray<AnimeDiscoveryCandidate>>;
  getByMalId(malId: number): Promise<AnimeDiscoveryCandidate | null>;
};

export type DiscoveryLookup =
  | { readonly kind: 'search'; readonly query: string }
  | { readonly kind: 'similar'; readonly slug: string };

const DISCOVERY_QUERY_MIN = 3;

export function discoveryLookupTarget(
  intent: AnimeIntent,
  resolution: AnimeResolution,
): DiscoveryLookup | null {
  if (intent.kind === 'similar') {
    return resolution.status === 'resolved'
      ? { kind: 'similar', slug: resolution.anime.slug }
      : null;
  }
  if (resolution.status !== 'unknown') return null;
  const query = intent.title.trim();
  return query.length >= DISCOVERY_QUERY_MIN
    ? { kind: 'search', query }
    : null;
}

export function canonicalizeDiscoveryCandidate(
  candidate: AnimeDiscoveryCandidate,
  catalog: ReadonlyArray<CanonicalAnime> = getAllAnime(),
): CanonicalAnime {
  const existing = catalog.find(
    (anime) => malIdForSlug(anime.slug) === candidate.malId,
  );
  if (existing) return existing;

  return {
    id: `anime.discovered.${candidate.malId}`,
    canonicalTitle: candidate.title,
    alternateTitles: candidate.alternateTitle ? [candidate.alternateTitle] : [],
    slug: discoveredSlugForMalId(candidate.malId),
    synopsis: 'A destination found beyond the known catalog.',
    year: candidate.year,
    type: candidate.type,
    episodeCount: candidate.episodeCount,
    status: candidate.status,
    genres: candidate.genres,
    studios: candidate.studios,
    poster: validateAnimePosterSource(candidate.poster ?? null),
    officialUrl: null,
    ratings: { mal: null, crunchyroll: null },
  };
}

function mediaType(value: unknown): AnimeType {
  switch (asString(value)) {
    case 'movie':
      return 'movie';
    case 'ova':
      return 'ova';
    case 'ona':
      return 'ona';
    case 'special':
    case 'tv_special':
      return 'special';
    default:
      return 'tv';
  }
}

function mediaStatus(value: unknown): AnimeStatus {
  switch (asString(value)) {
    case 'currently_airing':
      return 'airing';
    case 'not_yet_aired':
      return 'upcoming';
    default:
      return 'finished';
  }
}

function yearFromStartDate(value: unknown): number | null {
  const start = asString(value);
  if (!start) return null;
  const year = Number(start.slice(0, 4));
  return Number.isInteger(year) && year > 1900 ? year : null;
}

function alternateTitle(
  title: string,
  alternatives: Record<string, unknown> | null,
): string | null {
  if (!alternatives) return null;
  const english = asString(alternatives.en);
  if (english && english !== title) return english;
  return null;
}

export function normalizeMalDiscoveryNode(
  value: unknown,
): AnimeDiscoveryCandidate | null {
  const node = asRecord(value);
  if (!node) return null;
  const malId = asFiniteNumber(node.id);
  const title = asString(node.title);
  if (malId == null || malId <= 0 || !title) return null;

  return {
    malId,
    title,
    alternateTitle: alternateTitle(title, asRecord(node.alternative_titles)),
    year: yearFromStartDate(node.start_date),
    type: mediaType(node.media_type),
    episodeCount: asFiniteNumber(node.num_episodes),
    status: mediaStatus(node.status),
    genres: namedList(node.genres),
    studios: namedList(node.studios),
    synopsis: asString(node.synopsis),
    poster: malMainPicturePoster(node.main_picture),
  };
}

export function normalizeMalDiscoveryPayload(
  payload: unknown,
): ReadonlyArray<AnimeDiscoveryCandidate> {
  const record = asRecord(payload);
  if (!record || !Array.isArray(record.data)) return [];
  return record.data.flatMap((entry) => {
    const node = asRecord(entry)?.node ?? entry;
    const candidate = normalizeMalDiscoveryNode(node);
    return candidate ? [candidate] : [];
  });
}
