/**
 * WorldNavigator motion — one-shot enter + phase status swap.
 * No loops, no spinner.
 */

import type { Transition } from 'framer-motion';

import { DISTANCE, DURATION, EASING, STAGGER } from '@/shared/lib/motion';

export const worldNavigatorEnterTransition: Transition = {
  duration: DURATION.SLOW,
  ease: EASING.entrance,
};

export const worldNavigatorEnterTransitionReduced: Transition = {
  duration: DURATION.FAST,
  ease: EASING.standard,
};

export const worldNavigatorEnterFrom = {
  opacity: 0,
  y: DISTANCE.SM / 3,
} as const;

export const worldNavigatorEnterTo = {
  opacity: 1,
  y: 0,
} as const;

/** Synchronous catalog settle — acknowledgement beat before arrival. */
export const WORLD_NAVIGATOR_RESOLVE_MS = DURATION.FAST * 1000;

export const worldNavigatorStatusTransition: Transition = {
  duration: DURATION.FAST,
  ease: EASING.standard,
};

export const worldNavigatorStatusFrom = {
  opacity: 0,
  y: DISTANCE.SM / 3,
} as const;

export const worldNavigatorStatusTo = {
  opacity: 1,
  y: 0,
} as const;

export const worldNavigatorStatusExit = {
  opacity: 0,
  y: -(DISTANCE.SM / 3),
} as const;

/** Candidate path enter — one-shot, same distance as status. */
export const worldNavigatorPathFrom = {
  opacity: 0,
  y: DISTANCE.SM / 3,
} as const;

export const worldNavigatorPathTo = {
  opacity: 1,
  y: 0,
} as const;

export const worldNavigatorPathTransition: Transition = {
  duration: DURATION.FAST,
  ease: EASING.entrance,
};

export const worldNavigatorPathStagger = STAGGER.FAST;
