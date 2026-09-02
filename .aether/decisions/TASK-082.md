# TASK-082 — Vercel production deploy + live QA

Status: FROZEN
Area: deployment / Vercel · live production verification

## Decision

**TASK-082 DEPLOYED — LIVE QA BLOCKED.** Production deploy of commit `10994f8` to project `aetheranime` (Root Directory `apps/web`) succeeded and is Ready. Live HTTPS QA passed Home/Idle/Destination/Continue/network/security/FPS gates, but the critical descriptive hunter/system Navigator query does **not** rank Solo Leveling: `/api/anime-intent` returns `{intent:null}` on Production, and the MAL title-search safety net for that long ask never includes Solo.

## Why

Deploy from monorepo root with linked Root Directory `apps/web` is required (deploying from `apps/web` fails looking for `apps/web/apps/web`). Env **names** are present on Production. Semantic parse still yields null live; ranking cannot invent Solo when discovery candidates omit it.

## Protected behaviour

- Do not claim **LIVE — V1 PRODUCTION VERIFIED** while hunter/system Solo ranking fails on the production alias.
- Do not print Production secret **values**.
- Do not invent `vercel.json` / Dockerfile / artwork APIs to “fix” deploy QA.
- Keep `assets/aether-058d-candidates/` out of production public assets.

## Implementation area

Ops: `npx vercel --prod` from repo root · project `aetheranime` · alias `https://aetheranime-tawny.vercel.app` · evidence `%TEMP%\aether-082-qa\`

## Contracts

- Deploy Ready: `dpl_G2m1gYGMUsoSNY8XoWcpgPa3FwFM`
- Pre-deploy gates: 494 / tsc / lint / build 0
- Live blocker: descriptive hunter ask → Solo not in top results

## Do not undo

- Do not unlink Root Directory from `apps/web`
- Do not weaken poster trust / Option D contain / arrival identity keying to chase this blocker

## Links

[[TASK-080]] · [[TASK-079]] · [[TASK-081]] · [[current-state]] · [[open-questions]]
