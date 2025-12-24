# LeyalTech Website - Projekt-Anweisungen

## AGENTEN-PFLICHT - IMMER EINHALTEN!

**JEDE Aufgabe muss über die Agentenkette laufen!**

Auch vermeintlich "einfache" Aufgaben MÜSSEN über Agenten abgewickelt werden:

### Pflicht-Agenten nach Aufgabentyp:

| Aufgabe | Agent(en) |
|---------|-----------|
| Testimonial hinzufügen | `image-extractor` → `frontend-agent` → `ui-review-agent` |
| Komponente ändern | `frontend-agent` → `ui-review-agent` |
| Bild extrahieren | `image-extractor` |
| Bug fixen | `debug-agent` → `frontend-agent` → `test-agent` |
| Neues Feature | `Plan` → `orchestrator-agent` oder `feature-orchestrator` |
| Website nachbauen | `website-rebuild-agent` |
| UI prüfen | `ui-review-agent` |

### VERBOTEN:
- Direkt Code ändern ohne Agent
- Bilder mit `curl` statt `image-extractor` herunterladen
- Änderungen ohne `ui-review-agent` abschließen

### WARUM:
- Agenten haben spezialisiertes Wissen
- Qualitätssicherung ist eingebaut
- Konsistenz über alle Änderungen
- Learnings werden erfasst

**Keine Ausnahmen. Keine "ist ja nur schnell". IMMER Agenten.**

---

## MCP Server Konfiguration - KRITISCH FÜR SUBAGENTEN!

**⚠️ FATAL: Ohne `.mcp.json` haben Subagenten KEINEN Zugriff auf MCP Tools!**

### Das Problem:
Subagenten können nur auf MCP Tools zugreifen, wenn diese in `.mcp.json` im Projektverzeichnis konfiguriert sind. Ohne diese Datei:
- ❌ Subagenten können KEIN Playwright nutzen (keine Screenshots, keine Navigation)
- ❌ Subagenten können KEINE Browser-Tests durchführen
- ❌ QA-Agent, UI-Review-Agent, Test-Agent sind NUTZLOS

### Die Lösung:
**Alle MCP Server gehören in `.mcp.json` im Projektverzeichnis!**

### Datei: `.mcp.json`
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@executeautomation/playwright-mcp-server"],
      "env": {
        "HEADLESS": "true"
      }
    },
    "supabase": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-supabase", "--project-ref", "PROJECT_REF"]
    }
  }
}
```

### Playwright Headless-Modus (WICHTIG!)
**Browser soll IMMER im Hintergrund laufen - keine Fenster öffnen!**

1. **In `.mcp.json`:** `"env": { "HEADLESS": "true" }` (siehe oben)
2. **Bei jedem Aufruf:** `headless: true` Parameter setzen

```
mcp__playwright__playwright_navigate: url="...", headless=true
```

**Nach Änderung der `.mcp.json` → Claude Code neu starten!**

### Warum `.mcp.json` im Projekt?
- ✅ **Subagenten erben MCP-Tools** vom Hauptagent
- ✅ Projekt-spezifische MCP-Konfiguration
- ✅ Reproduzierbar für alle die am Projekt arbeiten
- ✅ Version-kontrolliert im Git

### Regeln:
- ✅ Neue MCP Server → zu `.mcp.json` hinzufügen
- ✅ Packages mit korrekten Namen (siehe bekannte Packages unten)
- ✅ Bei neuem Projekt: ZUERST `.mcp.json` erstellen!
- ❌ NIEMALS MCP-Config nur lokal/global speichern

### Bekannte funktionierende MCP Packages:

| Funktion | Package |
|----------|---------|
| Playwright (Browser) | `@executeautomation/playwright-mcp-server` |
| Puppeteer (Browser) | `@modelcontextprotocol/server-puppeteer` |
| Supabase | `@anthropic-ai/mcp-server-supabase` |

**ACHTUNG:** `@anthropic-ai/mcp-server-playwright` existiert NICHT!

### Subagenten die Playwright MCP brauchen:
| Agent | Playwright-Nutzung |
|-------|-------------------|
| `qa-agent` | Screenshots, Navigation, Console Logs, HTML-Analyse |
| `ui-review-agent` | Screenshots (Desktop/Mobile), Hover-Tests, Scroll-Tests |
| `test-agent` | Interaktive Tests, Click, Fill, Viewport-Resize |
| `debug-agent` | Screenshots zur Fehleranalyse |
| `design-review-agent` | Visual Regression, Screenshot-Vergleiche |

---

## Orchestrator-Workflow - KORREKTER ABLAUF

### Bei `/web-orchestrate`, `/orchestrate`, `/plan`:

**Der Orchestrator IST der Hauptagent und muss Tools selbst ausführen!**

### Korrekter Workflow:

```
/web-orchestrate "Scroll nicht smooth"
       │
       ▼
