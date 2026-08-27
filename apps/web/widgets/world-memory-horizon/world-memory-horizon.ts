import type { MemoryEntry } from '@/shared/anime/anime.memory';

import {
  MEMORY_HORIZON_DESKTOP_LIMIT,
  MEMORY_HORIZON_HARD_MAX,
  MEMORY_HORIZON_OPACITY,
  MEMORY_HORIZON_SLOTS,
} from './world-memory-horizon.constants';

export type MemoryHorizonMark = {
  readonly animeId: string;
  readonly index: number;
  readonly topPct: number;
  readonly trailingPct: number;
  readonly opacity: number;
};

/**
 * Map a recency-ordered Memory slice to stable atmospheric marks.
 *
 * Caller supplies already-bounded `recentMemories(n)`. This function never
 * sorts, never writes Memory, and never invents positions at runtime.
 */
export function memoryHorizonMarks(
  entries: ReadonlyArray<MemoryEntry>,
): ReadonlyArray<MemoryHorizonMark> {
  const limit = Math.min(
    MEMORY_HORIZON_DESKTOP_LIMIT,
    MEMORY_HORIZON_HARD_MAX,
    MEMORY_HORIZON_SLOTS.length,
  );
  return entries.slice(0, limit).map((entry, index) => {
    const slot = MEMORY_HORIZON_SLOTS[index]!;
    const opacity = MEMORY_HORIZON_OPACITY[index]!;
    return {
      animeId: entry.animeId,
      index,
      topPct: slot.topPct,
      trailingPct: slot.trailingPct,
      opacity,
    };
  });
}
