# MILESTONE-001 — Architecture Audit

> First formal architecture review for AetherAnime.
> This document is a permanent architectural artifact. It is intended to be re-read and referenced throughout the project's lifetime.

---

## Cover

| Field | Value |
| --- | --- |
| **Project** | AetherAnime — "Anime Operating System" |
| **Tagline** | Enter the World Beyond the Screen |
| **Branch** | `feature/experience-engine` |
| **Audit Date** | 2026-08-04 |
| **Reviewer** | Principal Software Architect (Architecture Review Board) |
| **Milestone** | 001 — Foundation |
| **Repository Status** | Working tree **dirty**. The entire theme / graphics / motion foundation is **uncommitted** (untracked), and `apps/web/shared/styles/theme.ts` is staged for deletion. HEAD is at `5ea4521 feat(experience): introduce reusable ExperienceLayout`. |
| **Latest committed work** | Reusable `ExperienceLayout` widget |
| **Audit scope** | Full repository as it exists on disk today (tracked + untracked), excluding `node_modules`, `.next`, `dist`, `build`, `coverage`. |
| **Constraint** | Read-only review. No application code was modified, refactored, or created. |

---

## Executive Summary

AetherAnime is at the **foundation stage** of an ambitious, vision-first project. The stated product is not an anime streaming site but an "Anime Operating System" whose product is *immersion*. The repository reflects an unusually mature intent: the documentation articulates a coherent philosophy (immersion over feature count, systems over pages, platform independence), and the newly introduced `shared/` foundation — design tokens, a graphics primitive library, and a layered motion library — is written to a standard well above what a typical early-stage project produces. The inline documentation inside these token modules is, frankly, exceptional: each primitive explains its role, its composition layer, and its cross-platform rationale. This is the strongest signal in the entire codebase.

However, there is a large and important gap between **what is described** and **what actually runs**. The rendered product today is a single static landing page: a `Hero` (`<h1>AetherAnime</h1>` plus a tagline) mounted inside an `ExperienceLayout`. None of the foundation is consumed by any rendered component. The motion presets (`heroReveal`) animate nothing; the graphics primitives (`glass`, `glow`, `gradients`) style nothing; the semantic design tokens are disconnected from the CSS variables that Tailwind and shadcn actually use. Powerful libraries — Three.js / react-three-fiber, GSAP, Lenis, React Query, Zustand, React Hook Form, Zod — are installed but entirely unused. In short, the *capability surface* has been declared far ahead of the *behavioral surface*.

The architecture is directionally correct and the code quality of the foundation is high, but three structural inconsistencies must be resolved before the project scales: (1) two competing theme systems that do not reference each other (TypeScript tokens vs. shadcn CSS variables), (2) two competing structural conventions living side by side (Feature-Sliced `shared/`/`widgets/` vs. shadcn-default `components/`/`lib/`), and (3) a claimed-but-absent quality gate (the Husky pre-commit hook runs `npm test`, but no test script, framework, or test exists, and the installed `lint-staged` is never wired in). The project is **close** to being ready to transition from foundation work to immersive experience implementation — but it should first commit the foundation, unify the two theme systems, and consume the foundation in at least one real widget to prove the layering end-to-end.

---

## Repository Structure

Important tree (build artifacts and dependencies omitted):

```
AetherAnime/
├─ README.md                      # EMPTY (0 bytes)
├─ .gitignore
├─ docs/
│  ├─ AI_CONTEXT/
│  │  ├─ README.md                # Engineering Handbook (index / philosophy)
│  │  └─ PROJECT_CONTEXT.md        # Product vision + pillars (living doc)
│  └─ architecture/
│     └─ README.md                # Architecture Handbook (layered vision)
└─ apps/
   └─ web/
      ├─ AGENTS.md                # Next.js "not the version you know" note
      ├─ CLAUDE.md                # @AGENTS.md include
      ├─ README.md                # Default create-next-app README
      ├─ package.json             # Deps + scripts (no "test")
      ├─ package-lock.json
      ├─ tsconfig.json            # strict, paths: @/* -> ./*
      ├─ next.config.ts           # empty config
      ├─ eslint.config.mjs        # flat config, next core-web-vitals + ts
      ├─ postcss.config.mjs       # @tailwindcss/postcss (Tailwind v4)
      ├─ components.json          # shadcn (style: base-nova, rsc)
      ├─ .prettierrc / .prettierignore
      ├─ .husky/
      │  └─ pre-commit            # runs `npm test`  ← no test exists
      ├─ public/                  # default next/vercel SVGs
      ├─ app/                     # App Router
      │  ├─ layout.tsx            # fonts + <AppProvider>
      │  ├─ page.tsx              # ExperienceLayout > Hero
      │  ├─ globals.css           # Tailwind v4 @theme + shadcn CSS vars
      │  └─ favicon.ico
      ├─ components/
      │  └─ ui/
      │     └─ button.tsx         # shadcn Button (base-ui) — UNUSED
      ├─ lib/
      │  └─ utils.ts              # cn() helper
      ├─ shared/                  # ← Feature-Sliced "shared" layer
      │  ├─ providers/
      │  │  ├─ app-provider.tsx   # Theme + Query composition
      │  │  ├─ theme-provider.tsx # next-themes wrapper
      │  │  ├─ query-provider.tsx # React Query client
      │  │  └─ index.ts
      │  ├─ config/
      │  │  └─ theme/             # ← UNTRACKED (design tokens)
      │  │     ├─ colors.ts  typography.ts  spacing.ts
      │  │     ├─ radius.ts  z-index.ts  breakpoints.ts
      │  │     └─ index.ts        # `theme` aggregate + barrel
      │  ├─ lib/                  # ← UNTRACKED
      │  │  ├─ graphics/          # blur, borders, elevation, glow,
      │  │  │                     #   gradients, glass (+ index)
      │  │  └─ motion/            # constants, transitions, variants,
      │  │                        #   presets (+ index)
      │  └─ styles/
      │     └─ theme.ts           # ← STAGED FOR DELETION (old flat theme)
      └─ widgets/                 # ← Feature-Sliced "widgets" layer
         ├─ experience-layout/
         │  ├─ experience-layout.tsx
         │  └─ index.ts
         └─ hero/
            ├─ hero.tsx
            └─ index.ts
```

