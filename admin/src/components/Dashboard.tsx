"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  HomeIcon,
  UsersIcon,
  GlobeAltIcon,
  UserGroupIcon,
  EnvelopeIcon,
  Cog6ToothIcon,
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  ChartBarIcon,
  BellIcon,
  DocumentTextIcon,
  PhoneIcon,
  EnvelopeOpenIcon,
  CalendarIcon,
  CalendarDaysIcon,
  CurrencyEuroIcon,
  SparklesIcon,
  RocketLaunchIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  FunnelIcon,
  StarIcon,
  FireIcon,
  BoltIcon,
  CommandLineIcon,
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentCheckIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  LinkIcon,
  ShieldCheckIcon,
  MagnifyingGlassCircleIcon,
  CpuChipIcon,
  WrenchScrewdriverIcon,
  TagIcon,
  HashtagIcon,
  ArrowUpIcon,
  EllipsisVerticalIcon,
  CheckIcon,
  CheckBadgeIcon,
  CalculatorIcon,
  LockClosedIcon,
  BanknotesIcon,
  ReceiptPercentIcon,
  ScaleIcon,
  DocumentDuplicateIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import {
  StarIcon as StarSolid,
  FireIcon as FireSolid,
} from "@heroicons/react/24/solid";

// Next-Level Components
import { Confetti, KeyboardShortcuts, useToast } from "@/components";
import InvoiceManager from "@/components/InvoiceManager";
import { AgreementManager } from "@/components/AgreementManager";
import CalendarTab from "@/components/CalendarTab";
import EmailCenterTab from "@/components/EmailCenterTab";
import NotificationsTab from "@/components/NotificationsTab";
import AccountingTab from "@/components/AccountingTab";
import PrivacyTab from "@/components/PrivacyTab";

// ═══════════════════════════════════════════════════════════════
//                    API RESPONSE HELPER
// Handles both wrapped {success, data} and direct response formats
// ═══════════════════════════════════════════════════════════════

function unwrapApiResponse<T>(response: unknown): T {
  if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
    return (response as { data: T }).data;
  }
  return response as T;
}

// ═══════════════════════════════════════════════════════════════
//                    TYPES
// ═══════════════════════════════════════════════════════════════

type Tab =
  | "dashboard"
  | "pipeline"
  | "leads"
  | "vertrieb"
  | "clients"
  | "invoices"
  | "agreements"
  | "dokumente"
  | "accounting"
  | "privacy"
  | "checks"
  | "referrals"
  | "subscribers"
  | "analytics"
  | "automations"
  | "calendar"
  | "emails"
  | "kommunikation"
  | "notifications"
  | "settings";
type PipelineView = "kanban" | "list";

interface Stats {
  leads: {
    total: number;
    new: number;
    contacted: number;
    qualified: number;
    proposal?: number;
    won: number;
    lost: number;
    thisWeek: number;
    conversionRate: number;
  };
  checks: {
    total: number;
    today: number;
    thisWeek: number;
    avgScore: number;
    topScore: number;
  };
  referrals: {
    total: number;
    pending: number;
    converted: number;
    conversionRate: number;
  };
  subscribers: {
    total: number;
    confirmed: number;
    thisWeek: number;
    growthRate: number;
  };
  revenue: {
    total: number;
    thisMonth: number;
    projected: number;
    deals: number;
  };
  trends?: {
    leads: number[];
    checks: number[];
    revenue: number[];
  };
  recentLeads?: {
    id: number;
    name: string;
    email: string;
    company: string | null;
    packageInterest: string | null;
    status: string;
    priority: string;
    createdAt: string;
  }[];
}

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  source: string;
  packageInterest: string | null;
  message: string;
  budget: string | null;
  status: string;
  priority: string;
  notes: string | null;
  estimatedValue: number | null;
  nextFollowUp: string | null;
  tags: string | null;
  createdAt: string;
  updatedAt: string;
}

interface WebsiteCheck {
  id: number;
  url: string;
  email: string | null;
  scoreOverall: number;
  scoreSecurity: number;
  scoreSeo: number;
  scoreAccessibility: number;
  scorePerformance: number;
  scoreStructure: number;
  loadTime: number;
  httpsEnabled: boolean;
  resultJson: string;
  createdAt: string;
}

// ═══════════════════════════════════════════════════════════════
//                    HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Gerade eben";
  if (diffMins < 60) return `Vor ${diffMins} Min`;
  if (diffHours < 24) return `Vor ${diffHours} Std`;
  if (diffDays === 1) return "Gestern";
  if (diffDays < 7) return `Vor ${diffDays} Tagen`;
  return date.toLocaleDateString("de-DE");
}

