import { lazy, Suspense, useState } from "react";
import { HomePage } from "./components/HomePage";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { StructuredData } from "./components/StructuredData";

/** The modal is only ever needed after a click, so it stays out of the entry
 *  chunk along with everything it imports (spec S9.2). */
const FitDiagnosticModal = lazy(() =>
  import("./components/FitDiagnosticModal").then((m) => ({ default: m.FitDiagnosticModal })),
);

export default function App() {
  const [diagnosticWorkflow, setDiagnosticWorkflow] = useState<string | null>(null);
  const isOpen = diagnosticWorkflow !== null;

  return (
    <div className="flex min-h-screen flex-col bg-ground font-sans text-ink selection:bg-brand selection:text-black">
      <StructuredData />

      {/* First focusable element on the page (spec S7.6) */}
      <a
        href="#main"
        className="sr-only rounded-lg bg-brand px-4 py-2 font-semibold text-black focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
      >
        Skip to content
      </a>

      <SiteHeader />

      <main id="main" className="flex-1">
        <HomePage onOpenDiagnostic={(workflow = "") => setDiagnosticWorkflow(workflow)} />
      </main>

      <SiteFooter />

      {isOpen && (
        <Suspense fallback={null}>
          <FitDiagnosticModal
            key={diagnosticWorkflow}
            isOpen={isOpen}
            onClose={() => setDiagnosticWorkflow(null)}
            initialWorkflow={diagnosticWorkflow || undefined}
          />
        </Suspense>
      )}
    </div>
  );
}
