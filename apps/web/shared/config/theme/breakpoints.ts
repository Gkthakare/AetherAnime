/**
 * Breakpoint tokens.
 *
 * The responsive breakpoints that define where layouts adapt across viewport
 * widths. A shared, mobile-first ladder keeps responsive behavior consistent
 * across every widget and future client.
 *
 * Values are minimum viewport widths in pixels, expressed as plain numbers so
 * they stay framework-agnostic: a web client can turn them into `min-width`
 * media queries, while other renderers can compare against them directly.
 */

/**
 * Semantic breakpoints — minimum viewport widths (pixels).
 *
 * Mobile-first: each entry is the width at and above which its layout applies.
 */
export const breakpoints = {
  /** Large phones. */
  xs: 480,
  /** Small tablets. */
  sm: 640,
  /** Tablets. */
  md: 768,
  /** Small laptops. */
  lg: 1024,
  /** Desktops. */
  xl: 1280,
  /** Large / cinematic displays. */
  '2xl': 1536,
} as const;

/** Union of available breakpoints: `'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'`. */
export type BreakpointToken = keyof typeof breakpoints;
