# Avinash P V — AI Software Developer Portfolio (v3.1)

Interactive portfolio built from scratch with plain HTML, CSS and JavaScript. No frameworks, no build step, ready for GitHub Pages.

**Live:** https://avinash20003.github.io/Portfolio/

## ✨ Features
- **Cinematic 3D scene** (`js/scene3d.js`, Three.js r160 in `js/vendor/`): scrolling flies a camera through six chapters: a solar system with spinning, revolving planets; an electronics chapter with a circuit board, travelling pulses, chips, resistors, capacitors, LEDs and an oscilloscope wave; a code tunnel; an ECG heartbeat with databases and data packets; phone and dashboard screens of real projects; and an atom finale. Stars streak into warp when you scroll fast. The 3D view is always on. On computers without a graphics card it renders at lower resolution and 30fps so it stays smooth.
- **3D solar journey** (`js/motion.js`): a warp starfield that speeds up as you scroll, a zoom through the hero's solar system, sections that fly in from depth, left and right, skill cards that sweep in on a wave, flowing wave lines between sections, and large planets drifting past at different depths
- **Projects gallery**: on desktop, vertical scrolling moves a pinned 3D gallery from right to left
- **Northern lights**: flowing aurora curtains that change colour and shape for each section as you scroll
- **Eclipse nucleus hero**: a glowing AI core with a solar corona, and tech "planets" in different shades (ocean, ringed, lava, ice, gas giant, nebula, sun…) orbiting in 3D (hover a planet to pause)
- **Northern lights**: animated aurora curtains that change colour and motion for each section
- **Cursor light**: a soft light follows the pointer and card edges glow where it passes
- **Avinash.AI**: chat assistant that **speaks** (clear natural voices, voice & speed picker) and **listens** (mic input)
- **Smooth inertia scrolling**, side navigation dots, and an active-section highlight
- **Dark, blended design**: each section has its own subtle pattern (grid floor, dot matrix, honeycomb, light sweep, blueprint, paint splashes, topographic lines, orbit rings)
- **Atom emblem** behind the contact section
- **4 colour themes**: Mono (default, black & white), Aurora, Sunset, Emerald
- **Interactive terminal**: `help`, `projects`, `open 2`, `say hello`, `theme mono`, `play bugs`
- **Project case studies** with a "🔊 Explain it to me" button
- **Playground**: 🎨 Neural Paint · 🧠 Stack Memory · 🐞 Bug Smash
- **Data-driven**: all content lives in `data/resume.js`

## 📁 Structure
```
index.html             → page layout
data/resume.js         → ALL content: edit this to update the site
css/style.css          → design, themes, patterns, animations
js/render.js           → builds sections from resume.js
js/app.js              → effects, orbits, smooth scroll, voice, chat, terminal
js/games.js            → Neural Paint, Stack Memory, Bug Smash
js/scene3d.js          → cinematic 3D scroll scene
js/motion.js           → scroll-linked section motion, waves, projects gallery
js/vendor/three.min.js → Three.js library (MIT licence)
assets/resume.pdf      → 2-page resume (Resume ↓ button)
assets/resume-1page.pdf→ 1-page version
favicon.svg, 404.html, .nojekyll, robots.txt → hosting files
vercel.json            → Vercel caching and security headers
assets/og-image.jpg    → link-preview image (1200×630)
```

## 🚀 Deploy to Vercel (recommended)
1. Push this folder to GitHub (commands below).
2. On vercel.com: **Add New → Project → Import** the repo.
3. Framework preset: **Other**. Leave the build command and output directory **empty**. Click **Deploy**.
4. `vercel.json` already sets caching and security headers.

**After the first deploy:** open `index.html` and change the two image tags to your full URL so link previews show on LinkedIn and WhatsApp:
`<meta property="og:image" content="https://YOUR-SITE.vercel.app/assets/og-image.jpg">` (and the same for `twitter:image`).

## 🚀 Deploy to GitHub Pages
```bash
git init
git add .
git commit -m "Portfolio v8.1"
git branch -M main
git remote add origin https://github.com/avinash20003/Portfolio.git
git push -u origin main
```
Then on GitHub go to **Settings → Pages → Deploy from a branch → main / (root) → Save**.
The site goes live at `https://avinash20003.github.io/Portfolio/` in 1–2 minutes.

> To update later: edit the files, then run `git add .`, `git commit -m "update"` and `git push`.

## 🎙 Voice & microphone
- The robot's voice works in all modern browsers. **Microsoft Edge** has the clearest "Natural" voices.
- The **mic needs `https://`** (GitHub Pages) or `localhost` (VS Code Live Server). It is blocked when `index.html` is opened by double-click (`file://`).
- The first time you use the mic, allow microphone access when the browser asks.
- Voice input works in Chrome, Edge and Safari (not in Firefox or Brave).

## ⚡ Performance
- Heavy effects run at a capped frame rate and pause when they're off screen or the tab is hidden.
- **Auto quality:** on slower computers the site switches to *lite* mode automatically. It keeps the same design but drops the animated sky and particle layers.
- Force a mode for testing: add `?fx=full` or `?fx=lite` to the URL.

## ✏️ Updating content
Edit `data/resume.js`. Projects, skills, experience, orbit planets, the terminal and the AI chat all update automatically.

## 📬 Contact
avinashpv03@gmail.com · [LinkedIn](https://linkedin.com/in/avinashpvb053b1225) · [GitHub](https://github.com/avinash20003)
