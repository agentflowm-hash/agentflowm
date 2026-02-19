"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Insight {
  id: string;
  type: "success" | "warning" | "info" | "opportunity";
  title: string;
  description: string;
  action?: string;
  metric?: string;
  icon: string;
}

const INSIGHT_STYLES = {
  success: "from-green-500/20 to-emerald-500/10 border-green-500/30",
  warning: "from-yellow-500/20 to-orange-500/10 border-yellow-500/30",
  info: "from-blue-500/20 to-cyan-500/10 border-blue-500/30",
  opportunity: "from-purple-500/20 to-pink-500/10 border-purple-500/30",
};

export function AIInsightsWidget() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    generateInsights();
  }, []);

  const generateInsights = () => {
    setLoading(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const newInsights: Insight[] = [
        {
          id: "1",
          type: "opportunity",
          title: "Conversion-Potenzial erkannt",
          description: "12 Leads haben die Pakete-Seite mehrfach besucht aber nicht gebucht. Ein Follow-up könnte lohnenswert sein.",
          action: "Leads kontaktieren",
          metric: "+24% Umsatz möglich",
          icon: "🎯",
        },
        {
          id: "2",
          type: "success",
          title: "Chat-Widget performt überdurchschnittlich",
          description: "27% der Chat-Unterhaltungen konvertieren zu Leads. Das liegt 12% über dem Benchmark.",
          metric: "27% Conversion",
          icon: "🚀",
        },
        {
          id: "3",
          type: "warning",
          title: "Response-Zeit gestiegen",
          description: "Die durchschnittliche Antwortzeit auf Leads ist von 2h auf 5h gestiegen. Schnellere Reaktion empfohlen.",
          action: "Leads prüfen",
          icon: "⏰",
        },
        {
          id: "4",
          type: "info",
          title: "Traffic-Spike erwartet",
          description: "Basierend auf historischen Daten erwarten wir nächste Woche +40% mehr Traffic (Jahresendspurt).",
          metric: "+40% Traffic",
          icon: "📈",
        },
        {
          id: "5",
          type: "opportunity",
          title: "Business Paket trending",
          description: "Das Business Paket wird 3x häufiger angeschaut als letzte Woche. Guter Zeitpunkt für gezielte Promotion.",
          action: "Kampagne starten",
          icon: "💎",
        },
      ];
      
      setInsights(newInsights);
      setLoading(false);
      setRefreshing(false);
    }, 1500);
  };

  const refresh = () => {
    setRefreshing(true);
    generateInsights();
  };

  const dismissInsight = (id: string) => {
    setInsights((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-2xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <span className="text-xl">🧠</span>
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-3 h-3 bg-violet-500 rounded-full"
            />
          </div>
          <div>
            <h3 className="font-semibold text-white flex items-center gap-2">
              AI Insights
              <span className="px-2 py-0.5 bg-violet-500/20 text-violet-400 text-xs rounded-full">
                BETA
              </span>
            </h3>
            <p className="text-white/40 text-sm">Intelligente Analysen</p>
          </div>
        </div>

        <button
          onClick={refresh}
          disabled={refreshing}
          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/60 text-xs rounded-lg transition-colors disabled:opacity-50"
        >
          {refreshing ? (
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
              Analysiere...
            </span>
          ) : (
            "🔄 Refresh"
          )}
        </button>
      </div>

      {/* Insights */}
      <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center py-8">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-violet-500/20" />
              <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl">🧠</span>
              </div>
            </div>
            <p className="text-white/40 text-sm mt-4">AI analysiert deine Daten...</p>
          </div>
        ) : (
          <AnimatePresence>
            {insights.map((insight, index) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-4 rounded-xl border bg-gradient-to-r ${INSIGHT_STYLES[insight.type]} group`}
              >
                {/* Dismiss Button */}
                <button
                  onClick={() => dismissInsight(insight.id)}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/20 transition-all"
                >
                  ✕
                </button>

                <div className="flex gap-3">
                  <span className="text-2xl flex-shrink-0">{insight.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white font-medium text-sm">{insight.title}</h4>
                      {insight.metric && (
                        <span className="px-2 py-0.5 bg-white/10 text-white/70 text-xs rounded-full">
                          {insight.metric}
                        </span>
                      )}
                    </div>
                    <p className="text-white/60 text-sm">{insight.description}</p>
                    {insight.action && (
                      <button className="mt-2 px-3 py-1 bg-white/10 hover:bg-white/20 text-white/80 text-xs rounded-lg transition-colors">
                        {insight.action} →
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {!loading && insights.length === 0 && (
          <div className="text-center py-8 text-white/40">
            <span className="text-3xl mb-2 block">✨</span>
            Keine neuen Insights
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-white/10 bg-white/[0.02] text-center">
        <p className="text-white/30 text-xs">
          Powered by AI • Aktualisiert {new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  );
}
