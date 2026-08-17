# 07 — Design, Motion & Persona-Gating Plan

The companion half of `06-content-and-persona-plan.md`, and a review of it.

`06` plans **what the site says** and **how many pages say it**. It contains no
design direction, no motion vocabulary, and no art direction per page class. On
its own it would ship twenty new documents styled by whatever the component
library happens to do — which makes the site *more* generic, not less, because
generic-ness scales with surface area.

This document supplies the missing half and amends `06` where the two conflict.

**Provenance rule, inherited from the design-recon toolkit:** every value here is
either `[measured]` off a named live reference with a real cursor, `[derived]`
from a measured value by stated arithmetic, or `[inferred]` and flagged as such.
An unmarked number is a bug. This is the same rule that governs PR #2.

---

## 1. Review of `06` — findings

Ordered by severity. Each names what would go wrong, not merely what is absent.

### F1 — `06` has no design content at all, while the goal is design-led · **blocking**

The goal is creative-studio output. `06` is an information-architecture and
copy document. Nothing in its sixteen sections specifies a colour, a curve, a
duration, a layout system, or a single effect. Its Wave table (§15) goes
A → F without a design wave.

Executed as written, `06` triples the page count against a component library
built for six pages. Twenty documents inheriting `Section` + `Card` + `Button`
is a template. **§4–§7 of this document are the answer.**

### F2 — the motion budget forbids the aesthetic the goal asks for · **blocking**

This is the finding that matters most, because it is invisible until
implementation and then blocks everything at once.

`05-ui-ux-spec.md` S6.1 caps continuously-animating decorative layers at **≤ 1**,
bans **ambient full-viewport effects** outright, and bans **any animation on the
LCP element**. S6.6 additionally requires motion be **CSS-only** — no animation
library, no `IntersectionObserver`, no React state, transform and opacity only.

Those rules are why PR #2 applied nine effects and rejected ten. **Four of the
ten rejections cite S6.1's infinite-animation ban or its one-layer cap
directly**, and a fifth cites the JS budget. The rejected list is, almost
exactly, the list of things that make the reference sites look like the
reference sites.

spline.design is an ambient full-viewport WebGL scene with glass over it. That
is not a near-miss against S6.1 — it is the specific thing S6.1 exists to
prevent. **"Double the effects" cannot be reached by trying harder inside the
current spec.** It requires a governed amendment, or the same wall is hit again
at the same place.

S6 is not wrong. It was written to kill a specific, real failure — a matrix-rain
canvas, a particle field, a cursor reticle and a typewriter `h1`, all running at
once, on a page whose job was to be trusted by regulated buyers. That decision
was correct and must not be quietly reversed. **§3 proposes replacing a global
prohibition with per-page-class budgets**, which preserves the original
intent — the trust pages stay austere — while giving the showcase pages room.

### F3 — "persona-gated by design" is not what `06` specifies · **blocking**

`06` §6 specifies persona **adaptation**: resolve from signals, fall back to
Persona 1, swap client-side after hydration. The goal asks for the site to be
**gated** — the visitor declares who they are, and the site becomes theirs.

These are different products. Adaptation is a site that guesses; gating is a
site that asks. They also have opposite failure modes: adaptation's failure is
guessing wrong invisibly, gating's is friction at the door.

`06`'s mechanism additionally collides with PR #2 on the home page: it swaps
the hero **client-side after hydration**. The hero `h1` is the LCP element and
now carries a per-character reveal. Rewriting it post-hydration means the LCP
element changes after paint — which either re-triggers the wave, or strands it
mid-flight, and puts CLS at risk on the one element the whole design leans on.
`06` acknowledges the shift risk and answers it with a ±15% length budget; that
constrains reflow, it does not remove a post-paint mutation of the LCP node.

**§5 resolves this** with a gate that is a real route, not a client-side swap.

### F4 — the 70% target measures volume, and the goal asks for impact · **major**

`06` §4 sets "~70% newly authored prose" against a 1,045-word baseline, verified
by a word-count script. Word count is the one content metric that a bad writer
can always hit. It rewards padding, and it is *inversely* correlated with the
quality of the three named references: 8090, Factory and Heizen are powerful
because of restraint and proof density.

The goal says **50× the copy's impact**. A word-count gate cannot see impact,
and worse, it actively pays for the opposite. **§6 replaces it** with four
measurable properties that a padded draft fails.

### F5 — 26 routes produces thin pages · **major**

`06` §4 allocates ~380 new words across four product pages — **~95 words each**,
plus chrome. A 95-word page is thin for a reader and thin for a crawler, and
the site's whole SEO argument in `04-plan.md` was that per-URL depth is what
earns ranking. Twenty-six shallow documents is a worse outcome than fourteen
substantial ones. **§7 consolidates.**

