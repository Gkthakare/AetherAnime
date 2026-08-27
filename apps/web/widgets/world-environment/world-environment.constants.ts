import { DURATION, EASING } from '@/shared/lib/motion';
import type { WorldClimate } from '@/shared/world';

/**
 * WorldEnvironment — asset-specific static layer grades.
 *
 * Hero artwork grades stay literal (not theme tokens) so the environment
 * remains tied to the AetherAnime world hero asset.
 *
 * Layer order (back to front): base → far geography → identity plate →
 * midground continuation → sparse midground → depth veil → dimensional light →
 * destination atmosphere → foreground architecture → identity atmosphere →
 * identity veil → vignette → foreground haze.
 *
 * Geographic far / mid-continuation (TASK-058-E) are static plates. Pointer
 * parallax still reinforces the identity + sparse mid + foreground order only.
 */

/** Deep blue-black base behind the hero. */
export const WORLD_ENVIRONMENT_BASE = '#030711';

/**
 * Orientation switch for art-directed plate selection.
 *
 * `orientation: portrait` is true whenever height >= width, which covers
 * phone portrait, tablet portrait, and a narrowed desktop window alike.
 */
export const WORLD_ENVIRONMENT_PORTRAIT_MEDIA = '(orientation: portrait)';

/** Complement of the above, for layers that only exist in landscape. */
export const WORLD_ENVIRONMENT_LANDSCAPE_MEDIA = '(orientation: landscape)';

/**
 * Inline 1x1 transparent GIF.
 *
 * The `<img>` fallback for a landscape-only layer. `<picture>` always needs a
 * resolvable `src`, and pointing it at the real asset would download the layer
 * on portrait only to hide it. This costs no request at all.
 */
export const WORLD_ENVIRONMENT_TRANSPARENT_PIXEL =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

/** Intrinsic size of the 16:9 identity landscape master — reserves aspect, avoids CLS. */
export const WORLD_ENVIRONMENT_LANDSCAPE_SIZE = {
  width: 1536,
  height: 864,
} as const;

/** Intrinsic size of the 2:3 portrait identity companion. */
export const WORLD_ENVIRONMENT_PORTRAIT_SIZE = {
  width: 1280,
  height: 1920,
} as const;

/**
 * Intrinsic size of the TASK-058-E far landscape master.
 *
 * Verified production file: 2560×1440 RGB WebP (adequate for 1920×1080 cover).
 */
export const WORLD_ENVIRONMENT_FAR_LANDSCAPE_SIZE = {
  width: 2560,
  height: 1440,
} as const;

/** Intrinsic size of the TASK-058-E far portrait master — 1280×1920 RGB WebP. */
export const WORLD_ENVIRONMENT_FAR_PORTRAIT_SIZE = {
  width: 1280,
  height: 1920,
} as const;

/**
 * Custom properties written by `EnvironmentDepth`.
 *
 * Both are normalised pointer offsets in the range -1..1, defaulting to 0 so
 * every layer composes to its resting position with no script at all.
 */
export const WORLD_ENVIRONMENT_DEPTH_VAR = {
  x: '--depth-x',
  y: '--depth-y',
} as const;

/**
 * Media gate for the depth response.
 *
 * Fine pointer only — a coarse pointer has no hover position to read, and
 * driving this from touch would fight the scroll. Reduced motion opts out
 * entirely, leaving the composition static but visually complete.
 */
export const WORLD_ENVIRONMENT_DEPTH_MEDIA =
  '(pointer: fine) and (prefers-reduced-motion: no-preference)';

/**
 * Per-layer parallax amplitude, in pixels of HALF-travel.
 *
 * The pointer normalises to -1..1, so a layer's full edge-to-edge travel is
 * twice the value here: the plate moves ±4px (8px full), the midground ±8px
 * (16px), the foreground ±16px (32px). At 1920 that is 0.4%, 0.8% and 1.7% of
 * the viewport, inside the intended 0.5–2% envelope.
 *
 * Depth is carried by the *difference* between them, not their size. The three
 * planes are spaced roughly 2x apart so each reads as a distinct distance
 * rather than one image sliding. Vertical is damped further throughout;
 * vertical parallax reads as unstable long before horizontal does.
 */
