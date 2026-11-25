/* Sustentación Sjögren – sitio de recorrido por scroll (v4, basado en Sustentacion_Sjogren_reorganizada.pptx) */
const CHAPTERS = [
  { id: 'introduccion', name: 'Introducción',          sub: 'Sjögren, saliva, bolo y marco IDDSI',        from: 2,  to: 7,  ac: '#0B8C8C' },
  { id: 'problema',     name: 'Problema y objetivos',  sub: 'El vacío, la pregunta y los objetivos',      from: 8,  to: 10, ac: '#C98A00' },
  { id: 'metodo',       name: 'Metodología',           sub: 'Enfoque, búsqueda, fases y diseño',          from: 11, to: 14, ac: '#4A63D8' },
  { id: 'resultados',   name: 'Resultados',            sub: 'Depuración, criterios e ingredientes',       from: 15, to: 21, ac: '#D4573C' },
  { id: 'recetas',      name: 'Recetario',             sub: 'Seis preparaciones colombianas adaptadas',   from: 22, to: 28, ac: '#0A8F5B' },
  { id: 'cierre',       name: 'Conclusiones y perspectivas', sub: 'Qué se logró y qué sigue',             from: 29, to: 30, ac: '#4A63D8' },
  { id: 'referencias',  name: 'Referencias',           sub: 'Bibliografía principal',                     from: 31, to: 31, ac: '#5A6B8A' },
];
const TOTAL = SLIDES.length;
const RIDX = {};
const SL = n => SLIDES.find(s => s.n === n);
[23, 24, 25, 26, 27, 28].forEach((n, i) => { RIDX[SL(n).img] = i; });
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const pad = n => String(n).padStart(2, '0');
const IM = (k, c = '') => `<img class="${c}" src="img/${k.includes('.') ? k : k + '.png'}" alt=""${k in RIDX ? ` data-r="${RIDX[k]}"` : ''} loading="lazy">`;
const IC = k => `<span class="ic">${IM(k)}</span>`;
const P = t => `<p class="pt" data-rv>${t}</p>`;
const LI = a => (Array.isArray(a) ? a : [a]);
const CREDIT = 'Ilustraciones propias, referenciales (Reyes y Cordero, 2026).';

