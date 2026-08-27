/**
 * AetherAnime production asset manifest.
 *
 * Static, deterministic, local-only path resolution. No runtime fetch, no
 * dynamic discovery, no CMS. Only shipped files get an entry — optional future
 * slots stay absent rather than pointing at something that does not exist.
 */

/**
 * An asset authored once per viewport orientation.
 *
 * One world, authored twice. A single 16:9 plate cannot serve a 9:16 viewport:
 * `object-fit: cover` throws away the flanking architecture and the browser
 * upscales what little is left. Each orientation therefore gets its own
 * intentionally composed master rather than a crop of the other.
 */
export type OrientedPlate = {
  /** Landscape composition — desktop and tablet landscape. */
  readonly landscape: string;
  /** Portrait composition — tablet and mobile portrait. */
  readonly portrait: string;
};

/**
 * A depth layer shipped for landscape only.
 *
 * Portrait viewports are reached by coarse pointers, which get no parallax, so
 * an extra plane buys no depth there — and with the interface filling a tall
 * frame it has nowhere to sit except behind the subtitle and the Region plates,
 * where it reads as a smudge. The portrait plate keeps its own depth painted in.
 */
export type LandscapeDepthLayer = Pick<OrientedPlate, 'landscape'>;

/**
 * Separated depth layers composited in front of the environment plate.
 *
 * These are genuinely distinct artwork with their own alpha, not the plate
 * repeated at another scale — a duplicated plate only ever reads as a blurred
 * double, never as depth. The plate stays the far world; a layer earns a slot
 * here only where a real nearer element exists.
 *
 * Ordered far to near, which is also the order they composite in.
 *
 * Only shipped layers appear. Further slots stay absent rather than resolving
 * to a missing file.
 */
export type EnvironmentDepthLayers = {
  /**
   * Geographic bridge between the identity landmark and the far horizon
   * (TASK-058-E). Landscape-only RGBA continuation.
   */
  readonly midgroundContinuation: LandscapeDepthLayer;
  /**
   * Middle-distance ruins — slender broken spires across a gulf of haze.
   *
   * Closer than the plate's horizon, further than the foreground frame. This is
   * the plane that makes the composition read as layered while the pointer is
   * still, which a two-plane scene could only do once it moved.
   */
  readonly midground: LandscapeDepthLayer;
  /** Nearest architecture, framing the frame edges. */
  readonly foreground: LandscapeDepthLayer;
};

export type EnvironmentPlates = OrientedPlate & {
  /**
   * Distant geographic horizon behind the identity landmark (TASK-058-E).
   *
   * Authored per orientation — portrait is not a crop of landscape.
   */
  readonly far: OrientedPlate;
  readonly depth: EnvironmentDepthLayers;
};

export type AetherAnimeAssets = {
  readonly worlds: {
    readonly aetheranime: {
      readonly environment: EnvironmentPlates;
    };
  };
};

const AETHERANIME_ENVIRONMENT_DIR =
  '/assets/aetheranime/worlds/aetheranime/environment';

export const AETHERANIME_ASSETS = {
  worlds: {
    aetheranime: {
      environment: {
        /**
         * TASK-058-E — distant world beyond the landmark.
         * Masters: landscape 2560×1440 RGB WebP; portrait 1280×1920 RGB WebP
         * (verified from production files — not a silent upscale claim).
         */
        far: {
          landscape: `${AETHERANIME_ENVIRONMENT_DIR}/aetheranime-world-far-landscape.webp`,
          portrait: `${AETHERANIME_ENVIRONMENT_DIR}/aetheranime-world-far-portrait.webp`,
        },
        // Task-001 landscape master; filename predates the orientation split.
        landscape: `${AETHERANIME_ENVIRONMENT_DIR}/aetheranime-world-hero.webp`,
        portrait: `${AETHERANIME_ENVIRONMENT_DIR}/aetheranime-world-portrait.webp`,
        depth: {
          midgroundContinuation: {
            landscape: `${AETHERANIME_ENVIRONMENT_DIR}/aetheranime-depth-midground-continuation-landscape.webp`,
          },
          midground: {
            landscape: `${AETHERANIME_ENVIRONMENT_DIR}/aetheranime-depth-midground-landscape.webp`,
          },
          foreground: {
            landscape: `${AETHERANIME_ENVIRONMENT_DIR}/aetheranime-depth-foreground-landscape.webp`,
          },
        },
      },
    },
  },
} as const satisfies AetherAnimeAssets;
