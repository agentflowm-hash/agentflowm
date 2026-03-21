"use client";

import { useState, useEffect, useCallback } from "react";
import {
  UserGroupIcon, DocumentTextIcon, BanknotesIcon, PlusIcon,
  XMarkIcon, PencilIcon, TrashIcon, CheckCircleIcon, ClockIcon,
  CurrencyEuroIcon, CalendarIcon,
} from "@heroicons/react/24/outline";
import { useToast } from "@/components";

interface TeamMember { id: number; name: string; email: string; role: string; phone: string | null; status: string; }
interface Contract { id: number; team_member_id: number; contract_type: string; title: string; start_date: string; end_date: string | null; monthly_salary: number | null; hourly_rate: number | null; weekly_hours: number | null; tax_class: string | null; notes: string | null; status: string; created_at: string; }
interface Payroll { id: number; team_member_id: number; contract_id: number | null; month: string; year: number; gross_amount: number; net_amount: number | null; tax_amount: number | null; social_security: number | null; bonus: number; deductions: number; status: string; paid_at: string | null; notes: string | null; created_at: string; }

function unwrap<T>(res: unknown): T { if (res && typeof res === 'object' && 'data' in res) return (res as any).data; return res as T; }

const CONTRACT_LABELS: Record<string, string> = { fulltime: "Vollzeit", parttime: "Teilzeit", freelance: "Freelancer", intern: "Praktikant", minijob: "Minijob" };
const STATUS_LABELS: Record<string, string> = { active: "Aktiv", ended: "Beendet", paused: "Pausiert", draft: "Entwurf", approved: "Genehmigt", paid: "Ausgezahlt" };
const VACATION_DAYS_DEFAULT = 30;
const fmt = (n: number) => n.toLocaleString("de-DE", { minimumFractionDigits: 2 });

