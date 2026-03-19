"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useToast } from "@/components";
import {
  ArrowPathIcon as RecurringIcon,
  CalculatorIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  PlusIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  ReceiptPercentIcon,
  BuildingLibraryIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  DocumentArrowDownIcon,
  PrinterIcon,
} from "@heroicons/react/24/outline";

interface Transaction {
  id: number;
  date: string;
  description: string;
  category: string;
  type: "income" | "expense";
  amount: number;
  tax_rate: number;
  tax_amount: number;
  net_amount: number;
  account: string;
  reference?: string;
  notes?: string;
  invoice_id?: number;
  created_at: string;
}

const CATEGORIES = {
  income: [
    "Website-Projekte",
    "Web Apps",
    "Mobile Apps",
    "Wartung & Support",
    "Beratung",
    "Sonstiges",
  ],
  expense: [
    "Empfehlungsprovision",
    "Software & Tools",
    "Hosting & Server",
    "Marketing",
    "Büro & Material",
    "Freelancer",
    "Reisekosten",
    "Fortbildung",
    "Versicherungen",
    "Sonstiges",
  ],
};

const TAX_RATES = [0, 7, 19];

function unwrapApi<T>(res: unknown): T {
  if (res && typeof res === 'object' && 'data' in res) return (res as any).data;
  return res as T;
}

