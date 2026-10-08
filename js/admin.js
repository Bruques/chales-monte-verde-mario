/* Painel do proprietário: solicitações, calendário e preços por hospedagem, textos, fotos e depoimentos. */
(function () {
  const CMV = window.CMV;
  const { $, $$, esc, addDays, br, money, toast, TODAY, quote, nightPrice, buildMonth, firstOf, nightsBetween, ICON_NAMES } = CMV.util;
  const panel = $('#panel');
  const C = () => CMV.C;

  const FOTOS = !!(window.CMV_CONFIG && window.CMV_CONFIG.editarFotos);
  const TABS = [['t-req', 'Solicitações'], ['t-cal', 'Calendário'], ['t-price', 'Preços'], ['t-acc', 'Hospedagens'], ['t-photos', 'Fotos do site'], ['t-text', 'Textos e contato'], ['t-guia', 'Monte Verde'], ['t-rev', 'Depoimentos'], ['t-sys', 'Sistema']];
  const PERMITIDAS = (window.CMV_CONFIG && window.CMV_CONFIG.abasPainel) || TABS.map(t => t[0]);
  for (let i = TABS.length - 1; i >= 0; i--) if (!PERMITIDAS.includes(TABS[i][0]) || (TABS[i][0] === 't-photos' && !FOTOS)) TABS.splice(i, 1);
  let tab = TABS[0][0], accSel = null, pview = 0, anchor = null;

  /* ---------- acesso por caminho (ex.: "acomodacoes.0.precos.semana") ---------- */
  const getP = (path, root) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), root || C());
  const setP = (path, v) => { const ks = path.split('.'), last = ks.pop(); const o = ks.reduce((x, k) => x[k], C()); o[last] = v; };
  const FMT = {
    text: v => v ?? '', num: v => v ?? '', bool: v => !!v, date: v => v ?? '',
    lines: v => (v || []).join('\n'), paras: v => (v || []).join('\n\n'),
    pairs: v => (v || []).map(p => p.join(' | ')).join('\n'),
    nums: v => (v || []).map(n => `${n.valor} | ${n.rotulo}`).join('\n')
  };
  const PARSE = {
    text: v => v, date: v => v, num: v => (v === '' ? null : Number(v)),
    lines: v => v.split('\n').map(s => s.trim()).filter(Boolean),
    paras: v => v.split(/\n\s*\n/).map(s => s.trim()).filter(Boolean),
    pairs: v => v.split('\n').map(s => s.split('|').map(x => x.trim())).filter(p => p[0]).map(p => [p[0], p[1] || '']),
    nums: v => v.split('\n').map(s => s.split('|').map(x => x.trim())).filter(p => p[0] !== '' && !isNaN(Number(p[0]))).map(p => ({ valor: Number(p[0]), rotulo: p[1] || '' }))
  };

  /* campo de formulário ligado a um caminho */
  function F(label, path, o = {}) {
    const kind = o.kind || 'text', v = esc(FMT[kind](getP(path)));
    const full = o.full ? ' full' : '';
    if (kind === 'bool') return `<div class="ff chk${full}"><label><input type="checkbox" data-path="${path}" data-kind="bool" ${getP(path) ? 'checked' : ''}>${esc(label)}</label></div>`;
    if (o.select) return `<div class="ff${full}"><label>${esc(label)}</label><select data-path="${path}" data-kind="${o.num ? 'num' : 'text'}">${o.select.map(([k, n]) => `<option value="${esc(k)}" ${String(getP(path)) === String(k) ? 'selected' : ''}>${esc(n)}</option>`).join('')}</select></div>`;
    const multi = ['lines', 'paras', 'pairs', 'nums'].includes(kind) || o.area;
    const inp = multi ? `<textarea data-path="${path}" data-kind="${kind}" ${o.ph ? `placeholder="${esc(o.ph)}"` : ''} ${o.rows ? `rows="${o.rows}"` : ''}>${v}</textarea>`
      : `<input type="${kind === 'num' ? 'number' : kind === 'date' ? 'date' : 'text'}" ${o.step ? `step="${o.step}"` : ''} data-path="${path}" data-kind="${kind}" value="${v}" ${o.ph ? `placeholder="${esc(o.ph)}"` : ''}>`;
    return `<div class="ff${full}"><label>${esc(label)}</label>${inp}${o.hint ? `<div class="hint" style="margin:4px 0 0">${esc(o.hint)}</div>` : ''}</div>`;
  }

  panel.addEventListener('input', onEdit);
  panel.addEventListener('change', onEdit);
  function onEdit(e) {
    const el = e.target;
    if (el.dataset.up || el.dataset.up1 || el.dataset.pick !== undefined || !el.dataset.path) return;
    const kind = el.dataset.kind || 'text';
    const v = kind === 'bool' ? el.checked : PARSE[kind](el.value);
    setP(el.dataset.path, v);
    CMV.persist();
  }

  /* ---------- abrir / fechar ---------- */
  CMV.openPanel = async function () {
    panel.classList.add('open'); document.body.style.overflow = 'hidden'; panel.scrollTop = 0;
    // o botão responde mesmo que os dados do site ainda estejam carregando
    for (let i = 0; i < 60 && !CMV.C; i++) await new Promise(r => setTimeout(r, 100));
    if (!CMV.C) { panel.innerHTML = '<div class="login"><h3>Não foi possível carregar</h3><p>Recarregue a página e tente de novo.</p></div>'; return; }
    if (!Store.auth.isLogged()) { renderLogin(); return; }
    await enter();
  };
  // ligado já na carga do script e também por toque (iOS) e pelo endereço #painel
  const openBtn = $('#open-panel');
  if (openBtn) openBtn.addEventListener('click', e => { e.preventDefault(); CMV.openPanel(); });
  addEventListener('hashchange', () => { if (location.hash === '#painel') CMV.openPanel(); });
  CMV.closePanel = function () {
    panel.classList.remove('open'); document.body.style.overflow = '';
    if (location.hash === '#painel') history.replaceState(null, '', location.pathname + location.search);
    CMV.renderPublic();
  };
  CMV.onRequestsChanged = async () => { if (panel.classList.contains('open') && Store.auth.isLogged()) { CMV.REQ = await Store.loadRequests(); if (tab === 't-req') renderTab(); } };

  function renderLogin() {
    panel.innerHTML = `<div class="p-top"><div class="wrap"><div><b>Painel do proprietário</b></div><button class="out" id="ad-close">← Voltar ao site</button></div></div>
      <form class="login" id="login"><h3>Entrar</h3><p>Acesso restrito ao proprietário.</p>
        <input type="password" id="lg-pw" placeholder="Senha" autocomplete="current-password" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="go">
        <button class="btn btn-dark" type="submit">Entrar</button>
        ${Store.auth.dica ? `<p class="fine" style="margin-top:14px">${esc(Store.auth.dica)}</p>` : ''}</form>`;
    $('#ad-close').onclick = CMV.closePanel;
    $('#login').onsubmit = async e => {
      e.preventDefault();
      try { await Store.auth.login($('#lg-pw').value); await enter(); } catch (err) { toast(err.message || 'Não foi possível entrar'); }
    };
  }

  async function enter() {
    try { CMV.REQ = await Promise.race([Store.loadRequests(), new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 4000))]); } catch (e) { CMV.REQ = []; toast('Não foi possível carregar as solicitações'); }
    if (!accSel || !CMV.byId(accSel)) accSel = (C().acomodacoes.find(a => a.status === 'ativo') || C().acomodacoes[0]).id;
    panel.innerHTML = `<div class="p-top"><div class="wrap"><div><b>Painel do proprietário</b><span class="pill${Store.mode === 'local' ? '' : ' ok'}">${Store.mode === 'local' ? 'MODO TESTE' : 'ONLINE'}</span></div>
        <div style="display:flex;gap:8px"><button class="out" id="ad-out">Sair</button><button class="out" id="ad-close">← Voltar ao site</button></div></div></div>
      <div class="wrap"><div class="tabs" id="ad-tabs">${TABS.map(([k, n]) => `<button data-tab="${k}" class="${k === tab ? 'on' : ''}">${n}</button>`).join('')}</div>
        ${Store.mode === 'local' ? '<div class="p-warn">Modo de teste: as alterações ficam salvas apenas neste navegador. Ao ligar o Firebase, tudo passa a ficar na nuvem e o painel pede login por e-mail e senha.</div>' : ''}
        <div id="ad-body"></div></div>`;
    $('#ad-close').onclick = CMV.closePanel;
    $('#ad-out').onclick = () => { Store.auth.logout(); CMV.closePanel(); };
    $$('#ad-tabs button').forEach(b => b.onclick = () => { tab = b.dataset.tab; anchor = null; $$('#ad-tabs button').forEach(x => x.classList.toggle('on', x === b)); renderTab(); });
    renderTab();
  }

  function renderTab() {
    const body = $('#ad-body'); if (!body) return;
    try { ({ 't-req': tReq, 't-cal': tCal, 't-price': tPrice, 't-acc': tAcc, 't-photos': tPhotos, 't-text': tText, 't-guia': tGuia, 't-rev': tRev, 't-sys': tSys })[tab](body); }
    catch (e) { console.error(e); body.innerHTML = `<div class="empty">Não foi possível montar esta aba: ${esc(e.message)}</div>`; }
  }

  const $$$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const accBar = (accs) => `<div class="sel-bar">${accs.map(a => `<button data-as="${a.id}" class="${a.id === accSel ? 'on' : ''}">${esc(a.nome)}</button>`).join('')}</div>`;
  const accIdx = () => C().acomodacoes.findIndex(a => a.id === accSel);
  const curAcc = () => C().acomodacoes[accIdx()];
  function bindAccBar(body) { $$$('[data-as]', body).forEach(b => b.onclick = () => { accSel = b.dataset.as; anchor = null; renderTab(); }); }

  /* ================= solicitações ================= */
  function reqNights(r) { const o = []; for (let d = r.ci; d < r.co; d = addDays(d, 1)) o.push(d); return o; }
  function tReq(body) {
    const REQ = CMV.REQ;
    if (!REQ.length) { body.innerHTML = '<div class="empty">Nenhuma solicitação ainda.<br>Quando um hóspede pedir uma reserva pelo site, ela aparece aqui.</div>'; return; }
    body.innerHTML = REQ.map(r => {
      const a = CMV.byId(r.accId), q = a ? quote(a, r.ci, r.co) : { n: nightsBetween(r.ci, r.co), total: r.total };
      const digits = (r.phone || '').replace(/\D/g, '');
      return `<div class="req" data-id="${esc(r.id)}"><div><h4>${esc(r.name)}<span class="badge-s s-${r.status}">${r.status}</span></h4>
        <p><b>${esc(r.accNome || (a && a.nome) || 'Hospedagem')}</b> · ${br(r.ci)} → ${br(r.co)} · ${q.n} ${q.n > 1 ? 'noites' : 'noite'} · ${r.guests} hósp.${r.pet ? ' · com pet' : ''}${r.extra ? ' · cama/berço extra' : ''}${q.total != null ? ' · ' + money(q.total) : ' · valor a combinar'}</p>
        ${r.obs ? `<p>“${esc(r.obs)}”</p>` : ''}</div>
        <div class="acts">${r.status === 'pendente' ? '<button class="ok" data-a="ok">Confirmar</button><button data-a="no">Recusar</button>' : '<button data-a="back">Voltar p/ pendente</button>'}
        ${digits.length >= 10 ? `<a href="https://wa.me/${digits.startsWith('55') ? digits : '55' + digits}" target="_blank" rel="noopener">Responder</a>` : ''}
        <button data-a="del">Excluir</button></div></div>`;
    }).join('');
    $$$('.req', body).forEach(el => {
      const r = CMV.REQ.find(x => x.id === el.dataset.id);
      $$$('button[data-a]', el).forEach(b => b.onclick = async () => {
        const a = CMV.byId(r.accId), act = b.dataset.a;
        const free = () => { if (a) Object.keys(a.ocupado).forEach(d => { if (a.ocupado[d] === r.id) delete a.ocupado[d]; }); };
        if (act === 'ok') {
          if (!a) { toast('Esta hospedagem não existe mais'); return; }
          const clash = reqNights(r).filter(d => a.ocupado[d] && a.ocupado[d] !== r.id);
          if (clash.length) { toast('Datas já ocupadas por outra reserva ou bloqueio'); return; }
          reqNights(r).forEach(d => { a.ocupado[d] = r.id; }); r.status = 'confirmada';
        }
        if (act === 'no') { free(); r.status = 'recusada'; }
        if (act === 'back') { free(); r.status = 'pendente'; }
        if (act === 'del') { if (!confirm('Excluir esta solicitação? As datas confirmadas serão liberadas.')) return; free(); await Store.deleteRequest(r.id); CMV.REQ = CMV.REQ.filter(x => x !== r); }
        else await Store.updateRequest(r);
        CMV.persist(); renderTab();
      });
    });
  }

  /* ================= calendário ================= */
  function tCal(body) {
    const a = curAcc(); if (!a) return;
    body.innerHTML = `${accBar(C().acomodacoes.filter(x => x.status === 'ativo'))}
      <div class="p-cal"><div class="card">
        <div class="modes">
          <label><input type="radio" name="mode" value="block" checked><span>Bloquear dias</span></label>
          <label><input type="radio" name="mode" value="unblock"><span>Liberar dias</span></label>
          <label><input type="radio" name="mode" value="price"><span>Definir preço</span></label>
          <label><input type="radio" name="mode" value="clear"><span>Remover preço especial</span></label>
        </div>
        <div class="f" id="sp-wrap" style="display:none"><label>Valor da noite (R$)</label><input type="number" id="sp-val" min="0" step="10" placeholder="Ex.: 650" style="width:100%;padding:13px 15px;border-radius:12px;border:1px solid #1d2b2528;font:inherit;margin-top:4px"></div>
        <p class="hint" id="cal-hint"></p>
        <div class="cal-head"><span></span><div class="cal-nav"><button id="pprev">←</button><button id="pnext">→</button></div></div>
        <div class="months" id="pmonths"></div>
        <div class="legend"><span><i style="background:#f2d0cb"></i>Bloqueado por você</span><span><i style="background:repeating-linear-gradient(135deg,#ece4d3 0 3px,#fff 3px 6px)"></i>Reserva confirmada</span><span><i style="box-shadow:inset 0 0 0 2px var(--amber)"></i>Preço especial</span></div>
      </div>
      <div class="card"><h3 style="font-size:1.6rem;margin-bottom:8px">Como funciona</h3><p style="font-size:.9rem;color:#5b6a60">Cada hospedagem tem o seu calendário. Escolha a ação, clique no <b>primeiro</b> dia e depois no <b>último</b> dia do período (para um único dia, clique duas vezes nele). O calendário do site atualiza na hora.</p><p style="font-size:.9rem;color:#5b6a60;margin-top:10px">Reservas confirmadas na aba Solicitações bloqueiam as datas sozinhas.</p></div></div>`;
    bindAccBar(body);
    $$$('input[name=mode]', body).forEach(r => r.onchange = renderPCal);
    $('#pprev').onclick = () => { pview = Math.max(0, pview - 1); renderPCal(); };
    $('#pnext').onclick = () => { pview = Math.min(11, pview + 1); renderPCal(); };
    renderPCal();
  }
  function renderPCal() {
    const a = curAcc(); if (!a || !$('#pmonths')) return;
    const mode = document.querySelector('input[name=mode]:checked').value;
    $('#sp-wrap').style.display = mode === 'price' ? 'block' : 'none';
    $('#cal-hint').textContent = anchor ? `Início: ${br(anchor)}. Agora clique no último dia do período.` : 'Clique no primeiro dia do período.';
    const box = $('#pmonths'); box.innerHTML = '';
    [0, 1].forEach(k => box.append(buildMonth(firstOf(pview + k), (i, d) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'd';
      const p = nightPrice(a, i);
      b.innerHTML = `${d}${(i >= TODAY && p != null) ? `<small>${p}</small>` : ''}`;
      if (i < TODAY) { b.classList.add('past'); return b; }
      const o = a.ocupado[i];
      if (o === 'manual') b.classList.add('mine'); else if (o) b.classList.add('demo'); else b.classList.add('free');
      if (a.especial[i] != null) b.classList.add('sp');
      if (anchor === i) b.classList.add('start');
      b.onclick = () => {
        if (!anchor) { anchor = i; renderPCal(); return; }
        const x = anchor < i ? anchor : i, y = anchor < i ? i : anchor; anchor = null;
        let touched = 0, skipped = 0;
        if (mode === 'price' && $('#sp-val').value === '') { toast('Informe o valor da noite'); renderPCal(); return; }
        for (let d = x; d <= y; d = addDays(d, 1)) {
          if (d < TODAY) continue;
          const oc = a.ocupado[d];
          if (mode === 'block') { if (oc && oc !== 'manual') skipped++; else { a.ocupado[d] = 'manual'; touched++; } }
          else if (mode === 'unblock') { if (oc === 'manual') { delete a.ocupado[d]; touched++; } else if (oc) skipped++; }
          else if (mode === 'price') { a.especial[d] = Number($('#sp-val').value); touched++; }
          else { delete a.especial[d]; touched++; }
        }
        if (skipped) toast(`${skipped} dia(s) com reserva confirmada foram mantidos`);
        CMV.persist(); renderPCal();
      };
      return b;
    })));
    $('#pprev').disabled = pview <= 0; $('#pnext').disabled = pview >= 11;
  }

  /* ================= preços ================= */
  function tPrice(body) {
    const i = accIdx(), a = curAcc(); if (!a) return;
    const base = `acomodacoes.${i}`;
    body.innerHTML = `${accBar(C().acomodacoes.filter(x => x.status === 'ativo'))}
      <div class="card" style="max-width:640px"><h3 style="font-size:1.8rem;margin-bottom:6px">Valores da diária · ${esc(a.nome)}</h3>
        <p class="hint">Se um valor ficar vazio, o site mostra “Valores sob consulta” e o pedido vira uma solicitação de orçamento. Para feriados e temporadas, use a aba Calendário (preço por período).</p>
        <div class="fg">
          ${F('Diária durante a semana (dom a qui) · R$', base + '.precos.semana', { kind: 'num', step: 10 })}
          ${F('Diária no fim de semana (sex e sáb) · R$', base + '.precos.fim', { kind: 'num', step: 10 })}
          ${F('Mínimo de noites', base + '.precos.min', { kind: 'num' })}
          ${F('Observação mostrada junto ao valor', base + '.obsPreco', { full: true, area: true })}
        </div></div>`;
    bindAccBar(body);
  }

  /* ================= fotos (grade reutilizável) ================= */
  function photoGrid(base) {
    const list = getP(base) || [];
    return `<div class="ph-grid">${list.map((f, i) => `<div class="ph-card"><img src="${esc(f.src)}" alt="">${i === 0 ? '<span class="cover">Capa</span>' : ''}
      <div class="row"><button data-ph="left" data-base="${base}" data-i="${i}" title="Mover para trás">←</button><button data-ph="right" data-base="${base}" data-i="${i}" title="Mover para frente">→</button><button data-ph="cover" data-base="${base}" data-i="${i}" title="Usar como capa">★</button><button data-ph="del" data-base="${base}" data-i="${i}" class="danger" title="Remover">✕</button></div>
      <input type="text" data-path="${base}.${i}.leg" data-kind="text" value="${esc(f.leg || '')}" placeholder="Legenda"></div>`).join('')}</div>
      <label class="up">+ Adicionar fotos<input type="file" accept="image/*" multiple data-up="${base}"></label>`;
  }
  panel.addEventListener('click', e => {
    const b = e.target.closest('[data-ph]'); if (!b) return;
    const list = getP(b.dataset.base), i = +b.dataset.i, act = b.dataset.ph;
    if (act === 'del') { if (!confirm('Remover esta foto do site?')) return; list.splice(i, 1); }
    else if (act === 'left' && i > 0) [list[i - 1], list[i]] = [list[i], list[i - 1]];
    else if (act === 'right' && i < list.length - 1) [list[i + 1], list[i]] = [list[i], list[i + 1]];
    else if (act === 'cover' && i > 0) list.unshift(list.splice(i, 1)[0]);
    CMV.persist(); renderTab();
  });
  panel.addEventListener('change', async e => {
    const el = e.target;
    if (el.dataset.up) {
      const list = getP(el.dataset.up); const files = [...el.files]; if (!files.length) return;
      toast('Enviando fotos…');
      try { for (const f of files) list.push({ src: await Store.uploadImage(f, el.dataset.up), leg: '' }); } catch (err) { toast('Erro ao enviar: ' + err.message); }
      CMV.persist(); renderTab();
    } else if (el.dataset.up1) {
      const f = el.files[0]; if (!f) return;
      toast('Enviando foto…');
      try { setP(el.dataset.up1, await Store.uploadImage(f, el.dataset.up1)); } catch (err) { toast('Erro ao enviar: ' + err.message); return; }
      CMV.persist(); renderTab();
    } else if (el.dataset.pick !== undefined && el.value) { setP(el.dataset.pick, el.value); CMV.persist(); renderTab(); }
  });
  function allPhotos() {
    const out = [];
    (C().site.fotosGerais || []).forEach((f, i) => out.push([f.src, `Propriedade · ${f.leg || 'foto ' + (i + 1)}`]));
    C().acomodacoes.forEach(a => a.fotos.forEach((f, i) => out.push([f.src, `${a.nome} · ${f.leg || 'foto ' + (i + 1)}`])));
    return out;
  }
  function singleImage(label, path) {
    const src = getP(path);
    return `<div class="card" style="margin-bottom:14px"><div style="display:grid;grid-template-columns:150px 1fr;gap:16px;align-items:center">
      <img src="${esc(src)}" alt="" style="width:150px;aspect-ratio:4/3;object-fit:cover;border-radius:12px;background:#ddd">
      <div><div class="lbl" style="margin-bottom:8px">${esc(label)}</div>
        <label class="up">Enviar nova foto<input type="file" accept="image/*" data-up1="${path}"></label>
        <select data-pick="${path}" style="margin-top:10px;width:100%;padding:10px;border-radius:10px;border:1px solid #1d2b2528;font:inherit"><option value="">…ou escolher entre as fotos já enviadas</option>${allPhotos().map(([s, n]) => `<option value="${esc(s)}">${esc(n)}</option>`).join('')}</select></div></div></div>`;
  }

  /* ================= hospedagens ================= */
  function amenityRows(base) {
    const list = getP(base) || [];
    return list.map((c, k) => `<div class="am-row"><select data-path="${base}.${k}.ic" data-kind="text">${Object.entries(ICON_NAMES).map(([i, n]) => `<option value="${i}" ${c.ic === i ? 'selected' : ''}>${n}</option>`).join('')}</select>
      <input type="text" data-path="${base}.${k}.t" data-kind="text" value="${esc(c.t)}" placeholder="Título"><button data-am="del" data-base="${base}" data-i="${k}" class="danger" title="Remover">✕</button>
      <input class="dd" style="grid-column:1/-1" type="text" data-path="${base}.${k}.d" data-kind="text" value="${esc(c.d)}" placeholder="Descrição curta"></div>`).join('') + `<button class="btn btn-line btn-sm" data-am="add" data-base="${base}" style="margin-top:6px">+ Adicionar comodidade</button>`;
  }
  panel.addEventListener('click', e => {
    const b = e.target.closest('[data-am]'); if (!b) return;
    const list = getP(b.dataset.base);
    if (b.dataset.am === 'add') list.push({ ic: 'home', t: 'Nova comodidade', d: '' }); else list.splice(+b.dataset.i, 1);
    CMV.persist(); renderTab();
  });

  function tAcc(body) {
    const accs = C().acomodacoes, i = accIdx(), a = accs[i], base = `acomodacoes.${i}`;
    body.innerHTML = `<div class="acc-list">${accs.map((x, k) => `<div class="acc-row ${x.id === accSel ? 'on' : ''}">${CMV.cover(x) ? `<img src="${esc(CMV.cover(x))}" alt="">` : '<span style="width:54px;height:42px;border-radius:8px;background:var(--moss)"></span>'}<b>${esc(x.nome)} <span class="badge-s ${x.status === 'ativo' ? 's-confirmada' : 's-pendente'}">${x.status === 'ativo' ? 'ativo' : 'em breve'}</span></b>
        <button data-mv="up" data-i="${k}">↑</button><button data-mv="down" data-i="${k}">↓</button><button data-as="${x.id}">Editar</button></div>`).join('')}
      <div><button class="btn btn-dark btn-sm" id="acc-new">+ Nova hospedagem</button></div></div>
      <div class="card"><h3 style="font-size:1.8rem;margin-bottom:12px">${esc(a.nome)}</h3>
        <div class="fg">
          ${F('Situação', base + '.status', { select: [['ativo', 'Ativo (aparece e aceita reservas)'], ['embreve', 'Em breve (aparece sem reserva)']] })}
          ${F('Tipo (etiqueta na foto)', base + '.tipo')}
          ${F('Texto curto na faixa escura (ex.: para casais)', base + '.faixaSub')}
          ${F('Nome', base + '.nome')}
          ${F('Resumo (aparece no cartão)', base + '.resumo', { area: true })}
          ${F('Descrição (separe parágrafos com uma linha em branco)', base + '.descricao', { kind: 'paras', full: true, rows: 6 })}
          ${F('Destaques (um por linha)', base + '.destaques', { kind: 'lines', full: true })}
          ${F('Hóspedes: mínimo', base + '.capMin', { kind: 'num' })}
          ${F('Hóspedes: máximo', base + '.capMax', { kind: 'num' })}
          ${F('Hóspedes sugeridos ao abrir a reserva', base + '.hospPadrao', { kind: 'num' })}
          ${F('Oferece cama ou berço extra sob pedido', base + '.camaExtra', { kind: 'bool' })}
        </div>
        <div class="sub-h" style="margin-top:22px">Comodidades desta hospedagem</div>${amenityRows(base + '.comodidades')}
        ${FOTOS ? `<div class="sub-h" style="margin-top:22px">Fotos</div>
        <p class="hint">A primeira foto é a capa. Use as setas para reordenar e a estrela para definir a capa.</p>${photoGrid(base + '.fotos')}` : ''}
        <div style="margin-top:26px;padding-top:18px;border-top:1px solid #1d2b2518"><button class="btn btn-line btn-sm danger" id="acc-del">Excluir esta hospedagem</button></div>
      </div>`;
    $$$('[data-as]', body).forEach(b => b.onclick = () => { accSel = b.dataset.as; renderTab(); });
    $$$('[data-mv]', body).forEach(b => b.onclick = () => {
      const k = +b.dataset.i, t = b.dataset.mv === 'up' ? k - 1 : k + 1; if (t < 0 || t >= accs.length) return;
      [accs[k], accs[t]] = [accs[t], accs[k]]; CMV.persist(); renderTab();
    });
    $('#acc-new').onclick = () => {
      const id = 'acc-' + Date.now();
      accs.push({ id, status: 'embreve', nome: 'Nova hospedagem', tipo: 'Chalé para casais', resumo: '', descricao: [], destaques: [], capMin: 2, capMax: 2, camaExtra: false, obsPreco: '', precos: { semana: null, fim: null, min: 1 }, comodidades: [], fotos: [], ocupado: {}, especial: {} });
      accSel = id; CMV.persist(); renderTab();
    };
    $('#acc-del').onclick = () => {
      if (accs.length <= 1) { toast('Mantenha ao menos uma hospedagem'); return; }
      if (!confirm(`Excluir "${a.nome}" com fotos, calendário e preços? Isso não pode ser desfeito.`)) return;
      accs.splice(i, 1); accSel = accs[0].id; CMV.persist(); renderTab();
    };
  }

  /* ================= fotos do site ================= */
  function tPhotos(body) {
    body.innerHTML = `<div class="sub-h">Imagens de destaque</div>
      ${singleImage('Imagem principal (topo do site)', 'site.heroImg')}
      ${singleImage('Imagem do convite final (rodapé)', 'site.finalImg')}
      ${singleImage('Seção “O lugar”: foto grande', 'site.sobreFotoA')}
      ${singleImage('Seção “O lugar”: foto pequena', 'site.sobreFotoB')}
      <div class="sub-h" style="margin-top:26px">Fotos da propriedade</div>
      <p class="hint">Aparecem na galeria, no filtro “Propriedade”. As fotos de cada hospedagem são editadas na aba Hospedagens.</p>
      <div class="card">${photoGrid('site.fotosGerais')}</div>`;
  }

  /* ================= textos e contato ================= */
  function tText(body) {
    body.innerHTML = `<div class="card"><div class="sub-h">Contato e identificação</div><div class="fg">
        ${F('Nome do site', 'site.nome')}${F('Nome curto (logo)', 'site.nomeCurto')}
        ${F('WhatsApp para pedidos (só números, com 55 + DDD)', 'site.whatsapp', { hint: 'Ex.: 5535999990000' })}${F('WhatsApp como aparece no site', 'site.whatsappExibicao')}
        ${F('E-mail', 'site.email')}${F('Instagram (sem @)', 'site.instagram')}
        ${F('Mostrar faixa “Prévia do site” no topo (desligue ao publicar)', 'site.faixaPrevia', { kind: 'bool', full: true })}
      </div>
      <div class="sub-h" style="margin-top:22px">Endereço</div><div class="fg">
        ${F('Endereço', 'site.endereco', { full: true })}${F('Complemento', 'site.enderecoLinha2', { full: true })}
        ${F('Latitude', 'site.lat', { kind: 'num', step: 'any' })}${F('Longitude', 'site.lng', { kind: 'num', step: 'any' })}
      </div>
      <div class="sub-h" style="margin-top:22px">Estadia</div><div class="fg">
        ${F('Check-in (horário)', 'site.checkin')}${F('Check-out (horário)', 'site.checkout')}
        ${F('Aceita pets', 'site.aceitaPet', { kind: 'bool', full: true })}${F('Regra para pets', 'site.politicaPet', { full: true })}
        ${F('Pagamento / sinal', 'site.pagamento', { full: true })}${F('Cancelamento', 'site.cancelamento', { full: true })}
        ${F('Regras da casa (uma por linha)', 'site.regras', { kind: 'lines', full: true, rows: 6 })}
      </div></div>
      <div class="card" style="margin-top:16px"><div class="sub-h">Textos da página</div><div class="fg">
        ${F('Topo: linha pequena', 'site.heroEyebrow', { full: true })}${F('Topo: título (use *asteriscos* para destacar)', 'site.heroTitulo', { full: true })}${F('Topo: subtítulo', 'site.heroSub', { full: true, area: true })}
        ${F('Faixa do topo (uma por linha: Título | subtítulo)', 'site.heroBarra', { kind: 'pairs', full: true })}
        ${F('Faixa dourada (uma palavra por linha)', 'site.faixa', { kind: 'lines', full: true })}
        ${F('O lugar: linha pequena', 'site.sobreEyebrow')}${F('O lugar: título', 'site.sobreTitulo')}
        ${F('O lugar: textos (separe com linha em branco)', 'site.sobreParagrafos', { kind: 'paras', full: true, rows: 8 })}
        ${F('Assinatura', 'site.sobreAssinatura')}
        ${F('Itens extras da faixa escura (um por linha: Título | subtítulo)', 'site.faixaExtra', { kind: 'pairs', full: true, hint: 'As hospedagens e o “+N chalés a caminho” entram sozinhos nessa faixa.' })}
        ${F('Título das comodidades gerais', 'site.comodidadesTitulo')}
        ${F('Avaliações: título', 'site.depoimentosTitulo')}${F('Avaliações: texto', 'site.depoimentosLead', { full: true })}
        ${F('Como chegar: título', 'site.localTitulo')}${F('Como chegar: texto', 'site.localLead', { full: true, area: true })}
        ${F('Convite final: título', 'site.finalTitulo', { full: true })}
      </div>
      <div class="sub-h" style="margin-top:22px">Comodidades gerais (todas as hospedagens)</div>${amenityRows('site.comodidades')}</div>`;
  }


  /* ================= guia de Monte Verde ================= */
  function listRows(base, fields, nomeItem) {
    const list = getP(base) || [];
    return list.map((it, i) => `<div class="card" style="margin-bottom:10px;padding:16px"><div class="fg">${fields.map(([k, l, o]) => F(l, `${base}.${i}.${k}`, o || {})).join('')}</div><div style="margin-top:10px"><button class="btn btn-line btn-sm danger" data-ld="${base}" data-i="${i}">Remover ${nomeItem}</button></div></div>`).join('');
  }
  function tGuia(body) {
    const G = C().guia, hoje = TODAY;
    const idx = (G.eventos || []).map((e, i) => i).sort((a, b) => G.eventos[a].ini.localeCompare(G.eventos[b].ini));
    const fEv = [['ini', 'Início', { kind: 'date' }], ['fim', 'Fim (igual ao início se for um dia)', { kind: 'date' }], ['nome', 'Nome do evento', { full: true }], ['nota', 'Observação', { full: true }]];
    const evRow = i => `<div class="card" style="margin-bottom:10px;padding:16px"><div class="fg">${fEv.map(([k, l, o]) => F(l, `guia.eventos.${i}.${k}`, o || {})).join('')}</div><div style="margin-top:10px"><button class="btn btn-line btn-sm danger" data-ld="guia.eventos" data-i="${i}">Remover evento</button></div></div>`;
    const futuros = idx.filter(i => (G.eventos[i].fim || G.eventos[i].ini) >= hoje), passados = idx.filter(i => !futuros.includes(i));
    body.innerHTML = `<div class="card"><div class="sub-h">Textos da seção</div><div class="fg">${F('Título (use *asteriscos* para destacar)', 'guia.titulo', { full: true })}${F('Texto de abertura', 'guia.lead', { full: true, area: true })}</div></div>
      <div class="sub-h" style="margin-top:22px">O que fazer</div><p class="hint">Atrações, passeios, restaurantes e lojas. O campo “Grupo” agrupa os cartões (ex.: Natureza e trilhas, Gastronomia).</p>
      ${listRows('guia.atracoes', [['cat', 'Grupo'], ['nome', 'Nome'], ['texto', 'Descrição', { full: true, area: true }], ['link', 'Link (opcional)', { full: true }]], 'item')}
      <button class="btn btn-dark btn-sm" data-la="guia.atracoes">+ Adicionar atração</button>
      <div class="sub-h" style="margin-top:26px">Calendário de eventos</div><p class="hint">O site mostra o mês atual e os futuros. Eventos de meses anteriores ficam guardados aqui e ocultos para os visitantes.</p>
      ${futuros.map(evRow).join('') || '<p class="hint">Nenhum evento futuro.</p>'}
      <button class="btn btn-dark btn-sm" data-la="guia.eventos">+ Adicionar evento</button>
      ${passados.length ? `<details style="margin-top:14px"><summary style="cursor:pointer;font-weight:600">Eventos passados, ocultos no site (${passados.length})</summary><div style="margin-top:10px">${passados.map(evRow).join('')}</div></details>` : ''}
      <div class="card" style="margin-top:14px"><div class="fg">${F('Fonte (texto)', 'guia.eventosFonte.texto', { full: true })}${F('Fonte (link)', 'guia.eventosFonte.link', { full: true })}</div></div>
      <div class="sub-h" style="margin-top:26px">Futuras atrações</div>
      ${listRows('guia.futuras', [['nome', 'Nome'], ['link', 'Link (vídeo ou site)'], ['texto', 'Descrição', { full: true, area: true }]], 'item')}
      <button class="btn btn-dark btn-sm" data-la="guia.futuras">+ Adicionar atração futura</button>`;
  }
  panel.addEventListener('click', e => {
    const d = e.target.closest('[data-ld]'), a = e.target.closest('[data-la]');
    if (d) { if (!confirm('Remover este item?')) return; getP(d.dataset.ld).splice(+d.dataset.i, 1); CMV.persist(); renderTab(); }
    if (a) {
      const t = { 'guia.atracoes': { cat: 'Natureza e trilhas', nome: '', texto: '', link: '' }, 'guia.eventos': { ini: TODAY, fim: TODAY, nome: '', nota: '' }, 'guia.futuras': { nome: '', texto: '', link: '' } }[a.dataset.la];
      getP(a.dataset.la).push(t); CMV.persist(); renderTab();
    }
  });

  /* ================= depoimentos ================= */
  function tRev(body) {
    const opts = [['', '(geral)'], ...C().acomodacoes.map(a => [a.id, a.nome])];
    body.innerHTML = `<p class="hint">Use apenas relatos reais, com autorização do hóspede. Mostre só o primeiro nome.</p>` + C().depoimentos.map((r, i) => `<div class="card" style="margin-bottom:12px"><div class="fg">
        ${F('Nome (primeiro nome)', `depoimentos.${i}.nome`)}${F('Quando (ex.: agosto de 2026)', `depoimentos.${i}.quando`)}
        ${F('Hospedagem', `depoimentos.${i}.chale`, { select: opts })}${F('Estrelas (1 a 5)', `depoimentos.${i}.estrelas`, { select: [5, 4, 3, 2, 1].map(n => [n, '★'.repeat(n)]), num: true })}
        ${F('Texto', `depoimentos.${i}.texto`, { full: true, area: true })}</div>
        <div style="margin-top:12px"><button class="btn btn-line btn-sm danger" data-rv="${i}">Remover</button></div></div>`).join('') + '<button class="btn btn-dark btn-sm" id="rv-new">+ Adicionar depoimento</button>';
    $$$('[data-rv]', body).forEach(b => b.onclick = () => { if (!confirm('Remover este depoimento?')) return; C().depoimentos.splice(+b.dataset.rv, 1); CMV.persist(); renderTab(); });
    $('#rv-new').onclick = () => { C().depoimentos.unshift({ nome: '', quando: '', estrelas: 5, chale: accSel, texto: '' }); CMV.persist(); renderTab(); };
  }

  /* ================= sistema ================= */
  function tSys(body) {
    body.innerHTML = `<div class="card" style="max-width:640px"><h3 style="font-size:1.7rem;margin-bottom:8px">Backup e restauração</h3>
      <p class="hint">Baixe uma cópia de segurança de todo o conteúdo (textos, preços, calendários, fotos e solicitações) ou restaure uma cópia anterior.</p>
      <div class="pf"><div class="btns"><button class="btn btn-dark btn-sm" id="sy-exp">Baixar backup</button>
        <label class="up" style="background:#fff;color:var(--dark-text);border:1px solid #1d2b2528">Restaurar de um backup<input type="file" accept="application/json" id="sy-imp"></label></div>
        <div class="btns" style="margin-top:14px"><button class="btn btn-line btn-sm danger" id="sy-reset">Voltar ao conteúdo original da prévia</button></div></div>
      ${Store.mode === 'local' ? '<p class="hint" style="margin-top:18px">Modo de teste: os dados vivem só neste navegador. Limpar os dados do navegador apaga as alterações.</p>' : ''}</div>`;
    $('#sy-exp').onclick = async () => {
      const blob = new Blob([JSON.stringify({ content: C(), requests: CMV.REQ }, null, 1)], { type: 'application/json' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `backup-chales-monte-verde-${TODAY}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    };
    $('#sy-imp').onchange = async e => {
      const f = e.target.files[0]; if (!f) return;
      try {
        const d = JSON.parse(await f.text()); if (!d.content || !d.content.site || !d.content.acomodacoes) throw new Error('Arquivo inválido');
        if (!confirm('Substituir todo o conteúdo atual por este backup?')) return;
        CMV.setContent(d.content); await Store.saveContent(d.content); toast('Backup restaurado'); accSel = null; await enter();
      } catch (err) { toast('Não foi possível restaurar: ' + err.message); }
    };
    $('#sy-reset').onclick = async () => {
      if (!confirm('Descartar todas as alterações e voltar ao conteúdo original da prévia? Fotos enviadas e preços editados serão perdidos.')) return;
      const n = window.makeDefaults(); CMV.setContent(n); await Store.saveContent(n); toast('Conteúdo original restaurado'); accSel = null; await enter();
    };
  }
})();
