# 01 — Brand Guidelines

> **Position in the lifecycle:** root document. Everything downstream (persona → copy → spec → code) inherits from this file and may not contradict it.

---

## 1. What VipraTech is

VipraTech Labs builds production AI systems for workflows where being wrong is expensive — document reconciliation, AI agent security, regulated voice, revenue operations. The differentiator is not model access; it is **governance**: a deterministic boundary, an explicit human review gate, and a durable evidence trail around every AI decision.

**The one-sentence positioning:**
> Most AI pilots fail in regulated operations because they cannot show their work. VipraTech maps the workflow first, then builds systems where rules handle the known cases, AI handles the ambiguous ones, and a human approves anything consequential — with an audit trail behind every decision.

## 2. Voice

The brand's central claim is **evidence before claims**. That constrains the voice more than a usual brand does — the site cannot make an unbacked assertion without contradicting its own thesis.

| Principle | Meaning | Test |
|---|---|---|
| **Evidence before claims** | Every capability statement carries its evidence level. Nothing is asserted that cannot be shown. | Can we point at the thing? If not, label it as researched/designed, or cut it. |
| **Plain over impressive** | Buyer-legible language. A CFO or risk officer should follow every sentence. | Would this sentence survive being read aloud in a procurement meeting? |
| **Specific over superlative** | Numbers, durations, deliverables. Not "cutting-edge", "revolutionary", "world-class". | Replace the adjective with a number, or delete it. |
| **Boundaries stated upfront** | Say what we will not do and when AI is the wrong answer. | Does the page ever tell the reader "no"? It should. |
| **No manufactured urgency** | No countdowns, no fake scarcity, no "limited slots". | — |

### Jargon stop-list

These appear in the current site and are **retired**. They read as sci-fi cosplay to a finance or risk buyer and directly undercut the audit/compliance seriousness the copy is selling. None of the four reference sites (hyperagent, heizen, factory.ai, 8090) use invented terminology of this kind.

| Retired | Use instead |
|---|---|
| KINETIC SIGNAL MATRIX | *(delete — has no referent)* |
| SIGNAL GRID / Signal Rail | *(delete — internal codename, not a product)* |
| TARGET_LOCK: ACTIVE | *(delete)* |
| Cybernetic / Tactical / Reticle | *(delete)* |
| "De-risk" as a noun-verb everywhere | "diagnostic", "scoping", "feasibility check" |

### Approved vocabulary

`diagnostic` · `fit call` · `scoping` · `workflow mapping` · `deterministic boundary` · `human review gate` · `audit trail` · `evidence level` · `exception handling` · `production` · `sprint` · `governed pipeline`

## 3. Colour

### Locked (do not change without explicit approval)

| Token | Tailwind | Value | Role |
|---|---|---|---|
| **Brand primary** | `lime-400` | `#9ae600` | The single accent. Primary CTA fill, active states, key emphasis. |
| **Ground** | `zinc-950` | `#09090b` | Page background. |
| **Surface** | `zinc-900` | `#18181b` | Cards, panels. |
| **Border** | `zinc-800` | `#27272a` | Hairlines, dividers. |

Lime is used **sparingly and with intent**. It marks the primary action and the single most important signal in a viewport. When lime appears on six elements at once (as it currently does), it stops meaning anything.

### Measured contrast — verified, not assumed

Computed from the Tailwind v4 OKLCH values in the actual build output, converted to linear sRGB and scored against WCAG 2.1.

**On `zinc-950` ground:**

| Foreground | Hex | Ratio | Normal text | Verdict |
|---|---|---|---|---|
| `zinc-100` | `#f4f4f5` | 18.07:1 | AAA | Body copy default |
| `zinc-300` | `#d4d4d8` | 13.45:1 | AAA | Secondary prose |
| `zinc-400` | `#9f9fa9` | 7.56:1 | AAA | Muted labels — **safe** |
| `zinc-500` | `#71717b` | 4.12:1 | **FAIL** | ⛔ Retired for text |
| `zinc-600` | `#52525c` | 2.57:1 | **FAIL** | ⛔ Retired for text |
| `lime-400` | `#9ae600` | 12.95:1 | AAA | Accent text |
| `amber-300` | `#ffd230` | 13.75:1 | AAA | Warning/attention |
| `emerald-400` | `#00d492` | 10.29:1 | AAA | Verified/success |
| `blue-400` | `#51a2ff` | 7.54:1 | AAA | Informational |

Black on `lime-400` = **13.68:1 (AAA)** — the primary CTA is well within spec.

