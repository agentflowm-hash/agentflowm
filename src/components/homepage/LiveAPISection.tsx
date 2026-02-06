"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// ═══════════════════════════════════════════════════════════════
//           🦁 LIVE API SECTION FOR HOMEPAGE
//           Shows real-time data from our APIs
// ═══════════════════════════════════════════════════════════════

export default function LiveAPISection() {
  const [bitcoin, setBitcoin] = useState<any>(null);
  const [fearGreed, setFearGreed] = useState<any>(null);
  const [quote, setQuote] = useState<any>(null);
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    // Load all data
    Promise.all([
      fetch('/api/insane?tool=bitcoin').then(r => r.json()),
      fetch('/api/insane?tool=fear-greed').then(r => r.json()),
      fetch('/api/powertools?tool=german-quote').then(r => r.json()),
      fetch('/api/tools?tool=weather&city=Berlin').then(r => r.json()),
    ]).then(([btc, fg, q, w]) => {
      setBitcoin(btc);
      setFearGreed(fg);
      setQuote(q);
      setWeather(w);
    });
  }, []);

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/5 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[150px]" />

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-white">Live Daten</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            70+ APIs.{" "}
            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Echtzeit.
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Von Crypto-Preisen bis Wetterdaten, von QR-Codes bis Password-Generator – 
            alles was du brauchst, in einem System.
          </p>
        </div>

        {/* Live Data Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {/* Bitcoin */}
          <div className="group bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:border-yellow-500/50 transition-all hover:scale-105">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">₿</span>
              <span className="text-sm font-bold text-white">Bitcoin</span>
            </div>
            {bitcoin?.bitcoin ? (
              <>
                <div className="text-2xl font-bold text-white">
                  €{bitcoin.bitcoin.eur?.toLocaleString('de-DE')}
                </div>
                <div className={`text-sm ${bitcoin.bitcoin.eur_24h_change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {bitcoin.bitcoin.eur_24h_change >= 0 ? '↑' : '↓'} {Math.abs(bitcoin.bitcoin.eur_24h_change || 0).toFixed(2)}%
                </div>
              </>
            ) : (
              <div className="h-12 bg-white/5 rounded animate-pulse" />
            )}
          </div>

          {/* Ethereum */}
          <div className="group bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:border-blue-500/50 transition-all hover:scale-105">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">Ξ</span>
              <span className="text-sm font-bold text-white">Ethereum</span>
            </div>
            {bitcoin?.ethereum ? (
              <>
                <div className="text-2xl font-bold text-white">
                  €{bitcoin.ethereum.eur?.toLocaleString('de-DE')}
                </div>
                <div className={`text-sm ${bitcoin.ethereum.eur_24h_change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {bitcoin.ethereum.eur_24h_change >= 0 ? '↑' : '↓'} {Math.abs(bitcoin.ethereum.eur_24h_change || 0).toFixed(2)}%
                </div>
              </>
            ) : (
              <div className="h-12 bg-white/5 rounded animate-pulse" />
            )}
          </div>

          {/* Fear & Greed */}
          <div className="group bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:border-green-500/50 transition-all hover:scale-105">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{fearGreed?.emoji || '📊'}</span>
              <span className="text-sm font-bold text-white">Market Mood</span>
            </div>
            {fearGreed ? (
              <>
                <div className="text-2xl font-bold text-white">{fearGreed.value}/100</div>
                <div className="text-sm text-gray-400">{fearGreed.label}</div>
              </>
            ) : (
              <div className="h-12 bg-white/5 rounded animate-pulse" />
            )}
          </div>

          {/* Weather */}
          <div className="group bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:border-cyan-500/50 transition-all hover:scale-105">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🌤️</span>
              <span className="text-sm font-bold text-white">Berlin</span>
            </div>
            {weather ? (
              <>
                <div className="text-2xl font-bold text-white">{weather.temperature}°C</div>
                <div className="text-sm text-gray-400">{weather.condition}</div>
              </>
            ) : (
              <div className="h-12 bg-white/5 rounded animate-pulse" />
            )}
          </div>
        </div>

        {/* Quote */}
        {quote && (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-12 max-w-3xl mx-auto text-center">
            <div className="text-4xl mb-4">💡</div>
            <blockquote className="text-lg text-gray-300 italic mb-2">"{quote.quote}"</blockquote>
            <cite className="text-sm text-gray-500">— {quote.author}</cite>
          </div>
        )}

        {/* API Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-12">
          {[
            { icon: '💰', label: 'Crypto & Finance', count: 5 },
            { icon: '🎲', label: 'Fun & Viral', count: 8 },
            { icon: '🔧', label: 'Dev Tools', count: 12 },
            { icon: '🌍', label: 'Geo & Location', count: 6 },
            { icon: '🎨', label: 'Media & Images', count: 8 },
            { icon: '🔐', label: 'Validation', count: 7 },
            { icon: '📅', label: 'Date & Time', count: 5 },
            { icon: '📱', label: 'QR & Barcodes', count: 3 },
            { icon: '🌐', label: 'Web & SEO', count: 6 },
            { icon: '📊', label: 'Analytics', count: 4 },
            { icon: '📝', label: 'Text Tools', count: 5 },
            { icon: '🎮', label: 'Random & Fun', count: 6 },
          ].map((cat, i) => (
            <div 
              key={i}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center hover:bg-white/10 transition-colors"
            >
              <div className="text-2xl mb-2">{cat.icon}</div>
              <div className="text-xs text-gray-400">{cat.label}</div>
              <div className="text-lg font-bold text-orange-400">{cat.count}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link 
            href="/playground"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-orange-500/25 transition-all hover:scale-105"
          >
            <span>🤯</span>
            <span>API Playground öffnen</span>
            <span>→</span>
          </Link>
          <p className="text-gray-500 text-sm mt-4">
            100% kostenlos • Keine Rate Limits • Sofort loslegen
          </p>
        </div>
      </div>
    </section>
  );
}