const DEPTH_AMPLITUDE = {
  distance: { x: -4, y: -2 },
  midground: { x: -8, y: -4 },
  foreground: { x: -16, y: -9 },
} as const;

const depthTransform = ({ x, y }: { x: number; y: number }) =>
  `translate3d(calc(var(${WORLD_ENVIRONMENT_DEPTH_VAR.x}, 0) * ${x}px), calc(var(${WORLD_ENVIRONMENT_DEPTH_VAR.y}, 0) * ${y}px), 0)`;

/** Resting-safe transforms for each depth layer. */
export const WORLD_ENVIRONMENT_DEPTH_TRANSFORM = {
  distance: depthTransform(DEPTH_AMPLITUDE.distance),
  midground: depthTransform(DEPTH_AMPLITUDE.midground),
  foreground: depthTransform(DEPTH_AMPLITUDE.foreground),
} as const;

/**
 * Static transform for geographic far / mid-continuation plates.
 *
 * TASK-058-E forbids parallax on the new geography — extent is painted, not
 * gestured. Identity / sparse mid / foreground keep their depth amplitudes.
 */
export const WORLD_ENVIRONMENT_GEOGRAPHY_STATIC_TRANSFORM = 'translate3d(0, 0, 0)';

/**
 * Far geography grade — quieter than the identity landmark.
 */
export const WORLD_ENVIRONMENT_FAR_GRADE =
  'brightness-[0.92] contrast-[0.96] saturate-[0.95]';

/**
 * Midground continuation treatment — denser geography bridge.
 *
 * Effective scene opacity targets ~0.7–0.85 of authored alpha; tuned visually
 * so hero salience stays above the bridge.
 */
export const WORLD_ENVIRONMENT_MIDGROUND_CONTINUATION_TREATMENT =
  'opacity-[0.78]';

/**
 * Overscan on translated layers.
 *
 * A layer that fills exactly 100% would expose the base colour along one edge
 * as soon as it shifts. 3% clears the largest amplitude above on any viewport
 * wide enough to have a fine pointer.
 */
export const WORLD_ENVIRONMENT_DEPTH_OVERSCAN = '-inset-[3%]';

/**
 * Damping for the depth response.
 *
 * The transform is re-targeted every animation frame; the transition turns
 * that into a trailing settle so the world feels heavy instead of cursor-bound.
 * `motion-safe` keeps it out of the reduced-motion branch entirely.
 */
export const WORLD_ENVIRONMENT_DEPTH_DAMPING =
  'motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out';

/**
 * Treatment for the near architecture.
 *
 * The focal plane of this composition is the distance, where the world title
 * sits, so the nearest layer is slightly defocused the way a foreground framing
 * element is in a matte painting. Without it the keyed silhouette lands as a
 * hard cutout against detailed artwork and reads as pasted rather than near.
 * The small opacity cut lets the world's haze settle over it.
 */
export const WORLD_ENVIRONMENT_DEPTH_FOREGROUND_TREATMENT =
  'blur-[3px] opacity-[0.92]';

/**
 * Treatment for the middle-distance ruins.
 *
 * Softer than the near layer but sharper than the plate, which is what places
 * it between them. The opacity is higher than the foreground's transparency
 * would suggest because the artwork is deliberately keyed dark: measured
 * against the plate it sits over, anything lighter composites to the plate's
 * own value and disappears. The 20% that does bleed through is the plate's
 * detail showing faintly through the ruins, which is the atmosphere doing its
 * job rather than a weaker layer.
 */
export const WORLD_ENVIRONMENT_DEPTH_MIDGROUND_TREATMENT =
  'blur-[1.5px] opacity-[0.8]';

/**
 * Intrinsic size of the landscape depth layers.
 *
 * Both mirror the plate, so every plane crops identically under `object-cover`
 * and the planes stay registered to one another at any aspect ratio.
 */
export const WORLD_ENVIRONMENT_DEPTH_LAYER_SIZE = {
  width: 1536,
  height: 864,
} as const;

/**
 * Static grade on the artwork itself, per orientation.
 *
 * The landscape master is a dark plate whose arch silhouettes disappear behind
 * the atmospheric layers, so it needs a real lift. The portrait companion is
 * composed around a large hazy calm band; the same lift flattens that haze into
 * a uniform violet wash and costs the sunken ruins their depth. It therefore
 * takes a near-neutral exposure with slightly more contrast instead.
 *
 * The portrait values ride a `portrait:` variant on the same element, so the
 * landscape grade is untouched and no JavaScript observes the viewport.
 */
