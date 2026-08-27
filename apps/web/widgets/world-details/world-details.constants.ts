/**
 * WorldDetails — secondary detail copy (no motion values).
 *
 * Structural fallbacks only. Region title/description come from
 * WorldRegionDefinition via RegionScene.
 */

import type { RegionSceneStatus } from '@/widgets/region-scene';

export const WORLD_DETAILS_COPY = {
  idle: 'When you focus a region its details appear here.',
  unknown: 'This focus has no Region Registry entry.',
  comingSoon: 'Coming soon',
  sealed: 'Sealed',
} as const;

/**
 * Opacity emphasis by RegionScene status — presentation only.
 *
 * Details are always secondary; with nothing focused the idle instruction
 * recedes further so it never competes with the World identity.
 */
export const WORLD_DETAILS_STATUS_OPACITY: Record<RegionSceneStatus, number> = {
  none: 0.5,
  ready: 1,
  comingSoon: 0.88,
  sealed: 0.78,
  unknown: 0.8,
};
