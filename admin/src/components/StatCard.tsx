"use client";

import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from "@heroicons/react/24/outline";
import Sparkline from "./Sparkline";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  sparklineData?: number[];
  sparklineColor?: string;
  onClick?: () => void;
}

export default function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  iconColor = "from-[#FC682C] to-[#FF8F5C]",
  sparklineData,
  sparklineColor = "#FC682C",
  onClick,
}: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;
  const TrendIcon = isPositive ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;

  return (
    <div
      onClick={onClick}
      className={`p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all group ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className="flex items-start justify-between mb-4">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${iconColor} flex items-center justify-center shadow-lg shadow-[#FC682C]/20`}>
          <Icon className="w-6 h-6 text-white" />
        </div>

        {/* Sparkline */}
        {sparklineData && sparklineData.length > 0 && (
          <Sparkline data={sparklineData} color={sparklineColor} width={80} height={28} />
        )}
      </div>

      {/* Value */}
      <p className="text-3xl font-bold text-white mb-1 group-hover:text-[#FC682C] transition-colors">
        {value}
      </p>

      {/* Title & Change */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/50">{title}</p>

        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
            <TrendIcon className="w-3 h-3" />
            <span>{isPositive ? "+" : ""}{change}%</span>
            {changeLabel && <span className="text-white/30 ml-1">{changeLabel}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
