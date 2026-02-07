"use client";

import { CalendarDaysIcon } from "@heroicons/react/24/outline";

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
  // Format date for calendar files
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  };

  const startDate = formatDate(event.startDate);
  const endDate = event.endDate ? formatDate(event.endDate) : formatDate(
    new Date(new Date(event.startDate).getTime() + 60 * 60 * 1000).toISOString()
  );

  // Generate ICS content
  const generateICS = () => {
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//AgentFlow//Admin//DE",
      "BEGIN:VEVENT",
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      `SUMMARY:${event.title}`,
      event.description ? `DESCRIPTION:${event.description}` : "",
      event.location ? `LOCATION:${event.location}` : "",
      `UID:${Date.now()}@agentflow.de`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].filter(Boolean).join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.title.replace(/[^a-zA-Z0-9]/g, "_")}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Generate Google Calendar URL
  const generateGoogleCalendarURL = () => {
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: event.title,
      dates: `${startDate}/${endDate}`,
      details: event.description || "",
      location: event.location || "",
    });
    window.open(`https://calendar.google.com/calendar/render?${params}`, "_blank");
  };

  return (
    <div className={`relative group ${className}`}>
      <button
        className="p-2 rounded-lg bg-white/[0.05] hover:bg-[#FC682C]/20 border border-white/[0.08] hover:border-[#FC682C]/30 transition-all group-hover:scale-105"
        title="Zum Kalender hinzufügen"
      >
        <CalendarDaysIcon className="w-4 h-4 text-white/50 group-hover:text-[#FC682C]" />
      </button>

      {/* Dropdown */}
      <div className="absolute right-0 top-full mt-2 w-48 py-2 bg-[#0f0f12] rounded-xl border border-white/[0.08] shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        <button
          onClick={generateGoogleCalendarURL}
          className="w-full px-4 py-2 text-left text-sm text-white/70 hover:text-white hover:bg-white/[0.05] transition-colors"
        >
          🗓️ Google Calendar
        </button>
        <button
          onClick={generateICS}
          className="w-full px-4 py-2 text-left text-sm text-white/70 hover:text-white hover:bg-white/[0.05] transition-colors"
        >
          📅 Apple / Outlook (.ics)
        </button>
      </div>
    </div>
  );
}
