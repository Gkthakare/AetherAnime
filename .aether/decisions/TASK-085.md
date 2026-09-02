# TASK-085 — Capital Phase measurement architecture audit

Status: FROZEN
Area: product analytics · privacy · Capital Phase

## Decision

**TASK-085 AUDIT COMPLETE — READY FOR INSTRUMENTATION DESIGN.** AetherAnime ships **zero product analytics** today. V1 engineering and production verification are complete ([[TASK-083]]). Before monetization or growth experiments, the minimum measurement architecture is: **(1)** privacy-preserving acquisition/retention baseline, **(2)** a small server-side product-event layer for the journey funnel, **(3)** no query-text or prompt logging, **(4)** no analytics cookies/localStorage beyond existing product Memory/Watchlist keys.

**North-Star (proposed, not implemented):** **Distinct Destination arrivals per visitor** — count of unique anime destinations reached in a session (catalog or discovered), excluding mere page loads.

**Activation (proposed):** first **settled Destination arrival** in a session (`arrivedAnime` committed + presentation settled).

**Recommended architecture (design only):** **Hybrid** — privacy-focused web analytics (Plausible or Umami class) for landing/referrer/retention baselines + minimal **`/api/events` or Edge function** accepting anonymous, coarse product events (slug ids, route class, outcome enums — never raw Navigator text).

## Why

Capital Phase requires knowing whether the product creates engagement, not vanity traffic. Code inspection confirms no analytics SDK, no Vercel Analytics package, no custom telemetry, and no server-side product metrics — only platform logs and existing product localStorage ([[data-flow]]). The journey Home → World → Navigator → Destination → Memory/Continue is the funnel; measurement must respect TASK-062 Navigator-only AI, TASK-057-A Memory semantics, and server-only secrets ([[network]]).

## Protected behaviour (audit constraints for future instrumentation)

- Do not record Navigator prompts, voice transcripts, or semantic-intent payloads.
- Do not add analytics identifiers to application/React state or URL.
- Do not conflate Memory/Watchlist localStorage with analytics identity.
- Do not auto-arrive for measurement; funnel events fire on committed outcomes only.
- Do not weaken server-only API boundaries for tracking convenience.
- Product events use **anime slug / animeId / outcome enum**, never free-text queries.

## Implementation area (future — not touched in TASK-085)

Audit-only. Future instrumentation likely touches: `app/api/` (new events route), thin client emitters at `arriveAnime` / `rememberArrival` / Navigator commit boundaries, optional Vercel dashboard config. **No changes in TASK-085.**

## Contracts

### A — Current measurement (verified absent)

| Layer | Exists | Notes |
|---|---|---|
| Analytics npm deps | **No** | `package.json` has none (`@vercel/analytics`, Posthog, etc.) |
| Client instrumentation | **No** | no `track`/`capture` calls |
| Custom server metrics | **No** | API routes return JSON only |
| Vercel Analytics (in-repo) | **No** | no `vercel.json`, no Analytics component in `layout.tsx` |
| Product localStorage | **Yes** | `aetheranime.memory.v1`, `aetheranime.watchlist.v1` — product only |
| Vercel platform logs | **Platform default** | HTTP/function logs; not product funnel |
| OpenTelemetry | **Not wired** | optional Next peer only |

### B — Minimum funnel + event candidates

