/**
 * WorldDetails motion — one-shot mount + focused content crossfade.
 *
 * Transform + opacity only. No ambient loops.
 */

import type { Transition } from 'framer-motion';

import { DISTANCE, DURATION, EASING } from '@/shared/lib/motion';

export const worldDetailsEnterTransition: Transition = {
  duration: DURATION.SLOW,
  ease: EASING.entrance,
};

export const worldDetailsEnterTransitionReduced: Transition = {
  duration: DURATION.FAST,
  ease: EASING.standard,
};

export const worldDetailsSwapTransition: Transition = {
  duration: DURATION.NORMAL,
  ease: EASING.cinematic,
};

export const worldDetailsSwapTransitionReduced: Transition = {
  duration: DURATION.FAST,
  ease: EASING.standard,
};

export const worldDetailsEnterFrom = {
  opacity: 0,
  y: DISTANCE.SM / 2,
} as const;

export const worldDetailsEnterTo = {
  opacity: 1,
  y: 0,
} as const;

/** Tiny translate for focused content swaps. */
export const worldDetailsSwapFrom = {
  opacity: 0,
  y: DISTANCE.SM / 3,
} as const;
