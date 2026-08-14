/**
 * Persona seam — docs/02-personas.md §7.
 *
 * Typed mirror of the persona document. Persona-adaptive content is a
 * separate, deferred decision: nothing here drives rendering or scoring yet.
 * It exists so that when personalization is designed it has a data anchor and
 * does not require a refactor of the copy layer.
 */
import type { PersonaId } from "../types";

export interface Persona {
  id: PersonaId;
  label: string;
  /** Service offers in companyData.ts this persona maps to. */
  serviceIds: string[];
  trigger: string;
  objection: string;
  proofRequired: string;
}

export const PERSONAS: Persona[] = [
  {
    id: "operations-finance",
    label: "Operations & finance",
    serviceIds: ["doc-reconciliation"],
    trigger:
      "A recurring reconciliation gap absorbed by a team doing manual spreadsheet mapping.",
    objection:
      "We tried an OCR/LLM tool. It was 80% right, which is worse than useless — we check all of it anyway.",
    proofRequired: "Explicit exception handling: who reviews the residue, and where it is logged.",
  },
  {
    id: "security-risk",
    label: "Security & risk engineering",
    serviceIds: ["ai-security"],
    trigger: "An agent is about to ship with tool access and someone has to sign off on it.",
    objection: "Generic red-teaming produces findings we cannot reproduce or prioritize.",
    proofRequired: "Reproducible evidence register with test plans and reproduction steps.",
  },
  {
    id: "contact-centre",
    label: "Contact centre & collections",
    serviceIds: ["voice-ai"],
    trigger: "Call volume exceeds headcount while conduct still has to be consistent on every call.",
    objection: "Voice demos work in clean English. Our calls are Hindi-Hinglish on bad lines.",
    proofRequired: "Code-switching, interruption handling, policy guardrails, and operator handoff.",
  },
  {
    id: "product-cto",
    label: "Product & engineering leadership",
    serviceIds: ["product-research", "sales-automation"],
    trigger: "A consequential build-vs-buy decision with no in-house basis for making it.",
    objection: "A consultant will give me a slide deck. I need to know whether the thing works.",
    proofRequired: "A working prototype or a measured evaluation — evidence, not a recommendation.",
  },
];
