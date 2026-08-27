/**
 * Foundational Framer Motion variants.
 *
 * Variants describe *what* the animated states look like (`hidden` / `visible`)
 * without binding to a specific duration or easing. Keeping the target values
 * here and the timing in `transitions.ts` lets presets mix and match the two.
 */

import type { Variants } from 'framer-motion';

import { DISTANCE } from './constants';

/** Fade while rising into place. */
export const slideUp: Variants = {
  hidden: { opacity: 0, y: DISTANCE.NORMAL },
  visible: { opacity: 1, y: 0 },
};
