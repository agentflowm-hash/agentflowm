import { Metadata } from "next";
import { packagesSEO, getCanonicalUrl, getAlternateUrls, getOgLocale, SupportedLocale } from "@/lib/seo-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = packagesSEO[locale as SupportedLocale] || packagesSEO.en;
  const path = locale === "de" ? "/pakete" : "/packages";
  const canonicalUrl = getCanonicalUrl(locale, "/pakete");
  
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        de: "https://agentflowm.de/de/pakete",
        en: "https://agentflowm.com/en/packages",
        ar: "https://agentflowm.com/ar/packages",
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
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: ["/brand/banner-dark-1024x576.png"],
    },
  };
}

// JSON-LD for packages/pricing
function PackagesJsonLd({ locale }: { locale: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Website & Workflow Packages",
    "description": locale === "de" 
      ? "Professionelle Website-Pakete mit Workflows & Automatisierung"
      : "Professional website packages with workflows & automation",
    "brand": { "@type": "Brand", "name": "AgentFlowMarketing" },
    "offers": [
      {
        "@type": "Offer",
        "name": "START",
        "price": "3790",
        "priceCurrency": "EUR",
        "description": "Landingpage + 2 Unterseiten, SEO, Admin-Portal",
        "availability": "https://schema.org/InStock"
      },
      {
        "@type": "Offer", 
        "name": "BUSINESS",
        "price": "8390",
        "priceCurrency": "EUR",
        "description": "Bis zu 9 Seiten, Portale, Workflows",
        "availability": "https://schema.org/InStock"
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function PackagesLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <>
      <PackagesJsonLd locale={locale} />
      {children}
    </>
  );
}
