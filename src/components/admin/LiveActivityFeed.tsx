"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Activity {
  id: string;
  type: "lead" | "payment" | "chat" | "visit" | "checkout" | "signup";
  title: string;
  subtitle: string;
  timestamp: Date;
  amount?: number;
}

const ACTIVITY_ICONS: Record<string, string> = {
  lead: "📥",
  payment: "💰",
  chat: "💬",
  visit: "👀",
  checkout: "🛒",
  signup: "🎉",
};

const ACTIVITY_COLORS: Record<string, string> = {
  lead: "from-green-500 to-emerald-600",
  payment: "from-yellow-500 to-orange-500",
  chat: "from-purple-500 to-pink-500",
  visit: "from-blue-500 to-cyan-500",
  checkout: "from-orange-500 to-red-500",
  signup: "from-pink-500 to-rose-500",
};

// Simulated real-time activities
const generateActivity = (): Activity => {
  const types: Activity["type"][] = ["lead", "payment", "chat", "visit", "checkout", "signup"];
  const type = types[Math.floor(Math.random() * types.length)];
  
  const activities: Record<string, { title: string; subtitle: string }[]> = {
    lead: [
      { title: "Neuer Lead eingegangen", subtitle: "Max M. - Website Anfrage" },
      { title: "Chat Lead generiert", subtitle: "Sarah K. möchte Angebot" },
      { title: "Website-Check Lead", subtitle: "TechCorp GmbH" },
    ],
    payment: [
      { title: "Zahlung erhalten", subtitle: "Business Paket - 8.390€" },
      { title: "Zahlung bestätigt", subtitle: "Start Paket - 3.790€" },
    ],
    chat: [
      { title: "Neue Chat-Nachricht", subtitle: "Frage zu Paketen" },
      { title: "Chat gestartet", subtitle: "Besucher aus Berlin" },
    ],
    visit: [
      { title: "Neuer Besucher", subtitle: "Pakete-Seite angesehen" },
      { title: "Wiederkehrender Besucher", subtitle: "3. Besuch diese Woche" },
    ],
    checkout: [
      { title: "Checkout gestartet", subtitle: "Business Paket" },
      { title: "Warenkorb erstellt", subtitle: "Growth Paket" },
    ],
    signup: [
      { title: "Newsletter Signup", subtitle: "newsletter@example.de" },
      { title: "Referral registriert", subtitle: "Über Partner-Link" },
    ],
  };

  const activity = activities[type][Math.floor(Math.random() * activities[type].length)];
  
  return {
    id: Date.now().toString() + Math.random(),
    type,
    title: activity.title,
    subtitle: activity.subtitle,
    timestamp: new Date(),
    amount: type === "payment" ? [3790, 8390, 14990][Math.floor(Math.random() * 3)] : undefined,
  };
};

export function LiveActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initial activities
    const initial = Array.from({ length: 5 }, () => generateActivity());
    setActivities(initial);

    // Add new activities periodically
    if (isLive) {
      intervalRef.current = setInterval(() => {
        const newActivity = generateActivity();
        setActivities((prev) => [newActivity, ...prev.slice(0, 19)]);
      }, 4000 + Math.random() * 3000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isLive]);

  const timeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 5) return "gerade eben";
    if (seconds < 60) return `vor ${seconds}s`;
    if (seconds < 3600) return `vor ${Math.floor(seconds / 60)}m`;
    return `vor ${Math.floor(seconds / 3600)}h`;
  };

  const displayActivities = showAll ? activities : activities.slice(0, 6);

  return (
    <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-2xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
              <span className="text-xl">⚡</span>
            </div>
            {isLive && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0a0a0f] animate-pulse" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-white flex items-center gap-2">
              Live Activity
              {isLive && (
                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                  LIVE
                </span>
              )}
            </h3>
            <p className="text-white/40 text-sm">Echtzeit Events</p>
          </div>
        </div>

        <button
          onClick={() => setIsLive(!isLive)}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            isLive
              ? "bg-green-500/20 text-green-400"
              : "bg-white/5 text-white/40"
          }`}
        >
          {isLive ? "⏸ Pause" : "▶ Live"}
        </button>
      </div>

      {/* Activity List */}
      <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto">
        <AnimatePresence initial={false}>
          {displayActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${ACTIVITY_COLORS[activity.type]} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                  <span className="text-lg">{ACTIVITY_ICONS[activity.type]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">{activity.title}</p>
                  <p className="text-white/50 text-xs truncate">{activity.subtitle}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  {activity.amount ? (
                    <p className="text-emerald-400 font-semibold text-sm">
                      +{activity.amount.toLocaleString("de-DE")}€
                    </p>
                  ) : null}
                  <p className="text-white/30 text-xs">{timeAgo(activity.timestamp)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Show More */}
      {activities.length > 6 && (
        <div className="p-3 border-t border-white/10 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-white/40 hover:text-white text-sm transition-colors"
          >
            {showAll ? "Weniger anzeigen" : `+${activities.length - 6} weitere anzeigen`}
          </button>
        </div>
      )}
    </div>
  );
}
