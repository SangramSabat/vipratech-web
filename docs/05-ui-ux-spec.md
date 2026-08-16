# 05 — UI/UX Specification  🔒 LOCKED

> **Inherits from:** `01-brand-guidelines.md` → `02-personas.md` → `03-copywriting-matrix.md` → `04-plan.md`.
>
> **Status: LOCKED.** This is the single source of truth for implementation. Every change in Waves 3–5 must cite a section of this file. A decision this Spec does not cover is a flag-and-ask, not an invention. Amendments go in §13 with a dated entry — never a silent edit.

---

## 1. Architecture doctrine

| Decision | Value |
|---|---|
| Framework | React 19 + Vite 6 + Tailwind v4 — **no migration** |
| Rendering | Build-time prerender → static HTML in `dist/index.html`, then `hydrateRoot` |
| Component layer | shadcn/ui (Radix primitives) in `src/components/ui/`, restyled to brand tokens |
| Deployment | Static bundle → GitHub Pages, unchanged |
| Backend | None. All logic stays client-side. |

**S1.1** `dist/index.html` must contain the hero H1, all section headings, and body copy as real HTML text. Verification: `grep -c "AI for decisions you have to defend" dist/index.html` ≥ 1.
**S1.2** Hydration must not change rendered text. No hydration mismatch warnings in console.
**S1.3** `bun run build` stays a single command. No extra manual step.

## 2. Page structure

**S2.1** Section order (retired order in `SignalGridPage.tsx` is replaced):

| # | Section | id | Notes |
|---|---|---|---|
| — | Skip link | `#main` | First focusable element |
| — | `<header>` + `<nav>` | — | Sticky, anchor nav, secondary CTA. **Replaces the marquee ticker.** |
| 1 | Hero | `#top` | H1 + lead + 2 CTAs + proof strip + log panel |
| 2 | Engagement lifecycle | `#how` | **Moved up from pre-footer** |
| 3 | Governed vs. generic | `#why` | New |
| 4 | Five offers | `#services` | Existing anchor preserved |
| 5 | Products & evidence levels | `#products` | Evidence banner merges here |
| 6 | Feasibility simulator | `#simulator` | |
| 7 | Diagnostic calculator | `#calculator` | |
| 8 | Security & assurance | `#assurance` | New |
| 9 | FAQ | `#faq` | |
| 10 | Final CTA | `#contact` | |
| 11 | `<footer>` | — | |

**S2.1a** Routes. Each is prerendered to its own document sharing one JS bundle; there is no router library and no client-side navigation.

| Path | Page | Title / description |
|---|---|---|
| `/` | Home | Site-level |
| `/services/<id>/` (×5) | Service detail | Per offer, from `SERVICE_OFFERS` |
| `/404.html` | Not found | GitHub Pages fallback |

Every route emits its own `<title>`, `<meta name="description">`, canonical, and OG/Twitter tags, and appears in a generated `sitemap.xml`. Service routes emit `Service` + `BreadcrumbList` JSON-LD; the `FAQPage` node is claimed by the home route only.

**S2.2** Landmarks: exactly one `<header>`, one `<main id="main">`, one `<footer>`. `<nav>` may appear more than once (primary and footer) provided each carries a distinct `aria-label`. Each numbered section is a `<section>` with `aria-labelledby` pointing at its heading id.
**S2.3** Heading order: one `<h1>` (hero only). Each section opens with `<h2>`. No level skipped. Card titles are `<h3>`.
**S2.4** Each of the five service panels is an `<article>`.

## 3. CTA hierarchy

**S3.1** Exactly **three tiers**, with primary use bounded by S3.3:

| Tier | Style | Label | Action |
|---|---|---|---|
| Primary | Solid `lime-400`, black text, ≥48px tall | `Run the fit diagnostic` | Opens diagnostic modal |
| Secondary | Outline, `zinc-700` border, `zinc-100` text | `Book a 30-min fit call` | Direct `mailto:` |
| Tertiary | Text link, `lime-400`, underline on hover | contextual | in-page anchor |

**S3.2** **Every CTA label must name the action it performs.** A label saying "schedule" must open scheduling.
**S3.3** **At most one primary CTA per section.** It appears in: hero, engagement lifecycle, services, routing model, effort calculator, final CTA. Repeating the *same* primary action down the page is intended; two competing primaries inside one section is the defect this guards against. See amendment 2026-08-14/5.
**S3.4** Secondary CTA is standing — present in the header and repeated at final CTA and footer.

