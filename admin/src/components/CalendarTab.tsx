"use client";

import { useState, useEffect, useCallback } from "react";
import {
  CalendarDaysIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface CalendarEvent {
  id: number | string;
  title: string;
  description?: string;
  start_date: string;
  end_date?: string;
  type: string;
  color: string;
  all_day?: boolean;
  project_id?: number;
  client_id?: number;
  location?: string;
}

export default function CalendarTab() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week" | "list">("month");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      const res = await fetch(
        `/api/calendar?start=${startOfMonth.toISOString()}&end=${endOfMonth.toISOString()}`,
        { credentials: "include" }
      );
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
    setLoading(false);
  }, [currentDate]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days: (Date | null)[] = [];
    
    // Padding for days before month starts
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const getEventsForDay = (date: Date | null) => {
    if (!date) return [];
    const dateStr = date.toISOString().split("T")[0];
    return events.filter(e => e.start_date.split("T")[0] === dateStr);
  };

  const monthNames = ["Januar", "Februar", "März", "April", "Mai", "Juni", 
                      "Juli", "August", "September", "Oktober", "November", "Dezember"];
  const dayNames = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "deadline": return "bg-red-500";
      case "meeting": return "bg-blue-500";
      case "milestone": return "bg-purple-500";
      case "reminder": return "bg-yellow-500";
      default: return "bg-[#FC682C]";
    }
  };

  // Upcoming Events (next 7 days)
  const upcomingEvents = events
    .filter(e => {
      const eventDate = new Date(e.start_date);
      const now = new Date();
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      return eventDate >= now && eventDate <= weekFromNow;
    })
    .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <CalendarDaysIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Kalender</h2>
            <p className="text-sm text-white/40">{events.length} Events</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex bg-white/5 rounded-lg p-1">
            {(["month", "week", "list"] as const).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  view === v ? "bg-[#FC682C] text-white" : "text-white/50 hover:text-white"
                }`}
              >
                {v === "month" ? "Monat" : v === "week" ? "Woche" : "Liste"}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-[#FC682C] to-[#FF8F5C] text-white rounded-lg text-sm font-medium flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Event
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-3 bg-[#0f0f12]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <ChevronLeftIcon className="w-5 h-5 text-white/70" />
            </button>
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-white">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <button 
                onClick={goToToday}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs text-white/70 transition-colors"
              >
                Heute
              </button>
            </div>
            <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <ChevronRightIcon className="w-5 h-5 text-white/70" />
            </button>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-xs font-medium text-white/40 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          {loading ? (
            <div className="h-96 flex items-center justify-center text-white/40">Laden...</div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth().map((date, idx) => {
                const dayEvents = getEventsForDay(date);
                return (
                  <div
                    key={idx}
                    className={`min-h-[100px] p-2 rounded-lg border transition-colors ${
                      date 
                        ? isToday(date) 
                          ? "bg-[#FC682C]/10 border-[#FC682C]/30" 
                          : "bg-white/[0.02] border-white/[0.04] hover:border-white/10"
                        : "bg-transparent border-transparent"
                    }`}
                  >
                    {date && (
                      <>
                        <div className={`text-sm font-medium mb-1 ${
                          isToday(date) ? "text-[#FC682C]" : "text-white/70"
                        }`}>
                          {date.getDate()}
                        </div>
                        <div className="space-y-1">
                          {dayEvents.slice(0, 3).map(event => (
                            <div
                              key={event.id}
                              onClick={() => setSelectedEvent(event)}
                              className={`text-[10px] px-1.5 py-0.5 rounded truncate cursor-pointer hover:opacity-80 ${getEventColor(event.type)} text-white`}
                            >
                              {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 3 && (
                            <div className="text-[10px] text-white/40">
                              +{dayEvents.length - 3} mehr
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar - Upcoming */}
        <div className="bg-[#0f0f12]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-white mb-4">📅 Nächste 7 Tage</h3>
          {upcomingEvents.length === 0 ? (
            <p className="text-sm text-white/40">Keine anstehenden Events</p>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map(event => (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className="p-3 bg-white/[0.03] hover:bg-white/[0.06] rounded-xl cursor-pointer transition-colors"
                >
                  <div className="flex items-start gap-2">
                    <div className={`w-2 h-2 rounded-full mt-1.5 ${getEventColor(event.type)}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{event.title}</div>
                      <div className="text-xs text-white/40 flex items-center gap-1 mt-1">
                        <ClockIcon className="w-3 h-3" />
                        {new Date(event.start_date).toLocaleDateString("de-DE", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Stats */}
          <div className="mt-6 pt-4 border-t border-white/[0.06]">
            <h4 className="text-xs font-medium text-white/50 mb-3">Event-Typen</h4>
            <div className="space-y-2">
              {[
                { type: "deadline", label: "Deadlines", color: "bg-red-500" },
                { type: "meeting", label: "Meetings", color: "bg-blue-500" },
                { type: "milestone", label: "Meilensteine", color: "bg-purple-500" },
              ].map(({ type, label, color }) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${color}`} />
                    <span className="text-xs text-white/60">{label}</span>
                  </div>
                  <span className="text-xs text-white/40">
                    {events.filter(e => e.type === type).length}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f0f12] border border-white/10 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getEventColor(selectedEvent.type)}`} />
                <span className="text-xs text-white/50 uppercase">{selectedEvent.type}</span>
              </div>
              <button onClick={() => setSelectedEvent(null)} className="p-1 hover:bg-white/10 rounded-lg">
                <XMarkIcon className="w-5 h-5 text-white/50" />
              </button>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{selectedEvent.title}</h3>
            {selectedEvent.description && (
              <p className="text-sm text-white/60 mb-4">{selectedEvent.description}</p>
            )}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-white/60">
                <ClockIcon className="w-4 h-4" />
                {new Date(selectedEvent.start_date).toLocaleString("de-DE")}
              </div>
              {selectedEvent.location && (
                <div className="flex items-center gap-2 text-white/60">
                  <MapPinIcon className="w-4 h-4" />
                  {selectedEvent.location}
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={async () => {
                  if (typeof selectedEvent.id === "number") {
                    await fetch(`/api/calendar/${selectedEvent.id}`, {
                      method: "DELETE",
                      credentials: "include",
                    });
                    fetchEvents();
                  }
                  setSelectedEvent(null);
                }}
                className="flex-1 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm transition-colors"
              >
                Löschen
              </button>
              <button
                onClick={() => setSelectedEvent(null)}
                className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateModal && (
        <CreateEventModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => { fetchEvents(); setShowCreateModal(false); }}
        />
      )}
    </div>
  );
}

function CreateEventModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    start_date: new Date().toISOString().slice(0, 16),
    type: "event",
    all_day: false,
    location: "",
    reminder_minutes: 30,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      if (res.ok) {
        onCreated();
      }
    } catch (error) {
      console.error(error);
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0f0f12] border border-white/10 rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Neues Event</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg">
            <XMarkIcon className="w-5 h-5 text-white/50" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-white/60 mb-1">Titel *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 bg-white/[0.04] border border-white/10 rounded-lg text-white focus:border-[#FC682C]/50 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1">Typ</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full px-3 py-2 bg-white/[0.04] border border-white/10 rounded-lg text-white focus:border-[#FC682C]/50 outline-none"
            >
              <option value="event">Event</option>
              <option value="meeting">Meeting</option>
              <option value="deadline">Deadline</option>
              <option value="reminder">Erinnerung</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1">Datum & Zeit *</label>
            <input
              type="datetime-local"
              required
              value={form.start_date}
              onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              className="w-full px-3 py-2 bg-white/[0.04] border border-white/10 rounded-lg text-white focus:border-[#FC682C]/50 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1">Ort</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Zoom, Büro, ..."
              className="w-full px-3 py-2 bg-white/[0.04] border border-white/10 rounded-lg text-white focus:border-[#FC682C]/50 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1">Beschreibung</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 bg-white/[0.04] border border-white/10 rounded-lg text-white focus:border-[#FC682C]/50 outline-none resize-none"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm transition-colors"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 bg-gradient-to-r from-[#FC682C] to-[#FF8F5C] text-white rounded-xl text-sm font-medium disabled:opacity-50"
            >
              {saving ? "Speichern..." : "Erstellen"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
