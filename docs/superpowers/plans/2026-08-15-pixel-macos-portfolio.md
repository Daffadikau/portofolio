# Pixel macOS Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild daffadikau.github.io/portofolio as a single pixel-art macOS window with tab navigation, a pixel dock, and an interactive terminal tab.

**Architecture:** Static vanilla site. One `index.html` shell; all content lives in `js/data.js` (single source of truth) consumed by both the visual tabs (`js/app.js`) and the terminal (`js/terminal.js`). Custom pixel art (dock icons, boot cat) is generated from text grids by `js/pixelart.js` into inline SVG. Classic `<script>` tags (no modules), globals on `window`. **All DOM is built with `createElement`/`textContent`/`append` — no `innerHTML` anywhere** (avoids any injection risk and keeps the security hooks happy).

**Tech Stack:** HTML/CSS/JS (no build), Google Fonts (Silkscreen, VT323, JetBrains Mono), Jerry's Pixel Icons SVGs (MIT).

**Spec:** `docs/superpowers/specs/2026-08-15-pixel-macos-portfolio-design.md`

## Global Constraints

- Vanilla only; zero build step; no runtime deps except Google Fonts.
- ALL paths relative (site is served from subpath `/portofolio/`).
- Palette: bg `#F5A46B → #E8845A`, window `#E8E8E8`, ink `#1A1A1A`, traffic lights `#F0713D` / `#F5D93D` / `#9DC24C`.
- All copy in English. Contact: `daffadikau@gmail.com`, `github.com/Daffadikau`, `linkedin.com/in/daffadikau`.
- Animations use `steps()` only; `prefers-reduced-motion: reduce` disables all animation and the boot screen.
- Crisp pixels: no border-radius on chrome, `image-rendering: pixelated` on pixel assets.
- No `innerHTML`/`insertAdjacentHTML`/`eval` anywhere — DOM API only (`createElement`, `textContent`, `append`, `replaceChildren`).
- Jerry's Pixel Icons require `assets/icons/tech/LICENSE-MIT.txt` with upstream MIT text + attribution line.
- Local preview: `python3 -m http.server 4173` from repo root → `http://localhost:4173/`.
- Commits: pesan lengkap berbahasa Indonesia dengan konteks + trailer `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>`.

## Shared helper (defined once in `js/app.js`, used by Tasks 4–9)

```js
// el('div', 'cls', 'text') → element; text goes through textContent (never HTML)
const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
};
```

---

### Task 1: Scaffold, tokens, background

**Files:**
- Create: `styles/base.css`
- Create: `index.html` (overwrite old)
- Delete: nothing yet (old `styles.css`/`script.js` removed in Task 10)

**Interfaces:**
- Produces: CSS custom properties `--bg-hi --bg-lo --win --win-dark --ink --tl-red --tl-yellow --tl-green --font-pixel --font-mono --font-term`; body renders dithered orange background; `#scene` centered via flex; empty `<section id="window">` and `<nav id="dock">` placeholders; `#boot` overlay div.

- [ ] **Step 1: Write `styles/base.css`**

```css
:root {
  --bg-hi: #f5a46b; --bg-lo: #e8845a;
  --win: #e8e8e8; --win-dark: #cfcfcf; --ink: #1a1a1a;
  --tl-red: #f0713d; --tl-yellow: #f5d93d; --tl-green: #9dc24c;
  --font-pixel: 'Silkscreen', monospace;
  --font-term: 'VT323', monospace;
  --font-mono: 'JetBrains Mono', monospace;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { height: 100%; }
body {
  font-family: var(--font-mono);
  color: var(--ink);
  background:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Crect x='0' y='0' width='1' height='1' fill='%23000' fill-opacity='.06'/%3E%3Crect x='4' y='2' width='1' height='1' fill='%23000' fill-opacity='.06'/%3E%3Crect x='2' y='5' width='1' height='1' fill='%23fff' fill-opacity='.10'/%3E%3Crect x='6' y='6' width='1' height='1' fill='%23000' fill-opacity='.06'/%3E%3C/svg%3E") repeat,
    linear-gradient(180deg, var(--bg-hi) 0%, var(--bg-lo) 100%);
  image-rendering: pixelated;
  overflow: hidden;
  cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='18' viewBox='0 0 12 18'%3E%3Cpath d='M0 0h2v2H0zM0 2h4v2H0zM0 4h6v2H0zM0 6h8v2H0zM0 8h10v2H0zM0 10h12v2H0zM0 12h5v2H0zM5 12h3v4H5z' fill='%23000'/%3E%3C/svg%3E") 0 0, auto;
}
#scene {
  height: 100%;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 18px; padding: 24px 16px;
}
a, button { cursor: inherit; }
:focus-visible { outline: 3px solid var(--ink); outline-offset: 1px; }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

- [ ] **Step 2: Write new `index.html` shell**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Daffa Adika — Portfolio</title>
    <meta name="description" content="Pixel macOS portfolio of Daffa Adika — Computer Engineering student & fullstack developer." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&family=VT323&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="styles/base.css" />
    <link rel="stylesheet" href="styles/window.css" />
    <link rel="stylesheet" href="styles/sections.css" />
    <link rel="stylesheet" href="styles/terminal.css" />
    <link rel="stylesheet" href="styles/dock.css" />
  </head>
  <body>
    <div id="boot" hidden></div>
    <main id="scene">
      <section id="window" aria-label="Portfolio window"></section>
      <nav id="dock" aria-label="Dock"></nav>
    </main>
    <noscript>
      <p style="position:fixed;inset:0;background:#e8e8e8;padding:2rem;font-family:monospace">
        This portfolio needs JavaScript. Reach me at
        <a href="mailto:daffadikau@gmail.com">daffadikau@gmail.com</a> ·
        <a href="https://github.com/Daffadikau">github.com/Daffadikau</a>
      </p>
    </noscript>
    <script src="js/data.js"></script>
    <script src="js/pixelart.js"></script>
    <script src="js/terminal.js"></script>
    <script src="js/app.js"></script>
  </body>
</html>
```

(Stylesheet/script files referenced here are created in later tasks; 404s in console are expected until Task 7.)

- [ ] **Step 3: Verify** — `python3 -m http.server 4173`, open `http://localhost:4173/`: orange dithered gradient fills screen, pixel cursor visible, no horizontal scroll.

- [ ] **Step 4: Commit** — `git add index.html styles/base.css && git commit` (pesan: scaffold scene + token warna + background dither).

---

### Task 2: Content data (`js/data.js`)

**Files:**
- Create: `js/data.js`

**Interfaces:**
- Produces: `window.PORTFOLIO_DATA = { name, fullName, role, location, status, bio, education, socials: {email, github, linkedin}, stats, projects: [{title, desc, tech: [{label, icon|null}], links: [{label, url}]}], skills: [{group, items: [{label, icon|null, level(1-5)}]}], experience: [...], awards: [...] }`. Icon values are Jerry's filenames without extension (e.g. `"js"`), `null` = text-only tag.

