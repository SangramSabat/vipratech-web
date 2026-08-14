import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { COMPANY_INFO, CTA, SECTIONS, SERVICE_OFFERS } from "../data/companyData";
import type { DiagnosticTriggerProps, ServiceOffer } from "../types";
import { servicePath } from "../routes";
import { Button } from "../components/ui/Button";
import { Section } from "../components/ui/Section";
import { EngagementLifecycle } from "../components/sections/EngagementLifecycle";
import { Assurance } from "../components/sections/Assurance";
import { FinalCta } from "../components/sections/FinalCta";

/**
 * A ranking surface for one offer.
 *
 * The five offers previously lived behind client-side tabs on a single URL, so
 * a search for "AI agent red-teaming" had nothing specific to land on. Each now
 * gets its own prerendered document with its own title, description, canonical
 * and JSON-LD.
 */
export function ServiceDetail({
  service,
  onOpenDiagnostic,
}: { service: ServiceOffer } & DiagnosticTriggerProps) {
  const others = SERVICE_OFFERS.filter((other) => other.id !== service.id);

  return (
    <>
      <section id="top" aria-labelledby="service-heading" className="relative overflow-hidden">
        <div className="ground-field pointer-events-none absolute inset-0" aria-hidden="true" />

        <div className="relative mx-auto max-w-7xl px-4 pb-section pt-12 sm:px-6 lg:px-8 lg:pt-16">
          <a
            href="/"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-ink-subtle transition-colors hover:text-brand"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            All practices
          </a>

          <div className="mt-6 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-brand">
                {service.primaryOfferName}
              </p>
              <h1
                id="service-heading"
                className="mt-4 text-display font-extrabold leading-[1.06] tracking-tight text-balance text-ink"
              >
                {service.title}
              </h1>
              <p className="measure mt-6 text-lead text-ink-muted">{service.description}</p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Button size="lg" onClick={() => onOpenDiagnostic(service.title)}>
                  <Sparkles className="size-4" aria-hidden="true" />
                  {CTA.primary}
                </Button>
                <Button
                  as="a"
                  size="lg"
                  variant="secondary"
                  href={`mailto:${COMPANY_INFO.email}?subject=${encodeURIComponent(
                    `30-minute fit call — ${service.title}`,
                  )}`}
                >
                  {CTA.secondary}
                  <ArrowRight className="size-4 text-brand" aria-hidden="true" />
                </Button>
              </div>

              <div className="mt-10 rounded-2xl border border-hairline bg-surface/70 p-5">
                <p className="font-mono text-xs font-bold uppercase tracking-wider text-ink-subtle">
                  Who this is for
                </p>
                <p className="mt-2 text-ink-muted">{service.targetAudience}</p>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-hairline bg-surface/95 p-6 shadow-2xl">
                <h2 className="border-b border-hairline pb-3 font-mono text-xs font-bold uppercase tracking-wider text-ink">
                  Sprint deliverables · 5–10 days
                </h2>
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
                    If an implementation project starts within 30 days of sprint completion, 50% of
                    the diagnostic fee is credited toward that build.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section
        id="scope"
        intro={{
          eyebrow: "Scope",
          heading: "What the work covers.",
          subhead: `Everything below is in scope for ${service.primaryOfferName}. Anything outside it gets said out loud before the sprint starts, not after.`,
        }}
      >
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {service.includedFeatures.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-3 rounded-2xl border border-hairline bg-surface/70 p-5"
            >
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden="true" />
              <span className="text-ink-muted">{feature}</span>
            </li>
          ))}
        </ul>
      </Section>

      <EngagementLifecycle onOpenDiagnostic={onOpenDiagnostic} />
      <Assurance />

      <Section
        id="other-practices"
        intro={{
          eyebrow: "Other practices",
          heading: "Not quite what you need?",
          subhead: SECTIONS.services.subhead,
        }}
      >
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {others.map((other) => (
            <li key={other.id}>
              <a
                href={servicePath(other.id)}
                className="flex h-full flex-col rounded-2xl border border-hairline bg-surface/70 p-6 transition-colors hover:border-brand/40"
              >
                <h3 className="text-h3 font-bold text-ink">{other.title}</h3>
                <p className="mt-2 flex-1 text-sm text-ink-muted">{other.description}</p>
                <span className="mt-4 inline-flex items-center gap-2 font-mono text-xs font-bold text-brand">
                  Read the scope
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <FinalCta onOpenDiagnostic={onOpenDiagnostic} />
    </>
  );
}
