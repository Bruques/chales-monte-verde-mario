# Site Chalés Monte Verde

Site estático (HTML, CSS e JavaScript) com painel do proprietário. Hospedado no GitHub Pages.

## Rodar localmente
Dê dois cliques em `index.html`, ou rode `python3 -m http.server` nesta pasta e abra http://localhost:8000.
Painel do proprietário: botão "Área do proprietário" no rodapé (ou `index.html#painel`).
Senha do modo de teste: `monteverde`.

## Avaliações de hóspedes
O visitante envia pelo botão "Deixe sua avaliação"; ela fica **pendente** e só aparece no site depois de aprovada no
painel (aba Depoimentos). Campo-isca e intervalo de 60 s contra robôs. No Firebase, a regra do Firestore deve permitir
que qualquer visitante apenas **crie** avaliações com `status: 'pendente'` (sem ler, editar ou apagar), e só o
proprietário autenticado aprove/apague.

## Estrutura
- `js/defaults.js`: conteúdo inicial (textos, preços de exemplo, fotos). Ao mudar, aumente `DEFAULTS_VERSION`.
- `js/store-local.js`: dados salvos no navegador (modo teste).
  Para o Firebase, criar `store-firebase.js` com a mesma interface (`Store.load`, `saveContent`, `loadRequests`,
  `addRequest`, `updateRequest`, `deleteRequest`, `uploadImage`, `auth`) e trocar o script no `index.html`.
- `js/config.js`: configuração (modo de armazenamento, dados do Firebase e a chave `editarFotos`).
- `img/`: fotos do site.

## Edição de fotos (desativada por enquanto)
A troca de fotos pelo painel está implementada, mas **escondida**: a troca de fotos é oferecida como serviço à parte.
Para trocar uma foto, substitua o arquivo em `img/<hospedagem>/` mantendo o nome (ou edite os caminhos em
`js/defaults.js`) e publique.

Para liberar a edição pelo painel, altere em `js/config.js`:

```js
window.CMV_CONFIG = { store: 'local', firebase: null, editarFotos: true };
```

Com isso aparecem a aba "Fotos do site" e a seção "Fotos" dentro de cada hospedagem (enviar, reordenar, definir
capa, remover). Em produção as imagens precisam de um serviço de armazenamento (por exemplo Cloudinary no plano
gratuito), pois o plano gratuito do Firebase não inclui o Cloud Storage para projetos novos.

## Responsivo e mobile-first
O site deve funcionar bem em celulares (320 a 430 px) e o painel também. Ao mexer no layout, conferir que não há
rolagem horizontal nem elementos cortados: itens de grid com `min-width:0`, linhas de botões com `flex-wrap`, textos
longos que quebram e botões com pelo menos 44 px. Dica de teste: `python3 -m http.server` e uma página com
`<iframe style="width:390px">` (o Chrome em janela estreita não passa de ~500 px).

## Pendências para a versão final
- Ligar o Firebase (Firestore + Authentication) com login do proprietário.
- Trocar WhatsApp, e-mail, preços, horários e políticas de exemplo pelos dados reais, e desligar a faixa de prévia
  (painel, em Textos e contato).
- Trocar as fotos por originais em alta resolução.
