/**
 * World Region Activation — explicit commit intent (distinct from Focus).
 *
 * Pure validation only. No navigation, URL, or runtime state.
 */

import type { WorldFocusRegion } from './world.focus';
import { getRegion, isWorldRegionInteractive } from './world.region.helpers';
import type { WorldDefinition, WorldId } from './world.types';

/** Resolved activation intent after World/Region validation. */
export type WorldRegionActivationIntent = {
  readonly regionId: WorldFocusRegion;
  readonly worldId: WorldId;
};

/**
 * Resolve whether a Region may be explicitly activated for the current World.
 * Returns intent when registered, owned, and interactive; otherwise undefined.
 */
export function resolveWorldRegionActivation(
  world: WorldDefinition | undefined,
  regionId: WorldFocusRegion,
): WorldRegionActivationIntent | undefined {
  const id = regionId.trim();
  if (!world || id.length === 0) return undefined;

  const region = getRegion(id);
  if (!region) return undefined;
  if (region.worldId !== world.id) return undefined;
  if (!isWorldRegionInteractive(region)) return undefined;

  return { regionId: region.id, worldId: world.id };
}
