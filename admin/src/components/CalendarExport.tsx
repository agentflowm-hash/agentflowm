"use client";

import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

interface CalendarEvent {
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  location?: string;
}

interface CalendarExportProps {
  event: CalendarEvent;
  className?: string;
}

export default function CalendarExport({ event, className = "" }: CalendarExportProps) {
  const t = useTranslations("calendar");

  const formatDate = (dateStr: string): string => {
    // Parse DD.MM.YYYY or YYYY-MM-DD
    let date: Date;
    if (dateStr.includes(".")) {
      const [day, month, year] = dateStr.split(".");
      date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else {
      date = new Date(dateStr);
    }
    
    // Format as YYYYMMDD for ICS
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}${m}${d}`;
  };

  const generateICS = () => {
    const start = formatDate(event.startDate);
    const end = event.endDate ? formatDate(event.endDate) : start;

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//AgentFlowMarketing//Portal//EN",
      "BEGIN:VEVENT",
      `DTSTART;VALUE=DATE:${start}`,
      `DTEND;VALUE=DATE:${end}`,
      `SUMMARY:${event.title}`,
      event.description ? `DESCRIPTION:${event.description.replace(/\n/g, "\\n")}` : "",
      event.location ? `LOCATION:${event.location}` : "",
      `UID:${Date.now()}@agentflowm.com`,
      "END:VEVENT",
      "END:VCALENDAR",
    ]
      .filter(Boolean)
      .join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${event.title.replace(/[^a-z0-9]/gi, "_")}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const addToGoogleCalendar = () => {
    const start = formatDate(event.startDate);
    const end = event.endDate ? formatDate(event.endDate) : start;
    
    const url = new URL("https://calendar.google.com/calendar/render");
    url.searchParams.set("action", "TEMPLATE");
    url.searchParams.set("text", event.title);
    url.searchParams.set("dates", `${start}/${end}`);
    if (event.description) url.searchParams.set("details", event.description);
    if (event.location) url.searchParams.set("location", event.location);
    
    window.open(url.toString(), "_blank");
  };

  return (
    <div className={`relative group ${className}`}>
      <button
        onClick={generateICS}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all text-sm"
      >
        <CalendarDaysIcon className="w-4 h-4" />
        <span className="hidden sm:inline">{t?.("addToCalendar") || "Add to Calendar"}</span>
      </button>
      
      {/* Dropdown for calendar options */}
      <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#0f0f12] border border-white/10 shadow-2xl z-40 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
        <button
          onClick={generateICS}
          className="w-full flex items-center gap-3 px-4 py-3 text-left text-white/70 hover:text-white hover:bg-white/5 transition-all text-sm"
        >
          <span>📅</span>
          <span>{t?.("downloadICS") || "Download .ics"}</span>
        </button>
        <button
          onClick={addToGoogleCalendar}
          className="w-full flex items-center gap-3 px-4 py-3 text-left text-white/70 hover:text-white hover:bg-white/5 transition-all text-sm"
        >
          <span>📆</span>
          <span>{t?.("googleCalendar") || "Google Calendar"}</span>
        </button>
      </div>
    </div>
  );
}
