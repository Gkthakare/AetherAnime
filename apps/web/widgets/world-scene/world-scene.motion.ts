/**
 * WorldScene motion — mount tokens for the Scene Director.
 *
 * Transform + opacity only. No continuous loops. No lifecycle choreography.
 */

import type { Transition } from 'framer-motion';

import { DISTANCE, DURATION, EASING } from '@/shared/lib/motion';

/** Scene-level mount (orchestration frame). */
export const worldSceneEnterTransition: Transition = {
  duration: DURATION.NORMAL,
  ease: EASING.entrance,
};

export const worldSceneEnterTransitionReduced: Transition = {
  duration: DURATION.FAST,
  ease: EASING.standard,
};

export const worldSceneEnterFrom = {
  opacity: 0,
  y: DISTANCE.SM / 2,
} as const;

export const worldSceneEnterTo = {
  opacity: 1,
  y: 0,
} as const;
