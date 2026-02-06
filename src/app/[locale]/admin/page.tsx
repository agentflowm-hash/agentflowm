"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout";
import { type Locale } from "@/i18n/config";

// ═══════════════════════════════════════════════════════════════
//     🔥 ADMIN DASHBOARD - Powerful Tools for Agency Management
// ═══════════════════════════════════════════════════════════════

export default function AdminDashboard() {
  const params = useParams();
  const locale = (params?.locale as Locale) || "de";
  const [stats, setStats] = useState<any>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Secure auth check via API
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      
      if (res.ok) {
        setAuthenticated(true);
      } else {
        const data = await res.json();
        setError(data.error || "Login fehlgeschlagen");
      }
    } catch {
      setError("Verbindungsfehler");
    }
  };

  // Check existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          setAuthenticated(true);
        }
      } catch {
        // Not authenticated
      }
    };
    checkSession();
  }, []);

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#030308]">
        <Header locale={locale} />
        <div className="min-h-screen flex items-center justify-center p-4 pt-24">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <div className="rounded-3xl p-8 bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/[0.1] backdrop-blur-xl">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FC682C] to-[#FFB347] flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(252,104,44,0.3)]">
                <span className="text-2xl">🔐</span>
              </div>
              <h1 className="text-2xl font-bold text-white text-center mb-2">Admin Dashboard</h1>
              <p className="text-white/40 text-center mb-8">AgentFlowM Control Center</p>
              
              <form onSubmit={handleLogin}>
                <input
                  type="password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  placeholder="Passwort eingeben..."
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-white/30 focus:outline-none focus:border-[#FC682C]/50 mb-4"
                />
                {error && <p className="text-[#FC682C] text-sm mb-4">{error}</p>}
                <button 
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#FC682C] to-[#FFB347] text-white font-semibold shadow-[0_0_20px_rgba(252,104,44,0.3)] hover:shadow-[0_0_30px_rgba(252,104,44,0.5)] transition-all"
                >
                  Einloggen
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030308]">
      {/* Header */}
      <header className="border-b border-white/[0.06] bg-[#0f0f12]/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FC682C] to-[#FFB347] flex items-center justify-center">
                <span className="text-lg">🚀</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Admin Dashboard</h1>
                <p className="text-xs text-white/40">AgentFlowM Control Center</p>
              </div>
            </div>
            <button 
              onClick={async () => { 
                await fetch('/api/admin/logout', { method: 'POST' }); 
                setAuthenticated(false); 
              }}
              className="px-4 py-2 rounded-lg bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Stats Row */}
        <QuickStatsRow />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Column 1 - Business */}
          <div className="space-y-6">
            <MarketSentimentWidget />
            <CryptoTickerWidget />
            <WeatherWidget />
          </div>

          {/* Column 2 - Tools */}
          <div className="space-y-6">
            <QuickQRWidget />
            <PasswordWidget />
            <TimezoneWidget />
          </div>

          {/* Column 3 - Insights */}
          <div className="space-y-6">
            <QuoteWidget />
            <JokeWidget />
            <SystemStatusWidget />
          </div>
        </div>

        {/* Tools Grid */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-white mb-4">🔧 Schnellzugriff Tools</h2>
          <ToolsGrid />
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-white mb-4">⚡ Schnellaktionen</h2>
          <QuickActionsSection />
        </div>

        {/* API Stats */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-white mb-4">📊 API Nutzung</h2>
          <APIStatsWidget />
        </div>
      </main>
    </div>
  );
}

function RealStatsWidget() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.ok ? r.json() : null)
      .then(setStats)
      .catch(() => null);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-2xl p-5 bg-gradient-to-br from-[#FC682C]/10 to-transparent border border-[#FC682C]/20 backdrop-blur-xl"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">🎯</span>
        <h3 className="text-sm font-medium text-white/60">Business Stats (Live)</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 rounded-xl bg-black/20">
          <div className="text-2xl font-bold text-white">{stats?.leads?.total || 0}</div>
          <div className="text-xs text-white/40">Leads Gesamt</div>
        </div>
        <div className="text-center p-3 rounded-xl bg-black/20">
          <div className="text-2xl font-bold text-emerald-400">{stats?.leads?.new || 0}</div>
          <div className="text-xs text-white/40">Neue Leads</div>
        </div>
        <div className="text-center p-3 rounded-xl bg-black/20">
          <div className="text-2xl font-bold text-white">{stats?.subscribers?.total || 0}</div>
          <div className="text-xs text-white/40">Subscribers</div>
        </div>
        <div className="text-center p-3 rounded-xl bg-black/20">
          <div className="text-2xl font-bold text-[#FC682C]">{stats?.referrals?.total || 0}</div>
          <div className="text-xs text-white/40">Referrals</div>
        </div>
      </div>
    </motion.div>
  );
}

