/**
 * PortalCTA motion — ceremony timing and mount enter.
 *
 * Sprint-003 Task-001: Impossible Threshold geometry is idle-only.
 * Layer motion for seam / singularity / plates is deferred to a future
 * PortalMotion task. Do not reintroduce Magical Seal ring orbits here.
 */

import type { Transition } from 'framer-motion';

import { DURATION, EASING } from '@/shared/lib/motion';

import type { PortalPhase } from './portal-cta.types';

/** Phases during which activation must be locked. */
const LOCKED_PHASES: ReadonlySet<PortalPhase> = new Set([
  'accepting',
  'crossing',
  'settling',
]);

export function isPortalLocked(phase: PortalPhase): boolean {
  return LOCKED_PHASES.has(phase);
}

/**
 * Accept sequence dwell per phase (seconds), composed from foundation durations.
 * Timing philosophy: short Crossing, longer Settling memory.
 */
export const PORTAL_SEQUENCE = {
  accepting: DURATION.NORMAL,
  crossing: DURATION.NORMAL,
  settling: DURATION.CINEMATIC,
} as const;

/** Abbreviated dwells when `prefers-reduced-motion` is set. */
export const PORTAL_SEQUENCE_REDUCED = {
  accepting: DURATION.FAST,
  crossing: DURATION.FAST,
  settling: DURATION.NORMAL,
} as const;

/** Mount reveal for the invitation block (transform + opacity only). */
export const portalEnterTransition: Transition = {
  duration: DURATION.SLOW,
  ease: EASING.cinematic,
  delay: DURATION.FAST,
};
