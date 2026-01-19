'use client';

import Link from 'next/link';

export default function CheckoutAbgebrochenPage() {
  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {/* Info Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-yellow-500/20 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-yellow-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Zahlung abgebrochen
        </h1>

        <p className="text-white/60 mb-8">
          Kein Problem! Ihre Zahlung wurde nicht durchgeführt und es wurden keine
          Kosten verursacht. Sie können jederzeit einen neuen Versuch starten.
        </p>

        <div className="space-y-4">
          <Link
            href="/#pakete"
            className="inline-block w-full py-3 bg-[#FC682C] text-white font-medium rounded-lg hover:bg-[#e55a1f] transition-colors"
          >
            Zurück zu den Paketen
          </Link>

          <Link
            href="/termin"
            className="inline-block w-full py-3 bg-white/[0.05] text-white font-medium rounded-lg hover:bg-white/[0.1] border border-white/[0.1] transition-colors"
          >
            Lieber erst ein Gespräch?
          </Link>

          <p className="text-sm text-white/40 pt-4">
            Haben Sie Fragen? Kontaktieren Sie uns unter{' '}
            <a href="mailto:info@agentflow.de" className="text-[#FC682C] hover:underline">
              info@agentflow.de
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
