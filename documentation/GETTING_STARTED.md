# 🚀 Getting Started

Welcome to **FakeLove PDF Tools**! This guide will help you get up and running quickly.

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** — [Download here](https://nodejs.org/)
- **npm** — Comes with Node.js
- **Python 3.x** — [Download here](https://www.python.org/) (for advanced features)
- **Git** — [Download here](https://git-scm.com/)

### Optional Dependencies

- **LibreOffice** — For PDF to Office conversions ([Download](https://www.libreoffice.org/download/))
- **Ghostscript** — For PDF compression ([Download](https://www.ghostscript.com/))

---

## Quick Start (5 minutes)

### 1. Clone the Repository

```bash
git clone https://github.com/RedSparrow135/FakeLove-PDF-Tools.git
cd FakeLove-PDF-Tools
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

### 4. Open in Browser

Navigate to: [http://localhost:3000](http://localhost:3000)

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Project Structure Overview

```
FakeLove-PDF-Tools/
├── app/              # Next.js pages and API routes
├── components/       # React UI components
├── lib/             # Utilities and context providers
├── documentation/    # Full documentation
├── scripts/         # Python helper scripts
├── public/          # Static assets
└── styles/          # Global styles
```

---

## First Steps

### 1. Explore the Dashboard

The homepage displays all available PDF tools organized by category:
- **PDF Tools**: Merge, Split, Compress, Image to PDF
- **Convert**: PDF to Word, Excel, PowerPoint

### 2. Try a Tool

1. Click on any tool card
2. Drag and drop a PDF file
3. Configure options (if any)
4. Click the action button
5. Download your result!

### 3. Switch Language

Click the globe icon in the top-right corner to toggle between:
- 🇪🇸 Español
- 🇺🇸 English

---

## Features Overview

### Core Features
- **Merge PDFs** — Combine multiple PDFs into one
- **Split PDFs** — Extract specific pages
- **Compress PDFs** — Reduce file size
- **Image to PDF** — Convert images to PDF format

### Conversion Features
- **PDF to DOCX** — Convert to Microsoft Word
- **PDF to XLSX** — Convert to Microsoft Excel
- **PDF to PPTX** — Convert to Microsoft PowerPoint

### Special Features
- 🌐 Bilingual interface (ES/EN)
- 🎆 Binary celebration animations
- 👤 Developer signature with pixel heart
- 💾 Process history persistence

---

## Troubleshooting

### "next" command not found

```bash
npm install
npx next dev
```

### Port 3000 already in use

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <pid> /F

# Linux/Mac
lsof -i :3000
kill -9 <pid>
```

### Python scripts not working

Ensure Python is installed and in your PATH:
```bash
python --version
```

---

## Next Steps

- Read the [Features Documentation](./FEATURES.md) for detailed feature guides
- Check the [Architecture](../ARCHITECTURE.md) for technical details
- Review the [API Reference](../API.md) for developers

---

**Need help?** Open an issue on [GitHub](https://github.com/RedSparrow135/FakeLove-PDF-Tools/issues)