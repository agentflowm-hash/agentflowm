"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { startCheckout } from "@/lib/stripe-client";

interface Package {
  id: string;
  name: string;
  price: number;
  priceDisplay: string;
  description: string;
  features: string[];
  highlight?: boolean;
  icon: string;
}

const PACKAGES: Package[] = [
  {
    id: "start",
    name: "START",
    price: 3790,
    priceDisplay: "3.790 €",
    description: "Website + Admin Dashboard",
    icon: "🚀",
    features: [
      "Professionelle Website",
      "Admin Dashboard",
      "Mobile optimiert",
      "SEO Grundlagen",
      "3 Monate Support",
    ],
  },
  {
    id: "business",
    name: "BUSINESS",
    price: 8390,
    priceDisplay: "8.390 €",
    description: "Website + Portale + Automation",
    icon: "📈",
    highlight: true,
    features: [
      "Alles aus START",
      "Kunden-Portal",
      "Mitarbeiter-Portal",
      "Workflow Automation",
      "6 Monate Support",
    ],
  },
  {
    id: "growth",
    name: "GROWTH",
    price: 14990,
    priceDisplay: "14.990 €",
    description: "Komplettlösung für Wachstum",
    icon: "⚡",
    features: [
      "Alles aus BUSINESS",
      "Custom Integrationen",
      "AI-Features",
      "Priority Support",
      "12 Monate Support",
    ],
  },
];

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedPackage?: string;
}

type Step = "package" | "details" | "processing";