- [ ] **Step 1: Write `js/data.js`** — full content, no truncation:

```js
window.PORTFOLIO_DATA = {
  name: 'DAFFA ADIKA',
  fullName: 'Muhammad Daffa Adika Utama',
  role: 'Computer Engineering Student · Fullstack Developer',
  location: 'Bandung, West Java, Indonesia',
  status: 'Open to opportunities',
  bio: 'Computer Engineering student at Universitas Pendidikan Indonesia (UPI) focused on bridging advanced technology and social impact. I build fullstack web apps, mobile apps, and IoT systems.',
  education: { school: 'Universitas Pendidikan Indonesia (UPI)', program: 'Computer Engineering', detail: '3rd year (6th semester)' },
  socials: {
    email: 'daffadikau@gmail.com',
    github: 'https://github.com/Daffadikau',
    linkedin: 'https://www.linkedin.com/in/daffadikau/',
  },
  stats: [
    { number: '3rd Year', label: 'Current Education' },
    { number: '15+', label: 'Licenses & Certificates' },
    { number: '7', label: 'Awards' },
  ],
  projects: [
    {
      title: 'TestKit Gas Monitor',
      desc: 'Real-time IoT gas monitoring platform: sensor ingestion API, live dashboard with charts and alerting, time-series storage, Dockerized VPS deployment.',
      tech: [
        { label: 'FastAPI', icon: 'py' }, { label: 'Next.js', icon: 'next' },
        { label: 'TimescaleDB', icon: 'sql' }, { label: 'Docker', icon: 'docker' },
      ],
      links: [],
    },
    {
      title: 'BengkelBot',
      desc: 'AI chatbot for auto repair shops — answers service questions and guides bookings. Final project of the Hacktiv8 "Maju Bareng AI" program.',
      tech: [
        { label: 'Gemini API', icon: null }, { label: 'Node.js', icon: 'node' },
        { label: 'JavaScript', icon: 'js' },
      ],
      links: [{ label: 'GitHub', url: 'https://github.com/Daffadikau/bengkelbot' }],
    },
    {
      title: 'Mentorly',
      desc: 'Cross-platform mobile mentoring platform with 2FA, RBAC, AES-256 encryption, real-time chat, payments, and mentor ratings. Published in Jurnal Informatika Teknologi dan Sains.',
      tech: [
        { label: 'Flutter', icon: 'dart' }, { label: 'Firebase', icon: null },
        { label: 'PHP', icon: 'php' },
      ],
      links: [{ label: 'GitHub', url: 'https://github.com/Daffadikau' }],
    },
    {
      title: 'OMR Automated Grading',
      desc: 'AI answer-sheet grading with YOLOv11/YOLOv8 — 99.2% accuracy, hybrid cloud-mobile architecture, automated PDF/CSV analytics reports.',
      tech: [
        { label: 'YOLO', icon: null }, { label: 'Python', icon: 'py' },
        { label: 'Flutter', icon: 'dart' }, { label: 'Firebase', icon: null },
      ],
      links: [{ label: 'GitHub', url: 'https://github.com/Daffadikau' }],
    },
    {
      title: 'Kuai DryVault',
      desc: 'IoT shoe-drying cabinet: ESP32 driving 14 DC fans via 8-channel relays, Flutter app with Firebase realtime monitoring, 87.4W optimized power draw. Published in Jurnal Ilmiah Pendidikan.',
      tech: [
        { label: 'ESP32', icon: 'c' }, { label: 'IoT', icon: null },
        { label: 'Flutter', icon: 'dart' }, { label: 'Firebase', icon: null },
      ],
      links: [{ label: 'GitHub', url: 'https://github.com/Daffadikau' }],
    },
  ],
  skills: [
    { group: 'Languages', items: [
      { label: 'JavaScript', icon: 'js', level: 4 }, { label: 'TypeScript', icon: 'ts', level: 3 },
      { label: 'Python', icon: 'py', level: 4 }, { label: 'Java', icon: 'java', level: 3 },
      { label: 'Dart', icon: 'dart', level: 4 }, { label: 'PHP', icon: 'php', level: 3 },
    ]},
    { group: 'Frontend', items: [
      { label: 'HTML', icon: 'html', level: 5 }, { label: 'CSS', icon: 'css', level: 4 },
      { label: 'React', icon: 'jsx', level: 3 }, { label: 'Vue', icon: 'vue', level: 3 },
      { label: 'Next.js', icon: 'next', level: 3 }, { label: 'Flutter', icon: 'dart', level: 4 },
    ]},
    { group: 'Backend', items: [
      { label: 'Node.js', icon: 'node', level: 4 }, { label: 'FastAPI', icon: 'py', level: 4 },
      { label: 'REST & GraphQL', icon: 'gql', level: 4 }, { label: 'SQL & NoSQL', icon: 'sql', level: 4 },
      { label: 'Firebase', icon: null, level: 4 },
    ]},
    { group: 'DevOps & Tools', items: [
      { label: 'Git', icon: 'git', level: 4 }, { label: 'Docker', icon: 'docker', level: 4 },
      { label: 'CI/CD', icon: null, level: 3 }, { label: 'Linux/VPS', icon: 'shell', level: 4 },
    ]},
  ],
  experience: [
    {
      role: 'Service to Society Dept (P2M) Head of Staff', org: 'HIMA TEKKOM UPI',
      period: 'Jan 2025 — Jan 2026',
      points: [
        'Led community service initiatives for the Computer Engineering student association.',
        'Managed planning and execution of social impact programs.',
      ],
    },
    {
      role: 'Community Service Staff', org: 'Palang Merah Indonesia (KSR PMI UPI)',
      period: 'Sep 2024 — Jan 2026',
      points: [
        'Volunteered with the university humanitarian corps.',
        'Provided emergency medical support and community services.',
      ],
    },
  ],
  awards: [
    { title: 'Best Department of the Year 2025', org: 'HIMA TEKKOM UPI', when: 'Jan 2026' },
    { title: '2nd Place (Silver Medal), National Digital Learning Video Competition (LIDM 2025)', org: 'Ministry of Education', when: 'Dec 2025' },
    { title: '2nd Place, Mobile App UI/UX Design Challenge', org: 'HIMA TEKKOM UPI', when: 'Dec 2025' },
    { title: 'Staff of the Month', org: 'KSR PMI UPI', when: 'Jul 2025' },
  ],
};
```

- [ ] **Step 2: Verify shape with node**

