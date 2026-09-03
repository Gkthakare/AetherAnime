# Current State

Last verified: TASK-095 (**Capital experience Idle recomposition**)

## Completed

[[TASK-046]] · [[TASK-049]] · [[TASK-050]] · [[TASK-050.1]] · [[TASK-052]] · [[TASK-053]] · [[TASK-054]] · [[TASK-055]] · [[TASK-057-A]] · [[TASK-057-B]] · [[TASK-058-E]] · [[TASK-059]] · [[TASK-060]] · [[TASK-061]] · [[TASK-062]] · [[TASK-063]] · [[TASK-064]] · [[TASK-065]] · [[TASK-066]] · [[TASK-067]] · [[TASK-068]] · [[TASK-069]] · [[TASK-070]] · [[TASK-071]] · [[TASK-072]] · [[TASK-073]] · [[TASK-074]] · [[TASK-075]] · [[TASK-076]] · [[TASK-077]] · [[TASK-078]] · [[TASK-079]] · [[TASK-080]] · [[TASK-081]] · [[TASK-082]] · [[TASK-083]] · [[TASK-084]] · [[TASK-085]] · [[TASK-086]] · [[TASK-087]] · [[TASK-088]] · [[TASK-089]] · [[TASK-090]] · [[TASK-092]] · [[TASK-093]] · [[TASK-094]] · [[TASK-095-A]] · [[TASK-095]]

## Phase

**V1 engineering:** complete · production verified ([[TASK-083]])

**Capital Phase:** analytics enabled ([[TASK-088]]); Plausible attribution fixed ([[TASK-089]]); **Experiment 1 baseline ACTIVE** ([[TASK-090]]) — started 2026-09-03T05:00:00+05:30; readout 2026-09-10T05:00:00+05:30

## Surfaces

**HOST** — Canonical: `https://aetheranime.com` · `https://www.aetheranime.com` · Vercel alias `aetheranime-tawny.vercel.app` · Root Directory `apps/web`

**PRODUCT ANALYTICS** — ON in Production (`ANALYTICS_ENABLED=true`, `PLAUSIBLE_DOMAIN=aetheranime.com`). Server-side `/api/events` → Plausible. No browser snippet.

## Verified

- 582 tests; tsc/lint/build 0 ([[TASK-095]]).
- Production: HTTPS both domains; `/api/events` accepts CORE events; forbidden payloads return 204.

## Next

- **Exp 1 (ACTIVE):** accumulate 7-day funnel baseline; first readout 2026-09-10T05:00:00+05:30 ([[TASK-090]]).
- **TASK-096:** Destination activity-first layout (deferred from TASK-095).
- Operator: confirm CORE custom goals in Plausible UI for `aetheranime.com` if not already done.
- Legal/privacy review for EU/India traffic if not already done.

## Related

[[visual-debt]] · [[open-questions]] · [[decisions/INDEX|decisions]]
