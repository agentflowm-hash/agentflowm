"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Translations
const translations = {
  de: {
    title: "Admin Dashboard",
    password: "Passwort",
    placeholder: "••••••••",
    submit: "Anmelden",
    loading: "Anmelden...",
    error: "Falsches Passwort",
    connectionError: "Verbindungsfehler",
    back: "← Zurück zur Website",
  },
  en: {
    title: "Admin Dashboard",
    password: "Password",
    placeholder: "••••••••",
    submit: "Sign in",
    loading: "Signing in...",
    error: "Wrong password",
    connectionError: "Connection error",
    back: "← Back to website",
  },
};

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [locale, setLocale] = useState<"de" | "en">("de");
  const router = useRouter();

  // Detect locale from domain
  useEffect(() => {
    const hostname = window.location.hostname;
    if (hostname.includes(".com")) {
      setLocale("en");
    } else {
      setLocale("de");
    }
  }, []);

  const t = translations[locale];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        credentials: "include",
      });

      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        setError(t.error);
      }
    } catch {
      setError(t.connectionError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8 relative">
          {/* Version Badge */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-[#FC682C] to-purple-500 rounded-full text-[10px] font-bold text-white shadow-lg animate-pulse">
            v2.0 UPGRADE ✨
          </div>
          <img
            src="/logo-dark.png"
            alt="AgentFlow"
            className="h-12 w-auto mx-auto mb-4 mt-4"
          />
          <p className="text-white/40 text-sm">{t.title}</p>
        </div>

        {/* Login Form - with glow border */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#FC682C] via-purple-500 to-[#FC682C] rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity" />
        <form onSubmit={handleSubmit} className="relative space-y-4 p-6 bg-[#0a0a0a] rounded-xl border border-white/10">
          <div>
            <label
              htmlFor="password"
              className="block text-xs text-white/50 mb-2 uppercase tracking-wider"
            >
              {t.password}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-input"
              placeholder={t.placeholder}
              autoFocus
              required
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#FC682C] text-white font-medium rounded-lg hover:bg-[#e55a1f] transition-colors disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
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
                {t.loading}
              </span>
            ) : (
              t.submit
            )}
          </button>
        </form>
        </div>

        {/* Back link */}
        <p className="text-center mt-6">
          <a
            href={locale === "en" ? "https://agentflowm.com" : "https://agentflowm.de"}
            className="text-white/30 text-xs hover:text-white/50 transition-colors"
          >
            {t.back}
          </a>
        </p>
      </div>
    </div>
  );
}
