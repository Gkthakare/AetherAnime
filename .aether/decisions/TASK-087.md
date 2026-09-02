# TASK-087 — Capital Phase product-market-fit + monetization strategy

Status: FROZEN
Area: product strategy · Capital Phase · entire product

## Decision

**AetherAnime should be built as a privacy-conscious experiential discovery product for descriptive-intent anime fans — not as a catalog, tracker, streamer, or social network.** Primary beachhead: **casual-to-intermediate fans who know what mood/plot they want but not the title.** First revenue path: **honest affiliate commerce on verified outbound “Watch Now” / official paths** after funnel validation — not subscriptions or display ads. North-Star metric: **distinct Destination arrivals per returning visitor** (weekly). First experiment: **enable analytics + Reddit soft launch measuring descriptive-ask → Destination activation rate.**

There is **no product-market fit claim** in this record. The product is a strong V1 experience with unproven distribution and monetization.

## Why

V1 engineering, deployment, semantic discovery, and instrumentation foundation ([[TASK-083]] · [[TASK-086]]) are complete. Capital Phase now requires deciding **what business** to build before spending on growth features or revenue UI. The existing journey (Home → World → Navigator → Destination → Memory/Continue) is differentiated experientially but weak on utility primitives users expect elsewhere (tracking depth, where-to-watch, accounts, community proof).

---

## Part 1 — Market position

### Category comparison (critical)

| Category | Problem solved | User expectation | AetherAnime gap |
|---|---|---|---|
| **MyAnimeList / AniList** | Track, rate, rank, discuss | Definitive database, MAL score, lists, forums | No list depth, no score authority, tiny catalog slice vs ~28k+ titles |
| **IMDb / general discovery** | Cast, ratings, “where to watch” aggregation | Fast lookup, cross-media | No cast graph, no streaming availability matrix |
| **Crunchyroll / streamers** | Watch legally now | One-click play, simulcast, library | Not a streamer; Watch Now is outbound only |
| **Anime-Planet / recommendation sites** | Quiz + genre filters + community rec lists | Structured browse, tags | No grid browse; ceremony before utility |
| **AI rec tools** (Binge Senpai, RekoGen, AniReko, Senpai Cat) | “What should I watch?” via chat/quiz | Instant list, import MAL, mood match | World metaphor + path confirmation; no chat history; no MAL import |
| **Community** (Reddit r/animesuggest, Discord) | Human recommendations | Free text → human answers | Navigator automates path; no social proof layer |
| **Watchlist/tracking apps** | Progress, reminders, calendar | Episode sync, notifications | Local watchlist only; no episode tracking |

**What competitors do poorly that AetherAnime could do well**

1. **Descriptive discovery without feeling like a chatbot or grid** — Navigator + structured semantic intent ([[TASK-062]] · [[TASK-080]]) in a spatial journey.
2. **Emotional framing of a recommendation** — arriving *at* Solo Leveling vs seeing it row #3 in a list.
3. **Privacy-respecting discovery** — no query logging in analytics ([[TASK-086]]); no account required for first value.
4. **Curated truth constraint** — verified official URLs only ([[vision]]); no fabricated availability.

**Genuinely differentiated (potentially defensible)**

- World-native discovery instrument (Navigator) + committed arrival ceremony + Memory/Continue loop.
- Product identity: “anime operating system” vocabulary and spatial model — hard to copy completely without feeling derivative.
- Engineering integrity: server-only secrets, deterministic arrival, frozen V1 scope.

**Currently weaker**

- No accounts → Memory lost on device clear; no cross-device Continue.
- No “where to watch” aggregation; outbound Watch Now only.
- High interaction cost (Home ceremony, World idle) for utility-first users.
- No social proof (scores, reviews, friend activity).
- SEO moat near zero vs MAL’s organic dominance (~92M visits/mo cited by third-party analytics, ~19.5M registered users per MAL CEO reporting — external sources, approximate).
- Monetization surface barely exists.

**Defensible vs visual novelty**

| Signal | Defensible? |
|---|---|
| Navigator descriptive intent + kinship paths | **Yes** — product behavior + data pipeline |
| Memory / Continue | **Partially** — pattern exists elsewhere; world-native integration is differentiated |
| Spatial World / Destination atmosphere | **Partially** — brand + craft; alone = novelty without retention |
| Home arrival ceremony | **Mostly novelty** — memorable first run; repeat users want speed |
| “AI-powered” label | **Not defensible** — commodity (many AI rec tools in 2026) |

