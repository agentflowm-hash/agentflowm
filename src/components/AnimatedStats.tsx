"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface Stat {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  icon?: string;
}

const stats: Stat[] = [
  {
    value: 500,
    suffix: "+",
    label: "Workflows automatisiert",
    icon: "⚡",
  },
  {
    value: 120,
    suffix: "+",
    label: "Zufriedene Kunden",
    icon: "🎯",
  },
  {
    value: 50000,
    suffix: "+",
    label: "Stunden eingespart",
    icon: "⏱️",
  },
  {
    value: 98,
    suffix: "%",
    label: "Kundenzufriedenheit",
    icon: "⭐",
  },
];

function AnimatedNumber({
  value,
  suffix = "",
  prefix = "",
  duration = 2,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(easeOut * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, value, duration]);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return num.toLocaleString("de-DE");
    }
    return num.toString();
  };

  return (
    <span ref={ref}>
      {prefix}
      {formatNumber(displayValue)}
      {suffix}
    </span>
  );
}

export function AnimatedStats() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FC682C]/5 to-transparent" />

      <div className="container relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              {/* Icon */}
              <span className="text-4xl mb-4 block">{stat.icon}</span>

              {/* Number */}
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent mb-2">
                <AnimatedNumber
                  value={stat.value}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                />
              </div>

              {/* Label */}
              <p className="text-white/60 text-sm md:text-base">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Compact version for hero sections
export function AnimatedStatsCompact() {
  const compactStats = [
    { value: 500, suffix: "+", label: "Workflows" },
    { value: 120, suffix: "+", label: "Kunden" },
    { value: 98, suffix: "%", label: "Zufrieden" },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-8 md:gap-16">
      {compactStats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
          className="text-center"
        >
          <div className="text-2xl md:text-3xl font-bold text-white">
            <AnimatedNumber value={stat.value} suffix={stat.suffix} />
          </div>
          <p className="text-white/50 text-sm">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
