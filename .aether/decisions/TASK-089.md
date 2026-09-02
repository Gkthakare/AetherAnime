# TASK-089 — Plausible server-side visitor attribution fix

Status: FROZEN
Area: Capital Phase · analytics · production

## Decision

**Plausible forwarding now preserves the incoming browser `User-Agent` and client IP (`X-Forwarded-For` first hop) as HTTP headers only, and sends product page URLs instead of `/api/events`.** Root cause of curl attribution and dropped goals was server-side Events API misuse per Plausible docs.

## Why

Production dashboard showed Browser=curl, Top Page=/api/events, and only `world_entered` in goals despite browser `/api/events` 204s. Source inspection confirmed hardcoded `User-Agent: AetherAnimeAnalytics/1.0`, missing `X-Forwarded-For`, and `url: https://aetheranime.com/api/events`. Plausible bot filtering drops such events with HTTP 202 + `x-plausible-dropped: 1`.

## Protected behaviour

- IP and User-Agent never in event props or client payloads.
- No browser Plausible snippet. Privacy boundary unchanged.
- `/api/events` still returns 204; analytics failure non-blocking.

## Implementation area

- `apps/web/shared/analytics/analytics.server.ts` — transport resolution, page URL, forward headers
- `apps/web/app/api/events/route.ts` — pass request headers to forwarder
- `apps/web/shared/analytics/analytics.plausible-forward.test.ts`

## Links

[[TASK-086]] · [[TASK-088]] · [[current-state]]
