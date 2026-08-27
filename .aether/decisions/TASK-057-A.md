# TASK-057-A — World Memory records places, observed at `arrivedAnime`

Status: FROZEN
Area: world / arrival · client-local persistence

## Decision

World Memory is a standalone client-local domain (`shared/anime/anime.memory.ts`, key `aetheranime.memory.v1`) that records **where the traveller has actually been**. It is written by a single passive recorder effect in `WorldScene` keyed on `arrivedAnime` — not on `onAnimeArrive`.

Memory holds identities and recency, never visit events: re-arrival updates `lastArrivedAt` on the existing record.

## Why

TASK-057-DESIGN claimed `onAnimeArrive` was the authoritative arrival boundary. It is not. `onAnimeArrive` fires only from `arriveAnime()`; the URL / Back / Forward / discovered hand-off never calls it, and the first-load catalog path commits arrival inside the `useState` initializer with no callback and no effect (the hand-off effect early-returns because `lastAnimeArrivalRef` is already seeded). Wiring memory to `onAnimeArrive` would have silently missed every shared link and every Back/Forward return.

`arrivedAnime` is where all three mechanisms converge, so one observer covers them all — verified in a production build: Navigator arrival, real Back and Forward, direct `?anime=` catalog load, and discovered hydration each produced exactly one record per identity, with `localStorage` holding only `aetheranime.memory.v1`.

## Protected behaviour

- **One write site.** The recorder effect in `world-scene.tsx` — `if (!arrivedAnime) return; rememberArrival(arrivedAnime)`, dependency `[arrivedAnime]`. Guarded by `widgets/world-scene/world-memory-arrival.test.ts`, which also asserts `arriveAnime` and `handoffAnimeArrival` contain no memory write.
- **Storage shape.** Only `{ animeId, slug, lastArrivedAt, title? }`. A contract test rejects every other `CanonicalAnime` field by name.
- **Domain ownership.** Deduplication by `animeId`, newest-first ordering with `animeId` as tie-breaker, 60-record cap. Consumers must not re-sort or re-deduplicate.
- **Zero-import domain.** `anime.memory.ts` has no imports at all, and is deliberately absent from the `shared/anime` barrel.
- **Separation from Watchlist.** Distinct key, event, module, and semantics. Saving is not visiting; visiting is remembered regardless of Watchlist state.

## Implementation area

`apps/web/shared/anime/anime.memory.ts` · `apps/web/shared/anime/anime.memory.test.ts` · `apps/web/widgets/world-scene/world-scene.tsx` (recorder effect only) · `apps/web/widgets/world-scene/world-memory-arrival.test.ts`

## Contracts

- Zero new network requests; memory reads the `CanonicalAnime` already present at arrival. Verified live: API request counts unchanged on Home, World idle, and each arrival.
- No compositor impact — no CSS, DOM, animation, timer, polling, or full-screen surface. TASK-046 and TASK-055 untouched.
- Storage is untrusted input: malformed JSON and malformed records degrade to empty memory and heal on the next write. Storage failure never throws into the application.
- SSR-safe: no `window` or `localStorage` access during server render.

## Do not undo

- Do not move the write to `onAnimeArrive`, `WorldSceneNavigation`, `AnimeDestination`, Navigator, or Kinship. Each covers a subset of arrivals; the first two miss first-load links, the last three couple memory to presentation.
- Do not add a second memory write site "for discovered titles" — hydration already converges on `arrivedAnime`.
- Do not merge Memory into Watchlist storage, or add memory state to `WorldScene`.
- Do not persist `CanonicalAnime`, poster, or any presentation state to make future rendering easier; `title` is the only presentation field allowed.
- Do not remove the `animeId` tie-breaker — ordering becomes non-deterministic when timestamps collide.

## Links

[[data-flow]] · [[system]] · [[engineering-rules]] · [[open-questions]] · [[current-state]]

## Not started

The Memory Horizon visual layer (TASK-057-B). This task added no UI, no CSS, and no visual change.
