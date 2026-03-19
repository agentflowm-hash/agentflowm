"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  MagnifyingGlassIcon, XMarkIcon, UserIcon, UserGroupIcon,
  DocumentTextIcon, LockClosedIcon,
} from "@heroicons/react/24/outline";

interface SearchResult {
  type: "lead" | "client" | "invoice" | "vault";
  id: number;
  title: string;
  subtitle: string;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: string, id: number) => void;
}

const TYPE_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  lead: { label: "Leads", icon: UserIcon, color: "text-blue-400 bg-blue-500/15" },
  client: { label: "Kunden", icon: UserGroupIcon, color: "text-green-400 bg-green-500/15" },
  invoice: { label: "Dokumente", icon: DocumentTextIcon, color: "text-[#FC682C] bg-[#FC682C]/15" },
  vault: { label: "Datentresor", icon: LockClosedIcon, color: "text-purple-400 bg-purple-500/15" },
};

export default function GlobalSearch({ isOpen, onClose, onSelect }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) { setTimeout(() => inputRef.current?.focus(), 100); setQuery(""); setResults([]); }
  }, [isOpen]);

  // Debounced search
  const search = useCallback((q: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (q.length < 2) { setResults([]); return; }
    timerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { credentials: "include" });
        const data = await res.json();
        const unwrapped = data?.data || data;
        setResults(unwrapped?.results || []);
        setSelectedIdx(0);
      } catch { setResults([]); }
      setLoading(false);
    }, 300);
  }, []);

  useEffect(() => { search(query); }, [query, search]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { onClose(); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIdx(i => Math.min(i + 1, results.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIdx(i => Math.max(i - 1, 0)); }
    if (e.key === "Enter" && results[selectedIdx]) {
      onSelect(results[selectedIdx].type, results[selectedIdx].id);
      onClose();
    }
  };

  // Group results by type
  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    if (!acc[r.type]) acc[r.type] = [];
    acc[r.type].push(r);
    return acc;
  }, {});

  if (!isOpen) return null;

  let globalIdx = -1;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-xl bg-[#111827] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()} onKeyDown={handleKeyDown}>

        {/* Search Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
          <MagnifyingGlassIcon className="w-5 h-5 text-white/30 flex-shrink-0" />
          <input ref={inputRef} type="text" value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Kunden, Leads, Rechnungen, Tresor durchsuchen..."
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/30" />
          {loading && <div className="w-4 h-4 border-2 border-white/20 border-t-[#FC682C] rounded-full animate-spin flex-shrink-0" />}
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg">
            <XMarkIcon className="w-4 h-4 text-white/40" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto">
          {query.length >= 2 && results.length === 0 && !loading && (
            <div className="p-8 text-center text-white/30 text-sm">Keine Ergebnisse</div>
          )}

          {Object.entries(grouped).map(([type, items]) => {
            const config = TYPE_CONFIG[type] || TYPE_CONFIG.lead;
            const TypeIcon = config.icon;
            return (
              <div key={type}>
                <div className="px-4 py-2 text-[10px] text-white/40 uppercase tracking-wider font-semibold bg-white/[0.02]">
                  {config.label}
                </div>
                {items.map(item => {
                  globalIdx++;
                  const idx = globalIdx;
                  return (
                    <button key={`${type}-${item.id}`}
                      onClick={() => { onSelect(item.type, item.id); onClose(); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${idx === selectedIdx ? 'bg-[#FC682C]/10' : 'hover:bg-white/[0.03]'}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${config.color}`}>
                        <TypeIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white font-medium truncate">{item.title}</div>
                        <div className="text-[11px] text-white/35 truncate">{item.subtitle}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-white/25">
          <span>↑↓ Navigieren · Enter Auswählen · Esc Schließen</span>
          <span className="px-1.5 py-0.5 bg-white/[0.06] rounded text-[9px]">⌘K</span>
        </div>
      </div>
    </div>
  );
}
