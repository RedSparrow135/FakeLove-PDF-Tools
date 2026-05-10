# CLINICAL PDF SUITE — Design System
## Version 1.0 | Clinical Cyberpunk UI

---

## 1. Concept & Vision

**"Clinical processing system powered by cold artificial intelligence."**

The interface communicates precision, automation, and sterile technology. Every element feels like it belongs to a medical cyberpunk operating system—a futuristic workstation where documents are processed through an intelligent, emotionless machine.

The tone is: cold, intelligent, minimal, machine-like, and premium. This is not a consumer app; it is a professional tool disguised as art.

---

## 2. Design Philosophy

### Core Principles
- **Precision over decoration** — Every visual element serves a function
- **Terminal elegance** — Monospace typography and data-driven layouts
- **Neon diagnostics** — Subtle glows indicate system status, not decoration
- **Sterile technology** — Clean surfaces, thin separators, clinical whitespace
- **Holographic depth** — Glassmorphism panels with subtle transparency

### What This Is NOT
- A consumer file converter
- A playful productivity tool
- Overloaded with features
- Childish or meme-driven

---

## 3. Color System

### Background Layers

| Layer | Color | Usage |
|-------|-------|-------|
| Base | `#030712` | Primary background (near black) |
| Surface | `#0a0f1a` | Cards, panels |
| Elevated | `#111827` | Hover states, overlays |
| Glass | `rgba(17, 24, 39, 0.7)` | Glassmorphism panels |

### Primary Neon Palette

| Name | Hex | Usage |
|------|-----|-------|
| Crimson | `#dc2626` | Primary actions, main accent |
| Neon Magenta | `#f43f5e` | Secondary accent, highlights |
| Electric Purple | `#a855f7` | Tertiary accent, hover states |

### Secondary Accents

| Name | Hex | Usage |
|------|-----|-------|
| Cyan | `#22d3ee` | Success states, active indicators |
| Amber | `#fbbf24` | Warnings, processing states |
| Emerald | `#10b981` | Completed states |
| Rose | `#f43f5e` | Error states |

### Text Hierarchy

| Level | Color | Opacity | Usage |
|-------|-------|---------|-------|
| Primary | `#f9fafb` | 100% | Headings, important data |
| Secondary | `#9ca3af` | 70% | Body text |
| Tertiary | `#6b7280` | 50% | Descriptions, hints |
| Muted | `#374151` | 40% | Disabled, timestamps |

### Borders & Dividers

| Type | Color | Usage |
|------|-------|-------|
| Subtle | `rgba(255,255,255,0.06)` | Default separators |
| Default | `rgba(255,255,255,0.1)` | Card borders |
| Strong | `rgba(255,255,255,0.15)` | Active states |
| Glow | `rgba(220,38,38,0.5)` | Neon glow borders |

---

## 4. Typography System

### Font Stack

```css
--font-display: 'Space Grotesk', system-ui, sans-serif;
--font-body: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Type Scale

| Element | Font | Size | Weight | Transform |
|---------|------|------|--------|-----------|
| Hero Title | Space Grotesk | 4rem | 700 | Uppercase, tracked |
| Section Title | Space Grotesk | 1.5rem | 600 | Uppercase |
| Card Title | Space Grotesk | 1rem | 600 | Normal |
| Body | Inter | 0.875rem | 400 | Normal |
| Caption | Inter | 0.75rem | 400 | Normal |
| Mono Data | JetBrains Mono | 0.8rem | 500 | Normal |

### Letter Spacing

| Context | Tracking |
|---------|----------|
| Display titles | 0.15em |
| Section headers | 0.1em |
| Navigation | 0.05em |
| Body text | 0 |

---

## 5. Layout Architecture

### Overall Structure

```
┌─────────────────────────────────────────────────────────────┐
│ SIDEBAR (240px)  │           MAIN CONTENT                  │
│                  │                                         │
│ ┌──────────────┐ │  ┌─────────────────────────────────────┐│
│ │ Logo/Brand  │ │  │ NAVBAR (64px)                       ││
│ ├──────────────┤ │  │ Search | Status | Profile          ││
│ │ Navigation   │ │  ├─────────────────────────────────────┤│
│ │ - Dashboard  │ │  │                                     ││
│ │ - Tools      │ │  │ HERO SECTION                        ││
│ │ - History    │ │  │ Processing Banner + Metrics         ││
│ │ - Settings   │ │  │                                     ││
│ ├──────────────┤ │  ├─────────────────────────────────────┤│
│ │ System Stats │ │  │ TOOLS GRID                          ││
│ │ - Storage    │ │  │ ┌────┐ ┌────┐ ┌────┐ ┌────┐        ││
│ │ - Processes  │ │  │ │Tool│ │Tool│ │Tool│ │Tool│        ││
│ ├──────────────┤ │  │ └────┘ └────┘ └────┘ └────┘        ││
│ │ User Panel   │ │  ├─────────────────────────────────────┤│
│ └──────────────┘ │  │ ACTIVITY TABLE                      ││
│                  │  │ Recent processing history            ││
│                  │  └─────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Responsive Breakpoints

