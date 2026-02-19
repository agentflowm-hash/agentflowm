"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function QuickNotifyWidget() {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [channel, setChannel] = useState<"telegram" | "email">("telegram");

  const sendNotification = async () => {
    if (!message.trim()) return;
    
    setSending(true);
    try {
      const res = await fetch("/api/admin/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, channel }),
      });
      
      if (res.ok) {
        setSent(true);
        setMessage("");
        setTimeout(() => setSent(false), 3000);
      }
    } catch (error) {
      console.error("Notification error:", error);
    } finally {
      setSending(false);
    }
  };

  const quickMessages = [
    "🚀 Neues Feature live!",
    "📊 Wochenbericht ready",
    "⚠️ System-Check needed",
    "✅ Task abgeschlossen",
  ];

  return (
    <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-2xl border border-white/10 p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
          <span className="text-xl">📣</span>
        </div>
        <div>
          <h3 className="font-semibold text-white">Quick Notify</h3>
          <p className="text-white/40 text-sm">Schnelle Nachricht senden</p>
        </div>
      </div>

      {/* Channel Toggle */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setChannel("telegram")}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
            channel === "telegram"
              ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
              : "bg-white/5 text-white/50 border border-transparent"
          }`}
        >
          📱 Telegram
        </button>
        <button
          onClick={() => setChannel("email")}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
            channel === "email"
              ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
              : "bg-white/5 text-white/50 border border-transparent"
          }`}
        >
          📧 E-Mail
        </button>
      </div>

      {/* Quick Messages */}
      <div className="flex flex-wrap gap-2 mb-3">
        {quickMessages.map((msg) => (
          <button
            key={msg}
            onClick={() => setMessage(msg)}
            className="px-3 py-1 bg-white/5 hover:bg-white/10 text-white/60 text-xs rounded-full transition-colors"
          >
            {msg}
          </button>
        ))}
      </div>

      {/* Message Input */}
      <div className="relative">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Nachricht eingeben..."
          rows={2}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-blue-500/50 resize-none"
        />
        <button
          onClick={sendNotification}
          disabled={!message.trim() || sending}
          className="absolute bottom-3 right-3 px-4 py-1.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
        >
          {sending ? "..." : "Senden"}
        </button>
      </div>

      {/* Success Message */}
      {sent && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-center text-green-400 text-sm"
        >
          ✅ Nachricht gesendet!
        </motion.div>
      )}
    </div>
  );
}
