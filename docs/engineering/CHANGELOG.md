## 2026-08-20 — Sprint-008 · Milestone-III · Task-041

**Task:** The Kinship Constellation

**Objective:** Expanded Kinship presents nearby worlds as branching paths from the current destination — a constellation of crossings — instead of a recommendation list. Candidate data, lazy similar lookup, confirmation, and arrival remain the TASK-039 contract.

### Presentation

A vertical spine and short CSS branch marks indent candidate paths. Titles use existing discovery identity; year/type appear only when present. No cards, posters, SVG, or similarity scores. Hover brightens the plate edge with a 2px motion-safe shift. Reduced motion keeps the branch structure with opacity only.

### Data authority

`requestAnimeDiscovery({ kind: 'similar' })` → `navigatorPathFromDiscovery` → `canonicalizeDiscoveryCandidate` → `arriveAnime()`. No new provider, LLM, or artwork.

### Architecture

Story Chamber, Signals, Watch Now, Save, poster, atmosphere, TASK-035 geometry, and slug-keyed path remount stay frozen.

### Tests

315 expected (was 313). TypeScript, scoped ESLint, and production build follow.

---

## 2026-08-20 — Sprint-008 · Milestone-III · Task-040

**Task:** The Story Chamber

**Objective:** Opening Story unfolds a restrained narrative chamber in place — the same truthful MAL synopsis, presented as an inscription rather than a database paragraph — without changing arrival, Watch Now, Save, poster, atmosphere, or geometry.

### Presentation

Story remains a local path. Expanded, it uses a reading measure, first-line emphasis, a thin closing rule, and a quiet return inscription. No card, panel, modal, or rewritten text. Paths stay below the cinematic fold. Reduced motion stays opacity-only.

### State

`AnimeDestinationPaths` remounts an inner instance on `anime.slug`, so activePath, kinship candidates, and fetchedSlug cannot leak into the next destination.

### Data authority

`destinationStoryRecord()` is unchanged. Story still uses catalog orientation plus already-loaded MAL synopsis. Zero Story requests. No LLM.

### Architecture

TASK-039 paths, Watch Now, Save, poster, atmosphere, TASK-035 geometry, CanonicalAnime, and URL `?anime=` remain frozen.

### Tests

313 expected (was 310). TypeScript, scoped ESLint, and production build follow.

---

## 2026-08-20 — Sprint-008 · Milestone-III · Task-039

**Task:** Anime World Thresholds

**Objective:** After arrival, the destination offers at most three internal paths — Story, Signals, Kinship — so the traveller can go deeper inside AetherAnime without becoming a streaming dashboard. Watch Now remains the only external threshold.

### Presentation

Paths sit after supporting metadata, below the cinematic first viewport on desktop, stacked on mobile. Threshold lines and inscriptions, not tabs, cards, or chips. Story unfolds a fuller existing synopsis when MAL already supplied one. Signals inscribe application-owned semantic evidence without scores. Kinship reuses world-native candidate paths. Reduced motion keeps content with opacity only.

### Data authority

Story reads catalog orientation plus already-loaded MAL synopsis. Signals read `buildAnimeSemanticProfile` evidence only. Kinship calls the existing `similar` discovery lookup. The MAL similar adapter now reads `fields=recommendations` on the anime details resource, because `/anime/{id}/recommendations` 404s with a client ID. No LLM, no wiki, no fabricated lore. Unavailable paths stay hidden. Discovered destinations do not fake Story or Kinship when the existing pipeline cannot lawfully support them.

### Network

Arrival still loads metadata only. Opening Story or Signals adds zero requests. Opening Kinship may request `/api/anime-discovery?similar=` once per mounted destination. No prefetch on arrival.

### Accessibility

Path controls are buttons with `aria-expanded` / `aria-controls`. Expanded regions are labelled. Kinship loading is `aria-live="polite"`. Keyboard order follows poster → Watch Now → Save → paths. Focus is not stolen on expand.

### Architecture

Local `activePath` state only. No store, route, or query parameter. CanonicalAnime, resolveAnime, arriveAnime, Focus, Watch Now, watchlist, Region/World registries, TASK-031 crossing, TASK-032 living world, TASK-035 geometry, TASK-036 hierarchy, TASK-037 poster, and TASK-038 atmosphere stay frozen.

### Tests

310 expected (was 304). TypeScript, scoped ESLint, and production build follow.

---

## 2026-08-20 — Sprint-008 · Milestone-III · Task-038

**Task:** Immersive Poster-Derived World Atmosphere

**Objective:** Catalog arrival projects the same local poster as a large, heavily blurred environmental light field so the selected anime changes how AetherAnime feels, without replacing the world or the sharp foreground artifact.

### Presentation

Option 4: oversized poster projection, cinematic blur (`BLUR_RADIUS.atmospheric`), screen blend, dark-edge mask, quiet offset. Foreground poster stays sharp. Discovered / idle / candidates receive no bitmap atmosphere. Reduced motion keeps the settled projection without travel.

### Architecture

No resolver, store, CanonicalAnime field, Watch Now, navigation, or TASK-031 / 032 / 035 / 036 / 037 change. Source remains `arrivedAnime.poster`.

### Tests

304 pass (was 299). TypeScript, scoped ESLint, and production build follow.

---



**Task:** Anime Destination Interaction & Preview Layer

**Objective:** The arrived poster remains a local identity artifact. Preview copy is a short alternate/year/genre fragment instead of a duplicated synopsis, and presence scale stays at 1.02.

### Presentation

Poster hover/focus/click still only toggles overlay preview. Watch Now and Save stay separate. Discovered destinations keep the seal. No card lift, play icon, or external navigation from the poster.

### Architecture

No resolver, store, CanonicalAnime, Watch Now, navigation, or TASK-031–036 geometry/hierarchy change. Preview state remains local `useState`.

### Tests

299 pass (was 291). TypeScript, scoped ESLint, and production build follow.

---

## 2026-08-20 — Sprint-008 · Milestone-III · Task-036

**Task:** Destination Information Hierarchy & Provider Language

**Objective:** Inside the frozen TASK-035 stage, the copy column now reads as identity → action → narrative → quiet provenance, instead of an equally weighted metadata stack.

### Presentation

Studio, MAL, and Crunchyroll sit below synopsis as supporting context. MAL is one editorial line. Watch Now remains the only threshold. TASK-035 geometry is unchanged.

### Architecture

No resolver, store, CanonicalAnime, Watch Now authority, navigation, or TASK-031 / TASK-032 / TASK-034 / TASK-035 geometry change.

### Tests

291 pass (was 280). TypeScript, scoped ESLint, and production build follow.

---



**Task:** Cinematic Anime Arrival Composition

**Objective:** Arrived anime occupies a destination stage inside AetherAnime — poster and information as siblings — instead of a centered details column under a competing world title.

### Presentation

Arrival recedes WorldIdentity below the anime title, tightens identity→navigator→destination rhythm, and lays out AnimeDestination as a max-w-5xl stage. Catalog uses a 280–340px poster clamp beside a readable copy column (title, metadata, Watch Now, synopsis). Discovered arrivals use a compact seal, not an empty poster hole. Idle and candidates keep the existing world composition.

### Architecture

No resolver, store, CanonicalAnime, MAL, Watch Now, navigation, TASK-031, TASK-032, or TASK-034 wash change. `worldArrivalPresentation().identityGap` is presentation-only.

### Tests

280 pass (was 269). TypeScript, scoped ESLint, and production build follow.

---

## 2026-08-19 — Sprint-008 · Milestone-III · Task-034

**Task:** Full-Screen Catalog Arrival Presentation

**Objective:** Confirmed catalog anime with a local poster occupies the stage as a blurred atmospheric wash behind the existing destination, so the anime feels like it entered AetherAnime rather than appearing as a details card.

### Presentation

`AnimeArrivalAtmosphere` paints `arrivedAnime.poster` as a decorative, pointer-inert wash between world plates and the existing veil / climate / vignette. Discovered arrivals (`poster === null`), candidates, and unknown asks receive no anime bitmap. Motion uses `DURATION.CINEMATIC` CSS keyframes timed to TASK-031. Reduced motion keeps the settled wash without scale travel.

### Architecture

No resolver, store, CanonicalAnime, MAL, Watch Now, navigation, or TASK-031 / TASK-032 change. WorldScene passes the existing poster string. The wash is a derived presentation layer only.

### Tests

269 pass (was 250). TypeScript, scoped ESLint, and production build follow.

---

## 2026-08-19 — Sprint-008 · Milestone-III · Task-032

**Task:** Living World / Idle-to-Arrival Continuity

**Objective:** Idle AetherAnime feels like a quiet breathing place, so TASK-031's crossing reads as a state change in a world that was already present.

### Presentation

Existing environment light, depth plates, and haze breathe while atmosphere is idle or region. Asking (navigator focus) gathers dimensional light. Arrival pauses the breath so the crossing owns the beat. Reduced motion keeps the world complete without travel.

### Architecture

No resolver, store, route, Focus, or Watch Now change. Presence is derived from `worldArrivalAtmosphere().source`. TASK-031 crossing activation is unchanged.

### Tests

250 pass (was 240). TypeScript, scoped ESLint, and production build follow.

---

## 2026-08-19 — Sprint-008 · Milestone-III · Task-031

**Task:** AetherAnime Realm Crossing / Cinematic Arrival

**Objective:** Confirmed anime arrival is a short spatial crossing through the existing world, not a component fade. Final state remains AetherAnime with AnimeDestination as the payoff.

### Presentation

Viewport overlay (veil, aperture, gate) keyed to `arrivedAnime.slug`. Environment depth stack travels `DURATION.CINEMATIC` then settles. Climate still comes from `worldArrivalAtmosphere()`. Candidates never cross. Watch Now is untouched.

### Architecture

No resolver, store, route, or Watch Now change. WorldScene only mounts the decorative overlay. Arrival key is derived presentation, not domain state.

### Tests

240 pass (was 227). TypeScript, scoped ESLint, and production build follow.

---

## 2026-08-19 — Sprint-008 · Milestone-III · Task-030

**Task:** Watch Now Crossing Beat

**Objective:** Verified Watch Now remains the same official destination, but reads as a threshold: a short plate-edge crossing, then the existing `window.open`.

### Presentation

Enabled Watch Now keeps the plate-edge + underline. On `:active`, the edge thickens, the underline resolves toward the arrow, and the arrow translates `DISTANCE.SM / 3`. Unavailable stays disabled with no crossing. Reduced motion skips travel. `openWatchPath` stays synchronous (`noopener,noreferrer`).

### Architecture

No resolver, CanonicalAnime, WorldScene, or watch-path changes. No new state. Crossing is CSS `:active` only.

### Tests

227 pass (was 216). TypeScript, scoped ESLint, and production build follow.

---

## 2026-08-18 — Sprint-008 · Milestone-III · Task-029

**Task:** World-Native Candidate Paths

**Objective:** Ambiguous, discovered, similar, semantic, and watchlist choices share one path-plate presentation. Selection still goes through existing CanonicalAnime → `arriveAnime()`.

### Presentation

Vertical plate-edge paths under the navigator. Title first, year · type when already on the candidate, quiet match/saved context. No cards, posters, filters, or search copy. Existing phase status lines remain.

### Architecture

Navigator state reused. No new store, resolver, route, or MAL call for list rendering.

### Tests

216 pass (was 206). TypeScript, scoped ESLint, and production build follow.

---



**Task:** Arrival Atmosphere Acknowledgement

**Objective:** When `arrivedAnime` is present, existing environment climate washes acknowledge the destination as realm climate + gate. AetherAnime remains the world.

### Mapping

Idle: no destination wash. Region Focus: existing region climate at 0.10. Arrival: local CanonicalAnime genres onto existing `charged` / `cool` / `warm` tokens at 0.16. MAL overlay fields are ignored. No Focus, assets, or network.

### Tests

206 pass (was 197). TypeScript, scoped ESLint, and production build follow.

---



**Task:** World-Native First Invitation

**Objective:** A first visitor must understand they can ask for an anime — by typing or voice — without a modal, chips, or search chrome.

### Invitation

Valid worlds show a spoken invitation instead of the registry operating-system tagline. Registry description stays internal. Internal registry metadata is unchanged.

### Navigator threshold

The ask field is `max-w-md` / `text-base` with a 44px microphone target. Voice label is “Ask the world by voice.” No pulse, card, or search box.

### Watchlist whisper

Idle status stays empty on first visit. If saved destinations exist, a quiet line — “Saved destinations will answer.” — appears in the existing status slot. No badge, dashboard, or new chrome.

### Tests

197 pass (was 184). TypeScript, scoped ESLint, and production build follow.

---



**Task:** Arrival Spacing & Threshold Polish

**Objective:** Receded WorldKind / WorldDetails must not open a second page under the destination. Watch Now must read as a plate-edge threshold, not a text link.

### Spacing

Idle stage/region gaps stay `2xl` / `xl`. Arrival sets CSS variables to `sm` / `sm`. Kind plates compact; Details descriptions clamp. Both remain mounted.

### Watch Now

Leading ring edge + underline + `text-sm`. Save stays quieter. Watch-path logic unchanged.

### Tests

184 pass (was 182). TypeScript, scoped ESLint, and production build follow.

---



**Task:** Focal Arrival / Responsive World Composition

**Objective:** When an anime arrives, it becomes the temporary focal destination in the identity column. AetherAnime remains the world. Kind and Details stay mounted and recede.

### Composition

Idle layout is unchanged. Arrived anime no longer replaces WorldDetails in the secondary slot. `AnimeDestination` renders under the navigator in the identity column. WorldKind stays primary. WorldDetails stays secondary. Arrival recede uses existing opacity (`WORLD_ARRIVAL_RECEDE`).

### Destination presence

Poster scales with `clamp()` (mobile 150–190px, desktop 240–300px). Title is 22–36px. Watch Now is the primary threshold; Save remains secondary. Existing poster-led choreography is reused.

### Tests

182 pass (was 176). TypeScript, scoped ESLint, and production build follow.

---



**Task:** Watchlist Return Identity Hardening + Human-Readable Saved Titles

**Objective:** Discovered hydration must match persisted `{ animeId, slug }` exactly. Optional `title` is display metadata only.

### Identity hardening

`hydratedAnimeMatchesWatchlistRow` requires `anime.id === entry.animeId` and `anime.slug === entry.slug`. Catalog-owned hydration no longer silently migrates a discovered row.

### Display title

New saves may persist `canonicalTitle` as optional `title`. Identity remains `animeId` + `slug`. Watchlist labels use title when present, otherwise `discovered-{malId}`.

### Backward compatibility

Rows without `title` still load. No storage migration. No MAL lookup for list labels.

### Tests

176 pass (was 168). TypeScript, scoped ESLint, and production build pass.

### Visual QA

Not performed in a browser in this session.

### Rejected approaches

Silent catalog migration. WatchlistStoreV2. Title as identity. Extra MAL requests for display.

---

## 2026-08-18 — Sprint-007 · Milestone-II · Task-024

**Task:** AetherAnime Watchlist Return Path

**Objective:** Let a saved `{ animeId, slug }` row re-enter the existing destination pipeline. The watchlist is a return mechanism, not a second resolver.

### Architecture impact

No new store, dashboard, or CanonicalAnime constructor. WorldScene, AnimeDestination, watch-path, and watchlist storage schema are unchanged.

```
watchlist ask (typed/voice)
→ planAnimeAsk() kind: watchlist (0 LLM)
→ watchlistReturnRows(readWatchlist())
→ select row
→ catalog: existing repository CanonicalAnime
   discovered: requestDiscoveredAnime(malId)
→ arriveAnime()
→ URL ?anime={slug}
→ AnimeDestination
→ metadata after arrival
```

### Catalog return

`resolveWatchlistReturn` uses `getAnimeById` + `getAnimeBySlug`. Both must agree. The catalog object is reused, not copied.

### Discovered return

`discovered-{malId}` + `anime.discovered.{malId}` hydrate through the existing discovery lookup. Not inserted into `ANIME_CATALOG`. MAL is not queried just to prove the row exists. Metadata remains after arrival.

### Failure

Unresolvable or mismatched rows are omitted from the list. Selection never fabricates a title, artwork, Watch Now URL, or CanonicalAnime.

### Navigation

`arriveAnime()` still writes `?anime=` via WorldSceneNavigation. Back / Forward / Escape keep existing WorldScene semantics. Duplicate selection does not duplicate storage rows; same-id arrival remains idempotent.

### Tests

`apps/web/shared/anime/anime.watchlist-return.test.ts` plus existing watchlist, discovery, semantic, voice, and navigation suites.

### Known limitations

- Watchlist storage still has no display title. Discovered rows list as `discovered-{malId}` until hydration returns CanonicalAnime.
- Discovered re-arrival still waits on existing discovery hydration before destination render (WorldScene frozen; no fabricated stub).
- Opening the watchlist is a navigator ask (`watchlist` / `my watchlist` / `saved`), not a persistent chrome panel.

### Rejected approaches

WatchlistDestination, WatchlistResolver, WatchlistStoreV2, MAL-keyed storage, schema expansion, LLM watchlist routing, provider dashboard, silent MAL search to open a row.

### Next recommended task

Optional: persist a display title on save without changing the identity key — only if discovered list labels must show the canonical title before hydration. Do not start Milestone-III from this.

---

## 2026-08-17 — Sprint-007 · Milestone-II · Task-023

**Task:** Discovered Anime Destination Completion

**Objective:** Make a confirmed MAL-discovered title feel like a first-class AetherAnime destination without scraping, hotlinking artwork, inventing Watch Now URLs, or making MAL the navigation authority.

Task-022 remains closed and not actionable. Semantic ranking was not reopened.

### Architecture impact

None to frozen surfaces. Discovery still confirms to `CanonicalAnime`, then `arriveAnime()`. MAL remains an enrichment/discovery provider.

```
confirmation
→ canonicalizeDiscoveryCandidate()
→ CanonicalAnime (catalog or discovered-{malId})
→ AnimeDestination renders immediately
→ MAL metadata may fill in afterward
```

### Discovered identity

Unknown confirmed titles keep `id: anime.discovered.{malId}` and `slug: discovered-{malId}`. Catalog MAL IDs still resolve to catalog identity. The static catalog is not mutated. Fate titles cannot collapse into a discovered slug.

### Project-owned visual identity

`poster` stays `null` for discovered titles (no remote image, no generated asset). Destination reuse of the existing geometric plate now renders a deterministic local seal from MAL ID, title, first genre, and year. No CDN, proxy, or image API.

### Metadata behavior

Existing MAL metadata adapter already maps `discovered-{malId}` via `malIdForSlug`. After confirmation, `/api/anime-metadata/{slug}` may enrich score, scored-by, rank, and synopsis. CanonicalAnime is unchanged on failure. Late responses apply only to the slug that requested them.

### Watch-path behavior

Unchanged. Discovered `officialUrl` remains `null` → official `unavailable`. Crunchyroll remains `unknown`. MAL URLs are not Watch Now.

### Watchlist behavior

Unchanged store. Discovered titles persist `{ animeId, slug, savedAt }` using CanonicalAnime identity, not MAL IDs as keys.

### Tests

`apps/web/shared/anime/anime.discovered-destination.test.ts` plus existing discovery/metadata/watch-path/watchlist/semantic suites.

### Known limitations

- Discovered destinations have no project-owned poster WebP.
- URL restore of `?anime=discovered-{id}` still hydrates through the existing discovery lookup (WorldScene frozen).
- MAL synopsis can be longer than catalog orientation copy.
- No verified official Watch Now URL for discovered titles.

