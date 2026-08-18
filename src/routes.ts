import { CASE_STUDY, COMPANY_INFO, PLATFORM, SERVICE_OFFERS } from "./data/companyData";
import { PERSONAS } from "./data/personas";
import { SECTORS } from "./data/sectors";

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
  /** Present on `/for/*` routes (docs/07 §5). */
  personaId?: string;
  /** Present on `/sectors/*` routes (docs/07 §7). */
  sectorSlug?: string;
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

/**
 * The gate's destinations (docs/07 §5). Each persona is a real prerendered
 * document rather than a client-side variant of the home page, so a shared link
 * lands on it and a crawler can index it.
 */
const PERSONA_ROUTES: Route[] = PERSONAS.map((persona) => ({
  path: `/for/${persona.slug}/`,
  personaId: persona.id,
  title: `${persona.label} — ${COMPANY_INFO.shortName}`,
  description: persona.problem,
  motionClass: "narrative",
}));

/** Engagement models and commercial terms. Class T — no decorative motion. */
const ENGAGE_ROUTE: Route = {
  path: "/engage/",
  title: `How to engage — ${COMPANY_INFO.shortName}`,
  description:
    "Three stages, each with a fixed scope and a stated exit. Stop after any one and keep everything produced up to that point.",
  motionClass: "trust",
};

/** The SEO surface — one document per sector (docs/07 §7). */
const SECTOR_ROUTES: Route[] = SECTORS.map((sector) => ({
  path: `/sectors/${sector.slug}/`,
  sectorSlug: sector.slug,
  title: `${sector.label} — ${COMPANY_INFO.shortName}`,
  description: sector.lead,
  motionClass: "narrative",
}));

/** The evidence ladder and the systems on it (docs/07 §7). */
const PRODUCTS_ROUTE: Route = {
  path: "/products/",
  title: `Systems and evidence levels — ${COMPANY_INFO.shortName}`,
  description:
    "Three evidence labels, used everywhere and never softened, and which systems currently hold each one.",
  motionClass: "narrative",
};

/** The flagship case study, unattributed pending naming permission. Class T. */
const CASE_STUDY_ROUTE: Route = {
  path: `/work/${CASE_STUDY.slug}/`,
  title: `${CASE_STUDY.headline} — ${COMPANY_INFO.shortName}`,
  description: CASE_STUDY.situation.slice(0, 155),
  motionClass: "trust",
};

export const ROUTES: Route[] = [
  HOME_ROUTE,
  PLATFORM_ROUTE,
  ENGAGE_ROUTE,
  PRODUCTS_ROUTE,
  CASE_STUDY_ROUTE,
  ...PERSONA_ROUTES,
  ...SECTOR_ROUTES,
  ...SERVICE_ROUTES,
];

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
