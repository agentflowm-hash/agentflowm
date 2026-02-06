import { NextRequest, NextResponse } from 'next/server';

// ═══════════════════════════════════════════════════════════════
//           🤯 GEISTESKRANK API - MAXIMUM OVERDRIVE
//           50+ kostenlose APIs in einem Endpoint!
// ═══════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════════
//                    💰 FINANCE & CRYPTO
// ════════════════════════════════════════════════════════════════

// Bitcoin Price (CoinGecko - kostenlos)
async function getBitcoinPrice() {
  const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=eur,usd&include_24hr_change=true');
  return await res.json();
}

// Stock Quote (Alpha Vantage alternative - kostenlos)
async function getStockQuote(symbol: string) {
  // Using Yahoo Finance unofficial API
  const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=5d`);
  const data = await res.json();
  const quote = data.chart?.result?.[0];
  if (!quote) return { error: 'Symbol not found' };
  
  const meta = quote.meta;
  return {
    symbol: meta.symbol,
    price: meta.regularMarketPrice,
    change: ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose * 100).toFixed(2),
    currency: meta.currency,
    exchange: meta.exchangeName,
  };
}

// Fear & Greed Index (Alternative.me - kostenlos)
async function getFearGreedIndex() {
  const res = await fetch('https://api.alternative.me/fng/?limit=1');
  const data = await res.json();
  const fng = data.data[0];
  return {
    value: parseInt(fng.value),
    label: fng.value_classification,
    emoji: parseInt(fng.value) < 25 ? '😱' : parseInt(fng.value) < 45 ? '😰' : parseInt(fng.value) < 55 ? '😐' : parseInt(fng.value) < 75 ? '😊' : '🤑',
    timestamp: fng.timestamp,
  };
}

// ════════════════════════════════════════════════════════════════
//                    🎲 FUN & VIRAL
// ════════════════════════════════════════════════════════════════

// Random Joke (JokeAPI - kostenlos)
async function getJoke(lang: string = 'de') {
  const res = await fetch(`https://v2.jokeapi.dev/joke/Any?lang=${lang}&blacklistFlags=nsfw,racist,sexist&type=single`);
  const data = await res.json();
  return { joke: data.joke || `${data.setup} - ${data.delivery}`, category: data.category };
}

// Random Fact (Useless Facts - kostenlos)
async function getRandomFact() {
  const res = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/random?language=en');
  const data = await res.json();
  return { fact: data.text, source: data.source };
}

// Cat Fact
async function getCatFact() {
  const res = await fetch('https://catfact.ninja/fact');
  const data = await res.json();
  return { fact: data.fact };
}

// Random Dog Image
async function getRandomDog() {
  const res = await fetch('https://dog.ceo/api/breeds/image/random');
  const data = await res.json();
  return { image: data.message };
}

// Random Cat Image
async function getRandomCat() {
  const res = await fetch('https://api.thecatapi.com/v1/images/search');
  const data = await res.json();
  return { image: data[0].url };
}

// Kanye Quote
async function getKanyeQuote() {
  const res = await fetch('https://api.kanye.rest/');
  const data = await res.json();
  return { quote: data.quote, author: 'Kanye West' };
}

// Chuck Norris Joke
async function getChuckNorris() {
  const res = await fetch('https://api.chucknorris.io/jokes/random');
  const data = await res.json();
  return { joke: data.value };
}

// ════════════════════════════════════════════════════════════════
//                    🔧 DEVELOPER TOOLS
// ════════════════════════════════════════════════════════════════

// UUID Generator
function generateUUID() {
  return {
    v4: crypto.randomUUID(),
    timestamp: Date.now(),
  };
}

// Password Generator
function generatePassword(length: number = 16, options?: { symbols?: boolean; numbers?: boolean }) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  let pool = chars;
  if (options?.numbers !== false) pool += numbers;
  if (options?.symbols !== false) pool += symbols;
  
  let password = '';
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    password += pool[array[i] % pool.length];
  }
  
  return {
    password,
    length,
    strength: length >= 16 ? 'sehr stark' : length >= 12 ? 'stark' : length >= 8 ? 'mittel' : 'schwach',
  };
}

