# Spec: "daffa.dev OS" — Redesign Portofolio Pixel macOS

**Tanggal**: 2026-08-15
**Repo**: Daffadikau/portofolio (GitHub Pages: daffadikau.github.io/portofolio)
**Status**: Approved by Dikau (dengan catatan: siap revisi kapan pun)

## Ringkasan

Redesign total portofolio statis menjadi satu "scene" bergaya Macintosh klasik dengan
estetika pixel art: satu window macOS di tengah layar dengan tab bar sebagai navigasi
utama, dock pixel di bawah, background oranye hangat ber-dither. Konten memakai isi
live site sekarang plus dua project baru. Tetap vanilla HTML/CSS/JS tanpa build step.

Referensi visual (inspirasi, bukan aset yang di-copy):
- Gideon Low — "2024 Portfolio Website" (dribbble.com/shots/24073576): window Mac
  klasik abu terang di atas background oranye dither, pixel serif display type,
  body monospace.
- juxtopposed — Pixelated MacOS Icons (juxtopposed.com/macos-icons): gaya ikon pixel;
  TIDAK berlisensi bebas → semua ikon UI/dock digambar sendiri (custom).
- Jerry's Pixel Icons (repo wolfsouldev/jerrys-pixel-icons, lisensi MIT): ikon pixel
  bahasa/tech — BOLEH dipakai langsung, wajib menyertakan atribusi lisensi MIT.

## Keputusan desain (hasil brainstorming)

1. **Konsep**: satu window + tab bar (bukan desktop multi-window penuh).
2. **Visual**: warm retro — bg oranye dither `#F5A46B → #E8845A`, window abu terang
   `#E8E8E8` ala System 7, teks/border hitam `#1A1A1A`, traffic lights pixel
   oranye/kuning/hijau (`#F0713D` / `#F5D93D` / `#9DC24C`).
3. **Ikon**: dock di bawah layar (custom pixel art); ikon tech di Skills/Projects
   pakai Jerry's Pixel Icons (MIT + atribusi).
4. **Terminal**: eksperimen terminal uncommitted di checkout user dipakai ulang
   sebagai tab `>_ Terminal`, datanya diganti data asli.
5. **Konten**: konten live site dipertahankan + 2 project baru (TestKit Gas Monitor,
   BengkelBot). Bahasa Inggris.

## Scene & komponen

### Boot screen
- Muncul hanya di kunjungan pertama per sesi (flag `sessionStorage`), durasi ±1.5 s,
  bisa di-skip dengan klik/tombol apa pun.
- Urutan: layar gelap → wajah kucing pixel tersenyum (homage "happy Mac", kucing
  sesuai avatar GitHub Dikau) → progress bar chunky bersegmen → fade patah-patah
  (steps) ke scene utama.
- `prefers-reduced-motion: reduce` → boot screen dilewati total.

### Background
- Gradasi oranye hangat vertikal dengan dithering: tile PNG kecil (8×8 atau 16×16,
  base64 inline atau file di assets) di-repeat, `image-rendering: pixelated`.
- Tanpa elemen dekoratif lain (YAGNI) — fokus ke window & dock.

### Window utama
- Posisi tengah viewport, lebar max ±900 px, tinggi ±80 vh; konten scroll DI DALAM
  window (halaman tidak scroll).
- Chrome ala System 7: bar judul abu terang, border hitam 2 px, sudut pixel
  (tanpa border-radius halus), judul `daffa.dev` + subtitle kecil.
- Traffic lights pixelated, semuanya fungsional:
  - Merah: window shake singkat + toast pixel "nice try 😏" (tidak menutup apa pun).
  - Kuning: minimize — window animasi steps() mengecil ke dock; klik ikon dock
    aktif untuk restore.
  - Hijau: toggle maximize (window memenuhi viewport, dock tetap terlihat).
- Tab bar di bawah title bar: `About` `Projects` `Skills` `Contact` `>_ Terminal`.
  Tab aktif menyatu dengan area konten (gaya tab klasik).

### Navigasi & routing
- Hash routing: `#about` (default), `#projects`, `#skills`, `#contact`, `#terminal`.
  Hash tak dikenal → fallback `#about`. Back/forward browser berfungsi.
