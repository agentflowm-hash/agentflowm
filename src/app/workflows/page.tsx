"use client";

import { useState, useRef, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ═══════════════════════════════════════════════════════════════
//                    CHECKOUT MODAL COMPONENT
// ═══════════════════════════════════════════════════════════════

interface CheckoutModalProps {
  bot: {
    id: string;
    name: string;
    shortDesc: string;
    price: string;
    originalPrice?: string;
    type: string;
    integrations: string[];
  };
  purchaseType: "rent" | "buy";
  onClose: () => void;
}

function CheckoutModal({ bot, purchaseType, onClose }: CheckoutModalProps) {
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

  // Preis berechnen
  const basePrice = parseInt(bot.price.replace(/[^\d]/g, "")) || 0;
  const finalPrice = purchaseType === "buy" ? basePrice * 10 : basePrice;
  const priceLabel =
    purchaseType === "rent"
      ? `${finalPrice} € / Monat`
      : `${finalPrice} € einmalig`;

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
        throw new Error(data.error || "Bestellung fehlgeschlagen");
      }

      // Zur Erfolgsseite weiterleiten
      router.push(data.redirectUrl);
    } catch (err: any) {
      setError(err.message || "Ein Fehler ist aufgetreten");
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
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                purchaseType === "rent"
                  ? "bg-[#FFB347]/20 text-[#FFB347]"
                  : "bg-[#06b6d4]/20 text-[#06b6d4]"
              }`}
            >
              {purchaseType === "rent" ? "Mieten" : "Kaufen"}
            </span>
          </div>

          <h3 className="text-xl font-bold text-white">{bot.name}</h3>
          <p className="text-sm text-white/60 mt-1">{bot.shortDesc}</p>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">
              {finalPrice} €
            </span>
            <span className="text-sm text-white/50">
              {purchaseType === "rent" ? "/ Monat" : "einmalig"}
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/60 mb-1.5">
                Name *
              </label>
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={(e) =>
                  setFormData({ ...formData, customerName: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#FC682C]/50 transition-colors"
                placeholder="Max Mustermann"
              />
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-1.5">
                E-Mail *
              </label>
              <input
                type="email"
                required
                value={formData.customerEmail}
                onChange={(e) =>
                  setFormData({ ...formData, customerEmail: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#FC682C]/50 transition-colors"
                placeholder="max@firma.de"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/60 mb-1.5">
                Telefon
              </label>
              <input
                type="tel"
                value={formData.customerPhone}
                onChange={(e) =>
                  setFormData({ ...formData, customerPhone: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#FC682C]/50 transition-colors"
                placeholder="+49 123 456789"
              />
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-1.5">
                Firma
              </label>
              <input
                type="text"
                value={formData.customerCompany}
                onChange={(e) =>
                  setFormData({ ...formData, customerCompany: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#FC682C]/50 transition-colors"
                placeholder="Musterfirma GmbH"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-white/60 mb-1.5">
              Nachricht (optional)
            </label>
            <textarea
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#FC682C]/50 transition-colors resize-none"
              placeholder="Spezielle Anforderungen oder Fragen..."
            />
          </div>

          {/* Integrations Info */}
          <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
            <span className="text-[10px] uppercase tracking-wider text-white/40 font-semibold">
              Integrationen:
            </span>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {bot.integrations.map((integration, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded text-[10px] bg-[#FC682C]/10 text-[#FC682C] border border-[#FC682C]/20"
                >
                  {integration}
                </span>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FC682C] to-[#e55a1f] text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Wird verarbeitet...
              </>
            ) : (
              <>
                {purchaseType === "rent" ? "Jetzt Mieten" : "Jetzt Kaufen"} -{" "}
                {priceLabel}
              </>
            )}
          </button>

          <p className="text-[10px] text-white/40 text-center">
            Nach der Bestellung kontaktieren wir Sie innerhalb von 24h zur
            Einrichtung.
          </p>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
//              BOT SHOP - ÜBER 80 PREMIUM BOTS
//        Basierend auf 2.061 echten n8n-Workflows analysiert
// ═══════════════════════════════════════════════════════════════

const categories = [
  // ═══════════════════════════════════════════════════════════
  // KATEGORIE 1: KI & INTELLIGENCE
  // ═══════════════════════════════════════════════════════════
  {
    id: "ai-power",
    name: "KI & Intelligence",
    icon: "🧠",
    color: "#8B5CF6",
    description: "OpenAI-gestützte Workflows für intelligente Automation",
    highlight: true,
    bots: [
      {
        id: "ai-resume-screener",
        name: "AI Resume Screener",
        shortDesc:
          "Analysiert Bewerbungen automatisch mit GPT-4 und bewertet Kandidaten.",
        goodFor: "HR-Teams, Recruiting-Agenturen, schnelle Vorauswahl.",
        price: "290",
        originalPrice: "349",
        type: "Monat",
        popular: true,
        integrations: ["Gmail", "OpenAI GPT-4", "Google Sheets"],
        features: [
          "PDF-Extraktion",
          "Skill-Matching",
          "Score-System",
          "Auto-Ranking",
        ],
      },
      {
        id: "ai-content-factory",
        name: "Content Factory Bot",
        shortDesc:
          "Generiert Social Media Posts automatisch mit KI aus Ihren Themen.",
        goodFor: "Marketing-Teams, Content Creator, Agenturen.",
        price: "249",
        originalPrice: "299",
        type: "Monat",
        popular: true,
        integrations: ["Google Sheets", "OpenAI", "Twitter", "LinkedIn"],
        features: [
          "Multi-Platform",
          "Ton-Anpassung",
          "Hashtag-Generator",
          "Scheduled Publishing",
        ],
      },
      {
        id: "ai-newsletter-generator",
        name: "KI-Newsletter-Generator",
        shortDesc:
          "Konvertiert RSS-Feeds und News in fertige LinkedIn-Posts mit GPT-4.",
        goodFor: "Content Creator, Agenturen, Thought Leaders.",
        price: "390",
        originalPrice: "468",
        type: "Monat",
        integrations: ["Gmail", "RSS Feed", "LinkedIn", "OpenAI GPT-4"],
        features: [
          "Auto-Curation",
          "Stil-Anpassung",
          "Multi-Format",
          "Scheduling",
        ],
      },
      {
        id: "ai-whatsapp-support",
        name: "WhatsApp KI-Assistent",
        shortDesc:
          "KI-gestützter Support-Bot, der Ihre Website crawlt und Fragen beantwortet.",
        goodFor: "E-Commerce, SaaS, Dienstleister.",
        price: "490",
        originalPrice: "588",
        type: "Monat",
        popular: true,
        integrations: ["WhatsApp", "OpenAI GPT-4", "PostgreSQL", "Web-Crawler"],
        features: [
          "24/7 Support",
          "Kontext-Memory",
          "Website-Knowledge",
          "Eskalation",
        ],
      },
      {
        id: "ai-email-responder",
        name: "Smart Email Responder",
        shortDesc:
          "Beantwortet E-Mails intelligent mit GPT und lernt aus Ihrem Stil.",
        goodFor: "Support-Teams, Freelancer, Vielschreiber.",
        price: "190",
        originalPrice: "229",
        type: "Monat",
        integrations: ["Gmail", "OpenAI", "Google Drive"],
        features: [
          "Kontext-Verständnis",
          "Stil-Learning",
          "Auto-Draft",
          "Sentiment-Analyse",
        ],
      },
      {
        id: "ai-code-reviewer",
        name: "AI Code Review Bot",
        shortDesc:
          "Reviewed GitHub-Commits automatisch und generiert Dokumentation.",
        goodFor: "Dev-Teams, Open-Source-Projekte, Tech-Leads.",
        price: "349",
        originalPrice: "419",
        type: "Monat",
        integrations: ["GitHub", "GitLab", "OpenAI", "Slack"],
        features: [
          "Auto-Review",
          "Doc-Generation",
          "Best-Practices",
          "Security-Check",
        ],
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════
  // KATEGORIE 2: TELEGRAM & CHAT
  // ═══════════════════════════════════════════════════════════
  {
    id: "telegram-chat",
    name: "Telegram & Messenger",
    icon: "📱",
    color: "#0088CC",
    description: "119 analysierte Telegram-Workflows für Chat-Automation",
    highlight: true,
    bots: [
      {
        id: "telegram-ai-assistant",
        name: "Telegram AI Assistant",
        shortDesc:
          "Intelligenter Telegram-Bot mit GPT für automatische Antworten.",
        goodFor: "Support, Community-Management, Kundenservice.",
        price: "190",
        originalPrice: "229",
        type: "Monat",
        popular: true,
        integrations: ["Telegram", "OpenAI", "Webhook", "PostgreSQL"],
        features: [
          "24/7 Verfügbar",
          "Kontext-Memory",
          "Multi-Language",
          "Eskalation",
        ],
      },
      {
        id: "telegram-rss-aggregator",
        name: "RSS News Aggregator",
        shortDesc:
          "Sammelt News aus RSS-Feeds und postet automatisch in Telegram-Kanäle.",
        goodFor: "News-Channels, Communities, Content-Curatoren.",
        price: "99",
        originalPrice: "119",
        type: "Monat",
        integrations: ["Telegram", "RSS Feed Read", "Filter"],
        features: [
          "Multi-Feed",
          "Keyword-Filter",
          "Auto-Posting",
          "Deduplizierung",
        ],
      },
      {
        id: "telegram-notification-hub",
        name: "Notification Hub Bot",
        shortDesc:
          "Zentraler Bot für alle Ihre System-Benachrichtigungen in Telegram.",
        goodFor: "DevOps, IT-Teams, Manager.",
        price: "149",
        originalPrice: "179",
        type: "Monat",
        integrations: ["Telegram", "Webhook", "Multiple Sources"],
        features: [
          "Multi-Source",
          "Priority-Levels",
          "Formatierung",
          "Routing",
        ],
      },
      {
        id: "telegram-form-collector",
        name: "Form Collector Bot",
        shortDesc:
          "Sammelt Daten über Telegram-Formulare und speichert sie strukturiert.",
        goodFor: "Umfragen, Lead-Generierung, Feedback.",
        price: "129",
        originalPrice: "155",
        type: "Monat",
        integrations: ["Telegram", "Google Sheets", "Airtable"],
        features: ["Interaktive Forms", "Validierung", "Auto-Save", "Export"],
      },
      {
        id: "telegram-group-manager",
        name: "Gruppen-Manager Bot",
        shortDesc:
          "Moderiert Telegram-Gruppen automatisch mit Regeln und Willkommensnachrichten.",
        goodFor: "Community-Manager, Support-Gruppen.",
        price: "149",
        originalPrice: "179",
        type: "Monat",
        integrations: ["Telegram", "Webhook", "Google Sheets"],
        features: [
          "Auto-Moderation",
          "Welcome-Flow",
          "Spam-Filter",
          "Member-Tracking",
        ],
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════
  // KATEGORIE 3: GOOGLE WORKSPACE
  // ═══════════════════════════════════════════════════════════
  {
    id: "google-suite",
    name: "Google Workspace",
    icon: "📊",
    color: "#4285F4",
    description: "Gmail, Sheets, Calendar, Drive – alles automatisch verbunden",
    bots: [
      {
        id: "gmail-drive-sync",
        name: "Attachment Archiver",
        shortDesc:
          "Speichert E-Mail-Anhänge automatisch sortiert in Google Drive.",
        goodFor: "Dokumenten-Management, Buchhaltung, Archivierung.",
        price: "99",
        originalPrice: "119",
        type: "Monat",
        integrations: ["Gmail", "Google Drive"],
        features: [
          "Auto-Ordner",
          "Datei-Umbenennung",
          "Duplikat-Check",
          "Filter-Regeln",
        ],
      },
      {
        id: "sheets-master",
        name: "Sheets Sync Master",
        shortDesc:
          "Synchronisiert Daten zwischen mehreren Google Sheets automatisch.",
        goodFor: "Teams, Reports, Dashboards, Multi-Sheet-Projekte.",
        price: "149",
        originalPrice: "179",
        type: "Monat",
        popular: true,
        integrations: ["Google Sheets", "Cron Scheduler"],
        features: [
          "Bi-direktional",
          "Konflikt-Lösung",
          "Echtzeit-Sync",
          "Backup",
        ],
      },
      {
        id: "calendar-coordinator",
        name: "Calendar Coordinator",
        shortDesc:
          "Koordiniert mehrere Kalender und findet automatisch freie Slots.",
        goodFor: "Teams, Meeting-Planung, Ressourcen-Management.",
        price: "129",
        originalPrice: "155",
        type: "Monat",
        integrations: ["Google Calendar", "Gmail", "Slack"],
        features: [
          "Multi-Kalender",
          "Zeitzonen",
          "Auto-Vorschläge",
          "Konflikt-Erkennung",
        ],
      },
      {
        id: "docs-generator",
        name: "Docs Generator Bot",
        shortDesc:
          "Erstellt Dokumente automatisch aus Templates und Datenquellen.",
        goodFor: "Verträge, Angebote, Reports, Serienbriefe.",
        price: "179",
        originalPrice: "215",
        type: "Monat",
        integrations: ["Google Docs", "Google Sheets", "Gmail"],
        features: [
          "Template-Engine",
          "Platzhalter",
          "PDF-Export",
          "Auto-Versand",
        ],
      },
      {
        id: "form-processor",
        name: "Form Processor Bot",
        shortDesc:
          "Verarbeitet Google Forms automatisch und löst Aktionen aus.",
        goodFor: "Anmeldungen, Feedback, Lead-Erfassung.",
        price: "119",
        originalPrice: "143",
        type: "Monat",
        integrations: ["Google Forms", "Google Sheets", "Gmail", "Slack"],
        features: ["Auto-Response", "Routing", "Validierung", "CRM-Sync"],
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════
  // KATEGORIE 4: TEAM-KOMMUNIKATION
  // ═══════════════════════════════════════════════════════════
  {
    id: "communication",
    name: "Team-Kommunikation",
    icon: "💬",
    color: "#E01E5A",
    description: "Slack, Mattermost, Discord – Nachrichten automatisiert",
    bots: [
      {
        id: "slack-commander",
        name: "Slack Commander",
        shortDesc:
          "Automatisiert Slack-Nachrichten, Reminders und Channel-Updates.",
        goodFor: "Teams, Stand-ups, Projekt-Updates, Alerts.",
        price: "149",
        originalPrice: "179",
        type: "Monat",
        popular: true,
        integrations: ["Slack", "Cron Scheduler", "Google Sheets"],
        features: [
          "Scheduled Posts",
          "Channel-Router",
          "Mention-Logic",
          "Thread-Replies",
        ],
      },
      {
        id: "mattermost-standup",
        name: "Mattermost Standup Bot",
        shortDesc:
          "Automatisiert tägliche Standups mit Fragen und Zusammenfassungen.",
        goodFor: "Agile Teams, Remote-Work, Scrum Master.",
        price: "149",
        originalPrice: "179",
        type: "Monat",
        integrations: ["Mattermost", "Google Sheets", "Cron"],
        features: [
          "Daily Questions",
          "Auto-Collect",
          "Summary-Reports",
          "Reminders",
        ],
      },
      {
        id: "discord-moderator",
        name: "Discord Moderator",
        shortDesc:
          "Automatisiert Moderation, Willkommensnachrichten und Rollen.",
        goodFor: "Communities, Gaming-Server, Support-Channels.",
        price: "129",
        originalPrice: "155",
        type: "Monat",
        integrations: ["Discord", "Webhook", "Airtable"],
        features: [
          "Auto-Moderation",
          "Rollen-Zuweisung",
          "Welcome-Flow",
          "Spam-Filter",
        ],
      },
      {
        id: "cross-platform-notifier",
        name: "Multi-Channel Notifier",
        shortDesc:
          "Sendet wichtige Updates gleichzeitig an Slack, Telegram und E-Mail.",
        goodFor: "Kritische Alerts, Team-Broadcasts, Incident-Response.",
        price: "179",
        originalPrice: "215",
        type: "Monat",
        integrations: ["Slack", "Telegram", "Gmail", "Discord"],
        features: [
          "Parallel-Versand",
          "Prioritäts-Level",
          "Bestätigungs-Tracking",
          "Fallback",
        ],
      },
      {
        id: "team-standup-automation",
        name: "Standup Automator",
        shortDesc:
          "Sammelt Standups asynchron und erstellt automatische Berichte.",
        goodFor: "Verteilte Teams, Async-Work, Manager.",
        price: "189",
        originalPrice: "227",
        type: "Monat",
        integrations: ["Slack", "Mattermost", "Google Sheets", "Notion"],
        features: [
          "Async-Collection",
          "Timeline-View",
          "Blocker-Alerts",
          "Weekly-Summary",
        ],
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════
  // KATEGORIE 5: SALES & CRM
  // ═══════════════════════════════════════════════════════════
  {
    id: "sales-crm",
    name: "Sales & CRM",
    icon: "🎯",
    color: "#FF7A59",
    description: "HubSpot, Pipedrive, Stripe – Leads automatisch qualifizieren",
    bots: [
      {
        id: "hubspot-enricher",
        name: "Lead Enrichment Bot",
        shortDesc: "Reichert HubSpot-Kontakte automatisch mit Firmendaten an.",
        goodFor: "Sales-Teams, Account-Manager, Outbound.",
        price: "249",
        originalPrice: "299",
        type: "Monat",
        popular: true,
        integrations: ["HubSpot", "Hunter", "Clearbit", "LinkedIn"],
        features: [
          "Auto-Research",
          "Firmen-Daten",
          "Job-Titel",
          "Social-Profile",
        ],
      },
      {
        id: "stripe-hubspot-sync",
        name: "Payment-to-Deal Bot",
        shortDesc:
          "Synchronisiert Stripe-Zahlungen mit HubSpot Deals automatisch.",
        goodFor: "SaaS, E-Commerce, Abo-Modelle.",
        price: "190",
        originalPrice: "229",
        type: "Monat",
        integrations: ["Stripe", "HubSpot", "Slack"],
        features: [
          "Deal-Update",
          "Revenue-Tracking",
          "Churn-Alert",
          "Team-Notify",
        ],
      },
      {
        id: "lead-scoring-bot",
        name: "Smart Lead Scorer",
        shortDesc:
          "Bewertet und priorisiert Leads automatisch nach Ihren Kriterien.",
        goodFor: "Marketing-Teams, SDRs, Lead-Qualifizierung.",
        price: "219",
        originalPrice: "263",
        type: "Monat",
        integrations: ["HubSpot", "Mailchimp", "Webhook"],
        features: [
          "Scoring-Regeln",
          "Hot-Lead-Alert",
          "Segment-Zuweisung",
          "A/B-Tracking",
        ],
      },
      {
        id: "deal-progression-bot",
        name: "Deal Stage Automator",
        shortDesc:
          "Bewegt Deals automatisch durch Phasen basierend auf Aktivitäten.",
        goodFor: "Sales Manager, CRM Power-User.",
        price: "249",
        originalPrice: "299",
        type: "Monat",
        integrations: ["HubSpot", "Pipedrive", "Slack", "Google Calendar"],
        features: [
          "Auto-Transition",
          "Activity-Trigger",
          "Reminder",
          "Win/Loss-Tracking",
        ],
      },
      {
        id: "follow-up-sequencer",
        name: "Follow-Up Sequencer",
        shortDesc:
          "Erstellt automatische Follow-Up-Serien nach Kontaktversuchen.",
        goodFor: "Sales Reps, Agenturen, Freelancer.",
        price: "199",
        originalPrice: "239",
        type: "Monat",
        integrations: ["Gmail", "Mautic", "Calendly", "Slack"],
        features: [
          "Multi-Step",
          "Time-Delay",
          "Personalisierung",
          "Response-Tracking",
        ],
      },
      {
        id: "email-list-cleaner",
        name: "Email List Cleaner",
        shortDesc:
          "Validiert Email-Listen automatisch und entfernt ungültige Adressen.",
        goodFor: "Email Marketer, Newsletter, Liste Manager.",
        price: "179",
        originalPrice: "215",
        type: "Monat",
        integrations: ["Google Sheets", "Mailcheck", "Gmail", "Webhook"],
        features: [
          "Bulk-Validation",
          "Bounce-Removal",
          "Duplikat-Check",
          "Export",
        ],
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════
  // KATEGORIE 6: MARKETING & SOCIAL
  // ═══════════════════════════════════════════════════════════
  {
    id: "social-marketing",
    name: "Marketing & Social",
    icon: "📢",
    color: "#0A66C2",
    description:
      "LinkedIn, Twitter, Newsletter – Content automatisch verteilen",
    bots: [
      {
        id: "linkedin-publisher",
        name: "LinkedIn Publisher",
        shortDesc:
          "Plant und veröffentlicht LinkedIn-Posts automatisch mit Analytics.",
        goodFor: "Personal Branding, B2B-Marketing, Thought Leadership.",
        price: "190",
        originalPrice: "229",
        type: "Monat",
        popular: true,
        integrations: ["LinkedIn", "Google Sheets", "Telegram"],
        features: [
          "Scheduled Posts",
          "Hashtag-Optimizer",
          "Engagement-Tracking",
          "Best-Time",
        ],
      },
      {
        id: "twitter-autopilot",
        name: "Twitter Autopilot",
        shortDesc: "Automatisiert Tweets, Threads und Engagement-Tracking.",
        goodFor: "Creator, Brands, Community-Building.",
        price: "149",
        originalPrice: "179",
        type: "Monat",
        integrations: ["Twitter", "OpenAI", "Google Sheets"],
        features: [
          "Thread-Builder",
          "Auto-Reply",
          "Follower-Analytics",
          "Trend-Alerts",
        ],
      },
      {
        id: "social-cross-poster",
        name: "Cross-Poster Bot",
        shortDesc:
          "Postet gleichzeitig auf mehreren Plattformen mit Anpassungen.",
        goodFor: "Social Media Manager, Multi-Channel-Marketing.",
        price: "189",
        originalPrice: "227",
        type: "Monat",
        integrations: ["Twitter", "LinkedIn", "Facebook", "Telegram"],
        features: [
          "Multi-Platform",
          "Format-Anpassung",
          "Scheduling",
          "Analytics",
        ],
      },
      {
        id: "content-calendar-bot",
        name: "Content Calendar Bot",
        shortDesc:
          "Erstellt automatisch Content-Kalender basierend auf Events und Keywords.",
        goodFor: "Content Manager, Marketing Teams.",
        price: "119",
        originalPrice: "143",
        type: "Monat",
        integrations: ["Google Calendar", "Notion", "Airtable", "Slack"],
        features: [
          "Auto-Planning",
          "Event-Integration",
          "Team-Sync",
          "Reminders",
        ],
      },
      {
        id: "brand-monitor",
        name: "Brand Monitor Bot",
        shortDesc:
          "Überwacht Erwähnungen Ihrer Marke und benachrichtigt Sie sofort.",
        goodFor: "PR-Teams, Brand-Manager, Reputation-Management.",
        price: "249",
        originalPrice: "299",
        type: "Monat",
        integrations: ["Twitter", "RSS", "Slack", "Telegram"],
        features: [
          "Keyword-Tracking",
          "Sentiment-Analyse",
          "Competitor-Watch",
          "Instant-Alert",
        ],
      },
      {
        id: "influencer-outreach",
        name: "Influencer Outreach Bot",
        shortDesc:
          "Automatisiert Influencer-Suche, Outreach und Performance-Tracking.",
        goodFor: "Marketing Agencies, Brands, PR.",
        price: "229",
        originalPrice: "275",
        type: "Monat",
        integrations: ["LinkedIn", "Email", "Airtable", "Slack"],
        features: [
          "Auto-Search",
          "Template-Outreach",
          "Response-Tracking",
          "ROI-Metrics",
        ],
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════
  // KATEGORIE 7: E-COMMERCE
  // ═══════════════════════════════════════════════════════════
  {
    id: "ecommerce",
    name: "E-Commerce",
    icon: "🛒",
    color: "#96BF48",
    description:
      "Shopify, WooCommerce, Payments – Orders automatisch verarbeiten",
    bots: [
      {
        id: "shopify-crm-sync",
        name: "Shopify-CRM Sync",
        shortDesc:
          "Synchronisiert Shopify-Bestellungen automatisch mit Ihrem CRM.",
        goodFor: "Online-Shops, Customer Success, Retention.",
        price: "190",
        originalPrice: "229",
        type: "Monat",
        popular: true,
        integrations: ["Shopify", "HubSpot", "Slack"],
        features: [
          "Order-to-Deal",
          "Kunden-Profile",
          "Purchase-History",
          "VIP-Tagging",
        ],
      },
      {
        id: "abandoned-cart-recovery",
        name: "Abandoned Cart Bot",
        shortDesc:
          "Rettet aufgegebene Warenkörbe mit automatischen Follow-Ups.",
        goodFor: "E-Commerce, Conversion-Optimierung.",
        price: "229",
        originalPrice: "275",
        type: "Monat",
        popular: true,
        integrations: ["Shopify", "WooCommerce", "Email", "Twilio SMS"],
        features: [
          "Multi-Touch",
          "Personalisierung",
          "Discount-Codes",
          "A/B-Tests",
        ],
      },
      {
        id: "order-fulfillment",
        name: "Fulfillment Automator",
        shortDesc: "Automatisiert Versand-Prozesse und Tracking-Updates.",
        goodFor: "Logistik, Lager, Kundenservice.",
        price: "219",
        originalPrice: "263",
        type: "Monat",
        integrations: ["Shopify", "Onfleet", "Gmail"],
        features: [
          "Auto-Dispatch",
          "Tracking-Emails",
          "Status-Updates",
          "Route-Optimization",
        ],
      },
      {
        id: "order-status-notifier",
        name: "Order Status Bot",
        shortDesc:
          "Sendet automatische Notifications zu Bestellstatus per WhatsApp/Telegram.",
        goodFor: "E-Commerce, Fulfillment, Kundenbindung.",
        price: "129",
        originalPrice: "155",
        type: "Monat",
        integrations: ["Shopify", "Email", "Telegram", "WhatsApp"],
        features: [
          "Multi-Channel",
          "Real-Time",
          "Tracking-Link",
          "Personalisierung",
        ],
      },
      {
        id: "inventory-alert",
        name: "Inventory Alert Bot",
        shortDesc: "Überwacht Lagerbestände und warnt bei niedrigen Beständen.",
        goodFor: "Einkauf, Lager, Produktmanagement.",
        price: "119",
        originalPrice: "143",
        type: "Monat",
        integrations: ["Shopify", "WooCommerce", "Slack", "Gmail"],
        features: [
          "Low-Stock-Alert",
          "Reorder-Point",
          "Vendor-Notify",
          "Forecast",
        ],
      },
      {
        id: "product-recommendation",
        name: "Recommendation Engine",
        shortDesc:
          "Empfiehlt Produkte automatisch basierend auf Bestellhistorie.",
        goodFor: "E-Commerce, Upselling, Customer Lifetime Value.",
        price: "249",
        originalPrice: "299",
        type: "Monat",
        integrations: ["Shopify", "Email", "OpenAI"],
        features: [
          "AI-Matching",
          "Personalisierung",
          "A/B-Tests",
          "Revenue-Tracking",
        ],
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════
  // KATEGORIE 8: TERMINE & BOOKING
  // ═══════════════════════════════════════════════════════════
  {
    id: "scheduling",
    name: "Termine & Booking",
    icon: "📅",
    color: "#00A2FF",
    description: "Calendly, Google Calendar – Termine automatisch koordinieren",
    bots: [
      {
        id: "calendly-notion",
        name: "Booking Tracker",
        shortDesc: "Erfasst alle Calendly-Buchungen automatisch in Notion.",
        goodFor: "Berater, Coaches, Meeting-Management.",
        price: "129",
        originalPrice: "155",
        type: "Monat",
        popular: true,
        integrations: ["Calendly", "Notion", "Slack"],
        features: [
          "Auto-Eintrag",
          "Kontakt-Sync",
          "Status-Tracking",
          "Follow-up-Reminder",
        ],
      },
      {
        id: "meeting-prep",
        name: "Meeting Prep Bot",
        shortDesc:
          "Bereitet Meetings vor mit Agenda, Kontakt-Info und Notizen.",
        goodFor: "Sales-Calls, Client-Meetings, Interviews.",
        price: "179",
        originalPrice: "215",
        type: "Monat",
        integrations: ["Google Calendar", "HubSpot", "Slack", "Gmail"],
        features: [
          "Auto-Research",
          "Agenda-Builder",
          "Pre-Meeting-Brief",
          "Notes-Template",
        ],
      },
      {
        id: "follow-up-automator",
        name: "Meeting Follow-Up Bot",
        shortDesc:
          "Sendet automatische Follow-ups nach Terminen mit Action Items.",
        goodFor: "Sales, Beratung, Kundenbeziehungen.",
        price: "149",
        originalPrice: "179",
        type: "Monat",
        integrations: ["Calendly", "Mautic", "Gmail"],
        features: [
          "Time-Delay",
          "Personalisierung",
          "Template-Bibliothek",
          "Response-Tracking",
        ],
      },
      {
        id: "interview-scheduler",
        name: "Interview Scheduler",
        shortDesc:
          "Plant Interviews automatisch und verwaltet Kandidaten-Kommunikation.",
        goodFor: "Recruiting, HR-Abteilungen.",
        price: "199",
        originalPrice: "239",
        type: "Monat",
        integrations: ["Calendly", "Google Calendar", "Email", "Slack"],
        features: [
          "Multi-Interviewer",
          "Timezone-Support",
          "Auto-Reminders",
          "Feedback-Collect",
        ],
      },
      {
        id: "webinar-manager",
        name: "Webinar Manager Bot",
        shortDesc: "Verwaltet Webinar-Anmeldungen, Reminders und Follow-ups.",
        goodFor: "Event Manager, SaaS-Unternehmen, Marketing.",
        price: "189",
        originalPrice: "227",
        type: "Monat",
        integrations: ["Eventbrite", "Zoom", "Email", "Slack"],
        features: [
          "Registration",
          "Multi-Reminder",
          "Recording-Share",
          "Attendance-Tracking",
        ],
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════
  // KATEGORIE 9: SUPPORT & HELPDESK
  // ═══════════════════════════════════════════════════════════
  {
    id: "support",
    name: "Support & Helpdesk",
    icon: "🎧",
    color: "#F59E0B",
    description: "Zendesk, Intercom, E-Mail – Support automatisieren",
    bots: [
      {
        id: "zendesk-slack",
        name: "Ticket Alert Bot",
        shortDesc: "Benachrichtigt Ihr Team sofort bei neuen Support-Tickets.",
        goodFor: "Support-Teams, SLA-Management, Incident-Response.",
        price: "149",
        originalPrice: "179",
        type: "Monat",
        popular: true,
        integrations: ["Zendesk", "Slack", "PagerDuty"],
        features: [
          "Instant-Alert",
          "Priority-Routing",
          "SLA-Timer",
          "Team-Assignment",
        ],
      },
      {
        id: "email-ticket-creator",
        name: "Email-to-Ticket Bot",
        shortDesc:
          "Wandelt Support-E-Mails automatisch in strukturierte Tickets um.",
        goodFor: "E-Mail-Support, Helpdesk, IT-Support.",
        price: "129",
        originalPrice: "155",
        type: "Monat",
        integrations: ["Email IMAP", "Zendesk", "Jira"],
        features: [
          "Auto-Kategorisierung",
          "Spam-Filter",
          "Priority-Detection",
          "Auto-Response",
        ],
      },
      {
        id: "ticket-routing-bot",
        name: "Ticket Routing Bot",
        shortDesc:
          "Routet Tickets automatisch basierend auf Skills und Auslastung.",
        goodFor: "Support-Teams, Helpdesk.",
        price: "219",
        originalPrice: "263",
        type: "Monat",
        integrations: ["Zendesk", "Slack", "Email", "Notion"],
        features: [
          "Skill-Based",
          "Load-Balancing",
          "Escalation",
          "SLA-Tracking",
        ],
      },
      {
        id: "knowledge-base-bot",
        name: "Knowledge Base Bot",
        shortDesc:
          "Beantwortet häufige Fragen automatisch aus Ihrer Wissensdatenbank.",
        goodFor: "Self-Service, FAQs, Support-Entlastung.",
        price: "249",
        originalPrice: "299",
        type: "Monat",
        integrations: ["OpenAI", "Notion", "Intercom"],
        features: [
          "AI-Matching",
          "Auto-Suggest",
          "Feedback-Loop",
          "Gap-Analysis",
        ],
      },
      {
        id: "nps-collector",
        name: "NPS Collector Bot",
        shortDesc:
          "Sammelt NPS-Feedback automatisch nach Tickets und erstellt Reports.",
        goodFor: "Support Manager, Quality Assurance.",
        price: "189",
        originalPrice: "227",
        type: "Monat",
        integrations: ["Typeform", "Zendesk", "Slack", "Google Sheets"],
        features: [
          "Auto-Send",
          "Sentiment-Analyse",
          "Trend-Reports",
          "Alert-Rules",
        ],
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════
  // KATEGORIE 10: HR & RECRUITING
  // ═══════════════════════════════════════════════════════════
  {
    id: "hr-recruiting",
    name: "HR & Recruiting",
    icon: "👥",
    color: "#EC4899",
    description: "Onboarding, Recruiting, Performance – HR automatisieren",
    bots: [
      {
        id: "onboarding-automation",
        name: "Onboarding Automator",
        shortDesc:
          "Automatisiert den kompletten Onboarding-Prozess mit Checklisten.",
        goodFor: "HR Manager, Unternehmen mit vielen Einstellungen.",
        price: "229",
        originalPrice: "275",
        type: "Monat",
        popular: true,
        integrations: ["Google Workspace", "Slack", "Notion", "Email"],
        features: [
          "Task-Checklisten",
          "Auto-Accounts",
          "Welcome-Flow",
          "Progress-Tracking",
        ],
      },
      {
        id: "leave-request-bot",
        name: "Leave Request Bot",
        shortDesc:
          "Verwaltet Urlaubsanträge automatisch mit Genehmigungsworkflow.",
        goodFor: "HR, Manager, Teams.",
        price: "189",
        originalPrice: "227",
        type: "Monat",
        integrations: ["Slack", "Email", "Google Calendar", "Google Sheets"],
        features: [
          "Approval-Flow",
          "Kalender-Block",
          "Balance-Check",
          "Team-Notify",
        ],
      },
      {
        id: "performance-review-scheduler",
        name: "Review Scheduler Bot",
        shortDesc: "Plant und verwaltet Performance Reviews automatisch.",
        goodFor: "Manager, HR, große Teams.",
        price: "129",
        originalPrice: "155",
        type: "Monat",
        integrations: ["Google Calendar", "Slack", "Email", "Notion"],
        features: ["Auto-Schedule", "Reminder", "Form-Send", "Tracking"],
      },
      {
        id: "job-description-generator",
        name: "Job Description AI",
        shortDesc: "Erstellt Stellenbeschreibungen automatisch mit KI.",
        goodFor: "Recruiting, HR, schnelle Stellenausschreibungen.",
        price: "179",
        originalPrice: "215",
        type: "Monat",
        integrations: ["OpenAI", "Google Docs", "Email", "Slack"],
        features: [
          "Template-Based",
          "SEO-Optimiert",
          "Multi-Format",
          "Brand-Voice",
        ],
      },
      {
        id: "candidate-pipeline",
        name: "Candidate Pipeline Bot",
        shortDesc:
          "Verwaltet Kandidaten-Pipeline mit automatischen Status-Updates.",
        goodFor: "Recruiting-Teams, HR Manager.",
        price: "199",
        originalPrice: "239",
        type: "Monat",
        integrations: ["Airtable", "Email", "Calendly", "Slack"],
        features: [
          "Stage-Tracking",
          "Auto-Emails",
          "Interview-Sync",
          "Analytics",
        ],
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════
  // KATEGORIE 11: PROJEKT-MANAGEMENT
  // ═══════════════════════════════════════════════════════════
  {
    id: "project-management",
    name: "Projekt-Management",
    icon: "📋",
    color: "#6366F1",
    description: "Jira, Asana, Trello, ClickUp – Projekte automatisieren",
    bots: [
      {
        id: "jira-automator",
        name: "Jira Flow Bot",
        shortDesc:
          "Automatisiert Jira-Workflows, Übergänge und Benachrichtigungen.",
        goodFor: "Dev-Teams, Scrum-Masters, Project-Manager.",
        price: "190",
        originalPrice: "229",
        type: "Monat",
        popular: true,
        integrations: ["Jira", "Slack", "Confluence"],
        features: [
          "Auto-Transition",
          "Sprint-Reports",
          "Blocker-Alerts",
          "Time-Tracking",
        ],
      },
      {
        id: "trello-syncer",
        name: "Trello Sync Bot",
        shortDesc: "Synchronisiert Trello-Boards mit anderen Tools und Teams.",
        goodFor: "Cross-Team-Projekte, Client-Boards, Reporting.",
        price: "129",
        originalPrice: "155",
        type: "Monat",
        integrations: ["Trello", "Google Sheets", "Slack"],
        features: [
          "Card-Sync",
          "Board-Mirror",
          "Due-Date-Alerts",
          "Progress-Reports",
        ],
      },
      {
        id: "project-status-bot",
        name: "Status Update Bot",
        shortDesc: "Sammelt Status-Updates automatisch und erstellt Berichte.",
        goodFor: "Project Manager, Team Lead.",
        price: "179",
        originalPrice: "215",
        type: "Monat",
        integrations: ["Slack", "Asana", "Trello", "Email"],
        features: [
          "Daily-Collect",
          "Auto-Summary",
          "Stakeholder-Reports",
          "Blocker-Alert",
        ],
      },
      {
        id: "deadline-escalation",
        name: "Deadline Escalation Bot",
        shortDesc:
          "Erinnert an Deadlines und eskaliert automatisch bei Verzögerung.",
        goodFor: "Project Manager, Teams mit vielen Deadlines.",
        price: "119",
        originalPrice: "143",
        type: "Monat",
        integrations: ["Google Calendar", "Slack", "Notion", "Email"],
        features: [
          "Multi-Reminder",
          "Escalation-Rules",
          "Manager-Alert",
          "Status-Check",
        ],
      },
      {
        id: "workload-balancer",
        name: "Workload Balancer",
        shortDesc:
          "Verteilt Aufgaben automatisch basierend auf Team-Auslastung.",
        goodFor: "Project Manager, Resource Planning.",
        price: "219",
        originalPrice: "263",
        type: "Monat",
        integrations: ["Asana", "Trello", "Slack", "Google Sheets"],
        features: [
          "Capacity-Check",
          "Auto-Assign",
          "Load-Balance",
          "Utilization-Report",
        ],
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════
  // KATEGORIE 12: DEVOPS & CODE
  // ═══════════════════════════════════════════════════════════
  {
    id: "dev-ops",
    name: "DevOps & Code",
    icon: "⚙️",
    color: "#1F2937",
    description: "GitHub, GitLab, CI/CD – Entwicklung automatisieren",
    bots: [
      {
        id: "github-notifier",
        name: "GitHub Alert Bot",
        shortDesc: "Benachrichtigt über PRs, Issues und Deployments in Slack.",
        goodFor: "Dev-Teams, Code-Reviews, Release-Management.",
        price: "149",
        originalPrice: "179",
        type: "Monat",
        popular: true,
        integrations: ["GitHub", "Slack", "Telegram"],
        features: [
          "PR-Alerts",
          "Review-Requests",
          "CI/CD-Status",
          "Release-Notes",
        ],
      },
      {
        id: "pr-stale-reminder",
        name: "Stale PR Reminder",
        shortDesc: "Erinnert an offene PRs die zu lange warten.",
        goodFor: "Engineering-Manager, Lead-Devs, Code-Qualität.",
        price: "129",
        originalPrice: "155",
        type: "Monat",
        integrations: ["GitHub", "GitLab", "Slack"],
        features: [
          "Age-Tracking",
          "Auto-Remind",
          "Stats",
          "Bottleneck-Detection",
        ],
      },
      {
        id: "incident-responder",
        name: "Incident Response Bot",
        shortDesc: "Koordiniert Incident-Response automatisch bei Ausfällen.",
        goodFor: "On-Call-Teams, SRE, 24/7-Operations.",
        price: "290",
        originalPrice: "349",
        type: "Monat",
        integrations: ["PagerDuty", "Slack", "Jira", "StatusPage"],
        features: [
          "Auto-Escalation",
          "War-Room",
          "Status-Updates",
          "Post-Mortem",
        ],
      },
      {
        id: "deploy-notifier",
        name: "Deploy Notifier",
        shortDesc: "Benachrichtigt Teams über Deployments mit Changelog.",
        goodFor: "Dev-Teams, QA, Product-Manager.",
        price: "99",
        originalPrice: "119",
        type: "Monat",
        integrations: ["GitHub", "GitLab", "Slack", "Email"],
        features: [
          "Auto-Changelog",
          "Team-Notify",
          "Rollback-Alert",
          "Environment-Tag",
        ],
      },
      {
        id: "dependency-checker",
        name: "Dependency Checker",
        shortDesc: "Überwacht Dependencies und warnt bei Security-Issues.",
        goodFor: "Security-Teams, Dev-Leads.",
        price: "179",
        originalPrice: "215",
        type: "Monat",
        integrations: ["GitHub", "Slack", "Email"],
        features: [
          "Vulnerability-Scan",
          "Update-Alerts",
          "Priority-Ranking",
          "Auto-PR",
        ],
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════
  // KATEGORIE 13: DATEN & SYNC
  // ═══════════════════════════════════════════════════════════
  {
    id: "data-sync",
    name: "Daten & Integration",
    icon: "🔄",
    color: "#10B981",
    description: "Datenbanken, APIs, Webhooks – alles synchron halten",
    bots: [
      {
        id: "webhook-hub",
        name: "Webhook Hub Bot",
        shortDesc: "Zentraler Hub für alle Ihre Webhook-Integrationen.",
        goodFor: "Entwickler, System-Architekten, No-Code-Teams.",
        price: "249",
        originalPrice: "299",
        type: "Monat",
        popular: true,
        integrations: ["Webhook", "Multiple Systems", "Slack"],
        features: ["Multi-Source", "Transform", "Routing", "Error-Handling"],
      },
      {
        id: "postgres-sync",
        name: "Database Sync Bot",
        shortDesc: "Synchronisiert Postgres-Datenbanken mit anderen Systemen.",
        goodFor: "Entwickler, Data-Teams, System-Integration.",
        price: "249",
        originalPrice: "299",
        type: "Monat",
        integrations: ["Postgres", "Google Sheets", "Webhook"],
        features: [
          "Bi-direktional",
          "Schema-Mapping",
          "Conflict-Resolution",
          "Audit-Log",
        ],
      },
      {
        id: "api-bridge",
        name: "Universal API Bridge",
        shortDesc: "Verbindet beliebige APIs miteinander ohne Code.",
        goodFor: "Entwickler, No-Code-Teams, System-Architekten.",
        price: "290",
        originalPrice: "349",
        type: "Monat",
        integrations: ["HTTP API", "Webhook", "GraphQL"],
        features: [
          "Auth-Handler",
          "Rate-Limiting",
          "Error-Retry",
          "Transform-Layer",
        ],
      },
      {
        id: "file-processor",
        name: "File Processor Bot",
        shortDesc: "Verarbeitet Dateien automatisch (PDFs, Excel, CSVs).",
        goodFor: "Datenimport, Dokumenten-Verarbeitung, Batch-Jobs.",
        price: "1.690",
        originalPrice: "2.029",
        type: "einmalig",
        integrations: ["Google Drive", "AWS Textract", "Google Sheets"],
        features: ["Multi-Format", "OCR", "Data-Extraction", "Auto-Transform"],
      },
      {
        id: "data-quality-bot",
        name: "Data Quality Bot",
        shortDesc: "Prüft Datenqualität und meldet Anomalien automatisch.",
        goodFor: "Data-Teams, Compliance, Qualitätssicherung.",
        price: "219",
        originalPrice: "263",
        type: "Monat",
        integrations: ["Google Sheets", "Slack", "Compare Datasets"],
        features: [
          "Regel-Engine",
          "Anomalie-Detection",
          "Trend-Analyse",
          "Quality-Score",
        ],
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════
  // KATEGORIE 14: FINANCE & ACCOUNTING
  // ═══════════════════════════════════════════════════════════
  {
    id: "finance",
    name: "Finance & Accounting",
    icon: "💰",
    color: "#059669",
    description: "Rechnungen, Expenses, Reports – Finanzen automatisieren",
    bots: [
      {
        id: "invoice-automation",
        name: "Invoice Automator",
        shortDesc: "Automatisiert Rechnungserstellung, Versand und Tracking.",
        goodFor: "Freelancer, Agenturen, KMU.",
        price: "249",
        originalPrice: "299",
        type: "Monat",
        popular: true,
        integrations: ["Stripe", "Invoice Ninja", "Gmail", "Slack"],
        features: [
          "Auto-Create",
          "Reminder",
          "Payment-Tracking",
          "Aging-Reports",
        ],
      },
      {
        id: "expense-report-bot",
        name: "Expense Report Bot",
        shortDesc: "Automatisiert Spesenabrechnung mit Kategorisierung.",
        goodFor: "Finance, Employees, Reisende.",
        price: "199",
        originalPrice: "239",
        type: "Monat",
        integrations: ["Google Sheets", "Email", "Slack", "Receipt-OCR"],
        features: [
          "Auto-Kategorisierung",
          "Receipt-Scan",
          "Approval-Flow",
          "Export",
        ],
      },
      {
        id: "payment-reconciliation",
        name: "Payment Reconciliation",
        shortDesc: "Gleicht Rechnungen und Zahlungen automatisch ab.",
        goodFor: "Accounting, Finance.",
        price: "249",
        originalPrice: "299",
        type: "Monat",
        integrations: ["Google Sheets", "Bank-APIs", "Stripe", "Email"],
        features: [
          "Auto-Match",
          "Exception-Handling",
          "Reports",
          "Audit-Trail",
        ],
      },
      {
        id: "monthly-report-bot",
        name: "Monthly Finance Bot",
        shortDesc: "Erstellt automatisch monatliche Finanzberichte.",
        goodFor: "Finance Manager, Geschäftsführer.",
        price: "219",
        originalPrice: "263",
        type: "Monat",
        integrations: ["Google Sheets", "Email", "Slack", "Accounting-Tools"],
        features: [
          "Auto-Aggregate",
          "Chart-Generation",
          "Trend-Analysis",
          "Distribution",
        ],
      },
      {
        id: "timesheet-bot",
        name: "Timesheet Automator",
        shortDesc: "Automatisiert Stundenzettel-Erfassung und Abrechnung.",
        goodFor: "Agenturen, Consultancies, Projekt-Teams.",
        price: "199",
        originalPrice: "239",
        type: "Monat",
        integrations: ["Clockify", "Toggl", "Slack", "Google Sheets"],
        features: [
          "Auto-Collect",
          "Client-Reports",
          "Billing-Export",
          "Reminder",
        ],
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════
  // KATEGORIE 15: ENTERPRISE & CUSTOM
  // ═══════════════════════════════════════════════════════════
  {
    id: "enterprise",
    name: "Enterprise & Custom",
    icon: "🏢",
    color: "#7C3AED",
    description: "Maßgeschneiderte Lösungen für komplexe Anforderungen",
    bots: [
      {
        id: "workflow-engine",
        name: "Enterprise Workflow Engine",
        shortDesc:
          "Komplexe Multi-Step-Workflows mit Bedingungen und Schleifen.",
        goodFor: "Große Unternehmen, komplexe Prozesse, Skalierung.",
        price: "490",
        originalPrice: "588",
        type: "Monat",
        popular: true,
        integrations: ["Alle Systeme", "Custom APIs", "Webhooks"],
        features: [
          "Visual Builder",
          "Branching-Logic",
          "Error-Handling",
          "Monitoring",
        ],
      },
      {
        id: "approval-workflow",
        name: "Approval Workflow Bot",
        shortDesc: "Multi-Level Genehmigungsworkflows für Anträge aller Art.",
        goodFor: "HR, Finance, Compliance, Legal.",
        price: "199",
        originalPrice: "239",
        type: "Monat",
        integrations: ["Slack", "Email", "Notion", "Google Sheets"],
        features: ["Multi-Level", "Delegation", "Audit-Trail", "SLA-Tracking"],
      },
      {
        id: "compliance-monitor",
        name: "Compliance Monitor",
        shortDesc:
          "Überwacht Compliance-Anforderungen und dokumentiert Prozesse.",
        goodFor: "Compliance-Teams, Legal, Audit.",
        price: "290",
        originalPrice: "349",
        type: "Monat",
        integrations: ["Google Sheets", "Slack", "Email", "Notion"],
        features: ["Audit-Logs", "Policy-Check", "Expiry-Alerts", "Reports"],
      },
      {
        id: "custom-bot",
        name: "Custom Bot Development",
        shortDesc: "Maßgeschneiderter Bot nach Ihren exakten Anforderungen.",
        goodFor: "Spezial-Anforderungen, Legacy-Systeme, Nischen-Tools.",
        price: "Auf Anfrage",
        originalPrice: "",
        type: "",
        integrations: ["Nach Bedarf", "Custom APIs", "Legacy Systems"],
        features: ["100% Custom", "Dedicated Support", "SLA", "Training"],
      },
      {
        id: "multi-tenant",
        name: "Multi-Tenant Solution",
        shortDesc: "White-Label Automatisierung für mehrere Kunden/Mandanten.",
        goodFor: "Agenturen, SaaS-Anbieter, Reseller.",
        price: "Auf Anfrage",
        originalPrice: "",
        type: "",
        integrations: ["Alle Systeme", "Custom Branding", "API Access"],
        features: [
          "Mandanten-Trennung",
          "Usage-Tracking",
          "Billing-Integration",
          "Admin-Portal",
        ],
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════
  // KATEGORIE 16: NO-CODE DATENBANKEN
  // ═══════════════════════════════════════════════════════════
  {
    id: "no-code-databases",
    name: "No-Code Datenbanken",
    icon: "🗄️",
    color: "#14B8A6",
    description: "Airtable, Notion, Supabase – Daten flexibel verwalten",
    highlight: true,
    bots: [
      {
        id: "airtable-automator",
        name: "Airtable Automator",
        shortDesc: "Automatisiert Airtable-Workflows mit Triggern und Actions.",
        goodFor: "No-Code Teams, Startups, Projekt-Tracking.",
        price: "149",
        originalPrice: "179",
        type: "Monat",
        popular: true,
        integrations: ["Airtable", "Slack", "Gmail", "Webhook"],
        features: ["Record-Trigger", "Auto-Update", "Views-Sync", "Formeln"],
      },
      {
        id: "notion-sync-bot",
        name: "Notion Sync Bot",
        shortDesc: "Synchronisiert Notion-Datenbanken mit externen Tools.",
        goodFor: "Wissensmanagement, Team-Wikis, Dokumentation.",
        price: "149",
        originalPrice: "179",
        type: "Monat",
        popular: true,
        integrations: ["Notion", "Google Drive", "Slack", "Webhook"],
        features: ["Bi-direktional", "Page-Trigger", "Database-Sync", "Backup"],
      },
      {
        id: "supabase-connector",
        name: "Supabase Connector",
        shortDesc: "Verbindet Supabase-Datenbank mit Ihren Business-Tools.",
        goodFor: "Entwickler, Startups, App-Backend.",
        price: "199",
        originalPrice: "239",
        type: "Monat",
        integrations: ["Supabase", "Webhook", "Slack", "Email"],
        features: [
          "Real-time Sync",
          "Row-Trigger",
          "Auth-Events",
          "Edge Functions",
        ],
      },
      {
        id: "spreadsheet-master",
        name: "Spreadsheet Master",
        shortDesc:
          "Verwandelt Google Sheets in eine vollwertige Datenbank-App.",
        goodFor: "KMU, Teams ohne IT, schnelle Lösungen.",
        price: "129",
        originalPrice: "155",
        type: "Monat",
        integrations: ["Google Sheets", "Forms", "Email", "Slack"],
        features: ["Form-Backend", "Auto-Validation", "Lookup", "API-Zugang"],
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════
  // KATEGORIE 17: MICROSOFT & ENTERPRISE
  // ═══════════════════════════════════════════════════════════
  {
    id: "microsoft-enterprise",
    name: "Microsoft & Office",
    icon: "🪟",
    color: "#0078D4",
    description: "Outlook, Teams, Excel – Microsoft 365 automatisieren",
    bots: [
      {
        id: "outlook-automator",
        name: "Outlook Automator",
        shortDesc: "Automatisiert Microsoft Outlook E-Mails und Kalender.",
        goodFor: "Enterprise-Teams, Microsoft-Umgebungen.",
        price: "179",
        originalPrice: "215",
        type: "Monat",
        popular: true,
        integrations: ["Microsoft Outlook", "Google Calendar", "Slack"],
        features: ["Email-Rules", "Calendar-Sync", "Auto-Reply", "Folder-Sort"],
      },
      {
        id: "excel-processor",
        name: "Excel Processor Bot",
        shortDesc:
          "Verarbeitet Excel-Dateien automatisch und erstellt Reports.",
        goodFor: "Finance, Controlling, Datenanalyse.",
        price: "169",
        originalPrice: "203",
        type: "Monat",
        integrations: ["Microsoft Excel", "OneDrive", "Email", "Slack"],
        features: ["Batch-Processing", "Formeln", "Charts", "Auto-Reports"],
      },
      {
        id: "onedrive-sync",
        name: "OneDrive Sync Bot",
        shortDesc: "Synchronisiert OneDrive mit anderen Cloud-Speichern.",
        goodFor: "Hybrid-Teams, Cloud-Migration.",
        price: "129",
        originalPrice: "155",
        type: "Monat",
        integrations: ["Microsoft OneDrive", "Google Drive", "Dropbox"],
        features: [
          "Bi-direktional",
          "Folder-Mapping",
          "Conflict-Resolution",
          "Versioning",
        ],
      },
      {
        id: "teams-notifier",
        name: "MS Teams Notifier",
        shortDesc: "Sendet automatische Benachrichtigungen an Microsoft Teams.",
        goodFor: "Enterprise-Kommunikation, Alerts.",
        price: "99",
        originalPrice: "119",
        type: "Monat",
        integrations: ["Microsoft Teams", "Webhook", "Multiple Sources"],
        features: [
          "Channel-Routing",
          "Adaptive Cards",
          "Mentions",
          "Reactions",
        ],
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════
  // KATEGORIE 18: PROJEKT-TOOLS ERWEITERT
  // ═══════════════════════════════════════════════════════════
  {
    id: "project-tools-extended",
    name: "Weitere PM-Tools",
    icon: "📊",
    color: "#F97316",
    description: "Monday.com, ClickUp, Baserow – Alternative PM-Tools",
    bots: [
      {
        id: "monday-automator",
        name: "Monday.com Automator",
        shortDesc: "Automatisiert Monday.com Boards, Items und Updates.",
        goodFor: "Teams, Agenturen, Projekt-Management.",
        price: "179",
        originalPrice: "215",
        type: "Monat",
        popular: true,
        integrations: ["Monday.com", "Slack", "Gmail", "Webhook"],
        features: [
          "Item-Trigger",
          "Status-Automation",
          "Column-Update",
          "Integrations",
        ],
      },
      {
        id: "clickup-connector",
        name: "ClickUp Connector",
        shortDesc: "Verbindet ClickUp mit Ihrem gesamten Tool-Stack.",
        goodFor: "Agile Teams, Startups, Tool-Konsolidierung.",
        price: "169",
        originalPrice: "203",
        type: "Monat",
        integrations: ["ClickUp", "Slack", "GitHub", "Google Calendar"],
        features: ["Task-Sync", "Time-Tracking", "Goal-Updates", "Automations"],
      },
      {
        id: "asana-advanced",
        name: "Asana Advanced Bot",
        shortDesc: "Erweiterte Asana-Automationen für komplexe Workflows.",
        goodFor: "Enterprise-Teams, Portfolio-Management.",
        price: "189",
        originalPrice: "227",
        type: "Monat",
        integrations: ["Asana", "Notion", "Slack", "Webhook"],
        features: [
          "Portfolio-Sync",
          "Custom-Fields",
          "Rules-Engine",
          "Reporting",
        ],
      },
      {
        id: "baserow-automation",
        name: "Baserow Automation",
        shortDesc: "Automatisiert Baserow-Datenbank als No-Code Backend.",
        goodFor: "Open-Source-Fans, Self-Hosted, Startups.",
        price: "149",
        originalPrice: "179",
        type: "Monat",
        integrations: ["Baserow", "Webhook", "Email", "Slack"],
        features: ["Row-Trigger", "API-Sync", "Views", "Formeln"],
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════
  // KATEGORIE 19: UMFRAGEN & FORMULARE
  // ═══════════════════════════════════════════════════════════
  {
    id: "forms-surveys",
    name: "Umfragen & Formulare",
    icon: "📝",
    color: "#8B5CF6",
    description:
      "Typeform, Jotform, Google Forms – Daten sammeln und verarbeiten",
    bots: [
      {
        id: "typeform-processor",
        name: "Typeform Processor",
        shortDesc:
          "Verarbeitet Typeform-Antworten automatisch und löst Aktionen aus.",
        goodFor: "Lead-Gen, Feedback, Bewerbungen.",
        price: "149",
        originalPrice: "179",
        type: "Monat",
        popular: true,
        integrations: ["Typeform", "Airtable", "Slack", "Email"],
        features: [
          "Response-Trigger",
          "Conditional-Logic",
          "Scoring",
          "CRM-Sync",
        ],
      },
      {
        id: "jotform-automator",
        name: "Jotform Automator",
        shortDesc:
          "Automatisiert Jotform-Submissions und Dokumenten-Generierung.",
        goodFor: "Verträge, Anmeldungen, Bestellungen.",
        price: "139",
        originalPrice: "167",
        type: "Monat",
        integrations: ["Jotform", "Google Drive", "Email", "Slack"],
        features: [
          "PDF-Generate",
          "E-Sign",
          "Conditional-Email",
          "Approval-Flow",
        ],
      },
      {
        id: "survey-aggregator",
        name: "Survey Aggregator",
        shortDesc:
          "Sammelt Umfrage-Daten aus verschiedenen Quellen in einem Dashboard.",
        goodFor: "Research, UX, Customer Insights.",
        price: "179",
        originalPrice: "215",
        type: "Monat",
        integrations: ["Typeform", "Google Forms", "SurveyMonkey", "Sheets"],
        features: ["Multi-Source", "Analytics", "Trend-Charts", "Export"],
      },
      {
        id: "feedback-router",
        name: "Feedback Router Bot",
        shortDesc: "Routet Feedback automatisch an die richtigen Teams.",
        goodFor: "Product-Teams, Support, Customer Success.",
        price: "159",
        originalPrice: "191",
        type: "Monat",
        integrations: ["Typeform", "Slack", "Jira", "Notion"],
        features: [
          "Sentiment-Routing",
          "Priority-Tags",
          "Team-Assignment",
          "Follow-up",
        ],
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════
  // KATEGORIE 20: SMS & TELEFONIE
  // ═══════════════════════════════════════════════════════════
  {
    id: "sms-telephony",
    name: "SMS & Telefonie",
    icon: "📞",
    color: "#EF4444",
    description:
      "Twilio, SMS, VoIP – Telefonische Kommunikation automatisieren",
    bots: [
      {
        id: "sms-notification-bot",
        name: "SMS Notification Bot",
        shortDesc:
          "Sendet automatische SMS-Benachrichtigungen bei wichtigen Events.",
        goodFor: "Alerts, Reminders, Zwei-Faktor.",
        price: "149",
        originalPrice: "179",
        type: "Monat",
        popular: true,
        integrations: ["Twilio", "Webhook", "Slack", "CRM"],
        features: [
          "Bulk-SMS",
          "Personalisierung",
          "Delivery-Tracking",
          "Opt-out",
        ],
      },
      {
        id: "appointment-reminder-sms",
        name: "Termin-Reminder SMS",
        shortDesc: "Sendet automatische Terminerinnerungen per SMS.",
        goodFor: "Ärzte, Salons, Berater.",
        price: "129",
        originalPrice: "155",
        type: "Monat",
        integrations: ["Twilio", "Calendly", "Google Calendar"],
        features: [
          "Multi-Reminder",
          "Bestätigung",
          "Umbuchung",
          "No-Show-Tracking",
        ],
      },
      {
        id: "call-logging-bot",
        name: "Call Logging Bot",
        shortDesc: "Protokolliert eingehende Anrufe automatisch im CRM.",
        goodFor: "Sales, Support, Call-Center.",
        price: "189",
        originalPrice: "227",
        type: "Monat",
        integrations: ["Twilio", "HubSpot", "Pipedrive", "Slack"],
        features: ["Auto-Log", "Transkription", "Tagging", "Follow-up"],
      },
      {
        id: "ivr-bot",
        name: "IVR Flow Bot",
        shortDesc: "Erstellt automatisierte Telefonmenüs und Weiterleitungen.",
        goodFor: "Kundenservice, Hotlines.",
        price: "249",
        originalPrice: "299",
        type: "Monat",
        integrations: ["Twilio", "Webhook", "CRM", "Slack"],
        features: [
          "Menu-Builder",
          "Speech-Recognition",
          "Routing",
          "Analytics",
        ],
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════
  // KATEGORIE 21: ANALYTICS & REPORTING
  // ═══════════════════════════════════════════════════════════
  {
    id: "analytics-reporting",
    name: "Analytics & Reporting",
    icon: "📈",
    color: "#06B6D4",
    description: "Google Analytics, Dashboards, Reports – Daten visualisieren",
    bots: [
      {
        id: "google-analytics-bot",
        name: "GA4 Report Bot",
        shortDesc:
          "Erstellt automatische Google Analytics Reports und sendet sie.",
        goodFor: "Marketing, SEO, Geschäftsführung.",
        price: "179",
        originalPrice: "215",
        type: "Monat",
        popular: true,
        integrations: ["Google Analytics", "Slack", "Email", "Sheets"],
        features: [
          "Scheduled Reports",
          "KPI-Dashboard",
          "Anomalie-Alerts",
          "Vergleiche",
        ],
      },
      {
        id: "multi-dashboard-bot",
        name: "Multi-Dashboard Bot",
        shortDesc:
          "Aggregiert Daten aus verschiedenen Quellen in einem Dashboard.",
        goodFor: "Manager, C-Level, Data-Teams.",
        price: "249",
        originalPrice: "299",
        type: "Monat",
        integrations: ["Google Analytics", "HubSpot", "Stripe", "Sheets"],
        features: ["Multi-Source", "Real-time", "Custom-Widgets", "Sharing"],
      },
      {
        id: "kpi-tracker",
        name: "KPI Tracker Bot",
        shortDesc: "Trackt KPIs automatisch und warnt bei Abweichungen.",
        goodFor: "OKR-Tracking, Performance-Management.",
        price: "189",
        originalPrice: "227",
        type: "Monat",
        integrations: ["Google Sheets", "Notion", "Slack", "Email"],
        features: [
          "Goal-Tracking",
          "Trend-Analysis",
          "Threshold-Alerts",
          "History",
        ],
      },
      {
        id: "seo-monitor-bot",
        name: "SEO Monitor Bot",
        shortDesc: "Überwacht Rankings und SEO-Metriken automatisch.",
        goodFor: "SEO-Teams, Agenturen, Content-Manager.",
        price: "199",
        originalPrice: "239",
        type: "Monat",
        integrations: ["Google Search Console", "Slack", "Sheets", "Email"],
        features: [
          "Rank-Tracking",
          "Keyword-Alerts",
          "Competitor-Watch",
          "Reports",
        ],
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════
  // KATEGORIE 22: CONTENT & CMS
  // ═══════════════════════════════════════════════════════════
  {
    id: "content-cms",
    name: "Content & CMS",
    icon: "✍️",
    color: "#A855F7",
    description: "WordPress, Webflow, RSS – Content automatisch verwalten",
    bots: [
      {
        id: "wordpress-automator",
        name: "WordPress Automator",
        shortDesc: "Automatisiert WordPress-Posts, Updates und Backups.",
        goodFor: "Blogger, Agenturen, Content-Teams.",
        price: "149",
        originalPrice: "179",
        type: "Monat",
        popular: true,
        integrations: ["WordPress", "Google Sheets", "Social Media"],
        features: ["Auto-Publish", "Social-Share", "SEO-Tags", "Backup"],
      },
      {
        id: "webflow-sync",
        name: "Webflow Sync Bot",
        shortDesc: "Synchronisiert Webflow CMS mit externen Datenquellen.",
        goodFor: "Designer, No-Code-Entwickler.",
        price: "179",
        originalPrice: "215",
        type: "Monat",
        integrations: ["Webflow", "Airtable", "Google Sheets"],
        features: [
          "CMS-Sync",
          "Collection-Update",
          "Image-Upload",
          "Bulk-Edit",
        ],
      },
      {
        id: "rss-content-hub",
        name: "RSS Content Hub",
        shortDesc: "Aggregiert und verteilt RSS-Content automatisch.",
        goodFor: "News-Seiten, Curators, Newsletter.",
        price: "129",
        originalPrice: "155",
        type: "Monat",
        integrations: ["RSS Feed", "Telegram", "Email", "WordPress"],
        features: ["Multi-Feed", "Filter", "Auto-Post", "Digest"],
      },
      {
        id: "image-optimizer-bot",
        name: "Image Optimizer Bot",
        shortDesc: "Optimiert und konvertiert Bilder automatisch für Web.",
        goodFor: "E-Commerce, Blogs, Media-Teams.",
        price: "119",
        originalPrice: "143",
        type: "Monat",
        integrations: ["Google Drive", "WordPress", "Shopify"],
        features: ["Compression", "Resize", "WebP-Convert", "Batch"],
      },
    ],
  },
];

// Statistiken aus der Workflow-Analyse
const stats = {
  totalWorkflows: "2.061",
  totalIntegrations: "187+",
  totalCategories: "22",
  activeBots: "107+",
};

// ═══════════════════════════════════════════════════════════════
//                    BOT PRODUCT CARD
// ═══════════════════════════════════════════════════════════════

function BotProductCard({
  bot,
  categoryColor,
  onCheckout,
}: {
  bot: (typeof categories)[0]["bots"][0];
  categoryColor: string;
  onCheckout: (
    bot: (typeof categories)[0]["bots"][0],
    type: "rent" | "buy",
  ) => void;
}) {
  // Berechne Kaufpreis (10x Monatsmiete)
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
      {/* Popular Badge */}
      {bot.popular && (
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#FC682C] text-white text-[10px] font-semibold z-10">
          Beliebt
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="mb-3">
          <h4 className="text-sm font-bold text-white group-hover:text-[#FC682C] transition-colors pr-16">
            {bot.name}
          </h4>
          <p className="text-xs text-white/70 mt-1 leading-relaxed">
            {bot.shortDesc}
          </p>
        </div>

        {/* Good For */}
        <div className="mb-3 p-2 rounded-lg bg-white/[0.03] border border-white/5">
          <span className="text-[9px] uppercase tracking-wider text-[#FC682C] font-semibold">
            Gut für:
          </span>
          <p className="text-[11px] text-white/60 mt-0.5">{bot.goodFor}</p>
        </div>

        {/* Integrations */}
        <div className="mb-2">
          <span className="text-[9px] uppercase tracking-wider text-white/40 font-semibold">
            Verbindet:
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

        {/* Features */}
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

        {/* Price & CTA */}
        <div className="pt-2 border-t border-white/5 mt-auto">
          {bot.price === "Auf Anfrage" ? (
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Auf Anfrage</span>
              <Link
                href="/termin"
                className="px-3 py-1.5 rounded-lg bg-[#FC682C]/10 border border-[#FC682C]/30 text-[#FC682C] text-[10px] font-semibold hover:bg-[#FC682C] hover:text-white transition-all"
              >
                Anfragen
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Preise anzeigen */}
              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-2">
                  <div>
                    <span className="text-white/40">Miete:</span>
                    <span className="ml-1 text-white font-semibold">
                      {bot.price} €/Mo
                    </span>
                  </div>
                  <div className="text-white/20">|</div>
                  <div>
                    <span className="text-white/40">Kauf:</span>
                    <span className="ml-1 text-white font-semibold">
                      {buyPrice.toLocaleString("de-DE")} €
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => onCheckout(bot, "rent")}
                  className="flex-1 py-2 rounded-lg bg-[#FFB347]/10 border border-[#FFB347]/30 text-[#FFB347] text-[10px] font-semibold hover:bg-[#FFB347] hover:text-black transition-all"
                >
                  Mieten
                </button>
                <button
                  onClick={() => onCheckout(bot, "buy")}
                  className="flex-1 py-2 rounded-lg bg-[#FC682C]/10 border border-[#FC682C]/30 text-[#FC682C] text-[10px] font-semibold hover:bg-[#FC682C] hover:text-white transition-all"
                >
                  Kaufen
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
  category: (typeof categories)[0];
  index: number;
  onCheckout: (
    bot: (typeof categories)[0]["bots"][0],
    type: "rent" | "buy",
  ) => void;
}) {
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
      {/* Category Header */}
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
                  HOT
                </span>
              )}
              <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] text-white/50">
                {category.bots.length} Bots
              </span>
            </div>
            <p className="text-sm text-white/60 mt-0.5">
              {category.description}
            </p>
          </div>
        </div>
      </div>

      {/* Bot Products Grid */}
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
      {/* Outer glow */}
      <motion.div
        className="absolute w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(252,104,44,0.15) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      {/* Central Bot Hub */}
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

      {/* Orbiting Integration Icons */}
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

      {/* Floating particles */}
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
//                    TRUST LOGOS
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
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Checkout Modal State
  const [checkoutModal, setCheckoutModal] = useState<{
    bot: (typeof categories)[0]["bots"][0];
    purchaseType: "rent" | "buy";
  } | null>(null);

  const handleCheckout = useCallback(
    (bot: (typeof categories)[0]["bots"][0], type: "rent" | "buy") => {
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
      {/* ═══════════════════════════════════════════════════════════════
                              HERO SECTION
         ═══════════════════════════════════════════════════════════════ */}
      <section className="relative pt-20 sm:pt-24 pb-12 sm:pb-16 border-b border-white/5 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#FC682C]/10 rounded-full blur-[180px]" />
          <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-[#8B5CF6]/10 rounded-full blur-[150px]" />
          <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-[#0088CC]/5 rounded-full blur-[120px]" />
        </div>

        <div className="container relative z-10 px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Left - Text Content */}
            <div className="flex-1 text-center lg:text-left">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FC682C]/20 to-[#8B5CF6]/20 border border-[#FC682C]/30 mb-5"
              >
                <span className="w-2 h-2 rounded-full bg-[#FC682C] animate-pulse" />
                <span className="text-xs sm:text-sm text-white/80 font-medium">
                  Bot-Shop • 2.061 Workflows analysiert • {totalBots}{" "}
                  Premium-Bots
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 leading-tight"
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FC682C] to-[#FF8C5A]">
                  {totalBots}+ Premium-Bots
                </span>
                <br />
                <span className="text-white">für echte Automatisierung</span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-sm sm:text-base text-white/70 max-w-xl mx-auto lg:mx-0 mb-5"
              >
                Fertige Bots zum Mieten oder Kaufen. Basierend auf 2.061 echten
                n8n-Workflows. Von KI-gestütztem WhatsApp-Support bis zur
                kompletten CRM-Automatisierung.
              </motion.p>

              {/* Stats Row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-4 gap-2 mb-5 max-w-md mx-auto lg:mx-0"
              >
                {[
                  { value: `${totalBots}+`, label: "Bots" },
                  { value: stats.totalCategories, label: "Kategorien" },
                  { value: stats.totalIntegrations, label: "Integrationen" },
                  { value: stats.totalWorkflows, label: "Workflows" },
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

              {/* CTA Buttons */}
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
                  Alle {totalBots} Bots entdecken
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
                  Kostenlose Beratung
                </Link>
              </motion.div>

              {/* Trust Line */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap justify-center lg:justify-start gap-x-4 gap-y-2 text-xs text-white/50"
              >
                {[
                  "DSGVO-konform",
                  "Deutsche Server",
                  "Sofort aktivierbar",
                  "Support inklusive",
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

            {/* Right - Visualization */}
            <motion.div
              className="flex-1 w-full max-w-md lg:max-w-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <HeroVisualization />
            </motion.div>
          </div>

          {/* Integration Logos */}
          <motion.div
            className="mt-10 pt-8 border-t border-white/5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-center text-xs text-white/40 mb-4 uppercase tracking-wider">
              Verbindet mit über 187 Tools
            </p>
            <IntegrationLogos />
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
                        SO FUNKTIONIERT'S SECTION - ENHANCED
         ═══════════════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 border-b border-white/5 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-[#FC682C]/5 via-[#8B5CF6]/5 to-[#10B981]/5 blur-[80px] rounded-full" />
        </div>

        <div className="container px-4 sm:px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
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
                  So einfach geht Automatisierung
                </span>
              </motion.div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3">
                Ein Bot = ein klarer Job
              </h2>
              <p className="text-sm sm:text-base text-white/60 max-w-xl mx-auto">
                In 3 Schritten von der Auswahl zum laufenden System
              </p>
            </motion.div>

            {/* Enhanced 3 Steps with Visual Connection */}
            <div className="relative">
              {/* Connection Line - Desktop */}
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

              {/* Steps Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-4">
                {[
                  {
                    num: "1",
                    title: "Bot wählen",
                    desc: "Durchstöbern Sie 107+ spezialisierte Bots. Finden Sie den perfekten für Ihre Aufgabe.",
                    icon: "🎯",
                    color: "#FC682C",
                    gradient: "from-[#FC682C] to-[#FF8C5A]",
                    details: ["22 Kategorien", "Suchfunktion", "Detailansicht"],
                  },
                  {
                    num: "2",
                    title: "Verbinden",
                    desc: "Wir richten alle Verbindungen zu Ihren Tools ein. Sie müssen nichts technisches tun.",
                    icon: "🔗",
                    color: "#8B5CF6",
                    gradient: "from-[#8B5CF6] to-[#A78BFA]",
                    details: [
                      "187+ Integrationen",
                      "Sichere Auth",
                      "Kein Code",
                    ],
                  },
                  {
                    num: "3",
                    title: "Läuft",
                    desc: "Ihr Bot arbeitet 24/7 automatisch. Sie sehen alle Ergebnisse live im Dashboard.",
                    icon: "✅",
                    color: "#10B981",
                    gradient: "from-[#10B981] to-[#34D399]",
                    details: ["24/7 aktiv", "Live-Dashboard", "Alerts"],
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
                    {/* Step Card */}
                    <div className="relative p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] h-full">
                      {/* Step Number Circle */}
                      <div
                        className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs z-10"
                        style={{
                          background: `linear-gradient(135deg, ${step.color}, ${step.color}dd)`,
                        }}
                      >
                        {step.num}
                      </div>

                      {/* Icon */}
                      <div
                        className="w-12 h-12 rounded-xl mx-auto mt-3 mb-3 flex items-center justify-center text-2xl"
                        style={{ backgroundColor: `${step.color}15` }}
                      >
                        {step.icon}
                      </div>

                      {/* Title */}
                      <h3 className="text-sm font-bold text-white text-center mb-2">
                        {step.title}
                      </h3>

                      {/* Description */}
                      <p className="text-[11px] text-white/60 text-center mb-3 leading-relaxed">
                        {step.desc}
                      </p>

                      {/* Detail Tags */}
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

                    {/* Arrow for Mobile */}
                    {i < 2 && (
                      <div className="md:hidden flex justify-center my-4">
                        <motion.svg
                          width="24"
                          height="40"
                          viewBox="0 0 24 40"
                          fill="none"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                        >
                          <path
                            d="M12 0V32M12 32L4 24M12 32L20 24"
                            stroke="url(#arrowGradient)"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <defs>
                            <linearGradient
                              id="arrowGradient"
                              x1="12"
                              y1="0"
                              x2="12"
                              y2="40"
                            >
                              <stop stopColor={step.color} />
                              <stop
                                offset="1"
                                stopColor={step.color}
                                stopOpacity="0.3"
                              />
                            </linearGradient>
                          </defs>
                        </motion.svg>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA below steps */}
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
                <span>Jetzt Bot auswählen</span>
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
                Kostenlose Beratung • Keine Verpflichtung
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
                              PREISE SECTION
         ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 border-b border-white/5 bg-gradient-to-b from-[#FC682C]/5 via-transparent to-transparent">
        <div className="container px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <motion.div
              className="text-center mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FC682C]/20 to-[#FF8C5A]/20 border border-[#FC682C]/30 mb-5">
                <span className="text-base">🎉</span>
                <span className="text-sm text-[#FC682C] font-semibold">
                  Neujahrs-Aktion: –20% auf alle Bots
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3">
                Transparente Preise
              </h2>
              <p className="text-xs sm:text-sm text-white/60">
                Mieten für Flexibilität oder Kaufen für dauerhafte Nutzung
              </p>
            </motion.div>

            {/* Price Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
              {/* Miete Card */}
              <motion.div
                className="p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08] relative overflow-hidden"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFB347]/10 rounded-full blur-3xl" />
                <h3 className="text-base sm:text-lg font-bold text-white mb-2 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-[#FFB347]/20 flex items-center justify-center text-sm">
                    📅
                  </span>
                  MIETE
                </h3>
                <p className="text-xs text-white/60 mb-4">
                  Monatlich kündbar, inklusive Updates & Support
                </p>

                <div className="space-y-3">
                  {[
                    {
                      tier: "Standard Bot",
                      price: "ab 99",
                      original: "119",
                      desc: "Einfache Automatisierungen",
                    },
                    {
                      tier: "Pro Bot",
                      price: "ab 179",
                      original: "215",
                      desc: "Multi-Integration, komplexe Logik",
                    },
                    {
                      tier: "Premium Bot",
                      price: "ab 290",
                      original: "349",
                      desc: "KI-Features, Enterprise-ready",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg bg-white/[0.02] border border-white/5"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-semibold text-white text-sm">
                            {item.tier}
                          </span>
                          <p className="text-[10px] text-white/50 mt-0.5">
                            {item.desc}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-baseline gap-1">
                            <span className="text-base sm:text-lg font-bold text-white">
                              {item.price} €
                            </span>
                            <span className="text-[10px] text-white/40">
                              /Mo
                            </span>
                          </div>
                          <span className="text-[10px] text-white/40 line-through">
                            statt {item.original} €
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Kauf Card */}
              <motion.div
                className="p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08] relative overflow-hidden"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#06b6d4]/10 rounded-full blur-3xl" />
                <h3 className="text-base sm:text-lg font-bold text-white mb-2 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-[#06b6d4]/20 flex items-center justify-center text-sm">
                    💎
                  </span>
                  KAUF
                </h3>
                <p className="text-xs text-white/60 mb-4">
                  Einmalzahlung, lebenslang Ihre Lösung
                </p>

                <div className="space-y-3">
                  {[
                    {
                      tier: "Core Bot",
                      price: "ab 1.290",
                      original: "1.549",
                      desc: "Saubere Integration, ein Job",
                    },
                    {
                      tier: "Plus Bot",
                      price: "ab 1.490",
                      original: "1.790",
                      desc: "Mehr Logik, mehr Schritte",
                    },
                    {
                      tier: "Premium Bot",
                      price: "ab 1.790",
                      original: "2.149",
                      desc: "Komplexe Workflows",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg bg-white/[0.02] border border-white/5"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-semibold text-white text-sm">
                            {item.tier}
                          </span>
                          <p className="text-[10px] text-white/50 mt-0.5">
                            {item.desc}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-base sm:text-lg font-bold text-white">
                            {item.price} €
                          </span>
                          <div className="text-[10px] text-white/40 line-through">
                            statt {item.original} €
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Included */}
            <div className="flex flex-wrap justify-center gap-2">
              {[
                "Einrichtung inklusive",
                "30 Tage Geld-zurück",
                "Deutscher Support",
                "Keine versteckten Kosten",
              ].map((item) => (
                <span
                  key={item}
                  className="px-4 py-2 rounded-full bg-[#FC682C]/10 border border-[#FC682C]/20 text-xs sm:text-sm text-white/80 flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4 text-[#FC682C]"
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
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
                        SEARCH & FILTER BAR (Sticky)
         ═══════════════════════════════════════════════════════════════ */}
      <section
        id="bots"
        className="sticky top-0 z-40 bg-[#030308]/95 backdrop-blur-lg border-b border-white/5 py-4"
      >
        <div className="container px-4 sm:px-6">
          {/* Search */}
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
                placeholder="Bot, Integration oder Anwendungsfall suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-[#FC682C]/50 transition-colors"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            <button
              onClick={() => setActiveFilter(null)}
              className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeFilter === null
                  ? "bg-[#FC682C] text-white"
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              Alle ({totalBots})
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

      {/* ═══════════════════════════════════════════════════════════════
                        KATEGORIEN & BOTS
         ═══════════════════════════════════════════════════════════════ */}
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
                    Keine Bots gefunden
                  </h3>
                  <p className="text-white/60">
                    Versuchen Sie einen anderen Suchbegriff
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setActiveFilter(null);
                    }}
                    className="mt-4 px-4 py-2 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20 transition-colors"
                  >
                    Filter zurücksetzen
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
                              FINAL CTA
         ═══════════════════════════════════════════════════════════════ */}
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
                Bereit für echte Automatisierung?
              </h2>
              <p className="text-sm sm:text-base text-white/60 mb-6">
                Lassen Sie uns in 15 Minuten besprechen, welche Bots Ihnen am
                meisten Zeit sparen.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Link
                  href="/termin"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-gradient-to-r from-[#FC682C] to-[#e55a1f] text-white text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-[#FC682C]/25"
                >
                  Kostenloses Erstgespräch
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
                  Alle {totalBots} Bots ansehen
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
                              CHECKOUT MODAL
         ═══════════════════════════════════════════════════════════════ */}
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
