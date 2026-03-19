"use client";

import { useState, useEffect, useCallback } from "react";
import {
  CalendarDaysIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon,
  ListBulletIcon,
  Squares2X2Icon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BellIcon,
  FlagIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import { useToast } from "@/components";

// ═══════════════════════════════════════════════════════════════
//                         TYPES
// ═══════════════════════════════════════════════════════════════

interface CalendarEvent {
  id: number;
  title: string;
  description?: string;
  start_date: string;
  end_date?: string;
  type: string;
  color?: string;
  all_day?: boolean;
  client_id?: number;
  client_name?: string;
  project_id?: number;
  location?: string;
  google_event_id?: string;
  created_at: string;
}

interface Client {
  id: number;
  name: string;
  company?: string;
}

type ViewMode = "month" | "week" | "list";

const EVENT_TYPES: Record<string, { label: string; color: string }> = {
  meeting: { label: "Meeting", color: "bg-blue-500" },
  deadline: { label: "Deadline", color: "bg-red-500" },
  milestone: { label: "Meilenstein", color: "bg-purple-500" },
  reminder: { label: "Erinnerung", color: "bg-yellow-500" },
  client: { label: "Kundentermin", color: "bg-[#FC682C]" },
};

const COLOR_OPTIONS = [
  { value: "#FC682C", label: "Orange" },
  { value: "#3B82F6", label: "Blau" },
  { value: "#22C55E", label: "Grün" },
  { value: "#8B5CF6", label: "Lila" },
  { value: "#EF4444", label: "Rot" },
];

const MONTH_NAMES = ["Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember"];
const DAY_NAMES = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

function unwrapApi<T>(res: unknown): T {
  if (res && typeof res === "object" && "data" in res) return (res as any).data;
  return res as T;
}

// ═══════════════════════════════════════════════════════════════
//                      MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function CalendarTab() {
  const { showToast } = useToast();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewMode>("month");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [prefilledDate, setPrefilledDate] = useState<string>("");

  // ─── Fetch ─────────────────────────────────────────────────

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const y = currentDate.getFullYear();
      const m = currentDate.getMonth();
      const start = new Date(y, m - 1, 1).toISOString();
      const end = new Date(y, m + 2, 0).toISOString();

      const res = await fetch(
        `/api/calendar?start=${start}&end=${end}`,
        { credentials: "include" }
      );
      if (res.ok) {
        const raw = await res.json();
        const d = unwrapApi<{ events: CalendarEvent[] }>(raw);
        setEvents(d.events || []);
      }
    } catch (err) {
      console.error("Failed to fetch events:", err);
    }
    setLoading(false);
  }, [currentDate]);

  const fetchClients = useCallback(async () => {
    try {
      const res = await fetch("/api/clients", { credentials: "include" });
      if (res.ok) {
        const raw = await res.json();
        const d = unwrapApi<{ clients: Client[] }>(raw);
        setClients(d.clients || []);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);
  useEffect(() => { fetchClients(); }, [fetchClients]);

  // ─── Helpers ───────────────────────────────────────────────

  const getEventsForDay = (date: Date) => {
    const ds = date.toISOString().split("T")[0];
    return events.filter(e => e.start_date.split("T")[0] === ds);
  };

  const isToday = (date: Date) => date.toDateString() === new Date().toDateString();

  const getEventTypeColor = (type: string) => EVENT_TYPES[type]?.color || "bg-[#FC682C]";

  const fmtTime = (d: string) => new Date(d).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
  const fmtDate = (d: string) => new Date(d).toLocaleDateString("de-DE", { weekday: "short", day: "numeric", month: "short" });
  const fmtDateLong = (d: string) => new Date(d).toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  const deleteEvent = async (id: number) => {
    try {
      const res = await fetch(`/api/calendar/${id}`, { method: "DELETE", credentials: "include" });
      if (res.ok) {
        showToast("success", "Event gelöscht");
      } else {
        showToast("error", "Fehler beim Löschen");
      }
    } catch {
      showToast("error", "Verbindungsfehler");
    }
    setSelectedEvent(null);
    fetchEvents();
  };

  // Calendar grid (Monday start)
  const getDaysInMonth = () => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    const firstDay = new Date(y, m, 1);
    const lastDay = new Date(y, m + 1, 0);
    let startPad = firstDay.getDay() - 1;
    if (startPad < 0) startPad = 6; // Sunday

    const days: (Date | null)[] = [];
    for (let i = 0; i < startPad; i++) days.push(null);
    for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(y, m, i));
    return days;
  };

  // Week view days
  const getWeekDays = () => {
    const d = new Date(currentDate);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      days.push(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i));
    }
    return days;
  };

  // Upcoming events
  const now = new Date();
  const todayEvents = events.filter(e => e.start_date.split("T")[0] === now.toISOString().split("T")[0]);
  const upcomingEvents = events
    .filter(e => {
      const ed = new Date(e.start_date);
      const weekLater = new Date(now.getTime() + 7 * 86400000);
      return ed >= now && ed <= weekLater;
    })
    .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

  // Stats
  const typeCounts = Object.keys(EVENT_TYPES).reduce((acc, t) => {
    acc[t] = events.filter(e => e.type === t).length;
    return acc;
  }, {} as Record<string, number>);

  // ─── Render ────────────────────────────────────────────────

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
          <div className="flex bg-white/[0.04] rounded-xl p-1">
            {([
              { id: "month" as ViewMode, label: "Monat", icon: Squares2X2Icon },
              { id: "week" as ViewMode, label: "Woche", icon: CalendarIcon },
              { id: "list" as ViewMode, label: "Liste", icon: ListBulletIcon },
            ]).map(v => (
              <button key={v.id} onClick={() => setView(v.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  view === v.id ? "bg-[#FC682C] text-white" : "text-white/50 hover:text-white"
                }`}>
                <v.icon className="w-3.5 h-3.5" />{v.label}
              </button>
            ))}
          </div>
          <button onClick={() => { setEditingEvent(null); setPrefilledDate(""); setShowCreateModal(true); }}
            className="px-4 py-2 bg-[#FC682C] hover:bg-[#e55d27] text-white rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
            <PlusIcon className="w-4 h-4" />Event
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* ── Main Area ──────────────────────────────────── */}
        <div className="lg:col-span-3 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="p-2 hover:bg-white/[0.05] rounded-lg transition-colors">
              <ChevronLeftIcon className="w-5 h-5 text-white/60" />
            </button>
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-white">
                {MONTH_NAMES[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <button onClick={goToToday}
                className="px-3 py-1 bg-white/[0.06] hover:bg-white/[0.1] rounded-lg text-xs text-white/60 transition-colors">
                Heute
              </button>
            </div>
            <button onClick={nextMonth} className="p-2 hover:bg-white/[0.05] rounded-lg transition-colors">
              <ChevronRightIcon className="w-5 h-5 text-white/60" />
            </button>
          </div>

          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[#FC682C] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* ── MONTH VIEW ────────────────────────── */}
              {view === "month" && (
                <>
                  <div className="grid grid-cols-7 gap-px mb-1">
                    {DAY_NAMES.map(d => (
                      <div key={d} className="text-center text-[10px] font-medium text-white/30 py-2">{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-px">
                    {getDaysInMonth().map((date, idx) => {
                      const dayEv = date ? getEventsForDay(date) : [];
                      return (
                        <div key={idx}
                          onClick={() => date && setSelectedDay(date)}
                          className={`min-h-[90px] p-1.5 rounded-lg transition-colors cursor-pointer ${
                            !date ? "bg-transparent" :
                            isToday(date) ? "bg-white/[0.02] border-2 border-[#FC682C]/50" :
                            selectedDay && date && date.toDateString() === selectedDay.toDateString()
                              ? "bg-white/[0.04] border border-[#FC682C]/30"
                              : "bg-white/[0.01] border border-white/[0.04] hover:border-white/[0.1]"
                          }`}>
                          {date && (
                            <>
                              <div className={`text-xs font-medium mb-1 ${isToday(date) ? "text-[#FC682C] font-bold" : "text-white/50"}`}>
                                {date.getDate()}
                              </div>
                              <div className="space-y-0.5">
                                {dayEv.slice(0, 3).map(ev => (
                                  <div key={ev.id} onClick={(e) => { e.stopPropagation(); setSelectedEvent(ev); }}
                                    className="flex items-center gap-1 cursor-pointer hover:opacity-80">
                                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${getEventTypeColor(ev.type)}`} />
                                    <span className="text-[9px] text-white/60 truncate">{ev.title}</span>
                                  </div>
                                ))}
                                {dayEv.length > 3 && (
                                  <span className="text-[9px] text-white/30">+{dayEv.length - 3} weitere</span>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* ── WEEK VIEW ─────────────────────────── */}
              {view === "week" && (
                <div className="grid grid-cols-7 gap-2">
                  {getWeekDays().map(date => {
                    const dayEv = getEventsForDay(date);
                    return (
                      <div key={date.toISOString()} className={`rounded-xl p-3 min-h-[300px] ${
                        isToday(date) ? "bg-white/[0.03] border-2 border-[#FC682C]/40" : "bg-white/[0.01] border border-white/[0.06]"
                      }`}>
                        <div className={`text-xs font-medium mb-3 text-center ${isToday(date) ? "text-[#FC682C]" : "text-white/50"}`}>
                          {DAY_NAMES[date.getDay() === 0 ? 6 : date.getDay() - 1]}
                          <span className="block text-lg font-bold text-white/80">{date.getDate()}</span>
                        </div>
                        <div className="space-y-2">
                          {dayEv.map(ev => (
                            <div key={ev.id} onClick={() => setSelectedEvent(ev)}
                              className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] cursor-pointer transition-colors">
                              <div className="flex items-center gap-1.5 mb-1">
                                <div className={`w-2 h-2 rounded-full ${getEventTypeColor(ev.type)}`} />
                                <span className="text-[10px] text-white/80 font-medium truncate">{ev.title}</span>
                              </div>
                              <div className="text-[9px] text-white/30">{fmtTime(ev.start_date)}</div>
                            </div>
                          ))}
                          {dayEv.length === 0 && <p className="text-[9px] text-white/20 text-center">Keine Events</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ── LIST VIEW ─────────────────────────── */}
              {view === "list" && (() => {
                const sorted = events
                  .filter(e => new Date(e.start_date) >= new Date())
                  .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
                const grouped: Record<string, CalendarEvent[]> = {};
                sorted.forEach(e => {
                  const dk = e.start_date.split("T")[0];
                  if (!grouped[dk]) grouped[dk] = [];
                  grouped[dk].push(e);
                });
                return (
                  <div className="space-y-4">
                    {Object.entries(grouped).length === 0 && (
                      <p className="text-center text-white/30 py-12">Keine kommenden Events</p>
                    )}
                    {Object.entries(grouped).map(([dateKey, evts]) => (
                      <div key={dateKey}>
                        <div className="text-xs font-medium text-white/40 mb-2">{fmtDateLong(dateKey)}</div>
                        <div className="space-y-1.5">
                          {evts.map(ev => (
                            <div key={ev.id} onClick={() => setSelectedEvent(ev)}
                              className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] cursor-pointer transition-colors">
                              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${getEventTypeColor(ev.type)}`} />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-white/90 truncate">{ev.title}</div>
                                <div className="text-xs text-white/40">
                                  {ev.all_day ? "Ganztägig" : fmtTime(ev.start_date)}
                                  {ev.client_name && ` -- ${ev.client_name}`}
                                </div>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-[9px] font-medium ${getEventTypeColor(ev.type)} text-white`}>
                                {EVENT_TYPES[ev.type]?.label || ev.type}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </>
          )}
        </div>

        {/* ── Sidebar ────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Today */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <CalendarDaysIcon className="w-4 h-4 text-[#FC682C]" />
              <h3 className="text-sm font-semibold text-white">Heute</h3>
              <span className="text-xs text-white/30">{todayEvents.length}</span>
            </div>
            {todayEvents.length === 0 ? (
              <p className="text-xs text-white/30">Keine Events heute</p>
            ) : (
              <div className="space-y-2">
                {todayEvents.map(ev => (
                  <div key={ev.id} onClick={() => setSelectedEvent(ev)}
                    className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] cursor-pointer transition-colors">
                    <div className={`w-2 h-2 rounded-full ${getEventTypeColor(ev.type)}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-white/80 truncate">{ev.title}</div>
                      <div className="text-[10px] text-white/30">{fmtTime(ev.start_date)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Next 7 days */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <ClockIcon className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-semibold text-white">Nächste 7 Tage</h3>
              <span className="text-xs text-white/30">{upcomingEvents.length}</span>
            </div>
            {upcomingEvents.length === 0 ? (
              <p className="text-xs text-white/30">Keine anstehenden Events</p>
            ) : (
              <div className="space-y-2">
                {upcomingEvents.slice(0, 8).map(ev => (
                  <div key={ev.id} onClick={() => setSelectedEvent(ev)}
                    className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] cursor-pointer transition-colors">
                    <div className={`w-2 h-2 rounded-full ${getEventTypeColor(ev.type)}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-white/80 truncate">{ev.title}</div>
                      <div className="text-[10px] text-white/30">{fmtDate(ev.start_date)} {fmtTime(ev.start_date)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Event Type Stats */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4">
            <h4 className="text-xs font-medium text-white/40 mb-3">Event-Typen</h4>
            <div className="space-y-2">
              {Object.entries(EVENT_TYPES).map(([key, cfg]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${cfg.color}`} />
                    <span className="text-xs text-white/50">{cfg.label}</span>
                  </div>
                  <span className="text-xs font-medium text-white/70">{typeCounts[key] || 0}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Google Calendar Card */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <LinkIcon className="w-4 h-4 text-white/40" />
              <h3 className="text-xs font-semibold text-white/60">Google Kalender</h3>
            </div>
            <p className="text-[10px] text-white/30 mb-3">
              Synchronisiere deine Events mit Google Kalender. Events werden automatisch in beide Richtungen synchronisiert.
            </p>
            <button disabled
              className="w-full py-2 bg-white/[0.04] border border-white/[0.06] rounded-lg text-xs text-white/30 cursor-not-allowed"
              title="Demnächst verfügbar">
              Verbinden (bald verfügbar)
            </button>
          </div>
        </div>
      </div>

      {/* ── Day Detail Panel ─────────────────────────────── */}
      {selectedDay && !selectedEvent && (
        <DayPanel
          date={selectedDay}
          events={getEventsForDay(selectedDay)}
          onClose={() => setSelectedDay(null)}
          onSelectEvent={setSelectedEvent}
          onCreateEvent={() => {
            setEditingEvent(null);
            const d = selectedDay || new Date();
            setPrefilledDate(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}T09:00`);
            setShowCreateModal(true);
          }}
        />
      )}

      {/* ── Event Detail Modal ───────────────────────────── */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onDelete={() => deleteEvent(selectedEvent.id)}
          onEdit={() => { setEditingEvent(selectedEvent); setSelectedEvent(null); setShowCreateModal(true); }}
        />
      )}

      {/* ── Create/Edit Modal ────────────────────────────── */}
      {showCreateModal && (
        <CreateEventModal
          event={editingEvent}
          clients={clients}
          defaultDate={prefilledDate}
          onClose={() => { setShowCreateModal(false); setEditingEvent(null); setPrefilledDate(""); }}
          onSaved={() => { setShowCreateModal(false); setEditingEvent(null); setPrefilledDate(""); fetchEvents(); }}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                     DAY PANEL
// ═══════════════════════════════════════════════════════════════

function DayPanel({ date, events, onClose, onSelectEvent, onCreateEvent }: {
  date: Date; events: CalendarEvent[]; onClose: () => void;
  onSelectEvent: (e: CalendarEvent) => void; onCreateEvent: () => void;
}) {
  const fmtTime = (d: string) => new Date(d).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md bg-[#141418] border-l border-white/[0.08] h-full overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">
            {date.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" })}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-white/[0.05] rounded-lg"><XMarkIcon className="w-5 h-5 text-white/40" /></button>
        </div>
        {events.length === 0 ? (
          <div className="text-center py-12">
            <CalendarDaysIcon className="w-10 h-10 mx-auto mb-3 text-white/15" />
            <p className="text-sm text-white/30">Keine Events an diesem Tag</p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map(ev => (
              <div key={ev.id} onClick={() => onSelectEvent(ev)}
                className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] cursor-pointer transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-2 h-2 rounded-full ${EVENT_TYPES[ev.type]?.color || "bg-[#FC682C]"}`} />
                  <span className="text-sm font-medium text-white/90">{ev.title}</span>
                </div>
                <div className="text-xs text-white/40">{ev.all_day ? "Ganztägig" : fmtTime(ev.start_date)}</div>
              </div>
            ))}
          </div>
        )}
        <button onClick={onCreateEvent}
          className="w-full mt-4 py-2.5 bg-[#FC682C] hover:bg-[#e55d27] text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors">
          <PlusIcon className="w-4 h-4" />Event erstellen
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                   EVENT DETAIL MODAL
// ═══════════════════════════════════════════════════════════════

function EventDetailModal({ event, onClose, onDelete, onEdit }: {
  event: CalendarEvent; onClose: () => void; onDelete: () => void; onEdit: () => void;
}) {
  const typeCfg = EVENT_TYPES[event.type] || { label: event.type, color: "bg-[#FC682C]" };
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#141418] border border-white/[0.08] rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${typeCfg.color} text-white`}>{typeCfg.label}</span>
            <button onClick={onClose} className="p-1 hover:bg-white/[0.05] rounded-lg"><XMarkIcon className="w-5 h-5 text-white/40" /></button>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">{event.title}</h3>
          {event.description && <p className="text-sm text-white/50 mb-4">{event.description}</p>}
          <div className="space-y-2.5 text-sm">
            <div className="flex items-center gap-2.5 text-white/50">
              <ClockIcon className="w-4 h-4 flex-shrink-0" />
              <span>{new Date(event.start_date).toLocaleString("de-DE", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}</span>
            </div>
            {event.end_date && (
              <div className="flex items-center gap-2.5 text-white/50">
                <ClockIcon className="w-4 h-4 flex-shrink-0" />
                <span>bis {new Date(event.end_date).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
            )}
            {event.location && (
              <div className="flex items-center gap-2.5 text-white/50">
                <MapPinIcon className="w-4 h-4 flex-shrink-0" />
                <span>{event.location}</span>
              </div>
            )}
            {event.client_name && (
              <div className="flex items-center gap-2.5 text-white/50">
                <UserIcon className="w-4 h-4 flex-shrink-0" />
                <span>{event.client_name}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2 p-4 border-t border-white/[0.06]">
          <button onClick={onEdit} className="flex-1 py-2 bg-white/[0.06] hover:bg-white/[0.1] text-white rounded-xl text-sm flex items-center justify-center gap-1.5 transition-colors">
            <PencilIcon className="w-3.5 h-3.5" />Bearbeiten
          </button>
          <button onClick={onDelete} className="flex-1 py-2 bg-red-500/15 hover:bg-red-500/25 text-red-400 rounded-xl text-sm flex items-center justify-center gap-1.5 transition-colors">
            <TrashIcon className="w-3.5 h-3.5" />Löschen
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                   CREATE / EDIT EVENT MODAL
// ═══════════════════════════════════════════════════════════════

function CreateEventModal({ event, clients, defaultDate, onClose, onSaved }: {
  event: CalendarEvent | null; clients: Client[]; defaultDate?: string; onClose: () => void; onSaved: () => void;
}) {
  const { showToast } = useToast();
  const [form, setForm] = useState({
    title: event?.title || "",
    description: event?.description || "",
    start_date: event ? event.start_date.slice(0, 16) : (defaultDate || new Date().toISOString().slice(0, 16)),
    end_date: event?.end_date ? event.end_date.slice(0, 16) : "",
    type: event?.type || "meeting",
    all_day: event?.all_day || false,
    location: event?.location || "",
    color: event?.color || "#FC682C",
    client_id: event?.client_id ? String(event.client_id) : "",
    client_name: event?.client_name || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);

    const selectedClient = clients.find(c => String(c.id) === form.client_id);
    const payload = {
      title: form.title,
      description: form.description || null,
      start_time: new Date(form.start_date).toISOString(),
      end_time: form.end_date ? new Date(form.end_date).toISOString() : null,
      event_type: form.type,
      all_day: form.all_day,
      location: form.location || null,
      color: form.color,
      client_id: form.client_id ? parseInt(form.client_id) : null,
      client_name: selectedClient?.name || form.client_name || null,
    };

    try {
      const url = event ? `/api/calendar/${event.id}` : "/api/calendar";
      const method = event ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        showToast("success", event ? "Event aktualisiert" : "Event erstellt");
        onSaved();
      } else {
        const errData = await res.json().catch(() => null);
        console.error("API Error:", res.status, errData);
        showToast("error", errData?.error?.message || `Fehler ${res.status}: Event konnte nicht gespeichert werden`);
      }
    } catch (err) {
      console.error("Failed to save event:", err);
      showToast("error", "Verbindungsfehler — bitte prüfe deine Internetverbindung");
    }
    setSaving(false);
  };

  const TITLE_CHIPS = ["Erstgespräch", "Design-Review", "Go-Live", "Follow-Up", "Monatsmeeting", "Kundentermin"];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#141418] border border-white/[0.08] rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h3 className="text-lg font-semibold text-white">{event ? "Event bearbeiten" : "Neues Event"}</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/[0.05] rounded-lg"><XMarkIcon className="w-5 h-5 text-white/40" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title + Chips */}
          <div>
            <label className="block text-xs text-white/40 mb-1">Titel *</label>
            <div className="flex flex-wrap gap-1 mb-1.5">
              {TITLE_CHIPS.map(t => (
                <button key={t} type="button" onClick={() => setForm({ ...form, title: t })}
                  className="px-2 py-0.5 bg-white/[0.04] hover:bg-[#FC682C]/10 border border-white/[0.06] hover:border-[#FC682C]/30 rounded text-[9px] text-white/40 hover:text-[#FC682C] transition-all">
                  {t}
                </button>
              ))}
            </div>
            <input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="z.B. Kick-off Meeting mit Musterfirma GmbH"
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white/90 placeholder-white/20 focus:border-[#FC682C]/50 focus:outline-none" />
          </div>

          {/* Date/Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-white/40 mb-1">Start *</label>
              <input type="datetime-local" required value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white/80 focus:border-[#FC682C]/50 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Ende</label>
              <input type="datetime-local" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white/80 focus:border-[#FC682C]/50 focus:outline-none" />
            </div>
          </div>

          {/* All Day Toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.all_day} onChange={e => setForm({ ...form, all_day: e.target.checked })}
              className="w-4 h-4 rounded border-white/20 bg-white/[0.04] text-[#FC682C] focus:ring-[#FC682C]/50" />
            <span className="text-xs text-white/50">Ganztägig</span>
          </label>

          {/* Type + Client */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-white/40 mb-1">Typ</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value } as any)}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white/80 focus:border-[#FC682C]/50 focus:outline-none">
                {Object.entries(EVENT_TYPES).map(([k, v]) => (
                  <option key={k} value={k} className="bg-[#1a1a1f]">{v.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Kunde</label>
              <select value={form.client_id} onChange={e => setForm({ ...form, client_id: e.target.value } as any)}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white/80 focus:border-[#FC682C]/50 focus:outline-none">
                <option value="" className="bg-[#1a1a1f]">Kein Kunde</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id} className="bg-[#1a1a1f]">{c.name}{c.company ? ` (${c.company})` : ""}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs text-white/40 mb-1">Ort</label>
            <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
              placeholder="z.B. Zoom, Büro, Google Meet Link..."
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white/90 placeholder-white/20 focus:border-[#FC682C]/50 focus:outline-none" />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs text-white/40 mb-1">Beschreibung</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2}
              placeholder="z.B. Agenda, Teilnehmer, Vorbereitungen..."
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white/90 placeholder-white/20 focus:border-[#FC682C]/50 focus:outline-none resize-none" />
          </div>

          {/* Color */}
          <div>
            <label className="block text-xs text-white/40 mb-1">Farbe</label>
            <div className="flex gap-2">
              {COLOR_OPTIONS.map(c => (
                <button key={c.value} type="button" onClick={() => setForm({ ...form, color: c.value })}
                  className={`w-8 h-8 rounded-lg border-2 transition-all ${form.color === c.value ? "border-white scale-110" : "border-transparent opacity-60 hover:opacity-100"}`}
                  style={{ backgroundColor: c.value }} />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 bg-white/[0.06] hover:bg-white/[0.1] text-white rounded-xl text-sm transition-colors">
              Abbrechen
            </button>
            <button type="submit" disabled={saving || !form.title.trim()}
              className="flex-1 py-2.5 bg-[#FC682C] hover:bg-[#e55d27] text-white rounded-xl text-sm font-medium disabled:opacity-40 transition-colors">
              {saving ? "Speichert..." : event ? "Speichern" : "Erstellen"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
