"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import InsaneDashboard from "@/components/InsaneDashboard";
import {
  SystemStatusWidget,
  BusinessHoursWidget,
  StatsChartWidget,
  GermanQuoteWidget,
  EmailValidatorWidget,
  TechStackWidget,
} from "@/components/AdminWidgets";

// ═══════════════════════════════════════════════════════════════
//           🦁 API PLAYGROUND - THE BEAST PAGE
//           Live Demo aller 70+ APIs
// ═══════════════════════════════════════════════════════════════

export default function PlaygroundPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tools' | 'generator'>('dashboard');

  return (
    <div className="min-h-screen bg-[#030308] text-white">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-transparent to-purple-500/20" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-orange-500/10 rounded-full blur-[150px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <span className="text-2xl">🤯</span>
            <span className="text-sm font-medium">70+ Live APIs</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-6">
            <span className="bg-gradient-to-r from-orange-400 via-red-500 to-purple-500 bg-clip-text text-transparent">
              API Playground
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Alle unsere APIs live ausprobieren. Crypto, Wetter, Tools, 
            Generatoren und mehr – alles in Echtzeit.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/10">
              <div className="text-3xl font-bold text-orange-400">70+</div>
              <div className="text-sm text-gray-500">APIs</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/10">
              <div className="text-3xl font-bold text-green-400">100%</div>
              <div className="text-sm text-gray-500">Kostenlos</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/10">
              <div className="text-3xl font-bold text-blue-400">&lt;100ms</div>
              <div className="text-sm text-gray-500">Response</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/10">
              <div className="text-3xl font-bold text-purple-400">∞</div>
              <div className="text-sm text-gray-500">Requests</div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="inline-flex bg-white/5 backdrop-blur-sm rounded-xl p-1 border border-white/10">
            {[
              { id: 'dashboard', label: '🎛️ Dashboard', icon: '📊' },
              { id: 'tools', label: '🔧 Dev Tools', icon: '🛠️' },
              { id: 'generator', label: '🎨 Generatoren', icon: '✨' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        {activeTab === 'dashboard' && <InsaneDashboard />}
        {activeTab === 'tools' && <DevToolsSection />}
        {activeTab === 'generator' && <GeneratorSection />}
      </div>

      {/* API Reference */}
      <APIReference />
    </div>
  );
}

// DEV TOOLS SECTION
function DevToolsSection() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">🔧 Developer Tools</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SystemStatusWidget />
        <BusinessHoursWidget />
        <StatsChartWidget />
        <EmailValidatorWidget />
        <HashGenerator />
        <Base64Tool />
        <SlugGenerator />
        <TextStatsWidget />
      </div>
    </div>
  );
}

// GENERATOR SECTION
function GeneratorSection() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">🎨 Generatoren</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetaTagGenerator />
        <RobotsTxtGenerator />
        <LoremIpsumGenerator />
        <PlaceholderImageGenerator />
        <WifiQRGenerator />
        <TimestampConverter />
      </div>
    </div>
  );
}

// ADDITIONAL WIDGETS

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
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
      <h3 className="text-sm font-semibold mb-3">🔐 SHA-256 Hash</h3>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Text eingeben..."
        className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm mb-2"
      />
      <button onClick={generate} className="w-full bg-orange-500 hover:bg-orange-600 py-2 rounded-lg text-sm font-medium mb-2">
        Hash generieren
      </button>
      {hash && (
        <div className="bg-black/30 rounded-lg p-2 text-xs font-mono text-green-400 break-all">
          {hash}
        </div>
      )}
    </div>
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
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
      <h3 className="text-sm font-semibold mb-3">📦 Base64</h3>
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => setAction('encode')}
          className={`flex-1 py-1 rounded text-xs ${action === 'encode' ? 'bg-orange-500' : 'bg-white/10'}`}
        >
          Encode
        </button>
        <button
          onClick={() => setAction('decode')}
          className={`flex-1 py-1 rounded text-xs ${action === 'decode' ? 'bg-orange-500' : 'bg-white/10'}`}
        >
          Decode
        </button>
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Text eingeben..."
        className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm mb-2"
      />
      <button onClick={convert} className="w-full bg-white/10 hover:bg-white/20 py-2 rounded-lg text-sm font-medium mb-2">
        Konvertieren
      </button>
      {output && (
        <div className="bg-black/30 rounded-lg p-2 text-xs font-mono text-blue-400 break-all">
          {output}
        </div>
      )}
    </div>
  );
}

function SlugGenerator() {
  const [input, setInput] = useState('');
  const [slug, setSlug] = useState('');

  useEffect(() => {
    if (!input) { setSlug(''); return; }
    const timer = setTimeout(async () => {
      const res = await fetch(`/api/insane?tool=slug&text=${encodeURIComponent(input)}`);
      const data = await res.json();
      setSlug(data.slug);
    }, 300);
    return () => clearTimeout(timer);
  }, [input]);

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
      <h3 className="text-sm font-semibold mb-3">🔗 URL Slug Generator</h3>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Titel eingeben..."
        className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm mb-2"
      />
      {slug && (
        <div className="bg-black/30 rounded-lg p-2 text-sm font-mono text-green-400">
          /{slug}
        </div>
      )}
    </div>
  );
}

