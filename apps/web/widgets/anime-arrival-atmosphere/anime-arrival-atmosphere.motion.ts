/**
 * Arrival atmosphere motion — poster-derived projection (TASK-080 contain field).
 *
 * Opacity + scale only. Blur stays constant so the poster never flashes
 * sharp. CSS owns the beat. No timers, no navigation delay.
 */

import { DURATION } from '@/shared/lib/motion';

/** Subtle settle travel — not crop-era overscan scale. */
export const ARRIVAL_ATMOSPHERE_SCALE = {
  enter: 1.04,
  settled: 1.0,
} as const;

/**
 * Full-viewport field. Contain fit preserves poster AR; vignette blends
 * unused regions into the Destination grade (no letterbox bars).
 */
export const ARRIVAL_ATMOSPHERE_PROJECTION = 'absolute inset-0' as const;

/**
 * Optimizer hint for the environmental field. Keep decode budget bounded;
 * CSS overscans the layer, not a 140vw request.
 */
export const ARRIVAL_ATMOSPHERE_SIZES =
  '(max-width: 767px) 100vw, 1100px' as const;

export const ARRIVAL_ATMOSPHERE_OFFSET = {
  x: '0%',
  y: '0%',
} as const;

/** 0 / ~400 / ~700 / 1200ms of DURATION.CINEMATIC. */
export const ARRIVAL_ATMOSPHERE_TIMES = [0, 0.33, 0.58, 1] as const;

export const ARRIVAL_ATMOSPHERE_OPACITY = {
  rest: 0,
  emerge: 0.55,
  settle: 0.82,
} as const;

export const arrivalAtmosphereDuration = DURATION.CINEMATIC;

export function arrivalAtmosphereTravel(reduceMotion: boolean): {
  readonly scale: number | number[];
} {
  if (reduceMotion) {
    return { scale: ARRIVAL_ATMOSPHERE_SCALE.settled };
  }
  return {
    scale: [
      ARRIVAL_ATMOSPHERE_SCALE.enter,
      1.03,
      1.015,
      ARRIVAL_ATMOSPHERE_SCALE.settled,
    ],
  };
}
