"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

// ═══════════════════════════════════════════════════════════════
//     🔥 LIVE API SECTION - MEGA IMPRESSIVE INTERACTIVE DEMO
// ═══════════════════════════════════════════════════════════════

export default function LiveAPISection() {
  const t = useTranslations('liveAPI');
  const [activeDemo, setActiveDemo] = useState('crypto');
  const [crypto, setCrypto] = useState<any>(null);
  const [fearGreed, setFearGreed] = useState<any>(null);
  const [quote, setQuote] = useState<any>(null);
  const [weather, setWeather] = useState<any>(null);
  const [joke, setJoke] = useState<any>(null);
  const [color, setColor] = useState<any>(null);
  const [qrText, setQrText] = useState('https://agentflowm.com');
  const [qrUrl, setQrUrl] = useState('');
  const [password, setPassword] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load all data
  useEffect(() => {
    Promise.all([
      fetch('/api/insane?tool=bitcoin').then(r => r.json()),
      fetch('/api/insane?tool=fear-greed').then(r => r.json()),
      fetch('/api/powertools?tool=german-quote').then(r => r.json()),
      fetch('/api/tools?tool=weather&city=Berlin').then(r => r.json()),
      fetch('/api/insane?tool=joke').then(r => r.json()),
      fetch('/api/insane?tool=color').then(r => r.json()),
      fetch('/api/insane?tool=password&length=16').then(r => r.json()),
    ]).then(([btc, fg, q, w, j, c, p]) => {
      setCrypto(btc);
      setFearGreed(fg);
      setQuote(q);
      setWeather(w);
      setJoke(j);
      setColor(c);
      setPassword(p);
    });
  }, []);

  // QR Code generation
  useEffect(() => {
    const timer = setTimeout(() => {
      fetch(`/api/insane?tool=qr&text=${encodeURIComponent(qrText)}&size=150`)
        .then(r => r.json())
        .then(d => setQrUrl(d.url));
    }, 300);
    return () => clearTimeout(timer);
  }, [qrText]);

  const demos = [
    { id: 'crypto', label: '💰 Crypto', color: '#F7931A' },
    { id: 'tools', label: '🔧 Tools', color: '#3B82F6' },
    { id: 'fun', label: '🎲 Fun', color: '#A855F7' },
    { id: 'weather', label: '🌤️ Wetter', color: '#22C55E' },
  ];

  const refreshDemo = async (type: string) => {
    setIsLoading(true);
    try {
      switch (type) {
        case 'quote':
          const q = await fetch('/api/powertools?tool=german-quote').then(r => r.json());
          setQuote(q);
          break;
        case 'joke':
          const j = await fetch('/api/insane?tool=joke').then(r => r.json());
          setJoke(j);
          break;
        case 'color':
          const c = await fetch('/api/insane?tool=color').then(r => r.json());
          setColor(c);
          break;
        case 'password':
          const p = await fetch('/api/insane?tool=password&length=16').then(r => r.json());
          setPassword(p);
          break;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getMarketColor = (value: number) => {
    if (value < 25) return { color: '#EF4444', label: 'Extreme Angst' };
    if (value < 45) return { color: '#F97316', label: 'Angst' };
    if (value < 55) return { color: '#EAB308', label: 'Neutral' };
    if (value < 75) return { color: '#22C55E', label: 'Gier' };
    return { color: '#10B981', label: 'Extreme Gier' };
  };

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full bg-gradient-to-br from-[#FC682C]/10 via-[#FFB347]/5 to-transparent blur-[150px] animate-pulse" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#627EEA]/8 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#00FFA3]/8 blur-[100px]" />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[#FC682C]/30"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#FC682C]/10 to-[#FFB347]/10 border border-[#FC682C]/20 backdrop-blur-xl mb-6"
            animate={{ boxShadow: ['0 0 20px rgba(252,104,44,0.2)', '0 0 40px rgba(252,104,44,0.4)', '0 0 20px rgba(252,104,44,0.2)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FC682C] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FC682C]"></span>
            </span>
            <span className="text-sm font-semibold text-[#FC682C]">{t('badge')}</span>
          </motion.div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            {t('title')}{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-[#FC682C] via-[#FFB347] to-[#FC682C] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                {t('titleHighlight')}
              </span>
            </span>
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            {t('description')}
          </p>
        </motion.div>

        {/* Demo Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex gap-2 p-1.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
            {demos.map((demo) => (
              <motion.button
                key={demo.id}
                onClick={() => setActiveDemo(demo.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeDemo === demo.id 
                    ? 'bg-gradient-to-r from-[#FC682C] to-[#FFB347] text-white shadow-lg shadow-[#FC682C]/30' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {demo.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Demo Content */}
        <AnimatePresence mode="wait">
          {/* CRYPTO DEMO */}
          {activeDemo === 'crypto' && (
            <motion.div
              key="crypto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Crypto Prices */}
              <div className="lg:col-span-2 rounded-3xl p-6 bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">📊 Live Crypto Preise</h3>
                  <span className="text-xs text-white/40">Auto-Update alle 30s</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { name: 'Bitcoin', symbol: 'BTC', data: crypto?.bitcoin, color: '#F7931A', icon: '₿' },
                    { name: 'Ethereum', symbol: 'ETH', data: crypto?.ethereum, color: '#627EEA', icon: 'Ξ' },
                    { name: 'Solana', symbol: 'SOL', data: crypto?.solana, color: '#00FFA3', icon: '◎' },
                  ].map((coin, i) => (
                    <motion.div
                      key={coin.symbol}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.03, y: -4 }}
                      className="relative rounded-2xl p-5 bg-gradient-to-br from-white/[0.05] to-transparent border border-white/[0.1] overflow-hidden group"
                    >
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" 
                        style={{ background: `radial-gradient(circle at center, ${coin.color}15, transparent)` }} />
                      <div className="relative">
                        <div className="flex items-center gap-3 mb-4">
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold"
                            style={{ 
                              background: `linear-gradient(135deg, ${coin.color}20, ${coin.color}40)`,
                              boxShadow: `0 0 20px ${coin.color}30`,
                              color: coin.color
                            }}
                          >
                            {coin.icon}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">{coin.name}</div>
                            <div className="text-xs text-white/40">{coin.symbol}/EUR</div>
                          </div>
                        </div>
                        {coin.data ? (
                          <>
                            <div className="text-3xl font-bold text-white mb-2">
                              €{coin.data.eur?.toLocaleString('de-DE', { maximumFractionDigits: 0 })}
                            </div>
                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium ${
                              coin.data.eur_24h_change >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                            }`}>
                              {coin.data.eur_24h_change >= 0 ? '↗' : '↘'} {Math.abs(coin.data.eur_24h_change || 0).toFixed(2)}%
                            </div>
                          </>
                        ) : (
                          <div className="space-y-2">
                            <div className="h-8 w-24 bg-white/10 rounded animate-pulse" />
                            <div className="h-6 w-16 bg-white/5 rounded animate-pulse" />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Fear & Greed */}
              <div className="rounded-3xl p-6 bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
                <h3 className="text-lg font-semibold text-white mb-6">😱 Fear & Greed Index</h3>
                {fearGreed ? (
                  <div className="flex flex-col items-center">
                    <div className="relative w-40 h-40 mb-4">
                      <svg className="w-full h-full -rotate-90">
                        <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                        <motion.circle 
                          cx="80" cy="80" r="70" fill="none" 
                          stroke={getMarketColor(fearGreed.value).color} 
                          strokeWidth="12" strokeLinecap="round"
                          strokeDasharray={440}
                          initial={{ strokeDashoffset: 440 }}
                          animate={{ strokeDashoffset: 440 - (fearGreed.value / 100) * 440 }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.span 
                          className="text-5xl font-bold text-white"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5, type: "spring" }}
                        >
                          {fearGreed.value}
                        </motion.span>
                        <span className="text-xs text-white/40">von 100</span>
                      </div>
                    </div>
                    <div 
                      className="px-4 py-2 rounded-xl text-sm font-semibold"
                      style={{ background: `${getMarketColor(fearGreed.value).color}20`, color: getMarketColor(fearGreed.value).color }}
                    >
                      {fearGreed.label}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <div className="w-40 h-40 rounded-full bg-white/5 animate-pulse" />
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TOOLS DEMO */}
          {activeDemo === 'tools' && (
            <motion.div
              key="tools"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* QR Generator */}
              <div className="rounded-3xl p-6 bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
                <h3 className="text-lg font-semibold text-white mb-4">📱 QR-Code Generator</h3>
                <input
                  type="text"
                  value={qrText}
                  onChange={(e) => setQrText(e.target.value)}
                  placeholder="URL oder Text eingeben..."
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#FC682C]/50 mb-4"
                />
                {qrUrl && (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex justify-center"
                  >
                    <div className="bg-white rounded-2xl p-3 shadow-lg shadow-[#FC682C]/20">
                      <img src={qrUrl} alt="QR Code" className="w-36 h-36" />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Password Generator */}
              <div className="rounded-3xl p-6 bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">🔐 Passwort Generator</h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => refreshDemo('password')}
                    className="p-2 rounded-lg bg-white/5 text-white/60 hover:text-white"
                  >
                    🔄
                  </motion.button>
                </div>
                {password && (
                  <motion.div
                    key={password.password}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="bg-black/30 rounded-xl px-4 py-4 font-mono text-lg text-emerald-400 border border-emerald-500/20 mb-3 break-all">
                      {password.password}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`h-2 flex-1 rounded-full ${
                        password.strength === 'sehr stark' ? 'bg-emerald-500' :
                        password.strength === 'stark' ? 'bg-yellow-500' : 'bg-orange-500'
                      }`} />
                      <span className="text-sm text-white/60">{password.strength}</span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Color Generator */}
              <div className="rounded-3xl p-6 bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">🎨 Farb-Generator</h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => refreshDemo('color')}
                    className="p-2 rounded-lg bg-white/5 text-white/60 hover:text-white"
                  >
                    🔄
                  </motion.button>
                </div>
                {color && (
                  <motion.div
                    key={color.hex}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-4"
                  >
                    <div 
                      className="w-20 h-20 rounded-2xl shadow-lg"
                      style={{ backgroundColor: color.hex, boxShadow: `0 10px 40px ${color.hex}50` }}
                    />
                    <div>
                      <div className="text-xl font-bold text-white mb-1">{color.hex}</div>
                      <div className="text-sm text-white/60">RGB: {color.rgb?.r}, {color.rgb?.g}, {color.rgb?.b}</div>
                      <div className="text-xs text-white/40 mt-1">{color.name}</div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Quote */}
              <div className="rounded-3xl p-6 bg-gradient-to-br from-[#FC682C]/10 to-transparent border border-[#FC682C]/20 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">💡 Inspiration</h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => refreshDemo('quote')}
                    className="p-2 rounded-lg bg-white/5 text-white/60 hover:text-white"
                  >
                    🔄
                  </motion.button>
                </div>
                {quote && (
                  <motion.div
                    key={quote.quote}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <blockquote className="text-white/80 italic text-lg leading-relaxed mb-3">
                      „{quote.quote}"
                    </blockquote>
                    <cite className="text-[#FC682C] font-medium">— {quote.author}</cite>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* FUN DEMO */}
          {activeDemo === 'fun' && (
            <motion.div
              key="fun"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="rounded-3xl p-8 bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl text-center">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">😄 Zufälliger Witz</h3>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => refreshDemo('joke')}
                    className="p-3 rounded-xl bg-[#FC682C]/20 text-[#FC682C]"
                  >
                    🔄
                  </motion.button>
                </div>
                {joke && (
                  <motion.div
                    key={joke.setup || joke.joke}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-lg"
                  >
                    {joke.type === 'single' ? (
                      <p className="text-white/80">{joke.joke}</p>
                    ) : (
                      <>
                        <p className="text-white/80 mb-4">{joke.setup}</p>
                        <motion.p 
                          className="text-2xl font-bold text-[#FC682C]"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          {joke.punchline}
                        </motion.p>
                      </>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* WEATHER DEMO */}
          {activeDemo === 'weather' && (
            <motion.div
              key="weather"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-xl mx-auto"
            >
              <div className="rounded-3xl p-8 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/20 backdrop-blur-xl">
                <h3 className="text-lg font-semibold text-white mb-6 text-center">🌤️ Wetter Berlin</h3>
                {weather && !weather.error ? (
                  <div className="text-center">
                    <motion.div 
                      className="text-8xl mb-4"
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {weather.current?.icon}
                    </motion.div>
                    <div className="text-5xl font-bold text-white mb-2">{weather.current?.temp}°C</div>
                    <div className="text-xl text-white/60 mb-4">{weather.current?.condition}</div>
                    <div className="grid grid-cols-3 gap-4 mt-6">
                      <div className="p-3 rounded-xl bg-white/5">
                        <div className="text-2xl mb-1">💧</div>
                        <div className="text-sm text-white/60">Feuchte</div>
                        <div className="text-lg font-semibold text-white">{weather.current?.humidity}%</div>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5">
                        <div className="text-2xl mb-1">💨</div>
                        <div className="text-sm text-white/60">Wind</div>
                        <div className="text-lg font-semibold text-white">{weather.current?.wind} km/h</div>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5">
                        <div className="text-2xl mb-1">🌡️</div>
                        <div className="text-sm text-white/60">Gefühlt</div>
                        <div className="text-lg font-semibold text-white">{weather.current?.feelsLike}°C</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-white/40">Lädt...</div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* API Stats */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {[
            { value: '70+', label: t('stats.apis'), color: '#FC682C' },
            { value: '100%', label: t('stats.free'), color: '#22C55E' },
            { value: '<100ms', label: t('stats.response'), color: '#3B82F6' },
            { value: '∞', label: t('stats.requests'), color: '#A855F7' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.1, y: -4 }}
              className="px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl"
            >
              <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-xs text-white/40">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link href="/playground">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(252,104,44,0.5)' }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FC682C] to-[#FFB347] text-white font-semibold text-lg shadow-lg shadow-[#FC682C]/30"
            >
              🚀 Alle 70+ APIs testen →
            </motion.button>
          </Link>
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% center; }
          50% { background-position: 100% center; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  );
}
