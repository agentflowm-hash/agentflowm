'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui';
import { CTASection } from '@/components/sections';
import Link from 'next/link';

// ═══════════════════════════════════════════════════════════════
//                    ANIMATED BACKGROUND
// ═══════════════════════════════════════════════════════════════

function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#FFB347]/20 to-transparent blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-[20%] left-[5%] w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[#FFB347]/10 to-transparent blur-[100px] animate-float-slow" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    PACKAGE DATA
// ═══════════════════════════════════════════════════════════════

const packageData = {
  name: 'One Page',
  icon: '🚀',
  color: '#FFB347',
  price: 'ab 1.390',
  billing: 'einmalig',
  timeline: '1-2 Wochen',
  tagline: 'Der perfekte Start für Ihren professionellen Webauftritt',
  description: 'Eine Seite, die alles sagt. Klar strukturiert, perfekt optimiert und auf den Punkt gebracht. Ideal für Freelancer, kleine Unternehmen oder als Landingpage für ein spezifisches Angebot.',
  
  idealFor: [
    'Freelancer & Selbstständige',
    'Kleine Unternehmen',
    'Neue Projekte & Startups',
    'Spezifische Landingpages',
    'Portfolios & Visitenkarten',
  ],
  
  features: [
    {
      title: 'One Page Website',
      desc: 'Eine durchdachte Seite mit allen wichtigen Sektionen: Hero, Leistungen, Über uns, Kontakt.',
      icon: '📄',
    },
    {
      title: 'Kontaktwege',
      desc: 'Integration von E-Mail, WhatsApp und/oder Terminbuchung - so wie es für Sie passt.',
      icon: '📞',
    },
    {
      title: 'Basis-SEO',
      desc: 'Grundlegende Suchmaschinenoptimierung: Meta-Tags, Struktur, Ladezeit.',
      icon: '🔍',
    },
    {
      title: 'Responsive Design',
      desc: 'Perfekte Darstellung auf Desktop, Tablet und Smartphone.',
      icon: '📱',
    },
    {
      title: 'Performance-Optimierung',
      desc: 'Schnelle Ladezeiten durch optimierte Bilder und sauberen Code.',
      icon: '⚡',
    },
    {
      title: 'SSL-Zertifikat',
      desc: 'Sichere HTTPS-Verbindung für Vertrauen und besseres Ranking.',
      icon: '🔒',
    },
  ],
  
  process: [
    { step: 1, title: 'Kickoff-Gespräch', desc: 'Wir besprechen Ihre Ziele, Zielgruppe und Wünsche.' },
    { step: 2, title: 'Design-Entwurf', desc: 'Sie erhalten einen ersten Designvorschlag zur Abstimmung.' },
    { step: 3, title: 'Entwicklung', desc: 'Umsetzung mit modernen Technologien.' },
    { step: 4, title: 'Feedback & Feinschliff', desc: 'Korrekturschleifen bis Sie zufrieden sind.' },
    { step: 5, title: 'Go-Live', desc: 'Veröffentlichung und kurze Einweisung.' },
  ],
  
  notIncluded: [
    'Publishing-Agent (Workflow-Automation)',
    'Leads-Generator-Agent',
    'Mehrere Unterseiten',
    'CMS-Integration',
  ],
};

// ═══════════════════════════════════════════════════════════════
//                    COMPONENTS
// ═══════════════════════════════════════════════════════════════

