import { NextRequest, NextResponse } from 'next/server';

// ═══════════════════════════════════════════════════════════════
//                    🚀 POWER TOOLS API
//                    Die geilsten kostenlosen APIs!
// ═══════════════════════════════════════════════════════════════

// 1. SCREENSHOT API (microlink.io - 100 free/day)
function getScreenshot(url: string, width: number = 1280, height: number = 720) {
  return `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url&viewport.width=${width}&viewport.height=${height}`;
}

// 2. EMAIL VALIDATION (disify.com - kostenlos)
async function validateEmail(email: string) {
  try {
    const res = await fetch(`https://www.disify.com/api/email/${email}`);
    const data = await res.json();
    return {
      email,
      valid: !data.disposable && data.format,
      disposable: data.disposable,
      dns: data.dns,
    };
  } catch {
    return { email, valid: true, disposable: false, dns: true };
  }
}

// 3. COMPANY LOOKUP (clearbit logo + domain)
function getCompanyLogo(domain: string, size: number = 128) {
  return `https://logo.clearbit.com/${domain}?size=${size}`;
}

// 4. AVATAR GENERATOR (ui-avatars.com - kostenlos)
function generateAvatar(name: string, bg: string = 'FC682C', color: string = 'ffffff', size: number = 128) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=${color}&size=${size}&bold=true&format=svg`;
}

// 5. PLACEHOLDER IMAGES (verschiedene Dienste)
function getPlaceholder(width: number = 400, height: number = 300, text?: string) {
  if (text) {
    return `https://placehold.co/${width}x${height}/1a1a2e/FC682C?text=${encodeURIComponent(text)}`;
  }
  return `https://picsum.photos/${width}/${height}`;
}

// 6. RANDOM USER (für Demo-Daten)
async function getRandomUser() {
  const res = await fetch('https://randomuser.me/api/?nat=de');
  const data = await res.json();
  const user = data.results[0];
  return {
    name: `${user.name.first} ${user.name.last}`,
    email: user.email,
    phone: user.phone,
    avatar: user.picture.large,
    city: user.location.city,
    company: `${user.name.last} GmbH`,
  };
}

// 7. FAKE COMPANY DATA (für Demos)
async function getFakeCompany() {
  const industries = ['Tech', 'Marketing', 'E-Commerce', 'Consulting', 'Manufacturing', 'Healthcare'];
  const sizes = ['1-10', '11-50', '51-200', '201-500', '500+'];
  const user = await getRandomUser();
  
  return {
    name: user.company,
    contact: user.name,
    email: user.email,
    phone: user.phone,
    industry: industries[Math.floor(Math.random() * industries.length)],
    size: sizes[Math.floor(Math.random() * sizes.length)],
    website: `https://${user.company.toLowerCase().replace(/\s+/g, '')}.de`,
    logo: generateAvatar(user.company, '1a1a2e', 'FC682C'),
  };
}

// 8. COUNTDOWN / TIME UNTIL
function getCountdown(targetDate: string) {
  const target = new Date(targetDate);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  
  if (diff <= 0) {
    return { expired: true, days: 0, hours: 0, minutes: 0, text: 'Abgelaufen' };
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  let text = '';
  if (days > 0) text = `${days} Tag${days > 1 ? 'e' : ''}`;
  else if (hours > 0) text = `${hours} Stunde${hours > 1 ? 'n' : ''}`;
  else text = `${minutes} Minute${minutes > 1 ? 'n' : ''}`;
  
  return { expired: false, days, hours, minutes, text };
}

// 9. COLOR PALETTE FROM IMAGE (placeholder - real would need API key)
function generatePalette(baseColor: string = 'FC682C') {
  const hexToHSL = (hex: string) => {
    const r = parseInt(hex.slice(0, 2), 16) / 255;
    const g = parseInt(hex.slice(2, 4), 16) / 255;
    const b = parseInt(hex.slice(4, 6), 16) / 255;
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
    return { h: h * 360, s: s * 100, l: l * 100 };
  };
  
  const hsl = hexToHSL(baseColor);
  
  return {
    primary: `#${baseColor}`,
    secondary: `hsl(${hsl.h}, ${hsl.s}%, ${Math.min(hsl.l + 20, 90)}%)`,
    dark: `hsl(${hsl.h}, ${hsl.s}%, ${Math.max(hsl.l - 30, 10)}%)`,
    light: `hsl(${hsl.h}, ${hsl.s * 0.3}%, 95%)`,
    accent: `hsl(${(hsl.h + 180) % 360}, ${hsl.s}%, ${hsl.l}%)`,
  };
}

// 10. STATS GENERATOR (für Charts)
function generateStats(days: number = 7) {
  const stats = [];
  const baseValue = 100;
  let currentValue = baseValue;
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    currentValue = Math.max(50, currentValue + (Math.random() - 0.4) * 30);
    stats.push({
      date: date.toISOString().split('T')[0],
      label: date.toLocaleDateString('de-DE', { weekday: 'short' }),
      value: Math.round(currentValue),
      leads: Math.floor(Math.random() * 10) + 1,
      checks: Math.floor(Math.random() * 50) + 10,
    });
  }
  
  return stats;
}

