'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════
//     🎯 KUNDEN PORTAL TOOLS - Nützliche Features für Kunden
// ═══════════════════════════════════════════════════════════════

export default function PortalToolsSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-white flex items-center gap-2">
        <span className="text-xl">🧰</span>
        Ihre Tools
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BrandColorPicker />
        <QRCodeGenerator />
        <QuoteGenerator />
        <PasswordGenerator />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                      TOOL COMPONENTS
// ═══════════════════════════════════════════════════════════════

function Card({ children, title, description }: { children: React.ReactNode; title: string; description?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-5 bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.1] backdrop-blur-xl"
    >
      <h3 className="text-sm font-semibold text-white mb-1">{title}</h3>
      {description && <p className="text-xs text-white/40 mb-4">{description}</p>}
      {children}
    </motion.div>
  );
}

// 1. BRAND COLOR PICKER - Für Markenfarben
export function BrandColorPicker() {
  const [color, setColor] = useState<any>(null);
  const [customColor, setCustomColor] = useState('#FC682C');
  const [palette, setPalette] = useState<any>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const generateRandom = async () => {
    const res = await fetch('/api/insane?tool=color');
    const data = await res.json();
    setColor(data);
    setCustomColor(data.hex);
    // Generate palette based on this color
    const paletteRes = await fetch(`/api/powertools?tool=palette&baseColor=${encodeURIComponent(data.hex.replace('#', ''))}`);
    setPalette(await paletteRes.json());
  };

  const generateFromColor = async () => {
    const paletteRes = await fetch(`/api/powertools?tool=palette&baseColor=${encodeURIComponent(customColor.replace('#', ''))}`);
    setPalette(await paletteRes.json());
  };

  useEffect(() => { generateRandom(); }, []);

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopied(hex);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <Card title="🎨 Markenfarben" description="Finden Sie die perfekte Farbpalette für Ihr Projekt">
      <div className="flex gap-2 mb-4">
        <input
          type="color"
          value={customColor}
          onChange={e => setCustomColor(e.target.value)}
          className="w-12 h-10 rounded-lg cursor-pointer bg-transparent border-0"
        />
        <input
          type="text"
          value={customColor}
          onChange={e => setCustomColor(e.target.value)}
          className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono"
        />
        <button 
          onClick={generateFromColor}
          className="px-4 rounded-lg bg-[#FC682C] text-white text-sm font-medium"
        >
          Palette
        </button>
      </div>

      {palette?.colors && (
        <div className="space-y-2">
          <div className="flex rounded-xl overflow-hidden">
            {palette.colors.map((c: string, i: number) => (
              <motion.div
                key={i}
                onClick={() => copyColor(c)}
                whileHover={{ scale: 1.1, zIndex: 10 }}
                className="flex-1 h-12 cursor-pointer relative group"
                style={{ backgroundColor: c }}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
                  <span className="text-xs text-white font-mono">
                    {copied === c ? '✓' : c}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-xs text-white/30 text-center">Klicken zum Kopieren</p>
        </div>
      )}

      <button 
        onClick={generateRandom}
        className="w-full mt-3 py-2 rounded-lg bg-white/5 text-white/50 text-xs hover:bg-white/10 transition-colors"
      >
        🎲 Zufällige Farbe
      </button>
    </Card>
  );
}

// 2. QR CODE GENERATOR - Für Visitenkarten, Flyer etc.
export function QRCodeGenerator() {
  const [text, setText] = useState('');
  const [qr, setQr] = useState<string>('');
  const [type, setType] = useState<'url' | 'text' | 'wifi'>('url');
  const [wifiData, setWifiData] = useState({ ssid: '', password: '' });

  const generate = useCallback(async () => {
    let content = text;
    if (type === 'wifi') {
      content = `WIFI:T:WPA;S:${wifiData.ssid};P:${wifiData.password};;`;
    }
    if (!content) return;
    
    const res = await fetch(`/api/insane?tool=qr&text=${encodeURIComponent(content)}&size=200`);
    const data = await res.json();
    setQr(data.url);
  }, [text, type, wifiData]);

  useEffect(() => {
    const timer = setTimeout(generate, 500);
    return () => clearTimeout(timer);
  }, [generate]);

  return (
    <Card title="📱 QR-Code Generator" description="Für Visitenkarten, Flyer und Marketing">
      <div className="flex gap-1 mb-3">
        {[
          { id: 'url', label: 'Website' },
          { id: 'text', label: 'Text' },
          { id: 'wifi', label: 'WLAN' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setType(t.id as any)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              type === t.id ? 'bg-[#FC682C] text-white' : 'bg-white/5 text-white/50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {type === 'wifi' ? (
        <div className="space-y-2 mb-3">
          <input
            type="text"
            value={wifiData.ssid}
            onChange={e => setWifiData(d => ({ ...d, ssid: e.target.value }))}
            placeholder="WLAN-Name..."
            className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30"
          />
          <input
            type="password"
            value={wifiData.password}
            onChange={e => setWifiData(d => ({ ...d, password: e.target.value }))}
            placeholder="Passwort..."
            className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30"
          />
        </div>
      ) : (
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={type === 'url' ? 'https://ihre-website.de' : 'Ihr Text...'}
          className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 mb-3"
        />
      )}

      {qr && (
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center"
        >
          <div className="bg-white rounded-2xl p-3 shadow-lg shadow-[#FC682C]/20">
            <img src={qr} alt="QR Code" className="w-36 h-36" />
          </div>
          <a 
            href={qr} 
            download="qr-code.png"
            className="mt-3 text-xs text-[#FC682C] hover:underline"
          >
            ⬇️ Herunterladen
          </a>
        </motion.div>
      )}
    </Card>
  );
}

// 3. QUOTE GENERATOR - Inspiration für Marketing-Texte
export function QuoteGenerator() {
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/powertools?tool=german-quote');
    setQuote(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const copy = () => {
    navigator.clipboard.writeText(`"${quote?.quote}" - ${quote?.author}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Card title="💡 Inspiration" description="Zitate für Ihre Marketing-Materialien">
      <AnimatePresence mode="wait">
        {quote && (
          <motion.div
            key={quote.quote}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4"
          >
            <blockquote className="text-sm text-white/80 italic leading-relaxed mb-2">
              „{quote.quote}"
            </blockquote>
            <cite className="text-xs text-[#FC682C]">— {quote.author}</cite>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-2">
        <button 
          onClick={copy}
          disabled={!quote}
          className="flex-1 py-2 rounded-lg bg-white/5 text-white/60 text-xs hover:bg-white/10 disabled:opacity-50"
        >
          {copied ? '✓ Kopiert' : '📋 Kopieren'}
        </button>
        <button 
          onClick={load}
          disabled={loading}
          className="flex-1 py-2 rounded-lg bg-[#FC682C]/20 text-[#FC682C] text-xs hover:bg-[#FC682C]/30"
        >
          {loading ? '...' : '🔄 Neues Zitat'}
        </button>
      </div>
    </Card>
  );
}

// 4. PASSWORD GENERATOR - Für sichere Konten
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
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Card title="🔐 Passwort Generator" description="Sichere Passwörter für Ihre Konten">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs text-white/40">Länge:</span>
        <input
          type="range"
          min="8"
          max="32"
          value={length}
          onChange={e => setLength(parseInt(e.target.value))}
          className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#FC682C]"
        />
        <span className="text-sm font-mono text-white w-6">{length}</span>
      </div>

      <div className="flex gap-2 mb-3">
        <div className="flex-1 bg-black/30 rounded-lg px-3 py-3 font-mono text-sm text-emerald-400 truncate border border-white/5">
          {password?.password || '...'}
        </div>
        <motion.button
          onClick={copy}
          whileTap={{ scale: 0.95 }}
          className="px-4 rounded-lg bg-[#FC682C] text-white text-sm font-medium"
        >
          {copied ? '✓' : '📋'}
        </motion.button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`h-1.5 w-16 rounded-full ${
            password?.strength === 'sehr stark' ? 'bg-emerald-500' :
            password?.strength === 'stark' ? 'bg-yellow-500' : 'bg-orange-500'
          }`} />
          <span className="text-xs text-white/40">{password?.strength}</span>
        </div>
        <button 
          onClick={generate}
          className="text-xs text-white/40 hover:text-white"
        >
          🔄 Neu
        </button>
      </div>
    </Card>
  );
}

// Widgets sind bereits als named exports definiert
