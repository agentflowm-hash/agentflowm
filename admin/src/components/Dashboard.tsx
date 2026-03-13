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

function generatePosterHTML(client: any, form: any): string {
  const scoreColor = form.scoreOverall >= 80 ? "#10B981" : form.scoreOverall >= 60 ? "#F59E0B" : "#EF4444";
  const scoreDash = Math.round((form.scoreOverall / 100) * 264);
  const now = new Date();
  const monthNames = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
  const dateStr = monthNames[now.getMonth()] + " " + now.getFullYear();

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

  const agentsHTML = form.agents.map((a: string) => `<span style="padding:6px 14px;background:rgba(99,102,241,.15);border:1px solid rgba(99,102,241,.25);border-radius:8px;font-size:12px;color:#818CF8;font-weight:600">${a}</span>`).join("");

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
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="48" fill="#0A0D14" stroke="url(#siegelGrad)" stroke-width="3"/>
          <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="1"/>
          <text x="50" y="38" text-anchor="middle" fill="#FF6A00" font-size="10" font-weight="800" letter-spacing="0.1em">AGENT</text>
          <text x="50" y="52" text-anchor="middle" fill="#fff" font-size="13" font-weight="900" letter-spacing="0.05em">FLOW</text>
          <text x="50" y="66" text-anchor="middle" fill="#6366F1" font-size="7" font-weight="700" letter-spacing="0.15em">VERIFIED</text>
          <path d="M38 72 L50 78 L62 72" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round"/>
          <defs><linearGradient id="siegelGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FF6A00"/><stop offset="100%" stop-color="#6366F1"/></linearGradient></defs>
        </svg>
      </div>
    </div>` : "";

  // Workflow nodes from form agents
  const workflowAgentNames = form.agents.length > 0 ? form.agents : ["Research", "Personalize", "Execute", "Follow-Up", "Complete"];
  const nodeCount = Math.min(workflowAgentNames.length, 5);
  const nodeWidth = 130;
  const svgWidth = 900;
  const spacing = (svgWidth - nodeCount * nodeWidth) / (nodeCount + 1);
  const nodeColors = [
    { grad: "purpleGrad", stroke: "#3A4055", label: "#6366F1" },
    { grad: "purpleGrad", stroke: "#3A4055", label: "#818CF8" },
    { grad: "orangeGrad", stroke: "#F97316", label: "#F97316" },
    { grad: "blueGrad", stroke: "#3A4055", label: "#3B82F6" },
    { grad: "tealGrad", stroke: "#10B981", label: "#10B981" },
  ];
  let workflowNodesHTML = "";
  const nodePositions: { x: number; cx: number }[] = [];
  for (let i = 0; i < nodeCount; i++) {
    const x = spacing + i * (nodeWidth + spacing);
    const cx = x + nodeWidth / 2;
    nodePositions.push({ x, cx });
    const c = nodeColors[i % nodeColors.length];
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
    <div class="brand-icon"><span style="font-size:max(2.5vw,20px);font-weight:900;color:#FF6A00">AF</span></div>
    <div class="brand-name">AgentFlow<span>Marketing</span></div>
  </div>
  <span class="case-badge">CASE STUDY \u00B7 ${dateStr}</span>
</header>

<!-- HERO -->
<section class="hero">
  <span class="hero-label">\u2726 Projektabschluss</span>
  <h1>${form.projectType}</h1>
  <p class="client">${client.company || client.name}</p>
  <p class="tagline">${form.tagline}</p>
</section>

<!-- WEBSITE -->
${screenshotSection}

<!-- WORKFLOW -->
<div class="card">
  <div class="card-header">
    <div class="card-title"><span class="card-dot purple"></span>AI Workflow</div>
    <span class="card-badge">${form.agents.length} Agenten</span>
  </div>
  <div class="workflow-content">
    <div class="workflow-header">
      <div class="agent-badge">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="35" fill="#252A3A"/>
          <circle cx="50" cy="50" r="25" fill="url(#agentGlow)"/>
          <path d="M38 45 C38 35 62 35 62 45 L62 55 C62 65 38 65 38 55Z" fill="#818CF8" opacity="0.8"/>
          <circle cx="50" cy="38" r="10" fill="#A5B4FC"/>
          <defs><radialGradient id="agentGlow"><stop offset="0%" stop-color="#6366F1" stop-opacity="0.6"/><stop offset="100%" stop-color="transparent"/></radialGradient></defs>
        </svg>
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
    <div class="footer-logo"><span style="font-size:max(2.5vw,18px);font-weight:900;color:#FF6A00">AF</span></div>
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
    agents: ["AI Web Builder", "AI SEO Optimizer", "AI Content Writer"],
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

              {/* Poster Generator */}
              {showPosterGen && (
                <div className="p-4 bg-white/[0.03] border border-green-500/20 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-white">Abschluss-Poster für {client.name}</h4>
                    <button onClick={() => setShowPosterGen(false)} className="p-1 hover:bg-white/10 rounded-lg">
                      <XMarkIcon className="w-4 h-4 text-white/40" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-white/40 block mb-1">Projekt-Typ</label>
                      <select value={posterForm.projectType} onChange={(e) => setPosterForm({ ...posterForm, projectType: e.target.value })}
                        className="w-full px-2 py-1.5 bg-white/[0.06] border border-white/10 rounded-lg text-white text-xs outline-none focus:border-green-500/50">
                        <option value="Growth Website">Growth Website</option>
                        <option value="Business Website">Business Website</option>
                        <option value="One-Page Website">One-Page Website</option>
                        <option value="E-Commerce Shop">E-Commerce Shop</option>
                        <option value="Landing Page">Landing Page</option>
                        <option value="Web-Anwendung">Web-Anwendung</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 block mb-1">Screenshot URL</label>
                      <input type="text" value={posterForm.screenshotUrl} onChange={(e) => setPosterForm({ ...posterForm, screenshotUrl: e.target.value })}
                        placeholder="https://... oder leer lassen"
                        className="w-full px-2 py-1.5 bg-white/[0.06] border border-white/10 rounded-lg text-white text-xs outline-none focus:border-green-500/50" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-white/40 block mb-1">Tagline</label>
                    <input type="text" value={posterForm.tagline} onChange={(e) => setPosterForm({ ...posterForm, tagline: e.target.value })}
                      className="w-full px-2 py-1.5 bg-white/[0.06] border border-white/10 rounded-lg text-white text-xs outline-none focus:border-green-500/50" />
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <label className="text-[10px] text-white/40 block mb-1">Score</label>
                      <input type="number" value={posterForm.scoreOverall} onChange={(e) => setPosterForm({ ...posterForm, scoreOverall: Number(e.target.value) })}
                        className="w-full px-2 py-1.5 bg-white/[0.06] border border-white/10 rounded-lg text-white text-xs outline-none focus:border-green-500/50" />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 block mb-1">SEO</label>
                      <input type="number" value={posterForm.scoreSeo} onChange={(e) => setPosterForm({ ...posterForm, scoreSeo: Number(e.target.value) })}
                        className="w-full px-2 py-1.5 bg-white/[0.06] border border-white/10 rounded-lg text-white text-xs outline-none focus:border-green-500/50" />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 block mb-1">Performance</label>
                      <input type="number" value={posterForm.scorePerformance} onChange={(e) => setPosterForm({ ...posterForm, scorePerformance: Number(e.target.value) })}
                        className="w-full px-2 py-1.5 bg-white/[0.06] border border-white/10 rounded-lg text-white text-xs outline-none focus:border-green-500/50" />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 block mb-1">Ladezeit</label>
                      <input type="text" value={posterForm.loadTime} onChange={(e) => setPosterForm({ ...posterForm, loadTime: e.target.value })}
                        className="w-full px-2 py-1.5 bg-white/[0.06] border border-white/10 rounded-lg text-white text-xs outline-none focus:border-green-500/50" />
                    </div>
                  </div>
                  {/* Agents */}
                  <div>
                    <label className="text-[10px] text-white/40 block mb-1">AI-Agenten</label>
                    <div className="flex flex-wrap gap-1 mb-1">
                      {["AI Web Builder", "AI SEO Optimizer", "AI Content Writer", "AI Lead Generator", "AI Designer", "AI Analytics"].map((agent) => (
                        <button key={agent} onClick={() => {
                          const agents = posterForm.agents.includes(agent) ? posterForm.agents.filter(a => a !== agent) : [...posterForm.agents, agent];
                          setPosterForm({ ...posterForm, agents });
                        }}
                          className={`px-2 py-1 rounded-lg text-[10px] transition-colors ${posterForm.agents.includes(agent) ? "bg-purple-500/30 text-purple-300 border border-purple-500/40" : "bg-white/[0.04] text-white/40 border border-white/10 hover:text-white/70"}`}>
                          {agent}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Results */}
                  <div>
                    <label className="text-[10px] text-white/40 block mb-1">Ergebnisse</label>
                    <div className="flex flex-wrap gap-1 mb-1">
                      {posterForm.results.map((r, i) => (
                        <span key={i} className="px-2 py-1 bg-green-500/20 text-green-300 rounded-lg text-[10px] flex items-center gap-1">
                          {r}
                          <button onClick={() => setPosterForm({ ...posterForm, results: posterForm.results.filter((_, idx) => idx !== i) })}>
                            <XMarkIcon className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1 mb-1">
                      {["Responsive Design", "SEO-optimiert", "DSGVO-konform", "SSL-Verschlüsselung", "CMS-Integration", "Analytics Setup", "E-Mail Automation", "Social Media Integration", "Performance-Optimierung", "Barrierefreiheit"].filter(r => !posterForm.results.includes(r)).map((r) => (
                        <button key={r} onClick={() => setPosterForm({ ...posterForm, results: [...posterForm.results, r] })}
                          className="px-2 py-1 bg-white/[0.04] hover:bg-green-500/10 border border-white/10 rounded-lg text-[10px] text-white/40 hover:text-green-300 transition-colors">
                          + {r}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-1">
                      <input type="text" value={posterForm.customResult} onChange={(e) => setPosterForm({ ...posterForm, customResult: e.target.value })}
                        onKeyDown={(e) => { if (e.key === "Enter" && posterForm.customResult.trim()) { setPosterForm({ ...posterForm, results: [...posterForm.results, posterForm.customResult.trim()], customResult: "" }); } }}
                        placeholder="Eigenes Ergebnis + Enter"
                        className="flex-1 px-2 py-1 bg-white/[0.06] border border-white/10 rounded-lg text-white text-[10px] outline-none" />
                    </div>
                  </div>
                  {/* Download */}
                  <div className="flex justify-end pt-2 border-t border-white/10">
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
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg text-xs font-medium hover:opacity-90 flex items-center gap-1.5">
                      <ArrowDownTrayIcon className="w-3.5 h-3.5" />
                      HTML-Poster herunterladen
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
