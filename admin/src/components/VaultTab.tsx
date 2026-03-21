"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  LockClosedIcon, PlusIcon, MagnifyingGlassIcon, XMarkIcon,
  EyeIcon, EyeSlashIcon, ClipboardDocumentIcon, StarIcon,
  GlobeAltIcon, KeyIcon, LinkIcon, ServerStackIcon,
  CreditCardIcon, DocumentTextIcon, FolderIcon, TrashIcon,
  PencilIcon, CheckIcon, HashtagIcon, UserIcon, CameraIcon,
  ArrowPathIcon, ShieldCheckIcon, ExclamationTriangleIcon,
  CodeBracketIcon, ClipboardDocumentListIcon, ChevronRightIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { useToast } from "@/components";

interface VaultEntry {
  id: number;
  folder_id: number | null;
  client_id: number | null;
  client_name: string | null;
  title: string;
  category: string;
  url: string | null;
  username: string | null;
  password: string | null;
  notes: string | null;
  tags: string[];
  is_favorite: boolean;
  snippet_code: string | null;
  snippet_language: string | null;
  created_at: string;
  updated_at: string;
}

interface VaultFolder {
  id: number;
  name: string;
  icon: string;
  color: string;
  parent_id: number | null;
}

function unwrapApi<T>(res: unknown): T {
  if (res && typeof res === 'object' && 'success' in res && 'data' in res) return (res as { data: T }).data;
  return res as T;
}

