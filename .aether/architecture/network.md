# Network

## Rule

**All third-party access is server-only.** The client calls the app's own routes under `app/api/`; it never talks to MAL or an LLM endpoint directly, and no provider credential ever reaches the browser.

## Routes

| Route | Method | Input | Returns |
|---|---|---|---|
| `/api/anime-discovery` | GET | `?id=` \| `?similar=` \| `?q=` | `{ anime }` for `id`, otherwise `{ candidates }` |
| `/api/anime-metadata/[slug]` | GET | resolved destination slug | `{ metadata }` |
| `/api/anime-intent` | POST | `{ text }` | `{ intent }` |

Behaviour worth knowing:

- `?q=` requires **≥3 characters**; shorter queries return `{ candidates: [] }` without calling MAL.
- `?similar=` resolves the slug against the catalog first and returns `[]` for a miss.
- `?id=` accepts a raw MAL id or the `discovered-<id>` form, and returns `{ anime: null }` rather than an error when unresolvable.
- `/api/anime-metadata/[slug]` enriches an **already-resolved** slug. It does not search and does not resolve navigation.
- `/api/anime-intent` returns structured data. It never returns navigation, and it returns `{ intent: null }` on malformed input rather than throwing.

## Providers

| Adapter | File | Notes |
|---|---|---|
| MAL discovery | `shared/anime/anime.mal.discovery.ts` | `searchByTitle`, `getSimilarByCanonicalAnime`, `getByMalId` |
| MAL metadata | `shared/anime/anime.mal.provider.ts` | `getByCanonicalAnime` |
| MAL parsing | `anime.mal.parse.ts`, `anime.mal.normalize.ts` | tolerant parsing into `CanonicalAnime` shapes |
| Semantic intent | `anime.semantic-intent.ts` (`createHttpSemanticIntentProvider`) | structured intent only |

Similar titles are read from `fields=recommendations` on the MAL anime details resource, because `/anime/{id}/recommendations` returns 404 with a client ID.

## Client request helpers

`anime.discovery-request.ts` — `requestAnimeDiscovery`, `requestDiscoveredAnime`. `anime.semantic-request.ts` — `requestSemanticIntent`. All accept an `AbortSignal`; callers abort on re-entry and unmount.

## Environment

`MAL_CLIENT_ID` · `SEMANTIC_INTENT_API_KEY` · `SEMANTIC_INTENT_BASE_URL` · `SEMANTIC_INTENT_MODEL`

All read server-side with `?? ''` fallbacks, so a missing key degrades to empty results instead of crashing. See `apps/web/.env.example`.

## Request budget

- Arrival: metadata only.
- Opening Story or Signals: zero requests.
- Opening Kinship: at most one `similar` request per mounted destination.
- No prefetch on arrival. No polling. No background refresh.

Adding a request to a user-visible interaction is a decision, not an implementation detail.

## Related

[[data-flow]] · [[routing]] · [[engineering-rules]]
