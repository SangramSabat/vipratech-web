import { COMPANY_INFO, FAQS, HERO, SERVICE_OFFERS } from "../data/companyData";

/**
 * JSON-LD for Organization, each Service, and the FAQ (spec S9.6).
 *
 * Rendered through React so the build-time prerender emits it into the static
 * HTML — the FAQ accordion already held the content, it simply was not exposed
 * to crawlers in any machine-readable form.
 */
export function StructuredData() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${COMPANY_INFO.url}/#organization`,
        name: COMPANY_INFO.name,
        alternateName: COMPANY_INFO.shortName,
        url: COMPANY_INFO.url,
        email: COMPANY_INFO.email,
        telephone: COMPANY_INFO.phone,
        description: HERO.lead,
        founder: { "@type": "Person", name: COMPANY_INFO.founder },
        address: {
          "@type": "PostalAddress",
          streetAddress: "Plot No. 1, Vikas Nagar, Nanta Road, Kunhari",
          addressLocality: "Kota",
          addressRegion: "Rajasthan",
          addressCountry: "IN",
        },
      },
      ...SERVICE_OFFERS.map((service) => ({
        "@type": "Service",
        "@id": `${COMPANY_INFO.url}/#${service.id}`,
        name: service.title,
        description: service.description,
        serviceType: service.diagnosticLabel,
        provider: { "@id": `${COMPANY_INFO.url}/#organization` },
        audience: { "@type": "Audience", audienceType: service.targetAudience },
      })),
      {
        "@type": "FAQPage",
        "@id": `${COMPANY_INFO.url}/#faq`,
        mainEntity: FAQS.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Content is our own static data, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
