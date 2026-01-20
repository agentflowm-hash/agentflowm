'use client';

import { useEffect, useState } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui';
import { CTASection } from '@/components/sections';

// ═══════════════════════════════════════════════════════════════
//                    ANIMATED BACKGROUND
// ═══════════════════════════════════════════════════════════════

function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-[5%] right-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#9D65C9]/20 to-transparent blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-[15%] left-[5%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#9D65C9]/15 to-transparent blur-[100px] animate-float-slow" />
      <div className="absolute top-[40%] left-[30%] w-[400px] h-[400px] rounded-full bg-gradient-to-bl from-[#FC682C]/10 to-transparent blur-[90px] animate-pulse-slow" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    COMPONENTS
// ═══════════════════════════════════════════════════════════════

function PageHero({ t }: { t: (key: string) => string }) {
  const [isVisible, setIsVisible] = useState(false);
  const packageColor = '#9D65C9';

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative pt-32 pb-16 overflow-hidden">
      <AnimatedBackground />

      <div className="container relative z-10">
        {/* Breadcrumb */}
        <div className={`flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-8 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <Link href="/pakete" className="hover:text-[var(--color-accent)] transition-colors">
            {t("backLink")}
          </Link>
          <span>/</span>
          <span style={{ color: packageColor }}>{t("name")}</span>
        </div>

        <div className="max-w-4xl">
          {/* Badge */}
          <div className={`flex items-center gap-3 mb-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full"
              style={{
                background: `${packageColor}15`,
                border: `1px solid ${packageColor}30`,
              }}
            >
              <span className="text-2xl">{"\uD83D\uDC8E"}</span>
              <span className="font-semibold" style={{ color: packageColor }}>
                {t("name")}
              </span>
            </div>
            <span
              className="px-3 py-1 rounded-full text-xs font-bold text-white"
              style={{ background: `linear-gradient(135deg, ${packageColor} 0%, #7C3AED 100%)` }}
            >
              {t("badge")}
            </span>
          </div>

          {/* Headline */}
          <h1
            className={`text-h1 font-bold mb-6 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            {t("tagline")}
          </h1>

          {/* Description */}
          <p
            className={`text-xl text-[var(--color-text-muted)] mb-8 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            {t("description")}
          </p>

          {/* Price & CTA */}
          <div
            className={`flex flex-wrap items-center gap-6 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold" style={{ color: packageColor }}>
                  {t("price")}
                </span>
                <span className="text-xl text-[var(--color-text-muted)]">{"\u20AC"}</span>
              </div>
              <p className="text-sm text-[var(--color-text-muted)]">{t("priceUnit")}</p>
            </div>

            <div className="flex items-center gap-4">
              <button
                className="px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: `linear-gradient(135deg, ${packageColor} 0%, #7C3AED 100%)`,
                  boxShadow: `0 4px 20px ${packageColor}40`,
                }}
                onClick={() => window.location.href = '/termin'}
              >
                {t("ctaPrimary")}
              </button>
              <span
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm"
                style={{
                  background: `${packageColor}15`,
                  color: packageColor,
                }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t("timeline")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection({ t }: { t: (key: string) => string }) {
  const packageColor = '#9D65C9';
  const featureIcons: Record<string, string> = {
    pages: "\uD83D\uDCD1",
    robot: "\uD83E\uDD16",
    target: "\uD83C\uDFAF",
    zap: "\u26A1",
    book: "\uD83D\uDCDA",
    chart: "\uD83D\uDCC8",
    tool: "\uD83D\uDD27",
    star: "\u2728",
  };

  const features = [
    { titleKey: "features.0.title", descKey: "features.0.desc", icon: "pages", highlight: false },
    { titleKey: "features.1.title", descKey: "features.1.desc", icon: "robot", highlight: false },
    { titleKey: "features.2.title", descKey: "features.2.desc", icon: "target", highlight: true },
    { titleKey: "features.3.title", descKey: "features.3.desc", icon: "zap", highlight: true },
    { titleKey: "features.4.title", descKey: "features.4.desc", icon: "book", highlight: false },
    { titleKey: "features.5.title", descKey: "features.5.desc", icon: "chart", highlight: true },
    { titleKey: "features.6.title", descKey: "features.6.desc", icon: "tool", highlight: false },
    { titleKey: "features.7.title", descKey: "features.7.desc", icon: "star", highlight: false },
  ];

  return (
    <section className="section bg-[var(--color-surface)]">
      <div className="container">
        <h2 className="text-h2 font-bold text-center mb-4">{t("featuresTitle")}</h2>
        <p className="text-center text-[var(--color-text-muted)] mb-12 max-w-2xl mx-auto">
          {t("featuresSubtitle")}
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {features.map((feature, i) => (
            <div
              key={i}
              className={`p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${feature.highlight ? 'bg-gradient-to-br from-[#9D65C9]/10 to-transparent' : 'bg-[var(--color-surface-elevated)]'}`}
              style={{
                borderColor: feature.highlight ? `${packageColor}40` : 'var(--color-border)',
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3"
                style={{
                  background: feature.highlight ? packageColor : `${packageColor}15`,
                  color: feature.highlight ? 'white' : undefined,
                }}
              >
                {featureIcons[feature.icon]}
              </div>
              <h3 className="font-semibold mb-1 text-sm">
                {t(feature.titleKey)}
                {feature.highlight && (
                  <span className="ml-2 px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-[#9D65C9]/20 text-[#9D65C9]">
                    {t("exclusive")}
                  </span>
                )}
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">{t(feature.descKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LeadsAgentSection({ t }: { t: (key: string) => string }) {
  const packageColor = '#9D65C9';
  const stepIcons: Record<string, string> = {
    inbox: "\uD83D\uDCE5",
    tag: "\uD83C\uDFF7\uFE0F",
    list: "\uD83D\uDCCB",
    clock: "\u23F0",
    trending: "\uD83D\uDCC8",
  };

  const steps = [
    { icon: "inbox", titleKey: "leadsAgentSteps.0.title", descKey: "leadsAgentSteps.0.desc" },
    { icon: "tag", titleKey: "leadsAgentSteps.1.title", descKey: "leadsAgentSteps.1.desc" },
    { icon: "list", titleKey: "leadsAgentSteps.2.title", descKey: "leadsAgentSteps.2.desc" },
    { icon: "clock", titleKey: "leadsAgentSteps.3.title", descKey: "leadsAgentSteps.3.desc" },
    { icon: "trending", titleKey: "leadsAgentSteps.4.title", descKey: "leadsAgentSteps.4.desc" },
  ];

  const benefitKeys = ["leadsAgentBenefits.0", "leadsAgentBenefits.1", "leadsAgentBenefits.2", "leadsAgentBenefits.3"];

  return (
    <section className="section">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span
              className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-4"
              style={{ background: `${packageColor}15`, color: packageColor }}
            >
              {"\uD83C\uDFAF"} {t("exclusive")}
            </span>
            <h2 className="text-h2 font-bold mb-4">{t("leadsAgentTitle")}</h2>
            <p className="text-[var(--color-text-muted)]">
              {t("leadsAgentSubtitle")}
            </p>
          </div>

          <div
            className="p-8 rounded-2xl mb-8"
            style={{
              background: `linear-gradient(135deg, ${packageColor}08 0%, transparent 50%, ${packageColor}05 100%)`,
              border: `1px solid ${packageColor}20`,
            }}
          >
            <div className="grid md:grid-cols-5 gap-4 mb-8">
              {steps.map((step, i) => (
                <div key={i} className="text-center relative">
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-[#9D65C9]/30 to-[#9D65C9]/10" />
                  )}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3 relative z-10"
                    style={{
                      background: `${packageColor}15`,
                      border: `1px solid ${packageColor}25`,
                    }}
                  >
                    {stepIcons[step.icon]}
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{t(step.titleKey)}</h4>
                  <p className="text-xs text-[var(--color-text-muted)]">{t(step.descKey)}</p>
                </div>
              ))}
            </div>

            {/* Benefits */}
            <div className="border-t border-[var(--color-border)] pt-6">
              <h4 className="font-semibold text-center mb-4">{t("leadsAgentBenefitsTitle")}</h4>
              <div className="grid md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                {benefitKeys.map((key, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: packageColor }}
                    >
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm">{t(key)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ComparisonSection({ t }: { t: (key: string) => string }) {
  const comparisonKeys = [
    { featureKey: "comparison.0.feature", businessKey: "comparison.0.business", growthKey: "comparison.0.growth" },
    { featureKey: "comparison.1.feature", businessKey: "comparison.1.business", growthKey: "comparison.1.growth" },
    { featureKey: "comparison.2.feature", businessKey: "comparison.2.business", growthKey: "comparison.2.growth" },
    { featureKey: "comparison.3.feature", businessKey: "comparison.3.business", growthKey: "comparison.3.growth" },
    { featureKey: "comparison.4.feature", businessKey: "comparison.4.business", growthKey: "comparison.4.growth" },
    { featureKey: "comparison.5.feature", businessKey: "comparison.5.business", growthKey: "comparison.5.growth" },
  ];

  return (
    <section className="section bg-[var(--color-surface)]">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-h2 font-bold text-center mb-8">{t("comparisonTitle")}</h2>

          <div className="rounded-2xl border border-[var(--color-border)] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[var(--color-surface-elevated)]">
                  <th className="text-left p-4 font-medium">Feature</th>
                  <th className="p-4 text-center font-medium text-[#FC682C]">Business</th>
                  <th className="p-4 text-center font-medium text-[#9D65C9]">Growth</th>
                </tr>
              </thead>
              <tbody>
                {comparisonKeys.map((item, i) => {
                  const businessValue = t(item.businessKey);
                  const growthValue = t(item.growthKey);
                  return (
                    <tr key={i} className="border-t border-[var(--color-border)]">
                      <td className="p-4 text-sm">{t(item.featureKey)}</td>
                      <td className="p-4 text-center text-sm">
                        {businessValue === 'yes' ? (
                          <span className="inline-flex w-5 h-5 rounded-full bg-[var(--color-success)] items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                        ) : businessValue === 'no' ? (
                          <span className="text-[var(--color-text-muted)]">{"\u2014"}</span>
                        ) : (
                          businessValue
                        )}
                      </td>
                      <td className="p-4 text-center text-sm bg-[#9D65C9]/5">
                        {growthValue === 'yes' ? (
                          <span className="inline-flex w-5 h-5 rounded-full bg-[#9D65C9] items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                        ) : (
                          <span className="font-medium">{growthValue}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

function IdealForSection({ t }: { t: (key: string) => string }) {
  const packageColor = '#9D65C9';
  const idealForKeys = ["idealFor.0", "idealFor.1", "idealFor.2", "idealFor.3", "idealFor.4"];

  return (
    <section className="section">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-h2 font-bold text-center mb-8">{t("idealForTitle")}</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {idealForKeys.map((key, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-4 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)]"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: packageColor }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm">{t(key)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessSection({ t }: { t: (key: string) => string }) {
  const packageColor = '#9D65C9';
  const processSteps = [
    { stepKey: "process.0.step", titleKey: "process.0.title", descKey: "process.0.desc" },
    { stepKey: "process.1.step", titleKey: "process.1.title", descKey: "process.1.desc" },
    { stepKey: "process.2.step", titleKey: "process.2.title", descKey: "process.2.desc" },
    { stepKey: "process.3.step", titleKey: "process.3.title", descKey: "process.3.desc" },
    { stepKey: "process.4.step", titleKey: "process.4.title", descKey: "process.4.desc" },
    { stepKey: "process.5.step", titleKey: "process.5.title", descKey: "process.5.desc" },
    { stepKey: "process.6.step", titleKey: "process.6.title", descKey: "process.6.desc" },
    { stepKey: "process.7.step", titleKey: "process.7.title", descKey: "process.7.desc" },
  ];

  return (
    <section className="section bg-[var(--color-surface)]">
      <div className="container">
        <h2 className="text-h2 font-bold text-center mb-4">{t("processTitle")}</h2>
        <p className="text-center text-[var(--color-text-muted)] mb-12">
          {t("processSubtitle")}
        </p>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-x-12 gap-y-6">
          {processSteps.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ background: packageColor }}
              >
                {i + 1}
              </div>
              <div>
                <h3 className="font-semibold mb-1">{t(step.titleKey)}</h3>
                <p className="text-sm text-[var(--color-text-muted)]">{t(step.descKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OtherPackagesSection({ t }: { t: (key: string) => string }) {
  return (
    <section className="section">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-h2 font-bold mb-4">{t("otherPackagesTitle")}</h2>
          <p className="text-[var(--color-text-muted)] mb-8">
            {t("otherPackagesSubtitle")}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/pakete/one-page"
              className="px-6 py-3 rounded-xl bg-[#FFB347]/10 border border-[#FFB347]/20 hover:border-[#FFB347]/50 transition-all duration-300"
            >
              <span className="text-[#FFB347] font-semibold">{"\u2190"} {t("otherPackageOnePage")}{"\u20AC"}</span>
            </Link>
            <Link
              href="/pakete/business"
              className="px-6 py-3 rounded-xl bg-[#FC682C]/10 border border-[#FC682C]/20 hover:border-[#FC682C]/50 transition-all duration-300"
            >
              <span className="text-[#FC682C] font-semibold">{"\u2190"} {t("otherPackageBusiness")}{"\u20AC"}</span>
            </Link>
            <Link
              href="/pakete"
              className="px-6 py-3 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transition-all duration-300"
            >
              <span className="font-semibold">{t("otherPackageCompare")} {"\u2192"}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    MAIN PAGE
// ═══════════════════════════════════════════════════════════════

export default function GrowthPackagePage() {
  const t = useTranslations("pages.pakete.growth");

  return (
    <>
      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.3; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
      `}</style>

      <PageHero t={t} />
      <FeaturesSection t={t} />
      <LeadsAgentSection t={t} />
      <ComparisonSection t={t} />
      <IdealForSection t={t} />
      <ProcessSection t={t} />
      <OtherPackagesSection t={t} />

      <CTASection
        headline={t("finalCtaTitle")}
        subheadline={t("finalCtaSubtitle")}
      />
    </>
  );
}
