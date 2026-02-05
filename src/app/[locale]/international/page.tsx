"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { ParallaxBackground } from "@/components/ui/ParallaxBackground";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

// Globe Visualization (matching main site style)
function GlobeVisualization() {
  return (
    <div className="relative w-full h-[260px] sm:h-[300px] lg:h-[360px] flex items-center justify-center">
      {/* Background Glow */}
      <div className="absolute w-40 h-40 sm:w-56 sm:h-56 lg:w-64 lg:h-64 bg-gradient-to-br from-[#FC682C]/20 via-[#FFB347]/10 to-transparent rounded-full blur-3xl" />

      {/* Outer rotating ring */}
      <motion.div
        className="absolute w-44 h-44 sm:w-56 sm:h-56 lg:w-72 lg:h-72 rounded-full"
        style={{
          background: "conic-gradient(from 0deg, transparent, rgba(252,104,44,0.3), transparent, rgba(255,179,71,0.3), transparent)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      {/* Middle Ring */}
      <motion.div
        className="absolute w-32 h-32 sm:w-44 sm:h-44 lg:w-56 lg:h-56 rounded-full border border-[#FC682C]/20"
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Inner pulsing ring */}
      <motion.div
        className="absolute w-20 h-20 sm:w-28 sm:h-28 lg:w-36 lg:h-36 rounded-full border-2 border-[#FC682C]/30"
        animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Main Sphere */}
      <motion.div
        className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle at 35% 25%, rgba(255,255,255,0.25), transparent 30%), radial-gradient(circle at 30% 30%, #FF7A45, #FC682C 35%, #e55a1f 55%, #c44a15 75%, #8B2500 100%)",
            boxShadow: "0 0 40px rgba(252,104,44,0.4), 0 0 80px rgba(252,104,44,0.2), inset -6px -6px 15px rgba(0,0,0,0.4), inset 6px 6px 15px rgba(255,255,255,0.1)",
          }}
        />
        {/* Globe lines */}
        <div className="absolute inset-2 rounded-full border border-white/15" />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-white/15" />
      </motion.div>

      {/* Connection dots */}
      {[
        { x: "20%", y: "25%", delay: 0 },
        { x: "75%", y: "30%", delay: 0.5 },
        { x: "15%", y: "70%", delay: 1 },
        { x: "80%", y: "65%", delay: 1.5 },
      ].map((dot, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-[#FFB347]"
          style={{ left: dot.x, top: dot.y, boxShadow: "0 0 8px rgba(255,179,71,0.6)" }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, delay: dot.delay }}
        />
      ))}
    </div>
  );
}

