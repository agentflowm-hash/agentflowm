"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

const packageColors = {
  launch: "#06b6d4",
  business: "#FC682C",
  configurator: "#a855f7",
};

export function PaketeSection() {
  const t = useTranslations("packages");

  const pakete = [
    {
      key: "launch",
      name: t("items.launch.name"),
      subtitle: t("items.launch.subtitle"),
      price: t("items.launch.price"),
      desc: t("items.launch.desc"),
      features: [
        t("items.launch.features.0"),
        t("items.launch.features.1"),
        t("items.launch.features.2"),
        t("items.launch.features.3"),
      ],
      color: packageColors.launch,
      popular: false,
    },
    {
      key: "business",
      name: t("items.business.name"),
      subtitle: t("items.business.subtitle"),
      price: t("items.business.price"),
      desc: t("items.business.desc"),
      features: [
        t("items.business.features.0"),
        t("items.business.features.1"),
        t("items.business.features.2"),
        t("items.business.features.3"),
      ],
      color: packageColors.business,
      popular: true,
    },
    {
      key: "configurator",
      name: t("items.configurator.name"),
      subtitle: t("items.configurator.subtitle"),
      price: t("items.configurator.price"),
      desc: t("items.configurator.desc"),
      features: [
        t("items.configurator.features.0"),
        t("items.configurator.features.1"),
        t("items.configurator.features.2"),
      ],
      color: packageColors.configurator,
      popular: false,
    },
  ];

  return (
    <section className="py-10 sm:py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FC682C]/3 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-sm text-[#FC682C] font-medium uppercase tracking-wider">
            {t("badge")}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold mt-3 mb-2">
            {t("headline")}{" "}
            <span className="text-[#FC682C]">{t("headlineHighlight")}</span>
          </h2>
        </motion.div>

        {/* Pakete Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-4xl mx-auto">
          {pakete.map((paket, i) => (
            <motion.div
              key={paket.key}
              className={`relative p-5 rounded-xl border ${
                paket.popular
                  ? "bg-gradient-to-br from-[#FC682C]/10 to-[#FFB347]/5 border-[#FC682C]/30"
                  : "bg-white/[0.02] border-white/[0.06]"
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              {/* Popular badge */}
              {paket.popular && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#FC682C] text-white text-[10px] font-semibold">
                  {t("popular")}
                </div>
              )}

              {/* Header */}
              <div className="mb-3">
                <h3
                  className="text-base font-bold"
                  style={{ color: paket.color }}
                >
                  {paket.name}
                </h3>
                <p className="text-xs text-white/70">{paket.subtitle}</p>
              </div>

              {/* Price */}
              <div className="mb-3">
                <span className="text-2xl font-bold text-white">
                  {paket.price}
                </span>
                {paket.price !== t("items.configurator.price") && (
                  <span className="text-sm text-white/60 ml-1">€</span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-white/80 mb-4">{paket.desc}</p>

              {/* Features */}
              <ul className="space-y-1.5 mb-4">
                {paket.features.map((feature, j) => (
                  <li
                    key={j}
                    className="flex items-center gap-2 text-xs text-white/80"
                  >
                    <div className="w-1 h-1 rounded-full bg-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href="/termin"
                className={`block w-full py-2 px-3 rounded-lg text-center text-xs font-semibold transition-all ${
                  paket.popular
                    ? "bg-gradient-to-r from-[#FC682C] to-[#e55a1f] text-white hover:opacity-90"
                    : "border border-white/20 text-white hover:bg-white/5"
                }`}
              >
                {t("inquire")}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
