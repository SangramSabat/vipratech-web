# 03 — Copywriting Matrix

> **Inherits from:** `01-brand-guidelines.md` (voice, stop-list, approved vocabulary) and `02-personas.md` (default reader = union of P1–P4, biased to P1/P2).
>
> **Rule:** this file is the source of truth for *what each section says*. `05-ui-ux-spec.md` governs *how it is arranged*. Code may not introduce user-facing copy that does not appear here.

---

## 1. Copy source-of-truth consolidation

Copy is currently split between `src/data/companyData.ts` (structured, good) and hardcoded JSX strings in eight components. A copy matrix cannot be enforced against a split source. **All user-facing strings move into `src/data/companyData.ts`**, including: hero copy, proof metrics, section eyebrows/headings/subheads, live-log rows, FAQ entries, and CTA labels.

## 2. The hero

### Retired
> **Evidence-First / Applied-AI Product Engineering**
> "VipraTech Labs researches, prototypes, and builds production software for business-critical workflows where accuracy, evidence, human review, and operational reliability matter."

Fails the 5-second test — names a *category*, not a claim. The subhead is a list of abstract nouns with no mechanism and no named problem.

### Locked

**Eyebrow** (mono, lime):
> APPLIED AI FOR REGULATED OPERATIONS

**H1** — static, no typewriter, renders complete in prerendered HTML:
> ## AI for decisions you have to defend.

**Lead paragraph:**
> Most AI pilots stall in regulated operations because they can't show their work. VipraTech maps your workflow first, then builds systems where deterministic rules handle the known cases, AI handles only the ambiguous ones, and a human approves anything consequential — with evidence behind every decision.

*Structure: problem → mechanism, per reference pattern B (Heizen). The mechanism sentence is the actual architecture already described in `fitDiagnostic.ts`; it was previously buried in the diagnostic output instead of leading the page.*

**Primary CTA:** `Run the fit diagnostic` → opens the diagnostic modal
**Secondary CTA:** `Book a 30-min fit call` → direct mailto, no modal

*Both labels name what they actually do. The current footer button reads "Schedule 30-Min Fit Call" and opens the diagnostic modal — retired.*

### Hero proof strip

Retired — these are self-referential process claims, not outcomes:
> ~~100% Evidence Labeled · 5–10 Day De-Risk Sprints · Human Approval Gates~~

Locked — every figure traces to real data in `companyData.ts`:

| Value | Label | Source |
|---|---|---|
| **5–10 days** | Diagnostic sprint, fixed scope | `ENGAGEMENT_STEPS[1].duration` |
| **50%** | Of sprint fee credited to the build | `ENGAGEMENT_STEPS[1].description` |
| **3** | Systems running in production | `PRODUCTS_SYSTEMS` filtered to `Built/Deployed` |

## 3. Section-by-section matrix

Order follows `05-ui-ux-spec.md` §2.

| # | Section | Message | Proof it carries | CTA |
|---|---|---|---|---|
| 1 | **Hero** | AI for decisions you have to defend | The 3-figure strip above | Primary + secondary |
| 2 | **Engagement lifecycle** | The path in is bounded and cheap to start | Free call → 5–10 day sprint → milestone build; 50% fee credit | Primary |
| 3 | **Governed vs. generic** | Why plug-and-play AI fails here | Side-by-side of the two architectures | — |
| 4 | **Five offers** | What we actually do | Per-offer scope, audience, sprint deliverables | Per-offer → diagnostic |
| 5 | **Products & evidence levels** | What we have already built | 4 named systems with honest evidence tags | — |
| 6 | **Feasibility simulator** | See the governance model behave | Interactive pipeline | Primary |
| 7 | **Diagnostic calculator** | Size the problem in your own numbers | User-driven arithmetic | Primary |
| 8 | **Security & assurance** | We are built for people who get audited | Human gates, audit trail, red-teaming practice | — |
| 9 | **FAQ** | Handle the objections named in personas | Direct answers incl. when *not* to use AI | Secondary |
| 10 | **Final CTA** | One clear way forward | — | Primary + secondary |
| 11 | **Footer** | Contact, company, evidence policy | Real address, founder, direct email | Secondary |

## 4. New section copy

### §2 Engagement lifecycle — *moved up from above the footer*

**Eyebrow:** HOW ENGAGEMENTS WORK
**H2:** Start with a conversation, not a contract.
**Subhead:** Three stages, each with a defined exit. You can stop after any of them.

