# 🎯 Features Guide

Complete guide to all features in FakeLove PDF Tools.

---

## Core PDF Tools

### 1. Merge PDFs

**Purpose:** Combine multiple PDF files into one document.

**How to use:**
1. Navigate to the Merge tool
2. Drag and drop two or more PDF files
3. Reorder files by dragging (optional)
4. Click "Merge Now"
5. Download the combined PDF

**Options:**
- Drag to reorder files
- Select specific pages from each file

**Technical Implementation:**
| Technology | Purpose |
|------------|---------|
| **pdf-lib** | Core PDF manipulation |
| **Next.js API Routes** | Server-side processing |
| **@dnd-kit** | Drag-and-drop reordering |

**How it works:**
1. Client sends files to `/api/merge`
2. Server uses `pdf-lib` to load each PDF
3. Pages are copied to a new PDF document
4. User-selected pages are included based on selection
5. Merged PDF is returned as a blob

**Code example (api/merge/route.ts):**
```typescript
const mergedPdf = await PDFDocument.create()
for (const file of files) {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await PDFDocument.load(arrayBuffer)
  const copiedPages = await mergedPdf.copyPages(pdf, pageIndices)
  copiedPages.forEach((page) => mergedPdf.addPage(page))
}
const pdfBytes = await mergedPdf.save()
```

---

### 2. Split PDF

**Purpose:** Extract specific pages from a PDF document.

**How to use:**
1. Upload a PDF file
2. Select the pages you want to extract
3. Choose extraction mode:
   - Single page
   - Page range (e.g., 1-5, 7, 10-15)
   - Every N pages
4. Click "Extract"
5. Download the extracted pages

**Options:**
- Select all pages
- Deselect all
- Custom page ranges

**Page Selection Syntax:**
- `1-3` — Pages 1 through 3
- `1,3,5` — Pages 1, 3, and 5
- `1-3,5,7-9` — Combined selection

---

### 3. Compress PDF

**Purpose:** Reduce the file size of a PDF document.

**⚠️ Note:** Requires a self-hosted server (not Vercel). Uses Ghostscript for compression.

**How to use:**
1. Upload a PDF file
2. Select compression level
3. Click "Compress Now"
4. Download the compressed file

**Compression Levels:**

| Level | Quality | Use Case | Size Reduction |
|-------|---------|----------|----------------|
| Low | Maximum | When quality is critical | ~20-30% |
| Medium | Good | Balanced (recommended) | ~50-60% |
| High | Low | Maximum compression | ~60-70% |
| Extreme | Minimal | Minimum size needed | ~70-85% |

**Technical Implementation:**
| Technology | Purpose |
|------------|---------|
| **Ghostscript** | PDF rendering and recompression |
| **Python** | Script automation (optional) |
| **pdf-lib** | Client-side preview |

**How it works (Ghostscript):**
1. Client uploads PDF to `/api/compress`
2. Server runs Ghostscript command:
   ```bash
   gs -sDEVICE=pdfwrite -dNOPAUSE -dQUIET -dBATCH \
     -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook \
     -sOutputFile=output.pdf input.pdf
   ```
3. Ghostscript renders PDF at lower resolution
4. Compressed PDF is returned to client

**Why not pdf-lib?**
- pdf-lib cannot recompress images within PDFs
- It can only manipulate existing PDF structure
- Ghostscript provides true lossy compression

**Why not in Vercel?**
- Vercel doesn't allow installing system software
- Ghostscript needs to be installed on the server
- Requires self-hosted deployment

---

### 4. Image to PDF

**Purpose:** Convert images (JPG, PNG, etc.) into a PDF document.

**How to use:**
1. Upload one or more images
2. Choose layout:
   - One per page (default)
   - Two per page
3. Click "Convert Now"
4. Download the PDF

**Supported Formats:**
- PNG
- JPG/JPEG
- GIF
- WEBP
- BMP
- TIFF

**Technical Implementation:**
| Technology | Purpose |
|------------|---------|
| **pdf-lib** | Create PDF and embed images |
| **Canvas API** | Client-side image preview |

**How it works:**
1. Client reads image files
2. Images are converted to base64
3. Sent to `/api/imagetopdf`
4. Server uses pdf-lib to:
   - Create new PDF document
   - Embed each image on a page
   - Scale to fit page dimensions
5. PDF is returned as blob

---

## Conversion Features

### 5. PDF to Word (DOCX)

