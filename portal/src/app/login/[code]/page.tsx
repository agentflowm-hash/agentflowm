"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  KeyIcon,
  ArrowRightIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

const MAIN_WEBSITE_URL =
  process.env.NEXT_PUBLIC_MAIN_URL || "https://agentflowm.com";

// ═══════════════════════════════════════════════════════════════
//         PORTAL LOGIN - Nur mit gültigem Zugangscode erreichbar
// URL: /login/ACCESSCODE (z.B. /login/DEMO-2024)
// ═══════════════════════════════════════════════════════════════

export default function PortalLogin() {
  const params = useParams();
  const codeFromUrl = (params.code as string)?.toUpperCase() || "";

  const [accessCode, setAccessCode] = useState(codeFromUrl);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [codeValid, setCodeValid] = useState(false);
  const router = useRouter();

  // Validate code on mount
  useEffect(() => {
    const validateCode = async () => {
      if (!codeFromUrl) {
        // No code provided - redirect away
        window.location.href = MAIN_WEBSITE_URL;
        return;
      }

      try {
        // Check if code exists (without logging in)
        const res = await fetch("/api/auth/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: codeFromUrl }),
        });

        if (res.ok) {
          setCodeValid(true);
          setAccessCode(codeFromUrl);
        } else {
          // Invalid code - redirect
          window.location.href = MAIN_WEBSITE_URL;
          return;
        }
      } catch {
        window.location.href = MAIN_WEBSITE_URL;
        return;
      }

      setValidating(false);
    };

    validateCode();
  }, [codeFromUrl]);

  // Check if already logged in
  useEffect(() => {
    fetch("/api/project", { credentials: "include" })
      .then((res) => {
        if (res.ok) {
          router.push("/dashboard");
        }
      })
      .catch(() => {});
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: accessCode }),
        credentials: "include",
      });

      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Ungültiger Zugangscode");
      }
    } catch {
      setError("Verbindungsfehler");
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09090b]">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#FC682C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/40 text-sm">Zugang wird geprüft...</p>
        </div>
      </div>
    );
  }

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
            <p className="text-white/40">Kundenportal</p>
          </div>

          {/* Login Card */}
          <div className="portal-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#FC682C]/10 border border-[#FC682C]/20 flex items-center justify-center">
                <KeyIcon className="w-5 h-5 text-[#FC682C]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Willkommen</h2>
                <p className="text-sm text-white/40">Zugang zu Ihrem Projekt</p>
              </div>
            </div>

            {/* Code Display */}
            <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-3">
                <CheckCircleIcon className="w-5 h-5 text-green-400 flex-shrink-0" />
                <div>
                  <p className="text-sm text-green-400 font-medium">
                    Zugangscode erkannt
                  </p>
                  <p className="text-xs text-green-400/60 mt-0.5">
                    Klicken Sie auf "Einloggen" um fortzufahren
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label
                  htmlFor="code"
                  className="block text-xs text-white/50 mb-2 uppercase tracking-wider font-medium"
                >
                  Ihr Zugangscode
                </label>
                <input
                  id="code"
                  type="text"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                  className="portal-input text-center text-xl tracking-[0.2em] font-mono bg-white/[0.02]"
                  placeholder="XXXX-XXXX"
                  required
                  maxLength={12}
                />
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
                    <span>Prüfen...</span>
                  </>
                ) : (
                  <>
                    <span>Einloggen</span>
                    <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/[0.06]">
              <p className="text-center text-xs text-white/30">
                Dieser Zugang wurde für Sie erstellt.
              </p>
            </div>
          </div>

          {/* Help */}
          <p className="text-center mt-8 text-sm text-white/40">
            Probleme?{" "}
            <a
              href="mailto:kontakt@agentflowm.com"
              className="text-[#FC682C] hover:underline font-medium"
            >
              Kontaktieren Sie uns
            </a>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center relative z-10">
        <p className="text-xs text-white/20">
          &copy; {new Date().getFullYear()} AgentFlow. Alle Rechte vorbehalten.
        </p>
      </footer>
    </div>
  );
}
