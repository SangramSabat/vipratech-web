import { useState } from "react";
import { ArrowDown, Sparkles } from "lucide-react";
import { CTA, SERVICE_OFFERS } from "../../data/companyData";
import type { DiagnosticTriggerProps, Tone } from "../../types";
import { Button } from "../ui/Button";
import { Slider } from "../ui/Slider";
import { SectionHeader } from "../ui/Section";

const WORKFLOWS = [
  { id: "invoices", serviceId: "doc-reconciliation", title: "Invoices & receipts" },
  { id: "security", serviceId: "ai-security", title: "Agent red-teaming" },
  { id: "voice", serviceId: "voice-ai", title: "Voice collections" },
  { id: "revenue", serviceId: "sales-automation", title: "Outbound & CRM" },
];

const TONE_TEXT: Record<Tone, string> = {
  verified: "text-verified",
  attention: "text-attention",
  info: "text-info",
};

/**
 * Illustrative routing model (was InteractiveFeasibilitySimulator).
 *
 * The previous version presented invented figures as system performance — a
 * "98.5%+ hallucination block rate" derived from a made-up formula, a "100%
 * REPRODUCIBLE" badge, "0.00ms latency" and "100% audit compliance". Those are
 * exactly the unbacked claims the brand exists to argue against
 * (docs/01-brand-guidelines.md §6.2), so they are gone.
 *
 * What remains is honest and still makes the point: how tightening the
 * deterministic boundary shifts volume between rules, model, and human review.
 * It is labelled as an illustration of the architecture, not a measurement.
 */
export function RoutingModel({ onOpenDiagnostic }: DiagnosticTriggerProps) {
  const [workflowId, setWorkflowId] = useState(WORKFLOWS[0].id);
  const [ruleCoverage, setRuleCoverage] = useState(70);
  const [modelAutonomy, setModelAutonomy] = useState(60);

  const workflow = WORKFLOWS.find((item) => item.id === workflowId) ?? WORKFLOWS[0];
  const diagnosticWorkflow =
    SERVICE_OFFERS.find((service) => service.id === workflow.serviceId)?.title ??
    SERVICE_OFFERS[0].title;

  // Simple, inspectable arithmetic — no invented precision.
  const byRules = Math.round(ruleCoverage * 0.85);
  const remainder = 100 - byRules;
  const byModel = Math.round((remainder * modelAutonomy) / 100);
  const byHuman = 100 - byRules - byModel;

  const tiers: { label: string; detail: string; share: number; tone: Tone }[] = [
    {
      label: "Settled by rules",
      detail: "Deterministic. Same input, same output, every time.",
      share: byRules,
      tone: "verified",
    },
    {
      label: "Resolved by model",
      detail: "Ambiguous cases, answered with the evidence attached.",
      share: byModel,
      tone: "info",
    },
    {
      label: "Escalated to a human",
      detail: "Anything consequential stops here before it takes effect.",
      share: byHuman,
      tone: "attention",
    },
  ];

  return (
    <section
      id="simulator"
      aria-labelledby="simulator-heading"
      className="border-t border-hairline py-section"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          headingId="simulator-heading"
          intro={{
            eyebrow: "The architecture",
            heading: "Where each decision actually goes.",
            subhead:
              "An illustration, not a measurement. Move the controls to see how widening the deterministic boundary changes what the model is asked to do and what reaches a person.",
          }}
        />

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <div className="rounded-2xl border border-hairline bg-surface/80 p-6 sm:p-8 lg:col-span-5">
            <fieldset>
              <legend className="font-mono text-xs font-bold uppercase tracking-wider text-ink-subtle">
                Workflow
              </legend>
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                {WORKFLOWS.map((item) => {
                  const selected = item.id === workflowId;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setWorkflowId(item.id)}
                      className={`min-h-11 cursor-pointer rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
                        selected
                          ? "border-brand/50 bg-surface-raised text-ink"
                          : "border-hairline bg-ground/80 text-ink-subtle hover:text-ink"
                      }`}
                    >
                      {item.title}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-8 space-y-6 border-t border-hairline pt-6">
              <LabelledSlider
                id="rule-coverage"
                label="How much is genuinely rule-based"
                value={ruleCoverage}
                min={20}
                max={95}
                onChange={setRuleCoverage}
                help="The share of cases with logic you could write down explicitly."
              />
              <LabelledSlider
                id="model-autonomy"
                label="How much of the rest the model may settle"
                value={modelAutonomy}
                min={0}
                max={90}
                onChange={setModelAutonomy}
                help="Lower this when the cost of a wrong answer is high."
              />
            </div>
          </div>

          <div className="rounded-2xl border border-hairline bg-surface/90 p-6 sm:p-8 lg:col-span-7">
            <p className="border-b border-hairline pb-3 font-mono text-xs font-bold uppercase tracking-wider text-ink">
              {workflow.title} — 100 incoming items
            </p>

            <ol className="mt-5 space-y-3">
              {tiers.map((tier, index) => (
                <li key={tier.label}>
                  {index > 0 && (
                    <div className="flex justify-center py-1" aria-hidden="true">
                      <ArrowDown className="size-4 text-ink-subtle" />
                    </div>
                  )}
                  <div className="rounded-xl border border-hairline bg-ground p-4">
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="font-semibold text-ink">{tier.label}</span>
                      <span
                        className={`font-mono text-lg font-extrabold tabular-nums ${TONE_TEXT[tier.tone]}`}
                      >
                        {tier.share}%
                      </span>
                    </div>
                    <div
                      className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-raised"
                      aria-hidden="true"
                    >
                      <div
                        className={`h-full rounded-full ${
                          tier.tone === "verified"
                            ? "bg-verified"
                            : tier.tone === "info"
                              ? "bg-info"
                              : "bg-attention"
                        }`}
                        style={{ width: `${tier.share}%` }}
                      />
                    </div>
                    <p className="mt-3 text-sm text-ink-subtle">{tier.detail}</p>
                  </div>
                </li>
              ))}
            </ol>

            <p className="mt-6 border-t border-hairline pt-4 text-sm text-ink-subtle">
              Whatever the split, every one of the 100 keeps its evidence. That is the part that
              survives an audit.
            </p>

            <Button
              size="lg"
              className="mt-6 w-full"
              onClick={() => onOpenDiagnostic(diagnosticWorkflow)}
            >
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
  value,
  min,
  max,
  onChange,
  help,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  help: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
        <span className="font-mono text-sm font-bold text-brand tabular-nums">{value}%</span>
      </div>
      <Slider
        id={id}
        aria-label={label}
        value={[value]}
        min={min}
        max={max}
        step={1}
        onValueChange={([next]) => onChange(next)}
        className="mt-1"
      />
      <p className="mt-1 text-sm text-ink-subtle">{help}</p>
    </div>
  );
}
