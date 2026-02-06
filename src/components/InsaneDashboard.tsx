'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════
//           🎨 ELEGANT DASHBOARD - Matches AgentFlowM Design
// ═══════════════════════════════════════════════════════════════

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

// CARD WRAPPER
function Card({ children, className = '', gradient = false, glow = false }: { 
  children: React.ReactNode; 
  className?: string; 
  gradient?: boolean;
  glow?: boolean;
}) {
  return (
    <motion.div
      variants={fadeIn}
      className={`
        relative overflow-hidden rounded-[18px] p-5
        ${gradient 
          ? 'bg-gradient-to-br from-[#FC682C]/10 via-[#FFB347]/5 to-transparent' 
          : 'bg-white/[0.03]'
        }
        border border-white/[0.08] backdrop-blur-xl
        ${glow ? 'shadow-[0_0_30px_rgba(252,104,44,0.1)]' : ''}
        hover:border-white/[0.15] transition-all duration-300
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

// CRYPTO TICKER - Elegant Version
export function CryptoTicker() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const load = () => fetch('/api/insane?tool=bitcoin').then(r => r.json()).then(setData);
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  const coins = [
    { name: 'Bitcoin', symbol: 'BTC', data: data?.bitcoin, color: '#F7931A' },
    { name: 'Ethereum', symbol: 'ETH', data: data?.ethereum, color: '#627EEA' },
    { name: 'Solana', symbol: 'SOL', data: data?.solana, color: '#00FFA3' },
  ];

  return (
    <motion.div 
      className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
      variants={stagger}
      initial="initial"
      animate="animate"
    >
      {coins.map((coin, i) => (
        <motion.div
          key={coin.symbol}
          variants={fadeIn}
          className="flex-shrink-0 min-w-[180px] rounded-[18px] p-5 bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl hover:bg-white/[0.05] transition-all duration-300"
        >
          <div className="flex items-center gap-3 mb-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
              style={{ 
                background: `linear-gradient(135deg, ${coin.color}20, ${coin.color}40)`,
                boxShadow: `0 0 20px ${coin.color}30`
              }}
            >
              {coin.symbol[0]}
            </div>
            <div>
              <div className="text-sm font-medium text-white">{coin.name}</div>
              <div className="text-xs text-white/40">{coin.symbol}</div>
            </div>
          </div>
          {coin.data ? (
            <>
              <div className="text-2xl font-semibold text-white mb-1">
                €{coin.data.eur?.toLocaleString('de-DE', { maximumFractionDigits: 0 })}
              </div>
              <div className={`text-sm font-medium ${coin.data.eur_24h_change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {coin.data.eur_24h_change >= 0 ? '↑' : '↓'} {Math.abs(coin.data.eur_24h_change || 0).toFixed(2)}%
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <div className="h-7 bg-white/5 rounded-lg animate-pulse" />
              <div className="h-4 w-16 bg-white/5 rounded-lg animate-pulse" />
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}

// FEAR & GREED - Elegant Gauge
export function FearGreedWidget() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/insane?tool=fear-greed').then(r => r.json()).then(setData);
  }, []);

  const getGradient = (value: number) => {
    if (value < 25) return ['#EF4444', '#DC2626'];
    if (value < 45) return ['#F97316', '#EA580C'];
    if (value < 55) return ['#EAB308', '#CA8A04'];
    if (value < 75) return ['#22C55E', '#16A34A'];
    return ['#10B981', '#059669'];
  };

  const colors = data ? getGradient(data.value) : ['#6B7280', '#4B5563'];

  return (
    <Card gradient glow>
      <div className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">Market Sentiment</div>
      <div className="flex items-center gap-6">
        <div className="relative w-24 h-24">
          {/* Background Ring */}
          <svg className="w-full h-full -rotate-90">
            <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            <motion.circle
              cx="48" cy="48" r="40"
              fill="none"
              stroke={`url(#gauge-gradient-${data?.value || 0})`}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={251}
              initial={{ strokeDashoffset: 251 }}
              animate={{ strokeDashoffset: 251 - (data?.value || 0) * 2.51 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id={`gauge-gradient-${data?.value || 0}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={colors[0]} />
                <stop offset="100%" stopColor={colors[1]} />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">{data?.value || '–'}</span>
          </div>
        </div>
        <div>
          <div className="text-xl font-semibold text-white mb-1">{data?.label || 'Loading...'}</div>
          <div className="text-sm text-white/40">Crypto Market Index</div>
        </div>
      </div>
    </Card>
  );
}

// QUOTE WIDGET - Elegant
export function QuoteWidget() {
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const loadQuote = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/powertools?tool=german-quote');
    setQuote(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { loadQuote(); }, [loadQuote]);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs font-medium text-white/40 uppercase tracking-wider">Tägliche Inspiration</div>
        <motion.button 
          onClick={loadQuote}
          disabled={loading}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
        >
          <motion.span animate={{ rotate: loading ? 360 : 0 }} transition={{ duration: 0.5 }}>↻</motion.span>
        </motion.button>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={quote?.quote} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <blockquote className="text-white/80 text-lg leading-relaxed mb-3">
            „{quote?.quote || '...'}"
          </blockquote>
          <cite className="text-sm text-[#FC682C]">— {quote?.author || '...'}</cite>
        </motion.div>
      </AnimatePresence>
    </Card>
  );
}

// PASSWORD GENERATOR - Elegant
export function PasswordGenerator() {
  const [password, setPassword] = useState<any>(null);
  const [length, setLength] = useState(16);
  const [copied, setCopied] = useState(false);

  const generate = useCallback(async () => {
    const res = await fetch(`/api/insane?tool=password&length=${length}`);
    setPassword(await res.json());
  }, [length]);

  useEffect(() => { generate(); }, [generate]);

  const copy = () => {
    navigator.clipboard.writeText(password?.password || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <div className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">Passwort Generator</div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-white/60">Länge</span>
          <span className="text-white font-mono">{length}</span>
        </div>
        <input
          type="range"
          min="8"
          max="32"
          value={length}
          onChange={e => setLength(parseInt(e.target.value))}
          className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#FC682C] [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(252,104,44,0.5)]"
        />
      </div>

      <div className="flex gap-2">
        <div className="flex-1 bg-black/30 rounded-xl px-4 py-3 font-mono text-sm text-emerald-400 truncate border border-white/5">
          {password?.password || '...'}
        </div>
        <motion.button
          onClick={copy}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 rounded-xl bg-[#FC682C] text-white font-medium hover:bg-[#e55a1f] transition-colors"
        >
          {copied ? '✓' : 'Copy'}
        </motion.button>
      </div>
      
      <div className="mt-3 flex items-center gap-2">
        <div className={`h-1 flex-1 rounded-full ${
          password?.strength === 'sehr stark' ? 'bg-emerald-500' : 
          password?.strength === 'stark' ? 'bg-yellow-500' : 'bg-orange-500'
        }`} />
        <span className="text-xs text-white/40">{password?.strength}</span>
      </div>
    </Card>
  );
}

// QR CODE GENERATOR - Elegant
export function QRGenerator() {
  const [text, setText] = useState('https://agentflowm.com');
  const [qr, setQr] = useState<string>('');

  useEffect(() => {
    const timer = setTimeout(() => {
      fetch(`/api/insane?tool=qr&text=${encodeURIComponent(text)}&size=200`)
        .then(r => r.json())
        .then(data => setQr(data.url));
    }, 300);
    return () => clearTimeout(timer);
  }, [text]);

  return (
    <Card>
      <div className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">QR Code</div>
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="URL oder Text..."
        className="w-full bg-black/30 border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#FC682C]/50 transition-colors mb-4"
      />
      {qr && (
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex justify-center"
        >
          <div className="bg-white rounded-2xl p-3 shadow-[0_0_30px_rgba(252,104,44,0.2)]">
            <img src={qr} alt="QR Code" className="w-32 h-32" />
          </div>
        </motion.div>
      )}
    </Card>
  );
}

// DICE ROLLER - Elegant with Animation
export function DiceRoller() {
  const [result, setResult] = useState<any>(null);
  const [rolling, setRolling] = useState(false);

  const roll = async () => {
    setRolling(true);
    await new Promise(r => setTimeout(r, 600));
    const res = await fetch('/api/insane?tool=dice&sides=6&count=2');
    const data = await res.json();
    setResult(data);
    setRolling(false);
  };

  const diceEmoji = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

  return (
    <Card gradient>
      <div className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">Würfel</div>
      <div className="flex items-center justify-center gap-4 mb-4 h-20">
        {result?.rolls?.map((roll: number, i: number) => (
          <motion.div
            key={i}
            initial={{ rotateX: 0 }}
            animate={{ rotateX: rolling ? 720 : 0 }}
            transition={{ duration: 0.6 }}
            className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-lg"
          >
            {diceEmoji[roll - 1]}
          </motion.div>
        )) || (
          <div className="text-white/20 text-sm">Klick zum Würfeln</div>
        )}
      </div>
      {result && !rolling && (
        <div className="text-center text-white/60 text-sm mb-3">
          Summe: <span className="text-white font-semibold">{result.total}</span>
        </div>
      )}
      <motion.button
        onClick={roll}
        disabled={rolling}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FC682C] to-[#FFB347] text-white font-semibold disabled:opacity-50 transition-all"
      >
        {rolling ? 'Würfelt...' : 'Würfeln'}
      </motion.button>
    </Card>
  );
}

// COLOR PICKER - Elegant
export function ColorPicker() {
  const [color, setColor] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    const res = await fetch('/api/insane?tool=color');
    setColor(await res.json());
  };

  useEffect(() => { generate(); }, []);

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs font-medium text-white/40 uppercase tracking-wider">Zufällige Farbe</div>
        <motion.button 
          onClick={generate}
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          className="text-white/40 hover:text-white transition-colors"
        >
          ↻
        </motion.button>
      </div>
      {color && (
        <>
          <motion.div 
            layoutId="color-preview"
            className="w-full h-24 rounded-2xl mb-4 cursor-pointer hover:scale-[1.02] transition-transform"
            style={{ backgroundColor: color.hex, boxShadow: `0 10px 40px ${color.hex}40` }}
            onClick={() => copy(color.hex)}
          />
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => copy(color.hex)}
              className="bg-black/30 rounded-xl px-3 py-2 text-left font-mono text-sm text-white/60 hover:text-white hover:bg-black/50 transition-colors border border-white/5"
            >
              {color.hex}
            </button>
            <button 
              onClick={() => copy(color.rgb)}
              className="bg-black/30 rounded-xl px-3 py-2 text-left font-mono text-xs text-white/60 hover:text-white hover:bg-black/50 transition-colors border border-white/5 truncate"
            >
              {color.rgb}
            </button>
          </div>
          <AnimatePresence>
            {copied && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs text-emerald-400 text-center mt-2"
              >
                Kopiert ✓
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </Card>
  );
}

// MAIN DASHBOARD
export default function InsaneDashboard() {
  return (
    <motion.div 
      className="space-y-6"
      initial="initial"
      animate="animate"
      variants={stagger}
    >
      {/* Crypto Ticker */}
      <CryptoTicker />
      
      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FearGreedWidget />
        <QuoteWidget />
        <PasswordGenerator />
        <QRGenerator />
        <DiceRoller />
        <ColorPicker />
      </div>
    </motion.div>
  );
}
