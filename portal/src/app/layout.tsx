import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kundenportal | AgentFlowMarketing",
  description: "Ihr Projektportal - Status, Dateien & Kommunikation",
  robots: "noindex, nofollow",
};

// Root layout - only used for non-locale routes (like API routes)
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
