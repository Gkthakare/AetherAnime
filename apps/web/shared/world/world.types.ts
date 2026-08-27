/**
 * World Registry — types only.
 *
 * Metadata contracts for destination identity. No UI, routing, or lifecycle.
 * Canon: `docs/design/WORLD_ENGINE.md` §7 (kind / climate / capabilities).
 */

/** Destination kind — extends composition; does not fork engines. */
export const WORLD_KINDS = [
  'platform',
  'anime',
  'guild',
  'companion',
  'dungeon',
] as const;

export type WorldKind = (typeof WORLD_KINDS)[number];

/**
 * Soft Aether climate intent — token-level bias, not a parallel palette.
 * Concrete token mapping lands with World Climate implementation.
 */
export const WORLD_CLIMATES = [
  'neutral',
  'cool',
  'warm',
  'charged',
] as const;

export type WorldClimate = (typeof WORLD_CLIMATES)[number];

/** Feature flags for what a world may compose later. */
export const WORLD_CAPABILITIES = [
  'social',
  'companion',
  'play',
  'lore',
  'multiplayer',
] as const;

export type WorldCapability = (typeof WORLD_CAPABILITIES)[number];

/** Stable registry identity for a world destination. */
export type WorldId = string;

/** Canonical world metadata — immutable at rest. */
export interface WorldDefinition {
  readonly id: WorldId;
  readonly slug: string;
  readonly displayName: string;
  readonly description: string;
  /** Optional short identity tagline — presentation only. */
  readonly tagline?: string;
  readonly kind: WorldKind;
  readonly climate: WorldClimate;
  readonly capabilities: ReadonlyArray<WorldCapability>;
  readonly comingSoon: boolean;
}
