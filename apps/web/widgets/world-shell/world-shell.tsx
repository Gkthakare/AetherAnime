'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { spacing } from '@/shared/config/theme';
import { Surface } from '@/shared/ui/surface';
import { cn } from '@/lib/utils';
import { WorldIdentity } from '@/widgets/world-identity';
import { WorldLayout } from '@/widgets/world-layout';
import { worldArrivalLayoutGaps } from '@/widgets/world-layout/world-arrival.presentation';
import { useWorldScene } from '@/widgets/world-scene/world-scene-context';

import {
  worldShellEnterFrom,
  worldShellEnterTo,
  worldShellEnterTransition,
  worldShellEnterTransitionReduced,
} from './world-shell.motion';
import type { WorldShellProps } from './world-shell.types';

/**
 * WorldShell — permanent destination architecture after Portal completion.
 *
 * Composition host only. Reads identity metadata from Scene context.
 * Placement via WorldLayout; Identity / Climate / Kind / Details fill slots.
 */
export function WorldShell({
  identity,
  presence,
  primary,
  secondary,
  className,
}: WorldShellProps) {
  const { slug, world, status, lifecycle, arrivedAnime } = useWorldScene();
  const gaps = worldArrivalLayoutGaps(arrivedAnime != null);
  const reduceMotion = useReducedMotion();
  const transition = reduceMotion
    ? worldShellEnterTransitionReduced
    : worldShellEnterTransition;

  return (
    <Surface
      variant="transparent"
      data-slot="world-shell"
      data-world-slug={slug}
      data-world-id={world?.id}
      data-world-status={status}
      data-world-lifecycle={lifecycle}
      data-world-kind={world?.kind}
      data-world-climate={world?.climate}
      data-world-arrival={arrivedAnime ? 'anime' : 'idle'}
      className={cn(
        'relative flex w-full flex-1 flex-col',
        arrivedAnime
          ? 'items-center justify-start'
          : 'items-stretch justify-start',
        className,
      )}
      style={{
        gap: spacing['2xl'],
        paddingInline: spacing.xl,
        paddingBlock: arrivedAnime ? spacing.lg : undefined,
        paddingTop: arrivedAnime ? spacing.lg : undefined,
      }}
    >
      <WorldLayout
        arrived={arrivedAnime != null}
        identity={identity ?? <WorldIdentity />}
        presence={presence}
        primary={primary}
        secondary={secondary}
        wrapMain={(main) => (
          <motion.div
            className={cn(
              'relative flex w-full flex-col',
              arrivedAnime ? 'items-center' : 'items-stretch',
              !arrivedAnime && 'pt-[6vh] pb-8 md:pt-[7vh] lg:pt-[6vh] lg:pb-12',
            )}
            style={{
              ['--world-layout-stage-gap' as string]: gaps.stage,
              ['--world-layout-regions-gap' as string]: gaps.regions,
            }}
            initial={reduceMotion ? false : worldShellEnterFrom}
            animate={worldShellEnterTo}
            transition={transition}
          >
            {main}
          </motion.div>
        )}
      />
    </Surface>
  );
}
