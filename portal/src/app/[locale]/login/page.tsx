"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  KeyIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

// ═══════════════════════════════════════════════════════════════
//         PORTAL LOGIN - Zugangscode eingeben
// ═══════════════════════════════════════════════════════════════

export default function PortalLoginPage() {
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("login");
  const tCommon = useTranslations("common");

  // Build locale-aware dashboard path
  const dashboardPath = locale === "de" ? "/dashboard" : `/${locale}/dashboard`;

  // Check if already logged in
  useEffect(() => {
    fetch("/api/project", { credentials: "include" })
      .then((res) => {
        if (res.ok) {
          router.push(dashboardPath);
        }
      })
      .catch(() => {});
  }, [router, dashboardPath]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const code = accessCode.trim().toUpperCase();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
        credentials: "include",
      });

      if (res.ok) {
        router.push(dashboardPath);
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || t("invalidCode"));
      }
    } catch {
      setError(t("connectionError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#09090b] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FC682C]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-10">
            <img
              src="/logo-dark.png"
              alt="AgentFlow"
              className="h-16 w-auto mx-auto mb-6"
            />
            <p className="text-white/40">{tCommon("portal")}</p>
          </div>

          {/* Login Card - Animated Border */}
          <div className="relative group">
            {/* Animated gradient border */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FC682C] via-purple-500 to-[#FC682C] rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity animate-pulse" />
            
            <div className="relative portal-card">
              {/* Version Badge */}
              <div className="absolute -top-3 -right-3 px-2 py-1 bg-gradient-to-r from-[#FC682C] to-purple-500 rounded-full text-[10px] font-bold text-white shadow-lg">
                v2.0 ✨
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#FC682C]/10 border border-[#FC682C]/20 flex items-center justify-center">
                  <KeyIcon className="w-5 h-5 text-[#FC682C]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">{t("title")}</h2>
                  <p className="text-sm text-white/40">{t("subtitle")}</p>
                </div>
              </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label
                  htmlFor="code"
                  className="block text-xs text-white/50 mb-2 uppercase tracking-wider font-medium"
                >
                  {t("accessCode")}
                </label>
                <input
                  id="code"
                  type="text"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                  className="portal-input text-center text-xl tracking-[0.2em] font-mono bg-white/[0.02]"
                  placeholder={t("placeholder")}
                  required
                  maxLength={12}
                  autoFocus
                />
                <p className="text-xs text-white/30 mt-2 text-center">
                  {t("codeHint")}
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <p className="text-red-400 text-sm text-center">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || accessCode.length < 4}
                className="w-full portal-btn disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>{t("checking")}</span>
                  </>
                ) : (
                  <>
                    <span>{t("loginButton")}</span>
                    <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/[0.06]">
              <p className="text-center text-xs text-white/30">
                {t("codeInfo")}
              </p>
            </div>
            </div>
          </div>

          {/* Help */}
          <p className="text-center mt-8 text-sm text-white/40">
            {t("noCode")}{" "}
            <a
              href="https://agentflowm.com/kontakt"
              className="text-[#FC682C] hover:underline font-medium"
            >
              {t("contactUs")}
            </a>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center relative z-10">
        <p className="text-xs text-white/20">
          &copy; {new Date().getFullYear()} AgentFlow.
        </p>
      </footer>
    </div>
  );
}
