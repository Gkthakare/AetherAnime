# Technical Debt

Verified problems only. Complexity is not debt. An architecture you would have designed differently is not debt.

Last verified: TASK-056

- **`docs/engineering/CHANGELOG.md` is stale.** Its most recent entry is TASK-041. TASK-042 through TASK-055 are not recorded there, so the changelog cannot be used to reconstruct recent history. The brain's `decisions/` directory is the current record for TASK-046 onward; the gap between TASK-042 and TASK-045 is not captured anywhere in the repository. *Verified by reading the file at TASK-056.*

- **There is no `test` script.** `package.json` exposes `dev`, `build`, `start`, `lint`, `prepare` — running the suite requires explicitly enumerating `*.test.ts` files through `npx tsx --test`, and `tsx` is not a declared devDependency (it resolves via `npx`). This makes the suite easy to run partially by accident and easy to skip in CI. *Verified by reading `package.json` and running the suite at TASK-056.*

- **A live-server QA loop depends on host naming.** Visual QA against a dev server must use `http://localhost:<port>`; `http://127.0.0.1:<port>` has produced blank captures against the Next dev server. Production QA runs against the built app. *Observed during TASK-054 QA.*

## Rules for this file

An entry needs evidence and a note of where it was verified. Remove entries when resolved. Do not migrate normal architecture here to make it look like a backlog.

## Related

[[current-state]] · [[project]] · [[engineering-rules]]
