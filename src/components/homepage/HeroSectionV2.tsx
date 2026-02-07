"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  AnimatePresence,
} from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

// ═══════════════════════════════════════════════════════════════
//                    PARTICLE SYSTEM
// ═══════════════════════════════════════════════════════════════

function ParticleField({ count = 80 }: { count?: number }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
    color: ['#8B5CF6', '#00D4FF', '#FC682C', '#FFB347'][Math.floor(Math.random() * 4)],
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 40 - 20, 0],
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    GRADIENT ORBS (Volumetric Light)
// ═══════════════════════════════════════════════════════════════

function VolumetricLighting() {
  return (
    <>
      {/* Primary Purple Orb */}
      <motion.div
        className="absolute w-[1000px] h-[1000px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, transparent 60%)",
          filter: "blur(80px)",
          top: "-20%",
          left: "10%",
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Secondary Cyan Orb */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0, 212, 255, 0.2) 0%, transparent 60%)",
          filter: "blur(60px)",
          bottom: "0%",
          right: "0%",
        }}
        animate={{
          x: [0, -80, 0],
          y: [0, -60, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Accent Orange Orb */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(252, 104, 44, 0.15) 0%, transparent 60%)",
          filter: "blur(50px)",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    TECH GRID BACKGROUND
// ═══════════════════════════════════════════════════════════════

function TechGrid() {
  return (
    <div 
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(rgba(139, 92, 246, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(139, 92, 246, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px',
        maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 70%)',
      }}
    />
  );
}

// ═══════════════════════════════════════════════════════════════
//                    ANIMATED TEXT REVEAL
// ═══════════════════════════════════════════════════════════════

function TextReveal({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <span className={`inline-block overflow-hidden ${className}`}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ y: 100, opacity: 0, rotateX: -80 }}
          animate={{ y: 0, opacity: 1, rotateX: 0 }}
          transition={{
            duration: 0.8,
            delay: delay + i * 0.025,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ transformOrigin: "bottom" }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    FLOATING BADGES
// ═══════════════════════════════════════════════════════════════

function FloatingBadges() {
  const t = useTranslations("hero");
  
  const badges = [
    { text: t("chips.lostLeads"), icon: "📉", color: "#FF6B35" },
    { text: t("chips.manualWork"), icon: "⚙️", color: "#8B5CF6" },
    { text: t("chips.handoverChaos"), icon: "🔄", color: "#00D4FF" },
    { text: t("chips.noGuidance"), icon: "🧭", color: "#FFB347" },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3 mt-8">
      {badges.map((badge, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.5 + i * 0.1, duration: 0.5 }}
          whileHover={{ scale: 1.05, y: -2 }}
          className="group relative px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 cursor-default"
          style={{
            boxShadow: `0 0 20px ${badge.color}20`,
          }}
        >
          <motion.div
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              background: `radial-gradient(circle at center, ${badge.color}20, transparent 70%)`,
            }}
          />
          <span className="relative flex items-center gap-2 text-sm text-white/70 group-hover:text-white/90 transition-colors">
            <span>{badge.icon}</span>
            <span>{badge.text}</span>
          </span>
        </motion.div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    NEON CTA BUTTON
// ═══════════════════════════════════════════════════════════════

function NeonCTAButton({ href, children, variant = "primary" }: { href: string; children: React.ReactNode; variant?: "primary" | "secondary" }) {
  if (variant === "secondary") {
    return (
      <Link href={href}>
        <motion.span
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white/80 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
        >
          {children}
        </motion.span>
      </Link>
    );
  }

  return (
    <Link href={href}>
      <motion.span
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-white cursor-pointer overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #FC682C 0%, #FF8C5A 50%, #FFB347 100%)",
          boxShadow: "0 0 40px rgba(252, 104, 44, 0.4), 0 10px 40px rgba(252, 104, 44, 0.2)",
        }}
      >
        {/* Animated shine */}
        <span className="absolute inset-0 overflow-hidden rounded-2xl">
          <motion.span
            className="absolute inset-0 -translate-x-full"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
              width: "50%",
            }}
          />
        </span>
        
        {/* Glow on hover */}
        <span 
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: "linear-gradient(135deg, #FC682C 0%, #FF8C5A 100%)",
            filter: "blur(20px)",
            transform: "scale(1.1)",
            zIndex: -1,
          }}
        />
        
        <span className="relative">{children}</span>
        
        <motion.svg 
          className="relative w-5 h-5"
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </motion.svg>
      </motion.span>
    </Link>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    TRUST INDICATORS
// ═══════════════════════════════════════════════════════════════

function TrustIndicators() {
  const t = useTranslations("hero");
  
  const items = [
    { icon: "💰", text: t("trustItems.fixedPrices") },
    { icon: "📋", text: t("trustItems.clearSteps") },
    { icon: "⚡", text: t("trustItems.fastDelivery") },
    { icon: "🔒", text: t("trustItems.ndaOptional") },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 0.6 }}
      className="flex flex-wrap justify-center gap-6 mt-12 pt-12 border-t border-white/5"
    >
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 + i * 0.1 }}
          className="flex items-center gap-2 text-sm text-white/50"
        >
          <span className="text-lg">{item.icon}</span>
          <span>{item.text}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    MAIN HERO COMPONENT
// ═══════════════════════════════════════════════════════════════

export function HeroSectionV2() {
  const t = useTranslations("hero");
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Scroll-based parallax
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const subtitleY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  
  // Mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      mouseX.set(x * 20);
      mouseY.set(y * 20);
    }
  }, [mouseX, mouseY]);

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "#030308" }}
    >
      {/* Background Layers */}
      <div className="absolute inset-0">
        <VolumetricLighting />
        <TechGrid />
        <ParticleField count={60} />
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 container px-6 py-32 text-center"
        style={{ opacity, scale }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 mb-8 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
        >
          <motion.span
            className="w-2 h-2 rounded-full bg-green-400"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-sm font-medium text-white/70">
            {t("badge")}
          </span>
        </motion.div>

        {/* Main Headlines */}
        <motion.div style={{ y: titleY, x: smoothX }}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-[0.9] tracking-tight text-white">
            <TextReveal text={t("headline1")} delay={0.4} />
          </h1>
          
          <h2 className="mt-2 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-[0.9] tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FC682C] via-[#FF8C5A] to-[#FFB347]">
              <TextReveal text={t("headline2")} delay={0.7} />
            </span>
          </h2>
        </motion.div>

        {/* Problem Chips */}
        <FloatingBadges />

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          style={{ y: subtitleY }}
          className="mt-8 max-w-2xl mx-auto text-lg sm:text-xl text-white/50 leading-relaxed"
        >
          {t("solutionBridge")}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
        >
          <NeonCTAButton href="/website-check">
            {t("ctaPrimary")}
          </NeonCTAButton>
          <NeonCTAButton href="/kontakt" variant="secondary">
            {t("ctaSecondary")}
          </NeonCTAButton>
        </motion.div>

        {/* Trust Indicators */}
        <TrustIndicators />
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs uppercase tracking-widest text-white/30">
            {t("scroll")}
          </span>
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
            <motion.div
              className="w-1 h-2 bg-white/50 rounded-full"
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#030308] to-transparent pointer-events-none" />
    </section>
  );
}

export default HeroSectionV2;
