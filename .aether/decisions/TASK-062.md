# TASK-062 — AI Participation (Navigator-native)

Status: FROZEN (design)
Area: AI Participation / World Navigator / World Idle

## Decision

**AI participation remains Navigator-native structured intent for V1; no additional AI surface is justified yet.**

The LLM may only parse descriptive asks into validated `StructuredAnimeIntent`. Retrieval, ranking, presentation, confirmation, and arrival stay deterministic application code. No chatbot, advisory panel, ambient AI presence, Destination narrator, or second instrument.

## Why

Inspected code: `planAnimeAsk` is deterministic-first; `/api/anime-intent` returns `{ intent }` only; `retrieveForStructuredIntent` + `rankBySemanticPreference` ground candidates in catalog/MAL; Navigator shows path candidates; user confirm → `arriveAnime`. Directions B–E either invent a conversational/HUD surface (breaks [[TASK-053]]), duplicate Story/Signals without LLM ([[data-flow]]), or ambient-mutate environment (reopens [[TASK-055]] / compositor budget) without a clearer user problem than “understand a descriptive ask.” Inventing a feature to advance the task number would violate vision.

---

## 1. Problem

Travellers sometimes describe a path (“something overpowered but darker”) rather than naming a title. Ordinary exact resolve cannot interpret that. A chatbot / assistant / ambient AI would answer the open question wrongly by becoming the protagonist. Need: the smallest world-native role that adds value without dashboard or fabrication.

## 2. Existing AI architecture

```
typed/spoken ask
  → planAnimeAsk (deterministic first; llmCalls 0|1)
  → if semantic: POST /api/anime-intent → validateStructuredAnimeIntent
  → retrieveForStructuredIntent (catalog / MAL search|similar)
  → rankBySemanticPreference
  → Navigator candidate paths
  → explicit user select
  → arriveAnime / hydrate (app-owned)
```

LLM never navigates, never writes URL, never mutates Memory/Watchlist, never authors anime facts. Missing keys degrade to null intent / empty candidates.

## 3. Existing data sources

| Source | Classification |
|---|---|
| `CanonicalAnime` / catalog repository | Safe as structured fields for resolve/rank/present |
| Structured intent (validated) | Safe; untrusted until `validateStructuredAnimeIntent` |
| Discovery / MAL candidates | Safe after normalize; not CanonicalAnime until confirm/canonicalize |
| Watchlist (`aetheranime.watchlist.v1`) | Safe only as structured exclusions / return rows; not AI narrative fuel |
| Memory (`aetheranime.memory.v1`) | Unsafe/unnecessary for AI V1 — Continue owns newest resume ([[TASK-061]]); Horizon stays decorative ([[TASK-057-B]]) |
| Kinship / Destination paths | Safe as existing app retrieval; no LLM text about real anime |
| Current Destination / Navigator phase | Safe for routing UI; unsafe as LLM “context dump” without a later decision |
| Current/Ahead focus | Unnecessary for AI; spatial crossings stay user-owned ([[TASK-054]] · [[TASK-059]]) |

No schema expansion in this task.

## 4. Explicit AI truthfulness boundary

**Allowed:** parse natural language → structured intent fields (`type`, `title`, `seedTitle`, constraints, exclusions) within validator bounds.

**Forbidden:** invent titles, studios, episodes, genres, ratings, relationships, availability, synopses, or lore; claim knowledge the app lacks; auto-navigate; auto-write Memory/Watchlist; auto-activate crossings; fabricate destinations; replace `resolveAnime` / watch-path / metadata authority.

Ungrounded claims → reject intent (`null`) or empty candidates → Navigator `unintelligible` / `unknown`. Never invent a reassuring answer.

LLM role for V1: **parse intent only**. Ranking/rephrasing/summarizing verified data is not required and not selected.

## 5. Alternatives A–E

**A. Navigator intelligence** — AI stays inside the ask instrument; improves interpretation of descriptive asks. Owner: WorldNavigator + `anime.semantic-intent`. Data: existing. API: existing `/api/anime-intent`. Persistence: none. Visual: existing path list. A11y: existing controls. Perf: one LLM call only when `plan` says semantic. Hallucination risk: contained by schema validation + retrieval. Nav risk: low (candidates only). Chatbot risk: low. Compatible with TASK-053–061.

**B. World-native advisory presence** — restrained world signal “speaking” advice. Owner unclear (new layer). Needs copy surface → chatbot/HUD gravity. Visual risk high vs [[TASK-053]]. No unique job A does not already cover for V1.

**C. Destination/world interpretation** — LLM explains the place. Story/Signals already ground interpretation in verified data with **zero** LLM. LLM rewrite of real-anime text violates truth constraint. Low value, high fabrication risk.

**D. Ambient world intelligence** — AI reshapes climate/presence without dialogue. Competes with [[TASK-055]] ownership and [[TASK-046]] budget; implies persistent-state→composition (still open, separate). Not explicit-user-intent. Rejected for V1.

**E. Hybrid (A + world manifestation)** — same functional core as A plus a presence. Extra surface adds chatbot/dashboard risk without new capability. Rejected for V1.

## 6. Comparison matrix

| | Value | World-native | Truth | Nav safety | Chatbot risk | Fits 053–061 |
|---|---|---|---|---|---|---|
| A | High (descriptive asks) | Yes (instrument) | High (schema+retrieve) | High | Low | Yes |
| B | Speculative | Weak | Medium | Medium | High | No |
| C | Low (dup Story/Signals) | Medium | Low | High | Medium | No |
| D | Speculative | Spatial only | N/A facts | High | Low-med | No (055/046) |
| E | Same as A | Mixed | High | High | Medium-high | Weak |