---

## Part 2 — Target user

### Segment A — Descriptive-intent discoverers (PRIMARY BEACHHEAD)

- **Who:** 18–34, watched 5–50 anime, streams on Netflix/CR/Prime, often stuck on “what next.”
- **Problem:** Has a vibe/plot in mind, not a title.
- **Current solution:** Reddit posts, ChatGPT, MAL genre browse, friend DMs.
- **Frustration:** Generic lists, spoiler risk, ugly tools, recommendation fatigue.
- **Try AetherAnime:** “Describe it like a place you want to visit.”
- **Return:** Memory + Continue + kinship paths that feel like exploration.
- **Pay for:** Unlikely subscription early; might click outbound merch/stream trial links if trusted.
- **Acquisition:** Reddit r/animesuggest, TikTok/YouTube “describe your anime” demos, shared Destination URLs.
- **Share:** Moderate — will share if discovery result is surprising/good.

### Segment B — Aesthetic experience collectors

- **Who:** Design-forward anime fans, creators, UI enthusiasts.
- **Problem:** Bored by catalog UX.
- **Return:** New Destinations, seasonal visual refreshes.
- **Pay:** Low direct; amplifies brand.
- **Acquisition:** X, Instagram, design communities.
- **Share:** High for screenshots; low conversion to repeat discovery use.

### Segment C — Returning casuals with one favorite

- **Who:** Just finished a hit series; wants “more like this but different.”
- **Current solution:** “Similar anime” on MAL/CR.
- **Try AetherAnime:** Similar/discovery Navigator paths + kinship.
- **Return:** Continue + second Destination.
- **Acquisition:** SEO long-tail (weak early), shared links.

### Segment D — Tracker power users

- **Who:** MAL/AniList list maintainers.
- **Fit:** **Poor** — AetherAnime lacks list depth, API ecosystem, score culture.
- **Do not optimize for this segment in Capital Phase.**

**Primary beachhead: Segment A.** Only segment where Navigator semantic strength ([[TASK-080]]) + world metaphor align with an unsolved job. Segment B is marketing amplifier, not core PMF. Segment C is secondary once A activates. Segment D is a distraction.

---

## Part 3 — Core value proposition

**One sentence:** *AetherAnime lets you describe the anime you want to feel — and arrive there — instead of scrolling lists or interrogating a chatbot.*

**Three benefits**

1. **Describe, don’t search** — plot/mood/similarity asks routed through structured intent, not keyword grids.
2. **Arrive, don’t browse** — each show is a Destination with story/signals/kinship paths, not a card in a feed.
3. **Return without an account** — Memory + Continue resume the last place (device-local today).

**Reason to return:** Continue + “one more path” (kinship or new descriptive ask).

**Reason to share:** A surprising Destination match worth sending as a link (“this found exactly what I meant”).

---

## Part 4 — Activation (recommendation; does not change TASK-085/086 yet)

**Current proposal (TASK-085):** first settled Destination arrival.

**Critique**

- **First Destination (`destination_arrived`)** — correct *minimum* proof the product works; already instrumented ([[TASK-086]]). Does not distinguish curiosity click from discovery success.
- **Settled Destination** — closer to “felt the product” but `destination_settled` is not wired; adds ~1.6s ceremony dependency.
- **Successful discovery journey** — best **strategic** signal for beachhead: non-exact ask (`ask_class` ∈ descriptive, similar, filter) → `destination_arrived`. Measures core differentiation.
- **Second Destination** — best **engagement** signal; already instrumented as `session_multi_destination`.
- **Return visit** — best **retention** signal; server-emitted; lags activation.

**Recommendation**

| Layer | Metric |
|---|---|
| **Operational activation (keep)** | First `destination_arrived` |
| **Strategic activation (experiments)** | First `destination_arrived` where `via=navigator` AND `ask_class` ≠ exact |
| **Engaged user** | `session_multi_destination` OR D7 `return_visit` with `had_destination=true` |

Do not redef frozen TASK-085/086 in code; use strategic activation only in experiment analysis.

---

