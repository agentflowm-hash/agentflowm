'use client';

import { useEffect, useState } from 'react';

// ═══════════════════════════════════════════════════════════════
//                    🎯 KUNDEN PORTAL WIDGETS
// ═══════════════════════════════════════════════════════════════

// 1. PROJECT PROGRESS RING
export function ProgressRingWidget({ percentage, label }: { percentage: number; label: string }) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  
  const getColor = (pct: number) => {
    if (pct >= 100) return '#10B981';
    if (pct >= 75) return '#3B82F6';
    if (pct >= 50) return '#F59E0B';
    return '#FC682C';
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg className="transform -rotate-90 w-32 h-32">
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
          />
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke={getColor(percentage)}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white">{percentage}%</span>
        </div>
      </div>
      <span className="text-sm text-gray-400 mt-3">{label}</span>
    </div>
  );
}

// 2. MILESTONE TIMELINE
export function MilestoneTimeline({ milestones }: { milestones: { title: string; date: string; status: 'done' | 'current' | 'pending' }[] }) {
  const statusIcon = {
    done: '✅',
    current: '🔄',
    pending: '⏳',
  };
  
  const statusColor = {
    done: 'bg-green-500',
    current: 'bg-orange-500 animate-pulse',
    pending: 'bg-gray-600',
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
      <h3 className="text-sm font-semibold text-white mb-4">📍 Meilensteine</h3>
      <div className="relative">
        {milestones.map((milestone, i) => (
          <div key={i} className="flex gap-4 mb-4 last:mb-0">
            <div className="flex flex-col items-center">
              <div className={`w-4 h-4 rounded-full ${statusColor[milestone.status]}`} />
              {i < milestones.length - 1 && (
                <div className={`w-0.5 h-full min-h-[24px] ${milestone.status === 'done' ? 'bg-green-500' : 'bg-gray-700'}`} />
              )}
            </div>
            <div className="flex-1 -mt-0.5">
              <div className="flex items-center gap-2">
                <span className="text-sm text-white">{milestone.title}</span>
                <span className="text-xs">{statusIcon[milestone.status]}</span>
              </div>
              <span className="text-xs text-gray-500">{milestone.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 3. FILE UPLOAD AREA
export function FileUploadWidget({ onUpload }: { onUpload?: (files: FileList) => void }) {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<{ name: string; icon: string }[]>([]);

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    const icons: Record<string, string> = {
      pdf: '📄', doc: '📝', docx: '📝', xls: '📊', xlsx: '📊',
      jpg: '🖼️', jpeg: '🖼️', png: '🖼️', gif: '🖼️',
      mp4: '🎬', zip: '📦', default: '📁'
    };
    return icons[ext] || icons.default;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles.map(f => ({ name: f.name, icon: getFileIcon(f.name) }))]);
    onUpload?.(e.dataTransfer.files);
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
      <h3 className="text-sm font-semibold text-white mb-3">📤 Dateien hochladen</h3>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragOver ? 'border-orange-500 bg-orange-500/10' : 'border-gray-600 hover:border-gray-500'
        }`}
      >
        <div className="text-4xl mb-2">📁</div>
        <p className="text-sm text-gray-400">Dateien hier ablegen</p>
        <p className="text-xs text-gray-500 mt-1">oder klicken zum Auswählen</p>
      </div>
      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((file, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-300 bg-white/5 rounded px-3 py-2">
              <span>{file.icon}</span>
              <span className="truncate">{file.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 4. PROJECT PREVIEW WIDGET
export function ProjectPreviewWidget({ url, status }: { url: string | null; status: 'live' | 'preview' | 'none' }) {
  const [screenshot, setScreenshot] = useState<string>('');

  useEffect(() => {
    if (url) {
      fetch(`/api/powertools?tool=screenshot&url=${encodeURIComponent(url)}&width=800&height=600`)
        .then(res => res.json())
        .then(data => setScreenshot(data.url))
        .catch(console.error);
    }
  }, [url]);

  if (!url || status === 'none') {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 text-center">
        <div className="text-4xl mb-3">🚧</div>
        <p className="text-gray-400">Vorschau noch nicht verfügbar</p>
        <p className="text-xs text-gray-500 mt-1">Wird freigeschaltet sobald bereit</p>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10">
      <div className="p-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          </div>
          <span className="text-xs text-gray-400 truncate">{url}</span>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${
          status === 'live' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'
        }`}>
          {status === 'live' ? '🟢 Live' : '🟡 Preview'}
        </span>
      </div>
      <a href={url} target="_blank" rel="noopener noreferrer" className="block">
        {screenshot ? (
          <img src={screenshot} alt="Website Preview" className="w-full aspect-video object-cover hover:opacity-90 transition-opacity" />
        ) : (
          <div className="w-full aspect-video bg-gray-800 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </a>
    </div>
  );
}

// 5. QUICK CONTACT WIDGET
export function QuickContactWidget({ manager }: { manager: { name: string; email: string; phone?: string; avatar?: string } }) {
  return (
    <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
      <h3 className="text-sm font-semibold text-white mb-3">👤 Ihr Ansprechpartner</h3>
      <div className="flex items-center gap-4">
        <img 
          src={manager.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(manager.name)}&background=FC682C&color=fff&size=64`}
          alt={manager.name}
          className="w-14 h-14 rounded-full border-2 border-orange-500"
        />
        <div>
          <div className="font-medium text-white">{manager.name}</div>
          <div className="text-xs text-gray-400">Projektmanager</div>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <a href={`mailto:${manager.email}`} className="flex items-center gap-2 text-sm text-gray-300 hover:text-orange-400 transition-colors">
          <span>📧</span> {manager.email}
        </a>
        {manager.phone && (
          <a href={`tel:${manager.phone}`} className="flex items-center gap-2 text-sm text-gray-300 hover:text-orange-400 transition-colors">
            <span>📱</span> {manager.phone}
          </a>
        )}
      </div>
      <button className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-sm font-medium transition-colors">
        💬 Nachricht senden
      </button>
    </div>
  );
}

// 6. DEADLINE WIDGET
export function DeadlineWidget({ deadlines }: { deadlines: { title: string; date: string; type: string }[] }) {
  const [countdowns, setCountdowns] = useState<any[]>([]);

  useEffect(() => {
    const update = async () => {
      const results = await Promise.all(
        deadlines.map(async (d) => {
          const res = await fetch(`/api/powertools?tool=countdown&date=${d.date}`);
          const data = await res.json();
          return { ...d, countdown: data };
        })
      );
      setCountdowns(results);
    };
    
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [deadlines]);

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
      <h3 className="text-sm font-semibold text-white mb-3">⏰ Anstehende Termine</h3>
      <div className="space-y-3">
        {countdowns.map((item, i) => (
          <div key={i} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
            <div>
              <div className="text-sm text-white">{item.title}</div>
              <div className="text-xs text-gray-500">{item.type}</div>
            </div>
            <div className={`text-sm font-medium ${
              item.countdown?.expired ? 'text-red-400' : 
              item.countdown?.days < 3 ? 'text-orange-400' : 'text-green-400'
            }`}>
              {item.countdown?.text || '...'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 7. APPROVAL CARD
export function ApprovalCard({ title, description, status, onApprove, onReject }: {
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  onApprove?: () => void;
  onReject?: () => void;
}) {
  const statusConfig = {
    pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: '⏳ Wartet auf Freigabe' },
    approved: { bg: 'bg-green-500/10', text: 'text-green-400', label: '✅ Freigegeben' },
    rejected: { bg: 'bg-red-500/10', text: 'text-red-400', label: '❌ Abgelehnt' },
  };

  const config = statusConfig[status];

  return (
    <div className={`${config.bg} backdrop-blur-sm rounded-xl p-4 border border-white/10`}>
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-white">{title}</h4>
        <span className={`text-xs ${config.text}`}>{config.label}</span>
      </div>
      <p className="text-sm text-gray-400 mb-4">{description}</p>
      {status === 'pending' && (
        <div className="flex gap-2">
          <button 
            onClick={onApprove}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-medium transition-colors"
          >
            ✓ Freigeben
          </button>
          <button 
            onClick={onReject}
            className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            ✗ Ablehnen
          </button>
        </div>
      )}
    </div>
  );
}

// 8. NOTIFICATION BELL
export function NotificationBell({ count }: { count: number }) {
  return (
    <div className="relative">
      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
        <span className="text-xl">🔔</span>
      </button>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-medium">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </div>
  );
}

// 9. INVOICE LIST
export function InvoiceListWidget({ invoices }: { invoices: { id: string; amount: number; status: 'paid' | 'pending' | 'overdue'; date: string }[] }) {
  const statusConfig = {
    paid: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Bezahlt' },
    pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Offen' },
    overdue: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Überfällig' },
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
      <h3 className="text-sm font-semibold text-white mb-3">💶 Rechnungen</h3>
      <div className="space-y-2">
        {invoices.map((inv) => {
          const config = statusConfig[inv.status];
          return (
            <div key={inv.id} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
              <div className="flex items-center gap-3">
                <span>📄</span>
                <div>
                  <div className="text-sm text-white">#{inv.id}</div>
                  <div className="text-xs text-gray-500">{inv.date}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-white">{inv.amount.toLocaleString('de-DE')} €</div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${config.bg} ${config.text}`}>
                  {config.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 10. GREETING WIDGET
export function GreetingWidget({ name }: { name: string }) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Guten Morgen', emoji: '☀️' };
    if (hour < 18) return { text: 'Guten Tag', emoji: '👋' };
    return { text: 'Guten Abend', emoji: '🌙' };
  };

  const greeting = getGreeting();

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-white">
        {greeting.emoji} {greeting.text}, {name}!
      </h1>
      <p className="text-gray-400 mt-1">Hier ist der aktuelle Stand Ihres Projekts.</p>
    </div>
  );
}

// DEFAULT EXPORT - FULL PORTAL DASHBOARD
export default function PortalDashboardWidgets({ 
  clientName = 'Kunde',
  progress = 65,
  manager = { name: 'Max Mustermann', email: 'max@agentflowm.com' }
}) {
  return (
    <div className="space-y-6">
      <GreetingWidget name={clientName} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ProgressRingWidget percentage={progress} label="Projektfortschritt" />
        <QuickContactWidget manager={manager} />
        <DeadlineWidget deadlines={[
          { title: 'Design Review', date: '2026-02-10', type: 'Meilenstein' },
          { title: 'Launch', date: '2026-02-28', type: 'Deadline' },
        ]} />
      </div>
    </div>
  );
}
