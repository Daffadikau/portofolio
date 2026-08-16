// AppWins — window manager mini: jendela "aplikasi" pixel yang overlay
// window utama. Draggable, closable, klik = ke depan. Terminal juga
// hidup di sini (dibuka dari dock). Beberapa app punya panel interaktif:
// VS Code (activity bar), Docker (sidebar), IntelliJ (tab file + Run).
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
  function codeLineIcon(iconName, parts) {
    const line = codeLine(parts);
    if (iconName) {
      const img = el('img');
      img.src = `assets/icons/tech/${iconName}.svg`;
      img.alt = ''; img.width = 13; img.height = 13;
      img.className = 'code-ico';
      line.insertBefore(img, line.children[1] || null);
    }
    return line;
  }
  const lvBar = (lv) => '█'.repeat(lv) + '░'.repeat(5 - lv);
  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '_');

  // switcher generik: strip tombol + area konten yang berganti
  function makeViews(navClass, items, defaultKey) {
    const nav = el('div', navClass);
    const content = el('div', 'view-content');
    const btns = new Map();
    function show(key) {
      const it = items.find((x) => x.key === key) || items[0];
      content.replaceChildren();
      it.render(content);
      btns.forEach((b, k) => b.classList.toggle('on', k === it.key));
    }
    items.forEach((it) => {
      const b = el('button', 'view-btn');
      if (it.glyph) b.appendChild(window.PixelArt.render(it.glyph, 2));
      if (it.label != null) b.appendChild(el('span', null, it.label));
      b.title = it.title || it.label || it.key;
      b.setAttribute('aria-label', it.title || it.label || it.key);
      b.addEventListener('click', () => show(it.key));
      btns.set(it.key, b);
      nav.appendChild(b);
    });
    show(defaultKey || items[0].key);
    return { nav, content };
  }

  // ---- builders: Projects ----
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

  // ---- builder: VS Code (activity bar interaktif) ----
  function vsEditor(file) {
    return (c) => {
      const strip = el('div', 'vs-tabs');
      strip.append(el('span', file === 'languages.ts' ? 'on' : null, 'languages.ts'),
        el('span', file === 'smoky.ts' ? 'on' : null, 'smoky.ts'));
      c.appendChild(strip);
      const code = el('div', 'vs-code');
      if (file === 'smoky.ts') {
        code.appendChild(codeLine([['tok-kw', 'export const'], ['tok-var', ' smoky'], ['tok-p', ' = {']]));
        code.appendChild(codeLine([['tok-key', '  species'], ['tok-p', ': '], ['tok-str', "'neko_atsume_regular'"], ['tok-p', ',']]));
        code.appendChild(codeLine([['tok-key', '  mood'], ['tok-p', ': '], ['tok-str', "'hot_and_cold'"], ['tok-p', ',']]));
        code.appendChild(codeLine([['tok-key', '  powerLevel'], ['tok-p', ': '], ['tok-num', '140'], ['tok-p', ',']]));
        code.appendChild(codeLine([['tok-key', '  memento'], ['tok-p', ': '], ['tok-str', "'soft_brush'"], ['tok-p', ',']]));
        code.appendChild(codeLine([['tok-p', '};'], ['tok-cm', '  // do not deploy on Mondays']]));
      } else {
        code.appendChild(codeLine([['tok-kw', 'export const'], ['tok-var', ' languages'], ['tok-p', ' = {']]));
        D.skills[0].items.forEach((s) => {
          code.appendChild(codeLineIcon(s.icon, [
            ['tok-key', `  ${slug(s.label)}`],
            ['tok-p', ': '], ['tok-str', `'${lvBar(s.level)}'`], ['tok-p', ','],
          ]));
        });
        code.appendChild(codeLine([['tok-p', '};'], ['tok-cm', '  // fluency, 5 = daily driver']]));
      }
      c.appendChild(code);
    };
  }
  function buildVSCode(body) {
    let views;
    const explorerRender = (c) => {
      const tree = el('div', 'vs-tree');
      tree.appendChild(el('div', 'vs-dir', '▾ DAFFA.DEV'));
      [['languages.ts', 'ts'], ['smoky.ts', 'ts'], ['app.js', 'js'], ['pixelart.js', 'js'], ['README.md', null]].forEach(([f, ico]) => {
        const row = el('button', 'vs-file');
        if (ico) {
          const img = el('img');
          img.src = `assets/icons/tech/${ico}.svg`; img.alt = ''; img.width = 13; img.height = 13;
          row.appendChild(img);
        }
        row.appendChild(el('span', null, f));
        if (f === 'languages.ts' || f === 'smoky.ts') {
          row.addEventListener('click', () => views.showEditor(f));
        } else { row.disabled = true; }
        tree.appendChild(row);
      });
      c.appendChild(tree);
    };
    const searchRender = (c) => {
      const box = el('div', 'vs-search');
      const inp = el('input');
      inp.value = 'hire me'; inp.readOnly = true;
      inp.setAttribute('aria-label', 'Search');
      box.appendChild(inp);
      c.appendChild(box);
      const res = el('div', 'vs-results');
      res.appendChild(el('div', 'vs-dir', '3 results in 2 files'));
      [['contact.ts', `daffadikau@gmail.com — replies in 24-48h`],
        ['contact.ts', 'status: open_to_opportunities = true'],
        ['smoky.ts', `approvedByTheCat = 'probably'`]].forEach(([f, line]) => {
        const r = el('div', 'vs-result');
        r.append(el('b', null, f), el('span', null, line));
        res.appendChild(r);
      });
      c.appendChild(res);
    };
    const scmRender = (c) => {
      const scm = el('div', 'vs-scm');
      const msg = el('input');
      msg.value = 'feat: hire daffa 🚀'; msg.readOnly = true;
      msg.setAttribute('aria-label', 'Commit message');
      scm.appendChild(msg);
      scm.appendChild(el('button', 'vs-commit', '✓ Commit'));
      const list = el('div', 'vs-results');
      list.appendChild(el('div', 'vs-dir', 'Changes · 3'));
      [['M', 'career/experience.ts'], ['A', 'skills/ai_engineering.py'], ['M', 'smoky/affection.ts']].forEach(([st, f]) => {
        const r = el('div', 'vs-result');
        r.append(el('b', `vs-st vs-st-${st}`, st), el('span', null, f));
        list.appendChild(r);
      });
      scm.appendChild(list);
      c.appendChild(scm);
    };
    const extRender = (c) => {
      const list = el('div', 'vs-results vs-ext');
      [['Smoky Theme', 'the only theme approved by the cat', '★5.0'],
        ["Jerry's Pixel Icons", 'pixel icons everywhere', '★5.0'],
        ['GitLens', 'who wrote this? (it was me)', '★4.8'],
        ['Prettier', 'makes the mess consistent', '★4.9']].forEach(([name, desc, star]) => {
        const r = el('div', 'vs-result');
        r.append(el('b', null, name), el('span', null, desc), el('i', null, star));
        list.appendChild(r);
      });
      c.appendChild(list);
    };
    const v = makeViews('vs-activity', [
      { key: 'editor', glyph: 'gFiles', title: 'Explorer', render: explorerRender },
      { key: 'search', glyph: 'gSearch', title: 'Search', render: searchRender },
      { key: 'scm', glyph: 'gScm', title: 'Source Control', render: scmRender },
      { key: 'ext', glyph: 'gExt', title: 'Extensions', render: extRender },
    ], null);
    // default: langsung editor languages.ts; Explorer glyph menampilkan tree
    views = v;
    v.showEditor = (file) => { v.content.replaceChildren(); vsEditor(file)(v.content); };
    const wrap = el('div', 'vs-wrap');
    wrap.append(v.nav, v.content);
    body.appendChild(wrap);
    v.showEditor('languages.ts');
  }

  // ---- builder: IntelliJ (tab file + panel Run) ----
  function buildIdea(body) {
    const files = {
      'skills_ai.py': (code) => {
        code.appendChild(codeLine([['tok-var', 'AI_SKILLS'], ['tok-p', ' = {']]));
        D.skills[2].items.forEach((s) => {
          code.appendChild(codeLine([
            ['tok-str', `  "${slug(s.label)}"`],
            ['tok-p', ': '], ['tok-num', String(s.level)], ['tok-p', ',  '], ['tok-cm', `# ${lvBar(s.level)}`],
          ]));
        });
        code.appendChild(codeLine([['tok-p', '}']]));
        code.appendChild(codeLine([['tok-cm', '# OMR grading model — accuracy 99.7%']]));
      },
      'train.py': (code) => {
        code.appendChild(codeLine([['tok-kw', 'for'], ['tok-p', ' epoch '], ['tok-kw', 'in'], ['tok-var', ' range'], ['tok-p', '(10):']]));
        code.appendChild(codeLine([['tok-p', '    model.fit(x_train, y_train)']]));
        code.appendChild(codeLine([['tok-p', '    log(epoch, acc)  '], ['tok-cm', '# YOLOv11 fine-tune']]));
      },
    };
    const strip = el('div', 'ij-tabs');
    const codeArea = el('div', 'ij-code');
    const run = el('div', 'ij-run');
    function showRun(file) {
      run.replaceChildren();
      run.appendChild(el('div', 'ij-runbar', '▶ Run: ' + file));
      const lines = file === 'train.py'
        ? ['Epoch 1/10 … acc 0.71', 'Epoch 5/10 … acc 0.93', 'Epoch 10/10 … acc 0.997 ✓', '', 'Process finished with exit code 0']
        : ['loaded 4 AI skills · avg level 3.8', 'Process finished with exit code 0'];
      lines.forEach((l) => run.appendChild(el('div', 'ij-runline', l)));
    }
    function show(file) {
      codeArea.replaceChildren();
      files[file](codeArea);
      showRun(file);
      [...strip.children].forEach((s) => s.classList.toggle('on', s.textContent === file));
    }
    Object.keys(files).forEach((f) => {
      const t = el('button', null, f);
      t.addEventListener('click', () => show(f));
      strip.appendChild(t);
    });
    body.append(strip, codeArea, run);
    show('skills_ai.py');
  }

  // ---- builder: Docker (sidebar interaktif) ----
  function buildDocker(body) {
    const containersRender = (c) => {
      const cpus = ['0.4%', '1.2%', '0.8%', '0.6%', '2.1%', '0.3%'];
      const rows = D.skills[3].items.map((s, i) => {
        const name = s.label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const st = el('span', 'dk-status');
        st.append(el('i'), document.createTextNode(' Running'));
        return [name, `${name}:latest`, st, cpus[i % cpus.length]];
      });
      c.appendChild(table('dk-grid', ['NAME', 'IMAGE', 'STATUS', 'CPU'], rows));
      c.appendChild(el('p', 'dk-note', '6 containers running · 0 stopped · uptime: since 2023'));
    };
    const imagesRender = (c) => {
      c.appendChild(table('dk-grid', ['REPOSITORY', 'TAG', 'SIZE'], [
        ['daffadev/portfolio', 'pixel', '1.2MB'],
        ['testkit/gas-monitor', 'prod', '212MB'],
        ['bengkelbot/gemini', 'latest', '148MB'],
        ['smoky/cat', 'latest', '14MB'],
        ['smoky/cat', 'sleepy', '14MB'],
      ]));
      c.appendChild(el('p', 'dk-note', 'smoky/cat pulled 1,000,000+ times (by Smoky)'));
    };
    const logsRender = (c) => {
      const log = el('div', 'dk-logs');
      ['[gas-monitor]  INFO  sensor mq-2 ok · reading nominal',
        '[gas-monitor]  INFO  timescaledb write 12ms',
        '[bengkelbot]   INFO  gemini reply in 420ms',
        '[smoky]        WARN  nap interrupted by deploy',
        '[smoky]        INFO  resumed napping (uptime 99.9%)',
        '[portfolio]    INFO  visitor detected · say hi!'].forEach((l) => log.appendChild(el('div', null, l)));
      c.appendChild(log);
    };
    const v = makeViews('dk-side', [
      { key: 'containers', label: 'Containers', render: containersRender },
      { key: 'images', label: 'Images', render: imagesRender },
      { key: 'logs', label: 'Logs', render: logsRender },
    ], 'containers');
    const wrap = el('div', 'dk-wrap');
    wrap.append(v.nav, v.content);
    body.appendChild(wrap);
  }

  // ---- builder: Wireshark ----
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

  // ---- builder: Terminal ----
  function buildTerminal(body) {
    window.TerminalEngine.mount(body);
  }

  // ---- defs & groups ----
  const DEFS = {
    excel: { title: 'projects.xlsx — Excel', skin: 'excel', icon: 'excel', w: 470, fx: 0.05, fy: 90, build: buildExcel },
    word: { title: 'report.docx — Word', skin: 'word', icon: 'word', w: 400, fx: 0.56, fy: 140, build: buildWord },
    notion: { title: 'Project Tracker — Notion', skin: 'notion', icon: 'notion', w: 460, fx: 0.24, fy: 330, build: buildNotion },
    vscode: { title: 'languages.ts — VS Code', skin: 'vscode', icon: 'vscode', w: 470, fx: 0.04, fy: 80, build: buildVSCode },
    idea: { title: 'skills_ai.py — IntelliJ IDEA', skin: 'idea', icon: 'idea', w: 440, fx: 0.58, fy: 110, build: buildIdea },
    docker: { title: 'Containers — Docker Desktop', skin: 'docker', icon: 'docker', w: 500, fx: 0.09, fy: 360, build: buildDocker },
    wireshark: { title: 'capture.pcapng — Wireshark', skin: 'wireshark', icon: 'wireshark', w: 540, fx: 0.42, fy: 440, build: buildWireshark },
    terminal: { title: 'daffa@portfolio: ~ — Terminal', skin: 'terminal', icon: 'term', w: 600, fx: 0.2, fy: 150, build: buildTerminal },
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
    if (id === 'terminal') {
      const input = w.querySelector('input');
      if (input) setTimeout(() => input.focus(), 80);
    }
  }
  function openGroup(name) {
    (GROUPS[name] || []).forEach((id, i) => {
      if (reduced) open(id, i);
      else timers.push(setTimeout(() => open(id, i), i * 140));
    });
  }
  function closeAll(except = []) {
    timers.forEach(clearTimeout);
    timers.length = 0;
    [...wins.keys()].forEach((id) => { if (!except.includes(id)) close(id); });
  }

  window.AppWins = { open, openGroup, closeAll, GROUPS, DEFS };
})();
