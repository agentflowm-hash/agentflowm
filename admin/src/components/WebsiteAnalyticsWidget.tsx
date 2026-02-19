"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface PageStats {
  path: string;
  title: string;
  views: number;
  avgTime: string;
  bounceRate: number;
}

interface TrafficSource {
  source: string;
  users: number;
  percentage: number;
  icon: string;
  color: string;
}

interface WebStats {
  topPages: PageStats[];
  trafficSources: TrafficSource[];
  hourlyTraffic: number[];
  conversionFunnel: { step: string; users: number; rate: number }[];
}

export function WebsiteAnalyticsWidget() {
  const [stats, setStats] = useState<WebStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pages" | "sources" | "funnel">("pages");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/analytics/website");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      // Fallback mock data
      setStats({
        topPages: [
          { path: "/", title: "Startseite", views: 4521, avgTime: "1:45", bounceRate: 35 },
          { path: "/pakete", title: "Pakete & Preise", views: 2834, avgTime: "3:12", bounceRate: 22 },
          { path: "/termin", title: "Termin buchen", views: 1456, avgTime: "2:30", bounceRate: 18 },
          { path: "/loesung", title: "Unsere Lösung", views: 987, avgTime: "2:05", bounceRate: 42 },
          { path: "/kontakt", title: "Kontakt", views: 654, avgTime: "1:20", bounceRate: 55 },
        ],
        trafficSources: [
          { source: "Google", users: 2156, percentage: 45, icon: "🔍", color: "#4285F4" },
          { source: "Direkt", users: 1234, percentage: 26, icon: "🔗", color: "#22c55e" },
          { source: "Social", users: 687, percentage: 14, icon: "📱", color: "#a855f7" },
          { source: "Referral", users: 423, percentage: 9, icon: "🤝", color: "#f59e0b" },
          { source: "Email", users: 289, percentage: 6, icon: "📧", color: "#ef4444" },
        ],
        hourlyTraffic: [12, 8, 5, 3, 4, 8, 15, 28, 45, 62, 78, 85, 72, 68, 75, 82, 90, 85, 72, 58, 42, 28, 18, 14],
        conversionFunnel: [
          { step: "Besucher", users: 3842, rate: 100 },
          { step: "Pakete angesehen", users: 2156, rate: 56.1 },
          { step: "Termin geklickt", users: 487, rate: 12.7 },
          { step: "Formular gestartet", users: 234, rate: 6.1 },
          { step: "Lead generiert", users: 127, rate: 3.3 },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  // Simple traffic chart
  const TrafficChart = ({ data }: { data: number[] }) => {
    const max = Math.max(...data);
    return (
      <div className="flex items-end justify-between h-16 gap-0.5">
        {data.map((value, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${(value / max) * 100}%` }}
            transition={{ duration: 0.5, delay: i * 0.02 }}
            className="flex-1 bg-gradient-to-t from-[#FC682C] to-[#FC682C]/50 rounded-t"
            title={`${i}:00 - ${value} Besucher`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-2xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FC682C] to-[#ff8f5c] flex items-center justify-center">
            <span className="text-xl">📊</span>
          </div>
          <div>
            <h3 className="font-semibold text-white">Website Analytics</h3>
            <p className="text-white/40 text-sm">Traffic & Verhalten</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/5 rounded-lg p-1">
          {(["pages", "sources", "funnel"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                activeTab === tab
                  ? "bg-[#FC682C] text-white"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {tab === "pages" ? "Seiten" : tab === "sources" ? "Quellen" : "Funnel"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-8 flex justify-center">
          <div className="w-8 h-8 border-2 border-[#FC682C] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : stats ? (
        <div className="p-4">
          {/* Hourly Traffic Chart */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/40 text-xs uppercase tracking-wider">Traffic heute (24h)</p>
              <p className="text-white/60 text-xs">Peak: 18:00</p>
            </div>
            <TrafficChart data={stats.hourlyTraffic} />
            <div className="flex justify-between text-white/30 text-xs mt-1">
              <span>00:00</span>
              <span>12:00</span>
              <span>23:00</span>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "pages" && (
            <div className="space-y-2">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Top Seiten</p>
              {stats.topPages.map((page, i) => (
                <motion.div
                  key={page.path}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <span className="text-white/30 text-sm w-6">{i + 1}.</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">{page.title}</p>
                    <p className="text-white/40 text-xs truncate">{page.path}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold text-sm">{page.views.toLocaleString("de-DE")}</p>
                    <p className="text-white/40 text-xs">Ø {page.avgTime}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === "sources" && (
            <div className="space-y-3">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Traffic Quellen</p>
              {stats.trafficSources.map((source, i) => (
                <motion.div
                  key={source.source}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-xl">{source.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white text-sm">{source.source}</span>
                      <span className="text-white/60 text-sm">{source.users.toLocaleString("de-DE")} ({source.percentage}%)</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${source.percentage}%` }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: source.color }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === "funnel" && (
            <div className="space-y-2">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Conversion Funnel</p>
              {stats.conversionFunnel.map((step, i) => {
                const prevStep = stats.conversionFunnel[i - 1];
                const dropoff = prevStep ? ((prevStep.users - step.users) / prevStep.users * 100).toFixed(1) : null;
                
                return (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div
                      className="relative p-3 rounded-xl text-center overflow-hidden"
                      style={{
                        background: `linear-gradient(90deg, rgba(252, 104, 44, ${0.3 - i * 0.05}) 0%, rgba(252, 104, 44, ${0.1 - i * 0.02}) 100%)`,
                        width: `${100 - i * 8}%`,
                        marginLeft: `${i * 4}%`,
                      }}
                    >
                      <p className="text-white font-medium text-sm">{step.step}</p>
                      <p className="text-white/60 text-xs">
                        {step.users.toLocaleString("de-DE")} ({step.rate}%)
                      </p>
                    </div>
                    {dropoff && i > 0 && (
                      <div className="text-center my-1">
                        <span className="text-red-400/60 text-xs">↓ -{dropoff}% Absprung</span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
