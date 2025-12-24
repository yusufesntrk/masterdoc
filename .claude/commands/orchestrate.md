# Multi-Agent Orchestrator

Du bist der Orchestrator für parallele Agent-Arbeit.

## Deine Aufgabe

1. **Analysiere** den Task: $ARGUMENTS
2. **Zähle** die Features/Tasks
3. **SAMMLE ALLE INFOS VORAB** (siehe unten) ⚠️
4. **Entscheide** den Modus:
   - **1 Feature** → Direkte Agent Chain (du führst sie aus)
   - **2+ Features** → Feature-Orchestratoren spawnen

---

## ⚠️ KRITISCH: Alle Fragen VORAB klären!

**Feature-Orchestratoren dürfen KEINE Fragen stellen!**

Du MUSST alle Informationen sammeln BEVOR du Feature-Orchestratoren spawnst.
Die Sub-Orchestratoren arbeiten autonom - kein Human-in-the-Loop möglich.

### Pflicht-Fragen pro Feature

Für JEDES Feature musst du folgendes klären:

#### 1. Design & UI
- [ ] Welche UI-Komponente? (Card, Table, List, Modal, Widget?)
- [ ] Wo wird es eingebunden? (Welche Page, welcher Bereich?)
- [ ] Gibt es Design-Referenzen? (Ähnliche Components im Projekt?)
- [ ] Spezielle Styling-Wünsche? (Farben, Icons, Layout?)

#### 2. Datenmodell
- [ ] Welche Felder/Properties braucht das Feature?
- [ ] Beziehungen zu anderen Tabellen?
- [ ] Pflichtfelder vs. optional?
- [ ] Default-Werte?

#### 3. Funktionalität
- [ ] CRUD-Operationen? (Create, Read, Update, Delete)
- [ ] Filtering/Sorting nötig?
- [ ] Pagination?
- [ ] Echtzeit-Updates?

#### 4. Permissions
- [ ] Wer darf was sehen? (Rollen-basiert?)
- [ ] Wer darf bearbeiten/löschen?
- [ ] Tenant-Isolation (Standard: ja)

#### 5. Externe Abhängigkeiten
- [ ] API Keys benötigt? (Welche? Wo konfiguriert?)
- [ ] Externe Services? (E-Mail, Storage, etc.)
- [ ] Environment Variables?

### Beispiel: Vorab-Fragen stellen

```
Ich habe 2 Features identifiziert:

**Feature 1: E-Mail Templates**
Bevor ich starte, brauche ich folgende Infos:

1. UI: Wo sollen Templates verwaltet werden?
   - [ ] Eigene Settings-Page
   - [ ] In bestehenden Settings integriert

2. Felder: Welche Felder braucht ein Template?
   - Name (Pflicht)
   - Subject (Pflicht)
   - Body (Pflicht)
   - Weitere? (z.B. Kategorie, Tags)

3. API Keys: Wird ein E-Mail-Provider benötigt?
   - [ ] Nein, nur Templates speichern
   - [ ] Ja → Welcher? (Resend, SendGrid, etc.)

**Feature 2: Interview Scheduling**
...
```

### Was passiert mit den Antworten?

Die gesammelten Infos werden dem Feature-Orchestrator mitgegeben:

```
Task mit subagent_type: "feature-orchestrator"
Prompt:
  Feature: E-Mail Templates

  ## Geklärte Anforderungen (vom User bestätigt):
  - UI: Eigene Settings-Page unter /settings/email-templates
  - Felder: name, subject, body, category (optional)
  - Keine externe API nötig
  - Permissions: Nur admin/recruiter dürfen Templates erstellen

  ## Betroffene Bereiche:
  - Migration: email_templates Tabelle
  - Hook: useEmailTemplates
  - Component: EmailTemplateForm, EmailTemplateList
  - Page: src/pages/settings/EmailTemplates.tsx
```

---

## ⚠️ WICHTIG: Feature-Orchestratoren führen die VOLLE Chain aus!

