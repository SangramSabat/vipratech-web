import { COMPANY_INFO } from "../data/companyData";
import type { DiagnosticAnalysis, FitDiagnosticInput } from "../types";

/**
 * Fit diagnostic scoring.
 *
 * This previously returned a hardcoded `fitScore: 92` / "Strong Fit" with an
 * identical risk list, architecture and reasoning for every visitor — only the
 * sprint name varied, by keyword match. On a site whose stated policy is
 * "evidence before claims", shipping a diagnostic that ignores its own inputs
 * was the single most serious contradiction on the page
 * (docs/05-ui-ux-spec.md S10.1).
 *
 * The scoring below is deliberately simple and inspectable. It is not a model;
 * it is a structured self-assessment, and the UI says so (S10.2).
 */

const BASE_SCORE = 40;

/** Signals that a governed pipeline is a good match, with why. */
const CHALLENGE_SIGNALS: Record<string, { weight: number; risk: string }> = {
  "Unstructured PDFs and spreadsheet mismatches": {
    weight: 12,
    risk: "Extraction quality varies by document source and template drift.",
  },
  "High manual review overhead & human errors": {
    weight: 12,
    risk: "Current effort is absorbed by people, so the true error rate is unmeasured.",
  },
  "AI agent security & compliance uncertainty": {
    weight: 10,
    risk: "Tool permissions and authorization boundaries are undefined for the agent.",
  },
  "Multilingual / Hindi code-switching complexity": {
    weight: 10,
    risk: "Code-switching and line quality degrade speech accuracy in ways demos hide.",
  },
  "Lack of audit trail & decision evidence": {
    weight: 14,
    risk: "No durable record linking a decision to the evidence behind it.",
  },
  "Difficulty scaling repeated decisions": {
    weight: 10,
    risk: "Exception volume grows with throughput and can outpace the review team.",
  },
};

const TIMELINE_ADJUSTMENT: Record<string, { delta: number; risk?: string }> = {
  "Urgent (1-2 Weeks)": {
    delta: -12,
    risk: "The stated timeline is shorter than a responsible diagnostic and pilot cycle.",
  },
  "1-2 Months": { delta: 6 },
  "Q3/Q4 Roadmap": { delta: 2 },
};

const TEAM_ADJUSTMENT: Record<string, { delta: number; risk?: string }> = {
  "1-10 People": {
    delta: -4,
    risk: "A small team may lack the reviewer capacity a human approval gate assumes.",
  },
  "10-50 People": { delta: 5 },
  "50+ Enterprise": {
    delta: 8,
    risk: "Enterprise rollout adds integration and change-management surface beyond the pilot.",
  },
};

const RECOMMENDATIONS = [
  {
    matches: ["document", "reconciliation"],
    recommendedSprint: "Reconciliation Opportunity Sprint",
    architecture:
      "Deterministic-first reconciliation: a rule engine settles line items that match on explicit logic, the model interprets only genuine ambiguity, and unresolved exceptions route to a reviewer with the source documents side by side.",
    sprintDeliverables: [
      "Line-item document extraction & normalization scheme",
      "Deterministic matching rule set & ambiguity taxonomy",
      "Human-in-the-loop exception dashboard mockup",
      "Audit-friendly traceability schema & pilot plan",
    ],
  },
  {
    matches: ["security", "agent"],
    recommendedSprint: "AI Agent Security Assessment",
    architecture:
      "Threat model first, then an authorized adversarial test plan against tool-use and authorization boundaries, producing a reproducible evidence register rather than a narrative report.",
    sprintDeliverables: [
      "System and agent threat model register",
      "Controlled multi-turn adversarial prompt test sample",
      "Tool-use authorization & permission boundaries",
      "Prioritized findings & remediation roadmap",
    ],
  },
  {
    matches: ["voice", "telephony"],
    recommendedSprint: "Voice AI Feasibility Sprint",
    architecture:
      "Call-flow exception states designed before the voice layer: policy guardrails, interruption and retry handling, and a clean operator handoff, benchmarked against real line conditions.",
    sprintDeliverables: [
      "Call-flow & Hindi/Hinglish code-switching exception matrix",
      "Telephony provider & latency evaluation record",
      "Interruption, retry & human handoff escalation rules",
      "Measured voice prototype & rollout plan",
    ],
  },
  {
    matches: ["sales", "marketing", "revenue"],
    recommendedSprint: "Revenue Automation Diagnostic",
    architecture:
      "Research and drafting automated behind a human approval gate before first dispatch, with identity suppression checks and attribution wired through to the CRM.",
    sprintDeliverables: [
      "Funnel, research & drafting workflow audit",
      "Human approval gate & identity suppression rules",
      "CRM integration & multi-tenant attribution map",
      "Phased implementation & ROI benchmark",
    ],
  },
] as const;

