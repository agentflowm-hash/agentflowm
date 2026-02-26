# 📱 App Store & Google Play Veröffentlichung
## AgentFlowM + AgentFlowM Portal

---

## KEYSTORE-PASSWORT (SICHER AUFBEWAHREN!)
```
Passwort: HpzvDrpQwvO-oaOpaaLH2A
```
> ⚠️ Ohne dieses Passwort können die Apps NIE wieder geupdated werden!
> Backup: `keystores/` Ordner in iCloud/1Password kopieren.

---

## APP 1: AgentFlowM (Marketing)
- **Bundle ID:** `de.agentflowm.app`
- **URL:** `https://agentflowm.de`
- **Keystore:** `keystores/marketing.keystore`

## APP 2: AgentFlowM Portal
- **Bundle ID:** `de.agentflowm.portal`
- **URL:** `https://portal-agentflowm.de`
- **Keystore:** `keystores/portal.keystore`

---

# TEIL 1: ANDROID (Google Play)

## Schritt 1: Vorbereitung
```bash
# Terminal öffnen, in Projektordner wechseln
cd /pfad/zu/agentflowm-github

# Dependencies installieren (falls noch nicht)
npm install

# Capacitor sync (Web → Android)
npx cap sync android
```

## Schritt 2: Android Studio öffnen
```bash
npx cap open android
```
→ Android Studio öffnet sich mit dem Projekt.

## Schritt 3: AAB (Android App Bundle) bauen
In Android Studio:
1. **Build** → **Generate Signed Bundle / APK**
2. Wähle **Android App Bundle**
3. Klicke **Next**
4. Bei "Key store path": Klicke **Choose existing**
   - Wähle: `keystores/marketing.keystore`
5. **Key store password:** `HpzvDrpQwvO-oaOpaaLH2A`
6. **Key alias:** `agentflowm`
7. **Key password:** `HpzvDrpQwvO-oaOpaaLH2A`
8. Klicke **Next**
9. Wähle **release** Variante
10. Klicke **Finish**
→ AAB wird gebaut: `android/app/release/app-release.aab`

## Schritt 4: Google Play Console
1. Öffne: https://play.google.com/console
2. **App erstellen** → **App erstellen**
   - App-Name: `AgentFlowM`
   - Standard-Sprache: Deutsch
   - App oder Spiel: App
   - Kostenlos oder kostenpflichtig: Kostenlos (oder Kostenpflichtig)
3. Fülle alle Pflichtfelder aus:
   - **Hauptbeschreibung** (bis 4000 Zeichen):
     ```
     AgentFlowM – Professionelle Webseiten & Digitale Lösungen für Ihr Unternehmen.

     Entdecken Sie unsere Pakete:
     • Launch-Paket: Perfekter Einstieg
     • Business-Paket: Für wachsende Unternehmen
     • Enterprise & Custom-Lösungen

     ✓ Kostenlose Erstberatung
     ✓ Schnelle Lieferung
     ✓ Top-Support
     ```
   - **Kurzbeschreibung** (80 Zeichen):
     ```
     Professionelle Webseiten & digitale Lösungen
     ```
4. **Grafik-Assets** hochladen:
   - Icon (512×512 PNG): `ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png`
   - Feature Graphic (1024×500 PNG): Muss neu erstellt werden
   - Screenshots: Mindestens 2 (Phone), optional Tablet
5. **Datenschutzerklärung URL** eingeben: `https://agentflowm.de/datenschutz`
6. **Inhalts-Rating** ausfüllen (Fragebogen beantworten)
7. **Preise & Vertrieb** konfigurieren
8. **Release erstellen:**
   - Produktions-Track → **Release erstellen**
   - AAB hochladen: `android/app/release/app-release.aab`
   - **Zur Überprüfung einreichen**

→ Google prüft: 1-7 Tage

---

# TEIL 2: iOS (App Store)

## Schritt 1: Apple Team ID finden
1. Öffne: https://developer.apple.com
2. Einloggen → **Account** → **Membership**
3. **Team ID** notieren (Format: XXXXXXXXXX)

## Schritt 2: App in App Store Connect anlegen
1. Öffne: https://appstoreconnect.apple.com
2. **Meine Apps** → **+** → **Neue App**
3. Ausfüllen:
   - **Plattformen:** iOS
   - **Name:** `AgentFlowM`
   - **Primäre Sprache:** Deutsch
   - **Bundle-ID:** `de.agentflowm.app` ← Muss zuerst in Apple Developer Portal registriert sein!
   - **SKU:** `agentflowm-marketing`
