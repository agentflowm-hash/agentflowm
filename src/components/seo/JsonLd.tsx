"use client";

interface OrganizationJsonLdProps {
  locale?: string;
}

export function OrganizationJsonLd({ locale = "de" }: OrganizationJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AgentFlowMarketing",
    alternateName: "AgentFlow Marketing",
    url: locale === "de" ? "https://agentflowm.de" : "https://agentflowm.com",
    logo: "https://agentflowm.com/brand/logo-primary-dark.png",
    image: "https://agentflowm.com/brand/banner-dark-1024x576.png",
    description:
      locale === "de"
        ? "Professionelle Websites, smarte Workflows und nahtlose Integrationen aus Berlin."
        : "Professional websites, smart workflows and seamless integrations from Berlin.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Achillesstraße 69A",
      addressLocality: "Berlin",
      postalCode: "13125",
      addressCountry: "DE",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+49-179-949-8247",
      contactType: "sales",
      email: "kontakt@agentflowm.com",
      availableLanguage: ["German", "English", "Arabic"],
    },
    sameAs: [
      "https://wa.me/491799498247",
    ],
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: 52.52,
        longitude: 13.405,
      },
      geoRadius: "500",
    },
    priceRange: "€€€",
    foundingDate: "2024",
    founder: {
      "@type": "Person",
      name: "Alex Shaer",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface LocalBusinessJsonLdProps {
  locale?: string;
}

export function LocalBusinessJsonLd({ locale = "de" }: LocalBusinessJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "AgentFlowMarketing",
    image: "https://agentflowm.com/brand/banner-dark-1024x576.png",
    "@id": "https://agentflowm.de",
    url: locale === "de" ? "https://agentflowm.de" : "https://agentflowm.com",
    telephone: "+49-179-949-8247",
    email: "kontakt@agentflowm.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Achillesstraße 69A",
      addressLocality: "Berlin",
      postalCode: "13125",
      addressRegion: "Berlin",
      addressCountry: "DE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 52.5937,
      longitude: 13.4645,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    priceRange: "€€€",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      reviewCount: "12",
    },
    areaServed: ["Berlin", "Deutschland", "DACH"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Website & Workflow Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "START Paket",
            description: "Landingpage + 2 Unterseiten, SEO, Admin-Portal",
          },
          price: "3790",
          priceCurrency: "EUR",
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "BUSINESS Paket",
            description: "Bis zu 9 Seiten, Portale, Workflows",
          },
          price: "8390",
          priceCurrency: "EUR",
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ServiceJsonLdProps {
  serviceName: string;
  description: string;
  price?: string;
  locale?: string;
}

export function ServiceJsonLd({
  serviceName,
  description,
  price,
  locale = "de",
}: ServiceJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: serviceName,
    description: description,
    provider: {
      "@type": "Organization",
      name: "AgentFlowMarketing",
      url: locale === "de" ? "https://agentflowm.de" : "https://agentflowm.com",
    },
    areaServed: {
      "@type": "Country",
      name: "Germany",
    },
    ...(price && {
      offers: {
        "@type": "Offer",
        price: price,
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface WebsiteJsonLdProps {
  locale?: string;
}

export function WebsiteJsonLd({ locale = "de" }: WebsiteJsonLdProps) {
  const baseUrl = locale === "de" ? "https://agentflowm.de" : "https://agentflowm.com";
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AgentFlowMarketing",
    alternateName: "AgentFlow",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    inLanguage: locale === "de" ? "de-DE" : locale === "ar" ? "ar" : "en",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BreadcrumbJsonLdProps {
  items: Array<{ name: string; url: string }>;
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface FAQJsonLdProps {
  faqs: Array<{ question: string; answer: string }>;
}

export function FAQJsonLd({ faqs }: FAQJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
