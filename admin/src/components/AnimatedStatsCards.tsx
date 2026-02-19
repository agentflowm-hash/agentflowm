"use client";

import { useState, useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

interface StatCard {
  id: string;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  change: number;
  icon: string;
  color: string;
  sparkline: number[];
}

function AnimatedNumber({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const spring = useSpring(0, { stiffness: 100, damping: 30 });
  const display = useTransform(spring, (current) => 
    `${prefix}${Math.round(current).toLocaleString("de-DE")}${suffix}`
  );

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{display}</motion.span>;
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg className="w-full h-12" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        vectorEffect="non-scaling-stroke"
      />
      <polygon
        fill={`url(#gradient-${color})`}
        points={`0,100 ${points} 100,100`}
      />
    </svg>
  );
}

export function AnimatedStatsCards() {
  const [stats, setStats] = useState<StatCard[]>([
    {
      id: "revenue",
      label: "Umsatz (MTD)",
      value: 47890,
      prefix: "",
      suffix: " €",
      change: 12.5,
      icon: "💰",
      color: "#22c55e",
      sparkline: [3200, 4100, 3800, 5200, 4900, 6100, 7200, 8100, 7800, 9200],
    },
    {
      id: "leads",
      label: "Neue Leads",
      value: 127,
      change: 23.1,
      icon: "📥",
      color: "#3b82f6",
      sparkline: [8, 12, 9, 15, 11, 18, 14, 22, 19, 25],
    },
    {
      id: "visitors",
      label: "Website Besucher",
      value: 3842,
      change: -4.2,
      icon: "👀",
      color: "#a855f7",
      sparkline: [450, 520, 380, 490, 410, 380, 420, 350, 390, 360],
    },
    {
      id: "conversion",
      label: "Conversion Rate",
      value: 3.8,
      suffix: "%",
      change: 0.5,
      icon: "🎯",
      color: "#f59e0b",
      sparkline: [2.1, 2.8, 2.5, 3.2, 2.9, 3.5, 3.1, 3.8, 3.4, 3.8],
    },
  ]);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) =>
        prev.map((stat) => ({
          ...stat,
          value: stat.value + (Math.random() - 0.3) * (stat.value * 0.02),
          sparkline: [...stat.sparkline.slice(1), stat.sparkline[stat.sparkline.length - 1] + (Math.random() - 0.4) * 10],
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-2xl border border-white/10 p-4 overflow-hidden group hover:border-white/20 transition-colors"
        >
          {/* Glow Effect */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle at 50% 120%, ${stat.color}20, transparent 60%)`,
            }}
          />

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{stat.icon}</span>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  stat.change >= 0
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {stat.change >= 0 ? "↑" : "↓"} {Math.abs(stat.change).toFixed(1)}%
              </span>
            </div>

            <div className="mb-1">
              <p className="text-2xl font-bold text-white">
                <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </p>
              <p className="text-white/40 text-sm">{stat.label}</p>
            </div>

            {/* Sparkline */}
            <div className="mt-3 -mx-2">
              <Sparkline data={stat.sparkline} color={stat.color} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
