/**
 * World Region — types only.
 *
 * Canonical metadata model for locations inside a World.
 * Metadata-only — no UI, routing, gameplay, or runtime engines.
 * Widgets must consume this model; they never invent Region metadata.
 */

import type {
  WorldClimate,
  WorldId,
  WorldKind,
} from './world.types';

/** Stable region identity (also used as Focus region id). */
export type WorldRegionId = string;

/** Whether a region may be explored / focused. */
export const WORLD_REGION_AVAILABILITIES = [
  'available',
  'comingSoon',
  'sealed',
] as const;

export type WorldRegionAvailability =
  (typeof WORLD_REGION_AVAILABILITIES)[number];

/**
 * Soft accent intent for Region presentation — token-level, not a palette system.
 */
export const WORLD_REGION_ACCENTS = [
  'neutral',
  'subtle',
  'ring',
  'primary',
  'muted',
] as const;

export type WorldRegionAccent = (typeof WORLD_REGION_ACCENTS)[number];

/**
 * Supported activity flags a Region may compose later.
 * Not gameplay systems — registry intent only.
 */
export const WORLD_REGION_ACTIVITIES = [
  'explore',
  'lore',
  'social',
  'companion',
  'play',
  'portal',
  'media',
] as const;

export type WorldRegionActivity = (typeof WORLD_REGION_ACTIVITIES)[number];

/** Artwork reference ids — resolved by future asset systems. */
export type WorldRegionArtwork = {
  readonly emblemId?: string;
  readonly heroId?: string;
  readonly atmosphereId?: string;
};

/**
 * Optional portal / threshold destination hints.
 * Not routing — metadata for future Portal composition only.
 */
export type WorldRegionPortalDestination = {
  /** Destination world slug when known. */
  readonly worldSlug?: string;
  /** Destination region id when known. */
  readonly regionId?: WorldRegionId;
  /** Presentation label for the threshold. */
  readonly label?: string;
};

/**
 * Canonical region metadata — immutable at rest.
 *
 * Required: identity + ownership + availability + order.
 * All presentation / theme / activity fields are optional.
 */
export interface WorldRegionDefinition {
  // —— Identity (required) ——
  readonly id: WorldRegionId;
  readonly slug: string;
  readonly displayName: string;
  readonly description: string;
  /** Owning world — Region never exists without World ownership. */
  readonly worldId: WorldId;
  readonly availability: WorldRegionAvailability;
  /** Ascending display order within a world. */
  readonly order: number;

  // —— Presentation (optional) ——
  readonly tagline?: string;
  readonly eyebrow?: string;
  /** Optional icon id — unused until icon system lands. */
  readonly iconId?: string;

  // —— Theme / climate / kind / accent (optional) ——
  /** Region-local kind bias; defaults to owning world kind when omitted. */
  readonly kind?: WorldKind;
  /** Soft Aether climate intent for this region. */
  readonly climate?: WorldClimate;
  readonly accent?: WorldRegionAccent;
  /** Opaque theme token for future Region theme engines. */
  readonly themeId?: string;

  // —— Artwork references (optional) ——
  readonly artwork?: WorldRegionArtwork;

  // —— Activities (optional) ——
  readonly activities?: ReadonlyArray<WorldRegionActivity>;

  // —— Portal destinations (optional) ——
  readonly portalDestinations?: ReadonlyArray<WorldRegionPortalDestination>;

  /**
   * Future extension bag — string/number/boolean only.
   * Prefer typed fields above; use sparingly.
   */
  readonly extensions?: Readonly<
    Record<string, string | number | boolean>
  >;
}
