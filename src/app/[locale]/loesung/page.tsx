"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

// Hero Section
function HeroSection() {
  const t = useTranslations("pages.loesung.hero");

  const chips = [
    t("chips.seoHighQuality"),
    t("chips.liveReadySetup"),
    t("chips.understandable"),
    t("chips.codeHandover"),
  ];

  const trustItems = [
    t("trustItems.clearSteps"),
    t("trustItems.cleanHandover"),
    t("trustItems.ndaPossible"),
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#030308] pt-20 sm:pt-24">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-20 right-[10%] w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] rounded-full bg-gradient-to-br from-[#FC682C]/10 to-transparent blur-[100px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-[5%] w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] rounded-full bg-gradient-to-tr from-[#ef4444]/10 to-transparent blur-[80px]"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-center min-h-[85vh] py-12 gap-8 lg:gap-12">
          {/* Text Content */}
          <motion.div
            className="flex-1 max-w-2xl text-center lg:text-left"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FC682C]/10 border border-[#FC682C]/20 mb-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="text-xs text-[#FC682C] font-medium">
                {t("badge")}
              </span>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold leading-[1.15] mb-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span className="text-white">{t("headline1")}</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FC682C] via-[#FFB347] to-[#FC682C]">
                {t("headline2")}
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              className="text-sm sm:text-base text-white/80 mb-5 max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {t("subheadline1")}
            </motion.p>
            <motion.p
              className="text-xs sm:text-sm text-white/70 mb-6 max-w-lg mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              {t("subheadline2")}
            </motion.p>

            {/* Value Chips */}
            <motion.div
              className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="px-2.5 py-1 text-xs rounded-full bg-green-500/10 text-green-400 border border-green-500/20 flex items-center gap-1"
                >
                  <svg
                    className="w-3 h-3"
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
            </motion.div>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <Link
                href="/termin"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#FC682C] to-[#e55a1f] text-white text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-[#FC682C]/25"
              >
                {t("ctaPrimary")}
                <svg
                  className="w-4 h-4"
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
              <Link
                href="/website-check"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/20 text-white text-sm font-semibold hover:bg-white/5 transition-all"
              >
                {t("ctaSecondary")}
              </Link>
            </motion.div>

            {/* Mini Trustline */}
            <motion.div
              className="flex flex-wrap justify-center lg:justify-start gap-x-3 gap-y-1.5 text-xs text-white/70"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {trustItems.map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <svg
                    className="w-3.5 h-3.5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {item}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Visualization */}
          <motion.div
            className="flex-1 max-w-xl lg:max-w-2xl"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <HeroVisualization />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function HeroVisualization() {
  const t = useTranslations("pages.loesung.hero.visualization");

  return (
    <div className="relative w-full h-[350px] sm:h-[450px] lg:h-[550px] flex items-center justify-center">
      {/* Ambient Glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] lg:w-[420px] lg:h-[420px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(252,104,44,0.15) 0%, rgba(6,182,212,0.08) 40%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Main Visualization - Connected System Flow */}
      <div className="relative">
        {/* Central Hub - Glowing Sphere */}
        <motion.div
          className="relative z-20 w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, #FC682C 0%, #ff8c42 50%, #FFB347 100%)",
            boxShadow:
              "0 0 60px rgba(252,104,44,0.5), 0 0 120px rgba(252,104,44,0.3), inset 0 -10px 30px rgba(0,0,0,0.3)",
          }}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Inner glow */}
          <div
            className="absolute inset-2 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), transparent 60%)",
            }}
          />
          {/* Icon */}
          <svg
            className="w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-white relative z-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </motion.div>

        {/* Orbiting Service Cards */}
        <div className="absolute inset-0 w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] lg:w-[440px] lg:h-[440px] -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
          {/* Website Card - Top */}
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="relative group">
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl flex flex-col items-center justify-center gap-1"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(6,182,212,0.9), rgba(8,145,178,0.8))",
                  boxShadow:
                    "0 10px 40px rgba(6,182,212,0.4), 0 0 20px rgba(6,182,212,0.2)",
                }}
              >
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 lg:w-9 lg:h-9 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
                <span className="text-[10px] sm:text-xs text-white font-semibold">
                  {t("website")}
                </span>
              </div>
              {/* Connection Line */}
              <motion.div
                className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-8 sm:h-12 lg:h-16 bg-gradient-to-b from-cyan-400 to-transparent"
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>

          {/* Workflows Card - Bottom Left */}
          <motion.div
            className="absolute bottom-[10%] left-[5%]"
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          >
            <div className="relative">
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl flex flex-col items-center justify-center gap-1"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,179,71,0.9), rgba(234,88,12,0.8))",
                  boxShadow:
                    "0 10px 40px rgba(255,179,71,0.4), 0 0 20px rgba(255,179,71,0.2)",
                }}
              >
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 lg:w-9 lg:h-9 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span className="text-[10px] sm:text-xs text-white font-semibold">
                  {t("workflows")}
                </span>
              </div>
              {/* Connection Line */}
              <motion.div
                className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 lg:-top-8 lg:-right-8 w-12 sm:w-16 lg:w-20 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent rotate-45"
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              />
            </div>
          </motion.div>

          {/* Apps Card - Bottom Right */}
          <motion.div
            className="absolute bottom-[10%] right-[5%]"
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            <div className="relative">
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl flex flex-col items-center justify-center gap-1"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(168,85,247,0.9), rgba(139,92,246,0.8))",
                  boxShadow:
                    "0 10px 40px rgba(168,85,247,0.4), 0 0 20px rgba(168,85,247,0.2)",
                }}
              >
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 lg:w-9 lg:h-9 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-[10px] sm:text-xs text-white font-semibold">
                  {t("apps")}
                </span>
              </div>
              {/* Connection Line */}
              <motion.div
                className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 lg:-top-8 lg:-left-8 w-12 sm:w-16 lg:w-20 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent -rotate-45"
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
              />
            </div>
          </motion.div>
        </div>

        {/* Animated Connection Ring */}
        <svg className="absolute w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] lg:w-[440px] lg:h-[440px] -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 pointer-events-none">
          <defs>
            <linearGradient
              id="ringGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
              <stop offset="33%" stopColor="#FC682C" stopOpacity="0.4" />
              <stop offset="66%" stopColor="#FFB347" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          <motion.circle
            cx="50%"
            cy="50%"
            r="42%"
            fill="none"
            stroke="url(#ringGradient)"
            strokeWidth="1.5"
            strokeDasharray="12 6"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "center" }}
          />
        </svg>

        {/* Outer Pulse Ring */}
        <motion.div
          className="absolute w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full border border-[#FC682C]/20"
          animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}

