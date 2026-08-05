/**
 * Graphics foundation.
 *
 * The single source of truth for reusable visual appearance across AetherAnime.
 * Consume graphics through this barrel so widgets never re-declare blur, borders,
 * elevation, glow, gradients, or glass inline:
 *
 *   import { glass, glow, gradients } from '@/shared/lib/graphics';
 *
 * Every primitive ships two forms: raw framework-agnostic CSS tokens
 * (`BLUR_RADIUS`, `ELEVATION_SHADOW`, `GLOW_COLOR`, `GRADIENT`, `BORDER_COLOR`)
 * and static Tailwind utility strings (`blur`, `elevation`, `glow`, `gradients`,
 * `borders`, `glass`) for the web client.
 *
 * Layers (lowest to highest): blur / borders / elevation / glow / gradients are
 * atomic; glass composes blur + borders.
 */

export * from './blur';
export * from './borders';
export * from './elevation';
export * from './glow';
export * from './gradients';
export * from './glass';
