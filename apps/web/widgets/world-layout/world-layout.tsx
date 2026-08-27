import { cn } from '@/lib/utils';

import {
  WORLD_LAYOUT_ARRIVAL,
  WORLD_LAYOUT_IDLE,
  WORLD_LAYOUT_PRIMARY_ORDER,
  WORLD_LAYOUT_REGIONS,
  WORLD_LAYOUT_REGIONS_IDLE,
  WORLD_LAYOUT_SECONDARY_ORDER,
  WORLD_LAYOUT_SECONDARY_RULE,
  WORLD_LAYOUT_SECONDARY_RULE_IDLE,
} from './world-layout.constants';
import { worldArrivalLayoutGaps } from './world-arrival.presentation';
import './world-place.css';
import type { WorldLayoutProps } from './world-layout.types';

/**
 * WorldLayout — placement engine for World Shell slots.
 *
 * Owns responsive composition only. No runtime, Registry, Focus,
 * Lifecycle, Presence, or motion.
 */
export function WorldLayout({
  identity,
  presence,
  primary,
  secondary,
  className,
  arrived = false,
  wrapMain,
}: WorldLayoutProps) {
  const idleGaps = worldArrivalLayoutGaps(arrived);
  const main = (
    <div
      data-slot="world-layout"
      data-world-arrival={arrived ? 'anime' : 'idle'}
      className={cn(
        'relative z-10 flex flex-col',
        arrived ? WORLD_LAYOUT_ARRIVAL : WORLD_LAYOUT_IDLE,
        className,
      )}
      style={{ gap: `var(--world-layout-stage-gap, ${idleGaps.stage})` }}
    >
      <div data-slot="world-identity" className="w-full">
        {identity}
      </div>

      <div
        data-slot="world-layout-regions"
        className={arrived ? WORLD_LAYOUT_REGIONS : WORLD_LAYOUT_REGIONS_IDLE}
        style={{ gap: `var(--world-layout-regions-gap, ${idleGaps.regions})` }}
      >
        <div
          data-slot="world-primary"
          className={cn('w-full', WORLD_LAYOUT_PRIMARY_ORDER)}
        >
          {primary}
        </div>

        <div
          data-slot="world-secondary"
          className={cn(
            'w-full',
            WORLD_LAYOUT_SECONDARY_ORDER,
            arrived
              ? WORLD_LAYOUT_SECONDARY_RULE
              : WORLD_LAYOUT_SECONDARY_RULE_IDLE,
          )}
        >
          {secondary}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div
        data-slot="world-presence"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        aria-hidden={presence ? undefined : true}
      >
        {presence}
      </div>

      {wrapMain ? wrapMain(main) : main}
    </>
  );
}
