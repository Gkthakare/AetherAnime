/**
 * Border primitives.
 *
 * Semantic hairline treatments used to delineate surfaces. Borders are a
 * foundational primitive: `glass` composes them so that translucent surfaces and
 * plain surfaces share the exact same edge language.
 *
 *   - `BORDER_COLOR` — raw, framework-agnostic CSS colors.
 *   - `borders` — the web consumption surface: static Tailwind utility strings.
 */

/**
 * Semantic border colors (CSS color values).
 *
 * Neutral edges use translucent white so they read correctly on any dark,
 * atmospheric background. The accent edge references the brand accent.
 */
export const BORDER_COLOR = {
  /** Faint separation between adjacent surfaces. */
  subtle: 'rgb(255 255 255 / 0.10)',
  /** Slightly brighter edge that catches light on frosted glass. */
  glass: 'rgb(255 255 255 / 0.15)',
  /** Brand accent edge for emphasis and focus. */
  accent: 'rgb(0 245 212 / 0.40)',
} as const;

/** Union of available border styles: `'subtle' | 'glass' | 'accent'`. */
export type BorderStyleName = keyof typeof BORDER_COLOR;

/**
 * Border utility classes (web).
 *
 * Static literal Tailwind strings; colors mirror `BORDER_COLOR`.
 */
export const borders = {
  subtle: 'border border-white/10',
  glass: 'border border-white/15',
  accent: 'border border-[#00F5D4]/40',
} as const satisfies Record<BorderStyleName, string>;
