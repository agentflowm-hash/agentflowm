"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

// Animation Background Component
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

// System Visualization Component
function SystemVisualization() {
  const t = useTranslations("pages.pakete.visualization");
  const [activeNode, setActiveNode] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNode((prev) => (prev + 1) % 4);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const nodes = [
    { icon: "🌐", label: t("website"), color: "#FC682C" },
    { icon: "⚙️", label: t("admin"), color: "#10B981" },
    { icon: "👤", label: t("customers"), color: "#8B5CF6" },
    { icon: "👥", label: t("team"), color: "#FFB347" },
  ];

  return (
    <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] mx-auto">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full blur-[60px] sm:blur-[80px] transition-colors duration-1000"
          style={{ backgroundColor: `${nodes[activeNode].color}25` }}
        />
      </div>

      <div className="relative aspect-square">
        <div
          className="absolute inset-[10%] rounded-full border border-dashed border-white/10 animate-spin-slow"
          style={{ animationDuration: "40s" }}
        />
        <div className="absolute inset-[20%] rounded-full border border-[#FC682C]/20 animate-pulse-ring" />
        <div className="absolute inset-[30%] rounded-full bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10" />

        <div className="absolute inset-[35%] flex items-center justify-center">
          <div className="relative w-full h-full">
            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#FC682C] to-[#9D65C9] blur-lg sm:blur-xl opacity-50 animate-pulse" />
            <div className="relative w-full h-full rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#FC682C] via-[#e55a1f] to-[#9D65C9] flex items-center justify-center shadow-2xl">
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl">🔗</div>
                <div className="text-[6px] sm:text-[7px] md:text-[8px] text-white/80 font-medium uppercase tracking-wider mt-0.5">
                  {t("system")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {nodes.map((node, i) => {
          const isActive = activeNode === i;
          const positions = [
            "top-0 right-0 translate-x-[10%] -translate-y-[10%]",
            "bottom-0 right-0 translate-x-[10%] translate-y-[10%]",
            "bottom-0 left-0 -translate-x-[10%] translate-y-[10%]",
            "top-0 left-0 -translate-x-[10%] -translate-y-[10%]",
          ];

          return (
            <div key={i} className={`absolute ${positions[i]} transition-all duration-500`}>
              <div
                className={`relative p-2 sm:p-2.5 md:p-3 rounded-xl sm:rounded-2xl backdrop-blur-xl transition-all duration-500 cursor-pointer ${
                  isActive ? "scale-110" : "hover:scale-105"
                }`}
                style={{
                  background: isActive ? `${node.color}20` : "rgba(255,255,255,0.05)",
                  border: `1px solid ${isActive ? node.color + "60" : "rgba(255,255,255,0.1)"}`,
                  boxShadow: isActive ? `0 0 20px ${node.color}40` : "none",
                }}
                onMouseEnter={() => setActiveNode(i)}
                onClick={() => setActiveNode(i)}
              >
                <div className="text-center">
                  <div className={`text-lg sm:text-xl md:text-2xl transition-transform duration-300 ${isActive ? "scale-110" : ""}`}>
                    {node.icon}
                  </div>
                  <div className="text-[8px] sm:text-[9px] md:text-[10px] font-semibold text-white mt-0.5">
                    {node.label}
                  </div>
                </div>
              </div>

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

      <div className="relative z-10 mt-4 sm:mt-6 grid grid-cols-3 gap-2 sm:gap-3">
        {[
          { value: "100%", label: t("responsive"), icon: "📱" },
          { value: "A+", label: t("performance"), icon: "⚡" },
          { value: "24/7", label: t("online"), icon: "🌍" },
        ].map((stat, i) => (
          <div
            key={i}
            className="group text-center p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white/[0.03] border border-white/5 hover:border-[#FC682C]/30 hover:bg-white/[0.05] transition-all duration-300"
          >
            <div className="text-xs sm:text-sm group-hover:scale-110 transition-transform duration-300">{stat.icon}</div>
            <div className="text-sm sm:text-base font-bold text-white group-hover:text-[#FC682C] transition-colors">{stat.value}</div>
            <div className="text-[7px] sm:text-[8px] md:text-[9px] text-white/40 uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Hero Section
function HeroSection() {
  const t = useTranslations("pages.pakete.hero");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const chips = [t("chips.seo"), t("chips.liveReady"), t("chips.adminPortal"), t("chips.portals")];

  return (
    <section className="relative pt-20 sm:pt-24 md:pt-28 pb-8 sm:pb-12 md:pb-16 overflow-hidden">
      <AnimatedBackground />

      <div className="container relative z-10 px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-12">
          <div className="flex-1 text-center lg:text-left">
            <div
              className={`inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[#FC682C]/10 border border-[#FC682C]/20 mb-4 sm:mb-5 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <span className="text-[#FC682C] text-[10px] sm:text-xs">🟠</span>
              <span className="text-[10px] sm:text-xs font-medium text-[#FC682C]">{t("badge")}</span>
            </div>

            <h1
              className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 leading-tight transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <span className="text-white">{t("headline1")}</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FC682C] via-[#FFB347] to-[#FC682C]">
                {t("headline2")}
              </span>
            </h1>

            <p
              className={`text-xs sm:text-sm md:text-base text-white/70 max-w-xl mx-auto lg:mx-0 mb-4 sm:mb-6 leading-relaxed transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              {t("subheadline")}
            </p>

            <div
              className={`hidden sm:flex flex-wrap justify-center lg:justify-start gap-2 mb-6 transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] sm:text-xs text-white/80"
                >
                  <svg className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {chip}
                </span>
              ))}
            </div>

            <div
              className={`flex flex-col sm:flex-row justify-center lg:justify-start gap-2 sm:gap-3 mb-3 sm:mb-4 transition-all duration-700 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <Link
                href="/termin"
                className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg bg-gradient-to-r from-[#FC682C] to-[#e55a1f] text-white text-xs sm:text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-[#FC682C]/25 text-center"
              >
                {t("ctaPrimary")}
              </Link>
              <Link
                href="/website-check"
                className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg border border-white/20 text-white text-xs sm:text-sm font-semibold hover:bg-white/5 transition-all text-center"
              >
                {t("ctaSecondary")}
              </Link>
            </div>

            <p
              className={`text-[10px] sm:text-xs text-[#FC682C]/80 transition-all duration-700 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              {t("limitedSlots")}
            </p>
          </div>

          <div className={`flex-1 w-full transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
            <SystemVisualization />
          </div>
        </div>
      </div>
    </section>
  );
}

// Problem Section
function ProblemSection() {
  const t = useTranslations("pages.pakete.problem");

  const problems = [
    { icon: "🚫", key: "unclearGuidance" },
    { icon: "📂", key: "noBackend" },
    { icon: "🔒", key: "noPortal" },
    { icon: "📈", key: "growthWithoutStructure" },
  ];

  return (
    <section className="py-12 sm:py-16 border-t border-white/5">
      <div className="container px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3">{t("headline")}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {problems.map((problem, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-[#FC682C]/30 transition-all">
                <div className="flex items-start gap-3">
                  <span className="text-xl">{problem.icon}</span>
                  <div>
                    <h3 className="font-semibold text-white text-sm mb-1">{t(`items.${problem.key}.title`)}</h3>
                    <p className="text-xs text-white/60">{t(`items.${problem.key}.desc`)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-white/70 bg-[#FC682C]/10 border border-[#FC682C]/20 rounded-lg px-4 py-3">{t("conclusion")}</p>
        </div>
      </div>
    </section>
  );
}

// What We Deliver Section
function WhatWeDeliverSection() {
  const t = useTranslations("pages.pakete.whatWeDeliver");

  const sections = [
    { key: "website", color: "#FC682C" },
    { key: "adminPortal", color: "#10B981" },
    { key: "portals", color: "#8B5CF6" },
  ];

  return (
    <section className="py-12 sm:py-16 border-t border-white/5 bg-gradient-to-b from-transparent via-[#FC682C]/5 to-transparent">
      <div className="container px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3">{t("headline")}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {sections.map((section, i) => {
              const items = t.raw(`sections.${section.key}.items`) as string[];
              return (
                <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-3xl opacity-20" style={{ backgroundColor: section.color }} />
                  <div className="relative">
                    <h3 className="font-bold text-white text-sm mb-0.5" style={{ color: section.color }}>
                      {t(`sections.${section.key}.title`)}
                    </h3>
                    <p className="text-[10px] text-white/50 mb-3">{t(`sections.${section.key}.subtitle`)}</p>
                    <ul className="space-y-2">
                      {items.map((item: string, j: number) => (
                        <li key={j} className="flex items-start gap-2 text-xs text-white/70">
                          <span style={{ color: section.color }}>🟠</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-center text-sm text-white/80 font-medium">{t("conclusion")}</p>
        </div>
      </div>
    </section>
  );
}

// 🎉 DISCOUNT CONFIG - 20% für 2 Wochen (bis 20.02.2026)
const DISCOUNT = {
  active: true,
  percent: 20,
  endDate: new Date('2026-02-20T23:59:59'),
};

// Helper to calculate discounted price
function getDiscountedPrice(originalPrice: string): string {
  const price = parseInt(originalPrice.replace(/[^0-9]/g, ''));
  const discounted = Math.round(price * (1 - DISCOUNT.percent / 100));
  return discounted.toLocaleString('de-DE');
}

// Packages Section
function PackagesSection() {
  const t = useTranslations("pages.pakete.packages");
  
  // Check if discount is active
  const isDiscountActive = DISCOUNT.active && new Date() < DISCOUNT.endDate;
  const daysRemaining = Math.ceil((DISCOUNT.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const packages = [
    {
      id: "start",
      icon: "🚀",
      color: "#FFB347",
      gradient: "from-[#FFB347] to-[#FF9500]",
      href: "/termin?paket=start",
    },
    {
      id: "business",
      icon: "⚡",
      color: "#FC682C",
      gradient: "from-[#FC682C] to-[#e55a1f]",
      popular: true,
      href: "/termin?paket=business",
    },
    {
      id: "konfigurator",
      icon: "💎",
      color: "#9D65C9",
      gradient: "from-[#9D65C9] to-[#7C3AED]",
      isCustom: true,
      href: "/termin?paket=konfigurator",
    },
  ];

  return (
    <section className="py-16 sm:py-20 border-t border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-[#FFB347]/10 via-[#FC682C]/10 to-[#9D65C9]/10 blur-[100px] rounded-full" />
      </div>

      <div className="container px-4 sm:px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Discount Banner */}
          {isDiscountActive && (
            <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#FC682C] via-[#FF8F5C] to-[#FFB347] text-white text-center shadow-xl shadow-[#FC682C]/30 animate-pulse-slow">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
                <span className="text-2xl sm:text-3xl font-black">🔥 -20% LAUNCH RABATT</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base">Nur noch</span>
                  <span className="px-3 py-1 rounded-lg bg-white/20 font-bold text-lg">{daysRemaining}</span>
                  <span className="text-sm sm:text-base">Tage!</span>
                </div>
              </div>
            </div>
          )}

          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FC682C]/10 to-[#9D65C9]/10 border border-[#FC682C]/20 mb-4">
              <span className="text-sm">🌐</span>
              <span className="text-xs font-medium text-white/80">{t("badge")}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">{t("headline")}</h2>
            <p className="text-sm text-white/60 max-w-lg mx-auto">{t("subheadline")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg) => {
              const features = t.raw(`items.${pkg.id}.features`) as string[];
              return (
                <div
                  key={pkg.id}
                  className={`group relative rounded-2xl transition-all duration-500 hover:-translate-y-2 ${pkg.popular ? "md:-mt-4 md:mb-4" : ""}`}
                >
                  {pkg.popular && (
                    <div className="absolute -inset-[1px] bg-gradient-to-b from-[#FC682C] via-[#FC682C]/50 to-transparent rounded-2xl opacity-60 blur-sm" />
                  )}

                  <div
                    className={`relative h-full p-6 rounded-2xl backdrop-blur-xl border transition-all duration-300 ${
                      pkg.popular
                        ? "bg-gradient-to-b from-[#FC682C]/15 to-[#030308] border-[#FC682C]/40"
                        : "bg-white/[0.03] border-white/[0.08] hover:border-white/20 hover:bg-white/[0.05]"
                    }`}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#FC682C] to-[#e55a1f] text-white text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-[#FC682C]/30">
                          {t("popularBadge")}
                        </div>
                      </div>
                    )}

                    <div className="text-center mb-6 pt-2">
                      <div
                        className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 text-2xl transition-transform duration-300 group-hover:scale-110"
                        style={{
                          background: `linear-gradient(135deg, ${pkg.color}20, ${pkg.color}05)`,
                          border: `1px solid ${pkg.color}30`,
                        }}
                      >
                        {pkg.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-1" style={{ color: pkg.color }}>
                        {t(`items.${pkg.id}.name`)}
                      </h3>
                      <p className="text-xs text-white/50">{t(`items.${pkg.id}.subtitle`)}</p>
                    </div>

                    <div className="text-center mb-6">
                      {pkg.isCustom ? (
                        <div className="text-2xl font-bold text-white">{t("onRequest")}</div>
                      ) : (
                        <>
                          {isDiscountActive && (
                            <div className="mb-1">
                              <span className="inline-block px-2 py-0.5 rounded bg-[#FC682C] text-white text-xs font-bold">-20%</span>
                            </div>
                          )}
                          <div className="flex items-baseline justify-center gap-1">
                            {isDiscountActive && (
                              <span className="text-lg text-white/40 line-through mr-2">{t(`items.${pkg.id}.price`)}€</span>
                            )}
                            <span className="text-3xl sm:text-4xl font-bold text-white">
                              {isDiscountActive ? getDiscountedPrice(t(`items.${pkg.id}.price`)) : t(`items.${pkg.id}.price`)}
                            </span>
                            <span className="text-lg text-white/50">€</span>
                          </div>
                        </>
                      )}
                      {!pkg.isCustom && <p className="text-xs text-white/40 mt-1">{t("oneTime")}</p>}
                    </div>

                    <div className="text-center mb-6">
                      <span
                        className="inline-block px-3 py-1.5 rounded-full text-[10px] font-medium"
                        style={{ background: `${pkg.color}15`, color: pkg.color }}
                      >
                        {t(`items.${pkg.id}.forWho`)}
                      </span>
                    </div>

                    <div className="h-px w-full mb-6" style={{ background: `linear-gradient(90deg, transparent, ${pkg.color}30, transparent)` }} />

                    <ul className="space-y-3 mb-6">
                      {features.map((feature: string, i: number) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${pkg.color}20` }}>
                            <svg className="w-3 h-3" style={{ color: pkg.color }} fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-sm text-white/70">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="space-y-2 mt-auto">
                      <Link
                        href={pkg.href as any}
                        className={`block w-full text-center py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                          pkg.popular
                            ? `bg-gradient-to-r ${pkg.gradient} text-white shadow-lg shadow-[#FC682C]/25 hover:shadow-[#FC682C]/40 hover:scale-[1.02]`
                            : "border border-white/20 text-white hover:bg-white/10"
                        }`}
                      >
                        {t(`items.${pkg.id}.cta`)}
                      </Link>
                      <Link href={`/pakete/${pkg.id}` as any} className="block w-full text-center py-2 text-xs text-white/40 hover:text-white transition-colors">
                        {t("viewDetails")} →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap justify-center gap-6 mt-12">
            {[
              { icon: "🔒", text: t("trustBadges.fixedPrice") },
              { icon: "✨", text: t("trustBadges.noHiddenCosts") },
              { icon: "🚀", text: t("trustBadges.fastImplementation") },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-white/50">
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

// Apps Section
function AppsSection() {
  const t = useTranslations("pages.pakete.apps");

  const apps = [
    {
      id: "webapp",
      icon: "🌐",
      color: "#06b6d4",
      gradient: "from-[#06b6d4] to-[#0891b2]",
    },
    {
      id: "mobile",
      icon: "📱",
      color: "#8B5CF6",
      gradient: "from-[#8B5CF6] to-[#7C3AED]",
      popular: true,
    },
    {
      id: "enterprise",
      icon: "🏢",
      color: "#FFB347",
      gradient: "from-[#FFB347] to-[#FF9500]",
      isCustom: true,
    },
  ];

  return (
    <section className="py-16 sm:py-20 border-t border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-[#06b6d4]/10 via-[#8B5CF6]/10 to-[#FFB347]/10 blur-[100px] rounded-full" />
      </div>

      <div className="container px-4 sm:px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#8B5CF6]/10 to-[#06b6d4]/10 border border-[#8B5CF6]/20 mb-4">
              <span className="text-sm">📱</span>
              <span className="text-xs font-medium text-white/80">{t("badge")}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">{t("headline")}</h2>
            <p className="text-sm text-white/60 max-w-lg mx-auto">{t("subheadline")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {apps.map((app) => {
              const features = t.raw(`items.${app.id}.features`) as string[];
              return (
                <div
                  key={app.id}
                  className={`group relative rounded-2xl transition-all duration-500 hover:-translate-y-2 ${app.popular ? "md:-mt-4 md:mb-4" : ""}`}
                >
                  {app.popular && (
                    <div className="absolute -inset-[1px] bg-gradient-to-b from-[#8B5CF6] via-[#8B5CF6]/50 to-transparent rounded-2xl opacity-60 blur-sm" />
                  )}

                  <div
                    className={`relative h-full p-6 rounded-2xl backdrop-blur-xl border transition-all duration-300 ${
                      app.popular
                        ? "bg-gradient-to-b from-[#8B5CF6]/15 to-[#030308] border-[#8B5CF6]/40"
                        : "bg-white/[0.03] border-white/[0.08] hover:border-white/20 hover:bg-white/[0.05]"
                    }`}
                  >
                    {app.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-[#8B5CF6]/30">
                          {t("completeSolution")}
                        </div>
                      </div>
                    )}

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
                      <h3 className="text-xl font-bold mb-1" style={{ color: app.color }}>
                        {t(`items.${app.id}.name`)}
                      </h3>
                      <p className="text-xs text-white/50">{t(`items.${app.id}.subtitle`)}</p>
                    </div>

                    <div className="text-center mb-5">
                      {app.isCustom ? (
                        <div className="text-2xl font-bold text-white">{t("onRequest")}</div>
                      ) : (
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-3xl sm:text-4xl font-bold text-white">{t(`items.${app.id}.price`)}</span>
                          <span className="text-lg text-white/50">€</span>
                        </div>
                      )}
                    </div>

                    <div className="text-center mb-5">
                      <span
                        className="inline-block px-3 py-1.5 rounded-full text-[10px] font-medium"
                        style={{ background: `${app.color}15`, color: app.color }}
                      >
                        {t(`items.${app.id}.highlight`)}
                      </span>
                    </div>

                    <p className="text-xs text-white/60 text-center mb-5 leading-relaxed">{t(`items.${app.id}.desc`)}</p>

                    <div className="h-px w-full mb-5" style={{ background: `linear-gradient(90deg, transparent, ${app.color}30, transparent)` }} />

                    <ul className="space-y-2.5 mb-6">
                      {features.map((feature: string, i: number) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${app.color}20` }}>
                            <svg className="w-3 h-3" style={{ color: app.color }} fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-sm text-white/70">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="space-y-2 mt-auto">
                      <Link
                        href={`/termin?paket=${app.id}` as any}
                        className={`block w-full text-center py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                          app.popular
                            ? `bg-gradient-to-r ${app.gradient} text-white shadow-lg shadow-[#8B5CF6]/25 hover:shadow-[#8B5CF6]/40 hover:scale-[1.02]`
                            : "border border-white/20 text-white hover:bg-white/10"
                        }`}
                      >
                        {t(`items.${app.id}.cta`)}
                      </Link>
                      <Link href={`/pakete/${app.id}` as any} className="block w-full text-center py-2 text-xs text-white/40 hover:text-white transition-colors">
                        {t("viewDetails")} →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap justify-center gap-6 mt-12">
            {[
              { icon: "🔐", text: t("trustBadges.secureCode") },
              { icon: "📦", text: t("trustBadges.completeHandover") },
              { icon: "🛠️", text: t("trustBadges.maintainableScalable") },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-white/50">
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

// Service Section
function ServiceSection() {
  const t = useTranslations("pages.pakete.service");
  const items = t.raw("items") as string[];

  return (
    <section className="py-12 sm:py-16 border-t border-white/5">
      <div className="container px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.08]">
            <h2 className="text-base sm:text-lg font-bold text-white mb-3">{t("headline")}</h2>
            <p className="text-xs text-white/60 mb-4">{t("description")}</p>
            <ul className="space-y-2">
              {items.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-xs text-white/70">
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

// Payment Section
function PaymentSection() {
  const t = useTranslations("pages.pakete.payment");

  const steps = [
    { num: "1", text: t("steps.1") },
    { num: "2", text: t("steps.2") },
    { num: "3", text: t("steps.3") },
  ];

  return (
    <section className="py-12 sm:py-16 border-t border-white/5">
      <div className="container px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-6">{t("headline")}</h2>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/[0.08]">
                <span className="w-8 h-8 rounded-full bg-[#FC682C]/20 flex items-center justify-center text-[#FC682C] text-sm font-bold">{step.num}</span>
                <span className="text-xs text-white/80">{step.text}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-[#FC682C]/80">⚠️ {t("warning")}</p>
        </div>
      </div>
    </section>
  );
}

// Comparison Section
function ComparisonSection() {
  const t = useTranslations("pages.pakete.comparison");
  const tPackages = useTranslations("pages.pakete.packages");

  const features = [
    { key: "pages", start: t("values.start.pages"), business: t("values.business.pages"), konfigurator: t("values.konfigurator.pages") },
    { key: "designDevelopment", start: true, business: true, konfigurator: true },
    { key: "responsive", start: true, business: true, konfigurator: true },
    { key: "seo", start: true, business: true, konfigurator: true },
    { key: "adminPortal", start: t("values.start.adminPortal"), business: t("values.business.adminPortal"), konfigurator: t("values.konfigurator.adminPortal") },
    { key: "customerPortal", start: false, business: true, konfigurator: true },
    { key: "employeePortal", start: false, business: true, konfigurator: true },
    { key: "bookingSystem", start: false, business: false, konfigurator: true },
    { key: "customTools", start: false, business: false, konfigurator: true },
    { key: "timeline", start: t("values.start.timeline"), business: t("values.business.timeline"), konfigurator: t("values.konfigurator.timeline") },
  ];

  const renderCell = (value: boolean | string, color: string, isHighlighted: boolean = false) => {
    if (typeof value === "boolean") {
      return value ? (
        <span className="inline-flex w-4 h-4 sm:w-5 sm:h-5 rounded-full items-center justify-center" style={{ backgroundColor: color }}>
          <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
      ) : (
        <span className="text-white/30">—</span>
      );
    }
    return <span className={`text-[10px] sm:text-xs ${isHighlighted ? "font-medium text-white/90" : "text-white/70"}`}>{value}</span>;
  };

  return (
    <section className="py-10 sm:py-12 md:py-16 border-t border-white/5">
      <div className="container px-4 sm:px-6">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3">{t("headline")}</h2>
          <p className="text-[10px] sm:text-xs md:text-sm text-white/60">{t("subheadline")}</p>
        </div>

        <div className="max-w-4xl mx-auto overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[400px] text-[10px] sm:text-xs md:text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-2 sm:p-3 text-[10px] sm:text-xs font-medium text-white/50 w-[30%]">Feature</th>
                <th className="p-2 sm:p-3 text-center w-[23%]">
                  <div className="flex flex-col items-center">
                    <span className="text-[#FFB347] font-bold text-[10px] sm:text-xs">START</span>
                    <span className="text-[8px] sm:text-[10px] text-white/40"><s className="text-white/20">5.390 €</s> 3.790 €</span>
                  </div>
                </th>
                <th className="p-2 sm:p-3 text-center w-[23%] bg-[#FC682C]/5 rounded-t-lg">
                  <div className="flex flex-col items-center">
                    <span className="text-[#FC682C] font-bold text-[10px] sm:text-xs">BUSINESS</span>
                    <span className="text-[8px] sm:text-[10px] text-[#FC682C]/70">{t("recommended")}</span>
                    <span className="text-[8px] sm:text-[10px] text-white/40"><s className="text-white/20">11.990 €</s> 8.390 €</span>
                  </div>
                </th>
                <th className="p-2 sm:p-3 text-center w-[23%]">
                  <div className="flex flex-col items-center">
                    <span className="text-[#9D65C9] font-bold text-[10px] sm:text-xs">KONFIGURATOR</span>
                    <span className="text-[8px] sm:text-[10px] text-white/40">{tPackages("onRequest")}</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, i) => (
                <tr key={i} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="p-2 sm:p-3 text-[10px] sm:text-xs text-white/70">{t(`features.${feature.key}`)}</td>
                  <td className="p-2 sm:p-3 text-center">{renderCell(feature.start, "#FFB347")}</td>
                  <td className="p-2 sm:p-3 text-center bg-[#FC682C]/5">{renderCell(feature.business, "#FC682C", true)}</td>
                  <td className="p-2 sm:p-3 text-center">{renderCell(feature.konfigurator, "#9D65C9")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 mt-6 sm:mt-8">
          <Link
            href="/termin?paket=start"
            className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg border border-[#FFB347]/30 text-[#FFB347] text-[10px] sm:text-xs font-semibold hover:bg-[#FFB347]/10 transition-all text-center"
          >
            {t("ctas.start")}
          </Link>
          <Link
            href="/termin?paket=business"
            className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg bg-gradient-to-r from-[#FC682C] to-[#e55a1f] text-white text-[10px] sm:text-xs font-semibold hover:opacity-90 transition-all text-center shadow-lg shadow-[#FC682C]/20"
          >
            {t("ctas.business")}
          </Link>
          <Link
            href="/termin?paket=konfigurator"
            className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg border border-[#9D65C9]/30 text-[#9D65C9] text-[10px] sm:text-xs font-semibold hover:bg-[#9D65C9]/10 transition-all text-center"
          >
            {t("ctas.konfigurator")}
          </Link>
        </div>
      </div>
    </section>
  );
}

// Trust/Social Proof Section
function TrustSection() {
  const t = useTranslations("pages.pakete.trust");

  const stats = [
    { value: "50+", label: t("stats.projects") },
    { value: "100%", label: t("stats.satisfaction") },
    { value: "24h", label: t("stats.response") },
    { value: "5.0", label: t("stats.rating"), icon: "⭐" },
  ];

  return (
    <section className="py-10 sm:py-12 border-t border-white/5 bg-gradient-to-b from-transparent to-[#FC682C]/5">
      <div className="container px-4 sm:px-6">
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium mb-3">
            {t("badge")}
          </span>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{t("headline")}</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {stats.map((stat, i) => (
            <div key={i} className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-2xl sm:text-3xl font-bold text-[#FC682C] mb-1">
                {stat.icon && <span className="mr-1">{stat.icon}</span>}
                {stat.value}
              </div>
              <div className="text-xs text-white/50">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs text-white/40">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {t("badges.verified")}
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {t("badges.berlin")}
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {t("badges.gdpr")}
          </div>
        </div>
      </div>
    </section>
  );
}

// FAQ Section
function FAQSection() {
  const t = useTranslations("pages.pakete.faq");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { q: t("items.0.q"), a: t("items.0.a") },
    { q: t("items.1.q"), a: t("items.1.a") },
    { q: t("items.2.q"), a: t("items.2.a") },
    { q: t("items.3.q"), a: t("items.3.a") },
    { q: t("items.4.q"), a: t("items.4.a") },
    { q: t("items.5.q"), a: t("items.5.a") },
  ];

  return (
    <section className="py-12 sm:py-16 border-t border-white/5">
      <div className="container px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <span className="inline-block px-3 py-1 rounded-full bg-[#FC682C]/10 text-[#FC682C] text-xs font-medium mb-3">
              {t("badge")}
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">{t("headline")}</h2>
            <p className="text-sm text-white/60">{t("subheadline")}</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl bg-white/[0.02] border border-white/5 overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-sm font-medium text-white pr-4">{faq.q}</span>
                  <svg
                    className={`w-5 h-5 text-[#FC682C] flex-shrink-0 transition-transform ${openIndex === i ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openIndex === i && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-white/60 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Final CTA Section
function FinalCTA() {
  const t = useTranslations("pages.pakete.finalCta");

  return (
    <section className="py-12 sm:py-16 border-t border-white/5 bg-gradient-to-t from-[#FC682C]/5 to-transparent">
      <div className="container px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3">{t("headline")}</h2>
          <p className="text-sm text-white/60 mb-6">{t("subheadline")}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/website-check"
              className="px-5 py-3 rounded-lg bg-gradient-to-r from-[#FC682C] to-[#e55a1f] text-white text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-[#FC682C]/25 text-center"
            >
              {t("ctaPrimary")}
            </Link>
            <Link href="/termin" className="px-5 py-3 rounded-lg border border-white/20 text-white text-sm font-semibold hover:bg-white/5 transition-all text-center">
              {t("ctaSecondary")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// Main Page Component
export default function PaketePage() {
  return (
    <>
      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.3; }
        }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        @keyframes pulse-ring {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.05); opacity: 0.15; }
        }
        .animate-pulse-ring { animation: pulse-ring 2s ease-in-out infinite; }
        .delay-1000 { animation-delay: 1000ms; }
      `}</style>

      <HeroSection />
      <ProblemSection />
      <WhatWeDeliverSection />
      <PackagesSection />
      <AppsSection />
      <ServiceSection />
      <PaymentSection />
      <ComparisonSection />
      <TrustSection />
      <FAQSection />
      <FinalCTA />
    </>
  );
}
