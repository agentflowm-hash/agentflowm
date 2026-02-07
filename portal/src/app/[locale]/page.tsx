"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

// ═══════════════════════════════════════════════════════════════
//         PORTAL ROOT - Redirect to login or dashboard
// ═══════════════════════════════════════════════════════════════

export default function PortalRoot() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("redirect");

  // Build locale-aware paths (.de = no prefix, .com = /en or /ar prefix)
  const dashboardPath = locale === "de" ? "/dashboard" : `/${locale}/dashboard`;
  const loginPath = locale === "de" ? "/login" : `/${locale}/login`;

  useEffect(() => {
    // Check if already logged in
    fetch("/api/project", { credentials: "include" })
      .then((res) => {
        if (res.ok) {
          // Already logged in - go to dashboard
          router.push(dashboardPath);
        } else {
          // Not logged in - go to login page
          router.push(loginPath);
        }
      })
      .catch(() => {
        router.push(loginPath);
      });
  }, [router, dashboardPath, loginPath]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b]">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-[#FC682C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/40 text-sm">{t("redirecting")}</p>
      </div>
    </div>
  );
}
