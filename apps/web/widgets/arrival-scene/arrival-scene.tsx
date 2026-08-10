'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { worldHref } from '@/shared/lib/navigation';
import { AtmosphereLayer } from '@/widgets/atmosphere-layer';
import { Hero } from '@/widgets/hero';
import { PortalCTA } from '@/widgets/portal-cta';

import {
  dispatchArrivalCeremony,
  isArrivalLocked,
  reduceArrivalPhase,
} from './arrival-scene.motion';
import type { ArrivalPhase, ArrivalPhaseEvent } from './arrival-scene.types';

/** Arrival destination — shared by invitation label and World Transition. */
const ARRIVAL_DESTINATION = 'AetherAnime';

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * ArrivalScene — Experience Director for the Arrival stage.
 *
 * Owns canonical `ArrivalPhase` and dispatches lifecycle events into
 * `reduceArrivalPhase`. Portal initiates via callbacks; Hero and Atmosphere
 * subscribe only to `ArrivalPhase`. World Transition runs on `onComplete`
 * after Settling — never during Crossing.
 *
 * Layering: ExperienceLayout (shell) → ArrivalScene (director) → widgets.
 */
export function ArrivalScene() {
  const router = useRouter();
  const [phase, setPhase] = useState<ArrivalPhase>('idle');
  const phaseRef = useRef<ArrivalPhase>('idle');
  const ceremonyAbortRef = useRef<AbortController | null>(null);
  const transitionedRef = useRef(false);

  useEffect(() => {
    return () => {
      ceremonyAbortRef.current?.abort();
    };
  }, []);

  const dispatch = (event: ArrivalPhaseEvent) => {
    const next = reduceArrivalPhase(phaseRef.current, event);
    phaseRef.current = next;
    setPhase(next);
  };

  const handleAccept = () => {
    if (isArrivalLocked(phaseRef.current)) return;

    ceremonyAbortRef.current?.abort();
    const controller = new AbortController();
    ceremonyAbortRef.current = controller;
    transitionedRef.current = false;

    void dispatchArrivalCeremony(dispatch, {
      reducedMotion: prefersReducedMotion(),
      signal: controller.signal,
    }).catch((error: unknown) => {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      throw error;
    });
  };

  const handleComplete = () => {
    ceremonyAbortRef.current?.abort();
    ceremonyAbortRef.current = null;
    dispatch('complete');

    // Consequence after full ceremony (Accepting → Crossing → Settling → Idle).
    if (transitionedRef.current) return;
    transitionedRef.current = true;
    router.push(worldHref(ARRIVAL_DESTINATION));
  };

  return (
    <section
      data-slot="arrival-scene"
      data-phase={phase}
      className="relative flex min-h-full w-full flex-col items-center justify-center"
    >
      <AtmosphereLayer phase={phase} />

      <Hero phase={phase} />

      <PortalCTA
        destination={ARRIVAL_DESTINATION}
        onAccept={handleAccept}
        onComplete={handleComplete}
      />

      {/*
        ScrollIndicator
        TODO: Extract to widgets/scroll-indicator when scroll invitation lands.
        Future: subscribe to ArrivalPhase like other performers.
        Neutralized placeholder — no layout influence until implemented.
      */}
      <div
        data-slot="scroll-indicator"
        aria-hidden="true"
        className="pointer-events-none absolute size-0 overflow-hidden"
      />
    </section>
  );
}
