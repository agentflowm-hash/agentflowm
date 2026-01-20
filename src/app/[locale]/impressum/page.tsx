"use client";

import { useTranslations } from "next-intl";

export default function ImpressumPage() {
  const t = useTranslations("pages.impressum");

  return (
    <section className="pt-32 pb-16">
      <div className="container">
        <div className="max-w-3xl mx-auto prose prose-lg prose-invert">
          <h1>{t("title")}</h1>

          <h2>{t("infoTitle")}</h2>
          <p>
            {t("company")}
            <br />
            {t("address")}
            <br />
            {t("zip")}
            <br />
            {t("country")}
          </p>

          <h2>{t("contactTitle")}</h2>
          <p>
            {t("phone")}
            <br />
            {t("email")}
          </p>

          <h2>{t("responsibleTitle")}</h2>
          <p>
            {t("responsibleName")}
            <br />
            {t("address")}
            <br />
            {t("zip")}
          </p>

          <h2>{t("euDisputeTitle")}</h2>
          <p>
            {t("euDisputeText")}{" "}
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener nofollow"
              className="text-[var(--color-accent)] hover:underline"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
          </p>
          <p>{t("euDisputeNote")}</p>

          <h2>{t("consumerDisputeTitle")}</h2>
          <p>{t("consumerDisputeText")}</p>

          <h2>{t("liabilityContentTitle")}</h2>
          <p>{t("liabilityContentText")}</p>

          <h2>{t("liabilityLinksTitle")}</h2>
          <p>{t("liabilityLinksText")}</p>

          <h2>{t("copyrightTitle")}</h2>
          <p>{t("copyrightText")}</p>
        </div>
      </div>
    </section>
  );
}
