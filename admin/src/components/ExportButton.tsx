"use client";

import { useState } from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { useToast } from "@/components";

interface ExportButtonProps {
  type: "leads" | "clients" | "invoices" | "accounting";
  label?: string;
}

export default function ExportButton({ type, label = "Export" }: ExportButtonProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/export?type=${type}&format=csv`, { credentials: "include" });
      const data = await res.json();
      const unwrapped = data?.data || data;
      const csv = unwrapped?.export || "";
      if (!csv) { showToast("info", "Keine Daten zum Exportieren"); setLoading(false); return; }

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${type}-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast("success", `${unwrapped?.count || 0} Einträge exportiert`);
    } catch { showToast("error", "Export fehlgeschlagen"); }
    setLoading(false);
  };

  return (
    <button onClick={handleExport} disabled={loading}
      className="flex items-center gap-1.5 px-3 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl text-xs text-white/60 hover:text-white font-medium transition-all disabled:opacity-50">
      {loading ? <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" /> : <ArrowDownTrayIcon className="w-3.5 h-3.5" />}
      {label}
    </button>
  );
}