### Rejected approaches

Scraping or hotlinking MAL/AniList/Crunchyroll artwork. Remote poster URLs. Image proxy/CDN. Runtime image generation. Invented official or Crunchyroll URLs. Inserting discovered titles into the static catalog. Reopening Task-022 theme fields. LLM ranking or catalog classification.

### Next recommended task

A watchlist return path that can re-arrive saved catalog and discovered identities from existing `{ animeId, slug }` rows — not a dashboard, not a new store, and not MAL-keyed storage.

---

## 2026-08-17 — Sprint-006 · Milestone-II · Task-021 Hardening

**Objective:** Two correctness fixes. No taxonomy expansion. Task-022 was not implemented.

- Retrieval query construction now includes `protagonistTraits` with tone, themes, and genres.
- Taxonomy test asserts `SEMANTIC_TAGS.length === 19`.

Ranking, LLM boundary, and MAL field usage are unchanged.

---

## 2026-08-17 — Sprint-006 · Milestone-II · Task-021

**Task:** AetherAnime Semantic Preference Scoring

**Objective:** Make descriptive asks useful with an application-owned taxonomy and deterministic scoring. The LLM still only extracts intent.

### Semantic taxonomy

Bounded tags (19): dark, lighthearted, wholesome, tragic, comedic, intense, mysterious, psychological, supernatural, revenge, romance, war, isekai, school, overpowered, underdog, strategic, antihero, action-heavy.

Synonyms such as grim→dark and OP→overpowered. Unknown tokens are dropped.

### Profile

`AnimeSemanticProfile` is separate from CanonicalAnime. Evidence is explicit (MAL/catalog genre) or derived (bounded synopsis phrases). Unknown is omitted, never stored as false.

### Deterministic mapping

Horror→dark. Psychological→psychological. Mystery→mysterious. Comedy→comedic. Action→action-heavy (derived only). Action/Fantasy are not dark. Synopsis may derive revenge/underdog/overpowered from whole-word phrases only.

### Scoring

match +4, partial +1, unknown 0, contradiction −3 (wholesome/lighthearted vs explicit dark). Unknown does not punish. Tie-break by MAL id. At most two titles from the same franchise key.

### Explainability

Quiet application labels such as “Dark tone · Psychological”. No scores, no “AI thinks”, no URLs.

### LLM boundary

Unchanged: one optional `/api/anime-intent` call. Scoring never calls the model.

### Files

- `apps/web/shared/anime/anime.semantic-profile.ts`
- `apps/web/shared/anime/anime.semantic-profile.test.ts`
- ranking wired through `retrieveForStructuredIntent`
- optional discovery synopsis for derived signals
- quiet match reason on WorldNavigator candidates

### Known limitations

Overpowered is almost never explicit in MAL genres. “Dark” is only justified by Horror (not Drama/Action). No embeddings. No catalog-wide LLM labeling.

### Next recommended task

Not started. Lawful MAL theme fields if the official API exposes them — not LLM classification.

---

## 2026-08-17 — Sprint-006 · Milestone-II · Task-020

**Task:** AetherAnime Intent Core

**Objective:** Add a bounded semantic intent layer so travellers can describe a path, without turning the world into a chatbot or letting an LLM become the source of truth.

### Semantic intent boundary

The model may only return `StructuredAnimeIntent`. The application validates it, retrieves candidates, and still requires user confirmation before `arriveAnime()`.

### Deterministic-first routing

`planAnimeAsk()`:

1. local exact → arrive, 0 LLM
2. Fate-style ambiguity → local candidates, 0 LLM
3. named unknown title → existing MAL discovery, 0 LLM
4. `something like Solo Leveling` → existing similar path, 0 LLM
5. watchlist exclusion (`haven't saved`) → catalog filter, 0 LLM
6. free-form recommend (`dark` + OP, `like Fate Zero but darker`) → one server LLM call

### Structured intent

`type, title, seedTitle, constraints.{genres,themes,protagonistTraits,tone}, exclusions.watchlisted`

Unknown fields, URLs, and malformed payloads are rejected.

### Candidate retrieval

Application-side: catalog, MAL search, MAL recommendations, then deterministic ranking. Intent `title` is never treated as an arrival.

### Token budget

No LLM on idle, typing, interim voice, Focus, metadata, Watch Now, or watchlist. One semantic submit → at most one `/api/anime-intent` POST.

### Voice

Typing and final voice transcripts share `planAnimeAsk`. No second resolver.

### Failure

Missing credentials skip the network. Timeouts and malformed model output → “The world could not understand that path.” Named titles still resolve.

### Security

Server-only `SEMANTIC_INTENT_*`. Client re-validates. No tools, no model URLs, no watchlist mutation from model output.

### Files

- `apps/web/shared/anime/anime.semantic-intent.ts`
- `apps/web/shared/anime/anime.semantic-intent.test.ts`
- `apps/web/shared/anime/anime.semantic-request.ts`
- `apps/web/app/api/anime-intent/route.ts`
- `apps/web/.env.example`
- WorldNavigator routing/copy
- voice prefix `give me`

### Known limitations

Without `SEMANTIC_INTENT_*`, descriptive asks fail closed. Tone/protagonist traits are not MAL fields, so ranking treats them as unknown. No embeddings, no multi-turn memory.

### Rejected approaches

Chat UI, streaming, agents, tool calling, model navigation, model Watch Now URLs, vector DB, RAG, Redis, injecting the catalog or watchlist into the prompt.

### Next recommended task

Not started. A lawful way to score tone/theme against catalog/MAL fields — not a chatbot.

---

## 2026-08-17 — Sprint-005 · Milestone-II · Task-019

**Task:** Anime Discovery & Intent Navigation

**Objective:** Let the world find titles beyond the four-entry catalog without making MAL the navigation source of truth.

### Watch-path / discovery boundary

```
typed/voice input → intent normalization → resolveAnime()
  exact/ambiguous catalog match → existing arrival / confirmation
  unknown or similar-to-resolved → MAL discovery adapter → candidates
  user confirmation → CanonicalAnime → arriveAnime()
```

MAL search never auto-arrives. `resolveAnime()` is unchanged.

### Intent

`parseAnimeIntent` distinguishes `navigate` from `similar` (`something like …`). Voice prefixes still strip first, including `I want to enter`.

### Discovery model

`AnimeDiscoveryCandidate` is not `CanonicalAnime`. Confirmation runs `canonicalizeDiscoveryCandidate`:

- catalog MAL ID → existing catalog destination (artwork + verified Watch Now)
- unknown MAL ID → `discovered-{malId}`, `poster: null`, `officialUrl: null`

Official watch path stays Task-018: discovered titles are official `unavailable`, Crunchyroll `unknown`.

### MAL discovery adapter

Server-only `GET /api/anime-discovery`:

- `q` → official `GET /v2/anime?q=`
- `similar` → official `GET /v2/anime/{id}/recommendations`
- `id` → official `GET /v2/anime/{id}` for confirmed URL hydration

Same `MAL_CLIENT_ID` / `X-MAL-CLIENT-ID` as Task-017. No `NEXT_PUBLIC_` secrets. UI never imports MAL HTTP types.

### Failure / performance

Missing credentials, network errors, and malformed payloads yield no candidates (unknown copy). AbortController on new asks. No idle/typing/interim/ambiguous prefetch. No polling.

### Files

- `apps/web/shared/anime/anime.intent.ts`
- `apps/web/shared/anime/anime.discovery.ts`
- `apps/web/shared/anime/anime.mal.discovery.ts`
- `apps/web/shared/anime/anime.discovery-request.ts`
- `apps/web/shared/anime/anime.discovery.test.ts`
- `apps/web/app/api/anime-discovery/route.ts`
- compatibility: identity slugs, metadata route, repository arrival, WorldNavigator, WorldScene hydrate, voice prefix

### Tests

Local catalog still resolves without discovery. Fate stays local-ambiguous. Unknown titles become search lookups. Similar-to-catalog uses recommendations. Canonicalization prefers catalog IDs. Discovered identities do not collapse Fate titles. Watchlist schema unchanged.

### Known limitations

Discovered destinations have no project-owned poster and no verified official Watch Now URL. Recommendations require a resolved catalog seed. Discovery needs `MAL_CLIENT_ID`.

### Rejected approaches

MAL search as resolver, auto-arriving the first hit, client MAL credentials, MAL artwork, LLM intent, search-engine result pages, provider cards, Crunchyroll search, Redis/DB, changing Focus/environment/watchlist architecture.

### Next recommended task

Not started. Lawful discovered artwork or a verified watch path for a confirmed discovered title — not scraping.

---

## 2026-08-17 — Sprint-004 · Milestone-II · Task-018

**Task:** Verified Watch Path & Provider Availability Foundation

**Objective:** Make Watch Now a verified-watch-path action with explicit `verified` / `unavailable` / `unknown` semantics, without turning the destination into a streaming dashboard.

### Watch-path model

`AnimeWatchPath`: `{ provider, status, url }`

- `official` + verified https URL → Watch Now enabled
- `official` + no verified URL → `unavailable` (Watch Now unavailable)
- `crunchyroll` → `unknown` (Availability unavailable)

Unknown is not collapsed into unavailable. “We did not check” is not “this title cannot be watched.”

Visible UI still says **Watch Now**. Internally that means a verified official destination (information/access site), not a playable stream.

### Verified official URLs (unchanged from Task-015)

- Solo Leveling → `https://sololeveling-anime.net/`
- Fate/Zero → `https://www.fate-zero.jp/`
- Fate/Grand Order → `https://anime.fate-go.jp/FirstOrder/`

### Fate/stay night verification

**No 2006 Studio Deen TV destination was verified.** Live `https://www.fate-sn.com/` is Heaven’s Feel. UBW/Aniplex pages are a different adaptation. `officialUrl` remains `null`. Official path status is `unavailable`.

### Crunchyroll investigation

Crunchyroll provider integration deferred because no suitable officially supported consumer availability API was established.

Crunchyroll was NOT scraped. No undocumented Crunchyroll endpoint was used. No Crunchyroll credentials were introduced.

The Partner Portal is B2B, not a public title-availability API. Community reverse-engineered clients exist; they were not used.

Unknown availability is not represented as unavailable merely because an integration does not exist. Crunchyroll stays `unknown`.

### Provider boundary

`AnimeWatchPathProvider.getByCanonicalAnime` mirrors Task-017’s metadata provider. AnimeDestination consumes normalized paths only. No Crunchyroll/MAL HTTP types in the widget. No network for watch paths — they derive from the local catalog.

### Failure semantics

Invalid / non-https / aggregator URLs are rejected. Malformed verified entries without https do not enable Watch Now.

### Security

No Crunchyroll credentials. No `NEXT_PUBLIC_` secrets. External navigation still uses `window.open(..., 'noopener,noreferrer')`. In-world `worldHref` is unchanged.

### Architecture impact

```
resolveAnime() → CanonicalAnime → watchPathsForAnime()
                                 → verifiedWatchUrl() → Watch Now
                                 → crunchyroll status unknown → Availability unavailable
```

Voice/typing still resolve locally. Ambiguous/unknown produce no watch-path lookup. MAL metadata, watchlist, Focus, and environment are unchanged.

### Files modified

- `apps/web/shared/anime/anime.watch-path.ts` (new)
- `apps/web/shared/anime/anime.watch-path.test.ts` (new)
- `apps/web/shared/anime/index.ts`
- `apps/web/shared/anime/anime.types.ts`
- `apps/web/shared/anime/anime.catalog.ts` (comment only)
- `apps/web/widgets/anime-destination/anime-destination.tsx`
- `docs/engineering/CHANGELOG.md`

Catalog URLs were not rewritten.

### Tests

Watch-path unit tests cover verified/unavailable/unknown, invalid URLs, Fate identity, voice convergence, and no lookup for ambiguous/unknown. Existing MAL, watchlist, resolver, and voice tests remain in the suite.

### Visual QA

Idle/region/unknown/ambiguous do not add provider requests (watch paths are local). Solo Leveling / Fate/Zero / FGO Watch Now verified. Fate/stay night Watch Now unavailable. Crunchyroll Availability unavailable. No provider cards or logos.

### Known limitations

Official Watch Now still opens information sites, not episode players. Crunchyroll cannot be honestly marked available or unavailable per title without an official API. Fate/stay night 2006 has no verified destination.

### Rejected approaches

Crunchyroll scraping, hidden Crunchyroll APIs, browser automation, unofficial proxy APIs, geo-bypass, embedded video, provider cards/logo walls, MAL architecture changes, watchlist changes, Focus/environment changes.

### Next recommended task

A lawful Crunchyroll partner/availability integration **if** Crunchyroll grants an official consumer API; otherwise a verified 2006 Fate/stay night destination if one appears. Not an LLM. Not scraping.

---

## 2026-08-17 — Sprint-004 · Milestone-II · Task-017

**Task:** AetherAnime Metadata Oracle

**Objective:** Enrich an already-resolved CanonicalAnime destination with server-side MyAnimeList metadata. MAL does not resolve navigation.

MAL enriches an already-resolved CanonicalAnime. MAL does not resolve navigation.

### Files modified

**New**

- `apps/web/shared/anime/anime.metadata.ts`
- `apps/web/shared/anime/anime.mal.identity.ts`
- `apps/web/shared/anime/anime.mal.normalize.ts`
- `apps/web/shared/anime/anime.mal.provider.ts`
- `apps/web/shared/anime/anime.metadata.test.ts`
- `apps/web/app/api/anime-metadata/[slug]/route.ts`
- `apps/web/widgets/anime-destination/use-anime-metadata.ts`
- `apps/web/.env.example`

**Changed**

- `apps/web/widgets/anime-destination/anime-destination.tsx`
- `apps/web/widgets/anime-destination/anime-destination.constants.ts`
- `apps/web/shared/anime/index.ts`
- `apps/web/widgets/world-navigator/world-navigator.speech.ts` — Task-016 hardening
- `apps/web/widgets/world-navigator/world-navigator.speech.test.ts`
- `apps/web/widgets/world-navigator/world-navigator.tsx`
- `apps/web/.gitignore` — allow `.env.example`
- `docs/engineering/CHANGELOG.md`

Frozen: catalog, resolver, WorldNavigator resolution path, WorldSceneNavigation, Region/Focus/environment, Crunchyroll.

### MAL provider boundary

`AnimeMetadataProvider.getByCanonicalAnime(CanonicalAnime)`. UI receives `AnimeMetadata`, never MAL’s response schema. The adapter calls `GET https://api.myanimelist.net/v2/anime/{id}` only.

### Authentication

Official MAL `client_auth`: header `X-MAL-CLIENT-ID`. Server env `MAL_CLIENT_ID` (never `NEXT_PUBLIC_*`). User OAuth is not used. Missing credentials skip the network and leave metadata unavailable.

### Metadata model

`source, malId, title, alternateTitle, synopsis, score, scoredBy, rank, popularity, members, genres, url`. Score is MAL `mean`. `0` stays `0`; missing stays `null`. No MAL images.

### Identity strategy

Verified MAL IDs keyed by catalog slug, not title search:

- `solo-leveling` → 52299 (Ore dake Level Up na Ken, TV 12)
- `fate-stay-night` → 356 (TV 2006, 24)
- `fate-zero` → 10087 (2011 first cour)
- `fate-grand-order` → 34321 (First Order, 2016 special)

Fate IDs are distinct. Unknown/ambiguous resolutions produce no lookup target.

### Caching

Native `fetch` with `next: { revalidate: 86400 }` and a 5s timeout. No Redis, DB, or workers.

### Failure behavior

Missing credentials, 401/403/404/429, timeout, network, and malformed JSON all become `metadata: null`. Traveller sees existing “Unavailable”. No status codes, stack traces, or API URLs in the UI.

### Security

Credentials live only in server env and the `X-MAL-CLIENT-ID` request from the route handler. Client fetches `/api/anime-metadata/{slug}` only. No tokens in HTML, URL, localStorage, or client bundles.

### Architecture impact

```
typed/voice → resolveAnime() → CanonicalAnime → arriveAnime()
                                              ↓
                                 GET /api/anime-metadata/{slug}
                                              ↓
                                 MalMetadataProvider (server)
                                              ↓
                                 AnimeDestination MAL line
```

Destination arrives on local catalog data. Metadata fills in after. AbortController + `key={slug}` prevent late responses from overwriting a newer destination.

### Task-016 hardening

Clean SpeechRecognition `onend` without a final transcript or error now settles listening UI to idle via `settleVoiceAfterRecognitionEnd`. Abort/error states are preserved.

### Verification

- Automated tests 64/64
- `tsc --noEmit` clean
- Scoped ESLint clean
- `next build` (once)

### Visual QA

Idle and region routes make no metadata request. Arrival requests once per slug. Ambiguous Fate and unknown queries do not. Score and scored-by remain distinct. Crunchyroll stays unavailable. Watchlist/Watch Now/voice/typing/Back-Forward/reduced motion unchanged.

### Known limitations

Without `MAL_CLIENT_ID`, the MAL line stays Unavailable (catalog destination still works). Fate/Zero maps to MAL’s 13-episode first cour (10087), not a combined 25-episode listing. MAL synopsis is not dumped into the first viewport.

### Rejected approaches

MAL search as resolver. Jikan. Crunchyroll. AniList. LLM. Redis. Client-side MAL fetch. `NEXT_PUBLIC_` credentials. Hotlinked MAL artwork.

### Next recommended task

A Crunchyroll availability adapter with the same provider-boundary rules, or a verified Fate/stay night Watch Now URL. Not both, and not combined with an LLM.

---

## 2026-08-17 — Sprint-004 · Milestone-II · Task-016

**Task:** AetherAnime Voice Navigator

**Objective:** Add voice as a second input modality to WorldNavigator so a traveller can say “Take me to Solo Leveling” and reach the existing anime destination pipeline.

Voice is an input adapter, not a second anime resolver.

Browser SpeechRecognition support is not universal. Typing remains the guaranteed fallback.

### Files modified

**New**

- `apps/web/shared/anime/anime.voice.ts` — deterministic command-prefix stripping
- `apps/web/shared/anime/anime.voice.test.ts`
- `apps/web/widgets/world-navigator/world-navigator.speech.ts` — SpeechRecognition lifecycle adapter
- `apps/web/widgets/world-navigator/world-navigator.speech.test.ts`

**Changed**

- `apps/web/widgets/world-navigator/world-navigator.tsx`
- `apps/web/widgets/world-navigator/world-navigator.constants.ts`
- `apps/web/widgets/world-navigator/index.ts`
- `apps/web/shared/anime/index.ts`
- `docs/engineering/CHANGELOG.md`

Frozen surfaces were not modified: WorldEnvironment, WorldKind, WorldIdentity, WorldDetails, WorldLayout, AnimeDestination, catalog, Region Registry, Focus, WorldScene navigation ownership.

### Architecture impact

```
typed input ─┐
             ├→ normalizeVoiceQuery (voice only) → resolveAnime() → arriveAnime()
voice input ─┘
```

Voice never selects CanonicalAnime. It produces text. WorldSceneNavigation still owns `?anime=`.

### Browser SpeechRecognition

Feature-detected via `window.SpeechRecognition ?? window.webkitSpeechRecognition`. SSR-safe (`useSyncExternalStore`, server snapshot false). `continuous = false`, `interimResults = true`, `maxAlternatives = 1`, `lang = en-US`. Permission requested only on explicit microphone activation. Unsupported browsers hide the microphone; typing still works.