function QuickActionsSection() {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [checkResult, setCheckResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkWebsite = async () => {
    if (!websiteUrl) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/website-check?url=${encodeURIComponent(websiteUrl)}`);
      setCheckResult(await res.json());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Website Checker */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5 bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl"
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">🔍</span>
          <h3 className="text-sm font-medium text-white/60">Website Check</h3>
        </div>
        <div className="flex gap-2 mb-4">
          <input
            type="url"
            value={websiteUrl}
            onChange={e => setWebsiteUrl(e.target.value)}
            placeholder="https://example.com"
            className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none"
          />
          <button 
            onClick={checkWebsite}
            disabled={loading}
            className="px-4 rounded-lg bg-[#FC682C] text-white text-sm font-medium disabled:opacity-50"
          >
            {loading ? '...' : 'Check'}
          </button>
        </div>
        {checkResult && (
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-white/40">Status</span>
              <span className={checkResult.success ? 'text-emerald-400' : 'text-rose-400'}>
                {checkResult.success ? '✅ Online' : '❌ Offline'}
              </span>
            </div>
            {checkResult.loadTime && (
              <div className="flex justify-between">
                <span className="text-white/40">Ladezeit</span>
                <span className="text-white">{checkResult.loadTime}ms</span>
              </div>
            )}
            {checkResult.ssl && (
              <div className="flex justify-between">
                <span className="text-white/40">SSL</span>
                <span className="text-emerald-400">✅ Aktiv</span>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Quick Stats - Live from API */}
      <RealStatsWidget />
    </div>
  );
}

function APIStatsWidget() {
  const apiCategories = [
    { name: 'Finanzen', count: 12, color: '#F7931A', icon: '💰' },
    { name: 'Tools', count: 15, color: '#3B82F6', icon: '🔧' },
    { name: 'Media', count: 10, color: '#EC4899', icon: '🎨' },
    { name: 'Fun', count: 8, color: '#A855F7', icon: '🎲' },
    { name: 'Geo', count: 9, color: '#22C55E', icon: '🌍' },
    { name: 'Security', count: 7, color: '#EF4444', icon: '🔐' },
    { name: 'Text', count: 5, color: '#06B6D4', icon: '📝' },
    { name: 'Dev', count: 6, color: '#F97316', icon: '⚡' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-5 bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {apiCategories.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.05, y: -2 }}
            className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.15] transition-all cursor-pointer"
          >
            <div className="text-2xl mb-2">{cat.icon}</div>
            <div className="text-xl font-bold text-white">{cat.count}</div>
            <div className="text-xs text-white/40">{cat.name}</div>
            <div className="mt-2 h-1 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${(cat.count / 15) * 100}%`, backgroundColor: cat.color }} />
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/[0.06]">
        <div className="text-sm text-white/40">
          Gesamt: <span className="text-white font-semibold">72 APIs</span>
        </div>
        <span className="text-sm text-[#FC682C] hover:underline cursor-pointer" onClick={() => window.location.href='/playground'}>
          Alle APIs testen →
        </span>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                         WIDGETS
// ═══════════════════════════════════════════════════════════════

function Card({ children, title, icon, className = "" }: { children: React.ReactNode; title: string; icon: string; className?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-5 bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl ${className}`}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">{icon}</span>
        <h3 className="text-sm font-medium text-white/60">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

function QuickStatsRow() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/insane?tool=bitcoin').then(r => r.json()),
      fetch('/api/powertools?tool=business-hours').then(r => r.json()),
    ]).then(([crypto, hours]) => {
      setStats({ crypto, hours });
    });
  }, []);

  const items = [
    { label: "BTC Preis", value: stats?.crypto?.bitcoin?.eur ? `€${stats.crypto.bitcoin.eur.toLocaleString('de-DE', { maximumFractionDigits: 0 })}` : "...", change: stats?.crypto?.bitcoin?.eur_24h_change, color: "#F7931A" },
    { label: "ETH Preis", value: stats?.crypto?.ethereum?.eur ? `€${stats.crypto.ethereum.eur.toLocaleString('de-DE', { maximumFractionDigits: 0 })}` : "...", change: stats?.crypto?.ethereum?.eur_24h_change, color: "#627EEA" },
    { label: "Bürostatus", value: stats?.hours?.open ? "Geöffnet" : "Geschlossen", icon: stats?.hours?.open ? "🟢" : "🔴", color: stats?.hours?.open ? "#22C55E" : "#EF4444" },
    { label: "Server", value: "Online", icon: "⚡", color: "#22C55E" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="rounded-2xl p-4 bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl"
        >
          <div className="text-xs text-white/40 mb-1">{item.label}</div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">{item.value}</span>
            {item.change !== undefined && (
              <span className={`text-xs ${item.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {item.change >= 0 ? '↑' : '↓'}{Math.abs(item.change).toFixed(1)}%
              </span>
            )}
            {item.icon && <span>{item.icon}</span>}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function MarketSentimentWidget() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/insane?tool=fear-greed').then(r => r.json()).then(setData);
  }, []);

  const getColor = (v: number) => v < 25 ? '#EF4444' : v < 45 ? '#F97316' : v < 55 ? '#EAB308' : v < 75 ? '#22C55E' : '#10B981';

  return (
    <Card title="Market Sentiment" icon="📊">
      {data ? (
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20">
            <svg className="w-full h-full -rotate-90">
              <circle cx="40" cy="40" r="35" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
              <circle cx="40" cy="40" r="35" fill="none" stroke={getColor(data.value)} strokeWidth="6" strokeLinecap="round"
                strokeDasharray={220} strokeDashoffset={220 - (data.value / 100) * 220} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-white">{data.value}</span>
            </div>
          </div>
          <div>
            <div className="text-lg font-semibold text-white">{data.label}</div>
            <div className="text-xs text-white/40">Crypto Market Index</div>
            <div className="text-xs text-white/30 mt-1">
              {data.value < 25 ? "Zeit zum Kaufen?" : data.value > 75 ? "Vorsicht - Überkauft" : "Neutral"}
            </div>
          </div>
        </div>
      ) : <LoadingPulse />}
    </Card>
  );
}

