"use client";

import { useEffect, useState } from "react";

interface AnimatedProgressProps {
  value: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export default function AnimatedProgress({
  value,
  size = "md",
  showLabel = true,
  className = "",
}: AnimatedProgressProps) {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  const sizes = {
    sm: { ring: 60, stroke: 4, text: "text-sm" },
    md: { ring: 100, stroke: 6, text: "text-2xl" },
    lg: { ring: 140, stroke: 8, text: "text-4xl" },
  };

  const { ring, stroke, text } = sizes[size];
  const radius = (ring - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedValue / 100) * circumference;

  // Color based on progress
  const getColor = (val: number) => {
    if (val >= 100) return "#22C55E"; // Green
    if (val >= 75) return "#10B981"; // Emerald
    if (val >= 50) return "#FC682C"; // Orange (brand)
    if (val >= 25) return "#F59E0B"; // Amber
    return "#EF4444"; // Red
  };

  const color = getColor(animatedValue);

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={ring} height={ring} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={ring / 2}
          cy={ring / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={stroke}
        />
        {/* Progress circle */}
        <circle
          cx={ring / 2}
          cy={ring / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 8px ${color}50)`,
          }}
        />
        {/* Glow effect */}
        <circle
          cx={ring / 2}
          cy={ring / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke / 2}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out blur-sm opacity-50"
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold text-white ${text}`}>
            {Math.round(animatedValue)}%
          </span>
          {size !== "sm" && (
            <span className="text-xs text-white/40 mt-1">Complete</span>
          )}
        </div>
      )}
    </div>
  );
}