### F6 — the plan pre-authorises its own budget failure · **major**

`06` §15: app JS is 42.6 kB against a 45 kB budget, Waves B and E "will exceed
it", and the budget "is to be re-based on measurement". Re-basing a budget
because you exceeded it is not measurement, it is renaming the failure.

The plan is right that 26 routes plus persona logic will not fit. It draws the
wrong conclusion. **Most of these routes need no JavaScript at all** — they are
prerendered documents with CSS motion. The correct move is a **per-route**
budget where the marketing routes trend toward zero JS, not a raised global
ceiling. **§8.**

### F7 — `Foundry` is a heavily occupied name · **major, open**

`06` uses **`Foundry`** as the platform name and flags naming as an open decision
without naming the risk: **Palantir Foundry** and **Azure AI Foundry** are both
established products in adjacent enterprise-AI territory, and Foundry is also a
long-standing VFX software brand. For an AI platform sold to enterprise buyers
that is a collision on the two axes that matter — buyer recall and search
visibility.

`Manthan` was trialled as a replacement on 2026-08-17 and **reverted the same
day** at the owner's direction; `Foundry` stands as the working placeholder.

The risk is therefore **live, not resolved**. This document makes no legal
conclusion — it flags that the name needs a real clearance search before ~2,450
words are written around it. `06` correctly isolates it as one constant, so the
cost of changing it stays low: **write the copy, treat the name as provisional.**

### F8 — verification has no design, motion or copy gates · **major**

`06` §16 lists seven checks, all content and persona. Nothing asserts a curve,
a duration, a contrast ratio, an effect count, or any property of the copy
beyond its volume. The rubric that scored PR #2 (`design-recon/RUBRIC.md`,
19 machine-checked criteria) is not referenced. **§10 extends it.**

### F9 — the base branch is stale · **minor, mechanical**

PR #3 targeted `claude/marketing-website-waves-xq9sep`, the already-merged PR #1
branch. It therefore did not contain PR #2's design work, and `06` was written
against a visual system that no longer exists. **Retargeted to `main`.**

### Working convention for this programme

Set by the repo owner, and binding on every wave in §9:

| PR | Branch | Base | Carries |
|---|---|---|---|
| **#2** | `design-recon/measured-aesthetic-pass` | `main` | The nine measured effects. Lands first. |
| **#3** | `claude/content-persona-plan` | `main` | **Planning only.** `06`, `07`, and every subsequent refinement to either. Never source. |
| **#4** | *(implementation)* | **PR #2's branch** | All source and behaviour changes executing this plan. |

So: a refinement to the plan is a commit on **#3**; anything built from the plan
is a commit on **#4**, which is based on **#2** and therefore inherits the
measured aesthetic rather than re-deriving it. Work proceeds locally and is
committed to #4 at the end of each iteration.

The practical consequence for §9: **Wave 0 belongs to PR #3** — every item in it
is a decision or a clearance, not a change. Waves A–H are PR #4.

### What `06` gets right, and this document does not touch

Worth stating plainly, because the findings above are all corrections:

- **Platform-plus-service positioning**, with the service as proof the platform
  works. This is the strongest idea in either document and everything here is
  built to serve it.
- **Adaptation on evidence, never inference.** No fingerprinting, no
  firmographic guessing. §5 keeps this rule and hardens it.
- **Commercial terms identical across personas**, with a check asserting it.
  This is the difference between segmentation and price discrimination, and
  `06` is right to make it a machine check rather than a promise.
- **Evidence labels never softened per audience**, and the diagnostic keeps
  telling visitors when they do not need a sprint. Load-bearing. Untouched.
- **Copy blocks written as final customer-facing text**, not direction.
- **Frameworks named and applied** rather than gestured at.

---

## 2. What "double the effects" resolves to

PR #2 shipped **9** measured effects from **6** sites. Doubling is **18**, and
the goal asks for increased *diversity* alongside count — so the target is set
on both axes, and on a third that stops the count being gamed.

| Axis | PR #2 | Target |
|---|---|---|
| Distinct measured effects | 9 | **20** |
| Distinct reference sites drawn on | 6 | **9** |
| Distinct effect *categories* (§2.1) | 3 of 8 | **7 of 8** |
| Effects with no referent on the page | 0 | **0** — unchanged, non-negotiable |

The third row is the anti-gaming clause. Twenty colour-transition tweaks would
satisfy a count and fail the goal; the category floor is what makes the number
mean "diverse".

### 2.1 The eight categories

