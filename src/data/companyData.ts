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
  FeeDriver,
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
  address:
    "Plot No. 1, Vikas Nagar, Nanta Road, Kunhari, Kota, Rajasthan, India",
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
  { href: "/#terms", label: "Pricing" },
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
    subhead:
      "Three stages, each with a defined exit. You can stop after any of them.",
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
  terms: {
    eyebrow: "Commercials",
    heading: "What it costs, and what you are committing to.",
    subhead:
      "Services work is quoted, not priced off a shelf. What you should not have to guess at is the shape of the deal — so the basis, the commitments, and the exits are set out here in full.",
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
    governed:
      "Rules handle the deterministic cases; AI handles only the ambiguous residue",
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

export const COMPARISON_CLOSING =
  "Ninety percent accurate means someone still checks all of it.";

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
    targetAudience:
      "Finance, claims, and operations teams handling unaligned cross-system records.",
    primaryOfferName: "Reconciliation Opportunity Sprint",
    sprintOutputs: [
      "Current workflow & source map",
      "Representative document exception review",
      "Error & leakage taxonomy",
      "Target architecture & review model",
      "Bounded pilot scope & acceptance checks",
    ],
    failureMode: {
      symptom:
        "Two people spend every morning matching invoices against receipts, and whatever will not reconcile gets emailed around until somebody decides.",
      cost: "The real error rate is unknown, because the people absorbing the errors are the same people who would have to measure them.",
      whyItPersists:
        "An OCR or LLM tool got it roughly 80% right, which meant every line still had to be checked. It added a step instead of removing one.",
    },
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
    targetAudience:
      "Engineering & risk teams preparing AI agents for production deployment.",
    primaryOfferName: "AI Agent Security Assessment",
    sprintOutputs: [
      "Agent threat model & attack surface map",
      "Authorized test plan & prompt samples",
      "Durable evidence register with reproduction steps",
      "Prioritized vulnerability finding review",
      "Remediation & verification roadmap",
    ],
    failureMode: {
      symptom:
        "An agent with real tool access is ready to ship, and somebody has to put their name against it.",
      cost: "Sign-off is a judgement call today, with no reproducible evidence sitting behind the signature.",
      whyItPersists:
        "Generic red-teaming returns a narrative report of findings nobody can reproduce, rank, or retest once a fix lands.",
    },
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
    targetAudience:
      "Collections teams, contact centers, and lenders managing high-volume calls.",
    primaryOfferName: "Voice AI Feasibility Sprint",
    sprintOutputs: [
      "Call-flow & exception matrix",
      "Language & telephony latency report",
      "Compliance & operational risk register",
      "Reference system architecture",
      "Measured prototype & rollout plan",
    ],
    failureMode: {
      symptom:
        "Call volume has outgrown headcount, but every call still has to stay inside policy and stay consistent.",
      cost: "Either the calls do not get made, or conduct varies with whoever happens to pick up.",
      whyItPersists:
        "Voice demos are recorded in clean English on good lines. Real calls are Hindi-Hinglish, interrupted, and on bad connections.",
    },
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
    targetAudience:
      "Founders, growth leads, CROs, and agencies scaling B2B outbound.",
    primaryOfferName: "Revenue Automation Diagnostic",
    sprintOutputs: [
      "Funnel & revenue workflow audit",
      "Data, channel & approval gate map",
      "Governance & reply-handling gap analysis",
      "Prioritized automation roadmap",
      "Phased implementation & ROI plan",
    ],
    failureMode: {
      symptom:
        "Research and drafting eat the team's week, and the CRM still cannot say which of it actually produced pipeline.",
      cost: "Spend gets defended with anecdote, because attribution is reconstructed by hand after the fact.",
      whyItPersists:
        "Fully automated sending is one bad message away from a domain reputation problem, so it stays manual and stays expensive.",
    },
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
    targetAudience:
      "Founders, CTOs, and product leaders evaluating complex AI ideas.",
    primaryOfferName: "AI Product Discovery Sprint",
    sprintOutputs: [
      "Problem brief & evidence corpus",
      "Options & trade-off decision record",
      "Target reference architecture",
      "Evaluation strategy & dataset spec",
      "Prototype & delivery scope",
    ],
    failureMode: {
      symptom:
        "A build-or-buy decision is due, and nobody in-house can say whether the thing actually works on your data.",
      cost: "The call gets made on vendor demos and a slide deck, and is expensive to reverse.",
      whyItPersists:
        "Consultants deliver recommendations. What is missing is a working prototype or a measured evaluation you can check.",
    },
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
    commitment: "Nothing. No NDA required to talk.",
    exit: "Stop here and you have lost half an hour.",
  },
  {
    step: "02",
    title: "Diagnostic sprint",
    duration: "5–10 business days",
    cost: "Paid — fixed fee, quoted before it starts",
    featured: true,
    description:
      "De-risk before committing. Produces workflow maps, evidence reviews, risk registers, and a bounded pilot scope. 50% of the fee is credited if implementation starts within 30 days.",
    commitment: "One fixed fee, agreed in writing before any work begins.",
    exit: "Stop here and you keep every deliverable, including the architecture and pilot scope — usable by any vendor, not just us.",
  },
  {
    step: "03",
    title: "Production implementation",
    duration: "Custom timeline",
    cost: "Milestone-based",
    commitment:
      "Milestone by milestone, scoped from the sprint's own findings.",
    exit: "Stop after any milestone. Code and infrastructure are yours throughout.",
    description:
      "Full-stack development, AI model orchestration, human review gates, operator dashboards, cloud deployment, monitoring, and audit controls.",
  },
];

