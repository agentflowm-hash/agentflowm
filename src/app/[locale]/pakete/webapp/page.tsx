"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function WebAppPackagePage() {
  const [isVisible, setIsVisible] = useState(false);
  const t = useTranslations("pages.pakete.webapp");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const featureIcons: Record<string, string> = {
    clipboard: "📋",
    palette: "🎨",
    settings: "⚙️",
    flask: "🧪",
    rocket: "🚀",
    package: "📦",
  };

  const useCaseIcons: Record<string, string> = {
    chart: "📊",
    form: "📝",
    users: "👥",
    folder: "📁",
    calendar: "📅",
    chat: "💬",
  };

  return (
    <main className="min-h-screen bg-[#030308]">
      {/* Hero */}
      <section className="relative pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#06b6d4]/15 to-transparent blur-[120px]" />
          <div className="absolute top-[30%] right-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-[#06b6d4]/10 to-transparent blur-[100px]" />
        </div>

        <div className="container relative z-10 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Back Link */}
            <Link
              href="/pakete"
              className={`inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              {t("hero.backLink")}
            </Link>

            {/* Badge */}
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#06b6d4]/10 border border-[#06b6d4]/20 mb-5 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <span className="text-lg">🖥️</span>
              <span className="text-xs font-medium text-[#06b6d4]">{t("hero.badge")}</span>
            </div>

            {/* Title */}
            <h1
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#06b6d4] to-[#0891b2]">
                {t("hero.title")}
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className={`text-lg text-white/70 mb-6 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              {t("hero.subtitle")}
            </p>

            {/* Description */}
            <p
              className={`text-sm sm:text-base text-white/60 max-w-2xl mb-8 leading-relaxed transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              {t("hero.description")}
            </p>

            {/* Price Box */}
            <div
              className={`inline-flex items-center gap-4 p-6 rounded-2xl bg-white/[0.03] border border-[#06b6d4]/20 mb-8 transition-all duration-700 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <div>
                <div className="text-4xl font-bold text-[#06b6d4]">{t("hero.price")} €</div>
                <div className="text-sm text-white/50">{t("hero.priceLabel")}</div>
              </div>
              <div className="h-12 w-px bg-white/10" />
              <div>
                <div className="text-sm text-white/70">{t("hero.included")}</div>
                <div className="text-lg font-semibold text-white">{t("hero.codeHandover")}</div>
              </div>
            </div>

            {/* CTA */}
            <div
              className={`flex flex-col sm:flex-row gap-3 transition-all duration-700 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <Link
                href="/termin?paket=webapp"
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#06b6d4] to-[#0891b2] text-white font-semibold hover:opacity-90 transition-all shadow-lg shadow-[#06b6d4]/25 text-center"
              >
                {t("hero.ctaPrimary")}
              </Link>
              <Link
                href="/termin"
                className="px-6 py-3 rounded-lg border border-white/20 text-white font-semibold hover:bg-white/5 transition-all text-center"
              >
                {t("hero.ctaSecondary")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-t border-white/5">
        <div className="container px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
              {t("features.title")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-[#06b6d4]/30 transition-all"
                >
                  <span className="text-2xl mb-3 block">{featureIcons[t(`features.items.${i}.icon`)] || "📋"}</span>
                  <h3 className="font-semibold text-white mb-2">{t(`features.items.${i}.title`)}</h3>
                  <p className="text-sm text-white/60">{t(`features.items.${i}.desc`)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 border-t border-white/5 bg-gradient-to-b from-[#06b6d4]/5 to-transparent">
        <div className="container px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
              {t("useCases.title")}
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-center">
                  <span className="text-3xl mb-3 block">{useCaseIcons[t(`useCases.items.${i}.icon`)] || "📊"}</span>
                  <h3 className="font-semibold text-white mb-1">{t(`useCases.items.${i}.title`)}</h3>
                  <p className="text-xs text-white/60">{t(`useCases.items.${i}.desc`)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-16 border-t border-white/5">
        <div className="container px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
              {t("advantages.title")}
            </h2>
            <div className="space-y-3 text-left max-w-xl mx-auto">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02]">
                  <svg className="w-5 h-5 text-[#06b6d4] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white/80">{t(`advantages.items.${i}`)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-white/5 bg-gradient-to-t from-[#06b6d4]/5 to-transparent">
        <div className="container px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              {t("cta.title")}
            </h2>
            <p className="text-white/60 mb-6">
              {t("cta.description")}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/termin?paket=webapp"
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#06b6d4] to-[#0891b2] text-white font-semibold hover:opacity-90 transition-all shadow-lg shadow-[#06b6d4]/25 text-center"
              >
                {t("cta.ctaPrimary")}
              </Link>
              <Link
                href="/pakete"
                className="px-6 py-3 rounded-lg border border-white/20 text-white font-semibold hover:bg-white/5 transition-all text-center"
              >
                {t("cta.ctaSecondary")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
