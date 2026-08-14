/**
 * Single source of truth for user-facing copy.
 *
 * Implements docs/03-copywriting-matrix.md §1: copy was previously split
 * between this file and hardcoded JSX in eight components, which made the
 * copy matrix unenforceable. Every user-facing string now lives here.
 */
import type {
  AssurancePoint,
  ComparisonRow,
  EngagementStep,
  EvidenceLevelNote,
  FaqEntry,
  NavLink,
  PipelineStep,
  ProductSystem,
  ProofMetric,
  SectionIntro,
  ServiceOffer,
} from "../types";

export const COMPANY_INFO = {
  name: "VipraTech Labs Private Limited",
  shortName: "VipraTech Labs",
  subheading:
    "We research, prototype, and build production AI systems for workflows where accuracy, evidence, human review, and operational reliability matter.",
  founder: "Akhilesh Mittal",
  email: "akhilesh@vipratech.in",
  phone: "+91 70234 15753",
  address: "Plot No. 1, Vikas Nagar, Nanta Road, Kunhari, Kota, Rajasthan, India",
  url: "https://vipratech.in",
};

/** Labels must name the action they perform (spec S3.2). */
export const CTA = {
  primary: "Run the fit diagnostic",
  secondary: "Book a 30-min fit call",
} as const;

/** Root-relative so they resolve from a service page as well as the home page. */
export const NAV_LINKS: NavLink[] = [
  { href: "/#how", label: "How it works" },
  { href: "/#why", label: "Why pilots stall" },
  { href: "/#services", label: "What we build" },
  { href: "/#products", label: "Evidence" },
  { href: "/#faq", label: "FAQ" },
];

/* -------------------------------------------------------------------------- */
/* Hero — docs/03-copywriting-matrix.md §2                                     */
/* -------------------------------------------------------------------------- */

export const HERO = {
  eyebrow: "Applied AI for regulated operations",
  headline: "AI for decisions you have to defend.",
  lead: "Most AI pilots stall in regulated operations because they can't show their work. VipraTech maps your workflow first, then builds systems where deterministic rules handle the known cases, AI handles only the ambiguous ones, and a human approves anything consequential — with evidence behind every decision.",
};

/**
 * Every figure traces to real data below — no self-referential process claims.
 * See docs/03-copywriting-matrix.md §2 "Hero proof strip".
 */
export const PROOF_METRICS: ProofMetric[] = [
  { value: "5–10 days", label: "Diagnostic sprint, fixed scope" },
  { value: "50%", label: "Of sprint fee credited to the build" },
  { value: "3", label: "Systems running in production" },
];

/** Worked example, not a live feed — the previous "LIVE STREAM" framing implied
 *  production telemetry that does not exist (matrix §6). */
export const PIPELINE_STEPS: PipelineStep[] = [
  {
    id: "ingestion",
    stage: "Ingestion",
    text: "PDF and spreadsheet multi-parser",
    status: "Parsed",
    tone: "verified",
  },
  {
    id: "rules",
    stage: "Rule engine",
    text: "Deterministic totals validation",
    status: "Matched",
    tone: "verified",
  },
  {
    id: "ambiguity",
    stage: "Ambiguity",
    text: "Routed to human approval gate",
    status: "Awaiting review",
    tone: "attention",
  },
  {
    id: "audit",
    stage: "Audit log",
    text: "Decision and evidence recorded",
    status: "Settled",
    tone: "verified",
  },
];

/* -------------------------------------------------------------------------- */
/* Section intros                                                              */
/* -------------------------------------------------------------------------- */

