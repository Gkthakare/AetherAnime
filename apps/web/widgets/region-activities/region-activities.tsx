'use client';

import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import { spacing } from '@/shared/config/theme';
import { legibility } from '@/shared/lib/graphics';
import { DISTANCE } from '@/shared/lib/motion';
import { isContinuumDiscoveryRegion } from '@/shared/world';
import { cn } from '@/lib/utils';
import { useRegionScene } from '@/widgets/region-scene/region-scene-context';

import {
  REGION_ACTIVITIES_STATUS_OPACITY,
  REGION_ACTIVITY_LABEL,
} from './region-activities.constants';
import {
  regionActivitiesEnterFrom,
  regionActivitiesEnterTo,
  regionActivitiesEnterTransitionReduced,
  regionActivitiesSwapTransition,
  regionActivitiesSwapTransitionReduced,
} from './region-activities.motion';
import { resolveRegionActivityCapability } from './region-activity.execution';
import type { RegionActivitiesProps } from './region-activities.types';

/**
 * RegionActivities — Region activity rail with portal execution handoff.
 *
 * Observes RegionScene. Navigation via Link + resolved worldHref only.
 * Continuum explore discovery lives on the WorldKind landmark.
 * No Focus ownership, Registry lookup, or PortalCTA.
 * Renders nothing while idle so the orientation marker is not a third band.
 */
export function RegionActivities({ className }: RegionActivitiesProps) {
  const { currentRegion, regionStatus } = useRegionScene();
  const reduceMotion = useReducedMotion();

  if (
    currentRegion &&
    isContinuumDiscoveryRegion(currentRegion.id) &&
    regionStatus === 'ready' &&
    currentRegion.activities?.includes('explore')
  ) {
    return null;
  }

  const activities = currentRegion?.activities;
  const peak = REGION_ACTIVITIES_STATUS_OPACITY[regionStatus];
  const visible =
    peak > 0 && activities != null && activities.length > 0;

  const swapTransition = reduceMotion
    ? regionActivitiesSwapTransitionReduced
    : regionActivitiesSwapTransition;

  const subdued =
    regionStatus === 'comingSoon' || regionStatus === 'sealed';

  return (
    <AnimatePresence mode="wait" initial={false}>
      {visible && currentRegion ? (
        <motion.div
          key={currentRegion.id}
          data-slot="region-activities"
          data-region-id={currentRegion.id}
          data-region-status={regionStatus}
          className={cn(
            'flex w-full max-w-md flex-wrap items-center justify-center',
            className,
          )}
          style={{ gap: spacing.md, marginInline: 'auto' }}
          initial={reduceMotion ? false : regionActivitiesEnterFrom}
          animate={{
            ...regionActivitiesEnterTo,
            opacity: peak,
          }}
          exit={
            reduceMotion
              ? undefined
              : { opacity: 0, y: -(DISTANCE.SM / 3) }
          }
          transition={
            reduceMotion
              ? regionActivitiesEnterTransitionReduced
              : swapTransition
          }
        >
          {activities!.map((activity) => {
            const capability = resolveRegionActivityCapability(
              activity,
              currentRegion,
              regionStatus,
            );
            const executable = capability.kind === 'executable';

            if (executable) {
              return (
                <Link
                  key={activity}
                  href={capability.href}
                  aria-label={capability.ariaLabel}
                  data-slot="region-activity"
                  data-activity={activity}
                  data-activity-executable="true"
                  className={cn(
                    'text-[0.5625rem] uppercase tracking-[0.28em] text-muted-foreground',
                    'border-b border-border/40 pb-0.5',
                    'outline-none transition-colors hover:border-ring/50 hover:text-ring/80',
                    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                    legibility.copy,
                  )}
                >
                  {capability.label}
                </Link>
              );
            }

            return (
              <span
                key={activity}
                data-slot="region-activity"
                data-activity={activity}
                data-activity-executable="false"
                className={cn(
                  'text-[0.5625rem] uppercase tracking-[0.28em] text-muted-foreground',
                  'border-b border-border/25 pb-0.5',
                  subdued && 'opacity-80',
                  legibility.copy,
                )}
              >
                {capability.label ?? REGION_ACTIVITY_LABEL[activity]}
              </span>
            );
          })}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
