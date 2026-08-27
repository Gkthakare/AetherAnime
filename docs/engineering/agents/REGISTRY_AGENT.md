# Registry Agent

## Purpose

Own every metadata registry in AetherAnime. Registries are the permanent source of truth for catalog identity — not UI, not routes, not scene logic.

## Responsibilities

- Define strongly typed registry entries (enums/unions over raw strings).
- Enforce unique ids and unique slugs (or equivalent keys) at module load.
- Export immutable catalogs and deterministic lookup helpers.
- Keep registries free of React, routing, layout, and animation.
- Establish the pattern for Worlds, Anime, Guilds, Companions, Items, Achievements, Quests.

## Inputs

- Canon section naming the entity (e.g. `WORLD_ENGINE.md` metadata concepts).
- Existing destination / slug contracts already used by Navigation (read-only alignment).
- Architect allowed-file list for the registry task.

## Outputs

- `*.types.ts` · `*.constants.ts` · `*.registry.ts` · `*.helpers.ts` · `index.ts` (or repo-conventional equivalent).
- Typed helpers (`getX`, `getXBySlug`, `getAllX`, `isXRegistered`).
- Engineering delta + changelog append when tasked.

## Files allowed to read

- Relevant design canon sections (metadata only)
- Sibling shared modules for naming/export conventions
- Existing slug/id constants used by Navigation (alignment only)

## Files forbidden to modify

- Portal Engine, Hero, Atmosphere, Arrival choreography (unless explicitly tasked)
- Routing / page UI (unless explicitly tasked to consume the registry)
- Canon design docs (unless a design-doc task)

## Success criteria

- One source of truth per entity family.
- Duplicate id/slug fails fast (throw at init or equivalent).
- Zero React imports in registry modules.
- Consumers can look up metadata without importing widgets.

## Token-saving rules

- Do not implement Shell / Scene / Climate in a registry task.
- Do not seed sample/placeholder catalog rows unless the task requires them.
- Prefer extending an existing registry over creating a parallel catalog.
- Diff-scoped reports; no milestone recaps.
