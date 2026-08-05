/**
 * Spacing tokens.
 *
 * A single, harmonious spacing scale used for margin, padding, and gaps across
 * the product. A shared scale keeps rhythm consistent so layouts feel composed
 * rather than arbitrary.
 *
 * Values are `rem` (framework-agnostic and scaling with the root font size).
 * The scale is roughly geometric: each step is a deliberate jump, discouraging
 * one-off in-between values. `md` is the comfortable default gap.
 */

/**
 * Semantic spacing scale (`rem`).
 *
 * Named by size step, not by pixel count, so consumers pick a rhythm.
 */
export const spacing = {
  /** No space. */
  none: '0rem',
  /** Hairline gaps between tightly related elements. */
  xs: '0.25rem',
  /** Compact padding and small gaps. */
  sm: '0.5rem',
  /** Default gap and padding. */
  md: '1rem',
  /** Roomy spacing between grouped content. */
  lg: '1.5rem',
  /** Section padding. */
  xl: '2rem',
  /** Large section separation. */
  '2xl': '3rem',
  /** Major layout separation. */
  '3xl': '4rem',
  /** Immersive, full-bleed breathing room. */
  '4xl': '6rem',
} as const;

/** Union of available spacing steps: `'none' | 'xs' | 'sm' | ... | '4xl'`. */
export type SpacingToken = keyof typeof spacing;
