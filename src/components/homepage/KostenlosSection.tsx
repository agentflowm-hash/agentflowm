"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export function KostenlosSection() {
  const t = useTranslations("free");

  const checkPoints = [
    t("checkpoints.0"),
    t("checkpoints.1"),
    t("checkpoints.2"),
    t("checkpoints.3"),
    t("checkpoints.4"),
  ];

  const benefits = [
    t("benefits.0"),
    t("benefits.1"),
    t("benefits.2"),
  ];

  return (
    <section className="py-10 sm:py-12 relative overflow-hidden">
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* Left Content */}
              <div className="p-6">
                <span className="inline-block px-2.5 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-xs font-medium mb-3">
                  {t("badge")}
                </span>

                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  {t("headline")}
                </h2>

                <p className="text-sm text-white/80 mb-4">
                  {t("subheadline")}
                </p>

                {/* Benefits */}
                <div className="space-y-2 mb-4">
                  {benefits.map((benefit, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-sm text-white/80"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      {benefit}
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  href="/website-check"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-semibold rounded-lg hover:opacity-90 transition-all"
                >
                  {t("cta")}
                  <svg
                    className="w-3 h-3"
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
                </Link>
              </div>

              {/* Right - Check Points */}
              <div className="bg-gray-900/50 p-6 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-2 w-full">
                  {checkPoints.map((point, index) => (
                    <motion.div
                      key={index}
                      className={`${index === 4 ? "col-span-2" : ""}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="bg-gray-800/60 rounded-lg p-3 border border-gray-700/50 hover:border-blue-500/30 transition-colors text-center">
                        <span className="text-sm font-medium text-white/80">
                          {point}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
