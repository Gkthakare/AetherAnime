/**
 * Gradient primitives.
 *
 * Reusable multi-stop color fields that give surfaces atmosphere and depth.
 * Gradients are expressed twice so both web and non-web renderers can share the
 * same recipes:
 *
 *   - `GRADIENT` — raw, framework-agnostic CSS `linear-gradient()` values.
 *   - `gradients` — the web consumption surface: static Tailwind utility strings.
 *
 * Stops are derived from the platform palette (background `#070B14`, surface
 * `#111827`, primary `#6C63FF`, accent `#00F5D4`).
 */

/**
 * Gradient recipes (CSS gradient values).
 *
 * Named by role rather than by direction or color so widgets pick a purpose.
 */
export const GRADIENT = {
  /** Deep vertical fade for page and app backdrops. */
  background: 'linear-gradient(180deg, #070B14 0%, #111827 100%)',
  /** Vivid diagonal brand blend for hero focal points. */
  hero: 'linear-gradient(135deg, #6C63FF 0%, #00F5D4 100%)',
  /** Horizontal brand blend for accents, dividers, and text fills. */
  accent: 'linear-gradient(90deg, #6C63FF 0%, #00F5D4 100%)',
} as const;

/** Union of available gradients: `'background' | 'hero' | 'accent'`. */
export type GradientName = keyof typeof GRADIENT;

/**
 * Gradient utility classes (web).
 *
 * Static literal Tailwind arbitrary backgrounds; recipes mirror `GRADIENT`.
 */
export const gradients = {
  background: 'bg-[linear-gradient(180deg,#070B14_0%,#111827_100%)]',
  hero: 'bg-[linear-gradient(135deg,#6C63FF_0%,#00F5D4_100%)]',
  accent: 'bg-[linear-gradient(90deg,#6C63FF_0%,#00F5D4_100%)]',
} as const satisfies Record<GradientName, string>;
