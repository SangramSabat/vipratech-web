import { ArrowRight, Check, Sliders } from "lucide-react";
import {
  COMPANY_INFO,
  CTA,
  ENGAGEMENT_STEPS,
  FEE_DRIVERS,
  SECTIONS,
  SPRINT_FEE_BAND,
} from "../../data/companyData";
import type { DiagnosticTriggerProps } from "../../types";
import { Button } from "../ui/Button";
import { Section } from "../ui/Section";

/**
 * Commercial terms (spec S12.1–S12.2).
 *
 * The reference class does not publish services pricing either, so a number is
 * not what was missing. What was missing is any way for a buyer to reason about
 * the number before the call: the old page said "Paid — quoted per scope" and
 * stopped there, which reads as evasive rather than normal.
 *
 * This section publishes everything that is actually knowable — the basis, what
 * drives the figure, what each stage commits you to, and how you leave — and
 * says plainly where the number comes from. `SPRINT_FEE_BAND` is null until a
 * real band is supplied; inventing one would be the exact unevidenced claim
 * this site argues against.
 */
export function CommercialTerms({ onOpenDiagnostic }: DiagnosticTriggerProps) {
  return (
    <Section id="terms" intro={SECTIONS.terms}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Stage-by-stage commitment and exit */}
        <ul className="grid gap-4 lg:col-span-7">
          {ENGAGEMENT_STEPS.map((step) => (
            <li
              key={step.step}
              className={
                step.featured
                  ? "rounded-2xl border border-brand/35 bg-brand/[0.06] p-5"
                  : "rounded-2xl border border-hairline bg-surface/70 p-5"
              }
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-h3 font-bold text-ink">
                  <span className="font-mono text-ink-subtle">{step.step}</span> {step.title}
                </h3>
                <p
                  className={`font-mono text-xs font-bold ${
                    step.featured ? "text-brand" : "text-ink-subtle"
                  }`}
                >
                  {step.cost}
                </p>
              </div>

              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <dt className="font-mono text-xs font-bold uppercase tracking-wider text-ink-subtle">
                    You commit to
                  </dt>
                  <dd className="mt-1 text-sm text-ink-muted">{step.commitment}</dd>
                </div>
                <div>
                  <dt className="font-mono text-xs font-bold uppercase tracking-wider text-ink-subtle">
                    If you stop here
                  </dt>
                  <dd className="mt-1 text-sm text-ink-muted">{step.exit}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>

        {/* What moves the number */}
        <div className="lg:col-span-5">
          <div className="h-full rounded-2xl border border-hairline bg-surface p-6">
            <h3 className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-brand">
              <Sliders className="size-4" aria-hidden="true" />
              What moves the sprint fee
            </h3>

            <p className="mt-4 text-sm text-ink-muted">
              {SPRINT_FEE_BAND
                ? `Most diagnostic sprints land in the ${SPRINT_FEE_BAND} range. Where you fall inside it depends on four things:`
                : "The sprint is a fixed fee quoted after the fit call, never hourly and never open-ended. Four things decide where it lands:"}
            </p>

            <ul className="mt-4 space-y-3.5">
              {FEE_DRIVERS.map((driver) => (
                <li key={driver.factor} className="flex gap-3">
                  <Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
                  <span>
                    <span className="block text-sm font-semibold text-ink">{driver.factor}</span>
                    <span className="mt-0.5 block text-sm text-ink-subtle">{driver.detail}</span>
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-5 border-t border-hairline pt-4 text-sm text-ink-muted">
              Half the sprint fee is credited against implementation if you start within 30 days —
              so de-risking first costs less than committing straight to a build.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Button onClick={() => onOpenDiagnostic()}>{CTA.primary}</Button>
              <Button
                as="a"
                variant="secondary"
                href={`mailto:${COMPANY_INFO.email}?subject=${encodeURIComponent(
                  "Diagnostic sprint — scope and fee",
                )}`}
              >
                Ask for a quote
                <ArrowRight className="size-4 text-brand" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
