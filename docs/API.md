# 📡 API Reference

Complete documentation for all Fake Love API endpoints.

---

## Base URL

```
http://localhost:3000/api
```

---

## Common Patterns

### Request Format
All endpoints accept `multipart/form-data` with files sent as form fields.

### Response Format
Successful responses return binary files with appropriate headers:
```
Content-Type: [file-type]
Content-Disposition: attachment; filename=[output-name]
```

Error responses return JSON:
```json
{
  "error": "Error message"
}
```

---

## Endpoints

### 📦 Merge PDFs
**POST** `/api/merge`

Combine multiple PDF files into one.

#### Request
| Field | Type | Description |
|-------|------|-------------|
| `files` | File[] | Array of PDF files to merge |
| `pages` | string[] | Optional page selectors per file (1-indexed) |

#### Response
Binary PDF file (`merged.pdf`)

#### Example
```javascript
const formData = new FormData()
files.forEach(file => formData.append('files', file))

const response = await fetch('/api/merge', {
  method: 'POST',
  body: formData
})
```

#### Error Codes
- `400`: Need at least 1 file
- `500`: Merge failed

---

### ✂️ Split PDF
**POST** `/api/split`

Extract pages from a PDF into a new file.

#### Request
| Field | Type | Description |
|-------|------|-------------|
| `file` | File | Single PDF file |
| `mode` | string | `single`, `every`, `range`, or `selection` |
| `range` | string | Page number or range (e.g., `1-3,5,7-9`) |
| `page` | number | Single page number (for `single` mode) |
| `every` | number | Extract every N pages |

#### Response
Binary PDF file (`split.pdf`)

#### Examples
```javascript
// Extract single page
formData.append('mode', 'single')
formData.append('page', '5')

// Extract page range
formData.append('mode', 'range')
formData.append('range', '1-3,5,7-9')

// Extract every N pages
formData.append('mode', 'every')
formData.append('every', '2')
```

#### Page Range Syntax
- `1-3` → pages 1, 2, 3
- `1,3,5` → pages 1, 3, 5
- `1-3,5,7-9` → combined

#### Error Codes
- `400`: Invalid page number
- `500`: Split failed

---

### 🗜️ Compress PDF
**POST** `/api/compress`

Reduce PDF file size using Python/Ghostscript.

#### Request
| Field | Type | Description |
|-------|------|-------------|
| `file` | File | PDF file to compress |
| `level` | string | Compression level: `low`, `medium`, `high` |

#### Response
Binary PDF file (`compressed.pdf`)

#### Example
```javascript
const formData = new FormData()
formData.append('file', pdfFile)
formData.append('level', 'medium')

const response = await fetch('/api/compress', {
  method: 'POST',
  body: formData
})
```

#### Compression Levels
| Level | Quality | Size Reduction |
|-------|---------|----------------|
| `low` | Highest | Minimal |
| `medium` | High | Moderate |
| `high` | Low | Maximum |

#### Error Codes
- `400`: No file provided
- `500`: Compression failed, Python timeout

#### Dependencies
- Python 3.x
- Ghostscript installed

---

### 🖼️ Image to PDF
**POST** `/api/imagetopdf`

Convert images to PDF format.

#### Request
| Field | Type | Description |
|-------|------|-------------|
| `files` | File[] | Array of image files |
| `layout` | string | `one` (1 per page) or `two` (2 per page) |

#### Supported Formats
- PNG
- JPG/JPEG
- GIF
- WEBP
- BMP
- TIFF

#### Response
Binary PDF file (`images.pdf`)

#### Example
```javascript
const formData = new FormData()
images.forEach(img => formData.append('files', img))
formData.append('layout', 'one')

const response = await fetch('/api/imagetopdf', {
  method: 'POST',
  body: formData
})
```

#### Error Codes
- `400`: No images provided
- `500`: Conversion failed

---

### 📄 Convert to PDF
**POST** `/api/convert`

Convert documents (DOCX, XLSX, PPTX, etc.) to PDF.

#### Request
| Field | Type | Description |
|-------|------|-------------|
| `files` | File | Single document file |

