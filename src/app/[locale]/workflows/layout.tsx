import { Metadata } from "next";
import { workflowsSEO, getCanonicalUrl, getOgLocale, SupportedLocale } from "@/lib/seo-config";

// Extended SEO content for workflows page
const seoContent = {
  de: {
    title: "169+ Premium Automation Bots & n8n Workflows kaufen | AgentFlowMarketing",
    description: "Fertige n8n Workflows & AI Bots für Marketing, Sales, E-Commerce, Support. WhatsApp Bots, Telegram Bots, OpenAI Integration. TikTok, Dropshipping, CRM Automation. Sofort einsatzbereit ab 59€/Monat.",
    keywords: [
      "n8n Workflows kaufen",
      "Automation Bots",
      "KI Bots kaufen",
      "WhatsApp Bot",
      "Telegram Bot Business",
      "OpenAI Bot",
      "ChatGPT Integration",
      "Marketing Automation",
      "Lead Generation Bot",
      "E-Commerce Automation",
      "Dropshipping Automatisierung",
      "TikTok Automation",
      "Sales Bot",
      "Support Bot",
      "CRM Automation",
      "Zapier Alternative",
      "Make Alternative",
      "No-Code Automation",
      "AI Agent kaufen",
      "Workflow Automatisierung",
      "Social Media Bot",
      "Instagram Automation",
      "LinkedIn Automation",
      "Email Automation",
      "HubSpot Integration",
      "Shopify Automation",
      "WooCommerce Bot",
      "Affiliate Marketing Bot",
      "Crypto Trading Bot",
      "Kundenservice Bot",
    ],
  },
  en: {
    title: "169+ Premium Automation Bots & n8n Workflows | AgentFlowMarketing",
    description: "Ready-to-use n8n workflows & AI bots for marketing, sales, e-commerce, support. WhatsApp bots, Telegram bots, OpenAI integration. TikTok, dropshipping, CRM automation. Deploy instantly from $59/month.",
    keywords: [
      "n8n workflows",
      "automation bots",
      "AI bots",
      "WhatsApp bot",
      "Telegram bot business",
      "OpenAI bot",
      "ChatGPT integration",
      "marketing automation",
      "lead generation bot",
      "e-commerce automation",
      "dropshipping automation",
      "TikTok automation",
      "sales bot",
      "support bot",
      "CRM automation",
      "Zapier alternative",
      "Make alternative",
      "no-code automation",
      "AI agent",
      "workflow automation",
    ],
  },
  ar: {
    title: "169+ بوتات أتمتة وسير عمل n8n جاهزة | AgentFlowMarketing",
    description: "سير عمل n8n وبوتات ذكاء اصطناعي جاهزة للتسويق والمبيعات والتجارة الإلكترونية والدعم. بوتات واتساب وتيليجرام وتكامل OpenAI. ابدأ فوراً.",
    keywords: [
      "n8n workflows",
      "automation bots",
      "WhatsApp bot",
      "Telegram bot",
      "AI automation",
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const content = seoContent[locale as keyof typeof seoContent] || seoContent.en;
  
  const url = locale === 'de' 
    ? 'https://agentflowm.de/de/workflows'
    : `https://agentflowm.com/${locale}/workflows`;

  return {
    title: content.title,
    description: content.description,
    keywords: content.keywords,
    alternates: {
      canonical: url,
      languages: {
        'de': 'https://agentflowm.de/de/workflows',
        'en': 'https://agentflowm.com/en/workflows',
        'ar': 'https://agentflowm.com/ar/workflows',
      },
    },
    openGraph: {
      title: content.title,
      description: content.description,
      url: url,
      siteName: "AgentFlowMarketing",
      locale: locale === "ar" ? "ar_SA" : locale === "de" ? "de_DE" : "en_US",
      type: "website",
      images: [
        {
          url: "/brand/banner-dark-1024x576.png",
          width: 1200,
          height: 630,
          alt: "169+ Premium Automation Bots & Workflows",
        },
        {
          url: "/brand/banner-dark-1024x576.png",
          width: 1024,
          height: 576,
          alt: "AgentFlowMarketing Automation Bots",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: content.title,
      description: content.description,
      images: ["/brand/banner-dark-1024x576.png"],
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  };
}

// JSON-LD Structured Data for the Workflows page
function WorkflowsJsonLd({ locale }: { locale: string }) {
  const content = seoContent[locale as keyof typeof seoContent] || seoContent.en;
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": content.title,
    "description": content.description,
    "numberOfItems": 169,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@type": "Product",
          "name": "GPT Support Bot",
          "description": "AI-powered customer support with GPT-4",
          "brand": { "@type": "Brand", "name": "AgentFlowMarketing" },
          "offers": {
            "@type": "Offer",
            "price": "199",
            "priceCurrency": "EUR",
            "priceValidUntil": "2025-12-31",
            "availability": "https://schema.org/InStock"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "127"
          }
        }
      },
      {
        "@type": "ListItem",
        "position": 2,
        "item": {
          "@type": "Product",
          "name": "TikTok Automator",
          "description": "Viral TikTok content automation",
          "brand": { "@type": "Brand", "name": "AgentFlowMarketing" },
          "offers": {
            "@type": "Offer",
            "price": "199",
            "priceCurrency": "EUR",
            "availability": "https://schema.org/InStock"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "567"
          }
        }
      },
      {
        "@type": "ListItem",
        "position": 3,
        "item": {
          "@type": "Product",
          "name": "WhatsApp CRM",
          "description": "Full CRM inside WhatsApp",
          "brand": { "@type": "Brand", "name": "AgentFlowMarketing" },
          "offers": {
            "@type": "Offer",
            "price": "179",
            "priceCurrency": "EUR",
            "availability": "https://schema.org/InStock"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "567"
          }
        }
      }
    ]
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": locale === 'de' ? "Was sind n8n Workflows?" : "What are n8n workflows?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": locale === 'de' 
            ? "n8n Workflows sind automatisierte Prozesse, die verschiedene Apps und Services miteinander verbinden. Unsere fertigen Workflows automatisieren Marketing, Sales, Support und mehr - sofort einsatzbereit."
            : "n8n workflows are automated processes that connect different apps and services. Our ready-made workflows automate marketing, sales, support and more - ready to deploy instantly."
        }
      },
      {
        "@type": "Question",
        "name": locale === 'de' ? "Wie funktionieren die Automation Bots?" : "How do the automation bots work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": locale === 'de'
            ? "Unsere Bots sind vorkonfigurierte n8n Workflows mit KI-Integration (OpenAI, etc.). Nach dem Kauf erhalten Sie den Workflow zum Import in Ihre n8n Instanz. Setup in unter 30 Minuten."
            : "Our bots are pre-configured n8n workflows with AI integration (OpenAI, etc.). After purchase, you receive the workflow to import into your n8n instance. Setup in under 30 minutes."
        }
      },
      {
        "@type": "Question",
        "name": locale === 'de' ? "Brauche ich Programmierkenntnisse?" : "Do I need programming skills?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": locale === 'de'
            ? "Nein! Alle Bots sind No-Code und sofort einsatzbereit. Sie müssen nur Ihre API-Keys eintragen und können loslegen. Wir bieten auch Setup-Support an."
            : "No! All bots are no-code and ready to use immediately. You just need to enter your API keys and you're good to go. We also offer setup support."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}

export default async function WorkflowsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  return (
    <>
      <WorkflowsJsonLd locale={locale} />
      {children}
    </>
  );
}
