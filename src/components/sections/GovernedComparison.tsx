import { Check, X } from "lucide-react";
import { COMPARISON_CLOSING, COMPARISON_ROWS, SECTIONS } from "../../data/companyData";
import { Section } from "../ui/Section";

/**
 * Names the alternative we beat (docs/04-plan.md, reference pattern F).
 *
 * The argument already existed in the codebase — it was the architecture
 * paragraph buried inside the diagnostic result — but the page never staged it
 * where an evaluating buyer would encounter it.
 */
export function GovernedComparison() {
  return (
    <Section id="why" intro={SECTIONS.why}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-hairline bg-surface/40 p-6 sm:p-8">
          <h3 className="flex items-center gap-2.5 text-h3 font-bold text-ink-subtle">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-hairline-strong text-ink-subtle">
              <X className="size-4" aria-hidden="true" />
            </span>
            Generic LLM wrapper
          </h3>
          <ul className="mt-6 space-y-4">
            {COMPARISON_ROWS.map((row) => (
              <li key={row.generic} className="flex gap-3 text-sm text-ink-subtle">
                <X className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>{row.generic}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-brand-dim/40 bg-surface p-6 shadow-xl shadow-brand/5 sm:p-8">
          <h3 className="flex items-center gap-2.5 text-h3 font-bold text-ink">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-brand/40 bg-brand/10 text-brand">
              <Check className="size-4" aria-hidden="true" />
            </span>
            Governed pipeline
          </h3>
          <ul className="mt-6 space-y-4">
            {COMPARISON_ROWS.map((row) => (
              <li key={row.governed} className="flex gap-3 text-sm text-ink-muted">
                <Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
                <span>{row.governed}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-10 text-h3 font-semibold text-balance text-ink">{COMPARISON_CLOSING}</p>
    </Section>
  );
}
