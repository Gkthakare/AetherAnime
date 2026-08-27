# Data Flow

## CanonicalAnime

`shared/anime/anime.types.ts` defines the single anime shape used everywhere: scene state, destination presentation, navigator paths, watchlist identity, discovery results. Every provider normalises **into** it; nothing downstream invents fields.

Two origins:

- **catalog** — `anime.catalog.ts` via `anime.repository.ts` (`getAnimeBySlug`, `getAllAnime`)
- **discovered** — a MAL candidate canonicalised by `canonicalizeDiscoveryCandidate`, identified by a `discovered-<malId>` slug (`anime.mal.identity.ts`: `discoveredMalIdFromSlug`, `malIdForSlug`)

## Resolution

`resolveAnime(query, catalog)` — deterministic, local catalog only, no LLM, no silent fuzzy pick. Order: normalize → exact canonical → exact alternate → slug → near-exact token / unique prefix → ambiguous → unknown. `ambiguous` and `unknown` are real outcomes the UI must handle; the resolver never guesses.

Normalisation lives in `anime.normalize.ts` (`normalizeAnimeQuery`, `animeQueryTokens`, `toAnimeSlug`). Voice input is normalised first by `normalizeVoiceQuery`.

## Navigator → arrival

```
typed / spoken query
  → normalizeVoiceQuery (voice only)
  → resolveAnime (local, deterministic)          ─┐
  → requestSemanticIntent → retrieveForStructuredIntent  (structured intent, data only)
  → requestAnimeDiscovery (MAL search)           ─┘
  → candidate paths rendered
  → user confirms a path
  → arriveAnime(CanonicalAnime)   ← the only way a destination is entered
  → WorldSceneNavigation commits ?anime= to the URL
```

**Search and recommendations never auto-arrive.** Intent returns data, never navigation.

## Arrival hydration

`WorldScene.handoffAnimeArrival(slug)`:

1. abort any in-flight hydration
2. catalog hit → set immediately
3. otherwise derive a MAL id from the slug; no id → no arrival
4. `requestDiscoveredAnime(malId, signal)` → set, or clear on failure
5. arriving clears curated focus

## Arrival convergence

`arrivedAnime` is the only complete signal that a destination was entered. Three separate mechanisms set it, and **`onAnimeArrive` fires for one of them**:

| Path | Mechanism | Triggers | `onAnimeArrive` |
|---|---|---|---|
| in-scene | `arriveAnime()` | Navigator confirm, Kinship candidate | yes |
| hand-off | `handoffAnimeArrival()` via the `initialAnimeSlug` effect | same-route `?anime=` change, Back / Forward, discovered first load | no |
| first load | `useState` initializer resolving `initialAnimeSlug` | shared link whose slug is in the catalog | no |

The first-load path has no observation point at all: the initializer seeds `arrivedAnime` *and* `lastAnimeArrivalRef`, so the hand-off effect correctly early-returns and never runs.

Anything that must react to *every* committed arrival therefore observes `arrivedAnime`, never `onAnimeArrive`. `onAnimeArrive` remains the in-scene notification for the page's URL commit and must not be widened. Double writes are already prevented upstream: `arriveAnime` seeds `lastAnimeArrivalRef` before the URL is pushed, so the hand-off effect skips the arrival it just caused.

## World Memory

`anime.memory.ts` — local-first, `localStorage` key `aetheranime.memory.v1`, change event `aetheranime:memory`. Persists `{ animeId, slug, lastArrivedAt, title? }` and nothing else; `CanonicalAnime` never reaches storage. Identity is `animeId`, so re-arrival updates recency instead of appending — memory holds **places, not visits**. The domain owns validation, newest-first ordering (`animeId` breaking ties), and a 60-record cap, so consumers never sort or deduplicate.

Written by a passive recorder effect in `WorldScene` keyed on `arrivedAnime`, which is why all three arrival paths above are covered by one write site. Separate from Watchlist in key, event, semantics, and module: saving is not visiting.

## Metadata overlay

Arrival loads metadata only. `/api/anime-metadata/[slug]` returns an `AnimeMetadata`, applied with `overlayDiscoveredMetadata` (`anime.metadata.ts`). Discovered destinations carry `discoveredDestinationMark`. Metadata enriches presentation; it never changes identity.

## Destination paths

| Path | Data source | Requests |
|---|---|---|
| Story | catalog orientation + already-loaded MAL synopsis (`destinationStoryRecord`) | zero |
| Signals | `buildAnimeSemanticProfile` evidence, no scores (`destinationSignalTags`) | zero |
| Kinship | `requestAnimeDiscovery({ kind: 'similar' })` | at most one per mounted destination, on open |

No prefetch on arrival. No LLM-authored text about a real anime.

## Watch path

`anime.watch-path.ts` owns availability. `isVerifiedWatchUrl` requires `https:`, a hostname, and rejects `myanimelist|anilist|nyaa|1337x|gogoanime|crunchyroll.com/watch`. Statuses are `verified | unavailable | unknown`; Crunchyroll stays `unknown` until an official consumer availability API exists, and **unknown is not unavailable**. MAL does not resolve watch paths. Voice does not resolve watch paths.

## Watchlist

`anime.watchlist.ts` — local-first, `localStorage` key `aetheranime.watchlist.v1`, change event `aetheranime:watchlist`. Persists the minimum stable representation: `{ animeId, slug, savedAt, title? }`. `subscribeWatchlist` covers same-tab and cross-tab writes; consumers read via `useSyncExternalStore`. `watchlist-return.ts` rehydrates saved rows into navigator return paths (`hydratedAnimeMatchesWatchlistRow`).

No server persistence and no user account exist.

## Related

[[network]] · [[system]] · [[engineering-rules]] · [[open-questions]]
