"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "1",
    title: "Klarheit",
    desc: "Ziel & Prioritäten",
    color: "#FC682C",
  },
  { number: "2", title: "Struktur", desc: "Wege & Portale", color: "#FFB347" },
  { number: "3", title: "Umsetzung", desc: "Design & Build", color: "#06b6d4" },
  { number: "4", title: "Test", desc: "Stabil & sauber", color: "#22c55e" },
  { number: "5", title: "Launch", desc: "Live & Übergabe", color: "#a855f7" },
];

export function SystemablaufSection() {
  return (
    <section className="py-10 sm:py-12 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-sm text-[#FC682C] font-medium uppercase tracking-wider">
            Ablauf
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold mt-3 mb-3">
            <span className="text-[#FC682C]">5 Schritte</span> – ohne Stillstand
          </h2>
          <p className="text-base text-white/80 max-w-lg mx-auto">
            Klare Schritte, sofort handelbar. Keine endlosen Schleifen.
          </p>
        </motion.div>

        {/* Steps - Mobile: Vertical, Desktop: Horizontal */}
        <div className="max-w-3xl mx-auto">
          {/* Desktop Version */}
          <div className="hidden sm:block relative">
            {/* Connection Line */}
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-gradient-to-r from-[#FC682C]/20 via-[#06b6d4]/20 to-[#a855f7]/20" />

            <div className="relative flex justify-between">
              {steps.map((step, i) => (
                <motion.div
                  key={step.number}
                  className="flex flex-col items-center"
                  style={{ width: "18%" }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  {/* Number Circle */}
                  <motion.div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold mb-2 relative z-10"
                    style={{
                      background: `linear-gradient(135deg, ${step.color}30, ${step.color}10)`,
                      border: `2px solid ${step.color}50`,
                      color: step.color,
                      boxShadow: `0 0 20px ${step.color}20`,
                    }}
                    whileHover={{ scale: 1.1 }}
                  >
                    {step.number}
                  </motion.div>
                  <h3 className="text-sm font-semibold text-white text-center mb-0.5">
                    {step.title}
                  </h3>
                  <p className="text-xs text-white/70 text-center">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile Version - Vertical Layout */}
          <div className="sm:hidden space-y-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                className="flex items-center gap-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                {/* Number Circle */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${step.color}30, ${step.color}10)`,
                    border: `2px solid ${step.color}50`,
                    color: step.color,
                    boxShadow: `0 0 20px ${step.color}20`,
                  }}
                >
                  {step.number}
                </div>
                {/* Text */}
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="text-xs text-white/70">{step.desc}</p>
                </div>
                {/* Connecting line */}
                {i < steps.length - 1 && (
                  <div
                    className="absolute left-[24px] h-4 w-0.5 translate-y-12"
                    style={{ backgroundColor: `${step.color}30` }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Note */}
        <motion.p
          className="text-center text-xs text-white/70 mt-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Schnelle Umsetzung ohne Leerlauf – Reaktionsfenster werden definiert.
        </motion.p>
      </div>
    </section>
  );
}
