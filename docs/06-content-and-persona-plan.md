# 06 — Content & Persona-Adaptive Plan

> **Inherits from:** `01-brand-guidelines.md` → `02-personas.md` → `03-copywriting-matrix.md` → `04-plan.md` → `05-ui-ux-spec.md`.
>
> **Status:** Proposed. Supersedes `02-personas.md` §6 (seams only) and extends `03-copywriting-matrix.md` to the full site.
>
> Copy blocks in this document are **final, ship-ready text**. They are written to be read by a customer, not by a reviewer. Everything outside a copy block is build instruction.
>
> **⚠️ Amended by [`07-design-motion-and-gating-plan.md`](./07-design-motion-and-gating-plan.md).** `07` reviews this document and overrides it in five places. Where the two disagree, **`07` governs**:
>
> | This document | Overridden by `07` | Why |
> |---|---|---|
> | §4 — 70% new prose, by word count | §6 — four measured copy properties (P1–P4), gated per page | Word count rewards padding; the goal is impact |
> | §6 — client-side persona swap on the home hero | §5 — the gate is a route; nothing swaps after paint | A post-hydration hero swap mutates the LCP element PR #2's wave depends on |
> | §7 — 26 routes | §7 — 17 routes | Four product pages at ~95 words each are too thin to rank or to reward a reader |
> | §15 — re-base the app-JS budget upward | §8 — per-route budgets; Trust-class routes ship 0 kB | Re-basing an exceeded budget renames the failure |
> | §15 — Waves A–F, no design wave | §9 — Waves 0–H, design interleaved | Design applied last is decoration |
>
> `07` also supplies what this document has none of: motion vocabulary, art direction, and the effect programme. Read them together.

---

## 1. Reference architecture

Four sites define the category conventions this plan follows. Each contributes a distinct structural move.

