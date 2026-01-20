"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { type Locale } from "@/i18n/config";

const contact = {
  email: "kontakt@agentflowm.com",
  phone: "+49 179 949 8247",
  phoneLink: "tel:+491799498247",
  whatsapp: "https://wa.me/491799498247",
  address: "Achillesstrasse 69, 13125 Berlin",
};

interface FooterProps {
  locale?: Locale;
}

export function Footer({ locale = "en" }: FooterProps) {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  const footerLinks = {
    navigation: [
      { label: "Home", href: "/" },
      { label: tNav("solution"), href: "/loesung" },
      { label: tNav("packages"), href: "/#pakete" },
    ],
    tools: [
      { label: "Website Check", href: "/website-check" },
    ],
    legal: [
      { label: t("imprint"), href: "/impressum" },
      { label: t("privacy"), href: "/datenschutz" },
    ],
  };

  return (
    <footer className="bg-[#0a0a0f] border-t border-white/10">
      <div className="container px-4 sm:px-6 py-10 sm:py-12 md:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 md:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-3 sm:mb-4">
              <Image
                src="/brand/logo-primary-dark.png"
                alt="AgentFlowMarketing"
                width={160}
                height={40}
                className="h-7 sm:h-9 w-auto"
                loading="lazy"
              />
            </Link>
            <p className="text-xs sm:text-sm text-white/50 mb-3 sm:mb-4">
              {t("tagline")}
            </p>
            <div className="flex gap-2 sm:gap-3">
              <a
                href={contact.whatsapp}
                target="_blank"
                rel="noopener nofollow"
                className="p-2 rounded-lg bg-white/5 text-white/60 hover:bg-[#FC682C] hover:text-white transition-colors"
                aria-label="WhatsApp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <a
                href={`mailto:${contact.email}`}
                className="p-2 rounded-lg bg-white/5 text-white/60 hover:bg-[#FC682C] hover:text-white transition-colors"
                aria-label="Email"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
              <a
                href={contact.phoneLink}
                className="p-2 rounded-lg bg-white/5 text-white/60 hover:bg-[#FC682C] hover:text-white transition-colors"
                aria-label="Phone"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-white text-sm sm:text-base">
              Navigation
            </h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {footerLinks.navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-white/50 hover:text-[#FC682C] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-white text-sm sm:text-base">
              {tNav("tools")}
            </h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {footerLinks.tools.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-white/50 hover:text-[#FC682C] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-white text-sm sm:text-base">
              {t("contact")}
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-white/50">
              <li>
                <a href={`mailto:${contact.email}`} className="hover:text-[#FC682C] transition-colors">
                  {contact.email}
                </a>
              </li>
              <li>
                <a href={contact.phoneLink} className="hover:text-[#FC682C] transition-colors">
                  {contact.phone}
                </a>
              </li>
              <li>{contact.address}</li>
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/10">
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 md:gap-10">
            {/* Google Reviews */}
            <a
              href="https://g.co/kgs/AgentFlowMarketing"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors group"
            >
              <svg className="w-5 h-5 text-white/60 group-hover:text-white/80" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-[10px] text-white/40">Google Reviews</span>
              </div>
            </a>

            {/* SSL Secured */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03]">
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div className="flex flex-col">
                <span className="text-[11px] text-white/60 font-medium">SSL</span>
                <span className="text-[10px] text-white/40">Secured</span>
              </div>
            </div>

            {/* GDPR Compliant */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03]">
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex flex-col">
                <span className="text-[11px] text-white/60 font-medium">GDPR</span>
                <span className="text-[10px] text-white/40">Compliant</span>
              </div>
            </div>

            {/* Made in Germany */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03]">
              <div className="w-5 h-5 rounded overflow-hidden flex flex-col">
                <div className="h-1/3 bg-black"></div>
                <div className="h-1/3 bg-red-600"></div>
                <div className="h-1/3 bg-yellow-400"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-white/60 font-medium">Made in</span>
                <span className="text-[10px] text-white/40">Germany</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
          <p className="text-xs sm:text-sm text-white/40 text-center sm:text-start">
            © {new Date().getFullYear()} {t("company")}. {t("copyright")}
          </p>
          <div className="flex gap-4 sm:gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs sm:text-sm text-white/40 hover:text-[#FC682C] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
