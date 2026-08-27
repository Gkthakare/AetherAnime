/**
 * World Region — validation helpers (no React / no UI).
 *
 * Structural checks for registry integrity. Not gameplay or runtime engines.
 */

import {
  WORLD_REGION_ACCENTS,
  WORLD_REGION_ACTIVITIES,
  WORLD_REGION_AVAILABILITIES,
  type WorldRegionDefinition,
  type WorldRegionId,
} from './world.region.types';
import { WORLD_CLIMATES, WORLD_KINDS } from './world.types';

const AVAILABILITY_SET = new Set<string>(WORLD_REGION_AVAILABILITIES);
const ACCENT_SET = new Set<string>(WORLD_REGION_ACCENTS);
const ACTIVITY_SET = new Set<string>(WORLD_REGION_ACTIVITIES);
const KIND_SET = new Set<string>(WORLD_KINDS);
const CLIMATE_SET = new Set<string>(WORLD_CLIMATES);

/** True when availability is a known enum member. */
export function isWorldRegionAvailability(
  value: string,
): value is WorldRegionDefinition['availability'] {
  return AVAILABILITY_SET.has(value);
}

/**
 * Validate a Region definition for registry admission.
 * Returns an error message, or null when valid.
 */
export function validateWorldRegionDefinition(
  region: WorldRegionDefinition,
): string | null {
  if (!region.id.trim()) return 'Region id is required';
  if (!region.slug.trim()) return `Region ${region.id}: slug is required`;
  if (!region.displayName.trim()) {
    return `Region ${region.id}: displayName is required`;
  }
  if (!region.worldId.trim()) {
    return `Region ${region.id}: worldId is required`;
  }
  if (!Number.isFinite(region.order) || region.order < 0) {
    return `Region ${region.id}: order must be a non-negative number`;
  }
  if (!isWorldRegionAvailability(region.availability)) {
    return `Region ${region.id}: invalid availability`;
  }
  if (region.kind !== undefined && !KIND_SET.has(region.kind)) {
    return `Region ${region.id}: invalid kind`;
  }
  if (region.climate !== undefined && !CLIMATE_SET.has(region.climate)) {
    return `Region ${region.id}: invalid climate`;
  }
  if (region.accent !== undefined && !ACCENT_SET.has(region.accent)) {
    return `Region ${region.id}: invalid accent`;
  }
  if (region.activities) {
    for (const activity of region.activities) {
      if (!ACTIVITY_SET.has(activity)) {
        return `Region ${region.id}: invalid activity ${activity}`;
      }
    }
  }
  if (region.portalDestinations) {
    for (const dest of region.portalDestinations) {
      const hasAny =
        Boolean(dest.worldSlug) ||
        Boolean(dest.regionId) ||
        Boolean(dest.label);
      if (!hasAny) {
        return `Region ${region.id}: portal destination is empty`;
      }
    }
  }
  return null;
}

/** Throw when a region fails structural validation. */
export function assertValidWorldRegionDefinition(
  region: WorldRegionDefinition,
): void {
  const error = validateWorldRegionDefinition(region);
  if (error) throw new Error(error);
}

/** Assert unique ids/slugs and structural validity for a registry snapshot. */
export function assertUniqueRegionRegistry(
  entries: ReadonlyArray<WorldRegionDefinition>,
): void {
  const ids = new Set<WorldRegionId>();
  const worldSlugs = new Set<string>();

  for (const region of entries) {
    assertValidWorldRegionDefinition(region);

    if (ids.has(region.id)) {
      throw new Error(`World Region Registry duplicate id: ${region.id}`);
    }
    const worldSlugKey = `${region.worldId}::${region.slug}`;
    if (worldSlugs.has(worldSlugKey)) {
      throw new Error(
        `World Region Registry duplicate slug in world ${region.worldId}: ${region.slug}`,
      );
    }
    ids.add(region.id);
    worldSlugs.add(worldSlugKey);
  }
}
