/**
 * RegionScene motion — one-shot mount only.
 *
 * Transform + opacity. No loops. No region lifecycle choreography.
 */

import type { Transition } from 'framer-motion';

import { DISTANCE, DURATION, EASING } from '@/shared/lib/motion';

export const regionSceneEnterTransition: Transition = {
  duration: DURATION.NORMAL,
  ease: EASING.entrance,
};

export const regionSceneEnterTransitionReduced: Transition = {
  duration: DURATION.FAST,
  ease: EASING.standard,
};

export const regionSceneEnterFrom = {
  opacity: 0,
  y: DISTANCE.SM / 2,
} as const;

export const regionSceneEnterTo = {
  opacity: 1,
  y: 0,
} as const;
