/**
 * World Region Registry — immutable location catalog per World.
 *
 * Metadata-only. No React, routing, UI, or gameplay.
 * Entries satisfy the canonical WorldRegionDefinition model.
 */

import { AETHERANIME_WORLD_ID } from './world.constants';
import {
  AETHERANIME_REGION_CONTINUUM_ID,
  AETHERANIME_REGION_THRESHOLDS_ID,
  SYSTEM_REGION_AWAITING_KIND_ID,
  SYSTEM_REGION_STAGE_SEALED_ID,
  SYSTEM_REGION_WORLD_ID,
} from './world.region.constants';
import type {
  WorldRegionDefinition,
  WorldRegionId,
} from './world.region.types';
import { assertUniqueRegionRegistry } from './world.region.validation';
import type { WorldId } from './world.types';

const AETHERANIME_REGION_CONTINUUM = {
  id: AETHERANIME_REGION_CONTINUUM_ID,
  slug: 'world-continuum',
  displayName: 'World continuum',
  description:
    'The Anime Operating System continuum — where destinations gather as worlds.',
  worldId: AETHERANIME_WORLD_ID,
  availability: 'available',
  order: 0,
  tagline: 'Where worlds gather.',
  eyebrow: 'Continuum',
  kind: 'platform',
  climate: 'neutral',
  accent: 'subtle',
  activities: ['explore', 'lore', 'portal'],
} as const satisfies WorldRegionDefinition;

const AETHERANIME_REGION_THRESHOLDS = {
  id: AETHERANIME_REGION_THRESHOLDS_ID,
  slug: 'thresholds-ahead',
  displayName: 'Thresholds ahead',
  description:
    'Future Enter thresholds live here — portals that open further worlds.',
  worldId: AETHERANIME_WORLD_ID,
  availability: 'available',
  order: 1,
  tagline: 'Thresholds waiting to open.',
  eyebrow: 'Thresholds',
  kind: 'platform',
  climate: 'cool',
  accent: 'ring',
  activities: ['explore', 'portal'],
  portalDestinations: [
    {
      label: 'Further worlds',
    },
  ],
} as const satisfies WorldRegionDefinition;

const SYSTEM_REGION_AWAITING_KIND = {
  id: SYSTEM_REGION_AWAITING_KIND_ID,
  slug: 'awaiting-kind',
  displayName: 'Awaiting kind',
  description:
    'This destination has no kind language yet — composition stays withheld.',
  worldId: SYSTEM_REGION_WORLD_ID,
  availability: 'sealed',
  order: 0,
  eyebrow: 'Unknown',
  accent: 'muted',
} as const satisfies WorldRegionDefinition;

const SYSTEM_REGION_STAGE_SEALED = {
  id: SYSTEM_REGION_STAGE_SEALED_ID,
  slug: 'stage-sealed',
  displayName: 'Stage sealed',
  description:
    'The primary stage is reserved until this world opens for presence.',
  worldId: SYSTEM_REGION_WORLD_ID,
  availability: 'sealed',
  order: 0,
  eyebrow: 'Sealed',
  accent: 'muted',
} as const satisfies WorldRegionDefinition;

/**
 * Ordered canonical region registry. Append-only; never mutate entries in place.
 */
export const WORLD_REGION_REGISTRY: ReadonlyArray<WorldRegionDefinition> =
  Object.freeze([
    AETHERANIME_REGION_CONTINUUM,
    AETHERANIME_REGION_THRESHOLDS,
    SYSTEM_REGION_AWAITING_KIND,
    SYSTEM_REGION_STAGE_SEALED,
  ]);

assertUniqueRegionRegistry(WORLD_REGION_REGISTRY);

/** O(1) id index — built once at module load. */
export const WORLD_REGION_BY_ID: ReadonlyMap<
  WorldRegionId,
  WorldRegionDefinition
> = Object.freeze(
  new Map(WORLD_REGION_REGISTRY.map((region) => [region.id, region])),
);

function buildRegionsByWorld(): ReadonlyMap<
  WorldId,
  ReadonlyArray<WorldRegionDefinition>
> {
  const buckets = new Map<WorldId, WorldRegionDefinition[]>();

  for (const region of WORLD_REGION_REGISTRY) {
    const list = buckets.get(region.worldId);
    if (list) {
      list.push(region);
    } else {
      buckets.set(region.worldId, [region]);
    }
  }

  const frozen = new Map<WorldId, ReadonlyArray<WorldRegionDefinition>>();
  for (const [worldId, list] of buckets) {
    list.sort((a, b) => a.order - b.order);
    frozen.set(worldId, Object.freeze(list));
  }
  return Object.freeze(frozen);
}

/** O(1) world → ordered regions index. */
export const WORLD_REGIONS_BY_WORLD: ReadonlyMap<
  WorldId,
  ReadonlyArray<WorldRegionDefinition>
> = buildRegionsByWorld();
