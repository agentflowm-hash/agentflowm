"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui";

// ===================================================================
//                    ANIMATED BACKGROUND
// ===================================================================

function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main glow */}
      <div className="absolute top-20 right-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#FC682C]/20 to-transparent blur-[120px]" />
      <div className="absolute bottom-20 left-[5%] w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[#9D65C9]/15 to-transparent blur-[100px]" />
      
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at center, rgba(252,104,44,0.4) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />
      
      {/* Decorative elements */}
      <div className="absolute top-40 left-20 w-2 h-2 rounded-full bg-[#FC682C]/40" />
      <div className="absolute top-60 right-40 w-3 h-3 rounded-full bg-[#9D65C9]/30" />
      <div className="absolute bottom-40 left-1/3 w-1.5 h-1.5 rounded-full bg-[#FFB347]/40" />
    </div>
  );
}

// ===================================================================
//                    FLOATING CALENDAR ICON
// ===================================================================

function FloatingCalendar() {
  return (
    <div className="relative w-32 h-32 mx-auto mb-8">
      {/* Glow ring */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#FC682C]/30 to-[#9D65C9]/20 blur-xl" />
      
      {/* Calendar body */}
      <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm flex flex-col overflow-hidden">
        {/* Calendar header */}
        <div className="h-8 bg-[#FC682C] flex items-center justify-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
        </div>
        
        {/* Calendar grid */}
        <div className="flex-1 p-3 grid grid-cols-3 gap-1.5">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`rounded-md ${i === 2 ? 'bg-[#FC682C]/60' : 'bg-white/10'}`}
            />
          ))}
        </div>
      </div>
      
      {/* Floating checkmark */}
      <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30">
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </div>
  );
}

// ===================================================================
//                    CONTACT FORM
// ===================================================================

function ContactForm() {
  const t = useTranslations("pages.termin.form");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    packageInterest: "",
    website: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, source: "website" }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || t("error"));

      setStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: "",
        packageInterest: "",
        website: "",
      });
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : t("error"));
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold mb-3">{t("success.title")}</h3>
        <p className="text-white/50 mb-8">{t("success.text")}</p>
        <Button variant="outline" onClick={() => setStatus("idle")}>
          {t("success.newMessage")}
        </Button>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/10 focus:border-[#FC682C] focus:ring-2 focus:ring-[#FC682C]/20 outline-none transition-all placeholder:text-white/25 text-white";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Honeypot */}
      <input
        type="text"
        name="website"
        value={formData.website}
        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">{t("name")} *</label>
          <input
            type="text"
            required
            minLength={2}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={inputClass}
            placeholder={t("namePlaceholder")}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">{t("email")} *</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={inputClass}
            placeholder={t("emailPlaceholder")}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">{t("phone")}</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className={inputClass}
            placeholder={t("phonePlaceholder")}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">{t("company")}</label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className={inputClass}
            placeholder={t("companyPlaceholder")}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white/70 mb-2">{t("interest")}</label>
        <select
          value={formData.packageInterest}
          onChange={(e) => setFormData({ ...formData, packageInterest: e.target.value })}
          className={`${inputClass} appearance-none cursor-pointer`}
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1rem' }}
        >
          <option value="" className="bg-[#0a0a0f]">{t("interestOptions.select")}</option>
          <option value="launch" className="bg-[#0a0a0f]">{t("interestOptions.launch")}</option>
          <option value="business" className="bg-[#0a0a0f]">{t("interestOptions.business")}</option>
          <option value="webapp" className="bg-[#0a0a0f]">{t("interestOptions.webapp")}</option>
          <option value="mobile" className="bg-[#0a0a0f]">{t("interestOptions.mobile")}</option>
          <option value="konfigurator" className="bg-[#0a0a0f]">{t("interestOptions.konfigurator")}</option>
          <option value="enterprise" className="bg-[#0a0a0f]">{t("interestOptions.enterprise")}</option>
          <option value="workflows" className="bg-[#0a0a0f]">{t("interestOptions.workflows")}</option>
          <option value="consulting" className="bg-[#0a0a0f]">{t("interestOptions.consulting")}</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-white/70 mb-2">{t("message")}</label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className={`${inputClass} resize-none`}
          rows={4}
          placeholder={t("messagePlaceholder")}
        />
      </div>

      {status === "error" && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-4 px-6 rounded-xl bg-[#FC682C] hover:bg-[#e55a1f] text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#FC682C]/20"
      >
        {status === "loading" ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {t("sending")}
          </span>
        ) : (
          t("submit")
        )}
      </button>
    </form>
  );
}

// ===================================================================
//                    MAIN PAGE
// ===================================================================

