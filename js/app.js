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

  window.App = { showTab, TABS };
  fromHash();
})();
