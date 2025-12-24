# Create Style Guide

Interaktiver Style Guide Generator für **neue Projekte** und Websites.

---

## ⚠️ Wann diesen Command verwenden?

| Situation | Was tun |
|-----------|---------|
| **Neues Projekt starten** (noch kein Style vorhanden) | ✅ Diesen Command verwenden |
| Projekt hat bereits `STYLE-GUIDE.md` | → Vorhandenen Guide lesen, nicht neu erstellen |
| Style aus bestehendem Code extrahieren | → `project-style-guide` Skill |
| Website nachbauen (Original-Style übernehmen) | → `website-rebuild-research` Skill |
| Komplett freies kreatives Design | → `frontend-design` Skill |

---

## Workflow

Stelle dem User folgende Fragen um einen maßgeschneiderten Style Guide zu erstellen:

### Frage 1: Projekt-Typ

**Header:** "Projekt-Typ"
**Frage:** "Was für ein Projekt/Website wird erstellt?"

Optionen:
- **SaaS / Web App** - Dashboard, Admin Panel, komplexe UI
- **Corporate Website** - Unternehmensseite, professionell
- **Landing Page** - Marketing, Conversion-fokussiert
- **E-Commerce** - Shop, Produkte, Checkout

### Frage 2: Stil-Richtung

**Header:** "Stil"
**Frage:** "Welchen visuellen Stil bevorzugst du?"

Optionen:
- **Modern & Minimalistisch** - Clean, viel Whitespace, reduziert
- **Bold & Expressiv** - Kräftige Farben, große Typografie
- **Elegant & Premium** - Subtil, hochwertig, dezent
- **Freundlich & Approachable** - Runde Ecken, weiche Farben

### Frage 3: Farbschema

**Header:** "Farben"
**Frage:** "Welche Farbrichtung passt zum Projekt?"

Optionen:
- **Blau** - Vertrauen, Professionalität, Tech (Default für SaaS)
- **Grün** - Wachstum, Natur, Finanzen, Health
- **Violett** - Kreativität, Premium, Innovation
- **Orange/Rot** - Energie, Action, Dringlichkeit

### Frage 4: Animationen

**Header:** "Animationen"
**Frage:** "Wie viel Animation/Bewegung soll die UI haben?"

Optionen:
- **Minimal** - Nur essenzielle Transitions (hover, focus)
- **Subtil** - Sanfte Einblendungen, Micro-Interactions
- **Expressiv** - Auffällige Animationen, Page Transitions
- **Keine** - Statisch, maximale Performance

### Frage 5: Dark Mode

**Header:** "Dark Mode"
**Frage:** "Soll Dark Mode unterstützt werden?"

Optionen:
- **Ja, beide Modi** - Light + Dark mit Toggle
- **Nur Light Mode** - Heller Standard
- **Nur Dark Mode** - Dunkles Interface
- **System-basiert** - Folgt OS-Einstellung

### Frage 6: Border Radius

**Header:** "Ecken"
**Frage:** "Wie sollen die Ecken aussehen?"

Optionen:
- **Rund** - Weiche, freundliche Ecken (16px+)
- **Moderat** - Leicht gerundet (8-12px)
- **Scharf** - Minimale Rundung (4px)
- **Eckig** - Keine Rundung (0px)

---

## Style Guide Generation

Basierend auf den Antworten, generiere einen vollständigen Style Guide mit:

### 1. Farbpalette

**Blau (Trust/Tech):**
```css
--primary: 221 83% 53%;        /* #2563EB */
--primary-light: 217 91% 60%;  /* #3B82F6 */
--primary-dark: 224 76% 48%;   /* #1D4ED8 */
```

**Grün (Growth/Health):**
```css
--primary: 142 76% 36%;        /* #16A34A */
--primary-light: 142 71% 45%;  /* #22C55E */
--primary-dark: 142 72% 29%;   /* #15803D */
```

