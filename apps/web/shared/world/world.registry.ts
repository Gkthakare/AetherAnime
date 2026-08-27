/**
 * World Registry — immutable destination catalog.
 *
 * Source of truth for world metadata. Registry Agent rules:
 * unique ids/slugs, metadata-only, no React, no routing, no UI.
 */

import {
  AETHERANIME_WORLD_ID,
  AETHERANIME_WORLD_SLUG,
} from './world.constants';
import type { WorldDefinition, WorldId } from './world.types';

const AETHERANIME_WORLD = {
  id: AETHERANIME_WORLD_ID,
  slug: AETHERANIME_WORLD_SLUG,
  displayName: 'AetherAnime',
  description:
    'The Anime Operating System home — presence after the Arrival threshold.',
  tagline: 'An operating system for anime worlds.',
  kind: 'platform',
  climate: 'neutral',
  capabilities: ['lore'],
  comingSoon: false,
} as const satisfies WorldDefinition;

/**
 * Ordered canonical registry. Append-only growth; never mutate entries in place.
 */
export const WORLD_REGISTRY: ReadonlyArray<WorldDefinition> = Object.freeze([
  AETHERANIME_WORLD,
]);

function assertUniqueRegistry(entries: ReadonlyArray<WorldDefinition>): void {
  const ids = new Set<WorldId>();
  const slugs = new Set<string>();

  for (const world of entries) {
    if (ids.has(world.id)) {
      throw new Error(`World Registry duplicate id: ${world.id}`);
    }
    if (slugs.has(world.slug)) {
      throw new Error(`World Registry duplicate slug: ${world.slug}`);
    }
    ids.add(world.id);
    slugs.add(world.slug);
  }
}

assertUniqueRegistry(WORLD_REGISTRY);
