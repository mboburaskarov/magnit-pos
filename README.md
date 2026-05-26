# Magnit POS

Point of sale application built with React + Vite. Runs as a web app or a native desktop app via Electron.

## Prerequisites

- Node.js 18+
- npm

## Install dependencies

```bash
npm install --legacy-peer-deps
```

## Web

```bash
# Development server (http://localhost:8000)
npm run dev

# Production build
npm run build
```

## Electron (Desktop)

```bash
# Run in development mode (Vite dev server + Electron window)
npm run electron:dev

# Build for current OS
npm run electron:build

# Build for specific platform
npm run electron:build:mac    # macOS DMG
npm run electron:build:win    # Windows NSIS installer
npm run electron:build:linux  # Linux AppImage
```

Build output is written to the `release/` directory.

### macOS
Open `release/Magnit POS-x.x.x.dmg`, drag the app to Applications, then launch it.

### Windows
Run `release/Magnit POS Setup x.x.x.exe` and follow the installer.

### Linux
```bash
chmod +x "release/Magnit POS-x.x.x.AppImage"
./"release/Magnit POS-x.x.x.AppImage"
```

## Environment

Copy `.env` and adjust values as needed. Key variables:

| Variable | Description |
|---|---|
| `VITE_MODE` | `dev` uses `*_DEV` API URLs, anything else uses production URLs |
| `VITE_BASE_API_URL` | Production API base URL |
| `VITE_BASE_API_URL_DEV` | Development API base URL |
| `VITE_EPOS_BASE_API_URL` | EPOS terminal service URL (local, port 8347) |
