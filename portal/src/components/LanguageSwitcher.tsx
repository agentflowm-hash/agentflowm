"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { GlobeAltIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

const languages = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
] as const;

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Only show on .com domain (not .de)
  if (typeof window !== "undefined" && window.location.hostname.includes(".de")) {
    return null;
  }

  const currentLang = languages.find((l) => l.code === locale) || languages[0];

  const switchLocale = (newLocale: string) => {
    // Replace current locale in path with new locale
    const segments = pathname.split("/");
    if (["en", "ar", "de"].includes(segments[1])) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    router.push(segments.join("/") || "/");
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm"
      >
        <span className="text-lg">{currentLang.flag}</span>
        <span className="text-white/70 hidden sm:inline">{currentLang.label}</span>
        <ChevronDownIcon className={`w-4 h-4 text-white/50 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-40 rounded-xl bg-[#0f0f12] border border-white/10 shadow-2xl z-40 overflow-hidden animate-fade-in">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => switchLocale(lang.code)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${
                  lang.code === locale
                    ? "bg-[#FC682C]/10 text-[#FC682C]"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="font-medium">{lang.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
