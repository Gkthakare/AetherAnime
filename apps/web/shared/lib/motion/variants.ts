/**
 * Foundational Framer Motion variants.
 *
 * Variants describe *what* the animated states look like (`hidden` / `visible`)
 * without binding to a specific duration or easing. Keeping the target values
 * here and the timing in `transitions.ts` lets presets mix and match the two.
 *
 * These are intentionally the minimal, foundational set. Feature-specific
 * variants should be composed from these rather than re-invented.
 */

import type { Variants } from 'framer-motion';

import { DISTANCE, SCALE, STAGGER } from './constants';

/** Opacity 0 -> 1. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

/** Opacity 1 -> 0. */
export const fadeOut: Variants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

/** Fade while rising into place. */
export const slideUp: Variants = {
  hidden: { opacity: 0, y: DISTANCE.NORMAL },
  visible: { opacity: 1, y: 0 },
};

/** Fade while descending into place. */
export const slideDown: Variants = {
  hidden: { opacity: 0, y: -DISTANCE.NORMAL },
  visible: { opacity: 1, y: 0 },
};

/** Fade while scaling up from a subtle offset. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: SCALE.FROM },
  visible: { opacity: 1, scale: SCALE.TO },
};

/**
 * Orchestration-only container.
 *
 * Holds no visual target of its own; it sequences the reveal of its children
 * via `staggerChildren`. Pair with any of the child variants above.
 */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: STAGGER.NORMAL,
    },
  },
};
