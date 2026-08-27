# AetherAnime Visual Production Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a production asset convention and a visibly richer layered AetherAnime world environment using one optimized local hero plate.

**Architecture:** A typed static asset manifest maps semantic identities to public files. A presentation-only `WorldEnvironment` widget renders the image and static depth layers inside the existing World presence slot, below WorldClimate and RegionClimate. Existing World/Region runtime ownership and interactions remain unchanged.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, Framer Motion foundations, local WebP/AVIF assets.

---

## File map

**Create**

- `apps/web/public/assets/aetheranime/worlds/aetheranime/environment/aetheranime-world-hero.webp` — generated optimized environment plate.
- `apps/web/shared/config/assets/aetheranime.assets.ts` — typed semantic local asset paths.
- `apps/web/shared/config/assets/index.ts` — manifest exports.
- `apps/web/widgets/world-environment/world-environment.tsx` — decorative layered world scene.
- `apps/web/widgets/world-environment/world-environment.types.ts` — presentation props.
- `apps/web/widgets/world-environment/index.ts` — widget export.

**Modify**

- `apps/web/widgets/world-scene/world-scene.tsx` — compose environment before climate overlays.
- `docs/engineering/CHANGELOG.md` — append one Sprint-004 Task-001 entry after verification.

**Must not modify**

- Portal Engine files.
- Region runtime, Focus, activation, navigation, registry, or motion contracts.
- Package dependencies.

### Task 1: Generate and place the production environment plate

- [ ] **Step 1: Generate the image**

Generate a 16:9 cinematic plate with this exact direction:

> Wide cinematic anime-inspired environment for “AetherAnime, an operating system for entering anime worlds.” Ancient technological megastructures recede into a deep navy and blue-black void; monumental broken arches and floating architectural fragments frame the far left and right; a restrained cyan dimensional light rises from the center distance; subtle indigo and violet atmosphere; slight surreal depth; premium mysterious mood; open dark central negative space for readable interface typography and region controls; layered foreground silhouettes at the lower edges; no characters, no text, no logos, no cards, no dashboard, no bright rainbow, no dominant circular portal, no generic cyberpunk city. Production background plate, detailed but compositionally quiet.

Expected output: one 16:9 image.

- [ ] **Step 2: Convert/optimize and place**

Place the final file at:

`apps/web/public/assets/aetheranime/worlds/aetheranime/environment/aetheranime-world-hero.webp`

Target: WebP, approximately 1920×1080, preferably under 500 KB without visible banding.

- [ ] **Step 3: Inspect the file**

Read the image and confirm:

- central interface-safe negative space
- dark edges and lower foreground
- cyan/indigo hierarchy
- no text, logos, people, cards, or portal dominance

### Task 2: Add the static asset manifest

- [ ] **Step 1: Create `aetheranime.assets.ts`**

```ts
export const AETHERANIME_ASSETS = {
  worlds: {
    aetheranime: {
      environment: {
        hero: '/assets/aetheranime/worlds/aetheranime/environment/aetheranime-world-hero.webp',
      },
    },
  },
} as const;

export type AetherAnimeAssets = typeof AETHERANIME_ASSETS;
```

- [ ] **Step 2: Add the barrel export**

```ts
export { AETHERANIME_ASSETS } from './aetheranime.assets';
export type { AetherAnimeAssets } from './aetheranime.assets';
```

- [ ] **Step 3: Type-check the manifest**

Run:

`npx tsc --noEmit`

Expected: no errors.

### Task 3: Build the layered WorldEnvironment widget

- [ ] **Step 1: Add props type**

```ts
export type WorldEnvironmentProps = {
  className?: string;
};
```

- [ ] **Step 2: Add the component**

The component must:

- render a root `data-slot="world-environment"`
- be `aria-hidden="true"` and `pointer-events-none`
- use an absolute inset root with overflow hidden
- render the hero through `next/image` using `fill`, `priority`, `sizes="100vw"`, and `object-cover`
- use semantic manifest path only
- add static base, depth veil, central light, vignette, and foreground haze layers
- preserve central readability
- contain no hooks, state, registry lookup, or animation loop

Representative structure:

```tsx
<div data-slot="world-environment" aria-hidden="true">
  <div data-slot="world-environment-base" />
  <Image src={AETHERANIME_ASSETS.worlds.aetheranime.environment.hero} ... />
  <div data-slot="world-environment-depth" />
  <div data-slot="world-environment-light" />
  <div data-slot="world-environment-vignette" />
  <div data-slot="world-environment-foreground" />
</div>
```

- [ ] **Step 3: Add widget barrel**

```ts
export { WorldEnvironment } from './world-environment';
export type { WorldEnvironmentProps } from './world-environment.types';
```

- [ ] **Step 4: Run scoped lint**

Run:

`npx eslint "shared/config/assets/**/*.{ts,tsx}" "widgets/world-environment/**/*.{ts,tsx}" --max-warnings 0`

Expected: no warnings/errors.

### Task 4: Compose the environment in WorldScene

- [ ] **Step 1: Import the widget**

Add:

```ts
import { WorldEnvironment } from '@/widgets/world-environment';
```

- [ ] **Step 2: Insert below climate overlays**

Change the default presence fragment to:

```tsx
<>
  <WorldEnvironment />
  <WorldClimate />
  <RegionClimate />
</>
```

Do not change slots, Focus, activation, navigation, lifecycle, presence, RegionScene, or motion.

- [ ] **Step 3: Run type and scoped lint**

Run:

`npx tsc --noEmit`

Then:

`npx eslint "shared/config/assets/**/*.{ts,tsx}" "widgets/world-environment/**/*.{ts,tsx}" "widgets/world-scene/world-scene.tsx" --max-warnings 0`

Expected: both pass.

### Task 5: Visual QA

- [ ] **Step 1: Start or reuse one dev server**

Before starting, inspect existing terminals. If no server is running:

`npm run dev`

- [ ] **Step 2: Inspect `/world/aetheranime`**

Verify:

- the black void is replaced by a layered environment
- world identity remains legible
- region interaction surfaces remain visually primary
- cyan dimensional light does not overpower text
- desktop and narrow viewport crop correctly
- no layout shift or pointer interception
- hover, keyboard Focus, activation, and portal activity remain unchanged
- reduced-motion retains the static scene and starts no new loop

- [ ] **Step 3: Adjust only WorldEnvironment presentation**

If hierarchy fails, modify only the widget’s image opacity, gradients, masks, or object positioning. Do not compensate by changing runtime engines or unrelated widgets.

### Task 6: Verification and documentation

- [ ] **Step 1: Run final TypeScript**

`npx tsc --noEmit`

Expected: pass.

- [ ] **Step 2: Run final scoped ESLint**

`npx eslint "shared/config/assets/**/*.{ts,tsx}" "widgets/world-environment/**/*.{ts,tsx}" "widgets/world-scene/world-scene.tsx" --max-warnings 0`

Expected: pass.

- [ ] **Step 3: Run Next build exactly once**

Confirm no build is active, then:

`npx next build`

Expected: production build succeeds and `/world/[destination]` remains available.

- [ ] **Step 4: Append one CHANGELOG entry**

Document only:

- asset convention + manifest
- generated environment plate
- WorldEnvironment composition
- visual result
- performance
- verification
- external/manual limitations
- next visual dependency

Do not rewrite historical entries.

- [ ] **Step 5: Check edited-file diagnostics**

Read lints for all edited TypeScript/TSX files and fix introduced diagnostics.