| Reference | What it contributes |
|---|---|
| **[8090](https://8090.ai)** (8090.ai) | The platform-plus-service hybrid. 8090 sells **Software Factory** as a product and **8090 Enterprise** as a delivery arm built on it, stating outright: *"8090 Enterprise is the proof that Software Factory works. We don't just sell the tool, we use it to build production software."* This is the exact structure VipraTech needs. Also sets the bar for numeric proof: `$21M savings over four years`, `10K+ claims processed daily`, `50+ FTE labor saved`. |
| **[Heizen](https://heizen.work)** (heizen.work) | The sector-service model. Vertical case studies titled by transformation, each with a launch time and 3–4 quantified outcomes (`6-Week Launch`, `99% Data Accuracy`, `18.7 hrs Saved/Week`, `$37.5K Annual Savings`). Reusable "engines" adapted per client rather than bespoke builds. Primary CTA is **Book a Diagnostic** — the same conversion spine VipraTech already owns. |
| **[Factory](https://factory.ai)** (factory.ai) | Platform-tier language and restraint. *"The autonomy stack for enterprise teams."* Enterprise logo wall, minimal ornament, `Contact Sales` alongside a self-serve product entry. |
| **[Hyperagent](https://hyperagent.com)** (hyperagent.com) | Artifact-level proof. Shows the actual work product with its real time and cost attached, rather than describing capability in the abstract. |

## 2. Frameworks applied

**[Julian Shapiro — Startup Handbook, Landing Page Copywriting](https://www.julian.com/guide/startup/landing-pages)**

- Governing equation: **Purchase Rate = Desire − (Labor + Confusion)**. Every page reduces labor and confusion before it adds desire.
- **Value proposition method**: `Bad Alternative → Better Solution → Action Statement`. Applied per persona in §5.
- **Header rule**: fully descriptive of what is sold. Test — *if a visitor reads only this line, do they know what we do?*
- **Hook**: every hero carries either a **bold claim** or a **pre-empted objection**. Never a slogan.
- **Section order**: navbar → hero → social proof → CTA with incentive → features & objections (3–6) → repeat CTA → footer.
- **Objection budget**: 1–2 objections handled per feature block, not every possible concern.
- **CTA rule**: continues the hero narrative. Never "Sign Up", never "Learn More".

**[Donald Miller — Building a StoryBrand (SB7)](https://storybrand.com)**

Seven elements, applied per persona in §5: **Character** (the customer is the hero, never VipraTech) → **Problem** at three levels (external / internal / philosophical) → **Guide** (empathy + authority) → **Plan** (process plan + agreement plan) → **Call to Action** (direct + transitional) → **Failure** (stakes of inaction) → **Success** (picture of resolution).

Governing rule: **if you confuse, you lose.** The brand is the guide, never the hero.

---

## 3. Positioning — the hybrid

VipraTech is **an AI software factory that also builds the software**. Two arms, one engine:

| Arm | What it is | Reference analogue |
|---|---|---|
| **Foundry** — the platform | An agentic AI SDLC. Agents draft, specify, generate and test; engineers hold approval gates; every artifact carries provenance. | 8090 Software Factory · Factory autonomy stack |
| **Foundry Delivery** — the service | Production systems built on Foundry for named sectors, shipped by VipraTech's own team. | 8090 Enterprise · Heizen vertical builds |

**The load-bearing claim, borrowed structurally from 8090:** the service is the proof of the platform. VipraTech does not sell a tool it does not use — every system in `Products & systems` was built through Foundry.

> **Naming — provisional placeholder.** `Foundry` is used throughout so the copy is writable. It is **not cleared**: Palantir Foundry and Azure AI Foundry occupy adjacent enterprise-AI territory (`07` F7). `Manthan` was trialled on 2026-08-17 and reverted the same day. It stays one constant, so a later change is a find-and-replace rather than a rewrite.

**Master one-liner** (StoryBrand one-liner, used in the footer, meta description, and outbound):

> **COPY**
> Growing companies lose money in the gaps between their systems. VipraTech builds the AI software that closes them — production-grade in weeks, with an audit trail behind every decision.

---

## 4. Content inventory and the 70% target

Measured baseline: **1,045 words** of authored prose in `src/data/companyData.ts` across 269 strings. Rendered: home 2,299 words, service page 752 words (both include repeated navigation and section chrome).

| | Words | Share |
|---|---|---|
| Existing authored prose, retained or lightly edited | ~1,050 | 30% |
| **New authored prose** | **~2,450** | **70%** |
| **Final total** | **~3,500** | 100% |

New content is allocated as follows:

| Destination | New words | Source of substance |
|---|---|---|
| `/platform` — Foundry | ~450 | New — the platform arm |
| `/sectors/*` ×5 | ~700 | Seller context + service brief |
| `/work/mom-alimento` — flagship case study | ~400 | Case study doc |
| `/products/*` ×4 detail pages | ~380 | Existing product cards, expanded |
| Persona hero + problem variants ×5 | ~250 | New |
| Engagement models (Fractional AI Head, Project Build) | ~140 | Seller context |
| Expanded FAQ and objection copy | ~130 | New |

---

## 5. Persona system

Five personas. Each carries a Julian Shapiro value-prop table and a full SB7 pass. Persona 1 is the default when nothing is known about the visitor.

### 5.1 — Persona 1: Scaling consumer brand (default)

**Who:** Founder, COO, or Head of Sales Operations at a D2C, FMCG or retail brand past 60 distributors or 25,000 outlets.
**Trigger:** Distribution has outgrown the systems. Claims, trade spend and secondary sales are reconciled by hand.
**Detection:** default · `/sectors/consumer-brands` · UTM `persona=brand`

| Bad alternative | Better solution | Action statement |
|---|---|---|
| Three people triangulating claims across Tally, FieldAssist, WhatsApp and a shared sheet | A pipeline that reads the bills, applies the scheme logic, and routes only genuine exceptions to a human | **Settle distributor claims in minutes, not days** |

**SB7**

- **Character:** a founder who wants to grow distribution without growing the ops team underneath it.
- **Problem — external:** claims, schemes and trade spend are reconciled manually across four systems that do not agree.
- **Problem — internal:** every month closes late, and nobody can say with confidence how much margin leaked.
- **Problem — philosophical:** a brand should not have to choose between growing distribution and keeping control of its money.
- **Guide — empathy:** *"You hired for growth — sales, distribution, production. Tech got deferred. That was the right call at the time, and it is why the data is now in five places."*
- **Guide — authority:** the MOM/Alimento build — 100+ distributors, 120+ SKUs, 1 lakh+ outlets, live in two months.
- **Plan:** fit call → diagnostic sprint → first system live.
- **Direct CTA:** Book a diagnostic. **Transitional CTA:** Run the fit diagnostic.
- **Failure:** distributor count keeps climbing, headcount climbs with it, and the leak stays invisible.
- **Success:** claims settle in minutes, bad claims are flagged before payment, and distribution scales without the ops team scaling with it.

> **COPY — hero**
> **Your distributor claims are being settled by hand. That is where the margin goes.**
> We build the systems that read the bills, apply your scheme and margin logic, flag the duplicates and rate mismatches, and route only real exceptions to a person. Live in weeks — most recently across 100+ distributors and 1 lakh+ outlets.

### 5.2 — Persona 2: Finance and claims operations

**Who:** Finance Controller, Claims Operations Lead, Shared Services Head.
**Trigger:** A reconciliation gap absorbed by people, with no measurable error rate.
**Detection:** `/sectors/financial-operations` · `/services/doc-reconciliation` · UTM `persona=finance`

| Bad alternative | Better solution | Action statement |
|---|---|---|
| An OCR tool that is 80% right, so every line still gets checked | Deterministic rules settle what is rule-based; the model touches only genuine ambiguity; a reviewer sees the source documents side by side | **Close the month without re-checking every line** |

**SB7**

- **Character:** a controller who has to sign off on numbers assembled by hand.
- **Problem — external:** invoices, claims and receipts arrive in formats that do not reconcile automatically.
- **Problem — internal:** the sign-off is a judgement call, and the true error rate is unknown.
- **Problem — philosophical:** a number you have to defend should come with the evidence attached.
- **Guide — empathy:** *"The last tool got it roughly right, which meant your team still checked everything. It added a step instead of removing one."*
- **Guide — authority:** ~30% of claims auto-flagged as duplicates, margin overrides or rate mismatches on a live system.
- **Plan:** fit call → diagnostic sprint → pilot on last month's real data.
- **Direct CTA:** Book a diagnostic. **Transitional CTA:** Run the fit diagnostic.
- **Failure:** volume grows, the exception queue grows faster, and the month closes later every quarter.
- **Success:** every settled item carries its evidence, exceptions are a short queue, and close is predictable.

> **COPY — hero**
> **Every number you sign off should arrive with its evidence attached.**
> We build reconciliation systems where explicit rules settle the clear cases, AI handles only genuine ambiguity, and anything consequential stops at a reviewer — with the source documents on the same screen.

### 5.3 — Persona 3: Engineering and product leadership

**Who:** CTO, VP Engineering, Head of Product.
**Trigger:** A prototype that works on a laptop and cannot go to production; or an AI roadmap moving slower than the business needs.
**Detection:** `/platform` · `/sectors/ai-product-teams` · UTM `persona=engineering`

| Bad alternative | Better solution | Action statement |
|---|---|---|
| A vibe-coded prototype that breaks on malformed input, has no audit trail, and cannot be secured | The same idea rebuilt through a governed factory: specified, generated, tested, gated, and shipped with provenance | **Take the prototype to production without rewriting it twice** |

**SB7**

- **Character:** an engineering leader accountable for shipping AI that survives contact with production.
- **Problem — external:** prototypes stall at the production line — no edge-case handling, no audit trail, no guardrails.
- **Problem — internal:** the roadmap keeps slipping and the team is defending the delay rather than building.
- **Problem — philosophical:** shipping fast and shipping defensibly should not be opposites.
- **Guide — empathy:** *"The prototype was right about the idea. It was never built to survive malformed input, multi-party financial data, or an auditor."*
- **Guide — authority:** Foundry — the factory VipraTech uses on its own production builds.
- **Plan:** fit call → diagnostic sprint → first production increment.
- **Direct CTA:** Book a diagnostic. **Transitional CTA:** See how Foundry works.
- **Failure:** the POC quietly dies, and the next one starts from zero.
- **Success:** a production system, owned by the in-house team, with the factory available for the next one.

> **COPY — hero**
> **Your prototype proved the idea. It was never built to survive production.**
> Foundry is our AI software factory: agents draft and test, engineers hold the approval gates, and every artifact ships with its provenance. We use it on our own production builds — and on yours.

### 5.4 — Persona 4: Risk, security and AI assurance

**Who:** CISO, Head of Risk, AI Governance lead.
**Trigger:** An agent with tool access is about to ship and needs sign-off.
**Detection:** `/services/ai-security` · `/products/autosentinx` · UTM `persona=risk`

| Bad alternative | Better solution | Action statement |
|---|---|---|
| A narrative red-team report full of findings nobody can reproduce, rank, or retest | Multi-turn adversarial campaigns that produce a durable evidence register with reproduction steps | **Sign off on the agent with evidence, not judgement** |

**SB7**

- **Character:** the person whose name goes on the approval.
- **Problem — external:** the agent has real tool access and the authorization boundaries are undefined.
- **Problem — internal:** sign-off today is instinct with a report stapled to it.
- **Problem — philosophical:** nobody should have to underwrite a system they cannot test.
- **Guide — empathy:** *"Generic red-teaming gave you findings you could not reproduce after a fix. That is not evidence, it is an opinion with formatting."*
- **Guide — authority:** AutoSentinx — multi-turn adversarial campaigns with a durable evidence register.
- **Plan:** fit call → security assessment → prioritised remediation.
- **Direct CTA:** Book a diagnostic. **Transitional CTA:** See AutoSentinx.
- **Failure:** the agent ships on instinct, and the first incident is the first real test.
- **Success:** a reproducible evidence register, ranked findings, and a retest path after every fix.

> **COPY — hero**
> **You are being asked to sign off on an agent you cannot reproduce a test against.**
> We run multi-turn adversarial campaigns against tool-use and authorization boundaries, and hand back a durable evidence register — findings ranked, reproduction steps attached, retestable after every fix.

### 5.5 — Persona 5: Customer operations at scale

**Who:** Head of Contact Centre, Collections Lead, Customer Operations Director.
**Trigger:** Call volume past headcount, with conduct requirements on every call.
**Detection:** `/services/voice-ai` · `/products/aarav` · UTM `persona=custops`

| Bad alternative | Better solution | Action statement |
|---|---|---|
| A voice demo recorded in clean English that collapses on a real Hinglish call over a bad line | Call flows designed around exception states first — code-switching, interruption, policy guardrails, clean operator handoff | **Handle the volume without varying the conduct** |

**SB7**

- **Character:** an operations head answerable for both coverage and conduct.
- **Problem — external:** volume exceeds headcount and every call still has to stay inside policy.
- **Problem — internal:** either calls go unmade or conduct varies by whoever picks up.
- **Problem — philosophical:** scale should not cost consistency.
- **Guide — empathy:** *"Every voice demo works. Yours are Hindi-Hinglish, interrupted, and on bad lines."*
- **Guide — authority:** the Aarav voice system — regulated Hindi/Hinglish telephony with guardrails and operator handoff.
- **Plan:** fit call → feasibility sprint measured on real line conditions → rollout.
- **Direct CTA:** Book a diagnostic. **Transitional CTA:** Run the fit diagnostic.
- **Failure:** coverage gaps become compliance exposure.
- **Success:** consistent conduct on every call, with humans on the calls that need them.

> **COPY — hero**
> **Your call volume outgrew your headcount. Your conduct requirements did not move.**
> We design the exception states before the voice layer: Hinglish code-switching, interruption and retry handling, policy guardrails, and a clean handoff to an operator the moment a call needs one.

---

## 6. Adaptation mechanics

**Principle: adapt on evidence, never on inference.** A persona is applied only from an explicit signal — route, UTM parameter, or a self-selection the visitor made. No fingerprinting, no guessing from firmographics, no behavioural inference. If no signal exists, Persona 1 ships.

**Resolution order** (first match wins):

1. Explicit self-selection, stored in `localStorage` under `vt.persona`
2. Route — `/sectors/<id>` and `/for/<persona>` imply a persona
3. `?persona=` UTM parameter
4. Referrer host on a known-partner allowlist
5. **Default — Persona 1**

**What varies by persona**

| Element | Varies | Notes |
|---|---|---|
| Hero header + subheader | Yes | Per §5 copy blocks |
| Problem framing block | Yes | External/internal problem, persona-worded |
| First proof shown | Yes | MOM case for 1–2, Foundry for 3, AutoSentinx for 4, Aarav for 5 |
| Service ordering | Yes | Matching practice floats to first position |
| FAQ ordering | Yes | Persona's top objection first |
| Transitional CTA label | Yes | Direct CTA never varies |
| **Pricing, commitments, exits** | **No** | Identical for everyone |
| **Evidence labels** (Built/Prototyped/Researched) | **No** | Never softened per audience |
| **"We will tell you if you don't need us"** | **No** | Load-bearing; identical everywhere |

**Self-selection control.** A single row under the hero, present on the home page only:

> **COPY**
> Show me what matters for — Consumer brands · Finance & claims · Engineering teams · Risk & security · Customer operations

**Prerender contract.** Every persona variant must exist in prerendered HTML. Persona pages `/for/<persona>/` are prerendered documents with their own metadata; the home page prerenders Persona 1 and swaps client-side after hydration. Swapping must not shift layout — variants are length-budgeted to ±15% of Persona 1.

---

## 7. Site map

```
/                                  Home (Persona 1 default, adaptive)
/platform/                         Foundry — the AI software factory
/for/<persona>/            ×5      Persona landing pages
/sectors/<sector>/         ×5      Consumer brands · Financial ops · Customer contact
                                     · AI product teams · AI risk & assurance
/services/<service>/       ×5      Existing five practices (retained)
/products/<product>/       ×4      AutoSentinx · MarketingEngine · Aarav · Latticly
/work/mom-alimento/                Flagship case study
/engage/                           Engagement models + commercial terms
```

From 6 prerendered documents to **26**. Each carries its own title, description, canonical, OG tags and JSON-LD, and is added to the generated sitemap.

---

## 8. Page copy — Home

Section order follows Julian Shapiro's recommended sequence.

### 8.1 Hero

> **COPY**
> `EYEBROW` The AI software factory
> **`H1` We build the systems your operations are running by hand.**
> Reconciliation, claims, distribution, regulated customer contact. Agents draft and test, our engineers hold the approval gates, and what ships is production software with the evidence behind every decision. First working system in weeks.
> `PRIMARY` Run the fit diagnostic · `SECONDARY` Book a 30-min fit call
> `PROOF STRIP` 100+ distributors live · 1 lakh+ outlets · 2 months to production · ~30% of bad claims caught before payment

### 8.2 Social proof — immediately after hero

> **COPY**
> **Built and running in production.**
> A distributor claims platform settling against 100+ distributors, 120+ SKUs and over 1 lakh retail outlets. An adversarial testing system with a durable evidence register. A regulated Hindi-Hinglish voice stack with operator handoff. Each one shipped, not described.

*Build note: client logo wall and named testimonials remain blocked pending permission. This block carries the load until they are available.*

### 8.3 The two arms

> **COPY**
> **One factory. Two ways to use it.**
>
> **Foundry — the platform**
> Our agentic build system. Specifications become tested, reviewable increments with provenance on every artifact. Your team drives it; ours keeps the gates honest.
> `Explore Foundry →`
>
> **Foundry Delivery — built for you**
> We take the whole build. Your team gets a production system, the source, and the operating knowledge to run it.
> `See how we engage →`
>
> Everything we have shipped was built through Foundry. We do not sell a factory we do not run.

### 8.4 Plan — the three stages

Retains the existing `#how` section unchanged. Already implemented, already carries commitment and exit per stage.

### 8.5 Failure and success (StoryBrand stakes)

> **COPY**
> **What it costs to leave this alone.**
> Distribution grows and the ops team grows with it. The exception queue outruns the people working it. Margin leaks in places nobody has time to reconcile. The next AI pilot stalls in the same place the last one did.
>
> **What changes when it works.**
> Claims settle in minutes. Bad ones are caught before payment. Every decision carries the evidence behind it. Distribution scales without headcount scaling underneath it. And the next system takes weeks, because the factory is already standing.

### 8.6 Sectors

> **COPY**
> **Where we work.**
> Consumer brands & distribution · Finance & claims operations · Regulated customer contact · AI product & platform teams · AI risk & assurance

### 8.7 Remaining sections

`Why pilots stall` (retain) → `Five practices` (retain, persona-ordered) → `Products & systems` (retain, now linking to detail pages) → `Routing model` (retain) → `Effort calculator` (retain) → `Assurance` (retain) → `Commercial terms` (retain) → `FAQ` (retain, persona-ordered, expanded) → `Final CTA` (retain).

---

## 9. Page copy — `/platform/` (Foundry)

> **COPY**
> `EYEBROW` Foundry
> **`H1` The factory we build your software in.**
> Foundry is an agentic software development system. Requirements become specifications, specifications become tested increments, and every artifact carries the record of how it got there. Agents do the volume. Engineers hold the gates.
>
> **How a build moves through it**
> **01 · Specify** — Workflows, exception states and decision rules are captured as an executable specification, not a document.
> **02 · Generate** — Agents produce implementation and tests against that specification, in reviewable increments.
> **03 · Gate** — An engineer approves every increment. Nothing merges on model confidence alone.
> **04 · Evidence** — Each artifact ships with its specification, its tests, and the record of who approved it.
>
> **What you get either way**
> Source code and infrastructure are yours from the first increment. No runtime lock-in, no proprietary format holding your logic.
>
> **Where Foundry does not help**
> If the logic is fully deterministic and stable, a rule engine is cheaper and easier to audit. We will say so on the first call.
>
> `PRIMARY` Run the fit diagnostic · `SECONDARY` Book a 30-min fit call

---

## 10. Page copy — `/work/mom-alimento/`

> **COPY**
> `EYEBROW` Case study · Consumer brands
> **`H1` Settling distributor claims across 1 lakh outlets.**
> **Client** MOM (Makhana-O-Meter) / Alimento Agro Foods · **Scope** DCP Reconciliation Portal, Phase 1 · **Delivered** 2 months
>
> **The situation**
> Distributors claim margin benefits passed on to retailers. Verifying those claims meant reading handwritten and printed bills, then triangulating them against claim sheets, mapping files and email threads. Benefit caps, SKU variations, rate changes and special approvals all had to be held in someone's head. Large claims took days.
>
> **What we built**
> A three-stage pipeline behind a role-based portal.
> **Stage 1 — Vision.** Handwritten and printed bills are read and structured.
> **Stage 2 — Normalisation.** SKUs are normalised, benefit caps assigned, claims matched to bills, and data-quality problems flagged.
> **Stage 3 — Decision.** Margin-cap, approval and scheme logic runs, producing a settlement decision with its evidence attached.
> The portal carries finance operations from processing through approval and settlement to raising the credit note.
>
> **Scale**
> 100+ distributors · 120+ SKUs · 1 lakh+ retail outlets · extensible to adjacent processes
>
> **Outcome**
> Around 30% of claims are auto-flagged as duplicates, margin overrides or rate mismatches — the cases that previously required manual triangulation. Target: 3× faster settlement, large claims from days to hours, regular claims from hours to minutes, and distributor growth decoupled from headcount.
>
> **Status** Handover complete. Finance is processing live claims on the system.

---

## 11. Page copy — Sectors

Each `/sectors/<id>/` page carries: hero (persona header + subheader from §5), what breaks, what we build, the relevant case study, the practices that apply, and the standard CTA pair.

### 11.1 `/sectors/consumer-brands/`

> **COPY**
> **`H1` Distribution grew. The systems did not.**
> Tally, FieldAssist, WhatsApp, a shared sheet, and what the team remembers. Every new distributor makes the gaps wider.
>
> **What we build here**
> Distributor management automation · Trade spend reconciliation · Retailer scheme management · Secondary sales visibility · Fraud and duplicate detection · Demand sensing · Territory and outlet analytics · FieldAssist, Tally and ERP integration
>
> **The signal you are ready**
> Past 60 distributors or 25,000 outlets, claims reconciliation is almost always still manual. If that is you, the first system pays for itself in the leaks it closes.

### 11.2 `/sectors/financial-operations/`

> **COPY**
> **`H1` Reconciliation that arrives with its evidence.**
> **What we build here**
> Document intelligence and extraction · Deterministic matching rules · Exception dashboards for reviewers · Audit-ready traceability · Settlement and credit-note workflow · Data architecture and observability

### 11.3 `/sectors/customer-contact/`

> **COPY**
> **`H1` Consistent conduct at volume.**
> **What we build here**
> Hindi/Hinglish voice systems · WhatsApp and call contact-centre AI · Policy guardrail enforcement · Interruption, retry and escalation logic · Operator handoff · Collections workflow

### 11.4 `/sectors/ai-product-teams/`

> **COPY**
> **`H1` From prototype to production, once.**
> **What we build here**
> POC to production hardening · Agentic workflow automation · Standalone agents, services and APIs · Evaluation harnesses · Data architecture and observability · AI SDLC enablement on Foundry

### 11.5 `/sectors/ai-risk/`

> **COPY**
> **`H1` Evidence your auditor can retest.**
> **What we build here**
> Agent threat modelling · Multi-turn adversarial campaigns · Tool-use and authorization boundary testing · LLM security and guardrails · Evidence registers · Remediation and verification roadmaps

---

## 12. Page copy — `/engage/`

> **COPY**
> `EYEBROW` Engagement models
> **`H1` Three ways to work with us.**
>
> **Fractional AI Head** · Retainer
> Strategy and oversight. We research your processes, design the solution, steer the build, review the work and unblock the team. Your engineers co-build and own production. Works best when you already have five or more experienced developers and want to move the AI roadmap faster. Timeline and rate vary with scope.
>
> **Project-based build** · From $3,500 · 3–5 weeks
> Our team delivers standalone agents, services or APIs, and you integrate them into your existing workflows. Start narrow, validate, widen as confidence builds.
>
> **Diagnostic sprint to production** · Fixed fee, then milestone-based
> The full path: free fit call, a bounded 5–10 day diagnostic sprint, then production implementation. Half the sprint fee is credited against implementation if you start within 30 days.
>
> **What every model shares**
> The code and infrastructure are yours. Scope is agreed in writing before work starts. You can stop after any stage and keep everything produced up to that point.

---

## 13. Products — detail pages

Four pages at `/products/<id>/`, each: what it is, what it does, evidence level (unchanged), where it fits, and a link to the practice that deploys it.

| Product | Page angle |
|---|---|
| **AutoSentinx** — Built/Deployed | Multi-turn adversarial campaigns; the evidence register as the deliverable. |
| **MarketingEngine** — Built/Deployed | Multi-tenant revenue workflow with a human approval gate before dispatch. |
| **Aarav Voice System** — Built/Deployed | Regulated Hindi/Hinglish telephony, guardrails, operator handoff. |
| **Latticly** — Researched/Designed | AI-BDR architecture and research. Labelled honestly; not presented as shipped. |

---

## 14. Expanded FAQ

New entries, persona-ordered at render:

> **COPY**
> **Do we have to use Foundry to work with you?**
> No. Most clients never touch it — they buy a finished system. Foundry is how we build; it becomes something you use directly only if you want your own team building on it.
>
> **We already have an engineering team. What do you actually add?**
> Speed on the AI-specific parts, and the parts teams usually discover late: exception design, evaluation harnesses, approval gates, audit trails, and the security work an agent with tool access needs before it ships.
>
> **How fast is the first working system?**
> A project-based build runs 3–5 weeks. A full diagnostic-to-production path depends on scope, and the sprint exists to tell you what that scope actually is before you commit.
>
> **What happens to the code if we stop?**
> It is yours, from the first increment. Source, infrastructure and specifications, in your repositories throughout.

---

## 15. Implementation waves

| Wave | Scope | Depends on |
|---|---|---|
| **A** | Data layer: persona, sector, case-study, product and engagement-model types and content in `companyData.ts`; `PERSONAS` promoted from seam to live | — |
| **B** | Routing: extend `src/routes.ts` and `scripts/prerender.mjs` from 6 to 26 documents; per-route metadata and JSON-LD | A |
| **C** | `/platform/`, `/work/mom-alimento/`, `/engage/`; home restructure (§8) | A, B |
| **D** | `/sectors/*` ×5, `/products/*` ×4 | A, B |
| **E** | Persona resolution, self-selection control, adaptive hero/problem/proof/ordering | A–D |
| **F** | Naming confirmation for Foundry; final copy pass; verification | E |

Bundle impact: app JS is at 42.6 kB against a 45 kB budget. Wave B's route table and Wave E's persona logic will exceed it. **The budget is to be re-based on measurement in Wave B, with an amendment entry** — not silently raised, and not gamed by moving code between chunks.

---

## 16. Verification

Extends `05-ui-ux-spec.md` §11.

| Check | Method |
|---|---|
| Every one of the 26 routes prerenders real content | `e2e/service-routes.spec.ts`, extended |
| Every persona variant exists in prerendered HTML | New spec — assert each variant's H1 with JavaScript disabled |
| Persona swap causes no layout shift | CLS measured across a forced swap |
| Pricing, commitments and evidence labels are identical across all personas | New spec — diff those nodes across variants, assert equality |
| No persona is inferred without an explicit signal | Unit test on the resolver: empty input resolves to Persona 1 |
| New content ≥ 70% of total authored prose | Word-count script over `companyData.ts`, compared against the tagged baseline |
| Claims in copy trace to a source document | Manual review against the case study and seller context |

**Content integrity rules that survive this plan unchanged:** no client name, logo, testimonial or metric appears without written permission; evidence levels are never softened per audience; the diagnostic keeps telling visitors when they do not need a sprint.
