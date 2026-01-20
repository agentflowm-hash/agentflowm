"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

const productColors = {
  webapp: "#3b82f6",
  mobile: "#a855f7",
  enterprise: "#f59e0b",
};

export function WebAppsSection() {
  const t = useTranslations("webapps");

  const products = [
    {
      key: "webapp",
      title: t("items.webapp.title"),
      price: t("items.webapp.price"),
      desc: t("items.webapp.desc"),
      features: [
        t("items.webapp.features.0"),
        t("items.webapp.features.1"),
        t("items.webapp.features.2"),
      ],
      color: productColors.webapp,
      popular: false,
    },
    {
      key: "mobile",
      title: t("items.mobile.title"),
      price: t("items.mobile.price"),
      desc: t("items.mobile.desc"),
      features: [
        t("items.mobile.features.0"),
        t("items.mobile.features.1"),
        t("items.mobile.features.2"),
      ],
      color: productColors.mobile,
      popular: true,
    },
    {
      key: "enterprise",
      title: t("items.enterprise.title"),
      price: t("items.enterprise.price"),
      desc: t("items.enterprise.desc"),
      features: [
        t("items.enterprise.features.0"),
        t("items.enterprise.features.1"),
        t("items.enterprise.features.2"),
      ],
      color: productColors.enterprise,
      popular: false,
    },
  ];

  return (
    <section className="py-10 sm:py-12 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-sm text-purple-400 font-medium uppercase tracking-wider">
            {t("badge")}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold mt-3 mb-2">
            {t("headline")} <span className="text-purple-400">{t("headlineHighlight")}</span>
          </h2>
          <p className="text-base text-white/80 mt-2">
            {t("subheadline")}
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-4xl mx-auto">
          {products.map((product, index) => (
            <motion.div
              key={product.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-5 rounded-xl border ${
                product.popular
                  ? "bg-gradient-to-br from-purple-500/10 to-pink-500/5 border-purple-500/30"
                  : "bg-white/[0.02] border-white/[0.06]"
              }`}
            >
              {product.popular && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-purple-500 text-white text-[10px] font-semibold">
                  {t("popular")}
                </div>
              )}

              {/* Title & Price */}
              <h3
                className="text-base font-bold mb-1"
                style={{ color: product.color }}
              >
                {product.title}
              </h3>
              <div className="mb-2">
                <span className="text-2xl font-bold text-white">
                  {product.price}
                </span>
                {product.price !== t("items.enterprise.price") && (
                  <span className="text-sm text-white/60 ml-1">€</span>
                )}
              </div>
              <p className="text-sm text-white/80 mb-3">{product.desc}</p>

              {/* Features */}
              <ul className="space-y-1.5 mb-4">
                {product.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-xs text-white/80"
                  >
                    <div
                      className="w-1 h-1 rounded-full flex-shrink-0"
                      style={{ backgroundColor: product.color }}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href="/kontakt"
                className={`block w-full py-2 px-3 rounded-lg text-center text-xs font-semibold transition-all ${
                  product.popular
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90"
                    : "border border-white/20 text-white hover:bg-white/5"
                }`}
              >
                {t("inquire")}
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="text-center text-xs text-white/70 mt-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {t("priceNote")}
        </motion.p>
      </div>
    </section>
  );
}