4. **Erstellen**

## Schritt 3: Bundle ID registrieren (Apple Developer Portal)
1. Öffne: https://developer.apple.com/account/resources/identifiers
2. **+** → **App IDs**
3. **App** auswählen → **Continue**
4. **Description:** `AgentFlowM`
5. **Bundle ID (Explicit):** `de.agentflowm.app`
6. Capabilities aktivieren (falls nötig): Push Notifications
7. **Register**

## Schritt 4: Xcode öffnen
```bash
npx cap open ios
```
→ Xcode öffnet sich mit dem Projekt.

## Schritt 5: Signing in Xcode konfigurieren
1. Im Xcode-Navigator: **App** → **App** Target auswählen
2. Tab **Signing & Capabilities**
3. **Team:** Dein Apple Developer Team auswählen
4. **Bundle Identifier:** `de.agentflowm.app` ← Prüfen!
5. Xcode erstellt automatisch Provisioning Profile

## Schritt 6: Version setzen
1. Tab **General**
2. **Version:** `1.0.0`
3. **Build:** `1`

## Schritt 7: Archive bauen
1. Simulator auf **"Any iOS Device (arm64)"** setzen
2. **Product** → **Archive**
3. Warten (2-5 Minuten)
4. Organizer öffnet sich → Dein Archive auswählen

## Schritt 8: Zu App Store Connect hochladen
1. Im Organizer: **Distribute App**
2. **App Store Connect** → **Next**
3. **Upload** → **Next**
4. Optionen lassen wie sie sind → **Next**
5. **Upload**
6. Warten bis Upload fertig (5-10 Minuten)

## Schritt 9: In App Store Connect finalisieren
1. App Store Connect → Meine Apps → AgentFlowM
2. **iOS App** → Build auswählen
3. Fehlende Infos ausfüllen:
   - **Beschreibung** (App Store Beschreibung)
   - **Keywords:** `webseite, agentur, digital, marketing`
   - **Support-URL:** `https://agentflowm.de/kontakt`
   - **Marketing-URL:** `https://agentflowm.de`
4. **Screenshots** hochladen:
   - 6.7" (iPhone 15 Pro Max): 1290×2796 px
   - 5.5" (iPhone 8 Plus): 1242×2208 px
5. **Datenschutzrichtlinie URL:** `https://agentflowm.de/datenschutz`
6. **Zur Überprüfung einreichen**

→ Apple prüft: 1-3 Tage

---

# TEIL 3: Portal App (APP 2)

## Portal App einrichten
```bash
cd portal-app
npm install

# iOS Projekt erstellen
npx cap add ios

# Android Projekt erstellen
npx cap add android

# Sync
npx cap sync
```

Dann **denselben Prozess** wie oben wiederholen, aber mit:
- Bundle ID: `de.agentflowm.portal`
- Keystore: `keystores/portal.keystore`
- Alias: `agentflowmportal`
- App Name: `AgentFlowM Portal`

---

# SCREENSHOTS ERSTELLEN

## Option 1: Simulator (empfohlen)
1. Xcode → Simulator starten (iPhone 15 Pro Max)
2. App URL im Safari öffnen: `https://agentflowm.de`
3. Screenshots mit `⌘ + S` (Simulator)

## Option 2: Echter Screenshot-Service
- https://appicon.co - Erstellt auch Screenshots
- https://screenshotcreator.co

---

# HÄUFIGE PROBLEME

## "Provisioning Profile not found"
→ In Xcode: Signing → "Automatically manage signing" aktivieren

## "Bundle ID already in use"
→ In Apple Developer: Identifier anlegen (Schritt 3)

## Android: "Unable to load keystore"
→ Keystore-Pfad prüfen: muss relativ zum `android/` Ordner sein
→ Absoluter Pfad verwenden wenn nötig

## "App rejected - missing privacy policy"
→ Datenschutzseite auf der Website ergänzen: `/datenschutz`

---

# NACH DER VERÖFFENTLICHUNG

## Updates veröffentlichen
```bash
# Code ändern, dann:
npx cap sync android  # oder ios
# → Neu bauen und in Store hochladen
# versionCode/versionName in build.gradle erhöhen!
```

## Version erhöhen
- Android: `android/app/build.gradle` → `versionCode 2`, `versionName "1.1.0"`
- iOS: Xcode → General → Build Number erhöhen

---

*Erstellt: Februar 2026 | AgentFlowM*
