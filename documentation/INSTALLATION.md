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
| LibreOffice | 7.0+ | Office conversions |
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

### LibreOffice (PDF to Office)

**Windows:**
1. Download from https://www.libreoffice.org/download/
2. Install with default settings
3. Add to PATH or note installation path

**Mac:**
```bash
brew install --cask libreoffice
```

**Linux:**
```bash
sudo apt update
sudo apt install libreoffice
```

### Ghostscript (PDF Compression)

**Windows:**
1. Download from https://www.ghostscript.com/download/gsdnld.html
2. Install to default location
3. Add to PATH

**Mac:**
```bash
brew install ghostscript
```

**Linux:**
```bash
sudo apt install ghostscript
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

---

## Next Steps

After installation, see [Getting Started](./GETTING_STARTED.md) to begin using the application.