export const WORLD_ENVIRONMENT_ARTWORK_GRADE = [
  'brightness-[1.34] contrast-[1.02] saturate-[1.12]',
  'portrait:brightness-[1.3] portrait:contrast-[1.2] portrait:saturate-[1.08]',
].join(' ');

/**
 * Depth veil — vertical readability.
 *
 * Kept light at the top: the artwork's own sky is already near-black, and the
 * Region layer above the world earns its contrast from type legibility rather
 * than from darkening the environment further.
 */
export const WORLD_ENVIRONMENT_DEPTH_VEIL =
  'linear-gradient(180deg, rgba(3,7,17,0.46) 0%, rgba(3,7,17,0.18) 18%, rgba(5,10,25,0.02) 44%, rgba(3,7,17,0.38) 78%, rgba(3,7,17,0.74) 100%)';

/** Central cyan/indigo dimensional light — separates the silhouettes. */
export const WORLD_ENVIRONMENT_DIMENSIONAL_LIGHT =
  'radial-gradient(ellipse 64% 54% at 50% 46%, rgba(0, 245, 212, 0.16) 0%, rgba(79, 70, 229, 0.15) 38%, transparent 74%)';

/**
 * Peak opacity of the focused-destination atmosphere.
 *
 * The wash uses the same `--primary` / `--ring` climate identity as
 * RegionClimate, at full token strength, with this opacity as the actual mix.
 * RegionClimate's own gradient strings are a 12–18% color-mix built for a
 * small presence slot; at world scale even opacity 0.28 of those strings
 * measured a 2/255 ceiling — below perception. 0.10 of a full-token radial
 * is the brief's intended envelope: visible in A/B, atmospheric in use.
 */
export const WORLD_ENVIRONMENT_DESTINATION_LIGHT_OPACITY = 0.1;

/**
 * Arrival acknowledgement mix — denser than region Focus so Destination reads
 * as arrived place light (TASK-060) without becoming a second light show.
 */
export const WORLD_ENVIRONMENT_ARRIVAL_LIGHT_OPACITY = 0.24;

/** Arrival identity tint. Supports place without overpowering destination UI. */
export const WORLD_ENVIRONMENT_ARRIVAL_IDENTITY_OPACITY = 0.09;

/**
 * Shared climate token roles — the Task-006 mapping, extracted so the identity
 * veil can inherit it rather than invent a second one.
 *
 * `fillAt` is the world-scale fill position used by destination atmosphere.
 * Identity atmosphere stays centred on the title and ignores it.
 */
type ClimateToken = '--primary' | '--ring';

export const WORLD_ENVIRONMENT_CLIMATE_ROLE: Record<
  WorldClimate,
  {
    readonly lead: ClimateToken;
    readonly fill?: ClimateToken;
    readonly fillAt?: string;
  }
> = {
  neutral: { lead: '--primary' },
  cool: { lead: '--ring', fill: '--primary', fillAt: '62% 72%' },
  warm: { lead: '--primary', fill: '--ring', fillAt: '40% 78%' },
  charged: { lead: '--primary', fill: '--ring', fillAt: '68% 68%' },
};

/**
 * World-scale destination atmosphere, keyed by the existing Region climate.
 *
 * Token roles match `REGION_CLIMATE_GRADIENT` (neutral → primary, cool → ring
 * lead, warm → primary lead, charged → both). Geometry matches the dimensional
 * light so the world is lit, not spotted. No new hues — only `--primary` and
 * `--ring`, the same variables RegionClimate already uses.
 */
const destinationAtmosphere = ({
  lead,
  fill,
  fillAt = '60% 64%',
}: (typeof WORLD_ENVIRONMENT_CLIMATE_ROLE)[WorldClimate]) => {
  const core = `radial-gradient(ellipse 64% 54% at 50% 48%, color-mix(in oklab, var(${lead}) 100%, transparent), transparent 74%)`;
  if (!fill) return core;
  return `${core}, radial-gradient(ellipse 42% 36% at ${fillAt}, color-mix(in oklab, var(${fill}) 70%, transparent), transparent 64%)`;
};