| Breakpoint | Layout |
|------------|--------|
| Desktop (>1280px) | Full sidebar + content |
| Tablet (768-1280px) | Collapsed sidebar (icons only) |
| Mobile (<768px) | Hidden sidebar, bottom nav |

---

## 6. Sidebar Redesign

### Structure

```
┌──────────────────────────┐
│  LOGO                    │
│  Clinical PDF Suite      │
├──────────────────────────┤
│  NAVIGATION              │
│  ┌────────────────────┐  │
│  │ ◇ Dashboard        │  │
│  │ ◆ PDF Tools   ←active│
│  │ ◇ Convert       │  │
│  │ ◇ History      │  │
│  │ ◇ Settings     │  │
│  └────────────────────┘  │
├──────────────────────────┤
│  SYSTEM STATUS           │
│  ┌────────────────────┐  │
│  │ Processing: 2      │  │
│  │ ████████░░ 80%    │  │
│  │ Storage: 2.4/5 GB  │  │
│  └────────────────────┘  │
├──────────────────────────┤
│  USER                    │
│  ┌────────────────────┐  │
│  │ ◯ Operator        │  │
│  │ Level: Admin       │  │
│  └────────────────────┘  │
└──────────────────────────┘
```

### Glassmorphism Treatment

```css
.sidebar-panel {
  background: rgba(17, 24, 39, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
}
```

### Navigation Item States

| State | Background | Border | Text | Icon |
|-------|------------|--------|------|------|
| Default | transparent | none | secondary | muted |
| Hover | `rgba(220,38,38,0.1)` | left glow | primary | primary |
| Active | `rgba(220,38,38,0.15)` | left solid crimson | primary | crimson |
| Disabled | transparent | none | muted | muted |

### Icon System

Use Lucide React exclusively:
- `LayoutDashboard` — Dashboard
- `FileSearch` — PDF Tools
- `RefreshCw` — Convert
- `History` — History
- `Settings` — Settings
- `HardDrive` — Storage
- `Cpu` — Processing

---

## 7. Navbar Redesign

### Structure

```
┌────────────────────────────────────────────────────────────────┐
│  [Search━━━━━━━━━━━━━━━━━━━━] [Status] [Lang] [Avatar] [Notif] │
└────────────────────────────────────────────────────────────────┘
```

### Search Bar

```css
.search-input {
  background: rgba(17, 24, 39, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 8px 16px 8px 40px;
  width: 320px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  color: #f9fafb;
  transition: all 0.2s ease;
}

.search-input:focus {
  border-color: rgba(220, 38, 38, 0.5);
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
  outline: none;
}

.search-input::placeholder {
  color: #6b7280;
}
```

### Status Indicator

```
┌─────────────────┐
│ ● System Online │
│ Latency: 12ms   │
└─────────────────┘
```

- Green dot with pulse animation for "online"
- Monospace latency display
- Subtle glass panel

### Language Switcher

```
┌─────────────────┐
│ EN ▼            │
└─────────────────┘
```

### Profile Area

