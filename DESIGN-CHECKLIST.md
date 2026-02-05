# 🎨 AgentFlowM Design-Konsistenz-Checkliste

*Erstellt am: $(date)*

## ✅ Was funktioniert

| Check | Status | Details |
|-------|--------|---------|
| Tailwind Syntax | ✅ OK | Keine falschen `bg-#color` (immer korrekt `bg-[#color]`) |
| Hauptfarbe | ✅ OK | `#FC682C` konsistent als Akzentfarbe verwendet |
| Portal-Klassen | ✅ OK | `.portal-btn`, `.portal-card` existieren und werden genutzt (46x) |

---

## ⚠️ Inkonsistenzen gefunden

### 1. 🔴 KRITISCH: Verschiedene Hintergrundfarben

Das Projekt verwendet **6 verschiedene** dunkle Hintergrundfarben:

| Farbe | Vorkommen | Verwendet in |
|-------|-----------|--------------|
| `#030308` | 25x | Main-Webseite (Seiten, Sections) |
| `#09090b` | 19x | Portal (Dashboard, Login) |
| `#0f0f12` | 25x | Cards, Header (Portal + Admin) |
| `#0a0a0a` | 4x | Admin, Pricing |
| `#0a0a0f` | 6x | Footer, Select-Options |
| `#080808` | 4x | Checkout-Seiten |

**Empfehlung:** Eine einheitliche Farbpalette definieren:
```css
--color-bg-primary: #030308;     /* Haupthintergrund */
--color-bg-card: #0f0f12;        /* Cards */
--color-bg-elevated: #121215;    /* Modals, Dropdowns */
```

---

### 2. 🟡 Inkonsistente Hover-Farben

Zwei verschiedene Hover-Varianten für die Hauptfarbe:

| Farbe | Vorkommen | Problem |
|-------|-----------|---------|
| `#e55a1f` | 9x | Standard Hover |
| `#e55d27` | 2x | ❌ Abweichende Version |

**Betroffene Dateien:**
- `portal/src/app/[locale]/dashboard/page.tsx:1447` → `hover:bg-[#e55d27]`
- `portal/src/app/dashboard/page.tsx:1425` → `hover:bg-[#e55d27]`

**Fix:** Alle `#e55d27` durch `#e55a1f` ersetzen.

---

### 3. 🟡 CSS-Variablen werden nicht genutzt

Die globals.css definiert CSS-Variablen, aber Komponenten verwenden hardcodierte Werte:

**Definiert in CSS:**
```css
--color-accent: #FC682C;
--color-accent-hover: #e55a20;
--color-bg: #030308;
```

**Tatsächlich verwendet (inline):**
```tsx
// 172x text-[#FC682C] statt text-accent
// 126x border-[#FC682C] statt border-accent
// 25x bg-[#030308] statt bg-bg
```

**Empfehlung:** Tailwind-Config erweitern:
```js
// tailwind.config.js
colors: {
  bg: {
    DEFAULT: 'var(--color-bg)',
    card: '#0f0f12',
    elevated: '#121215',
  },
  accent: {
    DEFAULT: 'var(--color-accent)',
    hover: 'var(--color-accent-hover)',
    light: 'var(--color-accent-light)',
  }
}
```

---

### 4. 🟡 Drei verschiedene globals.css mit unterschiedlichen Definitionen

| Datei | `--color-bg` | `--color-accent` |
|-------|--------------|------------------|
| `/src/styles/globals.css` | `#050507` (dark) / `#fff7f2` (light) | `#FC682C` |
| `/portal/src/app/globals.css` | `#09090b` | `#FC682C` |
| `/admin/src/app/globals.css` | `#0a0a0a` | `#FC682C` |

**Empfehlung:** Shared CSS-Variablen-Datei erstellen und importieren.

---

### 5. 🟡 Inkonsistente Button-Styles

Buttons werden sowohl über CSS-Klassen als auch inline definiert:

| Methode | Beispiel | Vorkommen |
|---------|----------|-----------|
| CSS-Klasse | `className="portal-btn"` | 46x |
| Inline | `bg-[#FC682C] hover:bg-[#e55a1f]` | 25x |

**Empfehlung:** Alle Buttons auf CSS-Klassen umstellen für Konsistenz.

---

### 6. 🔵 Seiten-spezifische Akzentfarben (korrekt!)

Diese unterschiedlichen Farben sind **beabsichtigt** für verschiedene Pakete:

| Paket | Farbe | Hex |
|-------|-------|-----|
| Start | Warm Orange | `#FFB347` |
| Business | Main Orange | `#FC682C` |
| Growth | Purple | `#9D65C9` |
| Mobile | Violet | `#8B5CF6` |
| WebApp | Cyan | `#06b6d4` |
| Website-Check | Cyan | `#06b6d4` |

✅ Dies ist eine **bewusste Design-Entscheidung** für visuelle Differenzierung.

---

## 📋 Aktionsplan

### Priorität 1 (Schnelle Fixes)
- [ ] `#e55d27` → `#e55a1f` ersetzen (2 Dateien)
- [ ] Einheitlichen Hintergrund für Portal festlegen

### Priorität 2 (Strukturelle Verbesserungen)
- [ ] Shared CSS-Variablen-Datei erstellen
- [ ] Tailwind-Config mit allen Farben erweitern
- [ ] Alle `bg-[#030308]` durch `bg-bg` ersetzen (nach Config-Update)

### Priorität 3 (Langfristig)
- [ ] Alle inline Button-Styles durch CSS-Klassen ersetzen
- [ ] Alle hardcodierten Hex-Farben durch CSS-Variablen ersetzen
- [ ] Design-Tokens-System einführen

---

## 🎯 Quick Reference: Korrekte Farbwerte

```css
/* Hintergründe */
--bg-primary: #030308;        /* Hauptseiten */
--bg-card: #0f0f12;           /* Cards */
--bg-elevated: #121215;       /* Modals */

/* Akzent (Orange) */
--accent: #FC682C;
--accent-hover: #e55a1f;
--accent-light: rgba(252, 104, 44, 0.1);
--accent-lighter: rgba(252, 104, 44, 0.2);

/* Text */
--text-primary: #ffffff;
--text-muted: rgba(255, 255, 255, 0.7);
--text-subtle: rgba(255, 255, 255, 0.4);

/* Borders */
--border: rgba(255, 255, 255, 0.08);
--border-strong: rgba(255, 255, 255, 0.15);
```

---

## 📊 Statistiken

- **Geprüfte Dateien:** ~50 TSX-Dateien
- **Hardcodierte `#FC682C`:** 172x (Text), 126x (Border), 24x (Hover-BG)
- **Inkonsistente Hover-Farben:** 2x
- **Verschiedene BG-Farben:** 6 Varianten
- **CSS-Variablen definiert aber ungenutzt:** ~80%

---

*Diese Checkliste wurde automatisch erstellt. Bei Fragen: Design-System dokumentieren!*
