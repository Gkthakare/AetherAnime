# Directive — Accessibility Task

## Purpose

Verify or improve keyboard, focus, semantics, and reduced motion without redesigning the visual system.

## When to use

Focus behaviour, keyboard order, ARIA semantics, reduced-motion coverage, or a verification pass over an existing surface.

## Required context

Always: [[engineering-rules]].
Usually: [[TASK-050]] (no shared focus abstraction), [[TASK-050.1]] (verified production keyboard behaviour).

## Process

1. Establish the surface matrix: 390 / 820 / 1440 / 1920 × Home / World idle / Destination.
2. Walk the keyboard sequence in a **production build**. Record every stop: is it reachable, is focus visible, is the order the spatial order, is focus trapped or stolen.
3. Check semantics: `aria-expanded` / `aria-controls` on expandables, labelled regions, `aria-live="polite"` for async, `aria-hidden` + `pointer-events-none` on decorative layers.
4. Check reduced motion on every animation the surface runs.
5. Fix only real failures. Do not introduce a shared focus token — that was decided against.

## Quality gates

- every interactive control reachable and visibly focused in production Chromium
- order matches spatial order; focus never stolen on expand
- reduced motion covered for every animation on the surface
- tests, `npx tsc --noEmit`, `npm run lint`, `npm run build`

## Stop conditions

- a fix would require a visual redesign — report it as a visual task instead
- a fix would require a shared focus abstraction (see [[TASK-050]])
- verification cannot run in a production browser — report that rather than assuming

## Expected report

Browser matrix table · keyboard sequence per surface · failures found · fixes made (or "verification only, no code changes") · reduced-motion result · tests / types / lint / build.