```bash
node -e "global.window={};require('./js/data.js');const d=window.PORTFOLIO_DATA;
const a=(c,m)=>{if(!c){console.error('FAIL:',m);process.exit(1)}};
a(d.projects.length===5,'5 projects');a(d.skills.length===4,'4 skill groups');
a(d.projects.every(p=>p.tech.every(t=>'label'in t&&'icon'in t)),'tech tags shape');
a(d.skills.every(g=>g.items.every(i=>i.level>=1&&i.level<=5)),'levels 1-5');
console.log('data.js OK')"
```
Expected: `data.js OK`

- [ ] **Step 3: Commit** (pesan: data konten tunggal untuk tabs + terminal).

---

### Task 3: Pixel-art engine (`js/pixelart.js`)

**Files:**
- Create: `js/pixelart.js`

**Interfaces:**
- Produces: `window.PixelArt = { render(mapName, scale=1) → SVGElement, MAPS }`. Text-grid maps where each char indexes `PALETTE`; `.` = transparent. Maps required: `cat` (16-wide boot mascot), dock icons `about folder chip mail term github linkedin` (12×12 each). `render` touches `document` only when called, so the file is safe to `require` in node.

- [ ] **Step 1: Write `js/pixelart.js`** — renderer + all 8 maps:

```js
(function () {
  const PALETTE = {
    k: '#1a1a1a', w: '#ffffff', o: '#f0713d', y: '#f5d93d',
    g: '#9dc24c', e: '#e8e8e8', b: '#4a90d9', p: '#f2b5a0',
  };
  const MAPS = {
    cat: [
      '..k..........k..',
      '.kok........kok.',
      '.kook......kook.',
      '.koookkkkkkoook.',
      '.kppppppppppppk.',
      'kppppppppppppppk',
      'kpkkpppppppkkppk',
      'kpkwpppppppwkppk',
      'kppppppkkppppppk',
      'kpppppkppkpppppk',
      '.kpppppppppppk..',
      '.kppkkkkkkppk...',
      '..kppppppppk....',
      '...kkkkkkkk.....',
    ],
    about: [
      '.kkkkkkkkkk.',
      'keeeeeeeeeek',
      'keekeeeekeek',
      'keekeeeekeek',
      'keeeeeeeeeek',
      'kekeeeeeekek',
      'kekeeeeeekek',
      'keekkkkkkeek',
      'keeeeeeeeeek',
      'keeeeeeeeeek',
      '.kkkkkkkkkk.',
      '............',
    ],
    folder: [
      '............',
      'kkkkk.......',
      'kyyyykkkkkk.',
      'kyyyyyyyyyk.',
      'kkkkkkkkkkkk',
      'kyyyyyyyyyyk',
      'kyyyyyyyyyyk',
      'kyyyyyyyyyyk',
      'kyyyyyyyyyyk',
      'kyyyyyyyyyyk',
      'kkkkkkkkkkkk',
      '............',
    ],
    chip: [
      '..k..k..k...',
      '.kkkkkkkkk..',
      'kkgggggggkk.',
      '.kggkkkggk..',
      'kkgkgggkgkk.',
      '.kgkgggkgk..',
      'kkgkgggkgkk.',
      '.kggkkkggk..',
      'kkgggggggkk.',
      '.kkkkkkkkk..',
      '..k..k..k...',
      '............',
    ],
    mail: [
      '............',
      'kkkkkkkkkkkk',
      'kwwwwwwwwwwk',
      'kkwwwwwwwwkk',
      'kwkwwwwwwkwk',
      'kwwkwwwwkwwk',
      'kwwwkkkkwwwk',
      'kwwwwwwwwwwk',
      'kwwwwwwwwwwk',
      'kkkkkkkkkkkk',
      '............',
      '............',
    ],
    term: [
      'kkkkkkkkkkkk',
      'kkkkkkkkkkkk',
      'kgkkkkkkkkgk',
      'kkgkkkkkkkkk',
      'kkkgkkkkkkkk',
      'kkgkkkkkkkkk',
      'kgkkkkkkkkgk',
      'kkkkkggggkkk',
      'kkkkkkkkkkkk',
      'kkkkkkkkkkkk',
      '............',
      '............',
    ],
    github: [
      '...kkkkkk...',
      '..kkkkkkkk..',
      '.kkwkkkkwkk.',
      '.kkkkkkkkkk.',
      '.kkkkkkkkkk.',
      '.kkkkkkkkkk.',
      '..kkkkkkkk..',
      '..kk.kk.kk..',
      '.kkk.kk.kkk.',
      '..k......k..',
      '............',
      '............',
    ],
    linkedin: [
      'kkkkkkkkkkkk',
      'kbbbbbbbbbbk',
      'kbwbbbbbbbbk',
      'kbbbbwbbwbbk',
      'kbwbbwbbbwbk',
      'kbwbbwbbbwbk',
      'kbwbbwbbbwbk',
      'kbwbbwbbbwbk',
      'kbbbbbbbbbbk',
      'kkkkkkkkkkkk',
      '............',
      '............',
    ],
  };
  function render(name, scale = 1) {
    const map = MAPS[name];
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    const h = map.length, w = map[0].length;
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.setAttribute('width', w * scale);
    svg.setAttribute('height', h * scale);
    svg.setAttribute('shape-rendering', 'crispEdges');
    svg.setAttribute('aria-hidden', 'true');
    map.forEach((row, y) => {
      [...row].forEach((ch, x) => {
        if (ch === '.') return;
        const r = document.createElementNS(NS, 'rect');
        r.setAttribute('x', x); r.setAttribute('y', y);
        r.setAttribute('width', 1); r.setAttribute('height', 1);
        r.setAttribute('fill', PALETTE[ch] || '#000');
        svg.appendChild(r);
      });
    });
    return svg;
  }
  window.PixelArt = { render, MAPS };
})();
```

- [ ] **Step 2: Verify maps are rectangular with node** (plain `require`; `render` is never called so `document` is never touched)

```bash
node -e "global.window={};require('./js/pixelart.js');
const M=window.PixelArt.MAPS;
for(const[n,m]of Object.entries(M)){const w=m[0].length;
if(!m.every(r=>r.length===w)){console.error('FAIL: ragged map',n);process.exit(1)}}
console.log('pixelart maps OK:',Object.keys(M).join(' '))"
```
Expected: `pixelart maps OK: cat about folder chip mail term github linkedin`

- [ ] **Step 3: Visual check** — in browser console: `document.getElementById('scene').append(PixelArt.render('cat', 8))` → cat renders crisply; then remove the node. Iterate on map grids until each icon reads clearly at 24 px (this is art — expect 1-2 rounds of pixel pushing).

- [ ] **Step 4: Commit** (pesan: engine pixel art + maskot kucing + 7 ikon dock).

---

### Task 4: Window, tab bar, hash routing

**Files:**
- Create: `styles/window.css`
- Create: `js/app.js`

