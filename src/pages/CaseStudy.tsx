import { ArrowRight } from "lucide-react";
import { CASE_STUDY, COMPANY_INFO, CTA } from "../data/companyData";
import { NextStep } from "../components/NextStep";
import { Button } from "../components/ui/Button";
import { Section } from "../components/ui/Section";
import { SplitText } from "../components/ui/SplitText";

/**
 * `/work/<slug>/` — the flagship case study, shipped unattributed.
 *
 * Class T. Someone reading a case study is deciding whether to believe the
 * rest of the site, and that page does not get spectacle. The one exception is
 * the three-stage pipeline, which is diegetic under S6.1-R.a: it is the system
 * this page is about, and the markers traverse it in its real order.
 *
 * The anonymity is stated rather than hidden. A case study that quietly omits
 * its client reads as evasive; one that says "named once written permission is
 * confirmed" is doing the same thing the evidence labels do elsewhere — telling
 * you exactly how far the claim goes.
 */
export function CaseStudy({
  onOpenDiagnostic,
}: {
  onOpenDiagnostic: (workflow?: string) => void;
}) {
  return (
    <>
      <section id="top" aria-labelledby="case-heading" className="relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4 pb-section pt-16 sm:px-6 lg:px-8 lg:pt-24">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-brand">
            {CASE_STUDY.eyebrow}
          </p>
          <h1
            id="case-heading"
            className="mt-5 max-w-4xl text-display font-bold leading-[1.02] tracking-display text-ink"
          >
            <SplitText text={CASE_STUDY.headline} />
          </h1>

          <dl className="mt-8 grid gap-4 border-y border-hairline py-5 sm:grid-cols-3">
            {[
              ["Client", CASE_STUDY.client],
              ["Scope", CASE_STUDY.scope],
              ["Delivered", CASE_STUDY.delivered],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="font-mono text-xs font-bold uppercase tracking-wider text-ink-subtle">
                  {label}
                </dt>
                <dd className="mt-1.5 text-sm text-ink">{value}</dd>
              </div>
            ))}
          </dl>

          <p data-reader-problem className="measure mt-8 text-lead text-ink-muted">
            {CASE_STUDY.situation}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" onClick={() => onOpenDiagnostic("doc-reconciliation")}>
              {CTA.primary}
            </Button>
            <Button
              as="a"
              size="lg"
              variant="secondary"
              href={`mailto:${COMPANY_INFO.email}?subject=${encodeURIComponent(
                "30-minute fit call — distributor claims reconciliation",
              )}`}
            >
              {CTA.secondary}
              <ArrowRight className="size-4 text-brand" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </section>

      <Section
        id="built"
        intro={{
          eyebrow: "What we built",
          heading: "A three-stage pipeline behind a role-based portal",
          subhead: CASE_STUDY.portal,
        }}
      >
        {/* Diegetic (S6.1-R.a): these are the three stages of the system the
            page is about, traversed in their real order. 12s, linear, staggered
            — the confident-ai.com recipe, same as /platform. */}
        <ol className="relative space-y-3">
          <span
            className="flow-spine pointer-events-none absolute bottom-5 left-[1.35rem] top-5 w-px"
            aria-hidden="true"
          />
          {CASE_STUDY.stages.map((stage, index) => (
            <li
              key={stage.id}
              className="lift relative rounded-2xl border border-hairline bg-surface/60 p-5 pl-12"
            >
              <span
                className="flow-node flow-node-slow absolute left-[1.1rem] top-7 size-2 -translate-y-1/2 rounded-full bg-brand"
                style={{ "--i": index } as React.CSSProperties}
                aria-hidden="true"
              />
              <p className="font-mono text-xs font-bold uppercase tracking-wider text-ink-subtle">
                Stage {index + 1} · {stage.stage}
              </p>
              <p className="mt-2 text-ink">{stage.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        id="scale"
        intro={{
          eyebrow: "Scale",
          heading: "What it runs against",
          subhead: "Figures from the delivery record, published without the client's name.",
        }}
      >
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CASE_STUDY.scale.map((item) => (
            <li
              key={item}
              className="rounded-xl border border-hairline bg-surface/60 p-5 font-mono text-sm text-ink"
            >
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="outcome"
        intro={{
          eyebrow: "Outcome",
          heading: "What changed, and what is still a target",
          subhead:
            "The measured result and the intended one are labelled separately, because only one of them has happened.",
        }}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border-l-2 border-verified/50 border-y border-r border-hairline bg-surface/40 p-6">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-verified">
              Measured
            </h3>
            <p className="mt-2.5 text-lead text-ink">{CASE_STUDY.outcome}</p>
          </div>
          <div className="rounded-2xl border-l-2 border-info/50 border-y border-r border-hairline bg-surface/40 p-6">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-info">
              Target, not yet measured
            </h3>
            <p className="mt-2.5 text-lead text-ink">{CASE_STUDY.target}</p>
          </div>
        </div>

        <p className="measure mt-6 font-mono text-sm text-ink-subtle">{CASE_STUDY.status}</p>

        <div className="mt-6">
          <NextStep />
        </div>
      </Section>
    </>
  );
}