export const WORLD_ENVIRONMENT_DESTINATION_ATMOSPHERE = {
  neutral: destinationAtmosphere(WORLD_ENVIRONMENT_CLIMATE_ROLE.neutral),
  cool: destinationAtmosphere(WORLD_ENVIRONMENT_CLIMATE_ROLE.cool),
  warm: destinationAtmosphere(WORLD_ENVIRONMENT_CLIMATE_ROLE.warm),
  charged: destinationAtmosphere(WORLD_ENVIRONMENT_CLIMATE_ROLE.charged),
} as const satisfies Record<WorldClimate, string>;

/**
 * Opacity crossfade for destination atmosphere.
 *
 * `DURATION.SLOW` (600ms) sits inside the intended 500–900ms settle. Reduced
 * motion opts out via `motion-reduce:!transition-none` on the layer — the
 * focused colour still appears, immediately.
 */
export const WORLD_ENVIRONMENT_DESTINATION_LIGHT_TRANSITION = `opacity ${DURATION.SLOW}s cubic-bezier(${EASING.cinematic.join(',')})`;

/**
 * Readable veil behind the World identity.
 *
 * Soft and wide so the title gains contrast without a visible panel edge.
 * Geometry is the identity contract — climate may tint underneath, never
 * replace or shrink this backing.
 */
export const WORLD_ENVIRONMENT_IDENTITY_VEIL =
  'radial-gradient(ellipse 52% 38% at 50% 50%, rgba(3, 7, 17, 0.5) 0%, rgba(3, 7, 17, 0.26) 48%, transparent 78%)';

/**
 * Peak opacity of the identity-climate atmosphere.
 *
 * Subordinate to Task-006's destination wash (0.10). Starts at 0.03; the dark
 * identity veil sits in front and is allowed to dominate. Tune only if visual
 * QA shows the layer is imperceptible.
 */
export const WORLD_ENVIRONMENT_IDENTITY_ATMOSPHERE_OPACITY = 0.03;

/**
 * Climate wash for the identity region.
 *
 * Same token roles as destination atmosphere. Geometry matches the identity
 * veil so the acknowledgement stays around the title, not a second world-scale
 * light. Fill, when present, stays centred rather than using the world-scale
 * `fillAt` — this is not a climate visualization widget.
 */
const identityAtmosphere = ({
  lead,
  fill,
}: (typeof WORLD_ENVIRONMENT_CLIMATE_ROLE)[WorldClimate]) => {
  const core = `radial-gradient(ellipse 52% 38% at 50% 50%, color-mix(in oklab, var(${lead}) 100%, transparent), transparent 78%)`;
  if (!fill) return core;
  return `${core}, radial-gradient(ellipse 36% 26% at 50% 50%, color-mix(in oklab, var(${fill}) 70%, transparent), transparent 72%)`;
};

export const WORLD_ENVIRONMENT_IDENTITY_ATMOSPHERE = {
  neutral: identityAtmosphere(WORLD_ENVIRONMENT_CLIMATE_ROLE.neutral),
  cool: identityAtmosphere(WORLD_ENVIRONMENT_CLIMATE_ROLE.cool),
  warm: identityAtmosphere(WORLD_ENVIRONMENT_CLIMATE_ROLE.warm),
  charged: identityAtmosphere(WORLD_ENVIRONMENT_CLIMATE_ROLE.charged),
} as const satisfies Record<WorldClimate, string>;

/**
 * Edge vignette.
 *
 * Opens later and lands softer than a standard vignette so the flanking
 * architecture stays legible instead of being crushed to black.
 */
export const WORLD_ENVIRONMENT_VIGNETTE =
  'radial-gradient(ellipse at center, transparent 40%, rgba(3, 7, 17, 0.24) 74%, rgba(3, 7, 17, 0.7) 100%), linear-gradient(90deg, rgba(3, 7, 17, 0.34), transparent 24%, transparent 76%, rgba(3, 7, 17, 0.34))';

/** Foreground haze / silhouette at the lower edge. */
export const WORLD_ENVIRONMENT_FOREGROUND_HAZE =
  'radial-gradient(ellipse at center, rgba(19, 35, 65, 0.58) 0%, rgba(3, 7, 17, 0.8) 58%, rgba(3, 7, 17, 0) 76%)';
