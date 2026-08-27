/**
 * TASK-057-B — Memory Horizon constants.
 *
 * Upper-trailing residual afterglow. Caps are compositional, not a ranking UI.
 */

/** Absolute ceiling from the frozen design. */
export const MEMORY_HORIZON_HARD_MAX = 8;

/** Desktop visible bound — within the hard max; prefers sparse over crowded. */
export const MEMORY_HORIZON_DESKTOP_LIMIT = 5;

/** Portrait visible bound. */
export const MEMORY_HORIZON_PORTRAIT_LIMIT = 4;

/**
 * Deterministic upper-trailing slots (percent of the horizon band box).
 * Index 0 = newest → most trailing / slightly more present.
 *
 * Trailing = higher `right` in LTR. Vertical stays in the atmospheric sky —
 * never the geographic far horizon band.
 */
export const MEMORY_HORIZON_SLOTS = [
  { topPct: 28, trailingPct: 10 },
  { topPct: 42, trailingPct: 18 },
  { topPct: 18, trailingPct: 26 },
  { topPct: 54, trailingPct: 34 },
  { topPct: 34, trailingPct: 42 },
  { topPct: 48, trailingPct: 50 },
  { topPct: 22, trailingPct: 58 },
  { topPct: 60, trailingPct: 66 },
] as const;

/** Newest → oldest opacity within a quiet residual range. */
export const MEMORY_HORIZON_OPACITY = [
  0.48, 0.4, 0.32, 0.24, 0.18, 0.14, 0.1, 0.08,
] as const;
