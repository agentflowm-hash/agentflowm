"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function WebAppPackagePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: "📋",
      title: "Konzept & Struktur",
      desc: "Screens, Rollen, Logik - alles durchdacht und dokumentiert",
    },
    {
      icon: "🎨",
      title: "UI/UX Design",
      desc: "Modernes, responsives Design fur alle Gerate",
    },
    {
      icon: "⚙️",
      title: "Funktionsentwicklung",
      desc: "Umsetzung aller Funktionen im vereinbarten Umfang",
    },
    {
      icon: "🧪",
      title: "Test & Qualitatscheck",
      desc: "Umfangreiche Tests fur stabile Performance",
    },
    {
      icon: "🚀",
      title: "Go-live-Vorbereitung",
      desc: "Alles bereit fur den produktiven Einsatz",
    },
    {
      icon: "📦",
      title: "Ubergabe",
      desc: "Vollstandige Ubergabe, optional auch als Code",
    },
  ];

  const useCases = [
    { icon: "📊", title: "Dashboards", desc: "Ubersichten und Auswertungen" },
    { icon: "📝", title: "Formulare", desc: "Komplexe Datenerfassung" },
    { icon: "👥", title: "Benutzerverwaltung", desc: "Rollen und Rechte" },
    { icon: "📁", title: "Dokumentenmanagement", desc: "Upload und Verwaltung" },
    { icon: "📅", title: "Buchungssysteme", desc: "Termine und Reservierungen" },
    { icon: "💬", title: "Kommunikation", desc: "Interne Nachrichten" },
  ];

  return (
    <main className="min-h-screen bg-[#030308]">
      {/* Hero */}
      <section className="relative pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#06b6d4]/15 to-transparent blur-[120px]" />
          <div className="absolute top-[30%] right-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-[#06b6d4]/10 to-transparent blur-[100px]" />
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
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#06b6d4]/10 border border-[#06b6d4]/20 mb-5 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <span className="text-lg">🖥️</span>
              <span className="text-xs font-medium text-[#06b6d4]">Software</span>
            </div>

            {/* Title */}
            <h1
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#06b6d4] to-[#0891b2]">
                Web-App
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className={`text-lg text-white/70 mb-6 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              Browserbasiertes System - produktionsreif umgesetzt
            </p>

            {/* Description */}
            <p
              className={`text-sm sm:text-base text-white/60 max-w-2xl mb-8 leading-relaxed transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              Ein vollstandiges browserbasiertes System mit Logins, Rollen und Bereichen.
              Keine Installation notig - Ihre Nutzer greifen einfach uber den Browser zu.
            </p>

            {/* Price Box */}
            <div
              className={`inline-flex items-center gap-4 p-6 rounded-2xl bg-white/[0.03] border border-[#06b6d4]/20 mb-8 transition-all duration-700 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <div>
                <div className="text-4xl font-bold text-[#06b6d4]">26.990 €</div>
                <div className="text-sm text-white/50">Festpreis</div>
              </div>
              <div className="h-12 w-px bg-white/10" />
              <div>
                <div className="text-sm text-white/70">Inklusive</div>
                <div className="text-lg font-semibold text-white">Code-Ubergabe</div>
              </div>
            </div>

            {/* CTA */}
            <div
              className={`flex flex-col sm:flex-row gap-3 transition-all duration-700 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <Link
                href="/termin?paket=webapp"
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#06b6d4] to-[#0891b2] text-white font-semibold hover:opacity-90 transition-all shadow-lg shadow-[#06b6d4]/25 text-center"
              >
                Web-App anfragen
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

      {/* Features */}
      <section className="py-16 border-t border-white/5">
        <div className="container px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
              Was ist enthalten?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-[#06b6d4]/30 transition-all"
                >
                  <span className="text-2xl mb-3 block">{feature.icon}</span>
                  <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-white/60">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 border-t border-white/5 bg-gradient-to-b from-[#06b6d4]/5 to-transparent">
        <div className="container px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
              Typische Anwendungsfalle
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {useCases.map((useCase, i) => (
                <div key={i} className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-center">
                  <span className="text-3xl mb-3 block">{useCase.icon}</span>
                  <h3 className="font-semibold text-white mb-1">{useCase.title}</h3>
                  <p className="text-xs text-white/60">{useCase.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-16 border-t border-white/5">
        <div className="container px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
              Vorteile einer Web-App
            </h2>
            <div className="space-y-3 text-left max-w-xl mx-auto">
              {[
                "Kein App-Store notwendig - sofort nutzbar",
                "Funktioniert auf jedem Gerat mit Browser",
                "Einfache Updates ohne Nutzer-Aktion",
                "Volle Kontrolle uber Ihre Daten",
                "Skaliert mit Ihrem Wachstum",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02]">
                  <svg className="w-5 h-5 text-[#06b6d4] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white/80">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-white/5 bg-gradient-to-t from-[#06b6d4]/5 to-transparent">
        <div className="container px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Bereit fur Ihre Web-App?
            </h2>
            <p className="text-white/60 mb-6">
              Lassen Sie uns Ihr Projekt besprechen - Festpreis, klare Meilensteine.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/termin?paket=webapp"
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#06b6d4] to-[#0891b2] text-white font-semibold hover:opacity-90 transition-all shadow-lg shadow-[#06b6d4]/25 text-center"
              >
                Jetzt anfragen - 26.990 €
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
