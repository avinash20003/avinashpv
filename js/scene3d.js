// ==========================================================
// SCENE 3D — a cinematic flight through Avinash's story
// (Three.js / WebGL). Scrolling moves the camera forward:
//   0  Solar system   — planets spin and revolve around a sun
//   1  Electronics     — circuit board with travelling pulses,
//                        chips, resistors, capacitors, LEDs,
//                        oscilloscope sine wave (ECE background)
//   2  Code tunnel     — floating code windows + flying symbols
//   3  Health & data   — ECG heartbeat, databases, data packets
//   4  Apps            — phones & dashboards of real projects
//   5  Finale          — an atom: electronics meets space
// Falls back to the 2D starfield if WebGL isn't available.
// ==========================================================
(function(){
  FX.why3d = !window.THREE ? 'nowebgl' : reduce ? 'reduce' : '';
  if (FX.why3d) return;
  const canvas = document.getElementById('scene3d');
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({canvas, antialias: !FX.lite, alpha: true, powerPreference: 'high-performance'});
  } catch(e){ canvas.remove(); FX.why3d = 'nowebgl'; return; }
  // No real graphics card (software rendering)? Use the lighter 2D effects instead.
  try {
    const gl = renderer.getContext(), ext = gl.getExtension('WEBGL_debug_renderer_info');
    const gpu = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : '';
    FX.softGPU = /swiftshader|llvmpipe|softpipe|software|basic render/i.test(gpu);
    if (FX.softGPU){ FX.lite = true; document.documentElement.classList.add('lite'); }   // no GPU: keep 3D, render lighter
  } catch(e){}
  FX.three = true;
  document.documentElement.classList.add('three-on');

  const small = innerWidth < 900;
  const quality = () => FX.softGPU ? .55 : FX.lite ? .7 : small ? 1 : Math.min(devicePixelRatio || 1, 1.5);
  renderer.setPixelRatio(quality());
  renderer.setSize(innerWidth, innerHeight, false);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050507, .021);
  const camera = new THREE.PerspectiveCamera(62, innerWidth / innerHeight, .1, 420);
  const PI = Math.PI, rand = (a, b) => a + Math.random() * (b - a), pick = a => a[Math.floor(Math.random() * a.length)];
  const anims = [];                                         // per-frame updaters: fn(t, dt)

  // ---------- theme colours ----------
  const TC = {c1: new THREE.Color(), c2: new THREE.Color(), c3: new THREE.Color()};
  const themed = [];
  const theme = (mat, key, prop = 'color') => { themed.push({mat, key, prop}); return mat; };
  function readTheme(){
    for (const k in TC) TC[k].set(cssVar('--' + k) || '#8b93f8');
    for (const t of themed) t.mat[t.prop].copy(TC[t.key]);
  }

  // ---------- helpers ----------
  function tex(w, h, draw){
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    draw(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
  }
  const glowTex = tex(128, 128, (g) => {
    const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(.22, 'rgba(255,255,255,.5)'); r.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = r; g.fillRect(0, 0, 128, 128);
  });
  function glow(color, size, opacity = 1){
    const m = new THREE.SpriteMaterial({map: glowTex, color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false});
    const s = new THREE.Sprite(m); s.scale.set(size, size, 1); return s;
  }
  function textSprite(text, color, size, font = '600 64px JetBrains Mono, monospace'){
    const t = tex(256, 128, (g) => { g.font = font; g.fillStyle = color; g.textAlign = 'center'; g.textBaseline = 'middle'; g.shadowColor = color; g.shadowBlur = 18; g.fillText(text, 128, 64); });
    const s = new THREE.Sprite(new THREE.SpriteMaterial({map: t, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending}));
    s.scale.set(size * 2, size, 1); return s;
  }
  const std = (color, extra = {}) => new THREE.MeshStandardMaterial(Object.assign({color, roughness: .55, metalness: .35}, extra));

  // ---------- lights ----------
  scene.add(new THREE.AmbientLight(0x9aa3c7, .7));
  const keyLight = new THREE.DirectionalLight(0xcfdcff, 1.1); keyLight.position.set(6, 10, 8); scene.add(keyLight);
  const rim = new THREE.DirectionalLight(0x8b93f8, .6); rim.position.set(-8, -4, -6); scene.add(rim);

  // ======================================================
  // STARS + WARP STREAKS
  // ======================================================
  const N = (FX.lite || small) ? 1500 : 2800, Z0 = 40, Z1 = -360;
  const sp = new Float32Array(N * 3);
  for (let i = 0; i < N; i++){ sp[i*3] = rand(-150, 150); sp[i*3+1] = rand(-95, 95); sp[i*3+2] = rand(Z1, Z0); }
  const starGeo = new THREE.BufferGeometry(); starGeo.setAttribute('position', new THREE.BufferAttribute(sp, 3));
  scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({color: 0xe3e8ff, size: .22, transparent: true, opacity: .9, depthWrite: false})));
  const SN = Math.min(800, N / 3 | 0), sl = new Float32Array(SN * 6);
  for (let i = 0; i < SN; i++){ for (let k = 0; k < 2; k++){ sl[i*6+k*3] = sp[i*3]; sl[i*6+k*3+1] = sp[i*3+1]; sl[i*6+k*3+2] = sp[i*3+2]; } }
  const streakGeo = new THREE.BufferGeometry(); streakGeo.setAttribute('position', new THREE.BufferAttribute(sl, 3));
  const streakMat = theme(new THREE.LineBasicMaterial({transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false}), 'c1');
  scene.add(new THREE.LineSegments(streakGeo, streakMat));
  function updateStreaks(speed){
    const len = Math.min(Math.abs(speed) * .09, 9) * Math.sign(-speed || 1);
    streakMat.opacity = Math.min(.85, Math.abs(speed) / 40);
    if (streakMat.opacity < .02) return;
    for (let i = 0; i < SN; i++) sl[i*6+5] = sl[i*6+2] + len;
    streakGeo.attributes.position.needsUpdate = true;
  }

  // ======================================================
  // 0. SOLAR SYSTEM — spinning, revolving planets
  // ======================================================
  function noisy(g, w, h, base, spots, n = 220){
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    for (let i = 0; i < n; i++){ g.fillStyle = pick(spots); g.globalAlpha = rand(.08, .35); g.beginPath(); g.ellipse(rand(0, w), rand(0, h), rand(4, 30), rand(2, 12), 0, 0, 2 * PI); g.fill(); }
    g.globalAlpha = 1;
  }
  const PT = {
    sun:   () => tex(256, 128, (g, w, h) => noisy(g, w, h, '#ffb347', ['#fff3b0', '#ff7a18', '#ffd166', '#ff9f43'], 420)),
    rock:  () => tex(256, 128, (g, w, h) => { noisy(g, w, h, '#8d7b6a', ['#5c4d40', '#b8a38c', '#6e6157']); for (let i = 0; i < 40; i++){ g.strokeStyle = 'rgba(40,30,24,.5)'; g.beginPath(); g.arc(rand(0, w), rand(0, h), rand(2, 9), 0, 2 * PI); g.stroke(); } }),
    ocean: () => tex(256, 128, (g, w, h) => { noisy(g, w, h, '#1e6fa8', ['#2b8fd1', '#14507a'], 120); for (let i = 0; i < 26; i++){ g.fillStyle = pick(['#3f8f4d', '#6b8f3f', '#a08a5a']); g.globalAlpha = .9; g.beginPath(); g.ellipse(rand(0, w), rand(20, h - 20), rand(8, 30), rand(5, 14), rand(0, PI), 0, 2 * PI); g.fill(); } g.globalAlpha = .85; g.fillStyle = '#f1f6ff'; g.fillRect(0, 0, w, 9); g.fillRect(0, h - 9, w, 9); g.globalAlpha = 1; }),
    lava:  () => tex(256, 128, (g, w, h) => { noisy(g, w, h, '#3a0f08', ['#5a1a0c', '#1c0704'], 160); g.strokeStyle = '#ff8a2a'; g.lineWidth = 1.5; g.shadowColor = '#ff6a00'; g.shadowBlur = 6; for (let i = 0; i < 40; i++){ g.beginPath(); let x = rand(0, w), y = rand(0, h); g.moveTo(x, y); for (let k = 0; k < 4; k++){ x += rand(-18, 18); y += rand(-10, 10); g.lineTo(x, y); } g.stroke(); } }),
    gas:   () => tex(256, 128, (g, w, h) => { const cols = ['#e9c98b', '#c48a4f', '#f3dfb5', '#9c6a3c', '#e2b87e', '#7d532e']; for (let y = 0; y < h; y++){ g.fillStyle = cols[Math.floor((y / h * 9 + Math.sin(y * .3) * .6) % cols.length + cols.length) % cols.length]; g.fillRect(0, y, w, 1); } g.fillStyle = 'rgba(190,90,50,.8)'; g.beginPath(); g.ellipse(170, 80, 16, 8, 0, 0, 2 * PI); g.fill(); }),
    ice:   () => tex(256, 128, (g, w, h) => { noisy(g, w, h, '#bfe3f5', ['#ffffff', '#8cc6e2', '#e8f7ff'], 200); }),
    violet:() => tex(256, 128, (g, w, h) => { for (let y = 0; y < h; y++){ g.fillStyle = `hsl(${265 + Math.sin(y * .12) * 18},55%,${45 + Math.sin(y * .31) * 12}%)`; g.fillRect(0, y, w, 1); } })
  };
  const solar = new THREE.Group(); solar.rotation.x = .32; solar.rotation.z = .18;
  // keep the solar system in the top-right corner on every screen shape
  // place the sun at an exact spot on the landing screen (fx, fy from -1..1)
  const SOLAR_AT = window.SOLAR_AT || {wide: [.12, .44, .46], narrow: [.55, .64, .4]};
  function placeSolar(){
    const narrow = innerWidth < innerHeight, [fx, fy, sc] = narrow ? SOLAR_AT.narrow : SOLAR_AT.wide;
    camera.position.set(0, 1.5, 0); camera.lookAt(0, .55, -14); camera.updateMatrixWorld();
    const v = new THREE.Vector3(fx, fy, .5).unproject(camera).sub(camera.position).normalize();
    const k = -46 / v.z;                                     // point on that ray at depth z = -46
    solar.position.copy(camera.position).addScaledVector(v, k);
    solar.scale.setScalar(sc);
  }
  placeSolar(); scene.add(solar);
  const sun = new THREE.Mesh(new THREE.SphereGeometry(3.2, 48, 32), new THREE.MeshBasicMaterial({map: PT.sun()}));
  solar.add(sun, glow(0xffc266, 15, .95), glow(0xff7a18, 32, .35));
  solar.add(new THREE.PointLight(0xffc47a, 3.2, 70, 0));
  const PLANETS = [
    {t: 'rock',   r: .5,  d: 6,   s: 1.0},
    {t: 'ocean',  r: .8,  d: 9,   s: .7, moon: true},
    {t: 'lava',   r: .6,  d: 12,  s: .52},
    {t: 'gas',    r: 1.55,d: 16.5,s: .32, ring: true},
    {t: 'ice',    r: 1.0, d: 21,  s: .22},
    {t: 'violet', r: 1.2, d: 25.5,s: .15}
  ];
  PLANETS.forEach(p => {
    const orbit = new THREE.Group(); orbit.rotation.y = rand(0, 2 * PI); solar.add(orbit);
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(p.r, 40, 28), std(0xffffff, {map: PT[p.t](), roughness: .85, metalness: 0}));
    mesh.position.x = p.d; mesh.rotation.z = rand(-.4, .4); orbit.add(mesh);
    if (p.ring){
      const ring = new THREE.Mesh(new THREE.RingGeometry(p.r * 1.4, p.r * 2.3, 72), new THREE.MeshBasicMaterial({color: 0xe0c99a, side: THREE.DoubleSide, transparent: true, opacity: .55}));
      ring.rotation.x = PI / 2 - .35; mesh.add(ring);
    }
    let moonPivot = null;
    if (p.moon){
      moonPivot = new THREE.Group(); mesh.add(moonPivot);
      const moon = new THREE.Mesh(new THREE.SphereGeometry(.2, 20, 14), std(0xcfd4dc, {roughness: .9, metalness: 0})); moon.position.x = 1.4; moonPivot.add(moon);
    }
    const pts = []; for (let i = 0; i <= 128; i++){ const a = i / 128 * 2 * PI; pts.push(new THREE.Vector3(Math.cos(a) * p.d, 0, Math.sin(a) * p.d)); }
    solar.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), theme(new THREE.LineBasicMaterial({transparent: true, opacity: .22}), 'c2')));
    anims.push((t, dt) => {
      orbit.rotation.y += p.s * dt * .00035;               // revolve around the sun
      mesh.rotation.y += dt * .0009;                       // spin on its own axis
      if (moonPivot) moonPivot.rotation.y += dt * .002;
    });
  });
  anims.push((t, dt) => { sun.rotation.y += dt * .00015; });

  // ======================================================
  // 1. ELECTRONICS — PCB, pulses, components, sine wave
  // ======================================================
  const PCB_Z = -88, PCB_S = 74, segs = [];
  const pcbTex = tex(1024, 1024, (g, w, h) => {
    g.fillStyle = '#03110d'; g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(46,214,160,.12)'; g.lineWidth = 1;
    for (let i = 0; i < w; i += 32){ g.beginPath(); g.moveTo(i, 0); g.lineTo(i, h); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(w, i); g.stroke(); }
    g.lineCap = 'round';
    for (let k = 0; k < 70; k++){
      let x = Math.round(rand(2, 30)) * 32, y = Math.round(rand(2, 30)) * 32;
      g.strokeStyle = 'rgba(60,235,180,.65)'; g.lineWidth = pick([2, 3, 4]);
      g.beginPath(); g.moveTo(x, y);
      for (let s = 0; s < 4; s++){
        const dir = pick([[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1]]), len = Math.round(rand(2, 7)) * 32;
        const nx = Math.max(16, Math.min(w - 16, x + dir[0] * len)), ny = Math.max(16, Math.min(h - 16, y + dir[1] * len));
        segs.push([x, y, nx, ny]); g.lineTo(nx, ny); x = nx; y = ny;
      }
      g.stroke();
      g.fillStyle = '#c9a85a'; g.beginPath(); g.arc(x, y, 6, 0, 2 * PI); g.fill();
    }
    for (let k = 0; k < 9; k++){                            // IC footprints
      const x = rand(80, w - 200), y = rand(80, h - 200), s = rand(70, 130);
      g.strokeStyle = 'rgba(201,168,90,.8)'; g.lineWidth = 2; g.strokeRect(x, y, s, s);
      g.fillStyle = 'rgba(201,168,90,.75)';
      for (let p = 8; p < s; p += 14){ g.fillRect(x + p, y - 8, 6, 8); g.fillRect(x + p, y + s, 6, 8); g.fillRect(x - 8, y + p, 8, 6); g.fillRect(x + s, y + p, 8, 6); }
    }
  });
  const pcb = new THREE.Mesh(new THREE.PlaneGeometry(PCB_S, PCB_S), std(0xffffff, {map: pcbTex, emissiveMap: pcbTex, emissive: 0xffffff, emissiveIntensity: .55, roughness: .6, metalness: .2}));
  pcb.rotation.x = -PI / 2; pcb.position.set(0, -7, PCB_Z); scene.add(pcb);
  pcb.material.transparent = true;
  // the board fades in as the camera approaches (keeps the landing page clean)
  anims.push(() => { const d = camera.position.z - (PCB_Z + PCB_S / 2); pcb.material.opacity = Math.max(0, Math.min(1, 1 - (d - 8) / 30)); pcb.visible = pcb.material.opacity > .01; });
  const toWorld = (x, y) => new THREE.Vector3((x / 1024 - .5) * PCB_S, -6.85, PCB_Z + (y / 1024 - .5) * PCB_S);
  const pulses = [];
  for (let i = 0; i < ((FX.lite || small) ? 14 : 30); i++){
    const s = glow(0x5ff5c8, 1.1, .95); scene.add(s);
    const p = {s, a: null, b: null, k: Math.random(), v: rand(.0006, .0012)};
    const next = () => { const g = pick(segs); p.a = toWorld(g[0], g[1]); p.b = toWorld(g[2], g[3]); p.k = 0; };
    next(); pulses.push(p);
    anims.push((t, dt) => { p.k += p.v * dt; if (p.k >= 1) next(); p.s.position.lerpVectors(p.a, p.b, p.k); });
  }
  // components
  const silver = std(0xc9ced6, {metalness: .9, roughness: .3});
  function labelTex(txt){ return tex(256, 256, (g, w, h) => { g.fillStyle = '#14161c'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(255,255,255,.08)'; g.beginPath(); g.arc(34, 34, 12, 0, 2 * PI); g.fill(); g.fillStyle = '#c8ccd6'; g.font = '700 54px JetBrains Mono, monospace'; g.textAlign = 'center'; g.fillText(txt, 128, 140); g.font = '400 22px JetBrains Mono, monospace'; g.fillStyle = '#7d8290'; g.fillText('AP-' + (Math.random() * 9000 + 1000 | 0), 128, 186); }); }
  function chip(txt){
    const gp = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.4, .36, 2.4), [std(0x15171c), std(0x15171c), std(0xffffff, {map: labelTex(txt), roughness: .4}), std(0x15171c), std(0x15171c), std(0x15171c)]);
    gp.add(body);
    const pin = new THREE.InstancedMesh(new THREE.BoxGeometry(.1, .08, .34), silver, 32), m = new THREE.Matrix4();
    let i = 0;
    for (let k = 0; k < 8; k++){
      const o = -1.05 + k * .3;
      m.makeTranslation(o, -.1, 1.33); pin.setMatrixAt(i++, m);
      m.makeTranslation(o, -.1, -1.33); pin.setMatrixAt(i++, m);
      m.makeRotationY(PI / 2).setPosition(1.33, -.1, o); pin.setMatrixAt(i++, m);
      m.makeRotationY(PI / 2).setPosition(-1.33, -.1, o); pin.setMatrixAt(i++, m);
    }
    gp.add(pin); return gp;
  }
  const bandTex = tex(256, 64, (g, w, h) => { g.fillStyle = '#d8c39a'; g.fillRect(0, 0, w, h); [['#7a4a1f', 60], ['#111', 95], ['#d11a1a', 130], ['#c9a227', 200]].forEach(([c, x]) => { g.fillStyle = c; g.fillRect(x, 0, 18, h); }); });
  function resistor(){
    const gp = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(.24, .24, 1.2, 20), std(0xffffff, {map: bandTex, roughness: .6, metalness: 0}));
    body.rotation.z = PI / 2; gp.add(body);
    [-1, 1].forEach(s => { const lead = new THREE.Mesh(new THREE.CylinderGeometry(.025, .025, 1.3, 8), silver); lead.rotation.z = PI / 2; lead.position.x = s * 1.2; gp.add(lead); });
    return gp;
  }
  const capTex = tex(128, 128, (g, w, h) => { g.fillStyle = '#1d3f8f'; g.fillRect(0, 0, w, h); g.fillStyle = '#9fb3e0'; g.fillRect(90, 0, 22, h); g.fillStyle = '#e8eefc'; g.font = '700 26px sans-serif'; g.fillText('–', 96, 40); g.fillText('–', 96, 100); });
  function capacitor(){
    const gp = new THREE.Group();
    gp.add(new THREE.Mesh(new THREE.CylinderGeometry(.42, .42, 1.1, 28), std(0xffffff, {map: capTex, roughness: .35, metalness: .2})));
    const top = new THREE.Mesh(new THREE.CylinderGeometry(.42, .42, .04, 28), silver); top.position.y = .57; gp.add(top);
    [-.15, .15].forEach(x => { const l = new THREE.Mesh(new THREE.CylinderGeometry(.025, .025, 1, 8), silver); l.position.set(x, -1, 0); gp.add(l); });
    return gp;
  }
  function led(){
    const gp = new THREE.Group(), mat = theme(new THREE.MeshBasicMaterial({transparent: true, opacity: .9}), 'c1');
    const dome = new THREE.Mesh(new THREE.SphereGeometry(.28, 20, 14, 0, 2 * PI, 0, PI / 2), mat);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(.28, .28, .4, 20), mat); base.position.y = -.2; dome.position.y = 0;
    gp.add(dome, base);
    const gl = glow(0xffffff, 2.2, .7); theme(gl.material, 'c1'); gp.add(gl);
    [-.1, .1].forEach(x => { const l = new THREE.Mesh(new THREE.CylinderGeometry(.02, .02, 1, 8), silver); l.position.set(x, -.9, 0); gp.add(l); });
    return gp;
  }
  const makers = [() => chip('ARM'), resistor, capacitor, () => chip('MCU'), led, resistor, () => chip('ESP32'), capacitor, led, () => chip('ADC'), resistor, () => chip('ECE'), capacitor, led];
  makers.forEach((mk, i) => {
    const o = mk(), side = i % 2 ? 1 : -1;
    o.position.set(side * rand(3.2, 9), rand(-2.6, 3.8), -58 - i * 3.9 + rand(-1, 1));
    o.rotation.set(rand(0, PI), rand(0, PI), rand(0, PI));
    o.scale.setScalar(1.15);
    scene.add(o);
    const rs = rand(.0002, .0006), by = o.position.y, ph = rand(0, 6);
    anims.push((t, dt) => { o.rotation.x += rs * dt; o.rotation.y += rs * .7 * dt; o.position.y = by + Math.sin(t * .0008 + ph) * .35; });
  });
  // oscilloscope sine wave (with a ghost trace)
  function waveLine(n, x0, x1, y, z, key, opacity){
    const pos = new Float32Array(n * 3); for (let i = 0; i < n; i++){ pos[i*3] = x0 + (x1 - x0) * i / (n - 1); pos[i*3+1] = y; pos[i*3+2] = z; }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const m = key.startsWith('#') ? new THREE.LineBasicMaterial({color: key, transparent: true, opacity, blending: THREE.AdditiveBlending}) : theme(new THREE.LineBasicMaterial({transparent: true, opacity, blending: THREE.AdditiveBlending}), key);
    const line = new THREE.Line(g, m); scene.add(line); return {pos, g, n, y, x0, x1};
  }
  const sine = [waveLine(260, -15, 15, 4.6, -80, 'c1', 1), waveLine(260, -15, 15, 4.62, -80.3, 'c3', .45)];
  anims.push((t) => sine.forEach((w, j) => {
    for (let i = 0; i < w.n; i++){ const x = w.pos[i*3]; w.pos[i*3+1] = w.y + Math.sin(x * .85 + t * .003 - j * .5) * 1.15 * (.65 + .35 * Math.sin(x * .12 + t * .0007)); }
    w.g.attributes.position.needsUpdate = true;
  }));
  const scopeLabel = textSprite('f = 50 Hz', '#7ef0cf', 1.1, '500 40px JetBrains Mono, monospace'); scopeLabel.position.set(-12.5, 6.4, -80); scene.add(scopeLabel);

  // ======================================================
  // 2. CODE TUNNEL — code windows + flying symbols
  // ======================================================
  const SNIPS = [
    {t: 'payroll.ts', l: ['const net = gross - deductions;', 'export async function runPayroll(month) {', '  const staff = await db.employees.all();', '  return staff.map(calcSalary);', '}']},
    {t: 'materials.py', l: ['@frappe.whitelist()', 'def move_indent(name, to_state):', '    doc = frappe.get_doc("Indent", name)', '    doc.workflow_state = to_state', '    doc.save()  # notify via OneSignal']},
    {t: 'main.dart', l: ['class TrackScreen extends StatelessWidget {', '  @override', '  Widget build(BuildContext c) =>', '    ListView(children: items);', '}']},
    {t: 'report.sql', l: ['SELECT dept, SUM(net_pay)', 'FROM payroll', "WHERE month = '2026-10'", 'GROUP BY dept', 'ORDER BY 2 DESC;']},
    {t: 'llm.py', l: ['from vllm import LLM', 'llm = LLM(model="gemma")', 'out = llm.generate(prompt)', '# answers staff questions', 'print(out[0].text)']},
    {t: 'token.js', l: ['socket.on("next", (t) => {', '  display.show(t.number);', '  speak(`Token ${t.number}`);', '});', '']},
    {t: 'firmware.ino', l: ['void loop() {', '  int v = analogRead(A0);', '  if (v > 600) digitalWrite(LED, HIGH);', '  Serial.println(v);', '}']},
    {t: 'docker-compose.yml', l: ['services:', '  api:', '    build: ./api', '    ports: ["3000:3000"]', '  db: { image: postgres:16 }']}
  ];
  const KW = /\b(const|export|async|function|await|return|def|class|extends|void|int|if|from|import|SELECT|FROM|WHERE|GROUP|BY|ORDER|DESC|SUM|services|build|image|ports)\b/g;
  function codeTex(sn){
    return tex(640, 400, (g, w, h) => {
      g.fillStyle = 'rgba(12,13,19,.94)'; g.beginPath(); g.roundRect(0, 0, w, h, 26); g.fill();
      g.strokeStyle = 'rgba(139,147,248,.45)'; g.lineWidth = 2; g.stroke();
      g.fillStyle = '#16171f'; g.beginPath(); g.roundRect(0, 0, w, 56, [26, 26, 0, 0]); g.fill();
      ['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => { g.fillStyle = c; g.beginPath(); g.arc(34 + i * 24, 28, 7, 0, 2 * PI); g.fill(); });
      g.fillStyle = '#8f8f9e'; g.font = '500 22px JetBrains Mono, monospace'; g.fillText(sn.t, 120, 36);
      g.font = '500 24px JetBrains Mono, monospace';
      sn.l.forEach((line, i) => {
        const y = 104 + i * 54; let x = 30;
        g.fillStyle = '#4a4a58'; g.fillText(String(i + 1), x, y); x = 70;
        const parts = line.split(/(\b(?:const|export|async|function|await|return|def|class|extends|void|int|if|from|import|SELECT|FROM|WHERE|GROUP|BY|ORDER|DESC|SUM|services|build|image|ports)\b|"[^"]*"|'[^']*'|`[^`]*`|#.*$|\/\/.*$)/);
        for (const p of parts){
          if (!p) continue;
          g.fillStyle = /^["'`]/.test(p) ? '#86efac' : /^(#|\/\/)/.test(p) ? '#5d6070' : KW.test(p) ? '#c4a7ff' : /\w+(?=\()/.test(p) ? '#7dd3fc' : '#dfe1ea';
          KW.lastIndex = 0;
          g.fillText(p, x, y); x += g.measureText(p).width;
        }
      });
    });
  }
  SNIPS.forEach((sn, i) => {
    const side = i % 2 ? 1 : -1;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 4), new THREE.MeshBasicMaterial({map: codeTex(sn), transparent: true, side: THREE.DoubleSide}));
    m.position.set(side * rand(5, 7.5), rand(-1.6, 3.2), -120 - i * 6.2);
    m.rotation.y = -side * .5; m.rotation.x = rand(-.08, .08);
    scene.add(m);
    const by = m.position.y, ph = rand(0, 6);
    anims.push((t) => { m.position.y = by + Math.sin(t * .0007 + ph) * .3; m.rotation.z = Math.sin(t * .0005 + ph) * .03; });
  });
  // flying symbols that travel toward you
  const SYM = ['{ }', '</>', '=>', '01', 'λ', '( )', '[ ]', '++', '&&', 'fn'];
  const flyers = [];
  for (let i = 0; i < ((FX.lite || small) ? 10 : 22); i++){
    const s = textSprite(pick(SYM), pick(['#7dd3fc', '#c4a7ff', '#86efac', '#f9a8d4']), rand(.6, 1.1));
    s.material.opacity = .85; scene.add(s); flyers.push(s);
    const reset = (far) => s.position.set(rand(-10, 10), rand(-4, 5), rand(-172, far ? -118 : -150));
    reset(true);
    anims.push((t, dt) => { s.position.z += dt * .006; if (s.position.z > -112) reset(false); });
  }

  // ======================================================
  // 3. HEALTH & DATA — ECG, databases, flowing packets
  // ======================================================
  function ecg(x){                                           // one heartbeat every 6 units
    const p = ((x % 6) + 6) % 6;
    if (p > 1 && p < 1.6) return Math.sin((p - 1) / .6 * PI) * .35;          // P wave
    if (p > 2 && p < 2.15) return -(p - 2) / .15 * .5;                        // Q
    if (p >= 2.15 && p < 2.35) return -.5 + (p - 2.15) / .2 * 3.3;            // R up
    if (p >= 2.35 && p < 2.6) return 2.8 - (p - 2.35) / .25 * 3.6;            // R down to S
    if (p >= 2.6 && p < 2.8) return -.8 + (p - 2.6) / .2 * .8;                // back to base
    if (p > 3.4 && p < 4.4) return Math.sin((p - 3.4) / 1 * PI) * .6;        // T wave
    return 0;
  }
  const E = waveLine(420, -18, 18, 3.2, -196, '#ff6b8b', 1), E2 = waveLine(420, -18, 18, 3.22, -196.3, '#ff6b8b', .35);
  const pen = glow(0xff6b8b, 2.4, .95); scene.add(pen);
  anims.push((t) => {
    const shift = t * .004;
    [E, E2].forEach(w => { for (let i = 0; i < w.n; i++){ const x = w.pos[i*3]; w.pos[i*3+1] = w.y + ecg(x + shift) * .9; } w.g.attributes.position.needsUpdate = true; });
    pen.position.set(18, E.pos[(E.n - 1) * 3 + 1], -196);
  });
  const crossTex = tex(128, 128, (g) => { g.shadowColor = '#ff6b8b'; g.shadowBlur = 20; g.fillStyle = '#ff6b8b'; g.fillRect(48, 18, 32, 92); g.fillRect(18, 48, 92, 32); });
  const cross = new THREE.Sprite(new THREE.SpriteMaterial({map: crossTex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false})); cross.scale.set(2.6, 2.6, 1); cross.position.set(-12.5, 6.5, -203); scene.add(cross);
  anims.push((t) => { const b = 1 + Math.max(0, Math.sin(t * .0045)) * .12; cross.scale.set(2.6 * b, 2.6 * b, 1); });
  function database(){
    const gp = new THREE.Group();
    for (let k = 0; k < 3; k++){
      const disk = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, .62, 40), std(0x121620, {metalness: .6, roughness: .35})); disk.position.y = k * .78; gp.add(disk);
      const rimL = new THREE.Mesh(new THREE.TorusGeometry(1.2, .035, 8, 60), theme(new THREE.MeshBasicMaterial(), 'c1')); rimL.rotation.x = PI / 2; rimL.position.y = k * .78 + .31; gp.add(rimL);
    }
    return gp;
  }
  const db1 = database(); db1.position.set(-8, -4.2, -206); scene.add(db1);
  const db2 = database(); db2.position.set(8, -4.2, -186); scene.add(db2);
  const serverTex = tex(128, 192, (g, w, h) => { g.fillStyle = '#0f1218'; g.fillRect(0, 0, w, h); for (let r = 0; r < 7; r++){ g.fillStyle = '#1a1f29'; g.fillRect(10, 12 + r * 25, w - 20, 18); g.fillStyle = r % 3 ? '#3ee6a8' : '#4fd1e8'; g.fillRect(18, 18 + r * 25, 6, 6); g.fillRect(30, 18 + r * 25, 6, 6); } });
  const server = new THREE.Mesh(new THREE.BoxGeometry(2, 3.2, 1.4), [std(0x161a22), std(0x161a22), std(0x161a22), std(0x161a22), std(0xffffff, {map: serverTex, emissiveMap: serverTex, emissive: 0xffffff, emissiveIntensity: .6}), std(0x161a22)]);
  server.position.set(2.5, -3.4, -197); server.rotation.y = -.4; scene.add(server);
  const pipe = new THREE.CatmullRomCurve3([new THREE.Vector3(-8, -1.9, -206), new THREE.Vector3(-3, -2.4, -201), new THREE.Vector3(2.5, -1.5, -197), new THREE.Vector3(5.5, -2.6, -191), new THREE.Vector3(8, -1.9, -186)]);
  scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pipe.getPoints(80)), theme(new THREE.LineBasicMaterial({transparent: true, opacity: .35}), 'c2')));
  const pkMat = theme(new THREE.MeshBasicMaterial(), 'c2'), pkGeo = new THREE.BoxGeometry(.22, .22, .22);
  for (let i = 0; i < 18; i++){
    const pk = new THREE.Mesh(pkGeo, pkMat); scene.add(pk); const off = i / 18;
    anims.push((t) => { const k = (t * .00012 + off) % 1; pk.position.copy(pipe.getPointAt(k)); pk.rotation.x = pk.rotation.y = t * .002; });
  }

  // ======================================================
  // 4. APPS — phones & dashboards of real projects
  // ======================================================
  function screen(draw){ return tex(360, 720, (g, w, h) => { g.fillStyle = '#0b0d13'; g.fillRect(0, 0, w, h); draw(g, w, h); }); }
  const UI = {
    head(g, w, title, c){ g.fillStyle = c; g.fillRect(0, 0, w, 96); g.fillStyle = '#05060a'; g.font = '700 30px Inter, sans-serif'; g.fillText(title, 24, 62); },
    card(g, x, y, w, h, c = '#151823'){ g.fillStyle = c; g.beginPath(); g.roundRect(x, y, w, h, 16); g.fill(); },
    text(g, s, x, y, c = '#dfe1ea', f = '500 20px Inter, sans-serif'){ g.fillStyle = c; g.font = f; g.fillText(s, x, y); }
  };
  const SCREENS = [
    screen((g, w, h) => {                                   // PayrollX
      UI.head(g, w, 'PayrollX', '#8b93f8');
      UI.card(g, 20, 120, 150, 110); UI.card(g, 190, 120, 150, 110);
      UI.text(g, 'Net payout', 34, 156, '#8f8f9e', '500 17px Inter'); UI.text(g, '₹ 4.2 Cr', 34, 200, '#fff', '700 28px Inter');
      UI.text(g, 'Staff', 204, 156, '#8f8f9e', '500 17px Inter'); UI.text(g, '3,140', 204, 200, '#fff', '700 28px Inter');
      UI.card(g, 20, 250, 320, 260); UI.text(g, 'Salary by department', 36, 286, '#8f8f9e', '500 17px Inter');
      [120, 180, 90, 210, 150, 170].forEach((v, i) => { g.fillStyle = i % 2 ? '#4fd1e8' : '#8b93f8'; g.fillRect(44 + i * 48, 490 - v, 30, v); });
      UI.card(g, 20, 530, 320, 70); UI.text(g, 'Run payroll  →', 40, 574, '#4fd1e8', '700 22px Inter');
      UI.text(g, 'sample UI', 250, 700, '#3a3a48', '400 14px Inter');
    }),
    screen((g, w, h) => {                                   // Materials Tracking
      UI.head(g, w, 'Materials', '#3ee6a8');
      [['IND-1042', 'Indent', '#f2b55a'], ['TRF-0981', 'Transfer', '#8b93f8'], ['PCK-0774', 'Picking', '#4fd1e8'], ['CHK-0613', 'Checking', '#c084fc'], ['DLV-0550', 'Delivered', '#3ee6a8']].forEach(([id, st, c], i) => {
        const y = 120 + i * 106; UI.card(g, 20, y, 320, 90);
        UI.text(g, id, 38, y + 40, '#fff', '700 22px Inter'); UI.text(g, 'Central store → ICU', 38, y + 70, '#8f8f9e', '400 16px Inter');
        g.fillStyle = c; g.beginPath(); g.roundRect(222, y + 26, 104, 34, 17); g.fill(); UI.text(g, st, 236, y + 50, '#05060a', '700 16px Inter');
      });
      UI.text(g, 'sample UI', 250, 700, '#3a3a48', '400 14px Inter');
    }),
    screen((g, w, h) => {                                   // Dental token
      UI.head(g, w, 'Dental OP', '#4fd1e8');
      UI.text(g, 'NOW SERVING', 96, 190, '#8f8f9e', '600 22px Inter');
      g.fillStyle = '#4fd1e8'; g.font = '800 150px Inter, sans-serif'; g.textAlign = 'center'; g.fillText('042', w / 2, 350); g.textAlign = 'left';
      UI.text(g, 'Room 3 · Dr. Faculty', 70, 400, '#dfe1ea', '500 22px Inter');
      ['043', '044', '045', '046'].forEach((n, i) => { UI.card(g, 20 + i * 82, 460, 70, 70); UI.text(g, n, 34 + i * 82, 504, '#fff', '700 22px Inter'); });
      UI.text(g, 'sample UI', 250, 700, '#3a3a48', '400 14px Inter');
    }),
    screen((g, w, h) => {                                   // AI assistant
      UI.head(g, w, 'AI Assistant', '#c084fc');
      UI.card(g, 20, 130, 250, 80, '#1a1c27'); UI.text(g, 'Where is indent 1042?', 36, 178, '#dfe1ea', '500 19px Inter');
      UI.card(g, 90, 230, 250, 110, '#c084fc'); UI.text(g, 'It is in Picking at the', 106, 274, '#05060a', '600 19px Inter'); UI.text(g, 'central store.', 106, 304, '#05060a', '600 19px Inter');
      UI.card(g, 20, 360, 220, 80, '#1a1c27'); UI.text(g, 'Notify me when', 36, 396, '#dfe1ea', '500 19px Inter'); UI.text(g, 'it ships 🔔', 36, 424, '#dfe1ea', '500 19px Inter');
      UI.text(g, 'Gemma · on-prem', 110, 640, '#5d6070', '500 18px Inter');
      UI.text(g, 'sample UI', 250, 700, '#3a3a48', '400 14px Inter');
    })
  ];
  function phone(map){
    const gp = new THREE.Group();
    gp.add(new THREE.Mesh(new THREE.BoxGeometry(2.2, 4.3, .22), std(0x0d0f14, {metalness: .7, roughness: .3})));
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(2.02, 4.04), new THREE.MeshBasicMaterial({map})); scr.position.z = .115; gp.add(scr);
    const edge = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(2.2, 4.3, .22)), theme(new THREE.LineBasicMaterial({transparent: true, opacity: .5}), 'c2')); gp.add(edge);
    return gp;
  }
  SCREENS.forEach((map, i) => {
    const p = phone(map), side = i % 2 ? 1 : -1;
    p.position.set(side * rand(4.5, 6.5), rand(-.8, 2.2), -228 - i * 8.5); p.rotation.y = -side * .45;
    scene.add(p);
    const by = p.position.y, ph = rand(0, 6), ry = p.rotation.y;
    anims.push((t) => { p.position.y = by + Math.sin(t * .0008 + ph) * .3; p.rotation.y = ry + Math.sin(t * .0004 + ph) * .12; });
  });
  const dashTex = tex(1024, 600, (g, w, h) => {
    g.fillStyle = 'rgba(11,13,19,.95)'; g.beginPath(); g.roundRect(0, 0, w, h, 30); g.fill(); g.strokeStyle = 'rgba(79,209,232,.5)'; g.lineWidth = 3; g.stroke();
    UI.text(g, 'MIS · Hospital administration', 40, 64, '#fff', '700 34px Inter');
    UI.text(g, 'sample data', 860, 64, '#3a3a48', '400 18px Inter');
    UI.card(g, 40, 100, 600, 450); g.strokeStyle = '#4fd1e8'; g.lineWidth = 5; g.beginPath();
    for (let i = 0; i <= 20; i++){ const x = 70 + i * 27, y = 470 - (Math.sin(i * .55) * 90 + i * 9 + 120); i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
    g.strokeStyle = '#c084fc'; g.beginPath(); for (let i = 0; i <= 20; i++){ const x = 70 + i * 27, y = 480 - (Math.cos(i * .4) * 60 + i * 6 + 60); i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
    UI.card(g, 670, 100, 314, 450);
    const cx = 827, cy = 300; [['#4fd1e8', .42], ['#8b93f8', .28], ['#c084fc', .18], ['#3ee6a8', .12]].reduce((a, [c, v]) => { g.strokeStyle = c; g.lineWidth = 46; g.beginPath(); g.arc(cx, cy, 100, a, a + v * 2 * PI); g.stroke(); return a + v * 2 * PI; }, -PI / 2);
    UI.text(g, 'Departments', 760, 480, '#8f8f9e', '500 22px Inter');
  });
  const dash = new THREE.Mesh(new THREE.PlaneGeometry(8.5, 5), new THREE.MeshBasicMaterial({map: dashTex, transparent: true, side: THREE.DoubleSide}));
  dash.position.set(-9.5, 1.5, -250); scene.add(dash);
  anims.push((t) => { dash.rotation.y = .55 + Math.sin(t * .0003) * .12; });

  // ======================================================
  // 5. FINALE — the atom (electronics meets space)
  // ======================================================
  const atom = new THREE.Group(); atom.position.set(0, 1.4, -294); scene.add(atom);
  const nucMatA = theme(new THREE.MeshStandardMaterial({roughness: .3, metalness: .2, emissiveIntensity: .7}), 'c1', 'emissive');
  const nucMatB = theme(new THREE.MeshStandardMaterial({roughness: .3, metalness: .2, emissiveIntensity: .7}), 'c3', 'emissive');
  [[0,0,0],[.5,.2,.1],[-.4,.3,-.2],[.1,-.45,.3],[-.2,-.1,.5],[.3,.4,-.4],[-.45,-.35,-.1]].forEach((p, i) => {
    const s = new THREE.Mesh(new THREE.SphereGeometry(.42, 24, 16), i % 2 ? nucMatA : nucMatB); s.position.set(...p); atom.add(s);
  });
  const ag = glow(0xffffff, 7, .6); theme(ag.material, 'c2'); atom.add(ag);
  [[PI / 2, 0], [PI / 2, PI / 3], [PI / 2, -PI / 3]].forEach(([rx, rz], i) => {
    const orbit = new THREE.Group(); orbit.rotation.set(rx, 0, rz); atom.add(orbit);
    orbit.add(new THREE.Mesh(new THREE.TorusGeometry(4.6, .025, 8, 120), theme(new THREE.MeshBasicMaterial({transparent: true, opacity: .55}), 'c2')));
    const spin = new THREE.Group(); orbit.add(spin);
    const e = new THREE.Mesh(new THREE.SphereGeometry(.2, 16, 12), new THREE.MeshBasicMaterial({color: 0xffffff})); e.position.x = 4.6; spin.add(e);
    const eg = glow(0xffffff, 1.6, .9); theme(eg.material, 'c1'); eg.position.x = 4.6; spin.add(eg);
    const sp = .0016 + i * .0004;
    anims.push((t, dt) => { spin.rotation.z += dt * sp; });
  });
  anims.push((t, dt) => { atom.rotation.y += dt * .00025; });

  // ======================================================
  // CAMERA — scroll drives a cinematic flight
  // ======================================================
  const KEYS = [['top', 0], ['about', -60], ['skills', -116], ['experience', -176], ['projects', -222], ['playground', -262], ['education', -272], ['contact', -281]];
  let marks = [];
  function measure(){
    marks = KEYS.map(([id, z]) => { const el = document.getElementById(id); return el ? [el.getBoundingClientRect().top + scrollY, z] : null; }).filter(Boolean);
  }
  function targetZ(){
    const y = scrollY + innerHeight * .35;
    if (y <= marks[0][0]) return marks[0][1];
    for (let i = 0; i < marks.length - 1; i++){
      const [y0, z0] = marks[i], [y1, z1] = marks[i + 1];
      if (y < y1){ const k = (y - y0) / (y1 - y0); return z0 + (z1 - z0) * (k * k * (3 - 2 * k)); }
    }
    return marks[marks.length - 1][1];
  }
  let camZ = 0, lastZ = 0, speed = 0, mx = 0, my = 0, tmx = 0, tmy = 0, fov = 62;
  addEventListener('pointermove', e => { tmx = e.clientX / innerWidth * 2 - 1; tmy = e.clientY / innerHeight * 2 - 1; }, {passive: true});
  const look = new THREE.Vector3();

  function resize(){
    renderer.setPixelRatio(quality());
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); placeSolar(); measure();
  }
  addEventListener('resize', () => { clearTimeout(resize._t); resize._t = setTimeout(resize, 150); });
  addEventListener('load', measure);
  if (document.fonts) document.fonts.ready.then(measure);
  setTimeout(measure, 1500);
  document.addEventListener('themechange', readTheme);
  readTheme(); measure();

  let t = 0, wasLite = FX.lite, skip = 0;
  loop(60, (now, dt0) => {
    if (FX.lite !== wasLite){ wasLite = FX.lite; renderer.setPixelRatio(quality()); renderer.setSize(innerWidth, innerHeight, false); }
    if (FX.lite && (skip++ % 2)) return;                     // lite: 30fps
    const dt = Math.min(dt0, 50); t += dt;
    // ease the camera towards the scroll position (cinematic lag)
    camZ += (targetZ() - camZ) * (1 - Math.exp(-dt / 260));
    speed = speed * .8 + ((camZ - lastZ) / dt * 1000) * .2; lastZ = camZ;
    mx += (tmx - mx) * .04; my += (tmy - my) * .04;
    const x = Math.sin(camZ * .045) * 1.6 + mx * 1.1, y = Math.cos(camZ * .035) * .9 + .6 - my * .7;
    camera.position.set(x, y, camZ);
    look.set(x * .35 + mx * .6, y * .5 - .2 - my * .3, camZ - 14);
    camera.lookAt(look);
    camera.rotation.z += Math.sin(camZ * .02) * .035;
    const f = 62 + Math.min(Math.abs(speed) * .35, 16);
    if (Math.abs(f - fov) > .05){ fov += (f - fov) * .15; camera.fov = fov; camera.updateProjectionMatrix(); }
    updateStreaks(speed);
    for (const a of anims) a(t, dt);
    renderer.render(scene, camera);
  });
})();
