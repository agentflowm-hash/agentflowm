"use client";

import { useState, useEffect } from "react";
import {
  UserPlusIcon,
  EnvelopeIcon,
  PhoneIcon,
  DocumentCheckIcon,
  CurrencyEuroIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ClockIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

interface Activity {
  id: string;
  type: "lead" | "email" | "call" | "deal" | "payment" | "milestone" | "alert" | "ai";
  title: string;
  description: string;
  time: string;
  highlight?: boolean;
}

interface ActivityFeedProps {
  activities: Activity[];
  maxItems?: number;
  onActivityClick?: (activity: Activity) => void;
}

const activityIcons = {
  lead: { icon: UserPlusIcon, color: "bg-blue-500/20 text-blue-400" },
  email: { icon: EnvelopeIcon, color: "bg-purple-500/20 text-purple-400" },
  call: { icon: PhoneIcon, color: "bg-green-500/20 text-green-400" },
  deal: { icon: CurrencyEuroIcon, color: "bg-emerald-500/20 text-emerald-400" },
  payment: { icon: CheckCircleIcon, color: "bg-amber-500/20 text-amber-400" },
  milestone: { icon: DocumentCheckIcon, color: "bg-cyan-500/20 text-cyan-400" },
  alert: { icon: ExclamationCircleIcon, color: "bg-red-500/20 text-red-400" },
  ai: { icon: SparklesIcon, color: "bg-gradient-to-r from-[#FC682C]/20 to-pink-500/20 text-[#FC682C]" },
};

export default function ActivityFeed({
  activities,
  maxItems = 5,
  onActivityClick,
}: ActivityFeedProps) {
  const [visibleActivities, setVisibleActivities] = useState<Activity[]>([]);
  const [newActivity, setNewActivity] = useState<string | null>(null);

  useEffect(() => {
    setVisibleActivities(activities.slice(0, maxItems));
    
    // Flash new activity
    if (activities.length > 0 && activities[0].id !== newActivity) {
      setNewActivity(activities[0].id);
      setTimeout(() => setNewActivity(null), 2000);
    }
  }, [activities, maxItems]);

  if (visibleActivities.length === 0) {
    return (
      <div className="text-center py-8 text-white/40">
        <ClockIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Keine Aktivitäten</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {visibleActivities.map((activity, i) => {
        const { icon: Icon, color } = activityIcons[activity.type];
        const isNew = activity.id === newActivity;

        return (
          <div
            key={activity.id}
            onClick={() => onActivityClick?.(activity)}
            className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer group ${
              isNew
                ? "bg-[#FC682C]/10 border-[#FC682C]/30 animate-pulse"
                : activity.highlight
                  ? "bg-white/[0.03] border-white/[0.08] hover:border-[#FC682C]/30"
                  : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]"
            }`}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            {/* Icon */}
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white group-hover:text-[#FC682C] transition-colors truncate">
                {activity.title}
              </p>
              <p className="text-xs text-white/50 truncate">{activity.description}</p>
            </div>

            {/* Time */}
            <span className="text-xs text-white/30 shrink-0">{activity.time}</span>

            {/* New Badge */}
            {isNew && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#FC682C] rounded-full animate-ping" />
            )}
          </div>
        );
      })}
    </div>
  );
}
