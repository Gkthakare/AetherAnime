'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { useReducedMotion } from 'framer-motion';
import Image from 'next/image';

import { BLUR_RADIUS } from '@/shared/lib/graphics';
import { DURATION } from '@/shared/lib/motion';
import { cn } from '@/lib/utils';

import { animeArrivalAtmosphere } from './anime-arrival-atmosphere';
import {
  ARRIVAL_ATMOSPHERE_OFFSET,
  ARRIVAL_ATMOSPHERE_PROJECTION,
  ARRIVAL_ATMOSPHERE_SCALE,
  ARRIVAL_ATMOSPHERE_SIZES,
} from './anime-arrival-atmosphere.motion';
import './anime-arrival-atmosphere.css';

function playAnimation(node: HTMLElement | null, animation: string): void {
  if (!node) return;
  node.style.animation = 'none';
  node.getBoundingClientRect();
  node.style.animation = animation;
}

/**
 * Decorative anime environmental field (TASK-075 Option D).
 * Source is arrivedAnime.poster — local catalog or validated MAL CDN.
 * Pointer-inert, hidden from the accessibility tree.
 */
export function AnimeArrivalAtmosphere({
  poster,
}: {
  readonly poster: string | null;
}) {
  const reduceMotion = useReducedMotion();
  const presentation = animeArrivalAtmosphere({
    poster,
    reduceMotion: !!reduceMotion,
  });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!presentation.active || !presentation.source) return;
    const animation = presentation.spatial
      ? `aether-arrival-atmosphere ${DURATION.CINEMATIC}s linear forwards`
      : `aether-arrival-atmosphere-reduced ${DURATION.NORMAL}s linear forwards`;
    playAnimation(ref.current, animation);
    // Replay only when Destination poster identity changes — not on ordinary re-renders.
  }, [presentation.active, presentation.spatial, presentation.source]);

  if (!presentation.active || !presentation.source) return null;

  return (
    <div
      data-slot="anime-arrival-atmosphere"
      data-atmosphere-poster={presentation.source}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        ref={ref}
        className={cn('aether-arrival-atmosphere-wash', ARRIVAL_ATMOSPHERE_PROJECTION)}
        style={
          {
            '--arrival-atmosphere-blur': BLUR_RADIUS.lg,
            '--arrival-atmosphere-offset-x': ARRIVAL_ATMOSPHERE_OFFSET.x,
            '--arrival-atmosphere-offset-y': ARRIVAL_ATMOSPHERE_OFFSET.y,
            '--arrival-atmosphere-scale-enter': ARRIVAL_ATMOSPHERE_SCALE.enter,
            '--arrival-atmosphere-scale-settled': ARRIVAL_ATMOSPHERE_SCALE.settled,
          } as CSSProperties
        }
      >
        <Image
          src={presentation.source}
          alt=""
          fill
          sizes={ARRIVAL_ATMOSPHERE_SIZES}
          className="object-contain"
        />
      </div>
    </div>
  );
}