function PageHero() {
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
            Pakete
          </Link>
          <span>/</span>
          <span style={{ color: packageData.color }}>{packageData.name}</span>
        </div>

        <div className="max-w-4xl">
          {/* Badge */}
          <div 
            className={`inline-flex items-center gap-3 px-4 py-2 rounded-full mb-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ 
              background: `${packageData.color}15`,
              border: `1px solid ${packageData.color}30`,
            }}
          >
            <span className="text-2xl">{packageData.icon}</span>
            <span className="font-semibold" style={{ color: packageData.color }}>
              {packageData.name}
            </span>
          </div>
          
          {/* Headline */}
          <h1 
            className={`text-h1 font-bold mb-6 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            {packageData.tagline}
          </h1>
          
          {/* Description */}
          <p 
            className={`text-xl text-[var(--color-text-muted)] mb-8 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            {packageData.description}
          </p>

          {/* Price & CTA */}
          <div 
            className={`flex flex-wrap items-center gap-6 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold" style={{ color: packageData.color }}>
                  {packageData.price}
                </span>
                <span className="text-xl text-[var(--color-text-muted)]">€</span>
              </div>
              <p className="text-sm text-[var(--color-text-muted)]">{packageData.billing}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="primary" href="/termin">
                Jetzt starten
              </Button>
              <span 
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm"
                style={{ 
                  background: `${packageData.color}15`,
                  color: packageData.color,
                }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {packageData.timeline}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="section bg-[var(--color-surface)]">
      <div className="container">
        <h2 className="text-h2 font-bold text-center mb-4">Was ist enthalten</h2>
        <p className="text-center text-[var(--color-text-muted)] mb-12 max-w-2xl mx-auto">
          Alles was Sie für einen professionellen Start brauchen
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {packageData.features.map((feature, i) => (
            <div 
              key={i}
              className="p-6 rounded-2xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] hover:border-[#FFB347]/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                style={{ 
                  background: `${packageData.color}15`,
                  border: `1px solid ${packageData.color}25`,
                }}
              >
                {feature.icon}
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-[var(--color-text-muted)]">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function IdealForSection() {
  return (
    <section className="section">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-h2 font-bold mb-4">Ideal für</h2>
              <p className="text-[var(--color-text-muted)] mb-6">
                Das One Page Paket ist perfekt geeignet für alle, die einen klaren, 
                professionellen Webauftritt ohne Schnickschnack wollen.
              </p>
              <ul className="space-y-3">
                {packageData.idealFor.map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ background: packageData.color }}
                    >
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div 
              className="p-8 rounded-2xl"
              style={{ 
                background: `linear-gradient(135deg, ${packageData.color}10 0%, transparent 100%)`,
                border: `1px solid ${packageData.color}20`,
              }}
            >
              <h3 className="font-semibold mb-4">Nicht enthalten (aber erweiterbar):</h3>
              <ul className="space-y-2">
                {packageData.notIncluded.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-[var(--color-text-muted)]">
                    <span className="text-[var(--color-text-muted)]">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-6 border-t border-[var(--color-border)]">
                <p className="text-sm text-[var(--color-text-muted)]">
                  Brauchen Sie mehr? Schauen Sie sich das{' '}
                  <Link href="/pakete/business" className="text-[#FC682C] hover:underline">
                    Business-Paket
                  </Link>
                  {' '}an.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  return (
    <section className="section bg-[var(--color-surface)]">
      <div className="container">
        <h2 className="text-h2 font-bold text-center mb-4">So läuft's ab</h2>
        <p className="text-center text-[var(--color-text-muted)] mb-12">
          In {packageData.timeline} von der Idee zur fertigen Website
        </p>
        
        <div className="max-w-3xl mx-auto">
          {packageData.process.map((step, i) => (
            <div key={i} className="flex gap-6 mb-8 last:mb-0">
              <div className="flex flex-col items-center">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ background: packageData.color }}
                >
                  {step.step}
                </div>
                {i < packageData.process.length - 1 && (
                  <div 
                    className="w-0.5 flex-1 mt-2"
                    style={{ background: `${packageData.color}30` }}
                  />
                )}
              </div>
              <div className="flex-1 pb-8">
                <h3 className="font-semibold mb-1">{step.title}</h3>
                <p className="text-sm text-[var(--color-text-muted)]">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CompareSection() {
  return (
    <section className="section">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-h2 font-bold mb-4">Mehr brauchen?</h2>
          <p className="text-[var(--color-text-muted)] mb-8">
            Vergleichen Sie alle Pakete und finden Sie das passende für Ihr Projekt
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/pakete/business"
              className="px-6 py-3 rounded-xl bg-[#FC682C]/10 border border-[#FC682C]/20 hover:border-[#FC682C]/50 transition-all duration-300"
            >
              <span className="text-[#FC682C] font-semibold">Business-Paket →</span>
            </Link>
            <Link 
              href="/pakete/growth"
              className="px-6 py-3 rounded-xl bg-[#9D65C9]/10 border border-[#9D65C9]/20 hover:border-[#9D65C9]/50 transition-all duration-300"
            >
              <span className="text-[#9D65C9] font-semibold">Growth-Paket →</span>
            </Link>
            <Link 
              href="/pakete"
              className="px-6 py-3 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transition-all duration-300"
            >
              <span className="font-semibold">Alle Pakete vergleichen →</span>
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

export default function OnePagePackagePage() {
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

      <PageHero />
      <FeaturesSection />
      <IdealForSection />
      <ProcessSection />
      <CompareSection />
      
      <CTASection
        headline="Bereit für Ihren Webauftritt?"
        subheadline="Starten Sie jetzt mit dem One Page Paket."
      />
    </>
  );
}
