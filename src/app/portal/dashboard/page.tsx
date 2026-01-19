"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Tab = "overview" | "messages" | "files";

interface ProjectData {
  client: { id: number; name: string; email: string; company: string | null };
  project: {
    id: number;
    name: string;
    package: string;
    status: string;
    statusLabel: string;
    progress: number;
    startDate: string;
    estimatedEnd: string;
    manager: string;
  };
  milestones: { id: number; title: string; status: string; date: string | null }[];
  messages: { id: number; from: string; senderType: string; text: string; time: string; unread: boolean }[];
  files: { id: number; name: string; size: string; date: string; type: string }[];
  unreadCount: number;
}

export default function PortalDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [newMessage, setNewMessage] = useState("");
  const [data, setData] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/portal/project");
      if (res.status === 401) {
        router.push("/portal");
        return;
      }
      if (!res.ok) throw new Error("Fehler beim Laden");
      const json = await res.json();
      setData(json);
      setError(null);
    } catch {
      setError("Daten konnten nicht geladen werden");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = async () => {
    await fetch("/api/portal/auth/logout", { method: "POST" });
    router.push("/portal");
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const res = await fetch("/api/portal/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newMessage }),
      });

      if (res.ok) {
        const { message } = await res.json();
        setData((prev) => prev ? { ...prev, messages: [message, ...prev.messages] } : null);
        setNewMessage("");
      }
    } catch {
      // ignore
    } finally {
      setSending(false);
    }
  };

  const markAsRead = async () => {
    if (!data?.unreadCount) return;
    await fetch("/api/portal/messages", { method: "PATCH" });
    setData((prev) => prev ? {
      ...prev,
      unreadCount: 0,
      messages: prev.messages.map((m) => ({ ...m, unread: false })),
    } : null);
  };

  useEffect(() => {
    if (activeTab === "messages" && data?.unreadCount) {
      markAsRead();
    }
  }, [activeTab, data?.unreadCount]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030308] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
            <div className="absolute inset-0 rounded-full border-4 border-[#FC682C] border-t-transparent spinner"></div>
          </div>
          <p className="text-white/50 text-lg">Dashboard wird geladen...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#030308] flex items-center justify-center p-4">
        <div className="portal-card text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Fehler beim Laden</h2>
          <p className="text-white/50 mb-6">{error || "Etwas ist schief gelaufen"}</p>
          <button onClick={fetchData} className="portal-btn">Erneut versuchen</button>
        </div>
      </div>
    );
  }

  const { client, project, milestones, messages, files, unreadCount } = data;
  const completedMilestones = milestones.filter((m) => m.status === "done").length;

  return (
    <div className="min-h-screen bg-[#030308]">
      {/* Header */}
      <header className="border-b border-white/[0.06] bg-[#0f0f12]/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Image src="/brand/logo-primary-dark.png" alt="AgentFlow" width={140} height={35} className="h-8 w-auto" />
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FC682C] to-[#FF8F5C] flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{client.name.charAt(0)}</span>
                </div>
                <span className="text-sm text-white">{client.name.split(" ")[0]}</span>
              </div>
              <button onClick={handleLogout} className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-white/[0.06] bg-[#030308]/80 backdrop-blur-xl sticky top-[65px] z-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex gap-1 -mb-px">
            {[
              { id: "overview" as Tab, label: "Übersicht", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
              { id: "messages" as Tab, label: "Nachrichten", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", badge: unreadCount },
              { id: "files" as Tab, label: "Dateien", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", badge: files.length },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-all ${
                  activeTab === item.id ? "text-[#FC682C] border-[#FC682C]" : "text-white/50 border-transparent hover:text-white"
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                <span className="hidden sm:inline">{item.label}</span>
                {item.badge ? (
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                    item.id === "messages" && unreadCount > 0 ? "bg-[#FC682C] text-white" : "bg-white/10 text-white/60"
                  }`}>
                    {item.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {activeTab === "overview" && (
          <div className="space-y-6 animate-fade-in">
            {/* Welcome */}
            <div className="portal-card">
              <h2 className="text-xl font-bold text-white mb-1">Willkommen, {client.name.split(" ")[0]}!</h2>
              <p className="text-white/50">Hier ist der aktuelle Stand Ihres Projekts.</p>
            </div>

            {/* Project Status */}
            <div className="portal-card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Projekt</p>
                  <h2 className="text-xl font-bold text-white">{project.name}</h2>
                  <p className="text-white/50 mt-1">Paket: <span className="text-[#FC682C] font-medium">{project.package}</span></p>
                </div>
                <span className={`status-badge status-${project.status}`}>
                  <span className="w-2 h-2 rounded-full bg-current"></span>
                  {project.statusLabel}
                </span>
              </div>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/50">Fortschritt</span>
                  <span className="text-xl font-bold text-white">{project.progress}%</span>
                </div>
                <div className="h-3 bg-white/[0.05] rounded-full overflow-hidden border border-white/[0.08]">
                  <div className="progress-bar transition-all duration-1000" style={{ width: `${project.progress}%` }} />
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Projektstart", value: project.startDate },
                  { label: "Go-Live", value: project.estimatedEnd },
                  { label: "Meilensteine", value: `${completedMilestones}/${milestones.length}` },
                  { label: "Ansprechpartner", value: project.manager },
                ].map((item) => (
                  <div key={item.label} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <p className="text-xs text-white/40 mb-1">{item.label}</p>
                    <p className="text-white font-medium text-sm">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="portal-card">
              <h3 className="text-lg font-bold text-white mb-4">Timeline</h3>
              <div className="relative">
                <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-gradient-to-b from-emerald-500 via-[#FC682C] to-white/10"></div>
                <div className="space-y-3">
                  {milestones.map((m, i) => (
                    <div key={m.id} className="relative flex items-center gap-3 pl-1">
                      <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                        m.status === "done" ? "milestone-done" : m.status === "current" ? "milestone-current" : "milestone-pending"
                      }`}>
                        {m.status === "done" ? (
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <span className="text-[10px] font-semibold">{i + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 flex items-center justify-between py-2">
                        <p className={`text-sm ${m.status === "pending" ? "text-white/40" : "text-white"}`}>{m.title}</p>
                        <span className="text-xs text-white/40">{m.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "messages" && (
          <div className="portal-card animate-fade-in">
            <h3 className="text-lg font-bold text-white mb-4">Nachrichten</h3>

            <div className="space-y-3 mb-4 max-h-[400px] overflow-y-auto">
              {messages.length === 0 ? (
                <p className="text-center text-white/40 py-8">Noch keine Nachrichten</p>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`message-bubble ${msg.senderType === "client" ? "message-bubble-client ml-8" : "message-bubble-admin mr-8"}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-semibold ${msg.senderType === "client" ? "text-[#FC682C]" : "text-white"}`}>{msg.from}</span>
                      <span className="text-xs text-white/30">{msg.time}</span>
                    </div>
                    <p className="text-white/70 text-sm">{msg.text}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={sendMessage} className="flex gap-3 pt-4 border-t border-white/[0.06]">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Nachricht schreiben..."
                className="portal-input flex-1"
                disabled={sending}
              />
              <button type="submit" disabled={!newMessage.trim() || sending} className="portal-btn disabled:opacity-50 px-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        )}

        {activeTab === "files" && (
          <div className="portal-card animate-fade-in">
            <h3 className="text-lg font-bold text-white mb-4">Projektdateien</h3>

            {files.length === 0 ? (
              <p className="text-center text-white/40 py-8">Noch keine Dateien</p>
            ) : (
              <div className="space-y-2">
                {files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] transition-all">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center file-icon-${file.type}`}>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-white/40">{file.size} · {file.date}</p>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 text-sm text-[#FC682C] hover:bg-[#FC682C]/10 rounded-lg transition-colors">
                      Download
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] mt-auto">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <a href="/" className="text-sm text-white/40 hover:text-white transition-colors">
              ← Zurück zur Website
            </a>
            <p className="text-sm text-white/40">
              Fragen? <a href="mailto:kontakt@agentflowm.com" className="text-[#FC682C] hover:underline">kontakt@agentflowm.com</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
