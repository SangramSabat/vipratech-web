import type { DiagnosticTriggerProps } from "../types";
import { Hero } from "./Hero";
import { EngagementLifecycle } from "./sections/EngagementLifecycle";
import { GovernedComparison } from "./sections/GovernedComparison";
import { Services } from "./sections/Services";
import { Products } from "./sections/Products";
import { RoutingModel } from "./sections/RoutingModel";
import { EffortCalculator } from "./sections/EffortCalculator";
import { Assurance } from "./sections/Assurance";
import { CommercialTerms } from "./sections/CommercialTerms";
import { Faq } from "./sections/Faq";
import { FinalCta } from "./sections/FinalCta";

/**
 * Section order per docs/05-ui-ux-spec.md S2.1. The engagement lifecycle now
 * sits directly after the hero rather than above the footer.
 *
 * Every section is a static import on purpose. Splitting the two interactive
 * tools out did shrink the entry chunk, but `renderToString` emits the Suspense
 * fallback rather than the component, so both sections vanished from the
 * prerendered HTML — trading the site's primary SEO fix for ~8 kB. The modal is
 * the one thing still lazy-loaded (see App.tsx): it is closed on first paint,
 * so it is absent from the initial markup either way.
 */
export function HomePage({ onOpenDiagnostic }: DiagnosticTriggerProps) {
  return (
    <>
      <Hero onOpenDiagnostic={onOpenDiagnostic} />
      <EngagementLifecycle onOpenDiagnostic={onOpenDiagnostic} />
      <GovernedComparison />
      <Services onOpenDiagnostic={onOpenDiagnostic} />
      <Products />
      <RoutingModel onOpenDiagnostic={onOpenDiagnostic} />
      <EffortCalculator onOpenDiagnostic={onOpenDiagnostic} />
      <Assurance />
      <CommercialTerms onOpenDiagnostic={onOpenDiagnostic} />
      <Faq />
      <FinalCta onOpenDiagnostic={onOpenDiagnostic} />
    </>
  );
}
