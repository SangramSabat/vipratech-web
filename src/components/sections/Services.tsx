import {
  CheckCircle2,
  Cpu,
  FileSpreadsheet,
  Mic,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { CTA, SECTIONS, SERVICE_OFFERS } from "../../data/companyData";
import type { DiagnosticTriggerProps } from "../../types";
import { Button } from "../ui/Button";
import { Section } from "../ui/Section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";

const ICONS: Record<string, LucideIcon> = {
  "doc-reconciliation": FileSpreadsheet,
  "ai-security": ShieldCheck,
  "voice-ai": Mic,
  "sales-automation": TrendingUp,
  "product-research": Cpu,
};

/**
 * The five offers, on real tabs (spec S7.2).
 *
 * Previously `<button aria-pressed>` elements, which announce as toggle
 * buttons and offered no arrow-key navigation. Each panel is an <article>
 * per S2.4.
 */
export function Services({ onOpenDiagnostic }: DiagnosticTriggerProps) {
  return (
    <Section id="services" intro={SECTIONS.services}>
      <Tabs defaultValue={SERVICE_OFFERS[0].id}>
        <TabsList aria-label="Service offers" className="border-b border-hairline">
          {SERVICE_OFFERS.map((service) => {
            const Icon = ICONS[service.id] ?? Cpu;
            return (
              <TabsTrigger key={service.id} value={service.id}>
                <Icon className="size-4" aria-hidden="true" />
                {service.title}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {SERVICE_OFFERS.map((service) => (
          <TabsContent key={service.id} value={service.id}>
            <article className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
              <div className="rounded-2xl border border-hairline bg-surface/90 p-6 sm:p-8 lg:col-span-7">
                <p className="font-mono text-xs font-bold uppercase tracking-wider text-brand">
                  Primary offer: {service.primaryOfferName}
                </p>
                <h3 className="mt-2 text-h2 font-bold tracking-tight text-ink">
                  {service.title}
                </h3>

                <p className="mt-4 text-ink-muted">{service.description}</p>

                <h4 className="mt-8 font-mono text-xs font-bold uppercase tracking-wider text-ink-subtle">
                  Key scope components
                </h4>
                <ul className="mt-3 space-y-2.5">
                  {service.includedFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-ink-muted">
                      <CheckCircle2
                        className="mt-0.5 size-4 shrink-0 text-brand"
                        aria-hidden="true"
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 rounded-xl border border-hairline bg-ground/80 p-4">
                  <p className="font-mono text-xs font-bold uppercase tracking-wider text-ink-subtle">
                    Who this is for
                  </p>
                  <p className="mt-1.5 text-sm text-ink-muted">{service.targetAudience}</p>
                </div>

                <Button
                  size="lg"
                  className="mt-8 w-full"
                  onClick={() => onOpenDiagnostic(service.title)}
                >
                  <Sparkles className="size-4" aria-hidden="true" />
                  {CTA.primary}
                </Button>
              </div>

              <div className="rounded-2xl border border-hairline bg-surface/70 p-6 lg:col-span-5">
                <h4 className="border-b border-hairline pb-3 font-mono text-xs font-bold uppercase tracking-wider text-ink">
                  Sprint deliverables · 5–10 days
                </h4>

                <ol className="mt-4 space-y-3">
                  {service.sprintOutputs.map((output, index) => (
                    <li
                      key={output}
                      className="flex items-center gap-3 rounded-xl border border-hairline bg-ground/90 p-3.5 text-sm text-ink-muted"
                    >
                      <span className="grid size-7 shrink-0 place-items-center rounded-md border border-brand/20 bg-brand/10 font-mono text-xs font-bold text-brand tabular-nums">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{output}</span>
                    </li>
                  ))}
                </ol>

                <div className="mt-5 rounded-xl border border-brand-dim/25 bg-brand/5 p-4">
                  <p className="font-mono text-xs font-bold text-brand">Fee credit</p>
                  <p className="mt-1.5 text-sm text-ink-muted">
                    If an implementation project starts within 30 days of sprint completion, 50%
                    of the diagnostic fee is credited toward that build.
                  </p>
                </div>
              </div>
            </article>
          </TabsContent>
        ))}
      </Tabs>
    </Section>
  );
}