function TextStatsWidget() {
  const [text, setText] = useState('');
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (!text) { setStats(null); return; }
    const timer = setTimeout(async () => {
      const res = await fetch(`/api/insane?tool=text-stats&text=${encodeURIComponent(text)}`);
      setStats(await res.json());
    }, 300);
    return () => clearTimeout(timer);
  }, [text]);

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
      <h3 className="text-sm font-semibold mb-3">📝 Text Statistiken</h3>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Text eingeben..."
        rows={3}
        className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm mb-2 resize-none"
      />
      {stats && (
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-black/30 rounded p-2">
            <div className="text-gray-500">Zeichen</div>
            <div className="font-bold">{stats.characters}</div>
          </div>
          <div className="bg-black/30 rounded p-2">
            <div className="text-gray-500">Wörter</div>
            <div className="font-bold">{stats.words}</div>
          </div>
          <div className="bg-black/30 rounded p-2">
            <div className="text-gray-500">Sätze</div>
            <div className="font-bold">{stats.sentences}</div>
          </div>
          <div className="bg-black/30 rounded p-2">
            <div className="text-gray-500">Lesezeit</div>
            <div className="font-bold">{stats.readingTime}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function MetaTagGenerator() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<any>(null);

  const generate = async () => {
    const res = await fetch(`/api/insane?tool=meta-tags&title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&url=https://example.com`);
    setTags(await res.json());
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
      <h3 className="text-sm font-semibold mb-3">🏷️ Meta Tags Generator</h3>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Titel..."
        className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm mb-2"
      />
      <input
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Beschreibung..."
        className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm mb-2"
      />
      <button onClick={generate} className="w-full bg-orange-500 hover:bg-orange-600 py-2 rounded-lg text-sm font-medium mb-2">
        Generieren
      </button>
      {tags && (
        <div className="bg-black/30 rounded-lg p-2 text-xs font-mono text-gray-400 max-h-32 overflow-auto">
          {tags.basic?.map((tag: string, i: number) => <div key={i}>{tag}</div>)}
          {tags.openGraph?.map((tag: string, i: number) => <div key={i}>{tag}</div>)}
        </div>
      )}
    </div>
  );
}

function RobotsTxtGenerator() {
  const [sitemap, setSitemap] = useState('');
  const [robots, setRobots] = useState('');

  const generate = async () => {
    const res = await fetch(`/api/insane?tool=robots&sitemap=${encodeURIComponent(sitemap || 'https://example.com/sitemap.xml')}`);
    const data = await res.json();
    setRobots(data.content);
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
      <h3 className="text-sm font-semibold mb-3">🤖 robots.txt Generator</h3>
      <input
        value={sitemap}
        onChange={e => setSitemap(e.target.value)}
        placeholder="Sitemap URL..."
        className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm mb-2"
      />
      <button onClick={generate} className="w-full bg-orange-500 hover:bg-orange-600 py-2 rounded-lg text-sm font-medium mb-2">
        Generieren
      </button>
      {robots && (
        <pre className="bg-black/30 rounded-lg p-2 text-xs font-mono text-green-400 whitespace-pre-wrap">
          {robots}
        </pre>
      )}
    </div>
  );
}

function LoremIpsumGenerator() {
  const [count, setCount] = useState(3);
  const [text, setText] = useState('');

  const generate = async () => {
    const res = await fetch(`/api/insane?tool=lorem&type=paragraphs&count=${count}`);
    const data = await res.json();
    setText(data.text);
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
      <h3 className="text-sm font-semibold mb-3">📜 Lorem Ipsum</h3>
      <div className="flex gap-2 mb-2">
        <input
          type="number"
          value={count}
          onChange={e => setCount(parseInt(e.target.value) || 1)}
          min={1}
          max={10}
          className="w-20 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm"
        />
        <button onClick={generate} className="flex-1 bg-orange-500 hover:bg-orange-600 py-2 rounded-lg text-sm font-medium">
          Generieren
        </button>
      </div>
      {text && (
        <div className="bg-black/30 rounded-lg p-2 text-xs text-gray-400 max-h-32 overflow-auto">
          {text}
        </div>
      )}
    </div>
  );
}

function PlaceholderImageGenerator() {
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(300);
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    const timer = setTimeout(async () => {
      const res = await fetch(`/api/insane?tool=placeholder&width=${width}&height=${height}${text ? `&text=${encodeURIComponent(text)}` : ''}`);
      const data = await res.json();
      setUrl(data.url);
    }, 300);
    return () => clearTimeout(timer);
  }, [width, height, text]);

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
      <h3 className="text-sm font-semibold mb-3">🖼️ Placeholder Bild</h3>
      <div className="flex gap-2 mb-2">
        <input
          type="number"
          value={width}
          onChange={e => setWidth(parseInt(e.target.value) || 100)}
          placeholder="Breite"
          className="w-20 bg-black/30 border border-white/10 rounded-lg px-2 py-1 text-sm"
        />
        <span className="text-gray-500">×</span>
        <input
          type="number"
          value={height}
          onChange={e => setHeight(parseInt(e.target.value) || 100)}
          placeholder="Höhe"
          className="w-20 bg-black/30 border border-white/10 rounded-lg px-2 py-1 text-sm"
        />
      </div>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Text (optional)..."
        className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm mb-2"
      />
      {url && (
        <img src={url} alt="Placeholder" className="w-full rounded-lg" />
      )}
    </div>
  );
}

