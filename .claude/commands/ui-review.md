# UI Review Command: $ARGUMENTS

Manuelle UI/UX Konsistenz-Überprüfung für Komponenten und Seiten.

## ⚠️ ALLERERSTE AKTION - BEVOR DU IRGENDETWAS SCHREIBST:

Rufe das Bash-Tool auf mit diesem Befehl:
```
PORT=$(lsof -i :3000,:5173,:8080,:8083,:4173 -P 2>/dev/null | grep LISTEN | head -1 | awk '{print $9}' | cut -d: -f2) && npx playwright screenshot http://localhost:$PORT ui-review.png --full-page
```

⛔ **WICHTIG: Du musst das BASH-TOOL aufrufen!**
⛔ **NICHT den Befehl als Text/Markdown in deine Antwort schreiben!**
⛔ **NICHT sagen "ich führe aus..." - EINFACH TUN!**

Dann: Read-Tool auf ui-review.png

Verifiziere mit: `ls -la ui-review.png`
Wenn "No such file" → Du hast es NICHT gemacht!

---

## Zweck

Analysiere eine bestimmte Komponente oder Seite auf:
- Redundante Header
- Icon-Sizing Konsistenz
- Spacing-Token Einhaltung
- Theme-Color Nutzung
- shadcn/ui Compliance
- Visual Konsistenz

## Verwendung

```bash
/ui-review src/components/candidates/CandidateDetail.tsx
/ui-review src/pages/CandidateDetail.tsx
/ui-review candidates  # shortcut für src/components/candidates/
```

## Was passiert

1. **Parse** - Komponenten-Path aus $ARGUMENTS
2. **Load** - Code lesen + Dependencies analysieren
3. **Test** - Relevante Playwright-Tests ausführen
4. **Review** - UI-Pattern-Checks durchführen
5. **Report** - Findings mit Fix-Empfehlungen zeigen
6. **Fix** - Auto-Fix anbieten (mit Approval)

## Output

Strukturierter Report:

```
🔍 UI REVIEW REPORT
═════════════════════════════════════════════════════════

Component: CandidateDetail.tsx
Scope: src/pages/CandidateDetail.tsx + Dependencies

Status: ⚠️ 3 Issues Found

CRITICAL (must fix):
  ✗ Redundant "Skills" header - showHeader={false} missing

MEDIUM (should fix):
  ⚠ Icon size inconsistency in Contact section
  ⚠ Non-standard spacing p-2 should be p-3

TESTS:
  ✓ Header redundancy test
  ✓ Icon sizing test
  ⚠ Spacing token test (failing)

APPROVAL NEEDED:
User approves before auto-fix executes
```

## Optionen

### Fix Mode
```bash
/ui-review src/components/... --fix
```
Auto-fix wird immediately nach Review durchgeführt (mit Approval-Prompt)

### Dry Run
```bash
/ui-review src/components/... --dry-run
```
Zeigt Report, aber kein Auto-fix angeboten

### Verbose
```bash
/ui-review src/components/... --verbose
```
Detaillierte Analyse mit all findings

## Workflow Detailliert

### Schritt 1: User ruft Command auf
```
/ui-review src/pages/CandidateDetail.tsx
```

### Schritt 2: System spawnt UI Review Agent
Agent mit folgendem Kontext:
- Target file path
- Dependencies (andere Komponenten die importiert sind)
- Relevante Tests
- ui-patterns.md Rules

### Schritt 3: UI Review Agent analysiert

**Code Inspection:**
```typescript
// Liest Zieldatei
// Prüft gegen jede Rule aus ui-patterns.md:
- Header Redundanz
- Icon Sizing
- Spacing Tokens
- Theme Colors
- Component Library
- Card Patterns
```

**Test Execution:**
```bash
# Relevant Tests ausführen
npm test -- ui-consistency.spec.ts
npm test -- visual-regression.spec.ts
```

### Schritt 4: Report generieren
Agent zeigt:
- Summary (Issues Count)
- Each Issue mit Kontext
- Fix-Empfehlungen
- Test Results

### Schritt 5: User Approval
User reviewt Report und entscheidet:
- "OK, fix it" → Auto-fix läuft
- "Skip" → No changes
- "Custom" → User macht eigene Änderungen

### Schritt 6: Auto-Fix (if approved)
```typescript
// Für jedes Issue:
1. Edit file mit gezieltem Replacement
2. Verifyue Syntax ist korrekt
3. Run relevant tests
4. Show diff
5. Ask for final approval
6. Commit wenn OK
```

## Beispiel-Flows

### Flow 1: Quick Review
```
User: /ui-review src/pages/CandidateDetail.tsx

Agent: 🔍 Analyzing...
       ✓ Scanned 5 dependencies
       ✓ Ran 8 UI consistency tests

Report: 2 Issues found
        1 Critical (redundant headers)
        1 Medium (spacing)

User: "Fix it"

Agent: ✓ Fixed redundant headers
       ✓ Updated spacing tokens
       ✓ Tests passing
       ✓ Committed

Done!
```