// Hero Section
function HeroSection() {
  const t = useTranslations("international.hero");
  
  return (
    <section className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-[#FC682C]/5 rounded-full blur-[150px]" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Visualization */}
            <motion.div
              className="order-2 lg:order-1"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <GlobeVisualization />
            </motion.div>

            {/* Text Content */}
            <motion.div
              className="order-1 lg:order-2 text-center lg:text-start"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-sm text-[#FC682C] font-medium uppercase tracking-wider">
                {t("eyebrow")}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mt-3 mb-4 text-white">
                {t("headline")}
              </h1>
              <p className="text-base sm:text-lg text-white/80 max-w-xl mx-auto lg:mx-0 mb-6">
                {t("subheadline")}
              </p>
              
              {/* Chips */}
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-6">
                {["chip1", "chip2", "chip3"].map((chip) => (
                  <span key={chip} className="px-3 py-1 text-xs bg-white/5 text-white/60 rounded-full border border-white/10">
                    {t(`chips.${chip}`)}
                  </span>
                ))}
              </div>
              
              {/* CTAs */}
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-4">
                <Link 
                  href="/termin"
                  className="px-5 py-2.5 bg-gradient-to-r from-[#FC682C] to-[#e55a1f] text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-all shadow-lg shadow-[#FC682C]/25"
                >
                  {t("cta.primary")}
                </Link>
                <a 
                  href="#projekte"
                  className="px-5 py-2.5 border border-white/20 text-white text-sm font-semibold rounded-lg hover:bg-white/5 transition-all"
                >
                  {t("cta.secondary")} →
                </a>
              </div>
              
              <p className="text-xs text-white/40">{t("microProof")}</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Why Systems Section
function WhySystemsSection() {
  const t = useTranslations("international.whySystems");
  const bullets = ["bullet1", "bullet2", "bullet3", "bullet4", "bullet5"];
  
  return (
    <section className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#FFB347]/5 rounded-full blur-[150px]" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm text-[#FFB347] font-medium uppercase tracking-wider">
              Warum Systeme?
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-3 mb-4 text-white">
              {t("headline")}
            </h2>
            <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto">
              {t("intro")}
            </p>
          </motion.div>
          
          <div className="space-y-3">
            {bullets.map((bullet, i) => (
              <motion.div 
                key={bullet}
                className="p-4 sm:p-5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-[#FC682C]/30 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0 bg-[#FC682C]"
                    style={{ boxShadow: "0 0 10px rgba(252,104,44,0.5)" }}
                  />
                  <p className="text-sm sm:text-base text-white/80">{t(`bullets.${bullet}`)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Gaps Section
function GapsSection() {
  const t = useTranslations("international.gaps");
  
  const cards = [
    { key: "immobilien", color: "#ef4444" },
    { key: "renovierung", color: "#f59e0b" },
    { key: "mobilitaet", color: "#06b6d4" },
    { key: "tourismus", color: "#a855f7" },
    { key: "handel", color: "#22c55e" },
    { key: "transfers", color: "#FFB347" },
  ];
  
  return (
    <section className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm text-[#FC682C] font-medium uppercase tracking-wider">
              Lücken erkennen
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-3 mb-4 text-white">
              {t("headline")}
            </h2>
            <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto">
              {t("intro")}
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {cards.map((card, i) => (
              <motion.div
                key={card.key}
                className="p-5 sm:p-6 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-[#FC682C]/30 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
                    style={{ backgroundColor: card.color, boxShadow: `0 0 10px ${card.color}50` }}
                  />
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                      {t(`cards.${card.key}.title`)}
                    </h3>
                    <p className="text-sm sm:text-base text-white/70">
                      {t(`cards.${card.key}.text`)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Approach Section
function ApproachSection() {
  const t = useTranslations("international.approach");
  
  const steps = [
    { key: "step1", color: "#FC682C" },
    { key: "step2", color: "#FFB347" },
    { key: "step3", color: "#06b6d4" },
    { key: "step4", color: "#22c55e" },
  ];
  
  return (
    <section className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm text-[#FFB347] font-medium uppercase tracking-wider">
              Unser Ansatz
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-3 mb-4 text-white">
              {t("headline")}
            </h2>
            <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto">
              {t("text")}
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.key}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div 
                  className="w-12 h-12 mx-auto rounded-full flex items-center justify-center text-sm font-bold mb-3"
                  style={{ 
                    backgroundColor: `${step.color}20`, 
                    color: step.color,
                    border: `2px solid ${step.color}40`
                  }}
                >
                  {i + 1}
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-white mb-1">
                  {t(`timeline.${step.key}.title`)}
                </h3>
                <p className="text-xs sm:text-sm text-white/60">
                  {t(`timeline.${step.key}.sub`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Projects Section
function ProjectsSection() {
  const t = useTranslations("international.projects");
  
  const projects = [
    { key: "syriascout", color: "#22c55e" },
    { key: "gosyriacar", color: "#06b6d4" },
    { key: "syriaatlas", color: "#a855f7" },
    { key: "syriatransfer", color: "#FFB347" },
    { key: "almdina", color: "#f59e0b" },
    { key: "sabrspace", color: "#ec4899" },
  ];
  
  return (
    <section id="projekte" className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FC682C]/5 rounded-full blur-[200px]" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm text-[#FC682C] font-medium uppercase tracking-wider">
              Projekte
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-3 mb-4 text-white">
              {t("headline")}
            </h2>
            <p className="text-base sm:text-lg text-white/80">
              {t("intro")}
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-2 gap-5 sm:gap-6">
            {projects.map((project, i) => (
              <motion.div
                key={project.key}
                className="p-5 sm:p-6 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-[#FC682C]/30 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${project.color}20` }}
                  >
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color }} />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white">
                      {t(`items.${project.key}.name`)}
                    </h3>
                    <p className="text-xs sm:text-sm" style={{ color: project.color }}>
                      {t(`items.${project.key}.miniHeadline`)}
                    </p>
                  </div>
                </div>
                
                <p className="text-sm text-white/70 mb-4">
                  {t(`items.${project.key}.about`)}
                </p>
                
                <div className="mb-4">
                  <p className="text-xs text-white/50 uppercase tracking-wider mb-2">{t("solves")}</p>
                  <ul className="space-y-1">
                    {["solve1", "solve2", "solve3"].map((solve) => (
                      <li key={solve} className="flex items-start gap-2 text-xs sm:text-sm text-white/60">
                        <span style={{ color: project.color }}>✓</span>
                        {t(`items.${project.key}.${solve}`)}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mb-4">
                  <p className="text-xs text-white/50 uppercase tracking-wider mb-2">{t("participate")}</p>
                  <ul className="space-y-1">
                    {["role1", "role2", "role3"].map((role) => (
                      <li key={role} className="flex items-start gap-2 text-xs sm:text-sm text-white/60">
                        <span className="text-white/40">→</span>
                        {t(`items.${project.key}.${role}`)}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <button 
                  className="px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all"
                  style={{ 
                    backgroundColor: `${project.color}15`, 
                    color: project.color,
                    border: `1px solid ${project.color}30`
                  }}
                >
                  {t(`items.${project.key}.cta`)} →
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// AI Agents Section
function AIAgentsSection() {
  const t = useTranslations("international.aiAgents");
  const examples = ["example1", "example2", "example3", "example4"];
  
  return (
    <section className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm text-[#06b6d4] font-medium uppercase tracking-wider">
              Technologie
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-3 mb-4 text-white">
              {t("headline")}
            </h2>
            <p className="text-base sm:text-lg text-white/80">
              {t("text")}
            </p>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            {examples.map((example, i) => (
              <motion.div
                key={example}
                className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <span className="text-[#06b6d4]">⚡</span>
                <span className="text-sm text-white/70">{t(`examples.${example}`)}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Why Now Section
function WhyNowSection() {
  const t = useTranslations("international.whyNow");
  
  return (
    <section className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm text-[#FC682C] font-medium uppercase tracking-wider">
              Jetzt starten
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-3 mb-4 text-white">
              {t("headline")}
            </h2>
            <p className="text-base sm:text-lg text-white/80 mb-8">
              {t("text")}
            </p>
            
            <div className="flex flex-wrap justify-center gap-3">
              <Link 
                href="/termin"
                className="px-5 py-2.5 bg-gradient-to-r from-[#FC682C] to-[#e55a1f] text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-all shadow-lg shadow-[#FC682C]/25"
              >
                {t("cta1")}
              </Link>
              <Link 
                href="/kontakt"
                className="px-5 py-2.5 border border-white/20 text-white text-sm font-semibold rounded-lg hover:bg-white/5 transition-all"
              >
                {t("cta2")}
              </Link>
              <Link 
                href="/kontakt"
                className="px-5 py-2.5 border border-white/20 text-white text-sm font-semibold rounded-lg hover:bg-white/5 transition-all"
              >
                {t("cta3")}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Footer CTA
function FooterCTA() {
  const t = useTranslations("international.footerCta");
  
  return (
    <section className="py-16 sm:py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#FC682C]/10 via-[#FC682C]/5 to-[#FFB347]/10" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            {t("headline")}
          </h2>
          <p className="text-base sm:text-lg text-white/60 mb-6">
            {t("subline")}
          </p>
          <Link 
            href="/termin"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FC682C] to-[#e55a1f] text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-all shadow-lg shadow-[#FC682C]/25"
          >
            {t("cta")} →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// Main Page Component
export default function InternationalPage() {
  return (
    <div className="bg-[#030308] overflow-hidden">
      <HeroSection />
      <ParallaxBackground className="relative">
        <WhySystemsSection />
        <GapsSection />
        <ApproachSection />
        <ProjectsSection />
        <AIAgentsSection />
        <WhyNowSection />
      </ParallaxBackground>
      <FooterCTA />
    </div>
  );
}
