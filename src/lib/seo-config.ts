// ═══════════════════════════════════════════════════════════════
//                    SEO CONFIGURATION
//  Centralized SEO metadata for all pages across all languages
// ═══════════════════════════════════════════════════════════════

export const BASE_URL_DE = "https://agentflowm.de";
export const BASE_URL_COM = "https://agentflowm.com";

export type SupportedLocale = "de" | "en" | "ar";

export interface PageSEO {
  title: string;
  description: string;
  keywords: string[];
}

export interface PageSEOConfig {
  de: PageSEO;
  en: PageSEO;
  ar: PageSEO;
}

// ═══════════════════════════════════════════════════════════════
//                    HOME PAGE SEO
// ═══════════════════════════════════════════════════════════════
export const homeSEO: PageSEOConfig = {
  de: {
    title: "AgentFlowMarketing - KI-Automatisierung & Workflow Bots aus Berlin",
    description: "169+ fertige Automation-Bots für Marketing, Sales & Support. n8n Workflows, OpenAI, WhatsApp & Telegram Bots. Professionelle Websites aus Berlin. Sofort einsatzbereit.",
    keywords: [
      "Automation Agentur Berlin",
      "KI Automatisierung",
      "n8n Workflows",
      "Website Agentur Berlin",
      "Marketing Automation",
      "WhatsApp Business Bot",
      "Telegram Bot erstellen",
      "OpenAI Integration",
      "No-Code Automation",
      "Workflow Automatisierung",
    ],
  },
  en: {
    title: "AgentFlowMarketing - AI Automation & Workflow Bots from Berlin",
    description: "169+ ready-to-deploy automation bots for marketing, sales & support. n8n workflows, OpenAI, WhatsApp & Telegram bots. Professional websites from Berlin. Deploy instantly.",
    keywords: [
      "automation agency Berlin",
      "AI automation",
      "n8n workflows",
      "website agency Berlin",
      "marketing automation",
      "WhatsApp business bot",
      "Telegram bot development",
      "OpenAI integration",
      "no-code automation",
      "workflow automation",
    ],
  },
  ar: {
    title: "AgentFlowMarketing - أتمتة الذكاء الاصطناعي وبوتات من برلين",
    description: "169+ بوت أتمتة جاهز للتسويق والمبيعات والدعم. سير عمل n8n، واتساب، تيليجرام، OpenAI. مواقع احترافية من برلين. ابدأ فوراً.",
    keywords: [
      "وكالة أتمتة برلين",
      "أتمتة ذكاء اصطناعي",
      "بوت واتساب",
      "بوت تيليجرام",
      "تسويق رقمي",
      "أتمتة بدون كود",
      "تصميم مواقع",
    ],
  },
};

// ═══════════════════════════════════════════════════════════════
//                    WORKFLOWS PAGE SEO
// ═══════════════════════════════════════════════════════════════
export const workflowsSEO: PageSEOConfig = {
  de: {
    title: "169+ Premium Automation Bots & n8n Workflows kaufen",
    description: "Fertige n8n Workflows & AI Bots für Marketing, Sales, E-Commerce, Support. WhatsApp Bots, Telegram Bots, OpenAI Integration. TikTok, Dropshipping, CRM. Ab 59€/Monat.",
    keywords: [
      "n8n Workflows kaufen",
      "Automation Bots kaufen",
      "KI Bots kaufen",
      "WhatsApp Bot kaufen",
      "Telegram Bot Business",
      "OpenAI Bot",
      "ChatGPT Integration",
      "Marketing Automation Bot",
      "Lead Generation Bot",
      "E-Commerce Automation",
      "Dropshipping Bot",
      "TikTok Automation",
      "Sales Bot",
      "Support Bot",
      "CRM Automation",
      "Zapier Alternative",
      "Make Alternative",
      "No-Code Automation",
      "AI Agent kaufen",
      "Social Media Bot",
      "Instagram Automation",
      "LinkedIn Automation",
      "Shopify Automation",
      "WooCommerce Bot",
      "Crypto Trading Bot",
    ],
  },
  en: {
    title: "169+ Premium Automation Bots & n8n Workflows | Buy Now",
    description: "Ready-to-use n8n workflows & AI bots for marketing, sales, e-commerce, support. WhatsApp bots, Telegram bots, OpenAI integration. TikTok, dropshipping, CRM. From $59/month.",
    keywords: [
      "buy n8n workflows",
      "automation bots for sale",
      "AI bots marketplace",
      "WhatsApp bot service",
      "Telegram bot for business",
      "OpenAI bot integration",
      "ChatGPT automation",
      "marketing automation bots",
      "lead generation automation",
      "e-commerce bots",
      "dropshipping automation",
      "TikTok marketing bot",
      "sales automation AI",
      "customer support bot",
      "CRM automation tools",
      "Zapier alternative",
      "Make.com alternative",
      "no-code workflow builder",
      "AI agents for business",
      "social media automation",
      "Instagram growth bot",
      "LinkedIn automation tool",
      "Shopify automation",
      "crypto trading automation",
    ],
  },
  ar: {
    title: "169+ بوت أتمتة وسير عمل n8n جاهزة | اشترِ الآن",
    description: "بوتات ذكاء اصطناعي جاهزة للتسويق والمبيعات والتجارة الإلكترونية. بوت واتساب، تيليجرام، ChatGPT. تيك توك، دروبشيبينج، CRM. من 59$ شهرياً.",
    keywords: [
      "شراء بوتات أتمتة",
      "بوت واتساب للأعمال",
      "بوت تيليجرام تجاري",
      "أتمتة التسويق",
      "بوت ذكاء اصطناعي",
      "ChatGPT للأعمال",
      "أتمتة المبيعات",
      "بوت خدمة العملاء",
      "أتمتة التجارة الإلكترونية",
      "بوت تيك توك",
      "دروبشيبينج أتمتة",
      "توليد العملاء المحتملين",
      "أتمتة السوشيال ميديا",
      "بوت انستقرام",
      "أتمتة لينكد إن",
    ],
  },
};

