# 💔 Fake Love — PDF Suite

**We love your PDFs… but it's fake.**

A parody PDF tool with personality, removing limits and adding drama to your file management experience.

![Next.js](https://img.shields.io/badge/Next.js-14.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![SCSS](https://img.shields.io/badge/SCSS-Enabled-pink)

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## 🎯 Features

### Core Tools
- **Merge PDFs** — Combine multiple PDF files into one
- **Split PDFs** — Extract pages from a PDF
- **Compress PDFs** — Reduce file size without quality loss
- **Image to PDF** — Convert images (JPG, PNG, GIF, WEBP, BMP, TIFF) to PDF

### More Tools
- **PDF to Word** — Convert PDF to DOCX
- **PDF to Excel** — Convert PDF to XLSX
- **PDF to PowerPoint** — Convert PDF to PPTX

### Special Features
- 🌐 **Bilingual** — Spanish/English toggle with localStorage persistence
- 🎆 **Binary Easter Egg** — Animated celebration with binary messages on completion
- 👤 **Developer Signature** — "Charle-X" floating signature with pixel heart
- ⚡ **Background Processing** — All pages process in background, no UI blocking
- 📊 **Process History** — Persists across page refreshes via localStorage

---

## 🧠 Philosophy

> "We are NOT just a tool. We are an experience."

Fake Love embraces a toxic-but-funny relationship with your files:
- No limits
- Fast interactions
- Humor first, perfection second

Every feature includes:
- Sarcastic text messages
- Unexpected behavior
- Personality

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | App Router framework |
| **TypeScript** | Type safety |
| **SCSS** | Modular component styles |
| **pdf-lib** | PDF manipulation (merge, split, compress) |
| **pdfjs-dist** | PDF rendering |
| **mammoth** | DOCX conversion |
| **xlsx** | Excel file handling |
| **libreoffice-convert** | Office document conversion |
| **Lucide React** | Icon library |

---

## 📁 Project Structure

```
fake-love/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── compress/          # Compress PDF page
│   ├── imagetopdf/        # Image to PDF page
│   ├── merge/             # Merge PDFs page
│   ├── more-tools/        # Additional tools (PDF to Office)
│   ├── split/             # Split PDF page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable React components (33 files)
├── lib/                   # Utilities and context
│   ├── language.tsx       # i18n translations (ES/EN)
│   └── processContext.tsx # Global process state
├── public/                # Static assets
├── styles/                # Global styles
├── scripts/               # Python helper scripts
├── tests/                 # Test files
├── docs/                  # Documentation
│   ├── ARCHITECTURE.md    # System architecture
│   ├── API.md             # Endpoint reference
│   ├── COMPONENTS.md      # Component library
│   ├── DEPLOYMENT.md      # Deployment guide
│   └── CHANGELOG.md       # Version history
├── package.json
└── .gitignore
```

---

## 🌐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Optional: Set the base URL for the application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📖 Documentation

- [CHANGELOG](./docs/CHANGELOG.md) — Version history
- [Architecture](./docs/ARCHITECTURE.md) — System design and structure
- [API Reference](./docs/API.md) — Endpoint documentation
- [Components](./docs/COMPONENTS.md) — Component library
- [Deployment](./docs/DEPLOYMENT.md) — Deployment guide

---

## 🎨 Design System

### Colors
| Name | Hex | Usage |
|------|-----|-------|
| Primary | `#dc2626` | CTAs, highlights |
| Background | `#0a0a0f` | Main background |
| Surface | `#141419` | Cards, panels |
| Border | `#2a2a35` | Dividers, borders |
| Text Primary | `#f5f5f5` | Main text |
| Text Secondary | `#9ca3af` | Muted text |

### Typography
- **Headings:** System font stack
- **Body:** System font stack
- **Monospace:** Monospace for code/binary elements

---

## 😈 Troll UI Messages

The app includes sarcastic messages throughout:

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

## 👤 Developer

**Charle-X** — Floating signature with pixel heart animation.

Binary message: `01000011 01001000 01000001 01010010 01001100 01000101 00100000 01010010 01001111 0001010`

---

## 📄 License

MIT License — Use it, abuse it, break it, love it.

---

**Made with 💔 and sarcasm.**