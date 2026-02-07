import { Metadata } from "next";
import { projectsSEO, getCanonicalUrl, getOgLocale, SupportedLocale } from "@/lib/seo-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = projectsSEO[locale as SupportedLocale] || projectsSEO.en;
  const canonicalUrl = getCanonicalUrl(locale, "/projekte");
  
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        de: "https://agentflowm.de/de/projekte",
        en: "https://agentflowm.com/en/projects",
        ar: "https://agentflowm.com/ar/projects",
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

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
