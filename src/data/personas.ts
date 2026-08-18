/**
 * Personas — docs/02-personas.md §7, extended by docs/06 §5.
 *
 * No longer a seam: these now drive the `/for/<persona>` routes and the gate.
 *
 * Reconciling two documents. `02` defined four personas with vetted triggers,
 * objections and proof requirements, each mapped to real service offers. `06`
 * §5 defined five, adding **scaling consumer brand** as the default — the one
 * the flagship reconciliation work actually speaks to. The four from `02` are
 * kept verbatim rather than rewritten to `06`'s labels, because their content
 * is specific and already reviewed; the fifth is added from `06`.
 *
 * `hero` and `problem` are ship-ready customer-facing copy from `06` §5.
 * Deliberately unattributed: the figures (100+ distributors, 1 lakh+ outlets)
 * are already published on the home page, while `06`'s SB7 notes name the
 * client — that naming stays out until written permission exists
 * (01-brand-guidelines §6).
 */
import type { PersonaId } from "../types";

export interface Persona {
  id: PersonaId;
  label: string;
  /** Service offers in companyData.ts this persona maps to. */
  serviceIds: string[];
  /** Route slug — `/for/<slug>/`. */
  slug: string;
  /** One-line answer to "is this me?", used on the gate control. */
  audience: string;
  /** Ship-ready hero headline (docs/06 §5). */
  hero: string;
  /** Ship-ready hero body (docs/06 §5). */
  problem: string;
  /** SB7 guide-empathy line — names the failed prior attempt (docs/06 §5). */
  empathy: string;
  /** SB7 plan — the three steps, in order. */
  plan: string[];
  /** SB7 stakes. Both are stated; naming only the upside is advertising. */
  failure: string;
  success: string;
  trigger: string;
  objection: string;
  proofRequired: string;
}

