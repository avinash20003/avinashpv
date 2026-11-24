// ==========================================================
// PLAYGROUND — Neural Paint · Stack Memory · Bug Smash
// ==========================================================
window.Games = (function(){
  const started = {};

  // ---------- tabs ----------
  function open(name){
    const tab = document.querySelector(`.ptab[data-game="${name}"]`);
    if (!tab) return false;
    $$('.ptab').forEach(t => t.classList.toggle('active', t === tab));
    $$('.game').forEach(g => g.classList.toggle('active', g.id === 'game-' + name));
    if (!started[name]){ started[name] = true; INIT[name](); }
    if (name === 'paint') Paint.resize();
    return true;
  }
  $$('.ptab').forEach(t => t.addEventListener('click', () => open(t.dataset.game)));

  // ======================================================
  // 1. NEURAL PAINT — generative brushes with symmetry
  // ======================================================
  const Paint = (function(){
    const cv = $('#paintCanvas'), cx = cv.getContext('2d');
    let W = 0, H = 0, dpr = Math.min(devicePixelRatio || 1, 2);
    let brush = 'neural', sym = 2, colorMode = 'theme', hue = 0, drawing = false, last = null, history = [], tick = 0;
    const BG = '#060609';

    function resize(){
      const r = cv.getBoundingClientRect(); if (!r.width) return;
      const snap = W ? cv.toDataURL() : null;
      W = cv.width = r.width * dpr; H = cv.height = r.height * dpr;
      cx.fillStyle = BG; cx.fillRect(0, 0, W, H);
      if (snap){ const img = new Image(); img.onload = () => cx.drawImage(img, 0, 0, W, H); img.src = snap; }
    }
    addEventListener('resize', () => { if ($('#game-paint').classList.contains('active')) resize(); });

    function color(alpha){
      if (colorMode === 'rainbow'){ hue = (hue + 1.2) % 360; cx.globalAlpha = 1; return `hsla(${hue},90%,62%,${alpha})`; }
      const list = [cssVar('--c1'), cssVar('--c2'), cssVar('--c3')];
      const c = list[Math.floor(tick / 40) % 3];
      cx.globalAlpha = alpha; return c;
    }
    // symmetry: returns transformed copies of a point
    function copies(p){
      const cxm = W / 2, cym = H / 2, out = [p];
      if (sym === 2) out.push({x: W - p.x, y: p.y});
      if (sym === 6){
        const dx = p.x - cxm, dy = p.y - cym;
        for (let k = 1; k < 6; k++){ const a = k * Math.PI / 3, c = Math.cos(a), s = Math.sin(a);
          out.push({x: cxm + dx * c - dy * s, y: cym + dx * s + dy * c}); }
      }
      return out;
    }
    function line(a, b, width, style, glow){
      cx.lineWidth = width; cx.strokeStyle = style; cx.lineCap = 'round';
      cx.shadowBlur = glow || 0; cx.shadowColor = style;
      cx.beginPath(); cx.moveTo(a.x, a.y); cx.lineTo(b.x, b.y); cx.stroke();
      cx.shadowBlur = 0;
    }
    function stroke(p){
      tick++;
      const A = copies(last), B = copies(p);
      for (let i = 0; i < A.length; i++){
        const a = A[i], b = B[i];
        if (brush === 'neural'){
          line(a, b, 1.4 * dpr, color(.9));
          // connect to nearby earlier points → web / neuron look
          for (let j = history.length - 1; j >= Math.max(0, history.length - 60); j -= 2){
            const h = copies(history[j])[i], d = Math.hypot(h.x - b.x, h.y - b.y);
            if (d < 70 * dpr && Math.random() > .45) line(b, h, .6 * dpr, color(.18 * (1 - d / (70 * dpr))));
          }
        } else if (brush === 'neon'){
          line(a, b, 3.2 * dpr, color(1), 18 * dpr);
          line(a, b, 1 * dpr, 'rgba(255,255,255,.9)');
        } else {
          for (let k = 0; k < 14; k++){
            const ang = Math.random() * 6.283, rad = Math.random() * 22 * dpr;
            cx.fillStyle = color(Math.random() * .8 + .2);
            cx.beginPath(); cx.arc(b.x + Math.cos(ang) * rad, b.y + Math.sin(ang) * rad, Math.random() * 1.8 * dpr + .3, 0, 7); cx.fill();
          }
        }
      }
      cx.globalAlpha = 1;
      history.push(p); if (history.length > 400) history.shift();
      last = p;
    }
    const pos = e => { const r = cv.getBoundingClientRect(); return {x: (e.clientX - r.left) * dpr, y: (e.clientY - r.top) * dpr}; };
    cv.addEventListener('pointerdown', e => { drawing = true; last = pos(e); cv.setPointerCapture(e.pointerId); $('#paintHint').classList.add('gone'); });
    cv.addEventListener('pointermove', e => { if (drawing) stroke(pos(e)); });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => cv.addEventListener(ev, () => { drawing = false; }));

    // toolbar
    const group = (attr, set) => $$(`[data-${attr}]`).forEach(b => b.addEventListener('click', () => {
      $$(`[data-${attr}]`).forEach(x => x.classList.toggle('active', x === b)); set(b.dataset[attr]);
    }));
    group('brush', v => brush = v);
    group('sym', v => sym = +v);
    group('color', v => colorMode = v);
    $('#paintClear').addEventListener('click', () => { cx.fillStyle = BG; cx.fillRect(0, 0, W, H); history = []; $('#paintHint').classList.remove('gone'); });
    $('#paintSave').addEventListener('click', () => {
      // signature in the corner
      cx.font = `${13 * dpr}px "JetBrains Mono", monospace`; cx.fillStyle = 'rgba(255,255,255,.35)';
      cx.fillText(`made at ${location.host || R.shortName + '.ai'}`, 14 * dpr, H - 14 * dpr);
      const a = document.createElement('a'); a.download = 'neural-art.png'; a.href = cv.toDataURL('image/png'); a.click();
      toast('Saved your artwork 🎨');
    });
    return {resize, init: resize};
  })();

  // ======================================================
  // 2. STACK MEMORY — match the tech pairs
  // ======================================================
  function initMemory(){
    const grid = $('#memGrid');
    const pool = ['Next.js', 'Flutter', 'Python', 'PostgreSQL', 'Docker', 'Frappe', 'Gemma', 'Node.js'];
    let first = null, lock = false, moves = 0, found = 0, t0 = 0, timer = null;
    const best = () => store.get('memBest');
    $('#memBest').textContent = best() ? best() + ' moves' : '—';

    function deal(){
      clearInterval(timer); t0 = 0; moves = 0; found = 0; first = null; lock = false;
      $('#memMoves').textContent = 0; $('#memTime').textContent = '0s'; $('#memMsg').textContent = 'Flip two cards to find a matching pair.';
      const deck = [...pool, ...pool].sort(() => Math.random() - .5);
      grid.innerHTML = deck.map(n => `<button class="mem-card" data-n="${n}" aria-label="Card"><div class="mem-inner"><div class="mem-face mem-front">✦</div><div class="mem-face mem-back">${n}</div></div></button>`).join('');
    }
    grid.addEventListener('click', e => {
      const card = e.target.closest('.mem-card');
      if (!card || lock || card === first || card.classList.contains('done')) return;
      if (!t0){ t0 = Date.now(); timer = setInterval(() => $('#memTime').textContent = Math.floor((Date.now() - t0) / 1000) + 's', 250); }
      card.classList.add('flip');
      if (!first){ first = card; return; }
      moves++; $('#memMoves').textContent = moves;
      if (first.dataset.n === card.dataset.n){
        first.classList.add('done'); card.classList.add('done'); first = null; found++;
        if (found === pool.length){
          clearInterval(timer);
          const secs = Math.floor((Date.now() - t0) / 1000);
          const prev = +best() || Infinity;
          if (moves < prev){ store.set('memBest', moves); $('#memBest').textContent = moves + ' moves'; }
          const msg = `You matched my whole stack in <b>${moves} moves</b> and <b>${secs}s</b>${moves < prev ? ' (new best!)' : ''}. Good memory, and I'd remember to hire you too. 😄`;
          $('#memMsg').innerHTML = msg; speak(`Nice! You matched my whole stack in ${moves} moves.`);
        }
      } else {
        lock = true; const a = first, b = card; a.classList.add('wrong'); b.classList.add('wrong');
        setTimeout(() => { a.classList.remove('flip', 'wrong'); b.classList.remove('flip', 'wrong'); first = null; lock = false; }, 750);
      }
    });
    $('#memReset').addEventListener('click', deal);
    deal();
  }

  // ======================================================
  // 3. BUG SMASH — whack-a-bug, avoid the features
  // ======================================================
  function initBugs(){
    const grid = $('#bugGrid'), N = 16, DURATION = 20;
    grid.innerHTML = Array.from({length: N}, (_, i) => `<div class="hole" data-i="${i}"></div>`).join('');
    const holes = [...grid.children];
    let score = 0, left = 0, running = false, spawnT = null, clockT = null;
    $('#bugBest').textContent = store.get('bugBest') || 0;

    function spawn(){
      const free = holes.filter(h => !h.dataset.kind); if (!free.length) return;
      const h = free[Math.floor(Math.random() * free.length)];
      const kind = Math.random() < .18 ? 'feature' : 'bug';
      h.dataset.kind = kind; h.innerHTML = `<span class="critter">${kind === 'bug' ? '🐞' : '✨'}</span>`;
      const life = Math.max(550, 1000 - (DURATION - left) * 18);       // gets faster over time
      h._t = setTimeout(() => clear(h), life);
      spawnT = setTimeout(spawn, Math.max(320, 700 - (DURATION - left) * 16));
    }
    function clear(h){ clearTimeout(h._t); delete h.dataset.kind; h.innerHTML = ''; }
    function flash(h, cls){ h.classList.add(cls); setTimeout(() => h.classList.remove(cls), 220); }
    grid.addEventListener('pointerdown', e => {
      const h = e.target.closest('.hole'); if (!h || !running) return;
      if (h.dataset.kind === 'bug'){ score++; flash(h, 'hit'); clear(h); }
      else if (h.dataset.kind === 'feature'){ score = Math.max(0, score - 2); flash(h, 'miss'); clear(h); toast('That was a feature! −2'); }
      $('#bugScore').textContent = score;
    });
    function start(){
      if (running) return; running = true; score = 0; left = DURATION;
      $('#bugScore').textContent = 0; $('#bugTime').textContent = left + 's';
      $('#bugMsg').textContent = 'Go go go! 🐞'; $('#bugStart').textContent = 'Running…';
      spawn();
      clockT = setInterval(() => { left--; $('#bugTime').textContent = left + 's'; if (left <= 0) end(); }, 1000);
    }
    function end(){
      running = false; clearInterval(clockT); clearTimeout(spawnT); holes.forEach(clear);
      $('#bugStart').textContent = 'Play again ▶';
      const best = +store.get('bugBest') || 0;
      if (score > best){ store.set('bugBest', score); $('#bugBest').textContent = score; }
      const rank = score >= 25 ? 'Senior QA Engineer 🏆' : score >= 15 ? 'Bug Hunter 🔍' : score >= 8 ? 'Junior Debugger 🧑‍💻' : 'Intern 🌱';
      $('#bugMsg').innerHTML = `You squashed <b>${score} bugs</b>${score > best ? ' (new best!)' : ''}. Rank: <b>${rank}</b>`;
      speak(`Time's up! You squashed ${score} bugs.`);
    }
    $('#bugStart').addEventListener('click', start);
  }

  const INIT = { paint: Paint.init, memory: initMemory, bugs: initBugs };
  // start the default game when the section first comes into view
  const io = new IntersectionObserver(es => { if (es[0].isIntersecting){ open('paint'); io.disconnect(); } }, {threshold: .1});
  io.observe($('#playground'));
  return { open };
})();
