"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";

export default function CheckoutCancelledPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#080808] to-[#0f0f15] flex items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="w-20 h-20 mx-auto mb-8 bg-white/5 rounded-full flex items-center justify-center border border-white/10"
        >
          <svg className="w-10 h-10 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.div>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Checkout abgebrochen
        </h1>

        <p className="text-white/60 text-lg mb-8">
          Kein Problem! Dein Warenkorb wurde nicht belastet. 
          Falls du Fragen hast, sind wir für dich da.
        </p>

        {/* Help Card */}
        <div className="bg-white/[0.03] backdrop-blur-sm rounded-2xl border border-white/10 p-6 mb-8 text-left">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">💬</span>
            Können wir helfen?
          </h3>
          
          <div className="space-y-3 text-white/70">
            <p>Vielleicht hast du noch Fragen:</p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-[#FC682C]">•</span>
                Welches Paket passt am besten?
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#FC682C]">•</span>
                Gibt es Ratenzahlung?
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#FC682C]">•</span>
                Was ist im Paket enthalten?
              </li>
            </ul>
          </div>
        </div>

        {/* CTAs */}
        <div className="space-y-3">
          <Link
            href="/pakete"
            className="block w-full py-4 bg-gradient-to-r from-[#FC682C] to-[#ff8f5c] text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-[#FC682C]/20"
          >
            Pakete nochmal ansehen
          </Link>
          
          <a
            href="https://calendly.com/agentflowm/15min"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-4 bg-white/5 border border-white/10 text-white/80 font-medium rounded-xl hover:bg-white/10 transition-colors"
          >
            Kostenloses Beratungsgespräch →
          </a>
          
          <Link
            href="/"
            className="block w-full py-3 text-white/50 hover:text-white/70 transition-colors"
          >
            Zur Startseite
          </Link>
        </div>

        {/* Contact */}
        <p className="text-white/40 text-sm mt-8">
          Schreib uns an{" "}
          <a href="mailto:info@agentflowm.de" className="text-[#FC682C] hover:underline">
            info@agentflowm.de
          </a>
        </p>
      </motion.div>
    </div>
  );
}
