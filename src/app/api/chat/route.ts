import { NextRequest, NextResponse } from "next/server";

// AgentFlow knowledge base
const KNOWLEDGE_BASE = {
  company: {
    name: "AgentFlowMarketing",
    tagline: "Websites · Workflows · Business Automation",
    email: "info@agentflowm.de",
    phone: "+49 179 949 8247",
    address: "Achillesstraße 69A, 13125 Berlin",
    calendly: "https://calendly.com/agentflowm/15min",
  },
  packages: {
    start: {
      name: "START",
      price: "3.790 €",
      priceGross: "4.510 € inkl. MwSt",
      description: "Website + Admin Dashboard",
      features: [
        "Professionelle Website",
        "Admin Dashboard",
        "Mobile optimiert",
        "SEO Grundlagen",
        "3 Monate Support",
      ],
      ideal: "Schneller, professioneller Start für kleine Unternehmen",
    },
    business: {
      name: "BUSINESS",
      price: "8.390 €",
      priceGross: "9.984 € inkl. MwSt",
      description: "Website + Admin + Portale",
      features: [
        "Alles aus START",
        "Kunden-Portal",
        "Mitarbeiter-Portal",
        "Workflow Automation",
        "6 Monate Support",
      ],
      ideal: "Wachstum mit Struktur für mittlere Unternehmen",
    },
    webapp: {
      name: "Web App",
      price: "18.990 €",
      priceGross: "22.598 € inkl. MwSt",
      description: "Custom Web Application",
      features: [
        "Browserbasiertes System",
        "User Management",
        "Role-based Access",
        "API Integration",
        "12 Monate Support",
      ],
      ideal: "Individuelle Webanwendungen",
    },
    mobile: {
      name: "Mobile App",
      price: "35.990 €",
      priceGross: "42.828 € inkl. MwSt",
      description: "iOS & Android App",
      features: [
        "iOS & Android",
        "Push Notifications",
        "Offline Mode",
        "App Store Deployment",
        "12 Monate Support",
      ],
      ideal: "Komplette App-Umsetzung",
    },
  },
  timeline: {
    start: "4-6 Wochen",
    business: "8-12 Wochen",
    webapp: "12-16 Wochen",
    mobile: "16-24 Wochen",
  },
  services: [
    "Website-Entwicklung",
    "Web-Applikationen",
    "Mobile Apps",
    "Workflow Automation",
    "Admin Dashboards",
    "Kunden- und Mitarbeiterportale",
    "API Entwicklung",
    "SEO Optimierung",
  ],
};

