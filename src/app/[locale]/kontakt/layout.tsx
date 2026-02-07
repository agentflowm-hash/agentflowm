import { Metadata } from "next";
import { contactSEO, getCanonicalUrl, getOgLocale, SupportedLocale } from "@/lib/seo-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = contactSEO[locale as SupportedLocale] || contactSEO.en;
  const canonicalUrl = getCanonicalUrl(locale, "/kontakt");
  
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        de: "https://agentflowm.de/de/kontakt",
        en: "https://agentflowm.com/en/contact",
        ar: "https://agentflowm.com/ar/contact",
      },
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: canonicalUrl,
      siteName: "AgentFlowMarketing",
      locale: getOgLocale(locale),
      type: "website",
      images: [{ url: "/brand/banner-dark-1024x576.png", width: 1200, height: 630, alt: seo.title }],
    },
    twitter: { card: "summary_large_image", title: seo.title, description: seo.description },
  };
}

// Contact page JSON-LD
function ContactJsonLd({ locale }: { locale: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": locale === "de" ? "Kontakt" : locale === "ar" ? "اتصل بنا" : "Contact",
    "description": contactSEO[locale as SupportedLocale]?.description || contactSEO.en.description,
    "mainEntity": {
      "@type": "Organization",
      "name": "AgentFlowMarketing",
      "telephone": "+49-179-949-8247",
      "email": "kontakt@agentflowm.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Achillesstraße 69A",
        "addressLocality": "Berlin",
        "postalCode": "13125",
        "addressCountry": "DE"
      },
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "+49-179-949-8247",
          "contactType": "sales",
          "availableLanguage": ["German", "English", "Arabic"]
        },
        {
          "@type": "ContactPoint",
          "url": "https://wa.me/491799498247",
          "contactType": "customer service",
          "availableLanguage": ["German", "English", "Arabic"]
        }
      ]
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function ContactLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <>
      <ContactJsonLd locale={locale} />
      {children}
    </>
  );
}
