"use client";

import { motion } from "framer-motion";
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
} from "@/components/homepage";
import { ParallaxBackground } from "@/components/ui/ParallaxBackground";

export default function Home() {
  return (
    <div className="bg-[#030308] overflow-hidden">
      <HeroSection />
      <ParallaxBackground className="relative">
        <ProblemSection />
        <AuswirkungSection />
        <ZielgruppeSection />
        <LoesungSection />
        <SystemablaufSection />
        <PaketeSection />
        <WebAppsSection />
        <KostenlosSection />
      </ParallaxBackground>
      <FinalCTASection />
    </div>
  );
}
