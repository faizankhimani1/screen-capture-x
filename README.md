<<<<<<< HEAD
# ScreenCaptureX 🎬

> Free browser-based screen recorder — capture screen, webcam & audio. No install, no signup.

**Live Demo:** https://screen-capture-x.netlify.app/  
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

## Contact

- 🌐 Portfolio: https://faizankhimani.netlify.app/
- 💼 LinkedIn: https://www.linkedin.com/in/faizan-khimani-
- 🐙 GitHub: https://github.com/faizankhimani1
- 💬 WhatsApp: https://wa.me/918999282582

---

© 2026 ScreenCaptureX — Developed by Faizan Khimani. All rights reserved.
=======
# screen-capture-x
>>>>>>> 80e80f5d47e59cc911c35fb70c81c3de08c4bbbf
