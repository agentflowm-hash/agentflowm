"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

// ═══════════════════════════════════════════════════════════════
//                    ANIMATED BACKGROUND
// ═══════════════════════════════════════════════════════════════

function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#9D65C9]/15 to-transparent blur-[100px] animate-pulse-slow" />
      <div className="absolute bottom-20 right-[10%] w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[#FC682C]/12 to-transparent blur-[80px] animate-float-slow" />
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at center, rgba(157,101,201,0.3) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    HERO SECTION
// ═══════════════════════════════════════════════════════════════

function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative pt-20 sm:pt-24 md:pt-28 pb-10 sm:pb-14 overflow-hidden">
      <AnimatedBackground />

      <div className="container relative z-10 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#FC682C]/10 border border-[#FC682C]/20 mb-4 sm:mb-6 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <span className="text-[#FC682C] text-xs sm:text-sm">🟠</span>
            <span className="text-[10px] sm:text-xs font-medium text-[#FC682C]">
              Personlicher Link • Vertrauen multiplizieren • Qualitat
              weitergeben
            </span>
          </div>

          {/* H1 */}
          <h1
            className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <span className="text-white">Ein Link genugt.</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9D65C9] via-[#FC682C] to-[#FFB347]">
              Der Rest wird System.
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className={`text-xs sm:text-sm md:text-base text-white/70 max-w-2xl mx-auto mb-4 sm:mb-6 leading-relaxed transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            Empfehlungen sind kein Verkauf – sie sind Orientierung. Wenn Sie
            AgentFlowMarketing weitergeben, bringen Sie Unternehmern Struktur,
            Klarheit und echte Entlastung. Und wir bedanken uns mit einem
            automatischen Empfehlungs-Geschenk, sobald ein Projekt zustande
            kommt.
          </p>

          {/* Reimzeile */}
          <p
            className={`text-xs sm:text-sm text-[#9D65C9] italic mb-4 sm:mb-6 transition-all duration-700 delay-250 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            Link teilen, Wirkung entfalten. Ideen ordnen, Systeme bauen.
          </p>

          {/* Value Chips */}
          <div
            className={`flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            {[
              "1 Link – uberall nutzbar",
              "Automatische Zuordnung",
              "Herzlich & fair geregelt",
            ].map((chip) => (
              <span
                key={chip}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] sm:text-xs text-white/80"
              >
                <svg
                  className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {chip}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div
            className={`flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 transition-all duration-700 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <a
              href="#link-erstellen"
              className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-gradient-to-r from-[#9D65C9] to-[#FC682C] text-white text-xs sm:text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-[#9D65C9]/25 text-center"
            >
              Empfehlungslink erstellen
            </a>
            <a
              href="#so-funktionierts"
              className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg border border-white/20 text-white text-xs sm:text-sm font-semibold hover:bg-white/5 transition-all text-center"
            >
              So funktioniert's
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    WARUM EMPFEHLEN SECTION
// ═══════════════════════════════════════════════════════════════

function WhyRecommendSection() {
  const principles = [
    {
      icon: "🤝",
      title: "Vertrauen",
      desc: "Jemand, der mich kennt, empfiehlt das.",
    },
    { icon: "🎯", title: "Klarheit", desc: "Ich weiss, wo ich anfangen soll." },
    { icon: "🛡️", title: "Risiko-Reduktion", desc: "Das ist kein Blindflug." },
  ];

  return (
    <section className="py-10 sm:py-14 md:py-16 border-t border-white/5">
      <div className="container px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white text-center mb-3 sm:mb-4">
            Warum Empfehlungen starker sind als Werbung
          </h2>
          <p className="text-xs sm:text-sm text-white/60 text-center mb-6 sm:mb-8 max-w-xl mx-auto">
            Menschen kaufen nicht das Beste – sie kaufen das Sicherste: eine
            klare Entscheidung mit gutem Gefuhl.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {principles.map((p, i) => (
              <div
                key={i}
                className="p-4 sm:p-5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-center hover:border-[#9D65C9]/30 transition-all"
              >
                <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">
                  {p.icon}
                </div>
                <h3 className="font-semibold text-white text-sm sm:text-base mb-1">
                  {p.title}
                </h3>
                <p className="text-[10px] sm:text-xs text-white/50">{p.desc}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-sm sm:text-base font-semibold text-white mb-3">
            Empfehlung heisst: Weg zeigen, nicht drucken.
          </p>
          <p className="text-center text-xs sm:text-sm text-[#9D65C9] italic">
            Wer Qualitat kennt, gibt Qualitat weiter. So wird aus Zufall:
            Schritt fur Schritt – leichter.
          </p>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    SO FUNKTIONIERT'S SECTION
// ═══════════════════════════════════════════════════════════════

function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      title: "Link erstellen",
      desc: "Sie erstellen einmal Ihren personlichen Link.",
      example: "agentflowm.com/?ref=IHRNAME",
      color: "#FFB347",
    },
    {
      num: "02",
      title: "Link teilen",
      desc: "Website, WhatsApp, E-Mail, Signatur – wo es Sinn macht.",
      example: null,
      color: "#FC682C",
    },
    {
      num: "03",
      title: "Interessent fragt an",
      desc: "Der Link fuhrt zur Anfrage. Der Bedarf wird kurz geklart.",
      example: null,
      color: "#9D65C9",
    },
    {
      num: "04",
      title: "Automatisches Geschenk",
      desc: "Bei Auftrag + Zahlungseingang wird Ihr Geschenk automatisch zugeordnet.",
      example: null,
      color: "#10B981",
    },
  ];

  return (
    <section
      id="so-funktionierts"
      className="py-10 sm:py-14 md:py-16 border-t border-white/5 bg-gradient-to-b from-transparent via-[#9D65C9]/5 to-transparent"
    >
      <div className="container px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white text-center mb-2 sm:mb-3">
            In 4 Schritten – einfach, automatisch, sauber
          </h2>
          <p className="text-xs sm:text-sm text-white/50 text-center mb-6 sm:mb-10">
            Kein Nachfassen. Kein Erklaren. Nur teilen.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {steps.map((step, i) => (
              <div
                key={i}
                className="relative p-4 sm:p-5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-white/20 transition-all group"
              >
                <div
                  className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-3 transition-colors"
                  style={{ color: step.color + "40" }}
                >
                  {step.num}
                </div>
                <h3
                  className="font-semibold text-white text-sm sm:text-base mb-1 sm:mb-2"
                  style={{ color: step.color }}
                >
                  {step.title}
                </h3>
                <p className="text-[10px] sm:text-xs text-white/60 mb-2">
                  {step.desc}
                </p>
                {step.example && (
                  <code className="block text-[9px] sm:text-[10px] px-2 py-1 bg-white/5 rounded text-white/50 break-all">
                    {step.example}
                  </code>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    EMPFEHLUNGS-GESCHENK SECTION
// ═══════════════════════════════════════════════════════════════

function RewardSection() {
  return (
    <section className="py-10 sm:py-14 md:py-16 border-t border-white/5">
      <div className="container px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="p-6 sm:p-8 md:p-10 rounded-2xl bg-gradient-to-br from-[#9D65C9]/10 to-[#FC682C]/10 border border-[#9D65C9]/20 text-center">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4">
              Unser Dankeschon – klar & fair
            </h2>
            <p className="text-xs sm:text-sm text-white/70 mb-4 sm:mb-6">
              Wenn uber Ihren Link ein Projekt entsteht, bedanken wir uns mit
              einem Empfehlungs-Geschenk in Hohe von
            </p>
            <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#9D65C9] to-[#FC682C] mb-3 sm:mb-4">
              10%
            </div>
            <p className="text-xs sm:text-sm text-white/50 mb-4 sm:mb-6">
              des Netto-Auftragswerts (einmalig)
            </p>
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
              <svg
                className="w-4 h-4 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs sm:text-sm text-green-400">
                Auszahlung: 30 Tage nach Zahlungseingang
              </span>
            </div>
            <p className="text-xs text-white/40 mt-4 italic">
              Sie geben Vertrauen – wir sagen Danke.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    LINK ERSTELLEN SECTION
// ═══════════════════════════════════════════════════════════════

function CreateLinkSection() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [refCode, setRefCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [linkGenerated, setLinkGenerated] = useState(false);

  const generateLink = () => {
    if (!refCode.trim()) return;
    setLinkGenerated(true);
  };

  const fullLink = `https://www.agentflowm.com/?ref=${refCode.toUpperCase().replace(/\s+/g, "")}`;

  const copyLink = () => {
    navigator.clipboard.writeText(fullLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="link-erstellen"
      className="py-10 sm:py-14 md:py-16 border-t border-white/5 bg-gradient-to-b from-transparent via-[#FC682C]/5 to-transparent"
    >
      <div className="container px-4 sm:px-6">
        <div className="max-w-xl mx-auto">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white text-center mb-2 sm:mb-3">
            Erstellen Sie Ihren Link
          </h2>
          <p className="text-xs sm:text-sm text-white/60 text-center mb-6 sm:mb-8">
            Ein Link reicht. Alles Weitere lauft uber unser System.
          </p>

          <div className="p-5 sm:p-6 md:p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
            {!linkGenerated ? (
              <>
                <label className="block text-xs sm:text-sm font-medium text-white/70 mb-2">
                  Ihr Referenz-Code (z.B. Ihr Name oder Firma)
                </label>
                <input
                  type="text"
                  value={refCode}
                  onChange={(e) => setRefCode(e.target.value)}
                  placeholder="z.B. MUSTERMANN oder FIRMA123"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#FC682C] focus:ring-2 focus:ring-[#FC682C]/20 outline-none transition-all text-sm placeholder:text-white/30 mb-4"
                />
                <button
                  onClick={generateLink}
                  disabled={!refCode.trim()}
                  className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#9D65C9] to-[#FC682C] text-white text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Empfehlungslink erstellen
                </button>
              </>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 sm:w-10 sm:h-10 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-sm sm:text-base text-white font-medium mb-2">
                  Fertig! Ihr Empfehlungslink ist bereit.
                </p>
                <p className="text-[10px] sm:text-xs text-white/50 mb-4">
                  Kopieren, teilen, einbauen – der Rest lauft automatisch.
                </p>

                <div className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10 mb-4">
                  <code className="text-[10px] sm:text-xs text-[#FC682C] break-all">
                    {fullLink}
                  </code>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button
                    onClick={copyLink}
                    className="flex-1 py-2.5 px-4 rounded-lg bg-gradient-to-r from-[#9D65C9] to-[#FC682C] text-white text-xs sm:text-sm font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    {copied ? (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Kopiert!
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                          />
                        </svg>
                        Link kopieren
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setLinkGenerated(false);
                      setRefCode("");
                    }}
                    className="flex-1 py-2.5 px-4 rounded-lg border border-white/20 text-white text-xs sm:text-sm font-semibold hover:bg-white/5 transition-all"
                  >
                    Neuen Link erstellen
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    LINK EINSETZEN SECTION
// ═══════════════════════════════════════════════════════════════

function UseLinkSection() {
  const [activeTab, setActiveTab] = useState<"website" | "whatsapp" | "email">(
    "website",
  );

  const tabs = [
    { id: "website" as const, label: "Website", icon: "🌐" },
    { id: "whatsapp" as const, label: "WhatsApp", icon: "💬" },
    { id: "email" as const, label: "E-Mail", icon: "📧" },
  ];

  const templates = {
    website: [
      {
        title: "Minimal",
        text: "Empfehlung: AgentFlowMarketing → Systeme, die Ablaufe tragen.\n→ [Ihr Empfehlungslink]",
      },
      {
        title: "Button",
        text: "Button-Text: AgentFlowMarketing empfehlen\nLink: [Ihr Empfehlungslink]",
      },
      {
        title: "Box",
        text: "🟠 Struktur statt Stress: Website + Workflows + Systeme.\n→ Anfrage: [Ihr Empfehlungslink]",
      },
    ],
    whatsapp: [
      {
        title: "Kurz & klar",
        text: "🟠 Wenn Ablaufe hangen: AgentFlowMarketing 👉 [Link]",
      },
      {
        title: "Nutzen zuerst",
        text: "Die bauen Systeme aus Website + Workflows, die echte Arbeit abnehmen.\nHier der Link: [Link]",
      },
      {
        title: "Fur Entscheider",
        text: "Wenn du Struktur willst, die bleibt (statt Chaos, das wiederkommt):\nAgentFlowMarketing 👉 [Link]",
      },
    ],
    email: [
      {
        title: "Komplett",
        text: "Betreff: Empfehlung – AgentFlowMarketing\n\nHallo [Name],\n\nwenn du Struktur in Ablaufe bringen willst (Website + Workflows / optional Systeme), empfehle ich AgentFlowMarketing.\n\nHier der Link zur Anfrage: [Link]\n\nViele Grusse\n[Dein Name]",
      },
    ],
  };

  return (
    <section className="py-10 sm:py-14 md:py-16 border-t border-white/5">
      <div className="container px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white text-center mb-2 sm:mb-3">
            Ihr Link in 60 Sekunden – 3 Wege
          </h2>
          <p className="text-xs sm:text-sm text-white/50 text-center mb-6 sm:mb-8">
            Copy-Paste Vorlagen fur jeden Kanal
          </p>

          {/* Tabs */}
          <div className="flex justify-center gap-2 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-[#FC682C] text-white"
                    : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                <span className="mr-1.5">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Templates */}
          <div className="space-y-3 sm:space-y-4">
            {templates[activeTab].map((template, i) => (
              <div
                key={i}
                className="p-4 sm:p-5 rounded-xl bg-white/[0.03] border border-white/[0.08]"
              >
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <h4 className="font-medium text-white text-sm">
                    {template.title}
                  </h4>
                  <button
                    onClick={() => navigator.clipboard.writeText(template.text)}
                    className="text-[10px] sm:text-xs text-[#FC682C] hover:text-[#FC682C]/80 transition-colors"
                  >
                    Kopieren
                  </button>
                </div>
                <pre className="text-[10px] sm:text-xs text-white/60 whitespace-pre-wrap bg-white/5 p-3 rounded-lg overflow-x-auto">
                  {template.text}
                </pre>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-[#9D65C9] italic mt-6">
            Link raus – Chaos aus.
          </p>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    WARUM ES FUNKTIONIERT SECTION
// ═══════════════════════════════════════════════════════════════

function WhyItWorksSection() {
  const strategies = [
    {
      icon: "🎯",
      title: "Klarer Startpunkt",
      desc: "Ein Link spart Suche, Zweifel, Zeit.",
    },
    {
      icon: "✨",
      title: "Saubere Entscheidung",
      desc: "Empfehlung ist ein Qualitatsfilter.",
    },
    {
      icon: "🛡️",
      title: "Weniger Risiko",
      desc: "Menschen vertrauen dem Weg, nicht dem Versprechen.",
    },
    {
      icon: "⚡",
      title: "Momentum",
      desc: "Wer gerade ein Problem spurt, braucht sofort den nachsten Schritt.",
    },
  ];

  return (
    <section className="py-10 sm:py-14 md:py-16 border-t border-white/5 bg-gradient-to-b from-transparent via-[#9D65C9]/5 to-transparent">
      <div className="container px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white text-center mb-6 sm:mb-8">
            Warum Ihr Link Wirkung hat
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
            {strategies.map((s, i) => (
              <div
                key={i}
                className="p-3 sm:p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] text-center"
              >
                <div className="text-xl sm:text-2xl mb-2">{s.icon}</div>
                <h3 className="font-semibold text-white text-xs sm:text-sm mb-1">
                  {s.title}
                </h3>
                <p className="text-[9px] sm:text-[10px] text-white/50">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          <p className="text-center text-sm sm:text-base font-medium text-white">
            Ein Link ist ein sauberer nachster Schritt.
          </p>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    ERWARTUNG SECTION
// ═══════════════════════════════════════════════════════════════

function ExpectationSection() {
  return (
    <section className="py-10 sm:py-14 md:py-16 border-t border-white/5">
      <div className="container px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4">
            Unsere Erwartung – mit Herz
          </h2>
          <p className="text-xs sm:text-sm text-white/70 mb-4 sm:mb-6 leading-relaxed">
            Wenn Sie begeistert sind, freuen wir uns, wenn Sie
            AgentFlowMarketing aktiv weitergeben. Nicht wegen Geld – sondern
            weil Sie damit Kreativitat fortsetzen: aus einer Idee wird ein
            Konzept, aus einem Konzept ein System, das tragt.
          </p>
          <p className="text-sm sm:text-base font-semibold text-white mb-4 sm:mb-6">
            Unser Ziel ist, dass zufriedene Kunden uns an mehrere passende
            Unternehmer weiterempfehlen.
          </p>
          <p className="text-xs sm:text-sm text-[#9D65C9] italic">
            Wenn's gut war – sag's weiter. So wird aus Arbeit: Wachstum,
            leichter.
          </p>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    REGELN SECTION
// ═══════════════════════════════════════════════════════════════

function RulesSection() {
  const rules = [
    "Zuordnung uber Ihren Empfehlungslink (?ref=...)",
    "Gultig bei Auftrag + Zahlungseingang",
    "Einmaliges Geschenk pro abgeschlossenem Auftrag",
    "Keine Zuordnung bei Eigen-/verbundenen Unternehmen",
    "Details werden im Angebot/Projektvertrag klar festgehalten",
  ];

  return (
    <section className="py-10 sm:py-14 md:py-16 border-t border-white/5">
      <div className="container px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="p-5 sm:p-6 md:p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-white mb-4 sm:mb-5">
              Fair geregelt – damit es ordentlich lauft
            </h2>
            <ul className="space-y-2 sm:space-y-3">
              {rules.map((rule, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-white/70"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    VERTRAULICHKEIT SECTION
// ═══════════════════════════════════════════════════════════════

function ConfidentialitySection() {
  return (
    <section className="py-10 sm:py-14 md:py-16 border-t border-white/5">
      <div className="container px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="p-5 sm:p-6 md:p-8 rounded-2xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08]">
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-white mb-3 sm:mb-4">
              Vertraulichkeit ist Standard
            </h2>
            <p className="text-xs sm:text-sm text-white/60 mb-4 sm:mb-5">
              Auf Wunsch schliessen wir vor Projektstart eine
              Vertraulichkeitsvereinbarung (NDA). Inhalte, Konzepte und
              Umsetzungen bleiben vertraulich.
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {[
                { icon: "🤐", text: "Keine Weitergabe an Dritte" },
                { icon: "🔒", text: "Schutz von Konzept & Systemlogik" },
                { icon: "📝", text: "Schriftlich geregelt" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-xs sm:text-sm text-white/70"
                >
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    FINAL CTA SECTION
// ═══════════════════════════════════════════════════════════════

function FinalCTA() {
  return (
    <section className="py-10 sm:py-14 md:py-16 border-t border-white/5 bg-gradient-to-t from-[#9D65C9]/10 to-transparent">
      <div className="container px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4">
            Erstellen Sie Ihren Link – und geben Sie Qualitat weiter.
          </h2>
          <p className="text-xs sm:text-sm text-white/60 mb-6 sm:mb-8">
            Ein Link reicht. Alles Weitere lauft uber unser System.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <a
              href="#link-erstellen"
              className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-gradient-to-r from-[#9D65C9] to-[#FC682C] text-white text-xs sm:text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-[#9D65C9]/25 text-center"
            >
              Empfehlungslink erstellen
            </a>
            <Link
              href="/termin"
              className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg border border-white/20 text-white text-xs sm:text-sm font-semibold hover:bg-white/5 transition-all text-center"
            >
              Termin buchen
            </Link>
          </div>
          <p className="text-xs sm:text-sm text-[#9D65C9] italic">
            Link teilen. Klarheit schaffen. Systeme starten.
          </p>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    MAIN PAGE
// ═══════════════════════════════════════════════════════════════

export default function ReferralPage() {
  return (
    <>
      <style jsx global>{`
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.2;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-30px);
          }
        }
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
      `}</style>

      <HeroSection />
      <WhyRecommendSection />
      <HowItWorksSection />
      <RewardSection />
      <CreateLinkSection />
      <UseLinkSection />
      <WhyItWorksSection />
      <ExpectationSection />
      <RulesSection />
      <ConfidentialitySection />
      <FinalCTA />
    </>
  );
}
