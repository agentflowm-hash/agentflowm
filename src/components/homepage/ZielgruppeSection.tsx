"use client";

import { motion } from "framer-motion";

const audiences = [
  {
    title: "Selbstständige",
    desc: "professioneller Start ohne Chaos",
    color: "#FC682C",
  },
  {
    title: "KMU",
    desc: "klare Abläufe, weniger Reibung",
    color: "#FFB347",
  },
  {
    title: "Teams",
    desc: "schneller entscheiden, sauber übergeben",
    color: "#06b6d4",
  },
];

export function ZielgruppeSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-10 sm:mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs sm:text-sm text-[#FC682C] font-medium uppercase tracking-wider">
              Zielgruppe
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-3 mb-4">
              Für wen das <span className="text-[#FC682C]">sofort wirkt</span>
            </h2>
            <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto">
              Für alle, die wachsen wollen – und merken, dass es nicht am
              Einsatz fehlt, sondern an Struktur.
            </p>
          </motion.div>

          {/* Audience Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {audiences.map((audience, i) => (
              <motion.div
                key={audience.title}
                className="p-6 sm:p-8 rounded-xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] text-center hover:border-white/[0.15] transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                {/* Icon Circle */}
                <motion.div
                  className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full flex items-center justify-center mb-4"
                  style={{
                    background: `linear-gradient(135deg, ${audience.color}20, ${audience.color}05)`,
                    border: `2px solid ${audience.color}40`,
                    boxShadow: `0 0 30px ${audience.color}15`,
                  }}
                >
                  <div
                    className="w-4 h-4 sm:w-5 sm:h-5 rounded-full"
                    style={{
                      backgroundColor: audience.color,
                      boxShadow: `0 0 15px ${audience.color}50`,
                    }}
                  />
                </motion.div>
                <h3
                  className="text-lg sm:text-xl font-semibold mb-2"
                  style={{ color: audience.color }}
                >
                  {audience.title}
                </h3>
                <p className="text-sm sm:text-base text-white/70">
                  {audience.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
