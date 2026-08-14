import { Mail, MapPin, Phone } from "lucide-react";
import { COMPANY_INFO, NAV_LINKS } from "../data/companyData";

export function SiteFooter() {
  return (
    <footer className="border-t border-hairline bg-ground py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 md:grid-cols-12 lg:px-8">
        <div className="md:col-span-5">
          <div className="flex items-center gap-2.5">
            <svg viewBox="0 0 64 64" className="size-7" aria-hidden="true">
              <rect width="64" height="64" rx="12" className="fill-surface" />
              <path d="M14 16h10l8 28 8-28h10L38 52H26L14 16Z" className="fill-brand" />
            </svg>
            <span className="text-base font-bold text-ink">{COMPANY_INFO.name}</span>
          </div>
          <p className="measure mt-4 text-sm text-ink-muted">{COMPANY_INFO.subheading}</p>
          <p className="mt-4 text-sm text-ink-subtle">Founder: {COMPANY_INFO.founder}</p>
        </div>

        <nav aria-label="Footer" className="md:col-span-3">
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-ink">
            Sections
          </h2>
          <ul className="mt-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="inline-flex min-h-11 items-center text-sm text-ink-subtle transition-colors hover:text-brand"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-ink">
            Direct contact
          </h2>
          <ul className="mt-4 space-y-1">
            <li>
              <a
                href={`mailto:${COMPANY_INFO.email}`}
                className="inline-flex min-h-11 items-center gap-2.5 text-sm text-ink-subtle transition-colors hover:text-brand"
              >
                <Mail className="size-4 shrink-0 text-brand" aria-hidden="true" />
                {COMPANY_INFO.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${COMPANY_INFO.phone.replace(/\s/g, "")}`}
                className="inline-flex min-h-11 items-center gap-2.5 text-sm text-ink-subtle transition-colors hover:text-brand"
              >
                <Phone className="size-4 shrink-0 text-brand" aria-hidden="true" />
                {COMPANY_INFO.phone}
              </a>
            </li>
            <li className="flex gap-2.5 py-2 text-sm text-ink-subtle">
              <MapPin className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
              <span>{COMPANY_INFO.address}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t border-hairline px-4 pt-8 sm:px-6 lg:px-8">
        <p className="text-sm text-ink-subtle">
          © {new Date().getFullYear()} {COMPANY_INFO.name}. Every capability on this site is
          labelled with what was built, prototyped, or researched.
        </p>
      </div>
    </footer>
  );
}
