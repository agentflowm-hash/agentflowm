import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AgentFlowMarketing Admin - CRM & Projektmanagement Dashboard",
  description: "Professionelles Admin Dashboard für AgentFlowMarketing - Leads verwalten, Projekte steuern, Rechnungen erstellen, Kunden betreuen. KI-gestützte Marketing-Automatisierung aus Berlin.",
  robots: "noindex, nofollow",
  manifest: "/manifest.json",
  themeColor: "#FC682C",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "AgentFlowMarketing Admin Dashboard",
    description: "CRM & Projektmanagement für digitale Agenturen",
    siteName: "AgentFlowMarketing",
    type: "website",
    locale: "de_DE",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AF Admin",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
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
        <meta name="theme-color" content="#FC682C" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="canonical" href="https://admin-agentflowm.de" />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
// Build timestamp: Sat Feb 28 15:16:31 CET 2026
