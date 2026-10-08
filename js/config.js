/* Configuração do site. No modo local nada precisa ser preenchido.
   Ao ligar o Firebase, os dados do projeto entram aqui e store-local.js é trocado por store-firebase.js.
   editarFotos: false esconde do painel a troca de fotos (oferecida como serviço à parte).
   googleReviewUrl: link de avaliação do Google do negócio (o botão "Avalie no Google" só aparece se estiver preenchido).
   abasPainel: abas do painel do proprietário. Opções: t-req, t-cal, t-price, t-acc, t-photos, t-text, t-guia, t-rev, t-sys. */
window.CMV_CONFIG = {
  store: 'local',
  firebase: null,
  editarFotos: false,
  googleReviewUrl: '',
  abasPainel: ['t-req', 't-cal', 't-price']
};
