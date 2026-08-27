# Routing

Next.js App Router. Two pages, three API routes.

## Pages

| Route | File | Renders |
|---|---|---|
| `/` | `app/page.tsx` | `ExperienceLayout` → `ArrivalScene` |
| `/world/[destination]` | `app/world/[destination]/page.tsx` | `ExperienceLayout` → `WorldSceneNavigation` |

The world page is an async server component. It awaits `params` and `searchParams`, then resolves everything the scene needs **before** the scene mounts:

```
destination → toWorldSlug()        → slug
slug        → getWorldBySlug()     → world | undefined
world       → resolveWorldShellStatus() → status
anime query → resolveInitialAnimeArrival() → initialAnimeSlug
region query→ resolveInitialRegionFocus()  → initialRegionId   (skipped when an anime arrived)
```

Unknown slugs fall back to `'unknown'` and are handled by shell status rather than a 404.

## Query parameters

`?region=` and `?anime=` are the only recognised parameters.

- Mutually exclusive **on write**.
- On **read**, a valid anime arrival wins: if `initialAnimeSlug` resolves, the region query is not evaluated.
- Both are validated on the server before reaching the client. The scene trusts props, never raw params.

## Who may write the URL

Only `shared/lib/navigation`, through pure helpers plus a client adapter:

| Helper | Purpose |
|---|---|
| `toWorldSlug(destination)` | destination name → canonical slug |
| `worldHref({ worldSlug, regionId?, animeSlug? })` | canonical href construction |
| `worldHrefFromActivation(worldSlug, intent)` | validated region activation → href |
| `worldHrefFromAnimeArrival(worldSlug, animeSlug)` | validated arrival → href |
| `matchesWorldHref(...)` / `matchesCurrentWorldHref(href)` | avoid redundant navigation |
| `resolveWorldNavigationTarget(...)` | resolves the navigation target |

`WorldScene` itself never touches the router. `WorldSceneNavigation` is the adapter that commits.

## Arrival hand-off

Same-route `?region=` / `?anime=` changes, and browser Back/Forward, update props without remounting the scene. `WorldScene` applies them through dedicated hand-off effects that compare against `lastArrivalRef` / `lastAnimeArrivalRef`, so transient in-scene focus changes never re-trigger a navigation hand-off and never write back to the URL.

## Home → world

`ArrivalScene` runs the ceremony (`idle → accepting → crossing → settling → complete`) and only on `onComplete` pushes `worldHref('AetherAnime')`. The transition is a consequence of the finished ceremony, never fired during crossing, and guarded by a ref so it happens once.

## Related

[[system]] · [[network]] · [[data-flow]] · [[TASK-052]]