```
┌─────────────────┐
│ ◯ Operator  ▼  │
└─────────────────┘
```

---

## 8. Hero Section

### Design

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  CLINICAL PDF PROCESSING SYSTEM                    [v2.4.1]   │
│  ══════════════════════════════════════════════════════════════│
│                                                                │
│  Automated document processing powered by artificial           │
│  intelligence. Zero friction. Maximum efficiency.              │
│                                                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │ 1,247    │  │ 98.7%    │  │ 2.3s     │  │ ██████░░ │     │
│  │ Processed │  │ Success   │  │ Avg Time │  │ 3.2GB    │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Visual Elements

- **Title**: Space Grotesk, 4rem, uppercase, tracked 0.15em
- **Subtitle line**: Horizontal gradient line (crimson → transparent)
- **Description**: Inter, secondary color, max-width 600px
- **Metrics**: Glass panels with mono data display

### Metrics Panel

```css
.metric-card {
  background: rgba(17, 24, 39, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 20px;
  min-width: 140px;
  backdrop-filter: blur(8px);
}

.metric-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.75rem;
  font-weight: 600;
  color: #f9fafb;
}

.metric-label {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: 4px;
}
```

---

## 9. Tool Cards Redesign

### Card Structure

```
┌─────────────────────────────────┐
│ ┌─────────────────────────────┐ │
│ │                             │ │
│ │        [Icon]               │ │  ← Lucide icon, 32px, outlined
│ │        32x32                │ │
│ │                             │ │
│ └─────────────────────────────┘ │
│                                 │
│ MERGE PDF                       │  ← Title: Space Grotesk, 600
│ Combine multiple documents      │  ← Description: Inter, muted
│                                 │
│ ┌─────┐ ┌─────┐               │
│ │ PDF │ │ OCR │               │  ← System tags: small pills
│ └─────┘ └─────┘               │
│                                 │
│ [Processing indicator on hover] │
└─────────────────────────────────┘
```

### Card States

#### Default
```css
.tool-card {
  background: linear-gradient(145deg, rgba(17,24,39,0.9), rgba(17,24,39,0.7));
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

#### Hover
```css
.tool-card:hover {
  border-color: rgba(220, 38, 38, 0.4);
  box-shadow: 
    0 0 20px rgba(220, 38, 38, 0.15),
    0 0 40px rgba(220, 38, 38, 0.05),
    inset 0 0 20px rgba(220, 38, 38, 0.03);
  transform: translateY(-4px);
}
```

#### Active/Selected
```css
.tool-card.active {
  border-color: #dc2626;
  background: linear-gradient(145deg, rgba(220,38,38,0.1), rgba(17,24,39,0.9));
  box-shadow: 0 0 30px rgba(220, 38, 38, 0.2);
}
```

### Icon Treatment

- Use Lucide React icons only
- Outlined style, stroke-width: 1.5
- Size: 32px for tool icons
- Color: inherit from card accent or muted gray

### Tool Accent Colors

| Tool | Accent Color |
|------|--------------|
| Merge PDF | `#dc2626` |
| Split PDF | `#f43f5e` |
| Compress | `#a855f7` |
| Image to PDF | `#ec4899` |
| Word to PDF | `#3b82f6` |
| Excel to PDF | `#10b981` |
| PPTX to PDF | `#f59e0b` |

### System Tags

```
┌─────┐ ┌─────┐
│ PDF │ │ OCR │
└─────┘ └─────┘

- Background: rgba(255,255,255,0.05)
- Border: 1px solid rgba(255,255,255,0.1)
- Font: JetBrains Mono, 0.65rem
- Padding: 4px 8px
- Border-radius: 4px
```

---

## 10. Processing History Table

### Design

