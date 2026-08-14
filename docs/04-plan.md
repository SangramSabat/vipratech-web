# VipraTech Marketing Site — Impeccable Wave Plan

> **Status: executed and superseded in places.** This is the plan **as approved at the Wave 1 gate**, kept as the record of what was decided and why. Where implementation contradicted it, the authority is
> [`05-ui-ux-spec.md` §12 Amendments](./05-ui-ux-spec.md#12-amendments) — not this file.
>
> Known divergences: the `usePrefersReducedMotion` hook (amendment 1), the 85 kB entry-chunk budget (amendment 2), lazy-loading the two interactive tools (amendment 3), and the single-`<nav>` rule (Wave 5 verification). Read the amendments before treating anything below as current.

## Context

`vipratech-web` is the public marketing site for VipraTech Labs (applied-AI engineering: document reconciliation, AI agent red-teaming, voice AI, revenue automation, AI product research). It is a single-page React 19 + Vite 6 + Tailwind v4 client-rendered SPA, statically deployed to GitHub Pages, with no backend, no analytics, and no lead database. The conversion terminus is an in-browser "Fit Diagnostic" that ends in a prefilled `mailto:`.

The site currently has **no design documentation of any kind** — no brand guidelines, persona, copy matrix, or spec — so there is nothing for design decisions to trace back to. It also carries real defects in SEO (empty server HTML), LCP (the `<h1>` is a typewriter animation), accessibility (no focus trap, no reduced-motion handling), and conversion (a flat CTA hierarchy and a hardcoded "92% Strong Fit" diagnostic result).

Goal of this cycle: establish the anchor documentation chain, then execute Impeccable Waves 2–5 to refine design, UX, LCP, and SEO — evolving the aesthetic toward **cinematic** while keeping neon lime and the futuristic DNA, and **without breaking existing functionality**.

---

## Phase 0 — Locked Parameters

| # | Parameter | Decision |
|---|---|---|
| 1 | **Aesthetic Directive** | Cinematic/premium, **retaining neon lime (`#a3e635`)** and selected futuristic/terminal motifs. Not a flat/minimal reskin. ✅ Locked |
| 2 | **Anchor Documentation** | Create the full chain in `/docs`: Brand Guidelines → Persona → Copywriting Matrix → Plan → Spec. ✅ Locked |
| 3 | **Architecture Doctrine** | Stay on Vite + React 19 + Tailwind v4 — no framework migration. Add a **build-time prerender step** so `dist/index.html` ships real content HTML, then hydrates (fixes the core SEO gap without an Astro/Next migration). Adopt **shadcn/ui** for interactive primitives. ✅ Locked |
| 4 | **Persona-adaptive content** | **Deferred to a separate discussion.** This cycle builds the *seams* only (see "Persona Seams" below) and ships a single default experience. ✅ Locked (deferred) |
| 5 | **Brand Language Lock** | Primary lime + zinc-950 ground are protected. Tertiary accents (amber/emerald/teal/blue) may be rationalized for contrast. Any change to primary/secondary requires an explicit stop-and-ask. ✅ Locked |

---

## Wave 1 — Lifecycle Traceability & Critique (SME reflection)

### Current architecture map
- `index.html` → `main.tsx` → `App.tsx` (owns diagnostic-modal state) → `SignalGridPage.tsx` (hero + all background FX) → section components.
- Sections in DOM order: sticky marquee ticker → hero (typed `<h1>` + live-log widget) → evidence-levels banner → 5-offer tabs (`SignalGridServices`) → products grid (`SignalGridProducts`) → `InteractiveFeasibilitySimulator` → `DeRiskingCalculator` → `FeasibilityFAQAccordion` → engagement steps + footer (`SignalGridEngagement`).
- Content is **split**: structured copy in `src/data/companyData.ts`; hero copy, ticker, proof metrics, live logs, section subheads and FAQ text are hardcoded in JSX. A Copywriting Matrix cannot be enforced against a split source of truth.

### Findings — SEO
1. **Empty crawlable HTML.** `index.html` ships `<div id="root"></div>`. Non-JS-rendering crawlers (LinkedIn, Slack, Bing, AI crawlers) see nothing. Highest-impact SEO defect.
2. **No OpenGraph / Twitter card tags.** LinkedIn is the primary B2B channel; shared links currently unfurl bare.
3. **No canonical, `robots.txt`, or `sitemap.xml`.**
4. **No JSON-LD.** `Organization`, `Service`, and especially `FAQPage` (the FAQ accordion already exists) are unclaimed rich-result opportunities.
5. **Five distinct service offers share one URL** behind client-side tabs — no ranking surface per offer.
6. **No `<nav>` or `<header>` landmark anywhere**; only one `#services` anchor.

### Findings — LCP / Core Web Vitals
7. **The LCP element is deliberately delayed.** `MatrixTerminalHeadline` types the `<h1>` character-by-character at ~28 ms/char; ~44 chars ≈ **1.2 s of animation after hydration** before the headline is complete — on top of JS download/parse. It also grows line-by-line, risking CLS.
8. **`onMouseMove` on the root element writes React state on every pointer move** (`SignalGridPage.tsx:64`), re-rendering the entire page tree. Severe INP defect.
9. **`MatrixRainCanvas` runs an unconditional `requestAnimationFrame` loop forever**, full-viewport, with no `prefers-reduced-motion`, no visibility/off-screen pause.
10. **Zero code-splitting.** `motion`, `lucide-react`, and `canvas-confetti` are all in the initial bundle. `canvas-confetti` is only used *inside* the modal after a click — pure critical-path waste. Modal (332 LOC), simulator (295 LOC), and calculator load eagerly.
11. Twelve `motion.div` particles seeded with `Math.random()` in `initial`, a 3 s `setInterval` rotating the log list, a sweeping laser, and a rotating crosshair all animate continuously and simultaneously.

### Findings — Accessibility (WCAG)
12. **Modal has no focus trap, no focus restore, no Escape-to-close, no body scroll lock.** Keyboard and screen-reader users get stranded (`FitDiagnosticModal.tsx`).
13. **Tabs are `<button aria-pressed>`**, not `role="tablist"/"tab"/"tabpanel"` with arrow-key roving focus (`SignalGridServices.tsx`, `SignalGridProducts.tsx`).
14. **Zero `prefers-reduced-motion` handling** across the entire codebase, on a page this motion-dense. WCAG 2.3.3 / vestibular risk.
15. **Contrast + size failures.** Extensive `text-zinc-400`/`text-zinc-500` body copy at `text-[9px]`–`text-xs`, much of it monospace prose. Many combinations miss AA 4.5:1 and all are below comfortable reading size.
16. **Tap targets below 44×44** (modal close `p-2` ≈ 36 px, several `text-[10px]` badges).
17. No skip-to-content link; the animated log stream has no `aria-live` semantics.
18. Conflicting utilities on the cursor reticle: `... flex items-center justify-center hidden sm:flex` — `flex` and `hidden` both emitted, resolution left to CSS source order.

### Findings — UX / Conversion (Julian Shapiro lens)
19. **The hero fails the 5-second test.** "Evidence-First Applied-AI Product Engineering" names a *category*, not a value proposition — no what-you-get, for-whom, or why-care.
20. **Flat CTA hierarchy.** Hero, each service tab, simulator, calculator, FAQ, and footer all render the *same* lime pill. Everything is primary, so nothing is.
21. **CTA label breaks its promise.** The footer button reads "Schedule 30-Min Fit Call" but opens the *diagnostic modal*, not a scheduler.
22. **The diagnostic pre-fills the user's answers** — `challenges` defaults to the first two options and `currentWorkaround` is pre-seeded with "Manual spreadsheet mapping and team email chains". Users submit defaults unedited → low-quality lead signal.
23. **🔴 The diagnostic result is hardcoded.** `fitScore: 92`, `fitStatus: "Strong Fit"`, and the entire risk list, architecture, and reasoning are constants in `fitDiagnostic.ts:3` — identical for every visitor regardless of input; only the sprint name and deliverables vary by keyword match. For a company whose stated brand is **"Evidence Before Claims"** and whose ticker literally reads **"NO MOCK CLAIMS"**, the flagship interactive asset is a mock. **This is the most serious traceability break on the site and must be resolved before it can be marketed as a diagnostic.**
24. **`mailto:` is a lossy conversion terminus** at the moment of peak intent — it fails silently on many mobile/webmail setups, with no fallback (copy-to-clipboard, visible address, calendar link).
25. **No third-party trust assets** — no client logos, case studies with numbers, testimonials, or founder credentials. `PROOF_METRICS` are self-referential process claims ("100% Evidence Labeled"), not outcomes. For enterprise finance/risk buyers this is the single largest missing conversion lever.
26. **Competing focal points above the fold**: matrix rain + scanline grid + 12 particles + rotating crosshair + sweeping laser + reticle cursor + marquee ticker + live log stream + typewriter — all at once. This is the opposite of *cinematic*, which depends on controlled focus and negative space.
27. **Invented jargon** ("KINETIC SIGNAL MATRIX", "SIGNAL GRID", "TARGET_LOCK: ACTIVE") reads as sci-fi cosplay to a CFO or risk officer and undercuts the audit/compliance seriousness the copy is selling.
28. Pricing is fully opaque ("Paid (Shared Privately)") for what is otherwise a productized sprint.

---

## Reference Class — hyperagent.com · heizen.work · factory.ai · 8090.ai

Four AI-engineering B2B sites supplied as UX/flow/lingo references. They converge hard, and the convergence validates most of the Wave 1 critique. **Heizen is a near-exact structural analog**: an AI engineering firm selling to operations buyers whose *primary CTA is literally "Book a Diagnostic"* — the same conversion spine VipraTech already has but under-uses.

**A. Headline states an outcome or a sharp claim — never a category.**
- "Every supply chain is unique. Your AI should be too." (Heizen)
- "The AI-native software factory for regulated enterprises." (8090)
- "Agents that ship real, powerful work." (Hyperagent)
- VipraTech's "Evidence-First Applied-AI Product Engineering" is a category label. → Confirms finding 19.

**B. The subheadline carries the mechanism, usually as problem → mechanism.**
Heizen: *"Plug-and-play AI breaks in procurement. Heizen maps your workflows first, then builds custom AI systems that fit your operations."* This is exactly VipraTech's real argument (deterministic-first, workflow-mapped, human-gated) and is currently buried in an abstract subhead. 8090: *"From business intent to production code, with full audit trail."*

**C. Two CTAs, not six.** Heizen: "Book a Diagnostic" / "Book a Strategy Call". 8090: "Try Software Factory for Free" / "Book a 30-minute scoping call". One primary, one lower-commitment secondary — every time. → Confirms findings 20–21. Note 8090's "30-minute scoping call" is the same object as VipraTech's "30-Min Fit Call".

**D. Trust assets sit immediately after the hero, universally.** Section 3 on Factory ("Trusted by leading engineering teams" + logos), section 3 on Heizen (client carousel), section 3 on 8090 (investors, then customer logos, then testimonials). VipraTech has none, anywhere. → Confirms finding 25 *and* fixes its position.

**E. Proof is concrete and numeric.** 8090: "18M+ lines of code analyzed; 15,000+ discrete business rules identified; 25+ years of policy logic documented." Hyperagent shows real artifacts with actual time and cost ("$6.41", 8m). VipraTech's `PROOF_METRICS` are self-referential process claims. → Sharpens finding 25.

**F. An explicit "vs. the naive alternative" section.** Heizen runs two: "Plug & Play AI vs. Heizen" and a traditional-vs-Heizen timeline. 8090 runs "Why 8090". VipraTech's Evidence-Levels banner gestures at this but never names the alternative it beats.

**G. A security/compliance section for regulated buyers.** Heizen dedicates one (SOC 2 Type II, ISO 27001). 8090 leads with "regulated enterprises" and "full audit trail". VipraTech sells to finance, claims, and risk teams and has no such section.

**H. Motion is functional, never ambient.** Across all four, motion means carousels, accordions, tab transitions, and product-demo video. **Not one uses decorative ambient effects** — no matrix rain, particle fields, cursor reticles, or marquee tickers. Factory is described as "minimal visual clutter"; 8090 as "generous whitespace". → Confirms finding 26 and gives *cinematic* an operational definition: **dark ground + generous negative space + one focal element + gradient/light treatment + restrained functional motion.**

**I. Language is plain and buyer-legible.** "Diagnostic", "scoping call", "workflow discovery", "audit trail", "production in weeks", "control plane". Not one invented sci-fi term. → Confirms finding 27; "KINETIC SIGNAL MATRIX" and "TARGET_LOCK: ACTIVE" have no analog in the class.

### Consequent revisions to this plan
1. **Elevate the diagnostic sprint to the spine of the page.** VipraTech's strongest asset — free 30-min fit call → 5–10 day paid diagnostic → production, with 50% fee credit — currently sits in `ENGAGEMENT_STEPS` just above the footer. Heizen leads with it. Move the engagement lifecycle high (directly after hero + trust), and make "Run the Fit Diagnostic" the single primary CTA with "Book a 30-min fit call" as the standing secondary.
2. **Rewrite the hero to the problem → mechanism pattern** in `docs/03-copywriting-matrix.md`, leading with the failure mode VipraTech actually fixes (generic LLM wrappers with no audit trail, no human gate, no deterministic boundary) rather than with the category name.
3. **Add a "Governed pipeline vs. generic LLM wrapper" comparison section** (pattern F) — VipraTech already owns this argument in `fitDiagnostic.ts`'s architecture copy; it just isn't staged as a section.
4. **Add a security & assurance section** (pattern G) built from existing AI-security service content and the human-review/audit-trail material.
5. **Reduce ambient motion to the reference-class norm** (pattern H). Retain lime and the terminal motif as *accent* — mono labels, the log widget as a contained product artifact, subtle gradient/scanline treatment — and remove the full-viewport matrix rain, 12-particle field, cursor reticle, and marquee ticker from the above-fold composition. This is the concrete meaning of "cinematic, keep neon lime".

### ⚠️ Content dependency on you
Patterns D and E require **real** logos, named testimonials, and numeric outcomes. I will not invent them — fabricating proof on a site whose thesis is "Evidence Before Claims" would be self-defeating. Wave 3 will build the slots and populate them with honest available material (founder credentials, the four named systems in `PRODUCTS_SYSTEMS` with their existing evidence tags, engagement terms). Anything stronger — client names, permission to cite, real metrics — needs to come from you, and the sections stay out until it does.

---

## Wave 2 — Anchor Docs + Spec Lock

Create `/docs`, in strict dependency order. Each doc states what it inherits from the one above it.

1. **`docs/01-brand-guidelines.md`** — Voice ("evidence before claims", plain-spoken, no hype), the locked lime/zinc palette with a rationalized tertiary set and measured AA contrast pairs, type scale, motion principles, and the jargon **stop-list** (finding 27, pattern I). Includes the operational definition of *cinematic* from pattern H and a **motion budget** capping ambient effects to the reference-class norm.
2. **`docs/02-personas.md`** — Derived from `targetAudience` fields already in `companyData.ts`: Finance/Claims Ops, Security/Risk Engineering, Contact-Center Ops, Product/CTO. Each with trigger, objection, and proof-required. *Reserved for the deferred personalization discussion; this cycle ships one default.*
3. **`docs/03-copywriting-matrix.md`** — Section-by-section: message, proof, CTA, and the single source-of-truth file for each string. Drives the consolidation of hardcoded JSX copy into `companyData.ts`. Hero follows the **problem → mechanism** pattern (B); CTA labels follow the **one primary + one secondary** rule (C) and must name the action they actually perform (finding 21).
4. **`docs/04-plan.md`** — This wave plan, committed into the repo.
5. **`docs/05-ui-ux-spec.md`** — **The locked Spec.** Every Wave 3–5 change must cite a section of this file. Covers: page/section order, CTA hierarchy tiers, type scale, semantic/landmark structure, motion budget, responsive rules, a11y acceptance criteria, and performance budgets.

**Spec-lock rule:** once `docs/05-ui-ux-spec.md` is written, it is the single source of truth. Changes to it require an explicit note in the file's changelog section, not a silent edit.

---

## Wave 3 — Semantics, SEO & Layout

**Architecture (finding 1):** add a build-time prerender step so `dist/index.html` contains real content HTML that then hydrates — preserving all existing React interactivity. Implement via `vite-react-ssg`, or a post-build `react-dom/server` `renderToString` script if that proves simpler for a single route; evaluate both at implementation time and pick the one that keeps `bun run build` a single command. `main.tsx` switches to `hydrateRoot`.

- **Semantic structure** — add `<header>`, `<nav>` (anchor nav for the section jumps), skip-to-content link, and `<article>` for each service panel. Correct heading order; the `<h1>` becomes static text (see Wave 4 motion fix).
- **Meta & structured data** — OpenGraph + Twitter card tags, canonical, `robots.txt`, `sitemap.xml`, and JSON-LD for `Organization`, `Service` (×5), and `FAQPage` generated from the existing FAQ data.
- **Section order (patterns D, F, G + revision 1)** — restructure to the reference-class flow: hero → trust/proof strip → engagement lifecycle (fit call → diagnostic sprint → production) → 5 offers → governed-pipeline vs. generic-LLM-wrapper comparison → products & evidence levels → simulator/calculator → security & assurance → FAQ → final CTA → footer. This lifts the diagnostic sprint out of the pre-footer slot it currently occupies in `SignalGridEngagement`.
- **Layout / distill (findings 26, 15; pattern H)** — cut competing background layers to a controlled set; establish real negative space around the hero CTA; raise body copy off `text-xs` mono to a readable sans scale per the Spec's type ramp; reserve monospace for labels, badges, and data — not prose.
- **Responsive** — fluid `clamp()`-based type and spacing scale; verify tap targets ≥ 44 px (finding 16); fix the `hidden`/`flex` conflict (finding 18).

**Deferred to a follow-up (logged, not actioned):** splitting the five offers into per-service routes (finding 5). It is the right SEO move but changes site structure beyond this cycle's scope.

---

## Wave 4 — Aesthetics, Motion & Interaction Quality

- **Adopt shadcn/ui primitives** (Radix + Tailwind v4, copied into `src/components/ui/`) for `Dialog`, `Tabs`, `Accordion`, `Slider`, `Select` — resolving findings 12, 13 and the tab semantics correctly rather than hand-rolling. Restyle to the locked brand tokens; this is a *behavioral* adoption, not a visual reskin.
- **Fix the LCP headline (finding 7)** — the `<h1>` renders complete and static in the prerendered HTML. The terminal/typing character is preserved as a *decorative* treatment on a non-LCP element (e.g. an eyebrow or the log widget), so the motif survives without costing LCP or CLS.
- **Fix pointer-driven re-renders (finding 8)** — replace `useState` on `onMouseMove` with a CSS custom property or a motion value written outside React's render cycle.
- **Motion budget (findings 9, 11, 14, 26; pattern H)** — motion becomes functional rather than ambient, matching the reference class. Remove the full-viewport matrix rain, the 12-particle field, the cursor reticle, and the marquee ticker from the above-fold composition; retain the terminal motif as *contained* accent (the live-log widget as a product artifact, mono labels, a subtle gradient/scanline ground). A single `usePrefersReducedMotion` hook gates whatever decorative motion survives; any retained canvas pauses on `document.hidden` and off-screen via `IntersectionObserver`. Simultaneous animated layers capped per the Spec.
- **Typography & color** — semantic Tailwind v4 `@theme` tokens for the palette; *quieter* treatment for prose (larger, higher-contrast, sans); *bolder* treatment reserved for the single primary CTA per viewport.
- **CTA hierarchy (findings 20, 21; pattern C)** — three tiers defined in the Spec: **one** primary lime action per viewport ("Run the Fit Diagnostic"), a standing secondary outline ("Book a 30-min fit call"), and tertiary text links. Every CTA label must match the action it actually performs — resolving the footer button that promises scheduling and opens the diagnostic modal.

---

## Wave 5 — Conversion Integrity & Production Polish

- **🔴 Resolve the hardcoded diagnostic (finding 23)** — make `analyzeFitDiagnostic` genuinely responsive to input (score and risks derived from the selected challenges, timeline, and team size), **and** label the output honestly as a self-assessment rather than a verified finding. Extend `fitDiagnostic.test.ts` to assert that different inputs produce different outputs. Non-negotiable: the brand claim "no mock claims" cannot survive a mocked flagship feature.
- **Remove pre-filled answers (finding 22)** — start `challenges` empty and `currentWorkaround` blank with the existing placeholder; disable the submit button until the user has made a real selection.
- **Harden the conversion terminus (finding 24)** — keep `mailto:` as primary, add a visible email address and a copy-to-clipboard fallback for the generated summary.
- **Performance (finding 10)** — `React.lazy` for the modal, simulator, and calculator; dynamic `import()` for `canvas-confetti` at call time; `manualChunks` for vendor splitting; per-icon `lucide-react` imports verified tree-shaken; explicit bundle budget recorded in the Spec.
- **Polish** — final alignment/spacing pass against the Spec; confirm `bun run knip` stays clean after the lazy-loading refactor.

**Parking lot (logged, not built this cycle):** per-service routes; pricing transparency (finding 28); persona-adaptive content.

**Blocked on your input (slots built, content pending):** client logos, named testimonials, case-study metrics, and formal compliance certifications (findings 25; patterns D, E, G). See the content-dependency note in the Reference Class section.

---

## Persona Seams (build now, activate later)

Enough structure that the deferred personalization discussion doesn't require a refactor:
- A `Persona` type and the persona definitions live in `docs/02-personas.md` and a matching `src/data/personas.ts`.
- Copy in `companyData.ts` is keyed so persona-specific variants can be added as an optional field without changing consumers.
- `FitDiagnosticInput` carries an optional `persona` field, unused in scoring for now but threaded through to the email summary builder.
- No picker UI, no routing variants, no behavior change ships this cycle.

---

## Drift & Overthinking Guards

- **Single source of truth** — after Wave 2, every change cites the `docs/05-ui-ux-spec.md` section it satisfies. A decision the Spec doesn't cover is a flag-and-ask, not an invention.
- **No silent re-litigation** — locked Phase 0 parameters and gate answers are not reopened. New information surfaces as a flagged recommendation.
- **Bounded alternatives** — at most 2–3 options per decision; pick the one best satisfying the Spec and move.
- **Definition of done per wave** — stated up front; once met, advance. No open-ended polishing.
- **Scope lock** — waves implement the Spec, not adjacent improvements. Out-of-scope ideas go to the Parking Lot.
- **Brand guardrail** — no change to primary lime or the zinc ground without an explicit stop-and-ask.
- **Recheck cadence** — re-read the Spec and this plan's locked decisions before starting each wave.

---

## Verification

Run after each wave; all must stay green (these are the same gates `.github/workflows/pages.yml` enforces):

```bash
bun run typecheck && bun run knip && bun run test && bun run build
bun run preview   # manual pass
```

Additional checks:
- **Prerender proof** — `grep -c "Evidence" dist/index.html` returns > 0, confirming real content ships in the HTML rather than an empty root div.
- **Diagnostic integrity** — extended `src/diagnostic/fitDiagnostic.test.ts` asserts distinct inputs yield distinct `fitScore`/risk output.
- **A11y manual pass** — keyboard-only traversal of the modal (open → trap → Escape → focus restored) and the service tabs (arrow-key roving focus); verify with reduced-motion enabled at the OS level.
- **Performance** — Lighthouse on `bun run preview` against the Spec's budgets; confirm the LCP element is the static `<h1>` and no longer animation-gated.
- **Responsive** — 360 px, 768 px, 1280 px, 1920 px; confirm tap targets ≥ 44 px.

Work lands on `claude/marketing-website-waves-xq9sep`, committed per wave. No PR unless requested.
