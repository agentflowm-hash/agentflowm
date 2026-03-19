"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components";
import {
  BellIcon,
  BellAlertIcon,
  CheckIcon,
  TrashIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  GlobeAltIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  InformationCircleIcon,
  Cog6ToothIcon,
  LinkIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

// ─────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  link?: string | null;
  read: boolean;
  created_at: string;
}

interface NotificationSettings {
  emailOnNewLead?: boolean;
  emailOnInvoicePaid?: boolean;
  emailOnReferral?: boolean;
  telegramAlerts?: boolean;
  webhookUrl?: string;
  dailySummary?: boolean;
}

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "gerade eben";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `vor ${minutes} Min.`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `vor ${hours} Std.`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "gestern";
  if (days < 7) return `vor ${days} Tagen`;
  return new Date(dateStr).toLocaleDateString("de-DE");
}

function getDateGroup(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const weekAgo = new Date(today.getTime() - 7 * 86400000);

  if (date >= today) return "Heute";
  if (date >= yesterday) return "Gestern";
  if (date >= weekAgo) return "Diese Woche";
  return "Aelter";
}

const TYPE_CONFIG: Record<string, { icon: typeof InformationCircleIcon; color: string; bg: string }> = {
  info: { icon: InformationCircleIcon, color: "text-blue-400", bg: "bg-blue-500/20" },
  success: { icon: CheckCircleIcon, color: "text-green-400", bg: "bg-green-500/20" },
  warning: { icon: ExclamationTriangleIcon, color: "text-amber-400", bg: "bg-amber-500/20" },
  error: { icon: XCircleIcon, color: "text-red-400", bg: "bg-red-500/20" },
};

const DEFAULT_TYPE = { icon: BellIcon, color: "text-white/50", bg: "bg-white/10" };

// ─────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────

