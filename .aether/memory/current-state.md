# Current State

Last verified: TASK-089 (**Plausible visitor attribution fix**)

## Completed

[[TASK-046]] · [[TASK-049]] · [[TASK-050]] · [[TASK-050.1]] · [[TASK-052]] · [[TASK-053]] · [[TASK-054]] · [[TASK-055]] · [[TASK-057-A]] · [[TASK-057-B]] · [[TASK-058-E]] · [[TASK-059]] · [[TASK-060]] · [[TASK-061]] · [[TASK-062]] · [[TASK-063]] · [[TASK-064]] · [[TASK-065]] · [[TASK-066]] · [[TASK-067]] · [[TASK-068]] · [[TASK-069]] · [[TASK-070]] · [[TASK-071]] · [[TASK-072]] · [[TASK-073]] · [[TASK-074]] · [[TASK-075]] · [[TASK-076]] · [[TASK-077]] · [[TASK-078]] · [[TASK-079]] · [[TASK-080]] · [[TASK-081]] · [[TASK-082]] · [[TASK-083]] · [[TASK-084]] · [[TASK-085]] · [[TASK-086]] · [[TASK-087]] · [[TASK-088]]

## Phase

**V1 engineering:** complete · production verified ([[TASK-083]])

**Capital Phase:** analytics enabled ([[TASK-088]]); **Plausible attribution fixed** ([[TASK-089]]); Exp 1 baseline safe after operator re-verifies dashboard

## Surfaces

**HOST** — Canonical: `https://aetheranime.com` · `https://www.aetheranime.com` · Vercel alias `aetheranime-tawny.vercel.app` · Root Directory `apps/web`

**PRODUCT ANALYTICS** — ON in Production (`ANALYTICS_ENABLED=true`, `PLAUSIBLE_DOMAIN=aetheranime.com`). Server-side `/api/events` → Plausible. No browser snippet.

## Verified

- 529 tests; tsc/lint/build 0 ([[TASK-088]]).
- Production: HTTPS both domains; `/api/events` accepts CORE events; forbidden payloads return 204.

## Next

- Operator: confirm CORE custom goals in Plausible UI for `aetheranime.com`.
- Exp 1: accumulate 7-day funnel baseline ([[TASK-087]]).
- Legal/privacy review for EU/India traffic if not already done.

## Related

[[visual-debt]] · [[open-questions]] · [[decisions/INDEX|decisions]]