// ═══════════════════════════════════════════════════════════════
//                    PACKAGES PAGE SEO
// ═══════════════════════════════════════════════════════════════
export const packagesSEO: PageSEOConfig = {
  de: {
    title: "Website & Workflow Pakete | Festpreise ab 3.790€",
    description: "Professionelle Website-Pakete mit Workflows & Automatisierung. START ab 3.790€, BUSINESS ab 8.390€. Festpreise, keine versteckten Kosten. Made in Berlin.",
    keywords: [
      "Website Paket kaufen",
      "Website Festpreis",
      "Webdesign Pakete",
      "Website mit Automatisierung",
      "Landing Page erstellen",
      "Business Website Kosten",
      "Professionelle Website Berlin",
      "Next.js Website",
      "React Website Agentur",
    ],
  },
  en: {
    title: "Website & Workflow Packages | Fixed Prices from €3,790",
    description: "Professional website packages with workflows & automation. START from €3,790, BUSINESS from €8,390. Fixed prices, no hidden costs. Made in Berlin.",
    keywords: [
      "website packages",
      "fixed price website",
      "web design packages",
      "website with automation",
      "landing page design",
      "business website cost",
      "professional website Berlin",
      "Next.js website",
      "React website agency",
    ],
  },
  ar: {
    title: "باقات المواقع والأتمتة | أسعار ثابتة من 3,790€",
    description: "باقات مواقع احترافية مع أتمتة. باقة START من 3,790€، BUSINESS من 8,390€. أسعار ثابتة بدون تكاليف خفية. صنع في برلين.",
    keywords: [
      "باقات تصميم مواقع",
      "سعر موقع ثابت",
      "تصميم موقع احترافي",
      "موقع مع أتمتة",
      "صفحة هبوط",
      "تكلفة موقع تجاري",
    ],
  },
};

// ═══════════════════════════════════════════════════════════════
//                    SOLUTION PAGE SEO
// ═══════════════════════════════════════════════════════════════
export const solutionSEO: PageSEOConfig = {
  de: {
    title: "Unsere Lösung: Website + Workflows = Wachstum",
    description: "Schluss mit verlorenen Leads und manuellem Chaos. Unsere Lösung verbindet professionelle Websites mit intelligenten Workflows für automatisches Wachstum.",
    keywords: [
      "Business Automation Lösung",
      "Lead Management System",
      "Automatisierte Kundengewinnung",
      "Workflow Optimierung",
      "Prozessautomatisierung",
      "Digitale Transformation",
    ],
  },
  en: {
    title: "Our Solution: Website + Workflows = Growth",
    description: "Stop losing leads and manual chaos. Our solution combines professional websites with intelligent workflows for automatic growth.",
    keywords: [
      "business automation solution",
      "lead management system",
      "automated customer acquisition",
      "workflow optimization",
      "process automation",
      "digital transformation",
    ],
  },
  ar: {
    title: "حلنا: موقع + أتمتة = نمو",
    description: "توقف عن خسارة العملاء المحتملين والفوضى اليدوية. حلنا يجمع بين المواقع الاحترافية وسير العمل الذكي للنمو التلقائي.",
    keywords: [
      "حل أتمتة الأعمال",
      "نظام إدارة العملاء",
      "اكتساب العملاء التلقائي",
      "تحسين سير العمل",
    ],
  },
};

