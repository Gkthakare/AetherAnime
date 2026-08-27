/**
 * Realm crossing motion — one-shot cinematic arrival beat.
 *
 * Anticipation → travel → peak → release. Transform + opacity only.
 * Local to WorldEnvironment. No loops, no navigation delay.
 */

import type { Transition } from 'framer-motion';

import { DISTANCE, DURATION, EASING, SCALE } from '@/shared/lib/motion';

/** 0 / 180 / 600 / 800 / 1200ms of DURATION.CINEMATIC. */
export const REALM_CROSSING_TIMES = [0, 0.15, 0.5, 0.67, 1] as const;

export const REALM_CROSSING_SCALE = {
  rest: SCALE.TO,
  anticipate: 1.02,
  travel: 1.055,
  peak: 1.09,
} as const;

export const realmCrossingTransition: Transition = {
  duration: DURATION.CINEMATIC,
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
      -(DISTANCE.SM / 3),
      -(DISTANCE.SM * 2) / 3,
      -(DISTANCE.SM / 2),
      0,
    ],
  };
}

export const realmCrossingVeilOpacity = [0, 0.5, 0.72, 0.86, 0] as const;

export const realmCrossingApertureScale = [1.28, 1.12, 0.9, 0.72, 1.24] as const;

export const realmCrossingApertureOpacity = [0, 0.58, 0.82, 0.94, 0] as const;

export const realmCrossingGateScale = [0.7, 0.88, 1.16, 1.42, 1] as const;

export const realmCrossingGateOpacity = [0, 0.4, 0.72, 1, 0] as const;

export const realmCrossingClimateOpacity = [0, 0.28, 0.48, 0.62, 0] as const;
