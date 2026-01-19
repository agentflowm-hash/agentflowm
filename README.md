# AgentFlowMarketing

Webseiten, Workflows, Schnittstellen - als sauberes System.

## Quick Start

```bash
# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev
```

Website laeuft auf http://localhost:3000

## Build & Export

```bash
# Statische Website erstellen
npm run build

# Ausgabe in /out Ordner
```

## Projekt-Struktur

```
agentflow-marketing/
├── src/
│   ├── app/                 # Next.js App Router Seiten
│   │   ├── page.tsx         # Home
│   │   ├── loesung/         # Loesung-Seite
│   │   ├── pakete/          # Pakete & Preise
│   │   ├── projekte/        # Projekte
│   │   ├── tools/           # Tools
│   │   ├── website-check/   # Website-Check Tool
│   │   ├── termin/          # Termin buchen
│   │   ├── referral/        # Empfehlungsprogramm
│   │   ├── impressum/       # Impressum
│   │   └── datenschutz/     # Datenschutz
│   │
│   ├── components/
│   │   ├── ui/              # Basis-Komponenten (Button, Card, Badge, Input)
│   │   ├── layout/          # Header, Footer, ThemeToggle
│   │   └── sections/        # Sektionen (Hero, Pricing, etc.)
│   │
│   ├── styles/
│   │   └── globals.css      # Globale Styles & CSS Variables
│   │
│   └── lib/                 # Hilfsfunktionen
│
├── telegram-bot/            # Telegram Bot fuer Vertrieb
│   ├── bot.js
│   └── README.md
│
├── public/                  # Statische Assets
│   ├── favicon.svg
│   ├── brand/
│   └── media/
│
└── package.json
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Komponenten**: React
- **Telegram Bot**: grammy.js
- **Deployment**: Statischer Export (ueberall hostbar)

## Seiten

| Route | Beschreibung |
|-------|--------------|
| `/` | Home - Hero, Problem, Loesung |
| `/loesung` | Unsere Loesung (4 Schritte) |
| `/pakete` | Pakete & Preise |
| `/projekte` | Projekt-Referenzen |
| `/tools` | Tools & Modelle |
| `/website-check` | Kostenloser Website-Check |
| `/termin` | Termin buchen |
| `/referral` | Empfehlungsprogramm |
| `/impressum` | Impressum |
| `/datenschutz` | Datenschutz |

## Design System

### Farben

**Light Mode (Pearl Sky)**
- Background: #F7FAFF
- Text: #0B1220
- Accent: #2563EB (Blue)
- Accent2: #06B6D4 (Cyan)
- Accent3: #7C3AED (Violet)

**Dark Mode (Midnight Iris)**
- Background: #070A12
- Text: #F8FAFC
- Accent: #8B5CF6 (Violet)
- Accent2: #22D3EE (Cyan)
- Accent3: #60A5FA (Blue)

### Pakete

| Paket | Preis | Umfang |
|-------|-------|--------|
| One Page | ab 1.390 EUR | 1 Seite |
| Business | 6.990 EUR | bis 10 Seiten + Publishing-Agent |
| Growth | ab 10.990 EUR | bis 13 Seiten + Publishing + Leads |

## Telegram Bot

Separater Bot fuer Kundenanfragen:

```bash
cd telegram-bot
npm install
# Token in .env setzen
npm start
```

Siehe `telegram-bot/README.md` fuer Details.

## Deployment

### Statisches Hosting (kostenlos)

1. **GitHub Pages**
```bash
npm run build
# /out Ordner deployen
```

2. **Netlify**
- Drag & Drop /out Ordner
- Oder GitHub verbinden

3. **Cloudflare Pages**
- GitHub Repository verbinden
- Build Command: `npm run build`
- Output: `out`

### Telegram Bot Hosting

- Railway.app (kostenlos)
- Render.com (kostenlos)
- Eigener Server mit PM2

## Kontakt

- Email: kontakt@agentflowm.com
- Telefon: +49 179 949 8247
- WhatsApp: https://wa.me/491799498247
- Website: https://www.agentflowm.com
