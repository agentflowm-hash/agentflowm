"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
  {
    number: "01",
    title: "Gespräch",
    description:
      "Wir hören zu und verstehen Ihre Anforderungen. Kostenloses Erstgespräch, unverbindlich.",
    duration: "30 min",
  },
  {
    number: "02",
    title: "Konzept & Angebot",
    description:
      "Klarer Plan mit Sitemap, Zeitrahmen und Festpreis. Keine versteckten Kosten.",
    duration: "2-3 Tage",
  },
  {
    number: "03",
    title: "Umsetzung",
    description:
      "Wir bauen. Sie bekommen regelmäßige Updates und können Feedback geben.",
    duration: "1-8 Wochen",
  },
  {
    number: "04",
    title: "Launch & Übergabe",
    description:
      "Go-Live, Dokumentation und Einweisung. Plus Support für einen reibungslosen Start.",
    duration: "inkl. Support",
  },
];

export function ModernProcess() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-advance steps when visible
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <section
      ref={sectionRef}
      className="relative py-16 sm:py-24 md:py-32 bg-[#0a0a0a]"
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-10 sm:mb-16 md:mb-20">
          <span className="inline-block text-sm text-white/50 uppercase tracking-[0.15em] mb-4">
            So läuft&apos;s ab
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Klarer Prozess in 4 Schritten
          </h2>
          <p className="text-base text-white/60 max-w-2xl mx-auto">
            Von der Idee zum Launch. Transparent und ohne Umwege.
          </p>
        </div>

        {/* Process steps */}
        <div className="max-w-4xl mx-auto">
          {/* Progress bar */}
          <div className="relative h-1 bg-white/10 rounded-full mb-8 sm:mb-12 md:mb-16 overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-[#FC682C] rounded-full transition-all duration-500"
              style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
            />
          </div>

          {/* Steps grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {steps.map((step, index) => (
              <button
                key={step.number}
                onClick={() => setActiveStep(index)}
                className={`text-left p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl transition-all duration-300 ${
                  index === activeStep
                    ? "bg-white/[0.05] border border-white/10"
                    : "bg-transparent border border-transparent hover:bg-white/[0.02]"
                } ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                {/* Number */}
                <span
                  className={`text-2xl sm:text-3xl md:text-4xl font-bold transition-colors duration-300 ${
                    index === activeStep ? "text-[#FC682C]" : "text-white/20"
                  }`}
                >
                  {step.number}
                </span>

                {/* Title */}
                <h3
                  className={`text-base sm:text-lg font-semibold mt-2 sm:mt-3 mb-1 sm:mb-2 transition-colors duration-300 ${
                    index === activeStep ? "text-white" : "text-white/60"
                  }`}
                >
                  {step.title}
                </h3>

                {/* Duration badge */}
                <span
                  className={`inline-block text-[10px] sm:text-xs px-2 py-1 rounded-full mb-2 sm:mb-3 transition-colors duration-300 ${
                    index === activeStep
                      ? "bg-[#FC682C]/20 text-[#FC682C]"
                      : "bg-white/5 text-white/30"
                  }`}
                >
                  {step.duration}
                </span>

                {/* Description */}
                <p
                  className={`text-xs sm:text-sm leading-relaxed transition-colors duration-300 hidden sm:block ${
                    index === activeStep ? "text-white/70" : "text-white/50"
                  }`}
                >
                  {step.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <a
            href="https://calendly.com/agentflowm/15min"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 text-white rounded-full transition-colors border border-white/10"
          >
            <span>Erstgespräch vereinbaren</span>
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