Wenn du Feature-Orchestratoren spawnst, führen DIESE die komplette Agent Chain durch:
- Der Feature-Orchestrator ruft selbst Backend → Frontend → UI Review → Test → QA auf
- Du wartest nur auf die Summary
- Du schreibst KEINEN Code selbst

---

## Multi-Feature Modus (2+ Features) - BEVORZUGT

**Nutze diesen Modus bei 2+ unabhängigen Features!**

```
Haupt-Orchestrator (DU)
│
├─► Task(feature-orchestrator) für Feature A
│   └── Feature-Orchestrator A führt SELBST aus:
│       Backend → Frontend → UI Review → Test → QA
│       └── Gibt Summary zurück
│
├─► Task(feature-orchestrator) für Feature B
│   └── Feature-Orchestrator B führt SELBST aus:
│       Backend → Frontend → UI Review → Test → QA
│       └── Gibt Summary zurück
│
└── DU: Sammle Summaries und präsentiere Gesamtergebnis
```

**Workflow:**
1. Splitte Features in einzelne, klar abgegrenzte Tasks
2. **Prüfe Abhängigkeiten zwischen Features** (siehe unten)
3. Für jedes Feature: Spawne `feature-orchestrator` Agent:
   ```
   Task mit subagent_type: "feature-orchestrator"
   run_in_background: true (für Parallelität)

   Prompt:
     Feature: [Name]
     Beschreibung: [Was soll gebaut werden]
     Betroffene Bereiche:
     - Hook: use[Feature] (falls nötig)
     - Component: [Name]Component
     - Integration: [Page].tsx
   ```
4. Bei unabhängigen Features: **PARALLEL** mit `run_in_background: true`
5. Warte auf alle mit `TaskOutput`
6. Sammle Summaries und präsentiere Gesamtergebnis

**Vorteil:** Dein Context bleibt klein, jedes Feature ist isoliert.

### ⚠️ Parallel vs. Sequentiell - Abhängigkeitsprüfung

**WICHTIG:** Parallel spawnen NUR wenn Features unabhängig sind!

| Situation | Modus | Grund |
|-----------|-------|-------|
| Features teilen keine DB/Hooks/Components | ✅ Parallel | Keine Konflikte |
| Feature B importiert Hook/Component von A | ⚠️ Sequentiell | B braucht A's Output |
| Feature B erweitert Tabelle von A | ⚠️ Sequentiell | Migration-Reihenfolge |
| Beide Features ändern dieselbe Datei | ⚠️ Sequentiell | Merge-Konflikte vermeiden |

**Beispiele:**

```
✅ PARALLEL (unabhängig):
- Talent Pools (eigene Tabellen, eigene Hooks)
- Matching Algorithm (eigene Tabellen, eigene Hooks)
→ Keine gemeinsamen Ressourcen

⚠️ SEQUENTIELL (abhängig):
- E-Mail Templates (erstellt email_templates Tabelle + useEmailTemplates)
- Auto-Notifications (braucht useEmailTemplates zum Senden)
→ Feature 2 importiert aus Feature 1
```

**Bei Unklarheit:** Frage den User ob Abhängigkeiten bestehen!

---

## Single-Feature Modus (1 Feature)

Wenn nur ein Feature implementiert wird, führe die Chain direkt aus:

## Agent Chain (Ausführungsreihenfolge)

Die Agents haben eine definierte Abhängigkeitskette:

```
┌─────────────────┐
│  Backend Agent  │  chain_order: 1
│  (Hooks, DB)    │  depends_on: []
└────────┬────────┘
         │ provides: hooks, types, migrations
         ▼
┌─────────────────┐
│ Frontend Agent  │  chain_order: 2
│ (Components)    │  depends_on: [backend-agent]
└────────┬────────┘
         │ provides: components, pages, forms
         ▼
┌─────────────────┐
│ UI Review Agent │  chain_order: 3
│ (Validation)    │  depends_on: [frontend-agent]
└────────┬────────┘
         │ provides: validation-report, ui-fixes
         ▼
┌─────────────────┐
│   Test Agent    │  chain_order: 4
│ (E2E Tests)     │  depends_on: [frontend-agent, ui-review-agent]
└────────┬────────┘
         │ provides: e2e-tests, test-results
         ▼
┌─────────────────┐
│    QA Agent     │  chain_order: 5 (FINAL)
│ (Live Testing)  │  depends_on: [test-agent]
└─────────────────┘
         │ provides: qa-report, screenshots, error-log
         │
         ▼
    ✅ Deploy Ready  OR  ❌ Zurück zu zuständigem Agent

┌─────────────────┐
│  Debug Agent    │  chain_order: on-demand
│ (Troubleshoot)  │  triggers: error-reported, test-failure, qa-failure
└─────────────────┘
```

**WICHTIG:** Agents dürfen NUR gestartet werden wenn ihre `depends_on` Agents abgeschlossen sind!

---

## Verfügbare Agent-Rollen

| Agent | chain_order | depends_on | provides |
|-------|-------------|------------|----------|
| **Backend Agent** | 1 | - | hooks, types, migrations |
| **Frontend Agent** | 2 | backend-agent | components, pages, forms |
| **UI Review Agent** | 3 | frontend-agent | validation-report, ui-fixes |
| **Test Agent** | 4 | frontend-agent, ui-review-agent | e2e-tests, test-results |
| **QA Agent** | 5 | test-agent | qa-report, screenshots, error-log |
| **Debug Agent** | on-demand | - | debug-report, root-cause |

---

## Ablauf

### Schritt 1: Task analysieren
Analysiere was der User will und identifiziere welche Agents benötigt werden.

### Schritt 2: Chain planen
Erstelle Plan basierend auf der Agent Chain:
1. Welche Agents sind nötig?
2. In welcher Reihenfolge (chain_order)?
3. Welche können parallel laufen (gleiche chain_order)?

### Schritt 3: User bestätigen lassen
Zeige den Plan mit klarer Reihenfolge und frage ob er so passt.

### Schritt 4: Sequentiell ausführen
Nach Bestätigung, starte die Agents **in chain_order**:
- **WARTE** bis ein Agent fertig ist bevor der nächste mit `depends_on` startet
- Agents ohne Abhängigkeiten können parallel laufen
- Nutze `subagent_type` passend zum Agent

## Wichtige Regeln

- Plane IMMER zuerst, führe NIEMALS direkt aus
- **Bei Unklarheiten SOFORT nachfragen** - niemals raten oder annehmen
- Nutze Haiku-Modell für einfache Tasks (kostengünstiger)
- Halte den User informiert über Fortschritt
- Subagents sollen bei Unklarheiten auch nachfragen (nicht einfach irgendwas bauen)

## Vor dem Start: Kläre alles

Bevor du den Plan erstellst, identifiziere offene Fragen:
- Welche Felder/Properties braucht das Feature?
- Wie soll die UI aussehen? (Liste, Cards, Modal?)
- Gibt es Abhängigkeiten zu anderen Features?
- Wer darf was sehen/bearbeiten? (Permissions)

Stelle diese Fragen BEVOR du planst, nicht während der Implementierung.

## Beispiel

User: "/orchestrate Füge ein Tasks Feature hinzu"

Dein Plan mit Agent Chain:
```
Chain Step 1: Backend Agent
├── Erstelle tasks Tabelle in Supabase
├── Erstelle RLS Policies
└── Erstelle useTasks Hook
    └─► provides: [hooks, types, migrations]

Chain Step 2: Frontend Agent (wartet auf Backend)
├── depends_on: [backend-agent] ✓
├── Erstelle TaskList Component
├── Erstelle TaskCard Component
└── Integriere in Application Detail
    └─► provides: [components, pages]

Chain Step 3: UI Review Agent (wartet auf Frontend)
├── depends_on: [frontend-agent] ✓
├── Prüfe Icon-Größen, Spacing, Colors
├── Validiere shadcn/ui Compliance
└── Melde Findings + Auto-Fixes
    └─► provides: [validation-report]

Chain Step 4: Test Agent (wartet auf UI Review)
├── depends_on: [frontend-agent, ui-review-agent] ✓
├── Schreibe E2E Test für Tasks CRUD
└── Teste beide Zustände (leer + mit Daten)
    └─► provides: [e2e-tests, test-results]

Chain Step 5: QA Agent (FINAL - wartet auf Test Agent)
├── depends_on: [test-agent] ✓
├── Startet Playwright im Live-Browser
├── Navigiert zur betroffenen Seite
├── Prüft auf Runtime-Fehler (Console, Network)
├── Macht Screenshots
└── Erstellt QA-Report
    └─► provides: [qa-report, screenshots]
    └─► Bei Fehler: Zurück zu zuständigem Agent
```

