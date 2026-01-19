'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useMouseParallax } from '@/hooks/useScrollAnimation';

interface ParallaxBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

export function ParallaxBackground({ className = '', children }: ParallaxBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePosition = useMouseParallax();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Smooth spring animations
  const springConfig = { damping: 15, stiffness: 100 };
  
  // Parallax transforms
  const y1 = useSpring(useTransform(scrollYProgress, [0, 1], [0, -100]), springConfig);
  const y2 = useSpring(useTransform(scrollYProgress, [0, 1], [0, -200]), springConfig);
  const y3 = useSpring(useTransform(scrollYProgress, [0, 1], [0, -300]), springConfig);
  
  const opacity1 = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0]);
  const opacity2 = useTransform(scrollYProgress, [0, 0.7, 1], [0.8, 0.4, 0]);
  const opacity3 = useTransform(scrollYProgress, [0, 0.9, 1], [0.6, 0.3, 0]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Parallax orbs */}
      <motion.div
        className="absolute top-10 right-10 w-96 h-96 rounded-full"
        style={{
          y: y1,
          opacity: opacity1,
          x: mousePosition.x * 20,
          background: 'radial-gradient(circle, rgba(252, 104, 44, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      
      <motion.div
        className="absolute top-1/3 left-20 w-72 h-72 rounded-full"
        style={{
          y: y2,
          opacity: opacity2,
          x: mousePosition.x * -30,
          background: 'radial-gradient(circle, rgba(255, 179, 87, 0.12) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      
      <motion.div
        className="absolute bottom-20 right-1/3 w-80 h-80 rounded-full"
        style={{
          y: y3,
          opacity: opacity3,
          x: mousePosition.x * 40,
          background: 'radial-gradient(circle, rgba(252, 104, 44, 0.1) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-orange-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      {/* Main content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

// Parallax section wrapper
export function ParallaxSection({ 
  children, 
  speed = 0.5,
  className = '' 
}: { 
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed]);

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className={className}
    >
      {children}
    </motion.div>
  );
}