### Flow 2: With Fixes
```
User: /ui-review src/components/applications/NotesSection.tsx

Agent: 🔍 Analyzing...

Report: 3 Issues found
        [Details shown]

User: "Tell me more about issue #1"

Agent: [Detailed explanation of first issue]

User: "Ok, fix all 3"

Agent: [Executes auto-fix for each issue]
       ✓ All fixes applied
       ✓ Tests passing
       ✓ Build successful
       ✓ Ready to commit
```

### Flow 3: Discussion
```
User: /ui-review src/components/...

Report: [Shows issues]

User: "I disagree with issue #2"

Agent: [Explains the ui-patterns.md rule]
       [Shows examples of correct implementation]

User: "Ok makes sense, fix all"

Agent: [Applies all fixes]
```

## Common Issues Detected

### Issue Type 1: Redundant Headers
```
FOUND: Card + Inner Component both have header
RULE: ui-patterns.md § 1.1
FIX: Add showHeader={false} to inner component
SEVERITY: Critical (affects UX directly)
```

### Issue Type 2: Icon Size Mismatch
```
FOUND: Icons using h-3, h-5, h-6 in same Card
RULE: ui-patterns.md § 3.1
FIX: Standardize to h-4 w-4
SEVERITY: Medium (visual inconsistency)
```

### Issue Type 3: Spacing Tokens
```
FOUND: p-2, gap-5, space-y-1 used
RULE: ui-patterns.md § 2
FIX: Use only 2, 3, 4, 6 variants
SEVERITY: Medium (layout inconsistency)
```

### Issue Type 4: Hardcoded Colors
```
FOUND: bg-blue-500, text-red-400
RULE: ui-patterns.md § 6.1
FIX: Use theme tokens (bg-primary, etc.)
SEVERITY: High (breaks theme switching)
```

### Issue Type 5: Doppelte Buttons (NEU - gelernt aus Document Preview)
```
FOUND: 2x Close/X Button im Dialog
RULE: ui-patterns.md § 7 Mistake 6
FIX: Entferne manuellen X Button, nutze eingebauten von DialogContent
SEVERITY: Critical (verwirrt User, sieht unprofessionell aus)
```

**Wie wird das erkannt:**
1. Playwright öffnet die Seite
2. Klickt auf Button der Dialog öffnet (z.B. "Vorschau")
3. Screenshot vom offenen Dialog
4. Zählt Buttons mit `role="button"` die X/Close ähneln
5. Mehr als 1 → Error reported

## Screenshot-basierte Prüfung (NEU)

Der UI Review Agent nutzt Playwright für visuelle Inspektion:

```typescript
// Beispiel: Dialog-Check
const page = await browser.newPage();
await page.goto('/candidates/...');

// Öffne Dialog
await page.click('button:has-text("Vorschau")');
await page.waitForSelector('[role="dialog"]');

// Screenshot machen
await page.screenshot({ path: 'dialog-preview.png' });

// Buttons im Dialog zählen
const closeButtons = await page.locator('[role="dialog"] button').filter({
  has: page.locator('svg') // Icons
}).count();

// Prüfen
if (closeButtons > expectedCount) {
  report.addIssue('Zu viele Buttons im Dialog', 'critical');
}
```

## Integration Points

### With Orchestrator
```
/orchestrate Add new Feature
  ↓
Frontend Agent creates components
  ↓
Orchestrator auto-triggers: /ui-review <changed-files>
  ↓
UI Review Agent reports + fixes
  ↓
Tests run
```

### With Git
```
Pre-commit hook (optional):
  Run: /ui-review src/ --dry-run
  If issues found: Prevent commit, show issues
```

### With CI/CD
```
On PR:
  Run: /ui-review . --fix
  If issues found: Auto-fix + commit to PR
  Or: Fail with detailed report
```

## Troubleshooting

### Issue: "No issues found but I see problems"
→ Run with `--verbose` flag to see detailed analysis

### Issue: "Fix didn't work"
→ Agent shows exact error + suggests manual intervention

### Issue: "Want to revert auto-fix"
→ Git history preserved, just revert last commit

## Best Practices

1. **Run after major component changes** - keep UI consistent
2. **Run before merging to main** - catch issues early
3. **Use --verbose for learning** - understand pattern rules
4. **Review reports carefully** - not all auto-fixes are perfect
5. **Ask follow-ups** - Agent can explain pattern decisions

## See Also

- `.claude/ui-patterns.md` - Complete pattern rules
- `.claude/skills/ui-review-agent/SKILL.md` - Agent documentation
- `tests/ui-consistency.spec.ts` - Automated tests
- `tests/visual-regression.spec.ts` - Screenshot tests
