import { ChevronDown } from "lucide-react";
import { CTA, COMPANY_INFO, NAV_LINKS } from "../data/companyData";
import { Button } from "./ui/Button";

/**
 * Sticky header and anchor navigation (spec S2.1, S2.2).
 *
 * The page previously had no <header> or <nav> landmark at all — the only
 * navigational affordance was a single `#services` link, and the sticky slot
 * was occupied by the marquee ticker (now retired, S6.2).
 *
 * The background is unconditional rather than applied once a scroll listener
 * fires: a transparent bar over scrolling content leaves the nav labels
 * illegible against whatever passes beneath, and tying that to client state
 * means it also breaks in the window before hydration.
 */
export function SiteHeader() {
  return (
    <header
      className="sticky top-0 z-40 border-b border-hairline bg-ground/85 backdrop-blur-md"
      // Pins the header across a cross-document navigation (S6.7) so it stays
      // put while the page beneath it resolves. The name must be unique per
      // document, and this header renders exactly once.
      style={{ viewTransitionName: "site-header" }}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 sm:gap-6 sm:px-6 lg:px-8">
        <a
          href="#top"
          className="flex min-h-11 shrink-0 items-center gap-2.5 pr-2"
        >
          <svg viewBox="0 0 64 64" className="size-7" aria-hidden="true">
            <rect width="64" height="64" rx="12" className="fill-surface" />
            <path
              d="M14 16h10l8 28 8-28h10L38 52H26L14 16Z"
              className="fill-brand"
            />
          </svg>
          {/* The wordmark is dropped under sm so the header fits logo + Menu +
              CTA on a 390px screen without any of them wrapping. Adding the
              mobile Menu squeezed the CTA into four lines; hiding the wordmark
              buys ~110px and is the cheapest thing on the row to lose, since
              the mark still identifies the site and the name is in <title>,
              the footer and the skip link target. */}
          <span className="hidden text-sm font-bold tracking-tight text-ink sm:inline">
            {COMPANY_INFO.shortName}
          </span>
          <span className="sr-only">{COMPANY_INFO.shortName}</span>
        </a>

        {/*
          One <nav> for both layouts, so there is exactly one "Primary"
          landmark (S2.2) rather than two competing for the same label.

          Below lg the list moves into a <details> disclosure. That is
          deliberate: the previous header hid the nav entirely at `hidden
          lg:block` with nothing in its place, so every visitor on a phone or
          tablet — under 1024px, which is most of them — had no way to reach any
          section, any service page, or /platform. Found by rendering the site
          at 390px; no gate saw it, because no test looked at the header below
          the lg breakpoint.

          <details> is used rather than a JS menu because it needs no state, no
          hydration and no bundle: it is keyboard-operable, screen-reader
          announced and Escape-dismissible natively. Trust-class routes are
          meant to reach 0 kB of JS (docs/07 §8), and a navigation menu is the
          last thing that should stand in the way of that.
        */}
        <nav aria-label="Primary" className="flex-1">
          <details className="group relative lg:hidden">
            <summary className="flex min-h-11 w-fit cursor-pointer list-none items-center gap-2 rounded-lg px-3 text-sm font-medium text-ink-subtle transition-colors duration-(--dur-ui-fast) ease-(--ease-ui) hover:bg-white/8 hover:text-ink [&::-webkit-details-marker]:hidden">
              Menu
              <ChevronDown
                className="size-4 transition-transform duration-(--dur-ui-fast) group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <ul className="absolute left-0 top-full z-50 mt-2 w-56 rounded-xl border border-hairline bg-surface p-1.5 shadow-2xl">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-ink-subtle transition-colors duration-(--dur-ui-fast) ease-(--ease-ui) hover:bg-white/8 hover:text-ink"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </details>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  // Nav hover measured off linear.app with a real cursor: the
                  // subtle text tier lifts to primary *and* a 8% white plate
                  // appears, at the 100ms tier. The plate is what turns a bare
                  // text link into a target — it shows the hit area, which is
                  // otherwise invisible until you click (design-recon S3.6).
                  className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-ink-subtle transition-colors duration-(--dur-ui-fast) ease-(--ease-ui) hover:bg-white/8 hover:text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <Button
          as="a"
          href={`mailto:${COMPANY_INFO.email}?subject=${encodeURIComponent("30-minute fit call")}`}
          variant="secondary"
          className="ml-auto shrink-0 whitespace-nowrap lg:ml-0"
        >
          {CTA.secondary}
        </Button>
      </div>
    </header>
  );
}