Step copy stays as in `ENGAGEMENT_STEPS` — it is already well-written and specific. One addition, in the brand's own voice:

> If we don't think we're the right fit, we say so on the first call.

### §3 Governed vs. generic — *new*

**Eyebrow:** WHY PILOTS STALL
**H2:** A model is not a system.
**Subhead:** The difference between an AI pilot that stalls in review and one that reaches production is almost never the model.

| Generic LLM wrapper | Governed pipeline |
|---|---|
| One model handles every case | Rules handle the deterministic cases; AI handles only the ambiguous residue |
| Confidence score as the only signal | Explicit exception states with defined handling |
| Human review bolted on afterwards, if at all | Human approval gate designed into the flow |
| Output is a prediction | Output is a decision with its evidence attached |
| "It's about 90% accurate" | You can point at why any single decision was made |

**Closing line:** Ninety percent accurate means someone still checks all of it.

### §8 Security & assurance — *new*

**Eyebrow:** BUILT FOR REVIEW
**H2:** Designed for the people who have to sign off.
**Subhead:** Every system we build assumes it will be audited, challenged, and asked to justify a specific decision made months ago.

Four points, all traceable to existing capability copy:
1. **Human approval gates** — consequential decisions route to a named reviewer before they take effect.
2. **Durable evidence trail** — every decision retains its inputs, rule path, and model reasoning.
3. **Adversarial testing** — we red-team our own agent systems; it is one of the five things we sell.
4. **Stated boundaries** — tool access and authorization limits are defined before an agent ships.

> **Honesty constraint:** this section makes **no** certification claims. VipraTech holds no SOC 2 or ISO 27001 certification to cite. Reference sites list theirs; we list practices we actually follow. Claiming otherwise would violate `01-brand-guidelines.md` §6.1.

### §10 Final CTA — *new*

**H2:** Find out whether this is worth your time.
**Body:** The diagnostic takes about two minutes and tells you what a sprint would cover — including if we think you don't need one.
**Primary:** `Run the fit diagnostic` · **Secondary:** `Book a 30-min fit call`

## 5. Diagnostic modal copy

The modal's framing must change alongside the scoring fix in Wave 5. It currently presents a hardcoded 92% as an analytical finding.

| Element | Retired | Locked |
|---|---|---|
| Title | "AI Fit Assessment Engine" | `Fit diagnostic` |
| Subtitle | "Evaluate Workflow Automation Feasibility" | `A two-minute structured self-assessment` |
| Result framing | "92% · Strong Fit" presented as analysis | Score presented explicitly as **a self-assessment based on your answers**, not a verified finding |
| Submit button | "Generate Evidence-Based Diagnostic" | `See my result` |
| Result CTA | "Request Free 30-Min Fit Call" | `Send this to VipraTech` |

**Required disclosure on the result screen:**
> This is a structured self-assessment based on what you entered — not a verified finding. Everything below is a starting point for the fit call, not a commitment.

*Rationale: the brand's stated policy is that every output carries its evidence level. A browser-side questionnaire is not `Built/Deployed` evidence, and labelling it as analysis is the exact failure mode the site criticises elsewhere.*

## 6. Live-log panel copy

Retained as a contained product artifact (per `01-brand-guidelines.md` §5), with the ticker and its slogans retired. Header becomes `PIPELINE — WORKED EXAMPLE` so it reads as an illustration rather than an implied live production feed, which would be an unbacked claim.

Rows keep their existing, accurate content: ingestion → deterministic validation → human approval gate → durable audit record.

## 7. Retired strings

| String | Location | Reason |
|---|---|---|
| "VIPRATECH LABS: KINETIC SIGNAL MATRIX" | hero badge | Stop-list |
| "TARGET_LOCK: ACTIVE" | cursor reticle | Stop-list; element retired |
| Entire `TICKER_ITEMS` marquee | top of page | Stop-list; slogans unbacked ("NO MOCK CLAIMS" is contradicted by the hardcoded diagnostic) |
| "VIPRATECH_LIVE_SIGNAL.LOG" / "LIVE STREAM" | log panel | Implies a live production feed that does not exist |
| "Explore 5 Offers" | hero secondary | Replaced by the fit-call CTA |
| "5 Core Applied-AI Offers" | services H2 | Counting the offers is not a benefit → "What we build" |
