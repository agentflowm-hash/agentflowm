"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function KonfiguratorPackagePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const options = [
    {
      icon: "📄",
      title: "Mehr Seiten",
      desc: "Beliebig viele Seiten und Bereiche nach Ihrem Bedarf",
    },
    {
      icon: "🔐",
      title: "Zusatzliche Portale",
      desc: "Kunden-, Mitarbeiter-, Partner-Portale mit Rollen & Rechten",
    },
    {
      icon: "📅",
      title: "Buchungssysteme",
      desc: "Termine, Reservierungen, Kalender-Integrationen",
    },
    {
      icon: "📊",
      title: "Dashboards",
      desc: "Individuelle Ubersichten und Auswertungen",
    },
    {
      icon: "🔧",
      title: "Interne Tools",
      desc: "Massgeschneiderte Werkzeuge fur Ihre Prozesse",
    },
    {
      icon: "🔗",
      title: "Integrationen",
      desc: "Anbindung an Ihre bestehenden Systeme",
    },
  ];

  const process = [
    { step: "1", title: "Anfrage", desc: "Sie beschreiben Ihr Projekt" },
    { step: "2", title: "Analyse", desc: "Wir prufen die Machbarkeit" },
    { step: "3", title: "Angebot", desc: "Transparentes Angebot mit Meilensteinen" },
    { step: "4", title: "Umsetzung", desc: "Schritt fur Schritt zum fertigen System" },
  ];

  return (
    <main className="min-h-screen bg-[#030308]">
      {/* Hero */}
      <section className="relative pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#9D65C9]/15 to-transparent blur-[120px]" />
          <div className="absolute top-[30%] right-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-[#9D65C9]/10 to-transparent blur-[100px]" />
        </div>

        <div className="container relative z-10 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Back Link */}
            <Link
              href="/pakete"
              className={`inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Alle Pakete
            </Link>

            {/* Badge */}
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#9D65C9]/10 border border-[#9D65C9]/20 mb-5 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <span className="text-lg">💎</span>
              <span className="text-xs font-medium text-[#9D65C9]">Individuell</span>
            </div>

            {/* Title */}
            <h1
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9D65C9] to-[#FC682C]">
                KONFIGURATOR
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className={`text-lg text-white/70 mb-6 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              Ihr individuelles System - genau nach Ihren Anforderungen
            </p>

            {/* Description */}
            <p
              className={`text-sm sm:text-base text-white/60 max-w-2xl mb-8 leading-relaxed transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              Wenn Umfang, Seiten, Portale oder Systembereiche individuell geplant werden sollen.
              Wir nehmen nur Projekte an, die wir qualitativ sauber liefern konnen.
            </p>

            {/* Price Box */}
            <div
              className={`inline-flex items-center gap-4 p-6 rounded-2xl bg-white/[0.03] border border-[#9D65C9]/20 mb-8 transition-all duration-700 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <div>
                <div className="text-3xl font-bold text-[#9D65C9]">auf Anfrage</div>
                <div className="text-sm text-white/50">individuelles Angebot</div>
              </div>
              <div className="h-12 w-px bg-white/10" />
              <div>
                <div className="text-sm text-white/70">Kapazitatscheck</div>
                <div className="text-lg font-semibold text-white">vor Projektstart</div>
              </div>
            </div>

            {/* CTA */}
            <div
              className={`flex flex-col sm:flex-row gap-3 transition-all duration-700 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <Link
                href="/termin?paket=konfigurator"
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#9D65C9] to-[#FC682C] text-white font-semibold hover:opacity-90 transition-all shadow-lg shadow-[#9D65C9]/25 text-center"
              >
                Angebot anfragen
              </Link>
              <Link
                href="/termin"
                className="px-6 py-3 rounded-lg border border-white/20 text-white font-semibold hover:bg-white/5 transition-all text-center"
              >
                Kostenlose Beratung
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Options */}
      <section className="py-16 border-t border-white/5">
        <div className="container px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
              Mogliche Erweiterungen
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {options.map((option, i) => (
                <div
                  key={i}
                  className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-[#9D65C9]/30 transition-all"
                >
                  <span className="text-2xl mb-3 block">{option.icon}</span>
                  <h3 className="font-semibold text-white mb-2">{option.title}</h3>
                  <p className="text-sm text-white/60">{option.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 border-t border-white/5 bg-gradient-to-b from-[#9D65C9]/5 to-transparent">
        <div className="container px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
              So funktioniert es
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {process.map((item, i) => (
                <div key={i} className="relative p-5 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                  <div className="w-10 h-10 rounded-full bg-[#9D65C9]/20 flex items-center justify-center text-[#9D65C9] font-bold mb-3">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-xs text-white/60">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ideal For */}
      <section className="py-16 border-t border-white/5">
        <div className="container px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
              Perfekt fur Sie, wenn...
            </h2>
            <div className="space-y-3 text-left max-w-xl mx-auto">
              {[
                "Ihre Anforderungen uber die Standard-Pakete hinausgehen",
                "Sie ein komplexes System mit mehreren Bereichen brauchen",
                "Sie spezielle Integrationen oder Funktionen benotigen",
                "Sie ein langfristiges Projekt mit klaren Meilensteinen wunschen",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02]">
                  <svg className="w-5 h-5 text-[#9D65C9] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white/80">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-12 border-t border-white/5">
        <div className="container px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="p-6 rounded-xl bg-[#9D65C9]/10 border border-[#9D65C9]/20">
              <div className="flex items-start gap-4">
                <span className="text-2xl">⚠️</span>
                <div>
                  <h3 className="font-semibold text-white mb-2">Qualitatssicherung</h3>
                  <p className="text-sm text-white/70">
                    Wir nehmen nur Projekte an, die wir qualitativ sauber liefern konnen.
                    Vor Projektstart prufen wir unsere Kapazitaten, damit Geschwindigkeit
                    und Qualitat fur Sie stabil bleiben.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-white/5 bg-gradient-to-t from-[#9D65C9]/5 to-transparent">
        <div className="container px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Haben Sie ein individuelles Projekt?
            </h2>
            <p className="text-white/60 mb-6">
              Lassen Sie uns gemeinsam prufen, was Sie brauchen - und was wir liefern konnen.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/termin?paket=konfigurator"
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#9D65C9] to-[#FC682C] text-white font-semibold hover:opacity-90 transition-all shadow-lg shadow-[#9D65C9]/25 text-center"
              >
                Angebot anfragen
              </Link>
              <Link
                href="/pakete"
                className="px-6 py-3 rounded-lg border border-white/20 text-white font-semibold hover:bg-white/5 transition-all text-center"
              >
                Andere Pakete ansehen
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
