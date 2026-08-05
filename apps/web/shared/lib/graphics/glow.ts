/**
 * Glow primitives.
 *
 * Glow is colored, luminous shadow used to make elements feel emissive — the
 * neon, magical quality of the AetherAnime world. Where `elevation` is neutral
 * depth, `glow` is brand-colored light.
 *
 *   - `GLOW_COLOR` — raw, framework-agnostic brand colors used by the halos.
 *   - `glow` — the web consumption surface: static Tailwind utility strings.
 *
 * Colors are derived from the platform palette (primary `#6C63FF`, accent
 * `#00F5D4`) so light always agrees with the theme.
 */

/**
 * Glow source colors (CSS color values).
 *
 * Alpha is baked in so halos read as soft light rather than hard fills.
 */
export const GLOW_COLOR = {
  /** Primary brand light. */
  primary: 'rgb(108 99 255 / 0.45)',
  /** Accent brand light. */
  accent: 'rgb(0 245 212 / 0.45)',
} as const;

/** Union of available glow utilities: `'primary' | 'accent' | 'hero'`. */
export type GlowName = 'primary' | 'accent' | 'hero';

/**
 * Glow utility classes (web).
 *
 * Static literal Tailwind arbitrary shadows. `primary` and `accent` are compact
 * interactive halos; `hero` is a large, atmospheric bloom for above-the-fold
 * focal points.
 */
export const glow = {
  primary: 'shadow-[0_0_24px_rgb(108_99_255/0.45)]',
  accent: 'shadow-[0_0_24px_rgb(0_245_212/0.45)]',
  hero: 'shadow-[0_0_80px_rgb(108_99_255/0.35)]',
} as const satisfies Record<GlowName, string>;