#### Supported Input Formats
| Extension | Type |
|-----------|------|
| `doc` / `docx` | Word Document |
| `xls` / `xlsx` | Excel Spreadsheet |
| `ppt` / `pptx` | PowerPoint |
| `odt` / `ods` / `odp` | OpenDocument |
| `rtf` | Rich Text Format |
| `txt` | Plain Text |
| `csv` | CSV Data |

#### Response
Binary PDF file

#### Example
```javascript
const formData = new FormData()
formData.append('files', docFile)

const response = await fetch('/api/convert', {
  method: 'POST',
  body: formData
})
```

#### Dependencies
- Python 3.x
- LibreOffice installed

#### Error Codes
- `400`: Unsupported format
- `500`: Conversion failed, Python error

---

### 📝 PDF to DOCX
**POST** `/api/pdftooffice`

Convert PDF to Word document.

#### Request
| Field | Type | Description |
|-------|------|-------------|
| `files` | File | Single PDF file |
| `format` | string | `docx` |

#### Response
Binary DOCX file (`*.docx`)

#### Example
```javascript
const formData = new FormData()
formData.append('files', pdfFile)
formData.append('format', 'docx')

const response = await fetch('/api/pdftooffice', {
  method: 'POST',
  body: formData
})
```

#### Dependencies
- Python 3.x
- LibreOffice installed

#### Error Codes
- `400`: Invalid format, not PDF
- `500`: Conversion failed

---

### 📊 PDF to XLSX
**POST** `/api/pdftooffice`

Convert PDF to Excel spreadsheet.

#### Request
| Field | Type | Description |
|-------|------|-------------|
| `files` | File | Single PDF file |
| `format` | string | `xlsx` |

#### Response
Binary XLSX file (`*.xlsx`)

#### Example
```javascript
const formData = new FormData()
formData.append('files', pdfFile)
formData.append('format', 'xlsx')

const response = await fetch('/api/pdftooffice', {
  method: 'POST',
  body: formData
})
```

#### Dependencies
- Python 3.x
- LibreOffice installed

---

### 📽️ PDF to PPTX
**POST** `/api/pdftooffice`

Convert PDF to PowerPoint presentation.

#### Request
| Field | Type | Description |
|-------|------|-------------|
| `files` | File | Single PDF file |
| `format` | string | `pptx` |

#### Response
Binary PPTX file (`*.pptx`)

#### Example
```javascript
const formData = new FormData()
formData.append('files', pdfFile)
formData.append('format', 'pptx')

const response = await fetch('/api/pdftooffice', {
  method: 'POST',
  body: formData
})
```

#### Dependencies
- Python 3.x
- LibreOffice installed

---

## Response Examples

### Success Response (Binary)
```http
HTTP/1.1 200 OK
Content-Type: application/pdf
Content-Disposition: attachment; filename=merged.pdf
Content-Length: 12345

[binary data]
```

### Error Response
```json
{
  "error": "Need at least 1 file to merge"
}
```

---

## Rate Limits

No rate limits currently implemented. For production, consider:
- File size limits (e.g., 50MB max)
- Request timeout (60-120 seconds)
- Concurrent request limits

---

## Troubleshooting

### "Cannot run Python"
- Verify Python is installed: `python --version`
- Verify scripts exist in project root

### "LibreOffice might not be working"
- Install LibreOffice: https://www.libreoffice.org/download/
- Add to system PATH

### "Ghostscript not found"
- Install Ghostscript for compression
- Alternative: Remove compression feature

---

## Testing

Use curl to test endpoints:

```bash
# Test merge
curl -X POST -F "files=@file1.pdf" -F "files=@file2.pdf" http://localhost:3000/api/merge -o merged.pdf

# Test compress
curl -X POST -F "file=@input.pdf" -F "level=medium" http://localhost:3000/api/compress -o compressed.pdf

# Test image to PDF
curl -X POST -F "files=@image1.png" -F "files=@image2.jpg" http://localhost:3000/api/imagetopdf -o images.pdf
```