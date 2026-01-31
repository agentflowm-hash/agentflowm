"use client";

import { useTranslations } from "next-intl";

export default function DatenschutzPage() {
  const t = useTranslations("pages.datenschutz");

  return (
    <section className="pt-32 pb-16">
      <div className="container">
        <div className="max-w-3xl mx-auto prose prose-lg prose-invert">
          <h1>{t("title")}</h1>

          <h2>{t("section1Title")}</h2>

          <h3>{t("generalInfoTitle")}</h3>
          <p>{t("generalInfoText")}</p>

          <h3>{t("dataCollectionTitle")}</h3>
          <p>
            <strong>{t("dataCollectionQuestion")}</strong>
            <br />
            {t("dataCollectionAnswer")}
          </p>

          <h2>{t("section2Title")}</h2>
          <p>{t("hostingIntro")}</p>

          <h3>{t("externalHostingTitle")}</h3>
          <p>{t("externalHostingText")}</p>

          <h2>{t("section3Title")}</h2>

          <h3>{t("privacyTitle")}</h3>
          <p>{t("privacyText")}</p>

          <h3>{t("responsiblePartyTitle")}</h3>
          <p>{t("responsiblePartyIntro")}</p>
          <p>
            AgentFlowMarketing
            <br />
            Achillesstraße 69A
            <br />
            13125 Berlin
            <br />
            E-Mail: kontakt@agentflowm.com
          </p>

          <h2>{t("section4Title")}</h2>

          <h3>{t("contactFormTitle")}</h3>
          <p>{t("contactFormText")}</p>

          <h3>{t("inquiryTitle")}</h3>
          <p>{t("inquiryText")}</p>

          <h2>{t("section5Title")}</h2>
          <p>{t("newsletterText")}</p>

          <h2>{t("section6Title")}</h2>
          <p>{t("rightsText")}</p>

          <p className="text-sm text-[var(--color-text-muted)] mt-8">
            {t("lastUpdated")}
          </p>
        </div>
      </div>
    </section>
  );
}
