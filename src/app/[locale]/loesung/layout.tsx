import { Metadata } from "next";
import { solutionSEO, getCanonicalUrl, getAlternateUrls, getOgLocale, SupportedLocale } from "@/lib/seo-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = solutionSEO[locale as SupportedLocale] || solutionSEO.en;
  const canonicalUrl = getCanonicalUrl(locale, "/loesung");
  
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        de: "https://agentflowm.de/de/loesung",
        en: "https://agentflowm.com/en/solution",
        ar: "https://agentflowm.com/ar/solution",
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
    },
  };
}

export default function SolutionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
