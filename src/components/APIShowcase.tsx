'use client';

import { useEffect, useState } from 'react';

interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  windSpeed: number;
}

interface QuoteData {
  quote: string;
  author: string;
}

interface ExchangeData {
  base: string;
  rates: Record<string, number>;
}

export default function APIShowcase() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [exchange, setExchange] = useState<ExchangeData | null>(null);
  const [qrCode, setQrCode] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Parallel API calls
        const [weatherRes, quoteRes, exchangeRes, qrRes] = await Promise.all([
          fetch('/api/tools?tool=weather&city=Berlin'),
          fetch('/api/tools?tool=quote'),
          fetch('/api/tools?tool=exchange&base=EUR'),
          fetch('/api/tools?tool=qr&text=https://agentflowm.com&size=150'),
        ]);

        const [weatherData, quoteData, exchangeData, qrData] = await Promise.all([
          weatherRes.json(),
          quoteRes.json(),
          exchangeRes.json(),
          qrRes.json(),
        ]);

        setWeather(weatherData);
        setQuote(quoteData);
        setExchange(exchangeData);
        setQrCode(qrData.url);
      } catch (err) {
        console.error('API load error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white/5 rounded-xl h-32" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Wetter */}
      {weather && (
        <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="text-xs text-gray-400 mb-1">📍 {weather.city}</div>
          <div className="text-3xl font-bold">{weather.temperature}°C</div>
          <div className="text-sm text-gray-300">{weather.condition}</div>
          <div className="text-xs text-gray-500 mt-1">💨 {weather.windSpeed} km/h</div>
        </div>
      )}

      {/* Zitat */}
      {quote && (
        <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="text-xs text-gray-400 mb-1">💡 Inspiration</div>
          <div className="text-sm italic line-clamp-3">"{quote.quote}"</div>
          <div className="text-xs text-gray-500 mt-2">— {quote.author}</div>
        </div>
      )}

      {/* Währung */}
      {exchange && (
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="text-xs text-gray-400 mb-1">💱 EUR Kurse</div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>USD</span>
              <span className="font-mono">{exchange.rates.USD?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>GBP</span>
              <span className="font-mono">{exchange.rates.GBP?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>CHF</span>
              <span className="font-mono">{exchange.rates.CHF?.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* QR Code */}
      {qrCode && (
        <div className="bg-gradient-to-br from-pink-500/20 to-violet-500/20 backdrop-blur-sm rounded-xl p-4 border border-white/10 flex flex-col items-center justify-center">
          <div className="text-xs text-gray-400 mb-2">📱 Scan mich</div>
          <img 
            src={qrCode} 
            alt="QR Code zu AgentFlowM" 
            className="w-20 h-20 rounded-lg bg-white p-1"
          />
        </div>
      )}
    </div>
  );
}
