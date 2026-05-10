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

**Technical:** Uses `pdf-lib` for merging on the server.

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

**How to use:**
1. Upload a PDF file
2. Select compression level
3. Click "Compress Now"
4. Download the compressed file

**Compression Levels:**

| Level | Quality | Use Case |
|-------|---------|----------|
| Low | Maximum | When quality is critical |
| Medium | Good | Balanced (recommended) |
| High | Low | Maximum compression |
| Extreme | Minimal | Minimum size needed |

**Technical:** Uses Ghostscript with Python for compression.

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

**Technical:** Uses `pdf-lib` for image embedding.

---

## Conversion Features

### 5. PDF to Word (DOCX)

**Purpose:** Convert PDF documents to Microsoft Word format.

**How to use:**
1. Navigate to PDF → Word
2. Upload a PDF file
3. Click "Convert to DOCX"
4. Download the DOCX file

**Note:** Requires LibreOffice installed on the server.

---

### 6. PDF to Excel (XLSX)

**Purpose:** Convert PDF documents to Microsoft Excel format.

**How to use:**
1. Navigate to PDF → Excel
2. Upload a PDF file
3. Click "Convert to XLSX"
4. Download the XLSX file

**Note:** Works best with tabular data in the PDF.

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

**Location:** Bottom-right corner, floating above footer.

**Features:**
- Pixel heart animation
- Binary message display
- Opacity transition on load
- Appears after 1 second delay

---

### 11. Process History

**Purpose:** Track all file processing operations.

**Location:** Sidebar or dedicated history section.

**Persistence:** Saved in localStorage, survives refresh.

**Features:**
- View recent operations
- Clear completed items
- See operation status

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
- Size limit indicator (50MB)

### Result Display

**ResultCard:** Shows processing results
- Download button
- File information
- Binary celebration animation
- Action buttons (try again, go home)

---

## Humor System

FakeLove includes sarcastic messages throughout:

**Loading:**
- "Uploading your emotional baggage..."
- "Processing… unlike your ex"
- "Converting pixels into PDF love"

**Success:**
- "Done. That was suspiciously easy."
- "Your PDF is ready. Unlike your plans for tonight."

**Error:**
- "Something broke. Probably your fault."
- "We tried. Emotionally, not technically."

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Upload file | Ctrl/Cmd + O |
| Download result | Ctrl/Cmd + S |
| Clear selection | Escape |
| Switch language | Ctrl/Cmd + L |

---

## Performance

### Background Processing
All operations run in the background without blocking the UI.

### File Size Limits
- Maximum upload: 50MB per file
- Maximum files: Varies by tool

### Processing Time
- Merge: ~2-5 seconds
- Split: ~1-3 seconds
- Compress: ~5-30 seconds (depends on compression level)
- Image to PDF: ~3-10 seconds
- PDF to Office: ~10-60 seconds (requires LibreOffice)

---

## Troubleshooting

### Upload not working?
- Check file format (must be PDF for most tools)
- Check file size (max 50MB)
- Try clicking instead of dragging

### Conversion failed?
- Ensure LibreOffice is installed (for PDF to Office)
- Try with a smaller file
- Check Ghostscript installation (for compression)

### Animation not showing?
- Enable JavaScript in browser
- Check browser console for errors

---

## Next Steps

- See [Architecture](../ARCHITECTURE.md) for technical details
- Review [API Reference](../API.md) for developers
- Check [Deployment](../DEPLOYMENT.md) for production setup