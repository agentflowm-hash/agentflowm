"use client";

import { useState, useEffect, useCallback } from "react";
import {
  EnvelopeIcon,
  PaperAirplaneIcon,
  DocumentDuplicateIcon,
  ChartBarIcon,
  EyeIcon,
  CursorArrowRaysIcon,
  PlusIcon,
  XMarkIcon,
  CheckIcon,
  ClockIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  body: string;
  category: string;
  variables: string[];
  usage_count: number;
}

interface SentEmail {
  id: number;
  to_email: string;
  subject: string;
  status: string;
  sent_at: string;
  opened_at: string | null;
  clicked_at: string | null;
  open_count: number;
  click_count: number;
  client?: { id: number; name: string; email: string };
}

export default function EmailCenterTab() {
  const [activeSection, setActiveSection] = useState<"compose" | "templates" | "history" | "stats">("compose");
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [emails, setEmails] = useState<SentEmail[]>([]);
  const [stats, setStats] = useState({ total: 0, opened: 0, clicked: 0, openRate: 0 });
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<any[]>([]);

  // Compose State
  const [compose, setCompose] = useState({
    to: "",
    subject: "",
    body: "",
    template_id: "",
    client_id: "",
  });
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ success: boolean; message: string } | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [templatesRes, emailsRes, clientsRes] = await Promise.all([
        fetch("/api/email-templates", { credentials: "include" }),
        fetch("/api/emails?limit=100", { credentials: "include" }),
        fetch("/api/clients", { credentials: "include" }),
      ]);

      if (templatesRes.ok) {
        const data = await templatesRes.json();
        setTemplates(data.templates || []);
      }
      if (emailsRes.ok) {
        const data = await emailsRes.json();
        setEmails(data.emails || []);
        setStats(data.stats || { total: 0, opened: 0, clicked: 0, openRate: 0 });
      }
      if (clientsRes.ok) {
        const data = await clientsRes.json();
        setClients(data.clients || []);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSend = async () => {
    if (!compose.to || !compose.subject || !compose.body) {
      setSendResult({ success: false, message: "Bitte alle Felder ausfüllen" });
      return;
    }

    setSending(true);
    setSendResult(null);

    try {
      const res = await fetch("/api/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          to: compose.to.split(",").map(e => e.trim()),
          subject: compose.subject,
          html: compose.body,
          client_id: compose.client_id || undefined,
          template_id: compose.template_id || undefined,
          track_opens: true,
          track_clicks: true,
        }),
      });

      if (res.ok) {
        setSendResult({ success: true, message: "Email erfolgreich gesendet!" });
        setCompose({ to: "", subject: "", body: "", template_id: "", client_id: "" });
        fetchData();
      } else {
        const err = await res.json();
        setSendResult({ success: false, message: err.error || "Fehler beim Senden" });
      }
    } catch (error) {
      setSendResult({ success: false, message: "Netzwerkfehler" });
    }

    setSending(false);
  };

  const applyTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === parseInt(templateId));
    if (template) {
      setCompose({
        ...compose,
        template_id: templateId,
        subject: template.subject,
        body: template.body,
      });
    }
  };

  const selectClient = (clientId: string) => {
    const client = clients.find(c => c.id === parseInt(clientId));
    if (client) {
      setCompose({
        ...compose,
        client_id: clientId,
        to: client.email,
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      sent: "bg-green-500/20 text-green-400",
      sending: "bg-yellow-500/20 text-yellow-400",
      failed: "bg-red-500/20 text-red-400",
      scheduled: "bg-blue-500/20 text-blue-400",
    };
    return styles[status] || "bg-white/20 text-white/60";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <EnvelopeIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Email Center</h2>
            <p className="text-sm text-white/40">{stats.total} Emails gesendet • {stats.openRate}% Öffnungsrate</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl border border-green-500/20">
          <div className="flex items-center gap-2 mb-1">
            <PaperAirplaneIcon className="w-4 h-4 text-green-400" />
            <span className="text-xs text-white/50">Gesendet</span>
          </div>
          <div className="text-2xl font-bold text-green-400">{stats.total}</div>
        </div>
        <div className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl border border-blue-500/20">
          <div className="flex items-center gap-2 mb-1">
            <EyeIcon className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-white/50">Geöffnet</span>
          </div>
          <div className="text-2xl font-bold text-blue-400">{stats.opened}</div>
        </div>
        <div className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-xl border border-purple-500/20">
          <div className="flex items-center gap-2 mb-1">
            <CursorArrowRaysIcon className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-white/50">Geklickt</span>
          </div>
          <div className="text-2xl font-bold text-purple-400">{stats.clicked}</div>
        </div>
        <div className="p-4 bg-gradient-to-br from-[#FC682C]/10 to-[#FC682C]/5 rounded-xl border border-[#FC682C]/20">
          <div className="flex items-center gap-2 mb-1">
            <ChartBarIcon className="w-4 h-4 text-[#FC682C]" />
            <span className="text-xs text-white/50">Öffnungsrate</span>
          </div>
          <div className="text-2xl font-bold text-[#FC682C]">{stats.openRate}%</div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex bg-white/5 rounded-xl p-1 w-fit">
        {[
          { id: "compose", label: "Verfassen", icon: PaperAirplaneIcon },
          { id: "templates", label: "Templates", icon: DocumentDuplicateIcon },
          { id: "history", label: "Verlauf", icon: ClockIcon },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
              activeSection === id 
                ? "bg-[#FC682C] text-white" 
                : "text-white/50 hover:text-white"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-[#0f0f12]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6">
        {activeSection === "compose" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Neue Email</h3>
            
            {/* Quick Select */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/60 mb-1">Kunde auswählen</label>
                <select
                  value={compose.client_id}
                  onChange={(e) => selectClient(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/10 rounded-lg text-white focus:border-[#FC682C]/50 outline-none"
                >
                  <option value="">Manuell eingeben</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name} ({client.email})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1">Template</label>
                <select
                  value={compose.template_id}
                  onChange={(e) => applyTemplate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/10 rounded-lg text-white focus:border-[#FC682C]/50 outline-none"
                >
                  <option value="">Kein Template</option>
                  {templates.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.category})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Email Fields */}
            <div>
              <label className="block text-sm text-white/60 mb-1">An (mehrere mit Komma)</label>
              <input
                type="text"
                value={compose.to}
                onChange={(e) => setCompose({ ...compose, to: e.target.value })}
                placeholder="email@example.com, email2@example.com"
                className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/10 rounded-lg text-white focus:border-[#FC682C]/50 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">Betreff</label>
              <input
                type="text"
                value={compose.subject}
                onChange={(e) => setCompose({ ...compose, subject: e.target.value })}
                placeholder="Email Betreff"
                className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/10 rounded-lg text-white focus:border-[#FC682C]/50 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">Nachricht (HTML erlaubt)</label>
              <textarea
                value={compose.body}
                onChange={(e) => setCompose({ ...compose, body: e.target.value })}
                rows={8}
                placeholder="<p>Hallo {{name}},</p><p>...</p>"
                className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/10 rounded-lg text-white focus:border-[#FC682C]/50 outline-none resize-none font-mono text-sm"
              />
            </div>

            {/* Result Message */}
            {sendResult && (
              <div className={`p-3 rounded-lg flex items-center gap-2 ${
                sendResult.success ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
              }`}>
                {sendResult.success ? <CheckIcon className="w-4 h-4" /> : <ExclamationCircleIcon className="w-4 h-4" />}
                {sendResult.message}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSend}
                disabled={sending}
                className="px-6 py-2.5 bg-gradient-to-r from-[#FC682C] to-[#FF8F5C] text-white rounded-xl text-sm font-medium flex items-center gap-2 disabled:opacity-50"
              >
                <PaperAirplaneIcon className="w-4 h-4" />
                {sending ? "Senden..." : "Jetzt senden"}
              </button>
            </div>
          </div>
        )}

        {activeSection === "templates" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Email Templates</h3>
              <button className="px-3 py-1.5 bg-[#FC682C] text-white rounded-lg text-sm flex items-center gap-1.5">
                <PlusIcon className="w-4 h-4" />
                Neu
              </button>
            </div>
            {templates.length === 0 ? (
              <p className="text-white/40 text-center py-8">Keine Templates vorhanden</p>
            ) : (
              <div className="grid gap-3">
                {templates.map(template => (
                  <div key={template.id} className="p-4 bg-white/[0.03] hover:bg-white/[0.05] rounded-xl transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-white">{template.name}</h4>
                        <p className="text-sm text-white/50 mt-1">{template.subject}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="px-2 py-0.5 bg-white/10 rounded text-xs text-white/60">{template.category}</span>
                          <span className="text-xs text-white/40">{template.usage_count}x verwendet</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setCompose({ ...compose, template_id: String(template.id), subject: template.subject, body: template.body });
                          setActiveSection("compose");
                        }}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs text-white transition-colors"
                      >
                        Verwenden
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeSection === "history" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Gesendete Emails</h3>
            {emails.length === 0 ? (
              <p className="text-white/40 text-center py-8">Noch keine Emails gesendet</p>
            ) : (
              <div className="space-y-2">
                {emails.map(email => (
                  <div key={email.id} className="p-4 bg-white/[0.03] hover:bg-white/[0.05] rounded-xl transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-white truncate">{email.subject}</h4>
                          <span className={`px-2 py-0.5 rounded text-xs ${getStatusBadge(email.status)}`}>
                            {email.status}
                          </span>
                        </div>
                        <p className="text-sm text-white/50 truncate">{email.to_email}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-white/40">
                          <span>{new Date(email.sent_at).toLocaleString("de-DE")}</span>
                          {email.opened_at && (
                            <span className="flex items-center gap-1 text-blue-400">
                              <EyeIcon className="w-3 h-3" />
                              Geöffnet ({email.open_count}x)
                            </span>
                          )}
                          {email.clicked_at && (
                            <span className="flex items-center gap-1 text-purple-400">
                              <CursorArrowRaysIcon className="w-3 h-3" />
                              Geklickt ({email.click_count}x)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
