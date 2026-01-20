"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

function CheckoutSuccessContent() {
  const t = useTranslations("pages.checkout.success");
  const searchParams = useSearchParams();
  const packageName = searchParams.get("package") || t("defaultPackage");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-[#FC682C] border-t-transparent rounded-full animate-spin" />
            <p className="text-white/60">{t("loading")}</p>
          </div>
        ) : (
          <>
            {/* Success Icon */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {t("title")}
            </h1>

            <p className="text-white/60 mb-8">
              {t("description", { packageName: "" })}
              <span className="text-[#FC682C] font-medium">{packageName}</span>
              {"."}
            </p>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                <h3 className="text-sm font-medium text-white mb-2">
                  {t("whatHappensNow")}
                </h3>
                <ul className="text-sm text-white/50 text-left space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-[#FC682C]">1.</span>
                    {t("step1")}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FC682C]">2.</span>
                    {t("step2")}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FC682C]">3.</span>
                    {t("step3")}
                  </li>
                </ul>
              </div>

              <Link
                href="/"
                className="inline-block w-full py-3 bg-[#FC682C] text-white font-medium rounded-lg hover:bg-[#e55a1f] transition-colors"
              >
                {t("backToHome")}
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#080808] flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-[#FC682C] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
