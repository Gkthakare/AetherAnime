# TASK-053 — World idle is a place, not a centered overlay

Status: FROZEN
Area: world idle surface

## Decision

The world idle surface is composed as a **place you are standing in**. The world name is a quiet location marker, the Navigator is an instrument rather than a search field, the layout is not centered, and regions travel as a path.

## Why

Idle was reading as a landing page: a large centered title over a large centered search box, with regions stacked as cards beneath. Every one of those is a website convention, and together they undid the arrival the portal had just created.

## Protected behaviour

- **Identity as location marker** — `WORLD_IDENTITY_TITLE_SCALE.name` is `text-2xl sm:text-3xl lg:text-4xl`; no `text-6xl`/`text-7xl`. It is deliberately quieter than the Home threshold title. The invitation tagline is skipped on valid worlds.
- **Navigator as instrument** — `WORLD_NAVIGATOR_THRESHOLD.form` is `max-w-md` and is not `items-center`; the input is not `text-center`. Left-aligned and quietly oriented.
- **Layout is not a hero** — `WORLD_LAYOUT_IDLE` contains no `items-center` and no `text-center`. The identity column is `items-stretch` on idle and `items-center` only on arrival.
- **Regions as a path** — `WORLD_KIND_REGION_PATH` is `flex-row`; regions carry `data-region-availability`; they are no longer a fixed-height stacked plate list.
- **Idle identity veil relocated** — `world-place.css` replaces the large center ellipse with a small top-left location marker for idle. Destination keeps the existing identity veil.

Contract tests: `world-identity.place.test.ts`, `world-navigator.place.test.ts`, `world-layout.place.test.ts`, `world-kind.path.test.ts`.

## Implementation area

`widgets/world-identity/` · `widgets/world-navigator/` · `widgets/world-layout/` (incl. `world-place.css`) · `widgets/world-kind/` · `widgets/world-scene/`

## Contracts

Performance: `world-layout.place.test.ts` also re-asserts the [[TASK-046]] living-light budget, so layout work cannot quietly reintroduce the compositor regression.

## Do not undo

- Do not re-center the idle composition or restore a hero-scale world title.
- Do not turn the Navigator back into a centered website search field.
- Do not return regions to a stacked equal-weight plate list.
- Do not restore the full-screen identity ellipse on idle.
- Arrival composition (`items-center`) is separate and stays as it is.

## Links

[[TASK-052]] · [[visual-language]] · [[rendering]] · [[TASK-054]]
