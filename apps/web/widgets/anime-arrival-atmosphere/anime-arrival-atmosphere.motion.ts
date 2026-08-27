/**
 * Arrival atmosphere motion — poster-derived projection during TASK-031.
 *
 * Opacity + scale only. Blur stays constant so the poster never flashes
 * sharp. CSS owns the beat. No timers, no navigation delay.
 */

import { DURATION } from '@/shared/lib/motion';

/** Subtle remaining travel after the oversized projection is already in place. */
export const ARRIVAL_ATMOSPHERE_SCALE = {
  enter: 1.1,
  settled: 1.06,
} as const;

/** Viewport overscan — environmental, not tied to foreground poster width. */
export const ARRIVAL_ATMOSPHERE_PROJECTION =
  'absolute inset-[-28%]' as const;

/**
 * Optimizer hint for the environmental field. Keep decode budget bounded;
 * CSS overscans the layer, not a 140vw request.
 */
export const ARRIVAL_ATMOSPHERE_SIZES =
  '(max-width: 767px) 100vw, 1100px' as const;

export const ARRIVAL_ATMOSPHERE_OFFSET = {
  x: '-1.5%',
  y: '-1%',
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
      1.085,
      1.07,
      ARRIVAL_ATMOSPHERE_SCALE.settled,
    ],
  };
}
