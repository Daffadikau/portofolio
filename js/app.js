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

  const TABS = ['about', 'projects', 'skills', 'contact', 'terminal'];
  const LABELS = { about: 'About', projects: 'Projects', skills: 'Skills', contact: 'Contact', terminal: '>_ Terminal' };
  const win = document.getElementById('window');

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
    });
    document.dispatchEvent(new CustomEvent('tabshown', { detail: { id } }));
  }
  function fromHash() { showTab(location.hash.replace('#', '') || 'about'); }
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
    if (n >= 1 && n <= TABS.length) location.hash = TABS[n - 1];
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
    const likes = el('div', 'tags likes');
    D.character.interests.forEach((it) => likes.appendChild(el('span', 'tag badge', `♥ ${it}`)));
    head.appendChild(likes);
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
    const C = D.character;
    const card = el('div', 'char-card');
    const portrait = el('div', 'char-portrait');
    portrait.appendChild(window.PixelArt.render('cat', 5));
    portrait.appendChild(el('span', 'char-partner', `${C.partner.name} · Lv.${C.partner.powerLevel}`));
    const info = el('div', 'char-info');
    const nameRow = el('div', 'char-name');
    nameRow.append(
      el('span', 'display char-display', D.name),
      el('span', 'char-lv', `LV ${C.level} (${C.levelLabel})`),
    );
    const hearts = el('div', 'char-hearts');
    hearts.setAttribute('role', 'img');
    hearts.setAttribute('aria-label', `motivation: ${C.hearts} of 5 hearts`);
    for (let i = 1; i <= 5; i += 1) hearts.appendChild(el('span', i <= C.hearts ? 'hh on' : 'hh', i <= C.hearts ? '♥' : '♡'));
    const likes = el('div', 'tags');
    C.interests.forEach((it) => likes.appendChild(el('span', 'tag badge', `★ ${it}`)));
    info.append(nameRow, el('p', 'char-class', `CLASS: ${C.class}`), hearts, likes);
    card.append(portrait, info);
    p.append(el('h2', null, 'Character'), card, el('h2', null, 'Status'));
    D.skills.forEach((g) => {
      p.appendChild(el('h3', 'stat-group', g.group));
      const wrap = el('div', 'skillgrid');
      g.items.forEach((s) => {
        const row = el('div', 'skill');
        row.appendChild(techTag(s));
        const bar = el('div', 'bar');
        bar.setAttribute('role', 'img');
        bar.setAttribute('aria-label', `${s.label} proficiency: ${s.level} of 5`);
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
      el('p', 'bio', `${D.availability} ${D.replyNote}`),
      btns,
      el('p', 'fineprint', "© 2026 Daffa Adika · tech icons: Jerry's Pixel Icons (MIT)"));
  })();

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
    window.addEventListener('hashchange', restore);
    document.getElementById('dock').addEventListener('click', (e) => {
      if (e.target.closest('[data-tab]')) restore();
    });
  })();

  window.App = { showTab, TABS };
  fromHash();
})();
