"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui";

// ===============================================================
//                    TYPES
// ===============================================================

interface Finding {
  type: "success" | "warning" | "error" | "info";
  category: string;
  message: string;
}

interface Recommendation {
  priority: "P1" | "P2" | "P3";
  category: string;
  text: string;
}

interface CheckResult {
  url: string;
  loadTime: number;
  scores: {
    security: number;
    seo: number;
    accessibility: number;
    performance: number;
    structure: number;
  };
  findings: Finding[];
  recommendations: Recommendation[];
  meta: {
    title: string | null;
    description: string | null;
  };
}

// ===============================================================
//                    ANIMATED BACKGROUND
// ===============================================================

function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute top-20 right-[15%] w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] rounded-full bg-gradient-to-br from-[#06b6d4]/20 to-transparent blur-[100px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 left-[10%] w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] rounded-full bg-gradient-to-tr from-[#FC682C]/15 to-transparent blur-[80px]"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(6,182,212,0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.2) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}

// ===============================================================
//                    HERO VISUALIZATION
// ===============================================================

function HeroVisualization({ t }: { t: ReturnType<typeof useTranslations<"pages.websiteCheck">> }) {
  const categories = [
    { icon: "🔒", label: t("hero.categories.security"), color: "#22c55e" },
    { icon: "🔍", label: t("hero.categories.seo"), color: "#06b6d4" },
    { icon: "♿", label: t("hero.categories.accessibility"), color: "#a855f7" },
    { icon: "⚡", label: t("hero.categories.performance"), color: "#FFB347" },
    { icon: "🏗️", label: t("hero.categories.structure"), color: "#FC682C" },
  ];

  return (
    <div className="relative w-full h-[320px] sm:h-[380px] md:h-[420px] flex items-center justify-center">
      {/* Central Scanner */}
      <motion.div
        className="absolute w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl bg-gradient-to-br from-[#06b6d4] to-[#0891b2] flex items-center justify-center z-20"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        style={{
          boxShadow:
            "0 0 50px rgba(6, 182, 212, 0.4), 0 0 100px rgba(6, 182, 212, 0.2)",
        }}
      >
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-2xl">
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent"
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <svg
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-white relative z-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
      </motion.div>

      {/* Scanning Rings */}
      {[1, 2, 3].map((ring) => (
        <motion.div
          key={ring}
          className="absolute rounded-full border-2 border-[#06b6d4]/20"
          style={{
            width: `${100 + ring * 60}px`,
            height: `${100 + ring * 60}px`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: ring * 0.3,
          }}
        />
      ))}

      {/* Category Icons */}
      {categories.map((cat, i) => {
        const angle = (i * 72 - 90) * (Math.PI / 180);
        const radius = 120;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <motion.div
            key={cat.label}
            className="absolute"
            style={{
              left: `calc(50% + ${x}px - 28px)`,
              top: `calc(50% + ${y}px - 28px)`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
          >
            <motion.div
              className="relative"
              animate={{ y: [0, -5, 0] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            >
              <div
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-xl sm:text-2xl"
                style={{
                  backgroundColor: `${cat.color}20`,
                  border: `2px solid ${cat.color}40`,
                  boxShadow: `0 0 20px ${cat.color}30`,
                }}
              >
                {cat.icon}
              </div>
              <span
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] sm:text-[10px] font-medium whitespace-nowrap"
                style={{ color: cat.color }}
              >
                {cat.label}
              </span>

              <motion.div
                className="absolute top-1/2 left-1/2 w-[2px] origin-top"
                style={{
                  height: `${radius - 40}px`,
                  background: `linear-gradient(to bottom, ${cat.color}60, transparent)`,
                  transform: `rotate(${i * 72 + 90}deg)`,
                }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.8, delay: 0.8 + i * 0.1 }}
              />
            </motion.div>
          </motion.div>
        );
      })}

      {/* Floating Particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-[#06b6d4]"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}
    </div>
  );
}

// ===============================================================
//                    CATEGORIES SECTION
// ===============================================================

function CategoriesSection({ t }: { t: ReturnType<typeof useTranslations<"pages.websiteCheck">> }) {
  const checkCategories = [
    {
      icon: "🔒",
      title: t("categories.security.title"),
      desc: t("categories.security.desc"),
      color: "#22c55e",
      checks: t.raw("categories.security.checks") as string[],
    },
    {
      icon: "🔍",
      title: t("categories.seo.title"),
      desc: t("categories.seo.desc"),
      color: "#06b6d4",
      checks: t.raw("categories.seo.checks") as string[],
    },
    {
      icon: "♿",
      title: t("categories.accessibility.title"),
      desc: t("categories.accessibility.desc"),
      color: "#a855f7",
      checks: t.raw("categories.accessibility.checks") as string[],
    },
    {
      icon: "⚡",
      title: t("categories.performance.title"),
      desc: t("categories.performance.desc"),
      color: "#FFB347",
      checks: t.raw("categories.performance.checks") as string[],
    },
    {
      icon: "🏗️",
      title: t("categories.structure.title"),
      desc: t("categories.structure.desc"),
      color: "#FC682C",
      checks: t.raw("categories.structure.checks") as string[],
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20">
      <div className="container px-4 sm:px-6">
        <motion.div
          className="text-center mb-10 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            {t("categories.headline")}{" "}
            <span className="text-[#06b6d4]">{t("categories.headlineHighlight")}</span>
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto">
            {t("categories.subheadline")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
          {checkCategories.map((cat, i) => (
            <motion.div
              key={cat.title}
              className="group p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-white/20 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <motion.div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-2xl mb-4"
                style={{
                  backgroundColor: `${cat.color}15`,
                  border: `1px solid ${cat.color}30`,
                }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                {cat.icon}
              </motion.div>
              <h3
                className="font-semibold text-base sm:text-lg mb-2"
                style={{ color: cat.color }}
              >
                {cat.title}
              </h3>
              <p className="text-white/50 text-sm mb-4">{cat.desc}</p>
              <ul className="space-y-1.5">
                {cat.checks.map((check, j) => (
                  <li
                    key={j}
                    className="flex items-center gap-2 text-xs text-white/40"
                  >
                    <svg
                      className="w-3 h-3 flex-shrink-0"
                      style={{ color: cat.color }}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {check}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===============================================================
//                    SCORE CIRCLE
// ===============================================================

function ScoreCircle({
  score,
  label,
  size = "md",
}: {
  score: number;
  label: string;
  size?: "sm" | "md" | "lg";
}) {
  const getColor = (s: number) => {
    if (s >= 80) return "#22c55e";
    if (s >= 50) return "#eab308";
    return "#ef4444";
  };

  const color = getColor(score);
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const sizes = {
    sm: {
      wrapper: "w-14 h-14 sm:w-16 sm:h-16",
      text: "text-base sm:text-lg",
      label: "text-[10px] sm:text-xs",
    },
    md: {
      wrapper: "w-18 h-18 sm:w-20 sm:h-20",
      text: "text-lg sm:text-xl",
      label: "text-[10px] sm:text-xs",
    },
    lg: {
      wrapper: "w-24 h-24 sm:w-28 sm:h-28",
      text: "text-2xl sm:text-3xl",
      label: "text-xs sm:text-sm",
    },
  };

  return (
    <div className="flex flex-col items-center gap-1.5 sm:gap-2">
      <div className={`relative ${sizes[size].wrapper}`}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-white/10"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className={`font-bold ${sizes[size].text}`}
            style={{ color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}
          </motion.span>
        </div>
      </div>
      <span className={`text-white/50 ${sizes[size].label} text-center`}>
        {label}
      </span>
    </div>
  );
}

// ===============================================================
//                    FINDING ICON
// ===============================================================

function FindingIcon({ type }: { type: Finding["type"] }) {
  const config = {
    success: { color: "text-green-500", bg: "bg-green-500/10" },
    warning: { color: "text-yellow-500", bg: "bg-yellow-500/10" },
    error: { color: "text-red-500", bg: "bg-red-500/10" },
    info: { color: "text-blue-500", bg: "bg-blue-500/10" },
  };

  const icons = {
    success: (
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    ),
    warning: (
      <path
        fillRule="evenodd"
        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    ),
    error: (
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
        clipRule="evenodd"
      />
    ),
    info: (
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
        clipRule="evenodd"
      />
    ),
  };

  return (
    <div
      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${config[type].bg} flex items-center justify-center flex-shrink-0`}
    >
      <svg
        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${config[type].color}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        {icons[type]}
      </svg>
    </div>
  );
}

// ===============================================================
//                    MAIN PAGE
// ===============================================================

export default function WebsiteCheckPage() {
  const t = useTranslations("pages.websiteCheck");
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [result, setResult] = useState<CheckResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");
    setResult(null);

    try {
      let normalizedUrl = url.trim();
      if (
        !normalizedUrl.startsWith("http://") &&
        !normalizedUrl.startsWith("https://")
      ) {
        normalizedUrl = "https://" + normalizedUrl;
      }

      const response = await fetch("/api/website-check/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: normalizedUrl }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || t("form.errorCheck"));

      setResult(data);
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : t("form.errorDefault"),
      );
    }
  };

  const overallScore = result
    ? Math.round(
        (result.scores.security +
          result.scores.seo +
          result.scores.accessibility +
          result.scores.performance +
          result.scores.structure) /
          5,
      )
    : 0;

  const groupedFindings = result?.findings.reduce(
    (acc, finding) => {
      if (!acc[finding.category]) acc[finding.category] = [];
      acc[finding.category].push(finding);
      return acc;
    },
    {} as Record<string, Finding[]>,
  );

  const categoryIcons: Record<string, string> = {
    Security: "🔒",
    SEO: "🔍",
    Accessibility: "♿",
    Performance: "⚡",
    Structure: "🏗️",
  };

  return (
    <>
      {/* Hero */}
      <section className="relative pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-12 overflow-hidden">
        <AnimatedBackground />

        <div className="container relative z-10 px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-left">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#06b6d4]/10 border border-[#06b6d4]/20 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.span
                  className="w-2 h-2 rounded-full bg-[#06b6d4]"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-sm font-medium text-[#06b6d4]">
                  {t("badge")}
                </span>
              </motion.div>

              <motion.h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {t("title")}
                <span className="relative inline-block">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#06b6d4] via-[#FC682C] to-[#FFB347]">
                    {t("titleHighlight")}
                  </span>
                  <motion.span
                    className="absolute -inset-2 bg-[#06b6d4]/20 blur-xl rounded-lg"
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </span>
              </motion.h1>

              <motion.p
                className="text-base sm:text-lg md:text-xl text-white/60 mb-8 sm:mb-10 max-w-xl mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {t("subtitle")}
              </motion.p>

              {/* Stats */}
              <motion.div
                className="flex flex-wrap justify-center lg:justify-start gap-6 sm:gap-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {[
                  { value: "5", label: t("stats.categories") },
                  { value: "30+", label: t("stats.checks") },
                  { value: "< 10s", label: t("stats.analysis") },
                ].map((stat, i) => (
                  <div key={i} className="text-center lg:text-left">
                    <motion.div
                      className="text-2xl sm:text-3xl font-bold text-[#06b6d4]"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.5 + i * 0.1,
                        type: "spring",
                      }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-xs sm:text-sm text-white/50 mt-1">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Visualization */}
            <div>
              <HeroVisualization t={t} />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <CategoriesSection t={t} />

      {/* Check Form Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white/[0.02]">
        <div className="container px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div
              className="text-center mb-8 sm:mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                {t("form.headline")}{" "}
                <span className="text-[#06b6d4]">{t("form.headlineHighlight")}</span>
              </h2>
              <p className="text-white/50">
                {t("form.subheadline")}
              </p>
            </motion.div>

            {/* Input Form */}
            {!result && (
              <motion.div
                className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5 sm:space-y-6"
                >
                  <div>
                    <label className="block text-base sm:text-lg font-medium mb-3">
                      {t("form.urlLabel")}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder={t("form.placeholder")}
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        required
                        className="w-full px-4 sm:px-5 py-3.5 sm:py-4 pl-12 sm:pl-14 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 focus:border-[#06b6d4] focus:ring-2 focus:ring-[#06b6d4]/20 outline-none transition-all text-base sm:text-lg placeholder:text-white/30"
                      />
                      <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-white/40">
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5"
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
                      </div>
                    </div>
                  </div>

                  {status === "error" && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                      {errorMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading" || !url.trim()}
                    className="w-full py-3.5 sm:py-4 px-6 rounded-xl bg-gradient-to-r from-[#06b6d4] to-[#FC682C] text-white font-semibold text-base sm:text-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === "loading" ? (
                      <span className="flex items-center justify-center gap-3">
                        <svg
                          className="w-5 h-5 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        {t("form.loading")}
                      </span>
                    ) : (
                      t("form.submit")
                    )}
                  </button>

                  <p className="text-xs text-white/40 text-center">
                    {t("form.disclaimer")}
                  </p>
                </form>
              </motion.div>
            )}

            {/* Results */}
            {result && (
              <div className="space-y-5 sm:space-y-6">
                {/* Score Overview */}
                <motion.div
                  className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div>
                      <p className="text-xs sm:text-sm text-white/40 mb-1">
                        {t("results.checked")}
                      </p>
                      <p className="font-mono text-xs sm:text-sm break-all">
                        {result.url}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-white/40">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {result.loadTime}ms
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8 md:gap-12">
                    <ScoreCircle
                      score={overallScore}
                      label={t("results.overall")}
                      size="lg"
                    />
                    <div className="flex-1 grid grid-cols-5 gap-2 sm:gap-3">
                      <ScoreCircle
                        score={result.scores.security}
                        label={t("results.security")}
                        size="sm"
                      />
                      <ScoreCircle
                        score={result.scores.seo}
                        label={t("results.seo")}
                        size="sm"
                      />
                      <ScoreCircle
                        score={result.scores.accessibility}
                        label={t("results.accessibility")}
                        size="sm"
                      />
                      <ScoreCircle
                        score={result.scores.performance}
                        label={t("results.performance")}
                        size="sm"
                      />
                      <ScoreCircle
                        score={result.scores.structure}
                        label={t("results.structure")}
                        size="sm"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Meta Info */}
                {result.meta.title && (
                  <motion.div
                    className="p-5 sm:p-6 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
                      {t("results.metaInfo")}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-white/40 text-xs sm:text-sm">
                          {t("results.metaTitle")}
                        </span>
                        <p className="font-mono text-xs mt-1">
                          {result.meta.title || "—"}
                        </p>
                      </div>
                      <div>
                        <span className="text-white/40 text-xs sm:text-sm">
                          {t("results.metaDescription")}
                        </span>
                        <p className="font-mono text-xs mt-1 line-clamp-2">
                          {result.meta.description || "—"}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Findings */}
                <motion.div
                  className="p-5 sm:p-6 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="font-semibold mb-4 text-sm sm:text-base">
                    {t("results.detailedAnalysis")}
                  </h3>

                  <div className="flex flex-wrap gap-2 mb-5">
                    <button
                      onClick={() => setActiveCategory(null)}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all ${activeCategory === null ? "bg-[#06b6d4] text-white" : "bg-white/5 hover:bg-white/10"}`}
                    >
                      {t("results.all")}
                    </button>
                    {groupedFindings &&
                      Object.keys(groupedFindings).map((category) => (
                        <button
                          key={category}
                          onClick={() => setActiveCategory(category)}
                          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 sm:gap-2 ${activeCategory === category ? "bg-[#06b6d4] text-white" : "bg-white/5 hover:bg-white/10"}`}
                        >
                          <span>{categoryIcons[category] || ""}</span>
                          <span className="hidden sm:inline">{category}</span>
                        </button>
                      ))}
                  </div>

                  <div className="space-y-2 max-h-[300px] sm:max-h-[350px] overflow-y-auto pr-2">
                    {result.findings
                      .filter(
                        (f) => !activeCategory || f.category === activeCategory,
                      )
                      .map((finding, idx) => (
                        <motion.div
                          key={idx}
                          className="flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-white/[0.02] border border-white/5"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.02 }}
                        >
                          <FindingIcon type={finding.type} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm">
                              {finding.message}
                            </p>
                            <p className="text-[10px] sm:text-xs text-white/30 mt-1">
                              {finding.category}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </motion.div>

                {/* Recommendations */}
                {result.recommendations.length > 0 && (
                  <motion.div
                    className="p-5 sm:p-6 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="font-semibold mb-4 flex items-center gap-2 text-sm sm:text-base">
                      {t("results.recommendations")} ({result.recommendations.length})
                    </h3>
                    <div className="space-y-2.5 sm:space-y-3">
                      {result.recommendations.slice(0, 8).map((rec, idx) => (
                        <motion.div
                          key={idx}
                          className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white/[0.02] border border-white/5"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + idx * 0.05 }}
                        >
                          <span
                            className={`flex-shrink-0 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-bold ${
                              rec.priority === "P1"
                                ? "bg-red-500/20 text-red-400"
                                : rec.priority === "P2"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-blue-500/20 text-blue-400"
                            }`}
                          >
                            {rec.priority}
                          </span>
                          <div className="flex-1">
                            <p className="text-xs sm:text-sm">{rec.text}</p>
                            <p className="text-[10px] sm:text-xs text-white/30 mt-1">
                              {rec.category}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setResult(null);
                      setUrl("");
                      setStatus("idle");
                    }}
                    className="flex-1"
                  >
                    {t("results.newCheck")}
                  </Button>
                  <Button
                    variant="primary"
                    href="https://calendly.com/agentflowm/15min"
                    external
                    className="flex-1"
                  >
                    {t("results.freeConsultation")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container px-4 sm:px-6">
          <motion.div
            className="max-w-4xl mx-auto text-center p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#06b6d4]/10 to-[#FC682C]/10 border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              {t("cta.headline")}
            </h2>
            <p className="text-white/60 mb-8 max-w-xl mx-auto">
              {t("cta.subheadline")}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button variant="primary" href="/termin">
                {t("cta.primaryButton")}
              </Button>
              <Button variant="outline" href="/pakete">
                {t("cta.secondaryButton")}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
