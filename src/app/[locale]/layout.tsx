import type { Metadata } from "next";
import { Inter, Noto_Sans_Arabic } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import "@/styles/globals.css";
import { LayoutWrapper } from "@/components/layout";
import { locales, localeDirection, type Locale } from "@/i18n/config";
import {
  OrganizationJsonLd,
  LocalBusinessJsonLd,
  WebsiteJsonLd,
} from "@/components/seo";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://agentflowm.com";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages();
  const meta = messages.meta as Record<string, string>;

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: meta.title,
      template: "%s | AgentFlowMarketing",
    },
    description: meta.description,
    keywords: meta.keywords?.split(", ") || [],
    authors: [{ name: "AgentFlowMarketing" }],
    creator: "AgentFlowMarketing",
    publisher: "AgentFlowMarketing",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: BASE_URL,
      languages: {
        en: `${BASE_URL}/en`,
        ar: `${BASE_URL}/ar`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: BASE_URL,
      siteName: "AgentFlowMarketing",
      locale: locale === "ar" ? "ar_SA" : "en_US",
      type: "website",
      images: [
        {
          url: "/brand/banner-dark-1024x576.png",
          width: 1024,
          height: 576,
          alt: "AgentFlowMarketing - Websites & Workflows",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: ["/brand/banner-dark-1024x576.png"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const messages = await getMessages();
  const direction = localeDirection[locale as Locale];
  const fontClass =
    locale === "ar"
      ? `${notoArabic.variable} font-arabic`
      : `${inter.variable} font-sans`;

  return (
    <html
      lang={locale}
      dir={direction}
      className="dark"
      data-theme="dark"
    >
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="theme-color" content="#030308" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          href="/favicon-32x32.png"
          type="image/png"
          sizes="32x32"
        />
        <link
          rel="icon"
          href="/favicon-16x16.png"
          type="image/png"
          sizes="16x16"
        />
        <link rel="apple-touch-icon" href="/brand/favicon-180.png" />
      </head>
      <body className={fontClass}>
        {/* JSON-LD Structured Data for SEO */}
        <OrganizationJsonLd locale={locale} />
        <LocalBusinessJsonLd locale={locale} />
        <WebsiteJsonLd locale={locale} />
        
        <NextIntlClientProvider messages={messages}>
          {/* Skip Link for keyboard navigation - Accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[var(--color-accent)] focus:text-white focus:rounded-lg focus:outline-none"
          >
            {locale === "ar" ? "انتقل للمحتوى الرئيسي" : "Skip to main content"}
          </a>

          <LayoutWrapper locale={locale as Locale}>{children}</LayoutWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
