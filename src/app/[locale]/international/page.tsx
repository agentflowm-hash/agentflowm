"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";

// ============================================
// VISUALIZATIONS - Custom for International
// ============================================

// Hero: World with connection points
function WorldVisualization() {
  return (
    <div className="relative w-full h-[300px] sm:h-[380px] flex items-center justify-center">
      {/* Background glow - warm tones */}
      <div className="absolute w-72 h-72 bg-gradient-to-br from-#FC682C/20 via-orange-400/10 to-transparent rounded-full blur-3xl" />
      
      {/* World circle */}
      <div className="relative">
        {/* Outer orbit */}
        <motion.div 
          className="absolute -inset-16 sm:-inset-20"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-full h-full rounded-full border border-dashed border-[#FC682C]/20" />
          {/* Orbit points */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#FC682C] shadow-lg shadow-[#FC682C]/50" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-orange-400" />
        </motion.div>
        
        {/* Middle orbit - counter */}
        <motion.div 
          className="absolute -inset-10 sm:-inset-12"
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-full h-full rounded-full border border-[#FC682C]/30" />
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-2 h-2 rounded-full bg-teal-400" />
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-2 h-2 rounded-full bg-rose-400" />
        </motion.div>
        
        {/* Main world */}
        <motion.div
          className="relative w-32 h-32 sm:w-40 sm:h-40"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          {/* Globe base */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-600 via-teal-700 to-teal-900 shadow-2xl shadow-teal-500/30">
            {/* Land masses - stylized */}
            <div className="absolute top-[20%] left-[25%] w-[35%] h-[25%] rounded-full bg-[#e55a1f]/60 blur-sm" />
            <div className="absolute top-[45%] left-[15%] w-[25%] h-[20%] rounded-full bg-[#c44a15]/50 blur-sm" />
            <div className="absolute top-[30%] right-[20%] w-[20%] h-[30%] rounded-full bg-[#e55a1f]/40 blur-sm" />
          </div>
          
          {/* Highlight */}
          <div className="absolute top-4 left-6 w-8 h-8 rounded-full bg-white/20 blur-md" />
          
          {/* Connection points on globe */}
          {[
            { top: "25%", left: "35%", color: "#FC682C" },
            { top: "45%", left: "55%", color: "#14b8a6" },
            { top: "60%", left: "30%", color: "#f43f5e" },
          ].map((point, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{ top: point.top, left: point.left, backgroundColor: point.color, boxShadow: `0 0 10px ${point.color}` }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
            />
          ))}
        </motion.div>
      </div>
      
      {/* Flying connection lines */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute w-20 h-px bg-gradient-to-r from-transparent via-#FC682C to-transparent"
          style={{
            top: `${30 + i * 20}%`,
            left: `${10 + i * 25}%`,
            transform: `rotate(${-20 + i * 15}deg)`,
          }}
          animate={{ opacity: [0, 0.6, 0], x: [0, 30, 60] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 1 }}
        />
      ))}
    </div>
  );
}

// Systems: Building blocks visualization
function SystemsVisualization() {
  return (
    <div className="relative w-full h-[240px] sm:h-[280px] flex items-center justify-center">
      <div className="absolute w-48 h-48 bg-gradient-to-br from-blue-500/15 via-indigo-400/10 to-transparent rounded-full blur-3xl" />
      
      {/* Stacked blocks */}
      <div className="relative">
        {/* Foundation */}
        <motion.div
          className="w-32 h-8 sm:w-40 sm:h-10 bg-gradient-to-r from-slate-700 to-slate-600 rounded-lg border border-slate-500/30"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0 }}
        >
          <div className="h-full flex items-center justify-center gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-400/60" />
            ))}
          </div>
        </motion.div>
        
        {/* Middle layer */}
        <motion.div
          className="w-28 h-8 sm:w-36 sm:h-10 mx-auto -mt-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg border border-blue-400/30"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div className="h-full flex items-center justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-2 h-2 rounded-sm bg-white/30" />
            ))}
          </div>
        </motion.div>
        
        {/* Top layer */}
        <motion.div
          className="w-24 h-8 sm:w-32 sm:h-10 mx-auto -mt-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg border border-indigo-400/30"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <motion.div 
            className="h-full flex items-center justify-center"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-3 h-3 rounded-full bg-white/50 shadow-lg shadow-white/30" />
          </motion.div>
        </motion.div>
        
        {/* Floating elements */}
        <motion.div
          className="absolute -right-8 top-4 w-4 h-4 rounded bg-[#FC682C]/60"
          animate={{ y: [0, -8, 0], rotate: [0, 45, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className="absolute -left-6 bottom-2 w-3 h-3 rounded-full bg-teal-400/60"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
        />
      </div>
    </div>
  );
}

// Gaps: Puzzle pieces visualization
function GapsVisualization() {
  return (
    <div className="relative w-full h-[200px] flex items-center justify-center">
      <div className="absolute w-40 h-40 bg-gradient-to-br from-rose-500/15 via-orange-400/10 to-transparent rounded-full blur-3xl" />
      
      <div className="relative flex items-center gap-1">
        {/* Puzzle pieces */}
        {[
          { color: "from-rose-500 to-rose-600", delay: 0 },
          { color: "from-#FC682C to-orange-500", delay: 0.2 },
          { color: "from-teal-500 to-cyan-500", delay: 0.4 },
        ].map((piece, i) => (
          <motion.div
            key={i}
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br ${piece.color} shadow-lg`}
            initial={{ opacity: 0, x: (i - 1) * 30, rotate: -20 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ delay: piece.delay, type: "spring" }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white/40" />
            </div>
          </motion.div>
        ))}
        
        {/* Missing piece indicator */}
        <motion.div
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border-2 border-dashed border-white/20"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-full h-full flex items-center justify-center text-white/30 text-xl">?</div>
        </motion.div>
      </div>
    </div>
  );
}

// Path visualization for approach
function PathVisualization() {
  return (
    <div className="relative w-full h-[160px] flex items-center justify-center overflow-hidden">
      {/* Path line */}
      <svg className="absolute w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
        <motion.path
          d="M 0 50 Q 100 20 200 50 T 400 50"
          fill="none"
          stroke="url(#pathGradient)"
          strokeWidth="2"
          strokeDasharray="8 4"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2 }}
        />
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FC682C" />
            <stop offset="50%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Path points */}
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 rounded-full bg-white shadow-lg"
          style={{ left: `${12 + i * 25}%` }}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 + i * 0.3 }}
        />
      ))}
    </div>
  );
}

// AI Agents visualization
function AIVisualization() {
  return (
    <div className="relative w-full h-[200px] flex items-center justify-center">
      <div className="absolute w-40 h-40 bg-gradient-to-br from-cyan-500/15 via-blue-400/10 to-transparent rounded-full blur-3xl" />
      
      {/* Central node */}
      <div className="relative">
        <motion.div
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-xl shadow-cyan-500/30 flex items-center justify-center"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="text-2xl">🤖</div>
        </motion.div>
        
        {/* Connection lines */}
        {[0, 1, 2, 3].map((i) => {
          const angle = (i * 90 + 45) * (Math.PI / 180);
          const x = Math.cos(angle) * 50;
          const y = Math.sin(angle) * 50;
          return (
            <motion.div
              key={i}
              className="absolute w-8 h-px bg-gradient-to-r from-cyan-400 to-transparent"
              style={{
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) rotate(${i * 90 + 45}deg) translateX(40px)`,
              }}
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
            />
          );
        })}
        
        {/* Small satellite nodes */}
        {[
          { top: "-30px", left: "50%", ml: "-8px", icon: "📊" },
          { top: "50%", left: "-35px", mt: "-8px", icon: "⚡" },
          { top: "50%", right: "-35px", mt: "-8px", icon: "🔄" },
          { bottom: "-30px", left: "50%", ml: "-8px", icon: "✓" },
        ].map((pos, i) => (
          <motion.div
            key={i}
            className="absolute w-6 h-6 rounded-lg bg-slate-800 border border-cyan-500/30 flex items-center justify-center text-xs"
            style={{ ...pos }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
          >
            {pos.icon}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// PAGE SECTIONS
// ============================================

function HeroSection() {
  const t = useTranslations("international.hero");
  
  return (
    <section className="min-h-screen flex items-center py-20 relative overflow-hidden bg-[#030308]">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#FC682C]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px]" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-3 py-1 bg-[#FC682C]/10 text-[#FC682C] text-sm font-medium rounded-full border border-[#FC682C]/20 mb-4">
              {t("eyebrow")}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              {t("headline")}
            </h1>
            <p className="text-lg text-slate-300 mb-6 leading-relaxed">
              {t("subheadline")}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {["chip1", "chip2", "chip3"].map((chip) => (
                <span key={chip} className="px-3 py-1 bg-slate-800 text-slate-400 text-sm rounded-full">
                  {t(`chips.${chip}`)}
                </span>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-3 mb-4">
              <Link 
                href="/termin"
                className="px-6 py-3 bg-[#FC682C] hover:bg-[#e55a1f] text-slate-900 font-semibold rounded-xl transition-colors"
              >
                {t("cta.primary")}
              </Link>
              <a 
                href="#projekte"
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-colors"
              >
                {t("cta.secondary")} ↓
              </a>
            </div>
            
            <p className="text-sm text-slate-500">{t("microProof")}</p>
          </motion.div>
          
          {/* Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <WorldVisualization />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function WhySystemsSection() {
  const t = useTranslations("international.whySystems");
  const bullets = ["bullet1", "bullet2", "bullet3", "bullet4", "bullet5"];
  
  return (
    <section className="py-20 relative bg-[#030308]">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Visualization */}
            <SystemsVisualization />
            
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-sm text-blue-400 font-medium uppercase tracking-wider">Warum Systeme?</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2 mb-4">
                {t("headline")}
              </h2>
              <p className="text-slate-400 mb-6">{t("intro")}</p>
              
              <div className="space-y-3">
                {bullets.map((bullet, i) => (
                  <motion.div
                    key={bullet}
                    className="flex items-start gap-3 p-3 bg-[#0a0a12]/50 rounded-lg border border-slate-800"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="w-5 h-5 rounded bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-400 text-xs">✓</span>
                    </div>
                    <p className="text-slate-300 text-sm">{t(`bullets.${bullet}`)}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function GapsSection() {
  const t = useTranslations("international.gaps");
  
  const cards = [
    { key: "immobilien", color: "#f43f5e", icon: "🏠" },
    { key: "renovierung", color: "#FC682C", icon: "🔧" },
    { key: "mobilitaet", color: "#14b8a6", icon: "🚗" },
    { key: "tourismus", color: "#8b5cf6", icon: "🗺️" },
    { key: "handel", color: "#22c55e", icon: "🛒" },
    { key: "transfers", color: "#3b82f6", icon: "💸" },
  ];
  
  return (
    <section className="py-20 relative bg-gradient-to-b from-[#030308] to-[#0a0a12]">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <GapsVisualization />
            <span className="text-sm text-rose-400 font-medium uppercase tracking-wider">Lücken erkennen</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2 mb-3">
              {t("headline")}
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">{t("intro")}</p>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((card, i) => (
              <motion.div
                key={card.key}
                className="p-5 bg-[#0a0a12]/50 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                    style={{ backgroundColor: `${card.color}20` }}
                  >
                    {card.icon}
                  </div>
                  <h3 className="font-semibold text-white">{t(`cards.${card.key}.title`)}</h3>
                </div>
                <p className="text-slate-400 text-sm">{t(`cards.${card.key}.text`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ApproachSection() {
  const t = useTranslations("international.approach");
  
  const steps = [
    { key: "step1", color: "#FC682C" },
    { key: "step2", color: "#14b8a6" },
    { key: "step3", color: "#8b5cf6" },
    { key: "step4", color: "#22c55e" },
  ];
  
  return (
    <section className="py-20 relative bg-[#0a0a12]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm text-[#FC682C] font-medium uppercase tracking-wider">Unser Ansatz</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2 mb-3">
              {t("headline")}
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">{t("text")}</p>
          </motion.div>
          
          <PathVisualization />
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.key}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div 
                  className="w-12 h-12 mx-auto rounded-full flex items-center justify-center text-sm font-bold mb-3"
                  style={{ backgroundColor: `${step.color}20`, color: step.color, border: `2px solid ${step.color}50` }}
                >
                  {i + 1}
                </div>
                <h3 className="font-semibold text-white text-sm mb-1">{t(`timeline.${step.key}.title`)}</h3>
                <p className="text-slate-500 text-xs">{t(`timeline.${step.key}.sub`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectsSection() {
  const t = useTranslations("international.projects");
  
  const projects = [
    { key: "syriascout", color: "#22c55e", icon: "🏠" },
    { key: "gosyriacar", color: "#14b8a6", icon: "🚗" },
    { key: "syriaatlas", color: "#8b5cf6", icon: "🗺️" },
    { key: "syriatransfer", color: "#3b82f6", icon: "💸" },
    { key: "almdina", color: "#FC682C", icon: "🛒" },
    { key: "sabrspace", color: "#ec4899", icon: "🧘" },
  ];
  
  return (
    <section id="projekte" className="py-20 relative bg-gradient-to-b from-slate-900 to-[#030308]">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#FC682C]/5 rounded-full blur-[150px]" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm text-[#FC682C] font-medium uppercase tracking-wider">Projekte</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2 mb-3">
              {t("headline")}
            </h2>
            <p className="text-slate-400">{t("intro")}</p>
          </motion.div>
          
          <div className="grid lg:grid-cols-2 gap-6">
            {projects.map((project, i) => (
              <motion.div
                key={project.key}
                className="p-6 bg-[#0a0a12]/70 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                    style={{ backgroundColor: `${project.color}15` }}
                  >
                    {project.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{t(`items.${project.key}.name`)}</h3>
                    <p className="text-sm" style={{ color: project.color }}>{t(`items.${project.key}.miniHeadline`)}</p>
                  </div>
                </div>
                
                <p className="text-slate-400 text-sm mb-4">{t(`items.${project.key}.about`)}</p>
                
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">{t("solves")}</p>
                    {["solve1", "solve2", "solve3"].map((s) => (
                      <p key={s} className="text-xs text-slate-400 mb-1 flex items-start gap-2">
                        <span style={{ color: project.color }}>✓</span>
                        {t(`items.${project.key}.${s}`)}
                      </p>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">{t("participate")}</p>
                    {["role1", "role2", "role3"].map((r) => (
                      <p key={r} className="text-xs text-slate-400 mb-1 flex items-start gap-2">
                        <span className="text-slate-600">→</span>
                        {t(`items.${project.key}.${r}`)}
                      </p>
                    ))}
                  </div>
                </div>
                
                <button 
                  className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                  style={{ backgroundColor: `${project.color}15`, color: project.color }}
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

function AIAgentsSection() {
  const t = useTranslations("international.aiAgents");
  const examples = ["example1", "example2", "example3", "example4"];
  
  return (
    <section className="py-20 relative bg-[#030308]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AIVisualization />
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-sm text-cyan-400 font-medium uppercase tracking-wider">Technologie</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2 mb-4">
                {t("headline")}
              </h2>
              <p className="text-slate-400 mb-6">{t("text")}</p>
              
              <div className="space-y-3">
                {examples.map((ex, i) => (
                  <motion.div
                    key={ex}
                    className="flex items-center gap-3 p-3 bg-[#0a0a12]/50 rounded-lg border border-slate-800"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <span className="text-cyan-400">⚡</span>
                    <p className="text-slate-300 text-sm">{t(`examples.${ex}`)}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyNowSection() {
  const t = useTranslations("international.whyNow");
  
  return (
    <section className="py-20 relative bg-gradient-to-b from-[#030308] to-[#0a0a12]">
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-sm text-[#FC682C] font-medium uppercase tracking-wider">Jetzt starten</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2 mb-4">
            {t("headline")}
          </h2>
          <p className="text-slate-400 mb-8">{t("text")}</p>
          
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/termin" className="px-6 py-3 bg-[#FC682C] hover:bg-[#e55a1f] text-slate-900 font-semibold rounded-xl transition-colors">
              {t("cta1")}
            </Link>
            <Link href="/kontakt" className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-colors">
              {t("cta2")}
            </Link>
            <Link href="/kontakt" className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-colors">
              {t("cta3")}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FooterCTA() {
  const t = useTranslations("international.footerCta");
  
  return (
    <section className="py-16 relative bg-gradient-to-r from-#e55a1f/20 via-#FC682C/10 to-teal-500/20">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">{t("headline")}</h2>
          <p className="text-slate-300 mb-6">{t("subline")}</p>
          <Link 
            href="/termin"
            className="inline-flex px-8 py-4 bg-[#FC682C] hover:bg-[#e55a1f] text-slate-900 font-bold rounded-xl transition-colors shadow-xl shadow-[#FC682C]/20"
          >
            {t("cta")} →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// MAIN PAGE
// ============================================

export default function InternationalPage() {
  return (
    <div className="bg-[#030308] min-h-screen">
      <HeroSection />
      <WhySystemsSection />
      <GapsSection />
      <ApproachSection />
      <ProjectsSection />
      <AIAgentsSection />
      <WhyNowSection />
      <FooterCTA />
    </div>
  );
}