function WifiQRGenerator() {
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [qr, setQr] = useState('');

  const generate = async () => {
    if (!ssid) return;
    const res = await fetch(`/api/insane?tool=wifi-qr&ssid=${encodeURIComponent(ssid)}&password=${encodeURIComponent(password)}`);
    const data = await res.json();
    setQr(data.url);
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
      <h3 className="text-sm font-semibold mb-3">📶 WiFi QR Code</h3>
      <input
        value={ssid}
        onChange={e => setSsid(e.target.value)}
        placeholder="WLAN Name (SSID)..."
        className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm mb-2"
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Passwort..."
        className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm mb-2"
      />
      <button onClick={generate} className="w-full bg-orange-500 hover:bg-orange-600 py-2 rounded-lg text-sm font-medium mb-2">
        QR erstellen
      </button>
      {qr && (
        <div className="flex justify-center">
          <img src={qr} alt="WiFi QR" className="w-40 h-40 rounded-lg bg-white p-2" />
        </div>
      )}
    </div>
  );
}

function TimestampConverter() {
  const [timestamp, setTimestamp] = useState('');
  const [result, setResult] = useState<any>(null);

  const convert = async () => {
    const res = await fetch(`/api/insane?tool=timestamp${timestamp ? `&timestamp=${timestamp}` : ''}`);
    setResult(await res.json());
  };

  useEffect(() => { convert(); }, []);

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
      <h3 className="text-sm font-semibold mb-3">⏰ Unix Timestamp</h3>
      <div className="flex gap-2 mb-2">
        <input
          value={timestamp}
          onChange={e => setTimestamp(e.target.value)}
          placeholder="Unix (leer = jetzt)"
          className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm"
        />
        <button onClick={convert} className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg text-sm">
          →
        </button>
      </div>
      {result && (
        <div className="space-y-1 text-xs">
          <div className="flex justify-between bg-black/30 rounded px-2 py-1">
            <span className="text-gray-500">Unix</span>
            <span className="font-mono">{result.unix}</span>
          </div>
          <div className="flex justify-between bg-black/30 rounded px-2 py-1">
            <span className="text-gray-500">ISO</span>
            <span className="font-mono text-[10px]">{result.iso}</span>
          </div>
          <div className="flex justify-between bg-black/30 rounded px-2 py-1">
            <span className="text-gray-500">Lokal</span>
            <span className="font-mono">{result.local}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// API REFERENCE
function APIReference() {
  const apis = {
    '/api/tools': [
      'weather', 'geo', 'exchange', 'quote', 'qr', 'holidays', 'github', 'lorem'
    ],
    '/api/powertools': [
      'screenshot', 'validate-email', 'company-logo', 'avatar', 'placeholder',
      'random-user', 'fake-company', 'countdown', 'palette', 'stats',
      'share-links', 'tech-logo', 'file-icon', 'german-quote', 
      'system-status', 'business-hours', 'seo-preview'
    ],
    '/api/insane': [
      'bitcoin', 'stock', 'fear-greed', 'joke', 'fact', 'cat-fact',
      'dog', 'cat', 'kanye', 'chuck', 'uuid', 'password', 'hash',
      'base64', 'lorem', 'country', 'ip', 'timezone', 'pagespeed',
      'shorten', 'placeholder', 'unsplash', 'palette', 'holidays',
      'is-holiday', 'timestamp', 'text-stats', 'slug', 'validate-email',
      'validate-url', 'validate-card', 'validate-iban', 'dice', 'coin',
      'random', 'color', 'qr', 'wifi-qr', 'meta-tags', 'robots'
    ],
  };

  return (
    <div className="bg-gradient-to-b from-transparent to-black/50 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">
          📚 API Reference
        </h2>
        
        <div className="grid gap-6">
          {Object.entries(apis).map(([endpoint, tools]) => (
            <div key={endpoint} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-orange-400 mb-4 font-mono">{endpoint}</h3>
              <div className="flex flex-wrap gap-2">
                {tools.map(tool => (
                  <span 
                    key={tool}
                    className="px-3 py-1 bg-black/30 rounded-full text-xs font-mono text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
                  >
                    ?tool={tool}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-gray-500 mb-4">Alle APIs sind kostenlos und ohne Rate Limit nutzbar</p>
          <a 
            href="https://github.com/agentflowm-hash/agentflowm" 
            target="_blank"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
