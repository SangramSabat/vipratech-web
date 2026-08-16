# VipraTech Website — Design Documentation

These documents form a **traceable lifecycle**. Each inherits from the one above it and may not contradict it. Read and amend them in order.

| # | Document | Role |
|---|---|---|
| 01 | [Brand Guidelines](./01-brand-guidelines.md) | Root. Positioning, voice, jargon stop-list, measured colour contrast, type scale, motion budget. |
| 02 | [Personas](./02-personas.md) | Who we write for. Triggers, objections, proof required. Persona-adaptive content is deferred; seams only. |
| 03 | [Copywriting Matrix](./03-copywriting-matrix.md) | What every section says. Source of truth for user-facing copy. |
| 04 | [Wave Plan](./04-plan.md) | The Impeccable wave plan, findings, and reference-class analysis. |
| 05 | [UI/UX Spec](./05-ui-ux-spec.md) | 🔒 **LOCKED.** How it is built. Every implementation change cites a section here. |

## Working rules

1. **Cite the Spec.** Any change in Waves 3–5 references the `05-ui-ux-spec.md` section it satisfies. If the Spec doesn't cover it, flag it — don't invent.
2. **Amend, don't drift.** Spec changes get a dated entry in §13. Never a silent edit.
3. **Copy lives in `src/data/companyData.ts`**, and must match `03-copywriting-matrix.md`.
4. **Evidence before claims.** No fabricated logos, testimonials, metrics, or certifications — see `01-brand-guidelines.md` §6.

## Outstanding — needs input from VipraTech

The reference class (heizen.work, factory.ai, 8090.ai) places trust assets immediately after the hero. VipraTech currently has none, and they will not be invented. To populate those slots we need:

- Client names and written permission to cite them
- Named testimonials with role and company
- Real outcome metrics from delivered work
- Any formal certification actually held (none claimed today)

Until supplied, those sections stay unrendered.
