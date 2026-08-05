/**
 * Typography tokens.
 *
 * The type system's source of truth: font families, a semantic size scale, four
 * weights, and matching line heights. Named by intent so consumers pick a role
 * (`body`, `display`) or a step (`md`, `lg`) rather than a raw measurement.
 *
 * All values are raw, framework-agnostic strings/numbers:
 *   - font families are CSS `font-family` stacks,
 *   - font sizes are `rem` (scaling with the user's root font size),
 *   - line heights are unitless multipliers.
 *
 * No `px` and no framework classes live here so any renderer can consume them.
 */

/**
 * Font family stacks (CSS `font-family` values).
 *
 * The concrete display/body faces are provided by the app's font loader; these
 * stacks describe intent and supply robust system fallbacks.
 */
export const fontFamily = {
  /** Expressive face for hero headings and large focal text. */
  display: '"Space Grotesk", system-ui, sans-serif',
  /** Default face for body copy and UI. */
  body: '"Inter", system-ui, sans-serif',
  /** Fixed-width face for code, timestamps, and data. */
  mono: '"JetBrains Mono", ui-monospace, monospace',
} as const;

/** Union of available font families: `'display' | 'body' | 'mono'`. */
export type FontFamilyToken = keyof typeof fontFamily;

/**
 * Font size scale (`rem`).
 *
 * A modular scale from fine print to hero display. `md` is the body baseline.
 */
export const fontSize = {
  /** Fine print, captions. */
  xs: '0.75rem',
  /** Secondary text, labels. */
  sm: '0.875rem',
  /** Body baseline. */
  md: '1rem',
  /** Lead paragraphs, small headings. */
  lg: '1.125rem',
  /** Section headings. */
  xl: '1.5rem',
  /** Page headings. */
  '2xl': '2rem',
  /** Large headings. */
  '3xl': '2.5rem',
  /** Hero display. */
  '4xl': '3.5rem',
} as const;

/** Union of available font sizes: `'xs' | 'sm' | ... | '4xl'`. */
export type FontSizeToken = keyof typeof fontSize;

/**
 * Font weights (CSS numeric weights).
 *
 * Four steps cover the full range from quiet body copy to bold display.
 */
export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

/** Union of available font weights: `'regular' | 'medium' | 'semibold' | 'bold'`. */
export type FontWeightToken = keyof typeof fontWeight;

/**
 * Line heights (unitless multipliers).
 *
 * Tighter for large display text, looser for readable body copy.
 */
export const lineHeight = {
  /** Large headings where lines sit close together. */
  tight: 1.1,
  /** Subheadings and dense UI. */
  snug: 1.3,
  /** Body copy comfortable for reading. */
  normal: 1.5,
  /** Long-form or spacious text. */
  relaxed: 1.75,
} as const;

/** Union of available line heights: `'tight' | 'snug' | 'normal' | 'relaxed'`. */
export type LineHeightToken = keyof typeof lineHeight;

/**
 * Typography namespace.
 *
 * Groups every type token under a single object for ergonomic consumption:
 * `typography.fontSize.md`, `typography.fontWeight.bold`, etc.
 */
export const typography = {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
} as const;
