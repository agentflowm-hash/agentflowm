"use client";

import { useState, useEffect, useCallback } from "react";
import {
  CalculatorIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  PlusIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  CurrencyEuroIcon,
  ReceiptPercentIcon,
  BuildingLibraryIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
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
  invoice_id?: number;
  created_at: string;
}

interface AccountingStats {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  pendingTax: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  yearToDate: {
    income: number;
    expenses: number;
    profit: number;
  };
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

export default function AccountingTab() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<AccountingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeView, setActiveView] = useState<"overview" | "transactions" | "taxes" | "reports">("overview");
  const [filter, setFilter] = useState({ type: "all", month: new Date().getMonth(), year: new Date().getFullYear() });
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    category: "",
    type: "income" as "income" | "expense",
    amount: 0,
    tax_rate: 19,
    account: "Geschäftskonto",
    reference: "",
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // In real implementation, this would fetch from API
      // For now, using mock data
      const mockTransactions: Transaction[] = [
        {
          id: 1,
          date: "2026-02-28",
          description: "Website Launch - SonnenscheinPraxis",
          category: "Website-Projekte",
          type: "income",
          amount: 5390,
          tax_rate: 19,
          tax_amount: 860.18,
          net_amount: 4529.82,
          account: "Geschäftskonto",
          reference: "INV-2026-001",
          created_at: "2026-02-28T10:00:00Z",
        },
        {
          id: 2,
          date: "2026-02-25",
          description: "Vercel Pro Subscription",
          category: "Hosting & Server",
          type: "expense",
          amount: 20,
          tax_rate: 0,
          tax_amount: 0,
          net_amount: 20,
          account: "Geschäftskonto",
          created_at: "2026-02-25T10:00:00Z",
        },
        {
          id: 3,
          date: "2026-02-20",
          description: "Figma Subscription",
          category: "Software & Tools",
          type: "expense",
          amount: 15,
          tax_rate: 0,
          tax_amount: 0,
          net_amount: 15,
          account: "Geschäftskonto",
          created_at: "2026-02-20T10:00:00Z",
        },
      ];

      setTransactions(mockTransactions);

      // Calculate stats
      const income = mockTransactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
      const expenses = mockTransactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
      const taxAmount = mockTransactions.reduce((sum, t) => sum + t.tax_amount, 0);

      setStats({
        totalIncome: income,
        totalExpenses: expenses,
        netProfit: income - expenses,
        pendingTax: taxAmount,
        monthlyIncome: income,
        monthlyExpenses: expenses,
        yearToDate: {
          income: income,
          expenses: expenses,
          profit: income - expenses,
        },
      });
    } catch (error) {
      console.error("Failed to fetch accounting data:", error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const taxAmount = (formData.amount * formData.tax_rate) / (100 + formData.tax_rate);
    const netAmount = formData.amount - taxAmount;

    const newTransaction: Transaction = {
      id: Date.now(),
      ...formData,
      tax_amount: taxAmount,
      net_amount: netAmount,
      created_at: new Date().toISOString(),
    };

    setTransactions([newTransaction, ...transactions]);
    setShowModal(false);
    resetForm();
    fetchData(); // Recalculate stats
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      description: "",
      category: "",
      type: "income",
      amount: 0,
      tax_rate: 19,
      account: "Geschäftskonto",
      reference: "",
    });
    setEditingTransaction(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  const filteredTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    const matchesType = filter.type === "all" || t.type === filter.type;
    const matchesMonth = date.getMonth() === filter.month;
    const matchesYear = date.getFullYear() === filter.year;
    return matchesType && matchesMonth && matchesYear;
  });

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
          <p className="text-2xl font-bold text-green-400">{formatCurrency(stats?.totalIncome || 0)}</p>
          <p className="text-xs text-white/30 mt-1">Dieser Monat</p>
        </div>

        <div className="p-5 bg-gradient-to-br from-red-500/10 to-red-500/5 rounded-2xl border border-red-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-red-500/20 rounded-xl">
              <ArrowTrendingDownIcon className="w-5 h-5 text-red-400" />
            </div>
            <span className="text-sm text-white/50">Ausgaben</span>
          </div>
          <p className="text-2xl font-bold text-red-400">{formatCurrency(stats?.totalExpenses || 0)}</p>
          <p className="text-xs text-white/30 mt-1">Dieser Monat</p>
        </div>

        <div className="p-5 bg-gradient-to-br from-[#FC682C]/10 to-[#FC682C]/5 rounded-2xl border border-[#FC682C]/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-[#FC682C]/20 rounded-xl">
              <BanknotesIcon className="w-5 h-5 text-[#FC682C]" />
            </div>
            <span className="text-sm text-white/50">Gewinn</span>
          </div>
          <p className="text-2xl font-bold text-[#FC682C]">{formatCurrency(stats?.netProfit || 0)}</p>
          <p className="text-xs text-white/30 mt-1">Netto nach Ausgaben</p>
        </div>

        <div className="p-5 bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-2xl border border-purple-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-500/20 rounded-xl">
              <ReceiptPercentIcon className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-sm text-white/50">USt-Rückstellung</span>
          </div>
          <p className="text-2xl font-bold text-purple-400">{formatCurrency(stats?.pendingTax || 0)}</p>
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
          <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-white/70 flex items-center gap-2">
            <ArrowDownTrayIcon className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-[#FC682C] to-[#FF8F5C] text-white rounded-xl text-sm font-medium flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Neue Buchung
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      {activeView === "transactions" && (
        <div className="flex gap-3 items-center">
          <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.04] rounded-xl">
            <FunnelIcon className="w-4 h-4 text-white/40" />
            <select
              value={filter.type}
              onChange={(e) => setFilter({ ...filter, type: e.target.value })}
              className="bg-transparent text-white text-sm outline-none"
            >
              <option value="all">Alle Buchungen</option>
              <option value="income">Nur Einnahmen</option>
              <option value="expense">Nur Ausgaben</option>
            </select>
          </div>
          <select
            value={filter.month}
            onChange={(e) => setFilter({ ...filter, month: parseInt(e.target.value) })}
            className="px-3 py-2 bg-white/[0.04] rounded-xl text-white text-sm outline-none"
          >
            {["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"].map((m, i) => (
              <option key={i} value={i}>{m}</option>
            ))}
          </select>
          <select
            value={filter.year}
            onChange={(e) => setFilter({ ...filter, year: parseInt(e.target.value) })}
            className="px-3 py-2 bg-white/[0.04] rounded-xl text-white text-sm outline-none"
          >
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
          </select>
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
                <div key={t.id} className="flex items-center justify-between p-3 bg-white/[0.02] rounded-xl">
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
            </div>
          </div>

          {/* Tax Overview */}
          <div className="p-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <ReceiptPercentIcon className="w-5 h-5 text-purple-400" />
              USt-Übersicht Q1/2026
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-white/[0.02] rounded-xl">
                <span className="text-white/60">Eingenommene USt</span>
                <span className="text-white font-medium">{formatCurrency(stats?.pendingTax || 0)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/[0.02] rounded-xl">
                <span className="text-white/60">Gezahlte Vorsteuer</span>
                <span className="text-white font-medium">{formatCurrency(0)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                <span className="text-purple-400 font-medium">USt-Zahllast</span>
                <span className="text-purple-400 font-bold">{formatCurrency(stats?.pendingTax || 0)}</span>
              </div>
              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-start gap-2">
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-400 font-medium">Nächste USt-Voranmeldung</p>
                  <p className="text-xs text-white/50">Fällig am 10.04.2026 für Q1</p>
                </div>
              </div>
            </div>
          </div>
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
                <th className="px-5 py-4 text-left text-xs font-medium text-white/40 uppercase">Konto</th>
                <th className="px-5 py-4 text-right text-xs font-medium text-white/40 uppercase">Netto</th>
                <th className="px-5 py-4 text-right text-xs font-medium text-white/40 uppercase">USt</th>
                <th className="px-5 py-4 text-right text-xs font-medium text-white/40 uppercase">Brutto</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <CalculatorIcon className="w-10 h-10 text-white/10 mx-auto mb-2" />
                    <p className="text-white/40">Keine Buchungen gefunden</p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t) => (
                  <tr key={t.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
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
                    <td className="px-5 py-4 text-sm text-white/50">{t.account}</td>
                    <td className="px-5 py-4 text-sm text-right text-white/70">{formatCurrency(t.net_amount)}</td>
                    <td className="px-5 py-4 text-sm text-right text-white/50">{formatCurrency(t.tax_amount)}</td>
                    <td className={`px-5 py-4 text-sm text-right font-medium ${
                      t.type === "income" ? "text-green-400" : "text-red-400"
                    }`}>
                      {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
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
            <h3 className="text-lg font-semibold text-white mb-4">USt-Voranmeldungen 2026</h3>
            <div className="space-y-3">
              {[
                { period: "Q1 (Jan-Mär)", due: "10.04.2026", status: "offen", amount: stats?.pendingTax || 0 },
                { period: "Q2 (Apr-Jun)", due: "10.07.2026", status: "kommend", amount: 0 },
                { period: "Q3 (Jul-Sep)", due: "10.10.2026", status: "kommend", amount: 0 },
                { period: "Q4 (Okt-Dez)", due: "10.01.2027", status: "kommend", amount: 0 },
              ].map((q, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl">
                  <div>
                    <p className="text-white font-medium">{q.period}</p>
                    <p className="text-xs text-white/40">Fällig: {q.due}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs ${
                      q.status === "offen" ? "bg-yellow-500/20 text-yellow-400" :
                      q.status === "bezahlt" ? "bg-green-500/20 text-green-400" :
                      "bg-white/10 text-white/40"
                    }`}>
                      {q.status}
                    </span>
                    <span className="text-white font-medium min-w-[100px] text-right">
                      {formatCurrency(q.amount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeView === "reports" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: "EÜR 2026", desc: "Einnahmen-Überschuss-Rechnung", icon: DocumentTextIcon },
            { title: "BWA Februar", desc: "Betriebswirtschaftliche Auswertung", icon: ChartBarIcon },
            { title: "Kontosalden", desc: "Übersicht aller Konten", icon: BuildingLibraryIcon },
            { title: "Offene Posten", desc: "Unbezahlte Rechnungen", icon: ClipboardDocumentListIcon },
            { title: "Abschreibungen", desc: "AfA-Übersicht", icon: CalculatorIcon },
            { title: "Jahresabschluss", desc: "Vorbereitung Steuerberater", icon: CheckCircleIcon },
          ].map((report, i) => (
            <button
              key={i}
              className="p-5 bg-white/[0.02] border border-white/[0.06] rounded-2xl text-left hover:bg-white/[0.04] hover:border-white/[0.1] transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-[#FC682C]/20 rounded-xl group-hover:bg-[#FC682C]/30 transition-colors">
                  <report.icon className="w-5 h-5 text-[#FC682C]" />
                </div>
              </div>
              <h4 className="text-white font-medium mb-1">{report.title}</h4>
              <p className="text-sm text-white/40">{report.desc}</p>
            </button>
          ))}
        </div>
      )}

      {/* New Transaction Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1a1a1f] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
              <h3 className="text-lg font-semibold text-white">Neue Buchung</h3>
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
                  <label className="block text-sm text-white/50 mb-2">Datum</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm outline-none focus:border-[#FC682C]/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/50 mb-2">Betrag (Brutto)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount || ""}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm outline-none focus:border-[#FC682C]/50"
                    placeholder="0,00 €"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/50 mb-2">Beschreibung</label>
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
                  <label className="block text-sm text-white/50 mb-2">Kategorie</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm outline-none focus:border-[#FC682C]/50"
                    required
                  >
                    <option value="">Auswählen...</option>
                    {CATEGORIES[formData.type].map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-white/50 mb-2">USt-Satz</label>
                  <select
                    value={formData.tax_rate}
                    onChange={(e) => setFormData({ ...formData, tax_rate: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm outline-none focus:border-[#FC682C]/50"
                  >
                    {TAX_RATES.map((rate) => (
                      <option key={rate} value={rate}>{rate}%</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/50 mb-2">Referenz (optional)</label>
                <input
                  type="text"
                  value={formData.reference}
                  onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                  className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm outline-none focus:border-[#FC682C]/50"
                  placeholder="z.B. Rechnungsnummer"
                />
              </div>

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
                  Buchung speichern
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