- Keyboard: `←`/`→` pindah tab; angka `1`–`5` lompat langsung; fokus tab mengikuti
  pola WAI-ARIA tabs (roving tabindex, `role="tablist"`).

### Dock
- Bar pixel di bawah-tengah layar. Isi: 5 ikon tab (About=wajah smiley Finder-ish,
  Projects=folder, Skills=chip, Contact=amplop, Terminal=layar hitam `>_`) +
  separator + 2 link eksternal (GitHub, LinkedIn — buka tab baru).
- Ikon = pixel art custom, inline SVG (shape-rendering: crispEdges), ±20×20 grid.
- Hover: bounce patah-patah `steps(3)`; klik: pindah tab. Titik `•` di bawah ikon
  tab yang aktif. Window minimized → ikonnya diberi indikator.
- Mobile: dock tetap ada, ukuran ikon menyesuaikan (44 px touch target min).

## Konten per tab

Semua konten didefinisikan sekali di `js/data.js` (single source of truth).
Tab visual dan terminal me-render dari data yang sama.

### About
- Display name "DAFFA ADIKA" font pixel besar (gaya referensi Gideon), avatar kucing
  pixel, satu baris status `● Open to opportunities`.
- Bio singkat: Muhammad Daffa Adika Utama — undergraduate Computer Engineering
  student (Universitas Pendidikan Indonesia), fullstack developer, Bandung.
- Education: UPI, Computer Engineering, 3rd year (mengikuti live site; angka tahun
  diperbarui bila Dikau koreksi saat review).
- Experience (dari live site): Service to Society Department Head (Jan 2025–Jan 2026);
  Community Service Staff, Indonesian Red Cross (Sep 2024–Jan 2026).
- Honors & Awards (dari live site): Best Department 2025; Silver Medal digital
  learning competition; UI/UX Design 2nd Place; Staff of the Month.