| Step | Proposed event | Essential | Trigger (committed) | Properties (coarse) |
|---|---|---|---|---|
| 1 Landing | `home_viewed` | Optional | `/` mount | `entry_path` |
| 2 World entry | `world_entered` | **Core** | Home ceremony `onComplete` → `/world/aetheranime` | `source: home \| direct \| return` |
| 3 Navigator seen | — | Optional | skip (Idle subsumed by world_entered) | — |
| 4 Ask submitted | `navigator_ask_submitted` | **Core** | Navigator submit | `ask_class: exact \| ambiguous \| descriptive \| similar \| filter \| unknown` |
| 5 Results shown | `navigator_results_shown` | Growth | candidates rendered | `result_count`, `route: catalog \| discovery \| semantic` |
| 6 Destination arrival | `destination_arrived` | **Core** | `arrivedAnime` set | `anime_id`, `slug`, `origin: catalog \| discovered`, `via: navigator \| continue \| url \| kinship` |
| 7 Destination settled | `destination_settled` | Growth | arrival ceremony complete (~1.6s) | `anime_id` |
| 8 Second anime | `session_multi_destination` | **Core** | 2nd distinct `destination_arrived` in session | `distinct_count` |
| 9 Watchlist | `watchlist_saved` | Growth | watchlist write | `anime_id`, `action: add \| remove` |
| 10 Continue | `continue_used` | Growth | Continue click → arrival | `anime_id` |
| 11 Return visit | `return_visit` | **Core** | new session with prior anonymous visitor | `days_since_last`, `had_destination` |

Anonymous session id sufficient for funnel; no account required.

### C–G — Metrics summary

- **North-Star:** distinct Destination arrivals per visitor (session).
- **Activation:** first settled Destination arrival.
- **Retention:** D1/D7 return with ≥1 Destination arrival; optional Continue/Watchlist as secondary.
- **Acquisition:** first-touch referrer, landing path, UTM (server-side, first request); useful, low-invasive; IP/geo → privacy-sensitive, aggregate only.
- **Monetization readiness signals (measure first):** engaged-visitor rate, multi-destination rate, D7 retention, discovery vs exact-title mix, traffic source mix — **not** revenue yet.

### H — Privacy approach (design)

- Prefer **cookieless or first-party** analytics; separate consent if cookies used.
- **Never** store Navigator query text server-side for analytics.
- Anonymous visitor id: rotating, first-party, HttpOnly if cookie-based; legal review for GDPR/India DPDP before production collection.
- Referrer/UTM: first landing only; strip on subsequent events.
- Existing Memory/Watchlist keys remain product-only — do not read for analytics.

### I — Provider comparison (no selection)

| Option | Complexity | Cost | Privacy | Fit |
|---|---|---|---|---|
| Vercel Web Analytics | Low | Bundled tier | Pageviews only; coarse | Baseline traffic, not funnel |
| Plausible/Umami | Low | Low SaaS | Strong | Acquisition/retention baseline |
| Self-hosted Umami/Plausible | Medium | Infra | Strong | Data ownership |
| Custom `/api/events` | Medium | Vercel invocations | Full control | **Required for product funnel** |
| Hybrid | Medium | Low+ | Strong | **Recommended** |

### J — Event taxonomy (intentionally small)

**CORE:** `world_entered`, `navigator_ask_submitted`, `destination_arrived`, `session_multi_destination`, `return_visit`

**GROWTH:** `navigator_results_shown`, `destination_settled`, `continue_used`, `watchlist_saved`, `home_viewed`

**MONETIZATION (future):** `engaged_session` (≥2 destinations), `high_intent_session` (descriptive ask + arrival), `repeat_destination_visitor`

**DEBUG (engineering only, not product analytics):** API latency, intent-null rate, discovery empty-rate — server logs/metrics, never mixed with product dashboards.

### K — Anti-patterns (do not implement)

Prompt/query verbatim storage · fingerprinting · mouse/keystroke tracking · per-frame/render events · analytics in React context · `NEXT_PUBLIC_*` analytics secrets · using Memory as analytics cohort · tracking every animation · third-party ad pixels before policy review.

### L — Capital experiment framework

Each experiment documents: **Hypothesis · Metric · Baseline · Change · Expected result · Guardrails · Decision rule.** Guardrails always include North-Star non-regression, privacy constraints (TASK-085), and settled FPS ([[TASK-046]]). No experiment ships without pre-declared success/fail threshold.

## Do not undo

- Do not implement analytics inside TASK-085 scope.
- Do not pick a provider or add packages without a follow-on instrumentation task.
- Do not redefine Memory as visits/analytics.

## Links

[[TASK-083]] · [[TASK-062]] · [[TASK-061]] · [[TASK-057-A]] · [[data-flow]] · [[network]] · [[current-state]] · [[open-questions]]
