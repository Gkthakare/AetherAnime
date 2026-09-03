# TASK-094 — World Discovery Landmark: Continuum

Status: FROZEN (implementation complete)
Area: World Idle · Continuum landmark · Navigator-free discovery

## Decision

**Continuum is a genuine discovery landmark.** When the Continuum region is focused in World Idle, a curated explore activity surfaces up to three real catalog anime. Selecting a candidate calls `WorldScene.arriveAnime` and reuses the TASK-092 transport ceremony. No Navigator, no new route, no network request, no new persistence, no analytics change.

## Product hypothesis

Someone who enters AetherAnime without knowing what they want can discover an anime by exploring the World — specifically by focusing Continuum and selecting a surfaced destination — without typing in Navigator.

## Continuum role

Continuum (`world-continuum`) uses the existing **`explore`** activity token from the region registry. Thresholds remains unchanged. Focus/activation reuse the existing WorldKind + RegionScene model; no global position store.

## Discovery data source

`resolveContinuumDiscoveryCandidates()` in `shared/world/world.continuum-discovery.ts` — ordered catalog slugs (`solo-leveling`, `fate-zero`, `fate-grand-order`) resolved via `getAnimeBySlug`. Primary first; max 3. No MAL fetch on Idle; no invented metadata.

## Discovery presentation

`RegionContinuumDiscovery` in `widgets/region-activities/` — path-plate list reusing `WORLD_NAVIGATOR_PATH` styling (not a card grid). Renders under RegionScene when Continuum is focused and ready. Hidden during anime arrival / transport lock.

## Selection → TASK-092 handoff

Candidate buttons call `arriveAnime(anime)` from `useWorldScene()`. Never `router.push`. URL commit remains deferred in `beginAnimeTransport` / `WorldSceneNavigation`. Transport lock disables duplicate selection.

## Accessibility

Keyboard-reachable `type="button"` candidates with `aria-label` and focus-visible ring via shared path-item classes. Continuum landmark remains focusable in WorldKind. Reduced motion respected on one-shot enter only.

## Performance

No new continuous animation layer, WebGL, Canvas, or catalog preload. Discovery resolves synchronously from catalog only when Continuum is focused. TASK-046 / TASK-068 envelope unchanged.

## Tests

- `shared/world/world.continuum-discovery.test.ts` — data contract
- `widgets/region-activities/region-continuum-discovery.test.ts` — wiring contracts (arriveAnime, no router, no analytics)
- Existing `world-scene.transport.test.ts` — transport unchanged

## Frozen-decision compatibility

Compatible: TASK-053/054/059 (landmark spatial language), TASK-057-A (Memory on arrival), TASK-057-B (Horizon non-interactive), TASK-066 (no Memory-driven environment), TASK-067 (Navigator unchanged), TASK-080 (same destination), TASK-090 (no analytics change), TASK-092 (transport reused), TASK-093 (first place/activity implementation).

## Known limitations

- Curated static catalog slice only — not personalized or MAL-backed discovery on Idle.
- Requires focusing Continuum (pointer, keyboard focus on landmark, or `?region=world-continuum` arrival).
- Supporting candidates are catalog titles only; no discovered-{malId} in Continuum set yet.

## Next-step recommendation

**TASK-095** — Destination activity-first layout (Kinship/Story/Watch primary; metadata subordinate).

## Protected behaviour

- `data-slot="region-continuum-discovery"` with `data-activity="explore"`.
- Selection must use `arriveAnime`, never direct URL write from discovery UI.
- Thresholds must keep generic `RegionActivities` rail.
- Contract tests above must stay green.

## Implementation area

`apps/web/shared/world/world.continuum-discovery.ts` · `apps/web/widgets/region-activities/region-continuum-discovery.tsx` · `region-activities.tsx` · `shared/world/index.ts`.

## Do not undo

- Do not route Continuum discovery through Navigator or `/api/anime-discovery` on Idle focus.
- Do not add discovery persistence, analytics events, or card-grid UI.
- Do not collapse Continuum and Thresholds.
- Do not bypass TASK-092 transport from discovery selection.

## Links

[[TASK-093]] · [[TASK-092]] · [[TASK-053]] · [[TASK-054]] · [[TASK-059]] · [[TASK-067]] · [[TASK-090]] · [[current-state]]
