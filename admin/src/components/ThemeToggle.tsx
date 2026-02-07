"use client";

import { useState, useEffect } from "react";
import { SunIcon, MoonIcon, ComputerDesktopIcon } from "@heroicons/react/24/outline";

type Theme = "light" | "dark" | "system";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme") as Theme | null;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    
    if (theme === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", prefersDark);
      root.classList.toggle("light", !prefersDark);
    } else {
      root.classList.toggle("dark", theme === "dark");
      root.classList.toggle("light", theme === "light");
    }

    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  if (!mounted) return null;

  const themes: { value: Theme; icon: typeof SunIcon; label: string }[] = [
    { value: "light", icon: SunIcon, label: "Hell" },
    { value: "dark", icon: MoonIcon, label: "Dunkel" },
    { value: "system", icon: ComputerDesktopIcon, label: "System" },
  ];

  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`p-2 rounded-lg transition-all ${
            theme === value
              ? "bg-[#FC682C] text-white shadow-lg shadow-[#FC682C]/30"
              : "text-white/40 hover:text-white hover:bg-white/[0.05]"
          }`}
          title={label}
        >
          <Icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
}
