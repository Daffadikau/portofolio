// Smoky — maskot interaktif ala Tomodachi Life / Tamagotchi.
// Personality "Hot and Cold": kadang manja, kadang cuek — sesuai profil Neko Atsume-nya.
(function () {
  const LINES = {
    happy: ['purrrr... ♥', 'mrrp!', '*rubs against you*', 'nyaa~'],
    annoyed: ['...', '*ignores you*', 'mrow. (not now)', '*flicks tail*'],
    wake: ['mrrp?! (you woke him up)'],
    feed: ['*nom nom* ♥', 'fish!! ♥', '*eats elegantly*'],
    feedRefuse: ['*sniffs... walks away*', 'not hungry.'],
    brush: ['purrRRRR ♥♥', '*melts completely*', 'soft brush... his one weakness'],
    brushRefuse: ['*tolerates it. barely.*'],
    play: ['*pounces the ball!*', '*bap bap bap*', '*zoomies activated*'],
    playRefuse: ['*watches the ball roll by*'],
  };
  const REFUSE_CHANCE = { poke: 0.35, feed: 0.25, brush: 0.05, play: 0.2 };
  const HEART_DELTA = { poke: 1, feed: 1, brush: 2, play: 1 };
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const stored = sessionStorage.getItem('smoky-hearts');
  let hearts = stored === null ? 4 : Number(stored);
  if (!(hearts >= 0 && hearts <= 5)) hearts = 4;
  const heartListeners = [];
  function setHearts(n) {
    hearts = Math.max(0, Math.min(5, n));
    sessionStorage.setItem('smoky-hearts', String(hearts));
    heartListeners.forEach((f) => f(hearts));
  }

  const instances = [];

  function interact(kind) {
    const refused = Math.random() < REFUSE_CHANCE[kind];
    let expression, lineKey;
    if (kind === 'poke') {
      expression = refused ? 'catAnnoyed' : 'catHappy';
      lineKey = refused ? 'annoyed' : 'happy';
    } else {
      expression = refused ? 'catAnnoyed' : 'catHappy';
      lineKey = refused ? `${kind}Refuse` : kind;
    }
    setHearts(hearts + (refused ? -1 : HEART_DELTA[kind]));
    const result = { expression, line: pick(LINES[lineKey] || LINES.happy), refused };
    instances.forEach((inst) => inst.react(result));
    return result;
  }

  // attach(container, scale): render Smoky yang bisa diklik + speech bubble + hati melayang
  function attach(container, scale) {
    container.classList.add('smoky-box');
    const btn = document.createElement('button');
    btn.className = 'smoky-btn';
    btn.setAttribute('aria-label', 'Interact with Smoky the cat');
    btn.title = 'poke Smoky';
    let current = 'cat';
    let svg = window.PixelArt.render(current, scale);
    btn.appendChild(svg);
    container.appendChild(btn);
    const bubble = document.createElement('span');
    bubble.className = 'smoky-bubble';
    bubble.setAttribute('role', 'status');
    bubble.hidden = true;
    container.appendChild(bubble);

    let revertTimer, idleTimer, blinkTimer;
    let sleeping = false;

    function setFace(name) {
      if (name === current) return;
      const next = window.PixelArt.render(name, scale);
      btn.replaceChild(next, svg);
      svg = next;
      current = name;
    }
    function say(text, ms) {
      bubble.hidden = false;
      bubble.textContent = text;
      clearTimeout(revertTimer);
      revertTimer = setTimeout(() => {
        bubble.hidden = true;
        setFace(sleeping ? 'catSleep' : 'cat');
      }, ms || 1600);
    }
    function floatHearts(n) {
      if (reduced) return;
      for (let i = 0; i < n; i += 1) {
        const h = document.createElement('span');
        h.className = 'heart-float';
        h.textContent = '♥';
        h.style.left = `${30 + Math.random() * 40}%`;
        h.style.animationDelay = `${i * 120}ms`;
        container.appendChild(h);
        setTimeout(() => h.remove(), 1200 + i * 120);
      }
    }
    function react(result) {
      const wasSleeping = sleeping;
      sleeping = false;
      scheduleIdle();
      if (wasSleeping) { setFace('catAnnoyed'); say(pick(LINES.wake)); return; }
      setFace(result.expression);
      say(result.line);
      if (!result.refused) floatHearts(2);
    }
    function scheduleIdle() {
      if (reduced) return;
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => { sleeping = true; setFace('catSleep'); say('zzz...', 2600); }, 25000);
    }
    if (!reduced) {
      blinkTimer = setInterval(() => {
        if (sleeping || !bubble.hidden) return;
        setFace('catSleep');
        setTimeout(() => { if (!sleeping) setFace('cat'); }, 160);
      }, 4800);
    }
    scheduleIdle();
    btn.addEventListener('click', () => interact('poke'));

    const inst = { react };
    instances.push(inst);
    return inst;
  }

  window.Smoky = {
    attach,
    interact,
    getHearts: () => hearts,
    onHearts: (f) => heartListeners.push(f),
  };
})();
