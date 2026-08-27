# TASK-080 Destination Navigator / Atmosphere / Arrival — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve Navigator descriptive relevance, Destination environmental artwork composition (`contain` + vignette), and one-shot Destination arrival choreography — without reopening V1 architecture.

**Architecture:** Extend existing ownership only:
1. `planAnimeAsk` / `looksLikeDescriptiveRequest` → existing semantic intent pipeline
2. `rankBySemanticPreference` / synopsis evidence + **soft** lexical overlap (stopword-filtered)
3. `AnimeArrivalAtmosphere` composition (full-viewport field; image `contain`)
4. One-shot stagger in atmosphere + `AnimeDestination` motion, keyed to Destination arrival identity

No new compositor, ranking service, artwork field, API, proxy, database, or download path.

**Tech Stack:** Next.js App Router, TypeScript, framer-motion, `node:test` + `tsx`, production Chromium QA.

**Spec:** `docs/superpowers/specs/2026-08-27-task-080-destination-navigator-design.md`  
**Commits:** Do not commit unless the user explicitly requests it.

---

## Spec alignment lock (must remain true)

| Spec rule | Plan enforcement |
|---|---|
| Existing semantic pipeline | Detection widens routing into it; no parallel resolver |
| Lexical is soft relevance | Additive/tie-break under tag+synopsis scores — must not replace them |
| Stopwords filtered | Explicit token denylist / low-info filter in lexical helper |
| Semantic failure → lexical/synopsis rank | Domain helper re-ranks discovery candidates; no new API |
| Solo acceptance deterministic | Fixture-only; top 3 preferably #1; no live MAL |
| No slug↔query maps | Source contract tests |
| Only `CanonicalAnime.poster` | Atmosphere continues to take `poster` only |
| Full-viewport field + contain image | CSS contracts |
| No visible letterbox/pillar bars | Vignette + existing Destination grade; visual QA |
| Blur retained | Keep `BLUR_RADIUS.lg` |
| Arrival ≠ generic mount | Key ceremony to arrived-anime identity |
| No re-render replay / same anime no loop | Identity key + one-shot enter |
| `?anime=` may one-shot | Same Destination-entry path |
| No continuous Destination motion | Settle static; no infinite Destination keyframes |
| Reduced motion collapses choreography | Existing reduceMotion branches |
| Arrival FPS ≠ settled FPS | QA records both separately (TASK-068) |
| Home/Idle/Memory/Continue/Watchlist unchanged | Explicit do-not-touch list |

---

## File map (final)

### Modify (expected)

| File | Why |
|---|---|
| `apps/web/shared/anime/anime.semantic-intent.ts` | Widen descriptive detection; `planAnimeAsk` routing; thread ask text into retrieve/rank if needed; expose/call safety-net re-rank for discovery candidates |
| `apps/web/shared/anime/anime.semantic-profile.ts` | Synopsis motifs; stopword-filtered lexical soft score; integrate into existing scorer/ranker |
| `apps/web/widgets/anime-arrival-atmosphere/anime-arrival-atmosphere.css` | Full-viewport field; contain image; reduced overscan; vignette blend; retain blur |
| `apps/web/widgets/anime-arrival-atmosphere/anime-arrival-atmosphere.motion.ts` | Lower settle/enter scale; arrival timing constants |
| `apps/web/widgets/anime-arrival-atmosphere/anime-arrival-atmosphere.view.tsx` | Fit class / arrival keying only if required |
| `apps/web/widgets/anime-destination/anime-destination.motion.ts` | Stagger delays for poster → title → body/actions |
| `apps/web/widgets/anime-destination/anime-destination.tsx` | Wire motion; key to arrived anime identity (no anonymous remount replay) |

### Modify (conditional — avoid unless necessary)

| File | When allowed |
|---|---|
| `apps/web/widgets/world-navigator/world-navigator.tsx` | **Only** if discovery failure path cannot call the domain re-rank helper without a one-line hook. Prefer all ranking logic in `shared/anime/*`. No UI redesign. |
| `apps/web/widgets/world-environment/world-destination-presence.css` | **Only** if atmosphere vignette alone cannot blend unused AR regions into the world grade (no geography / Idle changes). |
| RealmCrossing files | **Default: do not modify.** Crossing remains the existing owner of the veil ceremony. Coordinate via shared duration/delay tokens consumed by atmosphere + destination. |

### Do not touch

- Home widgets / portal / arrival-scene (threshold)
- Idle geography / living-light ownership / Continuum–Thresholds plates
- Memory Horizon semantics / Continue / Watchlist persistence or UI meaning
- `apps/web/next.config.ts` `remotePatterns`
- `anime.poster.ts` validation rules (TASK-074 trust boundary)
- New route handlers / APIs
- FG poster plate semantics beyond stagger timing (stay sharp `cover` identity artifact)
- Product architecture / new compositor modules

