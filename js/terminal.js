(function () {
  function createCommands(D) {
    const line = (s) => s.join('\n');
  const ART = {
    smoky: [
      "        ██                ██",
      "      ██▓▓██            ██▓▓██",
      "      ██▓▓▓▓██        ██▓▓▓▓██",
      "      ██▓▓▓▓▓▓██████████▓▓▓▓▓▓██",
      "    ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██",
      "    ██▓▓▓▓░░░░▓▓▓▓▓▓▓▓▓▓▓▓░░░░▓▓▓▓██",
      "    ██▓▓▓▓░░░░▓▓▓▓▓▓▓▓▓▓▓▓░░░░▓▓▓▓██",
      "    ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓██▓▓▓▓▓▓▓▓▓▓▓▓██",
      "████████████████████████████████████████",
      "██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██",
      "██▒▒▒▒▒▒▒▒░░░░░░░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██",
      "██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██",
      "██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██",
      "██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██",
      "████████████████████████████████████████",
      "",
      "   Smoky · くろねこさん · penjaga inbox, perusak deploy",
    ],
    daffa: [
      "███████▒  ▓████▒  ██████░█████▓ ▓████▓     ▓██████▓ ░█████▓███▓ ▓███",
      "███▓▒███  ██████  ███▓▒░░███▒▒░ ██████     ▓███▒███░░███▒▒░▓███ ███▓",
      "███▒░███ ░██▓▓██░ ███▓░ ░███▒░  ███▓██░    ▓██▓ ███░░███▒░ ░███░███▒",
      "███▒▒███ ▒██▒▒██▒ █████▓░█████▒░██▓▒██▓    ▓██▓░███░░█████▒ ███▓███░",
      "███▒░███ ▓██▓▓██▓ ███▓  ░███▒  ▓██▓▓███    ▓██▓ ███░░███░   ▓██████",
      "███▓▓███░████████ ███▒  ░███░  ████████░▒▒ ▓███▒███░░███▒▒░ ▒█████▓",
      "███████▒░███░░███░███▒  ░███░ ░███▒ ███▓██░▓██████▓ ░██████ ░█████▒",
      "",
      "   Computer Engineering · UPI · fullstack + IoT",
    ],
    docker: [
      "                ▒██  ▓█▓",
      "                 ░░   ░",
      "       ▒▓░ ░▓▓░ ░▓▓  ▒▓▒    ░▓▒",
      "       ▒▒░  ▒▒░ ░▒▒  ░▒▒    ▒██▒▒",
      "  ░▒░  ░░░  ░░   ░░  ░░░    ▒████▒░░░░",
      "  ▒█▓  ▓█▒ ░▓█░ ░█▓  ▒█▓    ▒█████████",
      "                            ▒█████████",
      "███████████████████████████████████▓",
      "██████████████████████████████▓░░░░",
      "███████████████████████████████",
      "▒▒▒▒▒▒▒█████████████████████▓▒▒",
      "       ▒▓▓████████████████▓▓░",
      "         ░▓▓▓▓███████▓▓▓▓▓",
      "              ▓██████░",
      "",
      "   Docker · semua project-ku hidup di container",
    ],
    git: [
      "              ▓██████▓▒▒",
      "              ░░▒██████▓▒▒",
      "         ░▓▒▒▓░  ▒░░░▓██▓▓▒░░",
      "       ░▒▓████░      ▒████▓▓▒░░",
      "     ░░███████░      ▒▓▓████▓▓▓░░",
      "    ░█████████░        ░█▓█████▓▓░",
      "  ▒█████████████▒  ▓█░    ▓██████▓▒▒",
      "▓▓██████████████▒  ██▓▓▒  ░░▒██████▓▒▒",
      "████████████████▒  █████▓▓  ░░░░░▓██▓▓",
      "████████████████▒  ███████░      ▓████",
      "████████████████▓  ███████       ▓████",
      "██████████████▓▓▒  ▓▓█████░░░░░░░▓██▓▓",
      "  ▓███████████░      ▒█████████████▒",
      "   ░▒█████████░      ▒███████████░",
      "     ░░███████░      ▒█████████░░",
      "       ▒▒▓████▓▒▒▒▒▒▒▓██████▓▒░",
      "         ░▓▓██████████████▓▓░",
      "            ████████████▓▓",
      "              █████████▓",
      "",
      "   Git · commit sering, push berani",
    ],
    github: [
      "                ▒░░▒░░",
      "            ▒▒▒▓█████▓▓▒▒▒",
      "          ▒▓██████████████▓▒",
      "        ░▓██▓▓██████████▓▒██▓▒",
      "       ▓████░ ░░░░░░░░░░  ███▓░░",
      "     ░░█████░             █████▒",
      "     ▓████▒               ▓████▒",
      "     ▓████▒               ▓████▒",
      "     ▒▓███▓░              ▓████▒",
      "      ░█████▒▒         ░▒▓█████▒",
      "      ░███▓░██▓▓    ░▒▓██████▓░░",
      "        ▒█▓▓▒░▒░    ░▒▓█████▒░",
      "          ▒█▓▓█▓    ░▒▓███▒░",
      "            ░░▓▒    ░▒▒▓░",
      "",
      "   github.com/Daffadikau",
    ],
  };

    return {
      help: () => line([
        '[AVAILABLE COMMANDS]', '',
        'about       who am I',
        'projects    project portfolio',
        'skills      technical skills',
        'experience  roles & orgs',
        'education   academic background',
        'contact     how to reach me',
        'neofetch    system info',
        'smoky       meet the mascot',
        'ascii       ASCII art gallery',
        'matrix      ???',
        'clear       clear screen',
      ]),
      about: () => line([
        `Name: ${D.fullName}`,
        `Role: ${D.role}`,
        `Location: ${D.location}`,
        `Status: ${D.status}!`, '',
        D.bio,
      ]),
      projects: () => line(D.projects.flatMap((p, i) => [
        `${i + 1}. ${p.title}`,
        `   ${p.desc}`,
        `   Tech: ${p.tech.map((t) => t.label).join(', ')}`,
        ...p.links.map((l) => `   ${l.label}: ${l.url}`),
        '',
      ])),
      skills: () => line(D.skills.flatMap((g) => [
        `[${g.group}]`,
        ...g.items.map((s) => `  ${s.label.padEnd(16)} ${'█'.repeat(s.level * 4).padEnd(20, '░')}`),
        '',
      ])),
      experience: () => line(D.experience.flatMap((x) => [
        `${x.period} | ${x.role}`,
        x.org,
        ...x.points.map((p) => `• ${p}`),
        '',
      ])),
      education: () => line([
        D.education.program,
        `${D.education.school} — ${D.education.detail}`, '',
        '[Honors & Awards]',
        ...D.awards.map((a) => `• ${a.title} (${a.when})`),
      ]),
      contact: () => line([
        `Email:    ${D.socials.email}`,
        `GitHub:   ${D.socials.github}`,
        `LinkedIn: ${D.socials.linkedin}`, '',
        D.replyNote,
      ]),
      neofetch: () => line([
        '    /\\_____/\\      daffa@portfolio',
        '   /  ●   ●  \\     ----------------',
        '  |     ▲     |    OS: daffaOS 2.1 (pixel)',
        '   \\  ═╦═╦═  /     Host: ' + D.location,
        '   /         \\     Shell: zsh + oh-my-zsh',
        '  |  |     |  |    Uptime: since 2003',
        '   \\_|_____|_/     Mascot: Smoky (Lv.140)',
        `                   Status: ${D.status}`,
      ]),
      smoky: () => line([
        '┌──[ SMOKY ]──────────────────────────┐',
        `  Species     : ${D.character.partner.species}`,
        `  Japanese    : ${D.character.partner.japanese}`,
        `  Appearance  : ${D.character.partner.appearance}`,
        `  Personality : ${D.character.partner.personality}`,
        `  Power Level : ${D.character.partner.powerLevel}`,
        `  Memento     : ${D.character.partner.memento}`,
        '  Status      : napping on the dock (do not disturb)',
        '└─────────────────────────────────────┘',
        'hint: try `pet`',
      ]),
      pet: () => line([
        '*pet pet*',
        'Smoky: purrrrr... ♥♥♥',
        '(affection +1 — but personality is Hot and Cold,',
        ' tomorrow he might ignore you completely)',
      ]),
      ascii: (args) => {
        const name = (args && args[0]) || '';
        if (ART[name]) return line(ART[name]);
        return line([
          '[ASCII ART GALLERY]', '',
          ...Object.keys(ART).map((k) => `  ${k.padEnd(8)} ${ART[k][ART[k].length - 1].trim()}`),
          '', 'pakai: ascii <nama>',
        ]);
      },
      matrix: () => line([
        '01000100 01100001 01100110 01100110 01100001',
        '  ア ミ ツ ネ ム レ カ サ タ ナ',
        '01101000 01101001 01110010 01100101 00100001',
        '',
        'Wake up, visitor...',
        'The portfolio has you.',
        '',
        '(bercanda — situs ini 100% HTML statis, tanpa framework)',
      ]),
      'sudo hire-me': () => line([
        '[sudo] password for visitor: ********',
        'Permission granted. Initiating handshake...',
        `Send offer letters to ${D.socials.email} :)`,
      ]),
    };
  }
  window.TerminalEngine = { createCommands };
  if (typeof document === 'undefined') return;

  const PROMPT = 'daffa@portfolio:~$';
  const BANNER = [
    '██████╗  █████╗ ███████╗███████╗ █████╗',
    '██╔══██╗██╔══██╗██╔════╝██╔════╝██╔══██╗',
    '██║  ██║███████║█████╗  █████╗  ███████║',
    '██║  ██║██╔══██║██╔══╝  ██╔══╝  ██╔══██║',
    '██████╔╝██║  ██║██║     ██║     ██║  ██║',
    '╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝     ╚═╝  ╚═╝',
    '',
    '✻ daffaOS terminal v2.1 — guarded by Smoky the cat',
    'Welcome! Type help to see available commands.',
  ].join('\n');

  // Terminal sekarang hidup sebagai app window: mount(container) membangun
  // sekali lalu dipakai ulang, jadi riwayat command awet walau window ditutup.
  let termRoot = null;
  window.TerminalEngine.mount = function mount(container) {
    if (!termRoot) {
      termRoot = document.createElement('div');
      termRoot.className = 'terminal-host';
      build(termRoot);
    }
    container.appendChild(termRoot);
    const input = termRoot.querySelector('input');
    if (input) setTimeout(() => input.focus(), 60);
  };

  function build(panel) {
    const commands = createCommands(window.PORTFOLIO_DATA);
    const history = [{ command: '/welcome', output: BANNER }];
    let historyIndex = -1;

    const historyContainer = document.createElement('div');
    const inputRow = document.createElement('div');
    inputRow.className = 'current-input';
    const promptSpan = document.createElement('span');
    promptSpan.className = 'prompt';
    promptSpan.textContent = PROMPT;
    const input = document.createElement('input');
    input.type = 'text';
    input.autocomplete = 'off';
    input.spellcheck = false;
    input.setAttribute('aria-label', 'Terminal command input');
    inputRow.append(promptSpan, input);
    const live = document.createElement('div');
    live.setAttribute('aria-live', 'polite');
    live.className = 'sr-only';
    panel.append(historyContainer, inputRow, live);

    const urlRe = /(https?:\/\/[^\s]+)/g;
    const emailRe = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    const isUrl = (v) => /^https?:\/\/[^\s]+$/.test(v);
    const isEmail = (v) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);

    // VT323 tidak punya glyph Block Elements, jadi browser fallback per-karakter
    // dan lebarnya jadi tidak seragam -> art textmode miring. Baris yang memuat
    // blok dipindah ke font mono yang punya glyph-nya.
    const blockRe = /[\u2580-\u259f]/;
    function renderOutput(container, output) {
      output.split('\n').forEach((lineText, i, arr) => {
        if (blockRe.test(lineText)) {
          const span = document.createElement('span');
          span.className = 'tm-art';
          span.textContent = lineText;
          container.appendChild(span);
          if (i < arr.length - 1) container.appendChild(document.createTextNode('\n'));
          return;
        }
        const tokens = lineText.split(urlRe).flatMap((part) => (isUrl(part) ? [part] : part.split(emailRe)));
        tokens.forEach((token) => {
          if (isUrl(token)) {
            const a = document.createElement('a');
            a.href = token; a.target = '_blank'; a.rel = 'noopener noreferrer';
            a.textContent = token;
            container.appendChild(a);
          } else if (isEmail(token)) {
            const a = document.createElement('a');
            a.href = `mailto:${token}`;
            a.textContent = token;
            container.appendChild(a);
          } else {
            container.appendChild(document.createTextNode(token));
          }
        });
        if (i < arr.length - 1) container.appendChild(document.createTextNode('\n'));
      });
    }

    function renderHistory() {
      historyContainer.replaceChildren();
      history.forEach((entry) => {
        const wrap = document.createElement('div');
        wrap.className = 'entry';
        const row = document.createElement('div');
        row.className = 'entry-command-row';
        const pr = document.createElement('span');
        pr.className = 'prompt';
        pr.textContent = PROMPT;
        const cmd = document.createElement('span');
        cmd.className = 'entry-command';
        cmd.textContent = ` ${entry.command}`;
        row.append(pr, cmd);
        const out = document.createElement('pre');
        out.className = 'entry-output';
        renderOutput(out, entry.output);
        wrap.append(row, out);
        historyContainer.appendChild(wrap);
      });
      inputRow.scrollIntoView({ block: 'end' });
    }

    function executeCommand() {
      const raw = input.value;
      const cmd = raw.trim().toLowerCase();
      input.value = '';
      historyIndex = -1;
      if (!cmd) return;
      if (cmd === 'clear') {
        history.length = 0;
        announce('Screen cleared');
        renderHistory();
        return;
      }
      const lookup = (k) => (Object.prototype.hasOwnProperty.call(commands, k) ? commands[k] : null);
      const parts = cmd.split(/\s+/);
      const fn = lookup(cmd) || lookup(parts[0]);
      const output = fn ? fn(parts.slice(1)) : `Command not found: ${cmd}\nType help to see available commands.`;
      history.push({ command: raw, output });
      announce(output);
      renderHistory();
    }

    function announce(msg) {
      live.textContent = '';
      requestAnimationFrame(() => { live.textContent = msg; });
    }

    function setInputFromHistory(nextIndex) {
      const recent = history.filter((h) => h.command !== '/welcome');
      if (recent.length === 0 || nextIndex <= -1) {
        historyIndex = -1;
        input.value = '';
        return;
      }
      historyIndex = Math.max(0, Math.min(nextIndex, recent.length - 1));
      input.value = recent[recent.length - 1 - historyIndex].command;
    }

    input.addEventListener('keydown', (e) => {
      if (e.isComposing || e.keyCode === 229) return;
      if (e.key === 'Enter') executeCommand();
      else if (e.key === 'ArrowUp') { e.preventDefault(); setInputFromHistory(historyIndex + 1); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); setInputFromHistory(historyIndex - 1); }
    });
    panel.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') return;
      const sel = window.getSelection();
      if (sel && sel.toString()) return;
      input.focus();
    });

    renderHistory();
  }
})();
