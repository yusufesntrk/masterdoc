# MasterDoc - Feature-Dokumentation

> PandaDoc/DocuSign-Klon für Angebote & Verträge

---

## 1. Dashboard (Dokumentenliste)

### 1.1 Header
- [ ] Logo + App-Name "MasterDoc"
- [ ] Suchfeld mit Placeholder "Dokumente durchsuchen..."
- [ ] Primärer CTA-Button "Dokument" (grün) mit Dropdown:
  - Neues Dokument
  - Aus Vorlage
  - Importieren (PDF, DOCX)
- [ ] Benutzer-Avatar mit Dropdown-Menü:
  - Profil-Einstellungen
  - Team-Verwaltung
  - Abrechnung
  - Abmelden

### 1.2 Tab-Navigation
- [ ] "Neueste" - Zuletzt bearbeitete Dokumente
- [ ] "Alle Dokumente" - Vollständige Liste
- [ ] "Von mir erstellt" - Eigene Dokumente
- [ ] "Archiviert" - Archivierte Dokumente
- [ ] Aktiver Tab mit grüner Unterstreichung (2px)

### 1.3 Dokumentenliste (Tabelle)
| Spalte | Beschreibung |
|--------|-------------|
| Name | Titel + Untertitel (Empfänger-Info) |
| Status | Badge mit Farbcodierung |
| Betrag | Gesamtsumme in EUR |
| Geändert | Relatives Datum ("Vor 5 Min.") |
| Aktionen | 3-Punkte-Menü |

### 1.4 Status-System
| Status | Farbe | Beschreibung |
|--------|-------|-------------|
| Entwurf | Grau | Noch nicht gesendet |
| Gesendet | Blau | An Empfänger gesendet |
| Angesehen | Gelb | Empfänger hat geöffnet |
| Unterzeichnet | Grün | Vollständig signiert |
| Abgelaufen | Rot | Frist überschritten |

### 1.5 Dokumenten-Aktionen
- [ ] Duplizieren
- [ ] Umbenennen
- [ ] Archivieren
- [ ] Löschen (mit Bestätigung)
- [ ] Als Vorlage speichern

---

## 2. Erstellungs-Wizard (Modal)

### 2.1 Step 1: Vorlagenwahl
- [ ] Linke Sidebar:
  - Schnellzugriff
  - Meine Vorlagen
  - Mit mir geteilt
  - Import (Upload, Google Drive, Dropbox, OneDrive)
- [ ] Kachel-Raster mit Vorlagen
- [ ] "Blank document" Kachel für leeres Dokument
- [ ] Vorlagen-Kategorien (Angebote, Verträge, NDAs, etc.)
- [ ] Vorschau-Funktion (Hover/Klick)
- [ ] Suchfeld für Vorlagen

### 2.2 Step 2: Empfänger hinzufügen
- [ ] Empfänger-Formular:
  - Name (optional)
  - E-Mail (required)
  - Rolle (Unterzeichner, Genehmiger, Kopie erhält)
- [ ] Mehrere Empfänger hinzufügen (+Button)
- [ ] Drag & Drop für Reihenfolge
- [ ] Signing Order:
  - Sequentiell (nacheinander)
  - Parallel (gleichzeitig)
- [ ] Empfänger entfernen

### 2.3 Step 3: Inhalt überprüfen
- [ ] Dokumenten-Vorschau
- [ ] Variablen/Platzhalter-Check
- [ ] Fehlende Pflichtfelder anzeigen
- [ ] "Bearbeiten" Button → zurück zu Step 1/2
- [ ] "Finalisieren" Button → zum Editor

### 2.4 Step-Indikator
- [ ] 3 Schritte visuell anzeigen
- [ ] Aktueller Schritt hervorgehoben
- [ ] Zurück-Navigation möglich

---

## 3. Dokument-Editor

### 3.1 Top-Bar (Header)
- [ ] Zurück-Button (← Dashboard)
- [ ] Dokumenttitel (inline-editierbar)
- [ ] Status-Badge ("Entwurf")
- [ ] Gesamtbetrag (EUR 0,00)
- [ ] "Aktualisiert vor X Minuten"
- [ ] "Einladen" Button (sekundär)
- [ ] "Senden" Button (primär, grün)
- [ ] Mehr-Menü (⋯):
  - Dokument-Info
  - Aktivitätslog
  - Kommentare
  - Als PDF exportieren
  - Drucken

### 3.2 Seiten-Canvas (Mitte)

#### Seitenleiste (links)
- [ ] Seitenübersicht (Thumbnails)
- [ ] Seitenzähler ("1 Seite")
- [ ] "+ Seite hinzufügen" Button
- [ ] Seiten-Reihenfolge per Drag & Drop

