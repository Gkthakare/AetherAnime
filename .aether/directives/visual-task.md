# Directive — Visual Task

## Purpose

Change how a surface looks or feels without breaking the spatial hierarchy, the compositor budget, or a frozen decision.

## When to use

Composition, layout, atmosphere, environment, typography, spatial presence, visual identity. Anything whose success criterion is "does it feel like the world".

Not for: new interaction affordances ([[interaction-task]]), FPS work ([[performance-task]]).

## Required context

Always: [[visual-language]], [[performance-contract]].
Usually: [[rendering]], the decision records for the surfaces named in the task.
Read the surface's existing `*.css` and contract `*.test.ts` before proposing anything.

## Process

1. Identify the surface — Home, World idle, Destination, Arrival — and confirm which gate expresses it (`data-world-anime`, `data-world-lifecycle`, `data-living`, media query).
2. Read the frozen decisions for that surface. If the goal requires undoing one, **stop and report**.
3. Find the existing layer that already owns the effect. Extend it. Only if none exists may you add one, and then it must be gated and measured.
4. Propose 2–3 iterations before implementing. Describe them in spatial terms, not CSS terms.
5. Write the contract test first: what must stay true (no keyframes, no `will-change`, gated off other surfaces, existing insets intact) and what must become true.
6. Implement the smallest change that produces the intent.
7. QA live in a production build at 390 / 820 / 1440 / 1920, plus reduced motion. Screenshots for composition; live browser for motion.

## Quality gates

- tests, `npx tsc --noEmit`, `npm run lint`, `npm run build` — all real output
- FPS measured on any surface whose animation changed; [[performance-contract]] targets hold
- reduced-motion branch exists and was checked
- the change is gated to its surface and does not leak
- no new dependency, no new full-viewport animated layer, no new atmosphere system

## Stop conditions

Stop and report instead of proceeding when:

- the goal requires reopening a frozen decision
- the only way to achieve it is a parallel visual system or a new dependency
- it needs a new full-viewport animated surface
- it would invert the hierarchy in [[visual-language]]
- FPS drops below the contract and cannot be recovered within the change

## Expected report

Objective · iterations considered and which was chosen and why · files changed · tests (before/after counts) · TypeScript · ESLint · build · FPS table by viewport · reduced-motion result · frozen decisions respected · what was explicitly not done.
