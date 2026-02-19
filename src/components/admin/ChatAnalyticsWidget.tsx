"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface ChatStats {
  totalConversations: number;
  todayConversations: number;
  leadsFromChat: number;
  avgMessagesPerConvo: number;
  popularQuestions: { question: string; count: number }[];
}

export function ChatAnalyticsWidget() {
  const [stats, setStats] = useState<ChatStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading chat stats (would connect to actual analytics)
    setTimeout(() => {
      setStats({
        totalConversations: 127,
        todayConversations: 8,
        leadsFromChat: 34,
        avgMessagesPerConvo: 5.2,
        popularQuestions: [
          { question: "Preise & Pakete", count: 45 },
          { question: "Zeitrahmen", count: 32 },
          { question: "Website Projekt", count: 28 },
          { question: "Termin buchen", count: 22 },
        ],
      });
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-2xl border border-white/10 p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
          <span className="text-xl">💬</span>
        </div>
        <div>
          <h3 className="font-semibold text-white">Chat Analytics</h3>
          <p className="text-white/40 text-sm">Widget Performance</p>
        </div>
      </div>

      {loading ? (
        <div className="h-32 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : stats ? (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white/5 rounded-xl p-3">
              <p className="text-2xl font-bold text-white">{stats.todayConversations}</p>
              <p className="text-white/40 text-xs">Heute</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3">
              <p className="text-2xl font-bold text-white">{stats.totalConversations}</p>
              <p className="text-white/40 text-xs">Gesamt</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3">
              <p className="text-2xl font-bold text-purple-400">{stats.leadsFromChat}</p>
              <p className="text-white/40 text-xs">Leads generiert</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3">
              <p className="text-2xl font-bold text-white">{stats.avgMessagesPerConvo}</p>
              <p className="text-white/40 text-xs">Ø Messages</p>
            </div>
          </div>

          {/* Popular Questions */}
          <div>
            <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Top Themen</p>
            <div className="space-y-2">
              {stats.popularQuestions.map((q, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(q.count / stats.popularQuestions[0].count) * 100}%` }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    />
                  </div>
                  <span className="text-white/60 text-xs w-20 truncate">{q.question}</span>
                  <span className="text-white/30 text-xs w-8 text-right">{q.count}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