**Violett (Creative/Premium):**
```css
--primary: 262 83% 58%;        /* #8B5CF6 */
--primary-light: 258 90% 66%;  /* #A78BFA */
--primary-dark: 263 70% 50%;   /* #7C3AED */
```

**Orange/Rot (Energy/Action):**
```css
--primary: 24 95% 53%;         /* #F97316 */
--primary-light: 27 96% 61%;   /* #FB923C */
--primary-dark: 21 90% 48%;    /* #EA580C */
```

### 2. Typografie nach Stil

**Modern & Minimalistisch:**
- Headings: Inter, SF Pro, system-ui
- Body: Inter, system-ui
- Weights: 400, 500, 600

**Bold & Expressiv:**
- Headings: Space Grotesk, Clash Display
- Body: Inter, DM Sans
- Weights: 400, 600, 700, 800

**Elegant & Premium:**
- Headings: Playfair Display, Cormorant
- Body: Lora, Source Serif Pro
- Weights: 400, 500, 600

**Freundlich & Approachable:**
- Headings: Nunito, Quicksand
- Body: Open Sans, Lato
- Weights: 400, 500, 600, 700

### 3. Border Radius Mapping

| Auswahl | --radius | Cards | Buttons | Inputs |
|---------|----------|-------|---------|--------|
| Rund | 1rem | rounded-2xl | rounded-xl | rounded-lg |
| Moderat | 0.75rem | rounded-xl | rounded-lg | rounded-md |
| Scharf | 0.25rem | rounded-md | rounded-sm | rounded-sm |
| Eckig | 0 | rounded-none | rounded-none | rounded-none |

### 4. Animation Presets

**Minimal:**
```css
transition-colors duration-150
/* Nur Hover/Focus Farbwechsel */
```

**Subtil:**
```css
transition-all duration-300 ease-out
animate-fade-in (0.3s)
/* Sanfte Einblendungen */
```

**Expressiv:**
```css
transition-all duration-500 ease-in-out
animate-slide-up, animate-scale-in
/* Page Transitions, Stagger Effects */
```

### 5. Shadows nach Stil

**Modern/Minimalistisch:**
```css
shadow-sm: 0 1px 2px rgba(0,0,0,0.05)
shadow: 0 1px 3px rgba(0,0,0,0.1)
```

**Bold/Expressiv:**
```css
shadow-md: 0 4px 6px rgba(0,0,0,0.1)
shadow-lg: 0 10px 15px rgba(0,0,0,0.1)
shadow-xl: 0 20px 25px rgba(0,0,0,0.15)
```

**Elegant/Premium:**
```css
shadow-sm: 0 2px 8px rgba(0,0,0,0.04)
shadow: 0 4px 16px rgba(0,0,0,0.06)
```

---

## Output

Nach Beantwortung aller Fragen:

1. **Generiere `STYLE-GUIDE.md`** mit allen Design Tokens
2. **Generiere `tailwind.config.ts` Erweiterungen** (falls gewünscht)
3. **Generiere `src/index.css` CSS Variables** (falls gewünscht)

Frage am Ende:
- "Soll ich die Config-Dateien direkt erstellen/anpassen?"
- "Soll ich nur den Style Guide als Referenz erstellen?"

---

## Beispiel-Kombinationen

### SaaS Dashboard (Standard)
- Projekt: SaaS/Web App
- Stil: Modern & Minimalistisch
- Farbe: Blau
- Animation: Subtil
- Dark Mode: Ja, beide
- Ecken: Moderat

### Marketing Landing Page
- Projekt: Landing Page
- Stil: Bold & Expressiv
- Farbe: Orange
- Animation: Expressiv
- Dark Mode: Nur Light
- Ecken: Rund

### Premium Corporate
- Projekt: Corporate Website
- Stil: Elegant & Premium
- Farbe: Violett
- Animation: Minimal
- Dark Mode: System-basiert
- Ecken: Moderat
