/**
 * WorldShell motion — earned-calm enter only.
 *
 * Transform + opacity. No layout animation. No continuous loops.
 */

import type { Transition } from 'framer-motion';

import { DISTANCE, DURATION, EASING } from '@/shared/lib/motion';

/** Mount reveal after Portal Settling hand-off. */
export const worldShellEnterTransition: Transition = {
  duration: DURATION.SLOW,
  ease: EASING.cinematic,
};

export const worldShellEnterTransitionReduced: Transition = {
  duration: DURATION.FAST,
  ease: EASING.standard,
};

export const worldShellEnterFrom = {
  opacity: 0,
  y: DISTANCE.SM,
} as const;

export const worldShellEnterTo = {
  opacity: 1,
  y: 0,
} as const;
