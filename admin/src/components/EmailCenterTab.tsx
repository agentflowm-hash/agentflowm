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
  SparklesIcon,
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
  body?: string;
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
    scheduled_at: "",
  });
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ success: boolean; message: string } | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
  const [previewEmailId, setPreviewEmailId] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [templatesRes, emailsRes, clientsRes] = await Promise.all([
        fetch("/api/email-templates", { credentials: "include" }),
        fetch("/api/emails?limit=100", { credentials: "include" }),
        fetch("/api/clients", { credentials: "include" }),
      ]);

      if (templatesRes.ok) {
        const raw = await templatesRes.json();
        const data = raw.data || raw;
        setTemplates(data.templates || []);
      }
      if (emailsRes.ok) {
        const raw = await emailsRes.json();
        const data = raw.data || raw;
        setEmails(data.emails || []);
        setStats(data.stats || { total: 0, opened: 0, clicked: 0, openRate: 0 });
      }
      if (clientsRes.ok) {
        const raw = await clientsRes.json();
        const data = raw.data || raw;
        setClients(data.clients || []);
      }
    } catch {
      // Daten konnten nicht geladen werden
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSend = async () => {
    if (!compose.to || !compose.subject || !compose.body) {
      setSendResult({ success: false, message: "Bitte alle Felder ausfuellen" });
      return;
    }

    // E-Mail-Format validieren
    const emails = compose.to.split(",").map(e => e.trim()).filter(Boolean);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalid = emails.filter(e => !emailRegex.test(e));
    if (invalid.length > 0) {
      setSendResult({ success: false, message: `Ungueltige E-Mail-Adresse: ${invalid.join(", ")}` });
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
        setCompose({ to: "", subject: "", body: "", template_id: "", client_id: "", scheduled_at: "" });
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
      // Kundendaten fuer Platzhalter-Vorschau
      const selectedClient = clients.find(c => c.id === parseInt(compose.client_id));
      let body = template.body;
      let subj = template.subject;
      if (selectedClient) {
        const vars: Record<string, string> = {
          name: selectedClient.name || '',
          firma: (selectedClient as any).company || '',
          email: selectedClient.email || '',
        };
        for (const [k, v] of Object.entries(vars)) {
          body = body.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), v);
          subj = subj.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), v);
        }
      }
      setCompose({
        ...compose,
        template_id: templateId,
        subject: subj,
        body: body,
      });
    }
  };

  const selectClient = (clientId: string) => {
    const client = clients.find(c => c.id === parseInt(clientId));
    if (client) {
      let body = compose.body;
      let subj = compose.subject;
      // Platzhalter mit Kundendaten ersetzen
      const vars: Record<string, string> = {
        name: client.name || '',
        firma: (client as any).company || '',
        email: client.email || '',
      };
      for (const [k, v] of Object.entries(vars)) {
        body = body.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), v);
        subj = subj.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), v);
      }
      setCompose({
        ...compose,
        client_id: clientId,
        to: client.email,
        body,
        subject: subj,
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

            {/* Live Preview */}
            {compose.body && compose.body.length > 10 && (
              <div>
                <button
                  onClick={() => setPreviewTemplate(previewTemplate ? null : { id: 0, name: 'Preview', subject: compose.subject, body: compose.body, category: '', variables: [], usage_count: 0 })}
                  className="text-xs text-[#FC682C] hover:text-[#FC682C]/80 font-medium flex items-center gap-1"
                >
                  <EyeIcon className="w-3.5 h-3.5" />
                  {previewTemplate ? 'Vorschau schliessen' : 'E-Mail Vorschau'}
                </button>
                {previewTemplate && (
                  <div className="mt-2 rounded-xl border border-white/[0.08] overflow-hidden bg-white">
                    <iframe
                      srcDoc={compose.body.startsWith('<!DOCTYPE') || compose.body.startsWith('<html')
                        ? compose.body
                        : `<!DOCTYPE html><html><head><style>body{font-family:sans-serif;max-width:600px;margin:24px auto;padding:24px;color:#1a1a2e;line-height:1.7;font-size:15px}h2{font-size:22px;font-weight:700;margin:0 0 20px}.highlight-box{background:#f8f9fc;border-left:4px solid #FC682C;border-radius:0 12px 12px 0;padding:20px 24px;margin:24px 0}.cta-btn{display:inline-block;background:linear-gradient(135deg,#FC682C,#FF8F5C);color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;margin:24px 0}p{margin:0 0 16px}</style></head><body>${compose.body}</body></html>`
                      }
                      className="w-full h-[400px] bg-white rounded-lg"
                      title="E-Mail Vorschau"
                      sandbox=""
                    />
                  </div>
                )}
              </div>
            )}

            {/* Result Message */}
            {sendResult && (
              <div className={`p-3 rounded-lg flex items-center gap-2 ${
                sendResult.success ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
              }`}>
                {sendResult.success ? <CheckIcon className="w-4 h-4" /> : <ExclamationCircleIcon className="w-4 h-4" />}
                {sendResult.message}
              </div>
            )}

            {/* Schedule */}
            <div>
              <label className="block text-sm text-white/60 mb-1">Geplanter Versand (optional)</label>
              <input
                type="datetime-local"
                value={compose.scheduled_at}
                onChange={(e) => setCompose({ ...compose, scheduled_at: e.target.value })}
                className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/10 rounded-lg text-white focus:border-[#FC682C]/50 outline-none [color-scheme:dark]"
              />
              {compose.scheduled_at && (
                <p className="text-[11px] text-[#FC682C] mt-1">
                  Wird gesendet am: {new Date(compose.scheduled_at).toLocaleString("de-DE")}
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSend}
                disabled={sending}
                className="px-6 py-2.5 bg-gradient-to-r from-[#FC682C] to-[#FF8F5C] text-white rounded-xl text-sm font-medium flex items-center gap-2 disabled:opacity-50"
              >
                <PaperAirplaneIcon className="w-4 h-4" />
                {sending ? "Senden..." : compose.scheduled_at ? "Planen" : "Jetzt senden"}
              </button>
            </div>
          </div>
        )}

        {activeSection === "templates" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Email Templates</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch("/api/email-templates/seed", { method: "POST", credentials: "include" });
                      if (res.ok) {
                        const data = await res.json();
                        const d = data.data || data;
                        setSendResult({ success: true, message: `${d.inserted} Premium Templates geladen, ${d.skipped} uebersprungen` });
                        fetchData();
                      }
                    } catch { setSendResult({ success: false, message: "Templates konnten nicht geladen werden" }); }
                  }}
                  className="px-3 py-1.5 bg-violet-500/20 text-violet-400 hover:bg-violet-500/30 border border-violet-500/20 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <SparklesIcon className="w-3.5 h-3.5" />
                  Premium Templates laden
                </button>
              </div>
            </div>

            {sendResult && (
              <div className={`p-3 rounded-lg flex items-center gap-2 text-sm ${sendResult.success ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                {sendResult.success ? <CheckIcon className="w-4 h-4" /> : <ExclamationCircleIcon className="w-4 h-4" />}
                {sendResult.message}
              </div>
            )}

            {templates.length === 0 ? (
              <div className="text-center py-12">
                <EnvelopeIcon className="w-12 h-12 text-white/15 mx-auto mb-3" />
                <p className="text-white/40 mb-4">Keine Templates vorhanden</p>
                <p className="text-white/25 text-sm">Klicke "Premium Templates laden" um 10 fertige Vorlagen zu installieren</p>
              </div>
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
                      <div className="flex gap-1">
                        <button
                          onClick={() => setPreviewTemplate(previewTemplate?.id === template.id ? null : template)}
                          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-white/60 transition-colors"
                        >
                          {previewTemplate?.id === template.id ? "Schliessen" : "Vorschau"}
                        </button>
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
                    {previewTemplate?.id === template.id && (
                      <div className="mt-3 pt-3 border-t border-white/[0.06]">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs text-white/30">Live-Vorschau (Beispieldaten):</p>
                          {template.variables && template.variables.length > 0 && (
                            <div className="flex gap-1 flex-wrap">
                              {template.variables.map((v: string) => (
                                <span key={v} className="px-1.5 py-0.5 rounded bg-[#FC682C]/10 text-[9px] text-[#FC682C] font-mono">{`{{${v}}}`}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="rounded-xl border border-white/[0.08] overflow-hidden">
                          <iframe
                            srcDoc={(() => {
                              const preview = template.body
                                .replace(/\{\{name\}\}/g, 'Max Mustermann')
                                .replace(/\{\{firma\}\}/g, 'Musterfirma GmbH')
                                .replace(/\{\{email\}\}/g, 'max@example.com')
                                .replace(/\{\{projekt\}\}/g, 'Business Website')
                                .replace(/\{\{betrag\}\}/g, '4.990')
                                .replace(/\{\{rechnungsnr\}\}/g, 'AFM-2026-0042')
                                .replace(/\{\{faellig\}\}/g, new Date(Date.now() + 14 * 86400000).toLocaleDateString('de-DE'))
                                .replace(/\{\{fortschritt\}\}/g, '75')
                                .replace(/\{\{meilenstein\}\}/g, 'Entwicklung')
                                .replace(/\{\{datum\}\}/g, new Date().toLocaleDateString('de-DE'))
                                .replace(/\{\{uhrzeit\}\}/g, '10:00')
                                .replace(/\{\{thema\}\}/g, 'Projekt-Besprechung')
                                .replace(/\{\{paket\}\}/g, 'BUSINESS Website')
                                .replace(/\{\{beschreibung\}\}/g, 'Der Design-Entwurf fuer Ihre Website ist fertig.')
                                .replace(/\{\{portal_link\}\}/g, '#')
                                .replace(/\{\{referral_link\}\}/g, '#')
                                .replace(/\{\{link\}\}/g, '#')
                                .replace(/\{\{cta_text\}\}/g, 'Mehr erfahren')
                                .replace(/\{\{cta_link\}\}/g, '#')
                                .replace(/\{\{inhalt\}\}/g, '<p>Hier kommt Ihr Inhalt...</p>')
                                .replace(/\{\{betreff\}\}/g, 'Newsletter')
                                .replace(/\{\{tage_ueberfaellig\}\}/g, '7');
                              // Wrap in Premium-Design fuer Vorschau
                              if (!preview.includes('<!DOCTYPE')) {
                                return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:0;padding:24px 16px;background:#f5f6fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}.wrapper{max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.06)}.header{background:linear-gradient(135deg,#0B0F19,#1a2235);padding:32px 40px;text-align:center}.logo{font-size:22px;font-weight:800;color:#FC682C}.content{padding:40px;color:#1a1a2e;line-height:1.7;font-size:15px}.content h2{font-size:22px;font-weight:700;margin:0 0 20px}.content p{margin:0 0 16px}.highlight-box{background:#f8f9fc;border-left:4px solid #FC682C;border-radius:0 12px 12px 0;padding:20px 24px;margin:24px 0}.cta-btn{display:inline-block;background:linear-gradient(135deg,#FC682C,#FF8F5C);color:#fff!important;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;margin:24px 0}.footer{padding:24px 40px;background:#f8f9fc;text-align:center;font-size:12px;color:#999}.footer a{color:#FC682C;text-decoration:none}.signature{margin-top:24px;padding-top:16px;border-top:1px solid #eef0f5}.signature strong{color:#FC682C}</style></head><body><div class="wrapper"><div class="header"><div class="logo">AgentFlowMarketing</div></div><div class="content">${preview}<div class="signature"><p style="margin:0;font-size:14px">Mit freundlichen Gruessen,</p><p style="margin:4px 0 0;font-size:14px"><strong>M. Ashaer</strong><br><span style="color:#888;font-size:13px">AgentFlowMarketing</span></p></div></div><div class="footer"><p>AgentFlowMarketing | kontakt@agentflowm.de</p></div></div></body></html>`;
                              }
                              return preview;
                            })()}
                            className="w-full h-[450px] bg-white"
                            title="Template Vorschau"
                            sandbox=""
                          />
                        </div>
                      </div>
                    )}
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
                  <div key={email.id} className="rounded-xl bg-white/[0.03] hover:bg-white/[0.05] transition-colors overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-white truncate">{email.subject}</h4>
                            <span className={`px-2 py-0.5 rounded text-xs flex-shrink-0 ${getStatusBadge(email.status)}`}>
                              {email.status === 'sent' ? 'Gesendet' : email.status === 'opened' ? 'Geoeffnet' : email.status}
                            </span>
                          </div>
                          <p className="text-sm text-white/50 truncate">{email.to_email}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-white/40">
                            <span>{new Date(email.sent_at).toLocaleString("de-DE")}</span>
                            {email.opened_at && (
                              <span className="flex items-center gap-1 text-blue-400">
                                <EyeIcon className="w-3 h-3" />
                                Geoeffnet ({email.open_count}x)
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
                        <button
                          onClick={() => setPreviewEmailId(previewEmailId === email.id ? null : email.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors flex-shrink-0 ${
                            previewEmailId === email.id
                              ? 'bg-[#FC682C]/20 text-[#FC682C] border border-[#FC682C]/30'
                              : 'bg-white/[0.05] text-white/50 hover:bg-white/[0.1] hover:text-white'
                          }`}
                        >
                          <EyeIcon className="w-3.5 h-3.5" />
                          {previewEmailId === email.id ? 'Schliessen' : 'Vorschau'}
                        </button>
                      </div>
                    </div>

                    {/* E-Mail Vorschau — exakt wie der Empfaenger sie sieht */}
                    {previewEmailId === email.id && email.body && (
                      <div className="border-t border-white/[0.06]">
                        <div className="px-4 py-2 bg-white/[0.02] flex items-center justify-between">
                          <span className="text-[10px] text-white/30 uppercase tracking-wider">So sieht die E-Mail beim Empfaenger aus</span>
                          <button
                            onClick={() => {
                              const w = window.open('', '_blank', 'width=700,height=800');
                              if (w) { w.document.write(email.body || ''); w.document.close(); }
                            }}
                            className="text-[10px] text-[#FC682C] hover:text-[#FC682C]/80 font-medium"
                          >
                            In neuem Fenster oeffnen
                          </button>
                        </div>
                        <iframe
                          srcDoc={email.body}
                          className="w-full h-[500px] bg-white"
                          title={`Vorschau: ${email.subject}`}
                          sandbox=""
                        />
                      </div>
                    )}
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