/**
 * Published fee band for the diagnostic sprint.
 *
 * Left null deliberately: a number invented here would be exactly the kind of
 * unevidenced claim this site exists to argue against. Set it to a real string
 * (e.g. "₹X–Y lakh") and the commercial terms section publishes it; while it is
 * null the section states plainly that the figure comes on the fit call, which
 * is honest rather than evasive because everything driving that figure is
 * listed alongside it (S12.2).
 */
export const SPRINT_FEE_BAND: string | null = null;

/**
 * What actually moves the sprint quote.
 *
 * The reference class quotes services privately too — opacity is normal. What
 * is not normal is giving a buyer no way to estimate before the call, so the
 * inputs are published even though the output is not.
 */
export const FEE_DRIVERS: FeeDriver[] = [
  {
    factor: "Document and case variety",
    detail:
      "One invoice template is a different problem from forty, across three source systems, in two languages.",
  },
  {
    factor: "Systems we have to reach into",
    detail:
      "A read-only export costs less to work against than live writes into an ERP with its own approval rules.",
  },
  {
    factor: "How much sample data exists",
    detail:
      "Real records with known-correct answers shorten the sprint. Reconstructing ground truth lengthens it.",
  },
  {
    factor: "Regulatory surface",
    detail:
      "Decisions that get audited need evidence design and retention rules that internal-only tooling does not.",
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
    q: "What does this cost?",
    a: "The fit call is free. The diagnostic sprint is a fixed fee agreed in writing before any work starts — never hourly, and never open-ended. We quote it after the fit call rather than publishing a single number, because the same sprint against forty document templates and three source systems is not the same piece of work as one template and a CSV export. What drives the figure is listed on this page, so you can tell which end of the range you sit at before you speak to us. Implementation afterwards is milestone-based.",
  },
  {
    q: "What happens if the sprint concludes we should not build this?",
    a: "You keep every deliverable and you owe nothing further. That outcome is a successful sprint, not a failed one — it cost you days instead of a build. The diagnostic is deliberately structured so the answer can be no, and the fit diagnostic on this site will tell you the same thing before you ever pay us.",
  },
  {
    q: "Why work with a small team rather than a large firm?",
    a: "You talk to the people writing the code, and you can inspect what they built. There is no account layer between the decision and the engineering, and no incentive to extend a project past the point of value. The trade-off is real and worth stating: we are not the right choice if you need a hundred engineers on site next month, and we will say so on the first call.",
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

/**
 * The platform arm (docs/06 §3, §9).
 *
 * VipraTech is positioned as platform-plus-service: Foundry is the system, and
 * the delivery work is the proof it works. The structural move is 8090's — the
 * factory is never sold as a tool the company does not itself run.
 *
 * `Foundry` is a PLACEHOLDER and is deliberately isolated in one constant.
 * It has not been cleared: Palantir Foundry and Azure AI Foundry occupy
 * adjacent enterprise-AI territory (docs/07 F7). Changing it is a one-line
 * edit here, which is why every reference below reads from `name`.
 */
export const PLATFORM = {
  name: "Foundry",
  eyebrow: "Foundry",
  headline: "The factory we build your software in.",
  lead: "Foundry is an agentic software development system. Requirements become specifications, specifications become tested increments, and every artifact carries the record of how it got there. Agents do the volume. Engineers hold the gates.",
  stagesIntro: {
    eyebrow: "The build loop",
    heading: "How a build moves through it",
    subhead:
      "Four stages, in order. An engineer stands at the third one, and nothing reaches production without passing it.",
  },
  ownershipIntro: {
    eyebrow: "Ownership",
    heading: "What you get either way",
    subhead:
      "Whether the engagement continues or stops after the first increment.",
  },
  evidenceIntro: {
    eyebrow: "Evidence",
    heading: "The systems this team has shipped",
    subhead:
      "The reference class sells a factory by showing what came out of it. These carry their own evidence labels, unchanged.",
  },
  // Deliberately does NOT claim these were built through Foundry. docs/06 §3
  // asserts that ("every system in Products & systems was built through
  // Foundry"), but it is an unconfirmed claim about delivery history, and
  // 01-brand-guidelines §6 forbids publishing an unverified claim. Naming the
  // systems and their evidence levels is true today; the stronger provenance
  // sentence goes in only once the owner confirms it.
  evidenceNote:
    "AutoSentinx, MarketingEngine, Aarav Voice System and Latticly are the systems behind the practices on this site. Each is listed with the evidence level it has actually earned — Built, Deployed, Prototyped or Researched — and never a level above it.",
  limitsIntro: {
    eyebrow: "Limits",
    heading: `Where ${"Foundry"} does not help`,
    subhead: "The cases where this is the wrong tool, named before you buy it.",
  },
  stages: [
    {
      id: "specify",
      stage: "Specify",
      text: "Workflows, exception states and decision rules are captured as an executable specification, not a document.",
    },
    {
      id: "generate",
      stage: "Generate",
      text: "Agents produce implementation and tests against that specification, in reviewable increments.",
    },
    {
      id: "gate",
      stage: "Gate",
      text: "An engineer approves every increment. Nothing merges on model confidence alone.",
    },
    {
      id: "evidence",
      stage: "Evidence",
      text: "Each artifact ships with its specification, its tests, and the record of who approved it.",
    },
  ],
  ownership: {
    text: "Source code and infrastructure are yours from the first increment. No runtime lock-in, no proprietary format holding your logic.",
  },
  // The site tells visitors when they do not need it. That posture is the most
  // distinctive thing it owns (S10.4), so the platform page carries it too.
  limits: {
    text: "If the logic is fully deterministic and stable, a rule engine is cheaper and easier to audit. We will say so on the first call.",
  },
} as const;
