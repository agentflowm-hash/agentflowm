'use client';

import { useEffect, useState } from 'react';

// ═══════════════════════════════════════════════════════════════
//                    🔥 ADMIN DASHBOARD WIDGETS
// ═══════════════════════════════════════════════════════════════

// 1. SYSTEM STATUS WIDGET
export function SystemStatusWidget() {
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    fetch('/api/powertools?tool=system-status')
      .then(res => res.json())
      .then(setStatus)
      .catch(console.error);
  }, []);

  if (!status) return <WidgetSkeleton />;

  return (
    <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">🖥️ System Status</h3>
        <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
          ● Operational
        </span>
      </div>
      <div className="space-y-2">
        {status.services?.map((service: any) => (
          <div key={service.name} className="flex items-center justify-between text-xs">
            <span className="text-gray-400">{service.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">{service.uptime}%</span>
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 2. BUSINESS HOURS WIDGET
export function BusinessHoursWidget() {
  const [hours, setHours] = useState<any>(null);

  useEffect(() => {
    fetch('/api/powertools?tool=business-hours')
      .then(res => res.json())
      .then(setHours);
    
    // Update every minute
    const interval = setInterval(() => {
      fetch('/api/powertools?tool=business-hours')
        .then(res => res.json())
        .then(setHours);
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  if (!hours) return <WidgetSkeleton />;

  return (
    <div className={`backdrop-blur-sm rounded-xl p-4 border border-white/10 ${
      hours.open ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/10' : 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10'
    }`}>
      <div className="text-2xl mb-2">{hours.open ? '🟢' : '🟡'}</div>
      <div className="text-sm font-semibold text-white">{hours.message}</div>
      <div className="text-xs text-gray-400 mt-1">{hours.hours}</div>
      {hours.nextOpen && (
        <div className="text-xs text-gray-500 mt-2">Nächste Öffnung: {hours.nextOpen}</div>
      )}
    </div>
  );
}

// 3. STATS CHART WIDGET
export function StatsChartWidget() {
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/powertools?tool=stats&days=7')
      .then(res => res.json())
      .then(setStats)
      .catch(console.error);
  }, []);

  if (!stats.length) return <WidgetSkeleton className="h-48" />;

  const maxValue = Math.max(...stats.map(s => s.value));

  return (
    <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
      <h3 className="text-sm font-semibold text-white mb-4">📊 Wöchentliche Aktivität</h3>
      <div className="flex items-end justify-between gap-2 h-24">
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-col items-center flex-1">
            <div 
              className="w-full bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-sm transition-all duration-500"
              style={{ height: `${(stat.value / maxValue) * 100}%`, minHeight: '4px' }}
            />
            <span className="text-[10px] text-gray-500 mt-1">{stat.label}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-3 text-xs text-gray-400">
        <span>📈 {stats.reduce((a, b) => a + b.leads, 0)} Leads</span>
        <span>🔍 {stats.reduce((a, b) => a + b.checks, 0)} Checks</span>
      </div>
    </div>
  );
}

// 4. SCREENSHOT PREVIEW WIDGET
export function ScreenshotWidget({ url, title }: { url: string; title: string }) {
  const [screenshot, setScreenshot] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/powertools?tool=screenshot&url=${encodeURIComponent(url)}&width=800&height=600`)
      .then(res => res.json())
      .then(data => {
        setScreenshot(data.url);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [url]);

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10">
      <div className="p-3 border-b border-white/10 flex items-center gap-2">
        <div className="flex gap-1">
          <span className="w-3 h-3 bg-red-500 rounded-full"></span>
          <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
        </div>
        <span className="text-xs text-gray-400 truncate flex-1">{url}</span>
      </div>
      <div className="aspect-video bg-gray-900 relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : screenshot ? (
          <img src={screenshot} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            Screenshot nicht verfügbar
          </div>
        )}
      </div>
    </div>
  );
}

// 5. GERMAN QUOTE WIDGET
export function GermanQuoteWidget() {
  const [quote, setQuote] = useState<any>(null);

  useEffect(() => {
    fetch('/api/powertools?tool=german-quote')
      .then(res => res.json())
      .then(setQuote);
  }, []);

  if (!quote) return <WidgetSkeleton />;

  return (
    <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
      <div className="text-2xl mb-2">💡</div>
      <blockquote className="text-sm italic text-gray-300">"{quote.quote}"</blockquote>
      <cite className="text-xs text-gray-500 mt-2 block">— {quote.author}</cite>
    </div>
  );
}

// 6. COUNTDOWN WIDGET
export function CountdownWidget({ date, label }: { date: string; label: string }) {
  const [countdown, setCountdown] = useState<any>(null);

  useEffect(() => {
    const update = () => {
      fetch(`/api/powertools?tool=countdown&date=${date}`)
        .then(res => res.json())
        .then(setCountdown);
    };
    
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [date]);

  if (!countdown) return <WidgetSkeleton />;

  return (
    <div className={`backdrop-blur-sm rounded-xl p-4 border border-white/10 ${
      countdown.expired ? 'bg-red-500/10' : 'bg-gradient-to-br from-purple-500/10 to-pink-500/10'
    }`}>
      <div className="text-xs text-gray-400 mb-1">{label}</div>
      {countdown.expired ? (
        <div className="text-red-400 font-bold">⏰ Fällig!</div>
      ) : (
        <>
          <div className="flex gap-2 text-center">
            <div className="bg-white/10 rounded-lg p-2 flex-1">
              <div className="text-2xl font-bold text-white">{countdown.days}</div>
              <div className="text-[10px] text-gray-500">Tage</div>
            </div>
            <div className="bg-white/10 rounded-lg p-2 flex-1">
              <div className="text-2xl font-bold text-white">{countdown.hours}</div>
              <div className="text-[10px] text-gray-500">Std</div>
            </div>
            <div className="bg-white/10 rounded-lg p-2 flex-1">
              <div className="text-2xl font-bold text-white">{countdown.minutes}</div>
              <div className="text-[10px] text-gray-500">Min</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// 7. TECH STACK WIDGET
export function TechStackWidget({ techs }: { techs: string[] }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
      <h3 className="text-sm font-semibold text-white mb-3">🛠️ Tech Stack</h3>
      <div className="flex flex-wrap gap-3">
        {techs.map(tech => (
          <div key={tech} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
            <img 
              src={`https://cdn.simpleicons.org/${tech.toLowerCase()}`} 
              alt={tech}
              className="w-5 h-5"
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
            <span className="text-xs text-gray-300">{tech}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 8. SOCIAL SHARE WIDGET
export function SocialShareWidget({ url, title }: { url: string; title: string }) {
  const [links, setLinks] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/powertools?tool=share-links&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`)
      .then(res => res.json())
      .then(setLinks);
  }, [url, title]);

  if (!links) return null;

  const socials = [
    { name: 'Twitter', key: 'twitter', icon: '𝕏', bg: 'bg-black' },
    { name: 'LinkedIn', key: 'linkedin', icon: 'in', bg: 'bg-blue-600' },
    { name: 'WhatsApp', key: 'whatsapp', icon: '💬', bg: 'bg-green-500' },
    { name: 'Telegram', key: 'telegram', icon: '✈️', bg: 'bg-blue-400' },
  ];

  return (
    <div className="flex gap-2">
      {socials.map(social => (
        <a
          key={social.key}
          href={links[social.key]}
          target="_blank"
          rel="noopener noreferrer"
          className={`${social.bg} w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm hover:opacity-80 transition-opacity`}
        >
          {social.icon}
        </a>
      ))}
    </div>
  );
}

// 9. AVATAR LIST WIDGET
export function AvatarListWidget({ users }: { users: { name: string; role: string }[] }) {
  return (
    <div className="flex -space-x-3">
      {users.slice(0, 5).map((user, i) => (
        <img
          key={i}
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=${['FC682C', '3B82F6', '10B981', '8B5CF6', 'EC4899'][i]}&color=fff&size=40&bold=true`}
          alt={user.name}
          title={`${user.name} - ${user.role}`}
          className="w-10 h-10 rounded-full border-2 border-gray-900"
        />
      ))}
      {users.length > 5 && (
        <div className="w-10 h-10 rounded-full bg-gray-700 border-2 border-gray-900 flex items-center justify-center text-xs text-white">
          +{users.length - 5}
        </div>
      )}
    </div>
  );
}

// 10. EMAIL VALIDATOR WIDGET
export function EmailValidatorWidget() {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const validate = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/powertools?tool=validate-email&email=${encodeURIComponent(email)}`);
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ error: true });
    }
    setLoading(false);
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
      <h3 className="text-sm font-semibold text-white mb-3">📧 E-Mail Validator</h3>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="email@example.com"
          className="flex-1 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
        />
        <button
          onClick={validate}
          disabled={loading}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
        >
          {loading ? '...' : '✓'}
        </button>
      </div>
      {result && (
        <div className={`mt-3 text-sm ${result.valid ? 'text-green-400' : 'text-red-400'}`}>
          {result.valid ? '✅ Gültige E-Mail' : '❌ Ungültige E-Mail'}
          {result.disposable && ' (Wegwerf-E-Mail)'}
        </div>
      )}
    </div>
  );
}

// SKELETON LOADER
function WidgetSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white/5 rounded-xl p-4 animate-pulse ${className}`}>
      <div className="h-4 bg-white/10 rounded w-1/3 mb-3"></div>
      <div className="h-8 bg-white/10 rounded w-2/3"></div>
    </div>
  );
}

// DEFAULT EXPORT - FULL DASHBOARD
export default function AdminDashboardWidgets() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <SystemStatusWidget />
      <BusinessHoursWidget />
      <StatsChartWidget />
      <GermanQuoteWidget />
      <EmailValidatorWidget />
      <TechStackWidget techs={['React', 'Next.js', 'TypeScript', 'Tailwind', 'Supabase', 'Stripe']} />
    </div>
  );
}
