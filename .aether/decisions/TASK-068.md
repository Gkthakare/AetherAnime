# TASK-068 — Destination arrival vs settled performance audit

Status: FROZEN
Area: Destination arrival lifecycle · RealmCrossing · performance

## Decision

**No action required.** The TASK-067 Destination ≈52–53 FPS samples were taken inside the **arrival window**, not settled Destination. Settled Destination recovers to ≈61 FPS at 390 / 820 / 1440 / 1920. The dip is a bounded ~1.2s one-shot cost from concurrent RealmCrossing ceremony + poster wash enter + Destination mount (and a short metadata update). Lifecycle remains architecturally clean. Do not redesign Destination or the ceremony for this spike.

## Why

Production Chromium timeline (exact catalog Solo Leveling): Idle ≈61 → arrival 0–500ms can drop to ~29–51 → recovers through 1–2s → settled 2–4s ≈61 (longest frame ≈17ms). Direct `?anime=` after load and Continue paths also settle ≈61. Reduced motion softens spatial ceremony (arrival ≈53, settled ≈61). Root cause is intentional cinematic concurrency (`EnvironmentCrossingFrame` scales the depth stack; veil/aperture/gate/ring; poster wash `filter:blur` + `mix-blend` + mask; `AnimeDestination` remount by slug), not a leaked continuous breath, Idle geography, Memory Horizon, or permanent `will-change` on plates. Living light correctly `data-living=false` on arrival. Far / mid-continuation opacity 0. Horizon hidden.

## Protected behaviour

- Distinguish **arrival window** (~`DURATION.CINEMATIC` 1.2s) from **settled Destination** in all FPS claims.
- RealmCrossing remains one-shot CSS (`forwards` → opacity 0); mounts while `arrivedAnime` exists; not a second continuous breath ([[TASK-046]]).
- Do not remove poster wash blur/mask or RealmCrossing solely for arrival-window FPS.
- Do not invent Destination performance caches or session state.
- Settled Destination must remain ≈60; arrival remains a transient ceremony ([[performance-contract]]).

## Implementation area

None (audit only). Evidence: `%TEMP%/aether-068-qa/report.json` + settled screenshots.

## Contracts

- Unit suite 463; `tsc` 0; ESLint 0; `next build` 0 (verification run with this task).
- Settled Destination ≈61 FPS all four viewports. Arrival-window dips are one-shot, not sustained Destination performance.
- Network: single `/api/anime-metadata/<slug>` per arrival (~5ms). No new endpoints.
- A11y: environment / crossing `aria-hidden` + `pointer-events: none`; Destination controls remain focusable.

## Do not undo

- Do not report Destination FPS from samples taken during RealmCrossing / wash enter without labeling them as arrival-window.
- Do not “fix” the spike by deleting the frozen ceremony or TASK-060 wash.
- Do not add continuous Destination animation or a second compositor architecture.

## Links

[[performance-contract]] · [[TASK-046]] · [[TASK-060]] · [[TASK-067]] · [[TASK-055]] · [[rendering]] · [[current-state]] · [[open-questions]]
