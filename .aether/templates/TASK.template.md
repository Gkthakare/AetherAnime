# Template — Aether Task

Generic. Portable to any project running an Aether brain.

## The format

```
AETHER TASK

ID: TASK-057
TYPE: visual
SURFACE: world
GOAL: <one or two sentences>

READ:
visual
performance
TASK-055

PROTECT:
home
destination

VERIFY:
responsive
reduced-motion
accessibility
performance

STOP:
next task
```

Only `ID`, `TYPE`, and `GOAL` are required. Everything else narrows the work.

## Field meanings

**TYPE** — selects the directive.

| Value | Directive |
|---|---|
| `visual` | `directives/visual-task.md` |
| `interaction` | `directives/interaction-task.md` |
| `performance` | `directives/performance-task.md` |
| `accessibility` | `directives/accessibility-task.md` |
| `regression` | `directives/regression-task.md` |

**SURFACE** — where the work happens. In AetherAnime: `home`, `world`, `destination`, `arrival`, `navigator`, `api`. Determines which gate the change must be scoped to.

**READ** — context shorthand, resolved through the brain:

| Token | Resolves to |
|---|---|
| `visual` | `context/visual-language.md` |
| `performance` | `context/performance-contract.md` |
| `rules` | `context/engineering-rules.md` |
| `project` / `vision` | `context/project.md` / `context/vision.md` |
| `rendering` / `routing` / `data` / `network` / `system` | the matching `architecture/*.md` |
| `TASK-0XX` | `decisions/TASK-0XX.md` |
| `state` / `debt` / `questions` | the matching `memory/*.md` |
| a skill name | `skills/<name>.md` |

`READ` is a floor, not a ceiling. Follow the index if the task needs more — and read no more than it needs.

**PROTECT** — surfaces and systems that must be unchanged at the end. Their frozen decisions are binding. If the goal cannot be met without touching one, **stop and report**.

**VERIFY** — the QA passes that must appear in the report:

| Token | Means |
|---|---|
| `responsive` | 390 / 820 / 1440 / 1920 |
| `reduced-motion` | `prefers-reduced-motion: reduce` pass |
| `accessibility` | keyboard + focus walk in a production build |
| `performance` | measured FPS against the performance contract |
| `visual` | live production-browser visual QA |

Tests, TypeScript, lint, and build are always required and never need listing.

**STOP** — the boundary. `next task` means: finish this one, report, start nothing else.

## Interpretation rules

- Resolve every field through `.aether/INDEX.md` before reading anything else.
- Unlisted context may be read if the index points there; unlisted *scope* may not be worked on.
- Silence is not permission. If a field is absent, apply the directive's defaults.
- Finish with `directives/task-completion.md`.
