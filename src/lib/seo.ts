import { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://agentflowm.com';

interface PageSEO {
  title: string;
  description: string;
  path: string;
  locale: string;
}

export function generatePageMetadata({ title, description, path, locale }: PageSEO): Metadata {
  const url = `${BASE_URL}/${locale}${path}`;
  
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        'de': `${BASE_URL}/de${path}`,
        'en': `${BASE_URL}/en${path}`,
        'ar': `${BASE_URL}/ar${path}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'AgentFlowMarketing',
      locale: locale === 'de' ? 'de_DE' : locale === 'ar' ? 'ar_SA' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

// Pre-defined SEO data for pages
export const pageSEO: Record<string, Record<string, { title: string; description: string }>> = {
  pakete: {
    de: {
      title: 'Website-Pakete & Preise | AgentFlowMarketing',
      description: 'Professionelle Website-Pakete ab 3.790€. One-Page, Business, Growth - alle mit KI-Workflows und 12 Monate Support.',
    },
    en: {
      title: 'Website Packages & Pricing | AgentFlowMarketing',
      description: 'Professional website packages from €3,790. One-Page, Business, Growth - all with AI workflows and 12 months support.',
    },
    ar: {
      title: 'باقات المواقع والأسعار | AgentFlowMarketing',
      description: 'باقات مواقع احترافية تبدأ من 3,790 يورو. صفحة واحدة، أعمال، نمو - الكل مع تدفقات الذكاء الاصطناعي و12 شهر دعم.',
    },
  },
  loesung: {
    de: {
      title: 'Unsere Lösung - Websites & Workflows | AgentFlowMarketing',
      description: 'Websites, die Systeme schließen. Automatisierte Workflows für Kontakt, Veröffentlichung und Übergabe.',
    },
    en: {
      title: 'Our Solution - Websites & Workflows | AgentFlowMarketing',
      description: 'Websites that close system gaps. Automated workflows for contact, publishing, and handover.',
    },
    ar: {
      title: 'حلنا - مواقع وتدفقات العمل | AgentFlowMarketing',
      description: 'مواقع تسد فجوات النظام. تدفقات عمل آلية للتواصل والنشر والتسليم.',
    },
  },
  projekte: {
    de: {
      title: 'Projekte & Referenzen | AgentFlowMarketing',
      description: 'Erfolgreiche Website-Projekte und Kundenstimmen. Sehen Sie unsere Arbeit in Aktion.',
    },
    en: {
      title: 'Projects & References | AgentFlowMarketing',
      description: 'Successful website projects and client testimonials. See our work in action.',
    },
    ar: {
      title: 'المشاريع والمراجع | AgentFlowMarketing',
      description: 'مشاريع مواقع ناجحة وشهادات العملاء. شاهد عملنا في العمل.',
    },
  },
  tools: {
    de: {
      title: 'Kostenlose Tools | AgentFlowMarketing',
      description: 'Kostenlose Business-Tools: Website-Check, SEO-Analyse und mehr. Ohne Anmeldung nutzbar.',
    },
    en: {
      title: 'Free Tools | AgentFlowMarketing',
      description: 'Free business tools: Website check, SEO analysis and more. No registration required.',
    },
    ar: {
      title: 'أدوات مجانية | AgentFlowMarketing',
      description: 'أدوات أعمال مجانية: فحص الموقع، تحليل SEO والمزيد. بدون تسجيل.',
    },
  },
  workflows: {
    de: {
      title: 'Bot Shop - 100+ Premium Automatisierungs-Bots | AgentFlowMarketing',
      description: 'Sofort einsetzbare Bots für Marketing, Vertrieb und Operations. Einmal kaufen, für immer nutzen.',
    },
    en: {
      title: 'Bot Shop - 100+ Premium Automation Bots | AgentFlowMarketing',
      description: 'Ready-to-use bots for marketing, sales, and operations. Buy once, use forever.',
    },
    ar: {
      title: 'متجر البوتات - 100+ بوت أتمتة متميز | AgentFlowMarketing',
      description: 'بوتات جاهزة للاستخدام للتسويق والمبيعات والعمليات. اشترِ مرة واستخدم للأبد.',
    },
  },
  termin: {
    de: {
      title: 'Termin buchen - Kostenlose Beratung | AgentFlowMarketing',
      description: 'Buchen Sie ein kostenloses Beratungsgespräch. Wir analysieren Ihre Anforderungen und zeigen passende Lösungen.',
    },
    en: {
      title: 'Book Appointment - Free Consultation | AgentFlowMarketing',
      description: 'Book a free consultation. We analyze your requirements and show suitable solutions.',
    },
    ar: {
      title: 'احجز موعد - استشارة مجانية | AgentFlowMarketing',
      description: 'احجز استشارة مجانية. نحلل متطلباتك ونعرض الحلول المناسبة.',
    },
  },
  international: {
    de: {
      title: 'Internationale Projekte - Syrien Aufbau | AgentFlowMarketing',
      description: 'Digitale Systeme für den Wiederaufbau. Immobilien, Mobilität, Tourismus, Handel - strukturiert und skalierbar.',
    },
    en: {
      title: 'International Projects - Syria Rebuilding | AgentFlowMarketing',
      description: 'Digital systems for rebuilding. Real estate, mobility, tourism, trade - structured and scalable.',
    },
    ar: {
      title: 'مشاريع دولية - إعادة بناء سوريا | AgentFlowMarketing',
      description: 'أنظمة رقمية لإعادة البناء. عقارات، تنقل، سياحة، تجارة - منظمة وقابلة للتوسع.',
    },
  },
  impressum: {
    de: {
      title: 'Impressum | AgentFlowMarketing',
      description: 'Impressum und rechtliche Informationen von AgentFlowMarketing.',
    },
    en: {
      title: 'Imprint | AgentFlowMarketing',
      description: 'Legal notice and information from AgentFlowMarketing.',
    },
    ar: {
      title: 'البصمة | AgentFlowMarketing',
      description: 'إشعار قانوني ومعلومات من AgentFlowMarketing.',
    },
  },
  datenschutz: {
    de: {
      title: 'Datenschutz | AgentFlowMarketing',
      description: 'Datenschutzerklärung von AgentFlowMarketing. Informationen zur Verarbeitung Ihrer Daten.',
    },
    en: {
      title: 'Privacy Policy | AgentFlowMarketing',
      description: 'Privacy policy of AgentFlowMarketing. Information about the processing of your data.',
    },
    ar: {
      title: 'سياسة الخصوصية | AgentFlowMarketing',
      description: 'سياسة خصوصية AgentFlowMarketing. معلومات حول معالجة بياناتك.',
    },
  },
  agb: {
    de: {
      title: 'AGB | AgentFlowMarketing',
      description: 'Allgemeine Geschäftsbedingungen von AgentFlowMarketing.',
    },
    en: {
      title: 'Terms & Conditions | AgentFlowMarketing',
      description: 'Terms and conditions of AgentFlowMarketing.',
    },
    ar: {
      title: 'الشروط والأحكام | AgentFlowMarketing',
      description: 'شروط وأحكام AgentFlowMarketing.',
    },
  },
  'website-check': {
    de: {
      title: 'Kostenloser Website-Check | AgentFlowMarketing',
      description: 'Analysieren Sie Ihre Website kostenlos. Performance, SEO, Sicherheit - in 30 Sekunden.',
    },
    en: {
      title: 'Free Website Check | AgentFlowMarketing',
      description: 'Analyze your website for free. Performance, SEO, security - in 30 seconds.',
    },
    ar: {
      title: 'فحص موقع مجاني | AgentFlowMarketing',
      description: 'حلل موقعك مجاناً. الأداء، SEO، الأمان - في 30 ثانية.',
    },
  },
};
