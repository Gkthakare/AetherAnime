# Project

AetherAnime — an immersive anime experience delivered as a web application.

## Repository shape

```
apps/web/                 the application (only deployable)
  app/                    Next.js App Router routes + API routes
  widgets/                composed experience units (scene directors, layers, panels)
  shared/                 domain + platform code
    anime/                anime domain: catalog, resolver, discovery, watchlist, MAL adapters
    world/                world domain: registries, reducers, region model
    lib/                  motion, graphics, navigation helpers
    config/               theme + asset manifests
    ui/                   primitives (e.g. Surface)
  public/assets/          world artwork and posters
docs/                     long-form historical product/design docs (background only)
.aether/                  this brain
```

Import alias: `@/` → `apps/web/`.

## Toolchain

| Concern | Command | Notes |
|---|---|---|
| Dev server | `npm run dev` (in `apps/web`) | Next dev |
| Production build | `npm run build` | authoritative for performance QA |
| Production serve | `npm run start` | serve the built app for measurement |
| Lint | `npm run lint` | `eslint`, flat config in `eslint.config.mjs` |
| Types | `npx tsc --noEmit` | no dedicated script |
| Tests | `npx tsx --test <files>` | `node:test`; **no `test` script exists in `package.json`** |

Running the whole suite from `apps/web` (PowerShell):

```powershell
$files = Get-ChildItem -Recurse -Filter *.test.ts |
  Where-Object { $_.FullName -notmatch 'node_modules' } |
  ForEach-Object { $_.FullName }
npx tsx --test @files
```

## Layer rules

- `app/` resolves route data and mounts a director. It holds no presentation logic.
- `widgets/` composes. A widget owns its own presentation, motion, constants, and types in sibling files (`*.tsx`, `*.motion.ts`, `*.constants.ts`, `*.types.ts`, `*.css`, `*.test.ts`).
- `shared/` is framework-light and reusable. Domain logic lives here, never in a widget.
- Cross-widget reuse goes through `shared/`, never widget → widget deep imports of internals, with the documented exception of scene contexts (`world-scene-context`, `region-scene-context`) which widgets consume by design.

## Dependency policy

The dependency set is intentionally small: `next`, `react`, `framer-motion`, `tailwindcss`, `clsx`/`tailwind-merge`, `@base-ui/react`, `next-themes`, `class-variance-authority`. No state library, no data-fetching library, no animation library beyond framer-motion, no 3D/WebGL, no test framework beyond `node:test` + `tsx`.

Adding a dependency is a decision that requires explicit approval.

## Related

[[vision]] · [[engineering-rules]] · [[system]] · [[current-state]]
