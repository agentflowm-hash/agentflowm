"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui";
import Link from "next/link";

// ═══════════════════════════════════════════════════════════════
//                    ANIMATED BACKGROUND
// ═══════════════════════════════════════════════════════════════

function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-[10%] left-[5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#FFB347]/15 to-transparent blur-[120px] animate-pulse-slow" />
      <div className="absolute top-[30%] right-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-[#FC682C]/12 to-transparent blur-[100px] animate-float-slow" />
      <div className="absolute bottom-[20%] left-[20%] w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[#9D65C9]/10 to-transparent blur-[90px] animate-pulse-slow delay-1000" />
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at center, rgba(252,104,44,0.3) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    HERO VISUALIZATION - FULLY RESPONSIVE
// ═══════════════════════════════════════════════════════════════

function SystemVisualization() {
  const [activeNode, setActiveNode] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNode((prev) => (prev + 1) % 4);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const nodes = [
    {
      icon: "🌐",
      label: "Website",
      color: "#FC682C",
    },
    {
      icon: "⚙️",
      label: "Admin",
      color: "#10B981",
    },
    {
      icon: "👤",
      label: "Kunden",
      color: "#8B5CF6",
    },
    {
      icon: "👥",
      label: "Team",
      color: "#FFB347",
    },
  ];

  return (
    <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] mx-auto">
      {/* Glow Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full blur-[60px] sm:blur-[80px] transition-colors duration-1000"
          style={{ backgroundColor: `${nodes[activeNode].color}25` }}
        />
      </div>

      {/* Main visualization container - aspect ratio 1:1 */}
      <div className="relative aspect-square">
        {/* Outer ring */}
        <div
          className="absolute inset-[10%] rounded-full border border-dashed border-white/10 animate-spin-slow"
          style={{ animationDuration: "40s" }}
        />

        {/* Middle ring */}
        <div className="absolute inset-[20%] rounded-full border border-[#FC682C]/20 animate-pulse-ring" />

        {/* Inner ring */}
        <div className="absolute inset-[30%] rounded-full bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10" />

        {/* Center Hub */}
        <div className="absolute inset-[35%] flex items-center justify-center">
          <div className="relative w-full h-full">
            {/* Glow */}
            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#FC682C] to-[#9D65C9] blur-lg sm:blur-xl opacity-50 animate-pulse" />
            {/* Hub */}
            <div className="relative w-full h-full rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#FC682C] via-[#e55a1f] to-[#9D65C9] flex items-center justify-center shadow-2xl">
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl">🔗</div>
                <div className="text-[6px] sm:text-[7px] md:text-[8px] text-white/80 font-medium uppercase tracking-wider mt-0.5">
                  System
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nodes positioned at corners */}
        {nodes.map((node, i) => {
          const isActive = activeNode === i;
          // Position: top-right, bottom-right, bottom-left, top-left
          const positions = [
            "top-0 right-0 translate-x-[10%] -translate-y-[10%]",
            "bottom-0 right-0 translate-x-[10%] translate-y-[10%]",
            "bottom-0 left-0 -translate-x-[10%] translate-y-[10%]",
            "top-0 left-0 -translate-x-[10%] -translate-y-[10%]",
          ];

          return (
            <div
              key={i}
              className={`absolute ${positions[i]} transition-all duration-500`}
              style={{
                transform: positions[i].includes("translate")
                  ? undefined
                  : "none",
              }}
            >
              <div
                className={`relative p-2 sm:p-2.5 md:p-3 rounded-xl sm:rounded-2xl backdrop-blur-xl transition-all duration-500 cursor-pointer ${
                  isActive ? "scale-110" : "hover:scale-105"
                }`}
                style={{
                  background: isActive
                    ? `${node.color}20`
                    : "rgba(255,255,255,0.05)",
                  border: `1px solid ${isActive ? node.color + "60" : "rgba(255,255,255,0.1)"}`,
                  boxShadow: isActive ? `0 0 20px ${node.color}40` : "none",
                }}
                onMouseEnter={() => setActiveNode(i)}
                onClick={() => setActiveNode(i)}
              >
                <div className="text-center">
                  <div
                    className={`text-lg sm:text-xl md:text-2xl transition-transform duration-300 ${isActive ? "scale-110" : ""}`}
                  >
                    {node.icon}
                  </div>
                  <div className="text-[8px] sm:text-[9px] md:text-[10px] font-semibold text-white mt-0.5">
                    {node.label}
                  </div>
                </div>
              </div>

              {/* Connection line to center */}
              <div
                className="absolute top-1/2 left-1/2 w-8 sm:w-12 md:w-16 h-px origin-left transition-all duration-500 pointer-events-none"
                style={{
                  transform: `rotate(${[225, 135, 45, 315][i]}deg)`,
                  background: `linear-gradient(90deg, ${isActive ? node.color : "rgba(255,255,255,0.1)"}, transparent)`,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Stats Row */}
      <div className="relative z-10 mt-4 sm:mt-6 grid grid-cols-3 gap-2 sm:gap-3">
        {[
          { value: "100%", label: "Responsive", icon: "📱" },
          { value: "A+", label: "Performance", icon: "⚡" },
          { value: "24/7", label: "Online", icon: "🌍" },
        ].map((stat, i) => (
          <div
            key={i}
            className="group text-center p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white/[0.03] border border-white/5 hover:border-[#FC682C]/30 hover:bg-white/[0.05] transition-all duration-300"
          >
            <div className="text-xs sm:text-sm group-hover:scale-110 transition-transform duration-300">
              {stat.icon}
            </div>
            <div className="text-sm sm:text-base font-bold text-white group-hover:text-[#FC682C] transition-colors">
              {stat.value}
            </div>
            <div className="text-[7px] sm:text-[8px] md:text-[9px] text-white/40 uppercase tracking-wider">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    HERO SECTION
// ═══════════════════════════════════════════════════════════════

function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative pt-20 sm:pt-24 md:pt-28 pb-8 sm:pb-12 md:pb-16 overflow-hidden">
      <AnimatedBackground />

      <div className="container relative z-10 px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-12">
          {/* Left - Text */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <div
              className={`inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[#FC682C]/10 border border-[#FC682C]/20 mb-4 sm:mb-5 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <span className="text-[#FC682C] text-[10px] sm:text-xs">🟠</span>
              <span className="text-[10px] sm:text-xs font-medium text-[#FC682C]">
                Systemlucken • Reibung • verlorene Anfragen
              </span>
            </div>

            {/* H1 */}
            <h1
              className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 leading-tight transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <span className="text-white">Ihre Website bremst.</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FC682C] via-[#FFB347] to-[#FC682C]">
                Wir bauen ein System, das verkauft.
              </span>
            </h1>

            {/* Subheadline */}
            <p
              className={`text-xs sm:text-sm md:text-base text-white/70 max-w-xl mx-auto lg:mx-0 mb-4 sm:mb-6 leading-relaxed transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              Wenn Anfragen versanden und niemand Uberblick hat, liegt das
              Problem am System dahinter.
            </p>

            {/* Chips - Hidden on mobile, shown on sm+ */}
            <div
              className={`hidden sm:flex flex-wrap justify-center lg:justify-start gap-2 mb-6 transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              {[
                "High-Quality SEO",
                "Live-ready Setup",
                "Admin-Portal",
                "Portale je nach Paket",
              ].map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] sm:text-xs text-white/80"
                >
                  <svg
                    className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {chip}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div
              className={`flex flex-col sm:flex-row justify-center lg:justify-start gap-2 sm:gap-3 mb-3 sm:mb-4 transition-all duration-700 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <Link
                href="/termin"
                className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg bg-gradient-to-r from-[#FC682C] to-[#e55a1f] text-white text-xs sm:text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-[#FC682C]/25 text-center"
              >
                Termin buchen
              </Link>
              <Link
                href="/website-check"
                className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg border border-white/20 text-white text-xs sm:text-sm font-semibold hover:bg-white/5 transition-all text-center"
              >
                Kostenloser Check
              </Link>
            </div>

            {/* Kaufsignal */}
            <p
              className={`text-[10px] sm:text-xs text-[#FC682C]/80 transition-all duration-700 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              Begrenzte Projekt-Slots pro Monat
            </p>
          </div>

          {/* Right - Visualization */}
          <div
            className={`flex-1 w-full transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
          >
            <SystemVisualization />
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    WAS FEHLT MEISTENS SECTION
// ═══════════════════════════════════════════════════════════════

function ProblemSection() {
  const problems = [
    {
      icon: "🚫",
      title: "Unklare Führung",
      desc: "Besucher sehen Inhalte, aber keinen sicheren nächsten Schritt.",
    },
    {
      icon: "📂",
      title: "Kein Backend-System",
      desc: "Inhalte/Anfragen/Status sind nicht sauber organisiert.",
    },
    {
      icon: "🔒",
      title: "Kein Portal",
      desc: "Kunden/Mitarbeiter brauchen Zugriff, aber es gibt keinen klaren Bereich.",
    },
    {
      icon: "📈",
      title: "Wachstum ohne Struktur",
      desc: "Sobald mehr passiert, kippt es in Chaos.",
    },
  ];

  return (
    <section className="py-12 sm:py-16 border-t border-white/5">
      <div className="container px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3">
              Warum starke Angebote trotzdem verlieren
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {problems.map((problem, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-[#FC682C]/30 transition-all"
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">{problem.icon}</span>
                  <div>
                    <h3 className="font-semibold text-white text-sm mb-1">
                      {problem.title}
                    </h3>
                    <p className="text-xs text-white/60">{problem.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-white/70 bg-[#FC682C]/10 border border-[#FC682C]/20 rounded-lg px-4 py-3">
            Ein gutes System macht aus Interesse Kontakt – und aus Kontakt
            Abschluss.
          </p>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    WAS WIR LIEFERN SECTION
// ═══════════════════════════════════════════════════════════════

function WhatWeDeliverSection() {
  const sections = [
    {
      title: "Website",
      subtitle: "(Front, das verkauft)",
      color: "#FC682C",
      items: [
        "klare Seitenlogik (ohne Umwege)",
        "Texte & CTAs, die Besucher zur Aktion führen",
        "High-Quality SEO + Performance als Standard",
        "mobil perfekt, schnelle Ladezeiten, sauberer Aufbau",
      ],
    },
    {
      title: "Admin-Portal",
      subtitle: "(Standard)",
      color: "#10B981",
      items: [
        "Inhalte pflegen (Seiten, Texte, Medien)",
        "Anfragen/Leads im Überblick (je nach Setup)",
        "Struktur & Rollen sauber organisiert (paketabhängig)",
      ],
    },
    {
      title: "Portale",
      subtitle: "(je nach Paket)",
      color: "#8B5CF6",
      items: [
        "Kundenportal: Freigaben, Uploads, Status, Dokumente (projektabhängig)",
        "Mitarbeiterportal: Aufgaben, Zuständigkeiten, interne Bereiche (projektabhängig)",
      ],
    },
  ];

  return (
    <section className="py-12 sm:py-16 border-t border-white/5 bg-gradient-to-b from-transparent via-[#FC682C]/5 to-transparent">
      <div className="container px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3">
              Website + Backend + Portale – sauber strukturiert
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {sections.map((section, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] relative overflow-hidden"
              >
                <div
                  className="absolute top-0 right-0 w-20 h-20 rounded-full blur-3xl opacity-20"
                  style={{ backgroundColor: section.color }}
                />
                <div className="relative">
                  <h3
                    className="font-bold text-white text-sm mb-0.5"
                    style={{ color: section.color }}
                  >
                    {section.title}
                  </h3>
                  <p className="text-[10px] text-white/50 mb-3">
                    {section.subtitle}
                  </p>
                  <ul className="space-y-2">
                    {section.items.map((item, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2 text-xs text-white/70"
                      >
                        <span style={{ color: section.color }}>🟠</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-white/80 font-medium">
            Sie bekommen nicht nur eine Website, sondern ein System, das außen
            überzeugt und innen Ordnung schafft.
          </p>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    PAKETE SECTION
// ═══════════════════════════════════════════════════════════════

function PackagesSection() {
  const packages = [
    {
      id: "start",
      name: "START",
      icon: "🚀",
      subtitle: "Website + Admin",
      price: "5.390",
      billing: "einmalig",
      color: "#FFB347",
      gradient: "from-[#FFB347] to-[#FF9500]",
      forWho: "Schneller, professioneller Start",
      features: [
        "Landingpage + 2 Unterseiten",
        "High-Quality SEO",
        "Kontakt- & Terminfluss",
        "Live-ready Setup",
        "Admin-Portal (Basis)",
      ],
      cta: "Start wahlen",
      href: "/termin?paket=start",
    },
    {
      id: "business",
      name: "BUSINESS",
      icon: "⚡",
      subtitle: "Website + Admin + Portale",
      price: "11.990",
      billing: "einmalig",
      color: "#FC682C",
      gradient: "from-[#FC682C] to-[#e55a1f]",
      popular: true,
      forWho: "Wachstum mit Struktur",
      features: [
        "Bis zu 9 Seiten",
        "High-Quality SEO + Performance",
        "Admin-Portal (erweitert)",
        "Kundenportal",
        "Mitarbeiterportal",
        "Live-ready + Betriebsstart",
      ],
      cta: "Business wahlen",
      href: "/termin?paket=business",
    },
    {
      id: "konfigurator",
      name: "KONFIGURATOR",
      icon: "💎",
      subtitle: "Individuell",
      price: "auf Anfrage",
      billing: "",
      color: "#9D65C9",
      gradient: "from-[#9D65C9] to-[#7C3AED]",
      forWho: "Massgeschneiderte Losung",
      features: [
        "Beliebig viele Seiten",
        "Zusatzliche Portale",
        "Buchung & Dashboard",
        "Interne Tools",
        "System-Erweiterungen",
      ],
      isCustom: true,
      cta: "Angebot anfragen",
      href: "/termin?paket=konfigurator",
    },
  ];

  return (
    <section className="py-16 sm:py-20 border-t border-white/5 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-[#FFB347]/10 via-[#FC682C]/10 to-[#9D65C9]/10 blur-[100px] rounded-full" />
      </div>

      <div className="container px-4 sm:px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FC682C]/10 to-[#9D65C9]/10 border border-[#FC682C]/20 mb-4">
              <span className="text-sm">🌐</span>
              <span className="text-xs font-medium text-white/80">
                Websites + Portale
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">
              Wahlen Sie Ihr Paket
            </h2>
            <p className="text-sm text-white/60 max-w-lg mx-auto">
              Klarer Umfang. Fester Preis. Professionelle Umsetzung.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg, index) => (
              <div
                key={pkg.id}
                className={`group relative rounded-2xl transition-all duration-500 hover:-translate-y-2 ${
                  pkg.popular ? "md:-mt-4 md:mb-4" : ""
                }`}
              >
                {/* Glow effect for popular */}
                {pkg.popular && (
                  <div className="absolute -inset-[1px] bg-gradient-to-b from-[#FC682C] via-[#FC682C]/50 to-transparent rounded-2xl opacity-60 blur-sm" />
                )}

                {/* Card */}
                <div
                  className={`relative h-full p-6 rounded-2xl backdrop-blur-xl border transition-all duration-300 ${
                    pkg.popular
                      ? "bg-gradient-to-b from-[#FC682C]/15 to-[#030308] border-[#FC682C]/40"
                      : "bg-white/[0.03] border-white/[0.08] hover:border-white/20 hover:bg-white/[0.05]"
                  }`}
                >
                  {/* Popular badge */}
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#FC682C] to-[#e55a1f] text-white text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-[#FC682C]/30">
                        Beliebteste Wahl
                      </div>
                    </div>
                  )}

                  {/* Icon & Header */}
                  <div className="text-center mb-6 pt-2">
                    <div
                      className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 text-2xl transition-transform duration-300 group-hover:scale-110`}
                      style={{
                        background: `linear-gradient(135deg, ${pkg.color}20, ${pkg.color}05)`,
                        border: `1px solid ${pkg.color}30`,
                      }}
                    >
                      {pkg.icon}
                    </div>
                    <h3
                      className="text-xl font-bold mb-1"
                      style={{ color: pkg.color }}
                    >
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-white/50">{pkg.subtitle}</p>
                  </div>

                  {/* Price */}
                  <div className="text-center mb-6">
                    {pkg.isCustom ? (
                      <div className="text-2xl font-bold text-white">
                        {pkg.price}
                      </div>
                    ) : (
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-3xl sm:text-4xl font-bold text-white">
                          {pkg.price}
                        </span>
                        <span className="text-lg text-white/50">€</span>
                      </div>
                    )}
                    {pkg.billing && (
                      <p className="text-xs text-white/40 mt-1">
                        {pkg.billing}
                      </p>
                    )}
                  </div>

                  {/* For who */}
                  <div className="text-center mb-6">
                    <span
                      className="inline-block px-3 py-1.5 rounded-full text-[10px] font-medium"
                      style={{
                        background: `${pkg.color}15`,
                        color: pkg.color,
                      }}
                    >
                      {pkg.forWho}
                    </span>
                  </div>

                  {/* Divider */}
                  <div
                    className="h-px w-full mb-6"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${pkg.color}30, transparent)`,
                    }}
                  />

                  {/* Features */}
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ background: `${pkg.color}20` }}
                        >
                          <svg
                            className="w-3 h-3"
                            style={{ color: pkg.color }}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="text-sm text-white/70">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTAs */}
                  <div className="space-y-2 mt-auto">
                    <Link
                      href={pkg.href}
                      className={`block w-full text-center py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                        pkg.popular
                          ? `bg-gradient-to-r ${pkg.gradient} text-white shadow-lg shadow-[#FC682C]/25 hover:shadow-[#FC682C]/40 hover:scale-[1.02]`
                          : "border border-white/20 text-white hover:bg-white/10"
                      }`}
                    >
                      {pkg.cta}
                    </Link>
                    <Link
                      href={`/pakete/${pkg.id}`}
                      className="block w-full text-center py-2 text-xs text-white/40 hover:text-white transition-colors"
                    >
                      Details ansehen →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-12">
            {[
              { icon: "🔒", text: "Festpreis-Garantie" },
              { icon: "✨", text: "Keine versteckten Kosten" },
              { icon: "🚀", text: "Schnelle Umsetzung" },
            ].map((badge, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-sm text-white/50"
              >
                <span>{badge.icon}</span>
                <span>{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    APPS & SOFTWARE SECTION - PREMIUM
// ═══════════════════════════════════════════════════════════════

function AppsSection() {
  const apps = [
    {
      id: "webapp",
      name: "Web-App",
      icon: "🌐",
      subtitle: "Festpreis",
      price: "26.990",
      color: "#06b6d4",
      gradient: "from-[#06b6d4] to-[#0891b2]",
      desc: "Browserbasiertes System mit Logins, Rollen, Bereichen – produktionsreif umgesetzt.",
      highlight: "Browser-basiert",
      features: [
        "Konzept & Struktur (Screens, Rollen, Logik)",
        "UI/UX (modern, responsive)",
        "Umsetzung der Funktionen im vereinbarten Umfang",
        "Test & Qualitatscheck",
        "Go-live-Vorbereitung",
        "Ubergabe nach Abschluss",
      ],
      cta: "Web-App anfragen",
    },
    {
      id: "mobile",
      name: "Mobile App",
      icon: "📱",
      subtitle: "iOS/Android (Festpreis)",
      price: "51.490",
      color: "#8B5CF6",
      gradient: "from-[#8B5CF6] to-[#7C3AED]",
      popular: true,
      desc: "Komplette App-Umsetzung als stabiles System – skalierbar und sauber ubergeben.",
      highlight: "Store-ready",
      features: [
        "Konzept & Struktur (User-Flows, Screens, Rollen)",
        "Mobile-first UI/UX",
        "Umsetzung der Funktionen im vereinbarten Umfang",
        "Tests & Stabilitatscheck",
        "Veroffentlichungsvorbereitung",
        "Ubergabe nach Abschluss",
      ],
      cta: "App anfragen",
    },
    {
      id: "custom",
      name: "Enterprise",
      icon: "🏢",
      subtitle: "auf Anfrage",
      price: null,
      color: "#FFB347",
      gradient: "from-[#FFB347] to-[#FF9500]",
      desc: "Wenn Umfang/Teams/Module grosser sind: Kurz-Analyse, Roadmap, Angebot mit Meilensteinen.",
      highlight: "Massgeschneidert",
      features: [
        "Individuelle Analyse",
        "Skalierbare Architektur",
        "Team-Integration",
        "Langzeit-Support",
      ],
      cta: "Projekt prufen lassen",
    },
  ];

  return (
    <section className="py-16 sm:py-20 border-t border-white/5 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-[#06b6d4]/10 via-[#8B5CF6]/10 to-[#FFB347]/10 blur-[100px] rounded-full" />
      </div>

      <div className="container px-4 sm:px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#8B5CF6]/10 to-[#06b6d4]/10 border border-[#8B5CF6]/20 mb-4">
              <span className="text-sm">📱</span>
              <span className="text-xs font-medium text-white/80">
                Apps & Software
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">
              Web-Apps & Mobile Apps
            </h2>
            <p className="text-sm text-white/60 max-w-lg mx-auto">
              Komplette Systeme – von der Idee bis zum Go-live.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {apps.map((app) => (
              <div
                key={app.id}
                className={`group relative rounded-2xl transition-all duration-500 hover:-translate-y-2 ${
                  app.popular ? "md:-mt-4 md:mb-4" : ""
                }`}
              >
                {/* Glow effect for popular */}
                {app.popular && (
                  <div className="absolute -inset-[1px] bg-gradient-to-b from-[#8B5CF6] via-[#8B5CF6]/50 to-transparent rounded-2xl opacity-60 blur-sm" />
                )}

                {/* Card */}
                <div
                  className={`relative h-full p-6 rounded-2xl backdrop-blur-xl border transition-all duration-300 ${
                    app.popular
                      ? "bg-gradient-to-b from-[#8B5CF6]/15 to-[#030308] border-[#8B5CF6]/40"
                      : "bg-white/[0.03] border-white/[0.08] hover:border-white/20 hover:bg-white/[0.05]"
                  }`}
                >
                  {/* Popular badge */}
                  {app.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-[#8B5CF6]/30">
                        Komplettlosung
                      </div>
                    </div>
                  )}

                  {/* Icon & Header */}
                  <div className="text-center mb-5 pt-2">
                    <div
                      className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 text-2xl transition-transform duration-300 group-hover:scale-110"
                      style={{
                        background: `linear-gradient(135deg, ${app.color}20, ${app.color}05)`,
                        border: `1px solid ${app.color}30`,
                      }}
                    >
                      {app.icon}
                    </div>
                    <h3
                      className="text-xl font-bold mb-1"
                      style={{ color: app.color }}
                    >
                      {app.name}
                    </h3>
                    <p className="text-xs text-white/50">{app.subtitle}</p>
                  </div>

                  {/* Price */}
                  <div className="text-center mb-5">
                    {app.price ? (
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-3xl sm:text-4xl font-bold text-white">
                          {app.price}
                        </span>
                        <span className="text-lg text-white/50">€</span>
                      </div>
                    ) : (
                      <div className="text-2xl font-bold text-white">
                        auf Anfrage
                      </div>
                    )}
                  </div>

                  {/* Highlight badge */}
                  <div className="text-center mb-5">
                    <span
                      className="inline-block px-3 py-1.5 rounded-full text-[10px] font-medium"
                      style={{
                        background: `${app.color}15`,
                        color: app.color,
                      }}
                    >
                      {app.highlight}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-white/60 text-center mb-5 leading-relaxed">
                    {app.desc}
                  </p>

                  {/* Divider */}
                  <div
                    className="h-px w-full mb-5"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${app.color}30, transparent)`,
                    }}
                  />

                  {/* Features */}
                  <ul className="space-y-2.5 mb-6">
                    {app.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ background: `${app.color}20` }}
                        >
                          <svg
                            className="w-3 h-3"
                            style={{ color: app.color }}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="text-sm text-white/70">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTAs */}
                  <div className="space-y-2 mt-auto">
                    <Link
                      href={`/termin?paket=${app.id}`}
                      className={`block w-full text-center py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                        app.popular
                          ? `bg-gradient-to-r ${app.gradient} text-white shadow-lg shadow-[#8B5CF6]/25 hover:shadow-[#8B5CF6]/40 hover:scale-[1.02]`
                          : "border border-white/20 text-white hover:bg-white/10"
                      }`}
                    >
                      {app.cta}
                    </Link>
                    <Link
                      href={`/pakete/${app.id}`}
                      className="block w-full text-center py-2 text-xs text-white/40 hover:text-white transition-colors"
                    >
                      Details ansehen →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-12">
            {[
              { icon: "🔐", text: "Sicherer Code" },
              { icon: "📦", text: "Komplette Ubergabe" },
              { icon: "🛠️", text: "Wartbar & Skalierbar" },
            ].map((badge, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-sm text-white/50"
              >
                <span>{badge.icon}</span>
                <span>{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    SERVICEGEBÜHREN SECTION
// ═══════════════════════════════════════════════════════════════

function ServiceSection() {
  return (
    <section className="py-12 sm:py-16 border-t border-white/5">
      <div className="container px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.08]">
            <h2 className="text-base sm:text-lg font-bold text-white mb-3">
              Service-Aktivierungen (falls nötig) – auf Anfrage
            </h2>
            <p className="text-xs text-white/60 mb-4">
              Bestimmte Aktivierungen können je nach Projektumfang gesondert
              berechnet werden – z. B. wenn externe Konten, besondere
              Plattform-Freigaben oder komplexe Setups erforderlich sind. Wir
              nennen das vorher transparent, damit am Ende alles 100% sauber
              läuft.
            </p>
            <ul className="space-y-2">
              {[
                "Plattform-/Konto-Freigaben & Sonder-Setups",
                "zusätzliche Systembereiche außerhalb Paketumfang",
                "besondere Integrationsanforderungen (projektabhängig)",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-xs text-white/70"
                >
                  <span className="text-[#FC682C]">🟠</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    ZAHLUNG SECTION
// ═══════════════════════════════════════════════════════════════

function PaymentSection() {
  const steps = [
    { num: "1", text: "Paket wählen oder Termin buchen" },
    {
      num: "2",
      text: "Sofortzahlung oder Rechnung (nach Angebot/Bestätigung)",
    },
    { num: "3", text: "Projektstart sobald Zahlung + Freigaben vorliegen" },
  ];

  return (
    <section className="py-12 sm:py-16 border-t border-white/5">
      <div className="container px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-6">
            Sofort starten – in 3 Schritten
          </h2>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
            {steps.map((step, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/[0.08]"
              >
                <span className="w-8 h-8 rounded-full bg-[#FC682C]/20 flex items-center justify-center text-[#FC682C] text-sm font-bold">
                  {step.num}
                </span>
                <span className="text-xs text-white/80">{step.text}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-[#FC682C]/80">
            ⚠️ Start-Slots sind begrenzt. Wer zuerst reserviert, startet zuerst.
          </p>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    COMPARISON TABLE - NEUE PAKETE
// ═══════════════════════════════════════════════════════════════

function ComparisonSection() {
  const features = [
    {
      name: "Seiten",
      start: "1-3",
      business: "bis 9",
      konfigurator: "Unbegrenzt",
    },
    {
      name: "Design & Entwicklung",
      start: true,
      business: true,
      konfigurator: true,
    },
    {
      name: "Responsive (alle Gerate)",
      start: true,
      business: true,
      konfigurator: true,
    },
    {
      name: "High-Quality SEO",
      start: true,
      business: true,
      konfigurator: true,
    },
    {
      name: "Admin-Portal",
      start: "Basis",
      business: "Erweitert",
      konfigurator: "Komplett",
    },
    { name: "Kundenportal", start: false, business: true, konfigurator: true },
    {
      name: "Mitarbeiterportal",
      start: false,
      business: true,
      konfigurator: true,
    },
    {
      name: "Buchungssystem",
      start: false,
      business: false,
      konfigurator: true,
    },
    {
      name: "Individuelle Tools",
      start: false,
      business: false,
      konfigurator: true,
    },
    {
      name: "Umsetzungszeit",
      start: "1-2 Wo.",
      business: "3-4 Wo.",
      konfigurator: "Nach Umfang",
    },
  ];

  const renderCell = (
    value: boolean | string,
    color: string,
    isHighlighted: boolean = false,
  ) => {
    if (typeof value === "boolean") {
      return value ? (
        <span
          className={`inline-flex w-4 h-4 sm:w-5 sm:h-5 rounded-full items-center justify-center`}
          style={{ backgroundColor: color }}
        >
          <svg
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </span>
      ) : (
        <span className="text-white/30">—</span>
      );
    }
    return (
      <span
        className={`text-[10px] sm:text-xs ${isHighlighted ? "font-medium text-white/90" : "text-white/70"}`}
      >
        {value}
      </span>
    );
  };

  return (
    <section className="py-10 sm:py-12 md:py-16 border-t border-white/5">
      <div className="container px-4 sm:px-6">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3">
            Pakete im Vergleich
          </h2>
          <p className="text-[10px] sm:text-xs md:text-sm text-white/60">
            Alle wichtigen Features auf einen Blick
          </p>
        </div>

        <div className="max-w-4xl mx-auto overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[400px] text-[10px] sm:text-xs md:text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-2 sm:p-3 text-[10px] sm:text-xs font-medium text-white/50 w-[30%]">
                  Feature
                </th>
                <th className="p-2 sm:p-3 text-center w-[23%]">
                  <div className="flex flex-col items-center">
                    <span className="text-[#FFB347] font-bold text-[10px] sm:text-xs">
                      START
                    </span>
                    <span className="text-[8px] sm:text-[10px] text-white/40">
                      5.390 €
                    </span>
                  </div>
                </th>
                <th className="p-2 sm:p-3 text-center w-[23%] bg-[#FC682C]/5 rounded-t-lg">
                  <div className="flex flex-col items-center">
                    <span className="text-[#FC682C] font-bold text-[10px] sm:text-xs">
                      BUSINESS
                    </span>
                    <span className="text-[8px] sm:text-[10px] text-[#FC682C]/70">
                      Empfohlen
                    </span>
                    <span className="text-[8px] sm:text-[10px] text-white/40">
                      11.990 €
                    </span>
                  </div>
                </th>
                <th className="p-2 sm:p-3 text-center w-[23%]">
                  <div className="flex flex-col items-center">
                    <span className="text-[#9D65C9] font-bold text-[10px] sm:text-xs">
                      KONFIGURATOR
                    </span>
                    <span className="text-[8px] sm:text-[10px] text-white/40">
                      auf Anfrage
                    </span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, i) => (
                <tr
                  key={i}
                  className="border-t border-white/5 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="p-2 sm:p-3 text-[10px] sm:text-xs text-white/70">
                    {feature.name}
                  </td>
                  <td className="p-2 sm:p-3 text-center">
                    {renderCell(feature.start, "#FFB347")}
                  </td>
                  <td className="p-2 sm:p-3 text-center bg-[#FC682C]/5">
                    {renderCell(feature.business, "#FC682C", true)}
                  </td>
                  <td className="p-2 sm:p-3 text-center">
                    {renderCell(feature.konfigurator, "#9D65C9")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CTA unter Tabelle */}
        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 mt-6 sm:mt-8">
          <Link
            href="/termin?paket=start"
            className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg border border-[#FFB347]/30 text-[#FFB347] text-[10px] sm:text-xs font-semibold hover:bg-[#FFB347]/10 transition-all text-center"
          >
            START wahlen
          </Link>
          <Link
            href="/termin?paket=business"
            className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg bg-gradient-to-r from-[#FC682C] to-[#e55a1f] text-white text-[10px] sm:text-xs font-semibold hover:opacity-90 transition-all text-center shadow-lg shadow-[#FC682C]/20"
          >
            BUSINESS wahlen
          </Link>
          <Link
            href="/termin?paket=konfigurator"
            className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg border border-[#9D65C9]/30 text-[#9D65C9] text-[10px] sm:text-xs font-semibold hover:bg-[#9D65C9]/10 transition-all text-center"
          >
            Individuell anfragen
          </Link>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    FINAL CTA SECTION
// ═══════════════════════════════════════════════════════════════

function FinalCTA() {
  return (
    <section className="py-12 sm:py-16 border-t border-white/5 bg-gradient-to-t from-[#FC682C]/5 to-transparent">
      <div className="container px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3">
            Wollen Sie ein System, das verkauft – und intern Ordnung schafft?
          </h2>
          <p className="text-sm text-white/60 mb-6">
            Starten Sie kostenlos mit dem Webseitencheck oder buchen Sie einen
            Termin. Danach wissen Sie klar, welches Paket passt – und was als
            Nächstes Sinn macht.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/website-check"
              className="px-5 py-3 rounded-lg bg-gradient-to-r from-[#FC682C] to-[#e55a1f] text-white text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-[#FC682C]/25 text-center"
            >
              Kostenloser Webseitencheck
            </Link>
            <Link
              href="/termin"
              className="px-5 py-3 rounded-lg border border-white/20 text-white text-sm font-semibold hover:bg-white/5 transition-all text-center"
            >
              Termin buchen
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    MAIN PAGE
// ═══════════════════════════════════════════════════════════════

export default function PaketePage() {
  return (
    <>
      <style jsx global>{`
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.6;
          }
          50% {
            opacity: 0.3;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.1;
          }
          100% {
            transform: scale(1);
            opacity: 0.3;
          }
        }
        .animate-ping-slow {
          animation: ping-slow 3s ease-in-out infinite;
        }
        @keyframes ping-slower {
          0% {
            transform: scale(1);
            opacity: 0.2;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.05;
          }
          100% {
            transform: scale(1);
            opacity: 0.2;
          }
        }
        .animate-ping-slower {
          animation: ping-slower 4s ease-in-out infinite;
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        @keyframes pulse-ring {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.15;
          }
        }
        .animate-pulse-ring {
          animation: pulse-ring 2s ease-in-out infinite;
        }
        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>

      <HeroSection />
      <ProblemSection />
      <WhatWeDeliverSection />
      <PackagesSection />
      <AppsSection />
      <ServiceSection />
      <PaymentSection />
      <ComparisonSection />
      <FinalCTA />
    </>
  );
}
