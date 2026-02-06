import type { Metadata, Viewport } from "next";
import "./mobile.css";

export const metadata: Metadata = {
  title: "AgentFlowM App",
  description: "70+ APIs in deiner Tasche. Crypto, Tools, Generatoren und mehr.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AgentFlowM",
  },
  applicationName: "AgentFlowM",
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#030308",
};

export default function MobileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mobile-app">
      {children}
    </div>
  );
}
