/**
 * Shared identity-enter motion — one-shot opacity + translateY.
 *
 * Used by WorldIdentity and RegionIdentity. No loops, particles, or glow.
 */

import type { Transition } from 'framer-motion';

import { DISTANCE, DURATION, EASING } from './constants';

export const identityEnterTransition: Transition = {
  duration: DURATION.SLOW,
  ease: EASING.entrance,
};

export const identityEnterTransitionReduced: Transition = {
  duration: DURATION.FAST,
  ease: EASING.standard,
};

export const identityEnterFrom = {
  opacity: 0,
  y: DISTANCE.SM / 2,
} as const;

export const identityEnterTo = {
  opacity: 1,
  y: 0,
} as const;
