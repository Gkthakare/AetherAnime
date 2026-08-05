'use client';

import { useCallback, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { spacing, zIndex } from '@/shared/config/theme';
import { DISTANCE } from '@/shared/lib/motion';
import { Surface } from '@/shared/ui/surface';
import { cn } from '@/lib/utils';

import { PortalGeometry } from './portal-geometry';
import {
  PORTAL_SEQUENCE,
  PORTAL_SEQUENCE_REDUCED,
  isPortalLocked,
  portalEnterTransition,
} from './portal-cta.motion';
import type { PortalCTAProps, PortalPhase } from './portal-cta.types';

const DEFAULT_DESTINATION = 'AetherAnime';

function wait(seconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
}

/**
 * PortalCTA — Impossible Threshold invitation to Enter {destination}.
 *
 * Call to Adventure, not Call to Action. Owns interaction and local phase
 * lifecycle. Visual structure is `PortalGeometry` (idle geometry only in
 * Sprint-003 Task-001). Ceremony motion for geometry is deferred.
 *
 * Layering: ExperienceLayout → ArrivalScene → PortalCTA (z-content).
 */
export function PortalCTA({
  destination = DEFAULT_DESTINATION,
  disabled = false,
  onAccept,
  onComplete,
  className,
  onKeyDown,
  ...props
}: PortalCTAProps) {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<PortalPhase>('idle');
  const phaseRef = useRef<PortalPhase>('idle');

  const label = `Enter ${destination}`;
  const locked = isPortalLocked(phase);
  const busy = locked;

  const setPortalPhase = useCallback((next: PortalPhase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  const wake = useCallback(() => {
    if (disabled || isPortalLocked(phaseRef.current)) return;
    if (phaseRef.current === 'idle') {
      setPortalPhase('inviting');
    }
  }, [disabled, setPortalPhase]);

  const rest = useCallback(() => {
    if (isPortalLocked(phaseRef.current)) return;
    if (phaseRef.current === 'inviting') {
      setPortalPhase('idle');
    }
  }, [setPortalPhase]);

  const runSequence = useCallback(async () => {
    if (disabled || isPortalLocked(phaseRef.current)) return;

    // Lock synchronously before awaits so duplicate activations cannot stack.
    setPortalPhase('accepting');
    onAccept?.();

    const sequence = reduceMotion ? PORTAL_SEQUENCE_REDUCED : PORTAL_SEQUENCE;

    await wait(sequence.accepting);

    setPortalPhase('crossing');
    await wait(sequence.crossing);

    setPortalPhase('settling');
    await wait(sequence.settling);

    setPortalPhase('idle');
    onComplete?.();
  }, [disabled, onAccept, onComplete, reduceMotion, setPortalPhase]);

  return (
    <Surface
      variant="transparent"
      className={cn(
        'relative flex flex-col items-center justify-center',
        className,
      )}
      style={{
        zIndex: zIndex.content,
        marginTop: spacing['2xl'],
      }}
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: DISTANCE.SM }}
        animate={{ opacity: 1, y: 0 }}
        transition={portalEnterTransition}
      >
        <button
          type="button"
          data-slot="portal-cta"
          data-phase={phase}
          aria-busy={busy || undefined}
          aria-disabled={disabled || locked || undefined}
          disabled={disabled}
          {...props}
          onPointerEnter={wake}
          onPointerLeave={rest}
          onFocus={wake}
          onBlur={rest}
          onClick={() => {
            void runSequence();
          }}
          onKeyDown={(event) => {
            if (
              (event.key === 'Enter' || event.key === ' ') &&
              (disabled || locked)
            ) {
              event.preventDefault();
            }
            onKeyDown?.(event);
          }}
          className={cn(
            'group relative flex flex-col items-center',
            'border-0 bg-transparent p-3',
            'cursor-pointer disabled:cursor-not-allowed',
            'focus-visible:outline-none',
            'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4',
            'focus-visible:ring-offset-background',
            (disabled || locked) && 'cursor-not-allowed',
            disabled && 'opacity-50',
          )}
          style={{ gap: spacing.lg }}
        >
          <span aria-hidden="true">
            <PortalGeometry />
          </span>

          <span className="text-sm tracking-[0.08em] text-ring md:text-base">
            {label}
          </span>
        </button>
      </motion.div>
    </Surface>
  );
}