## Part 5 — Retention loops (ranked)

| Loop | Value | Eng cost | Retention potential | Identity risk |
|---|---|---|---|---|
| 1. Continue + Memory | High | **Low** (exists) | Medium | Low |
| 2. Multi-Destination exploration (Navigator + kinship) | High | Low–Med | **High** | Low |
| 3. Watchlist save-for-later | Medium | Low (exists) | Medium | Low |
| 4. Descriptive re-discovery (“new mood”) | High | Low | High | Low |
| 5. Seasonal / new release prompts | Medium | Med (content) | Medium | Med if pushy |
| 6. Social sharing / collections | Medium | Med–High | Medium | **High** if feed-like |
| 7. Evolving personalized recs (ML) | High | **High** | High | Med |
| 8. Daily discovery habit | Medium | Med | Medium | **High** if gamified |
| 9. Community forums | Low for V1 | High | Low | **High** |

**Test first:** (1) **Continue + Memory**, (2) **Multi-Destination exploration** via kinship + second descriptive ask.

---

## Part 6 — Viral / sharing loop

**Shareable objects evaluated**

| Object | Organic potential | Fit |
|---|---|---|
| Destination URL + OG image | **High** | Visual, specific, low friction |
| Discovery result list | Medium | Looks like every rec site |
| Navigator recommendation text | Low | No raw text stored/shared by design |
| Personalized path / journey recap | Medium | Needs build; privacy care |
| Screenshot of Destination atmosphere | High | Manual today |

**Chosen loop:** **Shareable Destination link** — `/world/aetheranime?anime={slug}` with compelling OG preview (title + poster + “Arrived at …”). Recipient lands in-product, skips re-asking. Do not implement in TASK-087.

---

## Part 7 — Acquisition channels (ranked)

| Channel | Potential | Cost | Difficulty | Scalability | Fit |
|---|---|---|---|---|---|
| **Reddit** (r/animesuggest, r/anime) | High | Low | Low | Med | **Excellent** — descriptive discovery native |
| **Direct / link sharing** | High | Zero | Low | Med | **Excellent** — Destination URLs |
| **Creator partnerships** (YouTube/TikTok) | High | Med | Med | **High** | Good — visual demo product |
| **Discord** | Med | Low | Med | Med | Good for feedback, not scale |
| **X / Instagram** | Med | Low | Med | Med | Good for Segment B amplification |
| **Anime blogs / newsletters** | Med | Med | Med | Med | Good if positioned as discovery tool |
| **TikTok organic** | Med–High | Low | High | High | Needs short demo content |
| **Google SEO** | Med long-term | Med | **High** | High | MAL dominates; long tail only |
| **Programmatic SEO** | Low early | High | High | High | Wrong stage; catalog too small |

**Top 2:** (1) **Reddit soft launch + community participation**, (2) **Destination link sharing + creator demos.**

No spam, no fake engagement, no astroturfing.

---

## Part 8 — Monetization models (ranked)

| Model | User value | Revenue potential | Impl complexity | Traffic need | Trust impact | Identity fit | Time to $ |
|---|---|---|---|---|---|---|---|
| **B. Affiliate commerce** | High (official merch/stream/manga links) | Med per click | **Low** | **Low** | Med (if honest) | **High** | **Fastest** |
| **H. Creator/brand partnerships** | Med | Med–High | Med | Med | Med | High | Med |
| **E/F. Premium discovery/personalization** | High | Med | High | Med | Med | Med | Slow |
| **D. AI usage credits** | Low | Low–Med | Med | Low | **Negative** | **Low** (fights TASK-062) | Med |
| **I. Digital products** (guides, wallpapers) | Low | Low | Med | Med | Neutral | Low | Slow |
| **G. Sponsored Destinations** | Low | Med | Med | Med | **Negative** | **Low** | Med |
| **A. Display advertising** | None | Med at scale | Med | **Very high** | **Negative** | **Low** | Slow |
| **C. Premium subscription** | Med | High at scale | **High** | High | Med | Med | **Slowest** |

**Notes**