## 7. Selected direction

**A — Navigator intelligence** (lock existing behaviour as the AI participation model).

Not B/C/D/E for V1.

## 8. V1 scope

- Keep deterministic-first `planAnimeAsk`.
- Keep at most one LLM call for semantic asks.
- Keep validated intent → retrieve → rank → path candidates → explicit confirm.
- **No** new UI, CSS, assets, API, persistence key, or AI surface.
- **No** Memory/Watchlist/Horizon/Continue/Destination/crossing changes for AI.

## 9. Interaction model

User asks via existing Navigator (type/voice). App plans. If semantic: interpreting status → intent → candidates as world-native paths. User selects or abandons. Exact catalog resolve may arrive without LLM (existing deterministic path). LLM path never auto-arrives.

## 10. Ownership

| Concern | Owner |
|---|---|
| Ask / phase / path presentation / confirm | WorldNavigator |
| Intent parse (server) | `/api/anime-intent` + semantic provider |
| Validation / plan / retrieve / rank | `shared/anime` |
| Arrival / URL | WorldScene + navigation commit |
| Facts about anime | CanonicalAnime / providers — never LLM |

## 11. Navigation boundary

AI may emit structured intent that *implies* a destination preference. Application validates, retrieves, and presents. **Application owns arrival.** AI never calls `arriveAnime`, never writes `?anime=`, never commits navigation.

## 12. Data boundary

See §3. V1 AI must not consume Memory as conversational context, must not narrate Watchlist, must not drive Current/Ahead.

## 13. Accessibility

Any future AI interaction (if ever) must remain on real Navigator controls: keyboard, accessible name, focus-visible, no decorative-as-button. V1 adds nothing; existing matrix preserved.

## 14. Performance

Target unchanged: ~60 FPS; no polling; no continuous AI animation; no full-viewport AI compositor; LLM/network only on explicit semantic ask.

## 15. Network / API implications

**0 new endpoints for V1.** Existing POST `/api/anime-intent` only. No background AI requests.

## 16. Persistence implications

**0 new keys.** No AI memory, session transcript, or preference store.

## 17. Visual language constraints

AI must not appear as orb, HUD, sidebar, chat drawer, avatar, speech bubble, floating Ask AI, or second Navigator. World identity, geography, Navigator instrument, Destination identity stay dominant.

## 18. Failure / ambiguity behaviour

| Case | Behaviour |
|---|---|
| Ambiguous catalog | Local candidates; no LLM required |
| No result / null intent | `unknown` / `unintelligible`; quiet fail |
| Factual anime question | Do not answer as AI encyclopaedia; resolve/retrieve or fail soft — facts only from app data after arrival (Destination / metadata) |
| Recommendations / similar | Structured intent → retrieve/rank → candidates; user confirms |
| “Go somewhere” named | Deterministic resolve/discover; LLM only if descriptive |
| Implied navigation from LLM | Candidates only; never auto-arrive |

## 19. Security / prompt injection

User text is untrusted. Server provider only. Client never holds LLM credentials. Validator: allowed keys only, bounded strings/lists, URI rejection. Invalid model output → `null`. Intent cannot encode navigation commands or storage writes.

## 20. Acceptance criteria (design)

- Decision record states A locked; B–E rejected for V1.
- Truthfulness, navigation, data, visual, perf, a11y boundaries explicit.
- Production code untouched.
- Open question “How should AI participate?” closed for V1.

## 21. STOP conditions

Stop any future implementation that requires: chatbot UI; AI panel; autonomous navigation; fabricated facts; AI persistent memory; full-screen AI compositor; continuous AI animation; replacing Navigator; changing Memory / Destination / Current-Ahead semantics for AI; new anime schema fields without a separate decision.

## 22. Future implementation boundary

Allowed later **only** as polish of A (stricter validation, better empty copy, ranking tests) without a new surface. Directions B–E need a new decision that proves a user problem A cannot solve. Optional later: Destination grounded paraphrase of **already-loaded** fields — separate decision, still no free-form lore.

## 23. Relationships

- [[TASK-053]] — Navigator stays instrument; no centered AI search/dashboard.
- [[TASK-055]] — living presence not AI-driven.
- [[TASK-057-B]] — Horizon not an AI channel.
- [[TASK-060]] — Destination environment not AI-authored.
- [[TASK-061]] — Continue is Memory resume, not AI suggestion.
- Also protects: [[TASK-046]], [[TASK-054]], [[TASK-057-A]], [[TASK-058-E]], [[TASK-059]].

## Protected behaviour

- LLM output path: validate → retrieve → present → user confirm.
- `planAnimeAsk` remains deterministic-first.
- No production AI surface beyond Navigator ask + path candidates.
- Contract locus: `anime.semantic-intent.ts` (+ Navigator ask wiring).

## Do not undo

- Do not add chat, assistant avatar, or ambient AI speaker for V1.
- Do not let the model author facts about real anime.
- Do not auto-arrive from semantic intent.
- Do not feed Memory/Horizon into the LLM as a default context pack.

## Links

[[TASK-053]] · [[TASK-061]] · [[data-flow]] · [[network]] · [[engineering-rules]] · [[vision]] · [[open-questions]] · [[current-state]]
