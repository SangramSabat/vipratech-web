import { ArrowRight } from "lucide-react";
import { COMPANY_INFO, CTA, PLATFORM } from "../data/companyData";
import { Button } from "../components/ui/Button";
import { NextStep } from "../components/NextStep";
import { Section } from "../components/ui/Section";
import { SplitText } from "../components/ui/SplitText";

/**
 * The platform arm (docs/06 §3, §9) — the first Class S route.
 *
 * Class S is the showcase tier from spec amendment 2026-08-17/1. It permits
 * what Trust and Narrative do not, and that permission was paid for by making
 * Trust-class pages stricter. What this page spends it on:
 *
 *   spent   — the build-loop schematic (effect #22), in the hero
 *   spent   — the display headline reveal, permitted here because Class S
 *             allows colour/opacity animation on the LCP element
 *   NOT     — WebGL. Effects #19-#20 (spline.design's full-viewport shader
 *             field and the blur(100px) glass over it) are measured and
 *             available and still unused: glass needs something behind it,
 *             there is no 3D scene here, and building one to justify the effect
 *             is the definition of slop.
 *   NOT     — the 30 kB Class S JavaScript budget. This page ships zero.
 *
 * Layout note, from actually looking at it rendered. The first version put the
 * schematic in its own section below the fold and left the hero's right half
 * empty, which made the showcase route the thinnest-looking page on the site —
 * a single ~55% column with 45% air, repeated down four near-empty sections.
 * The schematic is the page's subject, so it belongs beside the claim, exactly
 * as PipelinePanel sits beside the home hero. Ownership and limits are now one
 * two-column section rather than two: each had a heading and an invented
 * subhead above a single paragraph.
 */
export function Platform({
  onOpenDiagnostic,
}: {
  onOpenDiagnostic: (workflow?: string) => void;
}) {
  return (
    <>
      <section id="top" aria-labelledby="platform-heading" className="relative overflow-hidden">
        <div className="ground-field pointer-events-none absolute inset-0" aria-hidden="true" />

        <div className="relative mx-auto max-w-7xl px-4 pb-section pt-16 sm:px-6 lg:px-8 lg:pt-24">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <p className="font-mono text-xs font-bold uppercase tracking-(--tracking-eyebrow) text-brand">
                {PLATFORM.eyebrow}
              </p>
              <h1
                id="platform-heading"
                className="mt-5 text-display font-bold leading-[1.02] tracking-display text-ink"
              >
                <SplitText text={PLATFORM.headline} />
              </h1>
              <p data-reader-problem className="measure mt-6 text-lead text-ink-muted">
                {PLATFORM.lead}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" onClick={() => onOpenDiagnostic()}>
                  {CTA.primary}
                </Button>
                <Button
                  as="a"
                  size="lg"
                  variant="secondary"
                  href={`mailto:${COMPANY_INFO.email}?subject=${encodeURIComponent(
                    `30-minute fit call — ${PLATFORM.name}`,
                  )}`}
                >
                  {CTA.secondary}
                  <ArrowRight className="size-4 text-brand" aria-hidden="true" />
                </Button>
              </div>
            </div>

            {/*
              Effect #22 — diegetic schematic, the build loop.

              Recipe [measured, confident-ai.com]: linear easing, staggered
              siblings, a period slow enough to read as system activity rather
              than blinking. 12s here against PipelinePanel's 8s, because this
              is the page's subject rather than a supporting panel, so each
              stage holds 3s instead of 2s.

              Honesty conditions (S6.1-R.a): the four stages are the build
              process described beside them, the markers are aria-hidden and
              carry no text, and opacity is the only property animated.

              It does not pause off-screen and cannot in CSS — see the note on
              .flow-node in index.css. The cost is measured and budgeted by e2e
              instead.
            */}
            <figure className="lg:col-span-5">
              <figcaption className="border-b border-hairline pb-4 font-mono text-xs font-bold uppercase tracking-wider text-ink-subtle">
                {PLATFORM.stagesIntro.heading}
              </figcaption>
              <ol className="relative mt-4 space-y-2">
                <span
                  className="flow-spine pointer-events-none absolute bottom-4 left-(--schematic-spine-x) top-4 w-px"
                  aria-hidden="true"
                />
                {PLATFORM.stages.map((stage, index) => (
                  <li
                    key={stage.id}
                    className="lift relative rounded-xl border border-hairline bg-surface/60 p-4 pl-12"
                  >
                    <span
                      className="flow-node flow-node-slow absolute left-(--schematic-node-x) top-6 size-2 -translate-y-1/2 rounded-full bg-brand"
                      style={{ "--i": index } as React.CSSProperties}
                      aria-hidden="true"
                    />
                    <p className="font-mono text-xs font-bold uppercase tracking-wider text-ink-subtle">
                      {String(index + 1).padStart(2, "0")} · {stage.stage}
                    </p>
                    <p className="mt-1.5 text-sm text-ink">{stage.text}</p>
                  </li>
                ))}
              </ol>
              <p className="mt-4 border-t border-hairline pt-4 font-mono text-xs text-ink-subtle">
                {PLATFORM.stagesIntro.subhead}
              </p>
            </figure>
          </div>
        </div>
      </section>

      <Section id="evidence" intro={PLATFORM.evidenceIntro}>
        <p className="measure text-lead text-ink-muted">{PLATFORM.evidenceNote}</p>
        <div className="mt-6">
          <NextStep />
        </div>
        <p className="mt-4">
          <a
            href="/#products"
            className="inline-flex min-h-11 items-center font-semibold text-brand underline-offset-4 hover:underline"
          >
            See the systems and their evidence levels
            <ArrowRight className="ml-1.5 inline size-4" aria-hidden="true" />
          </a>
        </p>
      </Section>

      {/* Both halves side by side, and the limits half is deliberately given
          equal weight rather than a footnote's. A page that sells a platform and
          then names where the platform is the wrong answer is making a costly
          signal; shrinking that half would cost it the signal. */}
      {/* Not `terms` — the home page already owns that id for commercial
          terms, which the nav labels "Pricing". Same word, different subject. */}
      <Section id="what-you-get" intro={PLATFORM.termsIntro}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="lift rounded-2xl border border-hairline bg-surface/60 p-6">
            <h3 className="text-h3 font-bold text-ink">{PLATFORM.ownership.title}</h3>
            <p className="mt-3 text-ink-muted">{PLATFORM.ownership.text}</p>
          </div>
          <div className="lift rounded-2xl border-l-2 border-attention/50 border-y border-r border-hairline bg-surface/40 p-6">
            <h3 className="text-h3 font-bold text-ink">{PLATFORM.limits.title}</h3>
            <p className="mt-3 text-ink-muted">{PLATFORM.limits.text}</p>
          </div>
        </div>
      </Section>
    </>
  );
}