### Projects (5, urutan terbaru dulu)
Tiap project = kartu "mini-window" (title bar kecil + traffic light dekoratif),
berisi deskripsi 1–2 kalimat, tag tech (ikon Jerry's + label), link GitHub/demo
bila ada.
1. **TestKit Gas Monitor** — real-time gas monitoring dashboard (IoT). Tech:
   FastAPI, Next.js, TimescaleDB, Docker. (Copy final dikonfirmasi Dikau —
   perhatikan apa yang aman disebut publik soal klien/BRIN.)
2. **BengkelBot** — AI customer-service chatbot untuk bengkel. Tech: Gemini API,
   Node.js. Link: github.com/Daffadikau/bengkelbot.
3. **Mentorly** — mentoring platform. Tech: Flutter, Firebase, PHP.
4. **OMR Automated Grading System** — computer-vision grading. Tech: YOLO, Python,
   Firebase.
5. **Kuai DryVault** — IoT shoe-drying cabinet. Tech: ESP32, Flutter.

### Skills
- Grup: Languages / Frontend / Backend / DevOps & Tools (isi mengikuti live site,
  dirapikan seperlunya agar jujur dan konsisten dengan projects).
- Tiap skill: ikon pixel (Jerry's bila tersedia; fallback label teks pixel tanpa
  ikon) + progress bar bersegmen chunky (kotak diskrit, bukan gradient halus).

### Contact
- Tombol pixel besar: Email (mailto:daffadikau@gmail.com), GitHub
  (github.com/Daffadikau), LinkedIn (profil Dikau, ambil URL dari live site).
- Satu kalimat ajakan singkat.

### Terminal
- Reuse engine eksperimen (render history, autolink URL/email, arrow-key history) —
  logika disalin ke `js/terminal.js`, data dari `data.js`.
- Commands: `help`, `about`, `projects`, `skills`, `experience`, `education`,
  `contact`, `clear`, plus easter eggs: `neofetch` (kucing pixel ASCII + "spek
  sistem" playful), `sudo hire-me` (respons lucu + link contact).
- Command tak dikenal → pesan "command not found" + saran `help`.
- Welcome banner ASCII "DAFFA" saat tab pertama dibuka.

## Craft & interaksi

- **Font** (Google Fonts): heading pixel — kandidat Silkscreen / Press Start 2P /
  Pixelify Sans; terminal — VT323 atau JetBrains Mono; body — JetBrains Mono.
  Pilihan final ditentukan lewat uji visual saat implementasi (kriteria: keterbacaan
  body ≥ 14 px, heading punya karakter pixel kuat).
- **Kursor**: custom pixel arrow hitam ala Mac klasik (CSS `cursor: url(...)`),
  pointer pixel untuk elemen klik; fallback kursor default bila gagal load.
- **Animasi**: semua pakai `steps()` — tab switch flicker 2 frame, dock bounce,
  minimize/maximize zoom patah-patah. `prefers-reduced-motion` → semua animasi off,
  transisi instan.
- **Responsive**: breakpoint ±640 px — window jadi ±96 vw × ±88 vh, tab bar menjadi
  ikon-saja (label disembunyikan, `aria-label` tetap), dock compact. Tidak ada
  horizontal scroll halaman.
- **Aksesibilitas**: HTML semantik per section, pola ARIA tabs, kontras teks utama
  AA (hitam di atas abu terang), fokus keyboard terlihat (outline pixel), semua
  fungsi bisa tanpa mouse. Terminal input diberi label; output pakai `aria-live`
  polite.

## Struktur teknis

```
index.html
styles/
  base.css      (reset, token warna, font, background, kursor)
  window.css    (window, title bar, traffic lights, tab bar)
  sections.css  (konten About/Projects/Skills/Contact)
  dock.css      (dock + ikon + bounce)
  terminal.css  (tab terminal)
js/
  data.js       (SEMUA konten: bio, projects, skills, experience, contact)
  app.js        (routing hash, tabs, traffic lights, dock, boot screen)
  terminal.js   (engine terminal, commands membaca data.js)
assets/
  icons/tech/   (SVG Jerry's Pixel Icons + LICENSE-MIT.txt atribusi)
  dither.png    (tile background; boleh base64 inline di CSS)
  favicon.png   (kucing pixel)
docs/superpowers/specs/  (dokumen ini)
```

- Tanpa framework, tanpa bundler, tanpa dependency runtime selain Google Fonts.
- File lama `script.js` dan `styles.css` dihapus setelah digantikan struktur baru.
- Meta: title "Daffa Adika — Portfolio", description, OG tags + OG image
  (screenshot scene), favicon.
- `<noscript>`: pesan singkat + email/GitHub sebagai fallback kontak (konten utama
  butuh JS; acceptable untuk portofolio pribadi).

## Error handling & edge case

- Hash tidak dikenal → `#about`; hash berubah manual saat window minimized →
  window auto-restore.
- Google Fonts gagal → fallback stack `monospace` tetap terbaca.
- Ikon tech tidak tersedia di set MIT → tampil label teks saja (tanpa ikon rusak).
- Layar sangat kecil (<360 px) → window fullscreen, dock tetap 44 px target.

## Testing & verifikasi

- Manual checklist di 3 lebar viewport (desktop 1440, tablet 768, mobile 375):
  semua tab, traffic lights, dock, keyboard nav, hash routing, boot skip,
  reduced-motion, terminal commands (termasuk unknown command).
- Cek Lighthouse: accessibility ≥ 90, performance ≥ 90 (situs statis ringan).
- `gitleaks protect --staged` sebelum commit (konvensi repo Dikau).

## Deployment

- Kerja di branch worktree → commit → push → draft PR ke `main`. Dikau yang merge;
  GitHub Pages deploy dari `main`.
- Konten copy project baru (terutama TestKit/BRIN) dikonfirmasi Dikau saat review
  PR sebelum merge — jangan mempublikasikan detail klien yang tidak perlu.

## Di luar scope (eksplisit)

- Desktop multi-window penuh, menu bar atas, ikon desktop.
- Sound effects.
- Dark mode toggle (scene sudah punya identitas warna kuat).
- Blog/CMS, analytics, form kontak ber-backend.
- Rombak total copywriting (iterasi berikutnya bila diminta).