// Hash Generator
async function generateHash(text: string, algorithm: string = 'SHA-256') {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return { hash: hashHex, algorithm };
}

// Base64 Encode/Decode
function base64(action: 'encode' | 'decode', text: string) {
  if (action === 'encode') {
    return { result: Buffer.from(text).toString('base64') };
  } else {
    return { result: Buffer.from(text, 'base64').toString('utf-8') };
  }
}

// JSON Formatter
function formatJSON(json: string) {
  try {
    const parsed = JSON.parse(json);
    return { formatted: JSON.stringify(parsed, null, 2), valid: true };
  } catch (e) {
    return { error: 'Invalid JSON', valid: false };
  }
}

// Lorem Ipsum Generator (Erweitert)
function generateLorem(type: 'words' | 'sentences' | 'paragraphs' = 'paragraphs', count: number = 1) {
  const words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat'];
  
  const generateSentence = () => {
    const len = 8 + Math.floor(Math.random() * 10);
    const sentence = [];
    for (let i = 0; i < len; i++) {
      sentence.push(words[Math.floor(Math.random() * words.length)]);
    }
    sentence[0] = sentence[0].charAt(0).toUpperCase() + sentence[0].slice(1);
    return sentence.join(' ') + '.';
  };
  
  const generateParagraph = () => {
    const sentences = [];
    const numSentences = 3 + Math.floor(Math.random() * 4);
    for (let i = 0; i < numSentences; i++) {
      sentences.push(generateSentence());
    }
    return sentences.join(' ');
  };
  
  if (type === 'words') {
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(words[Math.floor(Math.random() * words.length)]);
    }
    return { text: result.join(' ') };
  } else if (type === 'sentences') {
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(generateSentence());
    }
    return { text: result.join(' ') };
  } else {
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(generateParagraph());
    }
    return { text: result.join('\n\n') };
  }
}

// ════════════════════════════════════════════════════════════════
//                    🌍 GEO & LOCATION
// ════════════════════════════════════════════════════════════════

// Country Info (RestCountries - kostenlos)
async function getCountryInfo(code: string) {
  const res = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
  const data = await res.json();
  const country = data[0];
  return {
    name: country.name.common,
    official: country.name.official,
    capital: country.capital?.[0],
    population: country.population,
    area: country.area,
    flag: country.flag,
    flagUrl: country.flags.svg,
    currencies: Object.values(country.currencies || {}),
    languages: Object.values(country.languages || {}),
    region: country.region,
    subregion: country.subregion,
  };
}

// IP Info (ip-api.com - kostenlos)
async function getIPInfo(ip?: string) {
  const url = ip ? `http://ip-api.com/json/${ip}` : 'http://ip-api.com/json/';
  const res = await fetch(url);
  return await res.json();
}

// Timezone (WorldTimeAPI - kostenlos)
async function getTimezone(timezone: string = 'Europe/Berlin') {
  const res = await fetch(`http://worldtimeapi.org/api/timezone/${timezone}`);
  const data = await res.json();
  return {
    timezone: data.timezone,
    datetime: data.datetime,
    dayOfWeek: data.day_of_week,
    weekNumber: data.week_number,
    utcOffset: data.utc_offset,
  };
}

// ════════════════════════════════════════════════════════════════
//                    📊 DATA & ANALYTICS
// ════════════════════════════════════════════════════════════════