## 4. Typography

**S4.1** Implements `01-brand-guidelines.md` §4 as Tailwind v4 `@theme` tokens.
**S4.2** **Minimum prose size 14px. Minimum any-text size 12px.** All 21 existing `text-[9px]`/`text-[10px]`/`text-[11px]` usages are removed.
**S4.3** **Monospace is for eyebrows, badges, data, and code only — never prose.** Body copy is sans.
**S4.4** Fluid scale via `clamp()`; no fixed px heading sizes.
**S4.5** Body line-height ≥ 1.6; measure capped at `65ch`.

## 5. Colour

**S5.1** Palette per `01-brand-guidelines.md` §3 as semantic `@theme` tokens.
**S5.2** **`text-zinc-500` and `text-zinc-600` are banned** (measured 4.12:1 and 2.57:1 on `zinc-950` — both fail AA). Minimum muted text is `zinc-400` (7.56:1). All 10 existing usages replaced.
**S5.3** Accent semantics are fixed: `emerald-400` = verified · `amber-300` = needs a human · `blue-400` = informational. `teal-300` retired.
**S5.4** Lime marks the primary action and the single most important signal per viewport — nothing else.
**S5.5** All text/background pairs must meet **WCAG AA (4.5:1)**; interactive and large text at minimum **3:1**.

## 6. Motion

**S6.1** Enforces the motion budget in `01-brand-guidelines.md` §5.

| Rule | Limit |
|---|---|
| Continuously-animating decorative layers visible at once | ≤ 1 |
| Animation on the LCP element | Never |
| Ambient full-viewport effects | None |
| Layout-shifting animation | Banned — transform/opacity only |
| Off-screen / backgrounded animation | Must pause |

**S6.2 Retired outright:** `MatrixRainCanvas` full-viewport wash, the 12-particle field, the cursor reticle, the marquee ticker, the rotating crosshair, the sweeping laser, and the typewriter `<h1>`.
**S6.3** Under `prefers-reduced-motion: reduce`: decorative motion off, functional transitions ≤ 150ms. Enforced globally in `src/index.css` — see amendment 2026-08-14/1 for why no JS hook is involved.
**S6.4** No React state may be written from a pointer-move handler. Pointer-driven visuals use a CSS custom property written outside the render cycle.
**S6.5** Any retained canvas pauses via `IntersectionObserver` and `document.hidden`.

**S6.6 Permitted motion.** Motion is CSS-only and compositor-driven: no animation
library, no `IntersectionObserver`, no React state. Transform and opacity only.

| Effect | Where | Rule |
|---|---|---|
| Scroll-linked entrance (`.reveal`) | `Section` shell | Never the hero — animating the LCP element stays banned (S6.1) |
| Sequential entrance (`.reveal-stagger`) | Engagement lifecycle only | Permitted only where order is real information |
| Spring hover lift (`.lift`) | Cards | `--ease-spring`; hover and `:focus-within` |
| Conic CTA trace (`.cta-trace`) | Primary buttons | One per section by S3.1; not a general utility |
| Designed focus halo | `:focus-visible` globally | Ring plus halo, keyboard only |

Two guards are mandatory, because both failure modes hide content rather than
degrade it: the scroll-linked rules sit inside `@supports (animation-timeline:
view())` so a browser without scroll-driven animations never applies the
`opacity: 0` start state; and they are switched off **by name** under
`prefers-reduced-motion: reduce`, because a scroll-driven animation takes its
progress from the timeline rather than the duration the global clamp sets.
Covered by test (S11.8).

**S6.7 Cross-document view transitions.** `@view-transition { navigation: auto; }`
plus a `view-transition-name` on the site header. The six prerendered documents
share no router, so this is the whole navigation treatment; unsupported browsers
navigate exactly as before.

## 7. Accessibility — acceptance criteria

