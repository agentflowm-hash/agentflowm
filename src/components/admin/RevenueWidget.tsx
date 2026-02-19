"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  customer_email: string;
  customer_name: string;
  package_name: string;
  created_at: string;
}

interface RevenueStats {
  totalRevenue: number;
  monthlyRevenue: number;
  weeklyRevenue: number;
  payments: Payment[];
  revenueByPackage: { package: string; revenue: number; count: number }[];
}

export function RevenueWidget() {
  const [stats, setStats] = useState<RevenueStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<"week" | "month" | "all">("month");

  useEffect(() => {
    fetchRevenue();
  }, []);

  const fetchRevenue = async () => {
    try {
      const res = await fetch("/api/admin/revenue");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch revenue:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const getDisplayRevenue = () => {
    if (!stats) return 0;
    switch (timeframe) {
      case "week": return stats.weeklyRevenue;
      case "month": return stats.monthlyRevenue;
      default: return stats.totalRevenue;
    }
  };

  const getGrowthIndicator = () => {
    // Mock growth calculation
    return "+12%";
  };

  return (
    <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-2xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <span className="text-xl">💰</span>
            </div>
            <div>
              <h3 className="font-semibold text-white">Revenue</h3>
              <p className="text-white/40 text-sm">Stripe Zahlungen</p>
            </div>
          </div>
          
          {/* Timeframe Toggle */}
          <div className="flex gap-1 bg-white/5 rounded-lg p-1">
            {(["week", "month", "all"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  timeframe === t
                    ? "bg-emerald-500 text-white"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {t === "week" ? "7T" : t === "month" ? "30T" : "Gesamt"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : stats ? (
        <>
          {/* Main Revenue Display */}
          <div className="p-6">
            <div className="flex items-end gap-3 mb-2">
              <motion.span
                key={timeframe}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold text-white"
              >
                {formatCurrency(getDisplayRevenue())}
              </motion.span>
              <span className="text-emerald-400 text-sm font-medium mb-1">
                {getGrowthIndicator()}
              </span>
            </div>
            <p className="text-white/40 text-sm">
              {timeframe === "week" ? "Diese Woche" : timeframe === "month" ? "Dieser Monat" : "Gesamt"}
            </p>
          </div>

          {/* Revenue by Package */}
          <div className="px-6 pb-4">
            <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Nach Paket</p>
            <div className="space-y-2">
              {stats.revenueByPackage.length > 0 ? (
                stats.revenueByPackage.map((item) => (
                  <div key={item.package} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#FC682C]" />
                      <span className="text-white/80 text-sm">{item.package}</span>
                      <span className="text-white/30 text-xs">({item.count}x)</span>
                    </div>
                    <span className="text-white font-medium text-sm">{formatCurrency(item.revenue)}</span>
                  </div>
                ))
              ) : (
                <p className="text-white/30 text-sm">Noch keine Zahlungen</p>
              )}
            </div>
          </div>

          {/* Recent Payments */}
          <div className="border-t border-white/10">
            <div className="p-4">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Letzte Zahlungen</p>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {stats.payments.slice(0, 5).map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
                  >
                    <div className="min-w-0">
                      <p className="text-white font-medium text-sm truncate">{payment.customer_name}</p>
                      <p className="text-white/40 text-xs">{payment.package_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-400 font-semibold">{formatCurrency(payment.amount / 100)}</p>
                      <p className="text-white/30 text-xs">
                        {new Date(payment.created_at).toLocaleDateString("de-DE")}
                      </p>
                    </div>
                  </div>
                ))}
                {stats.payments.length === 0 && (
                  <p className="text-white/30 text-sm text-center py-4">
                    Noch keine Zahlungen
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="p-8 text-center text-white/40">
          Keine Daten verfügbar
        </div>
      )}
    </div>
  );
}