function CryptoTickerWidget() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/insane?tool=bitcoin').then(r => r.json()).then(setData);
    const interval = setInterval(() => {
      fetch('/api/insane?tool=bitcoin').then(r => r.json()).then(setData);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const coins = [
    { name: "Bitcoin", symbol: "BTC", data: data?.bitcoin, color: "#F7931A" },
    { name: "Ethereum", symbol: "ETH", data: data?.ethereum, color: "#627EEA" },
    { name: "Solana", symbol: "SOL", data: data?.solana, color: "#00FFA3" },
  ];

  return (
    <Card title="Crypto Preise" icon="💰">
      <div className="space-y-3">
        {coins.map(coin => (
          <div key={coin.symbol} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" 
                style={{ background: `${coin.color}20`, color: coin.color }}>
                {coin.symbol[0]}
              </div>
              <span className="text-sm text-white">{coin.name}</span>
            </div>
            {coin.data ? (
              <div className="text-right">
                <div className="text-sm font-medium text-white">
                  €{coin.data.eur?.toLocaleString('de-DE', { maximumFractionDigits: 0 })}
                </div>
                <div className={`text-xs ${coin.data.eur_24h_change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {coin.data.eur_24h_change >= 0 ? '↑' : '↓'}{Math.abs(coin.data.eur_24h_change || 0).toFixed(2)}%
                </div>
              </div>
            ) : <div className="w-16 h-8 bg-white/5 rounded animate-pulse" />}
          </div>
        ))}
      </div>
    </Card>
  );
}

function WeatherWidget() {
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    fetch('/api/tools?tool=weather&city=Berlin').then(r => r.json()).then(setWeather);
  }, []);

  return (
    <Card title="Wetter Berlin" icon="🌤️">
      {weather && !weather.error ? (
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-white">{weather.current?.temp}°C</div>
            <div className="text-sm text-white/50">{weather.current?.condition}</div>
          </div>
          <div className="text-5xl">{weather.current?.icon}</div>
        </div>
      ) : <LoadingPulse />}
    </Card>
  );
}

function QuickQRWidget() {
  const [text, setText] = useState("https://agentflowm.com");
  const [qr, setQr] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      fetch(`/api/insane?tool=qr&text=${encodeURIComponent(text)}&size=150`)
        .then(r => r.json())
        .then(d => setQr(d.url));
    }, 300);
    return () => clearTimeout(timer);
  }, [text]);

  return (
    <Card title="Schnell-QR" icon="📲">
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="URL oder Text..."
        className="w-full bg-black/30 border border-white/5 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none mb-3"
      />
      {qr && (
        <div className="flex justify-center">
          <div className="bg-white rounded-xl p-2">
            <img src={qr} alt="QR" className="w-28 h-28" />
          </div>
        </div>
      )}
    </Card>
  );
}

function PasswordWidget() {
  const [pw, setPw] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    fetch('/api/insane?tool=password&length=16').then(r => r.json()).then(setPw);
  };

  useEffect(() => { generate(); }, []);

  const copy = () => {
    navigator.clipboard.writeText(pw?.password || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Card title="Passwort Generator" icon="🔐">
      <div className="flex gap-2 mb-3">
        <div className="flex-1 bg-black/30 rounded-lg px-3 py-2 font-mono text-sm text-emerald-400 truncate border border-white/5">
          {pw?.password || '...'}
        </div>
        <button onClick={copy} className="px-3 rounded-lg bg-[#FC682C] text-white text-sm">
          {copied ? '✓' : '📋'}
        </button>
      </div>
      <button onClick={generate} className="w-full py-2 rounded-lg bg-white/5 text-white/60 text-sm hover:bg-white/10">
        Neu generieren
      </button>
    </Card>
  );
}

function TimezoneWidget() {
  const [times, setTimes] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const zones = ['America/New_York', 'Europe/London', 'Asia/Tokyo', 'Asia/Dubai'];
      const results = await Promise.all(
        zones.map(tz => fetch(`/api/tools?tool=time&timezone=${tz}`).then(r => r.json()))
      );
      setTimes(results);
    };
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, []);

  const cities = ['New York', 'London', 'Tokyo', 'Dubai'];

  return (
    <Card title="Weltzeiten" icon="🌍">
      <div className="space-y-2">
        {times ? times.map((t: any, i: number) => (
          <div key={i} className="flex justify-between items-center">
            <span className="text-sm text-white/60">{cities[i]}</span>
            <span className="text-sm font-mono text-white">{t.formatted?.split(',')[1]?.trim() || '...'}</span>
          </div>
        )) : <LoadingPulse />}
      </div>
    </Card>
  );
}

function QuoteWidget() {
  const [quote, setQuote] = useState<any>(null);

  const load = () => {
    fetch('/api/powertools?tool=german-quote').then(r => r.json()).then(setQuote);
  };

  useEffect(() => { load(); }, []);

  return (
    <Card title="Tägliche Motivation" icon="💡">
      {quote ? (
        <>
          <blockquote className="text-sm text-white/80 italic mb-2">„{quote.quote}"</blockquote>
          <cite className="text-xs text-[#FC682C]">— {quote.author}</cite>
        </>
      ) : <LoadingPulse />}
      <button onClick={load} className="w-full mt-3 py-2 rounded-lg bg-white/5 text-white/40 text-xs hover:bg-white/10">
        Neues Zitat
      </button>
    </Card>
  );
}

function JokeWidget() {
  const [joke, setJoke] = useState<any>(null);

  const load = () => {
    fetch('/api/insane?tool=joke').then(r => r.json()).then(setJoke);
  };

  useEffect(() => { load(); }, []);

  return (
    <Card title="Kurze Pause" icon="😄">
      {joke ? (
        <div className="text-sm text-white/70">
          {joke.type === 'single' ? joke.joke : (
            <>
              <p className="mb-2">{joke.setup}</p>
              <p className="text-[#FC682C]">{joke.punchline}</p>
            </>
          )}
        </div>
      ) : <LoadingPulse />}
      <button onClick={load} className="w-full mt-3 py-2 rounded-lg bg-white/5 text-white/40 text-xs hover:bg-white/10">
        Nächster Witz
      </button>
    </Card>
  );
}

function SystemStatusWidget() {
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    fetch('/api/powertools?tool=system-status').then(r => r.json()).then(setStatus);
  }, []);

  return (
    <Card title="System Status" icon="⚡">
      {status?.services ? (
        <div className="space-y-2">
          {status.services.map((s: any, i: number) => (
            <div key={i} className="flex justify-between items-center">
              <span className="text-sm text-white/60">{s.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/40">{s.uptime}%</span>
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
            </div>
          ))}
        </div>
      ) : <LoadingPulse />}
    </Card>
  );
}

function ToolsGrid() {
  const tools = [
    { name: "Website Check", icon: "🔍", href: "/website-check" },
    { name: "Playground", icon: "🎮", href: "/playground" },
    { name: "Pakete", icon: "📦", href: "/pakete" },
    { name: "Kontakt", icon: "📧", href: "/kontakt" },
    { name: "Projekte", icon: "🚀", href: "/projekte" },
    { name: "Workflows", icon: "⚡", href: "/workflows" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {tools.map((tool, i) => (
        <motion.a
          key={i}
          href={tool.href}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          whileHover={{ scale: 1.05, y: -2 }}
          className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.15] transition-all"
        >
          <span className="text-2xl">{tool.icon}</span>
          <span className="text-xs text-white/60">{tool.name}</span>
        </motion.a>
      ))}
    </div>
  );
}

function LoadingPulse() {
  return (
    <div className="space-y-2">
      <div className="h-6 bg-white/5 rounded animate-pulse" />
      <div className="h-4 w-2/3 bg-white/5 rounded animate-pulse" />
    </div>
  );
}
