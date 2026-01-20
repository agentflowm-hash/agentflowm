"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui";
import { Link } from "@/i18n/routing";

// ===================================================================
//                    ANIMATED BACKGROUND
// ===================================================================

function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 right-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#FC682C]/15 to-transparent blur-[100px] animate-pulse-slow" />
      <div className="absolute bottom-40 left-[5%] w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[#9D65C9]/10 to-transparent blur-[80px] animate-float-slow" />
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at center, rgba(252,104,44,0.3) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
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
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
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
      if (!response.ok)
        throw new Error(data.error || t("error"));

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
      setErrorMessage(
        error instanceof Error ? error.message : t("error"),
      );
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-green-500"
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
        <h3 className="text-2xl font-bold mb-3">{t("success.title")}</h3>
        <p className="text-[var(--color-text-muted)] mb-8">
          {t("success.text")}
        </p>
        <Button variant="outline" onClick={() => setStatus("idle")}>
          {t("success.newMessage")}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
          <label className="block text-sm font-medium mb-2">{t("name")} *</label>
          <input
            type="text"
            required
            minLength={2}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none transition-all placeholder:text-white/30"
            placeholder={t("namePlaceholder")}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">{t("email")} *</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none transition-all placeholder:text-white/30"
            placeholder={t("emailPlaceholder")}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">{t("phone")}</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none transition-all placeholder:text-white/30"
            placeholder={t("phonePlaceholder")}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">{t("company")}</label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) =>
              setFormData({ ...formData, company: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none transition-all placeholder:text-white/30"
            placeholder={t("companyPlaceholder")}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">{t("interest")}</label>
        <select
          value={formData.packageInterest}
          onChange={(e) =>
            setFormData({ ...formData, packageInterest: e.target.value })
          }
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none transition-all"
        >
          <option value="" className="bg-[#0a0a0f]">
            {t("interestPlaceholder")}
          </option>
          <option value="one-page" className="bg-[#0a0a0f]">
            {t("interestOptions.onePage")}
          </option>
          <option value="business" className="bg-[#0a0a0f]">
            {t("interestOptions.business")}
          </option>
          <option value="growth" className="bg-[#0a0a0f]">
            {t("interestOptions.growth")}
          </option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">{t("message")} *</label>
        <textarea
          required
          minLength={10}
          rows={4}
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none transition-all resize-none placeholder:text-white/30"
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
        className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[var(--color-accent)] to-[#FFB347] text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="w-5 h-5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {t("sending")}
          </span>
        ) : (
          t("submit")
        )}
      </button>

      <p className="text-xs text-white/40 text-center">
        {t("privacyText")}{" "}
        <Link
          href="/datenschutz"
          className="underline hover:text-[var(--color-accent)]"
        >
          {t("privacyLink")}
        </Link>
        .
      </p>
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
    { value: t("stats.responseTime.value"), label: t("stats.responseTime.label") },
    { value: t("stats.consultation.value"), label: t("stats.consultation.label") },
    { value: t("stats.nonBinding.value"), label: t("stats.nonBinding.label") },
  ];

  const contactItems = [
    {
      icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
      label: t("directContact.whatsapp.label"),
      sublabel: t("directContact.whatsapp.sublabel"),
      href: "https://wa.me/491799498247",
      color: "hover:bg-green-500/10",
    },
    {
      icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
      label: t("directContact.email.label"),
      sublabel: t("directContact.email.sublabel"),
      href: "mailto:kontakt@agentflowm.com",
      color: "hover:bg-[var(--color-accent)]/10",
    },
    {
      icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
      label: t("directContact.phone.label"),
      sublabel: t("directContact.phone.sublabel"),
      href: "tel:+491799498247",
      color: "hover:bg-purple-500/10",
    },
  ];

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
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-30px) translateX(15px);
          }
        }
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-28 md:pt-32 pb-10 sm:pb-12 md:pb-16 overflow-hidden">
        <AnimatedBackground />

        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 mb-6 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
              <span className="text-sm font-medium text-[var(--color-accent)]">
                {t("badge")}
              </span>
            </div>

            <h1
              className={`text-5xl md:text-6xl font-bold mb-6 transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              {t("title")}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent)] via-[#FFB347] to-[#9D65C9]">
                {t("titleHighlight")}
              </span>
            </h1>

            <p
              className={`text-xl text-white/60 mb-8 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              {t("subtitle")}
            </p>

            <div
              className={`flex flex-wrap justify-center gap-8 transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-bold text-[var(--color-accent)]">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/40">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-10 sm:py-12 md:py-16">
        <div className="container px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-5 gap-6 sm:gap-8">
              {/* Contact Form - 3 columns */}
              <div className="lg:col-span-3">
                <div className="p-8 rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 backdrop-blur-sm">
                  <h2 className="text-2xl font-bold mb-6">
                    {t("form.title")}
                  </h2>
                  <ContactForm />
                </div>
              </div>

              {/* Sidebar - 2 columns */}
              <div className="lg:col-span-2 space-y-6">
                {/* Calendly Card */}
                <div className="p-8 rounded-3xl bg-gradient-to-br from-[var(--color-accent)]/20 to-transparent border border-[var(--color-accent)]/20 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--color-accent)]/20 flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-[var(--color-accent)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    {t("calendar.title")}
                  </h3>
                  <p className="text-white/50 text-sm mb-6">
                    {t("calendar.subtitle")}
                  </p>
                  <Button
                    variant="primary"
                    href="https://calendly.com/agentflowm/30min"
                    external
                    className="w-full"
                  >
                    {t("calendar.button")}
                  </Button>
                </div>

                {/* Quick Contact */}
                <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10">
                  <h3 className="font-semibold mb-4">{t("directContact.title")}</h3>
                  <div className="space-y-3">
                    {contactItems.map((item, i) => (
                      <a
                        key={i}
                        href={item.href}
                        target={
                          item.href.startsWith("http") ? "_blank" : undefined
                        }
                        rel={
                          item.href.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className={`flex items-center gap-4 p-3 rounded-xl bg-white/5 ${item.color} transition-all group`}
                      >
                        <span className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-white/70"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d={item.icon}
                            />
                          </svg>
                        </span>
                        <div>
                          <div className="font-medium">{item.label}</div>
                          <div className="text-sm text-white/40">
                            {item.sublabel}
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white/70"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </span>
                    <h3 className="font-semibold">{t("location.title")}</h3>
                  </div>
                  <p className="text-white/50 text-sm whitespace-pre-line">
                    {t("location.address")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
