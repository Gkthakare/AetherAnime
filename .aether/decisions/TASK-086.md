# TASK-086 — Capital Phase instrumentation foundation

Status: FROZEN
Area: product analytics · privacy boundary · Capital Phase

## Decision

**Hybrid (F): Plausible hosted + server-trusted `/api/events`.** Minimum instrumentation foundation shipped: CORE funnel events only, coarse structured properties, HttpOnly anonymous visitor cookies (separate from Memory/Watchlist), client fire-and-forget emitters at committed boundaries, server validation + Plausible forward when `ANALYTICS_ENABLED=true` and `PLAUSIBLE_DOMAIN` are set. Navigator query text is permanently forbidden.

**Provider selected:** **Plausible (hosted)** for acquisition/page baseline + **custom `/api/events`** for product funnel. Rejected sole reliance on Vercel Web Analytics (no custom funnel), Umami (same class as Plausible but less mature custom-props docs for this stack), self-hosted Umami/Plausible (ops cost), and custom-only (no acquisition dashboard without building one).

## Why

[[TASK-085]] established zero analytics and a hybrid recommendation. Early-stage AetherAnime needs privacy-preserving acquisition (referrer/UTM via Plausible + dashboard), meaningful funnel measurement (distinct Destination arrivals), low cost (Plausible low-traffic tier; no extra infra), low implementation complexity (one API route + thin client), and growth without immediate migration (Plausible scales; product events stay in our schema).

## Protected behaviour

- Navigator text never in analytics payloads — guarded by `analytics.validate.ts` + `FORBIDDEN_PROPERTY_KEYS`.
- Memory (`aetheranime.memory.v1`) and Watchlist (`aetheranime.watchlist.v1`) never read for analytics identity — guarded by source scan test.
- `destination_arrived` fires on committed `arrivedAnime` only (same boundary as [[TASK-057-A]] Memory).
- Analytics failure returns **204** and never breaks World/Navigator/Destination — guarded by emit + route tests.
- No analytics IDs in React context or URLs.
- Server secrets (`ANALYTICS_ENABLED`, `PLAUSIBLE_DOMAIN`) never in client bundles.

## Implementation area

- `apps/web/shared/analytics/` — schema, validation, dedupe, session, record, server forwarder
- `apps/web/app/api/events/route.ts` — ingress + visitor cookies + `return_visit`
- Wired: `world-scene.tsx`, `world-navigator.tsx`, `anime-destination-paths.tsx` (kinship via)
- Config: `apps/web/.env.example`

## Contracts

### Provider comparison (summary)

| Option | Verdict |
|---|---|
| A Vercel Web Analytics | Rejected — pageviews only, insufficient custom product funnel |
| B Plausible hosted | **Selected (baseline)** — cookieless-friendly, UTM/referrer, low cost, Vercel-compatible |
| C Umami hosted | Viable alternate; not selected — similar to B |
| D Self-hosted Umami/Plausible | Rejected for early stage — infra/ops cost |
| E Custom endpoint only | Required half — insufficient acquisition UI alone |
| F Hybrid | **Selected** — Plausible + `/api/events` |

### Event contract

**CORE (implemented):**

| Event | Emitter | Trigger | Required props | Dedupe |
|---|---|---|---|---|
| `world_entered` | Client | WorldScene first mount | `source`, `session_id` | per session |
| `navigator_ask_submitted` | Client | Navigator plan resolved on submit | `ask_class`, `session_id` | session + ask_class |
| `destination_arrived` | Client | `arrivedAnime` committed | `anime_id`, `slug`, `origin`, `via`, `session_id` | session + anime_id |
| `session_multi_destination` | Client | 2nd distinct anime in session | `distinct_count` (2), `session_id` | session + count |
| `return_visit` | **Server** | New analytics session after 30m gap | `days_since_last`, `had_destination` | server session cookie |

**GROWTH (schema only — not wired):** `navigator_results_shown`, `destination_settled`, `continue_used`, `watchlist_saved`, `home_viewed`.

**Forbidden on all events:** `query`, `prompt`, `text`, `transcript`, `intent`, `semantic_intent`, `user_input`, `message`, `voice`, `ip`, `fingerprint`, `user_agent`, `mouse`, `keystroke`.

### Identity / session model

- **Visitor:** HttpOnly `aether_vid` UUID (365d), set by `/api/events` — **not** Memory/Watchlist.
- **Analytics session:** in-memory `session_id` per tab load; server `aether_sess` (30m gap).
- **Distinct Destination count:** in-memory `Set<anime_id>` per tab session.
- **Return visit / D1/D7:** Plausible retention + `return_visit` event; no accounts.

### Privacy / consent

- HttpOnly cookies for anonymous visitor + return measurement only.
- No localStorage analytics keys. No fingerprinting. No Navigator text.
- **Legal review required (GDPR / India DPDP):** cookie disclosure, lawful basis, retention (365d), cross-border transfer if applicable.
- No consent UI implemented — operator decides EU opt-in before enabling.

### Operator configuration (production)

```
ANALYTICS_ENABLED=true
PLAUSIBLE_DOMAIN=<production-domain>
PLAUSIBLE_API_HOST=https://plausible.io   # optional
```

Register domain in Plausible; enable custom event goals for CORE names.

## Do not undo

- Do not log Navigator queries to Plausible props or server logs.
- Do not read Memory/Watchlist for analytics identity.
- Do not add `@vercel/analytics` or ad pixels without a new decision.
- Do not block product flows on analytics success.

## Links

[[TASK-085]] · [[TASK-057-A]] · [[TASK-062]] · [[TASK-066]] · [[TASK-083]] · [[data-flow]] · [[current-state]]
