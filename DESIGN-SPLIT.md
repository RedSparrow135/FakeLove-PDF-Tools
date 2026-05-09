# DESIGN.md - Split PDF

## Overview
Split PDF tool allows users to extract pages from a PDF file. Users can select specific pages, ranges, or split by every N pages.

## Layout Structure

### Page Layout
```
┌─────────────────────────────────────────────────┐
│  [← Back]              HEADER                    │
│  ┌─────────────────────────────────────────┐  │
│  │            SPLIT PDF                     │  │
│  │        Extract pages from PDF          │  │
│  └─────────────────────────────────────────┘  │
│                                                  │
│  ┌──────────────────┐  ┌────────────────────┐  │
│  │                  │  │                    │  │
│  │   WORKSPACE      │  │      PANEL         │  │
│  │                  │  │                    │  │
│  │  [Drop Zone]    │  │  [Options]        │  │
│  │     or          │  │  [Mode Select]    │  │
│  │  [Pages Grid]   │  │  [Stats]         │  │
│  │                  │  │  [Split Button] │  │
│  │                  │  │                    │  │
│  └──────────────────┘  └────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### Upload State
- Centered drop zone (500px max-width)
- Dashed border with hover effect
- SVG icon + text prompt

### Processing State
- Loading overlay with progress bar
- Pulsing icon animation

### Result State
- Result card centered
- Download button + navigation buttons

## Components

### 1. Header
- Back link (top-left)
- Title "SPLIT PDF" (centered)
- Subtitle with humor

### 2. Workspace (Left Side)
- **Upload State**: dropZone (dashed border, centered)
- **File Loaded State**:
  - fileBar (filename + size + remove button)
  - actionBar (select all/deselect/range input)
  - pagesGrid (thumbnail grid with selection)

### 3. Panel (Right Side)
- panelHeader (title + hint)
- modeSelector (dropdown)
- everyInput (for "every N" mode)
- preview (selection preview)
- panelInfo (stats: total pages, selected)
- splitBtn (action button)

### 4. Result Card
- Same component as other tools
- Success icon
- Title + description
- Download button

## Visual Design

### Colors
- Primary: `#ff2d55` (pink/red)
- Background: dark gradient
- Card background: `#1a1a2e`
- Border: rgba(255,255,255,0.1)
- Text: white/gray

### Typography
- Title: Bebas Neue, 3rem, uppercase
- Body: 1rem, white
- Muted: 0.85rem, gray

### Animations
- fadeIn on page load
- pulse on loading
- hover effects on buttons

## Responsive

### Tablet (< 900px)
- Stack workspace and panel vertically

### Mobile (< 600px)
- Single column layout
- Smaller grid (2 columns)

## Implementation Notes

### Page Selection
- Click to toggle individual pages
- Shift+click for range selection
- Select all / Deselect all buttons
- Range input (from-to)

### Split Modes
1. **selection** - Extract selected pages only
2. **every** - Split every N pages
3. **single** - Each page as separate file

### API Call
```
POST /api/split
Body: {
  file: File,
  mode: string,
  range?: string (comma-separated),
  every?: number
}
```

## Success States

### Result
- Result card showing success
- Download button
- "Try Another" button
- "Go Home" link

### Error
- Error message displayed in panel
- Retry possible