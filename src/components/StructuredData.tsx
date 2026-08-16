import { COMPANY_INFO, FAQS, HERO, SERVICE_OFFERS } from "../data/companyData";
import { absoluteUrl, HOME_ROUTE, servicePath, type Route } from "../routes";

/**
 * JSON-LD for Organization, each Service, and the FAQ (spec S9.6).
 *
 * Rendered through React so the build-time prerender emits it into the static
 * HTML. Each Service carries the URL of its own page, and a service route also
 * emits a BreadcrumbList so the offer is not orphaned from the site root.
 */
export function StructuredData({ route = HOME_ROUTE }: { route?: Route }) {
  const organisation = {
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
  };

  const services = SERVICE_OFFERS.map((service) => ({
    "@type": "Service",
    "@id": `${absoluteUrl(servicePath(service.id))}#service`,
    url: absoluteUrl(servicePath(service.id)),
    name: service.title,
    description: service.description,
    serviceType: service.diagnosticLabel,
    provider: { "@id": organisation["@id"] },
    audience: { "@type": "Audience", audienceType: service.targetAudience },
  }));

  const graph: Record<string, unknown>[] = [organisation, ...services];

  if (route.serviceId) {
    const service = SERVICE_OFFERS.find((offer) => offer.id === route.serviceId);
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: COMPANY_INFO.shortName,
          item: absoluteUrl("/"),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: service?.title ?? "Service",
          item: absoluteUrl(route.path),
        },
      ],
    });
  } else {
    // The FAQ content only exists on the home page, so only claim it there.
    graph.push({
      "@type": "FAQPage",
      "@id": `${COMPANY_INFO.url}/#faq`,
      mainEntity: FAQS.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    });
  }

  return (
    <script
      type="application/ld+json"
      // Content is our own static data, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }) }}
    />
  );
}