Dann: "Soll ich diesen Plan ausführen? Die Agents werden sequentiell in chain_order gestartet."

## UI Review Agent - Automatische Prüfungen

### ⚠️ ALLERERSTE AKTION - BEVOR IRGENDETWAS GESCHRIEBEN WIRD:

**UI Review Agent MUSS das Bash-Tool aufrufen mit:**
```
PORT=$(lsof -i :3000,:5173,:8080,:8083,:4173 -P 2>/dev/null | grep LISTEN | head -1 | awk '{print $9}' | cut -d: -f2) && npx playwright screenshot http://localhost:$PORT ui-review.png --full-page
```

⛔ NICHT als Text ausgeben - BASH-TOOL AUFRUFEN!
⛔ Verifizieren mit: ls -la ui-review.png

**DANN: Read ui-review.png**

Der UI Review Agent prüft IMMER nach Frontend-Änderungen auf:

| Problem | Beispiel | Check |
|---------|----------|-------|
| Doppelte Buttons | 2x Close Button im Dialog | Zähle Buttons pro Container |
| Icon-Größen | h-3 statt h-4 | Vergleiche mit ui-patterns.md |
| Spacing | gap-1 statt gap-2 | Token-Validierung |
| Redundante Header | Card Title + innerer h3 | DOM-Struktur prüfen |
| shadcn Compliance | Custom div statt Card | Component-Check |

Bei Findings → Frontend Agent korrigiert → UI Review prüft erneut

## QA Agent - Live Validation (FINAL STEP)

### ⚠️ ALLERERSTE AKTION - BEVOR IRGENDETWAS GESCHRIEBEN WIRD:

**QA Agent MUSS das Bash-Tool aufrufen mit:**
```
PORT=$(lsof -i :3000,:5173,:8080,:8083,:4173 -P 2>/dev/null | grep LISTEN | head -1 | awk '{print $9}' | cut -d: -f2) && npx playwright screenshot http://localhost:$PORT qa-check.png --full-page
```

⛔ NICHT als Text ausgeben - BASH-TOOL AUFRUFEN!
⛔ Verifizieren mit: ls -la qa-check.png

**DANN: Read qa-check.png**

Der QA Agent läuft IMMER am Ende und prüft im echten Browser:

| Prüfung | Was wird geprüft | Bei Fehler |
|---------|------------------|------------|
| Console Errors | Keine roten Fehler in Console | → Debug Agent |
| Network Errors | Keine 4xx/5xx Responses | → Backend Agent |
| UI Fehler | "Fehler beim Laden", undefined, NaN | → Frontend Agent |
| Loading States | Spinner verschwindet nach 2s | → Frontend Agent |
| Navigation | Alle Seiten erreichbar | → Frontend Agent |

**Workflow bei QA-Fehler:**
```
QA Agent findet Fehler
    ↓
Identifiziert zuständigen Agent (Backend/Frontend/Debug)
    ↓
Orchestrator ruft Agent erneut auf mit Fehlerbericht
    ↓
Agent fixt Problem
    ↓
QA Agent läuft erneut zur Validierung
    ↓
✅ Erst wenn QA PASS → Feature ist fertig
```

**QA Test ausführen:**
```bash
npx playwright test qa-validation.spec.ts
```

