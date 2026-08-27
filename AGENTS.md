# AGENTS.md

AetherAnime keeps its project context in `.aether/`. Start there, not here.

## Context loading

1. Read `.aether/INDEX.md`.
2. Classify the task: visual · interaction · performance · accessibility · regression.
3. Read the one matching `.aether/directives/<type>-task.md`.
4. Read only the context, decision records, and skills that directive and the index name — typically 3–6 files total.
5. Read the actual source and its `*.test.ts` contracts before changing anything.

Do not read the whole brain. Do not read every decision record.

## Task execution

Tasks arrive in the compact format defined in `.aether/templates/TASK.template.md` (`ID / TYPE / SURFACE / GOAL / READ / PROTECT / VERIFY / STOP`). Resolve each field through the index.

Write the failing test first, implement the smallest change that meets the goal, and keep the change scoped to the surface named in the task. Anything under `PROTECT` must be unchanged at the end.

## Validation

Run, in order, and read real output: tests (`npx tsx --test <files>`) → `npx tsc --noEmit` → `npm run lint` → `npm run build`. Add measured FPS and live production-browser QA when the task touched motion, layout, or rendering.

Never report a gate you did not run or a number you did not measure.

## Decision recording

If the task produced a durable, protected outcome, add `.aether/decisions/TASK-XXX.md` using `.aether/templates/DECISION.template.md`, link it from `.aether/decisions/INDEX.md`, and update `.aether/memory/current-state.md`.

## Self-annealing

The brain is expected to improve. When a task discovers an architectural mistake, a repeated implementation failure, a performance-regression pattern, an accessibility failure pattern, a durable design rule, or a reusable technique, update the matching file: `context/` for rules, `architecture/` for how systems really work, `skills/` for technique, `directives/` for process, `decisions/` for protected outcomes, `memory/` for state and debt.

Only durable knowledge. Do not record one-off mistakes or narrative. The full procedure is in `.aether/directives/task-completion.md`.
