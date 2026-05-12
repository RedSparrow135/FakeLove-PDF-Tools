# 📦 Installation Guide

Complete installation instructions for FakeLove PDF Tools.

---

## Requirements

### Minimum Requirements
| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | 18.0+ | Runtime |
| npm | 8.0+ | Package manager |
| OS | Windows/Mac/Linux | Cross-platform |

### Recommended Requirements
| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | 20.x LTS | Latest stable |
| npm | 10.x | Latest stable |
| Python | 3.9+ | Script automation |
| Ghostscript | 9.5+ | PDF compression |

---

## Installation Methods

### Method 1: Fresh Clone (Recommended)

```bash
# Clone the repository
git clone https://github.com/RedSparrow135/FakeLove-PDF-Tools.git

# Navigate to project
cd FakeLove-PDF-Tools

# Install dependencies
npm install

# Start development server
npm run dev
```

### Method 2: From Existing Installation

```bash
# Update dependencies
npm install

# Clean cache (optional)
rm -rf .next
npm run build
```

---

## Environment Setup

### 1. Create Environment File

Create `.env.local` in the project root:

```env
# Application URL (optional)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Node environment
NODE_ENV=development
```

### 2. Verify Installation

```bash
# Check Node version
node --version

# Check npm version
npm --version

# Check Python version (optional)
python --version

# Verify Next.js installation
npx next --version
```

---

## Optional Dependencies

### Ghostscript (PDF Compression)

**Why Ghostscript?**
- Ghostscript provides high-quality PDF compression using PostScript rendering
- It's the industry standard for PDF processing
- Works on all platforms (Windows, Mac, Linux)
- No cloud dependencies - runs locally

**Installation:**

**Windows:**
1. Download Ghostscript from: https://github.com/ArtifexSoftware/ghostpdftotal
   - Direct link: https://github.com/ArtifexSoftware/ghostpdl-downloads/releases
   - Download `gs10023.exe` (or latest version) for Windows 64-bit
2. Run the installer
3. Default installation path: `C:\Program Files\gs\gs10.02.3\bin\`
4. **IMPORTANT:** Add Ghostscript to System PATH:
   - Open System Properties → Advanced → Environment Variables
   - Edit "Path" in System variables
   - Add: `C:\Program Files\gs\gs10.02.3\bin\`
   - Add: `C:\Program Files\gs\gs10.02.3\lib\`
5. Verify installation:
   ```bash
   gswin64c -version
   ```

**Mac (Homebrew):**
```bash
brew install ghostscript
# Verify
gs -version
```

**Linux (Debian/Ubuntu):**
```bash
sudo apt update
sudo apt install ghostscript
# Verify
gs -version
```

**Linux (Fedora/RHEL):**
```bash
sudo dnf install ghostscript
# Verify
gs -version
```

**Usage Example:**
```bash
# Basic compression (medium quality)
gswin64c -sDEVICE=pdfwrite -dNOPAUSE -dQUIET -dBATCH \
  -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook \
  -sOutputFile=output.pdf input.pdf

# High compression
gswin64c -sDEVICE=pdfwrite -dNOPAUSE -dQUIET -dBATCH \
  -dCompatibilityLevel=1.4 -dPDFSETTINGS=/printer \
  -sOutputFile=output.pdf input.pdf
```

**Compression Levels via Ghostscript:**
| Level | PDFSETTINGS | Quality | Size Reduction |
|-------|-------------|---------|----------------|
| Low | `/prepress` | 300 DPI | ~20-30% |
| Medium | `/ebook` | 150 DPI | ~50-60% |
| High | `/printer` | 150 DPI | ~60-70% |
| Extreme | `/screen` | 72 DPI | ~70-85% |

---

## Python Scripts (Optional)

Some features use Python scripts for advanced processing.

**Requirements:**
- Python 3.9+
- `pip` package manager

**Installation:**
```bash
# Windows (from Microsoft Store or python.org)
# Verify
python --version

# Linux/Mac (usually pre-installed)
python3 --version
```

**Required Python Packages:**
```bash
pip install pypdf pillow
```

---

## Build for Production

### 1. Install Production Dependencies

```bash
npm install --production
```

### 2. Build the Application

```bash
npm run build
```

### 3. Test Production Build

```bash
npm start
```

---

## Docker Installation

### Dockerfile

Create `Dockerfile` in the project root:

```dockerfile
FROM node:18-alpine

RUN apk add --no-cache python3 py3-pip ghostscript

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Build and Run

```bash
# Build image
docker build -t fakelove-pdf-tools .

# Run container
docker run -d -p 3000:3000 fakelove-pdf-tools
```

---

## Verification Checklist

- [ ] Node.js 18+ installed
- [ ] npm install completed without errors
- [ ] `npm run dev` starts successfully
- [ ] Browser can access http://localhost:3000
- [ ] PDF merge tool works
- [ ] PDF split tool works
- [ ] Language toggle works

---

## Troubleshooting Installation

### Error: Cannot find module 'next'

```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: node-gyp rebuild failed

```bash
# Windows
npm install --global windows-build-tools

# Mac
xcode-select --install
```

### Error: Python not found

Ensure Python is installed and in PATH:
```bash
python --version
```

### Error: Ghostscript not found

```bash
# Windows - Verify PATH
where gswin64c

# Linux/Mac - Verify PATH
which gs
```

---

## Next Steps

After installation, see [Getting Started](./GETTING_STARTED.md) to begin using the application.
