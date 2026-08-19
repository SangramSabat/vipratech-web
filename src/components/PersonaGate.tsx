import { PERSONAS } from "../data/personas";

/**
 * The gate (docs/07 §5).
 *
 * A gate that is a route, not a curtain. `06` §6 proposed inferring a persona
 * and swapping the home hero client-side; `07` §5 rejected that because the
 * hero is the LCP element carrying a per-character reveal, and because a
 * variant that only exists after hydration is one no crawler indexes and no
 * shared link lands on.
 *
 * So this is five links to five prerendered documents. No state, no storage, no
 * JavaScript, nothing to hydrate — which is also why it can sit on a page whose
 * own budget is 8 kB.
 *
 * It is a visible, declined-by-default control rather than a modal or an
 * interstitial: `/` is never gated. A visitor who ignores this reads the
 * complete default page, which is the strongest single page on the site. The
 * bifurcation is opt-in, and it is legible before it is chosen.
 */
export function PersonaGate() {
  return (
    <section
      aria-labelledby="persona-gate-heading"
      className="border-t border-hairline bg-surface/30"
    >
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h2
          id="persona-gate-heading"
          className="font-mono text-xs font-bold uppercase tracking-wider text-ink-subtle"
        >
          Show me what matters for —
        </h2>
        <ul className="mt-4 flex flex-wrap gap-2.5">
          {PERSONAS.map((persona) => (
            <li key={persona.id}>
              <a
                href={`/for/${persona.slug}/`}
                className="lift flex min-h-11 flex-col justify-center rounded-xl border border-hairline bg-surface/60 px-4 py-2.5 transition-colors hover:border-brand/50"
              >
                <span className="text-sm font-semibold text-ink">{persona.label}</span>
                <span className="mt-0.5 text-xs text-ink-subtle">{persona.audience}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
