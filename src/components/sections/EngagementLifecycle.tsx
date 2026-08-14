import { Sparkles } from "lucide-react";
import { CTA, ENGAGEMENT_STEPS, SECTIONS } from "../../data/companyData";
import type { DiagnosticTriggerProps } from "../../types";
import { Button } from "../ui/Button";
import { Section } from "../ui/Section";

/**
 * Moved from just above the footer to directly after the hero (spec S2.1).
 *
 * The bounded, cheap-to-start path in — free call, then a fixed-scope sprint —
 * is the strongest asset on the site and the same spine the reference class
 * leads with. It was previously the second-to-last thing a visitor saw.
 */
export function EngagementLifecycle({ onOpenDiagnostic }: DiagnosticTriggerProps) {
  return (
    <Section id="how" intro={SECTIONS.how}>
      <ol className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {ENGAGEMENT_STEPS.map((step) => (
          <li
            key={step.step}
            className="flex flex-col rounded-2xl border border-hairline bg-surface/70 p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-3xl font-extrabold text-brand">{step.step}</span>
              <span className="rounded-md bg-surface-raised px-2.5 py-1 font-mono text-xs text-ink-muted">
                {step.duration}
              </span>
            </div>

            <h3 className="mt-4 text-h3 font-bold text-ink">{step.title}</h3>
            <p className="mt-2 flex-1 text-sm text-ink-muted">{step.description}</p>

            <p className="mt-4 border-t border-hairline pt-4 font-mono text-xs font-semibold text-ink-subtle">
              {step.cost}
            </p>
          </li>
        ))}
      </ol>

      <div className="mt-8 flex justify-start">
        <Button size="lg" onClick={() => onOpenDiagnostic()}>
          <Sparkles className="size-4" aria-hidden="true" />
          {CTA.primary}
        </Button>
      </div>
    </Section>
  );
}
