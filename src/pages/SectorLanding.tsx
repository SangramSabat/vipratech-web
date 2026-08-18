import { ArrowRight, Check } from "lucide-react";
import { COMPANY_INFO, CTA, SERVICE_OFFERS } from "../data/companyData";
import { PERSONAS } from "../data/personas";
import type { Sector } from "../data/sectors";
import { Button } from "../components/ui/Button";
import { NextStep } from "../components/NextStep";
import { Section } from "../components/ui/Section";
import { SplitText } from "../components/ui/SplitText";
import { servicePath } from "../routes";

/**
 * `/sectors/<slug>/` — the SEO surface (docs/07 §7).
 *
 * Sector and persona pages are a pair, and the difference between them is the
 * point rather than an accident: **the persona page argues, the sector page
 * enumerates.** A visitor arriving from a search for their own industry wants
 * to see whether their problem is on the list; a visitor arriving through the
 * gate has already said the problem is theirs and wants to know we understand
 * it. Same subject, opposite jobs, so neither is a copy of the other.
 *
 * Each sector links to its persona page rather than restating the argument.
 */
export function SectorLanding({
  sector,
  onOpenDiagnostic,
}: {
  sector: Sector;
  onOpenDiagnostic: (workflow?: string) => void;
}) {
  const persona = PERSONAS.find((candidate) => candidate.id === sector.personaId);
  const offers = SERVICE_OFFERS.filter((offer) => persona?.serviceIds.includes(offer.id));

  return (
    <>
      <section id="top" aria-labelledby="sector-heading" className="relative overflow-hidden">
        <div className="ground-field pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 pb-section pt-16 sm:px-6 lg:px-8 lg:pt-24">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-brand">
            {sector.label}
          </p>
          <h1
            id="sector-heading"
            className="mt-5 max-w-4xl text-display font-bold leading-[1.02] tracking-display text-ink"
          >
            <SplitText text={sector.headline} />
          </h1>
          <p data-reader-problem className="measure mt-6 text-lead text-ink-muted">
            {sector.lead}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" onClick={() => onOpenDiagnostic(offers[0]?.id)}>
              {CTA.primary}
            </Button>
            <Button
              as="a"
              size="lg"
              variant="secondary"
              href={`mailto:${COMPANY_INFO.email}?subject=${encodeURIComponent(
                `30-minute fit call — ${sector.label}`,
              )}`}
            >
              {CTA.secondary}
              <ArrowRight className="size-4 text-brand" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </section>

      <Section
        id="builds"
        intro={{
          eyebrow: "What we build here",
          heading: `Systems we have built for ${sector.label.toLowerCase()}`,
          subhead:
            "Every line is covered by a practice on this site. Nothing is listed to make the column look full.",
        }}
      >
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sector.builds.map((build) => (
            <li
              key={build}
              className="flex items-start gap-2.5 rounded-xl border border-hairline bg-surface/60 p-4"
            >
              <Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
              <span className="text-sm text-ink">{build}</span>
            </li>
          ))}
        </ul>
      </Section>

      {sector.signal ? (
        <Section
          id="signal"
          intro={{
            eyebrow: "The signal you are ready",
            heading: "When this stops being a nice-to-have",
            subhead: "A threshold, not a pitch — below it, the manual process is usually cheaper.",
          }}
        >
          <p className="measure text-lead text-ink-muted">{sector.signal}</p>
        </Section>
      ) : null}

      {/* Links to the persona page rather than restating its argument. The two
          pages share a subject and split the job: this one enumerates, that one
          reasons. */}
      {persona ? (
        <Section
          id="next"
          intro={{
            eyebrow: "Where to start",
            heading: offers.length > 1 ? "The practices that apply" : "The practice that applies",
            subhead: "Every engagement opens with a bounded diagnostic sprint before any build.",
          }}
        >
          <ul className="grid gap-4 md:grid-cols-2">
            {offers.map((offer) => (
              <li key={offer.id} className="lift rounded-2xl border border-hairline bg-surface/60 p-6">
                <h3 className="text-h3 font-bold text-ink">{offer.title}</h3>
                <p className="mt-3 text-ink-muted">{offer.description}</p>
                <p className="mt-4">
                  <a
                    href={servicePath(offer.id)}
                    className="inline-flex min-h-11 items-center font-semibold text-brand underline-offset-4 hover:underline"
                  >
                    What this sprint covers
                    <ArrowRight className="ml-1.5 inline size-4" aria-hidden="true" />
                  </a>
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <NextStep />
          </div>
          <p className="mt-6">
            <a
              href={`/for/${persona.slug}/`}
              className="inline-flex min-h-11 items-center font-semibold text-brand underline-offset-4 hover:underline"
            >
              Why this usually goes wrong, and what changes
              <ArrowRight className="ml-1.5 inline size-4" aria-hidden="true" />
            </a>
          </p>
        </Section>
      ) : null}
    </>
  );
}
