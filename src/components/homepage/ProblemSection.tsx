"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

// Responsive Visualization
function ProblemVisualization() {
  return (
    <div className="relative w-full h-[260px] sm:h-[300px] lg:h-[360px] flex items-center justify-center">
      {/* Background Glow */}
      <div className="absolute w-40 h-40 sm:w-56 sm:h-56 lg:w-64 lg:h-64 bg-gradient-to-br from-red-500/20 via-orange-500/10 to-transparent rounded-full blur-3xl" />

      {/* Outer rotating ring */}
      <motion.div
        className="absolute w-44 h-44 sm:w-56 sm:h-56 lg:w-72 lg:h-72 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, transparent, rgba(239,68,68,0.3), transparent, rgba(249,115,22,0.3), transparent)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Middle Ring */}
      <motion.div
        className="absolute w-32 h-32 sm:w-44 sm:h-44 lg:w-56 lg:h-56 rounded-full border border-red-500/20"
        animate={{ rotate: -360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />

      {/* Inner pulsing ring */}
      <motion.div
        className="absolute w-20 h-20 sm:w-28 sm:h-28 lg:w-36 lg:h-36 rounded-full border-2 border-red-500/30"
        animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Main element - Fragmented cube */}
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24">
        {/* Fragment 1 */}
        <motion.div
          className="absolute top-0 left-0 w-7 h-7 sm:w-9 sm:h-9 lg:w-11 lg:h-11 rounded-tl-xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(239,68,68,0.4), rgba(239,68,68,0.1))",
            borderTop: "2px solid rgba(239,68,68,0.6)",
            borderLeft: "2px solid rgba(239,68,68,0.6)",
          }}
          animate={{ x: [-2, 0, -2], y: [-2, 0, -2] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        {/* Fragment 2 */}
        <motion.div
          className="absolute top-0 right-0 w-7 h-7 sm:w-9 sm:h-9 lg:w-11 lg:h-11 rounded-tr-xl"
          style={{
            background:
              "linear-gradient(225deg, rgba(249,115,22,0.4), rgba(249,115,22,0.1))",
            borderTop: "2px solid rgba(249,115,22,0.6)",
            borderRight: "2px solid rgba(249,115,22,0.6)",
          }}
          animate={{ x: [2, 0, 2], y: [-2, 0, -2] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
        />
        {/* Fragment 3 */}
        <motion.div
          className="absolute bottom-0 left-0 w-7 h-7 sm:w-9 sm:h-9 lg:w-11 lg:h-11 rounded-bl-xl"
          style={{
            background:
              "linear-gradient(45deg, rgba(168,85,247,0.4), rgba(168,85,247,0.1))",
            borderBottom: "2px solid rgba(168,85,247,0.6)",
            borderLeft: "2px solid rgba(168,85,247,0.6)",
          }}
          animate={{ x: [-2, 0, -2], y: [2, 0, 2] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
        />
        {/* Fragment 4 */}
        <motion.div
          className="absolute bottom-0 right-0 w-7 h-7 sm:w-9 sm:h-9 lg:w-11 lg:h-11 rounded-br-xl"
          style={{
            background:
              "linear-gradient(315deg, rgba(6,182,212,0.4), rgba(6,182,212,0.1))",
            borderBottom: "2px solid rgba(6,182,212,0.6)",
            borderRight: "2px solid rgba(6,182,212,0.6)",
          }}
          animate={{ x: [2, 0, 2], y: [2, 0, 2] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
        />

        {/* Center - Warning symbol */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </motion.div>
      </div>

      {/* Status Labels - Only on larger screens */}
      <div className="hidden lg:block">
        {[
          { label: "DISCONNECTED", x: "5%", y: "15%", color: "#ef4444" },
          { label: "ERROR", x: "70%", y: "20%", color: "#f59e0b" },
          { label: "BLOCKED", x: "75%", y: "75%", color: "#a855f7" },
        ].map((status, i) => (
          <motion.div
            key={i}
            className="absolute px-2 py-1 rounded text-[9px] font-mono tracking-wider"
            style={{
              left: status.x,
              top: status.y,
              color: status.color,
              backgroundColor: `${status.color}15`,
              border: `1px solid ${status.color}30`,
            }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
          >
            {status.label}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function ProblemSection() {
  const t = useTranslations("problem");

  const problems = [
    {
      key: "noPath",
      color: "#ef4444",
    },
    {
      key: "peopleDependent",
      color: "#f59e0b",
    },
    {
      key: "handoversBreak",
      color: "#FFB347",
    },
    {
      key: "noVisibility",
      color: "#06b6d4",
    },
    {
      key: "surfaceModern",
      color: "#a855f7",
    },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-red-500/5 rounded-full blur-[150px]" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Desktop: Visualization LEFT, Text RIGHT */}
          {/* Mobile: Text on top, Visualization below */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-12 lg:mb-16">
            {/* Visualization - Left on Desktop, bottom on Mobile */}
            <motion.div
              className="order-2 lg:order-1"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <ProblemVisualization />
            </motion.div>

            {/* Text Content - Right on Desktop, top on Mobile */}
            <motion.div
              className="order-1 lg:order-2 text-center lg:text-start"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-sm text-red-400 font-medium uppercase tracking-wider">
                {t("badge")}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mt-3 mb-4 text-white">
                {t("headline")}{" "}
                <span className="text-red-500">{t("headlineHighlight")}</span>
              </h2>
              <p className="text-base sm:text-lg text-white/80 max-w-xl mx-auto lg:mx-0">
                {t("subheadline")}
              </p>
            </motion.div>
          </div>

          {/* Problem Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-10">
            {problems.map((problem, i) => (
              <motion.div
                key={problem.key}
                className="p-5 sm:p-6 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-red-500/30 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
                    style={{
                      backgroundColor: problem.color,
                      boxShadow: `0 0 10px ${problem.color}50`,
                    }}
                  />
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                      {t(`items.${problem.key}.title`)}
                    </h3>
                    <p className="text-sm sm:text-base text-white/70">
                      {t(`items.${problem.key}.desc`)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bridge Statement - Centered */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto">
              {t("bridge")}{" "}
              <span className="text-[#FC682C] font-semibold">
                {t("bridgeHighlight")}
              </span>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