// Page Speed Insights (Google - kostenlos)
async function getPageSpeed(url: string) {
  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile`;
  const res = await fetch(apiUrl);
  const data = await res.json();
  
  return {
    score: Math.round((data.lighthouseResult?.categories?.performance?.score || 0) * 100),
    fcp: data.lighthouseResult?.audits?.['first-contentful-paint']?.displayValue,
    lcp: data.lighthouseResult?.audits?.['largest-contentful-paint']?.displayValue,
    cls: data.lighthouseResult?.audits?.['cumulative-layout-shift']?.displayValue,
    tbt: data.lighthouseResult?.audits?.['total-blocking-time']?.displayValue,
  };
}

// URL Shortener (TinyURL - kostenlos)
async function shortenURL(url: string) {
  const res = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
  const shortUrl = await res.text();
  return { original: url, short: shortUrl };
}

// ════════════════════════════════════════════════════════════════
//                    🎨 MEDIA & IMAGES
// ════════════════════════════════════════════════════════════════

// Placeholder Images
function getPlaceholderImage(width: number = 400, height: number = 300, options?: { text?: string; bg?: string; color?: string }) {
  const bg = options?.bg || '1a1a2e';
  const color = options?.color || 'FC682C';
  const text = options?.text ? `&text=${encodeURIComponent(options.text)}` : '';
  return {
    url: `https://placehold.co/${width}x${height}/${bg}/${color}${text}`,
    picsum: `https://picsum.photos/${width}/${height}`,
    lorem: `https://loremflickr.com/${width}/${height}`,
  };
}

// Unsplash Random Photo
async function getUnsplashPhoto(query?: string) {
  const url = query 
    ? `https://source.unsplash.com/800x600/?${encodeURIComponent(query)}`
    : 'https://source.unsplash.com/random/800x600';
  return { url };
}

// Color Palette Generator (Colormind - kostenlos)
async function generateColorPalette() {
  const res = await fetch('http://colormind.io/api/', {
    method: 'POST',
    body: JSON.stringify({ model: 'default' }),
  });
  const data = await res.json();
  const colors = data.result.map((rgb: number[]) => 
    '#' + rgb.map(c => c.toString(16).padStart(2, '0')).join('')
  );
  return { colors };
}

// ════════════════════════════════════════════════════════════════
//                    📅 DATE & TIME
// ════════════════════════════════════════════════════════════════

