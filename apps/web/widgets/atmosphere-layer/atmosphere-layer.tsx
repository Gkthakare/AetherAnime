'use client';

import { zIndex } from '@/shared/config/theme';
import { cn } from '@/lib/utils';
import { WorldEnvironment } from '@/widgets/world-environment';

import './atmosphere-layer.css';
import type { AtmosphereLayerProps } from './atmosphere-layer.types';

/**
 * AtmosphereLayer — living environmental depth behind Arrival content.
 *
 * Reuses WorldEnvironment plates, living light, and vignette. Ceremony echo
 * is a local gate veil keyed by ArrivalPhase — never a second climate or
 * a looping full-viewport gradient field.
 *
 * Layering: ExperienceLayout → ArrivalScene → AtmosphereLayer (z-background).
 */
export function AtmosphereLayer({
  phase = 'idle',
  className,
  ...props
}: AtmosphereLayerProps) {
  return (
    <div
      data-slot="atmosphere-layer"
      data-phase={phase}
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden',
        className,
      )}
      style={{ zIndex: zIndex.background }}
      {...props}
    >
      <WorldEnvironment />

      <div
        data-slot="atmosphere-threshold-veil"
        className="absolute inset-0"
      />

      <div
        data-slot="atmosphere-gate-notice"
        className="absolute inset-0"
      />
    </div>
  );
}
