/**
 * Continue From This Place — TASK-061.
 *
 * Singular journey resume derived from Memory newest entry.
 * Presentation mapping + resolution only. Arrival stays in WorldNavigator
 * via existing arriveAnime / discovered hydrate. Not a second store.
 */

import {
  discoveredMalIdFromSlug,
  discoveredSlugForMalId,
} from '@/shared/anime/anime.mal.identity';
import {
  recentMemories,
  type MemoryEntry,
  type MemoryStore,
} from '@/shared/anime/anime.memory';
import { getAnimeById, getAnimeBySlug } from '@/shared/anime/anime.repository';
import type { CanonicalAnime } from '@/shared/anime/anime.types';

/**
 * useSyncExternalStore requires getSnapshot to return a cached reference when
 * the underlying value is unchanged. recentMemories() always allocates, so we
 * retain the last newest entry and reuse it when fields match.
 */
let cachedNewestMemory: MemoryEntry | null = null;

export function memoryEntryEquals(
  a: MemoryEntry | null,
  b: MemoryEntry | null,
): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  return (
    a.animeId === b.animeId &&
    a.slug === b.slug &&
    a.lastArrivedAt === b.lastArrivedAt &&
    a.title === b.title
  );
}

/** Client getSnapshot for the V1 Continue candidate source. */
export function readNewestMemorySnapshot(
  store?: MemoryStore,
): MemoryEntry | null {
  const next = recentMemories(1, store)[0] ?? null;
  if (memoryEntryEquals(cachedNewestMemory, next)) {
    return cachedNewestMemory;
  }
  cachedNewestMemory = next;
  return cachedNewestMemory;
}

/** SSR / hydration getServerSnapshot — Memory is browser-only. */
export function readNewestMemoryServerSnapshot(): MemoryEntry | null {
  return null;
}

/** Test / hot-reload helper — clears the snapshot cache. */
export function resetNewestMemorySnapshotCache(): void {
  cachedNewestMemory = null;
}

export type ContinueArrival =
  | { readonly kind: 'catalog'; readonly anime: CanonicalAnime }
  | {
      readonly kind: 'discovered';
      readonly animeId: string;
      readonly slug: string;
      readonly malId: number;
    }
  | { readonly kind: 'unresolvable'; readonly entry: MemoryEntry };

export type ContinueCandidate = {
  readonly entry: MemoryEntry;
  readonly arrival: Exclude<ContinueArrival, { kind: 'unresolvable' }>;
};

export const WORLD_NAVIGATOR_CONTINUE = {
  labelPrefix: 'Continue to',
  context: 'Return to this place',
} as const;

/** Display title for Continue — Memory title, else catalog title, else slug. */
export function continueDestinationTitle(entry: MemoryEntry): string {
  const remembered = entry.title?.trim();
  if (remembered && remembered.length > 0) return remembered;
  const byId = getAnimeById(entry.animeId);
  if (byId) return byId.canonicalTitle;
  const bySlug = getAnimeBySlug(entry.slug);
  if (bySlug) return bySlug.canonicalTitle;
  return entry.slug;
}

export function continueControlLabel(entry: MemoryEntry): string {
  return `${WORLD_NAVIGATOR_CONTINUE.labelPrefix} ${continueDestinationTitle(entry)}`;
}

/**
 * Resolve a Memory place into the existing catalog / discovered arrival shapes.
 * Mirrors watchlist return discipline — never fabricates CanonicalAnime.
 */
export function resolveContinueArrival(entry: MemoryEntry): ContinueArrival {
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

/**
 * V1 candidate: newest Memory entry when Idle (not already at that place)
 * and the place can resolve through existing arrival paths.
 */
export function resolveContinueCandidate(
  newest: MemoryEntry | undefined,
  arrivedAnimeId: string | null | undefined,
): ContinueCandidate | null {
  if (!newest) return null;
  if (arrivedAnimeId && newest.animeId === arrivedAnimeId) return null;
  const arrival = resolveContinueArrival(newest);
  if (arrival.kind === 'unresolvable') return null;
  return { entry: newest, arrival };
}

export function hydratedAnimeMatchesContinueEntry(
  entry: MemoryEntry,
  anime: CanonicalAnime,
): boolean {
  return anime.id === entry.animeId && anime.slug === entry.slug;
}
