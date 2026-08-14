import { lazy, Suspense, useRef, useState } from "react";
import { HomePage } from "./components/HomePage";
import { ServiceDetail } from "./pages/ServiceDetail";
import { SERVICE_OFFERS } from "./data/companyData";
import { HOME_ROUTE, type Route } from "./routes";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { StructuredData } from "./components/StructuredData";

/** The modal is only ever needed after a click, so it stays out of the entry
 *  chunk along with everything it imports (spec S9.2). */
const FitDiagnosticModal = lazy(() =>
  import("./components/FitDiagnosticModal").then((m) => ({ default: m.FitDiagnosticModal })),
);

export default function App({ route = HOME_ROUTE }: { route?: Route }) {
  const service = route.serviceId
    ? SERVICE_OFFERS.find((offer) => offer.id === route.serviceId)
    : undefined;

  const [workflow, setWorkflow] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  // Mounted lazily on first use, then kept mounted (see below).
  const [hasOpened, setHasOpened] = useState(false);
  // Bumped per opening so each visit to the diagnostic starts from a blank form.
  const [openCount, setOpenCount] = useState(0);
  // Whatever the visitor activated to open the dialog, so focus can go back.
  const triggerRef = useRef<HTMLElement | null>(null);

  const handleOpenDiagnostic = (nextWorkflow = "") => {
    triggerRef.current = document.activeElement as HTMLElement | null;
    setWorkflow(nextWorkflow);
    setHasOpened(true);
    setOpenCount((count) => count + 1);
    setIsOpen(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-ground font-sans text-ink selection:bg-brand selection:text-black">
      <StructuredData route={route} />

      {/* First focusable element on the page (spec S7.6) */}
      <a
        href="#main"
        className="sr-only rounded-lg bg-brand px-4 py-2 font-semibold text-black focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
      >
        Skip to content
      </a>

      <SiteHeader />

      <main id="main" className="flex-1">
        {service ? (
          <ServiceDetail service={service} onOpenDiagnostic={handleOpenDiagnostic} />
        ) : (
          <HomePage onOpenDiagnostic={handleOpenDiagnostic} />
        )}
      </main>

      <SiteFooter />

      {/*
        Mounted from the first open onward and left mounted while closed, so the
        dialog can run its own close lifecycle (dismissable-layer teardown,
        scroll-lock release) instead of having the subtree removed mid-commit.
        The `key` changes per opening rather than on close, so the form starts
        blank each visit without disturbing the closing transition.

        Focus restoration is handled explicitly via `returnFocusTo` — keeping the
        subtree mounted alone did not fix it (spec S7.1, amendment 2026-08-14/6).
      */}
      {hasOpened && (
        <Suspense fallback={null}>
          <FitDiagnosticModal
            key={`${workflow}-${openCount}`}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            initialWorkflow={workflow || undefined}
            returnFocusTo={triggerRef.current}
          />
        </Suspense>
      )}
    </div>
  );
}