- Crunchyroll Store affiliate program reported ended May 2026 (third-party reporting; verify before relying). Broader affiliate options: Entertainment Earth, CDJapan, Amazon Associates, manga retailers — [Affilorama anime affiliate roundup](https://www.affilorama.com/blog/best-anime-affiliate-programs) (2026).
- Display RPM benchmarks for entertainment sites often **~$3–10 page RPM** / **~$3–7 session RPM** US-majority ([Clickio](https://blog.clickio.com/what-is-rpm/), [MonetizationGuy](https://monetizationguy.com/minis/so-what-exactly-is-session-rpm)) — requires volume AetherAnime lacks.

**First monetization model: B — Affiliate commerce** on verified Watch Now / official outbound paths, disclosed, optional, never blocking discovery.

---

## Part 9 — Capital strategy (three stages)

### Stage 1 — 0 → first meaningful revenue

- **Product:** Prove descriptive discovery → Destination → return.
- **Metric:** Strategic activation rate; D7 return with Destination.
- **Engineering:** Enable analytics; wire `destination_settled` + `navigator_results_shown`; OG share tags; affiliate link plumbing on Watch Now only.
- **Acquisition:** Reddit + 10–20 hand invites; measure referrer mix.
- **Monetization:** Affiliate experiment on outbound clicks (track click, not query).
- **Do NOT build:** accounts, ads, subscription, social feed, streaming.

### Stage 2 — early → repeatable revenue

- **Product:** Habit loops — Continue prominence, kinship depth, faster re-entry for returns.
- **Metric:** Weekly returning visitors with ≥2 Destinations; outbound click rate.
- **Engineering:** Skip-home for returns; wire `continue_used`, `watchlist_saved`; optional lightweight account for Memory sync (decision gate).
- **Acquisition:** Creator micro-partnerships; SEO landing for “anime like X” (careful, no content farm).
- **Monetization:** Expand affiliate categories; test one partnership placement.
- **Do NOT build:** forums, gamification, AI chat surface.

### Stage 3 — repeatable → scalable business

- **Product:** Best descriptive discovery experience with trusted outbound commerce.
- **Metric:** North-Star — distinct Destinations per returning visitor/week; affiliate revenue per activated user.
- **Engineering:** Personalization with privacy bounds; premium tier only if retention proves willingness.
- **Acquisition:** Creator program, SEO moat on long-tail discovery pages, Discord community as support not feed.
- **Monetization:** Mix affiliate + selective premium (sync, advanced discovery) OR partnerships — not display ads first.
- **Do NOT build:** streaming, full catalog clone, crypto/Web3 (MAL owner Gaudiy association is a cautionary tale).

---

## Part 10 — Revenue scenarios (illustrative, not forecasts)

**Assumptions labeled**

| Assumption | Conservative | Base | Aggressive |
|---|---|---|---|
| Monthly unique visitors | 2,000 | 10,000 | 50,000 |
| Strategic activation rate | 8% | 15% | 22% |
| Monthly activated users | 160 | 1,500 | 11,000 |
| D30 return rate (had Destination) | 5% | 12% | 20% |
| Outbound click rate (activated) | 10% | 18% | 25% |
| Affiliate $/click (blended) | $0.15 | $0.35 | $0.50 |
| Display session RPM (if ads added) | $2 | $4 | $6 |

**Monthly affiliate-only revenue (illustrative)**

- Conservative: 160 activated × 10% click × $0.15 ≈ **$2.40/mo**
- Base: 1,500 × 18% × $0.35 ≈ **$94/mo**
- Aggressive: 11,000 × 25% × $0.50 ≈ **$1,375/mo**

**Display ads (not recommended Stage 1)** — at 10k sessions/mo and $4 session RPM ≈ **$40/mo** ([MonetizationGuy entertainment range](https://monetizationguy.com/minis/so-what-exactly-is-session-rpm)). Scale requires 100k+ sessions for meaningful revenue.

**Subscription** — even 2% of 1,500 activated at $5/mo ≈ **$150/mo** — but conversion unproven; do not prioritize.

---

## Part 11 — What NOT to build (now)

| Idea | Why reject |
|---|---|
| Social feed | Collapses world into dashboard; violates [[vision]] |
| Full streaming | Legal, cost, identity pivot |
| Massive catalog clone | MAL moat; not differentiated |
| Generic chatbot | [[TASK-062]] explicitly rejected |
| User profiles / forums | High cost; Segment D trap |
| Gamification (streaks, XP) | Damages contemplative world identity |
| Excessive AI features | Commodity; trust/cost risk |
| NFT / crypto | Irrelevant; trust destruction |
| Intrusive display ads | Low revenue early; high UX/trust cost |
| Navigator query history | Privacy violation vs [[TASK-086]] |

---

## Part 12 — First 5 Capital experiments (ranked)

Score = Impact × Confidence / Engineering cost (relative)

### Exp 1 — Analytics + funnel baseline (HIGHEST PRIORITY)

- **Hypothesis:** We cannot run Capital experiments without baseline funnel data.
- **Target user:** All segments.
- **Change:** Enable Plausible + `ANALYTICS_ENABLED`; no product change.
- **Primary metric:** Visitor → `destination_arrived` conversion.
- **Baseline:** None (analytics off).
- **Expected:** Establish 7-day baseline within 2 weeks of ≥500 visitors.
- **Guardrails:** Privacy ([[TASK-086]]); no query logging; FPS unchanged.
- **Decision rule:** Proceed to Exp 2 if ≥500 uniques/week OR stop acquisition until traffic sufficient.
- **Eng cost:** **S** (config only)

### Exp 2 — Reddit descriptive discovery soft launch

- **Hypothesis:** Segment A will activate at ≥12% on descriptive asks via Reddit.
- **Target user:** Segment A.
- **Change:** 5–10 genuine r/animesuggest participations linking Destination results (not spam).
- **Primary metric:** Strategic activation rate (`navigator` + non-exact `ask_class` → `destination_arrived`).
- **Baseline:** Exp 1 overall activation.
- **Expected:** 2–5× traffic vs organic; strategic activation ≥10%.
- **Guardrails:** No astroturfing; no prompt logging; community rules respected.
- **Decision rule:** Continue Reddit if strategic activation ≥ baseline + 5pp; else pivot to creators.
- **Eng cost:** **S** (operator time)

### Exp 3 — Continue / return loop visibility

- **Hypothesis:** Returning users with Memory will use Continue ≥20% of idle sessions.
- **Target user:** Segment A/C.
- **Change:** Wire `continue_used`; optional copy tweak on Continue (minimal).
- **Primary metric:** `continue_used` / `return_visit` rate.
- **Baseline:** 0 (unwired).
- **Expected:** Continue used in ≥15% of return sessions with Memory.
- **Guardrails:** [[TASK-061]] semantics unchanged; no second Continue surface.
- **Decision rule:** Invest in skip-home for returns if Continue ≥10%; else improve discovery first.
- **Eng cost:** **S**

### Exp 4 — Shareable Destination OG

- **Hypothesis:** Shared Destination links convert ≥8% of recipients to `destination_arrived`.
- **Target user:** Segment A + B amplifiers.
- **Change:** OG meta for `?anime=` routes; no in-app share button required initially.
- **Primary metric:** `world_entered` source=direct with `destination_arrived` same session.
- **Baseline:** Direct traffic activation pre-OG.
- **Expected:** +30% direct traffic; recipient activation ≥8%.
- **Guardrails:** No tracking pixels; privacy policy updated if needed.
- **Decision rule:** Add in-app “share this Destination” if direct activation ≥8%.
- **Eng cost:** **M**

### Exp 5 — Affiliate Watch Now pilot

- **Hypothesis:** Activated users will click verified outbound ≥12% without trust loss.
- **Target user:** Activated Segment A.
- **Change:** Affiliate parameters on existing Watch Now official links only; disclosure line.
- **Primary metric:** Outbound click / `destination_arrived` (new coarse event or link redirect — future task).
- **Baseline:** Organic Watch Now clicks (estimate from logs if any).
- **Expected:** ≥10% click rate; zero support complaints about dark patterns.
- **Guardrails:** No interstitials; no fake “watch here”; verified URLs only ([[vision]]).
- **Decision rule:** Expand affiliate partners if ≥10% and NPS neutral; remove if complaints.
- **Eng cost:** **M**

**Rank:** Exp 1 → Exp 2 → Exp 3 → Exp 4 → Exp 5

---

## Part 13 — Analytics requirements ([[TASK-086]])

### Required before Exp 1

**CORE (already implemented — must enable in production):**

- `world_entered`, `navigator_ask_submitted`, `destination_arrived`, `session_multi_destination`, `return_visit`

**GROWTH (wire before Exp 3–5):**

| Event | Needed for |
|---|---|
| `navigator_results_shown` | Discovery funnel drop-off (ask → results → arrival) |
| `destination_settled` | True “felt the ceremony” activation analysis |
| `continue_used` | Exp 3 retention |
| `watchlist_saved` | Save intent signal |
| `home_viewed` | Landing vs deep-link attribution |

### Derivable today (once analytics ON)

- Visitor → World → Ask → Destination funnel
- Strategic activation (`ask_class` + `via` + `destination_arrived`)
- Multi-destination rate
- D1/D7 return (`return_visit`, Plausible retention)
- Catalog vs discovered mix (`origin`)
- Acquisition mix (Plausible referrer/UTM)

### Impossible without additional instrumentation

- Outbound Watch Now / affiliate clicks (needs redirect or `outbound_click` event — **not in TASK-086**)
- Share attribution (needs share param or `share_landing` event)
- Time-to-settled (needs `destination_settled`)
- Results → select conversion (needs `navigator_results_shown` + path select event — select not yet in schema)
- Revenue (needs affiliate network integration)

**Do not expand analytics beyond experiment needs.**

---

## Part 14 — 90-day Capital roadmap

### Weeks 1–2

| Area | Action |
|---|---|
| Product | No feature changes; document strategic activation definition |
| Engineering | Enable Plausible production config; legal cookie review |
| Acquisition | Prepare Reddit participation guidelines; 3 Destination demo links |
| Measurement | Exp 1 live; daily funnel dashboard in Plausible |
| Monetization | None |

### Weeks 3–4

| Area | Action |
|---|---|
| Product | Observe friction; note skip-home need qualitatively |
| Engineering | Wire `navigator_results_shown`, `destination_settled`, `continue_used` |
| Acquisition | Exp 2 Reddit soft launch (5–10 genuine posts) |
| Measurement | Baseline strategic activation + channel mix |
| Monetization | Research affiliate programs (verify Crunchyroll store status) |

### Weeks 5–8

| Area | Action |
|---|---|
| Product | Minimal Continue/copy test if data supports (Exp 3) |
| Engineering | OG tags for Destination URLs (Exp 4) |
| Acquisition | 1–2 micro-creator demos; collect Destination shares |
| Measurement | D7 retention cohort; multi-destination rate |
| Monetization | Design affiliate disclosure; no UI until Exp 5 gate |

### Weeks 9–12

| Area | Action |
|---|---|
| Product | Decision gate: skip-home for returns OR kinship emphasis |
| Engineering | Exp 5 affiliate pilot if activation ≥10%; else fix funnel |
| Acquisition | Double down on winning channel only |
| Measurement | North-Star weekly review: distinct Destinations / returning visitor |
| Monetization | First revenue target: **any verified affiliate $** or kill affiliate path |

---

## Part 15 — Strategy decision summary

1. **Primary user:** Descriptive-intent discoverers (Segment A)
2. **Core problem:** “I know the vibe/plot, not the title.”
3. **Unique advantage:** World-native Navigator discovery with committed arrival + privacy
4. **Activation (operational):** First `destination_arrived`
5. **Retention #1:** Continue + Memory
6. **Retention #2:** Multi-Destination exploration (kinship + new asks)
7. **Acquisition #1:** Reddit (r/animesuggest)
8. **Acquisition #2:** Destination link sharing + creator demos
9. **First monetization:** Affiliate commerce on verified outbound links
10. **Build next:** Enable analytics → wire 3 growth events → OG share → affiliate pilot
11. **Do NOT build:** Social feed, streaming, accounts (until retention gate), display ads, chatbot
12. **North-Star:** Distinct Destination arrivals per **returning** visitor (weekly)
13. **First experiment:** Exp 1 — analytics + funnel baseline

## Do not undo

- Do not pivot to MAL clone, tracker, or streamer.
- Do not monetize before activation baseline exists.
- Do not log Navigator queries for growth hacks.
- Do not claim PMF without D7 retention + repeat Destination data.

## Links

[[TASK-085]] · [[TASK-086]] · [[TASK-062]] · [[TASK-061]] · [[TASK-057-A]] · [[vision]] · [[current-state]]
