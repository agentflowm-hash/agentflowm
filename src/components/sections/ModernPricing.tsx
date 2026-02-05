"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import Link from "next/link";

const packages = [
  {
    id: "one-page",
    name: "One Page",
    badge: "Schneller Start",
    price: "1.390",
    pricePrefix: "ab",
    description: "Eine Seite mit allen wichtigen Sektionen.",
    scope: "1 Seite",
    features: [
      { text: "One Page Website", included: true },
      { text: "Kontaktwege (Mail / WhatsApp / Termin)", included: true },
      { text: "Basis-SEO & Meta-Tags", included: true },
      { text: "Responsive Design", included: true },
      { text: "Performance-Optimierung", included: true },
      { text: "Publishing-Agent", included: false },
      { text: "Leads-Generator", included: false },
    ],
    highlighted: false,
    cta: "Jetzt kaufen",
    href: "/pakete/one-page",
  },
  {
    id: "business",
    name: "Business",
    badge: "Beliebt",
    price: "6.990",
    pricePrefix: "",
    description: "Vollständige Website mit Publishing-Workflow.",
    scope: "Bis 10 Seiten",
    features: [
      { text: "Bis 10 Seiten mit Struktur", included: true },
      { text: "Publishing-Agent inklusive", included: true },
      { text: "Vorlagen & Freigabe-Flow", included: true },
      { text: "Tracking-Setup (Analytics)", included: true },
      { text: "Alles aus One Page", included: true },
      { text: "Leads-Generator", included: false },
    ],
    highlighted: true,
    cta: "Jetzt kaufen",
    href: "/pakete/business",
  },
  {
    id: "growth",
    name: "Growth",
    badge: "Komplett",
    price: "10.990",
    pricePrefix: "ab",
    description: "Das komplette System mit Lead-Automatisierung.",
    scope: "Bis 13 Seiten",
    features: [
      { text: "Bis 13 Seiten inkl. Landingpages", included: true },
      { text: "Publishing-Agent", included: true },
      { text: "Leads-Generator-Agent", included: true },
      { text: "Übergabe & Dokumentation", included: true },
      { text: "Alles aus Business", included: true },
      { text: "Priority Support", included: true },
    ],
    highlighted: false,
    cta: "Jetzt kaufen",
    href: "/pakete/growth",
  },
];

// Checkmark icon
const CheckIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

// X icon for not included
const XIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 6l8 8M6 14l8-8"
    />
  </svg>
);

// Close icon for modal
const CloseIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

// Checkout Modal Component
function CheckoutModal({
  isOpen,
  onClose,
  packageData,
  onSubmit,
  loading,
}: {
  isOpen: boolean;
  onClose: () => void;
  packageData: { id: string; name: string; price: string } | null;
  onSubmit: (data: {
    name: string;
    email: string;
    phone: string;
    company: string;
    message: string;
  }) => void;
  loading: boolean;
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  if (!isOpen || !packageData) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
        >
          <CloseIcon className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <span className="inline-block px-3 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-[#FC682C] text-white mb-3">
            {packageData.name}
          </span>
          <h3 className="text-xl font-bold text-white">Anfrage senden</h3>
          <p className="text-sm text-white/50 mt-1">
            Paket: {packageData.name} · {packageData.price}€
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-white/60 mb-1.5">Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#FC682C]/50 transition-colors"
              placeholder="Ihr Name"
            />
          </div>

          <div>
            <label className="block text-xs text-white/60 mb-1.5">
              E-Mail *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#FC682C]/50 transition-colors"
              placeholder="ihre@email.de"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/60 mb-1.5">
                Telefon
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#FC682C]/50 transition-colors"
                placeholder="+49..."
              />
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-1.5">
                Firma
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#FC682C]/50 transition-colors"
                placeholder="Firmenname"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-white/60 mb-1.5">
              Nachricht
            </label>
            <textarea
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#FC682C]/50 transition-colors resize-none"
              placeholder="Erzählen Sie uns von Ihrem Projekt..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#FC682C] text-white font-medium rounded-lg hover:bg-[#e55a1f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Wird gesendet...
              </>
            ) : (
              "Anfrage absenden"
            )}
          </button>

          <p className="text-[10px] text-white/30 text-center">
            Wir melden uns innerhalb von 24 Stunden bei Ihnen.
          </p>
        </form>
      </div>
    </div>
  );
}

