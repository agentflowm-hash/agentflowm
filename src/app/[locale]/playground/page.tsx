"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

// ═══════════════════════════════════════════════════════════════
//     🎮 MEGA API PLAYGROUND - 70+ Interactive Tools
// ═══════════════════════════════════════════════════════════════

const categories = [
  { id: 'finance', label: '💰 Finanzen', color: '#F7931A' },
  { id: 'tools', label: '🔧 Tools', color: '#3B82F6' },
  { id: 'media', label: '🎨 Media', color: '#EC4899' },
  { id: 'fun', label: '🎲 Fun', color: '#A855F7' },
  { id: 'geo', label: '🌍 Geo', color: '#22C55E' },
  { id: 'security', label: '🔐 Security', color: '#EF4444' },
  { id: 'text', label: '📝 Text', color: '#06B6D4' },
  { id: 'dev', label: '⚡ Dev', color: '#F97316' },
];

export default function PlaygroundPage() {
  const t = useTranslations('playground');
  const [activeCategory, setActiveCategory] = useState('finance');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-[#030308]">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] rounded-full bg-gradient-to-b from-[#FC682C]/10 via-[#FFB347]/5 to-transparent blur-[150px]" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-[#627EEA]/8 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#00FFA3]/8 blur-[100px]" />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
      </div>

      {/* Header */}
      <header className="relative border-b border-white/[0.06] bg-[#030308]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FC682C] to-[#FFB347] flex items-center justify-center shadow-lg shadow-[#FC682C]/30">
                <span className="text-lg">🚀</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">API Playground</h1>
                <p className="text-xs text-white/40">70+ kostenlose APIs</p>
              </div>
            </Link>
            
            {/* Search */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] w-64">
              <span className="text-white/40">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="API suchen..."
                className="bg-transparent text-sm text-white placeholder-white/30 focus:outline-none flex-1"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Category Tabs */}
      <div className="relative border-b border-white/[0.06] bg-[#030308]/50 backdrop-blur-xl sticky top-[65px] z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeCategory === cat.id 
                    ? 'text-white shadow-lg' 
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
                style={activeCategory === cat.id ? { 
                  background: `linear-gradient(135deg, ${cat.color}30, ${cat.color}10)`,
                  border: `1px solid ${cat.color}40`,
                  boxShadow: `0 0 20px ${cat.color}20`
                } : {}}
              >
                {cat.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeCategory === 'finance' && <FinanceSection key="finance" />}
          {activeCategory === 'tools' && <ToolsSection key="tools" />}
          {activeCategory === 'media' && <MediaSection key="media" />}
          {activeCategory === 'fun' && <FunSection key="fun" />}
          {activeCategory === 'geo' && <GeoSection key="geo" />}
          {activeCategory === 'security' && <SecuritySection key="security" />}
          {activeCategory === 'text' && <TextSection key="text" />}
          {activeCategory === 'dev' && <DevSection key="dev" />}
        </AnimatePresence>
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                        CARD COMPONENTS
// ═══════════════════════════════════════════════════════════════

function Card({ children, title, icon, className = "", color = "#FC682C" }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-5 bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl hover:bg-white/[0.05] hover:border-white/[0.15] transition-all ${className}`}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">{icon}</span>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

function LoadingPulse({ lines = 2 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {[...Array(lines)].map((_, i) => (
        <div key={i} className={`h-4 bg-white/5 rounded animate-pulse ${i === 0 ? 'w-full' : 'w-2/3'}`} />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                         SECTIONS
// ═══════════════════════════════════════════════════════════════

function FinanceSection() {
  const [crypto, setCrypto] = useState<any>(null);
  const [fearGreed, setFearGreed] = useState<any>(null);
  const [exchange, setExchange] = useState<any>(null);
  const [stocks, setStocks] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/insane?tool=bitcoin').then(r => r.json()),
      fetch('/api/insane?tool=fear-greed').then(r => r.json()),
      fetch('/api/tools?tool=exchange').then(r => r.json()),
      fetch('/api/insane?tool=stocks&symbols=AAPL,GOOGL,TSLA').then(r => r.json()),
    ]).then(([c, fg, ex, s]) => {
      setCrypto(c);
      setFearGreed(fg);
      setExchange(ex);
      setStocks(s);
    });
  }, []);

  const coins = [
    { name: 'Bitcoin', symbol: 'BTC', data: crypto?.bitcoin, color: '#F7931A', icon: '₿' },
    { name: 'Ethereum', symbol: 'ETH', data: crypto?.ethereum, color: '#627EEA', icon: 'Ξ' },
    { name: 'Solana', symbol: 'SOL', data: crypto?.solana, color: '#00FFA3', icon: '◎' },
    { name: 'Cardano', symbol: 'ADA', data: crypto?.cardano, color: '#0D1E30', icon: '₳' },
    { name: 'XRP', symbol: 'XRP', data: crypto?.ripple, color: '#23292F', icon: '✕' },
    { name: 'Dogecoin', symbol: 'DOGE', data: crypto?.dogecoin, color: '#C3A634', icon: 'Ð' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">💰 Finanzen & Crypto</h2>
      
      {/* Crypto Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {coins.map((coin, i) => (
          <motion.div
            key={coin.symbol}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.05, y: -4 }}
            className="rounded-2xl p-4 bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                style={{ background: `${coin.color}20`, color: coin.color }}>
                {coin.icon}
              </div>
              <span className="text-xs text-white/60">{coin.symbol}</span>
            </div>
            {coin.data ? (
              <>
                <div className="text-lg font-bold text-white">
                  €{coin.data.eur?.toLocaleString('de-DE', { maximumFractionDigits: coin.data.eur < 1 ? 4 : 0 })}
                </div>
                <div className={`text-xs ${coin.data.eur_24h_change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {coin.data.eur_24h_change >= 0 ? '↗' : '↘'} {Math.abs(coin.data.eur_24h_change || 0).toFixed(2)}%
                </div>
              </>
            ) : <LoadingPulse />}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Fear & Greed */}
        <Card title="Fear & Greed Index" icon="😱">
          {fearGreed ? (
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                  <circle cx="48" cy="48" r="40" fill="none" 
                    stroke={fearGreed.value < 45 ? '#EF4444' : fearGreed.value > 55 ? '#22C55E' : '#EAB308'} 
                    strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={251} strokeDashoffset={251 - (fearGreed.value / 100) * 251} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{fearGreed.value}</span>
                </div>
              </div>
              <div>
                <div className="text-lg font-semibold text-white">{fearGreed.label}</div>
                <div className="text-xs text-white/40">Crypto Market Index</div>
              </div>
            </div>
          ) : <LoadingPulse lines={3} />}
        </Card>

        {/* Exchange Rates */}
        <Card title="Wechselkurse" icon="💱">
          {exchange?.rates ? (
            <div className="space-y-2">
              {Object.entries(exchange.rates).slice(0, 5).map(([key, value]: any) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-sm text-white/60">EUR → {key}</span>
                  <span className="text-sm font-mono text-white">{value.toFixed(4)}</span>
                </div>
              ))}
            </div>
          ) : <LoadingPulse lines={5} />}
        </Card>

        {/* Stocks */}
        <Card title="Aktien (Demo)" icon="📈">
          {stocks ? (
            <div className="space-y-2">
              {Object.entries(stocks).map(([symbol, data]: any) => (
                <div key={symbol} className="flex justify-between items-center">
                  <span className="text-sm font-medium text-white">{symbol}</span>
                  <div className="text-right">
                    <span className="text-sm text-white">${data.price?.toFixed(2)}</span>
                    <span className={`ml-2 text-xs ${data.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {data.change >= 0 ? '+' : ''}{data.changePercent?.toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : <LoadingPulse lines={3} />}
        </Card>
      </div>
    </motion.div>
  );
}

function ToolsSection() {
  const [qrText, setQrText] = useState('https://agentflowm.com');
  const [qrUrl, setQrUrl] = useState('');
  const [password, setPassword] = useState<any>(null);
  const [pwLength, setPwLength] = useState(16);
  const [color, setColor] = useState<any>(null);
  const [palette, setPalette] = useState<any>(null);
  const [uuid, setUuid] = useState<any>(null);
  const [hash, setHash] = useState<any>(null);
  const [hashInput, setHashInput] = useState('Hello World');
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/insane?tool=qr&text=${encodeURIComponent(qrText)}&size=150`).then(r => r.json()).then(d => setQrUrl(d.url));
  }, [qrText]);

  useEffect(() => {
    fetch(`/api/insane?tool=password&length=${pwLength}`).then(r => r.json()).then(setPassword);
  }, [pwLength]);

  useEffect(() => {
    fetch('/api/insane?tool=color').then(r => r.json()).then(c => {
      setColor(c);
      fetch(`/api/powertools?tool=palette&baseColor=${c.hex?.replace('#', '')}`).then(r => r.json()).then(setPalette);
    });
    fetch('/api/insane?tool=uuid').then(r => r.json()).then(setUuid);
  }, []);

  const generateHash = useCallback(async () => {
    const res = await fetch(`/api/insane?tool=hash&text=${encodeURIComponent(hashInput)}`);
    setHash(await res.json());
  }, [hashInput]);

  useEffect(() => { generateHash(); }, [generateHash]);

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  const refreshColor = async () => {
    const c = await fetch('/api/insane?tool=color').then(r => r.json());
    setColor(c);
    const p = await fetch(`/api/powertools?tool=palette&baseColor=${c.hex?.replace('#', '')}`).then(r => r.json());
    setPalette(p);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">🔧 Developer Tools</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* QR Generator */}
        <Card title="QR-Code Generator" icon="📱" className="lg:row-span-2">
          <input
            type="text"
            value={qrText}
            onChange={(e) => setQrText(e.target.value)}
            placeholder="URL oder Text..."
            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#FC682C]/50 mb-4"
          />
          {qrUrl && (
            <div className="flex justify-center">
              <motion.div 
                initial={{ scale: 0.8 }} 
                animate={{ scale: 1 }}
                className="bg-white rounded-2xl p-3 shadow-lg shadow-[#FC682C]/20"
              >
                <img src={qrUrl} alt="QR" className="w-36 h-36" />
              </motion.div>
            </div>
          )}
          <a href={qrUrl} download="qr-code.png" className="block text-center mt-4 text-sm text-[#FC682C] hover:underline">
            ⬇️ Download PNG
          </a>
        </Card>

        {/* Password Generator */}
        <Card title="Passwort Generator" icon="🔐">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs text-white/40">Länge: {pwLength}</span>
            <input
              type="range"
              min="8"
              max="32"
              value={pwLength}
              onChange={e => setPwLength(parseInt(e.target.value))}
              className="flex-1 accent-[#FC682C]"
            />
          </div>
          {password && (
            <div 
              onClick={() => copy(password.password, 'pw')}
              className="bg-black/30 rounded-xl px-4 py-3 font-mono text-sm text-emerald-400 border border-white/5 cursor-pointer hover:border-emerald-500/30 transition-colors break-all"
            >
              {copied === 'pw' ? '✓ Kopiert!' : password.password}
            </div>
          )}
        </Card>

        {/* UUID Generator */}
        <Card title="UUID Generator" icon="🆔">
          {uuid && (
            <div 
              onClick={() => copy(uuid.uuid, 'uuid')}
              className="bg-black/30 rounded-xl px-4 py-3 font-mono text-xs text-cyan-400 border border-white/5 cursor-pointer hover:border-cyan-500/30 transition-colors break-all"
            >
              {copied === 'uuid' ? '✓ Kopiert!' : uuid.uuid}
            </div>
          )}
          <button 
            onClick={() => fetch('/api/insane?tool=uuid').then(r => r.json()).then(setUuid)}
            className="w-full mt-3 py-2 rounded-lg bg-white/5 text-white/60 text-sm hover:bg-white/10"
          >
            🔄 Neu generieren
          </button>
        </Card>

        {/* Color Generator */}
        <Card title="Farb-Generator" icon="🎨">
          {color && (
            <div className="flex items-center gap-4 mb-4">
              <div 
                className="w-16 h-16 rounded-xl shadow-lg cursor-pointer"
                style={{ backgroundColor: color.hex, boxShadow: `0 10px 30px ${color.hex}50` }}
                onClick={refreshColor}
              />
              <div>
                <div className="text-lg font-bold text-white">{color.hex}</div>
                <div className="text-xs text-white/40">{color.name}</div>
              </div>
            </div>
          )}
          {palette?.colors && (
            <div className="flex rounded-xl overflow-hidden">
              {palette.colors.map((c: string, i: number) => (
                <div 
                  key={i}
                  onClick={() => copy(c, `color-${i}`)}
                  className="flex-1 h-8 cursor-pointer hover:scale-110 transition-transform"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          )}
        </Card>

        {/* Hash Generator */}
        <Card title="Hash Generator" icon="🔒">
          <input
            type="text"
            value={hashInput}
            onChange={(e) => setHashInput(e.target.value)}
            placeholder="Text zum Hashen..."
            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-white/30 focus:outline-none mb-3"
          />
          {hash && (
            <div className="space-y-2">
              <div 
                onClick={() => copy(hash.md5, 'md5')}
                className="flex justify-between items-center p-2 rounded-lg bg-black/20 cursor-pointer hover:bg-black/30"
              >
                <span className="text-xs text-white/40">MD5</span>
                <span className="text-xs font-mono text-white/70 truncate max-w-[180px]">{hash.md5}</span>
              </div>
              <div 
                onClick={() => copy(hash.sha256, 'sha')}
                className="flex justify-between items-center p-2 rounded-lg bg-black/20 cursor-pointer hover:bg-black/30"
              >
                <span className="text-xs text-white/40">SHA256</span>
                <span className="text-xs font-mono text-white/70 truncate max-w-[180px]">{hash.sha256}</span>
              </div>
            </div>
          )}
        </Card>
      </div>
    </motion.div>
  );
}

function MediaSection() {
  const [imageUrl, setImageUrl] = useState('');
  const [placeholder, setPlaceholder] = useState<any>(null);
  const [avatar, setAvatar] = useState<any>(null);
  const [icon, setIcon] = useState('');
  const [picsum, setPicsum] = useState('');

  useEffect(() => {
    setPlaceholder({ url: 'https://via.placeholder.com/400x300/FC682C/ffffff?text=AgentFlowM' });
    setAvatar({ url: `https://api.dicebear.com/7.x/bottts/svg?seed=${Math.random()}` });
    setIcon('rocket');
    setPicsum(`https://picsum.photos/400/300?random=${Date.now()}`);
  }, []);

  const refreshAvatar = () => setAvatar({ url: `https://api.dicebear.com/7.x/bottts/svg?seed=${Math.random()}` });
  const refreshPicsum = () => setPicsum(`https://picsum.photos/400/300?random=${Date.now()}`);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">🎨 Media & Images</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Avatar Generator */}
        <Card title="Avatar Generator" icon="👤">
          {avatar && (
            <div className="flex flex-col items-center">
              <motion.img 
                key={avatar.url}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                src={avatar.url} 
                alt="Avatar" 
                className="w-32 h-32 rounded-2xl bg-white/5 mb-4"
              />
              <button onClick={refreshAvatar} className="px-4 py-2 rounded-lg bg-[#FC682C]/20 text-[#FC682C] text-sm">
                🔄 Neuer Avatar
              </button>
            </div>
          )}
        </Card>

        {/* Random Photo */}
        <Card title="Zufalls-Foto" icon="📷">
          <motion.img 
            key={picsum}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            src={picsum} 
            alt="Random" 
            className="w-full h-40 object-cover rounded-xl mb-4"
          />
          <button onClick={refreshPicsum} className="w-full py-2 rounded-lg bg-white/5 text-white/60 text-sm hover:bg-white/10">
            🔄 Neues Foto
          </button>
        </Card>

        {/* Placeholder */}
        <Card title="Placeholder Image" icon="🖼️">
          <img 
            src={placeholder?.url} 
            alt="Placeholder" 
            className="w-full h-40 object-cover rounded-xl"
          />
          <p className="text-xs text-white/40 mt-3 text-center">400 × 300 px</p>
        </Card>
      </div>
    </motion.div>
  );
}

function FunSection() {
  const [joke, setJoke] = useState<any>(null);
  const [quote, setQuote] = useState<any>(null);
  const [fact, setFact] = useState<any>(null);
  const [trivia, setTrivia] = useState<any>(null);
  const [advice, setAdvice] = useState<any>(null);

  const load = useCallback(() => {
    Promise.all([
      fetch('/api/insane?tool=joke').then(r => r.json()),
      fetch('/api/powertools?tool=german-quote').then(r => r.json()),
      fetch('/api/insane?tool=fact').then(r => r.json()),
      fetch('/api/insane?tool=trivia').then(r => r.json()),
      fetch('/api/insane?tool=advice').then(r => r.json()),
    ]).then(([j, q, f, t, a]) => {
      setJoke(j);
      setQuote(q);
      setFact(f);
      setTrivia(t);
      setAdvice(a);
    });
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">🎲 Fun & Entertainment</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Joke */}
        <Card title="Zufälliger Witz" icon="😄" className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
          {joke && (
            <motion.div key={joke.setup || joke.joke} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {joke.type === 'single' ? (
                <p className="text-white/80">{joke.joke}</p>
              ) : (
                <>
                  <p className="text-white/80 mb-3">{joke.setup}</p>
                  <p className="text-lg font-semibold text-purple-400">{joke.punchline}</p>
                </>
              )}
            </motion.div>
          )}
          <button onClick={() => fetch('/api/insane?tool=joke').then(r => r.json()).then(setJoke)} 
            className="w-full mt-4 py-2 rounded-lg bg-white/5 text-white/60 text-sm hover:bg-white/10">
            🔄 Nächster Witz
          </button>
        </Card>

        {/* Quote */}
        <Card title="Inspiration" icon="💡" className="bg-gradient-to-br from-[#FC682C]/10 to-transparent border-[#FC682C]/20">
          {quote && (
            <motion.div key={quote.quote} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <blockquote className="text-white/80 italic mb-3">„{quote.quote}"</blockquote>
              <cite className="text-[#FC682C]">— {quote.author}</cite>
            </motion.div>
          )}
          <button onClick={() => fetch('/api/powertools?tool=german-quote').then(r => r.json()).then(setQuote)} 
            className="w-full mt-4 py-2 rounded-lg bg-white/5 text-white/60 text-sm hover:bg-white/10">
            🔄 Neues Zitat
          </button>
        </Card>

        {/* Fact */}
        <Card title="Fun Fact" icon="🧠">
          {fact && (
            <p className="text-white/80">{fact.fact}</p>
          )}
          <button onClick={() => fetch('/api/insane?tool=fact').then(r => r.json()).then(setFact)} 
            className="w-full mt-4 py-2 rounded-lg bg-white/5 text-white/60 text-sm hover:bg-white/10">
            🔄 Neuer Fakt
          </button>
        </Card>

        {/* Advice */}
        <Card title="Lebensweisheit" icon="🎯">
          {advice && (
            <p className="text-white/80 text-lg">{advice.advice}</p>
          )}
          <button onClick={() => fetch('/api/insane?tool=advice').then(r => r.json()).then(setAdvice)} 
            className="w-full mt-4 py-2 rounded-lg bg-white/5 text-white/60 text-sm hover:bg-white/10">
            🔄 Neuer Rat
          </button>
        </Card>
      </div>
    </motion.div>
  );
}

function GeoSection() {
  const [weather, setWeather] = useState<any>(null);
  const [city, setCity] = useState('Berlin');
  const [ip, setIp] = useState<any>(null);
  const [time, setTime] = useState<any>(null);
  const [country, setCountry] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/tools?tool=weather&city=${city}`).then(r => r.json()),
      fetch('/api/insane?tool=ip').then(r => r.json()),
      fetch('/api/tools?tool=time&timezone=Europe/Berlin').then(r => r.json()),
      fetch('/api/insane?tool=country&code=DE').then(r => r.json()),
    ]).then(([w, i, t, c]) => {
      setWeather(w);
      setIp(i);
      setTime(t);
      setCountry(c);
    });
  }, [city]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">🌍 Geo & Location</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Weather */}
        <Card title="Wetter" icon="🌤️" className="lg:col-span-2 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border-blue-500/20">
          <div className="flex gap-2 mb-4">
            {['Berlin', 'München', 'Hamburg', 'Köln'].map(c => (
              <button 
                key={c}
                onClick={() => setCity(c)}
                className={`px-3 py-1 rounded-lg text-sm ${city === c ? 'bg-blue-500 text-white' : 'bg-white/5 text-white/60'}`}
              >
                {c}
              </button>
            ))}
          </div>
          {weather && !weather.error ? (
            <div className="flex items-center gap-6">
              <div className="text-6xl">{weather.current?.icon}</div>
              <div>
                <div className="text-4xl font-bold text-white">{weather.current?.temp}°C</div>
                <div className="text-white/60">{weather.current?.condition}</div>
                <div className="text-sm text-white/40">Gefühlt: {weather.current?.feelsLike}°C</div>
              </div>
              <div className="hidden md:grid grid-cols-2 gap-4 ml-auto">
                <div className="text-center p-3 rounded-xl bg-white/5">
                  <div className="text-lg">💧</div>
                  <div className="text-sm text-white">{weather.current?.humidity}%</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-white/5">
                  <div className="text-lg">💨</div>
                  <div className="text-sm text-white">{weather.current?.wind} km/h</div>
                </div>
              </div>
            </div>
          ) : <LoadingPulse lines={3} />}
        </Card>

        {/* IP Info */}
        <Card title="Deine IP" icon="📍">
          {ip && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-white/40">IP</span>
                <span className="text-sm font-mono text-white">{ip.ip}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-white/40">Stadt</span>
                <span className="text-sm text-white">{ip.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-white/40">Land</span>
                <span className="text-sm text-white">{ip.country}</span>
              </div>
            </div>
          )}
        </Card>

        {/* Time */}
        <Card title="Aktuelle Zeit" icon="🕐">
          {time && (
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">{time.formatted?.split(',')[1]?.trim()}</div>
              <div className="text-sm text-white/40">{time.timezone}</div>
            </div>
          )}
        </Card>

        {/* Country Info */}
        <Card title="Land Info" icon="🏳️">
          {country && (
            <div className="flex items-center gap-4">
              <span className="text-5xl">{country.flag}</span>
              <div>
                <div className="text-lg font-semibold text-white">{country.name}</div>
                <div className="text-sm text-white/40">{country.capital}</div>
                <div className="text-xs text-white/30">{country.population?.toLocaleString()} Einwohner</div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </motion.div>
  );
}

function SecuritySection() {
  const [password, setPassword] = useState<any>(null);
  const [hash, setHash] = useState<any>(null);
  const [hashInput, setHashInput] = useState('Secret123');
  const [token, setToken] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/insane?tool=password&length=24').then(r => r.json()),
      fetch(`/api/insane?tool=hash&text=${hashInput}`).then(r => r.json()),
      fetch('/api/powertools?tool=token').then(r => r.json()),
    ]).then(([p, h, t]) => {
      setPassword(p);
      setHash(h);
      setToken(t);
    });
  }, [hashInput]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">🔐 Security Tools</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Sichere Passwörter" icon="🔑" className="bg-gradient-to-br from-red-500/10 to-transparent border-red-500/20">
          {password && (
            <div className="space-y-3">
              <div className="bg-black/30 rounded-xl px-4 py-3 font-mono text-emerald-400 border border-emerald-500/20 break-all">
                {password.password}
              </div>
              <div className="flex gap-2">
                <div className={`flex-1 h-2 rounded-full ${password.strength === 'sehr stark' ? 'bg-emerald-500' : 'bg-yellow-500'}`} />
              </div>
              <button onClick={() => fetch('/api/insane?tool=password&length=24').then(r => r.json()).then(setPassword)}
                className="w-full py-2 rounded-lg bg-white/5 text-white/60 text-sm hover:bg-white/10">
                🔄 Neu generieren
              </button>
            </div>
          )}
        </Card>

        <Card title="Hash Funktionen" icon="🔒">
          <input
            type="text"
            value={hashInput}
            onChange={(e) => setHashInput(e.target.value)}
            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-sm text-white mb-3"
          />
          {hash && (
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2 rounded-lg bg-black/20">
                <span className="text-white/40">MD5: </span>
                <span className="text-cyan-400 break-all">{hash.md5}</span>
              </div>
              <div className="p-2 rounded-lg bg-black/20">
                <span className="text-white/40">SHA256: </span>
                <span className="text-cyan-400 break-all">{hash.sha256?.slice(0, 32)}...</span>
              </div>
            </div>
          )}
        </Card>

        <Card title="API Token" icon="🎫">
          {token && (
            <div className="bg-black/30 rounded-xl px-4 py-3 font-mono text-xs text-purple-400 border border-purple-500/20 break-all">
              {token.token}
            </div>
          )}
          <button onClick={() => fetch('/api/powertools?tool=token').then(r => r.json()).then(setToken)}
            className="w-full mt-3 py-2 rounded-lg bg-white/5 text-white/60 text-sm hover:bg-white/10">
            🔄 Neuer Token
          </button>
        </Card>
      </div>
    </motion.div>
  );
}

function TextSection() {
  const [lorem, setLorem] = useState<any>(null);
  const [slugInput, setSlugInput] = useState('Hello World Example');
  const [slug, setSlug] = useState<any>(null);

  useEffect(() => {
    fetch('/api/insane?tool=lorem&paragraphs=2').then(r => r.json()).then(setLorem);
    fetch(`/api/powertools?tool=slug&text=${encodeURIComponent(slugInput)}`).then(r => r.json()).then(setSlug);
  }, [slugInput]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">📝 Text Tools</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Lorem Ipsum Generator" icon="📄" className="md:col-span-2">
          {lorem && (
            <div className="text-sm text-white/70 leading-relaxed max-h-40 overflow-y-auto">
              {lorem.text}
            </div>
          )}
          <button onClick={() => fetch('/api/insane?tool=lorem&paragraphs=2').then(r => r.json()).then(setLorem)}
            className="w-full mt-4 py-2 rounded-lg bg-white/5 text-white/60 text-sm hover:bg-white/10">
            🔄 Neuer Text
          </button>
        </Card>

        <Card title="URL Slug Generator" icon="🔗">
          <input
            type="text"
            value={slugInput}
            onChange={(e) => setSlugInput(e.target.value)}
            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-sm text-white mb-3"
          />
          {slug && (
            <div className="bg-black/30 rounded-xl px-4 py-3 font-mono text-sm text-emerald-400 border border-emerald-500/20">
              {slug.slug}
            </div>
          )}
        </Card>
      </div>
    </motion.div>
  );
}

function DevSection() {
  const [userAgent, setUserAgent] = useState<any>(null);
  const [httpBin, setHttpBin] = useState<any>(null);
  const [base64Input, setBase64Input] = useState('Hello AgentFlowM!');
  const [base64, setBase64] = useState<any>(null);

  useEffect(() => {
    fetch('/api/insane?tool=user-agent').then(r => r.json()).then(setUserAgent);
    fetch('/api/insane?tool=httpbin').then(r => r.json()).then(setHttpBin);
  }, []);

  useEffect(() => {
    fetch(`/api/insane?tool=base64&text=${encodeURIComponent(base64Input)}`).then(r => r.json()).then(setBase64);
  }, [base64Input]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">⚡ Developer APIs</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="User Agent Parser" icon="🌐">
          {userAgent && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/40">Browser</span>
                <span className="text-white">{userAgent.browser}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">OS</span>
                <span className="text-white">{userAgent.os}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Device</span>
                <span className="text-white">{userAgent.device || 'Desktop'}</span>
              </div>
            </div>
          )}
        </Card>

        <Card title="Base64 Encoder" icon="🔠">
          <input
            type="text"
            value={base64Input}
            onChange={(e) => setBase64Input(e.target.value)}
            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-sm text-white mb-3"
          />
          {base64 && (
            <div className="bg-black/30 rounded-xl px-4 py-3 font-mono text-xs text-cyan-400 border border-cyan-500/20 break-all">
              {base64.encoded}
            </div>
          )}
        </Card>

        <Card title="HTTP Request Tester" icon="📡" className="md:col-span-2">
          {httpBin && (
            <div className="bg-black/30 rounded-xl p-4 font-mono text-xs text-white/70 overflow-x-auto">
              <pre>{JSON.stringify(httpBin, null, 2)}</pre>
            </div>
          )}
        </Card>
      </div>
    </motion.div>
  );
}
