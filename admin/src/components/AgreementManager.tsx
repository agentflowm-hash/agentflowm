'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DocumentTextIcon,
  PlusIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  PencilIcon,
  TrashIcon,
  DocumentArrowDownIcon,
  EyeIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentCheckIcon,
} from '@heroicons/react/24/outline';

interface Agreement {
  id: number;
  agreement_number: string;
  client_id: number | null;
  client_name: string;
  client_company: string | null;
  client_address: string | null;
  client_email: string | null;
  project_title: string;
  project_description: string | null;
  services: string[];
  amount: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
  payment_terms: string | null;
  project_duration: string | null;
  start_date: string | null;
  portal_code: string | null;
  status: 'draft' | 'sent' | 'signed' | 'cancelled';
  issue_date: string;
  sent_at: string | null;
  signed_at: string | null;
  notes: string | null;
  pdf_url: string | null;
  created_at: string;
}

interface Stats {
  total: number;
  draft: number;
  sent: number;
  signed: number;
  totalValue: number;
  signedValue: number;
}

interface NewAgreement {
  client_name: string;
  client_company: string;
  client_address: string;
  client_email: string;
  project_title: string;
  project_description: string;
  services: string[];
  amount: number;
  tax_rate: number;
  payment_terms: string;
  project_duration: string;
  portal_code: string;
  notes: string;
}

const statusConfig = {
  draft: { label: 'Entwurf', color: 'bg-gray-500/20 text-gray-400', icon: ClockIcon },
  sent: { label: 'Gesendet', color: 'bg-blue-500/20 text-blue-400', icon: PaperAirplaneIcon },
  signed: { label: 'Unterschrieben', color: 'bg-green-500/20 text-green-400', icon: CheckCircleIcon },
  cancelled: { label: 'Storniert', color: 'bg-red-500/20 text-red-400', icon: XMarkIcon },
};