**Observations on structure:**

- The repo uses an `apps/web` layout that *implies* a monorepo, but there is **no monorepo tooling** (no root `package.json`, no `pnpm-workspace.yaml`, no Turborepo/Nx). The root is effectively a container with a single app plus docs. This is fine today but is an undeclared decision that should be made explicit.
- The **root `README.md` is empty** — the first file any human or tool opens tells them nothing.
- The documentation directory promises six sub-domains (`AI_CONTEXT/ architecture/ design/ roadmap/ decisions/ research/ api/`) but only three files across two directories exist.

---

## Documentation Review

| Document | Summary | Completeness |
| --- | --- | --- |
| `README.md` (root) | Empty file. | **0/10** — Missing entirely. This is the front door. |
| `docs/AI_CONTEXT/README.md` | "Engineering Handbook" — declares docs as a first-class artifact, defines reading order, engineering workflow (Vision→Architecture→…→Release), AI collaboration principles, long-term vision list. Strong, well-written narrative. | **7/10** — Excellent as an index, but references directories (`design/`, `roadmap/`, `decisions/`, `research/`, `api/`) that do not exist, so its "reading order" points at missing documents. |
| `docs/AI_CONTEXT/PROJECT_CONTEXT.md` | "Project Context" — product identity, vision statement, six product pillars (Immersion, Emotion, Simplicity, Performance, Scalability, Longevity), target emotional journey, technical/design philosophy, engine list (Experience/World/Motion/Graphics/Interaction/Audio/AI). The clearest articulation of *why* the project exists. | **8/10** — Content is genuinely strong and coherent. Defects: a duplicated title (`# PROJECT_CONTEXT.md` then `# AetherAnime Project Context`) and a placeholder `Last Updated: YYYY-MM-DD`. |
| `docs/architecture/README.md` | "Architecture Handbook" — experiences-over-pages philosophy, a 7-tier layered model (Users→Experience→Feature→Domain→Engine→Infrastructure→Platform), architectural goals, and a list of documents that "will eventually" exist. | **6/10** — Compelling vision, but describes an aspirational layered architecture that the code does not yet implement, and every concrete document it lists is still a placeholder. |
| `apps/web/README.md` | Unmodified `create-next-app` boilerplate. | **1/10** — Not project-specific; should describe the app. |
| `apps/web/AGENTS.md` / `CLAUDE.md` | AI guardrail: "this is not the Next.js you know," instructing agents to read `node_modules/next/dist/docs/` before coding. `CLAUDE.md` simply includes `@AGENTS.md`. | **7/10** — Small but genuinely useful AI-directed guidance. |

**Overall documentation assessment.** The *vision and philosophy* documentation is a standout — it is the kind of north-star writing most funded startups never produce. The weakness is that documentation currently describes a system far larger than the one that exists, and the operational docs (root README, per-app README, ADRs, architecture detail docs) are missing or boilerplate. The handbook's own principle — "if implementation and documentation disagree, resolve immediately" — is already being violated: the docs describe seven layers and seven engines; the code has three layers and zero engines. This is expected at Milestone 001, but the gap must be tracked honestly.

---

## Feature-Sliced Architecture Review

The project adopts a **Feature-Sliced Design (FSD)**-inspired layering. FSD's canonical layer order (high → low) is `app → processes → pages → widgets → features → entities → shared`. Only three layers are present.

### `app`
- **Purpose:** Composition root and Next.js App Router entry. Wires fonts, global styles, providers, and the root route.
- **Current contents:** `layout.tsx` (fonts + `<AppProvider>`), `page.tsx` (`ExperienceLayout > Hero`), `globals.css`, `favicon.ico`.
- **Maturity:** **Functional / minimal.** Single route, no `loading.tsx`, `error.tsx`, `not-found.tsx`, `template.tsx`, or route groups. No metadata beyond title/description.
- **Future direction:** Introduce route groups (e.g. `(experience)`, `(platform)`), global error/loading boundaries, and richer metadata (Open Graph, icons, sitemap/robots) as routes multiply.

### `shared`
- **Purpose:** Cross-cutting, feature-agnostic foundation reusable by every layer.
- **Current contents:** `providers/` (theme, query, composition), `config/theme/` (design tokens), `lib/graphics/`, `lib/motion/`, and a legacy `styles/theme.ts` (being deleted).
- **Maturity:** **The most mature layer by far** — see Shared Infrastructure Review. Well-layered, documented, immutable, typed.
- **Future direction:** Add the missing shared modules the audit brief expects — `shared/hooks/`, `shared/types/`, `shared/lib/utils/` (currently `lib/utils.ts` lives outside FSD), and an `api`/`fetch` client for React Query. Consider promoting the platform "engines" here or into a dedicated layer.

### `widgets`
- **Purpose:** Self-contained, composable UI blocks that assemble shared primitives into meaningful sections.
- **Current contents:** `experience-layout` (full-height black shell with a centered `<main>`), `hero` (title + tagline).
- **Maturity:** **Embryonic.** Two widgets, both static, neither consuming the motion/graphics/theme foundation. `Hero` uses raw utilities (`text-zinc-400`, `text-white`); `ExperienceLayout` uses `bg-black`.
- **Future direction:** This is where the foundation must start being consumed. `Hero` should use `heroReveal` + `gradients.hero`/`glow.hero`; `ExperienceLayout` should use `gradients.background` and `zIndex` tokens.

### `entities` — **DOES NOT EXIST**
- **Purpose (intended):** Business/domain nouns (Anime, Episode, User, Companion) with their models, and minimal UI.
- **Future direction:** Introduce once real anime data enters the system. Define `Anime`, `Episode`, `Season`, `Genre` entities with Zod schemas and React Query hooks.

### `features` — **DOES NOT EXIST**
- **Purpose (intended):** User-facing interactions/verbs (search, add-to-list, play, follow-companion).
- **Future direction:** Introduce alongside entities; features compose entities + shared and are consumed by widgets/pages.

### `pages` — **DOES NOT EXIST** (as an FSD layer)
- **Purpose (intended):** Route-level composition of widgets/features. In Next.js App Router this role is partly played by `app/`, so the team must decide whether to keep an FSD `pages` layer or let `app/` own composition. **Ambiguity to resolve.**

