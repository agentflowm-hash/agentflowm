"use client";

import {
  HeroSectionV2,
  ProblemSection,
  AuswirkungSection,
  ZielgruppeSection,
  LoesungSection,
  SystemablaufSection,
  PaketeSection,
  WebAppsSection,
  KostenlosSection,
  FinalCTASection,
  LiveAPISection,
} from "@/components/homepage";
import { ParallaxBackground } from "@/components/ui/ParallaxBackground";

export default function Home() {
  return (
    <div className="bg-[#030308] overflow-hidden">
      <HeroSectionV2 />
      <ParallaxBackground className="relative">
        <ProblemSection />
        <AuswirkungSection />
        <ZielgruppeSection />
        <LoesungSection />
        <SystemablaufSection />
        <LiveAPISection />
        <PaketeSection />
        <WebAppsSection />
        <KostenlosSection />
      </ParallaxBackground>
      <FinalCTASection />
    </div>
  );
}
