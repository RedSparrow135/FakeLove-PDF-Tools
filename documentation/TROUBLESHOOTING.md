# 🔧 Troubleshooting Guide

Common issues and solutions for FakeLove PDF Tools.

---

## Installation Issues

### "next" command not found

**Problem:** Running `npm run dev` fails with command not found.

**Solution:**
```bash
npm install
npx next dev
```

If still failing:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

### npm install taking too long

**Problem:** Installation hangs or is very slow.

**Solution:**
1. Check internet connection
2. Clear npm cache:
```bash
npm cache clean --force
npm install
```
3. Try with yarn:
```bash
npm install -g yarn
yarn install
```

---

### Node.js version mismatch

**Problem:** "Node.js version is too old" or similar error.

**Solution:**
1. Check current version:
```bash
node --version
```
2. Update Node.js:
   - Windows: Download from nodejs.org
   - Mac: `brew install node`
   - Linux: `sudo apt install nodejs`

---

## Development Server Issues

### Port 3000 already in use

**Problem:** Cannot start server on port 3000.

**Solution:**

Windows:
```powershell
netstat -ano | findstr :3000
taskkill /PID <pid> /F
```

Linux/Mac:
```bash
lsof -i :3000
kill -9 <pid>
```

Or use a different port:
```bash
npm run dev -- -p 3001
```

---

### Server starts but page is blank

**Problem:** Browser shows blank page after `npm run dev`.

**Solution:**
1. Clear browser cache
2. Open in incognito/private window
3. Check browser console for errors
4. Restart server:
```bash
rm -rf .next
npm run dev
```

---

### Hot reload not working

**Problem:** Changes not reflecting in browser.

**Solution:**
```bash
# Restart completely
rm -rf .next
npm run dev

# Or press Ctrl+C and restart
```

---

## PDF Processing Issues

### Merge fails

**Problem:** PDF merge operation fails.

**Possible causes:**
- Corrupted PDF file
- Password-protected PDF
- PDF with unusual encoding

**Solution:**
1. Verify PDF file opens in browser
2. Try with a different PDF
3. Check server logs for error details

---

### Split not extracting pages

**Problem:** Selected pages are not extracted correctly.

**Possible causes:**
- Invalid page range syntax
- Page numbers exceed PDF length

**Solution:**
1. Use correct syntax: `1-3`, `1,3,5`, `1-3,5,7-9`
2. Check page count in PDF
3. Ensure pages are within valid range

---

### Compression results in larger file

**Problem:** Compressed PDF is larger than original.

**Possible causes:**
- PDF already compressed
- Image-based PDF (scans)
- Low compression level selected

**Solution:**
1. Use higher compression level (High or Extreme)
2. Check if source is already optimized
3. Consider image quality reduction

---

### Image to PDF quality is poor

**Problem:** Converted PDF has low quality images.

**Solution:**
1. Use higher resolution images
2. Ensure images are in PNG or JPG format
3. Check original image quality

---

## Conversion Issues

### PDF to Office conversion fails

**Problem:** LibreOffice conversion returns error.

**Possible causes:**
- LibreOffice not installed
- Invalid PDF format
- Server timeout

**Solution:**
1. Install LibreOffice:
   - Windows: https://www.libreoffice.org/download/
   - Mac: `brew install --cask libreoffice`
   - Linux: `sudo apt install libreoffice`
2. Restart the server
3. Try with a different PDF

---

### Ghostscript not found

**Problem:** Compression fails with "Ghostscript not found".

**Solution:**
1. Install Ghostscript:
   - Windows: https://www.ghostscript.com/download/gsdnld.html
   - Mac: `brew install ghostscript`
   - Linux: `sudo apt install ghostscript`
2. Add to system PATH
3. Restart server

---

### Python scripts not working

**Problem:** Python-dependent features fail.

**Solution:**
1. Verify Python installation:
```bash
python --version
python3 --version
```
2. Install Python:
   - Windows: https://www.python.org/downloads/
   - Mac: `brew install python3`
   - Linux: `sudo apt install python3`
3. Ensure Python is in PATH

---

## UI/Animation Issues

### Binary Easter Egg not appearing

**Problem:** Celebration animation doesn't show after completion.

**Solution:**
1. Enable JavaScript in browser
2. Check browser console for errors
3. Try with different browser (Chrome recommended)
4. Clear localStorage:
```javascript
localStorage.clear()
```

---

### Language toggle not working

**Problem:** Language doesn't change when clicking globe icon.

**Solution:**
1. Check browser console for errors
2. Verify `lib/language.tsx` is loaded
3. Check localStorage is enabled
4. Try clearing browser cache

---

### Footer or signature not displaying

**Problem:** Footer or developer signature missing.

**Solution:**
1. Check `app/page.tsx` for footer component
2. Verify `DeveloperSignature` component exists
3. Check CSS for z-index and positioning
4. Inspect browser console for errors

---

## Deployment Issues

### Build fails on Vercel/Production

**Problem:** `npm run build` fails in deployment.

**Solution:**
1. Check package.json scripts
2. Verify all dependencies are in package.json
3. Check build logs for specific errors
4. Ensure `.gitignore` excludes node_modules

---

### Environment variables not working

**Problem:** Environment variables not being read.

**Solution:**
1. Restart the server
2. Check .env.local file location
3. Verify variable names match (NEXT_PUBLIC_* prefix needed)
4. For Vercel: Set variables in dashboard

---

### Static export issues

**Problem:** Static export fails or missing pages.

**Solution:**
1. Check `next.config.js` configuration
2. Ensure no server-only code in pages
3. Verify all imports are correct

---

## Performance Issues

### Server running slowly

**Problem:** Operations take very long time.

**Solutions:**
1. Check server resources (CPU, RAM)
2. Reduce file sizes
3. Use fewer simultaneous operations
4. Consider upgrading server

---

### Memory issues

**Problem:** Server crashes with out of memory error.

**Solutions:**
1. Reduce file upload limits
2. Process files one at a time
3. Increase server memory
4. Check for memory leaks in code

---

## Getting Help

### Check Logs

Always check server logs first:
```bash
npm run dev  # Development logs
pm2 logs     # Production logs
```

### Run Diagnostics

```bash
# Check Node version
node --version

# Check npm version
npm --version

# Check Python version
python --version

# Verify dependencies
npm ls
```

### Report Issues

For bug reports, include:
1. Error message (full text)
2. Steps to reproduce
3. File type and size
4. Browser and OS version
5. Server logs (if applicable)

---

## Known Limitations

1. **No password-protected PDF support** — Encrypted PDFs cannot be processed
2. **Max file size: 50MB** — Larger files may fail
3. **Limited OCR** — Image-based PDFs require text extraction tools
4. **LibreOffice required** — PDF to Office needs LibreOffice installed

---

## Reset Everything

If all else fails:

```bash
# 1. Stop server
# 2. Delete local files
rm -rf node_modules .next package-lock.json

# 3. Fresh install
npm install

# 4. Build clean
npm run build

# 5. Start fresh
npm start
```