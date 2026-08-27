/**
 * WorldKind — copy + mode resolution (no region metadata).
 *
 * Regions come from the World Region Engine — never hardcoded here.
 */

import type { WorldKind, WorldRegionAccent } from '@/shared/world';
import type { WorldShellStatus } from '@/widgets/world-shell';

import type { WorldKindMode } from './world-kind.types';

/** Registry kind → composition mode. */
const WORLD_KIND_FROM_META: Record<WorldKind, WorldKindMode> = {
  anime: 'anime',
  guild: 'guild',
  companion: 'companion',
  dungeon: 'dungeon',
  platform: 'platform',
};

export type WorldKindPlaceholder = {
  readonly eyebrow: string;
  readonly title: string;
};

/** Kind composition language only — region lists live in Region Registry. */
export const WORLD_KIND_PLACEHOLDERS: Record<
  WorldKindMode,
  WorldKindPlaceholder
> = {
  anime: {
    eyebrow: 'Anime world',
    title: 'Series presence',
  },
  guild: {
    eyebrow: 'Guild territory',
    title: 'Belonging',
  },
  companion: {
    eyebrow: 'Companion realm',
    title: 'Presence',
  },
  dungeon: {
    eyebrow: 'Dungeon threshold',
    title: 'Challenge',
  },
  platform: {
    eyebrow: 'Platform home',
    title: 'Operating presence',
  },
  unknown: {
    eyebrow: 'Unrecognized kind',
    title: 'Composition withheld',
  },
  comingSoon: {
    eyebrow: 'Not yet open',
    title: 'Kind reserved',
  },
};

/**
 * Region plate presentation.
 *
 * A destination in the world, not a card on top of it. The region's own
 * accent tints the approach and dissolves before the trailing edge, so the
 * plate never forms a full-width panel — especially on portrait where the
 * primary column is the stage width. No four-sided border, no card radius,
 * no hex fill, no via-background mid-stop.
 */
export const WORLD_KIND_REGION_PLATE: Record<
  WorldRegionAccent,
  { readonly rest: string; readonly focused: string }
> = {
  neutral: {
    rest: 'bg-gradient-to-r from-border/20 to-transparent to-[62%]',
    focused: 'bg-gradient-to-r from-border/36 to-transparent to-[78%]',
  },
  subtle: {
    rest: 'bg-gradient-to-r from-muted-foreground/5 to-transparent to-[48%]',
    focused: 'bg-gradient-to-r from-muted-foreground/16 to-transparent to-[72%]',
  },
  ring: {
    rest: 'bg-gradient-to-r from-ring/5 to-transparent to-[48%]',
    focused: 'bg-gradient-to-r from-ring/18 to-transparent to-[72%]',
  },
  primary: {
    rest: 'bg-gradient-to-r from-primary/8 to-transparent to-[62%]',
    focused: 'bg-gradient-to-r from-primary/20 to-transparent to-[78%]',
  },
  muted: {
    rest: 'bg-gradient-to-r from-border/10 to-transparent to-[62%]',
    focused: 'bg-gradient-to-r from-border/22 to-transparent to-[78%]',
  },
};

export const WORLD_KIND_REGION_PLATE_FALLBACK = WORLD_KIND_REGION_PLATE.neutral;

/**
 * Idle landmarks share a ground line. Arrival recedes them into a column
 * so Destination remains the protagonist.
 */
export const WORLD_KIND_REGION_PATH =
  'flex w-full flex-row flex-nowrap items-start' as const;

export const WORLD_KIND_REGION_PATH_ARRIVAL = 'flex w-full flex-col' as const;

/**
 * Region edge-light classes from the Region accent token.
 *
 * The leading edge is the region's own accent; it brightens on Focus so a
 * selected place reads as lit rather than merely outlined.
 */
export const WORLD_KIND_REGION_EDGE: Record<
  WorldRegionAccent,
  { readonly rest: string; readonly focused: string }
> = {
  neutral: { rest: 'bg-border/50', focused: 'bg-border' },
  subtle: { rest: 'bg-muted-foreground/30', focused: 'bg-muted-foreground/70' },
  ring: { rest: 'bg-ring/40', focused: 'bg-ring' },
  primary: { rest: 'bg-primary/40', focused: 'bg-primary' },
  muted: { rest: 'bg-border/25', focused: 'bg-border/60' },
};

export const WORLD_KIND_REGION_EDGE_FALLBACK = WORLD_KIND_REGION_EDGE.neutral;

/**
 * Resolve composition mode from Scene status + optional registry kind.
 * Status wins for unknown / comingSoon.
 */
export function resolveWorldKindMode(
  status: WorldShellStatus,
  kind?: WorldKind,
): WorldKindMode {
  if (status === 'unknown') return 'unknown';
  if (status === 'comingSoon') return 'comingSoon';
  if (!kind) return 'unknown';
  return WORLD_KIND_FROM_META[kind];
}
