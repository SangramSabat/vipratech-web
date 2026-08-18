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
  /**
   * The readiness threshold — when this stops being worth building.
   *
   * docs/06 §11 states one only for consumer brands. The other four are
   * written here in the same voice and are **our judgement, not a measured
   * finding**, which is why each says so. They exist because the site's whole
   * posture is that it will tell you when the answer is no (S10.4), and a
   * qualification threshold is the cheapest way to do that — it lets a reader
   * disqualify themselves in one line instead of a sales call.
   */
  signal: string;
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
    signal:
      "Our rule of thumb, not a measured finding: below roughly 500 documents a month, a well-drilled manual process is usually cheaper than any system you would buy or build. The case changes when a second person starts re-checking the first one's work, because that is the point where the cost is the review loop rather than the extraction.",
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
    signal:
      "Our rule of thumb, not a measured finding: under about 200 calls a day, hiring is usually simpler than automating. What changes the maths is not volume alone but conduct — if every call has to stay inside a policy and prove it did, consistency stops being a headcount problem.",
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
    signal:
      "Our rule of thumb, not a measured finding: if a prototype has survived more than 3 months without reaching production, the blocker is rarely the model. It is usually malformed input, multi-party data, or the absence of anyone who can approve a release.",
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
    signal:
      "Our rule of thumb, not a measured finding: the moment an agent gets tool access and a write path, it needs a test someone can re-run after every fix. Before that, threat modelling on 1 page is enough. After it, an opinion with formatting is not evidence.",
  },
];