┌──────────────────────────────────────────────────┐
│ 1. ICH (Orchestrator) mache Screenshot           │
│    mkdir -p .debug/screenshots                   │
│    npx playwright screenshot ... review.png      │
└────────┬─────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────┐
│ 2. design-review-agent SPAWNEN (Analyse)         │
│    subagent_type: "design-review-agent"          │
│    prompt: "Screenshot: .debug/.../review.png"   │
│    → Agent analysiert (kann keine Tools!)        │
│    → Agent reportet: "Problem ist X in Zeile Y"  │
└────────┬─────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────┐
│ 3. ICH wende Fix an (Edit-Tool)                  │
│    Basierend auf Agent-Findings                  │
└────────┬─────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────┐
│ 4. ICH mache neuen Screenshot                    │
│    npx playwright screenshot ... review-2.png    │
└────────┬─────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────┐
│ 5. design-review-agent RESUMEN (Re-Validierung)  │
│    resume: [agent-id]                            │
│    prompt: "Neuer Screenshot: review-2.png"      │
│    → Agent validiert: "PASS" ✅                  │
└────────┬─────────────────────────────────────────┘
         │
         ▼
   📊 Final Report
```

### WARUM dieser Workflow?

1. **Analyse-Agents können KEINE Tools ausführen** (technische Limitation)
2. **Tool-Agents brauchen `general-purpose`** als subagent_type
3. **Screenshots MUSS der Hauptagent machen**
4. **Fixes MUSS der Hauptagent anwenden** basierend auf Findings
5. **Resume-Pattern** für iterative Validierung

---

## UI/UX Regeln - STRIKT EINHALTEN

### 1. Horizontal Scrollbare Container
**NIEMALS Navigation-Pfeile (ChevronLeft/ChevronRight) verwenden!**
- User scrollt mit Finger (Touch) oder Drag (Maus)
- Drag-to-Scroll Pattern implementieren (siehe Style Guide)
- `cursor-grab` / `cursor-grabbing` für visuelles Feedback
- Nur `overflow-x-auto snap-x snap-mandatory scrollbar-hide` verwenden

### 2. Card Alignment
**Bei Cards mit Progress Bars, Buttons oder Footer-Elementen:**
- Parent Card: `flex flex-col`
- Variabler Content (Description): `flex-1`
- Bottom-Element wird automatisch am unteren Rand aligned
- ALLE Cards in einer Reihe haben gleiche Höhe

### 3. Tab-basierte Komponenten
- Scroll-Position beim Tab-Wechsel zurücksetzen (scrollTo left: 0)
- useEffect mit activeTab als Dependency

### 4. Pagination/Indikatoren
- Nur als **visuelle Indikatoren**, NICHT klickbar
- Keine onClick Handler auf Pagination Dots

### 5. Hover-Effekte
**KEIN `hover:scale-*` bei Cards unter Tabs/Navigation!**
- Scale verursacht Überlappung mit darüberliegenden Elementen
- Stattdessen: `hover:border-white/30 hover:bg-white/10`

### 6. Full-Bleed Scroll-Container
**Negativer Margin + Padding um Hintergrund-Streifen zu vermeiden:**
```tsx
<div className="-mx-4 md:-mx-8">
  <div className="px-4 md:px-8 overflow-x-auto">
    {/* Cards */}
  </div>