This task does not claim offline recognition. The browser implementation may use a vendor speech service; AetherAnime does not upload audio itself.

### Fallback

Unsupported, permission denied, no-speech, and capture errors keep typing fully functional. Error copy is project-native; abort is silent.

### Accessibility

Microphone is `type="button"` with `aria-label` “Use voice navigation” / “Stop voice navigation” and `aria-pressed` while listening. Enter/Space activate it. Escape stops listening first, then preserves existing navigator Escape. Existing focus-visible ring. No autofocus.

### Reduced motion

Voice does not require animation. Color transition uses `motion-reduce:transition-none`. Status copy and icon color are the semantic indicators.

### Performance

Recognition exists only while explicitly listening. No wake word, no background recording, no audio persistence, no new dependencies, no catalog/MAL/Crunchyroll requests, no poster preload.

### Verification

- Automated tests 42/42 (20 prior + 11 voice normalize/convergence + 11 speech adapter)
- `tsc --noEmit` clean
- Scoped ESLint on navigator + voice files clean
- `next build` compiled successfully (once)

### Visual QA

Viewports 1440×900, 1920×1080, 820×1180, 390×844. Idle mic when supported; hidden when constructors absent. Listening copy + interim transcript. “Take me to Solo Leveling” arrives through existing AnimeDestination. “Take me to Fate” stays ambiguous. Unknown does not navigate. Permission / no-speech / capture errors. Keyboard Enter + Escape abort. Reduced motion arrival. Typing fallback. Region Back/Forward. Watchlist and Watch Now unchanged. Console 0. No H-scroll. No provider image requests.

### Known limitations

SpeechRecognition is Chromium-leaning. Prefix stripping is deterministic, not NLU. English (`en-US`) only. Playwright QA used a fake recognizer for determinism; a real microphone still requires browser permission UI.

### Rejected approaches

LLM / Whisper / cloud speech SDKs. Chatbot panel. Second resolver. Zustand. Waveforms / pulse rings. Direct `router` writes from voice. Fuzzy AI matching.

### Next recommended task

A real server-side metadata adapter (MAL), now that voice is a stable input adapter. Do not combine MAL + voice + LLM in the next slice.

---

## 2026-08-17 — Sprint-004 · Milestone-II · Task-015

**Task:** Anime destination asset & official link foundation

**Objective:** Replace geometric destination seals with project-owned 400×600 WebP artwork for the current catalog, and set Watch Now `officialUrl` only where a live official destination was verified.

### Files modified

- `apps/web/shared/anime/anime.catalog.ts`
- `apps/web/shared/anime/anime.catalog.test.ts` (new)
- `docs/engineering/CHANGELOG.md`

Frozen surfaces were not modified: WorldScene, WorldLayout, WorldEnvironment, WorldKind, WorldIdentity, WorldDetails, AnimeDestination, Region Registry, Focus.

### Assets added

- `apps/web/public/assets/aetheranime/anime/solo-leveling/solo-leveling-poster.webp`
- `apps/web/public/assets/aetheranime/anime/fate-stay-night/fate-stay-night-poster.webp`
- `apps/web/public/assets/aetheranime/anime/fate-zero/fate-zero-poster.webp`
- `apps/web/public/assets/aetheranime/anime/fate-grand-order/fate-grand-order-poster.webp`

Original atmospheric posters (gate, grail-over-city, war-beam, layered histories). Not official key art. Not scraped.

### Official URLs verified

- Solo Leveling → `https://sololeveling-anime.net/` (official anime site, live)
- Fate/Zero → `https://www.fate-zero.jp/` (official anime site, live)
- Fate/Grand Order (2016 First Order / Lay-duce) → `https://anime.fate-go.jp/FirstOrder/` (official anime site, live)
- Fate/stay night (2006 Studio Deen) → `officialUrl` remains `null` — **MANUAL VERIFICATION REQUIRED**. Live `https://www.fate-sn.com/` is Heaven’s Feel movies, not the 2006 TV series.

### Architecture impact

None. Catalog `poster` and `officialUrl` only. AnimeDestination still uses `next/image`. Watch Now still follows `officialUrl`. Ratings stay null.

### Visual impact

Geometric seal is replaced by local artwork on the existing 2:3 plate. Hierarchy unchanged: AetherAnime → navigator → WorldKind → AnimeDestination.

### Performance

Local WebP, 400×600, 7–16KB. No remote image fetch. No preload of unrelated titles. No video. No new image dependency.

### Accessibility

Unchanged: poster remains a keyboard/touch preview control with `aria-expanded` and an accessible name. Image `alt=""` because the button already names the destination.

### Verification

- Automated tests 20/20 (15 existing + 5 catalog asset tests)
- `tsc --noEmit` clean
- Scoped ESLint on catalog files clean
- `next build` (once)

### Visual QA

Routes: idle, `?anime=solo-leveling`, `?anime=fate-zero`, `?anime=fate-stay-night`, `?anime=fate-grand-order`, `?region=world-continuum`. Viewports 1440×900, 1920×1080, 820×1180, 390×844. Typed Solo Leveling arrives with local poster and Watch Now enabled. Fate ambiguous. Unknown stays unknown. Region Focus unaffected. Poster hover/Enter/touch preview. Watchlist save/remove. Fate/stay night Watch Now stays unavailable. Reduced motion preview still readable. Console 0. No H-scroll. No provider image requests. Posters load through `next/image` from local public WebP.

### Manual changes needed

Fate/stay night Watch Now stays unavailable until a 2006-series official page is verified. Do not guess UBW or Heaven’s Feel URLs for that catalog entry.

### Known limitations

Posters are symbolic identity art, not character key art. Provider ratings remain unavailable. Fate/stay night has artwork but no Watch Now.

### Next recommended task

Voice (013B) or a real MAL server adapter — not both. Do not scrape posters. Do not invent Fate/stay night Watch Now.

---

## 2026-08-16 — Sprint-004 · Milestone-II · Task-014

**Task:** Anime arrival experience / world pull-in

**Objective:** Make arrived anime feel acknowledged and pulled into AetherAnime’s spatial composition, rather than displayed as a search result.

### Files modified

- `apps/web/widgets/world-navigator/world-navigator.tsx`
- `apps/web/widgets/world-navigator/world-navigator.constants.ts`
- `apps/web/widgets/world-navigator/world-navigator.motion.ts`
- `apps/web/widgets/world-navigator/index.ts`
- `apps/web/widgets/anime-destination/anime-destination.tsx`
- `apps/web/widgets/anime-destination/anime-destination.constants.ts`
- `apps/web/widgets/anime-destination/anime-destination.motion.ts`
- `docs/engineering/CHANGELOG.md`

Frozen surfaces were not modified.

### Architecture impact

None. `arrivedAnime` remains parallel to Focus. Watchlist still uses `useSyncExternalStore`. No Zustand, no new context, no Registry or climate changes.

### Visual impact

Navigator underline accents by phase; resolving copy is “The world is listening.” Destination uses a poster-led pull-in: plate wash + leading edge (Region-plate language, not a card), desktop poster+identity row from `md`, stacked on 390. Alternate title sits quietly under the name. Provider lines stay stacked and honest.

### Motion

Navigator resolve beat `DURATION.FAST` (200ms). Poster `SCALE.FROM` → `TO` + opacity, then identity (`DELAY.SHORT`), body (`0.2s`), actions (`DELAY.LONG`). Total settle ≈ 200ms + 700ms. Reduced motion: opacity only, no scale/translate.

### Performance

No new loops, observers, video, or poster preloads. Landscape 3 environment images, portrait 1.

### Accessibility

Phase `aria-live` preserved (phase copy only, not stagger). Poster still keyboard/touch preview. Watchlist uses `aria-pressed` plus `aria-label` Remove/Save. Reduced-motion preview remains opacity-based.

### Verification

- Existing automated tests 15/15
- `tsc --noEmit` clean
- Scoped ESLint on navigator + destination clean
- `next build` compiled successfully (once)

### Visual QA

Routes: idle, `?anime=solo-leveling`, continuum, thresholds, unknown slug. Viewports 1440×900, 1920×1080, 820×1180, 390×844. Typed Solo Leveling (listening → answers), Back, Forward, Fate ambiguous, Escape clear, unknown, region after clear, anime after region, poster hover/Enter, watchlist, Watch Now disabled, reduced motion. Console 0. No H-scroll. No provider image requests.

### Manual changes needed

No project-safe character posters exist. Do not scrape MAL/Crunchyroll.

Add 400×600 WebP at:

- `apps/web/public/assets/aetheranime/anime/solo-leveling/solo-leveling-poster.webp`

Then set `CanonicalAnime.poster`. No API token required.

### Known limitations

Geometric seal until artwork is supplied. On 390×844 AnimeDestination remains below WorldKind (correct order). Watchlist/Watch Now can sit below the 1440 first fold.

### Next recommended task

Author project-safe posters and official URLs, then voice (013B) or a real MAL server adapter — not both.

---

## 2026-08-16 — Sprint-004 · Milestone-II · Task-013A

**Task:** AetherAnime World Navigator — golden path

**Objective:** Let a traveller type a canonical anime name and arrive in that destination inside AetherAnime, parallel to curated Region Focus, without turning the world into a search dashboard.

**Tasks 005–012 remain unchanged and closed. Milestone-I is frozen.**

### Files modified

**New**

- `apps/web/shared/anime/` — CanonicalAnime, catalog, CatalogAnimeProvider, resolver, repository, watchlist
- `apps/web/widgets/world-navigator/`
- `apps/web/widgets/anime-destination/`
- `apps/web/shared/anime/anime.resolver.test.ts`
- `apps/web/shared/anime/anime.watchlist.test.ts`
- `apps/web/shared/lib/navigation/world-transition.test.ts`

**Changed**

- `apps/web/app/world/[destination]/page.tsx` — reads `?anime=`, validates via catalog
- `apps/web/widgets/world-scene/world-scene.tsx` — `arrivedAnime` / `arriveAnime` / `clearAnimeArrival`
- `apps/web/widgets/world-scene/world-scene.types.ts`
- `apps/web/widgets/world-scene/world-scene-navigation.tsx`
- `apps/web/shared/lib/navigation/world-transition.ts` — optional `animeSlug`; region and anime mutually exclusive
- `apps/web/shared/lib/navigation/world-navigation-commit.ts`
- `apps/web/shared/lib/navigation/world-navigation-target.ts`
- `apps/web/shared/lib/navigation/index.ts`
- `docs/engineering/CHANGELOG.md`

**Not modified (frozen)**

WorldEnvironment, WorldKind, WorldIdentity, WorldLayout, RegionIdentity, RegionActivities, `world.focus` reducer, Portal, Arrival, theme palette, environment assets.

### Architecture impact

Anime is a **parallel** destination on WorldScene. It never enters `focusedRegion`, the Focus reducer, Region Registry, Region climate, or curated Region activation.

```
WorldNavigator → resolveAnime → WorldScene.arriveAnime() → arrivedAnime → AnimeDestination
```

WorldLayout still only places slots. WorldScene composes:

- identity default: WorldIdentity + WorldNavigator
- secondary: `arrivedAnime` → AnimeDestination, else WorldDetails

No WorldContext widget: the conditional at the shell boundary is the smallest composition.

Provider boundary: `CatalogAnimeProvider` only. No MAL adapter. No Crunchyroll adapter.

No Zustand. No global store. Watchlist is localStorage via `useSyncExternalStore`.

### Navigation / data flow

```
/world/aetheranime
/world/aetheranime?region=world-continuum
/world/aetheranime?anime=solo-leveling
```

Page validates `searchParams.anime` against the catalog and passes `initialAnimeSlug`. WorldScene stays router-free. WorldSceneNavigation owns `router.push`. Same-anime reactivation is a no-op. Hover/focus never writes URL. Unknown `?anime=` leaves the normal world.

When anime arrives: curated Focus clears, climate stays idle (Milestone-I environment). When anime clears: WorldDetails returns.

### Visual impact

Navigator is a quiet ask under WorldIdentity — orientation + underline input, not a glass panel or chatbot. AnimeDestination is a place in the secondary slot: poster seal + identity, compact metadata, honest provider unavailability, hairline actions. Anime title measured 20px at 1440 vs AetherAnime 72px.

### Interaction

Enter submits. Escape clears the ask; a second Escape with an empty ask leaves arrival. Ambiguous Fate titles are keyboard-selectable and do not auto-navigate. Poster hover, keyboard focus, and explicit activation share one preview. Watchlist toggles `aetheranime.watchlist.v1` (`animeId`, `slug`, `savedAt` only). Watch Now is disabled until `officialUrl` exists.

### Accessibility

Navigator has a visible label (sr-only + orientation), Enter/Escape, visible focus, `aria-live="polite"` status. Ambiguous candidates are buttons. Poster has an accessible name and `aria-expanded`. Actions are real buttons. Reduced motion: no resolve delay, no transform dependence, preview still readable.

### Motion

Existing tokens only (`DURATION` / `EASING` / `DISTANCE` / `STAGGER`). One-shot opacity + small translate. No spinner, no camera, no WebGL, no video.

### Performance

Synchronous local catalog. No keystroke resolution. No debounce. No poster preload for other catalog rows. Landscape still 3 environment images; portrait 1. No provider image requests.

### Verification

- `npx tsx --test` on resolver, watchlist, and href tests — 15 passed
- `tsc --noEmit` — clean
- Scoped ESLint on touched source — clean (no errors)
- `next build` — compiled successfully

### Visual QA

Routes: `/world/aetheranime`, `?anime=solo-leveling`, `?region=world-continuum`, `?region=thresholds-ahead`, `?anime=does-not-exist`.

Viewports: 1440×900, 1920×1080, 820×1180, 390×844.

Interactions: typed Solo Leveling → arrival + URL; refresh preserves; Back restores WorldDetails; Fate → ambiguous list; Fate/Zero candidate; Escape clear; unknown query; poster hover/preview; watchlist add/remove; Watch Now disabled; reduced-motion preview.

Console: 0 errors. No H-scroll. No MAL/Crunchyroll image requests. Environment image counts unchanged.

### Manual changes needed

No project-safe character posters exist under `apps/web/public/assets/`. Do **not** scrape MAL or Crunchyroll. Until artwork is added, destinations use a geometric seal.

Add locally owned WebP posters at:

- `apps/web/public/assets/aetheranime/anime/solo-leveling/solo-leveling-poster.webp`
- `apps/web/public/assets/aetheranime/anime/fate-stay-night/fate-stay-night-poster.webp`
- `apps/web/public/assets/aetheranime/anime/fate-zero/fate-zero-poster.webp`
- `apps/web/public/assets/aetheranime/anime/fate-grand-order/fate-grand-order-poster.webp`

Recommended: 400×600 WebP (2:3, ~2× the 96px CSS width). Then set `CanonicalAnime.poster` to that public path.

No API token is required for this catalog-only slice.

### Known limitations

- Catalog is four titles. It proves architecture, not coverage.
- `officialUrl` is null — Watch Now stays unavailable until a verified official URL is authored.
- Provider ratings are null and displayed as unavailable. That is honest, not a stub score.
- Mobile 390×844 shows Identity → Navigator → Kind first; AnimeDestination continues below the fold (correct slot order, not first-viewport).
- Geometric poster seal until project-safe artwork is supplied.

### Rejected approaches

- Putting anime ids into `focusedRegion` / Region Registry
- `/world/aetheranime/anime/{slug}` nested routes
- Zustand or TanStack Query for this slice
- Fake MAL/Crunchyroll adapters or scores
- Voice / Web Speech / LLM / fuzzy silent match
- Downloading copyrighted poster URLs
- Coupling WorldLayout’s secondary slot permanently to AnimeDestination

### Next recommended task

Author project-safe posters and official URLs for the four catalog titles, then Task-013B (voice) or a real server-side MAL adapter — not both at once.

---

## 2026-08-16 — Sprint-004 · Milestone-I · Task-012

**Task:** AetherAnime Focused Region Identity Hierarchy

**Purpose:** Acknowledge the focused Region as orientation, not a second hero. WorldIdentity remains WHO. WorldDetails owns WHAT. RegionActivities remain actions, not a third title band.

**Tasks 005–010 remain unchanged and closed.**

**No new assets. No new dependencies. No new runtime state. No Focus ownership changes. No Registry architecture changes. No WorldEnvironment / WorldKind / WorldIdentity / WorldLayout changes.**

### Files Changed

- `apps/web/widgets/region-identity/region-identity.tsx`
- `apps/web/widgets/region-identity/region-identity.constants.ts`
- `apps/web/widgets/region-activities/region-activities.tsx`
- `apps/web/widgets/region-scene/region-scene.tsx`
- `docs/engineering/CHANGELOG.md`

### Architecture impact

None. WorldScene still owns Focus. RegionScene still derives `currentRegion` / `regionStatus`. RegionIdentity and RegionActivities still consume `useRegionScene()` only. Slot defaults unchanged; only RegionScene child order changed (identity → shell → activities).

### Presentation change

Focused RegionIdentity is an orientation marker:

- small emblem (`size-2`)
- muted eyebrow (`0.625rem`, tracking `0.32em`)
- displayName at `text-sm` / `text-foreground/80` (measured 14px vs AetherAnime 72px at 1440)
- short accent rule (`w-8`)
- comingSoon / sealed status hint only

Removed from RegionIdentity: description, tagline, `text-2xl` + `legibility.display`, `text-ring/90` eyebrow.

Idle tether unchanged (`Regional space`, opacity 0.45, vertical hairline).

Focused opacity: ready 0.82, comingSoon 0.72, sealed 0.64, unknown 0.7 — all below WorldIdentity at 1.

RegionActivities moved after WorldShell. Idle renders nothing (no empty host). Action row uses muted type (`0.5625rem`), not `text-ring/90`. Link / aria-label / focus-visible ring unchanged.

### Information ownership

| Information | Visual owner |
|---|---|
| Region name (acknowledgement) | RegionIdentity |
| Region description | WorldDetails |
| Region tagline | no longer shown in Identity (still on Registry; WorldDetails does not render it) |
| Region activities | RegionActivities, after destinations / context |
| comingSoon / sealed | Identity hint + Details status copy |

### Interaction / accessibility

Unchanged: plate `role="button"`, tabIndex, aria-label, pointer/keyboard Focus, Enter, Space, URL arrival, click-away. RegionIdentity remains informational. Activity Links keep href + aria-label + focus-visible ring.

### Motion / reduced motion

Existing enter/swap only. Reduced motion: focused name still present, no description restored, scale none on plates.

### Performance

Zero new assets, requests, dependencies, listeners, timers, React state. Landscape 3 environment images, portrait 1.

### Verification

- `tsc --noEmit` — clean
- Scoped ESLint on four touched source files — clean
- `next build` — compiled successfully

### Visual QA

12 viewport × route combinations plus hover, keyboard, Enter, Space, click-away, reduced motion, coarse pointer. All passed. Console 0. No H-scroll.

Measured at 1440×900 continuum: identity `72px` at y=284; region title `14px` at y=95; activities at y=884 (below Kind). 390×844 focused: Details in-view; AetherAnime still `48px` (title scale frozen).

### Known limitations

- Region tagline is no longer shown in Identity. It remains on the Registry record. WorldDetails already owns description; tagline is not duplicated there either.
- On 1440×900, the activity row sits near the bottom edge (y≈884). On 390×844 it continues below Details. That is actions after context, not a first-viewport title.
- Idle Thresholds plate still carries a quieter `ring` accent from Task-008. Unchanged.

