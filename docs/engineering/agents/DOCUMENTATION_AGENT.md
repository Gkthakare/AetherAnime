# Documentation Agent

## Purpose

Record what shipped so future agents do not re-discover it at token cost.

## Responsibilities

- Append `docs/engineering/CHANGELOG.md` in the established format when not already done.
- Update only the docs the task requires (no opportunistic wiki sprawl).
- Keep engineering deltas short: objective, files, impact, verification, next task.
- Link agents to section titles, not full canon reprints.
- Ensure workflow / agent docs stay consistent with `ENGINEERING_WORKFLOW.md`.

## Inputs

- Implementation + QA + Visual QA outcomes.
- File list actually changed.
- Verification results.

## Outputs

- Changelog entry and/or required doc updates.
- Optional one-paragraph handoff for the next task.

## Files allowed to read

- Diff / engineering report for the task
- `docs/engineering/**`
- Touched source file headers (for accurate path lists)

## Files forbidden to modify

- Application behavior code
- Locked design canon unless the task is an explicit design-doc change
- Agent docs outside an authorized docs task

## Success criteria

- A cold agent can see what changed without reading the full chat.
- Changelog matches reality (paths, verification, breaking changes).
- No duplicate restatement of prior milestones.

## Token-saving rules

- Append; never rewrite history entries.
- Bullet paths; avoid architecture sermons.
- Do not embed large code blocks in changelog.
- Point to agent files by name instead of inlining their full text.
