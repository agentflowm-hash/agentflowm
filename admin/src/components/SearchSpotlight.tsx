"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  MagnifyingGlassIcon,
  UserIcon,
  DocumentIcon,
  EnvelopeIcon,
  CalendarIcon,
  CurrencyEuroIcon,
  ArrowRightIcon,
  CommandLineIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface SearchResult {
  id: string;
  type: "lead" | "client" | "deal" | "email" | "task";
  title: string;
  subtitle: string;
  action?: () => void;
}

interface SearchSpotlightProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch?: (query: string) => Promise<SearchResult[]>;
  onSelect?: (result: SearchResult) => void;
  placeholder?: string;
}

const typeIcons = {
  lead: { icon: UserIcon, color: "text-blue-400" },
  client: { icon: UserIcon, color: "text-emerald-400" },
  deal: { icon: CurrencyEuroIcon, color: "text-amber-400" },
  email: { icon: EnvelopeIcon, color: "text-purple-400" },
  task: { icon: CalendarIcon, color: "text-cyan-400" },
};

export default function SearchSpotlight({
  isOpen,
  onClose,
  onSearch,
  onSelect,
  placeholder = "Suchen...",
}: SearchSpotlightProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Search
  useEffect(() => {
    if (!query.trim() || !onSearch) {
      setResults([]);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      const res = await onSearch(query);
      setResults(res);
      setSelectedIndex(0);
      setLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((i) => Math.max(i - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (results[selectedIndex]) {
            onSelect?.(results[selectedIndex]);
            onClose();
          }
          break;
        case "Escape":
          onClose();
          break;
      }
    },
    [results, selectedIndex, onSelect, onClose]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Spotlight */}
      <div className="relative w-full max-w-2xl mx-4 bg-[#0f0f12] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
          <MagnifyingGlassIcon className="w-5 h-5 text-white/40" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-white text-lg placeholder:text-white/30 focus:outline-none"
          />
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 text-xs text-white/30 bg-white/[0.05] rounded border border-white/[0.1]">
              ESC
            </kbd>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg">
              <XMarkIcon className="w-5 h-5 text-white/40" />
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-6 h-6 border-2 border-[#FC682C] border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : results.length > 0 ? (
            <div className="p-2">
              {results.map((result, i) => {
                const { icon: Icon, color } = typeIcons[result.type];
                return (
                  <button
                    key={result.id}
                    onClick={() => {
                      onSelect?.(result);
                      onClose();
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                      i === selectedIndex
                        ? "bg-[#FC682C]/10 border border-[#FC682C]/30"
                        : "hover:bg-white/[0.03]"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg bg-white/[0.05] flex items-center justify-center ${color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-white">{result.title}</p>
                      <p className="text-xs text-white/40">{result.subtitle}</p>
                    </div>
                    <ArrowRightIcon className="w-4 h-4 text-white/20" />
                  </button>
                );
              })}
            </div>
          ) : query ? (
            <div className="p-8 text-center text-white/40">
              <p>Keine Ergebnisse für "{query}"</p>
            </div>
          ) : (
            <div className="p-6">
              <p className="text-xs text-white/30 mb-4">Schnellaktionen</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Neuer Lead", icon: UserIcon },
                  { label: "Neue E-Mail", icon: EnvelopeIcon },
                  { label: "Neuer Deal", icon: CurrencyEuroIcon },
                  { label: "Neue Aufgabe", icon: CalendarIcon },
                ].map((action, i) => (
                  <button
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] transition-all"
                  >
                    <action.icon className="w-5 h-5 text-[#FC682C]" />
                    <span className="text-sm text-white/70">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.06] bg-white/[0.01]">
          <div className="flex items-center gap-4 text-xs text-white/30">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white/[0.05] rounded border border-white/[0.1]">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white/[0.05] rounded border border-white/[0.1]">↓</kbd>
              navigieren
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white/[0.05] rounded border border-white/[0.1]">↵</kbd>
              öffnen
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-white/30">
            <CommandLineIcon className="w-3 h-3" />
            <span>⌘K</span>
          </div>
        </div>
      </div>
    </div>
  );
}