### Rejected approaches

Shrinking AetherAnime · moving WorldIdentity below RegionIdentity · RegionIdentity card/panel/glow · keeping description on Identity · leaving Activities between Identity and the world name · new Focus/climate/environment work

---

## 2026-08-16 — Sprint-004 · Milestone-I · Task-010


**Task:** AetherAnime WorldKind Header Quieting

**Purpose:** Make `PLATFORM HOME / Operating presence` read as quiet orientation metadata attached to the destination field, not a dashboard section heading.

**Tasks 005–009 remain unchanged and closed.**

**No new assets. No new dependencies. No new runtime state. No Focus ownership changes. No Registry architecture changes. No WorldEnvironment changes. No WorldLayout changes.**

### Files Changed

- `apps/web/widgets/world-kind/world-kind.tsx`
- `docs/engineering/CHANGELOG.md`

### Presentation change

WorldKind header copy is unchanged. Presentation only, existing tokens:

| | Before | After |
|---|---|---|
| Eyebrow | `text-ring/85`, tracking `0.38em` | `text-muted-foreground`, tracking `0.32em` |
| Supporting label | `text-muted-foreground` | `text-muted-foreground/70` |
| Header → plates gap | `spacing.lg` (24px) | `spacing.md` (16px) |

`ring/60` was tried first to match the 55–65% guidance. It remained the same cyan as WorldIdentity's `PRESENT` eyebrow and still read as a section title. Muted-foreground puts the header in the same family as destination plate eyebrows (`CONTINUUM` / `THRESHOLDS`). Header-to-plate gap now matches plate-to-plate gap, so the label belongs to the destination field.

No container, border, background, glow, or animation.

### Architecture impact

None. Header remains two informational `<p>` elements. No role, no tabIndex.

### Interaction impact

None. Region `role="button"`, tabIndex, aria-label, pointer/focus Focus, click/Enter/Space activation, URL arrival, click-away clear, focus scale, sibling opacity, and reduced-motion are untouched.

### Performance impact

Zero new assets, requests, dependencies, listeners, observers, timers, React state, or animation loops.

### Verification

- `tsc --noEmit` — clean
- Scoped ESLint on `world-kind.tsx` — clean
- `next build` — compiled successfully

### Visual QA

12 viewport × route combinations, plus keyboard focus, Enter, Space, click-away, reduced motion, and coarse pointer. All passed. Console errors 0. Horizontal scroll none. Focus ring unchanged. Kind still precedes Details on portrait.

### Manual changes required

None.

### Known limitations

The header is still two lines of copy. Quieting cannot make it disappear; it can only stop competing with identity and destinations.

### Rejected approaches

`text-ring/60` (still a cyan section title) · new tokens · WorldLayout edits · plate redesign · atmosphere · animation · making the header interactive.

---

## 2026-08-16 — Sprint-004 · Milestone-I · Task-009


**Task:** AetherAnime Secondary-Slot Spatial Integration

**Purpose:** Make WorldDetails read as contextual world information beside WorldKind destinations, not a second card/panel. Presentation only. No additional atmosphere.

**No new assets. No new dependencies. No new runtime state. No Focus ownership changes. No Registry architecture changes. No WorldEnvironment changes.**

WorldKind and WorldEnvironment were **not** modified. Tasks 005–008 remain closed.

### Files Changed

- `apps/web/widgets/world-details/world-details.tsx`
- `apps/web/widgets/world-details/world-details.types.ts`
- `apps/web/widgets/world-layout/world-layout.tsx`
- `apps/web/widgets/world-layout/world-layout.constants.ts`
- `apps/web/widgets/world-layout/index.ts`
- `docs/engineering/CHANGELOG.md`

### Architecture impact

None. WorldScene still owns Focus. WorldKind still presents destinations. WorldDetails still observes RegionScene only (`currentRegion` / `regionStatus`). No Surface chrome was added. No new accent system.

```
WorldScene (owns focusedRegion)
  → RegionScene derives currentRegion
  → WorldDetails renders caption + description
WorldLayout places Primary | Secondary
```

### WorldDetails presentation change

WorldDetails already had no border, radius, fill, or Surface. The second-card reading came from composition, not chrome:

- a centered `max-w-md` widget sitting independently in the right column
- `text-ring/70` displayName competing with RegionIdentity / destination language
- `lg:items-center` so the two slots floated as separate blocks
- mobile order putting Details above Kind (a second identity block before destinations)

Changes:

- Caption uses `text-muted-foreground` (neutral token, not ring)
- Desktop: left-aligned annotation (`lg:text-left`, `lg:items-start`, `lg:mx-0`, `lg:max-w-none`)
- Portrait: remains centered, `max-w-md`
- Copy, motion, RegionScene consumption, and idle/unknown/comingSoon/sealed states unchanged

### Relationship to WorldKind

WorldLayout is now one composition with a structural seam, not two cards:

- Shared top edge: `lg:items-start`
- Destinations first at every breakpoint (`order-1` / `order-2`)
- Hairline using `--border` at 20%: stacked `border-t`, desktop `border-l`
- Padding `spacing.md` (16px) between the rule and the annotation
- Column gap unchanged (`spacing.xl` / 32px)
- Flex share unchanged (`lg:flex-[3]` | `lg:flex-[2]`)

WorldDetails does **not** receive a Region edge, accent wash, marker, or focus scale.

Mobile order previously put Secondary before Primary (Sprint-003 Task-011). Task-009 restores Kind → Details so portrait matches the destination → context hierarchy. Ownership of slots is unchanged.

### Responsive behavior

| Viewport | Composition |
|---|---|
| 1440 / 1920 | columns, left rule, left-aligned context |
| 820 / 390 | stack Kind then Details, top rule, centered context |

No viewport JavaScript. No portrait assets.

### Accessibility

WorldDetails remains informational (`<p>` copy, no `role`, no `tabIndex`). Headings, reading order, labels, and Kind keyboard semantics are unchanged. Focus ring on destinations unchanged.

### Reduced motion

Existing enter + swap transitions preserved. `useReducedMotion` still disables translate on enter/swap. No new animation.

### Performance

- Zero new image requests (landscape 3, portrait 1)
- Zero new dependencies, listeners, timers, observers, React state

### Verification

- `tsc --noEmit` — clean
- Scoped ESLint on all five touched source files — clean
- `next build` — compiled successfully

### Visual QA

12 viewport × route combinations, plus keyboard focus, Enter activation, click-away clear, reduced motion, and coarse pointer. All passed.

| Check | Result |
|---|---|
| WorldIdentity hero | yes |
| WorldKind destinations | unchanged plates |
| WorldDetails contextual | muted caption, no chrome |
| No second-card / four-sided panel | yes |
| No new atmosphere | yes |
| Focus / keyboard / Enter | unchanged |
| Portrait Kind then Details | yes |
| Layout shift / H-scroll | none |
| Console errors | 0 |
| New image requests | 0 |

### A/B comparison

- **A:** Details was a centered ring-titled block, vertically centered beside Kind, and on mobile it appeared *above* destinations — a second identity/card column.
- **B:** Same copy, quieter caption, shared top edge, one hairline seam, Kind then context. Small pixel delta; the composition now reads destinations + annotation rather than cards + cards.

### Rejected approaches

New atmosphere / glow / halo / climate wash; new palette; glassmorphism; opaque panel; Region accent wash or focus scale on Details; Surface chrome; new animation; WorldKind or WorldEnvironment edits; full rectangular enclosure.

### Known limitations

- On 390×844 with a focused Region, expanded RegionIdentity plus WorldIdentity plus Kind plates push WorldDetails just below the fold (`top ≈ 912px`, viewport 844). RegionIdentity already shows the description at the top; Details remains available on scroll. Tightening identity to keep Details in-viewport would revisit Task-007 and was rejected.
- WorldDetails still repeats the focused region's displayName + description. That is existing RegionScene content, not a new model. It is now a caption, not a second title.

---

## 2026-08-16 — Sprint-004 · Milestone-I · Task-008


**Task:** AetherAnime Spatial Region Plate Integration

**Purpose:** Make Region plates read as destinations inside the world rather than interface cards placed over it. Presentation-only WorldKind refinement. No additional atmosphere.

**No new assets. No new dependencies. No new runtime state. No Focus ownership changes. No Registry architecture changes. No WorldEnvironment changes unless required for regression repair.**

WorldEnvironment was **not** modified. Tasks 005–007 remain closed.

### Files Changed

- `apps/web/widgets/world-kind/world-kind.tsx`
- `apps/web/widgets/world-kind/world-kind.constants.ts`
- `docs/engineering/CHANGELOG.md`

### Architecture impact

None. WorldKind still observes Scene Focus and renders Registry regions. WorldScene still owns Focus. Region accent still comes from `region.accent`. WorldEnvironment still does not know about plates.

```
WorldScene (owns focusedRegion)
  → WorldKind observes focusedRegion
  → resolveWorldRegions(status, world)
  → region.accent → WORLD_KIND_REGION_PLATE / WORLD_KIND_REGION_EDGE
```

### Plate presentation change

Removed the four-sided card chrome that made destinations read as UI:

- no visible border (transparent 1px reserved so layout does not shift)
- no `radius.md`
- no hex panel fill (`bg-[#080F1E]/45`)
- no focused `border-ring/70` wrapping the plate
- no `overflow-hidden`

Replaced with a leading-edge accent wash that dissolves before the trailing edge:

| Accent | Idle wash | Focused wash |
|---|---|---|
| `subtle` (World continuum) | `from-muted-foreground/8` → transparent at 62% | `from-muted-foreground/18` → transparent at 78% |
| `ring` (Thresholds ahead) | `from-ring/8` → transparent at 62% | `from-ring/20` → transparent at 78% |

Leading edge still uses `WORLD_KIND_REGION_EDGE`. Idle `w-px`; focused `w-0.5`. Edge is inset (`inset-y-2`) so it reads as a place marker, not a box stroke.

A first pass used `via-background/18` as a world-colour mid-stop. On portrait that formed a full-width rectangular band, and idle `ring` plates looked selected. The via-stop was rejected; the shared from→transparent wash is quieter on every viewport.

### Accent-token reuse

No `REGION_PLATE_COLORS`, no hex palette. Washes and edges map through existing `WorldRegionAccent` tokens (`neutral | subtle | ring | primary | muted`) onto `--muted-foreground`, `--ring`, `--border`, `--primary`.

### Focus behavior

Unchanged ownership and interaction:

- keyboard focus, click focus, URL arrival, click-away clear, Enter/Space activation
- semantic ring: `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`
- measured keyboard ring: `rgb(0, 245, 212)` 4px with `rgb(7, 11, 20)` 2px offset
- focused plate: existing `WORLD_FOCUS_SCALE` 1.02 + sibling opacity 0.52
- focused visual: brighter accent edge + longer wash — “this destination is here,” not a selected card

### Reduced-motion behavior

Existing `motion-reduce:transition-none` on plate colour, edge, and marker. Existing `worldKindRegionScale(..., reduceMotion)` stays at 1. Focused plate remains identifiable by edge width (2px) and wash without motion.

### Portrait behavior

Same treatment at 390×844 and 820×1180. No portrait assets, no viewport JS. Wash stops at 62%/78% so a full-width primary column does not become a solid bar.

### Performance

- Zero new image requests (landscape 3 environment assets, portrait 1 plate)
- Zero new dependencies, listeners, timers, observers, React state
- Colour transitions only (`duration-200`)

### Verification

- `tsc --noEmit` — clean
- Scoped ESLint on both touched source files — clean
- `next build` — compiled successfully

### Visual QA

12 viewport × route combinations, plus keyboard focus, Enter activation, click-away clear, reduced motion, and coarse pointer. All passed.

| Check | Result |
|---|---|
| WorldIdentity dominant | yes |
| Idle Regions subordinate | yes (opacity 1 idle; siblings 0.52 when focused) |
| Focused Region as destination | leading-edge wash + 2px accent, no box |
| Plates embedded | no radius, no four-sided border, environment visible through wash |
| Accent identity preserved | continuum = muted-foreground; thresholds = ring |
| Climate response preserved | Task-006/007 untouched |
| Focus ring unchanged | semantic ring measured |
| Keyboard / Enter | Focus + `?region=world-continuum` |
| Layout shift / H-scroll | none |
| Console errors | 0 |
| New image requests | 0 |

### A/B comparison

- **A** (Task-007): four-sided border, `radius.md`, hex fill, focused `border-ring/70` — a selected card on the world.
- **B** (Task-008): dissolving accent wash + inset leading edge. Small pixel delta on idle; large compositional change — destinations sit in the environment instead of on it.

The via-background mid-stop variant was an intermediate B that failed portrait (rectangular band) and idle hierarchy (ring wash looked focused). Rejected in favour of the shorter shared wash.

### Rejected approaches

New light/climate/glow layers; new palette / hex; glassmorphism; giant shadows; title/plate glow; pointer-following; parallax; scale-on-hover; animated cards; new runtime state; Focus or Registry architecture; WorldEnvironment edits; `via-background` mid-stop.

### Known limitations

- `worldKindAccentClass` / `worldKindFocusAccentClass` remain in `world-kind.motion.ts` but are no longer consumed (they were the four-sided border helpers). Left in place to avoid a motion-file drive-by.
- Idle `ring` plates still carry a quieter cyan leading edge by Registry accent. That is identity, not Focus.
- Existing 1.02 focus scale is unchanged. It is restrained, not a card lift.

---

## 2026-08-16 — Sprint-004 · Milestone-I · Task-007


**Task:** AetherAnime Destination-Aware World Identity Veil

**Purpose:** Make the existing identity veil acknowledge the same `destinationClimate` token as Task-006, so the title region settles into the destination without the title itself changing. Presentation refinement only.

**No new assets. No new dependencies. No Focus architecture changes. No Registry changes. No navigation changes. No new runtime state.**

### Files Changed

- `apps/web/widgets/world-environment/world-environment.tsx`
- `apps/web/widgets/world-environment/world-environment.constants.ts`
- `apps/web/widgets/world-environment/world-environment.types.ts`
- `docs/engineering/CHANGELOG.md`

WorldScene was **not** modified. The Task-006 `destinationClimate` bridge is reused as-is.

### Existing bridge

```
WorldScene (owns focusedRegion)
  → getRegion(id)?.climate ?? null
  → WorldEnvironment destinationClimate
  → destination atmosphere (Task-006)
  → identity atmosphere (Task-007, new)
  → identity veil (unchanged dark backing)
```

WorldEnvironment still does not read Focus, Registry, or URL.

### Identity veil implementation

The dark veil is unchanged:

`radial-gradient(ellipse 52% 38% at 50% 50%, rgba(3, 7, 17, 0.5) 0%, rgba(3, 7, 17, 0.26) 48%, transparent 78%)`

One additional decorative layer sits **under** it and **over** foreground architecture. Same veil ellipse, same `--primary` / `--ring` roles as Task-006, fill kept centred on the title (world-scale `fillAt` is ignored so this does not become a second world light). A single DOM node: opacity `0` when idle, `0.03` when a climate is present. Not four more climate layers.

Task-006's climate token table was extracted as `WORLD_ENVIRONMENT_CLIMATE_ROLE` so both washes share one mapping. Destination atmosphere strings are rebuilt from that table; visual behaviour is unchanged.

### Exact intensity

| | Destination atmosphere (Task-006) | Identity atmosphere (Task-007) |
|---|---|---|
| Opacity | 0.10 | **0.03** |
| Isolated coverage | 44.2% | **10.4%** |
| Isolated mean | 3.6/255 | **1.6/255** |
| Isolated max | 6.7/255 | **3.0/255** |

Weaker than Task-006 on every axis. Started at 0.03; pixel-diff showed it was perceptible under controlled comparison and not stronger than the destination wash, so it was not raised.

### Motion

- Opacity only, `DURATION.SLOW` (600ms) + `EASING.cinematic` — same transition string as Task-006
- Reduced motion: `motion-reduce:!transition-none`; focused appearance preserved
- Coarse pointer: Focus still drives the veil; Task-005 depth remains static (7.66 / 15.34 / 30.66 px)

### Portrait

Same semantic layer, no extra asset, no viewport JS. 390×844 and 820×1180 fetch only the portrait plate. Title remains readable; intensity was not reduced globally because portrait did not lose contrast.

### Performance

- Zero new image requests
- Zero new dependencies, listeners, timers, observers, React state
- One extra full-bleed gradient div, compositor opacity only

### Verification

- `tsc --noEmit` — clean
- Scoped ESLint on all three touched source files — clean
- `next build` — see below

### Visual QA

12 viewport × route combinations, plus keyboard focus, click-clear, reduced motion, and coarse pointer. All passed.

| Check | Result |
|---|---|
| Idle veil | `none`, opacity 0 |
| Continuum | `neutral` at 0.03 |
| Thresholds | `cool` at 0.03 |
| Keyboard focus | `neutral`; focus ring unchanged |
| Focus clear | returns to `none`, no stale tint |
| Title-region luma | idle 85.7 → continuum 90.1 → thresholds 95.3 (jump from Region UI, not the veil; isolated veil max is 3.0/255) |
| Parallax | unchanged |
| Extra image requests | none |
| Horizontal scroll / console | none |

### Known limitations

- A single identity layer cannot crossfade two climates; a climate-to-climate swap snaps the gradient while opacity stays at 0.03. At this intensity the snap is below perception; Task-006's four-layer wash is the visible settle.
- `warm` / `charged` are wired from the shared role table but unused by canonical AetherAnime Regions.
- The dark veil still dominates the title centre, by design.

### Rejected

- Recoloring WorldIdentity / Kind / Details, title glow, accent-on-title, panel, halo, spotlight
- Four additional climate DOM layers
- A new hex palette
- Framer Motion, pointer tracking, animated gradients, pulse, scale
- WorldEnvironment reading Focus or Registry
- Weakening the dark veil to expose more colour
- Raising identity opacity toward Task-006's 0.10

---

## 2026-08-16 — Sprint-004 · Milestone-I · Task-006

**Task:** AetherAnime Responsive Environmental Lighting

**Purpose:** Make the existing dimensional light acknowledge the focused Region, so the world feels aware of attention. Presentation only. No new scene engine, lighting system, climate engine, or Focus architecture.

**No new assets. No WebGL. No Three/R3F. No new dependencies. No new Focus/Registry architecture.**

### Files Changed

- `apps/web/widgets/world-environment/world-environment.tsx`
- `apps/web/widgets/world-environment/world-environment.constants.ts`
- `apps/web/widgets/world-environment/world-environment.types.ts`
- `apps/web/widgets/world-scene/world-scene.tsx`
- `docs/engineering/CHANGELOG.md`

`environment-depth.tsx` and `environment-plate-layer.tsx` were **not** touched. Task-005 depth is unchanged.

### Focus owner and presentation bridge

WorldScene already owns Focus. It derives a single presentation token from the focused Region's existing climate metadata via `getRegion` — the same helper RegionScene already uses for composition — and passes it down:

```
WorldScene (Focus owner)
  → destinationClimate: WorldClimate | null
  → WorldEnvironment (paints it)
```

WorldEnvironment does not read Focus, Registry, URL, Ambient, or any store. The prop is climate or `null`. Not a Region object. Not reducer state.

