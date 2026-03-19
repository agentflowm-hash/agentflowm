"use client";

import { useState, useEffect, useCallback } from "react";
import {
  UserPlusIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  ArrowPathIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftIcon,
  PhoneIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilSquareIcon,
  CalendarIcon,
  BellIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";

// ─────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────

interface Activity {
  id: number;
  action: string;
  entity_type: string;
  entity_id: number | null;
  entity_name: string | null;
  details: Record<string, unknown>;
  user_name: string;
  created_at: string;
}

interface ActivityTimelineProps {
  entityType?: string;
  entityId?: number;
  limit?: number;
}

// ─────────────────────────────────────────────────────────────────
// Action Config — Icons, Labels, Colors
// ─────────────────────────────────────────────────────────────────

const ACTION_CONFIG: Record<
  string,
  { icon: typeof UserPlusIcon; label: string; color: string; bg: string }
> = {
  lead_created: {
    icon: UserPlusIcon,
    label: "Lead erstellt",
    color: "text-emerald-400",
    bg: "bg-emerald-500/20 border-emerald-500/30",
  },
  lead_updated: {
    icon: PencilSquareIcon,
    label: "Lead aktualisiert",
    color: "text-blue-400",
    bg: "bg-blue-500/20 border-blue-500/30",
  },
  status_changed: {
    icon: ArrowPathIcon,
    label: "Status geändert",
    color: "text-amber-400",
    bg: "bg-amber-500/20 border-amber-500/30",
  },
  email_sent: {
    icon: EnvelopeIcon,
    label: "E-Mail gesendet",
    color: "text-violet-400",
    bg: "bg-violet-500/20 border-violet-500/30",
  },
  invoice_created: {
    icon: DocumentTextIcon,
    label: "Rechnung erstellt",
    color: "text-cyan-400",
    bg: "bg-cyan-500/20 border-cyan-500/30",
  },
  invoice_sent: {
    icon: CurrencyDollarIcon,
    label: "Rechnung gesendet",
    color: "text-[#FC682C]",
    bg: "bg-[#FC682C]/20 border-[#FC682C]/30",
  },
  payment_received: {
    icon: CheckCircleIcon,
    label: "Zahlung erhalten",
    color: "text-emerald-400",
    bg: "bg-emerald-500/20 border-emerald-500/30",
  },
  call_made: {
    icon: PhoneIcon,
    label: "Anruf getätigt",
    color: "text-sky-400",
    bg: "bg-sky-500/20 border-sky-500/30",
  },
  note_added: {
    icon: ChatBubbleLeftIcon,
    label: "Notiz hinzugefügt",
    color: "text-pink-400",
    bg: "bg-pink-500/20 border-pink-500/30",
  },
  client_created: {
    icon: UserPlusIcon,
    label: "Kunde erstellt",
    color: "text-emerald-400",
    bg: "bg-emerald-500/20 border-emerald-500/30",
  },
  appointment_set: {
    icon: CalendarIcon,
    label: "Termin vereinbart",
    color: "text-indigo-400",
    bg: "bg-indigo-500/20 border-indigo-500/30",
  },
  cancelled: {
    icon: XCircleIcon,
    label: "Storniert",
    color: "text-red-400",
    bg: "bg-red-500/20 border-red-500/30",
  },
};

const DEFAULT_ACTION = {
  icon: BellIcon,
  label: "Aktion",
  color: "text-white/60",
  bg: "bg-white/10 border-white/20",
};

// ─────────────────────────────────────────────────────────────────
// Relative Time Helper
// ─────────────────────────────────────────────────────────────────

function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "gerade eben";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `vor ${minutes} Min.`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `vor ${hours} Std.`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "gestern";
  if (days < 7) return `vor ${days} Tagen`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `vor ${weeks} Wo.`;
  const months = Math.floor(days / 30);
  if (months < 12) return `vor ${months} Mon.`;
  return `vor ${Math.floor(months / 12)} J.`;
}

// ─────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────

export default function ActivityTimeline({
  entityType,
  entityId,
  limit = 30,
}: ActivityTimelineProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState<string>("");

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (entityType) params.set("entity_type", entityType);
      if (entityId) params.set("entity_id", String(entityId));
      params.set("limit", String(limit));

      const res = await fetch(`/api/activity?${params.toString()}`);
      const json = await res.json();

      if (json.success) {
        setActivities(json.data.activities);
      }
    } catch (err) {
      console.error("[ActivityTimeline] Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [entityType, entityId, limit]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  // Filter activities
  const filtered = filterAction
    ? activities.filter((a) => a.action === filterAction)
    : activities;

  // Unique action types for filter dropdown
  const actionTypes = Array.from(new Set(activities.map((a) => a.action)));

  // ─────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-2 border-[#FC682C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-12 text-white/40">
        <BellIcon className="w-10 h-10 mx-auto mb-3 opacity-40" />
        <p className="text-sm">Noch keine Aktivitäten</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter */}
      {actionTypes.length > 1 && (
        <div className="flex items-center gap-2">
          <FunnelIcon className="w-4 h-4 text-white/40" />
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white/80 focus:outline-none focus:border-[#FC682C]/50 transition-colors"
          >
            <option value="">Alle Aktionen</option>
            {actionTypes.map((type) => (
              <option key={type} value={type}>
                {ACTION_CONFIG[type]?.label || type}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[17px] top-2 bottom-2 w-px bg-gradient-to-b from-[#FC682C]/40 via-white/10 to-transparent" />

        <div className="space-y-1">
          {filtered.map((activity) => {
            const config = ACTION_CONFIG[activity.action] || DEFAULT_ACTION;
            const Icon = config.icon;

            return (
              <div
                key={activity.id}
                className="relative flex items-start gap-3 py-2.5 pl-0 pr-2 group"
              >
                {/* Icon Circle */}
                <div
                  className={`relative z-10 flex-shrink-0 w-[35px] h-[35px] rounded-full border flex items-center justify-center ${config.bg} transition-transform group-hover:scale-110`}
                >
                  <Icon className={`w-4 h-4 ${config.color}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm text-white/90 font-medium truncate">
                      {config.label}
                    </p>
                    <span className="text-[11px] text-white/30 whitespace-nowrap flex-shrink-0">
                      {timeAgo(activity.created_at)}
                    </span>
                  </div>

                  {/* Entity name */}
                  {activity.entity_name && (
                    <p className="text-xs text-white/50 mt-0.5 truncate">
                      {activity.entity_name}
                    </p>
                  )}

                  {/* Details */}
                  {activity.details &&
                    Object.keys(activity.details).length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {Object.entries(activity.details).map(
                          ([key, value]) =>
                            value != null && (
                              <span
                                key={key}
                                className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/5 text-[11px] text-white/40"
                              >
                                <span className="text-white/25 mr-1">
                                  {key}:
                                </span>
                                {String(value)}
                              </span>
                            )
                        )}
                      </div>
                    )}

                  {/* User */}
                  {activity.user_name && activity.user_name !== "Admin" && (
                    <p className="text-[11px] text-white/25 mt-1">
                      von {activity.user_name}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export { ActivityTimeline };
export type { Activity, ActivityTimelineProps };
