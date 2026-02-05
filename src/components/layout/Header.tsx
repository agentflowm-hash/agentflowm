"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useAuth } from "@/lib/auth-context";
import { type Locale } from "@/i18n/config";

// Portal URL from environment or fallback
const PORTAL_URL =
  process.env.NEXT_PUBLIC_PORTAL_URL || "https://portal.agentflowm.com";

interface HeaderProps {
  locale?: Locale;
}

export function Header({ locale = "en" }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, loading, logout } = useAuth();
  const t = useTranslations("nav");

  const navigation = [
    { label: "Home", href: "/" },
    { label: t("solution"), href: "/loesung" },
    { label: "Workflows", href: "/workflows" },
    { label: t("projects"), href: "/projekte" },
    { label: t("international"), href: "/international" },
    { label: t("packages"), href: "/pakete", highlight: true },
    { label: t("tools"), href: "/tools" },
  ];

  const handleLogout = async () => {
    await logout();
    setShowProfileMenu(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
      <div className="container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/brand/logo-primary-dark.png"
              alt="AgentFlowMarketing"
              width={180}
              height={45}
              className="h-8 md:h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  item.highlight
                    ? "text-[#FC682C]"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <LanguageSwitcher locale={locale} />

            {/* Conditional: Login or Profile */}
            {!loading && (
              <>
                {user ? (
                  /* Profile Dropdown for logged in users */
                  <div className="relative hidden md:block">
                    <button
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                    >
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FC682C] to-[#FF8F5C] flex items-center justify-center">
                        <span className="text-xs font-bold text-white">
                          {(user.name || user.username).charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-white max-w-[100px] truncate">
                        {user.name || `@${user.username}`}
                      </span>
                      <svg
                        className={`w-4 h-4 text-white/50 transition-transform ${showProfileMenu ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {showProfileMenu && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setShowProfileMenu(false)}
                        />
                        <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#0f0f12] border border-white/10 shadow-2xl shadow-black/50 z-50 overflow-hidden">
                          {/* Profile Header */}
                          <div className="p-4 border-b border-white/[0.06] bg-gradient-to-br from-[#FC682C]/10 to-transparent">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FC682C] to-[#FF8F5C] flex items-center justify-center shadow-lg">
                                <span className="text-base font-bold text-white">
                                  {(user.name || user.username).charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white font-semibold truncate">
                                  {user.name || user.username}
                                </p>
                                <p className="text-xs text-white/50">@{user.username}</p>
                              </div>
                            </div>
                          </div>

                          {/* Portal Access Code */}
                          {user.accessCode && (
                            <div className="mx-2 mt-2 p-3 rounded-lg bg-gradient-to-r from-[#FC682C]/10 to-purple-500/10 border border-[#FC682C]/20">
                              <div className="flex items-center gap-2 mb-1">
                                <svg className="w-4 h-4 text-[#FC682C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                                <span className="text-xs text-white/50">Portal Code</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <code className="text-sm font-mono font-bold text-[#FC682C]">{user.accessCode}</code>
                                <a href={PORTAL_URL} target="_blank" rel="noopener noreferrer" className="text-xs text-white/50 hover:text-white transition-colors">Portal</a>
                              </div>
                            </div>
                          )}

                          {/* Menu Items */}
                          <div className="p-2">
                            {user.accessCode && (
                              <a
                                href={PORTAL_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setShowProfileMenu(false)}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#FC682C] hover:bg-[#FC682C]/10 transition-all font-medium"
                              >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span>Customer Portal</span>
                              </a>
                            )}
                            <Link
                              href="/tools"
                              onClick={() => setShowProfileMenu(false)}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-all"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span>{t("tools")}</span>
                            </Link>
                          </div>

                          {/* Logout */}
                          <div className="p-2 border-t border-white/[0.06]">
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-left"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                              <span>Logout</span>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  /* Login Button for non-logged in users */
                  <Link
                    href="/anmelden"
                    className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.121.099.154.232.17.325.015.093.034.305.019.471z" />
                    </svg>
                    {t("login")}
                  </Link>
                )}
              </>
            )}

            <div className="hidden md:flex items-center gap-2">
              <Button variant="outline" size="sm" href="/website-check">
                Website Check
              </Button>
              <Button
                variant="primary"
                size="sm"
                href="https://calendly.com/agentflowm/30min"
                external
              >
                {t("bookAppointment")}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-white/10 text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <nav className="flex flex-col gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-3 text-base font-medium rounded-lg hover:bg-white/10 text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-2 px-4">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-[#FC682C]/10 to-transparent border border-white/10 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FC682C] to-[#FF8F5C] flex items-center justify-center">
                        <span className="text-base font-bold text-white">
                          {(user.name || user.username).charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-semibold">{user.name || user.username}</p>
                        <p className="text-xs text-white/50">@{user.username}</p>
                      </div>
                    </div>
                    <a
                      href={PORTAL_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 py-2.5 px-3 text-sm font-medium text-[#FC682C] border border-[#FC682C]/30 bg-[#FC682C]/10 hover:bg-[#FC682C]/20 rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Customer Portal
                    </a>
                    <button
                      onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                      className="flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 border border-red-500/20 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/anmelden"
                    className="flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-white/60 hover:text-white border border-white/10 hover:bg-white/5 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.121.099.154.232.17.325.015.093.034.305.019.471z" />
                    </svg>
                    {t("login")}
                  </Link>
                )}
                <Button variant="outline" href="/website-check" className="w-full">
                  Website Check
                </Button>
                <Button variant="primary" href="https://calendly.com/agentflowm/30min" external className="w-full">
                  {t("bookAppointment")}
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
