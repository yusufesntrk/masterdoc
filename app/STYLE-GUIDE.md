# MasterDoc - Style Guide

> Design-System basierend auf PandaDoc/DocuSign UI-Patterns

---

## 1. Farben

### 1.1 Primärfarben
```css
--primary: #00b47e;           /* MasterDoc Grün */
--primary-hover: #00a06e;     /* Hover-State */
--primary-light: #e6f9f3;     /* Hintergrund-Akzent */
--primary-dark: #008f64;      /* Pressed-State */
```

### 1.2 Textfarben
```css
--text-primary: #1a1a1a;      /* Haupttext, Überschriften */
--text-secondary: #6b7280;    /* Sekundärtext, Labels */
--text-muted: #9ca3af;        /* Placeholder, deaktiviert */
--text-inverse: #ffffff;      /* Text auf dunklem Hintergrund */
```

### 1.3 Hintergründe
```css
--background: #f9fafb;        /* App-Hintergrund */
--surface: #ffffff;           /* Cards, Panels */
--surface-hover: #f3f4f6;     /* Hover auf Cards */
--surface-active: #e5e7eb;    /* Active/Selected */
```

### 1.4 Borders
```css
--border: #e5e7eb;            /* Standard-Border */
--border-light: #f3f4f6;      /* Subtile Trennlinien */
--border-focus: #00b47e;      /* Focus-Ring */
```

### 1.5 Status-Farben
```css
/* Dokument-Status */
--status-draft: #6b7280;      /* Grau - Entwurf */
--status-sent: #3b82f6;       /* Blau - Gesendet */
--status-viewed: #f59e0b;     /* Gelb/Orange - Angesehen */
--status-signed: #10b981;     /* Grün - Unterzeichnet */
--status-expired: #ef4444;    /* Rot - Abgelaufen */

/* Feedback */
--success: #10b981;
--warning: #f59e0b;
--error: #ef4444;
--info: #3b82f6;
```

### 1.6 Empfänger-Farben (für Feld-Zuweisung)
```css
--recipient-1: #00b47e;       /* Grün */
--recipient-2: #3b82f6;       /* Blau */
--recipient-3: #f59e0b;       /* Orange */
--recipient-4: #8b5cf6;       /* Lila */
--recipient-5: #ec4899;       /* Pink */
```

---

## 2. Typografie

### 2.1 Font Family
```css
font-family: system-ui, -apple-system, BlinkMacSystemFont,
             'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

### 2.2 Font Sizes
| Name | Size | Line Height | Verwendung |
|------|------|-------------|------------|
| `xs` | 12px | 16px | Badges, Hinweise |
| `sm` | 14px | 20px | Body-Text, Labels |
| `base` | 16px | 24px | Standard-Text |
| `lg` | 18px | 28px | Subtitles |
| `xl` | 20px | 28px | Card-Titles |
| `2xl` | 24px | 32px | Section Headers |
| `3xl` | 30px | 36px | Page Titles |

### 2.3 Font Weights
```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### 2.4 Anwendung
```css
/* Überschriften */
h1 { font-size: 30px; font-weight: 600; color: var(--text-primary); }
h2 { font-size: 24px; font-weight: 600; color: var(--text-primary); }
h3 { font-size: 20px; font-weight: 500; color: var(--text-primary); }

/* Body */
body { font-size: 14px; font-weight: 400; color: var(--text-primary); }

/* Labels */
label { font-size: 14px; font-weight: 500; color: var(--text-secondary); }

/* Muted */
.muted { font-size: 12px; color: var(--text-muted); }
```

---

## 3. Abstände (Spacing)

### 3.1 Basis-Einheit
```css
--spacing-unit: 4px;
```

### 3.2 Spacing Scale
| Name | Value | Verwendung |
|------|-------|------------|
| `0` | 0 | Reset |
| `1` | 4px | Micro-Gaps |
| `2` | 8px | Tight |
| `3` | 12px | Small |
| `4` | 16px | Default |
| `5` | 20px | Medium |
| `6` | 24px | Large |
| `8` | 32px | XL |
| `10` | 40px | 2XL |
| `12` | 48px | 3XL |
| `16` | 64px | Section |

