import type { Transition } from 'framer-motion';

import { DURATION, EASING } from '@/shared/lib/motion';
import {
  worldAmbientIntensity,
  type WorldAmbient,
  type WorldLifecycle,
} from '@/shared/world';

export const worldClimateEnterTransition: Transition = {
  duration: DURATION.SLOW,
  ease: EASING.cinematic,
};

export const worldClimateEnterTransitionReduced: Transition = {
  duration: DURATION.FAST,
  ease: EASING.standard,
};

/** Long Soft Aether drift — one ambient loop ceiling (existing). */
const WORLD_CLIMATE_DRIFT_PERIOD = DURATION.CINEMATIC * 18;

export const worldClimateDriftTransition: Transition = {
  duration: WORLD_CLIMATE_DRIFT_PERIOD,
  ease: EASING.cinematic,
  repeat: Infinity,
  repeatType: 'mirror',
};

/** Base peak from lifecycle — entry progression only. */
function worldClimateLifecyclePeak(lifecycle: WorldLifecycle): number {
  switch (lifecycle) {
    case 'pendingEntry':
      return 0.35;
    case 'receiving':
      return 0.5;
    case 'present':
      return 0.62;
    case 'engaged':
      return 0.72;
    case 'yielding':
      return 0.45;
    case 'released':
      return 0.2;
    default: {
      const _exhaustive: never = lifecycle;
      return _exhaustive;
    }
  }
}

/**
 * Peak opacity — Lifecycle × Ambient intensity.
 * Climate observes Ambient; does not interpret Presence directly.
 */
export function worldClimateOpacityPeak(
  lifecycle: WorldLifecycle,
  ambient: WorldAmbient,
): number {
  return Math.min(
    1,
    worldClimateLifecyclePeak(lifecycle) * worldAmbientIntensity(ambient),
  );
}

/** Ambient drift keyframes around peak — subconscious only. */
export function worldClimateDriftOpacity(
  lifecycle: WorldLifecycle,
  ambient: WorldAmbient,
): number[] {
  const peak = worldClimateOpacityPeak(lifecycle, ambient);
  const floor = Math.max(0.12, peak - 0.12);
  return [floor, peak, floor];
}

/** True when a single ambient opacity loop may run. */
export function worldClimateAllowsDrift(
  lifecycle: WorldLifecycle,
  reduceMotion: boolean,
  arrived = false,
  largeIdleSurface = false,
): boolean {
  if (reduceMotion || arrived || largeIdleSurface) return false;
  return lifecycle === 'present' || lifecycle === 'engaged';
}
