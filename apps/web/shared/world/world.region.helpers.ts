/**
 * World Region — deterministic lookup helpers.
 *
 * Pure functions over `WORLD_REGION_REGISTRY`. No services, no React, no routing.
 * Does not import widgets — status is the shared shell-status union only.
 */

import {
  SYSTEM_REGION_AWAITING_KIND_ID,
  SYSTEM_REGION_STAGE_SEALED_ID,
} from './world.region.constants';
import {
  WORLD_REGION_BY_ID,
  WORLD_REGION_REGISTRY,
  WORLD_REGIONS_BY_WORLD,
} from './world.region.registry';
import type {
  WorldRegionDefinition,
  WorldRegionId,
} from './world.region.types';
import type { WorldDefinition, WorldId } from './world.types';

/** Shell resolution outcomes — mirrored to avoid widget imports. */
type WorldRegionSceneStatus = 'valid' | 'unknown' | 'comingSoon';

const EMPTY_REGIONS: ReadonlyArray<WorldRegionDefinition> = Object.freeze([]);

/** All registered regions (immutable snapshot order). */
export function getAllRegions(): ReadonlyArray<WorldRegionDefinition> {
  return WORLD_REGION_REGISTRY;
}

/** Lookup by stable id — O(1). */
export function getRegion(
  id: WorldRegionId,
): WorldRegionDefinition | undefined {
  return WORLD_REGION_BY_ID.get(id);
}

/** Regions owned by a world, ascending `order` — O(1). */
export function getRegionsByWorld(
  worldId: WorldId,
): ReadonlyArray<WorldRegionDefinition> {
  return WORLD_REGIONS_BY_WORLD.get(worldId) ?? EMPTY_REGIONS;
}

/** Lookup by world + slug. */
export function getRegionBySlug(
  worldId: WorldId,
  slug: string,
): WorldRegionDefinition | undefined {
  const normalized = slug.trim().toLowerCase();
  if (normalized.length === 0) return undefined;
  return getRegionsByWorld(worldId).find(
    (region) => region.slug === normalized,
  );
}

/** True when id matches a registered region. */
export function isRegionRegistered(id: WorldRegionId): boolean {
  return WORLD_REGION_BY_ID.has(id);
}

/**
 * Resolve regions for Scene composition.
 * Status wins for unknown / comingSoon structural regions.
 * Valid worlds use Region Registry ownership.
 */
export function resolveWorldRegions(
  status: WorldRegionSceneStatus,
  world?: WorldDefinition,
): ReadonlyArray<WorldRegionDefinition> {
  if (status === 'unknown') {
    const region = getRegion(SYSTEM_REGION_AWAITING_KIND_ID);
    return region ? Object.freeze([region]) : EMPTY_REGIONS;
  }
  if (status === 'comingSoon') {
    const region = getRegion(SYSTEM_REGION_STAGE_SEALED_ID);
    return region ? Object.freeze([region]) : EMPTY_REGIONS;
  }
  if (!world) return EMPTY_REGIONS;
  return getRegionsByWorld(world.id);
}

/** Whether a region may receive Focus interaction. */
export function isWorldRegionInteractive(
  region: WorldRegionDefinition,
): boolean {
  return region.availability === 'available';
}

/**
 * Validate optional `?region=` arrival metadata for a resolved World.
 * Returns the region id when registered, owned, and interactive; otherwise undefined.
 */
export function resolveInitialRegionFocus(
  world: WorldDefinition | undefined,
  regionQuery: string | string[] | undefined,
): WorldRegionId | undefined {
  const raw = Array.isArray(regionQuery) ? regionQuery[0] : regionQuery;
  const regionId = raw?.trim();
  if (!world || !regionId || regionId.length === 0) return undefined;

  const region = getRegion(regionId);
  if (!region) return undefined;
  if (region.worldId !== world.id) return undefined;
  if (!isWorldRegionInteractive(region)) return undefined;

  return region.id;
}