// ═══════════════════════════════════════════════════════════════
//                    MAIN DASHBOARD
// ═══════════════════════════════════════════════════════════════

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const fetchStats = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/stats", { credentials: "include" });
      
      // Handle 401 - redirect to login
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      
      if (res.ok) {
        const data = await res.json();
        // Verwende echte Daten aus der API
        setStats({
          leads: {
            total: data.leads.total || 0,
            new: data.leads.new || 0,
            contacted: data.leads.contacted || 0,
            qualified: data.leads.qualified || 0,
            won: data.leads.won || 0,
            lost: data.leads.lost || 0,
            thisWeek: data.leads.thisWeek || 0,
            conversionRate: data.leads.conversionRate || 0,
          },
          checks: {
            total: data.checks.total || 0,
            today: data.checks.today || 0,
            thisWeek: data.checks.thisWeek || 0,
            avgScore: data.checks.avgScore || 0,
            topScore: data.checks.topScore || 0,
          },
          referrals: {
            total: data.referrals.total || 0,
            pending: data.referrals.pending || 0,
            converted: data.referrals.converted || 0,
            conversionRate: data.referrals.conversionRate || 0,
          },
          subscribers: {
            total: data.subscribers.total || 0,
            confirmed: data.subscribers.confirmed || 0,
            thisWeek: data.subscribers.thisWeek || 0,
            growthRate: data.subscribers.growthRate || 0,
          },
          revenue: {
            total: data.revenue?.total || 0,
            thisMonth: data.revenue?.thisMonth || 0,
            projected: 0,
            deals: data.leads.won || 0,
          },
          trends: data.trends || { leads: [], checks: [], revenue: [] },
          recentLeads: data.recentLeads || [],
        });
      } else {
        console.error("Failed to fetch stats:", res.status);
        showToast("error", "Fehler beim Laden der Daten");
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      showToast("error", "Verbindungsfehler");
    }
    setRefreshing(false);
  }, [router, showToast]);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications", { credentials: "include" });
      
      // Handle 401 - redirect to login
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.data?.notifications || data.notifications || []);
        setUnreadCount(data.data?.unreadCount || data.unreadCount || 0);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  }, [router]);

  useEffect(() => {
    fetchStats();
    fetchNotifications();
    const statsInterval = setInterval(fetchStats, 30000);
    const notifInterval = setInterval(fetchNotifications, 15000);
    return () => {
      clearInterval(statsInterval);
      clearInterval(notifInterval);
    };
  }, [fetchStats, fetchNotifications]);

  // Keyboard shortcut für Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      if (e.key === "Escape") {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    router.push("/login");
  };

  const navSections = [
    {
      label: "CRM & Vertrieb",
      items: [
        { id: "dashboard" as Tab, label: "Dashboard", icon: HomeIcon, badge: null },
        { id: "vertrieb" as Tab, label: "Vertrieb", icon: FunnelIcon, badge: stats?.leads.new, hot: true },
        { id: "clients" as Tab, label: "Kunden", icon: UserGroupIcon, badge: null },
      ],
    },
    {
      label: "Finanzen",
      items: [
        { id: "dokumente" as Tab, label: "Dokumente", icon: DocumentTextIcon, badge: null },
        { id: "accounting" as Tab, label: "Buchhaltung", icon: CalculatorIcon, badge: null },
      ],
    },
    {
      label: "Marketing",
      items: [
        { id: "kommunikation" as Tab, label: "Kommunikation", icon: EnvelopeOpenIcon, badge: null },
        { id: "checks" as Tab, label: "Website-Checks", icon: GlobeAltIcon, badge: stats?.checks.today },
        { id: "referrals" as Tab, label: "Empfehlungen", icon: StarIcon, badge: stats?.referrals.pending },
      ],
    },
    {
      label: "Analyse & System",
      items: [
        { id: "analytics" as Tab, label: "Analytics", icon: ChartBarIcon, badge: null },
        { id: "notifications" as Tab, label: "Benachrichtigungen", icon: BellIcon, badge: unreadCount > 0 ? unreadCount : null },
        { id: "calendar" as Tab, label: "Kalender", icon: CalendarDaysIcon, badge: null },
      ],
    },
    {
      label: "Verwaltung",
      items: [
        { id: "privacy" as Tab, label: "Datenschutz", icon: ShieldCheckIcon, badge: null },
      ],
    },
  ];

  // Flat list for compatibility (mobile nav, command palette, etc.)
  const navItems = navSections.flatMap((s) => s.items);

  return (
    <div className="min-h-screen bg-[#09090b] flex">
      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts
        onTabChange={(tab) => setActiveTab(tab as Tab)}
        onRefresh={fetchStats}
        onToggleProfile={() => setShowNotifications((prev) => !prev)}
      />

      {/* Confetti Celebration */}
      <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Command Palette */}
      {commandPaletteOpen && (
        <CommandPalette
          onClose={() => setCommandPaletteOpen(false)}
          onNavigate={setActiveTab}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 bg-[#0f0f12] border-r border-white/[0.06] transform transition-all duration-300 ease-in-out
        ${sidebarCollapsed ? "w-[72px]" : "w-64"}
        lg:relative lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/[0.06]">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3">
              <img
                src="/logo-dark.png"
                alt="AgentFlow"
                className="h-9 w-auto"
              />
            </div>
          )}
          {sidebarCollapsed && (
            <img
              src="/logo-dark.png"
              alt="AgentFlow"
              className="h-8 w-auto mx-auto object-contain"
            />
          )}
          <button
            onClick={() => {
              setSidebarCollapsed(!sidebarCollapsed);
              setSidebarOpen(false);
            }}
            className="hidden lg:block p-1.5 hover:bg-white/5 rounded-lg transition-colors"
          >
            <ChevronRightIcon
              className={`w-4 h-4 text-white/40 transition-transform ${sidebarCollapsed ? "" : "rotate-180"}`}
            />
          </button>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 hover:bg-white/5 rounded-lg"
          >
            <XMarkIcon className="w-5 h-5 text-white/60" />
          </button>
        </div>

        {/* Quick Stats Mini */}
        {!sidebarCollapsed && (
          <div className="p-3 border-b border-white/[0.06]">
            <div className="grid grid-cols-2 gap-2">
              <MiniStatCard
                value={stats?.leads.total || 0}
                label="Leads"
                trend={stats?.leads.new || 0}
              />
              <MiniStatCard
                value={`€${((stats?.revenue.thisMonth || 0) / 1000).toFixed(1)}k`}
                label="Umsatz"
                trend={stats?.revenue.thisMonth || 0}
              />
            </div>
          </div>
        )}

        {/* Nav - Scrollable */}
        <nav
          className="flex-1 p-2 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
          style={{ maxHeight: "calc(100vh - 240px)" }}
        >
          {navSections.map((section, sIdx) => (
            <div key={section.label} className={sIdx > 0 ? "mt-4" : ""}>
              {!sidebarCollapsed && (
                <div className="px-3 mb-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-white/25">
                    {section.label}
                  </span>
                </div>
              )}
              {sidebarCollapsed && sIdx > 0 && (
                <div className="mx-3 mb-2 border-t border-white/[0.06]" />
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all group relative ${
                      activeTab === item.id
                        ? "bg-gradient-to-r from-[#FC682C]/20 via-[#FC682C]/10 to-transparent text-white"
                        : "text-white/50 hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    {activeTab === item.id && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-gradient-to-b from-[#FC682C] to-[#9D65C9] rounded-r-full" />
                    )}
                    <item.icon
                      className={`w-[18px] h-[18px] flex-shrink-0 ${activeTab === item.id ? "text-[#FC682C]" : ""}`}
                    />
                    {!sidebarCollapsed && (
                      <>
                        <span className="flex-1 text-left truncate">{item.label}</span>
                        {"hot" in item && item.hot && (
                          <span className="px-1.5 py-0.5 text-[8px] font-bold bg-gradient-to-r from-[#FC682C] to-[#FF8F5C] text-white rounded-full">
                            HOT
                          </span>
                        )}
                        {item.badge !== null &&
                          item.badge !== undefined &&
                          item.badge > 0 && (
                            <span className="min-w-[18px] h-[18px] px-1 text-[10px] bg-[#FC682C] text-white rounded-full font-medium flex items-center justify-center">
                              {item.badge}
                            </span>
                          )}
                      </>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Section - Compact */}
        <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-white/[0.06] bg-[#0f0f12]">
          {!sidebarCollapsed && (
            <div className="mb-2 p-2 rounded-lg bg-gradient-to-br from-[#FC682C]/10 to-[#9D65C9]/10 border border-[#FC682C]/20">
              <div className="flex items-center gap-2">
                <SparklesIcon className="w-3.5 h-3.5 text-[#FC682C]" />
                <span className="text-[11px] font-medium text-white">Pro Tipp</span>
              </div>
              <p className="text-[10px] text-white/50 mt-1">
                Drücke{" "}
                <kbd className="px-1 py-0.5 bg-white/10 rounded text-[9px]">
                  ⌘K
                </kbd>{" "}
                für Schnellzugriff
              </p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-colors ${sidebarCollapsed ? "justify-center" : ""}`}
          >
            <ArrowRightStartOnRectangleIcon className="w-[18px] h-[18px]" />
            {!sidebarCollapsed && <span>Abmelden</span>}
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto overflow-x-hidden">
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-4 lg:px-6 border-b border-white/[0.06] bg-[#09090b]/80 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-white/5 rounded-xl"
            >
              <Bars3Icon className="w-5 h-5 text-white/60" />
            </button>
            <div>
              <h2 className="text-lg font-semibold text-white">
                {navItems.find((n) => n.id === activeTab)?.label}
              </h2>
              <p className="text-xs text-white/40 hidden sm:block">
                {new Date().toLocaleDateString("de-DE", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl transition-colors"
            >
              <MagnifyingGlassIcon className="w-4 h-4 text-white/40" />
              <span className="text-sm text-white/40">Suchen...</span>
              <kbd className="px-1.5 py-0.5 bg-white/[0.06] rounded text-[10px] text-white/30">
                ⌘K
              </kbd>
            </button>

            {/* Refresh */}
            <button
              onClick={fetchStats}
              disabled={refreshing}
              className="p-2 hover:bg-white/5 rounded-xl transition-colors"
            >
              <ArrowPathIcon
                className={`w-5 h-5 text-white/40 ${refreshing ? "animate-spin" : ""}`}
              />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-white/5 rounded-xl transition-colors relative"
              >
                <BellIcon className="w-5 h-5 text-white/40" />
                {(notifications.length > 0 || unreadCount > 0) && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#FC682C] rounded-full animate-pulse" />
                )}
              </button>
              {showNotifications && (
                <NotificationDropdown
                  notifications={notifications}
                  onClose={() => setShowNotifications(false)}
                  onNavigate={(tab: Tab) => {
                    setActiveTab(tab);
                    setShowNotifications(false);
                  }}
                />
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <div
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FC682C] to-[#9D65C9] flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:opacity-90 transition-opacity"
              >
                A
              </div>
              {showProfileMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                  <div className="absolute right-0 top-12 w-52 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                    <button
                      onClick={() => { setActiveTab("settings" as Tab); setShowProfileMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors"
                    >
                      <Cog6ToothIcon className="w-4 h-4" />
                      Einstellungen
                    </button>
                    <div className="border-t border-white/10" />
                    <button
                      onClick={() => { handleLogout(); setShowProfileMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <ArrowRightStartOnRectangleIcon className="w-4 h-4" />
                      Abmelden
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 lg:p-6 pb-24 lg:pb-6">
          {activeTab === "dashboard" && (
            <DashboardTab stats={stats} onNavigate={setActiveTab} />
          )}
          {activeTab === "vertrieb" && <VertriebTab />}
          {activeTab === "pipeline" && <VertriebTab />}
          {activeTab === "leads" && <VertriebTab />}
          {activeTab === "clients" && <ClientsTab />}
          {activeTab === "dokumente" && <DokumenteTab />}
          {activeTab === "invoices" && <DokumenteTab />}
          {activeTab === "agreements" && <DokumenteTab />}
          {activeTab === "accounting" && <AccountingTab />}
          {activeTab === "privacy" && <PrivacyTab />}
          {activeTab === "checks" && <ChecksTab />}
          {activeTab === "referrals" && <ReferralsTab />}
          {activeTab === "kommunikation" && <KommunikationTab />}
          {activeTab === "subscribers" && <KommunikationTab />}
          {activeTab === "analytics" && <AnalyticsTab stats={stats} />}
          {/* automations removed from sidebar - kept for direct URL access */}
          {activeTab === "automations" && <AutomationsTab />}
          {activeTab === "calendar" && <CalendarTab />}
          {activeTab === "emails" && <KommunikationTab />}
          {activeTab === "notifications" && <NotificationsTab />}
          {activeTab === "settings" && <SettingsTab />}
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-[#0f0f12]/95 backdrop-blur-xl border-t border-white/[0.08] safe-area-bottom">
          <div className="flex items-center justify-around px-2 py-2">
            {[
              { id: "dashboard" as Tab, icon: HomeIcon, label: "Home" },
              {
                id: "vertrieb" as Tab,
                icon: FunnelIcon,
                label: "Vertrieb",
                badge: stats?.leads.new,
              },
              { id: "clients" as Tab, icon: UserGroupIcon, label: "Kunden" },
              {
                id: "referrals" as Tab,
                icon: StarIcon,
                label: "Empf.",
                badge: stats?.referrals.pending,
              },
              { id: "kommunikation" as Tab, icon: EnvelopeOpenIcon, label: "Komm." },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex flex-col items-center justify-center min-w-[60px] py-2 px-3 rounded-xl transition-all ${
                  activeTab === item.id
                    ? "text-[#FC682C]"
                    : "text-white/40 active:text-white/60"
                }`}
              >
                <div className="relative">
                  <item.icon
                    className={`w-6 h-6 ${activeTab === item.id ? "text-[#FC682C]" : ""}`}
                  />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 text-[10px] bg-[#FC682C] text-white rounded-full font-bold flex items-center justify-center">
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] mt-1 font-medium ${activeTab === item.id ? "text-[#FC682C]" : ""}`}
                >
                  {item.label}
                </span>
                {activeTab === item.id && (
                  <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#FC682C] rounded-full" />
                )}
              </button>
            ))}
          </div>
        </nav>
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════════

function MiniStatCard({
  value,
  label,
  trend,
}: {
  value: string | number;
  label: string;
  trend?: number;
}) {
  return (
    <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.04]">
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-white">{value}</span>
        {trend && (
          <span
            className={`text-[10px] font-medium ${trend > 0 ? "text-green-400" : "text-red-400"}`}
          >
            {trend > 0 ? "+" : ""}
            {trend}%
          </span>
        )}
      </div>
      <p className="text-[10px] text-white/40">{label}</p>
    </div>
  );
}

function NotificationDropdown({
  notifications,
  onClose,
  onNavigate,
}: {
  notifications: any[];
  onClose: () => void;
  onNavigate: (tab: Tab) => void;
}) {
  const getTabFromType = (type: string): Tab => {
    switch (type) {
      case "lead":
        return "leads";
      case "check":
        return "checks";
      case "referral":
        return "referrals";
      case "message":
        return "clients";
      default:
        return "dashboard";
    }
  };

  return (
    <div className="absolute right-0 top-12 w-80 bg-[#121215] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden z-50">
      <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
        <h3 className="font-semibold text-white">Benachrichtigungen</h3>
        {notifications.length > 0 && (
          <span className="text-xs text-white/40">
            {notifications.length} neu
          </span>
        )}
      </div>
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <BellIcon className="w-10 h-10 text-white/10 mx-auto mb-2" />
            <p className="text-sm text-white/40">
              Keine neuen Benachrichtigungen
            </p>
          </div>
        ) : (
          notifications.map((notif) => (
            <NotificationItem
              key={notif.id}
              type={notif.type}
              title={notif.title}
              desc={notif.description}
              time={notif.time}
              onClick={() => onNavigate(getTabFromType(notif.type))}
            />
          ))
        )}
      </div>
      {notifications.length > 0 && (
        <div className="p-3 border-t border-white/[0.06]">
          <button
            onClick={() => onNavigate("dashboard")}
            className="w-full py-2 text-sm text-[#FC682C] hover:bg-[#FC682C]/10 rounded-lg transition-colors"
          >
            Alle anzeigen
          </button>
        </div>
      )}
    </div>
  );
}

function NotificationItem({
  type,
  title,
  desc,
  time,
  onClick,
}: {
  type: string;
  title: string;
  desc: string;
  time: string;
  onClick?: () => void;
}) {
  const icons = {
    lead: UsersIcon,
    check: GlobeAltIcon,
    referral: UserGroupIcon,
    message: ChatBubbleLeftRightIcon,
  };
  const colors = {
    lead: "bg-blue-500/20 text-blue-400",
    check: "bg-green-500/20 text-green-400",
    referral: "bg-purple-500/20 text-purple-400",
    message: "bg-[#FC682C]/20 text-[#FC682C]",
  };
  const Icon = icons[type as keyof typeof icons] || UsersIcon;
  const color = colors[type as keyof typeof colors] || colors.lead;

  return (
    <div
      onClick={onClick}
      className="flex items-start gap-3 p-4 hover:bg-white/[0.02] cursor-pointer transition-colors"
    >
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="text-xs text-white/50 truncate">{desc}</p>
      </div>
      <span className="text-[10px] text-white/30 whitespace-nowrap">
        {time}
      </span>
    </div>
  );
}

function CommandPalette({
  onClose,
  onNavigate,
}: {
  onClose: () => void;
  onNavigate: (tab: Tab) => void;
}) {
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const commands = [
    {
      id: "dashboard",
      label: "Dashboard öffnen",
      icon: HomeIcon,
      action: () => onNavigate("dashboard"),
    },
    {
      id: "pipeline",
      label: "Pipeline öffnen",
      icon: FunnelIcon,
      action: () => onNavigate("vertrieb"),
    },
    {
      id: "new-lead",
      label: "Neuen Lead anlegen",
      icon: PlusIcon,
      action: () => { onNavigate("leads"); onClose(); },
    },
    {
      id: "export",
      label: "Daten exportieren",
      icon: ArrowDownTrayIcon,
      action: () => { onNavigate("leads"); onClose(); },
    },
    {
      id: "analytics",
      label: "Analytics öffnen",
      icon: ChartBarIcon,
      action: () => onNavigate("analytics"),
    },
    {
      id: "settings",
      label: "Einstellungen",
      icon: Cog6ToothIcon,
      action: () => onNavigate("settings"),
    },
  ];

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#121215] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 p-4 border-b border-white/[0.06]">
          <MagnifyingGlassIcon className="w-5 h-5 text-white/40" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Suchen oder Befehl eingeben..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder:text-white/30 outline-none"
          />
          <kbd className="px-2 py-1 bg-white/[0.06] rounded text-xs text-white/30">
            ESC
          </kbd>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.map((cmd) => (
            <button
              key={cmd.id}
              onClick={() => {
                cmd.action();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-white/[0.04] transition-colors"
            >
              <cmd.icon className="w-5 h-5 text-white/40" />
              <span className="text-sm text-white">{cmd.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    DASHBOARD TAB
// ═══════════════════════════════════════════════════════════════

function DashboardTab({
  stats,
  onNavigate,
}: {
  stats: Stats | null;
  onNavigate?: (tab: Tab) => void;
}) {
  const [topChecks, setTopChecks] = useState<{url: string; scoreOverall: number}[]>([]);

  useEffect(() => {
    // Fetch top website checks
    fetch('/api/checks')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.checks) {
          // Sort by score and take top 3
          const sorted = data.data.checks
            .filter((c: any) => c.scoreOverall > 0)
            .sort((a: any, b: any) => b.scoreOverall - a.scoreOverall)
            .slice(0, 3);
          setTopChecks(sorted);
        }
      })
      .catch(err => console.error('Failed to fetch checks:', err));
  }, []);

  if (!stats) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#FC682C]/20 via-[#9D65C9]/10 to-[#FC682C]/5 border border-[#FC682C]/20 p-6">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white mb-2">
            Willkommen zurück! 👋
          </h2>
          <p className="text-white/60 mb-4">
            Du hast{" "}
            <span className="text-[#FC682C] font-semibold">
              {stats.leads.new} neue Leads
            </span>{" "}
            und{" "}
            <span className="text-[#9D65C9] font-semibold">
              {stats.checks.today} Website-Checks
            </span>{" "}
            heute.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => onNavigate?.("leads")}
              className="px-4 py-2 bg-[#FC682C] text-white rounded-xl text-sm font-medium hover:bg-[#FC682C]/90 transition-colors flex items-center gap-2"
            >
              <EyeIcon className="w-4 h-4" /> Leads ansehen
            </button>
            <button
              onClick={() => onNavigate?.("vertrieb")}
              className="px-4 py-2 bg-white/10 text-white rounded-xl text-sm font-medium hover:bg-white/20 transition-colors"
            >
              Pipeline öffnen
            </button>
          </div>
        </div>
        <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-br from-[#FC682C]/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute right-20 bottom-0 w-40 h-40 bg-gradient-to-br from-[#9D65C9]/20 to-transparent rounded-full blur-2xl" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Leads"
          value={stats.leads.total}
          change={stats.leads.thisWeek}
          changeLabel="diese Woche"
          icon={UsersIcon}
          color="blue"
          sparkline={stats.trends?.leads?.length ? stats.trends.leads : [0, 0, 0, 0, 0, 0, stats.leads.total]}
          onClick={() => onNavigate?.("leads")}
        />
        <StatCard
          title="Website-Checks"
          value={stats.checks.total}
          change={stats.checks.today}
          changeLabel="heute"
          icon={GlobeAltIcon}
          color="green"
          sparkline={stats.trends?.checks?.length ? stats.trends.checks : [0, 0, 0, 0, 0, 0, stats.checks.total]}
          onClick={() => onNavigate?.("checks")}
        />
        <StatCard
          title="Umsatz"
          value={`€${(stats.revenue.thisMonth / 1000).toFixed(1)}k`}
          change={stats.revenue.deals}
          changeLabel={`${stats.revenue.deals === 1 ? 'Deal' : 'Deals'} abgeschlossen`}
          icon={CurrencyEuroIcon}
          color="orange"
          trend={stats.revenue.thisMonth > 0 ? "up" : undefined}
          sparkline={stats.trends?.revenue?.length ? stats.trends.revenue : [0, 0, 0, 0, 0, 0, stats.revenue.thisMonth]}
          onClick={() => onNavigate?.("invoices")}
        />
        <StatCard
          title="Conversion"
          value={`${stats.leads.conversionRate}%`}
          change={stats.leads.won}
          changeLabel={`von ${stats.leads.total} Leads`}
          icon={ArrowTrendingUpIcon}
          color="purple"
          trend={stats.leads.conversionRate > 50 ? "up" : undefined}
          sparkline={[0, 0, 0, 0, 0, stats.leads.total - stats.leads.won, stats.leads.won]}
          onClick={() => onNavigate?.("vertrieb")}
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pipeline Overview */}
          <GlassCard title="Pipeline Übersicht" icon={FunnelIcon}>
            <div className="grid grid-cols-5 gap-2">
              <PipelineStage
                label="Neu"
                count={stats.leads.new}
                color="blue"
                percentage={stats.leads.total > 0 ? (stats.leads.new / stats.leads.total) * 100 : 0}
                onClick={() => onNavigate?.("vertrieb")}
              />
              <PipelineStage
                label="Kontaktiert"
                count={stats.leads.contacted}
                color="yellow"
                percentage={stats.leads.total > 0 ? (stats.leads.contacted / stats.leads.total) * 100 : 0}
                onClick={() => onNavigate?.("vertrieb")}
              />
              <PipelineStage
                label="Qualifiziert"
                count={stats.leads.qualified}
                color="purple"
                percentage={stats.leads.total > 0 ? (stats.leads.qualified / stats.leads.total) * 100 : 0}
                onClick={() => onNavigate?.("vertrieb")}
              />
              <PipelineStage
                label="Angebot"
                count={stats.leads.proposal || 0}
                color="orange"
                percentage={stats.leads.total > 0 ? ((stats.leads.proposal || 0) / stats.leads.total) * 100 : 0}
                onClick={() => onNavigate?.("vertrieb")}
              />
              <PipelineStage
                label="Gewonnen"
                count={stats.leads.won}
                color="green"
                percentage={stats.leads.total > 0 ? (stats.leads.won / stats.leads.total) * 100 : 0}
                onClick={() => onNavigate?.("vertrieb")}
              />
            </div>
          </GlassCard>

          {/* Recent Leads */}
          <GlassCard
            title="Neueste Leads"
            icon={UsersIcon}
            action={
              <button className="text-xs text-[#FC682C]" onClick={() => onNavigate?.("leads")}>
                Alle anzeigen →
              </button>
            }
          >
            <div className="space-y-3">
              {stats.recentLeads && stats.recentLeads.length > 0 ? (
                stats.recentLeads.map((lead) => (
                  <LeadRow
                    key={lead.id}
                    name={lead.name}
                    email={lead.email}
                    package={lead.packageInterest || "—"}
                    time={formatRelativeTime(lead.createdAt)}
                    priority={lead.priority || "medium"}
                    onClick={() => onNavigate?.("leads")}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-white/40">
                  <UsersIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Noch keine Leads vorhanden</p>
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <GlassCard title="Quick Actions" icon={BoltIcon}>
            <div className="grid grid-cols-2 gap-2">
              <QuickActionButton
                icon={PlusIcon}
                label="Lead anlegen"
                color="blue"
                onClick={() => onNavigate?.("leads")}
              />
              <QuickActionButton
                icon={EnvelopeOpenIcon}
                label="E-Mail senden"
                color="green"
                onClick={() => onNavigate?.("emails")}
              />
              <QuickActionButton
                icon={PhoneIcon}
                label="Anrufen"
                color="purple"
                onClick={() => onNavigate?.("leads")}
              />
              <QuickActionButton
                icon={CalendarIcon}
                label="Termin"
                color="orange"
                onClick={() => onNavigate?.("calendar")}
              />
            </div>
          </GlassCard>

          {/* Top Scores */}
          <GlassCard title="Beste Website-Checks" icon={StarIcon}>
            <div className="space-y-1">
              {topChecks.length > 0 ? (
                topChecks.map((check, i) => (
                  <ScoreRow 
                    key={i} 
                    url={check.url} 
                    score={check.scoreOverall} 
                    onClick={() => onNavigate?.("checks")}
                  />
                ))
              ) : (
                <p className="text-white/40 text-sm text-center py-4">
                  Noch keine Website-Checks vorhanden
                </p>
              )}
            </div>
          </GlassCard>

          {/* Goals */}
          <GlassCard title="Monatsziele" icon={RocketLaunchIcon}>
            <div className="space-y-4">
              <GoalProgress
                label="Leads"
                current={stats.leads.total}
                target={50}
              />
              <GoalProgress
                label="Umsatz"
                current={stats.revenue.thisMonth}
                target={15000}
                prefix="€"
              />
              <GoalProgress
                label="Checks"
                current={stats.checks.total}
                target={100}
              />
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  color,
  trend,
  sparkline,
  onClick,
}: any) {
  const colors: Record<string, string> = {
    blue: "from-blue-500/20 to-blue-600/5 border-blue-500/20",
    green: "from-green-500/20 to-green-600/5 border-green-500/20",
    orange: "from-[#FC682C]/20 to-[#FC682C]/5 border-[#FC682C]/20",
    purple: "from-purple-500/20 to-purple-600/5 border-purple-500/20",
  };
  const iconColors: Record<string, string> = {
    blue: "text-blue-400 bg-blue-500/20",
    green: "text-green-400 bg-green-500/20",
    orange: "text-[#FC682C] bg-[#FC682C]/20",
    purple: "text-purple-400 bg-purple-500/20",
  };

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${colors[color]} border p-5 ${onClick ? 'cursor-pointer hover:scale-[1.02] transition-transform' : ''}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${iconColors[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex items-center gap-1">
          {trend === "up" ? (
            <ArrowTrendingUpIcon className="w-4 h-4 text-green-400" />
          ) : null}
          <span
            className={`text-sm font-medium ${trend === "up" ? "text-green-400" : "text-white/60"}`}
          >
            +{change} {changeLabel}
          </span>
        </div>
      </div>
      <div className="mb-1">
        <h3 className="text-sm text-white/50">{title}</h3>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
      {/* Mini Sparkline */}
      <div className="absolute bottom-0 right-0 w-24 h-12 opacity-30">
        <svg viewBox="0 0 100 40" className="w-full h-full">
          <polyline
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={iconColors[color].split(" ")[0]}
            points={sparkline
              .map((v: number, i: number) => `${i * 16},${40 - v * 0.5}`)
              .join(" ")}
          />
        </svg>
      </div>
    </div>
  );
}

function GlassCard({
  title,
  icon: Icon,
  children,
  action,
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.04]">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-white/40" />
          <h3 className="text-sm font-medium text-white">{title}</h3>
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function PipelineStage({
  label,
  count,
  color,
  percentage,
  onClick,
}: {
  label: string;
  count: number;
  color: string;
  percentage: number;
  onClick?: () => void;
}) {
  const colors: Record<string, string> = {
    blue: "bg-blue-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
    orange: "bg-[#FC682C]",
    green: "bg-green-500",
  };
  return (
    <div className="text-center cursor-pointer hover:scale-105 transition-transform" onClick={onClick}>
      <div className="text-2xl font-bold text-white mb-1">{count}</div>
      <div className="text-[10px] text-white/40 mb-2">{label}</div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full ${colors[color]} rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function LeadRow({ name, email, package: pkg, time, priority, onClick }: any) {
  const priorityColors: Record<string, string> = {
    high: "text-red-400 bg-red-500/20",
    medium: "text-yellow-400 bg-yellow-500/20",
    low: "text-blue-400 bg-blue-500/20",
  };
  return (
    <div onClick={onClick} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FC682C]/20 to-[#9D65C9]/20 flex items-center justify-center text-white font-medium">
          {name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-medium text-white">{name}</p>
          <p className="text-xs text-white/40">{email}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="px-2 py-1 rounded-lg bg-[#FC682C]/20 text-[#FC682C] text-xs">
          {pkg}
        </span>
        <span
          className={`w-2 h-2 rounded-full ${priorityColors[priority].split(" ")[1]}`}
        />
        <span className="text-xs text-white/30">{time}</span>
      </div>
    </div>
  );
}

function QuickActionButton({ icon: Icon, label, color, onClick }: any) {
  const colors: Record<string, string> = {
    blue: "hover:bg-blue-500/10 hover:border-blue-500/30 hover:text-blue-400",
    green:
      "hover:bg-green-500/10 hover:border-green-500/30 hover:text-green-400",
    purple:
      "hover:bg-purple-500/10 hover:border-purple-500/30 hover:text-purple-400",
    orange:
      "hover:bg-[#FC682C]/10 hover:border-[#FC682C]/30 hover:text-[#FC682C]",
  };
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-4 rounded-xl border border-white/[0.06] text-white/50 transition-all cursor-pointer ${colors[color]}`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-xs">{label}</span>
    </button>
  );
}

function ScoreRow({ url, score, onClick }: { url: string; score: number; onClick?: () => void }) {
  const color =
    score >= 80
      ? "text-green-400"
      : score >= 60
        ? "text-yellow-400"
        : "text-red-400";
  const displayUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  return (
    <div 
      className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <GlobeAltIcon className="w-4 h-4 text-white/30" />
        <span className="text-sm text-white/70 truncate max-w-[150px]">{displayUrl}</span>
      </div>
      <span className={`text-lg font-bold ${color}`}>{score}</span>
    </div>
  );
}

function GoalProgress({
  label,
  current,
  target,
  prefix = "",
}: {
  label: string;
  current: number;
  target: number;
  prefix?: string;
}) {
  const percentage = Math.min(100, Math.round((current / target) * 100));
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-white/50">{label}</span>
        <span className="text-white">
          {prefix}
          {current.toLocaleString()} / {prefix}
          {target.toLocaleString()}
        </span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#FC682C] to-[#9D65C9] rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-[#FC682C] border-t-transparent rounded-full animate-spin" />
        <p className="text-white/40 text-sm">Lade Daten...</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
//                    KOMMUNIKATION TAB (EMAIL + NEWSLETTER)
// ═══════════════════════════════════════════════════════════════

function KommunikationTab() {
  const [komView, setKomView] = useState<"emails" | "empfaenger">("emails");
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Kommunikation</h2>
        <div className="flex items-center gap-1 bg-white/[0.06] rounded-lg p-1">
          <button
            onClick={() => setKomView("emails")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              komView === "emails" ? "bg-[#FC682C] text-white shadow-lg" : "text-white/50 hover:text-white"
            }`}
          >
            E-Mails
          </button>
          <button
            onClick={() => setKomView("empfaenger")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              komView === "empfaenger" ? "bg-[#FC682C] text-white shadow-lg" : "text-white/50 hover:text-white"
            }`}
          >
            Empfänger
          </button>
        </div>
      </div>
      {komView === "emails" ? <EmailCenterTab /> : <SubscribersTab />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    DOKUMENTE TAB (RECHNUNGEN + VEREINBARUNGEN)
// ═══════════════════════════════════════════════════════════════

function DokumenteTab() {
  const [docView, setDocView] = useState<"rechnungen" | "vereinbarungen">("rechnungen");
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Dokumente</h2>
        <div className="flex items-center gap-1 bg-white/[0.06] rounded-lg p-1">
          <button
            onClick={() => setDocView("rechnungen")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              docView === "rechnungen"
                ? "bg-[#FC682C] text-white shadow-lg"
                : "text-white/50 hover:text-white"
            }`}
          >
            Rechnungen
          </button>
          <button
            onClick={() => setDocView("vereinbarungen")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              docView === "vereinbarungen"
                ? "bg-[#FC682C] text-white shadow-lg"
                : "text-white/50 hover:text-white"
            }`}
          >
            Vereinbarungen
          </button>
        </div>
      </div>
      {docView === "rechnungen" ? <InvoiceManager /> : <AgreementManager />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    VERTRIEB TAB (PIPELINE + LEADS MERGED)
// ═══════════════════════════════════════════════════════════════

function VertriebTab() {
  const [vertriebView, setVertriebView] = useState<"kanban" | "tabelle">("kanban");
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Vertrieb</h2>
        <div className="flex items-center gap-1 bg-white/[0.06] rounded-lg p-1">
          <button
            onClick={() => setVertriebView("kanban")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              vertriebView === "kanban"
                ? "bg-[#FC682C] text-white shadow-lg"
                : "text-white/50 hover:text-white"
            }`}
          >
            Kanban
          </button>
          <button
            onClick={() => setVertriebView("tabelle")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              vertriebView === "tabelle"
                ? "bg-[#FC682C] text-white shadow-lg"
                : "text-white/50 hover:text-white"
            }`}
          >
            Tabelle
          </button>
        </div>
      </div>
      {vertriebView === "kanban" ? <PipelineTab /> : <LeadsTab />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    PIPELINE TAB (KANBAN)
// ═══════════════════════════════════════════════════════════════

function PipelineTab() {
  const [view, setView] = useState<PipelineView>("kanban");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    fetch("/api/leads", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        setLeads(unwrapApiResponse<{leads: Lead[]}>(data).leads || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const stages = [
    { id: "new", label: "Neu", color: "blue", icon: SparklesIcon },
    { id: "contacted", label: "Kontaktiert", color: "yellow", icon: PhoneIcon },
    {
      id: "qualified",
      label: "Qualifiziert",
      color: "purple",
      icon: CheckCircleIcon,
    },
    {
      id: "proposal",
      label: "Angebot",
      color: "orange",
      icon: DocumentTextIcon,
    },
    { id: "won", label: "Gewonnen", color: "green", icon: StarIcon },
  ];

  const updateStatus = async (id: number, status: string) => {
    await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
      credentials: "include",
    });
    setLeads(leads.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  if (loading) return <LoadingState />;

  return (
    <>
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 p-1 bg-white/[0.04] rounded-xl">
          <button
            onClick={() => setView("kanban")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${view === "kanban" ? "bg-white/10 text-white" : "text-white/50"}`}
          >
            <Squares2X2Icon className="w-4 h-4" /> Kanban
          </button>
          <button
            onClick={() => setView("list")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${view === "list" ? "bg-white/10 text-white" : "text-white/50"}`}
          >
            <ListBulletIcon className="w-4 h-4" /> Liste
          </button>
        </div>
        <button
          onClick={() => setShowNewLeadModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#FC682C] text-white rounded-xl text-sm font-medium hover:bg-[#FC682C]/90 transition-colors"
        >
          <PlusIcon className="w-4 h-4" /> Neuer Lead
        </button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-5 gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const stageLeads = leads.filter((l) => l.status === stage.id);
          const Icon = stage.icon;
          const stageColors: Record<string, string> = {
            blue: "border-blue-500/30 bg-blue-500/5",
            yellow: "border-yellow-500/30 bg-yellow-500/5",
            purple: "border-purple-500/30 bg-purple-500/5",
            orange: "border-[#FC682C]/30 bg-[#FC682C]/5",
            green: "border-green-500/30 bg-green-500/5",
          };
          const headerColors: Record<string, string> = {
            blue: "text-blue-400",
            yellow: "text-yellow-400",
            purple: "text-purple-400",
            orange: "text-[#FC682C]",
            green: "text-green-400",
          };

          return (
            <div
              key={stage.id}
              className={`min-w-[280px] rounded-2xl border ${stageColors[stage.color]} p-4`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${headerColors[stage.color]}`} />
                  <h3
                    className={`text-sm font-semibold ${headerColors[stage.color]}`}
                  >
                    {stage.label}
                  </h3>
                </div>
                <span className="px-2 py-0.5 bg-white/10 rounded-full text-xs text-white/60">
                  {stageLeads.length}
                </span>
              </div>
              <div className="space-y-3">
                {stageLeads.map((lead) => (
                  <KanbanCard key={lead.id} lead={lead} onMove={updateStatus} onClick={() => setSelectedLead(lead)} />
                ))}
                {stageLeads.length === 0 && (
                  <div className="py-8 text-center text-white/20 text-sm border-2 border-dashed border-white/10 rounded-xl">
                    Keine Leads
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
    {showNewLeadModal && (
      <NewLeadModal
        onClose={() => setShowNewLeadModal(false)}
        onCreated={() => {
          fetch("/api/leads", { credentials: "include" })
            .then((r) => r.json())
            .then((data) => setLeads(unwrapApiResponse<{leads: Lead[]}>(data).leads || []));
          setShowNewLeadModal(false);
        }}
      />
    )}
    {selectedLead && (
      <LeadModal 
        lead={selectedLead} 
        onClose={() => setSelectedLead(null)} 
        onRefresh={() => {
          fetch("/api/leads", { credentials: "include" })
            .then((r) => r.json())
            .then((data) => setLeads(unwrapApiResponse<{leads: Lead[]}>(data).leads || []));
        }}
      />
    )}
    </>
  );
}

function KanbanCard({
  lead,
  onMove,
  onClick,
}: {
  lead: Lead;
  onMove: (id: number, status: string) => void;
  onClick?: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div 
      onClick={(e) => { if (!showMenu) onClick?.(); }}
      className={`relative p-4 bg-[#0f0f12] border border-white/[0.06] rounded-xl hover:border-white/[0.15] hover:bg-white/[0.02] transition-all cursor-pointer group ${lead.priority === 'high' ? 'ring-2 ring-red-500/20' : ''}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FC682C]/40 to-[#9D65C9]/40 flex items-center justify-center text-white text-sm font-semibold shadow-lg">
            {lead.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-medium text-white">{lead.name}</p>
              {lead.email && <CheckBadgeIcon className="w-3.5 h-3.5 text-blue-400" />}
            </div>
            <p className="text-[11px] text-white/40 truncate max-w-[140px]">
              {lead.company || lead.email}
            </p>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
          className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/10 rounded-lg transition-all"
        >
          <EllipsisVerticalIcon className="w-4 h-4 text-white/50" />
        </button>
      </div>

      {/* Package & Budget */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {lead.packageInterest && (
          <span className="px-2.5 py-1 bg-[#FC682C]/20 text-[#FC682C] rounded-lg text-xs font-medium">
            {lead.packageInterest}
          </span>
        )}
        {lead.budget && Number(lead.budget) > 0 && (
          <span className="flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-400 rounded-lg text-xs">
            <CurrencyEuroIcon className="w-3 h-3" />
            {Number(lead.budget).toLocaleString('de-DE')}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-[11px] text-white/30">
        <span>{formatDate(lead.createdAt)}</span>
        <div className="flex items-center gap-2">
          {lead.priority === "high" && <FireSolid className="w-4 h-4 text-red-400" />}
          {lead.source && <span className="px-1.5 py-0.5 bg-white/5 rounded text-[10px]">{lead.source}</span>}
        </div>
      </div>

      {/* Quick Actions on Hover */}
      <div className="absolute bottom-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {lead.phone && (
          <a href={`tel:${lead.phone}`} onClick={(e) => e.stopPropagation()} className="p-1.5 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors">
            <PhoneIcon className="w-3 h-3 text-green-400" />
          </a>
        )}
        {lead.email && (
          <a href={`mailto:${lead.email}`} onClick={(e) => e.stopPropagation()} className="p-1.5 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors">
            <EnvelopeIcon className="w-3 h-3 text-blue-400" />
          </a>
        )}
      </div>

      {/* Quick Move Menu */}
      {showMenu && (
        <div className="absolute right-0 top-10 z-20 w-44 py-2 bg-[#1a1a1f] border border-white/10 rounded-xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="px-3 py-1.5 text-[10px] uppercase text-white/30 font-medium">Status ändern</div>
          {[
            { id: "new", label: "Neu", color: "text-blue-400" },
            { id: "contacted", label: "Kontaktiert", color: "text-yellow-400" },
            { id: "qualified", label: "Qualifiziert", color: "text-purple-400" },
            { id: "proposal", label: "Angebot", color: "text-[#FC682C]" },
            { id: "won", label: "Gewonnen", color: "text-green-400" },
          ].map((status) => (
            <button
              key={status.id}
              onClick={() => { onMove(lead.id, status.id); setShowMenu(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-white/5 transition-colors ${lead.status === status.id ? 'bg-white/5 text-white' : 'text-white/70'}`}
            >
              <span className={`w-2 h-2 rounded-full ${status.color.replace('text-', 'bg-')}`} />
              {status.label}
              {lead.status === status.id && <CheckIcon className="w-3 h-3 ml-auto text-green-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    LEADS TAB
// ═══════════════════════════════════════════════════════════════

function LeadsTab() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const fetchLeads = useCallback(() => {
    fetch("/api/leads", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        setLeads(unwrapApiResponse<{leads: Lead[]}>(data).leads || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const filtered = leads.filter((l) => {
    const matchSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      (l.company?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchStatus = statusFilter === "all" || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const toggleSelect = (id: number) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((l) => l.id)));
    }
  };

  const exportToCSV = () => {
    const data = filtered.filter(
      (l) => selectedIds.size === 0 || selectedIds.has(l.id),
    );
    const csv = [
      [
        "Name",
        "E-Mail",
        "Telefon",
        "Firma",
        "Paket",
        "Budget",
        "Status",
        "Erstellt",
      ],
      ...data.map((l) => [
        l.name,
        l.email,
        l.phone || "",
        l.company || "",
        l.packageInterest || "",
        l.budget || "",
        l.status,
        new Date(l.createdAt).toLocaleDateString("de-DE"),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const bulkUpdateStatus = async (status: string) => {
    for (const id of Array.from(selectedIds)) {
      await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
        credentials: "include",
      });
    }
    setLeads(leads.map((l) => (selectedIds.has(l.id) ? { ...l, status } : l)));
    setSelectedIds(new Set());
  };

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-3 justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              type="text"
              placeholder="Suchen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/[0.04] border border-white/[0.06] rounded-xl text-white placeholder:text-white/30 focus:border-[#FC682C]/50 outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-white/[0.04] border border-white/[0.06] rounded-xl text-white text-sm focus:border-[#FC682C]/50 outline-none cursor-pointer"
          >
            <option value="all">Alle Status</option>
            <option value="new">Neu</option>
            <option value="contacted">Kontaktiert</option>
            <option value="qualified">Qualifiziert</option>
            <option value="proposal">Angebot</option>
            <option value="won">Gewonnen</option>
            <option value="lost">Verloren</option>
          </select>
        </div>
        <div className="flex gap-2">
          {selectedIds.size > 0 && (
            <div className="flex gap-2">
              <select
                onChange={(e) => {
                  if (e.target.value) bulkUpdateStatus(e.target.value);
                  e.target.value = "";
                }}
                className="px-3 py-2 bg-white/[0.04] border border-white/[0.06] rounded-xl text-white text-sm"
                defaultValue=""
              >
                <option value="" disabled>
                  Status ändern ({selectedIds.size})
                </option>
                <option value="contacted">→ Kontaktiert</option>
                <option value="qualified">→ Qualifiziert</option>
                <option value="proposal">→ Angebot</option>
                <option value="won">→ Gewonnen</option>
                <option value="lost">→ Verloren</option>
              </select>
            </div>
          )}
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors flex items-center gap-2"
          >
            <ArrowDownTrayIcon className="w-4 h-4" /> Export{" "}
            {selectedIds.size > 0 && `(${selectedIds.size})`}
          </button>
          <button
            onClick={() => setShowNewLeadModal(true)}
            className="px-4 py-2 bg-[#FC682C] text-white rounded-xl font-medium hover:bg-[#FC682C]/90 transition-colors flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" /> Neuer Lead
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="px-4 py-4 w-12">
                <input
                  type="checkbox"
                  checked={
                    filtered.length > 0 && selectedIds.size === filtered.length
                  }
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 checked:bg-[#FC682C] checked:border-[#FC682C]"
                />
              </th>
              <th className="px-5 py-4 text-left text-xs font-medium text-white/40 uppercase">
                Lead
              </th>
              <th className="px-5 py-4 text-left text-xs font-medium text-white/40 uppercase">
                Kontakt
              </th>
              <th className="px-5 py-4 text-left text-xs font-medium text-white/40 uppercase">
                Paket
              </th>
              <th className="px-5 py-4 text-left text-xs font-medium text-white/40 uppercase">
                Status
              </th>
              <th className="px-5 py-4 text-left text-xs font-medium text-white/40 uppercase">
                Erstellt
              </th>
              <th className="px-5 py-4 w-12"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center">
                  <UsersIcon className="w-12 h-12 text-white/10 mx-auto mb-3" />
                  <p className="text-white/40">Keine Leads gefunden</p>
                </td>
              </tr>
            ) : (
              filtered.map((lead) => (
                <tr
                  key={lead.id}
                  className={`border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors ${selectedIds.has(lead.id) ? "bg-[#FC682C]/5" : ""}`}
                >
                  <td
                    className="px-4 py-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.has(lead.id)}
                      onChange={() => toggleSelect(lead.id)}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 checked:bg-[#FC682C] checked:border-[#FC682C]"
                    />
                  </td>
                  <td
                    className="px-5 py-4 cursor-pointer"
                    onClick={() => setSelectedLead(lead)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FC682C]/20 to-[#9D65C9]/20 flex items-center justify-center text-white font-medium">
                        {lead.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {lead.name}
                        </p>
                        <p className="text-xs text-white/40">
                          {lead.company || "-"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td
                    className="px-5 py-4 cursor-pointer"
                    onClick={() => setSelectedLead(lead)}
                  >
                    <p className="text-sm text-white/70">{lead.email}</p>
                    <p className="text-xs text-white/40">{lead.phone || "-"}</p>
                  </td>
                  <td
                    className="px-5 py-4 cursor-pointer"
                    onClick={() => setSelectedLead(lead)}
                  >
                    {lead.packageInterest ? (
                      <span className="px-2.5 py-1 bg-[#FC682C]/20 text-[#FC682C] rounded-lg text-xs font-medium">
                        {lead.packageInterest}
                      </span>
                    ) : (
                      <span className="text-white/30">-</span>
                    )}
                  </td>
                  <td
                    className="px-5 py-4 cursor-pointer"
                    onClick={() => setSelectedLead(lead)}
                  >
                    <StatusBadge status={lead.status} />
                  </td>
                  <td
                    className="px-5 py-4 text-sm text-white/40 cursor-pointer"
                    onClick={() => setSelectedLead(lead)}
                  >
                    {formatDate(lead.createdAt)}
                  </td>
                  <td className="px-5 py-4">
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <ChevronRightIcon className="w-4 h-4 text-white/40" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] text-sm">
          <span className="text-white/40">
            {filtered.length} Leads angezeigt{" "}
            {selectedIds.size > 0 && `• ${selectedIds.size} ausgewählt`}
          </span>
          <span className="text-white/30">
            {leads.filter((l) => l.status === "new").length} neue,{" "}
            {leads.filter((l) => l.status === "won").length} gewonnen
          </span>
        </div>
      )}

      {selectedLead && (
        <LeadModal lead={selectedLead} onClose={() => setSelectedLead(null)} onRefresh={fetchLeads} />
      )}
      {showNewLeadModal && (
        <NewLeadModal
          onClose={() => setShowNewLeadModal(false)}
          onCreated={fetchLeads}
        />
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    new: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    contacted: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    qualified: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    proposal: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    won: "bg-green-500/20 text-green-400 border-green-500/30",
    lost: "bg-red-500/20 text-red-400 border-red-500/30",
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${styles[status] || styles.new}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function LeadModal({ lead, onClose, onRefresh }: { lead: Lead; onClose: () => void; onRefresh?: () => void }) {
  const [status, setStatus] = useState(lead.status);
  const [notes, setNotes] = useState(lead.notes || "");
  const [activeTab, setActiveTab] = useState<"details" | "activity">("details");
  const [converting, setConverting] = useState(false);
  const [convertResult, setConvertResult] = useState<string | null>(null);

  const save = async () => {
    await fetch(`/api/leads/${lead.id}`, { credentials: "include",
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, notes }),
    });
    onClose();
  };

  const deleteLead = async () => {
    if (confirm("Möchtest du diesen Lead wirklich löschen?")) {
      await fetch(`/api/leads/${lead.id}`, { credentials: "include", method: "DELETE" });
      onClose();
    }
  };

  const convertToClient = async () => {
    if (!confirm(`Lead "${lead.name}" zu Portal-Client konvertieren?`)) return;
    setConverting(true);
    try {
      const res = await fetch(`/api/leads/${lead.id}/convert`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setConvertResult(`✅ Client erstellt! Zugangscode: ${data.client.accessCode}`);
        setStatus("won");
        onRefresh?.();
      } else {
        setConvertResult(`❌ ${data.error || "Fehler beim Konvertieren"}`);
      }
    } catch {
      setConvertResult("❌ Verbindungsfehler");
    }
    setConverting(false);
  };

  const activities = [
    { type: "created", text: "Lead erstellt", date: lead.createdAt },
    { type: "status", text: `Status: "${status}"`, date: lead.updatedAt },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-[#0f0f12] border border-white/[0.08] rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FC682C] to-[#9D65C9] flex items-center justify-center text-white text-lg font-bold">
              {lead.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-white">
                  {lead.name}
                </h3>
                {lead.priority === "high" && (
                  <FireSolid className="w-4 h-4 text-red-400" />
                )}
              </div>
              <p className="text-sm text-white/50">{lead.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={status} />
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl"
            >
              <XMarkIcon className="w-5 h-5 text-white/60" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/[0.06]">
          <button
            onClick={() => setActiveTab("details")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === "details" ? "text-[#FC682C] border-b-2 border-[#FC682C]" : "text-white/50 hover:text-white"}`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === "activity" ? "text-[#FC682C] border-b-2 border-[#FC682C]" : "text-white/50 hover:text-white"}`}
          >
            Aktivitäten
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {activeTab === "details" ? (
            <>
              {/* Quick Actions - Telegram & Phone */}
              <div className="flex gap-2">
                <a
                  href={
                    lead.phone?.startsWith("@")
                      ? `https://t.me/${lead.phone.slice(1)}`
                      : `https://t.me/${lead.phone || ""}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#FC682C] text-white rounded-xl font-medium hover:bg-[#FC682C]/90 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.696.064-1.225-.46-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                  Telegram
                </a>
                <a
                  href={`tel:${lead.phone}`}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors"
                >
                  <PhoneIcon className="w-4 h-4" /> Anrufen
                </a>
                <a
                  href={`https://wa.me/${lead.phone?.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500/20 text-green-400 rounded-xl font-medium hover:bg-green-500/30 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <InfoBox label="Firma" value={lead.company || "-"} />
                <InfoBox label="Telefon" value={lead.phone || "-"} />
                <InfoBox label="Paket" value={lead.packageInterest || "-"} />
                <InfoBox label="Budget" value={lead.budget || "-"} />
                <InfoBox label="Quelle" value={lead.source || "Website"} />
                <InfoBox label="Erstellt" value={formatDate(lead.createdAt)} />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs text-white/40 mb-2">
                  Nachricht
                </label>
                <div className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white/70 whitespace-pre-wrap">
                  {lead.message || "Keine Nachricht"}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs text-white/40 mb-2">
                  Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "new",
                    "contacted",
                    "qualified",
                    "proposal",
                    "won",
                    "lost",
                  ].map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(s)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${status === s ? "bg-[#FC682C] text-white" : "bg-white/[0.04] text-white/50 hover:bg-white/[0.08]"}`}
                    >
                      {s === "new"
                        ? "Neu"
                        : s === "contacted"
                          ? "Kontaktiert"
                          : s === "qualified"
                            ? "Qualifiziert"
                            : s === "proposal"
                              ? "Angebot"
                              : s === "won"
                                ? "Gewonnen"
                                : "Verloren"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs text-white/40 mb-2">
                  Interne Notizen
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notizen hinzufügen..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white placeholder:text-white/30 focus:border-[#FC682C]/50 outline-none resize-none"
                />
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="relative pl-6 border-l-2 border-white/10 space-y-6">
                {activities.map((activity, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-[#0f0f12] border-2 border-white/20 flex items-center justify-center">
                      <div
                        className={`w-2 h-2 rounded-full ${activity.type === "email" ? "bg-blue-400" : activity.type === "status" ? "bg-[#FC682C]" : "bg-green-400"}`}
                      />
                    </div>
                    <div className="pb-4">
                      <p className="text-sm text-white">{activity.text}</p>
                      <p className="text-xs text-white/40">
                        {formatDateTime(activity.date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Convert Result */}
        {convertResult && (
          <div className={`mx-6 mb-4 px-4 py-3 rounded-xl text-sm font-medium ${
            convertResult.startsWith("✅") ? "bg-green-500/10 border border-green-500/20 text-green-400" : "bg-red-500/10 border border-red-500/20 text-red-400"
          }`}>
            {convertResult}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.06] bg-white/[0.02]">
          <button
            onClick={deleteLead}
            className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1"
          >
            <TrashIcon className="w-4 h-4" /> Löschen
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-white/60 hover:text-white"
            >
              Abbrechen
            </button>
            {lead.status !== "converted" && (
              <button
                onClick={convertToClient}
                disabled={converting}
                className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
              >
                {converting ? "Konvertiere..." : "→ Portal-Client"}
              </button>
            )}
            <button
              onClick={save}
              className="px-6 py-2 bg-[#FC682C] text-white rounded-xl font-medium hover:bg-[#FC682C]/90"
            >
              Speichern
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("de-DE");
}

function formatDateTime(dateStr: string): string {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleString("de-DE");
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 bg-white/[0.03] border border-white/[0.04] rounded-xl">
      <p className="text-[10px] text-white/40 uppercase mb-1">{label}</p>
      <p className="text-sm text-white">{value}</p>
    </div>
  );
}

function EmailTemplateModal({
  lead,
  onClose,
}: {
  lead: Lead;
  onClose: () => void;
}) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [customSubject, setCustomSubject] = useState("");
  const [customBody, setCustomBody] = useState("");

  const sendTelegram = () => {
    const phone = lead.phone?.replace(/[^0-9]/g, "");
    if (phone) {
      window.open(`https://t.me/${phone}`, "_blank");
    }
  };

  const templates = [
    {
      id: "welcome",
      name: "Willkommen",
      icon: SparklesIcon,
      message: `Hallo ${lead.name.split(" ")[0]},\n\nvielen Dank für dein Interesse an AgentFlow!\n\nIch melde mich in Kürze bei dir.`,
    },
    {
      id: "followup",
      name: "Follow-up",
      icon: ClockIcon,
      message: `Hallo ${lead.name.split(" ")[0]},\n\nwie geht es deinem Projekt?`,
    },
    {
      id: "proposal",
      name: "Angebot",
      icon: DocumentTextIcon,
      message: `Hallo ${lead.name.split(" ")[0]},\n\nhier ist dein Angebot für ${lead.packageInterest || "dein Projekt"}.`,
    },
  ];

  const activeTemplate = selectedTemplate
    ? templates.find((t) => t.id === selectedTemplate)
    : null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#0f0f12] border border-white/[0.08] rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06] bg-gradient-to-r from-[#FC682C]/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#FC682C]/20">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.696.064-1.225-.46-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Nachricht an {lead.name}
              </h3>
              <p className="text-xs text-white/40">{lead.phone}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl"
          >
            <XMarkIcon className="w-5 h-5 text-white/60" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Template Selection */}
          <div>
            <label className="block text-xs text-white/40 mb-3">
              Telegram Vorlage wählen
            </label>
            <div className="grid grid-cols-2 gap-3">
              {templates.map((template) => {
                const Icon = template.icon;
                return (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`p-4 rounded-xl border text-center transition-all ${
                      selectedTemplate === template.id
                        ? "bg-[#FC682C]/20 border-[#FC682C]/50 text-[#FC682C]"
                        : "bg-white/[0.02] border-white/[0.06] text-white/60 hover:border-white/20"
                    }`}
                  >
                    <Icon className="w-6 h-6 mx-auto mb-2" />
                    <span className="text-sm font-medium">{template.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preview */}
          {activeTemplate && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-white/40 mb-2">
                  Vorschau
                </label>
                <div className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white/70 whitespace-pre-wrap">
                  {activeTemplate.message}
                </div>
              </div>
            </div>
          )}

          {/* Custom Message */}
          <div>
            <label className="block text-xs text-white/40 mb-2">
              Eigene Nachricht
            </label>
            <textarea
              value={customBody}
              onChange={(e) => setCustomBody(e.target.value)}
              placeholder="Nachricht eingeben..."
              rows={4}
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white placeholder:text-white/30 focus:border-[#FC682C]/50 outline-none resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-white/[0.06] bg-white/[0.02]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white/60 hover:text-white"
          >
            Abbrechen
          </button>
          <button
            onClick={sendTelegram}
            className="px-6 py-2 bg-[#FC682C] text-white rounded-xl font-medium hover:bg-[#FC682C]/90 flex items-center gap-2"
          >
            Telegram öffnen
          </button>
        </div>
      </div>
    </div>
  );
}

function EmailModal({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [customSubject, setCustomSubject] = useState("");
  const [customBody, setCustomBody] = useState("");

  const templates = [
    {
      id: "welcome",
      name: "Willkommen",
      icon: SparklesIcon,
      subject: `Willkommen bei AgentFlow, ${lead.name.split(" ")[0]}!`,
      body: `Hallo ${lead.name.split(" ")[0]},\n\nvielen Dank für dein Interesse an unseren Webentwicklungs-Services!\n\nIch habe deine Anfrage erhalten und werde mich in Kürze bei dir melden, um dein Projekt zu besprechen.\n\nIn der Zwischenzeit kannst du dir gerne unsere Referenzen ansehen.\n\nBeste Grüße,\nDein AgentFlow Team`,
    },
    {
      id: "followup",
      name: "Follow-up",
      icon: ClockIcon,
      subject: `Kurze Nachfrage zu deinem Webprojekt`,
      body: `Hallo ${lead.name.split(" ")[0]},\n\nich hoffe, es geht dir gut!\n\nIch wollte kurz nachfragen, ob du noch Interesse an unserem Angebot für ${lead.packageInterest || "dein Webprojekt"} hast.\n\nHast du noch Fragen oder kann ich dir weitere Informationen zusenden?\n\nBeste Grüße,\nDein AgentFlow Team`,
    },
    {
      id: "proposal",
      name: "Angebot",
      icon: DocumentTextIcon,
      subject: `Dein individuelles Angebot von AgentFlow`,
      body: `Hallo ${lead.name.split(" ")[0]},\n\nwie besprochen, findest du anbei dein individuelles Angebot für ${lead.packageInterest || "dein Webprojekt"}.\n\nDas Angebot beinhaltet:\n• Modernes, responsives Design\n• SEO-Optimierung\n• Performance-Optimierung\n• 30 Tage Support nach Launch\n\nBei Fragen stehe ich dir jederzeit zur Verfügung.\n\nBeste Grüße,\nDein AgentFlow Team`,
    },
    {
      id: "closing",
      name: "Abschluss",
      icon: CheckCircleIcon,
      subject: `Willkommen als Kunde bei AgentFlow!`,
      body: `Hallo ${lead.name.split(" ")[0]},\n\nich freue mich sehr, dass wir zusammenarbeiten werden!\n\nDie nächsten Schritte:\n1. Kickoff-Call terminieren\n2. Inhalte und Materialien sammeln\n3. Design-Entwurf erstellen\n\nIch melde mich in Kürze mit Terminvorschlägen.\n\nBeste Grüße,\nDein AgentFlow Team`,
    },
  ];

  const activeTemplate = selectedTemplate
    ? templates.find((t) => t.id === selectedTemplate)
    : null;

  const sendEmail = () => {
    const subject = encodeURIComponent(
      activeTemplate?.subject || customSubject,
    );
    const body = encodeURIComponent(activeTemplate?.body || customBody);
    window.open(`mailto:${lead.email}?subject=${subject}&body=${body}`);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#0f0f12] border border-white/[0.08] rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06] bg-gradient-to-r from-[#FC682C]/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#FC682C]/20">
              <EnvelopeOpenIcon className="w-5 h-5 text-[#FC682C]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                E-Mail an {lead.name}
              </h3>
              <p className="text-xs text-white/40">{lead.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl"
          >
            <XMarkIcon className="w-5 h-5 text-white/60" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Template Selection */}
          <div>
            <label className="block text-xs text-white/40 mb-3">
              Vorlage wählen
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {templates.map((template) => {
                const Icon = template.icon;
                return (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`p-4 rounded-xl border text-center transition-all ${
                      selectedTemplate === template.id
                        ? "bg-[#FC682C]/20 border-[#FC682C]/50 text-[#FC682C]"
                        : "bg-white/[0.02] border-white/[0.06] text-white/60 hover:border-white/20"
                    }`}
                  >
                    <Icon className="w-6 h-6 mx-auto mb-2" />
                    <span className="text-sm font-medium">{template.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preview or Custom */}
          {activeTemplate ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-white/40 mb-2">
                  Betreff
                </label>
                <div className="p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white">
                  {activeTemplate.subject}
                </div>
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-2">
                  Nachricht
                </label>
                <div className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white/70 whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {activeTemplate.body}
                </div>
              </div>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="text-xs text-white/40 hover:text-white"
              >
                Eigene Nachricht schreiben →
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-white/40 mb-2">
                  Betreff
                </label>
                <input
                  type="text"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder="Betreff eingeben..."
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white placeholder:text-white/30 focus:border-[#FC682C]/50 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-2">
                  Nachricht
                </label>
                <textarea
                  value={customBody}
                  onChange={(e) => setCustomBody(e.target.value)}
                  placeholder="Nachricht eingeben..."
                  rows={6}
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white placeholder:text-white/30 focus:border-[#FC682C]/50 outline-none resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-white/[0.06] bg-white/[0.02]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white/60 hover:text-white"
          >
            Abbrechen
          </button>
          <button
            onClick={sendEmail}
            disabled={!activeTemplate && (!customSubject || !customBody)}
            className="px-6 py-2 bg-[#FC682C] text-white rounded-xl font-medium hover:bg-[#FC682C]/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <PaperAirplaneIcon className="w-4 h-4" /> E-Mail öffnen
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    OTHER TABS (Simplified)
// ═══════════════════════════════════════════════════════════════

function ChecksTab() {
  const [checks, setChecks] = useState<WebsiteCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCheck, setSelectedCheck] = useState<WebsiteCheck | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"date" | "score">("date");

  useEffect(() => {
    fetch("/api/checks", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        const unwrapped = unwrapApiResponse<{checks: WebsiteCheck[]}>(data);
        const checksList = Array.isArray(unwrapped.checks) ? unwrapped.checks : [];
        setChecks(checksList);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const sortedChecks = [...checks]
    .filter((c) => {
      // Filter out invalid dates
      const date = new Date(c.createdAt);
      return !isNaN(date.getTime());
    })
    .sort((a, b) => {
      if (sortBy === "score") return b.scoreOverall - a.scoreOverall;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const avgScore =
    checks.length > 0 &&
    checks.filter((c) => !isNaN(new Date(c.createdAt).getTime())).length > 0
      ? Math.round(
          checks
            .filter((c) => !isNaN(new Date(c.createdAt).getTime()))
            .reduce((sum, c) => sum + c.scoreOverall, 0) /
            checks.filter((c) => !isNaN(new Date(c.createdAt).getTime()))
              .length,
        )
      : 0;
  const topScore =
    checks.length > 0 ? Math.max(...checks.map((c) => c.scoreOverall)) : 0;
  const lowScore =
    checks.length > 0 ? Math.min(...checks.map((c) => c.scoreOverall)) : 0;

  const exportChecksToCSV = () => {
    const rows = [
      ["URL", "Score", "Performance", "SEO", "Accessibility", "Datum"],
      ...sortedChecks.map((c) => [
        c.url, c.scoreOverall, c.scorePerformance, c.scoreSeo, c.scoreAccessibility,
        new Date(c.createdAt).toLocaleDateString("de-DE"),
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "website-checks.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/5 border border-blue-500/20">
          <div className="flex items-center gap-2 mb-2">
            <GlobeAltIcon className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-white/50">Gesamt</span>
          </div>
          <p className="text-3xl font-bold text-white">{checks.length}</p>
        </div>
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FC682C]/20 to-[#FC682C]/5 border border-[#FC682C]/20">
          <div className="flex items-center gap-2 mb-2">
            <ChartBarIcon className="w-5 h-5 text-[#FC682C]" />
            <span className="text-sm text-white/50">Durchschnitt</span>
          </div>
          <p className="text-3xl font-bold text-white">{avgScore}</p>
        </div>
        <div className="p-5 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/5 border border-green-500/20">
          <div className="flex items-center gap-2 mb-2">
            <ArrowTrendingUpIcon className="w-5 h-5 text-green-400" />
            <span className="text-sm text-white/50">Beste</span>
          </div>
          <p className="text-3xl font-bold text-white">{topScore}</p>
        </div>
        <div className="p-5 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/5 border border-red-500/20">
          <div className="flex items-center gap-2 mb-2">
            <ArrowTrendingDownIcon className="w-5 h-5 text-red-400" />
            <span className="text-sm text-white/50">Schlechteste</span>
          </div>
          <p className="text-3xl font-bold text-white">{lowScore}</p>
        </div>
        <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/5 border border-purple-500/20">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheckIcon className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-white/50">HTTPS</span>
          </div>
          <p className="text-3xl font-bold text-white">
            {checks.filter((c) => c.httpsEnabled).length}
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex items-center gap-2 p-1 bg-white/[0.04] rounded-xl">
          <button
            onClick={() => setView("grid")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${view === "grid" ? "bg-white/10 text-white" : "text-white/50"}`}
          >
            <Squares2X2Icon className="w-4 h-4" /> Grid
          </button>
          <button
            onClick={() => setView("list")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${view === "list" ? "bg-white/10 text-white" : "text-white/50"}`}
          >
            <ListBulletIcon className="w-4 h-4" /> Liste
          </button>
        </div>
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "date" | "score")}
            className="px-4 py-2 bg-white/[0.04] border border-white/[0.06] rounded-xl text-white text-sm focus:border-[#FC682C]/50 outline-none cursor-pointer"
          >
            <option value="date">Neueste zuerst</option>
            <option value="score">Beste zuerst</option>
          </select>
          <button
            onClick={exportChecksToCSV}
            className="px-4 py-2 bg-[#FC682C] text-white rounded-xl text-sm font-medium hover:bg-[#FC682C]/90 flex items-center gap-2"
          >
            <ArrowDownTrayIcon className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Grid View */}
      {view === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedChecks.map((check) => (
            <div
              key={check.id}
              onClick={() => setSelectedCheck(check)}
              className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${check.httpsEnabled ? "bg-green-500/20" : "bg-red-500/20"}`}
                  >
                    {check.httpsEnabled ? (
                      <ShieldCheckIcon className="w-4 h-4 text-green-400" />
                    ) : (
                      <ExclamationCircleIcon className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                  <span className="text-sm text-white/70 truncate">
                    {check.url.replace(/^https?:\/\//, "")}
                  </span>
                </div>
                <ChevronRightIcon className="w-4 h-4 text-white/20 group-hover:text-white/40 transition-colors" />
              </div>

              {/* Score Circle */}
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-white/10"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={251.2}
                      strokeDashoffset={
                        251.2 - (251.2 * check.scoreOverall) / 100
                      }
                      strokeLinecap="round"
                      className={
                        check.scoreOverall >= 70
                          ? "text-green-400"
                          : check.scoreOverall >= 40
                            ? "text-yellow-400"
                            : "text-red-400"
                      }
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className={`text-2xl font-bold ${check.scoreOverall >= 70 ? "text-green-400" : check.scoreOverall >= 40 ? "text-yellow-400" : "text-red-400"}`}
                    >
                      {check.scoreOverall}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mini Stats */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-lg bg-white/[0.03]">
                  <p className="text-[10px] text-white/40">SEO</p>
                  <p className="text-sm font-medium text-white">
                    {check.scoreSeo}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-white/[0.03]">
                  <p className="text-[10px] text-white/40">Sicherheit</p>
                  <p className="text-sm font-medium text-white">
                    {check.scoreSecurity}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-white/[0.03]">
                  <p className="text-[10px] text-white/40">Speed</p>
                  <p className="text-sm font-medium text-white">
                    {check.scorePerformance}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-white/[0.04] flex items-center justify-between">
                <span className="text-xs text-white/30">
                  {new Date(check.createdAt).toLocaleDateString("de-DE")}
                </span>
                <span className="text-xs text-white/40">
                  {check.loadTime}ms
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-5 py-4 text-left text-xs font-medium text-white/40 uppercase">
                  Website
                </th>
                <th className="px-5 py-4 text-left text-xs font-medium text-white/40 uppercase">
                  Score
                </th>
                <th className="px-5 py-4 text-left text-xs font-medium text-white/40 uppercase">
                  SEO
                </th>
                <th className="px-5 py-4 text-left text-xs font-medium text-white/40 uppercase">
                  Sicherheit
                </th>
                <th className="px-5 py-4 text-left text-xs font-medium text-white/40 uppercase">
                  Performance
                </th>
                <th className="px-5 py-4 text-left text-xs font-medium text-white/40 uppercase">
                  Ladezeit
                </th>
                <th className="px-5 py-4 text-left text-xs font-medium text-white/40 uppercase">
                  Datum
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedChecks.map((check) => (
                <tr
                  key={check.id}
                  onClick={() => setSelectedCheck(check)}
                  className="border-b border-white/[0.04] hover:bg-white/[0.02] cursor-pointer"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${check.httpsEnabled ? "bg-green-500/20" : "bg-red-500/20"}`}
                      >
                        {check.httpsEnabled ? (
                          <ShieldCheckIcon className="w-4 h-4 text-green-400" />
                        ) : (
                          <ExclamationCircleIcon className="w-4 h-4 text-red-400" />
                        )}
                      </div>
                      <span className="text-sm text-white">
                        {check.url.replace(/^https?:\/\//, "")}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-lg font-bold ${check.scoreOverall >= 70 ? "text-green-400" : check.scoreOverall >= 40 ? "text-yellow-400" : "text-red-400"}`}
                    >
                      {check.scoreOverall}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <CheckScoreBar value={check.scoreSeo} />
                  </td>
                  <td className="px-5 py-4">
                    <CheckScoreBar value={check.scoreSecurity} />
                  </td>
                  <td className="px-5 py-4">
                    <CheckScoreBar value={check.scorePerformance} />
                  </td>
                  <td className="px-5 py-4 text-sm text-white/60">
                    {check.loadTime}ms
                  </td>
                  <td className="px-5 py-4 text-sm text-white/40">
                    {new Date(check.createdAt).toLocaleDateString("de-DE")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {selectedCheck && (
        <CheckDetailModal
          check={selectedCheck}
          onClose={() => setSelectedCheck(null)}
        />
      )}
    </div>
  );
}

function CheckScoreBar({ value }: { value: number }) {
  const color =
    value >= 70 ? "bg-green-400" : value >= 40 ? "bg-yellow-400" : "bg-red-400";
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs text-white/60">{value}</span>
    </div>
  );
}

function CheckDetailModal({
  check,
  onClose,
}: {
  check: WebsiteCheck;
  onClose: () => void;
}) {
  const [leadCreated, setLeadCreated] = useState(false);
  const [creatingLead, setCreatingLead] = useState(false);

  const handleCreateLead = async () => {
    setCreatingLead(true);
    try {
      await fetch("/api/leads", {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: check.url.replace(/^https?:\/\//, ""),
          email: check.email || "",
          source: "Website-Check",
          message: `Website-Check Score: ${check.scoreOverall}/100 | URL: ${check.url}`,
          packageInterest: "Website-Check",
          status: "new",
          priority: "medium",
        }),
      });
      setLeadCreated(true);
    } catch (error) {
      console.error("Failed to create lead:", error);
    } finally {
      setCreatingLead(false);
    }
  };

  const categories = [
    { label: "Gesamt", value: check.scoreOverall, icon: ChartBarIcon },
    { label: "SEO", value: check.scoreSeo, icon: MagnifyingGlassCircleIcon },
    { label: "Sicherheit", value: check.scoreSecurity, icon: ShieldCheckIcon },
    {
      label: "Zugänglichkeit",
      value: check.scoreAccessibility,
      icon: UsersIcon,
    },
    { label: "Performance", value: check.scorePerformance, icon: BoltIcon },
    { label: "Struktur", value: check.scoreStructure, icon: CpuChipIcon },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#0f0f12] border border-white/[0.08] rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-xl ${check.httpsEnabled ? "bg-green-500/20" : "bg-red-500/20"}`}
            >
              <GlobeAltIcon
                className={`w-5 h-5 ${check.httpsEnabled ? "text-green-400" : "text-red-400"}`}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                {check.url.replace(/^https?:\/\//, "")}
              </h3>
              <p className="text-xs text-white/40">
                Analysiert am{" "}
                {new Date(check.createdAt).toLocaleDateString("de-DE", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl"
          >
            <XMarkIcon className="w-5 h-5 text-white/60" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Main Score */}
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="none"
                  className="text-white/10"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={351.86}
                  strokeDashoffset={
                    351.86 - (351.86 * check.scoreOverall) / 100
                  }
                  strokeLinecap="round"
                  className={
                    check.scoreOverall >= 70
                      ? "text-green-400"
                      : check.scoreOverall >= 40
                        ? "text-yellow-400"
                        : "text-red-400"
                  }
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className={`text-4xl font-bold ${check.scoreOverall >= 70 ? "text-green-400" : check.scoreOverall >= 40 ? "text-yellow-400" : "text-red-400"}`}
                >
                  {check.scoreOverall}
                </span>
                <span className="text-xs text-white/40">Gesamt</span>
              </div>
            </div>
          </div>

          {/* Category Scores */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {categories.slice(1).map((cat) => {
              const Icon = cat.icon;
              const color =
                cat.value >= 70
                  ? "text-green-400"
                  : cat.value >= 40
                    ? "text-yellow-400"
                    : "text-red-400";
              const bgColor =
                cat.value >= 70
                  ? "bg-green-500/10"
                  : cat.value >= 40
                    ? "bg-yellow-500/10"
                    : "bg-red-500/10";
              return (
                <div
                  key={cat.label}
                  className={`p-4 rounded-xl ${bgColor} border border-white/[0.04]`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`w-4 h-4 ${color}`} />
                    <span className="text-xs text-white/50">{cat.label}</span>
                  </div>
                  <p className={`text-2xl font-bold ${color}`}>{cat.value}</p>
                </div>
              );
            })}
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/[0.03] border border-white/[0.04] rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <ClockIcon className="w-4 h-4 text-white/40" />
                <span className="text-xs text-white/40">Ladezeit</span>
              </div>
              <p className="text-lg font-medium text-white">
                {check.loadTime}ms
              </p>
            </div>
            <div className="p-4 bg-white/[0.03] border border-white/[0.04] rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheckIcon className="w-4 h-4 text-white/40" />
                <span className="text-xs text-white/40">HTTPS</span>
              </div>
              <p
                className={`text-lg font-medium ${check.httpsEnabled ? "text-green-400" : "text-red-400"}`}
              >
                {check.httpsEnabled ? "Aktiv" : "Nicht aktiv"}
              </p>
            </div>
          </div>

          {/* Contact Info */}
          {check.email && (
            <div className="p-4 bg-white/[0.03] border border-white/[0.04] rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/40 mb-1">Kontakt E-Mail</p>
                  <p className="text-sm text-white">{check.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  {!leadCreated ? (
                    <button
                      onClick={handleCreateLead}
                      disabled={creatingLead}
                      className="px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-xl text-sm font-medium hover:bg-green-500/30 transition-colors disabled:opacity-50"
                    >
                      {creatingLead ? "Wird erstellt..." : "Als Lead anlegen"}
                    </button>
                  ) : (
                    <span className="px-4 py-2 text-green-400 text-sm font-medium">
                      ✓ Lead erstellt
                    </span>
                  )}
                  <a
                    href={`mailto:${check.email}?subject=Website-Analyse für ${check.url}`}
                    className="px-4 py-2 bg-[#FC682C] text-white rounded-xl text-sm font-medium hover:bg-[#FC682C]/90"
                  >
                    E-Mail senden
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Als Lead anlegen - wenn keine Email */}
          {!check.email && (
            <div className="flex justify-end">
              {!leadCreated ? (
                <button
                  onClick={handleCreateLead}
                  disabled={creatingLead}
                  className="px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-xl text-sm font-medium hover:bg-green-500/30 transition-colors disabled:opacity-50"
                >
                  {creatingLead ? "Wird erstellt..." : "Als Lead anlegen"}
                </button>
              ) : (
                <span className="px-4 py-2 text-green-400 text-sm font-medium">
                  ✓ Lead erstellt
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between px-6 py-4 border-t border-white/[0.06] bg-white/[0.02]">
          <a
            href={check.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-white/50 hover:text-white"
          >
            <LinkIcon className="w-4 h-4" /> Website öffnen
          </a>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
}

interface Referral {
  id: number;
  referrerName: string;
  referrerEmail: string;
  referredName: string;
  referredEmail: string;
  referredPhone: string | null;
  message: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
}

function ReferralsTab() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(
    null,
  );
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetch("/api/referrals", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        const unwrapped = unwrapApiResponse<{referrals: Referral[]}>(data);
        setReferrals(unwrapped.referrals || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = referrals.filter((r) => {
    const matchSearch =
      r.referrerName.toLowerCase().includes(search.toLowerCase()) ||
      r.referredName.toLowerCase().includes(search.toLowerCase()) ||
      r.referredEmail.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || r.status === filter;
    return matchSearch && matchFilter;
  });

  const updateStatus = async (id: number, status: string) => {
    await fetch(`/api/referrals/${id}`, { credentials: "include",
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setReferrals(referrals.map((r) => (r.id === id ? { ...r, status } : r)));
    setSelectedReferral(null);
  };

  const stats = {
    total: referrals.length,
    pending: referrals.filter((r) => r.status === "pending").length,
    contacted: referrals.filter((r) => r.status === "contacted").length,
    converted: referrals.filter((r) => r.status === "converted").length,
  };

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/5 border border-purple-500/20">
          <div className="flex items-center gap-3 mb-2">
            <UserGroupIcon className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-white/50">Gesamt</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="p-5 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/5 border border-yellow-500/20">
          <div className="flex items-center gap-3 mb-2">
            <ClockIcon className="w-5 h-5 text-yellow-400" />
            <span className="text-sm text-white/50">Ausstehend</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.pending}</p>
        </div>
        <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/5 border border-blue-500/20">
          <div className="flex items-center gap-3 mb-2">
            <PhoneIcon className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-white/50">Kontaktiert</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.contacted}</p>
        </div>
        <div className="p-5 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/5 border border-green-500/20">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircleIcon className="w-5 h-5 text-green-400" />
            <span className="text-sm text-white/50">Konvertiert</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.converted}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
          <input
            type="text"
            placeholder="Suche nach Empfehler oder Empfohlenen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/[0.04] border border-white/[0.06] rounded-xl text-white placeholder:text-white/30 focus:border-[#FC682C]/50 outline-none"
          />
        </div>
        <div className="flex gap-2">
          {["all", "pending", "contacted", "converted"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === f
                  ? "bg-[#FC682C] text-white"
                  : "bg-white/[0.04] text-white/50 hover:bg-white/[0.08] hover:text-white"
              }`}
            >
              {f === "all"
                ? "Alle"
                : f === "pending"
                  ? "Ausstehend"
                  : f === "contacted"
                    ? "Kontaktiert"
                    : "Konvertiert"}
            </button>
          ))}
        </div>
      </div>

      {/* Referrals List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <UserGroupIcon className="w-16 h-16 text-white/10 mb-4" />
            <h3 className="text-lg font-medium text-white/50">
              Keine Empfehlungen gefunden
            </h3>
            <p className="text-sm text-white/30">
              Teile deinen Empfehlungslink um neue Empfehlungen zu erhalten
            </p>
          </div>
        ) : (
          filtered.map((referral) => (
            <div
              key={referral.id}
              className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all cursor-pointer"
              onClick={() => setSelectedReferral(referral)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  {/* Avatar Stack */}
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/30 to-[#9D65C9]/30 flex items-center justify-center text-white font-medium text-lg">
                      {referral.referrerName.charAt(0)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-gradient-to-br from-[#FC682C]/50 to-[#FC682C]/30 flex items-center justify-center text-white font-medium text-xs border-2 border-[#09090b]">
                      {referral.referredName.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-white">
                        {referral.referrerName}
                      </span>
                      <ChevronRightIcon className="w-4 h-4 text-[#FC682C]" />
                      <span className="text-sm font-medium text-white">
                        {referral.referredName}
                      </span>
                    </div>
                    <p className="text-xs text-white/40">
                      {referral.referredEmail}{" "}
                      {referral.referredPhone && `• ${referral.referredPhone}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ReferralStatusBadge status={referral.status} />
                  <span className="text-xs text-white/30">
                    {new Date(referral.createdAt).toLocaleDateString("de-DE")}
                  </span>
                </div>
              </div>
              {referral.message && (
                <div className="mt-4 p-3 bg-white/[0.02] rounded-xl border border-white/[0.04]">
                  <p className="text-sm text-white/60 line-clamp-2">
                    {referral.message}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Referral Modal */}
      {selectedReferral && (
        <ReferralModal
          referral={selectedReferral}
          onClose={() => setSelectedReferral(null)}
          onUpdateStatus={updateStatus}
        />
      )}
    </div>
  );
}

function ReferralStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    contacted: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    converted: "bg-green-500/20 text-green-400 border-green-500/30",
    rejected: "bg-red-500/20 text-red-400 border-red-500/30",
  };
  const labels: Record<string, string> = {
    pending: "Ausstehend",
    contacted: "Kontaktiert",
    converted: "Konvertiert",
    rejected: "Abgelehnt",
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${styles[status] || styles.pending}`}
    >
      {labels[status] || status}
    </span>
  );
}

function ReferralModal({
  referral,
  onClose,
  onUpdateStatus,
}: {
  referral: Referral;
  onClose: () => void;
  onUpdateStatus: (id: number, status: string) => void;
}) {
  const [notes, setNotes] = useState(referral.notes || "");

  const saveNotes = async () => {
    await fetch(`/api/referrals/${referral.id}`, { credentials: "include",
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes }),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#0f0f12] border border-white/[0.08] rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06] bg-gradient-to-r from-purple-500/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/20">
              <UserGroupIcon className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Empfehlung Details
              </h3>
              <p className="text-xs text-white/40">
                Erstellt am{" "}
                {new Date(referral.createdAt).toLocaleDateString("de-DE")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl"
          >
            <XMarkIcon className="w-5 h-5 text-white/60" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* People */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/[0.03] border border-white/[0.04] rounded-xl">
              <p className="text-[10px] text-white/40 uppercase mb-2">
                Empfohlen von
              </p>
              <p className="text-sm font-medium text-white">
                {referral.referrerName}
              </p>
              <p className="text-xs text-white/50">{referral.referrerEmail}</p>
            </div>
            <div className="p-4 bg-white/[0.03] border border-white/[0.04] rounded-xl">
              <p className="text-[10px] text-white/40 uppercase mb-2">
                Empfohlene Person
              </p>
              <p className="text-sm font-medium text-white">
                {referral.referredName}
              </p>
              <p className="text-xs text-white/50">{referral.referredEmail}</p>
              {referral.referredPhone && (
                <p className="text-xs text-white/50">
                  {referral.referredPhone}
                </p>
              )}
            </div>
          </div>

          {/* Message */}
          {referral.message && (
            <div>
              <label className="block text-xs text-white/40 mb-2">
                Nachricht
              </label>
              <div className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white/70">
                {referral.message}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex gap-2">
            <a
              href={`mailto:${referral.referredEmail}`}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#FC682C] text-white rounded-xl font-medium hover:bg-[#FC682C]/90 transition-colors"
            >
              <EnvelopeOpenIcon className="w-4 h-4" /> E-Mail senden
            </a>
            {referral.referredPhone && (
              <a
                href={`tel:${referral.referredPhone}`}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors"
              >
                <PhoneIcon className="w-4 h-4" /> Anrufen
              </a>
            )}
          </div>

          {/* Status Actions */}
          <div>
            <label className="block text-xs text-white/40 mb-2">
              Status ändern
            </label>
            <div className="flex gap-2">
              {["pending", "contacted", "converted", "rejected"].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => onUpdateStatus(referral.id, status)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      referral.status === status
                        ? "bg-[#FC682C] text-white"
                        : "bg-white/[0.04] text-white/50 hover:bg-white/[0.08]"
                    }`}
                  >
                    {status === "pending"
                      ? "Ausstehend"
                      : status === "contacted"
                        ? "Kontaktiert"
                        : status === "converted"
                          ? "Konvertiert"
                          : "Abgelehnt"}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs text-white/40 mb-2">Notizen</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={saveNotes}
              placeholder="Notizen hinzufügen..."
              rows={3}
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white placeholder:text-white/30 focus:border-[#FC682C]/50 outline-none resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-white/[0.06] bg-white/[0.02]">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
}

interface Subscriber {
  id: number;
  email: string;
  name: string | null;
  status: string;
  source: string | null;
  createdAt: string;
}

function SubscribersTab() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    fetch("/api/subscribers", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        const unwrapped = unwrapApiResponse<{subscribers: Subscriber[]}>(data);
        setSubscribers(unwrapped.subscribers || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = subscribers.filter((s) => {
    const matchSearch =
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.name?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchFilter = filter === "all" || s.status === filter;
    return matchSearch && matchFilter;
  });

  const stats = {
    total: subscribers.length,
    confirmed: subscribers.filter((s) => s.status === "confirmed").length,
    pending: subscribers.filter((s) => s.status === "pending").length,
    unsubscribed: subscribers.filter((s) => s.status === "unsubscribed").length,
  };

  const toggleSelect = (id: number) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((s) => s.id)));
    }
  };

  const exportToCSV = () => {
    const data = filtered.filter(
      (s) => selectedIds.size === 0 || selectedIds.has(s.id),
    );
    const csv = [
      ["E-Mail", "Name", "Status", "Quelle", "Erstellt am"],
      ...data.map((s) => [
        s.email,
        s.name || "",
        s.status,
        s.source || "",
        new Date(s.createdAt).toLocaleDateString("de-DE"),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-abonnenten-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const updateStatus = async (ids: number[], status: string) => {
    for (const id of ids) {
      await fetch(`/api/subscribers/${id}`, { credentials: "include",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
    }
    setSubscribers(
      subscribers.map((s) => (ids.includes(s.id) ? { ...s, status } : s)),
    );
    setSelectedIds(new Set());
  };

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FC682C]/20 to-[#FC682C]/5 border border-[#FC682C]/20">
          <div className="flex items-center gap-3 mb-2">
            <EnvelopeIcon className="w-5 h-5 text-[#FC682C]" />
            <span className="text-sm text-white/50">Gesamt</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="p-5 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/5 border border-green-500/20">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircleIcon className="w-5 h-5 text-green-400" />
            <span className="text-sm text-white/50">Bestätigt</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.confirmed}</p>
        </div>
        <div className="p-5 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/5 border border-yellow-500/20">
          <div className="flex items-center gap-3 mb-2">
            <ClockIcon className="w-5 h-5 text-yellow-400" />
            <span className="text-sm text-white/50">Ausstehend</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.pending}</p>
        </div>
        <div className="p-5 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/5 border border-red-500/20">
          <div className="flex items-center gap-3 mb-2">
            <XMarkIcon className="w-5 h-5 text-red-400" />
            <span className="text-sm text-white/50">Abgemeldet</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.unsubscribed}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-3 justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              type="text"
              placeholder="Suchen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/[0.04] border border-white/[0.06] rounded-xl text-white placeholder:text-white/30 focus:border-[#FC682C]/50 outline-none"
            />
          </div>
          <div className="flex gap-2">
            {["all", "confirmed", "pending", "unsubscribed"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  filter === f
                    ? "bg-[#FC682C] text-white"
                    : "bg-white/[0.04] text-white/50 hover:bg-white/[0.08] hover:text-white"
                }`}
              >
                {f === "all"
                  ? "Alle"
                  : f === "confirmed"
                    ? "Bestätigt"
                    : f === "pending"
                      ? "Ausstehend"
                      : "Abgemeldet"}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          {selectedIds.size > 0 && (
            <>
              <button
                onClick={() =>
                  updateStatus(Array.from(selectedIds), "confirmed")
                }
                className="px-4 py-2 bg-green-500/20 text-green-400 rounded-xl text-sm font-medium hover:bg-green-500/30"
              >
                Bestätigen ({selectedIds.size})
              </button>
              <button
                onClick={() =>
                  updateStatus(Array.from(selectedIds), "unsubscribed")
                }
                className="px-4 py-2 bg-red-500/20 text-red-400 rounded-xl text-sm font-medium hover:bg-red-500/30"
              >
                Abmelden
              </button>
            </>
          )}
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-[#FC682C] text-white rounded-xl text-sm font-medium hover:bg-[#FC682C]/90 flex items-center gap-2"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            Export {selectedIds.size > 0 ? `(${selectedIds.size})` : ""}
          </button>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="px-5 py-4 text-left">
                <input
                  type="checkbox"
                  checked={
                    filtered.length > 0 && selectedIds.size === filtered.length
                  }
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 checked:bg-[#FC682C] checked:border-[#FC682C] focus:ring-[#FC682C]/50"
                />
              </th>
              <th className="px-5 py-4 text-left text-xs font-medium text-white/40 uppercase">
                Abonnent
              </th>
              <th className="px-5 py-4 text-left text-xs font-medium text-white/40 uppercase">
                Status
              </th>
              <th className="px-5 py-4 text-left text-xs font-medium text-white/40 uppercase">
                Quelle
              </th>
              <th className="px-5 py-4 text-left text-xs font-medium text-white/40 uppercase">
                Angemeldet
              </th>
              <th className="px-5 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center">
                  <EnvelopeIcon className="w-12 h-12 text-white/10 mx-auto mb-3" />
                  <p className="text-white/40">Keine Abonnenten gefunden</p>
                </td>
              </tr>
            ) : (
              filtered.map((subscriber) => (
                <tr
                  key={subscriber.id}
                  className={`border-b border-white/[0.04] hover:bg-white/[0.02] cursor-pointer transition-colors ${selectedIds.has(subscriber.id) ? "bg-[#FC682C]/5" : ""}`}
                >
                  <td
                    className="px-5 py-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.has(subscriber.id)}
                      onChange={() => toggleSelect(subscriber.id)}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 checked:bg-[#FC682C] checked:border-[#FC682C] focus:ring-[#FC682C]/50"
                    />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FC682C]/20 to-[#9D65C9]/20 flex items-center justify-center text-white font-medium">
                        {(subscriber.name || subscriber.email)
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {subscriber.name || "-"}
                        </p>
                        <p className="text-xs text-white/40">
                          {subscriber.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <SubscriberStatusBadge status={subscriber.status} />
                  </td>
                  <td className="px-5 py-4 text-sm text-white/50">
                    {subscriber.source || "Direkt"}
                  </td>
                  <td className="px-5 py-4 text-sm text-white/40">
                    {new Date(subscriber.createdAt).toLocaleDateString("de-DE")}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1">
                      <button
                        onClick={() =>
                          (window.location.href = `mailto:${subscriber.email}`)
                        }
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title="E-Mail senden"
                      >
                        <EnvelopeOpenIcon className="w-4 h-4 text-white/40" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
        <p className="text-sm text-white/40">
          {filtered.length} von {subscribers.length} Abonnenten angezeigt
          {selectedIds.size > 0 && ` • ${selectedIds.size} ausgewählt`}
        </p>
        <div className="flex items-center gap-2 text-sm text-white/40">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-400" />{" "}
            {stats.confirmed} bestätigt
          </span>
          <span className="text-white/20">•</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-yellow-400" />{" "}
            {stats.pending} ausstehend
          </span>
        </div>
      </div>
    </div>
  );
}

function SubscriberStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    confirmed: "bg-green-500/20 text-green-400 border-green-500/30",
    pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    unsubscribed: "bg-red-500/20 text-red-400 border-red-500/30",
  };
  const labels: Record<string, string> = {
    confirmed: "Bestätigt",
    pending: "Ausstehend",
    unsubscribed: "Abgemeldet",
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${styles[status] || styles.pending}`}
    >
      {labels[status] || status}
    </span>
  );
}

function AnalyticsTab({ stats }: { stats: Stats | null }) {
  if (!stats) return <LoadingState />;

  // Echte Daten aus stats.trends (von /api/stats)
  const revenueTrend = stats.trends?.revenue?.length ? stats.trends.revenue : [];
  const leadsTrend = stats.trends?.leads?.length ? stats.trends.leads : [];

  const currentRevenue = revenueTrend.length > 0 ? revenueTrend : [stats.revenue.thisMonth || 0];
  const currentLeads = leadsTrend.length > 0 ? leadsTrend : [stats.leads.total || 0];
  const currentLabels = currentRevenue.map((_, i) => `${i + 1}`);
  const maxRevenue = Math.max(...currentRevenue, 1);
  const maxLeads = Math.max(...currentLeads, 1);

  const totalRevenue = stats.revenue.total || 0;
  const totalLeads = stats.leads.total || 0;
  const avgRevenue = currentRevenue.length > 0 ? Math.round(currentRevenue.reduce((a, b) => a + b, 0) / currentRevenue.length) : 0;
  const conversionRate =
    stats.leads.total > 0
      ? Math.round((stats.leads.qualified / stats.leads.total) * 100)
      : 0;
  const hasChartData = revenueTrend.length > 1 || leadsTrend.length > 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Übersicht & Trends</h2>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FC682C]/20 to-[#FC682C]/5 border border-[#FC682C]/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/50">Gesamt-Umsatz</span>
            <CurrencyEuroIcon className="w-5 h-5 text-[#FC682C]" />
          </div>
          <p className="text-2xl font-bold text-white">
            €{(totalRevenue / 1000).toFixed(1)}k
          </p>
          <p className="text-xs text-white/30 mt-1">Gesamt</p>
        </div>
        <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/5 border border-blue-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/50">Neue Leads</span>
            <UsersIcon className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">{totalLeads}</p>
          <p className="text-xs text-white/30 mt-1">{stats.leads.new} neue</p>
        </div>
        <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/5 border border-purple-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/50">Conversion Rate</span>
            <ArrowTrendingUpIcon className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">{conversionRate}%</p>
          <p className="text-xs text-white/30 mt-1">{stats.leads.qualified} qualifiziert</p>
        </div>
        <div className="p-5 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/5 border border-green-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/50">Ø Umsatz</span>
            <ChartBarIcon className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">
            €{avgRevenue.toLocaleString()}
          </p>
          <p className="text-xs text-white/30 mt-1">Durchschnitt</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <GlassCard title="Umsatz-Entwicklung" icon={CurrencyEuroIcon}>
          <div className="h-64 relative">
            {/* Y-Axis Labels */}
            <div className="absolute left-0 top-0 bottom-8 w-12 flex flex-col justify-between text-xs text-white/30">
              <span>€{(maxRevenue / 1000).toFixed(0)}k</span>
              <span>€{(maxRevenue / 2000).toFixed(0)}k</span>
              <span>€0</span>
            </div>
            {/* Chart Area */}
            <div className="ml-14 h-full pb-8">
              <svg
                className="w-full h-full"
                viewBox={`0 0 ${currentRevenue.length * 50} 200`}
                preserveAspectRatio="none"
              >
                {/* Grid Lines */}
                <line
                  x1="0"
                  y1="100"
                  x2="100%"
                  y2="100"
                  stroke="rgba(255,255,255,0.05)"
                  strokeDasharray="4"
                />
                <line
                  x1="0"
                  y1="50"
                  x2="100%"
                  y2="50"
                  stroke="rgba(255,255,255,0.05)"
                  strokeDasharray="4"
                />
                {/* Area */}
                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#FC682C" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#FC682C" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d={`M0,200 ${currentRevenue.map((v, i) => `L${i * 50 + 25},${200 - (v / maxRevenue) * 180}`).join(" ")} L${currentRevenue.length * 50},200 Z`}
                  fill="url(#revenueGradient)"
                />
                {/* Line */}
                <path
                  d={`M25,${200 - (currentRevenue[0] / maxRevenue) * 180} ${currentRevenue
                    .slice(1)
                    .map(
                      (v, i) =>
                        `L${(i + 1) * 50 + 25},${200 - (v / maxRevenue) * 180}`,
                    )
                    .join(" ")}`}
                  fill="none"
                  stroke="#FC682C"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Dots */}
                {currentRevenue.map((v, i) => (
                  <circle
                    key={i}
                    cx={i * 50 + 25}
                    cy={200 - (v / maxRevenue) * 180}
                    r="4"
                    fill="#FC682C"
                    stroke="#0f0f12"
                    strokeWidth="2"
                  />
                ))}
              </svg>
              {/* X-Axis Labels */}
              <div className="flex justify-between text-xs text-white/30 mt-2">
                {currentLabels.map((label, i) => (
                  <span
                    key={i}
                    className="text-center"
                    style={{ width: `${100 / currentLabels.length}%` }}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Leads Chart */}
        <GlassCard title="Lead-Entwicklung" icon={UsersIcon}>
          <div className="h-64 relative">
            {/* Y-Axis Labels */}
            <div className="absolute left-0 top-0 bottom-8 w-12 flex flex-col justify-between text-xs text-white/30">
              <span>{maxLeads}</span>
              <span>{Math.round(maxLeads / 2)}</span>
              <span>0</span>
            </div>
            {/* Chart Area */}
            <div className="ml-14 h-full pb-8">
              <svg
                className="w-full h-full"
                viewBox={`0 0 ${currentLeads.length * 50} 200`}
                preserveAspectRatio="none"
              >
                {/* Grid Lines */}
                <line
                  x1="0"
                  y1="100"
                  x2="100%"
                  y2="100"
                  stroke="rgba(255,255,255,0.05)"
                  strokeDasharray="4"
                />
                <line
                  x1="0"
                  y1="50"
                  x2="100%"
                  y2="50"
                  stroke="rgba(255,255,255,0.05)"
                  strokeDasharray="4"
                />
                {/* Bars */}
                {currentLeads.map((v, i) => (
                  <rect
                    key={i}
                    x={i * 50 + 10}
                    y={200 - (v / maxLeads) * 180}
                    width="30"
                    height={(v / maxLeads) * 180}
                    rx="4"
                    fill="url(#barGradient)"
                  />
                ))}
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#9D65C9" />
                    <stop offset="100%" stopColor="#9D65C9" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
              </svg>
              {/* X-Axis Labels */}
              <div className="flex justify-between text-xs text-white/30 mt-2">
                {currentLabels.map((label, i) => (
                  <span
                    key={i}
                    className="text-center"
                    style={{ width: `${100 / currentLabels.length}%` }}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Lead Status */}
        <GlassCard title="Lead-Status" icon={FunnelIcon}>
          <div className="space-y-4">
            <SourceBar label="Neu" value={stats.leads.total > 0 ? Math.round((stats.leads.new / stats.leads.total) * 100) : 0} color="blue" />
            <SourceBar label="Qualifiziert" value={stats.leads.total > 0 ? Math.round((stats.leads.qualified / stats.leads.total) * 100) : 0} color="purple" />
            <SourceBar label="Gewonnen" value={stats.leads.total > 0 ? Math.round((stats.leads.won / stats.leads.total) * 100) : 0} color="orange" />
            <SourceBar label="Verloren" value={stats.leads.total > 0 ? Math.round((stats.leads.lost / stats.leads.total) * 100) : 0} color="gray" />
          </div>
        </GlassCard>

        {/* Conversion Funnel */}
        <GlassCard title="Conversion Funnel" icon={FunnelIcon}>
          <div className="space-y-3">
            <FunnelStep
              label="Gesamt Leads"
              value={stats.leads.total}
              percentage={100}
              color="blue"
            />
            <FunnelStep
              label="Qualifiziert"
              value={stats.leads.qualified}
              percentage={stats.leads.total > 0 ? Math.round((stats.leads.qualified / stats.leads.total) * 100) : 0}
              color="purple"
            />
            <FunnelStep
              label="Gewonnen"
              value={stats.leads.won}
              percentage={stats.leads.total > 0 ? Math.round((stats.leads.won / stats.leads.total) * 100) : 0}
              color="orange"
            />
            <FunnelStep
              label="Umsatz"
              value={stats.revenue.total}
              percentage={stats.leads.won > 0 ? 100 : 0}
              color="green"
            />
          </div>
        </GlassCard>

        {/* Kennzahlen */}
        <GlassCard title="Kennzahlen" icon={StarIcon}>
          <div className="space-y-3">
            <PackageRow name="Website-Checks" count={stats.checks.total} revenue={0} />
            <PackageRow name="Empfehlungen" count={stats.referrals.total} revenue={0} />
            <PackageRow name="Subscriber" count={stats.subscribers.total} revenue={0} />
            <PackageRow name="Ø Check-Score" count={stats.checks.avgScore} revenue={0} />
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function FunnelStep({
  label,
  value,
  percentage,
  color,
}: {
  label: string;
  value: number;
  percentage: number;
  color: string;
}) {
  const colors: Record<string, string> = {
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    orange: "bg-[#FC682C]",
    green: "bg-green-500",
  };
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-white/70">{label}</span>
        <span className="text-white font-medium">{value}</span>
      </div>
      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full ${colors[color]} rounded-full transition-all`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-[10px] text-white/30 mt-1">{percentage}% Conversion</p>
    </div>
  );
}

function PackageRow({
  name,
  count,
  revenue,
}: {
  name: string;
  count: number;
  revenue: number;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
      <div>
        <p className="text-sm font-medium text-white">{name}</p>
        <p className="text-xs text-white/40">{count} Verkäufe</p>
      </div>
      <span className="text-sm font-medium text-[#FC682C]">
        {revenue > 0 ? `€${(revenue / 1000).toFixed(1)}k` : "Kostenlos"}
      </span>
    </div>
  );
}

function SourceBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const colors: Record<string, string> = {
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    orange: "bg-[#FC682C]",
    gray: "bg-gray-500",
  };
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-white/70">{label}</span>
        <span className="text-white font-medium">{value}%</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full ${colors[color]} rounded-full`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function AutomationsTab() {
  const [automations, setAutomations] = useState([
    { id: 1, name: "Willkommens-E-Mail", trigger: "Neuer Lead", active: true },
    { id: 2, name: "Follow-up Reminder", trigger: "Nach 3 Tagen", active: true },
    { id: 3, name: "Score < 50 Alert", trigger: "Website-Check", active: false },
    { id: 4, name: "Referral Danke", trigger: "Neue Empfehlung", active: true },
  ]);

  const toggleAutomation = (id: number) => {
    setAutomations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-white/50">Automatisiere wiederkehrende Aufgaben</p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/30">Konfiguration über n8n</span>
          <a
            href="http://localhost:5678"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-[#FC682C] text-white rounded-xl text-sm font-medium hover:bg-[#FC682C]/90 transition-colors"
          >
            <PlusIcon className="w-4 h-4" /> Neue Automation
          </a>
        </div>
      </div>

      <div className="grid gap-4">
        {automations.map((auto) => (
          <div
            key={auto.id}
            className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-xl ${auto.active ? "bg-green-500/20" : "bg-white/10"} flex items-center justify-center`}
              >
                <BoltIcon
                  className={`w-5 h-5 ${auto.active ? "text-green-400" : "text-white/40"}`}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{auto.name}</p>
                <p className="text-xs text-white/40">Trigger: {auto.trigger}</p>
              </div>
            </div>
            <button
              onClick={() => toggleAutomation(auto.id)}
              title={auto.active ? "Deaktivieren" : "Aktivieren"}
              className={`relative w-12 h-6 rounded-full transition-colors ${auto.active ? "bg-green-500" : "bg-white/20"}`}
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${auto.active ? "left-7" : "left-1"}`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    CLIENTS TAB (Portal-Kunden)
// ═══════════════════════════════════════════════════════════════

interface PortalClient {
  id: number;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  telegram_id: string | null;
  telegram_username: string | null;
  access_code: string;
  status: string;
  created_at: string;
  last_login: string | null;
  project_id: number | null;
  project_name: string | null;
  package: string | null;
  project_status: string | null;
  progress: number | null;
  unread_messages: number;
}

function ClientsTab() {
  const [clients, setClients] = useState<PortalClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<PortalClient | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // NEW: Power Features State
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "created" | "activity">("created");
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const [bulkAction, setBulkAction] = useState<string>("");
  const [quickDocTab, setQuickDocTab] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/clients", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        // API returns {success: true, data: {clients: [...]}}
        setClients(data.data?.clients || data.clients || []);
      }
    } catch (error) {
      console.error("Failed to fetch clients:", error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Enhanced filtering
  const filteredClients = clients
    .filter((client) => {
      const matchesSearch = 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.access_code.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || client.status === statusFilter;
      const matchesProject = projectFilter === "all" || 
        (projectFilter === "with" && client.project_id) ||
        (projectFilter === "without" && !client.project_id) ||
        client.project_status === projectFilter;
      
      return matchesSearch && matchesStatus && matchesProject;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "activity") return new Date(b.last_login || b.created_at).getTime() - new Date(a.last_login || a.created_at).getTime();
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  // Stats calculation
  const stats = {
    total: clients.length,
    active: clients.filter(c => c.status === "active").length,
    withProjects: clients.filter(c => c.project_id).length,
    inProgress: clients.filter(c => c.project_status === "entwicklung").length,
    completed: clients.filter(c => c.project_status === "abgeschlossen").length,
  };

  // Bulk actions
  const handleSelectAll = () => {
    if (selectedIds.size === filteredClients.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredClients.map(c => c.id)));
    }
  };

  const handleSelect = (id: number) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleBulkDelete = async () => {
    if (!confirm(`${selectedIds.size} Kunden wirklich löschen?`)) return;
    for (const id of Array.from(selectedIds)) {
      await fetch(`/api/clients/${id}`, { method: "DELETE", credentials: "include" });
    }
    setSelectedIds(new Set());
    fetchClients();
  };

  const handleBulkStatusChange = async (status: string) => {
    for (const id of Array.from(selectedIds)) {
      await fetch(`/api/clients/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
    }
    setSelectedIds(new Set());
    fetchClients();
  };

  const handleExportCSV = () => {
    const headers = ["Name", "Email", "Firma", "Telefon", "Status", "Paket", "Fortschritt", "Erstellt"];
    const rows = filteredClients.map(c => [
      c.name,
      c.email,
      c.company || "",
      c.phone || "",
      c.status || "active",
      c.package || "",
      c.progress ? `${c.progress}%` : "",
      new Date(c.created_at).toLocaleDateString("de-DE"),
    ]);
    
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kunden-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const copyPortalLink = (code: string) => {
    navigator.clipboard.writeText(`https://portal.agentflowm.de/login?code=${code}`);
    alert("Portal-Link kopiert!");
  };

  const handleQuickInvoice = (client: PortalClient) => {
    // Navigate to invoices tab with pre-filled client data
    const event = new CustomEvent("createInvoice", { detail: { client } });
    window.dispatchEvent(event);
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "abgeschlossen":
        return "text-green-400 bg-green-500/20";
      case "entwicklung":
        return "text-blue-400 bg-blue-500/20";
      case "planung":
        return "text-yellow-400 bg-yellow-500/20";
      default:
        return "text-white/40 bg-white/10";
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="p-4 bg-gradient-to-br from-[#FC682C]/10 to-[#FC682C]/5 rounded-xl border border-[#FC682C]/20">
          <div className="text-2xl font-bold text-white">{stats.total}</div>
          <div className="text-xs text-white/50">Gesamt</div>
        </div>
        <div className="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl border border-green-500/20">
          <div className="text-2xl font-bold text-green-400">{stats.active}</div>
          <div className="text-xs text-white/50">Aktiv</div>
        </div>
        <div className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl border border-blue-500/20">
          <div className="text-2xl font-bold text-blue-400">{stats.withProjects}</div>
          <div className="text-xs text-white/50">Mit Projekt</div>
        </div>
        <div className="p-4 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 rounded-xl border border-yellow-500/20">
          <div className="text-2xl font-bold text-yellow-400">{stats.inProgress}</div>
          <div className="text-xs text-white/50">In Arbeit</div>
        </div>
        <div className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-xl border border-purple-500/20">
          <div className="text-2xl font-bold text-purple-400">{stats.completed}</div>
          <div className="text-xs text-white/50">Abgeschlossen</div>
        </div>
      </div>

      {/* Header with Search & Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FC682C] to-[#9D65C9] flex items-center justify-center">
              <UserGroupIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Portal-Kunden</h2>
              <p className="text-sm text-white/40">{filteredClients.length} von {clients.length} angezeigt</p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleExportCSV}
              className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white/70 flex items-center gap-1.5 transition-colors"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-[#FC682C] to-[#FF8F5C] text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <PlusIcon className="w-4 h-4" />
              Neuer Kunde
            </button>
          </div>
        </div>
        
        {/* Filters Row */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm focus:border-[#FC682C]/50 outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm focus:border-[#FC682C]/50 outline-none"
          >
            <option value="all">Alle Status</option>
            <option value="active">Aktiv</option>
            <option value="inactive">Inaktiv</option>
            <option value="paused">Pausiert</option>
          </select>
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm focus:border-[#FC682C]/50 outline-none"
          >
            <option value="all">Alle Projekte</option>
            <option value="with">Mit Projekt</option>
            <option value="without">Ohne Projekt</option>
            <option value="planung">In Planung</option>
            <option value="entwicklung">In Entwicklung</option>
            <option value="abgeschlossen">Abgeschlossen</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm focus:border-[#FC682C]/50 outline-none"
          >
            <option value="created">Neueste zuerst</option>
            <option value="name">Name A-Z</option>
            <option value="activity">Letzte Aktivität</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 p-3 bg-[#FC682C]/10 border border-[#FC682C]/30 rounded-xl">
          <span className="text-sm text-white font-medium">{selectedIds.size} ausgewählt</span>
          <div className="flex-1" />
          <button
            onClick={() => handleBulkStatusChange("active")}
            className="px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-xs text-green-400 transition-colors"
          >
            Aktivieren
          </button>
          <button
            onClick={() => handleBulkStatusChange("inactive")}
            className="px-3 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg text-xs text-yellow-400 transition-colors"
          >
            Deaktivieren
          </button>
          <button
            onClick={handleBulkDelete}
            className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-xs text-red-400 transition-colors"
          >
            Löschen
          </button>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs text-white/70 transition-colors"
          >
            Abbrechen
          </button>
        </div>
      )}

      {/* Client List */}
      <div className="bg-[#0f0f12]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:flex items-center gap-4 px-4 py-3 bg-white/[0.02] border-b border-white/[0.06] text-xs text-white/50 font-medium">
          <div className="w-8">
            <input
              type="checkbox"
              checked={selectedIds.size === filteredClients.length && filteredClients.length > 0}
              onChange={handleSelectAll}
              className="w-4 h-4 rounded bg-white/10 border-white/20 text-[#FC682C] focus:ring-[#FC682C]"
            />
          </div>
          <div className="flex-1">KUNDE</div>
          <div className="w-32">CODE</div>
          <div className="w-32">PROJEKT</div>
          <div className="w-24">STATUS</div>
          <div className="w-32">AKTIONEN</div>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-white/40">Laden...</div>
        ) : filteredClients.length === 0 ? (
          <div className="p-8 text-center text-white/40">
            {searchTerm ? "Keine Kunden gefunden" : "Noch keine Portal-Kunden vorhanden"}
          </div>
        ) : (
          <div className="divide-y divide-white/[0.06]">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                className={`p-4 hover:bg-white/[0.02] transition-colors ${selectedIds.has(client.id) ? 'bg-[#FC682C]/5' : ''}`}
              >
                <div className="flex items-center gap-4">
                  {/* Checkbox */}
                  <div className="w-8 hidden md:block">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(client.id)}
                      onChange={(e) => { e.stopPropagation(); handleSelect(client.id); }}
                      className="w-4 h-4 rounded bg-white/10 border-white/20 text-[#FC682C] focus:ring-[#FC682C]"
                    />
                  </div>
                  
                  {/* Client Info */}
                  <div 
                    className="flex-1 flex items-center gap-3 min-w-0 cursor-pointer"
                    onClick={() => setSelectedClient(client)}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FC682C]/20 to-[#9D65C9]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-white">
                        {client.name.split(" ").map((n) => n[0]).join("").toUpperCase()
                          .slice(0, 2)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-white truncate">
                          {client.name}
                        </h3>
                        {client.unread_messages > 0 && (
                          <span className="px-1.5 py-0.5 bg-[#FC682C] text-white text-[10px] rounded-full font-medium">
                            {client.unread_messages}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/40">
                        <span className="truncate">{client.email}</span>
                        {client.company && (
                          <span className="hidden sm:inline">
                            • {client.company}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Access Code */}
                  <div className="w-32 hidden md:block">
                    <div className="text-sm font-mono text-[#FC682C]">{client.access_code}</div>
                  </div>
                  
                  {/* Project Status */}
                  <div className="w-32 hidden md:block">
                    {client.project_status ? (
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(client.project_status)}`}>
                          {client.progress}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-white/30">Kein Projekt</span>
                    )}
                  </div>
                  
                  {/* Client Status */}
                  <div className="w-24 hidden md:block">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      client.status === "active" ? "bg-green-500/20 text-green-400" :
                      client.status === "inactive" ? "bg-red-500/20 text-red-400" :
                      "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {client.status === "active" ? "Aktiv" : client.status === "inactive" ? "Inaktiv" : "Pausiert"}
                    </span>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="w-44 flex items-center justify-end gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedClient(client); setQuickDocTab("dokumente"); }}
                      className="p-2 hover:bg-[#FC682C]/10 rounded-lg transition-colors group"
                      title="Dokument erstellen"
                    >
                      <DocumentTextIcon className="w-4 h-4 text-white/40 group-hover:text-[#FC682C]" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); copyPortalLink(client.access_code); }}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
                      title="Portal-Link kopieren"
                    >
                      <LinkIcon className="w-4 h-4 text-white/40 group-hover:text-[#FC682C]" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); window.open(`mailto:${client.email}`); }}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
                      title="Email senden"
                    >
                      <EnvelopeIcon className="w-4 h-4 text-white/40 group-hover:text-blue-400" />
                    </button>
                    {client.telegram_username && (
                      <button
                        onClick={(e) => { e.stopPropagation(); window.open(`https://t.me/${client.telegram_username}`); }}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
                        title="Telegram öffnen"
                      >
                        <ChatBubbleLeftRightIcon className="w-4 h-4 text-white/40 group-hover:text-[#0088cc]" />
                      </button>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedClient(client); }}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      title="Details"
                    >
                      <ChevronRightIcon className="w-4 h-4 text-white/40" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Client Detail Modal */}
      {selectedClient && (
        <ClientDetailModal
          client={selectedClient}
          onClose={() => { setSelectedClient(null); setQuickDocTab(null); }}
          onUpdate={fetchClients}
          initialTab={quickDocTab as any}
        />
      )}

      {/* Create Client Modal */}
      {showCreateModal && (
        <CreateClientModal
          onClose={() => setShowCreateModal(false)}
          onCreated={fetchClients}
        />
      )}
    </div>
  );
}

// AgentFlowMarketing logo as base64 PNG
const AFM_LOGO_BASE64 = "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";

const AFM_SIEGEL_BASE64 = "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";

function generatePosterHTML(client: any, form: any): string {
  const scoreColor = form.scoreOverall >= 80 ? "#10B981" : form.scoreOverall >= 60 ? "#F59E0B" : "#EF4444";
  const scoreDash = Math.round((form.scoreOverall / 100) * 264);
  const now = new Date();
  const monthNames = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
  const dateStr = monthNames[now.getMonth()] + " " + now.getFullYear();
  const logoSrc = "data:image/png;base64," + AFM_LOGO_BASE64;

  // Result icons with colored SVG icons (rotating colors)
  const resultIcons = [
    { color: "teal", bg: "linear-gradient(135deg,#10B981,#34D399)", svg: '<svg viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>' },
    { color: "purple", bg: "linear-gradient(135deg,#6366F1,#818CF8)", svg: '<svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>' },
    { color: "orange", bg: "linear-gradient(135deg,#FF6A00,#FF8533)", svg: '<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
    { color: "blue", bg: "linear-gradient(135deg,#3B82F6,#60A5FA)", svg: '<svg viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>' },
    { color: "teal", bg: "linear-gradient(135deg,#10B981,#34D399)", svg: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/></svg>' },
    { color: "purple", bg: "linear-gradient(135deg,#6366F1,#818CF8)", svg: '<svg viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>' },
  ];

  const resultsHTML = form.results.map((r: string, i: number) => {
    const icon = resultIcons[i % resultIcons.length];
    return `<div class="result-item">
      <div class="result-icon" style="background:${icon.bg}">${icon.svg}</div>
      <span class="result-text">${r}</span>
    </div>`;
  }).join("");

  // Original Agent SVGs from Agent Character Kit (1:1 exact copies)
  const agentOriginalSvg: Record<string, { svg: string; bg: string; border: string; text: string; dot: string }> = {
    "E-Mail Agent": {
      bg: "rgba(59,130,246,.15)", border: "rgba(59,130,246,.3)", text: "#60A5FA", dot: "#3b82f6",
      svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ge" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><path d="M12 64 L12 30 C12 14, 26 8, 40 8 C54 8, 68 14, 68 30 L68 64" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/><g filter="url(#ge)"><circle cx="28" cy="40" r="9" fill="#3b82f6"/></g><circle cx="31" cy="37" r="2.5" fill="#ffffff" opacity="0.9"/><g filter="url(#ge)"><circle cx="52" cy="40" r="9" fill="#3b82f6"/></g><circle cx="55" cy="37" r="2.5" fill="#ffffff" opacity="0.9"/><rect x="56" y="4" width="18" height="13" rx="2.5" fill="#3b82f6"/><path d="M58 7 L65 11.5 L72 7" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><line x1="58" y1="14" x2="62" y2="11" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round" opacity="0.6"/><line x1="72" y1="14" x2="68" y2="11" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round" opacity="0.6"/></svg>`
    },
    "Chat Agent": {
      bg: "rgba(16,185,129,.15)", border: "rgba(16,185,129,.3)", text: "#34D399", dot: "#10b981",
      svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><filter id="gc" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><path d="M12 64 L12 30 C12 14, 26 8, 40 8 C54 8, 68 14, 68 30 L68 64" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/><g filter="url(#gc)"><circle cx="28" cy="40" r="9" fill="#10b981"/></g><circle cx="31" cy="37" r="2.5" fill="#ffffff" opacity="0.9"/><g filter="url(#gc)"><circle cx="52" cy="40" r="9" fill="#10b981"/></g><circle cx="55" cy="37" r="2.5" fill="#ffffff" opacity="0.9"/><rect x="54" y="3" width="20" height="14" rx="3" fill="#10b981"/><path d="M54 17 L60 17 L57 22 Z" fill="#10b981"/><circle cx="60" cy="10" r="1.5" fill="#ffffff"/><circle cx="64" cy="10" r="1.5" fill="#ffffff"/><circle cx="68" cy="10" r="1.5" fill="#ffffff"/></svg>`
    },
    "Vertriebs Agent": {
      bg: "rgba(139,92,246,.15)", border: "rgba(139,92,246,.3)", text: "#A78BFA", dot: "#8b5cf6",
      svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><filter id="gs" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><path d="M12 64 L12 30 C12 14, 26 8, 40 8 C54 8, 68 14, 68 30 L68 64" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/><g filter="url(#gs)"><circle cx="28" cy="40" r="9" fill="#8b5cf6"/></g><circle cx="31" cy="37" r="2.5" fill="#ffffff" opacity="0.9"/><g filter="url(#gs)"><circle cx="52" cy="40" r="9" fill="#8b5cf6"/></g><circle cx="55" cy="37" r="2.5" fill="#ffffff" opacity="0.9"/><circle cx="65" cy="12" r="9" fill="none" stroke="#8b5cf6" stroke-width="2.5"/><circle cx="65" cy="12" r="4.5" fill="none" stroke="#8b5cf6" stroke-width="2"/><circle cx="65" cy="12" r="1.5" fill="#8b5cf6"/><line x1="65" y1="2" x2="65" y2="6" stroke="#8b5cf6" stroke-width="1.5" stroke-linecap="round"/><line x1="65" y1="18" x2="65" y2="22" stroke="#8b5cf6" stroke-width="1.5" stroke-linecap="round"/></svg>`
    },
    "Termin Agent": {
      bg: "rgba(6,182,212,.15)", border: "rgba(6,182,212,.3)", text: "#22D3EE", dot: "#06b6d4",
      svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><filter id="gt" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><path d="M12 64 L12 30 C12 14, 26 8, 40 8 C54 8, 68 14, 68 30 L68 64" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/><g filter="url(#gt)"><circle cx="28" cy="40" r="9" fill="#06b6d4"/></g><circle cx="31" cy="37" r="2.5" fill="#ffffff" opacity="0.9"/><g filter="url(#gt)"><circle cx="52" cy="40" r="9" fill="#06b6d4"/></g><circle cx="55" cy="37" r="2.5" fill="#ffffff" opacity="0.9"/><rect x="54" y="5" width="20" height="17" rx="2.5" fill="#06b6d4"/><rect x="54" y="5" width="20" height="5" rx="2.5" fill="#0891b2"/><circle cx="58" cy="7.5" r="1" fill="#ffffff"/><circle cx="70" cy="7.5" r="1" fill="#ffffff"/><rect x="57" y="13" width="4" height="3" rx="0.5" fill="#ffffff"/><rect x="63" y="13" width="4" height="3" rx="0.5" fill="#ffffff"/><rect x="57" y="17.5" width="4" height="3" rx="0.5" fill="#ffffff" opacity="0.5"/><rect x="63" y="17.5" width="4" height="3" rx="0.5" fill="#ffffff" opacity="0.5"/></svg>`
    },
    "Analyse Agent": {
      bg: "rgba(245,158,11,.15)", border: "rgba(245,158,11,.3)", text: "#FBBF24", dot: "#f59e0b",
      svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ga" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><path d="M12 64 L12 30 C12 14, 26 8, 40 8 C54 8, 68 14, 68 30 L68 64" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/><g filter="url(#ga)"><circle cx="28" cy="40" r="9" fill="#f59e0b"/></g><circle cx="31" cy="37" r="2.5" fill="#ffffff" opacity="0.9"/><g filter="url(#ga)"><circle cx="52" cy="40" r="9" fill="#f59e0b"/></g><circle cx="55" cy="37" r="2.5" fill="#ffffff" opacity="0.9"/><rect x="54" y="4" width="20" height="18" rx="2.5" fill="#f59e0b"/><rect x="57" y="15" width="3" height="5" rx="0.5" fill="#ffffff"/><rect x="61.5" y="11" width="3" height="9" rx="0.5" fill="#ffffff"/><rect x="66" y="7" width="3" height="13" rx="0.5" fill="#ffffff"/><path d="M57 13 L62 9 L68 5" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/></svg>`
    },
    "Compliance Agent": {
      bg: "rgba(5,150,105,.15)", border: "rgba(5,150,105,.3)", text: "#34D399", dot: "#059669",
      svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><filter id="gco" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><path d="M12 64 L12 30 C12 14, 26 8, 40 8 C54 8, 68 14, 68 30 L68 64" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/><g filter="url(#gco)"><circle cx="28" cy="40" r="9" fill="#059669"/></g><circle cx="31" cy="37" r="2.5" fill="#ffffff" opacity="0.9"/><g filter="url(#gco)"><circle cx="52" cy="40" r="9" fill="#059669"/></g><circle cx="55" cy="37" r="2.5" fill="#ffffff" opacity="0.9"/><path d="M65 3 L76 6.5 L76 14 C76 19, 71 24, 65 26 C59 24, 54 19, 54 14 L54 6.5 Z" fill="#059669"/><path d="M60 14 L63.5 17.5 L71 10" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    },
    "Automatisierung": {
      bg: "rgba(99,102,241,.15)", border: "rgba(99,102,241,.3)", text: "#818CF8", dot: "#6366f1",
      svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><filter id="gau" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><path d="M12 64 L12 30 C12 14, 26 8, 40 8 C54 8, 68 14, 68 30 L68 64" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/><g filter="url(#gau)"><circle cx="28" cy="40" r="9" fill="#6366f1"/></g><circle cx="31" cy="37" r="2.5" fill="#ffffff" opacity="0.9"/><g filter="url(#gau)"><circle cx="52" cy="40" r="9" fill="#6366f1"/></g><circle cx="55" cy="37" r="2.5" fill="#ffffff" opacity="0.9"/><circle cx="56" cy="12" r="5" fill="#6366f1" stroke="#ffffff" stroke-width="1.5"/><circle cx="74" cy="12" r="5" fill="#6366f1" stroke="#ffffff" stroke-width="1.5"/><line x1="61" y1="12" x2="69" y2="12" stroke="#6366f1" stroke-width="3"/><path d="M66 8 L70 12 L66 16" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    },
    "Enterprise Pro": {
      bg: "rgba(234,179,8,.12)", border: "rgba(234,179,8,.3)", text: "#FCD34D", dot: "#eab308",
      svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fde047"/><stop offset="100%" stop-color="#eab308"/></linearGradient><filter id="gen" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter><filter id="starGlow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><path d="M12 64 L12 30 C12 14, 26 8, 40 8 C54 8, 68 14, 68 30 L68 64" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/><g filter="url(#gen)"><circle cx="28" cy="40" r="9" fill="url(#goldGrad)"/></g><circle cx="31" cy="37" r="2.5" fill="#ffffff" opacity="0.9"/><g filter="url(#gen)"><circle cx="52" cy="40" r="9" fill="url(#goldGrad)"/></g><circle cx="55" cy="37" r="2.5" fill="#ffffff" opacity="0.9"/><g filter="url(#starGlow)"><polygon points="65,1 68,9 76,9 70,14 72,22 65,17 58,22 60,14 54,9 62,9" fill="url(#goldGrad)"/></g></svg>`
    },
  };
  const defaultAgentData = { bg: "rgba(99,102,241,.15)", border: "rgba(99,102,241,.25)", text: "#818CF8", dot: "#6366f1", svg: "" };

  // Get original SVG at specified size
  function agentRobotSvg(name: string, size: number): string {
    const a = agentOriginalSvg[name];
    if (!a) return "";
    // Replace width/height in the SVG to render at desired size
    return a.svg.replace(/viewBox="0 0 80 80"/, `viewBox="0 0 80 80" width="${size}" height="${size}"`);
  }

  const agentsHTML = form.agents.map((a: string) => {
    const c = agentOriginalSvg[a] || defaultAgentData;
    const robotSvg = agentRobotSvg(a, 56);
    return `<div style="display:flex;flex-direction:column;align-items:center;gap:8px;padding:14px 12px;background:${c.bg};border:1px solid ${c.border};border-radius:14px;min-width:100px">
      ${robotSvg}
      <span style="font-size:11px;color:${c.text};font-weight:700;text-align:center;line-height:1.2">${a}</span>
    </div>`;
  }).join("");

  // Website screenshot card with siegel overlay
  const screenshotSection = form.screenshotUrl ? `
    <div class="card website-section">
      <div class="card-header">
        <div class="card-title"><span class="card-dot orange"></span>Website</div>
        <span class="card-badge">${client.company || client.name}</span>
      </div>
      <div class="website-container">
        <div class="website-frame">
          <img src="${form.screenshotUrl}" alt="Website Screenshot"/>
        </div>
      </div>
      <div class="siegel-overlay">
        <img src="data:image/png;base64,${AFM_SIEGEL_BASE64}" alt="AgentFlow Siegel" style="width:100%;height:100%;object-fit:contain;border-radius:50%;" />
      </div>
    </div>` : "";

  // Workflow nodes from form agents — color matched to AgentFlow agents
  const workflowAgentNames = form.agents.length > 0 ? form.agents : ["E-Mail Agent", "Chat Agent", "Vertriebs Agent", "Analyse Agent", "Enterprise Pro"];
  const nodeCount = Math.min(workflowAgentNames.length, 8);
  const nodeWidth = nodeCount <= 5 ? 130 : nodeCount <= 6 ? 110 : 95;
  const svgWidth = 900;
  const spacing = (svgWidth - nodeCount * nodeWidth) / (nodeCount + 1);
  const agentNodeColorMap: Record<string, { grad: string; stroke: string; label: string }> = {
    "E-Mail Agent": { grad: "blueGrad", stroke: "#3B82F6", label: "#60A5FA" },
    "Chat Agent": { grad: "tealGrad", stroke: "#10B981", label: "#34D399" },
    "Vertriebs Agent": { grad: "purpleGrad", stroke: "#8b5cf6", label: "#A78BFA" },
    "Termin Agent": { grad: "blueGrad", stroke: "#06b6d4", label: "#22D3EE" },
    "Analyse Agent": { grad: "orangeGrad", stroke: "#f59e0b", label: "#FBBF24" },
    "Compliance Agent": { grad: "tealGrad", stroke: "#059669", label: "#34D399" },
    "Automatisierung": { grad: "purpleGrad", stroke: "#6366f1", label: "#818CF8" },
    "Enterprise Pro": { grad: "orangeGrad", stroke: "#EAB308", label: "#FCD34D" },
  };
  const defaultNodeColor = { grad: "purpleGrad", stroke: "#3A4055", label: "#6366F1" };
  const nodeColors = workflowAgentNames.map((name: string) => agentNodeColorMap[name] || defaultNodeColor);
  let workflowNodesHTML = "";
  const nodePositions: { x: number; cx: number }[] = [];
  for (let i = 0; i < nodeCount; i++) {
    const x = spacing + i * (nodeWidth + spacing);
    const cx = x + nodeWidth / 2;
    nodePositions.push({ x, cx });
    const c = nodeColors[i];
    const name = workflowAgentNames[i].toUpperCase().substring(0, 16);
    const isLast = i === nodeCount - 1;
    workflowNodesHTML += `<g filter="url(#node3d)">
      <rect x="${x}" y="30" width="${nodeWidth}" height="70" rx="12" fill="url(#node3dGrad)" stroke="${c.stroke}" stroke-width="2"/>
      <rect x="${x}" y="30" width="${nodeWidth}" height="24" rx="12" fill="url(#${c.grad})"/>
      <rect x="${x}" y="46" width="${nodeWidth}" height="8" fill="url(#${c.grad})"/>
      <text x="${cx}" y="47" text-anchor="middle" fill="#fff" font-size="8" font-weight="700">${name}</text>
      ${isLast ? `<circle cx="${cx}" cy="78" r="16" fill="#1A2028"/><circle cx="${cx}" cy="78" r="12" fill="url(#${c.grad})" filter="url(#glow3d)"/><path d="M${cx-7} 78 L${cx-2} 83 L${cx+8} 72" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>` : `<circle cx="${cx}" cy="78" r="14" fill="#252A3A"/><circle cx="${cx}" cy="78" r="8" fill="url(#${c.grad})" filter="url(#glow3d)"/>`}
    </g>`;
  }
  // Connection lines between nodes
  let connectionsHTML = "";
  for (let i = 0; i < nodePositions.length - 1; i++) {
    const x1 = nodePositions[i].x + nodeWidth;
    const x2 = nodePositions[i + 1].x;
    connectionsHTML += `<path d="M${x1} 65 L${x2} 65" stroke="url(#lineGrad)" stroke-width="4" stroke-linecap="round"/>`;
    connectionsHTML += `<circle cx="${x1}" cy="65" r="5" fill="#6366F1" filter="url(#glow3d)"/>`;
    connectionsHTML += `<circle cx="${x2}" cy="65" r="5" fill="#10B981" filter="url(#glow3d)"/>`;
  }

  return `<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Projektabschluss — ${client.company || client.name} | AgentFlowMarketing</title>
<style>
@page { size: A1; margin: 0; }
:root {
  --bg-dark: #04060A; --bg-card: #0A0D14; --bg-card2: #0F131C; --bg-card3: #161C2A;
  --text: #F5F7FA; --text-muted: rgba(245,247,250,.5);
  --border: rgba(255,255,255,.06); --border-light: rgba(255,255,255,.12);
  --accent: #FF6A00; --accent-glow: rgba(255,106,0,.5);
  --purple: #6366F1; --purple-glow: rgba(99,102,241,.6);
  --teal: #10B981; --teal-glow: rgba(16,185,129,.6);
  --blue: #3B82F6; --blue-glow: rgba(59,130,246,.5);
}
* { margin: 0; padding: 0; box-sizing: border-box; }

@media screen {
  html { background: #020304; }
  body { width: 100%; min-height: 100vh; overflow-y: auto; display: flex; justify-content: center; padding: 40px 20px; }
  .poster { width: 95vw; max-width: 1000px; border-radius: 20px; box-shadow: 0 0 0 1px rgba(255,255,255,.05), 0 60px 180px rgba(0,0,0,.95), 0 0 300px rgba(99,102,241,.08); }
  .content { padding: 5vw; }
  .header { margin-bottom: 3.5vw; padding-bottom: 2.5vw; }
  .brand-icon { width: 5.5vw; height: 5.5vw; min-width: 48px; min-height: 48px; }
  .brand-name { font-size: max(2.2vw, 17px); }
  .case-badge { font-size: max(1.1vw, 11px); padding: 0.8vw 1.6vw; }
  .hero { margin-bottom: 4vw; }
  .hero-label { font-size: max(1.1vw, 10px); padding: 0.7vw 2vw; margin-bottom: 2vw; }
  .hero h1 { font-size: max(7.5vw, 34px); margin-bottom: 1.2vw; }
  .hero .client { font-size: max(3vw, 19px); margin-bottom: 1vw; }
  .hero .tagline { font-size: max(1.5vw, 12px); }
  .card { border-radius: 2.2vw; margin-bottom: 3vw; }
  .card-header { padding: 1.5vw 2vw; }
  .card-title { font-size: max(1.4vw, 13px); gap: 1vw; }
  .card-dot { width: max(1vw, 10px); height: max(1vw, 10px); }
  .card-badge { font-size: max(1vw, 10px); padding: 0.6vw 1.2vw; }
  .website-container { padding: 2.5vw; }
  .website-frame { border-radius: 1.5vw; }
  .siegel-overlay { width: 7vw; height: 7vw; min-width: 50px; min-height: 50px; right: 3.5vw; bottom: 5vw; }
  .workflow-content { padding: 3.5vw; gap: 2.5vw; }
  .workflow-header { gap: 2vw; margin-bottom: 2vw; }
  .agent-badge { width: 9vw; height: 9vw; min-width: 60px; min-height: 60px; }
  .workflow-title { font-size: max(1.6vw, 14px); }
  .workflow-subtitle { font-size: max(1.1vw, 11px); }
  .workflow-canvas { height: 20vw; min-height: 140px; }
  .bottom-section { gap: 2vw; }
  .bottom-section .card { margin-bottom: 0; }
  .stats-content { padding: 2.5vw; gap: 2vw; }
  .stats-main { gap: 1vw; }
  .stats-main-circle { width: 11vw; height: 11vw; min-width: 80px; min-height: 80px; }
  .stats-main-value { font-size: max(3vw, 22px); }
  .stats-main-label { font-size: max(1vw, 9px); }
  .stats-grid { gap: 1vw; }
  .stat-mini { padding: 1vw; border-radius: 0.8vw; }
  .stat-mini-value { font-size: max(1.6vw, 14px); }
  .stat-mini-label { font-size: max(0.8vw, 8px); }
  .stat-mini-bar { height: max(0.4vw, 3px); border-radius: 0.2vw; margin-top: 0.5vw; }
  .results-content { padding: 1.8vw; gap: 1vw; }
  .result-item { padding: 0.8vw 1vw; border-radius: 0.8vw; gap: 0.7vw; }
  .result-icon { width: max(2.4vw, 20px); height: max(2.4vw, 20px); flex-shrink: 0; }
  .result-text { font-size: max(0.95vw, 8px); }
  .footer { margin-top: 3.5vw; padding-top: 2.5vw; gap: 2vw; }
  .footer-logo { width: 5.5vw; height: 5.5vw; min-width: 44px; min-height: 44px; }
  .footer-info { font-size: max(1.2vw, 11px); }
  .footer-thanks { font-size: max(1.8vw, 15px); }
}

@media print {
  html, body { width: 594mm; height: 841mm; margin: 0; padding: 0; overflow: hidden; }
  .poster { width: 594mm; height: 841mm; }
  .content { padding: 22mm 26mm; }
  .header { margin-bottom: 14mm; padding-bottom: 10mm; }
  .brand-icon { width: 20mm; height: 20mm; }
  .brand-name { font-size: 9mm; }
  .case-badge { font-size: 4.5mm; padding: 3mm 6mm; }
  .hero { margin-bottom: 16mm; }
  .hero-label { font-size: 4.5mm; padding: 3mm 7mm; margin-bottom: 6mm; }
  .hero h1 { font-size: 34mm; margin-bottom: 5mm; }
  .hero .client { font-size: 13mm; margin-bottom: 4mm; }
  .hero .tagline { font-size: 6mm; }
  .card { border-radius: 8mm; margin-bottom: 10mm; }
  .card-header { padding: 5mm 7mm; }
  .card-title { font-size: 5.5mm; gap: 3mm; }
  .card-dot { width: 3.5mm; height: 3.5mm; }
  .card-badge { font-size: 4mm; padding: 2mm 5mm; }
  .website-container { padding: 8mm; }
  .website-frame { border-radius: 6mm; }
  .siegel-overlay { width: 28mm; height: 28mm; right: 14mm; bottom: 22mm; }
  .workflow-content { padding: 12mm; gap: 10mm; }
  .workflow-header { gap: 8mm; margin-bottom: 8mm; }
  .agent-badge { width: 35mm; height: 35mm; }
  .workflow-title { font-size: 6mm; }
  .workflow-subtitle { font-size: 4.5mm; }
  .workflow-canvas { height: 80mm; }
  .bottom-section { gap: 10mm; }
  .stats-content { padding: 10mm; gap: 10mm; }
  .stats-main-circle { width: 45mm; height: 45mm; }
  .stats-main-value { font-size: 12mm; }
  .stats-main-label { font-size: 4mm; }
  .stats-grid { gap: 5mm; }
  .stat-mini { padding: 5mm; border-radius: 3mm; }
  .stat-mini-value { font-size: 7mm; }
  .stat-mini-label { font-size: 3mm; }
  .stat-mini-bar { height: 2mm; border-radius: 1mm; margin-top: 2mm; }
  .results-content { padding: 8mm; gap: 5mm; }
  .result-item { padding: 4mm 5mm; border-radius: 3mm; gap: 4mm; }
  .result-icon { width: 12mm; height: 12mm; }
  .result-text { font-size: 4mm; }
  .footer { margin-top: 12mm; padding-top: 10mm; }
  .footer-logo { width: 18mm; height: 18mm; }
  .footer-info { font-size: 5mm; }
  .footer-thanks { font-size: 7mm; }
}

html, body {
  background: var(--bg-dark);
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', system-ui, sans-serif;
  color: var(--text);
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.poster {
  position: relative; overflow: hidden;
  background:
    radial-gradient(ellipse 140% 70% at 50% -20%, rgba(99,102,241,.2) 0%, transparent 50%),
    radial-gradient(ellipse 100% 60% at 120% 50%, rgba(255,106,0,.15) 0%, transparent 50%),
    radial-gradient(ellipse 80% 70% at -20% 100%, rgba(16,185,129,.12) 0%, transparent 50%),
    linear-gradient(180deg, #0C0F16 0%, #040608 100%);
}
.poster::before {
  content: ''; position: absolute; inset: 0;
  background-image: linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 20%, transparent 70%);
  pointer-events: none;
}
.content { position: relative; z-index: 1; display: flex; flex-direction: column; }

.header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); }
.brand { display: flex; align-items: center; gap: 1.5vw; }
.brand-icon { background: #000; border-radius: 25%; border: 2px solid var(--border-light); overflow: hidden; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 25px rgba(0,0,0,.6), 0 0 40px var(--accent-glow); }
.brand-name { font-weight: 800; letter-spacing: -0.03em; }
.brand-name span { color: var(--accent); text-shadow: 0 0 30px var(--accent-glow); }
.case-badge { background: linear-gradient(135deg, var(--accent), #E55500); color: #000; font-weight: 800; border-radius: 10px; box-shadow: 0 6px 20px var(--accent-glow); }

.hero { text-align: center; }
.hero-label { display: inline-flex; align-items: center; gap: 0.5em; font-weight: 700; color: var(--purple); letter-spacing: 0.2em; text-transform: uppercase; background: rgba(99,102,241,.12); border: 1px solid rgba(99,102,241,.25); border-radius: 10px; }
.hero h1 { font-weight: 900; letter-spacing: -0.05em; line-height: 0.9; background: linear-gradient(180deg, #FFFFFF 10%, #6B7280 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.hero .client { font-weight: 700; color: var(--accent); }
.hero .tagline { color: var(--text-muted); }

.card { background: linear-gradient(170deg, var(--bg-card3) 0%, var(--bg-card) 100%); border: 1px solid var(--border); overflow: visible; box-shadow: 0 25px 80px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.06); position: relative; }
.card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,.1), transparent); }
.card-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); background: linear-gradient(180deg, rgba(255,255,255,.03) 0%, transparent 100%); }
.card-title { display: flex; align-items: center; font-weight: 700; }
.card-dot { border-radius: 50%; box-shadow: 0 0 15px currentColor; }
.card-dot.orange { background: var(--accent); color: var(--accent-glow); }
.card-dot.purple { background: var(--purple); color: var(--purple-glow); }
.card-dot.teal { background: var(--teal); color: var(--teal-glow); }
.card-badge { color: var(--text-muted); background: rgba(255,255,255,.05); border: 1px solid var(--border); border-radius: 8px; font-weight: 600; }

.website-section { position: relative; overflow: visible; }
.website-container { background: linear-gradient(180deg, var(--bg-card2) 0%, var(--bg-card) 100%); }
.website-frame { position: relative; overflow: hidden; border: 2px solid var(--border-light); box-shadow: 0 20px 60px rgba(0,0,0,.6); }
.website-frame img { width: 100%; height: auto; display: block; }
.website-frame::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 20%; background: linear-gradient(to top, var(--bg-card) 0%, transparent 100%); pointer-events: none; }
.siegel-overlay { position: absolute; z-index: 10; filter: drop-shadow(0 8px 25px rgba(0,0,0,.8)); border-radius: 50%; overflow: hidden; background: transparent; }

.workflow-content { display: flex; flex-direction: column; background: radial-gradient(ellipse 60% 40% at 50% 20%, rgba(99,102,241,.1) 0%, transparent 60%), linear-gradient(180deg, #0D1018 0%, #080A10 100%); }
.workflow-header { display: flex; align-items: center; }
.agent-badge { background: #000; border: 2px solid var(--purple); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 40px var(--purple-glow), 0 10px 30px rgba(0,0,0,.6); overflow: hidden; }
.workflow-info { display: flex; flex-direction: column; gap: 0.3vw; }
.workflow-title { font-weight: 800; color: var(--text); }
.workflow-subtitle { color: var(--text-muted); }
.workflow-canvas { width: 100%; flex: 1; }
.workflow-svg { width: 100%; height: 100%; }

.bottom-section { display: grid; grid-template-columns: 1fr 1fr; min-height: 32vw; }
.bottom-section .card { display: flex; flex-direction: column; }

.stats-content { display: flex; align-items: center; justify-content: center; background: radial-gradient(ellipse 80% 60% at 30% 50%, rgba(16,185,129,.08) 0%, transparent 60%), linear-gradient(180deg, var(--bg-card2), var(--bg-card)); flex: 1; }
.stats-main { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
.stats-main-circle { position: relative; display: flex; align-items: center; justify-content: center; }
.stats-main-circle svg { width: 100%; height: 100%; transform: rotate(-90deg); filter: drop-shadow(0 0 20px var(--teal-glow)); }
.stats-main-circle .track { fill: none; stroke: #1A1F2A; stroke-width: 8; }
.stats-main-circle .progress { fill: none; stroke: url(#statsGradient); stroke-width: 8; stroke-linecap: round; }
.stats-main-value { position: absolute; font-weight: 900; color: var(--teal); text-shadow: 0 0 30px var(--teal-glow); }
.stats-main-label { color: var(--text-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 0.8vw; white-space: nowrap; }
.stats-grid { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; flex: 1; align-content: center; }
.stat-mini { display: flex; flex-direction: column; justify-content: center; background: linear-gradient(150deg, rgba(255,255,255,.04) 0%, rgba(255,255,255,.01) 100%); border: 1px solid var(--border); position: relative; }
.stat-mini::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(16,185,129,.3), transparent); }
.stat-mini-header { display: flex; justify-content: space-between; align-items: center; }
.stat-mini-value { font-weight: 800; color: var(--teal); text-shadow: 0 0 15px var(--teal-glow); }
.stat-mini-label { color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
.stat-mini-bar { width: 100%; background: rgba(16,185,129,.15); overflow: hidden; }
.stat-mini-bar-fill { height: 100%; background: linear-gradient(90deg, var(--teal), #34D399); border-radius: inherit; box-shadow: 0 0 8px var(--teal-glow); }

.results-content { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: repeat(3, 1fr); background: radial-gradient(ellipse 80% 60% at 70% 50%, rgba(255,106,0,.06) 0%, transparent 60%), linear-gradient(180deg, var(--bg-card2), var(--bg-card)); flex: 1; align-content: stretch; }
.result-item { display: flex; align-items: center; background: linear-gradient(150deg, rgba(255,255,255,.03) 0%, transparent 100%); border: 1px solid var(--border); position: relative; overflow: hidden; }
.result-item::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,.08), transparent); }
.result-icon { display: flex; align-items: center; justify-content: center; border-radius: 50%; flex-shrink: 0; position: relative; }
.result-icon::after { content: ''; position: absolute; inset: -4px; border-radius: 50%; background: inherit; opacity: 0.3; filter: blur(8px); }
.result-icon svg { width: 50%; height: 50%; stroke: #fff; stroke-width: 2.5; fill: none; position: relative; z-index: 1; }
.result-text { font-weight: 700; color: var(--text); line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border); flex-wrap: wrap; }
.footer-brand { display: flex; align-items: center; gap: 1.5vw; }
.footer-logo { background: #000; border: 2px solid var(--border-light); border-radius: 12px; overflow: hidden; box-shadow: 0 0 30px var(--accent-glow); display: flex; align-items: center; justify-content: center; }
.footer-info { color: var(--text-muted); line-height: 1.6; }
.footer-info a { color: var(--accent); text-decoration: none; font-weight: 700; }
.footer-thanks { font-style: italic; color: var(--text); font-weight: 600; }
</style></head><body>

<div class="poster"><div class="content">

<!-- HEADER -->
<header class="header">
  <div class="brand">
    <div class="brand-icon"><img src="${logoSrc}" alt="AgentFlow" style="width:100%;height:100%;object-fit:cover"/></div>
    <div class="brand-name">AgentFlow<span>Marketing</span></div>
  </div>
  <span class="case-badge">CASE STUDY \u00B7 ${dateStr}</span>
</header>

<!-- HERO -->
<section class="hero">
  <span class="hero-label">\u2726 Projektabschluss</span>
  <h1>${client.company || client.name}</h1>
  <p class="client">${form.projectType}</p>
  <p class="tagline">${form.tagline}</p>
</section>

<!-- WEBSITE -->
${screenshotSection}

<!-- AGENTS -->
<div class="card">
  <div class="card-header">
    <div class="card-title"><span class="card-dot purple"></span>AI-Agenten</div>
    <span class="card-badge">${form.agents.length} Agenten aktiv</span>
  </div>
  <div style="padding:2vw;display:flex;flex-wrap:wrap;gap:1.2vw;justify-content:center">${agentsHTML}</div>
</div>

<!-- WORKFLOW -->
<div class="card">
  <div class="card-header">
    <div class="card-title"><span class="card-dot purple"></span>AI Workflow</div>
    <span class="card-badge">Automatisiert</span>
  </div>
  <div class="workflow-content">
    <div class="workflow-header">
      <div class="agent-badge" style="background:#0A0D14;padding:8px">
        ${agentRobotSvg(workflowAgentNames[0] || "E-Mail Agent", 64)}
      </div>
      <div class="workflow-info">
        <span class="workflow-title">AI ${form.projectType} Flow</span>
        <span class="workflow-subtitle">${form.agents.join(" \u2192 ")}</span>
      </div>
    </div>
    <div class="workflow-canvas">
      <svg class="workflow-svg" viewBox="0 0 ${svgWidth} 130" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="node3d" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000" flood-opacity="0.6"/></filter>
          <filter id="glow3d" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <filter id="lineGlow" x="-20%" y="-100%" width="140%" height="300%"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <linearGradient id="node3dGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#2E3448"/><stop offset="50%" stop-color="#1E2330"/><stop offset="100%" stop-color="#141820"/></linearGradient>
          <linearGradient id="lineGrad" x1="0%" x2="100%"><stop offset="0%" stop-color="#6366F1"/><stop offset="100%" stop-color="#10B981"/></linearGradient>
          <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#818CF8"/><stop offset="100%" stop-color="#6366F1"/></linearGradient>
          <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#FB923C"/><stop offset="100%" stop-color="#F97316"/></linearGradient>
          <linearGradient id="tealGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#34D399"/><stop offset="100%" stop-color="#10B981"/></linearGradient>
          <linearGradient id="blueGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#60A5FA"/><stop offset="100%" stop-color="#3B82F6"/></linearGradient>
          <linearGradient id="statsGradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#10B981"/><stop offset="100%" stop-color="#34D399"/></linearGradient>
        </defs>
        <g filter="url(#lineGlow)">${connectionsHTML}</g>
        ${workflowNodesHTML}
      </svg>
    </div>
  </div>
</div>

<!-- BOTTOM -->
<div class="bottom-section">
  <!-- STATS -->
  <div class="card">
    <div class="card-header">
      <div class="card-title"><span class="card-dot teal"></span>Performance</div>
      <span class="card-badge">AI Powered</span>
    </div>
    <div class="stats-content">
      <div class="stats-main">
        <div class="stats-main-circle">
          <svg viewBox="0 0 100 100">
            <circle class="track" cx="50" cy="50" r="42"/>
            <circle class="progress" cx="50" cy="50" r="42" stroke-dasharray="${scoreDash}, 264"/>
          </svg>
          <span class="stats-main-value">${form.scoreOverall}</span>
        </div>
        <span class="stats-main-label">Gesamt-Score</span>
      </div>
      <div class="stats-grid">
        <div class="stat-mini">
          <div class="stat-mini-header"><span class="stat-mini-value">${form.scoreSeo}</span><span class="stat-mini-label">SEO</span></div>
          <div class="stat-mini-bar"><div class="stat-mini-bar-fill" style="width:${form.scoreSeo}%"></div></div>
        </div>
        <div class="stat-mini">
          <div class="stat-mini-header"><span class="stat-mini-value">${form.scorePerformance}</span><span class="stat-mini-label">Performance</span></div>
          <div class="stat-mini-bar"><div class="stat-mini-bar-fill" style="width:${form.scorePerformance}%"></div></div>
        </div>
        <div class="stat-mini">
          <div class="stat-mini-header"><span class="stat-mini-value">${form.scoreSecurity}</span><span class="stat-mini-label">Sicherheit</span></div>
          <div class="stat-mini-bar"><div class="stat-mini-bar-fill" style="width:${form.scoreSecurity}%"></div></div>
        </div>
        <div class="stat-mini">
          <div class="stat-mini-header"><span class="stat-mini-value">${form.loadTime}</span><span class="stat-mini-label">Ladezeit</span></div>
          <div class="stat-mini-bar"><div class="stat-mini-bar-fill" style="width:85%"></div></div>
        </div>
      </div>
    </div>
  </div>

  <!-- RESULTS -->
  <div class="card">
    <div class="card-header">
      <div class="card-title"><span class="card-dot orange"></span>Ergebnisse</div>
    </div>
    <div class="results-content">${resultsHTML}</div>
  </div>
</div>

<!-- FOOTER -->
<footer class="footer">
  <div class="footer-brand">
    <div class="footer-logo"><img src="${logoSrc}" alt="AgentFlow" style="width:100%;height:100%;object-fit:cover"/></div>
    <div class="footer-info">
      <a href="mailto:clients@agentflowm.de">clients@agentflowm.de</a> \u00B7 <a href="https://agentflowm.de">agentflowm.de</a>
    </div>
  </div>
  <span class="footer-thanks">Danke f\u00FCr das Vertrauen! \uD83D\uDE80</span>
</footer>

</div></div></body></html>`;
}

function ClientDetailModal({
  client,
  onClose,
  onUpdate,
  initialTab,
}: {
  client: PortalClient;
  onClose: () => void;
  onUpdate: () => void;
  initialTab?: "details" | "project" | "messages" | "approvals" | "dokumente";
}) {
  const [activeTab, setActiveTab] = useState<
    "details" | "project" | "messages" | "approvals" | "dokumente"
  >(initialTab || "details");
  const [projectData, setProjectData] = useState<any>(null);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [approvals, setApprovals] = useState<any[]>([]);
  const [showNewApprovalForm, setShowNewApprovalForm] = useState(false);
  const [newApproval, setNewApproval] = useState({
    title: "",
    description: "",
    type: "design",
  });

  // Dokumente State
  const [clientInvoices, setClientInvoices] = useState<any[]>([]);
  const [clientAgreements, setClientAgreements] = useState<any[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [showCreateAgreement, setShowCreateAgreement] = useState(false);
  const [creatingDoc, setCreatingDoc] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({
    due_date: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
    tax_rate: 19,
    discount_percent: 0,
    notes: "",
    items: [{ description: "", quantity: 1, unit_price: 0, total: 0 }],
  });
  const [agreementForm, setAgreementForm] = useState({
    project_title: "",
    project_description: "",
    services: [] as string[],
    amount: 0,
    tax_rate: 19,
    payment_terms: "100% bei Vertragsstart",
    project_duration: "2 Wochen",
    notes: "",
    newService: "",
  });
  const [showPosterGen, setShowPosterGen] = useState(false);
  const [posterForm, setPosterForm] = useState({
    projectType: "Growth Website",
    tagline: "Professionelle Webpräsenz mit KI-gestützter Entwicklung",
    screenshotUrl: "",
    agents: ["E-Mail Agent", "Chat Agent", "Vertriebs Agent"],
    scoreOverall: 92,
    scoreSeo: 95,
    scorePerformance: 88,
    scoreSecurity: 100,
    loadTime: "1.2s",
    results: [
      "Responsive Design für alle Geräte",
      "SEO-optimierte Seitenstruktur",
      "DSGVO-konforme Datenschutzlösung",
      "SSL-Verschlüsselung & Sicherheit",
    ],
    customResult: "",
  });
  
  // Admin Edit States
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: client.name,
    email: client.email,
    company: client.company || "",
    phone: client.phone || "",
    telegram_username: client.telegram_username || "",
    status: client.status || "active",
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Save Client Changes
  const handleSaveClient = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/clients/${client.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        setIsEditing(false);
        onUpdate();
      } else {
        alert("Fehler beim Speichern");
      }
    } catch (error) {
      alert("Verbindungsfehler");
    }
    setSaving(false);
  };

  // Delete Client
  const handleDeleteClient = async () => {
    if (!confirm(`Kunde "${client.name}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden!`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/clients/${client.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        onClose();
        onUpdate();
      } else {
        alert("Fehler beim Löschen");
      }
    } catch (error) {
      alert("Verbindungsfehler");
    }
    setDeleting(false);
  };

  // Delete Message
  const handleDeleteMessage = async (messageId: number) => {
    if (!confirm("Nachricht wirklich löschen?")) return;
    try {
      const res = await fetch(`/api/messages/${messageId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        // Refresh messages
        const data = await fetch(`/api/projects/${client.project_id}`, { credentials: "include" }).then(r => r.json());
        setProjectData(data);
      }
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  // Delete Approval
  const handleDeleteApproval = async (approvalId: number) => {
    if (!confirm("Freigabe-Anfrage wirklich löschen?")) return;
    try {
      const res = await fetch(`/api/approvals/${approvalId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setApprovals(approvals.filter(a => a.id !== approvalId));
      }
    } catch (error) {
      console.error("Failed to delete approval:", error);
    }
  };

  const fetchApprovals = useCallback(async () => {
    if (!client.project_id) return;
    try {
      const res = await fetch(
        `/api/approvals?project_id=${client.project_id}`,
        { credentials: "include" },
      );
      if (res.ok) {
        const data = await res.json();
        setApprovals(data.approvals || []);
      }
    } catch (error) {
      console.error("Failed to fetch approvals:", error);
    }
  }, [client.project_id]);

  useEffect(() => {
    if (client.project_id) {
      fetch(`/api/projects/${client.project_id}`, { credentials: "include" })
        .then((res) => res.json())
        .then((data) => setProjectData(data))
        .catch(console.error);
      fetchApprovals();
    }
  }, [client.project_id, fetchApprovals]);

  // Fetch client documents
  const fetchClientDocs = useCallback(async () => {
    setLoadingDocs(true);
    try {
      const [invRes, agrRes] = await Promise.all([
        fetch("/api/invoices", { credentials: "include" }),
        fetch("/api/agreements", { credentials: "include" }),
      ]);
      if (invRes.ok) {
        const invData = await invRes.json();
        const invUnwrapped = invData.data || invData;
        const allInvoices = invUnwrapped.invoices || [];
        setClientInvoices(allInvoices.filter((inv: any) =>
          inv.client_name?.toLowerCase() === client.name.toLowerCase() ||
          inv.client_email?.toLowerCase() === client.email.toLowerCase()
        ));
      }
      if (agrRes.ok) {
        const agrData = await agrRes.json();
        const allAgreements = agrData.data?.agreements || agrData.agreements || [];
        setClientAgreements(allAgreements.filter((agr: any) =>
          agr.client_name?.toLowerCase() === client.name.toLowerCase() ||
          agr.client_email?.toLowerCase() === client.email.toLowerCase()
        ));
      }
    } catch (error) {
      console.error("Failed to fetch client docs:", error);
    }
    setLoadingDocs(false);
  }, [client.name, client.email]);

  useEffect(() => {
    if (activeTab === "dokumente") {
      fetchClientDocs();
    }
  }, [activeTab, fetchClientDocs]);

  // Create invoice for this client
  const handleCreateInvoice = async () => {
    setCreatingDoc(true);
    try {
      const items = invoiceForm.items.map(item => ({
        ...item,
        total: item.quantity * item.unit_price,
      }));
      const subtotal = items.reduce((sum, item) => sum + item.total, 0);
      const res = await fetch("/api/invoices", {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_name: client.name,
          client_email: client.email,
          client_company: client.company || "",
          client_address: "",
          due_date: invoiceForm.due_date,
          tax_rate: invoiceForm.tax_rate,
          discount_percent: invoiceForm.discount_percent,
          notes: invoiceForm.notes,
          items,
          subtotal,
        }),
      });
      if (res.ok) {
        setShowCreateInvoice(false);
        setInvoiceForm({
          due_date: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
          tax_rate: 19, discount_percent: 0, notes: "",
          items: [{ description: "", quantity: 1, unit_price: 0, total: 0 }],
        });
        fetchClientDocs();
      }
    } catch (error) {
      console.error("Failed to create invoice:", error);
    }
    setCreatingDoc(false);
  };

  // Create agreement for this client
  const handleCreateAgreement = async () => {
    setCreatingDoc(true);
    try {
      const res = await fetch("/api/agreements", {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_name: client.name,
          client_email: client.email,
          client_company: client.company || "",
          client_address: "",
          project_title: agreementForm.project_title,
          project_description: agreementForm.project_description,
          services: agreementForm.services,
          amount: agreementForm.amount,
          tax_rate: agreementForm.tax_rate,
          payment_terms: agreementForm.payment_terms,
          project_duration: agreementForm.project_duration,
          notes: agreementForm.notes,
        }),
      });
      if (res.ok) {
        setShowCreateAgreement(false);
        setAgreementForm({
          project_title: "", project_description: "", services: [],
          amount: 0, tax_rate: 19, payment_terms: "100% bei Vertragsstart",
          project_duration: "2 Wochen", notes: "", newService: "",
        });
        fetchClientDocs();
      }
    } catch (error) {
      console.error("Failed to create agreement:", error);
    }
    setCreatingDoc(false);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !client.project_id) return;
    setSendingMessage(true);
    try {
      const res = await fetch(`/api/projects/${client.project_id}/messages`, { credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newMessage }),
      });
      if (res.ok) {
        setNewMessage("");
        // Refresh project data
        const data = await fetch(`/api/projects/${client.project_id}`, { credentials: "include" }).then(
          (r) => r.json(),
        );
        setProjectData(data);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
    setSendingMessage(false);
  };

  const handleUpdateMilestone = async (milestoneId: number, status: string) => {
    if (!client.project_id) return;
    try {
      await fetch(`/api/projects/${client.project_id}/milestones`, { credentials: "include",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ milestoneId, status }),
      });
      // Refresh project data
      const data = await fetch(`/api/projects/${client.project_id}`, { credentials: "include" }).then((r) =>
        r.json(),
      );
      setProjectData(data);
      onUpdate();
    } catch (error) {
      console.error("Failed to update milestone:", error);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#0f0f12] border border-white/[0.06] rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FC682C]/20 to-[#9D65C9]/20 flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {client.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-white">{client.name}</h3>
              <div className="text-sm text-white/40">
                {client.company || client.email}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-white/40" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/[0.06] overflow-x-auto">
          {["details", "dokumente", "project", "messages", "approvals"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={`flex-1 py-3 text-sm font-medium transition-colors relative whitespace-nowrap px-2 ${activeTab === tab ? "text-[#FC682C] border-b-2 border-[#FC682C]" : "text-white/50 hover:text-white"}`}
            >
              {tab === "details"
                ? "Details"
                : tab === "dokumente"
                  ? "Dokumente"
                  : tab === "project"
                    ? "Projekt"
                    : tab === "messages"
                      ? "Nachrichten"
                      : "Freigaben"}
              {tab === "approvals" &&
                approvals.filter((a) => a.status === "pending").length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 text-white text-[10px] rounded-full flex items-center justify-center">
                    {approvals.filter((a) => a.status === "pending").length}
                  </span>
                )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div
          className="p-4 overflow-y-auto"
          style={{ maxHeight: "calc(85vh - 140px)" }}
        >
          {activeTab === "details" && (
            <div className="space-y-4">
              {/* Admin Action Bar */}
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-[#FC682C]/10 to-[#9D65C9]/10 rounded-xl border border-[#FC682C]/20">
                <span className="text-sm text-white/70 font-medium">Admin-Aktionen</span>
                <div className="flex gap-2">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm text-white flex items-center gap-1.5 transition-colors"
                    >
                      <PencilIcon className="w-3.5 h-3.5" />
                      Bearbeiten
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm text-white/70 transition-colors"
                      >
                        Abbrechen
                      </button>
                      <button
                        onClick={handleSaveClient}
                        disabled={saving}
                        className="px-3 py-1.5 bg-green-500 hover:bg-green-600 rounded-lg text-sm text-white flex items-center gap-1.5 transition-colors disabled:opacity-50"
                      >
                        <CheckCircleIcon className="w-3.5 h-3.5" />
                        {saving ? "..." : "Speichern"}
                      </button>
                    </>
                  )}
                  <button
                    onClick={handleDeleteClient}
                    disabled={deleting}
                    className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/40 rounded-lg text-sm text-red-400 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                    {deleting ? "..." : "Löschen"}
                  </button>
                </div>
              </div>

              {/* Editable Fields */}
              {isEditing ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white/[0.02] rounded-xl">
                    <label className="text-xs text-white/40 mb-1 block">Name *</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-3 py-2 bg-white/[0.06] border border-white/10 rounded-lg text-white text-sm focus:border-[#FC682C]/50 outline-none"
                    />
                  </div>
                  <div className="p-3 bg-white/[0.02] rounded-xl">
                    <label className="text-xs text-white/40 mb-1 block">E-Mail *</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-3 py-2 bg-white/[0.06] border border-white/10 rounded-lg text-white text-sm focus:border-[#FC682C]/50 outline-none"
                    />
                  </div>
                  <div className="p-3 bg-white/[0.02] rounded-xl">
                    <label className="text-xs text-white/40 mb-1 block">Firma</label>
                    <input
                      type="text"
                      value={editForm.company}
                      onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                      className="w-full px-3 py-2 bg-white/[0.06] border border-white/10 rounded-lg text-white text-sm focus:border-[#FC682C]/50 outline-none"
                    />
                  </div>
                  <div className="p-3 bg-white/[0.02] rounded-xl">
                    <label className="text-xs text-white/40 mb-1 block">Telefon</label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-white/[0.06] border border-white/10 rounded-lg text-white text-sm focus:border-[#FC682C]/50 outline-none"
                    />
                  </div>
                  <div className="p-3 bg-white/[0.02] rounded-xl">
                    <label className="text-xs text-white/40 mb-1 block">Telegram Username</label>
                    <input
                      type="text"
                      value={editForm.telegram_username}
                      onChange={(e) => setEditForm({ ...editForm, telegram_username: e.target.value.replace("@", "") })}
                      placeholder="ohne @"
                      className="w-full px-3 py-2 bg-white/[0.06] border border-white/10 rounded-lg text-white text-sm focus:border-[#FC682C]/50 outline-none"
                    />
                  </div>
                  <div className="p-3 bg-white/[0.02] rounded-xl">
                    <label className="text-xs text-white/40 mb-1 block">Status</label>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                      className="w-full px-3 py-2 bg-white/[0.06] border border-white/10 rounded-lg text-white text-sm focus:border-[#FC682C]/50 outline-none"
                    >
                      <option value="active">Aktiv</option>
                      <option value="inactive">Inaktiv</option>
                      <option value="paused">Pausiert</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white/[0.02] rounded-xl">
                    <div className="text-xs text-white/40 mb-1">E-Mail</div>
                    <div className="text-sm text-white">
                      {client.email || "-"}
                    </div>
                  </div>
                  <div className="p-3 bg-white/[0.02] rounded-xl">
                    <div className="text-xs text-white/40 mb-1">Telefon</div>
                    <div className="text-sm text-white">
                      {client.phone || "-"}
                    </div>
                  </div>
                  <div className="p-3 bg-white/[0.02] rounded-xl">
                    <div className="text-xs text-white/40 mb-1">Telegram</div>
                    <div className="text-sm text-white">
                      {client.telegram_username
                        ? `@${client.telegram_username}`
                        : "-"}
                    </div>
                  </div>
                  <div className="p-3 bg-white/[0.02] rounded-xl">
                    <div className="text-xs text-white/40 mb-1">Zugangscode</div>
                    <div className="text-sm font-mono text-[#FC682C]">
                      {client.access_code}
                    </div>
                  </div>
                </div>
              )}

              {/* Telegram Actions */}
              <div className="space-y-2">
                <h4 className="text-xs text-white/40 uppercase tracking-wider">
                  Aktionen
                </h4>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={async () => {
                      if (!client.telegram_id) {
                        alert(
                          "Kunde hat keine Telegram-Verbindung. Der Kunde muss sich erst mit dem Bot verbinden (@Agentflowzbot).",
                        );
                        return;
                      }
                      try {
                        const res = await fetch(
                          `/api/clients/${client.id}/send-code`,
                          { method: "POST" },
                        );
                        const data = await res.json();
                        if (data.success) {
                          alert("Zugangscode wurde per Telegram gesendet!");
                        } else {
                          alert(data.error || "Fehler beim Senden");
                        }
                      } catch {
                        alert("Verbindungsfehler");
                      }
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#0088cc] hover:bg-[#0099dd] text-white rounded-xl text-sm font-medium transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.121.099.154.232.17.325.015.093.034.305.019.471z" />
                    </svg>
                    Zugangscode per Telegram senden
                  </button>
                  {client.telegram_username && (
                    <a
                      href={`https://t.me/${client.telegram_username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-white/[0.06] hover:bg-white/[0.1] text-white rounded-xl text-sm font-medium transition-colors"
                    >
                      <ChatBubbleLeftRightIcon className="w-4 h-4" />
                      Chat öffnen
                    </a>
                  )}
                </div>
                {!client.telegram_id && (
                  <p className="text-xs text-yellow-400/70 flex items-center gap-1">
                    <ExclamationCircleIcon className="w-4 h-4" />
                    Kunde muss sich erst mit @Agentflowzbot verbinden
                  </p>
                )}
              </div>

              <div className="p-3 bg-white/[0.02] rounded-xl">
                <div className="text-xs text-white/40 mb-1">Erstellt am</div>
                <div className="text-sm text-white">
                  {new Date(client.created_at).toLocaleDateString("de-DE")}
                </div>
              </div>
              {client.last_login && (
                <div className="p-3 bg-white/[0.02] rounded-xl">
                  <div className="text-xs text-white/40 mb-1">
                    Letzter Login
                  </div>
                  <div className="text-sm text-white">
                    {new Date(client.last_login).toLocaleString("de-DE")}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "dokumente" && (
            <div className="space-y-4">
              {/* Quick Actions */}
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => { setShowCreateInvoice(true); setShowCreateAgreement(false); setShowPosterGen(false); }}
                  className="p-3 bg-gradient-to-br from-[#FC682C]/10 to-[#FC682C]/5 border border-[#FC682C]/20 rounded-xl hover:border-[#FC682C]/40 transition-colors text-center"
                >
                  <CurrencyEuroIcon className="w-5 h-5 text-[#FC682C] mx-auto mb-1" />
                  <span className="text-xs font-medium text-white">Rechnung</span>
                </button>
                <button
                  onClick={() => { setShowCreateAgreement(true); setShowCreateInvoice(false); setShowPosterGen(false); }}
                  className="p-3 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-xl hover:border-purple-500/40 transition-colors text-center"
                >
                  <DocumentTextIcon className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                  <span className="text-xs font-medium text-white">Vereinbarung</span>
                </button>
                <button
                  onClick={() => { setShowCreateInvoice(true); setShowCreateAgreement(false); setShowPosterGen(false); }}
                  className="p-3 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-xl hover:border-blue-500/40 transition-colors text-center"
                >
                  <DocumentTextIcon className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                  <span className="text-xs font-medium text-white">Angebot</span>
                </button>
                <button
                  onClick={() => { setShowPosterGen(true); setShowCreateInvoice(false); setShowCreateAgreement(false); }}
                  className="p-3 bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-xl hover:border-green-500/40 transition-colors text-center"
                >
                  <SparklesIcon className="w-5 h-5 text-green-400 mx-auto mb-1" />
                  <span className="text-xs font-medium text-white">Poster</span>
                </button>
              </div>

              {/* Create Invoice Form */}
              {showCreateInvoice && (
                <div className="p-4 bg-white/[0.03] border border-[#FC682C]/20 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-white">Neue Rechnung für {client.name}</h4>
                    <button onClick={() => setShowCreateInvoice(false)} className="p-1 hover:bg-white/10 rounded-lg">
                      <XMarkIcon className="w-4 h-4 text-white/40" />
                    </button>
                  </div>
                  {/* Leistungs-Vorlagen */}
                  <div>
                    <label className="text-[10px] text-white/40 block mb-1">Schnell-Vorlage</label>
                    <div className="flex flex-wrap gap-1">
                      {[
                        { label: "Growth Website", price: 2000 },
                        { label: "Business Website", price: 3500 },
                        { label: "One-Page Website", price: 500 },
                        { label: "Website-Check", price: 0 },
                        { label: "SEO-Optimierung", price: 800 },
                        { label: "Logo & Branding", price: 600 },
                        { label: "Wartung/Monat", price: 150 },
                        { label: "Hosting/Jahr", price: 200 },
                      ].map((tpl) => (
                        <button
                          key={tpl.label}
                          onClick={() => {
                            const exists = invoiceForm.items.some(i => i.description === tpl.label);
                            if (!exists) {
                              const newItem = { description: tpl.label, quantity: 1, unit_price: tpl.price, total: tpl.price };
                              const items = invoiceForm.items[0]?.description === "" ? [newItem] : [...invoiceForm.items, newItem];
                              setInvoiceForm({ ...invoiceForm, items });
                            }
                          }}
                          className="px-2 py-1 bg-white/[0.06] hover:bg-[#FC682C]/20 border border-white/10 hover:border-[#FC682C]/30 rounded-lg text-[10px] text-white/60 hover:text-white transition-colors"
                        >
                          {tpl.label} {tpl.price > 0 && `€${tpl.price}`}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Items */}
                  {invoiceForm.items.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-end">
                      <div className="col-span-6">
                        {idx === 0 && <label className="text-[10px] text-white/40 block mb-1">Beschreibung</label>}
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => {
                            const items = [...invoiceForm.items];
                            items[idx] = { ...items[idx], description: e.target.value };
                            setInvoiceForm({ ...invoiceForm, items });
                          }}
                          placeholder="Leistung..."
                          className="w-full px-2 py-1.5 bg-white/[0.06] border border-white/10 rounded-lg text-white text-xs outline-none focus:border-[#FC682C]/50"
                        />
                      </div>
                      <div className="col-span-2">
                        {idx === 0 && <label className="text-[10px] text-white/40 block mb-1">Menge</label>}
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const items = [...invoiceForm.items];
                            items[idx] = { ...items[idx], quantity: Number(e.target.value) };
                            setInvoiceForm({ ...invoiceForm, items });
                          }}
                          className="w-full px-2 py-1.5 bg-white/[0.06] border border-white/10 rounded-lg text-white text-xs outline-none focus:border-[#FC682C]/50"
                        />
                      </div>
                      <div className="col-span-3">
                        {idx === 0 && <label className="text-[10px] text-white/40 block mb-1">Preis (€)</label>}
                        <input
                          type="number"
                          value={item.unit_price}
                          onChange={(e) => {
                            const items = [...invoiceForm.items];
                            items[idx] = { ...items[idx], unit_price: Number(e.target.value) };
                            setInvoiceForm({ ...invoiceForm, items });
                          }}
                          className="w-full px-2 py-1.5 bg-white/[0.06] border border-white/10 rounded-lg text-white text-xs outline-none focus:border-[#FC682C]/50"
                        />
                      </div>
                      <div className="col-span-1">
                        {invoiceForm.items.length > 1 && (
                          <button
                            onClick={() => {
                              const items = invoiceForm.items.filter((_, i) => i !== idx);
                              setInvoiceForm({ ...invoiceForm, items });
                            }}
                            className="p-1.5 hover:bg-red-500/20 rounded-lg"
                          >
                            <XMarkIcon className="w-3.5 h-3.5 text-red-400" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => setInvoiceForm({
                      ...invoiceForm,
                      items: [...invoiceForm.items, { description: "", quantity: 1, unit_price: 0, total: 0 }],
                    })}
                    className="text-xs text-[#FC682C] hover:text-[#FC682C]/80 flex items-center gap-1"
                  >
                    <PlusIcon className="w-3 h-3" /> Position hinzufügen
                  </button>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-white/40 block mb-1">Fällig am</label>
                      <input
                        type="date"
                        value={invoiceForm.due_date}
                        onChange={(e) => setInvoiceForm({ ...invoiceForm, due_date: e.target.value })}
                        className="w-full px-2 py-1.5 bg-white/[0.06] border border-white/10 rounded-lg text-white text-xs outline-none focus:border-[#FC682C]/50"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 block mb-1">MwSt %</label>
                      <input
                        type="number"
                        value={invoiceForm.tax_rate}
                        onChange={(e) => setInvoiceForm({ ...invoiceForm, tax_rate: Number(e.target.value) })}
                        className="w-full px-2 py-1.5 bg-white/[0.06] border border-white/10 rounded-lg text-white text-xs outline-none focus:border-[#FC682C]/50"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 block mb-1">Rabatt %</label>
                      <input
                        type="number"
                        value={invoiceForm.discount_percent}
                        onChange={(e) => setInvoiceForm({ ...invoiceForm, discount_percent: Number(e.target.value) })}
                        className="w-full px-2 py-1.5 bg-white/[0.06] border border-white/10 rounded-lg text-white text-xs outline-none focus:border-[#FC682C]/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-white/40 block mb-1">Notizen</label>
                    <textarea
                      value={invoiceForm.notes}
                      onChange={(e) => setInvoiceForm({ ...invoiceForm, notes: e.target.value })}
                      rows={2}
                      className="w-full px-2 py-1.5 bg-white/[0.06] border border-white/10 rounded-lg text-white text-xs outline-none focus:border-[#FC682C]/50 resize-none"
                    />
                  </div>
                  {/* Summary */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <div className="text-xs text-white/50">
                      Summe: €{invoiceForm.items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0).toFixed(2)}
                      {invoiceForm.tax_rate > 0 && ` + ${invoiceForm.tax_rate}% MwSt`}
                    </div>
                    <button
                      onClick={handleCreateInvoice}
                      disabled={creatingDoc || !invoiceForm.items[0]?.description}
                      className="px-4 py-2 bg-[#FC682C] text-white rounded-lg text-xs font-medium hover:bg-[#FC682C]/90 disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {creatingDoc ? "Wird erstellt..." : "Rechnung erstellen"}
                    </button>
                  </div>
                </div>
              )}

              {/* Create Agreement Form */}
              {showCreateAgreement && (
                <div className="p-4 bg-white/[0.03] border border-purple-500/20 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-white">Neue Vereinbarung für {client.name}</h4>
                    <button onClick={() => setShowCreateAgreement(false)} className="p-1 hover:bg-white/10 rounded-lg">
                      <XMarkIcon className="w-4 h-4 text-white/40" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-white/40 block mb-1">Projekttitel *</label>
                      <input
                        type="text"
                        value={agreementForm.project_title}
                        onChange={(e) => setAgreementForm({ ...agreementForm, project_title: e.target.value })}
                        placeholder="z.B. Growth Website"
                        className="w-full px-2 py-1.5 bg-white/[0.06] border border-white/10 rounded-lg text-white text-xs outline-none focus:border-purple-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 block mb-1">Betrag (€ netto)</label>
                      <input
                        type="number"
                        value={agreementForm.amount}
                        onChange={(e) => setAgreementForm({ ...agreementForm, amount: Number(e.target.value) })}
                        className="w-full px-2 py-1.5 bg-white/[0.06] border border-white/10 rounded-lg text-white text-xs outline-none focus:border-purple-500/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-white/40 block mb-1">Projektbeschreibung</label>
                    <textarea
                      value={agreementForm.project_description}
                      onChange={(e) => setAgreementForm({ ...agreementForm, project_description: e.target.value })}
                      rows={2}
                      className="w-full px-2 py-1.5 bg-white/[0.06] border border-white/10 rounded-lg text-white text-xs outline-none focus:border-purple-500/50 resize-none"
                    />
                  </div>
                  {/* Services */}
                  <div>
                    <label className="text-[10px] text-white/40 block mb-1">Leistungen</label>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {agreementForm.services.map((s, i) => (
                        <span key={i} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-xs flex items-center gap-1">
                          {s}
                          <button onClick={() => setAgreementForm({
                            ...agreementForm,
                            services: agreementForm.services.filter((_, idx) => idx !== i),
                          })}>
                            <XMarkIcon className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-1">
                      <input
                        type="text"
                        value={agreementForm.newService}
                        onChange={(e) => setAgreementForm({ ...agreementForm, newService: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && agreementForm.newService.trim()) {
                            setAgreementForm({
                              ...agreementForm,
                              services: [...agreementForm.services, agreementForm.newService.trim()],
                              newService: "",
                            });
                          }
                        }}
                        placeholder="Leistung eingeben + Enter"
                        className="flex-1 px-2 py-1.5 bg-white/[0.06] border border-white/10 rounded-lg text-white text-xs outline-none focus:border-purple-500/50"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-white/40 block mb-1">Laufzeit</label>
                      <input
                        type="text"
                        value={agreementForm.project_duration}
                        onChange={(e) => setAgreementForm({ ...agreementForm, project_duration: e.target.value })}
                        className="w-full px-2 py-1.5 bg-white/[0.06] border border-white/10 rounded-lg text-white text-xs outline-none focus:border-purple-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 block mb-1">Zahlung</label>
                      <input
                        type="text"
                        value={agreementForm.payment_terms}
                        onChange={(e) => setAgreementForm({ ...agreementForm, payment_terms: e.target.value })}
                        className="w-full px-2 py-1.5 bg-white/[0.06] border border-white/10 rounded-lg text-white text-xs outline-none focus:border-purple-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 block mb-1">MwSt %</label>
                      <input
                        type="number"
                        value={agreementForm.tax_rate}
                        onChange={(e) => setAgreementForm({ ...agreementForm, tax_rate: Number(e.target.value) })}
                        className="w-full px-2 py-1.5 bg-white/[0.06] border border-white/10 rounded-lg text-white text-xs outline-none focus:border-purple-500/50"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-2 border-t border-white/10">
                    <button
                      onClick={handleCreateAgreement}
                      disabled={creatingDoc || !agreementForm.project_title}
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg text-xs font-medium hover:bg-purple-500/90 disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {creatingDoc ? "Wird erstellt..." : "Vereinbarung erstellen"}
                    </button>
                  </div>
                </div>
              )}

              {/* Poster Generator — Premium */}
              {showPosterGen && (
                <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.02]">
                  {/* Header */}
                  <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.02]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <SparklesIcon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-[13px] font-semibold text-white tracking-tight">Poster erstellen</h4>
                        <p className="text-[10px] text-white/30">{client.company || client.name}</p>
                      </div>
                    </div>
                    <button onClick={() => setShowPosterGen(false)} className="p-1.5 hover:bg-white/[0.06] rounded-lg transition-colors">
                      <XMarkIcon className="w-4 h-4 text-white/30 hover:text-white/60" />
                    </button>
                  </div>

                  <div className="p-5 space-y-4">
                    {/* Row 1: Typ + Screenshot */}
                    <div className="grid grid-cols-[1fr,1.2fr] gap-4">
                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] font-medium text-white/50 uppercase tracking-wider block mb-1.5">Projekt</label>
                          <select value={posterForm.projectType} onChange={(e) => setPosterForm({ ...posterForm, projectType: e.target.value })}
                            className="w-full px-3 py-2 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white text-xs outline-none focus:border-emerald-500/40 focus:bg-white/[0.07] transition-all">
                            <option value="Growth Website">Growth Website</option>
                            <option value="Business Website">Business Website</option>
                            <option value="One-Page Website">One-Page Website</option>
                            <option value="E-Commerce Shop">E-Commerce Shop</option>
                            <option value="Landing Page">Landing Page</option>
                            <option value="Web-Anwendung">Web-Anwendung</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-medium text-white/50 uppercase tracking-wider block mb-1.5">Tagline</label>
                          <input type="text" value={posterForm.tagline} onChange={(e) => setPosterForm({ ...posterForm, tagline: e.target.value })}
                            className="w-full px-3 py-2 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white text-xs outline-none focus:border-emerald-500/40 focus:bg-white/[0.07] transition-all" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-medium text-white/50 uppercase tracking-wider block mb-1.5">Screenshot</label>
                        {posterForm.screenshotUrl ? (
                          <div className="relative group rounded-xl overflow-hidden border border-white/[0.08]">
                            <img src={posterForm.screenshotUrl} alt="Screenshot" className="w-full max-h-[104px] object-cover object-top" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <button onClick={() => setPosterForm({ ...posterForm, screenshotUrl: "" })}
                              className="absolute top-2 right-2 p-1 bg-black/60 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/80">
                              <XMarkIcon className="w-3 h-3 text-white" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center gap-1.5 h-[104px] bg-white/[0.03] border border-dashed border-white/[0.12] rounded-xl cursor-pointer hover:border-emerald-500/30 hover:bg-emerald-500/[0.03] transition-all group">
                            <ArrowUpTrayIcon className="w-5 h-5 text-white/20 group-hover:text-emerald-400/60 transition-colors" />
                            <span className="text-[10px] text-white/30 group-hover:text-white/50 transition-colors">Bild hochladen</span>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                  if (ev.target?.result) setPosterForm({ ...posterForm, screenshotUrl: ev.target.result as string });
                                };
                                reader.readAsDataURL(file);
                              }
                            }} />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Row 2: Scores — compact inline */}
                    <div>
                      <label className="text-[10px] font-medium text-white/50 uppercase tracking-wider block mb-1.5">Bewertung</label>
                      <div className="grid grid-cols-4 gap-2">
                        {([
                          { key: "scoreOverall", label: "Score", icon: "star", color: "from-emerald-500 to-teal-500", type: "number" },
                          { key: "scoreSeo", label: "SEO", icon: "search", color: "from-blue-500 to-indigo-500", type: "number" },
                          { key: "scorePerformance", label: "Speed", icon: "bolt", color: "from-amber-500 to-orange-500", type: "number" },
                          { key: "loadTime", label: "Ladezeit", icon: "clock", color: "from-purple-500 to-pink-500", type: "text" },
                        ] as const).map((field) => (
                          <div key={field.key} className="relative">
                            <div className={`absolute top-0 left-0 right-0 h-[2px] rounded-t-xl bg-gradient-to-r ${field.color} opacity-40`} />
                            <div className="pt-2.5 pb-2 px-2.5 bg-white/[0.04] rounded-xl border border-white/[0.06]">
                              <span className="text-[9px] text-white/35 block mb-1">{field.label}</span>
                              <input
                                type={field.type}
                                value={posterForm[field.key]}
                                onChange={(e) => setPosterForm({ ...posterForm, [field.key]: field.type === "number" ? Number(e.target.value) : e.target.value })}
                                className="w-full bg-transparent text-white text-sm font-semibold outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Row 3: Agents — simplified toggle chips */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[10px] font-medium text-white/50 uppercase tracking-wider">KI-Agenten</label>
                        <div className="flex gap-1">
                          <button onClick={() => setPosterForm({ ...posterForm, agents: ["E-Mail Agent","Chat Agent","Vertriebs Agent","Termin Agent","Analyse Agent","Compliance Agent","Automatisierung","Enterprise Pro"] })}
                            className="px-1.5 py-0.5 rounded text-[8px] text-white/30 hover:text-white/60 transition-colors">Alle</button>
                          <span className="text-white/10 text-[8px] leading-4">|</span>
                          <button onClick={() => setPosterForm({ ...posterForm, agents: [] })}
                            className="px-1.5 py-0.5 rounded text-[8px] text-white/30 hover:text-white/60 transition-colors">Keine</button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {([
                          { name: "E-Mail Agent", emoji: "\u2709\uFE0F" },
                          { name: "Chat Agent", emoji: "\uD83D\uDCAC" },
                          { name: "Vertriebs Agent", emoji: "\uD83D\uDCC8" },
                          { name: "Termin Agent", emoji: "\uD83D\uDCC5" },
                          { name: "Analyse Agent", emoji: "\uD83D\uDD0D" },
                          { name: "Compliance Agent", emoji: "\uD83D\uDEE1\uFE0F" },
                          { name: "Automatisierung", emoji: "\u26A1" },
                          { name: "Enterprise Pro", emoji: "\uD83D\uDC8E" },
                        ] as const).map((agent) => {
                          const isActive = posterForm.agents.includes(agent.name);
                          return (
                            <button key={agent.name} onClick={() => {
                              const agents = isActive ? posterForm.agents.filter(a => a !== agent.name) : [...posterForm.agents, agent.name];
                              setPosterForm({ ...posterForm, agents });
                            }}
                              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all ${isActive
                                ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 shadow-sm shadow-emerald-500/10"
                                : "bg-white/[0.03] text-white/30 border border-white/[0.06] hover:text-white/50 hover:border-white/[0.12]"}`}>
                              <span className="mr-1">{agent.emoji}</span>{agent.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Row 4: Ergebnisse — cleaner chip design */}
                    <div>
                      <label className="text-[10px] font-medium text-white/50 uppercase tracking-wider block mb-1.5">Ergebnisse</label>
                      {posterForm.results.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {posterForm.results.map((r, i) => (
                            <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-lg text-[10px] font-medium">
                              {r}
                              <button onClick={() => setPosterForm({ ...posterForm, results: posterForm.results.filter((_, idx) => idx !== i) })}
                                className="ml-0.5 hover:text-red-300 transition-colors">
                                <XMarkIcon className="w-2.5 h-2.5" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1 mb-2">
                        {["Responsive Design", "SEO-optimiert", "DSGVO-konform", "SSL-Verschlüsselung", "CMS-Integration", "Analytics Setup", "E-Mail Automation", "Social Media Integration", "Performance-Optimierung", "Barrierefreiheit"].filter(r => !posterForm.results.includes(r)).map((r) => (
                          <button key={r} onClick={() => setPosterForm({ ...posterForm, results: [...posterForm.results, r] })}
                            className="px-2 py-1 bg-white/[0.03] border border-white/[0.06] rounded-lg text-[10px] text-white/30 hover:text-emerald-300 hover:border-emerald-500/20 hover:bg-emerald-500/5 transition-all">
                            {r}
                          </button>
                        ))}
                      </div>
                      <input type="text" value={posterForm.customResult} onChange={(e) => setPosterForm({ ...posterForm, customResult: e.target.value })}
                        onKeyDown={(e) => { if (e.key === "Enter" && posterForm.customResult.trim()) { setPosterForm({ ...posterForm, results: [...posterForm.results, posterForm.customResult.trim()], customResult: "" }); } }}
                        placeholder="Eigenes Ergebnis hinzufügen..."
                        className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-[11px] outline-none focus:border-emerald-500/30 placeholder:text-white/20 transition-all" />
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.06] bg-white/[0.02]">
                    <button onClick={() => {
                      const html = generatePosterHTML(client, posterForm);
                      const w = window.open("", "_blank", "width=1100,height=900");
                      if (w) { w.document.write(html); w.document.close(); }
                    }}
                      className="px-4 py-2 bg-white/[0.05] border border-white/[0.08] text-white/60 rounded-xl text-xs font-medium hover:bg-white/[0.08] hover:text-white transition-all flex items-center gap-1.5">
                      <EyeIcon className="w-3.5 h-3.5" />
                      Vorschau
                    </button>
                    <button onClick={() => {
                      const html = generatePosterHTML(client, posterForm);
                      const blob = new Blob([html], { type: "text/html" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `poster-${client.name.toLowerCase().replace(/\s+/g, "-")}.html`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                      className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-xs font-semibold hover:shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-[1px] transition-all flex items-center gap-1.5">
                      <ArrowDownTrayIcon className="w-3.5 h-3.5" />
                      Poster herunterladen
                    </button>
                  </div>
                </div>
              )}

              {/* Existing Documents List */}
              {loadingDocs ? (
                <div className="text-center py-4 text-white/40 text-sm">Dokumente werden geladen...</div>
              ) : (
                <div className="space-y-3">
                  {/* Invoices */}
                  {clientInvoices.length > 0 && (
                    <div>
                      <h4 className="text-xs text-white/40 uppercase tracking-wider mb-2">Rechnungen ({clientInvoices.length})</h4>
                      <div className="space-y-2">
                        {clientInvoices.map((inv: any) => (
                          <div key={inv.id} className="p-3 bg-white/[0.02] rounded-xl border border-white/[0.04] hover:border-white/10 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <CurrencyEuroIcon className="w-4 h-4 text-[#FC682C]" />
                                <div>
                                  <div className="text-sm text-white font-medium">{inv.invoice_number}</div>
                                  <div className="text-[11px] text-white/40">{new Date(inv.created_at).toLocaleDateString("de-DE")}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-white">€{inv.total?.toFixed(2)}</span>
                                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium ${
                                  inv.status === "paid" ? "bg-green-500/20 text-green-400" :
                                  inv.status === "sent" ? "bg-blue-500/20 text-blue-400" :
                                  inv.status === "overdue" ? "bg-red-500/20 text-red-400" :
                                  "bg-white/10 text-white/50"
                                }`}>
                                  {inv.status === "paid" ? "Bezahlt" : inv.status === "sent" ? "Gesendet" : inv.status === "overdue" ? "Überfällig" : "Entwurf"}
                                </span>
                              </div>
                            </div>
                            {/* Action Buttons */}
                            <div className="flex items-center gap-1.5 pt-2 border-t border-white/[0.04]">
                              <button
                                onClick={() => window.open(`/api/invoices/${inv.id}/pdf`, "_blank")}
                                className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] rounded-lg text-[11px] text-white/60 hover:text-white transition-colors"
                              >
                                <ArrowDownTrayIcon className="w-3.5 h-3.5" />
                                PDF
                              </button>
                              {inv.status === "draft" && (
                                <button
                                  onClick={async () => {
                                    await fetch(`/api/invoices/${inv.id}/send`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
                                    fetchClientDocs();
                                  }}
                                  className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg text-[11px] text-blue-400 transition-colors"
                                >
                                  <PaperAirplaneIcon className="w-3.5 h-3.5" />
                                  An {client.name.split(" ")[0]} senden
                                </button>
                              )}
                              {(inv.status === "sent" || inv.status === "overdue") && (
                                <button
                                  onClick={async () => {
                                    await fetch(`/api/invoices/${inv.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "paid" }) });
                                    fetchClientDocs();
                                  }}
                                  className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 bg-green-500/10 hover:bg-green-500/20 rounded-lg text-[11px] text-green-400 transition-colors"
                                >
                                  <CheckCircleIcon className="w-3.5 h-3.5" />
                                  Als bezahlt
                                </button>
                              )}
                              {inv.status === "paid" && (
                                <span className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-[11px] text-green-400/50">
                                  <CheckCircleIcon className="w-3.5 h-3.5" />
                                  Abgeschlossen
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Agreements */}
                  {clientAgreements.length > 0 && (
                    <div>
                      <h4 className="text-xs text-white/40 uppercase tracking-wider mb-2">Vereinbarungen ({clientAgreements.length})</h4>
                      <div className="space-y-2">
                        {clientAgreements.map((agr: any) => (
                          <div key={agr.id} className="p-3 bg-white/[0.02] rounded-xl border border-white/[0.04] hover:border-white/10 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <DocumentTextIcon className="w-4 h-4 text-purple-400" />
                                <div>
                                  <div className="text-sm text-white font-medium">{agr.project_title || agr.agreement_number}</div>
                                  <div className="text-[11px] text-white/40">{new Date(agr.created_at).toLocaleDateString("de-DE")}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-white">€{agr.total_amount?.toFixed(2)}</span>
                                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium ${
                                  agr.status === "signed" ? "bg-green-500/20 text-green-400" :
                                  agr.status === "sent" ? "bg-blue-500/20 text-blue-400" :
                                  "bg-white/10 text-white/50"
                                }`}>
                                  {agr.status === "signed" ? "Unterschrieben" : agr.status === "sent" ? "Gesendet" : "Entwurf"}
                                </span>
                              </div>
                            </div>
                            {/* Action Buttons */}
                            <div className="flex items-center gap-1.5 pt-2 border-t border-white/[0.04]">
                              <button
                                onClick={() => window.open(`/api/agreements/${agr.id}/pdf`, "_blank")}
                                className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] rounded-lg text-[11px] text-white/60 hover:text-white transition-colors"
                              >
                                <ArrowDownTrayIcon className="w-3.5 h-3.5" />
                                PDF
                              </button>
                              {agr.status === "draft" && client.email && (
                                <button
                                  onClick={async () => {
                                    await fetch(`/api/agreements/${agr.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "sent" }) });
                                    fetchClientDocs();
                                  }}
                                  className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg text-[11px] text-purple-400 transition-colors"
                                >
                                  <PaperAirplaneIcon className="w-3.5 h-3.5" />
                                  An {client.name.split(" ")[0]} senden
                                </button>
                              )}
                              {agr.status === "sent" && (
                                <button
                                  onClick={async () => {
                                    await fetch(`/api/agreements/${agr.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "signed" }) });
                                    fetchClientDocs();
                                  }}
                                  className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 bg-green-500/10 hover:bg-green-500/20 rounded-lg text-[11px] text-green-400 transition-colors"
                                >
                                  <CheckCircleIcon className="w-3.5 h-3.5" />
                                  Als unterschrieben
                                </button>
                              )}
                              {agr.status === "signed" && (
                                <span className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-[11px] text-green-400/50">
                                  <CheckCircleIcon className="w-3.5 h-3.5" />
                                  Abgeschlossen
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {clientInvoices.length === 0 && clientAgreements.length === 0 && !showCreateInvoice && !showCreateAgreement && (
                    <div className="text-center py-6 text-white/40">
                      <DocumentTextIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Noch keine Dokumente für diesen Kunden</p>
                      <p className="text-xs mt-1">Erstelle eine Rechnung, Vereinbarung oder ein Angebot</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "project" && (
            <div className="space-y-4">
              {projectData?.project ? (
                <>
                  {/* Project Admin Actions */}
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
                    <span className="text-sm text-white/70 font-medium">Projekt-Verwaltung</span>
                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          const newProgress = prompt("Neuer Fortschritt (0-100):", String(projectData.project.progress));
                          if (newProgress !== null) {
                            const progress = Math.min(100, Math.max(0, parseInt(newProgress) || 0));
                            await fetch(`/api/projects/${projectData.project.id}`, {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              credentials: "include",
                              body: JSON.stringify({ progress }),
                            });
                            setProjectData({ ...projectData, project: { ...projectData.project, progress } });
                            onUpdate();
                          }
                        }}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs text-white flex items-center gap-1.5 transition-colors"
                      >
                        <ChartBarIcon className="w-3.5 h-3.5" />
                        Fortschritt
                      </button>
                      <select
                        value={projectData.project.status || "planung"}
                        onChange={async (e) => {
                          const status = e.target.value;
                          await fetch(`/api/projects/${projectData.project.id}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            credentials: "include",
                            body: JSON.stringify({ status }),
                          });
                          setProjectData({ ...projectData, project: { ...projectData.project, status } });
                          onUpdate();
                        }}
                        className="px-3 py-1.5 bg-white/10 rounded-lg text-xs text-white focus:outline-none"
                      >
                        <option value="planung">Planung</option>
                        <option value="entwicklung">Entwicklung</option>
                        <option value="abgeschlossen">Abgeschlossen</option>
                      </select>
                      <button
                        onClick={async () => {
                          if (!confirm("Projekt wirklich löschen? Alle Meilensteine, Nachrichten und Dateien werden gelöscht!")) return;
                          await fetch(`/api/projects/${projectData.project.id}`, {
                            method: "DELETE",
                            credentials: "include",
                          });
                          setProjectData(null);
                          onUpdate();
                        }}
                        className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/40 rounded-lg text-xs text-red-400 flex items-center gap-1.5 transition-colors"
                      >
                        <TrashIcon className="w-3.5 h-3.5" />
                        Löschen
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-white/[0.02] rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-white">
                        {projectData.project.name}
                      </h4>
                      <span className="px-2.5 py-1 bg-[#FC682C]/20 text-[#FC682C] text-xs rounded-lg">
                        {projectData.project.package}
                      </span>
                    </div>
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-white/40">Fortschritt</span>
                        <span className="text-white">
                          {projectData.project.progress}%
                        </span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#FC682C] to-[#9D65C9] rounded-full transition-all"
                          style={{ width: `${projectData.project.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-sm text-white/40">
                      Manager: {projectData.project.manager}
                    </div>
                  </div>

                  {/* Preview URL Section */}
                  <div className="p-4 bg-white/[0.02] rounded-xl space-y-3">
                    <h4 className="text-sm font-medium text-white/70 flex items-center gap-2">
                      <EyeIcon className="w-4 h-4" />
                      Live-Vorschau
                    </h4>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://staging.kunde-website.de"
                        value={projectData.project.preview_url || ""}
                        onChange={(e) => {
                          setProjectData({
                            ...projectData,
                            project: {
                              ...projectData.project,
                              preview_url: e.target.value,
                            },
                          });
                        }}
                        className="flex-1 px-3 py-2 bg-white/[0.04] border border-white/[0.06] rounded-lg text-white text-sm focus:border-[#FC682C]/50 outline-none"
                      />
                      <button
                        onClick={async () => {
                          try {
                            const res = await fetch(
                              `/api/projects/${projectData.project.id}`,
                              {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  preview_url: projectData.project.preview_url,
                                  preview_enabled: projectData.project
                                    .preview_enabled
                                    ? 1
                                    : 0,
                                }),
                              },
                            );
                            if (res.ok) {
                              alert("Preview-URL gespeichert!");
                            }
                          } catch {
                            alert("Fehler beim Speichern");
                          }
                        }}
                        className="px-4 py-2 bg-[#FC682C] text-white rounded-lg text-sm font-medium"
                      >
                        Speichern
                      </button>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={projectData.project.preview_enabled === 1}
                        onChange={(e) => {
                          const newEnabled = e.target.checked ? 1 : 0;
                          setProjectData({
                            ...projectData,
                            project: {
                              ...projectData.project,
                              preview_enabled: newEnabled,
                            },
                          });
                          // Auto-save toggle
                          fetch(`/api/projects/${projectData.project.id}`, { credentials: "include",
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              preview_enabled: newEnabled,
                            }),
                          });
                        }}
                        className="w-4 h-4 rounded bg-white/10 border-white/20 text-[#FC682C] focus:ring-[#FC682C]"
                      />
                      <span className="text-sm text-white/70">
                        Vorschau für Kunde aktivieren
                      </span>
                    </label>
                    {projectData.project.preview_url &&
                      projectData.project.preview_enabled === 1 && (
                        <a
                          href={projectData.project.preview_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-[#FC682C] hover:underline"
                        >
                          <LinkIcon className="w-4 h-4" />
                          Vorschau öffnen
                        </a>
                      )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-white/70">Meilensteine</h4>
                      <button
                        onClick={async () => {
                          const title = prompt("Meilenstein-Titel:");
                          if (title) {
                            await fetch(`/api/projects/${projectData.project.id}/milestones`, {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              credentials: "include",
                              body: JSON.stringify({ title, status: "pending" }),
                            });
                            const data = await fetch(`/api/projects/${client.project_id}`, { credentials: "include" }).then(r => r.json());
                            setProjectData(data);
                          }
                        }}
                        className="text-xs text-[#FC682C] hover:text-[#FF8F5C] flex items-center gap-1"
                      >
                        <PlusIcon className="w-3.5 h-3.5" />
                        Hinzufügen
                      </button>
                    </div>
                    {projectData.milestones?.map((m: any) => (
                      <div
                        key={m.id}
                        className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-xl group"
                      >
                        <button
                          onClick={() =>
                            handleUpdateMilestone(
                              m.id,
                              m.status === "done"
                                ? "pending"
                                : m.status === "current"
                                  ? "done"
                                  : "current",
                            )
                          }
                          className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                            m.status === "done"
                              ? "bg-green-500"
                              : m.status === "current"
                                ? "bg-[#FC682C]"
                                : "bg-white/10"
                          }`}
                        >
                          {m.status === "done" && (
                            <CheckCircleIcon className="w-4 h-4 text-white" />
                          )}
                          {m.status === "current" && (
                            <ClockIcon className="w-4 h-4 text-white" />
                          )}
                        </button>
                        <div className="flex-1">
                          <div className="text-sm text-white">{m.title}</div>
                          {m.date && (
                            <div className="text-xs text-white/40">{m.date}</div>
                          )}
                        </div>
                        <button
                          onClick={async () => {
                            if (!confirm("Meilenstein löschen?")) return;
                            await fetch(`/api/projects/${projectData.project.id}/milestones/${m.id}`, {
                              method: "DELETE",
                              credentials: "include",
                            });
                            const data = await fetch(`/api/projects/${client.project_id}`, { credentials: "include" }).then(r => r.json());
                            setProjectData(data);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 rounded transition-all"
                        >
                          <TrashIcon className="w-3.5 h-3.5 text-red-400" />
                        </button>
                      </div>
                    ))}
                    {(!projectData.milestones || projectData.milestones.length === 0) && (
                      <div className="text-center text-white/30 py-4 text-sm">Keine Meilensteine</div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center text-white/40 py-8">
                  Kein Projekt vorhanden
                </div>
              )}
            </div>
          )}

          {activeTab === "messages" && (
            <div className="space-y-4">
              {/* Message Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nachricht senden..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 px-4 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-white text-sm focus:border-[#FC682C]/50 outline-none"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={sendingMessage || !newMessage.trim()}
                  className="px-4 py-2.5 bg-[#FC682C] text-white rounded-xl text-sm font-medium disabled:opacity-50"
                >
                  <PaperAirplaneIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Messages List */}
              <div className="space-y-3">
                {projectData?.messages?.length > 0 ? (
                  projectData.messages.map((msg: any) => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-xl group relative ${msg.sender_type === "admin" ? "bg-[#FC682C]/10 ml-8" : "bg-white/[0.02] mr-8"}`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-white/70">
                            {msg.sender_name}
                          </span>
                          <span className="text-xs text-white/30">
                            {new Date(msg.created_at).toLocaleString("de-DE")}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all"
                          title="Nachricht löschen"
                        >
                          <TrashIcon className="w-3.5 h-3.5 text-red-400" />
                        </button>
                      </div>
                      <p className="text-sm text-white/80">{msg.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-white/40 py-8">
                    Keine Nachrichten
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "approvals" && (
            <div className="space-y-4">
              {/* Add New Approval Button */}
              {client.project_id && (
                <button
                  onClick={() => setShowNewApprovalForm(!showNewApprovalForm)}
                  className="w-full py-3 border-2 border-dashed border-white/20 rounded-xl text-white/60 hover:border-[#FC682C]/50 hover:text-[#FC682C] transition-colors flex items-center justify-center gap-2"
                >
                  <PlusIcon className="w-4 h-4" />
                  Neue Freigabe-Anfrage
                </button>
              )}

              {/* New Approval Form */}
              {showNewApprovalForm && (
                <div className="p-4 bg-white/[0.04] border border-white/[0.08] rounded-xl space-y-3">
                  <h4 className="text-sm font-medium text-white">
                    Neue Freigabe erstellen
                  </h4>
                  <div>
                    <label className="block text-xs text-white/40 mb-1">
                      Titel *
                    </label>
                    <input
                      type="text"
                      placeholder="z.B. Homepage Design"
                      value={newApproval.title}
                      onChange={(e) =>
                        setNewApproval({
                          ...newApproval,
                          title: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.06] rounded-lg text-white text-sm focus:border-[#FC682C]/50 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/40 mb-1">
                      Beschreibung
                    </label>
                    <textarea
                      placeholder="Was soll der Kunde freigeben?"
                      value={newApproval.description}
                      onChange={(e) =>
                        setNewApproval({
                          ...newApproval,
                          description: e.target.value,
                        })
                      }
                      rows={2}
                      className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.06] rounded-lg text-white text-sm focus:border-[#FC682C]/50 outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/40 mb-1">
                      Typ
                    </label>
                    <select
                      value={newApproval.type}
                      onChange={(e) =>
                        setNewApproval({ ...newApproval, type: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.06] rounded-lg text-white text-sm focus:border-[#FC682C]/50 outline-none"
                    >
                      <option value="design">Design</option>
                      <option value="content">Inhalt</option>
                      <option value="feature">Feature</option>
                      <option value="final">Finale Abnahme</option>
                    </select>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => {
                        setShowNewApprovalForm(false);
                        setNewApproval({
                          title: "",
                          description: "",
                          type: "design",
                        });
                      }}
                      className="flex-1 py-2 bg-white/[0.06] text-white/60 rounded-lg text-sm hover:bg-white/[0.1]"
                    >
                      Abbrechen
                    </button>
                    <button
                      onClick={async () => {
                        if (!newApproval.title.trim() || !client.project_id)
                          return;
                        try {
                          const res = await fetch("/api/approvals", { credentials: "include",
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              project_id: client.project_id,
                              title: newApproval.title,
                              description: newApproval.description,
                              type: newApproval.type,
                            }),
                          });
                          if (res.ok) {
                            setShowNewApprovalForm(false);
                            setNewApproval({
                              title: "",
                              description: "",
                              type: "design",
                            });
                            fetchApprovals();
                          }
                        } catch (error) {
                          console.error("Failed to create approval:", error);
                        }
                      }}
                      disabled={!newApproval.title.trim()}
                      className="flex-1 py-2 bg-[#FC682C] text-white rounded-lg text-sm font-medium disabled:opacity-50"
                    >
                      Erstellen
                    </button>
                  </div>
                </div>
              )}

              {/* Approvals List */}
              {approvals.length > 0 ? (
                <div className="space-y-3">
                  {approvals.map((approval) => (
                    <div
                      key={approval.id}
                      className={`p-4 rounded-xl border ${
                        approval.status === "pending"
                          ? "bg-yellow-500/5 border-yellow-500/20"
                          : approval.status === "approved"
                            ? "bg-green-500/5 border-green-500/20"
                            : "bg-red-500/5 border-red-500/20"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-medium text-white">
                              {approval.title}
                            </h4>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                                approval.type === "design"
                                  ? "bg-purple-500/20 text-purple-400"
                                  : approval.type === "content"
                                    ? "bg-blue-500/20 text-blue-400"
                                    : approval.type === "feature"
                                      ? "bg-cyan-500/20 text-cyan-400"
                                      : "bg-[#FC682C]/20 text-[#FC682C]"
                              }`}
                            >
                              {approval.type === "design"
                                ? "Design"
                                : approval.type === "content"
                                  ? "Inhalt"
                                  : approval.type === "feature"
                                    ? "Feature"
                                    : "Finale Abnahme"}
                            </span>
                          </div>
                          {approval.description && (
                            <p className="text-xs text-white/50 mb-2">
                              {approval.description}
                            </p>
                          )}
                          <div className="flex items-center gap-3 text-xs text-white/40">
                            <span>
                              Erstellt:{" "}
                              {new Date(approval.created_at).toLocaleDateString(
                                "de-DE",
                              )}
                            </span>
                            {approval.approved_at && (
                              <span>
                                {approval.status === "approved"
                                  ? "Freigegeben"
                                  : "Feedback"}
                                :{" "}
                                {new Date(
                                  approval.approved_at,
                                ).toLocaleDateString("de-DE")}
                              </span>
                            )}
                          </div>
                          {approval.feedback && (
                            <div className="mt-2 p-2 bg-white/[0.04] rounded-lg">
                              <span className="text-xs text-white/40">
                                Kunden-Feedback:{" "}
                              </span>
                              <span className="text-xs text-white/70">
                                {approval.feedback}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {approval.status === "pending" && (
                            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-xs font-medium flex items-center gap-1">
                              <ClockIcon className="w-3 h-3" />
                              Ausstehend
                            </span>
                          )}
                          {approval.status === "approved" && (
                            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs font-medium flex items-center gap-1">
                              <CheckCircleIcon className="w-3 h-3" />
                              Freigegeben
                            </span>
                          )}
                          {approval.status === "changes_requested" && (
                            <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs font-medium flex items-center gap-1">
                              <ExclamationCircleIcon className="w-3 h-3" />
                              Änderungen
                            </span>
                          )}
                          <button
                            onClick={async () => {
                              if (confirm("Freigabe-Anfrage löschen?")) {
                                await fetch(
                                  `/api/approvals?id=${approval.id}`,
                                  { method: "DELETE" },
                                );
                                fetchApprovals();
                              }
                            }}
                            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <TrashIcon className="w-4 h-4 text-white/30 hover:text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-white/40">
                  <ClipboardDocumentCheckIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Keine Freigabe-Anfragen</p>
                  <p className="text-xs mt-1">
                    Erstellen Sie eine Anfrage, um Kunden-Feedback zu erhalten
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CreateClientModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    packageType: "Starter",
  });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setError("Name und E-Mail sind erforderlich");
      return;
    }

    setCreating(true);
    setError("");

    try {
      const res = await fetch("/api/clients", { credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        onCreated();
        onClose();
      } else {
        setError(data.error || "Fehler beim Erstellen");
      }
    } catch {
      setError("Netzwerkfehler");
    }

    setCreating(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#0f0f12] border border-white/[0.06] rounded-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
          <h3 className="font-semibold text-white">Neuer Portal-Kunde</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-white/40" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs text-white/40 mb-2">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-white text-sm focus:border-[#FC682C]/50 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-white/40 mb-2">E-Mail *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-white text-sm focus:border-[#FC682C]/50 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-white/40 mb-2">Firma</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-white text-sm focus:border-[#FC682C]/50 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-white/40 mb-2">Telefon</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-white text-sm focus:border-[#FC682C]/50 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-white/40 mb-2">Paket</label>
            <select
              value={formData.packageType}
              onChange={(e) =>
                setFormData({ ...formData, packageType: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-white text-sm focus:border-[#FC682C]/50 outline-none"
            >
              <option value="Starter">Starter</option>
              <option value="Business">Business</option>
              <option value="Premium">Premium</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={creating}
            className="w-full py-3 bg-gradient-to-r from-[#FC682C] to-[#FF8F5C] text-white rounded-xl font-medium disabled:opacity-50"
          >
            {creating ? "Erstelle..." : "Kunde erstellen"}
          </button>
        </form>
      </div>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="max-w-2xl space-y-6">
      <GlassCard title="Profil" icon={UsersIcon}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-white/40 mb-2">Name</label>
            <input
              type="text"
              defaultValue="Admin"
              className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.06] rounded-xl text-white focus:border-[#FC682C]/50 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-2">E-Mail</label>
            <input
              type="email"
              defaultValue="admin@agentflow.de"
              className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.06] rounded-xl text-white focus:border-[#FC682C]/50 outline-none"
            />
          </div>
        </div>
      </GlassCard>

      <GlassCard title="Benachrichtigungen" icon={BellIcon}>
        <div className="space-y-4">
          <SettingToggle label="E-Mail bei neuem Lead" defaultChecked />
          <SettingToggle label="Telegram-Benachrichtigungen" defaultChecked />
          <SettingToggle label="Tägliche Zusammenfassung" />
        </div>
      </GlassCard>

      <GlassCard title="Gefährliche Zone" icon={ExclamationCircleIcon}>
        <div className="flex gap-3">
          <button
            onClick={() => {
              if (confirm("Alle Rate-Limit-Einträge löschen?")) {
                fetch("/api/notifications", { method: "DELETE", credentials: "include" })
                  .then(() => alert("Cache geleert."))
                  .catch(() => alert("Fehler beim Leeren."));
              }
            }}
            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-xl text-sm hover:bg-red-500/30 transition-colors"
          >
            Cache leeren
          </button>
          <button
            onClick={() => {
              if (confirm("Alle alten Logs löschen? Diese Aktion kann nicht rückgängig gemacht werden.")) {
                alert("Logs wurden geleert.");
              }
            }}
            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-xl text-sm hover:bg-red-500/30 transition-colors"
          >
            Alle Logs löschen
          </button>
        </div>
      </GlassCard>
    </div>
  );
}

function SettingToggle({
  label,
  defaultChecked = false,
}: {
  label: string;
  defaultChecked?: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-white/70">{label}</span>
      <button
        onClick={() => setChecked(!checked)}
        className={`relative w-12 h-6 rounded-full transition-colors ${checked ? "bg-[#FC682C]" : "bg-white/20"}`}
      >
        <div
          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${checked ? "left-7" : "left-1"}`}
        />
      </button>
    </div>
  );
}

function NewLeadModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    packageInterest: "",
    budget: "",
    source: "Manuell",
    message: "",
    priority: "medium",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch("/api/leads", { credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, status: "new" }),
      });
      onCreated();
      onClose();
    } catch (error) {
      console.error("Failed to create lead:", error);
    } finally {
      setLoading(false);
    }
  };

  const packages = [
    "Growth Website",
    "Business Website",
    "One-Page Website",
    "Website-Check",
    "Sonstiges",
  ];
  const sources = [
    "Manuell",
    "Website",
    "Empfehlung",
    "Social Media",
    "Telefon",
    "E-Mail",
    "Sonstige",
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#0f0f12] border border-white/[0.08] rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06] bg-gradient-to-r from-[#FC682C]/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#FC682C]/20">
              <UsersIcon className="w-5 h-5 text-[#FC682C]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Neuen Lead anlegen
              </h3>
              <p className="text-xs text-white/40">
                Fülle die Daten aus um einen neuen Lead zu erstellen
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl"
          >
            <XMarkIcon className="w-5 h-5 text-white/60" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5 max-h-[60vh] overflow-y-auto"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/40 mb-2">Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Max Mustermann"
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white placeholder:text-white/30 focus:border-[#FC682C]/50 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-2">
                E-Mail *
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="max@example.com"
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white placeholder:text-white/30 focus:border-[#FC682C]/50 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-2">
                Telefon
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+49 123 456789"
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white placeholder:text-white/30 focus:border-[#FC682C]/50 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-2">Firma</label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="Musterfirma GmbH"
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white placeholder:text-white/30 focus:border-[#FC682C]/50 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-2">Paket</label>
              <select
                value={form.packageInterest}
                onChange={(e) =>
                  setForm({ ...form, packageInterest: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white focus:border-[#FC682C]/50 outline-none cursor-pointer"
              >
                <option value="">Paket auswählen...</option>
                {packages.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-2">Budget</label>
              <input
                type="text"
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
                placeholder="z.B. 5.000€"
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white placeholder:text-white/30 focus:border-[#FC682C]/50 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-2">Quelle</label>
              <select
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white focus:border-[#FC682C]/50 outline-none cursor-pointer"
              >
                {sources.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-2">
                Priorität
              </label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white focus:border-[#FC682C]/50 outline-none cursor-pointer"
              >
                <option value="low">Niedrig</option>
                <option value="medium">Mittel</option>
                <option value="high">Hoch</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-white/40 mb-2">
              Nachricht
            </label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Details zum Projekt..."
              rows={3}
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white placeholder:text-white/30 focus:border-[#FC682C]/50 outline-none resize-none"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-white/[0.06] bg-white/[0.02]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-white/60 hover:text-white transition-colors"
          >
            Abbrechen
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !form.name || !form.email}
            className="px-6 py-2 bg-[#FC682C] text-white rounded-xl font-medium hover:bg-[#FC682C]/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Wird gespeichert...
              </>
            ) : (
              <>
                <PlusIcon className="w-4 h-4" /> Lead anlegen
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
// Deployment trigger 1771545699
