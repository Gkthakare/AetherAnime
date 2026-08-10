/**
 * Motion foundation.
 *
 * The single source of truth for animation across AetherAnime. Consume motion
 * through this barrel so widgets never re-declare timing, easing, or animation
 * targets inline:
 *
 *   import { heroReveal } from '@/shared/lib/motion';
 *
 * Layers (lowest to highest): constants -> transitions -> variants -> presets.
 * `ceremony` and `phase` sit alongside presets: shared phase-keyed values and
 * the reduced-motion resolution every performer needs.
 */

export * from './constants';
export * from './transitions';
export * from './variants';
export * from './presets';
export * from './ceremony';
export * from './phase';
