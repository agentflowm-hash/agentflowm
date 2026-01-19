"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import {
  WebseitenVisual,
  PublishingVisual,
  LeadsVisual,
} from "../3d/ServiceVisuals";

// ============================================
// SERVICE DATA
// ============================================

const services = [
  {
    title: "Webseiten",
    subtitle: "Schnell. Klar. Überzeugend.",
    description:
      "Responsive Seiten mit klarer Struktur, die konvertieren. SEO-optimiert, performance-fokussiert, mobile-first.",
    features: [
      "One Page oder Multi-Page",
      "Mobile-First Design",
      "Kontaktformular & Terminbuchung",
      "SEO-Grundlagen inklusive",
    ],
    visualType: "webseiten" as const,
    accentColor: "cyan",
  },
  {
    title: "Publishing-Agent",
    subtitle: "Content. Workflow. Veröffentlichung.",
    description:
      "Inhalte planen, freigeben und veröffentlichen. Klare Prozesse, automatisierte Abläufe, volle Kontrolle.",
    features: [
      "Plan → Freigabe → Veröffentlichung",
      "Vorlagen & Templates",
      "Automatisches Tracking-Setup",
      "Multi-Kanal Publishing",
    ],
    visualType: "publishing" as const,
    accentColor: "purple",
  },
  {
    title: "Leads-Generator",
    subtitle: "Anfragen. Qualifizieren. Konvertieren.",
    description:
      "Anfragen strukturiert erfassen, automatisch qualifizieren und Follow-up systematisieren.",
    features: [
      "Eingang → Status → Follow-up",
      "Intelligentes Routing",
      "Automatisierte Nachfassung",
      "Übergabe-Dokumentation",
    ],
    visualType: "leads" as const,
    accentColor: "orange",
  },
];

const accentStyles = {
  cyan: {
    gradient: "from-[#FC682C] to-[#e55a1f]",
    glow: "shadow-[0_0_60px_rgba(252,104,44,0.15)]",
    dot: "bg-[#FC682C]",
    text: "text-[#FC682C]",
  },
  purple: {
    gradient: "from-[#FC682C] to-[#e55a1f]",
    glow: "shadow-[0_0_60px_rgba(252,104,44,0.15)]",
    dot: "bg-[#FC682C]",
    text: "text-[#FC682C]",
  },
  orange: {
    gradient: "from-[#FC682C] to-[#e55a1f]",
    glow: "shadow-[0_0_60px_rgba(252,104,44,0.15)]",
    dot: "bg-[#FC682C]",
    text: "text-[#FC682C]",
  },
};

// ============================================
// SERVICE VISUAL COMPONENT
// Renders the appropriate CSS visual
// ============================================

interface ServiceVisualProps {
  visualType: "webseiten" | "publishing" | "leads";
}

function ServiceVisual({ visualType }: ServiceVisualProps) {
  const className = "w-full h-full flex items-center justify-center p-4";

  switch (visualType) {
    case "webseiten":
      return <WebseitenVisual className={className} />;
    case "publishing":
      return <PublishingVisual className={className} />;
    case "leads":
      return <LeadsVisual className={className} />;
    default:
      return null;
  }
}

// ============================================
// PREMIUM SERVICES SECTION
// ============================================

export function PremiumServices() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className="relative py-16 sm:py-24 md:py-32 bg-[#030308] overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 -left-64 w-[600px] h-[600px] rounded-full blur-[150px] opacity-10"
          style={{
            background:
              "radial-gradient(circle, rgba(252, 104, 44, 0.5) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-1/4 -right-64 w-[500px] h-[500px] rounded-full blur-[120px] opacity-10"
          style={{
            background:
              "radial-gradient(circle, rgba(252, 104, 44, 0.4) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-24">
          <motion.span
            className="inline-block text-sm text-white/50 uppercase tracking-[0.15em] mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Was wir liefern
          </motion.span>
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Drei Bausteine. <span className="text-[#FC682C]">Ein System.</span>
          </motion.h2>
          <motion.p
            className="text-base text-white/60 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Einzeln buchbar oder als komplettes Paket. Jeder Baustein
            funktioniert eigenständig — zusammen sind sie unschlagbar.
          </motion.p>
        </div>

        {/* Services - Alternating layout */}
        <div className="space-y-16 sm:space-y-24 md:space-y-32">
          {services.map((service, index) => {
            const styles =
              accentStyles[service.accentColor as keyof typeof accentStyles];
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={service.title}
                className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                {/* Text Content */}
                <div
                  className={`space-y-6 ${isEven ? "lg:order-1" : "lg:order-2"}`}
                >
                  {/* Number badge */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#FC682C]">
                      0{index + 1}
                    </span>
                    <div
                      className={`h-px flex-1 bg-gradient-to-r ${styles.gradient} opacity-30`}
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl md:text-3xl font-bold text-white">
                    {service.title}
                  </h3>

                  {/* Subtitle */}
                  <p className={`text-lg font-medium ${styles.text}`}>
                    {service.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-white/60 text-base leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-3 pt-4">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <span
                          className={`w-2 h-2 rounded-full ${styles.dot}`}
                        />
                        <span className="text-white/70">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CSS Visual - Lightweight, no 3D */}
                <div
                  className={`relative ${isEven ? "lg:order-2" : "lg:order-1"}`}
                >
                  <div
                    className={`relative h-[280px] sm:h-[320px] md:h-[400px] rounded-2xl sm:rounded-3xl bg-white/[0.02] border border-white/[0.05] overflow-hidden ${styles.glow}`}
                  >
                    <ServiceVisual visualType={service.visualType} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-12 sm:mt-16 md:mt-24 pt-8 sm:pt-12 md:pt-16 border-t border-white/5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-white/30 text-sm mb-6">
            Alle Workflows arbeiten nach klaren Regeln — nicht autonom ohne
            Freigabe.
          </p>
          <a
            href="https://calendly.com/agentflowm/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 rounded-full text-white font-medium hover:bg-white/10 hover:border-white/20 transition-all duration-300"
          >
            <span>Alle Leistungen besprechen</span>
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
          </a>
        </motion.div>
      </div>
    </section>
  );
}
