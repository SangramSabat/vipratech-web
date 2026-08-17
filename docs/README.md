# VipraTech Website — Design Documentation

These documents form a **traceable lifecycle**. Each inherits from the one above it and may not contradict it. Read and amend them in order.

| # | Document | Role |
|---|---|---|
| 01 | [Brand Guidelines](./01-brand-guidelines.md) | Root. Positioning, voice, jargon stop-list, measured colour contrast, type scale, motion budget. |
| 02 | [Personas](./02-personas.md) | Who we write for. Triggers, objections, proof required. Persona-adaptive content is deferred; seams only. |
| 03 | [Copywriting Matrix](./03-copywriting-matrix.md) | What every section says. Source of truth for user-facing copy. |
| 04 | [Wave Plan](./04-plan.md) | The Impeccable wave plan, findings, and reference-class analysis. |
| 05 | [UI/UX Spec](./05-ui-ux-spec.md) | 🔒 **LOCKED.** How it is built. Every implementation change cites a section here. |
| 06 | [Content & Persona-Adaptive Plan](./06-content-and-persona-plan.md) | Proposed. Platform-plus-service positioning, five personas with ship-ready copy, site map. Supersedes 02 §6. Amended by 07. |
| 07 | [Design, Motion & Gating Plan](./07-design-motion-and-gating-plan.md) | Proposed. Reviews 06 and supplies its missing half: the 20-effect programme, page-class motion budgets, per-persona art direction, route-based gating, per-route JS budgets. **Governs where it disagrees with 06.** |

## Working rules

1. **Cite the Spec.** Any change in Waves 3–5 references the `05-ui-ux-spec.md` section it satisfies. If the Spec doesn't cover it, flag it — don't invent.
2. **Amend, don't drift.** Spec changes get a dated entry in §13. Never a silent edit.
3. **Copy lives in `src/data/companyData.ts`**, and must match `03-copywriting-matrix.md`.
4. **Evidence before claims.** No fabricated logos, testimonials, metrics, or certifications — see `01-brand-guidelines.md` §6.

## Outstanding — needs input from VipraTech

The reference class (heizen.work, factory.ai, 8090.ai) places trust assets immediately after the hero. To populate those slots we need:

- **Written permission to name MOM / Alimento Agro Foods.** `06` builds a flagship case study around this work. Until permission is confirmed it ships unattributed — "a scaling FMCG brand" — which costs most of its force.
- Named testimonials with role and company
- Any further outcome metrics from delivered work
- Any formal certification actually held (none claimed today)
- **A name for the platform.** `06` uses `Foundry` throughout so the copy is writable. Confirm or replace — and note `07` F7: Palantir Foundry and Azure AI Foundry both occupy adjacent enterprise-AI territory, so this needs a real clearance search before the copy is written around it.
- **Acceptance or refusal of `07` §3**, the page-class motion amendment to `05` §S6. Blocks the showcase tier. Declining is a legitimate choice and caps the result at roughly 14 effects rather than 20.
- **Browser-extension access to `family.co` and `spline.design`**, so those two blueprints can be verified with a real cursor. Four planned effects have no measured values until this is granted.
- **A fee band for the diagnostic sprint**, if it is to be published. `SPRINT_FEE_BAND` is `null` and the commercial terms section reads correctly either way.

Until supplied, those sections stay unrendered or unattributed. Nothing here is invented to fill a slot.
