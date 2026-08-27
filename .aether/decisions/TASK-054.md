# TASK-054 — Crossings are spatial, not equal UI plates

Status: FROZEN
Area: world idle surface / region crossings

## Decision

**World continuum** and **Thresholds ahead** are *spatial crossings at different distances*, not two equal UI plates. The current crossing is near and grounded; the one ahead sits farther along a quiet ground seam.

## Why

[[TASK-053]] made regions travel as a path, but they still read as two interchangeable controls side by side. Distance — not decoration — is what makes them read as places. An early iteration used architectural frames; they read as L-shaped UI chrome, so the final treatment expresses distance through position, scale, ground contact, and light instead.

## Protected behaviour

- `widgets/world-kind/world-kind.landmarks.css` is a dedicated idle stylesheet, imported by `world-kind.tsx` and gated by the `data-kind-landmarks` attribute, which is only present when regions are not receding.
- `data-region-order='0'` is near and grounded; `data-region-order='1'` recedes — smaller max-width, offset, lower opacity, positioned along the ground seam.
- The seam and glow are pseudo-elements. `world-kind-landmark-jamb` replaces the previous inset edge treatment on idle.
- **No `@keyframes` in this stylesheet.** No minimap, reticle, or coordinate readout.
- Arrival recede is excluded: destination composition is untouched.
- The [[TASK-050]] focus recipe and the [[TASK-053]] `flex-row` path contract are re-asserted here.

Contract test: `world-kind.landmarks.test.ts`.

## Implementation area

`widgets/world-kind/` — `world-kind.tsx`, `world-kind.constants.ts`, `world-kind.landmarks.css`

## Contracts

Performance: this treatment is entirely static — no animation was added, so it carries no compositor cost. Accessibility: region controls keep their focus ring and remain keyboard-reachable.

## Do not undo

- Do not give the two crossings equal weight, size, or position again.
- Do not add keyframes to `world-kind.landmarks.css`.
- Do not reintroduce framing chrome around crossings; frames read as UI.
- Do not add HUD affordances (minimap, reticle, coordinates).
- Do not let idle landmark rules leak into the arrival/recede state.

## Links

[[TASK-053]] · [[visual-language]] · [[rendering]] · [[TASK-055]]
