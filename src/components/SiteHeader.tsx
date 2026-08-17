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
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3 sm:px-6 lg:px-8">
        <a href="#top" className="flex min-h-11 shrink-0 items-center gap-2.5 pr-2">
          <svg viewBox="0 0 64 64" className="size-7" aria-hidden="true">
            <rect width="64" height="64" rx="12" className="fill-surface" />
            <path d="M14 16h10l8 28 8-28h10L38 52H26L14 16Z" className="fill-brand" />
          </svg>
          <span className="text-sm font-bold tracking-tight text-ink">
            {COMPANY_INFO.shortName}
          </span>
        </a>

        <nav aria-label="Primary" className="hidden flex-1 lg:block">
          <ul className="flex items-center gap-1">
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
          className="ml-auto lg:ml-0"
        >
          {CTA.secondary}
        </Button>
      </div>
    </header>
  );
}