export const PERSONAS: Persona[] = [
  {
    id: "consumer-brand",
    label: "Consumer brands",
    slug: "consumer-brands",
    audience: "D2C, FMCG or retail, past 60 distributors",
    serviceIds: ["doc-reconciliation", "sales-automation"],
    trigger:
      "Distribution has outgrown the systems. Claims, trade spend and secondary sales are reconciled by hand.",
    objection:
      "We have looked at reconciliation tools. They handle the clean cases, which were never the problem.",
    proofRequired:
      "A system running at real distributor and outlet counts, with the exception path shown.",
    empathy:
      "You hired for growth — sales, distribution, production. Tech got deferred. That was the right call at the time, and it is why the data is now in five places.",
    plan: ["Fit call", "Diagnostic sprint", "First system live"],
    failure:
      "Distributor count keeps climbing, headcount climbs with it, and the leak stays invisible.",
    success:
      "Claims settle in minutes, bad claims are flagged before payment, and distribution scales without the ops team scaling with it.",
    hero: "Your distributor claims are being settled by hand. That is where the margin goes.",
    problem:
      "We build the systems that read the bills, apply your scheme and margin logic, flag the duplicates and rate mismatches, and route only real exceptions to a person. Live in weeks — most recently across 100+ distributors and 1 lakh+ outlets.",
  },
  {
    id: "operations-finance",
    label: "Finance & claims",
    slug: "finance-operations",
    audience: "Finance or claims operations, signing off on numbers",
    hero: "Every number you sign off should arrive with its evidence attached.",
    problem:
      "We build reconciliation systems where explicit rules settle the clear cases, AI handles only genuine ambiguity, and anything consequential stops at a reviewer — with the source documents on the same screen.",
    serviceIds: ["doc-reconciliation"],
    trigger:
      "A recurring reconciliation gap absorbed by a team doing manual spreadsheet mapping.",
    objection:
      "We tried an OCR/LLM tool. It was 80% right, which is worse than useless — we check all of it anyway.",
    proofRequired:
      "Explicit exception handling: who reviews the residue, and where it is logged.",
    empathy:
      "The last tool got it roughly right, which meant your team still checked everything. It added a step instead of removing one.",
    plan: ["Fit call", "Diagnostic sprint", "Pilot on last month's real data"],
    failure:
      "Volume grows, the exception queue grows faster, and the month closes later every quarter.",
    success:
      "Every settled item carries its evidence, exceptions are a short queue, and close is predictable.",
  },
  {
    id: "security-risk",
    label: "Risk & assurance",
    slug: "risk-assurance",
    audience: "Security, risk or assurance, asked to approve an agent",
    hero: "You are being asked to sign off on an agent you cannot reproduce a test against.",
    problem:
      "We run multi-turn adversarial campaigns against tool-use and authorization boundaries, and hand back a durable evidence register — findings ranked, reproduction steps attached, retestable after every fix.",
    serviceIds: ["ai-security"],
    trigger:
      "An agent is about to ship with tool access and someone has to sign off on it.",
    objection:
      "Generic red-teaming produces findings we cannot reproduce or prioritize.",
    proofRequired:
      "Reproducible evidence register with test plans and reproduction steps.",
    empathy:
      "Generic red-teaming gave you findings you could not reproduce after a fix. That is not evidence, it is an opinion with formatting.",
    plan: ["Fit call", "Security assessment", "Prioritised remediation"],
    failure:
      "The agent ships on instinct, and the first incident is the first real test.",
    success:
      "A reproducible evidence register, ranked findings, and a retest path after every fix.",
  },
  {
    id: "contact-centre",
    label: "Customer operations",
    slug: "customer-operations",
    audience: "Contact centre or collections at volume",
    hero: "Your call volume outgrew your headcount. Your conduct requirements did not move.",
    problem:
      "We design the exception states before the voice layer: Hinglish code-switching, interruption and retry handling, policy guardrails, and a clean handoff to an operator the moment a call needs one.",
    serviceIds: ["voice-ai"],
    trigger:
      "Call volume exceeds headcount while conduct still has to be consistent on every call.",
    objection:
      "Voice demos work in clean English. Our calls are Hindi-Hinglish on bad lines.",
    proofRequired:
      "Code-switching, interruption handling, policy guardrails, and operator handoff.",
    empathy:
      "Every voice demo works. Yours are Hindi-Hinglish, interrupted, and on bad lines.",
    plan: [
      "Fit call",
      "Feasibility sprint measured on real line conditions",
      "Rollout",
    ],
    failure: "Coverage gaps become compliance exposure.",
    success:
      "Consistent conduct on every call, with humans on the calls that need them.",
  },
  {
    id: "product-cto",
    label: "Engineering leadership",
    slug: "engineering",
    audience: "Product or engineering leadership, past the prototype",
    hero: "Your prototype proved the idea. It was never built to survive production.",
    problem:
      "Foundry is our AI software factory: agents draft and test, engineers hold the approval gates, and every artifact ships with its provenance. We use it on our own production builds — and on yours.",
    serviceIds: ["product-research", "sales-automation"],
    trigger:
      "A consequential build-vs-buy decision with no in-house basis for making it.",
    objection:
      "A consultant will give me a slide deck. I need to know whether the thing works.",
    proofRequired:
      "A working prototype or a measured evaluation — evidence, not a recommendation.",
    empathy:
      "The prototype was right about the idea. It was never built to survive malformed input, multi-party financial data, or an auditor.",
    plan: ["Fit call", "Diagnostic sprint", "First production increment"],
    failure: "The POC quietly dies, and the next one starts from zero.",
    success:
      "A production system, owned by the in-house team, with the factory available for the next one.",
  },
];

/** The gate's default when no explicit signal exists (docs/07 §5). */
export const DEFAULT_PERSONA: PersonaId = "consumer-brand";

export function personaBySlug(slug: string): Persona | undefined {
  return PERSONAS.find((persona) => persona.slug === slug);
}
