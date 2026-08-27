# TASK-080 — Navigator relevance, Destination atmosphere, arrival ceremony

Date: 2026-08-27  
Status: Approved design (refined wording; awaiting implementation)  
Surfaces: World Navigator · Destination atmosphere · Destination identity

## Intent

Improve three production-verified gaps without reopening V1 architecture:

1. **Navigator** — descriptive plot queries must surface semantically strong candidates (e.g. Solo Leveling for a hunter / mysterious-system ask).
2. **Artwork** — Destination environmental field must read as complete atmosphere, not a cropped giant poster.
3. **Arrival** — one-shot entrance choreography that feels like arriving into an anime place, then static settle.

## Locked choices

| Area | Choice |
|---|---|
| Navigator | **C** — widen descriptive → semantic path **and** lexical/synopsis ranking safety net |
| Artwork | **A** — `object-fit: contain` + soft vignette; preserve aspect ratio |
| Arrival | **A** — orchestrated stagger (~1.2–1.6s), then static |

## Non-negotiables (PROTECT)

- Frozen decisions through TASK-079 remain intact.
- No second artwork field; no artwork API; no artwork proxy; no downloaded MAL assets.
- Artwork source remains only `CanonicalAnime.poster` with TASK-074 validation (local path **or** validated MAL CDN **or** null).
- No hardcoded anime-slug ↔ query mappings.
- Navigator is not a poster browser; Destination is not a media dashboard.
- No continuous poster animation, parallax, or looping motion after Destination settles.
- LLM never authors destination URLs or auto-arrives.
- Home and Idle remain unchanged (no anime artwork requests / preloads).
- `next.config.ts` `remotePatterns` stay narrowly scoped.
- Settled Destination ≈60 FPS; arrival-window FPS measured separately (TASK-068).

---

## 1. Navigator semantic relevance

### Problem

Plot-shaped asks such as:

> anime about a hunter who becomes stronger through a mysterious system

fail `looksLikeDescriptiveRequest` today, become `{ kind: 'navigate', title: <full sentence> }`, miss the catalog, and fall through to raw MAL **title** search on the sentence — with **no** `rankBySemanticPreference`.

### Target pipeline (unchanged ownership)

```
query text
  → StructuredAnimeIntent (/api/anime-intent when semantic)
  → existing catalog ∪ MAL discovery retrieval
  → rankBySemanticPreference (+ lexical safety)
  → Navigator candidates
  → user confirms
  → canonicalize → arriveAnime
```

### Changes

1. **Widen descriptive detection** in `anime.semantic-intent.ts`  
   Treat plot-shaped language as descriptive, including patterns such as:
   - `about a` / `about an`
   - `who` + progressive/plot verbs
   - similar plot-request shapes already consistent with product intent  
   Must **not** force exact-title navigations into the semantic path.

2. **Enrich semantic evidence** in `anime.semantic-profile.ts`  
   Expand application-owned synopsis/tag motifs (examples: hunter, dungeon/gate, system, level-up, power progression) as derived evidence.  
   **Forbidden:** maps of the form `solo-leveling` ↔ specific query strings.

3. **Lexical overlap signal**  
   Soft score from normalized ask tokens vs title/synopsis (and existing tag matches). Used to boost relevance and break ties — never as a slug hardcode.  
   Lexical scoring **must ignore common stopwords and low-information tokens**. Generic words such as `anime`, `about`, `who`, `becomes`, `stronger`, and similar fillers must **not** dominate the score. Content-bearing tokens (e.g. hunter, mysterious, system) carry the signal.

4. **Safety net**  
   When semantic intent is unavailable (LLM disabled / failure), discovery hits for descriptive asks still receive lexical/synopsis ranking rather than raw order alone.

5. **Contract tests**  
   - **Deterministic fixture:** For a fixed fixture set that includes Solo Leveling and competing candidates, the hunter / mysterious-system query must rank Solo Leveling in the **top 3**, preferably **#1**. Ranking must be asserted against **fixture data**, not live MAL ordering.  
   - Assert **no** hardcoded slug/query mapping in source.  
   - Exact-title asks still resolve via navigate/resolve path.

### Explicitly not done

- New ranking service or database.
- Auto-arrival from intent.
- Changing Watchlist / Memory / Continue semantics.

---

## 2. Environmental artwork composition

### Problem