**Rules derived from the measurements:**
1. `zinc-500` and `zinc-600` are **banned as text colours** on any surface. They fail AA at every background in the palette. Currently used in 10 places (`SignalGridPage.tsx:258,265`, `SignalGridEngagement.tsx:66,103`, `DeRiskingCalculator.tsx:98,106`, `RangeControl.tsx:38`, `InteractiveFeasibilitySimulator.tsx:241,259`). Minimum muted text is **`zinc-400`**.
2. `zinc-400` is confirmed safe (7.56:1) and remains the muted-label colour.
3. Tertiary accents (amber / emerald / teal / blue) all clear AAA and are retained, but their use is **semantically constrained** — see §4.

### Tertiary accent semantics

Currently amber, emerald, teal, and blue are used decoratively, which makes colour meaningless as a signal. Each accent now carries exactly one meaning:

| Accent | Means | Used for |
|---|---|---|
| `emerald-400` | **Verified** | `Built/Deployed` evidence tags, passed checks |
| `amber-300` | **Needs a human** | Human review gates, paused states, caution |
| `blue-400` | **Informational** | `Researched/Designed` evidence tags, neutral metadata |
| `teal-300` | *(retired)* | Too close to emerald to carry a distinct meaning |

## 4. Typography

The site currently sets almost all prose in 12px or smaller monospace. Monospace at 12px is hostile to reading, and 21 instances use 9–11px. Corrected scale:

| Role | Family | Size | Weight | Colour |
|---|---|---|---|---|
| H1 | sans | `clamp(2.5rem, 5vw, 4rem)` | 800 | `zinc-100` |
| H2 | sans | `clamp(1.75rem, 3vw, 2.5rem)` | 700 | `zinc-100` |
| H3 | sans | `clamp(1.125rem, 2vw, 1.375rem)` | 600 | `zinc-100` |
| Lead paragraph | sans | `clamp(1.0625rem, 1.5vw, 1.25rem)` | 400 | `zinc-300` |
| Body | sans | `1rem` (16px) | 400 | `zinc-300` |
| Small print | sans | `0.875rem` (14px) | 400 | `zinc-400` |
| Eyebrow / label | **mono** | `0.75rem` (12px) | 700, tracked, uppercase | `lime-400` |
| Data / badge | **mono** | `0.75rem` (12px) | 600 | contextual |

**Rules:**
- **Monospace is for labels, badges, data, and code — never for prose.** Its job is to signal "this is a machine-readable value", which is exactly the brand's territory. Overusing it destroys that signal.
- **Minimum text size anywhere is 12px**, and 12px is reserved for mono labels only. Prose floors at 14px.
- Body copy is **sans**, not mono. This is the single largest readability change in this cycle.

## 5. Motion

### What *cinematic* means here

The aesthetic direction is cinematic while keeping neon lime. Operationally, from the reference class (Factory: "minimal visual clutter"; 8090: "generous whitespace"):

> **Dark ground + generous negative space + one focal element per viewport + gradient/light treatment + restrained, functional motion.**

Cinema controls attention by *removing* things from the frame. The current page runs matrix rain, a scanline grid, twelve floating particles, a rotating crosshair, a sweeping laser, a cursor reticle, a marquee ticker, a live log stream, and a typewriter headline — simultaneously, above the fold. That is the opposite of cinematic; it is noise, and it means the CTA never wins attention.

### Motion budget (enforced)

| Rule | Limit |
|---|---|
| Continuously-animating decorative layers visible at once | **≤ 1** |
| Animation on the LCP element | **Never** |
| Ambient full-viewport effects | **None** |
| `prefers-reduced-motion: reduce` | All decorative motion disabled; functional transitions ≤ 150ms |
| Any animation causing layout shift | **Banned** — transform/opacity only |
| Off-screen or backgrounded animation | Must pause (`IntersectionObserver` + `document.hidden`) |

**Motion is functional, not ambient.** Permitted: tab/panel transitions, accordion expand, hover feedback, scroll-reveal (opacity/transform only), focus rings. Retired: matrix rain canvas, particle field, cursor reticle, marquee ticker, rotating crosshair, sweeping laser, typewriter H1.

### What survives of the terminal identity

The futuristic DNA is retained as **contained accent**, not ambient wash:
- The live-signal log panel stays — reframed as a *product artifact* (a real pipeline view), which is honest and on-message.
- Monospace eyebrows, badges, and data readouts.
- A subtle static gradient/grid treatment on the ground.
- Lime, undiminished, as the single accent.

## 6. Non-negotiables

1. **No fabricated proof.** No invented client logos, testimonials, metrics, or certifications. A site whose thesis is "evidence before claims" cannot fake evidence. Trust sections stay empty until real material exists.
2. **No claim without an evidence level.** Every capability is tagged `Built/Deployed`, `Prototyped`, or `Researched/Designed`.
3. **CTA labels must name the action they perform.** A button reading "Schedule a call" must open scheduling, not a modal.
4. **Interactive tools must be real.** A "diagnostic" that returns the same answer to everyone is a mock, and shipping it contradicts the brand.
