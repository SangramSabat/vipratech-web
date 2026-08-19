import { ArrowRight, Sparkles } from "lucide-react";
import { COMPANY_INFO, CTA, HERO, PROOF_METRICS } from "../data/companyData";
import type { DiagnosticTriggerProps } from "../types";
import { Button } from "./ui/Button";
import { PipelinePanel } from "./PipelinePanel";
import { SplitText } from "./ui/SplitText";

/**
 * Above-the-fold composition (spec S2.1 §1, S3.3, S9.4).
 *
 * The <h1> is present and complete in the prerendered HTML. It was once typed
 * character-by-character on the client, which delayed the LCP element by
 * roughly 1.2s and left the headline absent from crawlable markup.
 *
 * SplitText keeps that fix intact: every character is server-rendered and the
 * reveal is pure CSS `animation-delay`, so there is no client-side typing, no
 * JavaScript on the critical path, and the accessible name is unchanged.
 */
export function Hero({ onOpenDiagnostic }: DiagnosticTriggerProps) {
  return (
    <section id="top" aria-labelledby="hero-heading" className="relative overflow-hidden">
      {/* Static ground treatment; replaces the animated matrix wash (S6.2) */}
      <div className="ground-field pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 pb-section pt-16 sm:px-6 lg:px-8 lg:pt-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="font-mono text-xs font-bold uppercase tracking-(--tracking-eyebrow) text-brand">
              {HERO.eyebrow}
            </p>

            <h1
              id="hero-heading"
              className="mt-5 text-display font-extrabold leading-[1.02] tracking-display text-balance text-ink"
            >
              <SplitText text={HERO.headline} />
            </h1>

            <p data-reader-problem className="measure mt-6 text-lead text-ink-muted">
              {HERO.lead}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Button size="lg" onClick={() => onOpenDiagnostic()}>
                <Sparkles className="size-4" aria-hidden="true" />
                {CTA.primary}
              </Button>
              <Button
                as="a"
                size="lg"
                variant="secondary"
                href={`mailto:${COMPANY_INFO.email}?subject=${encodeURIComponent("30-minute fit call")}`}
              >
                {CTA.secondary}
                <ArrowRight className="size-4 text-brand" aria-hidden="true" />
              </Button>
            </div>

            <dl className="mt-12 grid max-w-xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline sm:grid-cols-3">
              {PROOF_METRICS.map((metric) => (
                <div key={metric.label} className="bg-ground p-5">
                  <dt className="sr-only">{metric.label}</dt>
                  <dd>
                    <span className="block font-mono text-2xl font-extrabold text-brand">
                      {metric.value}
                    </span>
                    <span className="mt-1.5 block text-sm text-ink-subtle">{metric.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-5">
            <PipelinePanel />
          </div>
        </div>
      </div>
    </section>
  );
}