Option D currently uses large overscan + `object-cover` + biased `object-position`, which reads as a cropped enlarged poster.

### Changes (AnimeArrivalAtmosphere only)

1. The atmospheric **field remains full-viewport**. **`object-fit: contain`** applies to the **environmental artwork image itself** so the complete source aspect ratio is preserved (no heavy cover crop of the poster).
2. Unused aspect-ratio regions (letterbox / pillar space inside the full-viewport field) must **blend into the existing world** through the soft radial vignette and Destination world grade — **no visible letterbox or pillar bars**.
3. Soft **radial vignette / mask** keeps the plate atmospheric and subordinate to foreground identity.
4. Reduce or remove aggressive `inset-[-28%]` overscan; lower settle scale vs today’s 1.06/1.1 crop stack.
5. Blur remains soft (`BLUR_RADIUS.lg` class).
6. Null poster → no field (TASK-060 / TASK-075 fallback); seal path unchanged.
7. Accessibility unchanged: atmosphere `aria-hidden="true"`, `pointer-events: none`.

### Unchanged

- Foreground destination poster: sharp, recognizable, interactive preview surface.
- Single `poster` prop channel; WorldEnvironment `data-anime-artwork` present/absent gating.
- Home/Idle: no atmosphere mount / no artwork fetch.

### Contract tests

- CSS/view contracts: environmental wash uses contain (not cover); field remains full-viewport; no second artwork field; TASK-074 validation still referenced.
- Reduced overscan / scale constants asserted.
- Decorative a11y attributes preserved.

---

## 3. Destination arrival ceremony

### Problem

Crossing, atmosphere, and destination UI already one-shot-animate, but are concurrent rather than sequenced — reads closer to page-load than arrival.

### Trigger / replay semantics

- The ceremony is triggered by **Destination arrival / selection state** (entering arrived-anime Destination), **not** by generic component mount alone.
- Ordinary re-renders must **not** replay the choreography.
- Direct Destination navigation (e.g. `?anime=`) may perform the **same one-shot** arrival when entering Destination state.
- Re-entering Destination for a **new** arrival may run the ceremony once for that arrival; staying on the same arrived anime must not loop it.

### Changes

Orchestrated **one-shot** stagger within ~**1.2–1.6s** cinematic window:

1. World RealmCrossing begins (existing).
2. Atmospheric field fades into presence.
3. Environmental artwork subtly settles toward final scale.
4. Foreground poster fades/rises into place.
5. Title / identity reveals.
6. Metadata, actions, paths settle.
7. Destination becomes **static** (no continuous motion).

Implementation stays inside existing motion owners (`anime-arrival-atmosphere`, `anime-destination.motion`, RealmCrossing) via coordinated delays/variants — **no** new compositor system or continuous breath layer.

### Reduced motion

- Final artwork, FG poster, identity, metadata, paths present.
- Extended entrance choreography removed / collapsed.

### Performance

- Measure settled FPS at 390 / 820 / 1440 / 1920 (target ≈60).
- Record arrival-window samples separately; do not treat intentional dip as settled regression.

### Contract tests

- Arrival animation states / delay ordering keyed to Destination arrival identity.
- No replay on ordinary re-render (contract via keying / one-shot guards as implemented).
- Reduced-motion branch.
- Settled state has no infinite keyframes / living-light on Destination.

---

## Testing & verification

### Automated

- Existing suite remains green (483+ baseline; expect net new tests for TASK-080 contracts).
- `tsc --noEmit`, `lint`, `build`.

### Production Chromium QA

Anime cases: Solo Leveling, Fate/Zero, Fate/stay night, Jujutsu Kaisen / `discovered-40748`, null-poster fallback.  
Surfaces: Home, Idle, Destination; navigator descriptive ask; reduced motion; network (Home/Idle 0 anime art; Destination existing paths only).

---

## Stop conditions

Stop and report (do not implement) if the work would require:

- new compositor architecture
- second artwork field / artwork proxy / downloaded art / new API / database
- hardcoded anime↔query mappings
- continuous Destination animation after settle

## Success criteria

- Descriptive Navigator queries produce semantically relevant candidates.
- Environmental artwork reads as atmosphere, not cropped giant poster.
- Entrance communicates arrival; FG poster stays recognizable; settle is static V1 composition.
- Home/Idle unchanged; V1 architecture intact.