Canonical AetherAnime climates: `world-continuum` → `neutral`, `thresholds-ahead` → `cool`. Sealed system regions have no climate and stay at the neutral dimensional light — existing convention, not new status behaviour. URL arrival (`?region=`) uses the existing Focus handoff; the environment only sees the resulting token.

### Lighting implementation

Neutral `WORLD_ENVIRONMENT_DIMENSIONAL_LIGHT` is unchanged. One additional decorative layer sits immediately in front of it and behind foreground architecture / identity veil / UI:

| # | Layer |
|---|---|
| … | depth veil |
| | dimensional light (baseline, always on) |
| | **destination atmosphere (new)** |
| | foreground architecture |
| | identity veil → vignette → haze |
| | UI (WorldIdentity, Region plates, focus rings) |

Four stacked climate washes, one per `WORLD_CLIMATES` value. Only the matching climate is at peak opacity; the rest stay at 0. CSS opacity crossfade, no React state, no AnimatePresence, no new listener.

### Semantic driver

Region climate tokens `neutral | cool | warm | charged`, using the same `--primary` / `--ring` variables as `REGION_CLIMATE_GRADIENT`. RegionClimate's own gradient strings are a 12–18% color-mix built for a small presence slot; at world scale they measured a 2/255 ceiling even at opacity 0.28. The world wash therefore uses full-token radials shaped like the dimensional light, with layer opacity as the actual mix. No new hex values. No second palette object.

Token roles (match RegionClimate):

| Climate | Lead | Fill |
|---|---|---|
| neutral | `--primary` | — |
| cool | `--ring` | `--primary` |
| warm | `--primary` | `--ring` |
| charged | `--primary` | `--ring` (different fill position) |

### Motion

- Transition: `DURATION.SLOW` (600ms) + `EASING.cinematic`
- Property: opacity only
- Reduced motion: `motion-reduce:!transition-none` — focused colour still appears, immediately
- Coarse pointer: lighting still works (Focus is not pointer-driven); Task-005 depth stays static

### Performance

- Zero new image requests (landscape still 3 WebP, portrait still 1)
- Zero new dependencies, listeners, timers, observers, or React state inside WorldEnvironment
- Four extra full-bleed gradient divs, compositor opacity only

### Verification

- `tsc --noEmit` — clean
- Scoped ESLint on all four touched source files — clean
- `next build` — see below

### Visual QA

12 viewport × route combinations (1440×900, 1920×1080, 820×1180, 390×844 × idle, `?region=world-continuum`, `?region=thresholds-ahead`), plus keyboard focus, click-clear, reduced motion, and coarse pointer. All automated assertions passed.

| Check | Result |
|---|---|
| Idle climate token | `none`, all atmospheres at opacity 0 |
| Continuum arrival | `neutral` at 0.10 |
| Thresholds arrival | `cool` at 0.10 |
| Keyboard focus | lights `neutral` (first plate) |
| Focus clear | returns to `none`, no stale tint |
| Isolated A/B (thresholds on vs layer hidden) | 44.5% coverage, mean 3.6/255, max 7.0/255 |
| Continuum vs thresholds (full page) | 49.8% coverage, mean 5.7/255 — related, not identical |
| Parallax travel with focus | 7.66 / 15.34 / 30.66 px — identical to Task-005 |
| Reduced motion | focused colour present at 0.10, no transition |
| Coarse pointer | lighting `cool`, depth static |
| Extra image requests | none |
| Horizontal scroll / console errors | none |

### Known limitations

- `warm` and `charged` are implemented and ready but no canonical AetherAnime Region currently uses them, so they were not visually exercised beyond the token wiring.
- Destination light sits behind the identity veil and vignette, which is required so it cannot obscure the title. Those veils cap how strong the wash can read in the centre; raising opacity further would fight readability before it would read as “more aware.”
- RegionClimate's exact gradient strings could not be reused at face value (measured). The world wash inherits their token roles and fill positions instead.

### Rejected

- **WorldEnvironment reading Focus / Registry itself.** Violates presentation-only.
- **Passing the Region object or Focus reducer state.** Oversized API.
- **A new `REGION_LIGHT_COLORS` / hex palette.** Forbidden; existing `--primary` / `--ring` suffice.
- **Reusing `REGION_CLIMATE_GRADIENT` strings at 0.08–0.28 opacity.** Invisible (max 2–3.7/255).
- **Blend modes (`screen`, `soft-light`, `overlay`) on those strings.** Same ceiling.
- **Spotlight, pointer-tracking glow, plate halo, scale/pulse.** Forbidden by the brief.
- **Framer Motion / AnimatePresence for the crossfade.** Unnecessary; CSS opacity on stacked layers is enough.
- **WebGL / Three / R3F / new assets.** Not required.

---

## 2026-08-16 — Sprint-004 · Milestone-I · Task-005

**Task:** AetherAnime Multi-Plane Environmental Depth

**Purpose:** Add a genuine intermediate plane so the environment reads as layered while the pointer is stationary. Task-004's two planes only separated once the pointer moved; depth that requires motion to exist is an effect, not a space. Visual production only — no runtime, Registry, Focus, Lifecycle, Presence, Ambient, Navigation, activation, or Portal changes.

**No WebGL / Three / R3F was introduced.** The Task-004 CSS 2.5D architecture is reused unchanged.

### Files Changed

- `apps/web/public/assets/aetheranime/worlds/aetheranime/environment/aetheranime-depth-midground-landscape.webp` (new)
- `apps/web/shared/config/assets/aetheranime.assets.ts`
- `apps/web/shared/config/assets/index.ts`
- `apps/web/widgets/world-environment/world-environment.tsx`
- `apps/web/widgets/world-environment/world-environment.constants.ts`
- `docs/engineering/CHANGELOG.md`

`environment-depth.tsx`, `environment-plate-layer.tsx` and `world-environment.types.ts` were **not** touched. One pointer source already drove every layer and the layer component was already generic, so the new plane needed no new machinery — only a manifest entry, a transform, a treatment, and one call site.

### Layer Hierarchy

Back to front, as implemented:

| # | Layer | Kind |
|---|---|---|
| 0 | base | `#030711` fill |
| 1 | distance plate | orientation-aware image, depth 0–1 |
| 2 | **midground architecture** | **alpha image, depth 2 (new)** |
| 3 | depth veil | gradient |
| 4 | dimensional light | gradient |
| 5 | foreground architecture | alpha image, depth 3 |
| 6 | identity veil | gradient |
| 7 | vignette | gradient |
| 8 | foreground haze | gradient |

The midground sits *behind* the depth veil and dimensional light deliberately: the atmosphere settles over it, which is what places it in the distance rather than in front of it. All layers stay `aria-hidden` and `pointer-events-none` inside the existing decorative container; nothing was reordered relative to the UI.

### Parallax Amplitudes

Measured in-browser at 1920×1080 with a fine pointer, not asserted:

| Layer | Amplitude (half-travel) | Full sweep | % vw |
|---|---|---|---|
| distance | ±4px / ±2px | 7.66px | 0.40% |
| **midground** | **±8px / ±4px** | **15.34px** | **0.80%** |
| foreground | ±16px / ±9px | 30.66px | 1.60% |

Task-004's amplitudes are unchanged; the restraint was intentional and is kept. The planes are spaced ~2× apart so each reads as a distinct distance rather than one image sliding. Vertical stays damped throughout.

### Midground Asset

`1536×864` WebP with alpha, 15 KB, **5.6% coverage** — below the 10–25% target, deliberately. Two compact clusters of slender broken spires with a bridge-deck fragment, stepping *downward* toward frame centre so the silhouette falls away from the title rather than crowding it. Wider, higher-coverage variants were authored and measured worse (see Rejected): position and value carried the plane, area did not.

Composition was authored as fractional zones against where the UI actually sits — empty 0–21% and 79–100% (the foreground owns those), empty 39–61% across the full height (title, subtitle and Region plates), empty above 12% and below 82%. The mask is therefore scaled rather than cropped to 16:9; cropping would have slid every one of those bands.

Treatment: `blur(1.5px)`, `opacity(0.8)` — softer than the near layer, sharper than the plate. Lighting reuses `WORLD_ENVIRONMENT_DIMENSIONAL_LIGHT`; no new colour token was added for one image.

**The tone was chosen from measurement.** Sampling the composite where the spires land put the plate at luma 26–36 and the foreground at luma 9. Two earlier passes keyed the midground at luma 19–38 — the same value as the plate it sits on — and were invisible: 5.9/255 mean delta, confirmed by pixel diff. A midground only reads if the depth ramp stays monotonic (near darkest, far lightest), so the asset is keyed `#060c1c → #0d1730` to composite into the gap at luma ~16–24. The gradient runs opposite to the foreground: tips darker against the void, bases lightening until they are within a few luma of the plate and dissolve into it.

### Manifest

Extended in place; no second resolver, no runtime discovery, no dynamic import:

```
environment: landscape, portrait, depth: { midground, foreground }
```

`Pick<OrientedPlate, 'landscape'>` was named `LandscapeDepthLayer` now that two layers share it, and the shared portrait rationale moved onto that type. `EnvironmentDepthLayers` keys are ordered far → near, matching composite order.

### Portrait Decision

**Omitted, and portrait remains byte-identical to Task-003.** The Task-004 reasoning holds unchanged: coarse pointers get no parallax, so the layer buys no depth, and a tall frame leaves nowhere for extra architecture except behind the subtitle and Region plates. Verified by request log — 820×1180 and 390×844 fetch only `aetheranime-world-portrait.webp` on all three routes. The landscape-only layers resolve to an inline transparent pixel, so portrait costs zero extra requests rather than downloading something it would hide.

### Performance Impact

- **+1 static image request on landscape (15 KB).** Nothing on portrait.
- No new dependency, canvas, WebGL, shader, observer, timer, animation loop, or pointer listener. The existing single passive rAF-coalesced listener drives all three planes; the new one added no runtime cost beyond compositing one more transformed image.
- No React state, no per-frame render, transform-only.

### Verification

- `tsc --noEmit` — clean.
- Scoped ESLint on all four touched source files — clean.
- `next build` — see below.

### Visual QA

12 viewport × route combinations (1440×900, 1920×1080, 820×1180, 390×844 × idle, `?region=world-continuum`, `?region=thresholds-ahead`), plus pointer left/centre/right, keyboard focus, reduced motion and coarse pointer. All automated assertions passed:

| Check | Result |
|---|---|
| Horizontal scroll | None, all 12 combinations |
| Console / page errors | Zero, all 12 combinations |
| Landscape requests midground | Yes, all 6 landscape combinations |
| Portrait requests any depth layer | No, all 6 portrait combinations |
| Parallax ordering far < mid < near | 0.40% < 0.80% < 1.60% vw |
| Travel within 0.5–2% envelope | Yes |
| `prefers-reduced-motion` | All three planes measured 0px |
| Coarse pointer | All three planes measured 0px |

Judged by A/B pixel diff and stacked comparison against the midground hidden: the stationary composition now reads far → middle → near at both landscape viewports. Title, subtitle, Region plates, focused Region identity and the keyboard focus ring all remain readable; the plane passes behind the translucent plates and, being darker than the plate, slightly *raises* contrast on their white text.

### Known Limitations

- The plane reads more strongly at 16:9 than at 16:10. `object-cover` crops the 16:9 asset horizontally at 1440×900, expanding content outward by ~5% per side toward the darker flanks. Mitigated by concentrating the tall masses at 23–33% and 68–75% so they stay in the visible corridor at both aspects; not eliminated. A 16:10 companion plate would fix it and is not worth a second asset yet.
- Coverage is 5.6% against a 10–25% brief target. Held deliberately — the calm centre and correct placement mattered more, and the wider variants measured worse.
- The plate is itself a detailed painting with its own architecture, so the midground only reads cleanly in its emptier haze regions. This bounds how much further architecture can be layered before the scene muddies.
- The pre-existing reduced-motion hydration mismatch from Task-002 is untouched and unaffected.

### Rejected

- **Wide-spread spire field (10.4% coverage).** Groups landed at 6–30% and 63–93%, the same screen area the foreground layer and vignette already own, so it was occluded rather than subordinate.
- **Outermost-tallest arrangement (6.4%).** Put the tall masses at the outer edge of each group, where the 16:10 crop pushed them behind the foreground arches. Read at 1920, nearly vanished at 1440.
- **Atmospheric-perspective tone (lighter/bluer than the foreground).** Physically motivated but measured identical in value to the plate, so it composited to nothing. Corrected by measurement, not by raising opacity until something appeared.
- **Portrait midground.** See above.
- **Any WebGL / Three / R3F path.** Not considered; CSS already composites image planes for free.

---

## 2026-08-16 — Sprint-004 · Milestone-I · Task-004

**Task:** AetherAnime Dimensional Environment Foundation

**Purpose:** Give the environment a real near plane so the world reads as continuing behind the interface. Implemented as 2.5D layered depth, not a 3D scene. No runtime, Registry, Focus, Lifecycle, Presence, Ambient, Navigation, activation, or Portal changes; the environment stays presentation-only.

### Files Changed

- `apps/web/public/assets/aetheranime/worlds/aetheranime/environment/aetheranime-depth-foreground-landscape.webp` (new)
- `apps/web/shared/config/assets/aetheranime.assets.ts`
- `apps/web/shared/config/assets/index.ts`
- `apps/web/widgets/world-environment/environment-depth.tsx` (new)
- `apps/web/widgets/world-environment/environment-plate-layer.tsx` (new)
- `apps/web/widgets/world-environment/world-environment.tsx`
- `apps/web/widgets/world-environment/world-environment.constants.ts`
- `apps/web/widgets/world-environment/world-environment.types.ts`
- `docs/engineering/CHANGELOG.md`

### Dimensional Approach

- 2.5D layered composition. Back to front: base, distance plate, depth veil, dimensional light, **near architecture (new)**, identity veil, vignette, haze.
- The near layer is separately authored artwork with its own alpha, not the plate repeated at another scale. A duplicated plate only ever reads as a blurred double.
- Depth is carried by the *difference* in travel: across the **full pointer sweep, edge to edge**, the distance plate moves 7.7px (0.40% vw at 1920) and the near layer 30.7px (1.60% vw), leaving a 23px differential. Both inside the intended 0.5–2% envelope. The constants express this as half-travel amplitude (±4px and ±16px) because the pointer normalises to -1..1; the figures above are twice those, which is what a viewer actually sees. *(Unit clarified in Task-005 — the amplitudes themselves are unchanged.)*
- **No Three.js / R3F / WebGL.** `three`, `@react-three/fiber` and `@react-three/drei` are declared dependencies but are imported nowhere in source, so using them would have been net-new WebGL, not reuse. With no GLB asset to place (see below) the only thing to render would have been image planes, which CSS already composites for free.

### Architecture Decisions

- Manifest extended in place: `environment.depth.foreground`. Still static, typed, deterministic; no registry, discovery, or fetch layer. `OrientedPlate` factored out and reused.
- `EnvironmentDepth` (client) is the only moving part. It publishes `--depth-x` / `--depth-y` in -1..1 on one container; layers decide in CSS how far to respond. No React state, so pointer movement never renders — per frame it is two `setProperty` calls, rAF-coalesced.
- Both custom properties default to 0, so every layer composes correctly before hydration, without JavaScript, and in all fallbacks.
- `EnvironmentPlateLayer` carries the `<picture>` + transform + overscan pattern for both image layers. Translated layers overscan 3%; a layer fitting exactly would expose the scene base along one edge as it shifts.

### Assets

- Foreground silhouette generated as a two-tone stencil, then keyed offline: alpha from the stencil, a vertical near-black stone gradient for fill, and a faint cold rim derived from `alpha - blur(alpha)` so the profile separates from the already-dark plate edge behind it.
- 1536×864 WebP with alpha, 19 KB, 24% coverage. Slightly defocused in CSS (`blur(3px)`, 92% opacity): the focal plane is the distance where the title sits, so a hard-edged near cutout read as pasted.

### Rejected

- **Portrait near layer.** Authored, keyed, shipped to the browser, and removed after visual QA. Portrait viewports are reached by coarse pointers, which get no parallax, so it bought no depth; and with the interface filling a tall frame it had nowhere to sit except behind the subtitle and Region plates, where it read as a smudge. Portrait is now byte-identical to Task-003.
- **3D geometry.** Not generated — the toolchain is genuinely unavailable here, not skipped. See Known Limitations.

### Fallback Behaviour

The orientation plate is the canonical visual, and every failure path lands on it with the composition still complete:

| Condition | Behaviour |
|---|---|
| No JavaScript / pre-hydration | Layers at rest; custom properties default to 0 |
| `prefers-reduced-motion` | Listener never attached; measured 0px travel |
| Coarse pointer (touch) | Listener never attached; measured 0px travel |
| Portrait orientation | No near layer; inline transparent pixel, zero requests |
| Near asset fails to load | Empty `alt`, decorative; plate composition unaffected |
| WebGL unavailable | Not applicable — none used |

### Performance Impact

- No new npm dependencies; no canvas, WebGL, Three.js, R3F, shaders, physics, post-processing, or particles.
- Landscape adds one 19 KB request. Portrait adds none — the near layer resolves to an inline data URI rather than downloading an asset it would only hide.
- Pointer work is one passive listener, coalesced to one frame, writing two custom properties on one element. Transform-only, compositor-friendly, no layout or paint. No per-frame React work and no viewport state.

### Verification

- `tsc --noEmit` — pass
- `eslint shared/config/assets widgets/world-environment --report-unused-disable-directives` — pass
- `npm run build` — pass
- Console: zero errors/warnings in normal mode. Under reduced motion, only a Framer Motion notice and the pre-existing `useReducedMotion` hydration mismatch carried from Task-002; `EnvironmentDepth` writes nothing during render and cannot contribute to it.
- Browser QA at 1440×900, 1920×1080, 820×1180, 390×844 across idle, `?region=world-continuum`, `?region=thresholds-ahead`, plus reduced-motion and touch emulation: no horizontal scroll, no layout shift, no edge gap at full deflection, title and plates readable, focus ring intact.

### Known Limitations

- Depth exists in landscape only. Portrait keeps the Task-003 static composition.
- The near layer is a flat silhouette, so it parallaxes as a plane; a raking pointer will not produce internal occlusion the way real geometry would.
- Depth response requires a fine pointer. Touch and reduced-motion users get a correct but static composition — deliberate, but it means most mobile users never see the parallax.
- No 3D asset generation was performed. TRELLIS/TRELLIS.2/Hunyuan3D-2/TripoSR all need PyTorch + a CUDA toolchain; this machine has an RTX 4060 (8 GB) and driver 581.08 but no `torch`, no `nvcc`, Python 3.14.4 (no torch wheels published for 3.14), no Blender, and no model checkout. Reported as a manual step rather than faked.

---

## 2026-08-16 — Sprint-004 · Milestone-I · Task-003

**Task:** AetherAnime Orientation-Aware Environment Art Direction

**Purpose:** Give portrait viewports an intentionally composed environment instead of a hard crop of the 16:9 master. Browser measurement found a second, larger defect underneath the cropping: `next/image` sizes from viewport *width*, so a `sizes="100vw"` plate under `object-cover` in a tall container resolved to a 390×219 file painted into 390×850 (and 820×461 into 820×1180) — a ~4× upscale that erased every silhouette. Orientation now selects between two authored plates. No runtime, Registry, Focus, Lifecycle, Presence, Ambient, Navigation, activation, or Portal changes.

### Files Changed

