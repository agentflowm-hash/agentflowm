"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const blockColors = {
  website: "#06b6d4",
  workflows: "#FFB347",
  leadflow: "#22c55e",
};

// Responsive System-Integration Visualisierung
function LoesungVisualization({ bausteine }: { bausteine: { number: string; title: string; subtitle: string; desc: string; bullets: string[]; color: string }[] }) {
  return (
    <div className="relative w-full h-[260px] sm:h-[300px] lg:h-[360px] flex items-center justify-center">
      {/* Background Glows */}
      <div className="absolute w-40 h-40 sm:w-56 sm:h-56 lg:w-64 lg:h-64 bg-gradient-to-br from-[#FC682C]/20 via-cyan-500/10 to-green-500/10 rounded-full blur-3xl" />

      {/* Äußerer rotierender Ring */}
      <motion.svg
        className="absolute w-[180px] h-[180px] sm:w-[240px] sm:h-[240px] lg:w-[300px] lg:h-[300px]"
        viewBox="0 0 320 320"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        <defs>
          <linearGradient id="seg1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="seg2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFB347" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FFB347" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="seg3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <circle
          cx="160"
          cy="160"
          r="150"
          fill="none"
          stroke="url(#seg1)"
          strokeWidth="3"
          strokeDasharray="157 314"
          strokeLinecap="round"
        />
        <circle
          cx="160"
          cy="160"
          r="150"
          fill="none"
          stroke="url(#seg2)"
          strokeWidth="3"
          strokeDasharray="157 314"
          strokeDashoffset="-157"
          strokeLinecap="round"
        />
        <circle
          cx="160"
          cy="160"
          r="150"
          fill="none"
          stroke="url(#seg3)"
          strokeWidth="3"
          strokeDasharray="157 314"
          strokeDashoffset="-314"
          strokeLinecap="round"
        />
      </motion.svg>

      {/* Mittlerer Ring */}
      <motion.div
        className="absolute w-[130px] h-[130px] sm:w-[170px] sm:h-[170px] lg:w-[220px] lg:h-[220px] rounded-full border border-[#FC682C]/20"
        style={{ borderStyle: "dashed" }}
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />

      {/* Innerer pulsierender Ring */}
      <motion.div
        className="absolute w-[90px] h-[90px] sm:w-[120px] sm:h-[120px] lg:w-[150px] lg:h-[150px] rounded-full border-2 border-[#FC682C]/30"
        animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Zentrales System-Hub */}
      <motion.div
        className="relative z-10"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", duration: 0.8 }}
      >
        <div
          className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl flex items-center justify-center relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(252,104,44,0.9), rgba(200,70,20,0.9))",
            boxShadow:
              "0 0 50px rgba(252, 104, 44, 0.4), 0 15px 30px rgba(0,0,0,0.3)",
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-2xl" />
          <svg
            className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white relative z-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </motion.div>

      {/* Drei Baustein-Nodes */}
      {bausteine.map((block, i) => {
        const angle = (i * 120 - 90) * (Math.PI / 180);
        const radiusBase = 60;
        const radiusSm = 85;
        const radiusLg = 110;

        return (
          <motion.div
            key={block.number}
            className="absolute"
            style={{
              left: "50%",
              top: "50%",
            }}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.15, type: "spring" }}
          >
            {/* Mobile */}
            <motion.div
              className="block sm:hidden -translate-x-1/2 -translate-y-1/2"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
            >
              <div
                className="w-9 h-9 rounded-lg flex flex-col items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${block.color}25, ${block.color}08)`,
                  border: `2px solid ${block.color}50`,
                  boxShadow: `0 0 20px ${block.color}20`,
                  transform: `translate(${Math.cos(angle) * radiusBase}px, ${Math.sin(angle) * radiusBase}px)`,
                }}
              >
                <span
                  className="text-sm font-bold"
                  style={{ color: block.color }}
                >
                  {block.number}
                </span>
              </div>
            </motion.div>
            {/* Tablet */}
            <motion.div
              className="hidden sm:block lg:hidden -translate-x-1/2 -translate-y-1/2"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
            >
              <div
                className="w-12 h-12 rounded-xl flex flex-col items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${block.color}25, ${block.color}08)`,
                  border: `2px solid ${block.color}50`,
                  boxShadow: `0 0 25px ${block.color}20`,
                  transform: `translate(${Math.cos(angle) * radiusSm}px, ${Math.sin(angle) * radiusSm}px)`,
                }}
              >
                <span
                  className="text-base font-bold"
                  style={{ color: block.color }}
                >
                  {block.number}
                </span>
              </div>
            </motion.div>
            {/* Desktop */}
            <motion.div
              className="hidden lg:block -translate-x-1/2 -translate-y-1/2"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
            >
              <div
                className="w-14 h-14 rounded-xl flex flex-col items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${block.color}25, ${block.color}08)`,
                  border: `2px solid ${block.color}50`,
                  boxShadow: `0 0 25px ${block.color}20`,
                  transform: `translate(${Math.cos(angle) * radiusLg}px, ${Math.sin(angle) * radiusLg}px)`,
                }}
              >
                <span
                  className="text-lg font-bold"
                  style={{ color: block.color }}
                >
                  {block.number}
                </span>
              </div>
            </motion.div>
          </motion.div>
        );
      })}

      {/* Status Labels - nur auf größeren Screens */}
      <div className="hidden lg:block">
        {[
          { label: "CONNECTED", x: "5%", y: "20%", color: "#22c55e" },
          { label: "ACTIVE", x: "70%", y: "15%", color: "#06b6d4" },
          { label: "SYNCED", x: "73%", y: "78%", color: "#FFB347" },
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
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1 + i * 0.2 }}
          >
            <span className="flex items-center gap-1">
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: status.color }}
              />
              {status.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function LoesungSection() {
  const t = useTranslations("solution");

  const bausteine = [
    {
      number: "1",
      title: t("blocks.website.title"),
      subtitle: t("blocks.website.subtitle"),
      desc: t("blocks.website.desc"),
      bullets: [
        t("blocks.website.bullets.0"),
        t("blocks.website.bullets.1"),
        t("blocks.website.bullets.2"),
      ],
      color: blockColors.website,
    },
    {
      number: "2",
      title: t("blocks.workflows.title"),
      subtitle: t("blocks.workflows.subtitle"),
      desc: t("blocks.workflows.desc"),
      bullets: [
        t("blocks.workflows.bullets.0"),
        t("blocks.workflows.bullets.1"),
        t("blocks.workflows.bullets.2"),
      ],
      color: blockColors.workflows,
    },
    {
      number: "3",
      title: t("blocks.leadflow.title"),
      subtitle: t("blocks.leadflow.subtitle"),
      desc: t("blocks.leadflow.desc"),
      bullets: [
        t("blocks.leadflow.bullets.0"),
        t("blocks.leadflow.bullets.1"),
        t("blocks.leadflow.bullets.2"),
      ],
      color: blockColors.leadflow,
    },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FC682C]/5 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Desktop: Visualisierung LINKS, Text RECHTS */}
          {/* Mobile: Text oben, Visualisierung unten */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-12 lg:mb-16">
            {/* Visualisierung - Links auf Desktop, unten auf Mobile */}
            <motion.div
              className="order-2 lg:order-1"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <LoesungVisualization bausteine={bausteine} />
            </motion.div>

            {/* Text Content - Rechts auf Desktop, oben auf Mobile */}
            <motion.div
              className="order-1 lg:order-2 text-center lg:text-left"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-sm text-[#FC682C] font-medium uppercase tracking-wider">
                {t("badge")}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mt-3 mb-4 text-white">
                <span className="text-[#FC682C]">{t("headline")}</span>{" "}
                {t("headlineHighlight")}
              </h2>
              <p className="text-base sm:text-lg text-white/80 max-w-xl mx-auto lg:mx-0">
                {t("subheadline")}
              </p>
            </motion.div>
          </div>

          {/* 3 Bausteine */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {bausteine.map((block, i) => (
              <motion.div
                key={block.number}
                className="p-5 sm:p-6 rounded-xl bg-gradient-to-br from-white/[0.05] to-white/[0.01] border border-white/[0.08] hover:border-white/[0.15] transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                {/* Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-lg sm:text-xl font-bold"
                    style={{
                      background: `linear-gradient(135deg, ${block.color}30, ${block.color}10)`,
                      border: `2px solid ${block.color}50`,
                      color: block.color,
                      boxShadow: `0 0 20px ${block.color}15`,
                    }}
                  >
                    {block.number}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white">
                      {block.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/60">
                      {block.subtitle}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm sm:text-base text-white/70 mb-4">
                  {block.desc}
                </p>

                {/* Bullets */}
                <ul className="space-y-2">
                  {block.bullets.map((bullet, j) => (
                    <li
                      key={j}
                      className="flex items-center gap-2 text-sm text-white/70"
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: block.color }}
                      />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
