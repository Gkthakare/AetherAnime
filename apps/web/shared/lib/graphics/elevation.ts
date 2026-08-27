/**
 * Elevation primitives.
 *
 * Elevation expresses how far a surface sits above the world behind it, encoded
 * as neutral drop shadows. Semantic levels — not raw shadow strings — keep depth
 * consistent across every widget.
 *
 *   - `ELEVATION_SHADOW` — raw, framework-agnostic CSS `box-shadow` values.
 *   - `elevation` — the web consumption surface: static Tailwind utility strings.
 *
 * Elevation is neutral (black) shadow only. Colored halos are local to
 * widgets that need emissive light, not a shared primitive.
 */

/**
 * Semantic elevation shadows (CSS box-shadow values).
 *
 * Shadows deepen and spread as the surface rises, matching how light falls in a
 * cinematic, atmospheric scene.
 */
export const ELEVATION_SHADOW = {
  /** Resting content: cards and inline surfaces. */
  surface: '0 1px 2px 0 rgb(0 0 0 / 0.24)',
  /** Lifted content: popovers, floating panels, menus. */
  floating: '0 8px 24px -4px rgb(0 0 0 / 0.40)',
  /** Focused content: dialogs and modals above a scrim. */
  modal: '0 24px 64px -12px rgb(0 0 0 / 0.60)',
} as const;

/** Union of available elevation levels: `'surface' | 'floating' | 'modal'`. */
export type ElevationLevel = keyof typeof ELEVATION_SHADOW;

/**
 * Elevation utility classes (web).
 *
 * Static literal Tailwind arbitrary shadows; values mirror `ELEVATION_SHADOW`.
 */
export const elevation = {
  surface: 'shadow-[0_1px_2px_0_rgb(0_0_0/0.24)]',
  floating: 'shadow-[0_8px_24px_-4px_rgb(0_0_0/0.40)]',
  modal: 'shadow-[0_24px_64px_-12px_rgb(0_0_0/0.60)]',
} as const satisfies Record<ElevationLevel, string>;
