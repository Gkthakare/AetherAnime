/**
 * WorldClimate — types only.
 *
 * Visual mood resolved from Scene status + Ambient variant.
 * Never performs Registry lookup.
 */

/** Rendered Soft Aether moods (subconscious identity, not weather). */
export const WORLD_CLIMATE_MOODS = [
  'calm',
  'dream',
  'mystic',
  'energetic',
  'unknown',
  'comingSoon',
] as const;

export type WorldClimateMood = (typeof WORLD_CLIMATE_MOODS)[number];

export type WorldClimateProps = {
  /** Layout composition only. */
  className?: string;
};
