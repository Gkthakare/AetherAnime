'use client';

import { useContext } from 'react';
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
import { WorldSceneContext } from '@/widgets/world-scene/world-scene-context';

import {
  WORLD_IDENTITY_COPY,
  WORLD_IDENTITY_TAGLINE_SCALE,
  WORLD_IDENTITY_TITLE_SCALE,
  worldIdentityUserFacingSubtitle,
  worldIdentityUserFacingTagline,
} from './world-identity.constants';
import type { WorldIdentityProps } from './world-identity.types';

/**
 * WorldIdentity — presentation of registry metadata.
 *
 * Reads Scene context and/or explicit props. Never looks up Registry.
 * Owns no Scene / Portal / Navigation / Lifecycle / Focus runtimes.
 */
export function WorldIdentity({
  slug: slugProp,
  world: worldProp,
  status: statusProp,
  tagline: taglineProp,
  className,
}: WorldIdentityProps) {
  const scene = useContext(WorldSceneContext);
  const reduceMotion = useReducedMotion();

  const slug = slugProp ?? scene?.slug;
  const world = worldProp !== undefined ? worldProp : scene?.world;
  const status = statusProp ?? scene?.status;

  if (!slug || !status) {
    throw new Error(
      'WorldIdentity requires WorldScene or explicit slug + status props',
    );
  }

  const title =
    status === 'unknown'
      ? WORLD_IDENTITY_COPY.unknownTitle
      : (world?.displayName ?? slug);

  const subtitle = worldIdentityUserFacingSubtitle({
    status,
    description: world?.description,
  });

  const eyebrow =
    status === 'unknown'
      ? WORLD_IDENTITY_COPY.unknownEyebrow
      : status === 'comingSoon'
        ? WORLD_IDENTITY_COPY.comingSoonEyebrow
        : WORLD_IDENTITY_COPY.validEyebrow;

  const tagline = worldIdentityUserFacingTagline({
    status,
    registryTagline: world?.tagline,
    taglineOverride: taglineProp,
  });
  const taglineScale =
    tagline === WORLD_IDENTITY_COPY.invitation
      ? WORLD_IDENTITY_TAGLINE_SCALE.invitation
      : WORLD_IDENTITY_TAGLINE_SCALE.registry;

  const titleScale =
    status === 'valid'
      ? WORLD_IDENTITY_TITLE_SCALE.name
      : WORLD_IDENTITY_TITLE_SCALE.sentence;

  return (
    <motion.div
      data-slot="world-identity-engine"
      data-world-slug={slug}
      data-world-status={status}
      className={cn(
        'flex w-full flex-col items-center text-center',
        className,
      )}
      style={{ gap: spacing.lg }}
      initial={reduceMotion ? false : identityEnterFrom}
      animate={identityEnterTo}
      transition={
        reduceMotion
          ? identityEnterTransitionReduced
          : identityEnterTransition
      }
    >
      <div
        data-slot="world-identity-crest"
        className="flex flex-col items-center"
        style={{ gap: spacing.sm }}
      >
        <div
          data-slot="world-identity-emblem"
          aria-hidden="true"
          className="size-2.5 rotate-45 border border-ring/45 bg-ring/10"
        />

        <div
          data-slot="world-identity-eyebrow-rule"
          className="flex items-center"
          style={{ gap: spacing.sm }}
        >
          <span
            aria-hidden="true"
            className="h-px w-6 bg-gradient-to-r from-transparent to-ring/40"
          />
          <p
            data-slot="world-identity-eyebrow"
            className={cn(
              'text-[0.6875rem] uppercase tracking-[0.42em] text-ring/90',
              legibility.copy,
            )}
          >
            {eyebrow}
          </p>
          <span
            aria-hidden="true"
            className="h-px w-6 bg-gradient-to-l from-transparent to-ring/40"
          />
        </div>
      </div>

      <h1
        data-slot="world-identity-title"
        className={cn(
          'font-medium leading-[1.02] tracking-[-0.02em] text-foreground',
          titleScale,
          legibility.display,
        )}
      >
        {title}
      </h1>

      <div
        data-slot="world-identity-accent"
        aria-hidden="true"
        className="h-px w-28 bg-gradient-to-r from-transparent via-ring/45 to-transparent"
      />

      {subtitle ? (
        <p
          data-slot="world-identity-subtitle"
          className={cn(
            'max-w-xl text-base leading-relaxed text-foreground/70 md:text-lg',
            legibility.copy,
          )}
        >
          {subtitle}
        </p>
      ) : null}

      {tagline && tagline !== WORLD_IDENTITY_COPY.invitation ? (
        <p
          data-slot="world-identity-tagline"
          className={cn(taglineScale, legibility.copy)}
        >
          {tagline}
        </p>
      ) : null}
    </motion.div>
  );
}