**Interfaces:**
- Consumes: nothing yet (window title hardcoded).
- Produces: `window.App = { showTab(id), TABS }`; `TABS = ['about','projects','skills','contact','terminal']`. Window DOM: `#window > .titlebar (.traffic-lights + .win-title) + .tabbar[role=tablist] > button.tab[role=tab] + .tabpanels > section.panel[role=tabpanel]#panel-<id>`. Custom event `tabshown` (detail `{id}`) fires on every switch. Hash `#<id>` ↔ active tab, unknown hash → `about`. Keyboard: ←/→ cycles, 1–5 jumps. Shared helper `el` (see header) defined at top of the IIFE.

- [ ] **Step 1: Write `styles/window.css`** — complete file:

```css
#window {
  width: min(900px, 96vw);
  height: min(78vh, 640px);
  background: var(--win);
  border: 3px solid var(--ink);
  box-shadow: 6px 6px 0 rgba(26,26,26,.45);
  display: flex; flex-direction: column;
  font-family: var(--font-mono);
}
.titlebar {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 10px;
  border-bottom: 3px solid var(--ink);
  background: repeating-linear-gradient(180deg, var(--win) 0 3px, var(--win-dark) 3px 6px);
}
.traffic-lights { display: flex; gap: 6px; }
.traffic-lights button {
  width: 14px; height: 14px; border: 2px solid var(--ink);
  padding: 0; background: var(--tl-red);
}
.traffic-lights .tl-yellow { background: var(--tl-yellow); }
.traffic-lights .tl-green { background: var(--tl-green); }
.win-title {
  font-family: var(--font-pixel); font-size: 14px;
  background: var(--win); padding: 0 10px;
}
.tabbar { display: flex; border-bottom: 3px solid var(--ink); background: var(--win-dark); }
.tab {
  font-family: var(--font-pixel); font-size: 13px;
  padding: 8px 14px; border: 0; border-right: 3px solid var(--ink);
  background: var(--win-dark); color: var(--ink);
}
.tab[aria-selected="true"] { background: var(--win); font-weight: 700; }
.tabpanels { flex: 1; overflow-y: auto; background: var(--win); }
.panel { padding: 20px 24px; }
.panel[hidden] { display: none; }
#window.maximized { width: 96vw; height: calc(100vh - 140px); }
#window.minimized { display: none; }
@keyframes winshake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
#window.shake { animation: winshake .3s steps(2) 2; }
```

- [ ] **Step 2: Write `js/app.js`** — helper + chrome + routing (DOM API only):

```js
(function () {
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };
  const TABS = ['about', 'projects', 'skills', 'contact', 'terminal'];
  const LABELS = { about: 'About', projects: 'Projects', skills: 'Skills', contact: 'Contact', terminal: '>_ Terminal' };
  const win = document.getElementById('window');

  // chrome
  const titlebar = el('div', 'titlebar');
  const lights = el('div', 'traffic-lights');
  [['tl-red', 'Close (just kidding)'], ['tl-yellow', 'Minimize window'], ['tl-green', 'Maximize window']]
    .forEach(([cls, label]) => {
      const b = el('button', cls);
      b.setAttribute('aria-label', label);
      lights.appendChild(b);
    });
  titlebar.append(lights, el('span', 'win-title', 'daffa.dev'));
  const tabbar = el('div', 'tabbar');
  tabbar.setAttribute('role', 'tablist');
  tabbar.setAttribute('aria-label', 'Sections');
  const panels = el('div', 'tabpanels');
  win.append(titlebar, tabbar, panels);

  TABS.forEach((id) => {
    const b = el('button', 'tab', LABELS[id]);
    b.id = `tab-${id}`;
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-controls', `panel-${id}`);
    b.addEventListener('click', () => { location.hash = id; });
    tabbar.appendChild(b);
    const p = el('section', 'panel');
    p.id = `panel-${id}`;
    p.setAttribute('role', 'tabpanel');
    p.setAttribute('aria-labelledby', `tab-${id}`);
    p.hidden = true;
    panels.appendChild(p);
  });

  function showTab(id) {
    if (!TABS.includes(id)) id = 'about';
    TABS.forEach((t) => {
      const tab = document.getElementById(`tab-${t}`);
      const panel = document.getElementById(`panel-${t}`);
      const active = t === id;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      panel.hidden = !active;
    });
    document.dispatchEvent(new CustomEvent('tabshown', { detail: { id } }));
  }
  function fromHash() { showTab(location.hash.replace('#', '') || 'about'); }
  window.addEventListener('hashchange', fromHash);

  tabbar.addEventListener('keydown', (e) => {
    const cur = TABS.indexOf(location.hash.replace('#', '') || 'about');
    if (e.key === 'ArrowRight') location.hash = TABS[(cur + 1) % TABS.length];
    if (e.key === 'ArrowLeft') location.hash = TABS[(cur - 1 + TABS.length) % TABS.length];
  });
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    const n = Number(e.key);
    if (n >= 1 && n <= TABS.length) location.hash = TABS[n - 1];
  });

  window.App = { showTab, TABS };
  fromHash();
})();
```

- [ ] **Step 3: Verify in browser** — tabs render, click switches panel + updates hash, back button works, `#bogus` falls back to About, arrow keys + number keys switch tabs.

- [ ] **Step 4: Commit** (pesan: window System 7 + tab bar + routing hash + keyboard nav).

---

### Task 5: Section contents + tech icons

**Files:**
- Create: `styles/sections.css`
- Create: `assets/icons/tech/*.svg` + `assets/icons/tech/LICENSE-MIT.txt`
- Modify: `js/app.js` (add render functions inside the IIFE, called before `fromHash()`)

**Interfaces:**
- Consumes: `PORTFOLIO_DATA`, `PixelArt.render('cat')`, panels `#panel-about|projects|skills|contact`, helper `el`.
- Produces: filled panels; helper `techTag({label, icon})` → `<span class="tag">` reused by Projects and Skills.

- [ ] **Step 1: Download Jerry's icons (MIT) + write attribution**

```bash
mkdir -p assets/icons/tech
for i in js ts py java dart php html css jsx vue next node sql gql git docker shell c; do
  curl -sf "https://raw.githubusercontent.com/wolfsouldev/jerrys-pixel-icons/main/icons/files/$i.svg" \
    -o "assets/icons/tech/$i.svg" || echo "MISSING: $i";
done
curl -sf "https://raw.githubusercontent.com/wolfsouldev/jerrys-pixel-icons/main/LICENSE" -o assets/icons/tech/LICENSE-MIT.txt
printf '\n---\nIcons from "Jerry'"'"'s Pixel Icons" (github.com/wolfsouldev/jerrys-pixel-icons), MIT License.\n' >> assets/icons/tech/LICENSE-MIT.txt
```
Expected: no `MISSING:` lines (if an icon 404s, set that entry `icon: null` in data.js instead).

- [ ] **Step 2: Add render code to `js/app.js`** (inside IIFE, before `window.App = ...`; all via `el`/`append`, zero innerHTML):

