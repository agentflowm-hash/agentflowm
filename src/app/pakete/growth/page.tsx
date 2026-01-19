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
      <div className="absolute top-[5%] right-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#9D65C9]/20 to-transparent blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-[15%] left-[5%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#9D65C9]/15 to-transparent blur-[100px] animate-float-slow" />
      <div className="absolute top-[40%] left-[30%] w-[400px] h-[400px] rounded-full bg-gradient-to-bl from-[#FC682C]/10 to-transparent blur-[90px] animate-pulse-slow" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    PACKAGE DATA
// ═══════════════════════════════════════════════════════════════

const packageData = {
  name: 'Growth',
  icon: '💎',
  color: '#9D65C9',
  price: 'ab 10.990',
  billing: 'einmalig',
  timeline: '4-6 Wochen',
  badge: 'Premium',
  tagline: 'Das komplette System für maximales Wachstum',
  description: 'Bis zu 13 Seiten plus Landingpages, Publishing-Agent, Leads-Generator-Agent und Priority Support. Für Unternehmen, die keine Kompromisse machen und mit System wachsen wollen.',
  
  idealFor: [
    'Wachstumsorientierte Unternehmen',
    'B2B mit komplexen Sales-Prozessen',
    'Unternehmen mit hohem Lead-Volumen',
    'Teams die maximale Effizienz brauchen',
    'Langfristige Partnerschaften',
  ],
  
  features: [
    {
      title: 'Bis zu 13+ Seiten',
      desc: 'Umfangreicher Webauftritt mit allen wichtigen Seiten plus dedizierte Landingpages.',
      icon: '📑',
      highlight: false,
    },
    {
      title: 'Publishing-Agent',
      desc: 'Automatisierter Content-Workflow: Planung → Freigabe → Veröffentlichung.',
      icon: '🤖',
      highlight: false,
    },
    {
      title: 'Leads-Generator-Agent',
      desc: 'Automatische Lead-Erfassung, Kategorisierung und Follow-up. Kein Lead geht verloren.',
      icon: '🎯',
      highlight: true,
    },
    {
      title: 'Priority Support',
      desc: 'Schnelle Reaktionszeiten und direkter Draht zu uns.',
      icon: '⚡',
      highlight: true,
    },
    {
      title: 'Vollständige Übergabe',
      desc: 'Detaillierte Dokumentation und ausführliche Schulung für Ihr Team.',
      icon: '📚',
      highlight: false,
    },
    {
      title: 'Quartals-Reviews',
      desc: 'Regelmäßige Analyse und Optimierungsvorschläge.',
      icon: '📊',
      highlight: true,
    },
    {
      title: 'Erweiterbar',
      desc: 'Jederzeit weitere Seiten, Workflows oder Features hinzufügbar.',
      icon: '🔧',
      highlight: false,
    },
    {
      title: 'Alles aus Business',
      desc: 'CMS, Tracking, SEO, Responsive Design und mehr.',
      icon: '✨',
      highlight: false,
    },
  ],
  
  leadsAgent: {
    title: 'Der Leads-Generator-Agent erklärt',
    description: 'Ihr automatisiertes Lead-Management-System',
    steps: [
      { icon: '📥', title: 'Erfassung', desc: 'Leads werden automatisch erfasst und kategorisiert' },
      { icon: '🏷️', title: 'Scoring', desc: 'Automatische Bewertung nach Ihren Kriterien' },
      { icon: '📋', title: 'Pipeline', desc: 'Übersichtliches Kanban-Board für alle Leads' },
      { icon: '⏰', title: 'Follow-up', desc: 'Automatische Erinnerungen und Aufgaben' },
      { icon: '📈', title: 'Reporting', desc: 'Übersicht über Conversion-Raten und Performance' },
    ],
    benefits: [
      'Kein Lead geht mehr verloren',
      '30% mehr Abschlüsse durch systematisches Follow-up',
      'Volle Transparenz über Ihre Pipeline',
      'Zeitersparnis durch Automatisierung',
    ],
  },
  
  process: [
    { step: 1, title: 'Strategy Session', desc: 'Tiefgehende Analyse Ihrer Ziele, Prozesse und Anforderungen.' },
    { step: 2, title: 'Systemarchitektur', desc: 'Planung der kompletten Infrastruktur und Workflows.' },
    { step: 3, title: 'Design & Branding', desc: 'Premium-Design das Ihre Marke perfekt repräsentiert.' },
    { step: 4, title: 'Entwicklung', desc: 'Umsetzung mit modernsten Technologien.' },
    { step: 5, title: 'Workflow-Setup', desc: 'Einrichtung beider Agents und aller Automationen.' },
    { step: 6, title: 'Integration', desc: 'Anbindung an Ihre bestehenden Tools (CRM, E-Mail, etc.).' },
    { step: 7, title: 'Testing', desc: 'Umfassende Tests aller Funktionen und Workflows.' },
    { step: 8, title: 'Launch & Training', desc: 'Go-Live mit ausführlicher Schulung für Ihr Team.' },
  ],
  
  comparison: {
    title: 'Growth vs. Business',
    items: [
      { feature: 'Seitenanzahl', business: 'bis 10', growth: 'bis 13+' },
      { feature: 'Publishing-Agent', business: '✓', growth: '✓' },
      { feature: 'Leads-Generator', business: '—', growth: '✓' },
      { feature: 'Priority Support', business: '—', growth: '✓' },
      { feature: 'Quartals-Reviews', business: '—', growth: '✓' },
      { feature: 'Landingpages', business: '—', growth: '✓' },
    ],
  },
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
          <div className={`flex items-center gap-3 mb-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div 
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full"
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
            <span 
              className="px-3 py-1 rounded-full text-xs font-bold text-white"
              style={{ background: `linear-gradient(135deg, ${packageData.color} 0%, #7C3AED 100%)` }}
            >
              {packageData.badge}
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
                <span className="text-5xl font-bold" style={{ color: packageData.color }}>
                  {packageData.price}
                </span>
                <span className="text-xl text-[var(--color-text-muted)]">€</span>
              </div>
              <p className="text-sm text-[var(--color-text-muted)]">{packageData.billing}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                className="px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                style={{ 
                  background: `linear-gradient(135deg, ${packageData.color} 0%, #7C3AED 100%)`,
                  boxShadow: `0 4px 20px ${packageData.color}40`,
                }}
                onClick={() => window.location.href = '/termin'}
              >
                Premium starten
              </button>
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
        <h2 className="text-h2 font-bold text-center mb-4">Das komplette Paket</h2>
        <p className="text-center text-[var(--color-text-muted)] mb-12 max-w-2xl mx-auto">
          Alles was Sie für systematisches Wachstum brauchen
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {packageData.features.map((feature, i) => (
            <div 
              key={i}
              className={`p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${feature.highlight ? 'bg-gradient-to-br from-[#9D65C9]/10 to-transparent' : 'bg-[var(--color-surface-elevated)]'}`}
              style={{
                borderColor: feature.highlight ? `${packageData.color}40` : 'var(--color-border)',
              }}
            >
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3"
                style={{ 
                  background: feature.highlight ? packageData.color : `${packageData.color}15`,
                  color: feature.highlight ? 'white' : undefined,
                }}
              >
                {feature.icon}
              </div>
              <h3 className="font-semibold mb-1 text-sm">
                {feature.title}
                {feature.highlight && (
                  <span className="ml-2 px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-[#9D65C9]/20 text-[#9D65C9]">
                    Exklusiv
                  </span>
                )}
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LeadsAgentSection() {
  return (
    <section className="section">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span 
              className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-4"
              style={{ background: `${packageData.color}15`, color: packageData.color }}
            >
              🎯 Exklusiv im Growth-Paket
            </span>
            <h2 className="text-h2 font-bold mb-4">{packageData.leadsAgent.title}</h2>
            <p className="text-[var(--color-text-muted)]">
              {packageData.leadsAgent.description}
            </p>
          </div>
          
          <div 
            className="p-8 rounded-2xl mb-8"
            style={{ 
              background: `linear-gradient(135deg, ${packageData.color}08 0%, transparent 50%, ${packageData.color}05 100%)`,
              border: `1px solid ${packageData.color}20`,
            }}
          >
            <div className="grid md:grid-cols-5 gap-4 mb-8">
              {packageData.leadsAgent.steps.map((step, i) => (
                <div key={i} className="text-center relative">
                  {i < packageData.leadsAgent.steps.length - 1 && (
                    <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-[#9D65C9]/30 to-[#9D65C9]/10" />
                  )}
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3 relative z-10"
                    style={{ 
                      background: `${packageData.color}15`,
                      border: `1px solid ${packageData.color}25`,
                    }}
                  >
                    {step.icon}
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{step.title}</h4>
                  <p className="text-xs text-[var(--color-text-muted)]">{step.desc}</p>
                </div>
              ))}
            </div>
            
            {/* Benefits */}
            <div className="border-t border-[var(--color-border)] pt-6">
              <h4 className="font-semibold text-center mb-4">Ihre Vorteile:</h4>
              <div className="grid md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                {packageData.leadsAgent.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div 
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: packageData.color }}
                    >
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm">{benefit}</span>
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

function ComparisonSection() {
  return (
    <section className="section bg-[var(--color-surface)]">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-h2 font-bold text-center mb-8">{packageData.comparison.title}</h2>
          
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
                {packageData.comparison.items.map((item, i) => (
                  <tr key={i} className="border-t border-[var(--color-border)]">
                    <td className="p-4 text-sm">{item.feature}</td>
                    <td className="p-4 text-center text-sm">
                      {item.business === '✓' ? (
                        <span className="inline-flex w-5 h-5 rounded-full bg-[var(--color-success)] items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      ) : item.business === '—' ? (
                        <span className="text-[var(--color-text-muted)]">—</span>
                      ) : (
                        item.business
                      )}
                    </td>
                    <td className="p-4 text-center text-sm bg-[#9D65C9]/5">
                      {item.growth === '✓' ? (
                        <span className="inline-flex w-5 h-5 rounded-full bg-[#9D65C9] items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      ) : (
                        <span className="font-medium">{item.growth}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
          <h2 className="text-h2 font-bold text-center mb-8">Ideal für Unternehmen die...</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {packageData.idealFor.map((item, i) => (
              <div 
                key={i} 
                className="flex items-center gap-3 p-4 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)]"
              >
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: packageData.color }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm">{item}</span>
              </div>
            ))}
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
        <h2 className="text-h2 font-bold text-center mb-4">Der Premium-Prozess</h2>
        <p className="text-center text-[var(--color-text-muted)] mb-12">
          Gründlich, strukturiert und auf Ihre Bedürfnisse zugeschnitten
        </p>
        
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-x-12 gap-y-6">
          {packageData.process.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ background: packageData.color }}
              >
                {step.step}
              </div>
              <div>
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

function OtherPackagesSection() {
  return (
    <section className="section">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-h2 font-bold mb-4">Vielleicht doch ein anderes Paket?</h2>
          <p className="text-[var(--color-text-muted)] mb-8">
            Kein Problem - wir haben für jeden das Richtige
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/pakete/one-page"
              className="px-6 py-3 rounded-xl bg-[#FFB347]/10 border border-[#FFB347]/20 hover:border-[#FFB347]/50 transition-all duration-300"
            >
              <span className="text-[#FFB347] font-semibold">← One Page (ab 1.390€)</span>
            </Link>
            <Link 
              href="/pakete/business"
              className="px-6 py-3 rounded-xl bg-[#FC682C]/10 border border-[#FC682C]/20 hover:border-[#FC682C]/50 transition-all duration-300"
            >
              <span className="text-[#FC682C] font-semibold">← Business (6.990€)</span>
            </Link>
            <Link 
              href="/pakete"
              className="px-6 py-3 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transition-all duration-300"
            >
              <span className="font-semibold">Alle vergleichen →</span>
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
      <LeadsAgentSection />
      <ComparisonSection />
      <IdealForSection />
      <ProcessSection />
      <OtherPackagesSection />
      
      <CTASection
        headline="Bereit für maximales Wachstum?"
        subheadline="Starten Sie mit dem Growth-Paket und lassen Sie uns Ihr System aufbauen."
      />
    </>
  );
}