### Tests (add/update)

| Test file | Covers |
|---|---|
| `shared/anime/anime.semantic-intent.test.ts` | Plot detection; exact-title still navigate; planAnimeAsk routes |
| `shared/anime/anime.semantic-profile.test.ts` | Soft lexical; stopwords; Solo fixture top-3; no slug hardcode; semantic-failure re-rank helper |
| `widgets/anime-arrival-atmosphere/anime-arrival-atmosphere.test.ts` | Contain; full-viewport; a11y; blur; overscan; single poster |
| `widgets/anime-arrival-atmosphere/anime-arrival-atmosphere.option-d.test.ts` | Update cover/overscan assertions to contain contracts |
| Destination motion/composition tests (existing + focused cases under `widgets/anime-destination/*.test.ts`) | Stagger order; reduced motion; arrival-identity keying; no continuous settle |

---

## Implementation order

```
Task 1  Navigator detection (RED→GREEN)
Task 2  Lexical soft score + motifs + Solo fixture + safety-net helper (RED→GREEN)
Task 3  Environmental contain composition (RED→GREEN)
Task 4  Arrival one-shot orchestration (RED→GREEN; after Task 3 scale constants)
Task 5  Full automated gates
Task 6  Production Chromium matrix (concrete)
Task 7  Brain TASK-080 (after evidence)
```

Tasks 1–2 before or parallel with Task 3; Task 4 after Task 3.

---

### Task 1: Widen descriptive detection

**Files:** `anime.semantic-intent.ts` · `anime.semantic-intent.test.ts`

- [ ] **Step 1: Failing tests**
  - Hunter/mysterious-system sentence → semantic ask route (not navigate-with-full-sentence-title)
  - Exact title `"Solo Leveling"` (and similar) still navigate/resolve — **not** forced into semantic
  - Existing descriptive fixtures still semantic

- [ ] **Step 2: Confirm RED**

- [ ] **Step 3: Minimal detection widening** (plot-shaped only; no slug maps)

- [ ] **Step 4: Confirm GREEN**

---

### Task 2: Soft lexical + synopsis motifs + deterministic Solo + safety net

**Files:** `anime.semantic-profile.ts` · possibly `anime.semantic-intent.ts` for ask-text + re-rank helper · `anime.semantic-profile.test.ts`

- [ ] **Step 1: Failing tests**
  - **Soft signal:** lexical adds limited points / tie-break; tag+synopsis remain primary (assert a case where tags still dominate when lexical is weak)
  - **Stopwords:** after filtering, tokens like `anime`/`about`/`who`/`becomes`/`stronger` are absent or non-scoring; content tokens (hunter, mysterious, system) remain
  - **Solo fixture:** fixed in-memory candidates including Solo Leveling + competitors; hunter/mysterious-system ask ranks Solo in **top 3**, preferably **#1**; **no live MAL**
  - **Safety net:** with semantic unavailable, same fixture discovery list re-ranked by lexical+synopsis helper (not raw input order)
  - **No hardcode:** source does not map that query string to `solo-leveling`

- [ ] **Step 2: Confirm RED**

- [ ] **Step 3: Implement**
  - Expand application-owned synopsis motifs (hunter, system, level-up, dungeon/gate, power progression, …)
  - Stopword-filtered lexical overlap as **soft** additive score inside existing `scoreSemanticCandidate` / `rankBySemanticPreference`
  - Domain helper for re-ranking discovery candidates when semantic fails (same ranking family — not a new service)

- [ ] **Step 4: Confirm GREEN** (including prior profile tests)

- [ ] **Step 5 (conditional):** If Navigator discovery-failure branch cannot call the helper, add the thinnest possible call in `world-navigator.tsx` — no UX change

---

### Task 3: Environmental artwork — full-viewport field + contain image

**Files:** atmosphere `.css` / `.motion.ts` / `.view.tsx` as needed · atmosphere tests · Option D test updates

- [ ] **Step 1: Failing contracts**
  - Field container remains full-viewport
  - Environmental **image** uses `object-fit: contain` (not `cover`)
  - Preserve complete poster AR (no heavy cover crop)
  - Soft radial mask retained; `BLUR_RADIUS.lg` retained
  - Aggressive `inset-[-28%]` overscan reduced/removed; settle scale lowered vs crop-era stack
  - Single `poster` prop; no second artwork field; `aria-hidden="true"`; `pointer-events-none`
  - FG destination poster still separate sharp identity (do not change its `cover` plate to contain)

