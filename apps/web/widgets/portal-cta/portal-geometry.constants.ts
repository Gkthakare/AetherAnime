/**
 * Impossible Threshold — static geometry constants.
 *
 * Visual DNA from `docs/design/PORTAL_IDENTITY.md`.
 * No motion values. No ceremony. Theme CSS variables only.
 */

/** Arrival-tier canvas — dual-scale DNA; icon fidelity is a future concern. */
export const PORTAL_GEOMETRY_SIZE_CLASS =
  'relative size-28 overflow-visible md:size-32';

/**
 * Fracture plate clip paths — calm irregular openings, not shatter noise.
 * Percentages are intentional and asymmetric.
 */
export const PORTAL_PLATE_CLIP = {
  /** “Here” — left/upper reality face. */
  near: 'polygon(6% 14%, 58% 8%, 52% 88%, 4% 78%)',
  /** “Here” — right/lower reality face, slightly misaligned. */
  far: 'polygon(48% 10%, 94% 22%, 90% 86%, 44% 92%)',
} as const;

/** Primary seam — angled fissure through the threshold. */
export const PORTAL_SEAM = {
  width: '2px',
  height: '78%',
  rotate: '-14deg',
  top: '11%',
  left: 'calc(50% - 1px)',
} as const;

/** Secondary hairline stress — supports the seam; never competes. */
export const PORTAL_HAIRLINE = {
  width: '1px',
  height: '28%',
  rotate: '22deg',
  top: '36%',
  left: '34%',
  opacity: 0.35,
} as const;

/** Singularity — quiet gravitational point inside the negative chamber. */
export const PORTAL_SINGULARITY = {
  /** Tailwind: size-2.5 md:size-3 — kept as documentation of dual-scale intent. */
  className: 'size-2.5 md:size-3',
} as const;

/** Soft atmospheric field — reality yield, not bloom stack. */
export const PORTAL_FIELD = {
  inset: '-18%',
  opacity: 0.55,
} as const;
