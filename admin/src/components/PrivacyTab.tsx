"use client";

import { useState, useEffect } from "react";
import {
  ShieldCheckIcon,
  DocumentTextIcon,
  UserIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  TrashIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  EnvelopeIcon,
  LockClosedIcon,
  KeyIcon,
  ServerIcon,
  GlobeAltIcon,
  DocumentDuplicateIcon,
  ClipboardDocumentCheckIcon,
  BellAlertIcon,
  FingerPrintIcon,
} from "@heroicons/react/24/outline";

interface DataSubjectRequest {
  id: number;
  type: "access" | "deletion" | "rectification" | "portability" | "objection";
  requester_name: string;
  requester_email: string;
  status: "pending" | "processing" | "completed" | "rejected";
  submitted_at: string;
  completed_at?: string;
  notes?: string;
}

interface ConsentRecord {
  id: number;
  user_email: string;
  consent_type: string;
  granted: boolean;
  granted_at: string;
  ip_address: string;
  user_agent?: string;
}

interface DataProcessingActivity {
  id: number;
  name: string;
  purpose: string;
  legal_basis: string;
  data_categories: string[];
  recipients: string[];
  retention_period: string;
  security_measures: string[];
  status: "active" | "inactive" | "review";
}

const REQUEST_TYPES = {
  access: { label: "Auskunftsrecht (Art. 15)", color: "blue" },
  deletion: { label: "Löschung (Art. 17)", color: "red" },
  rectification: { label: "Berichtigung (Art. 16)", color: "yellow" },
  portability: { label: "Datenübertragung (Art. 20)", color: "purple" },
  objection: { label: "Widerspruch (Art. 21)", color: "orange" },
};