- [ ] **Step 2: Confirm RED**

- [ ] **Step 3: Implement** so unused AR regions blend into world via vignette + existing Destination grade — **no visible letterbox/pillar bars**

- [ ] **Step 4: Confirm GREEN**; update Option D tests that asserted `object-cover` / old overscan

- [ ] **Step 5 (conditional):** Only if bars remain after atmosphere-only fix, minimal `world-destination-presence.css` grade tweak (Destination-gated; no Idle geography)

---

### Task 4: Arrival ceremony — identity-keyed one-shot

**Files:** `anime-destination.motion.ts`, `anime-destination.tsx`, atmosphere motion/CSS timing  
**Default:** do not modify RealmCrossing implementation

- [ ] **Step 1: Failing contracts**
  - Trigger semantics documented/asserted: ceremony tied to **Destination arrival identity** (arrived anime id/slug), not bare mount
  - Stagger order constants: atmosphere fade → subtle settle scale → FG poster → title → metadata/actions/paths within ~1.2–1.6s
  - Same identity: remount/re-render does not restart infinite loop; enter animation is one-shot per identity change
  - New identity may run ceremony once; direct `?anime=` uses same Destination-entry ceremony
  - Reduced motion: final artwork + FG + identity + metadata + paths; extended choreography collapsed
  - Settled: no continuous Destination animation / no Destination living-light breath

- [ ] **Step 2: Confirm RED**

- [ ] **Step 3: Implement** coordinated delays/variants in existing owners only

- [ ] **Step 4: Confirm GREEN**

---

### Task 5: Full automated gates

**Cwd:** `apps/web`

- [ ] `npx tsx --test "shared/**/*.test.ts" "widgets/**/*.test.ts"` (≥483, all pass)
- [ ] `npx tsc --noEmit`
- [ ] `npm run lint`
- [ ] `npm run build`

Do not weaken tests to force green.

---

### Task 6: Production Chromium verification (concrete)

**Runtime:** `apps/web` production build + `next start` on a fixed local port (e.g. `3200`), **or** live Vercel URL if already available.  
**Evidence:** `%TEMP%\aether-080-qa\` (screenshots, `report.json`) — outside the repo.

**Viewports:** 390×844, 820×1180, 1440×900, 1920×1080

**Procedure:**
1. Home `/` — screenshot; network: 0 anime artwork / 0 unexpected `/api/*`
2. Idle `/world/aetheranime` — geography present; no Destination field; 0 anime artwork
3. Ask Navigator: hunter/mysterious-system query — candidates include Solo Leveling near top when semantic path works; instrument UI unchanged (not poster browser)
4. Arrive Solo Leveling — observe one-shot ceremony; then settled static; FG sharp; env contain/no bars
5. Fate/Zero, Fate/stay night — artwork differs; FG sharp
6. `discovered-40748` — MAL CDN via existing `/_next/image`; field present
7. Null-poster path (fixture or forced) — seal/fallback; no fake art
8. Reduced motion Destination — finals present; no extended choreography
9. FPS: settled Home / Idle / Destination ≈60; arrival-window sampled separately (do not call arrival dip a settled regression)
10. Confirm Memory/Continue/Watchlist behavior unchanged if exercised; Horizon Idle-only

**Pass bar:** matches spec success criteria; no dashboard/poster-wall; no continuous Destination motion; TASK-074 trust intact.

---

### Task 7: Brain (after verification)

- [ ] `.aether/decisions/TASK-080.md` + INDEX / current-state / open-questions / visual-debt as needed
- [ ] No commit unless user asks

---

## Stop conditions

Stop and report (do not invent architecture) if work would require:

- new compositor / ranking service / database / artwork API / proxy / download
- second artwork field
- hardcoded anime↔query mapping
- continuous Destination animation after settle
- Home/Idle geography or artwork preload changes
- Memory / Continue / Watchlist semantic changes
- Broadening `remotePatterns` or weakening TASK-074

## Explicit non-goals

- Class C environment masters
- Navigator/AI redesign
- Horizon interaction
- Vercel deploy ops

---

## Verification sequence (summary)

1. Domain tests (detection → ranking fixtures → safety net)  
2. Atmosphere composition contracts  
3. Arrival identity + stagger + reduced-motion contracts  
4. Full suite → tsc → lint → build  
5. Production Chromium matrix + FPS  
6. Brain record  

---

## Remaining known risks (accepted; not plan gaps)

- Visual “no bars” under `contain` is QA-sensitive; conditional Destination grade tweak is last resort only.
- Soft lexical must not overpower unrelated tag-strong competitors — covered by “tags remain primary” test.
- Live MAL order is irrelevant to the Solo acceptance test (fixture-only).
