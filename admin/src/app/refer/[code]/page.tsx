"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function ReferralPage() {
  const params = useParams();
  const code = params.code as string;

  const [referrerName, setReferrerName] = useState("");
  const [referrerCompany, setReferrerCompany] = useState("");
  const [loading, setLoading] = useState(true);
  const [invalid, setInvalid] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    package_interest: "",
  });

  useEffect(() => {
    if (!code) return;
    fetch(`/api/refer?code=${code}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        setReferrerName(data.referrer_name);
        setReferrerCompany(data.referrer_company || "");
        setLoading(false);
      })
      .catch(() => {
        setInvalid(true);
        setLoading(false);
      });
  }, [code]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/refer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, referral_code: code }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(data.error || "Ein Fehler ist aufgetreten");
      }
    } catch {
      setError("Verbindungsfehler. Bitte versuche es erneut.");
    } finally {
      setSubmitting(false);
    }
  };

  const packages = [
    "START Website (€3.790)",
    "BUSINESS Website (€8.390)",
    "ONE PAGE (€1.390)",
    "Web App (€18.990)",
    "Mobile App (€35.990)",
    "AI-Agenten (€4.990)",
    "Logo & Branding (€990)",
    "Website-Check (kostenlos)",
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#FC682C]/30 border-t-[#FC682C] rounded-full animate-spin" />
      </div>
    );
  }

  if (invalid) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Ungültiger Empfehlungslink</h1>
          <p className="text-white/50">Dieser Empfehlungslink ist ungültig oder abgelaufen. Bitte kontaktiere die Person, die dir diesen Link gegeben hat.</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Vielen Dank!</h1>
          <p className="text-white/50 mb-2">Deine Anfrage wurde erfolgreich gesendet.</p>
          <p className="text-white/40 text-sm">Unser Team wird sich in Kürze bei dir melden. Empfohlen von <span className="text-[#FC682C] font-medium">{referrerName}</span>.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <Image src="/logo-compact-dark.png" alt="AgentFlowMarketing" width={180} height={40} className="mx-auto mb-6" />
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-4">
            <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
            </svg>
            <span className="text-sm text-purple-400 font-medium">Empfohlen von {referrerName}</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Lass uns dein Projekt besprechen</h1>
          <p className="text-white/50">
            {referrerName}{referrerCompany ? ` von ${referrerCompany}` : ''} hat uns empfohlen. Fülle das Formular aus und wir melden uns umgehend.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-[#111827] border border-white/[0.08] rounded-2xl p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/40 mb-2">Name *</label>
              <input
                type="text" required value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Dein Name"
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white placeholder:text-white/30 focus:border-[#FC682C]/50 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-2">E-Mail *</label>
              <input
                type="email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="deine@email.de"
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white placeholder:text-white/30 focus:border-[#FC682C]/50 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-2">Telefon</label>
              <input
                type="tel" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+49 123 456789"
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white placeholder:text-white/30 focus:border-[#FC682C]/50 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-2">Firma</label>
              <input
                type="text" value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="Deine Firma"
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white placeholder:text-white/30 focus:border-[#FC682C]/50 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-white/40 mb-2">Welches Paket interessiert dich?</label>
            <select
              value={form.package_interest}
              onChange={(e) => setForm({ ...form, package_interest: e.target.value })}
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white focus:border-[#FC682C]/50 outline-none cursor-pointer"
            >
              <option value="">Paket auswählen...</option>
              {packages.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs text-white/40 mb-2">Nachricht</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Erzähl uns von deinem Projekt..."
              rows={4}
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white placeholder:text-white/30 focus:border-[#FC682C]/50 outline-none resize-none"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">{error}</div>
          )}

          <button
            type="submit"
            disabled={submitting || !form.name || !form.email}
            className="w-full py-3.5 bg-[#FC682C] text-white rounded-xl font-semibold hover:bg-[#FC682C]/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
          >
            {submitting ? (
              <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Wird gesendet...</>
            ) : (
              "Kostenlose Beratung anfragen"
            )}
          </button>

          <p className="text-center text-[11px] text-white/30">
            Mit dem Absenden stimmst du unserer Datenschutzerklärung zu. Keine Spam-Mails.
          </p>
        </form>
      </div>
    </div>
  );
}
