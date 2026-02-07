"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  HomeIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowRightStartOnRectangleIcon,
  ArrowPathIcon,
  PaperAirplaneIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  RocketLaunchIcon,
  CalendarDaysIcon,
  UserCircleIcon,
  PhotoIcon,
  ArchiveBoxIcon,
  DocumentIcon,
  Cog6ToothIcon,
  BellIcon,
  ChevronDownIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  LightBulbIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  DocumentArrowUpIcon,
  EyeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  CheckCircleIcon as CheckCircleSolid,
  UserCircleIcon as UserCircleSolid,
} from "@heroicons/react/24/solid";

// Next-Level Components
import {
  LanguageSwitcher,
  VoiceRecorder,
  Confetti,
  AnimatedProgress,
  CalendarExport,
  FilePreview,
  useToast,
} from "@/components";

type Tab = "overview" | "messages" | "files" | "approvals" | "preview";

interface ProjectData {
  client: { id: number; name: string; email: string; company: string | null };
  project: {
    id: number;
    name: string;
    package: string;
    status: string;
    statusLabel: string;
    progress: number;
    startDate: string;
    estimatedEnd: string;
    manager: string;
    previewUrl: string | null;
    previewEnabled: boolean;
  };
  milestones: {
    id: number;
    title: string;
    status: string;
    date: string | null;
  }[];
  messages: {
    id: number;
    from: string;
    senderType: string;
    text: string;
    time: string;
    unread: boolean;
  }[];
  files: {
    id: number;
    name: string;
    size: string;
    date: string;
    type: string;
  }[];
  unreadCount: number;
  approvals?: {
    id: number;
    title: string;
    description: string | null;
    type: string;
    status: string;
    milestone_title: string | null;
    created_at: string;
    approved_at: string | null;
    feedback: string | null;
  }[];
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [newMessage, setNewMessage] = useState("");
  const [data, setData] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showQuickStart, setShowQuickStart] = useState(true);
  // Next-Level state
  const [showConfetti, setShowConfetti] = useState(false);
  const [previewFile, setPreviewFile] = useState<number | null>(null);
  const router = useRouter();
  const { showToast } = useToast();

  const t = useTranslations();
  const tNav = useTranslations("navigation");
  const tDash = useTranslations("dashboard");
  const tMsg = useTranslations("messages");
  const tFiles = useTranslations("files");
  const tApprovals = useTranslations("approvals");
  const tPreview = useTranslations("preview");
  const tProfile = useTranslations("profile");
  const tQuickStart = useTranslations("quickStart");
  const tFooter = useTranslations("footer");
  const tError = useTranslations("error");
  const tCommon = useTranslations("common");

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/project", { credentials: "include" });
      if (res.status === 401) {
        router.push("/");
        return;
      }
      if (!res.ok) throw new Error(tError("couldNotLoad"));
      const json = await res.json();
      setData(json);
      setError(null);
    } catch {
      setError(tError("couldNotLoad"));
    } finally {
      setLoading(false);
    }
  }, [router, tError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    router.push("/");
  };

  const handleFileUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    const fileArray = Array.from(files);
    let uploaded = 0;

    for (const file of fileArray) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/files", {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        if (res.ok) {
          uploaded++;
          setUploadProgress(Math.round((uploaded / fileArray.length) * 100));
        }
      } catch (error) {
        console.error("Upload error:", error);
      }
    }

    setUploading(false);
    setUploadProgress(0);
    fetchData(); // Refresh to show new files
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newMessage }),
        credentials: "include",
      });

      if (res.ok) {
        const { message } = await res.json();
        setData((prev) =>
          prev
            ? {
                ...prev,
                messages: [message, ...prev.messages],
              }
            : null,
        );
        setNewMessage("");
      }
    } catch {
      // ignore
    } finally {
      setSending(false);
    }
  };

  const markAsRead = async () => {
    if (!data?.unreadCount) return;
    await fetch("/api/messages", { method: "PATCH", credentials: "include" });
    setData((prev) =>
      prev
        ? {
            ...prev,
            unreadCount: 0,
            messages: prev.messages.map((m) => ({ ...m, unread: false })),
          }
        : null,
    );
  };

  useEffect(() => {
    if (activeTab === "messages" && data?.unreadCount) {
      markAsRead();
    }
  }, [activeTab, data?.unreadCount]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
            <div className="absolute inset-0 rounded-full border-4 border-[#FC682C] border-t-transparent spinner"></div>
          </div>
          <p className="text-white/50 text-lg">{tError("dashboardLoading")}</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4">
        <div className="portal-card text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
            <ExclamationTriangleIcon className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            {tError("loadingError")}
          </h2>
          <p className="text-white/50 mb-6">
            {error || tError("somethingWentWrong")}
          </p>
          <button onClick={fetchData} className="portal-btn">
            <ArrowPathIcon className="w-4 h-4 inline mr-2" />
            {tCommon("retry")}
          </button>
        </div>
      </div>
    );
  }

  const { client, project, milestones, messages, files, unreadCount } = data;
  const completedMilestones = milestones.filter(
    (m) => m.status === "done",
  ).length;

  const navItems = [
    { id: "overview" as Tab, label: tNav("overview"), icon: HomeIcon },
    {
      id: "messages" as Tab,
      label: tNav("messages"),
      icon: ChatBubbleLeftRightIcon,
      badge: unreadCount,
    },
    {
      id: "files" as Tab,
      label: tNav("files"),
      icon: DocumentTextIcon,
      badge: files.length,
    },
    { id: "approvals" as Tab, label: tNav("approvals"), icon: CheckCircleIcon },
    ...(project.previewEnabled
      ? [{ id: "preview" as Tab, label: tNav("preview"), icon: EyeIcon }]
      : []),
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return { icon: PhotoIcon, class: "file-icon-image" };
      case "archive":
        return { icon: ArchiveBoxIcon, class: "file-icon-archive" };
      case "pdf":
        return { icon: DocumentIcon, class: "file-icon-pdf" };
      case "doc":
        return { icon: DocumentTextIcon, class: "file-icon-doc" };
      default:
        return { icon: DocumentIcon, class: "file-icon-default" };
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b]">
      {/* Confetti Celebration */}
      <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Header */}
      <header className="border-b border-white/[0.06] bg-[#0f0f12]/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src="/logo-dark.png"
                alt="AgentFlow"
                className="h-10 w-auto"
              />
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Language Switcher (only on .com) */}
              <LanguageSwitcher />

              {/* Notifications */}
              <button className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all">
                <BellIcon className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FC682C] text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FC682C] to-[#FF8F5C] flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {client.name.charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-white hidden sm:inline">
                    {client.name.split(" ")[0]}
                  </span>
                  <ChevronDownIcon
                    className={`w-4 h-4 text-white/50 transition-transform ${showProfileMenu ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown Menu */}
                {showProfileMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setShowProfileMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-72 rounded-xl bg-[#0f0f12] border border-white/10 shadow-2xl shadow-black/50 z-40 overflow-hidden animate-fade-in">
                      {/* Profile Header */}
                      <div className="p-4 border-b border-white/[0.06] bg-gradient-to-br from-[#FC682C]/10 to-transparent">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FC682C] to-[#FF8F5C] flex items-center justify-center shadow-lg">
                            <span className="text-lg font-bold text-white">
                              {client.name.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold truncate">
                              {client.name}
                            </p>
                            <p className="text-xs text-white/50 truncate">
                              {client.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2">
                        <button
                          onClick={() => {
                            setShowProfileModal(true);
                            setShowProfileMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-all text-left"
                        >
                          <UserCircleIcon className="w-5 h-5" />
                          <span>{tProfile("myProfile")}</span>
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-all text-left">
                          <Cog6ToothIcon className="w-5 h-5" />
                          <span>{tCommon("settings")}</span>
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-all text-left">
                          <BellIcon className="w-5 h-5" />
                          <span>{tProfile("notifications")}</span>
                        </button>
                      </div>

                      {/* Logout */}
                      <div className="p-2 border-t border-white/[0.06]">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-left"
                        >
                          <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
                          <span>{tCommon("logout")}</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-white/[0.06] bg-[#09090b]/80 backdrop-blur-xl sticky top-[73px] z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide -mb-px">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-4 text-sm font-medium whitespace-nowrap transition-all border-b-2 ${
                  activeTab === item.id
                    ? "text-[#FC682C] border-[#FC682C]"
                    : "text-white/50 border-transparent hover:text-white hover:bg-white/[0.02]"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{item.label}</span>
                {item.badge ? (
                  <span
                    className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                      item.id === "messages" && unreadCount > 0
                        ? "bg-[#FC682C] text-white animate-pulse"
                        : "bg-white/10 text-white/60"
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === "overview" && (
          <div className="space-y-6 animate-fade-in">
            {/* Welcome Banner */}
            <div className="portal-card relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#FC682C]/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FC682C]/20 to-[#FC682C]/5 border border-[#FC682C]/20 flex items-center justify-center">
                    <SparklesIcon className="w-6 h-6 text-[#FC682C]" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                      {tDash("welcomeBack", { name: client.name.split(" ")[0] })}
                    </h2>
                    <p className="text-white/50">
                      {tDash("projectStatus")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Status Card */}
            <div className="portal-card">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-1">
                    {tDash("project")}
                  </p>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    {project.name}
                  </h2>
                  <p className="text-white/50 mt-1">
                    {tDash("package")}:{" "}
                    <span className="text-[#FC682C] font-medium">
                      {project.package}
                    </span>
                  </p>
                </div>
                <span className={`status-badge status-${project.status}`}>
                  <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                  {project.statusLabel}
                </span>
              </div>

              {/* Progress */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-white/50">
                    {tDash("overallProgress")}
                  </span>
                  <span className="text-2xl font-bold text-white">
                    {project.progress}%
                  </span>
                </div>
                <div className="h-4 bg-white/[0.05] rounded-full overflow-hidden border border-white/[0.08]">
                  <div
                    className="progress-bar transition-all duration-1000 ease-out"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <InfoCard
                  icon={CalendarDaysIcon}
                  label={tDash("projectStart")}
                  value={project.startDate}
                />
                <InfoCard
                  icon={RocketLaunchIcon}
                  label={tDash("plannedGoLive")}
                  value={project.estimatedEnd}
                />
                <InfoCard
                  icon={CheckCircleSolid}
                  label={tDash("milestones")}
                  value={`${completedMilestones}/${milestones.length}`}
                />
                <InfoCard
                  icon={UserCircleIcon}
                  label={tDash("contactPerson")}
                  value={project.manager}
                />
              </div>
            </div>

            {/* Milestones Timeline */}
            <div className="portal-card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">
                  {tDash("projectTimeline")}
                </h3>
                <span className="text-sm text-white/40">
                  {completedMilestones} {tDash("of")} {milestones.length} {tDash("completed")}
                </span>
              </div>

              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gradient-to-b from-emerald-500 via-[#FC682C] to-white/10"></div>

                <div className="space-y-4">
                  {milestones.map((milestone, index) => (
                    <div
                      key={milestone.id}
                      className="relative flex items-start gap-4 pl-2"
                    >
                      {/* Status Icon */}
                      <div
                        className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          milestone.status === "done"
                            ? "milestone-done"
                            : milestone.status === "current"
                              ? "milestone-current"
                              : "milestone-pending"
                        }`}
                      >
                        {milestone.status === "done" ? (
                          <CheckCircleSolid className="w-4 h-4" />
                        ) : milestone.status === "current" ? (
                          <ClockIcon className="w-4 h-4" />
                        ) : (
                          <span className="text-xs font-semibold">
                            {index + 1}
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div
                        className={`flex-1 pb-4 ${index < milestones.length - 1 ? "border-b border-white/[0.06]" : ""}`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <p
                            className={`font-medium ${
                              milestone.status === "pending"
                                ? "text-white/40"
                                : "text-white"
                            }`}
                          >
                            {milestone.title}
                          </p>
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-md ${
                              milestone.status === "done"
                                ? "bg-emerald-500/10 text-emerald-400"
                                : milestone.status === "current"
                                  ? "bg-[#FC682C]/10 text-[#FC682C]"
                                  : "bg-white/5 text-white/40"
                            }`}
                          >
                            {milestone.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="stat-card hover-lift">
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#FC682C] to-[#FF8F5C] bg-clip-text text-transparent">
                  {completedMilestones}
                </div>
                <p className="text-xs sm:text-sm text-white/50 mt-2">
                  {tDash("milestonesCompleted")}
                </p>
              </div>
              <div className="stat-card hover-lift">
                <div className="text-3xl sm:text-4xl font-bold text-white">
                  {messages.length}
                </div>
                <p className="text-xs sm:text-sm text-white/50 mt-2">
                  {tNav("messages")}
                </p>
              </div>
              <div className="stat-card hover-lift">
                <div className="text-3xl sm:text-4xl font-bold text-white">
                  {files.length}
                </div>
                <p className="text-xs sm:text-sm text-white/50 mt-2">{tNav("files")}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "messages" && (
          <div className="portal-card animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">{tMsg("title")}</h3>
              <span className="text-sm text-white/40">
                {tMsg("count", { count: messages.length })}
              </span>
            </div>

            {/* Messages List */}
            <div className="space-y-4 mb-6 max-h-[500px] overflow-y-auto pr-2">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <ChatBubbleLeftRightIcon className="w-12 h-12 text-white/20 mx-auto mb-4" />
                  <p className="text-white/40">{tMsg("noMessages")}</p>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={msg.id}
                    className={`message-bubble ${
                      msg.senderType === "client"
                        ? "message-bubble-client ml-8"
                        : "message-bubble-admin mr-8"
                    } ${msg.unread ? "ring-2 ring-[#FC682C]/50" : ""}`}
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-sm font-semibold ${
                          msg.senderType === "client"
                            ? "text-[#FC682C]"
                            : "text-white"
                        }`}
                      >
                        {msg.from}
                      </span>
                      <span className="text-xs text-white/30">{msg.time}</span>
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed">
                      {msg.text}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* New Message */}
            <form
              onSubmit={sendMessage}
              className="flex gap-3 pt-4 border-t border-white/[0.06]"
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={tMsg("placeholder")}
                className="portal-input flex-1"
                disabled={sending}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || sending}
                className="portal-btn disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
              >
                <PaperAirplaneIcon className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {sending ? tCommon("sending") : tCommon("send")}
                </span>
              </button>
            </form>
          </div>
        )}

        {activeTab === "files" && (
          <div className="portal-card animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">{tFiles("title")}</h3>
              <label className="portal-btn-secondary flex items-center gap-2 text-sm cursor-pointer">
                <CloudArrowUpIcon className="w-4 h-4" />
                <span className="hidden sm:inline">{tCommon("upload")}</span>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) =>
                    e.target.files && handleFileUpload(e.target.files)
                  }
                />
              </label>
            </div>

            {/* Drag & Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative mb-6 p-8 border-2 border-dashed rounded-2xl transition-all ${
                isDragging
                  ? "border-[#FC682C] bg-[#FC682C]/10"
                  : "border-white/20 hover:border-white/40"
              }`}
            >
              <div className="text-center">
                <CloudArrowUpIcon
                  className={`w-12 h-12 mx-auto mb-3 transition-colors ${isDragging ? "text-[#FC682C]" : "text-white/30"}`}
                />
                <p
                  className={`font-medium mb-1 transition-colors ${isDragging ? "text-[#FC682C]" : "text-white/60"}`}
                >
                  {isDragging
                    ? tFiles("dropHere")
                    : tFiles("dragFiles")}
                </p>
                <p className="text-xs text-white/40">
                  {tFiles("maxSize")}
                </p>
              </div>

              {/* Upload Progress */}
              {uploading && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 relative">
                      <svg className="w-full h-full -rotate-90">
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          fill="none"
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth="4"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          fill="none"
                          stroke="#FC682C"
                          strokeWidth="4"
                          strokeDasharray={`${uploadProgress * 1.76} 176`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-white font-bold">
                        {uploadProgress}%
                      </span>
                    </div>
                    <p className="text-white/60 text-sm">{tFiles("uploading")}</p>
                  </div>
                </div>
              )}
            </div>

            {/* File Categories */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {[
                { label: tFiles("all"), count: files.length, active: true },
                {
                  label: tFiles("images"),
                  count: files.filter((f) => f.type === "image").length,
                },
                {
                  label: tFiles("documents"),
                  count: files.filter((f) => ["pdf", "doc"].includes(f.type))
                    .length,
                },
                {
                  label: tFiles("other"),
                  count: files.filter(
                    (f) => !["image", "pdf", "doc"].includes(f.type),
                  ).length,
                },
              ].map((cat, i) => (
                <button
                  key={i}
                  className={`py-2 px-3 rounded-xl text-xs font-medium transition-colors ${
                    cat.active
                      ? "bg-[#FC682C]/20 text-[#FC682C] border border-[#FC682C]/30"
                      : "bg-white/[0.02] text-white/50 border border-white/[0.06] hover:bg-white/[0.05]"
                  }`}
                >
                  {cat.label} ({cat.count})
                </button>
              ))}
            </div>

            {files.length === 0 ? (
              <div className="text-center py-12">
                <DocumentTextIcon className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/40">{tFiles("noFiles")}</p>
                <p className="text-xs text-white/30 mt-1">
                  {tFiles("dragHint")}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {files.map((file, idx) => {
                  const fileIcon = getFileIcon(file.type);
                  const FileIcon = fileIcon.icon;
                  return (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/[0.12] transition-all cursor-pointer group hover-lift"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${fileIcon.class}`}
                        >
                          <FileIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-white font-medium group-hover:text-[#FC682C] transition-colors">
                            {file.name}
                          </p>
                          <p className="text-xs text-white/40">
                            {file.size} · {file.date}
                          </p>
                        </div>
                      </div>
                      <button className="px-4 py-2 text-sm font-medium text-[#FC682C] hover:bg-[#FC682C]/10 rounded-lg transition-colors">
                        {tCommon("download")}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "approvals" && (
          <ApprovalsTab
            approvals={data.approvals || []}
            clientName={client.name}
            onUpdate={fetchData}
            t={tApprovals}
          />
        )}

        {activeTab === "preview" &&
          project.previewEnabled &&
          project.previewUrl && (
            <PreviewTab
              previewUrl={project.previewUrl}
              projectName={project.name}
              t={tPreview}
            />
          )}
      </main>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowProfileModal(false)}
          />
          <div className="relative w-full max-w-lg bg-[#0f0f12] border border-white/10 rounded-2xl shadow-2xl animate-fade-in overflow-hidden">
            {/* Modal Header */}
            <div className="relative p-6 border-b border-white/[0.06] bg-gradient-to-br from-[#FC682C]/10 to-transparent">
              <button
                onClick={() => setShowProfileModal(false)}
                className="absolute top-4 right-4 p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FC682C] to-[#FF8F5C] flex items-center justify-center shadow-xl shadow-[#FC682C]/30">
                  <span className="text-2xl font-bold text-white">
                    {client.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {client.name}
                  </h2>
                  <p className="text-white/50">
                    {client.company || tProfile("privateCustomer")}
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="flex items-center gap-2 mb-2">
                    <EnvelopeIcon className="w-4 h-4 text-[#FC682C]" />
                    <span className="text-xs text-white/40 uppercase tracking-wider">
                      {tProfile("email")}
                    </span>
                  </div>
                  <p className="text-white font-medium truncate">
                    {client.email}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="flex items-center gap-2 mb-2">
                    <BuildingOfficeIcon className="w-4 h-4 text-[#FC682C]" />
                    <span className="text-xs text-white/40 uppercase tracking-wider">
                      {tProfile("company")}
                    </span>
                  </div>
                  <p className="text-white font-medium">
                    {client.company || "-"}
                  </p>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#FC682C]/5 to-transparent border border-[#FC682C]/20">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-white">
                    {tProfile("currentProject")}
                  </span>
                  <span className={`status-badge status-${project.status}`}>
                    {project.statusLabel}
                  </span>
                </div>
                <p className="text-lg font-bold text-white mb-1">
                  {project.name}
                </p>
                <p className="text-sm text-white/50">
                  {tDash("package")}: {project.package}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <p className="text-2xl font-bold text-[#FC682C]">
                    {project.progress}%
                  </p>
                  <p className="text-xs text-white/40">{tProfile("progress")}</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <p className="text-2xl font-bold text-white">
                    {messages.length}
                  </p>
                  <p className="text-xs text-white/40">{tNav("messages")}</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <p className="text-2xl font-bold text-white">
                    {files.length}
                  </p>
                  <p className="text-xs text-white/40">{tNav("files")}</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/[0.06] bg-white/[0.02]">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="flex-1 portal-btn-secondary text-sm"
                >
                  {tCommon("close")}
                </button>
                <button className="flex-1 portal-btn text-sm flex items-center justify-center gap-2">
                  <Cog6ToothIcon className="w-4 h-4" />
                  {tCommon("edit")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Start Guide */}
      {showQuickStart && activeTab === "overview" && project.progress < 30 && (
        <div className="fixed bottom-6 right-6 z-40 animate-fade-in">
          <div className="w-80 bg-[#0f0f12] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
            {/* Quick Start Header */}
            <div className="p-4 border-b border-white/[0.06] bg-gradient-to-r from-[#FC682C]/20 to-purple-500/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FC682C] to-[#FF8F5C] flex items-center justify-center">
                    <LightBulbIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {tQuickStart("title")}
                    </h3>
                    <p className="text-xs text-white/50">{tQuickStart("subtitle")}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowQuickStart(false)}
                  className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-all"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-3 space-y-2">
              <QuickStartItem
                icon={EyeIcon}
                title={tQuickStart("checkStatus")}
                description={tQuickStart("checkStatusDesc")}
                done={true}
                doneLabel={tQuickStart("done")}
              />
              <QuickStartItem
                icon={ChatBubbleOvalLeftEllipsisIcon}
                title={tQuickStart("sendMessage")}
                description={tQuickStart("sendMessageDesc")}
                onClick={() => setActiveTab("messages")}
                done={messages.some((m) => m.senderType === "client")}
                doneLabel={tQuickStart("done")}
              />
              <QuickStartItem
                icon={DocumentArrowUpIcon}
                title={tQuickStart("uploadFiles")}
                description={tQuickStart("uploadFilesDesc")}
                onClick={() => setActiveTab("files")}
                done={files.length > 0}
                doneLabel={tQuickStart("done")}
              />
              <QuickStartItem
                icon={UserCircleIcon}
                title={tQuickStart("viewProfile")}
                description={tQuickStart("viewProfileDesc")}
                onClick={() => setShowProfileModal(true)}
                doneLabel={tQuickStart("done")}
              />
            </div>

            {/* Progress */}
            <div className="p-3 border-t border-white/[0.06]">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-white/50">{tQuickStart("setup")}</span>
                <span className="text-[#FC682C] font-semibold">
                  {
                    [
                      true,
                      messages.some((m) => m.senderType === "client"),
                      files.length > 0,
                    ].filter(Boolean).length
                  }
                  /3
                </span>
              </div>
              <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#FC682C] to-[#FF8F5C] rounded-full transition-all"
                  style={{
                    width: `${([true, messages.some((m) => m.senderType === "client"), files.length > 0].filter(Boolean).length / 3) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/[0.06] mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <img
                src="/logo-dark.png"
                alt="AgentFlow"
                className="h-8 w-auto"
              />
            </div>
            <p className="text-sm text-white/40">
              {tFooter("questions")}{" "}
              <a
                href={`mailto:kontakt@agentflowm.com`}
                className="text-[#FC682C] hover:underline font-medium"
              >
                kontakt@agentflowm.com
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all hover-lift">
      <div className="flex items-center gap-3 mb-2">
        <Icon className="w-4 h-4 text-[#FC682C]" />
        <p className="text-xs text-white/40 uppercase tracking-wider">
          {label}
        </p>
      </div>
      <p className="text-white font-semibold">{value}</p>
    </div>
  );
}

function QuickStartItem({
  icon: Icon,
  title,
  description,
  onClick,
  done,
  doneLabel,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  onClick?: () => void;
  done?: boolean;
  doneLabel?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
        done
          ? "bg-emerald-500/10 border border-emerald-500/20"
          : "bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.12]"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
          done
            ? "bg-emerald-500/20 text-emerald-400"
            : "bg-white/5 text-white/50"
        }`}
      >
        {done ? (
          <CheckCircleSolid className="w-5 h-5" />
        ) : (
          <Icon className="w-5 h-5" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium ${done ? "text-emerald-400" : "text-white"}`}
        >
          {title}
        </p>
        <p className="text-xs text-white/40 truncate">{description}</p>
      </div>
      {done && (
        <span className="text-xs text-emerald-400 font-medium">{doneLabel}</span>
      )}
    </button>
  );
}

// Approvals Tab Component
function ApprovalsTab({
  approvals,
  clientName,
  onUpdate,
  t,
}: {
  approvals: ProjectData["approvals"];
  clientName: string;
  onUpdate: () => void;
  t: ReturnType<typeof useTranslations>;
}) {
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState<{ [key: number]: string }>(
    {},
  );
  const [showFeedbackFor, setShowFeedbackFor] = useState<number | null>(null);

  const pendingApprovals =
    approvals?.filter((a) => a.status === "pending") || [];
  const changesRequested =
    approvals?.filter((a) => a.status === "changes_requested") || [];
  const completedApprovals =
    approvals?.filter((a) => a.status === "approved") || [];

  const handleApprove = async (approvalId: number) => {
    setProcessingId(approvalId);
    try {
      const res = await fetch("/api/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          approvalId,
          action: "approve",
          feedback: feedbackText[approvalId] || null,
        }),
        credentials: "include",
      });
      if (res.ok) {
        onUpdate();
        setShowFeedbackFor(null);
      }
    } catch (error) {
      console.error("Approval error:", error);
    }
    setProcessingId(null);
  };

  const handleRequestChanges = async (approvalId: number) => {
    if (!feedbackText[approvalId]?.trim()) {
      alert(t("describeChanges"));
      return;
    }
    setProcessingId(approvalId);
    try {
      const res = await fetch("/api/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          approvalId,
          action: "request_changes",
          feedback: feedbackText[approvalId],
        }),
        credentials: "include",
      });
      if (res.ok) {
        onUpdate();
        setShowFeedbackFor(null);
        setFeedbackText({});
      }
    } catch (error) {
      console.error("Request changes error:", error);
    }
    setProcessingId(null);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "design":
        return t("design");
      case "content":
        return t("content");
      case "final":
        return t("final");
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "design":
        return "bg-purple-500/20 text-purple-400";
      case "content":
        return "bg-blue-500/20 text-blue-400";
      case "final":
        return "bg-[#FC682C]/20 text-[#FC682C]";
      default:
        return "bg-white/10 text-white/70";
    }
  };

  if (!approvals || approvals.length === 0) {
    return (
      <div className="portal-card animate-fade-in">
        <h3 className="text-lg font-bold text-white mb-6">{t("title")}</h3>
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircleSolid className="w-10 h-10 text-emerald-400" />
          </div>
          <h4 className="text-xl font-semibold text-white mb-2">
            {t("allDone")}
          </h4>
          <p className="text-white/50 max-w-sm mx-auto">
            {t("noApprovals")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Pending Approvals */}
      {pendingApprovals.length > 0 && (
        <div className="portal-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#FC682C]/20 flex items-center justify-center">
              <ClockIcon className="w-5 h-5 text-[#FC682C]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {t("pending")}
              </h3>
              <p className="text-sm text-white/50">
                {t("waitingCount", { count: pendingApprovals.length })}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {pendingApprovals.map((approval) => (
              <div
                key={approval.id}
                className="p-4 bg-white/[0.02] border border-white/[0.08] rounded-xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(approval.type)}`}
                      >
                        {getTypeLabel(approval.type)}
                      </span>
                      {approval.milestone_title && (
                        <span className="text-xs text-white/40">
                          • {approval.milestone_title}
                        </span>
                      )}
                    </div>
                    <h4 className="text-white font-medium mb-1">
                      {approval.title}
                    </h4>
                    {approval.description && (
                      <p className="text-sm text-white/50">
                        {approval.description}
                      </p>
                    )}
                    <p className="text-xs text-white/30 mt-2">
                      {t("created")}{" "}
                      {new Date(approval.created_at).toLocaleDateString(
                        "de-DE",
                      )}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    {showFeedbackFor === approval.id ? (
                      <div className="space-y-2 min-w-[250px]">
                        <textarea
                          placeholder={t("feedbackPlaceholder")}
                          value={feedbackText[approval.id] || ""}
                          onChange={(e) =>
                            setFeedbackText({
                              ...feedbackText,
                              [approval.id]: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm resize-none h-20"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(approval.id)}
                            disabled={processingId === approval.id}
                            className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            <CheckCircleIcon className="w-4 h-4" />
                            {t("approve")}
                          </button>
                          <button
                            onClick={() => handleRequestChanges(approval.id)}
                            disabled={
                              processingId === approval.id ||
                              !feedbackText[approval.id]?.trim()
                            }
                            className="flex-1 px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg text-sm font-medium disabled:opacity-50"
                          >
                            {t("requestChange")}
                          </button>
                        </div>
                        <button
                          onClick={() => setShowFeedbackFor(null)}
                          className="w-full text-xs text-white/40 hover:text-white"
                        >
                          Abbrechen
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowFeedbackFor(approval.id)}
                        className="px-6 py-2.5 bg-[#FC682C] hover:bg-[#e55a1f] text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        {t("reviewApprove")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Changes Requested */}
      {changesRequested.length > 0 && (
        <div className="portal-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {t("changesRequested")}
              </h3>
              <p className="text-sm text-white/50">
                {t("workingOnChanges")}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {changesRequested.map((approval) => (
              <div
                key={approval.id}
                className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(approval.type)}`}
                  >
                    {getTypeLabel(approval.type)}
                  </span>
                </div>
                <h4 className="text-white font-medium mb-1">
                  {approval.title}
                </h4>
                {approval.feedback && (
                  <div className="mt-2 p-3 bg-white/[0.02] rounded-lg">
                    <p className="text-xs text-white/40 mb-1">{t("yourFeedback")}</p>
                    <p className="text-sm text-white/70">{approval.feedback}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Approvals */}
      {completedApprovals.length > 0 && (
        <div className="portal-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <CheckCircleSolid className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{t("completedTitle")}</h3>
              <p className="text-sm text-white/50">
                {t("approvalsGiven", { count: completedApprovals.length })}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {completedApprovals.map((approval) => (
              <div
                key={approval.id}
                className="flex items-center justify-between p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <CheckCircleSolid className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-sm text-white">{approval.title}</p>
                    <p className="text-xs text-white/40">
                      {t("approvedOn")}{" "}
                      {approval.approved_at
                        ? new Date(approval.approved_at).toLocaleDateString(
                            "de-DE",
                          )
                        : "-"}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(approval.type)}`}
                >
                  {getTypeLabel(approval.type)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Preview Tab Component with Device Selector
function PreviewTab({
  previewUrl,
  projectName,
  t,
}: {
  previewUrl: string;
  projectName: string;
  t: ReturnType<typeof useTranslations>;
}) {
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">(
    "desktop",
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [key, setKey] = useState(0);

  const deviceSizes = {
    desktop: { width: "100%", height: "100%" },
    tablet: { width: "768px", height: "1024px" },
    mobile: { width: "375px", height: "812px" },
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setKey((k) => k + 1);
  };

  return (
    <div
      className={`animate-fade-in ${isFullscreen ? "fixed inset-0 z-50 bg-[#09090b] p-4" : ""}`}
    >
      <div className="portal-card h-full flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-bold text-white">{t("title")}</h3>
            <p className="text-sm text-white/50">{projectName}</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Device Selector */}
            <div className="flex bg-white/[0.05] rounded-lg p-1 border border-white/[0.08]">
              <button
                onClick={() => setDevice("mobile")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  device === "mobile"
                    ? "bg-[#FC682C] text-white"
                    : "text-white/50 hover:text-white"
                }`}
              >
                {t("mobile")}
              </button>
              <button
                onClick={() => setDevice("tablet")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  device === "tablet"
                    ? "bg-[#FC682C] text-white"
                    : "text-white/50 hover:text-white"
                }`}
              >
                {t("tablet")}
              </button>
              <button
                onClick={() => setDevice("desktop")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  device === "desktop"
                    ? "bg-[#FC682C] text-white"
                    : "text-white/50 hover:text-white"
                }`}
              >
                {t("desktop")}
              </button>
            </div>

            {/* Actions */}
            <button
              onClick={handleRefresh}
              className="p-2 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white/50 hover:text-white hover:bg-white/[0.1] transition-all"
              title={t("refresh")}
            >
              <ArrowPathIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white/50 hover:text-white hover:bg-white/[0.1] transition-all"
              title={isFullscreen ? t("exitFullscreen") : t("fullscreen")}
            >
              {isFullscreen ? (
                <XMarkIcon className="w-4 h-4" />
              ) : (
                <EyeIcon className="w-4 h-4" />
              )}
            </button>
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white/50 hover:text-white hover:bg-white/[0.1] transition-all"
              title={t("openNewTab")}
            >
              <ArrowRightStartOnRectangleIcon className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Preview Container */}
        <div className="flex-1 min-h-[500px] bg-white/[0.02] rounded-xl border border-white/[0.08] overflow-hidden flex items-center justify-center p-4">
          <div
            className={`relative bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ${
              device === "desktop" ? "w-full h-full" : ""
            }`}
            style={device !== "desktop" ? deviceSizes[device] : {}}
          >
            {/* Device Frame for mobile/tablet */}
            {device !== "desktop" && (
              <div className="absolute top-0 left-0 right-0 h-6 bg-gray-800 flex items-center justify-center">
                <div className="w-16 h-1 bg-gray-600 rounded-full"></div>
              </div>
            )}

            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-gray-300 border-t-[#FC682C] rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-gray-500 text-sm">Loading...</p>
                </div>
              </div>
            )}

            {/* Iframe */}
            <iframe
              key={key}
              src={previewUrl}
              className={`w-full h-full border-0 ${device !== "desktop" ? "pt-6" : ""}`}
              style={{ minHeight: device === "desktop" ? "500px" : "auto" }}
              onLoad={() => setIsLoading(false)}
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              title="Website Vorschau"
            />
          </div>
        </div>

        {/* URL Bar */}
        <div className="mt-4 flex items-center gap-2 px-3 py-2 bg-white/[0.02] rounded-lg border border-white/[0.06]">
          <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
          <span className="text-xs text-white/40 truncate">{previewUrl}</span>
        </div>
      </div>
    </div>
  );
}
