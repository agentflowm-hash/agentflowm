import { NextRequest, NextResponse } from 'next/server';

// ═══════════════════════════════════════════════════════════════
//                    MULTI-TOOL API ENDPOINT
//                    Kostenlose APIs kombiniert
// ═══════════════════════════════════════════════════════════════

// 1. WETTER (Open-Meteo - Kostenlos, kein API Key)
async function getWeather(city: string = 'Berlin') {
  const cities: Record<string, { lat: number; lon: number }> = {
    'berlin': { lat: 52.52, lon: 13.405 },
    'munich': { lat: 48.137, lon: 11.576 },
    'hamburg': { lat: 53.551, lon: 9.993 },
    'frankfurt': { lat: 50.110, lon: 8.682 },
    'cologne': { lat: 50.937, lon: 6.960 },
    'düsseldorf': { lat: 51.227, lon: 6.773 },
    'stuttgart': { lat: 48.775, lon: 9.182 },
    'vienna': { lat: 48.208, lon: 16.373 },
    'zurich': { lat: 47.376, lon: 8.541 },
  };

  const coords = cities[city.toLowerCase()] || cities['berlin'];
  
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,weathercode,windspeed_10m&timezone=Europe/Berlin`
  );
  
  const data = await res.json();
  
  const weatherCodes: Record<number, string> = {
    0: '☀️ Klar',
    1: '🌤️ Überwiegend klar',
    2: '⛅ Teilweise bewölkt',
    3: '☁️ Bewölkt',
    45: '🌫️ Nebel',
    48: '🌫️ Nebel mit Reif',
    51: '🌧️ Leichter Nieselregen',
    61: '🌧️ Leichter Regen',
    63: '🌧️ Mäßiger Regen',
    65: '🌧️ Starker Regen',
    71: '🌨️ Leichter Schneefall',
    73: '🌨️ Mäßiger Schneefall',
    80: '🌦️ Regenschauer',
    95: '⛈️ Gewitter',
  };

  return {
    city: city.charAt(0).toUpperCase() + city.slice(1),
    temperature: Math.round(data.current.temperature_2m),
    condition: weatherCodes[data.current.weathercode] || '🌡️ Unbekannt',
    windSpeed: Math.round(data.current.windspeed_10m),
    unit: '°C',
  };
}

// 2. IP GEOLOCATION (ip-api.com - Kostenlos)
async function getGeoFromIP(ip: string) {
  if (ip === 'unknown' || ip === '127.0.0.1' || ip.startsWith('192.168')) {
    return { city: 'Berlin', country: 'Germany', countryCode: 'DE' };
  }
  
  const res = await fetch(`http://ip-api.com/json/${ip}?fields=city,country,countryCode`);
  return await res.json();
}

// 3. WÄHRUNGSKURSE (Exchange Rate API - Kostenlos)
async function getExchangeRates(base: string = 'EUR') {
  const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${base}`);
  const data = await res.json();
  
  return {
    base,
    date: data.date,
    rates: {
      USD: data.rates.USD,
      GBP: data.rates.GBP,
      CHF: data.rates.CHF,
      PLN: data.rates.PLN,
      CZK: data.rates.CZK,
    }
  };
}

// 4. MOTIVATIONS-ZITAT (Quotable API - Kostenlos)
async function getQuote() {
  const res = await fetch('https://api.quotable.io/random?tags=technology|business|success');
  const data = await res.json();
  
  return {
    quote: data.content,
    author: data.author,
  };
}

// 5. QR-CODE GENERATOR (QRServer - Kostenlos)
function generateQRCode(text: string, size: number = 200) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`;
}

// 6. DEUTSCHE FEIERTAGE (Nager.Date - Kostenlos)
async function getGermanHolidays(year: number = new Date().getFullYear()) {
  const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/DE`);
  const data = await res.json();
  
  return data.slice(0, 10).map((h: any) => ({
    date: h.date,
    name: h.localName,
    nationwide: h.counties === null,
  }));
}

// 7. GITHUB STATS (GitHub API - Kostenlos)
async function getGitHubStats(username: string = 'agentflowm-hash') {
  const res = await fetch(`https://api.github.com/users/${username}`);
  const data = await res.json();
  
  return {
    username: data.login,
    repos: data.public_repos,
    followers: data.followers,
    avatar: data.avatar_url,
  };
}

// 8. LOREM IPSUM GENERATOR (für Mockups)
function generateLoremIpsum(paragraphs: number = 1) {
  const lorem = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  ];
  
  return lorem.slice(0, paragraphs).join('\n\n');
}

// ═══════════════════════════════════════════════════════════════
//                    API ROUTE HANDLER
// ═══════════════════════════════════════════════════════════════

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tool = searchParams.get('tool');
  
  try {
    switch (tool) {
      case 'weather': {
        const city = searchParams.get('city') || 'Berlin';
        const data = await getWeather(city);
        return NextResponse.json(data);
      }
      
      case 'geo': {
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
        const data = await getGeoFromIP(ip);
        return NextResponse.json(data);
      }
      
      case 'exchange': {
        const base = searchParams.get('base') || 'EUR';
        const data = await getExchangeRates(base);
        return NextResponse.json(data);
      }
      
      case 'quote': {
        const data = await getQuote();
        return NextResponse.json(data);
      }
      
      case 'qr': {
        const text = searchParams.get('text') || 'https://agentflowm.com';
        const size = parseInt(searchParams.get('size') || '200');
        return NextResponse.json({ url: generateQRCode(text, size) });
      }
      
      case 'holidays': {
        const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()));
        const data = await getGermanHolidays(year);
        return NextResponse.json(data);
      }
      
      case 'github': {
        const username = searchParams.get('username') || 'agentflowm-hash';
        const data = await getGitHubStats(username);
        return NextResponse.json(data);
      }
      
      case 'lorem': {
        const paragraphs = parseInt(searchParams.get('paragraphs') || '1');
        return NextResponse.json({ text: generateLoremIpsum(paragraphs) });
      }
      
      default:
        return NextResponse.json({
          available_tools: [
            { tool: 'weather', params: 'city', example: '/api/tools?tool=weather&city=Berlin' },
            { tool: 'geo', params: 'none (uses IP)', example: '/api/tools?tool=geo' },
            { tool: 'exchange', params: 'base', example: '/api/tools?tool=exchange&base=EUR' },
            { tool: 'quote', params: 'none', example: '/api/tools?tool=quote' },
            { tool: 'qr', params: 'text, size', example: '/api/tools?tool=qr&text=https://agentflowm.com&size=300' },
            { tool: 'holidays', params: 'year', example: '/api/tools?tool=holidays&year=2026' },
            { tool: 'github', params: 'username', example: '/api/tools?tool=github&username=vercel' },
            { tool: 'lorem', params: 'paragraphs', example: '/api/tools?tool=lorem&paragraphs=3' },
          ]
        });
    }
  } catch (error) {
    console.error('Tool API error:', error);
    return NextResponse.json({ error: 'API request failed' }, { status: 500 });
  }
}
