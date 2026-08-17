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

### F7 — `Foundry` is a heavily occupied name · **major, decide before Wave A**

`06` uses `Foundry` throughout as the platform name and flags naming as an open
decision. The specific risk is not flagged: **Palantir Foundry** and **Azure AI
Foundry** are both established products in adjacent enterprise-AI territory,
and Foundry is also a long-standing VFX software brand. For an AI platform sold
to enterprise buyers this is a collision on the two axes that matter — buyer
recall and search visibility.

Not a legal conclusion, and this document does not make one. It is a flag that
the name needs a real clearance search before ~2,450 words are written around
it. `06` correctly isolates it as one constant; that keeps the cost of changing
it low, so **write the copy, but treat the name as provisional until cleared.**

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
| 10 | Inset-ring elevation (light from above, not a drop shadow) | family.co ✱ | 5 | all | Every card; replaces flat borders sitewide |
| 11 | Layered surface grain at low alpha | vercel.com | 5 | N, S | Large empty ground on `/platform`, `/sectors/*` |
| 12 | Pointer spotlight on card grids | linear.app | 6 | N, S | Sector and product grids — 5+ card choices |
| 13 | Magnetic primary CTA | family.co ✱ | 6 | N | The one primary per section |
| 14 | Scroll-scrubbed sequence, pinned | apple.com | 4 | S | Foundry's three-stage pipeline on `/platform` |
| 15 | Shared-element transition across documents | — ⚠️ derived | 8 | all | Sector card → sector page; card becomes hero |
| 16 | Numeric count-up on the proof strip | stripe.com | 3 | N | The four proof numbers, once, on entry |
| 17 | Knockout / masked type over media | resend.com | 5 | S | `/work/mom-alimento` hero |
| 18 | Sticky section index with scroll-linked marker | stripe.com | 4 | N | Long sector and case-study pages |
| 19 | ⛔ Ambient shader field, hero only | spline.design | 7 | S | `/platform` hero — the factory, as a live surface |
| 20 | ⛔ Transmission/glass panel over the field | spline.design | 5 | S | The Foundry stage card sitting on #19 |

✱ **family.co is Chrome-blocked** — see `APPLIED-TO-vipratech-web.md`. Its
blueprint is headless-only, and PR #2 rejected all three of its effects for
exactly this reason. **#10 and #13 require the domain to be granted and the
blueprint re-verified with a real cursor first.** They are listed as intent, not
as approved values. Do not implement from the headless numbers.

⚠️ **#15 has no measured source.** Cross-document shared-element transitions
were not captured in any blueprint. It is `[inferred]` from the `@view-transition`
support already in `index.css`. Either measure it on a reference that does it,
or ship it as an explicitly-marked original rather than a recreation.

### The arithmetic

9 retained + 11 new = **20 effects**, **9 sites**
(codesandbox, linear, stripe, apple, liveblocks, raycast, vercel, resend,
spline — plus family.co conditionally), and **7 of 8 categories**. Only
category 8 stays partial, pending #15's provenance.

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
| **G** | ⛔ Showcase tier: #19, #20 on `/platform`. Ships only if Wave 0 accepted §3. | D, §3 |
| **H** | Copy pass against P1–P4; full verification; rubric re-score. | all |

**Wave G is severable.** Waves 0–F deliver 18 effects, 7 categories, 17 routes
and the gate without it. G is the difference between an excellent product site
and a studio piece, and it is the wave to cut first if scope has to give.

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

## 11. Open decisions

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