```
┌────────────────────────────────────────────────────────────────────────────┐
│  PROCESSING LOG                                            [Clear All]   │
├────────────────────────────────────────────────────────────────────────────┤
│  FILE                    │ OPERATION     │ STATUS    │ TIME      │ SIZE    │
├────────────────────────────────────────────────────────────────────────────┤
│  report_final.pdf       │ Merge         │ ● Done    │ 2m ago    │ 2.4MB   │
│  invoice_2024.pdf       │ Compress      │ ● Done    │ 5m ago    │ 890KB   │
│  presentation.pptx      │ Convert       │ ◐ Process │ Now       │ 4.1MB   │
│  old_scans.zip          │ Extract       │ ○ Queued  │ Waiting   │ 12MB    │
└────────────────────────────────────────────────────────────────────────────┘
```

### Row Styling

```css
.history-row {
  display: grid;
  grid-template-columns: 2fr 1fr 100px 100px 100px;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  transition: background 0.2s ease;
}

.history-row:hover {
  background: rgba(255, 255, 255, 0.02);
}
```

### Status Pills

| Status | Indicator | Color | Background |
|--------|-----------|-------|------------|
| Completed | ● | `#10b981` | `rgba(16, 185, 129, 0.15)` |
| Processing | ◐ | `#fbbf24` | `rgba(251, 191, 36, 0.15)` |
| Queued | ○ | `#6b7280` | `rgba(107, 114, 128, 0.15)` |
| Failed | ✕ | `#f43f5e` | `rgba(244, 63, 94, 0.15)` |

---

## 11. Floating Action Button

### Design

```
                    ┌─────────┐
                    │  ┌───┐  │
                    │  │ + │  │
                    │  └───┘  │
                    └─────────┘
```

### Styling

```css
.fab-button {
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, #dc2626, #f43f5e);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 4px 20px rgba(220, 38, 38, 0.4),
    0 0 40px rgba(220, 38, 38, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fab-pulse 3s ease-in-out infinite;
}

.fab-button:hover {
  transform: scale(1.1);
  box-shadow: 
    0 8px 30px rgba(220, 38, 38, 0.5),
    0 0 60px rgba(220, 38, 38, 0.3);
}

.fab-button svg {
  width: 24px;
  height: 24px;
  color: white;
  stroke-width: 2;
}

@keyframes fab-pulse {
  0%, 100% {
    box-shadow: 
      0 4px 20px rgba(220, 38, 38, 0.4),
      0 0 40px rgba(220, 38, 38, 0.2);
  }
  50% {
    box-shadow: 
      0 4px 30px rgba(220, 38, 38, 0.6),
      0 0 60px rgba(220, 38, 38, 0.3);
  }
}
```

---

## 12. Motion System

### Timing Functions

```css
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
--ease-out-back: cubic-bezier(0.34, 1.56, 0.64, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### Animation Durations

| Animation | Duration | Easing |
|-----------|----------|--------|
| Micro-interactions | 150ms | ease-out |
| State changes | 250ms | ease-in-out |
| Page transitions | 400ms | ease-out-expo |
| Ambient loops | 2000-4000ms | linear |

### Animation Types

#### 1. Hover Scale
```css
transform: scale(1.02);
transition: transform 0.25s var(--ease-out-expo);
```

#### 2. Glow Pulse
```css
@keyframes glow-pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}
```

#### 3. Border Glow
```css
border-color: rgba(220, 38, 38, 0.5);
box-shadow: 0 0 20px rgba(220, 38, 38, 0.3);
transition: all 0.3s ease;
```

#### 4. Staggered Entrance
```css
animation: fade-slide-up 0.4s var(--ease-out-expo) backwards;
animation-delay: calc(var(--index) * 100ms);
```

#### 5. Processing Indicator
```css
@keyframes processing-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

---

## 13. Component Inventory

### 1. GlassPanel
```tsx
<div className="glass-panel">
  {children}
</div>

// CSS
.glass-panel {
  background: rgba(17, 24, 39, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
}
```

### 2. NeonButton
```tsx
<NeonButton variant="primary" size="md">
  Process Files
</NeonButton>

// Variants: primary, secondary, ghost, danger
// Sizes: sm, md, lg
```

### 3. ToolCard
```tsx
<ToolCard 
  icon={FileSearch}
  title="Merge PDF"
  description="Combine multiple documents"
  accentColor="#dc2626"
  tags={['PDF', 'OCR']}
  onClick={() => {}}
/>
```

