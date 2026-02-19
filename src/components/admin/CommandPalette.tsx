"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Command {
  id: string;
  name: string;
  description: string;
  icon: string;
  shortcut?: string;
  action: () => void;
  category: string;
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = [
    // Navigation
    { id: "nav-home", name: "Zur Startseite", description: "Website öffnen", icon: "🏠", category: "Navigation", action: () => window.open("/", "_blank") },
    { id: "nav-pakete", name: "Pakete ansehen", description: "Pricing Seite", icon: "📦", category: "Navigation", action: () => window.open("/pakete", "_blank") },
    { id: "nav-stripe", name: "Stripe Dashboard", description: "Zahlungen verwalten", icon: "💳", category: "Navigation", action: () => window.open("https://dashboard.stripe.com", "_blank") },
    { id: "nav-supabase", name: "Supabase öffnen", description: "Datenbank", icon: "🗄️", category: "Navigation", action: () => window.open("https://supabase.com/dashboard", "_blank") },
    { id: "nav-vercel", name: "Vercel Dashboard", description: "Deployments", icon: "▲", category: "Navigation", action: () => window.open("https://vercel.com/dashboard", "_blank") },
    
    // Actions
    { id: "action-lead", name: "Neuen Lead erstellen", description: "Manuell Lead hinzufügen", icon: "📥", shortcut: "L", category: "Aktionen", action: () => alert("Lead erstellen Modal öffnen") },
    { id: "action-notify", name: "Notification senden", description: "Telegram Nachricht", icon: "📣", shortcut: "N", category: "Aktionen", action: () => alert("Notification Modal öffnen") },
    { id: "action-invoice", name: "Rechnung erstellen", description: "Neue Rechnung", icon: "📄", shortcut: "I", category: "Aktionen", action: () => alert("Invoice Modal öffnen") },
    { id: "action-refresh", name: "Dashboard aktualisieren", description: "Alle Daten neu laden", icon: "🔄", shortcut: "R", category: "Aktionen", action: () => window.location.reload() },
    
    // Tools
    { id: "tool-qr", name: "QR Code generieren", description: "Schneller QR Generator", icon: "📱", category: "Tools", action: () => alert("QR Modal öffnen") },
    { id: "tool-password", name: "Passwort generieren", description: "Sicheres Passwort", icon: "🔐", category: "Tools", action: () => alert("Password Modal öffnen") },
    { id: "tool-export", name: "Daten exportieren", description: "CSV/JSON Export", icon: "📊", category: "Tools", action: () => alert("Export Modal öffnen") },
    
    // Quick Links
    { id: "link-calendly", name: "Calendly öffnen", description: "Termine verwalten", icon: "📅", category: "Links", action: () => window.open("https://calendly.com/agentflowm", "_blank") },
    { id: "link-analytics", name: "Google Analytics", description: "Traffic analysieren", icon: "📈", category: "Links", action: () => window.open("https://analytics.google.com", "_blank") },
    { id: "link-github", name: "GitHub Repository", description: "Code ansehen", icon: "🐙", category: "Links", action: () => window.open("https://github.com/agentflowm-hash", "_blank") },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.name.toLowerCase().includes(search.toLowerCase()) ||
    cmd.description.toLowerCase().includes(search.toLowerCase()) ||
    cmd.category.toLowerCase().includes(search.toLowerCase())
  );

  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, Command[]>);

  // Keyboard shortcut to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setSearch("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filteredCommands.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    }
    if (e.key === "Enter" && filteredCommands[selectedIndex]) {
      filteredCommands[selectedIndex].action();
      setIsOpen(false);
    }
  }, [filteredCommands, selectedIndex]);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/60 text-sm transition-colors backdrop-blur-sm"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span>Suche</span>
        <kbd className="hidden md:inline px-2 py-0.5 bg-white/10 rounded text-xs">⌘K</kbd>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            />

            {/* Palette */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed top-[20%] left-1/2 -translate-x-1/2 z-50 w-full max-w-xl"
            >
              <div className="bg-[#0f0f15] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                {/* Search Input */}
                <div className="p-4 border-b border-white/10">
                  <div className="relative">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      ref={inputRef}
                      type="text"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setSelectedIndex(0);
                      }}
                      onKeyDown={handleKeyDown}
                      placeholder="Suche nach Befehlen..."
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#FC682C]/50"
                    />
                  </div>
                </div>

                {/* Commands */}
                <div className="max-h-[50vh] overflow-y-auto">
                  {Object.entries(groupedCommands).map(([category, cmds]) => (
                    <div key={category}>
                      <div className="px-4 py-2 text-xs font-medium text-white/30 uppercase tracking-wider bg-white/[0.02]">
                        {category}
                      </div>
                      {cmds.map((cmd) => {
                        const index = filteredCommands.indexOf(cmd);
                        const isSelected = index === selectedIndex;
                        
                        return (
                          <button
                            key={cmd.id}
                            onClick={() => {
                              cmd.action();
                              setIsOpen(false);
                            }}
                            onMouseEnter={() => setSelectedIndex(index)}
                            className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${
                              isSelected ? "bg-[#FC682C]/20" : "hover:bg-white/5"
                            }`}
                          >
                            <span className="text-xl flex-shrink-0">{cmd.icon}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-medium text-sm">{cmd.name}</p>
                              <p className="text-white/40 text-xs truncate">{cmd.description}</p>
                            </div>
                            {cmd.shortcut && (
                              <kbd className="px-2 py-1 bg-white/10 rounded text-white/40 text-xs flex-shrink-0">
                                {cmd.shortcut}
                              </kbd>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))}

                  {filteredCommands.length === 0 && (
                    <div className="p-8 text-center text-white/40">
                      <span className="text-3xl mb-2 block">🔍</span>
                      Keine Befehle gefunden
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-xs text-white/30">
                  <div className="flex items-center gap-3">
                    <span><kbd className="px-1 py-0.5 bg-white/10 rounded">↑↓</kbd> navigieren</span>
                    <span><kbd className="px-1 py-0.5 bg-white/10 rounded">↵</kbd> ausführen</span>
                  </div>
                  <span><kbd className="px-1 py-0.5 bg-white/10 rounded">Esc</kbd> schließen</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
