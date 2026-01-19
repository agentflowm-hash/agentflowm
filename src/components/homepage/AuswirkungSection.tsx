"use client";

import { motion } from "framer-motion";

const impacts = [
  { text: "weniger Anfragen, weil Besucher nicht geführt werden", value: -34 },
  {
    text: 'mehr Stress, weil alles "manuell" geregelt werden muss',
    value: -28,
  },
  { text: "längere Reaktionszeiten, weil Übergaben stocken", value: -45 },
  { text: "Fehler, weil Standards fehlen", value: -23 },
  { text: "Stillstand, weil niemand den Überblick hat", value: -51 },
];

// Responsive Dashboard Visualisierung
function ImpactVisualization() {
  return (
    <div className="relative w-full max-w-sm mx-auto lg:mx-0">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-orange-500/5 to-transparent rounded-2xl blur-2xl" />

      {/* Dashboard Container */}
      <motion.div
        className="relative p-4 sm:p-5 rounded-2xl overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, rgba(239,68,68,0.1), rgba(0,0,0,0.4))",
          border: "1px solid rgba(239,68,68,0.2)",
        }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-red-500"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-xs font-mono text-red-400">
              SYSTEM STATUS
            </span>
          </div>
          <span className="text-[10px] font-mono text-white/50">CRITICAL</span>
        </div>

        {/* Chart */}
        <div className="relative h-24 sm:h-28 mb-4">
          <svg
            className="w-full h-full"
            viewBox="0 0 300 100"
            preserveAspectRatio="none"
          >
            {[0, 25, 50, 75, 100].map((y) => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="300"
                y2={y}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
              />
            ))}
            <defs>
              <linearGradient
                id="chartGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="lineGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="30%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
            <motion.path
              d="M 0 20 Q 50 25 100 35 T 200 60 T 300 85 L 300 100 L 0 100 Z"
              fill="url(#chartGradient)"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            />
            <motion.path
              d="M 0 20 Q 50 25 100 35 T 200 60 T 300 85"
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2 }}
            />
            {[
              { x: 0, y: 20 },
              { x: 75, y: 30 },
              { x: 150, y: 45 },
              { x: 225, y: 65 },
              { x: 300, y: 85 },
            ].map((point, i) => (
              <motion.circle
                key={i}
                cx={point.x}
                cy={point.y}
                r="4"
                fill={i < 2 ? "#22c55e" : i < 3 ? "#eab308" : "#ef4444"}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.2 }}
              />
            ))}
          </svg>
        </div>

        {/* Metric Bars */}
        <div className="space-y-2.5 mb-4">
          {[
            { label: "Conversion", value: 34, color: "#ef4444" },
            { label: "Effizienz", value: 28, color: "#f59e0b" },
            { label: "Response", value: 45, color: "#ef4444" },
          ].map((metric, i) => (
            <div key={i}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white/70">{metric.label}</span>
                <span className="text-red-400 font-mono">-{metric.value}%</span>
              </div>
              <div className="h-1.5 sm:h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: metric.color }}
                  initial={{ width: "100%" }}
                  whileInView={{ width: `${100 - metric.value}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: i * 0.2 }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="flex justify-between pt-3 border-t border-white/10">
          {[
            { label: "Leads Lost", value: "47%" },
            { label: "Time Waste", value: "3.2h" },
            { label: "Errors", value: "+156%" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              <div className="text-sm sm:text-base font-bold text-red-400">
                {stat.value}
              </div>
              <div className="text-[9px] sm:text-[10px] text-white/60">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export function AuswirkungSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Desktop: Text LINKS, Visualisierung RECHTS */}
          {/* Mobile: Text oben, Visualisierung unten */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-12 lg:mb-16">
            {/* Text Content - Links auf Desktop, oben auf Mobile */}
            <motion.div
              className="text-center lg:text-left"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-sm text-red-400 font-medium uppercase tracking-wider">
                Auswirkung
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mt-3 mb-4 text-white">
                Was diese Lücken{" "}
                <span className="text-red-500">wirklich kosten</span>
              </h2>
              <p className="text-base sm:text-lg text-white/80 max-w-xl mx-auto lg:mx-0">
                Jede Lücke im System bedeutet verlorene Zeit, verpasste Chancen
                und unnötigen Stress.
              </p>
            </motion.div>

            {/* Visualisierung - Rechts auf Desktop, unten auf Mobile */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <ImpactVisualization />
            </motion.div>
          </div>

          {/* Impact List */}
          <div className="max-w-3xl mx-auto space-y-3 mb-10">
            {impacts.map((impact, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-4 p-4 sm:p-5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-red-500/20 transition-all"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-red-500/10 border border-red-500/20 flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </div>
                <p className="text-sm sm:text-base text-white/80">
                  {impact.text}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Key Statement - Zentriert */}
          <motion.div
            className="max-w-2xl mx-auto text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-red-500/15 to-orange-500/5 border border-red-500/30">
              <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-white">
                Ein gutes Angebot verkauft sich nicht,{" "}
                <span className="text-[#FC682C]">
                  wenn das System dahinter bricht.
                </span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