// Simple AI response logic (can be replaced with OpenAI/Claude later)
function generateResponse(message: string, history: any[]): { response: string; collectLead: boolean } {
  const lowerMessage = message.toLowerCase();
  let collectLead = false;

  // Greeting
  if (lowerMessage.match(/^(hi|hey|hallo|moin|servus|guten tag)/)) {
    return {
      response: "Hey! 👋 Schön dass du hier bist! Wie kann ich dir helfen?\n\nIch kann dir Infos geben zu:\n• Pakete & Preise\n• Projektdauer\n• Unsere Services",
      collectLead: false,
    };
  }

  // Pricing questions
  if (lowerMessage.match(/preis|kosten|was kostet|wie teuer|budget|geld|euro|€/)) {
    collectLead = true;
    return {
      response: `Hier unsere Pakete:\n\n🚀 **START** - ${KNOWLEDGE_BASE.packages.start.price} netto\n${KNOWLEDGE_BASE.packages.start.description}\n\n📈 **BUSINESS** - ${KNOWLEDGE_BASE.packages.business.price} netto\n${KNOWLEDGE_BASE.packages.business.description}\n\n💻 **Web App** - ${KNOWLEDGE_BASE.packages.webapp.price} netto\n${KNOWLEDGE_BASE.packages.webapp.description}\n\n📱 **Mobile App** - ${KNOWLEDGE_BASE.packages.mobile.price} netto\n${KNOWLEDGE_BASE.packages.mobile.description}\n\nMöchtest du mehr Details zu einem Paket?`,
      collectLead,
    };
  }

  // START package
  if (lowerMessage.match(/start paket|start-paket|starter/)) {
    collectLead = true;
    return {
      response: `🚀 **START Paket** - ${KNOWLEDGE_BASE.packages.start.price} netto\n\n${KNOWLEDGE_BASE.packages.start.features.map(f => `✓ ${f}`).join("\n")}\n\n⏱️ Dauer: ${KNOWLEDGE_BASE.timeline.start}\n\n${KNOWLEDGE_BASE.packages.start.ideal}\n\nSoll ich dir ein Angebot schicken?`,
      collectLead,
    };
  }

  // BUSINESS package
  if (lowerMessage.match(/business paket|business-paket/)) {
    collectLead = true;
    return {
      response: `📈 **BUSINESS Paket** - ${KNOWLEDGE_BASE.packages.business.price} netto\n\n${KNOWLEDGE_BASE.packages.business.features.map(f => `✓ ${f}`).join("\n")}\n\n⏱️ Dauer: ${KNOWLEDGE_BASE.timeline.business}\n\n${KNOWLEDGE_BASE.packages.business.ideal}\n\nSoll ich dir ein Angebot schicken?`,
      collectLead,
    };
  }

  // Web App
  if (lowerMessage.match(/web app|webapp|webanwendung/)) {
    collectLead = true;
    return {
      response: `💻 **Web App** - ${KNOWLEDGE_BASE.packages.webapp.price} netto\n\n${KNOWLEDGE_BASE.packages.webapp.features.map(f => `✓ ${f}`).join("\n")}\n\n⏱️ Dauer: ${KNOWLEDGE_BASE.timeline.webapp}\n\n${KNOWLEDGE_BASE.packages.webapp.ideal}\n\nWas für eine App schwebt dir vor?`,
      collectLead,
    };
  }

  // Mobile App
  if (lowerMessage.match(/mobile app|app entwicklung|ios|android|handy app/)) {
    collectLead = true;
    return {
      response: `📱 **Mobile App** - ${KNOWLEDGE_BASE.packages.mobile.price} netto\n\n${KNOWLEDGE_BASE.packages.mobile.features.map(f => `✓ ${f}`).join("\n")}\n\n⏱️ Dauer: ${KNOWLEDGE_BASE.timeline.mobile}\n\n${KNOWLEDGE_BASE.packages.mobile.ideal}\n\nWas soll deine App können?`,
      collectLead,
    };
  }

  // Website questions
  if (lowerMessage.match(/website|webseite|homepage|internetseite|online präsenz/)) {
    collectLead = true;
    return {
      response: `Für Websites haben wir zwei Pakete:\n\n🚀 **START** (${KNOWLEDGE_BASE.packages.start.price})\nPerfekt für den schnellen Start - Website + Admin Dashboard\n\n📈 **BUSINESS** (${KNOWLEDGE_BASE.packages.business.price})\nMit Kunden- & Mitarbeiterportal für wachsende Teams\n\nWas brauchst du genau?`,
      collectLead,
    };
  }

  // Timeline questions
  if (lowerMessage.match(/wie lange|dauer|zeit|wann fertig|zeitrahmen|deadline/)) {
    return {
      response: `⏱️ Projektdauer:\n\n• START: ${KNOWLEDGE_BASE.timeline.start}\n• BUSINESS: ${KNOWLEDGE_BASE.timeline.business}\n• Web App: ${KNOWLEDGE_BASE.timeline.webapp}\n• Mobile App: ${KNOWLEDGE_BASE.timeline.mobile}\n\nDas hängt natürlich auch vom Umfang ab. Wann brauchst du es?`,
      collectLead: true,
    };
  }

  // Booking/Termin
  if (lowerMessage.match(/termin|buchen|gespräch|call|meeting|beratung|telefonat/)) {
    return {
      response: `Klar! 📅 Buch dir hier einen kostenlosen 15-Min Call:\n\n👉 ${KNOWLEDGE_BASE.company.calendly}\n\nWir besprechen dein Projekt und ich geb dir eine ehrliche Einschätzung.`,
      collectLead: true,
    };
  }

  // Contact
  if (lowerMessage.match(/kontakt|email|telefon|anrufen|erreichen|schreiben/)) {
    return {
      response: `Du erreichst uns so:\n\n📧 ${KNOWLEDGE_BASE.company.email}\n📞 ${KNOWLEDGE_BASE.company.phone}\n📍 ${KNOWLEDGE_BASE.company.address}\n\nOder buch direkt einen Termin:\n👉 ${KNOWLEDGE_BASE.company.calendly}`,
      collectLead: false,
    };
  }

  // Services
  if (lowerMessage.match(/was macht ihr|was bietet|services|leistungen|angebot/)) {
    return {
      response: `Wir machen:\n\n${KNOWLEDGE_BASE.services.map(s => `• ${s}`).join("\n")}\n\nKurz: Alles was dein Business digital nach vorne bringt! 🚀\n\nWas brauchst du?`,
      collectLead: false,
    };
  }

  // Positive/Ready to buy signals
  if (lowerMessage.match(/interessiert|will|möchte|brauche|klingt gut|ja|genau|perfekt|passt/)) {
    collectLead = true;
    return {
      response: `Super! 🎯 Lass uns das konkret machen.\n\nAm besten buchst du einen kurzen Call, dann besprechen wir alles:\n👉 ${KNOWLEDGE_BASE.company.calendly}\n\nOder lass deine Kontaktdaten hier und wir melden uns!`,
      collectLead,
    };
  }

  // Thanks
  if (lowerMessage.match(/danke|thx|thanks|vielen dank/)) {
    return {
      response: "Gerne! 😊 Wenn du noch Fragen hast, frag einfach. Oder buch dir direkt einen Termin:\n👉 " + KNOWLEDGE_BASE.company.calendly,
      collectLead: false,
    };
  }

  // Default / fallback
  collectLead = history.length > 4;
  return {
    response: `Gute Frage! 🤔\n\nDafür sprechen wir am besten kurz - dann kann ich dir genau sagen was möglich ist.\n\n📅 Termin buchen: ${KNOWLEDGE_BASE.company.calendly}\n\nOder beschreib mir dein Projekt genauer!`,
    collectLead,
  };
}

export async function POST(request: NextRequest) {
  try {
    const { message, history, leadInfo } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message required" },
        { status: 400 }
      );
    }

    // Generate response
    const { response, collectLead } = generateResponse(message, history || []);

    return NextResponse.json({
      response,
      collectLead: collectLead && !leadInfo?.collected,
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: error.message || "Chat failed" },
      { status: 500 }
    );
  }
}
