"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

const PORTAL_URL =
  process.env.NEXT_PUBLIC_PORTAL_URL || "https://portal.agentflowm.com";

// ═══════════════════════════════════════════════════════════════
//                    TELEGRAM LOGIN PAGE
// Code-based login via Telegram Bot
// ═══════════════════════════════════════════════════════════════

export default function AnmeldenPage() {
  const t = useTranslations("pages.anmelden");
  const [step, setStep] = useState<"start" | "code" | "success">("start");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<{
    name: string;
    username: string;
    accessCode: string;
  } | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const { login, isAuthenticated, loading: authLoading } = useAuth();

  const TELEGRAM_BOT = "Agentflowzbot";

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, authLoading, router]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  // Start polling when code step is active
  useEffect(() => {
    if (step === "code") {
      // Poll every 2 seconds for Telegram updates
      const poll = async () => {
        try {
          await fetch("/api/telegram/bot");
        } catch (e) {
          // Ignore
        }
      };
      poll();
      pollingRef.current = setInterval(poll, 2000);

      // Focus first input
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [step]);

  // Handle Code Input
  const handleCodeInput = (index: number, value: string) => {
    // Only digits
    const digit = value.replace(/\D/g, "").slice(-1);

    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);
    setError("");

    // Auto-focus next field
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when complete
    if (digit && index === 5) {
      const fullCode = newCode.join("");
      if (fullCode.length === 6) {
        verifyCode(fullCode);
      }
    }
  };

  // Handle Backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle Paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (pasted.length === 6) {
      const newCode = pasted.split("");
      setCode(newCode);
      verifyCode(pasted);
    }
  };

  // Verify Code
  const verifyCode = async (codeStr: string) => {
    setLoading(true);
    setError("");

    try {
      // Trigger polling first
      await fetch("/api/telegram/bot").catch(() => {});

      const res = await fetch("/api/telegram/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeStr }),
      });

      const data = await res.json();

      if (data.success) {
        // Update auth context
        login({
          id: data.user.id,
          name: data.user.firstName || data.user.name,
          username: data.user.username,
          accessCode: data.user.accessCode,
        });
        setUserData({
          name: data.user.firstName || data.user.name,
          username: data.user.username,
          accessCode: data.user.accessCode,
        });
        setStep("success");
        if (pollingRef.current) clearInterval(pollingRef.current);
      } else {
        setError(data.error || t("invalidCode"));
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError(t("connectionError"));
    } finally {
      setLoading(false);
    }
  };

  // Open Telegram
  const openTelegram = () => {
    window.open(`https://t.me/${TELEGRAM_BOT}`, "_blank");
    setTimeout(() => setStep("code"), 300);
  };

  return (
    <div className="min-h-screen bg-[#030308] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link href="/">
            <Image
              src="/brand/logo-primary-dark.png"
              alt="AgentFlow"
              width={180}
              height={45}
              className="h-10 w-auto mx-auto"
            />
          </Link>
        </motion.div>

        {/* Card */}
        <motion.div
          className="bg-gradient-to-b from-white/[0.08] to-white/[0.02] rounded-3xl border border-white/[0.1] p-8 shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {/* ══════════════════════════════════════════════════════════ */}
          {/*                         START                             */}
          {/* ══════════════════════════════════════════════════════════ */}
          {step === "start" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Icon */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#0088cc] to-[#0066aa] flex items-center justify-center shadow-lg shadow-[#0088cc]/30">
                  <svg
                    className="w-10 h-10 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.121.099.154.232.17.325.015.093.034.305.019.471z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">{t("title")}</h1>
                <p className="text-white/50">{t("subtitle")}</p>
              </div>

              {/* Button */}
              <motion.button
                onClick={openTelegram}
                className="w-full py-4 bg-gradient-to-r from-[#0088cc] to-[#0077b5] text-white font-semibold rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-[#0088cc]/30"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.121.099.154.232.17.325.015.093.034.305.019.471z" />
                </svg>
                {t("openTelegram")}
              </motion.button>

              {/* Already have code */}
              <button
                onClick={() => setStep("code")}
                className="w-full mt-4 py-3 text-white/50 text-sm hover:text-white/70 transition-colors"
              >
                {t("haveCode")}
              </button>

              {/* Steps */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-white/30 text-xs uppercase tracking-wider mb-4 text-center">
                  {t("howItWorks")}
                </p>
                <div className="space-y-3">
                  {[t("steps.1"), t("steps.2"), t("steps.3")].map((text, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#0088cc]/20 flex items-center justify-center text-[#0088cc] text-xs font-bold">
                        {i + 1}
                      </div>
                      <span className="text-white/50 text-sm">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/*                         CODE                              */}
          {/* ══════════════════════════════════════════════════════════ */}
          {step === "code" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Icon */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#0088cc] to-[#0066aa] flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {t("enterCode")}
                </h2>
                <p className="text-white/50 text-sm">
                  {t("codeDescription")}
                </p>
              </div>

              {/* Code Inputs */}
              <div
                className="flex justify-center gap-2 mb-6"
                onPaste={handlePaste}
              >
                {code.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      inputRefs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeInput(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    disabled={loading}
                    className="w-12 h-14 text-center text-2xl font-bold bg-white/[0.05] border-2 border-white/[0.1] rounded-xl text-white focus:border-[#0088cc] focus:outline-none focus:ring-2 focus:ring-[#0088cc]/30 transition-all disabled:opacity-50"
                  />
                ))}
              </div>

              {/* Error */}
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm text-center mb-4"
                >
                  {error}
                </motion.p>
              )}

              {/* Loading */}
              {loading && (
                <div className="flex items-center justify-center gap-2 text-white/50 mb-4">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>{t("checking")}</span>
                </div>
              )}

              {/* Request new code */}
              <div className="text-center">
                <p className="text-white/40 text-sm mb-3">
                  {t("noCode")}
                </p>
                <motion.a
                  href={`https://t.me/${TELEGRAM_BOT}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#0088cc]/20 border border-[#0088cc]/30 rounded-xl text-[#0088cc] text-sm hover:bg-[#0088cc]/30 transition-all"
                  whileHover={{ scale: 1.02 }}
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.121.099.154.232.17.325.015.093.034.305.019.471z" />
                  </svg>
                  {t("requestNewCode")}
                </motion.a>
              </div>

              {/* Back */}
              <button
                onClick={() => {
                  setStep("start");
                  setCode(["", "", "", "", "", ""]);
                  setError("");
                }}
                className="block mx-auto mt-6 text-sm text-white/40 hover:text-white/60 transition-colors"
              >
                ← {t("back")}
              </button>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/*                        SUCCESS                            */}
          {/* ══════════════════════════════════════════════════════════ */}
          {step === "success" && userData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              {/* Success Icon */}
              <motion.div
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
              >
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>

              <h2 className="text-2xl font-bold text-white mb-2">
                {t("welcome")}, {userData.name}!
              </h2>
              <p className="text-white/50 text-sm mb-1">{t("loggedInAs")}</p>
              <p className="text-[#0088cc] font-medium mb-6">
                @{userData.username}
              </p>

              {/* Portal Access Code */}
              {userData.accessCode && (
                <div className="bg-white/[0.05] rounded-xl p-4 mb-6 border border-white/[0.1]">
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-2">
                    {t("portalAccessCode")}
                  </p>
                  <p className="text-xl font-mono font-bold text-white tracking-wider">
                    {userData.accessCode}
                  </p>
                  <p className="text-white/40 text-xs mt-2">
                    {t("forCustomerPortal")}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3">
                <motion.a
                  href={PORTAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3.5 bg-gradient-to-r from-[#FC682C] to-[#e55a1f] text-white font-semibold rounded-xl text-center shadow-lg shadow-[#FC682C]/20"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {t("toCustomerPortal")}
                </motion.a>
                <Link
                  href="/"
                  className="block w-full py-3.5 bg-white/[0.05] border border-white/[0.1] text-white font-medium rounded-xl text-center hover:bg-white/[0.1] transition-all"
                >
                  {t("toHomepage")}
                </Link>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Footer */}
        <motion.div
          className="text-center mt-6 space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-white/30 text-sm">
            {t("noTelegram")}{" "}
            <a
              href="https://telegram.org/apps"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0088cc] hover:underline"
            >
              {t("getTelegram")}
            </a>
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white/60 text-sm transition-colors"
          >
            <svg
              className="w-4 h-4 rtl:rotate-180"
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
            {t("backToHomepage")}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
