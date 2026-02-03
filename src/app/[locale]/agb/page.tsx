"use client";

import { useTranslations } from "next-intl";

export default function AGBPage() {
  const t = useTranslations("pages.agb");

  return (
    <section className="pt-32 pb-16">
      <div className="container">
        <div className="max-w-3xl mx-auto prose prose-lg prose-invert">
          <h1>{t("title")}</h1>
          
          <p className="text-white/70">{t("lastUpdated")}</p>

          <h2>{t("scope.title")}</h2>
          <p>{t("scope.text")}</p>

          <h2>{t("services.title")}</h2>
          <p>{t("services.text")}</p>

          <h2>{t("contract.title")}</h2>
          <p>{t("contract.text")}</p>

          <h2>{t("prices.title")}</h2>
          <p>{t("prices.text")}</p>

          <h2>{t("payment.title")}</h2>
          <p>{t("payment.text")}</p>

          <h2>{t("delivery.title")}</h2>
          <p>{t("delivery.text")}</p>

          <h2>{t("warranty.title")}</h2>
          <p>{t("warranty.text")}</p>

          <h2>{t("liability.title")}</h2>
          <p>{t("liability.text")}</p>

          <h2>{t("ip.title")}</h2>
          <p>{t("ip.text")}</p>

          <h2>{t("confidentiality.title")}</h2>
          <p>{t("confidentiality.text")}</p>

          <h2>{t("termination.title")}</h2>
          <p>{t("termination.text")}</p>

          <h2>{t("finalProvisions.title")}</h2>
          <p>{t("finalProvisions.text")}</p>
        </div>
      </div>
    </section>
  );
}