</div>
```

### 7. Orphaned Grid Items vermeiden
**KEIN Grid bei dynamischen Listen!** Bei `grid-cols-3` mit 4 Items steht 1 alleine links unten.
- Grid nur bei fixer Anzahl die zur Spaltenanzahl passt (3, 6, 9)
- Dynamische Listen (Testimonials, Cards) → **Horizontal scrollbar**

### 8. Design Review bei Referenz-Komponenten
**Wenn ein Pattern aus einer bestehenden Komponente kopiert wird:**
- Prüfen ob das Original selbst sauber ist (keine redundanten Elemente)
- Nicht blind kopieren, sondern kritisch hinterfragen
- Beispiel: Doppelte Indikatoren (Scroll Dots + Phase Indicator) → nur eines behalten

### 9. Scroll vs Grid Entscheidung
**Horizontal Scroll nur wenn nötig:**
- **≤4 Items:** Grid verwenden (alle sichtbar, kein Scroll)
- **5+ Items:** Horizontal Scroll erlaubt
- **Responsive:** Grid auf Desktop (lg+), Scroll auf Mobile/Tablet wenn Items nicht passen
- Scroll-Dots nur anzeigen wenn tatsächlich gescrollt werden kann (`lg:hidden`)

```tsx
// Beispiel: 4 Testimonials
<div className="
  flex gap-4 overflow-x-auto lg:grid lg:grid-cols-4 lg:overflow-visible
">
```

### 10. overflow-hidden Container - IMMER Content-Größe prüfen!

**⚠️ Bei JEDEM Review mit `overflow-hidden` + fixer Höhe:**

1. **Container-Größe ermitteln:**
   - `h-48` = 192px, `h-64` = 256px, `h-80` = 320px, `h-96` = 384px

2. **Content-Größe prüfen:**
   - Bei Animationen: CSS nach `min-height`, `height` suchen
   - Bei SVGs: `viewBox` Dimensionen checken
   - Bei verschachtelten Komponenten: Deren Größen prüfen

3. **Vergleichen:** Content > Container = **ABGESCHNITTEN!**

**Code-Warnsignal:**
```tsx
// ⚠️ GEFAHR: overflow-hidden + fixe Höhe
<div className="h-48 overflow-hidden">  // ← 192px max
  <Animation />                          // ← braucht vielleicht 400px!
</div>
```

**Lösung:**
```tsx
// ✅ Dynamische Höhe mit aspect-ratio
<div className="aspect-[4/3] overflow-hidden">
  <Animation />
</div>
```

**NIEMALS "Keine Fixes notwendig" sagen ohne:**
- [ ] Container-Größe geprüft (h-XX = wie viele px?)
- [ ] Content-Größe geprüft (min-height, height, viewBox)
- [ ] Visuell verifiziert dass ALLE Inhalte sichtbar sind
- [ ] Nicht nur "sieht okay aus" sondern "alles ist da"

## Debug-Ordnerstruktur - PFLICHT!

**Alle Debug-Artefakte gehören in `.debug/` - NIEMALS im Root!**

### Ordnerstruktur
```
.debug/
├── screenshots/      # Alle Playwright/Agent Screenshots
│   ├── qa-check.png
│   ├── ui-review.png
│   ├── debug.png
│   └── design-review.png
└── scripts/          # Temporäre Debug-Scripts
    └── *.sh
