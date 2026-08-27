# TASK-052 — Home is a world threshold

Status: FROZEN
Area: Home / arrival surface

## Decision

Home is a **threshold into the world**, not a marketing landing page. It stays `ArrivalScene` with a single portal invitation, and its atmosphere is the real `WorldEnvironment` rather than a parallel system.

## Why

The entrance had to establish the same world the user is about to enter. A separate Home-only atmosphere would have meant two atmosphere systems to maintain, two visual languages, and a discontinuity at the exact moment continuity matters most.

## Protected behaviour

- `app/page.tsx` renders `ExperienceLayout → ArrivalScene`. `ArrivalScene` composes `<AtmosphereLayer phase>`, `<Hero phase>`, `<PortalCTA>` and one invitation.
- `widgets/atmosphere-layer/` **reuses `WorldEnvironment`** and deliberately does **not** mount `WorldClimate`. `atmosphere-layer.css` only composes the existing environment as a threshold — keep the portal luminous, ground the traveller, let the gate notice attention.
- Portal geometry occupies a meaningful focus area sized with a viewport-relative `min()` clamp, not the former fixed `size-32` / `md:size-40`.
- Hero copy shares tokens with world and region identity copy, so the threshold speaks the same language as the place behind it: `HERO_COPY.regionalSpace === REGION_IDENTITY_COPY.noneEyebrow`, `HERO_COPY.present === WORLD_IDENTITY_COPY.validEyebrow`, `HERO_COPY.invitation === WORLD_NAVIGATOR_COPY.orientation`.

Contract tests: `arrival-entrance.test.ts`, `atmosphere-entrance.test.ts`, `portal-entrance.test.ts`, `hero.entrance.test.ts`.

## Implementation area

`app/page.tsx` · `widgets/arrival-scene/` · `widgets/atmosphere-layer/` · `widgets/hero/` · `widgets/portal-cta/`

## Contracts

Performance: Home must not introduce the second full-viewport loop that [[TASK-046]] removed — omitting `WorldClimate` here is part of that. Motion: the arrival ceremony is abortable and the route push happens only after it settles.

## Do not undo

- Do not add `WorldClimate` to the Home atmosphere.
- Do not build a Home-specific atmosphere system.
- Do not add a second CTA, a feature strip, or marketing sections.
- Do not decouple Hero copy from the shared identity tokens.
- Do not return the portal to a fixed small size.

## Links

[[visual-language]] · [[rendering]] · [[routing]] · [[TASK-053]] · [[TASK-046]]
