'use client';

import { useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

import {
  WORLD_ENVIRONMENT_DEPTH_MEDIA,
  WORLD_ENVIRONMENT_DEPTH_VAR,
} from './world-environment.constants';
import type { EnvironmentDepthProps } from './world-environment.types';

/**
 * EnvironmentDepth — pointer position as two CSS custom properties.
 *
 * The only moving part of the dimensional environment, and deliberately the
 * smallest one possible. It publishes `--depth-x` / `--depth-y` in the range
 * -1..1 on a single container; which layers respond, and how far, is decided
 * in CSS by the layers themselves.
 *
 * Nothing here touches React state, so pointer movement never triggers a
 * render — the work per frame is two `setProperty` calls on one element,
 * coalesced to one animation frame no matter how fast the pointer streams.
 *
 * Both properties default to 0, so the environment composes correctly before
 * hydration, without JavaScript, and under every fallback below.
 */
export function EnvironmentDepth({
  children,
  className,
}: Readonly<EnvironmentDepthProps>) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const query = window.matchMedia(WORLD_ENVIRONMENT_DEPTH_MEDIA);

    let frame = 0;
    let x = 0;
    let y = 0;

    const commit = () => {
      frame = 0;
      node.style.setProperty(WORLD_ENVIRONMENT_DEPTH_VAR.x, x.toFixed(4));
      node.style.setProperty(WORLD_ENVIRONMENT_DEPTH_VAR.y, y.toFixed(4));
    };

    const track = (event: PointerEvent) => {
      x = (event.clientX / window.innerWidth) * 2 - 1;
      y = (event.clientY / window.innerHeight) * 2 - 1;
      if (frame === 0) frame = window.requestAnimationFrame(commit);
    };

    const rest = () => {
      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
      node.style.removeProperty(WORLD_ENVIRONMENT_DEPTH_VAR.x);
      node.style.removeProperty(WORLD_ENVIRONMENT_DEPTH_VAR.y);
    };

    // Re-evaluated on change so switching on reduced motion, or moving the
    // window to a touch screen, settles the world instead of stranding it.
    const sync = () => {
      window.removeEventListener('pointermove', track);
      if (query.matches) {
        window.addEventListener('pointermove', track, { passive: true });
      } else {
        rest();
      }
    };

    sync();
    query.addEventListener('change', sync);

    return () => {
      query.removeEventListener('change', sync);
      window.removeEventListener('pointermove', track);
      rest();
    };
  }, []);

  return (
    <div ref={ref} className={cn('absolute inset-0', className)}>
      {children}
    </div>
  );
}
