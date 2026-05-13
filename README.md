# 💔 FakeLove PDF Tools

**We love your PDFs… but it's fake.**

A parody PDF tool with personality, removing limits and adding drama to your file management experience.

![Next.js](https://img.shields.io/badge/Next.js-14.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![SCSS](https://img.shields.io/badge/SCSS-Enabled-pink)
![License](https://img.shields.io/badge/License-MIT-red)
![Vercel Ready](https://img.shields.io/badge/Vercel-Ready-green)
![Dark Theme](https://img.shields.io/badge/Theme-Cyberpunk%20Red-purple)
![Bilingual](https://img.shields.io/badge/i18n-ES%2FEN-orange)

---

## 🎯 What is FakeLove?

FakeLove PDF Tools is a **sarcastic, dark-themed PDF manipulation suite** that treats your files like a toxic relationship:

- 💔 "We pretend to love your PDFs"
- ⚡ Fast processing with zero UI blocking  
- 🌐 Full Spanish/English support
- 🎆 Binary celebration fireworks on completion
- 👤 Signature developer tag (CHARLES-X)

> *"We are NOT just a tool. We are an experience."*

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
FakeLove-PDF-Tools/
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
├── documentation/         # Full documentation
├── public/                # Static assets
├── styles/                # Global styles
├── scripts/               # Python helper scripts
├── tests/                 # Test files
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

All documentation is in the `documentation/` folder:

- [Getting Started](./documentation/GETTING_STARTED.md) — Quick start guide
- [Installation](./documentation/INSTALLATION.md) — Detailed installation
- [Features](./documentation/FEATURES.md) — All features explained
- [Architecture](./documentation/ARCHITECTURE.md) — System design
- [API Reference](./documentation/API.md) — API endpoints
- [Components](./documentation/COMPONENTS.md) — Component library
- [Deployment](./documentation/DEPLOYMENT.md) — Deployment guide
- [Troubleshooting](./documentation/TROUBLESHOOTING.md) — Common issues
- [Changelog](./documentation/CHANGELOG.md) — Version history

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