export default function PrivacyTab() {
  const [activeView, setActiveView] = useState<"overview" | "requests" | "consents" | "processing" | "documents">("overview");
  const [requests, setRequests] = useState<DataSubjectRequest[]>([]);
  const [consents, setConsents] = useState<ConsentRecord[]>([]);
  const [activities, setActivities] = useState<DataProcessingActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<DataSubjectRequest | null>(null);

  useEffect(() => {
    // Mock data - in real implementation, fetch from API
    setRequests([
      {
        id: 1,
        type: "access",
        requester_name: "Max Mustermann",
        requester_email: "max@example.com",
        status: "pending",
        submitted_at: "2026-02-28T14:30:00Z",
      },
      {
        id: 2,
        type: "deletion",
        requester_name: "Anna Schmidt",
        requester_email: "anna@test.de",
        status: "completed",
        submitted_at: "2026-02-20T10:00:00Z",
        completed_at: "2026-02-25T16:00:00Z",
      },
    ]);

    setConsents([
      {
        id: 1,
        user_email: "kunde@example.com",
        consent_type: "newsletter",
        granted: true,
        granted_at: "2026-02-28T10:00:00Z",
        ip_address: "192.168.1.1",
      },
      {
        id: 2,
        user_email: "test@test.de",
        consent_type: "marketing",
        granted: false,
        granted_at: "2026-02-27T15:30:00Z",
        ip_address: "192.168.1.2",
      },
    ]);

    setActivities([
      {
        id: 1,
        name: "Kundenverwaltung",
        purpose: "Verwaltung von Kundenbeziehungen und Projekten",
        legal_basis: "Vertragserfüllung (Art. 6 Abs. 1 lit. b)",
        data_categories: ["Name", "E-Mail", "Telefon", "Firma", "Projektdaten"],
        recipients: ["Interne Mitarbeiter", "Hosting-Provider"],
        retention_period: "10 Jahre nach Vertragsende",
        security_measures: ["SSL/TLS", "Verschlüsselung", "Zugangskontrolle"],
        status: "active",
      },
      {
        id: 2,
        name: "Newsletter-Versand",
        purpose: "Marketing und Information über neue Angebote",
        legal_basis: "Einwilligung (Art. 6 Abs. 1 lit. a)",
        data_categories: ["E-Mail", "Name"],
        recipients: ["E-Mail-Service-Provider"],
        retention_period: "Bis zum Widerruf",
        security_measures: ["SSL/TLS", "Double-Opt-In"],
        status: "active",
      },
      {
        id: 3,
        name: "Website-Analyse",
        purpose: "Verbesserung der Website-Performance",
        legal_basis: "Berechtigtes Interesse (Art. 6 Abs. 1 lit. f)",
        data_categories: ["IP-Adresse (anonymisiert)", "Nutzungsdaten"],
        recipients: ["Vercel Analytics"],
        retention_period: "26 Monate",
        security_measures: ["IP-Anonymisierung", "Keine Cookies"],
        status: "active",
      },
    ]);

    setLoading(false);
  }, []);

  const stats = {
    pendingRequests: requests.filter(r => r.status === "pending").length,
    processingRequests: requests.filter(r => r.status === "processing").length,
    totalConsents: consents.length,
    activeProcessing: activities.filter(a => a.status === "active").length,
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const updateRequestStatus = (id: number, status: DataSubjectRequest["status"]) => {
    setRequests(requests.map(r => 
      r.id === id 
        ? { ...r, status, completed_at: status === "completed" ? new Date().toISOString() : r.completed_at }
        : r
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-[#FC682C] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 rounded-2xl border border-yellow-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-yellow-500/20 rounded-xl">
              <ClockIcon className="w-5 h-5 text-yellow-400" />
            </div>
            <span className="text-sm text-white/50">Offene Anfragen</span>
          </div>
          <p className="text-2xl font-bold text-yellow-400">{stats.pendingRequests}</p>
          <p className="text-xs text-white/30 mt-1">Frist: 30 Tage</p>
        </div>

        <div className="p-5 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-2xl border border-blue-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-500/20 rounded-xl">
              <ClipboardDocumentCheckIcon className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-sm text-white/50">In Bearbeitung</span>
          </div>
          <p className="text-2xl font-bold text-blue-400">{stats.processingRequests}</p>
        </div>

        <div className="p-5 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-2xl border border-green-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-500/20 rounded-xl">
              <CheckCircleIcon className="w-5 h-5 text-green-400" />
            </div>
            <span className="text-sm text-white/50">Einwilligungen</span>
          </div>
          <p className="text-2xl font-bold text-green-400">{stats.totalConsents}</p>
        </div>

        <div className="p-5 bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-2xl border border-purple-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-500/20 rounded-xl">
              <ServerIcon className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-sm text-white/50">Verarbeitungen</span>
          </div>
          <p className="text-2xl font-bold text-purple-400">{stats.activeProcessing}</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2 p-1 bg-white/[0.04] rounded-xl overflow-x-auto">
          {[
            { id: "overview", label: "Übersicht", icon: ShieldCheckIcon },
            { id: "requests", label: "Anfragen", icon: UserIcon },
            { id: "consents", label: "Einwilligungen", icon: CheckCircleIcon },
            { id: "processing", label: "Verzeichnis", icon: DocumentTextIcon },
            { id: "documents", label: "Dokumente", icon: DocumentDuplicateIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as typeof activeView)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                activeView === tab.id ? "bg-white/10 text-white" : "text-white/50 hover:text-white"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview */}
      {activeView === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Compliance Status */}
          <div className="p-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <ShieldCheckIcon className="w-5 h-5 text-green-400" />
              DSGVO-Compliance Status
            </h3>
            <div className="space-y-3">
              {[
                { label: "Datenschutzerklärung", status: "ok", note: "Aktualisiert am 01.01.2026" },
                { label: "Verarbeitungsverzeichnis", status: "ok", note: "3 aktive Verarbeitungen" },
                { label: "Auftragsverarbeitung", status: "ok", note: "AVV mit Vercel, Stripe" },
                { label: "Technische Maßnahmen", status: "ok", note: "SSL, Verschlüsselung, Backup" },
                { label: "Cookie-Banner", status: "warning", note: "Überprüfung empfohlen" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white/[0.02] rounded-xl">
                  <div className="flex items-center gap-3">
                    {item.status === "ok" ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-400" />
                    ) : (
                      <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400" />
                    )}
                    <div>
                      <p className="text-sm text-white">{item.label}</p>
                      <p className="text-xs text-white/40">{item.note}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Requests */}
          <div className="p-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-blue-400" />
              Aktuelle Betroffenenanfragen
            </h3>
            <div className="space-y-3">
              {requests.slice(0, 4).map((req) => (
                <div key={req.id} className="flex items-center justify-between p-3 bg-white/[0.02] rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-${REQUEST_TYPES[req.type].color}-500/20`}>
                      <UserIcon className={`w-4 h-4 text-${REQUEST_TYPES[req.type].color}-400`} />
                    </div>
                    <div>
                      <p className="text-sm text-white">{req.requester_name}</p>
                      <p className="text-xs text-white/40">{REQUEST_TYPES[req.type].label}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs ${
                    req.status === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                    req.status === "processing" ? "bg-blue-500/20 text-blue-400" :
                    req.status === "completed" ? "bg-green-500/20 text-green-400" :
                    "bg-red-500/20 text-red-400"
                  }`}>
                    {req.status === "pending" ? "Offen" :
                     req.status === "processing" ? "In Bearbeitung" :
                     req.status === "completed" ? "Erledigt" : "Abgelehnt"}
                  </span>
                </div>
              ))}
              {requests.length === 0 && (
                <p className="text-center text-white/40 py-4">Keine offenen Anfragen</p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-2 p-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">Schnellaktionen</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Neue Anfrage erfassen", icon: PlusIcon, color: "FC682C" },
                { label: "Löschprotokoll", icon: TrashIcon, color: "red" },
                { label: "Consent exportieren", icon: ArrowDownTrayIcon, color: "blue" },
                { label: "Audit-Log", icon: ClipboardDocumentCheckIcon, color: "purple" },
              ].map((action, i) => (
                <button
                  key={i}
                  className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl text-left hover:bg-white/[0.04] transition-colors group"
                >
                  <action.icon className={`w-5 h-5 text-[#${action.color === "FC682C" ? action.color : action.color + "-400"}] mb-2`} />
                  <p className="text-sm text-white">{action.label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Requests View */}
      {activeView === "requests" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setShowRequestModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-[#FC682C] to-[#FF8F5C] text-white rounded-xl text-sm font-medium flex items-center gap-2"
            >
              <PlusIcon className="w-4 h-4" />
              Anfrage erfassen
            </button>
          </div>

          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-5 py-4 text-left text-xs font-medium text-white/40 uppercase">Typ</th>
                  <th className="px-5 py-4 text-left text-xs font-medium text-white/40 uppercase">Anfragender</th>
                  <th className="px-5 py-4 text-left text-xs font-medium text-white/40 uppercase">Eingegangen</th>
                  <th className="px-5 py-4 text-left text-xs font-medium text-white/40 uppercase">Frist</th>
                  <th className="px-5 py-4 text-left text-xs font-medium text-white/40 uppercase">Status</th>
                  <th className="px-5 py-4 text-left text-xs font-medium text-white/40 uppercase">Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => {
                  const deadline = new Date(req.submitted_at);
                  deadline.setDate(deadline.getDate() + 30);
                  const daysLeft = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <tr key={req.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-xs bg-${REQUEST_TYPES[req.type].color}-500/20 text-${REQUEST_TYPES[req.type].color}-400`}>
                          {REQUEST_TYPES[req.type].label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-white">{req.requester_name}</p>
                        <p className="text-xs text-white/40">{req.requester_email}</p>
                      </td>
                      <td className="px-5 py-4 text-sm text-white/70">{formatDate(req.submitted_at)}</td>
                      <td className="px-5 py-4">
                        {req.status !== "completed" && req.status !== "rejected" ? (
                          <span className={`text-sm ${daysLeft <= 7 ? "text-red-400" : daysLeft <= 14 ? "text-yellow-400" : "text-white/70"}`}>
                            {daysLeft} Tage
                          </span>
                        ) : (
                          <span className="text-sm text-white/40">-</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={req.status}
                          onChange={(e) => updateRequestStatus(req.id, e.target.value as DataSubjectRequest["status"])}
                          className={`px-2.5 py-1 rounded-lg text-xs bg-transparent border outline-none ${
                            req.status === "pending" ? "border-yellow-500/30 text-yellow-400" :
                            req.status === "processing" ? "border-blue-500/30 text-blue-400" :
                            req.status === "completed" ? "border-green-500/30 text-green-400" :
                            "border-red-500/30 text-red-400"
                          }`}
                        >
                          <option value="pending">Offen</option>
                          <option value="processing">In Bearbeitung</option>
                          <option value="completed">Erledigt</option>
                          <option value="rejected">Abgelehnt</option>
                        </select>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-white/10 rounded-lg" title="Details">
                            <EyeIcon className="w-4 h-4 text-white/50" />
                          </button>
                          <button className="p-2 hover:bg-white/10 rounded-lg" title="E-Mail senden">
                            <EnvelopeIcon className="w-4 h-4 text-white/50" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Consents View */}
      {activeView === "consents" && (
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-5 py-4 text-left text-xs font-medium text-white/40 uppercase">E-Mail</th>
                <th className="px-5 py-4 text-left text-xs font-medium text-white/40 uppercase">Einwilligung</th>
                <th className="px-5 py-4 text-left text-xs font-medium text-white/40 uppercase">Status</th>
                <th className="px-5 py-4 text-left text-xs font-medium text-white/40 uppercase">Zeitpunkt</th>
                <th className="px-5 py-4 text-left text-xs font-medium text-white/40 uppercase">IP-Adresse</th>
              </tr>
            </thead>
            <tbody>
              {consents.map((consent) => (
                <tr key={consent.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                  <td className="px-5 py-4 text-sm text-white">{consent.user_email}</td>
                  <td className="px-5 py-4 text-sm text-white/70 capitalize">{consent.consent_type}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs ${
                      consent.granted ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                    }`}>
                      {consent.granted ? "Erteilt" : "Widerrufen"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-white/50">{formatDate(consent.granted_at)}</td>
                  <td className="px-5 py-4 text-sm text-white/30 font-mono">{consent.ip_address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Processing Activities (Verarbeitungsverzeichnis) */}
      {activeView === "processing" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-white/50 text-sm">Verzeichnis von Verarbeitungstätigkeiten nach Art. 30 DSGVO</p>
            <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-white/70 flex items-center gap-2">
              <ArrowDownTrayIcon className="w-4 h-4" />
              Als PDF exportieren
            </button>
          </div>

          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="p-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white">{activity.name}</h4>
                    <p className="text-sm text-white/50">{activity.purpose}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs ${
                    activity.status === "active" ? "bg-green-500/20 text-green-400" :
                    activity.status === "review" ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-white/10 text-white/40"
                  }`}>
                    {activity.status === "active" ? "Aktiv" : activity.status === "review" ? "Prüfung" : "Inaktiv"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-white/40 mb-1">Rechtsgrundlage</p>
                    <p className="text-sm text-white">{activity.legal_basis}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 mb-1">Aufbewahrungsfrist</p>
                    <p className="text-sm text-white">{activity.retention_period}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 mb-1">Datenkategorien</p>
                    <div className="flex flex-wrap gap-1">
                      {activity.data_categories.map((cat, i) => (
                        <span key={i} className="px-2 py-0.5 bg-white/5 rounded text-xs text-white/70">{cat}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 mb-1">Empfänger</p>
                    <div className="flex flex-wrap gap-1">
                      {activity.recipients.map((rec, i) => (
                        <span key={i} className="px-2 py-0.5 bg-white/5 rounded text-xs text-white/70">{rec}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/[0.06]">
                  <p className="text-xs text-white/40 mb-2">Technische & organisatorische Maßnahmen</p>
                  <div className="flex flex-wrap gap-1">
                    {activity.security_measures.map((measure, i) => (
                      <span key={i} className="px-2 py-0.5 bg-green-500/10 text-green-400 rounded text-xs flex items-center gap-1">
                        <LockClosedIcon className="w-3 h-3" />
                        {measure}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Documents */}
      {activeView === "documents" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: "Datenschutzerklärung", desc: "Für Website & Portal", updated: "01.01.2026", icon: DocumentTextIcon },
            { title: "Impressum", desc: "Rechtliche Angaben", updated: "01.01.2026", icon: GlobeAltIcon },
            { title: "AVV Template", desc: "Auftragsverarbeitung", updated: "15.12.2025", icon: DocumentDuplicateIcon },
            { title: "Löschkonzept", desc: "Aufbewahrungsfristen", updated: "01.01.2026", icon: TrashIcon },
            { title: "TOM-Dokumentation", desc: "Technische Maßnahmen", updated: "01.02.2026", icon: LockClosedIcon },
            { title: "Einwilligungsformular", desc: "Consent Template", updated: "01.01.2026", icon: CheckCircleIcon },
          ].map((doc, i) => (
            <div
              key={i}
              className="p-5 bg-white/[0.02] border border-white/[0.06] rounded-2xl hover:bg-white/[0.04] hover:border-white/[0.1] transition-colors cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-[#FC682C]/20 rounded-xl">
                  <doc.icon className="w-5 h-5 text-[#FC682C]" />
                </div>
                <button className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/10 rounded-lg transition-opacity">
                  <ArrowDownTrayIcon className="w-4 h-4 text-white/50" />
                </button>
              </div>
              <h4 className="text-white font-medium mb-1">{doc.title}</h4>
              <p className="text-sm text-white/40 mb-2">{doc.desc}</p>
              <p className="text-xs text-white/30">Aktualisiert: {doc.updated}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
