'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { useReducedMotion } from 'framer-motion';

import { DURATION } from '@/shared/lib/motion';

import type { WorldArrivalAtmosphere } from './world-arrival.atmosphere';
import { WORLD_ENVIRONMENT_DESTINATION_ATMOSPHERE } from './world-environment.constants';
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
    playAnimation(node, `aether-warp-env ${DURATION.WARP}s linear forwards`);
  }, [arrivalKey, spatial]);

  return (
    <div
      ref={ref}
      data-slot="world-environment-crossing"
      className="absolute inset-0"
    >
      {children}
    </div>
  );
}

function crossingAnimation(name: string, spatial: boolean): string {
  if (!spatial) {
    return `aether-warp-reduced ${DURATION.NORMAL}s linear forwards`;
  }
  return `${name} ${DURATION.WARP}s linear forwards`;
}

function CrossingLayer({
  animation,
  className,
  style,
  slot,
}: {
  readonly animation: string;
  readonly className?: string;
  readonly style?: CSSProperties;
  readonly slot: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    playAnimation(ref.current, animation);
  }, [animation]);

  return (
    <div
      ref={ref}
      data-slot={slot}
      className={className}
      style={style}
    />
  );
}

/**
 * Viewport spacetime warp. Decorative only.
 *
 * TASK-107 unified dimensional rupture over TASK-104…106 cyan
 * event-seam grammar. Destination poster approaches from deep void
 * through the hollow tear; one-shot CSS only.
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
  const poster = atmosphere.poster;

  return (
    <div
      key={crossing.key}
      data-slot="world-realm-crossing"
      data-crossing-key={crossing.key}
      data-crossing-climate={climate ?? 'none'}
      data-crossing-spatial={spatial ? 'true' : 'false'}
      data-crossing-reveal={poster ? 'poster' : 'none'}
      data-warp="black-hole"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
    >
      <CrossingLayer
        slot="world-warp-veil"
        className="absolute inset-0"
        animation={crossingAnimation('aether-warp-veil', spatial)}
      />
      {climate ? (
        <CrossingLayer
          slot="world-warp-climate"
          className="absolute inset-0"
          style={{
            background: WORLD_ENVIRONMENT_DESTINATION_ATMOSPHERE[climate],
          }}
          animation={crossingAnimation('aether-warp-climate', spatial)}
        />
      ) : null}
      <CrossingLayer
        slot="world-warp-distortion"
        className="absolute inset-[-22%] origin-center"
        animation={
          spatial
            ? crossingAnimation('aether-warp-distortion', true)
            : crossingAnimation('aether-warp-reduced', false)
        }
      />
      <CrossingLayer
        slot="world-warp-accretion"
        className="absolute inset-[-10%] origin-center"
        animation={
          spatial
            ? crossingAnimation('aether-warp-accretion', true)
            : crossingAnimation('aether-warp-reduced', false)
        }
      />
      {poster ? (
        <CrossingLayer
          slot="world-warp-reveal"
          className="absolute inset-0 origin-center"
          style={{
            backgroundImage: `url("${poster.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}")`,
          }}
          animation={
            spatial
              ? crossingAnimation('aether-warp-reveal', true)
              : crossingAnimation('aether-warp-reduced', false)
          }
        />
      ) : null}
      <CrossingLayer
        slot="world-warp-horizon"
        className="absolute inset-0 origin-center"
        animation={
          spatial
            ? crossingAnimation('aether-warp-horizon', true)
            : crossingAnimation('aether-warp-reduced', false)
        }
      />
      <CrossingLayer
        slot="world-warp-emergence"
        className="absolute inset-0 origin-center"
        animation={
          spatial
            ? crossingAnimation('aether-warp-emergence', true)
            : crossingAnimation('aether-warp-reduced', false)
        }
      />
    </div>
  );
}