// 11. PROGRESS BAR DATA
function calculateProgress(milestones: { completed: boolean }[]) {
  const total = milestones.length;
  const completed = milestones.filter(m => m.completed).length;
  const percentage = Math.round((completed / total) * 100);
  
  return {
    total,
    completed,
    percentage,
    remaining: total - completed,
    status: percentage === 100 ? 'done' : percentage >= 75 ? 'almost' : percentage >= 50 ? 'halfway' : 'started',
  };
}

// 12. PDF DOWNLOAD LINK (für Rechnungen)
function getPDFDownloadLink(invoiceId: string) {
  return `/api/invoice/${invoiceId}/pdf`;
}

// 13. SOCIAL SHARE LINKS
function getSocialShareLinks(url: string, title: string) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  
  return {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
  };
}

// 14. TECH STACK LOGOS
function getTechLogo(tech: string, size: number = 64) {
  const techMap: Record<string, string> = {
    'react': 'https://cdn.simpleicons.org/react/61DAFB',
    'nextjs': 'https://cdn.simpleicons.org/nextdotjs/000000',
    'typescript': 'https://cdn.simpleicons.org/typescript/3178C6',
    'tailwind': 'https://cdn.simpleicons.org/tailwindcss/06B6D4',
    'node': 'https://cdn.simpleicons.org/nodedotjs/339933',
    'python': 'https://cdn.simpleicons.org/python/3776AB',
    'postgresql': 'https://cdn.simpleicons.org/postgresql/4169E1',
    'supabase': 'https://cdn.simpleicons.org/supabase/3FCF8E',
    'vercel': 'https://cdn.simpleicons.org/vercel/000000',
    'stripe': 'https://cdn.simpleicons.org/stripe/008CDD',
    'figma': 'https://cdn.simpleicons.org/figma/F24E1E',
    'github': 'https://cdn.simpleicons.org/github/181717',
  };
  
  return techMap[tech.toLowerCase()] || `https://cdn.simpleicons.org/${tech.toLowerCase()}`;
}

// 15. NOTIFICATION BADGE
function getNotificationBadge(count: number) {
  if (count === 0) return null;
  if (count > 99) return '99+';
  return String(count);
}

// 16. FILE TYPE ICON
function getFileIcon(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const icons: Record<string, string> = {
    pdf: '📄',
    doc: '📝', docx: '📝',
    xls: '📊', xlsx: '📊',
    ppt: '📽️', pptx: '📽️',
    jpg: '🖼️', jpeg: '🖼️', png: '🖼️', gif: '🖼️', webp: '🖼️', svg: '🖼️',
    mp4: '🎬', mov: '🎬', avi: '🎬',
    mp3: '🎵', wav: '🎵',
    zip: '📦', rar: '📦', '7z': '📦',
    js: '💛', ts: '💙', tsx: '💙',
    html: '🌐', css: '🎨',
    json: '📋', xml: '📋',
  };
  
  return icons[ext] || '📁';
}

