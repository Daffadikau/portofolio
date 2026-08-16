(function () {
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };
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
  urlBar.append(el('span', 'url-lock', '🔒'), el('span', 'url-text', 'daffa.dev'));
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
    urlText.textContent = `daffa.dev/${id === 'about' ? '' : id}`;
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
    const n = Number(e.key);
    if (n >= 1 && n <= TABS.length) {
      const id = TABS[n - 1];
      if ((location.hash.replace('#', '') || 'about') === id) showTab(id);
      else location.hash = id;
    }
  });

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
    hero.append(art, head);
    const stats = el('div', 'stats');
    D.stats.forEach((s) => {
      const d = el('div', 'stat');
      d.append(el('b', null, s.number), el('span', null, s.label));
      stats.appendChild(d);
    });
    p.append(hero, el('p', 'bio', D.bio), stats,
      h2icon('cap', 'Education'),
      el('p', null, `${D.education.program} — ${D.education.school}, ${D.education.detail}`),
      h2icon('case', 'Experience'));
    D.experience.forEach((x) => {
      const d = el('div', 'xp');
      d.append(el('h3', null, `${x.role} · ${x.org}`), el('span', 'period', x.period));
      const ul = el('ul');
      x.points.forEach((pt) => ul.appendChild(el('li', null, pt)));
      d.appendChild(ul);
      p.appendChild(d);
    });
    p.appendChild(h2icon('trophy', 'Honors & Awards'));
    const ul = el('ul', 'awards');
    D.awards.forEach((a) => {
      const li = el('li');
      li.append(el('b', null, a.title), document.createTextNode(` — ${a.org} `), el('span', 'period', a.when));
      ul.appendChild(li);
    });
    p.appendChild(ul);
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
    p.appendChild(h2icon('folder', 'Projects'));
    p.appendChild(el('p', 'bio', 'Opening the project suite — each app shows my work from a different angle.'));
    p.appendChild(launcherFor('projects'));
    p.appendChild(el('p', 'launch-hint', 'Tip: drag the windows around · click one to bring it to front · Esc or × closes it'));
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
    p.append(h2icon('about', 'Character'), card, h2icon('chip', 'Toolbox'));
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
    guard.setAttribute('aria-label', 'Smoky in his cardboard box — click him');
    guard.title = 'psst... click Smoky';
    guard.appendChild(window.PixelArt.render('catBox', 4));
    guard.appendChild(el('span', 'char-partner', 'Smoky guards the inbox'));
    guard.addEventListener('click', () => window.AppWins.open('idcard'));
    const stem = el('div', 'mesh-stem');
    const rail = el('div', 'mesh-rail');
    const drops = el('div', 'mesh-drops');
    drops.append(el('i'), el('i'), el('i'));
    const btns = el('div', 'contact-btns mesh-peers');
    const mail = el('a', 'pxbtn big peer', '✉ Email');
    mail.href = `mailto:${D.socials.email}`;
    [mail, extLink('pxbtn big peer', 'GitHub', D.socials.github),
      extLink('pxbtn big peer', 'LinkedIn', D.socials.linkedin)]
      .forEach((b) => { b.prepend(el('span', 'peer-dot')); btns.appendChild(b); });
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
    function restore() {
      const wasMin = win.classList.contains('minimized');
      win.classList.remove('minimized');
      document.getElementById('dock').classList.remove('holds-window');
      if (wasMin) {
        const tab = document.getElementById(`tab-${location.hash.replace('#', '') || 'about'}`);
        if (tab) tab.focus();
      }
    }
    document.addEventListener('tabshown', restore);
    document.getElementById('dock').addEventListener('click', (e) => {
      if (e.target.closest('[data-tab]')) restore();
    });
  })();

  // tab Projects/Skills membuka jendela "aplikasi"; tab lain menutupnya.
  // Terminal independen dari tab — tetap terbuka sampai ditutup sendiri.
  document.addEventListener('tabshown', (e) => {
    if (!window.AppWins) return;
    window.AppWins.closeAll(['terminal']);
    if (e.detail.id === 'projects') window.AppWins.openGroup('projects');
    else if (e.detail.id === 'skills') window.AppWins.openGroup('skills');
    else if (e.detail.id === 'contact') window.AppWins.openGroup('contact');
  });

  // haptic "boing" — semua kontrol utama membal sesaat setelah diklik
  document.addEventListener('click', (e) => {
    const t = e.target.closest('.tab, .dock-item, .pxbtn, .traffic-lights button, .smoky-btn, .wheel-chip');
    if (!t) return;
    t.classList.remove('boing');
    void t.offsetWidth;
    t.classList.add('boing');
  });

  window.App = { showTab, TABS };
  fromHash();
})();
