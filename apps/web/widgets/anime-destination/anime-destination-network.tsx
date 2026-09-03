'use client';

/**
 * Spatial neighboring-universe network — TASK-099.
 * Derived from current destination + real similar candidates.
 * Travel remains arriveAnime via onSelect — no second transport.
 */

import { useId, useState } from 'react';
import Image from 'next/image';

import type { AnimeDiscoveryCandidate } from '@/shared/anime';
import { validateAnimePosterSource } from '@/shared/anime';
import { legibility } from '@/shared/lib/graphics';
import { cn } from '@/lib/utils';
import { navigatorPathFromDiscovery } from '@/widgets/world-navigator/world-navigator.paths';

import {
  ANIME_DESTINATION_COPY,
  ANIME_UNIVERSE_NETWORK_MAX,
} from './anime-destination.constants';

export type NeighborFocusKey = string | null;

type AnimeUniverseNetworkProps = {
  readonly originTitle: string;
  readonly candidates: ReadonlyArray<AnimeDiscoveryCandidate>;
  readonly onSelect: (key: string) => void;
  readonly className?: string;
};

function neighborState(
  key: string,
  focused: NeighborFocusKey,
): 'idle' | 'prominent' | 'receded' {
  if (focused == null) return 'idle';
  return focused === key ? 'prominent' : 'receded';
}

export function AnimeUniverseNetwork({
  originTitle,
  candidates,
  onSelect,
  className,
}: AnimeUniverseNetworkProps) {
  const labelId = useId();
  const [focused, setFocused] = useState<NeighborFocusKey>(null);
  const worlds = candidates.slice(0, ANIME_UNIVERSE_NETWORK_MAX);
  if (worlds.length === 0) return null;

  const clearFocus = () => setFocused(null);

  return (
    <div
      data-slot="anime-universe-network"
      data-neighbor-count={worlds.length}
      data-neighbor-focus={focused ?? 'none'}
      className={cn(className)}
      aria-labelledby={labelId}
    >
      <h3
        id={labelId}
        className={cn(
          'text-[0.5625rem] uppercase tracking-[0.28em] text-muted-foreground/55',
          legibility.copy,
        )}
      >
        {ANIME_DESTINATION_COPY.neighbors}
      </h3>

      <div data-slot="anime-universe-network-origin" aria-hidden="true">
        <span data-slot="anime-universe-network-node" />
        <span className={legibility.copy}>
          {ANIME_DESTINATION_COPY.networkOrigin}
        </span>
        <span className={legibility.copy}>{originTitle}</span>
      </div>

      <ul data-slot="anime-universe-network-constellation" role="list">
        {worlds.map((candidate, index) => {
          const path = navigatorPathFromDiscovery(candidate);
          const poster = validateAnimePosterSource(candidate.poster ?? null);
          const state = neighborState(path.key, focused);
          return (
            <li
              key={path.key}
              data-slot="anime-universe-neighbor"
              data-neighbor-index={index}
              data-neighbor-state={state}
            >
              <button
                type="button"
                data-slot="anime-universe-neighbor-path"
                aria-label={`Travel to ${path.title}`}
                onClick={() => onSelect(path.key)}
                onFocus={() => setFocused(path.key)}
                onBlur={clearFocus}
                onPointerEnter={() => setFocused(path.key)}
                onPointerLeave={clearFocus}
                className={cn(
                  'min-h-11 w-full text-left outline-none',
                  'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  legibility.copy,
                )}
              >
                <span data-slot="anime-universe-neighbor-field" aria-hidden="true">
                  {poster ? (
                    <Image
                      src={poster}
                      alt=""
                      fill
                      sizes="(max-width: 639px) 42vw, 180px"
                      className="object-cover object-center"
                    />
                  ) : (
                    <span data-slot="anime-universe-neighbor-seal" />
                  )}
                </span>
                <span data-slot="anime-universe-neighbor-copy">
                  <span data-slot="anime-universe-neighbor-title">
                    {path.title}
                  </span>
                  {path.meta ? (
                    <span data-slot="anime-universe-neighbor-meta">
                      {path.meta}
                    </span>
                  ) : null}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
