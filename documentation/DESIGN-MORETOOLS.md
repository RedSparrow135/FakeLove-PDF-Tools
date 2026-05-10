# DESIGN.md - More Tools (Any → PDF)

## Overview
More Tools converts various file formats (WORD, EXCEL, PPTX, JPG) to PDF. Simple, focused conversion experience.

## Layout Structure

### Page Layout (Single File)
```
┌─────────────────────────────────────────────────┐
│  [← Back]              HEADER                    │
│  ┌─────────────────────────────────────────┐  │
│  │        [ICON] TITLE                     │  │
│  │        Subtitle / humor                  │  │
│  └─────────────────────────────────────────┘  │
│                                                  │
│              ┌─────────────────────┐           │
│              │                     │           │
│              │   CONTAINER         │           │
│              │   (centered)        │           │
│              │                     │           │
│              │   [Drop Zone]     │           │
│              │     OR             │           │
│              │   [File Card]    │           │
│              │                     │           │
│              │   [Convert Btn] │           │
│              │                     │           │
│              └─────────────────────┘           │
│                                                  │
│  [Loading Overlay - when processing]              │
└─────────────────────────────────────────────────┘
```

### States

#### 1. Empty State (No File)
- Centered dropZone (max 500px)
- Dashed border, hover effect
- SVG icon + text prompt

#### 2. File Selected State
- fileCard showing file info
- Icon, filename, size
- Remove button

#### 3. Multiple Files (JPG only)
- fileCount showing number
- Large number display
- Remove All button

#### 4. Processing State
- Full-screen loadingOverlay
- loadingCard with:
  - Animated icon
  - Status text
  - progressBar with fill
  - Percentage display

#### 5. Result State
- ResultCard centered
- Title + description
- Download button
- actionsRow: backBtn + homeLink

## Components

### 1. Header
- backLink (inline-block)
- title (Bebas Neue, centered)
- humor text (italic)

### 2. Container
- max-width: 600px
- margin: 0 auto
- centered content

### 3. dropZone
- border: 2px dashed rgba(255,255,255,0.15)
- border-radius: 20px
- padding: 60px 30px
- text-align: center
- hover: border-color changes to tool color

### 4. fileCard
- display: flex
- align-items: center
- justify-content: space-between
- background: rgba(255,255,255,0.03)
- border: 2px solid rgba(255,255,255,0.1)
- border-radius: 16px
- padding: 20px 24px

### 5. fileCount (multiple files)
- text-align: center
- padding: 20px
- countNumber: 2.5rem, bold
- countLabel: 0.9rem, muted

### 6. downloadBtn
- width: 100%
- padding: 18px
- background: var(--btn-color)
- border-radius: 14px
- font-size: 1.1rem
- hover: translateY + shadow

### 7. loadingOverlay
- position: fixed
- top/left/right/bottom: 0
- background: rgba(0,0,0,0.8)
- display: flex, center
- z-index: 1000

### 8. loadingCard
- background: $bg-card
- border-radius: 24px
- padding: 50px 60px

### 9. progressBar
- width: 100% (max 300px)
- height: 6px
- background: rgba(255,255,255,0.1)
- border-radius: 10px

### 10. progressFill
- height: 100%
- background: var(--progress-color)
- border-radius: 10px
- width: {progress}%
- animation: progressGlow

### 11. actionRow
- display: flex
- gap: 16px
- justify-content: center

### 12. backBtn
- padding: 14px 24px
- background: transparent
- border: 2px solid rgba(255,255,255,0.2)
- border-radius: 12px
- hover: border-color changes

### 13. homeLink
- padding: 14px 24px
- background: primary-color
- border-radius: 12px

## Tool Configurations

### WORD → PDF
- color: `#4a90e2`
- icon: 📄
- title: WORD → PDF
- accept: .doc,.docx,.odt,.rtf

### EXCEL → PDF
- color: `#27ae60`
- icon: 📊
- title: EXCEL → PDF
- accept: .xls,.xlsx,.ods

### PPTX → PDF
- color: `#e74c3c`
- icon: 📽️
- title: POWERPOINT → PDF
- accept: .ppt,.pptx

### JPG → PDF (multiple)
- color: `#9b59b6`
- icon: 🖼️
- title: JPG → PDF
- accept: image/jpeg,image/png
- multiple: true

### IMAGE → PDF
- color: `#c44569`
- icon: 🖼️
- title: IMAGE → PDF
- accept: image/*
- multiple: true

## CSS Variables (per tool)
- --drop-color: tool color
- --btn-color: tool color
- --progress-color: tool color

## API Endpoints

### /api/convert (WORD, EXCEL, PPTX)
```
POST /api/convert
Body: FormData {
  files: File
}
Response: application/pdf
```

### /api/imagetopdf (JPG, IMAGE)
```
POST /api/imagetopdf
Body: FormData {
  files: File[] (multiple),
  layout: 'one' | 'two'
}
Response: application/pdf
```

## Animations

### fadeIn
```scss
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### pulse
```scss
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
```

### progressGlow
```scss
@keyframes progressGlow {
  0% { opacity: 0.7; }
  50% { opacity: 1; }
  100% { opacity: 0.7; }
}
```

## Responsive

### Desktop (> 900px)
- Container: 600px max-width, centered

### Mobile (< 600px)
- Container: 100% width
- fileCard: stacked layout
- actionRow: full width

## Implementation Checklist

- [x] Header with back link
- [x] Title with tool color
- [x] Centered container
- [x] dropZone with tool colors
- [x] fileCard for single file
- [x] fileCount for multiple files
- [x] downloadBtn with progress
- [x] loadingOverlay with progressBar
- [x] ResultCard on success
- [x] actionRow with navigation
- [x] CSS variables for colors
- [x] Responsive styles