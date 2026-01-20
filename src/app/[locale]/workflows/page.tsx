"use client";

import { useState, useRef, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Link } from "@/i18n/routing";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

// ═══════════════════════════════════════════════════════════════
//                    BOT DATA (unchanged - technical names)
// ═══════════════════════════════════════════════════════════════

// Bot and category data types
interface Bot {
  id: string;
  name: string;
  shortDesc: string;
  goodFor: string;
  price: string;
  originalPrice?: string;
  type: string;
  popular?: boolean;
  integrations: string[];
  features: string[];
}

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  highlight?: boolean;
  bots: Bot[];
}

// Categories data - keeping bot data as is (technical product names)
const categories: Category[] = [
  {
    id: "ai-power",
    name: "AI & Intelligence",
    icon: "🧠",
    color: "#10a37f",
    description: "OpenAI-powered workflows for intelligent automation",
    highlight: true,
    bots: [
      {
        id: "gpt-support-bot",
        name: "GPT Support Bot",
        shortDesc: "AI-powered customer support with GPT-4",
        goodFor: "Support, Customer Service",
        price: "199",
        originalPrice: "239",
        type: "Monat",
        popular: true,
        integrations: ["OpenAI", "Telegram", "Email", "Slack"],
        features: ["Context Memory", "Multi-Language", "Escalation", "Analytics"],
      },
      {
        id: "content-generator",
        name: "Content Generator",
        shortDesc: "AI-generated content for marketing",
        goodFor: "Marketing, Content Teams",
        price: "149",
        originalPrice: "179",
        type: "Monat",
        integrations: ["OpenAI", "Google Docs", "WordPress", "Social Media"],
        features: ["Blog Posts", "Social Content", "SEO", "Brand Voice"],
      },
      {
        id: "lead-qualifier",
        name: "AI Lead Qualifier",
        shortDesc: "AI-powered lead scoring and qualification",
        goodFor: "Sales, Lead Gen",
        price: "179",
        originalPrice: "215",
        type: "Monat",
        integrations: ["OpenAI", "HubSpot", "Pipedrive", "Email"],
        features: ["Smart Scoring", "Auto-Routing", "Enrichment", "Insights"],
      },
      {
        id: "document-processor",
        name: "Document Processor",
        shortDesc: "AI document analysis and extraction",
        goodFor: "Legal, Finance, HR",
        price: "229",
        originalPrice: "275",
        type: "Monat",
        integrations: ["OpenAI", "Google Drive", "Dropbox", "Email"],
        features: ["OCR", "Data Extraction", "Summarization", "Classification"],
      },
      {
        id: "meeting-assistant",
        name: "Meeting Assistant",
        shortDesc: "AI meeting notes and action items",
        goodFor: "Teams, Managers",
        price: "159",
        originalPrice: "191",
        type: "Monat",
        integrations: ["OpenAI", "Google Calendar", "Slack", "Notion"],
        features: ["Transcription", "Summaries", "Action Items", "Follow-ups"],
      },
    ],
  },
  {
    id: "telegram-chat",
    name: "Telegram & Messenger",
    icon: "📱",
    color: "#0088CC",
    description: "Chat automation for Telegram",
    bots: [
      {
        id: "telegram-support",
        name: "Telegram Support Bot",
        shortDesc: "Automated support via Telegram",
        goodFor: "Support, Communities",
        price: "129",
        originalPrice: "155",
        type: "Monat",
        popular: true,
        integrations: ["Telegram", "OpenAI", "Google Sheets", "Email"],
        features: ["Auto-Reply", "FAQ", "Ticket System", "Analytics"],
      },
      {
        id: "telegram-notification",
        name: "Telegram Notifier",
        shortDesc: "Automated notifications via Telegram",
        goodFor: "Teams, Alerts",
        price: "99",
        originalPrice: "119",
        type: "Monat",
        integrations: ["Telegram", "Webhook", "Email", "Slack"],
        features: ["Custom Alerts", "Formatting", "Scheduling", "Groups"],
      },
    ],
  },
  {
    id: "sales-crm",
    name: "Sales & CRM",
    icon: "💼",
    color: "#FF7A59",
    description: "HubSpot, Pipedrive, Stripe automation",
    bots: [
      {
        id: "hubspot-automator",
        name: "HubSpot Automator",
        shortDesc: "Automated HubSpot workflows",
        goodFor: "Sales, Marketing",
        price: "179",
        originalPrice: "215",
        type: "Monat",
        popular: true,
        integrations: ["HubSpot", "Email", "Slack", "Google Sheets"],
        features: ["Lead Scoring", "Auto-Tasks", "Sequences", "Reporting"],
      },
      {
        id: "stripe-connector",
        name: "Stripe Connector",
        shortDesc: "Payment automation with Stripe",
        goodFor: "E-Commerce, SaaS",
        price: "149",
        originalPrice: "179",
        type: "Monat",
        integrations: ["Stripe", "Email", "Slack", "CRM"],
        features: ["Invoice Sync", "Subscription Alerts", "Refund Handling", "Reports"],
      },
    ],
  },
  {
    id: "google-suite",
    name: "Google Workspace",
    icon: "📊",
    color: "#4285F4",
    description: "Gmail, Sheets, Calendar automation",
    bots: [
      {
        id: "gmail-automator",
        name: "Gmail Automator",
        shortDesc: "Automated email workflows",
        goodFor: "Everyone",
        price: "99",
        originalPrice: "119",
        type: "Monat",
        popular: true,
        integrations: ["Gmail", "Google Sheets", "Slack", "CRM"],
        features: ["Auto-Sort", "Templates", "Follow-ups", "Labels"],
      },
      {
        id: "sheets-processor",
        name: "Sheets Processor",
        shortDesc: "Automated spreadsheet processing",
        goodFor: "Data Teams",
        price: "129",
        originalPrice: "155",
        type: "Monat",
        integrations: ["Google Sheets", "Email", "Slack", "APIs"],
        features: ["Data Validation", "Auto-Reports", "Notifications", "Sync"],
      },
    ],
  },
];