```js
  const D = window.PORTFOLIO_DATA;
  function techTag(t) {
    const s = el('span', 'tag');
    if (t.icon) {
      const img = el('img');
      img.src = `assets/icons/tech/${t.icon}.svg`;
      img.alt = ''; img.width = 16; img.height = 16;
      s.appendChild(img);
    }
    s.appendChild(document.createTextNode(t.label));
    return s;
  }
  function extLink(cls, label, url) {
    const a = el('a', cls, label);
    a.href = url; a.target = '_blank'; a.rel = 'noreferrer';
    return a;
  }
  (function renderAbout() {
    const p = document.getElementById('panel-about');
    const hero = el('div', 'hero');
    const art = el('div', 'hero-art');
    art.appendChild(window.PixelArt.render('cat', 6));
    const head = el('div');
    head.append(el('h1', 'display', D.name), el('p', 'role', D.role));
    const status = el('p', 'status');
    status.append(el('span', 'dot'), document.createTextNode(D.status));
    head.appendChild(status);
    hero.append(art, head);
    const stats = el('div', 'stats');
    D.stats.forEach((s) => {
      const d = el('div', 'stat');
      d.append(el('b', null, s.number), el('span', null, s.label));
      stats.appendChild(d);
    });
    p.append(hero, el('p', 'bio', D.bio), stats,
      el('h2', null, 'Education'),
      el('p', null, `${D.education.program} — ${D.education.school}, ${D.education.detail}`),
      el('h2', null, 'Experience'));
    D.experience.forEach((x) => {
      const d = el('div', 'xp');
      d.append(el('h3', null, `${x.role} · ${x.org}`), el('span', 'period', x.period));
      const ul = el('ul');
      x.points.forEach((pt) => ul.appendChild(el('li', null, pt)));
      d.appendChild(ul);
      p.appendChild(d);
    });
    p.appendChild(el('h2', null, 'Honors & Awards'));
    const ul = el('ul', 'awards');
    D.awards.forEach((a) => {
      const li = el('li');
      li.append(el('b', null, a.title), document.createTextNode(` — ${a.org} `), el('span', 'period', a.when));
      ul.appendChild(li);
    });
    p.appendChild(ul);
  })();
  (function renderProjects() {
    const p = document.getElementById('panel-projects');
    D.projects.forEach((pr) => {
      const card = el('article', 'miniwin');
      const bar = el('div', 'miniwin-bar');
      const dots = el('span', 'mw-dots');
      dots.append(el('i'), el('i'), el('i'));
      bar.append(dots, el('span', null, pr.title));
      const body = el('div', 'miniwin-body');
      body.appendChild(el('p', null, pr.desc));
      const tags = el('div', 'tags');
      pr.tech.forEach((t) => tags.appendChild(techTag(t)));
      body.appendChild(tags);
      if (pr.links.length) {
        const links = el('p', 'links');
        pr.links.forEach((l) => links.appendChild(extLink('pxbtn', l.label, l.url)));
        body.appendChild(links);
      }
      card.append(bar, body);
      p.appendChild(card);
    });
  })();
  (function renderSkills() {
    const p = document.getElementById('panel-skills');
    D.skills.forEach((g) => {
      p.appendChild(el('h2', null, g.group));
      const wrap = el('div', 'skillgrid');
      g.items.forEach((s) => {
        const row = el('div', 'skill');
        row.appendChild(techTag(s));
        const bar = el('div', 'bar');
        for (let i = 1; i <= 5; i += 1) bar.appendChild(el('i', i <= s.level ? 'on' : null));
        row.appendChild(bar);
        wrap.appendChild(row);
      });
      p.appendChild(wrap);
    });
  })();
  (function renderContact() {
    const p = document.getElementById('panel-contact');
    const h = el('h1', 'display', "LET'S CONNECT");
    h.style.fontSize = '28px';
    const btns = el('div', 'contact-btns');
    const mail = el('a', 'pxbtn big', '✉ Email me');
    mail.href = `mailto:${D.socials.email}`;
    btns.append(mail,
      extLink('pxbtn big', 'GitHub', D.socials.github),
      extLink('pxbtn big', 'LinkedIn', D.socials.linkedin));
    p.append(h,
      el('p', 'bio', 'Open to internships, freelance, and collaboration. I usually reply within 24–48 hours.'),
      btns,
      el('p', 'fineprint', "© 2026 Daffa Adika · tech icons: Jerry's Pixel Icons (MIT)"));
  })();
```

- [ ] **Step 3: Write `styles/sections.css`** — complete file:

```css
.display { font-family: var(--font-pixel); font-weight: 700; font-size: clamp(28px, 5vw, 44px); letter-spacing: 1px; }
.hero { display: flex; gap: 20px; align-items: center; margin-bottom: 14px; }
.hero-art svg { image-rendering: pixelated; }
.role { font-size: 14px; margin-top: 4px; }
.status { font-family: var(--font-pixel); font-size: 12px; margin-top: 6px; }
.status .dot { display: inline-block; width: 8px; height: 8px; background: var(--tl-green); border: 2px solid var(--ink); margin-right: 6px; }
.bio { max-width: 60ch; margin: 10px 0 16px; line-height: 1.6; font-size: 14px; }
.stats { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 18px; }
.stat { border: 3px solid var(--ink); padding: 8px 12px; background: #fff; }
.stat b { font-family: var(--font-pixel); display: block; }
.stat span { font-size: 12px; }
.panel h2 { font-family: var(--font-pixel); font-size: 16px; margin: 18px 0 8px; border-bottom: 3px solid var(--ink); padding-bottom: 4px; }
.xp h3 { font-size: 14px; }
.xp ul { margin: 6px 0 12px 18px; font-size: 13px; line-height: 1.6; }
.period { font-size: 12px; opacity: .7; }
.awards { margin-left: 18px; font-size: 13px; line-height: 1.8; }
.miniwin { border: 3px solid var(--ink); background: #fff; margin-bottom: 16px; box-shadow: 4px 4px 0 rgba(26,26,26,.3); }
.miniwin-bar { display: flex; align-items: center; gap: 8px; padding: 5px 8px; border-bottom: 3px solid var(--ink); background: var(--win-dark); font-family: var(--font-pixel); font-size: 12px; }
.mw-dots i { display: inline-block; width: 8px; height: 8px; border: 2px solid var(--ink); margin-right: 3px; background: var(--tl-red); }
.mw-dots i:nth-child(2) { background: var(--tl-yellow); }
.mw-dots i:nth-child(3) { background: var(--tl-green); }
.miniwin-body { padding: 12px; font-size: 13px; line-height: 1.6; }
.tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.tag { display: inline-flex; align-items: center; gap: 5px; border: 2px solid var(--ink); padding: 2px 8px; font-size: 12px; background: var(--win); }
.tag img { image-rendering: pixelated; }
.links { margin-top: 10px; }
.pxbtn { display: inline-block; font-family: var(--font-pixel); font-size: 12px; color: var(--ink); text-decoration: none; border: 3px solid var(--ink); background: var(--tl-yellow); padding: 4px 10px; box-shadow: 3px 3px 0 var(--ink); margin-right: 8px; }
.pxbtn:active { transform: translate(3px, 3px); box-shadow: none; }
.pxbtn.big { font-size: 14px; padding: 10px 16px; margin-bottom: 8px; }
.skillgrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 8px 20px; }
.skill { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.bar { display: flex; gap: 3px; }
.bar i { width: 14px; height: 14px; border: 2px solid var(--ink); background: #fff; }
.bar i.on { background: var(--tl-green); }
.contact-btns { display: flex; flex-wrap: wrap; gap: 10px; margin: 16px 0 24px; }
.fineprint { font-size: 11px; opacity: .6; margin-top: 30px; }
```

