'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { useReducedMotion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { DURATION } from '@/shared/lib/motion';

import type { WorldArrivalAtmosphere } from './world-arrival.atmosphere';
import {
  WORLD_ENVIRONMENT_DEPTH_VEIL,
  WORLD_ENVIRONMENT_DESTINATION_ATMOSPHERE,
  WORLD_ENVIRONMENT_DIMENSIONAL_LIGHT,
  WORLD_ENVIRONMENT_VIGNETTE,
} from './world-environment.constants';
import { worldRealmCrossing } from './world-realm-crossing';
import './world-realm-crossing.css';

function playAnimation(node: HTMLElement | null, animation: string): void {
  if (!node) return;
  node.style.animation = 'none';
  void node.offsetWidth;
  node.style.animation = animation;
}

/**
 * One-shot transform on the existing depth stack.
 *
 * CSS animation, restarted when the arrival slug changes. Artwork stays
 * mounted. Pointer parallax on child layers is preserved.
 */
export function EnvironmentCrossingFrame({
  arrivalKey,
  spatial,
  children,
}: {
  readonly arrivalKey: string | null;
  readonly spatial: boolean;
  readonly children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!arrivalKey || !spatial) {
      if (node) node.style.animation = 'none';
      return;
    }
    playAnimation(node, `aether-realm-env ${DURATION.CINEMATIC}s linear forwards`);
  }, [arrivalKey, spatial]);

  return (
    <div
      ref={ref}
      data-slot="world-environment-crossing"
      className="absolute inset-0 origin-center"
    >
      {children}
    </div>
  );
}

function crossingAnimation(name: string, spatial: boolean): string {
  if (!spatial) {
    return `aether-realm-reduced ${DURATION.NORMAL}s linear forwards`;
  }
  return `${name} ${DURATION.CINEMATIC}s linear forwards`;
}

function CrossingLayer({
  animation,
  className,
  style,
}: {
  readonly animation: string;
  readonly className?: string;
  readonly style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    playAnimation(ref.current, animation);
  }, [animation]);

  return <div ref={ref} className={className} style={style} />;
}

/**
 * Viewport veil / aperture / gate. Decorative only.
 *
 * Sits above destination chrome so the world visibly opens, then recedes
 * onto the existing AnimeDestination payoff.
 */
export function WorldRealmCrossing({
  atmosphere,
}: {
  readonly atmosphere: WorldArrivalAtmosphere;
}) {
  const reduceMotion = useReducedMotion();
  const crossing = worldRealmCrossing({
    atmosphere,
    reduceMotion: !!reduceMotion,
  });

  if (!crossing.active || !crossing.key) return null;

  const spatial = crossing.spatial;
  const climate = crossing.climate;

  return (
    <div
      key={crossing.key}
      data-slot="world-realm-crossing"
      data-crossing-key={crossing.key}
      data-crossing-climate={climate ?? 'none'}
      data-crossing-spatial={spatial ? 'true' : 'false'}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
    >
      <CrossingLayer
        className="absolute inset-0"
        style={{ background: WORLD_ENVIRONMENT_DEPTH_VEIL }}
        animation={crossingAnimation('aether-realm-veil', spatial)}
      />
      {climate ? (
        <CrossingLayer
          className="absolute inset-0"
          style={{
            background: WORLD_ENVIRONMENT_DESTINATION_ATMOSPHERE[climate],
          }}
          animation={crossingAnimation('aether-realm-climate', spatial)}
        />
      ) : null}
      <CrossingLayer
        className="absolute inset-[-12%] origin-center"
        style={{ background: WORLD_ENVIRONMENT_VIGNETTE }}
        animation={
          spatial
            ? crossingAnimation('aether-realm-aperture', true)
            : crossingAnimation('aether-realm-reduced', false)
        }
      />
      <CrossingLayer
        className="absolute inset-0 origin-center"
        style={{ background: WORLD_ENVIRONMENT_DIMENSIONAL_LIGHT }}
        animation={
          spatial
            ? crossingAnimation('aether-realm-gate', true)
            : crossingAnimation('aether-realm-reduced', false)
        }
      />
      <CrossingLayer
        className={cn(
          'absolute inset-[10%_8%] origin-center rounded-[50%]',
          'border border-ring/70 max-md:inset-[12%_6%]',
        )}
        animation={
          spatial
            ? crossingAnimation('aether-realm-ring', true)
            : crossingAnimation('aether-realm-reduced', false)
        }
      />
    </div>
  );
}