**S7.1** Modal (shadcn `Dialog`): focus trapped on open, focus restored to trigger on close, `Escape` closes, body scroll locked, `aria-modal` + labelled title.
**S7.2** Service and product tabs (shadcn `Tabs`): `role="tablist"/"tab"/"tabpanel"`, roving tabindex, Left/Right/Home/End keyboard support.
**S7.3** FAQ (shadcn `Accordion`): correct `aria-expanded`/`aria-controls`, keyboard operable.
**S7.4** All interactive targets **≥ 44×44 CSS px**.
**S7.5** Visible focus ring on every interactive element: 2px `lime-400`, 2px offset. Never `outline: none` without a replacement.
**S7.6** Skip-to-content link, first in tab order, visible on focus.
**S7.7** Decorative elements (canvas, icons inside labelled controls) carry `aria-hidden="true"`.
**S7.8** The rotating log panel is not announced — `aria-hidden` on the animating region, with static text elsewhere conveying the same information.
**S7.9** Every form control has a programmatically associated `<label>`.
**S7.10** Full keyboard traversal of the page with no trap and no hidden focus.

## 8. Responsive

**S8.1** Mobile-first. Breakpoints: 360 / 768 / 1280 / 1920.
**S8.2** Fluid `clamp()` type and spacing — no per-breakpoint font-size jumps.
**S8.3** No horizontal scroll at any width. Wide content (tables, the comparison grid) scrolls inside its own container.
**S8.4** Hero is single-column below `lg`; the log panel follows the copy, never precedes it in DOM order.
**S8.5** Tap targets ≥ 44px at all widths (S7.4).

## 9. Performance budgets

**S9.1** Bundle — measured against the baseline of **408.76 kB / 126.54 kB gzip in a single chunk**. Revised in amendment 2026-08-14/2 once the cost of the accessible primitives was measurable:

| Metric | Budget | Rationale |
|---|---|---|
| App code (gzip), excluding React vendor | **≤ 45 kB** | The part that changes per deploy |
| Total initial JS (gzip) | **≤ 105 kB** | React 19 + ReactDOM is ~61 kB of this and is irreducible without a framework change |
| Deferred JS (gzip), not in initial load | no budget | Diagnostic modal only |
| CSS (gzip) | ≤ 12 kB | |

**S9.2** Code-splitting required: `React.lazy` for the diagnostic modal, simulator, and calculator; dynamic `import()` for `canvas-confetti` at call time (never in the entry chunk); `manualChunks` splitting `react`/`react-dom` from feature code.
**S9.3** Core Web Vitals targets: **LCP ≤ 2.0s**, **CLS ≤ 0.05**, **INP ≤ 200ms** (throttled Lighthouse against `bun run preview`).
**S9.4** The LCP element must be **static text present in the prerendered HTML and never animation-gated**. Measured: the hero lead paragraph at **216 ms**, CLS **0**.
**S9.5** No web fonts. System font stack only — already the case, and it is an LCP advantage worth keeping.
**S9.6** SEO deliverables: OpenGraph + Twitter card tags, canonical URL, `robots.txt`, `sitemap.xml`, and JSON-LD for `Organization`, `Service` (×5), and `FAQPage`.

## 10. Integrity requirements

These are correctness requirements, not polish. They exist because the site's thesis is *evidence before claims*.

**S10.1** `analyzeFitDiagnostic` **must produce materially different output for materially different input.** The current implementation returns a hardcoded `fitScore: 92` / `"Strong Fit"` with an identical risk list, architecture, and reasoning for every visitor. Score and risks must derive from the submitted challenges, timeline, and team size. Covered by test (S11.2).
**S10.2** The diagnostic result must be labelled a **self-assessment**, not a verified finding, per `03-copywriting-matrix.md` §5.
**S10.3** No pre-filled diagnostic answers. `challenges` starts empty, `currentWorkaround` starts blank; submit is disabled until the user selects at least one challenge.
**S10.4** The `mailto:` handoff must have a fallback — visible email address plus copy-to-clipboard of the generated summary.
**S10.5** **No fabricated proof.** No invented logos, testimonials, metrics, or certifications. Trust slots stay unrendered until real content is supplied.
**S10.6** No copy may claim a live production feed, certification, or client relationship that does not exist.

## 11. Verification

Everything below runs from one command, and the same gates run in CI:

```bash
bun run verify   # typecheck -> knip -> unit tests -> build -> bundle budgets -> e2e
```

Unit tests (`vitest`) cover the scoring function. Everything that depends on a
real browser — prerendered HTML, hydration, the accessibility tree, contrast,
motion, and vitals — is covered by Playwright in `e2e/`, running against the
**built** artifact rather than the dev server.

