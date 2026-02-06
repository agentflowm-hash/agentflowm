"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InsaneDashboard from "@/components/InsaneDashboard";
import { Link } from "@/i18n/routing";

// ═══════════════════════════════════════════════════════════════
//           🎨 API PLAYGROUND - Elegant Design
//           Matches AgentFlowM visual language
// ═══════════════════════════════════════════════════════════════

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'tools', label: 'Dev Tools', icon: '🔧' },
  { id: 'generator', label: 'Generatoren', icon: '✨' },
];

export default function PlaygroundPage() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  return (
    <div className="min-h-screen bg-[#030308]">
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full bg-gradient-to-b from-[#FC682C]/15 via-[#FFB347]/5 to-transparent blur-[120px]" />
          <div className="absolute top-1/4 right-0 w-[400px] h-[400px] rounded-full bg-[#627EEA]/10 blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-[#00FFA3]/10 blur-[80px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <Link href="/">
            <motion.div 
              className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-8"
              whileHover={{ x: -4 }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Zurück
            </motion.div>
          </Link>

          {/* Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/[0.05] border border-white/[0.1] backdrop-blur-xl mb-6"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span className="text-sm font-medium text-white/70">70+ APIs Live</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              API{" "}
              <span className="bg-gradient-to-r from-[#FC682C] via-[#FFB347] to-[#FC682C] bg-clip-text text-transparent">
                Playground
              </span>
            </h1>
            <p className="text-lg text-white/40 max-w-xl mx-auto">
              Teste alle unsere APIs live. Crypto, Tools, Generatoren – alles in Echtzeit.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {[
              { value: '70+', label: 'APIs', color: '#FC682C' },
              { value: '100%', label: 'Kostenlos', color: '#22C55E' },
              { value: '<100ms', label: 'Response', color: '#3B82F6' },
              { value: '∞', label: 'Requests', color: '#A855F7' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, y: -2 }}
                className="px-5 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl"
              >
                <div className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-xs text-white/40">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Tab Navigation */}
          <motion.div 
            className="flex justify-center mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="inline-flex p-1.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'text-white'
                      : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FC682C] to-[#FFB347] shadow-[0_0_20px_rgba(252,104,44,0.3)]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="relative pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'dashboard' && <InsaneDashboard />}
              {activeTab === 'tools' && <DevToolsSection />}
              {activeTab === 'generator' && <GeneratorSection />}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* API Reference */}
      <APIReference />
    </div>
  );
}

// DEV TOOLS SECTION
function DevToolsSection() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <HashGenerator />
        <Base64Tool />
        <SlugGenerator />
        <TextStatsWidget />
        <UUIDWidget />
        <TimestampWidget />
      </div>
    </div>
  );
}

// GENERATOR SECTION
function GeneratorSection() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetaTagGenerator />
        <LoremGenerator />
        <PlaceholderGenerator />
        <WifiQRGenerator />
        <RobotsGenerator />
        <CountryLookup />
      </div>
    </div>
  );
}

// TOOL COMPONENTS

function Card({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="rounded-[20px] p-6 bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-300">
      <div className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">{title}</div>
      {children}
    </div>
  );
}

function HashGenerator() {
  const [input, setInput] = useState('');
  const [hash, setHash] = useState('');

  const generate = async () => {
    if (!input) return;
    const res = await fetch(`/api/insane?tool=hash&text=${encodeURIComponent(input)}`);
    const data = await res.json();
    setHash(data.hash);
  };

  return (
    <Card title="SHA-256 Hash">
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Text eingeben..."
        className="w-full bg-black/30 border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#FC682C]/50 mb-3"
      />
      <button onClick={generate} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FC682C] to-[#FFB347] text-white font-medium mb-3">
        Generieren
      </button>
      {hash && (
        <div className="bg-black/30 rounded-xl p-3 text-xs font-mono text-emerald-400 break-all border border-white/5">
          {hash}
        </div>
      )}
    </Card>
  );
}

