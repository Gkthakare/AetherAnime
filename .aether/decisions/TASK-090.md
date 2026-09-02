# TASK-090 — Capital Phase Experiment 1 baseline start

Status: FROZEN
Area: Capital Phase · measurement · experiment baseline

## Decision

**Capital Phase Experiment 1 is STARTED.** A clean **7-day descriptive-discovery → Destination baseline** begins at the operator-declared timestamp below. Measurement uses existing production Plausible data on `aetheranime.com` via TASK-086 CORE events and TASK-089 server-side attribution. **No product, analytics architecture, or acquisition changes during the window.**

## Experiment

| Field | Value |
|---|---|
| **Name** | Capital Phase — Descriptive Discovery → Destination Baseline |
| **Start (operator-declared)** | **2026-09-03T05:00:00+05:30** (2026-09-02T23:30:00Z) |
| **Duration** | 7 days |
| **First readout due** | **2026-09-10T05:00:00+05:30** (2026-09-09T23:30:00Z) |
| **Decision date** | 2026-09-10 (after readout; no PMF claim before data review) |
| **Production domain** | `aetheranime.com` |

**Start condition:** TASK-089 attribution fix deployed (`dpl_737UfQnNKCHVYhzyNY4rpoEc6Uw1`); CORE Plausible goals configured; no further analytics code changes before baseline completes.

## Core question

Can AetherAnime reliably convert a visitor into a meaningful Destination arrival, especially when the visitor uses **descriptive discovery** rather than an exact anime title?

## Metrics

| Layer | Metric |
|---|---|
| **North Star (primary)** | Distinct Destination arrivals per **returning** visitor (weekly) |
| **Primary activation** | First `destination_arrived` per visitor/session |
| **Strategic activation** | First `destination_arrived` where preceding `navigator_ask_submitted.ask_class` ≠ `exact` (analysis only — filter in Plausible by goal props) |

## Event contract (unchanged — TASK-086)

**Core funnel (measured):**

1. `world_entered`
2. `navigator_ask_submitted`
3. `destination_arrived`

**Secondary CORE (measured, not funnel-primary):**

- `session_multi_destination`
- `return_visit`

**Not wired during Exp 1:** GROWTH events (`navigator_results_shown`, `destination_settled`, `continue_used`, `watchlist_saved`, `home_viewed`).

**Forbidden forever:** query, prompt, transcript, intent, user_input, IP, User-Agent, fingerprint in event props.

## Contamination rule

**Do not interpret as experiment traffic:**

- Any event timestamp **before 2026-09-03T05:00:00+05:30**
- TASK-088/TASK-089 verification (`session_id` props containing `task088-verify`, `task089-prod-verify`, or similar)
- Plausible rows where Browser = **curl** or Top Page = **`/api/events`** (pre-TASK-089 attribution era)
- Automated QA, curl, or agent-generated POSTs to `/api/events`

**Do not generate synthetic traffic during the 7-day window.**

## 500-unique visitor gate

Per [[TASK-087]] Exp 1: baseline readout is **indicative** below **500 unique visitors** in the window; **do not proceed to Exp 2 (Reddit soft launch)** or draw strong funnel conclusions until ≥500 uniques are recorded in Plausible for the experiment period (or extend the window without product changes).

## Questions to answer (Plausible only — no query-text inference)

### A — Acquisition / reach

- Unique visitors (site)
- `world_entered` goal count vs unique visitors

### B — Discovery activation

- `navigator_ask_submitted` count
- Rate: Navigator asks / World entrants (`world_entered` uniques as proxy)

### C — Destination activation

- `destination_arrived` count
- Rate: Destinations / unique visitors
- Rate: Destinations / Navigator askers

### D — Descriptive discovery

- Share of `destination_arrived` where `via=navigator` and related `navigator_ask_submitted` used `ask_class` ∈ {descriptive, similar, ambiguous, filter} (coarse props only)
- Strategic activation rate: non-exact ask_class → Destination (session-level join in spreadsheet export; no query text)

### E — Engagement

- `session_multi_destination` count
- `return_visit` count

### F — Quality signal

- Compare `destination_arrived` `via` breakdown: navigator vs url vs continue vs kinship
- High `via=url` without prior funnel steps suggests direct/deep-link traffic, not discovery success

## What must NOT change during the 7-day window

- Analytics architecture ([[TASK-086]] · [[TASK-089]])
- Navigator, Destination, Memory, Continue, Watchlist behavior
- No GROWTH event wiring, UI, acquisition campaigns, OG sharing, affiliate, ads, accounts
- No synthetic event replay

## Protected behaviour

- TASK-089 forwarding (User-Agent + X-Forwarded-For headers only; product page URLs) — **frozen**
- `/api/events` returns 204 on failure; no Navigator text logging

## Do not undo

- Do not optimize conversion during baseline
- Do not claim PMF from insufficient data
- Do not start Exp 2 until gate + readout review

## Links

[[TASK-087]] · [[TASK-088]] · [[TASK-089]] · [[TASK-086]] · [[TASK-085]] · [[current-state]]