export function CheckoutModal({ isOpen, onClose, preselectedPackage }: CheckoutModalProps) {
  const [step, setStep] = useState<Step>("package");
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Handle preselected package
  useEffect(() => {
    if (preselectedPackage && isOpen) {
      const pkg = PACKAGES.find((p) => p.id === preselectedPackage);
      if (pkg) {
        setSelectedPackage(pkg);
        setStep("details");
      }
    }
  }, [preselectedPackage, isOpen]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep("package");
        setSelectedPackage(null);
        setFormData({ name: "", email: "", phone: "", company: "" });
        setErrors({});
      }, 300);
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name ist erforderlich";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "E-Mail ist erforderlich";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Ungültige E-Mail Adresse";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = async () => {
    if (!selectedPackage || !validateForm()) return;

    setIsLoading(true);
    setStep("processing");

    try {
      await startCheckout({
        packageId: selectedPackage.id,
        customerEmail: formData.email,
        customerName: formData.name,
        customerPhone: formData.phone,
        customerCompany: formData.company,
      });
    } catch (error) {
      console.error("Checkout error:", error);
      setStep("details");
      setErrors({ form: "Checkout fehlgeschlagen. Bitte versuche es erneut." });
    } finally {
      setIsLoading(false);
    }
  };

  const selectPackage = (pkg: Package) => {
    setSelectedPackage(pkg);
    setStep("details");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-[61] md:w-full md:max-w-4xl md:max-h-[90vh] bg-[#0a0a0f] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-[#FC682C] to-[#ff8f5c] p-6">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Checkout</h2>
                  <p className="text-white/80">
                    {step === "package" && "Wähle dein Paket"}
                    {step === "details" && selectedPackage && `${selectedPackage.name} - ${selectedPackage.priceDisplay}`}
                    {step === "processing" && "Verbinde mit Stripe..."}
                  </p>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center gap-2 mt-6">
                {["package", "details", "processing"].map((s, i) => (
                  <div key={s} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        step === s
                          ? "bg-white text-[#FC682C]"
                          : ["package", "details", "processing"].indexOf(step) > i
                          ? "bg-white/40 text-white"
                          : "bg-white/20 text-white/60"
                      }`}
                    >
                      {i + 1}
                    </div>
                    {i < 2 && (
                      <div className={`w-12 h-0.5 ${["package", "details", "processing"].indexOf(step) > i ? "bg-white/40" : "bg-white/20"}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <AnimatePresence mode="wait">
                {/* Step 1: Package Selection */}
                {step === "package" && (
                  <motion.div
                    key="package"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="grid md:grid-cols-3 gap-4"
                  >
                    {PACKAGES.map((pkg) => (
                      <motion.button
                        key={pkg.id}
                        onClick={() => selectPackage(pkg)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative p-6 rounded-2xl border text-left transition-all ${
                          pkg.highlight
                            ? "bg-gradient-to-br from-[#FC682C]/20 to-transparent border-[#FC682C]/50 ring-2 ring-[#FC682C]/30"
                            : "bg-white/5 border-white/10 hover:border-white/20"
                        }`}
                      >
                        {pkg.highlight && (
                          <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#FC682C] text-white text-xs font-bold rounded-full">
                            BELIEBT
                          </span>
                        )}
                        
                        <div className="text-3xl mb-3">{pkg.icon}</div>
                        <h3 className="text-xl font-bold text-white mb-1">{pkg.name}</h3>
                        <p className="text-white/60 text-sm mb-4">{pkg.description}</p>
                        
                        <div className="mb-4">
                          <span className="text-2xl font-bold text-white">{pkg.priceDisplay}</span>
                          <span className="text-white/40 text-sm ml-1">netto</span>
                        </div>

                        <ul className="space-y-2">
                          {pkg.features.slice(0, 4).map((feature) => (
                            <li key={feature} className="flex items-center gap-2 text-white/70 text-sm">
                              <svg className="w-4 h-4 text-[#FC682C] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {feature}
                            </li>
                          ))}
                        </ul>

                        <div className="mt-4 pt-4 border-t border-white/10">
                          <span className="text-[#FC682C] font-medium text-sm flex items-center gap-1">
                            Auswählen
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                )}

                {/* Step 2: Details Form */}
                {step === "details" && selectedPackage && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="max-w-lg mx-auto"
                  >
                    {/* Selected Package Summary */}
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10 mb-6 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{selectedPackage.icon}</span>
                        <div>
                          <h4 className="font-semibold text-white">{selectedPackage.name}</h4>
                          <p className="text-white/60 text-sm">{selectedPackage.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-white">{selectedPackage.priceDisplay}</p>
                        <p className="text-white/40 text-xs">+ MwSt</p>
                      </div>
                    </div>

                    {/* Form */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-white/70 text-sm mb-2">Name *</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Max Mustermann"
                          className={`w-full px-4 py-3 bg-white/5 border ${errors.name ? "border-red-500" : "border-white/10"} rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#FC682C] transition-colors`}
                        />
                        {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                      </div>

                      <div>
                        <label className="block text-white/70 text-sm mb-2">E-Mail *</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="max@beispiel.de"
                          className={`w-full px-4 py-3 bg-white/5 border ${errors.email ? "border-red-500" : "border-white/10"} rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#FC682C] transition-colors`}
                        />
                        {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                      </div>

                      <div>
                        <label className="block text-white/70 text-sm mb-2">Firma</label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder="Musterfirma GmbH"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#FC682C] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-white/70 text-sm mb-2">Telefon</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+49 123 456789"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#FC682C] transition-colors"
                        />
                      </div>

                      {errors.form && (
                        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm">
                          {errors.form}
                        </div>
                      )}
                    </div>

                    {/* Price Summary */}
                    <div className="mt-6 p-4 bg-gradient-to-br from-[#FC682C]/10 to-transparent rounded-xl border border-[#FC682C]/30">
                      <div className="flex justify-between text-white/70 mb-2">
                        <span>Netto</span>
                        <span>{selectedPackage.priceDisplay}</span>
                      </div>
                      <div className="flex justify-between text-white/70 mb-2">
                        <span>MwSt (19%)</span>
                        <span>{(selectedPackage.price * 0.19).toLocaleString("de-DE")} €</span>
                      </div>
                      <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-white/10">
                        <span>Gesamt</span>
                        <span>{(selectedPackage.price * 1.19).toLocaleString("de-DE")} €</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => setStep("package")}
                        className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white/70 hover:bg-white/10 transition-colors"
                      >
                        Zurück
                      </button>
                      <button
                        onClick={handleCheckout}
                        disabled={isLoading}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-[#FC682C] to-[#ff8f5c] rounded-xl text-white font-semibold hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Sicher bezahlen
                      </button>
                    </div>

                    {/* Trust Badges */}
                    <div className="flex items-center justify-center gap-6 mt-6 text-white/40 text-sm">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        SSL verschlüsselt
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M13.479 9.883c-1.626-.604-2.512-1.067-2.512-1.803 0-.622.511-.924 1.466-.924 1.572 0 3.005.578 3.773.878l.56-3.47s-1.326-.57-4.218-.57c-4.392 0-6.039 2.248-6.039 4.79 0 1.575.667 2.778 2.068 3.61 1.798 1.079 2.635 1.475 2.635 2.157 0 .787-.678 1.073-1.647 1.073-1.57 0-3.469-.712-4.63-1.368l-.578 3.47c1.072.54 2.924 1.073 4.79 1.073 4.395 0 6.039-2.174 6.039-4.79 0-1.88-.756-3.085-2.707-4.126z"/>
                        </svg>
                        Stripe
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Processing */}
                {step === "processing" && (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-16"
                  >
                    <div className="relative w-20 h-20 mb-6">
                      <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-[#FC682C] border-t-transparent animate-spin"></div>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Weiterleitung zu Stripe...</h3>
                    <p className="text-white/60">Du wirst gleich zur sicheren Zahlungsseite weitergeleitet.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