- [ ] **Step 4: Verify in browser** — all four tabs show real content; icons load (no broken images); Projects cards look like mini windows; skill bars show correct levels. **Font legibility check (spec criterion):** body ≥ 14 px readable, headings clearly pixel — if Silkscreen fails at display size, swap heading font to 'Press Start 2P' (add to the Google Fonts URL) and decide here, not later.

- [ ] **Step 5: Commit** (pesan: konten 4 tab dari data.js + ikon tech MIT + atribusi).

---

### Task 6: Terminal tab

**Files:**
- Create: `js/terminal.js`
- Create: `styles/terminal.css`

**Interfaces:**
- Consumes: `PORTFOLIO_DATA`, `#panel-terminal`, event `tabshown`.
- Produces: `window.TerminalEngine = { createCommands(data) }` where `createCommands` returns `{commandName: () => string}` (pure, node-testable). DOM part: builds history list + input row inside `#panel-terminal` on first `tabshown` with `id === 'terminal'`; focuses input each time the tab opens. Engine behavior ported from the local uncommitted experiment (history array, ↑/↓ command history, URL/email autolinking, `clear`, unknown-command message, welcome ASCII banner "DAFFA") — with its `historyContainer.innerHTML = ''` reset replaced by `historyContainer.replaceChildren()` and the `<template>` replaced by building rows with `createElement`.

- [ ] **Step 1: Write `js/terminal.js`** — pure command map + DOM wiring:

```js
(function () {
  function createCommands(D) {
    const line = (s) => s.join('\n');
    return {
      help: () => line([
        '[AVAILABLE COMMANDS]', '',
        'about       who am I',
        'projects    project portfolio',
        'skills      technical skills',
        'experience  roles & orgs',
        'education   academic background',
        'contact     how to reach me',
        'neofetch    system info',
        'clear       clear screen',
      ]),
      about: () => line([
        `Name: ${D.fullName}`,
        `Role: ${D.role}`,
        `Location: ${D.location}`,
        `Status: ${D.status}!`, '',
        D.bio,
      ]),
      projects: () => line(D.projects.flatMap((p, i) => [
        `${i + 1}. ${p.title}`,
        `   ${p.desc}`,
        `   Tech: ${p.tech.map((t) => t.label).join(', ')}`,
        ...p.links.map((l) => `   ${l.label}: ${l.url}`),
        '',
      ])),
      skills: () => line(D.skills.flatMap((g) => [
        `[${g.group}]`,
        ...g.items.map((s) => `  ${s.label.padEnd(16)} ${'█'.repeat(s.level * 4).padEnd(20, '░')}`),
        '',
      ])),
      experience: () => line(D.experience.flatMap((x) => [
        `${x.period} | ${x.role}`,
        x.org,
        ...x.points.map((p) => `• ${p}`),
        '',
      ])),
      education: () => line([
        D.education.program,
        `${D.education.school} — ${D.education.detail}`, '',
        '[Honors & Awards]',
        ...D.awards.map((a) => `• ${a.title} (${a.when})`),
      ]),
      contact: () => line([
        `Email:    ${D.socials.email}`,
        `GitHub:   ${D.socials.github}`,
        `LinkedIn: ${D.socials.linkedin}`, '',
        'Usually replies within 24-48 hours.',
      ]),
      neofetch: () => line([
        ' /\\_/\\      daffa@portfolio',
        '( o.o )     ---------------',
        ' > ^ <      OS: daffaOS 2.0 (pixel)',
        `            Host: ${D.location}`,
        '            Shell: zsh + oh-my-zsh',
        '            Uptime: since 2003',
        `            Status: ${D.status}`,
      ]),
      'sudo hire-me': () => line([
        '[sudo] password for visitor: ********',
        'Permission granted. Initiating handshake...',
        `Send offer letters to ${D.socials.email} :)`,
      ]),
    };
  }
  window.TerminalEngine = { createCommands };
  if (typeof document === 'undefined') return; // node test env
  let built = false;
  document.addEventListener('tabshown', (e) => {
    if (e.detail.id !== 'terminal') return;
    const panel = document.getElementById('panel-terminal');
    if (!built) { build(panel); built = true; }
    const input = panel.querySelector('input');
    if (input) input.focus();
  });
  function build(panel) {
    // Mechanical port of the uncommitted experiment's engine (renderOutput,
    // renderHistory, executeCommand, setInputFromHistory) with these changes:
    // 1. commands = createCommands(window.PORTFOLIO_DATA)
    // 2. prompt text: 'daffa@portfolio:~$'
    // 3. multi-word routing: match full trimmed lowercased input against the
    //    command map FIRST (catches 'sudo hire-me'), then first word, else unknown.
    // 4. 'clear' empties the history array and re-renders.
    // 5. history reset uses historyContainer.replaceChildren() (no innerHTML);
    //    entry rows are built with createElement instead of a <template>.
    // 6. welcome banner ASCII 'DAFFA' pushed as first history entry.
    // renderOutput keeps the experiment's URL/email autolinking (split on regex,
    // build <a> via createElement + textContent).
  }
})();
```
**Note:** the `build()` body is a port of `script.js` from the user's uncommitted experiment (source already reviewed in the user's checkout at `~/Downloads/Portofolio/script.js`); the six changes above are exhaustive.

- [ ] **Step 2: Node-test the pure commands**

```bash
node -e "global.window={};require('./js/data.js');require('./js/terminal.js');
const c=window.TerminalEngine.createCommands(window.PORTFOLIO_DATA);
const a=(x,m)=>{if(!x){console.error('FAIL:',m);process.exit(1)}};
a(c.projects().includes('TestKit Gas Monitor'),'projects lists TestKit');
a(c.contact().includes('daffadikau@gmail.com'),'contact email');
a(c.neofetch().includes('daffa@portfolio'),'neofetch');
a(c['sudo hire-me']().includes('offer'),'sudo hire-me');
console.log('terminal commands OK')"
```
Expected: `terminal commands OK`

