import { EVIDENCE_LEVELS_EXPLANATION, PRODUCTS_SYSTEMS, SECTIONS } from "../../data/companyData";
import type { EvidenceLevel, Tone } from "../../types";
import { Section } from "../ui/Section";

/** One meaning per accent (spec S5.3). */
const TONE_BADGE: Record<Tone, string> = {
  verified: "border-verified/30 bg-verified/10 text-verified",
  attention: "border-attention/30 bg-attention/10 text-attention",
  info: "border-info/30 bg-info/10 text-info",
};

const LEVEL_TONE: Record<EvidenceLevel, Tone> = {
  "Built/Deployed": "verified",
  Prototyped: "attention",
  "Researched/Designed": "info",
};

/**
 * Products merged with the evidence-level key (spec S2.1 §5).
 *
 * The two were separate sections; presenting the legend beside the tagged
 * systems is what makes the tags mean anything. Cards are no longer buttons —
 * they were interactive controls whose only effect was a border colour.
 */
export function Products() {
  return (
    <Section id="products" intro={SECTIONS.products}>
      {/*
        Subgrid, so every internal boundary lines up across the four cards.
        Measured before: the dividers started at four different heights with a
        40px spread, because the cards were flex columns with a flex-1
        description — that aligns the card *bottoms* while letting the visible
        rule float to wherever the prose happens to end. In a comparison grid
        the rule is the thing the eye scans along, so it is the thing that has
        to align.

        Each card claims the same four row tracks (title / badge / description /
        capabilities) from the parent, so the tracks size to the tallest card
        and every card agrees. Browsers without subgrid fall back to the flex
        column, which is exactly today's behaviour rather than a broken one.
      */}
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[auto_auto_1fr_auto]">
        {PRODUCTS_SYSTEMS.map((product) => {
          const tone = LEVEL_TONE[product.evidenceLevel];
          return (
            <li
              key={product.id}
              className="flex flex-col rounded-2xl border border-hairline bg-surface/70 p-6 transition-colors hover:border-hairline-strong lg:row-span-4 lg:grid lg:grid-rows-subgrid lg:gap-0"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-mono text-h3 font-bold text-ink">{product.name}</h3>
              </div>

              <span
                className={`mt-3 inline-flex w-fit rounded-full border px-2.5 py-1 font-mono text-xs font-bold ${TONE_BADGE[tone]}`}
              >
                {product.evidenceLevel}
              </span>

              <p className="mt-4 flex-1 text-sm text-ink-muted">{product.shortDesc}</p>

              <ul className="mt-5 space-y-2 border-t border-hairline pt-4">
                {product.capabilities.map((capability) => (
                  <li key={capability} className="flex gap-2 text-sm text-ink-subtle">
                    <span className="text-brand" aria-hidden="true">
                      •
                    </span>
                    <span>{capability}</span>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>

      <dl className="mt-10 grid grid-cols-1 gap-6 border-t border-hairline pt-10 md:grid-cols-3">
        {EVIDENCE_LEVELS_EXPLANATION.map((item) => (
          <div key={item.level} className="rounded-xl border border-hairline bg-surface/50 p-5">
            <dt>
              <span
                className={`inline-flex rounded-full border px-2.5 py-1 font-mono text-xs font-bold ${TONE_BADGE[item.tone]}`}
              >
                {item.level}
              </span>
            </dt>
            <dd className="mt-3 text-sm text-ink-muted">{item.desc}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
