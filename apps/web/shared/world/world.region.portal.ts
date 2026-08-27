/**
 * Region portal destination resolution — pure metadata only.
 *
 * Does not navigate. Does not invent destinations from labels.
 * Does not resolve region ownership — Navigation normalizes executable targets.
 */

import type {
  WorldRegionDefinition,
  WorldRegionPortalDestination,
} from './world.region.types';

export type PortalDestinationResolution =
  | {
      readonly status: 'executable';
      readonly worldSlug?: string;
      readonly regionId?: string;
      readonly label?: string;
    }
  | {
      readonly status: 'unavailable';
      readonly reason: 'missing' | 'label-only';
      readonly label?: string;
    };

function isConcreteWorld(
  dest: WorldRegionPortalDestination,
): dest is WorldRegionPortalDestination & { worldSlug: string } {
  return typeof dest.worldSlug === 'string' && dest.worldSlug.trim().length > 0;
}

function isConcreteRegion(dest: WorldRegionPortalDestination): boolean {
  return typeof dest.regionId === 'string' && dest.regionId.trim().length > 0;
}

/**
 * Resolve the first concrete portal destination in registry order.
 * Label-only entries are never executable.
 */
export function resolvePortalDestination(
  region: WorldRegionDefinition | null | undefined,
): PortalDestinationResolution {
  const destinations = region?.portalDestinations;
  if (!destinations || destinations.length === 0) {
    return { status: 'unavailable', reason: 'missing' };
  }

  let sawLabelOnly = false;
  let labelHint: string | undefined;

  for (const dest of destinations) {
    if (isConcreteWorld(dest)) {
      const worldSlug = dest.worldSlug.trim();
      if (worldSlug.length === 0) continue;
      return {
        status: 'executable',
        worldSlug,
        regionId: dest.regionId?.trim() || undefined,
        label: dest.label?.trim() || undefined,
      };
    }
    if (isConcreteRegion(dest)) {
      const regionId = dest.regionId!.trim();
      if (regionId.length > 0) {
        return {
          status: 'executable',
          regionId,
          label: dest.label?.trim() || undefined,
        };
      }
    }
    if (dest.label?.trim()) {
      sawLabelOnly = true;
      labelHint = dest.label.trim();
    }
  }

  if (sawLabelOnly) {
    return {
      status: 'unavailable',
      reason: 'label-only',
      label: labelHint,
    };
  }
  return { status: 'unavailable', reason: 'missing', label: labelHint };
}