Derived from the eleven blueprints in `design-recon/blueprints/`. PR #2's nine
effects occupy only three of these — which is precisely why the result reads as
a well-tuned template rather than a studio piece.

| # | Category | PR #2 | Notes |
|---|---|---|---|
| 1 | Colour & token systems | ✅ 3 | accent, tints, tracking |
| 2 | Timing & easing systems | ✅ 3 | curve, durations, paired exits |
| 3 | Per-character / text motion | ✅ 1 | the hero wave |
| 4 | Scroll-driven & viewport-linked | ✅ 2 | reveals |
| 5 | **Surface & material** | ❌ 0 | glass, transmission, inset elevation, grain |
| 6 | **Pointer-reactive** | ❌ 0 | spotlight, parallax, magnetic, tilt |
| 7 | **Generative / canvas / shader** | ❌ 0 | the spline.design axis |
| 8 | **Continuity & transition** | ⚠️ partial | view transitions exist; shared-element does not |

Categories 5–7 are empty **because S6.1 forbids them**. This is F2 restated as
arithmetic: the effect deficit and the spec conflict are the same fact.

---

## 3. Proposed amendment to `05-ui-ux-spec.md` §S6

Filed as a spec amendment, in the format §S6's own amendment log uses. **Not to
be implemented until the amendment is accepted** — this document proposes, the
spec decides.

### The principle

S6 currently applies one budget to every page. But the site's pages do not have
one job. A pricing page is read by someone deciding whether to trust an invoice;
a platform page is read by someone deciding whether these people can build. The
first is damaged by spectacle. The second is damaged by its absence.

**Replace the global budget with three page classes.** The strictest class is
*stricter* than today's rule, which is the mechanism that makes the loosest
class safe to grant.

### S6.1-R — motion budget by page class

| | **Class T — Trust** | **Class N — Narrative** | **Class S — Showcase** |
|---|---|---|---|
| Routes | `/engage`, `/work/*`, `/services/*`, diagnostic, forms | `/`, `/for/*`, `/sectors/*` | `/platform`, `/products/*` |
| Continuous decorative layers | **0** | ≤ 1 | ≤ 2 |
| Ambient full-viewport effects | Banned | Banned | **Permitted, hero only** |
| Animation on LCP element | Banned | Colour/opacity only, never geometry | Colour/opacity only |
| Pointer-reactive surfaces | Banned | ≤ 1 | ≤ 3 |
| Canvas / WebGL | Banned | Banned | ≤ 1, lazy, `IntersectionObserver`-paused |
| Route JS budget (gzip) | **0 kB** | ≤ 8 kB | ≤ 30 kB |

Unchanged and inherited by every class: `prefers-reduced-motion` disables
decorative motion by name (S6.3); off-screen and backgrounded animation pauses
(S6.5); no React state from pointer handlers (S6.4); no layout-shifting
animation; every effect needs a referent on the page.

Two rules become *stricter*: Class T drops from ≤1 continuous layer to **zero**,
and gains a **0 kB JS** budget. The pages where money and trust are decided get
quieter than they are today. That is the trade being proposed, and it should be
judged as a whole — the showcase pages get room precisely because the commercial
pages give it up.

### S6.6-R — motion may use JavaScript, under conditions

S6.6's CSS-only rule is currently doing two different jobs: keeping the bundle
small, and keeping motion off the main thread. The bundle job is now done
explicitly by the per-route budgets above. The main-thread job should be stated
directly rather than enforced through a proxy.

Permitted, in Class S only, and only when all four hold:

1. It is loaded by dynamic `import()`, never in the shared bundle
2. It is gated on `IntersectionObserver` and `document.hidden`
3. It is skipped entirely under `prefers-reduced-motion: reduce` and under
   `navigator.connection.saveData`
4. Removing it degrades to a static composition that is still complete

Condition 4 is the important one: it makes every heavy effect an enhancement
over something that already works, which is also what keeps prerendering honest.

### S6.2 — retirements stand

`MatrixRainCanvas`, the particle field, the cursor reticle, the marquee ticker,
the rotating crosshair, the sweeping laser and the typewriter `h1` stay retired,
permanently, in **every** class. This amendment is not a route back to any of
them, and none of the effects in §4 resembles them: each has a measured source
and a referent on the page, which is exactly what that list lacked.

---

## 4. The effect programme — 9 → 20

Each row is measured off a named reference, assigned to a page class, and has a
stated referent. **Rows marked ⛔ do not ship unless §3 is accepted.**

### Retained from PR #2 (9)

