# Rendering

The environment stack is the most performance-sensitive and most frequently misunderstood part of the codebase. Read this before any visual or performance task.

## [[WorldEnvironment]]

`widgets/world-environment/world-environment.tsx`. Decorative, presentation-only, `aria-hidden`, `pointer-events-none`. A **2.5D composition**, not a rendered scene: no WebGL, no canvas, no 3D geometry, no particles.

Back to front:

| Layer | `data-slot` | Notes |
|---|---|---|
| base | `world-environment-base` | scene colour, always painted |
| distance plate | `world-environment-image` | the orientation artwork, landscape + portrait sources, `priority` |
| midground | `world-environment-midground-architecture` | its own alpha artwork, landscape only |
| depth veil | `world-environment-depth` | aerial perspective over the midground |
| dimensional light | `world-environment-light` (`.aether-living-light`) | the cyan glow the world is lit by; **the only sanctioned `will-change-[opacity]`** |
| ask light | `world-environment-ask` | brightens on `:focus-within` |
| destination climate | `world-environment-destination-atmosphere` | one node per `WORLD_CLIMATES` token, opacity-switched |
| catalog wash | `AnimeArrivalAtmosphere` | poster-derived atmosphere, only when `arrivedAnime.poster` exists |
| foreground | `world-environment-foreground-architecture` | near framing alpha artwork, landscape only |
| identity climate | `world-environment-identity-atmosphere` | destination acknowledgement around the title |
| identity veil | `world-environment-identity-veil` | readability backing under the world title |
| vignette | `world-environment-vignette` | frame falloff |
| haze | `world-environment-foreground` (`.aether-living-haze`) | atmospheric close-out |

Wrapped by `EnvironmentCrossingFrame` (crossing treatment) and `EnvironmentDepth` (pointer depth variables `--depth-x` / `--depth-y`).

Key facts that are easy to get wrong:

- Midground and foreground are **separate artworks**, not the plate repeated. A duplicated plate reads as a blurred double, never as distance.
- Only the three image layers move under pointer parallax, by different amounts, and only for a fine pointer.
- Destination atmosphere and identity climate are **presentation props**, derived by `worldArrivalAtmosphere({ arrivedAnime, regionClimate })` in the scene. `WorldEnvironment` paints tokens; it knows nothing about focus, registry, or URL.

## [[LivingPresence]]

`world-living-presence.ts` decides whether the world breathes; the result drives `data-living` on the environment root. `world-living-presence.css` holds the rules:

- `@keyframes aether-living-light` — 0.72 → 1 → 0.72 opacity, `19.2s ease-in-out infinite`, applied only when `data-living='true'`.
- `@media (min-width: 120rem)` insets the light box to `18% 16%` — the [[TASK-046]] compositor freeze.
- `:focus-within` raises `world-environment-ask` to 0.55 (0.28 under reduced motion).
- Reduced motion sets `animation: none !important` on the living light.

Depth plates stay still so 1536px artwork is not re-composited every frame. Presence is paused (`data-living='false'`) during arrival and crossing.

## World idle presence

`world-idle-presence.css` ([[TASK-055]]) — everything in it is scoped to `[data-slot='world-scene']:not([data-world-anime])`, so Home and Destination are excluded by construction. It contains exactly three moves, all built on layers that already existed:

1. a local horizon mist as a `::before` on the existing `.aether-living-haze` box — `aether-idle-atmosphere`, 24s (32s ≤639px), opacity 0.16–0.34 with sub-1.5% translate
2. `aether-idle-light` — an irregular five-stop breath replacing the sine curve **on the same 19.2s living-light layer**, not an added layer
3. stronger aerial separation on `world-environment-depth` plus slightly larger pointer parallax offsets on the three image plates

No new full-viewport surface, no compositor hints, no plate animation, no keyframes on plates. Reduced motion kills the two animations and all three transforms.

## [[WorldClimate]] and RegionClimate

`WorldClimate` is scene-wide, sits beside `WorldEnvironment` in the atmosphere container, and drifts based on ambient. `worldClimateAllowsDrift(...)` gates it, and at `WORLD_CLIMATE_LARGE_IDLE_SURFACE_MEDIA` (`min-width: 120rem`) idle drift is **frozen** so living light stays the only breath ([[TASK-046]]).

`RegionClimate` occupies the shell's presence slot: subordinate to `WorldClimate` and scoped to the stage, never scene-wide.

## Home atmosphere

`widgets/atmosphere-layer/` reuses `WorldEnvironment` and deliberately does **not** mount `WorldClimate` ([[TASK-052]]). `atmosphere-layer.css` only composes the existing environment as a threshold — keep the portal luminous, ground the traveller, let the gate notice attention. Its contract test asserts the absence of `WorldClimate`.

## World idle crossings

`widgets/world-kind/` renders region crossings. `world-kind.landmarks.css` ([[TASK-054]]) makes idle regions occupy space — current is near and grounded, ahead sits farther along a quiet ground seam — with **no keyframes**, no portal copies, no HUD graph. `world-place.css` ([[TASK-053]]) relocates the identity veil into a small location marker for idle while destination keeps the existing veil.

## Motion primitives

`shared/lib/motion` — `DURATION`, `EASING`, `STAGGER`, presets, variants, transitions, and the shared identity enter motion (`identity.ts`, [[TASK-049]]). `shared/lib/graphics` — blur, elevation, legibility tokens. Use these; do not re-derive values in a widget.

## Related

[[performance-contract]] · [[visual-language]] · [[system]] · [[animation]] · [[TASK-046]] · [[TASK-052]] · [[TASK-054]] · [[TASK-055]]