### `processes` — **DOES NOT EXIST**
- **Purpose (intended):** Cross-page flows (onboarding, auth, multi-step journeys). This layer is deprecated in modern FSD; the "Experience Engine" concept may replace it.
- **Future direction:** Likely folded into an explicit `engines`/`experience` concept rather than a literal `processes` layer.

**Layer summary.** 3 of 7 layers exist (`app`, `shared`, `widgets`). The middle of the pyramid (`features`, `entities`) is empty, which is correct for a foundation milestone — but note that `widgets` currently reaches straight into `shared` with nothing in between, so the layering has not yet been *stress-tested*. The FSD adoption is currently a **convention, not yet an enforced boundary** (no `eslint-plugin-boundaries` or Steiger).

---

## Shared Infrastructure Review

### Motion (`shared/lib/motion`)
Four clean layers, each composed from the one below — this is textbook and the composition is real, not cosmetic:
- `constants.ts` — `DURATION`, `EASING` (typed cubic-beziers), `DISTANCE`, `SCALE`, `STAGGER`, `DELAY`. Durations in seconds to match Framer Motion.
- `transitions.ts` — named `Transition` objects (`fast/normal/slow/cinematic/spring`) built only from constants.
- `variants.ts` — foundational `Variants` (`fadeIn/Out`, `slideUp/Down`, `scaleIn`, `staggerContainer`) referencing `DISTANCE`/`SCALE`/`STAGGER`.
- `presets.ts` — spreadable `MotionPreset`s (`heroReveal`, `sectionReveal`, `cardReveal`) bundling variant + transition + orchestration.

**Verdict:** Excellent design. The only gap is that `EASING` is typed `satisfies Record<string, CubicBezier>` deliberately to stay assignable to Framer's mutable `Easing`, which is a thoughtful detail. **Zero runtime consumption today.**

### Graphics (`shared/lib/graphics`)
Six primitives with a clear composition chain (`blur` + `borders` → `glass`; `elevation`, `glow`, `gradients` atomic). Each primitive ships **two forms**: raw framework-agnostic tokens (`BLUR_RADIUS`, `ELEVATION_SHADOW`, `GLOW_COLOR`, `GRADIENT`, `BORDER_COLOR`) and static Tailwind utility strings (`blur`, `glass`, `glow`, …). Static literal strings are used deliberately so Tailwind v4's content scanner emits the classes.

**Verdict:** Strong, and the dual raw/utility approach is genuinely cross-platform-minded. **Weakness:** brand colors are **hard-coded** in the utility strings (`#00F5D4`, `#6C63FF`, `#070B14`) rather than referencing `colors` from the theme config, so graphics and theme can drift. Also unconsumed today.

### Theme (`shared/config/theme`)
Six token modules (`colors`, `typography`, `spacing`, `radius`, `z-index`, `breakpoints`) plus an aggregate `theme` object, all immutable `as const` with exported union types. Named by role, not by value; no framework imports.

**Verdict:** Clean, well-typed, platform-agnostic. **Critical weakness:** these tokens are **not connected to anything that renders.** Tailwind/shadcn read the CSS variables in `globals.css` (a neutral grayscale oklch palette), while these tokens declare the actual brand palette. See Theme Architecture.

### Providers (`shared/providers`)
- `app-provider.tsx` — composes `ThemeProvider > QueryProvider`.
- `theme-provider.tsx` — `next-themes` (`attribute="class"`, `defaultTheme="dark"`, `enableSystem`, `disableTransitionOnChange`).
- `query-provider.tsx` — lazily-instantiated `QueryClient` via `useState(() => …)` (correct SSR-safe pattern) with sensible defaults (`staleTime: 60s`, `retry: 1`, `refetchOnWindowFocus: false`).

**Verdict:** Correct and idiomatic. Minor: no React Query Devtools, no error boundary, no `Suspense` boundary.

### Utilities — **partially outside FSD**
`lib/utils.ts` (`cn()`) lives at the **app root**, not in `shared/`, because shadcn's `components.json` points `utils` to `@/lib/utils`. There is no `shared/utils` or `shared/hooks` yet.

### Hooks — **DOES NOT EXIST**
No custom hooks. Expected additions: `useReducedMotion`, `useLenis`, `useBreakpoint`, `useTheme` wrappers.

### Types — **DOES NOT EXIST as a module**
Types are co-located (e.g. `Theme`, `ColorToken`, `MotionPreset`, `GlassSurface`). Good locality; a `shared/types` for cross-cutting contracts will be needed later.

