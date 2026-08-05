import { cn } from '@/lib/utils';

import {
  PORTAL_FIELD,
  PORTAL_GEOMETRY_SIZE_CLASS,
  PORTAL_HAIRLINE,
  PORTAL_PLATE_CLIP,
  PORTAL_SEAM,
} from './portal-geometry.constants';
import type { PortalGeometryProps } from './portal-geometry.types';

/**
 * PortalGeometry — Impossible Threshold visual structure.
 *
 * Idle geometry only (Sprint-003 Task-001). No state, no ceremony motion.
 * Decorative: always rendered inside an `aria-hidden` host by PortalCTA.
 *
 * Layers (back → front): field → plates → chamber → seam → hairline →
 * singularity. Future particles mount in `data-slot="portal-particle-field"`
 * without changing this hierarchy.
 *
 * Canon: `docs/design/PORTAL_IDENTITY.md`.
 */
export function PortalGeometry({ className }: PortalGeometryProps) {
  return (
    <div
      data-slot="portal-geometry"
      className={cn(PORTAL_GEOMETRY_SIZE_CLASS, className)}
    >
      {/* Atmospheric field — soft yield around the threshold */}
      <div
        data-slot="portal-field"
        className="pointer-events-none absolute rounded-[40%]"
        style={{
          inset: PORTAL_FIELD.inset,
          opacity: PORTAL_FIELD.opacity,
          background:
            'radial-gradient(ellipse 55% 65% at 46% 48%, color-mix(in oklab, var(--primary) 14%, transparent), transparent 70%)',
        }}
      />

      {/* Fracture plates — faces of “here,” gently misaligned */}
      <div
        data-slot="portal-plate-near"
        className="pointer-events-none absolute inset-0"
        style={{
          clipPath: PORTAL_PLATE_CLIP.near,
          background:
            'linear-gradient(145deg, color-mix(in oklab, var(--primary) 22%, var(--card)) 0%, color-mix(in oklab, var(--card) 70%, var(--background)) 55%, var(--background) 100%)',
          opacity: 0.55,
          transform: 'translate(-1.5%, -0.5%)',
        }}
      />
      <div
        data-slot="portal-plate-far"
        className="pointer-events-none absolute inset-0"
        style={{
          clipPath: PORTAL_PLATE_CLIP.far,
          background:
            'linear-gradient(210deg, color-mix(in oklab, var(--card) 80%, var(--background)) 0%, color-mix(in oklab, var(--primary) 12%, var(--background)) 100%)',
          opacity: 0.42,
          transform: 'translate(1.5%, 1%)',
        }}
      />

      {/* Negative chamber — sacred void; the door is empty space */}
      <div
        data-slot="portal-chamber"
        className="pointer-events-none absolute inset-[22%] rounded-[32%]"
        style={{
          background:
            'radial-gradient(ellipse 70% 80% at 48% 50%, var(--background) 0%, color-mix(in oklab, var(--background) 85%, transparent) 55%, transparent 75%)',
        }}
      />

      {/* Future particle host — empty; Particle Engine mounts here later */}
      <div
        data-slot="portal-particle-field"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      />

      {/* Primary seam — glyph of AetherAnime; visual focus */}
      <div
        data-slot="portal-seam"
        className="pointer-events-none absolute"
        style={{
          width: PORTAL_SEAM.width,
          height: PORTAL_SEAM.height,
          top: PORTAL_SEAM.top,
          left: PORTAL_SEAM.left,
          transform: `rotate(${PORTAL_SEAM.rotate})`,
          background:
            'linear-gradient(180deg, transparent 0%, color-mix(in oklab, var(--ring) 55%, transparent) 12%, color-mix(in oklab, var(--foreground) 75%, var(--ring)) 48%, color-mix(in oklab, var(--ring) 60%, transparent) 82%, transparent 100%)',
          opacity: 0.9,
        }}
      />

      {/* Hairline stress — supports the seam */}
      <div
        data-slot="portal-hairline"
        className="pointer-events-none absolute"
        style={{
          width: PORTAL_HAIRLINE.width,
          height: PORTAL_HAIRLINE.height,
          top: PORTAL_HAIRLINE.top,
          left: PORTAL_HAIRLINE.left,
          transform: `rotate(${PORTAL_HAIRLINE.rotate})`,
          opacity: PORTAL_HAIRLINE.opacity,
          background:
            'linear-gradient(180deg, transparent, color-mix(in oklab, var(--primary) 45%, transparent), transparent)',
        }}
      />

      {/* Singularity — quiet gravitational invitation */}
      <div
        data-slot="portal-singularity"
        className="pointer-events-none absolute left-1/2 top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full md:size-3"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, var(--foreground) 0%, color-mix(in oklab, var(--ring) 40%, var(--foreground)) 35%, transparent 72%)',
          opacity: 0.85,
        }}
      />
    </div>
  );
}
