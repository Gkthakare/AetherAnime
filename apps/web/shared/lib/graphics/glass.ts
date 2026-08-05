/**
 * Glass surface primitives.
 *
 * Glass is a *composed* primitive, not an atomic one. A frosted surface is a
 * translucent fill plus a backdrop blur plus a light-catching edge. Rather than
 * re-declaring those ingredients, each glass surface is assembled from the
 * lower-level `blur` and `borders` primitives so the whole system stays in sync:
 * retune a blur radius or an edge color once and every glass surface follows.
 *
 * This is the top of the graphics foundation's composition chain
 * (blur + borders -> glass), mirroring how the motion foundation composes
 * constants into presets.
 *
 * Consumed on the web as a single className string:
 *
 *   import { glass } from '@/shared/lib/graphics';
 *   <div className={glass.floating}>...</div>
 */

import { blur } from './blur';
import { borders } from './borders';

/** Union of available glass surfaces: `'primary' | 'secondary' | 'floating'`. */
export type GlassSurface = 'primary' | 'secondary' | 'floating';

/**
 * Frosted glass surface classes (web).
 *
 * Each entry pairs a translucent white fill with a blur depth and an edge:
 *   - `primary`   — the default panel surface.
 *   - `secondary` — a lighter, tighter surface for nested or dense content.
 *   - `floating`  — a deeper blur for overlays that lift off the page.
 *
 * The `bg-white/*` fills are literal here (so Tailwind emits them); blur and
 * border classes are reused from their owning primitives.
 */
export const glass = {
  primary: `bg-white/10 ${blur.md} ${borders.glass}`,
  secondary: `bg-white/5 ${blur.sm} ${borders.subtle}`,
  floating: `bg-white/10 ${blur.lg} ${borders.glass}`,
} as const satisfies Record<GlassSurface, string>;