### 3.3 PandaDoc-spezifische Abstände
```css
/* Block-Layout */
--block-padding-y: 6px;       /* Vertikaler Innenabstand */
--block-padding-x: 8px;       /* Horizontaler Innenabstand */
--block-margin: 14px;         /* Abstand zwischen Blöcken */
--block-handle-width: 8px;    /* Breite des Drag-Handles */

/* Sidebar */
--sidebar-width: 220px;       /* Rechte Seitenleiste */
--page-strip-width: 64px;     /* Linke Seitenleiste */

/* Canvas */
--canvas-page-width: 816px;   /* A4 Breite (96dpi) */
--canvas-page-shadow: 0 1px 3px rgba(0,0,0,0.1);

/* Quick-Add Menü */
--quick-add-width: 180px;
--quick-add-item-height: 30px;

/* Dashboard */
--table-row-height: 56px;
--tab-underline: 2px;
```

---

## 4. Border Radius

```css
--radius-sm: 4px;             /* Buttons, Inputs */
--radius-md: 6px;             /* Cards */
--radius-lg: 8px;             /* Modals */
--radius-xl: 12px;            /* Large Cards */
--radius-full: 9999px;        /* Pills, Avatars */
```

---

## 5. Shadows

```css
/* Elevation Levels */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
--shadow-xl: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);

/* Spezielle Shadows */
--shadow-card: var(--shadow-md);
--shadow-dropdown: var(--shadow-lg);
--shadow-modal: var(--shadow-xl);
--shadow-page: 0 0 10px rgba(0, 0, 0, 0.1);
```

---

## 6. Komponenten

### 6.1 Buttons

#### Primary Button
```css
.btn-primary {
  background: var(--primary);
  color: white;
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  font-weight: 500;
  font-size: 14px;
  border: none;
  cursor: pointer;
  transition: background 0.15s ease;
}
.btn-primary:hover {
  background: var(--primary-hover);
}
.btn-primary:active {
  background: var(--primary-dark);
}
```

#### Secondary Button
```css
.btn-secondary {
  background: white;
  color: var(--text-primary);
  border: 1px solid var(--border);
  /* Rest wie Primary */
}
.btn-secondary:hover {
  background: var(--surface-hover);
}
```

#### Ghost Button
```css
.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  border: none;
}
.btn-ghost:hover {
  background: var(--surface-hover);
}
```

### 6.2 Inputs

```css
.input {
  height: 40px;
  padding: 0 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 14px;
  color: var(--text-primary);
  background: white;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.input::placeholder {
  color: var(--text-muted);
}
.input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-light);
}
```

### 6.3 Badges

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 500;
  border-radius: var(--radius-full);
}