const DEFAULT_RECOMMENDATION = {
  recommendedSprint: "AI Product Discovery Sprint",
  architecture:
    "Map the deterministic boundary before choosing any model: establish which decisions are rule-expressible, which genuinely need judgment, and what evidence each must carry.",
  sprintDeliverables: [
    "Current workflow and source exception map",
    "Evidence taxonomy & error leakage review",
    "Deterministic boundary vs model decision framework",
    "Target system architecture & pilot scope",
  ],
};

function statusFor(score: number): DiagnosticAnalysis["fitStatus"] {
  if (score >= 80) return "Strong fit";
  if (score >= 65) return "Likely fit";
  if (score >= 45) return "Worth a conversation";
  return "Probably not yet";
}

function reasoningFor(score: number, challengeCount: number): string {
  if (challengeCount === 0) {
    return "You have not flagged any of the failure modes a governed pipeline is built to address, so there is little to go on yet. The fit call is the faster way to work out whether there is a problem here worth solving.";
  }
  if (score >= 80) {
    return "What you have described — unmeasured manual effort, missing decision evidence, or ambiguity that rules alone cannot settle — is the shape of problem this approach exists for.";
  }
  if (score >= 65) {
    return "There is a plausible fit here, though the scope needs narrowing before anyone commits to a build. That is what the diagnostic sprint is for.";
  }
  if (score >= 45) {
    return "Some signals point toward a governed pipeline and others do not. Worth a conversation, but we would want to understand the exception volume before proposing anything.";
  }
  return "On what you have entered, this may not need AI yet. If the logic is largely deterministic, a rule engine will be cheaper, faster and easier to audit — and we would rather tell you that now.";
}

export function analyzeFitDiagnostic(input: FitDiagnosticInput): DiagnosticAnalysis {
  const workflowType = input.workflowType.toLowerCase();
  const recommendation =
    RECOMMENDATIONS.find(({ matches }) =>
      matches.some((keyword) => workflowType.includes(keyword)),
    ) ?? DEFAULT_RECOMMENDATION;

  const risks: string[] = [];
  let score = BASE_SCORE;

  for (const challenge of input.challenges) {
    const signal = CHALLENGE_SIGNALS[challenge];
    if (signal) {
      score += signal.weight;
      risks.push(signal.risk);
    }
  }

  const timeline = TIMELINE_ADJUSTMENT[input.timeline];
  if (timeline) {
    score += timeline.delta;
    if (timeline.risk) risks.push(timeline.risk);
  }

  const team = TEAM_ADJUSTMENT[input.teamSize];
  if (team) {
    score += team.delta;
    if (team.risk) risks.push(team.risk);
  }

  // A described workaround is a real signal: it means the problem is already
  // being paid for in manual effort.
  if (input.currentWorkaround.trim().length > 20) {
    score += 5;
  } else {
    risks.push("The current workaround is not described, so the baseline effort is unknown.");
  }

  const fitScore = Math.max(5, Math.min(95, Math.round(score)));

  return {
    fitScore,
    fitStatus: statusFor(fitScore),
    estimatedDurationDays: fitScore >= 65 ? "5–10 business days" : "To be scoped on the fit call",
    keyRisksIdentified: risks.slice(0, 4),
    recommendedSprint: recommendation.recommendedSprint,
    recommendedArchitecture: recommendation.architecture,
    sprintDeliverables: [...recommendation.sprintDeliverables],
    evidenceLevelToDeliver: "Researched/Designed",
    reasoning: reasoningFor(fitScore, input.challenges.length),
  };
}

export function buildFitCallSummary(
  input: FitDiagnosticInput,
  analysis: DiagnosticAnalysis,
): string {
  return [
    "Hello VipraTech,",
    "",
    "I would like to discuss this workflow:",
    `Workflow area: ${input.workflowType}`,
    `Challenges: ${input.challenges.length > 0 ? input.challenges.join("; ") : "Not specified"}`,
    `Current workaround: ${input.currentWorkaround || "Not specified"}`,
    `Expected timeline: ${input.timeline}`,
    `Team size: ${input.teamSize}`,
    ...(input.persona ? [`Persona: ${input.persona}`] : []),
    "",
    `Self-assessment result: ${analysis.fitStatus} (${analysis.fitScore}/100)`,
    `Suggested starting point: ${analysis.recommendedSprint}`,
    "",
    "Please share the next available time for a 30-minute fit call.",
  ].join("\n");
}

export function buildFitCallMailto(
  input: FitDiagnosticInput,
  analysis: DiagnosticAnalysis,
): string {
  const subject = `VipraTech fit call request: ${input.workflowType}`;
  const body = buildFitCallSummary(input, analysis);
  return `mailto:${COMPANY_INFO.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
