export type EvidenceLevel = "Built/Deployed" | "Prototyped" | "Researched/Designed";

/** Semantic accent roles — one meaning each (docs/05-ui-ux-spec.md S5.3). */
export type Tone = "verified" | "attention" | "info";

export interface DiagnosticTriggerProps {
  onOpenDiagnostic: (workflow?: string) => void;
}

export interface NavLink {
  href: string;
  label: string;
}

export interface SectionIntro {
  eyebrow: string;
  heading: string;
  subhead: string;
}

export interface ProofMetric {
  value: string;
  label: string;
}

export interface PipelineStep {
  id: string;
  stage: string;
  text: string;
  status: string;
  tone: Tone;
}

export interface ComparisonRow {
  generic: string;
  governed: string;
}

export interface AssurancePoint {
  id: string;
  title: string;
  description: string;
}

export interface EngagementStep {
  step: string;
  title: string;
  duration: string;
  cost: string;
  description: string;
}

export interface EvidenceLevelNote {
  level: EvidenceLevel;
  desc: string;
  tone: Tone;
}

export interface FaqEntry {
  q: string;
  a: string;
}

export interface ServiceOffer {
  id: string;
  title: string;
  diagnosticLabel: string;
  description: string;
  includedFeatures: string[];
  targetAudience: string;
  primaryOfferName: string;
  sprintOutputs: string[];
}

export interface ProductSystem {
  id: string;
  name: string;
  evidenceLevel: EvidenceLevel;
  shortDesc: string;
  capabilities: string[];
}

/**
 * Persona seam (docs/02-personas.md §7). Carried through the diagnostic and
 * into the email summary, but not used in scoring — persona-adaptive content
 * is a separate, deferred decision.
 */
export type PersonaId = "operations-finance" | "security-risk" | "contact-centre" | "product-cto";

export interface FitDiagnosticInput {
  workflowType: string;
  challenges: string[];
  timeline: string;
  teamSize: string;
  currentWorkaround: string;
  persona?: PersonaId;
}

export interface DiagnosticAnalysis {
  fitScore: number;
  fitStatus: "Strong fit" | "Likely fit" | "Worth a conversation" | "Probably not yet";
  recommendedSprint: string;
  estimatedDurationDays: string;
  keyRisksIdentified: string[];
  recommendedArchitecture: string;
  sprintDeliverables: string[];
  evidenceLevelToDeliver: EvidenceLevel;
  reasoning: string;
}
