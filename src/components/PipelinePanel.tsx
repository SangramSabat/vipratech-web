import { Terminal } from "lucide-react";
import { PIPELINE_STEPS } from "../data/companyData";
import type { Tone } from "../types";

const TONE_CLASS: Record<Tone, string> = {
  verified: "text-verified",
  attention: "text-attention",
  info: "text-info",
};

/**
 * The surviving piece of the terminal identity, kept as a contained product
 * artifact rather than an ambient effect (docs/01-brand-guidelines.md §5).
 *
 * It no longer rotates on an interval: the rows are the four stages of the
 * governed pipeline in order, so animating them conveyed nothing and cost a
 * re-render every three seconds. The header now says "worked example" — the
 * previous "LIVE STREAM" framing implied production telemetry that does not
 * exist (matrix §6).
 *
 * The flow markers added since are deliberately *not* a return to that. What
 * was removed rotated the rows' content on a JS interval, which reordered a
 * fixed sequence — it conveyed nothing because the order was the information
 * and rotating it destroyed the order. The markers instead traverse the four
 * stages in their real order, which is the one thing the panel is trying to
 * say: a claim enters, rules match it, ambiguity goes to a human, the decision
 * is recorded. This is diegetic motion under S6.1-R.a — inside the schematic,
 * not applied to the page — and it is CSS-only, so there is no interval, no
 * re-render, and no JavaScript at all.
 *
 * The header stays "worked example". The markers show a claim moving through a
 * sequence; they do not imply live telemetry, and the status text is fixed.
 */
export function PipelinePanel() {
  return (
    <figure className="rounded-2xl border border-hairline bg-surface/95 p-6 shadow-2xl backdrop-blur-sm">
      <figcaption className="flex items-center justify-between border-b border-hairline pb-4">
        <span className="flex items-center gap-2 font-mono text-xs font-bold tracking-wide text-ink">
          <Terminal className="size-4 text-brand" aria-hidden="true" />
          Pipeline — worked example
        </span>
      </figcaption>

      <ol className="relative mt-4 space-y-2">
        {/* The spine the markers travel down: the pipeline itself, drawn once
            and static. aria-hidden because the order is already carried by the
            list semantics and the numbered rows. */}
        <span
          className="flow-spine pointer-events-none absolute bottom-3 left-(--schematic-spine-x) top-3 w-px"
          aria-hidden="true"
        />
        {PIPELINE_STEPS.map((step, index) => (
          <li
            key={step.id}
            className="relative flex items-center justify-between gap-3 rounded-xl border border-hairline bg-ground/80 p-3.5"
          >
            <span className="flex min-w-0 items-baseline gap-3">
              <span
                className="flow-node absolute left-(--schematic-node-x) top-1/2 size-2 -translate-y-1/2 rounded-full bg-brand"
                style={{ "--i": index } as React.CSSProperties}
                aria-hidden="true"
              />
              <span className="ml-4 font-mono text-xs font-bold text-ink-subtle tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0">
                <span className="block font-mono text-xs uppercase tracking-wider text-ink-subtle">
                  {step.stage}
                </span>
                <span className="mt-0.5 block text-sm text-ink">{step.text}</span>
              </span>
            </span>
            <span
              className={`shrink-0 font-mono text-xs font-bold ${TONE_CLASS[step.tone]}`}
            >
              {step.status}
            </span>
          </li>
        ))}
      </ol>

      <p className="mt-4 border-t border-hairline pt-4 font-mono text-xs text-ink-subtle">
        Rules → model → human gate → audit record
      </p>
    </figure>
  );
}