export default function AccountingTab() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [activeView, setActiveView] = useState<"overview" | "transactions" | "taxes" | "reports">("overview");
  const [filter, setFilter] = useState({ 
    type: "all", 
    month: new Date().getMonth(), 
    year: new Date().getFullYear() 
  });
  const [editMode, setEditMode] = useState(false);
  const [exportStatus, setExportStatus] = useState<string | null>(null);
  const [generatingInvoices, setGeneratingInvoices] = useState(false);
  const { showToast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    category: "",
    type: "income" as "income" | "expense",
    amount: "",
    tax_rate: 19,
    account: "Geschäftskonto",
    reference: "",
    notes: "",
  });

  // Load transactions from Supabase API
  const fetchTransactions = useCallback(() => {
    setLoading(true);
    fetch("/api/accounting", { credentials: "include" })
      .then(r => r.json())
      .then(data => {
        const d = unwrapApi<{ transactions: Transaction[] }>(data);
        setTransactions(d.transactions || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  // Calculate stats from transactions
  const stats = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyTransactions = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const yearTransactions = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getFullYear() === currentYear;
    });

    const monthlyIncome = monthlyTransactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
    const monthlyExpenses = monthlyTransactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
    const monthlyTaxCollected = monthlyTransactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.tax_amount, 0);
    const monthlyTaxPaid = monthlyTransactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.tax_amount, 0);

    const yearIncome = yearTransactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
    const yearExpenses = yearTransactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);

    // Kategorien-Übersicht
    const categoryBreakdown: Record<string, { income: number; expense: number }> = {};
    yearTransactions.forEach(t => {
      if (!categoryBreakdown[t.category]) categoryBreakdown[t.category] = { income: 0, expense: 0 };
      categoryBreakdown[t.category][t.type] += t.amount;
    });

    // Monatlicher Vergleich (12 Monate)
    const monthlyComparison: { month: number; income: number; expense: number }[] = [];
    for (let m = 0; m < 12; m++) {
      const mTx = yearTransactions.filter(t => new Date(t.date).getMonth() === m);
      monthlyComparison.push({
        month: m,
        income: mTx.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0),
        expense: mTx.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0),
      });
    }

    return {
      totalIncome: monthlyIncome,
      totalExpenses: monthlyExpenses,
      netProfit: monthlyIncome - monthlyExpenses,
      pendingTax: monthlyTaxCollected,
      paidTax: monthlyTaxPaid,
      taxLiability: monthlyTaxCollected - monthlyTaxPaid,
      yearToDate: {
        income: yearIncome,
        expenses: yearExpenses,
        profit: yearIncome - yearExpenses,
      },
      categoryBreakdown,
      monthlyComparison,
    };
  }, [transactions]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const date = new Date(t.date);
      const matchesType = filter.type === "all" || t.type === filter.type;
      const matchesMonth = date.getMonth() === filter.month;
      const matchesYear = date.getFullYear() === filter.year;
      return matchesType && matchesMonth && matchesYear;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, filter]);

  // Tax calculations per quarter
  const taxByQuarter = useMemo(() => {
    const year = new Date().getFullYear();
    const quarters = [
      { name: "Q1 (Jan-Mär)", months: [0, 1, 2], due: `10.04.${year}` },
      { name: "Q2 (Apr-Jun)", months: [3, 4, 5], due: `10.07.${year}` },
      { name: "Q3 (Jul-Sep)", months: [6, 7, 8], due: `10.10.${year}` },
      { name: "Q4 (Okt-Dez)", months: [9, 10, 11], due: `10.01.${year + 1}` },
    ];

    return quarters.map(q => {
      const quarterTransactions = transactions.filter(t => {
        const d = new Date(t.date);
        return d.getFullYear() === year && q.months.includes(d.getMonth());
      });

      const collectedTax = quarterTransactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.tax_amount, 0);
      const paidTax = quarterTransactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.tax_amount, 0);
      
      const currentQuarter = Math.floor(new Date().getMonth() / 3);
      const quarterIndex = quarters.indexOf(q);
      
      let status: "paid" | "open" | "upcoming" = "upcoming";
      if (quarterIndex < currentQuarter) status = "paid";
      else if (quarterIndex === currentQuarter) status = "open";

      return {
        ...q,
        collectedTax,
        paidTax,
        liability: collectedTax - paidTax,
        status,
      };
    });
  }, [transactions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(formData.amount) || 0;
    const taxAmount = (amount * formData.tax_rate) / (100 + formData.tax_rate);
    const netAmount = amount - taxAmount;

    const payload = {
      date: formData.date, description: formData.description, category: formData.category,
      type: formData.type, amount, tax_rate: formData.tax_rate,
      account: formData.account, reference: formData.reference, notes: formData.notes,
    };

    const url = editMode && selectedTransaction
      ? `/api/accounting/${selectedTransaction.id}`
      : "/api/accounting";
    const method = editMode ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        credentials: "include",
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        showToast("success", editMode ? "Buchung aktualisiert" : "Buchung erstellt");
        fetchTransactions();
      } else {
        showToast("error", json.error?.message || "Fehler beim Speichern");
      }
    } catch {
      showToast("error", "Verbindungsfehler");
    }

    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      description: "",
      category: "",
      type: "income",
      amount: "",
      tax_rate: 19,
      account: "Geschäftskonto",
      reference: "",
      notes: "",
    });
    setEditMode(false);
    setSelectedTransaction(null);
  };

  const openEditModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setFormData({
      date: transaction.date,
      description: transaction.description,
      category: transaction.category,
      type: transaction.type,
      amount: transaction.amount.toString(),
      tax_rate: transaction.tax_rate,
      account: transaction.account,
      reference: transaction.reference || "",
      notes: transaction.notes || "",
    });
    setEditMode(true);
    setShowModal(true);
  };

  const openDetailModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailModal(true);
  };

  const confirmDelete = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowDeleteConfirm(true);
  };

  const deleteTransaction = async () => {
    if (selectedTransaction) {
      try {
        const res = await fetch(`/api/accounting/${selectedTransaction.id}`, { credentials: "include", method: "DELETE" });
        const json = await res.json();
        if (json.success) {
          showToast("success", "Buchung gelöscht");
          fetchTransactions();
        } else {
          showToast("error", "Fehler beim Löschen");
        }
      } catch {
        showToast("error", "Verbindungsfehler");
      }
      setShowDeleteConfirm(false);
      setShowDetailModal(false);
      setSelectedTransaction(null);
    }
  };

  const generateRecurringInvoices = async () => {
    setGeneratingInvoices(true);
    try {
      const res = await fetch("/api/subscriptions/generate-invoices", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        const raw = await res.json();
        const data = unwrapApi<{ generated: number; invoices: any[] }>(raw);
        if (data.generated > 0) {
          showToast("success", `${data.generated} Rechnung${data.generated > 1 ? "en" : ""} generiert`);
          fetchTransactions();
        } else {
          showToast("info", "Keine fälligen Abos gefunden");
        }
      } else {
        showToast("error", "Fehler beim Generieren der Rechnungen");
      }
    } catch {
      showToast("error", "Verbindungsfehler");
    }
    setGeneratingInvoices(false);
  };

  const exportToPDF = async () => {
    setExportStatus("PDF wird generiert...");
    try {
      const res = await fetch(`/api/accounting/export-pdf?month=${filter.month}&year=${filter.year}`, { credentials: "include" });
      const json = await res.json();
      if (json.success) {
        const htmlContent = json.data.html;
        const printWindow = window.open("", "_blank");
        if (printWindow) {
          printWindow.document.write(htmlContent);
          printWindow.document.close();
          printWindow.focus();
          setTimeout(() => printWindow.print(), 500);
        }
        showToast("success", "PDF Export geöffnet");
      } else {
        showToast("error", "PDF Export fehlgeschlagen");
      }
    } catch {
      showToast("error", "Verbindungsfehler");
    }
    setExportStatus(null);
  };

  const exportToCSV = () => {
    setExportStatus("Exportiere...");
    
    const headers = ["Datum", "Beschreibung", "Kategorie", "Typ", "Brutto", "Netto", "USt", "USt-%", "Konto", "Referenz"];
    const rows = filteredTransactions.map(t => [
      t.date,
      `"${t.description}"`,
      t.category,
      t.type === "income" ? "Einnahme" : "Ausgabe",
      t.amount.toFixed(2).replace(".", ","),
      t.net_amount.toFixed(2).replace(".", ","),
      t.tax_amount.toFixed(2).replace(".", ","),
      t.tax_rate + "%",
      t.account,
      t.reference || "",
    ]);

    const csv = [headers.join(";"), ...rows.map(r => r.join(";"))].join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `buchungen_${filter.year}_${String(filter.month + 1).padStart(2, "0")}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    setExportStatus("✓ Exportiert!");
    setTimeout(() => setExportStatus(null), 2000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-[#FC682C] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-2xl border border-green-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-500/20 rounded-xl">
              <ArrowTrendingUpIcon className="w-5 h-5 text-green-400" />
            </div>
            <span className="text-sm text-white/50">Einnahmen</span>
          </div>
          <p className="text-2xl font-bold text-green-400">{formatCurrency(stats.totalIncome)}</p>
          <p className="text-xs text-white/30 mt-1">Dieser Monat</p>
        </div>

        <div className="p-5 bg-gradient-to-br from-red-500/10 to-red-500/5 rounded-2xl border border-red-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-red-500/20 rounded-xl">
              <ArrowTrendingDownIcon className="w-5 h-5 text-red-400" />
            </div>
            <span className="text-sm text-white/50">Ausgaben</span>
          </div>
          <p className="text-2xl font-bold text-red-400">{formatCurrency(stats.totalExpenses)}</p>
          <p className="text-xs text-white/30 mt-1">Dieser Monat</p>
        </div>

        <div className="p-5 bg-gradient-to-br from-[#FC682C]/10 to-[#FC682C]/5 rounded-2xl border border-[#FC682C]/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-[#FC682C]/20 rounded-xl">
              <BanknotesIcon className="w-5 h-5 text-[#FC682C]" />
            </div>
            <span className="text-sm text-white/50">Gewinn</span>
          </div>
          <p className="text-2xl font-bold text-[#FC682C]">{formatCurrency(stats.netProfit)}</p>
          <p className="text-xs text-white/30 mt-1">Netto nach Ausgaben</p>
        </div>

        <div className="p-5 bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-2xl border border-purple-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-500/20 rounded-xl">
              <ReceiptPercentIcon className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-sm text-white/50">USt-Rückstellung</span>
          </div>
          <p className="text-2xl font-bold text-purple-400">{formatCurrency(stats.pendingTax)}</p>
          <p className="text-xs text-white/30 mt-1">Noch abzuführen</p>
        </div>
      </div>

      {/* View Tabs & Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2 p-1 bg-white/[0.04] rounded-xl">
          {[
            { id: "overview", label: "Übersicht", icon: ChartBarIcon },
            { id: "transactions", label: "Buchungen", icon: ClipboardDocumentListIcon },
            { id: "taxes", label: "Steuern", icon: ReceiptPercentIcon },
            { id: "reports", label: "Berichte", icon: DocumentTextIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as typeof activeView)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                activeView === tab.id ? "bg-white/10 text-white" : "text-white/50 hover:text-white"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={generateRecurringInvoices}
            disabled={generatingInvoices}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-white/70 flex items-center gap-2 transition-colors disabled:opacity-40"
          >
            <RecurringIcon className={`w-4 h-4 ${generatingInvoices ? "animate-spin" : ""}`} />
            {generatingInvoices ? "Generiere..." : "Fällige Rechnungen"}
          </button>
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-white/70 flex items-center gap-2 transition-colors"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            CSV
          </button>
          <button
            onClick={exportToPDF}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-white/70 flex items-center gap-2 transition-colors"
          >
            <DocumentArrowDownIcon className="w-4 h-4" />
            {exportStatus || "PDF"}
          </button>
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="px-4 py-2 bg-gradient-to-r from-[#FC682C] to-[#FF8F5C] text-white rounded-xl text-sm font-medium flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Neue Buchung
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      {activeView === "transactions" && (
        <div className="flex gap-3 items-center flex-wrap">
          <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.04] rounded-xl">
            <FunnelIcon className="w-4 h-4 text-white/40" />
            <select
              value={filter.type}
              onChange={(e) => setFilter({ ...filter, type: e.target.value })}
              className="bg-transparent text-white text-sm outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#1a1a1f]">Alle Buchungen</option>
              <option value="income" className="bg-[#1a1a1f]">Nur Einnahmen</option>
              <option value="expense" className="bg-[#1a1a1f]">Nur Ausgaben</option>
            </select>
          </div>
          <select
            value={filter.month}
            onChange={(e) => setFilter({ ...filter, month: parseInt(e.target.value) })}
            className="px-3 py-2 bg-white/[0.04] rounded-xl text-white text-sm outline-none cursor-pointer"
          >
            {["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"].map((m, i) => (
              <option key={i} value={i} className="bg-[#1a1a1f]">{m}</option>
            ))}
          </select>
          <select
            value={filter.year}
            onChange={(e) => setFilter({ ...filter, year: parseInt(e.target.value) })}
            className="px-3 py-2 bg-white/[0.04] rounded-xl text-white text-sm outline-none cursor-pointer"
          >
            <option value={2025} className="bg-[#1a1a1f]">2025</option>
            <option value={2026} className="bg-[#1a1a1f]">2026</option>
          </select>
          <span className="text-sm text-white/40">
            {filteredTransactions.length} Buchung{filteredTransactions.length !== 1 ? "en" : ""}
          </span>
        </div>
      )}

      {/* Content based on view */}
      {activeView === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Transactions */}
          <div className="p-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <ClipboardDocumentListIcon className="w-5 h-5 text-[#FC682C]" />
              Letzte Buchungen
            </h3>
            <div className="space-y-3">
              {transactions.slice(0, 5).map((t) => (
                <div 
                  key={t.id} 
                  onClick={() => openDetailModal(t)}
                  className="flex items-center justify-between p-3 bg-white/[0.02] rounded-xl cursor-pointer hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${t.type === "income" ? "bg-green-500/20" : "bg-red-500/20"}`}>
                      {t.type === "income" ? (
                        <ArrowTrendingUpIcon className="w-4 h-4 text-green-400" />
                      ) : (
                        <ArrowTrendingDownIcon className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{t.description}</p>
                      <p className="text-xs text-white/40">{t.category} • {formatDate(t.date)}</p>
                    </div>
                  </div>
                  <p className={`text-sm font-medium ${t.type === "income" ? "text-green-400" : "text-red-400"}`}>
                    {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                  </p>
                </div>
              ))}
              {transactions.length === 0 && (
                <p className="text-center text-white/40 py-4">Keine Buchungen vorhanden</p>
              )}
            </div>
          </div>

          {/* Tax Overview */}
          <div className="p-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <ReceiptPercentIcon className="w-5 h-5 text-purple-400" />
              USt-Übersicht Q{Math.floor(new Date().getMonth() / 3) + 1}/{new Date().getFullYear()}
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-white/[0.02] rounded-xl">
                <span className="text-white/60">Eingenommene USt</span>
                <span className="text-white font-medium">{formatCurrency(stats.pendingTax)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/[0.02] rounded-xl">
                <span className="text-white/60">Gezahlte Vorsteuer</span>
                <span className="text-white font-medium">{formatCurrency(stats.paidTax)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                <span className="text-purple-400 font-medium">USt-Zahllast</span>
                <span className="text-purple-400 font-bold">{formatCurrency(stats.taxLiability)}</span>
              </div>
              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-start gap-2">
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-400 font-medium">Nächste USt-Voranmeldung</p>
                  <p className="text-xs text-white/50">Fällig am {taxByQuarter.find(q => q.status === "open")?.due || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Year Summary */}
          <div className="lg:col-span-2 p-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <ChartBarIcon className="w-5 h-5 text-blue-400" />
              Jahresübersicht {new Date().getFullYear()}
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                <p className="text-sm text-white/50 mb-1">Einnahmen YTD</p>
                <p className="text-xl font-bold text-green-400">{formatCurrency(stats.yearToDate.income)}</p>
              </div>
              <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                <p className="text-sm text-white/50 mb-1">Ausgaben YTD</p>
                <p className="text-xl font-bold text-red-400">{formatCurrency(stats.yearToDate.expenses)}</p>
              </div>
              <div className="p-4 bg-[#FC682C]/10 rounded-xl border border-[#FC682C]/20">
                <p className="text-sm text-white/50 mb-1">Gewinn YTD</p>
                <p className="text-xl font-bold text-[#FC682C]">{formatCurrency(stats.yearToDate.profit)}</p>
              </div>
            </div>
          </div>

          {/* Gewinn/Verlust Monatsvergleich */}
          <div className="lg:col-span-2 p-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <ChartBarIcon className="w-5 h-5 text-[#FC682C]" />
              Gewinn/Verlust pro Monat
            </h3>
            <div className="flex items-end gap-1.5 h-40">
              {stats.monthlyComparison.map((m) => {
                const profit = m.income - m.expense;
                const maxVal = Math.max(...stats.monthlyComparison.map((x) => Math.abs(x.income - x.expense)), 1);
                const height = Math.max(Math.abs(profit) / maxVal * 100, 4);
                const monthNames = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
                return (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1" title={`${monthNames[m.month]}: ${formatCurrency(profit)}`}>
                    <span className="text-[10px] text-white/30">{profit !== 0 ? formatCurrency(profit).replace("€", "").trim() : ""}</span>
                    <div
                      className={`w-full rounded-t-md transition-all ${profit >= 0 ? "bg-green-500/60" : "bg-red-500/60"}`}
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-[10px] text-white/30">{monthNames[m.month]}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Kategorien-Übersicht */}
          {Object.keys(stats.categoryBreakdown).length > 0 && (
            <div className="lg:col-span-2 p-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FunnelIcon className="w-5 h-5 text-purple-400" />
                Kategorien-Übersicht {new Date().getFullYear()}
              </h3>
              <div className="space-y-3">
                {Object.entries(stats.categoryBreakdown)
                  .sort((a, b) => (b[1].income + b[1].expense) - (a[1].income + a[1].expense))
                  .map(([cat, vals]) => {
                    const total = vals.income + vals.expense;
                    const maxCat = Math.max(...Object.values(stats.categoryBreakdown).map(v => v.income + v.expense), 1);
                    return (
                      <div key={cat}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-white/70">{cat}</span>
                          <div className="flex items-center gap-3 text-xs">
                            {vals.income > 0 && <span className="text-green-400">+{formatCurrency(vals.income)}</span>}
                            {vals.expense > 0 && <span className="text-red-400">-{formatCurrency(vals.expense)}</span>}
                          </div>
                        </div>
                        <div className="flex gap-1 h-2.5">
                          {vals.income > 0 && (
                            <div
                              className="rounded-full bg-green-500/50"
                              style={{ width: `${(vals.income / maxCat) * 100}%` }}
                            />
                          )}
                          {vals.expense > 0 && (
                            <div
                              className="rounded-full bg-red-500/50"
                              style={{ width: `${(vals.expense / maxCat) * 100}%` }}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      )}

      {activeView === "transactions" && (
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-5 py-4 text-left text-xs font-medium text-white/40 uppercase">Datum</th>
                <th className="px-5 py-4 text-left text-xs font-medium text-white/40 uppercase">Beschreibung</th>
                <th className="px-5 py-4 text-left text-xs font-medium text-white/40 uppercase">Kategorie</th>
                <th className="px-5 py-4 text-right text-xs font-medium text-white/40 uppercase">Netto</th>
                <th className="px-5 py-4 text-right text-xs font-medium text-white/40 uppercase">USt</th>
                <th className="px-5 py-4 text-right text-xs font-medium text-white/40 uppercase">Brutto</th>
                <th className="px-5 py-4 text-center text-xs font-medium text-white/40 uppercase">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <CalculatorIcon className="w-10 h-10 text-white/10 mx-auto mb-2" />
                    <p className="text-white/40">Keine Buchungen für diesen Zeitraum</p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t) => (
                  <tr key={t.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 text-sm text-white/70">{formatDate(t.date)}</td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-white">{t.description}</p>
                      {t.reference && <p className="text-xs text-white/40">{t.reference}</p>}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs ${
                        t.type === "income" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                      }`}>
                        {t.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-right text-white/70">{formatCurrency(t.net_amount)}</td>
                    <td className="px-5 py-4 text-sm text-right text-white/50">{formatCurrency(t.tax_amount)}</td>
                    <td className={`px-5 py-4 text-sm text-right font-medium ${
                      t.type === "income" ? "text-green-400" : "text-red-400"
                    }`}>
                      {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1 justify-center">
                        <button 
                          onClick={() => openDetailModal(t)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors" 
                          title="Details"
                        >
                          <EyeIcon className="w-4 h-4 text-white/50" />
                        </button>
                        <button 
                          onClick={() => openEditModal(t)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors" 
                          title="Bearbeiten"
                        >
                          <PencilIcon className="w-4 h-4 text-white/50" />
                        </button>
                        <button 
                          onClick={() => confirmDelete(t)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors" 
                          title="Löschen"
                        >
                          <TrashIcon className="w-4 h-4 text-red-400/50 hover:text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeView === "taxes" && (
        <div className="space-y-6">
          <div className="p-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">USt-Voranmeldungen {new Date().getFullYear()}</h3>
            <div className="space-y-3">
              {taxByQuarter.map((q, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl hover:bg-white/[0.03] transition-colors">
                  <div>
                    <p className="text-white font-medium">{q.name}</p>
                    <p className="text-xs text-white/40">Fällig: {q.due}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-white/40">Eingenommen</p>
                      <p className="text-sm text-white">{formatCurrency(q.collectedTax)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-white/40">Vorsteuer</p>
                      <p className="text-sm text-white">{formatCurrency(q.paidTax)}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-xs min-w-[80px] text-center ${
                      q.status === "open" ? "bg-yellow-500/20 text-yellow-400" :
                      q.status === "paid" ? "bg-green-500/20 text-green-400" :
                      "bg-white/10 text-white/40"
                    }`}>
                      {q.status === "open" ? "Offen" : q.status === "paid" ? "Bezahlt" : "Kommend"}
                    </span>
                    <span className="text-white font-medium min-w-[100px] text-right">
                      {formatCurrency(q.liability)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">USt-Sätze Übersicht</h3>
            <div className="grid grid-cols-3 gap-4">
              {TAX_RATES.map(rate => {
                const rateTransactions = transactions.filter(t => t.tax_rate === rate);
                const total = rateTransactions.reduce((sum, t) => sum + t.tax_amount, 0);
                return (
                  <div key={rate} className="p-4 bg-white/[0.02] rounded-xl">
                    <p className="text-2xl font-bold text-white mb-1">{rate}%</p>
                    <p className="text-sm text-white/50">{formatCurrency(total)} USt</p>
                    <p className="text-xs text-white/30">{rateTransactions.length} Buchungen</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeView === "reports" && (
        <div className="space-y-6">
          {/* Export Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "PDF Monatsübersicht", desc: `${["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"][filter.month]} ${filter.year}`, icon: DocumentArrowDownIcon, action: exportToPDF },
              { title: "CSV Export", desc: "Alle Buchungen als CSV", icon: ArrowDownTrayIcon, action: exportToCSV },
              { title: "Fällige Rechnungen", desc: "Aus Abo-Verträgen generieren", icon: RecurringIcon, action: generateRecurringInvoices },
            ].map((report, i) => (
              <button
                key={i}
                onClick={report.action}
                className="p-5 bg-white/[0.02] border border-white/[0.06] rounded-2xl text-left hover:bg-white/[0.04] hover:border-white/[0.1] transition-colors group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-[#FC682C]/20 rounded-xl group-hover:bg-[#FC682C]/30 transition-colors">
                    <report.icon className="w-5 h-5 text-[#FC682C]" />
                  </div>
                  <PrinterIcon className="w-4 h-4 text-white/20 group-hover:text-white/40 transition-colors ml-auto" />
                </div>
                <h4 className="text-white font-medium mb-1">{report.title}</h4>
                <p className="text-sm text-white/40">{report.desc}</p>
              </button>
            ))}
          </div>

          {/* USt-Voranmeldung Vorbereitung */}
          <div className="p-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <ReceiptPercentIcon className="w-5 h-5 text-purple-400" />
              USt-Voranmeldung — Zusammenfassung für Finanzamt
            </h3>
            <div className="space-y-3">
              {taxByQuarter.map((q, i) => {
                const netIncome = transactions
                  .filter(t => {
                    const d = new Date(t.date);
                    return d.getFullYear() === new Date().getFullYear() && q.months.includes(d.getMonth()) && t.type === "income";
                  })
                  .reduce((s, t) => s + t.net_amount, 0);
                const netExpense = transactions
                  .filter(t => {
                    const d = new Date(t.date);
                    return d.getFullYear() === new Date().getFullYear() && q.months.includes(d.getMonth()) && t.type === "expense";
                  })
                  .reduce((s, t) => s + t.net_amount, 0);
                return (
                  <div key={i} className="p-4 bg-white/[0.02] rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white font-medium">{q.name}</span>
                      <span className={`px-2.5 py-1 rounded-lg text-xs ${
                        q.status === "open" ? "bg-yellow-500/20 text-yellow-400" :
                        q.status === "paid" ? "bg-green-500/20 text-green-400" :
                        "bg-white/10 text-white/40"
                      }`}>
                        {q.status === "open" ? "Offen" : q.status === "paid" ? "Erledigt" : "Kommend"}
                      </span>
                    </div>
                    <div className="grid grid-cols-5 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-white/30">Umsatz (netto)</p>
                        <p className="text-white">{formatCurrency(netIncome)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/30">USt eingenommen</p>
                        <p className="text-green-400">{formatCurrency(q.collectedTax)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/30">Ausgaben (netto)</p>
                        <p className="text-white">{formatCurrency(netExpense)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/30">Vorsteuer</p>
                        <p className="text-red-400">{formatCurrency(q.paidTax)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/30 font-medium">Zahllast</p>
                        <p className="text-purple-400 font-bold">{formatCurrency(q.liability)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-purple-400 font-medium">Gesamte USt-Zahllast {new Date().getFullYear()}</span>
                  <span className="text-purple-400 font-bold text-lg">
                    {formatCurrency(taxByQuarter.reduce((s, q) => s + q.liability, 0))}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Jahresabschluss */}
          <div className="p-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BuildingLibraryIcon className="w-5 h-5 text-blue-400" />
              Jahresabschluss-Übersicht {new Date().getFullYear()}
            </h3>
            <div className="grid grid-cols-2 gap-6">
              {/* EÜR Zusammenfassung */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-white/60">Einnahmen-Überschuss-Rechnung</h4>
                <div className="space-y-2">
                  <div className="flex justify-between p-3 bg-white/[0.02] rounded-lg">
                    <span className="text-white/60">Betriebseinnahmen</span>
                    <span className="text-green-400 font-medium">{formatCurrency(stats.yearToDate.income)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-white/[0.02] rounded-lg">
                    <span className="text-white/60">Betriebsausgaben</span>
                    <span className="text-red-400 font-medium">{formatCurrency(stats.yearToDate.expenses)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-[#FC682C]/10 rounded-lg border border-[#FC682C]/20">
                    <span className="text-[#FC682C] font-medium">Gewinn vor Steuern</span>
                    <span className="text-[#FC682C] font-bold">{formatCurrency(stats.yearToDate.profit)}</span>
                  </div>
                </div>
              </div>

              {/* Top Kategorien */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-white/60">Top Einnahme-Kategorien</h4>
                <div className="space-y-2">
                  {Object.entries(stats.categoryBreakdown)
                    .filter(([, v]) => v.income > 0)
                    .sort((a, b) => b[1].income - a[1].income)
                    .slice(0, 5)
                    .map(([cat, vals]) => (
                      <div key={cat} className="flex justify-between p-3 bg-white/[0.02] rounded-lg">
                        <span className="text-white/60">{cat}</span>
                        <span className="text-white font-medium">{formatCurrency(vals.income)}</span>
                      </div>
                    ))}
                  {Object.entries(stats.categoryBreakdown).filter(([, v]) => v.income > 0).length === 0 && (
                    <p className="text-white/30 text-sm p-3">Keine Einnahmen</p>
                  )}
                </div>
              </div>
            </div>

            {/* Monatliche Übersicht Tabelle */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-white/60 mb-3">Monatliche Übersicht</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="py-2 text-left text-xs text-white/40">Monat</th>
                      <th className="py-2 text-right text-xs text-white/40">Einnahmen</th>
                      <th className="py-2 text-right text-xs text-white/40">Ausgaben</th>
                      <th className="py-2 text-right text-xs text-white/40">Gewinn</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.monthlyComparison.map((m) => {
                      const p = m.income - m.expense;
                      const monthNames = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
                      if (m.income === 0 && m.expense === 0) return null;
                      return (
                        <tr key={m.month} className="border-b border-white/[0.03]">
                          <td className="py-2 text-white/70">{monthNames[m.month]}</td>
                          <td className="py-2 text-right text-green-400">{formatCurrency(m.income)}</td>
                          <td className="py-2 text-right text-red-400">{formatCurrency(m.expense)}</td>
                          <td className={`py-2 text-right font-medium ${p >= 0 ? "text-[#FC682C]" : "text-red-400"}`}>{formatCurrency(p)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-white/[0.08]">
                      <td className="py-2 text-white font-medium">Gesamt</td>
                      <td className="py-2 text-right text-green-400 font-medium">{formatCurrency(stats.yearToDate.income)}</td>
                      <td className="py-2 text-right text-red-400 font-medium">{formatCurrency(stats.yearToDate.expenses)}</td>
                      <td className={`py-2 text-right font-bold ${stats.yearToDate.profit >= 0 ? "text-[#FC682C]" : "text-red-400"}`}>{formatCurrency(stats.yearToDate.profit)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New/Edit Transaction Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1a1a1f] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
              <h3 className="text-lg font-semibold text-white">
                {editMode ? "Buchung bearbeiten" : "Neue Buchung"}
              </h3>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="p-2 hover:bg-white/10 rounded-lg">
                <XMarkIcon className="w-5 h-5 text-white/50" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Type Toggle */}
              <div className="flex gap-2 p-1 bg-white/[0.04] rounded-xl">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "income", category: "" })}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    formData.type === "income" ? "bg-green-500/20 text-green-400" : "text-white/50"
                  }`}
                >
                  Einnahme
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "expense", category: "" })}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    formData.type === "expense" ? "bg-red-500/20 text-red-400" : "text-white/50"
                  }`}
                >
                  Ausgabe
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/50 mb-2">Datum *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm outline-none focus:border-[#FC682C]/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/50 mb-2">Betrag (Brutto) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm outline-none focus:border-[#FC682C]/50"
                    placeholder="0,00 €"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/50 mb-2">Beschreibung *</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm outline-none focus:border-[#FC682C]/50"
                  placeholder="z.B. Website Launch - Kundenname"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/50 mb-2">Kategorie *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm outline-none focus:border-[#FC682C]/50 cursor-pointer"
                    required
                  >
                    <option value="" className="bg-[#1a1a1f]">Auswählen...</option>
                    {CATEGORIES[formData.type].map((cat) => (
                      <option key={cat} value={cat} className="bg-[#1a1a1f]">{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-white/50 mb-2">USt-Satz</label>
                  <select
                    value={formData.tax_rate}
                    onChange={(e) => setFormData({ ...formData, tax_rate: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm outline-none focus:border-[#FC682C]/50 cursor-pointer"
                  >
                    {TAX_RATES.map((rate) => (
                      <option key={rate} value={rate} className="bg-[#1a1a1f]">{rate}%</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/50 mb-2">Referenz / Rechnungsnummer</label>
                <input
                  type="text"
                  value={formData.reference}
                  onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                  className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm outline-none focus:border-[#FC682C]/50"
                  placeholder="z.B. INV-2026-001"
                />
              </div>

              <div>
                <label className="block text-sm text-white/50 mb-2">Notizen</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm outline-none focus:border-[#FC682C]/50 resize-none"
                  rows={2}
                  placeholder="Zusätzliche Informationen..."
                />
              </div>

              {/* Preview */}
              {formData.amount && (
                <div className="p-4 bg-white/[0.02] rounded-xl border border-white/[0.06]">
                  <p className="text-xs text-white/40 mb-2">Vorschau</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Netto:</span>
                    <span className="text-white">{formatCurrency((parseFloat(formData.amount) || 0) - ((parseFloat(formData.amount) || 0) * formData.tax_rate) / (100 + formData.tax_rate))}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">USt ({formData.tax_rate}%):</span>
                    <span className="text-white">{formatCurrency(((parseFloat(formData.amount) || 0) * formData.tax_rate) / (100 + formData.tax_rate))}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium mt-2 pt-2 border-t border-white/[0.06]">
                    <span className="text-white">Brutto:</span>
                    <span className={formData.type === "income" ? "text-green-400" : "text-red-400"}>
                      {formData.type === "income" ? "+" : "-"}{formatCurrency(parseFloat(formData.amount) || 0)}
                    </span>
                  </div>
                </div>
              )}

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white/70 text-sm font-medium transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-[#FC682C] to-[#FF8F5C] rounded-xl text-white text-sm font-medium"
                >
                  {editMode ? "Änderungen speichern" : "Buchung speichern"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1a1a1f] border border-white/10 rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
              <h3 className="text-lg font-semibold text-white">Buchungsdetails</h3>
              <button onClick={() => { setShowDetailModal(false); setSelectedTransaction(null); }} className="p-2 hover:bg-white/10 rounded-lg">
                <XMarkIcon className="w-5 h-5 text-white/50" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className={`p-4 rounded-xl ${selectedTransaction.type === "income" ? "bg-green-500/10 border border-green-500/20" : "bg-red-500/10 border border-red-500/20"}`}>
                <p className="text-sm text-white/50">{selectedTransaction.type === "income" ? "Einnahme" : "Ausgabe"}</p>
                <p className={`text-3xl font-bold ${selectedTransaction.type === "income" ? "text-green-400" : "text-red-400"}`}>
                  {selectedTransaction.type === "income" ? "+" : "-"}{formatCurrency(selectedTransaction.amount)}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/50">Beschreibung</span>
                  <span className="text-white text-right max-w-[60%]">{selectedTransaction.description}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Kategorie</span>
                  <span className="text-white">{selectedTransaction.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Datum</span>
                  <span className="text-white">{formatDate(selectedTransaction.date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Netto</span>
                  <span className="text-white">{formatCurrency(selectedTransaction.net_amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">USt ({selectedTransaction.tax_rate}%)</span>
                  <span className="text-white">{formatCurrency(selectedTransaction.tax_amount)}</span>
                </div>
                {selectedTransaction.reference && (
                  <div className="flex justify-between">
                    <span className="text-white/50">Referenz</span>
                    <span className="text-white">{selectedTransaction.reference}</span>
                  </div>
                )}
                {selectedTransaction.notes && (
                  <div>
                    <span className="text-white/50 block mb-1">Notizen</span>
                    <p className="text-white text-sm bg-white/[0.02] p-2 rounded-lg">{selectedTransaction.notes}</p>
                  </div>
                )}
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => { setShowDetailModal(false); openEditModal(selectedTransaction); }}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white/70 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <PencilIcon className="w-4 h-4" />
                  Bearbeiten
                </button>
                <button
                  onClick={() => confirmDelete(selectedTransaction)}
                  className="flex-1 py-3 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-red-400 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <TrashIcon className="w-4 h-4" />
                  Löschen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedTransaction && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1a1a1f] border border-white/10 rounded-2xl w-full max-w-sm p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrashIcon className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Buchung löschen?</h3>
              <p className="text-sm text-white/50 mb-6">
                &quot;{selectedTransaction.description}&quot; wird unwiderruflich gelöscht.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowDeleteConfirm(false); setSelectedTransaction(null); }}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white/70 text-sm font-medium transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  onClick={deleteTransaction}
                  className="flex-1 py-3 bg-red-500 hover:bg-red-600 rounded-xl text-white text-sm font-medium transition-colors"
                >
                  Löschen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
