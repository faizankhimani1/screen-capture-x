# ScreenCaptureX 🎬

> Free browser-based screen recorder — capture screen, webcam & audio. No install, no signup.

**Live Demo:** https://screencapturex.vercel.app  
**Developed by:** [Faizan Khimani](https://faizankhimani.netlify.app/)

---

## Features

- 🖥️ Screen recording (entire screen / window / tab)
- 🎤 Microphone + system audio capture
- 📷 Webcam PiP overlay
- ⏸️ Pause & resume recording
- ✏️ Live annotations (pen, eraser, circle, arrow, text)
- 👁️ Preview before saving
- ✏️ Rename recordings
- ⬇️ Download as .webm
- 🔒 100% client-side — nothing uploaded to any server

---

## Tech Stack

- React 18 + Vite
- CSS Modules
- Browser MediaRecorder API (no extra libraries)

---

## Local Setup

### Step 1 — Install Node.js
Download from https://nodejs.org (LTS version recommended)

Verify install:
```bash
node -v   # should show v18 or higher
npm -v    # should show v9 or higher
```

### Step 2 — Clone / Download project
```bash
# If using git:
git clone https://github.com/faizankhimani1/screen-capture-x.git
cd screen-capture-x

# Or just extract the zip and cd into the folder
```

### Step 3 — Install dependencies
```bash
npm install
```

### Step 4 — Run locally
```bash
npm run dev
```
Open http://localhost:5173 in Chrome or Edge

### Step 5 — Build for production
```bash
npm run build
# Output will be in /dist folder
```

---

## Deploy to Vercel (Free — Recommended)

### Option A — GitHub + Vercel (Auto Deploy)

1. Push project to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/faizankhimani1/screen-capture-x.git
git push -u origin main
```

2. Go to https://vercel.com
3. Click "Add New Project"
4. Import your GitHub repo
5. Framework: **Vite** (auto-detected)
6. Click **Deploy**
7. Your app is live at `https://screen-capture-x.vercel.app` ✅

Every `git push` will auto-redeploy! 🚀

---

### Option B — Netlify (Drag & Drop)

1. Run `npm run build`
2. Go to https://netlify.com
3. Drag the `/dist` folder onto the Netlify dashboard
4. Done! ✅

---

### Option C — GitHub Pages

1. Install gh-pages:
```bash
npm install gh-pages --save-dev
```

2. Add to package.json scripts:
```json
"homepage": "https://faizankhimani1.github.io/screen-capture-x",
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"
```

3. Deploy:
```bash
npm run deploy
```

---

## Project Structure

```
screen-recorder/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Header.jsx + .module.css
│   │   ├── StatusBar.jsx + .module.css
│   │   ├── ScreenArea.jsx + .module.css
│   │   ├── Controls.jsx + .module.css
│   │   ├── AnnotationToolbar.jsx + .module.css
│   │   ├── PreviewActions.jsx + .module.css
│   │   ├── RecordingsList.jsx + .module.css
│   │   ├── WebcamPip.jsx + .module.css
│   │   ├── SettingsPanel.jsx + .module.css
│   │   ├── Footer.jsx + .module.css
│   │   └── Icon.jsx
│   ├── hooks/
│   │   ├── useRecorder.js
│   │   ├── useWebcam.js
│   │   ├── useAnnotations.js
│   │   └── useTimer.js
│   ├── utils/
│   │   └── formatters.js
│   ├── App.jsx + App.module.css
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

---

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome 72+ | ✅ Full |
| Edge 79+ | ✅ Full |
| Firefox 66+ | ✅ Partial (no system audio) |
| Safari | ❌ MediaRecorder limited |

> Requires HTTPS in production (Vercel/Netlify provide this automatically)

---

## Contact

- 🌐 Portfolio: https://faizankhimani.netlify.app/
- 💼 LinkedIn: https://www.linkedin.com/in/faizan-khimani-
- 🐙 GitHub: https://github.com/faizankhimani1
- 💬 WhatsApp: https://wa.me/911234567890

---

© 2025 ScreenCaptureX — Developed by Faizan Khimani. All rights reserved.
