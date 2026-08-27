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

## Intentionally deferred (outside V1 / future product decision)

### First Vercel production deploy (Production env)

Project `aetheranime` is linked with Root Directory `apps/web`. Auth OK. **Production environment variables are not configured on Vercel** (all required names missing). User must set Production values in Vercel (names from `apps/web/.env.example`), then a later task may `cd apps/web && npx vercel --prod`.

*Classification:* **ops blocker — user action** ([[TASK-072]] · [[TASK-077]] · [[TASK-078]] · [[TASK-079]]).

### Arrive-from-memory / Horizon interaction

Horizon stays non-interactive residual. Making Horizon a resume surface would collide with Continue semantics and needs an explicit product decision — not automatic.

*Classification:* **B intentionally deferred** ([[TASK-069]]).

### Account / server Memory sync

Local-only Memory/Watchlist remains V1. Cloud sync needs privacy, migration, and ownership decisions.

*Classification:* **B intentionally deferred** ([[TASK-066]] · [[TASK-069]]).

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