// 17. RANDOM MOTIVATIONAL QUOTE (deutsch)
function getGermanQuote() {
  const quotes = [
    { quote: "Der beste Zeitpunkt zu handeln ist jetzt.", author: "Unbekannt" },
    { quote: "Erfolg ist kein Zufall, sondern das Ergebnis harter Arbeit.", author: "Unbekannt" },
    { quote: "Wer aufhört, besser zu werden, hat aufgehört, gut zu sein.", author: "Philip Rosenthal" },
    { quote: "Qualität bedeutet, es richtig zu machen, wenn keiner zuschaut.", author: "Henry Ford" },
    { quote: "Der Weg ist das Ziel.", author: "Konfuzius" },
    { quote: "Innovation unterscheidet den Anführer vom Verfolger.", author: "Steve Jobs" },
    { quote: "Einfachheit ist die höchste Stufe der Vollendung.", author: "Leonardo da Vinci" },
    { quote: "Die beste Zeit, einen Baum zu pflanzen, war vor 20 Jahren. Die zweitbeste ist jetzt.", author: "Chinesisches Sprichwort" },
  ];
  
  return quotes[Math.floor(Math.random() * quotes.length)];
}

// 18. UPTIME STATUS (simuliert)
function getSystemStatus() {
  const services = [
    { name: 'Website', status: 'operational', uptime: 99.98 },
    { name: 'API', status: 'operational', uptime: 99.95 },
    { name: 'Datenbank', status: 'operational', uptime: 99.99 },
    { name: 'E-Mail', status: 'operational', uptime: 99.90 },
    { name: 'Telegram Bot', status: 'operational', uptime: 99.85 },
  ];
  
  return {
    overall: 'operational',
    services,
    lastChecked: new Date().toISOString(),
  };
}

// 19. BUSINESS HOURS CHECK
function isBusinessHours() {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();
  
  const isWeekday = day >= 1 && day <= 5;
  const isWorkHour = hour >= 9 && hour < 18;
  
  return {
    open: isWeekday && isWorkHour,
    message: isWeekday && isWorkHour 
      ? '🟢 Wir sind erreichbar!' 
      : '🟡 Außerhalb der Geschäftszeiten',
    hours: 'Mo-Fr 9:00-18:00',
    nextOpen: isWeekday && isWorkHour ? null : 'Morgen um 9:00',
  };
}

// 20. SEO PREVIEW
function generateSEOPreview(title: string, description: string, url: string) {
  return {
    google: {
      title: title.length > 60 ? title.slice(0, 57) + '...' : title,
      description: description.length > 160 ? description.slice(0, 157) + '...' : description,
      url: url,
    },
    twitter: {
      card: 'summary_large_image',
      title: title.length > 70 ? title.slice(0, 67) + '...' : title,
      description: description.length > 200 ? description.slice(0, 197) + '...' : description,
    },
    issues: [
      ...(title.length < 30 ? ['⚠️ Title zu kurz (min. 30 Zeichen)'] : []),
      ...(title.length > 60 ? ['⚠️ Title zu lang (max. 60 Zeichen)'] : []),
      ...(description.length < 120 ? ['⚠️ Description zu kurz (min. 120 Zeichen)'] : []),
      ...(description.length > 160 ? ['⚠️ Description zu lang (max. 160 Zeichen)'] : []),
    ],
  };
}

