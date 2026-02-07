"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { motion, useInView, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { Link } from "@/i18n/routing";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

// ═══════════════════════════════════════════════════════════════
//                    TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════

interface Bot {
  id: string;
  name: string;
  shortDesc: string;
  goodFor: string;
  price: string;
  originalPrice?: string;
  type: string;
  popular?: boolean;
  new?: boolean;
  limited?: boolean;
  trending?: boolean;
  integrations: string[];
  features: string[];
  rating?: number;
  reviews?: number;
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

// ═══════════════════════════════════════════════════════════════
//                    BOT DATA - 108+ Premium Bots
// ═══════════════════════════════════════════════════════════════

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
        type: "month",
        popular: true,
        trending: true,
        rating: 4.9,
        reviews: 127,
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
        type: "month",
        new: true,
        rating: 4.8,
        reviews: 89,
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
        type: "month",
        rating: 4.7,
        reviews: 64,
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
        type: "month",
        limited: true,
        rating: 4.9,
        reviews: 42,
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
        type: "month",
        rating: 4.6,
        reviews: 78,
        integrations: ["OpenAI", "Google Calendar", "Slack", "Notion"],
        features: ["Transcription", "Summaries", "Action Items", "Follow-ups"],
      },
      {
        id: "ai-research-agent",
        name: "AI Research Agent",
        shortDesc: "Autonomous research and summarization",
        goodFor: "Research, Analysts",
        price: "249",
        originalPrice: "299",
        type: "month",
        trending: true,
        rating: 4.9,
        reviews: 156,
        integrations: ["OpenAI", "Web Search", "Google Docs", "Notion"],
        features: ["Web Research", "Multi-Source", "Fact-Check", "Reports"],
      },
      {
        id: "ai-email-writer",
        name: "AI Email Writer",
        shortDesc: "GPT-powered email drafting",
        goodFor: "Sales, Marketing",
        price: "129",
        originalPrice: "155",
        type: "month",
        popular: true,
        rating: 4.8,
        reviews: 234,
        integrations: ["OpenAI", "Gmail", "Outlook", "CRM"],
        features: ["Smart Drafts", "Tone Control", "Personalization", "Templates"],
      },
      {
        id: "gemini-vision-bot",
        name: "Gemini Vision Bot",
        shortDesc: "Image analysis with Google Gemini",
        goodFor: "E-Commerce, Content",
        price: "189",
        originalPrice: "227",
        type: "month",
        new: true,
        rating: 4.7,
        reviews: 67,
        integrations: ["Google Gemini", "Google Drive", "Shopify", "Slack"],
        features: ["Image Analysis", "Product Tags", "Alt Text", "Moderation"],
      },
      {
        id: "ai-data-analyst",
        name: "AI Data Analyst",
        shortDesc: "Natural language data queries",
        goodFor: "Analytics, BI Teams",
        price: "219",
        originalPrice: "263",
        type: "month",
        limited: true,
        rating: 4.9,
        reviews: 89,
        integrations: ["OpenAI", "PostgreSQL", "Google Sheets", "Slack"],
        features: ["NL Queries", "Charts", "Insights", "Scheduled Reports"],
      },
      {
        id: "ai-code-reviewer",
        name: "AI Code Reviewer",
        shortDesc: "Automated code review with AI",
        goodFor: "Dev Teams",
        price: "169",
        originalPrice: "203",
        type: "month",
        rating: 4.8,
        reviews: 112,
        integrations: ["OpenAI", "GitHub", "GitLab", "Slack"],
        features: ["PR Review", "Security Scan", "Best Practices", "Suggestions"],
      },
      {
        id: "ai-translator",
        name: "AI Translator Pro",
        shortDesc: "Context-aware multi-language translation",
        goodFor: "Global Teams",
        price: "139",
        originalPrice: "167",
        type: "month",
        rating: 4.7,
        reviews: 178,
        integrations: ["OpenAI", "Google Translate", "Notion", "Slack"],
        features: ["50+ Languages", "Context Memory", "Terminology", "Batch"],
      },
      {
        id: "rag-knowledge-base",
        name: "RAG Knowledge Base",
        shortDesc: "AI-powered internal knowledge search",
        goodFor: "Enterprise, Support",
        price: "299",
        originalPrice: "359",
        type: "month",
        trending: true,
        limited: true,
        rating: 4.9,
        reviews: 45,
        integrations: ["OpenAI", "Pinecone", "Notion", "Confluence"],
        features: ["Vector Search", "Source Citations", "Multi-Doc", "Updates"],
      },
      {
        id: "ai-sentiment-analyzer",
        name: "AI Sentiment Analyzer",
        shortDesc: "Real-time sentiment analysis",
        goodFor: "Marketing, Support",
        price: "149",
        originalPrice: "179",
        type: "month",
        rating: 4.6,
        reviews: 98,
        integrations: ["OpenAI", "Twitter", "Reviews", "Slack"],
        features: ["Real-time", "Multi-Platform", "Alerts", "Trends"],
      },
      {
        id: "ai-chatbot-builder",
        name: "AI Chatbot Builder",
        shortDesc: "Custom GPT chatbots for websites",
        goodFor: "Marketing, Support",
        price: "199",
        originalPrice: "239",
        type: "month",
        popular: true,
        rating: 4.8,
        reviews: 267,
        integrations: ["OpenAI", "Website", "WhatsApp", "Telegram"],
        features: ["No-Code", "Training", "Analytics", "Multi-Channel"],
      },
    ],
  },
  {
    id: "telegram-chat",
    name: "Telegram & Messenger",
    icon: "📱",
    color: "#0088CC",
    description: "Chat automation for Telegram & WhatsApp",
    bots: [
      {
        id: "telegram-support",
        name: "Telegram Support Bot",
        shortDesc: "Automated support via Telegram",
        goodFor: "Support, Communities",
        price: "129",
        originalPrice: "155",
        type: "month",
        popular: true,
        rating: 4.8,
        reviews: 156,
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
        type: "month",
        rating: 4.5,
        reviews: 93,
        integrations: ["Telegram", "Webhook", "Email", "Slack"],
        features: ["Custom Alerts", "Formatting", "Scheduling", "Groups"],
      },
      {
        id: "telegram-commerce",
        name: "Telegram Commerce Bot",
        shortDesc: "E-commerce via Telegram",
        goodFor: "Small Businesses, DTC",
        price: "159",
        originalPrice: "191",
        type: "month",
        trending: true,
        rating: 4.7,
        reviews: 67,
        integrations: ["Telegram", "Stripe", "Shopify", "Google Sheets"],
        features: ["Product Catalog", "Orders", "Payments", "Customer Chat"],
      },
      {
        id: "telegram-community",
        name: "Telegram Community Manager",
        shortDesc: "Community management automation",
        goodFor: "Communities, Crypto",
        price: "139",
        originalPrice: "167",
        type: "month",
        rating: 4.6,
        reviews: 45,
        integrations: ["Telegram", "OpenAI", "Airtable", "Analytics"],
        features: ["Member Mgmt", "Anti-Spam", "Engagement", "Analytics"],
      },
      {
        id: "whatsapp-business",
        name: "WhatsApp Business Bot",
        shortDesc: "Professional WhatsApp automation",
        goodFor: "Sales, Support",
        price: "189",
        originalPrice: "227",
        type: "month",
        new: true,
        popular: true,
        rating: 4.9,
        reviews: 34,
        integrations: ["WhatsApp", "OpenAI", "CRM", "Calendar"],
        features: ["Auto-Reply", "Broadcasts", "Templates", "Analytics"],
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
        type: "month",
        popular: true,
        rating: 4.8,
        reviews: 112,
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
        type: "month",
        rating: 4.7,
        reviews: 89,
        integrations: ["Stripe", "Email", "Slack", "CRM"],
        features: ["Invoice Sync", "Subscription Alerts", "Refund Handling", "Reports"],
      },
      {
        id: "pipedrive-automator",
        name: "Pipedrive Automator",
        shortDesc: "Automated Pipedrive sales workflows",
        goodFor: "Sales Teams",
        price: "159",
        originalPrice: "191",
        type: "month",
        rating: 4.6,
        reviews: 56,
        integrations: ["Pipedrive", "Email", "Slack", "Calendar"],
        features: ["Deal Automation", "Activity Sync", "Lead Scoring", "Reports"],
      },
      {
        id: "salesforce-connector",
        name: "Salesforce Connector",
        shortDesc: "Enterprise Salesforce automation",
        goodFor: "Enterprise Sales",
        price: "199",
        originalPrice: "239",
        type: "month",
        rating: 4.8,
        reviews: 78,
        integrations: ["Salesforce", "Slack", "Email", "Tableau"],
        features: ["Lead Routing", "Opportunity Mgmt", "Forecasting", "Dashboards"],
      },
    ],
  },
  {
    id: "google-workspace",
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
        type: "month",
        popular: true,
        rating: 4.7,
        reviews: 234,
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
        type: "month",
        rating: 4.6,
        reviews: 98,
        integrations: ["Google Sheets", "Email", "Slack", "Database"],
        features: ["Data Validation", "Auto-Reports", "Notifications", "Sync"],
      },
      {
        id: "calendar-automator",
        name: "Calendar Automator",
        shortDesc: "Google Calendar workflow automation",
        goodFor: "Teams, Assistants",
        price: "109",
        originalPrice: "131",
        type: "month",
        rating: 4.5,
        reviews: 67,
        integrations: ["Google Calendar", "Zoom", "Slack", "Email"],
        features: ["Event Creation", "Reminders", "Conflicts", "Sync"],
      },
      {
        id: "drive-organizer",
        name: "Drive Organizer",
        shortDesc: "Automated Google Drive management",
        goodFor: "Teams, Organizations",
        price: "119",
        originalPrice: "143",
        type: "month",
        rating: 4.4,
        reviews: 45,
        integrations: ["Google Drive", "Email", "Slack", "Notion"],
        features: ["Auto-Organize", "Permissions", "Backups", "Notifications"],
      },
    ],
  },
  {
    id: "communication",
    name: "Communication & Chat",
    icon: "💬",
    color: "#E01E5A",
    description: "Slack, Discord, and team communication",
    bots: [
      {
        id: "slack-notifier",
        name: "Slack Notifier",
        shortDesc: "Automated Slack notifications",
        goodFor: "Teams, DevOps",
        price: "99",
        originalPrice: "119",
        type: "month",
        popular: true,
        rating: 4.8,
        reviews: 189,
        integrations: ["Slack", "Webhook", "Email", "Jira"],
        features: ["Custom Channels", "Scheduled Messages", "Mentions", "Threading"],
      },
      {
        id: "slack-workflow",
        name: "Slack Workflow Bot",
        shortDesc: "Complex Slack workflow automation",
        goodFor: "Operations, HR",
        price: "149",
        originalPrice: "179",
        type: "month",
        rating: 4.7,
        reviews: 67,
        integrations: ["Slack", "Google Sheets", "Notion", "Airtable"],
        features: ["Approval Flows", "Form Collection", "Auto-Routing", "Reports"],
      },
      {
        id: "discord-moderator",
        name: "Discord Moderator",
        shortDesc: "Automated Discord moderation",
        goodFor: "Communities, Gaming",
        price: "119",
        originalPrice: "143",
        type: "month",
        trending: true,
        rating: 4.6,
        reviews: 123,
        integrations: ["Discord", "OpenAI", "Google Sheets", "Webhook"],
        features: ["Auto-Mod", "Welcome Messages", "Role Management", "Analytics"],
      },
      {
        id: "discord-engagement",
        name: "Discord Engagement Bot",
        shortDesc: "Boost community engagement",
        goodFor: "Community Managers",
        price: "129",
        originalPrice: "155",
        type: "month",
        rating: 4.5,
        reviews: 56,
        integrations: ["Discord", "OpenAI", "Notion", "Calendar"],
        features: ["Event Reminders", "Polls", "Leaderboards", "Rewards"],
      },
      {
        id: "teams-connector",
        name: "Microsoft Teams Bot",
        shortDesc: "Enterprise Teams automation",
        goodFor: "Enterprise",
        price: "159",
        originalPrice: "191",
        type: "month",
        new: true,
        rating: 4.7,
        reviews: 34,
        integrations: ["MS Teams", "SharePoint", "Outlook", "Power Automate"],
        features: ["Notifications", "Approvals", "Meetings", "Files"],
      },
    ],
  },
  {
    id: "social-marketing",
    name: "Social & Marketing",
    icon: "📣",
    color: "#E1306C",
    description: "LinkedIn, Twitter, Instagram automation",
    bots: [
      {
        id: "linkedin-automator",
        name: "LinkedIn Automator",
        shortDesc: "Automated LinkedIn outreach",
        goodFor: "Sales, Recruiters",
        price: "179",
        originalPrice: "215",
        type: "month",
        popular: true,
        limited: true,
        rating: 4.8,
        reviews: 145,
        integrations: ["LinkedIn", "HubSpot", "Google Sheets", "Email"],
        features: ["Auto-Connect", "Post Scheduling", "Lead Export", "Analytics"],
      },
      {
        id: "twitter-scheduler",
        name: "Twitter/X Scheduler",
        shortDesc: "Automated Twitter posting",
        goodFor: "Marketing, Influencers",
        price: "129",
        originalPrice: "155",
        type: "month",
        rating: 4.6,
        reviews: 89,
        integrations: ["Twitter", "OpenAI", "Buffer", "Analytics"],
        features: ["Thread Creator", "Scheduling", "Analytics", "Auto-Reply"],
      },
      {
        id: "instagram-manager",
        name: "Instagram Manager",
        shortDesc: "Complete Instagram automation",
        goodFor: "Brands, Creators",
        price: "159",
        originalPrice: "191",
        type: "month",
        trending: true,
        rating: 4.7,
        reviews: 112,
        integrations: ["Instagram", "Canva", "Dropbox", "Analytics"],
        features: ["Post Scheduling", "Stories", "Hashtags", "DM Auto-Reply"],
      },
      {
        id: "newsletter-automator",
        name: "Newsletter Automator",
        shortDesc: "AI-powered email campaigns",
        goodFor: "Content Creators",
        price: "149",
        originalPrice: "179",
        type: "month",
        rating: 4.8,
        reviews: 78,
        integrations: ["Mailchimp", "ConvertKit", "OpenAI", "Notion"],
        features: ["AI Content", "Segmentation", "A/B Testing", "Analytics"],
      },
      {
        id: "multi-platform",
        name: "Multi-Platform Scheduler",
        shortDesc: "Post to all platforms at once",
        goodFor: "Marketing Teams",
        price: "169",
        originalPrice: "203",
        type: "month",
        new: true,
        rating: 4.9,
        reviews: 23,
        integrations: ["All Social", "Canva", "Google Drive", "Analytics"],
        features: ["Bulk Scheduling", "Content Calendar", "Analytics", "Team"],
      },
    ],
  },
  {
    id: "ecommerce",
    name: "E-Commerce",
    icon: "🛒",
    color: "#96BF48",
    description: "Shopify, WooCommerce, Amazon automation",
    highlight: true,
    bots: [
      {
        id: "shopify-automator",
        name: "Shopify Automator",
        shortDesc: "Complete Shopify automation",
        goodFor: "E-Commerce, DTC",
        price: "199",
        originalPrice: "239",
        type: "month",
        popular: true,
        trending: true,
        rating: 4.9,
        reviews: 234,
        integrations: ["Shopify", "Klaviyo", "Google Sheets", "Slack"],
        features: ["Order Sync", "Inventory Alerts", "Customer Tags", "Reports"],
      },
      {
        id: "woocommerce-connector",
        name: "WooCommerce Connector",
        shortDesc: "WordPress shop automation",
        goodFor: "WordPress Shops",
        price: "149",
        originalPrice: "179",
        type: "month",
        rating: 4.6,
        reviews: 89,
        integrations: ["WooCommerce", "WordPress", "Email", "Analytics"],
        features: ["Order Processing", "Stock Sync", "Customer Emails", "Reports"],
      },
      {
        id: "inventory-manager",
        name: "Inventory Manager",
        shortDesc: "Multi-channel inventory sync",
        goodFor: "Multi-Channel Sellers",
        price: "179",
        originalPrice: "215",
        type: "month",
        rating: 4.7,
        reviews: 67,
        integrations: ["Shopify", "Amazon", "eBay", "Google Sheets"],
        features: ["Stock Sync", "Low Stock Alerts", "Reorder Points", "Reports"],
      },
      {
        id: "cart-recovery",
        name: "Cart Recovery Bot",
        shortDesc: "Recover abandoned carts",
        goodFor: "E-Commerce",
        price: "159",
        originalPrice: "191",
        type: "month",
        trending: true,
        rating: 4.8,
        reviews: 156,
        integrations: ["Shopify", "Klaviyo", "SMS", "Email"],
        features: ["Auto-Emails", "SMS Reminders", "Discount Codes", "Analytics"],
      },
      {
        id: "review-collector",
        name: "Review Collector",
        shortDesc: "Automated review collection",
        goodFor: "E-Commerce Brands",
        price: "129",
        originalPrice: "155",
        type: "month",
        rating: 4.5,
        reviews: 78,
        integrations: ["Shopify", "Trustpilot", "Email", "SMS"],
        features: ["Review Requests", "Photo Reviews", "Incentives", "Moderation"],
      },
      {
        id: "amazon-seller",
        name: "Amazon Seller Bot",
        shortDesc: "FBA & seller automation",
        goodFor: "Amazon Sellers",
        price: "189",
        originalPrice: "227",
        type: "month",
        new: true,
        rating: 4.7,
        reviews: 34,
        integrations: ["Amazon", "Google Sheets", "Slack", "Email"],
        features: ["Inventory Sync", "Repricing", "Reviews", "Reports"],
      },
    ],
  },
  {
    id: "scheduling",
    name: "Scheduling & Booking",
    icon: "📅",
    color: "#7C3AED",
    description: "Calendly, booking, appointments",
    bots: [
      {
        id: "calendly-automator",
        name: "Calendly Automator",
        shortDesc: "Enhanced Calendly workflows",
        goodFor: "Sales, Consultants",
        price: "119",
        originalPrice: "143",
        type: "month",
        popular: true,
        rating: 4.8,
        reviews: 189,
        integrations: ["Calendly", "HubSpot", "Zoom", "Slack"],
        features: ["Auto-Reminders", "CRM Sync", "Follow-ups", "Analytics"],
      },
      {
        id: "booking-manager",
        name: "Booking Manager",
        shortDesc: "Complete booking system",
        goodFor: "Service Businesses",
        price: "149",
        originalPrice: "179",
        type: "month",
        rating: 4.7,
        reviews: 78,
        integrations: ["Cal.com", "Google Calendar", "Stripe", "Email"],
        features: ["Online Booking", "Payments", "Reminders", "Rescheduling"],
      },
      {
        id: "smart-scheduler",
        name: "Smart Meeting Scheduler",
        shortDesc: "AI-powered scheduling",
        goodFor: "Executives, Teams",
        price: "139",
        originalPrice: "167",
        type: "month",
        new: true,
        rating: 4.9,
        reviews: 23,
        integrations: ["Google Calendar", "Outlook", "Slack", "OpenAI"],
        features: ["AI Scheduling", "Time Zone Magic", "Conflicts", "Preferences"],
      },
      {
        id: "appointment-reminder",
        name: "Appointment Reminder",
        shortDesc: "Automated reminders",
        goodFor: "Healthcare, Services",
        price: "99",
        originalPrice: "119",
        type: "month",
        rating: 4.6,
        reviews: 145,
        integrations: ["Calendar", "SMS", "Email", "WhatsApp"],
        features: ["Multi-Channel", "Confirmations", "No-Show Tracking", "Reports"],
      },
    ],
  },
  {
    id: "customer-support",
    name: "Customer Support",
    icon: "🎫",
    color: "#F59E0B",
    description: "Zendesk, Intercom, helpdesk",
    bots: [
      {
        id: "zendesk-automator",
        name: "Zendesk Automator",
        shortDesc: "Automated ticket management",
        goodFor: "Support Teams",
        price: "179",
        originalPrice: "215",
        type: "month",
        popular: true,
        rating: 4.8,
        reviews: 167,
        integrations: ["Zendesk", "OpenAI", "Slack", "Email"],
        features: ["Auto-Triage", "AI Responses", "Escalation", "SLA Tracking"],
      },
      {
        id: "intercom-enhancer",
        name: "Intercom Enhancer",
        shortDesc: "Supercharge Intercom",
        goodFor: "SaaS, Support",
        price: "169",
        originalPrice: "203",
        type: "month",
        rating: 4.7,
        reviews: 89,
        integrations: ["Intercom", "OpenAI", "Slack", "CRM"],
        features: ["AI Chatbot", "Lead Routing", "Custom Bots", "Analytics"],
      },
      {
        id: "freshdesk-connector",
        name: "Freshdesk Connector",
        shortDesc: "Freshdesk automation",
        goodFor: "Support Teams",
        price: "149",
        originalPrice: "179",
        type: "month",
        rating: 4.6,
        reviews: 56,
        integrations: ["Freshdesk", "Email", "Chat", "Phone"],
        features: ["Ticket Routing", "SLA Rules", "Canned Responses", "Reports"],
      },
      {
        id: "knowledge-base",
        name: "Knowledge Base Bot",
        shortDesc: "AI-powered KB assistant",
        goodFor: "Support, Documentation",
        price: "159",
        originalPrice: "191",
        type: "month",
        trending: true,
        rating: 4.9,
        reviews: 45,
        integrations: ["OpenAI", "Notion", "Confluence", "Zendesk"],
        features: ["AI Search", "Auto-Suggest", "Gap Analysis", "Updates"],
      },
    ],
  },
  {
    id: "hr-recruiting",
    name: "HR & Recruiting",
    icon: "👥",
    color: "#06B6D4",
    description: "Onboarding, recruiting, HR automation",
    bots: [
      {
        id: "recruiting-automator",
        name: "Recruiting Automator",
        shortDesc: "Automated candidate sourcing",
        goodFor: "HR, Recruiters",
        price: "179",
        originalPrice: "215",
        type: "month",
        popular: true,
        rating: 4.7,
        reviews: 89,
        integrations: ["LinkedIn", "Greenhouse", "Email", "Calendar"],
        features: ["Sourcing", "Screening", "Scheduling", "Analytics"],
      },
      {
        id: "onboarding-bot",
        name: "Onboarding Bot",
        shortDesc: "Automated employee onboarding",
        goodFor: "HR Teams",
        price: "149",
        originalPrice: "179",
        type: "month",
        rating: 4.8,
        reviews: 67,
        integrations: ["Slack", "Notion", "Google Workspace", "BambooHR"],
        features: ["Task Lists", "Document Collection", "Training", "Check-ins"],
      },
      {
        id: "employee-engagement",
        name: "Employee Engagement Bot",
        shortDesc: "Boost team morale",
        goodFor: "HR, Managers",
        price: "129",
        originalPrice: "155",
        type: "month",
        new: true,
        rating: 4.6,
        reviews: 34,
        integrations: ["Slack", "MS Teams", "Google Forms", "Analytics"],
        features: ["Pulse Surveys", "Recognition", "Feedback", "Analytics"],
      },
      {
        id: "timeoff-manager",
        name: "Time Off Manager",
        shortDesc: "Leave request automation",
        goodFor: "HR, Teams",
        price: "99",
        originalPrice: "119",
        type: "month",
        rating: 4.5,
        reviews: 112,
        integrations: ["Slack", "Calendar", "BambooHR", "Email"],
        features: ["Requests", "Approvals", "Calendar Sync", "Reports"],
      },
    ],
  },
  {
    id: "project-management",
    name: "Project Management",
    icon: "📋",
    color: "#6366F1",
    description: "Notion, Asana, Jira automation",
    bots: [
      {
        id: "notion-automator",
        name: "Notion Automator",
        shortDesc: "Automated Notion workflows",
        goodFor: "Teams, PMs",
        price: "129",
        originalPrice: "155",
        type: "month",
        popular: true,
        trending: true,
        rating: 4.9,
        reviews: 234,
        integrations: ["Notion", "Slack", "Google Calendar", "Email"],
        features: ["Database Sync", "Templates", "Reminders", "Reports"],
      },
      {
        id: "asana-connector",
        name: "Asana Connector",
        shortDesc: "Asana workflow automation",
        goodFor: "Project Teams",
        price: "139",
        originalPrice: "167",
        type: "month",
        rating: 4.7,
        reviews: 89,
        integrations: ["Asana", "Slack", "Google Drive", "Email"],
        features: ["Task Automation", "Reports", "Reminders", "Sync"],
      },
      {
        id: "jira-automator",
        name: "Jira Automator",
        shortDesc: "Advanced Jira automation",
        goodFor: "Dev Teams",
        price: "149",
        originalPrice: "179",
        type: "month",
        rating: 4.6,
        reviews: 156,
        integrations: ["Jira", "Slack", "GitHub", "Confluence"],
        features: ["Sprint Reports", "Auto-Assign", "Notifications", "Sync"],
      },
      {
        id: "trello-enhancer",
        name: "Trello Enhancer",
        shortDesc: "Supercharge Trello boards",
        goodFor: "Small Teams",
        price: "99",
        originalPrice: "119",
        type: "month",
        rating: 4.5,
        reviews: 78,
        integrations: ["Trello", "Slack", "Google Calendar", "Email"],
        features: ["Card Automation", "Reports", "Reminders", "Power-Ups"],
      },
      {
        id: "monday-connector",
        name: "Monday.com Connector",
        shortDesc: "Monday automation",
        goodFor: "Teams",
        price: "139",
        originalPrice: "167",
        type: "month",
        new: true,
        rating: 4.8,
        reviews: 23,
        integrations: ["Monday", "Slack", "Google Drive", "CRM"],
        features: ["Automations", "Reports", "Integrations", "Templates"],
      },
    ],
  },
  {
    id: "devops",
    name: "DevOps & CI/CD",
    icon: "⚙️",
    color: "#EF4444",
    description: "GitHub, GitLab, deployment automation",
    bots: [
      {
        id: "github-automator",
        name: "GitHub Automator",
        shortDesc: "GitHub workflow automation",
        goodFor: "Dev Teams",
        price: "149",
        originalPrice: "179",
        type: "month",
        popular: true,
        rating: 4.8,
        reviews: 189,
        integrations: ["GitHub", "Slack", "Jira", "Discord"],
        features: ["PR Automation", "Issue Triage", "CI/CD", "Reports"],
      },
      {
        id: "gitlab-connector",
        name: "GitLab Connector",
        shortDesc: "GitLab pipeline automation",
        goodFor: "Dev Teams",
        price: "139",
        originalPrice: "167",
        type: "month",
        rating: 4.7,
        reviews: 78,
        integrations: ["GitLab", "Slack", "Jira", "Email"],
        features: ["Pipeline Triggers", "MR Automation", "Reports", "Alerts"],
      },
      {
        id: "deploy-bot",
        name: "Deploy Bot",
        shortDesc: "Automated deployments",
        goodFor: "DevOps",
        price: "169",
        originalPrice: "203",
        type: "month",
        rating: 4.9,
        reviews: 56,
        integrations: ["GitHub", "AWS", "Vercel", "Slack"],
        features: ["Auto Deploy", "Rollbacks", "Notifications", "Logs"],
      },
      {
        id: "monitoring-bot",
        name: "Monitoring Bot",
        shortDesc: "Infrastructure monitoring",
        goodFor: "DevOps, SRE",
        price: "159",
        originalPrice: "191",
        type: "month",
        trending: true,
        rating: 4.8,
        reviews: 67,
        integrations: ["Datadog", "PagerDuty", "Slack", "Email"],
        features: ["Alerts", "Incidents", "Reports", "Escalation"],
      },
    ],
  },
  {
    id: "data-integration",
    name: "Data & Integration",
    icon: "🔄",
    color: "#8B5CF6",
    description: "ETL, sync, data pipelines",
    bots: [
      {
        id: "data-sync",
        name: "Data Sync Bot",
        shortDesc: "Multi-system data sync",
        goodFor: "Data Teams",
        price: "179",
        originalPrice: "215",
        type: "month",
        popular: true,
        rating: 4.7,
        reviews: 89,
        integrations: ["Airtable", "Google Sheets", "Database", "API"],
        features: ["Real-time Sync", "Transformations", "Scheduling", "Logs"],
      },
      {
        id: "api-connector",
        name: "API Connector",
        shortDesc: "Connect any API",
        goodFor: "Developers",
        price: "149",
        originalPrice: "179",
        type: "month",
        rating: 4.8,
        reviews: 67,
        integrations: ["Any REST API", "GraphQL", "Webhook", "Database"],
        features: ["Custom Requests", "Auth", "Transformations", "Scheduling"],
      },
      {
        id: "airtable-automator",
        name: "Airtable Automator",
        shortDesc: "Advanced Airtable automation",
        goodFor: "Teams, Ops",
        price: "129",
        originalPrice: "155",
        type: "month",
        trending: true,
        rating: 4.9,
        reviews: 145,
        integrations: ["Airtable", "Slack", "Google Sheets", "Email"],
        features: ["Record Automation", "Views", "Reports", "Sync"],
      },
      {
        id: "database-connector",
        name: "Database Connector",
        shortDesc: "SQL/NoSQL automation",
        goodFor: "Data Engineers",
        price: "169",
        originalPrice: "203",
        type: "month",
        rating: 4.6,
        reviews: 45,
        integrations: ["PostgreSQL", "MongoDB", "MySQL", "Redis"],
        features: ["Queries", "Sync", "Backups", "Alerts"],
      },
    ],
  },
  {
    id: "finance",
    name: "Finance & Accounting",
    icon: "💰",
    color: "#10B981",
    description: "Invoicing, expenses, reports",
    bots: [
      {
        id: "invoice-automator",
        name: "Invoice Automator",
        shortDesc: "Automated invoicing",
        goodFor: "Finance, Freelancers",
        price: "129",
        originalPrice: "155",
        type: "month",
        popular: true,
        rating: 4.8,
        reviews: 167,
        integrations: ["Stripe", "QuickBooks", "Email", "Google Sheets"],
        features: ["Auto-Generate", "Reminders", "Payment Links", "Reports"],
      },
      {
        id: "expense-tracker",
        name: "Expense Tracker",
        shortDesc: "Automated expense management",
        goodFor: "Teams, Finance",
        price: "119",
        originalPrice: "143",
        type: "month",
        rating: 4.7,
        reviews: 89,
        integrations: ["Receipt Bank", "QuickBooks", "Slack", "Email"],
        features: ["Receipt Scanning", "Categorization", "Approvals", "Reports"],
      },
      {
        id: "quickbooks-connector",
        name: "QuickBooks Connector",
        shortDesc: "QuickBooks automation",
        goodFor: "Accountants",
        price: "149",
        originalPrice: "179",
        type: "month",
        rating: 4.6,
        reviews: 78,
        integrations: ["QuickBooks", "Stripe", "Bank", "Email"],
        features: ["Sync", "Reconciliation", "Reports", "Alerts"],
      },
      {
        id: "financial-reports",
        name: "Financial Reports Bot",
        shortDesc: "Automated financial reporting",
        goodFor: "CFOs, Finance",
        price: "179",
        originalPrice: "215",
        type: "month",
        new: true,
        rating: 4.9,
        reviews: 34,
        integrations: ["QuickBooks", "Xero", "Google Sheets", "Email"],
        features: ["P&L", "Cash Flow", "Forecasts", "Dashboards"],
      },
    ],
  },
  {
    id: "analytics",
    name: "Analytics & Reporting",
    icon: "📈",
    color: "#EC4899",
    description: "Dashboards, metrics, insights",
    bots: [
      {
        id: "analytics-dashboard",
        name: "Analytics Dashboard",
        shortDesc: "Automated dashboards",
        goodFor: "Managers, Analysts",
        price: "159",
        originalPrice: "191",
        type: "month",
        popular: true,
        rating: 4.8,
        reviews: 123,
        integrations: ["Google Analytics", "Mixpanel", "Slack", "Email"],
        features: ["Auto-Reports", "Alerts", "Visualizations", "Sharing"],
      },
      {
        id: "kpi-tracker",
        name: "KPI Tracker",
        shortDesc: "Track key metrics",
        goodFor: "Leaders, Teams",
        price: "129",
        originalPrice: "155",
        type: "month",
        rating: 4.7,
        reviews: 89,
        integrations: ["Multiple Sources", "Slack", "Google Sheets", "Email"],
        features: ["Scorecards", "Alerts", "Trends", "Forecasts"],
      },
      {
        id: "custom-reports",
        name: "Custom Reports Bot",
        shortDesc: "AI-generated reports",
        goodFor: "Analysts",
        price: "149",
        originalPrice: "179",
        type: "month",
        trending: true,
        rating: 4.9,
        reviews: 56,
        integrations: ["Any Data Source", "OpenAI", "Google Sheets", "Email"],
        features: ["AI Insights", "Scheduling", "Templates", "Export"],
      },
      {
        id: "seo-tracker",
        name: "SEO Tracker",
        shortDesc: "SEO monitoring automation",
        goodFor: "Marketing, SEO",
        price: "139",
        originalPrice: "167",
        type: "month",
        rating: 4.6,
        reviews: 78,
        integrations: ["Google Search Console", "Ahrefs", "Slack", "Email"],
        features: ["Rankings", "Backlinks", "Alerts", "Reports"],
      },
    ],
  },
  {
    id: "forms-surveys",
    name: "Forms & Surveys",
    icon: "📝",
    color: "#14B8A6",
    description: "Typeform, Google Forms, survey automation",
    bots: [
      {
        id: "typeform-automator",
        name: "Typeform Automator",
        shortDesc: "Automated Typeform processing",
        goodFor: "Marketing, HR",
        price: "119",
        originalPrice: "143",
        type: "month",
        popular: true,
        rating: 4.8,
        reviews: 134,
        integrations: ["Typeform", "Google Sheets", "Slack", "CRM"],
        features: ["Auto-Process", "Lead Routing", "Notifications", "Reports"],
      },
      {
        id: "jotform-connector",
        name: "JotForm Connector",
        shortDesc: "JotForm workflow automation",
        goodFor: "Forms, Data Collection",
        price: "99",
        originalPrice: "119",
        type: "month",
        rating: 4.6,
        reviews: 67,
        integrations: ["JotForm", "Google Sheets", "Email", "CRM"],
        features: ["Auto-Process", "PDF Generation", "Notifications", "Sync"],
      },
      {
        id: "survey-aggregator",
        name: "Survey Aggregator",
        shortDesc: "Combine surveys from multiple sources",
        goodFor: "Research, Analytics",
        price: "149",
        originalPrice: "179",
        type: "month",
        new: true,
        rating: 4.7,
        reviews: 34,
        integrations: ["Typeform", "Google Forms", "SurveyMonkey", "Sheets"],
        features: ["Data Merge", "Analysis", "Reports", "Export"],
      },
      {
        id: "feedback-collector",
        name: "Feedback Collector",
        shortDesc: "Automated customer feedback",
        goodFor: "Customer Success",
        price: "129",
        originalPrice: "155",
        type: "month",
        rating: 4.5,
        reviews: 89,
        integrations: ["NPS Tools", "Email", "Slack", "CRM"],
        features: ["NPS Tracking", "Sentiment", "Alerts", "Reports"],
      },
    ],
  },
  {
    id: "legal-compliance",
    name: "Legal & Compliance",
    icon: "⚖️",
    color: "#64748B",
    description: "Contract management, GDPR, legal automation",
    bots: [
      {
        id: "contract-manager",
        name: "Contract Manager",
        shortDesc: "Automated contract workflows",
        goodFor: "Legal, Sales",
        price: "199",
        originalPrice: "239",
        type: "month",
        popular: true,
        rating: 4.9,
        reviews: 78,
        integrations: ["DocuSign", "PandaDoc", "Google Drive", "CRM"],
        features: ["Templates", "E-Signature", "Reminders", "Archive"],
      },
      {
        id: "gdpr-automator",
        name: "GDPR Automator",
        shortDesc: "GDPR compliance automation",
        goodFor: "Legal, IT",
        price: "179",
        originalPrice: "215",
        type: "month",
        trending: true,
        rating: 4.8,
        reviews: 56,
        integrations: ["Forms", "Email", "Database", "CRM"],
        features: ["Consent Mgmt", "Data Requests", "Audit Trail", "Reports"],
      },
      {
        id: "nda-processor",
        name: "NDA Processor",
        shortDesc: "Automated NDA handling",
        goodFor: "Legal, HR",
        price: "149",
        originalPrice: "179",
        type: "month",
        rating: 4.6,
        reviews: 45,
        integrations: ["DocuSign", "HelloSign", "Email", "Drive"],
        features: ["Templates", "Tracking", "Reminders", "Archive"],
      },
      {
        id: "compliance-checker",
        name: "Compliance Checker",
        shortDesc: "Automated compliance monitoring",
        goodFor: "Compliance Teams",
        price: "189",
        originalPrice: "227",
        type: "month",
        limited: true,
        rating: 4.7,
        reviews: 34,
        integrations: ["Multiple Sources", "Slack", "Email", "Reports"],
        features: ["Policy Checks", "Alerts", "Audit Logs", "Dashboards"],
      },
    ],
  },
  {
    id: "real-estate",
    name: "Real Estate",
    icon: "🏠",
    color: "#D97706",
    description: "Property management, lead generation",
    bots: [
      {
        id: "property-lead-bot",
        name: "Property Lead Bot",
        shortDesc: "Real estate lead automation",
        goodFor: "Agents, Brokers",
        price: "169",
        originalPrice: "203",
        type: "month",
        popular: true,
        rating: 4.8,
        reviews: 112,
        integrations: ["Zillow", "Realtor", "CRM", "Email"],
        features: ["Lead Capture", "Auto-Response", "Qualification", "CRM Sync"],
      },
      {
        id: "rental-manager",
        name: "Rental Manager",
        shortDesc: "Rental property automation",
        goodFor: "Property Managers",
        price: "149",
        originalPrice: "179",
        type: "month",
        rating: 4.6,
        reviews: 67,
        integrations: ["Airbnb", "VRBO", "Calendar", "Accounting"],
        features: ["Booking Sync", "Guest Comms", "Pricing", "Reports"],
      },
      {
        id: "showing-scheduler",
        name: "Showing Scheduler",
        shortDesc: "Automated property showings",
        goodFor: "Real Estate Agents",
        price: "119",
        originalPrice: "143",
        type: "month",
        new: true,
        rating: 4.7,
        reviews: 45,
        integrations: ["Calendar", "Email", "SMS", "CRM"],
        features: ["Auto-Schedule", "Reminders", "Follow-ups", "Feedback"],
      },
      {
        id: "listing-syncer",
        name: "Listing Syncer",
        shortDesc: "Multi-platform listing sync",
        goodFor: "Agents, Brokers",
        price: "139",
        originalPrice: "167",
        type: "month",
        rating: 4.5,
        reviews: 56,
        integrations: ["MLS", "Zillow", "Realtor", "Social"],
        features: ["Auto-Post", "Updates", "Analytics", "Multi-Platform"],
      },
    ],
  },
  {
    id: "healthcare",
    name: "Healthcare",
    icon: "🏥",
    color: "#059669",
    description: "Patient engagement, appointment automation",
    bots: [
      {
        id: "patient-reminder",
        name: "Patient Reminder",
        shortDesc: "Automated appointment reminders",
        goodFor: "Clinics, Practices",
        price: "129",
        originalPrice: "155",
        type: "month",
        popular: true,
        rating: 4.9,
        reviews: 189,
        integrations: ["EHR", "Calendar", "SMS", "Email"],
        features: ["Multi-Channel", "Confirmations", "Rescheduling", "No-Shows"],
      },
      {
        id: "patient-followup",
        name: "Patient Follow-up",
        shortDesc: "Post-visit patient engagement",
        goodFor: "Healthcare Providers",
        price: "149",
        originalPrice: "179",
        type: "month",
        rating: 4.7,
        reviews: 78,
        integrations: ["EHR", "Email", "SMS", "Survey"],
        features: ["Auto-Messages", "Surveys", "Medication Reminders", "Reports"],
      },
      {
        id: "intake-processor",
        name: "Intake Processor",
        shortDesc: "Patient intake automation",
        goodFor: "Medical Offices",
        price: "159",
        originalPrice: "191",
        type: "month",
        trending: true,
        rating: 4.8,
        reviews: 56,
        integrations: ["Forms", "EHR", "Insurance", "Email"],
        features: ["Digital Forms", "Verification", "Pre-Visit", "Sync"],
      },
      {
        id: "prescription-tracker",
        name: "Prescription Tracker",
        shortDesc: "Medication reminder system",
        goodFor: "Pharmacies, Clinics",
        price: "119",
        originalPrice: "143",
        type: "month",
        rating: 4.6,
        reviews: 67,
        integrations: ["Pharmacy Systems", "SMS", "Email", "Calendar"],
        features: ["Refill Reminders", "Adherence", "Notifications", "Reports"],
      },
    ],
  },
  {
    id: "education",
    name: "Education & E-Learning",
    icon: "🎓",
    color: "#7C3AED",
    description: "Course automation, student engagement",
    bots: [
      {
        id: "course-reminder",
        name: "Course Reminder",
        shortDesc: "Student engagement automation",
        goodFor: "Online Courses",
        price: "119",
        originalPrice: "143",
        type: "month",
        popular: true,
        rating: 4.8,
        reviews: 145,
        integrations: ["Teachable", "Thinkific", "Email", "Slack"],
        features: ["Progress Reminders", "Deadlines", "Engagement", "Completion"],
      },
      {
        id: "assignment-tracker",
        name: "Assignment Tracker",
        shortDesc: "Homework & assignment automation",
        goodFor: "Schools, Universities",
        price: "99",
        originalPrice: "119",
        type: "month",
        rating: 4.6,
        reviews: 89,
        integrations: ["LMS", "Google Classroom", "Email", "Slack"],
        features: ["Deadlines", "Reminders", "Grading Alerts", "Reports"],
      },
      {
        id: "enrollment-bot",
        name: "Enrollment Bot",
        shortDesc: "Course enrollment automation",
        goodFor: "E-Learning Platforms",
        price: "149",
        originalPrice: "179",
        type: "month",
        new: true,
        rating: 4.7,
        reviews: 34,
        integrations: ["LMS", "Stripe", "Email", "CRM"],
        features: ["Auto-Enroll", "Welcome Sequence", "Onboarding", "Upsells"],
      },
      {
        id: "certificate-generator",
        name: "Certificate Generator",
        shortDesc: "Automated certificate creation",
        goodFor: "Training, Courses",
        price: "109",
        originalPrice: "131",
        type: "month",
        rating: 4.5,
        reviews: 67,
        integrations: ["LMS", "PDF", "Email", "LinkedIn"],
        features: ["Auto-Generate", "Verification", "Delivery", "Tracking"],
      },
    ],
  },
  {
    id: "crypto-trading",
    name: "Crypto & Trading",
    icon: "📈",
    color: "#F59E0B",
    description: "Price alerts, portfolio tracking, trading signals",
    highlight: true,
    bots: [
      {
        id: "crypto-alert-bot",
        name: "Crypto Alert Bot",
        shortDesc: "Real-time price alerts",
        goodFor: "Traders, Investors",
        price: "99",
        originalPrice: "119",
        type: "month",
        popular: true,
        trending: true,
        rating: 4.9,
        reviews: 234,
        integrations: ["Binance", "Coinbase", "Telegram", "Email"],
        features: ["Price Alerts", "Volume Alerts", "Multi-Exchange", "Custom Rules"],
      },
      {
        id: "portfolio-tracker",
        name: "Portfolio Tracker",
        shortDesc: "Multi-exchange portfolio tracking",
        goodFor: "Crypto Investors",
        price: "129",
        originalPrice: "155",
        type: "month",
        rating: 4.8,
        reviews: 167,
        integrations: ["Multiple Exchanges", "Wallets", "Sheets", "Telegram"],
        features: ["Balance Sync", "P&L Tracking", "Reports", "Alerts"],
      },
      {
        id: "dca-automator",
        name: "DCA Automator",
        shortDesc: "Dollar-cost averaging automation",
        goodFor: "Long-term Investors",
        price: "149",
        originalPrice: "179",
        type: "month",
        new: true,
        rating: 4.7,
        reviews: 78,
        integrations: ["Exchanges", "Bank", "Calendar", "Telegram"],
        features: ["Scheduled Buys", "Multi-Asset", "Reports", "Notifications"],
      },
      {
        id: "trading-signals",
        name: "Trading Signals Bot",
        shortDesc: "Technical analysis signals",
        goodFor: "Active Traders",
        price: "179",
        originalPrice: "215",
        type: "month",
        limited: true,
        rating: 4.6,
        reviews: 89,
        integrations: ["TradingView", "Telegram", "Discord", "Email"],
        features: ["TA Signals", "Multiple TFs", "Backtesting", "Alerts"],
      },
      {
        id: "nft-tracker",
        name: "NFT Tracker",
        shortDesc: "NFT portfolio & floor tracking",
        goodFor: "NFT Collectors",
        price: "119",
        originalPrice: "143",
        type: "month",
        rating: 4.5,
        reviews: 56,
        integrations: ["OpenSea", "Blur", "Telegram", "Discord"],
        features: ["Floor Alerts", "Sales Tracking", "Rarity", "Notifications"],
      },
    ],
  },
  {
    id: "security-monitoring",
    name: "Security & Monitoring",
    icon: "🔒",
    color: "#DC2626",
    description: "Website monitoring, security alerts, uptime",
    bots: [
      {
        id: "uptime-monitor",
        name: "Uptime Monitor",
        shortDesc: "Website uptime monitoring",
        goodFor: "DevOps, Website Owners",
        price: "79",
        originalPrice: "95",
        type: "month",
        popular: true,
        rating: 4.9,
        reviews: 289,
        integrations: ["HTTP", "Slack", "PagerDuty", "Email"],
        features: ["Multi-Location", "SSL Check", "Response Time", "Alerts"],
      },
      {
        id: "security-scanner",
        name: "Security Scanner",
        shortDesc: "Automated security scanning",
        goodFor: "Security Teams",
        price: "169",
        originalPrice: "203",
        type: "month",
        trending: true,
        rating: 4.8,
        reviews: 78,
        integrations: ["Multiple Sources", "Slack", "Jira", "Email"],
        features: ["Vulnerability Scan", "CVE Alerts", "Reports", "Remediation"],
      },
      {
        id: "ssl-watcher",
        name: "SSL Watcher",
        shortDesc: "SSL certificate monitoring",
        goodFor: "IT Teams",
        price: "59",
        originalPrice: "71",
        type: "month",
        rating: 4.7,
        reviews: 145,
        integrations: ["Websites", "Slack", "Email", "PagerDuty"],
        features: ["Expiry Alerts", "Multi-Domain", "Auto-Renew", "Reports"],
      },
      {
        id: "backup-monitor",
        name: "Backup Monitor",
        shortDesc: "Backup verification & alerts",
        goodFor: "IT, DevOps",
        price: "99",
        originalPrice: "119",
        type: "month",
        rating: 4.6,
        reviews: 67,
        integrations: ["AWS", "GCP", "Slack", "Email"],
        features: ["Backup Checks", "Size Tracking", "Integrity", "Alerts"],
      },
    ],
  },
  {
    id: "document-management",
    name: "Document Management",
    icon: "📄",
    color: "#0891B2",
    description: "PDF processing, signatures, document workflows",
    bots: [
      {
        id: "pdf-processor",
        name: "PDF Processor",
        shortDesc: "Automated PDF workflows",
        goodFor: "Operations, Admin",
        price: "119",
        originalPrice: "143",
        type: "month",
        popular: true,
        rating: 4.7,
        reviews: 123,
        integrations: ["PDF Tools", "Google Drive", "Dropbox", "Email"],
        features: ["Merge", "Split", "Convert", "OCR"],
      },
      {
        id: "signature-automator",
        name: "Signature Automator",
        shortDesc: "E-signature workflow automation",
        goodFor: "Sales, Legal",
        price: "149",
        originalPrice: "179",
        type: "month",
        rating: 4.8,
        reviews: 89,
        integrations: ["DocuSign", "HelloSign", "CRM", "Email"],
        features: ["Template Send", "Reminders", "Status Tracking", "Archive"],
      },
      {
        id: "invoice-extractor",
        name: "Invoice Extractor",
        shortDesc: "AI invoice data extraction",
        goodFor: "Accounting, AP",
        price: "159",
        originalPrice: "191",
        type: "month",
        trending: true,
        rating: 4.9,
        reviews: 67,
        integrations: ["Email", "OCR", "QuickBooks", "Xero"],
        features: ["AI Extraction", "Validation", "Auto-Entry", "Reports"],
      },
      {
        id: "document-router",
        name: "Document Router",
        shortDesc: "Intelligent document routing",
        goodFor: "Operations",
        price: "129",
        originalPrice: "155",
        type: "month",
        new: true,
        rating: 4.6,
        reviews: 45,
        integrations: ["Email", "Drive", "Slack", "Teams"],
        features: ["Auto-Classify", "Routing Rules", "Notifications", "Archive"],
      },
    ],
  },
  {
    id: "video-content",
    name: "Video & Content",
    icon: "🎬",
    color: "#BE185D",
    description: "YouTube, video processing, content automation",
    bots: [
      {
        id: "youtube-automator",
        name: "YouTube Automator",
        shortDesc: "YouTube channel automation",
        goodFor: "YouTubers, Creators",
        price: "149",
        originalPrice: "179",
        type: "month",
        popular: true,
        rating: 4.8,
        reviews: 178,
        integrations: ["YouTube", "Thumbnail AI", "Social", "Email"],
        features: ["Upload Scheduler", "SEO", "Cross-Post", "Analytics"],
      },
      {
        id: "podcast-distributor",
        name: "Podcast Distributor",
        shortDesc: "Multi-platform podcast distribution",
        goodFor: "Podcasters",
        price: "119",
        originalPrice: "143",
        type: "month",
        rating: 4.7,
        reviews: 89,
        integrations: ["Spotify", "Apple", "RSS", "Social"],
        features: ["Auto-Distribute", "Transcription", "Show Notes", "Analytics"],
      },
      {
        id: "video-transcriber",
        name: "Video Transcriber",
        shortDesc: "Automated video transcription",
        goodFor: "Content Creators",
        price: "99",
        originalPrice: "119",
        type: "month",
        trending: true,
        rating: 4.9,
        reviews: 134,
        integrations: ["YouTube", "Vimeo", "Drive", "Notion"],
        features: ["AI Transcription", "Multi-Language", "Subtitles", "Export"],
      },
      {
        id: "content-repurposer",
        name: "Content Repurposer",
        shortDesc: "Turn videos into blog posts & social",
        goodFor: "Content Marketing",
        price: "169",
        originalPrice: "203",
        type: "month",
        new: true,
        rating: 4.8,
        reviews: 45,
        integrations: ["YouTube", "OpenAI", "WordPress", "Social"],
        features: ["AI Summary", "Blog Posts", "Social Clips", "Scheduling"],
      },
    ],
  },
  {
    id: "events-webinars",
    name: "Events & Webinars",
    icon: "🎪",
    color: "#4F46E5",
    description: "Event management, webinar automation",
    bots: [
      {
        id: "webinar-automator",
        name: "Webinar Automator",
        shortDesc: "Complete webinar automation",
        goodFor: "Marketers, Educators",
        price: "159",
        originalPrice: "191",
        type: "month",
        popular: true,
        rating: 4.8,
        reviews: 145,
        integrations: ["Zoom", "Webex", "Email", "CRM"],
        features: ["Registration", "Reminders", "Follow-ups", "Replay"],
      },
      {
        id: "event-registration",
        name: "Event Registration",
        shortDesc: "Event signup automation",
        goodFor: "Event Organizers",
        price: "129",
        originalPrice: "155",
        type: "month",
        rating: 4.7,
        reviews: 89,
        integrations: ["Eventbrite", "Stripe", "Email", "CRM"],
        features: ["Registration", "Tickets", "Check-in", "Follow-up"],
      },
      {
        id: "attendee-engager",
        name: "Attendee Engager",
        shortDesc: "Pre & post-event engagement",
        goodFor: "Event Marketing",
        price: "139",
        originalPrice: "167",
        type: "month",
        new: true,
        rating: 4.6,
        reviews: 56,
        integrations: ["Email", "SMS", "Social", "Survey"],
        features: ["Pre-Event", "Live Polls", "Networking", "Feedback"],
      },
      {
        id: "virtual-event-hub",
        name: "Virtual Event Hub",
        shortDesc: "Virtual event orchestration",
        goodFor: "Large Events",
        price: "199",
        originalPrice: "239",
        type: "month",
        trending: true,
        rating: 4.9,
        reviews: 34,
        integrations: ["Zoom", "Hopin", "Slack", "CRM"],
        features: ["Multi-Track", "Networking", "Sponsors", "Analytics"],
      },
    ],
  },
  {
    id: "ai-agents",
    name: "AI Agents",
    icon: "🤖",
    color: "#8B5CF6",
    description: "Autonomous AI agents for complex tasks",
    highlight: true,
    bots: [
      {
        id: "research-agent",
        name: "Research Agent Pro",
        shortDesc: "Autonomous web research agent",
        goodFor: "Research, Due Diligence",
        price: "279",
        originalPrice: "335",
        type: "month",
        popular: true,
        trending: true,
        rating: 4.9,
        reviews: 189,
        integrations: ["OpenAI", "Web", "Google", "Notion"],
        features: ["Multi-Source", "Fact-Check", "Citations", "Reports"],
      },
      {
        id: "sales-agent",
        name: "AI Sales Agent",
        shortDesc: "Autonomous lead engagement",
        goodFor: "Sales Teams",
        price: "299",
        originalPrice: "359",
        type: "month",
        popular: true,
        limited: true,
        rating: 4.8,
        reviews: 145,
        integrations: ["OpenAI", "LinkedIn", "Email", "CRM"],
        features: ["Outreach", "Follow-up", "Qualification", "Booking"],
      },
      {
        id: "support-agent",
        name: "AI Support Agent",
        shortDesc: "24/7 autonomous customer support",
        goodFor: "Support Teams",
        price: "249",
        originalPrice: "299",
        type: "month",
        trending: true,
        rating: 4.9,
        reviews: 234,
        integrations: ["OpenAI", "Zendesk", "Intercom", "Slack"],
        features: ["24/7 Active", "Multi-Language", "Escalation", "Learning"],
      },
      {
        id: "data-agent",
        name: "Data Agent",
        shortDesc: "Autonomous data processing",
        goodFor: "Data Teams",
        price: "229",
        originalPrice: "275",
        type: "month",
        new: true,
        rating: 4.7,
        reviews: 78,
        integrations: ["OpenAI", "PostgreSQL", "Sheets", "APIs"],
        features: ["ETL", "Cleaning", "Analysis", "Reporting"],
      },
      {
        id: "content-agent",
        name: "Content Agent",
        shortDesc: "Autonomous content creation",
        goodFor: "Marketing Teams",
        price: "219",
        originalPrice: "263",
        type: "month",
        rating: 4.8,
        reviews: 167,
        integrations: ["OpenAI", "WordPress", "Social", "Canva"],
        features: ["Blog Posts", "Social", "Images", "Scheduling"],
      },
      {
        id: "seo-agent",
        name: "SEO Agent",
        shortDesc: "Autonomous SEO optimization",
        goodFor: "Marketing, SEO",
        price: "239",
        originalPrice: "287",
        type: "month",
        trending: true,
        rating: 4.8,
        reviews: 123,
        integrations: ["OpenAI", "Ahrefs", "GSC", "WordPress"],
        features: ["Keyword Research", "Content Opt", "Backlinks", "Monitoring"],
      },
    ],
  },
  {
    id: "web-scraping",
    name: "Web Scraping & APIs",
    icon: "🕷️",
    color: "#0EA5E9",
    description: "Data extraction, API automation, webhooks",
    bots: [
      {
        id: "web-scraper",
        name: "Web Scraper Pro",
        shortDesc: "Intelligent web data extraction",
        goodFor: "Data Teams, Research",
        price: "149",
        originalPrice: "179",
        type: "month",
        popular: true,
        rating: 4.8,
        reviews: 234,
        integrations: ["Any Website", "Google Sheets", "Database", "API"],
        features: ["No-Code", "Anti-Block", "Scheduling", "Export"],
      },
      {
        id: "price-monitor",
        name: "Price Monitor",
        shortDesc: "Competitor price tracking",
        goodFor: "E-Commerce",
        price: "129",
        originalPrice: "155",
        type: "month",
        trending: true,
        rating: 4.7,
        reviews: 156,
        integrations: ["Any Website", "Sheets", "Slack", "Email"],
        features: ["Multi-Site", "Alerts", "History", "Reports"],
      },
      {
        id: "api-aggregator",
        name: "API Aggregator",
        shortDesc: "Combine multiple APIs into one",
        goodFor: "Developers",
        price: "169",
        originalPrice: "203",
        type: "month",
        rating: 4.6,
        reviews: 89,
        integrations: ["Any API", "Webhook", "Database", "Cache"],
        features: ["Multi-API", "Transform", "Cache", "Rate Limit"],
      },
      {
        id: "lead-scraper",
        name: "Lead Scraper",
        shortDesc: "Extract leads from directories",
        goodFor: "Sales, Marketing",
        price: "179",
        originalPrice: "215",
        type: "month",
        popular: true,
        limited: true,
        rating: 4.8,
        reviews: 189,
        integrations: ["Directories", "LinkedIn", "CRM", "Sheets"],
        features: ["Email Finder", "Enrichment", "Verification", "Export"],
      },
      {
        id: "news-aggregator",
        name: "News Aggregator",
        shortDesc: "Multi-source news monitoring",
        goodFor: "PR, Research",
        price: "119",
        originalPrice: "143",
        type: "month",
        rating: 4.5,
        reviews: 67,
        integrations: ["News Sites", "RSS", "Slack", "Email"],
        features: ["Multi-Source", "Keywords", "Alerts", "Digest"],
      },
      {
        id: "webhook-hub",
        name: "Webhook Hub",
        shortDesc: "Central webhook management",
        goodFor: "Developers, Ops",
        price: "99",
        originalPrice: "119",
        type: "month",
        new: true,
        rating: 4.6,
        reviews: 78,
        integrations: ["Any Webhook", "Slack", "Email", "Database"],
        features: ["Routing", "Transform", "Retry", "Logging"],
      },
    ],
  },
  {
    id: "no-code-automation",
    name: "No-Code Automation",
    icon: "⚡",
    color: "#F97316",
    description: "Build automations without coding",
    bots: [
      {
        id: "workflow-builder",
        name: "Workflow Builder",
        shortDesc: "Visual automation builder",
        goodFor: "Everyone",
        price: "99",
        originalPrice: "119",
        type: "month",
        popular: true,
        rating: 4.9,
        reviews: 456,
        integrations: ["500+ Apps", "Webhooks", "APIs", "Database"],
        features: ["Drag & Drop", "Templates", "Testing", "Versioning"],
      },
      {
        id: "form-to-workflow",
        name: "Form to Workflow",
        shortDesc: "Turn forms into automations",
        goodFor: "Operations",
        price: "79",
        originalPrice: "95",
        type: "month",
        rating: 4.7,
        reviews: 234,
        integrations: ["Any Form", "Email", "Sheets", "CRM"],
        features: ["Form Builder", "Logic", "Notifications", "Data"],
      },
      {
        id: "schedule-automator",
        name: "Schedule Automator",
        shortDesc: "Time-based automation",
        goodFor: "Everyone",
        price: "69",
        originalPrice: "83",
        type: "month",
        rating: 4.6,
        reviews: 189,
        integrations: ["Calendar", "Email", "Slack", "Any API"],
        features: ["Cron Jobs", "Time Zones", "Retries", "Logs"],
      },
      {
        id: "multi-step-workflow",
        name: "Multi-Step Workflow",
        shortDesc: "Complex multi-step automations",
        goodFor: "Power Users",
        price: "149",
        originalPrice: "179",
        type: "month",
        trending: true,
        rating: 4.8,
        reviews: 123,
        integrations: ["All Integrations", "Conditional", "Loops", "APIs"],
        features: ["Branching", "Loops", "Error Handling", "Monitoring"],
      },
    ],
  },
  {
    id: "viral-growth",
    name: "Viral & Growth Hacking",
    icon: "🚀",
    color: "#FF3366",
    description: "Explosive growth automation for viral content",
    highlight: true,
    bots: [
      {
        id: "tiktok-automator",
        name: "TikTok Automator",
        shortDesc: "Viral TikTok content machine",
        goodFor: "Creators, Brands",
        price: "199",
        originalPrice: "239",
        type: "month",
        popular: true,
        trending: true,
        rating: 4.9,
        reviews: 567,
        integrations: ["TikTok", "CapCut", "Canva", "OpenAI"],
        features: ["Trend Detection", "Auto-Post", "Hashtags", "Analytics"],
      },
      {
        id: "viral-predictor",
        name: "Viral Content Predictor",
        shortDesc: "AI predicts viral potential",
        goodFor: "Content Creators",
        price: "179",
        originalPrice: "215",
        type: "month",
        limited: true,
        rating: 4.8,
        reviews: 234,
        integrations: ["OpenAI", "Social APIs", "Analytics", "Trends"],
        features: ["Virality Score", "Best Times", "Hooks", "Optimization"],
      },
      {
        id: "influencer-hunter",
        name: "Influencer Hunter",
        shortDesc: "Find & outreach influencers automatically",
        goodFor: "Marketing, PR",
        price: "229",
        originalPrice: "275",
        type: "month",
        trending: true,
        rating: 4.7,
        reviews: 189,
        integrations: ["Instagram", "TikTok", "YouTube", "Email"],
        features: ["Discovery", "Fake Detection", "Outreach", "Tracking"],
      },
      {
        id: "meme-generator",
        name: "AI Meme Generator",
        shortDesc: "Trending memes on autopilot",
        goodFor: "Social Media",
        price: "99",
        originalPrice: "119",
        type: "month",
        new: true,
        rating: 4.6,
        reviews: 345,
        integrations: ["OpenAI", "Imgflip", "Reddit", "Twitter"],
        features: ["Trend Aware", "Brand Safe", "Multi-Format", "Scheduling"],
      },
      {
        id: "growth-hacker",
        name: "Growth Hacker Suite",
        shortDesc: "All-in-one growth automation",
        goodFor: "Startups, SaaS",
        price: "299",
        originalPrice: "359",
        type: "month",
        popular: true,
        rating: 4.9,
        reviews: 156,
        integrations: ["Product Hunt", "Twitter", "LinkedIn", "Email"],
        features: ["Launch Automation", "Referrals", "Viral Loops", "Analytics"],
      },
    ],
  },
  {
    id: "money-makers",
    name: "Money Making Machines",
    icon: "💰",
    color: "#22C55E",
    description: "Revenue-generating automation bots",
    highlight: true,
    bots: [
      {
        id: "dropship-automator",
        name: "Dropship Automator",
        shortDesc: "Full dropshipping automation",
        goodFor: "E-Commerce",
        price: "249",
        originalPrice: "299",
        type: "month",
        popular: true,
        trending: true,
        rating: 4.8,
        reviews: 456,
        integrations: ["Shopify", "AliExpress", "Oberlo", "Facebook"],
        features: ["Product Import", "Order Sync", "Price Sync", "Ads"],
      },
      {
        id: "affiliate-bot",
        name: "Affiliate Marketing Bot",
        shortDesc: "Passive income automation",
        goodFor: "Affiliates, Bloggers",
        price: "179",
        originalPrice: "215",
        type: "month",
        trending: true,
        rating: 4.7,
        reviews: 378,
        integrations: ["Amazon", "ClickBank", "WordPress", "Email"],
        features: ["Link Management", "Content", "Tracking", "Payouts"],
      },
      {
        id: "amazon-fba-bot",
        name: "Amazon FBA Bot",
        shortDesc: "FBA business automation",
        goodFor: "Amazon Sellers",
        price: "299",
        originalPrice: "359",
        type: "month",
        popular: true,
        limited: true,
        rating: 4.9,
        reviews: 234,
        integrations: ["Amazon", "Jungle Scout", "Helium 10", "Sheets"],
        features: ["Product Research", "Repricing", "Reviews", "Inventory"],
      },
      {
        id: "print-on-demand",
        name: "Print-on-Demand Bot",
        shortDesc: "POD store automation",
        goodFor: "Creators, E-Commerce",
        price: "149",
        originalPrice: "179",
        type: "month",
        rating: 4.6,
        reviews: 267,
        integrations: ["Printful", "Shopify", "Etsy", "Canva"],
        features: ["Design Upload", "Mockups", "Orders", "Multi-Store"],
      },
      {
        id: "crypto-arbitrage",
        name: "Crypto Arbitrage Bot",
        shortDesc: "Cross-exchange arbitrage",
        goodFor: "Traders",
        price: "399",
        originalPrice: "479",
        type: "month",
        limited: true,
        trending: true,
        rating: 4.8,
        reviews: 145,
        integrations: ["Binance", "Coinbase", "Kraken", "DEXs"],
        features: ["Price Scan", "Auto-Execute", "Risk Mgmt", "Profits"],
      },
      {
        id: "saas-revenue-bot",
        name: "SaaS Revenue Bot",
        shortDesc: "Maximize MRR automatically",
        goodFor: "SaaS Founders",
        price: "279",
        originalPrice: "335",
        type: "month",
        new: true,
        rating: 4.9,
        reviews: 89,
        integrations: ["Stripe", "Intercom", "Email", "Analytics"],
        features: ["Churn Prevention", "Upsells", "Dunning", "Expansion"],
      },
    ],
  },
  {
    id: "ai-creative",
    name: "AI Creative Studio",
    icon: "🎨",
    color: "#EC4899",
    description: "AI-powered creative content generation",
    bots: [
      {
        id: "ai-video-maker",
        name: "AI Video Maker",
        shortDesc: "Text to video in seconds",
        goodFor: "Marketing, Content",
        price: "199",
        originalPrice: "239",
        type: "month",
        popular: true,
        trending: true,
        rating: 4.8,
        reviews: 456,
        integrations: ["OpenAI", "Synthesia", "D-ID", "YouTube"],
        features: ["Text-to-Video", "Avatars", "Voiceover", "Multi-Lang"],
      },
      {
        id: "ai-voice-clone",
        name: "AI Voice Clone",
        shortDesc: "Clone any voice with AI",
        goodFor: "Podcasters, Content",
        price: "179",
        originalPrice: "215",
        type: "month",
        limited: true,
        rating: 4.7,
        reviews: 234,
        integrations: ["ElevenLabs", "Play.ht", "Podcast", "Video"],
        features: ["Voice Clone", "Multi-Lang", "Emotions", "Batch"],
      },
      {
        id: "ai-image-factory",
        name: "AI Image Factory",
        shortDesc: "Bulk AI image generation",
        goodFor: "E-Commerce, Marketing",
        price: "149",
        originalPrice: "179",
        type: "month",
        trending: true,
        rating: 4.9,
        reviews: 567,
        integrations: ["Midjourney", "DALL-E", "Stable Diffusion", "Canva"],
        features: ["Bulk Generate", "Product Photos", "Variations", "Upscale"],
      },
      {
        id: "ai-music-maker",
        name: "AI Music Maker",
        shortDesc: "Generate royalty-free music",
        goodFor: "Creators, Video",
        price: "129",
        originalPrice: "155",
        type: "month",
        new: true,
        rating: 4.6,
        reviews: 189,
        integrations: ["Suno", "Mubert", "YouTube", "Podcast"],
        features: ["Custom Music", "Stems", "Moods", "Commercial License"],
      },
      {
        id: "ai-avatar-creator",
        name: "AI Avatar Creator",
        shortDesc: "Realistic AI avatars",
        goodFor: "Marketing, HR",
        price: "169",
        originalPrice: "203",
        type: "month",
        trending: true,
        rating: 4.8,
        reviews: 234,
        integrations: ["HeyGen", "D-ID", "Synthesia", "Video"],
        features: ["Custom Avatars", "Lip Sync", "Gestures", "Multi-Lang"],
      },
      {
        id: "ai-ad-creative",
        name: "AI Ad Creative",
        shortDesc: "Generate winning ad creatives",
        goodFor: "Performance Marketing",
        price: "219",
        originalPrice: "263",
        type: "month",
        popular: true,
        rating: 4.9,
        reviews: 345,
        integrations: ["Meta", "Google", "TikTok", "Canva"],
        features: ["A/B Variants", "Copy", "Images", "Performance AI"],
      },
    ],
  },
  {
    id: "spy-intelligence",
    name: "Competitive Intelligence",
    icon: "🕵️",
    color: "#1E293B",
    description: "Spy on competitors, markets & trends",
    bots: [
      {
        id: "competitor-spy",
        name: "Competitor Spy",
        shortDesc: "Track competitor every move",
        goodFor: "Marketing, Strategy",
        price: "199",
        originalPrice: "239",
        type: "month",
        popular: true,
        trending: true,
        rating: 4.8,
        reviews: 345,
        integrations: ["Web", "Social", "SEMrush", "Slack"],
        features: ["Price Tracking", "Content Monitor", "Ads Spy", "Alerts"],
      },
      {
        id: "market-research-agent",
        name: "Market Research Agent",
        shortDesc: "AI-powered market analysis",
        goodFor: "Strategy, VCs",
        price: "299",
        originalPrice: "359",
        type: "month",
        limited: true,
        rating: 4.9,
        reviews: 156,
        integrations: ["OpenAI", "Crunchbase", "LinkedIn", "News"],
        features: ["Market Size", "Trends", "Players", "Reports"],
      },
      {
        id: "patent-monitor",
        name: "Patent Monitor",
        shortDesc: "Track new patents in your space",
        goodFor: "R&D, Legal",
        price: "179",
        originalPrice: "215",
        type: "month",
        new: true,
        rating: 4.6,
        reviews: 78,
        integrations: ["USPTO", "EPO", "Google Patents", "Slack"],
        features: ["New Filings", "Competitor Patents", "Analysis", "Alerts"],
      },
      {
        id: "funding-tracker",
        name: "Funding Tracker",
        shortDesc: "Track startup funding rounds",
        goodFor: "VCs, Sales",
        price: "149",
        originalPrice: "179",
        type: "month",
        trending: true,
        rating: 4.7,
        reviews: 189,
        integrations: ["Crunchbase", "PitchBook", "LinkedIn", "CRM"],
        features: ["New Rounds", "Lead Scores", "Outreach", "Alerts"],
      },
      {
        id: "review-monitor",
        name: "Review Monitor",
        shortDesc: "Track all reviews everywhere",
        goodFor: "Marketing, Support",
        price: "129",
        originalPrice: "155",
        type: "month",
        rating: 4.8,
        reviews: 267,
        integrations: ["G2", "Capterra", "Trustpilot", "App Stores"],
        features: ["All Platforms", "Sentiment", "Response", "Alerts"],
      },
    ],
  },
  {
    id: "personal-ai",
    name: "Personal AI Assistants",
    icon: "🧞",
    color: "#6366F1",
    description: "AI assistants for personal productivity",
    bots: [
      {
        id: "second-brain",
        name: "Second Brain AI",
        shortDesc: "Your AI-powered knowledge base",
        goodFor: "Knowledge Workers",
        price: "149",
        originalPrice: "179",
        type: "month",
        popular: true,
        trending: true,
        rating: 4.9,
        reviews: 678,
        integrations: ["Notion", "Obsidian", "OpenAI", "Web"],
        features: ["Auto-Capture", "Connections", "Search", "Insights"],
      },
      {
        id: "personal-crm",
        name: "Personal CRM",
        shortDesc: "Never forget a connection",
        goodFor: "Networking, Sales",
        price: "99",
        originalPrice: "119",
        type: "month",
        rating: 4.8,
        reviews: 345,
        integrations: ["LinkedIn", "Email", "Calendar", "Contacts"],
        features: ["Auto-Log", "Reminders", "Notes", "Insights"],
      },
      {
        id: "life-dashboard",
        name: "Life Dashboard",
        shortDesc: "All your life data in one place",
        goodFor: "Personal Productivity",
        price: "79",
        originalPrice: "95",
        type: "month",
        new: true,
        rating: 4.7,
        reviews: 234,
        integrations: ["Calendar", "Fitness", "Finance", "Tasks"],
        features: ["Unified View", "Goals", "Habits", "Reports"],
      },
      {
        id: "ai-life-coach",
        name: "AI Life Coach",
        shortDesc: "Daily AI coaching & motivation",
        goodFor: "Personal Growth",
        price: "129",
        originalPrice: "155",
        type: "month",
        trending: true,
        rating: 4.8,
        reviews: 456,
        integrations: ["OpenAI", "Calendar", "WhatsApp", "Telegram"],
        features: ["Daily Check-ins", "Goals", "Accountability", "Wisdom"],
      },
      {
        id: "travel-planner-ai",
        name: "AI Travel Planner",
        shortDesc: "Plan trips with AI",
        goodFor: "Travelers",
        price: "89",
        originalPrice: "107",
        type: "month",
        rating: 4.6,
        reviews: 189,
        integrations: ["OpenAI", "Google Maps", "Booking", "Flights"],
        features: ["Itinerary", "Budget", "Bookings", "Local Tips"],
      },
    ],
  },
  {
    id: "hr-recruiting-pro",
    name: "HR & Recruiting Pro",
    icon: "🎯",
    color: "#0D9488",
    description: "Advanced HR and recruiting automation",
    bots: [
      {
        id: "ai-resume-screener",
        name: "AI Resume Screener",
        shortDesc: "Screen 1000s of resumes instantly",
        goodFor: "HR, Recruiters",
        price: "249",
        originalPrice: "299",
        type: "month",
        popular: true,
        trending: true,
        rating: 4.9,
        reviews: 345,
        integrations: ["LinkedIn", "Indeed", "ATS", "OpenAI"],
        features: ["AI Scoring", "Matching", "Bias Check", "Ranking"],
      },
      {
        id: "candidate-sourcer",
        name: "Candidate Sourcer",
        shortDesc: "Find passive candidates",
        goodFor: "Recruiters",
        price: "299",
        originalPrice: "359",
        type: "month",
        limited: true,
        rating: 4.8,
        reviews: 189,
        integrations: ["LinkedIn", "GitHub", "Twitter", "Email"],
        features: ["Boolean Search", "Enrichment", "Outreach", "Tracking"],
      },
      {
        id: "interview-scheduler",
        name: "Interview Scheduler AI",
        shortDesc: "Zero-touch interview scheduling",
        goodFor: "HR, Recruiters",
        price: "129",
        originalPrice: "155",
        type: "month",
        rating: 4.7,
        reviews: 234,
        integrations: ["Calendar", "Zoom", "Email", "ATS"],
        features: ["Auto-Schedule", "Reminders", "Prep", "Feedback"],
      },
      {
        id: "culture-fit-analyzer",
        name: "Culture Fit Analyzer",
        shortDesc: "AI culture matching",
        goodFor: "HR Teams",
        price: "179",
        originalPrice: "215",
        type: "month",
        new: true,
        rating: 4.6,
        reviews: 78,
        integrations: ["OpenAI", "Survey", "HRIS", "Slack"],
        features: ["Values Match", "Team Fit", "Predictions", "Reports"],
      },
    ],
  },
  {
    id: "whatsapp-power",
    name: "WhatsApp Power Tools",
    icon: "💬",
    color: "#25D366",
    description: "Advanced WhatsApp Business automation",
    highlight: true,
    bots: [
      {
        id: "whatsapp-crm",
        name: "WhatsApp CRM",
        shortDesc: "Full CRM inside WhatsApp",
        goodFor: "Sales, Support",
        price: "179",
        originalPrice: "215",
        type: "month",
        popular: true,
        trending: true,
        rating: 4.9,
        reviews: 567,
        integrations: ["WhatsApp", "CRM", "Sheets", "Calendar"],
        features: ["Lead Tracking", "Pipelines", "Tags", "Team Inbox"],
      },
      {
        id: "whatsapp-broadcasts",
        name: "WhatsApp Broadcaster",
        shortDesc: "Mass messaging done right",
        goodFor: "Marketing",
        price: "149",
        originalPrice: "179",
        type: "month",
        rating: 4.8,
        reviews: 456,
        integrations: ["WhatsApp", "Sheets", "CRM", "Analytics"],
        features: ["Bulk Send", "Templates", "Personalization", "Reports"],
      },
      {
        id: "whatsapp-shop",
        name: "WhatsApp Shop Bot",
        shortDesc: "Sell products via WhatsApp",
        goodFor: "E-Commerce, SMBs",
        price: "199",
        originalPrice: "239",
        type: "month",
        trending: true,
        rating: 4.8,
        reviews: 345,
        integrations: ["WhatsApp", "Shopify", "Stripe", "Inventory"],
        features: ["Catalog", "Cart", "Checkout", "Orders"],
      },
      {
        id: "whatsapp-support-ai",
        name: "WhatsApp AI Support",
        shortDesc: "24/7 AI customer support",
        goodFor: "Support Teams",
        price: "229",
        originalPrice: "275",
        type: "month",
        popular: true,
        rating: 4.9,
        reviews: 234,
        integrations: ["WhatsApp", "OpenAI", "Zendesk", "KB"],
        features: ["AI Responses", "Handoff", "Multi-Lang", "Analytics"],
      },
      {
        id: "whatsapp-appointment",
        name: "WhatsApp Appointment Bot",
        shortDesc: "Book appointments via WhatsApp",
        goodFor: "Services, Healthcare",
        price: "129",
        originalPrice: "155",
        type: "month",
        rating: 4.7,
        reviews: 189,
        integrations: ["WhatsApp", "Calendar", "SMS", "CRM"],
        features: ["Booking", "Reminders", "Reschedule", "Payments"],
      },
    ],
  },
];

