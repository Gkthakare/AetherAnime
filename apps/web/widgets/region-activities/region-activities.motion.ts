/**
 * RegionActivities motion — one-shot enter / Region swap only.
 *
 * Opacity + translateY. No loops. No child stagger.
 */

import type { Transition } from 'framer-motion';

import { DISTANCE, DURATION, EASING } from '@/shared/lib/motion';

export const regionActivitiesEnterTransition: Transition = {
  duration: DURATION.SLOW,
  ease: EASING.entrance,
};

export const regionActivitiesEnterTransitionReduced: Transition = {
  duration: DURATION.FAST,
  ease: EASING.standard,
};

export const regionActivitiesSwapTransition: Transition = {
  duration: DURATION.NORMAL,
  ease: EASING.cinematic,
};

export const regionActivitiesSwapTransitionReduced: Transition = {
  duration: DURATION.FAST,
  ease: EASING.standard,
};

export const regionActivitiesEnterFrom = {
  opacity: 0,
  y: DISTANCE.SM / 3,
} as const;

export const regionActivitiesEnterTo = {
  opacity: 1,
  y: 0,
} as const;
