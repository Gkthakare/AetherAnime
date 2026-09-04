/**
 * Realm crossing motion — one-shot spacetime warp (TASK-096 / TASK-104).
 *
 * Environmental compression → dimensional seam → aperture → emergence.
 * Transform + opacity only. Local to WorldEnvironment. No loops.
 */

import type { Transition } from 'framer-motion';

import { DISTANCE, DURATION, EASING, SCALE } from '@/shared/lib/motion';

/** Fractions of DURATION.WARP. */
export const REALM_CROSSING_TIMES = [0, 0.16, 0.38, 0.58, 1] as const;

export const REALM_CROSSING_SCALE = {
  rest: SCALE.TO,
  anticipate: 1.06,
  travel: 1.18,
  peak: 1.4,
} as const;

export const realmCrossingTransition: Transition = {
  duration: DURATION.WARP,
  ease: 'linear',
  times: [...REALM_CROSSING_TIMES],
};

export const realmCrossingReducedTransition: Transition = {
  duration: DURATION.NORMAL,
  ease: EASING.standard,
};

export function realmCrossingEnvironment(reduceMotion: boolean): {
  readonly scale: number | number[];
  readonly y: number | number[];
} {
  if (reduceMotion) {
    return { scale: SCALE.TO, y: 0 };
  }
  return {
    scale: [
      SCALE.TO,
      REALM_CROSSING_SCALE.anticipate,
      REALM_CROSSING_SCALE.travel,
      REALM_CROSSING_SCALE.peak,
      SCALE.TO,
    ],
    y: [
      0,
      -(DISTANCE.SM / 2),
      -(DISTANCE.SM / 6),
      0,
      0,
    ],
  };
}

export const realmCrossingVeilOpacity = [0, 0.38, 0.82, 0.96, 0] as const;

export const realmCrossingApertureScale = [1.18, 0.9, 0.36, 1.45, 2.4] as const;

export const realmCrossingApertureOpacity = [0, 0.55, 0.78, 0.28, 0] as const;

export const realmCrossingGateScale = [0.1, 0.2, 0.34, 1.05, 4.8] as const;

export const realmCrossingGateOpacity = [0, 0.85, 1, 0.42, 0] as const;

export const realmCrossingClimateOpacity = [0, 0.18, 0.34, 0.16, 0] as const;
