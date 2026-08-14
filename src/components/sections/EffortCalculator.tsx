import { useState } from "react";
import { Sparkles } from "lucide-react";
import { CTA } from "../../data/companyData";
import type { DiagnosticTriggerProps } from "../../types";
import { Button } from "../ui/Button";
import { Slider } from "../ui/Slider";
import { SectionHeader } from "../ui/Section";

/**
 * Manual-effort estimator (was DeRiskingCalculator).
 *
 * The arithmetic was always the visitor's own, but the framing overclaimed:
 * gross hours saved were labelled "Estimated 12-Month Net Return" while
 * ignoring the cost of the build entirely, and the result was captioned
 * "Proven in 5–10 business days" when nothing here is proven. A finance buyer
 * notices a missing cost side immediately, so the honest version is also the
 * more persuasive one (docs/01-brand-guidelines.md §2).
 */
export function EffortCalculator({ onOpenDiagnostic }: DiagnosticTriggerProps) {
  const [monthlyVolume, setMonthlyVolume] = useState(2500);
  const [minutesPerItem, setMinutesPerItem] = useState(12);
  const [automatedShare, setAutomatedShare] = useState(70);

  const hoursPerMonth = Math.round((monthlyVolume * minutesPerItem) / 60);
  const hoursReclaimed = Math.round((hoursPerMonth * automatedShare) / 100);
  const hoursRemaining = hoursPerMonth - hoursReclaimed;

  return (
    <section
      id="calculator"
      aria-labelledby="calculator-heading"
      className="border-t border-hairline py-section"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          headingId="calculator-heading"
          intro={{
            eyebrow: "Size the problem",
            heading: "How much time is this costing you now?",
            subhead:
              "Your numbers, plain arithmetic. This estimates manual review effort only — it deliberately excludes build cost, licensing, and the review time that remains, because those are exactly what the diagnostic sprint exists to establish.",
          }}
        />

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <div className="rounded-2xl border border-hairline bg-surface/80 p-6 sm:p-8 lg:col-span-6">
            <h3 className="border-b border-hairline pb-3 font-mono text-xs font-bold uppercase tracking-wider text-ink">
              Your inputs
            </h3>

            <div className="mt-6 space-y-6">
              <LabelledSlider
                id="volume"
                label="Items handled per month"
                display={monthlyVolume.toLocaleString()}
                value={monthlyVolume}
                min={200}
                max={25000}
                step={100}
                onChange={setMonthlyVolume}
              />
              <LabelledSlider
                id="minutes"
                label="Minutes of manual handling per item"
                display={`${minutesPerItem} min`}
                value={minutesPerItem}
                min={2}
                max={45}
                step={1}
                onChange={setMinutesPerItem}
              />
              <LabelledSlider
                id="automated"
                label="Share you believe could be automated"
                display={`${automatedShare}%`}
                value={automatedShare}
                min={20}
                max={95}
                step={1}
                onChange={setAutomatedShare}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-brand-dim/40 bg-surface p-6 shadow-xl shadow-brand/5 sm:p-8 lg:col-span-6">
            <h3 className="border-b border-hairline pb-3 font-mono text-xs font-bold uppercase tracking-wider text-brand">
              Manual effort, per month
            </h3>

            <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-hairline bg-ground p-4">
                <dt className="text-sm text-ink-subtle">Spent today</dt>
                <dd className="mt-1 font-mono text-3xl font-extrabold text-ink tabular-nums">
                  {hoursPerMonth.toLocaleString()}
                  <span className="ml-1 text-lg">hrs</span>
                </dd>
              </div>
              <div className="rounded-xl border border-hairline bg-ground p-4">
                <dt className="text-sm text-ink-subtle">Potentially reclaimed</dt>
                <dd className="mt-1 font-mono text-3xl font-extrabold text-brand tabular-nums">
                  {hoursReclaimed.toLocaleString()}
                  <span className="ml-1 text-lg">hrs</span>
                </dd>
              </div>
            </dl>

            <div className="mt-4 rounded-xl border border-hairline bg-ground/60 p-4">
              <p className="text-sm text-ink-muted">
                Roughly{" "}
                <span className="font-mono font-bold text-attention tabular-nums">
                  {hoursRemaining.toLocaleString()} hrs
                </span>{" "}
                of review would remain each month. Exception handling does not go to zero, and any
                proposal telling you it does is worth distrusting.
              </p>
            </div>

            <p className="mt-4 text-sm text-ink-subtle">
              Converting hours into money needs your blended rate and the build cost. That is a
              conversation, not a slider.
            </p>

            <Button size="lg" className="mt-6 w-full" onClick={() => onOpenDiagnostic()}>
              <Sparkles className="size-4" aria-hidden="true" />
              {CTA.primary}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function LabelledSlider({
  id,
  label,
  display,
  value,
  min,
  max,
  step,
  onChange,
}: {
  id: string;
  label: string;
  display: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <span id={`${id}-label`} className="text-sm font-medium text-ink">
          {label}
        </span>
        <span className="font-mono text-sm font-bold text-brand tabular-nums">{display}</span>
      </div>
      <Slider
        id={id}
        label={label}
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([next]) => onChange(next)}
        className="mt-1"
      />
    </div>
  );
}
