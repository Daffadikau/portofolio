# daffa.dev OS — Pixel macOS Portfolio

Personal portfolio of **Daffa Adika**, redesigned as a pixel-art classic
Macintosh scene: one System 7-style window with tab navigation, a pixel dock,
a boot screen with a cat mascot, and a fully interactive terminal tab
(try `neofetch` or `sudo hire-me`).

**Live:** https://daffadikau.github.io/portofolio/

## Stack

Vanilla HTML/CSS/JS — no framework, no build step. Google Fonts
(Silkscreen, VT323, JetBrains Mono) is the only runtime dependency.

- `js/data.js` — single source of truth for all content; both the visual
  tabs and the terminal render from it
- `js/pixelart.js` — renders custom pixel art (dock icons, cat mascot)
  from text grids into inline SVG
- `js/app.js` — window chrome, tabs, hash routing, dock, traffic lights,
  boot screen
- `js/terminal.js` — terminal engine + commands

## Local development

```sh
python3 -m http.server 4173
# open http://localhost:4173/
```

## Credits

- Tech icons: [Jerry's Pixel Icons](https://github.com/wolfsouldev/jerrys-pixel-icons)
  (MIT) — see `assets/icons/tech/LICENSE-MIT.txt`
- Design inspired by Gideon Low's
  [2024 Portfolio Website](https://dribbble.com/shots/24073576-2024-Portfolio-Website)
  and [juxtopposed's pixelated macOS icons](https://www.juxtopposed.com/macos-icons)
  (all pixel art here is drawn from scratch)
