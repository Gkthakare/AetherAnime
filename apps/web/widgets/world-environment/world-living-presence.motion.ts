/**
 * Living presence motion — quiet idle breath, slower than a crossing.
 *
 * Transform + opacity only. CSS owns the loop. Values here are the
 * contract the CSS keyframes must match.
 */

import { DISTANCE, DURATION, SCALE } from '@/shared/lib/motion';

/** Periods in seconds. Longer than UI motion; shorter than a screensaver. */
export const LIVING_PRESENCE_PERIOD = {
  light: DURATION.CINEMATIC * 16,
  depth: DURATION.CINEMATIC * 18,
  haze: DURATION.CINEMATIC * 20,
} as const;

export const LIVING_PRESENCE_SCALE = {
  rest: SCALE.TO,
  peak: 1.018,
} as const;

export function livingPresenceTravel(reduceMotion: boolean): {
  readonly scale: number | number[];
  readonly y: number | number[];
} {
  if (reduceMotion) {
    return { scale: SCALE.TO, y: 0 };
  }
  return {
    scale: [SCALE.TO, LIVING_PRESENCE_SCALE.peak, SCALE.TO],
    y: [0, -(DISTANCE.SM / 2), 0],
  };
}
