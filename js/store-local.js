/* Camada de dados em MODO LOCAL (teste): tudo fica no navegador (IndexedDB, com fallback para localStorage).
   Para ligar o Firebase, basta trocar este arquivo por store-firebase.js, que expõe a MESMA interface:
     Store.load()                  -> conteúdo (site, acomodacoes, depoimentos) ou null
     Store.saveContent(c)          -> grava o conteúdo (somente proprietário)
     Store.loadRequests()          -> lista de solicitações (somente proprietário)
     Store.addRequest(r)           -> cria solicitação (qualquer visitante)
     Store.updateRequest(r)/deleteRequest(id)
     Store.uploadImage(file, pasta)-> devolve a URL da imagem
     Store.auth.login(senha) / logout() / isLogged()
*/
(function () {
  const DB = 'chales-monte-verde', ST = 'kv', LS = 'cmv_';
  let dbp = null;
  const open = () => dbp || (dbp = new Promise((res, rej) => {
    try {
      const r = indexedDB.open(DB, 1);
      r.onupgradeneeded = () => r.result.createObjectStore(ST);
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    } catch (e) { rej(e); }
  }));
  const kvGet = async k => {
    try {
      const db = await open();
      return await new Promise((res, rej) => { const q = db.transaction(ST).objectStore(ST).get(k); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error); });
    } catch (e) {
      try { const v = localStorage.getItem(LS + k); return v ? JSON.parse(v) : undefined; } catch (_) { return undefined; }
    }
  };
  const kvSet = async (k, v) => {
    try {
      const db = await open();
      await new Promise((res, rej) => { const t = db.transaction(ST, 'readwrite'); t.objectStore(ST).put(v, k); t.oncomplete = res; t.onerror = () => rej(t.error); });
    } catch (e) {
      try { localStorage.setItem(LS + k, JSON.stringify(v)); } catch (_) { /* sem armazenamento */ }
    }
  };

  const SENHA_LOCAL = 'monteverde'; // só para o modo de teste; no Firebase vira login por e-mail e senha
  const SESSAO = 'cmv_sessao';

  window.Store = {
    mode: 'local',
    async load() { const c = await kvGet('content'); return c || null; },
    async saveContent(c) { await kvSet('content', c); },
    async loadRequests() { return (await kvGet('requests')) || []; },
    async addRequest(r) { const l = await this.loadRequests(); l.unshift(r); await kvSet('requests', l); },
    async updateRequest(r) { const l = await this.loadRequests(); const i = l.findIndex(x => x.id === r.id); if (i >= 0) l[i] = r; await kvSet('requests', l); },
    async deleteRequest(id) { const l = (await this.loadRequests()).filter(x => x.id !== id); await kvSet('requests', l); },
    // avaliações enviadas pelos hóspedes: ficam pendentes até o proprietário aprovar no painel
    async addReview(r) { const l = (await kvGet('reviews')) || []; l.unshift(r); await kvSet('reviews', l); },
    async loadReviews() { return (await kvGet('reviews')) || []; },
    async deleteReview(id) { const l = ((await kvGet('reviews')) || []).filter(x => x.id !== id); await kvSet('reviews', l); },
    async reset() { await kvSet('content', null); },

    // Reduz a foto no navegador (lado maior 1600 px, JPEG 82%) e devolve como data URL.
    uploadImage(file) {
      return new Promise((res, rej) => {
        const fr = new FileReader();
        fr.onerror = () => rej(fr.error);
        fr.onload = () => {
          const im = new Image();
          im.onerror = () => rej(new Error('Arquivo de imagem inválido'));
          im.onload = () => {
            const k = Math.min(1, 1600 / Math.max(im.width, im.height));
            const c = document.createElement('canvas');
            c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
            c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
            res(c.toDataURL('image/jpeg', 0.82));
          };
          im.src = fr.result;
        };
        fr.readAsDataURL(file);
      });
    },

    auth: {
      isLogged() { try { return sessionStorage.getItem(SESSAO) === '1'; } catch (e) { return false; } },
      async login(senha) {
        if (String(senha).trim().toLowerCase() !== SENHA_LOCAL) throw new Error('Senha incorreta');
        try { sessionStorage.setItem(SESSAO, '1'); } catch (e) { /* ignora */ }
      },
      logout() { try { sessionStorage.removeItem(SESSAO); } catch (e) { /* ignora */ } },
      dica: 'Modo de teste: a senha é "' + SENHA_LOCAL + '".'
    }
  };
})();
