"use client";

import {
  HeroSection,
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
import { AnimatedStats } from "@/components/AnimatedStats";
import { ROICalculator } from "@/components/ROICalculator";

export default function Home() {
  return (
    <div className="bg-[#030308] overflow-hidden">
      <HeroSection />
      <AnimatedStats />
      <ParallaxBackground className="relative">
        <ProblemSection />
        <AuswirkungSection />
        <ZielgruppeSection />
        <LoesungSection />
        
        {/* ROI Calculator Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <ROICalculator />
          </div>
        </section>
        
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
