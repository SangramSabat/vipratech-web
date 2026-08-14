# 02 — Personas

> **Inherits from:** `01-brand-guidelines.md`. Voice, vocabulary, and the evidence-before-claims constraint apply to every message written for these personas.
>
> **Status:** Persona-*adaptive content* is deferred to a separate discussion. This cycle ships a **single default experience** and builds only the structural seams (see §6). This document exists so that when personalization is designed, it has an upstream anchor.

---

## 1. Where these come from

Derived from the `targetAudience` fields already present in `src/data/companyData.ts` — not invented. Each of the five service offers names its buyer; four distinct personas emerge.

## 2. The default reader

Until personalization ships, the page is written for the **union** of these personas, biased toward P1 and P2 (the two with the sharpest pain and the shortest path to a paid sprint).

Shared characteristics across all four:
- Technically literate but **not** looking to be impressed by model names.
- Has already seen an AI pilot fail, or is afraid of authorizing one that will.
- Is personally exposed if the system is wrong — professionally, or in a regulated filing.
- Buys **de-risking** before they buy capability.

This is why the diagnostic sprint is the product, and why it belongs high on the page rather than above the footer.

---

## 3. P1 — Operations / Finance Lead *(document reconciliation)*

**Source:** "Finance, claims, and operations teams handling unaligned cross-system records."

| | |
|---|---|
| **Trigger** | A recurring reconciliation gap nobody can close: invoices, claims, or statements that don't match across systems, absorbed by a team doing manual spreadsheet mapping. |
| **What they actually fear** | Signing off on numbers a machine produced that they cannot defend in an audit. |
| **Primary objection** | "We tried an OCR/LLM tool. It was 80% right, which is worse than useless — now we check 100% of it anyway." |
| **Proof required** | Exception handling shown explicitly. What happens to the 20%? Who reviews it? Where is it logged? |
| **Winning message** | Rules handle what is deterministic. AI handles only the ambiguous residue. A human approves anything consequential. Every decision keeps its evidence. |
| **Disqualifier to state honestly** | If the matching logic is fully deterministic, they don't need AI, and we should say so. |

## 4. P2 — Security / Risk Engineering *(AI agent assurance)*

**Source:** "Engineering & risk teams preparing AI agents for production deployment."

| | |
|---|---|
| **Trigger** | An AI agent is about to ship with tool access, and someone has to sign off that it cannot be manipulated into misusing it. |
| **What they actually fear** | A prompt-injection or tool-authorization failure in production with their name on the approval. |
| **Primary objection** | "Generic red-teaming produces a PDF of scary-sounding findings we can't reproduce or prioritize." |
| **Proof required** | Reproducible evidence. Test plans, reproduction steps, a durable finding register — not a narrative report. |
| **Winning message** | Threat model first, authorized test plan second, reproducible evidence register third. Findings you can hand to an engineer and a regulator. |
| **Disqualifier to state honestly** | If the agent has no tool access and no sensitive data path, the assessment is disproportionate. |

## 5. P3 — Contact-Centre / Collections Ops *(voice AI)*

**Source:** "Collections teams, contact centers, and lenders managing high-volume calls."

| | |
|---|---|
| **Trigger** | Call volume exceeds headcount; offshore/vendor quality is inconsistent; regulator expects consistent conduct on every call. |
| **What they actually fear** | An automated call saying something non-compliant to a borrower, on the record. |
| **Primary objection** | "Voice demos always work in English on a clean line. Our calls are Hindi-Hinglish on bad connections with people interrupting." |
| **Proof required** | Code-switching handled, interruption/retry behaviour defined, policy guardrails enforced, clean operator handoff. |
| **Winning message** | The call flow's exception states are designed before the voice is. Guardrails and handoff are the product; the voice is the interface. |
| **Disqualifier to state honestly** | If conversations are genuinely open-ended and unscripted, latency and compliance risk may not be acceptable yet. |

## 6. P4 — Founder / CTO / Product Lead *(research & prototyping)*

**Source:** "Founders, CTOs, and product leaders evaluating complex AI ideas" and "Founders, growth leads, CROs, and agencies scaling B2B outbound."

| | |
|---|---|
| **Trigger** | A consequential build-vs-buy or provider-selection decision with no in-house basis for making it. |
| **What they actually fear** | Committing a quarter of engineering to an approach that turns out to be infeasible. |
| **Primary objection** | "A consultant will give me a slide deck. I need to know whether the thing actually works." |
| **Proof required** | A working prototype or a measured evaluation — evidence, not a recommendation. |
| **Winning message** | A bounded sprint that ends in a decision record backed by something that ran, plus the evaluation strategy to keep checking. |
| **Disqualifier to state honestly** | If the answer is already knowable from published benchmarks, we say so and skip the sprint. |

---

## 7. Persona seams (built this cycle, inert)

Structure only — no picker UI, no content variants, no behaviour change ships now:

- `src/data/personas.ts` mirrors this document as typed data (`id`, `label`, `serviceIds`, `trigger`, `objection`, `proofRequired`).
- `FitDiagnosticInput` carries an optional `persona?: PersonaId`, unused in scoring, threaded through to the email summary so lead context is preserved if it is ever set.
- Copy structures in `companyData.ts` are shaped so a `byPersona` variant field can be added later without changing any consumer.

**Open for the separate personalization discussion:** whether persona is self-declared (a picker), inferred from diagnostic answers, or driven by campaign URL. Not decided here.
