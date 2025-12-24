# Feature Engineering: $ARGUMENTS

Du hilfst bei der Planung und Spezifikation eines Features. **KEINE Implementierung** - nur Analyse, Fragen, Dokumentation.

## Kernprinzipien

- **Fragen stellen**: Alle Unklarheiten identifizieren und klären
- **Verstehen vor Handeln**: Codebase und bestehende Patterns analysieren
- **Dokumentieren**: Alles in PRD.md und FEATURES.md festhalten
- **KEIN Code schreiben**: Implementierung erfolgt später via `/orchestrate`

---

## Phase 1: Discovery

**Ziel**: Verstehen was gebaut werden soll

**Request**: $ARGUMENTS

**Aktionen**:
1. TodoWrite mit allen Phasen erstellen
2. Falls unklar, User fragen:
   - Welches Problem wird gelöst?
   - Was soll das Feature tun?
   - Constraints oder Requirements?
3. Verständnis zusammenfassen und bestätigen lassen

---

## Phase 2: Kontext sammeln

**Ziel**: PRD.md und FEATURES.md prüfen

**Aktionen**:
1. **PRD.md prüfen**: Gibt es bereits Anforderungen für dieses Feature?
2. **FEATURES.md prüfen**: Was ist bereits implementiert? Was fehlt?
3. **Codebase erkunden**: Welche Patterns/Components existieren bereits?

**Output**:
- Kontext aus PRD.md
- Aktueller Stand aus FEATURES.md
- Relevante bestehende Patterns

---

## Phase 3: Klärungsfragen

**Ziel**: ALLE Unklarheiten beseitigen

**KRITISCH**: Diese Phase NICHT überspringen!

**Fragen-Kategorien**:

### Design & UI
- [ ] Welche UI-Komponente? (Card, Table, List, Modal, Widget?)
- [ ] Wo wird es eingebunden? (Welche Page, welcher Bereich?)
- [ ] Design-Referenzen? (Ähnliche Components im Projekt?)
- [ ] Spezielle Styling-Wünsche?

### Datenmodell
- [ ] Welche Felder/Properties?
- [ ] Beziehungen zu anderen Tabellen?
- [ ] Pflichtfelder vs. optional?
- [ ] Default-Werte?

### Funktionalität
- [ ] CRUD-Operationen? (Create, Read, Update, Delete)
- [ ] Filtering/Sorting?
- [ ] Pagination?
- [ ] Echtzeit-Updates?

### Permissions
- [ ] Wer darf was sehen? (Rollen-basiert?)
- [ ] Wer darf bearbeiten/löschen?
- [ ] Tenant-Isolation?

### Externe Abhängigkeiten
- [ ] API Keys benötigt?
- [ ] Externe Services? (E-Mail, Storage, etc.)
- [ ] Environment Variables?

**Aktionen**:
1. Relevante Fragen auswählen (nicht alle nötig)
2. **Alle Fragen auf einmal stellen**
3. **Auf Antworten warten** bevor weiter

---

## Phase 4: Architektur-Übersicht

**Ziel**: Technische Umsetzung skizzieren

**Aktionen**:
1. Betroffene Bereiche identifizieren:
   - Database: Neue Tabellen? Migrations?
   - Hooks: Neue React Query Hooks?
   - Components: Welche UI-Komponenten?
   - Pages: Neue Seiten oder Integration in bestehende?
   - Tests: Welche E2E Tests?

2. Abhängigkeiten zu anderen Features prüfen

3. Grobe Struktur vorschlagen:
   ```
   Feature: [Name]
   ├── Migration: [Tabellenname]
   ├── Hook: use[Feature]
   ├── Components:
   │   ├── [Feature]List
   │   ├── [Feature]Card
   │   └── [Feature]Form
   ├── Page: [Route]
   └── Tests: [feature].spec.ts
   ```

---

## Phase 5: Dokumentation

**Ziel**: Alles festhalten für die Implementierung

**Aktionen**:
1. **FEATURES.md aktualisieren**:
   - Feature in "In Arbeit" oder "Geplant" eintragen
   - Konkrete Tasks auflisten

2. **PRD.md aktualisieren** (falls nötig):
   - Requirements dokumentieren
   - Entscheidungen festhalten

3. **Summary präsentieren**:
   ```
   ## Feature: [Name]

   ### Geklärte Anforderungen:
   - UI: ...
   - Felder: ...
   - Permissions: ...

   ### Betroffene Bereiche:
   - Database: ...
   - Hooks: ...
   - Components: ...

   ### Nächster Schritt:
   `/orchestrate [Feature Name]` um die Implementierung zu starten
   ```

---

## Wichtige Regeln

1. **KEIN Code schreiben** - nur planen und dokumentieren
2. **Alle Fragen auf einmal stellen** - nicht einzeln nachfragen
3. **Dokumentieren** in PRD.md und FEATURES.md
4. **Am Ende auf `/orchestrate` verweisen** für Implementierung

---

## Beispiel-Ablauf

```
User: /feature-dev E-Mail Templates

1. Discovery: "Du willst E-Mail Templates für automatische Benachrichtigungen?"

2. Kontext: PRD.md und FEATURES.md geprüft, bestehende Settings-Patterns gefunden

3. Fragen:
   - UI: Eigene Page oder in Settings integriert?
   - Felder: Name, Subject, Body - weitere?
   - Variablen: {{candidate_name}}, {{job_title}} unterstützen?
   - Permissions: Wer darf Templates erstellen?

4. Architektur:
   Feature: E-Mail Templates
   ├── Migration: email_templates
   ├── Hook: useEmailTemplates
   ├── Components: EmailTemplateForm, EmailTemplateList
   └── Page: /settings/email-templates

5. Dokumentation: FEATURES.md aktualisiert

6. Output: "Plan fertig! Nutze `/orchestrate E-Mail Templates` für Implementierung"
```
