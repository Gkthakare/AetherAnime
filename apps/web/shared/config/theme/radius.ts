/**
 * Border radius tokens.
 *
 * The corner-rounding scale for every surface, from crisp inline elements to
 * fully rounded pills. A shared scale keeps the softness of the interface
 * consistent so surfaces feel like they belong to the same world.
 *
 * Values are `rem` for the graded steps (scaling with the root font size) and a
 * large fixed length for `full` (used to guarantee pill/circle shapes).
 */

/**
 * Semantic border radius scale.
 *
 * Named by size step, not by value, so consumers pick a softness.
 */
export const radius = {
  /** Sharp corners. */
  none: '0rem',
  /** Subtle rounding for inputs, chips, and small controls. */
  sm: '0.25rem',
  /** Default rounding for cards and buttons. */
  md: '0.5rem',
  /** Pronounced rounding for panels and media. */
  lg: '0.75rem',
  /** Soft rounding for large containers and modals. */
  xl: '1rem',
  /** Fully rounded pills and circles. */
  full: '9999px',
} as const;

/** Union of available radii: `'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'`. */
export type RadiusToken = keyof typeof radius;