export default function NotificationsTab() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "info" | "success" | "warning" | "error">("all");
  const [settings, setSettings] = useState<NotificationSettings>({});
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [showSendModal, setShowSendModal] = useState(false);
  const { showToast } = useToast();

  // ─── Fetch Notifications ─────────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications", { credentials: "include" });
      const raw = await res.json();
      const data = raw?.data || raw;
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch {
      showToast("error", "Fehler beim Laden der Benachrichtigungen");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // ─── Fetch Settings ──────────────────────────────────────────
  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/settings", { credentials: "include" });
      const raw = await res.json();
      const data = raw?.data || raw;
      setSettings(data.settings?.notifications || {});
    } catch {
      // Settings nicht verfuegbar — kein Blocker
    } finally {
      setSettingsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    fetchSettings();
  }, [fetchNotifications, fetchSettings]);

  // ─── Mark Single as Read ─────────────────────────────────────
  const markAsRead = async (id: number) => {
    try {
      await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ read: true }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {
      showToast("error", "Fehler beim Markieren");
    }
  };

  // ─── Mark All as Read ────────────────────────────────────────
  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      showToast("success", "Alle als gelesen markiert");
    } catch {
      showToast("error", "Fehler beim Markieren");
    }
  };

  // ─── Delete Notification ─────────────────────────────────────
  const deleteNotification = async (id: number) => {
    try {
      await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const removed = notifications.find((n) => n.id === id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (removed && !removed.read) setUnreadCount((c) => Math.max(0, c - 1));
    } catch {
      showToast("error", "Fehler beim Loeschen");
    }
  };

  // ─── Toggle Setting ──────────────────────────────────────────
  const toggleSetting = async (key: keyof NotificationSettings) => {
    const newVal = !settings[key];
    const newSettings = { ...settings, [key]: newVal };
    setSettings(newSettings);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ key: "notifications", value: newSettings }),
      });
      const raw = await res.json();
      if (!raw.success) {
        setSettings(settings); // rollback
        showToast("error", "Einstellung konnte nicht gespeichert werden");
      }
    } catch {
      setSettings(settings); // rollback
      showToast("error", "Verbindungsfehler");
    }
  };

  // ─── Click Handler (mark read + navigate) ────────────────────
  const handleNotificationClick = (notif: Notification) => {
    if (!notif.read) markAsRead(notif.id);
    if (notif.link) {
      // Internal links start with /
      if (notif.link.startsWith("/")) {
        // Stay in-app — could navigate, but we just mark read for now
      } else {
        window.open(notif.link, "_blank");
      }
    }
  };

  // ─── Filter + Group ──────────────────────────────────────────
  const filtered = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.read;
    return n.type === filter;
  });

  const groups: Record<string, Notification[]> = {};
  filtered.forEach((n) => {
    const g = getDateGroup(n.created_at);
    if (!groups[g]) groups[g] = [];
    groups[g].push(n);
  });

  const groupOrder = ["Heute", "Gestern", "Diese Woche", "Aelter"];

  // ─── Render ──────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FC682C] to-[#FF8F5C] flex items-center justify-center relative">
            <BellIcon className="w-5 h-5 text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Benachrichtigungen</h2>
            <p className="text-sm text-white/40">{unreadCount} ungelesen</p>
          </div>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-white/70 flex items-center gap-2 transition-colors"
            >
              <CheckIcon className="w-4 h-4" />
              Alle als gelesen
            </button>
          )}
          <button
            onClick={() => setShowSendModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-[#FC682C] to-[#FF8F5C] text-white rounded-xl text-sm font-medium flex items-center gap-2"
          >
            <PaperAirplaneIcon className="w-4 h-4" />
            Senden
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ═════════════════════════════════════════════════════════ */}
        {/* BEREICH 1: Benachrichtigungs-Liste (2/3 Breite)         */}
        {/* ═════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filter Tabs */}
          <div className="flex gap-1 p-1 bg-white/[0.04] rounded-xl overflow-x-auto">
            {([
              { id: "all", label: "Alle" },
              { id: "unread", label: `Ungelesen (${unreadCount})` },
              { id: "info", label: "Leads" },
              { id: "success", label: "Rechnungen" },
              { id: "warning", label: "Follow-Ups" },
              { id: "error", label: "System" },
            ] as const).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  filter === tab.id
                    ? "bg-[#FC682C] text-white shadow-lg"
                    : "text-white/50 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Notification List */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-[#FC682C] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12">
                <BellAlertIcon className="w-10 h-10 text-white/10 mx-auto mb-3" />
                <p className="text-sm text-white/30">
                  {filter === "unread" ? "Keine ungelesenen Benachrichtigungen" : "Keine Benachrichtigungen"}
                </p>
              </div>
            ) : (
              <div>
                {groupOrder.map((groupName) => {
                  const items = groups[groupName];
                  if (!items || items.length === 0) return null;
                  return (
                    <div key={groupName}>
                      {/* Group Header */}
                      <div className="px-5 py-2 bg-white/[0.02] border-b border-white/[0.04]">
                        <span className="text-[11px] font-medium text-white/30 uppercase tracking-wider">
                          {groupName}
                        </span>
                      </div>
                      {/* Items */}
                      {items.map((notif) => {
                        const config = TYPE_CONFIG[notif.type] || DEFAULT_TYPE;
                        const Icon = config.icon;
                        return (
                          <div
                            key={notif.id}
                            onClick={() => handleNotificationClick(notif)}
                            className={`flex items-start gap-3 px-5 py-4 border-b border-white/[0.04] cursor-pointer transition-colors group hover:bg-white/[0.02] ${
                              !notif.read ? "bg-[#FC682C]/[0.03]" : ""
                            }`}
                          >
                            {/* Icon */}
                            <div className={`flex-shrink-0 w-9 h-9 rounded-xl ${config.bg} flex items-center justify-center mt-0.5`}>
                              <Icon className={`w-4.5 h-4.5 ${config.color}`} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className={`text-sm font-medium truncate ${!notif.read ? "text-white" : "text-white/60"}`}>
                                  {notif.title}
                                </h4>
                                {!notif.read && (
                                  <span className="w-2 h-2 rounded-full bg-[#FC682C] flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-xs text-white/40 mt-0.5 line-clamp-2">{notif.message}</p>
                            </div>

                            {/* Time + Actions */}
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <span className="text-[11px] text-white/25 whitespace-nowrap mr-1">
                                {timeAgo(notif.created_at)}
                              </span>
                              {!notif.read && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); markAsRead(notif.id); }}
                                  className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-all"
                                  title="Als gelesen markieren"
                                >
                                  <CheckIcon className="w-3.5 h-3.5 text-white/40" />
                                </button>
                              )}
                              <button
                                onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }}
                                className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/20 transition-all"
                                title="Loeschen"
                              >
                                <TrashIcon className="w-3.5 h-3.5 text-red-400/50" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════ */}
        {/* SIDEBAR: Verbundene Konten + Einstellungen (1/3 Breite)  */}
        {/* ═════════════════════════════════════════════════════════ */}
        <div className="space-y-4">
          {/* BEREICH 2: Verbundene Konten */}
          <div className="p-5 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-white/40" />
              Verbundene Konten
            </h3>

            {settingsLoading ? (
              <div className="flex items-center justify-center py-6">
                <div className="w-5 h-5 border-2 border-[#FC682C] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-3">
                {/* E-Mail (SMTP) */}
                <div className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <EnvelopeIcon className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium">E-Mail</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`w-2 h-2 rounded-full ${settings.emailOnNewLead ? "bg-green-500" : "bg-red-500"}`} />
                      <span className="text-[11px] text-white/40">
                        {settings.emailOnNewLead ? "Verbunden" : "Nicht konfiguriert"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Telegram */}
                <div className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                    <PaperAirplaneIcon className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium">Telegram Bot</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`w-2 h-2 rounded-full ${settings.telegramAlerts ? "bg-green-500" : "bg-red-500"}`} />
                      <span className="text-[11px] text-white/40">
                        {settings.telegramAlerts ? "Aktiv" : "Nicht verbunden"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Webhook */}
                <div className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <GlobeAltIcon className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium">Webhook</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`w-2 h-2 rounded-full ${settings.webhookUrl ? "bg-green-500" : "bg-red-500"}`} />
                      <span className="text-[11px] text-white/40 truncate">
                        {settings.webhookUrl
                          ? settings.webhookUrl.replace(/^https?:\/\//, "").slice(0, 30) + "..."
                          : "Nicht konfiguriert"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Google Kalender */}
                <div className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-xl opacity-60">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <CalendarDaysIcon className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-white font-medium">Google Kalender</p>
                      <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-400 font-medium">
                        BALD
                      </span>
                    </div>
                    <p className="text-[11px] text-white/30 mt-0.5">Sync wird bald verfuegbar</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* BEREICH 3: Quick Toggles */}
          <div className="p-5 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Cog6ToothIcon className="w-4 h-4 text-white/40" />
              Schnelleinstellungen
            </h3>

            <div className="space-y-3">
              <ToggleRow
                label="E-Mail bei neuem Lead"
                enabled={!!settings.emailOnNewLead}
                onToggle={() => toggleSetting("emailOnNewLead")}
              />
              <ToggleRow
                label="E-Mail bei Rechnungszahlung"
                enabled={!!settings.emailOnInvoicePaid}
                onToggle={() => toggleSetting("emailOnInvoicePaid")}
              />
              <ToggleRow
                label="Telegram-Alerts"
                enabled={!!settings.telegramAlerts}
                onToggle={() => toggleSetting("telegramAlerts")}
              />
              <ToggleRow
                label="E-Mail bei Empfehlung"
                enabled={!!settings.emailOnReferral}
                onToggle={() => toggleSetting("emailOnReferral")}
              />
              <ToggleRow
                label="Tages-Zusammenfassung"
                enabled={!!settings.dailySummary}
                onToggle={() => toggleSetting("dailySummary")}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Send Modal */}
      {showSendModal && (
        <SendNotificationModal
          onClose={() => setShowSendModal(false)}
          onSent={() => { fetchNotifications(); setShowSendModal(false); }}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Toggle Row
// ─────────────────────────────────────────────────────────────────

function ToggleRow({ label, enabled, onToggle }: { label: string; enabled: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-white/60">{label}</span>
      <button
        onClick={onToggle}
        className={`relative w-10 h-5.5 rounded-full transition-colors ${
          enabled ? "bg-[#FC682C]" : "bg-white/10"
        }`}
        style={{ width: 40, height: 22 }}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-[18px] h-[18px] rounded-full bg-white shadow transition-transform ${
            enabled ? "translate-x-[18px]" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Send Notification Modal
// ─────────────────────────────────────────────────────────────────

function SendNotificationModal({ onClose, onSent }: { onClose: () => void; onSent: () => void }) {
  const [form, setForm] = useState({
    title: "",
    message: "",
    type: "info",
    link: "",
  });
  const [sending, setSending] = useState(false);
  const { showToast } = useToast();

  const handleSend = async () => {
    if (!form.title || !form.message) return;
    setSending(true);
    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const raw = await res.json();
      if (raw.success) {
        showToast("success", "Benachrichtigung erstellt");
        onSent();
      } else {
        showToast("error", raw.error?.message || "Fehler beim Senden");
      }
    } catch {
      showToast("error", "Verbindungsfehler");
    }
    setSending(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1a1f] border border-white/10 rounded-2xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Benachrichtigung erstellen</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
            <XMarkIcon className="w-5 h-5 text-white/50" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-white/50 mb-1">Titel *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm focus:border-[#FC682C]/50 outline-none"
              placeholder="z.B. Neuer Lead eingegangen"
            />
          </div>

          <div>
            <label className="block text-sm text-white/50 mb-1">Nachricht *</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={3}
              className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm focus:border-[#FC682C]/50 outline-none resize-none"
              placeholder="Beschreibung..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/50 mb-1">Typ</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm focus:border-[#FC682C]/50 outline-none"
              >
                <option value="info" className="bg-[#1a1a1f]">Info</option>
                <option value="success" className="bg-[#1a1a1f]">Erfolg</option>
                <option value="warning" className="bg-[#1a1a1f]">Warnung</option>
                <option value="error" className="bg-[#1a1a1f]">Fehler</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-white/50 mb-1">Link (optional)</label>
              <input
                type="text"
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm focus:border-[#FC682C]/50 outline-none"
                placeholder="/leads oder URL"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white/70 text-sm font-medium transition-colors"
            >
              Abbrechen
            </button>
            <button
              onClick={handleSend}
              disabled={sending || !form.title || !form.message}
              className="flex-1 py-3 bg-gradient-to-r from-[#FC682C] to-[#FF8F5C] text-white rounded-xl text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <PaperAirplaneIcon className="w-4 h-4" />
              {sending ? "Wird erstellt..." : "Erstellen"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