- `apps/web/public/assets/aetheranime/worlds/aetheranime/environment/aetheranime-world-portrait.webp` (new)
- `apps/web/shared/config/assets/aetheranime.assets.ts`
- `apps/web/shared/config/assets/index.ts`
- `apps/web/widgets/world-environment/world-environment.tsx`
- `apps/web/widgets/world-environment/world-environment.constants.ts`
- `docs/engineering/CHANGELOG.md`

### Architecture Decisions

- Extend the existing Task-001 manifest rather than add a resolver: `environment.hero` becomes `environment.landscape` + `environment.portrait`, typed as `EnvironmentPlates`. Still static, local, deterministic; no registry, fetch layer, or discovery.
- Keep the Task-001 filename `aetheranime-world-hero.webp` for the landscape master so the Task-001 entry stays accurate; the manifest carries the orientation meaning.
- Select the plate with `<picture><source media="(orientation: portrait)">`. The browser resolves it before layout, so there is no viewport React state, no listener, and no hydration branch.
- Trade `next/image` for a raw `<img>` inside `<picture>`. `next/image` renders one `<img>` and cannot swap sources on a media query, and its width-only heuristic is what caused the upscale. Both plates are pre-optimised static WebP, so the optimiser had nothing left to contribute. Intrinsic `width`/`height` are declared on both sources.
- Grade per orientation on one element via a `portrait:` variant. The landscape lift (`brightness 1.34`) flattens the portrait plate's large hazy calm band into a uniform violet wash, so portrait uses `brightness 1.3 / contrast 1.2`. Landscape values are untouched.

### Asset

- Portrait companion generated offline from the landscape master as a visual reference, then hand-reviewed against the art gate: same world, no text, logo, watermark, characters, circular portal, or UI.
- Authored 2:3 at 1280×1920, WebP q80, 27 KB (landscape master is 82 KB). 2:3 rather than a literal 9:16 crop: the plate reserves the outer ~15% of each edge as empty void so a 390px viewport crops there instead of into the architecture.
- Composition bands: void → monumental broken tower (left of centre, top quarter) → large empty calm centre → distant sunken ruin field → dark foreground fragments. The calm band is where identity, subtitle and Region plates land.

### Visual / UX Impact

- Portrait gains real architecture, depth and horizon; previously a featureless blue-black smear at 390×844.
- Landscape at 1440×900 and 1920×1080 is unchanged.
- No change to WorldIdentity, WorldKind, RegionScene, RegionIdentity, RegionActivities, or the climate layers.

### Motion Impact

- None. No transitions, transforms, parallax, or animated filters added; reduced-motion branches untouched.

### Performance Impact

- One static local plate per orientation; the browser downloads only the matching `<source>`.
- Portrait payload drops from an upscaled optimiser round-trip to a 27 KB static file, and the image optimiser is no longer invoked for the environment at all.
- Intrinsic dimensions on both sources keep aspect reserved; no CLS. `fetchPriority="high"` preserves early discovery. No canvas, WebGL, R3F, shaders, observers, or per-frame work.

### Verification

- `tsc --noEmit` — pass
- `eslint shared/config/assets widgets/world-environment --report-unused-disable-directives` — pass
- `npm run build` — pass
- Browser QA at 1440×900, 1920×1080, 820×1180, 390×844 across idle, `?region=world-continuum`, `?region=thresholds-ahead`: correct plate per orientation, native resolution (no upscale), no horizontal scroll, no black band, readable title/plates/focus state.

---

## 2026-08-15 — Sprint-004 · Milestone-I · Task-002

**Task:** AetherAnime World Composition — Visual Integration Pass

**Purpose:** Make `/world/aetheranime` read as one world composition instead of centered content over a background plate. Browser inspection found the environment could never reach the viewport: `WorldEnvironment` lives in the Shell presence slot, and RegionScene stacks Region identity/activities above the Shell, so the artwork started 181px down under a bare black band. Task-001 artwork and asset pipeline reused unchanged; no runtime, Registry, Focus, Lifecycle, Presence, Navigation, or activation changes.

### Files Changed

- `apps/web/app/layout.tsx`
- `apps/web/app/globals.css`
- `apps/web/shared/lib/graphics/legibility.ts` (new)
- `apps/web/shared/lib/graphics/index.ts`
- `apps/web/widgets/experience-layout/experience-layout.tsx`
- `apps/web/widgets/world-scene/world-scene.tsx`
- `apps/web/widgets/world-shell/world-shell.tsx`
- `apps/web/widgets/world-layout/world-layout.tsx`
- `apps/web/widgets/world-layout/world-layout.constants.ts`
- `apps/web/widgets/world-identity/world-identity.tsx`
- `apps/web/widgets/world-identity/world-identity.constants.ts`
- `apps/web/widgets/world-environment/world-environment.tsx`
- `apps/web/widgets/world-environment/world-environment.constants.ts`
- `apps/web/widgets/world-kind/world-kind.tsx`
- `apps/web/widgets/world-kind/world-kind.constants.ts`
- `apps/web/widgets/world-details/world-details.tsx`
- `apps/web/widgets/world-details/world-details.constants.ts`
- `apps/web/widgets/region-identity/region-identity.tsx`
- `apps/web/widgets/region-identity/region-identity.constants.ts`
- `apps/web/widgets/region-activities/region-activities.tsx`
- `docs/engineering/CHANGELOG.md`

### Architecture Decisions

- `WorldEnvironment` + `WorldClimate` promoted from the Shell presence slot to a scene-wide `world-scene-atmosphere` layer so the environment spans the whole scene. `RegionClimate` stays in the presence slot — subordinate to WorldClimate and scoped to the stage. Composition only; the `presence` slot API and every reducer are untouched.
- Three defects fixed at their source rather than worked around: the Shell forced `min-h-full` below a stacked Region band and overflowed a clipped container (regions unreachable); `ExperienceLayout` used `overflow-hidden`, which blocked the vertical scroll needed to recover them; and the `--font-geist-*` variables were set on `<body>` while `font-sans` applied to `<html>`, so every surface rendered in the browser serif default.
- `legibility` added to the Graphics foundation — neutral text shadow for copy sitting directly on artwork. Distinct from `glow` (brand light); no new token system.

### Visual Impact

- Environment is continuous from the viewport top; the detached black band above the world is gone.
- World identity carries the composition: display-scale title, uppercase ruled eyebrow, geometric emblem, gradient accent, wider subtitle measure.
- Idle `RegionIdentity` collapses to a quiet tethered marker (opacity 0.45) so it no longer reads as a second hero; focused regions expand to full identity with their registry accent.
- Regions render as spatial plates — translucent deep-blue fill, accent leading edge, region eyebrow + name, edge brightening on hover/Focus — instead of bordered text boxes.
- Artwork grade lifted (`brightness 1.34 / contrast 1.02 / saturate 1.12`) and the depth veil lightened so the flanking architecture reads instead of crushing to black. Stage widened `max-w-2xl` → `max-w-5xl`, desktop split rebalanced 3:2.

### Motion Impact

- None. No new animations, loops, or transitions; existing mount/Focus motion and all reduced-motion branches unchanged. Plate hover/Focus uses CSS `transition-colors` on border and accent edge only.

### Performance Impact

- No new assets, dependencies, or runtime work. Same single priority WebP; added layers are static CSS gradients, one static image filter, and text shadows.

### Breaking Changes

- None. `WorldScene`'s `presence` prop now overrides only the stage-level presence layer; the scene environment is always composed. No caller passes it.

### Limitations

- The 16:9 plate is cropped hard at portrait aspect ratios, so tablet/mobile lose the flanking architecture and show the artwork's own dark sky. Needs a portrait art-direction plate, not a CSS fix.
- Pre-existing reduced-motion hydration warning (`useReducedMotion()` resolves client-side only) is unchanged; present in the Task-001 baseline.

### Verification

- `tsc --noEmit` — pass
- scoped eslint on all touched surfaces — pass
- `next build` — pass (single production build)
- Browser QA at 1440×900, 1920×1080, 820×1180, 390×844: idle, hover, keyboard focus, `?region=` arrival for both regions, reduced motion. No horizontal scroll and every region plate reachable at all viewports; `role`/`aria-label`/`tabIndex` and Enter-to-activate confirmed intact.

---

## 2026-08-14 — Sprint-004 · Milestone-I · Task-001

**Task:** AetherAnime Visual Production Foundation

**Purpose:** Establish production asset convention under `public/assets/aetheranime` with a typed static manifest; ship one 1536×864 WebP environment plate (~84KB) and a presentation-only `WorldEnvironment` layered composition in WorldScene. Direct stacking/frame fixes in WorldLayout and WorldScene make the presence environment full-width and visible. Ownership of World/Region/Focus/Navigation/Portal unchanged; no runtime AI/API/dependency.

### Files Changed

- `apps/web/shared/config/assets/aetheranime.assets.ts` (new)
- `apps/web/shared/config/assets/index.ts` (new)
- `apps/web/public/assets/aetheranime/worlds/aetheranime/environment/aetheranime-world-hero.webp` (new)
- `apps/web/widgets/world-environment/world-environment.tsx` (new)
- `apps/web/widgets/world-environment/world-environment.constants.ts` (new)
- `apps/web/widgets/world-environment/world-environment.types.ts` (new)
- `apps/web/widgets/world-environment/index.ts` (new)
- `apps/web/widgets/world-scene/world-scene.tsx`
- `apps/web/widgets/world-layout/world-layout.tsx`
- `docs/engineering/CHANGELOG.md`

### Architecture Decisions

- Presentation-only environment layer; World/Region/Focus/Navigation/Portal ownership unchanged.
- Typed static manifest; no runtime AI, API, or new dependency.
- One priority local WebP + static CSS layers; no canvas, WebGL, video, loops, or environment state.

### Visual Impact

- Desktop/mobile reduced-motion screenshots visually passed; richer navy/cyan environment; UI readable.
- Pre-existing mobile copy overflow noted (unchanged).

### Performance Impact

- Single priority local WebP; static CSS composition only.

### Breaking Changes

- None.

### Limitations

- Only one environment plate; no video/GLB/portal production assets yet.

### Future Dependencies

- Asset-backed emblem/region landmarks or Portal asset pass.

### Verification

- `tsc --noEmit` · scoped eslint — pass (implementation/QA)
- `next build` — pass (single production build)

---

## 2026-08-14 — Sprint-003 · Milestone-II · Task-015

**Task:** History → Focus Handoff

**Purpose:** One-directional navigation-arrival → Focus when validated `initialRegionId` changes on a mounted WorldScene (same-route `?region=`, Back, Forward). No URL ↔ Focus sync.

### Files Changed

- `apps/web/widgets/world-scene/world-scene.tsx`
- `apps/web/widgets/world-scene/world-scene.types.ts`
- `apps/web/widgets/world-scene/world-scene-navigation.tsx`
- `docs/engineering/CHANGELOG.md`

### Architecture Decisions

- `handoffNavigationFocus` distinct from transient `dispatchFocus`; uses Focus reducer only.
- Arrival identity tracked via ref; handoff once per distinct validated prop change.
- No-region arrival (`initialRegionId` → undefined) clears navigation-derived Focus; unchanged null arrival does not clear transient hover Focus.
- Handoff never calls router; Focus never writes URL. Task-012 server validation unchanged.

### Navigation / History / Focus Impact

- Direct deep-link still seeds Focus via useState initializer.
- Same-route A→B / Back / Forward update Focus when route re-passes validated `initialRegionId`.
- Hover still Focus-only; activation still Task-014 `router.push`.

### Performance Impact

- One Focus handoff per distinct arrival identity. No polling, history listeners, or stores.

### Breaking Changes

- None.

### Future Dependencies

- Optional committed-region presentation; portal destination coverage beyond Focus handoff.

### Verification

- `tsc --noEmit` · eslint · `next build` — pass

---

## 2026-08-13 — Sprint-003 · Milestone-II · Task-014

**Task:** Region Activation → URL / History Contract

**Purpose:** Validated `WorldRegionActivationIntent` commits via `worldHrefFromActivation` + `router.push`. Focus never mutates URL. Same canonical destination is a no-op.

### Files Changed

- `apps/web/shared/lib/navigation/world-navigation-commit.ts` (new)
- `apps/web/shared/lib/navigation/index.ts`
- `apps/web/widgets/world-scene/world-scene-navigation.tsx` (new)
- `apps/web/widgets/world-scene/index.ts`
- `apps/web/app/world/[destination]/page.tsx`
- `docs/engineering/CHANGELOG.md`

### Architecture Decisions

- `WorldSceneNavigation` client adapter owns router; WorldScene unchanged.
- `matchesCurrentWorldHref` prevents duplicate history for same region.
- Task-012 server arrival validation preserved; no Focus/searchParams sync effects.

### Navigation / History / Focus Impact

- Activation → push `/world/{slug}?region={id}`. Hover/focus → no URL change.
- Back/Forward updates URL per browser history; Focus reinit depends on App Router remount (not forced).

### Performance Impact

- One navigation request per distinct activation. No stores, polling, or sync effects.

### Breaking Changes

- None.

### Future Dependencies

- Explicit Back/Forward ↔ Focus handoff if same-route param navigation preserves WorldScene instance.

### Verification

- `tsc --noEmit` · eslint · `next build` — pass

---

## 2026-08-13 — Sprint-003 · Milestone-II · Task-013

**Task:** Region Activation / Commit Engine

**Purpose:** Explicit `activateRegion` boundary distinct from transient Focus. WorldKind click/Enter/Space commits intent via validated callback; no URL/history mutation.

### Files Changed

- `apps/web/shared/world/world.activation.ts` (new)
- `apps/web/shared/world/index.ts`
- `apps/web/widgets/world-scene/world-scene.types.ts`
- `apps/web/widgets/world-scene/world-scene.tsx`
- `apps/web/widgets/world-kind/world-kind.tsx`
- `docs/engineering/CHANGELOG.md`

### Architecture Decisions

- `resolveWorldRegionActivation` — pure validation (exists, world-owned, interactive).
- WorldScene exposes `activateRegion` + optional `onRegionActivate`; no second persistent Region store.
- Hover/focus → `dispatchFocus` only; explicit input → `activateRegion`.

### Interaction / Accessibility / UX Impact

- Focus visuals unchanged (attention). Activation via semantic button + aria-label.
- Removed `aria-pressed` tied to Focus. No router/URL side effects.

### Performance Impact

- Event-driven validation only. No timers, stores, or sync loops.

### Breaking Changes

- None.

### Future Dependencies

- Activation → URL/history synchronization (Task-014+).

### Verification

- `tsc --noEmit` · eslint · `next build` — pass

---

## 2026-08-13 — Sprint-003 · Milestone-II · Task-012

**Task:** Initial Region Arrival / Focus Handoff

**Purpose:** World route validates optional `?region=` against resolved World ownership and availability; WorldScene applies one-time initial Focus via `initialRegionId`.

### Files Changed

- `apps/web/shared/world/world.region.helpers.ts`
- `apps/web/shared/world/index.ts`
- `apps/web/app/world/[destination]/page.tsx`
- `apps/web/widgets/world-scene/world-scene.types.ts`
- `apps/web/widgets/world-scene/world-scene.tsx`
- `docs/engineering/CHANGELOG.md`

### Architecture Decisions

- Route resolves arrival intent server-side; WorldScene owns runtime Focus.
- `resolveInitialRegionFocus` — exists, world-owned, interactive only.
- One-time handoff via `useState` initializer — no URL sync, no router mutation.

### Navigation / Focus / UX Impact

- `/world/{slug}` unchanged. Valid deep-link focuses Region; invalid/cross-world/unavailable rejected silently.
- User `dispatchFocus` after arrival is not overwritten by URL.

### Performance Impact

- Synchronous O(1) validation on server. No effects, timers, or stores.

### Breaking Changes

- None.

### Future Dependencies

- URL ↔ Focus synchronization; browser-history semantics.

### Verification

- `tsc --noEmit` · eslint · `next build` — pass

---

## 2026-08-13 — Sprint-003 · Milestone-II · Task-011

**Task:** Region-Aware Navigation Contract

**Purpose:** Canonical `WorldNavigationTarget` preserves world + optional `regionId` through `worldHref`. Region-only portal metadata resolves owning world via Registry; label-only remains non-executable.

### Files Changed

- `apps/web/shared/lib/navigation/world-navigation-target.ts` (new)
- `apps/web/shared/lib/navigation/world-transition.ts`
- `apps/web/shared/lib/navigation/index.ts`
- `apps/web/shared/world/world.region.portal.ts`
- `apps/web/widgets/region-activities/region-activity.execution.ts`
- `docs/engineering/CHANGELOG.md`

### Architecture Decisions

- Navigation owns destination normalization, URL encoding (`?region=`), and region ownership lookup.
- `resolvePortalDestination` marks regionId-only metadata executable; Navigation resolves or fails safely.
- RegionActivities unchanged at render layer — still `Link` + capability adapter only.

### Navigation / UX Impact

- World-only hrefs unchanged. World + region hrefs preserve both identities in query metadata.
- Unknown regionId → unavailable. Thresholds label-only portal unchanged.

### Performance Impact

- Synchronous pure resolution. No stores, effects, or subscriptions.

### Breaking Changes

- None. String `worldHref(slug)` callers unchanged.

### Future Dependencies

- Task-012: consume `region` query on World route for Focus handoff.

### Verification

- `tsc --noEmit` · eslint · `next build` — pass

---

## 2026-08-13 — Sprint-003 · Milestone-II · Task-010

**Task:** Region Activity Execution & Portal Destination Handoff

**Purpose:** First executable Region activity (`portal`) resolves concrete `portalDestinations` and hands off via existing `worldHref` + `Link`. Label-only destinations never navigate.

### Files Changed

- `apps/web/shared/world/world.region.portal.ts` (new)
- `apps/web/shared/world/index.ts`
- `apps/web/widgets/region-activities/region-activity.execution.ts` (new)
- `apps/web/widgets/region-activities/region-activities.tsx`
- `apps/web/widgets/region-activities/index.ts`
- `docs/engineering/CHANGELOG.md`

### Architecture Decisions

- Pure `resolvePortalDestination` (no navigation side effects).
- Capability adapter: executable / unavailable / unsupported.
- Handoff: `Link` + `worldHref` — no `router.push`, no PortalCTA, no RegionScene state.

### Interaction / UX Impact

- Only executable portal activities become links; others stay non-interactive spans.
- Thresholds-ahead label-only portal remains non-executable.

### Performance Impact

- Event-driven; synchronous resolution. No timers/observers/stores.

### Breaking Changes

- None.

### Future Dependencies

- regionId-only destinations; explore/lore/media handlers; destination picker.

### Verification

- `tsc --noEmit` · eslint · `next build` — pass

---

## 2026-08-13 — Sprint-003 · Milestone-II · Task-009

**Task:** Impossible Threshold · Cinematic Visual Fidelity

**Purpose:** Visual fidelity pass on PortalGeometry — monumental fracture silhouette, geological stone, cyan-led seam, deeper singularity, atmospheric depth. Architecture and motion budget unchanged.

### Files Changed

- `apps/web/widgets/portal-cta/portal-geometry.constants.ts`
- `apps/web/widgets/portal-cta/portal-geometry.tsx`
- `apps/web/widgets/portal-cta/portal-cta.motion.ts` (seam luminance targets only)
- `docs/engineering/CHANGELOG.md`

### Architecture Decisions

- PortalCTA / Gravity / Particles / Crossing / phases untouched in ownership.
- Static atmosphere + plate-edge overlays (no new ambient loops).
- Material fills centralized in `PORTAL_MATERIAL` (theme tokens only).

