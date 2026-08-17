import { ArrowRight } from "lucide-react";
import { COMPANY_INFO, CTA, PLATFORM } from "../data/companyData";
import { Button } from "../components/ui/Button";
import { Section } from "../components/ui/Section";
import { SplitText } from "../components/ui/SplitText";

/**
 * The platform arm (docs/06 §3, §9) — the first Class S route.
 *
 * Class S is the showcase tier introduced by spec amendment 2026-08-17/1. It
 * permits what the Trust and Narrative tiers do not, and that permission is
 * paid for by Trust-class pages getting *stricter* than the rule they replaced.
 * This page is where the budget is spent, so it is worth stating what it does
 * and does not spend it on:
 *
 *   spent   — a diegetic schematic of the four build stages (effect #22),
 *             larger and slower than the home page's, because this page is the
 *             argument rather than a summary of it
 *   spent   — the display headline reveal, permitted here because Class S
 *             allows colour/opacity animation on the LCP element
 *   NOT     — WebGL. Effects #19-#20 (spline.design's full-viewport shader
 *             field and the blur(100px) glass over it) are measured and
 *             available, and are still not used: glass needs something behind
 *             it, there is no 3D scene here, and building one to justify the
 *             effect is the definition of slop. They wait for a page whose
 *             subject is actually three-dimensional.
 *   NOT     — the 30 kB Class S JavaScript budget. This page ships zero.
 *
 * Everything below is prerendered HTML and CSS. The route exists so the
 * showcase tier has somewhere to live; it does not exist to justify spending.
 */
export function Platform({
  onOpenDiagnostic,
}: {
  onOpenDiagnostic: (workflow?: string) => void;
}) {
  return (
    <>
      <section
        id="top"
        aria-labelledby="platform-heading"
        className="relative overflow-hidden"
      >
        <div
          className="ground-field pointer-events-none absolute inset-0"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-4 pb-section pt-16 sm:px-6 lg:px-8 lg:pt-24">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-brand">
            {PLATFORM.eyebrow}
          </p>
          <h1
            id="platform-heading"
            className="mt-5 max-w-4xl text-display font-bold leading-[1.02] tracking-display text-ink"
          >
            <SplitText text={PLATFORM.headline} />
          </h1>
          <p
            data-reader-problem
            className="measure mt-6 text-lead text-ink-muted"
          >
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
      </section>

      <Section id="stages" intro={PLATFORM.stagesIntro}>
        {/*
          Effect #22 — diegetic schematic, the build pipeline.

          Recipe [measured, confident-ai.com]: linear easing, staggered
          siblings, a period slow enough to read as system activity rather than
          blinking. The home page's PipelinePanel runs the same mechanism at 8s.
          This one runs at 12s because it is the page's subject rather than a
          supporting panel — a reader here is following the argument, not
          glancing at an illustration.

          Honesty conditions (S6.1-R.a): these four stages are the build process
          described in the copy beside them, the markers are aria-hidden and
          carry no text, and opacity is the only property animated.
        */}
        <ol className="relative mt-4 space-y-3">
          <span
            className="flow-spine pointer-events-none absolute bottom-5 left-[1.35rem] top-5 w-px"
            aria-hidden="true"
          />
          {PLATFORM.stages.map((stage, index) => (
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
                {String(index + 1).padStart(2, "0")} · {stage.stage}
              </p>
              <p className="mt-2 text-ink">{stage.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="ownership" intro={PLATFORM.ownershipIntro}>
        <p className="measure text-lead text-ink-muted">
          {PLATFORM.ownership.text}
        </p>
      </Section>

      <Section id="evidence" intro={PLATFORM.evidenceIntro}>
        <p className="measure text-lead text-ink-muted">
          {PLATFORM.evidenceNote}
        </p>
        <p className="mt-4">
          <a
            href="/#products"
            // min-h-11 keeps the target above the 44px floor (S7.4). An inline
            // text link measured 338x18 and failed it; inline-flex plus a
            // minimum height fixes the target without turning the link into a
            // button, which would give it a CTA tier it should not have (S3.1).
            className="inline-flex min-h-11 items-center font-semibold text-brand underline-offset-4 hover:underline"
          >
            See the systems and their evidence levels
            <ArrowRight className="ml-1.5 inline size-4" aria-hidden="true" />
          </a>
        </p>
      </Section>

      {/* Kept last and unornamented on purpose. A page that sells a platform and
          then names where the platform is the wrong answer is making a costly
          signal; dressing it up would cost it the signal. */}
      <Section id="limits" intro={PLATFORM.limitsIntro}>
        <p className="measure text-lead text-ink-muted">
          {PLATFORM.limits.text}
        </p>
      </Section>
    </>
  );
}