### Dependency direction (shared)
Within `shared`: `config/theme` (leaf) ← `lib/graphics` should depend on it (but currently doesn't) ; `lib/motion` self-contained; `providers` depend on external libs only. Direction is clean and acyclic. The **missing** edge (`graphics → theme/colors`) is the notable omission.

---

## Widget Review

### `experience-layout`
- **Responsibilities:** Root visual shell — full-height, overflow-hidden container with a centered `<main>`. Intended to be the reusable frame every "experience" renders inside.
- **Dependencies:** `react` types only. **No** foundation consumption (`bg-black text-white` are raw utilities).
- **Future evolution:** Should own the ambient/living background (`gradients.background`, future Three.js canvas at `zIndex.background`), global scroll (Lenis), and slots for navigation/overlays. This is the natural home of the "Experience Engine" shell.

### `hero`
- **Responsibilities:** Above-the-fold identity — product name + tagline.
- **Dependencies:** None (pure JSX). It is a Server Component; no `'use client'`, no motion.
- **Notes:** Indentation is inconsistent with the rest of the codebase (leading spaces / different style), a small hygiene issue.
- **Future evolution:** First candidate to prove the stack — wrap in `motion.section` with `heroReveal`, apply `gradients.hero`/`glow.hero`, drive typographic scale from `typography` tokens.

**Widget-layer verdict.** Both widgets are placeholders that validate structure but not the design system. Neither imports from `shared/lib` or `shared/config`, so the foundation's usefulness is currently unproven at the widget layer.

---

## Routing Review

- **Router:** Next.js **App Router** (Next 16.2.11, React 19.2.4).
- **Routes:** Exactly one — `/` (`app/page.tsx`).
- **Composition:** `layout.tsx` (fonts + providers) → `page.tsx` (`ExperienceLayout > Hero`).
- **Missing conventions:** No `loading.tsx`, `error.tsx`, `global-error.tsx`, `not-found.tsx`, route groups, dynamic segments, `generateMetadata`, `robots`, `sitemap`, or middleware.
- **Rendering model:** Everything is a Server Component except the providers (`'use client'`), which is the correct RSC-first posture — client boundaries are pushed to the leaves (providers) rather than the root.

**Verdict:** Appropriate for a single-page foundation. Routing is essentially unexercised; the real test comes when multiple experiences and the `pages`-vs-`app` layering question must be answered (see FSD review).

---

## Motion Architecture

**Layering:** `constants → transitions → variants → presets`, re-exported through a single barrel (`shared/lib/motion`). Widgets are meant to consume only presets.

- **Constants:** Semantic, seconds-based, typed cubic-beziers. No magic numbers escape this file.
- **Transitions:** Compose durations + easings; include a physics `spring`. Provide both named exports and a `transitions` lookup for dynamic selection.
- **Variants:** Minimal foundational set; explicitly intended as composition roots for feature-specific variants.
- **Presets:** Ready-to-spread configs mapping mount (`animate`) vs. scroll (`whileInView`) with `viewport` config.

**Future scalability.** The layering will scale well to a large motion vocabulary. Gaps to plan for:
1. **Reduced-motion.** No `prefers-reduced-motion` handling anywhere. For an immersion-first, animation-heavy product this is an accessibility and UX must-have.
2. **Orchestration.** No page-transition system (`AnimatePresence`), no route-transition presets, no shared-layout (`layoutId`) patterns — all central to "transitions that tell stories."
3. **Non-Framer motion.** GSAP and Lenis are installed but have no home in the motion foundation. Decide whether they belong under `motion/` (e.g. `motion/scroll`, `motion/timeline`) or a separate engine.
4. **Coupling to Framer.** Presets are typed against `framer-motion`; the "platform-agnostic" claim in the docs does not hold for motion (unlike theme/graphics, which are string/number tokens). That is acceptable for web but should be acknowledged.

**Verdict:** The best-architected subsystem in the repo. Rating held back only by zero consumption and missing reduced-motion.

---

## Graphics Architecture

**Composition:** Atomic primitives (`blur`, `borders`, `elevation`, `glow`, `gradients`) plus one composed primitive (`glass = blur + borders + translucent fill`). Every primitive is dual-form (raw token + Tailwind utility string), barrel-exported.

**Strengths.**
- Clear, honest layering with a single composed node, mirroring the motion foundation's discipline.
- Dual raw/utility representation is a real cross-platform investment (a future canvas/native/VR renderer can read `GRADIENT`/`GLOW_COLOR` directly).
- Static literal utility strings are a deliberate, correct accommodation of Tailwind v4's JIT content scanner — a subtle detail many teams get wrong.
- Semantic naming by role (`glass.floating`, `glow.hero`).

**Weaknesses.**
- **Color duplication.** Brand hex values are hard-coded in `borders`, `glow`, `gradients` instead of importing from `config/theme/colors`. The single-source-of-truth principle the docs champion is broken at exactly the seam where two foundations meet. If `colors.accent` changes, graphics silently drift.
- **Web-only utility layer.** The utility strings assume Tailwind; only the raw tokens are portable. Fine, but the docs' "any renderer" claim applies only to the raw half.
- **No runtime composition API.** Everything is precomputed strings; there is no helper to compose (e.g.) `glass` at an arbitrary blur + custom tint. Acceptable now; may be requested later.
- **Unconsumed.** No component uses any graphics primitive yet.

**Verdict:** Strong foundation; the color-duplication seam is the one thing to fix before it spreads.

---

## Theme Architecture

**Semantic token design.** `config/theme` is well-designed: role-based names (`background`, `surface`, `surfaceElevated`, `text`, `textMuted`, `primary`, `accent`, status colors), immutable `as const`, exported union types (`ColorToken`, `SpacingToken`, …), and an aggregate `theme` object. Typography, spacing, radius, z-index, and breakpoints follow the same discipline. **As a token library, this is 9/10 work.**

**The critical problem — two disconnected theme systems.**
There are currently **two independent sources of truth** for design values:

1. **TypeScript tokens** (`shared/config/theme/*`): the *actual brand identity* — indigo `#6C63FF`, cyan `#00F5D4`, deep-space `#070B14`, etc.
2. **CSS variables** (`app/globals.css`): a **neutral grayscale** oklch palette inherited verbatim from the shadcn "neutral" base color, consumed by Tailwind v4's `@theme inline` and every shadcn component.

These two systems **do not reference each other.** Nothing bridges the TS tokens into Tailwind/CSS. Consequently:
- The brand colors defined with such care in `colors.ts` never reach a rendered pixel.
- The app actually renders with shadcn's default gray theme (plus raw `bg-black`/`text-white` in widgets).
- `globals.css` also contains a concrete bug: `--font-sans: var(--font-sans);` is **self-referential** (it should map to `--font-geist-sans`, which `layout.tsx` defines). `--font-mono` is mapped correctly; `--font-sans`/`--font-heading` resolve to nothing.

**Cross-platform readiness.** *In principle*, excellent — the tokens are pure strings/numbers with no framework dependency, exactly what a desktop/mobile/VR client needs. *In practice*, readiness is unproven because not even the **web** client consumes them yet. Until the web path (TS tokens → Tailwind theme → components) is wired, the cross-platform claim is untested.

**Verdict:** Beautiful token model undermined by a missing integration layer. Unifying the two theme systems is the single highest-leverage fix in this audit.

---

## UI Foundation

**Current primitives:** Effectively **one** — `components/ui/button.tsx` (a shadcn "base-nova" Button built on `@base-ui/react`, with `cva` variants: default/outline/secondary/ghost/destructive/link and a rich size scale). It is well-built but **unused** (nothing imports it) and lives **outside** the FSD structure (in `components/ui`, per shadcn's `components.json`, not in `shared/`).

**Why the UI layer is otherwise empty (assessment):** This is a deliberate and defensible sequencing choice consistent with the docs' "systems before components" principle — the team built the *foundations* (tokens, graphics, motion) before the *primitives* that consume them. That is the correct order. The risk is that a shadcn primitive (Button) has already landed in a different location and a different theming system than the bespoke foundation, seeding the structural split described below before a single feature exists.

**Recommendation direction:** Decide the home and theming contract for UI primitives *now* — either (a) adopt shadcn's `components/ui` + CSS-variable theming and make the TS tokens generate those variables, or (b) place primitives under `shared/ui` and theme them from the TS tokens. Do not run both indefinitely.

---

## Dependency Graph

Module/layer dependency direction (arrows point from consumer → dependency):

```
                         ┌───────────────────────────┐
                         │        app (router)        │
                         │  layout.tsx / page.tsx     │
                         └───────────┬───────────────┘
                                     │
                 ┌───────────────────┼─────────────────────┐
                 ▼                   ▼                     ▼
          ┌────────────┐     ┌──────────────┐      ┌──────────────┐
          │  widgets   │     │   shared/    │      │  globals.css │
          │ hero /     │     │  providers   │      │ (Tailwind v4 │
          │ experience │     └──────┬───────┘      │  + shadcn    │
          │ -layout    │            │              │  CSS vars)   │
          └─────┬──────┘            ▼              └──────────────┘
                │            (next-themes,                 ▲
                │             react-query)                 │
                │                                          │ (SHOULD, but
                ▼                                          │  does NOT)
        (SHOULD consume, but does NOT today)               │
                │                                          │
                ▼                                          │
     ┌───────────────────────────────────────────┐        │
     │              shared foundation             │        │
     │                                            │        │
     │  config/theme  ◀───(SHOULD)── lib/graphics │────────┘
     │   colors,          (currently hard-codes   │
     │   typography,       hex instead)           │
     │   spacing, ...                             │
     │                                            │
     │  lib/motion  (self-contained, ↳ framer)    │
     └───────────────────────────────────────────┘

     ┌──────────────────────────────┐
     │  components/ui/button.tsx     │──▶ lib/utils.ts (cn)
     │  (shadcn, OUTSIDE FSD)        │──▶ @base-ui/react, cva
     │  UNUSED                       │
     └──────────────────────────────┘
```

**Explanation of dependency direction.**
- **Correct / acyclic where wired:** `app → widgets`, `app → shared/providers`, `shared/providers → external libs`. No upward or cyclic imports. `config/theme` is a proper leaf; `lib/motion` internal layering (`constants → transitions → variants → presets`) is strictly one-directional. This is healthy.
- **Missing edges (the important part):** the dashed "SHOULD" edges — `widgets → shared/lib(graphics,motion)`, `widgets → shared/config/theme`, `lib/graphics → config/theme/colors`, and `globals.css ← config/theme` — do **not** exist. The foundation is an island the rest of the app never imports.
- **Off-grid node:** `components/ui` + `lib/utils` form a second, shadcn-shaped subtree parallel to FSD.

---

## Layer Violations

No *classic* violations (upward imports, circular dependencies, or deep cross-slice reach-ins) were found — largely because the graph is so small and the foundation is unconsumed, so there is little opportunity to violate boundaries yet. However, several **structural inconsistencies** exist that will become violations as the app grows:

1. **Dual structural conventions (high concern).** FSD (`shared/`, `widgets/`) coexists with shadcn defaults (`components/`, `lib/`). `components/ui/button.tsx` importing `@/lib/utils` is *technically* fine but establishes a second module tree that ignores FSD. Left unresolved, contributors will not know where new UI belongs.
2. **Foundation bypass (medium).** Widgets style with raw utilities (`bg-black`, `text-zinc-400`, `text-white`) instead of the design system. This is the *inverse* of a layer violation — the layers exist but are ignored — and it is not yet enforceable because no boundary/lint rules exist.
3. **Graphics → hard-coded color (medium).** `lib/graphics` embeds brand hex values instead of depending on `config/theme/colors`, duplicating a source of truth that the docs designate as singular.
4. **Ambiguous `pages` ownership (low, latent).** FSD `pages` vs. Next `app/` is undecided; whichever is chosen must be applied consistently.

**Why "no violations" is not yet reassuring:** the absence of violations reflects the absence of interconnection, not the presence of enforced boundaries. There is **no automated boundary enforcement** (no `eslint-plugin-boundaries`, `eslint-plugin-import` restrictions, or Steiger for FSD). Discipline is currently cultural, not mechanical.

---

## Technical Debt

**Current debt (exists today):**
1. **Broken quality gate.** `.husky/pre-commit` runs `npm test`, but there is **no `test` script, no test runner, and no tests.** The hook either fails every commit (blocking work) or is being bypassed (`--no-verify`), meaning the gate is theater. Commits are clearly landing, so it is effectively disabled.
2. **`lint-staged` installed but unwired.** It is a devDependency with **no configuration** and is **not invoked** by the pre-commit hook (which calls `npm test` instead). Half-built tooling.
3. **Two disconnected theme systems** (TS tokens vs. CSS vars) — see Theme Architecture.
4. **`--font-sans` self-reference bug** in `globals.css`.
5. **Empty root `README.md`** and **boilerplate `apps/web/README.md`.**
6. **Uncommitted foundation.** The entire `shared/config` + `shared/lib` foundation is untracked and `styles/theme.ts` deletion is unstaged — the project's most valuable code is not yet under version control on this branch.
7. **Placeholder metadata in docs** (`Last Updated: YYYY-MM-DD`, duplicated title).
8. **Dead dependencies (for now):** Three.js, react-three-fiber, drei, GSAP, Lenis, Zustand, React Hook Form, Zod, lucide-react, tw-animate-css are installed but unused, inflating `node_modules` and lockfile surface before they earn their place.

**Potential future debt (will accrue if unaddressed):**
- Divergence between the two theme systems as each is edited independently.
- Graphics/theme color drift from duplicated hex values.
- FSD erosion without automated boundary enforcement.
- Motion coupled to Framer with no abstraction, complicating a future non-web renderer.
- No error/loading boundaries → ad-hoc error handling copied per route later.

**Recommended improvements (debt paydown):**
- Replace `npm test` in the hook with a working `lint-staged` (prettier + eslint) pipeline; add a real test runner (Vitest) and at least token/snapshot tests.
- Generate CSS variables *from* the TS tokens (build step or a single mapping file) so there is one source of truth.
- Import `colors` into `lib/graphics`.
- Fix the font variable; write both READMEs; commit the foundation.
- Add `eslint-plugin-boundaries` (or Steiger) to enforce FSD.

---

## Performance Review

**Bundle concerns.**
- **Heavy libraries staged but unused:** Three.js (~600KB+), GSAP, Lenis, Framer Motion, React Query, Zustand, React Hook Form, Zod. None are imported yet, so tree-shaking keeps them out of the current bundle — but the *intent* is to use them. Three.js + r3f in particular must be **route-split / dynamically imported** and never placed in the root layout, or the "performance is a feature" pillar is immediately compromised.
- **Providers are client components at the root.** `AppProvider` (theme + query) is a client boundary wrapping the whole tree. That is standard, but it means React Query and next-themes ship on every page; keep additional client code out of `layout.tsx`.
- **Tailwind v4 + static utility strings** in graphics/motion are bundle-friendly (no runtime CSS-in-JS).

**Rendering concerns.**
- Current page is trivially fast (static RSC, no client JS beyond providers).
- **No `prefers-reduced-motion` strategy** — for an animation-first product this is both an a11y and a performance/jank concern on low-end devices.
- **No image strategy** yet (`next/image`, formats, responsive sizes) — will matter enormously for an anime-imagery-heavy product.
- **No font `display`/preload tuning** shown beyond `next/font` defaults (which are good).

**Future optimization opportunities.**
- Dynamic-import all 3D/GSAP/Lenis experiences with suspense + skeletons.
- Establish an animation budget and a global reduced-motion switch in the motion foundation.
- Add `next/image` conventions, a CDN/image loader, and blur placeholders as entities land.
- Add bundle analysis (`@next/bundle-analyzer`) to CI before heavy libs are wired in.
- Consider Partial Prerendering / streaming for experience shells once routes exist.

---

## Scalability Review

Can the *current architecture* support the six stated future domains?

| Domain | Verdict | Reasoning |
| --- | --- | --- |
| **Desktop** | **Yes, with work.** | Token model is renderer-agnostic (strings/numbers), which is the right substrate for a Tauri/Electron shell. But no packaging strategy or platform-abstraction layer exists yet, and motion is Framer-coupled. |
| **Mobile** | **Partially.** | Design tokens (spacing/typography/radius/breakpoints) port cleanly to React Native. Graphics/motion *utility* layers are web/Tailwind-only; only the raw token halves would carry over. A shared-core / platform-adapter split is not yet defined. |
| **VR** | **Aspirational.** | r3f/Three.js are installed and the token substrate is portable, but there is no 3D/spatial architecture, no scene graph, no interaction model. This is a research frontier, not yet an architecture. |
| **AI Companion** | **Foundations present, integration absent.** | React Query + Zustand + Zod give a solid client-state/validation base for an AI service. No API layer, streaming, or entity model exists yet. |
| **Community** | **Feasible.** | FSD `features`/`entities` are the natural home; data layer (React Query) is chosen. Requires auth, backend, and real-time — none present. |
| **Anime Platform** | **Feasible, unproven.** | The whole point; needs a content/domain model (`Anime`, `Episode`, catalog, playback). Zero domain code exists today, so the data/architecture that determines scalability has not been written. |

**Overall scalability verdict.** The *chosen primitives and philosophy* (renderer-agnostic tokens, layered systems, FSD, a modern data/validation stack) are well-suited to this multi-platform ambition — this is a genuinely good bet. But scalability is currently a **property of the plan, not the code**: there is no domain model, no API boundary, no platform-abstraction layer, and no state architecture in use. The architecture *can* support these directions; it does not yet *demonstrate* that it does.

---

## Developer Experience

- **Project organization:** **Good and improving.** FSD-lite with barrel files (`index.ts`) gives clean import surfaces (`@/widgets/hero`, `@/shared/lib/motion`). The `@/*` path alias is simple. The blemish is the parallel `components/`+`lib/` (shadcn) vs. `shared/` (FSD) split, which will confuse "where does this go?"
- **Naming:** **Strong.** Role-based, semantic naming throughout tokens/graphics/motion; consistent kebab-case files, PascalCase components, descriptive union types. `Hero`'s inconsistent indentation is the only visible lapse.
- **Documentation:** **Two-tier.** Vision/philosophy docs are excellent; *operational* docs (how to run, how to contribute, where things live, ADRs) are largely missing or boilerplate. Inline code documentation in the foundation, however, is outstanding and materially lowers onboarding cost.
- **Maintainability:** **High for the foundation, untested at scale.** Immutable typed tokens and single-responsibility modules are very maintainable. The two-theme split and unwired tooling are the maintainability risks.
- **Ease of onboarding:** **Mixed.** A new engineer gets a superb "why" from the docs and clean code to read, but hits friction fast: empty root README, boilerplate app README, a pre-commit hook that runs non-existent tests, and no "getting started / architecture map / where-to-put-things" guide. Estimated time-to-first-meaningful-PR is elevated by these avoidable gaps.

---

## AI Readiness

This repository is, deliberately, **built for AI collaboration** — and it mostly succeeds.

**Strengths for AI assistants:**
- `AGENTS.md` / `CLAUDE.md` give explicit, high-value guardrails (notably: "this is not the Next.js you know — read the local docs first"), which prevents the single most common AI failure mode (hallucinating outdated framework APIs).
- The vision/context docs let an assistant reason about *intent*, not just code, so suggestions can align with product philosophy.
- The foundation's inline documentation is written *as if for an AI or new engineer*: each module states purpose, layer, composition, and constraints. An assistant can consume `motion/index.ts` or `theme/index.ts` and immediately know the intended usage.
- Strong typing + `as const` unions give AI precise, autocompletable contracts and make incorrect usage a type error.
- Small, single-responsibility files fit comfortably in context windows.

**Gaps that reduce AI effectiveness:**
- **No enforced boundaries or tests** → an AI can confidently generate code that violates the intended architecture with no automated signal to catch it. AI works best with a tight feedback loop (types + lint + tests); two of the three are missing.
- **Two theme systems + two structure conventions** → an AI cannot infer the "one right way" and will plausibly pick the wrong one (e.g. add a component to `components/ui` vs. `shared/ui`, or use raw hex vs. tokens).
- **Docs describe systems that don't exist** (engines, seven layers) → an AI reading the handbook may hallucinate that `entities`/`features`/engines exist and generate imports to phantom modules.
- **Broken pre-commit** → an AI cannot rely on `npm test` as a verification step.
- **No CONTRIBUTING / "where things go" doc** → the highest-leverage missing artifact for AI throughput.

**Verdict:** Above-average AI readiness, and clearly intentional. To reach excellent, the repo needs a single canonical "architecture map + conventions" doc, working automated feedback (lint-staged + tests + FSD boundaries), and reconciliation of the doc/reality gap.

---

## Architecture Scores

Scored out of 10, judged against the standard expected of a **funded startup building a long-lived, multi-platform product** — not against a typical hobby project.

| Dimension | Score | Explanation |
| --- | --- | --- |
| **Architecture** | **7.0** | Directionally excellent (FSD, systems-over-pages, clean acyclic deps, disciplined layering). Held back by an unconsumed foundation, two competing structural conventions, and no enforced boundaries. The bones are right; the connective tissue is missing. |
| **Scalability** | **6.5** | The right *substrate* for desktop/mobile/VR/AI (renderer-agnostic tokens, modern data stack) but scalability lives in the plan, not the code — no domain model, API layer, state usage, or platform-abstraction yet. |
| **Maintainability** | **7.0** | Immutable typed tokens, single-responsibility modules, and superb inline docs make the foundation very maintainable. Two-theme split, unwired tooling, and absent tests cap the score. |
| **Developer Experience** | **6.5** | Clean imports, semantic naming, excellent "why" docs. Dragged down by empty/boilerplate READMEs, a broken pre-commit gate, and the "where does this go?" ambiguity. |
| **Design System** | **5.5** | Token model is genuinely 9/10 in isolation, but it is disconnected from what renders (grayscale shadcn CSS vars actually ship), only one UI primitive exists (unused, off-grid), and widgets bypass the system. A great library nobody uses yet. |
| **Motion System** | **8.0** | The strongest subsystem — clean four-layer composition, semantic constants, spreadable presets. Loses points only for zero consumption, no reduced-motion handling, and no home for GSAP/Lenis. |
| **Graphics System** | **7.5** | Thoughtful composition (`blur+borders→glass`), dual raw/utility forms, JIT-safe static strings. Loses points for hard-coded brand hex (duplicated source of truth) and zero consumption. |
| **Theme System** | **5.0** | Excellent token design undermined by a fundamental integration failure: two disconnected sources of truth, a self-referential font variable bug, and no path from tokens to rendered pixels. Cross-platform readiness is claimed but wholly unproven. |
| **AI Readiness** | **7.5** | Intentional and largely successful (guardrail docs, rich inline docs, strong types, small files). Capped by missing automated feedback, doc/reality drift, and convention ambiguity. |
| **Documentation** | **6.0** | Vision docs are exceptional (8–9/10); operational docs are missing or boilerplate (1–2/10). The blended reality, plus the "describes more than exists" gap, lands at 6. |
| **Overall (weighted)** | **≈ 6.7** | A strong, unusually principled *foundation* that has not yet been connected to a running product. High ceiling, real but fixable gaps. |

---

## Immediate Recommendations

Top 20, ranked by impact (highest first). Each is scoped to be actionable this or next sprint.

1. **Commit the foundation.** Version-control `shared/config` + `shared/lib` and finalize the `styles/theme.ts` deletion. The most valuable code in the repo is currently untracked.
2. **Unify the two theme systems.** Make the TS tokens the single source of truth and generate the `globals.css` CSS variables from them (build step or one explicit mapping file). Eliminate the grayscale/brand split.
3. **Fix the quality gate.** Replace `npm test` in `.husky/pre-commit` with a real `lint-staged` pipeline (prettier + eslint), and add a `test` script backed by a runner (Vitest).
4. **Prove the stack in one widget.** Refactor `Hero` to consume `heroReveal` (motion), `gradients.hero`/`glow.hero` (graphics), and typography tokens — an end-to-end vertical slice validating every layer.
5. **Resolve the structural split.** Decide FSD vs. shadcn-default for UI primitives and utilities; pick one home (`shared/ui` + `shared/lib/utils`, or `components/ui` + `lib`) and document it.
6. **De-duplicate graphics colors.** Import `colors` from `config/theme` into `lib/graphics` so gradients/glow/borders derive from the palette.
7. **Fix the `--font-sans` self-reference** in `globals.css` (map to `--font-geist-sans`).
8. **Write the root `README.md`** (what/why/how-to-run/architecture map) and replace the boilerplate `apps/web/README.md`.
9. **Add a `CONTRIBUTING.md` / "where things go" architecture map** — the single highest-leverage doc for both humans and AI.
10. **Add reduced-motion support** to the motion foundation (`useReducedMotion` + a global switch); wire into presets.
11. **Enforce FSD boundaries** with `eslint-plugin-boundaries` (or Steiger) so architecture is mechanical, not cultural.
12. **Add App Router boundaries:** `loading.tsx`, `error.tsx`, `not-found.tsx`, `global-error.tsx`.
13. **Add CI** (GitHub Actions): typecheck, lint, test, build on every PR.
14. **Add React Query Devtools** (dev-only) and an error boundary around the app tree.
15. **Prune or justify dead dependencies** (Three.js/r3f/drei, GSAP, Lenis, Zustand, RHF, Zod) — keep them only with a documented near-term plan; otherwise defer to reduce surface area.
16. **Reconcile docs with reality:** mark engines and unbuilt FSD layers as "planned," fix the `YYYY-MM-DD` placeholder and duplicated title, and stub the promised `docs/` subdirectories or remove their references.
17. **Establish a shared `hooks/` and `types/` home** under `shared/` with the first real hooks (`useBreakpoint`, `useLenis`).
18. **Define the data/API layer contract** for React Query (base client, error model, Zod-validated responses) before entities land.
19. **Set metadata + SEO conventions** (`generateMetadata`, Open Graph, `robots`, `sitemap`, icons).
20. **Add `@next/bundle-analyzer`** and a bundle budget before wiring in Three.js/GSAP so "performance is a feature" is measurable.

---

## Next Sprint Recommendation

**Sprint name:** *Foundation → First Light* (connect the foundation to a living, on-brand experience and lock the toolchain).

**Objectives.**
1. Make the design foundation *real* — one source of truth, consumed end-to-end.
2. Close the toolchain gaps so quality is enforced automatically.
3. Resolve the structural ambiguities before feature work begins.

**Deliverables.**
- Foundation committed; `styles/theme.ts` deletion finalized.
- Single theme source of truth: TS tokens generate CSS variables; brand palette actually renders; font bug fixed.
- `Hero` + `ExperienceLayout` refactored to consume motion + graphics + theme tokens (with reduced-motion support), proving every layer.
- Working `lint-staged` pre-commit; Vitest wired with initial token/motion unit tests and one widget render test.
- FSD boundary lint rules active; structural convention (UI/util home) chosen and documented.
- Root `README.md`, `CONTRIBUTING.md` / architecture-map doc, and reconciled handbook status.
- CI pipeline (typecheck + lint + test + build) green on `main`/feature branches.
- App Router error/loading/not-found boundaries.

**Success criteria.**
- The rendered home page displays the **brand** palette (indigo/cyan/deep-space), not shadcn grayscale, sourced exclusively from `config/theme`.
- The `Hero` animates via `heroReveal` and honors `prefers-reduced-motion`.
- A fresh clone → install → commit succeeds with the real pre-commit gate (no `--no-verify`), and CI passes.
- No component uses a raw hex color or an ad-hoc animation value; grep for `#` hex and inline durations in `widgets/` returns nothing.
- A new contributor can answer "where does a new UI primitive / hook / feature go?" from a single doc.
- Zero references in docs to modules that do not exist.

---

## Risks

**High.**
- **R1 — Theme fragmentation.** Two disconnected theme systems will diverge with every edit; the longer both live, the more expensive the reconciliation and the higher the chance the brand identity silently never ships. *Mitigation: unify now (Rec #2).*
- **R2 — Vision/reality gap widens.** Docs describe seven layers and seven engines; code has three layers and none. If features are built on the *narrative* rather than the *code*, contributors (and AI) will reference phantom systems. *Mitigation: reconcile docs; build the vertical slice (Rec #4, #16).*
- **R3 — No quality gate / no tests.** A "performance and quality are features" product with a broken pre-commit and zero tests will accrue regressions the moment velocity increases. *Mitigation: Rec #3, #13.*

**Medium.**
- **R4 — Structural split ossifies.** FSD vs. shadcn-default coexistence will harden into two permanent, conflicting conventions. *Mitigation: Rec #5, #11.*
- **R5 — Heavy libraries wired in carelessly.** Three.js/GSAP/Lenis added to the root or without dynamic import will blow the performance budget that immersion depends on. *Mitigation: Rec #15, #20.*
- **R6 — Graphics/theme color drift** from duplicated hex values. *Mitigation: Rec #6.*
- **R7 — Motion coupled to Framer** complicates the promised non-web renderers. *Mitigation: acknowledge scope; plan an abstraction before mobile/VR work.*

**Low.**
- **R8 — Onboarding friction** (empty READMEs, no contributing guide) slows new contributors. *Mitigation: Rec #8, #9.*
- **R9 — Monorepo layout without tooling** may surprise contributors expecting workspaces. *Mitigation: document the decision or adopt workspaces when a second package appears.*
- **R10 — Doc placeholders** (`YYYY-MM-DD`, duplicated title) erode trust in the docs. *Mitigation: Rec #16.*

---

## Final Assessment

**Principal Architect's candid view.**

This is a rare kind of early-stage repository: the *thinking* is far ahead of the *code*, in the best possible way. Most projects at this size have a pile of components and no philosophy. AetherAnime has a crisp, genuinely inspiring philosophy and a small, unusually well-crafted foundation. The layered motion and graphics libraries, and the semantic token model, are written to a standard I would be happy to see in a mature production codebase — the composition discipline (constants→transitions→variants→presets; blur+borders→glass), the immutable typed tokens, and the "documentation as a first-class artifact" ethos are all real assets, not window dressing.

**What is exceptional.** The vision/context documentation and the internal quality and self-documentation of the `shared/` foundation. The motion architecture specifically. The deliberate AI-collaboration posture (guardrail docs, richly documented modules, strong types). The correct RSC-first rendering posture and clean, acyclic dependency direction. These reflect senior-level judgment and long-term thinking.

**What is average.** The actual running product — a static title page — is ordinary and expected for a foundation milestone. Routing is minimal. The provider setup is competent but standard. The UI primitive layer is a single unused shadcn button. None of this is a criticism; it is simply where the behavioral surface sits today.

**What should never change.** The systems-over-pages philosophy; the layered composition discipline; the role-based, platform-agnostic token model; the treatment of documentation and types as first-class; and the immersion-first product principle ("does this make the user feel more immersed?"). These are the project's identity and its competitive moat. Protect them.

**What must be improved immediately.** Connect the foundation to reality. Right now there are two theme systems that do not speak to each other, and *neither the brand palette nor a single foundation primitive reaches the screen.* Unify the theme, commit the foundation, prove the full stack in one widget, and repair the quality gate. Resolve the FSD-vs-shadcn structural split before feature work multiplies it. Reconcile the documentation so it describes what exists (and clearly marks what is planned).

**Readiness verdict.** The project is **not quite ready** to transition from foundation work to immersive experience implementation — but it is *close*, and the remaining work is small, well-defined, and non-architectural. It needs roughly **one focused sprint** (the "Foundation → First Light" sprint above) to (1) unify the theme and consume the foundation end-to-end, (2) turn on real quality gates, and (3) settle the two structural conventions. Once the brand palette renders, the `Hero` animates through the motion foundation, and the pre-commit gate actually runs, the architecture will have *demonstrated* — not merely asserted — that it can carry immersive experiences. At that point, green-light the transition with confidence.

**Bottom line:** Excellent foundations, exceptional intent, one integration sprint away from being ready. The biggest risk is not the architecture — it is allowing the gap between the beautiful plan and the running product to persist. Close that gap first.

---

*End of MILESTONE-001 Architecture Audit.*
