'use client';

import { useEffect, useState } from 'react';

import {
  recentMemories,
  subscribeMemory,
  type MemoryEntry,
} from '@/shared/anime/anime.memory';

import { MEMORY_HORIZON_DESKTOP_LIMIT } from './world-memory-horizon.constants';
import { memoryHorizonMarks } from './world-memory-horizon';
import './world-memory-horizon.css';

/**
 * World Memory Horizon — residual afterglow of places actually visited.
 *
 * Read-only over the TASK-057-A Memory domain. Idle-gated in CSS via
 * `world-scene:not([data-world-anime])`. Decorative only — never interactive.
 */
export function WorldMemoryHorizon() {
  const [entries, setEntries] = useState<ReadonlyArray<MemoryEntry>>([]);

  useEffect(() => {
    const sync = () => {
      setEntries(recentMemories(MEMORY_HORIZON_DESKTOP_LIMIT));
    };
    sync();
    return subscribeMemory(sync);
  }, []);

  const marks = memoryHorizonMarks(entries);
  if (marks.length === 0) return null;

  return (
    <div
      data-slot="world-memory-horizon"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[2]"
    >
      <div data-slot="world-memory-horizon-band">
        {marks.map((mark) => (
          <span
            key={mark.animeId}
            data-slot="world-memory-horizon-mark"
            data-memory-index={mark.index}
            style={{
              top: `${mark.topPct}%`,
              right: `${mark.trailingPct}%`,
              opacity: mark.opacity,
            }}
          />
        ))}
      </div>
    </div>
  );
}
