import { useState } from "react";
import { AlertTriangle, ArrowRight, Check, CheckCircle2, Copy, FileCheck, Info } from "lucide-react";
import type { DiagnosticAnalysis, FitDiagnosticInput } from "../types";
import { COMPANY_INFO, SERVICE_OFFERS } from "../data/companyData";
import {
  analyzeFitDiagnostic,
  buildFitCallMailto,
  buildFitCallSummary,
} from "../diagnostic/fitDiagnostic";
import { Button } from "./ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/Dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/Select";

const CHALLENGE_OPTIONS = [
  "Unstructured PDFs and spreadsheet mismatches",
  "High manual review overhead & human errors",
  "AI agent security & compliance uncertainty",
  "Multilingual / Hindi code-switching complexity",
  "Lack of audit trail & decision evidence",
  "Difficulty scaling repeated decisions",
];

const TIMELINES = ["Urgent (1-2 Weeks)", "1-2 Months", "Q3/Q4 Roadmap"];
const TEAM_SIZES = ["1-10 People", "10-50 People", "50+ Enterprise"];

interface FitDiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialWorkflow?: string;
  /** The control that opened the dialog, so focus can be handed back to it. */
  returnFocusTo?: HTMLElement | null;
}

export function FitDiagnosticModal({
  isOpen,
  onClose,
  initialWorkflow,
  returnFocusTo,
}: FitDiagnosticModalProps) {
  const [workflowType, setWorkflowType] = useState(initialWorkflow ?? SERVICE_OFFERS[0].title);
  // Nothing is pre-filled: pre-selected answers produced lead data the visitor
  // never actually chose (docs/05-ui-ux-spec.md S10.3).
  const [challenges, setChallenges] = useState<string[]>([]);
  const [currentWorkaround, setCurrentWorkaround] = useState("");
  const [timeline, setTimeline] = useState(TIMELINES[1]);
  const [teamSize, setTeamSize] = useState(TEAM_SIZES[1]);
  const [analysis, setAnalysis] = useState<DiagnosticAnalysis | null>(null);
  const [copied, setCopied] = useState(false);

  // Drives the honest framing of a weak result (see the result header below).
  const isWeakFit = analysis?.fitStatus === "Probably not yet";

  const diagnosticInput: FitDiagnosticInput = {
    workflowType,
    challenges,
    currentWorkaround,
    timeline,
    teamSize,
  };

  const toggleChallenge = (item: string) =>
    setChallenges((current) =>
      current.includes(item)
        ? current.filter((challenge) => challenge !== item)
        : [...current, item],
    );

  const handleCopy = async () => {
    if (!analysis) return;
    try {
      await navigator.clipboard.writeText(buildFitCallSummary(diagnosticInput, analysis));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked by permissions; the mailto link and the
      // visible address below both still work.
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        aria-describedby="fit-diagnostic-description"
        // Radix does not hand focus back on its own here: the dialog is
        // controlled and portalled with no DialogTrigger to return to, so
        // closing left keyboard users on <body> (WCAG 2.4.3, spec S7.1).
        // Restore explicitly to whatever opened it.
        onCloseAutoFocus={(event) => {
          if (!returnFocusTo?.isConnected) return;
          event.preventDefault();
          returnFocusTo.focus();
        }}
      >
        <div className="border-b border-hairline bg-surface/50 p-6 pr-16">
          <p className="font-mono text-xs font-bold uppercase tracking-(--tracking-eyebrow) text-brand">
            Fit diagnostic
          </p>
          <DialogTitle className="mt-1.5">
            A two-minute structured self-assessment
          </DialogTitle>
          <DialogDescription id="fit-diagnostic-description" className="mt-1.5">
            Answer four questions and we will show you what a sprint would cover — including if we
            think you don&apos;t need one.
          </DialogDescription>
        </div>

        <div className="p-6">
          {!analysis ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="workflow-type"
                    className="mb-2 block font-mono text-xs font-bold uppercase tracking-wider text-ink-subtle"
                  >
                    1. Target workflow area
                  </label>
                  <Select value={workflowType} onValueChange={setWorkflowType}>
                    <SelectTrigger id="workflow-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICE_OFFERS.map((service) => (
                        <SelectItem key={service.id} value={service.title}>
                          {service.diagnosticLabel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <fieldset>
                  <legend className="mb-2 font-mono text-xs font-bold uppercase tracking-wider text-ink-subtle">
                    2. Which of these apply?
                  </legend>
                  <div className="space-y-2">
                    {CHALLENGE_OPTIONS.map((item) => {
                      const selected = challenges.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => toggleChallenge(item)}
                          className={`flex min-h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${
                            selected
                              ? "border-brand/50 bg-brand/10 text-ink"
                              : "border-hairline bg-surface/60 text-ink-subtle hover:border-hairline-strong hover:text-ink"
                          }`}
                        >
                          <span>{item}</span>
                          {selected && (
                            <CheckCircle2
                              className="size-4 shrink-0 text-brand"
                              aria-hidden="true"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              </div>

              <div className="flex flex-col space-y-5">
                <div>
                  <label
                    htmlFor="current-workaround"
                    className="mb-2 block font-mono text-xs font-bold uppercase tracking-wider text-ink-subtle"
                  >
                    3. How is this handled today?
                  </label>
                  <textarea
                    id="current-workaround"
                    rows={4}
                    value={currentWorkaround}
                    onChange={(event) => setCurrentWorkaround(event.target.value)}
                    placeholder="e.g. Two people reconcile spreadsheets by hand each morning and email the mismatches."
                    className="w-full rounded-xl border border-hairline bg-surface p-3 text-sm text-ink placeholder:text-ink-subtle focus:border-brand focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="timeline"
                      className="mb-2 block font-mono text-xs font-bold uppercase tracking-wider text-ink-subtle"
                    >
                      Timeline
                    </label>
                    <Select value={timeline} onValueChange={setTimeline}>
                      <SelectTrigger id="timeline">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TIMELINES.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label
                      htmlFor="team-size"
                      className="mb-2 block font-mono text-xs font-bold uppercase tracking-wider text-ink-subtle"
                    >
                      Team size
                    </label>
                    <Select value={teamSize} onValueChange={setTeamSize}>
                      <SelectTrigger id="team-size">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TEAM_SIZES.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-auto space-y-4">
                  <p className="rounded-xl border border-hairline bg-surface/80 p-4 text-sm text-ink-muted">
                    If your problem is better solved deterministically, or without AI at all, the
                    result will say so.
                  </p>

                  <Button
                    size="lg"
                    className="w-full"
                    disabled={challenges.length === 0}
                    onClick={() => setAnalysis(analyzeFitDiagnostic(diagnosticInput))}
                  >
                    See my result
                  </Button>
                  {challenges.length === 0 && (
                    <p className="text-center text-sm text-ink-subtle">
                      Select at least one item above to continue.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="flex gap-3 rounded-xl border border-info/30 bg-info/10 p-4 text-sm text-ink-muted">
                <Info className="mt-0.5 size-4 shrink-0 text-info" aria-hidden="true" />
                <span>
                  This is a structured self-assessment based on what you entered — not a verified
                  finding. Everything below is a starting point for the fit call, not a commitment.
                </span>
              </p>

              {/*
                A weak result must not headline the sprint it has just advised
                against. Presenting "Probably not yet" above a recommended
                sprint contradicts the answer the visitor was given.
              */}
              <div className="flex flex-col gap-4 rounded-2xl border border-hairline bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`grid size-16 shrink-0 place-items-center rounded-2xl border font-mono text-xl font-bold tabular-nums ${
                      isWeakFit
                        ? "border-hairline-strong bg-surface-raised text-ink-subtle"
                        : "border-brand/40 bg-brand/10 text-brand"
                    }`}
                  >
                    {analysis.fitScore}
                  </div>
                  <div>
                    <p className="font-mono text-sm font-bold text-ink">{analysis.fitStatus}</p>
                    <h3 className="mt-1 text-h3 font-bold text-ink">
                      {isWeakFit ? "No sprint recommended yet" : analysis.recommendedSprint}
                    </h3>
                    <p className="mt-1 text-sm text-ink-subtle">
                      {analysis.estimatedDurationDays}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-hairline bg-surface/60 p-4">
                  <h4 className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-brand">
                    <FileCheck className="size-4" aria-hidden="true" />
                    Where we would start
                  </h4>
                  <p className="mt-3 text-sm text-ink-muted">{analysis.recommendedArchitecture}</p>
                  <p className="mt-3 border-t border-hairline pt-3 text-sm text-ink-subtle">
                    {analysis.reasoning}
                  </p>
                </div>

                <div className="rounded-xl border border-hairline bg-surface/60 p-4">
                  <h4 className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-attention">
                    <AlertTriangle className="size-4" aria-hidden="true" />
                    What we would want to check
                  </h4>
                  {analysis.keyRisksIdentified.length > 0 ? (
                    <ul className="mt-3 space-y-2">
                      {analysis.keyRisksIdentified.map((risk) => (
                        <li key={risk} className="flex gap-2 text-sm text-ink-muted">
                          <span className="text-attention" aria-hidden="true">
                            •
                          </span>
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-sm text-ink-muted">
                      Nothing stands out from your answers yet — the fit call would go looking.
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-hairline bg-surface/80 p-4">
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-ink-subtle">
                  {isWeakFit
                    ? `If you did run the ${analysis.recommendedSprint}, it would produce`
                    : "A sprint would produce"}
                </h4>
                <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {analysis.sprintDeliverables.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 rounded-lg border border-hairline bg-ground/60 p-2.5 text-sm text-ink-muted"
                    >
                      <CheckCircle2 className="size-4 shrink-0 text-brand" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4 border-t border-hairline pt-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Button variant="tertiary" onClick={() => setAnalysis(null)}>
                    ← Change my answers
                  </Button>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Button variant="secondary" onClick={handleCopy}>
                      {copied ? (
                        <Check className="size-4 text-brand" aria-hidden="true" />
                      ) : (
                        <Copy className="size-4" aria-hidden="true" />
                      )}
                      {copied ? "Copied" : "Copy summary"}
                    </Button>
                    <Button as="a" size="lg" href={buildFitCallMailto(diagnosticInput, analysis)}>
                      Send this to VipraTech
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>

                {/* mailto: fails silently on many mobile and webmail setups, so
                    the address is always visible as a fallback (S10.4). */}
                <p className="text-sm text-ink-subtle">
                  If your mail client doesn&apos;t open, copy the summary and email it to{" "}
                  <a
                    href={`mailto:${COMPANY_INFO.email}`}
                    className="font-medium text-brand underline-offset-4 hover:underline"
                  >
                    {COMPANY_INFO.email}
                  </a>
                  .
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