// Problem Section
function ProblemSection() {
  const t = useTranslations("pages.loesung.problem");

  const problems = [
    {
      title: t("items.noGuidance.title"),
      desc: t("items.noGuidance.desc"),
      color: "#ef4444",
    },
    {
      title: t("items.handoversStall.title"),
      desc: t("items.handoversStall.desc"),
      color: "#f59e0b",
    },
    {
      title: t("items.tooMuchManual.title"),
      desc: t("items.tooMuchManual.desc"),
      color: "#FFB347",
    },
    {
      title: t("items.noOverview.title"),
      desc: t("items.noOverview.desc"),
      color: "#a855f7",
    },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-10 sm:mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm text-red-400 font-medium uppercase tracking-wider">
              {t("badge")}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-3 mb-4 text-white">
              {t("headline")}{" "}
              <span className="text-red-500">{t("headlineHighlight")}</span>
            </h2>
            <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto">
              {t("subheadline")}
            </p>
          </motion.div>

          {/* Problem Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {problems.map((problem, i) => (
              <motion.div
                key={problem.title}
                className="p-5 sm:p-6 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-red-500/30 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold"
                    style={{
                      backgroundColor: `${problem.color}20`,
                      color: problem.color,
                    }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-1.5">
                      {problem.title}
                    </h3>
                    <p className="text-sm text-white/70">{problem.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bridge Statement */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="inline-block p-5 sm:p-6 rounded-xl bg-gradient-to-br from-[#FC682C]/10 to-orange-500/5 border border-[#FC682C]/30">
              <p className="text-base sm:text-lg text-white/90">
                {t("bridge")}{" "}
                <span className="text-[#FC682C] font-semibold">
                  {t("bridgeHighlight1")}
                </span>{" "}
                {t("bridgeAnd")}{" "}
                <span className="text-[#FC682C] font-semibold">
                  {t("bridgeHighlight2")}
                </span>
                .
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Leistungen Section
function LeistungenSection() {
  const t = useTranslations("pages.loesung.leistungen");

  const leistungen = [
    {
      number: t("items.website.number"),
      title: t("items.website.title"),
      subtitle: t("items.website.subtitle"),
      desc: t("items.website.desc"),
      bullets: t.raw("items.website.bullets") as string[],
      color: "#06b6d4",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
          />
        </svg>
      ),
    },
    {
      number: t("items.workflows.number"),
      title: t("items.workflows.title"),
      subtitle: t("items.workflows.subtitle"),
      desc: t("items.workflows.desc"),
      bullets: t.raw("items.workflows.bullets") as string[],
      note: t("items.workflows.note"),
      color: "#FFB347",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      ),
    },
    {
      number: t("items.apps.number"),
      title: t("items.apps.title"),
      subtitle: t("items.apps.subtitle"),
      desc: t("items.apps.desc"),
      bullets: t.raw("items.apps.bullets") as string[],
      note: t("items.apps.note"),
      color: "#a855f7",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 relative overflow-hidden bg-white/[0.01]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm text-[#FC682C] font-medium uppercase tracking-wider">
              {t("badge")}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-3 mb-4 text-white">
              {t("headline")}{" "}
              <span className="text-[#FC682C]">{t("headlineHighlight")}</span>
            </h2>
            <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto">
              {t("subheadline")}
            </p>
          </motion.div>

          {/* Leistungen */}
          <div className="space-y-16 sm:space-y-20">
            {leistungen.map((item, i) => {
              const isEven = i % 2 === 0;

              return (
                <motion.div
                  key={item.number}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  {/* Content */}
                  <div
                    className={`${isEven ? "lg:order-1" : "lg:order-2"} p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08]`}
                  >
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-5">
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${item.color}30, ${item.color}10)`,
                          border: `2px solid ${item.color}50`,
                          color: item.color,
                        }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="text-2xl font-bold"
                            style={{ color: item.color }}
                          >
                            {item.number})
                          </span>
                          <h3 className="text-xl sm:text-2xl font-bold text-white">
                            {item.title}
                          </h3>
                        </div>
                        <p
                          className="text-sm font-medium"
                          style={{ color: item.color }}
                        >
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-white/80 mb-5">
                      {item.desc}
                    </p>

                    {/* Bullets */}
                    <ul className="space-y-2.5 mb-4">
                      {item.bullets.map((bullet, j) => (
                        <li
                          key={j}
                          className="flex items-start gap-2.5 text-sm text-white/70"
                        >
                          <div
                            className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                            style={{ backgroundColor: item.color }}
                          />
                          {bullet}
                        </li>
                      ))}
                    </ul>

                    {/* Note */}
                    {item.note && (
                      <div
                        className="p-3 rounded-lg text-xs sm:text-sm"
                        style={{
                          backgroundColor: `${item.color}10`,
                          borderLeft: `3px solid ${item.color}`,
                        }}
                      >
                        <span className="text-white/80">{item.note}</span>
                      </div>
                    )}
                  </div>

                  {/* Visual Mockup */}
                  <div
                    className={`${isEven ? "lg:order-2" : "lg:order-1"} h-72 sm:h-80 rounded-2xl overflow-hidden`}
                    style={{
                      background: `linear-gradient(135deg, ${item.color}15, ${item.color}05)`,
                      border: `1px solid ${item.color}30`,
                    }}
                  >
                    {/* Website Mockup */}
                    {i === 0 && (
                      <div className="h-full p-4 flex flex-col">
                        {/* Browser Chrome */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                          </div>
                          <div className="flex-1 h-5 rounded bg-white/10 mx-2" />
                        </div>
                        {/* Website Content */}
                        <div className="flex-1 rounded-lg bg-white/5 p-3 space-y-3">
                          <div className="flex justify-between items-center">
                            <div className="w-16 h-4 rounded bg-cyan-500/40" />
                            <div className="flex gap-2">
                              <div className="w-10 h-3 rounded bg-white/20" />
                              <div className="w-10 h-3 rounded bg-white/20" />
                              <div className="w-14 h-5 rounded bg-[#FC682C]/60" />
                            </div>
                          </div>
                          <div className="pt-4 space-y-2">
                            <div className="w-3/4 h-6 rounded bg-white/20" />
                            <div className="w-1/2 h-4 rounded bg-white/10" />
                          </div>
                          <div className="flex gap-2 pt-2">
                            <div className="w-20 h-8 rounded bg-cyan-500/50" />
                            <div className="w-20 h-8 rounded border border-white/20" />
                          </div>
                          <div className="grid grid-cols-3 gap-2 pt-4">
                            <div className="h-16 rounded bg-white/5 border border-white/10" />
                            <div className="h-16 rounded bg-white/5 border border-white/10" />
                            <div className="h-16 rounded bg-white/5 border border-white/10" />
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Workflow Mockup */}
                    {i === 1 && (
                      <div className="h-full p-6 flex items-center justify-center">
                        <div className="flex items-center gap-3">
                          {/* Step 1 */}
                          <div className="flex flex-col items-center">
                            <div className="w-14 h-14 rounded-xl bg-orange-500/30 border border-orange-500/50 flex items-center justify-center text-orange-400 text-xl">📥</div>
                            <span className="text-[10px] text-white/50 mt-1.5">Anfrage</span>
                          </div>
                          <div className="w-8 h-0.5 bg-gradient-to-r from-orange-500/50 to-orange-500/20" />
                          {/* Step 2 */}
                          <div className="flex flex-col items-center">
                            <div className="w-14 h-14 rounded-xl bg-orange-500/30 border border-orange-500/50 flex items-center justify-center text-orange-400 text-xl">⚡</div>
                            <span className="text-[10px] text-white/50 mt-1.5">Verarbeiten</span>
                          </div>
                          <div className="w-8 h-0.5 bg-gradient-to-r from-orange-500/50 to-orange-500/20" />
                          {/* Step 3 */}
                          <div className="flex flex-col items-center">
                            <div className="w-14 h-14 rounded-xl bg-orange-500/30 border border-orange-500/50 flex items-center justify-center text-orange-400 text-xl">✅</div>
                            <span className="text-[10px] text-white/50 mt-1.5">Erledigt</span>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* App Mockup */}
                    {i === 2 && (
                      <div className="h-full p-4 flex items-center justify-center gap-4">
                        {/* Phone */}
                        <div className="w-28 h-52 rounded-2xl bg-black/50 border-2 border-purple-500/40 p-1.5 relative">
                          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-white/20" />
                          <div className="h-full rounded-xl bg-gradient-to-b from-purple-500/20 to-purple-500/5 p-2 pt-4">
                            <div className="w-full h-3 rounded bg-white/20 mb-2" />
                            <div className="w-2/3 h-2 rounded bg-white/10 mb-3" />
                            <div className="space-y-1.5">
                              <div className="h-8 rounded bg-white/10" />
                              <div className="h-8 rounded bg-white/10" />
                              <div className="h-8 rounded bg-purple-500/40" />
                            </div>
                          </div>
                        </div>
                        {/* Tablet */}
                        <div className="w-36 h-48 rounded-xl bg-black/50 border-2 border-purple-500/40 p-1.5 hidden sm:block">
                          <div className="h-full rounded-lg bg-gradient-to-b from-purple-500/20 to-purple-500/5 p-2">
                            <div className="flex justify-between mb-2">
                              <div className="w-10 h-3 rounded bg-purple-500/40" />
                              <div className="w-6 h-3 rounded bg-white/20" />
                            </div>
                            <div className="grid grid-cols-2 gap-1.5">
                              <div className="h-14 rounded bg-white/10" />
                              <div className="h-14 rounded bg-white/10" />
                              <div className="h-14 rounded bg-white/10" />
                              <div className="h-14 rounded bg-white/10" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// Ablauf Section
function AblaufSection() {
  const t = useTranslations("pages.loesung.ablauf");

  const ablaufSteps = [
    {
      number: t("steps.1.number"),
      title: t("steps.1.title"),
      subtitle: t("steps.1.subtitle"),
      desc: t("steps.1.desc"),
      color: "#FC682C",
    },
    {
      number: t("steps.2.number"),
      title: t("steps.2.title"),
      subtitle: t("steps.2.subtitle"),
      desc: t("steps.2.desc"),
      color: "#FFB347",
    },
    {
      number: t("steps.3.number"),
      title: t("steps.3.title"),
      subtitle: t("steps.3.subtitle"),
      desc: t("steps.3.desc"),
      color: "#06b6d4",
    },
    {
      number: t("steps.4.number"),
      title: t("steps.4.title"),
      subtitle: t("steps.4.subtitle"),
      desc: t("steps.4.desc"),
      color: "#22c55e",
    },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-10 sm:mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm text-[#FC682C] font-medium uppercase tracking-wider">
              {t("badge")}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-3 mb-4 text-white">
              {t("headline")}{" "}
              <span className="text-[#FC682C]">{t("headlineHighlight")}</span>
            </h2>
            <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto">
              {t("subheadline")}
            </p>
          </motion.div>

          {/* Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ablaufSteps.map((step, i) => (
              <motion.div
                key={step.number}
                className="p-5 sm:p-6 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.15] transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-start gap-4">
                  <span
                    className="text-3xl sm:text-4xl font-bold"
                    style={{ color: step.color }}
                  >
                    {step.number}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-0.5">
                      {step.title}
                    </h3>
                    <p
                      className="text-xs font-medium mb-2"
                      style={{ color: step.color }}
                    >
                      {step.subtitle}
                    </p>
                    <p className="text-sm text-white/70">{step.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Anbindungen Section
function AnbindungenSection() {
  const t = useTranslations("pages.loesung.anbindungen");
  const items = t.raw("items") as string[];

  return (
    <section className="py-16 sm:py-20 lg:py-24 relative overflow-hidden bg-white/[0.01]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
              {t("headline")}
            </h2>
            <p className="text-sm sm:text-base text-white/80 mb-5">
              {t("description")}
            </p>

            <ul className="space-y-2.5 mb-5">
              {items.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-sm text-white/70"
                >
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 bg-[#FC682C]" />
                  {item}
                </li>
              ))}
            </ul>

            <p className="text-xs text-white/50">{t("note")}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Eigentum Section
function EigentumSection() {
  const t = useTranslations("pages.loesung.eigentum");
  const items = t.raw("items") as string[];

  return (
    <section className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Visualization Placeholder */}
            <motion.div
              className="order-2 lg:order-1 h-64 rounded-2xl bg-gradient-to-br from-[#FC682C]/10 to-green-500/5 border border-[#FC682C]/20"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            />

            {/* Content */}
            <motion.div
              className="order-1 lg:order-2 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#FC682C]/10 to-orange-500/5 border border-[#FC682C]/30"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                {t("headline")}
              </h2>
              <p className="text-sm sm:text-base text-white/80 mb-5">
                {t("description")}
              </p>

              <ul className="space-y-2.5 mb-5">
                {items.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-sm text-white/80"
                  >
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 bg-[#FC682C]" />
                    {item}
                  </li>
                ))}
              </ul>

              <p className="text-xs text-white/50">{t("note")}</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Vertraulichkeit Section
function VertraulichkeitSection() {
  const t = useTranslations("pages.loesung.vertraulichkeit");

  const items = [
    { icon: "lock", text: t("items.noDisclosure") },
    { icon: "shield", text: t("items.conceptProtection") },
    { icon: "document", text: t("items.writtenAgreement") },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 relative overflow-hidden bg-white/[0.01]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
              {t("headline")}
            </h2>
            <p className="text-sm sm:text-base text-white/80 mb-5">
              {t("description")}
            </p>

            <ul className="space-y-2.5">
              {items.map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2.5 text-sm text-white/80"
                >
                  <svg
                    className="w-4 h-4 text-[#FC682C]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {item.text}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Final CTA Section
function FinalCTASection() {
  const t = useTranslations("pages.loesung.finalCta");

  return (
    <section className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <motion.h2
            className="text-2xl sm:text-3xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {t("headline")}{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {t("headlineHighlight")}
            </span>
          </motion.h2>

          <motion.p
            className="text-sm sm:text-base text-white/80 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            {t("description")}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/website-check"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all"
            >
              {t("ctaPrimary")}
              <svg
                className="w-4 h-4"
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
            <Link
              href="/termin"
              className="flex items-center gap-2 px-6 py-3 bg-gray-800 border border-gray-700 text-white text-sm font-semibold rounded-xl hover:bg-gray-700 transition-all"
            >
              {t("ctaSecondary")}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Main Page
export default function LoesungPage() {
  return (
    <main className="bg-[#030308] min-h-screen">
      <HeroSection />
      <ProblemSection />
      <LeistungenSection />
      <AblaufSection />
      <AnbindungenSection />
      <EigentumSection />
      <VertraulichkeitSection />
      <FinalCTASection />
    </main>
  );
}
