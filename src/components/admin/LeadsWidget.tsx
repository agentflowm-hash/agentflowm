"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  source: string;
  status: string;
  created_at: string;
  message?: string;
}

export function LeadsWidget() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [filter, setFilter] = useState<"all" | "new" | "contacted">("all");

  useEffect(() => {
    fetchLeads();
    // Poll for new leads every 30 seconds
    const interval = setInterval(fetchLeads, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/admin/leads");
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
      }
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (id: string, status: string) => {
    try {
      await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      fetchLeads();
    } catch (error) {
      console.error("Failed to update lead:", error);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    if (filter === "all") return true;
    return lead.status === filter;
  });

  const newLeadsCount = leads.filter((l) => l.status === "new").length;

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "chat_widget": return "💬";
      case "contact_form": return "📝";
      case "website_check": return "🔍";
      case "referral": return "🤝";
      default: return "📧";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "contacted": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "qualified": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "closed": return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default: return "bg-white/10 text-white/60 border-white/20";
    }
  };

  const timeAgo = (date: string) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "gerade eben";
    if (seconds < 3600) return `vor ${Math.floor(seconds / 60)} Min`;
    if (seconds < 86400) return `vor ${Math.floor(seconds / 3600)} Std`;
    return `vor ${Math.floor(seconds / 86400)} Tagen`;
  };

  return (
    <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-2xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
            <span className="text-xl">📥</span>
          </div>
          <div>
            <h3 className="font-semibold text-white flex items-center gap-2">
              Live Leads
              {newLeadsCount > 0 && (
                <span className="px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded-full animate-pulse">
                  {newLeadsCount} NEU
                </span>
              )}
            </h3>
            <p className="text-white/40 text-sm">{leads.length} gesamt</p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-1">
          {(["all", "new", "contacted"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                filter === f
                  ? "bg-[#FC682C] text-white"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              {f === "all" ? "Alle" : f === "new" ? "Neu" : "Kontaktiert"}
            </button>
          ))}
        </div>
      </div>

      {/* Leads List */}
      <div className="max-h-[400px] overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-[#FC682C] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-8 text-center text-white/40">
            <span className="text-4xl mb-2 block">📭</span>
            Keine Leads gefunden
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filteredLeads.map((lead) => (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 hover:bg-white/5 cursor-pointer transition-colors"
                onClick={() => setSelectedLead(lead)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <span className="text-xl flex-shrink-0">{getSourceIcon(lead.source)}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-white truncate">{lead.name}</p>
                      <p className="text-white/50 text-sm truncate">{lead.email}</p>
                      {lead.message && (
                        <p className="text-white/30 text-xs mt-1 line-clamp-1">{lead.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                    <p className="text-white/30 text-xs mt-1">{timeAgo(lead.created_at)}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lead Detail Modal */}
      <AnimatePresence>
        {selectedLead && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedLead(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0a0a0f] rounded-2xl border border-white/10 w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">{selectedLead.name}</h3>
                  <button
                    onClick={() => setSelectedLead(null)}
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getSourceIcon(selectedLead.source)}</span>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(selectedLead.status)}`}>
                    {selectedLead.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-white/40 text-sm">E-Mail</p>
                    <a href={`mailto:${selectedLead.email}`} className="text-[#FC682C] hover:underline">
                      {selectedLead.email}
                    </a>
                  </div>
                  {selectedLead.phone && (
                    <div>
                      <p className="text-white/40 text-sm">Telefon</p>
                      <a href={`tel:${selectedLead.phone}`} className="text-white hover:text-[#FC682C]">
                        {selectedLead.phone}
                      </a>
                    </div>
                  )}
                  {selectedLead.message && (
                    <div>
                      <p className="text-white/40 text-sm">Nachricht</p>
                      <p className="text-white/80 text-sm whitespace-pre-wrap">{selectedLead.message}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-white/40 text-sm">Eingegangen</p>
                    <p className="text-white/80">{new Date(selectedLead.created_at).toLocaleString("de-DE")}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-white/10 flex gap-2">
                <button
                  onClick={() => {
                    updateLeadStatus(selectedLead.id, "contacted");
                    setSelectedLead(null);
                  }}
                  className="flex-1 py-3 bg-blue-500/20 text-blue-400 font-medium rounded-xl hover:bg-blue-500/30 transition-colors"
                >
                  Als kontaktiert markieren
                </button>
                <a
                  href={`mailto:${selectedLead.email}`}
                  className="flex-1 py-3 bg-[#FC682C] text-white font-medium rounded-xl hover:bg-[#FC682C]/90 transition-colors text-center"
                >
                  E-Mail senden
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
