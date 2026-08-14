# VipraTech Applied-AI Engineering

The public VipraTech website: a React + Vite application that is **prerendered at build time**, so `dist/index.html` ships real content HTML and the client hydrates it. There is no backend, no API keys, no analytics, and no lead database — the fit diagnostic runs entirely in the browser and the contact handoff opens a prefilled email.

## Design documentation

Design decisions follow a traceable lifecycle in [`docs/`](./docs). Read them in order; each inherits from the one above it.

| # | Document |
|---|---|
| 01 | [Brand guidelines](./docs/01-brand-guidelines.md) |
| 02 | [Personas](./docs/02-personas.md) |
| 03 | [Copywriting matrix](./docs/03-copywriting-matrix.md) |
| 04 | [Wave plan](./docs/04-plan.md) |
| 05 | [UI/UX spec](./docs/05-ui-ux-spec.md) — 🔒 locked |

**Two rules matter most when changing this site:**

1. **Cite the spec.** Implementation changes reference the `docs/05-ui-ux-spec.md` section they satisfy. Spec changes get a dated entry in its §12 — never a silent edit.
2. **Evidence before claims.** No fabricated logos, testimonials, metrics, or certifications, and no interactive tool that presents invented numbers as measurement. This is the site's stated thesis; the code has to hold to it.

User-facing copy lives in `src/data/companyData.ts`, not in JSX, so it stays checkable against the copywriting matrix.

## Local development

Install [Bun](https://bun.sh/), then run:

```bash
bun install --frozen-lockfile
bun run dev
```

Vite prints the local preview URL.

## Verification

One command runs everything CI runs:

```bash
bun run verify
```

That chains: `typecheck` → `knip` → unit tests → `build` → bundle budgets → end-to-end tests.

Individually:

```bash
bun run typecheck      # tsc
bun run knip           # unused code and dependencies
bun run test           # vitest, unit only (src/)
bun run build          # client build + SSR build + prerender injection
bun run check:bundle   # bundle budgets from docs/05-ui-ux-spec.md S9.1
bun run test:e2e       # playwright, against the built artifact
```

`bun run build` runs three steps: the client build, an SSR build into `.ssr/`, and
`scripts/prerender.mjs`, which injects the rendered markup into `dist/index.html`
and deletes `.ssr/`. To inspect the result locally:

```bash
bun run preview
```

### End-to-end tests

`e2e/` verifies the things that only exist in a real browser against a real build:
prerendered HTML (fetched with JavaScript disabled), hydration without console
errors, the accessibility tree, contrast, motion budget, responsive behaviour at
four widths, Core Web Vitals, and the diagnostic's integrity requirements.

**Accessibility assertions read the CDP accessibility tree, not the DOM.** This is
deliberate. A DOM-based check reported every control as named because it searched
ancestors for `aria-label` — assistive technology does not do that — and it hid
five sliders whose accessible name was empty. Assert against what a screen reader
actually consumes.

The Playwright config prefers a preinstalled Chromium at `/opt/pw-browsers/chromium`
when present, and otherwise uses the browser from `playwright install`.

## GitHub Pages

The Pages workflow validates pull requests and pushes to `main`. Only a push to `main` uploads `dist/` and runs the deployment job. Before merging the first deployment commit, configure **Settings → Pages → Build and deployment → Source** as **GitHub Actions**. The existing `vipratech.in` custom-domain setting and DNS remain managed in the repository settings.