#### Hauptbereich
- [ ] Weißer Hintergrund (Papier-Simulation)
- [ ] DIN-A4 Proportionen (210mm x 297mm)
- [ ] Zentriert mit Schatten
- [ ] Scroll-Verhalten bei mehreren Seiten
- [ ] Block-Container für Inhalte

### 3.3 Rechte Seitenleiste (220px)

#### Tab-Navigation (Icons)
| Tab | Funktion |
|-----|----------|
| Inhalt | Bausteine & Felder |
| Empfänger | Empfänger-Verwaltung |
| Bibliothek | Content-Bibliothek |
| Variablen | Platzhalter-System |
| Daten | Externe Datenquellen |
| Design | Styling-Optionen |
| Workflow | Automatisierungen |

---

## 4. Bausteine (Content Blocks)

### 4.1 Text-Block
- [ ] Rich-Text-Editor (Slate.js)
- [ ] Formatierung:
  - Schriftart (Font Family)
  - Schriftgröße (8-72pt)
  - Fett / Kursiv / Unterstrichen
  - Durchgestrichen
  - Textfarbe
  - Hintergrundfarbe
- [ ] Ausrichtung: Links / Mitte / Rechts / Blocksatz
- [ ] Listen: Nummeriert / Aufzählung
- [ ] Links einfügen
- [ ] Einzug erhöhen/verringern

### 4.2 Bild-Block
- [ ] Upload von Computer
- [ ] URL einfügen
- [ ] Aus Bibliothek wählen
- [ ] Drag & Drop
- [ ] Größe anpassen (Handles)
- [ ] Ausrichtung (links, mitte, rechts)
- [ ] Alt-Text für Accessibility

### 4.3 Video-Block
- [ ] YouTube-Embed
- [ ] Vimeo-Embed
- [ ] Loom-Embed
- [ ] Custom URL
- [ ] Thumbnail-Vorschau

### 4.4 Tabelle-Block
- [ ] Zeilen/Spalten hinzufügen/entfernen
- [ ] Zellen verbinden
- [ ] Header-Zeile
- [ ] Zellenformatierung
- [ ] Spaltenbreite anpassen
- [ ] Rahmen-Styles

### 4.5 Preisliste-Block
| Spalte | Typ |
|--------|-----|
| Produkt | Text |
| Beschreibung | Text (optional) |
| Menge | Zahl |
| Einzelpreis | Währung |
| Rabatt | Prozent/Absolut |
| Gesamt | Berechnet |

- [ ] Zeilen hinzufügen/entfernen
- [ ] Auto-Berechnung
- [ ] Zwischensumme
- [ ] Steuern (MwSt. %)
- [ ] Gesamtsumme
- [ ] Währung wählbar

### 4.6 Angebotsersteller (Quote Builder)
- [ ] Produktkatalog-Integration
- [ ] Mengenrabatte
- [ ] Optionale Positionen
- [ ] Pakete/Bundles
- [ ] Dynamische Preiskalkulation

### 4.7 Inhaltsverzeichnis
- [ ] Auto-generiert aus Headings
- [ ] Klickbare Links
- [ ] Seitenzahlen
- [ ] Update bei Änderungen

### 4.8 Seitenumbruch
- [ ] Erzwingt neue Seite
- [ ] Visueller Indikator im Editor

---

## 5. Ausfüllbare Felder

### 5.1 Textfeld
- [ ] Einzeilig / Mehrzeilig
- [ ] Placeholder-Text
- [ ] Pflichtfeld-Option
- [ ] Validierung (E-Mail, Telefon, etc.)
- [ ] Max. Zeichenlänge

### 5.2 Unterschrift
- [ ] Signatur-Pad (Zeichnen)
- [ ] Name tippen (als Schrift)
- [ ] Bild hochladen
- [ ] Gespeicherte Signatur verwenden
- [ ] Touch-Support
- [ ] Löschen/Wiederholen

### 5.3 Initialen
- [ ] Wie Unterschrift, aber kleiner
- [ ] Für Seiten-Paraphierung

### 5.4 Datum
- [ ] Date-Picker
- [ ] Format wählbar (DD.MM.YYYY, etc.)
- [ ] Auto-Fill mit aktuellem Datum
- [ ] Datumsbereich einschränkbar

### 5.5 Kontrollkästchen (Checkbox)
- [ ] Einzeln oder Gruppe
- [ ] Pflichtfeld-Option
- [ ] Vorausgewählt möglich

### 5.6 Optionsschaltflächen (Radio)
- [ ] Mehrere Optionen, eine Auswahl
- [ ] Gruppierung
- [ ] Pflichtfeld-Option

