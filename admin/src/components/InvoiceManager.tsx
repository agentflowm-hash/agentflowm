"use client";

import { useState, useEffect } from "react";
import {
  DocumentTextIcon,
  PlusIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  XMarkIcon,
  CurrencyEuroIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";

// Helper to handle both wrapped {success, data} and direct API responses
function unwrapApiResponse<T>(response: unknown): T {
  if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
    return (response as { data: T }).data;
  }
  return response as T;
}

interface Invoice {
  id: number;
  invoice_number: string;
  client_name: string;
  client_email: string;
  client_company?: string;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  issue_date: string;
  due_date: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  discount_percent: number;
  discount_amount: number;
  total: number;
  notes?: string;
  invoice_items: InvoiceItem[];
  created_at: string;
}

interface InvoiceItem {
  id?: number;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

interface InvoiceStats {
  total: number;
  draft: number;
  sent: number;
  paid: number;
  overdue: number;
  totalRevenue: number;
  pendingAmount: number;
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  draft: { label: "Entwurf", color: "bg-gray-500", icon: DocumentTextIcon },
  sent: { label: "Gesendet", color: "bg-blue-500", icon: PaperAirplaneIcon },
  paid: { label: "Bezahlt", color: "bg-green-500", icon: CheckCircleIcon },
  overdue: { label: "Überfällig", color: "bg-red-500", icon: ExclamationCircleIcon },
  cancelled: { label: "Storniert", color: "bg-gray-400", icon: XMarkIcon },
};

export default function InvoiceManager() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState<InvoiceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    client_name: "",
    client_email: "",
    client_company: "",
    client_address: "",
    due_date: "",
    tax_rate: 19,
    discount_percent: 0,
    notes: "",
    items: [{ description: "", quantity: 1, unit_price: 0, total: 0 }] as InvoiceItem[],
  });

  useEffect(() => {
    fetchInvoices();
  }, [filter]);

  const fetchInvoices = async () => {
    try {
      const params = new URLSearchParams();
      if (filter !== "all") params.set("status", filter);
      
      const res = await fetch(`/api/invoices?${params}`);
      const data = await res.json();
      const unwrapped = unwrapApiResponse<{invoices: Invoice[], stats: typeof stats}>(data);
      setInvoices(unwrapped.invoices || []);
      setStats(unwrapped.stats);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const createInvoice = async () => {
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        setShowModal(false);
        resetForm();
        fetchInvoices();
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
    }
  };

  const updateInvoice = async () => {
    if (!editingInvoice) return;
    
    try {
      const res = await fetch(`/api/invoices/${editingInvoice.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        setShowModal(false);
        setEditingInvoice(null);
        resetForm();
        fetchInvoices();
      }
    } catch (error) {
      console.error("Error updating invoice:", error);
    }
  };

  const sendInvoice = async (id: number) => {
    try {
      const res = await fetch(`/api/invoices/${id}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      
      if (res.ok) {
        fetchInvoices();
      }
    } catch (error) {
      console.error("Error sending invoice:", error);
    }
  };

  const markAsPaid = async (id: number) => {
    try {
      const res = await fetch(`/api/invoices/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "paid" }),
      });
      
      if (res.ok) {
        fetchInvoices();
      }
    } catch (error) {
      console.error("Error updating invoice:", error);
    }
  };

  const deleteInvoice = async (id: number) => {
    if (!confirm("Rechnung wirklich löschen?")) return;
    
    try {
      const res = await fetch(`/api/invoices/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchInvoices();
      }
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      client_name: "",
      client_email: "",
      client_company: "",
      client_address: "",
      due_date: "",
      tax_rate: 19,
      discount_percent: 0,
      notes: "",
      items: [{ description: "", quantity: 1, unit_price: 0, total: 0 }],
    });
  };

  const openEditModal = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setFormData({
      client_name: invoice.client_name,
      client_email: invoice.client_email,
      client_company: invoice.client_company || "",
      client_address: "",
      due_date: invoice.due_date,
      tax_rate: invoice.tax_rate,
      discount_percent: invoice.discount_percent,
      notes: invoice.notes || "",
      items: invoice.invoice_items.length > 0 
        ? invoice.invoice_items 
        : [{ description: "", quantity: 1, unit_price: 0, total: 0 }],
    });
    setShowModal(true);
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: "", quantity: 1, unit_price: 0, total: 0 }],
    });
  };

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    newItems[index].total = newItems[index].quantity * newItems[index].unit_price;
    setFormData({ ...formData, items: newItems });
  };

  const calculateTotal = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    const discount = subtotal * (formData.discount_percent / 100);
    const taxable = subtotal - discount;
    const tax = taxable * (formData.tax_rate / 100);
    return { subtotal, discount, taxable, tax, total: taxable + tax };
  };

  const filteredInvoices = invoices.filter((inv) =>
    inv.client_name.toLowerCase().includes(search.toLowerCase()) ||
    inv.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
    inv.client_email.toLowerCase().includes(search.toLowerCase())
  );

  const totals = calculateTotal();

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-xl p-4 border border-green-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CurrencyEuroIcon className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Umsatz</p>
                <p className="text-xl font-bold text-green-400">€{stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl p-4 border border-blue-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <ClockIcon className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Ausstehend</p>
                <p className="text-xl font-bold text-blue-400">€{stats.pendingAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-xl p-4 border border-purple-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <DocumentTextIcon className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Gesamt</p>
                <p className="text-xl font-bold text-purple-400">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-red-500/20 to-red-600/10 rounded-xl p-4 border border-red-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <ExclamationCircleIcon className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Überfällig</p>
                <p className="text-xl font-bold text-red-400">{stats.overdue}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Suchen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-orange-500/50 focus:outline-none"
            />
          </div>
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-orange-500/50 focus:outline-none"
          >
            <option value="all">Alle</option>
            <option value="draft">Entwürfe</option>
            <option value="sent">Gesendet</option>
            <option value="paid">Bezahlt</option>
            <option value="overdue">Überfällig</option>
          </select>
        </div>
        
        <button
          onClick={() => { resetForm(); setEditingInvoice(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          <PlusIcon className="w-5 h-5" />
          Neue Rechnung
        </button>
      </div>

      {/* Invoice List */}
      <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="text-left p-4 font-medium text-gray-400">Nummer</th>
              <th className="text-left p-4 font-medium text-gray-400">Kunde</th>
              <th className="text-left p-4 font-medium text-gray-400">Status</th>
              <th className="text-left p-4 font-medium text-gray-400">Fällig</th>
              <th className="text-right p-4 font-medium text-gray-400">Betrag</th>
              <th className="text-right p-4 font-medium text-gray-400">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  Laden...
                </td>
              </tr>
            ) : filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  Keine Rechnungen gefunden
                </td>
              </tr>
            ) : (
              filteredInvoices.map((invoice) => {
                const status = statusConfig[invoice.status];
                const StatusIcon = status.icon;
                const isOverdue = new Date(invoice.due_date) < new Date() && invoice.status === "sent";
                
                return (
                  <tr key={invoice.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <span className="font-mono text-sm">{invoice.invoice_number}</span>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{invoice.client_name}</p>
                        <p className="text-sm text-gray-500">{invoice.client_company || invoice.client_email}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        isOverdue ? "bg-red-500/20 text-red-400" : `${status.color}/20 text-white`
                      }`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {isOverdue ? "Überfällig" : status.label}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-400">
                      {new Date(invoice.due_date).toLocaleDateString("de-DE")}
                    </td>
                    <td className="p-4 text-right font-medium">
                      €{invoice.total.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        {invoice.status === "draft" && (
                          <>
                            <button
                              onClick={() => sendInvoice(invoice.id)}
                              className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors"
                              title="Senden"
                            >
                              <PaperAirplaneIcon className="w-4 h-4 text-blue-400" />
                            </button>
                            <button
                              onClick={() => openEditModal(invoice)}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                              title="Bearbeiten"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteInvoice(invoice.id)}
                              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                              title="Löschen"
                            >
                              <TrashIcon className="w-4 h-4 text-red-400" />
                            </button>
                          </>
                        )}
                        {invoice.status === "sent" && (
                          <button
                            onClick={() => markAsPaid(invoice.id)}
                            className="p-2 hover:bg-green-500/20 rounded-lg transition-colors"
                            title="Als bezahlt markieren"
                          >
                            <CheckCircleIcon className="w-4 h-4 text-green-400" />
                          </button>
                        )}
                        <button
                          onClick={() => window.open(`/api/invoices/${invoice.id}/pdf`, '_blank')}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          title="PDF Vorschau"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = `/api/invoices/${invoice.id}/pdf?format=html`;
                            link.download = `Rechnung-${invoice.invoice_number}.html`;
                            link.click();
                          }}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          title="Download"
                        >
                          <ArrowDownTrayIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a2e] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-white/10">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editingInvoice ? "Rechnung bearbeiten" : "Neue Rechnung"}
              </h2>
              <button
                onClick={() => { setShowModal(false); setEditingInvoice(null); }}
                className="p-2 hover:bg-white/10 rounded-lg"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Client Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Kundenname *</label>
                  <input
                    type="text"
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-orange-500/50 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">E-Mail *</label>
                  <input
                    type="email"
                    value={formData.client_email}
                    onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-orange-500/50 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Firma</label>
                  <input
                    type="text"
                    value={formData.client_company}
                    onChange={(e) => setFormData({ ...formData, client_company: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-orange-500/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Fälligkeitsdatum *</label>
                  <input
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-orange-500/50 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Items */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-gray-400">Positionen</label>
                  <button
                    type="button"
                    onClick={addItem}
                    className="text-sm text-orange-400 hover:text-orange-300"
                  >
                    + Position hinzufügen
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.items.map((item, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <input
                        type="text"
                        placeholder="Beschreibung"
                        value={item.description}
                        onChange={(e) => updateItem(index, "description", e.target.value)}
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:border-orange-500/50 focus:outline-none"
                      />
                      <input
                        type="number"
                        placeholder="Menge"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, "quantity", parseFloat(e.target.value) || 0)}
                        className="w-20 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:border-orange-500/50 focus:outline-none"
                      />
                      <input
                        type="number"
                        placeholder="Preis"
                        value={item.unit_price}
                        onChange={(e) => updateItem(index, "unit_price", parseFloat(e.target.value) || 0)}
                        className="w-28 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:border-orange-500/50 focus:outline-none"
                      />
                      <span className="w-24 py-2 text-right text-sm">
                        €{(item.quantity * item.unit_price).toFixed(2)}
                      </span>
                      {formData.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="p-2 hover:bg-red-500/20 rounded-lg"
                        >
                          <TrashIcon className="w-4 h-4 text-red-400" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="bg-white/5 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Zwischensumme</span>
                  <span>€{totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Rabatt</span>
                    <input
                      type="number"
                      value={formData.discount_percent}
                      onChange={(e) => setFormData({ ...formData, discount_percent: parseFloat(e.target.value) || 0 })}
                      className="w-16 px-2 py-1 bg-white/5 border border-white/10 rounded text-sm focus:border-orange-500/50 focus:outline-none"
                    />
                    <span className="text-gray-500">%</span>
                  </div>
                  <span>-€{totals.discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">MwSt.</span>
                    <input
                      type="number"
                      value={formData.tax_rate}
                      onChange={(e) => setFormData({ ...formData, tax_rate: parseFloat(e.target.value) || 0 })}
                      className="w-16 px-2 py-1 bg-white/5 border border-white/10 rounded text-sm focus:border-orange-500/50 focus:outline-none"
                    />
                    <span className="text-gray-500">%</span>
                  </div>
                  <span>€{totals.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-white/10">
                  <span>Gesamt</span>
                  <span className="text-orange-400">€{totals.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">Notizen</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-orange-500/50 focus:outline-none resize-none h-20"
                  placeholder="Zusätzliche Hinweise für die Rechnung..."
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-white/10 flex justify-end gap-3">
              <button
                onClick={() => { setShowModal(false); setEditingInvoice(null); }}
                className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={editingInvoice ? updateInvoice : createInvoice}
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                {editingInvoice ? "Speichern" : "Erstellen"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
