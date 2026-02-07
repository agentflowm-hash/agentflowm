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
      {
        id: "telegram-commerce",
        name: "Telegram Commerce Bot",
        shortDesc: "E-commerce via Telegram",
        goodFor: "Small Businesses, DTC",
        price: "159",
        originalPrice: "191",
        type: "Monat",
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
        type: "Monat",
        integrations: ["Telegram", "OpenAI", "Airtable", "Analytics"],
        features: ["Member Mgmt", "Anti-Spam", "Engagement", "Analytics"],
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
      {
        id: "pipedrive-automator",
        name: "Pipedrive Automator",
        shortDesc: "Automated Pipedrive sales workflows",
        goodFor: "Sales Teams",
        price: "159",
        originalPrice: "191",
        type: "Monat",
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
        type: "Monat",
        integrations: ["Salesforce", "Slack", "Email", "Analytics"],
        features: ["Lead Routing", "Opportunity Mgmt", "Forecasting", "Dashboards"],
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
      {
        id: "google-calendar-bot",
        name: "Calendar Automator",
        shortDesc: "Google Calendar workflow automation",
        goodFor: "Teams, Assistants",
        price: "109",
        originalPrice: "131",
        type: "Monat",
        integrations: ["Google Calendar", "Zoom", "Slack", "Email"],
        features: ["Event Creation", "Reminders", "Conflicts", "Sync"],
      },
      {
        id: "google-drive-organizer",
        name: "Drive Organizer",
        shortDesc: "Automated Google Drive management",
        goodFor: "Teams, Organizations",
        price: "119",
        originalPrice: "143",
        type: "Monat",
        integrations: ["Google Drive", "Email", "Slack", "Webhook"],
        features: ["Auto-Organize", "Permissions", "Backups", "Notifications"],
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════════
  //                    COMMUNICATION BOTS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "communication",
    name: "Communication & Chat",
    icon: "💬",
    color: "#E01E5A",
    description: "Slack, Discord, and team communication automation",
    bots: [
      {
        id: "slack-notifier",
        name: "Slack Notifier",
        shortDesc: "Automated Slack notifications and alerts",
        goodFor: "Teams, DevOps, Managers",
        price: "99",
        originalPrice: "119",
        type: "Monat",
        popular: true,
        integrations: ["Slack", "Webhook", "Email", "Jira"],
        features: ["Custom Channels", "Scheduled Messages", "Mentions", "Threading"],
      },
      {
        id: "slack-workflow-bot",
        name: "Slack Workflow Bot",
        shortDesc: "Complex workflow automation in Slack",
        goodFor: "Operations, HR",
        price: "149",
        originalPrice: "179",
        type: "Monat",
        integrations: ["Slack", "Google Sheets", "Notion", "Airtable"],
        features: ["Approval Flows", "Form Collection", "Auto-Routing", "Reports"],
      },
      {
        id: "discord-moderator",
        name: "Discord Moderator",
        shortDesc: "Automated Discord community moderation",
        goodFor: "Communities, Gaming",
        price: "119",
        originalPrice: "143",
        type: "Monat",
        integrations: ["Discord", "OpenAI", "Google Sheets", "Webhook"],
        features: ["Auto-Mod", "Welcome Messages", "Role Management", "Analytics"],
      },
      {
        id: "discord-engagement",
        name: "Discord Engagement Bot",
        shortDesc: "Boost community engagement on Discord",
        goodFor: "Community Managers",
        price: "129",
        originalPrice: "155",
        type: "Monat",
        integrations: ["Discord", "OpenAI", "Notion", "Calendar"],
        features: ["Event Reminders", "Polls", "Leaderboards", "Rewards"],
      },
      {
        id: "mattermost-connector",
        name: "Mattermost Connector",
        shortDesc: "Enterprise Mattermost automation",
        goodFor: "Enterprise Teams",
        price: "159",
        originalPrice: "191",
        type: "Monat",
        integrations: ["Mattermost", "Jira", "GitLab", "Email"],
        features: ["Channel Sync", "Notifications", "Commands", "Integrations"],
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════════
  //                    SOCIAL MARKETING BOTS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "social-marketing",
    name: "Social & Marketing",
    icon: "📣",
    color: "#0A66C2",
    description: "LinkedIn, Twitter, and newsletter automation",
    bots: [
      {
        id: "linkedin-automator",
        name: "LinkedIn Automator",
        shortDesc: "Automated LinkedIn outreach and posting",
        goodFor: "Sales, Recruiters, Marketing",
        price: "179",
        originalPrice: "215",
        type: "Monat",
        popular: true,
        integrations: ["LinkedIn", "HubSpot", "Google Sheets", "Email"],
        features: ["Auto-Connect", "Post Scheduling", "Lead Export", "Analytics"],
      },
      {
        id: "twitter-scheduler",
        name: "Twitter/X Scheduler",
        shortDesc: "Automated Twitter posting and engagement",
        goodFor: "Marketing, Influencers",
        price: "129",
        originalPrice: "155",
        type: "Monat",
        integrations: ["Twitter", "OpenAI", "Buffer", "Google Sheets"],
        features: ["Thread Creator", "Scheduling", "Analytics", "Auto-Reply"],
      },
      {
        id: "newsletter-automator",
        name: "Newsletter Automator",
        shortDesc: "Automated email newsletter campaigns",
        goodFor: "Content Creators, Marketing",
        price: "149",
        originalPrice: "179",
        type: "Monat",
        integrations: ["Mailchimp", "ConvertKit", "OpenAI", "RSS"],
        features: ["AI Content", "Segmentation", "A/B Testing", "Analytics"],
      },
      {
        id: "social-media-scheduler",
        name: "Multi-Platform Scheduler",
        shortDesc: "Post to all social platforms at once",
        goodFor: "Marketing Teams",
        price: "169",
        originalPrice: "203",
        type: "Monat",
        integrations: ["Instagram", "Facebook", "LinkedIn", "Twitter"],
        features: ["Bulk Scheduling", "Content Calendar", "Analytics", "Hashtags"],
      },
      {
        id: "influencer-outreach",
        name: "Influencer Outreach Bot",
        shortDesc: "Automated influencer discovery and contact",
        goodFor: "PR, Marketing",
        price: "199",
        originalPrice: "239",
        type: "Monat",
        integrations: ["Instagram", "Email", "Google Sheets", "CRM"],
        features: ["Discovery", "Auto-Contact", "Campaign Tracking", "ROI Reports"],
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════════
  //                    ECOMMERCE BOTS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "ecommerce",
    name: "E-Commerce",
    icon: "🛒",
    color: "#96BF48",
    description: "Shopify, WooCommerce, and store automation",
    highlight: true,
    bots: [
      {
        id: "shopify-automator",
        name: "Shopify Automator",
        shortDesc: "Complete Shopify store automation",
        goodFor: "E-Commerce, DTC Brands",
        price: "199",
        originalPrice: "239",
        type: "Monat",
        popular: true,
        integrations: ["Shopify", "Klaviyo", "Google Sheets", "Slack"],
        features: ["Order Sync", "Inventory Alerts", "Customer Tags", "Reports"],
      },
      {
        id: "woocommerce-connector",
        name: "WooCommerce Connector",
        shortDesc: "WordPress WooCommerce automation",
        goodFor: "WordPress Shops",
        price: "149",
        originalPrice: "179",
        type: "Monat",
        integrations: ["WooCommerce", "WordPress", "Email", "Stripe"],
        features: ["Order Processing", "Stock Sync", "Customer Emails", "Analytics"],
      },
      {
        id: "inventory-manager",
        name: "Inventory Manager",
        shortDesc: "Multi-channel inventory synchronization",
        goodFor: "Multi-Channel Sellers",
        price: "179",
        originalPrice: "215",
        type: "Monat",
        integrations: ["Shopify", "Amazon", "eBay", "Google Sheets"],
        features: ["Stock Sync", "Low Stock Alerts", "Reorder Points", "Reports"],
      },
      {
        id: "abandoned-cart-recovery",
        name: "Cart Recovery Bot",
        shortDesc: "Recover abandoned shopping carts",
        goodFor: "E-Commerce",
        price: "159",
        originalPrice: "191",
        type: "Monat",
        integrations: ["Shopify", "Klaviyo", "SMS", "Email"],
        features: ["Auto-Emails", "SMS Reminders", "Discount Codes", "Analytics"],
      },
      {
        id: "review-collector",
        name: "Review Collector",
        shortDesc: "Automated product review collection",
        goodFor: "E-Commerce Brands",
        price: "129",
        originalPrice: "155",
        type: "Monat",
        integrations: ["Shopify", "Trustpilot", "Email", "SMS"],
        features: ["Review Requests", "Photo Reviews", "Incentives", "Moderation"],
      },
      {
        id: "price-monitor",
        name: "Price Monitor Bot",
        shortDesc: "Competitor price monitoring",
        goodFor: "E-Commerce, Retail",
        price: "169",
        originalPrice: "203",
        type: "Monat",
        integrations: ["Web Scraping", "Google Sheets", "Slack", "Email"],
        features: ["Price Tracking", "Alerts", "Historical Data", "Reports"],
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════════
  //                    SCHEDULING BOTS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "scheduling",
    name: "Scheduling & Booking",
    icon: "📅",
    color: "#006BFF",
    description: "Calendly, booking, and appointment automation",
    bots: [
      {
        id: "calendly-automator",
        name: "Calendly Automator",
        shortDesc: "Enhanced Calendly workflow automation",
        goodFor: "Sales, Consultants",
        price: "119",
        originalPrice: "143",
        type: "Monat",
        popular: true,
        integrations: ["Calendly", "HubSpot", "Zoom", "Email"],
        features: ["Auto-Reminders", "CRM Sync", "Follow-ups", "Analytics"],
      },
      {
        id: "booking-manager",
        name: "Booking Manager",
        shortDesc: "Complete booking system automation",
        goodFor: "Service Businesses",
        price: "149",
        originalPrice: "179",
        type: "Monat",
        integrations: ["Cal.com", "Google Calendar", "Stripe", "Email"],
        features: ["Online Booking", "Payments", "Reminders", "Rescheduling"],
      },
      {
        id: "meeting-scheduler",
        name: "Smart Meeting Scheduler",
        shortDesc: "AI-powered meeting scheduling",
        goodFor: "Executives, Teams",
        price: "139",
        originalPrice: "167",
        type: "Monat",
        integrations: ["Google Calendar", "Outlook", "Slack", "OpenAI"],
        features: ["AI Scheduling", "Time Zone Magic", "Conflicts", "Preferences"],
      },
      {
        id: "appointment-reminder",
        name: "Appointment Reminder",
        shortDesc: "Automated appointment reminders",
        goodFor: "Healthcare, Services",
        price: "99",
        originalPrice: "119",
        type: "Monat",
        integrations: ["Calendar", "SMS", "Email", "WhatsApp"],
        features: ["Multi-Channel", "Confirmations", "No-Show Tracking", "Reports"],
      },
      {
        id: "resource-scheduler",
        name: "Resource Scheduler",
        shortDesc: "Room and resource booking automation",
        goodFor: "Offices, Coworking",
        price: "159",
        originalPrice: "191",
        type: "Monat",
        integrations: ["Google Calendar", "Slack", "Email", "Display"],
        features: ["Room Booking", "Equipment", "Conflicts", "Reports"],
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════════
  //                    SUPPORT BOTS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "support",
    name: "Customer Support",
    icon: "🎫",
    color: "#F59E0B",
    description: "Zendesk, Intercom, and support automation",
    bots: [
      {
        id: "zendesk-automator",
        name: "Zendesk Automator",
        shortDesc: "Automated Zendesk ticket management",
        goodFor: "Support Teams",
        price: "179",
        originalPrice: "215",
        type: "Monat",
        popular: true,
        integrations: ["Zendesk", "OpenAI", "Slack", "Email"],
        features: ["Auto-Triage", "AI Responses", "Escalation", "SLA Tracking"],
      },
      {
        id: "intercom-enhancer",
        name: "Intercom Enhancer",
        shortDesc: "Supercharge your Intercom workflows",
        goodFor: "SaaS, Support",
        price: "169",
        originalPrice: "203",
        type: "Monat",
        integrations: ["Intercom", "OpenAI", "Slack", "CRM"],
        features: ["AI Chatbot", "Lead Routing", "Custom Bots", "Analytics"],
      },
      {
        id: "helpdesk-connector",
        name: "Helpdesk Connector",
        shortDesc: "Multi-channel helpdesk automation",
        goodFor: "Support Teams",
        price: "149",
        originalPrice: "179",
        type: "Monat",
        integrations: ["Freshdesk", "Email", "Chat", "Phone"],
        features: ["Ticket Routing", "SLA Rules", "Canned Responses", "Reports"],
      },
      {
        id: "customer-feedback",
        name: "Feedback Collector",
        shortDesc: "Automated customer feedback collection",
        goodFor: "Product, Support",
        price: "119",
        originalPrice: "143",
        type: "Monat",
        integrations: ["Email", "Typeform", "Slack", "Notion"],
        features: ["NPS Surveys", "CSAT", "Analysis", "Alerts"],
      },
      {
        id: "knowledge-base-bot",
        name: "Knowledge Base Bot",
        shortDesc: "AI-powered knowledge base assistant",
        goodFor: "Support, Documentation",
        price: "159",
        originalPrice: "191",
        type: "Monat",
        integrations: ["OpenAI", "Notion", "Confluence", "Zendesk"],
        features: ["AI Search", "Auto-Suggest", "Gap Analysis", "Updates"],
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════════
  //                    HR & RECRUITING BOTS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "hr-recruiting",
    name: "HR & Recruiting",
    icon: "👥",
    color: "#8B5CF6",
    description: "Onboarding, recruiting, and HR automation",
    bots: [
      {
        id: "recruiting-automator",
        name: "Recruiting Automator",
        shortDesc: "Automated candidate sourcing and screening",
        goodFor: "HR, Recruiters",
        price: "199",
        originalPrice: "239",
        type: "Monat",
        popular: true,
        integrations: ["LinkedIn", "Greenhouse", "Email", "Calendar"],
        features: ["CV Screening", "Auto-Outreach", "Interview Scheduling", "Pipeline"],
      },
      {
        id: "onboarding-bot",
        name: "Onboarding Bot",
        shortDesc: "Automated employee onboarding",
        goodFor: "HR Teams",
        price: "169",
        originalPrice: "203",
        type: "Monat",
        integrations: ["Slack", "Notion", "Google Workspace", "BambooHR"],
        features: ["Task Lists", "Document Collection", "Introductions", "Progress"],
      },
      {
        id: "employee-engagement",
        name: "Engagement Bot",
        shortDesc: "Employee engagement and surveys",
        goodFor: "HR, People Ops",
        price: "139",
        originalPrice: "167",
        type: "Monat",
        integrations: ["Slack", "Email", "Google Forms", "Analytics"],
        features: ["Pulse Surveys", "Recognition", "Feedback", "Reports"],
      },
      {
        id: "leave-manager",
        name: "Leave Manager",
        shortDesc: "Automated PTO and leave management",
        goodFor: "HR, Managers",
        price: "119",
        originalPrice: "143",
        type: "Monat",
        integrations: ["Slack", "Google Calendar", "BambooHR", "Email"],
        features: ["Leave Requests", "Approvals", "Calendar Sync", "Reports"],
      },
      {
        id: "performance-tracker",
        name: "Performance Tracker",
        shortDesc: "Automated performance review management",
        goodFor: "HR, Managers",
        price: "159",
        originalPrice: "191",
        type: "Monat",
        integrations: ["Lattice", "Slack", "Google Docs", "Calendar"],
        features: ["Review Cycles", "360 Feedback", "Goals", "Analytics"],
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════════
  //                    PROJECT MANAGEMENT BOTS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "project-management",
    name: "Project Management",
    icon: "📋",
    color: "#0052CC",
    description: "Jira, Asana, and Trello automation",
    bots: [
      {
        id: "jira-automator",
        name: "Jira Automator",
        shortDesc: "Automated Jira workflow management",
        goodFor: "Dev Teams, PMs",
        price: "169",
        originalPrice: "203",
        type: "Monat",
        popular: true,
        integrations: ["Jira", "Slack", "GitHub", "Confluence"],
        features: ["Auto-Assign", "Sprint Reports", "Transitions", "Notifications"],
      },
      {
        id: "asana-connector",
        name: "Asana Connector",
        shortDesc: "Asana workflow automation",
        goodFor: "Teams, Agencies",
        price: "139",
        originalPrice: "167",
        type: "Monat",
        integrations: ["Asana", "Slack", "Email", "Google Sheets"],
        features: ["Task Creation", "Due Date Alerts", "Reports", "Templates"],
      },
      {
        id: "trello-automator",
        name: "Trello Automator",
        shortDesc: "Advanced Trello board automation",
        goodFor: "Small Teams",
        price: "99",
        originalPrice: "119",
        type: "Monat",
        integrations: ["Trello", "Slack", "Email", "Calendar"],
        features: ["Card Automation", "Due Dates", "Checklists", "Reports"],
      },
      {
        id: "project-reporter",
        name: "Project Reporter",
        shortDesc: "Automated project status reports",
        goodFor: "PMs, Executives",
        price: "149",
        originalPrice: "179",
        type: "Monat",
        integrations: ["Jira", "Asana", "Slack", "Email"],
        features: ["Auto-Reports", "Dashboards", "Milestones", "Alerts"],
      },
      {
        id: "task-delegator",
        name: "Task Delegator",
        shortDesc: "AI-powered task assignment",
        goodFor: "Team Leads",
        price: "129",
        originalPrice: "155",
        type: "Monat",
        integrations: ["OpenAI", "Jira", "Slack", "Email"],
        features: ["Smart Assignment", "Workload Balance", "Skills Match", "Notifications"],
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════════
  //                    DEVOPS BOTS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "dev-ops",
    name: "DevOps & CI/CD",
    icon: "⚙️",
    color: "#171515",
    description: "GitHub, GitLab, and CI/CD automation",
    bots: [
      {
        id: "github-automator",
        name: "GitHub Automator",
        shortDesc: "Automated GitHub workflows and actions",
        goodFor: "Dev Teams",
        price: "149",
        originalPrice: "179",
        type: "Monat",
        popular: true,
        integrations: ["GitHub", "Slack", "Jira", "Email"],
        features: ["PR Automation", "Issue Triage", "Release Notes", "Notifications"],
      },
      {
        id: "gitlab-connector",
        name: "GitLab Connector",
        shortDesc: "GitLab CI/CD pipeline automation",
        goodFor: "Dev Teams",
        price: "159",
        originalPrice: "191",
        type: "Monat",
        integrations: ["GitLab", "Slack", "Jira", "Docker"],
        features: ["Pipeline Triggers", "MR Automation", "Deploy Alerts", "Reports"],
      },
      {
        id: "ci-cd-monitor",
        name: "CI/CD Monitor",
        shortDesc: "Build and deployment monitoring",
        goodFor: "DevOps Teams",
        price: "139",
        originalPrice: "167",
        type: "Monat",
        integrations: ["Jenkins", "GitHub Actions", "Slack", "PagerDuty"],
        features: ["Build Status", "Failure Alerts", "Metrics", "Dashboards"],
      },
      {
        id: "code-review-bot",
        name: "Code Review Bot",
        shortDesc: "AI-assisted code review automation",
        goodFor: "Dev Teams",
        price: "179",
        originalPrice: "215",
        type: "Monat",
        integrations: ["GitHub", "OpenAI", "Slack", "Jira"],
        features: ["AI Review", "Style Checks", "Security Scan", "Suggestions"],
      },
      {
        id: "incident-responder",
        name: "Incident Responder",
        shortDesc: "Automated incident management",
        goodFor: "DevOps, SRE",
        price: "199",
        originalPrice: "239",
        type: "Monat",
        integrations: ["PagerDuty", "Slack", "Jira", "Datadog"],
        features: ["Alert Routing", "Escalation", "Runbooks", "Post-Mortems"],
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════════
  //                    DATA SYNC BOTS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "data-sync",
    name: "Data & Integration",
    icon: "🔄",
    color: "#14B8A6",
    description: "Database, API, and webhook automation",
    bots: [
      {
        id: "database-sync",
        name: "Database Sync Bot",
        shortDesc: "Automated database synchronization",
        goodFor: "Data Teams",
        price: "179",
        originalPrice: "215",
        type: "Monat",
        popular: true,
        integrations: ["PostgreSQL", "MySQL", "MongoDB", "BigQuery"],
        features: ["Real-time Sync", "Transformations", "Scheduling", "Monitoring"],
      },
      {
        id: "api-connector",
        name: "API Connector",
        shortDesc: "Connect any API with no-code",
        goodFor: "Developers, Ops",
        price: "149",
        originalPrice: "179",
        type: "Monat",
        integrations: ["REST APIs", "GraphQL", "Webhook", "Database"],
        features: ["API Builder", "Auth Support", "Rate Limiting", "Logs"],
      },
      {
        id: "webhook-manager",
        name: "Webhook Manager",
        shortDesc: "Centralized webhook management",
        goodFor: "Dev Teams",
        price: "119",
        originalPrice: "143",
        type: "Monat",
        integrations: ["Any Webhook", "Slack", "Email", "Database"],
        features: ["Routing", "Transformation", "Retry Logic", "Logs"],
      },
      {
        id: "etl-automator",
        name: "ETL Automator",
        shortDesc: "Extract, transform, load automation",
        goodFor: "Data Engineers",
        price: "199",
        originalPrice: "239",
        type: "Monat",
        integrations: ["Snowflake", "BigQuery", "S3", "APIs"],
        features: ["Data Pipelines", "Scheduling", "Monitoring", "Alerts"],
      },
      {
        id: "data-validator",
        name: "Data Validator",
        shortDesc: "Automated data quality checks",
        goodFor: "Data Teams",
        price: "139",
        originalPrice: "167",
        type: "Monat",
        integrations: ["Database", "Google Sheets", "Email", "Slack"],
        features: ["Quality Rules", "Anomaly Detection", "Alerts", "Reports"],
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════════
  //                    FINANCE BOTS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "finance",
    name: "Finance & Accounting",
    icon: "💰",
    color: "#059669",
    description: "Invoice, expense, and financial automation",
    bots: [
      {
        id: "invoice-automator",
        name: "Invoice Automator",
        shortDesc: "Automated invoice processing",
        goodFor: "Finance Teams",
        price: "169",
        originalPrice: "203",
        type: "Monat",
        popular: true,
        integrations: ["QuickBooks", "Xero", "Stripe", "Email"],
        features: ["Auto-Create", "Payment Tracking", "Reminders", "Reports"],
      },
      {
        id: "expense-manager",
        name: "Expense Manager",
        shortDesc: "Automated expense tracking and approval",
        goodFor: "Finance, Employees",
        price: "139",
        originalPrice: "167",
        type: "Monat",
        integrations: ["Receipt Bank", "Slack", "QuickBooks", "Email"],
        features: ["Receipt Scan", "Approvals", "Categorization", "Reports"],
      },
      {
        id: "payment-reconciler",
        name: "Payment Reconciler",
        shortDesc: "Automated payment reconciliation",
        goodFor: "Finance Teams",
        price: "189",
        originalPrice: "227",
        type: "Monat",
        integrations: ["Stripe", "Bank APIs", "QuickBooks", "Excel"],
        features: ["Auto-Match", "Discrepancy Alerts", "Reports", "Audit Trail"],
      },
      {
        id: "budget-tracker",
        name: "Budget Tracker",
        shortDesc: "Automated budget monitoring",
        goodFor: "Finance, Managers",
        price: "129",
        originalPrice: "155",
        type: "Monat",
        integrations: ["QuickBooks", "Google Sheets", "Slack", "Email"],
        features: ["Budget Alerts", "Forecasting", "Reports", "Dashboards"],
      },
      {
        id: "financial-reporter",
        name: "Financial Reporter",
        shortDesc: "Automated financial reports",
        goodFor: "CFOs, Finance",
        price: "199",
        originalPrice: "239",
        type: "Monat",
        integrations: ["QuickBooks", "Xero", "Google Sheets", "Email"],
        features: ["P&L Reports", "Cash Flow", "KPIs", "Scheduling"],
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════════
  //                    ENTERPRISE BOTS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "enterprise",
    name: "Enterprise Solutions",
    icon: "🏢",
    color: "#1E3A8A",
    description: "Custom enterprise-grade automation",
    highlight: true,
    bots: [
      {
        id: "enterprise-integration",
        name: "Enterprise Integration Hub",
        shortDesc: "Connect all enterprise systems",
        goodFor: "Enterprise IT",
        price: "299",
        originalPrice: "359",
        type: "Monat",
        popular: true,
        integrations: ["SAP", "Salesforce", "Oracle", "Custom APIs"],
        features: ["System Integration", "Data Sync", "Security", "Compliance"],
      },
      {
        id: "compliance-bot",
        name: "Compliance Bot",
        shortDesc: "Automated compliance monitoring",
        goodFor: "Legal, Compliance",
        price: "249",
        originalPrice: "299",
        type: "Monat",
        integrations: ["Document Storage", "Email", "Slack", "Audit Systems"],
        features: ["Policy Checks", "Audit Trails", "Alerts", "Reports"],
      },
      {
        id: "sso-connector",
        name: "SSO Connector",
        shortDesc: "Single sign-on integration",
        goodFor: "Enterprise IT",
        price: "199",
        originalPrice: "239",
        type: "Monat",
        integrations: ["Okta", "Azure AD", "SAML", "LDAP"],
        features: ["User Sync", "Provisioning", "Access Control", "Audit"],
      },
      {
        id: "workflow-orchestrator",
        name: "Workflow Orchestrator",
        shortDesc: "Enterprise workflow management",
        goodFor: "Operations",
        price: "279",
        originalPrice: "335",
        type: "Monat",
        integrations: ["Multiple Systems", "APIs", "Database", "Email"],
        features: ["Complex Workflows", "Approvals", "SLAs", "Analytics"],
      },
      {
        id: "audit-logger",
        name: "Audit Logger",
        shortDesc: "Comprehensive audit logging",
        goodFor: "Security, Compliance",
        price: "169",
        originalPrice: "203",
        type: "Monat",
        integrations: ["All Systems", "SIEM", "Email", "Database"],
        features: ["Event Logging", "Tamper-Proof", "Search", "Reports"],
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════════
  //                    NO-CODE DATABASE BOTS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "no-code-databases",
    name: "No-Code Databases",
    icon: "🗃️",
    color: "#F472B6",
    description: "Airtable, Notion, and Supabase automation",
    bots: [
      {
        id: "airtable-automator",
        name: "Airtable Automator",
        shortDesc: "Advanced Airtable automation",
        goodFor: "Teams, Operations",
        price: "129",
        originalPrice: "155",
        type: "Monat",
        popular: true,
        integrations: ["Airtable", "Slack", "Email", "Zapier"],
        features: ["Record Automation", "Views", "Notifications", "Sync"],
      },
      {
        id: "notion-connector",
        name: "Notion Connector",
        shortDesc: "Notion database automation",
        goodFor: "Teams, PMs",
        price: "119",
        originalPrice: "143",
        type: "Monat",
        integrations: ["Notion", "Slack", "Google Calendar", "Email"],
        features: ["Page Creation", "Database Sync", "Reminders", "Templates"],
      },
      {
        id: "supabase-automator",
        name: "Supabase Automator",
        shortDesc: "Supabase backend automation",
        goodFor: "Developers",
        price: "149",
        originalPrice: "179",
        type: "Monat",
        integrations: ["Supabase", "Webhook", "Email", "Slack"],
        features: ["Database Triggers", "Auth Events", "Storage", "Functions"],
      },
      {
        id: "coda-connector",
        name: "Coda Connector",
        shortDesc: "Coda document automation",
        goodFor: "Teams",
        price: "109",
        originalPrice: "131",
        type: "Monat",
        integrations: ["Coda", "Slack", "Gmail", "Calendar"],
        features: ["Doc Automation", "Pack Integration", "Notifications", "Sync"],
      },
      {
        id: "baserow-automator",
        name: "Baserow Automator",
        shortDesc: "Open-source database automation",
        goodFor: "Privacy-Focused Teams",
        price: "99",
        originalPrice: "119",
        type: "Monat",
        integrations: ["Baserow", "Webhook", "Email", "Slack"],
        features: ["Row Triggers", "Automations", "API", "Self-Hosted"],
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════════
  //                    MICROSOFT ENTERPRISE BOTS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "microsoft-enterprise",
    name: "Microsoft 365",
    icon: "🪟",
    color: "#00A4EF",
    description: "Outlook, Teams, and Excel automation",
    bots: [
      {
        id: "outlook-automator",
        name: "Outlook Automator",
        shortDesc: "Microsoft Outlook email automation",
        goodFor: "Enterprise",
        price: "139",
        originalPrice: "167",
        type: "Monat",
        popular: true,
        integrations: ["Outlook", "Teams", "SharePoint", "OneDrive"],
        features: ["Email Rules", "Calendar Sync", "Auto-Reply", "Filing"],
      },
      {
        id: "teams-bot",
        name: "Teams Bot",
        shortDesc: "Microsoft Teams automation",
        goodFor: "Enterprise Teams",
        price: "149",
        originalPrice: "179",
        type: "Monat",
        integrations: ["Teams", "SharePoint", "Outlook", "Power Automate"],
        features: ["Channel Posts", "Meetings", "Notifications", "Commands"],
      },
      {
        id: "excel-processor",
        name: "Excel Processor",
        shortDesc: "Automated Excel data processing",
        goodFor: "Finance, Operations",
        price: "129",
        originalPrice: "155",
        type: "Monat",
        integrations: ["Excel", "SharePoint", "Email", "Power BI"],
        features: ["Data Processing", "Reports", "Macros", "Sync"],
      },
      {
        id: "sharepoint-connector",
        name: "SharePoint Connector",
        shortDesc: "SharePoint document automation",
        goodFor: "Enterprise",
        price: "159",
        originalPrice: "191",
        type: "Monat",
        integrations: ["SharePoint", "Teams", "Email", "Power Automate"],
        features: ["Document Flows", "Approvals", "Metadata", "Search"],
      },
      {
        id: "power-automate-enhancer",
        name: "Power Automate Enhancer",
        shortDesc: "Enhanced Power Automate workflows",
        goodFor: "IT, Operations",
        price: "169",
        originalPrice: "203",
        type: "Monat",
        integrations: ["Power Automate", "All Microsoft", "APIs", "Database"],
        features: ["Advanced Flows", "Error Handling", "Monitoring", "Templates"],
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════════
  //                    PROJECT TOOLS EXTENDED BOTS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "project-tools-extended",
    name: "Extended PM Tools",
    icon: "🎯",
    color: "#FF4F64",
    description: "Monday.com, ClickUp, and more PM tools",
    bots: [
      {
        id: "monday-automator",
        name: "Monday.com Automator",
        shortDesc: "Advanced Monday.com automation",
        goodFor: "Teams, Agencies",
        price: "149",
        originalPrice: "179",
        type: "Monat",
        popular: true,
        integrations: ["Monday.com", "Slack", "Email", "Google Sheets"],
        features: ["Board Automation", "Status Updates", "Notifications", "Reports"],
      },
      {
        id: "clickup-connector",
        name: "ClickUp Connector",
        shortDesc: "ClickUp workflow automation",
        goodFor: "Teams",
        price: "139",
        originalPrice: "167",
        type: "Monat",
        integrations: ["ClickUp", "Slack", "GitHub", "Email"],
        features: ["Task Automation", "Time Tracking", "Goals", "Reports"],
      },
      {
        id: "basecamp-automator",
        name: "Basecamp Automator",
        shortDesc: "Basecamp project automation",
        goodFor: "Agencies, Teams",
        price: "119",
        originalPrice: "143",
        type: "Monat",
        integrations: ["Basecamp", "Email", "Slack", "Calendar"],
        features: ["Todo Automation", "Schedules", "Check-ins", "Reports"],
      },
      {
        id: "wrike-connector",
        name: "Wrike Connector",
        shortDesc: "Wrike workflow automation",
        goodFor: "Enterprise Teams",
        price: "159",
        originalPrice: "191",
        type: "Monat",
        integrations: ["Wrike", "Slack", "Salesforce", "Email"],
        features: ["Request Forms", "Approvals", "Blueprints", "Reports"],
      },
      {
        id: "teamwork-automator",
        name: "Teamwork Automator",
        shortDesc: "Teamwork.com project automation",
        goodFor: "Agencies",
        price: "129",
        originalPrice: "155",
        type: "Monat",
        integrations: ["Teamwork", "Slack", "Email", "Calendar"],
        features: ["Task Templates", "Time Logs", "Client Portal", "Reports"],
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════════
  //                    FORMS & SURVEYS BOTS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "forms-surveys",
    name: "Forms & Surveys",
    icon: "📝",
    color: "#7C3AED",
    description: "Typeform, Jotform, and survey automation",
    bots: [
      {
        id: "typeform-automator",
        name: "Typeform Automator",
        shortDesc: "Advanced Typeform response handling",
        goodFor: "Marketing, Research",
        price: "119",
        originalPrice: "143",
        type: "Monat",
        popular: true,
        integrations: ["Typeform", "Google Sheets", "CRM", "Email"],
        features: ["Response Routing", "Scoring", "Notifications", "Analysis"],
      },
      {
        id: "jotform-connector",
        name: "Jotform Connector",
        shortDesc: "Jotform submission automation",
        goodFor: "Operations, HR",
        price: "109",
        originalPrice: "131",
        type: "Monat",
        integrations: ["Jotform", "Google Sheets", "Slack", "Email"],
        features: ["Auto-Process", "Approvals", "PDF Generation", "Notifications"],
      },
      {
        id: "google-forms-enhancer",
        name: "Google Forms Enhancer",
        shortDesc: "Enhanced Google Forms automation",
        goodFor: "Everyone",
        price: "89",
        originalPrice: "107",
        type: "Monat",
        integrations: ["Google Forms", "Sheets", "Email", "Slack"],
        features: ["Response Alerts", "Analysis", "Follow-ups", "Reports"],
      },
      {
        id: "survey-analyzer",
        name: "Survey Analyzer",
        shortDesc: "AI-powered survey analysis",
        goodFor: "Research, Product",
        price: "149",
        originalPrice: "179",
        type: "Monat",
        integrations: ["Any Survey Tool", "OpenAI", "Google Sheets", "Slack"],
        features: ["Sentiment Analysis", "Themes", "Reports", "Alerts"],
      },
      {
        id: "quiz-automator",
        name: "Quiz Automator",
        shortDesc: "Automated quiz and assessment handling",
        goodFor: "Education, Training",
        price: "99",
        originalPrice: "119",
        type: "Monat",
        integrations: ["Quiz Tools", "Email", "LMS", "Certificates"],
        features: ["Auto-Grade", "Certificates", "Progress Tracking", "Reports"],
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════════
  //                    SMS & TELEPHONY BOTS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "sms-telephony",
    name: "SMS & Telephony",
    icon: "📞",
    color: "#DC2626",
    description: "Twilio, SMS, and phone automation",
    bots: [
      {
        id: "twilio-automator",
        name: "Twilio Automator",
        shortDesc: "Complete Twilio communication automation",
        goodFor: "Support, Marketing",
        price: "169",
        originalPrice: "203",
        type: "Monat",
        popular: true,
        integrations: ["Twilio", "CRM", "Webhook", "Database"],
        features: ["SMS Campaigns", "Voice Calls", "WhatsApp", "Analytics"],
      },
      {
        id: "sms-marketing",
        name: "SMS Marketing Bot",
        shortDesc: "Automated SMS marketing campaigns",
        goodFor: "Marketing, E-Commerce",
        price: "149",
        originalPrice: "179",
        type: "Monat",
        integrations: ["Twilio", "Shopify", "CRM", "Email"],
        features: ["Campaigns", "Segmentation", "Scheduling", "Analytics"],
      },
      {
        id: "voicemail-transcriber",
        name: "Voicemail Transcriber",
        shortDesc: "Automated voicemail transcription",
        goodFor: "Sales, Support",
        price: "119",
        originalPrice: "143",
        type: "Monat",
        integrations: ["Phone Systems", "OpenAI", "Email", "CRM"],
        features: ["Transcription", "Summaries", "Routing", "Follow-ups"],
      },
      {
        id: "call-tracker",
        name: "Call Tracker",
        shortDesc: "Automated call tracking and logging",
        goodFor: "Sales Teams",
        price: "139",
        originalPrice: "167",
        type: "Monat",
        integrations: ["Phone Systems", "CRM", "Slack", "Analytics"],
        features: ["Call Logging", "Recording Sync", "Lead Attribution", "Reports"],
      },
      {
        id: "ivr-builder",
        name: "IVR Builder Bot",
        shortDesc: "Automated IVR system management",
        goodFor: "Support, Call Centers",
        price: "189",
        originalPrice: "227",
        type: "Monat",
        integrations: ["Twilio", "CRM", "Zendesk", "Database"],
        features: ["Menu Builder", "Routing Logic", "Analytics", "Updates"],
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════════
  //                    ANALYTICS & REPORTING BOTS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "analytics-reporting",
    name: "Analytics & Reporting",
    icon: "📈",
    color: "#F97316",
    description: "Analytics, dashboards, and reporting automation",
    bots: [
      {
        id: "analytics-aggregator",
        name: "Analytics Aggregator",
        shortDesc: "Combine data from all analytics sources",
        goodFor: "Marketing, Data Teams",
        price: "179",
        originalPrice: "215",
        type: "Monat",
        popular: true,
        integrations: ["Google Analytics", "Mixpanel", "Amplitude", "BigQuery"],
        features: ["Data Merge", "Dashboards", "Alerts", "Exports"],
      },
      {
        id: "dashboard-builder",
        name: "Dashboard Builder",
        shortDesc: "Automated dashboard creation",
        goodFor: "Data Teams, Executives",
        price: "159",
        originalPrice: "191",
        type: "Monat",
        integrations: ["Data Sources", "Google Sheets", "Slack", "Email"],
        features: ["Auto-Dashboards", "Real-time", "Sharing", "Scheduling"],
      },
      {
        id: "kpi-tracker",
        name: "KPI Tracker",
        shortDesc: "Automated KPI monitoring and alerts",
        goodFor: "Managers, Executives",
        price: "139",
        originalPrice: "167",
        type: "Monat",
        integrations: ["Any Data Source", "Slack", "Email", "SMS"],
        features: ["KPI Alerts", "Trends", "Forecasting", "Reports"],
      },
      {
        id: "report-scheduler",
        name: "Report Scheduler",
        shortDesc: "Automated report generation and delivery",
        goodFor: "Operations, Finance",
        price: "119",
        originalPrice: "143",
        type: "Monat",
        integrations: ["Data Sources", "Email", "Slack", "Google Drive"],
        features: ["Auto-Reports", "Scheduling", "Multi-Format", "Distribution"],
      },
      {
        id: "attribution-tracker",
        name: "Attribution Tracker",
        shortDesc: "Marketing attribution automation",
        goodFor: "Marketing Teams",
        price: "189",
        originalPrice: "227",
        type: "Monat",
        integrations: ["Ad Platforms", "CRM", "Analytics", "Database"],
        features: ["Multi-Touch", "ROI Tracking", "Reports", "Optimization"],
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════════
  //                    CONTENT & CMS BOTS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "content-cms",
    name: "Content & CMS",
    icon: "🌐",
    color: "#21759B",
    description: "WordPress, Webflow, and CMS automation",
    bots: [
      {
        id: "wordpress-automator",
        name: "WordPress Automator",
        shortDesc: "Complete WordPress content automation",
        goodFor: "Content Teams, Bloggers",
        price: "139",
        originalPrice: "167",
        type: "Monat",
        popular: true,
        integrations: ["WordPress", "OpenAI", "Google Sheets", "Social Media"],
        features: ["Auto-Publish", "SEO", "Image Handling", "Scheduling"],
      },
      {
        id: "webflow-connector",
        name: "Webflow Connector",
        shortDesc: "Webflow CMS automation",
        goodFor: "Designers, Agencies",
        price: "149",
        originalPrice: "179",
        type: "Monat",
        integrations: ["Webflow", "Airtable", "Google Sheets", "Email"],
        features: ["CMS Sync", "Form Handling", "E-commerce", "Notifications"],
      },
      {
        id: "contentful-automator",
        name: "Contentful Automator",
        shortDesc: "Headless CMS content automation",
        goodFor: "Dev Teams, Content",
        price: "169",
        originalPrice: "203",
        type: "Monat",
        integrations: ["Contentful", "GitHub", "Slack", "Translation APIs"],
        features: ["Content Sync", "Localization", "Workflows", "Publishing"],
      },
      {
        id: "ghost-connector",
        name: "Ghost Connector",
        shortDesc: "Ghost blog automation",
        goodFor: "Publishers, Bloggers",
        price: "109",
        originalPrice: "131",
        type: "Monat",
        integrations: ["Ghost", "Email", "Social Media", "Analytics"],
        features: ["Auto-Publish", "Newsletter", "Member Sync", "Analytics"],
      },
      {
        id: "seo-automator",
        name: "SEO Automator",
        shortDesc: "Automated SEO optimization",
        goodFor: "Marketing, Content",
        price: "159",
        originalPrice: "191",
        type: "Monat",
        integrations: ["WordPress", "Ahrefs", "Google Search Console", "OpenAI"],
        features: ["Keyword Tracking", "Content Optimization", "Audits", "Reports"],
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

      {/* TRUST SECTION */}
      <section className="py-10 sm:py-12 border-t border-white/5 bg-gradient-to-b from-transparent to-[#FC682C]/5">
        <div className="container px-4 sm:px-6">
          <div className="text-center mb-8">
            <span className="inline-block px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium mb-3">
              {t("trust.badge")}
            </span>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{t("trust.headline")}</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { value: "108+", label: t("trust.stats.bots") },
              { value: "2.061", label: t("trust.stats.workflows") },
              { value: "187+", label: t("trust.stats.integrations") },
              { value: "⭐ 5.0", label: t("trust.stats.rating") },
            ].map((stat, i) => (
              <div key={i} className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="text-2xl sm:text-3xl font-bold text-[#FC682C] mb-1">{stat.value}</div>
                <div className="text-xs text-white/50">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs text-white/40">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {t("trust.badges.noCode")}
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {t("trust.badges.hosted")}
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {t("trust.badges.gdpr")}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-12 sm:py-16 border-t border-white/5">
        <div className="container px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <span className="inline-block px-3 py-1 rounded-full bg-[#FC682C]/10 text-[#FC682C] text-xs font-medium mb-3">
                {t("faq.badge")}
              </span>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">{t("faq.headline")}</h2>
              <p className="text-sm text-white/60">{t("faq.subheadline")}</p>
            </div>

            <div className="space-y-3">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <details key={i} className="group rounded-xl bg-white/[0.02] border border-white/5 overflow-hidden">
                  <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/[0.02] transition-colors">
                    <span className="text-sm font-medium text-white pr-4">{t(`faq.items.${i}.q`)}</span>
                    <svg
                      className="w-5 h-5 text-[#FC682C] flex-shrink-0 transition-transform group-open:rotate-180"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-4 pb-4">
                    <p className="text-sm text-white/60 leading-relaxed">{t(`faq.items.${i}.a`)}</p>
                  </div>
                </details>
              ))}
            </div>
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
