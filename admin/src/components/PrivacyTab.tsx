"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ShieldCheckIcon, DocumentTextIcon, UserIcon, ClockIcon,
  ExclamationTriangleIcon, CheckCircleIcon, PlusIcon, XMarkIcon,
  PencilIcon, TrashIcon, PaperAirplaneIcon, EyeIcon,
  GlobeAltIcon, LockClosedIcon, DocumentDuplicateIcon,
  ArrowDownTrayIcon, EnvelopeOpenIcon, FolderIcon,
  MagnifyingGlassIcon, ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { useToast } from "@/components";

interface PrivacyDoc {
  id: number; title: string; description: string | null; category: string;
  content: string; is_template: boolean; version: number; status: string;
  sent_to: string[] | null; last_sent_at: string | null;
  created_at: string; updated_at: string;
}
interface PrivacyRequest {
  id: number; name: string; email: string; request_type: string;
  description: string | null; status: string; deadline: string | null;
  completed_at: string | null; notes: string | null; created_at: string;
}
interface Processing {
  id: number; name: string; purpose: string; legal_basis: string;
  data_categories: string | null; recipients: string | null;
  retention: string | null; security_measures: string | null;
  status: string; created_at: string;
}

function unwrap<T>(res: unknown): T {
  if (res && typeof res === 'object' && 'data' in res) return (res as any).data;
  return res as T;
}

const CAT_LABELS: Record<string, string> = {
  datenschutz: 'Datenschutzerklärung', impressum: 'Impressum', avv: 'AVV',
  loeschkonzept: 'Löschkonzept', tom: 'TOM', einwilligung: 'Einwilligung', other: 'Sonstige',
};
const CAT_ICONS: Record<string, any> = {
  datenschutz: ShieldCheckIcon, impressum: GlobeAltIcon, avv: DocumentDuplicateIcon,
  loeschkonzept: TrashIcon, tom: LockClosedIcon, einwilligung: CheckCircleIcon, other: DocumentTextIcon,
};
const REQ_LABELS: Record<string, string> = {
  access: 'Auskunft (Art. 15)', deletion: 'Löschung (Art. 17)', rectification: 'Berichtigung (Art. 16)',
  restriction: 'Einschränkung (Art. 18)', portability: 'Datenübertragung (Art. 20)', objection: 'Widerspruch (Art. 21)',
};
const STATUS_LABELS: Record<string, string> = { pending: 'Offen', in_progress: 'In Bearbeitung', completed: 'Erledigt', rejected: 'Abgelehnt' };

