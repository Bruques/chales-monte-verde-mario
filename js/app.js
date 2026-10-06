/* Site público: hospedagens, galeria, avaliações, reservas por hospedagem. O painel está em admin.js. */
(function () {
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const pad = n => String(n).padStart(2, '0');
  const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parse = s => { const [a, b, c] = s.split('-').map(Number); return new Date(a, b - 1, c); };
  const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return iso(d); };
  const br = s => { const [a, b, c] = s.split('-'); return `${c}/${b}/${a}`; };
  const nightsBetween = (a, b) => Math.round((parse(b) - parse(a)) / 864e5);
  const money = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const em = s => esc(s).replace(/\*(.+?)\*/g, '<em>$1</em>');
  const TODAY = iso(new Date());
  const MONTHS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  let toastT;
  const toast = m => { const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2800); };

  const IC = {
    bath: '<path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.700 3 4 3.700 4 4.500V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/><path d="M10 5 8 7"/><path d="M2 12h20"/>',
    flame: '<path d="M8.500 14.500A2.500 2.500 0 0 0 11 12c0-1.400-.5-2-1-3-1.100-2.100-.2-4.100 2-6 .5 2.500 2 4.900 4 6.500 2 1.600 3 3.500 3 5.500a7 7 0 1 1-14 0c0-1.200.4-2.300 1-3a2.500 2.500 0 0 0 2.500 2.500z"/>',
    snow: '<path d="M12 2v20M2 12h20M5 5l14 14M19 5 5 19"/>',
    wifi: '<path d="M5 12.500a11 11 0 0 1 14 0M1.500 9a16 16 0 0 1 21 0M8.500 16a6 6 0 0 1 7 0M12 20h.01"/>',
    utensils: '<path d="M3 2v7a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6a2 2 0 0 0 2 2zm0 0v7"/>',
    bed: '<path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9"/>',
    coffee: '<path d="M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4zM6 2v2M10 2v2M14 2v2"/>',
    car: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.700-1.500-1.900C18.700 10.600 16 10 16 10s-1.300-1.400-2.200-2.300c-.5-.4-1.100-.7-1.800-.7H5c-.6 0-1.100.4-1.400.9l-1.400 2.900A3.700 3.700 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
    paw: '<circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><path d="M9 10a5 5 0 0 1 5 5v3.500a3.500 3.500 0 0 1-6.840 1.045Q6.520 17.480 4.460 16.840A3.500 3.500 0 0 1 5.500 10Z"/>',
    mountain: '<path d="m8 3 4 8 5-5 5 15H2z"/>',
    shield: '<path d="M20 13c0 5-3.500 7.500-7.660 8.950a1 1 0 0 1-.67-.01C7.500 20.500 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.500-1.200 6.240-2.720a1.170 1.170 0 0 1 1.520 0C14.510 3.810 17 5 19 5a1 1 0 0 1 1 1z"/>',
    home: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .7-1.500l7-6a2 2 0 0 1 2.600 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    wine: '<path d="M8 22h8M7 10h10M12 15v7M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.500 4-2 6-2 8a5 5 0 0 0 5 5z"/>',
    key: '<circle cx="7.500" cy="15.500" r="5.500"/><path d="m21 2-9.600 9.600M15.500 7.500l3 3L22 7l-3-3"/>',
    laptop: '<path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.300 2.600a1 1 0 0 1-.9 1.400H3.600a1 1 0 0 1-.9-1.400L4 16"/>',
    tv: '<rect x="2" y="7" width="20" height="13" rx="2"/><path d="m17 2-5 5-5-5"/>',
    tree: '<path d="M12 22v-5M12 2 6 11h3l-4 6h14l-4-6h3z"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.870M16 3.130a4 4 0 0 1 0 7.750"/>'
  };
  const ICON_NAMES = { bath: 'Banheira', flame: 'Lareira / fogo', snow: 'Ar / frio', wifi: 'Wi-Fi', utensils: 'Cozinha', bed: 'Cama', coffee: 'Café', car: 'Estacionamento', paw: 'Pet', mountain: 'Vista', shield: 'Segurança', home: 'Casa', wine: 'Taças / vinho', key: 'Chave', laptop: 'Trabalho', tv: 'TV', tree: 'Natureza' };
  const svg = (k, cls) => `<svg viewBox="0 0 24 24"${cls ? ` class="${cls}"` : ''}>${IC[k] || IC.home}</svg>`;

  const CMV = window.CMV = { C: null, REQ: [], util: { $, $$, esc, em, iso, parse, addDays, br, money, nightsBetween, toast, TODAY, MONTHS, IC, ICON_NAMES, svg } };

  /* ---------- dados ---------- */
  let C, A, saveT;
  const act = () => C.acomodacoes.filter(a => a.status === 'ativo');
  const cover = a => (a.fotos && a.fotos[0] && a.fotos[0].src) || '';
  const byId = id => C.acomodacoes.find(a => a.id === id);
  const fromPrice = a => { const v = [a.precos.semana, a.precos.fim].filter(x => x != null && x !== ''); return v.length ? Math.min(...v.map(Number)) : null; };
  CMV.cover = cover; CMV.byId = byId;

  CMV.persist = () => {
    clearTimeout(saveT);
    saveT = setTimeout(() => Store.saveContent(C).then(() => toast('Alterações salvas'), e => toast('Não foi possível salvar: ' + e.message)), 450);
  };

  /* ---------- disponibilidade e preço ---------- */
  const unavailable = a => new Set(Object.keys(a.ocupado || {}));
  function nightPrice(a, i) {
    if (a.especial && a.especial[i] != null) return Number(a.especial[i]);
    const dow = parse(i).getDay(), wk = dow === 5 || dow === 6;
    const v = wk ? a.precos.fim : a.precos.semana;
    return (v == null || v === '') ? null : Number(v);
  }
  function quote(a, ci, co) {
    const n = nightsBetween(ci, co); let tot = 0, ok = true;
    for (let d = ci; d < co; d = addDays(d, 1)) { const p = nightPrice(a, d); if (p == null) ok = false; else tot += p; }
    return { n, total: ok ? tot : null };
  }
  CMV.util.nightPrice = nightPrice; CMV.util.quote = quote; CMV.util.unavailable = unavailable;

  /* ---------- calendário genérico ---------- */
  function buildMonth(first, cellCb) {
    const m = document.createElement('div'); m.className = 'cal-m';
    m.innerHTML = `<h4>${MONTHS[first.getMonth()]} ${first.getFullYear()}</h4><div class="dow">${['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(x => `<span>${x}</span>`).join('')}</div>`;
    const g = document.createElement('div'); g.className = 'days';
    for (let i = 0; i < first.getDay(); i++) { const b = document.createElement('div'); b.className = 'd blank'; g.append(b); }
    const dim = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
    for (let d = 1; d <= dim; d++) g.append(cellCb(iso(new Date(first.getFullYear(), first.getMonth(), d)), d));
    m.append(g); return m;
  }
  const firstOf = off => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth() + off, 1); };
  CMV.util.buildMonth = buildMonth; CMV.util.firstOf = firstOf;

  /* ================= renderização do conteúdo ================= */
  function renderSite() {
    const S = C.site;
    document.title = `${S.nome} — Casa e chalés em Monte Verde, MG`;
    document.body.classList.toggle('no-strip', !S.faixaPrevia);
    // url() dentro de variável CSS é resolvida a partir do arquivo .css, então usamos o endereço absoluto
    const abs = u => /^(data:|https?:|blob:)/.test(u) ? u : new URL(u, document.baseURI).href;
    document.documentElement.style.setProperty('--hero-img', `url("${abs(S.heroImg)}")`);
    document.documentElement.style.setProperty('--final-img', `url("${abs(S.finalImg)}")`);
    $('#logo-name').textContent = S.nomeCurto || S.nome;
    $('#h-eyebrow').textContent = S.heroEyebrow;
    const t = S.heroTitulo.replace(/\*(.+?)\*/g, (m, x) => '*' + x.replace(/ /g, ' ') + '*');
    $('#h1').innerHTML = t.split(' ').map(w => `<span class="w"><span>${em(w)}</span></span>`).join(' ');
    $$('#h1 .w span').forEach((s, i) => s.style.animationDelay = (.35 + i * .11) + 's');
    $('#h-sub').textContent = S.heroSub;
    $('#h-bar').innerHTML = S.heroBarra.map(([b, s]) => `<div><b>${esc(b)}</b><small>${esc(s)}</small></div>`).join('');
    $('#mq').innerHTML = [...S.faixa, ...S.faixa].map(w => `<span>${esc(w)}</span>`).join('');

    $('#s-a').src = S.sobreFotoA; $('#s-b').src = S.sobreFotoB;
    $('#s-eyebrow').textContent = S.sobreEyebrow;
    $('#s-titulo').innerHTML = em(S.sobreTitulo);
    $('#s-paras').innerHTML = S.sobreParagrafos.map(p => `<p>${esc(p)}</p>`).join('');
    $('#s-sign').textContent = S.sobreAssinatura || '';
    const soon = C.acomodacoes.filter(a => a.status === 'embreve').length;
    const badge = $('#s-badge');
    badge.style.display = soon ? '' : 'none';
    badge.innerHTML = `<i><b>+${soon}</b>${soon > 1 ? 'chalés a caminho' : 'chalé a caminho'}</i>`;

    $('#stats').style.setProperty('--cols', S.numeros.length);
    $('#stats').innerHTML = S.numeros.map((n, i) => `<div class="stat rv${i ? ' d' + Math.min(i, 3) : ''}"><b data-count="${n.valor}">0</b><span>${esc(n.rotulo)}</span></div>`).join('');

    $('#am-titulo').innerHTML = em(S.comodidadesTitulo.replace(/(\S+)$/, '*$1*'));
    $('#am').innerHTML = S.comodidades.map((a, k) => `<div class="am rv d${k % 4}">${svg(a.ic)}<b>${esc(a.t)}</b><span>${esc(a.d)}</span></div>`).join('');

    $('#r-titulo').innerHTML = em(S.depoimentosTitulo.replace(/(\S+\s+\S+)$/, '*$1*'));
    $('#r-lead').textContent = S.depoimentosLead;

    // local
    $('#l-titulo').innerHTML = em(S.localTitulo);
    $('#l-lead').textContent = S.localLead;
    const dts = [['Endereço', esc(S.endereco) + (S.enderecoLinha2 ? '<br>' + esc(S.enderecoLinha2) : '')],
      ['Check-in e check-out', `Check-in a partir das ${esc(S.checkin)} · check-out até as ${esc(S.checkout)}`],
      ['No GPS', `${S.lat.toFixed(6)}, ${S.lng.toFixed(6)} · <a href="https://www.google.com/maps?q=${S.lat},${S.lng}" target="_blank" rel="noopener" style="color:var(--amber)">abrir no Google Maps</a>`],
      ['Estacionamento', 'Gratuito, dentro da propriedade'],
      ['Pets', esc(S.aceitaPet ? S.politicaPet : 'Não aceitamos pets.')],
      ['Reserva e cancelamento', esc(S.pagamento) + '<br>' + esc(S.cancelamento)]];
    $('#l-dl').innerHTML = dts.map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join('');
    $('#l-rules').innerHTML = S.regras.map(r => `<li>${esc(r)}</li>`).join('');
    const mapSrc = `https://maps.google.com/maps?q=${S.lat},${S.lng}&z=15&output=embed`;
    if ($('#map').getAttribute('src') !== mapSrc) $('#map').src = mapSrc;

    $('#f-titulo').innerHTML = em(S.finalTitulo);
    $('#foot-name').textContent = S.nome;
    $('#foot-addr').textContent = S.endereco;
    const links = [];
    if (S.whatsapp) links.push(`<a href="#" data-wa>WhatsApp ${esc(S.whatsappExibicao || '')}</a>`);
    if (S.email) links.push(`<a href="mailto:${esc(S.email)}">${esc(S.email)}</a>`);
    if (S.instagram) links.push(`<a href="https://instagram.com/${esc(S.instagram)}" target="_blank" rel="noopener">@${esc(S.instagram)}</a>`);
    $('#foot-links').innerHTML = links.join('');
    $('#demo-note').style.display = S.faixaPrevia ? '' : 'none';
    $('#pet-wrap').style.display = S.aceitaPet ? '' : 'none';
  }

  function renderAcc() {
    $('#acc-grid').innerHTML = C.acomodacoes.map(a => {
      if (a.status === 'embreve') return `<article class="acc soon rv"><div class="ph"><span>Em breve</span></div><div class="body"><h3>${esc(a.nome)}</h3><p>${esc(a.resumo)}</p></div></article>`;
      const p = fromPrice(a);
      const cap = a.capMin === a.capMax ? `${a.capMax} pessoas` : `${a.capMin} a ${a.capMax} hóspedes`;
      const metas = [`<span>${svg('users')}${cap}</span>`, ...a.comodidades.slice(0, 2).map(c => `<span>${svg(c.ic)}${esc(c.t)}</span>`)].join('');
      return `<article class="acc rv">
        <div class="ph" data-d="${a.id}">${cover(a) ? `<img src="${esc(cover(a))}" alt="${esc(a.nome)}" loading="lazy">` : ''}<span class="tag">${esc(a.tipo)}</span></div>
        <div class="body"><h3>${esc(a.nome)}</h3><p>${esc(a.resumo)}</p><div class="meta">${metas}</div>
          <div class="foot"><div class="from"><small>${p != null ? 'a partir de' : 'valores'}</small><b>${p != null ? money(p) : 'sob consulta'}</b>${p != null ? ' <em>/ noite</em>' : ''}</div>
          <div class="btns"><button class="btn btn-line btn-sm" data-d="${a.id}">Ver detalhes</button><button class="btn btn-amber btn-sm" data-r="${a.id}">Reservar</button></div></div></div>
      </article>`;
    }).join('');
  }

  /* ---------- detalhe da hospedagem ---------- */
  let dmA = null, dmI = 0;
  function openDetail(id) {
    dmA = byId(id); if (!dmA) return; dmI = 0;
    const a = dmA, p = fromPrice(a);
    const revs = C.depoimentos.filter(r => r.chale === a.id);
    $('#dm-sheet').innerHTML = `<button class="x" data-dx aria-label="Fechar">✕</button>
      <div class="top">
        <div class="viewer"><div class="main">${a.fotos.length ? '<img id="dm-img" alt="">' : ''}${a.fotos.length > 1 ? '<button class="pv" data-dp aria-label="Anterior">←</button><button class="nx" data-dn aria-label="Próxima">→</button>' : ''}</div>
          <div class="thumbs" id="dm-th">${a.fotos.map((f, i) => `<img src="${esc(f.src)}" alt="" data-t="${i}">`).join('')}</div></div>
        <div class="info"><div class="eyebrow">${esc(a.tipo)}</div><h2>${esc(a.nome)}</h2>
          ${a.descricao.map(d => `<p>${esc(d)}</p>`).join('')}
          ${a.destaques.length ? `<ul class="chips">${a.destaques.map(d => `<li>${esc(d)}</li>`).join('')}</ul>` : ''}
          <div class="price"><div><small>${p != null ? 'a partir de' : 'valores'}</small><b>${p != null ? money(p) : 'sob consulta'}</b>${p != null ? ' <small style="display:inline">/ noite</small>' : ''}${a.obsPreco ? `<div style="font-size:.78rem;color:#7c8a80;margin-top:6px;max-width:30ch">${esc(a.obsPreco)}</div>` : ''}</div>
          <button class="btn btn-amber" data-r="${a.id}">Reservar esta hospedagem</button></div></div>
      </div>
      <div class="lower">
        ${a.comodidades.length ? `<h3>Comodidades</h3><div class="am-grid">${a.comodidades.map(c => `<div class="am">${svg(c.ic)}<b>${esc(c.t)}</b><span>${esc(c.d)}</span></div>`).join('')}</div>` : ''}
        ${revs.length ? `<h3>O que dizem os hóspedes</h3><div class="rv-list">${revs.map(r => `<div class="rv-card">“${esc(r.texto)}”<cite><b>${esc(r.nome)}</b>${r.quando ? ' · ' + esc(r.quando) : ''} · ${'★'.repeat(r.estrelas || 5)}</cite></div>`).join('')}</div>` : ''}
      </div>`;
    showDm(0);
    $('#dm').classList.add('open'); document.body.style.overflow = 'hidden'; $('#dm').scrollTop = 0;
  }
  function showDm(i) {
    const n = dmA.fotos.length; if (!n) return;
    dmI = (i + n) % n;
    $('#dm-img').src = dmA.fotos[dmI].src; $('#dm-img').alt = dmA.fotos[dmI].leg || dmA.nome;
    $$('#dm-th img').forEach((im, k) => im.classList.toggle('on', k === dmI));
    const on = $('#dm-th img.on'); if (on) on.scrollIntoView({ block: 'nearest', inline: 'center' });
  }
  function closeDetail() { $('#dm').classList.remove('open'); if (!$('#panel').classList.contains('open')) document.body.style.overflow = ''; }

  /* ---------- galeria ---------- */
  let galFilter = 'all', GAL = [];
  function renderGal() {
    const chips = [['all', 'Todas'], ...act().map(a => [a.id, a.nome])];
    if ((C.site.fotosGerais || []).length) chips.push(['geral', 'Propriedade']);
    if (!chips.some(c => c[0] === galFilter)) galFilter = 'all';
    $('#gal-chips').innerHTML = chips.map(([k, n]) => `<button data-gf="${k}" class="${k === galFilter ? 'on' : ''}">${esc(n)}</button>`).join('');
    GAL = [];
    const push = (fs, ref) => (fs || []).forEach(f => GAL.push({ src: f.src, leg: f.leg || ref }));
    if (galFilter === 'all') { push(C.site.fotosGerais, 'Propriedade'); act().forEach(a => push(a.fotos, a.nome)); }
    else if (galFilter === 'geral') push(C.site.fotosGerais, 'Propriedade');
    else { const a = byId(galFilter); if (a) push(a.fotos, a.nome); }
    $('#gal').innerHTML = GAL.map((g, i) => `<figure data-i="${i}"><img src="${esc(g.src)}" alt="${esc(g.leg)}" loading="lazy" draggable="false"><figcaption>${esc(g.leg)}</figcaption></figure>`).join('');
    $('#gal').scrollLeft = 0;
  }

  /* ---------- avaliações ---------- */
  let qi = 0, qt, REV = [];
  function renderRev() {
    REV = C.depoimentos; qi = 0;
    const qb = $('#qbox'), qd = $('#qdots');
    qb.innerHTML = REV.map((r, i) => {
      const a = byId(r.chale);
      return `<div class="q${i ? '' : ' on'}"><p>${esc(r.texto)}</p><cite><b>${esc(r.nome)}</b>${r.quando ? ' · ' + esc(r.quando) : ''}${a ? ' · ' + esc(a.nome) : ''} · ${'★'.repeat(r.estrelas || 5)}</cite></div>`;
    }).join('');
    qd.innerHTML = REV.map((_, i) => `<button class="${i ? '' : 'on'}" data-q="${i}" aria-label="Avaliação ${i + 1}"></button>`).join('');
    clearInterval(qt); if (REV.length > 1) qt = setInterval(() => showQ((qi + 1) % REV.length), 7000);
    $('#avaliacoes').style.display = REV.length ? '' : 'none';
  }
  const showQ = i => { qi = i; $$('#qbox .q').forEach((q, k) => q.classList.toggle('on', k === i)); $$('#qdots button').forEach((b, k) => b.classList.toggle('on', k === i)); };

  /* ---------- reservas ---------- */
  let view = 0, ci = null, co = null, hov = null, guests = 2, extra = false, lastMsg = '';
  function selectAcc(id) {
    const a = byId(id) && byId(id).status === 'ativo' ? byId(id) : act()[0];
    A = a; ci = co = hov = null; extra = false;
    guests = a.hospPadrao || Math.max(a.capMin, 2); guests = Math.min(Math.max(guests, a.capMin), a.capMax);
    $('#extra').checked = false;
    renderPick(); renderPublicCal();
  }
  function renderPick() {
    $('#pick').innerHTML = act().map(a => `<button type="button" class="${a === A ? 'on' : ''}" data-p="${a.id}">${cover(a) ? `<img src="${esc(cover(a))}" alt="">` : ''}<span><b>${esc(a.nome)}</b><small>${a.capMin === a.capMax ? a.capMax + ' pessoas' : a.capMin + ' a ' + a.capMax + ' hóspedes'}</small></span></button>`).join('');
  }
  function renderPublicCal() {
    if (!A) return;
    const U = unavailable(A), box = $('#months'); box.innerHTML = '';
    $('#cal-title').textContent = 'Disponibilidade · ' + A.nome;
    [0, 1].forEach(k => box.append(buildMonth(firstOf(view + k), (i, d) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'd';
      const past = i < TODAY, blocked = U.has(i), p = nightPrice(A, i);
      b.innerHTML = `${d}${(!past && !blocked && p != null) ? `<small>${p}</small>` : ''}`;
      if (i === TODAY) b.classList.add('today');
      if (past) b.classList.add('past'); else if (blocked) b.classList.add('booked'); else b.classList.add('free');
      b.dataset.i = i;
      if (!past) { b.onclick = () => pick(i); b.onmouseenter = () => { if (ci && !co) { hov = i; paintRange(); } }; }
      return b;
    })));
    $('#cprev').disabled = view <= 0; $('#cnext').disabled = view >= 11;
    paintRange(); renderSummary();
  }
  const rangeFree = (a, x, y) => { const U = unavailable(a); for (let d = x; d < y; d = addDays(d, 1)) if (U.has(d) || d < TODAY) return false; return true; };
  function paintRange() {
    const end = co || (ci && hov && hov > ci && rangeFree(A, ci, hov) ? hov : null);
    $$('#months .d[data-i]').forEach(b => {
      const i = b.dataset.i;
      b.classList.toggle('start', !!ci && i === ci); b.classList.toggle('end', !!end && i === end);
      b.classList.toggle('range', !!(ci && end && i > ci && i < end));
    });
  }
  const minN = () => Math.max(1, Number(A.precos.min) || 1);
  function pick(i) {
    const blocked = unavailable(A).has(i);
    if (!ci || (ci && co)) { if (blocked) { toast('Esta data não está disponível'); return; } ci = i; co = null; }
    else if (i <= ci) { if (blocked) { toast('Esta data não está disponível'); return; } ci = i; co = null; }
    else if (!rangeFree(A, ci, i)) { toast('Há noites ocupadas nesse período'); if (!blocked) { ci = i; co = null; } }
    else if (nightsBetween(ci, i) < minN()) toast(`Mínimo de ${minN()} noites`);
    else co = i;
    hov = null; renderPublicCal();
  }
  function renderSummary() {
    $('#sum-title').textContent = A.nome;
    $('#s-ci').textContent = ci ? br(ci) : 'Escolha'; $('#s-co').textContent = co ? br(co) : 'Escolha';
    $('#g-n').textContent = guests + (guests > 1 ? ' hóspedes' : ' hóspede');
    $('#g-m').disabled = guests <= A.capMin; $('#g-p').disabled = guests >= A.capMax;
    $('#extra-wrap').style.display = A.camaExtra ? '' : 'none';
    const pb = $('#pbox');
    if (ci && co) {
      const q = quote(A, ci, co);
      let h = `<div class="row"><span>${q.n} ${q.n > 1 ? 'noites' : 'noite'}</span><span>${br(ci).slice(0, 5)} → ${br(co).slice(0, 5)}</span></div>`;
      h += q.total != null ? `<div class="row tot"><span>Total estimado</span><span>${money(q.total)}</span></div>` : '<div class="row tot ask"><span>Valores sob consulta</span><span>→ orçamento</span></div>';
      if (A.obsPreco) h += `<div class="row ask" style="font-size:.78rem"><span>${esc(A.obsPreco)}</span></div>`;
      pb.innerHTML = h;
    } else pb.innerHTML = `<div class="row ask"><span>Selecione check-in e check-out no calendário.</span></div>${A.precos.min > 1 ? `<div class="row ask" style="font-size:.78rem"><span>Mínimo de ${A.precos.min} noites.</span></div>` : ''}`;
    $('#send').disabled = !(ci && co);
  }

  const waDigits = () => String(C.site.whatsapp || '').replace(/\D/g, '');
  function openWA(msg) {
    if (C.site.faixaPrevia || !waDigits()) { toast('Prévia: com o número real do proprietário, isto abre o WhatsApp com a mensagem pronta'); return; }
    window.open(`https://wa.me/${waDigits()}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
  }
  async function sendRequest() {
    const nm = $('#nm').value.trim();
    if (!ci || !co) { toast('Escolha as datas'); return; }
    if (!nm) { toast('Informe seu nome'); $('#nm').focus(); return; }
    const q = quote(A, ci, co), pet = $('#pet').checked && C.site.aceitaPet, ph = $('#ph').value.trim(), ob = $('#ob').value.trim(), ex = A.camaExtra && $('#extra').checked;
    const req = { id: String(Date.now()), accId: A.id, accNome: A.nome, name: nm, phone: ph, ci, co, guests, pet, extra: ex, obs: ob, total: q.total, status: 'pendente', at: new Date().toISOString() };
    try { await Store.addRequest(req); } catch (e) { toast('Não foi possível registrar o pedido: ' + e.message); return; }
    lastMsg = `Olá! Gostaria de solicitar uma reserva no ${C.site.nome}.\n\nHospedagem: ${A.nome}\nNome: ${nm}\nCheck-in: ${br(ci)}\nCheck-out: ${br(co)} (${q.n} ${q.n > 1 ? 'noites' : 'noite'})\nHóspedes: ${guests}\nPet: ${pet ? 'sim' : 'não'}` + (A.camaExtra ? `\nCama/berço extra: ${ex ? 'sim' : 'não'}` : '') + (q.total != null ? `\nValor estimado: ${money(q.total)}` : '\nGostaria de saber os valores.') + (ob ? `\nObservação: ${ob}` : '') + '\n\nAinda está disponível?';
    $('#mres').textContent = lastMsg; $('#mconf').classList.add('open');
    if (CMV.onRequestsChanged) CMV.onRequestsChanged();
  }

  /* ================= render geral ================= */
  function renderAll() {
    renderSite(); renderAcc(); renderGal(); renderRev();
    const keep = A && A.status === 'ativo' && byId(A.id) ? A.id : null;
    if (keep) { A = byId(keep); renderPick(); renderPublicCal(); } else selectAcc(act()[0] && act()[0].id);
    watch(); $$('[data-count]').forEach(el => cio.observe(el));
  }
  CMV.renderPublic = renderAll;

  /* ================= efeitos ================= */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
  const watch = () => $$('.rv:not(.in)').forEach(el => io.observe(el));
  const cio = new IntersectionObserver((es, o) => es.forEach(e => {
    if (!e.isIntersecting) return; o.unobserve(e.target);
    const el = e.target, to = parseFloat(el.dataset.count), t0 = performance.now();
    const tick = t => { const p = Math.min(1, Math.max(0, (t - t0) / 1800)), v = to * (1 - Math.pow(1 - p, 3)); el.textContent = Math.round(v).toLocaleString('pt-BR'); if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }), { threshold: .6 });

  function bindOnce() {
    const nav = $('#nav'), onScroll = () => nav.classList.toggle('scrolled', scrollY > 60); onScroll();
    $('#burger').onclick = () => $('#menu').classList.toggle('open');
    $$('#menu a').forEach(a => a.addEventListener('click', () => $('#menu').classList.remove('open')));
    const par = $$('[data-par]'); let tk = false;
    const doPar = () => { par.forEach(el => { const r = el.getBoundingClientRect(); if (r.bottom < -200 || r.top > innerHeight + 200) return; const c = r.top + r.height / 2 - innerHeight / 2; el.style.transform = `translate3d(0,${c * parseFloat(el.dataset.par)}px,0)`; }); tk = false; };
    addEventListener('scroll', () => { onScroll(); if (!tk) { tk = true; requestAnimationFrame(doPar); } }, { passive: true }); doPar();

    // delegação de cliques do conteúdo dinâmico
    document.addEventListener('click', e => {
      const t = e.target;
      const d = t.closest('[data-d]'); if (d) { openDetail(d.dataset.d); return; }
      const r = t.closest('[data-r]'); if (r) { closeDetail(); selectAcc(r.dataset.r); $('#reservas').scrollIntoView({ behavior: 'smooth' }); return; }
      const p = t.closest('[data-p]'); if (p) { selectAcc(p.dataset.p); return; }
      const gf = t.closest('[data-gf]'); if (gf) { galFilter = gf.dataset.gf; renderGal(); return; }
      const q = t.closest('[data-q]'); if (q) { showQ(+q.dataset.q); return; }
      if (t.closest('[data-wa]')) { e.preventDefault(); openWA(`Olá! Vi o site do ${C.site.nome} e gostaria de mais informações.`); return; }
      if (t.closest('[data-dx]') || t === $('#dm')) { closeDetail(); return; }
      if (t.closest('[data-dp]')) { showDm(dmI - 1); return; }
      if (t.closest('[data-dn]')) { showDm(dmI + 1); return; }
      const th = t.closest('[data-t]'); if (th) { showDm(+th.dataset.t); return; }
    });

    $('#cprev').onclick = () => { view = Math.max(0, view - 1); renderPublicCal(); };
    $('#cnext').onclick = () => { view = Math.min(11, view + 1); renderPublicCal(); };
    $('#g-m').onclick = () => { guests = Math.max(A.capMin, guests - 1); renderSummary(); };
    $('#g-p').onclick = () => { guests = Math.min(A.capMax, guests + 1); renderSummary(); };
    $('#send').onclick = sendRequest;
    $('#mwa').onclick = () => openWA(lastMsg);
    $('#mcopy').onclick = () => { try { navigator.clipboard.writeText(lastMsg); toast('Mensagem copiada'); } catch (e) { toast('Não foi possível copiar'); } };
    $$('[data-close]').forEach(b => b.onclick = () => $('#mconf').classList.remove('open'));
    $('#wa-float').onclick = e => { e.preventDefault(); openWA(`Olá! Vi o site do ${C.site.nome} e gostaria de mais informações.`); };
    $('#open-panel').onclick = () => CMV.openPanel();

    // galeria: arrastar + lightbox
    const gal = $('#gal'); let down = false, sx = 0, sl = 0, moved = 0;
    $('#gprev').onclick = () => gal.scrollBy({ left: -gal.clientWidth * .7, behavior: 'smooth' });
    $('#gnext').onclick = () => gal.scrollBy({ left: gal.clientWidth * .7, behavior: 'smooth' });
    gal.addEventListener('pointerdown', e => { down = true; moved = 0; sx = e.clientX; sl = gal.scrollLeft; });
    addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - sx; moved = Math.max(moved, Math.abs(dx)); if (moved > 6) { gal.classList.add('drag'); gal.scrollLeft = sl - dx; } });
    addEventListener('pointerup', () => { down = false; gal.classList.remove('drag'); });
    let li = 0; const lb = $('#lb');
    const showLb = i => { li = (i + GAL.length) % GAL.length; $('#lb-img').src = GAL[li].src; $('#lb-cap').textContent = GAL[li].leg + '  ·  ' + (li + 1) + '/' + GAL.length; };
    gal.addEventListener('click', e => { const f = e.target.closest('figure'); if (f && moved < 6) { showLb(+f.dataset.i); lb.classList.add('open'); } });
    lb.querySelector('.x').onclick = () => lb.classList.remove('open');
    lb.querySelector('.pv').onclick = () => showLb(li - 1); lb.querySelector('.nx').onclick = () => showLb(li + 1);
    lb.onclick = e => { if (e.target === lb) lb.classList.remove('open'); };
    addEventListener('keydown', e => {
      if (lb.classList.contains('open')) { if (e.key === 'Escape') lb.classList.remove('open'); if (e.key === 'ArrowLeft') showLb(li - 1); if (e.key === 'ArrowRight') showLb(li + 1); }
      else if ($('#dm').classList.contains('open')) { if (e.key === 'Escape') closeDetail(); if (e.key === 'ArrowLeft') showDm(dmI - 1); if (e.key === 'ArrowRight') showDm(dmI + 1); }
      else if (e.key === 'Escape') { $('#mconf').classList.remove('open'); if (CMV.closePanel && $('#panel').classList.contains('open')) CMV.closePanel(); }
    });
    if (location.hash === '#painel') CMV.openPanel();
  }

  CMV.init = async function () {
    let c = null;
    // se o armazenamento do navegador travar (modo privado, por exemplo), segue com o conteúdo original
    try { c = await Promise.race([Store.load(), new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 4000))]); } catch (e) { c = null; }
    if (!c || c.versao !== window.DEFAULTS_VERSION) { c = window.makeDefaults(); Store.saveContent(c).catch(() => { /* segue sem salvar */ }); }
    C = CMV.C = c;
    CMV.setContent = n => { C = CMV.C = n; };
    bindOnce();
    renderAll();
  };
})();