// ═══════════════════════════════════════════════════════════════
//                    PROJECTS PAGE SEO
// ═══════════════════════════════════════════════════════════════
export const projectsSEO: PageSEOConfig = {
  de: {
    title: "Unsere Projekte & Referenzen | AgentFlowMarketing",
    description: "Entdecken Sie unsere erfolgreichen Projekte: Websites, Portale, Workflows und Automatisierungen für Kunden aus verschiedenen Branchen.",
    keywords: [
      "Webdesign Portfolio",
      "Automation Projekte",
      "Website Referenzen",
      "Kundenprojekte Berlin",
      "Case Studies Automation",
    ],
  },
  en: {
    title: "Our Projects & References | AgentFlowMarketing",
    description: "Discover our successful projects: websites, portals, workflows and automations for clients from various industries.",
    keywords: [
      "web design portfolio",
      "automation projects",
      "website references",
      "client projects Berlin",
      "automation case studies",
    ],
  },
  ar: {
    title: "مشاريعنا ومراجعنا | AgentFlowMarketing",
    description: "اكتشف مشاريعنا الناجحة: مواقع، بوابات، سير عمل وأتمتة لعملاء من مختلف الصناعات.",
    keywords: [
      "معرض تصميم المواقع",
      "مشاريع الأتمتة",
      "مراجع المواقع",
      "دراسات حالة",
    ],
  },
};

// ═══════════════════════════════════════════════════════════════
//                    TOOLS PAGE SEO
// ═══════════════════════════════════════════════════════════════
export const toolsSEO: PageSEOConfig = {
  de: {
    title: "Kostenlose Tools & Rechner | AgentFlowMarketing",
    description: "Kostenlose Business-Tools: Website-ROI-Rechner, Automation-Kalkulator, Lead-Wert-Rechner und mehr. Optimieren Sie Ihre Prozesse.",
    keywords: [
      "kostenlose Business Tools",
      "ROI Rechner Website",
      "Automation Kalkulator",
      "Lead Wert berechnen",
      "Marketing Tools kostenlos",
    ],
  },
  en: {
    title: "Free Tools & Calculators | AgentFlowMarketing",
    description: "Free business tools: Website ROI calculator, automation calculator, lead value calculator and more. Optimize your processes.",
    keywords: [
      "free business tools",
      "website ROI calculator",
      "automation calculator",
      "lead value calculator",
      "free marketing tools",
    ],
  },
  ar: {
    title: "أدوات وحاسبات مجانية | AgentFlowMarketing",
    description: "أدوات أعمال مجانية: حاسبة عائد الموقع، حاسبة الأتمتة، حاسبة قيمة العميل المحتمل والمزيد.",
    keywords: [
      "أدوات أعمال مجانية",
      "حاسبة عائد الاستثمار",
      "حاسبة الأتمتة",
      "أدوات تسويق مجانية",
    ],
  },
};

// ═══════════════════════════════════════════════════════════════
//                    CONTACT PAGE SEO
// ═══════════════════════════════════════════════════════════════
export const contactSEO: PageSEOConfig = {
  de: {
    title: "Kontakt | Kostenlose Beratung buchen | AgentFlowMarketing",
    description: "Kontaktieren Sie uns für eine kostenlose Beratung. WhatsApp, Telefon oder Termin buchen. Wir antworten innerhalb von 24 Stunden.",
    keywords: [
      "Automation Beratung",
      "Website Beratung kostenlos",
      "Kontakt Agentur Berlin",
      "Termin buchen",
      "WhatsApp Kontakt",
    ],
  },
  en: {
    title: "Contact | Book Free Consultation | AgentFlowMarketing",
    description: "Contact us for a free consultation. WhatsApp, phone or book an appointment. We respond within 24 hours.",
    keywords: [
      "automation consultation",
      "free website consultation",
      "contact agency Berlin",
      "book appointment",
      "WhatsApp contact",
    ],
  },
  ar: {
    title: "اتصل بنا | احجز استشارة مجانية | AgentFlowMarketing",
    description: "تواصل معنا للحصول على استشارة مجانية. واتساب، هاتف أو احجز موعد. نرد خلال 24 ساعة.",
    keywords: [
      "استشارة أتمتة",
      "استشارة موقع مجانية",
      "تواصل وكالة برلين",
      "حجز موعد",
    ],
  },
};

// ═══════════════════════════════════════════════════════════════
//                    HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

export function getBaseUrl(locale: string): string {
  return locale === "de" ? BASE_URL_DE : BASE_URL_COM;
}

export function getCanonicalUrl(locale: string, path: string): string {
  const baseUrl = getBaseUrl(locale);
  return `${baseUrl}/${locale}${path}`;
}

export function getAlternateUrls(path: string) {
  return {
    de: `${BASE_URL_DE}/de${path}`,
    en: `${BASE_URL_COM}/en${path}`,
    ar: `${BASE_URL_COM}/ar${path}`,
  };
}

export function getOgLocale(locale: string): string {
  switch (locale) {
    case "de": return "de_DE";
    case "ar": return "ar_SA";
    default: return "en_US";
  }
}
