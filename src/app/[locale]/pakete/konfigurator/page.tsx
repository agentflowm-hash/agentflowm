"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function KonfiguratorPackagePage() {
  const [isVisible, setIsVisible] = useState(false);
  const t = useTranslations("pages.pakete.konfigurator");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const optionIcons: Record<string, string> = {
    page: "\uD83D\uDCC4",
    lock: "\uD83D\uDD10",
    calendar: "\uD83D\uDCC5",
    chart: "\uD83D\uDCCA",
    tool: "\uD83D\uDD27",
    link: "\uD83D\uDD17",
  };

  const options = [
    { icon: "page", titleKey: "options.0.title", descKey: "options.0.desc" },
    { icon: "lock", titleKey: "options.1.title", descKey: "options.1.desc" },
    { icon: "calendar", titleKey: "options.2.title", descKey: "options.2.desc" },
    { icon: "chart", titleKey: "options.3.title", descKey: "options.3.desc" },
    { icon: "tool", titleKey: "options.4.title", descKey: "options.4.desc" },
    { icon: "link", titleKey: "options.5.title", descKey: "options.5.desc" },
  ];

  const processSteps = [
    { stepKey: "process.0.step", titleKey: "process.0.title", descKey: "process.0.desc" },
    { stepKey: "process.1.step", titleKey: "process.1.title", descKey: "process.1.desc" },
    { stepKey: "process.2.step", titleKey: "process.2.title", descKey: "process.2.desc" },
    { stepKey: "process.3.step", titleKey: "process.3.title", descKey: "process.3.desc" },
  ];

  const idealForKeys = ["idealFor.0", "idealFor.1", "idealFor.2", "idealFor.3"];

  return (
    <main className="min-h-screen bg-[#030308]">
      {/* Hero */}
      <section className="relative pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#9D65C9]/15 to-transparent blur-[120px]" />
          <div className="absolute top-[30%] right-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-[#9D65C9]/10 to-transparent blur-[100px]" />
        </div>

        <div className="container relative z-10 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Back Link */}
            <Link
              href="/pakete"
              className={`inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              {t("backLink")}
            </Link>

            {/* Badge */}
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#9D65C9]/10 border border-[#9D65C9]/20 mb-5 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <span className="text-lg">{"\uD83D\uDC8E"}</span>
              <span className="text-xs font-medium text-[#9D65C9]">
                {t("badge")}
              </span>
            </div>

            {/* Title */}
            <h1
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9D65C9] to-[#FC682C]">
                {t("title")}
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className={`text-lg text-white/70 mb-6 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              {t("subtitle")}
            </p>

            {/* Description */}
            <p
              className={`text-sm sm:text-base text-white/60 max-w-2xl mb-8 leading-relaxed transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              {t("description")}
            </p>

            {/* Price Box */}
            <div
              className={`inline-flex items-center gap-4 p-6 rounded-2xl bg-white/[0.03] border border-[#9D65C9]/20 mb-8 transition-all duration-700 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <div>
                <div className="text-3xl font-bold text-[#9D65C9]">
                  {t("price")}
                </div>
                <div className="text-sm text-white/50">{t("priceSubtext")}</div>
              </div>
              <div className="h-12 w-px bg-white/10" />
              <div>
                <div className="text-sm text-white/70">{t("capacityLabel")}</div>
                <div className="text-lg font-semibold text-white">
                  {t("capacityValue")}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div
              className={`flex flex-col sm:flex-row gap-3 transition-all duration-700 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <Link
                href="/termin?paket=konfigurator"
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#9D65C9] to-[#FC682C] text-white font-semibold hover:opacity-90 transition-all shadow-lg shadow-[#9D65C9]/25 text-center"
              >
                {t("ctaPrimary")}
              </Link>
              <Link
                href="/termin"
                className="px-6 py-3 rounded-lg border border-white/20 text-white font-semibold hover:bg-white/5 transition-all text-center"
              >
                {t("ctaSecondary")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Options */}
      <section className="py-16 border-t border-white/5">
        <div className="container px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
              {t("optionsTitle")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {options.map((option, i) => (
                <div
                  key={i}
                  className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-[#9D65C9]/30 transition-all"
                >
                  <span className="text-2xl mb-3 block">{optionIcons[option.icon]}</span>
                  <h3 className="font-semibold text-white mb-2">
                    {t(option.titleKey)}
                  </h3>
                  <p className="text-sm text-white/60">{t(option.descKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 border-t border-white/5 bg-gradient-to-b from-[#9D65C9]/5 to-transparent">
        <div className="container px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
              {t("processTitle")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {processSteps.map((item, i) => (
                <div
                  key={i}
                  className="relative p-5 rounded-xl bg-white/[0.03] border border-white/[0.08]"
                >
                  <div className="w-10 h-10 rounded-full bg-[#9D65C9]/20 flex items-center justify-center text-[#9D65C9] font-bold mb-3">
                    {t(item.stepKey)}
                  </div>
                  <h3 className="font-semibold text-white mb-1">
                    {t(item.titleKey)}
                  </h3>
                  <p className="text-xs text-white/60">{t(item.descKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ideal For */}
      <section className="py-16 border-t border-white/5">
        <div className="container px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
              {t("idealForTitle")}
            </h2>
            <div className="space-y-3 text-left max-w-xl mx-auto">
              {idealForKeys.map((key, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02]"
                >
                  <svg
                    className="w-5 h-5 text-[#9D65C9] mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-white/80">{t(key)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Notice */}
      <section className="py-12 border-t border-white/5">
        <div className="container px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="p-6 rounded-xl bg-[#9D65C9]/10 border border-[#9D65C9]/20">
              <div className="flex items-start gap-4">
                <span className="text-2xl">{"\u26A0\uFE0F"}</span>
                <div>
                  <h3 className="font-semibold text-white mb-2">
                    {t("noticeTitle")}
                  </h3>
                  <p className="text-sm text-white/70">
                    {t("noticeText")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-white/5 bg-gradient-to-t from-[#9D65C9]/5 to-transparent">
        <div className="container px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              {t("ctaTitle")}
            </h2>
            <p className="text-white/60 mb-6">
              {t("ctaDescription")}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/termin?paket=konfigurator"
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#9D65C9] to-[#FC682C] text-white font-semibold hover:opacity-90 transition-all shadow-lg shadow-[#9D65C9]/25 text-center"
              >
                {t("ctaPrimaryFinal")}
              </Link>
              <Link
                href="/pakete"
                className="px-6 py-3 rounded-lg border border-white/20 text-white font-semibold hover:bg-white/5 transition-all text-center"
              >
                {t("ctaSecondaryFinal")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
