"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { Suspense } from "react";
import { useTranslations } from "next-intl";

function ErfolgContent() {
  const t = useTranslations("pages.workflows.erfolg");
  const searchParams = useSearchParams();
  const botName = searchParams.get("bot") || "Your Bot";
  const purchaseType = searchParams.get("type") || "rent";
  const price = searchParams.get("price") || "0";

  const isRent = purchaseType === "rent";
  const priceLabel = isRent
    ? `${price} € ${t("summary.rent")}`
    : `${price} € ${t("summary.buy")}`;

  return (
    <main className="bg-[#030308] min-h-screen flex items-center justify-center px-4">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#10B981]/10 rounded-full blur-[200px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#FC682C]/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="relative inline-block mb-8"
          >
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center shadow-2xl shadow-[#10B981]/30">
              <svg
                className="w-14 h-14 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            {/* Pulse rings */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-[#10B981]"
              animate={{ scale: [1, 1.5, 1.5], opacity: [0.5, 0, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-[#10B981]"
              animate={{ scale: [1, 1.8, 1.8], opacity: [0.3, 0, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            />
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
          >
            {t("headline")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg sm:text-xl text-white/70 mb-8"
          >
            {t("subheadline")}
          </motion.p>

          {/* Order Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-8 mb-8"
          >
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6 pb-6 border-b border-white/10">
              <div className="text-left">
                <span className="text-xs text-white/40 uppercase tracking-wider">
                  {t("summary.bot")}
                </span>
                <h2 className="text-xl font-bold text-white">{botName}</h2>
              </div>
              <div
                className={`px-4 py-2 rounded-lg text-sm font-bold ${
                  isRent
                    ? "bg-[#FFB347]/20 text-[#FFB347]"
                    : "bg-[#06b6d4]/20 text-[#06b6d4]"
                }`}
              >
                {isRent ? t("summary.rent") : t("summary.buy")}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-white/60">{t("summary.price")}</span>
              <span className="text-2xl font-bold text-white">{priceLabel}</span>
            </div>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-[#FC682C]/10 to-[#8B5CF6]/10 border border-[#FC682C]/20 rounded-2xl p-6 sm:p-8 mb-8 text-left"
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-xl">📋</span>
              {t("nextSteps.title")}
            </h3>
            <ul className="space-y-3">
              {[
                { icon: "📧", text: t("nextSteps.step1") },
                { icon: "📞", text: t("nextSteps.step2") },
                { icon: "🔗", text: t("nextSteps.step3") },
                { icon: "✅", text: t("nextSteps.step4") },
              ].map((step, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  className="flex items-start gap-3 text-white/70"
                >
                  <span className="text-lg">{step.icon}</span>
                  <span>{step.text}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Support Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white/[0.02] border border-white/5 rounded-xl p-4 mb-8 text-sm text-white/50"
          >
            <span className="text-white/70">{t("support.questions")}</span>{" "}
            {t("support.contactUs")}{" "}
            <a
              href="mailto:info@agentflowm.com"
              className="text-[#FC682C] hover:underline"
            >
              info@agentflowm.com
            </a>{" "}
            {t("support.orTelegram")}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link
              href="/workflows"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#FC682C] to-[#e55a1f] text-white font-semibold hover:opacity-90 transition-all shadow-lg shadow-[#FC682C]/25"
            >
              {t("cta.moreBots")}
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/5 transition-all"
            >
              {t("cta.home")}
            </Link>
          </motion.div>

          {/* Confetti-like particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  top: `${10 + Math.random() * 80}%`,
                  backgroundColor: ["#FC682C", "#10B981", "#8B5CF6", "#FFB347"][
                    Math.floor(Math.random() * 4)
                  ],
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  y: [0, -30, -60],
                }}
                transition={{
                  duration: 2,
                  delay: Math.random() * 2,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 3,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}

export default function ErfolgPage() {
  const t = useTranslations("pages.workflows.erfolg");

  return (
    <Suspense
      fallback={
        <main className="bg-[#030308] min-h-screen flex items-center justify-center">
          <div className="text-white">{t("loading")}</div>
        </main>
      }
    >
      <ErfolgContent />
    </Suspense>
  );
}