### Visual / Motion / UX Impact

- Stronger vertical asymmetry; cyan→blue→violet seam hierarchy; near-black singularity with cyan rim.
- Seam idle/phase opacity slightly denser; still ≤ two continuous loops.

### Performance Impact

- Transform/opacity only. Two static DOM overlays. No canvas/WebGL/filters/physics.

### Breaking Changes

- None.

### Future Dependencies

- Optional art-directed texture system later without geometry redesign.

### Verification

- `tsc --noEmit` · eslint · `next build` — pass
- Visual QA: SSR `/` includes portal-atmosphere / seam / singularity / plates; interactive phase hover/crossing not exercised in this environment

---

## 2026-08-13 — Sprint-003 · Milestone-II · Task-008

**Task:** Region Activities Presentation

**Purpose:** Expose canonical `WorldRegionDefinition.activities` tokens via RegionScene as a restrained, non-interactive activity rail. No navigation or activity execution.

### Files Changed

- `apps/web/widgets/region-activities/` (new)
- `apps/web/widgets/region-scene/region-scene.tsx`
- `apps/web/widgets/region-scene/region-scene.types.ts`
- `docs/engineering/CHANGELOG.md`

### Architecture Decisions

- Activities from RegionScene only; token → label map is presentation config.
- RegionScene: Identity → Activities → Shell children.
- Hidden when none/unknown/empty activities; subdued for comingSoon/sealed.

### Visual / UX Impact

- Compact wrapping label rail (underline, not cards/buttons).

### Performance Impact

- One-shot AnimatePresence swap. No loops, timers, Registry, or Focus reads.

### Breaking Changes

- Optional `activities` slot on RegionScene (default RegionActivities).

### Future Dependencies

- Activity execution / Portal destinations remain later tasks.

### Verification

- `tsc --noEmit` · eslint · `next build` — pass
- Visual QA: SSR `/world/aetheranime` includes `region-activities-host` with Identity/Climate/Details; client focus swap not exercised in this environment

---

## 2026-08-13 — Sprint-003 · Milestone-II · Task-007

**Task:** Region Climate Engine

**Purpose:** Restrained Region-level atmospheric emphasis from `currentRegion.climate` via RegionScene. Layers above WorldClimate in the presence slot; one-shot opacity crossfade only.

### Files Changed

- `apps/web/widgets/region-climate/` (new)
- `apps/web/widgets/world-scene/world-scene.tsx`
- `docs/engineering/CHANGELOG.md`

### Architecture Decisions

- Presence default: `<WorldClimate /><RegionClimate />` (World intact; Region additive).
- Climate map: `neutral | cool | warm | charged` → theme-token gradients.
- Status opacity: none=0, ready≈0.52, subdued for comingSoon/sealed/unknown.
- No continuous loops; no Registry/Focus reads in RegionClimate.

### Visual / UX Impact

- Focused Region shifts localized Soft Aether tint; content remains readable.

### Performance Impact

- Opacity AnimatePresence only. No timers, observers, drift loops, or filters.

### Breaking Changes

- None. Custom `presence` slot still fully overrides defaults.

### Future Dependencies

- More registry climates inherit the same map; optional Ambient intensity coupling later.

### Verification

- `tsc --noEmit` · eslint · `next build` — pass
- Visual QA: `/world/aetheranime` serves `world-climate` + `region-climate-host` with RegionScene/Identity intact

---

## 2026-08-13 — Sprint-003 · Milestone-II · Task-006

**Task:** WorldDetails Region Runtime Alignment

**Purpose:** Align WorldDetails with RegionScene so secondary Region presentation consumes `useRegionScene()` rather than Focus, Registry, or Ambient.

### Files Changed

- `apps/web/widgets/world-details/world-details.tsx`
- `apps/web/widgets/world-details/world-details.constants.ts`
- `apps/web/widgets/world-details/index.ts`
- `docs/engineering/CHANGELOG.md`

### Architecture Decisions

- WorldDetails reads `currentRegion` + `regionStatus` only.
- Opacity from status map (no World Ambient dependency for Details).
- WorldKind helpers retained (`resolveWorldKindMode` still used by Kind).

### Performance Impact

- No Registry lookup in Details. No new state/observers/timers.

### Breaking Changes

- Details no longer modulates opacity from World Ambient.

### Future Dependencies

- Optional richer secondary fields (activities) without new runtime.

### Verification

- `tsc --noEmit` · eslint · `next build` — pass

---

## 2026-08-13 — Sprint-003 · Milestone-II · Task-005

**Task:** Region Identity Engine

**Purpose:** RegionIdentity presents the focused Region via `useRegionScene()` only. RegionScene defaults `identity ?? <RegionIdentity />` above existing Shell children.

### Files Changed

- `apps/web/widgets/region-identity/` (new)
- `apps/web/widgets/region-scene/region-scene.tsx`
- `apps/web/widgets/region-scene/region-scene.types.ts`
- `docs/engineering/CHANGELOG.md`

### Architecture Decisions

- Flow: Focus → RegionScene → useRegionScene → RegionIdentity (no Registry in Identity).
- Status-aware copy/opacity from `regionStatus`; accent from `currentRegion.accent` token classes.
- Optional `identity` override on RegionScene; WorldShell / WorldIdentity unchanged.

### Performance Impact

- Pure context render. No state, Registry lookup, timers, observers, or loops in Identity.

### Breaking Changes

- RegionScene gains optional `identity` slot and stacks Identity above children.

### Future Dependencies

- Asset system may resolve `iconId` into the emblem placeholder.

### Verification

- `tsc --noEmit` · eslint · `next build` — pass

---

## 2026-08-13 — Sprint-003 · Milestone-II · Task-004

**Task:** Region Definition Model

**Purpose:** Expand `WorldRegionDefinition` into the canonical optional metadata model (presentation, theme, climate, kind, accent, artwork, activities, portal destinations, extensions). Validation helpers only — no UI.

### Files Changed

- `apps/web/shared/world/world.region.types.ts`
- `apps/web/shared/world/world.region.validation.ts` (new)
- `apps/web/shared/world/world.region.registry.ts`
- `apps/web/shared/world/index.ts`
- `docs/engineering/CHANGELOG.md`

### Architecture Decisions

- Required core unchanged (id/slug/displayName/description/worldId/availability/order).
- Optional fields for all future Region features; `RegionDefinition` alias exported.
- Registry assert uses structural validation + uniqueness.

### Performance Impact

- Module-load validation only. No runtime observers or stores.

### Breaking Changes

- None for required fields. Existing consumers keep working; new fields optional.

### Future Dependencies

- Region Identity / Climate / Ambient widgets consume this model only.

### Verification

- `tsc --noEmit` · eslint · `next build` — pass

---

## 2026-08-12 — Sprint-003 · Milestone-II · Task-003

**Task:** Region Runtime Consolidation

**Purpose:** One canonical Region runtime. RegionScene derives `currentRegion` / `regionStatus` from World Focus + Region Registry; `selectRegion` / `clearRegion` forward to Focus. No parallel selection state.

### Files Changed

- `apps/web/widgets/region-scene/region-scene.tsx`
- `apps/web/widgets/region-scene/region-scene.types.ts`
- `apps/web/widgets/region-scene/region-scene.constants.ts`
- `apps/web/widgets/region-scene/region-scene-context.tsx`
- `docs/engineering/CHANGELOG.md`

### Architecture Decisions

- Focus remains the selection signal (WorldScene / Focus Engine unchanged).
- RegionScene remains the Region runtime *layer* (metadata + status + observe API).
- Removed local `useState` selection and `initialRegionId`.

### Performance Impact

- No second selection store. Pure derive from Focus + O(1) registry lookup.

### Breaking Changes

- `RegionSceneProps.initialRegionId` removed.
- `selectRegion` / `clearRegion` now mutate World Focus (same write path as Kind).

### Future Dependencies

- Region widgets consume `useRegionScene()`; Focus dispatch stays Kind/World-owned.

### Verification

- `tsc --noEmit` · eslint · `next build` — pass

---

## 2026-08-12 — Sprint-003 · Milestone-II · Task-002

**Task:** Region Scene Director

**Purpose:** RegionScene owns Region runtime (`currentRegion` + `regionStatus`) under WorldScene. Widgets observe via `useRegionScene()`. No Focus / Lifecycle / Presence / Ambient ownership.

### Files Changed

- `apps/web/widgets/region-scene/` (new)
- `apps/web/widgets/world-scene/world-scene.tsx`
- `docs/engineering/CHANGELOG.md`

### Architecture Decisions

- WorldScene → RegionScene → Shell / slots.
- Selection via `selectRegion` / `clearRegion` (registry lookup, no reducers).
- Status derived from region availability; default selection none.

### Performance Impact

- Context + one-shot mount only. No observers, timers, polling, or derived stores.

### Breaking Changes

- None. RegionScene wraps existing Shell composition.

### Future Dependencies

- Region widgets mount under RegionScene; optional Focus→select coupling later.

### Verification

- `tsc --noEmit` · eslint · `next build` — pass

---

## 2026-08-11 — Sprint-003 · Milestone-II · Task-001

**Task:** World Region Engine

**Purpose:** Immutable Region Registry as the first explorable unit inside a World. Kind/Details consume Region metadata — no hardcoded region copy in widgets.

### Files Changed

- `apps/web/shared/world/world.region.types.ts` (new)
- `apps/web/shared/world/world.region.constants.ts` (new)
- `apps/web/shared/world/world.region.registry.ts` (new)
- `apps/web/shared/world/world.region.helpers.ts` (new)
- `apps/web/shared/world/index.ts`
- `apps/web/widgets/world-kind/world-kind.constants.ts`
- `apps/web/widgets/world-kind/world-kind.tsx`
- `apps/web/widgets/world-kind/index.ts`
- `apps/web/widgets/world-details/world-details.tsx`
- `docs/engineering/CHANGELOG.md`

### Architecture Decisions

- Region owns id/slug/displayName/description/iconId/availability/order/worldId.
- O(1) lookups via frozen `WORLD_REGION_BY_ID` / `WORLD_REGIONS_BY_WORLD`.
- Focus interactivity = `availability === 'available'` (not Kind mode alone).
- System regions (`__system__`) cover unknown / comingSoon shell status.

### Performance Impact

- Static immutable registry; module-load indexes; no React state / fetch / timers.

### Breaking Changes

- Kind placeholders no longer embed regions; `getWorldKindRegionDetails` removed.
- Details uses `getRegion(focusedRegion)`.

### Future Dependencies

- Additional worlds append regions to `WORLD_REGION_REGISTRY`; optional icon rendering.

### Verification

- `tsc --noEmit` · eslint · `next build` — pass

---

## 2026-08-11 — Sprint-003 · Milestone-I · Task-014

**Task:** World Engine Architecture Validation

**Purpose:** Audit Milestone-I ownership/composition; remove dead exports, prop drilling, and unused helpers without behavior or architecture redesign.

### Files Changed

- `apps/web/widgets/world-shell/world-shell.tsx`
- `apps/web/widgets/world-shell/world-shell.types.ts`
- `apps/web/widgets/world-shell/index.ts`
- `apps/web/widgets/world-shell/world-shell.constants.ts` (deleted)
- `apps/web/widgets/world-scene/world-scene.tsx`
- `apps/web/widgets/world-scene/world-scene.motion.ts`
- `apps/web/widgets/world-scene/index.ts`
- `apps/web/widgets/world-layout/world-layout.tsx`
- `apps/web/widgets/world-layout/world-layout.constants.ts`
- `apps/web/widgets/world-layout/index.ts`
- `apps/web/widgets/world-kind/index.ts`
- `apps/web/widgets/world-details/index.ts`
- `apps/web/widgets/world-climate/index.ts`
- `apps/web/shared/world/world.focus.ts`
- `apps/web/shared/world/world.presence.ts`
- `apps/web/shared/world/world.ambient.ts`
- `apps/web/shared/world/index.ts`
- `docs/engineering/CHANGELOG.md`

### Architecture Decisions

- Shell reads metadata from Scene context — no slug/world/status/lifecycle prop drill.
- Scene barrel no longer re-exports `@/shared/world` (import shared directly).
- Ambient level/variant resolvers are module-private; `resolveWorldAmbient` remains public.

### Performance Impact

- Fewer unnecessary Shell props; no new runtime cost. Nested Scene+Shell+feature enters left intact (behavior-preserving).

### Breaking Changes

- `WorldShellProps` no longer includes slug/world/status/lifecycle.
- Removed: `WORLD_SHELL_COPY`, `worldSceneFeatureMountTransition`, `toWorldFocusRegionId`, `worldPresenceIntensity`, Scene shared-world re-exports.

### Future Dependencies

- Optional consolidation of Scene vs Shell one-shot enters (visual change — out of scope).

### Verification

- `tsc --noEmit` · eslint · `next build` — pass

---

## 2026-08-11 — Sprint-003 · Milestone-I · Task-013

**Task:** World Identity Engine

**Purpose:** Extract identity presentation from WorldShell into WorldIdentity — title, subtitle, eyebrow, emblem placeholder, accent, optional tagline. Shell composes `identity ?? <WorldIdentity />`.

### Files Changed

- `apps/web/widgets/world-identity/` (new)
- `apps/web/widgets/world-shell/world-shell.tsx`
- `apps/web/widgets/world-shell/world-shell.constants.ts`
- `apps/web/shared/world/world.types.ts`
- `apps/web/shared/world/world.registry.ts`
- `docs/engineering/CHANGELOG.md`

### Architecture Decisions

- Identity reads Scene context and/or explicit props; never Registry lookup.
- Optional `WorldDefinition.tagline`; AetherAnime provides one.
- `WORLD_SHELL_COPY` re-exports `WORLD_IDENTITY_COPY` for compatibility.

### Performance Impact

- Pure presentation. No state, observers, timers, or polling.

### Breaking Changes

- None required. Shell slot API unchanged; identity markup moves to WorldIdentity.

### Future Dependencies

- Real emblem asset when brand system lands.

### Verification

- `tsc --noEmit` · eslint · `next build` — pass

---

## 2026-08-11 — Sprint-003 · Milestone-I · Task-012

**Task:** World Ambient Director

**Purpose:** Canonical derived visual state (`ambientLevel` + `ambientVariant`) from Lifecycle × Presence × Focus. Scene exposes Ambient; Climate / Kind / Details consume it — no widget re-derives.

### Files Changed

- `apps/web/shared/world/world.ambient.ts` (new)
- `apps/web/shared/world/index.ts`
- `apps/web/widgets/world-scene/world-scene.types.ts`
- `apps/web/widgets/world-scene/world-scene.tsx`
- `apps/web/widgets/world-scene/index.ts`
- `apps/web/widgets/world-climate/world-climate.constants.ts`
- `apps/web/widgets/world-climate/world-climate.motion.ts`
- `apps/web/widgets/world-climate/world-climate.tsx`
- `apps/web/widgets/world-climate/world-climate.types.ts`
- `apps/web/widgets/world-climate/index.ts`
- `apps/web/widgets/world-kind/world-kind.motion.ts`
- `apps/web/widgets/world-kind/world-kind.tsx`
- `apps/web/widgets/world-details/world-details.tsx`
- `docs/engineering/CHANGELOG.md`

### Architecture Decisions

- Ambient is derived only — never dispatched. Presence / Lifecycle / Focus remain canonical runtimes.
- Climate mood (non-status) = `ambient.variant`; opacity/drift intensity = Lifecycle × `worldAmbientIntensity`.
- Kind accent + opacity and Details opacity emphasis consume Ambient.

### Performance Impact

- Pure per-render derivation. No timers, observers, polling, or new animation loops.

### Breaking Changes

- `useWorldScene()` adds `ambient`.
- `resolveWorldClimateMood(status, variant)` — no longer takes registry climate; `WORLD_CLIMATE_FROM_META` removed from Climate barrel.
- Kind opacity/accent APIs take `WorldAmbient` instead of `WorldPresence`.

### Future Dependencies

- Optional Ambient → Presence engage coupling; registry climate may bias variant when Ambient gains metadata inputs.

### Verification

- `tsc --noEmit` · eslint · `next build` — pass

---

## 2026-08-11 — Sprint-003 · Milestone-I · Task-011

**Task:** World Layout Engine

**Purpose:** Placement-only composition for Shell slots with responsive region order. Shell delegates structure to WorldLayout; no runtime ownership.

### Files Changed

- `apps/web/widgets/world-layout/` (new)
- `apps/web/widgets/world-shell/world-shell.tsx`
- `docs/engineering/CHANGELOG.md`

### Architecture Decisions

- Layout owns identity / presence / primary / secondary placement only.
- Mobile: Secondary before Primary; tablet: Primary then Secondary; desktop: Primary | Secondary (`lg:flex-row`).
- Shell retains identity resolution + one-shot enter motion; Layout performs zero animation.

### Performance Impact

- Pure composition. No state, observers, polling, or timers.

### Breaking Changes

- None. Slot props unchanged; internal DOM ownership moves to WorldLayout.

### Future Dependencies

- Layout variants / denser desktop grids when more Kind regions compose.

### Verification

- `tsc --noEmit` · eslint · `next build` — pass

---

## 2026-08-11 — Sprint-003 · Milestone-I · Task-010

**Task:** World Details Panel

**Purpose:** First Focus consumer in the Shell secondary slot. Observes `focusedRegion` only; never dispatches Focus or imports Registry. Region title/description live on Kind placeholders.

### Files Changed

- `apps/web/widgets/world-details/` (new)
- `apps/web/widgets/world-kind/world-kind.constants.ts`
- `apps/web/widgets/world-kind/index.ts`
- `apps/web/widgets/world-scene/world-scene.tsx`
- `docs/engineering/CHANGELOG.md`

### Architecture Decisions

- Scene default: `secondary={secondary ?? <WorldDetails />}`.
- Details resolves copy via `resolveWorldKindMode` + `getWorldKindRegionDetails` from Kind constants.
- Idle copy when no focus; title + description when focused. No actions/routing.

### Performance Impact

- Pure context render + Framer one-shot/swap. No polling, observers, or timers.

### Breaking Changes

- None. Secondary slot gains a default; callers may still override `secondary`.

### Future Dependencies

- Optional `iconId` on regions when icon system lands.

### Verification

- `tsc --noEmit` · eslint · `next build` — pass

---

## 2026-08-11 — Sprint-003 · Milestone-I · Task-009

**Task:** World Focus Engine

**Purpose:** Canonical Focus interaction state (`focusedRegion` + dispatch/clear). Scene owns runtime; platform Kind regions become hover/focus interactive. Climate ignores Focus.

### Files Changed

- `apps/web/shared/world/world.focus.ts` (new)
- `apps/web/shared/world/index.ts`
- `apps/web/widgets/world-scene/world-scene.types.ts`
- `apps/web/widgets/world-scene/world-scene.tsx`
- `apps/web/widgets/world-scene/index.ts`
- `apps/web/widgets/world-kind/world-kind.constants.ts`
- `apps/web/widgets/world-kind/world-kind.motion.ts`
- `apps/web/widgets/world-kind/world-kind.tsx`
- `docs/engineering/CHANGELOG.md`

### Architecture Decisions

- Default focus: none. Explicit `dispatchFocus` / `clearFocus` only.
- Platform mode interactive; other kinds remain structural.
- Focus scale = `SCALE.TO + (1 - SCALE.FROM) / 2` (1.02 max).

### Performance Impact

- Dispatch-only; no timers/observers/polling. No new ambient loops.

