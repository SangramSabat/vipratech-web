import { COMPANY_INFO, PLATFORM, SERVICE_OFFERS } from "./data/companyData";

/**
 * The site's routes.
 *
 * Each route is prerendered to its own HTML document sharing one JS bundle, so
 * there is no router library and no client-side navigation: links are plain
 * links and the browser fetches a real page. That is deliberate — five service
 * offers previously shared one URL behind client-side tabs, leaving nothing for
 * a search engine to rank per offer (docs/04-plan.md, finding 5).
 */
export interface Route {
  /** Path as served, always with a trailing slash except the root. */
  path: string;
  title: string;
  description: string;
  /** Present on service routes, absent on every other route. */
  serviceId?: string;
  /** Motion budget tier (spec S6.1-R). Absent means Narrative. */
  motionClass?: "trust" | "narrative" | "showcase";
}

export const HOME_ROUTE: Route = {
  path: "/",
  title: "VipraTech Labs — AI for decisions you have to defend",
  description:
    "VipraTech Labs builds governed AI systems for regulated operations: deterministic rules handle the known cases, AI handles the ambiguous ones, and a human approves anything consequential — with an audit trail behind every decision.",
};

const SERVICE_ROUTES: Route[] = SERVICE_OFFERS.map((service) => ({
  path: `/services/${service.id}/`,
  serviceId: service.id,
  title: `${service.title} — ${COMPANY_INFO.shortName}`,
  description: service.description,
}));

/** The platform arm. Class S — the showcase tier (spec S6.1-R). */
const PLATFORM_ROUTE: Route = {
  path: "/platform/",
  title: `${PLATFORM.name} — the AI software factory | ${COMPANY_INFO.shortName}`,
  description: PLATFORM.lead,
  motionClass: "showcase",
};

export const ROUTES: Route[] = [HOME_ROUTE, PLATFORM_ROUTE, ...SERVICE_ROUTES];

export function servicePath(serviceId: string): string {
  return `/services/${serviceId}/`;
}

/** Normalises a pathname so `/services/x`, `/services/x/` and index.html agree. */
function normalisePath(pathname: string): string {
  const withoutIndex = pathname.replace(/index\.html$/, "");
  if (withoutIndex === "" || withoutIndex === "/") return "/";
  return withoutIndex.endsWith("/") ? withoutIndex : `${withoutIndex}/`;
}

export function routeFor(pathname: string): Route | undefined {
  const target = normalisePath(pathname);
  return ROUTES.find((route) => route.path === target);
}

/** Absolute URL for canonical tags and structured data. */
export function absoluteUrl(routePath: string): string {
  return `${COMPANY_INFO.url}${routePath === "/" ? "/" : routePath}`;
}
