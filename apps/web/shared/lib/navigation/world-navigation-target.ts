/**
 * World Navigation Target — canonical destination descriptor.
 *
 * Navigation owns normalization and href construction.
 * Region Registry ownership is resolved here for regionId-only metadata.
 */

import { getRegion } from '@/shared/world/world.region.helpers';
import { getWorld } from '@/shared/world/world.helpers';
import type { WorldRegionId } from '@/shared/world/world.region.types';
import type { PortalDestinationResolution } from '@/shared/world/world.region.portal';

import { toWorldSlug } from './world-transition';

/** World entry destination — optional region or anime query (mutually exclusive). */
export type WorldNavigationTarget = {
  readonly worldSlug: string;
  readonly regionId?: WorldRegionId;
  /** Catalog anime slug. When present, region is omitted from the href. */
  readonly animeSlug?: string;
};

type ExecutablePortalDestination = Extract<
  PortalDestinationResolution,
  { status: 'executable' }
>;

/**
 * Normalize executable portal metadata into a navigation target.
 * Returns null when world identity cannot be resolved safely.
 */
export function resolveWorldNavigationTarget(
  destination: ExecutablePortalDestination,
): WorldNavigationTarget | null {
  const regionId = destination.regionId?.trim() || undefined;

  if (destination.worldSlug) {
    const worldSlug = toWorldSlug(destination.worldSlug);
    if (worldSlug.length === 0) return null;
    return regionId ? { worldSlug, regionId } : { worldSlug };
  }

  if (regionId) {
    const region = getRegion(regionId);
    if (!region) return null;
    const world = getWorld(region.worldId);
    if (!world?.slug) return null;
    const worldSlug = toWorldSlug(world.slug);
    if (worldSlug.length === 0) return null;
    return { worldSlug, regionId };
  }

  return null;
}
