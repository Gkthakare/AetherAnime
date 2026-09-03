# TASK-096 — Capital Experience: Anime Universe destination

Status: FROZEN (implementation complete)
Area: Destination / arrival presentation · WorldRealmCrossing warp · long-form universe scroll

## Decision

**Arrived anime is a scrollable universe, not an identity-column details page.** Selection still uses TASK-092 `DEPART→TRANSIT→URL→ARRIVE`; the crossing presentation is a one-shot DOM/CSS black-hole warp (`DURATION.WARP` 2.4s). Destination occupies the World canvas with environmental artwork, cinematic type, and data-backed sections that degrade when facts are absent.

## Why

TASK-095 left Destination as a catalog column. The cyan oval ring read as a green line, not travel. Capital Experience requires World → warp → anime universe → continue, without a second transport or fabricated lore.

## Protected behaviour

- Transport owner remains `runWorldAnimeTransport` / Scene Director; no `DestinationTransitionSystem`
- Selection remains `arriveAnime`; Watch Now / Watchlist / kinship paths unchanged
- Warp is decorative (`aria-hidden`), one-shot `forwards`, default `opacity: 0`
- Reduced motion: `aether-warp-reduced` opacity only; destination content still mounts
- Artwork remains `CanonicalAnime.poster` only (TASK-073–076)
- No analytics events, persistence, WebGL/Canvas/R3F, or scroll hijack
- Contract tests: `anime-destination.universe.test.ts`, `world-realm-crossing.test.ts`

## Implementation area

`world-realm-crossing.*` · `anime-destination.tsx` + `anime-destination.universe.*` · `world-scene.tsx` · `world-layout.constants.ts` · `world.transport.ts` (`WORLD_TRANSPORT_CINEMATIC_S = DURATION.WARP`)

## Contracts

Keyboard, focus-visible, and native document scroll remain authoritative. Warp layers must not remain visible after the ceremony (default opacity 0). Living light remains the only Idle continuous breath (TASK-046). FPS not re-measured this task.

## Do not undo

- Do not restore the cyan `border-ring` oval as the primary crossing
- Do not mount Destination back into the identity column
- Do not invent characters, episodes, or artwork
- Do not add a second navigation/transport owner

## Links

[[TASK-095]] · [[TASK-092]] · [[TASK-075]] · [[TASK-046]] · [[visual-language]] · [[performance-contract]]
