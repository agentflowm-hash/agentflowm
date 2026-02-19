"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import confetti from "canvas-confetti";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const packageName = searchParams.get("package") || "Paket";
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      // Confetti explosion! 🎉
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FC682C", "#ff8f5c", "#ffffff", "#22c55e"],
      });
      
      // Second burst
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#FC682C", "#ff8f5c"],
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#FC682C", "#ff8f5c"],
        });
      }, 250);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#080808] to-[#0f0f15] flex items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="max-w-lg w-full"
      >
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
              <div className="absolute inset-0 rounded-full border-4 border-[#FC682C] border-t-transparent animate-spin"></div>
            </div>
            <p className="text-white/60">Zahlung wird bestätigt...</p>
          </div>
        ) : (
          <div className="text-center">
            {/* Success Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-24 h-24 mx-auto mb-8"
            >
              <div className="absolute inset-0 bg-green-500/20 rounded-full animate-pulse"></div>
              <div className="absolute inset-2 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                <motion.svg
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="w-12 h-12 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <motion.path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </motion.svg>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Zahlung erfolgreich! 🎉
              </h1>

              <p className="text-white/60 text-lg mb-8">
                Danke für dein Vertrauen! Dein{" "}
                <span className="text-[#FC682C] font-semibold">{packageName}</span>{" "}
                Paket ist jetzt aktiviert.
              </p>
            </motion.div>

            {/* What's Next Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/[0.03] backdrop-blur-sm rounded-2xl border border-white/10 p-6 mb-6 text-left"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">📋</span>
                Was passiert jetzt?
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#FC682C]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#FC682C] font-bold text-sm">1</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Bestätigung per E-Mail</p>
                    <p className="text-white/50 text-sm">Du erhältst in wenigen Minuten deine Rechnung und alle Details.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#FC682C]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#FC682C] font-bold text-sm">2</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Kickoff Termin</p>
                    <p className="text-white/50 text-sm">Wir melden uns innerhalb von 24h bei dir für den Projektstart.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#FC682C]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#FC682C] font-bold text-sm">3</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Los geht's!</p>
                    <p className="text-white/50 text-sm">Dein Projekt startet und wir halten dich auf dem Laufenden.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Session ID Reference */}
            {sessionId && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-xs text-white/30 mb-6 font-mono"
              >
                Referenz: {sessionId.substring(0, 20)}...
              </motion.div>
            )}

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-3"
            >
              <Link
                href="/"
                className="block w-full py-4 bg-gradient-to-r from-[#FC682C] to-[#ff8f5c] text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-[#FC682C]/20"
              >
                Zur Startseite
              </Link>
              
              <a
                href="https://calendly.com/agentflowm/15min"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-4 bg-white/5 border border-white/10 text-white/80 font-medium rounded-xl hover:bg-white/10 transition-colors"
              >
                Direkt Kickoff-Termin buchen →
              </a>
            </motion.div>

            {/* Contact Info */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-white/40 text-sm mt-8"
            >
              Fragen? Schreib uns an{" "}
              <a href="mailto:info@agentflowm.de" className="text-[#FC682C] hover:underline">
                info@agentflowm.de
              </a>
            </motion.p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#080808] flex items-center justify-center">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
            <div className="absolute inset-0 rounded-full border-4 border-[#FC682C] border-t-transparent animate-spin"></div>
          </div>
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
