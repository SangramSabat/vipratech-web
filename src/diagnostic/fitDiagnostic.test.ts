import { describe, expect, it } from "vitest";
import { analyzeFitDiagnostic, buildFitCallMailto } from "./fitDiagnostic";
import type { FitDiagnosticInput } from "../types";

const baseInput: FitDiagnosticInput = {
  workflowType: "Document Intelligence & Reconciliation",
  challenges: ["High manual review overhead & human errors"],
  currentWorkaround: "Two people reconcile spreadsheets by hand every morning",
  timeline: "1-2 Months",
  teamSize: "10-50 People",
};

describe("sprint recommendation by workflow", () => {
  it.each([
    ["Document Intelligence & Reconciliation", "Reconciliation Opportunity Sprint"],
    ["AI Security, Testing & Compliance", "AI Agent Security Assessment"],
    ["Voice AI & Conversational Systems", "Voice AI Feasibility Sprint"],
    ["AI Sales & Marketing Automation", "Revenue Automation Diagnostic"],
    ["AI Product Research & Rapid Prototyping", "AI Product Discovery Sprint"],
  ])("%s maps to %s", (workflowType, recommendedSprint) => {
    const analysis = analyzeFitDiagnostic({ ...baseInput, workflowType });

    expect(analysis.recommendedSprint).toBe(recommendedSprint);
    expect(analysis.sprintDeliverables).toHaveLength(4);
    expect(analysis.recommendedArchitecture.length).toBeGreaterThan(0);
  });
});

/**
 * Spec S11.2 — the diagnostic previously returned a hardcoded 92 / "Strong Fit"
 * to every visitor regardless of input. These tests exist to keep it honest.
 */
describe("the result responds to the input", () => {
  it("scores a well-evidenced problem above a thin one", () => {
    const strong = analyzeFitDiagnostic({
      ...baseInput,
      challenges: [
        "Lack of audit trail & decision evidence",
        "High manual review overhead & human errors",
        "Unstructured PDFs and spreadsheet mismatches",
      ],
      teamSize: "50+ Enterprise",
    });
    const thin = analyzeFitDiagnostic({
      ...baseInput,
      challenges: [],
      currentWorkaround: "",
      timeline: "Urgent (1-2 Weeks)",
      teamSize: "1-10 People",
    });

    expect(strong.fitScore).toBeGreaterThan(thin.fitScore);
    expect(strong.fitStatus).not.toBe(thin.fitStatus);
    expect(strong.keyRisksIdentified).not.toEqual(thin.keyRisksIdentified);
    expect(strong.reasoning).not.toBe(thin.reasoning);
  });

  it("derives risks from the specific challenges selected", () => {
    const audit = analyzeFitDiagnostic({
      ...baseInput,
      challenges: ["Lack of audit trail & decision evidence"],
    });
    const voice = analyzeFitDiagnostic({
      ...baseInput,
      challenges: ["Multilingual / Hindi code-switching complexity"],
    });

    expect(audit.keyRisksIdentified).not.toEqual(voice.keyRisksIdentified);
    expect(audit.keyRisksIdentified.join(" ")).toMatch(/evidence/i);
    expect(voice.keyRisksIdentified.join(" ")).toMatch(/code-switching/i);
  });

  it("flags a timeline shorter than a responsible sprint cycle", () => {
    const urgent = analyzeFitDiagnostic({ ...baseInput, timeline: "Urgent (1-2 Weeks)" });
    const planned = analyzeFitDiagnostic({ ...baseInput, timeline: "1-2 Months" });

    expect(urgent.fitScore).toBeLessThan(planned.fitScore);
    expect(urgent.keyRisksIdentified.join(" ")).toMatch(/timeline/i);
  });

  it("is willing to say the fit is weak and point at the cheaper answer", () => {
    const analysis = analyzeFitDiagnostic({
      ...baseInput,
      challenges: ["Difficulty scaling repeated decisions"],
      currentWorkaround: "",
      timeline: "Urgent (1-2 Weeks)",
      teamSize: "1-10 People",
    });

    expect(analysis.fitStatus).toBe("Probably not yet");
    expect(analysis.reasoning).toMatch(/rule engine/i);
    expect(analysis.estimatedDurationDays).toBe("To be scoped on the fit call");
  });

  it("says there is nothing to go on when no challenge is selected", () => {
    const analysis = analyzeFitDiagnostic({ ...baseInput, challenges: [] });

    expect(analysis.reasoning).toMatch(/little to go on/i);
  });

  it("keeps the score within a sane range at both extremes", () => {
    const everything = analyzeFitDiagnostic({
      ...baseInput,
      challenges: [
        "Unstructured PDFs and spreadsheet mismatches",
        "High manual review overhead & human errors",
        "AI agent security & compliance uncertainty",
        "Multilingual / Hindi code-switching complexity",
        "Lack of audit trail & decision evidence",
        "Difficulty scaling repeated decisions",
      ],
      teamSize: "50+ Enterprise",
    });

    expect(everything.fitScore).toBeLessThanOrEqual(95);
    expect(everything.fitScore).toBeGreaterThanOrEqual(5);
    // Even a maximal answer set stays a self-assessment, not a delivered finding.
    expect(everything.evidenceLevelToDeliver).toBe("Researched/Designed");
  });

  it("caps the number of risks surfaced", () => {
    const analysis = analyzeFitDiagnostic({
      ...baseInput,
      challenges: Object.keys({
        "Unstructured PDFs and spreadsheet mismatches": 1,
        "High manual review overhead & human errors": 1,
        "AI agent security & compliance uncertainty": 1,
        "Lack of audit trail & decision evidence": 1,
      }),
      timeline: "Urgent (1-2 Weeks)",
    });

    expect(analysis.keyRisksIdentified.length).toBeLessThanOrEqual(4);
  });
});

it("builds an encoded email handoff from the diagnostic inputs", () => {
  const input: FitDiagnosticInput = {
    ...baseInput,
    workflowType: "Voice AI & Conversational Systems",
    challenges: [
      "Multilingual / Hindi code-switching complexity",
      "Lack of audit trail & decision evidence",
    ],
  };
  const analysis = analyzeFitDiagnostic(input);
  const url = new URL(buildFitCallMailto(input, analysis));

  expect(url.protocol).toBe("mailto:");
  expect(url.pathname).toBe("akhilesh@vipratech.in");
  expect(url.searchParams.get("subject")).toContain(input.workflowType);

  const body = url.searchParams.get("body") ?? "";
  expect(body).toContain("Multilingual / Hindi code-switching complexity");
  expect(body).toContain("Voice AI Feasibility Sprint");
  // The handoff must not present the score as a verified finding (S10.2).
  expect(body).toContain("Self-assessment result");
});
