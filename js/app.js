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
  // Tombol ala ekstensi browser di ujung kanan: memblokir jendela aplikasi
  // yang biasanya muncul sendiri tiap pindah tab.
  let popupsBlocked = false;
  try { popupsBlocked = localStorage.getItem('popup-blocked') === '1'; } catch (e) { /* ignore */ }
  let blockedCount = 0;
  const adBtn = el('button', 'ext-btn');
  adBtn.type = 'button';
  adBtn.appendChild(window.PixelArt.render('iconShield', 2));
  const adBadge = el('span', 'ext-badge');
  adBadge.hidden = true;
  adBtn.appendChild(adBadge);
  function syncAd() {
    adBtn.setAttribute('aria-pressed', String(popupsBlocked));
    adBtn.title = popupsBlocked
      ? 'Pop-up windows blocked. Click to allow them again.'
      : 'Windows open by themselves. Click to block them.';
    adBtn.setAttribute('aria-label', adBtn.title);
    adBadge.hidden = !(popupsBlocked && blockedCount);
    adBadge.textContent = String(blockedCount);
  }
  adBtn.addEventListener('click', () => {
    popupsBlocked = !popupsBlocked;
    if (!popupsBlocked) blockedCount = 0;
    try { localStorage.setItem('popup-blocked', popupsBlocked ? '1' : '0'); } catch (e) { /* ignore */ }
    syncAd();
    // langsung terasa: menyalakan menutup yang terbuka, mematikan membukanya
    const tab = location.hash.replace('#', '') || 'about';
    if (window.AppWins) {
      if (popupsBlocked) window.AppWins.closeAll(['terminal', 'spotify']);
      else if (window.AppWins.GROUPS[tab]) window.AppWins.openGroup(tab);
    }
  });
  syncAd();
  titlebar.append(lights, tabbar, adBtn);

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
      infoName.textContent = a.title;
      infoMeta.textContent = `${a.org} · ${a.when} · ${a.rarity}`;
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
      const face = el('span', 'joker-face');
      face.append(
        el('span', 'joker-year', a.when),
        (() => { const art = el('span', 'joker-art'); art.appendChild(window.PixelArt.render(a.icon || 'trophy', 3)); return art; })(),
        el('span', 'joker-name', a.title),
      );
      c.append(face, el('span', 'joker-rar', a.rarity || 'common'));
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
    counter.append(
      el('b', null, String(list.length)),
      el('span', null, 'jokers held'),
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
    stage.appendChild(window.PixelArt.render('flatApartment', 6));
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

    // area Finder: tiap project sebagai berkas, klik untuk Quick Look
    p.appendChild(h2icon('about', 'All files'));
    const finder = el('div', 'finder');
    D.projects.forEach((pr, i) => {
      const f = el('button', 'file');
      f.setAttribute('aria-label', `Quick Look: ${pr.title}`);
      f.appendChild(window.PixelArt.render('fileDoc', 2));
      f.appendChild(el('span', 'file-name', pr.title));
      const tag = el('i', 'file-tag', i < 2 ? 'in progress' : 'shipped');
      tag.style.background = COLORS[i % COLORS.length];
      f.appendChild(tag);
      f.addEventListener('click', () => window.AppWins.open(`ql:${i}`));
      finder.appendChild(f);
    });
    p.appendChild(finder);
    const shipped = D.projects.length - 2;
    p.appendChild(el('div', 'finder-status',
      `${D.projects.length} items · ${shipped} shipped · 2 in progress · click a file for Quick Look`));
  })();
  (function renderSkills() {
    const p = document.getElementById('panel-skills');
    const C = D.character;
    const card = el('div', 'char-card');
    const portrait = el('div', 'char-portrait');
    window.Smoky.attach(portrait, 5);
    portrait.appendChild(el('span', 'char-partner', `${C.partner.name} · Lv.${C.partner.powerLevel}`));
    const info = el('div', 'char-info');
    const nameRow = el('div', 'char-name');
    nameRow.append(
      el('span', 'display char-display', D.name),
      el('span', 'char-lv', `LV ${C.level} (${C.levelLabel})`),
    );
    const hearts = el('div', 'char-hearts');
    hearts.setAttribute('role', 'img');
    function renderHearts(n) {
      hearts.setAttribute('aria-label', `Smoky affection: ${n} of 5 hearts`);
      hearts.replaceChildren();
      for (let i = 1; i <= 5; i += 1) hearts.appendChild(el('span', i <= n ? 'hh on' : 'hh', i <= n ? '♥' : '♡'));
    }
    renderHearts(window.Smoky.getHearts());
    window.Smoky.onHearts(renderHearts);
    const care = el('div', 'care-btns');
    [['feed', 'fish', 'FEED'], ['brush', 'brush', 'BRUSH'], ['play', 'ball', 'PLAY']].forEach(([kind, map, label]) => {
      const b = el('button', 'pxbtn care');
      b.appendChild(window.PixelArt.render(map, 2));
      b.appendChild(el('span', null, label));
      b.addEventListener('click', () => window.Smoky.interact(kind));
      care.appendChild(b);
    });
    info.append(nameRow, el('p', 'char-class', `CLASS: ${C.class}`), hearts, care);
    card.append(portrait, info);
    const snd = el('button', 'pxbtn care', `SOUND: ${window.Smoky.sfx.isMuted() ? 'OFF' : 'ON'}`);
    snd.setAttribute('aria-pressed', String(!window.Smoky.sfx.isMuted()));
    snd.addEventListener('click', () => {
      const muted = window.Smoky.sfx.toggle();
      snd.textContent = `SOUND: ${muted ? 'OFF' : 'ON'}`;
      snd.setAttribute('aria-pressed', String(!muted));
    });
    care.appendChild(snd);
    // wardrobe: dandani Smoky — berlaku juga untuk Smoky di tab About
    const SLOTS = [['hat', 'Hat'], ['outfit', 'Outfit'], ['acc', 'Accessory']];
    const wardrobe = el('div', 'wardrobe');
    SLOTS.forEach(([slot, label]) => {
      const row = el('div', 'wr-slot');
      row.appendChild(el('span', 'wr-label', label));
      const opts = el('div', 'wr-opts');
      opts.setAttribute('role', 'group');
      opts.setAttribute('aria-label', `${label} options for Smoky`);
      window.Smoky.WARDROBE[slot].forEach((item) => {
        const b = el('button', 'wr-opt', item.label);
        b.dataset.slot = slot;
        b.dataset.item = item.id;
        // barang rahasia tampil sebagai ??? sampai dibuka lewat easter egg
        if (item.secret) {
          b.dataset.secret = '1';
          b.dataset.label = item.label;
          const lockIt = () => {
            const open = window.Smoky.isUnlocked(item.id);
            b.textContent = open ? item.label : '???';
            b.disabled = !open;
            b.title = open ? item.label : 'Locked. Something unlocks this.';
          };
          lockIt();
          window.Smoky.onUnlock(lockIt);
        }
        b.addEventListener('click', () => window.Smoky.wear(slot, item.id));
        opts.appendChild(b);
      });
      row.appendChild(opts);
      wardrobe.appendChild(row);
    });
    function syncWardrobe(w) {
      wardrobe.querySelectorAll('.wr-opt').forEach((b) => {
        b.setAttribute('aria-pressed', String(w[b.dataset.slot] === b.dataset.item));
      });
    }
    syncWardrobe(window.Smoky.getWorn());
    window.Smoky.onOutfit(syncWardrobe);

    p.append(h2icon('about', 'Character'), card,
      h2icon('cap', 'Wardrobe'),
      el('p', 'bio', 'Dress Smoky up — whatever he wears here is what he wears everywhere.'),
      wardrobe,
      h2icon('chip', 'Toolbox'));
    p.appendChild(el('p', 'bio', 'My skills, opened in their natural habitat — a very busy desktop.'));
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
    if (popupsBlocked) {
      // dihitung supaya lencananya menunjukkan berapa yang dicegah
      blockedCount += group.length;
      syncAd();
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
