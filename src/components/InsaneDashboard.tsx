'use client';

import { useEffect, useState } from 'react';

// ═══════════════════════════════════════════════════════════════
//           🤯 GEISTESKRANK DASHBOARD
//           Live data widgets mit 50+ APIs
// ═══════════════════════════════════════════════════════════════

// CRYPTO TICKER
export function CryptoTicker() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const load = () => fetch('/api/insane?tool=bitcoin').then(r => r.json()).then(setData);
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return <TickerSkeleton />;

  const coins = [
    { name: 'BTC', data: data.bitcoin, icon: '₿' },
    { name: 'ETH', data: data.ethereum, icon: 'Ξ' },
    { name: 'SOL', data: data.solana, icon: '◎' },
  ];

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {coins.map(coin => (
        <div key={coin.name} className="flex-shrink-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 min-w-[160px]">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{coin.icon}</span>
            <span className="text-sm font-bold text-white">{coin.name}</span>
          </div>
          <div className="text-xl font-bold text-white">
            €{coin.data?.eur?.toLocaleString('de-DE')}
          </div>
          <div className={`text-sm ${coin.data?.eur_24h_change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {coin.data?.eur_24h_change >= 0 ? '↑' : '↓'} {Math.abs(coin.data?.eur_24h_change || 0).toFixed(2)}%
          </div>
        </div>
      ))}
    </div>
  );
}

// FEAR & GREED INDEX
export function FearGreedWidget() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/insane?tool=fear-greed').then(r => r.json()).then(setData);
  }, []);

  if (!data) return <WidgetSkeleton />;

  const getColor = (value: number) => {
    if (value < 25) return 'from-red-500 to-red-600';
    if (value < 45) return 'from-orange-500 to-orange-600';
    if (value < 55) return 'from-yellow-500 to-yellow-600';
    if (value < 75) return 'from-green-400 to-green-500';
    return 'from-green-500 to-emerald-500';
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
      <h3 className="text-sm text-gray-400 mb-3">Crypto Fear & Greed</h3>
      <div className="flex items-center gap-4">
        <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${getColor(data.value)} flex items-center justify-center`}>
          <span className="text-3xl">{data.emoji}</span>
        </div>
        <div>
          <div className="text-4xl font-bold text-white">{data.value}</div>
          <div className="text-sm text-gray-400">{data.label}</div>
        </div>
      </div>
      <div className="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r ${getColor(data.value)} transition-all duration-1000`}
          style={{ width: `${data.value}%` }}
        />
      </div>
    </div>
  );
}

// STOCK TICKER
export function StockWidget({ symbol = 'AAPL' }: { symbol?: string }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/insane?tool=stock&symbol=${symbol}`).then(r => r.json()).then(setData);
  }, [symbol]);

  if (!data || data.error) return <WidgetSkeleton />;

  const isUp = parseFloat(data.change) >= 0;

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
      <div className="flex items-center justify-between mb-2">
        <span className="text-lg font-bold text-white">{data.symbol}</span>
        <span className="text-xs text-gray-500">{data.exchange}</span>
      </div>
      <div className="text-2xl font-bold text-white">
        {data.currency === 'USD' ? '$' : '€'}{data.price?.toFixed(2)}
      </div>
      <div className={`text-sm ${isUp ? 'text-green-400' : 'text-red-400'}`}>
        {isUp ? '↑' : '↓'} {data.change}%
      </div>
    </div>
  );
}

// JOKE OF THE DAY
export function JokeWidget() {
  const [joke, setJoke] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const loadJoke = async () => {
    setLoading(true);
    const res = await fetch('/api/insane?tool=joke&lang=de');
    const data = await res.json();
    setJoke(data);
    setLoading(false);
  };

  useEffect(() => { loadJoke(); }, []);

  return (
    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">😂 Witz des Tages</h3>
        <button 
          onClick={loadJoke} 
          disabled={loading}
          className="text-xs text-orange-400 hover:text-orange-300"
        >
          {loading ? '...' : '🔄 Neu'}
        </button>
      </div>
      <p className="text-sm text-gray-300">{joke?.joke || '...'}</p>
    </div>
  );
}

// RANDOM FACT
export function FactWidget() {
  const [fact, setFact] = useState<any>(null);

  const loadFact = async () => {
    const res = await fetch('/api/insane?tool=fact');
    setFact(await res.json());
  };

  useEffect(() => { loadFact(); }, []);

  return (
    <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">💡 Random Fact</h3>
        <button onClick={loadFact} className="text-xs text-orange-400 hover:text-orange-300">🔄</button>
      </div>
      <p className="text-sm text-gray-300">{fact?.fact || '...'}</p>
    </div>
  );
}

// PASSWORD GENERATOR
export function PasswordGenerator() {
  const [password, setPassword] = useState<any>(null);
  const [length, setLength] = useState(16);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    const res = await fetch(`/api/insane?tool=password&length=${length}`);
    setPassword(await res.json());
  };

  useEffect(() => { generate(); }, [length]);

  const copy = () => {
    navigator.clipboard.writeText(password?.password || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
      <h3 className="text-sm font-semibold text-white mb-3">🔐 Passwort Generator</h3>
      <div className="flex gap-2 mb-3">
        <input
          type="range"
          min="8"
          max="32"
          value={length}
          onChange={e => setLength(parseInt(e.target.value))}
          className="flex-1"
        />
        <span className="text-sm text-gray-400 w-8">{length}</span>
      </div>
      <div className="flex gap-2">
        <div className="flex-1 bg-black/30 rounded-lg px-3 py-2 font-mono text-sm text-green-400 truncate">
          {password?.password || '...'}
        </div>
        <button
          onClick={copy}
          className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg text-sm"
        >
          {copied ? '✓' : '📋'}
        </button>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        Stärke: <span className={password?.strength === 'sehr stark' ? 'text-green-400' : 'text-yellow-400'}>{password?.strength}</span>
      </div>
    </div>
  );
}

// UUID GENERATOR
export function UUIDGenerator() {
  const [uuid, setUuid] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    const res = await fetch('/api/insane?tool=uuid');
    const data = await res.json();
    setUuid(data.v4);
  };

  useEffect(() => { generate(); }, []);

  const copy = () => {
    navigator.clipboard.writeText(uuid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">🆔 UUID Generator</h3>
        <button onClick={generate} className="text-xs text-orange-400 hover:text-orange-300">🔄 Neu</button>
      </div>
      <div className="flex gap-2">
        <div className="flex-1 bg-black/30 rounded-lg px-3 py-2 font-mono text-xs text-blue-400 truncate">
          {uuid}
        </div>
        <button onClick={copy} className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-sm">
          {copied ? '✓' : '📋'}
        </button>
      </div>
    </div>
  );
}

// QR CODE GENERATOR
export function QRGenerator() {
  const [text, setText] = useState('https://agentflowm.com');
  const [qr, setQr] = useState<string>('');

  useEffect(() => {
    const timer = setTimeout(() => {
      fetch(`/api/insane?tool=qr&text=${encodeURIComponent(text)}&size=200`)
        .then(r => r.json())
        .then(data => setQr(data.url));
    }, 500);
    return () => clearTimeout(timer);
  }, [text]);

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
      <h3 className="text-sm font-semibold text-white mb-3">📱 QR Code Generator</h3>
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="URL oder Text..."
        className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 mb-3"
      />
      {qr && (
        <div className="flex justify-center">
          <img src={qr} alt="QR Code" className="w-40 h-40 rounded-lg bg-white p-2" />
        </div>
      )}
    </div>
  );
}

// DICE ROLLER
export function DiceRoller() {
  const [result, setResult] = useState<any>(null);
  const [rolling, setRolling] = useState(false);

  const roll = async () => {
    setRolling(true);
    const res = await fetch('/api/insane?tool=dice&sides=6&count=2');
    const data = await res.json();
    setTimeout(() => {
      setResult(data);
      setRolling(false);
    }, 500);
  };

  return (
    <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
      <h3 className="text-sm font-semibold text-white mb-3">🎲 Würfel</h3>
      <div className="flex items-center justify-center gap-4 mb-3">
        {result?.rolls?.map((roll: number, i: number) => (
          <div 
            key={i} 
            className={`w-16 h-16 bg-white rounded-xl flex items-center justify-center text-3xl font-bold text-gray-900 shadow-lg ${rolling ? 'animate-bounce' : ''}`}
          >
            {['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][roll - 1]}
          </div>
        )) || (
          <div className="text-gray-500">Klicke zum Würfeln</div>
        )}
      </div>
      {result && !rolling && (
        <div className="text-center text-lg font-bold text-white mb-2">
          Summe: {result.total}
        </div>
      )}
      <button
        onClick={roll}
        disabled={rolling}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white py-2 rounded-lg font-medium transition-colors"
      >
        {rolling ? '🎲 Würfelt...' : '🎲 Würfeln!'}
      </button>
    </div>
  );
}

// COIN FLIP
export function CoinFlipper() {
  const [result, setResult] = useState<string | null>(null);
  const [flipping, setFlipping] = useState(false);

  const flip = async () => {
    setFlipping(true);
    const res = await fetch('/api/insane?tool=coin');
    const data = await res.json();
    setTimeout(() => {
      setResult(data.flips[0]);
      setFlipping(false);
    }, 800);
  };

  return (
    <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
      <h3 className="text-sm font-semibold text-white mb-3">🪙 Münzwurf</h3>
      <div className="flex justify-center mb-3">
        <div className={`w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-3xl shadow-lg ${flipping ? 'animate-spin' : ''}`}>
          {result === 'Kopf' ? '👑' : result === 'Zahl' ? '💰' : '🪙'}
        </div>
      </div>
      {result && !flipping && (
        <div className="text-center text-xl font-bold text-white mb-2">{result}</div>
      )}
      <button
        onClick={flip}
        disabled={flipping}
        className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-500/50 text-black py-2 rounded-lg font-medium transition-colors"
      >
        {flipping ? '🪙 Fliegt...' : '🪙 Werfen!'}
      </button>
    </div>
  );
}

// RANDOM COLOR PICKER
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
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">🎨 Zufällige Farbe</h3>
        <button onClick={generate} className="text-xs text-orange-400 hover:text-orange-300">🔄 Neu</button>
      </div>
      {color && (
        <>
          <div 
            className="w-full h-24 rounded-lg mb-3 cursor-pointer hover:opacity-90 transition-opacity"
            style={{ backgroundColor: color.hex }}
            onClick={() => copy(color.hex)}
          />
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button onClick={() => copy(color.hex)} className="bg-black/30 rounded px-2 py-1 text-left font-mono text-gray-300 hover:bg-black/50">
              {color.hex}
            </button>
            <button onClick={() => copy(color.rgb)} className="bg-black/30 rounded px-2 py-1 text-left font-mono text-gray-300 hover:bg-black/50 truncate">
              {color.rgb}
            </button>
          </div>
          {copied && <div className="text-xs text-green-400 mt-2 text-center">Kopiert! ✓</div>}
        </>
      )}
    </div>
  );
}

// PAGE SPEED CHECKER
export function PageSpeedChecker() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const check = async () => {
    if (!url) return;
    setLoading(true);
    const res = await fetch(`/api/insane?tool=pagespeed&url=${encodeURIComponent(url)}`);
    setResult(await res.json());
    setLoading(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400 border-green-400';
    if (score >= 50) return 'text-yellow-400 border-yellow-400';
    return 'text-red-400 border-red-400';
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
      <h3 className="text-sm font-semibold text-white mb-3">⚡ PageSpeed Check</h3>
      <div className="flex gap-2 mb-3">
        <input
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500"
        />
        <button
          onClick={check}
          disabled={loading || !url}
          className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm"
        >
          {loading ? '...' : '🔍'}
        </button>
      </div>
      {result && (
        <div className="space-y-3">
          <div className="flex items-center justify-center">
            <div className={`w-20 h-20 rounded-full border-4 ${getScoreColor(result.score)} flex items-center justify-center`}>
              <span className={`text-2xl font-bold ${getScoreColor(result.score)}`}>{result.score}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-black/30 rounded p-2">
              <div className="text-gray-500">FCP</div>
              <div className="text-white">{result.fcp}</div>
            </div>
            <div className="bg-black/30 rounded p-2">
              <div className="text-gray-500">LCP</div>
              <div className="text-white">{result.lcp}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// CUTE ANIMALS
export function CuteAnimals() {
  const [image, setImage] = useState<string>('');
  const [type, setType] = useState<'dog' | 'cat'>('dog');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetch(`/api/insane?tool=${type}`);
    const data = await res.json();
    setImage(data.image);
    setLoading(false);
  };

  useEffect(() => { load(); }, [type]);

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">🐾 Süße Tiere</h3>
        <div className="flex gap-1">
          <button
            onClick={() => setType('dog')}
            className={`px-2 py-1 rounded text-xs ${type === 'dog' ? 'bg-orange-500 text-white' : 'bg-white/10 text-gray-400'}`}
          >
            🐕
          </button>
          <button
            onClick={() => setType('cat')}
            className={`px-2 py-1 rounded text-xs ${type === 'cat' ? 'bg-orange-500 text-white' : 'bg-white/10 text-gray-400'}`}
          >
            🐈
          </button>
        </div>
      </div>
      <div className="aspect-square rounded-lg overflow-hidden bg-black/30 mb-2">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <img src={image} alt="Cute animal" className="w-full h-full object-cover" />
        )}
      </div>
      <button
        onClick={load}
        disabled={loading}
        className="w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg text-sm"
      >
        🔄 Nächstes Bild
      </button>
    </div>
  );
}

// SKELETONS
function WidgetSkeleton() {
  return <div className="bg-white/5 rounded-xl p-4 h-32 animate-pulse" />;
}

function TickerSkeleton() {
  return <div className="flex gap-4">{[1,2,3].map(i => <div key={i} className="bg-white/5 rounded-xl w-40 h-24 animate-pulse" />)}</div>;
}

// FULL INSANE DASHBOARD
export default function InsaneDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        🤯 Geisteskrank Dashboard
        <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full">50+ APIs</span>
      </h1>
      
      {/* Crypto Ticker */}
      <CryptoTicker />
      
      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <FearGreedWidget />
        <StockWidget symbol="TSLA" />
        <StockWidget symbol="NVDA" />
        <JokeWidget />
        <FactWidget />
        <PasswordGenerator />
        <UUIDGenerator />
        <QRGenerator />
        <DiceRoller />
        <CoinFlipper />
        <ColorPicker />
        <CuteAnimals />
        <PageSpeedChecker />
      </div>
    </div>
  );
}
