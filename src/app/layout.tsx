import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { LayoutWrapper } from "@/components/layout";

const inter = Inter({ subsets: ["latin"] });

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://agentflowm.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "AgentFlowMarketing - Webseiten & Workflows aus Berlin",
    template: "%s | AgentFlowMarketing",
  },
  description:
    "Professionelle Webseiten, smarte Workflows und nahtlose Schnittstellen aus Berlin. Wir automatisieren Kontakt, Veröffentlichung und Übergabe - zuverlässig und effizient.",
  keywords: [
    "Webseite",
    "Workflows",
    "Schnittstellen",
    "Berlin",
    "Automatisierung",
    "KI",
    "Webdesign",
    "n8n",
    "Next.js",
  ],
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
  },
  openGraph: {
    title: "AgentFlowMarketing - Webseiten & Workflows aus Berlin",
    description:
      "Professionelle Webseiten, smarte Workflows und nahtlose Schnittstellen. Automatisierung die funktioniert.",
    url: BASE_URL,
    siteName: "AgentFlowMarketing",
    locale: "de_DE",
    type: "website",
    images: [
      {
        url: "/brand/banner-dark-1024x576.png",
        width: 1024,
        height: 576,
        alt: "AgentFlowMarketing - Webseiten & Workflows",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AgentFlowMarketing - Webseiten & Workflows aus Berlin",
    description:
      "Professionelle Webseiten, smarte Workflows und nahtlose Schnittstellen. Automatisierung die funktioniert.",
    images: ["/brand/banner-dark-1024x576.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className="dark" data-theme="dark">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1, user-scalable=no"
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
      <body className={inter.className}>
        {/* Skip Link für Tastaturnavigation - Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[var(--color-accent)] focus:text-white focus:rounded-lg focus:outline-none"
        >
          Zum Hauptinhalt springen
        </a>

        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
