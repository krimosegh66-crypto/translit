# WortBrücke – Arabisch ⇄ Deutsch

Eine responsive Web-App für professionelle Übersetzungen zwischen Arabisch und Deutsch. Läuft auf Computer und Smartphone im Browser.

## Enthaltene Funktionen

- Automatische Erkennung der Ausgangssprache oder manuelle Auswahl
- Übersetzung in beide Richtungen
- Stile: professionell, formell, Alltagssprache, akademisch und literarisch
- Verlauf lokal im Browser speichern, Einträge öffnen oder löschen
- Kopieren, Vorlesen (Browser-Sprachausgabe) und TXT-Export
- Responsive Darstellung, einschließlich RTL-Unterstützung für Arabisch
- API-Schlüssel bleibt serverseitig und wird nicht an den Browser ausgeliefert

## Voraussetzungen

- Node.js 18 oder neuer
- Ein API-Schlüssel für die Übersetzungs-KI (Nutzungsgebühren können anfallen)

## Einrichtung unter Windows

1. Installiere Node.js LTS von https://nodejs.org/ und öffne danach ein neues Terminal.
2. Entpacke die ZIP-Datei in einen Ordner.
3. Öffne die Eingabeaufforderung oder PowerShell in diesem Ordner.
4. Installiere die Pakete:

   ```powershell
   npm install
   ```

5. Erstelle deine lokale Konfigurationsdatei:

   ```powershell
   Copy-Item .env.example .env
   ```

6. Öffne `.env` mit einem Texteditor und ersetze `put_your_api_key_here` durch deinen eigenen API-Schlüssel. Bewahre die Datei geheim und teile sie nicht.
7. Starte die App:

   ```powershell
   npm start
   ```

8. Öffne im Browser: http://localhost:3000

## Einrichtung unter macOS / Linux

```bash
npm install
cp .env.example .env
# .env bearbeiten und OPENAI_API_KEY eintragen
npm start
```

Dann http://localhost:3000 öffnen.

## Auf dem Smartphone testen

- Computer und Smartphone müssen im selben WLAN sein.
- Ermittle die lokale IP-Adresse des Computers.
- Starte den Server und öffne auf dem Smartphone `http://COMPUTER-IP:3000`.
- Die Firewall des Computers muss lokale Verbindungen zulassen. Für den öffentlichen Betrieb ist HTTPS über einen sicheren Hosting-Anbieter erforderlich.

## API-Konfiguration

Standardmäßig wird `gpt-4.1-mini` über die Chat-Completions-API verwendet. Falls dein Konto keinen Zugriff auf dieses Modell hat, setze `OPENAI_MODEL` in `.env` auf ein Modell, das in deinem API-Konto verfügbar ist.

Die API wird vom Server aufgerufen. **Füge den Schlüssel niemals in `public/index.html` ein und veröffentliche `.env` nicht in GitHub.**

## Verlauf & Datenschutz

Der Verlauf liegt in `localStorage` des verwendeten Browsers. Er wird nicht automatisch mit anderen Geräten synchronisiert und verschwindet, wenn Browserdaten gelöscht werden. Die Texte, die du übersetzen lässt, werden an den konfigurierten KI-Dienst gesendet. Verwende für vertrauliche Inhalte nur Dienste und Konten, deren Datenschutzbedingungen du akzeptierst.

## Wichtige Hinweise

- Diese Version ist ein lauffähiger Starter, keine bereits gehostete öffentliche Website.
- Die Sprachwiedergabe nutzt die im Browser bzw. Betriebssystem verfügbaren Stimmen; die Qualität arabischer Stimmen hängt vom Gerät ab.
- Vor einer öffentlichen Veröffentlichung sollte man zusätzlich Authentifizierung, Ratenbegrenzung, Logging ohne Textinhalte, HTTPS und Kostenlimits einrichten.
