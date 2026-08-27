# CLAUDE.md

This repository carries its own project brain.

**Read `.aether/INDEX.md` first.** It is the context router and it tells you what else to read.

## Operating rules

1. **Load only relevant context.** Classify the task, read the one matching directive, then only the context, decisions, and skills it names. A typical task needs 3–6 brain files. Never load the whole `.aether/` directory.
2. **Inspect the code before editing.** The brain describes the system; `apps/web/` *is* the system. Where they disagree, the code is right and the brain gets corrected.
3. **Respect frozen decisions.** `.aether/decisions/` records what is intentionally protected. If a goal requires reopening one, stop and report instead of proceeding.
4. **Never fabricate results.** Tests, TypeScript, lint, build, FPS — report only what you ran and observed. "Not measured" is an acceptable answer; an invented number is not.
5. **Update the brain only for durable knowledge.** After a task that established a rule, a measured boundary, a protected mechanism, or a change in project state, update the matching file under `.aether/`. Transient detail does not belong there.

Task format and completion procedure: `.aether/templates/TASK.template.md`, `.aether/directives/task-completion.md`.