- [ ] **Step 3: Write `styles/terminal.css`**

```css
#panel-terminal { background: #141414; color: #33ff66; font-family: var(--font-term); font-size: 18px; line-height: 1.35; }
#panel-terminal a { color: #7ddc9a; }
#panel-terminal .prompt { color: #f5d93d; margin-right: 8px; white-space: nowrap; }
#panel-terminal .entry-output { white-space: pre-wrap; font-family: inherit; margin: 2px 0 10px; }
#panel-terminal .current-input { display: flex; align-items: baseline; }
#panel-terminal input {
  flex: 1; background: transparent; border: 0; outline: none;
  color: inherit; font: inherit; caret-color: #33ff66;
}
```

- [ ] **Step 4: Verify in browser** — open `#terminal`: banner shows, `help` / `projects` / `neofetch` / `sudo hire-me` / unknown command / `clear` / ↑↓ history all behave; URLs and email rendered as links; input regains focus when returning to the tab.

- [ ] **Step 5: Commit** (pesan: tab terminal interaktif — engine eksperimen + data asli + easter eggs).

---

### Task 7: Dock

**Files:**
- Create: `styles/dock.css`
- Modify: `js/app.js` (build dock inside IIFE after render functions)

**Interfaces:**
- Consumes: `PixelArt.render`, `D.socials`, event `tabshown`, helper `el`.
- Produces: `#dock` filled: 5 tab buttons (maps `about folder chip mail term`, `data-tab` attr), `.dock-sep`, 2 external links (maps `github linkedin`). Active tab button gets `.active`.

- [ ] **Step 1: Dock builder in `js/app.js`**

```js
  (function buildDock() {
    const dock = document.getElementById('dock');
    const items = [
      { map: 'about', tab: 'about', label: 'About' },
      { map: 'folder', tab: 'projects', label: 'Projects' },
      { map: 'chip', tab: 'skills', label: 'Skills' },
      { map: 'mail', tab: 'contact', label: 'Contact' },
      { map: 'term', tab: 'terminal', label: 'Terminal' },
      { sep: true },
      { map: 'github', url: D.socials.github, label: 'GitHub' },
      { map: 'linkedin', url: D.socials.linkedin, label: 'LinkedIn' },
    ];
    items.forEach((it) => {
      if (it.sep) { dock.appendChild(el('span', 'dock-sep')); return; }
      const btn = el(it.url ? 'a' : 'button', 'dock-item');
      btn.setAttribute('aria-label', it.label);
      btn.title = it.label;
      if (it.url) { btn.href = it.url; btn.target = '_blank'; btn.rel = 'noreferrer'; }
      else { btn.dataset.tab = it.tab; btn.addEventListener('click', () => { location.hash = it.tab; }); }
      btn.appendChild(window.PixelArt.render(it.map, 2));
      dock.appendChild(btn);
    });
    document.addEventListener('tabshown', (e) => {
      dock.querySelectorAll('.dock-item[data-tab]').forEach((b) =>
        b.classList.toggle('active', b.dataset.tab === e.detail.id));
    });
  })();
```

- [ ] **Step 2: Write `styles/dock.css`**

```css
#dock {
  display: flex; align-items: flex-end; gap: 10px;
  border: 3px solid var(--ink); background: rgba(232,232,232,.85);
  padding: 8px 14px 10px; box-shadow: 4px 4px 0 rgba(26,26,26,.45);
}
.dock-item {
  position: relative; display: grid; place-items: center;
  width: 44px; height: 44px; border: 0; background: none; padding: 0;
}
.dock-item svg { image-rendering: pixelated; }
@keyframes dockbounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
.dock-item:hover, .dock-item:focus-visible { animation: dockbounce .4s steps(3) 1; }
.dock-item.active::after {
  content: ''; position: absolute; bottom: -7px; width: 6px; height: 6px; background: var(--ink);
}
.dock-sep { width: 3px; align-self: stretch; background: var(--ink); }
```

- [ ] **Step 3: Verify** — dock renders 7 icons + separator, hover bounces steppily, click switches tab, dot follows active tab, external links open new tab.

- [ ] **Step 4: Commit** (pesan: dock pixel custom + navigasi + link eksternal).

---

### Task 8: Traffic lights (shake / minimize / maximize)

**Files:**
- Modify: `js/app.js`
- Modify: `styles/window.css` (append toast + dim styles)

**Interfaces:**
- Consumes: `.tl-red/.tl-yellow/.tl-green`, `#window`, `#dock`, helper `el`.
- Produces: red → `.shake` replay + toast "nice try 😏" (auto-hide 1.8 s); yellow → `#window.minimized` + `#dock.holds-window`; green → toggle `#window.maximized`. Hashchange or dock-tab click restores minimized state.

- [ ] **Step 1: Handlers in `js/app.js`**

```js
  (function trafficLights() {
    const toast = el('div', 'toast');
    toast.hidden = true;
    document.body.appendChild(toast);
    let toastTimer;
    win.querySelector('.tl-red').addEventListener('click', () => {
      win.classList.remove('shake'); void win.offsetWidth; win.classList.add('shake');
      toast.textContent = 'nice try 😏'; toast.hidden = false;
      clearTimeout(toastTimer); toastTimer = setTimeout(() => { toast.hidden = true; }, 1800);
    });
    win.querySelector('.tl-yellow').addEventListener('click', () => {
      win.classList.add('minimized');
      document.getElementById('dock').classList.add('holds-window');
    });
    win.querySelector('.tl-green').addEventListener('click', () => win.classList.toggle('maximized'));
    function restore() {
      win.classList.remove('minimized');
      document.getElementById('dock').classList.remove('holds-window');
    }
    window.addEventListener('hashchange', restore);
    document.getElementById('dock').addEventListener('click', (e) => {
      if (e.target.closest('[data-tab]')) restore();
    });
  })();
```

- [ ] **Step 2: Append toast + indicator styles to `styles/window.css`**

```css
.toast {
  position: fixed; top: 24px; left: 50%; transform: translateX(-50%);
  font-family: var(--font-pixel); font-size: 13px;
  background: var(--ink); color: var(--win); padding: 8px 14px;
  border: 3px solid var(--win); box-shadow: 4px 4px 0 rgba(0,0,0,.4); z-index: 30;
}
#dock.holds-window .dock-item.active svg { opacity: .5; }
```

- [ ] **Step 3: Verify** — red shakes + toast appears then disappears (repeat click restarts); yellow hides window + dims dock icon, dock tab click or hash change restores; green toggles near-fullscreen and back.

- [ ] **Step 4: Commit** (pesan: traffic lights fungsional — shake/minimize/maximize + toast).

---

### Task 9: Boot screen

**Files:**
- Modify: `js/app.js` (boot IIFE at very top, before window build)
- Modify: `styles/base.css` (append boot styles)

