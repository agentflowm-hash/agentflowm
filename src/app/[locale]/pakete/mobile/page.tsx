"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function MobileAppPackagePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: "📋",
      title: "Konzept & Struktur",
      desc: "User-Flows, Screens, Rollen - durchdacht und dokumentiert",
    },
    {
      icon: "📱",
      title: "Mobile-first UI/UX",
      desc: "Optimales Design fur Smartphones und Tablets",
    },
    {
      icon: "⚙️",
      title: "Funktionsentwicklung",
      desc: "Umsetzung aller Funktionen im vereinbarten Umfang",
    },
    {
      icon: "🧪",
      title: "Tests & Stabilitatscheck",
      desc: "Intensive Tests auf verschiedenen Geraten",
    },
    {
      icon: "🚀",
      title: "Veroffentlichungsvorbereitung",
      desc: "App Store & Google Play ready",
    },
    {
      icon: "📦",
      title: "Ubergabe",
      desc: "Vollstandige Ubergabe, optional auch als Code",
    },
  ];

  const platforms = [
    { icon: "🍎", title: "iOS", desc: "iPhone & iPad" },
    { icon: "🤖", title: "Android", desc: "Smartphones & Tablets" },
  ];

  return (
    <main className="min-h-screen bg-[#030308]">
      {/* Hero */}
      <section className="relative pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#8B5CF6]/15 to-transparent blur-[120px]" />
          <div className="absolute top-[30%] right-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-[#8B5CF6]/10 to-transparent blur-[100px]" />
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
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 mb-5 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <span className="text-lg">📱</span>
              <span className="text-xs font-medium text-[#8B5CF6]">Mobile App</span>
            </div>

            {/* Title */}
            <h1
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#a78bfa]">
                Mobile App
              </span>
              <span className="text-white/70 text-2xl sm:text-3xl lg:text-4xl ml-2">iOS & Android</span>
            </h1>

            {/* Subtitle */}
            <p
              className={`text-lg text-white/70 mb-6 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              Komplette App-Umsetzung - skalierbar und sauber ubergeben
            </p>

            {/* Description */}
            <p
              className={`text-sm sm:text-base text-white/60 max-w-2xl mb-8 leading-relaxed transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              Eine vollstandige native App fur iOS und Android. Professionell entwickelt,
              getestet und bereit fur die Veroffentlichung in den App Stores.
            </p>

            {/* Platforms */}
            <div
              className={`flex gap-4 mb-8 transition-all duration-700 delay-350 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              {platforms.map((platform, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-xl">{platform.icon}</span>
                  <div>
                    <div className="text-sm font-semibold text-white">{platform.title}</div>
                    <div className="text-[10px] text-white/50">{platform.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Box */}
            <div
              className={`inline-flex items-center gap-4 p-6 rounded-2xl bg-white/[0.03] border border-[#8B5CF6]/20 mb-8 transition-all duration-700 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <div>
                <div className="text-4xl font-bold text-[#8B5CF6]">51.490 €</div>
                <div className="text-sm text-white/50">Festpreis</div>
              </div>
              <div className="h-12 w-px bg-white/10" />
              <div>
                <div className="text-sm text-white/70">Inklusive</div>
                <div className="text-lg font-semibold text-white">iOS + Android</div>
              </div>
            </div>

            {/* CTA */}
            <div
              className={`flex flex-col sm:flex-row gap-3 transition-all duration-700 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <Link
                href="/termin?paket=mobile"
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#a78bfa] text-white font-semibold hover:opacity-90 transition-all shadow-lg shadow-[#8B5CF6]/25 text-center"
              >
                App anfragen
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
                  className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-[#8B5CF6]/30 transition-all"
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

      {/* App Store Ready */}
      <section className="py-16 border-t border-white/5 bg-gradient-to-b from-[#8B5CF6]/5 to-transparent">
        <div className="container px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
              Store-Ready Lieferung
            </h2>
            <p className="text-white/60 mb-8">
              Ihre App wird vollstandig fur die Veroffentlichung vorbereitet
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <div className="p-6 rounded-xl bg-white/[0.03] border border-white/[0.08] flex-1 max-w-xs">
                <span className="text-4xl mb-3 block">🍎</span>
                <h3 className="font-semibold text-white mb-2">App Store</h3>
                <p className="text-sm text-white/60">Bereit fur iPhone und iPad</p>
              </div>
              <div className="p-6 rounded-xl bg-white/[0.03] border border-white/[0.08] flex-1 max-w-xs">
                <span className="text-4xl mb-3 block">▶️</span>
                <h3 className="font-semibold text-white mb-2">Google Play</h3>
                <p className="text-sm text-white/60">Bereit fur Android-Gerate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-16 border-t border-white/5">
        <div className="container px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
              Vorteile einer nativen App
            </h2>
            <div className="space-y-3 text-left max-w-xl mx-auto">
              {[
                "Optimale Performance auf mobilen Geraten",
                "Zugriff auf Geratefunktionen (Kamera, GPS, etc.)",
                "Push-Benachrichtigungen fur Nutzer-Engagement",
                "Offline-Fahigkeit moglich",
                "Prasenz in den App Stores",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02]">
                  <svg className="w-5 h-5 text-[#8B5CF6] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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
      <section className="py-16 border-t border-white/5 bg-gradient-to-t from-[#8B5CF6]/5 to-transparent">
        <div className="container px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Bereit fur Ihre App?
            </h2>
            <p className="text-white/60 mb-6">
              Lassen Sie uns Ihr Projekt besprechen - Festpreis, professionelle Umsetzung.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/termin?paket=mobile"
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#a78bfa] text-white font-semibold hover:opacity-90 transition-all shadow-lg shadow-[#8B5CF6]/25 text-center"
              >
                Jetzt anfragen - 51.490 €
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
