"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import Link from "next/link";

// Verbesserte 3D Kugel Visualisierung
function HeroVisualization() {
  return (
    <div className="relative w-full h-[320px] sm:h-[420px] lg:h-[550px] flex items-center justify-center">
      {/* Äußerer Glow-Effekt */}
      <motion.div
        className="absolute w-72 h-72 sm:w-96 sm:h-96 lg:w-[480px] lg:h-[480px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(252,104,44,0.15) 0%, rgba(255,179,71,0.08) 40%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.8, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Äußerer rotierender Ring mit Punkten */}
      <motion.div
        className="absolute w-64 h-64 sm:w-80 sm:h-80 lg:w-[420px] lg:h-[420px]"
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 rounded-full border border-[#FC682C]/30" />
        {/* Orbiting dots */}
        {[0, 90, 180, 270].map((angle, i) => (
          <motion.div
            key={i}
            className="absolute w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full"
            style={{
              background: i % 2 === 0 ? "#FC682C" : "#FFB347",
              top: "50%",
              left: "50%",
              transform: `rotate(${angle}deg) translateX(${i % 2 === 0 ? "112px" : "144px"}) translateY(-50%)`,
              boxShadow: `0 0 15px ${i % 2 === 0 ? "rgba(252,104,44,0.6)" : "rgba(255,179,71,0.6)"}`,
            }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
          />
        ))}
      </motion.div>

      {/* Mittlerer Ring - Gegenrichtung */}
      <motion.div
        className="absolute w-48 h-48 sm:w-60 sm:h-60 lg:w-80 lg:h-80"
        animate={{ rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        <div
          className="absolute inset-0 rounded-full border border-[#FFB347]/25"
          style={{ borderStyle: "dashed" }}
        />
        {[45, 135, 225, 315].map((angle, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white/60"
            style={{
              top: "50%",
              left: "50%",
              transform: `rotate(${angle}deg) translateX(${80 + (i % 2) * 26}px) translateY(-50%)`,
            }}
          />
        ))}
      </motion.div>

      {/* Innerer pulsierender Ring */}
      <motion.div
        className="absolute w-32 h-32 sm:w-44 sm:h-44 lg:w-56 lg:h-56 rounded-full"
        style={{
          border: "2px solid rgba(252,104,44,0.4)",
          boxShadow:
            "0 0 30px rgba(252,104,44,0.2), inset 0 0 30px rgba(252,104,44,0.1)",
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Hauptkugel - 3D Sphere */}
      <motion.div
        className="relative w-28 h-28 sm:w-40 sm:h-40 lg:w-52 lg:h-52"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Kugelkörper */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `
              radial-gradient(circle at 35% 25%, rgba(255,255,255,0.3), transparent 30%),
              radial-gradient(circle at 30% 30%, #FF7A45, #FC682C 35%, #e55a1f 55%, #c44a15 75%, #8B2500 100%)
            `,
            boxShadow: `
              0 0 60px rgba(252, 104, 44, 0.5),
              0 0 120px rgba(252, 104, 44, 0.3),
              0 20px 40px rgba(0,0,0,0.4),
              inset -10px -10px 30px rgba(0,0,0,0.4),
              inset 10px 10px 30px rgba(255,255,255,0.15)
            `,
          }}
        />

        {/* Glanzlicht oben */}
        <div
          className="absolute top-3 left-4 sm:top-4 sm:left-6 lg:top-6 lg:left-8 w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.5), rgba(255,255,255,0.1) 50%, transparent 70%)",
            filter: "blur(2px)",
          }}
        />

        {/* Kleiner Highlight-Punkt */}
        <div className="absolute top-5 left-6 sm:top-7 sm:left-9 lg:top-10 lg:left-12 w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 rounded-full bg-white/80" />

        {/* Innere Struktur */}
        <div
          className="absolute inset-4 sm:inset-5 lg:inset-7 rounded-full"
          style={{
            border: "1px solid rgba(255,255,255,0.15)",
            background:
              "radial-gradient(circle at 60% 60%, transparent 40%, rgba(0,0,0,0.1) 100%)",
          }}
        />

        {/* Energy Pulse */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            border: "2px solid rgba(252,104,44,0.5)",
          }}
          animate={{ scale: [1, 1.4, 1.4], opacity: [0.8, 0, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
        />
      </motion.div>

      {/* Floating Particles */}
      {[
        { x: -100, y: -80, delay: 0, size: 3 },
        { x: 110, y: -60, delay: 0.5, size: 2.5 },
        { x: -85, y: 90, delay: 1, size: 2 },
        { x: 95, y: 75, delay: 1.5, size: 3 },
        { x: -50, y: -100, delay: 0.8, size: 2 },
        { x: 60, y: 100, delay: 1.2, size: 2.5 },
      ].map((point, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full hidden sm:block"
          style={{
            width: `${point.size * 4}px`,
            height: `${point.size * 4}px`,
            left: `calc(50% + ${point.x}px)`,
            top: `calc(50% + ${point.y}px)`,
            background: `radial-gradient(circle, ${i % 2 === 0 ? "#FC682C" : "#FFB347"}, transparent)`,
            boxShadow: `0 0 10px ${i % 2 === 0 ? "rgba(252,104,44,0.5)" : "rgba(255,179,71,0.5)"}`,
          }}
          animate={{
            opacity: [0.3, 0.9, 0.3],
            scale: [1, 1.5, 1],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: point.delay,
          }}
        />
      ))}

      {/* Connection Lines - nur Desktop */}
      <svg
        className="absolute inset-0 w-full h-full hidden lg:block"
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FC682C" stopOpacity="0" />
            <stop offset="50%" stopColor="#FC682C" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FC682C" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[
          { x1: "35%", y1: "30%", x2: "50%", y2: "50%" },
          { x1: "65%", y1: "35%", x2: "50%", y2: "50%" },
          { x1: "30%", y1: "65%", x2: "50%", y2: "50%" },
          { x1: "70%", y1: "70%", x2: "50%", y2: "50%" },
        ].map((line, i) => (
          <motion.line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="url(#lineGrad)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 0.5, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
          />
        ))}
      </svg>
    </div>
  );
}

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: prefersReducedMotion ? 0 : delay },
    }),
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-[#030308]"
    >
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
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Main content */}
      <motion.div
        className="relative z-10 container mx-auto px-4 sm:px-6"
        style={{ opacity }}
      >
        <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen py-16 sm:py-20 gap-8 lg:gap-12">
          {/* Text Content - LINKS */}
          <motion.div
            className="flex-1 max-w-2xl text-center lg:text-left order-2 lg:order-1"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FC682C]/10 border border-[#FC682C]/20 mb-6"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={0}
            >
              <span className="text-xs text-[#FC682C] font-medium">
                Systemlücken schließen • Abläufe stabilisieren • Ergebnisse
                planbar machen
              </span>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold leading-[1.1] mb-5"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={0.1}
            >
              <span className="text-white">
                Ihr Business verliert nicht an Leistung.
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FC682C] via-[#FFB347] to-[#FC682C]">
                Sondern an System.
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              className="text-sm sm:text-base text-white/80 mb-5 max-w-lg mx-auto lg:mx-0"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={0.2}
            >
              Überall entstehen Lücken: Anfragen versanden, Aufgaben bleiben
              liegen, Übergaben stocken. Das kostet Zeit, Nerven und Umsatz.
            </motion.p>

            {/* Problem Chips */}
            <motion.div
              className="flex flex-wrap justify-center lg:justify-start gap-2 mb-5"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={0.25}
            >
              {[
                "Verlorene Leads",
                "Manuelle Handarbeit",
                "Chaos bei Übergaben",
                "Keine klare Führung",
              ].map((chip) => (
                <span
                  key={chip}
                  className="px-2.5 py-1 text-xs rounded-full bg-red-500/10 text-red-400 border border-red-500/20"
                >
                  {chip}
                </span>
              ))}
            </motion.div>

            {/* Solution Bridge */}
            <motion.p
              className="text-xs sm:text-sm text-white/70 mb-6 max-w-md mx-auto lg:mx-0"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={0.3}
            >
              Wir schließen diese Lücken mit klarer Struktur: Website/App als
              Zentrum + Workflows, die echte Arbeit übernehmen.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-5"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={0.35}
            >
              <Link
                href="/website-check"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#FC682C] to-[#e55a1f] text-white text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-[#FC682C]/25"
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
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/20 text-white text-sm font-semibold hover:bg-white/5 transition-all"
              >
                Termin buchen
              </Link>
            </motion.div>

            {/* Mini Trustline */}
            <motion.div
              className="flex flex-wrap justify-center lg:justify-start gap-x-3 gap-y-1.5 text-xs text-white/70"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={0.4}
            >
              {[
                "Festpreise",
                "klare Schritte",
                "schnelle Umsetzung",
                "NDA optional",
              ].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4 text-green-500"
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
            className="flex-1 max-w-xl lg:max-w-2xl order-1 lg:order-2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <HeroVisualization />
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <span className="text-[9px] text-white/50 uppercase tracking-[0.2em]">
          Scroll
        </span>
        <motion.div
          className="w-5 h-7 border border-white/20 rounded-full flex justify-center pt-1.5"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-1.5 bg-[#FC682C] rounded-full"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
