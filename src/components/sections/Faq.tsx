import { COMPANY_INFO, CTA, FAQS, SECTIONS } from "../../data/companyData";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/Accordion";
import { Button } from "../ui/Button";
import { Section } from "../ui/Section";

/**
 * FAQ on Radix Accordion (spec S7.3). Content now lives in companyData.ts so
 * the same entries also drive the FAQPage JSON-LD (S9.6).
 */
export function Faq() {
  return (
    <Section id="faq" intro={SECTIONS.faq}>
      <div className="max-w-4xl">
        <Accordion type="single" collapsible defaultValue="faq-0" className="space-y-4">
          {FAQS.map((faq, index) => (
            <AccordionItem key={faq.q} value={`faq-${index}`}>
              <AccordionTrigger>{faq.q}</AccordionTrigger>
              <AccordionContent>
                <p>{faq.a}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-10 flex flex-col items-start gap-4 rounded-2xl border border-hairline bg-surface/70 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-h3 font-bold text-ink">Have a workflow that isn't listed?</h3>
            <p className="mt-1.5 text-sm text-ink-muted">
              The fit call is free and we will tell you if it isn't a fit.
            </p>
          </div>
          <Button
            as="a"
            variant="secondary"
            className="shrink-0"
            href={`mailto:${COMPANY_INFO.email}?subject=${encodeURIComponent("30-minute fit call")}`}
          >
            {CTA.secondary}
          </Button>
        </div>
      </div>
    </Section>
  );
}
