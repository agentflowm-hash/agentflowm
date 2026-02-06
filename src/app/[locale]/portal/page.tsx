"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Header } from "@/components/layout";
import { type Locale } from "@/i18n/config";

export default function PortalLogin() {
  const t = useTranslations("pages.portal.login");
  const params = useParams();
  const locale = (params?.locale as Locale) || "de";
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/portal/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/portal/dashboard");
      } else {
        setError(data.error || t("invalidCode"));
      }
    } catch {
      setError(t("connectionError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030308]">
      {/* Header */}
      <Header locale={locale} />
      
      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center p-4 pt-24">
        {/* Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FC682C]/10 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px]" />
        </div>

        <div className="relative w-full max-w-md">
          {/* Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FC682C] to-[#FFB347] flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(252,104,44,0.3)]">
              <span className="text-2xl">🔑</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">{t("title")}</h1>
            <p className="text-white/50">{t("subtitle")}</p>
          </div>

        {/* Login Card */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-white/70 mb-2"
              >
                {t("codeLabel")}
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder={t("codePlaceholder")}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#FC682C]/50 focus:ring-2 focus:ring-[#FC682C]/20 transition-all text-center text-lg font-mono tracking-widest"
                autoFocus
                disabled={loading}
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-[#FC682C]/10 border border-[#FC682C]/30 text-[#FC682C] text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#FC682C] to-[#FF8F5C] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#FC682C]/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {t("loggingIn")}
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  {t("loginButton")}
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-white/40">
              {t("noCode")}{" "}
              <Link
                href="/#pakete"
                className="text-[#FC682C] hover:underline font-medium"
              >
                {t("startProject")}
              </Link>
            </p>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
          <p className="text-sm text-white/60 text-center">{t("helpText")}</p>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-white/40 hover:text-white transition-colors inline-flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            {t("backToWebsite")}
          </Link>
        </div>
        </div>
      </div>
    </div>
  );
}
