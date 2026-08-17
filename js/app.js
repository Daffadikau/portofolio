(function () {
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };
  const D0 = window.PORTFOLIO_DATA;
  (function boot() {
    const bootEl = document.getElementById('boot');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let booted = null;
    try { booted = sessionStorage.getItem('booted'); } catch (e) { booted = '1'; }
    if (reduced || booted) { bootEl.remove(); return; }
    try { sessionStorage.setItem('booted', '1'); } catch (e) { /* abaikan */ }
    bootEl.hidden = false;
    const inner = el('div', 'boot-inner');
    const cat = el('div', 'boot-cat');
    cat.appendChild(window.PixelArt.render('cat', 5));
    // POST ala BIOS: baris muncul satu per satu, seirama dengan progress bar
    const post = el('pre', 'boot-post');
    const POST = [
      ['Detecting CPU', 'Intelligent Device'],
      ['Detecting RAM', '3.65 GPA / 4.00'],
      ['Detecting GPU', 'Pixel Art Engine'],
      ['Mounting /projects', `${D0.projects.length} found`],
      ['Mounting /skills', 'OK'],
      ['Waking Smoky', 'mrrp'],
    ];
    const bar = el('div', 'boot-bar');
    for (let i = 0; i < POST.length; i += 1) bar.appendChild(el('i'));
    inner.append(cat, el('p', 'boot-title', 'daffa.dev OS'),
      el('p', 'boot-sub', 'BIOS v2.1 · (c) 2026 Daffa Adika'), post, bar);
    bootEl.appendChild(inner);
    let step = 0;
    const t = setInterval(() => {
      const [label, val] = POST[step];
      post.appendChild(document.createTextNode(
        `${label} ${'.'.repeat(Math.max(2, 22 - label.length))} ${val}\n`));
      bar.children[step].className = 'on';
      step += 1;
      if (step === POST.length) { clearInterval(t); setTimeout(done, 260); }
    }, 200);
    function done() { clearInterval(t); bootEl.remove(); }
    bootEl.addEventListener('click', done);
    document.addEventListener('keydown', done, { once: true });
  })();

  // Wallpaper mengikuti jam perangkat: gelap antara 20.00 dan 04.59.
  // Dicek ulang tiap menit supaya tetap berubah kalau tab dibiarkan terbuka.
  (function daylight() {
    function apply() {
      const h = new Date().getHours();
      document.documentElement.classList.toggle('night', h >= 20 || h < 5);
    }
    apply();
    setInterval(apply, 60000);
  })();
  let restoreMainWindow = () => {};
  const TABS = ['about', 'projects', 'skills', 'contact'];
  const LABELS = { about: 'About', projects: 'Projects', skills: 'Skills', contact: 'Contact' };
  const win = document.getElementById('window');

  const titlebar = el('div', 'titlebar');
  const lights = el('div', 'traffic-lights');
  [['tl-red', 'Close (just kidding)'], ['tl-yellow', 'Minimize window'], ['tl-green', 'Maximize window']]
    .forEach(([cls, label]) => {
      const b = el('button', cls);
      b.setAttribute('aria-label', label);
      lights.appendChild(b);
    });
  // baris 1 = traffic lights + tab strip (seperti tab browser)
  const tabbar = el('div', 'tabbar');
  tabbar.setAttribute('role', 'tablist');
  tabbar.setAttribute('aria-label', 'Sections');
  // Semua setelan situs (tema, musik, pemblokir pop-up) dipusatkan di sini
  // supaya jendela Settings dan bagian lain memakai sumber yang sama.
  // Dulu ini tiga tombol di titlebar; sekarang titlebar-nya bersih lagi.
  (function prefs() {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const listeners = [];
    const read = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
    const write = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } };
    let themeChoice = read('theme');                 // 'light' | 'dark' | null (ikut sistem)
    let blocked = read('popup-blocked') === '1';
    let blockedCount = 0;
    function isDark() { return themeChoice ? themeChoice === 'dark' : media.matches; }
    function applyTheme() { document.documentElement.classList.toggle('dark', isDark()); }
    function emit() { listeners.forEach((f) => { try { f(); } catch (e) { /* ignore */ } }); }
    applyTheme();
    media.addEventListener('change', () => { if (!themeChoice) { applyTheme(); emit(); } });
    window.Prefs = {
      isDark,
      themeMode: () => themeChoice || 'auto',
      setTheme(mode) {                                // 'light' | 'dark' | 'auto'
        themeChoice = mode === 'auto' ? null : mode;
        if (themeChoice) write('theme', themeChoice);
        else { try { localStorage.removeItem('theme'); } catch (e) { /* ignore */ } }
        applyTheme(); emit();
      },
      isMusicOn: () => !!(window.Music && window.Music.isPlaying()),
      setMusic(on) {
        if (!window.Music) return;
        if (on) window.Music.start(); else window.Music.stop();
        write('music-on', on ? '1' : '0');
        emit();
      },
      isBlocked: () => blocked,
      blockedCount: () => blockedCount,
      setBlocked(on) {
        blocked = !!on;
        if (!blocked) blockedCount = 0;
        write('popup-blocked', blocked ? '1' : '0');
        const tab = location.hash.replace('#', '') || 'about';
        if (window.AppWins) {
          if (blocked) window.AppWins.closeAll(['terminal', 'spotify', 'settings']);
          else if (window.AppWins.GROUPS[tab]) window.AppWins.openGroup(tab);
        }
        emit();
      },
      noteBlocked(n) { blockedCount += n; emit(); },
      onChange(f) { listeners.push(f); },
    };
    try { if (window.Music) window.Music.onChange(emit); } catch (e) { /* ignore */ }
    // pilihan musik diingat, tapi tetap menunggu satu interaksi karena
    // peramban tidak mengizinkan audio dimulai tanpa itu
    if (read('music-on') === '1') {
      const kick = () => {
        document.removeEventListener('pointerdown', kick);
        document.removeEventListener('keydown', kick);
        if (window.Music) window.Music.start();
      };
      document.addEventListener('pointerdown', kick, { once: true });
      document.addEventListener('keydown', kick, { once: true });
    }
  })();
  titlebar.append(lights, tabbar);

  // baris 2 = toolbar browser: back / forward / reload + address bar
  const toolbar = el('div', 'toolbar');
  const navBtns = el('div', 'nav-btns');
  const backBtn = el('button', 'nav-btn', '‹');
  backBtn.setAttribute('aria-label', 'Back');
  backBtn.title = 'Back';
  backBtn.addEventListener('click', () => history.back());
  const fwdBtn = el('button', 'nav-btn', '›');
  fwdBtn.setAttribute('aria-label', 'Forward');
  fwdBtn.title = 'Forward';
  fwdBtn.addEventListener('click', () => history.forward());
  const reloadBtn = el('button', 'nav-btn', '⟳');
  reloadBtn.setAttribute('aria-label', 'Reload');
  reloadBtn.title = 'Reload';
  reloadBtn.addEventListener('click', () => location.reload());
  navBtns.append(backBtn, fwdBtn, reloadBtn);
  const urlBar = el('div', 'urlbar');
  urlBar.append(el('span', 'url-lock', '🔒'), el('span', 'url-text', 'https://daffadikau.dev/'));
  const urlText = urlBar.querySelector('.url-text');
  toolbar.append(navBtns, urlBar);

  const panels = el('div', 'tabpanels');
  win.append(titlebar, toolbar, panels);

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
    p.tabIndex = 0;
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
      if (active) { panel.classList.remove('pop'); void panel.offsetWidth; panel.classList.add('pop'); }
    });
    urlText.textContent = `https://daffadikau.dev/${id === 'about' ? '' : id}`;
    document.dispatchEvent(new CustomEvent('tabshown', { detail: { id } }));
  }
  function fromHash() {
    let id = location.hash.replace('#', '') || 'about';
    if (!TABS.includes(id)) {
      id = 'about';
      history.replaceState(null, '', '#about');
    }
    showTab(id);
  }
  window.addEventListener('hashchange', fromHash);

  tabbar.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const cur = TABS.indexOf(location.hash.replace('#', '') || 'about');
    let next;
    if (e.key === 'ArrowRight') next = TABS[(cur + 1) % TABS.length];
    else if (e.key === 'ArrowLeft') next = TABS[(cur - 1 + TABS.length) % TABS.length];
    else return;
    e.preventDefault();
    location.hash = next;
    document.getElementById(`tab-${next}`).focus();
  });
  document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    // jangan bajak angka saat fokus ada di dalam jendela aplikasi —
    // pindah tab akan menutup jendela yang sedang dipakai
    if (e.target.closest && e.target.closest('.appwin')) return;
    const n = Number(e.key);
    if (n >= 1 && n <= TABS.length) {
      const id = TABS[n - 1];
      // tab yang sama: cukup pulihkan window utama kalau sedang di-minimize,
      // JANGAN showTab() ulang karena itu memusnahkan semua jendela aplikasi
      if ((location.hash.replace('#', '') || 'about') === id) restoreMainWindow();
      else location.hash = id;
    }
  });

  const D = window.PORTFOLIO_DATA;
  function h2icon(map, text) {
    const h = el('h2', 'h2i');
    h.append(window.PixelArt.render(map, 2), document.createTextNode(text));
    return h;
  }
  (function renderAbout() {
    const p = document.getElementById('panel-about');
    const hero = el('div', 'hero');
    const art = el('div', 'hero-art');
    window.Smoky.attach(art, 6);
    const head = el('div');
    head.append(el('h1', 'display', D.name), el('p', 'role', D.role));
    const status = el('p', 'status');
    status.append(el('span', 'dot'), document.createTextNode(D.status));
    head.appendChild(status);
    hero.append(art, head, buildStatusScreen(D.stats));
    p.append(hero, el('p', 'bio', D.bio), buildFlat(D.flat),
      h2icon('cap', 'Education'),
      el('p', null, `${D.education.program} — ${D.education.school}, ${D.education.detail}`),
      h2icon('case', 'Experience'));
    p.appendChild(buildApartment(D.experience));
    p.appendChild(h2icon('trophy', 'Honors & Awards'));
    p.appendChild(buildJokers(D.awards));
    p.appendChild(buildY2kFooter());
  })();
  // Experience sebagai apartemen ala Tomodachi Life: tiap lantai satu peran,
  // penghuninya Smoky dengan setelan berbeda (pakai wardrobe yang sudah ada).
  // Klik pintu -> lampu kamar nyala + speech bubble berisi poin pekerjaannya.
  function buildApartment(list) {
    // di dalam fungsi, bukan di scope modul: renderAbout jalan lebih dulu
    // dari deklarasi ini, jadi const di luar kena temporal dead zone.
    // seragam + lokasi kerja masing-masing — urutannya mengikuti D.experience
    // scene = peta latar kamarnya, prop = benda yang cuma muncul saat tidur
    const TENANTS = [
      // PT IROSTECH: kemeja biru bergaris + dasi + kacamata, di bilik kantor
      { fit: 'wFitShirtTie', acc: 'wAccGlasses', hat: null, unit: '4A',
        scene: 'sceneOffice', ceil: 'ceilOffice', decor: 'decorDrone', prop: null },
      // Rumah Prestasi UPI: blazer almamater merah, di panggung bersorot lampu
      { fit: 'wFitBlazerUpi', acc: null, hat: null, unit: '3A',
        scene: 'sceneStage', ceil: 'ceilStage', decor: 'decorMedal', prop: 'propBulb' },
      // HIMA TEKKOM P2M: kaus volunteer, di tempat penyaluran donasi
      { fit: 'wFitVolunteer', acc: null, hat: null, unit: '2A',
        scene: 'sceneVolunteer', ceil: 'ceilVolunteer', decor: 'decorShelf', prop: 'propBox' },
      // KSR PMI: seragam medis + hard hat, di ruang rawat
      { fit: 'wFitPmi', acc: null, hat: 'wHatHardHat', unit: '1A',
        scene: 'sceneHospital', ceil: 'ceilHospital', decor: 'decorClock', prop: 'propBlanket' },
    ];
    const apt = el('section', 'apt');
    apt.setAttribute('aria-label', 'Experience, as an apartment building');
    const roof = el('div', 'apt-roof');
    roof.append(el('i', 'apt-antenna'), el('span', 'apt-sign', 'DAFFA APARTMENTS'));
    apt.appendChild(roof);
    list.forEach((x, i) => {
      const t = TENANTS[i % TENANTS.length];
      const floor = el('div', 'apt-floor');
      const room = el('div', `apt-room ${t.scene} asleep`);
      // Kamar disusun tiga lapis supaya tetap terisi waktu memanjang:
      // langit-langit menempel di atas, perabot menempel di bawah, dan
      // dinding di antaranya diisi pola yang berulang (lihat sections.css).
      const back = el('div', 'apt-back');
      back.setAttribute('aria-hidden', 'true');
      const ceil = el('div', 'apt-ceil');
      ceil.appendChild(window.PixelArt.render(t.ceil, 3));
      back.append(ceil, window.PixelArt.render(t.scene, 3));
      // hiasan dinding: cuma muncul kalau kamarnya sedang memanjang, supaya
      // tidak bertabrakan dengan perabot waktu kamarnya masih pendek
      const decor = el('div', 'apt-decor');
      decor.setAttribute('aria-hidden', 'true');
      decor.appendChild(window.PixelArt.render(t.decor, 3));
      // prop yang cuma muncul waktu penghuninya masih tidur
      const sleep = el('div', 'apt-sleep');
      sleep.setAttribute('aria-hidden', 'true');
      if (t.prop) sleep.appendChild(window.PixelArt.render(t.prop, 3));
      const zzz = el('div', 'apt-zzz');
      zzz.setAttribute('aria-hidden', 'true');
      for (let n = 0; n < 3; n += 1) {
        const z = el('i', null, 'z');
        z.style.animationDelay = `${(n * 0.5).toFixed(2)}s`;
        zzz.appendChild(z);
      }
      const tenant = el('div', 'apt-tenant');
      // catSleep bentuknya identik dengan cat kecuali baris mata, jadi peta
      // seragamnya tetap pas dipakai di kedua pose.
      // renderStack butuh urutan: base -> outfit -> aksesori -> topi
      function drawTenant(awake) {
        tenant.replaceChildren(window.PixelArt.renderStack(
          [awake ? 'cat' : 'catSleep', t.fit, t.acc, t.hat].filter(Boolean), 3));
      }
      drawTenant(false);
      room.append(back, decor, sleep, tenant, zzz, el('i', 'apt-dim'));
      const info = el('div', 'apt-info');
      const id = `apt-bubble-${i}`;
      const door = el('button', 'apt-door');
      door.type = 'button';
      door.setAttribute('aria-expanded', 'false');
      door.setAttribute('aria-controls', id);
      const plate = el('span', 'apt-unit', t.unit);
      const who = el('span', 'apt-who');
      who.append(el('b', null, x.role), el('i', null, x.org));
      door.append(plate, who, el('span', 'apt-period', x.period), el('span', 'apt-knock', 'knock'));
      const bubble = el('div', 'apt-bubble');
      bubble.id = id;
      bubble.hidden = true;
      const ul = el('ul');
      x.points.forEach((pt) => ul.appendChild(el('li', null, pt)));
      bubble.appendChild(ul);
      door.addEventListener('click', () => {
        const open = door.getAttribute('aria-expanded') === 'true';
        door.setAttribute('aria-expanded', String(!open));
        bubble.hidden = open;
        floor.classList.toggle('lit', !open);
        room.classList.toggle('asleep', open);
        drawTenant(!open);
        try { window.Smoky.sfx.play(open ? 'wake' : 'happy'); } catch (e) { /* audio opsional */ }
      });
      info.append(door, bubble);
      floor.append(room, info);
      apt.appendChild(floor);
    });
    const ground = el('div', 'apt-ground');
    ground.append(el('span', 'apt-mail', 'mailbox'), el('span', null, 'knock on a door to say hi'));
    apt.appendChild(ground);
    return apt;
  }
  // Awards sebagai tangan kartu Joker ala Balatro: kartu di-fan out, hover
  // memiringkan kartu mengikuti kursor, klik mengangkat kartu dan menulis
  // detailnya di panel bawah (mirip papan info run di Balatro).
  function buildJokers(list) {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const wrap = el('section', 'jokers');
    const hand = el('div', 'joker-hand');
    hand.setAttribute('role', 'list');
    const info = el('div', 'joker-info');
    const infoName = el('b', 'joker-info-name');
    const infoMeta = el('span', 'joker-info-meta');
    const infoBlurb = el('i', 'joker-info-blurb');
    info.append(infoName, infoMeta, infoBlurb);
    const cards = [];
    function select(i) {
      cards.forEach((c, n) => {
        c.classList.toggle('picked', n === i);
        c.setAttribute('aria-pressed', String(n === i));
      });
      const a = list[i];
      const MULT = { common: 1, uncommon: 2, rare: 4, legendary: 8 };
      infoName.textContent = a.title;
      infoMeta.textContent = `${a.org} · ${a.when} · ${a.rarity} · +${MULT[a.rarity] || 1} Mult`;
      infoBlurb.textContent = a.blurb || '';
      try { window.Smoky.sfx.play('play'); } catch (e) { /* audio opsional */ }
    }
    list.forEach((a, i) => {
      const c = el('button', `joker rar-${a.rarity || 'common'}`);
      c.type = 'button';
      c.setAttribute('role', 'listitem');
      c.setAttribute('aria-pressed', 'false');
      c.setAttribute('aria-label', `${a.title}, ${a.org}, ${a.when}`);
      // sudut kemiringan kipas: kartu tengah tegak, makin ke pinggir makin miring
      const spread = (i - (list.length - 1) / 2);
      c.style.setProperty('--fan', `${spread * 3.2}deg`);
      c.style.setProperty('--lift', `${Math.abs(spread) * 5}px`);
      // nilai Mult mengikuti kelangkaan — meniru papan angka Balatro
      const MULT = { common: 1, uncommon: 2, rare: 4, legendary: 8 };
      const mult = MULT[a.rarity] || 1;
      const face = el('span', 'joker-face');
      const art = el('span', 'joker-art');
      art.appendChild(window.PixelArt.render(a.icon || 'trophy', 3));
      const tag = el('span', 'joker-mult');
      tag.append(el('b', null, `+${mult}`), el('i', null, 'Mult'));
      face.append(el('span', 'joker-year', a.when), art,
        el('span', 'joker-name', a.title), tag);
      c.append(face, el('span', 'joker-rar', a.rarity || 'common'));
      c.dataset.mult = String(mult);
      // tilt 3D mengikuti kursor — dilewati kalau user minta gerak minimal
      if (!reduced) {
        c.addEventListener('pointermove', (e) => {
          const r = c.getBoundingClientRect();
          const dx = (e.clientX - r.left) / r.width - 0.5;
          const dy = (e.clientY - r.top) / r.height - 0.5;
          c.style.setProperty('--rx', `${(-dy * 16).toFixed(2)}deg`);
          c.style.setProperty('--ry', `${(dx * 18).toFixed(2)}deg`);
        });
        const reset = () => { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); };
        c.addEventListener('pointerleave', reset);
        c.addEventListener('blur', reset);
      }
      c.addEventListener('click', () => select(i));
      cards.push(c);
      hand.appendChild(c);
    });
    const counter = el('div', 'joker-count');
    const MULT_ALL = { common: 1, uncommon: 2, rare: 4, legendary: 8 };
    const total = list.reduce((n, a) => n + (MULT_ALL[a.rarity] || 1), 0);
    counter.append(
      el('b', null, String(list.length)),
      el('span', null, 'jokers held'),
      el('b', 'joker-total', `+${total}`),
      el('span', null, 'Mult'),
      el('i', null, 'hover to tilt · click to inspect'),
    );
    wrap.append(hand, info, counter);
    if (list.length) select(0);
    return wrap;
  }
  // Stats sebagai layar status Tamagotchi: LCD hijau, bar tersegmentasi,
  // plus baris kondisi Smoky yang ikut berubah kalau dia diajak main.
  function buildStatusScreen(list) {
    const dev = el('div', 'tama');
    const lcd = el('div', 'tama-lcd');
    lcd.append(el('div', 'tama-title', 'STATUS'));
    list.forEach((s) => {
      const row = el('div', 'tama-row');
      const bar = el('span', 'tama-bar');
      const fill = el('i');
      const pct = s.max ? Math.max(0, Math.min(100, (s.value / s.max) * 100)) : 100;
      fill.style.width = `${pct.toFixed(1)}%`;
      bar.appendChild(fill);
      row.append(el('span', 'tama-k', s.short || s.label), bar, el('b', null, s.number));
      row.title = s.label;
      lcd.appendChild(row);
    });
    // baris terakhir: kondisi Smoky, hidup mengikuti state di smoky.js
    const mood = el('div', 'tama-row tama-mood');
    const pips = el('span', 'tama-pips');
    mood.append(el('span', 'tama-k', 'SMOKY'), pips);
    const moodLabel = el('b');
    mood.appendChild(moodLabel);
    function drawHearts(n) {
      pips.replaceChildren();
      for (let i = 0; i < 5; i += 1) {
        const pip = el('i', i < n ? 'on' : null);
        pips.appendChild(pip);
      }
      moodLabel.textContent = n >= 4 ? 'happy' : (n >= 2 ? 'okay' : 'grumpy');
    }
    try {
      drawHearts(window.Smoky.getHearts());
      window.Smoky.onHearts(drawHearts);
    } catch (e) { drawHearts(4); }
    lcd.appendChild(mood);
    // cangkang perangkat: tiga tombol karet ala Tamagotchi (dekorasi saja),
    // digambar sebagai peta pixel — bukan lingkaran border-radius
    const btns = el('div', 'tama-btns');
    btns.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 3; i += 1) btns.appendChild(window.PixelArt.render('propKnob', 3));
    dev.append(lcd, btns);
    return dev;
  }
  // Apartemen Smoky: satu potongan denah dengan empat zona. Smoky pindah
  // zona sendiri tiap beberapa detik dan mengerjakan sesuatu di sana, jadi
  // halamannya terasa hidup walau pengunjung diam saja.
  function buildFlat(zones) {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const wrap = el('div', 'flat');
    const stage = el('div', 'flat-stage');
    stage.appendChild(window.PixelArt.render('flatApartment', 1));
    const cat = el('button', 'flat-cat');
    cat.type = 'button';
    cat.setAttribute('aria-label', 'Poke Smoky');
    function outfitLayers() {
      try {
        const w = window.Smoky.getWorn();
        const find = (slot) => {
          const it = window.Smoky.WARDROBE[slot].filter((x) => x.id === w[slot])[0];
          return it && it.map;
        };
        return [find('outfit'), find('acc'), find('hat')].filter(Boolean);
      } catch (e) { return []; }
    }
    function face(map) {
      cat.replaceChildren(window.PixelArt.renderStack([map].concat(outfitLayers()), 4));
    }
    const read = el('div', 'flat-read');
    const who = el('b');
    const what = el('span');
    read.append(who, what);
    let at = 0;
    let hovering = false;
    function say(label, text) { who.textContent = `${label} — `; what.textContent = text; }
    function sayCurrent() {
      if (hovering) return;
      say('Smoky', `is ${zones[at].act}.`);
    }
    // hotspot per zona: hover/fokus menampilkan keterangannya
    const spots = el('div', 'flat-spots');
    zones.forEach((z, i) => {
      const b2 = el('button', 'flat-spot');
      b2.type = 'button';
      b2.style.left = `${(i / zones.length) * 100}%`;
      b2.style.width = `${100 / zones.length}%`;
      b2.setAttribute('aria-label', `${z.label}: ${z.fact}`);
      b2.appendChild(el('span', 'flat-tag', z.label));
      const show = () => { hovering = true; say(z.label, z.fact); };
      ['pointerenter', 'focus'].forEach((ev) => b2.addEventListener(ev, show));
      ['pointerleave', 'blur'].forEach((ev) => b2.addEventListener(ev, () => {
        hovering = false; sayCurrent();
      }));
      b2.addEventListener('click', show);
      spots.appendChild(b2);
    });
    function goTo(i) {
      at = i;
      const z = zones[i];
      cat.style.left = `${z.pct}%`;
      // ganti pose setelah dia sampai, bukan waktu masih jalan
      clearTimeout(cat._arrive);
      face('cat');
      cat._arrive = setTimeout(() => { face(z.face); sayCurrent(); }, reduced ? 0 : 2300);
    }
    cat.addEventListener('click', () => {
      face('catHappy');
      say('Smoky', 'mrrp.');
      try { window.Smoky.interact('poke'); } catch (e) { /* opsional */ }
      clearTimeout(cat._arrive);
      cat._arrive = setTimeout(() => { face(zones[at].face); sayCurrent(); }, 1400);
    });
    try { window.Smoky.onOutfit(() => face(zones[at].face)); } catch (e) { /* opsional */ }
    stage.append(spots, cat);
    wrap.append(stage, read);
    goTo(reduced ? 3 : 1);
    if (!reduced) {
      // urutannya tidak berurutan supaya tidak terasa seperti loop
      const ORDER = [1, 0, 2, 3, 1, 2, 0, 3];
      let step = 0;
      setInterval(() => { step += 1; goTo(ORDER[step % ORDER.length]); }, 9000);
    }
    return wrap;
  }
  // Footer Y2K: pencacah kunjungan ala GeoCities, badge 88x31, dan webring.
  // Semua palsu dan lokal — tidak ada request keluar, angkanya dari
  // localStorage perangkat sendiri.
  function buildY2kFooter() {
    const f = el('footer', 'y2k');
    const hits = el('div', 'y2k-hits');
    hits.append(el('span', 'y2k-label', 'You are visitor number'));
    const odo = el('span', 'y2k-odo');
    let n = 1;
    try {
      const seen = sessionStorage.getItem('y2k-counted');
      n = Number(localStorage.getItem('y2k-hits') || '0');
      if (!(n >= 0)) n = 0;
      if (!seen) {
        n += 1;
        localStorage.setItem('y2k-hits', String(n));
        sessionStorage.setItem('y2k-counted', '1');
      }
      if (n < 1) n = 1;
    } catch (e) { n = 1; }
    String(n).padStart(6, '0').split('').forEach((d) => odo.appendChild(el('i', null, d)));
    hits.appendChild(odo);
    hits.appendChild(el('span', 'y2k-note', '(counted on your device only)'));
    const badges = el('div', 'y2k-badges');
    [['HAND-CODED', 'no framework, no build step', '#1a1a1a', '#7ee787'],
      ['BEST VIEWED', 'at 800 x 600', '#2f3b52', '#a9c7e8'],
      ['SMOKY', 'approved', '#f5d93d', '#1a1a1a'],
      ['NO ADS', 'never had any', '#c94867', '#fff']].forEach(([a, b, bg, fg]) => {
      const badge = el('span', 'y2k-badge');
      badge.style.background = bg;
      badge.style.color = fg;
      badge.append(el('b', null, a), el('i', null, b));
      badges.appendChild(badge);
    });
    const ring = el('div', 'y2k-ring');
    ring.append(
      el('span', null, '<<'),
      el('span', 'y2k-ring-name', 'the pixel webring'),
      el('span', null, '>>'),
    );
    // baris penutup: Smoky di kardusnya menemani webring + unduhan CV
    const row = el('div', 'y2k-row');
    const art = el('button', 'y2k-smoky');
    art.type = 'button';
    art.setAttribute('aria-label', 'Poke Smoky');
    art.appendChild(window.PixelArt.render('smokyBox', 3));
    const purr = el('span', 'y2k-purr');
    purr.hidden = true;
    art.appendChild(purr);
    const LINES = ['mrrp', 'the box is mine', 'you again', 'purr', 'do not resize me', '...'];
    let saidAt = 0;
    art.addEventListener('click', () => {
      purr.textContent = LINES[saidAt % LINES.length];
      saidAt += 1;
      purr.hidden = false;
      art.classList.remove('poked');
      void art.offsetWidth;
      art.classList.add('poked');
      try { window.Smoky.sfx.play('happy'); } catch (e) { /* audio opsional */ }
      clearTimeout(art._t);
      art._t = setTimeout(() => { purr.hidden = true; }, 2200);
    });
    const col = el('div', 'y2k-col');
    col.append(ring, buildCvLink(D.cv));
    row.append(art, col);
    f.append(hits, badges, row,
      el('p', 'y2k-sig', 'this page is under construction · always has been'));
    return f;
  }
  // Tombol unduh CV lengkap, duduk tepat di bawah panel status.
  function buildCvLink(cv) {
    const wrap = el('div', 'cv-drop');
    if (!cv || !cv.file) return wrap;
    wrap.appendChild(el('p', 'cv-note', cv.note));
    const a = el('a', 'cv-btn');
    a.href = cv.file;
    // download same-origin: berkasnya tersimpan dengan nama yang rapi,
    // bukan nama berkas di repo
    a.setAttribute('download', cv.download || '');
    a.setAttribute('type', 'application/pdf');
    a.appendChild(window.PixelArt.render('iconCv', 2));
    a.appendChild(el('span', null, cv.label || 'Download CV (PDF)'));
    wrap.appendChild(a);
    return wrap;
  }
  // Easter egg: kode Konami membuka topi pesta di wardrobe Smoky.
  // Sekali terbuka tetap terbuka (disimpan di localStorage oleh smoky.js).
  (function konami() {
    const SEQ = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let at = 0;
    document.addEventListener('keydown', (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      const key = e.key && e.key.length === 1 ? e.key.toLowerCase() : e.key;
      at = key === SEQ[at] ? at + 1 : (key === SEQ[0] ? 1 : 0);
      if (at < SEQ.length) return;
      at = 0;
      party();
    });
    function party() {
      const first = window.Smoky.unlock('party');
      window.Smoky.wear('hat', 'party');
      try { window.Smoky.sfx.play('play'); } catch (err) { /* audio opsional */ }
      try {
        console.log('%c🎉 Party hat unlocked — check the wardrobe in Skills.',
          'font-weight:bold;color:#f5d93d;background:#1a1a1a;padding:2px 6px');
      } catch (err) { /* ignore */ }
      toast(first ? 'PARTY HAT UNLOCKED' : 'PARTY HAT ON');
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) confetti();
    }
    function toast(text) {
      const t = el('div', 'egg-toast', text);
      document.body.appendChild(t);
      setTimeout(() => t.remove(), 2600);
    }
    // konfeti: kotak-kotak pixel, bukan bentuk bulat
    function confetti() {
      const wrap = el('div', 'confetti');
      wrap.setAttribute('aria-hidden', 'true');
      const COLORS = ['#f0713d', '#f5d93d', '#9dc24c', '#4a90d9', '#c94867', '#7d5ba6'];
      for (let i = 0; i < 40; i += 1) {
        const bit = el('i');
        bit.style.left = `${Math.round(Math.random() * 100)}%`;
        bit.style.background = COLORS[i % COLORS.length];
        bit.style.animationDelay = `${(Math.random() * 0.9).toFixed(2)}s`;
        bit.style.animationDuration = `${(1.6 + Math.random() * 1.2).toFixed(2)}s`;
        wrap.appendChild(bit);
      }
      document.body.appendChild(wrap);
      setTimeout(() => wrap.remove(), 3200);
    }
  })();
  // Finder ala macOS untuk daftar proyek: bilah alat dengan pencarian, bilah
  // tab, sidebar tempat dan tag, lalu isi yang bisa ditampilkan sebagai ikon
  // atau daftar. Klik satu berkas membuka jendela Quick Look yang sudah ada.
  function buildFinder(projects) {
    const root = el('section', 'fx');
    root.setAttribute('aria-label', 'Projects, as a Finder window');
    let view = 'icon';
    let scope = { kind: 'all', value: 'All Projects' };
    let query = '';
    // ── bilah alat ──
    const bar = el('div', 'fx-bar');
    const nav = el('div', 'fx-nav');
    ['\u2039', '\u203a'].forEach((ch, i) => {
      const b = el('button', 'fx-navb', ch);
      b.type = 'button';
      b.disabled = true;                              // dekoratif: tidak ada riwayat
      b.setAttribute('aria-hidden', 'true');
      b.tabIndex = -1;
      nav.appendChild(b);
    });
    const views = el('div', 'fx-views');
    const viewBtns = [['icon', 'Icons'], ['list', 'List']].map(([id, label]) => {
      const b = el('button', 'fx-viewb', label);
      b.type = 'button';
      b.setAttribute('aria-label', `${label} view`);
      b.addEventListener('click', () => { view = id; render(); });
      views.appendChild(b);
      return [b, id];
    });
    const title = el('div', 'fx-title');
    const search = el('input', 'fx-search');
    search.type = 'search';
    search.placeholder = 'Search';
    search.setAttribute('aria-label', 'Search projects');
    search.addEventListener('input', () => { query = search.value.trim().toLowerCase(); render(); });
    bar.append(nav, views, title, search);
    // ── bilah tab ──
    const tabs = el('div', 'fx-tabs');
    const TABS = [['all', 'All Projects'], ['in progress', 'In Progress'], ['shipped', 'Shipped']];
    const tabBtns = TABS.map(([id, label]) => {
      const b = el('button', 'fx-tab', label);
      b.type = 'button';
      b.addEventListener('click', () => { scope = { kind: id, value: label }; render(); });
      tabs.appendChild(b);
      return [b, id];
    });
    // ── sidebar ──
    const side = el('div', 'fx-side');
    function sideGroup(name, items) {
      side.appendChild(el('h4', 'fx-sh', name));
      const list = el('div', 'fx-slist');
      items.forEach(([kind, value, map]) => {
        const b = el('button', 'fx-sitem');
        b.type = 'button';
        b.dataset.kind = kind;
        b.dataset.value = value;
        b.appendChild(window.PixelArt.render(map, 2));
        b.appendChild(el('span', null, value));
        b.addEventListener('click', () => { scope = { kind, value }; render(); });
        list.appendChild(b);
      });
      side.appendChild(list);
    }
    sideGroup('Places', [
      ['all', 'All Projects', 'folder'],
      ['in progress', 'In Progress', 'chip'],
      ['shipped', 'Shipped', 'trophy'],
    ]);
    const tagNames = [];
    projects.forEach((pr) => pr.tech.forEach((t) => {
      if (t.label && tagNames.indexOf(t.label) === -1) tagNames.push(t.label);
    }));
    sideGroup('Tags', tagNames.slice(0, 8).map((t) => ['tag', t, 'fileDoc']));
    const main = el('div', 'fx-main');
    const status = el('div', 'fx-status');
    const body = el('div', 'fx-body');
    body.append(side, main);
    root.append(bar, tabs, body, status);
    function matches(pr) {
      if (scope.kind === 'in progress' || scope.kind === 'shipped') {
        if (pr.status !== scope.kind) return false;
      } else if (scope.kind === 'tag') {
        if (!pr.tech.some((t) => t.label === scope.value)) return false;
      }
      if (!query) return true;
      const hay = [pr.title, pr.desc, pr.kind, pr.status]
        .concat(pr.tech.map((t) => t.label)).join(' ').toLowerCase();
      return hay.indexOf(query) !== -1;
    }
    function openFile(pr) { window.AppWins.open(`ql:${projects.indexOf(pr)}`); }
    function iconView(list) {
      const grid = el('div', 'fx-grid');
      list.forEach((pr) => {
        const f = el('button', 'file');
        f.type = 'button';
        f.setAttribute('aria-label', `Quick Look: ${pr.title}`);
        f.appendChild(window.PixelArt.render('fileDoc', 2));
        f.appendChild(el('span', 'file-name', pr.title));
        f.appendChild(el('i', `file-tag st-${pr.status.replace(' ', '-')}`, pr.status));
        f.addEventListener('click', () => openFile(pr));
        grid.appendChild(f);
      });
      return grid;
    }
    function listView(list) {
      const tbl = el('div', 'fx-list');
      tbl.setAttribute('role', 'table');
      const head = el('div', 'fx-lrow fx-lhead');
      ['Name', 'Kind', 'Tech', 'Status'].forEach((h) => head.appendChild(el('span', null, h)));
      tbl.appendChild(head);
      list.forEach((pr) => {
        const row = el('button', 'fx-lrow');
        row.type = 'button';
        row.setAttribute('aria-label', `Quick Look: ${pr.title}`);
        const nameCell = el('span', 'fx-lname');
        nameCell.appendChild(window.PixelArt.render('fileDoc', 1));
        nameCell.appendChild(el('span', null, pr.title));
        row.append(nameCell, el('span', null, pr.kind || ''),
          el('span', 'fx-ltech', pr.tech.map((t) => t.label).join(', ')),
          el('span', `fx-lstat st-${pr.status.replace(' ', '-')}`, pr.status));
        row.addEventListener('click', () => openFile(pr));
        tbl.appendChild(row);
      });
      return tbl;
    }
    function render() {
      const list = projects.filter(matches);
      title.textContent = scope.value;
      viewBtns.forEach(([b, id]) => b.setAttribute('aria-pressed', String(id === view)));
      tabBtns.forEach(([b, id]) => b.setAttribute('aria-selected', String(id === scope.kind)));
      side.querySelectorAll('.fx-sitem').forEach((b) => {
        b.setAttribute('aria-current',
          String(b.dataset.kind === scope.kind && b.dataset.value === scope.value));
      });
      main.replaceChildren(list.length ? (view === 'icon' ? iconView(list) : listView(list))
        : el('p', 'fx-empty', query ? `Nothing matches \u201c${query}\u201d.` : 'Nothing here.'));
      const total = projects.length;
      const shipped = projects.filter((x) => x.status === 'shipped').length;
      status.textContent = list.length === total
        ? `${total} items \u00b7 ${shipped} shipped \u00b7 ${total - shipped} in progress`
        : `${list.length} of ${total} items shown`;
    }
    render();
    return root;
  }
  function launcherFor(group) {
    const grid = el('div', 'launcher');
    window.AppWins.GROUPS[group].forEach((id) => {
      const def = window.AppWins.DEFS[id];
      const b = el('button', 'launch-btn');
      b.appendChild(window.PixelArt.render(def.icon, 2));
      b.appendChild(document.createTextNode(def.title.split(' — ')[1] || def.title));
      b.addEventListener('click', () => window.AppWins.open(id));
      grid.appendChild(b);
    });
    return grid;
  }
  (function renderProjects() {
    const p = document.getElementById('panel-projects');
    const COLORS = ['#e0662f', '#4a90d9', '#d9a616', '#7c5cc4', '#8fb83a', '#c94867', '#2fa392'];
    p.appendChild(h2icon('folder', 'Projects'));
    p.appendChild(el('p', 'bio', 'Opening the project suite — each app shows my work from a different angle.'));
    p.appendChild(launcherFor('projects'));
    p.appendChild(el('p', 'launch-hint', 'Tip: drag the windows around · click one to bring it to front · Esc or × closes it'));

    // Finder betulan: toolbar + tab + sidebar + pencarian + dua mode tampilan.
    p.appendChild(buildFinder(D.projects));
  })();
  // Tab Skills sebagai monitor sistem ala btop: meter per domain, komposisi,
  // catatan rekam jejak, dan tabel proses yang bisa diurutkan.
  // Angkanya dari level di data.js — penilaian sendiri, bukan telemetri, dan
  // itu ditulis apa adanya di kaki panel.
  function buildBtop(groups, stats, projects) {
    const root = el('section', 'bt');
    root.setAttribute('aria-label', 'Skills, as a system monitor');
    const flat = [];
    groups.forEach((g) => g.items.forEach((it) => flat.push({
      name: it.label, group: g.group, level: it.level, icon: it.icon || null,
    })));
    const pct = (lvl) => Math.round((lvl / 5) * 100);
    const cls = (lvl) => (lvl >= 5 ? 'hi' : (lvl >= 4 ? 'mid' : 'lo'));
    // meter bertangga: kotak-kotak terpisah, bukan bar mulus
    function meter(lvl, cells) {
      const m = el('span', `bt-meter ${cls(lvl)}`);
      const n = cells || 10;
      const on = Math.round((lvl / 5) * n);
      for (let i = 0; i < n; i += 1) m.appendChild(el('i', i < on ? 'on' : null));
      return m;
    }
    const head = el('div', 'bt-head');
    head.append(el('b', null, 'daffa@portfolio'), el('span', null, 'btop++ \u00b7 skills'),
      el('i', null, `${flat.length} tracked`));
    root.appendChild(head);
    const grid = el('div', 'bt-grid');
    function box(title, cl) {
      const b = el('div', `bt-box ${cl || ''}`);
      b.appendChild(el('h4', null, title));
      return b;
    }
    // ── domain: rata-rata level tiap kelompok ──
    const cpu = box('domains', 'bt-cpu');
    groups.forEach((g) => {
      const avg = g.items.reduce((n, i) => n + i.level, 0) / g.items.length;
      const row = el('div', 'bt-row');
      row.append(el('span', 'bt-k', g.group), meter(avg, 14),
        el('b', 'bt-v', `${pct(avg)}%`));
      cpu.appendChild(row);
    });
    grid.appendChild(cpu);
    // ── komposisi: berapa banyak keahlian per kelompok ──
    const mem = box('composition', 'bt-mem');
    const bar = el('div', 'bt-stack');
    groups.forEach((g, i) => {
      const seg = el('i', `seg s${i}`);
      seg.style.flexGrow = String(g.items.length);
      seg.title = `${g.group}: ${g.items.length}`;
      bar.appendChild(seg);
    });
    mem.appendChild(bar);
    const legend = el('div', 'bt-legend');
    groups.forEach((g, i) => {
      const l = el('span', 'bt-leg');
      l.append(el('i', `dot s${i}`), el('span', null, `${g.group} ${g.items.length}`));
      legend.appendChild(l);
    });
    mem.appendChild(legend);
    grid.appendChild(mem);
    // ── rekam jejak: angka yang memang ada datanya ──
    const rec = box('record', 'bt-rec');
    const shipped = projects.filter((x) => x.status === 'shipped').length;
    const rows = stats.map((st) => [st.short || st.label, st.number])
      .concat([['PROJ', String(projects.length)], ['SHIP', String(shipped)]]);
    rows.forEach(([k, v]) => {
      const r = el('div', 'bt-row');
      r.append(el('span', 'bt-k', k), el('b', 'bt-v', v));
      rec.appendChild(r);
    });
    grid.appendChild(rec);
    root.appendChild(grid);
    // ── tabel proses ──
    const proc = el('div', 'bt-proc');
    const COLS = [['name', 'NAME'], ['group', 'GRP'], ['level', 'LVL'], ['use', 'USE%']];
    let sortKey = 'level';
    let desc = true;
    const head2 = el('div', 'bt-prow bt-phead');
    COLS.forEach(([key, label]) => {
      const b = el('button', 'bt-th', label);
      b.type = 'button';
      b.addEventListener('click', () => {
        if (sortKey === key) desc = !desc; else { sortKey = key; desc = key !== 'name'; }
        draw();
      });
      head2.appendChild(b);
    });
    head2.appendChild(el('span', 'bt-th-static', 'LOAD'));
    const rowsWrap = el('div', 'bt-prows');
    proc.append(head2, rowsWrap);
    function draw() {
      head2.querySelectorAll('.bt-th').forEach((b, i) => {
        b.setAttribute('aria-pressed', String(COLS[i][0] === sortKey));
      });
      const list = flat.slice().sort((a2, b2) => {
        let r = 0;
        if (sortKey === 'name') r = a2.name.localeCompare(b2.name);
        else if (sortKey === 'group') r = a2.group.localeCompare(b2.group);
        else r = a2.level - b2.level;
        if (r === 0) r = a2.name.localeCompare(b2.name);
        return desc ? -r : r;
      });
      rowsWrap.replaceChildren();
      list.forEach((it, i) => {
        const r = el('div', 'bt-prow');
        const nm = el('span', 'bt-pname');
        if (it.icon) {
          // ikon bahasa/tool itu berkas SVG di assets/icons/tech, bukan peta
          // pixel — PixelArt.render tidak mengenalinya
          const img = el('img');
          img.src = `assets/icons/tech/${it.icon}.svg`;
          img.alt = ''; img.width = 12; img.height = 12;
          nm.appendChild(img);
        }
        nm.appendChild(el('span', null, it.name));
        r.append(nm, el('span', 'bt-pgrp', it.group),
          el('span', `bt-plvl ${cls(it.level)}`, String(it.level)),
          el('span', 'bt-puse', `${pct(it.level)}`), meter(it.level, 12));
        r.style.setProperty('--i', String(i));
        rowsWrap.appendChild(r);
      });
    }
    draw();
    root.appendChild(proc);
    root.appendChild(el('p', 'bt-foot',
      'Levels are self-rated, not measured \u2014 this panel is a readout of how I would place myself, not telemetry.'));
    return root;
  }
  (function renderSkills() {
    const p = document.getElementById('panel-skills');
    p.appendChild(buildBtop(D.skills, D.stats, D.projects));
    p.appendChild(h2icon('chip', 'Toolbox'));
    p.appendChild(el('p', 'bio', 'The same skills, opened in their natural habitat — a very busy desktop.'));
    p.appendChild(launcherFor('skills'));
    p.appendChild(el('p', 'launch-hint', 'Tip: drag the windows around · click one to bring it to front · Esc or × closes it'));
  })();
  (function renderContact() {
    const p = document.getElementById('panel-contact');
    p.classList.add('contact-center');
    const h = el('h1', 'display h2i', "LET'S CONNECT");
    h.style.fontSize = '28px';
    h.prepend(window.PixelArt.render('mail', 2));
    // mesh ala Tailscale: Smoky sebagai relay node di atas, tiga peer di bawah
    const mesh = el('div', 'mesh');
    const guard = el('button', 'contact-smoky');
    guard.setAttribute('aria-label', 'Smoky guards the inbox — click him');
    guard.title = 'psst... click Smoky';
    guard.appendChild(window.PixelArt.render('catBox', 4));
    guard.appendChild(el('span', 'char-partner', 'Smoky guards the inbox'));
    guard.addEventListener('click', () => window.AppWins.open('idcard'));
    const stem = el('div', 'mesh-stem');
    const rail = el('div', 'mesh-rail');
    const drops = el('div', 'mesh-drops');
    drops.append(el('i'), el('i'), el('i'));
    const btns = el('div', 'contact-btns mesh-peers');
    [
      { cls: 'peer-gmail', icon: 'gmail', label: 'Email', href: `mailto:${D.socials.email}` },
      { cls: 'peer-github', icon: 'github', label: 'GitHub', href: D.socials.github, ext: true },
      { cls: 'peer-linkedin', icon: 'linkedin', label: 'LinkedIn', href: D.socials.linkedin, ext: true },
    ].forEach((p) => {
      const a = el('a', `pxbtn big peer ${p.cls}`);
      a.href = p.href;
      if (p.ext) { a.target = '_blank'; a.rel = 'noreferrer'; }
      a.appendChild(window.PixelArt.render(p.icon, 2));
      a.appendChild(el('span', null, p.label));
      btns.appendChild(a);
    });
    mesh.append(guard, stem, rail, drops, btns);
    p.append(h,
      el('p', 'bio', `${D.availability} ${D.replyNote}`),
      mesh,
      el('p', 'mesh-status', '● 3 peers connected · 0 offline · relay: smoky.local · last handshake: just now'),
      el('p', 'fineprint', "© 2026 Daffa Adika · tech icons: Jerry's Pixel Icons (MIT)"));
  })();

  (function buildDock() {
    const dock = document.getElementById('dock');
    const items = [
      { map: 'about', tab: 'about', label: 'About' },
      { map: 'folder', tab: 'projects', label: 'Projects' },
      { map: 'chip', tab: 'skills', label: 'Skills' },
      { map: 'mail', tab: 'contact', label: 'Contact' },
      { map: 'term', app: 'terminal', label: 'Terminal' },
      { map: 'spotify', app: 'spotify', label: 'Spotify' },
      { map: 'iconChat', app: 'smokychat', label: 'Chat with Smoky' },
      { map: 'iconGear', app: 'settings', label: 'System Settings' },
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
      else if (it.app) { btn.addEventListener('click', () => window.AppWins.open(it.app)); }
      else { btn.dataset.tab = it.tab; btn.addEventListener('click', () => { location.hash = it.tab; }); }
      btn.appendChild(window.PixelArt.render(it.map, 2));
      dock.appendChild(btn);
    });
    document.addEventListener('tabshown', (e) => {
      dock.querySelectorAll('.dock-item[data-tab]').forEach((b) =>
        b.classList.toggle('active', b.dataset.tab === e.detail.id));
    });
  })();

  (function trafficLights() {
    const toast = el('div', 'toast');
    toast.hidden = true;
    toast.setAttribute('role', 'status');
    document.body.appendChild(toast);
    let toastTimer;
    win.querySelector('.tl-red').addEventListener('click', () => {
      win.classList.remove('shake'); void win.offsetWidth; win.classList.add('shake');
      toast.hidden = false; toast.textContent = 'nice try 😏';
      clearTimeout(toastTimer); toastTimer = setTimeout(() => { toast.hidden = true; }, 1800);
    });
    win.querySelector('.tl-yellow').addEventListener('click', () => {
      win.classList.add('minimized');
      document.getElementById('dock').classList.add('holds-window');
      const d = document.querySelector('#dock .dock-item.active[data-tab]')
        || document.querySelector('#dock .dock-item[data-tab]');
      if (d) d.focus();
    });
    win.querySelector('.tl-green').addEventListener('click', () => win.classList.toggle('maximized'));
    restoreMainWindow = function restore() {
      const wasMin = win.classList.contains('minimized');
      win.classList.remove('minimized');
      document.getElementById('dock').classList.remove('holds-window');
      if (wasMin) {
        const tab = document.getElementById(`tab-${location.hash.replace('#', '') || 'about'}`);
        if (tab) tab.focus();
      }
    };
    document.addEventListener('tabshown', restoreMainWindow);
    document.getElementById('dock').addEventListener('click', (e) => {
      if (e.target.closest('[data-tab]')) restoreMainWindow();
    });
  })();

  // tab Projects/Skills membuka jendela "aplikasi"; tab lain menutupnya.
  // Terminal independen dari tab — tetap terbuka sampai ditutup sendiri.
  document.addEventListener('tabshown', (e) => {
    if (!window.AppWins) return;
    window.AppWins.closeAll(['terminal', 'spotify']);
    const group = window.AppWins.GROUPS[e.detail.id];
    if (!group) return;
    if (window.Prefs && window.Prefs.isBlocked()) {
      // dihitung supaya jumlahnya bisa ditampilkan di jendela Settings
      window.Prefs.noteBlocked(group.length);
      return;
    }
    window.AppWins.openGroup(e.detail.id);
  });

  // haptic "boing" — semua kontrol utama membal sesaat setelah diklik
  document.addEventListener('click', (e) => {
    const t = e.target.closest('.tab, .dock-item, .pxbtn, .traffic-lights button, .smoky-btn, .wheel-chip');
    if (!t) return;
    t.classList.remove('boing');
    void t.offsetWidth;
    t.classList.add('boing');
  });

  // sapaan untuk siapa pun yang membuka DevTools
  try {
    console.log([
      "    ██                    ██",
      "  ██▓▓██                ██▓▓██",
      "  ██▓▓▓▓██            ██▓▓▓▓██",
      "  ██▓▓▓▓▓▓████████████▓▓▓▓▓▓██",
      "██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██",
      "██▓▓▓▓░░░░▓▓▓▓▓▓▓▓▓▓▓▓░░░░▓▓▓▓██",
      "██▓▓▓▓░░░░▓▓▓▓▓▓▓▓▓▓▓▓░░░░▓▓▓▓██",
      "██▓▓▓▓▓▓▓▓▓▓▓▓▓▓██▓▓▓▓▓▓▓▓▓▓▓▓██",
      "  ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██",
      "  ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██",
      "██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██",
      "██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██",
      "██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██",
      "██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██",
      "  ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██",
      "    ████████████████████████",
      "",
      "  Hai, developer. Ketemu juga di sini.",
      "  Buka Terminal di dock situs ini, lalu ketik:",
      "  ascii · ascii smoky · smoky · sudo hire-me",
      "",
    ].join('\n'));
    console.log('%c' + D.socials.email + ' \u00b7 ' + D.status,
      'font-weight:bold;color:#1db954');
  } catch (e) { /* konsol tidak tersedia */ }
  window.App = { showTab, TABS };
  fromHash();
})();
