// AppWins — window manager mini: tab Projects/Skills memunculkan jendela
// "aplikasi" pixel (Excel, Word, Notion, VS Code, IntelliJ, Docker, Wireshark)
// yang overlay di atas window utama. Draggable, closable, klik = ke depan.
(function () {
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const D = window.PORTFOLIO_DATA;
  const TAGCOLORS = ['#e0662f', '#4a90d9', '#d9a616', '#7c5cc4', '#8fb83a', '#c94867', '#2fa392'];

  function table(cls, headers, rows) {
    const t = el('table', cls);
    const thead = el('tr');
    headers.forEach((h) => thead.appendChild(el('th', null, h)));
    t.appendChild(thead);
    rows.forEach((r) => {
      const tr = el('tr');
      r.forEach((c) => tr.appendChild(c instanceof Node ? (() => { const td = el('td'); td.appendChild(c); return td; })() : el('td', null, c)));
      t.appendChild(tr);
    });
    return t;
  }
  function codeLine(parts) {
    const line = el('div', 'code-line');
    parts.forEach(([cls, text]) => line.appendChild(el('span', cls, text)));
    return line;
  }
  const lvBar = (lv) => '█'.repeat(lv) + '░'.repeat(5 - lv);

  // ---- builders ----
  function buildExcel(body) {
    const fx = el('div', 'xl-formula');
    fx.append(el('b', null, 'fx'), el('span', null, '=PORTFOLIO(A1:C8)'));
    body.appendChild(fx);
    const rows = D.projects.map((p, i) => [
      String(i + 2), p.title,
      p.tech.slice(0, 2).map((t) => t.label).join(', '),
      i === 0 ? 'In progress' : 'Shipped',
    ]);
    body.appendChild(table('xl-grid', ['', 'A · Project', 'B · Stack', 'C · Status'],
      [['1', 'PROJECT', 'STACK', 'STATUS'], ...rows]));
  }
  function buildWord(body) {
    const ribbon = el('div', 'wd-ribbon');
    ['File', 'Home', 'Insert', 'Layout', 'Help'].forEach((m) => ribbon.appendChild(el('span', null, m)));
    body.appendChild(ribbon);
    const page = el('div', 'wd-page');
    page.appendChild(el('h3', null, 'Project Highlights'));
    D.projects.slice(0, 2).forEach((p) => {
      page.appendChild(el('h4', null, p.title));
      page.appendChild(el('p', null, p.desc));
    });
    page.appendChild(el('p', 'wd-note', 'Full list: see projects.xlsx →'));
    body.appendChild(page);
  }
  function buildNotion(body) {
    const wrap = el('div', 'nt-wrap');
    const side = el('div', 'nt-side');
    ['▸ Project Tracker', '▸ Ideas', '▸ Smoky’s naps'].forEach((s, i) => side.appendChild(el('div', i === 0 ? 'on' : null, s)));
    const main = el('div', 'nt-main');
    main.appendChild(el('h3', null, '📋 Project Tracker'));
    const board = el('div', 'nt-board');
    const cols = [['In Progress', D.projects.slice(0, 2)], ['Shipped', D.projects.slice(2)]];
    cols.forEach(([name, items]) => {
      const col = el('div', 'nt-col');
      col.appendChild(el('h4', null, `${name} · ${items.length}`));
      items.forEach((p) => {
        const idx = D.projects.indexOf(p);
        const card = el('div', 'nt-card');
        card.appendChild(el('span', null, p.title));
        const tag = el('i', 'nt-tag', p.tech[0].label);
        tag.style.background = TAGCOLORS[idx % TAGCOLORS.length];
        card.appendChild(tag);
        col.appendChild(card);
      });
      board.appendChild(col);
    });
    main.appendChild(board);
    wrap.append(side, main);
    body.appendChild(wrap);
  }
  function buildVSCode(body) {
    const strip = el('div', 'vs-tabs');
    strip.append(el('span', 'on', 'languages.ts'), el('span', null, 'smoky.ts'));
    body.appendChild(strip);
    const code = el('div', 'vs-code');
    code.appendChild(codeLine([['tok-kw', 'export const'], ['tok-var', ' languages'], ['tok-p', ' = {']]));
    D.skills[0].items.forEach((s) => {
      code.appendChild(codeLine([
        ['tok-key', `  ${s.label.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`],
        ['tok-p', ': '], ['tok-str', `'${lvBar(s.level)}'`], ['tok-p', ','],
      ]));
    });
    code.appendChild(codeLine([['tok-p', '};'], ['tok-cm', '  // fluency, 5 = daily driver']]));
    body.appendChild(code);
  }
  function buildIdea(body) {
    const strip = el('div', 'ij-tabs');
    strip.append(el('span', 'on', 'skills_ai.py'), el('span', null, 'train.py'));
    body.appendChild(strip);
    const code = el('div', 'ij-code');
    code.appendChild(codeLine([['tok-var', 'AI_SKILLS'], ['tok-p', ' = {']]));
    D.skills[2].items.forEach((s) => {
      code.appendChild(codeLine([
        ['tok-str', `  "${s.label.toLowerCase().replace(/[^a-z0-9]+/g, '_')}"`],
        ['tok-p', ': '], ['tok-num', String(s.level)], ['tok-p', ',  '], ['tok-cm', `# ${lvBar(s.level)}`],
      ]));
    });
    code.appendChild(codeLine([['tok-p', '}']]));
    code.appendChild(codeLine([['tok-cm', '# OMR grading model — accuracy 99.7%']]));
    body.appendChild(code);
  }
  function buildDocker(body) {
    const cpus = ['0.4%', '1.2%', '0.8%', '0.6%', '2.1%', '0.3%'];
    const rows = D.skills[3].items.map((s, i) => {
      const name = s.label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const st = el('span', 'dk-status');
      st.append(el('i'), document.createTextNode(' Running'));
      return [name, `${name}:latest`, st, cpus[i % cpus.length]];
    });
    body.appendChild(table('dk-grid', ['NAME', 'IMAGE', 'STATUS', 'CPU'], rows));
    body.appendChild(el('p', 'dk-note', '6 containers running · 0 stopped · uptime: since 2023'));
  }
  function buildWireshark(body) {
    const filter = el('div', 'ws-filter');
    filter.append(el('b', null, '⩓'), el('span', null, 'http || mqtt || icmp'));
    body.appendChild(filter);
    const rows = [
      ['1', '0.001', 'daffa.dev', 'recruiter.example', 'HTTP', 'GET /portfolio HTTP/1.1 200 OK', 'http'],
      ['2', '0.087', 'browser', 'daffa.dev', 'HTTP', 'GET /skills/react 304 Not Modified', 'http'],
      ['3', '0.132', 'browser', 'daffa.dev', 'HTTP', 'GET /skills/next.js 200 OK (prefetch)', 'http'],
      ['4', '0.420', 'esp32-testkit', 'daffa.dev', 'MQTT', 'PUBLISH gas_level=safe qos=1', 'mqtt'],
      ['5', '0.421', 'daffa.dev', 'esp32-testkit', 'MQTT', 'PUBACK — FastAPI ingested ✓', 'mqtt'],
      ['6', '1.337', 'smoky.local', 'daffa.dev', 'ICMP', 'Echo (meow) request', 'icmp'],
      ['7', '1.338', 'daffa.dev', 'smoky.local', 'ICMP', 'Echo (meow) reply ♥', 'icmp'],
    ];
    const t = table('ws-grid', ['No.', 'Time', 'Source', 'Destination', 'Proto', 'Info'],
      rows.map((r) => r.slice(0, 6)));
    [...t.querySelectorAll('tr')].slice(1).forEach((tr, i) => tr.classList.add(`ws-${rows[i][6]}`));
    body.appendChild(t);
  }

  // ---- defs & groups ----
  const DEFS = {
    excel: { title: 'projects.xlsx — Excel', skin: 'excel', icon: 'excel', w: 470, fx: 0.05, fy: 90, build: buildExcel },
    word: { title: 'report.docx — Word', skin: 'word', icon: 'word', w: 400, fx: 0.56, fy: 140, build: buildWord },
    notion: { title: 'Project Tracker — Notion', skin: 'notion', icon: 'notion', w: 460, fx: 0.24, fy: 330, build: buildNotion },
    vscode: { title: 'languages.ts — VS Code', skin: 'vscode', icon: 'vscode', w: 440, fx: 0.04, fy: 80, build: buildVSCode },
    idea: { title: 'skills_ai.py — IntelliJ IDEA', skin: 'idea', icon: 'idea', w: 430, fx: 0.58, fy: 120, build: buildIdea },
    docker: { title: 'Containers — Docker Desktop', skin: 'docker', icon: 'docker', w: 470, fx: 0.1, fy: 360, build: buildDocker },
    wireshark: { title: 'capture.pcapng — Wireshark', skin: 'wireshark', icon: 'wireshark', w: 540, fx: 0.42, fy: 430, build: buildWireshark },
  };
  const GROUPS = {
    projects: ['excel', 'word', 'notion'],
    skills: ['vscode', 'idea', 'docker', 'wireshark'],
  };

  const wins = new Map();
  let zTop = 39;
  const timers = [];

  function toFront(w) { zTop += 1; w.style.zIndex = zTop; }
  function close(id) { const w = wins.get(id); if (w) { w.remove(); wins.delete(id); } }

  function makeWin(id, def, idx) {
    const win = el('section', `appwin skin-${def.skin}`);
    const mobile = window.innerWidth <= 640;
    const width = mobile ? Math.min(def.w, window.innerWidth - 16) : def.w;
    win.style.width = `${width}px`;
    win.style.left = `${mobile ? 8 : Math.round(window.innerWidth * def.fx)}px`;
    win.style.top = `${mobile ? 64 + idx * 34 : def.fy}px`;
    win.setAttribute('role', 'dialog');
    win.setAttribute('aria-label', def.title);
    win.tabIndex = -1;

    const bar = el('div', 'appwin-bar');
    bar.appendChild(window.PixelArt.render(def.icon, 1));
    bar.appendChild(el('span', 'appwin-title', def.title));
    const closeBtn = el('button', 'appwin-close', '×');
    closeBtn.setAttribute('aria-label', `Close ${def.title}`);
    closeBtn.addEventListener('click', (e) => { e.stopPropagation(); close(id); });
    bar.appendChild(closeBtn);

    const body = el('div', 'appwin-body');
    def.build(body);
    win.append(bar, body);

    win.addEventListener('pointerdown', () => toFront(win));
    win.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(id); });
    bar.addEventListener('pointerdown', (e) => {
      if (e.target === closeBtn) return;
      const dx = e.clientX - win.offsetLeft;
      const dy = e.clientY - win.offsetTop;
      const move = (ev) => {
        win.style.left = `${Math.max(-width + 90, Math.min(window.innerWidth - 90, ev.clientX - dx))}px`;
        win.style.top = `${Math.max(0, Math.min(window.innerHeight - 50, ev.clientY - dy))}px`;
      };
      const up = () => {
        document.removeEventListener('pointermove', move);
        document.removeEventListener('pointerup', up);
      };
      document.addEventListener('pointermove', move);
      document.addEventListener('pointerup', up);
      e.preventDefault();
    });
    return win;
  }

  function open(id, idx = 0) {
    const def = DEFS[id];
    if (!def) return;
    const existing = wins.get(id);
    if (existing) { toFront(existing); return; }
    const w = makeWin(id, def, idx);
    wins.set(id, w);
    document.body.appendChild(w);
    toFront(w);
    w.classList.add('spawn');
  }
  function openGroup(name) {
    (GROUPS[name] || []).forEach((id, i) => {
      if (reduced) open(id, i);
      else timers.push(setTimeout(() => open(id, i), i * 140));
    });
  }
  function closeAll() {
    timers.forEach(clearTimeout);
    timers.length = 0;
    wins.forEach((w) => w.remove());
    wins.clear();
  }

  window.AppWins = { open, openGroup, closeAll, GROUPS, DEFS };
})();
