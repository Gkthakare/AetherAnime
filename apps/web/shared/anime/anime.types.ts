/**
 * Canonical anime contracts — first-slice catalog only.
 *
 * Provider scores stay provider-specific and nullable. This module does not
 * import MAL or Crunchyroll types; future adapters live behind AnimeRepository.
 */

export type AnimeId = string;

export const ANIME_TYPES = ['tv', 'movie', 'ova', 'ona', 'special'] as const;
export type AnimeType = (typeof ANIME_TYPES)[number];

export const ANIME_STATUSES = ['finished', 'airing', 'upcoming'] as const;
export type AnimeStatus = (typeof ANIME_STATUSES)[number];

/** Provider-specific scores. Null means the provider has not been queried. */
export type ProviderRatings = {
  readonly mal: number | null;
  readonly crunchyroll: number | null;
};

export type CanonicalAnime = {
  readonly id: AnimeId;
  readonly canonicalTitle: string;
  readonly alternateTitles: ReadonlyArray<string>;
  readonly slug: string;
  readonly synopsis: string;
  readonly year: number | null;
  readonly type: AnimeType;
  readonly episodeCount: number | null;
  readonly status: AnimeStatus;
  readonly genres: ReadonlyArray<string>;
  readonly studios: ReadonlyArray<string>;
  /**
   * Validated presentation artwork, or null when none is usable.
   * Local catalog path (`/assets/aetheranime/anime/…-poster.webp`) or
   * HTTPS `cdn.myanimelist.net/images/anime/…` URL (TASK-074). Never arbitrary remotes.
   */
  readonly poster: string | null;
  /** Verified official destination (information/access site). Null means none is verified. Not a streaming playback URL. */
  readonly officialUrl: string | null;
  readonly ratings: ProviderRatings;
};

export type AnimeResolution =
  | { readonly status: 'resolved'; readonly anime: CanonicalAnime }
  | {
      readonly status: 'ambiguous';
      readonly query: string;
      readonly candidates: ReadonlyArray<CanonicalAnime>;
    }
  | { readonly status: 'unknown'; readonly query: string };

/**
 * Honest catalog-only provider. Not a MAL or Crunchyroll adapter.
 * Those remain future server/authorized adapters — they are not stubbed here.
 */
export type CatalogAnimeProvider = {
  readonly kind: 'catalog';
  getAll(): ReadonlyArray<CanonicalAnime>;
  getById(id: AnimeId): CanonicalAnime | undefined;
  getBySlug(slug: string): CanonicalAnime | undefined;
};