| Criterion | Where it is enforced |
|---|---|
| **S11.1** Prerendered content reaches a JS-disabled client | `e2e/prerender.spec.ts` — asserts the `<h1>` and all eight section headings with `javaScriptEnabled: false` |
| **S11.2** Diagnostic responds to its input | `fitDiagnostic.test.ts` (unit) + `e2e/diagnostic.spec.ts` (through the shipped UI) |
| **S11.3 / S11.4** Banned tokens and stop-list absent | `grep` — see below |
| **S11.5** Bundle within S9.1 | `bun run check:bundle` (`scripts/check-bundle.mjs`) |
| **S11.6** Accessibility | `e2e/accessibility.spec.ts` — **accessible names read from the CDP accessibility tree, never the DOM**, plus focus trap/Escape/restore, tab arrow keys, contrast, tap targets, heading order |
| **S11.7** Responsive and motion | `e2e/responsive.spec.ts` — 360/768/1280/1920, reduced-motion, LCP and CLS |
| **S11.8** Scroll reveals never strand content invisible | `e2e/responsive.spec.ts` — scrolls the whole page in both motion preferences and fails on any settled, fully-in-view element still below 0.95 opacity |
| Hydration correctness | `e2e/prerender.spec.ts` — fails on any console error or warning |
| Structured data and social card | `e2e/prerender.spec.ts` — JSON-LD parsed and cross-checked, OG tags and assets fetched |

Two checks remain greps, since they are about source rather than behaviour:

```bash
grep -rn "text-zinc-500\|text-zinc-600\|text-\[9px\]\|text-\[10px\]\|text-\[11px\]" src/   # S11.3
grep -rni "kinetic\|signal matrix\|target_lock\|reticle\|cybernetic" src/                        # S11.4
```

**Why the accessibility tests query CDP rather than the DOM:** a DOM-based check
reported every control as named because it searched ancestors for `aria-label`.
Assistive technology does not do that. It hid five sliders whose accessible name
was empty, and separately gave a false pass on focus restoration by asserting
`document.activeElement.textContent.includes(...)` — `<body>`'s textContent
contains the whole page, so that assertion could never fail. Assert against what
a screen reader actually consumes.

## 12. Commercial disclosure, copy depth and card hierarchy

**S12.1 Commercial terms are a section, not a footnote.** Every stage of the
engagement publishes three things: what it costs, what the buyer commits to, and
what they keep if they stop there. "Paid — quoted per scope" on its own reads as
evasive; the same fact beside its basis and its exit reads as normal.

**S12.2 The basis is published even when the number is not.** The reference
class does not publish services pricing either, so a figure was never the gap —
the gap was giving a buyer no way to reason about it. `FEE_DRIVERS` lists what
moves the quote. `SPRINT_FEE_BAND` is `null` until a real band is supplied and
the section reads correctly either way. **A fee figure must never be invented to
fill the slot** — that is precisely the unevidenced claim this site exists to
argue against (S10.2).

**S12.3 Each service page must open on its own failure mode.** Every offer
carries a `failureMode` of symptom, cost, and why it persists, written in the
buyer's language. Without it the five pages shared one shape — category name
plus feature list — and read as a template rather than five practices.

**S12.4 One featured card per section, at most.** Where a section presents
parallel options, the one the page is actually asking for may carry brand
border, tint, a label and the `.sheen` lit edge; the others stay neutral. Three
identical cards make the ask invisible. This is the CTA hierarchy rule (S3.1)
applied to surfaces.

## 13. Amendments

