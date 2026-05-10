# 🧩 Component Library

Complete documentation for all Fake Love components.

---

## Component Index

| Component | File | Description |
|-----------|------|-------------|
| [BitFireworks](#bitfireworks) | `BitFireworks.tsx` | Binary particle celebration effect |
| [ResultCard](#resultcard) | `ResultCard.tsx` | Result display with Easter egg animation |
| [DeveloperSignature](#developersignature) | `DeveloperSignature.tsx` | Floating Charle-X signature |
| [DropZone](#dropzone) | `DropZone.tsx` | Drag & drop file upload zone |
| [PDFToOfficePage](#pdfofficepage) | `PDFToOfficePage.tsx` | PDF to Office conversion page |
| [ClientLayout](#clientlayout) | `ClientLayout.tsx` | App wrapper with signature |
| [LanguageSwitcher](#languageswitcher) | `LanguageSwitcher.tsx` | ES/EN language toggle |
| [FileGrid](#filegrid) | `FileGrid.tsx` | File list display |
| [FileCard](#filecard) | `FileCard.tsx` | Individual file display |
| [MergePanel](#mergepanel) | `MergePanel.tsx` | Drag-and-drop merge UI |
| [ConvertLoader](#convertloader) | `ConvertLoader.tsx` | Loading animation |
| [PreviewModal](#previewmodal) | `PreviewModal.tsx` | PDF preview modal |
| [TrollButton](#trollbutton) | `TrollButton.tsx` | Troll UI button |
| [EcgTitle](#ecgtitle) | `EcgTitle.tsx` | ECG-style animated title |
| [HeartbeatTitle](#heartbeattitle) | `HeartbeatTitle.tsx` | Heartbeat effect title |

---

## BitFireworks

Binary particle explosion animation for celebrating task completion.

### Usage
```tsx
import BitFireworks, { BitConfetti } from '@/components/BitFireworks'

<BitFireworks active={true} onComplete={() => console.log('Done')} />
<BitConfetti count={40} />
```

### Props
| Prop | Type | Description |
|------|------|-------------|
| `active` | `boolean` | Trigger the animation |
| `onComplete` | `() => void` | Callback when animation finishes |

### Easter Egg Messages
The fireworks display binary-encoded messages:
- FAKE LOVE
- PDF MASTER
- NICE WORK
- BINARY LOVE
- LOL PDF
- SUCCESS
- HELLO WORLD

### Animation Phases
1. **Fire** — Particles launch from random positions
2. **Spread** — Binary characters drift and fade
3. **Complete** — Callback triggered after ~1 second

---

## ResultCard

Displays processing results with animated binary badge.

### Usage
```tsx
import ResultCard from '@/components/ResultCard'

<ResultCard
  title="Merge Complete!"
  description="Your PDFs are now one"
  downloadUrl="/path/to/file.pdf"
  fileName="merged.pdf"
  stats={[{ label: 'Files', value: '3' }]}
/>
```

### Props
| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Card heading |
| `description` | `string` | Subtext message |
| `downloadUrl` | `string` | File download URL |
| `fileName` | `string` | Output filename |
| `stats` | `{ label: string; value: string \| number }[]` | Optional stat boxes |

### AnimatedBinaryBadge
Internal component that displays a typing → coding → disintegrating animation.

**Phases:**
1. **Typing** — Characters appear one by one (50ms interval)
2. **Coding** — Bits randomly glitch (2 seconds)
3. **Disintegrating** — Bits scatter and fade
4. **Done** — Component unmounts

---

## DeveloperSignature

Floating signature component displaying "Charle-X" branding.

### Usage
```tsx
import DeveloperSignature from '@/components/DeveloperSignature'

<DeveloperSignature />
```

### Features
- **Pixel Heart** — 15x14 SVG pixel art heart
- **Binary Message** — `01000110 01000001 01001011 01000101` (FAKE)
- **Opacity Transition** — Fades in after 1 second delay
- **Position** — Fixed bottom-right, floats above footer

### Styling
Uses `DeveloperSignature.module.scss` with CSS animations for the pixel heart.

---

## DropZone

Drag and drop file upload zone.

### Usage
```tsx
import DropZone from '@/components/DropZone'

<DropZone
  onFilesSelected={(files) => console.log(files)}
  multiple={true}
  accept=".pdf"
  humorMessage="Drop your PDFs here..."
  disabled={false}
/>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onFilesSelected` | `(files: File[]) => void` | — | Callback with selected files |
| `multiple` | `boolean` | `true` | Allow multiple files |
| `accept` | `string` | `.pdf` | File extension filter |
| `humorMessage` | `string` | — | Drop zone text |
| `disabled` | `boolean` | `false` | Disable interaction |

### Behavior
- Filters files by extension
- Single file mode returns only first file
- Triggers hidden file input on click

---

## PDFToOfficePage

Reusable page component for PDF to Office conversions.

### Usage
```tsx
import PDFToOfficePage from '@/components/PDFToOfficePage'

<PDFToOfficePage
  format="docx"
  formatLabel="Word"
  color="#dc2626"
/>
```

### Props
| Prop | Type | Description |
|------|------|-------------|
| `format` | `'docx' \| 'xlsx' \| 'pptx'` | Output format |
| `formatLabel` | `string` | Display label |
| `color` | `string` | Accent color |

### Features
- Drag & drop PDF upload
- File validation (PDF only)
- Progress tracking via `processContext`
- Result display with `ResultCard`

---

## ClientLayout

Wraps the entire app with language provider and developer signature.

### Usage
```tsx
import ClientLayout from '@/components/ClientLayout'

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
```

### Wrapped Providers
- `LanguageProvider` — i18n context
- `ProcessProvider` — Process history context
- `DeveloperSignature` — Floating signature

---

## LanguageSwitcher

Toggle between Spanish and English.

### Usage
```tsx
import LanguageSwitcher from '@/components/LanguageSwitcher'

<LanguageSwitcher />
```

### Behavior
- Persists choice to `localStorage`
- Updates `html lang` attribute
- Uses Lucide Globe icon

### Styling
Uses `LanguageSwitcher.module.scss` with hover effects.

---

## FileGrid

Displays a list of uploaded files with actions.

### Usage
```tsx
import FileGrid from '@/components/FileGrid'

<FileGrid
  files={uploadedFiles}
  onRemove={(index) => removeFile(index)}
  showPages={true}
/>
```

### Props
| Prop | Type | Description |
|------|------|-------------|
| `files` | `File[]` | List of files |
| `onRemove` | `(index: number) => void` | Remove callback |
| `showPages` | `boolean` | Show page count |

---

## MergePanel

Drag-and-drop interface for reordering PDFs before merge.

### Usage
```tsx
import MergePanel from '@/components/MergePanel'

<MergePanel
  files={files}
  onReorder={(files) => setFiles(files)}
  onRemove={(index) => removeFile(index)}
/>
```

### Features
- Drag handles for reordering
- Page selector per file
- File info display (name, pages)
- Using `@dnd-kit/sortable` for drag

---

## ConvertLoader

Animated loading indicator for conversion processes.

### Usage
```tsx
import ConvertLoader from '@/components/ConvertLoader'

<ConvertLoader message="Uploading your emotional baggage..." />
```

### Props
| Prop | Type | Description |
|------|------|-------------|
| `message` | `string` | Loading text |
| `progress` | `number` | Optional progress percentage |

---

## PreviewModal

Modal for previewing PDF files.

### Usage
```tsx
import PreviewModal from '@/components/PreviewModal'

<PreviewModal
  isOpen={true}
  fileUrl="/path/to/file.pdf"
  onClose={() => setIsOpen(false)}
/>
```

### Props
| Prop | Type | Description |
|------|------|-------------|
| `isOpen` | `boolean` | Modal visibility |
| `fileUrl` | `string` | PDF URL to preview |
| `onClose` | `() => void` | Close callback |

---

## TrollButton

Button with subtle "troll" behavior (slight movement on hover).

### Usage
```tsx
import TrollButton from '@/components/TrollButton'

<TrollButton onClick={() => doSomething()}>
  Click me
</TrollButton>
```

### Behavior
- Slight position offset on hover
- Returns to position on mouse leave
- Non-blocking (doesn't trap users)

---

## EcgTitle

Title component with ECG/EKG line animation.

### Usage
```tsx
import EcgTitle from '@/components/EcgTitle'

<EcgTitle>FAKE LOVE</EcgTitle>
```

### Styling
CSS animation creates a heartbeat-style line effect beneath the text.

---

## HeartbeatTitle

Title with heartbeat pulse effect on hover.

### Usage
```tsx
import HeartbeatTitle from '@/components/HeartbeatTitle'

<HeartbeatTitle>Pdf Tools</HeartbeatTitle>
```

### Styling
Scales up slightly and adds pulse animation on hover.

---

## Context Hooks

### useLanguage
```tsx
import { useLanguage } from '@/lib/language'

const { t, lang, setLang, isSpanish } = useLanguage()

// Example
console.log(t('merge.title')) // "UNIR PDF" or "MERGE PDF"
setLang('en')
```

### useProcesses
```tsx
import { useProcesses } from '@/lib/processContext'

const {
  processes,
  addProcess,
  updateProcess,
  removeProcess,
  clearCompleted,
  getRecentProcesses,
  isLoading,
} = useProcesses()

// Example
const id = addProcess({
  fileName: 'document.pdf',
  operation: 'merge',
  operationLabel: 'Merge PDF',
  status: 'processing',
  progress: 0,
  originalSize: 1024,
})
```

---

## Styling Pattern

All components use SCSS modules with co-located `.module.scss` files:

```
components/
├── ComponentName.tsx
└── ComponentName.module.scss
```

### CSS Variables (globals.scss)
```scss
--color-primary: #dc2626;
--color-bg: #0a0a0f;
--color-surface: #141419;
--color-border: #2a2a35;
--color-text: #f5f5f5;
--color-muted: #9ca3af;
```

---

## Animation Utilities

### Keyframe Animations
- `typing` — Character-by-character appearance
- `glitch` — Random offset flicker
- `disintegrate` — Scatter and fade
- `heartbeat` — Scale pulse
- `fadeIn` — Opacity transition

### Performance Notes
- Use `transform` and `opacity` for animations
- Avoid animating `width`, `height`, `top`, `left`
- Use `will-change` sparingly
- Cleanup intervals and timeouts in `useEffect`