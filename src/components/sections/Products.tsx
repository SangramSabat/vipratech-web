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
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PRODUCTS_SYSTEMS.map((product) => {
          const tone = LEVEL_TONE[product.evidenceLevel];
          return (
            <li
              key={product.id}
              className="flex flex-col rounded-2xl border border-hairline bg-surface/70 p-6 transition-colors hover:border-hairline-strong"
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