### 5.7 Dropdown-Menü
- [ ] Optionen definierbar
- [ ] Pflichtfeld-Option
- [ ] Placeholder

### 5.8 Abrechnungsinformationen
- [ ] Kreditkarte
- [ ] Bankverbindung
- [ ] Rechnungsadresse

### 5.9 Dateien sammeln
- [ ] Upload-Feld für Empfänger
- [ ] Erlaubte Dateitypen
- [ ] Max. Dateigröße
- [ ] Mehrere Dateien

### 5.10 Stempel
- [ ] Firmen-Stempel hochladen
- [ ] Positionieren

---

## 6. Block-Interaktionen

### 6.1 Drag-Handle
- [ ] Erscheint bei Hover (links vom Block)
- [ ] 2 vertikale Punkte
- [ ] Cursor: grab → grabbing
- [ ] Blöcke verschieben per Drag & Drop

### 6.2 Block-Toolbar (Floating)
Erscheint bei Hover über Block:
- [ ] Duplizieren
- [ ] Kopieren
- [ ] Ausschneiden
- [ ] Kommentar hinzufügen
- [ ] Eigenschaften
- [ ] Sperren/Entsperren
- [ ] Löschen

### 6.3 Plus-Icon (Quick-Add)
- [ ] Erscheint zwischen Blöcken bei Hover
- [ ] Horizontale Linie + Plus-Button
- [ ] Klick öffnet Quick-Add-Menü

### 6.4 Quick-Add-Menü
**Bibliotheken:**
- Content-Bibliothek
- Bild-Bibliothek
- Canva-Integration

**Schnell hinzufügen:**
| # | Block |
|---|-------|
| 1 | Text |
| 2 | Bild |
| 3 | Video |
| 4 | Tabelle |
| 5 | Preisliste |
| 6 | Angebotsersteller |
| 7 | Inhaltsverzeichnis |
| 8 | Seitenumbruch |

- [ ] Keyboard-Shortcuts (1-8)

---

## 7. Empfänger-Verwaltung

### 7.1 Empfänger hinzufügen
- [ ] Name + E-Mail
- [ ] Rolle zuweisen:
  - Unterzeichner (muss unterschreiben)
  - Genehmiger (muss genehmigen)
  - Kopie erhält (nur lesen)
- [ ] Reihenfolge festlegen
- [ ] Felder zuweisen (welche Felder für welchen Empfänger)

### 7.2 Feld-Zuweisung
- [ ] Farbcodierung pro Empfänger
- [ ] Drag & Drop Felder auf Dokument
- [ ] Pflichtfelder markieren

### 7.3 Empfänger-Ansicht (Signing Experience)
- [ ] E-Mail mit Link erhalten
- [ ] Dokument im Browser öffnen
- [ ] Nur zugewiesene Felder bearbeiten
- [ ] Fortschrittsanzeige
- [ ] "Fertig" Button
- [ ] Bestätigungs-E-Mail

---

## 8. Signatur-Workflow

### 8.1 Dokument senden
- [ ] Empfänger final prüfen
- [ ] Betreff + Nachricht anpassen
- [ ] Ablaufdatum setzen (optional)
- [ ] Erinnerungen konfigurieren
- [ ] Senden-Button

### 8.2 E-Mail an Empfänger
- [ ] Absender-Name + Firma
- [ ] Betreff
- [ ] Personalisierte Nachricht
- [ ] "Dokument ansehen" Button
- [ ] Ablaufdatum-Info

### 8.3 Signing-Prozess
1. [ ] Link öffnen
2. [ ] Identität bestätigen (optional: 2FA, SMS)
3. [ ] Dokument durchlesen
4. [ ] Felder ausfüllen
5. [ ] Unterschrift setzen
6. [ ] "Fertig" klicken
7. [ ] Bestätigung erhalten

### 8.4 Nach Abschluss
- [ ] Alle Parteien erhalten signiertes PDF
- [ ] Audit-Trail angehängt
- [ ] Status auf "Unterzeichnet"
- [ ] Aktivitätslog aktualisiert

---

## 9. Variablen-System

### 9.1 Standard-Variablen
| Variable | Beschreibung |
|----------|-------------|
| `{{empfaenger.name}}` | Name des Empfängers |
| `{{empfaenger.email}}` | E-Mail des Empfängers |
| `{{firma.name}}` | Firmenname |
| `{{firma.adresse}}` | Firmenadresse |
| `{{datum.heute}}` | Aktuelles Datum |
| `{{dokument.titel}}` | Dokumenttitel |
| `{{dokument.betrag}}` | Gesamtbetrag |

