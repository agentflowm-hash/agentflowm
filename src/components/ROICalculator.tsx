"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

interface ROIResult {
  hoursPerMonth: number;
  costPerMonth: number;
  savingsPerYear: number;
  roi: number;
}

export function ROICalculator() {
  const t = useTranslations("roi");
  const [teamSize, setTeamSize] = useState(5);
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [hourlyRate, setHourlyRate] = useState(50);
  const [automationEfficiency, setAutomationEfficiency] = useState(70);

  const result = useMemo<ROIResult>(() => {
    const hoursPerMonth = hoursPerWeek * 4 * teamSize;
    const costPerMonth = hoursPerMonth * hourlyRate;
    const savedHours = hoursPerMonth * (automationEfficiency / 100);
    const savingsPerYear = savedHours * hourlyRate * 12;
    const investmentCost = 8390; // BUSINESS Paket
    const roi = ((savingsPerYear - investmentCost) / investmentCost) * 100;

    return {
      hoursPerMonth,
      costPerMonth,
      savingsPerYear,
      roi: Math.max(0, roi),
    };
  }, [teamSize, hoursPerWeek, hourlyRate, automationEfficiency]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/10 p-6 md:p-10">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 bg-[#FC682C]/20 text-[#FC682C] rounded-full text-sm font-medium mb-4">
            {t("badge")}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            {t("title")}
          </h2>
          <p className="text-white/60 max-w-xl mx-auto">
            {t("description")}
          </p>
        </div>

        {/* Sliders */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {/* Team Size */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-white/80 font-medium">{t("teamSize")}</label>
              <span className="text-[#FC682C] font-bold">{teamSize} {t("persons")}</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={teamSize}
              onChange={(e) => setTeamSize(Number(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#FC682C]"
            />
            <div className="flex justify-between text-xs text-white/40 mt-1">
              <span>1</span>
              <span>50</span>
            </div>
          </div>

          {/* Hours per Week */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-white/80 font-medium">{t("hoursPerWeek")}</label>
              <span className="text-[#FC682C] font-bold">{hoursPerWeek}h {t("perPerson")}</span>
            </div>
            <input
              type="range"
              min="1"
              max="40"
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(Number(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#FC682C]"
            />
            <div className="flex justify-between text-xs text-white/40 mt-1">
              <span>1h</span>
              <span>40h</span>
            </div>
          </div>

          {/* Hourly Rate */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-white/80 font-medium">{t("hourlyRate")}</label>
              <span className="text-[#FC682C] font-bold">{hourlyRate} €/h</span>
            </div>
            <input
              type="range"
              min="20"
              max="150"
              step="5"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#FC682C]"
            />
            <div className="flex justify-between text-xs text-white/40 mt-1">
              <span>20€</span>
              <span>150€</span>
            </div>
          </div>

          {/* Automation Efficiency */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-white/80 font-medium">{t("automationLevel")}</label>
              <span className="text-[#FC682C] font-bold">{automationEfficiency}%</span>
            </div>
            <input
              type="range"
              min="30"
              max="90"
              step="5"
              value={automationEfficiency}
              onChange={(e) => setAutomationEfficiency(Number(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#FC682C]"
            />
            <div className="flex justify-between text-xs text-white/40 mt-1">
              <span>30%</span>
              <span>90%</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-gradient-to-r from-[#FC682C]/20 to-orange-500/10 rounded-2xl p-6 md:p-8 border border-[#FC682C]/30">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Current Cost */}
            <div className="text-center">
              <p className="text-white/50 text-sm mb-1">{t("currentCost")}</p>
              <motion.p
                key={result.costPerMonth}
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-2xl md:text-3xl font-bold text-white"
              >
                {result.costPerMonth.toLocaleString("de-DE")} €
              </motion.p>
            </div>

            {/* Hours Saved */}
            <div className="text-center">
              <p className="text-white/50 text-sm mb-1">{t("hoursSaved")}</p>
              <motion.p
                key={result.hoursPerMonth}
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-2xl md:text-3xl font-bold text-white"
              >
                {Math.round(result.hoursPerMonth * (automationEfficiency / 100))}h
              </motion.p>
            </div>

            {/* Annual Savings */}
            <div className="text-center">
              <p className="text-white/50 text-sm mb-1">{t("annualSavings")}</p>
              <motion.p
                key={result.savingsPerYear}
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-2xl md:text-3xl font-bold text-[#FC682C]"
              >
                {result.savingsPerYear.toLocaleString("de-DE")} €
              </motion.p>
            </div>

            {/* ROI */}
            <div className="text-center">
              <p className="text-white/50 text-sm mb-1">{t("roiFirstYear")}</p>
              <motion.p
                key={result.roi}
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-2xl md:text-3xl font-bold text-green-400"
              >
                {result.roi.toFixed(0)}%
              </motion.p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 text-center">
            <Link
              href="/pakete"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#FC682C] hover:bg-[#FC682C]/90 text-white font-semibold rounded-xl transition-all hover:scale-105"
            >
              <span>{t("saveNow", { amount: result.savingsPerYear.toLocaleString("de-DE") + " €" })}</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
