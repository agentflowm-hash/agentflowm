"use client";

import { useState } from "react";
import {
  SparklesIcon,
  LightBulbIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface Insight {
  id: string;
  type: "opportunity" | "warning" | "tip" | "success";
  title: string;
  description: string;
  action?: string;
  actionLabel?: string;
  priority?: "high" | "medium" | "low";
}

interface AIInsightsProps {
  insights: Insight[];
  onActionClick?: (insight: Insight) => void;
  onDismiss?: (insightId: string) => void;
}

const insightStyles = {
  opportunity: {
    icon: ArrowTrendingUpIcon,
    gradient: "from-emerald-500/20 to-cyan-500/20",
    border: "border-emerald-500/30",
    iconColor: "text-emerald-400",
    badge: "bg-emerald-500/20 text-emerald-400",
  },
  warning: {
    icon: ExclamationTriangleIcon,
    gradient: "from-amber-500/20 to-orange-500/20",
    border: "border-amber-500/30",
    iconColor: "text-amber-400",
    badge: "bg-amber-500/20 text-amber-400",
  },
  tip: {
    icon: LightBulbIcon,
    gradient: "from-blue-500/20 to-purple-500/20",
    border: "border-blue-500/30",
    iconColor: "text-blue-400",
    badge: "bg-blue-500/20 text-blue-400",
  },
  success: {
    icon: CheckCircleIcon,
    gradient: "from-green-500/20 to-emerald-500/20",
    border: "border-green-500/30",
    iconColor: "text-green-400",
    badge: "bg-green-500/20 text-green-400",
  },
};

export default function AIInsights({
  insights,
  onActionClick,
  onDismiss,
}: AIInsightsProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const visibleInsights = insights.filter((i) => !dismissed.has(i.id));

  const handleDismiss = (id: string) => {
    setDismissed((prev) => new Set([...prev, id]));
    onDismiss?.(id);
  };

  if (visibleInsights.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#FC682C] to-pink-500 flex items-center justify-center">
          <SparklesIcon className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">KI-Insights</h3>
          <p className="text-xs text-white/40">{visibleInsights.length} aktive Empfehlungen</p>
        </div>
      </div>

      {/* Insights */}
      <div className="space-y-3">
        {visibleInsights.map((insight, i) => {
          const style = insightStyles[insight.type];
          const Icon = style.icon;

          return (
            <div
              key={insight.id}
              className={`relative p-4 rounded-xl bg-gradient-to-r ${style.gradient} border ${style.border} group hover:scale-[1.02] transition-transform`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Priority Badge */}
              {insight.priority === "high" && (
                <span className="absolute -top-2 -right-2 px-2 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full">
                  WICHTIG
                </span>
              )}

              {/* Dismiss Button */}
              <button
                onClick={() => handleDismiss(insight.id)}
                className="absolute top-2 right-2 p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-all"
              >
                <XMarkIcon className="w-4 h-4 text-white/50" />
              </button>

              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center ${style.iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <p className="font-medium text-white text-sm">{insight.title}</p>
                  <p className="text-xs text-white/60 mt-1">{insight.description}</p>

                  {/* Action Button */}
                  {insight.action && (
                    <button
                      onClick={() => onActionClick?.(insight)}
                      className="mt-3 flex items-center gap-1 text-xs font-medium text-[#FC682C] hover:text-white transition-colors"
                    >
                      {insight.actionLabel || "Aktion ausführen"}
                      <ChevronRightIcon className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
