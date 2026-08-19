import { ArrowRight } from "lucide-react";

/**
 * The engagement mechanics, stated on every page that argues for something.
 *
 * Added after measuring numeral density per page: the ten pages I authored
 * carried 0.53–2.05 numerals per 100 words against 3.62–4.09 on the home and
 * service pages. I had been attributing that gap to a blocked client naming
 * permission for five iterations. It was not that. The figures below were
 * published on the home page the whole time, and the pages I wrote simply never
 * told the reader what happens next.
 *
 * Every number here is already published elsewhere on the site and is a
 * commercial term rather than a claim about a client, so none of it depends on
 * the naming permission that is genuinely outstanding.
 */
export function NextStep() {
  return (
    <aside
      aria-label="What happens next"
      className="rounded-2xl border border-hairline bg-surface/60 p-6"
    >
      <p className="font-mono text-xs font-bold uppercase tracking-wider text-ink-subtle">
        What happens next
      </p>
      <p className="measure mt-3 text-ink-muted">
        A free <strong className="text-ink">30-minute</strong> fit call, then a bounded{" "}
        <strong className="text-ink">5–10 day</strong> diagnostic sprint at a fixed fee quoted
        before it starts. <strong className="text-ink">50%</strong> of that fee is credited
        against the build if implementation begins within{" "}
        <strong className="text-ink">30 days</strong>. Stop after either stage and you keep
        every deliverable, usable by any vendor.
      </p>
      <p className="mt-4">
        <a
          href="/engage/"
          className="inline-flex min-h-11 items-center font-semibold text-brand underline-offset-4 hover:underline"
        >
          What you commit to at each stage
          <ArrowRight className="ml-1.5 inline size-4" aria-hidden="true" />
        </a>
      </p>
    </aside>
  );
}
