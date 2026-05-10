# 🏗️ Architecture Documentation

## System Overview

Fake Love is a Next.js 14 application using the App Router architecture. It provides PDF manipulation tools with a satirical "toxic relationship" theme.

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Browser                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  React + TypeScript + SCSS                              │   │
│  │  ├── Components (UI Layer)                              │   │
│  │  ├── Context Providers (State Management)              │   │
│  │  └── Pages (Next.js App Router)                        │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Next.js Server                              │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │  Static Assets   │  │   API Routes     │  │   Pages      │  │
│  │  (public/)       │  │   /api/*         │  │   /app/*     │  │
│  └──────────────────┘  └──────────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   PDF Processing Layer                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │  pdf-lib    │  │  mammoth    │  │  libreoffice-convert    │ │
│  │  (merge,    │  │  (docx)     │  │  (docx/xlsx/pptx)       │ │
│  │  split,     │  │             │  │                         │ │
│  │  compress)  │  │             │  │                         │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## Directory Structure

```
fake-love/
├── app/                          # App Router (Pages & Layouts)
│   ├── api/                      # API Routes
│   │   ├── compress/route.ts     # PDF Compression
│   │   ├── imagetopdf/route.ts   # Image → PDF
│   │   ├── merge/route.ts        # PDF Merge
│   │   ├── pdfconvert/route.ts   # PDF Conversion
│   │   ├── pdftooffice/route.ts  # PDF → Office
│   │   └── split/route.ts        # PDF Split
│   ├── compress/                 # Compress Page
│   ├── imagetopdf/               # Image to PDF Page
│   ├── merge/                    # Merge Page
│   ├── more-tools/               # Additional Tools
│   │   ├── pdf-to-word/          # PDF → DOCX
│   │   ├── pdf-to-excel/         # PDF → XLSX
│   │   └── pdf-to-pptx/          # PDF → PPTX
│   ├── split/                    # Split Page
│   ├── layout.tsx                 # Root Layout
│   └── page.tsx                  # Home Page
│
├── components/                   # Reusable UI Components
│   ├── BitFireworks.tsx          # Binary celebration effect
│   ├── ClientLayout.tsx          # App wrapper with signature
│   ├── ConvertLoader.tsx         # Conversion loading indicator
│   ├── DeveloperSignature.tsx    # Floating dev signature
│   ├── DropZone.tsx              # File drop zone
│   ├── FileCard.tsx              # File info display
│   ├── FileGrid.tsx              # File grid layout
│   ├── LanguageSwitcher.tsx      # ES/EN toggle
│   ├── MergePanel.tsx            # Drag-and-drop merge UI
│   ├── PDFToOfficePage.tsx       # PDF to Office reusable page
│   ├── PreviewModal.tsx          # PDF preview modal
│   └── ResultCard.tsx            # Result display with Easter egg
│
├── lib/                          # Utilities & State
│   ├── language.tsx              # i18n translations (ES/EN)
│   └── processContext.tsx        # Global process state
│
├── public/                       # Static Assets
│   └── pdf.worker.min.js         # PDF.js worker
│
├── styles/                       # Global Styles
│   └── globals.scss              # Global styles
│
├── scripts/                      # Python Helper Scripts
│   └── pdf_to_office.py          # LibreOffice conversion
│
└── docs/                        # Documentation
    ├── ARCHITECTURE.md           # This file
    ├── API.md                    # API documentation
    ├── COMPONENTS.md             # Component docs
    └── DEPLOYMENT.md             # Deployment guide
```

---

## Page Architecture

### Home Page (`app/page.tsx`)
- Displays main navigation with tool cards
- Shows "More Tools" section
- Integrates footer with branding
- Includes `ClientLayout` wrapper

### Tool Pages
Each tool page follows a consistent pattern:

```
┌────────────────────────────────────┐
│           Tool Title               │
├────────────────────────────────────┤
│         DropZone Component         │
│    (Drag & drop files here)        │
├────────────────────────────────────┤
│         FileGrid Component         │
│      (Show uploaded files)         │
├────────────────────────────────────┤
│        Action Button              │
│        (Process Files)             │
├────────────────────────────────────┤
│        ResultCard Component        │
│     (Show result + Easter egg)     │
└────────────────────────────────────┘
```

### More Tools Pages (PDF to Office)
Reuse `PDFToOfficePage` component with different configurations.

---

## Component Hierarchy

```
ClientLayout (wraps entire app)
├── LanguageSwitcher
├── DeveloperSignature (floating)
└── AppLayout
    ├── Sidebar (navigation)
    └── Main Content
        ├── Page-specific components
        │   ├── DropZone
        │   ├── FileGrid
        │   └── ResultCard (includes BitFireworks on complete)
        └── Footer
```

---

## State Management

### Process Context (`lib/processContext.tsx`)
Global state for tracking processing status:

```typescript
interface ProcessState {
  isProcessing: boolean;
  currentTool: string | null;
  completedProcesses: ProcessResult[];
}
```

**Features:**
- localStorage persistence for history
- Real-time UI updates via React Context
- Background processing without blocking

### Language Context (`lib/language.tsx`)
Bilingual support with localStorage:

```typescript
interface LanguageState {
  lang: 'es' | 'en';
  setLang: (lang: 'es' | 'en') => void;
  t: (key: string) => string;
}
```

---

## API Design

All API routes follow REST conventions:

### Request Format
```
POST /api/[tool]
Content-Type: multipart/form-data

FormData:
  - files: File[]
  - options: tool-specific options
```

### Response Format
```typescript
interface ApiResponse {
  success: boolean;
  data?: {
    url: string;
    filename: string;
    size: number;
  };
  error?: string;
}
```

---

## Styling Architecture

### SCSS Module Pattern
Each component has a co-located `.module.scss` file:

```
components/
├── ComponentName.tsx
└── ComponentName.module.scss
```

### CSS Variables (globals.scss)
```scss
:root {
  --color-primary: #dc2626;
  --color-bg: #0a0a0f;
  --color-surface: #141419;
  --color-border: #2a2a35;
  --color-text: #f5f5f5;
  --color-muted: #9ca3af;
}
```

### Key Visual Elements
- **ECG/EKG animations** for loading states
- **Heartbeat effects** on hover
- **Binary particle explosions** on completion
- **Glitch effects** for error states

---

## Special Features

### Binary Easter Egg
When a process completes, a celebration effect triggers:

1. **Typing Phase** — Binary digits appear character by character
2. **Coding Phase** — Random 0s and 1s fill the badge
3. **Disintegrate Phase** — Particles scatter and fade

Messages cycle through: FAKE LOVE, PDF MASTER, NICE WORK, BINARY LOVE, LOL PDF

### Developer Signature
"Charle-X" signature appears with:
- Pixel heart animation
- Binary message
- Opacity transition on mount

### Footer Integration
Footer is part of the content flow, not a fixed overlay:
- `margin-top: auto` pushes footer to bottom
- `padding-bottom: 80px` clears space for signature
- Z-index layering prevents overlap

---

## Data Flow

```
User uploads files
       │
       ▼
┌──────────────────┐
│ DropZone receives│
└──────────────────┘
       │
       ▼
┌──────────────────┐
│ FileGrid displays│
└──────────────────┘
       │
       ▼
┌──────────────────┐
│ User clicks      │
│ "Process" button │
└──────────────────┘
       │
       ▼
┌──────────────────┐
│ API route receives│
│ multipart/form-data│
└──────────────────┘
       │
       ▼
┌──────────────────┐
│ PDF processing   │
│ (pdf-lib, etc.)  │
└──────────────────┘
       │
       ▼
┌──────────────────┐
│ File saved to    │
│ temp/public      │
└──────────────────┘
       │
       ▼
┌──────────────────┐
│ Response with   │
│ file URL         │
└──────────────────┘
       │
       ▼
┌──────────────────┐
│ ResultCard shows │
│ + BitFireworks   │
└──────────────────┘
```

---

## Security Considerations

1. **File Size Limits** — Implement reasonable limits
2. **File Type Validation** — Verify MIME types server-side
3. **Temp Cleanup** — Remove processed files after download
4. **No User System** — Single app, no authentication complexity

---

## Performance Optimizations

1. **Client-side processing** where possible
2. **Background processing** — No blocking UI
3. **Chunk uploads** for large files
4. **Web Workers** for PDF.js operations

---

## Future Considerations

- Add more PDF tools (rotate, unlock, watermark)
- Implement batch processing queue
- Add progress notifications
- Support more image formats
- Add dark/light theme toggle