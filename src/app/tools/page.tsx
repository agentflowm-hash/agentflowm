'use client';

import { useEffect, useRef, useState } from 'react';
import { CTASection } from '@/components/sections';

// ═══════════════════════════════════════════════════════════════
//                    ANIMATED BACKGROUND
// ═══════════════════════════════════════════════════════════════

function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient orbs */}
      <div className="absolute top-10 left-[20%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-[#FC682C]/15 to-transparent blur-[100px] animate-pulse-slow" />
      <div className="absolute bottom-20 right-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-[#9D65C9]/10 to-transparent blur-[120px] animate-float-slow" />
      
      {/* Tech pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(252,104,44,0.3) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, rgba(157,101,201,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    TOOL DATA
// ═══════════════════════════════════════════════════════════════

const toolCategories = [
  {
    id: 'ai',
    title: 'KI & Entwicklung',
    description: 'Modernste KI-Tools für effiziente Entwicklung',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
    color: '#FC682C',
    tools: [
      { name: 'Claude', desc: 'KI-Assistent für Code & Konzepte', logo: '🧠', url: 'https://claude.ai' },
      { name: 'ChatGPT', desc: 'Vielseitige Sprachverarbeitung', logo: '💬', url: 'https://chat.openai.com' },
      { name: 'VS Code', desc: 'Professionelle Entwicklungsumgebung', logo: '⚡', url: 'https://code.visualstudio.com' },
      { name: 'GitHub', desc: 'Versionskontrolle & Collaboration', logo: '🐙', url: 'https://github.com' },
    ],
  },
  {
    id: 'design',
    title: 'Design & Medien',
    description: 'Kreative Tools für visuelle Exzellenz',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
    color: '#FFB347',
    tools: [
      { name: 'Figma', desc: 'UI/UX Design & Prototyping', logo: '🎨', url: 'https://figma.com' },
      { name: 'Veo 3', desc: 'KI-Videogenerierung', logo: '🎬', url: 'https://deepmind.google/technologies/veo/' },
      { name: 'Blender', desc: '3D-Modellierung & Animation', logo: '🧊', url: 'https://blender.org' },
      { name: 'Canva', desc: 'Schnelle Grafik-Erstellung', logo: '✨', url: 'https://canva.com' },
    ],
  },
  {
    id: 'automation',
    title: 'Workflows & Automation',
    description: 'Verbindungen die funktionieren',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" />
      </svg>
    ),
    color: '#FF6B6B',
    tools: [
      { name: 'n8n', desc: 'Workflow-Automation (Self-hosted)', logo: '🔄', url: 'https://n8n.io' },
      { name: 'Make', desc: 'Visuelle Automatisierung', logo: '⚙️', url: 'https://make.com' },
      { name: 'Zapier', desc: 'App-Integrationen', logo: '⚡', url: 'https://zapier.com' },
      { name: 'Custom APIs', desc: 'Maßgeschneiderte Schnittstellen', logo: '🔌', url: null },
    ],
  },
  {
    id: 'hosting',
    title: 'Hosting & Deployment',
    description: 'Schnell, sicher, zuverlässig',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
      </svg>
    ),
    color: '#9D65C9',
    tools: [
      { name: 'Vercel', desc: 'Frontend-Deployment', logo: '▲', url: 'https://vercel.com' },
      { name: 'Netlify', desc: 'JAMstack Hosting', logo: '🌐', url: 'https://netlify.com' },
      { name: 'Cloudflare', desc: 'CDN & Security', logo: '☁️', url: 'https://cloudflare.com' },
      { name: 'Docker', desc: 'Container-Orchestrierung', logo: '🐳', url: 'https://docker.com' },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
//                    TOOL CARD COMPONENT
// ═══════════════════════════════════════════════════════════════

function ToolCard({ tool, color, delay }: { tool: { name: string; desc: string; logo: string; url: string | null }; color: string; delay: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [delay]);

  const CardWrapper = tool.url ? 'a' : 'div';
  const linkProps = tool.url ? { href: tool.url, target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <CardWrapper
      {...linkProps}
      ref={cardRef as React.RefObject<HTMLAnchorElement & HTMLDivElement>}
      className={`group relative p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] transition-all duration-500 hover:border-transparent hover:-translate-y-1 ${tool.url ? 'cursor-pointer' : ''} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{
        transitionDelay: `${delay}ms`,
      }}
    >
      {/* Hover glow */}
      <div 
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${color}10 0%, transparent 50%)`,
          border: `1px solid ${color}30`,
        }}
      />
      
      <div className="relative flex items-center gap-3">
        {/* Logo */}
        <div 
          className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-transform duration-300 group-hover:scale-110"
          style={{ 
            background: `${color}15`,
            border: `1px solid ${color}20`,
          }}
        >
          {tool.logo}
        </div>
        
        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-sm truncate flex items-center gap-2">
            {tool.name}
            {tool.url && (
              <svg className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            )}
          </div>
          <div className="text-xs text-[var(--color-text-muted)] truncate">{tool.desc}</div>
        </div>
      </div>
    </CardWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    CATEGORY SECTION
// ═══════════════════════════════════════════════════════════════

function CategorySection({ category, index }: { category: typeof toolCategories[0]; index: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={sectionRef}
      className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="relative p-6 lg:p-8 rounded-2xl bg-gradient-to-br from-[var(--color-surface-elevated)] to-transparent border border-[var(--color-border)] overflow-hidden">
        {/* Background decoration */}
        <div 
          className="absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-10"
          style={{ background: `linear-gradient(135deg, ${category.color} 0%, transparent 100%)` }}
        />
        
        {/* Header */}
        <div className="relative flex items-center gap-4 mb-6">
          <div 
            className="flex items-center justify-center w-14 h-14 rounded-xl"
            style={{ 
              background: `linear-gradient(135deg, ${category.color}20 0%, ${category.color}05 100%)`,
              border: `1px solid ${category.color}30`,
              color: category.color,
            }}
          >
            {category.icon}
          </div>
          <div>
            <h3 className="text-xl font-bold">{category.title}</h3>
            <p className="text-sm text-[var(--color-text-muted)]">{category.description}</p>
          </div>
        </div>
        
        {/* Tools grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {category.tools.map((tool, i) => (
            <ToolCard 
              key={tool.name} 
              tool={tool} 
              color={category.color} 
              delay={i * 100}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    PAGE HERO
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
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div 
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 mb-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
            <span className="text-sm font-medium text-[var(--color-accent)]">
              Professionelle Werkzeuge
            </span>
          </div>
          
          {/* Headline */}
          <h1 
            className={`text-h1 font-bold mb-6 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            Tools &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent)] via-[#FFB347] to-[#9D65C9]">
              Modelle
            </span>
          </h1>
          
          {/* Description */}
          <p 
            className={`text-xl text-[var(--color-text-muted)] mb-8 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            Für Umsetzung & Produktion. Fokus: Bausteine, nicht Buzzwords.
          </p>

          {/* Quick stats */}
          <div 
            className={`flex flex-wrap justify-center gap-8 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            {[
              { value: '16+', label: 'Tools' },
              { value: '4', label: 'Kategorien' },
              { value: '∞', label: 'Möglichkeiten' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-bold text-[var(--color-accent)]">{stat.value}</div>
                <div className="text-sm text-[var(--color-text-muted)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    PHILOSOPHY SECTION
// ═══════════════════════════════════════════════════════════════

function PhilosophySection() {
  return (
    <section className="section bg-[var(--color-surface)]">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Best Tool for the Job',
                desc: 'Kein Tool-Lock-in. Wir wählen immer das beste Werkzeug für die jeweilige Aufgabe.',
                icon: '🎯',
              },
              {
                title: 'KI-unterstützt',
                desc: 'Moderne KI-Tools beschleunigen Entwicklung und Kreation - ohne Qualitätsverlust.',
                icon: '🤖',
              },
              {
                title: 'Open Standards',
                desc: 'Offene Formate und Standards. Ihr Projekt bleibt portabel und zukunftssicher.',
                icon: '🔓',
              },
            ].map((item, i) => (
              <div 
                key={i}
                className="p-6 rounded-2xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-center"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--color-text-muted)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    MAIN PAGE
// ═══════════════════════════════════════════════════════════════

export default function ToolsPage() {
  return (
    <>
      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.2; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-30px) translateX(15px); }
        }
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
      `}</style>

      <PageHero />
      
      <PhilosophySection />
      
      {/* Tool Categories */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-h2 font-bold mb-4">Unser Tech-Stack</h2>
            <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
              Die Tools hinter unseren Projekten - bewährt und effizient.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {toolCategories.map((category, i) => (
              <CategorySection key={category.id} category={category} index={i} />
            ))}
          </div>

          {/* Disclaimer */}
          <p className="text-center text-sm text-[var(--color-text-muted)] mt-12 max-w-xl mx-auto">
            Hinweis: Nennung beschreibt genutzte Tools - keine offizielle Partnerschaft. 
            Tool-Auswahl variiert je nach Projektanforderungen.
          </p>
        </div>
      </section>

      <CTASection 
        headline="Projekt starten?"
        subheadline="Lassen Sie uns besprechen, welche Tools für Ihr Projekt am besten geeignet sind."
      />
    </>
  );
}
