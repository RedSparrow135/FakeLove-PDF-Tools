# 🚀 Vercel Deployment Guide

Guide for deploying FakeLove PDF Tools on Vercel with limitations.

---

## ⚠️ Important Limitations

The Vercel deployment has the following restrictions:

| Feature | Status | Limitation |
|---------|--------|------------|
| File Size | 4.5MB | Vercel function payload limit |
| PDF Compression | Trial | Requires Ghostscript (not available) |
| Word/Excel/PPTX | Trial | Limited functionality |
| Image to PDF | Working | Full functionality |

---

## 📋 Trial Features

Some features show a **"TRIAL"** banner and require self-hosting for full functionality:

### Compress PDF
- **Status:** Coming Soon
- **Reason:** Requires Ghostscript installation
- **Solution:** Deploy on your own server

### PDF to Office (Word, Excel, PowerPoint)
- **Status:** Limited
- **Reason:** File size restrictions
- **Solution:** Self-host for unlimited files

---

## 🔧 File Size Handling

### Frontend Validation
All file upload components validate file size before upload:

```typescript
const MAX_SIZE = 4.5 * 1024 * 1024 // 4.5MB

if (file.size > MAX_SIZE) {
  setError(`File too large. Maximum: 4.5MB`)
  return
}
```

### API Validation
Server routes also validate file size:

```typescript
const MAX_SIZE = 4.5 * 1024 * 1024

if (file.size > MAX_SIZE) {
  return NextResponse.json(
    { error: 'File too large. Maximum: 4.5MB.' },
    { status: 413 }
  )
}
```

---

## 🎨 UI Indicators

### Trial Banner
Features with limitations show a subtle banner:

```tsx
<div className={styles.trialBanner}>
  <span className={styles.trialBadge}>TRIAL</span>
  <p><strong>Feature name</strong> with self-hosted version:</p>
  <a href="https://github.com/..." className={styles.repoButton}>
    <svg viewBox="0 0 24 24">...</svg>
  </a>
</div>
```

### GitHub Button
Features include a link to the GitHub repository for self-hosting instructions.

---

## 🖥️ Self-Hosting vs Vercel

| Feature | Vercel | Self-Hosted |
|---------|--------|-------------|
| Merge PDFs | 4.5MB limit | Unlimited |
| Split PDF | 4.5MB limit | Unlimited |
| Compress PDF | Not available | Full |
| Image to PDF | 4.5MB limit | Unlimited |
| Word to PDF | Text only | Full |
| PDF to Office | Limited | Full |

---

## 📦 Branch Structure

- **`main`** — Full features, unlimited (for self-hosting)
- **`vercel-limited`** — Vercel-compatible, 4.5MB limits, trial banners

---

## 🚀 Deploy to Vercel

### 1. Fork or Clone
```bash
git clone https://github.com/RedSparrow135/FakeLove-PDF-Tools.git
cd FakeLove-PDF-Tools
git checkout vercel-limited
```

### 2. Deploy
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### 3. Environment Variables
Create `.env.local` if needed:
```env
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

---

## 🔗 Useful Links

- [GitHub Repository](https://github.com/RedSparrow135/FakeLove-PDF-Tools)
- [Main Branch (Unlimited)](https://github.com/RedSparrow135/FakeLove-PDF-Tools/tree/main)
- [Vercel Deployment](https://vercel.com)
- [Ghostscript Download](https://www.ghostscript.com/)