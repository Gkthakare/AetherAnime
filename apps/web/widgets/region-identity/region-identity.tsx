'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { spacing } from '@/shared/config/theme';
import { legibility } from '@/shared/lib/graphics';
import {
  identityEnterFrom,
  identityEnterTo,
  identityEnterTransition,
  identityEnterTransitionReduced,
} from '@/shared/lib/motion/identity';
import { cn } from '@/lib/utils';
import { useRegionScene } from '@/widgets/region-scene/region-scene-context';

import {
  REGION_IDENTITY_ACCENT_FALLBACK,
  REGION_IDENTITY_ACCENT_CLASS,
  REGION_IDENTITY_COPY,
  REGION_IDENTITY_STATUS_OPACITY,
} from './region-identity.constants';
import type { RegionIdentityProps } from './region-identity.types';

/**
 * RegionIdentity — orientation marker for the currently focused Region.
 *
 * Consumes `useRegionScene()` only. Never looks up Registry.
 * Owns no Focus / RegionScene runtime.
 *
 * Idle: quiet tether so WorldIdentity leads. Focused: spatial acknowledgement
 * of which destination holds attention — not a second hero. Description and
 * tagline belong to WorldDetails.
 */
export function RegionIdentity({ className }: RegionIdentityProps) {
  const { currentRegion, regionStatus } = useRegionScene();
  const reduceMotion = useReducedMotion();

  const accent = currentRegion?.accent
    ? REGION_IDENTITY_ACCENT_CLASS[currentRegion.accent]
    : REGION_IDENTITY_ACCENT_FALLBACK;

  const eyebrow =
    regionStatus === 'none'
      ? REGION_IDENTITY_COPY.noneEyebrow
      : regionStatus === 'unknown'
        ? REGION_IDENTITY_COPY.unknownEyebrow
        : (currentRegion?.eyebrow ?? REGION_IDENTITY_COPY.noneEyebrow);

  const title =
    regionStatus === 'none'
      ? REGION_IDENTITY_COPY.noneTitle
      : regionStatus === 'unknown'
        ? REGION_IDENTITY_COPY.unknownTitle
        : (currentRegion?.displayName ?? REGION_IDENTITY_COPY.unknownTitle);

  const statusHint =
    regionStatus === 'comingSoon'
      ? REGION_IDENTITY_COPY.comingSoonHint
      : regionStatus === 'sealed'
        ? REGION_IDENTITY_COPY.sealedHint
        : undefined;

  const statusOpacity = REGION_IDENTITY_STATUS_OPACITY[regionStatus];
  const dormant = regionStatus === 'none';

  return (
    <motion.div
      data-slot="region-identity"
      data-region-id={currentRegion?.id}
      data-region-status={regionStatus}
      data-region-accent={currentRegion?.accent ?? 'neutral'}
      data-region-icon={currentRegion?.iconId}
      className={cn(
        'flex w-full flex-col items-center text-center',
        className,
      )}
      style={{ gap: spacing.xs }}
      initial={reduceMotion ? false : identityEnterFrom}
      animate={{ ...identityEnterTo, opacity: statusOpacity }}
      transition={
        reduceMotion
          ? identityEnterTransitionReduced
          : identityEnterTransition
      }
    >
      {dormant ? (
        <>
          <p
            data-slot="region-identity-eyebrow"
            className={cn(
              'text-[0.625rem] uppercase tracking-[0.38em] text-muted-foreground',
              legibility.copy,
            )}
          >
            {eyebrow}
          </p>
          <span
            data-slot="region-identity-tether"
            aria-hidden="true"
            className="h-10 w-px bg-gradient-to-b from-border/60 to-transparent"
          />
        </>
      ) : (
        <>
          <div
            data-slot="region-identity-emblem"
            aria-hidden="true"
            className={cn(
              'size-2 rotate-45 border',
              accent.emblem,
              accent.fill,
            )}
          />

          <p
            data-slot="region-identity-eyebrow"
            className={cn(
              'text-[0.625rem] uppercase tracking-[0.32em] text-muted-foreground',
              legibility.copy,
            )}
          >
            {eyebrow}
          </p>

          <p
            data-slot="region-identity-title"
            className={cn(
              'text-sm tracking-[-0.01em] text-foreground/80',
              legibility.copy,
            )}
          >
            {title}
          </p>

          <div
            data-slot="region-identity-accent"
            aria-hidden="true"
            className={cn('h-px w-8', accent.rule)}
          />

          {statusHint ? (
            <p
              data-slot="region-identity-status-hint"
              className={cn(
                'text-[0.5625rem] uppercase tracking-[0.28em] text-muted-foreground',
                legibility.copy,
              )}
            >
              {statusHint}
            </p>
          ) : null}
        </>
      )}
    </motion.div>
  );
}
