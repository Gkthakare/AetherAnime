/**
 * Impossible Threshold — static geometry + material constants.
 *
 * Visual DNA from `docs/design/PORTAL_IDENTITY.md`.
 * Task-009: cinematic fidelity — theme CSS variables only. No motion values.
 */

/**
 * Arrival-tier canvas — monumental enough to be the entrance protagonist,
 * still leaving substantial negative space around the threshold.
 *
 * Mobile uses a viewport-aware min() so the gate does not simply scale the
 * desktop composition down, and so the CTA stays above the fold.
 */
export const PORTAL_GEOMETRY_SIZE_CLASS =
  'relative size-[min(13.75rem,58vw)] overflow-visible sm:size-56 md:size-64 lg:size-[18.5rem] xl:size-80';

/**
 * Architectural framing around the fracture — decorative depth only.
 * Never a second tab stop; the CTA button remains the sole control.
 */
export const PORTAL_GATE_FRAME = {
  interactive: false,
  outer:
    'pointer-events-none absolute inset-y-[-20%] inset-x-[-14%] rounded-[28%] border border-ring/22 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--ring)_7%,transparent)_0%,transparent_74%)] transition-[border-color] duration-200 group-hover:border-ring/50 group-focus-visible:border-ring/60 motion-reduce:transition-none',
  aperture:
    'pointer-events-none absolute inset-y-[-7%] inset-x-[-5%] rounded-[22%] border border-ring/32 transition-[border-color] duration-200 group-hover:border-ring/65 group-focus-visible:border-ring/75 motion-reduce:transition-none',
} as const;

/**
 * Fracture plate clip paths — asymmetrical vertical reality fracture.
 * Irregular mass; not radial, not circular, not shatter noise.
 */
export const PORTAL_PLATE_CLIP = {
  /** “Here” — left/upper geological face (heavier vertical mass). */
  near: 'polygon(3% 6%, 56% 2%, 49% 98%, 1% 74%)',
  /** “Here” — right/lower face, deliberately misaligned. */
  far: 'polygon(51% 4%, 97% 16%, 95% 96%, 45% 90%)',
} as const;

/** Primary seam — cyan-led dimensional fissure through the threshold. */
export const PORTAL_SEAM = {
  width: '2.5px',
  height: '84%',
  rotate: '-12deg',
  top: '8%',
  left: 'calc(50% - 1.25px)',
} as const;

/** Secondary hairline stress — violet/blue support; never competes with seam. */
export const PORTAL_HAIRLINE = {
  width: '1px',
  height: '32%',
  rotate: '26deg',
  top: '34%',
  left: '33%',
  opacity: 0.32,
} as const;

/** Singularity — quiet gravitational point inside the negative chamber. */
export const PORTAL_SINGULARITY = {
  className:
    'size-3 md:size-3.5 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full',
} as const;

/** Soft atmospheric field — cosmic depth, not bloom stack. */
export const PORTAL_FIELD = {
  inset: '-22%',
  opacity: 0.5,
} as const;

/**
 * Material fills — geological stone + dimensional luminance.
 * Theme tokens only. Cyan (ring) dominates blue/violet (primary) hierarchy.
 */
export const PORTAL_MATERIAL = {
  /** Far cosmic haze — behind stone. */
  atmosphere:
    'radial-gradient(ellipse 70% 85% at 48% 52%, color-mix(in oklab, var(--background) 55%, transparent) 0%, transparent 72%)',

  /** Dimensional field — restrained ring tint, never overpowering seam. */
  field:
    'radial-gradient(ellipse 48% 62% at 47% 48%, color-mix(in oklab, var(--ring) 10%, transparent), transparent 68%), radial-gradient(ellipse 75% 90% at 52% 58%, color-mix(in oklab, var(--primary) 6%, transparent), transparent 78%)',

  /** Near plate — monumental weathered stone with edge lift. */
  plateNear:
    'linear-gradient(148deg, color-mix(in oklab, var(--foreground) 14%, var(--card)) 0%, color-mix(in oklab, var(--card) 78%, var(--background)) 38%, color-mix(in oklab, var(--background) 70%, var(--card)) 72%, var(--background) 100%)',

  /** Far plate — cooler geological mass, slightly recessed. */
  plateFar:
    'linear-gradient(218deg, color-mix(in oklab, var(--card) 72%, var(--background)) 0%, color-mix(in oklab, var(--background) 55%, var(--card)) 42%, color-mix(in oklab, var(--ring) 8%, var(--background)) 100%)',

  /** Plate fracture edge luminance (static overlay). */
  plateEdgeNear:
    'linear-gradient(90deg, transparent 0%, color-mix(in oklab, var(--ring) 18%, transparent) 42%, color-mix(in oklab, var(--foreground) 12%, transparent) 58%, transparent 100%)',

  plateEdgeFar:
    'linear-gradient(270deg, transparent 0%, color-mix(in oklab, var(--ring) 12%, transparent) 48%, transparent 100%)',

  /** Chamber void — deepest negative space before singularity. */
  chamber:
    'radial-gradient(ellipse 65% 78% at 48% 50%, color-mix(in oklab, var(--background) 96%, black) 0%, color-mix(in oklab, var(--background) 70%, transparent) 48%, transparent 76%)',

  /**
   * Seam — cyan primary → blue mid → violet depth at ends.
   * Brightest toward center (singularity adjacency).
   */
  seam:
    'linear-gradient(180deg, transparent 0%, color-mix(in oklab, var(--primary) 35%, transparent) 6%, color-mix(in oklab, var(--ring) 72%, transparent) 18%, color-mix(in oklab, var(--ring) 88%, var(--foreground)) 42%, color-mix(in oklab, var(--foreground) 55%, var(--ring)) 50%, color-mix(in oklab, var(--ring) 80%, var(--primary)) 58%, color-mix(in oklab, var(--ring) 55%, transparent) 82%, color-mix(in oklab, var(--primary) 28%, transparent) 92%, transparent 100%)',

  /** Hairline — secondary blue/violet stress. */
  hairline:
    'linear-gradient(180deg, transparent, color-mix(in oklab, var(--primary) 38%, var(--ring)) 45%, transparent)',

  /**
   * Singularity — near-black core, cyan rim, restrained blue falloff.
   * Depth via contrast, not scale pulse.
   */
  singularity:
    'radial-gradient(circle at 50% 48%, color-mix(in oklab, var(--background) 92%, black) 0%, color-mix(in oklab, var(--background) 75%, black) 28%, color-mix(in oklab, var(--ring) 42%, transparent) 52%, color-mix(in oklab, var(--primary) 18%, transparent) 68%, transparent 82%)',
} as const;
