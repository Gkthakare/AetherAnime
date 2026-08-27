/**
 * Watchlist return path. Not a resolver. Not a second store.
 *
 * Persisted { animeId, slug } rows re-enter the existing catalog repository
 * or discovered hydration. CanonicalAnime is never fabricated here.
 */

import {
  discoveredMalIdFromSlug,
  discoveredSlugForMalId,
} from './anime.mal.identity';
import { getAnimeById, getAnimeBySlug } from './anime.repository';
import type { CanonicalAnime } from './anime.types';
import type { WatchlistEntry } from './anime.watchlist';

const WATCHLIST_RETURN_QUERY =
  /^(my\s+)?watchlist$|^saved(\s+(anime|titles?|destinations?))?$/i;

export type WatchlistReturn =
  | { readonly kind: 'catalog'; readonly anime: CanonicalAnime }
  | {
      readonly kind: 'discovered';
      readonly animeId: string;
      readonly slug: string;
      readonly malId: number;
    }
  | { readonly kind: 'unresolvable'; readonly entry: WatchlistEntry };

export type WatchlistReturnRow =
  | {
      readonly kind: 'catalog';
      readonly entry: WatchlistEntry;
      readonly anime: CanonicalAnime;
    }
  | {
      readonly kind: 'discovered';
      readonly entry: WatchlistEntry;
      readonly animeId: string;
      readonly slug: string;
      readonly malId: number;
    };

export function isWatchlistReturnQuery(query: string): boolean {
  return WATCHLIST_RETURN_QUERY.test(query.trim());
}

export function resolveWatchlistReturn(
  entry: WatchlistEntry,
): WatchlistReturn {
  const byId = getAnimeById(entry.animeId);
  const bySlug = getAnimeBySlug(entry.slug);
  if (byId && bySlug && byId.id === bySlug.id) {
    return { kind: 'catalog', anime: byId };
  }
  if (byId || bySlug) {
    return { kind: 'unresolvable', entry };
  }

  const malId = discoveredMalIdFromSlug(entry.slug);
  if (
    malId != null &&
    entry.slug === discoveredSlugForMalId(malId) &&
    entry.animeId === `anime.discovered.${malId}`
  ) {
    return {
      kind: 'discovered',
      animeId: entry.animeId,
      slug: entry.slug,
      malId,
    };
  }

  return { kind: 'unresolvable', entry };
}

export function watchlistReturnRows(
  entries: ReadonlyArray<WatchlistEntry>,
): ReadonlyArray<WatchlistReturnRow> {
  const rows: WatchlistReturnRow[] = [];
  for (const entry of entries) {
    const resolved = resolveWatchlistReturn(entry);
    if (resolved.kind === 'catalog') {
      rows.push({ kind: 'catalog', entry, anime: resolved.anime });
    } else if (resolved.kind === 'discovered') {
      rows.push({
        kind: 'discovered',
        entry,
        animeId: resolved.animeId,
        slug: resolved.slug,
        malId: resolved.malId,
      });
    }
  }
  return rows;
}

export function watchlistReturnLabel(row: WatchlistReturnRow): string {
  if (row.kind === 'catalog') return row.anime.canonicalTitle;
  const title = row.entry.title?.trim();
  return title && title.length > 0 ? title : row.slug;
}

/**
 * Discovered hydration is valid only when CanonicalAnime exactly matches
 * the persisted watchlist identity. Catalog remap is not a silent migration.
 */
export function hydratedAnimeMatchesWatchlistRow(
  entry: WatchlistEntry,
  anime: CanonicalAnime,
): boolean {
  return anime.id === entry.animeId && anime.slug === entry.slug;
}
