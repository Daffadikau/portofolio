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
  // storage bisa dilempar error kalau cookie/penyimpanan diblokir browser —
  // situs harus tetap jalan, jadi semua akses dibungkus
  function safeGet(k) {
    try { return sessionStorage.getItem(k); } catch (e) { return null; }
  }
  function safeSet(k, v) {
    try { sessionStorage.setItem(k, v); } catch (e) { /* abaikan */ }
  }
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Sound effect 8-bit sintetis (WebAudio, tanpa file). Volume kecil, bisa dimute.
  const Sfx = (function () {
    let ctx = null;
    let muted = safeGet('smoky-muted') === '1';
    const SEQ = {
      happy: [[880, 0.07], [1318, 0.1]],
      annoyed: [[233, 0.11], [174, 0.14]],
      feed: [[523, 0.06], [523, 0.06], [659, 0.1]],
      brush: [[196, 0.16], [220, 0.16], [196, 0.2]],
      play: [[659, 0.06], [880, 0.06], [1108, 0.1]],
      wake: [[1046, 0.05], [784, 0.1]],
    };
    function play(name) {
      if (muted || !SEQ[name]) return;
      try {
        ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
        let t = ctx.currentTime + 0.01;
        SEQ[name].forEach(([freq, dur]) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.045, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
          osc.connect(gain).connect(ctx.destination);
          osc.start(t); osc.stop(t + dur);
          t += dur * 0.9;
        });
      } catch (e) { /* audio unavailable — stay silent */ }
    }
    return {
      play,
      isMuted: () => muted,
      toggle() {
        muted = !muted;
        safeSet('smoky-muted', muted ? '1' : '0');
        if (!muted) play('happy');
        return muted;
      },
    };
  })();

  const stored = safeGet('smoky-hearts');
  let hearts = stored === null ? 4 : Number(stored);
  if (!(hearts >= 0 && hearts <= 5)) hearts = 4;
  const heartListeners = [];
  function setHearts(n) {
    hearts = Math.max(0, Math.min(5, n));
    safeSet('smoky-hearts', String(hearts));
    heartListeners.forEach((f) => f(hearts));
  }

  // ---- wardrobe: outfit Smoky, dipakai semua instance (About & Skills) ----
  const WARDROBE = {
    hat: [
      { id: 'none', label: 'None', map: null },
      { id: 'cap', label: 'Cap', map: 'wHatCap' },
      { id: 'ushanka', label: 'Ushanka', map: 'wHatUshanka' },
      { id: 'crown', label: 'Crown', map: 'wHatCrown' },
      { id: 'beanie', label: 'Beanie', map: 'wHatBeanie' },
    ],
    outfit: [
      { id: 'none', label: 'None', map: null },
      { id: 'suit', label: 'Suit', map: 'wFitSuit' },
      { id: 'hoodie', label: 'Hoodie', map: 'wFitHoodie' },
      { id: 'scarf', label: 'Scarf', map: 'wFitScarf' },
    ],
    acc: [
      { id: 'none', label: 'None', map: null },
      { id: 'glasses', label: 'Shades', map: 'wAccGlasses' },
      { id: 'headphones', label: 'Headphones', map: 'wAccHeadphones' },
      { id: 'bowtie', label: 'Bowtie', map: 'wAccBowtie' },
    ],
  };
  const SLOT_ORDER = ['outfit', 'acc', 'hat']; // baju dulu, lalu aksesoris, topi paling atas
  let worn = { hat: 'none', outfit: 'none', acc: 'none' };
  try {
    const saved = JSON.parse(localStorage.getItem('smoky-outfit') || 'null');
    if (saved && typeof saved === 'object') {
      Object.keys(worn).forEach((slot) => {
        if (WARDROBE[slot].some((it) => it.id === saved[slot])) worn[slot] = saved[slot];
      });
    }
  } catch (e) { /* storage tidak tersedia — pakai default */ }

  const outfitListeners = [];
  function layerMaps() {
    return SLOT_ORDER
      .map((slot) => (WARDROBE[slot].find((it) => it.id === worn[slot]) || {}).map)
      .filter(Boolean);
  }
  function wear(slot, id) {
    if (!WARDROBE[slot] || !WARDROBE[slot].some((it) => it.id === id)) return;
    worn = Object.assign({}, worn, { [slot]: id });
    try { localStorage.setItem('smoky-outfit', JSON.stringify(worn)); } catch (e) { /* ignore */ }
    outfitListeners.forEach((f) => f(worn));
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
    Sfx.play(refused ? 'annoyed' : (kind === 'poke' ? 'happy' : kind));
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
    let svg = window.PixelArt.renderStack([current, ...layerMaps()], scale);
    btn.appendChild(svg);
    container.appendChild(btn);
    const bubble = document.createElement('span');
    bubble.className = 'smoky-bubble';
    bubble.setAttribute('role', 'status');
    bubble.hidden = true;
    container.appendChild(bubble);

    let revertTimer, idleTimer, blinkTimer;
    let sleeping = false;

    function draw(name) {
      const next = window.PixelArt.renderStack([name, ...layerMaps()], scale);
      btn.replaceChild(next, svg);
      svg = next;
      current = name;
    }
    function setFace(name) {
      if (name === current) return;
      draw(name);
    }
    outfitListeners.push(() => draw(current));
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
      if (wasSleeping) { setFace('catAnnoyed'); say(pick(LINES.wake)); Sfx.play('wake'); return; }
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
        setTimeout(() => { if (!sleeping && current === 'catSleep') setFace('cat'); }, 160);
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
    sfx: Sfx,
    WARDROBE,
    wear,
    getWorn: () => Object.assign({}, worn),
    onOutfit: (f) => outfitListeners.push(f),
  };
})();
