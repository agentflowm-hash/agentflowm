import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Playground - 70+ Live APIs | AgentFlowM",
  description: "Teste alle unsere APIs live: Crypto, Wetter, Developer Tools, Generatoren und mehr. 100% kostenlos, keine Rate Limits.",
  openGraph: {
    title: "🤯 API Playground - 70+ Live APIs",
    description: "Crypto Prices, Password Generator, QR Codes, PageSpeed, und 60+ weitere APIs zum Ausprobieren.",
  },
};

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
