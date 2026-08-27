/**
 * WorldKind motion — one-shot mount + Focus emphasis.
 *
 * Transform + opacity. No ambient loops. Ambient + Focus modulate emphasis.
 */

import type { Transition } from 'framer-motion';

import { DISTANCE, DURATION, EASING } from '@/shared/lib/motion';
import {
  WORLD_FOCUS_SCALE,
  worldAmbientIntensity,
  type WorldAmbient,
  type WorldFocusRegion,
  type WorldLifecycle,
} from '@/shared/world';
import { worldArrivalChromeOpacity } from '@/widgets/world-layout/world-arrival.presentation';

export const worldKindEnterTransition: Transition = {
  duration: DURATION.SLOW,
  ease: EASING.entrance,
};

export const worldKindEnterTransitionReduced: Transition = {
  duration: DURATION.FAST,
  ease: EASING.standard,
};

export const worldKindFocusTransition: Transition = {
  duration: DURATION.FAST,
  ease: EASING.standard,
};

export const worldKindEnterFrom = {
  opacity: 0,
  y: DISTANCE.SM / 2,
} as const;

export const worldKindEnterTo = {
  opacity: 1,
  y: 0,
} as const;

function worldKindLifecycleOpacity(lifecycle: WorldLifecycle): number {
  switch (lifecycle) {
    case 'pendingEntry':
      return 0.4;
    case 'receiving':
      return 0.75;
    case 'present':
      return 1;
    case 'engaged':
      return 1;
    case 'yielding':
      return 0.65;
    case 'released':
      return 0.25;
    default: {
      const _exhaustive: never = lifecycle;
      return _exhaustive;
    }
  }
}

/** Container opacity — Lifecycle × Ambient × optional arrival recede. */
export function worldKindOpacity(
  lifecycle: WorldLifecycle,
  ambient: WorldAmbient,
  recede = false,
): number {
  const base = Math.min(
    1,
    worldKindLifecycleOpacity(lifecycle) * worldAmbientIntensity(ambient),
  );
  return worldArrivalChromeOpacity(base, recede);
}

/** Per-region opacity under Focus — non-focused soften when any region is focused. */
export function worldKindRegionOpacity(
  base: number,
  focusedRegion: WorldFocusRegion | null,
  regionId: WorldFocusRegion,
): number {
  if (!focusedRegion) return base;
  if (focusedRegion === regionId) return Math.min(1, base * 1.06);
  return base * 0.52;
}

/** Focus scale — capped at WORLD_FOCUS_SCALE; reduced motion stays 1. */
export function worldKindRegionScale(
  focusedRegion: WorldFocusRegion | null,
  regionId: WorldFocusRegion,
  reduceMotion: boolean,
): number {
  if (reduceMotion) return 1;
  if (focusedRegion === regionId) return WORLD_FOCUS_SCALE;
  return 1;
}

/** Border accent class from Ambient level — emphasis without owning emotion. */
export function worldKindAccentClass(ambient: WorldAmbient): string {
  switch (ambient.level) {
    case 'celebrating':
      return 'border-ring/55';
    case 'welcoming':
      return 'border-ring/45';
    case 'focused':
      return 'border-primary/35';
    case 'sleeping':
      return 'border-border/25';
    case 'quiet':
    default:
      return 'border-border/40';
  }
}

/** Stronger border when this region holds Focus. */
export function worldKindFocusAccentClass(
  ambient: WorldAmbient,
  isFocused: boolean,
): string {
  if (!isFocused) return worldKindAccentClass(ambient);
  return 'border-ring/70';
}