Accent `#d6fb41`, display tracking `-0.05em`, per-character hero wave, Linear's
interactive curve at 160 ms, nav hover plate, Stripe scrim timing, Apple panel
timing, Liveblocks paired exits, Raycast tint tokens. All Class N/T-safe. All
unchanged.

### New (11)

| # | Effect | Measured from | Cat | Class | Referent on the page |
|---|---|---|---|---|---|
| 10 | Inset-ring elevation, `0 0 0 1px inset` in the card colour | family.co ✅ | 5 | all | Every card; replaces flat borders sitewide |
| 11 | ~~Layered surface grain~~ — **re-scoped to Class S** | vercel.com ⚠️ | 5 | **S only** | vercel's grain is a *canvas* technique, banned outside Class S; a CSS/SVG version would be `[derived]`, not a recreation |
| ~~12~~ | ~~Pointer spotlight on card grids~~ | **RETRACTED** | — | — | linear.app has no pointer-reactive property — see §11 |
| 13-R | Two-tier hover darkening — `0.1s ease` buttons, `0.2s ease` nav | family.co ✅ | 2 | all | Every button and link |
| 14 | Scroll-scrubbed sequence, pinned | apple.com | 4 | S | Foundry's three-stage pipeline on `/platform` |
| 15 | Shared-element transition across documents | — ⚠️ derived | 8 | all | Sector card → sector page; card becomes hero |
| ~~16~~ | ~~Numeric count-up on the proof strip~~ | **RETRACTED** | — | — | stripe's numbers are `[inferred]` in the blueprint — no measured count-up exists |
| 17 | Knockout / masked type over media | resend.com | 5 | S | `/work/mom-alimento` hero |
| 18 | Sticky section index with scroll-linked marker | stripe.com | 4 | N | Long sector and case-study pages |
| 19 | ⛔ Ambient shader field, hero only | spline.design | 7 | S | `/platform` hero — the factory, as a live surface |
| 20 | ⛔ Transmission/glass panel over the field | spline.design | 5 | S | The Foundry stage card sitting on #19 |
| 21 | **Diegetic schematic — the pipeline, animated** ✅ **SHIPPED** | confident-ai.com ✅ | — | N | `PipelinePanel` — the four stages VipraTech actually operates |
| 22 | **Diegetic schematic — the approval gate + audit line** | confident-ai.com ✅ | 7 | S | `/platform` — Foundry's gate is the product's whole claim |
| 23 | Two-tier timing split, 0.15 s interaction vs 0.4 s diagram | confident-ai.com ✅ | 2 | all | Every control, and every schematic stroke |

✅ **family.co is now measured** — headed GPU-backed Playwright with real hover
and real Tab presses, 2026-08-17, since the domain stayed blocked to the browser
extension. #10 is confirmed and cleared. The original #13 ("magnetic CTA") was
**retracted — it does not exist on the page** — and replaced by #13-R, which is
what a real cursor actually produced. See §11.

⚠️ **#15 has no measured source.** Cross-document shared-element transitions
were not captured in any blueprint. It is `[inferred]` from the `@view-transition`
support already in `index.css`. Either measure it on a reference that does it,
or ship it as an explicitly-marked original rather than a recreation.

### The arithmetic

