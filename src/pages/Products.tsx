import { ArrowRight } from "lucide-react";
import {
  EVIDENCE_LEVELS_EXPLANATION,
  PRODUCTS_SYSTEMS,
  SERVICE_OFFERS,
} from "../data/companyData";
import { SECTORS } from "../data/sectors";
import { NextStep } from "../components/NextStep";
import { Section } from "../components/ui/Section";
import { SplitText } from "../components/ui/SplitText";
import { servicePath } from "../routes";

/**
 * `/products/` — the evidence ladder, and where each system sits on it.
 *
 * This page was declined twice before building, on the grounds that PRODUCTS
 * carries no fields the home section does not already render, so the page would
 * be a thin duplicate. That was right about the data and wrong about the
 * subject.
 *
 * The home section shows the systems. It does not explain the labels under
 * them. "Built/Deployed", "Prototyped" and "Researched/Designed" are the site's
 * most load-bearing convention — they are the reason a visitor can believe any
 * of the other pages — and what each one commits to is stated nowhere a reader
 * can reach.
 *
 * So the page is about the ladder, with the systems placed on it, plus the one
 * relation that existed nowhere on the site: which practice each system came
 * out of and which sector it serves. That is navigation the site was missing,
 * not a second copy of the cards.
 */
export function Products() {
  return (
    <>
      <section id="top" aria-labelledby="products-heading" className="relative overflow-hidden">
        <div className="ground-field pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 pb-section pt-16 sm:px-6 lg:px-8 lg:pt-24">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-brand">
            Evidence
          </p>
          <h1
            id="products-heading"
            className="mt-5 max-w-4xl text-display font-bold leading-[1.02] tracking-display text-ink"
          >
            <SplitText text="Every claim on this site carries a label saying how far it got." />
          </h1>
          <p data-reader-problem className="measure mt-6 text-lead text-ink-muted">
            Three labels, used everywhere and never softened. A system that was researched is
            not described as built, on any page, to any audience. This is what each label
            commits to, and which systems currently hold it.
          </p>
        </div>
      </section>

      <Section
        id="ladder"
        intro={{
          eyebrow: "The ladder",
          heading: "What each label commits to",
          subhead:
            "The distinction is the point. A vendor with only one label is telling you nothing by using it.",
        }}
      >
        <ol className="grid gap-4 md:grid-cols-3">
          {EVIDENCE_LEVELS_EXPLANATION.map((level, index) => (
            <li
              key={level.level}
              className="lift flex flex-col rounded-2xl border border-hairline bg-surface/60 p-6"
            >
              <span className="font-mono text-xs font-bold text-ink-subtle tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 font-mono text-h3 font-bold text-ink">{level.level}</h3>
              <p className="mt-3 flex-1 text-sm text-ink-muted">{level.desc}</p>
              <p className="mt-4 border-t border-hairline pt-3 font-mono text-xs text-ink-subtle">
                {PRODUCTS_SYSTEMS.filter((product) => product.evidenceLevel === level.level).length}{" "}
                of {PRODUCTS_SYSTEMS.length} systems
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        id="systems"
        intro={{
          eyebrow: "The systems",
          heading: "Where each one sits, and what it came out of",
          subhead:
            "The practice and sector links are our reading of which capability each system demonstrates, not a recorded fact.",
        }}
      >
        <ul className="space-y-4">
          {PRODUCTS_SYSTEMS.map((product) => {
            const offer = SERVICE_OFFERS.find((candidate) => candidate.id === product.serviceId);
            const sector = SECTORS.find((candidate) => candidate.slug === product.sectorSlug);
            return (
              <li
                key={product.id}
                className="lift rounded-2xl border border-hairline bg-surface/60 p-6"
              >
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                  <h3 className="font-mono text-h3 font-bold text-ink">{product.name}</h3>
                  <span className="font-mono text-xs font-bold text-ink-subtle">
                    {product.evidenceLevel}
                  </span>
                </div>
                <p className="measure mt-3 text-ink-muted">{product.shortDesc}</p>

                <ul className="mt-4 grid gap-2 sm:grid-cols-3">
                  {product.capabilities.map((capability) => (
                    <li key={capability} className="text-sm text-ink-subtle">
                      <span className="text-brand" aria-hidden="true">
                        •
                      </span>{" "}
                      {capability}
                    </li>
                  ))}
                </ul>

                <p className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-hairline pt-4 text-sm">
                  {offer ? (
                    <a
                      href={servicePath(offer.id)}
                      className="inline-flex min-h-11 items-center font-semibold text-brand underline-offset-4 hover:underline"
                    >
                      {offer.title}
                      <ArrowRight className="ml-1.5 inline size-4" aria-hidden="true" />
                    </a>
                  ) : null}
                  {sector ? (
                    <a
                      href={`/sectors/${sector.slug}/`}
                      className="inline-flex min-h-11 items-center font-semibold text-brand underline-offset-4 hover:underline"
                    >
                      {sector.label}
                      <ArrowRight className="ml-1.5 inline size-4" aria-hidden="true" />
                    </a>
                  ) : null}
                </p>
              </li>
            );
          })}
        </ul>

        <div className="mt-6">
          <NextStep />
        </div>
      </Section>
    </>
  );
}
