import { ArrowRight } from "lucide-react";
import { COMPANY_INFO, CTA, ENGAGEMENT_STEPS, SPRINT_FEE_BAND } from "../data/companyData";
import { Button } from "../components/ui/Button";
import { Section } from "../components/ui/Section";
import { SplitText } from "../components/ui/SplitText";

/**
 * `/engage` — Class T (docs/07 §7, one of the three highest-intent pages).
 *
 * This exists because two fields on every engagement step — `commitment` and
 * `exit` — were in the data and rendered nowhere. The home page's lifecycle
 * section shows step, title, duration, cost and description; it does not show
 * what you are committing to, or what you keep if you stop.
 *
 * That is the site's most distinctive material. "Stop here and you keep every
 * deliverable, including the architecture and pilot scope — usable by any
 * vendor, not just us" is a costly signal, and it was sitting unused in a data
 * file. This page is built around it rather than around the pitch.
 *
 * Class T, so: no continuous motion, nothing decorative. A page where someone
 * is deciding what to pay does not get an animated diagram (S6.1-R).
 */
export function Engage({
  onOpenDiagnostic,
}: {
  onOpenDiagnostic: (workflow?: string) => void;
}) {
  return (
    <>
      <section id="top" aria-labelledby="engage-heading" className="relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4 pb-section pt-16 sm:px-6 lg:px-8 lg:pt-24">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-brand">
            How to engage
          </p>
          <h1
            id="engage-heading"
            className="mt-5 max-w-4xl text-display font-bold leading-[1.02] tracking-display text-ink"
          >
            <SplitText text="What you commit to, and what you keep if you stop." />
          </h1>
          <p data-reader-problem className="measure mt-6 text-lead text-ink-muted">
            Three stages, each with a fixed scope and a stated exit. You can stop after any
            one of them and keep everything produced up to that point. Nothing here requires
            a multi-year commitment, and nothing produced is locked to us.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" onClick={() => onOpenDiagnostic()}>
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

      <Section
        id="stages"
        intro={{
          eyebrow: "The three stages",
          heading: "Each stage states its own exit before it starts",
          subhead:
            "Duration, cost and commitment are agreed in writing first. The exit clause is what you keep if you walk away at that point.",
        }}
      >
        <ol className="space-y-4">
          {ENGAGEMENT_STEPS.map((step) => (
            <li
              key={step.step}
              className="lift rounded-2xl border border-hairline bg-surface/60 p-6"
            >
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="font-mono text-xs font-bold text-ink-subtle tabular-nums">
                  {step.step}
                </span>
                <h3 className="text-h3 font-bold text-ink">{step.title}</h3>
                <span className="font-mono text-xs text-ink-subtle">
                  {step.duration} · {step.cost}
                </span>
              </div>

              <p className="measure mt-3 text-ink-muted">{step.description}</p>

              <dl className="mt-5 grid gap-4 border-t border-hairline pt-4 md:grid-cols-2">
                <div>
                  <dt className="font-mono text-xs font-bold uppercase tracking-wider text-ink-subtle">
                    What you commit to
                  </dt>
                  <dd className="mt-1.5 text-sm text-ink">{step.commitment}</dd>
                </div>
                {/* The exit is given the accent, not the offer. It is the part a
                    buyer cannot get from a pitch deck. */}
                <div>
                  <dt className="font-mono text-xs font-bold uppercase tracking-wider text-verified">
                    If you stop here
                  </dt>
                  <dd className="mt-1.5 text-sm text-ink">{step.exit}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        id="fees"
        intro={{
          eyebrow: "Fees",
          heading: "What the diagnostic sprint costs",
          subhead: "Quoted in writing before any work begins, and partially credited if a build follows.",
        }}
      >
        <p className="measure text-lead text-ink-muted">
          {SPRINT_FEE_BAND
            ? `The diagnostic sprint is ${SPRINT_FEE_BAND}, fixed and quoted before it starts.`
            : "The diagnostic sprint is a fixed fee, quoted in writing before it starts and agreed before any work begins. We do not publish a band, because the scope is set on the fit call and quoting a range before that conversation would be a guess."}{" "}
          Fifty per cent of it is credited against the build if implementation starts within
          30 days. If we do not think a sprint is worth running, we say so on the first call.
        </p>
      </Section>
    </>
  );
}
