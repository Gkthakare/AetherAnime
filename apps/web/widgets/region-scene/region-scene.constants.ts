/**
 * RegionScene — status resolution (no motion / no React).
 */

import type { WorldFocusRegion, WorldRegionDefinition } from '@/shared/world';

import type { RegionSceneStatus } from './region-scene.types';

/**
 * Map Focus + registry hit → RegionScene status.
 * Focused id with no registry entry → unknown.
 */
export function resolveRegionSceneStatus(
  region: WorldRegionDefinition | null,
  focusedRegion: WorldFocusRegion | null = null,
): RegionSceneStatus {
  if (region) {
    switch (region.availability) {
      case 'available':
        return 'ready';
      case 'comingSoon':
        return 'comingSoon';
      case 'sealed':
        return 'sealed';
      default: {
        const _exhaustive: never = region.availability;
        return _exhaustive;
      }
    }
  }
  if (focusedRegion) return 'unknown';
  return 'none';
}
