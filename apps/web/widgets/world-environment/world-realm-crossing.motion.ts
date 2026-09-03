/**
 * Realm crossing motion — one-shot spacetime warp (TASK-096).
 *
 * Gravitational pull → black hole → emergence. Transform + opacity only.
 * Local to WorldEnvironment. No loops, no navigation delay.
 */

import type { Transition } from 'framer-motion';

import { DISTANCE, DURATION, EASING, SCALE } from '@/shared/lib/motion';

/** Fractions of DURATION.WARP. */
export const REALM_CROSSING_TIMES = [0, 0.16, 0.38, 0.58, 1] as const;

export const REALM_CROSSING_SCALE = {
  rest: SCALE.TO,
  anticipate: 1.06,
  travel: 1.18,
  peak: 1.42,
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

export const realmCrossingVeilOpacity = [0, 0.42, 0.88, 1, 0] as const;

export const realmCrossingApertureScale = [1.18, 0.92, 0.48, 1.35, 2.4] as const;

export const realmCrossingApertureOpacity = [0, 0.55, 0.82, 0.35, 0] as const;

export const realmCrossingGateScale = [0.08, 0.18, 0.32, 1.15, 5.4] as const;

export const realmCrossingGateOpacity = [0, 0.9, 1, 0.55, 0] as const;

export const realmCrossingClimateOpacity = [0, 0.22, 0.4, 0.18, 0] as const;
