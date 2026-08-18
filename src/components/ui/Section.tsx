import type { ReactNode } from "react";
import type { SectionIntro } from "../../types";
import { cn } from "../../lib/utils";

/**
 * Shared section shell.
 *
 * Centralising this is what makes the spec's landmark rules (S2.2) and heading
 * order (S2.3) hold across the page rather than being re-derived per section:
 * every section gets a labelled region and an <h2> with a matching id.
 */
export function Section({
  id,
  intro,
  children,
  className,
  align = "start",
}: {
  id: string;
  intro: SectionIntro;
  children: ReactNode;
  className?: string;
  align?: "start" | "center";
}) {
  const headingId = `${id}-heading`;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn("border-t border-hairline py-section", className)}
    >
      {/* Scroll-linked entrance (S6.6). Applied here rather than per section so
          the rule holds everywhere, and never to the hero — animating the LCP
          element is banned (S6.1) and the hero is not a <Section>. */}
      <div className="reveal mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader intro={intro} headingId={headingId} align={align} />
        {children}
      </div>
    </section>
  );
}

export function SectionHeader({
  intro,
  headingId,
  align = "start",
}: {
  intro: SectionIntro;
  headingId: string;
  align?: "start" | "center";
}) {
  return (
    <div className={cn("mb-12", align === "center" && "mx-auto text-center")}>
      <p className="font-mono text-xs font-bold uppercase tracking-(--tracking-eyebrow) text-brand">
        {intro.eyebrow}
      </p>
      <h2
        id={headingId}
        className="mt-3 text-h2 font-extrabold tracking-tight text-balance text-ink"
      >
        {intro.heading}
      </h2>
      <p
        className={cn(
          "measure mt-4 text-lead text-ink-muted",
          align === "center" && "mx-auto",
        )}
      >
        {intro.subhead}
      </p>
    </div>
  );
}

