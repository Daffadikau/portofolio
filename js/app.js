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

  window.App = { showTab, TABS };
  fromHash();
})();