export function AgreementManager() {
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [saving, setSaving] = useState(false);
  const [newService, setNewService] = useState('');
  
  const [newAgreement, setNewAgreement] = useState<NewAgreement>({
    client_name: '',
    client_company: '',
    client_address: '',
    client_email: '',
    project_title: '',
    project_description: '',
    services: [],
    amount: 0,
    tax_rate: 19,
    payment_terms: '100% bei Vertragsstart',
    project_duration: '2 Wochen',
    portal_code: '',
    notes: '',
  });

  useEffect(() => {
    fetchAgreements();
  }, []);

  const fetchAgreements = async () => {
    try {
      const res = await fetch('/api/agreements');
      const json = await res.json();
      if (json.success) {
        setAgreements(json.data.agreements);
        setStats(json.data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch agreements:', error);
    } finally {
      setLoading(false);
    }
  };

  const createAgreement = async () => {
    if (!newAgreement.client_name || !newAgreement.project_title || newAgreement.amount <= 0) return;
    
    setSaving(true);
    try {
      const res = await fetch('/api/agreements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAgreement),
      });
      const json = await res.json();
      if (json.success) {
        setAgreements([json.data.agreement, ...agreements]);
        setShowModal(false);
        resetForm();
        fetchAgreements(); // Refresh stats
      }
    } catch (error) {
      console.error('Failed to create agreement:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/agreements/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (json.success) {
        setAgreements(agreements.map(a => a.id === id ? json.data.agreement : a));
        fetchAgreements(); // Refresh stats
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const deleteAgreement = async (id: number) => {
    if (!confirm('Vereinbarung wirklich löschen?')) return;
    
    try {
      const res = await fetch(`/api/agreements/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setAgreements(agreements.filter(a => a.id !== id));
        fetchAgreements(); // Refresh stats
      }
    } catch (error) {
      console.error('Failed to delete agreement:', error);
    }
  };

  const resetForm = () => {
    setNewAgreement({
      client_name: '',
      client_company: '',
      client_address: '',
      client_email: '',
      project_title: '',
      project_description: '',
      services: [],
      amount: 0,
      tax_rate: 19,
      payment_terms: '100% bei Vertragsstart',
      project_duration: '2 Wochen',
      portal_code: '',
      notes: '',
    });
  };

  const addService = () => {
    if (newService.trim()) {
      setNewAgreement({
        ...newAgreement,
        services: [...newAgreement.services, newService.trim()]
      });
      setNewService('');
    }
  };

  const removeService = (index: number) => {
    setNewAgreement({
      ...newAgreement,
      services: newAgreement.services.filter((_, i) => i !== index)
    });
  };

  const filteredAgreements = agreements.filter((a) => {
    const searchLower = search.toLowerCase();
    const matchesSearch = 
      (a.client_name || '').toLowerCase().includes(searchLower) ||
      (a.agreement_number || '').toLowerCase().includes(searchLower) ||
      (a.project_title || '').toLowerCase().includes(searchLower);
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const calculatePreview = () => {
    const tax = Math.round(newAgreement.amount * newAgreement.tax_rate) / 100;
    return {
      netto: newAgreement.amount,
      tax,
      brutto: newAgreement.amount + tax
    };
  };

  const preview = calculatePreview();

  if (loading) {
    return <p className="text-zinc-400">Lade Vereinbarungen...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
            <DocumentTextIcon className="w-5 h-5 text-orange-500 mb-2" />
            <p className="text-sm text-zinc-400">Gesamt</p>
            <p className="text-xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
            <ClockIcon className="w-5 h-5 text-yellow-500 mb-2" />
            <p className="text-sm text-zinc-400">Entwürfe</p>
            <p className="text-xl font-bold">{stats.draft}</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
            <PaperAirplaneIcon className="w-5 h-5 text-blue-500 mb-2" />
            <p className="text-sm text-zinc-400">Gesendet</p>
            <p className="text-xl font-bold">{stats.sent}</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
            <CheckCircleIcon className="w-5 h-5 text-green-500 mb-2" />
            <p className="text-sm text-zinc-400">Unterschrieben</p>
            <p className="text-xl font-bold text-green-400">€{stats.signedValue.toLocaleString('de-DE')}</p>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <DocumentTextIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Suchen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm w-full focus:outline-none focus:border-orange-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm focus:outline-none focus:border-orange-500"
          >
            <option value="all">Alle</option>
            <option value="draft">Entwürfe</option>
            <option value="sent">Gesendet</option>
            <option value="signed">Unterschrieben</option>
          </select>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-sm font-medium transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Neue Vereinbarung
        </button>
      </div>

      {/* Table */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-zinc-800/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Nummer</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Kunde</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Projekt</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Betrag</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {filteredAgreements.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                  Keine Vereinbarungen gefunden
                </td>
              </tr>
            ) : (
              filteredAgreements.map((agreement) => {
                const status = statusConfig[agreement.status];
                const StatusIcon = status.icon;
                return (
                  <tr key={agreement.id} className="hover:bg-zinc-800/30">
                    <td className="px-4 py-3 text-sm font-mono">{agreement.agreement_number}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium">{agreement.client_name}</p>
                        <p className="text-xs text-zinc-500">{agreement.client_company}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-zinc-300">{agreement.project_title}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${status.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">€{parseFloat(String(agreement.total_amount)).toLocaleString('de-DE')}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {agreement.status === 'draft' && (
                          <>
                            <button
                              onClick={() => updateStatus(agreement.id, 'sent')}
                              title="Als gesendet markieren"
                              className="p-1.5 hover:bg-zinc-700 rounded-lg transition-colors"
                            >
                              <PaperAirplaneIcon className="w-4 h-4 text-blue-400" />
                            </button>
                            <button
                              onClick={() => deleteAgreement(agreement.id)}
                              title="Löschen"
                              className="p-1.5 hover:bg-zinc-700 rounded-lg transition-colors"
                            >
                              <TrashIcon className="w-4 h-4 text-red-400" />
                            </button>
                          </>
                        )}
                        {agreement.status === 'sent' && (
                          <button
                            onClick={() => updateStatus(agreement.id, 'signed')}
                            title="Als unterschrieben markieren"
                            className="p-1.5 hover:bg-zinc-700 rounded-lg transition-colors"
                          >
                            <DocumentCheckIcon className="w-4 h-4 text-green-400" />
                          </button>
                        )}
                        <a
                          href={`/api/agreements/${agreement.id}/pdf`}
                          target="_blank"
                          title="PDF Vorschau"
                          className="p-1.5 hover:bg-zinc-700 rounded-lg transition-colors"
                        >
                          <EyeIcon className="w-4 h-4 text-zinc-400" />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Neue Vereinbarung</h2>
                <button onClick={() => setShowModal(false)} className="p-1 hover:bg-zinc-800 rounded-lg">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Client Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">Kundenname *</label>
                    <input
                      type="text"
                      value={newAgreement.client_name}
                      onChange={(e) => setNewAgreement({ ...newAgreement, client_name: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">Firma</label>
                    <input
                      type="text"
                      value={newAgreement.client_company}
                      onChange={(e) => setNewAgreement({ ...newAgreement, client_company: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">E-Mail</label>
                    <input
                      type="email"
                      value={newAgreement.client_email}
                      onChange={(e) => setNewAgreement({ ...newAgreement, client_email: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">Adresse</label>
                    <input
                      type="text"
                      value={newAgreement.client_address}
                      onChange={(e) => setNewAgreement({ ...newAgreement, client_address: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Project Info */}
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Projekttitel *</label>
                  <input
                    type="text"
                    value={newAgreement.project_title}
                    onChange={(e) => setNewAgreement({ ...newAgreement, project_title: e.target.value })}
                    placeholder="z.B. Automatisierte Werkstatt-Akquise für UnfallProfis"
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Projektbeschreibung</label>
                  <textarea
                    value={newAgreement.project_description}
                    onChange={(e) => setNewAgreement({ ...newAgreement, project_description: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Services */}
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Leistungen</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newService}
                      onChange={(e) => setNewService(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
                      placeholder="Leistung hinzufügen..."
                      className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                    />
                    <button
                      onClick={addService}
                      className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-1">
                    {newAgreement.services.map((service, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-2 bg-zinc-800 rounded-lg text-sm">
                        <span className="flex-1">{service}</span>
                        <button onClick={() => removeService(i)} className="text-zinc-500 hover:text-red-400">
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financials */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">Betrag (netto) *</label>
                    <input
                      type="number"
                      value={newAgreement.amount}
                      onChange={(e) => setNewAgreement({ ...newAgreement, amount: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">MwSt. %</label>
                    <input
                      type="number"
                      value={newAgreement.tax_rate}
                      onChange={(e) => setNewAgreement({ ...newAgreement, tax_rate: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-orange-400">€{preview.netto.toLocaleString('de-DE')} netto</p>
                  <p className="text-sm text-zinc-400">+ €{preview.tax.toLocaleString('de-DE')} MwSt. = €{preview.brutto.toLocaleString('de-DE')} brutto</p>
                </div>

                {/* Terms */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">Zahlungsbedingungen</label>
                    <input
                      type="text"
                      value={newAgreement.payment_terms}
                      onChange={(e) => setNewAgreement({ ...newAgreement, payment_terms: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">Projektdauer</label>
                    <input
                      type="text"
                      value={newAgreement.project_duration}
                      onChange={(e) => setNewAgreement({ ...newAgreement, project_duration: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Portal Code */}
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Portal-Code (wird automatisch generiert wenn leer)</label>
                  <input
                    type="text"
                    value={newAgreement.portal_code}
                    onChange={(e) => setNewAgreement({ ...newAgreement, portal_code: e.target.value })}
                    placeholder="z.B. OSAM-2898"
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Notizen</label>
                  <textarea
                    value={newAgreement.notes}
                    onChange={(e) => setNewAgreement({ ...newAgreement, notes: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="sticky bottom-0 bg-zinc-900 border-t border-zinc-800 px-6 py-4 flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm"
                >
                  Abbrechen
                </button>
                <button
                  onClick={createAgreement}
                  disabled={saving || !newAgreement.client_name || !newAgreement.project_title || newAgreement.amount <= 0}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium"
                >
                  {saving ? 'Speichern...' : 'Erstellen'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