// ═══ Password Strength ═══
function getPasswordStrength(pw: string): { score: number; label: string; color: string; barColor: string } {
  if (!pw) return { score: 0, label: "Kein Passwort", color: "text-white/30", barColor: "bg-white/10" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (pw.length >= 16) score++;
  const s = Math.min(score, 4);
  const map = [
    { label: "Sehr schwach", color: "text-red-400", barColor: "bg-red-500" },
    { label: "Schwach", color: "text-orange-400", barColor: "bg-orange-500" },
    { label: "Mittel", color: "text-yellow-400", barColor: "bg-yellow-500" },
    { label: "Stark", color: "text-green-400", barColor: "bg-green-500" },
    { label: "Sehr stark", color: "text-emerald-400", barColor: "bg-emerald-500" },
  ];
  return { score: s, ...map[s] };
}

// ═══ Password Generator ═══
function generatePassword(length: number = 16, opts = { upper: true, lower: true, numbers: true, symbols: true }): string {
  let chars = '';
  if (opts.lower) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (opts.upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (opts.numbers) chars += '0123456789';
  if (opts.symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let pw = '';
  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  for (let i = 0; i < length; i++) pw += chars[arr[i] % chars.length];
  return pw;
}

// ═══ Time helpers ═══
function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Heute";
  if (days === 1) return "Gestern";
  if (days < 30) return `Vor ${days} Tagen`;
  if (days < 365) return `Vor ${Math.floor(days / 30)} Mon.`;
  return `Vor ${Math.floor(days / 365)} J.`;
}

function daysOld(date: string): number {
  return Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
}

const CATEGORIES = [
  { key: "login", label: "Zugangsdaten", icon: KeyIcon, color: "text-blue-400", bg: "bg-blue-500/15" },
  { key: "api_key", label: "API Key", icon: HashtagIcon, color: "text-purple-400", bg: "bg-purple-500/15" },
  { key: "link", label: "Link", icon: LinkIcon, color: "text-green-400", bg: "bg-green-500/15" },
  { key: "server", label: "Server", icon: ServerStackIcon, color: "text-cyan-400", bg: "bg-cyan-500/15" },
  { key: "payment", label: "Zahlung", icon: CreditCardIcon, color: "text-yellow-400", bg: "bg-yellow-500/15" },
  { key: "snippet", label: "Code/Prompt", icon: CodeBracketIcon, color: "text-pink-400", bg: "bg-pink-500/15" },
  { key: "note", label: "Notiz", icon: DocumentTextIcon, color: "text-white/60", bg: "bg-white/10" },
  { key: "other", label: "Sonstiges", icon: LockClosedIcon, color: "text-[#FC682C]", bg: "bg-[#FC682C]/15" },
];

const SNIPPET_LANGS = ["text", "javascript", "typescript", "python", "bash", "sql", "json", "yaml", "html", "css", "env", "prompt"];

const getCat = (cat: string) => CATEGORIES.find(c => c.key === cat) || CATEGORIES[7];

export default function VaultTab() {
  const { showToast } = useToast();
  const [entries, setEntries] = useState<VaultEntry[]>([]);
  const [folders, setFolders] = useState<VaultFolder[]>([]);
  const [clients, setClients] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedFolder, setSelectedFolder] = useState<number | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [detailEntry, setDetailEntry] = useState<VaultEntry | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showAddFolder, setShowAddFolder] = useState(false);
  const [saving, setSaving] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<Set<number>>(new Set());
  const [editMode, setEditMode] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [clientMode, setClientMode] = useState<"select" | "custom">("select");
  const [customClient, setCustomClient] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [genLength, setGenLength] = useState(16);
  const [genOpts, setGenOpts] = useState({ upper: true, lower: true, numbers: true, symbols: true });

  const [form, setForm] = useState({
    title: "", category: "login", url: "", username: "", password: "",
    notes: "", client_id: "", folder_id: "", tags: "", is_favorite: false,
    snippet_code: "", snippet_language: "text",
  });
  const [newFolder, setNewFolder] = useState({ name: "", color: "#FC682C" });

  const loadData = useCallback(() => {
    setLoading(true);
    const p = new URLSearchParams();
    if (search) p.set('search', search);
    if (categoryFilter !== 'all') p.set('category', categoryFilter);
    if (selectedFolder) p.set('folder_id', String(selectedFolder));
    if (showFavorites) p.set('favorites', 'true');

    Promise.all([
      fetch(`/api/vault?${p}`, { credentials: "include" }).then(r => r.json()),
      fetch("/api/vault/folders", { credentials: "include" }).then(r => r.json()),
      fetch("/api/clients", { credentials: "include" }).then(r => r.json()).catch(() => ({ data: { clients: [] } })),
    ]).then(([vd, fd, cd]) => {
      setEntries(unwrapApi<{ entries: VaultEntry[] }>(vd).entries || []);
      setFolders(unwrapApi<{ folders: VaultFolder[] }>(fd).folders || []);
      setClients((unwrapApi<{ clients: any[] }>(cd).clients || []).map((c: any) => ({ id: c.id, name: c.name })));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [search, categoryFilter, selectedFolder, showFavorites]);

  useEffect(() => { loadData(); }, [loadData]);

  // ═══ Security Score ═══
  const securityScore = useMemo(() => {
    const withPw = entries.filter(e => e.password);
    if (withPw.length === 0) return { score: 100, weak: 0, reused: 0, old: 0 };
    const weak = withPw.filter(e => getPasswordStrength(e.password!).score <= 1).length;
    const pwMap = new Map<string, number>();
    withPw.forEach(e => pwMap.set(e.password!, (pwMap.get(e.password!) || 0) + 1));
    const reused = Array.from(pwMap.values()).filter(v => v > 1).reduce((s, v) => s + v, 0);
    const old = withPw.filter(e => daysOld(e.updated_at) > 90).length;
    const total = withPw.length;
    const score = Math.max(0, Math.round(100 - (weak / total) * 40 - (reused / total) * 35 - (old / total) * 25));
    return { score, weak, reused, old };
  }, [entries]);

  const scoreColor = securityScore.score >= 80 ? "text-green-400" : securityScore.score >= 50 ? "text-yellow-400" : "text-red-400";
  const scoreBg = securityScore.score >= 80 ? "from-green-500/15" : securityScore.score >= 50 ? "from-yellow-500/15" : "from-red-500/15";

  // ═══ Handlers ═══
  const handleAdd = async () => {
    if (!form.title) return;
    setSaving(true);
    try {
      // Build tags — add custom client as tag if specified
      const tags = form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [];
      let notes = form.notes || "";
      if (clientMode === "custom" && customClient) {
        tags.unshift(customClient);
        notes = notes ? `Kunde: ${customClient}\n${notes}` : `Kunde: ${customClient}`;
      }

      const res = await fetch("/api/vault", {
        credentials: "include", method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          client_id: form.client_id ? parseInt(form.client_id) : null,
          folder_id: form.folder_id ? parseInt(form.folder_id) : null,
          tags,
          notes: notes || null,
          snippet_code: form.snippet_code || null,
          snippet_language: form.snippet_language || 'text',
        }),
      });
      if (res.ok) {
        showToast("success", "Eintrag gespeichert!");
        setForm({ title: "", category: "login", url: "", username: "", password: "", notes: "", client_id: "", folder_id: "", tags: "", is_favorite: false, snippet_code: "", snippet_language: "text" });
        setCustomClient(""); setClientMode("select");
        setShowAdd(false);
        loadData();
      }
    } catch { showToast("error", "Fehler"); }
    finally { setSaving(false); }
  };

  const handleUpdate = async () => {
    if (!detailEntry) return;
    setSaving(true);
    try {
      const tags = form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [];
      let notes = form.notes || "";
      if (clientMode === "custom" && customClient) {
        if (!tags.includes(customClient)) tags.unshift(customClient);
        if (!notes.includes(`Kunde: ${customClient}`)) notes = notes ? `Kunde: ${customClient}\n${notes}` : `Kunde: ${customClient}`;
      }

      await fetch(`/api/vault/${detailEntry.id}`, {
        credentials: "include", method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title, category: form.category, url: form.url || null,
          username: form.username || null, password: form.password || null,
          notes: notes || null, is_favorite: form.is_favorite,
          client_id: form.client_id ? parseInt(form.client_id) : null,
          folder_id: form.folder_id ? parseInt(form.folder_id) : null,
          tags,
          snippet_code: form.snippet_code || null,
          snippet_language: form.snippet_language || 'text',
        }),
      });
      showToast("success", "Gespeichert!");
      setEditMode(false); setDetailEntry(null); setCustomClient(""); setClientMode("select");
      loadData();
    } catch { showToast("error", "Fehler"); }
    finally { setSaving(false); }
  };

  const handleAddFolder = async () => {
    if (!newFolder.name) return;
    setSaving(true);
    await fetch("/api/vault/folders", { credentials: "include", method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newFolder) });
    showToast("success", "Ordner erstellt!");
    setNewFolder({ name: "", color: "#FC682C" }); setShowAddFolder(false); setSaving(false); loadData();
  };

  const renameFolder = async (folderId: number, newName: string) => {
    if (!newName.trim()) return;
    try {
      await fetch(`/api/vault/folders`, { credentials: "include", method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: folderId, name: newName.trim() }) });
      showToast("success", "Ordner umbenannt");
      loadData();
    } catch { showToast("error", "Fehler beim Umbenennen"); }
  };

  const toggleFav = async (e: VaultEntry) => {
    await fetch(`/api/vault/${e.id}`, { credentials: "include", method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ is_favorite: !e.is_favorite }) });
    loadData();
  };

  const delEntry = async (id: number) => {
    if (!confirm("Eintrag wirklich loeschen? Dies kann nicht rueckgaengig gemacht werden.")) return;
    await fetch(`/api/vault/${id}`, { credentials: "include", method: "DELETE" });
    showToast("success", "Geloescht"); setDetailEntry(null); loadData();
  };

  const copy = (text: string, label: string) => { navigator.clipboard.writeText(text); showToast("success", `${label} kopiert!`); };

  const copyAll = (e: VaultEntry) => {
    const parts = [];
    if (e.url) parts.push(`URL: ${e.url}`);
    if (e.username) parts.push(`User: ${e.username}`);
    if (e.password) parts.push(`Pass: ${e.password}`);
    if (e.notes) parts.push(`Notiz: ${e.notes}`);
    if (e.snippet_code) parts.push(`Code:\n${e.snippet_code}`);
    navigator.clipboard.writeText(parts.join("\n"));
    showToast("success", "Alle Felder kopiert!");
  };

  const openDetail = (entry: VaultEntry) => {
    setDetailEntry(entry);
    setEditMode(false);
    setForm({
      title: entry.title, category: entry.category, url: entry.url || "", username: entry.username || "",
      password: entry.password || "", notes: entry.notes || "", client_id: entry.client_id ? String(entry.client_id) : "",
      folder_id: entry.folder_id ? String(entry.folder_id) : "", tags: entry.tags?.join(", ") || "",
      is_favorite: entry.is_favorite, snippet_code: entry.snippet_code || "", snippet_language: entry.snippet_language || "text",
    });
  };

  const fillGeneratedPassword = () => {
    const pw = generatePassword(genLength, genOpts);
    setForm({ ...form, password: pw });
    setShowGenerator(false);
  };

  const handlePhotoScan = async (file: File) => {
    setScanning(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        const res = await fetch("/api/vault/scan", {
          credentials: "include", method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64 }),
        });
        const data = await res.json();
        if (data.success && data.credentials?.length > 0) {
          const cred = data.credentials[0];
          setForm({
            title: cred.title || "",
            category: cred.category || "login",
            url: cred.url || "",
            username: cred.username || "",
            password: cred.password || "",
            notes: cred.notes || "",
            snippet_code: cred.snippet_code || "",
            snippet_language: cred.snippet_language || "text",
            client_id: form.client_id,
            folder_id: form.folder_id,
            tags: form.tags,
            is_favorite: form.is_favorite,
          });
          showToast("success", `${data.count} Zugang${data.count > 1 ? 'sdaten' : ''} erkannt!`);
          if (data.count > 1) {
            showToast("info", `${data.count - 1} weitere Einträge in den Notizen`);
            const extra = data.credentials.slice(1).map((c: any) =>
              [c.title, c.url, c.username, c.password].filter(Boolean).join(" | ")
            ).join("\n");
            setForm(prev => ({ ...prev, notes: (prev.notes ? prev.notes + "\n\n" : "") + "Weitere erkannte Zugänge:\n" + extra }));
          }
        } else {
          showToast("error", data.error || "Keine Zugangsdaten im Bild erkannt");
        }
        setScanning(false);
      };
      reader.readAsDataURL(file);
    } catch {
      showToast("error", "Fehler beim Scannen");
      setScanning(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-3 border-[#FC682C]/30 border-t-[#FC682C] rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-5">
      {/* ═══ Stats + Security Score ═══ */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        <div className={`p-4 rounded-2xl bg-gradient-to-br ${scoreBg} to-transparent border border-white/[0.06] col-span-2 lg:col-span-2`}>
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"
                  strokeDasharray={`${securityScore.score * 1.76} 176`} className={scoreColor} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-lg font-bold ${scoreColor}`}>{securityScore.score}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Sicherheits-Score</p>
              <div className="flex gap-3 mt-1 text-[10px]">
                {securityScore.weak > 0 && <span className="text-red-400">{securityScore.weak} schwach</span>}
                {securityScore.reused > 0 && <span className="text-orange-400">{securityScore.reused} doppelt</span>}
                {securityScore.old > 0 && <span className="text-yellow-400">{securityScore.old} alt</span>}
                {securityScore.weak === 0 && securityScore.reused === 0 && securityScore.old === 0 && <span className="text-green-400">Alles sicher!</span>}
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/15 to-blue-600/5 border border-white/[0.06]">
          <div className="flex items-center gap-2 mb-1"><LockClosedIcon className="w-4 h-4 text-blue-400" /><span className="text-xs text-white/50">Gesamt</span></div>
          <p className="text-2xl font-bold text-white">{entries.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/15 to-purple-600/5 border border-white/[0.06]">
          <div className="flex items-center gap-2 mb-1"><KeyIcon className="w-4 h-4 text-purple-400" /><span className="text-xs text-white/50">Zugänge</span></div>
          <p className="text-2xl font-bold text-white">{entries.filter(e => e.category === 'login').length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-500/15 to-pink-600/5 border border-white/[0.06]">
          <div className="flex items-center gap-2 mb-1"><CodeBracketIcon className="w-4 h-4 text-pink-400" /><span className="text-xs text-white/50">Snippets</span></div>
          <p className="text-2xl font-bold text-white">{entries.filter(e => e.category === 'snippet').length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-500/15 to-yellow-600/5 border border-white/[0.06]">
          <div className="flex items-center gap-2 mb-1"><StarIcon className="w-4 h-4 text-yellow-400" /><span className="text-xs text-white/50">Favoriten</span></div>
          <p className="text-2xl font-bold text-white">{entries.filter(e => e.is_favorite).length}</p>
        </div>
      </div>

      {/* ═══ Toolbar ═══ */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
          <input type="text" placeholder="Suche in Datentresor... (Titel, URL, User, Notizen)" value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/[0.04] border border-white/[0.06] rounded-xl text-white placeholder:text-white/30 focus:border-[#FC682C]/50 outline-none" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setShowFavorites(!showFavorites)}
            className={`px-3 py-2 rounded-xl text-sm transition-all ${showFavorites ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" : "bg-white/[0.04] text-white/50 border border-white/[0.06]"}`}>
            {showFavorites ? <StarSolid className="w-4 h-4" /> : <StarIcon className="w-4 h-4" />}
          </button>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-white outline-none cursor-pointer">
            <option value="all">Alle Kategorien</option>
            {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
          </select>
          <button onClick={() => setShowAddFolder(true)} className="flex items-center gap-1.5 px-3 py-2 bg-white/[0.04] text-white/60 border border-white/[0.06] rounded-xl text-sm hover:bg-white/[0.08]">
            <FolderIcon className="w-4 h-4" /> Ordner
          </button>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-5 py-2 bg-[#FC682C] text-white rounded-xl text-sm font-medium hover:bg-[#FC682C]/90">
            <PlusIcon className="w-4 h-4" /> Neuer Eintrag
          </button>
        </div>
      </div>

      {/* ═══ Folder Tabs ═══ */}
      {folders.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button onClick={() => setSelectedFolder(null)} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${!selectedFolder ? "bg-[#FC682C] text-white" : "bg-white/[0.04] text-white/50 hover:bg-white/[0.08]"}`}>Alle</button>
          {folders.map(f => (
            <button key={f.id} onClick={() => setSelectedFolder(f.id === selectedFolder ? null : f.id)}
              onDoubleClick={() => {
                const newName = prompt("Ordner umbenennen:", f.name);
                if (newName && newName !== f.name) renameFolder(f.id, newName);
              }}
              title="Doppelklick zum Umbenennen"
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1.5 ${f.id === selectedFolder ? "bg-[#FC682C] text-white" : "bg-white/[0.04] text-white/50 hover:bg-white/[0.08]"}`}>
              <FolderIcon className="w-3.5 h-3.5" /> {f.name}
            </button>
          ))}
        </div>
      )}

      {/* ═══ Add Folder ═══ */}
      {showAddFolder && (
        <div className="p-4 rounded-2xl bg-[#FC682C]/10 border border-[#FC682C]/20 flex items-end gap-3">
          <div className="flex-1">
            <label className="block text-[10px] text-white/40 mb-1">Ordnername</label>
            <input type="text" value={newFolder.name} onChange={(e) => setNewFolder({ ...newFolder, name: e.target.value })}
              placeholder="z.B. Hosting, Kunden..." className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/30 outline-none" />
          </div>
          <button onClick={handleAddFolder} disabled={saving || !newFolder.name} className="px-4 py-2.5 bg-[#FC682C] text-white rounded-xl text-sm font-medium disabled:opacity-50">Erstellen</button>
          <button onClick={() => setShowAddFolder(false)} className="px-4 py-2.5 bg-white/[0.04] text-white/50 rounded-xl text-sm">Abbrechen</button>
        </div>
      )}

      {/* ═══ Add Entry Form ═══ */}
      {showAdd && (
        <div className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/15 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-blue-400 flex items-center gap-2"><LockClosedIcon className="w-4 h-4" /> Neuer Eintrag</h4>
            <div className="flex items-center gap-2">
              {/* Foto-Scan Button */}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => { if (e.target.files?.[0]) handlePhotoScan(e.target.files[0]); e.target.value = ''; }} />
              <button onClick={() => fileInputRef.current?.click()} disabled={scanning}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FC682C]/15 text-[#FC682C] border border-[#FC682C]/20 rounded-lg text-xs font-medium hover:bg-[#FC682C]/25 disabled:opacity-50 transition-colors">
                {scanning ? <div className="w-3.5 h-3.5 border-2 border-[#FC682C]/30 border-t-[#FC682C] rounded-full animate-spin" /> : <CameraIcon className="w-3.5 h-3.5" />}
                {scanning ? "Scannt..." : "Foto scannen"}
              </button>
              <button onClick={() => setShowAdd(false)} className="p-1.5 hover:bg-white/10 rounded-lg"><XMarkIcon className="w-4 h-4 text-white/40" /></button>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="lg:col-span-2">
              <label className="block text-[10px] text-white/40 mb-1">Titel *</label>
              <div className="flex flex-wrap gap-1 mb-1">
                {["WordPress Admin", "Hosting Panel", "E-Mail Konto", "Domain Registrar", "Social Media Login", "API Key", "FTP/SFTP Zugang", "Datenbank"].map(t => (
                  <button key={t} type="button" onClick={() => setForm({ ...form, title: form.title ? form.title + " — " + t : t })}
                    className="px-1.5 py-0.5 bg-white/[0.04] hover:bg-[#FC682C]/10 border border-white/[0.06] hover:border-[#FC682C]/30 rounded text-[8px] text-white/40 hover:text-[#FC682C] transition-all">
                    {t}
                  </button>
                ))}
              </div>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="z.B. WordPress Admin — musterfirma.de" className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/30 outline-none" />
            </div>
            <div>
              <label className="block text-[10px] text-white/40 mb-1">Kategorie</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white outline-none cursor-pointer">
                {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-white/40 mb-1">
                Kunde
                <button type="button" onClick={() => { setClientMode(clientMode === "select" ? "custom" : "select"); setCustomClient(""); setForm({ ...form, client_id: "" }); }}
                  className="ml-2 text-[#FC682C] hover:underline">{clientMode === "select" ? "Manuell" : "Auswählen"}</button>
              </label>
              {clientMode === "select" ? (
                <select value={form.client_id} onChange={(e) => setForm({ ...form, client_id: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white outline-none cursor-pointer">
                  <option value="">Kein Kunde</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              ) : (
                <input type="text" value={customClient} onChange={(e) => setCustomClient(e.target.value)}
                  placeholder="Kundenname eintippen..."
                  className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/30 outline-none" />
              )}
            </div>
            {form.category !== 'snippet' && (
              <>
                <div><label className="block text-[10px] text-white/40 mb-1">URL</label>
                  <input type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/30 outline-none" /></div>
                <div><label className="block text-[10px] text-white/40 mb-1">Benutzername</label>
                  <input type="text" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="admin@..." className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/30 outline-none" /></div>
                <div>
                  <label className="block text-[10px] text-white/40 mb-1">Passwort</label>
                  <div className="relative">
                    <input type="text" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" className="w-full px-3 py-2.5 pr-20 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/30 outline-none font-mono" />
                    <button onClick={() => setShowGenerator(!showGenerator)} className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2 py-1 bg-[#FC682C]/20 text-[#FC682C] rounded-lg text-[10px] font-medium hover:bg-[#FC682C]/30">
                      <BoltIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {form.password && (
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${getPasswordStrength(form.password).barColor}`}
                          style={{ width: `${(getPasswordStrength(form.password).score + 1) * 20}%` }} />
                      </div>
                      <span className={`text-[10px] ${getPasswordStrength(form.password).color}`}>{getPasswordStrength(form.password).label}</span>
                    </div>
                  )}
                </div>
                <div><label className="block text-[10px] text-white/40 mb-1">Ordner</label>
                  <select value={form.folder_id} onChange={(e) => setForm({ ...form, folder_id: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white outline-none cursor-pointer">
                    <option value="">Kein Ordner</option>
                    {folders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                  </select>
                </div>
              </>
            )}
            {form.category === 'snippet' && (
              <>
                <div><label className="block text-[10px] text-white/40 mb-1">Sprache</label>
                  <select value={form.snippet_language} onChange={(e) => setForm({ ...form, snippet_language: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white outline-none cursor-pointer">
                    {SNIPPET_LANGS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div className="lg:col-span-3"><label className="block text-[10px] text-white/40 mb-1">Code / Prompt</label>
                  <textarea value={form.snippet_code} onChange={(e) => setForm({ ...form, snippet_code: e.target.value })}
                    placeholder="Dein Code, Prompt oder Konfiguration..." rows={6}
                    className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/30 outline-none font-mono resize-none" />
                </div>
              </>
            )}
            <div className={form.category === 'snippet' ? "lg:col-span-4" : "lg:col-span-3"}>
              <label className="block text-[10px] text-white/40 mb-1">Notizen</label>
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="z.B. 2FA aktiviert, Recovery-Codes in Ordner X, Vertrag läuft bis 12/2026..." rows={2}
                className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/30 outline-none resize-none" />
            </div>
            {form.category !== 'snippet' && (
              <div><label className="block text-[10px] text-white/40 mb-1">Tags</label>
                <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="hosting, wichtig" className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/30 outline-none" /></div>
            )}
          </div>
          {/* Generator Popover */}
          {showGenerator && (
            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">Passwort-Generator</span>
                <button onClick={() => setShowGenerator(false)} className="text-white/30 hover:text-white"><XMarkIcon className="w-4 h-4" /></button>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-white/40 w-12">Länge: {genLength}</span>
                <input type="range" min={8} max={64} value={genLength} onChange={(e) => setGenLength(parseInt(e.target.value))}
                  className="flex-1 accent-[#FC682C]" />
              </div>
              <div className="flex gap-2">
                {[{ k: 'upper', l: 'ABC' }, { k: 'lower', l: 'abc' }, { k: 'numbers', l: '123' }, { k: 'symbols', l: '#$%' }].map(o => (
                  <button key={o.k} onClick={() => setGenOpts({ ...genOpts, [o.k]: !(genOpts as any)[o.k] })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono ${(genOpts as any)[o.k] ? 'bg-[#FC682C]/20 text-[#FC682C] border border-[#FC682C]/30' : 'bg-white/[0.04] text-white/30 border border-white/[0.06]'}`}>{o.l}</button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 bg-white/[0.03] rounded-lg text-sm text-white font-mono truncate">{generatePassword(genLength, genOpts)}</code>
                <button onClick={fillGeneratedPassword} className="px-4 py-2 bg-[#FC682C] text-white rounded-lg text-xs font-medium">Übernehmen</button>
              </div>
            </div>
          )}
          <button onClick={handleAdd} disabled={saving || !form.title || (form.category === 'snippet' && !form.snippet_code)}
            className="w-full py-2.5 bg-blue-500/20 text-blue-400 rounded-xl text-sm font-medium hover:bg-blue-500/30 disabled:opacity-50 flex items-center justify-center gap-2">
            {saving ? <div className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" /> : <LockClosedIcon className="w-4 h-4" />}
            {saving ? "Verschlüsselt..." : "Sicher speichern"}
          </button>
        </div>
      )}

      {/* ═══ Entries List — Grouped by Client ═══ */}
      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <LockClosedIcon className="w-16 h-16 text-white/10 mb-4" />
          <h3 className="text-lg font-medium text-white/50">Datentresor ist leer</h3>
          <p className="text-sm text-white/30">Erstelle deinen ersten sicheren Eintrag</p>
        </div>
      ) : (() => {
        // Group entries by client
        const groups: { name: string; entries: VaultEntry[] }[] = [];
        const clientMap = new Map<string, VaultEntry[]>();
        entries.forEach(e => {
          const key = e.client_name || "__none__";
          if (!clientMap.has(key)) clientMap.set(key, []);
          clientMap.get(key)!.push(e);
        });
        // Clients first, then "Ohne Kunde"
        clientMap.forEach((items, key) => {
          if (key !== "__none__") groups.push({ name: key, entries: items });
        });
        if (clientMap.has("__none__")) groups.push({ name: "Allgemein", entries: clientMap.get("__none__")! });

        return (
          <div className="space-y-6">
            {groups.map(group => (
              <div key={group.name}>
                {/* Group Header */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FC682C]/20 to-purple-500/10 flex items-center justify-center text-white font-bold text-sm">
                    {group.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{group.name}</h3>
                    <p className="text-[10px] text-white/30">{group.entries.length} {group.entries.length === 1 ? 'Eintrag' : 'Einträge'}</p>
                  </div>
                </div>
                {/* Entries */}
                <div className="space-y-1.5 ml-10">
                  {group.entries.map((entry) => {
                    const cat = getCat(entry.category);
                    const CatIcon = cat.icon;
                    const isVis = visiblePasswords.has(entry.id);
                    const age = daysOld(entry.updated_at);
                    const pwStr = entry.password ? getPasswordStrength(entry.password) : null;
                    return (
                      <div key={entry.id}
                        className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.15] hover:bg-white/[0.03] transition-all cursor-pointer group"
                        onClick={() => openDetail(entry)}>
                        <div className="flex items-center gap-3">
                          {/* Category Icon */}
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${cat.bg} ${cat.color}`}>
                            <CatIcon className="w-4.5 h-4.5" />
                          </div>

                          {/* Main Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              {entry.is_favorite && <StarSolid className="w-3 h-3 text-yellow-400 flex-shrink-0" />}
                              <span className="text-sm font-medium text-white">{entry.title}</span>
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${cat.bg} ${cat.color}`}>{getCat(entry.category).label}</span>
                              {pwStr && <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${pwStr.barColor}`} title={pwStr.label} />}
                              {age > 90 && entry.password && <ExclamationTriangleIcon className="w-3 h-3 text-yellow-400 flex-shrink-0" title={`${age} Tage alt`} />}
                            </div>
                            <div className="flex items-center gap-3 text-[11px] text-white/30">
                              {entry.url && <span className="truncate max-w-[200px]">{entry.url.replace(/https?:\/\//, '')}</span>}
                              {entry.username && <span className="flex items-center gap-1"><UserIcon className="w-3 h-3" />{entry.username}</span>}
                              {entry.category === 'snippet' && <span className="flex items-center gap-1"><CodeBracketIcon className="w-3 h-3" />{entry.snippet_language}</span>}
                              <span>{timeAgo(entry.updated_at)}</span>
                            </div>
                          </div>

                          {/* Quick Actions — always visible */}
                          <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                            {entry.password && (
                              <>
                                <button onClick={() => { const s = new Set(visiblePasswords); if (s.has(entry.id)) s.delete(entry.id); else s.add(entry.id); setVisiblePasswords(s); }}
                                  className={`px-2.5 py-1.5 rounded-lg text-[10px] font-medium flex items-center gap-1 transition-all ${isVis ? 'bg-green-500/15 text-green-400 border border-green-500/20' : 'bg-white/[0.04] text-white/40 border border-white/[0.06] hover:bg-white/[0.08]'}`}>
                                  {isVis ? <EyeSlashIcon className="w-3 h-3" /> : <EyeIcon className="w-3 h-3" />}
                                  {isVis ? 'Verbergen' : 'Anzeigen'}
                                </button>
                                <button onClick={() => copy(entry.password!, "Passwort")}
                                  className="p-1.5 hover:bg-white/10 rounded-lg text-white/30 hover:text-white transition-colors" title="Passwort kopieren">
                                  <ClipboardDocumentIcon className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                            {entry.snippet_code && (
                              <button onClick={() => copy(entry.snippet_code!, "Code")}
                                className="px-2.5 py-1.5 rounded-lg text-[10px] font-medium bg-white/[0.04] text-white/40 border border-white/[0.06] hover:bg-white/[0.08] flex items-center gap-1">
                                <CodeBracketIcon className="w-3 h-3" /> Kopieren
                              </button>
                            )}
                            <button onClick={() => copyAll(entry)}
                              className="p-1.5 hover:bg-white/10 rounded-lg text-white/30 hover:text-white transition-colors" title="Alles kopieren">
                              <ClipboardDocumentListIcon className="w-3.5 h-3.5" />
                            </button>
                            {entry.url && (
                              <a href={entry.url} target="_blank" rel="noopener noreferrer"
                                className="p-1.5 hover:bg-white/10 rounded-lg text-white/30 hover:text-white transition-colors" title="URL öffnen">
                                <GlobeAltIcon className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>

                          {/* Password/Code Display */}
                          {entry.password && (
                            <div className="flex-shrink-0 w-36 text-right">
                              <code className={`text-[11px] font-mono ${isVis ? 'text-green-400' : 'text-white/25'}`}>
                                {isVis ? entry.password : "••••••••••••"}
                              </code>
                            </div>
                          )}

                          <ChevronRightIcon className="w-4 h-4 text-white/15 flex-shrink-0" />
                        </div>

                        {/* Snippet Preview (collapsed) */}
                        {entry.snippet_code && isVis && (
                          <div className="mt-2 ml-12 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] max-h-24 overflow-hidden">
                            <pre className="text-[11px] font-mono text-white/50 whitespace-pre-wrap">{entry.snippet_code.slice(0, 200)}{entry.snippet_code.length > 200 ? '...' : ''}</pre>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        );
      })()}

      {/* ═══ Detail Slide-Over Panel ═══ */}
      {detailEntry && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm" onClick={() => { setDetailEntry(null); setEditMode(false); setCustomClient(""); setClientMode("select"); setShowGenerator(false); }}>
          <div className="w-full max-w-lg bg-[#111827] border-l border-white/[0.08] h-full overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Panel Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06] bg-gradient-to-r from-blue-500/10 to-transparent sticky top-0 z-10 bg-[#111827]">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${getCat(detailEntry.category).bg} ${getCat(detailEntry.category).color}`}>
                  {(() => { const I = getCat(detailEntry.category).icon; return <I className="w-5 h-5" />; })()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{editMode ? "Bearbeiten" : detailEntry.title}</h3>
                  <p className="text-xs text-white/40">{getCat(detailEntry.category).label} {detailEntry.client_name && `• ${detailEntry.client_name}`}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!editMode && (
                  <button onClick={() => setEditMode(true)} className="p-2 hover:bg-white/10 rounded-xl"><PencilIcon className="w-5 h-5 text-white/60" /></button>
                )}
                <button onClick={() => { setDetailEntry(null); setEditMode(false); }} className="p-2 hover:bg-white/10 rounded-xl"><XMarkIcon className="w-5 h-5 text-white/60" /></button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {editMode ? (
                /* ── Edit Mode ── */
                <>
                  <div className="space-y-3">
                    <div><label className="block text-[10px] text-white/40 mb-1">Titel</label>
                      <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white outline-none" /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className="block text-[10px] text-white/40 mb-1">Kategorie</label>
                        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white outline-none cursor-pointer">
                          {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                        </select></div>
                      <div>
                        <label className="block text-[10px] text-white/40 mb-1">
                          Kunde
                          <button type="button" onClick={() => setClientMode(clientMode === "select" ? "custom" : "select")}
                            className="ml-2 text-[#FC682C] text-[10px] hover:underline">{clientMode === "select" ? "Manuell" : "Auswählen"}</button>
                        </label>
                        {clientMode === "select" ? (
                          <select value={form.client_id} onChange={(e) => setForm({ ...form, client_id: e.target.value })} className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white outline-none cursor-pointer">
                            <option value="">Kein Kunde</option>
                            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                        ) : (
                          <input type="text" value={customClient} onChange={(e) => setCustomClient(e.target.value)}
                            placeholder="Kundenname..." className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/30 outline-none" />
                        )}
                      </div>
                    </div>
                    {form.category !== 'snippet' && (
                      <>
                        <div><label className="block text-[10px] text-white/40 mb-1">URL</label>
                          <input type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white outline-none" /></div>
                        <div><label className="block text-[10px] text-white/40 mb-1">Benutzername</label>
                          <input type="text" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white outline-none" /></div>
                        <div><label className="block text-[10px] text-white/40 mb-1">Passwort</label>
                          <div className="relative">
                            <input type="text" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full px-3 py-2.5 pr-20 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white outline-none font-mono" />
                            <button onClick={() => setShowGenerator(!showGenerator)} className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2 py-1 bg-[#FC682C]/20 text-[#FC682C] rounded-lg text-[10px]"><BoltIcon className="w-3.5 h-3.5" /></button>
                          </div>
                          {form.password && <div className="flex items-center gap-2 mt-1.5"><div className="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden"><div className={`h-full rounded-full ${getPasswordStrength(form.password).barColor}`} style={{ width: `${(getPasswordStrength(form.password).score + 1) * 20}%` }} /></div><span className={`text-[10px] ${getPasswordStrength(form.password).color}`}>{getPasswordStrength(form.password).label}</span></div>}
                        </div>
                      </>
                    )}
                    {form.category === 'snippet' && (
                      <>
                        <div><label className="block text-[10px] text-white/40 mb-1">Sprache</label>
                          <select value={form.snippet_language} onChange={(e) => setForm({ ...form, snippet_language: e.target.value })} className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white outline-none cursor-pointer">
                            {SNIPPET_LANGS.map(l => <option key={l} value={l}>{l}</option>)}
                          </select></div>
                        <div><label className="block text-[10px] text-white/40 mb-1">Code / Prompt</label>
                          <textarea value={form.snippet_code} onChange={(e) => setForm({ ...form, snippet_code: e.target.value })} rows={10}
                            className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white outline-none font-mono resize-none" /></div>
                      </>
                    )}
                    <div><label className="block text-[10px] text-white/40 mb-1">Notizen</label>
                      <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3}
                        className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white outline-none resize-none" /></div>
                    <div><label className="block text-[10px] text-white/40 mb-1">Tags (kommagetrennt)</label>
                      <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white outline-none" /></div>
                  </div>
                  {showGenerator && (
                    <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06] space-y-3">
                      <span className="text-xs font-semibold text-white">Generator</span>
                      <div className="flex items-center gap-3"><span className="text-[10px] text-white/40 w-10">{genLength}</span>
                        <input type="range" min={8} max={64} value={genLength} onChange={(e) => setGenLength(parseInt(e.target.value))} className="flex-1 accent-[#FC682C]" /></div>
                      <div className="flex gap-2">
                        {[{ k: 'upper', l: 'ABC' }, { k: 'lower', l: 'abc' }, { k: 'numbers', l: '123' }, { k: 'symbols', l: '#$%' }].map(o => (
                          <button key={o.k} onClick={() => setGenOpts({ ...genOpts, [o.k]: !(genOpts as any)[o.k] })}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono ${(genOpts as any)[o.k] ? 'bg-[#FC682C]/20 text-[#FC682C]' : 'bg-white/[0.04] text-white/30'}`}>{o.l}</button>
                        ))}
                      </div>
                      <div className="flex gap-2"><code className="flex-1 px-3 py-2 bg-white/[0.03] rounded-lg text-sm text-white font-mono truncate">{generatePassword(genLength, genOpts)}</code>
                        <button onClick={fillGeneratedPassword} className="px-4 py-2 bg-[#FC682C] text-white rounded-lg text-xs font-medium">Übernehmen</button></div>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button onClick={handleUpdate} disabled={saving || !form.title} className="flex-1 py-2.5 bg-[#FC682C] text-white rounded-xl text-sm font-medium disabled:opacity-50">
                      {saving ? "Speichert..." : "Speichern"}
                    </button>
                    <button onClick={() => { setEditMode(false); setCustomClient(""); setClientMode("select"); }} disabled={saving} className="px-4 py-2.5 bg-white/[0.04] text-white/50 rounded-xl text-sm disabled:opacity-50">Abbrechen</button>
                  </div>
                </>
              ) : (
                /* ── View Mode ── */
                <>
                  {/* Fields */}
                  {detailEntry.url && (
                    <div className="p-3 bg-white/[0.03] border border-white/[0.04] rounded-xl">
                      <p className="text-[10px] text-white/40 uppercase mb-1">URL</p>
                      <div className="flex items-center justify-between">
                        <a href={detailEntry.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline truncate">{detailEntry.url}</a>
                        <button onClick={() => copy(detailEntry.url!, "URL")} className="p-1.5 hover:bg-white/10 rounded-lg text-white/30"><ClipboardDocumentIcon className="w-4 h-4" /></button>
                      </div>
                    </div>
                  )}
                  {detailEntry.username && (
                    <div className="p-3 bg-white/[0.03] border border-white/[0.04] rounded-xl">
                      <p className="text-[10px] text-white/40 uppercase mb-1">Benutzername</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white font-mono">{detailEntry.username}</span>
                        <button onClick={() => copy(detailEntry.username!, "Benutzername")} className="p-1.5 hover:bg-white/10 rounded-lg text-white/30"><ClipboardDocumentIcon className="w-4 h-4" /></button>
                      </div>
                    </div>
                  )}
                  {detailEntry.password && (
                    <div className="p-3 bg-white/[0.03] border border-white/[0.04] rounded-xl">
                      <p className="text-[10px] text-white/40 uppercase mb-1">Passwort</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white font-mono">{visiblePasswords.has(detailEntry.id) ? detailEntry.password : "••••••••••••"}</span>
                        <div className="flex gap-1">
                          <button onClick={() => { const s = new Set(visiblePasswords); if (s.has(detailEntry.id)) s.delete(detailEntry.id); else s.add(detailEntry.id); setVisiblePasswords(s); }}
                            className="p-1.5 hover:bg-white/10 rounded-lg text-white/30">{visiblePasswords.has(detailEntry.id) ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}</button>
                          <button onClick={() => copy(detailEntry.password!, "Passwort")} className="p-1.5 hover:bg-white/10 rounded-lg text-white/30"><ClipboardDocumentIcon className="w-4 h-4" /></button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                          <div className={`h-full rounded-full ${getPasswordStrength(detailEntry.password).barColor}`}
                            style={{ width: `${(getPasswordStrength(detailEntry.password).score + 1) * 20}%` }} />
                        </div>
                        <span className={`text-[10px] ${getPasswordStrength(detailEntry.password).color}`}>{getPasswordStrength(detailEntry.password).label}</span>
                      </div>
                    </div>
                  )}
                  {detailEntry.snippet_code && (
                    <div className="rounded-xl overflow-hidden border border-white/[0.04]">
                      <div className="flex items-center justify-between px-3 py-2 bg-white/[0.04]">
                        <span className="text-[10px] text-white/40 uppercase">{detailEntry.snippet_language || 'text'}</span>
                        <button onClick={() => copy(detailEntry.snippet_code!, "Code")} className="text-[10px] text-[#FC682C] font-medium flex items-center gap-1"><ClipboardDocumentIcon className="w-3 h-3" /> Kopieren</button>
                      </div>
                      <pre className="p-4 bg-white/[0.02] text-sm text-white/80 font-mono overflow-x-auto max-h-80 whitespace-pre-wrap">{detailEntry.snippet_code}</pre>
                    </div>
                  )}
                  {detailEntry.notes && (
                    <div className="p-3 bg-white/[0.03] border border-white/[0.04] rounded-xl">
                      <p className="text-[10px] text-white/40 uppercase mb-1">Notizen</p>
                      <p className="text-sm text-white/70 whitespace-pre-wrap">{detailEntry.notes}</p>
                    </div>
                  )}
                  {detailEntry.tags?.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap">
                      {detailEntry.tags.map(t => <span key={t} className="px-2 py-1 bg-[#FC682C]/10 text-[#FC682C] rounded-lg text-xs">{t}</span>)}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button onClick={() => copyAll(detailEntry)} className="flex-1 py-2.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-blue-500/20">
                      <ClipboardDocumentListIcon className="w-4 h-4" /> Alles kopieren
                    </button>
                    <button onClick={() => toggleFav(detailEntry)} className="px-4 py-2.5 bg-white/[0.04] rounded-xl border border-white/[0.06] hover:bg-white/[0.08]">
                      {detailEntry.is_favorite ? <StarSolid className="w-4 h-4 text-yellow-400" /> : <StarIcon className="w-4 h-4 text-white/30" />}
                    </button>
                    <button onClick={() => delEntry(detailEntry.id)} className="px-4 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Metadata */}
                  <div className="pt-4 border-t border-white/[0.04] space-y-1.5 text-[11px] text-white/30">
                    <div className="flex justify-between"><span>Erstellt</span><span>{new Date(detailEntry.created_at).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" })}</span></div>
                    <div className="flex justify-between"><span>Geändert</span><span>{timeAgo(detailEntry.updated_at)} {daysOld(detailEntry.updated_at) > 90 && detailEntry.password && <span className="text-yellow-400 ml-1">(veraltet)</span>}</span></div>
                    <div className="flex justify-between"><span>ID</span><span>#{detailEntry.id}</span></div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
