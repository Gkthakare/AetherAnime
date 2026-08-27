# TASK-057-B — Memory Horizon (upper-trailing residual)

Status: FROZEN
Area: world idle / World Memory presentation

## Decision

World Idle paints a **Memory Horizon**: sparse residual afterglows in the upper-trailing atmospheric register, derived read-only from `recentMemories`. Empty Memory paints nothing. Marks are non-interactive, Idle-gated, and subordinate to TASK-058-E geography.

## Why

Travellers need to feel the world remembers their journey without a history UI. Geographic far (058-E) owns the lower horizon; Memory must stay residual and above it.

## Protected behaviour

- Widget: `widgets/world-memory-horizon/` mounted in `world-scene-atmosphere` **after** `WorldClimate` (`z-[2]`).
- Gate: CSS `[data-slot='world-scene']:not([data-world-anime])`; Home never mounts; Destination hides.
- Caps: desktop ≤5 (hard max 8); portrait CSS hides `data-memory-index` ≥4.
- Data: `recentMemories` + `subscribeMemory` only — no `rememberArrival`, no new fields.
- Visual: soft radial afterglows, desaturated indigo/blue-white — no cyan primary, no Kinship spine/branches, no labels.
- Motion: static only (no drift animation). Reduced motion keeps marks; `animation: none`.
- Contract tests: `world-memory-horizon.test.ts`.

## Implementation area

`apps/web/widgets/world-memory-horizon/*` · `apps/web/widgets/world-scene/world-scene.tsx` (mount only)

## Contracts

Idle FPS ≈60 measured at 390/820/1440/1920. Network: 0 new requests. Assets: 0 new. TASK-058-E geography CSS untouched.

## Do not undo

- Do not move marks onto the geographic far horizon or Current/Ahead seam.
- Do not add click/focus/navigation from marks.
- Do not reuse Kinship constellation primitives.
- Do not require new artwork or Memory schema fields for V1.

## Links

[[TASK-057-A]] · [[TASK-058-E]] · [[TASK-054]] · [[TASK-055]] · [[TASK-046]] · [[visual-language]] · [[current-state]]
