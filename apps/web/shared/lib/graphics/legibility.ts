/**
 * Legibility primitives.
 *
 * Neutral text shadows that hold copy readable when it sits directly on world
 * artwork rather than on a solid surface. This is the text counterpart to
 * `elevation`: black, diffuse, and non-emissive.
 *
 * Deliberately non-emissive. Brand-colored light that makes an element feel
 * lit belongs on the widget that owns that light; this primitive only buys
 * contrast against an unpredictable background.
 *
 *   - `LEGIBILITY_SHADOW` — raw, framework-agnostic CSS `text-shadow` values.
 *   - `legibility` — the web consumption surface: static Tailwind utility strings.
 */

/**
 * Semantic legibility shadows (CSS text-shadow values).
 *
 * Radius grows with type size so the halo stays proportional to the glyph.
 */
export const LEGIBILITY_SHADOW = {
  /** Body copy and labels over artwork. */
  copy: '0 1px 12px rgb(3 7 17 / 0.72)',
  /** Large display type over artwork. */
  display:
    '0 2px 32px rgb(3 7 17 / 0.78), 0 1px 4px rgb(3 7 17 / 0.6)',
} as const;

/** Union of available legibility levels: `'copy' | 'display'`. */
export type LegibilityLevel = keyof typeof LEGIBILITY_SHADOW;

/**
 * Legibility utility classes (web).
 *
 * Static literal Tailwind arbitrary text shadows; values mirror
 * `LEGIBILITY_SHADOW`.
 */
export const legibility = {
  copy: '[text-shadow:0_1px_12px_rgb(3_7_17/0.72)]',
  display:
    '[text-shadow:0_2px_32px_rgb(3_7_17/0.78),0_1px_4px_rgb(3_7_17/0.6)]',
} as const satisfies Record<LegibilityLevel, string>;
