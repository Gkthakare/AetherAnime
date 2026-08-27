# AetherAnime Visual Production Foundation

## Scope

Establish a production asset convention and the first layered AetherAnime world environment without changing World, Region, Focus, Navigation, or Portal ownership.

## Decisions

- Use a layered DOM composition with one generated local environment plate.
- Keep WebGL, canvas, video playback, and model loading out of this task.
- Store finalized assets under `public/assets/aetheranime/`.
- Resolve asset paths through one static semantic manifest.
- Add a presentation-only `WorldEnvironment` widget to the existing World presence layer.
- Preserve WorldClimate and RegionClimate as overlays above the environment.
- Keep all interactive content in the existing WorldShell composition.

## Asset convention

The public tree will reserve:

- `worlds/aetheranime/environment`
- `worlds/aetheranime/landmarks`
- `worlds/aetheranime/regions`
- `worlds/aetheranime/props`
- `worlds/aetheranime/atmosphere`
- `worlds/aetheranime/portal`
- `worlds/aetheranime/video`
- `ui/emblems`, `ui/icons`, `ui/effects`
- `audio/ambience`, `audio/interaction`, `audio/portal`, `audio/arrival`
- `textures/stone`, `textures/terrain`, `textures/architecture`, `textures/environment`

Directories without production files need not contain runtime placeholders. The manifest may reserve optional future slots, but must not reference missing assets.

## Manifest

Create a small typed constant exposing semantic local paths for:

- AetherAnime hero environment image
- optional world emblem
- optional atmosphere image
- optional portal poster/video
- optional GLB landmark/model

Only existing files receive active paths. Optional future assets remain absent rather than broken.

## World composition

`WorldEnvironment` renders presentation-only layers:

1. deep near-black environmental base
2. generated environment plate
3. atmospheric depth veil
4. dimensional cyan/indigo light
5. central world-presence aperture
6. edge vignette for text readability
7. restrained foreground haze

The widget is absolute, pointer-events disabled, aria-hidden, and contains no registry lookup or state. WorldScene composes it before WorldClimate and RegionClimate so existing atmosphere remains authoritative for runtime mood.

## Asset direction

Generate one wide cinematic environment plate:

- mysterious ancient-technological anime world
- deep navy void architecture and distant monumental structures
- central dimensional cyan light
- restrained violet/indigo accents
- open central negative space for identity and regions
- no text, people, logos, dashboard UI, cards, or dominant portal object

Target output is WebP or AVIF at a production-conscious wide resolution. The image is a shipped local asset; generation tooling is offline and never enters the application runtime.

## Accessibility and motion

- Environment is decorative and hidden from assistive technology.
- No DOM focus or interaction changes.
- No new continuous animations.
- Reduced motion keeps the full static environment.
- Existing identity, region controls, focus rings, and activity links remain unchanged.

## Performance

- One optimized critical background image.
- No canvas, WebGL, video playback, observers, polling, timers, or per-frame React state.
- CSS gradients and opacity layers provide depth.
- Future video and GLB support is represented only by asset conventions until real optimized assets exist.

## Verification

- Inspect `/world/aetheranime` before and after where browser tooling is available.
- Check desktop and narrow viewport hierarchy.
- Check no-text-overload, focus visibility, reduced motion, and no layout shift.
- Run `tsc --noEmit`, scoped ESLint, and one Next build.

## Non-goals

- Portal redesign
- Region card redesign
- Three.js scene
- video background
- runtime AI generation
- remote asset service or CMS
- World/Region/Focus/Navigation ownership changes
