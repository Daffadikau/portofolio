/**
 * Musik latar 8-bit — disintesis di browser, tanpa berkas audio.
 *
 * Nada-nadanya GUBAHAN SENDIRI. Referensi suasananya soundtrack Tomodachi
 * Life (siang ceria, malam tenang), tapi tidak ada satu pun frasa yang
 * disalin: mengaransemen ulang lagu berhak cipta tetap karya turunan.
 *
 * Dua tema, dipilih otomatis mengikuti kelas .night yang dipasang app.js.
 */
(function () {
  const A4 = 440;
  const STEP = { C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2 };
  // "A4" -> 440. "-" berarti diam.
  function hz(n) {
    if (!n || n === '-') return 0;
    const m = /^([A-G])(#?)(-?\d)$/.exec(n);
    if (!m) return 0;
    const semi = STEP[m[1]] + (m[2] ? 1 : 0) + (Number(m[3]) - 4) * 12;
    return A4 * Math.pow(2, semi / 12);
  }
  // . = diam, huruf = nada. Satu baris = 16 langkah (satu birama).
  const THEMES = {
    day: {
      bpm: 116,
      lead: ('E5 . G5 . A5 . G5 . E5 . D5 . C5 . D5 . '
           + 'E5 . E5 . G5 . A5 . G5 . E5 . D5 . . . '
           + 'C5 . D5 . E5 . F5 . E5 . D5 . C5 . A4 . '
           + 'G4 . A4 . C5 . D5 . E5 . . . . . . . ').trim().split(/\s+/),
      bass: ('C3 . C3 . G2 . . . A2 . A2 . E3 . . . '
           + 'F2 . F2 . C3 . . . G2 . G2 . D3 . . . '
           + 'C3 . C3 . G2 . . . A2 . A2 . E3 . . . '
           + 'F2 . G2 . C3 . . . C3 . . . . . . . ').trim().split(/\s+/),
      hat: ('. . x . . . x . . . x . . . x . ').trim().split(/\s+/),
      gain: 0.055,
    },
    night: {
      bpm: 78,
      lead: ('A4 . . . C5 . . . E5 . . . D5 . . . '
           + 'C5 . . . A4 . . . G4 . . . . . . . '
           + 'F4 . . . A4 . . . C5 . . . B4 . . . '
           + 'A4 . . . . . . . . . . . . . . . ').trim().split(/\s+/),
      bass: ('A2 . . . . . . . E2 . . . . . . . '
           + 'F2 . . . . . . . C3 . . . . . . . '
           + 'D2 . . . . . . . A2 . . . . . . . '
           + 'E2 . . . . . . . E2 . . . . . . . ').trim().split(/\s+/),
      hat: ('. . . . . . . . . . . . . . . . ').trim().split(/\s+/),
      gain: 0.045,
    },
  };
  let ctx = null;
  let master = null;
  let timer = null;
  let step = 0;
  let nextAt = 0;
  let playing = false;
  let themeName = 'day';
  const listeners = [];
  function isNight() { return document.documentElement.classList.contains('night'); }
  function tone(type, f, at, dur, vol) {
    if (!f) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f, at);
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(vol, at + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    o.connect(g).connect(master);
    o.start(at); o.stop(at + dur + 0.02);
  }
  function noise(at, dur, vol) {
    const n = ctx.sampleRate * dur;
    const buf = ctx.createBuffer(1, n, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i += 1) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const src = ctx.createBufferSource();
    const g = ctx.createGain();
    src.buffer = buf;
    g.gain.setValueAtTime(vol, at);
    src.connect(g).connect(master);
    src.start(at);
  }
  function schedule() {
    const t = THEMES[themeName];
    const spb = 60 / t.bpm / 4;                       // satu langkah = 1/16
    while (nextAt < ctx.currentTime + 0.25) {
      const i = step % t.lead.length;
      tone('square', hz(t.lead[i]), nextAt, spb * 2.6, t.gain);
      tone('triangle', hz(t.bass[i % t.bass.length]), nextAt, spb * 3.4, t.gain * 1.5);
      if (t.hat[i % t.hat.length] === 'x') noise(nextAt, 0.03, t.gain * 0.5);
      nextAt += spb;
      step += 1;
      // ganti tema di awal birama saja supaya tidak terpotong di tengah
      if (step % 16 === 0) {
        const want = isNight() ? 'night' : 'day';
        if (want !== themeName) { themeName = want; step = 0; }
      }
    }
  }
  function start() {
    if (playing) return;
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
      if (!master) { master = ctx.createGain(); master.gain.value = 1; master.connect(ctx.destination); }
    } catch (e) { return; }
    themeName = isNight() ? 'night' : 'day';
    step = 0;
    nextAt = ctx.currentTime + 0.08;
    playing = true;
    timer = setInterval(schedule, 60);
    schedule();
    listeners.forEach((f) => f(true));
  }
  function stop() {
    playing = false;
    clearInterval(timer);
    timer = null;
    if (master && ctx) {
      // redam cepat supaya tidak berbunyi 'klik'
      master.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.05);
      setTimeout(() => { if (!playing && master) master.gain.value = 1; }, 300);
    }
    listeners.forEach((f) => f(false));
  }
  // berhenti kalau tabnya disembunyikan — jangan bernyanyi di latar belakang
  document.addEventListener('visibilitychange', () => {
    if (!playing || !ctx) return;
    if (document.hidden) ctx.suspend(); else ctx.resume();
  });
  window.Music = {
    start,
    stop,
    toggle: () => (playing ? stop() : start()),
    isPlaying: () => playing,
    onChange: (f) => listeners.push(f),
  };
})();
