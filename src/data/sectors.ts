import type { PersonaId } from "../types";

/**
 * Sectors — docs/06 §11, verbatim.
 *
 * These are the SEO surface (docs/07 §7): a buyer searching for their own
 * industry lands here rather than on a generic services page. Each sector maps
 * to the persona whose situation it describes, so the pair reinforce rather
 * than duplicate — the persona page argues, the sector page enumerates.
 *
 * `builds` is a real capability list, not a feature grid. Every line is
 * something the practices on this site already cover; nothing was added to make
 * a column look full.
 */
export interface Sector {
  slug: string;
  label: string;
  personaId: PersonaId;
  headline: string;
  lead: string;
  builds: string[];
  /** The readiness signal, where one is stated in §11. */
  signal?: string;
}

export const SECTORS: Sector[] = [
  {
    slug: "consumer-brands",
    label: "Consumer brands",
    personaId: "consumer-brand",
    headline: "Distribution grew. The systems did not.",
    lead: "Tally, FieldAssist, WhatsApp, a shared sheet, and what the team remembers. Every new distributor makes the gaps wider.",
    builds: [
      "Distributor management automation",
      "Trade spend reconciliation",
      "Retailer scheme management",
      "Secondary sales visibility",
      "Fraud and duplicate detection",
      "Demand sensing",
      "Territory and outlet analytics",
      "FieldAssist, Tally and ERP integration",
    ],
    signal:
      "Past 60 distributors or 25,000 outlets, claims reconciliation is almost always still manual. If that is you, the first system pays for itself in the leaks it closes.",
  },
  {
    slug: "financial-operations",
    label: "Financial operations",
    personaId: "operations-finance",
    headline: "Reconciliation that arrives with its evidence.",
    lead: "Explicit rules settle the clear cases, AI handles only genuine ambiguity, and anything consequential stops at a reviewer with the source documents on the same screen.",
    builds: [
      "Document intelligence and extraction",
      "Deterministic matching rules",
      "Exception dashboards for reviewers",
      "Audit-ready traceability",
      "Settlement and credit-note workflow",
      "Data architecture and observability",
    ],
  },
  {
    slug: "customer-contact",
    label: "Customer contact",
    personaId: "contact-centre",
    headline: "Consistent conduct at volume.",
    lead: "The exception states are designed before the voice layer, because that is where regulated contact actually fails.",
    builds: [
      "Hindi/Hinglish voice systems",
      "WhatsApp and call contact-centre AI",
      "Policy guardrail enforcement",
      "Interruption, retry and escalation logic",
      "Operator handoff",
      "Collections workflow",
    ],
  },
  {
    slug: "ai-product-teams",
    label: "AI product teams",
    personaId: "product-cto",
    headline: "From prototype to production, once.",
    lead: "The prototype was right about the idea. Production is a different problem, and it is the one we take on.",
    builds: [
      "POC to production hardening",
      "Agentic workflow automation",
      "Standalone agents, services and APIs",
      "Evaluation harnesses",
      "Data architecture and observability",
      "AI SDLC enablement on Foundry",
    ],
  },
  {
    slug: "ai-risk",
    label: "AI risk & assurance",
    personaId: "security-risk",
    headline: "Evidence your auditor can retest.",
    lead: "Findings you cannot reproduce after a fix are not evidence. Everything here is built to be re-run.",
    builds: [
      "Agent threat modelling",
      "Multi-turn adversarial campaigns",
      "Tool-use and authorization boundary testing",
      "LLM security and guardrails",
      "Evidence registers",
      "Remediation and verification roadmaps",
    ],
  },
];
