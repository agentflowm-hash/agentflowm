"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// ═══════════════════════════════════════════════════════════════
//           📱 MOBILE APP HOME - Optimiert für Capacitor
//           Touch-first, Native-feeling UI
// ═══════════════════════════════════════════════════════════════

export default function MobileHomePage() {
  const [crypto, setCrypto] = useState<any>(null);
  const [quote, setQuote] = useState<any>(null);
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    // Load initial data
    Promise.all([
      fetch('/api/insane?tool=bitcoin').then(r => r.json()),
      fetch('/api/powertools?tool=german-quote').then(r => r.json()),
      fetch('/api/tools?tool=weather&city=Berlin').then(r => r.json()),
    ]).then(([c, q, w]) => {
      setCrypto(c);
      setQuote(q);
      setWeather(w);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#030308] text-white pb-20 safe-area-inset">
      {/* Status Bar Spacer */}
      <div className="h-[env(safe-area-inset-top)] bg-[#030308]" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#030308]/95 backdrop-blur-xl border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center font-bold text-lg">
              A
            </div>
            <div>
              <h1 className="font-bold">AgentFlowM</h1>
              <p className="text-xs text-gray-500">70+ APIs</p>
            </div>
          </div>
          <button className="p-2 rounded-xl bg-white/10">
            <span className="text-xl">⚙️</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-4 space-y-4">
        {/* Welcome Card */}
        <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl p-5 border border-orange-500/30">
          <div className="text-3xl mb-2">👋</div>
          <h2 className="text-xl font-bold mb-1">Willkommen!</h2>
          <p className="text-sm text-gray-400">Deine Power-Tools auf einen Blick.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          {/* Bitcoin */}
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 active:scale-95 transition-transform">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">₿</span>
              <span className="text-xs text-gray-500">Bitcoin</span>
            </div>
            {crypto?.bitcoin ? (
              <>
                <div className="text-lg font-bold">
                  €{(crypto.bitcoin.eur || 0).toLocaleString('de-DE')}
                </div>
                <div className={`text-xs ${crypto.bitcoin.eur_24h_change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {crypto.bitcoin.eur_24h_change >= 0 ? '↑' : '↓'} {Math.abs(crypto.bitcoin.eur_24h_change || 0).toFixed(2)}%
                </div>
              </>
            ) : (
              <div className="h-8 bg-white/10 rounded animate-pulse" />
            )}
          </div>

          {/* Weather */}
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 active:scale-95 transition-transform">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🌤️</span>
              <span className="text-xs text-gray-500">Berlin</span>
            </div>
            {weather ? (
              <>
                <div className="text-lg font-bold">{weather.temperature}°C</div>
                <div className="text-xs text-gray-400 truncate">{weather.condition}</div>
              </>
            ) : (
              <div className="h-8 bg-white/10 rounded animate-pulse" />
            )}
          </div>
        </div>

        {/* Quote of the Day */}
        {quote && (
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">💡</span>
              <span className="text-xs text-gray-500">Tägliche Inspiration</span>
            </div>
            <p className="text-sm text-gray-300 italic">"{quote.quote}"</p>
            <p className="text-xs text-gray-500 mt-2">— {quote.author}</p>
          </div>
        )}

        {/* Quick Actions */}
        <h3 className="text-sm font-semibold text-gray-400 mt-6 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: '🎲', label: 'Würfel', href: '/playground?tool=dice' },
            { icon: '🔐', label: 'Passwort', href: '/playground?tool=password' },
            { icon: '📱', label: 'QR Code', href: '/playground?tool=qr' },
            { icon: '🎨', label: 'Farben', href: '/playground?tool=color' },
          ].map((action, i) => (
            <Link
              key={i}
              href={action.href}
              className="flex flex-col items-center gap-2 p-3 bg-white/5 rounded-2xl border border-white/10 active:scale-95 active:bg-white/10 transition-all"
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="text-xs text-gray-400">{action.label}</span>
            </Link>
          ))}
        </div>

        {/* Tools Grid */}
        <h3 className="text-sm font-semibold text-gray-400 mt-6 mb-3">Alle Tools</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '💰', label: 'Crypto', count: 5 },
            { icon: '🔧', label: 'Dev Tools', count: 12 },
            { icon: '🎲', label: 'Fun', count: 8 },
            { icon: '📊', label: 'Analytics', count: 4 },
            { icon: '🌍', label: 'Geo', count: 6 },
            { icon: '📝', label: 'Text', count: 5 },
            { icon: '🔐', label: 'Security', count: 7 },
            { icon: '🎨', label: 'Media', count: 8 },
            { icon: '📅', label: 'Zeit', count: 5 },
          ].map((cat, i) => (
            <Link
              key={i}
              href="/playground"
              className="flex flex-col items-center gap-1 p-4 bg-white/5 rounded-2xl border border-white/10 active:scale-95 active:bg-white/10 transition-all"
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-xs text-gray-400">{cat.label}</span>
              <span className="text-xs text-orange-400 font-bold">{cat.count}</span>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/playground"
          className="block mt-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-5 text-center active:scale-95 transition-transform"
        >
          <div className="text-2xl mb-2">🤯</div>
          <div className="font-bold">API Playground öffnen</div>
          <div className="text-sm text-white/70">70+ Tools ausprobieren</div>
        </Link>
      </main>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#030308]/95 backdrop-blur-xl border-t border-white/10 px-4 safe-area-inset-bottom">
        <div className="flex justify-around py-2">
          {[
            { icon: '🏠', label: 'Home', href: '/mobile', active: true },
            { icon: '🔧', label: 'Tools', href: '/playground' },
            { icon: '📊', label: 'Crypto', href: '/playground?tab=dashboard' },
            { icon: '👤', label: 'Profil', href: '/portal' },
          ].map((tab, i) => (
            <Link
              key={i}
              href={tab.href}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors ${
                tab.active ? 'text-orange-400' : 'text-gray-500'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="text-xs">{tab.label}</span>
            </Link>
          ))}
        </div>
        {/* Home Indicator Spacer */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </div>
  );
}