/* Status-Varianten */
.badge-draft { background: #f3f4f6; color: #6b7280; }
.badge-sent { background: #dbeafe; color: #1d4ed8; }
.badge-viewed { background: #fef3c7; color: #b45309; }
.badge-signed { background: #d1fae5; color: #047857; }
.badge-expired { background: #fee2e2; color: #b91c1c; }
```

### 6.4 Cards

```css
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
}
```

### 6.5 Tabs

```css
.tab {
  padding: 12px 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
}
.tab:hover {
  color: var(--text-primary);
}
.tab.active {
  color: var(--text-primary);
  border-bottom-color: var(--primary);
}
```

### 6.6 Avatar

```css
.avatar {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  background: var(--primary-light);
  color: var(--primary);
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### 6.7 Table

```css
.table-row {
  height: var(--table-row-height); /* 56px */
  border-bottom: 1px solid var(--border-light);
  transition: background 0.1s;
}
.table-row:hover {
  background: var(--surface-hover);
}
.table-header {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;
}
```

---

## 7. Editor-spezifische Styles

### 7.1 Block-Container

```css
.block {
  position: relative;
  padding: var(--block-padding-y) var(--block-padding-x);
  margin-bottom: var(--block-margin);
  border-radius: var(--radius-sm);
  transition: background 0.1s;
}
.block:hover {
  background: rgba(0, 0, 0, 0.02);
}
.block.selected {
  background: var(--primary-light);
  outline: 2px solid var(--primary);
}
```

### 7.2 Drag-Handle

```css
.drag-handle {
  width: var(--block-handle-width); /* 8px */
  height: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  cursor: grab;
  opacity: 0;
  transition: opacity 0.15s;
}
.block:hover .drag-handle {
  opacity: 1;
}
.drag-handle:active {
  cursor: grabbing;
}
.drag-handle-dot {
  width: 3px;
  height: 3px;
  background: var(--text-muted);
  border-radius: 50%;
}
```

### 7.3 Insert-Line (Plus-Icon)

```css
.insert-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  display: flex;
  align-items: center;
  opacity: 0;
  transition: opacity 0.15s;
}
.insert-line.visible {
  opacity: 1;
}
.insert-line::before,
.insert-line::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--primary);
  opacity: 0.5;
}
.insert-line-button {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;
}
.insert-line-button:hover {
  background: var(--primary-hover);
}
```

### 7.4 Block-Toolbar (Floating)

```css
.block-toolbar {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 4px;
  padding: 4px;
  background: white;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-dropdown);
}
.block-toolbar-button {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  cursor: pointer;
  transition: background 0.1s, color 0.1s;
}
.block-toolbar-button:hover {
  background: var(--surface-hover);
  color: var(--text-primary);
}
```

### 7.5 Quick-Add Menu

```css
.quick-add-menu {
  width: var(--quick-add-width); /* 180px */
  background: white;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-dropdown);
  padding: 8px 0;
}
.quick-add-section {
  padding: 8px 12px 4px;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
}
.quick-add-item {
  height: var(--quick-add-item-height); /* 30px */
  padding: 0 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-primary);
  cursor: pointer;
  transition: background 0.1s;
}
.quick-add-item:hover {
  background: var(--surface-hover);
}
.quick-add-item-shortcut {
  margin-left: auto;
  font-size: 12px;
  color: var(--text-muted);
}
```

### 7.6 Sidebar Blocks (Bausteine)

```css
.sidebar-block {
  width: 85px;
  height: 45px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: white;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.sidebar-block:hover {
  border-color: var(--primary);
  background: var(--surface-hover);
}
.sidebar-block-icon {
  width: 20px;
  height: 20px;
  color: var(--text-secondary);
}
.sidebar-block-label {
  font-size: 11px;
  color: var(--text-primary);
}
```

### 7.7 Ausfüllbare Felder (Kacheln)

```css
.field-tile {
  width: 100px;
  height: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  border: 1px solid var(--primary);
  border-radius: var(--radius-sm);
  background: var(--primary-light);
  opacity: 0.7;
  cursor: pointer;
  transition: opacity 0.15s, border-color 0.15s;
}
.field-tile:hover {
  opacity: 1;
  border-color: var(--primary-hover);
}
.field-tile-icon {
  width: 16px;
  height: 16px;
  color: var(--primary);
}
.field-tile-label {
  font-size: 10px;
  color: var(--text-primary);
}
```

---

## 8. Layout

### 8.1 Dashboard Layout

```
┌────────────────────────────────────────────────────┐
│ Header (56px)                                      │
│ ┌────────────┐ ┌─────────────────┐ ┌────────────┐ │
│ │ Logo       │ │ Search          │ │ User + CTA │ │
│ └────────────┘ └─────────────────┘ └────────────┘ │
├────────────────────────────────────────────────────┤
│ Tabs (48px)                                        │
│ [ Neueste ] [ Alle ] [ Von mir ] [ Archiviert ]   │
├────────────────────────────────────────────────────┤
│ Content (flex-1)                                   │
│ ┌────────────────────────────────────────────────┐│
│ │ Table                                          ││
│ │ ┌──────────┬────────┬────────┬────────┬──────┐││
│ │ │ Name     │ Status │ Betrag │ Geändert│  ⋯  │││
│ │ ├──────────┼────────┼────────┼────────┼──────┤││
│ │ │ ...      │ ...    │ ...    │ ...    │  ⋯  │││
│ │ └──────────┴────────┴────────┴────────┴──────┘││
│ └────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────┘
```

### 8.2 Editor Layout

```
┌────────────────────────────────────────────────────┐
│ Top-Bar (48px)                                     │
│ [←] │ Titel │ Badge │ EUR │ Zeit │    [Einladen][Senden] │
├─────┬──────────────────────────────────┬───────────┤
│     │                                  │           │
│  P  │                                  │  Sidebar  │
│  a  │         Canvas                   │  (220px)  │
│  g  │         (flex-1)                 │           │
│  e  │                                  │  [Tabs]   │
│     │    ┌────────────────────┐       │           │
│  S  │    │                    │       │  Bausteine│
│  t  │    │    A4 Page         │       │  ┌──┬──┐ │
│  r  │    │                    │       │  │  │  │ │
│  i  │    │    [Blocks...]     │       │  └──┴──┘ │
│  p  │    │                    │       │           │
│     │    └────────────────────┘       │  Felder   │
│(64px)│                                  │  ┌──┬──┐ │
│     │                                  │  │  │  │ │
│     │                                  │  └──┴──┘ │
└─────┴──────────────────────────────────┴───────────┘
```

---

## 9. Animationen & Transitions

### 9.1 Basis-Transitions

```css
/* Standard */
transition: all 0.15s ease;

/* Schnell (Hover) */
transition: all 0.1s ease;

/* Langsam (Modal) */
transition: all 0.2s ease;
```

### 9.2 Spezifische Animationen

```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide Up (für Modals/Dropdowns) */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scale (für Buttons) */
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
```

---

## 10. Responsive Breakpoints

```css
/* Mobile First */
--breakpoint-sm: 640px;   /* Small phones */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Laptops */
--breakpoint-xl: 1280px;  /* Desktops */
--breakpoint-2xl: 1536px; /* Large screens */
```

### Editor ist Desktop-Only
Der Dokument-Editor ist primär für Desktop konzipiert (min. 1024px).
Mobile zeigt eine "Bitte am Desktop öffnen"-Nachricht.

---

## 11. Z-Index Scale

```css
--z-base: 0;
--z-dropdown: 100;
--z-sticky: 200;
--z-overlay: 300;
--z-modal: 400;
--z-popover: 500;
--z-tooltip: 600;
--z-toast: 700;
```

---

## 12. Icons

**Library:** Lucide React

```tsx
import {
  Plus, Search, FileText, Send, UserPlus,
  MoreHorizontal, ArrowLeft, GripVertical,
  Type, Image, Video, Table2, List, Minus,
  Copy, Scissors, Trash2, Lock, MessageSquare
} from 'lucide-react'
```

### Icon-Größen
| Context | Size |
|---------|------|
| Buttons | 16px |
| Sidebar Blocks | 20px |
| Actions | 16px |
| Large Icons | 24px |

---

## 13. Accessibility

### 13.1 Focus States
```css
*:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
```

### 13.2 Color Contrast
- Text auf Weiß: min. 4.5:1
- Text auf Primary: min. 4.5:1
- Status-Badges: geprüft

### 13.3 Keyboard Navigation
- Alle interaktiven Elemente per Tab erreichbar
- Enter/Space für Aktivierung
- Escape für Schließen
- Arrow Keys für Navigation

---

## Quick Reference

### Farben (Tailwind Classes)
```
bg-primary text-white         → Primary Button
bg-surface border-border      → Card
text-text-primary             → Haupttext
text-text-secondary           → Labels
text-text-muted               → Placeholder
```

### Spacing (Tailwind)
```
p-1 = 4px    m-1 = 4px
p-2 = 8px    m-2 = 8px
p-3 = 12px   m-3 = 12px
p-4 = 16px   m-4 = 16px
p-6 = 24px   m-6 = 24px
```

### Border Radius (Tailwind)
```
rounded-sm = 4px
rounded    = 6px
rounded-lg = 8px
rounded-xl = 12px
rounded-full = 9999px
```