export const SECTIONS: Record<string, SectionIntro> = {
  how: {
    eyebrow: "How engagements work",
    heading: "Start with a conversation, not a contract.",
    subhead: "Three stages, each with a defined exit. You can stop after any of them.",
  },
  why: {
    eyebrow: "Why pilots stall",
    heading: "A model is not a system.",
    subhead:
      "The difference between an AI pilot that stalls in review and one that reaches production is almost never the model.",
  },
  services: {
    eyebrow: "What we build",
    heading: "Five practices, one method.",
    subhead:
      "Every engagement starts with a free 30-minute fit call, then a bounded 5–10 day diagnostic sprint before anyone commits to a build.",
  },
  products: {
    eyebrow: "Evidence",
    heading: "What we have already built.",
    subhead:
      "Each system is tagged with what was actually shipped versus what was researched. We do not blur the two.",
  },
  assurance: {
    eyebrow: "Built for review",
    heading: "Designed for the people who have to sign off.",
    subhead:
      "Every system we build assumes it will be audited, challenged, and asked to justify a specific decision made months ago.",
  },
  faq: {
    eyebrow: "Questions",
    heading: "Frequently asked.",
    subhead: "Direct answers on method, commercials, and data handling.",
  },
  contact: {
    eyebrow: "Next step",
    heading: "Find out whether this is worth your time.",
    subhead:
      "The diagnostic takes about two minutes and tells you what a sprint would cover — including if we think you don't need one.",
  },
};

/* -------------------------------------------------------------------------- */
/* Governed vs. generic — docs/03-copywriting-matrix.md §4                     */
/* -------------------------------------------------------------------------- */

export const COMPARISON_ROWS: ComparisonRow[] = [
  {
    generic: "One model handles every case",
    governed: "Rules handle the deterministic cases; AI handles only the ambiguous residue",
  },
  {
    generic: "Confidence score as the only signal",
    governed: "Explicit exception states with defined handling",
  },
  {
    generic: "Human review bolted on afterwards, if at all",
    governed: "Human approval gate designed into the flow",
  },
  {
    generic: "Output is a prediction",
    governed: "Output is a decision with its evidence attached",
  },
  {
    generic: "“It's about 90% accurate”",
    governed: "You can point at why any single decision was made",
  },
];

export const COMPARISON_CLOSING = "Ninety percent accurate means someone still checks all of it.";

/* -------------------------------------------------------------------------- */
/* Security & assurance — docs/03-copywriting-matrix.md §4                     */
/* Makes no certification claims; VipraTech holds none to cite.                */
/* -------------------------------------------------------------------------- */

export const ASSURANCE_POINTS: AssurancePoint[] = [
  {
    id: "gates",
    title: "Human approval gates",
    description:
      "Consequential decisions route to a named reviewer before they take effect, rather than after something has gone wrong.",
  },
  {
    id: "evidence",
    title: "Durable evidence trail",
    description:
      "Every decision retains its inputs, the rule path it followed, and the model reasoning behind any judgment call.",
  },
  {
    id: "adversarial",
    title: "Adversarial testing",
    description:
      "We red-team our own agent systems under prompt manipulation and tool-permission abuse. It is one of the five things we sell.",
  },
  {
    id: "boundaries",
    title: "Stated boundaries",
    description:
      "Tool access and authorization limits are defined and documented before an agent is allowed near production.",
  },
];

/* -------------------------------------------------------------------------- */
/* Services                                                                    */
/* -------------------------------------------------------------------------- */

