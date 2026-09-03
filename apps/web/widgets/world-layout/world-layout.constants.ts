/**
 * World Layout — responsive placement tokens (no motion).
 *
 * Breakpoints (Tailwind): mobile default · tablet `md` · desktop `lg`
 *
 * Region order:
 *   stacked  — Identity, Presence, Primary (destinations), Secondary (context)
 *   desktop  — Identity, Presence, Primary | Secondary
 */

/**
 * Stage width.
 *
 * Arrival keeps the destination measure. Idle opens wider so the environment
 * can occupy the trailing edge instead of a centered hero column.
 */
export const WORLD_LAYOUT_STAGE = 'w-full max-w-5xl' as const;
export const WORLD_LAYOUT_STAGE_IDLE =
  'w-full max-w-6xl items-stretch text-left' as const;
export const WORLD_LAYOUT_IDLE = WORLD_LAYOUT_STAGE_IDLE;
export const WORLD_LAYOUT_ARRIVAL =
  'w-full max-w-none items-stretch text-left' as const;

/**
 * Primary region order + share of the desktop split.
 *
 * Destinations lead. Context follows. Same reading order at every breakpoint.
 */
export const WORLD_LAYOUT_PRIMARY_ORDER =
  'order-1 lg:flex-[3]' as const;

/** Secondary region order + share of the desktop split. */
export const WORLD_LAYOUT_SECONDARY_ORDER =
  'order-2 lg:flex-[2]' as const;

/**
 * Hairline between destinations and context — a structural seam, not a
 * card outline. Stacked: top rule. Desktop: leading rule.
 * Padding matches `spacing.md` (1rem).
 */
export const WORLD_LAYOUT_SECONDARY_RULE =
  'border-t border-border/20 pt-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-4' as const;

/**
 * Regions container: stack destinations then context; split on desktop
 * from a shared top edge so the two slots are one composition.
 */
export const WORLD_LAYOUT_REGIONS =
  'flex w-full flex-col' as const;

/** Idle landmarks sit on one ground line, not a desktop card split. */
export const WORLD_LAYOUT_REGIONS_IDLE = 'flex w-full flex-col' as const;

export const WORLD_LAYOUT_SECONDARY_RULE_IDLE = 'pt-3' as const;
