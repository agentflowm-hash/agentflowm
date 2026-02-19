"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  createdAt: string;
  pdfPath?: string;
}

export function InvoicesWidget() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await fetch("/api/admin/invoices");
      if (res.ok) {
        const data = await res.json();
        setInvoices(data.invoices || []);
      }
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const resendInvoice = async (invoiceId: string) => {
    try {
      await fetch("/api/admin/invoices/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId }),
      });
      alert("Rechnung wurde erneut gesendet!");
    } catch (error) {
      console.error("Resend error:", error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-500/20 text-green-400";
      case "pending": return "bg-yellow-500/20 text-yellow-400";
      case "overdue": return "bg-red-500/20 text-red-400";
      default: return "bg-white/10 text-white/60";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid": return "Bezahlt";
      case "pending": return "Offen";
      case "overdue": return "Überfällig";
      default: return status;
    }
  };

  return (
    <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-2xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
            <span className="text-xl">📄</span>
          </div>
          <div>
            <h3 className="font-semibold text-white">Rechnungen</h3>
            <p className="text-white/40 text-sm">{invoices.length} Rechnungen</p>
          </div>
        </div>
        <button
          onClick={() => window.open("/api/admin/invoices/export", "_blank")}
          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/60 text-xs rounded-lg transition-colors"
        >
          Exportieren
        </button>
      </div>

      {/* Invoice List */}
      <div className="max-h-[300px] overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : invoices.length === 0 ? (
          <div className="p-8 text-center text-white/40">
            <span className="text-3xl mb-2 block">📄</span>
            Keine Rechnungen vorhanden
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {invoices.map((invoice) => (
              <motion.div
                key={invoice.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-white/80 text-sm">{invoice.invoiceNumber}</p>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusStyle(invoice.status)}`}>
                        {getStatusText(invoice.status)}
                      </span>
                    </div>
                    <p className="text-white/50 text-sm truncate">{invoice.customerName}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-white font-semibold">{formatCurrency(invoice.amount)}</p>
                    <p className="text-white/30 text-xs">
                      {new Date(invoice.createdAt).toLocaleDateString("de-DE")}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {invoice.pdfPath && (
                      <a
                        href={invoice.pdfPath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 transition-colors"
                        title="PDF herunterladen"
                      >
                        📥
                      </a>
                    )}
                    <button
                      onClick={() => resendInvoice(invoice.id)}
                      className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 transition-colors"
                      title="Erneut senden"
                    >
                      📧
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
