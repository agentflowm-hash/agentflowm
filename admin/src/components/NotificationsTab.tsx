"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BellIcon,
  BellAlertIcon,
  CheckIcon,
  TrashIcon,
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  XMarkIcon,
  PlusIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  channels: string[];
  priority: string;
  action_url?: string;
  read_at?: string;
  created_at: string;
  project?: { id: number; name: string };
  client?: { id: number; name: string };
}

export default function NotificationsTab() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [showSendModal, setShowSendModal] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/notifications${filter === "unread" ? "?unread=true" : ""}`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unread_count || 0);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (ids: number[]) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ids }),
      });
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ all: true }),
      });
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
      case "warning": return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400" />;
      case "error": return <ExclamationCircleIcon className="w-5 h-5 text-red-400" />;
      case "deadline": return <ClockIcon className="w-5 h-5 text-orange-400" />;
      case "message": return <ChatBubbleLeftRightIcon className="w-5 h-5 text-blue-400" />;
      case "approval": return <CheckIcon className="w-5 h-5 text-purple-400" />;
      default: return <InformationCircleIcon className="w-5 h-5 text-white/50" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "high": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "normal": return "bg-white/10 text-white/50 border-white/20";
      case "low": return "bg-white/5 text-white/30 border-white/10";
      default: return "bg-white/10 text-white/50 border-white/20";
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "telegram": return "📱";
      case "email": return "📧";
      case "whatsapp": return "💬";
      case "push": return "🔔";
      default: return "📢";
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Gerade eben";
    if (minutes < 60) return `vor ${minutes}m`;
    if (hours < 24) return `vor ${hours}h`;
    if (days < 7) return `vor ${days}d`;
    return date.toLocaleDateString("de-DE");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center relative">
            <BellIcon className="w-5 h-5 text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Notification Hub</h2>
            <p className="text-sm text-white/40">{unreadCount} ungelesen</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowSendModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-[#FC682C] to-[#FF8F5C] text-white rounded-lg text-sm font-medium flex items-center gap-2"
          >
            <PaperAirplaneIcon className="w-4 h-4" />
            Senden
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button className="p-4 bg-[#0f0f12]/80 border border-white/[0.06] rounded-xl hover:border-[#0088cc]/50 transition-colors group text-left">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">📱</span>
            <span className="text-sm font-medium text-white group-hover:text-[#0088cc] transition-colors">Telegram</span>
          </div>
          <p className="text-xs text-white/40">Sofort-Benachrichtigung</p>
        </button>
        <button className="p-4 bg-[#0f0f12]/80 border border-white/[0.06] rounded-xl hover:border-green-500/50 transition-colors group text-left">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">💬</span>
            <span className="text-sm font-medium text-white group-hover:text-green-500 transition-colors">WhatsApp</span>
          </div>
          <p className="text-xs text-white/40">Über Clawdbot</p>
        </button>
        <button className="p-4 bg-[#0f0f12]/80 border border-white/[0.06] rounded-xl hover:border-blue-500/50 transition-colors group text-left">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">📧</span>
            <span className="text-sm font-medium text-white group-hover:text-blue-500 transition-colors">Email</span>
          </div>
          <p className="text-xs text-white/40">Mit Tracking</p>
        </button>
        <button className="p-4 bg-[#0f0f12]/80 border border-white/[0.06] rounded-xl hover:border-purple-500/50 transition-colors group text-left">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🔔</span>
            <span className="text-sm font-medium text-white group-hover:text-purple-500 transition-colors">Push</span>
          </div>
          <p className="text-xs text-white/40">Browser/App</p>
        </button>
      </div>

      {/* Filter & Actions */}
      <div className="flex items-center justify-between">
        <div className="flex bg-white/5 rounded-lg p-1">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${
              filter === "all" ? "bg-[#FC682C] text-white" : "text-white/50 hover:text-white"
            }`}
          >
            Alle
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${
              filter === "unread" ? "bg-[#FC682C] text-white" : "text-white/50 hover:text-white"
            }`}
          >
            Ungelesen ({unreadCount})
          </button>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs text-white/70 transition-colors"
          >
            Alle als gelesen markieren
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-[#0f0f12]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-white/40">Laden...</div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <BellAlertIcon className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/40">Keine Benachrichtigungen</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.06]">
            {notifications.map(notif => (
              <div
                key={notif.id}
                className={`p-4 hover:bg-white/[0.02] transition-colors ${!notif.read_at ? "bg-[#FC682C]/5" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getTypeIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-medium truncate ${!notif.read_at ? "text-white" : "text-white/70"}`}>
                        {notif.title}
                      </h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] border ${getPriorityBadge(notif.priority)}`}>
                        {notif.priority}
                      </span>
                      {!notif.read_at && (
                        <span className="w-2 h-2 bg-[#FC682C] rounded-full" />
                      )}
                    </div>
                    <p className="text-sm text-white/50 line-clamp-2">{notif.message}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-white/40">
                      <span>{formatTime(notif.created_at)}</span>
                      <div className="flex items-center gap-1">
                        {notif.channels.map(ch => (
                          <span key={ch} title={ch}>{getChannelIcon(ch)}</span>
                        ))}
                      </div>
                      {notif.client && (
                        <span className="text-white/30">• {notif.client.name}</span>
                      )}
                      {notif.project && (
                        <span className="text-white/30">• {notif.project.name}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {!notif.read_at && (
                      <button
                        onClick={() => markAsRead([notif.id])}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
                        title="Als gelesen markieren"
                      >
                        <CheckIcon className="w-4 h-4 text-white/30 group-hover:text-green-400" />
                      </button>
                    )}
                    {notif.action_url && (
                      <a
                        href={notif.action_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title="Öffnen"
                      >
                        <PaperAirplaneIcon className="w-4 h-4 text-white/30 hover:text-[#FC682C]" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Send Notification Modal */}
      {showSendModal && (
        <SendNotificationModal
          onClose={() => setShowSendModal(false)}
          onSent={() => { fetchNotifications(); setShowSendModal(false); }}
        />
      )}
    </div>
  );
}

function SendNotificationModal({ onClose, onSent }: { onClose: () => void; onSent: () => void }) {
  const [form, setForm] = useState({
    title: "",
    message: "",
    type: "info",
    priority: "normal",
    channels: ["telegram"] as string[],
  });
  const [sending, setSending] = useState(false);

  const toggleChannel = (ch: string) => {
    if (form.channels.includes(ch)) {
      setForm({ ...form, channels: form.channels.filter(c => c !== ch) });
    } else {
      setForm({ ...form, channels: [...form.channels, ch] });
    }
  };

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
      if (res.ok) {
        onSent();
      }
    } catch (error) {
      console.error(error);
    }
    setSending(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0f0f12] border border-white/10 rounded-2xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Benachrichtigung senden</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg">
            <XMarkIcon className="w-5 h-5 text-white/50" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-white/60 mb-1">Titel *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/10 rounded-lg text-white focus:border-[#FC682C]/50 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-1">Nachricht *</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={3}
              className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/10 rounded-lg text-white focus:border-[#FC682C]/50 outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-1">Typ</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/10 rounded-lg text-white focus:border-[#FC682C]/50 outline-none"
              >
                <option value="info">ℹ️ Info</option>
                <option value="success">✅ Erfolg</option>
                <option value="warning">⚠️ Warnung</option>
                <option value="error">❌ Fehler</option>
                <option value="deadline">⏰ Deadline</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">Priorität</label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/10 rounded-lg text-white focus:border-[#FC682C]/50 outline-none"
              >
                <option value="low">Niedrig</option>
                <option value="normal">Normal</option>
                <option value="high">Hoch</option>
                <option value="urgent">Dringend</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-2">Kanäle</label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "telegram", label: "📱 Telegram" },
                { id: "email", label: "📧 Email" },
                { id: "whatsapp", label: "💬 WhatsApp" },
                { id: "push", label: "🔔 Push" },
              ].map(ch => (
                <button
                  key={ch.id}
                  onClick={() => toggleChannel(ch.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    form.channels.includes(ch.id)
                      ? "bg-[#FC682C] text-white"
                      : "bg-white/10 text-white/50 hover:bg-white/20"
                  }`}
                >
                  {ch.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm transition-colors"
            >
              Abbrechen
            </button>
            <button
              onClick={handleSend}
              disabled={sending || !form.title || !form.message}
              className="flex-1 py-2.5 bg-gradient-to-r from-[#FC682C] to-[#FF8F5C] text-white rounded-xl text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <PaperAirplaneIcon className="w-4 h-4" />
              {sending ? "Senden..." : "Senden"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
