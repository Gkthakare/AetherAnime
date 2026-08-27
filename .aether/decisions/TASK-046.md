# TASK-046 — 1920 idle compositor budget

Status: FROZEN
Area: rendering / world environment / world climate

## Decision

At 1920 CSS px and above on the idle surface, **the living light is the only continuous breath**. `WorldClimate` drift is frozen at that width, and the living-light box is inset so the 19.2s opacity loop runs on the dimensional core rather than the whole frame.

## Why

Measured isolation on 1920 idle showed two full-viewport opacity animations — `WorldClimate` drift and the living light — compositing over the landscape image stack, dropping idle below 60 FPS. Static plates at 1920 already held 60 FPS, so the artwork was never the problem. Freezing one loop and shrinking the other was the smallest change that recovered frames while keeping the world alive.

## Protected behaviour

- `WORLD_CLIMATE_LARGE_IDLE_SURFACE_MEDIA = '(min-width: 120rem)'` in `widgets/world-climate/world-climate.constants.ts`, consumed by `worldClimateAllowsDrift` and observed by the `WorldClimate` view via a `largeIdleSurface` media match.
- `@media (min-width: 120rem) { [data-slot='world-environment'] .aether-living-light { inset: 18% 16%; } }` in `widgets/world-environment/world-living-presence.css`.
- `animation: aether-living-light 19.2s ease-in-out infinite`, applied only when `data-living='true'`.

Guarded by contract tests in `world-living-presence.test.ts`, `world-layout.place.test.ts`, `atmosphere-entrance.test.ts`, and `world-idle-presence.test.ts` — four files assert this budget, which is a measure of how load-bearing it is.

## Implementation area

`widgets/world-climate/` · `widgets/world-environment/world-living-presence.{ts,css}`

## Contracts

Performance: ≈60 FPS idle at 390 / 820 / 1440 / 1920; ≥55 FPS arrival. Production Chromium is authoritative. See [[performance-contract]].

## Do not undo

- Do not add a second continuously animated full-viewport surface on the idle surface.
- Do not remove or widen the `120rem` gates.
- Do not restore the living-light box to `inset: 0` at large widths.
- Do not re-enable climate drift on large idle.
- Do not "improve" this by adding `will-change` — that was not the fix and is not free.
- New presence effects must reuse an existing animated layer, as [[TASK-055]] did.

## Links

[[performance-contract]] · [[rendering]] · [[TASK-055]] · [[performance]] · [[current-state]]
