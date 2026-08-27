# TASK-055 — World idle presence from the existing stack

Status: FROZEN
Area: world idle surface / environment presence

## Decision

World idle is **alive** — it has slow atmospheric life, irregular environmental light, and stronger desktop pointer depth. All of it is built from layers that already existed, inside the [[TASK-046]] compositor budget, and gated off Home and Destination.

## Why

The world was composed as a place ([[TASK-053]], [[TASK-054]]) but was completely static while the user stood in it. Presence had to come without a new animation system, a new full-viewport surface, or any of the cost that [[TASK-046]] had just removed.

## Protected behaviour

`widgets/world-environment/world-idle-presence.css`, imported by `world-environment.tsx`. Every rule is scoped to `[data-slot='world-scene']:not([data-world-anime])`, so Home and Destination are excluded by construction. Three moves, no more:

- **A — atmospheric life.** A local horizon mist as a `::before` on the existing `.aether-living-haze` box. `aether-idle-atmosphere`, 24s (32s at ≤639px), opacity 0.16–0.34, sub-1.5% translate. Not a new layer.
- **B — environmental light.** `aether-idle-light` replaces the sine curve with a five-stop irregular breath **on the same 19.2s living-light layer**. No layer added, no cost added.
- **C — depth presence.** A stronger aerial gradient on `world-environment-depth` plus slightly larger pointer parallax offsets on the three image plates.

Explicitly absent and asserted absent: no new full-viewport opacity surface, no `will-change`, no plate animation, no `aether-living-depth` animation, no WebGL/canvas/particles.

Reduced motion clears both animations and all three transforms.

Contract test: `world-idle-presence.test.ts`, which also re-asserts the [[TASK-046]] budget and the [[TASK-054]] crossing ownership.

## Implementation area

`widgets/world-environment/world-idle-presence.css` · `world-environment.tsx` · `world-environment.constants.ts`

## Contracts

Performance: verified **≈59.9 FPS on world idle at 390 / 820 / 1440 / 1920** in a production build. Accessibility: full reduced-motion branch; all affected layers remain `aria-hidden` and `pointer-events-none`.

## Do not undo

- Do not remove the `:not([data-world-anime])` gate — these rules must never reach Home or Destination.
- Do not add a fourth presence effect, and do not add a new animated layer to achieve one; extend an existing layer as B did.
- Do not add `will-change` or animate the depth plates.
- Do not drop the ≤639px slower/quieter mist or the reduced-motion branch.
- Presence is meant to be felt, not watched. Do not increase amplitude or shorten the periods.

## Links

[[TASK-054]] · [[performance-contract]] · [[rendering]] · [[visual-language]] · [[current-state]] · [[TASK-046]]
