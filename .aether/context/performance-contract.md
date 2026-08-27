# Performance Contract

## Targets

| Viewport (CSS px) | Surface | Target |
|---|---|---|
| 390 | idle | ≈60 FPS |
| 820 | idle | ≈60 FPS |
| 1440 | idle | ≈60 FPS |
| 1920 | idle | ≈60 FPS |
| any required viewport | world arrival | ≥55 FPS |

**Currently verified:** World idle ≈59.9 FPS at all four required viewports (TASK-055 QA, production build, Chromium).

## Measurement rules

- **A production build is authoritative.** `npm run build` then `npm run start`. Dev-server numbers are not evidence.
- Production Chromium is the reference browser for visual/compositor claims.
- A performance claim without a measurement is a fabrication. If you did not measure it, say you did not measure it.
- Measure before and after. An isolation matrix (current / layer removed) is how causes get identified, not inspection.
- Screenshots do not prove motion behaviour. Subtle presence motion must be judged live.

## Protected compositor architecture — TASK-046

At 1920 CSS px, two full-viewport opacity animations compositing over the landscape stack dropped idle below 60 FPS. Static plates at 1920 already ran at 60. The resolution, which is **frozen**:

1. **`WorldClimate` drift is frozen at ≥120rem on the idle surface.** Gate: `WORLD_CLIMATE_LARGE_IDLE_SURFACE_MEDIA = '(min-width: 120rem)'` in `widgets/world-climate/world-climate.constants.ts`, consumed via `worldClimateAllowsDrift`.
2. **The living light box is inset at ≥120rem** — `inset: 18% 16%` in `widgets/world-environment/world-living-presence.css` — so the 19.2s breath runs on the dimensional core instead of the full 2.07 Mpx frame.

Net effect: on the large idle surface, **the living light is the only continuous breath**. Adding a second one reopens the regression. See [[TASK-046]].

## Rules

- No new full-viewport continuously animated layer. Ever, without measurement and a decision record.
- No duplicate atmosphere system.
- No large continuously animated opacity surface without measurement.
- No `will-change` beyond what already exists. The only sanctioned hint is `will-change-[opacity]` on `world-environment-light`. Do not add compositor hints to plates or containers.
- No heavy blur introduced casually. Blur is a measured cost; reuse existing blur tokens.
- No redundant climate/environment layer. Extend the layer that already owns the job.
- No continuous plate animation for visual activity. Depth plates stay still; pointer parallax perturbs them, on fine pointers only.
- Presence motion is opacity and sub-2% translate on small, inset boxes — never on the 1536px artwork plates.

## Surface behaviour differs by design

| Surface | Continuous motion | Notes |
|---|---|---|
| **HOME** | portal + entrance ceremony; `AtmosphereLayer` reuses `WorldEnvironment` and deliberately **omits `WorldClimate`** | one-shot ceremony dominates; not a steady-state idle |
| **WORLD IDLE** | living light breath (irregular, 19.2s) + a small inset horizon mist (24s, 32s ≤639px) | the only surface with presence motion; climate frozen ≥120rem |
| **DESTINATION** | poster-derived atmosphere and climate transitions, driven by state changes | idle presence CSS is gated **off** via `:not([data-world-anime])` |
| **ARRIVAL / crossing** | crossing transition; `data-living='false'` pauses presence loops | ≥55 FPS target, transient |

## Reduced motion

`prefers-reduced-motion: reduce` disables the living light animation, the idle mist animation, and all pointer parallax transforms. Structure and content stay; only travel is removed. Reduced motion is part of the contract, not an afterthought — a new animation without a reduced-motion branch is incomplete.

## Related

[[rendering]] · [[visual-language]] · [[performance]] · [[TASK-046]] · [[TASK-055]] · [[performance-task]]
