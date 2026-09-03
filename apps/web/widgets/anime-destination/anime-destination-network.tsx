'use client';

/**
 * Spatial neighboring-universe network — TASK-099 / TASK-100.
 * Derived from current destination + real similar candidates.
 * Optional ephemeral journeyOrigin is a residual spatial trace, not a trail list.
 * Travel remains arriveAnime via onSelect / onReturn — no second transport.
 */

import { useId, useState } from 'react';
import Image from 'next/image';

import type { AnimeDiscoveryCandidate, CanonicalAnime } from '@/shared/anime';
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
  readonly journeyOrigin?: CanonicalAnime | null;
  readonly onSelect: (key: string) => void;
  readonly onReturn?: () => void;
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
  journeyOrigin = null,
  onSelect,
  onReturn,
  className,
}: AnimeUniverseNetworkProps) {
  const labelId = useId();
  const [focused, setFocused] = useState<NeighborFocusKey>(null);
  const worlds = candidates.slice(0, ANIME_UNIVERSE_NETWORK_MAX);
  if (worlds.length === 0 && !journeyOrigin) return null;

  const clearFocus = () => setFocused(null);
  const originPoster = validateAnimePosterSource(journeyOrigin?.poster ?? null);
  const hasJourney = journeyOrigin != null;

  return (
    <div
      data-slot="anime-universe-network"
      data-neighbor-count={worlds.length}
      data-neighbor-focus={focused ?? 'none'}
      data-universe-journey={hasJourney ? 'continued' : 'first'}
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

      {hasJourney ? (
        <div data-slot="anime-universe-journey-trace">
          <button
            type="button"
            data-slot="anime-universe-journey-return"
            aria-label={`Travel to ${journeyOrigin.canonicalTitle}`}
            onClick={() => onReturn?.()}
            onFocus={() => setFocused('journey-origin')}
            onBlur={clearFocus}
            onPointerEnter={() => setFocused('journey-origin')}
            onPointerLeave={clearFocus}
            className={cn(
              'min-h-11 flex flex-col items-center gap-2 text-left outline-none',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              legibility.copy,
            )}
          >
            <span
              data-slot="anime-universe-journey-field"
              aria-hidden="true"
            >
              {originPoster ? (
                <Image
                  src={originPoster}
                  alt=""
                  fill
                  sizes="96px"
                  className="object-cover object-center"
                />
              ) : (
                <span data-slot="anime-universe-neighbor-seal" />
              )}
            </span>
            <span
              className={cn(
                'text-[0.5rem] uppercase tracking-[0.28em] text-muted-foreground/50',
                legibility.copy,
              )}
            >
              {ANIME_DESTINATION_COPY.journeyFrom}
            </span>
            <span
              data-slot="anime-universe-journey-title"
              className={cn(
                'max-w-[10rem] text-center text-[0.6875rem] uppercase tracking-[0.14em] text-foreground/55',
                legibility.copy,
              )}
            >
              {journeyOrigin.canonicalTitle}
            </span>
          </button>
        </div>
      ) : null}

      <div data-slot="anime-universe-network-origin" aria-hidden="true">
        <span data-slot="anime-universe-network-node" />
        <span className={legibility.copy}>
          {ANIME_DESTINATION_COPY.networkOrigin}
        </span>
        <span className={legibility.copy}>{originTitle}</span>
      </div>

      {worlds.length > 0 ? (
        <ul data-slot="anime-universe-network-constellation" role="list">
          {worlds.map((candidate, index) => {
            const path = navigatorPathFromDiscovery(candidate);
            const poster = validateAnimePosterSource(candidate.poster ?? null);
            const state =
              focused === 'journey-origin'
                ? 'receded'
                : neighborState(path.key, focused);
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
                  <span
                    data-slot="anime-universe-neighbor-field"
                    aria-hidden="true"
                  >
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
      ) : null}
    </div>
  );
}