### 4. StatusPill
```tsx
<StatusPill status="completed" />
<StatusPill status="processing" label="Converting..." />
<StatusPill status="queued" />
<StatusPill status="failed" />
```

### 5. MetricCard
```tsx
<MetricCard 
  value="1,247" 
  label="Processed"
  trend="+12%"
/>
```

### 6. SearchInput
```tsx
<SearchInput 
  placeholder="Search files or tools..."
  onChange={handleSearch}
/>
```

### 7. DataTable
```tsx
<DataTable 
  columns={columns}
  data={historyData}
  sortable
  onRowClick={handleRowClick}
/>
```

---

## 14. Spacing System

### Base Unit: 4px

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Tight gaps |
| `--space-2` | 8px | Icon padding |
| `--space-3` | 12px | Button padding |
| `--space-4` | 16px | Card padding |
| `--space-5` | 20px | Section gaps |
| `--space-6` | 24px | Component spacing |
| `--space-8` | 32px | Section margins |
| `--space-10` | 40px | Large gaps |
| `--space-12` | 48px | Hero spacing |

### Grid System

- Content max-width: 1280px
- Sidebar width: 240px
- Card gap: 20px
- Section gap: 48px

---

## 15. Technical Stack Recommendations

### Styling
- **TailwindCSS** — Utility-first with custom config
- **CSS Modules** — For component-specific styles
- **CSS Variables** — For theme tokens

### Animation
- **Framer Motion** — Complex animations
- **CSS Animations** — Simple loops (pulse, glow)
- **Transition groups** — Staggered lists

### Icons
- **Lucide React** — Primary icon library
- Stroke width: 1.5 for consistency

### Components
- **shadcn/ui** — Base components
- Custom glass panels
- Custom neon buttons

### Configuration

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        crimson: '#dc2626',
        'neon-magenta': '#f43f5e',
        'electric-purple': '#a855f7',
        surface: '#0a0f1a',
        glass: 'rgba(17, 24, 39, 0.7)',
      },
      fontFamily: {
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'fade-in': 'fade-in 0.4s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
      },
    },
  },
}
```

---

## 16. Implementation Priority

### Phase 1: Foundation
1. Update color tokens
2. Add typography (Space Grotesk, JetBrains Mono)
3. Create glass panel component
4. Build neon button component

### Phase 2: Layout
5. Implement sidebar with glassmorphism
6. Create navbar with search
7. Build hero section with metrics

### Phase 3: Tools
8. Redesign tool cards with Lucide icons
9. Implement hover animations
10. Add tool accent colors

### Phase 4: Details
11. Build activity table
12. Create floating action button
13. Add micro-interactions
14. Polish responsive behavior

---

## 17. What to AVOID

### Never Use
- Emojis (replace with Lucide icons)
- Comic Sans or similar playful fonts
- Rainbow color palettes
- Overly saturated neons
- Flat, boring cards
- Inconsistent spacing
- Cluttered layouts
- Comic-style hover effects

### Always Maintain
- Clinical precision
- Consistent spacing
- Monospace for data
- Dark theme priority
- Subtle glows (not overwhelming)
- Professional tone

---

## 18. Design File Structure

```
src/
├── styles/
│   ├── globals.css          # CSS variables, resets
│   ├── animations.css      # Keyframe animations
│   └── utilities.css       # Helper classes
├── components/
│   ├── ui/                 # Base components
│   │   ├── GlassPanel.tsx
│   │   ├── NeonButton.tsx
│   │   ├── StatusPill.tsx
│   │   └── MetricCard.tsx
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Navbar.tsx
│   │   └── Hero.tsx
│   ├── tools/
│   │   ├── ToolCard.tsx
│   │   └── ToolGrid.tsx
│   └── history/
│       ├── ActivityTable.tsx
│       └── HistoryRow.tsx
├── app/
│   └── page.tsx
└── lib/
    └── utils.ts
```

---

*Document Version: 1.0*
*Last Updated: Clinical PDF Suite Design System*
*Status: Ready for Implementation*
