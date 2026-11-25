/* Efectos extra: partículas, relieve 3D, glosario e índice */
(() => {
  // Red de partículas en la portada
  const cover = $('.cover'), cv = document.createElement('canvas'); cover.prepend(cv);
  const ctx = cv.getContext('2d'); let W, H, mouse = { x: -999, y: -999 }, pts = [];
  const size = () => { W = cv.width = cover.clientWidth; H = cv.height = cover.clientHeight;
    pts = Array.from({ length: Math.round(W * H / 16000) }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .5, vy: (Math.random() - .5) * .5 })); };
  size(); addEventListener('resize', size);
  cover.addEventListener('mousemove', e => { const r = cv.getBoundingClientRect(); mouse = { x: e.clientX - r.left, y: e.clientY - r.top }; });
  (function draw() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1;
      const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
      if (d < 140) { p.x += dx / d * 1.6; p.y += dy / d * 1.6; }
      ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, 7); ctx.fillStyle = 'rgba(255,194,75,.85)'; ctx.fill();
      for (let j = i + 1; j < pts.length; j++) { const q = pts[j], l = Math.hypot(p.x - q.x, p.y - q.y);
        if (l < 120) { ctx.strokeStyle = `rgba(80,210,205,${.35 * (1 - l / 120)})`; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); } }
    });
    requestAnimationFrame(draw);
  })();

  // Relieve 3D en las tarjetas
  document.addEventListener('mousemove', e => {
    const s = e.target.closest && e.target.closest('.cd,.tilt,.rc'); if (!s) return;
    const r = s.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    s.style.setProperty('--ry', ((x - .5) * 10) + 'deg'); s.style.setProperty('--rx', ((.5 - y) * 8) + 'deg');
  });
  document.addEventListener('mouseout', e => { const s = e.target.closest && e.target.closest('.cd,.tilt,.rc'); if (s && !s.contains(e.relatedTarget)) { s.style.setProperty('--rx', '0deg'); s.style.setProperty('--ry', '0deg'); } });

  // Glosario: definiciones tomadas de las las diapositivas de introducción
  const GL = { 'xerostomía': 'Sensación de boca seca.', 'hiposalivación': 'Disminución medible del flujo salival.', 'disfagia': 'Dificultad para deglutir y transferir el bolo de la boca al estómago.',
    'bolo': 'Masa cohesiva y lubricada que la lengua empuja con facilidad.', 'IDDSI': 'Marco de 8 niveles continuos (0 a 7) para describir texturas de alimentos y bebidas.' };
  Object.entries(GL).forEach(([w, def]) => {
    let left = 3;
    $$('.pt, .goal, .cd p, .banner').forEach(el => { if (left <= 0) return;
      const wk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let n;
      while ((n = wk.nextNode()) && left > 0) {
        const m = n.textContent.match(new RegExp('\\b' + w + '\\b', 'i')); if (!m) continue;
        const r = n.splitText(m.index); r.splitText(m[0].length);
        const sp = Object.assign(document.createElement('span'), { className: 'gl', textContent: m[0] }); sp.dataset.def = def; r.replaceWith(sp); left--; break;
      } });
  });

  // Índice de diapositivas (tecla G)
  const ov = Object.assign(document.createElement('div'), { id: 'ov' });
  ov.innerHTML = `<button class="x">Cerrar ✕</button><h4>Índice de diapositivas</h4><p class="h">Haz clic para ir a cualquier punto · Esc para cerrar</p><div class="g">` +
    SLIDES.map(s => { const ch = CHAPTERS.find(c => s.n >= c.from && s.n <= c.to); return `<button data-n="${s.n}"><b>${pad(s.n)} · ${ch ? ch.name.toUpperCase() : (s.n === 1 ? 'PORTADA' : 'CIERRE')}</b>${s.title}</button>`; }).join('') + '</div>';
  document.body.append(ov);
  const toggle = f => ov.classList.toggle('on', f);
  ov.onclick = e => { const b = e.target.closest('button'); if (!b) return; toggle(false); if (!b.classList.contains('x')) jump(+b.dataset.n); };
  const bi = Object.assign(document.createElement('button'), { textContent: 'Índice', title: 'Índice (tecla G)', onclick: () => toggle() }); $('.tools').prepend(bi);
  document.addEventListener('keydown', e => { if (e.key === 'g' || e.key === 'G') toggle(); else if (e.key === 'Escape') toggle(false); });
})();