| Date | Section | Change | Reason |
|---|---|---|---|
| 2026-08-14 | — | Initial lock | End of Wave 2 |
| 2026-08-14/1 | S6.3 | Dropped the required `usePrefersReducedMotion()` hook; the CSS media query in `index.css` is now the sole gate | Removing the ambient effects (S6.2) left no JS-driven decorative motion for a hook to gate. `motion` (Framer) and `canvas-confetti` became entirely unused and were removed from the dependency tree, taking ~26 kB gzip with them. Shipping an unused hook to satisfy the letter of the rule would have been dead code. |
| 2026-08-14/2 | S9.1 | Replaced the "entry chunk ≤ 85 kB gzip" budget with an app-code budget plus a total-initial budget | The 85 kB figure was set before the accessible Radix primitives were costed. Measured floor is React ~61 kB + primitives + app code ≈ 100 kB. Splitting React into its own chunk would have made "entry chunk" read 39 kB while changing nothing a user downloads, so the metric was replaced rather than gamed. |
| 2026-08-14/3 | S9.2 | Diagnostic modal remains lazy; the two interactive tools do not | `renderToString` emits the Suspense fallback rather than the component, so lazy-loading the routing model and effort calculator removed both sections from the prerendered HTML — trading the site's primary SEO fix (S1.1) for ~8 kB. The modal is closed on first paint and absent from initial markup either way, so it stays split. |
| 2026-08-14/4 | S2.1 | Header background is unconditional rather than applied on scroll | The scroll-triggered variant left nav labels illegible over passing content and depended on client state, so it also failed in the window before hydration. |
| 2026-08-14/5 | S3.3 | "Never twice in one viewport" replaced with "at most one primary CTA per section" | Measured: the six primary CTAs sit 909/1966/2067/875/2469px apart, so the routing-model and effort-calculator CTAs fall inside one 900px viewport at a section boundary. Two identical buttons invoking the same action across a boundary is the pattern the reference class uses, not a competing focal point. The original defect — six identical lime pills competing *within* one section — is what the per-section rule actually pins down. |
| 2026-08-14/6 | S7.1 | Focus restoration on dialog close is now explicit (`returnFocusTo` + `onCloseAutoFocus`); the dialog also stays mounted while closed | Closing left keyboard users on `<body>` — a WCAG 2.4.3 failure. Radix does not restore on its own in this configuration: the dialog is controlled and portalled with no `DialogTrigger` to return to. Keeping the subtree mounted was tried first and did **not** fix it; the explicit restore did. Caught by the Playwright suite. An earlier ad-hoc check had given a false pass because it asserted `document.activeElement.textContent.includes(...)`, and `<body>`'s textContent contains the entire page. |
| 2026-08-14/7 | S2.1, S9.6 | Five service offers split onto their own prerendered routes | One URL behind client-side tabs gave nothing to rank per offer (plan finding 5, previously parked). `scripts/prerender.mjs` now emits six documents plus a generated sitemap and a branded 404. Radix `TabsContent` also gained `forceMount`: it mounts only the active panel, so four of the five links through to the new pages were absent from the prerendered HTML and invisible to crawlers. |
| 2026-08-14/8 | S10.2 | A weak diagnostic result no longer headlines the sprint it advised against | Screen-by-screen review found "Probably not yet" sitting directly above "Reconciliation Opportunity Sprint" and a list of what "a sprint would produce" — telling the visitor they likely do not need this, then presenting it as the recommendation. Weak results now read "No sprint recommended yet", carry a neutral rather than brand-coloured score, and frame deliverables conditionally. |
| 2026-08-16/10 | S6.6, S6.7, S11.8 | Motion added back deliberately: scroll-linked reveals, a sequential lifecycle entrance, spring hover, a designed focus halo, one conic CTA trace, and cross-document view transitions | Waves 3–5 stripped motion to nothing because every effect on the old site was ambient decoration bought with a JS animation library. The budget left ~5 kB of JS and ~4.6 kB of CSS headroom, which rules a library out permanently — but CSS scroll-driven animations, `@property`, `linear()` easing and view transitions now cover all of it declaratively, on the compositor, for **+0.57 kB CSS and +0.03 kB JS**. Each effect is tied to something true: entrances follow reading order, the stagger is used only on a genuinely ordered lifecycle, and the one flourish rides the primary CTA tier that S3.1 already caps at one per section. Two hiding failure modes are guarded and tested (S6.6, S11.8). |
| 2026-08-16/11 | §12 (new), §13 | Commercial terms section, per-service failure modes, featured-card hierarchy; the amendment log moved from §12 to §13 to make room | Three parked items landed together. **Pricing:** re-checking the reference class showed none of them publish services pricing either, so the earlier "every reference site names a price" note was wrong and the gap was never the number — it was that "Paid — quoted per scope" appeared with no basis, no commitment and no exit beside it. All three now publish, plus what moves the quote. `SPRINT_FEE_BAND` stays `null` rather than carrying an invented figure. **Copy:** every offer gained a `failureMode`, because the five service pages previously shared one category-plus-features shape and read as a template. **Visual:** the paid sprint — the thing the page actually asks for — now carries brand weight against two neutral siblings. Caught by the existing type-scale test: the first draft of both new surfaces used 10px and 11px labels, which S4.2 bans. |
| 2026-08-14/9 | S1.1 | `404.html` ships without the app bundle | The bundle booted on the 404, found no route for "/404.html", fell back to the home route and rendered the home page over the 404 (React hydration error #418). It is a static page with one link and needs no JavaScript; the stylesheet is retained. |
