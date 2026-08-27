/**
 * WorldKind — types only.
 *
 * Primary-slot composition language. Observes Scene context; never Registry.
 */

/** Structural composition modes (not gameplay content). */
export const WORLD_KIND_MODES = [
  'anime',
  'guild',
  'companion',
  'dungeon',
  'platform',
  'unknown',
  'comingSoon',
] as const;

export type WorldKindMode = (typeof WORLD_KIND_MODES)[number];

export type WorldKindProps = {
  /** Layout composition only. */
  className?: string;
};
