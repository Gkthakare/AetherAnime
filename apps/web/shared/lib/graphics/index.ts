/**
 * Graphics foundation.
 *
 * The single source of truth for reusable visual appearance across AetherAnime.
 * Consume graphics through this barrel so widgets never re-declare blur, borders,
 * elevation, or glass inline:
 *
 *   import { glass, legibility } from '@/shared/lib/graphics';
 *
 * Every primitive ships two forms: raw framework-agnostic CSS tokens
 * (`BLUR_RADIUS`, `ELEVATION_SHADOW`, `BORDER_COLOR`, `LEGIBILITY_SHADOW`)
 * and static Tailwind utility strings (`blur`, `elevation`, `borders`,
 * `legibility`, `glass`) for the web client.
 *
 * Layers (lowest to highest): blur / borders / elevation / legibility are
 * atomic; glass composes blur + borders.
 */

export * from './blur';
export * from './borders';
export * from './elevation';
export * from './legibility';
export * from './glass';
