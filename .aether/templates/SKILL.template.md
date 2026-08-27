# Template — Skill

Generic. Portable to any project running an Aether brain.

A skill is transferable craft technique: *how* to do a kind of work well. It is not project rules (that is `context/`), not a system description (that is `architecture/`), and not a procedure (that is `directives/`).

```markdown
# Skill — <Craft area>

<One line: what this skill is for.>

## <Technique>

The technique, stated as guidance a practitioner can act on.
Include the failure mode it prevents.

## <Technique>

...

## Related

<2–5 wikilinks>
```

## Rules

- Write a skill only when the knowledge is **reusable** — it will apply to a task that does not exist yet.
- Prefer decision tables and failure-mode mappings over prose. An agent scanning under budget should get the answer in one pass.
- Include the trap, not just the recommendation. "Do X" is weak; "Do X, because Y looks correct and silently fails" is strong.
- Keep project specifics thin, and mark them. The technique should survive being copied to another project even if a line or two must be edited.
- One page. If it grows past that, it is two skills.