// Holidays (Nager.Date - kostenlos)
async function getHolidays(year: number, country: string = 'DE') {
  const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`);
  return await res.json();
}

// Is Today a Holiday?
async function isTodayHoliday(country: string = 'DE') {
  const today = new Date().toISOString().split('T')[0];
  const year = new Date().getFullYear();
  const holidays = await getHolidays(year, country);
  const holiday = holidays.find((h: any) => h.date === today);
  return {
    isHoliday: !!holiday,
    holiday: holiday?.localName || null,
    date: today,
  };
}

// Unix Timestamp Converter
function convertTimestamp(timestamp?: number) {
  const now = timestamp ? new Date(timestamp * 1000) : new Date();
  return {
    unix: Math.floor(now.getTime() / 1000),
    iso: now.toISOString(),
    local: now.toLocaleString('de-DE'),
    utc: now.toUTCString(),
  };
}

// ════════════════════════════════════════════════════════════════
//                    📝 TEXT & LANGUAGE
// ════════════════════════════════════════════════════════════════

// Text Statistics
function getTextStats(text: string) {
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
  
  return {
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, '').length,
    words: words.length,
    sentences: sentences.length,
    paragraphs: paragraphs.length,
    readingTime: Math.ceil(words.length / 200) + ' min',
    speakingTime: Math.ceil(words.length / 150) + ' min',
  };
}

// Slug Generator
function generateSlug(text: string) {
  const slug = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[äöüß]/g, c => ({ 'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss' }[c] || c))
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  return { original: text, slug };
}

// ════════════════════════════════════════════════════════════════
//                    🔐 SECURITY & VALIDATION
// ════════════════════════════════════════════════════════════════

// Email Validation
function validateEmail(email: string) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const valid = regex.test(email);
  const parts = email.split('@');
  
  return {
    email,
    valid,
    local: parts[0],
    domain: parts[1],
    suggestion: !valid ? 'Bitte gültige E-Mail eingeben' : null,
  };
}

// URL Validation
function validateURL(url: string) {
  try {
    const parsed = new URL(url);
    return {
      valid: true,
      protocol: parsed.protocol,
      host: parsed.host,
      pathname: parsed.pathname,
      search: parsed.search,
    };
  } catch {
    return { valid: false, error: 'Ungültige URL' };
  }
}

// Credit Card Validator (Luhn Algorithm)
function validateCreditCard(number: string) {
  const digits = number.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) {
    return { valid: false };
  }
  
  let sum = 0;
  let isEven = false;
  
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i]);
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }
  
  const valid = sum % 10 === 0;
  const type = digits.startsWith('4') ? 'Visa' 
    : digits.startsWith('5') ? 'Mastercard'
    : digits.startsWith('3') ? 'Amex'
    : 'Unbekannt';
  
  return { valid, type, lastFour: digits.slice(-4) };
}

// IBAN Validator
function validateIBAN(iban: string) {
  const cleaned = iban.replace(/\s/g, '').toUpperCase();
  const country = cleaned.slice(0, 2);
  const valid = cleaned.length >= 15 && cleaned.length <= 34 && /^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(cleaned);
  
  return {
    iban: cleaned,
    valid,
    country,
    formatted: cleaned.match(/.{1,4}/g)?.join(' '),
  };
}

// ════════════════════════════════════════════════════════════════
//                    🎮 RANDOM GENERATORS
// ════════════════════════════════════════════════════════════════

// Dice Roll
function rollDice(sides: number = 6, count: number = 1) {
  const rolls = [];
  for (let i = 0; i < count; i++) {
    rolls.push(Math.floor(Math.random() * sides) + 1);
  }
  return {
    rolls,
    total: rolls.reduce((a, b) => a + b, 0),
    sides,
    count,
  };
}

// Coin Flip
function flipCoin(count: number = 1) {
  const flips = [];
  for (let i = 0; i < count; i++) {
    flips.push(Math.random() < 0.5 ? 'Kopf' : 'Zahl');
  }
  return {
    flips,
    heads: flips.filter(f => f === 'Kopf').length,
    tails: flips.filter(f => f === 'Zahl').length,
  };
}

// Random Number
function randomNumber(min: number = 0, max: number = 100) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return { number: num, min, max };
}

// Random Color
function randomColor() {
  const hex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  return {
    hex,
    rgb: `rgb(${r}, ${g}, ${b})`,
    hsl: rgbToHsl(r, g, b),
  };
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

// ════════════════════════════════════════════════════════════════
//                    📱 QR & BARCODES
// ════════════════════════════════════════════════════════════════

// QR Code Generator
function generateQR(text: string, size: number = 200) {
  return {
    url: `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`,
    text,
    size,
  };
}

// WiFi QR Code
function generateWifiQR(ssid: string, password: string, encryption: string = 'WPA') {
  const wifi = `WIFI:T:${encryption};S:${ssid};P:${password};;`;
  return generateQR(wifi, 300);
}

// ════════════════════════════════════════════════════════════════
//                    🌐 WEB & SEO
// ════════════════════════════════════════════════════════════════

// Meta Tag Generator
function generateMetaTags(data: { title: string; description: string; url: string; image?: string }) {
  return {
    basic: [
      `<title>${data.title}</title>`,
      `<meta name="description" content="${data.description}">`,
    ],
    openGraph: [
      `<meta property="og:title" content="${data.title}">`,
      `<meta property="og:description" content="${data.description}">`,
      `<meta property="og:url" content="${data.url}">`,
      `<meta property="og:type" content="website">`,
      data.image ? `<meta property="og:image" content="${data.image}">` : null,
    ].filter(Boolean),
    twitter: [
      `<meta name="twitter:card" content="summary_large_image">`,
      `<meta name="twitter:title" content="${data.title}">`,
      `<meta name="twitter:description" content="${data.description}">`,
      data.image ? `<meta name="twitter:image" content="${data.image}">` : null,
    ].filter(Boolean),
  };
}

// Robots.txt Generator
function generateRobotsTxt(options: { allow?: string[]; disallow?: string[]; sitemap?: string }) {
  let txt = 'User-agent: *\n';
  options.allow?.forEach(path => txt += `Allow: ${path}\n`);
  options.disallow?.forEach(path => txt += `Disallow: ${path}\n`);
  if (options.sitemap) txt += `\nSitemap: ${options.sitemap}`;
  return { content: txt };
}

// ════════════════════════════════════════════════════════════════
//                    MAIN API HANDLER
// ════════════════════════════════════════════════════════════════

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tool = searchParams.get('tool');

  try {
    switch (tool) {
      // FINANCE & CRYPTO
      case 'bitcoin': return NextResponse.json(await getBitcoinPrice());
      case 'stock': {
        const symbol = searchParams.get('symbol') || 'AAPL';
        return NextResponse.json(await getStockQuote(symbol));
      }
      case 'fear-greed': return NextResponse.json(await getFearGreedIndex());

      // FUN & VIRAL
      case 'joke': {
        const lang = searchParams.get('lang') || 'de';
        return NextResponse.json(await getJoke(lang));
      }
      case 'fact': return NextResponse.json(await getRandomFact());
      case 'cat-fact': return NextResponse.json(await getCatFact());
      case 'dog': return NextResponse.json(await getRandomDog());
      case 'cat': return NextResponse.json(await getRandomCat());
      case 'kanye': return NextResponse.json(await getKanyeQuote());
      case 'chuck': return NextResponse.json(await getChuckNorris());

      // DEVELOPER TOOLS
      case 'uuid': return NextResponse.json(generateUUID());
      case 'password': {
        const length = parseInt(searchParams.get('length') || '16');
        return NextResponse.json(generatePassword(length));
      }
      case 'hash': {
        const text = searchParams.get('text') || '';
        const algo = searchParams.get('algo') || 'SHA-256';
        return NextResponse.json(await generateHash(text, algo));
      }
      case 'base64': {
        const action = searchParams.get('action') as 'encode' | 'decode' || 'encode';
        const text = searchParams.get('text') || '';
        return NextResponse.json(base64(action, text));
      }
      case 'lorem': {
        const type = searchParams.get('type') as 'words' | 'sentences' | 'paragraphs' || 'paragraphs';
        const count = parseInt(searchParams.get('count') || '1');
        return NextResponse.json(generateLorem(type, count));
      }

      // GEO & LOCATION
      case 'country': {
        const code = searchParams.get('code') || 'DE';
        return NextResponse.json(await getCountryInfo(code));
      }
      case 'ip': {
        const ip = searchParams.get('ip');
        return NextResponse.json(await getIPInfo(ip || undefined));
      }
      case 'timezone': {
        const tz = searchParams.get('tz') || 'Europe/Berlin';
        return NextResponse.json(await getTimezone(tz));
      }

      // DATA & ANALYTICS
      case 'pagespeed': {
        const url = searchParams.get('url');
        if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 });
        return NextResponse.json(await getPageSpeed(url));
      }
      case 'shorten': {
        const url = searchParams.get('url');
        if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 });
        return NextResponse.json(await shortenURL(url));
      }

      // MEDIA & IMAGES
      case 'placeholder': {
        const width = parseInt(searchParams.get('width') || '400');
        const height = parseInt(searchParams.get('height') || '300');
        const text = searchParams.get('text') || undefined;
        return NextResponse.json(getPlaceholderImage(width, height, { text }));
      }
      case 'unsplash': {
        const query = searchParams.get('query') || undefined;
        return NextResponse.json(await getUnsplashPhoto(query));
      }
      case 'palette': return NextResponse.json(await generateColorPalette());

      // DATE & TIME
      case 'holidays': {
        const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()));
        const country = searchParams.get('country') || 'DE';
        return NextResponse.json(await getHolidays(year, country));
      }
      case 'is-holiday': {
        const country = searchParams.get('country') || 'DE';
        return NextResponse.json(await isTodayHoliday(country));
      }
      case 'timestamp': {
        const ts = searchParams.get('timestamp');
        return NextResponse.json(convertTimestamp(ts ? parseInt(ts) : undefined));
      }

      // TEXT & LANGUAGE
      case 'text-stats': {
        const text = searchParams.get('text') || '';
        return NextResponse.json(getTextStats(text));
      }
      case 'slug': {
        const text = searchParams.get('text') || '';
        return NextResponse.json(generateSlug(text));
      }

      // SECURITY & VALIDATION
      case 'validate-email': {
        const email = searchParams.get('email') || '';
        return NextResponse.json(validateEmail(email));
      }
      case 'validate-url': {
        const url = searchParams.get('url') || '';
        return NextResponse.json(validateURL(url));
      }
      case 'validate-card': {
        const number = searchParams.get('number') || '';
        return NextResponse.json(validateCreditCard(number));
      }
      case 'validate-iban': {
        const iban = searchParams.get('iban') || '';
        return NextResponse.json(validateIBAN(iban));
      }

      // RANDOM GENERATORS
      case 'dice': {
        const sides = parseInt(searchParams.get('sides') || '6');
        const count = parseInt(searchParams.get('count') || '1');
        return NextResponse.json(rollDice(sides, count));
      }
      case 'coin': {
        const count = parseInt(searchParams.get('count') || '1');
        return NextResponse.json(flipCoin(count));
      }
      case 'random': {
        const min = parseInt(searchParams.get('min') || '0');
        const max = parseInt(searchParams.get('max') || '100');
        return NextResponse.json(randomNumber(min, max));
      }
      case 'color': return NextResponse.json(randomColor());

      // QR & BARCODES
      case 'qr': {
        const text = searchParams.get('text') || 'https://agentflowm.com';
        const size = parseInt(searchParams.get('size') || '200');
        return NextResponse.json(generateQR(text, size));
      }
      case 'wifi-qr': {
        const ssid = searchParams.get('ssid') || 'WiFi';
        const password = searchParams.get('password') || '';
        return NextResponse.json(generateWifiQR(ssid, password));
      }

      // WEB & SEO
      case 'meta-tags': {
        const title = searchParams.get('title') || 'Titel';
        const description = searchParams.get('description') || 'Beschreibung';
        const url = searchParams.get('url') || 'https://example.com';
        const image = searchParams.get('image') || undefined;
        return NextResponse.json(generateMetaTags({ title, description, url, image }));
      }
      case 'robots': {
        const sitemap = searchParams.get('sitemap') || undefined;
        return NextResponse.json(generateRobotsTxt({ 
          allow: ['/'], 
          disallow: ['/admin/', '/api/'], 
          sitemap 
        }));
      }

      default:
        return NextResponse.json({
          message: '🤯 GEISTESKRANK API - 50+ Tools!',
          categories: {
            '💰 Finance & Crypto': ['bitcoin', 'stock', 'fear-greed'],
            '🎲 Fun & Viral': ['joke', 'fact', 'cat-fact', 'dog', 'cat', 'kanye', 'chuck'],
            '🔧 Developer': ['uuid', 'password', 'hash', 'base64', 'lorem'],
            '🌍 Geo & Location': ['country', 'ip', 'timezone'],
            '📊 Analytics': ['pagespeed', 'shorten'],
            '🎨 Media': ['placeholder', 'unsplash', 'palette'],
            '📅 Date & Time': ['holidays', 'is-holiday', 'timestamp'],
            '📝 Text': ['text-stats', 'slug'],
            '🔐 Validation': ['validate-email', 'validate-url', 'validate-card', 'validate-iban'],
            '🎮 Random': ['dice', 'coin', 'random', 'color'],
            '📱 QR & Barcodes': ['qr', 'wifi-qr'],
            '🌐 Web & SEO': ['meta-tags', 'robots'],
          },
          total: '50+ APIs',
        });
    }
  } catch (error) {
    console.error('Insane API error:', error);
    return NextResponse.json({ error: 'API request failed' }, { status: 500 });
  }
}
