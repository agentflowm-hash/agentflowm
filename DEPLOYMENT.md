# AgentFlow Marketing - Deployment Anleitung

## Wichtig: Datenbank-Hinweis

Die aktuelle App verwendet SQLite (better-sqlite3), was auf Vercel nicht direkt funktioniert.

**Zwei Optionen:**

1. **Railway (empfohlen)**: Alle 3 Apps auf Railway deployen - SQLite funktioniert dort
2. **Turso Migration**: Datenbank auf Turso umstellen (erfordert Code-Anpassung)

Diese Anleitung verwendet **Option 1 (Railway)** - einfacher und kostenlos.

---

## Domains bei IONOS kaufen

Kaufe folgende Domains bei IONOS:
- `agentflowm.com` (Hauptwebsite)
- Subdomains werden automatisch konfiguriert:
  - `portal.agentflowm.com` (Kundenportal)
  - `admin.agentflowm.com` (Admin Dashboard)

## 1. Railway Setup (Empfohlen)

Railway unterstützt SQLite und ist kostenlos (500 Stunden/Monat).

### Account erstellen
1. Gehe zu https://railway.app
2. Erstelle Account (mit GitHub verbinden)

### Projekt erstellen
1. New Project > Empty Project
2. Name: `agentflow`

### Hauptwebsite deployen
1. Add New Service > Empty Service
2. Settings > Source: Upload oder GitHub
3. Lade `/agentflow-marketing` Ordner hoch (ohne /admin, /portal, /telegram-bot)
4. Settings:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Port: 3000
5. Variables > Add (siehe Environment Variables unten)
6. Deploy

### Portal deployen
1. Add New Service > Empty Service
2. Lade `/portal` Ordner hoch
3. Settings:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Port: 3002
4. Variables hinzufugen
5. Deploy

### Admin deployen
1. Add New Service > Empty Service
2. Lade `/admin` Ordner hoch
3. Settings:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Port: 3001
4. Variables hinzufugen
5. Deploy

### Telegram Bot deployen
1. Add New Service > Empty Service
2. Lade `/telegram-bot` Ordner hoch
3. Settings:
   - Build Command: `npm install`
   - Start Command: `node bot.js`
4. Variables hinzufugen
5. Deploy

### Persistenter Speicher (wichtig!)
Die SQLite-Datenbank braucht persistenten Speicher:
1. Service wahlen > Settings > Volumes
2. Add Volume
3. Mount Path: `/app/data`
4. Dies speichert die Datenbank dauerhaft

## 2. Custom Domains (IONOS)

### Railway Domain holen
1. Jeder Service hat eine `.railway.app` URL
2. Gehe zu Service > Settings > Networking > Generate Domain
3. Notiere die URLs (z.B. `agentflow-main-production.up.railway.app`)

### DNS bei IONOS konfigurieren

Fur `agentflowm.com` (A-Record fur Root-Domain):
```
Typ: A
Name: @
Wert: 76.76.21.21 (Railway IP)
```

Fur `www.agentflowm.com`:
```
Typ: CNAME
Name: www
Wert: agentflow-main-production.up.railway.app
```

Fur `portal.agentflowm.com`:
```
Typ: CNAME
Name: portal
Wert: agentflow-portal-production.up.railway.app
```

Fur `admin.agentflowm.com`:
```
Typ: CNAME
Name: admin
Wert: agentflow-admin-production.up.railway.app
```

### In Railway Custom Domain hinzufugen
1. Service > Settings > Networking > Custom Domain
2. Domain eingeben (z.B. `agentflowm.com`)
3. Railway zeigt die benotigten DNS-Einstellungen
4. Warte auf Verifizierung (kann bis zu 24h dauern)

## 3. Environment Variables

### Hauptwebsite (agentflow-main)
```
NODE_ENV=production
NEXT_PUBLIC_BASE_URL=https://agentflowm.com
PORTAL_URL=https://portal.agentflowm.com
DATABASE_PATH=/app/data/agentflow.db
SMTP_HOST=smtp.ionos.de
SMTP_PORT=587
SMTP_USER=kontakt@agentflowm.com
SMTP_PASS=dein-passwort
EMAIL_FROM=kontakt@agentflowm.com
EMAIL_TO=kontakt@agentflowm.com
TELEGRAM_BOT_TOKEN=dein-bot-token
TELEGRAM_CHAT_ID=dein-chat-id
```

### Portal (agentflow-portal)
```
NODE_ENV=production
NEXT_PUBLIC_BASE_URL=https://portal.agentflowm.com
DATABASE_PATH=/app/data/agentflow.db
```

### Admin (agentflow-admin)
```
NODE_ENV=production
NEXT_PUBLIC_BASE_URL=https://admin.agentflowm.com
ADMIN_PASSWORD=dein-sicheres-passwort
DATABASE_PATH=/app/data/agentflow.db
PORTAL_URL=https://portal.agentflowm.com
```

### Telegram Bot
```
TELEGRAM_BOT_TOKEN=dein-bot-token
DATABASE_PATH=/app/data/agentflow.db
PORTAL_URL=https://portal.agentflowm.com
```

## 4. Nach dem Deployment

### Testen
1. Hauptwebsite aufrufen: https://agentflowm.com
2. Admin-Login testen: https://admin.agentflowm.com
3. Portal-Login testen (mit echtem Zugangscode)
4. Telegram Bot testen: @Agentflowzbot

### Ersten Admin-Kunden anlegen
1. In Admin einloggen
2. Clients > Neuer Kunde
3. Zugangscode wird generiert
4. Kunde kann sich im Portal anmelden

## Kosten

| Service | Plan | Kosten |
|---------|------|--------|
| Railway | Starter | 0 EUR (500h/Monat, dann $5) |
| IONOS Domain | .com | ~12 EUR/Jahr |

**Gesamt: ~12 EUR/Jahr** (bei normalem Traffic)

### Railway Hobby Plan ($5/Monat)
Unbegrenzte Nutzung, empfohlen fur Produktion.

## Support

Bei Fragen: kontakt@agentflowm.com
