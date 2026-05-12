# 🎯 Features Guide

Complete guide to all features in FakeLove PDF Tools.

**Note:** This document reflects the **Vercel-limited** version. For the full version with unlimited features, see the `main` branch or deploy on your own server.

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

**⚠️ Vercel Limit:** 4.5MB per file total

**Options:**
- Drag to reorder files
- Select specific pages from each file

**Technical Implementation:**
| Technology | Purpose |
|------------|---------|
| **pdf-lib** | Core PDF manipulation |
| **Next.js API Routes** | Server-side processing |
| **@dnd-kit** | Drag-and-drop reordering |

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

**⚠️ Vercel Limit:** 4.5MB per file

**Page Selection Syntax:**
- `1-3` — Pages 1 through 3
- `1,3,5` — Pages 1, 3, and 5
- `1-3,5,7-9` — Combined selection

---

### 3. Compress PDF

**Purpose:** Reduce the file size of a PDF document.

**⚠️ Status:** **Coming Soon** on Vercel

**Reason:** Requires Ghostscript installation on server.

**How to use on Self-Hosted:**
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
| **pdf-lib** | Client-side preview |

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

**⚠️ Vercel Limit:** 4.5MB per image

**Supported Formats:**
- PNG
- JPG/JPEG
- GIF
- WEBP
- BMP

**Technical Implementation:**
| Technology | Purpose |
|------------|---------|
| **pdf-lib** | Create PDF and embed images |
| **Canvas API** | Client-side image preview |

---

## Conversion Features

### 5. Word/DOCX to PDF

**Purpose:** Convert Word documents to PDF.

**How to use:**
1. Navigate to Word → PDF
2. Upload a DOCX file
3. Click "Convert"
4. Download the PDF

**⚠️ Vercel Limit:** 4.5MB file size
**⚠️ Note:** Text-only conversion (no formatting)

**Technical Implementation:**
| Technology | Purpose |
|------------|---------|
| **mammoth** | Extract text from DOCX |
| **pdf-lib** | Create PDF with extracted text |

---

### 6. Excel/XLSX to PDF

**Purpose:** Convert Excel spreadsheets to PDF.

**⚠️ Status:** **Coming Soon** on Vercel

---

### 7. PowerPoint/PPTX to PDF

**Purpose:** Convert PowerPoint presentations to PDF.

**⚠️ Status:** **Coming Soon** on Vercel

---

### 8. JPG/Image to PDF

**Purpose:** Convert images directly to PDF.

**⚠️ Status:** **Coming Soon** on Vercel

---

## Special Features

### 9. Bilingual Interface

**Purpose:** Support for Spanish and English languages.

**How to use:**
1. Click the globe icon (top-right)
2. Select language:
   - 🇪🇸 Español
   - 🇺🇸 English

**Persistence:** Language choice is saved in localStorage.

---

### 10. Process History

**Purpose:** Track all file processing operations.

**Location:** Sidebar → History

**Persistence:** Saved in localStorage, survives refresh.

---

### 11. File Upload from Home

**Purpose:** Quick file upload from the dashboard.

**How to use:**
1. Click the floating upload button (bottom-right)
2. Select or drag a file
3. Choose the tool to use
4. File transfers automatically to the tool

---

## UI Elements

### Navigation

**Sidebar:** Contains all tool categories
- Dashboard
- PDF Tools
- Convert
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
- **Vercel version:** 4.5MB per file (Vercel function limit)
- **Self-hosted:** No limit

### Processing Time
- Merge: ~2-5 seconds
- Split: ~1-3 seconds
- Image to PDF: ~3-10 seconds

---

## Troubleshooting

### Upload not working?
- Check file format (must be PDF for most tools)
- Check file size (max 4.5MB on Vercel)
- Try clicking instead of dragging

### Conversion failed?
- Try with a smaller file
- Use self-hosted version for unlimited file sizes

---

## Next Steps

- See [VERCEL.md](./VERCEL.md) for Vercel-specific limitations
- See [Architecture](./ARCHITECTURE.md) for technical details
- Review [API Reference](./API.md) for developers
- Check [Deployment](./DEPLOYMENT.md) for production setup
