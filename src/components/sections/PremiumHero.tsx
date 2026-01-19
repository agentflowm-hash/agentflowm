"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { AccentWord, OrangeGlowButton } from "@/components/ui";
import { HeroOrbFallback } from "@/components/3d/HeroOrbFallback";

// ============================================
// PREMIUM HERO SECTION - With CSS Orb
// ============================================

export function PremiumHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: prefersReducedMotion ? 0 : delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-[var(--color-bg)]"
      aria-label="Hero Section"
    >
      {/* CSS Animated Orb - Right side */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 right-[-10%] sm:right-[0%] md:right-[5%] lg:right-[8%] -translate-y-1/2 w-[200px] h-[200px] sm:w-[280px] sm:h-[280px] md:w-[350px] md:h-[350px] lg:w-[400px] lg:h-[400px] xl:w-[450px] xl:h-[450px] opacity-50 sm:opacity-70 md:opacity-100">
          <HeroOrbFallback className="w-full h-full" />
        </div>
      </div>

      {/* Orange Orb Backgrounds */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="orange-orb orange-orb-1" aria-hidden="true" />
        <div className="orange-orb orange-orb-2" aria-hidden="true" />
      </div>

      {/* Noise overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }}
        aria-hidden="true"
      />

      {/* Main content */}
      <motion.div
        className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-12"
        style={{ opacity }}
      >
        <div className="flex items-center min-h-screen py-16 sm:py-20 lg:py-24">
          {/* Left - Text Content */}
          <motion.div
            className="max-w-xl space-y-6"
            style={{ y: prefersReducedMotion ? 0 : y }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-card"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={0}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-accent)]"></span>
              </span>
              <span className="text-sm text-[var(--color-text-muted)] font-medium">
                Webseiten &bull; Automatisierung &bull; Leads
              </span>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              className="text-[var(--font-hero)] font-bold leading-[1.08] tracking-tight"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={0.1}
            >
              <span className="text-[var(--color-text)]">Mehr Anfragen.</span>
              <AccentWord
                left=""
                accent="Weniger"
                right="Aufwand."
                className="block"
              />
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              className="text-[var(--font-hero-sub)] text-[var(--color-text-muted)] max-w-xl leading-relaxed"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={0.2}
            >
              Wir bauen Webseiten, die konvertieren — und Workflows, die Ihnen
              Zeit zurückgeben. Keine verlorenen Leads, keine manuelle Arbeit.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 pt-2"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={0.3}
            >
              <OrangeGlowButton
                label="Termin buchen"
                href="/termin"
                variant="primary"
                icon={
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                }
              />
              <OrangeGlowButton
                label="Website-Check"
                href="/website-check"
                variant="outline"
              />
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              className="flex flex-wrap gap-x-5 sm:gap-x-8 gap-y-3 pt-4 sm:pt-6 border-t border-[var(--color-border)]"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={0.5}
            >
              {[
                { label: "Projekte ab", value: "1.390 €" },
                { label: "Lieferzeit", value: "2–6 Wochen" },
                { label: "Betreuung", value: "Persönlich" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col">
                  <span className="text-[11px] text-[var(--color-text-muted2)] uppercase tracking-wider">
                    {item.label}
                  </span>
                  <span className="text-[var(--color-text)] font-medium tabular-nums">
                    {item.value}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <span className="text-[10px] text-[var(--color-text-muted2)] uppercase tracking-[0.2em]">
          Scroll
        </span>
        <motion.div
          className="w-5 h-8 border border-[var(--color-border)] rounded-full flex justify-center pt-1.5"
          animate={prefersReducedMotion ? {} : { opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-1.5 bg-[var(--color-accent)] rounded-full"
            animate={prefersReducedMotion ? {} : { y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

export default PremiumHero;
