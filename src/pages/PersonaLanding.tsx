import { ArrowRight } from "lucide-react";
import { COMPANY_INFO, CTA, SERVICE_OFFERS } from "../data/companyData";
import type { Persona } from "../data/personas";
import { Button } from "../components/ui/Button";
import { NextStep } from "../components/NextStep";
import { Section } from "../components/ui/Section";
import { SplitText } from "../components/ui/SplitText";
import { servicePath } from "../routes";

/**
 * `/for/<persona>/` — the gate's destinations (docs/07 §5).
 *
 * Gating here is a *route*, not a curtain. `06` §6 originally proposed
 * resolving a persona from signals and swapping the home hero client-side after
 * hydration; `07` §5 rejected that for two reasons and this page is the
 * consequence of both:
 *
 *   1. the home hero is the LCP element and carries a per-character reveal, so
 *      rewriting it post-hydration mutates the thing the whole design leans on
 *   2. a variant that only exists after JavaScript runs is a variant Google
 *      never indexes and a shared link never lands on
 *
 * So each persona is a real prerendered document with its own metadata, and
 * nothing swaps. `/` is never gated: it ships the default persona, complete and
 * indexable, and the gate is one visible control below its hero.
 *
 * Copy is `06` §5 verbatim. It is deliberately unattributed — the figures are
 * already published on the home page, while `06`'s own SB7 notes name the
 * client, and that naming stays out until written permission exists
 * (01-brand-guidelines §6).
 */
export function PersonaLanding({
  persona,
  onOpenDiagnostic,
}: {
  persona: Persona;
  onOpenDiagnostic: (workflow?: string) => void;
}) {
  const offers = SERVICE_OFFERS.filter((offer) => persona.serviceIds.includes(offer.id));

  return (
    <>
      <section id="top" aria-labelledby="persona-heading" className="relative overflow-hidden">
        <div className="ground-field pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 pb-section pt-16 sm:px-6 lg:px-8 lg:pt-24">
          <p className="font-mono text-xs font-bold uppercase tracking-(--tracking-eyebrow) text-brand">
            For {persona.label.toLowerCase()}
          </p>
          <h1
            id="persona-heading"
            className="mt-5 max-w-4xl text-display font-bold leading-[1.02] tracking-display text-ink"
          >
            <SplitText text={persona.hero} />
          </h1>
          <p data-reader-problem className="measure mt-6 text-lead text-ink-muted">
            {persona.problem}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" onClick={() => onOpenDiagnostic(persona.serviceIds[0])}>
              {CTA.primary}
            </Button>
            <Button
              as="a"
              size="lg"
              variant="secondary"
              href={`mailto:${COMPANY_INFO.email}?subject=${encodeURIComponent(
                `30-minute fit call — ${persona.label}`,
              )}`}
            >
              {CTA.secondary}
              <ArrowRight className="size-4 text-brand" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </section>

      {/* The objection is answered before the offer, not after it. This persona
          arrived by declaring itself, so the page can afford to name the thing
          they were about to say rather than working up to it. */}
      {/* Empathy before authority, in that order — the guide has to show it
          understands the failed prior attempt before it is allowed to claim it
          can do better (SB7). This is the line a visitor was going to say
          themselves, said first. */}
      <Section
        id="understanding"
        intro={{
          eyebrow: "What we think is going on",
          heading: persona.empathy,
          subhead: persona.trigger,
        }}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border-l-2 border-attention/50 border-y border-r border-hairline bg-surface/40 p-6">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-attention">
              If nothing changes
            </h3>
            <p className="mt-2.5 text-lead text-ink">{persona.failure}</p>
          </div>
          <div className="rounded-2xl border-l-2 border-verified/50 border-y border-r border-hairline bg-surface/40 p-6">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-verified">
              What it looks like working
            </h3>
            <p className="mt-2.5 text-lead text-ink">{persona.success}</p>
          </div>
        </div>

        {/* Both stakes are stated. Naming only the upside is advertising, and
            this site's whole posture is that it will tell you when the answer
            is no (S10.4). */}
        <ol className="relative mt-8 space-y-2">
          <span
            className="flow-spine pointer-events-none absolute bottom-4 left-(--schematic-spine-x) top-4 w-px"
            aria-hidden="true"
          />
          {persona.plan.map((step, index) => (
            <li
              key={step}
              className="relative rounded-xl border border-hairline bg-surface/60 p-4 pl-12"
            >
              <span
                className="flow-node absolute left-(--schematic-node-x) top-1/2 size-2 -translate-y-1/2 rounded-full bg-brand"
                style={{ "--i": index } as React.CSSProperties}
                aria-hidden="true"
              />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink-subtle">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="ml-3 text-ink">{step}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        id="objection"
        intro={{
          eyebrow: "What you are probably thinking",
          heading: persona.objection,
          subhead: persona.proofRequired,
        }}
      >
        <p className="measure text-lead text-ink-muted">{persona.trigger}</p>
      </Section>

      <Section
        id="practices"
        intro={{
          eyebrow: "Where to start",
          heading: offers.length > 1 ? "The practices that apply here" : "The practice that applies here",
          subhead:
            "Every engagement opens with a bounded diagnostic sprint before anyone commits to a build.",
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
      </Section>
    </>
  );
}