export function ModernPricing() {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<{
    id: string;
    name: string;
    price: string;
  } | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleCheckout = (packageId: string) => {
    const pkg = packages.find((p) => p.id === packageId);
    if (pkg) {
      setSelectedPackage({ id: pkg.id, name: pkg.name, price: pkg.price });
      setModalOpen(true);
    }
  };

  const handleFormSubmit = async (formData: {
    name: string;
    email: string;
    phone: string;
    company: string;
    message: string;
  }) => {
    if (!selectedPackage) return;

    setLoading(selectedPackage.id);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: selectedPackage.id,
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          customerCompany: formData.company,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        console.error("Checkout error:", data.error);
        alert("Fehler beim Senden. Bitte versuchen Sie es erneut.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Fehler beim Senden. Bitte versuchen Sie es erneut.");
    } finally {
      setLoading(null);
      setModalOpen(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="pakete"
      className="relative py-24 md:py-32 bg-[#080808]"
    >
      {/* Subtle background gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-20"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(252, 104, 44, 0.15) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs text-[#FC682C] uppercase tracking-[0.2em] font-medium mb-3">
            Pakete & Preise
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Transparente Festpreise
          </h2>
          <p className="text-sm text-white/50 max-w-md mx-auto">
            Wählen Sie das passende Paket. Details klären wir im Erstgespräch.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {packages.map((pkg, index) => (
            <div
              key={pkg.name}
              className={`relative rounded-2xl transition-all duration-500 ${
                pkg.highlighted
                  ? "bg-gradient-to-b from-[#FC682C]/10 to-transparent border border-[#FC682C]/30 sm:scale-[1.02] md:scale-105 sm:-my-2 md:-my-4"
                  : "bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.15]"
              } ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{
                transitionDelay: `${index * 100}ms`,
              }}
            >
              {/* Badge */}
              {pkg.badge && (
                <div className="absolute -top-3 left-6">
                  <span
                    className={`px-3 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full ${
                      pkg.highlighted
                        ? "bg-[#FC682C] text-white"
                        : "bg-white/10 text-white/60"
                    }`}
                  >
                    {pkg.badge}
                  </span>
                </div>
              )}

              <div className="p-6 pt-8">
                {/* Package name */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {pkg.name}
                  </h3>
                  <p className="text-xs text-white/40">{pkg.scope}</p>
                </div>

                {/* Price */}
                <div className="mb-6 pb-6 border-b border-white/[0.08]">
                  <div className="flex items-baseline gap-1">
                    {pkg.pricePrefix && (
                      <span className="text-sm text-white/50">
                        {pkg.pricePrefix}
                      </span>
                    )}
                    <span className="text-3xl font-bold text-white">
                      {pkg.price}
                    </span>
                    <span className="text-lg text-white/70">€</span>
                  </div>
                  <p className="text-[10px] text-white/30 mt-1">
                    netto zzgl. USt.
                  </p>
                </div>

                {/* Description */}
                <p className="text-sm text-white/50 mb-6 leading-relaxed">
                  {pkg.description}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature) => (
                    <li
                      key={feature.text}
                      className={`flex items-start gap-2.5 ${
                        feature.included ? "text-white/70" : "text-white/25"
                      }`}
                    >
                      {feature.included ? (
                        <CheckIcon className="w-4 h-4 text-[#FC682C] flex-shrink-0 mt-0.5" />
                      ) : (
                        <XIcon className="w-4 h-4 flex-shrink-0 mt-0.5 opacity-50" />
                      )}
                      <span
                        className={`text-xs ${!feature.included && "line-through"}`}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => handleCheckout(pkg.id)}
                  disabled={loading === pkg.id}
                  className={`block w-full py-3 text-center text-sm font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                    pkg.highlighted
                      ? "bg-[#FC682C] text-white hover:bg-[#e55a1f]"
                      : "bg-white/[0.05] text-white hover:bg-white/[0.1] border border-white/[0.1]"
                  }`}
                >
                  {loading === pkg.id ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Wird geladen...
                    </span>
                  ) : (
                    pkg.cta
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="text-center mt-12 space-y-3">
          <p className="text-xs text-white/30">
            Alle Preise netto zzgl. 19% USt. · Hosting & Domain separat
          </p>
          <p className="text-sm text-white/50">
            Individuelles Projekt?{" "}
            <Link
              href="/termin"
              className="text-[#FC682C] hover:text-[#FF8A57] transition-colors"
            >
              Lassen Sie uns sprechen →
            </Link>
          </p>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        packageData={selectedPackage}
        onSubmit={handleFormSubmit}
        loading={loading !== null}
      />
    </section>
  );
}
