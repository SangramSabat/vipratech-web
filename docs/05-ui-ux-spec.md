# 05 — UI/UX Specification  🔒 LOCKED

> **Inherits from:** `01-brand-guidelines.md` → `02-personas.md` → `03-copywriting-matrix.md` → `04-plan.md`.
>
> **Status: LOCKED.** This is the single source of truth for implementation. Every change in Waves 3–5 must cite a section of this file. A decision this Spec does not cover is a flag-and-ask, not an invention. Amendments go in §10 with a dated entry — never a silent edit.

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

**S2.2** Landmarks: exactly one `<header>`, one `<nav>`, one `<main id="main">`, one `<footer>`. Each numbered section is a `<section>` with `aria-labelledby` pointing at its heading id.
**S2.3** Heading order: one `<h1>` (hero only). Each section opens with `<h2>`. No level skipped. Card titles are `<h3>`.
**S2.4** Each of the five service panels is an `<article>`.

## 3. CTA hierarchy

**S3.1** Exactly **three tiers**, and **at most one primary visible per viewport**:

| Tier | Style | Label | Action |
|---|---|---|---|
| Primary | Solid `lime-400`, black text, ≥48px tall | `Run the fit diagnostic` | Opens diagnostic modal |
| Secondary | Outline, `zinc-700` border, `zinc-100` text | `Book a 30-min fit call` | Direct `mailto:` |
| Tertiary | Text link, `lime-400`, underline on hover | contextual | in-page anchor |

**S3.2** **Every CTA label must name the action it performs.** A label saying "schedule" must open scheduling.
**S3.3** Primary CTA appears in: hero, engagement lifecycle, simulator, calculator, final CTA. Never twice in one viewport.
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
**S6.3** A single `usePrefersReducedMotion()` hook gates all decorative motion. Under `reduce`: decorative motion off, functional transitions ≤ 150ms.
**S6.4** No React state may be written from a pointer-move handler. Pointer-driven visuals use a CSS custom property written outside the render cycle.
**S6.5** Any retained canvas pauses via `IntersectionObserver` and `document.hidden`.

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

**S9.1** Bundle — measured against the current baseline of **408.76 kB / 126.54 kB gzip in a single chunk**:

| Metric | Budget |
|---|---|
| Initial JS (gzip), entry chunk | **≤ 85 kB** |
| Total JS (gzip), all chunks | ≤ 140 kB |
| CSS (gzip) | ≤ 12 kB |

**S9.2** Code-splitting required: `React.lazy` for the diagnostic modal, simulator, and calculator; dynamic `import()` for `canvas-confetti` at call time (never in the entry chunk); `manualChunks` splitting `react`/`react-dom` from feature code.
**S9.3** Core Web Vitals targets: **LCP ≤ 2.0s**, **CLS ≤ 0.05**, **INP ≤ 200ms** (throttled Lighthouse against `bun run preview`).
**S9.4** The LCP element is the **static hero `<h1>`**, present in prerendered HTML and never animation-gated.
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

Run after every wave — the same gates `.github/workflows/pages.yml` enforces:

```bash
bun run typecheck && bun run knip && bun run test && bun run build
```

**S11.1** Prerender: `grep -c "AI for decisions you have to defend" dist/index.html` ≥ 1.
**S11.2** Diagnostic integrity: `fitDiagnostic.test.ts` asserts two materially different inputs yield different `fitScore` **and** different `keyRisksIdentified`.
**S11.3** Banned tokens absent: `grep -rn "text-zinc-500\|text-zinc-600\|text-\[9px\]\|text-\[10px\]\|text-\[11px\]" src/` returns nothing.
**S11.4** Stop-list absent: `grep -rni "kinetic\|signal matrix\|target_lock\|reticle\|cybernetic" src/` returns nothing.
**S11.5** Bundle within S9.1 — checked against `vite build` output.
**S11.6** Manual a11y: keyboard-only modal cycle (open → trap → Escape → focus restored), tab arrow-key navigation, and a full pass with OS reduced-motion enabled.
**S11.7** Responsive pass at 360 / 768 / 1280 / 1920 with no horizontal scroll.

## 12. Amendments

| Date | Section | Change | Reason |
|---|---|---|---|
| 2026-08-14 | — | Initial lock | End of Wave 2 |
