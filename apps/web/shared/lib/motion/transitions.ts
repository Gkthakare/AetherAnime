/**
 * Reusable transition objects.
 *
 * Transitions describe *how* a change happens (duration, easing).
 * They are composed purely from `constants.ts` so that timing and easing are
 * never re-declared inline by widgets. Variants and presets attach these to
 * concrete animation targets.
 */

import type { Transition } from 'framer-motion';

import { DURATION, EASING } from './constants';

/** Snappy transition for micro-interactions. */
export const fastTransition: Transition = {
  duration: DURATION.FAST,
  ease: EASING.standard,
};

/** Default transition for standard UI reveals and changes. */
export const normalTransition: Transition = {
  duration: DURATION.NORMAL,
  ease: EASING.entrance,
};

/** Deliberate transition for larger surfaces such as sections. */
export const slowTransition: Transition = {
  duration: DURATION.SLOW,
  ease: EASING.entrance,
};

/** Expressive, immersive transition for hero-level storytelling motion. */
export const cinematicTransition: Transition = {
  duration: DURATION.CINEMATIC,
  ease: EASING.cinematic,
};