```

### Regeln:
1. **Screenshots** → `.debug/screenshots/`
2. **Debug-Scripts** → `.debug/scripts/`
3. **Vor Screenshot**: `mkdir -p .debug/screenshots`
4. **Aufräumen optional** - Ordner ist in `.gitignore`

### VERBOTEN:
- ❌ Screenshots im Root (`qa-check.png`, `ui-review.png`)
- ❌ Debug-Scripts im Root (`run-qa.sh`, `test-*.sh`)
- ❌ Playwright-Artefakte außerhalb von `.debug/`

### Warum:
- Root bleibt sauber
- `.gitignore` erfasst alles automatisch
- Dokumentation der Debug-History möglich
- Einfaches Aufräumen: `rm -rf .debug/*`

---

## Sub-Agent Best Practices (Indie Dev Dan Pattern)

**Quelle:** Claude Code Sub-Agents Video - Die 2 größten Fehler vermeiden!

### 1. Sub-Agents antworten dem PRIMARY Agent, nicht dem User!

```
USER → PRIMARY AGENT → SUB-AGENT → PRIMARY AGENT → USER
              ↑              │
              └──────────────┘
        Sub-Agent antwortet an
        Primary, NICHT an User!
```

**Das ändert WIE du Prompts schreibst!**

### 2. Agent-Dateien sind SYSTEM Prompts, nicht User Prompts

Was du in SKILL.md schreibst ist der **System Prompt** des Sub-Agents.
Der **User Prompt** kommt vom Primary Agent basierend auf der Description.

### 3. Description = Anweisung an Primary Agent (KRITISCH!)

```yaml
description: |
  # Trigger Keywords
  Use when user says: "tts", "tts summary", "speak this".

  # Anweisungen an Primary Agent
  IMPORTANT: When prompting this agent, provide:
  1. Was zusammengefasst werden soll
  2. Welcher Kontext wichtig ist

  # Context Warning
  REMEMBER: This agent has NO CONTEXT from your conversation.
  Include ALL relevant details in your prompt.
```

### 4. Trigger Keywords definieren

```yaml
# Im Description-Feld:
Use when user says: "create agent", "build agent", "new agent".
Also triggered by: "erstelle agent", "neuer agent".
```

### 5. Report Format für Primary Agent

Sub-Agents müssen wissen WIE sie zurück kommunizieren:

```markdown
## Output Format

Strukturierte Antwort für Primary Agent:

### Summary
[Was wurde gemacht]

### Next Steps
[Empfehlungen für Primary Agent]

### Message for User
"Claude, respond to user with: [Nachricht]"
```

### 6. Workflow-Chaining mit Sub-Agents

```
Prompt → Primary Agent → Sub-Agent 1 → Primary Agent
                              ↓
                        Sub-Agent 2 → Primary Agent
                              ↓
                        Sub-Agent 3 → Primary Agent → Response
```

Jeder Sub-Agent hat eigenen isolierten Kontext = weniger Fehler!

### 7. Limitationen beachten

- **Sub-Agents können KEINE Sub-Agents aufrufen**
- **Sub-Agents haben KEINEN Kontext** - alles muss im Prompt sein
- **Zu viele Agents = Decision Overload** für Primary Agent

---

## Agent-Architektur - AKTUALISIERT!

### ✅ Subagenten KÖNNEN MCP-Tools nutzen!

**Voraussetzung:** `.mcp.json` muss im Projektverzeichnis existieren!

Subagenten haben Zugriff auf:
- Read, Grep, Glob (Standard)
- **Playwright MCP** (wenn in `.mcp.json` konfiguriert)
- **Andere MCP-Tools** (wenn in `.mcp.json` konfiguriert)

Sie können NICHT ausführen: Bash, Edit, Write (native Tools)

---

### Die 3 Agent-Kategorien

#### 1. MCP-FÄHIGE AGENTS (können Playwright MCP nutzen)
```
qa-agent, ui-review-agent, test-agent, debug-agent,
design-review-agent
```

**Diese Agents können selbstständig:**
- `mcp__playwright__playwright_navigate` - Zu URLs navigieren
- `mcp__playwright__playwright_screenshot` - Screenshots machen
- `mcp__playwright__playwright_resize` - Viewports ändern (Mobile/Desktop)
- `mcp__playwright__playwright_click` - Elemente klicken
- `mcp__playwright__playwright_console_logs` - Console prüfen

**Workflow (autonom):**
1. Agent navigiert selbst zur URL
2. Agent macht selbst Screenshots
3. Agent analysiert und gibt Findings zurück
4. Hauptagent wendet Fixes an
5. Agent resumed und re-validiert

#### 2. TOOL-AGENTS (brauchen general-purpose für Write/Edit)
```
frontend-agent, backend-agent, page-builder-agent,
website-rebuild-agent
```

**WICHTIG:** Diese Agents müssen via `subagent_type: "general-purpose"` gespawnt werden für Schreibzugriff!

```
Task:
  subagent_type: "general-purpose"  # ← Für Write/Edit Zugriff
  prompt: |
    Du bist der Frontend Agent.
    Feature: [Name]
    Erstelle: Component + Integration
```

#### 3. ORCHESTRATORS (SIND der Hauptagent)
```
orchestrator-agent, feature-orchestrator, web-orchestrator
```

Orchestrators sind selbst der Hauptagent und müssen:
- Tool-Agents via `general-purpose` spawnen (für Write/Edit)
- MCP-fähige Agents direkt spawnen (für Playwright)
- Fixes selbst anwenden
- Agents zur Re-Validierung resumen

---

### Workflow mit MCP-fähigem Agent (NEU!)

```
┌────────────────────────────────────────────────────────┐
│ SUBAGENT (qa-agent, ui-review-agent, etc.)             │
├────────────────────────────────────────────────────────┤
│ 1. mcp__playwright__playwright_navigate                │
│    → http://localhost:5173                             │
│                                                        │
│ 2. mcp__playwright__playwright_screenshot              │
│    → Speichert in .debug/screenshots/                  │
│                                                        │
│ 3. mcp__playwright__playwright_resize                  │
│    → device="iPhone 13" für Mobile-Test                │
│                                                        │
│ 4. Analyse + Findings zurückgeben                      │
│    → "Problem X in Zeile Y"                            │
│                                                        │
│ 5. Bei Resume: Erneut Screenshot + Validierung         │
└────────────────────────────────────────────────────────┘
```

**Der Agent macht alles selbst - kein Hauptagent-Screenshot nötig!**

---

### Legacy Workflow (wenn Agent kein MCP hat)

```
┌────────────────────────────────────────────────────────┐
│ HAUPTAGENT                                             │
├────────────────────────────────────────────────────────┤
│ Task spawnen:                                          │
│   subagent_type: "general-purpose"  # ← WICHTIG!      │
│   prompt: |                                            │
│     Du bist der Frontend Agent.                        │
│     Feature: UserProfile                               │
│     Erstelle: src/components/UserProfile.tsx           │
│     Integriere in: src/pages/Settings.tsx              │
│                                                        │
│ Agent führt aus:                                       │
│   → Write/Edit Tools (hat Zugriff via general-purpose) │
│   → Gibt Summary zurück                                │
└────────────────────────────────────────────────────────┘
```

---

### NIEMALS

- ❌ Analyse-Agents bitten Screenshots zu machen (geht nicht!)
- ❌ Analyse-Agents bitten Code zu ändern (geht nicht!)
- ❌ Tool-Agents mit deren Namen spawnen (`subagent_type: "frontend-agent"`)
- ❌ Erwarten dass Sub-Agents Bash/Playwright ausführen

### IMMER

- ✅ Screenshots als Hauptagent machen
- ✅ Tool-Agents via `subagent_type: "general-purpose"`
- ✅ Analyse-Agents für Analyse, Hauptagent für Fixes
- ✅ Resume-Pattern für Re-Validierung nutzen

## Interaktives Testing - PFLICHT bei UI-Verhalten

### Wann interaktiv testen?
Ein statischer Screenshot reicht NICHT bei:
- **Scroll-Verhalten** (smooth scroll, snap, drag-to-scroll)
- **Animationen** (Transitions, Keyframes, Timing)
- **Hover-Effekte** (States, Transitions)
- **Touch/Drag-Interaktionen** (Drag-to-scroll, Swipe)
- **Timing-basierte Effekte** (Delays, Sequences)

### WIE testen?

**Option 1: Playwright interaktiv (bevorzugt)**
```javascript
// test-interaction.js
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: false }); // WICHTIG!
  const page = await browser.newPage();
  await page.goto('http://localhost:PORT');

  // Beispiel: Drag-to-scroll testen
  const container = await page.locator('.snap-x').first();
  const box = await container.boundingBox();
  await page.mouse.move(box.x + 300, box.y + 100);
  await page.mouse.down();
  await page.mouse.move(box.x + 100, box.y + 100, { steps: 10 });
  await page.mouse.up();

  await page.waitForTimeout(5000); // Zeit zum Beobachten
  await browser.close();
})();
```

**Option 2: User fragen**
Wenn Playwright-Test zu komplex → User direkt bitten:
"Kannst du kurz http://localhost:8084 öffnen und das Scroll-Verhalten testen?"

### VERBOTEN:
- ❌ "Fix implementiert!" ohne interaktiven Test
- ❌ Nur statischen Screenshot bei Animations-/Scroll-Changes
- ❌ Annehmen dass Code-Änderung funktioniert ohne Verifikation
- ❌ `headless: true` bei visuellen Interaktionstests

### Checkliste bei UI-Behavior-Changes:
- [ ] Code geändert
- [ ] Dev Server läuft
- [ ] **Interaktiv getestet** (Playwright headless:false ODER User gefragt)
- [ ] Verhalten bestätigt
- [ ] Erst dann "Fix implementiert" sagen

---

## Playwright/Node Scripts - IMMER im Projektverzeichnis!

### Das Problem:
Scripts die npm-Pakete importieren (playwright, etc.) funktionieren NUR
wenn sie im Projektverzeichnis liegen wo `node_modules` existiert.

### VERBOTEN:
- ❌ `cat > /tmp/test.mjs` → Node findet keine Pakete!
- ❌ `cat > /var/folders/.../test.js` → Gleiches Problem!
- ❌ Irgendein Pfad außerhalb des Projekts

### PFLICHT:
- ✅ Script im Projektverzeichnis erstellen: `cat > test-script.mjs`
- ✅ Danach aufräumen: `rm test-script.mjs`

### Beispiel:
```bash
# ❌ FALSCH - wird fehlschlagen
cat > /tmp/test.mjs << 'EOF'
import { chromium } from 'playwright';
EOF
node /tmp/test.mjs  # Error: Cannot find package 'playwright'

# ✅ RICHTIG - im Projektverzeichnis
cat > test-playwright.mjs << 'EOF'
import { chromium } from 'playwright';
EOF
node test-playwright.mjs  # Funktioniert!
rm test-playwright.mjs    # Aufräumen
```

---

## Externe URLs - NIEMALS raten!

### LinkedIn, Social Media, Websites
**URLs NIEMALS erfinden oder raten!**

**Pflicht-Workflow:**
1. `WebSearch` mit `"[Name]" site:linkedin.com` oder `"[Firma]" LinkedIn`
2. Gefundene URL validieren (Name, Firma, Position prüfen)
3. Erst dann verwenden

**Beispiel:**
- ❌ FALSCH: `linkedin.com/in/maxmustermann` (geraten)
- ✅ RICHTIG: WebSearch → `de.linkedin.com/in/max-mustermann-123456` (validiert)

**Gilt für:**
- LinkedIn (Personen UND Firmen)
- Twitter/X Profile
- GitHub Profile
- Alle externen URLs in Schema Markup

## Style Guide
Vollständiger Style Guide: `.claude/skills/leyaltech-style-guide/SKILL.md`

## Tech Stack
- React + TypeScript + Vite
- Tailwind CSS
- shadcn/ui Komponenten
- Lucide React Icons

## Agents/Skills/Commands - Projekt-Unabhängigkeit

**KRITISCHE REGEL für Claude Code Infrastruktur:**

### Was NIEMALS projekt-spezifisch sein darf:
- **Agents** (`.claude/agents/`) - MÜSSEN universell funktionieren
- **Skills** (`.claude/skills/`) - MÜSSEN wiederverwendbar sein
- **Commands** (`.claude/commands/`) - MÜSSEN überall nutzbar sein

### Regeln:
1. **KEINE hardcodierten Projektnamen** in Agent/Skill/Command Dateien
   - ❌ "ShortSelect ATS", "LeyalTech Website", "MeinProjekt"
   - ✅ Generische Beschreibungen oder `[Projektname]` Platzhalter

2. **Agent-Referenzen müssen funktionieren**
   - Wenn ein Command/Agent einen `subagent_type` referenziert
   - MUSS dieser Agent existieren oder `general-purpose` genutzt werden

3. **Skill-Referenzen müssen existieren**
   - Keine erfundenen Skill-Pfade wie `frontend/xyz` wenn es das nicht gibt

### Erlaubte Ausnahmen (projekt-spezifisch):
- `leyaltech-style-guide` - Dieses Projekt hat einen eigenen Style Guide
- `ui-patterns.md` - Kann projekt-spezifische Patterns haben
- `STYLE-GUIDE.md` - Ist immer projekt-spezifisch

### Bei Problemen:
Wenn Agents/Commands nicht die richtigen Skills oder andere Agents aufrufen:
1. Analyse durchführen: Welche Referenzen sind kaputt?
2. Fehlende Komponenten erstellen
3. Oder Referenzen auf existierende umstellen

**Diese Regel gilt auch für die globale ~/.claude/CLAUDE.md!**

## Agent-Dateien - Frontmatter & Benennung

**Claude Code parst ALLE `.md` Dateien in `.claude/agents/` als Agents!**

### Agent-Dateien brauchen Frontmatter:
```yaml
---
name: agent-name
description: Kurze Beschreibung wann der Agent verwendet wird
tools: ["Read", "Write", "Edit", "Bash", "Grep", "Glob"]
---
```

### Dokumentation NICHT als Agent parsen:
Dateien die KEINE Agents sind (README, GUIDE, PLAN, etc.):
- ✅ Mit Underscore prefixen: `_README.md`, `_INTEGRATION_GUIDE.md`
- ✅ Oder in Unterordner verschieben: `docs/README.md`
- ❌ NIEMALS: `README.md` direkt im agents-Ordner

### Beispiel Ordnerstruktur:
```
.claude/agents/
├── ui-review-agent/
│   ├── SKILL.md          # ← Agent (hat Frontmatter)
│   └── _README.md        # ← Doku (wird ignoriert)
├── backend-agent/
│   ├── SKILL.md          # ← Agent
│   └── _instructions.md  # ← Doku
└── _README.md            # ← Globale Doku (wird ignoriert)
```

## MCP Server - Korrekte Packages

**Bekannte funktionierende MCP Packages:**

| Funktion | Package |
|----------|---------|
| Playwright (Browser) | `@executeautomation/playwright-mcp-server` |
| Puppeteer (Browser) | `@modelcontextprotocol/server-puppeteer` |
| Supabase | `@anthropic-ai/mcp-server-supabase` |

**ACHTUNG:** `@anthropic-ai/mcp-server-playwright` existiert NICHT!

### MCP Config Beispiel:
```json
{
  "mcpServers": {
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@executeautomation/playwright-mcp-server"]
    }
  }
}
```
