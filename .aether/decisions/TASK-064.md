# TASK-064 — Mobile Idle spatial composition

Status: FROZEN (implementation complete)
Area: World Idle · portrait / narrow geographic readability

## Decision

Strengthen mobile Idle near → middle → far by **responsive crop and vertical-band tuning** of existing TASK-058-E plates on portrait. Landscape mid-continuation stays inert on portrait. No new assets, mist loops, crossings, or compositor surfaces.

## Why

Production probes showed portrait Idle (390 / 820) hides mid-continuation by contract while far/hero/sparse-mid/foreground shared near-identical vertical registers — the stack read as one dark field behind a vertical UI corridor. Desktop retained the full geographic bridge. Mist quieting and pointer depth are intentional; the readable gap was **static band differentiation**, not animation.

## Protected behaviour

- Portrait mid-continuation remains `opacity: 0` / `visibility: hidden`.
- Portrait sparse-mid becomes the middle band (`opacity` ~0.40–0.42, distinct inset/object-position).
- Far overscan + lower `object-position`; foreground anchors nearer; hero veil opens downward.
- Landscape Idle rules unchanged (desktop probes unchanged).
- No `@keyframes`, `will-change`, or presence mist opacity hikes as the primary fix.
- Contracts: `world-idle-geography.test.ts` TASK-064 suite.

## Implementation area

`widgets/world-environment/world-idle-geography.css` (+ geography tests).

## Contracts

Performance: Idle empty / Horizon+Continue ≈60–61 FPS at 390 / 820 / 1440 / 1920 after change. Accessibility: no new controls; reduced motion keeps geographic structure.

## Do not undo

- Do not enable landscape mid-continuation on portrait without a new artwork decision.
- Do not solve mobile depth by enlarging Navigator, Memory Horizon, or crossings.
- Do not add permanent will-change or a second continuous breath.

## Links

[[TASK-053]] · [[TASK-058-E]] · [[TASK-059]] · [[TASK-055]] · [[TASK-046]] · [[visual-language]] · [[performance-contract]] · [[visual-debt]] · [[current-state]]