**Interfaces:**
- Consumes: `#boot`, `PixelArt.render('cat')`, `sessionStorage` key `booted`, helper `el`.
- Produces: first visit per session: dark overlay → cat + "daffa.dev OS" + 6-segment progress bar filling over ~1.4 s → overlay removed. Click or keypress skips. Reduced motion or repeat visit → no boot.

- [ ] **Step 1: Boot logic**

```js
  (function boot() {
    const bootEl = document.getElementById('boot');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || sessionStorage.getItem('booted')) { bootEl.remove(); return; }
    sessionStorage.setItem('booted', '1');
    bootEl.hidden = false;
    const inner = el('div', 'boot-inner');
    const cat = el('div', 'boot-cat');
    cat.appendChild(window.PixelArt.render('cat', 5));
    const bar = el('div', 'boot-bar');
    for (let i = 0; i < 6; i += 1) bar.appendChild(el('i'));
    inner.append(cat, el('p', 'boot-title', 'daffa.dev OS'), bar);
    bootEl.appendChild(inner);
    let step = 0;
    const t = setInterval(() => {
      bar.children[step].className = 'on'; step += 1;
      if (step === 6) { clearInterval(t); setTimeout(done, 220); }
    }, 200);
    function done() { clearInterval(t); bootEl.remove(); }
    bootEl.addEventListener('click', done);
    document.addEventListener('keydown', done, { once: true });
  })();
```
(`pixelart.js` loads before `app.js` per index.html script order, so `PixelArt` is available.)

- [ ] **Step 2: Boot styles (append to `styles/base.css`)**

```css
#boot { position: fixed; inset: 0; z-index: 50; background: #141414; display: grid; place-items: center; }
.boot-inner { text-align: center; }
.boot-cat svg { image-rendering: pixelated; }
.boot-title { font-family: var(--font-pixel); color: var(--win); margin: 14px 0; }
.boot-bar { display: inline-flex; gap: 4px; border: 3px solid var(--win); padding: 4px; }
.boot-bar i { display: inline-block; width: 16px; height: 12px; background: transparent; }
.boot-bar i.on { background: var(--tl-green); }
```

- [ ] **Step 3: Verify** — hard reload with cleared sessionStorage: boot plays ±1.4 s then reveals scene; reload again: no boot; click during boot skips; DevTools reduced-motion emulation: no boot.

- [ ] **Step 4: Commit** (pesan: boot screen kucing pixel + skip + reduced-motion).

---

### Task 10: Responsive, meta, cleanup, full verification, PR

**Files:**
- Modify: `styles/window.css`, `styles/dock.css` (media queries)
- Modify: `index.html` (favicon + OG meta)
- Create: `assets/favicon.png`, `assets/og.png`
- Delete: `styles.css`, `script.js` (old site)
- Modify: `README.md`

- [ ] **Step 1: Responsive rules** — append to `window.css`:

```css
@media (max-width: 640px) {
  #window { width: 96vw; height: min(84vh, calc(100vh - 120px)); }
  .tab { font-size: 11px; padding: 8px 10px; }
  .panel { padding: 14px; }
  .hero { flex-direction: column; align-items: flex-start; }
}
```
and to `dock.css`:

```css
@media (max-width: 640px) {
  #dock { gap: 6px; padding: 6px 10px 8px; }
}
```
Verify at 375 / 768 / 1440 px: no page-level horizontal scroll, dock touch targets ≥ 44 px, tab bar fits.

- [ ] **Step 2: Favicon + OG image** — screenshot the boot cat (zoom region) → crop/save as `assets/favicon.png` (32×32) and full scene at desktop width → `assets/og.png` (1200×630). Add to `<head>`:

```html
<link rel="icon" type="image/png" href="assets/favicon.png" />
<meta property="og:title" content="Daffa Adika — Portfolio" />
<meta property="og:description" content="Pixel macOS portfolio — projects, skills & an interactive terminal." />
<meta property="og:image" content="https://daffadikau.github.io/portofolio/assets/og.png" />
<meta name="twitter:card" content="summary_large_image" />
```
(OG image URL must be absolute — the one exception to the relative-paths constraint.)

- [ ] **Step 3: Delete old files + README**

```bash
git rm styles.css script.js
```
Rewrite `README.md`: project description (pixel macOS portfolio), stack (vanilla, no build), credits (Jerry's Pixel Icons MIT; design inspired by Gideon Low's 2024 portfolio shot), local dev command.

- [ ] **Step 4: Full manual checklist** (desktop + mobile emulation): boot → all 5 tabs → keyboard nav (arrows, 1–5) → terminal commands → dock nav + external links → traffic lights (red/yellow/green) → minimize/restore → maximize → deep-link `#projects` → back button → `#bogus` fallback → reduced-motion run.

- [ ] **Step 5: Lighthouse** — Chrome DevTools audit; targets: accessibility ≥ 90, performance ≥ 90. Fix flagged issues (likely candidates: `.period` contrast, missing button labels).

- [ ] **Step 6: Security scan + push + draft PR**

```bash
gitleaks detect --source . --no-banner
git push -u origin worktree-pixel-macos-redesign
gh pr create --draft --title "Redesign: pixel macOS window portfolio" --body "<ringkasan>"
```
PR body: ringkasan konsep + referensi, screenshot, checklist verifikasi, credit MIT, dan **catatan review untuk Dikau: konfirmasi copy project TestKit Gas Monitor (jangan ekspos detail klien/BRIN yang tidak perlu) sebelum merge**. Dikau yang merge → GitHub Pages deploy dari `main`.

---

## Self-Review Notes

- **Spec coverage:** boot ✓(T9); bg/window/tabs/routing/cursor ✓(T1,T4); konten + ikon MIT + atribusi ✓(T2,T5); terminal + easter eggs ✓(T6); dock ✓(T7); traffic lights ✓(T8); responsive/meta/noscript/cleanup/Lighthouse/PR ✓(T1 noscript, T10). Fallback ikon (`icon: null` → text tag) ✓(T5). Fallback font (`monospace` stack) ✓(T1 tokens).
- **Font swap criterion:** diputuskan di T5 Step 4, tidak ditunda lebih jauh.
- **Type consistency:** `PORTFOLIO_DATA` shape (T2) = usage T5/T6; `PixelArt.render(name, scale)` (T3) = calls T5/T7/T9; event `tabshown` (T4) = consumers T6/T7; helper `el` didefinisikan T4 sebelum dipakai T5/T7/T8/T9 (semua dalam satu IIFE `app.js`, urutan append sesuai nomor task).
- **No innerHTML:** semua DOM via createElement/textContent/append/replaceChildren, termasuk port terminal (perubahan #5 di T6).
- **Known intentional deviation:** `terminal.js` `build()` diberi instruksi port-verbatim dari eksperimen dengan 6 perubahan eksplisit (sumber sudah direview di checkout user) — bukan placeholder kosong.
