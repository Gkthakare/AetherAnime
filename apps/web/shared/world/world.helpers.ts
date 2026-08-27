/**
 * World Registry — deterministic lookup helpers.
 *
 * Pure functions over `WORLD_REGISTRY`. No services, no React, no routing.
 */

import { WORLD_REGISTRY } from './world.registry';
import type { WorldDefinition, WorldId } from './world.types';

/** All registered worlds (immutable snapshot order). */
export function getAllWorlds(): ReadonlyArray<WorldDefinition> {
  return WORLD_REGISTRY;
}

/** Lookup by stable id. */
export function getWorld(id: WorldId): WorldDefinition | undefined {
  return WORLD_REGISTRY.find((world) => world.id === id);
}

/** Lookup by URL slug (World Transition segment). */
export function getWorldBySlug(slug: string): WorldDefinition | undefined {
  const normalized = slug.trim().toLowerCase();
  if (normalized.length === 0) return undefined;
  return WORLD_REGISTRY.find((world) => world.slug === normalized);
}

/** True when id or slug matches a registered world. */
export function isWorldRegistered(idOrSlug: string): boolean {
  const normalized = idOrSlug.trim().toLowerCase();
  if (normalized.length === 0) return false;
  return WORLD_REGISTRY.some(
    (world) => world.id === normalized || world.slug === normalized,
  );
}
