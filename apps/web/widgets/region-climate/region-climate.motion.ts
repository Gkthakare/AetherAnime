/**
 * RegionClimate motion — one-shot climate crossfade only.
 *
 * Opacity only. No loops, drift, timers, or filters.
 */

import type { Transition } from 'framer-motion';

import { DURATION, EASING } from '@/shared/lib/motion';

export const regionClimateEnterTransition: Transition = {
  duration: DURATION.SLOW,
  ease: EASING.cinematic,
};

export const regionClimateEnterTransitionReduced: Transition = {
  duration: DURATION.FAST,
  ease: EASING.standard,
};

export const regionClimateSwapTransition: Transition = {
  duration: DURATION.NORMAL,
  ease: EASING.cinematic,
};

export const regionClimateSwapTransitionReduced: Transition = {
  duration: DURATION.FAST,
  ease: EASING.standard,
};
