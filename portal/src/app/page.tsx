"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const MAIN_WEBSITE_URL =
  process.env.NEXT_PUBLIC_MAIN_URL || "https://agentflowm.com";

// ═══════════════════════════════════════════════════════════════
//         PORTAL ROOT - Redirect to main website
// Kein öffentlicher Zugang - nur mit Zugangscode erreichbar
// ═══════════════════════════════════════════════════════════════

export default function PortalRoot() {
  const router = useRouter();

  useEffect(() => {
    // Check if already logged in
    fetch("/api/project", { credentials: "include" })
      .then((res) => {
        if (res.ok) {
          // Already logged in - go to dashboard
          router.push("/dashboard");
        } else {
          // Not logged in - redirect to main website
          window.location.href = MAIN_WEBSITE_URL;
        }
      })
      .catch(() => {
        window.location.href = MAIN_WEBSITE_URL;
      });
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b]">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-[#FC682C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/40 text-sm">Weiterleitung...</p>
      </div>
    </div>
  );
}
