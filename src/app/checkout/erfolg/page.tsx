"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function CheckoutErfolgContent() {
  const searchParams = useSearchParams();
  const packageName = searchParams.get("package") || "Ihr gewähltes Paket";
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-[#FC682C] border-t-transparent rounded-full animate-spin" />
            <p className="text-white/60">Anfrage wird verarbeitet...</p>
          </div>
        ) : (
          <>
            {/* Success Icon */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Vielen Dank für Ihre Anfrage!
            </h1>

            <p className="text-white/60 mb-8">
              Wir haben Ihre Anfrage für{" "}
              <span className="text-[#FC682C] font-medium">{packageName}</span>{" "}
              erhalten. Unser Team wird sich innerhalb von 24 Stunden bei Ihnen
              melden, um die nächsten Schritte zu besprechen.
            </p>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                <h3 className="text-sm font-medium text-white mb-2">
                  Was passiert jetzt?
                </h3>
                <ul className="text-sm text-white/50 text-left space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-[#FC682C]">1.</span>
                    Wir prüfen Ihre Anfrage und Projektdetails
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FC682C]">2.</span>
                    Wir kontaktieren Sie für ein kostenloses Erstgespräch
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FC682C]">3.</span>
                    Nach Auftragserteilung erhalten Sie Zugang zum Kundenportal
                  </li>
                </ul>
              </div>

              <Link
                href="/"
                className="inline-block w-full py-3 bg-[#FC682C] text-white font-medium rounded-lg hover:bg-[#e55a1f] transition-colors"
              >
                Zurück zur Startseite
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function CheckoutErfolgPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#080808] flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-[#FC682C] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CheckoutErfolgContent />
    </Suspense>
  );
}