**Purpose:** Convert PDF documents to Microsoft Word format.

**⚠️ Note:** This feature is being improved to not require LibreOffice.

**How to use:**
1. Navigate to PDF → Word
2. Upload a PDF file
3. Click "Convert to DOCX"
4. Download the DOCX file

**Technical Implementation (Current):**
| Technology | Purpose |
|------------|---------|
| **libreoffice-convert** | LibreOffice headless mode |
| **LibreOffice** | Requires installation |

**Limitation:** LibreOffice has limitations:
- Requires installation on server
- Large file conversion is slow
- Formatting may not be 100% accurate

**Future Implementation (No LibreOffice):**
| Technology | Purpose |
|------------|---------|
| **pdf-lib** | Read PDF content |
| **docx** | Generate DOCX structure |
| **mammoth** | Extract text and formatting |

**How it will work:**
1. Parse PDF with pdf-lib
2. Extract text blocks and positions
3. Generate DOCX using `docx` library
4. Preserve basic formatting (bold, italic, paragraphs)

---

### 6. PDF to Excel (XLSX)

**Purpose:** Convert PDF documents to Microsoft Excel format.

**How to use:**
1. Navigate to PDF → Excel
2. Upload a PDF file
3. Click "Convert to XLSX"
4. Download the XLSX file

**Note:** Works best with tabular data in the PDF.

**Technical Implementation:**
| Technology | Purpose |
|------------|---------|
| **xlsx** | Generate Excel files |
| **pdf-lib** | Extract table data |

---

### 7. PDF to PowerPoint (PPTX)

**Purpose:** Convert PDF documents to Microsoft PowerPoint format.

**How to use:**
1. Navigate to PDF → PowerPoint
2. Upload a PDF file
3. Click "Convert to PPTX"
4. Download the PPTX file

**Note:** Each PDF page becomes a slide.

---

## Special Features

### 8. Bilingual Interface

**Purpose:** Support for Spanish and English languages.

**How to use:**
1. Click the globe icon (top-right)
2. Select language:
   - 🇪🇸 Español
   - 🇺🇸 English

**Persistence:** Language choice is saved in localStorage.

**Coverage:** All UI text, buttons, and messages are translated.

---

### 9. Binary Easter Egg

**Purpose:** Celebratory animation when completing tasks.

**Trigger:** Automatically activates after successful processing.

**Animation Phases:**
1. **Typing** — Binary characters appear one by one
2. **Coding** — Random glitch effect
3. **Disintegrate** — Particles scatter and fade

**Messages:** Rotates through binary-encoded phrases:
- FAKE LOVE
- PDF MASTER
- NICE WORK
- BINARY LOVE
- LOL PDF

---

### 10. Developer Signature

**Purpose:** Display "Charle-X" branding.

**Location:** Footer with heart animation.

---

### 11. Process History

**Purpose:** Track all file processing operations.

**Location:** Sidebar or dedicated history section.

**Persistence:** Saved in localStorage, survives refresh.

---

## UI Elements

### Navigation

**Sidebar:** Contains all tool categories
- PDF Tools (icons)
- Convert (icons)
- History
- Settings

### File Upload

**DropZone:** Drag-and-drop file upload area
- Visual feedback on drag
- Click to browse option
- File type validation
- Size limit indicator (4.5MB on Vercel)

### Result Display

**ResultCard:** Shows processing results
- Download button
- File information
- Binary celebration animation
- Action buttons (try again, go home)

---

## Performance

### Background Processing
All operations run in the background without blocking the UI.

### File Size Limits
- Vercel version: 4.5MB per file (Vercel function limit)
- Self-hosted: No limit

### Processing Time
- Merge: ~2-5 seconds
- Split: ~1-3 seconds
- Compress: ~5-30 seconds (depends on compression level)
- Image to PDF: ~3-10 seconds

---

## Troubleshooting

### Upload not working?
- Check file format (must be PDF for most tools)
- Check file size (max 4.5MB on Vercel)
- Try clicking instead of dragging

### Conversion failed?
- Ensure Ghostscript is installed (for compression)
- Try with a smaller file
- Use self-hosted version for unlimited file sizes

### Animation not showing?
- Enable JavaScript in browser
- Check browser console for errors

---

## Next Steps

- See [Architecture](../ARCHITECTURE.md) for technical details
- Review [API Reference](../API.md) for developers
- Check [Deployment](../DEPLOYMENT.md) for production setup
