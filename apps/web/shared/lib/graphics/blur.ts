/**
 * Blur primitives.
 *
 * The lowest layer of the graphics foundation. Blur is expressed twice:
 *
 *   - `BLUR_RADIUS` — raw, framework-agnostic CSS lengths. Any renderer (web,
 *     canvas, native, future clients) can read these directly.
 *   - `blur` — the web consumption surface: static Tailwind utility strings that
 *     apply the same radii as a `backdrop-filter`.
 *
 * Higher-level primitives (notably `glass`) compose these values so that the
 * "feel" of frosted surfaces is tuned from a single source of truth. Nothing
 * above this file should hard-code a blur amount.
 */

/**
 * Semantic blur radii (CSS length values).
 *
 * Named by intent rather than by number so consumers pick a depth, not a value.
 */
export const BLUR_RADIUS = {
  /** Barely-there frost for tight, low-contrast surfaces. */
  sm: '4px',
  /** Default frosted glass depth. */
  md: '12px',
  /** Pronounced blur for floating panels and overlays. */
  lg: '24px',
  /** Immersive, atmospheric blur for full-bleed backdrops. */
  xl: '40px',
  /** Cinematic environmental blur — poster as light, not readable artwork. */
  atmospheric: '72px',
} as const;

/** Union of available blur levels: `'sm' | 'md' | 'lg' | 'xl' | 'atmospheric'`. */
export type BlurLevel = keyof typeof BLUR_RADIUS;

/**
 * Backdrop-blur utility classes (web).
 *
 * Written as static, literal Tailwind arbitrary values so the compiler's content
 * scanner reliably generates the CSS. Radii intentionally mirror `BLUR_RADIUS`.
 */
export const blur = {
  sm: 'backdrop-blur-[4px]',
  md: 'backdrop-blur-[12px]',
  lg: 'backdrop-blur-[24px]',
  xl: 'backdrop-blur-[40px]',
  atmospheric: 'backdrop-blur-[72px]',
} as const satisfies Record<BlurLevel, string>;