// ═══════════════════════════════════════════════════════════════
//                    API ROUTE HANDLER
// ═══════════════════════════════════════════════════════════════

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tool = searchParams.get('tool');
  
  try {
    switch (tool) {
      case 'screenshot': {
        const url = searchParams.get('url') || 'https://agentflowm.com';
        const width = parseInt(searchParams.get('width') || '1280');
        const height = parseInt(searchParams.get('height') || '720');
        return NextResponse.json({ url: getScreenshot(url, width, height) });
      }
      
      case 'validate-email': {
        const email = searchParams.get('email');
        if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });
        const result = await validateEmail(email);
        return NextResponse.json(result);
      }
      
      case 'company-logo': {
        const domain = searchParams.get('domain');
        if (!domain) return NextResponse.json({ error: 'Domain required' }, { status: 400 });
        const size = parseInt(searchParams.get('size') || '128');
        return NextResponse.json({ url: getCompanyLogo(domain, size) });
      }
      
      case 'avatar': {
        const name = searchParams.get('name') || 'User';
        const bg = searchParams.get('bg') || 'FC682C';
        const color = searchParams.get('color') || 'ffffff';
        const size = parseInt(searchParams.get('size') || '128');
        return NextResponse.json({ url: generateAvatar(name, bg, color, size) });
      }
      
      case 'placeholder': {
        const width = parseInt(searchParams.get('width') || '400');
        const height = parseInt(searchParams.get('height') || '300');
        const text = searchParams.get('text') || undefined;
        return NextResponse.json({ url: getPlaceholder(width, height, text) });
      }
      
      case 'random-user': {
        const user = await getRandomUser();
        return NextResponse.json(user);
      }
      
      case 'fake-company': {
        const company = await getFakeCompany();
        return NextResponse.json(company);
      }
      
      case 'countdown': {
        const date = searchParams.get('date');
        if (!date) return NextResponse.json({ error: 'Date required (YYYY-MM-DD)' }, { status: 400 });
        return NextResponse.json(getCountdown(date));
      }
      
      case 'palette': {
        const color = searchParams.get('color') || 'FC682C';
        return NextResponse.json(generatePalette(color));
      }
      
      case 'stats': {
        const days = parseInt(searchParams.get('days') || '7');
        return NextResponse.json(generateStats(days));
      }
      
      case 'share-links': {
        const url = searchParams.get('url') || 'https://agentflowm.com';
        const title = searchParams.get('title') || 'AgentFlowM';
        return NextResponse.json(getSocialShareLinks(url, title));
      }
      
      case 'tech-logo': {
        const tech = searchParams.get('tech');
        if (!tech) return NextResponse.json({ error: 'Tech required' }, { status: 400 });
        return NextResponse.json({ url: getTechLogo(tech) });
      }
      
      case 'file-icon': {
        const filename = searchParams.get('filename') || 'file.txt';
        return NextResponse.json({ icon: getFileIcon(filename) });
      }
      
      case 'german-quote': {
        return NextResponse.json(getGermanQuote());
      }
      
      case 'system-status': {
        return NextResponse.json(getSystemStatus());
      }
      
      case 'business-hours': {
        return NextResponse.json(isBusinessHours());
      }
      
      case 'seo-preview': {
        const title = searchParams.get('title') || '';
        const description = searchParams.get('description') || '';
        const url = searchParams.get('url') || '';
        return NextResponse.json(generateSEOPreview(title, description, url));
      }
      
      default:
        return NextResponse.json({
          message: '🚀 Power Tools API',
          tools: [
            { tool: 'screenshot', desc: 'Website Screenshot', example: '?tool=screenshot&url=https://example.com' },
            { tool: 'validate-email', desc: 'E-Mail Validierung', example: '?tool=validate-email&email=test@example.com' },
            { tool: 'company-logo', desc: 'Firmenlogo von Domain', example: '?tool=company-logo&domain=google.com' },
            { tool: 'avatar', desc: 'Avatar Generator', example: '?tool=avatar&name=Max Mustermann' },
            { tool: 'placeholder', desc: 'Platzhalter-Bild', example: '?tool=placeholder&width=400&height=300&text=Hello' },
            { tool: 'random-user', desc: 'Zufälliger Benutzer (Demo)', example: '?tool=random-user' },
            { tool: 'fake-company', desc: 'Zufällige Firma (Demo)', example: '?tool=fake-company' },
            { tool: 'countdown', desc: 'Countdown bis Datum', example: '?tool=countdown&date=2026-03-01' },
            { tool: 'palette', desc: 'Farbpalette generieren', example: '?tool=palette&color=FC682C' },
            { tool: 'stats', desc: 'Chart-Daten generieren', example: '?tool=stats&days=7' },
            { tool: 'share-links', desc: 'Social Share Links', example: '?tool=share-links&url=...&title=...' },
            { tool: 'tech-logo', desc: 'Tech Stack Logo', example: '?tool=tech-logo&tech=react' },
            { tool: 'file-icon', desc: 'Datei-Icon', example: '?tool=file-icon&filename=document.pdf' },
            { tool: 'german-quote', desc: 'Deutsches Zitat', example: '?tool=german-quote' },
            { tool: 'system-status', desc: 'System Status', example: '?tool=system-status' },
            { tool: 'business-hours', desc: 'Geschäftszeiten Check', example: '?tool=business-hours' },
            { tool: 'seo-preview', desc: 'SEO Vorschau', example: '?tool=seo-preview&title=...&description=...' },
          ]
        });
    }
  } catch (error) {
    console.error('Power Tools API error:', error);
    return NextResponse.json({ error: 'API request failed' }, { status: 500 });
  }
}