### Breaking Changes

- `useWorldScene()` adds `focusedRegion`, `dispatchFocus`, `clearFocus`.

### Future Dependencies

- Keyboard/activation commits; anime/guild regions may opt into Focus later.

### Verification

- `tsc --noEmit` · eslint · `next build` — pass

---

## 2026-08-11 — Sprint-003 · Milestone-I · Task-008

**Task:** World Presence State

**Purpose:** Canonical World Presence emotional state (distinct from Lifecycle). Scene owns runtime + `dispatchPresence`; Climate/Kind observe for opacity and accent. No auto-transitions.

### Files Changed

- `apps/web/shared/world/world.presence.ts` (new)
- `apps/web/shared/world/index.ts`
- `apps/web/widgets/world-scene/world-scene.types.ts`
- `apps/web/widgets/world-scene/world-scene.tsx`
- `apps/web/widgets/world-scene/index.ts`
- `apps/web/widgets/world-climate/world-climate.motion.ts`
- `apps/web/widgets/world-climate/world-climate.tsx`
- `apps/web/widgets/world-kind/world-kind.motion.ts`
- `apps/web/widgets/world-kind/world-kind.tsx`
- `docs/engineering/CHANGELOG.md`

### Architecture Decisions

- Defaults: registered → `quiet`; unknown status → `unknown`.
- Slot prop renamed locally to `presenceSlot` to avoid clashing with emotional `presence`.
- No new ambient loops; Presence only scales existing Climate/Kind emphasis.

### Performance Impact

- Dispatch-only updates; no timers/polling.

### Breaking Changes

- `useWorldScene()` now includes `presence` + `dispatchPresence`.

### Future Dependencies

- Features (quests, social) dispatch Presence; secondary slot may reflect it.

### Verification

- `tsc --noEmit` · eslint · `next build` — pass

---

## 2026-08-11 — Sprint-003 · Milestone-I · Task-007

**Task:** World Kind Composition

**Purpose:** WorldKind primary-slot composition — kind/status/lifecycle from `useWorldScene()`, structural placeholders only. No content APIs, images, or ambient motion.

### Files Changed

- `apps/web/widgets/world-kind/*` (new)
- `apps/web/widgets/world-scene/world-scene.tsx`
- `docs/engineering/CHANGELOG.md`

### Architecture Decisions

- Default `primary={… ?? <WorldKind />}`.
- Modes: anime / guild / companion / dungeon / platform / unknown / comingSoon.
- AetherAnime (`platform`) uses platform home placeholders; anime regions ready for future registry entries.

### Performance Impact

- One-shot mount only; no loops/timers/polling.

### Breaking Changes

- None for page API.

### Future Dependencies

- Real kind features replace placeholders; secondary slot composition.

### Verification

- `tsc --noEmit` · eslint · `next build` — pass

---

## 2026-08-11 — Sprint-003 · Milestone-I · Task-006

**Task:** World Climate

**Purpose:** Soft Aether WorldClimate in the Shell presence slot — metadata/status-driven CSS atmosphere observing `useWorldScene()`. Max one ambient opacity drift; no particles/filters/Registry lookup.

### Files Changed

- `apps/web/widgets/world-climate/*` (new)
- `apps/web/widgets/world-scene/world-scene-context.tsx` (new)
- `apps/web/widgets/world-scene/world-scene.tsx`
- `apps/web/widgets/world-scene/index.ts`
- `apps/web/widgets/world-shell/world-shell.tsx`
- `docs/engineering/CHANGELOG.md`

### Architecture Decisions

- Default `presence={<WorldClimate />}` from WorldScene.
- Presence slot is absolute behind identity/primary/secondary.
- Mood: status unknown/comingSoon, else registry climate → calm/dream/mystic/energetic.

### Performance Impact

- ≤1 ambient opacity loop (present/engaged only); reduced motion freezes peak opacity.

### Breaking Changes

- None for public page API.

### Future Dependencies

- Kind-specific climate accents; optional override of presence slot.

### Verification

- `tsc --noEmit` · eslint · `next build` — pass

---

## 2026-08-11 — Sprint-003 · Milestone-I · Task-005

**Task:** World Lifecycle

**Purpose:** Canonical World Lifecycle model + Scene Director runtime ownership; WorldShell consumes phase. No timers, auto-progression, climate, or Portal coupling.

### Files Changed

- `apps/web/shared/world/world.lifecycle.ts` (new)
- `apps/web/shared/world/index.ts`
- `apps/web/widgets/world-scene/world-scene.tsx`
- `apps/web/widgets/world-scene/world-scene.types.ts`
- `apps/web/widgets/world-scene/index.ts`
- `apps/web/widgets/world-shell/world-shell.tsx`
- `apps/web/widgets/world-shell/world-shell.types.ts`
- `docs/engineering/CHANGELOG.md`

### Architecture Decisions

- Lifecycle types/transitions live in `@/shared/world`; runtime owned by `WorldScene`.
- Default mounted phase: `present`. Events via `dispatchLifecycle` only.
- Shell exposes `data-world-lifecycle`; context shares `lifecycle` + dispatcher.

### Performance Impact

- No loops, polling, or intervals. State updates only on intentional dispatch.

### Breaking Changes

- `WorldShell` requires `lifecycle` prop (supplied by WorldScene).

### Future Dependencies

- Climate / kind features observe `useWorldScene().lifecycle`.

### Verification

- `tsc --noEmit` · eslint · `next build` — pass

---

## 2026-08-11 — Sprint-003 · Milestone-I · Task-004

**Task:** World Scene Director

**Purpose:** WorldScene orchestrates WorldShell + composition slots and shared context. No lifecycle, climate, Registry lookups, or kind UI.

### Files Changed

- `apps/web/widgets/world-scene/world-scene.tsx` (new)
- `apps/web/widgets/world-scene/world-scene.types.ts` (new)
- `apps/web/widgets/world-scene/world-scene.motion.ts` (new)
- `apps/web/widgets/world-scene/index.ts` (new)
- `apps/web/app/world/[destination]/page.tsx`
- `docs/engineering/CHANGELOG.md`

### Architecture Decisions

- Page resolves registry → `WorldScene` → `WorldShell`.
- `useWorldScene()` exposes slug / world / status to future slot features.
- `children` maps to primary slot when `primary` omitted.

### Performance Impact

- One-shot scene mount (transform + opacity); no continuous animation.

### Breaking Changes

- World route mounts `WorldScene` instead of bare `WorldShell`.

### Future Dependencies

- Lifecycle / Climate / kind features mount via slots + context.

### Verification

- `tsc --noEmit` · eslint · `next build` — pass

---

## 2026-08-11 — Sprint-003 · Milestone-I · Task-003

**Task:** World Shell

**Purpose:** Replace placeholder `/world/[destination]` body with reusable World Shell — registry identity, calm enter, composition slots. No Scene Director / Climate / kind UI.

### Files Changed

- `apps/web/widgets/world-shell/world-shell.tsx` (new)
- `apps/web/widgets/world-shell/world-shell.types.ts` (new)
- `apps/web/widgets/world-shell/world-shell.constants.ts` (new)
- `apps/web/widgets/world-shell/world-shell.motion.ts` (new)
- `apps/web/widgets/world-shell/index.ts` (new)
- `apps/web/app/world/[destination]/page.tsx`
- `docs/engineering/CHANGELOG.md`

### Architecture Decisions

- Page resolves `getWorldBySlug` → `resolveWorldShellStatus`; Shell presents.
- Slots: identity / presence / primary / secondary (`data-slot` hosts).
- `data-world-*` attributes reserved for future lifecycle handoff.

### Performance Impact

- One-shot enter (transform + opacity); no ambient loops.

### Breaking Changes

- Placeholder world copy removed in favor of registry-backed Shell.

### Future Dependencies

- World Scene Director, Climate into presence slot, kind content into primary/secondary.

### Verification

- `tsc --noEmit` · eslint · `next build` — pass

---

## 2026-08-11 — Sprint-003 · Milestone-I · Task-002

**Task:** World Registry

**Purpose:** Canonical metadata-only World Registry (`AetherAnime` sole entry) with typed models and deterministic helpers. Pattern baseline for future registries.

### Files Changed

- `apps/web/shared/world/world.types.ts` (new)
- `apps/web/shared/world/world.constants.ts` (new)
- `apps/web/shared/world/world.registry.ts` (new)
- `apps/web/shared/world/world.helpers.ts` (new)
- `apps/web/shared/world/index.ts` (new)
- `docs/engineering/agents/REGISTRY_AGENT.md` (new)
- `docs/engineering/CHANGELOG.md`

### Architecture Decisions

- Registry owns metadata only; no React, routing, shell, or lifecycle.
- Slug/id `aetheranime` aligned with existing World Transition destination.
- Duplicate id/slug asserted at module init.

### Performance Impact

- Static immutable catalog; O(n) lookup on tiny n.

### Breaking Changes

- None.

### Future Dependencies

- World Shell / scene consume `getWorldBySlug`; Navigation may resolve via registry later.

### Verification

- `tsc --noEmit` · eslint · `next build` — pass

---

## 2026-08-11 — Sprint-003 · Milestone-I · Task-001

**Task:** World Engine Architecture

**Purpose:** Canonical design doc for post-Portal presence — ownership, lifecycle, shell, state, composition, boundaries, and future kinds. Documentation only.

### Files Changed

- `docs/design/WORLD_ENGINE.md` (new)
- `docs/engineering/CHANGELOG.md`

### Architecture Decisions

- World Engine owns destination identity, shell, world lifecycle/state, and in-world composition.
- Portal / Arrival / Navigation boundaries unchanged; World must not own Portal behavior.
- World lifecycle is distinct from PortalPhase.

### Performance Impact

- None (docs only).

### Breaking Changes

- None.

### Future Dependencies

- World metadata registry, World Shell + scene director, replace placeholder world page body.

### Verification

- `docs/design/WORLD_ENGINE.md` present; no `apps/**` changes.

---

## 2026-08-05 — Sprint-003 · Milestone-I · Task-013

**Task:** Engineering Agent System

**Purpose:** Documentation-only agent roles and permanent workflow to reduce future token use. No application behavior changes.

### Files Changed

- `docs/engineering/agents/ARCHITECT_AGENT.md` (new)
- `docs/engineering/agents/IMPLEMENTATION_AGENT.md` (new)
- `docs/engineering/agents/QA_AGENT.md` (new)
- `docs/engineering/agents/VISUAL_QA_AGENT.md` (new)
- `docs/engineering/agents/DOCUMENTATION_AGENT.md` (new)
- `docs/engineering/agents/REFACTOR_AGENT.md` (new)
- `docs/engineering/agents/PERFORMANCE_AGENT.md` (new)
- `docs/engineering/agents/ENGINEERING_WORKFLOW.md` (new)
- `docs/engineering/CHANGELOG.md`

### Architecture Decisions

- Agents are process contracts under `docs/engineering/agents/`.
- Workflow: Architecture → Implementation → QA → Visual QA → Documentation → Git Commit.

### Performance Impact

- None (docs only).

### Breaking Changes

- None.

### Future Dependencies

- Tasks should reference the active agent + `ENGINEERING_WORKFLOW.md`.

### Verification

- Paths present under `docs/engineering/agents/`; no `apps/**` changes for this task.

---

## 2026-08-05 — Sprint-002 · Milestone-II · Task-012

**Task:** World Transition

**Purpose:** Connect Portal Settling completion to App Router navigation (`/world/{slug}`) without altering Portal phases, ceremony timing, or PortalGeometry.

### Files Changed

- `apps/web/shared/lib/navigation/world-transition.ts` (new)
- `apps/web/shared/lib/navigation/index.ts` (new)
- `apps/web/app/world/[destination]/page.tsx` (new)
- `apps/web/widgets/arrival-scene/arrival-scene.tsx`
- `apps/web/widgets/arrival-scene/arrival-scene.types.ts`
- `apps/web/widgets/portal-cta/portal-cta.types.ts`
- `docs/engineering/CHANGELOG.md`

### Architecture Decisions

- ArrivalScene owns consequence: `onComplete` → `dispatch('complete')` → `router.push(worldHref(...))`.
- Navigation helpers live outside PortalGeometry; PortalCTA phase machine unchanged.
- Guard `transitionedRef` prevents duplicate pushes.

### Performance Impact

- No new loops, polling, or ceremony timers.

### Breaking Changes

- Entering the portal now navigates off Arrival after Settling.

### Future Dependencies

- World Engine content for `/world/[destination]`; richer Navigation Engine.

### Verification

- `tsc --noEmit` · eslint · `next build` — pass

---

## 2026-08-05 — Sprint-002 · Milestone-II · Task-011

**Task:** Particle Engine

**Purpose:** Extremely low-count recycled DOM particles inside `portal-particle-field` that drift inward and absorb into seam/singularity, composing density/speed from `PORTAL_GRAVITY_INTENSITY` without modifying Gravity.

### Files Changed

- `apps/web/widgets/portal-cta/portal-particle.motion.ts` (new)
- `apps/web/widgets/portal-cta/portal-particle-field.tsx` (new)
- `apps/web/widgets/portal-cta/portal-geometry.tsx`
- `docs/engineering/CHANGELOG.md`

### Architecture Decisions

- Particles consume Gravity; Gravity does not import Particles.
- Fixed pool of 4; phase caps 1–4 (reduced 1–2). Transform + opacity only.
- Geometry host replaced empty shell with `PortalParticleField` (same slot).

### Performance Impact

- No canvas/WebGL/filters. No per-frame allocations; recycle via generation counter.
- ≤4 simultaneous motes.

### Breaking Changes

- None.

### Future Dependencies

- World Transition / navigation; optional particle tint per world variant.

### Verification

- `tsc --noEmit` · eslint · `next build` — pass

---

## 2026-08-05 — Sprint-002 · Milestone-II · Task-010

**Task:** Gravity Engine

**Purpose:** Invisible inward attraction composed into existing Portal idle/phase maps — plate bias, seam/field/singularity density, chamber perception — without particles, new loops, or architecture.

### Files Changed

- `apps/web/widgets/portal-cta/portal-cta.motion.ts`
- `apps/web/widgets/portal-cta/portal-geometry.tsx`

### Architecture Decisions

- `PORTAL_GRAVITY_INTENSITY` exported for future Particle Engine.
- Plate gravity softens on Crossing so ceremony yield remains readable.
- Reduced motion scales pull via `PORTAL_GRAVITY_REDUCED`; hierarchy preserved.

### Performance Impact

- No new continuous loops or motion nodes. Subliminal bias only.
- Transform + opacity only.

### Breaking Changes

- None.

### Future Dependencies

- Particle Engine (consumes gravity intensity), World Transition / navigation.

### Verification

- `tsc --noEmit` · eslint · `next build` — pass

---

## 2026-08-05 — Sprint-002 · Milestone-II · Task-009

**Task:** Portal Crossing Ceremony

**Purpose:** Event-driven Accepting → Crossing → Settling → Idle passage on Impossible Threshold — plates yield open, seam luminance yields, singularity deepens, field/chamber inward pull and soft exhale — without new ambient loops, engines, or geometry.

### Files Changed

- `apps/web/widgets/portal-cta/portal-cta.motion.ts`
- `apps/web/widgets/portal-cta/portal-geometry.tsx`
- `apps/web/widgets/portal-cta/portal-cta.tsx`

### Architecture Decisions

- Ceremony unlock travel = `DISTANCE.SM / 4` (Accepting/Crossing only); idle micro-travel unchanged.
- Field + chamber join opacity ceremony maps; particle host still empty.
- Crossing transition shortened to `DURATION.FAST`; Settling remains longer memory.

### Performance Impact

- No new continuous loops. Field/chamber become one-shot opacity motion nodes.
- Transform + opacity only.

### Breaking Changes

- None.

### Future Dependencies

- Gravity Engine, Particle Engine, World Transition / route navigation.

### Verification

- `tsc --noEmit` · eslint · `next build` — pass

---

## 2026-08-05 — Sprint-002 · Milestone-II · Task-008

**Task:** Portal Threshold Phase Response

**Purpose:** Event-driven Impossible Threshold layer targets keyed to `PortalPhase` (seam luminance, singularity density, hairline emphasis, plate settling) without adding ambient loops or changing Idle Motion from Task-007.

### Files Changed

- `apps/web/widgets/portal-cta/portal-cta.motion.ts`
- `apps/web/widgets/portal-cta/portal-geometry.tsx`
- `apps/web/widgets/portal-cta/portal-geometry.types.ts`
- `apps/web/widgets/portal-cta/portal-cta.tsx`

### Architecture Decisions

- Phase responses are one-shot `portalPhaseTransition*` targets; ambient loops remain idle-only via `isPortalAmbientIdle`.
- Aware maps to existing PortalPhase `inviting` (PortalCTA has no separate `aware` state).
- Crossing included for complete lifecycle coverage (yield luminance / open singularity density).
- Reduced motion: opacity phase maps for seam/hairline/singularity; plate translates frozen at rest.

### Performance Impact

- No new infinite loops. Phase changes retarget existing motion nodes only.
- Transform + opacity only.

### Breaking Changes

- `PortalGeometry` gains optional `phase?: PortalPhase`.

### Future Dependencies

- Gravity Engine, Particle Engine, Crossing Engine (geometry choreography beyond opacity/micro-translate).

### Verification

- `tsc --noEmit` · eslint · `next build` — pass

---


**Task:** Living Threshold Idle Motion

**Purpose:** Give Impossible Threshold eternal idle presence (60% Gravitational Drift / 30% Living Stone / 10% Dimensional Luminance) using at most two continuous ambient transform/opacity loops, without ceremony geometry animation, particles, gravity, or Crossing.

### Files Changed

- `apps/web/widgets/portal-cta/portal-cta.motion.ts`
- `apps/web/widgets/portal-cta/portal-geometry.tsx`
- `apps/web/widgets/portal-cta/portal-geometry.types.ts`
- `apps/web/widgets/portal-cta/portal-cta.tsx`
- `docs/engineering/CHANGELOG.md` (created)

### Architecture Decisions

- Keep animation *values* in `portal-cta.motion.ts`; `PortalGeometry` only wires definitions onto layers.
- Enforce Experience Budget Living Threshold exception: exactly two ambient loops (near plate translate, seam opacity).
- Freeze chamber, far plate, field, hairline, singularity at idle so L2/L4 event-driven motion can land later without exceeding the two-loop ceiling.
- Compose ambient periods from `DURATION.CINEMATIC` multipliers (Atmosphere-style long ambient), not magic literals or new foundation tokens.
- Pass `reduceMotion` from `PortalCTA` (`useReducedMotion`) into `PortalGeometry`; freeze ambient loops without removing PortalCTA phase machine.

### Performance Impact

- Two long-running Framer Motion compositor loops (transform + opacity only).
- No layout animation, filters, blur animation, SVG filters, canvas, WebGL, or GSAP.
- Idle ambient does not depend on React state; phase changes do not retarget idle keyframes.

### Breaking Changes

- None for public widget API. `PortalGeometry` gains optional `reduceMotion?: boolean` (default `false`).

### Future Dependencies

- Aware / Inviting luminance & singularity density (event-driven, not ambient).
- Hairline inward drift (L2) when a loop slot is free or event-driven.
- Gravity Engine, Particle Engine, Crossing geometry motion (separate tasks).

### Verification

- `tsc --noEmit` — pass
- `eslint widgets/portal-cta --max-warnings 0` — pass
- `npm run build` — pass
