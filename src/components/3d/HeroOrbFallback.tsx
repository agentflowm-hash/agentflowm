'use client';

import { motion } from 'framer-motion';

/**
 * CSS-based animated orb fallback
 * This renders immediately without any JS bundle loading
 * Used as placeholder while 3D loads, or permanently on mobile
 */
export function HeroOrbFallback({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {/* Main orb with gradient */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `
            radial-gradient(
              circle at 35% 35%,
              rgba(255, 255, 255, 0.4) 0%,
              rgba(255, 171, 145, 0.6) 15%,
              rgba(252, 104, 44, 0.8) 35%,
              rgba(255, 64, 48, 0.9) 55%,
              rgba(157, 101, 201, 0.7) 75%,
              rgba(157, 101, 201, 0.3) 100%
            )
          `,
          boxShadow: `
            0 0 80px 20px rgba(252, 104, 44, 0.4),
            0 0 120px 40px rgba(255, 64, 48, 0.2),
            inset 0 0 60px 10px rgba(255, 255, 255, 0.1)
          `,
        }}
        animate={{
          scale: [1, 1.02, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Inner glow layer */}
      <motion.div
        className="absolute inset-[15%] rounded-full"
        style={{
          background: `
            radial-gradient(
              circle at 40% 40%,
              rgba(255, 255, 255, 0.6) 0%,
              rgba(255, 179, 71, 0.5) 30%,
              rgba(252, 104, 44, 0.3) 60%,
              transparent 100%
            )
          `,
        }}
        animate={{
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Floating sparkle dots */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-white/80"
          style={{
            top: `${20 + i * 15}%`,
            left: `${25 + i * 12}%`,
            boxShadow: '0 0 10px 2px rgba(255, 255, 255, 0.6)',
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1.2, 0.8],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
            ease: 'easeInOut',
          }}
        />
      ))}
      
      {/* Subtle ring */}
      <motion.div
        className="absolute inset-[-5%] rounded-full border border-[var(--color-accent)]/20"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}

export default HeroOrbFallback;
