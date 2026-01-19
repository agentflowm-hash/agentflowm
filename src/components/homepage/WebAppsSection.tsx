"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const products = [
  {
    title: "Web-App",
    price: "26.990",
    desc: "Komplexe Anwendungen im Browser",
    features: ["Login & Dashboard", "Workflow-Automation", "API-Integrationen"],
    color: "#3b82f6",
  },
  {
    title: "Mobile App",
    price: "51.490",
    desc: "Native Apps für iOS & Android",
    features: ["Native Performance", "Push-Notifications", "Offline-Modus"],
    color: "#a855f7",
    popular: true,
  },
  {
    title: "Enterprise",
    price: "Anfrage",
    desc: "Maßgeschneiderte Lösungen",
    features: ["Individuelle Architektur", "Skalierbar", "SLA-Support"],
    color: "#f59e0b",
  },
];

export function WebAppsSection() {
  return (
    <section className="py-10 sm:py-12 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-sm text-purple-400 font-medium uppercase tracking-wider">
            Erweitert
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold mt-3 mb-2">
            Web-Apps & <span className="text-purple-400">Mobile Apps</span>
          </h2>
          <p className="text-base text-white/80 mt-2">
            Wenn es mehr als eine Website sein soll
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-4xl mx-auto">
          {products.map((product, index) => (
            <motion.div
              key={product.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-5 rounded-xl border ${
                product.popular
                  ? "bg-gradient-to-br from-purple-500/10 to-pink-500/5 border-purple-500/30"
                  : "bg-white/[0.02] border-white/[0.06]"
              }`}
            >
              {product.popular && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-purple-500 text-white text-[10px] font-semibold">
                  Beliebt
                </div>
              )}

              {/* Title & Price */}
              <h3
                className="text-base font-bold mb-1"
                style={{ color: product.color }}
              >
                {product.title}
              </h3>
              <div className="mb-2">
                <span className="text-2xl font-bold text-white">
                  {product.price}
                </span>
                {product.price !== "Anfrage" && (
                  <span className="text-sm text-white/60 ml-1">€</span>
                )}
              </div>
              <p className="text-sm text-white/80 mb-3">{product.desc}</p>

              {/* Features */}
              <ul className="space-y-1.5 mb-4">
                {product.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-xs text-white/80"
                  >
                    <div
                      className="w-1 h-1 rounded-full flex-shrink-0"
                      style={{ backgroundColor: product.color }}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href="/kontakt"
                className={`block w-full py-2 px-3 rounded-lg text-center text-xs font-semibold transition-all ${
                  product.popular
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90"
                    : "border border-white/20 text-white hover:bg-white/5"
                }`}
              >
                Anfragen
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="text-center text-xs text-white/70 mt-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Alle Preise zzgl. MwSt.
        </motion.p>
      </div>
    </section>
  );
}