export default function PrivacyTab() {
  const { showToast } = useToast();
  const [tab, setTab] = useState<"docs" | "requests" | "processing">("docs");
  const [docs, setDocs] = useState<PrivacyDoc[]>([]);
  const [requests, setRequests] = useState<PrivacyRequest[]>([]);
  const [processing, setProcessing] = useState<Processing[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ documents: 0, activeDocuments: 0, pendingRequests: 0, processingActivities: 0 });

  // Modals
  const [editDoc, setEditDoc] = useState<PrivacyDoc | null>(null);
  const [viewDoc, setViewDoc] = useState<PrivacyDoc | null>(null);
  const [sendDoc, setSendDoc] = useState<PrivacyDoc | null>(null);
  const [sendForm, setSendForm] = useState({ to_email: "", to_name: "", message: "" });
  const [showAddDoc, setShowAddDoc] = useState(false);
  const [showAddReq, setShowAddReq] = useState(false);
  const [showAddProc, setShowAddProc] = useState(false);
  const [saving, setSaving] = useState(false);
  const [clients, setClients] = useState<{ id: number; name: string; email: string; company: string | null }[]>([]);

  const [newDoc, setNewDoc] = useState({ title: "", description: "", category: "datenschutz", content: "", is_template: false });
  const [newReq, setNewReq] = useState({ name: "", email: "", request_type: "access", description: "" });
  const [newProc, setNewProc] = useState({ name: "", purpose: "", legal_basis: "Vertragserfüllung (Art. 6 Abs. 1 lit. b)", data_categories: "", recipients: "", retention: "", security_measures: "" });

  const loadData = useCallback(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/privacy", { credentials: "include" }).then(r => r.json()),
      fetch("/api/clients", { credentials: "include" }).then(r => r.json()).catch(() => ({ data: { clients: [] } })),
    ]).then(([d, cd]) => {
      const data = unwrap<any>(d);
      setDocs(data.documents || []);
      setRequests(data.requests || []);
      setProcessing(data.processing || []);
      setStats(data.stats || stats);
      const cl = unwrap<any>(cd);
      setClients((cl.clients || []).map((c: any) => ({ id: c.id, name: c.name, email: c.email, company: c.company })));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const replacePlaceholders = (text: string, clientName?: string, clientCompany?: string) => {
    return text
      .replace(/\{\{KUNDENNAME\}\}/g, clientName || '[Kundenname]')
      .replace(/\{\{KUNDENFIRMA\}\}/g, clientCompany || '[Kundenfirma]')
      .replace(/\{\{DATUM\}\}/g, new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }));
  };

  const downloadAsText = (doc: PrivacyDoc, clientName?: string, clientCompany?: string) => {
    const content = replacePlaceholders(doc.content, clientName, clientCompany);
    const header = `${doc.title}\n${'='.repeat(doc.title.length)}\n\n`;
    const footer = `\n\n---\nAgentFlowMarketing · Achillesstraße 69A, 13125 Berlin\nVersion ${doc.version} · Stand: ${new Date(doc.updated_at).toLocaleDateString('de-DE')}\n`;
    const blob = new Blob([header + content + footer], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title.replace(/[^a-zA-Z0-9äöüÄÖÜß]/g, '_')}_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("success", "Dokument heruntergeladen!");
  };

  const handleSelectClientForSend = (clientId: string) => {
    const client = clients.find(c => c.id === parseInt(clientId));
    if (client) {
      setSendForm({ ...sendForm, to_email: client.email, to_name: client.name });
    }
  };

  const handleAddDoc = async () => {
    if (!newDoc.title || !newDoc.content) return;
    setSaving(true);
    const res = await fetch("/api/privacy", { credentials: "include", method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...newDoc, _type: "document", status: "active" }) });
    if (res.ok) { showToast("success", "Dokument erstellt!"); setShowAddDoc(false); setNewDoc({ title: "", description: "", category: "datenschutz", content: "", is_template: false }); loadData(); }
    else showToast("error", "Fehler");
    setSaving(false);
  };

  const handleUpdateDoc = async () => {
    if (!editDoc) return;
    setSaving(true);
    await fetch(`/api/privacy/${editDoc.id}`, { credentials: "include", method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editDoc.title, description: editDoc.description, content: editDoc.content, category: editDoc.category, status: editDoc.status, version: (editDoc.version || 1) + 1 }) });
    showToast("success", "Dokument aktualisiert!"); setEditDoc(null); loadData(); setSaving(false);
  };

  const handleSendDoc = async () => {
    if (!sendDoc || !sendForm.to_email) return;
    setSaving(true);
    const res = await fetch(`/api/privacy/${sendDoc.id}/send`, { credentials: "include", method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(sendForm) });
    if (res.ok) { showToast("success", `Dokument an ${sendForm.to_email} gesendet!`); setSendDoc(null); setSendForm({ to_email: "", to_name: "", message: "" }); loadData(); }
    else showToast("error", "E-Mail konnte nicht gesendet werden");
    setSaving(false);
  };

  const handleAddReq = async () => {
    if (!newReq.name || !newReq.email) return;
    setSaving(true);
    await fetch("/api/privacy", { credentials: "include", method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...newReq, _type: "request" }) });
    showToast("success", "Anfrage erfasst!"); setShowAddReq(false); setNewReq({ name: "", email: "", request_type: "access", description: "" }); loadData(); setSaving(false);
  };

  const handleAddProc = async () => {
    if (!newProc.name || !newProc.purpose) return;
    setSaving(true);
    await fetch("/api/privacy", { credentials: "include", method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...newProc, _type: "processing" }) });
    showToast("success", "Verarbeitungstätigkeit angelegt!"); setShowAddProc(false); setNewProc({ name: "", purpose: "", legal_basis: "Vertragserfüllung (Art. 6 Abs. 1 lit. b)", data_categories: "", recipients: "", retention: "", security_measures: "" }); loadData(); setSaving(false);
  };

  const updateReqStatus = async (id: number, status: string) => {
    await fetch(`/api/privacy/${id}`, { credentials: "include", method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ _type: "request", status }) });
    showToast("success", `Status geändert: ${STATUS_LABELS[status]}`); loadData();
  };

  const deleteItem = async (id: number, type: string) => {
    await fetch(`/api/privacy/${id}?type=${type}`, { credentials: "include", method: "DELETE" });
    showToast("success", "Gelöscht"); loadData();
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-3 border-[#FC682C]/30 border-t-[#FC682C] rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500/15 to-green-600/5 border border-green-500/15">
          <div className="flex items-center gap-2 mb-1"><ShieldCheckIcon className="w-4 h-4 text-green-400" /><span className="text-xs text-white/50">Aktive Dokumente</span></div>
          <p className="text-2xl font-bold text-white">{stats.activeDocuments}</p>
        </div>
        <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-500/15 to-yellow-600/5 border border-yellow-500/15">
          <div className="flex items-center gap-2 mb-1"><ClockIcon className="w-4 h-4 text-yellow-400" /><span className="text-xs text-white/50">Offene Anfragen</span></div>
          <p className="text-2xl font-bold text-white">{stats.pendingRequests}</p>
        </div>
        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/15 to-blue-600/5 border border-blue-500/15">
          <div className="flex items-center gap-2 mb-1"><FolderIcon className="w-4 h-4 text-blue-400" /><span className="text-xs text-white/50">Verarbeitungen</span></div>
          <p className="text-2xl font-bold text-white">{stats.processingActivities}</p>
        </div>
        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/15 to-purple-600/5 border border-purple-500/15">
          <div className="flex items-center gap-2 mb-1"><DocumentTextIcon className="w-4 h-4 text-purple-400" /><span className="text-xs text-white/50">Gesamt Dokumente</span></div>
          <p className="text-2xl font-bold text-white">{stats.documents}</p>
        </div>
      </div>

      {/* Tab Nav */}
      <div className="flex items-center gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl w-fit">
        {[
          { key: "docs" as const, label: "Dokumente", icon: DocumentTextIcon, count: docs.length },
          { key: "requests" as const, label: "Anfragen", icon: UserIcon, count: requests.length },
          { key: "processing" as const, label: "Verarbeitungsverzeichnis", icon: FolderIcon, count: processing.length },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${tab === t.key ? "bg-[#FC682C] text-white shadow-lg shadow-[#FC682C]/20" : "text-white/50 hover:text-white hover:bg-white/[0.06]"}`}>
            <t.icon className="w-4 h-4" />{t.label}
            <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${tab === t.key ? "bg-white/20" : "bg-white/[0.06]"}`}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* ═══ DOKUMENTE ═══ */}
      {tab === "docs" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setShowAddDoc(true)} className="flex items-center gap-2 px-5 py-2.5 bg-[#FC682C] text-white rounded-xl text-sm font-medium hover:bg-[#FC682C]/90">
              <PlusIcon className="w-4 h-4" /> Neues Dokument
            </button>
          </div>

          {showAddDoc && (
            <div className="p-5 rounded-2xl bg-green-500/5 border border-green-500/15 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-green-400 flex items-center gap-2"><DocumentTextIcon className="w-4 h-4" /> Neues Dokument</h4>
                <button onClick={() => setShowAddDoc(false)}><XMarkIcon className="w-4 h-4 text-white/40" /></button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-[10px] text-white/40 mb-1">Titel *</label>
                  <input type="text" value={newDoc.title} onChange={e => setNewDoc({ ...newDoc, title: e.target.value })} placeholder="z.B. Datenschutzerklärung Website"
                    className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/30 outline-none" /></div>
                <div><label className="block text-[10px] text-white/40 mb-1">Kategorie</label>
                  <select value={newDoc.category} onChange={e => setNewDoc({ ...newDoc, category: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white outline-none cursor-pointer">
                    {Object.entries(CAT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select></div>
              </div>
              <div><label className="block text-[10px] text-white/40 mb-1">Beschreibung</label>
                <input type="text" value={newDoc.description} onChange={e => setNewDoc({ ...newDoc, description: e.target.value })} placeholder="Kurze Beschreibung..."
                  className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/30 outline-none" /></div>
              <div><label className="block text-[10px] text-white/40 mb-1">Inhalt *</label>
                <textarea value={newDoc.content} onChange={e => setNewDoc({ ...newDoc, content: e.target.value })} rows={10} placeholder="Vollständiger Text des Dokuments..."
                  className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/30 outline-none resize-none font-mono" /></div>
              <button onClick={handleAddDoc} disabled={saving || !newDoc.title || !newDoc.content}
                className="w-full py-2.5 bg-green-500/20 text-green-400 rounded-xl text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? "Speichert..." : <><PlusIcon className="w-4 h-4" /> Dokument erstellen</>}
              </button>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-3">
            {docs.length === 0 ? (
              <div className="lg:col-span-2 flex flex-col items-center justify-center py-16 text-center">
                <DocumentTextIcon className="w-16 h-16 text-white/10 mb-4" />
                <h3 className="text-lg font-medium text-white/50">Keine Dokumente</h3>
                <p className="text-sm text-white/30">Erstelle dein erstes Datenschutz-Dokument</p>
              </div>
            ) : docs.map(doc => {
              const CatIcon = CAT_ICONS[doc.category] || DocumentTextIcon;
              return (
                <div key={doc.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all group">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-[#FC682C]/15 flex-shrink-0">
                      <CatIcon className="w-5 h-5 text-[#FC682C]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-medium text-white">{doc.title}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${doc.status === 'active' ? 'bg-green-500/15 text-green-400' : doc.status === 'draft' ? 'bg-yellow-500/15 text-yellow-400' : 'bg-white/10 text-white/40'}`}>
                          {doc.status === 'active' ? 'Aktiv' : doc.status === 'draft' ? 'Entwurf' : 'Archiviert'}
                        </span>
                        <span className="text-[9px] text-white/20">v{doc.version}</span>
                      </div>
                      <p className="text-[11px] text-white/35">{doc.description || CAT_LABELS[doc.category]} · {new Date(doc.updated_at).toLocaleDateString("de-DE")}</p>
                      {doc.sent_to && doc.sent_to.length > 0 && (
                        <p className="text-[10px] text-green-400/60 mt-1">Gesendet an: {doc.sent_to.join(", ")}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setViewDoc(doc)} className="p-1.5 hover:bg-white/10 rounded-lg text-white/30 hover:text-white" title="Ansehen"><EyeIcon className="w-4 h-4" /></button>
                      <button onClick={() => downloadAsText(doc)} className="p-1.5 hover:bg-green-500/20 rounded-lg text-white/30 hover:text-green-400" title="Herunterladen"><ArrowDownTrayIcon className="w-4 h-4" /></button>
                      <button onClick={() => { setSendDoc(doc); setSendForm({ to_email: "", to_name: "", message: "" }); }} className="p-1.5 hover:bg-blue-500/20 rounded-lg text-white/30 hover:text-blue-400" title="An Kunde senden"><PaperAirplaneIcon className="w-4 h-4" /></button>
                      <button onClick={() => setEditDoc({ ...doc })} className="p-1.5 hover:bg-white/10 rounded-lg text-white/30 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity" title="Bearbeiten"><PencilIcon className="w-4 h-4" /></button>
                      <button onClick={() => deleteItem(doc.id, 'document')} className="p-1.5 hover:bg-red-500/20 rounded-lg text-white/30 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" title="Löschen"><TrashIcon className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ ANFRAGEN ═══ */}
      {tab === "requests" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setShowAddReq(true)} className="flex items-center gap-2 px-5 py-2.5 bg-[#FC682C] text-white rounded-xl text-sm font-medium hover:bg-[#FC682C]/90">
              <PlusIcon className="w-4 h-4" /> Neue Anfrage
            </button>
          </div>

          {showAddReq && (
            <div className="p-5 rounded-2xl bg-yellow-500/5 border border-yellow-500/15 space-y-3">
              <h4 className="text-sm font-semibold text-yellow-400 flex items-center gap-2"><UserIcon className="w-4 h-4" /> Betroffenenanfrage erfassen</h4>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-[10px] text-white/40 mb-1">Name *</label>
                  <input value={newReq.name} onChange={e => setNewReq({ ...newReq, name: e.target.value })} placeholder="Name der betroffenen Person"
                    className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/30 outline-none" /></div>
                <div><label className="block text-[10px] text-white/40 mb-1">E-Mail *</label>
                  <input type="email" value={newReq.email} onChange={e => setNewReq({ ...newReq, email: e.target.value })} placeholder="email@example.com"
                    className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/30 outline-none" /></div>
                <div><label className="block text-[10px] text-white/40 mb-1">Art der Anfrage</label>
                  <select value={newReq.request_type} onChange={e => setNewReq({ ...newReq, request_type: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white outline-none cursor-pointer">
                    {Object.entries(REQ_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select></div>
                <div><label className="block text-[10px] text-white/40 mb-1">Beschreibung</label>
                  <input value={newReq.description} onChange={e => setNewReq({ ...newReq, description: e.target.value })} placeholder="Details..."
                    className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/30 outline-none" /></div>
              </div>
              <button onClick={handleAddReq} disabled={saving || !newReq.name || !newReq.email}
                className="w-full py-2.5 bg-yellow-500/20 text-yellow-400 rounded-xl text-sm font-medium disabled:opacity-50">{saving ? "Speichert..." : "Anfrage erfassen"}</button>
            </div>
          )}

          <div className="space-y-2">
            {requests.length === 0 ? (
              <div className="text-center py-16"><UserIcon className="w-16 h-16 text-white/10 mx-auto mb-4" /><h3 className="text-lg font-medium text-white/50">Keine Anfragen</h3></div>
            ) : requests.map(req => (
              <div key={req.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${req.status === 'completed' ? 'bg-green-500/15' : req.status === 'in_progress' ? 'bg-blue-500/15' : 'bg-yellow-500/15'}`}>
                    <UserIcon className={`w-5 h-5 ${req.status === 'completed' ? 'text-green-400' : req.status === 'in_progress' ? 'text-blue-400' : 'text-yellow-400'}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2"><span className="text-sm font-medium text-white">{req.name}</span><span className="text-[9px] text-white/30">{req.email}</span></div>
                    <div className="flex items-center gap-2 text-[11px] text-white/35">
                      <span>{REQ_LABELS[req.request_type] || req.request_type}</span>
                      <span>· {new Date(req.created_at).toLocaleDateString("de-DE")}</span>
                      {req.deadline && <span>· Frist: {new Date(req.deadline).toLocaleDateString("de-DE")}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select value={req.status} onChange={e => updateReqStatus(req.id, e.target.value)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border outline-none cursor-pointer ${
                      req.status === 'completed' ? 'bg-green-500/15 text-green-400 border-green-500/20' :
                      req.status === 'in_progress' ? 'bg-blue-500/15 text-blue-400 border-blue-500/20' :
                      req.status === 'rejected' ? 'bg-red-500/15 text-red-400 border-red-500/20' :
                      'bg-yellow-500/15 text-yellow-400 border-yellow-500/20'
                    }`}>
                    {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                  <button onClick={() => deleteItem(req.id, 'request')} className="p-1.5 hover:bg-red-500/20 rounded-lg text-white/20 hover:text-red-400"><TrashIcon className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ VERARBEITUNGSVERZEICHNIS ═══ */}
      {tab === "processing" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-white/30">Pflicht nach DSGVO Art. 30 — Verzeichnis aller Verarbeitungstätigkeiten</p>
            <button onClick={() => setShowAddProc(true)} className="flex items-center gap-2 px-5 py-2.5 bg-[#FC682C] text-white rounded-xl text-sm font-medium hover:bg-[#FC682C]/90">
              <PlusIcon className="w-4 h-4" /> Neue Verarbeitung
            </button>
          </div>

          {showAddProc && (
            <div className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/15 space-y-3">
              <h4 className="text-sm font-semibold text-blue-400 flex items-center gap-2"><FolderIcon className="w-4 h-4" /> Verarbeitungstätigkeit anlegen</h4>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-[10px] text-white/40 mb-1">Bezeichnung *</label>
                  <input value={newProc.name} onChange={e => setNewProc({ ...newProc, name: e.target.value })} placeholder="z.B. Kundenverwaltung"
                    className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/30 outline-none" /></div>
                <div><label className="block text-[10px] text-white/40 mb-1">Rechtsgrundlage *</label>
                  <select value={newProc.legal_basis} onChange={e => setNewProc({ ...newProc, legal_basis: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white outline-none cursor-pointer">
                    <option>Vertragserfüllung (Art. 6 Abs. 1 lit. b)</option>
                    <option>Einwilligung (Art. 6 Abs. 1 lit. a)</option>
                    <option>Berechtigtes Interesse (Art. 6 Abs. 1 lit. f)</option>
                    <option>Rechtliche Verpflichtung (Art. 6 Abs. 1 lit. c)</option>
                  </select></div>
                <div className="col-span-2"><label className="block text-[10px] text-white/40 mb-1">Zweck *</label>
                  <input value={newProc.purpose} onChange={e => setNewProc({ ...newProc, purpose: e.target.value })} placeholder="Zweck der Datenverarbeitung"
                    className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/30 outline-none" /></div>
                <div><label className="block text-[10px] text-white/40 mb-1">Datenkategorien</label>
                  <input value={newProc.data_categories} onChange={e => setNewProc({ ...newProc, data_categories: e.target.value })} placeholder="Name, E-Mail, Telefon..."
                    className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/30 outline-none" /></div>
                <div><label className="block text-[10px] text-white/40 mb-1">Empfänger</label>
                  <input value={newProc.recipients} onChange={e => setNewProc({ ...newProc, recipients: e.target.value })} placeholder="z.B. Hosting-Provider, Intern"
                    className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/30 outline-none" /></div>
                <div><label className="block text-[10px] text-white/40 mb-1">Aufbewahrungsfrist</label>
                  <input value={newProc.retention} onChange={e => setNewProc({ ...newProc, retention: e.target.value })} placeholder="z.B. 10 Jahre nach Vertragsende"
                    className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/30 outline-none" /></div>
                <div><label className="block text-[10px] text-white/40 mb-1">Sicherheitsmaßnahmen</label>
                  <input value={newProc.security_measures} onChange={e => setNewProc({ ...newProc, security_measures: e.target.value })} placeholder="SSL, Verschlüsselung..."
                    className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/30 outline-none" /></div>
              </div>
              <button onClick={handleAddProc} disabled={saving || !newProc.name || !newProc.purpose}
                className="w-full py-2.5 bg-blue-500/20 text-blue-400 rounded-xl text-sm font-medium disabled:opacity-50">{saving ? "Speichert..." : "Anlegen"}</button>
            </div>
          )}

          <div className="space-y-2">
            {processing.length === 0 ? (
              <div className="text-center py-16"><FolderIcon className="w-16 h-16 text-white/10 mx-auto mb-4" /><h3 className="text-lg font-medium text-white/50">Noch keine Verarbeitungstätigkeiten</h3></div>
            ) : processing.map(proc => (
              <div key={proc.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{proc.name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${proc.status === 'active' ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
                      {proc.status === 'active' ? 'Aktiv' : 'Inaktiv'}
                    </span>
                  </div>
                  <button onClick={() => deleteItem(proc.id, 'processing')} className="p-1.5 hover:bg-red-500/20 rounded-lg text-white/20 hover:text-red-400"><TrashIcon className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 text-[11px]">
                  <div className="p-2 bg-white/[0.02] rounded-lg"><span className="text-white/30 block">Zweck</span><span className="text-white/60">{proc.purpose}</span></div>
                  <div className="p-2 bg-white/[0.02] rounded-lg"><span className="text-white/30 block">Rechtsgrundlage</span><span className="text-white/60">{proc.legal_basis}</span></div>
                  {proc.data_categories && <div className="p-2 bg-white/[0.02] rounded-lg"><span className="text-white/30 block">Daten</span><span className="text-white/60">{proc.data_categories}</span></div>}
                  {proc.recipients && <div className="p-2 bg-white/[0.02] rounded-lg"><span className="text-white/30 block">Empfänger</span><span className="text-white/60">{proc.recipients}</span></div>}
                  {proc.retention && <div className="p-2 bg-white/[0.02] rounded-lg"><span className="text-white/30 block">Frist</span><span className="text-white/60">{proc.retention}</span></div>}
                  {proc.security_measures && <div className="p-2 bg-white/[0.02] rounded-lg"><span className="text-white/30 block">Sicherheit</span><span className="text-white/60">{proc.security_measures}</span></div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ VIEW MODAL ═══ */}
      {viewDoc && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm" onClick={() => setViewDoc(null)}>
          <div className="w-full max-w-2xl bg-[#111827] border-l border-white/[0.08] h-full overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06] bg-gradient-to-r from-green-500/10 to-transparent sticky top-0 bg-[#111827] z-10">
              <div>
                <h3 className="text-lg font-semibold text-white">{viewDoc.title}</h3>
                <p className="text-xs text-white/40">{CAT_LABELS[viewDoc.category]} · v{viewDoc.version} · {new Date(viewDoc.updated_at).toLocaleDateString("de-DE")}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => downloadAsText(viewDoc)} className="p-2 hover:bg-green-500/20 rounded-xl" title="Herunterladen"><ArrowDownTrayIcon className="w-5 h-5 text-green-400" /></button>
                <button onClick={() => { setEditDoc({ ...viewDoc }); setViewDoc(null); }} className="p-2 hover:bg-white/10 rounded-xl" title="Bearbeiten"><PencilIcon className="w-5 h-5 text-white/60" /></button>
                <button onClick={() => { setSendDoc(viewDoc); setSendForm({ to_email: "", to_name: "", message: "" }); setViewDoc(null); }} className="p-2 hover:bg-blue-500/20 rounded-xl" title="Per E-Mail senden"><PaperAirplaneIcon className="w-5 h-5 text-blue-400" /></button>
                <button onClick={() => setViewDoc(null)} className="p-2 hover:bg-white/10 rounded-xl"><XMarkIcon className="w-5 h-5 text-white/60" /></button>
              </div>
            </div>
            <div className="p-6">
              <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap text-white/70 leading-relaxed">{replacePlaceholders(viewDoc.content)}</div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ EDIT MODAL ═══ */}
      {editDoc && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm" onClick={() => setEditDoc(null)}>
          <div className="w-full max-w-2xl bg-[#111827] border-l border-white/[0.08] h-full overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06] bg-gradient-to-r from-[#FC682C]/10 to-transparent sticky top-0 bg-[#111827] z-10">
              <h3 className="text-lg font-semibold text-white">Dokument bearbeiten</h3>
              <button onClick={() => setEditDoc(null)} className="p-2 hover:bg-white/10 rounded-xl"><XMarkIcon className="w-5 h-5 text-white/60" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-[10px] text-white/40 mb-1">Titel</label>
                  <input value={editDoc.title} onChange={e => setEditDoc({ ...editDoc, title: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white outline-none" /></div>
                <div><label className="block text-[10px] text-white/40 mb-1">Kategorie</label>
                  <select value={editDoc.category} onChange={e => setEditDoc({ ...editDoc, category: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white outline-none cursor-pointer">
                    {Object.entries(CAT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select></div>
              </div>
              <div><label className="block text-[10px] text-white/40 mb-1">Beschreibung</label>
                <input value={editDoc.description || ""} onChange={e => setEditDoc({ ...editDoc, description: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white outline-none" /></div>
              <div><label className="block text-[10px] text-white/40 mb-1">Inhalt</label>
                <textarea value={editDoc.content} onChange={e => setEditDoc({ ...editDoc, content: e.target.value })} rows={20}
                  className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white outline-none resize-none font-mono" /></div>
              <div className="flex gap-2">
                <button onClick={handleUpdateDoc} disabled={saving} className="flex-1 py-2.5 bg-[#FC682C] text-white rounded-xl text-sm font-medium disabled:opacity-50">
                  {saving ? "Speichert..." : "Speichern (neue Version)"}
                </button>
                <button onClick={() => setEditDoc(null)} className="px-4 py-2.5 bg-white/[0.04] text-white/50 rounded-xl text-sm">Abbrechen</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ SEND MODAL ═══ */}
      {sendDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setSendDoc(null)}>
          <div className="w-full max-w-md bg-[#111827] border border-white/[0.08] rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-white/[0.06] bg-gradient-to-r from-blue-500/10 to-transparent">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2"><PaperAirplaneIcon className="w-5 h-5 text-blue-400" /> Dokument senden</h3>
              <p className="text-xs text-white/40 mt-1">"{sendDoc.title}" per E-Mail versenden</p>
            </div>
            <div className="p-6 space-y-3">
              {/* Kunde auswählen */}
              {clients.length > 0 && (
                <div>
                  <label className="block text-[10px] text-white/40 mb-1">Kunde auswählen</label>
                  <select onChange={e => handleSelectClientForSend(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white outline-none cursor-pointer">
                    <option value="">— Kunde wählen oder manuell eingeben —</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name} ({c.email}){c.company ? ` · ${c.company}` : ''}</option>)}
                  </select>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-[10px] text-white/40 mb-1">Empfänger E-Mail *</label>
                  <input type="email" value={sendForm.to_email} onChange={e => setSendForm({ ...sendForm, to_email: e.target.value })} placeholder="kunde@example.com"
                    className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/30 outline-none" /></div>
                <div><label className="block text-[10px] text-white/40 mb-1">Empfänger Name</label>
                  <input value={sendForm.to_name} onChange={e => setSendForm({ ...sendForm, to_name: e.target.value })} placeholder="Max Mustermann"
                    className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/30 outline-none" /></div>
              </div>
              <div><label className="block text-[10px] text-white/40 mb-1">Persönliche Nachricht (optional)</label>
                <textarea value={sendForm.message} onChange={e => setSendForm({ ...sendForm, message: e.target.value })} rows={3} placeholder="z.B. Bitte prüfen und bestätigen Sie das beigefügte Dokument..."
                  className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/30 outline-none resize-none" /></div>
              {/* Platzhalter-Vorschau */}
              {sendForm.to_name && sendDoc.content.includes('{{KUNDENNAME}}') && (
                <div className="p-3 bg-green-500/5 border border-green-500/10 rounded-xl">
                  <p className="text-[10px] text-green-400/60 mb-1">Platzhalter werden automatisch ersetzt:</p>
                  <p className="text-xs text-white/50">{'{{KUNDENNAME}}'} → <strong className="text-white">{sendForm.to_name}</strong></p>
                </div>
              )}
            </div>
            <div className="flex justify-between px-6 py-4 border-t border-white/[0.06] bg-white/[0.02]">
              <button onClick={() => downloadAsText(sendDoc, sendForm.to_name)}
                className="px-4 py-2 bg-white/[0.04] text-white/60 rounded-xl text-sm flex items-center gap-2 hover:bg-white/[0.08] border border-white/[0.06]">
                <ArrowDownTrayIcon className="w-4 h-4" /> Download
              </button>
              <div className="flex gap-2">
                <button onClick={() => setSendDoc(null)} className="px-4 py-2 text-white/50 text-sm">Abbrechen</button>
                <button onClick={handleSendDoc} disabled={saving || !sendForm.to_email}
                  className="px-5 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium disabled:opacity-50 flex items-center gap-2">
                  {saving ? "Sendet..." : <><PaperAirplaneIcon className="w-4 h-4" /> Senden</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