### 9.2 Custom-Variablen
- [ ] Eigene Variablen definieren
- [ ] Werte beim Senden eingeben
- [ ] Standardwerte festlegen

### 9.3 Auto-Fill
- [ ] Variablen automatisch ersetzen
- [ ] Preview-Modus

---

## 10. Content-Bibliothek

### 10.1 Gespeicherte Blöcke
- [ ] Textbausteine speichern
- [ ] Bilder speichern
- [ ] Komplette Block-Gruppen
- [ ] Kategorien/Tags
- [ ] Suche

### 10.2 Bild-Bibliothek
- [ ] Hochgeladene Bilder
- [ ] Logos
- [ ] Stockfotos (Integration)

---

## 11. Aktivitätslog

### 11.1 Protokollierte Events
| Event | Beschreibung |
|-------|-------------|
| Erstellt | Dokument wurde erstellt |
| Bearbeitet | Änderungen gespeichert |
| Gesendet | An Empfänger gesendet |
| Angesehen | Empfänger hat geöffnet |
| Unterschrieben | Empfänger hat signiert |
| Abgeschlossen | Alle haben signiert |
| Abgelaufen | Frist überschritten |

### 11.2 Details pro Event
- [ ] Timestamp
- [ ] Benutzer/Empfänger
- [ ] IP-Adresse (für Audit)
- [ ] Browser/Device

---

## 12. PDF-Export

### 12.1 Export-Optionen
- [ ] Als PDF herunterladen
- [ ] Mit Signaturen
- [ ] Mit Audit-Trail
- [ ] Nur Dokument (ohne Signaturen)

### 12.2 Audit-Trail (Certificate)
- [ ] Dokument-ID
- [ ] Erstellungsdatum
- [ ] Alle Signaturen mit Timestamps
- [ ] IP-Adressen
- [ ] Hash-Wert für Integrität

---

## 13. Vorlagen-System

### 13.1 Vorlage erstellen
- [ ] Aus bestehendem Dokument
- [ ] Von Grund auf neu
- [ ] Kategorie zuweisen
- [ ] Beschreibung hinzufügen

### 13.2 Vorlage verwenden
- [ ] In Wizard auswählen
- [ ] Variablen werden abgefragt
- [ ] Neues Dokument erstellt

### 13.3 Vorlagen teilen
- [ ] Mit Team teilen
- [ ] Öffentlich machen
- [ ] Link teilen

---

## 14. Team-Features (Future)

### 14.1 Team-Verwaltung
- [ ] Mitglieder einladen
- [ ] Rollen (Admin, Editor, Viewer)
- [ ] Berechtigungen

### 14.2 Gemeinsame Ressourcen
- [ ] Team-Vorlagen
- [ ] Team-Bibliothek
- [ ] Team-Branding

---

## 15. Integrationen (Future)

### 15.1 CRM
- [ ] Salesforce
- [ ] HubSpot
- [ ] Pipedrive

### 15.2 Zahlungen
- [ ] Stripe
- [ ] PayPal

### 15.3 Speicher
- [ ] Google Drive
- [ ] Dropbox
- [ ] OneDrive

### 15.4 Automatisierung
- [ ] Zapier
- [ ] n8n
- [ ] Webhooks

---

## 16. Keyboard-Shortcuts

| Shortcut | Aktion |
|----------|--------|
| `Ctrl/Cmd + S` | Speichern |
| `Ctrl/Cmd + Z` | Rückgängig |
| `Ctrl/Cmd + Shift + Z` | Wiederholen |
| `Ctrl/Cmd + B` | Fett |
| `Ctrl/Cmd + I` | Kursiv |
| `Ctrl/Cmd + U` | Unterstrichen |
| `Ctrl/Cmd + K` | Link einfügen |
| `Ctrl/Cmd + D` | Duplizieren |
| `Delete/Backspace` | Block löschen |
| `Enter` | Neuer Block |
| `1-8` | Quick-Add Shortcuts |

---

## Feature-Status

| Phase | Features | Status |
|-------|----------|--------|
| 1 | Projekt-Setup | ✅ Fertig |
| 2 | Dashboard | 🔄 In Arbeit |
| 3 | Wizard | ⏳ Geplant |
| 4 | Editor Layout | 🔄 In Arbeit |
| 5 | Block-System | ⏳ Geplant |
| 6 | Quick-Add | ⏳ Geplant |
| 7 | Datenbank | ⏳ Geplant |
| 8 | E-Signatur | ⏳ Geplant |
| 9 | Extras | ⏳ Geplant |
| 10 | Polish | ⏳ Geplant |
