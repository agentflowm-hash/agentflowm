"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Goal {
  id: string;
  name: string;
  current: number;
  target: number;
  unit: string;
  icon: string;
  color: string;
  deadline?: string;
}

export function GoalsWidget() {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "revenue",
      name: "Monatsumsatz",
      current: 47890,
      target: 60000,
      unit: "€",
      icon: "💰",
      color: "#22c55e",
      deadline: "31. Dez",
    },
    {
      id: "leads",
      name: "Leads Q4",
      current: 127,
      target: 200,
      unit: "",
      icon: "📥",
      color: "#3b82f6",
      deadline: "Q4 2026",
    },
    {
      id: "projects",
      name: "Projekte abgeschlossen",
      current: 8,
      target: 12,
      unit: "",
      icon: "🚀",
      color: "#a855f7",
      deadline: "Dezember",
    },
    {
      id: "reviews",
      name: "5-Sterne Reviews",
      current: 23,
      target: 30,
      unit: "",
      icon: "⭐",
      color: "#f59e0b",
    },
  ]);

  const [editingGoal, setEditingGoal] = useState<string | null>(null);

  const getProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === "€") {
      return value.toLocaleString("de-DE") + " €";
    }
    return value.toString();
  };

  return (
    <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-2xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-xl">🎯</span>
          </div>
          <div>
            <h3 className="font-semibold text-white">Ziele & Targets</h3>
            <p className="text-white/40 text-sm">Fortschritt tracken</p>
          </div>
        </div>
        <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/60 text-xs rounded-lg transition-colors">
          + Neues Ziel
        </button>
      </div>

      {/* Goals List */}
      <div className="p-4 space-y-4">
        {goals.map((goal, index) => {
          const progress = getProgress(goal.current, goal.target);
          const isAchieved = progress >= 100;

          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{goal.icon}</span>
                  <span className="text-white font-medium text-sm">{goal.name}</span>
                  {isAchieved && (
                    <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full">
                      ✓ Erreicht!
                    </span>
                  )}
                </div>
                {goal.deadline && (
                  <span className="text-white/30 text-xs">{goal.deadline}</span>
                )}
              </div>

              {/* Progress Bar */}
              <div className="relative h-3 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }}
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${goal.color}, ${goal.color}99)`,
                    boxShadow: `0 0 10px ${goal.color}50`,
                  }}
                />
                {/* Milestone markers */}
                <div className="absolute inset-0 flex justify-between px-1">
                  {[25, 50, 75].map((milestone) => (
                    <div
                      key={milestone}
                      className="w-px h-full bg-white/10"
                      style={{ marginLeft: `${milestone}%` }}
                    />
                  ))}
                </div>
              </div>

              {/* Values */}
              <div className="flex items-center justify-between mt-1">
                <span className="text-white/60 text-xs">
                  {formatValue(goal.current, goal.unit)} / {formatValue(goal.target, goal.unit)}
                </span>
                <span
                  className="text-xs font-bold"
                  style={{ color: goal.color }}
                >
                  {progress.toFixed(0)}%
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="p-4 border-t border-white/10 bg-white/[0.02]">
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/40">
            {goals.filter((g) => getProgress(g.current, g.target) >= 100).length}/{goals.length} Ziele erreicht
          </span>
          <span className="text-white/40">
            Ø {(goals.reduce((acc, g) => acc + getProgress(g.current, g.target), 0) / goals.length).toFixed(0)}% Fortschritt
          </span>
        </div>
      </div>
    </div>
  );
}