9 retained + 14 new = **23 effects**, **10 sites**
(codesandbox, linear, stripe, apple, liveblocks, raycast, vercel, resend,
spline, confident-ai — plus family.co, now measured), and **8 of 8 categories**.
Category 7 is filled twice over: by the shader field (#19) and, more importantly,
by the diegetic schematics (#21–#22), which reach it without spectacle.

**Without the §3 amendment**: #19 and #20 are blocked, #14 conflicts with the
LCP rule, and #11–#13 exceed the one-layer cap wherever they co-occur. The
achievable total inside today's spec is **roughly 14 effects and 5 of 8
categories** — better than today, and short of the goal. That is the cost of
declining the amendment, stated up front so the choice is informed.

---

## 5. Persona gating — resolving F3

`06` proposes soft adaptation. The goal asks for gating. Neither pure form
survives contact with the site's own constraints: pure gating destroys SEO
(every page behind a chooser is a page Google never indexes and a shared link
never lands on) and adds friction before any value is shown; pure adaptation is
what `06` has, and it is not what was asked for.

### The resolution: the gate is a route, not a curtain

1. **`/` is never gated.** It ships Persona 1, complete, prerendered, indexable,
   linkable. It is the strongest single page on the site.
2. **The gate is one deliberate control** below the hero — five named audiences,
   as `06` §6 already specifies.
3. **Choosing navigates.** `/for/<persona>/` is a real prerendered document with
   its own metadata, canonical, OG tags and JSON-LD. Nothing swaps client-side.
4. **The choice persists** in `localStorage` under `vt.persona` and changes
   subsequent *navigation targets* — sector cards link into the persona's
   framing — but never rewrites a page already painted.
5. **A visible, always-reachable escape.** The current persona is named in the
   header with a one-click change and a "show me everything" exit. A gate the
   visitor cannot see is a trap.
6. **Deep links always win** over stored state, so a shared URL shows the sender
   what the recipient sees.

This satisfies "gated by design" — the site genuinely bifurcates, and the
visitor genuinely declares — while every variant stays a real indexable
document. It also **removes the collision with PR #2's hero** (F3): no
post-hydration mutation of the LCP element, anywhere, so the wave and the CLS
budget are untouched.

**Inherited unchanged from `06` §6:** evidence-only resolution, no
fingerprinting, no firmographic inference, Persona 1 on empty signal, and
commercial terms byte-identical across every variant.

### Art direction per persona — the visible half of bifurcation

Gating that changes only words is not gating "by design". Each persona shifts
one **accent-adjacent** token and one **density** setting, against a fixed
brand core:

| | Accent shift | Density |
|---|---|---|
| 1 Consumer brand | brand lime, unmodified | Standard |
| 2 Finance & claims | lime → `--color-verified` for proof marks | Dense — tables over cards |
| 3 Engineering | lime, with mono-first headings | Standard, code-forward |
| 4 Risk & assurance | lime → `--color-attention` for evidence marks | Dense, evidence-first ordering |
| 5 Customer ops | lime, warmer supporting tint | Airy — fewer, larger cards |

Brand lime, type scale, spacing rhythm and every commercial number stay fixed.
The shift must be legible as *the same company speaking to a different room*,
never as a different company. **Every variant re-runs the contrast gate**; a
persona is not a licence to drop below the floor.

---

## 6. Copy impact — replacing the 70% target (F4)

Delete the word-count gate. It is replaceable by four properties that a padded
draft fails and a Factory-grade draft passes. Each is countable, so each can be
a check rather than an opinion.

| # | Property | Measure | Gate |
|---|---|---|---|
| P1 | **Specificity** | Proper nouns + concrete numerals ÷ 100 words | ≥ 4.0 |
| P2 | **Proof density** | Claims with an attached number, artifact or named system ÷ all claims | ≥ 0.6 |
| P3 | **Adjective load** | Unquantified evaluative adjectives ÷ 100 words | ≤ 2.0 |
| P4 | **Labour** | Words before the visitor's own problem is named, per page | ≤ 40 |

P1 and P3 pull against each other by design: the only way to raise specificity
while lowering adjective load is to replace *"dramatically faster"* with
*"2 months to production"*. That substitution, repeated across the site, **is**
the 50× — not more words, different ones.

P4 operationalises Shapiro's `Desire − (Labor + Confusion)`: every word before
the reader sees their own problem is labour charged against desire.

Baselines get measured on the current site first, so the improvement is a
measured delta rather than an assertion. **Every page must beat its own
baseline** — a site-wide average lets a strong home page carry twenty weak
pages, which is exactly the failure mode F5 describes.

### Structure, per page — retained from `06` and made mandatory

Shapiro's section order and a full SB7 pass per persona are `06`'s strongest
content contribution and carry forward unchanged. One addition: **every page
states the failure case.** The site's most distinctive existing asset is the
diagnostic that tells visitors when they do *not* need a sprint. That posture is
worth more than any effect in §4, and it should appear on every page rather than
being quarantined in one tool.

---

## 7. Route consolidation — 26 → 17 (F5)

| `06` | Revised | Rationale |
|---|---|---|
| `/products/*` ×4 | **1** — `/products/` | ~95 words each cannot carry a document. One page, four deep sections, real substance each. |
| `/sectors/*` ×5 | **5** — kept | These are the SEO surface and carry the sector build lists. |
| `/for/*` ×5 | **5** — kept | Now the gate targets (§5), so they are load-bearing. |
| `/platform`, `/work/mom-alimento`, `/engage` | **3** — kept | The three highest-intent pages on the site. |
| `/`, `/services/*` ×5 | **6** — kept | Existing, ranking, untouched. |
| | **17** | |

Nine fewer documents, none of the content lost — it relocates into pages thick
enough to rank and to reward a reader. Re-expand `/products/*` into their own
routes when any single product has ≥ 400 words of real substance behind it.

---

## 8. Budgets — per route, not global (F6)

Delete the global 45 kB app-JS budget. Replace with per-route budgets, enforced
in `scripts/check-bundle.mjs` per prerendered document:

| Class | Route JS (gzip) | Rationale |
|---|---|---|
| T — Trust | **0 kB** | Prerendered HTML + CSS. No hydration at all. |
| N — Narrative | ≤ 8 kB | Persona chooser and nav only. |
| S — Showcase | ≤ 30 kB | Lazy-loaded, `import()`-gated, never in the shared chunk. |
| Shared CSS | ≤ 16 kB | From 12 kB, for 20 effects across 17 routes. Currently 8.60 kB. |

The diagnostic modal stays route-split as it is today. **This is not the raised
ceiling `06` §15 proposed** — the total across the site goes *down*, because
most routes stop shipping JavaScript entirely. It is a stricter regime that
happens to permit one expensive page.

---

## 9. Revised waves

`06`'s A–F, with design interleaved rather than appended. Interleaving matters:
if design lands last it becomes decoration applied to finished pages, which is
the failure this document exists to prevent.

| Wave | Scope | Depends on |
|---|---|---|
| **0** | **Decisions & clearances.** §3 amendment accepted or declined; platform name cleared (F7); MOM/Alimento permission; grant `family.co` + `spline.design` to the browser extension and re-verify both blueprints with a real cursor. | — |
| **A** | Data layer per `06` A. Plus: measure P1–P4 baselines on the current site. | 0 |
| **B** | Routing to **17** documents (§7); per-route budget enforcement (§8). | A |
| **C** | **Design system**: page classes, per-persona tokens (§5), effects #10–#13, #16, #18. Applies to *existing* pages first, so the vocabulary is proven before new pages consume it. | A, §3 |
| **D** | `/platform`, `/work/mom-alimento`, `/engage`; home restructure; effects #14, #17. | B, C |
| **E** | `/sectors/*` ×5, `/products/`; effect #15. | B, C |
| **F** | Persona gate (§5) — route-based, no client-side hero swap. | B, D, E |
| **G** | **Showcase tier: #19, #20 on `/platform`.** Amendment accepted 2026-08-17, so this ships. | D |
| **H** | Copy pass against P1–P4; full verification; rubric re-score. | all |

**Wave G ships.** It was drafted as the severable wave — the one to cut if scope
had to give — but the §3 amendment was accepted on 2026-08-17 specifically to
get the motion, so it is now core scope. It remains the *last* wave, because
conditions 1–4 of S6.6-R require everything under it to be complete and correct
without it first.

---

## 10. Verification

`06` §16's seven checks all carry forward. Added:

| Check | Method |
|---|---|
| 20 distinct measured effects, ≥ 9 sites, ≥ 7 of 8 categories | Extend `design-recon/RUBRIC.md` F1/F2 with a category axis |
| Every effect names its measured source in-code | Existing rubric A1, unchanged |
| Per-page-class motion budget holds | Per route: count continuous animations, assert ≤ class limit |
| Class T routes ship 0 kB JS | `check-bundle.mjs`, per document |
| P1–P4 pass **per page**, not on average | Copy-analysis script over rendered prose |
| Every persona variant passes the contrast gate | Existing contrast helper, run per variant |
| Reduced-motion disables every §4 effect by name | Assert `animationName: none` on each, with the query forced |
| Save-Data and no-WebGL degrade to a complete static composition | Two runs with the capability disabled; assert no empty region |
| Persona gate never mutates the LCP element post-paint | Assert `h1` textContent identical before and after hydration |
| Effects with no referent on the page | Existing rubric E1 — must stay 0 |

### Rubric amendment

`design-recon/RUBRIC.md` §F was added because the first version scored 100/100
on a recreation drawing on 2 of 11 sites. It now needs the same treatment on a
second axis, for the same reason: **F1 counts effects, and a count is gameable
by repetition.** Add **F4 — category coverage ≥ 7 of 8**, and make F1's target
20. Sections A (measured provenance) and E (anti-slop) are unchanged and remain
the constraint that stops F being satisfied by bulk.

---

## 11. Decisions taken — 2026-08-17

| # | Decision | Effect |
|---|---|---|
| 1 | **§3 accepted.** `05-ui-ux-spec.md` amended — S6.1 → S6.1-R, S6.6 → S6.6-R, log entry `2026-08-17/1`. | Showcase tier unblocked. All 20 effects in §4 are in scope. |
| 2 | **Wave G is no longer severable.** The ambient field and the glass panel ship. | §9 revised. |
| 3 | **Platform name stays `Foundry`**, as a placeholder. | `Manthan` was trialled and reverted the same day. The collision in F7 is unresolved and still owed a clearance search. |
| 4 | **Gating confirmed over adaptation** (§5). | The gate is a route. Nothing swaps client-side. |

### Corrections forced by live measurement — `family.co`, 2026-08-17

The domain was still blocked to the browser extension, so it was measured with a
headed GPU-backed Playwright session driving real hover and real Tab presses
instead. Two of this document's own claims changed as a result:

- **Effect #10, inset-ring elevation — CONFIRMED, and stronger than claimed.**
  `color(display-p3 .94902 .941176 .929412) 0 0 0 1px inset` occurs **30 times**,
  the single most common elevation on the page. Drop shadows appear at most twice
  each. The site really does light its surfaces from within rather than casting
  them. Now `[measured]` and cleared to implement.
- **Effect #13, "magnetic CTA" — RETRACTED. It does not exist.** Every button and
  link measured under a real cursor changed **background-colour only**:
  `rgb(23,23,23) → rgb(18,18,18)` on dark, `rgb(246,244,239) → rgb(234,230,221)`
  on light, at `0.1s ease`. No transform, no translate, no scale on any of them.
  I inferred "magnetic" from the headless blueprint's parallax section and
  attached it to the wrong element. **Replaced by effect #13-R below.**

Also now `[measured]` rather than inferred: Display-P3 is the primary authoring
space (**44** distinct P3 computed values, including `outlineColor`), the focus
ring is `color(display-p3 .517647 .509804 .505882) solid 2px` at `1px` offset,
and the radius scale is `10 / 12 / 40 / 72px`.

**Effect #13-R — two-tier hover darkening.** `0.1s ease` on `background-color`
alone for buttons; `0.2s ease` for nav links. A ~5/255 darkening on dark
surfaces, ~12/255 on light. It is a smaller effect than the one it replaces, and
it is the one that is actually there.

### The confident-ai.com finding — a category the budget was missing

Added to the reference set at the owner's direction, measured the same day, and
it immediately overturned the budget written that morning.

The page runs **92 simultaneous infinite animations** across **133 SVG** nodes at
**7–8 s `linear`** periods — about **45×** the Class S cap of ≤2. It does not read
as busy. It reads as expensive. Every one of those animations sits inside a
schematic of the product's own behaviour: `traceRowPick`, `datasetRouteDraw`,
`scoreTick`, `promptNode`, `attackProbePillFire`.

So the count-based budget was measuring the wrong thing. It could not distinguish
a particle field from a diagram of a claims pipeline, and would have banned the
second in order to prevent the first. `05` gains **S6.1-R.a** (amendment
`2026-08-17/2`): layer counts govern **ambient** motion; **diegetic** motion is
budgeted by honesty under four conditions.

This matters beyond the budget. VipraTech's subject matter — a claim entering,
rules firing, an exception routing to a human, a gate closing, an audit line
being written — is unusually well suited to being drawn and animated honestly.
Effects #21–#22 let the page **demonstrate the product rather than describe it**,
which is also the strongest available answer to generic AI-marketing decoration:
a schematic of a real system cannot be generic, because the system is specific.

Three mechanisms make the count affordable, all `[measured]`: 7–8 s periods (too
slow to read as blinking), `linear` easing on every loop (no accent at start or
end), and hand-numbered staggered siblings (`bubbleAppear1…6`, `streamTurn1/3/5`)
so a sequence reads as a process with an order. The medium is SVG animated by CSS
`stroke`/`fill`, not 92 rAF loops — that is why it costs so little.

**Not claimed:** the page's 7 canvases were not characterised, and its one
authored curve `cubic-bezier(0.22, 1, 0.36, 1)` (×9 in CSS) was **not attributed
to an element**. That is the frequency-vs-applied trap this toolkit already hit
on linear.app, so it stays `[measured, unattributed]`.

**Standing caution.** The family.co page also carried **545** transformed elements and
**68** running animations, none of it in CSS keyframes — the census reported `0`
keyframes and `0` beziers. This is the same trap this toolkit hit on framer.com:
**an absence in a CSS census licenses only "not in CSS", never "no motion".**
family.co's parallax system is real and JS-driven; it has still not been measured
at the element level, so the lerp-parallax claim in the blueprint stays
`[inferred]` and must not be implemented from those numbers.

---

### Iteration 1 verification — three effects failed on contact · 2026-08-18

Wave C began, and the first act of implementing was to verify the sources. Three
of this document's own proposed effects did not survive.

- **#12 pointer spotlight — RETRACTED.** A 12-step real-cursor drag across
  `linear.app` and `linear.app/customers` changed **0 of 435** tracked custom
  properties. Linear has a *static* radial wash — `radial-gradient(circle,
  rgb(255 255 255 / .04) 0%, rgb(0 0 0 / 0) 50%)` `[measured]` — and nothing
  pointer-reactive. The effect was written from a headless blueprint, and
  **headless blueprints cannot see pointer reactivity at all.**
- **#16 count-up — RETRACTED.** `blueprints/stripe-com` marks its numbers
  `[inferred]` — "uniform *values* are not readable from source, only their
  names." There is no measured count-up to recreate.
- **#11 grain — re-scoped.** vercel.com's grain is a low-resolution **canvas**
  upscaled by the GPU's bilinear filter. Canvas is banned outside Class S. A
  CSS/SVG-turbulence version is a different technique and would be `[derived]`,
  not a recreation. Class S only, or not at all.

Also withdrawn *after* being implemented: the static wash itself, because
`.ground-field` already paints a radial gradient and two stacked washes gain
nothing; and `--dur-diagram`, correct in value but with no diagram yet to apply
to — a token with no referent is the slop rule this document enforces.

**Revised arithmetic:** 23 → **20 effects**, still **10 sites**, and categories
drop from 8 of 8 to **7 of 8** — category 6 (pointer-reactive) is now **empty**,
because its only two candidates were the magnetic CTA (retracted 2026-08-17) and
this spotlight. Any future pointer-reactive effect needs a source measured with a
real cursor first, not a census.

**Process note.** Both retracted effects came from headless blueprints, and both
would have shipped as confident recreations of things that are not there. The
`toolchain-selection` skill now exists for this reason. Verify sources at the
moment of implementing, never at the moment of planning.

---

### Iteration 2 — the first diegetic effect, and a category correction · 2026-08-18

**Shipped: effect #21.** `PipelinePanel` already rendered the real system —
ingestion, rule engine, ambiguity, audit log, in order, as static text. A marker
now traverses those four stages, so the panel *shows a claim moving through the
governed pipeline* rather than listing where it would go.

Recipe `[measured, confident-ai.com]`: 8000 ms, `linear`, staggered siblings.
Verified live at delays `0/2/4/6s`, one per stage, node floor `0.3` and row text
never below opacity `1`. Medium `[derived]` — confident-ai animates SVG nodes;
this animates the existing rows, because they *are* the schematic already.

It is deliberately not a return to the interval-rotation removed in Wave 2. That
rotated row *content*, reordering a fixed sequence — it conveyed nothing because
the order was the information. This traverses the order, in CSS, with no
interval and no re-render.

**Category correction.** §2.1's eight categories were drawn for *decorative*
effects, and diegetic motion does not fit them: it is not generative (no canvas
or shader), not pointer-reactive, not scroll-linked. Counting #21 under category
7 — as this document originally did — would have been category inflation.

**Category 7 (generative/canvas/shader) therefore remains empty**, and its only
candidates are still #19–#20, the Spline pair, which stay blocked on measuring
spline.design with a real cursor. Coverage is **7 of 8**, unchanged by this
iteration. The honest count of what shipped is one effect, in a kind the
category scheme does not name.

**Gates amended, twice, in the same direction.** Rubric C2 and the repo's own
motion test both asserted `infinite === 0`, which predates spec amendment
2026-08-17/2. Both now judge continuous motion by *kind*. Neither is a
relaxation: zero loops passes identically, reduced-motion still requires zero,
and any loop that does run must clear five conditions — period ≥ 5 s, `linear`,
opacity-only keyframes, `aria-hidden`, and no text content. A loop now has more
to satisfy than when looping was forbidden outright.

**Scorer fix, not a goalpost move.** A3 and E3 read `git log -8`, a window
chosen when the branch had six commits; the documented corrections had simply
scrolled out of it. Scope is now the branch against its base. The finding is
that a fixed commit window silently converts "documented" into "recent".

---

## 12. Open decisions

Ordered by what blocks the most work.

1. **Accept or decline the §3 motion amendment.** Blocks effects #14, #19, #20,
   the showcase tier and Wave G. Declining is a legitimate choice — the site
   sells defensibility to regulated buyers, and austerity is an argument. It
   caps the outcome at ~14 effects and 5 of 8 categories. Deciding late is the
   only bad option, because Wave C's vocabulary depends on it.
2. **Confirm gating over adaptation** (§5). Blocks Wave F.
3. **Clear the platform name** (F7). Blocks ~2,450 words of copy.
4. **MOM / Alimento naming permission.** Carried from `06`; the flagship case
   study loses most of its force without it.
5. **Grant `family.co` and `spline.design`** to the browser extension. Blocks
   effects #10, #13, #19, #20 from having measured values at all.
6. **`SPRINT_FEE_BAND`** stays `null`. Carried from `06`; a commercial decision,
   not a design one.
