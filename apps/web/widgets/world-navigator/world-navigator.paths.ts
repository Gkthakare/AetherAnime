/**
 * World-native candidate paths — presentation mapping only.
 *
 * Does not resolve, arrive, or fetch. Selection remains in WorldNavigator.
 */

import type { WatchlistReturnRow } from '@/shared/anime';
import type { AnimeDiscoveryCandidate } from '@/shared/anime/anime.discovery';
import { ANIME_TYPE_LABEL } from '@/shared/anime/anime.labels';
import type { AnimeType, CanonicalAnime } from '@/shared/anime/anime.types';
import { watchlistReturnLabel } from '@/shared/anime/anime.watchlist-return';

import { WORLD_NAVIGATOR_COPY } from './world-navigator.constants';

export type NavigatorPathView = {
  readonly key: string;
  readonly title: string;
  readonly meta: string | null;
  readonly context: string | null;
};

/** Plate-edge path, not a search card. */
export const WORLD_NAVIGATOR_PATH = {
  list: 'flex w-full max-w-md flex-col items-stretch',
  item: [
    'relative w-full py-2 pl-3 text-left',
    'border-b border-border/30',
    "before:absolute before:top-1 before:bottom-1 before:left-0 before:w-px before:bg-border/50 before:content-['']",
    'text-foreground/85',
    'outline-none transition-colors motion-reduce:transition-none',
    'hover:border-ring/50 hover:text-foreground hover:before:bg-ring hover:before:w-0.5',
    'focus-visible:border-ring focus-visible:text-foreground',
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  ].join(' '),
  title: 'block text-sm leading-snug',
  meta: 'mt-0.5 block text-[0.625rem] tracking-[0.08em] text-muted-foreground/80',
  context:
    'mt-0.5 block text-[0.5625rem] uppercase tracking-[0.18em] text-muted-foreground/70',
} as const;

export function navigatorPathMeta(
  year: number | null,
  type: AnimeType | null,
): string | null {
  const parts: string[] = [];
  if (year != null) parts.push(String(year));
  if (type) parts.push(ANIME_TYPE_LABEL[type]);
  return parts.length > 0 ? parts.join(' · ') : null;
}

export function navigatorPathFromCatalog(
  anime: CanonicalAnime,
): NavigatorPathView {
  return {
    key: anime.id,
    title: anime.canonicalTitle,
    meta: navigatorPathMeta(anime.year, anime.type),
    context: null,
  };
}

export function navigatorPathsFromCatalog(
  candidates: ReadonlyArray<CanonicalAnime>,
): ReadonlyArray<NavigatorPathView> {
  return candidates.map(navigatorPathFromCatalog);
}

export function navigatorPathFromDiscovery(
  candidate: AnimeDiscoveryCandidate & { readonly matchReason?: string | null },
): NavigatorPathView {
  const reason = candidate.matchReason?.trim();
  return {
    key: `discovered:${candidate.malId}`,
    title: candidate.title,
    meta: navigatorPathMeta(candidate.year, candidate.type),
    context: reason && reason.length > 0 ? reason : null,
  };
}

export function navigatorPathFromWatchlist(
  row: WatchlistReturnRow,
): NavigatorPathView {
  if (row.kind === 'catalog') {
    return {
      key: row.entry.animeId,
      title: watchlistReturnLabel(row),
      meta: navigatorPathMeta(row.anime.year, row.anime.type),
      context: null,
    };
  }
  return {
    key: row.entry.animeId,
    title: watchlistReturnLabel(row),
    meta: null,
    context: WORLD_NAVIGATOR_COPY.savedDestination,
  };
}