export const SERVICE_OFFERS: ServiceOffer[] = [
  {
    id: "doc-reconciliation",
    title: "Document Intelligence & Reconciliation",
    diagnosticLabel: "Document Intelligence & Reconciliation",
    description:
      "Build systems that process spreadsheets, PDFs, images, invoices, and claims into reviewable decisions with deterministic matching rules and explicit exception states.",
    includedFeatures: [
      "Multi-format document ingestion & parsing",
      "Line-level data normalization",
      "Deterministic matching rules + AI interpretation",
      "Human review exception dashboard",
      "Audit-friendly traceability and evidence links",
    ],
    targetAudience: "Finance, claims, and operations teams handling unaligned cross-system records.",
    primaryOfferName: "Reconciliation Opportunity Sprint",
    sprintOutputs: [
      "Current workflow & source map",
      "Representative document exception review",
      "Error & leakage taxonomy",
      "Target architecture & review model",
      "Bounded pilot scope & acceptance checks",
    ],
  },
  {
    id: "ai-security",
    title: "AI Security, Testing & Compliance",
    diagnosticLabel: "AI Security & Agent Red-Teaming",
    description:
      "Evaluating how AI agents behave under adversarial conditions, prompt manipulation, and tool permission boundaries before production release.",
    includedFeatures: [
      "AI-agent threat modeling & asset boundaries",
      "Controlled multi-turn adversarial red-teaming",
      "Prompt-manipulation & state corruption testing",
      "Tool-use & authorization boundary checks",
      "Reproducible evidence register & finding review",
    ],
    targetAudience: "Engineering & risk teams preparing AI agents for production deployment.",
    primaryOfferName: "AI Agent Security Assessment",
    sprintOutputs: [
      "Agent threat model & attack surface map",
      "Authorized test plan & prompt samples",
      "Durable evidence register with reproduction steps",
      "Prioritized vulnerability finding review",
      "Remediation & verification roadmap",
    ],
  },
  {
    id: "voice-ai",
    title: "Voice AI & Conversational Systems",
    diagnosticLabel: "Multilingual Voice AI & Telephony",
    description:
      "Designing voice systems that connect conversational AI with telephony, Hindi/Hinglish code-switching, policy guardrails, and seamless human handoff.",
    includedFeatures: [
      "Call-flow & exception state logic",
      "Hindi, Hinglish & code-switching evaluation",
      "Telephony & speech provider benchmarking",
      "Interruption, retry & policy guardrails",
      "Operator handoff & call evidence capture",
    ],
    targetAudience: "Collections teams, contact centers, and lenders managing high-volume calls.",
    primaryOfferName: "Voice AI Feasibility Sprint",
    sprintOutputs: [
      "Call-flow & exception matrix",
      "Language & telephony latency report",
      "Compliance & operational risk register",
      "Reference system architecture",
      "Measured prototype & rollout plan",
    ],
  },
  {
    id: "sales-automation",
    title: "AI Sales & Marketing Automation",
    diagnosticLabel: "Revenue & Outreach Automation",
    description:
      "Connecting buyer research, evidence-backed content drafting, human approval gates, channel campaigns, and multi-tenant attribution.",
    includedFeatures: [
      "Buyer & account research automation",
      "Evidence-backed personalized drafting",
      "Human approval gate before first dispatch",
      "Identity suppression & compliance checks",
      "CRM & pipeline attribution telemetry",
    ],
    targetAudience: "Founders, growth leads, CROs, and agencies scaling B2B outbound.",
    primaryOfferName: "Revenue Automation Diagnostic",
    sprintOutputs: [
      "Funnel & revenue workflow audit",
      "Data, channel & approval gate map",
      "Governance & reply-handling gap analysis",
      "Prioritized automation roadmap",
      "Phased implementation & ROI plan",
    ],
  },
  {
    id: "product-research",
    title: "AI Product Research & Rapid Prototyping",
    diagnosticLabel: "AI Product Discovery & Feasibility",
    description:
      "Helping product teams resolve consequential AI technology, provider selection, build-vs-buy, and evaluation strategy decisions.",
    includedFeatures: [
      "Provider & model capability benchmarking",
      "Build vs. buy trade-off matrix",
      "Deterministic vs. LLM boundary mapping",
      "Risk & failure-mode analysis",
      "Focused technical or clickable prototypes",
    ],
    targetAudience: "Founders, CTOs, and product leaders evaluating complex AI ideas.",
    primaryOfferName: "AI Product Discovery Sprint",
    sprintOutputs: [
      "Problem brief & evidence corpus",
      "Options & trade-off decision record",
      "Target reference architecture",
      "Evaluation strategy & dataset spec",
      "Prototype & delivery scope",
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Products                                                                    */
/* -------------------------------------------------------------------------- */

export const PRODUCTS_SYSTEMS: ProductSystem[] = [
  {
    id: "autosentinx",
    name: "AutoSentinx",
    evidenceLevel: "Built/Deployed",
    shortDesc:
      "AI agent security testing system that executes multi-turn adversarial campaigns and captures auditable evidence.",
    capabilities: [
      "Multi-turn conversation campaigns",
      "Durable evidence register",
      "Adversarial prompt injection testing",
    ],
  },
  {
    id: "marketingengine",
    name: "MarketingEngine",
    evidenceLevel: "Built/Deployed",
    shortDesc:
      "Multi-tenant revenue workflow engine connecting research, drafting, human approval gates, dispatch, and attribution.",
    capabilities: [
      "Multi-tenant SaaS tenant isolation",
      "Human approval gate workflow",
      "Evidence-backed outreach drafting",
    ],
  },
  {
    id: "aarav",
    name: "Aarav Voice System",
    evidenceLevel: "Built/Deployed",
    shortDesc:
      "Regulated voice and conversational architecture for Hindi/Hinglish telephony with guardrails and operator handoff.",
    capabilities: [
      "Telephony & speech integration",
      "Hindi & Hinglish code-switching",
      "Policy guardrail enforcement",
    ],
  },
  {
    id: "latticly",
    name: "Latticly",
    evidenceLevel: "Researched/Designed",
    shortDesc:
      "AI-BDR product architecture and research body exploring governed buyer workflows and automated research synthesis.",
    capabilities: [
      "Buyer workflow research",
      "Technical architecture specs",
      "Governed outbound messaging concepts",
    ],
  },
];

export const ENGAGEMENT_STEPS: EngagementStep[] = [
  {
    step: "01",
    title: "Free 30-min fit call",
    duration: "30 minutes",
    cost: "Free",
    description:
      "We discuss your workflow, current workarounds, exceptions, and timeline. If we don't think we're the right fit, we say so on the first call.",
  },
  {
    step: "02",
    title: "Diagnostic sprint",
    duration: "5–10 business days",
    cost: "Paid — quoted per scope",
    description:
      "De-risk before committing. Produces workflow maps, evidence reviews, risk registers, and a bounded pilot scope. 50% of the fee is credited if implementation starts within 30 days.",
  },
  {
    step: "03",
    title: "Production implementation",
    duration: "Custom timeline",
    cost: "Milestone-based",
    description:
      "Full-stack development, AI model orchestration, human review gates, operator dashboards, cloud deployment, monitoring, and audit controls.",
  },
];

export const EVIDENCE_LEVELS_EXPLANATION: EvidenceLevelNote[] = [
  {
    level: "Built/Deployed",
    desc: "Shipped software running in production with real evidence and user verification.",
    tone: "verified",
  },
  {
    level: "Prototyped",
    desc: "Functional technical test or clickable prototype verifying core feasibility.",
    tone: "attention",
  },
  {
    level: "Researched/Designed",
    desc: "Architectural blueprint, trade-off analysis, or detailed research specification.",
    tone: "info",
  },
];

/* -------------------------------------------------------------------------- */
/* FAQ — moved out of FeasibilityFAQAccordion so it can also drive JSON-LD     */
/* -------------------------------------------------------------------------- */

export const FAQS: FaqEntry[] = [
  {
    q: "How is this different from wrapping an LLM API?",
    a: "A wrapper passes a prompt to a model and returns whatever comes back. We build systems where deterministic rules run first and settle everything that is genuinely rule-based, the model is asked only about the ambiguous residue, and anything consequential stops at a human approval gate before it takes effect. Every decision keeps the evidence behind it.",
  },
  {
    q: "What is the 5–10 day diagnostic sprint and what do I get?",
    a: "Before anyone signs an engineering contract, we de-risk the workflow in 5 to 10 business days. You receive a workflow and exception map, an error and leakage taxonomy, a reference architecture, a bounded pilot scope, and feasibility tests run against your own sample data.",
  },
  {
    q: "How does the 50% diagnostic fee credit work?",
    a: "If you commission a production implementation with VipraTech within 30 days of completing the diagnostic sprint, 50% of the sprint fee is credited against that implementation contract.",
  },
  {
    q: "When would you tell us not to use AI?",
    a: "When the logic is fully deterministic, a rule engine is cheaper, faster, and easier to audit than a model — so we say so. We also say so when the volume does not justify the build, or when the compliance exposure of an automated decision outweighs the saved effort. We would rather lose the engagement than build something you cannot defend.",
  },
  {
    q: "How do you handle data privacy, NDAs, and IP?",
    a: "We work under mutual non-disclosure agreements. Customer data, private document stores, and commercial figures stay isolated in your cloud environment or in dedicated single-tenant pipelines. We do not use client data to train public models.",
  },
  {
    q: "Can you integrate with our existing ERP, CRM, or telephony stack?",
    a: "Yes. We have built integrations across REST APIs, PostgreSQL, Salesforce and HubSpot, Twilio and Exotel telephony, custom webhook architectures, and flat-file and S3 storage.",
  },
];
