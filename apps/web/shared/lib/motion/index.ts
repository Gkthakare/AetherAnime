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
 */

export * from './constants';
export * from './transitions';
export * from './variants';
export * from './presets';