**Output:** `qa-screenshots/qa-report.md`

---

## Beispiel: Multi-Feature Modus - SO MACHST DU ES

User: "/orchestrate Implementiere Pipeline Velocity Widget und Upcoming Interviews Widget"

### Schritt 1: Analyse
"2 Features erkannt → Multi-Feature Modus. Features sind unabhängig → PARALLEL spawnen"

### Schritt 2: Plan erstellen und User bestätigen lassen
```
Feature 1: Pipeline Velocity Widget
├── Hook: usePipelineVelocity
├── Component: PipelineVelocityWidget
└── Integration: Dashboard.tsx

Feature 2: Upcoming Interviews Widget
├── Component: UpcomingInterviewsWidget
└── Integration: Dashboard.tsx

Beide Features sind unabhängig → Parallel mit 2 Feature-Orchestratoren
```

"Soll ich diesen Plan ausführen?"

### Schritt 3: Nach Bestätigung - Feature-Orchestratoren PARALLEL spawnen

**DU MUSST diese 2 Task-Aufrufe in EINER Message machen (parallel):**

```
Task 1:
  subagent_type: "general-purpose"
  run_in_background: true
  description: "Pipeline Velocity Widget"
  prompt: |
    Du bist ein Feature-Orchestrator.

    Feature: Pipeline Velocity Widget
    Beschreibung: Zeigt durchschnittliche Tage pro Pipeline-Stage

    Betroffene Bereiche:
    - Hook: usePipelineVelocity (berechnet aus application_stage_history)
    - Component: PipelineVelocityWidget
    - Integration: Dashboard.tsx

    DU MUSST die volle Agent Chain durchführen:
    1. Backend Agent → Hook erstellen
    2. Frontend Agent → Component erstellen
    3. UI Review Agent → ⚠️ MUSS Playwright Screenshot machen (Port automatisch finden!)
    4. Test Agent → E2E Test mit Playwright ausführen
    5. QA Agent → ⚠️ MUSS Playwright Screenshot machen (Port automatisch finden!)

    LIES: .claude/agents/feature-orchestrator/SKILL.md für Details

Task 2:
  subagent_type: "general-purpose"
  run_in_background: true
  description: "Upcoming Interviews Widget"
  prompt: |
    Du bist ein Feature-Orchestrator.

    Feature: Upcoming Interviews Widget
    Beschreibung: Zeigt nächste 5 anstehende Interviews

    Betroffene Bereiche:
    - Component: UpcomingInterviewsWidget
    - Integration: Dashboard.tsx

    DU MUSST die volle Agent Chain durchführen:
    1. Backend Agent → (skip wenn Hook existiert)
    2. Frontend Agent → Component erstellen
    3. UI Review Agent → ⚠️ MUSS Playwright Screenshot machen (Port automatisch finden!)
    4. Test Agent → E2E Test mit Playwright ausführen
    5. QA Agent → ⚠️ MUSS Playwright Screenshot machen (Port automatisch finden!)

    LIES: .claude/agents/feature-orchestrator/SKILL.md für Details
```

### Schritt 4: Warte auf beide mit TaskOutput

```
TaskOutput(task_id_1) → Summary Feature 1
TaskOutput(task_id_2) → Summary Feature 2
```

### Schritt 5: Gesamtergebnis präsentieren

```markdown
## Orchestration Complete

### Feature 1: Pipeline Velocity Widget ✅
- Backend: usePipelineVelocity Hook erstellt
- Frontend: Component erstellt
- Tests: 3/3 passed
- QA: PASS

### Feature 2: Upcoming Interviews Widget ✅
- Backend: (nicht nötig)
- Frontend: Component erstellt
- Tests: 2/2 passed
- QA: PASS

### Erstellte Dateien:
- src/hooks/usePipelineVelocity.ts
- src/components/dashboard/PipelineVelocityWidget.tsx
- src/components/dashboard/UpcomingInterviewsWidget.tsx
- tests/pipeline-velocity.spec.ts
- tests/upcoming-interviews.spec.ts
```