// Stats
const stats = {
  totalWorkflows: "2.061",
  totalCategories: categories.length.toString(),
  totalIntegrations: "187+",
};

// ═══════════════════════════════════════════════════════════════
//                    UTILITY HOOKS & FUNCTIONS
// ═══════════════════════════════════════════════════════════════

function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  
  useEffect(() => {
    const saved = localStorage.getItem("botFavorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);
  
  const toggle = useCallback((id: string) => {
    setFavorites(prev => {
      const newFavs = prev.includes(id) 
        ? prev.filter(f => f !== id)
        : [...prev, id];
      localStorage.setItem("botFavorites", JSON.stringify(newFavs));
      return newFavs;
    });
  }, []);
  
  return { favorites, toggle, isFavorite: (id: string) => favorites.includes(id) };
}

function useCompare() {
  const [compareList, setCompareList] = useState<Bot[]>([]);
  
  const toggle = useCallback((bot: Bot) => {
    setCompareList(prev => {
      if (prev.find(b => b.id === bot.id)) {
        return prev.filter(b => b.id !== bot.id);
      }
      if (prev.length >= 3) return prev;
      return [...prev, bot];
    });
  }, []);
  
  const clear = useCallback(() => setCompareList([]), []);
  
  return { compareList, toggle, clear, isComparing: (id: string) => compareList.some(b => b.id === id) };
}

// ═══════════════════════════════════════════════════════════════
//                    PARTICLE SYSTEM
// ═══════════════════════════════════════════════════════════════

function ParticleField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            backgroundColor: ["#FC682C", "#8B5CF6", "#10B981", "#0088CC"][Math.floor(Math.random() * 4)],
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    FLOATING ELEMENTS
// ═══════════════════════════════════════════════════════════════

function FloatingElements() {
  const icons = ["🤖", "⚡", "🚀", "💎", "✨", "🔥", "💫", "🎯"];
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map((icon, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl opacity-20"
          style={{
            left: `${10 + (i * 12)}%`,
            top: `${20 + Math.sin(i) * 30}%`,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 5 + i,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {icon}
        </motion.div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    GLASSMORPHISM CARD
// ═══════════════════════════════════════════════════════════════

function GlassCard({ children, className = "", glow = false }: { children: React.ReactNode; className?: string; glow?: boolean }) {
  return (
    <div className={`relative group ${className}`}>
      {glow && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FC682C] via-[#8B5CF6] to-[#10B981] rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
      )}
      <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl overflow-hidden">
        {children}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    NEON BADGE
// ═══════════════════════════════════════════════════════════════

function NeonBadge({ children, color = "#FC682C", pulse = false }: { children: React.ReactNode; color?: string; pulse?: boolean }) {
  return (
    <span 
      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${pulse ? "animate-pulse" : ""}`}
      style={{
        background: `linear-gradient(135deg, ${color}30, ${color}10)`,
        border: `1px solid ${color}50`,
        color: color,
        boxShadow: `0 0 10px ${color}30`,
      }}
    >
      {children}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    STAR RATING
// ═══════════════════════════════════════════════════════════════

function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-3.5 h-3.5 ${star <= rating ? "text-yellow-400" : "text-white/20"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-xs text-white/50">({reviews})</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    3D BOT CARD
// ═══════════════════════════════════════════════════════════════

function BotCard3D({ 
  bot, 
  categoryColor, 
  onCheckout,
  isFavorite,
  onFavoriteToggle,
  isComparing,
  onCompareToggle,
}: { 
  bot: Bot; 
  categoryColor: string;
  onCheckout: (bot: Bot, type: "rent" | "buy") => void;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
  isComparing: boolean;
  onCompareToggle: () => void;
}) {
  const t = useTranslations("pages.workflows");
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), { stiffness: 300, damping: 30 });
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const buyPrice = Math.round(parseFloat(bot.price) * 10);
  const discount = bot.originalPrice ? Math.round((1 - parseFloat(bot.price) / parseFloat(bot.originalPrice)) * 100) : 0;

  return (
    <motion.div
      ref={cardRef}
      className="relative group"
      style={{ perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {/* Glow Effect */}
      <motion.div
        className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${categoryColor}40, transparent 70%)`,
          filter: "blur(20px)",
        }}
      />
      
      <motion.div
        className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/[0.1] rounded-2xl overflow-hidden"
        style={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Top Badges Row */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
          <div className="flex flex-wrap gap-1">
            {bot.popular && <NeonBadge color="#FC682C" pulse>{t("badges.popular")}</NeonBadge>}
            {bot.new && <NeonBadge color="#10B981">{t("badges.new")}</NeonBadge>}
            {bot.trending && <NeonBadge color="#8B5CF6">{t("badges.trending")}</NeonBadge>}
            {bot.limited && <NeonBadge color="#EF4444" pulse>{t("badges.limited")}</NeonBadge>}
            {discount > 0 && <NeonBadge color="#F59E0B">-{discount}%</NeonBadge>}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-1">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.stopPropagation(); onFavoriteToggle(); }}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                isFavorite 
                  ? "bg-red-500/20 text-red-500 border border-red-500/30" 
                  : "bg-white/5 text-white/40 border border-white/10 hover:text-red-400"
              }`}
            >
              <svg className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.stopPropagation(); onCompareToggle(); }}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                isComparing 
                  ? "bg-[#FC682C]/20 text-[#FC682C] border border-[#FC682C]/30" 
                  : "bg-white/5 text-white/40 border border-white/10 hover:text-[#FC682C]"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </motion.button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-5 pt-14">
          {/* Header */}
          <div className="mb-4">
            <h4 className="text-lg font-bold text-white mb-1 group-hover:text-[#FC682C] transition-colors">
              {bot.name}
            </h4>
            <p className="text-sm text-white/60 line-clamp-2">{bot.shortDesc}</p>
          </div>
          
          {/* Rating */}
          {bot.rating && bot.reviews && (
            <div className="mb-4">
              <StarRating rating={bot.rating} reviews={bot.reviews} />
            </div>
          )}
          
          {/* Good For */}
          <div className="mb-4">
            <span className="text-xs text-white/40">{t("card.goodFor")} </span>
            <span className="text-xs text-white/70">{bot.goodFor}</span>
          </div>
          
          {/* Integrations */}
          <div className="mb-4">
            <span className="text-xs text-white/40 block mb-2">{t("card.integrations")}</span>
            <div className="flex flex-wrap gap-1.5">
              {bot.integrations.slice(0, 3).map((int, i) => (
                <span 
                  key={i} 
                  className="px-2 py-1 rounded-md text-[10px] bg-white/5 border border-white/10 text-white/70"
                >
                  {int}
                </span>
              ))}
              {bot.integrations.length > 3 && (
                <span className="px-2 py-1 rounded-md text-[10px] bg-white/5 border border-white/10 text-white/50">
                  +{bot.integrations.length - 3}
                </span>
              )}
            </div>
          </div>
          
          {/* Features */}
          <div className="mb-5">
            <div className="flex flex-wrap gap-1.5">
              {bot.features.map((feat, i) => (
                <span 
                  key={i} 
                  className="px-2 py-1 rounded-full text-[10px] text-white/60"
                  style={{ backgroundColor: `${categoryColor}15` }}
                >
                  {feat}
                </span>
              ))}
            </div>
          </div>
          
          {/* Pricing */}
          <div className="pt-4 border-t border-white/[0.06]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">{bot.price}€</span>
                <span className="text-xs text-white/40">/{t(`types.${bot.type}`)}</span>
                {bot.originalPrice && (
                  <span className="text-sm text-white/30 line-through">{bot.originalPrice}€</span>
                )}
              </div>
              <div className="text-right">
                <div className="text-xs text-white/40">{t("card.buyOnce")}</div>
                <div className="text-sm font-semibold text-white">{buyPrice}€</div>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onCheckout(bot, "rent")}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#FC682C] to-[#FF8C5A] text-white text-sm font-semibold shadow-lg shadow-[#FC682C]/25 hover:shadow-[#FC682C]/40 transition-shadow"
              >
                {t("card.rent")}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onCheckout(bot, "buy")}
                className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-semibold hover:bg-white/10 transition-colors"
              >
                {t("card.buy")}
              </motion.button>
            </div>
          </div>
        </div>
        
        {/* Shine Effect on Hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.03) 45%, transparent 50%)",
            transform: isHovered ? "translateX(100%)" : "translateX(-100%)",
          }}
          animate={{ transform: isHovered ? "translateX(100%)" : "translateX(-100%)" }}
          transition={{ duration: 0.6 }}
        />
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    COMPARE MODAL
// ═══════════════════════════════════════════════════════════════

function CompareModal({ bots, onClose }: { bots: Bot[]; onClose: () => void }) {
  const t = useTranslations("pages.workflows");
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-5xl max-h-[90vh] overflow-auto bg-[#0a0a0f] border border-white/10 rounded-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-white/10 bg-[#0a0a0f]">
          <h2 className="text-xl font-bold text-white">{t("compare.title")}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          <div className={`grid gap-4 ${bots.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
            {bots.map((bot) => (
              <div key={bot.id} className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                <h3 className="text-lg font-bold text-white mb-2">{bot.name}</h3>
                <p className="text-sm text-white/60 mb-4">{bot.shortDesc}</p>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-white/40 block mb-1">{t("card.price")}</span>
                    <span className="text-xl font-bold text-[#FC682C]">{bot.price}€<span className="text-sm text-white/40">/{t(`types.${bot.type}`)}</span></span>
                  </div>
                  
                  {bot.rating && (
                    <div>
                      <span className="text-xs text-white/40 block mb-1">{t("compare.rating")}</span>
                      <StarRating rating={bot.rating} reviews={bot.reviews || 0} />
                    </div>
                  )}
                  
                  <div>
                    <span className="text-xs text-white/40 block mb-1">{t("card.integrations")}</span>
                    <div className="flex flex-wrap gap-1">
                      {bot.integrations.map((int, i) => (
                        <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-white/10 text-white/70">{int}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-xs text-white/40 block mb-1">{t("compare.features")}</span>
                    <ul className="space-y-1">
                      {bot.features.map((feat, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-white/70">
                          <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    CHECKOUT MODAL
// ═══════════════════════════════════════════════════════════════

function CheckoutModal({
  bot,
  purchaseType,
  onClose,
}: {
  bot: Bot;
  purchaseType: "rent" | "buy";
  onClose: () => void;
}) {
  const t = useTranslations("pages.workflows");
  const router = useRouter();
  const price = purchaseType === "rent" ? bot.price : Math.round(parseFloat(bot.price) * 10).toString();

  const handleCheckout = () => {
    const params = new URLSearchParams({
      bot: bot.id,
      name: bot.name,
      type: purchaseType,
      price: price,
    });
    router.push(`/checkout?${params.toString()}`);
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
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-md bg-gradient-to-br from-[#0a0a0f] to-[#0f0f18] border border-white/10 rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#FC682C]/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <NeonBadge color={purchaseType === "rent" ? "#FC682C" : "#10B981"}>
                {purchaseType === "rent" ? t("checkout.rental") : t("checkout.purchase")}
              </NeonBadge>
              <h3 className="text-xl font-bold text-white mt-3">{bot.name}</h3>
              <p className="text-sm text-white/60 mt-1">{bot.shortDesc}</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between p-4 rounded-xl bg-white/[0.03] border border-white/10">
              <span className="text-white/60">{t("checkout.price")}</span>
              <span className="text-2xl font-bold text-white">
                {price}€
                <span className="text-sm text-white/40 ml-1">
                  {purchaseType === "rent" ? `/${t(`types.${bot.type}`)}` : t("checkout.oneTime")}
                </span>
              </span>
            </div>

            {purchaseType === "rent" && (
              <div className="p-4 rounded-xl bg-[#FC682C]/10 border border-[#FC682C]/20">
                <div className="flex items-center gap-2 text-sm text-[#FC682C]">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  {t("checkout.cancelAnytime")}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCheckout}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#FC682C] to-[#FF8C5A] text-white font-semibold text-lg shadow-lg shadow-[#FC682C]/30 hover:shadow-[#FC682C]/50 transition-shadow"
            >
              {t("checkout.proceed")}
            </motion.button>
            <button onClick={onClose} className="w-full py-3 text-white/60 hover:text-white transition-colors text-sm">
              {t("checkout.cancel")}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    SEARCH SPOTLIGHT
// ═══════════════════════════════════════════════════════════════

function SearchSpotlight({ 
  value, 
  onChange, 
  onClear,
  resultCount,
}: { 
  value: string; 
  onChange: (value: string) => void;
  onClear: () => void;
  resultCount: number;
}) {
  const t = useTranslations("pages.workflows");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        inputRef.current?.blur();
        onClear();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClear]);

  return (
    <div className="relative">
      <motion.div
        animate={{ 
          boxShadow: isFocused 
            ? "0 0 0 2px rgba(252,104,44,0.3), 0 0 30px rgba(252,104,44,0.2)" 
            : "0 0 0 1px rgba(255,255,255,0.05)" 
        }}
        className="relative flex items-center bg-white/[0.03] backdrop-blur-xl rounded-2xl overflow-hidden"
      >
        <div className="pl-4 text-white/40">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={t("search.placeholder")}
          className="flex-1 px-4 py-4 bg-transparent text-white placeholder-white/40 outline-none text-sm"
        />
        {value ? (
          <button onClick={onClear} className="pr-4 text-white/40 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        ) : (
          <div className="pr-4 flex items-center gap-1">
            <kbd className="px-2 py-1 rounded bg-white/10 text-[10px] text-white/50 font-mono">⌘</kbd>
            <kbd className="px-2 py-1 rounded bg-white/10 text-[10px] text-white/50 font-mono">K</kbd>
          </div>
        )}
      </motion.div>
      
      {value && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-2 p-3 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-xl"
        >
          <span className="text-xs text-white/60">
            {resultCount} {t("search.results")} "{value}"
          </span>
        </motion.div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    CATEGORY FILTER PILLS
// ═══════════════════════════════════════════════════════════════

function CategoryPills({ 
  categories, 
  activeFilter, 
  onFilterChange,
  showFavorites,
  onFavoritesToggle,
  favoritesCount,
}: { 
  categories: Category[];
  activeFilter: string | null;
  onFilterChange: (id: string | null) => void;
  showFavorites: boolean;
  onFavoritesToggle: () => void;
  favoritesCount: number;
}) {
  const t = useTranslations("pages.workflows");
  const totalBots = categories.reduce((acc, c) => acc + c.bots.length, 0);
  
  const featuredCategories = categories.filter(c => c.highlight);
  const regularCategories = categories.filter(c => !c.highlight);
  
  return (
    <div className="space-y-3">
      {/* Row 1: All + Favorites + Featured */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {/* All Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onFilterChange(null)}
          className={`flex-shrink-0 px-4 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${
            !activeFilter && !showFavorites
              ? "bg-gradient-to-r from-[#FC682C] to-[#FF8C5A] text-white shadow-lg shadow-[#FC682C]/30"
              : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
          }`}
        >
          <span>✨</span>
          <span>{t("filters.all")}</span>
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${!activeFilter && !showFavorites ? 'bg-white/20' : 'bg-white/10'}`}>
            {totalBots}
          </span>
        </motion.button>
        
        {/* Favorites */}
        {favoritesCount > 0 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onFavoritesToggle}
            className={`flex-shrink-0 px-4 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${
              showFavorites
                ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30"
                : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
            }`}
          >
            <span>❤️</span>
            <span>{t("filters.favorites")}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${showFavorites ? 'bg-white/20' : 'bg-white/10'}`}>
              {favoritesCount}
            </span>
          </motion.button>
        )}

        <div className="w-px h-6 bg-white/10 flex-shrink-0 mx-1" />

        {/* Featured Categories */}
        {featuredCategories.map((cat) => (
          <motion.button
            key={cat.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onFilterChange(cat.id)}
            className={`flex-shrink-0 px-4 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${
              activeFilter === cat.id
                ? "text-white shadow-lg"
                : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
            }`}
            style={{
              background: activeFilter === cat.id 
                ? `linear-gradient(135deg, ${cat.color}, ${cat.color}cc)`
                : undefined,
              boxShadow: activeFilter === cat.id 
                ? `0 8px 24px ${cat.color}40`
                : undefined,
            }}
          >
            <span className="text-lg">{cat.icon}</span>
            <span>{cat.name}</span>
            <span 
              className="text-xs px-1.5 py-0.5 rounded-full"
              style={{ 
                background: activeFilter === cat.id ? 'rgba(255,255,255,0.2)' : `${cat.color}20`,
                color: activeFilter === cat.id ? 'white' : cat.color 
              }}
            >
              {cat.bots.length}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Row 2: Regular Categories - Horizontal Scroll */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {regularCategories.map((cat) => (
          <motion.button
            key={cat.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onFilterChange(cat.id)}
            className={`flex-shrink-0 px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              activeFilter === cat.id
                ? "text-white shadow-lg"
                : "bg-white/5 text-white/60 hover:text-white/90 hover:bg-white/10 border border-white/5 hover:border-white/15"
            }`}
            style={{
              background: activeFilter === cat.id 
                ? `linear-gradient(135deg, ${cat.color}, ${cat.color}cc)`
                : undefined,
              boxShadow: activeFilter === cat.id 
                ? `0 6px 20px ${cat.color}40`
                : undefined,
            }}
          >
            <span>{cat.icon}</span>
            <span className="whitespace-nowrap">{cat.name}</span>
            <span 
              className="text-xs px-1.5 py-0.5 rounded-full"
              style={{ 
                background: activeFilter === cat.id ? 'rgba(255,255,255,0.2)' : `${cat.color}15`,
                color: activeFilter === cat.id ? 'white' : cat.color 
              }}
            >
              {cat.bots.length}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    HERO SECTION
// ═══════════════════════════════════════════════════════════════

function HeroSection() {
  const t = useTranslations("pages.workflows");
  const totalBots = categories.reduce((acc, c) => acc + c.bots.length, 0);
  
  const integrations = [
    { icon: "🧠", label: "OpenAI", color: "#10a37f" },
    { icon: "📱", label: "Telegram", color: "#0088CC" },
    { icon: "💬", label: "Slack", color: "#E01E5A" },
    { icon: "📊", label: "Sheets", color: "#4285F4" },
    { icon: "🔗", label: "HubSpot", color: "#FF7A59" },
    { icon: "📧", label: "Gmail", color: "#EA4335" },
    { icon: "🛒", label: "Shopify", color: "#96BF48" },
    { icon: "📅", label: "Calendar", color: "#7C3AED" },
    { icon: "💼", label: "LinkedIn", color: "#0A66C2" },
    { icon: "🎫", label: "Zendesk", color: "#F59E0B" },
  ];

  return (
    <section className="relative pt-24 pb-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-[#FC682C]/20 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#8B5CF6]/10 rounded-full blur-[150px]" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-[#0088CC]/10 rounded-full blur-[120px]" />
      </div>
      
      <ParticleField />
      <FloatingElements />
      
      <div className="container relative z-10 px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FC682C]/20 via-[#8B5CF6]/20 to-[#10B981]/20 border border-[#FC682C]/30 mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FC682C] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FC682C]"></span>
              </span>
              <span className="text-sm text-white/80 font-medium">
                {t("hero.badge", { totalBots })}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FC682C] via-[#FF8C5A] to-[#FFA07A]">
                {t("hero.headline1", { totalBots })}
              </span>
              <br />
              <span className="text-white">{t("hero.headline2")}</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-white/60 max-w-xl mx-auto lg:mx-0 mb-8"
            >
              {t("hero.subheadline", { workflows: stats.totalWorkflows })}
            </motion.p>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-4 gap-3 mb-8 max-w-lg mx-auto lg:mx-0"
            >
              {[
                { value: `${totalBots}+`, label: t("hero.stats.bots"), icon: "🤖" },
                { value: stats.totalCategories, label: t("hero.stats.categories"), icon: "📁" },
                { value: stats.totalIntegrations, label: t("hero.stats.integrations"), icon: "🔗" },
                { value: stats.totalWorkflows, label: t("hero.stats.workflows"), icon: "⚡" },
              ].map((stat, i) => (
                <GlassCard key={i} className="text-center p-3">
                  <span className="text-xl mb-1 block">{stat.icon}</span>
                  <div className="text-xl font-bold text-white">{stat.value}</div>
                  <div className="text-[10px] text-white/40 uppercase tracking-wider">{stat.label}</div>
                </GlassCard>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 mb-8"
            >
              <Link
                href="#bots"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#FC682C] to-[#FF8C5A] text-white font-bold text-lg shadow-2xl shadow-[#FC682C]/30 hover:shadow-[#FC682C]/50 transition-shadow flex items-center justify-center gap-2 group"
              >
                {t("hero.cta.discover", { totalBots })}
                <motion.svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  animate={{ y: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </motion.svg>
              </Link>
              <Link
                href="/termin"
                className="px-8 py-4 rounded-xl bg-white/5 border border-white/20 text-white font-semibold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                {t("hero.cta.consultation")}
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2"
            >
              {[
                { icon: "✓", text: t("hero.trust.gdpr") },
                { icon: "✓", text: t("hero.trust.servers") },
                { icon: "✓", text: t("hero.trust.instant") },
                { icon: "✓", text: t("hero.trust.support") },
              ].map((item, i) => (
                <span key={i} className="flex items-center gap-2 text-sm text-white/50">
                  <span className="text-green-500">{item.icon}</span>
                  {item.text}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Hero Visualization */}
          <motion.div
            className="flex-1 w-full max-w-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="relative w-full h-[400px] flex items-center justify-center">
              {/* Pulsing Background */}
              <motion.div
                className="absolute w-[350px] h-[350px] rounded-full"
                style={{ background: "radial-gradient(circle, rgba(252,104,44,0.2) 0%, transparent 70%)" }}
                animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              {/* Central Bot Icon */}
              <motion.div
                className="relative z-10 w-32 h-32 rounded-3xl bg-gradient-to-br from-[#FC682C] to-[#FF8C5A] flex items-center justify-center shadow-2xl"
                style={{ boxShadow: "0 0 60px rgba(252,104,44,0.5)" }}
                animate={{ scale: [1, 1.05, 1], y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="text-6xl">🤖</span>
                <motion.div
                  className="absolute inset-0 rounded-3xl border-2 border-[#FC682C]"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                />
              </motion.div>

              {/* Orbiting Integrations */}
              {integrations.map((integration, i) => {
                const angle = (i * 360) / integrations.length - 90;
                const radius = 140;
                const x = Math.cos((angle * Math.PI) / 180) * radius;
                const y = Math.sin((angle * Math.PI) / 180) * radius;

                return (
                  <motion.div
                    key={i}
                    className="absolute w-12 h-12 rounded-xl flex flex-col items-center justify-center backdrop-blur-sm border border-white/10"
                    style={{
                      left: `calc(50% + ${x}px - 24px)`,
                      top: `calc(50% + ${y}px - 24px)`,
                      backgroundColor: `${integration.color}20`,
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: [0, -5, 0],
                    }}
                    transition={{
                      opacity: { duration: 0.5, delay: 0.5 + i * 0.08 },
                      scale: { duration: 0.5, delay: 0.5 + i * 0.08 },
                      y: { duration: 3, repeat: Infinity, delay: i * 0.2 },
                    }}
                  >
                    <span className="text-lg">{integration.icon}</span>
                    <span className="text-[8px] text-white/50 mt-0.5">{integration.label}</span>
                  </motion.div>
                );
              })}

              {/* Connection Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
                {integrations.map((_, i) => {
                  const angle = (i * 360) / integrations.length - 90;
                  const x = 200 + Math.cos((angle * Math.PI) / 180) * 140;
                  const y = 200 + Math.sin((angle * Math.PI) / 180) * 140;
                  return (
                    <motion.line
                      key={i}
                      x1="200"
                      y1="200"
                      x2={x}
                      y2={y}
                      stroke="url(#gradient)"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.3 }}
                      transition={{ duration: 1, delay: 0.5 + i * 0.05 }}
                    />
                  );
                })}
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FC682C" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    STICKY FILTER BAR
// ═══════════════════════════════════════════════════════════════

function StickyFilterBar({ 
  searchQuery,
  onSearchChange,
  onSearchClear,
  resultCount,
  categories,
  activeFilter,
  onFilterChange,
  showFavorites,
  onFavoritesToggle,
  favoritesCount,
  compareCount,
  onCompareClick,
}: {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchClear: () => void;
  resultCount: number;
  categories: Category[];
  activeFilter: string | null;
  onFilterChange: (id: string | null) => void;
  showFavorites: boolean;
  onFavoritesToggle: () => void;
  favoritesCount: number;
  compareCount: number;
  onCompareClick: () => void;
}) {
  const t = useTranslations("pages.workflows");
  const { scrollY } = useScroll();
  const [isSticky, setIsSticky] = useState(false);
  
  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsSticky(latest > 600);
    });
  }, [scrollY]);

  return (
    <motion.div
      id="bots"
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isSticky 
          ? "py-3 bg-[#030308]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl" 
          : "py-6 bg-transparent"
      }`}
    >
      <div className="container px-4 sm:px-6">
        <div className="flex flex-col gap-4">
          {/* Search + Compare Button */}
          <div className="flex gap-3">
            <div className="flex-1">
              <SearchSpotlight
                value={searchQuery}
                onChange={onSearchChange}
                onClear={onSearchClear}
                resultCount={resultCount}
              />
            </div>
            {compareCount > 0 && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onCompareClick}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FC682C] to-[#8B5CF6] text-white font-semibold flex items-center gap-2 shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {t("compare.button")} ({compareCount})
              </motion.button>
            )}
          </div>
          
          {/* Category Pills */}
          <div className="overflow-x-auto pb-2 -mb-2 scrollbar-hide">
            <CategoryPills
              categories={categories}
              activeFilter={activeFilter}
              onFilterChange={onFilterChange}
              showFavorites={showFavorites}
              onFavoritesToggle={onFavoritesToggle}
              favoritesCount={favoritesCount}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    BACK TO TOP BUTTON
// ═══════════════════════════════════════════════════════════════

function BackToTop() {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  
  useEffect(() => {
    return scrollY.onChange((latest) => setShow(latest > 1000));
  }, [scrollY]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-[#FC682C] to-[#FF8C5A] text-white shadow-2xl shadow-[#FC682C]/30 flex items-center justify-center"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    FLOATING CTA
// ═══════════════════════════════════════════════════════════════

function FloatingCTA() {
  const t = useTranslations("pages.workflows");
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2 }}
      className="fixed bottom-6 left-6 z-50"
    >
      <GlassCard glow className="p-4 max-w-xs">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FC682C]/20 flex items-center justify-center flex-shrink-0">
            <span className="text-xl">💬</span>
          </div>
          <div>
            <p className="text-sm text-white font-medium mb-2">{t("floatingCta.question")}</p>
            <Link
              href="/termin"
              className="text-xs text-[#FC682C] hover:underline flex items-center gap-1"
            >
              {t("floatingCta.book")}
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    MAIN PAGE
// ═══════════════════════════════════════════════════════════════

export default function WorkflowsPage() {
  const t = useTranslations("pages.workflows");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [checkoutModal, setCheckoutModal] = useState<{ bot: Bot; purchaseType: "rent" | "buy" } | null>(null);

  const { favorites, toggle: toggleFavorite, isFavorite } = useFavorites();
  const { compareList, toggle: toggleCompare, clear: clearCompare, isComparing } = useCompare();

  const handleCheckout = useCallback((bot: Bot, type: "rent" | "buy") => {
    setCheckoutModal({ bot, purchaseType: type });
  }, []);

  const closeCheckout = useCallback(() => setCheckoutModal(null), []);

  // Get all bots flat
  const allBots = useMemo(() => categories.flatMap(c => c.bots.map(b => ({ ...b, categoryColor: c.color, categoryId: c.id }))), []);
  
  // Filter logic
  const filteredBots = useMemo(() => {
    let bots = allBots;
    
    if (showFavorites) {
      bots = bots.filter(b => favorites.includes(b.id));
    } else if (activeFilter) {
      bots = bots.filter(b => b.categoryId === activeFilter);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      bots = bots.filter(b =>
        b.name.toLowerCase().includes(query) ||
        b.shortDesc.toLowerCase().includes(query) ||
        b.goodFor.toLowerCase().includes(query) ||
        b.integrations.some(i => i.toLowerCase().includes(query)) ||
        b.features.some(f => f.toLowerCase().includes(query))
      );
    }
    
    return bots;
  }, [allBots, activeFilter, searchQuery, showFavorites, favorites]);

  // Group by category for display
  const groupedBots = useMemo(() => {
    if (showFavorites || searchQuery) {
      // Show flat list
      return null;
    }
    
    if (activeFilter) {
      return categories.filter(c => c.id === activeFilter);
    }
    
    return categories;
  }, [activeFilter, searchQuery, showFavorites]);

  return (
    <main className="bg-[#030308] min-h-screen">
      {/* Hero */}
      <HeroSection />
      
      {/* Sticky Filter Bar */}
      <StickyFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchClear={() => setSearchQuery("")}
        resultCount={filteredBots.length}
        categories={categories}
        activeFilter={activeFilter}
        onFilterChange={(id) => { setActiveFilter(id); setShowFavorites(false); }}
        showFavorites={showFavorites}
        onFavoritesToggle={() => { setShowFavorites(!showFavorites); setActiveFilter(null); }}
        favoritesCount={favorites.length}
        compareCount={compareList.length}
        onCompareClick={() => setShowCompareModal(true)}
      />
      
      {/* Bot Grid */}
      <section className="py-12">
        <div className="container px-4 sm:px-6">
          {groupedBots ? (
            // Grouped by category
            <div className="space-y-16">
              {groupedBots.map((category, i) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-4 mb-8">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      {category.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-white">{category.name}</h2>
                        {category.highlight && <NeonBadge color="#8B5CF6">HOT</NeonBadge>}
                        <span className="text-sm text-white/40">({category.bots.length} Bots)</span>
                      </div>
                      <p className="text-white/60">{category.description}</p>
                    </div>
                  </div>
                  
                  {/* Bot Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {category.bots.map((bot) => (
                      <BotCard3D
                        key={bot.id}
                        bot={bot}
                        categoryColor={category.color}
                        onCheckout={handleCheckout}
                        isFavorite={isFavorite(bot.id)}
                        onFavoriteToggle={() => toggleFavorite(bot.id)}
                        isComparing={isComparing(bot.id)}
                        onCompareToggle={() => toggleCompare(bot)}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            // Flat list (search or favorites)
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white">
                  {showFavorites ? t("results.favorites", { count: filteredBots.length }) : t("results.search", { count: filteredBots.length })}
                </h2>
              </div>
              
              {filteredBots.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredBots.map((bot) => (
                    <BotCard3D
                      key={bot.id}
                      bot={bot}
                      categoryColor={bot.categoryColor}
                      onCheckout={handleCheckout}
                      isFavorite={isFavorite(bot.id)}
                      onFavoriteToggle={() => toggleFavorite(bot.id)}
                      isComparing={isComparing(bot.id)}
                      onCompareToggle={() => toggleCompare(bot)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <span className="text-6xl mb-4 block">🔍</span>
                  <h3 className="text-xl font-bold text-white mb-2">{t("noResults.title")}</h3>
                  <p className="text-white/60">{t("noResults.desc")}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FC682C]/10 via-[#8B5CF6]/10 to-[#10B981]/10" />
        <div className="container px-4 sm:px-6 relative z-10">
          <GlassCard glow className="p-8 sm:p-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {t("cta.headline")}
            </h2>
            <p className="text-lg text-white/60 mb-8 max-w-2xl mx-auto">
              {t("cta.subheadline")}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/termin"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#FC682C] to-[#FF8C5A] text-white font-bold text-lg shadow-2xl shadow-[#FC682C]/30 hover:shadow-[#FC682C]/50 transition-shadow"
              >
                {t("cta.consultation")}
              </Link>
              <Link
                href="/kontakt"
                className="px-8 py-4 rounded-xl bg-white/5 border border-white/20 text-white font-semibold hover:bg-white/10 transition-all"
              >
                {t("cta.contact")}
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>
      
      {/* Floating Elements */}
      <BackToTop />
      <FloatingCTA />
      
      {/* Modals */}
      <AnimatePresence>
        {checkoutModal && (
          <CheckoutModal
            bot={checkoutModal.bot}
            purchaseType={checkoutModal.purchaseType}
            onClose={closeCheckout}
          />
        )}
        {showCompareModal && compareList.length > 0 && (
          <CompareModal
            bots={compareList}
            onClose={() => setShowCompareModal(false)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
