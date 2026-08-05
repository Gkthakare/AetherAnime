/**
 * Motion primitives.
 *
 * The lowest layer of the motion foundation: raw timing, easing, distance,
 * scale, and stagger values. Nothing above this file should hard-code an
 * animation number. Every transition, variant, and preset must be composed
 * from these constants so that motion across AetherAnime stays consistent and
 * tunable from a single source of truth.
 *
 * Durations are expressed in seconds to match Framer Motion's time unit.
 */

/** Cubic bezier control points: [x1, y1, x2, y2]. */
export type CubicBezier = [number, number, number, number];

/**
 * Semantic animation durations (seconds).
 *
 * Named by intent rather than by number so consumers pick a feel, not a value.
 */
export const DURATION = {
  /** Micro-interactions: hovers, taps, toggles. */
  FAST: 0.2,
  /** Default UI motion: reveals, transitions. */
  NORMAL: 0.4,
  /** Deliberate, weighty motion: sections, panels. */
  SLOW: 0.6,
  /** Immersive, storytelling motion: hero entrances. */
  CINEMATIC: 1.2,
} as const;

/**
 * Semantic easing curves.
 *
 * Typed as tuples (not `as const`) so they remain assignable to Framer Motion's
 * mutable `Easing` tuple.
 */
export const EASING = {
  /** Balanced acceleration and deceleration for general UI. */
  standard: [0.4, 0, 0.2, 1],
  /** Elements entering the screen (decelerate). */
  entrance: [0, 0, 0.2, 1],
  /** Elements leaving the screen (accelerate). */
  exit: [0.4, 0, 1, 1],
  /** Expressive, cinematic deceleration for immersive reveals. */
  cinematic: [0.16, 1, 0.3, 1],
} satisfies Record<string, CubicBezier>;

/**
 * Translation offsets (pixels) for slide-based motion.
 *
 * Kept small and intentional; large travel distances read as jarring.
 */
export const DISTANCE = {
  SM: 12,
  NORMAL: 24,
  LG: 48,
} as const;

/** Starting scale for scale-based reveals. */
export const SCALE = {
  FROM: 0.96,
  TO: 1,
} as const;

/**
 * Stagger timing (seconds) for orchestrating groups of children.
 */
export const STAGGER = {
  FAST: 0.05,
  NORMAL: 0.1,
  SLOW: 0.15,
} as const;

/** Delay (seconds) before a container begins staggering its children. */
export const DELAY = {
  NONE: 0,
  SHORT: 0.1,
  LONG: 0.3,
} as const;