function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [action, setAction] = useState<'encode' | 'decode'>('encode');

  const convert = async () => {
    const res = await fetch(`/api/insane?tool=base64&action=${action}&text=${encodeURIComponent(input)}`);
    const data = await res.json();
    setOutput(data.result);
  };

  return (
    <Card title="Base64">
      <div className="flex gap-2 mb-3">
        {['encode', 'decode'].map((a) => (
          <button
            key={a}
            onClick={() => setAction(a as any)}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
              action === a ? 'bg-[#FC682C] text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'
            }`}
          >
            {a.charAt(0).toUpperCase() + a.slice(1)}
          </button>
        ))}
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Text..."
        className="w-full bg-black/30 border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#FC682C]/50 mb-3"
      />
      <button onClick={convert} className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium mb-3 border border-white/5">
        Konvertieren
      </button>
      {output && (
        <div className="bg-black/30 rounded-xl p-3 text-xs font-mono text-blue-400 break-all border border-white/5">
          {output}
        </div>
      )}
    </Card>
  );
}

function SlugGenerator() {
  const [input, setInput] = useState('');
  const [slug, setSlug] = useState('');

  const generate = async () => {
    if (!input) return;
    const res = await fetch(`/api/insane?tool=slug&text=${encodeURIComponent(input)}`);
    const data = await res.json();
    setSlug(data.slug);
  };

  return (
    <Card title="URL Slug">
      <input
        value={input}
        onChange={e => { setInput(e.target.value); generate(); }}
        placeholder="Titel eingeben..."
        className="w-full bg-black/30 border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#FC682C]/50 mb-3"
      />
      {slug && (
        <div className="bg-black/30 rounded-xl p-3 text-sm font-mono text-emerald-400 border border-white/5">
          /{slug}
        </div>
      )}
    </Card>
  );
}

function TextStatsWidget() {
  const [text, setText] = useState('');
  const [stats, setStats] = useState<any>(null);

  const analyze = async () => {
    if (!text) { setStats(null); return; }
    const res = await fetch(`/api/insane?tool=text-stats&text=${encodeURIComponent(text)}`);
    setStats(await res.json());
  };

  return (
    <Card title="Text Statistiken">
      <textarea
        value={text}
        onChange={e => { setText(e.target.value); analyze(); }}
        placeholder="Text eingeben..."
        rows={3}
        className="w-full bg-black/30 border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#FC682C]/50 resize-none mb-3"
      />
      {stats && (
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Zeichen', value: stats.characters },
            { label: 'Wörter', value: stats.words },
            { label: 'Sätze', value: stats.sentences },
            { label: 'Lesezeit', value: stats.readingTime },
          ].map((s, i) => (
            <div key={i} className="bg-black/30 rounded-lg p-2 border border-white/5">
              <div className="text-xs text-white/40">{s.label}</div>
              <div className="text-sm font-medium text-white">{s.value}</div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function UUIDWidget() {
  const [uuid, setUuid] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    const res = await fetch('/api/insane?tool=uuid');
    const data = await res.json();
    setUuid(data.v4);
  };

  const copy = () => {
    navigator.clipboard.writeText(uuid);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Card title="UUID Generator">
      <button onClick={generate} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FC682C] to-[#FFB347] text-white font-medium mb-3">
        Generieren
      </button>
      {uuid && (
        <div 
          onClick={copy}
          className="bg-black/30 rounded-xl p-3 text-xs font-mono text-blue-400 break-all border border-white/5 cursor-pointer hover:bg-black/50"
        >
          {uuid}
          <span className="block text-right text-white/30 text-[10px] mt-1">
            {copied ? 'Kopiert ✓' : 'Klick zum Kopieren'}
          </span>
        </div>
      )}
    </Card>
  );
}

function TimestampWidget() {
  const [result, setResult] = useState<any>(null);

  const load = async () => {
    const res = await fetch('/api/insane?tool=timestamp');
    setResult(await res.json());
  };

  return (
    <Card title="Unix Timestamp">
      <button onClick={load} className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium mb-3 border border-white/5">
        Jetzt anzeigen
      </button>
      {result && (
        <div className="space-y-2">
          {[
            { label: 'Unix', value: result.unix },
            { label: 'ISO', value: result.iso },
            { label: 'Lokal', value: result.local },
          ].map((r, i) => (
            <div key={i} className="flex justify-between bg-black/30 rounded-lg px-3 py-2 border border-white/5">
              <span className="text-xs text-white/40">{r.label}</span>
              <span className="text-xs font-mono text-white/80">{r.value}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function MetaTagGenerator() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [tags, setTags] = useState<any>(null);

  const generate = async () => {
    const res = await fetch(`/api/insane?tool=meta-tags&title=${encodeURIComponent(title)}&description=${encodeURIComponent(desc)}&url=https://example.com`);
    setTags(await res.json());
  };

  return (
    <Card title="Meta Tags">
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Titel..." className="w-full bg-black/30 border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none mb-2" />
      <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Beschreibung..." className="w-full bg-black/30 border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none mb-3" />
      <button onClick={generate} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FC682C] to-[#FFB347] text-white font-medium mb-3">Generieren</button>
      {tags && (
        <div className="bg-black/30 rounded-xl p-3 text-[10px] font-mono text-white/50 max-h-32 overflow-auto border border-white/5">
          {tags.basic?.map((t: string, i: number) => <div key={i}>{t}</div>)}
          {tags.openGraph?.map((t: string, i: number) => <div key={`og-${i}`}>{t}</div>)}
        </div>
      )}
    </Card>
  );
}

function LoremGenerator() {
  const [count, setCount] = useState(2);
  const [text, setText] = useState('');

  const generate = async () => {
    const res = await fetch(`/api/insane?tool=lorem&type=paragraphs&count=${count}`);
    const data = await res.json();
    setText(data.text);
  };

  return (
    <Card title="Lorem Ipsum">
      <div className="flex gap-2 items-center mb-3">
        <input type="number" value={count} onChange={e => setCount(parseInt(e.target.value) || 1)} min={1} max={10} className="w-16 bg-black/30 border border-white/5 rounded-lg px-3 py-2 text-sm text-white" />
        <span className="text-sm text-white/40">Absätze</span>
      </div>
      <button onClick={generate} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FC682C] to-[#FFB347] text-white font-medium mb-3">Generieren</button>
      {text && <div className="bg-black/30 rounded-xl p-3 text-xs text-white/50 max-h-32 overflow-auto border border-white/5">{text}</div>}
    </Card>
  );
}

function PlaceholderGenerator() {
  const [w, setW] = useState(400);
  const [h, setH] = useState(300);
  const [url, setUrl] = useState('');

  const generate = () => {
    setUrl(`https://placehold.co/${w}x${h}/1a1a2e/FC682C?text=AgentFlowM`);
  };

  return (
    <Card title="Placeholder Bild">
      <div className="flex gap-2 mb-3">
        <input type="number" value={w} onChange={e => setW(parseInt(e.target.value) || 100)} className="w-20 bg-black/30 border border-white/5 rounded-lg px-2 py-2 text-sm text-white" />
        <span className="text-white/30">×</span>
        <input type="number" value={h} onChange={e => setH(parseInt(e.target.value) || 100)} className="w-20 bg-black/30 border border-white/5 rounded-lg px-2 py-2 text-sm text-white" />
      </div>
      <button onClick={generate} className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium mb-3 border border-white/5">Generieren</button>
      {url && <img src={url} alt="Placeholder" className="w-full rounded-xl" />}
    </Card>
  );
}

function WifiQRGenerator() {
  const [ssid, setSsid] = useState('');
  const [pass, setPass] = useState('');
  const [qr, setQr] = useState('');

  const generate = async () => {
    if (!ssid) return;
    const res = await fetch(`/api/insane?tool=wifi-qr&ssid=${encodeURIComponent(ssid)}&password=${encodeURIComponent(pass)}`);
    const data = await res.json();
    setQr(data.url);
  };

  return (
    <Card title="WiFi QR Code">
      <input value={ssid} onChange={e => setSsid(e.target.value)} placeholder="WLAN Name..." className="w-full bg-black/30 border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none mb-2" />
      <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Passwort..." className="w-full bg-black/30 border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none mb-3" />
      <button onClick={generate} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FC682C] to-[#FFB347] text-white font-medium mb-3">QR erstellen</button>
      {qr && <div className="flex justify-center"><div className="bg-white rounded-2xl p-3"><img src={qr} alt="WiFi QR" className="w-32 h-32" /></div></div>}
    </Card>
  );
}

function RobotsGenerator() {
  const [robots, setRobots] = useState('');

  const generate = async () => {
    const res = await fetch('/api/insane?tool=robots&sitemap=https://example.com/sitemap.xml');
    const data = await res.json();
    setRobots(data.content);
  };

  return (
    <Card title="robots.txt">
      <button onClick={generate} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FC682C] to-[#FFB347] text-white font-medium mb-3">Generieren</button>
      {robots && <pre className="bg-black/30 rounded-xl p-3 text-xs font-mono text-emerald-400 whitespace-pre-wrap border border-white/5">{robots}</pre>}
    </Card>
  );
}

function CountryLookup() {
  const [code, setCode] = useState('DE');
  const [data, setData] = useState<any>(null);

  const lookup = async () => {
    const res = await fetch(`/api/insane?tool=country&code=${code}`);
    setData(await res.json());
  };

  return (
    <Card title="Land Info">
      <div className="flex gap-2 mb-3">
        <input value={code} onChange={e => setCode(e.target.value.toUpperCase())} maxLength={2} className="w-16 bg-black/30 border border-white/5 rounded-lg px-3 py-2 text-sm text-white uppercase text-center" />
        <button onClick={lookup} className="flex-1 py-2 rounded-lg bg-gradient-to-r from-[#FC682C] to-[#FFB347] text-white font-medium">Suchen</button>
      </div>
      {data && !data.error && (
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{data.flag}</span>
            <div>
              <div className="font-medium text-white">{data.name}</div>
              <div className="text-xs text-white/40">{data.official}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-black/30 rounded-lg p-2 border border-white/5">
              <div className="text-white/40">Hauptstadt</div>
              <div className="text-white">{data.capital}</div>
            </div>
            <div className="bg-black/30 rounded-lg p-2 border border-white/5">
              <div className="text-white/40">Einwohner</div>
              <div className="text-white">{(data.population / 1000000).toFixed(1)}M</div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

// API REFERENCE
function APIReference() {
  return (
    <section className="py-16 bg-gradient-to-b from-transparent to-black/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-white text-center mb-8">API Reference</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { endpoint: '/api/tools', tools: ['weather', 'geo', 'exchange', 'quote', 'qr', 'holidays'] },
            { endpoint: '/api/powertools', tools: ['screenshot', 'avatar', 'countdown', 'palette', 'stats'] },
            { endpoint: '/api/insane', tools: ['bitcoin', 'stock', 'joke', 'password', 'hash', 'uuid'] },
          ].map((api, i) => (
            <div key={i} className="rounded-2xl p-5 bg-white/[0.02] border border-white/[0.06]">
              <code className="text-sm text-[#FC682C] font-mono">{api.endpoint}</code>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {api.tools.map(t => (
                  <span key={t} className="px-2 py-1 rounded-lg bg-black/30 text-xs text-white/50 font-mono">
                    {t}
                  </span>
                ))}
                <span className="px-2 py-1 rounded-lg bg-white/5 text-xs text-white/30">+mehr</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