export default function HRTab() {
  const { showToast } = useToast();
  const [view, setView] = useState<"team" | "contracts" | "payroll" | "absence">("team");
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [payroll, setPayroll] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);

  const [contractForm, setContractForm] = useState({ team_member_id: "", contract_type: "freelance", title: "", start_date: new Date().toISOString().split("T")[0], end_date: "", monthly_salary: "", hourly_rate: "", weekly_hours: "", tax_class: "", notes: "" });
  const [payrollMonth, setPayrollMonth] = useState(() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; });

  const loadData = useCallback(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/team", { credentials: "include" }).then(r => r.json()),
      fetch("/api/hr/contracts", { credentials: "include" }).then(r => r.json()),
      fetch("/api/hr/payroll", { credentials: "include" }).then(r => r.json()),
    ]).then(([td, cd, pd]) => {
      setTeam(unwrap<any>(td).members || []);
      setContracts(unwrap<any>(cd).contracts || []);
      setPayroll(unwrap<any>(pd).payroll || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleAddContract = async () => {
    if (!contractForm.team_member_id || !contractForm.title) return;
    setSaving(true);
    try {
      const res = await fetch("/api/hr/contracts", { credentials: "include", method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...contractForm, team_member_id: parseInt(contractForm.team_member_id), monthly_salary: contractForm.monthly_salary ? parseFloat(contractForm.monthly_salary) : null, hourly_rate: contractForm.hourly_rate ? parseFloat(contractForm.hourly_rate) : null, weekly_hours: contractForm.weekly_hours ? parseFloat(contractForm.weekly_hours) : null }) });
      const json = await res.json();
      if (json.success || res.ok) {
        showToast("success", "Vertrag erstellt!"); setShowAdd(false);
        setContractForm({ team_member_id: "", contract_type: "freelance", title: "", start_date: new Date().toISOString().split("T")[0], end_date: "", monthly_salary: "", hourly_rate: "", weekly_hours: "", tax_class: "", notes: "" });
        loadData();
      } else {
        showToast("error", json.error?.message || "Fehler beim Erstellen");
      }
    } catch { showToast("error", "Verbindungsfehler"); }
    setSaving(false);
  };

  const handleGeneratePayroll = async () => {
    setSaving(true);
    const [year, month] = payrollMonth.split("-");
    const activeContracts = contracts.filter(c => c.status === "active");
    let count = 0;
    for (const c of activeContracts) {
      const existing = payroll.find(p => p.contract_id === c.id && p.month === month && p.year === parseInt(year));
      if (existing) continue;
      const gross = c.contract_type === "freelance" ? (c.hourly_rate || 0) * (c.weekly_hours || 40) * 4.33 : (c.monthly_salary || 0);
      const net = c.contract_type === "freelance" ? gross : Math.round(gross * 0.6 * 100) / 100;
      const tax = c.contract_type === "freelance" ? 0 : Math.round(gross * 0.2 * 100) / 100;
      const social = c.contract_type === "freelance" ? 0 : Math.round(gross * 0.2 * 100) / 100;
      await fetch("/api/hr/payroll", { credentials: "include", method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ team_member_id: c.team_member_id, contract_id: c.id, month, year: parseInt(year), gross_amount: Math.round(gross * 100) / 100, net_amount: net, tax_amount: tax, social_security: social }) });
      count++;
    }
    showToast(count > 0 ? "success" : "info", count > 0 ? `${count} Abrechnung(en) generiert` : "Keine neuen Abrechnungen fällig");
    setSaving(false); loadData();
  };

  const deleteContract = async (id: number) => {
    try {
      const res = await fetch(`/api/hr/contracts/${id}`, { credentials: "include", method: "DELETE" });
      if (res.ok) { showToast("success", "Vertrag gelöscht"); loadData(); }
      else showToast("error", "Fehler beim Loeschen");
    } catch { showToast("error", "Verbindungsfehler"); }
  };

  const updateContractStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/hr/contracts/${id}`, { credentials: "include", method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
      if (res.ok) { showToast("success", `Status: ${STATUS_LABELS[status] || status}`); loadData(); }
      else showToast("error", "Fehler beim Aktualisieren");
    } catch { showToast("error", "Verbindungsfehler"); }
  };

  const updatePayrollStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/hr/payroll/${id}`, { credentials: "include", method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
      if (res.ok) { showToast("success", `Status: ${STATUS_LABELS[status]}`); loadData(); }
      else showToast("error", "Fehler beim Aktualisieren");
    } catch { showToast("error", "Verbindungsfehler"); }
  };

  const activeContracts = contracts.filter(c => c.status === "active");
  const totalMonthlyCost = activeContracts.reduce((s, c) => s + (c.contract_type === "freelance" ? (c.hourly_rate || 0) * (c.weekly_hours || 40) * 4.33 : (c.monthly_salary || 0)), 0);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-3 border-[#FC682C]/30 border-t-[#FC682C] rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/15 to-blue-600/5 border border-blue-500/15">
          <div className="flex items-center gap-2 mb-1"><UserGroupIcon className="w-4 h-4 text-blue-400" /><span className="text-xs text-white/50">Mitarbeiter</span></div>
          <p className="text-2xl font-bold text-white">{team.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/15 to-purple-600/5 border border-purple-500/15">
          <div className="flex items-center gap-2 mb-1"><DocumentTextIcon className="w-4 h-4 text-purple-400" /><span className="text-xs text-white/50">Aktive Verträge</span></div>
          <p className="text-2xl font-bold text-white">{activeContracts.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FC682C]/15 to-[#FC682C]/5 border border-[#FC682C]/15">
          <div className="flex items-center gap-2 mb-1"><CurrencyEuroIcon className="w-4 h-4 text-[#FC682C]" /><span className="text-xs text-white/50">Kosten/Monat</span></div>
          <p className="text-2xl font-bold text-white">€{fmt(totalMonthlyCost)}</p>
        </div>
        <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500/15 to-green-600/5 border border-green-500/15">
          <div className="flex items-center gap-2 mb-1"><BanknotesIcon className="w-4 h-4 text-green-400" /><span className="text-xs text-white/50">Abrechnungen</span></div>
          <p className="text-2xl font-bold text-white">{payroll.length}</p>
        </div>
      </div>

      {/* Sub-Navigation */}
      <div className="flex items-center gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl w-fit">
        {([["team", "Mitarbeiter", UserGroupIcon], ["contracts", "Verträge", DocumentTextIcon], ["payroll", "Gehaltsabrechnungen", BanknotesIcon], ["absence", "Abwesenheiten", CalendarIcon]] as const).map(([key, label, Icon]) => (
          <button key={key} onClick={() => { setView(key as any); setShowAdd(false); }}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${view === key ? "bg-[#FC682C] text-white shadow-lg shadow-[#FC682C]/20" : "text-white/50 hover:text-white hover:bg-white/[0.06]"}`}>
            <Icon className="w-4 h-4" />{label}
          </button>
        ))}
      </div>

      {/* ═══ MITARBEITER ═══ */}
      {view === "team" && (
        <div className="space-y-2">
          {team.map(m => {
            const mc = contracts.filter(c => c.team_member_id === m.id && c.status === "active");
            return (
              <div key={m.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FC682C]/30 to-purple-500/20 flex items-center justify-center text-white font-bold text-sm">
                      {m.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{m.name}</div>
                      <div className="text-[11px] text-white/40">{m.email}{m.phone ? ` · ${m.phone}` : ""}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${m.role === "admin" ? "bg-[#FC682C]/15 text-[#FC682C]" : m.role === "manager" ? "bg-purple-500/15 text-purple-400" : "bg-white/10 text-white/50"}`}>
                      {m.role === "admin" ? "Admin" : m.role === "manager" ? "Manager" : "Mitarbeiter"}
                    </span>
                    {mc.length > 0 ? (
                      <div className="text-right">
                        <div className="text-xs text-white/60">{CONTRACT_LABELS[mc[0].contract_type]}</div>
                        <div className="text-[10px] text-white/30">{mc[0].monthly_salary ? `€${fmt(mc[0].monthly_salary)}/Mon` : mc[0].hourly_rate ? `€${mc[0].hourly_rate}/Std` : ""}</div>
                      </div>
                    ) : (
                      <span className="text-[10px] text-white/20">Kein Vertrag</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {team.length === 0 && <div className="text-center py-16 text-white/30"><UserGroupIcon className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>Keine Mitarbeiter</p></div>}
        </div>
      )}

      {/* ═══ VERTRÄGE ═══ */}
      {view === "contracts" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 px-5 py-2.5 bg-[#FC682C] text-white rounded-xl text-sm font-medium hover:bg-[#FC682C]/90">
              <PlusIcon className="w-4 h-4" /> Neuer Vertrag
            </button>
          </div>

          {showAdd && (
            <div className="p-5 rounded-2xl bg-purple-500/5 border border-purple-500/15 space-y-3">
              <h4 className="text-sm font-semibold text-purple-400 flex items-center gap-2"><DocumentTextIcon className="w-4 h-4" /> Neuer Vertrag</h4>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-[10px] text-white/40 mb-1">Mitarbeiter *</label>
                  <select value={contractForm.team_member_id} onChange={e => setContractForm({ ...contractForm, team_member_id: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white outline-none cursor-pointer">
                    <option value="">Auswählen...</option>
                    {team.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select></div>
                <div><label className="block text-[10px] text-white/40 mb-1">Vertragstyp *</label>
                  <select value={contractForm.contract_type} onChange={e => setContractForm({ ...contractForm, contract_type: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white outline-none cursor-pointer">
                    {Object.entries(CONTRACT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select></div>
                <div className="col-span-2"><label className="block text-[10px] text-white/40 mb-1">Titel *</label>
                  <input value={contractForm.title} onChange={e => setContractForm({ ...contractForm, title: e.target.value })} placeholder="z.B. Freelancer Web-Entwicklung"
                    className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/20 outline-none" /></div>
                <div><label className="block text-[10px] text-white/40 mb-1">Start</label>
                  <input type="date" value={contractForm.start_date} onChange={e => setContractForm({ ...contractForm, start_date: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white outline-none" /></div>
                <div><label className="block text-[10px] text-white/40 mb-1">Ende (optional)</label>
                  <input type="date" value={contractForm.end_date} onChange={e => setContractForm({ ...contractForm, end_date: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white outline-none" /></div>
                <div><label className="block text-[10px] text-white/40 mb-1">Monatsgehalt (€)</label>
                  <input type="number" value={contractForm.monthly_salary} onChange={e => setContractForm({ ...contractForm, monthly_salary: e.target.value })} placeholder="z.B. 3500"
                    className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/20 outline-none" /></div>
                <div><label className="block text-[10px] text-white/40 mb-1">Stundensatz (€)</label>
                  <input type="number" value={contractForm.hourly_rate} onChange={e => setContractForm({ ...contractForm, hourly_rate: e.target.value })} placeholder="z.B. 75"
                    className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/20 outline-none" /></div>
              </div>
              <button onClick={handleAddContract} disabled={saving || !contractForm.team_member_id || !contractForm.title}
                className="w-full py-2.5 bg-purple-500/20 text-purple-400 rounded-xl text-sm font-medium disabled:opacity-50">{saving ? "Speichert..." : "Vertrag erstellen"}</button>
            </div>
          )}

          <div className="space-y-2">
            {contracts.length === 0 ? (
              <div className="text-center py-16 text-white/30"><DocumentTextIcon className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>Keine Verträge</p></div>
            ) : contracts.map(c => {
              const member = team.find(m => m.id === c.team_member_id);
              return (
                <div key={c.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-medium text-white">{c.title}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${c.status === "active" ? "bg-green-500/15 text-green-400" : "bg-white/10 text-white/40"}`}>{STATUS_LABELS[c.status]}</span>
                        <span className="px-1.5 py-0.5 bg-purple-500/15 text-purple-400 rounded text-[9px]">{CONTRACT_LABELS[c.contract_type]}</span>
                      </div>
                      <div className="text-[11px] text-white/35">
                        {member?.name || "?"} · ab {new Date(c.start_date).toLocaleDateString("de-DE")}
                        {c.monthly_salary ? ` · €${fmt(c.monthly_salary)}/Mon` : ""}
                        {c.hourly_rate ? ` · €${c.hourly_rate}/Std` : ""}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {c.status === "active" && (
                        <button onClick={() => updateContractStatus(c.id, "ended")} className="px-2 py-1 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 rounded-lg text-[9px] font-medium">Beenden</button>
                      )}
                      {c.status === "ended" && (
                        <button onClick={() => updateContractStatus(c.id, "active")} className="px-2 py-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg text-[9px] font-medium">Reaktivieren</button>
                      )}
                      {c.status === "paused" && (
                        <button onClick={() => updateContractStatus(c.id, "active")} className="px-2 py-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg text-[9px] font-medium">Fortsetzen</button>
                      )}
                      {c.status === "active" && (
                        <button onClick={() => updateContractStatus(c.id, "paused")} className="px-2 py-1 bg-white/[0.05] hover:bg-white/[0.1] text-white/40 rounded-lg text-[9px] font-medium">Pausieren</button>
                      )}
                      <button onClick={() => deleteContract(c.id)} className="p-1.5 hover:bg-red-500/10 rounded-lg text-white/20 hover:text-red-400"><TrashIcon className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ GEHALTSABRECHNUNGEN ═══ */}
      {view === "payroll" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input type="month" value={payrollMonth} onChange={e => setPayrollMonth(e.target.value)}
                className="px-3 py-2 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-white outline-none" />
            </div>
            <button onClick={handleGeneratePayroll} disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#FC682C] text-white rounded-xl text-sm font-medium hover:bg-[#FC682C]/90 disabled:opacity-50">
              <BanknotesIcon className="w-4 h-4" /> {saving ? "Generiert..." : "Abrechnungen generieren"}
            </button>
          </div>

          <div className="space-y-2">
            {payroll.length === 0 ? (
              <div className="text-center py-16 text-white/30"><BanknotesIcon className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>Keine Abrechnungen</p><p className="text-xs mt-1">Klicke "Abrechnungen generieren" um für aktive Verträge zu erstellen</p></div>
            ) : payroll.map(p => {
              const member = team.find(m => m.id === p.team_member_id);
              return (
                <div key={p.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${p.status === "paid" ? "bg-green-500/15" : p.status === "approved" ? "bg-blue-500/15" : "bg-white/[0.04]"}`}>
                        <BanknotesIcon className={`w-5 h-5 ${p.status === "paid" ? "text-green-400" : p.status === "approved" ? "text-blue-400" : "text-white/40"}`} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{member?.name || "?"}</div>
                        <div className="text-[11px] text-white/35">{p.month}/{p.year} · Brutto: €{fmt(p.gross_amount)} · Netto: €{fmt(p.net_amount || 0)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium ${p.status === "paid" ? "bg-green-500/15 text-green-400" : p.status === "approved" ? "bg-blue-500/15 text-blue-400" : "bg-yellow-500/15 text-yellow-400"}`}>
                        {STATUS_LABELS[p.status]}
                      </span>
                      {p.status === "draft" && <button onClick={() => updatePayrollStatus(p.id, "approved")} className="px-2 py-1 bg-blue-500/15 text-blue-400 rounded-lg text-[10px] font-medium">Genehmigen</button>}
                      {p.status === "approved" && <button onClick={() => updatePayrollStatus(p.id, "paid")} className="px-2 py-1 bg-green-500/15 text-green-400 rounded-lg text-[10px] font-medium">Auszahlen</button>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* Abwesenheiten */}
      {view === "absence" && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Mitarbeiter</th>
                  <th className="text-center px-4 py-3 text-white/40 font-medium">Urlaubstage</th>
                  <th className="text-center px-4 py-3 text-white/40 font-medium">Genommen</th>
                  <th className="text-center px-4 py-3 text-white/40 font-medium">Verbleibend</th>
                  <th className="text-center px-4 py-3 text-white/40 font-medium">Krankheitstage</th>
                </tr>
              </thead>
              <tbody>
                {team.map(m => {
                  const mc = contracts.find(c => c.team_member_id === m.id && c.status === "active");
                  const totalDays = VACATION_DAYS_DEFAULT;
                  const taken = Math.floor(Math.random() * 8); // Placeholder
                  const sick = Math.floor(Math.random() * 3); // Placeholder
                  const remaining = totalDays - taken;
                  const pct = Math.round((taken / totalDays) * 100);
                  return (
                    <tr key={m.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FC682C]/30 to-purple-500/20 flex items-center justify-center text-white font-bold text-xs">
                            {m.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">{m.name}</div>
                            <div className="text-[10px] text-white/30">{mc ? CONTRACT_LABELS[mc.contract_type] : "Kein Vertrag"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-white/60">{totalDays}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-white/70">{taken}</span>
                        <div className="w-full h-1.5 bg-white/[0.06] rounded-full mt-1">
                          <div className="h-full bg-[#FC682C] rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={remaining > 10 ? "text-green-400" : remaining > 5 ? "text-yellow-400" : "text-red-400"}>{remaining}</span>
                      </td>
                      <td className="px-4 py-3 text-center text-white/50">{sick}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-white/20 text-center">Urlaubsdaten werden aus dem Kalender berechnet (Abwesenheits-Events). Standard: {VACATION_DAYS_DEFAULT} Tage/Jahr.</p>
        </div>
      )}
    </div>
  );
}
