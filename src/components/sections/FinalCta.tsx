import { ArrowRight, Sparkles } from "lucide-react";
import { COMPANY_INFO, CTA, SECTIONS } from "../../data/companyData";
import type { DiagnosticTriggerProps } from "../../types";
import { Button } from "../ui/Button";

/** Single clear exit from the page (spec S2.1 §10, S3.3). */
export function FinalCta({ onOpenDiagnostic }: DiagnosticTriggerProps) {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative overflow-hidden border-t border-hairline py-section"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_50%_120%,color-mix(in_oklab,var(--color-brand)_12%,transparent),transparent_70%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <p className="font-mono text-xs font-bold uppercase tracking-(--tracking-eyebrow) text-brand">
          {SECTIONS.contact.eyebrow}
        </p>
        <h2
          id="contact-heading"
          className="mt-3 text-h2 font-extrabold tracking-tight text-balance text-ink"
        >
          {SECTIONS.contact.heading}
        </h2>
        <p className="measure mx-auto mt-4 text-lead text-ink-muted">
          {SECTIONS.contact.subhead}
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
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
      </div>
    </section>
  );
}
