/**
 * Verified watch-path model.
 *
 * Watch Now is enabled only for a verified https destination.
 * Official catalog URLs are official anime information/access sites,
 * not playable streaming sessions.
 *
 * Crunchyroll stays `unknown` until an officially supported consumer
 * availability API exists. Unknown is not treated as unavailable.
 *
 * MAL does not resolve watch paths. Voice does not resolve watch paths.
 */

import type { AnimeResolution, CanonicalAnime } from './anime.types';

export const ANIME_WATCH_PROVIDERS = ['official', 'crunchyroll'] as const;
export type AnimeWatchProviderKind = (typeof ANIME_WATCH_PROVIDERS)[number];

export const ANIME_WATCH_STATUSES = [
  'verified',
  'unavailable',
  'unknown',
] as const;
export type AnimeWatchStatus = (typeof ANIME_WATCH_STATUSES)[number];

export type AnimeWatchPath = {
  readonly provider: AnimeWatchProviderKind;
  readonly status: AnimeWatchStatus;
  readonly url: string | null;
};

export type AnimeWatchPathProvider = {
  getByCanonicalAnime(
    anime: CanonicalAnime,
  ): ReadonlyArray<AnimeWatchPath>;
};

const REJECTED_HOSTS =
  /myanimelist|anilist|nyaa|1337x|gogoanime|crunchyroll\.com\/watch/i;

export function isVerifiedWatchUrl(value: string | null): value is string {
  if (value == null || value.trim().length === 0) return false;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return false;
    if (url.hostname.length === 0) return false;
    if (REJECTED_HOSTS.test(url.href)) return false;
    return true;
  } catch {
    return false;
  }
}

function officialWatchPath(anime: CanonicalAnime): AnimeWatchPath {
  if (isVerifiedWatchUrl(anime.officialUrl)) {
    return {
      provider: 'official',
      status: 'verified',
      url: anime.officialUrl,
    };
  }
  return {
    provider: 'official',
    status: 'unavailable',
    url: null,
  };
}

function crunchyrollWatchPath(): AnimeWatchPath {
  return {
    provider: 'crunchyroll',
    status: 'unknown',
    url: null,
  };
}

export function watchPathsForAnime(
  anime: CanonicalAnime,
): ReadonlyArray<AnimeWatchPath> {
  return [officialWatchPath(anime), crunchyrollWatchPath()];
}

export function verifiedWatchUrl(
  paths: ReadonlyArray<AnimeWatchPath>,
): string | null {
  const verified = paths.find(
    (path) =>
      path.status === 'verified' && isVerifiedWatchUrl(path.url),
  );
  return verified?.url ?? null;
}

/** Watch paths are derived only after the local resolver has a single anime. */
export function watchPathLookupTarget(
  resolution: AnimeResolution,
): string | null {
  return resolution.status === 'resolved' ? resolution.anime.slug : null;
}

export const catalogWatchPathProvider: AnimeWatchPathProvider = {
  getByCanonicalAnime(anime) {
    return watchPathsForAnime(anime);
  },
};
