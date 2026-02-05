"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { ParallaxBackground } from "@/components/ui/ParallaxBackground";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

// Hero Visualization - Globe with connection lines
function HeroVisualization() {
  return (
    <div className="relative w-full h-[320px] sm:h-[400px] flex items-center justify-center">
      {/* Outer Glow */}
      <motion.div
        className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(252,104,44,0.15) 0%, rgba(255,179,71,0.08) 40%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.8, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Rotating outer ring */}
      <motion.div
        className="absolute w-56 h-56 sm:w-72 sm:h-72"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 rounded-full border border-[#FC682C]/30" />
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-[#FC682C]"
            style={{
              top: "50%",
              left: "50%",
              transform: `rotate(${angle}deg) translateX(112px) translateY(-50%)`,
              boxShadow: "0 0 10px rgba(252,104,44,0.6)",
            }}
          />
        ))}
      </motion.div>

      {/* Middle ring - counter direction */}
      <motion.div
        className="absolute w-40 h-40 sm:w-52 sm:h-52"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 rounded-full border border-[#FFB347]/25" style={{ borderStyle: "dashed" }} />
      </motion.div>

      {/* Inner pulsing ring */}
      <motion.div
        className="absolute w-28 h-28 sm:w-36 sm:h-36 rounded-full"
        style={{
          border: "2px solid rgba(252,104,44,0.4)",
          boxShadow: "0 0 30px rgba(252,104,44,0.2)",
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Main Sphere - Globe */}
      <motion.div
        className="relative w-20 h-20 sm:w-28 sm:h-28"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `
              radial-gradient(circle at 35% 25%, rgba(255,255,255,0.3), transparent 30%),
              radial-gradient(circle at 30% 30%, #FF7A45, #FC682C 35%, #e55a1f 55%, #c44a15 75%, #8B2500 100%)
            `,
            boxShadow: `
              0 0 60px rgba(252, 104, 44, 0.5),
              0 0 120px rgba(252, 104, 44, 0.3),
              inset -8px -8px 20px rgba(0,0,0,0.4),
              inset 8px 8px 20px rgba(255,255,255,0.15)
            `,
          }}
        />
        {/* Globe lines */}
        <div className="absolute inset-2 rounded-full border border-white/20" />
        <div className="absolute inset-4 rounded-full border border-white/10" />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20" />
      </motion.div>
    </div>
  );
}

