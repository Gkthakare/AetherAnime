# Open Questions

Genuinely unresolved. **Do not answer these here** — answering one is a decision and belongs in `decisions/`.

## Closed for V1 (do not reopen without an explicit decision)

| Topic | Status | Record |
|---|---|---|
| Memory persistence + Horizon residual | Answered | [[TASK-057-A]] · [[TASK-057-B]] |
| Physical crossings | Answered | [[TASK-059]] |
| Destination environmental presence | Answered | [[TASK-060]] |
| Continue From This Place | Answered | [[TASK-061]] |
| AI participation | Answered — Navigator structured intent only | [[TASK-062]] · [[TASK-067]] |
| Persistent state → visual composition | Answered — Horizon + Continue only | [[TASK-066]] |
| Home → Idle → Destination coherence | Answered | [[TASK-065]] · [[TASK-069]] |
| Navigator sufficiency | Answered | [[TASK-067]] |
| Destination arrival FPS dip | Answered — one-shot ceremony | [[TASK-068]] |
| V1 product freeze | Answered — freeze | [[TASK-069]] |
| V1 release readiness | Answered — release candidate ready | [[TASK-070]] |
| V1 deploy readiness | Answered — ready to deploy; host not chosen in-repo | [[TASK-071]] |
| V1 deployment host | Answered — Vercel; first live deploy paused on auth | [[TASK-072]] |
| Destination anime-specific background | Answered — Option D **implemented** | [[TASK-073]] · [[TASK-075]] |
| Destination all-anime artwork contract | Answered — validated `poster` may be local or MAL CDN URL; **implemented** | [[TASK-074]] |
| V1 visual / product acceptance after Option D | Answered — accepted with deferred polish; freeze holds | [[TASK-076]] |
| V1 first production deploy attempt | Answered — paused; CLI logged out; not LIVE | [[TASK-077]] |
| Vercel auth & project link resume | Answered — still logged out at TASK-078 time | [[TASK-078]] |
| Vercel project link + env readiness | Answered — linked `aetheranime` / `apps/web`; Production env empty | [[TASK-079]] |
| Navigator descriptive relevance + Destination contain/arrival | Answered — implemented | [[TASK-080]] |
| Vercel production deploy + live QA | Answered — deployed Ready; hunter Solo ranking blocked | [[TASK-082]] |
| Production semantic intent null | Answered — HTTP boundary + retrieval pin; hunter Solo #1 live | [[TASK-083]] |
| Capital Phase measurement architecture | Answered — audit complete; hybrid design proposed; not implemented | [[TASK-085]] |
| Capital Phase instrumentation foundation | Answered — Hybrid Plausible + `/api/events`; CORE events; privacy boundary | [[TASK-086]] |
| Capital Phase PMF + monetization strategy | Answered — discovery beachhead; affiliate-first; experiments defined | [[TASK-087]] |
| Production analytics enablement | Answered — enabled on aetheranime.com; server-side Plausible | [[TASK-088]] |
| Plausible visitor attribution fix | Answered — forward UA + X-Forwarded-For; product page URLs | [[TASK-089]] |

## Active experiment

| Topic | Status | Record |
|---|---|---|
| Capital Phase Experiment 1 — descriptive discovery baseline | **RUNNING** — started 2026-09-03T05:00:00+05:30; 7-day window; readout 2026-09-10 | [[TASK-090]] |

## Intentionally deferred (outside V1 / future product decision)

### Capital experiments (Exp 2–5)

Strategy and experiment queue defined ([[TASK-087]]). Exp 1 **running** ([[TASK-090]]). Exp 2–5 blocked on Exp 1 readout + 500-unique gate.

### Product analytics — growth events + consent UI

CORE funnel foundation implemented ([[TASK-086]]). GROWTH events remain schema-only until experiments require ([[TASK-087]] Part 13). Consent banner / DPDP-GDPR legal sign-off before enabling production collection.

*Classification:* **Capital Phase — deferred until Exp 1** ([[TASK-086]] · [[TASK-087]]).

### Arrive-from-memory / Horizon interaction

Horizon stays non-interactive residual. Making Horizon a resume surface would collide with Continue semantics and needs an explicit product decision — not automatic.

*Classification:* **B intentionally deferred** ([[TASK-069]]).

### Account / server Memory sync

Local-only Memory/Watchlist remains V1. Cloud sync needs privacy, migration, and ownership decisions. **Capital Stage 2 gate only if retention data supports** ([[TASK-087]]).

*Classification:* **B intentionally deferred** ([[TASK-066]] · [[TASK-069]] · [[TASK-087]]).

### Dedicated portrait mid-continuation artwork

Class A portrait bands sufficient for V1. New master plate is asset cost, not a semantic gap.

*Classification:* **B intentionally deferred** ([[visual-debt]] · [[TASK-069]]).

### Per-title Destination Class C environment art

Same — Class A hybrid presence sufficient.

*Classification:* **B intentionally deferred** ([[visual-debt]] · [[TASK-069]]).

### Hard numeric episode filters in structured intent

Not required for Navigator V1 sufficiency.

*Classification:* **B intentionally deferred** ([[TASK-067]] · [[TASK-069]]).

### Optional engineering hygiene ([[TASK-063]])

Unused UI deps, Watchlist `storage` filter, living-light `will-change` scoping — non-blocking engineering follow-ups, not product features.

*Classification:* **B intentionally deferred** (engineering).

## Related

[[current-state]] · [[vision]] · [[data-flow]] · [[visual-language]] · [[TASK-069]]