// Stats from workflow analysis
const stats = {
  totalWorkflows: "2.061",
  totalIntegrations: "187+",
  totalCategories: "22",
  activeBots: "107+",
};

// ═══════════════════════════════════════════════════════════════
//                    CHECKOUT MODAL COMPONENT
// ═══════════════════════════════════════════════════════════════

interface CheckoutModalProps {
  bot: Bot;
  purchaseType: "rent" | "buy";
  onClose: () => void;
}

function CheckoutModal({ bot, purchaseType, onClose }: CheckoutModalProps) {
  const t = useTranslations("pages.workflows.checkout");
  const router = useRouter();
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerCompany: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const basePrice = parseInt(bot.price.replace(/[^\d]/g, "")) || 0;
  const finalPrice = purchaseType === "buy" ? basePrice * 10 : basePrice;
  const priceLabel =
    purchaseType === "rent"
      ? `${finalPrice} € ${t("perMonth")}`
      : `${finalPrice} € ${t("oneTime")}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/bot-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          botId: bot.id,
          botName: bot.name,
          botPrice: bot.price,
          purchaseType,
          integrations: bot.integrations,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("error"));
      }

      router.push(data.redirectUrl);
    } catch (err: any) {
      setError(err.message || t("error"));
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-lg bg-[#0a0a0f] rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 border-b border-white/10 bg-gradient-to-r from-[#FC682C]/10 to-transparent">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex items-center gap-3">
            <div
              className={`px-3 py-1 rounded-lg text-xs font-bold ${
                purchaseType === "rent"
                  ? "bg-[#FFB347]/20 text-[#FFB347]"
                  : "bg-[#06b6d4]/20 text-[#06b6d4]"
              }`}
            >
              {purchaseType === "rent" ? t("rent") : t("buy")}
            </div>
            <div className="text-xl font-bold text-white">{priceLabel}</div>
          </div>

          <h2 className="text-lg font-bold text-white mt-3">{bot.name}</h2>
          <p className="text-sm text-white/60 mt-1">{bot.shortDesc}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs text-white/60 mb-1">{t("form.name")}</label>
            <input
              type="text"
              required
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              placeholder={t("form.namePlaceholder")}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#FC682C]/50"
            />
          </div>

          <div>
            <label className="block text-xs text-white/60 mb-1">{t("form.email")}</label>
            <input
              type="email"
              required
              value={formData.customerEmail}
              onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
              placeholder={t("form.emailPlaceholder")}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#FC682C]/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/60 mb-1">{t("form.phone")}</label>
              <input
                type="tel"
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                placeholder={t("form.phonePlaceholder")}
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#FC682C]/50"
              />
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-1">{t("form.company")}</label>
              <input
                type="text"
                value={formData.customerCompany}
                onChange={(e) => setFormData({ ...formData, customerCompany: e.target.value })}
                placeholder={t("form.companyPlaceholder")}
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#FC682C]/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-white/60 mb-1">{t("form.message")}</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder={t("form.messagePlaceholder")}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#FC682C]/50 resize-none"
            />
          </div>

          {/* Integrations */}
          <div className="pt-2">
            <span className="text-xs text-white/40">{t("form.integrations")}</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {bot.integrations.map((integration, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-white/60 border border-white/5"
                >
                  {integration}
                </span>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${
              purchaseType === "rent"
                ? "bg-gradient-to-r from-[#FFB347] to-[#e5a03f] hover:opacity-90"
                : "bg-gradient-to-r from-[#FC682C] to-[#e55a1f] hover:opacity-90"
            } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isSubmitting
              ? t("form.processing")
              : purchaseType === "rent"
              ? t("form.submit.rent")
              : t("form.submit.buy")}
          </button>

          <p className="text-xs text-white/40 text-center">
            {t("form.note")}
          </p>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    BOT PRODUCT CARD
// ═══════════════════════════════════════════════════════════════

function BotProductCard({
  bot,
  categoryColor,
  onCheckout,
}: {
  bot: Bot;
  categoryColor: string;
  onCheckout: (bot: Bot, type: "rent" | "buy") => void;
}) {
  const t = useTranslations("pages.workflows.botCard");
  const basePrice = parseInt(bot.price.replace(/[^\d]/g, "")) || 0;
  const buyPrice = basePrice * 10;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`group relative rounded-xl border transition-all duration-300 overflow-hidden h-full flex flex-col ${
        bot.popular
          ? "bg-gradient-to-br from-[#FC682C]/10 to-[#FFB347]/5 border-[#FC682C]/30"
          : "bg-white/[0.02] border-white/[0.06]"
      }`}
    >
      {bot.popular && (
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#FC682C] text-white text-[10px] font-semibold z-10">
          {t("popular")}
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        <div className="mb-3">
          <h4 className="text-sm font-bold text-white group-hover:text-[#FC682C] transition-colors pr-16">
            {bot.name}
          </h4>
          <p className="text-xs text-white/70 mt-1 leading-relaxed">
            {bot.shortDesc}
          </p>
        </div>

        <div className="mb-3 p-2 rounded-lg bg-white/[0.03] border border-white/5">
          <span className="text-[9px] uppercase tracking-wider text-[#FC682C] font-semibold">
            {t("goodFor")}
          </span>
          <p className="text-[11px] text-white/60 mt-0.5">{bot.goodFor}</p>
        </div>

        <div className="mb-2">
          <span className="text-[9px] uppercase tracking-wider text-white/40 font-semibold">
            {t("connects")}
          </span>
          <div className="flex flex-wrap gap-1 mt-1">
            {bot.integrations.slice(0, 3).map((integration, i) => (
              <span
                key={i}
                className="px-1.5 py-0.5 rounded text-[9px] bg-white/5 text-white/60 border border-white/5"
              >
                {integration}
              </span>
            ))}
            {bot.integrations.length > 3 && (
              <span className="px-1.5 py-0.5 rounded text-[9px] bg-white/5 text-white/40">
                +{bot.integrations.length - 3}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-3 flex-1">
          {bot.features.slice(0, 4).map((f, i) => (
            <span
              key={i}
              className="px-1.5 py-0.5 rounded text-[9px] bg-white/5 text-white/50"
            >
              {f}
            </span>
          ))}
        </div>

        <div className="pt-2 border-t border-white/5 mt-auto">
          {bot.price === "Auf Anfrage" || bot.price === "On Request" ? (
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">{t("onRequest")}</span>
              <Link
                href="/termin"
                className="px-3 py-1.5 rounded-lg bg-[#FC682C]/10 border border-[#FC682C]/30 text-[#FC682C] text-[10px] font-semibold hover:bg-[#FC682C] hover:text-white transition-all"
              >
                {t("inquire")}
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-2">
                  <div>
                    <span className="text-white/40">{t("rentPrice")}</span>
                    <span className="ml-1 text-white font-semibold">
                      {bot.price} €{t("perMonth")}
                    </span>
                  </div>
                  <div className="text-white/20">|</div>
                  <div>
                    <span className="text-white/40">{t("buyPrice")}</span>
                    <span className="ml-1 text-white font-semibold">
                      {buyPrice.toLocaleString("de-DE")} €
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onCheckout(bot, "rent")}
                  className="flex-1 py-2 rounded-lg bg-[#FFB347]/10 border border-[#FFB347]/30 text-[#FFB347] text-[10px] font-semibold hover:bg-[#FFB347] hover:text-black transition-all"
                >
                  {t("rent")}
                </button>
                <button
                  onClick={() => onCheckout(bot, "buy")}
                  className="flex-1 py-2 rounded-lg bg-[#FC682C]/10 border border-[#FC682C]/30 text-[#FC682C] text-[10px] font-semibold hover:bg-[#FC682C] hover:text-white transition-all"
                >
                  {t("buy")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    CATEGORY SECTION
// ═══════════════════════════════════════════════════════════════

function CategorySection({
  category,
  index,
  onCheckout,
}: {
  category: Category;
  index: number;
  onCheckout: (bot: Bot, type: "rent" | "buy") => void;
}) {
  const t = useTranslations("pages.workflows");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ backgroundColor: `${category.color}20` }}
          >
            {category.icon}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                {category.name}
              </h3>
              {category.highlight && (
                <span className="px-2 py-0.5 rounded bg-gradient-to-r from-[#8B5CF6]/20 to-[#EC4899]/20 border border-[#8B5CF6]/30 text-[10px] text-[#A78BFA] font-semibold uppercase">
                  {t("categoryLabels.hot")}
                </span>
              )}
              <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] text-white/50">
                {category.bots.length} {t("categoryLabels.bots")}
              </span>
            </div>
            <p className="text-sm text-white/60 mt-0.5">
              {category.description}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {category.bots.map((bot) => (
          <BotProductCard
            key={bot.id}
            bot={bot}
            categoryColor={category.color}
            onCheckout={onCheckout}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    HERO VISUALIZATION
// ═══════════════════════════════════════════════════════════════

function HeroVisualization() {
  const integrations = [
    { icon: "🧠", label: "OpenAI", color: "#10a37f" },
    { icon: "📱", label: "Telegram", color: "#0088CC" },
    { icon: "💬", label: "Slack", color: "#E01E5A" },
    { icon: "📊", label: "Sheets", color: "#4285F4" },
    { icon: "🔗", label: "HubSpot", color: "#FF7A59" },
    { icon: "📧", label: "Gmail", color: "#EA4335" },
    { icon: "🛒", label: "Shopify", color: "#96BF48" },
    { icon: "📅", label: "Calendar", color: "#4285F4" },
    { icon: "💼", label: "LinkedIn", color: "#0A66C2" },
    { icon: "🎫", label: "Zendesk", color: "#F59E0B" },
  ];

  return (
    <div className="relative w-full h-[300px] sm:h-[380px] flex items-center justify-center">
      <motion.div
        className="absolute w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(252,104,44,0.15) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      <motion.div
        className="relative z-10 w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-[#FC682C] to-[#FF8C5A] flex items-center justify-center shadow-2xl shadow-[#FC682C]/40"
        animate={{ scale: [1, 1.05, 1], y: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-4xl sm:text-5xl">🤖</span>
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-[#FC682C]"
          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
      </motion.div>

      {integrations.map((integration, i) => {
        const angle = (i * 360) / integrations.length - 90;
        const radius = 120;
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;

        return (
          <motion.div
            key={i}
            className="absolute w-11 h-11 sm:w-13 sm:h-13 rounded-xl flex flex-col items-center justify-center backdrop-blur-sm border border-white/10"
            style={{
              left: `calc(50% + ${x}px - 22px)`,
              top: `calc(50% + ${y}px - 22px)`,
              backgroundColor: `${integration.color}15`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -4, 0],
            }}
            transition={{
              opacity: { duration: 0.5, delay: 0.5 + i * 0.08 },
              scale: { duration: 0.5, delay: 0.5 + i * 0.08 },
              y: { duration: 3, repeat: Infinity, delay: i * 0.15 },
            }}
          >
            <span className="text-base sm:text-lg">{integration.icon}</span>
            <span className="text-[7px] sm:text-[8px] text-white/50 mt-0.5">
              {integration.label}
            </span>
          </motion.div>
        );
      })}

      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-[#FC682C]/60"
          style={{
            left: `${15 + Math.random() * 70}%`,
            top: `${15 + Math.random() * 70}%`,
          }}
          animate={{
            y: [0, -25, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    INTEGRATION LOGOS
// ═══════════════════════════════════════════════════════════════

function IntegrationLogos() {
  const logos = [
    { name: "OpenAI", icon: "🧠" },
    { name: "Telegram", icon: "📱" },
    { name: "Slack", icon: "💬" },
    { name: "HubSpot", icon: "🟠" },
    { name: "Shopify", icon: "🛒" },
    { name: "Stripe", icon: "💳" },
    { name: "Zendesk", icon: "🎫" },
    { name: "Google", icon: "📊" },
    { name: "GitHub", icon: "⚙️" },
    { name: "WhatsApp", icon: "📞" },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
      {logos.map((logo, i) => (
        <motion.div
          key={i}
          className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 + i * 0.04 }}
        >
          <span className="text-sm">{logo.icon}</span>
          <span className="text-xs text-white/60">{logo.name}</span>
        </motion.div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    MAIN PAGE
// ═══════════════════════════════════════════════════════════════

export default function WorkflowsPage() {
  const t = useTranslations("pages.workflows");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [checkoutModal, setCheckoutModal] = useState<{
    bot: Bot;
    purchaseType: "rent" | "buy";
  } | null>(null);

  const handleCheckout = useCallback(
    (bot: Bot, type: "rent" | "buy") => {
      setCheckoutModal({ bot, purchaseType: type });
    },
    [],
  );

  const closeCheckout = useCallback(() => {
    setCheckoutModal(null);
  }, []);

  const filteredCategories = categories.filter((category) => {
    if (activeFilter && category.id !== activeFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesCategory =
        category.name.toLowerCase().includes(query) ||
        category.description.toLowerCase().includes(query);
      const matchesBots = category.bots.some(
        (bot) =>
          bot.name.toLowerCase().includes(query) ||
          bot.shortDesc.toLowerCase().includes(query) ||
          bot.integrations.some((i) => i.toLowerCase().includes(query)),
      );
      return matchesCategory || matchesBots;
    }
    return true;
  });

  const totalBots = categories.reduce((acc, c) => acc + c.bots.length, 0);

  return (
    <main className="bg-[#030308] min-h-screen">
      {/* HERO SECTION */}
      <section className="relative pt-20 sm:pt-24 pb-12 sm:pb-16 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#FC682C]/10 rounded-full blur-[180px]" />
          <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-[#8B5CF6]/10 rounded-full blur-[150px]" />
          <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-[#0088CC]/5 rounded-full blur-[120px]" />
        </div>

        <div className="container relative z-10 px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FC682C]/20 to-[#8B5CF6]/20 border border-[#FC682C]/30 mb-5"
              >
                <span className="w-2 h-2 rounded-full bg-[#FC682C] animate-pulse" />
                <span className="text-xs sm:text-sm text-white/80 font-medium">
                  {t("hero.badge", { totalBots })}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 leading-tight"
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FC682C] to-[#FF8C5A]">
                  {t("hero.headline1", { totalBots })}
                </span>
                <br />
                <span className="text-white">{t("hero.headline2")}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-sm sm:text-base text-white/70 max-w-xl mx-auto lg:mx-0 mb-5"
              >
                {t("hero.subheadline")}
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-4 gap-2 mb-5 max-w-md mx-auto lg:mx-0"
              >
                {[
                  { value: `${totalBots}+`, label: t("hero.stats.bots") },
                  { value: stats.totalCategories, label: t("hero.stats.categories") },
                  { value: stats.totalIntegrations, label: t("hero.stats.integrations") },
                  { value: stats.totalWorkflows, label: t("hero.stats.workflows") },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="text-center lg:text-left p-2 rounded-lg bg-white/[0.03] border border-white/5"
                  >
                    <div className="text-sm sm:text-lg font-bold text-white">
                      {stat.value}
                    </div>
                    <div className="text-[7px] sm:text-[9px] text-white/40 uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row justify-center lg:justify-start gap-2 mb-5"
              >
                <Link
                  href="#bots"
                  className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#FC682C] to-[#e55a1f] text-white text-xs font-semibold hover:opacity-90 transition-all shadow-lg shadow-[#FC682C]/25 text-center flex items-center justify-center gap-2"
                >
                  {t("hero.cta.discover", { totalBots })}
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </Link>
                <Link
                  href="/termin"
                  className="px-4 py-2.5 rounded-lg border border-white/20 text-white text-xs font-semibold hover:bg-white/5 transition-all text-center"
                >
                  {t("hero.cta.consultation")}
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap justify-center lg:justify-start gap-x-4 gap-y-2 text-xs text-white/50"
              >
                {[
                  t("hero.trust.gdpr"),
                  t("hero.trust.servers"),
                  t("hero.trust.instant"),
                  t("hero.trust.support"),
                ].map((item) => (
                  <span key={item} className="flex items-center gap-1.5">
                    <svg
                      className="w-4 h-4 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {item}
                  </span>
                ))}
              </motion.div>
            </div>

            <motion.div
              className="flex-1 w-full max-w-md lg:max-w-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <HeroVisualization />
            </motion.div>
          </div>

          <motion.div
            className="mt-10 pt-8 border-t border-white/5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-center text-xs text-white/40 mb-4 uppercase tracking-wider">
              {t("hero.integrationNote")}
            </p>
            <IntegrationLogos />
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-12 sm:py-16 border-b border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-[#FC682C]/5 via-[#8B5CF6]/5 to-[#10B981]/5 blur-[80px] rounded-full" />
        </div>

        <div className="container px-4 sm:px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="text-center mb-8 sm:mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4"
              >
                <span className="text-xs">⚡</span>
                <span className="text-xs text-white/70">
                  {t("howItWorks.badge")}
                </span>
              </motion.div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3">
                {t("howItWorks.headline")}
              </h2>
              <p className="text-sm sm:text-base text-white/60 max-w-xl mx-auto">
                {t("howItWorks.subheadline")}
              </p>
            </motion.div>

            <div className="relative">
              <div className="hidden md:block absolute top-[60px] left-[16.67%] right-[16.67%] h-0.5">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, #FC682C, #8B5CF6, #10B981)",
                  }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-4">
                {[
                  {
                    num: "1",
                    title: t("howItWorks.steps.1.title"),
                    desc: t("howItWorks.steps.1.desc"),
                    icon: "🎯",
                    color: "#FC682C",
                    details: t.raw("howItWorks.steps.1.details") as string[],
                  },
                  {
                    num: "2",
                    title: t("howItWorks.steps.2.title"),
                    desc: t("howItWorks.steps.2.desc"),
                    icon: "🔗",
                    color: "#8B5CF6",
                    details: t.raw("howItWorks.steps.2.details") as string[],
                  },
                  {
                    num: "3",
                    title: t("howItWorks.steps.3.title"),
                    desc: t("howItWorks.steps.3.desc"),
                    icon: "✅",
                    color: "#10B981",
                    details: t.raw("howItWorks.steps.3.details") as string[],
                  },
                ].map((step, i) => (
                  <motion.div
                    key={i}
                    className="relative"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="relative p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] h-full">
                      <div
                        className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs z-10"
                        style={{
                          background: `linear-gradient(135deg, ${step.color}, ${step.color}dd)`,
                        }}
                      >
                        {step.num}
                      </div>

                      <div
                        className="w-12 h-12 rounded-xl mx-auto mt-3 mb-3 flex items-center justify-center text-2xl"
                        style={{ backgroundColor: `${step.color}15` }}
                      >
                        {step.icon}
                      </div>

                      <h3 className="text-sm font-bold text-white text-center mb-2">
                        {step.title}
                      </h3>

                      <p className="text-[11px] text-white/60 text-center mb-3 leading-relaxed">
                        {step.desc}
                      </p>

                      <div className="flex flex-wrap justify-center gap-1">
                        {step.details.map((detail, j) => (
                          <span
                            key={j}
                            className="px-2 py-0.5 rounded-full text-[9px] font-medium border"
                            style={{
                              borderColor: `${step.color}40`,
                              color: step.color,
                              backgroundColor: `${step.color}10`,
                            }}
                          >
                            {detail}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              className="mt-16 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <Link
                href="#bots"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FC682C] to-[#e55a1f] text-white font-semibold hover:opacity-90 transition-all shadow-lg shadow-[#FC682C]/25 group"
              >
                <span>{t("howItWorks.cta")}</span>
                <motion.svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  animate={{ y: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </motion.svg>
              </Link>
              <p className="mt-4 text-sm text-white/40">
                {t("howItWorks.ctaNote")}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SEARCH & FILTER BAR */}
      <section
        id="bots"
        className="sticky top-0 z-40 bg-[#030308]/95 backdrop-blur-lg border-b border-white/5 py-4"
      >
        <div className="container px-4 sm:px-6">
          <div className="mb-3">
            <div className="relative max-w-md">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder={t("search.placeholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-[#FC682C]/50 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            <button
              onClick={() => setActiveFilter(null)}
              className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeFilter === null
                  ? "bg-[#FC682C] text-white"
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {t("search.all")} ({totalBots})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                  activeFilter === cat.id
                    ? "bg-[#FC682C] text-white"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>{cat.icon}</span>
                <span className="hidden sm:inline">{cat.name}</span>
                <span className="text-[10px] opacity-60">
                  ({cat.bots.length})
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES & BOTS */}
      <section className="py-12 sm:py-16">
        <div className="container px-4 sm:px-6">
          <div className="space-y-20">
            <AnimatePresence mode="wait">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category, index) => (
                  <CategorySection
                    key={category.id}
                    category={category}
                    index={index}
                    onCheckout={handleCheckout}
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
                >
                  <span className="text-4xl mb-4 block">🔍</span>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {t("search.noResults.title")}
                  </h3>
                  <p className="text-white/60">
                    {t("search.noResults.desc")}
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setActiveFilter(null);
                    }}
                    className="mt-4 px-4 py-2 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20 transition-colors"
                  >
                    {t("search.noResults.reset")}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 sm:py-20 border-t border-white/5 bg-gradient-to-t from-[#FC682C]/5 to-transparent">
        <div className="container px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-3xl mb-3 block">🚀</span>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3">
                {t("finalCta.headline")}
              </h2>
              <p className="text-sm sm:text-base text-white/60 mb-6">
                {t("finalCta.subheadline")}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Link
                  href="/termin"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-gradient-to-r from-[#FC682C] to-[#e55a1f] text-white text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-[#FC682C]/25"
                >
                  {t("finalCta.cta")}
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
                <Link
                  href="#bots"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-white/20 text-white text-sm font-semibold hover:bg-white/5 transition-all"
                >
                  {t("finalCta.ctaSecondary", { totalBots })}
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CHECKOUT MODAL */}
      <AnimatePresence>
        {checkoutModal && (
          <CheckoutModal
            bot={checkoutModal.bot}
            purchaseType={checkoutModal.purchaseType}
            onClose={closeCheckout}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
