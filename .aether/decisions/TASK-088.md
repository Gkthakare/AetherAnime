# TASK-088 — Enable production analytics

Status: FROZEN
Area: Capital Phase · analytics · production

## Decision

**Production analytics enabled on `aetheranime.com` via existing TASK-086 server-side architecture.** Vercel Production env: `ANALYTICS_ENABLED`, `PLAUSIBLE_DOMAIN=aetheranime.com`, `PLAUSIBLE_API_HOST=https://plausible.io`. No browser Plausible snippet. Five CORE events operational through `POST /api/events` → Plausible Events API.

## Why

[[TASK-087]] Exp 1 requires analytics baseline before Capital experiments. [[TASK-086]] implementation was complete but disabled and uncommitted; canonical domain `aetheranime.com` is DNS-verified on Vercel.

## Protected behaviour

- No browser Plausible script; onboarding detector may show false negative — expected.
- No Navigator query logging; forbidden fields rejected with 204.
- No new cookies beyond TASK-086 analytics cookies; no analytics localStorage.
- Memory, Watchlist, Continue, Navigator, Destination behavior unchanged.
- GROWTH events remain unwired.

## Implementation area

- Vercel Production environment variables (operator-configured)
- Deploy from repo root: `npx vercel --prod --project aetheranime`
- Source: `apps/web/shared/analytics/`, `apps/web/app/api/events/route.ts`, widget emitters

## Contracts

- Plausible site domain: **aetheranime.com**
- Custom goals (manual UI): `world_entered`, `navigator_ask_submitted`, `destination_arrived`, `session_multi_destination`, `return_visit`
- Endpoint always returns **204**; invalid/forbidden payloads silently dropped

## Do not undo

- Do not add `@vercel/analytics` or Plausible browser snippet to satisfy onboarding.
- Do not enable analytics in client bundles via `NEXT_PUBLIC_*`.
- Do not wire GROWTH events without a follow-on task.

## Verified (TASK-088)

- Production deploy `dpl_Co9LfzSJw5mQb8J5ThpFV7JnFNQw` · alias `https://aetheranime.com`
- Vercel Production env: `ANALYTICS_ENABLED`, `PLAUSIBLE_DOMAIN`, `PLAUSIBLE_API_HOST`
- `/api/events` returns 204; valid CORE events set HttpOnly analytics cookies; forbidden payloads rejected silently
- Plausible Events API returns 202 for `aetheranime.com` domain
- No browser Plausible snippet in codebase

## Links

[[TASK-086]] · [[TASK-087]] · [[TASK-085]] · [[current-state]]
