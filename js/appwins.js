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
  const grp = (name) => D.skills.find((g) => g.group === name) || { items: [] };

  // switcher generik: strip tombol + area konten yang berganti
  function makeViews(navClass, items, defaultKey) {
    const nav = el('div', navClass);
    const content = el('div', 'view-content');
    const btns = new Map();
    function show(key) {
      const it = items.find((x) => x.key === key) || items[0];
      content.replaceChildren();
      it.render(content);
      btns.forEach((b, k) => {
        const on = k === it.key;
        b.classList.toggle('on', on);
        b.setAttribute('aria-pressed', String(on));
      });
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
  // Excel: sel bisa dipilih (formula bar ikut), header kolom bisa diklik
  // untuk sortir, status bar menghitung seperti Excel sungguhan
  function buildExcel(body) {
    const COLS = ['A · Project', 'B · Stack', 'C · Status'];
    const data = D.projects.map((p) => [
      p.title,
      p.tech.slice(0, 2).map((t) => t.label).join(', '),
      D.projects.indexOf(p) < 2 ? 'In progress' : 'Shipped',
    ]);
    let sortCol = -1;
    let sortAsc = true;
    let sel = { r: 0, c: 0 };

    const fx = el('div', 'xl-formula');
    const cellRef = el('b', 'xl-ref', 'A2');
    const fxVal = el('span', 'xl-val');
    fx.append(cellRef, el('b', null, 'fx'), fxVal);
    const gridWrap = el('div');
    const status = el('div', 'xl-status');
    body.append(fx, gridWrap, status);

    function draw() {
      const rows = data.slice();
      if (sortCol >= 0) {
        rows.sort((a, b) => (sortAsc ? 1 : -1) * a[sortCol].localeCompare(b[sortCol]));
      }
      gridWrap.replaceChildren();
      const t = el('table', 'xl-grid');
      const head = el('tr');
      head.appendChild(el('th', 'xl-corner'));
      COLS.forEach((c, i) => {
        const th = el('th');
        const b = el('button', 'xl-colbtn', c + (sortCol === i ? (sortAsc ? ' ▲' : ' ▼') : ''));
        b.addEventListener('click', () => {
          if (sortCol === i) sortAsc = !sortAsc; else { sortCol = i; sortAsc = true; }
          draw();
        });
        th.appendChild(b);
        head.appendChild(th);
      });
      t.appendChild(head);
      rows.forEach((r, ri) => {
        const tr = el('tr');
        tr.appendChild(el('th', 'xl-rownum', String(ri + 2)));
        r.forEach((val, ci) => {
          const td = el('td');
          const cell = el('button', 'xl-cell', val);
          if (sel.r === ri && sel.c === ci) cell.classList.add('on');
          cell.addEventListener('click', () => { sel = { r: ri, c: ci }; draw(); });
          td.appendChild(cell);
          tr.appendChild(td);
        });
        t.appendChild(tr);
      });
      gridWrap.appendChild(t);
      const cur = rows[sel.r] ? rows[sel.r][sel.c] : '';
      cellRef.textContent = `${'ABC'[sel.c]}${sel.r + 2}`;
      fxVal.textContent = cur;
      const shipped = data.filter((r) => r[2] === 'Shipped').length;
      status.textContent = `Ready · ${data.length} rows · Shipped: ${shipped} · In progress: ${data.length - shipped}`;
    }
    draw();
  }
  // Word: tab ribbon berpindah, tombol B/I/U benar-benar memformat dokumen,
  // jumlah kata dihitung sungguhan di status bar
  function buildWord(body) {
    const tabs = el('div', 'wd-tabs');
    const ribbon = el('div', 'wd-ribbon');
    const page = el('div', 'wd-page');
    const status = el('div', 'wd-status');

    page.appendChild(el('h3', null, 'Project Highlights'));
    D.projects.slice(0, 2).forEach((p) => {
      page.appendChild(el('h4', null, p.title));
      page.appendChild(el('p', null, p.desc));
    });
    page.appendChild(el('p', 'wd-note', 'Full list: see projects.xlsx →'));

    const fmt = { b: false, i: false, u: false };
    function applyFmt() {
      page.classList.toggle('fmt-b', fmt.b);
      page.classList.toggle('fmt-i', fmt.i);
      page.classList.toggle('fmt-u', fmt.u);
    }
    const RIBBONS = {
      Home: () => {
        const g = el('div', 'wd-group');
        [['B', 'b', 'Bold'], ['I', 'i', 'Italic'], ['U', 'u', 'Underline']].forEach(([lab, key, name]) => {
          const b = el('button', `wd-fmt wd-${key}`, lab);
          b.title = name;
          b.setAttribute('aria-label', name);
          b.setAttribute('aria-pressed', String(fmt[key]));
          b.addEventListener('click', () => {
            fmt[key] = !fmt[key];
            b.setAttribute('aria-pressed', String(fmt[key]));
            applyFmt();
          });
          g.appendChild(b);
        });
        g.append(el('span', 'wd-sep'), el('span', 'wd-dim', 'Calibri · 11'));
        return g;
      },
      Insert: () => {
        const g = el('div', 'wd-group');
        ['Table', 'Picture', 'Chart', 'Link'].forEach((x) => g.appendChild(el('button', 'wd-fmt wide', x)));
        return g;
      },
      Layout: () => {
        const g = el('div', 'wd-group');
        ['Margins', 'Columns', 'Orientation'].forEach((x) => g.appendChild(el('button', 'wd-fmt wide', x)));
        return g;
      },
      Review: () => {
        const g = el('div', 'wd-group');
        g.appendChild(el('span', 'wd-dim', 'Spelling: 0 issues · Smoky proofread this'));
        return g;
      },
    };
    Object.keys(RIBBONS).forEach((name, i) => {
      const b = el('button', 'wd-tab', name);
      b.addEventListener('click', () => show(name));
      tabs.appendChild(b);
      if (i === 0) setTimeout(() => show(name), 0);
    });
    function show(name) {
      ribbon.replaceChildren(RIBBONS[name]());
      [...tabs.children].forEach((t) => {
        const on = t.textContent === name;
        t.classList.toggle('on', on);
        t.setAttribute('aria-pressed', String(on));
      });
    }
    const words = page.textContent.trim().split(/\s+/).length;
    status.textContent = `Page 1 of 1 · ${words} words · English (US)`;
    body.append(tabs, ribbon, page, status);
  }
  // Notion: halaman di sidebar benar-benar berpindah, checklist bisa
  // dicentang, toggle block bisa dibuka-tutup
  function buildNotion(body) {
    const trackerPage = (c) => {
      c.appendChild(el('h3', null, '📋 Project Tracker'));
      const board = el('div', 'nt-board');
      [['In Progress', D.projects.slice(0, 2)], ['Shipped', D.projects.slice(2)]].forEach(([name, items]) => {
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
      c.appendChild(board);
    };
    const ideasPage = (c) => {
      c.appendChild(el('h3', null, '💡 Ideas'));
      [['Portfolio yang terasa seperti OS', true],
        ['Smoky bisa didandani', true],
        ['Dashboard sensor gas realtime', true],
        ['Mode gelap untuk seluruh situs', false],
        ['Mini-game di tab 404', false]].forEach(([text, done]) => {
        const row = el('label', 'nt-todo');
        const box = el('input');
        box.type = 'checkbox';
        box.checked = done;
        const span = el('span', null, text);
        box.addEventListener('change', () => span.classList.toggle('done', box.checked));
        if (done) span.classList.add('done');
        row.append(box, span);
        c.appendChild(row);
      });
    };
    const napsPage = (c) => {
      c.appendChild(el('h3', null, '😴 Smoky’s naps'));
      [['Di atas keyboard', 'Paling sering saat deploy'],
        ['Di kardus mikan', 'Spot resmi, lihat tab Contact'],
        ['Di kursi kerja', 'Diklaim sejak hari pertama']].forEach(([t, d]) => {
        const tg = el('div', 'nt-toggle');
        const b = el('button', 'nt-tgbtn', `▸ ${t}`);
        const p = el('p', 'nt-tgbody', d);
        p.hidden = true;
        b.setAttribute('aria-expanded', 'false');
        b.addEventListener('click', () => {
          p.hidden = !p.hidden;
          b.textContent = `${p.hidden ? '▸' : '▾'} ${t}`;
          b.setAttribute('aria-expanded', String(!p.hidden));
        });
        tg.append(b, p);
        c.appendChild(tg);
      });
    };
    const v = makeViews('nt-side', [
      { key: 'tracker', label: '▸ Project Tracker', render: trackerPage },
      { key: 'ideas', label: '▸ Ideas', render: ideasPage },
      { key: 'naps', label: '▸ Smoky’s naps', render: napsPage },
    ], 'tracker');
    v.content.classList.add('nt-main');
    const wrap = el('div', 'nt-wrap');
    wrap.append(v.nav, v.content);
    body.appendChild(wrap);
  }

  // ---- Quick Look: jendela detail satu project (dibuka dari Finder) ----
  function buildQuickLook(body, pr, i) {
    const band = el('div', 'ql-band');
    band.style.background = TAGCOLORS[i % TAGCOLORS.length];
    band.appendChild(window.PixelArt.render('fileDoc', 3));
    const head = el('div', 'ql-head');
    head.appendChild(el('h3', null, pr.title));
    const badge = el('span', 'ql-badge', i < 2 ? 'In progress' : 'Shipped');
    if (i >= 2) badge.classList.add('done');
    head.appendChild(badge);
    const meta = el('div', 'ql-meta');
    meta.append(el('span', null, `Kind: project`), el('span', null, `Stack: ${pr.tech.length} tech`));
    const desc = el('p', 'ql-desc', pr.desc);
    const tags = el('div', 'tags');
    pr.tech.forEach((t) => tags.appendChild(techChip(t)));
    const foot = el('div', 'ql-foot');
    pr.links.forEach((l) => foot.appendChild(extBtn('pxbtn', l.label + ' ↗', l.url)));
    const xls = el('button', 'pxbtn', 'Show in projects.xlsx');
    xls.addEventListener('click', () => open('excel'));
    foot.appendChild(xls);
    body.append(band, head, meta, desc, tags, foot);
  }
  function projectDef(i) {
    const pr = D.projects[i];
    return {
      title: `${pr.title} — Quick Look`,
      skin: 'ql', icon: 'fileDoc', w: 380,
      fx: 0.26 + (i % 3) * 0.09, fy: 130 + (i % 4) * 46,
      build: (b) => buildQuickLook(b, pr, i),
    };
  }

  // ---- builder: n8n (kanvas workflow yang bisa dijalankan) ----
  function buildN8n(body) {
    const NODES = [
      { name: 'MQTT Trigger', sub: 'esp32-testkit' },
      { name: 'Function', sub: 'parse gas_level' },
      { name: 'IF', sub: 'level > threshold' },
      { name: 'HTTP Request', sub: 'POST /alerts' },
      { name: 'Telegram', sub: 'notify Daffa' },
    ];
    const bar = el('div', 'n8-bar');
    const run = el('button', 'n8-run', '▶ Execute Workflow');
    const st = el('span', 'n8-st', 'idle');
    bar.append(run, st);
    const canvas = el('div', 'n8-canvas');
    const nodeEls = NODES.map((n, i) => {
      const wrapN = el('div', 'n8-nodewrap');
      const node = el('div', 'n8-node');
      node.append(el('b', null, n.name), el('span', null, n.sub));
      wrapN.appendChild(node);
      if (i < NODES.length - 1) wrapN.appendChild(el('span', 'n8-link'));
      canvas.appendChild(wrapN);
      return node;
    });
    let timers = [];
    run.addEventListener('click', () => {
      timers.forEach(clearTimeout);
      timers = [];
      nodeEls.forEach((n) => n.classList.remove('done', 'active'));
      st.textContent = 'running…';
      st.className = 'n8-st run';
      nodeEls.forEach((n, i) => {
        timers.push(setTimeout(() => {
          nodeEls.forEach((m) => m.classList.remove('active'));
          n.classList.add('active');
        }, i * 420));
        timers.push(setTimeout(() => {
          n.classList.remove('active');
          n.classList.add('done');
          if (i === nodeEls.length - 1) {
            st.textContent = 'success · 5 nodes · 1.2s';
            st.className = 'n8-st ok';
          }
        }, i * 420 + 380));
      });
    });
    if (body._win) body._win._cleanup.push(() => timers.forEach(clearTimeout));
    body.append(bar, canvas, el('p', 'n8-note', 'Alur otomasi untuk TestKit Gas Monitor — sensor masuk, dinilai, lalu memicu peringatan.'));
  }

  // ---- builder: GitLab (pipeline CI yang bisa dijalankan) ----
  function buildGitlab(body) {
    const STAGES = [
      { name: 'build', jobs: ['docker:build', 'flutter:build'] },
      { name: 'test', jobs: ['pytest', 'lint'] },
      { name: 'deploy', jobs: ['deploy:vps'] },
    ];
    const head = el('div', 'gl-head');
    head.append(el('b', null, 'daffadikau / testkit-gas-monitor'),
      el('span', 'gl-branch', 'main'));
    const bar = el('div', 'gl-bar');
    const run = el('button', 'gl-run', '▶ Run pipeline');
    const badge = el('span', 'gl-badge', 'passed');
    bar.append(run, badge);
    const stages = el('div', 'gl-stages');
    const jobEls = [];
    STAGES.forEach((s, si) => {
      const col = el('div', 'gl-stage');
      col.appendChild(el('h5', null, s.name));
      s.jobs.forEach((j) => {
        const job = el('div', 'gl-job done');
        job.append(el('i', 'gl-dot'), el('span', null, j));
        col.appendChild(job);
        jobEls.push({ el: job, order: si });
      });
      stages.appendChild(col);
      if (si < STAGES.length - 1) stages.appendChild(el('span', 'gl-arrow', '→'));
    });
    let timers = [];
    run.addEventListener('click', () => {
      timers.forEach(clearTimeout);
      timers = [];
      jobEls.forEach((j) => j.el.className = 'gl-job');
      badge.textContent = 'running';
      badge.className = 'gl-badge run';
      jobEls.forEach((j) => {
        timers.push(setTimeout(() => { j.el.className = 'gl-job active'; }, j.order * 700));
        timers.push(setTimeout(() => {
          j.el.className = 'gl-job done';
          if (j.order === STAGES.length - 1) {
            badge.textContent = 'passed';
            badge.className = 'gl-badge';
          }
        }, j.order * 700 + 650));
      });
    });
    const commits = el('div', 'gl-commits');
    commits.appendChild(el('h5', null, 'Recent commits'));
    // graph ASCII seperti `git log --graph`
    const graph = el('pre', 'gl-graph');
    [['*  ', '3f8a2c1', 'feat: alerting via telegram', '2 days ago'],
      ['|\\ ', '', '', ''],
      ['| *', '9d21e4f', 'fix: timescaledb retention policy', '5 days ago'],
      ['|/ ', '', '', ''],
      ['*  ', '1a77b03', 'chore: bump fastapi', '1 week ago'],
      ['|  ', '', '', ''],
      ['*  ', '5c0de91', 'feat: mqtt ingest for esp32', '2 weeks ago'],
    ].forEach(([g, sha, msg, when]) => {
      const row = el('div', 'gl-grow');
      row.append(el('span', 'gl-gl', g), el('b', 'gl-sha', sha),
        el('span', 'gl-msg', msg), el('i', 'gl-when', when));
      graph.appendChild(row);
    });
    commits.appendChild(graph);
    if (body._win) body._win._cleanup.push(() => timers.forEach(clearTimeout));
    body.append(head, bar, stages, commits);
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
        grp('Languages').items.forEach((s) => {
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
    v.showEditor = (file) => {
      v.content.replaceChildren();
      vsEditor(file)(v.content);
      // editor bukan salah satu view di activity bar — jangan tandai satu pun aktif
      v.nav.querySelectorAll('.view-btn').forEach((b) => {
        b.classList.remove('on');
        b.setAttribute('aria-pressed', 'false');
      });
    };
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
        grp('AI & Data').items.forEach((s) => {
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
      [...strip.children].forEach((s) => {
        const on = s.textContent === file;
        s.classList.toggle('on', on);
        s.setAttribute('aria-pressed', String(on));
      });
    }
    Object.keys(files).forEach((f) => {
      const t = el('button', null, f);
      t.addEventListener('click', () => show(f));
      strip.appendChild(t);
    });
    body.append(strip, codeArea, run);
    show('skills_ai.py');
  }

  // ---- builder: Xcode (build Flutter/iOS — Runner.xcworkspace) ----
  function buildXcode(body) {
    const bar = el('div', 'xc-toolbar');
    bar.append(el('span', 'xc-run', '▶'), el('span', 'xc-stop', '■'),
      el('span', 'xc-scheme', 'Runner  ›  iPhone 15 Pro'),
      el('span', 'xc-ok', '✓ Build Succeeded'));
    body.appendChild(bar);
    const wrap = el('div', 'xc-wrap');
    const nav = el('div', 'xc-nav');
    [['▾ Runner', 1], ['AppDelegate.swift', 0], ['Info.plist', 0], ['Assets.xcassets', 0],
      ['▾ Flutter', 1], ['Generated.xcconfig', 0], ['▾ Pods', 1], ['Podfile', 0]]
      .forEach(([t, isGroup]) => nav.appendChild(el('div', isGroup ? 'xc-group' : 'xc-file', t)));
    const main = el('div', 'xc-main');
    ['✓  Compiling Dart sources for arm64',
      '✓  Building Flutter engine (release)',
      '✓  Linking Runner.app',
      '✓  Code signing Runner.app',
      '✓  Installing on iPhone 15 Pro Simulator',
    ].forEach((l) => main.appendChild(el('div', 'xc-log', l)));
    main.appendChild(el('div', 'xc-done', 'Build Succeeded  ·  12.4s  ·  0 warnings'));
    const chips = el('div', 'xc-chips');
    grp('Web & Mobile').items
      .filter((s) => /flutter|dart/i.test(s.label))
      .concat(grp('Languages').items.filter((s) => /dart/i.test(s.label)))
      .filter((s, i, arr) => arr.findIndex((x) => x.label === s.label) === i)
      .forEach((s) => chips.appendChild(el('span', 'xc-chip', `${s.label} ${lvBar(s.level)}`)));
    main.appendChild(chips);
    wrap.append(nav, main);
    body.appendChild(wrap);
  }

  // ---- builder: Docker (sidebar interaktif) ----
  function buildDocker(body) {
    const containersRender = (c) => {
      const cpus = ['0.4%', '1.2%', '0.8%', '0.6%', '2.1%', '0.3%'];
      const rows = grp('DevOps, Cloud & IoT').items.map((s, i) => {
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
    // baris HTTP di-generate dari grup skill Web & Mobile biar tidak ada
    // grup yang tercecer dari data.js
    const web = grp('Web & Mobile').items.slice(0, 4);
    const rows = [
      ['1', '0.001', 'daffa.dev', 'recruiter.example', 'HTTP', 'GET /portfolio HTTP/1.1 200 OK', 'http'],
      ...web.map((s, i) => [String(i + 2), `0.0${87 + i * 45}`, 'browser', 'daffa.dev', 'HTTP',
        `GET /skills/${slug(s.label)} 200 OK (lv ${s.level}/5)`, 'http']),
      ['6', '0.420', 'esp32-testkit', 'daffa.dev', 'MQTT', 'PUBLISH gas_level=safe qos=1', 'mqtt'],
      ['7', '0.421', 'daffa.dev', 'esp32-testkit', 'MQTT', 'PUBACK — FastAPI ingested ✓', 'mqtt'],
      ['8', '1.337', 'smoky.local', 'daffa.dev', 'ICMP', 'Echo (meow) request', 'icmp'],
      ['9', '1.338', 'daffa.dev', 'smoky.local', 'ICMP', 'Echo (meow) reply ♥', 'icmp'],
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

  // ---- builder: Spotify (player lagu favorit — tanpa audio, tautan ke Spotify) ----
  function buildSpotify(body) {
    const tracks = D.music || [];
    if (!tracks.length) return;
    let idx = 0;
    let playing = false;

    const now = el('div', 'sp-now');
    const cover = el('div', 'sp-cover');
    const meta = el('div', 'sp-meta');
    const title = el('b', 'sp-title');
    const artist = el('span', 'sp-artist');
    const eq = el('span', 'sp-eq');
    eq.setAttribute('aria-hidden', 'true');
    eq.append(el('i'), el('i'), el('i'), el('i'));
    meta.append(title, artist, eq);
    now.append(cover, meta);

    // Mesin pemutar: Spotify Embed resmi (tanpa login, preview 30 detik;
    // utuh bila pengunjung login Premium). Embed-nya disembunyikan secara
    // visual agar UI pixel kita tidak dobel — tetap dirender (bukan
    // display:none) supaya audio jalan, dan `inert` menjaganya keluar dari
    // urutan tab. Atribusi Spotify tetap ditampilkan di baris bawah.
    const embedHost = el('div', 'sp-embed');
    embedHost.setAttribute('inert', '');
    embedHost.setAttribute('aria-hidden', 'true');
    const embedMount = el('div');
    embedHost.appendChild(embedMount);
    const note = el('p', 'sp-note', 'Preview 30 detik · putar penuh kalau kamu login Spotify Premium');

    // progress bar pixel — diisi dari posisi playback ASLI milik embed
    const bar = el('div', 'sp-bar');
    const fill = el('i');
    bar.appendChild(fill);
    const times = el('div', 'sp-times');
    const tNow = el('span', null, '0:00');
    const tEnd = el('span', null, '0:00');
    times.append(tNow, tEnd);
    const mmss = (ms) => {
      if (!ms || ms < 0) return '0:00';
      const s = Math.floor(ms / 1000);
      return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    };

    const ctrls = el('div', 'sp-ctrls');
    const prev = el('button', 'sp-btn', '⏮');
    prev.setAttribute('aria-label', 'Previous track');
    const play = el('button', 'sp-btn sp-play', '▶');
    play.setAttribute('aria-label', 'Play');
    const next = el('button', 'sp-btn', '⏭');
    next.setAttribute('aria-label', 'Next track');
    const open = el('a', 'sp-open', 'Open in Spotify ↗');
    open.target = '_blank';
    open.rel = 'noreferrer';
    open.href = D.musicPlaylist || 'https://open.spotify.com/';
    ctrls.append(prev, play, next, open);

    const list = el('div', 'sp-list');
    tracks.forEach((t, i) => {
      const row = el('button', 'sp-row');
      row.append(el('i', 'sp-num', String(i + 1)),
        el('span', 'sp-rt', t.title), el('span', 'sp-ra', t.artist));
      row.addEventListener('click', () => select(i));
      list.appendChild(row);
    });

    let drawnIdx = -1;
    function render() {
      const t = tracks[idx];
      if (drawnIdx !== idx) {
        const img = el('img');
        img.src = t.cover;
        img.alt = `${t.title} — ${t.artist} album cover`;
        cover.replaceChildren(img);
        drawnIdx = idx;
      }
      title.textContent = t.title;
      artist.textContent = t.artist;
      play.textContent = playing ? '⏸' : '▶';
      play.setAttribute('aria-label', playing ? 'Pause' : 'Play');
      credit.href = `https://open.spotify.com/track/${t.sid}`;
      body.classList.toggle('sp-playing', playing);
      [...list.children].forEach((r, i) => r.setAttribute('aria-pressed', String(i === idx)));
    }
    function select(i) {
      idx = (i + tracks.length) % tracks.length;
      render();
      if (ctrl && tracks[idx].sid) {
        ctrl.loadUri(`spotify:track:${tracks[idx].sid}`);
        ctrl.play();
      }
    }
    prev.addEventListener('click', () => select(idx - 1));
    next.addEventListener('click', () => select(idx + 1));
    play.addEventListener('click', () => {
      if (ctrl) ctrl.togglePlay();
      else { playing = !playing; render(); }
    });

    // atribusi: wajib tetap ada walau embed disembunyikan
    const credit = el('a', 'sp-credit');
    credit.target = '_blank';
    credit.rel = 'noreferrer';
    credit.appendChild(window.PixelArt.render('spotify', 1));
    credit.appendChild(el('span', null, 'Powered by Spotify'));

    body.append(now, embedHost, bar, times, note, ctrls,
      el('div', 'sp-head', 'Daffa’s favourites'), list, credit);
    render();

    // pasang controller Spotify; kalau gagal (offline/diblokir), UI tetap
    // jalan sebagai daftar lagu + tautan ke Spotify
    let ctrl = null;
    spotifyApi().then((IFrameAPI) => {
      IFrameAPI.createController(embedMount, {
        uri: `spotify:track:${tracks[idx].sid}`,
        width: '100%',
        height: '80',
      }, (controller) => {
        ctrl = controller;
        if (body._win) body._win._cleanup.push(() => { try { controller.destroy(); } catch (e2) { /* abaikan */ } });
        controller.addListener('playback_update', (e) => {
          const d = (e && e.data) || {};
          playing = !d.isPaused;
          if (d.duration) {
            fill.style.width = `${Math.min(100, (d.position / d.duration) * 100)}%`;
            tNow.textContent = mmss(d.position);
            tEnd.textContent = mmss(d.duration);
          }
          render();
        });
      });
    }).catch(() => {
      note.textContent = 'Pemutar Spotify tidak bisa dimuat — buka playlist-nya lewat tautan di atas.';
    });
  }

  // memuat Spotify IFrame API sekali saja, aman dipanggil berkali-kali
  let spotifyApiPromise = null;
  function spotifyApi() {
    if (spotifyApiPromise) return spotifyApiPromise;
    spotifyApiPromise = new Promise((resolve, reject) => {
      window.onSpotifyIframeApiReady = resolve;
      const s = document.createElement('script');
      s.src = 'https://open.spotify.com/embed/iframe-api/v1';
      s.async = true;
      s.onerror = () => reject(new Error('spotify iframe api gagal dimuat'));
      document.head.appendChild(s);
      setTimeout(() => reject(new Error('spotify iframe api timeout')), 12000);
    });
    return spotifyApiPromise;
  }

  // ---- builders: Contact (profil pixel GitHub / LinkedIn / Gmail) ----
  // tag tech lokal (app.js punya versinya sendiri di dalam IIFE-nya)
  function techChip(t) {
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
  function extBtn(cls, label, url) {
    const a = el('a', cls, label);
    a.href = url; a.target = '_blank'; a.rel = 'noreferrer';
    return a;
  }
  function buildGithub(body) {
    const wrap = el('div', 'gh-wrap');
    const head = el('div', 'gh-head');
    const ava = el('div', 'gh-avatar');
    ava.appendChild(window.PixelArt.render('catCap', 4));
    const who = el('div', 'gh-who');
    who.append(el('b', null, 'Daffa Adika'), el('span', null, '@Daffadikau'),
      extBtn('gh-follow', 'Follow', D.socials.github));
    head.append(ava, who);
    wrap.appendChild(head);
    wrap.appendChild(el('p', 'gh-bio', 'Computer Engineering @ UPI · Robotics (AGV/ROS 2) · IoT & Full-stack'));
    wrap.appendChild(el('p', 'gh-meta', '11 repositories · 📍 Bandung, Indonesia'));
    // contribution graph — pola deterministik biar grid-nya hidup
    const graph = el('div', 'gh-graph');
    graph.setAttribute('role', 'img');
    graph.setAttribute('aria-label', 'Contribution graph, suspiciously green');
    for (let r = 0; r < 7; r += 1) {
      const row = el('div', 'gh-row');
      for (let c = 0; c < 26; c += 1) {
        const v = (r * 5 + c * 11 + ((c * r) % 7)) % 9;
        const lv = v < 3 ? 0 : v < 5 ? 1 : v < 7 ? 2 : v < 8 ? 3 : 4;
        row.appendChild(el('i', `gh-c${lv}`));
      }
      graph.appendChild(row);
    }
    wrap.appendChild(graph);
    wrap.appendChild(el('p', 'gh-meta', '1,337 contributions in the last year (Smoky walked on the keyboard for ~40 of them)'));
    wrap.appendChild(extBtn('pxbtn', 'Open profile ↗', D.socials.github));
    body.appendChild(wrap);
  }
  function buildLinkedin(body) {
    const banner = el('div', 'li-banner');
    banner.append(el('i'), el('i'), el('span', null, 'THE INTEGRATED ENGINEER'));
    body.appendChild(banner);
    const wrap = el('div', 'li-wrap');
    const ava = el('div', 'li-avatar');
    ava.appendChild(window.PixelArt.render('catCap', 3));
    ava.appendChild(el('span', 'li-otw', '#OPENTOWORK'));
    wrap.appendChild(ava);
    wrap.append(
      el('b', 'li-name', 'Daffa Adika (He/Him)'),
      el('p', 'li-head', 'Undergraduate Computer Engineering Student at Universitas Pendidikan Indonesia'),
      el('p', 'li-meta', 'Bandung, West Java, Indonesia · 58 connections'));
    const otwBox = el('div', 'li-box', 'Open to work — Bekasi +1 more · Hybrid · Remote');
    wrap.appendChild(otwBox);
    const row = el('div', 'li-btns');
    row.append(extBtn('li-pill', 'Open to', D.socials.linkedin),
      extBtn('li-pill li-ghost', 'Message', D.socials.linkedin));
    wrap.appendChild(row);
    body.appendChild(wrap);
  }
  function buildGmail(body) {
    const bar = el('div', 'gm-top');
    const inp = el('input');
    inp.value = 'is:unread from:opportunity'; inp.readOnly = true;
    inp.setAttribute('aria-label', 'Search mail');
    const compose = el('a', 'gm-compose', '✎ Compose');
    compose.href = `mailto:${D.socials.email}`;
    bar.append(compose, inp);
    body.appendChild(bar);
    const list = el('div', 'gm-list');
    [['Recruiter', 'Re: Opportunity — are you available for a chat?', '14:02', true],
      ['GitHub', '⭐ Daffadikau/portofolio — you have a new star', '13:37', true],
      ['Smoky', '(no subject) — meow meow meowwwwwww', '03:00', false],
      ['UPI Akademik', 'Reminder: KRS semester 7', 'Aug 15', false]].forEach(([from, subj, time, unread]) => {
      const row = el('div', unread ? 'gm-row unread' : 'gm-row');
      row.append(el('b', null, from), el('span', null, subj), el('i', null, time));
      list.appendChild(row);
    });
    body.appendChild(list);
    body.appendChild(el('p', 'gm-note', `inbox zero is a myth · write to ${D.socials.email}`));
  }

  // ---- builder: easter egg — remake setia ID card CMIYGL referensi Dikau ----
  function buildIdcard(body) {
    const field = (label, value) => {
      const row = el('div', 'id-field');
      row.append(el('span', 'id-label', label), el('span', 'id-dots'), el('b', 'id-val', value));
      return row;
    };
    const starsV = (side) => {
      const v = el('div', `id-starsv ${side}`);
      for (let i = 0; i < 9; i += 1) v.appendChild(el('span', null, '★'));
      return v;
    };
    const card = el('div', 'id-card');
    const frame = el('div', 'id-frame');
    const photo = el('div', 'id-photo');
    photo.appendChild(window.PixelArt.render('catTyler', 7));
    // isi ruang kosong kolom foto: identitas pendamping + barcode pixel
    const comp = el('div', 'id-comp');
    comp.append(
      el('b', null, 'SMOKY'),
      el('span', null, 'travel companion · Lv.140'),
      el('span', null, 'personality: hot and cold'));
    photo.appendChild(comp);
    const bars = el('div', 'id-barcode');
    bars.setAttribute('aria-hidden', 'true');
    [3, 1, 2, 1, 1, 3, 2, 1, 4, 1, 2, 2, 1, 3, 1, 1, 2, 4, 1, 2].forEach((w, i) => {
      const b = el('i');
      b.style.width = `${w * 2}px`;
      if (i % 2) b.style.background = 'transparent';
      bars.appendChild(b);
    });
    photo.appendChild(bars);
    photo.appendChild(el('span', 'id-photocap', 'Photograph of Authorized traveler'));
    const info = el('div', 'id-info');
    info.append(
      el('h4', 'id-h', 'PERMANENT LICENSE OF TRAVEL'),
      el('b', 'id-no', 'NO. SMK1402026'),
      field('Issued to', 'Daffa Adika'),
      field('Date of birth', '10/06/·····'),
      field('Place of issue', 'Bandung, Indonesia'),
      field('Date of issue', '06/25/2021'),
      el('h5', 'id-sub', 'LICENSE OF TRAVEL'),
      el('p', 'id-cert', 'This is to Certify that the person (and cat) named and described above is permitted to travel and explore freely unless detained by law.'),
      el('h5', 'id-sub', 'IMPORTANT'),
      el('p', 'id-cert', 'The holder of this license wrote, designed, and shipped all projects within the attached portfolio, unless stated otherwise.'));
    const stamp = el('div', 'id-stamp', 'CALL ME IF YOU GET LOST');
    stamp.setAttribute('aria-hidden', 'true');
    info.appendChild(stamp);
    const sig = el('div', 'id-sig');
    sig.appendChild(window.PixelArt.render('sig', 2));
    sig.appendChild(el('div', 'id-sigline'));
    sig.appendChild(el('span', 'id-sigcap', 'Signature of Authorized traveler'));
    info.appendChild(sig);
    const inner = el('div', 'id-inner');
    inner.append(photo, info);
    frame.append(
      el('div', 'id-stars top', '★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★'),
      starsV('left'), inner, starsV('right'),
      el('div', 'id-stars bottom', '★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★'));
    card.appendChild(frame);
    body.appendChild(card);
  }

  // ---- defs & groups ----
  // Obrolan dengan Smoky, tampilannya meniru aplikasi pesan.
  // Jawabannya murni pencocokan kata kunci dari data.js — tidak ada model
  // bahasa dan tidak ada permintaan jaringan sama sekali.
  function buildSmokyChat(body) {
    const D2 = window.PORTFOLIO_DATA.chat;
    const wrap = el('div', 'chat-wrap');
    const head = el('div', 'chat-head');
    const ava = el('span', 'chat-ava');
    ava.appendChild(window.PixelArt.render('cat', 2));
    const nm = el('div', 'chat-who');
    nm.append(el('b', null, 'Smoky'), el('i', null, 'online · napping'));
    head.append(ava, nm);
    const log = el('div', 'chat-log');
    log.setAttribute('role', 'log');
    log.setAttribute('aria-live', 'polite');
    function bubble(text, mine) {
      const row = el('div', `chat-row${mine ? ' me' : ''}`);
      row.appendChild(el('span', 'chat-bubble', text));
      log.appendChild(row);
      log.scrollTop = log.scrollHeight;
      return row;
    }
    function typing() {
      const row = el('div', 'chat-row');
      const b = el('span', 'chat-bubble chat-typing');
      for (let i = 0; i < 3; i += 1) b.appendChild(el('i'));
      row.appendChild(b);
      log.appendChild(row);
      log.scrollTop = log.scrollHeight;
      return row;
    }
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    // Kata pendek dicocokkan sebagai kata utuh. Tanpa ini 'hire him' kena
    // aturan sapaan karena memuat potongan 'hi'.
    function has(q, w) {
      if (w.length > 3) return q.indexOf(w) !== -1;
      return new RegExp(`(^|[^a-z])${w}([^a-z]|$)`).test(q);
    }
    function answer(text) {
      const q = text.toLowerCase();
      const hit = D2.rules.filter((r) => r.k.some((w) => has(q, w)))[0];
      return pick(hit ? hit.r : D2.fallback);
    }
    let busy = false;
    function send(text) {
      const t = String(text || '').trim();
      if (!t || busy) return;
      busy = true;
      bubble(t, true);
      const dots = typing();
      const wait = 420 + Math.min(900, t.length * 22);
      setTimeout(() => {
        dots.remove();
        bubble(answer(t), false);
        busy = false;
      }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : wait);
    }
    D2.intro.forEach((line, i) => setTimeout(() => bubble(line, false), i * 260));
    const chips = el('div', 'chat-chips');
    D2.quick.forEach((q) => {
      const c = el('button', 'chat-chip', q);
      c.type = 'button';
      c.addEventListener('click', () => send(q));
      chips.appendChild(c);
    });
    const bar = el('form', 'chat-bar');
    const input = el('input');
    input.type = 'text';
    input.placeholder = 'Say something to a cat…';
    input.setAttribute('aria-label', 'Message Smoky');
    input.autocomplete = 'off';
    const go = el('button', 'chat-send', 'Send');
    go.type = 'submit';
    bar.append(input, go);
    bar.addEventListener('submit', (e) => {
      e.preventDefault();
      send(input.value);
      input.value = '';
    });
    wrap.append(head, log, chips, bar, el('p', 'chat-note', D2.note));
    body.appendChild(wrap);
    setTimeout(() => input.focus(), 80);
  }
  const DEFS = {
    excel: { title: 'projects.xlsx — Excel', skin: 'excel', icon: 'excel', w: 470, fx: 0.05, fy: 90, build: buildExcel },
    word: { title: 'report.docx — Word', skin: 'word', icon: 'word', w: 400, fx: 0.56, fy: 140, build: buildWord },
    notion: { title: 'Project Tracker — Notion', skin: 'notion', icon: 'notion', w: 460, fx: 0.2, fy: 330, build: buildNotion },
    n8n: { title: 'gas-alerting — n8n', skin: 'n8n', icon: 'n8n', w: 430, fx: 0.55, fy: 300, build: buildN8n },
    gitlab: { title: 'Pipelines — GitLab', skin: 'gitlab', icon: 'gitlab', w: 470, fx: 0.3, fy: 470, build: buildGitlab },
    vscode: { title: 'languages.ts — VS Code', skin: 'vscode', icon: 'vscode', w: 470, fx: 0.04, fy: 80, build: buildVSCode },
    idea: { title: 'skills_ai.py — IntelliJ IDEA', skin: 'idea', icon: 'idea', w: 440, fx: 0.58, fy: 110, build: buildIdea },
    xcode: { title: 'Runner.xcworkspace — Xcode', skin: 'xcode', icon: 'xcode', w: 470, fx: 0.3, fy: 250, build: buildXcode },
    docker: { title: 'Containers — Docker Desktop', skin: 'docker', icon: 'docker', w: 500, fx: 0.05, fy: 400, build: buildDocker },
    wireshark: { title: 'capture.pcapng — Wireshark', skin: 'wireshark', icon: 'wireshark', w: 540, fx: 0.42, fy: 440, build: buildWireshark },
    terminal: { title: 'daffa@portfolio: ~ — Terminal', skin: 'terminal', icon: 'term', w: 600, fx: 0.2, fy: 150, build: buildTerminal },
    ghprofile: { title: 'Daffadikau — GitHub', skin: 'github', icon: 'github', w: 440, fx: 0.05, fy: 100, build: buildGithub },
    liprofile: { title: 'daffadikau — LinkedIn', skin: 'linkedin', icon: 'linkedin', w: 400, fx: 0.57, fy: 130, build: buildLinkedin },
    gmail: { title: 'Inbox (2) — Gmail', skin: 'gmail', icon: 'gmail', w: 480, fx: 0.26, fy: 400, build: buildGmail },
    idcard: { title: 'travel-license — Wallet', skin: 'idcard', icon: 'catBox', w: 720, fx: 0.13, fy: 90, center: true, build: buildIdcard },
    spotify: { title: 'Spotify', skin: 'spotify', icon: 'spotify', w: 340, fx: 0.6, fy: 110, build: buildSpotify },
    smokychat: { title: 'Smoky — Messages', skin: 'chat', icon: 'iconChat', w: 380, fx: 0.34, fy: 120, build: buildSmokyChat },
  };
  const GROUPS = {
    projects: ['excel', 'word', 'notion', 'n8n', 'gitlab'],
    skills: ['vscode', 'idea', 'xcode', 'docker', 'wireshark'],
    contact: ['ghprofile', 'liprofile', 'gmail'],
  };

  const wins = new Map();
  let zTop = 39;
  const timers = [];

  function toFront(w) { zTop += 1; w.style.zIndex = zTop; }
  function close(id) {
    const w = wins.get(id);
    if (!w) return;
    // jalankan pembersihan milik builder (timer animasi, controller Spotify)
    if (w._cleanup) w._cleanup.forEach((fn) => { try { fn(); } catch (e) { /* abaikan */ } });
    if (w.contains(document.activeElement)) {
      const tab = document.getElementById(`tab-${location.hash.replace('#', '') || 'about'}`);
      if (tab) tab.focus();
    }
    w.remove();
    wins.delete(id);
  }


  function makeWin(id, def, idx) {
    const win = el('section', `appwin skin-${def.skin}`);
    const mobile = window.innerWidth <= 640;
    // selalu batasi lebar ke viewport, bukan cuma di mobile — sebelumnya
    // window lebar (Wireshark 540, ID card 720) terpotong di layar 641-950px
    const width = Math.min(def.w, window.innerWidth - 16);
    win.style.width = `${width}px`;
    if (def.center && !mobile) {
      // window yang berdiri sendiri (mis. ID card) diletakkan center supaya
      // tidak terasa melayang di pojok
      win.style.left = `${Math.max(8, Math.round((window.innerWidth - width) / 2))}px`;
      win.style.top = `${Math.max(56, Math.round((window.innerHeight - Math.min(520, window.innerHeight * 0.8)) / 2))}px`;
    } else {
      win.style.left = `${mobile ? 8 : Math.max(8, Math.min(Math.round(window.innerWidth * def.fx), window.innerWidth - width - 8))}px`;
      win.style.top = `${mobile ? 64 + idx * 34 : Math.min(def.fy, Math.max(60, window.innerHeight - 160))}px`;
    }
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
    win._cleanup = [];
    body._win = win;
    def.build(body);
    win.append(bar, body);

    win.addEventListener('pointerdown', () => toFront(win));

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
        document.removeEventListener('pointercancel', up);
      };
      document.addEventListener('pointermove', move);
      document.addEventListener('pointerup', up);
      document.addEventListener('pointercancel', up);
      e.preventDefault();
    });
    return win;
  }

  // id 'ql:<n>' dibuat dinamis dari data project
  function defFor(id) {
    if (String(id).startsWith('ql:')) {
      const i = Number(String(id).slice(3));
      return D.projects[i] ? projectDef(i) : null;
    }
    return DEFS[id];
  }
  function open(id, idx = 0) {
    const def = defFor(id);
    if (!def) return;
    const existing = wins.get(id);
    // hanya pakai ulang kalau window-nya masih benar-benar ada di DOM
    if (existing && existing.isConnected) { toFront(existing); return; }
    if (existing) wins.delete(id);
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

  // Escape menutup jendela paling atas dari mana pun fokus berada
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || e.isComposing || wins.size === 0) return;
    let topId = null;
    let topZ = -1;
    wins.forEach((w, id) => {
      const z = Number(w.style.zIndex) || 0;
      if (w.isConnected && z > topZ) { topZ = z; topId = id; }
    });
    if (topId) close(topId);
  });
  window.AppWins = { open, openGroup, closeAll, GROUPS, DEFS };
})();
