"use client";

import { useState, useEffect, useCallback } from "react";
import {
  LockClosedIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
  ClipboardDocumentIcon,
  StarIcon,
  GlobeAltIcon,
  KeyIcon,
  LinkIcon,
  ServerStackIcon,
  CreditCardIcon,
  DocumentTextIcon,
  FolderIcon,
  TrashIcon,
  PencilIcon,
  CheckIcon,
  HashtagIcon,
  UserIcon,
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

function unwrapApiResponse<T>(response: unknown): T {
  if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
    return (response as { data: T }).data;
  }
  return response as T;
}

const CATEGORIES = [
  { key: "login", label: "Zugangsdaten", icon: KeyIcon, color: "text-blue-400 bg-blue-500/15" },
  { key: "api_key", label: "API Key", icon: HashtagIcon, color: "text-purple-400 bg-purple-500/15" },
  { key: "link", label: "Link", icon: LinkIcon, color: "text-green-400 bg-green-500/15" },
  { key: "server", label: "Server", icon: ServerStackIcon, color: "text-cyan-400 bg-cyan-500/15" },
  { key: "payment", label: "Zahlung", icon: CreditCardIcon, color: "text-yellow-400 bg-yellow-500/15" },
  { key: "note", label: "Notiz", icon: DocumentTextIcon, color: "text-white/60 bg-white/10" },
  { key: "other", label: "Sonstiges", icon: LockClosedIcon, color: "text-[#FC682C] bg-[#FC682C]/15" },
];

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
  const [selectedEntry, setSelectedEntry] = useState<VaultEntry | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showAddFolder, setShowAddFolder] = useState(false);
  const [saving, setSaving] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<Set<number>>(new Set());

  const [form, setForm] = useState({
    title: "", category: "login", url: "", username: "", password: "",
    notes: "", client_id: "", folder_id: "", tags: "", is_favorite: false,
  });
  const [newFolder, setNewFolder] = useState({ name: "", color: "#FC682C" });

  const loadData = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (categoryFilter !== 'all') params.set('category', categoryFilter);
    if (selectedFolder) params.set('folder_id', String(selectedFolder));
    if (showFavorites) params.set('favorites', 'true');

    Promise.all([
      fetch(`/api/vault?${params}`, { credentials: "include" }).then(r => r.json()),
      fetch("/api/vault/folders", { credentials: "include" }).then(r => r.json()),
      fetch("/api/clients", { credentials: "include" }).then(r => r.json()).catch(() => ({ data: { clients: [] } })),
    ]).then(([vaultData, folderData, clientData]) => {
      const v = unwrapApiResponse<{ entries: VaultEntry[] }>(vaultData);
      setEntries(v.entries || []);
      const f = unwrapApiResponse<{ folders: VaultFolder[] }>(folderData);
      setFolders(f.folders || []);
      const c = unwrapApiResponse<{ clients: any[] }>(clientData);
      setClients((c.clients || []).map((cl: any) => ({ id: cl.id, name: cl.name })));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [search, categoryFilter, selectedFolder, showFavorites]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleAdd = async () => {
    if (!form.title) return;
    setSaving(true);
    try {
      const res = await fetch("/api/vault", {
        credentials: "include", method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          client_id: form.client_id ? parseInt(form.client_id) : null,
          folder_id: form.folder_id ? parseInt(form.folder_id) : null,
          tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
        }),
      });
      if (res.ok) {
        showToast("success", "Eintrag gespeichert!");
        setForm({ title: "", category: "login", url: "", username: "", password: "", notes: "", client_id: "", folder_id: "", tags: "", is_favorite: false });
        setShowAdd(false);
        loadData();
      }
    } catch { showToast("error", "Fehler beim Speichern"); }
    finally { setSaving(false); }
  };

  const handleAddFolder = async () => {
    if (!newFolder.name) return;
    setSaving(true);
    try {
      await fetch("/api/vault/folders", {
        credentials: "include", method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFolder),
      });
      showToast("success", "Ordner erstellt!");
      setNewFolder({ name: "", color: "#FC682C" });
      setShowAddFolder(false);
      loadData();
    } catch { showToast("error", "Fehler"); }
    finally { setSaving(false); }
  };

  const toggleFavorite = async (entry: VaultEntry) => {
    await fetch(`/api/vault/${entry.id}`, {
      credentials: "include", method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_favorite: !entry.is_favorite }),
    });
    loadData();
  };

  const deleteEntry = async (id: number) => {
    await fetch(`/api/vault/${id}`, { credentials: "include", method: "DELETE" });
    showToast("success", "Eintrag gelöscht");
    setSelectedEntry(null);
    loadData();
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast("success", `${label} kopiert!`);
  };

  const togglePassword = (id: number) => {
    const next = new Set(visiblePasswords);
    if (next.has(id)) next.delete(id); else next.add(id);
    setVisiblePasswords(next);
  };

  const getCategoryInfo = (cat: string) => CATEGORIES.find(c => c.key === cat) || CATEGORIES[6];

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-3 border-[#FC682C]/30 border-t-[#FC682C] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/15 to-blue-600/5 border border-blue-500/15">
          <div className="flex items-center gap-2 mb-1">
            <LockClosedIcon className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-white/50">Gesamt</span>
          </div>
          <p className="text-2xl font-bold text-white">{entries.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/15 to-purple-600/5 border border-purple-500/15">
          <div className="flex items-center gap-2 mb-1">
            <KeyIcon className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-white/50">Zugänge</span>
          </div>
          <p className="text-2xl font-bold text-white">{entries.filter(e => e.category === 'login').length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500/15 to-green-600/5 border border-green-500/15">
          <div className="flex items-center gap-2 mb-1">
            <LinkIcon className="w-4 h-4 text-green-400" />
            <span className="text-xs text-white/50">Links</span>
          </div>
          <p className="text-2xl font-bold text-white">{entries.filter(e => e.category === 'link').length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FC682C]/15 to-[#FC682C]/5 border border-[#FC682C]/15">
          <div className="flex items-center gap-2 mb-1">
            <FolderIcon className="w-4 h-4 text-[#FC682C]" />
            <span className="text-xs text-white/50">Ordner</span>
          </div>
          <p className="text-2xl font-bold text-white">{folders.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-500/15 to-yellow-600/5 border border-yellow-500/15">
          <div className="flex items-center gap-2 mb-1">
            <StarIcon className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-white/50">Favoriten</span>
          </div>
          <p className="text-2xl font-bold text-white">{entries.filter(e => e.is_favorite).length}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
          <input type="text" placeholder="Suche in Datentresor..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/[0.04] border border-white/[0.06] rounded-xl text-white placeholder:text-white/30 focus:border-[#FC682C]/50 outline-none" />
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowFavorites(!showFavorites)}
            className={`px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${showFavorites ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" : "bg-white/[0.04] text-white/50 border border-white/[0.06]"}`}>
            {showFavorites ? <StarSolid className="w-4 h-4" /> : <StarIcon className="w-4 h-4" />}
          </button>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-white outline-none cursor-pointer">
            <option value="all">Alle Kategorien</option>
            {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
          </select>
          <button onClick={() => setShowAddFolder(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-white/[0.04] text-white/60 border border-white/[0.06] rounded-xl text-sm font-medium hover:bg-white/[0.08] transition-colors">
            <FolderIcon className="w-4 h-4" /> Ordner
          </button>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-5 py-2 bg-[#FC682C] text-white rounded-xl text-sm font-medium hover:bg-[#FC682C]/90 transition-colors">
            <PlusIcon className="w-4 h-4" /> Neuer Eintrag
          </button>
        </div>
      </div>

      {/* Folder Tabs */}
      {folders.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button onClick={() => setSelectedFolder(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${!selectedFolder ? "bg-[#FC682C] text-white" : "bg-white/[0.04] text-white/50 hover:bg-white/[0.08]"}`}>
            Alle
          </button>
          {folders.map(f => (
            <button key={f.id} onClick={() => setSelectedFolder(f.id === selectedFolder ? null : f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${f.id === selectedFolder ? "bg-[#FC682C] text-white" : "bg-white/[0.04] text-white/50 hover:bg-white/[0.08]"}`}>
              <FolderIcon className="w-3.5 h-3.5" /> {f.name}
            </button>
          ))}
        </div>
      )}

      {/* Add Folder Form */}
      {showAddFolder && (
        <div className="p-4 rounded-2xl bg-[#FC682C]/10 border border-[#FC682C]/20 flex items-end gap-3">
          <div className="flex-1">
            <label className="block text-[10px] text-white/40 mb-1">Ordnername</label>
            <input type="text" value={newFolder.name} onChange={(e) => setNewFolder({ ...newFolder, name: e.target.value })}
              placeholder="z.B. Hosting, Social Media..." className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/30 outline-none" />
          </div>
          <button onClick={handleAddFolder} disabled={saving || !newFolder.name}
            className="px-4 py-2.5 bg-[#FC682C] text-white rounded-xl text-sm font-medium disabled:opacity-50">Erstellen</button>
          <button onClick={() => setShowAddFolder(false)} className="px-4 py-2.5 bg-white/[0.04] text-white/50 rounded-xl text-sm">Abbrechen</button>
        </div>
      )}

      {/* Add Entry Form */}
      {showAdd && (
        <div className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/15 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-blue-400 flex items-center gap-2">
              <LockClosedIcon className="w-4 h-4" /> Neuen Eintrag anlegen
            </h4>
            <button onClick={() => setShowAdd(false)} className="p-1.5 hover:bg-white/10 rounded-lg">
              <XMarkIcon className="w-4 h-4 text-white/40" />
            </button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="lg:col-span-2">
              <label className="block text-[10px] text-white/40 mb-1">Titel *</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="z.B. WordPress Admin" className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/30 outline-none" />
            </div>
            <div>
              <label className="block text-[10px] text-white/40 mb-1">Kategorie</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white outline-none cursor-pointer">
                {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-white/40 mb-1">Kunde</label>
              <select value={form.client_id} onChange={(e) => setForm({ ...form, client_id: e.target.value })}
                className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white outline-none cursor-pointer">
                <option value="">Kein Kunde</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-white/40 mb-1">URL</label>
              <input type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://..." className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/30 outline-none" />
            </div>
            <div>
              <label className="block text-[10px] text-white/40 mb-1">Benutzername</label>
              <input type="text" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="admin@..." className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/30 outline-none" />
            </div>
            <div>
              <label className="block text-[10px] text-white/40 mb-1">Passwort</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••" className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/30 outline-none" />
            </div>
            <div>
              <label className="block text-[10px] text-white/40 mb-1">Ordner</label>
              <select value={form.folder_id} onChange={(e) => setForm({ ...form, folder_id: e.target.value })}
                className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white outline-none cursor-pointer">
                <option value="">Kein Ordner</option>
                {folders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>
            <div className="lg:col-span-3">
              <label className="block text-[10px] text-white/40 mb-1">Notizen</label>
              <input type="text" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Zusätzliche Informationen..." className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/30 outline-none" />
            </div>
            <div>
              <label className="block text-[10px] text-white/40 mb-1">Tags</label>
              <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="hosting, wichtig" className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/30 outline-none" />
            </div>
          </div>
          <button onClick={handleAdd} disabled={saving || !form.title}
            className="w-full py-2.5 bg-blue-500/20 text-blue-400 rounded-xl text-sm font-medium hover:bg-blue-500/30 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors">
            {saving ? <div className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" /> : <LockClosedIcon className="w-4 h-4" />}
            {saving ? "Wird verschlüsselt..." : "Sicher speichern"}
          </button>
        </div>
      )}

      {/* Entries List */}
      <div className="space-y-2">
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <LockClosedIcon className="w-16 h-16 text-white/10 mb-4" />
            <h3 className="text-lg font-medium text-white/50">Datentresor ist leer</h3>
            <p className="text-sm text-white/30">Erstelle deinen ersten sicheren Eintrag</p>
          </div>
        ) : (
          entries.map((entry) => {
            const cat = getCategoryInfo(entry.category);
            const CatIcon = cat.icon;
            const isVisible = visiblePasswords.has(entry.id);
            return (
              <div key={entry.id}
                className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all group">
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cat.color}`}>
                    <CatIcon className="w-5 h-5" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-white">{entry.title}</span>
                      {entry.client_name && (
                        <span className="px-1.5 py-0.5 bg-white/[0.04] text-white/40 rounded text-[9px] border border-white/[0.04]">
                          {entry.client_name}
                        </span>
                      )}
                      {entry.tags?.map(t => (
                        <span key={t} className="px-1.5 py-0.5 bg-[#FC682C]/10 text-[#FC682C]/60 rounded text-[9px]">{t}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-white/40">
                      {entry.url && <span className="truncate max-w-[200px]">{entry.url.replace(/https?:\/\//, '')}</span>}
                      {entry.username && <span className="flex items-center gap-1"><UserIcon className="w-3 h-3" />{entry.username}</span>}
                    </div>
                  </div>

                  {/* Password + Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    {entry.username && (
                      <button onClick={() => copyToClipboard(entry.username!, "Benutzername")}
                        className="p-2 hover:bg-white/10 rounded-lg text-white/30 hover:text-white transition-colors" title="Benutzer kopieren">
                        <UserIcon className="w-4 h-4" />
                      </button>
                    )}
                    {entry.password && (
                      <>
                        <button onClick={() => togglePassword(entry.id)}
                          className="p-2 hover:bg-white/10 rounded-lg text-white/30 hover:text-white transition-colors" title="Passwort anzeigen">
                          {isVisible ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                        </button>
                        <button onClick={() => copyToClipboard(entry.password!, "Passwort")}
                          className="p-2 hover:bg-white/10 rounded-lg text-white/30 hover:text-white transition-colors" title="Passwort kopieren">
                          <ClipboardDocumentIcon className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    {entry.url && (
                      <a href={entry.url} target="_blank" rel="noopener noreferrer"
                        className="p-2 hover:bg-white/10 rounded-lg text-white/30 hover:text-white transition-colors" title="URL öffnen">
                        <GlobeAltIcon className="w-4 h-4" />
                      </a>
                    )}
                    <button onClick={() => toggleFavorite(entry)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Favorit">
                      {entry.is_favorite ? <StarSolid className="w-4 h-4 text-yellow-400" /> : <StarIcon className="w-4 h-4 text-white/30" />}
                    </button>
                    <button onClick={() => deleteEntry(entry.id)}
                      className="p-2 hover:bg-red-500/10 rounded-lg text-white/30 hover:text-red-400 transition-colors" title="Löschen">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Password Display */}
                  {entry.password && (
                    <div className="flex-shrink-0 w-32 text-right">
                      <code className="text-xs font-mono text-white/50">
                        {isVisible ? entry.password : "••••••••••"}
                      </code>
                    </div>
                  )}
                </div>

                {/* Notes */}
                {entry.notes && (
                  <div className="mt-2 ml-14 text-xs text-white/30">{entry.notes}</div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
