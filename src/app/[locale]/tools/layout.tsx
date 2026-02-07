import { Metadata } from "next";
import { toolsSEO, getCanonicalUrl, getOgLocale, SupportedLocale } from "@/lib/seo-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = toolsSEO[locale as SupportedLocale] || toolsSEO.en;
  const canonicalUrl = getCanonicalUrl(locale, "/tools");
  
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        de: "https://agentflowm.de/de/tools",
        en: "https://agentflowm.com/en/tools",
        ar: "https://agentflowm.com/ar/tools",
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

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
