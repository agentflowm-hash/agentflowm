"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

interface ReferrerData {
  referrer: {
    name: string;
    company: string | null;
    total_referrals: number;
    converted_referrals: number;
    commission_rate: number;
    referral_code: string;
  };
  referrals: { id: number; name: string; company: string | null; status: string; date: string }[];
  commissions: { id: number; amount: number; deal_value: number; rate: number; status: string; notes: string | null; date: string; paid_at: string | null }[];
  stats: {
    total_referrals: number;
    total_commission: number;
    pending_commission: number;
    paid_commission: number;
  };
}

export default function ReferrerStatusPage() {
  const params = useParams();
  const code = params.code as string;

  const [data, setData] = useState<ReferrerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [invalid, setInvalid] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!code) return;
    fetch(`/api/referrer-status?code=${code}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => { setInvalid(true); setLoading(false); });
  }, [code]);

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/refer/${code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#FC682C]/30 border-t-[#FC682C] rounded-full animate-spin" />
      </div>
    );
  }

  if (invalid || !data) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Seite nicht gefunden</h1>
          <p className="text-white/50">Dieser Empfehlungslink ist ungültig.</p>
        </div>
      </div>
    );
  }

  const { referrer, referrals, commissions, stats } = data;
  const fmt = (n: number) => n.toLocaleString("de-DE", { minimumFractionDigits: 2 });

  return (
    <div className="min-h-screen bg-[#0B0F19] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Image src="/logo-compact-dark.png" alt="AgentFlowMarketing" width={160} height={36} />
          <span className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-xs text-purple-400 font-medium">
            Empfehlungspartner
          </span>
        </div>

        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Hallo {referrer.name.split(" ")[0]}!</h1>
          <p className="text-white/50">Hier siehst du den Status deiner Empfehlungen und Provisionen.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/5 border border-purple-500/20">
            <p className="text-sm text-white/50 mb-1">Empfehlungen</p>
            <p className="text-3xl font-bold text-white">{stats.total_referrals}</p>
          </div>
          <div className="p-5 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/5 border border-green-500/20">
            <p className="text-sm text-white/50 mb-1">Konvertiert</p>
            <p className="text-3xl font-bold text-white">{referrer.converted_referrals}</p>
          </div>
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FC682C]/20 to-[#FC682C]/5 border border-[#FC682C]/20">
            <p className="text-sm text-white/50 mb-1">Gesamt verdient</p>
            <p className="text-3xl font-bold text-white">{fmt(stats.total_commission)}€</p>
          </div>
          <div className="p-5 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/5 border border-yellow-500/20">
            <p className="text-sm text-white/50 mb-1">Ausstehend</p>
            <p className="text-3xl font-bold text-white">{fmt(stats.pending_commission)}€</p>
          </div>
        </div>

        {/* Referral Link */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-[#FC682C]/10 to-purple-500/10 border border-[#FC682C]/20 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-sm font-semibold text-white mb-1">Dein Empfehlungslink</h3>
              <p className="text-xs text-white/40">Teile diesen Link um neue Empfehlungen zu generieren ({referrer.commission_rate}% Provision)</p>
            </div>
            <div className="flex items-center gap-2">
              <code className="px-3 py-2 bg-white/[0.04] border border-white/[0.06] rounded-lg text-xs text-white/60 font-mono">
                {typeof window !== "undefined" ? `${window.location.origin}/refer/${code}` : `/refer/${code}`}
              </code>
              <button
                onClick={copyLink}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  copied
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-[#FC682C] text-white hover:bg-[#FC682C]/90"
                }`}
              >
                {copied ? "Kopiert!" : "Kopieren"}
              </button>
            </div>
          </div>
        </div>

        {/* Two Columns */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Referrals */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Deine Empfehlungen</h2>
            <div className="space-y-3">
              {referrals.length === 0 ? (
                <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center">
                  <p className="text-white/40 text-sm">Noch keine Empfehlungen. Teile deinen Link!</p>
                </div>
              ) : (
                referrals.map((r) => (
                  <div key={r.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">{r.name}</p>
                        <p className="text-xs text-white/40">{r.company || "Kein Unternehmen"} &bull; {new Date(r.date).toLocaleDateString("de-DE")}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-medium border ${
                        r.status === "Kunde geworden" ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : r.status === "Nicht zustande" ? "bg-red-500/20 text-red-400 border-red-500/30"
                        : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                      }`}>
                        {r.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Commissions */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Deine Provisionen</h2>
            <div className="space-y-3">
              {commissions.length === 0 ? (
                <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center">
                  <p className="text-white/40 text-sm">Noch keine Provisionen. Sobald ein Deal abgeschlossen wird, siehst du sie hier.</p>
                </div>
              ) : (
                commissions.map((c) => (
                  <div key={c.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#FC682C]">{fmt(c.amount)}€</p>
                        <p className="text-xs text-white/40">
                          {fmt(c.deal_value)}€ Deal &times; {c.rate}%
                          {c.notes && ` &bull; ${c.notes}`}
                        </p>
                        <p className="text-[10px] text-white/30 mt-1">{new Date(c.date).toLocaleDateString("de-DE")}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-medium border ${
                        c.status === "Ausgezahlt" ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : c.status === "Genehmigt" ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                        : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                      }`}>
                        {c.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-white/[0.06] text-center">
          <p className="text-xs text-white/30">AgentFlowMarketing &bull; Achillesstraße 69A, 13125 Berlin &bull; kontakt@agentflowm.de</p>
        </div>
      </div>
    </div>
  );
}
