"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function BusinessPackagePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: "🌐",
      title: "Landingpage + 8 Unterseiten",
      desc: "Bis zu 9 perfekt optimierte Seiten fur Ihren umfassenden Webauftritt",
    },
    {
      icon: "🔍",
      title: "High-Quality SEO + Performance",
      desc: "Erweiterte Suchmaschinenoptimierung fur maximale Sichtbarkeit",
    },
    {
      icon: "🚀",
      title: "Live-ready Setup + Betriebsstart",
      desc: "Technisch sauber mit vollstandiger Betriebsbereitschaft",
    },
    {
      icon: "⚙️",
      title: "Admin-Portal (erweitert)",
      desc: "Umfangreiche Verwaltungsmoglichkeiten fur Inhalte und Anfragen",
    },
    {
      icon: "👤",
      title: "Kundenportal",
      desc: "Freigaben, Uploads, Status, Dokumente - projektabhangig",
    },
    {
      icon: "👥",
      title: "Mitarbeiterportal",
      desc: "Aufgaben, Zustandigkeiten, interne Bereiche - projektabhangig",
    },
  ];

  const benefits = [
    {
      icon: "📊",
      title: "Ubersicht",
      desc: "Alle Anfragen und Leads zentral im Blick",
    },
    {
      icon: "🔐",
      title: "Kontrolle",
      desc: "Rollen und Rechte sauber organisiert",
    },
    {
      icon: "📈",
      title: "Skalierbar",
      desc: "Wachst mit Ihrem Unternehmen mit",
    },
    {
      icon: "⚡",
      title: "Effizient",
      desc: "Interne Prozesse laufen reibungslos",
    },
  ];

  const process = [
    {
      step: "1",
      title: "Strategie-Call",
      desc: "Tiefgehende Analyse Ihrer Anforderungen",
    },
    {
      step: "2",
      title: "Konzeption",
      desc: "Portal-Struktur und User-Flows definieren",
    },
    { step: "3", title: "Design", desc: "Modernes UI/UX fur alle Bereiche" },
    {
      step: "4",
      title: "Entwicklung",
      desc: "Website + Portale werden gebaut",
    },
    { step: "5", title: "Testing", desc: "Qualitatscheck aller Funktionen" },
    { step: "6", title: "Go-Live", desc: "Launch mit Einweisung" },
  ];

  return (
    <main className="min-h-screen bg-[#030308]">
      {/* Hero */}
      <section className="relative pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#FC682C]/15 to-transparent blur-[120px]" />
          <div className="absolute top-[30%] right-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-[#FC682C]/10 to-transparent blur-[100px]" />
        </div>

        <div className="container relative z-10 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Back Link */}
            <Link
              href="/pakete"
              className={`inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Alle Pakete
            </Link>

            {/* Badge */}
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FC682C]/10 border border-[#FC682C]/20 mb-5 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <span className="text-lg">⚡</span>
              <span className="text-xs font-medium text-[#FC682C]">
                Empfohlen
              </span>
            </div>

            {/* Title */}
            <h1
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FC682C] to-[#FFB347]">
                BUSINESS
              </span>
              <span className="text-white"> Paket</span>
            </h1>

            {/* Subtitle */}
            <p
              className={`text-lg text-white/70 mb-6 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              Website + Admin + Portale
            </p>

            {/* Description */}
            <p
              className={`text-sm sm:text-base text-white/60 max-w-2xl mb-8 leading-relaxed transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              Fur Unternehmen, die Wachstum wollen - mit Kontrolle, Ubersicht
              und internen Bereichen. Das ist das Paket fur Unternehmen, die
              nicht nur online sein wollen, sondern intern Struktur brauchen.
            </p>

            {/* Price Box */}
            <div
              className={`inline-flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#FC682C]/10 to-transparent border border-[#FC682C]/30 mb-8 transition-all duration-700 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <div>
                <div className="text-4xl font-bold text-[#FC682C]">
                  11.990 €
                </div>
                <div className="text-sm text-white/50">einmalig</div>
              </div>
              <div className="h-12 w-px bg-white/10" />
              <div>
                <div className="text-sm text-white/70">Umsetzungszeit</div>
                <div className="text-lg font-semibold text-white">
                  3-4 Wochen
                </div>
              </div>
            </div>

            {/* CTA */}
            <div
              className={`flex flex-col sm:flex-row gap-3 transition-all duration-700 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <Link
                href="/termin?paket=business"
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#FC682C] to-[#e55a1f] text-white font-semibold hover:opacity-90 transition-all shadow-lg shadow-[#FC682C]/25 text-center"
              >
                Business auswahlen
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
                  className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-[#FC682C]/30 transition-all"
                >
                  <span className="text-2xl mb-3 block">{feature.icon}</span>
                  <h3 className="font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-white/60">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 border-t border-white/5 bg-gradient-to-b from-[#FC682C]/5 to-transparent">
        <div className="container px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
              Ihre Vorteile mit Portalen
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {benefits.map((benefit, i) => (
                <div
                  key={i}
                  className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-center"
                >
                  <span className="text-3xl mb-3 block">{benefit.icon}</span>
                  <h3 className="font-semibold text-white mb-1">
                    {benefit.title}
                  </h3>
                  <p className="text-xs text-white/60">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 border-t border-white/5">
        <div className="container px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
              So lauft das Projekt ab
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
              {process.map((item, i) => (
                <div
                  key={i}
                  className="relative p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]"
                >
                  <div className="w-8 h-8 rounded-full bg-[#FC682C]/20 flex items-center justify-center text-[#FC682C] font-bold text-sm mb-2">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-1">
                    {item.title}
                  </h3>
                  <p className="text-[10px] text-white/60">{item.desc}</p>
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
                "Sie ein wachsendes Unternehmen fuhren",
                "Sie interne Prozesse digitalisieren wollen",
                "Ihre Kunden oder Mitarbeiter Zugang zu Bereichen brauchen",
                "Sie Anfragen und Leads strukturiert verwalten mochten",
                "Sie langfristig skalieren wollen",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02]"
                >
                  <svg
                    className="w-5 h-5 text-[#FC682C] mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-white/80">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-white/5 bg-gradient-to-t from-[#FC682C]/5 to-transparent">
        <div className="container px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Bereit fur Ihr System?
            </h2>
            <p className="text-white/60 mb-6">
              In 3-4 Wochen haben Sie Website + Portale - alles aus einer Hand.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/termin?paket=business"
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#FC682C] to-[#e55a1f] text-white font-semibold hover:opacity-90 transition-all shadow-lg shadow-[#FC682C]/25 text-center"
              >
                Jetzt starten - 11.990 €
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
