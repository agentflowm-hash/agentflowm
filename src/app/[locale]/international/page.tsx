"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Building2, 
  Car, 
  Map, 
  Banknote, 
  ShoppingBag, 
  Heart,
  Bot,
  ArrowRight,
  CheckCircle2,
  Zap,
  Users,
  TrendingUp,
  Calendar,
  FileText,
  Handshake
} from "lucide-react";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

// Hero Section
function HeroSection() {
  const t = useTranslations("international.hero");
  
  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="max-w-4xl"
        >
          {/* Eyebrow */}
          <motion.span 
            variants={fadeInUp}
            className="inline-block px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium mb-6 border border-emerald-500/30"
          >
            {t("eyebrow")}
          </motion.span>
          
          {/* Headline */}
          <motion.h1 
            variants={fadeInUp}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          >
            {t("headline")}
          </motion.h1>
          
          {/* Subheadline */}
          <motion.p 
            variants={fadeInUp}
            className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed max-w-3xl"
          >
            {t("subheadline")}
          </motion.p>
          
          {/* Trust Chips */}
          <motion.div variants={fadeInUp} className="flex flex-wrap gap-3 mb-10">
            {["chip1", "chip2", "chip3"].map((chip) => (
              <span 
                key={chip}
                className="px-4 py-2 bg-white/10 text-white rounded-full text-sm backdrop-blur-sm border border-white/20"
              >
                {t(`chips.${chip}`)}
              </span>
            ))}
          </motion.div>
          
          {/* CTAs */}
          <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 mb-12">
            <Link 
              href="/de/termin"
              className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-emerald-500/25"
            >
              <Calendar className="w-5 h-5" />
              {t("cta.primary")}
            </Link>
            <Link 
              href="#projekte"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all backdrop-blur-sm border border-white/20"
            >
              {t("cta.secondary")}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
          
          {/* Micro Proof */}
          <motion.div variants={fadeInUp} className="flex items-center gap-3 text-slate-400">
            <span className="text-sm">{t("microProof")}</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// Why Systems Section
function WhySystemsSection() {
  const t = useTranslations("international.whySystems");
  
  const bullets = [
    "bullet1", "bullet2", "bullet3", "bullet4", "bullet5"
  ];
  
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="max-w-4xl mx-auto"
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-6"
          >
            {t("headline")}
          </motion.h2>
          
          <motion.p 
            variants={fadeInUp}
            className="text-lg text-slate-600 mb-10 leading-relaxed"
          >
            {t("intro")}
          </motion.p>
          
          <motion.div variants={stagger} className="space-y-4">
            {bullets.map((bullet) => (
              <motion.div 
                key={bullet}
                variants={fadeInUp}
                className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl"
              >
                <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">{t(`bullets.${bullet}`)}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// Gaps Section
function GapsSection() {
  const t = useTranslations("international.gaps");
  
  const cards = [
    { key: "immobilien", icon: Building2, color: "emerald" },
    { key: "renovierung", icon: Building2, color: "blue" },
    { key: "mobilitaet", icon: Car, color: "orange" },
    { key: "tourismus", icon: Map, color: "purple" },
    { key: "handel", icon: ShoppingBag, color: "pink" },
    { key: "transfers", icon: Banknote, color: "cyan" },
  ];
  
  const colorClasses: Record<string, string> = {
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-600",
    blue: "bg-blue-50 border-blue-200 text-blue-600",
    orange: "bg-orange-50 border-orange-200 text-orange-600",
    purple: "bg-purple-50 border-purple-200 text-purple-600",
    pink: "bg-pink-50 border-pink-200 text-pink-600",
    cyan: "bg-cyan-50 border-cyan-200 text-cyan-600",
  };
  
  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-center"
          >
            {t("headline")}
          </motion.h2>
          
          <motion.p 
            variants={fadeInUp}
            className="text-lg text-slate-600 mb-12 text-center max-w-2xl mx-auto"
          >
            {t("intro")}
          </motion.p>
          
          <motion.div 
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {cards.map(({ key, icon: Icon, color }) => (
              <motion.div
                key={key}
                variants={fadeInUp}
                className={`p-6 rounded-2xl border-2 ${colorClasses[color]}`}
              >
                <Icon className="w-8 h-8 mb-4" />
                <h3 className="font-semibold text-slate-900 mb-2">
                  {t(`cards.${key}.title`)}
                </h3>
                <p className="text-slate-600 text-sm">
                  {t(`cards.${key}.text`)}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// Approach Section
function ApproachSection() {
  const t = useTranslations("international.approach");
  
  const steps = [
    { key: "step1", icon: Zap },
    { key: "step2", icon: Building2 },
    { key: "step3", icon: Users },
    { key: "step4", icon: TrendingUp },
  ];
  
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="max-w-5xl mx-auto"
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-center"
          >
            {t("headline")}
          </motion.h2>
          
          <motion.p 
            variants={fadeInUp}
            className="text-lg text-slate-600 mb-16 text-center max-w-3xl mx-auto"
          >
            {t("text")}
          </motion.p>
          
          {/* Timeline */}
          <motion.div 
            variants={stagger}
            className="grid md:grid-cols-4 gap-8"
          >
            {steps.map(({ key, icon: Icon }, index) => (
              <motion.div
                key={key}
                variants={fadeInUp}
                className="relative"
              >
                {/* Connector Line */}
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-emerald-200" />
                )}
                
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-emerald-600" />
                  </div>
                  <span className="text-sm text-emerald-600 font-medium mb-2">
                    {index + 1}
                  </span>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {t(`timeline.${key}.title`)}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {t(`timeline.${key}.sub`)}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// Projects Section
function ProjectsSection() {
  const t = useTranslations("international.projects");
  
  const projects = [
    { key: "syriascout", icon: Building2, color: "emerald" },
    { key: "gosyriacar", icon: Car, color: "blue" },
    { key: "syriaatlas", icon: Map, color: "purple" },
    { key: "syriatransfer", icon: Banknote, color: "cyan" },
    { key: "almdina", icon: ShoppingBag, color: "orange" },
    { key: "sabrspace", icon: Heart, color: "pink" },
  ];
  
  const colorClasses: Record<string, { bg: string; border: string; icon: string }> = {
    emerald: { bg: "bg-emerald-50", border: "border-emerald-200", icon: "text-emerald-600" },
    blue: { bg: "bg-blue-50", border: "border-blue-200", icon: "text-blue-600" },
    purple: { bg: "bg-purple-50", border: "border-purple-200", icon: "text-purple-600" },
    cyan: { bg: "bg-cyan-50", border: "border-cyan-200", icon: "text-cyan-600" },
    orange: { bg: "bg-orange-50", border: "border-orange-200", icon: "text-orange-600" },
    pink: { bg: "bg-pink-50", border: "border-pink-200", icon: "text-pink-600" },
  };
  
  return (
    <section id="projekte" className="py-24 bg-slate-900">
      <div className="container mx-auto px-4">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-white mb-4 text-center"
          >
            {t("headline")}
          </motion.h2>
          
          <motion.p 
            variants={fadeInUp}
            className="text-lg text-slate-400 mb-16 text-center max-w-2xl mx-auto"
          >
            {t("intro")}
          </motion.p>
          
          <motion.div 
            variants={stagger}
            className="grid lg:grid-cols-2 gap-8"
          >
            {projects.map(({ key, icon: Icon, color }) => {
              const colors = colorClasses[color];
              return (
                <motion.div
                  key={key}
                  variants={fadeInUp}
                  className="bg-white rounded-2xl p-8 shadow-xl"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center`}>
                      <Icon className={`w-7 h-7 ${colors.icon}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {t(`items.${key}.name`)}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {t(`items.${key}.miniHeadline`)}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 mb-6">
                    {t(`items.${key}.about`)}
                  </p>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-slate-900 mb-3">
                      {t("solves")}
                    </h4>
                    <ul className="space-y-2">
                      {["solve1", "solve2", "solve3"].map((solve) => (
                        <li key={solve} className="flex items-start gap-2 text-sm text-slate-600">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          {t(`items.${key}.${solve}`)}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-slate-900 mb-3">
                      {t("participate")}
                    </h4>
                    <ul className="space-y-2">
                      {["role1", "role2", "role3"].map((role) => (
                        <li key={role} className="flex items-start gap-2 text-sm text-slate-600">
                          <Handshake className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                          {t(`items.${key}.${role}`)}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button className={`inline-flex items-center gap-2 px-6 py-3 ${colors.bg} ${colors.icon} rounded-xl font-medium text-sm hover:opacity-80 transition-opacity`}>
                    {t(`items.${key}.cta`)}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
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
    <section className="py-24 bg-gradient-to-br from-slate-100 to-emerald-50">
      <div className="container mx-auto px-4">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Bot className="w-7 h-7 text-emerald-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              {t("headline")}
            </h2>
          </motion.div>
          
          <motion.p 
            variants={fadeInUp}
            className="text-lg text-slate-600 mb-10"
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
                className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm"
              >
                <Zap className="w-5 h-5 text-emerald-500" />
                <span className="text-slate-700">{t(`examples.${example}`)}</span>
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
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-6"
          >
            {t("headline")}
          </motion.h2>
          
          <motion.p 
            variants={fadeInUp}
            className="text-lg text-slate-600 mb-10"
          >
            {t("text")}
          </motion.p>
          
          <motion.div 
            variants={fadeInUp}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link 
              href="/de/termin"
              className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-emerald-500/25"
            >
              <Calendar className="w-5 h-5" />
              {t("cta1")}
            </Link>
            <Link 
              href="/de/kontakt"
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl font-semibold transition-all"
            >
              <Handshake className="w-5 h-5" />
              {t("cta2")}
            </Link>
            <Link 
              href="/de/kontakt"
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl font-semibold transition-all"
            >
              <FileText className="w-5 h-5" />
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
    <section className="py-20 bg-gradient-to-r from-emerald-600 to-emerald-700">
      <div className="container mx-auto px-4 text-center">
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
            className="text-lg text-emerald-100 mb-8"
          >
            {t("subline")}
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Link 
              href="/de/termin"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-700 rounded-xl font-semibold hover:bg-emerald-50 transition-all shadow-lg"
            >
              <Calendar className="w-5 h-5" />
              {t("cta")}
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
    <main className="min-h-screen">
      <HeroSection />
      <WhySystemsSection />
      <GapsSection />
      <ApproachSection />
      <ProjectsSection />
      <AIAgentsSection />
      <WhyNowSection />
      <FooterCTA />
    </main>
  );
}