export default function TerminPage() {
  const t = useTranslations("pages.termin");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { value: t("stats.responseTime.value"), label: t("stats.responseTime.label"), icon: "⚡" },
    { value: t("stats.consultation.value"), label: t("stats.consultation.label"), icon: "🎯" },
    { value: t("stats.nonBinding.value"), label: t("stats.nonBinding.label"), icon: "✓" },
  ];

  const contactItems = [
    {
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
      label: t("directContact.whatsapp.label"),
      sublabel: t("directContact.whatsapp.sublabel"),
      href: "https://wa.me/491799498247",
      color: "hover:border-green-500/50 hover:bg-green-500/10",
      iconBg: "bg-green-500/20 text-green-400",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      label: t("directContact.email.label"),
      sublabel: t("directContact.email.sublabel"),
      href: "mailto:kontakt@agentflowm.com",
      color: "hover:border-[#FC682C]/50 hover:bg-[#FC682C]/10",
      iconBg: "bg-[#FC682C]/20 text-[#FC682C]",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      label: t("directContact.phone.label"),
      sublabel: t("directContact.phone.sublabel"),
      href: "tel:+491799498247",
      color: "hover:border-purple-500/50 hover:bg-purple-500/10",
      iconBg: "bg-purple-500/20 text-purple-400",
    },
  ];

  return (
    <div className="min-h-screen bg-[#030308]">
      {/* Hero Section */}
      <section className="relative pt-28 sm:pt-32 md:pt-36 pb-12 sm:pb-16 overflow-hidden">
        <AnimatedBackground />

        <div className="container relative z-10 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            {/* Floating Calendar */}
            <div className={`transition-all duration-700 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
              <FloatingCalendar />
            </div>

            {/* Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FC682C]/10 border border-[#FC682C]/20 mb-6 transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              <span className="w-2 h-2 rounded-full bg-[#FC682C] animate-pulse" />
              <span className="text-sm font-medium text-[#FC682C]">{t("badge")}</span>
            </div>

            {/* Title */}
            <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-6 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              {t("title")}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FC682C] via-[#FFB347] to-[#9D65C9]">
                {t("titleHighlight")}
              </span>
            </h1>

            {/* Subtitle */}
            <p className={`text-lg sm:text-xl text-white/50 mb-10 max-w-2xl mx-auto transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              {t("subtitle")}
            </p>

            {/* Stats */}
            <div className={`flex flex-wrap justify-center gap-6 sm:gap-10 transition-all duration-700 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-[#FC682C] flex items-center justify-center gap-2">
                    <span className="text-lg">{stat.icon}</span>
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/40 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-5 gap-8">
              {/* Contact Form - 3 columns */}
              <div className="lg:col-span-3">
                <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-sm">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-[#FC682C]/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#FC682C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </span>
                    {t("form.title")}
                  </h2>
                  <ContactForm />
                </div>
              </div>

              {/* Sidebar - 2 columns */}
              <div className="lg:col-span-2 space-y-6">
                {/* Calendly Card */}
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#FC682C]/15 to-[#9D65C9]/10 border border-[#FC682C]/20 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#FC682C]/20 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-[#FC682C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{t("calendar.title")}</h3>
                  <p className="text-white/50 text-sm mb-6">{t("calendar.subtitle")}</p>
                  <a
                    href="https://calendly.com/agentflowm/15min"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full justify-center py-3.5 px-6 rounded-xl bg-[#FC682C] hover:bg-[#e55a1f] text-white font-semibold transition-all shadow-lg shadow-[#FC682C]/20"
                  >
                    {t("calendar.button")}
                  </a>
                </div>

                {/* Quick Contact */}
                <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10">
                  <h3 className="font-semibold mb-4 text-white/90">{t("directContact.title")}</h3>
                  <div className="space-y-3">
                    {contactItems.map((item, i) => (
                      <a
                        key={i}
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className={`flex items-center gap-4 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 ${item.color} transition-all group`}
                      >
                        <span className={`w-10 h-10 rounded-xl ${item.iconBg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                          {item.icon}
                        </span>
                        <div>
                          <div className="font-medium text-white/90">{item.label}</div>
                          <div className="text-sm text-white/40">{item.sublabel}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </span>
                    <h3 className="font-semibold text-white/90">{t("location.title")}</h3>
                  </div>
                  <p className="text-white/50 text-sm whitespace-pre-line pl-[52px]">
                    {t("location.address")}
                  </p>
                </div>

                {/* Trust indicators */}
                <div className="p-5 rounded-2xl bg-green-500/5 border border-green-500/10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-green-400">100% unverbindlich</div>
                      <div className="text-xs text-white/40">Ihre Daten sind bei uns sicher</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
