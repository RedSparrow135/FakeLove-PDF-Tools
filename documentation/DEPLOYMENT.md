# 🚀 Deployment Guide

Complete guide for deploying Fake Love to production.

---

## Prerequisites

Before deploying, ensure you have:

- **Node.js 18+** — Required for Next.js 14
- **Python 3.x** — For PDF processing scripts
- **Git** — For version control
- **LibreOffice** (optional) — For Office document conversion
- **Ghostscript** (optional) — For PDF compression

---

## Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/RedSparrow135/01-Prueba.git
cd 01-Prueba
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create `.env.local` in the root directory:

```env
# Application URL (optional)
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Node environment
NODE_ENV=production
```

---

## Local Development

```bash
# Start development server
npm run dev

# Visit http://localhost:3000
```

---

## Production Build

### Build the Application

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### PM2 Process Manager (Recommended)

```bash
# Install PM2
npm install -g pm2

# Create ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'fake-love',
    script: 'npm',
    args: 'start',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF

# Start with PM2
pm2 start ecosystem.config.js

# Save process list
pm2 save

# Setup startup script
pm2 startup
```

---

## Docker Deployment

### Dockerfile

Create `Dockerfile` in the root:

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
docker build -t fake-love .

# Run container
docker run -d -p 3000:3000 --name fake-love fake-love
```

---

## Vercel Deployment (Recommended)

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Deploy

```bash
vercel
```

### 3. Configure for Python (if needed)

For features requiring Python (compress, pdftooffice):

```bash
# Install Python buildpack
vercel add https://github.com/vercel/vercel-python
```

---

## Railway Deployment

### 1. Connect GitHub Repository

- Go to [railway.app](https://railway.app)
- Connect your GitHub account
- Select the repository

### 2. Configure Start Command

```
npm install && npm run build && npm start
```

### 3. Add Environment Variables

- `NODE_ENV=production`
- `PORT=3000`

---

## DigitalOcean App Platform

### `app.yaml` Configuration

```yaml
name: fake-love
region: nyc
build_command: npm install && npm run build
run_command: npm start

static_files:
  - path: public/*
    cache_control: public, max-age=1, must-revalidate

env:
  - key: NODE_ENV
    value: production
```

---

## Heroku Deployment

### 1. Create `Procfile`

```
web: npm start
```

### 2. Add Buildpacks

```bash
heroku buildpacks:add heroku/nodejs
heroku buildpacks:add https://github.com/heroku/heroku-buildpack-python
```

### 3. Deploy

```bash
heroku create fake-love-pdf
git push heroku main
```

---

## AWS Deployment (EC2)

### 1. Launch Instance

- Choose Amazon Linux 2
- t3.medium or larger
- Configure security group (port 3000)

### 2. Install Dependencies

```bash
sudo yum update -y
sudo amazon-linux-extras install epel -y
sudo yum install -y python3 ghostscript
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
```

### 3. Deploy Application

```bash
git clone https://github.com/RedSparrow135/01-Prueba.git
cd 01-Prueba
npm install --production
npm run build
pm2 start npm -- start
```

### 4. Configure Nginx (Reverse Proxy)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Cloudflare Tunnel (No Public IP)

```bash
# Install cloudflared
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o cloudflared
chmod +x cloudflared

# Connect tunnel
./cloudflared tunnel --url http://localhost:3000
```

---

## Troubleshooting

### "Cannot find module"
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### "Python not found"
```bash
# Verify Python installation
python3 --version

# Add to PATH if needed
export PATH="/usr/bin:$PATH"
```

### "LibreOffice not working"
```bash
# Install LibreOffice
# Ubuntu/Debian
sudo apt install libreoffice

# macOS
brew install --cask libreoffice

# Windows
# Download from https://www.libreoffice.org/download/
```

### "Ghostscript not found"
```bash
# Ubuntu/Debian
sudo apt install ghostscript

# macOS
brew install ghostscript

# Windows
# Download from https://www.ghostscript.com/download/gsdnld.html
```

---

## Performance Optimization

### Enable Caching

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },
}
```

### Image Optimization

```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
  },
}
```

---

## Monitoring

### PM2 Metrics

```bash
pm2 monit
```

### Logs

```bash
pm2 logs fake-love
```

---

## SSL Configuration

### Let's Encrypt (Nginx)

```bash
sudo certbot --nginx -d your-domain.com
```

---

## Database (Optional)

For persistent data, add a database:

```bash
# Redis for session storage
npm install @upstash/redis

# Or PostgreSQL for process history
npm install @vercel/postgres
```

---

## Security Checklist

- [ ] Environment variables secured
- [ ] HTTPS enabled
- [ ] File upload limits set
- [ ] Rate limiting configured
- [ ] CORS configured for API routes
- [ ] Dependencies updated regularly

---

## Update Deployment

```bash
# Pull latest changes
git pull origin main

# Rebuild
npm run build

# Restart
pm2 restart fake-love
```