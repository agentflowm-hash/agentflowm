'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

// Package color
const packageColor = '#FFB347';

// ===============================================================
//                    ANIMATED BACKGROUND
// ===============================================================

function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#FFB347]/20 to-transparent blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-[20%] left-[5%] w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[#FFB347]/10 to-transparent blur-[100px] animate-float-slow" />
    </div>
  );
}

// ===============================================================
//                    COMPONENTS
// ===============================================================

function PageHero({ t }: { t: (key: string) => string }) {
  const [isVisible, setIsVisible] = useState(false);

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
            {t('hero.breadcrumb')}
          </Link>
          <span>/</span>
          <span style={{ color: packageColor }}>One Page</span>
        </div>

        <div className="max-w-4xl">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-3 px-4 py-2 rounded-full mb-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{
              background: `${packageColor}15`,
              border: `1px solid ${packageColor}30`,
            }}
          >
            <span className="text-2xl">🚀</span>
            <span className="font-semibold" style={{ color: packageColor }}>
              {t('hero.badge')}
            </span>
          </div>

          {/* Headline */}
          <h1
            className={`text-h1 font-bold mb-6 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            {t('hero.tagline')}
          </h1>

          {/* Description */}
          <p
            className={`text-xl text-[var(--color-text-muted)] mb-8 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            {t('hero.description')}
          </p>

          {/* Price & CTA */}
          <div
            className={`flex flex-wrap items-center gap-6 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold" style={{ color: packageColor }}>
                  {t('hero.price')}
                </span>
                <span className="text-xl text-[var(--color-text-muted)]">€</span>
              </div>
              <p className="text-sm text-[var(--color-text-muted)]">{t('hero.billing')}</p>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="primary" href="/termin">
                {t('hero.ctaPrimary')}
              </Button>
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
                {t('hero.timeline')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection({ t }: { t: (key: string) => string }) {
  const featureIcons: Record<string, string> = {
    page: '📄',
    phone: '📞',
    search: '🔍',
    mobile: '📱',
    lightning: '⚡',
    lock: '🔒',
  };

  return (
    <section className="section bg-[var(--color-surface)]">
      <div className="container">
        <h2 className="text-h2 font-bold text-center mb-4">{t('features.title')}</h2>
        <p className="text-center text-[var(--color-text-muted)] mb-12 max-w-2xl mx-auto">
          {t('features.subtitle')}
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] hover:border-[#FFB347]/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                style={{
                  background: `${packageColor}15`,
                  border: `1px solid ${packageColor}25`,
                }}
              >
                {featureIcons[t(`features.items.${i}.icon`)] || '📄'}
              </div>
              <h3 className="font-semibold mb-2">{t(`features.items.${i}.title`)}</h3>
              <p className="text-sm text-[var(--color-text-muted)]">{t(`features.items.${i}.desc`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function IdealForSection({ t }: { t: (key: string) => string }) {
  return (
    <section className="section">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-h2 font-bold mb-4">{t('idealFor.title')}</h2>
              <p className="text-[var(--color-text-muted)] mb-6">
                {t('idealFor.description')}
              </p>
              <ul className="space-y-3">
                {[0, 1, 2, 3, 4].map((i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ background: packageColor }}
                    >
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>{t(`idealFor.items.${i}`)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="p-8 rounded-2xl"
              style={{
                background: `linear-gradient(135deg, ${packageColor}10 0%, transparent 100%)`,
                border: `1px solid ${packageColor}20`,
              }}
            >
              <h3 className="font-semibold mb-4">{t('idealFor.notIncluded.title')}</h3>
              <ul className="space-y-2">
                {[0, 1, 2, 3].map((i) => (
                  <li key={i} className="flex items-center gap-3 text-[var(--color-text-muted)]">
                    <span className="text-[var(--color-text-muted)]">—</span>
                    <span>{t(`idealFor.notIncluded.items.${i}`)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-6 border-t border-[var(--color-border)]">
                <p className="text-sm text-[var(--color-text-muted)]">
                  {t('idealFor.notIncluded.needMore')}{' '}
                  <Link href="/pakete/business" className="text-[#FC682C] hover:underline">
                    {t('idealFor.notIncluded.businessPackage')}
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessSection({ t }: { t: (key: string) => string }) {
  const timeline = t('hero.timeline');

  return (
    <section className="section bg-[var(--color-surface)]">
      <div className="container">
        <h2 className="text-h2 font-bold text-center mb-4">{t('process.title')}</h2>
        <p className="text-center text-[var(--color-text-muted)] mb-12">
          {t('process.subtitle').replace('{timeline}', timeline)}
        </p>

        <div className="max-w-3xl mx-auto">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-6 mb-8 last:mb-0">
              <div className="flex flex-col items-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ background: packageColor }}
                >
                  {i + 1}
                </div>
                {i < 4 && (
                  <div
                    className="w-0.5 flex-1 mt-2"
                    style={{ background: `${packageColor}30` }}
                  />
                )}
              </div>
              <div className="flex-1 pb-8">
                <h3 className="font-semibold mb-1">{t(`process.steps.${i}.title`)}</h3>
                <p className="text-sm text-[var(--color-text-muted)]">{t(`process.steps.${i}.desc`)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CompareSection({ t }: { t: (key: string) => string }) {
  return (
    <section className="section">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-h2 font-bold mb-4">{t('compare.title')}</h2>
          <p className="text-[var(--color-text-muted)] mb-8">
            {t('compare.description')}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/pakete/business"
              className="px-6 py-3 rounded-xl bg-[#FC682C]/10 border border-[#FC682C]/20 hover:border-[#FC682C]/50 transition-all duration-300"
            >
              <span className="text-[#FC682C] font-semibold">{t('compare.businessPackage')} →</span>
            </Link>
            <Link
              href="/pakete/growth"
              className="px-6 py-3 rounded-xl bg-[#9D65C9]/10 border border-[#9D65C9]/20 hover:border-[#9D65C9]/50 transition-all duration-300"
            >
              <span className="text-[#9D65C9] font-semibold">{t('compare.growthPackage')} →</span>
            </Link>
            <Link
              href="/pakete"
              className="px-6 py-3 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transition-all duration-300"
            >
              <span className="font-semibold">{t('compare.allPackages')} →</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCTASection({ t }: { t: (key: string) => string }) {
  return (
    <section className="section px-4 sm:px-6">
      <div className="container">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[var(--color-accent)] via-[var(--color-accent2)] to-[var(--color-accent3)] p-6 sm:p-8 md:p-12 lg:p-16">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          <div className="relative z-10 text-center text-white">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">
              {t('finalCta.headline')}
            </h2>
            <p className="text-sm sm:text-base md:text-lg opacity-90 mb-6 sm:mb-8 max-w-xl mx-auto">
              {t('finalCta.subheadline')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                size="lg"
                href="/pakete"
                className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-[var(--color-accent)]"
              >
                {t('compare.allPackages')}
              </Button>
              <Button
                variant="outline"
                size="lg"
                href="/termin"
                className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-[var(--color-accent)]"
              >
                {t('hero.ctaPrimary')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===============================================================
//                    MAIN PAGE
// ===============================================================

export default function OnePagePackagePage() {
  const t = useTranslations("pages.pakete.onePage");

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
      <IdealForSection t={t} />
      <ProcessSection t={t} />
      <CompareSection t={t} />
      <FinalCTASection t={t} />
    </>
  );
}
