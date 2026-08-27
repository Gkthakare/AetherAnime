# TASK-061 — Continue From This Place

Status: FROZEN (implementation complete)
Area: World Idle ↔ Destination · journey resume

## Decision

**Continue** resumes the journey by explicitly re-entering the most recently arrived destination. V1 derives the candidate from Memory newest (`recentMemories(1)[0]` via a referentially stable Navigator snapshot). No new persistence key. No Memory schema change. Singular Navigator path-item on Idle only; activation reuses `arriveAnime` / discovered hydrate / `?anime=`. Never auto-arrives. Hidden when empty, unresolvable, or already at that destination.

## Why

Only Memory and Watchlist persist. Idle Continuum/Thresholds coordinates are not restorable without inventing state. The last **place** Memory already records is what Continue restores — as Destination arrival, not as Continue Watching or a history list.

## Protected behaviour

- Candidate: `readNewestMemorySnapshot()` → `resolveContinueCandidate` — never invent `aetheranime.continue.v1` for V1.
- Presentation: `data-slot="world-navigator-continue"` under WorldNavigator; copy `Continue to {title}` / `Return to this place`.
- Activation: catalog → `arriveReturnedAnime`; discovered → `requestDiscoveredAnime` then arrive. No duplicate arrival path.
- `useSyncExternalStore` snapshot must stay referentially stable (`memoryEntryEquals` cache) — unstable object snapshots crash production React.
- Horizon stays non-interactive; Watchlist / Current / Ahead / Home untouched.
- Contract: `widgets/world-navigator/world-navigator.continue.test.ts`.

## Implementation area

`apps/web/widgets/world-navigator/world-navigator.continue.ts` · `world-navigator.tsx` · continue contract tests. Memory read via `anime.memory`. Arrival remains WorldScene.

## Contracts

Performance: no continuous Continue animation; Idle/Destination ≈60 FPS at 390 / 820 / 1440 / 1920 (production Chromium QA). Network: 0 new endpoints; discovered hydrate only on explicit activation. Accessibility: real button, accessible name, focus-visible via existing path-item ring. SSR: server snapshot is `null`.

## Do not undo

- Do not auto-arrive from Continue, Memory, or Horizon.
- Do not make Horizon interactive or merge Continue into Watchlist.
- Do not add a third crossing or Home Continue surface.
- Do not return a fresh Memory object from `getSnapshot` on every call.
- Do not invent physical world-position persistence to satisfy Continue.

## Links

[[TASK-057-A]] · [[TASK-057-B]] · [[TASK-053]] · [[TASK-054]] · [[TASK-060]] · [[data-flow]] · [[vision]] · [[open-questions]] · [[current-state]]
