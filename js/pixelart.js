(function () {
  const PALETTE = {
    k: '#1a1a1a', w: '#ffffff', o: '#f0713d', y: '#f5d93d',
    g: '#9dc24c', e: '#e8e8e8', b: '#4a90d9', p: '#f2b5a0',
    s: '#43434a',
  };
  const MAPS = {
    // Smoky — Neko Atsume regular cat, くろねこさん "Black Cat" (solid black, yellow eyes)
    cat: [
      '..k..........k..',
      '.ksk........ksk.',
      '.kssk......kssk.',
      '.kssskkkkkksssk.',
      'kssssssssssssssk',
      'kssyyssssssyyssk',
      'kssyyssssssyyssk',
      'kssssssskssssssk',
      '.kssssssssssssk.',
      '.kssssssssssssk.',
      'kssssssssssssssk',
      'kssssssssssssssk',
      'kssssssssssssssk',
      'kssssssssssssssk',
      '.kssssssssssssk.',
      '..kkkkkkkkkkkk..',
    ],
    about: [
      '.kkkkkkkkkk.',
      'keeeeeeeeeek',
      'keekeeeekeek',
      'keekeeeekeek',
      'keeeeeeeeeek',
      'kekeeeeeekek',
      'kekeeeeeekek',
      'keekkkkkkeek',
      'keeeeeeeeeek',
      'keeeeeeeeeek',
      '.kkkkkkkkkk.',
      '............',
    ],
    folder: [
      '............',
      'kkkkk.......',
      'kyyyykkkkkk.',
      'kyyyyyyyyyk.',
      'kkkkkkkkkkkk',
      'kyyyyyyyyyyk',
      'kyyyyyyyyyyk',
      'kyyyyyyyyyyk',
      'kyyyyyyyyyyk',
      'kyyyyyyyyyyk',
      'kkkkkkkkkkkk',
      '............',
    ],
    chip: [
      '..k..k..k...',
      '.kkkkkkkkk..',
      'kkgggggggkk.',
      '.kggkkkggk..',
      'kkgkgggkgkk.',
      '.kgkgggkgk..',
      'kkgkgggkgkk.',
      '.kggkkkggk..',
      'kkgggggggkk.',
      '.kkkkkkkkk..',
      '..k..k..k...',
      '............',
    ],
    mail: [
      '............',
      'kkkkkkkkkkkk',
      'kwwwwwwwwwwk',
      'kkwwwwwwwwkk',
      'kwkwwwwwwkwk',
      'kwwkwwwwkwwk',
      'kwwwkkkkwwwk',
      'kwwwwwwwwwwk',
      'kwwwwwwwwwwk',
      'kkkkkkkkkkkk',
      '............',
      '............',
    ],
    term: [
      'kkkkkkkkkkkk',
      'kkkkkkkkkkkk',
      'kgkkkkkkkkgk',
      'kkgkkkkkkkkk',
      'kkkgkkkkkkkk',
      'kkgkkkkkkkkk',
      'kgkkkkkkkkgk',
      'kkkkkggggkkk',
      'kkkkkkkkkkkk',
      'kkkkkkkkkkkk',
      '............',
      '............',
    ],
    github: [
      '...kkkkkk...',
      '..kkkkkkkk..',
      '.kkwkkkkwkk.',
      '.kkkkkkkkkk.',
      '.kkkkkkkkkk.',
      '.kkkkkkkkkk.',
      '..kkkkkkkk..',
      '..kk.kk.kk..',
      '.kkk.kk.kkk.',
      '..k......k..',
      '............',
      '............',
    ],
    linkedin: [
      'kkkkkkkkkkkk',
      'kbbbbbbbbbbk',
      'kbwbbbbbbbbk',
      'kbbbbbbbbbbk',
      'kbwbwwwbbbbk',
      'kbwbwbbwbbbk',
      'kbwbwbbwbbbk',
      'kbwbwbbwbbbk',
      'kbwbwbbwbbbk',
      'kbbbbbbbbbbk',
      'kkkkkkkkkkkk',
      '............',
    ],
  };
  function render(name, scale = 1) {
    const map = MAPS[name];
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    const h = map.length, w = map[0].length;
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.setAttribute('width', w * scale);
    svg.setAttribute('height', h * scale);
    svg.setAttribute('shape-rendering', 'crispEdges');
    svg.setAttribute('aria-hidden', 'true');
    map.forEach((row, y) => {
      [...row].forEach((ch, x) => {
        if (ch === '.') return;
        const r = document.createElementNS(NS, 'rect');
        r.setAttribute('x', x); r.setAttribute('y', y);
        r.setAttribute('width', 1); r.setAttribute('height', 1);
        r.setAttribute('fill', PALETTE[ch] || '#000');
        svg.appendChild(r);
      });
    });
    return svg;
  }
  window.PixelArt = { render, MAPS };
})();
