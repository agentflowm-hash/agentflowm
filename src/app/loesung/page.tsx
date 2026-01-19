"use client";

import { motion } from "framer-motion";
import Link from "next/link";

// ═══════════════════════════════════════════════════════════════
//                    HERO SECTION
// ═══════════════════════════════════════════════════════════════

function HeroSection() {
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
          {/* Text Content - LINKS */}
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
                Systemlücken • Reibung • verlorene Anfragen
              </span>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold leading-[1.15] mb-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span className="text-white">Ihre Systeme bremsen.</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FC682C] via-[#FFB347] to-[#FC682C]">
                Wir machen daraus einen Ablauf, der trägt.
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              className="text-sm sm:text-base text-white/80 mb-5 max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Wenn Anfragen versanden, Übergaben hängen und Aufgaben manuell
              „gezogen" werden, entsteht Chaos – nicht Wachstum.
            </motion.p>
            <motion.p
              className="text-xs sm:text-sm text-white/70 mb-6 max-w-lg mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              Wir schließen diese Lücken mit einem klaren System aus Website,
              Workflows und – wenn nötig – Web-Apps/Apps. Stabil, verständlich,
              erweiterbar.
            </motion.p>

            {/* Value Chips */}
            <motion.div
              className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {[
                "SEO in High-Quality",
                "Live-ready Setup",
                "Verständlich statt kompliziert",
                "Code-Übergabe optional",
              ].map((chip) => (
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
                Termin buchen
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
                Kostenloser Webseitencheck
              </Link>
            </motion.div>

            {/* Mini Trustline */}
            <motion.div
              className="flex flex-wrap justify-center lg:justify-start gap-x-3 gap-y-1.5 text-xs text-white/70"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {[
                "Klare Schritte",
                "saubere Übergabe",
                "Vertraulichkeit (NDA) möglich",
              ].map((item) => (
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

          {/* Visualization - RECHTS */}
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
                  Website
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
                  Workflows
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
                  Apps
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

        {/* Floating Data Particles */}
        {[...Array(6)].map((_, i) => {
          const colors = [
            "#FC682C",
            "#06b6d4",
            "#FFB347",
            "#a855f7",
            "#22c55e",
            "#FC682C",
          ];
          const angles = [30, 90, 150, 210, 270, 330];
          const radius = 160;
          return (
            <motion.div
              key={i}
              className="absolute w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full"
              style={{
                background: colors[i],
                boxShadow: `0 0 12px ${colors[i]}`,
                left: "50%",
                top: "50%",
              }}
              animate={{
                x: [0, Math.cos((angles[i] * Math.PI) / 180) * radius, 0],
                y: [0, Math.sin((angles[i] * Math.PI) / 180) * radius, 0],
                scale: [0.5, 1.2, 0.5],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.6,
                ease: "easeInOut",
              }}
            />
          );
        })}

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

// ═══════════════════════════════════════════════════════════════
//                    PROBLEM SECTION
// ═══════════════════════════════════════════════════════════════

const problems = [
  {
    title: "Anfragen ohne Führung",
    desc: "Besucher sehen Inhalte – aber keinen klaren nächsten Schritt.",
    color: "#ef4444",
  },
  {
    title: "Übergaben, die hängen bleiben",
    desc: "Infos sind verteilt, Zuständigkeiten unklar, Rückfragen kosten Zeit.",
    color: "#f59e0b",
  },
  {
    title: "Zu viel Handarbeit",
    desc: "Posten, Nachfassen, Sortieren, Antworten: teuer, langsam, fehleranfällig.",
    color: "#FFB347",
  },
  {
    title: "Keine Übersicht im Betrieb",
    desc: "Man merkt Probleme erst, wenn es schon brennt.",
    color: "#a855f7",
  },
];

// Broken System Visualization for Problem Section
function BrokenSystemVisualization() {
  return (
    <div className="relative w-full h-[300px] sm:h-[350px] lg:h-[400px] flex items-center justify-center">
      {/* Red Warning Glow */}
      <motion.div
        className="absolute w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] lg:w-[350px] lg:h-[350px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(239,68,68,0.2) 0%, rgba(239,68,68,0.05) 50%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Broken Chain Links */}
      <div className="relative">
        {/* Central Broken Core */}
        <motion.div
          className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Cracked pieces */}
          <motion.div
            className="absolute top-0 left-0 w-1/2 h-1/2 rounded-tl-2xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(239,68,68,0.8), rgba(185,28,28,0.6))",
              boxShadow: "0 0 30px rgba(239,68,68,0.5)",
            }}
            animate={{ x: [-2, 2, -2], y: [-2, 2, -2] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-0 right-0 w-1/2 h-1/2 rounded-tr-2xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(245,158,11,0.8), rgba(217,119,6,0.6))",
              boxShadow: "0 0 30px rgba(245,158,11,0.5)",
            }}
            animate={{ x: [2, -2, 2], y: [-2, 2, -2] }}
            transition={{ duration: 2.2, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-1/2 h-1/2 rounded-bl-2xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(168,85,247,0.8), rgba(139,92,246,0.6))",
              boxShadow: "0 0 30px rgba(168,85,247,0.5)",
            }}
            animate={{ x: [-2, 2, -2], y: [2, -2, 2] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-1/2 h-1/2 rounded-br-2xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,179,71,0.8), rgba(234,88,12,0.6))",
              boxShadow: "0 0 30px rgba(255,179,71,0.5)",
            }}
            animate={{ x: [2, -2, 2], y: [2, -2, 2] }}
            transition={{ duration: 2.4, repeat: Infinity }}
          />

          {/* Crack lines */}
          <svg className="absolute inset-0 w-full h-full">
            <motion.line
              x1="50%"
              y1="0"
              x2="50%"
              y2="100%"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="2"
              strokeDasharray="4 2"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.line
              x1="0"
              y1="50%"
              x2="100%"
              y2="50%"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="2"
              strokeDasharray="4 2"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            />
          </svg>
        </motion.div>

        {/* Disconnected Floating Elements */}
        {[
          {
            angle: 0,
            color: "#ef4444",
            icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
          },
          {
            angle: 72,
            color: "#f59e0b",
            icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
          },
          {
            angle: 144,
            color: "#a855f7",
            icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
          },
          {
            angle: 216,
            color: "#FFB347",
            icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
          },
          {
            angle: 288,
            color: "#06b6d4",
            icon: "M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414",
          },
        ].map((item, i) => {
          const radius = 100;
          const x = Math.cos((item.angle * Math.PI) / 180) * radius;
          const y = Math.sin((item.angle * Math.PI) / 180) * radius;
          return (
            <motion.div
              key={i}
              className="absolute w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${item.color}90, ${item.color}60)`,
                boxShadow: `0 0 20px ${item.color}50`,
                left: `calc(50% + ${x}px - 20px)`,
                top: `calc(50% + ${y}px - 20px)`,
              }}
              animate={{
                x: [0, Math.random() * 10 - 5, 0],
                y: [0, Math.random() * 10 - 5, 0],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={item.icon}
                />
              </svg>
            </motion.div>
          );
        })}

        {/* Broken Connection Lines */}
        <svg className="absolute w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 pointer-events-none">
          {[0, 72, 144, 216, 288].map((angle, i) => {
            const endX = 150 + Math.cos((angle * Math.PI) / 180) * 100;
            const endY = 150 + Math.sin((angle * Math.PI) / 180) * 100;
            return (
              <motion.line
                key={i}
                x1="150"
                y1="150"
                x2={endX}
                y2={endY}
                stroke={`rgba(239,68,68,0.3)`}
                strokeWidth="2"
                strokeDasharray="8 8"
                animate={{
                  opacity: [0.2, 0.5, 0.2],
                  strokeDashoffset: [0, 16],
                }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
              />
            );
          })}
        </svg>

        {/* Sparks / Error particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-red-500"
            style={{
              boxShadow: "0 0 8px #ef4444",
              left: `${30 + Math.random() * 40}%`,
              top: `${30 + Math.random() * 40}%`,
            }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0],
              x: [0, (Math.random() - 0.5) * 40],
              y: [0, (Math.random() - 0.5) * 40],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Glitch Effect Overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(239,68,68,0.03) 50%, transparent 100%)",
        }}
        animate={{ x: [-100, 100, -100] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

function ProblemSection() {
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
              Was fehlt meistens?
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-3 mb-4 text-white">
              Warum gute Angebote trotzdem{" "}
              <span className="text-red-500">verlieren</span>
            </h2>
            <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto">
              Die Leistung ist oft stark – aber der Ablauf ist schwach. Und
              genau dort gehen Anfragen, Zeit und Umsatz verloren.
            </p>
          </motion.div>

          {/* Content Grid - Visualization + Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-10">
            {/* Visualization */}
            <motion.div
              className="order-2 lg:order-1"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <BrokenSystemVisualization />
            </motion.div>

            {/* Problem Cards */}
            <div className="order-1 lg:order-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
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
                Ein System macht aus Stress{" "}
                <span className="text-[#FC682C] font-semibold">Struktur</span> –
                und aus Struktur{" "}
                <span className="text-[#FC682C] font-semibold">
                  planbare Ergebnisse
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

// ═══════════════════════════════════════════════════════════════
//                    LEISTUNGEN SECTION
// ═══════════════════════════════════════════════════════════════

const leistungen = [
  {
    number: "1",
    title: "Website",
    subtitle: "Zentrum & Führung",
    desc: "Ihre Website wird zur klaren Strecke: Menschen verstehen sofort, was Sie anbieten – und wie sie handeln sollen. Ohne Umwege, ohne Rätselraten.",
    bullets: [
      "Struktur & Seitenlogik, die Besucher führt",
      "Texte, die zur Handlung führen (Kontakt/Termin/Anfrage)",
      "SEO (High-Quality) + Performance als Standard",
      "Mobile-first: schnell, stabil, sauber aufgebaut",
      "Live-ready: technisch vorbereitet für Sichtbarkeit & Messbarkeit",
    ],
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
    number: "2",
    title: "Workflows",
    subtitle: "Abläufe statt Nachfassen",
    desc: "Workflows machen wiederkehrende Schritte zuverlässig. Sie sparen Zeit, reduzieren Fehler und sorgen dafür, dass Dinge nicht liegen bleiben.",
    bullets: [
      "Anfrage rein → sortieren → Aktion auslösen",
      "Publishing-Ablauf: Plan → Prüfung → Freigabe → Veröffentlichung",
      "Qualität bleibt konstant: Vorlagen & Checks statt Bauchgefühl",
      "Erweiterbar: zusätzliche Module jederzeit möglich",
    ],
    note: "Workflows sind so gebaut, dass man sie versteht: klare Schritte, klare Zustände, klare Verantwortung.",
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
    number: "3",
    title: "Web-Apps & Apps",
    subtitle: "Wenn es mehr als Seiten braucht",
    desc: "Wenn Sie Logins, Portale, Dashboards, Buchungen oder interne Tools brauchen, bauen wir ein echtes System – sauber strukturiert und produktionsreif.",
    bullets: [
      "Nutzerbereiche & Rollen (je nach Projekt)",
      "Portale, Buchungen, Dashboards, interne Tools",
      "Stabiler Aufbau, skalierbar geplant",
      "Übergabe als Code möglich (Eigentum & Kontrolle)",
    ],
    note: "Apps enthalten keine Workflows automatisch. Workflows können separat ergänzt und angebunden werden.",
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

// Website Visualization - Layered Browser/Pages
function WebsiteVisualization() {
  return (
    <div className="relative w-full h-[280px] sm:h-[320px] flex items-center justify-center">
      {/* Glow */}
      <motion.div
        className="absolute w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Stacked Browser Windows */}
      <div className="relative" style={{ perspective: "800px" }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute w-[160px] h-[100px] sm:w-[200px] sm:h-[120px] rounded-lg overflow-hidden"
            style={{
              background: `linear-gradient(135deg, rgba(6,182,212,${0.9 - i * 0.2}), rgba(8,145,178,${0.7 - i * 0.15}))`,
              boxShadow: `0 ${10 + i * 5}px ${30 + i * 10}px rgba(6,182,212,${0.3 - i * 0.08})`,
              transform: `translateZ(${-i * 30}px) translateY(${i * 15}px) translateX(${i * 10}px)`,
              zIndex: 3 - i,
            }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
          >
            {/* Browser Chrome */}
            <div className="h-5 bg-black/30 flex items-center gap-1.5 px-2">
              <div className="w-2 h-2 rounded-full bg-red-400/80" />
              <div className="w-2 h-2 rounded-full bg-yellow-400/80" />
              <div className="w-2 h-2 rounded-full bg-green-400/80" />
              <div className="flex-1 mx-2 h-2.5 rounded bg-white/10" />
            </div>
            {/* Content Lines */}
            <div className="p-3 space-y-2">
              <div className="h-2 w-3/4 rounded bg-white/30" />
              <div className="h-2 w-1/2 rounded bg-white/20" />
              <div className="h-2 w-2/3 rounded bg-white/15" />
            </div>
          </motion.div>
        ))}

        {/* SEO Badges floating */}
        {["SEO", "Mobile", "Speed"].map((label, i) => (
          <motion.div
            key={label}
            className="absolute px-2 py-1 rounded-full text-[10px] font-bold bg-cyan-500/90 text-white"
            style={{
              top: `${20 + i * 30}%`,
              right: `${-20 - i * 10}%`,
            }}
            animate={{ y: [0, -5, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
          >
            {label}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Workflow Visualization - Connected Flow Nodes
function WorkflowVisualization() {
  const nodes = [
    { label: "Anfrage", color: "#FFB347" },
    { label: "Sortieren", color: "#f59e0b" },
    { label: "Aktion", color: "#ea580c" },
    { label: "Ergebnis", color: "#22c55e" },
  ];

  return (
    <div className="relative w-full h-[280px] sm:h-[320px] flex items-center justify-center">
      {/* Glow */}
      <motion.div
        className="absolute w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,179,71,0.2) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Flow Diagram */}
      <div className="relative flex flex-col items-center gap-3">
        {nodes.map((node, i) => (
          <div key={i} className="relative flex items-center">
            {/* Node */}
            <motion.div
              className="relative z-10 px-4 py-2 rounded-xl flex items-center gap-2"
              style={{
                background: `linear-gradient(135deg, ${node.color}90, ${node.color}70)`,
                boxShadow: `0 0 20px ${node.color}40`,
              }}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="w-2 h-2 rounded-full bg-white"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              />
              <span className="text-white text-sm font-semibold">
                {node.label}
              </span>
            </motion.div>

            {/* Connector Arrow */}
            {i < nodes.length - 1 && (
              <motion.div
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-0"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 + 0.1 }}
              >
                <motion.svg
                  width="20"
                  height="16"
                  viewBox="0 0 20 16"
                  animate={{ y: [0, 3, 0] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                >
                  <path
                    d="M10 0 L10 12 M5 8 L10 14 L15 8"
                    stroke={node.color}
                    strokeWidth="2"
                    fill="none"
                  />
                </motion.svg>
              </motion.div>
            )}
          </div>
        ))}

        {/* Automation Badge */}
        <motion.div
          className="absolute -right-16 top-1/2 -translate-y-1/2 px-2 py-1 rounded-lg bg-[#FFB347]/20 border border-[#FFB347]/40"
          animate={{ rotate: [0, 5, 0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <span className="text-[10px] text-[#FFB347] font-bold">AUTO</span>
        </motion.div>
      </div>
    </div>
  );
}

// Web-App Visualization - Dashboard/Portal Style
function WebAppVisualization() {
  return (
    <div className="relative w-full h-[280px] sm:h-[320px] flex items-center justify-center">
      {/* Glow */}
      <motion.div
        className="absolute w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* App Dashboard */}
      <motion.div
        className="relative w-[200px] h-[140px] sm:w-[240px] sm:h-[160px] rounded-xl overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(139,92,246,0.1))",
          border: "1px solid rgba(168,85,247,0.3)",
          boxShadow: "0 20px 50px rgba(168,85,247,0.3)",
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        {/* Top Bar */}
        <div className="h-6 bg-purple-500/30 flex items-center px-2 gap-2">
          <div className="w-4 h-4 rounded bg-purple-400/50" />
          <div className="flex-1" />
          <div className="w-5 h-3 rounded bg-white/20" />
        </div>

        {/* Sidebar + Content */}
        <div className="flex h-[calc(100%-24px)]">
          {/* Sidebar */}
          <div className="w-10 bg-purple-500/10 p-1.5 space-y-1.5">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="w-full h-5 rounded bg-purple-400/30"
                animate={{ opacity: i === 0 ? 1 : [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              />
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 p-2 space-y-2">
            {/* Stats Row */}
            <div className="flex gap-1.5">
              {["#a855f7", "#06b6d4", "#22c55e"].map((color, i) => (
                <motion.div
                  key={i}
                  className="flex-1 h-8 rounded"
                  style={{ background: `${color}30` }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                >
                  <motion.div
                    className="h-full rounded"
                    style={{ background: color, width: `${40 + i * 20}%` }}
                    animate={{
                      width: [
                        `${30 + i * 15}%`,
                        `${50 + i * 20}%`,
                        `${30 + i * 15}%`,
                      ],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  />
                </motion.div>
              ))}
            </div>
            {/* Chart Area */}
            <div className="h-12 rounded bg-purple-500/10 flex items-end px-1 gap-0.5">
              {[40, 65, 45, 80, 55, 70, 50, 85].map((h, i) => (
                <motion.div
                  key={i}
                  className="flex-1 rounded-t bg-gradient-to-t from-purple-500 to-purple-400"
                  animate={{ height: [`${h * 0.6}%`, `${h}%`, `${h * 0.6}%`] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <motion.div
          className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        >
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
        </motion.div>
      </motion.div>

      {/* User Icons */}
      {[
        { x: -80, y: -40, delay: 0 },
        { x: 80, y: -30, delay: 0.3 },
        { x: -70, y: 50, delay: 0.6 },
      ].map((pos, i) => (
        <motion.div
          key={i}
          className="absolute w-8 h-8 rounded-full bg-gradient-to-br from-purple-400/80 to-purple-600/80 flex items-center justify-center"
          style={{
            left: `calc(50% + ${pos.x}px)`,
            top: `calc(50% + ${pos.y}px)`,
          }}
          animate={{ y: [0, -5, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, delay: pos.delay }}
        >
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

const leistungVisualizations = [
  WebsiteVisualization,
  WorkflowVisualization,
  WebAppVisualization,
];

function LeistungenSection() {
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
              Unsere Leistungen
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-3 mb-4 text-white">
              Leistungen, die zusammen als{" "}
              <span className="text-[#FC682C]">System wirken</span>
            </h2>
            <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto">
              Wir bauen nicht „einzelne Bausteine". Wir verbinden alles so, dass
              es im Alltag funktioniert: klarer Einstieg → klare Übergaben →
              klare Ergebnisse.
            </p>
          </motion.div>

          {/* Leistungen */}
          <div className="space-y-16 sm:space-y-20">
            {leistungen.map((item, i) => {
              const VisualizationComponent = leistungVisualizations[i];
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
                  {/* Visualization */}
                  <div
                    className={`${isEven ? "lg:order-1" : "lg:order-2"} order-2`}
                  >
                    <VisualizationComponent />
                  </div>

                  {/* Content */}
                  <div
                    className={`${isEven ? "lg:order-2" : "lg:order-1"} order-1 p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08]`}
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
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    ABLAUF SECTION
// ═══════════════════════════════════════════════════════════════

const ablaufSteps = [
  {
    number: "01",
    title: "Analyse",
    subtitle: "Verstehen & Erfassen",
    desc: "Ziel, Angebot, Wege, Übergaben: Wir finden die Hebel, die Anfragen und Betrieb wirklich verbessern.",
    color: "#FC682C",
  },
  {
    number: "02",
    title: "Struktur",
    subtitle: "Planen & Organisieren",
    desc: "Seitenlogik, Inhalte, CTAs, Nutzerwege – als saubere Architektur.",
    color: "#FFB347",
  },
  {
    number: "03",
    title: "Umsetzung",
    subtitle: "Bauen & Verbinden",
    desc: "Wir bauen, testen, richten ein und verbinden alles, was vereinbart ist – nachvollziehbar und stabil.",
    color: "#06b6d4",
  },
  {
    number: "04",
    title: "Go-live & Übergabe",
    subtitle: "Abnahme & Abschluss",
    desc: "Gemeinsamer Check, Livegang, strukturierte Übergabe. Danach ist das Projekt abgeschlossen – Zusatzleistungen nur, wenn separat vereinbart.",
    color: "#22c55e",
  },
];

// Process Timeline Visualization
function ProcessVisualization() {
  const steps = [
    {
      icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
      label: "Analyse",
      color: "#FC682C",
    },
    {
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
      label: "Struktur",
      color: "#FFB347",
    },
    {
      icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
      label: "Umsetzung",
      color: "#06b6d4",
    },
    {
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      label: "Go-live",
      color: "#22c55e",
    },
  ];

  return (
    <div className="relative w-full h-[320px] sm:h-[380px] flex items-center justify-center px-4">
      {/* Background Glow */}
      <motion.div
        className="absolute w-full h-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(252,104,44,0.08) 0%, transparent 60%)",
        }}
      />

      {/* Vertical Timeline for Mobile, Horizontal for Desktop */}
      <div className="relative w-full max-w-md lg:max-w-2xl">
        {/* Connection Line */}
        <div className="absolute left-8 lg:left-0 top-0 lg:top-1/2 w-1 lg:w-full h-full lg:h-1 bg-white/10 lg:-translate-y-1/2">
          <motion.div
            className="absolute top-0 left-0 w-full lg:w-0 h-0 lg:h-full bg-gradient-to-b lg:bg-gradient-to-r from-[#FC682C] via-[#FFB347] via-[#06b6d4] to-[#22c55e]"
            initial={{ height: "0%", width: "100%" }}
            whileInView={{ height: "100%", width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: "easeOut" }}
            style={{ originX: 0, originY: 0 }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex flex-col lg:flex-row lg:justify-between gap-6 lg:gap-0">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              className="flex lg:flex-col items-center gap-4 lg:gap-3"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
            >
              {/* Step Circle */}
              <motion.div
                className="relative z-10 flex-shrink-0"
                whileHover={{ scale: 1.1 }}
              >
                {/* Glow */}
                <motion.div
                  className="absolute inset-0 rounded-full blur-lg"
                  style={{ background: step.color, opacity: 0.4 }}
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                />
                {/* Circle */}
                <div
                  className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${step.color}, ${step.color}dd)`,
                    boxShadow: `0 4px 20px ${step.color}50`,
                  }}
                >
                  <svg
                    className="w-7 h-7 sm:w-8 sm:h-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={step.icon}
                    />
                  </svg>
                </div>
                {/* Number Badge */}
                <div
                  className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: step.color }}
                >
                  {i + 1}
                </div>
              </motion.div>

              {/* Label */}
              <div className="lg:text-center">
                <span
                  className="text-sm sm:text-base font-semibold"
                  style={{ color: step.color }}
                >
                  {step.label}
                </span>
              </div>

              {/* Arrow (hidden on last item) */}
              {i < steps.length - 1 && (
                <motion.div
                  className="hidden lg:block absolute top-1/2 -translate-y-1/2"
                  style={{ left: `${(i + 1) * 25 - 3}%` }}
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <svg
                    className="w-5 h-5 text-white/30"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Animated Particles along the line */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-white hidden lg:block"
            style={{
              top: "50%",
              left: "0%",
              boxShadow: "0 0 10px rgba(255,255,255,0.8)",
            }}
            animate={{
              left: ["0%", "100%"],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 1,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function AblaufSection() {
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
              So arbeiten wir
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-3 mb-4 text-white">
              Ein Ablauf von Anfang bis Abschluss –{" "}
              <span className="text-[#FC682C]">ohne Reibung</span>
            </h2>
            <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto">
              Damit es schnell, sauber und verlässlich läuft, arbeiten wir in
              einem festen System. Sie sehen jederzeit, wo wir stehen – und was
              als Nächstes passiert.
            </p>
          </motion.div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Visualization */}
            <motion.div
              className="order-2 lg:order-1"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <ProcessVisualization />
            </motion.div>

            {/* Steps */}
            <div className="order-1 lg:order-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
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
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    ANBINDUNGEN SECTION
// ═══════════════════════════════════════════════════════════════

function AnbindungenSection() {
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
              Anbindungen & Aktivierungen
            </h2>
            <p className="text-sm sm:text-base text-white/80 mb-5">
              Manche Projekte brauchen zusätzliche Aktivierungen, damit alles
              100% sauber läuft (z. B. Plattform-Freigaben, zusätzliche Kanäle,
              erweiterte Setups). Diese Punkte sind je nach Umfang
              servicespezifisch und werden auf Anfrage kalkuliert.
            </p>

            <ul className="space-y-2.5 mb-5">
              {[
                "Verbindungen zu Social-Media-Kanälen / weiteren Plattformen",
                "zusätzliche Kanal-/Account-Setups und Freigaben",
                "erweiterte Einbindungen, die über das Standard-Setup hinausgehen",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-sm text-white/70"
                >
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 bg-[#FC682C]" />
                  {item}
                </li>
              ))}
            </ul>

            <p className="text-xs text-white/50">
              Sie erhalten vorab eine klare Einschätzung. Keine versteckten
              Posten.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    EIGENTUM SECTION
// ═══════════════════════════════════════════════════════════════

// Code Ownership Visualization
function OwnershipVisualization() {
  return (
    <div className="relative w-full h-[280px] sm:h-[320px] flex items-center justify-center">
      {/* Background Glow */}
      <motion.div
        className="absolute w-[250px] h-[250px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(252,104,44,0.2) 0%, rgba(34,197,94,0.1) 50%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Transfer Animation */}
      <div className="relative flex items-center gap-6 sm:gap-10">
        {/* Source (Us) */}
        <motion.div
          className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(252,104,44,0.8), rgba(234,88,12,0.6))",
            boxShadow: "0 0 30px rgba(252,104,44,0.4)",
          }}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <svg
            className="w-10 h-10 sm:w-12 sm:h-12 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
          </svg>
          <span className="absolute -bottom-6 text-xs text-[#FC682C] font-semibold">
            Wir
          </span>
        </motion.div>

        {/* Transfer Arrow with Animated Dots */}
        <div className="relative w-16 sm:w-24">
          <svg className="w-full h-8" viewBox="0 0 100 32">
            <motion.path
              d="M0 16 L80 16 M70 8 L82 16 L70 24"
              stroke="#22c55e"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
            />
          </svg>

          {/* Animated transfer particles */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-green-400"
              style={{ boxShadow: "0 0 10px #22c55e" }}
              animate={{ x: [0, 80, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
            />
          ))}

          {/* Code Icon floating */}
          <motion.div
            className="absolute -top-6 left-1/2 -translate-x-1/2"
            animate={{ y: [0, -3, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <svg
              className="w-6 h-6 text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </motion.div>
        </div>

        {/* Destination (Client) */}
        <motion.div
          className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(34,197,94,0.8), rgba(22,163,74,0.6))",
            boxShadow: "0 0 30px rgba(34,197,94,0.4)",
          }}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
        >
          <svg
            className="w-10 h-10 sm:w-12 sm:h-12 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="absolute -bottom-6 text-xs text-green-400 font-semibold">
            Sie
          </span>
        </motion.div>
      </div>

      {/* Floating Benefits */}
      {[
        { label: "100% Code", x: -100, y: -80, delay: 0 },
        { label: "Kontrolle", x: 100, y: -70, delay: 0.3 },
        { label: "Flexibel", x: -90, y: 80, delay: 0.6 },
        { label: "Unabhängig", x: 95, y: 75, delay: 0.9 },
      ].map((item, i) => (
        <motion.div
          key={i}
          className="absolute px-2 py-1 rounded-lg bg-green-500/20 border border-green-500/40 text-[10px] text-green-400 font-semibold"
          style={{
            left: `calc(50% + ${item.x}px)`,
            top: `calc(50% + ${item.y}px)`,
            transform: "translate(-50%, -50%)",
          }}
          animate={{ y: [0, -5, 0], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, delay: item.delay }}
        >
          {item.label}
        </motion.div>
      ))}

      {/* Key Icon */}
      <motion.div
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#FC682C]/20 flex items-center justify-center"
        animate={{ rotate: [0, 10, 0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <svg
          className="w-5 h-5 text-[#FC682C]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
          />
        </svg>
      </motion.div>
    </div>
  );
}

function EigentumSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Visualization */}
            <motion.div
              className="order-2 lg:order-1"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <OwnershipVisualization />
            </motion.div>

            {/* Content */}
            <motion.div
              className="order-1 lg:order-2 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#FC682C]/10 to-orange-500/5 border border-[#FC682C]/30"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                Eigentum statt Abhängigkeit
              </h2>
              <p className="text-sm sm:text-base text-white/80 mb-5">
                Auf Wunsch übergeben wir das Projekt als Code
                (Repository/Projektdateien). Damit besitzen Sie Struktur und
                Umsetzung – und können jederzeit flexibel erweitern lassen.
              </p>

              <ul className="space-y-2.5 mb-5">
                {[
                  "maximale Kontrolle & Nutzungsrechte (nach Vereinbarung)",
                  "schneller erweiterbar (Module, Bereiche, Funktionen)",
                  "unabhängig von einzelnen Anbietern",
                  "sauber übergabefähig nach Projektabschluss",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-sm text-white/80"
                  >
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 bg-[#FC682C]" />
                    {item}
                  </li>
                ))}
              </ul>

              <p className="text-xs text-white/50">
                Übergabeumfang, Rechte und Inhalte werden im Angebot eindeutig
                definiert.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    VERTRAULICHKEIT SECTION
// ═══════════════════════════════════════════════════════════════

function VertraulichkeitSection() {
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
              Vertraulichkeit ist Standard
            </h2>
            <p className="text-sm sm:text-base text-white/80 mb-5">
              Auf Wunsch schließen wir vor Projektstart eine
              Vertraulichkeitsvereinbarung (NDA). Konzepte, Abläufe, Unterlagen
              und Code werden vertraulich behandelt.
            </p>

            <ul className="space-y-2.5">
              {[
                { icon: "🤐", text: "keine Weitergabe an Dritte" },
                { icon: "🔒", text: "Schutz von Konzept & Systemlogik" },
                { icon: "📝", text: "schriftlich geregelt im Angebot/Vertrag" },
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2.5 text-sm text-white/80"
                >
                  <span>{item.icon}</span>
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

// ═══════════════════════════════════════════════════════════════
//                    FINAL CTA SECTION
// ═══════════════════════════════════════════════════════════════

function FinalCTASection() {
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
            Kostenlos starten. Klar entscheiden.{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Dann handeln.
            </span>
          </motion.h2>

          <motion.p
            className="text-sm sm:text-base text-white/80 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Starten Sie mit dem kostenlosen Webseitencheck oder buchen Sie
            direkt einen Termin. Danach wissen Sie in kurzer Zeit, ob Ihre
            Website gerade Anfragen verliert – und welcher nächste Schritt
            wirklich Sinn macht.
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
              Kostenloser Webseitencheck
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
              Termin buchen
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    MAIN PAGE
// ═══════════════════════════════════════════════════════════════

export default function LeistungenPage() {
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
