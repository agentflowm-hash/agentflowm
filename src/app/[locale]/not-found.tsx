"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <section className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-xl">
        <h1 className="text-8xl md:text-9xl font-bold text-[var(--color-accent)] mb-4">
          {t("heading")}
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-[var(--color-text)] mb-4">
          {t("title")}
        </h2>
        <p className="text-[var(--color-text-muted)] mb-8 text-lg">
          {t("message")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 rounded-lg bg-[var(--color-accent)] text-white font-medium hover:opacity-90 transition-opacity"
          >
            {t("backHome")}
          </Link>
          <Link
            href="/kontakt"
            className="px-6 py-3 rounded-lg border border-[var(--color-border)] text-[var(--color-text)] font-medium hover:bg-[var(--color-surface)] transition-colors"
          >
            {t("contact")}
          </Link>
        </div>
      </div>
    </section>
  );
}
