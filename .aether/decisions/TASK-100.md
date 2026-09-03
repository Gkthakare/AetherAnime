# TASK-100 — Universe Continuity

Status: FROZEN (implementation complete)
Area: Destination ↔ Universe Network ↔ Continuum · ephemeral journey origin

## Decision

**In-scene A→B hops keep an ephemeral `journeyOrigin` on WorldScene so Beyond can show a residual spatial “From” trace.** Continuity is destination-local composition plus existing `arriveAnime` travel — not Memory persistence, not a journey graph, not a breadcrumb UI.

## Why

TASK-099 made neighbor travel work, but remounting B/C erased all evidence of A. Memory records places (not visits) and Horizon is idle-only, so neither can express the immediate previous world mid-journey without inventing progression. Scene-local origin closes the gap inside frozen architecture.

## Protected behaviour

- `journeyOrigin` set in `beginAnimeTransport` from the previous `arrivedAnime` (null on Continuum/first hop)
- Cleared on `clearAnimeArrival`, region activation that clears anime, and URL/nav hand-off
- Beyond residual: `data-slot="anime-universe-journey-trace"`; return uses `arriveAnime(journeyOrigin)`
- No `sessionStorage` / `aetheranime.journey` / graph store
- Contract tests: `anime-destination.continuity.test.ts`

## Implementation area

`world-scene.tsx` · `world-scene.types.ts` · `anime-destination.tsx` · `anime-destination-network.tsx` · `anime-destination.universe.css` · `anime-destination.constants.ts`

## Contracts

Keyboard/pointer/touch share residual focus with neighbor prominence. Reduced motion preserves origin, selection, and destination change. Production Chromium FPS was not re-measured this close (CSS opacity transitions only; no continuous compositor). Memory semantics unchanged.

## Do not undo

- Do not promote journeyOrigin to persistence or Memory
- Do not turn the residual into a breadcrumb, history list, or previous-anime card
- Do not bypass `arriveAnime` for origin return
- Do not invent a universe graph or traveller coordinates

## Links

[[TASK-099]] · [[TASK-098]] · [[TASK-096]] · [[TASK-092]] · [[TASK-057-A]] · [[TASK-066]]