/* ---------- Piezas ---------- */
const card = (t, b, ic, extra = '') => `<div class="cd" data-rv>${ic ? IC(ic) : ''}<small>${t}</small><p>${b}</p>${extra}</div>`;
const banner = (t, c = '') => `<div class="banner ${c}" data-rv>${t}</div>`;
const counter = (v, l, o = {}) => `<div class="sc" data-rv><b data-to="${v}" data-dec="${o.dec || 0}" data-sfx="${o.sfx || ''}">0</b><span>${l}</span></div>`;
const table = (rows, id = '') => `<div class="tw" data-rv><input class="tf" type="search" placeholder="Filtrar la tabla…" aria-label="Filtrar tabla"><div class="tsc"><table class="dt ${id}"><thead><tr>${rows[0].map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.slice(1).map(r => `<tr>${r.map((c, i) => `<td${i === 0 ? ' class="k"' : ''}>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>`;
const levelsOf = t => { const m = t.match(/IDDSI\s+([\d o]+)/); const main = m ? (m[1].match(/\d/g) || []).map(Number) : []; const p = t.match(/\((.*?)\)/); const sec = p ? (p[1].match(/\d/g) || []).map(Number).filter(x => !main.includes(x) && x < 8) : []; return { main, sec }; };
const scale = (main, sec = []) => `<div class="scale">${[0,1,2,3,4,5,6,7].map(i => `<i class="${main.includes(i) ? 'm' : sec.includes(i) ? 's' : ''}"><b>${i}</b></i>`).join('')}</div>`;

/* ---------- Niveles IDDSI 0–7 ---------- */
function levelsAll(s) {
  const ex = [
    { n: 0, t: 'Delgado', d: 'Fluye como el agua; es la bebida sin espesar.', img: 'iddsi0.svg', ml: 'menos de 1 ml', h: 5, extra: true },
    { n: 1, t: 'Ligeramente espeso', d: 'Un poco más espeso que el agua; fluye con algo más de esfuerzo.', img: 'iddsi1.svg', ml: 'entre 1 y 4 ml', h: 25, extra: true },
    { n: 2, t: 'Poco espeso', d: 'Fluye de una cuchara, pero más lento que el agua.', img: 'iddsi2.svg', ml: 'entre 4 y 8 ml', h: 60, extra: true }];
  const deck = s.levels.map((l, i) => ({ n: 3 + i, t: l.t, d: l.d, img: s.imgs[i] }));
  const all = [...ex, ...deck].map(l => Object.assign(l, { tipo: l.n < 3 ? 'Bebida' : l.n < 5 ? 'Bebida y alimento' : 'Alimento' }));
  all[3].ml = 'más de 8 ml'; all[3].h = 90;
  const ti = SL(7).imgs, tt = SL(7).tests;
  const tst = n => n <= 2 ? [2, 'Flujo con jeringa'] : n === 3 ? [1, 'Inclinación de cuchara y flujo con jeringa'] : n === 4 ? [1, 'Inclinación de cuchara'] : n <= 6 ? [0, 'Presión con tenedor'] : [0, 'Alimentos regulares: incluye duros, secos o crujientes'];
  const recs = [23, 24, 25, 26, 27, 28].map(n => { const r = SL(n), lv = levelsOf(r.level); return { n, name: r.name, img: r.img, main: lv.main, sec: lv.sec }; });
  all.forEach(l => { const [k, name] = tst(l.n); l.tImg = ti[k]; l.test = name;
    l.recs = recs.filter(r => r.main.includes(l.n) || r.sec.includes(l.n)).map(r => ({ n: r.n, name: r.name, img: r.img, sec: !r.main.includes(l.n) })); });
  return all;
}

/* ---------- Diseños por tipo ---------- */
const R = {
  intro: s => `<div class="irows">${s.bullets.map((b, i) => `<div class="irow" data-rv>${IC(s.icons[i])}<p class="pt">${b}</p></div>`).join('')}</div>
    <div class="grid g3">${[
      `<div class="sc" data-rv><b class="sm">${s.stats[0][0]}</b><span>${s.stats[0][1]}</span></div>`,
      counter(0.12, s.stats[1][1], { dec: 2, sfx: ' %' }).replace('<span>', '<span class="">'),
      counter(24885, s.stats[2][1])].join('')}</div>
    <div class="range" data-rv><span>0 %</span><div class="trk"><i></i><b><em>Colombia 0,12 %</em></b></div><span>0,6 %</span></div>
    <p class="src" data-rv>${s.source}</p>`,
  cards3: s => `<div class="grid g3">${s.cards.map((c, i) => card(c.t, c.b, s.icons[i], `<em class="cite">${c.c}</em>`)).join('')}</div>${banner(s.banner)}`,
  bolo: s => `<div class="phases" data-rv>${s.phases.map((p, i) => `<button type="button" class="${i ? '' : 'on'}" data-i="${i}"><b>${p.n}</b><strong>${p.t}</strong><span>${p.d}</span></button>`).join('')}</div>
    <div class="tog" data-rv><button type="button" class="on" data-k="ok">${s.ok.t}</button><button type="button" data-k="bad">${s.bad.t}</button></div>
    <div class="tpanel ok on" data-rv><p>${s.ok.b}</p><p class="def">${s.ok.d}</p></div>
    <div class="tpanel bad" data-rv><ul>${s.bad.b.map(x => `<li>${x}</li>`).join('')}</ul></div>
    <div class="picto" data-rv><div class="pp-row">${Array.from({ length: 14 }, (_, i) => `<i class="pp${i < 11 ? ' hit' : ''}" style="--d:${i * 90}ms"></i>`).join('')}</div>
    <p><b data-to="${s.stat[0].split(' ')[0]}">0</b> de 14 <span>${s.stat[1].replace(/^personas /, 'personas ')}</span></p></div>`,
  relev: s => `${P(s.intro)}<div class="grid g2">${s.cards.map((c, i) => card(c.t, c.b, s.icons[i])).join('')}</div>${banner(s.disc)}${P(s.ben)}`,
  iddsi: s => {
    const L = levelsAll(s);
    return `${P(s.intro)}<div class="iw" data-rv tabindex="0" aria-label="Niveles IDDSI interactivos (use las flechas del teclado)">
    <div class="lvbtns">${L.map((l, i) => `<button type="button" class="${i ? '' : 'on'}" data-lv="${i}">${IM(l.img)}<b>${l.n}</b></button>`).join('')}</div>
    <div class="brk"><span class="dr">Bebidas · niveles 0 a 4</span><span class="fd">Alimentos · niveles 3 a 7</span></div>
    <div class="lvpanels">${L.map((l, i) => `<div class="lvp${i ? '' : ' on'}"><div class="lvimg">${IM(l.img)}</div><div class="lvt"><small>NIVEL ${l.n} · ${l.tipo.toUpperCase()}</small><h4>${l.t}</h4><p>${l.d}</p>
      ${l.h != null ? `<div class="gauge"><div class="syr"><i style="--h:${l.h}%"></i></div><div><b>Prueba de flujo con jeringa</b><span>Tras 10 s quedan ${l.ml}</span></div></div>` : ''}
      <div class="tst">${IM(l.tImg)}<span>${l.test}</span></div>
      ${l.recs.length ? `<div class="rch"><b>Recetas en este nivel</b>${l.recs.map(r => `<button type="button" data-go="${r.n}" class="${r.sec ? 'sec' : ''}">${IM(r.img, 'rth')}${r.name}${r.sec ? ' (se acerca)' : ''}</button>`).join('')}</div>` : '<div class="rch"><b>Recetas en este nivel</b><span>Ninguna del recetario</span></div>'}
      ${l.extra ? '<em class="comp">Complemento del marco IDDSI (2024); no figura en las diapositivas.</em>' : ''}</div></div>`).join('')}</div>
    <div class="lvctl"><button type="button" data-act="prev">← Anterior</button><button type="button" data-act="play" class="play">▶ Recorrer niveles</button><button type="button" data-act="next">Siguiente →</button></div></div>
    <p class="src" data-rv>${s.source}</p>`; },
  tests: s => `<div class="grid g3">${s.tests.map((t, i) => `<div class="cd test" data-rv><div class="timg">${IM(s.imgs[i])}</div><small>${t.t}</small><p>${t.d}</p></div>`).join('')}</div><p class="src" data-rv>${s.source}</p>`,
  vacio: s => `<div class="duo"><div class="pan a" data-rv><h4>${s.a.t}</h4><ul>${s.a.b.map(x => `<li>${x}</li>`).join('')}</ul></div><div class="arrow">→</div><div class="pan b" data-rv><h4>${s.b.t}</h4><ul>${s.b.b.map(x => `<li>${x}</li>`).join('')}</ul></div></div>${banner(s.footer, 'dk')}`,
  question: s => `<p class="big" data-rv>${s.q.replace(/(textura|humedad|técnicas de cocción|ingredientes)/g, '<mark>$1</mark>')}</p><div class="chips" data-rv>${s.chips.map(c => `<span>${c}</span>`).join('')}</div>`,
  objetivos: s => `<div class="goal" data-rv><small>OBJETIVO GENERAL</small>${s.gen}</div><div class="grid g3">${s.spec.map(o => card(o.t, o.d, '', `<span class="ix">${o.n}</span>`)).join('')}</div>`,
  metodo: s => `<div class="two"><div>${s.left.map((t, i) => `<div class="irow" data-rv>${IC(s.icons[i])}<p class="pt">${t}</p></div>`).join('')}</div>
    <div><small class="lab" data-rv>${s.label}</small>${s.srcs.map(([a, b]) => `<div class="src-card" data-rv><b>${a}</b><span>${b}</span></div>`).join('')}</div></div>${banner(s.note, 'warn')}`,
  busqueda: s => `<h4 class="sub" data-rv>${s.eq_title}</h4><div class="eqs">${s.eqs.map(([k, e]) => `<div class="eq" data-rv><b>${k}</b><code>${e}</code><button type="button" class="cp" title="Copiar ecuación">Copiar</button></div>`).join('')}</div>
    <div class="tog flt" data-rv><button type="button" class="on" data-f="all">Todos los criterios</button><button type="button" data-f="inc">Se incluyó</button><button type="button" data-f="exc">Se excluyó</button></div>${table(s.table, 'crit')}`,
  fases: s => `<div class="steps5">${s.phases.map(p => `<div class="st5" data-rv><i>${p.n}</i><h4>${p.t}</h4><p>${p.d}</p></div>`).join('')}</div><div class="grid g3">${s.links.map(l => `<div class="lk" data-rv><b>${l[0]}</b><span>${l[1]}</span></div>`).join('')}</div>`,
  pasos: s => `<div class="grid g4">${s.steps.map((p, i) => `<div class="cd" data-rv>${IC(s.imgs[i])}<small>${p.n}</small><h4>${p.t}</h4><p>${p.d}</p></div>`).join('')}</div>${banner(s.note, 'ok')}`,
  embudo: s => {
    const max = 181, ex = s.chart, tot = ex.vals.reduce((a, b) => a + b, 0), pub = s.pub[1].split(' · ').map(x => x.split(': '));
    return `<div class="funnel">${s.funnel.map((f, i) => `<div class="frow"><strong>${f.v} ${f.l}</strong><div class="bw"><div class="b" style="--w:${Math.max(f.v / max * 100, 8)}%">${f.v}</div></div>${f.d ? `<small>${f.d}</small>` : ''}</div>`).join('')}</div>
    <div class="grid g2"><div class="chart" data-rv><h5>${s.chart_title}</h5>${ex.cats.map((c, i) => `<div class="hb" title="${(ex.vals[i] / tot * 100).toFixed(1)} % de los excluidos"><span>${c}</span><div><i style="--w:${ex.vals[i] / 64 * 100}%"></i><b>${ex.vals[i]}</b></div></div>`).join('')}</div>
    <div class="chart" data-rv><h5>${s.pub[0]}</h5>${pub.map(([k, v]) => `<div class="hb"><span>${k}</span><div><i style="--w:${Math.max(+v / 173 * 100, 1)}%"></i><b>${v}</b></div></div>`).join('')}</div></div>`;
  },
  fuentes: s => { const v = s.groups.map(g => parseInt(g.t.match(/\((\d+)\)/)[1])), tot = 12; let off = 0;
    const arcs = v.map((n, i) => { const p = n / tot * 100, a = `<circle class="arc a${i}" data-g="${i}" r="15.9" cx="21" cy="21" stroke-dasharray="${p - 1.2} ${100 - p + 1.2}" stroke-dashoffset="${-off}" pathLength="100"/>`; off += p; return a; }).join('');
    return `<div class="donut-w" data-rv><svg viewBox="0 0 42 42" class="donut">${arcs}<text x="21" y="22.5" text-anchor="middle">12</text><text x="21" y="27" text-anchor="middle" class="t2">fuentes</text></svg></div>
    <div class="grid g3">${s.groups.map((g, i) => `<div class="cd g${i}" data-g="${i}" data-rv>${IC(s.icons[i])}<small>${g.t}</small><ul>${g.l.map(x => `<li>${x}</li>`).join('')}</ul><div class="bigline"><b>${g.big}</b><span>${g.sm}</span></div></div>`).join('')}</div>`; },
  tabla: s => `${table(s.table)}<p class="src" data-rv>${s.source}</p>`,
  ingred: s => `<div class="two"><div><small class="lab" data-rv>${s.crit_label}</small>${s.crit.map((c, i) => `<div class="irow" data-rv><span class="num">${i + 1}</span><p class="pt">${c}</p></div>`).join('')}</div>
    <div><small class="lab" data-rv>${s.keep_label}</small>${s.groups.map(g => `<div class="grp" data-rv><b>${g.t}</b><div class="chips">${g.chips.map(c => `<span>${c}</span>`).join('')}</div></div>`).join('')}</div></div>${banner(s.note, 'warn')}`,
  galeria: s => `<div class="grid g3 gal">${s.recipes.map((r, i) => `<button type="button" class="rc tilt" data-rv data-go="${23 + i}"><div class="rimg">${IM(s.imgs[i])}</div><small>${r.k}</small><h4>${r.t}</h4><span>${r.c}</span><em>${r.i}</em><i class="more">Ver receta →</i></button>`).join('')}</div>${banner(s.footer, 'warn')}`,
  concl: s => `<div class="grid g3">${s.cards.map((c, i) => card(c.t, c.b, s.icons[i])).join('')}</div>${banner(s.banner, 'dk')}`,
  persp: s => `<div class="two"><div class="pan a" data-rv><h4>${s.lim_t}</h4><ul>${s.lim.map(x => `<li>${x}</li>`).join('')}</ul></div>
    <div><small class="lab" data-rv>${s.per_t}</small><div class="road">${s.per.map((p, i) => `<div class="rd" data-rv>${IC(s.icons[i])}<div><b>${p[0]}</b><span>${p[1]}</span></div></div>`).join('')}</div></div></div>`,
  refs: s => `<input class="tf" id="rf" type="search" placeholder="Buscar en las referencias (autor, año, revista)…" aria-label="Buscar referencias"><p class="src" id="rcount">${s.refs.length} referencias</p><div class="refs">${s.refs.map(t => `<p class="ref" data-rv>${t}</p>`).join('')}</div><div class="credits" id="credits"></div>`,
};
const WIDE = new Set([9, 15, 17, 18, 19, 20, 22, 12]);

function renderSlide(s) {
  const body = R[s.type](s);
  const say = s.notes ? `<div class="say" data-rv><button type="button">PARA SUSTENTAR <i>+</i></button><div class="txt">${s.notes}</div></div>` : '';
  const k = s.kicker.includes('·') ? `<small class="kick">${s.kicker.split('·').slice(1).join('·').trim()}</small>` : '';
  return `<article class="slide rv${s.n === 9 ? ' dark wide' : WIDE.has(s.n) ? ' wide' : ''}" data-n="${s.n}" data-t="${s.title}"><aside><span class="no">${pad(s.n)} / ${TOTAL}</span>${k}<h3>${s.title}</h3></aside><div class="ct">${body}${say}</div></article>`;
}

function recipeCard(s, i) {
  const { main, sec } = levelsOf(s.level);
  const half = Math.ceil(s.ing.length / 2);
  const ing = a => `<ul class="chk">${a.map(x => `<li><label><input type="checkbox"><span>${x}</span></label></li>`).join('')}</ul>`;
  return `<article class="rcard${i ? '' : ' on'}" data-n="${s.n}" data-t="${s.name}"><span class="no">${pad(s.n)} / ${TOTAL}</span>
    <div class="rtop"><figure class="rfig tilt">${IM(s.img)}<span class="badge" data-rbadge="${i}" hidden></span><figcaption data-rcap="${i}">${s.credit}</figcaption></figure>
    <div><small class="kick">RECETA ${s.idx} DE 6</small><h3>${s.name}</h3><div class="chips"><span>Categoría: ${s.cat}</span><span>Rendimiento: ${s.rend}</span><span class="lvb">${s.level}</span></div>
    <div class="tex"><small>TEXTURA OBJETIVO</small>${scale(main, sec)}<p>${s.tex}</p></div></div></div>
    <div class="rbody"><div><h5>INGREDIENTES <em>(marca los que ya tienes)</em></h5><div class="two2">${ing(s.ing.slice(0, half))}${ing(s.ing.slice(half))}</div></div>
    <div><h5>PREPARACIÓN <em class="prog">0 / ${s.prep.length} pasos</em></h5><div class="pbar"><i></i></div><ol class="prep">${s.prep.map((x, k) => `<li><button type="button"><b>${k + 1}</b><span>${x}</span></button></li>`).join('')}</ol></div></div>
    <div class="banner ok"><b>Criterios de la revisión:</b> ${s.crit}</div>
    <div class="say"><button type="button">PARA SUSTENTAR <i>+</i></button><div class="txt">${s.notes}</div></div></article>`;
}
function renderRecipes() {
  const list = [22, 23, 24, 25, 26, 27, 28].map(SL), g = list[0], rs = list.slice(1);
  const nav = rs.map((s, i) => `<button type="button" class="${i ? '' : 'on'}" data-i="${i}"><b>${i + 1}</b>${IM(s.img)}${s.name}</button>`).join('');
  return renderSlide(g) + `<div class="rec rv" id="rec"><div class="rlist">${nav}</div><div class="rdetail">${rs.map(recipeCard).join('')}</div></div>`;
}

function build() {
  const c = SL(1);
  let html = `<section class="cover" id="inicio" data-t="Inicio"><div class="in">
    <span class="bar"></span><p class="kk">${c.kicker}</p><h1>${c.title}</h1><p class="sub">${c.sub}</p>
    <div class="meta">${c.authors.map(x => `<b>${x}</b>`).join('')}<span>${c.tutor.join(' · ')}</span><span>${c.uni}</span><span>${c.place}</span></div>
    <div class="facts rv">${[[6, 'preparaciones colombianas'], [181, 'registros identificados'], [12, 'fuentes incluidas'], [13, 'campos en la matriz']].map(([v, l]) => `<div><b data-to="${v}">0</b><span>${l}</span></div>`).join('')}</div>
    <a class="go" href="#introduccion">Comenzar recorrido <span>↓</span></a></div>
    <div class="mos">${c.imgs.map((k, i) => `<figure style="--i:${i}">${IM(k)}</figure>`).join('')}<p>${c.caption}</p></div></section>`;
  CHAPTERS.forEach((ch, i) => {
    const list = SLIDES.filter(s => s.n >= ch.from && s.n <= ch.to);
    const body = ch.id === 'recetas' ? renderRecipes() : list.map(renderSlide).join('');
    html += `<section class="chapter" id="${ch.id}" data-t="${ch.name}" style="--ac:${ch.ac}">
      <div class="chband rv"><span class="gnum">${pad(i + 1)}</span><h2>${ch.name}</h2><p class="cs">${ch.sub}</p>
      <nav>${list.map(s => `<a href="#" data-go="${s.n}">${s.title}</a>`).join('')}</nav></div><div class="wrap">${body}</div></section>`;
  });
  const g = SL(32);
  html += `<section class="thanks" id="gracias" data-t="Gracias"><div class="mosr">${g.imgs.map(k => IM(k)).join('')}</div><h2>Gracias</h2><p class="q">${g.q}</p><p>${g.msg}</p><p><b>${g.authors.join(' · ')}</b></p><p>${g.uni}</p></section>`;
  $('#app').innerHTML = html;
  $$('.ct, .rdetail').forEach(ct => $$('[data-rv]', ct).forEach((el, i) => el.style.setProperty('--i', Math.min(i, 8))));
  $('#chapnav').innerHTML = CHAPTERS.map(ch => `<a href="#${ch.id}" data-id="${ch.id}">${ch.name.split(' y ')[0]}</a>`).join('');
  $('#dots').innerHTML = ['inicio', ...CHAPTERS.map(c => c.id), 'gracias'].map(id => `<a href="#${id}" data-id="${id}" data-t="${$('#' + id).dataset.t}"></a>`).join('');
}

function count(el) {
  const to = +el.dataset.to, dec = +(el.dataset.dec || 0), sfx = el.dataset.sfx || ''; let t0;
  const step = t => { t0 ??= t; const p = Math.min((t - t0) / 1500, 1), v = to * (1 - Math.pow(1 - p, 3));
    el.textContent = v.toLocaleString('es-CO', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + sfx; if (p < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}

function behaviors() {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); $$('[data-to]', e.target).forEach(count); io.unobserve(e.target); }
  }), { threshold: .12 });
  $$('.rv').forEach(el => io.observe(el));

  document.addEventListener('click', e => {
    const q = (s) => e.target.closest(s);
    let b;
    if (b = q('.say button')) b.parentElement.classList.toggle('open');
    if (b = q('.rlist button')) selectRecipe(+b.dataset.i);
    if (b = q('[data-go]')) { e.preventDefault(); jump(+b.dataset.go); }
    if (b = q('.phases button')) { clearInterval(b.parentElement._t); setPhase(b.parentElement, +b.dataset.i); }
    if (b = q('.tog button[data-k]')) { const w = b.closest('.ct'); $$('.tog button[data-k]', w).forEach(x => x.classList.toggle('on', x === b)); $$('.tpanel', w).forEach(p => p.classList.toggle('on', p.classList.contains(b.dataset.k))); }
    if (b = q('.tog button[data-f]')) { const w = b.closest('.ct'); $$('.tog button[data-f]', w).forEach(x => x.classList.toggle('on', x === b)); $('.dt', w).dataset.show = b.dataset.f; }
    if (b = q('.iw .lvbtns button')) selectLevel(b.closest('.iw'), +b.dataset.lv);
    if (b = q('.iw [data-act]')) { const w = b.closest('.iw'), cur = +$('.lvbtns .on', w).dataset.lv;
      if (b.dataset.act === 'prev') selectLevel(w, (cur + 7) % 8); else if (b.dataset.act === 'next') selectLevel(w, (cur + 1) % 8);
      else { if (w._t) { clearInterval(w._t); w._t = null; b.textContent = '▶ Recorrer niveles'; } else { selectLevel(w, 0); b.textContent = '❚❚ Detener'; w._t = setInterval(() => { const c = +$('.lvbtns .on', w).dataset.lv; if (c === 7) { clearInterval(w._t); w._t = null; b.textContent = '▶ Recorrer niveles'; } else selectLevel(w, c + 1); }, 3500); } } }
    if (b = q('.lv-btns button')) { const w = b.closest('.lvl'), i = +b.dataset.i; $$('.lv-btns button', w).forEach((x, k) => x.classList.toggle('on', k === i)); $$('.lv', w).forEach((x, k) => x.classList.toggle('on', k === i)); const lv = +b.textContent.match(/\d/)[0]; $$('.lscale .scale i', w.parentElement).forEach((x, k) => x.classList.toggle('m', k === lv)); }
    if (b = q('.cp')) { navigator.clipboard && navigator.clipboard.writeText($('code', b.parentElement).textContent); b.textContent = '¡Copiada!'; setTimeout(() => b.textContent = 'Copiar', 1500); }
    if (b = q('.prep button')) { b.parentElement.classList.toggle('done'); const c = b.closest('.rcard'), n = $$('.prep .done', c).length, t = $$('.prep li', c).length; $('.prog', c).textContent = `${n} / ${t} pasos`; $('.pbar i', c).style.width = (n / t * 100) + '%'; }
  });
  document.addEventListener('input', e => {
    if (e.target.classList.contains('tf')) { const v = e.target.value.toLowerCase(), w = e.target.closest('.ct') || document;
      $$('tbody tr', w).forEach(r => r.hidden = !r.textContent.toLowerCase().includes(v)); }
    if (e.target.id === 'rf') { const v = e.target.value.toLowerCase(); let n = 0; $$('.ref').forEach(r => { const h = !r.textContent.toLowerCase().includes(v); r.hidden = h; if (!h) n++; }); $('#rcount').textContent = n + ' referencias'; }
  });
  document.addEventListener('mouseover', e => { const g = e.target.closest('[data-g]'); if (g) $$(`[data-g="${g.dataset.g}"]`).forEach(x => x.classList.add('hl')); });
  document.addEventListener('mouseout', e => { const g = e.target.closest('[data-g]'); if (g) $$('.hl').forEach(x => x.classList.remove('hl')); });
  $$('.phases').forEach(w => { w._t = setInterval(() => setPhase(w, (+$('.on', w).dataset.i + 1) % 4), 2600); });
  $('#btnSay').onclick = e => { const open = !e.target.classList.contains('on'); e.target.classList.toggle('on', open); $$('.say').forEach(s => s.classList.toggle('open', open)); };

  const ids = ['inicio', ...CHAPTERS.map(c => c.id), 'gracias'];
  const onScroll = () => {
    const h = document.documentElement;
    $('#progress').style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
    document.body.style.setProperty('--sy', h.scrollTop * .15);
    $('#totop').classList.toggle('on', h.scrollTop > 700);
    let cur = ids[0];
    ids.forEach(id => { if ($('#' + id).getBoundingClientRect().top < innerHeight * .4) cur = id; });
    $$('#chapnav a,#dots a').forEach(a => a.classList.toggle('on', a.dataset.id === cur));
    $$('.chband').forEach(b => { const r = b.getBoundingClientRect(); b.style.setProperty('--p', (r.top * -.18) + 'px'); });
    const mid = innerHeight * .45, wh = $('#where');
    const s = $$('.slide, .rcard.on').find(x => { const r = x.getBoundingClientRect(); return r.top < mid && r.bottom > mid; });
    wh.style.opacity = s ? 1 : 0; if (s) wh.innerHTML = `<b>${pad(s.dataset.n)} / ${TOTAL}</b>${s.dataset.t}`;
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  $('#totop').onclick = () => scrollTo({ top: 0, behavior: 'smooth' });
}
function selectLevel(w, i) { $$('.lvbtns button', w).forEach((x, k) => x.classList.toggle('on', k === i)); $$('.lvp', w).forEach((x, k) => x.classList.toggle('on', k === i)); }
function setPhase(w, i) { $$('button', w).forEach((x, k) => x.classList.toggle('on', k === i)); w.dataset.p = i; }
function selectRecipe(i) { const w = $('#rec'); $$('.rlist button', w).forEach((x, k) => x.classList.toggle('on', k === i)); $$('.rcard', w).forEach((x, k) => x.classList.toggle('on', k === i)); dispatchEvent(new Event('scroll')); }

function jump(n) {
  let el;
  if (n === 1) el = $('.cover'); else if (n === 32) el = $('#gracias');
  else if (n >= 23 && n <= 28) { selectRecipe(n - 23); el = $('#rec'); }
  else el = $(`[data-n="${n}"]`).closest('.slide');
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const creditText = f => f.tipo === 'ia' ? `Imagen generada con IA${f.herramienta ? ' (' + f.herramienta + (f.fecha ? ', ' + f.fecha : '') + ')' : ''}, aportada por los autores del trabajo. Referencial; no corresponde a la preparación real.`
  : f.tipo === 'propia' ? `Fotografía propia de los autores (${f.fecha}).` : `Fotografía: ${f.autor}, ${f.licencia}. Fuente: ${f.url}.`;
function updateCredits() {
  const el = $('#credits'); if (!el) return;
  el.innerHTML = '<h5>CRÉDITOS DE IMÁGENES</h5>' + [23, 24, 25, 26, 27, 28].map((n, i) => `<p><b>Receta ${i + 1} · ${SL(n).name}:</b> ${FOTOS[i].ok ? creditText(FOTOS[i]) : SL(n).credit}</p>`).join('') + `<p>Demás ilustraciones: ${CREDIT}</p>`;
}
function applyPhotos() {
  updateCredits();
  FOTOS.forEach((f, i) => { const im = new Image(); im.onload = () => { f.ok = true;
    $$(`img[data-r="${i}"]`).forEach(x => { x.src = f.file; x.classList.add('photo'); });
    $$(`[data-rcap="${i}"]`).forEach(c => c.textContent = creditText(f));
    $$(`[data-rbadge="${i}"]`).forEach(b => { b.textContent = f.tipo === 'ia' ? 'IMAGEN IA' : 'FOTO'; b.hidden = false; });
    updateCredits(); }; im.src = f.file; });
}
build(); behaviors(); applyPhotos();
document.addEventListener('keydown', e => { const iw = e.target.closest && e.target.closest('.iw'); if (iw && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) { e.preventDefault(); const c = +$('.lvbtns .on', iw).dataset.lv; selectLevel(iw, (c + (e.key === 'ArrowRight' ? 1 : 7)) % 8); } if (e.target.tagName !== 'INPUT' && (e.key === 'n' || e.key === 'N')) $('#btnSay').click(); });
