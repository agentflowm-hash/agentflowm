"use client";

import { useState, useEffect, useCallback } from "react";
import {
  PlusIcon,
  XMarkIcon,
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  TrashIcon,
  PencilSquareIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { useToast } from "@/components";

// ═══════════════════════════════════════════════════════════════
//                         TYPES
// ═══════════════════════════════════════════════════════════════

interface Task {
  id: number;
  title: string;
  description?: string;
  assignee?: string;
  due_date?: string;
  status: "open" | "in_progress" | "done" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  linked_entity?: string;
  linked_id?: number;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

type ViewMode = "kanban" | "list";

const STATUS_CONFIG = {
  open: { label: "Offen", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  in_progress: { label: "In Arbeit", color: "bg-[#FC682C]/20 text-[#FC682C] border-[#FC682C]/30" },
  done: { label: "Erledigt", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  cancelled: { label: "Abgebrochen", color: "bg-neutral-500/20 text-neutral-400 border-neutral-500/30" },
};

const PRIORITY_CONFIG = {
  urgent: { label: "Dringend", color: "bg-red-500/20 text-red-400 border-red-500/30", dot: "bg-red-500" },
  high: { label: "Hoch", color: "bg-[#FC682C]/20 text-[#FC682C] border-[#FC682C]/30", dot: "bg-[#FC682C]" },
  medium: { label: "Mittel", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", dot: "bg-yellow-500" },
  low: { label: "Niedrig", color: "bg-neutral-500/20 text-neutral-400 border-neutral-500/30", dot: "bg-neutral-500" },
};

const KANBAN_COLUMNS: { key: Task["status"]; label: string }[] = [
  { key: "open", label: "Offen" },
  { key: "in_progress", label: "In Arbeit" },
  { key: "done", label: "Erledigt" },
];

// ═══════════════════════════════════════════════════════════════
//                      MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function TasksTab() {
  const { showToast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>("kanban");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterAssignee, setFilterAssignee] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null);

  // ─── Fetch ─────────────────────────────────────────────────

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tasks", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        const d = data.data || data;
        setTasks(d.tasks || []);
      }
    } catch {
      showToast("error", "Aufgaben konnten nicht geladen werden");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // ─── Actions ───────────────────────────────────────────────

  const updateTaskStatus = async (taskId: number, newStatus: Task["status"]) => {
    const oldTasks = [...tasks];
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus, updated_at: new Date().toISOString() } : t))
    );
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        setTasks(oldTasks); // Rollback
        showToast("error", "Status konnte nicht geaendert werden");
      }
    } catch {
      setTasks(oldTasks); // Rollback
      showToast("error", "Verbindungsfehler");
    }
  };

  const deleteTask = async (taskId: number) => {
    if (!confirm("Aufgabe wirklich loeschen?")) return;
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
        showToast("success", "Aufgabe geloescht");
      } else {
        showToast("error", "Loeschen fehlgeschlagen");
      }
    } catch {
      showToast("error", "Verbindungsfehler");
    }
  };

  // ─── Computed ──────────────────────────────────────────────

  const filteredTasks = tasks.filter((t) => {
    if (filterStatus !== "all" && t.status !== filterStatus) return false;
    if (filterPriority !== "all" && t.priority !== filterPriority) return false;
    if (filterAssignee !== "all" && t.assignee !== filterAssignee) return false;
    return true;
  });

  const uniqueAssignees = Array.from(new Set(tasks.map((t) => t.assignee).filter(Boolean))) as string[];

  const stats = {
    open: tasks.filter((t) => t.status === "open").length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    done: tasks.filter((t) => t.status === "done").length,
    overdue: tasks.filter(
      (t) => t.due_date && new Date(t.due_date) < new Date() && t.status !== "done" && t.status !== "cancelled"
    ).length,
  };

  const isOverdue = (task: Task) =>
    task.due_date && new Date(task.due_date) < new Date() && task.status !== "done" && task.status !== "cancelled";

  // ─── Drag & Drop ──────────────────────────────────────────

  const handleDragStart = (taskId: number) => {
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: Task["status"]) => {
    e.preventDefault();
    if (draggedTaskId !== null) {
      updateTaskStatus(draggedTaskId, targetStatus);
      setDraggedTaskId(null);
    }
  };

  // ─── Render ────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#FC682C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Stats ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Offen" value={stats.open} icon={<ClockIcon className="w-5 h-5" />} color="text-blue-400" bg="bg-blue-500/10" />
        <StatCard label="In Arbeit" value={stats.in_progress} icon={<Squares2X2Icon className="w-5 h-5" />} color="text-[#FC682C]" bg="bg-[#FC682C]/10" />
        <StatCard label="Erledigt" value={stats.done} icon={<CheckCircleIcon className="w-5 h-5" />} color="text-emerald-400" bg="bg-emerald-500/10" />
        <StatCard label="Überfällig" value={stats.overdue} icon={<ExclamationTriangleIcon className="w-5 h-5" />} color="text-red-400" bg="bg-red-500/10" />
      </div>

      {/* ── Toolbar ───────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView("kanban")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              view === "kanban"
                ? "bg-[#FC682C]/20 text-[#FC682C] border border-[#FC682C]/30"
                : "bg-white/[0.02] text-white/60 border border-white/[0.06] hover:bg-white/[0.05]"
            }`}
          >
            <Squares2X2Icon className="w-4 h-4 inline mr-1.5 -mt-0.5" />
            Kanban
          </button>
          <button
            onClick={() => setView("list")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              view === "list"
                ? "bg-[#FC682C]/20 text-[#FC682C] border border-[#FC682C]/30"
                : "bg-white/[0.02] text-white/60 border border-white/[0.06] hover:bg-white/[0.05]"
            }`}
          >
            <ListBulletIcon className="w-4 h-4 inline mr-1.5 -mt-0.5" />
            Liste
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              showFilters
                ? "bg-[#FC682C]/20 text-[#FC682C] border border-[#FC682C]/30"
                : "bg-white/[0.02] text-white/60 border border-white/[0.06] hover:bg-white/[0.05]"
            }`}
          >
            <FunnelIcon className="w-4 h-4 inline mr-1.5 -mt-0.5" />
            Filter
          </button>
        </div>
        <button
          onClick={() => { setEditingTask(null); setShowCreateModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-[#FC682C] hover:bg-[#e55d27] text-white rounded-lg text-sm font-medium transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Neue Aufgabe
        </button>
      </div>

      {/* ── Filters ───────────────────────────────────────── */}
      {showFilters && (
        <div className="flex flex-wrap gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <FilterSelect
            label="Status"
            value={filterStatus}
            onChange={setFilterStatus}
            options={[
              { value: "all", label: "Alle" },
              ...Object.entries(STATUS_CONFIG).map(([k, v]) => ({ value: k, label: v.label })),
            ]}
          />
          <FilterSelect
            label="Priorität"
            value={filterPriority}
            onChange={setFilterPriority}
            options={[
              { value: "all", label: "Alle" },
              ...Object.entries(PRIORITY_CONFIG).map(([k, v]) => ({ value: k, label: v.label })),
            ]}
          />
          <FilterSelect
            label="Zugewiesen an"
            value={filterAssignee}
            onChange={setFilterAssignee}
            options={[
              { value: "all", label: "Alle" },
              ...uniqueAssignees.map((a) => ({ value: a, label: a })),
            ]}
          />
          {(filterStatus !== "all" || filterPriority !== "all" || filterAssignee !== "all") && (
            <button
              onClick={() => { setFilterStatus("all"); setFilterPriority("all"); setFilterAssignee("all"); }}
              className="px-3 py-1.5 text-xs text-white/40 hover:text-white/60 transition-colors"
            >
              Filter zurücksetzen
            </button>
          )}
        </div>
      )}

      {/* ── Kanban View ───────────────────────────────────── */}
      {view === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {KANBAN_COLUMNS.map((col) => {
            const columnTasks = filteredTasks.filter((t) => t.status === col.key);
            return (
              <div
                key={col.key}
                className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4 min-h-[300px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.key)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold border ${STATUS_CONFIG[col.key].color}`}>
                      {col.label}
                    </span>
                    <span className="text-xs text-white/30">{columnTasks.length}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {columnTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      isOverdue={!!isOverdue(task)}
                      onEdit={() => { setEditingTask(task); setShowCreateModal(true); }}
                      onDelete={() => deleteTask(task.id)}
                      onStatusChange={(s) => updateTaskStatus(task.id, s)}
                      onDragStart={() => handleDragStart(task.id)}
                    />
                  ))}
                  {columnTasks.length === 0 && (
                    <p className="text-center text-white/20 text-sm py-8">Keine Aufgaben</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── List View ─────────────────────────────────────── */}
      {view === "list" && (
        <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-4 py-3 text-white/40 font-medium">Titel</th>
                <th className="text-left px-4 py-3 text-white/40 font-medium hidden md:table-cell">Priorität</th>
                <th className="text-left px-4 py-3 text-white/40 font-medium hidden md:table-cell">Status</th>
                <th className="text-left px-4 py-3 text-white/40 font-medium hidden lg:table-cell">Zugewiesen</th>
                <th className="text-left px-4 py-3 text-white/40 font-medium hidden lg:table-cell">Fällig</th>
                <th className="text-right px-4 py-3 text-white/40 font-medium">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr
                  key={task.id}
                  className={`border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors ${
                    isOverdue(task) ? "bg-red-500/[0.03]" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-white/90">{task.title}</div>
                    {task.description && (
                      <div className="text-xs text-white/40 mt-0.5 line-clamp-1">{task.description}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <PriorityBadge priority={task.priority} />
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <StatusDropdown status={task.status} onChange={(s) => updateTaskStatus(task.id, s)} />
                  </td>
                  <td className="px-4 py-3 text-white/50 hidden lg:table-cell">{task.assignee || "—"}</td>
                  <td className={`px-4 py-3 hidden lg:table-cell ${isOverdue(task) ? "text-red-400 font-medium" : "text-white/50"}`}>
                    {task.due_date ? formatDate(task.due_date) : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => { setEditingTask(task); setShowCreateModal(true); }}
                        className="p-1.5 rounded-md hover:bg-white/[0.05] text-white/40 hover:text-white/70 transition-colors"
                      >
                        <PencilSquareIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1.5 rounded-md hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTasks.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-white/20 py-12">
                    Keine Aufgaben gefunden
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Create/Edit Modal ─────────────────────────────── */}
      {showCreateModal && (
        <TaskModal
          task={editingTask}
          onClose={() => { setShowCreateModal(false); setEditingTask(null); }}
          onSaved={() => { setShowCreateModal(false); setEditingTask(null); fetchTasks(); }}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                     SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════

function StatCard({ label, value, icon, color, bg }: { label: string; value: number; icon: React.ReactNode; color: string; bg: string }) {
  return (
    <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-white/40 font-medium">{label}</span>
        <div className={`p-1.5 rounded-lg ${bg} ${color}`}>{icon}</div>
      </div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
    </div>
  );
}

function TaskCard({
  task,
  isOverdue,
  onEdit,
  onDelete,
  onStatusChange,
  onDragStart,
}: {
  task: Task;
  isOverdue: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (s: Task["status"]) => void;
  onDragStart: () => void;
}) {
  const nextStatus: Record<string, Task["status"]> = {
    open: "in_progress",
    in_progress: "done",
    done: "open",
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className={`rounded-lg bg-white/[0.03] border p-3 cursor-grab active:cursor-grabbing hover:bg-white/[0.05] transition-colors ${
        isOverdue ? "border-red-500/40 bg-red-500/[0.03]" : "border-white/[0.06]"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-sm font-medium text-white/90 leading-snug">{task.title}</h4>
        <PriorityBadge priority={task.priority} />
      </div>
      {task.description && (
        <p className="text-xs text-white/40 mb-2 line-clamp-2">{task.description}</p>
      )}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          {task.assignee && (
            <span className="text-xs text-white/30 bg-white/[0.04] px-2 py-0.5 rounded">{task.assignee}</span>
          )}
          {task.due_date && (
            <span className={`text-xs px-2 py-0.5 rounded ${isOverdue ? "text-red-400 bg-red-500/10" : "text-white/30 bg-white/[0.04]"}`}>
              {formatDate(task.due_date)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-0.5">
          <button
            onClick={onEdit}
            className="p-1 rounded hover:bg-white/[0.05] text-white/30 hover:text-white/60 transition-colors"
            title="Bearbeiten"
          >
            <PencilSquareIcon className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onStatusChange(nextStatus[task.status] || "open")}
            className="p-1 rounded hover:bg-[#FC682C]/10 text-white/30 hover:text-[#FC682C] transition-colors"
            title="Status ändern"
          >
            <CheckCircleIcon className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 rounded hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-colors"
            title="Löschen"
          >
            <TrashIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: Task["priority"] }) {
  const config = PRIORITY_CONFIG[priority];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${config.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

function StatusDropdown({ status, onChange }: { status: Task["status"]; onChange: (s: Task["status"]) => void }) {
  const [open, setOpen] = useState(false);
  const config = STATUS_CONFIG[status];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${config.color}`}
      >
        {config.label}
        <ChevronDownIcon className="w-3 h-3" />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-36 rounded-lg bg-[#1a1a1f] border border-white/[0.08] shadow-xl overflow-hidden">
          {Object.entries(STATUS_CONFIG).map(([key, val]) => (
            <button
              key={key}
              onClick={() => { onChange(key as Task["status"]); setOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs text-white/70 hover:bg-white/[0.05] transition-colors"
            >
              {val.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs text-white/40">{label}:</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white/[0.03] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-white/80 focus:border-[#FC682C]/50 focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-[#1a1a1f]">
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function TaskModal({
  task,
  onClose,
  onSaved,
}: {
  task: Task | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    title: task?.title || "",
    description: task?.description || "",
    priority: task?.priority || "medium",
    status: task?.status || "open",
    due_date: task?.due_date || "",
    assignee: task?.assignee || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);

    try {
      const url = task ? `/api/tasks/${task.id}` : "/api/tasks";
      const method = task ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim() || null,
          priority: form.priority,
          status: form.status,
          due_date: form.due_date || null,
          assignee: form.assignee.trim() || null,
        }),
      });

      if (res.ok) {
        onSaved();
      }
    } catch (err) {
      console.error("Failed to save task:", err);
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg mx-4 rounded-2xl bg-[#141418] border border-white/[0.08] shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h3 className="text-lg font-semibold text-white/90">
            {task ? "Aufgabe bearbeiten" : "Neue Aufgabe"}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/[0.05] text-white/40 hover:text-white/70 transition-colors">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs text-white/40 mb-1">Titel *</label>
            <div className="flex flex-wrap gap-1 mb-1.5">
              {["Follow-Up Kunde", "Design-Review", "Content erstellen", "SEO-Check", "Bug fixen", "Meeting vorbereiten", "Rechnung senden", "Onboarding"].map(t => (
                <button key={t} type="button" onClick={() => setForm({ ...form, title: t })}
                  className="px-2 py-0.5 bg-white/[0.04] hover:bg-[#FC682C]/10 border border-white/[0.06] hover:border-[#FC682C]/30 rounded text-[9px] text-white/40 hover:text-[#FC682C] transition-all">
                  {t}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white/90 placeholder-white/20 focus:border-[#FC682C]/50 focus:outline-none"
              placeholder="z.B. Follow-Up mit Musterfirma GmbH — Angebot nachfassen"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Beschreibung</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white/90 placeholder-white/20 focus:border-[#FC682C]/50 focus:outline-none resize-none"
              placeholder="z.B. Kunde hat Angebot erhalten, nach 3 Tagen nochmal anrufen. Entscheider ist Herr Müller (CEO)."
            />
          </div>

          {/* Priority + Status Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Priorität</label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value as any })}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white/80 focus:border-[#FC682C]/50 focus:outline-none"
              >
                {Object.entries(PRIORITY_CONFIG).map(([k, v]) => (
                  <option key={k} value={k} className="bg-[#1a1a1f]">{v.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white/80 focus:border-[#FC682C]/50 focus:outline-none"
              >
                {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                  <option key={k} value={k} className="bg-[#1a1a1f]">{v.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Due Date + Assignee Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Fällig am</label>
              <input
                type="date"
                value={form.due_date}
                onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white/80 focus:border-[#FC682C]/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Zuweisen an</label>
              <input
                type="text"
                value={form.assignee}
                onChange={(e) => setForm({ ...form, assignee: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white/80 placeholder-white/20 focus:border-[#FC682C]/50 focus:outline-none"
                placeholder="z.B. Mo, Team, Freelancer..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm text-white/50 hover:text-white/70 hover:bg-white/[0.03] transition-colors"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={saving || !form.title.trim()}
              className="px-5 py-2 rounded-lg text-sm font-medium bg-[#FC682C] hover:bg-[#e55d27] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? "Speichert..." : task ? "Speichern" : "Erstellen"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                        HELPERS
// ═══════════════════════════════════════════════════════════════

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
}
