"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function StartPackagePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: "🌐",
      title: "Landingpage + 2 Unterseiten",
      desc: "3 perfekt optimierte Seiten fur Ihren professionellen Webauftritt",
    },
    {
      icon: "🔍",
      title: "High-Quality SEO",
      desc: "Suchmaschinenoptimierung fur bessere Sichtbarkeit von Anfang an",
    },
    {
      icon: "📞",
      title: "Kontakt- & Terminfluss",
      desc: "Klare Fuhrung Ihrer Besucher zur Kontaktaufnahme",
    },
    {
      icon: "🚀",
      title: "Live-ready Setup",
      desc: "Technisch sauber, sofort einsatzbereit",
    },
    {
      icon: "⚙️",
      title: "Admin-Portal (Basis)",
      desc: "Inhalte selbst pflegen und verwalten",
    },
    {
      icon: "📱",
      title: "Responsive Design",
      desc: "Perfekte Darstellung auf allen Geraten",
    },
  ];

  const process = [
    { step: "1", title: "Kickoff-Call", desc: "Wir besprechen Ihre Ziele und Anforderungen" },
    { step: "2", title: "Design & Konzept", desc: "Wir erstellen Ihr individuelles Design" },
    { step: "3", title: "Entwicklung", desc: "Umsetzung mit modernsten Technologien" },
    { step: "4", title: "Go-Live", desc: "Ihre Website geht online" },
  ];

  return (
    <main className="min-h-screen bg-[#030308]">
      {/* Hero */}
      <section className="relative pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#FFB347]/15 to-transparent blur-[120px]" />
          <div className="absolute top-[30%] right-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-[#FFB347]/10 to-transparent blur-[100px]" />
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
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFB347]/10 border border-[#FFB347]/20 mb-5 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <span className="text-lg">🚀</span>
              <span className="text-xs font-medium text-[#FFB347]">Schneller Start</span>
            </div>

            {/* Title */}
            <h1
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB347] to-[#FC682C]">
                START
              </span>
              <span className="text-white"> Paket</span>
            </h1>

            {/* Subtitle */}
            <p
              className={`text-lg text-white/70 mb-6 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              Website + Admin-Portal
            </p>

            {/* Description */}
            <p
              className={`text-sm sm:text-base text-white/60 max-w-2xl mb-8 leading-relaxed transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              Fur wen: schneller, professioneller Start - sofort serios, sofort kontaktstark.
              Ideal, wenn Sie schnell live gehen wollen - ohne spater neu bauen zu mussen.
            </p>

            {/* Price Box */}
            <div
              className={`inline-flex items-center gap-4 p-6 rounded-2xl bg-white/[0.03] border border-[#FFB347]/20 mb-8 transition-all duration-700 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <div>
                <div className="text-4xl font-bold text-[#FFB347]">5.390 €</div>
                <div className="text-sm text-white/50">einmalig</div>
              </div>
              <div className="h-12 w-px bg-white/10" />
              <div>
                <div className="text-sm text-white/70">Umsetzungszeit</div>
                <div className="text-lg font-semibold text-white">1-2 Wochen</div>
              </div>
            </div>

            {/* CTA */}
            <div
              className={`flex flex-col sm:flex-row gap-3 transition-all duration-700 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <Link
                href="/termin?paket=start"
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#FFB347] to-[#FC682C] text-white font-semibold hover:opacity-90 transition-all shadow-lg shadow-[#FFB347]/25 text-center"
              >
                Start auswahlen
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
                  className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-[#FFB347]/30 transition-all"
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

      {/* Process */}
      <section className="py-16 border-t border-white/5 bg-gradient-to-b from-[#FFB347]/5 to-transparent">
        <div className="container px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
              So lauft das Projekt ab
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {process.map((item, i) => (
                <div key={i} className="relative p-5 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                  <div className="w-10 h-10 rounded-full bg-[#FFB347]/20 flex items-center justify-center text-[#FFB347] font-bold mb-3">
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
                "Sie schnell einen professionellen Webauftritt brauchen",
                "Sie gerade erst starten oder Ihre alte Website ersetzen wollen",
                "Sie eine klare, fokussierte Prasenz ohne Schnorkel wunschen",
                "Sie ein begrenztes Budget haben, aber Qualitat erwarten",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02]">
                  <svg className="w-5 h-5 text-[#FFB347] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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
      <section className="py-16 border-t border-white/5 bg-gradient-to-t from-[#FFB347]/5 to-transparent">
        <div className="container px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Bereit fur Ihren Start?
            </h2>
            <p className="text-white/60 mb-6">
              In 1-2 Wochen ist Ihre neue Website online.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/termin?paket=start"
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#FFB347] to-[#FC682C] text-white font-semibold hover:opacity-90 transition-all shadow-lg shadow-[#FFB347]/25 text-center"
              >
                Jetzt starten - 5.390 €
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