// Hero Section
function HeroSection() {
  const t = useTranslations("international.hero");
  
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030308] via-[#0a0a12] to-[#030308]" />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            {/* Eyebrow */}
            <motion.span 
              variants={fadeInUp}
              className="inline-block px-4 py-2 bg-[#FC682C]/10 text-[#FC682C] rounded-full text-sm font-medium mb-6 border border-[#FC682C]/20"
            >
              {t("eyebrow")}
            </motion.span>
            
            {/* Headline */}
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            >
              {t("headline")}
            </motion.h1>
            
            {/* Subheadline */}
            <motion.p 
              variants={fadeInUp}
              className="text-lg text-white/60 mb-8 leading-relaxed"
            >
              {t("subheadline")}
            </motion.p>
            
            {/* Trust Chips */}
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-3 mb-8">
              {["chip1", "chip2", "chip3"].map((chip) => (
                <span 
                  key={chip}
                  className="px-3 py-1.5 bg-white/5 text-white/70 rounded-full text-sm border border-white/10"
                >
                  {t(`chips.${chip}`)}
                </span>
              ))}
            </motion.div>
            
            {/* CTAs */}
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 mb-8">
              <Link 
                href="/termin"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#FC682C] hover:bg-[#e55a1f] text-white rounded-xl font-semibold transition-all shadow-lg shadow-[#FC682C]/25"
              >
                {t("cta.primary")}
              </Link>
              <a 
                href="#projekte"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-all border border-white/10"
              >
                {t("cta.secondary")} →
              </a>
            </motion.div>
            
            {/* Micro Proof */}
            <motion.div variants={fadeInUp} className="text-white/40 text-sm">
              {t("microProof")}
            </motion.div>
          </motion.div>
          
          {/* Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <HeroVisualization />
          </motion.div>
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
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-white mb-6"
          >
            {t("headline")}
          </motion.h2>
          
          <motion.p 
            variants={fadeInUp}
            className="text-lg text-white/60 leading-relaxed"
          >
            {t("intro")}
          </motion.p>
        </motion.div>
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="max-w-2xl mx-auto space-y-4"
        >
          {bullets.map((bullet, i) => (
            <motion.div 
              key={bullet}
              variants={fadeInUp}
              className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10"
            >
              <div className="w-8 h-8 rounded-full bg-[#FC682C]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-[#FC682C] text-sm font-bold">{i + 1}</span>
              </div>
              <span className="text-white/80">{t(`bullets.${bullet}`)}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Gaps Section
function GapsSection() {
  const t = useTranslations("international.gaps");
  
  const cards = [
    { key: "immobilien", icon: "🏠" },
    { key: "renovierung", icon: "🔧" },
    { key: "mobilitaet", icon: "🚗" },
    { key: "tourismus", icon: "🗺️" },
    { key: "handel", icon: "🛒" },
    { key: "transfers", icon: "💸" },
  ];
  
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            {t("headline")}
          </motion.h2>
          
          <motion.p 
            variants={fadeInUp}
            className="text-lg text-white/60 max-w-2xl mx-auto"
          >
            {t("intro")}
          </motion.p>
        </motion.div>
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {cards.map(({ key, icon }) => (
            <motion.div
              key={key}
              variants={fadeInUp}
              className="group p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-[#FC682C]/30 transition-colors"
            >
              <div className="text-3xl mb-4">{icon}</div>
              <h3 className="font-semibold text-white mb-2 group-hover:text-[#FC682C] transition-colors">
                {t(`cards.${key}.title`)}
              </h3>
              <p className="text-white/60 text-sm">
                {t(`cards.${key}.text`)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Approach Section
function ApproachSection() {
  const t = useTranslations("international.approach");
  
  const steps = [
    { key: "step1", num: "01" },
    { key: "step2", num: "02" },
    { key: "step3", num: "03" },
    { key: "step4", num: "04" },
  ];
  
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            {t("headline")}
          </motion.h2>
          
          <motion.p 
            variants={fadeInUp}
            className="text-lg text-white/60 max-w-3xl mx-auto"
          >
            {t("text")}
          </motion.p>
        </motion.div>
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid md:grid-cols-4 gap-8"
        >
          {steps.map(({ key, num }, index) => (
            <motion.div
              key={key}
              variants={fadeInUp}
              className="relative text-center"
            >
              {/* Connector line */}
              {index < 3 && (
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-px bg-gradient-to-r from-[#FC682C]/50 to-transparent" />
              )}
              
              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FC682C]/10 border border-[#FC682C]/30 flex items-center justify-center">
                  <span className="text-[#FC682C] font-bold">{num}</span>
                </div>
                <h3 className="font-semibold text-white mb-2">
                  {t(`timeline.${key}.title`)}
                </h3>
                <p className="text-sm text-white/60">
                  {t(`timeline.${key}.sub`)}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Projects Section
function ProjectsSection() {
  const t = useTranslations("international.projects");
  
  const projects = [
    { key: "syriascout", icon: "🏠" },
    { key: "gosyriacar", icon: "🚗" },
    { key: "syriaatlas", icon: "🗺️" },
    { key: "syriatransfer", icon: "💸" },
    { key: "almdina", icon: "🛒" },
    { key: "sabrspace", icon: "🧘" },
  ];
  
  return (
    <section id="projekte" className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            {t("headline")}
          </motion.h2>
          
          <motion.p 
            variants={fadeInUp}
            className="text-lg text-white/60"
          >
            {t("intro")}
          </motion.p>
        </motion.div>
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid lg:grid-cols-2 gap-8"
        >
          {projects.map(({ key, icon }) => (
            <motion.div
              key={key}
              variants={fadeInUp}
              className="bg-white/5 rounded-2xl p-8 border border-white/10 hover:border-[#FC682C]/30 transition-colors"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-[#FC682C]/10 flex items-center justify-center text-2xl">
                  {icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {t(`items.${key}.name`)}
                  </h3>
                  <p className="text-sm text-[#FC682C]">
                    {t(`items.${key}.miniHeadline`)}
                  </p>
                </div>
              </div>
              
              <p className="text-white/60 mb-6">
                {t(`items.${key}.about`)}
              </p>
              
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-white/80 mb-3">
                  {t("solves")}
                </h4>
                <ul className="space-y-2">
                  {["solve1", "solve2", "solve3"].map((solve) => (
                    <li key={solve} className="flex items-start gap-2 text-sm text-white/60">
                      <span className="text-[#FC682C]">✓</span>
                      {t(`items.${key}.${solve}`)}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-white/80 mb-3">
                  {t("participate")}
                </h4>
                <ul className="space-y-2">
                  {["role1", "role2", "role3"].map((role) => (
                    <li key={role} className="flex items-start gap-2 text-sm text-white/60">
                      <span className="text-[#FFB347]">→</span>
                      {t(`items.${key}.${role}`)}
                    </li>
                  ))}
                </ul>
              </div>
              
              <button className="px-5 py-2.5 bg-[#FC682C]/10 text-[#FC682C] rounded-xl font-medium text-sm hover:bg-[#FC682C]/20 transition-colors border border-[#FC682C]/20">
                {t(`items.${key}.cta`)} →
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// AI Agents Section
function AIAgentsSection() {
  const t = useTranslations("international.aiAgents");
  const examples = ["example1", "example2", "example3", "example4"];
  
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="max-w-3xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#FC682C]/10 flex items-center justify-center text-xl">
              🤖
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              {t("headline")}
            </h2>
          </motion.div>
          
          <motion.p 
            variants={fadeInUp}
            className="text-white/60 mb-8"
          >
            {t("text")}
          </motion.p>
          
          <motion.div 
            variants={stagger}
            className="grid sm:grid-cols-2 gap-4"
          >
            {examples.map((example) => (
              <motion.div
                key={example}
                variants={fadeInUp}
                className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10"
              >
                <span className="text-[#FC682C]">⚡</span>
                <span className="text-white/70 text-sm">{t(`examples.${example}`)}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// Why Now Section
function WhyNowSection() {
  const t = useTranslations("international.whyNow");
  
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="max-w-2xl mx-auto text-center"
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-white mb-6"
          >
            {t("headline")}
          </motion.h2>
          
          <motion.p 
            variants={fadeInUp}
            className="text-lg text-white/60 mb-10"
          >
            {t("text")}
          </motion.p>
          
          <motion.div 
            variants={fadeInUp}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link 
              href="/termin"
              className="px-6 py-3 bg-[#FC682C] hover:bg-[#e55a1f] text-white rounded-xl font-semibold transition-all shadow-lg shadow-[#FC682C]/25"
            >
              {t("cta1")}
            </Link>
            <Link 
              href="/kontakt"
              className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-all border border-white/10"
            >
              {t("cta2")}
            </Link>
            <Link 
              href="/kontakt"
              className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-all border border-white/10"
            >
              {t("cta3")}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// Footer CTA
function FooterCTA() {
  const t = useTranslations("international.footerCta");
  
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#FC682C]/20 via-[#FC682C]/10 to-[#FFB347]/20" />
      
      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            {t("headline")}
          </motion.h2>
          <motion.p 
            variants={fadeInUp}
            className="text-lg text-white/60 mb-8"
          >
            {t("subline")}
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Link 
              href="/termin"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#FC682C] hover:bg-[#e55a1f] text-white rounded-xl font-semibold transition-all shadow-lg shadow-[#FC682C]/25"
            >
              {t("cta")} →
            </Link>
          </motion.div>
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
