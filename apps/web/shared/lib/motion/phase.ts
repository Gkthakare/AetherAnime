/**
 * Reduced-motion resolution for phase-keyed motion.
 *
 * Every performer stores two maps — full motion and a reduced-motion
 * counterpart — and then picks one by phase. These helpers own that pick so the
 * `reduceMotion ? reduced[phase] : full[phase]` ternary is written once instead
 * of at every animated layer.
 */

import type { Transition } from 'framer-motion';

/** Pick a phase pose from the full or reduced-motion map. */
export function phaseValue<P extends string, T>(
  phase: P,
  reduceMotion: boolean,
  full: Record<P, T>,
  reduced: Record<P, T>,
): T {
  return reduceMotion ? reduced[phase] : full[phase];
}

/**
 * Pick a phase transition, where reduced motion collapses every phase onto a
 * single transition.
 */
export function phaseTransition<P extends string>(
  phase: P,
  reduceMotion: boolean,
  full: Record<P, Transition>,
  reduced: Transition,
): Transition {
  return reduceMotion ? reduced : full[phase];
}
