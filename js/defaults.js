/* Conteúdo inicial do site. Tudo aqui é editável pelo painel do proprietário.
   Valores de preço, WhatsApp e horários são FICTÍCIOS (prévia). */
window.DEFAULTS_VERSION = 2;

window.makeDefaults = function () {
  const pad = n => String(n).padStart(2, '0');
  const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const inDays = n => { const d = new Date(); d.setDate(d.getDate() + n); return iso(d); };
  // noites ocupadas de exemplo (para o calendário não aparecer vazio na prévia)
  const ocupar = faixas => { const o = {}; faixas.forEach(([a, b]) => { for (let i = a; i <= b; i++) o[inDays(i)] = 'manual'; }); return o; };
  const ph = (pasta, itens) => itens.map(([n, leg]) => ({ src: `img/${pasta}/${n}.jpg`, leg }));

  return {
    versao: window.DEFAULTS_VERSION,
    site: {
      nome: 'Chalés Monte Verde',
      nomeCurto: 'Chalés Monte Verde',
      faixaPrevia: true,
      whatsapp: '5535999990000',
      whatsappExibicao: '(35) 99999-0000',
      email: 'contato@exemplo.com.br',
      instagram: '',
      endereco: 'Monte Verde, Camanducaia · MG',
      enderecoLinha2: 'Endereço completo enviado após a confirmação da reserva',
      lat: -22.867969740572715,
      lng: -46.020529465989895,
      checkin: '14:00',
      checkout: '12:00',
      aceitaPet: true,
      politicaPet: 'Aceitamos pets. Avise no pedido de reserva (regra de exemplo, ajuste no painel).',
      cancelamento: 'Cancelamento gratuito até 7 dias antes do check-in.',
      pagamento: 'Sinal de 30% para garantir a reserva; o restante no check-in.',
      heroImg: 'img/geral/aerea.jpg',
      finalImg: 'img/chale-bordeaux/03.jpg',
      heroEyebrow: 'Monte Verde · Minas Gerais',
      heroTitulo: 'Entre araucárias, o *silêncio* da serra',
      heroSub: 'O Chalé Master para até 12 pessoas e três chalés para casais, imersos na natureza de Monte Verde. Lareira, pôr do sol e céu estrelado.',
      heroBarra: [
        ['4 hospedagens', 'chalés e Chalé Master'],
        ['Casais ou grupos', 'de 2 a 12 pessoas'],
        ['Estacionamento', 'gratuito no local'],
        ['Reserva direta', 'com os anfitriões']
      ],
      faixa: ['Araucárias', 'Lareira', 'Céu estrelado', 'Pássaros e esquilos', 'Hidromassagem', 'Pôr do sol', 'Silêncio', 'Monte Verde'],
      sobreEyebrow: 'O lugar',
      sobreTitulo: 'Um recanto entre as *araucárias*',
      sobreParagrafos: [
        'Em Monte Verde, cada época do ano traz cores e belezas próprias. Aqui, longe da poluição dos grandes centros, você acompanha o pôr do sol, o céu estrelado e o luar, e acorda ao som dos pássaros silvestres.',
        'No mesmo terreno há o Chalé Master, para até 12 pessoas, e três chalés para casais, todos entre araucárias, pássaros e esquilos, com estacionamento privativo dentro da propriedade.',
        'Para manter a diária mais leve, não oferecemos café da manhã nem roupa de cama e banho: você leva a sua. Fornecemos travesseiros, edredons e cobertores.'
      ],
      sobreAssinatura: 'Mário Bonafé Jr.',
      sobreFotoA: 'img/casa/05.jpg',
      sobreFotoB: 'img/chale-cote-dazur/01.jpg',
      fotosGerais: [{ src: 'img/geral/aerea.jpg', leg: 'Vista aérea da propriedade' }],
      faixaExtra: [['Wi-Fi (Starlink)', '100 mbps']],
      numeros: [
        { valor: 4, rotulo: 'hospedagens' }
      ],
      comodidadesTitulo: 'Em todas as hospedagens',
      comodidades: [
        { ic: 'car', t: 'Estacionamento gratuito', d: 'Vagas privativas dentro do terreno, para todos os hóspedes.' },
        { ic: 'wifi', t: 'Wi-Fi', d: 'Internet em todas as hospedagens.' },
        { ic: 'flame', t: 'Lareira e aquecimento', d: 'Lareira a lenha e aquecedores para as noites frias da serra.' },
        { ic: 'tv', t: 'TV com canais', d: 'TV com canais via satélite. Leve suas senhas de streaming.' },
        { ic: 'utensils', t: 'Cozinha equipada', d: 'Louças, talheres, micro-ondas, fogão ou cooktop e frigobar.' },
        { ic: 'coffee', t: 'Cafeteira de cápsulas', d: 'Nespresso nas cozinhas do Chalé Master e dos chalés Côte d\'Azur e Bordeaux.' },
        { ic: 'bath', t: 'Banheira de hidromassagem', d: 'Nos chalés Côte d\'Azur e Bordeaux. O Chalé Master tem banheira de imersão.' },
        { ic: 'shield', t: 'Segurança', d: 'Câmeras na área externa, detectores de fumaça e de monóxido de carbono.' }
      ],
      regras: [
        'Check-in a partir das 14:00 e check-out até as 12:00.',
        'Não fornecemos café da manhã nem roupa de cama e banho (travesseiros, edredons e cobertores são fornecidos).',
        'Chalés para casais: mínimo de 2 pessoas. A pedido, instalamos uma cama pequena ou berço.',
        'Chalé Master: de 1 a 12 hóspedes (valor calculado para 5 pessoas).',
        'Chalé Master e Chalé Paris: descontos para estadias semanais e mensais. Fale com a gente.'
      ],
      localTitulo: 'Como *chegar*',
      localLead: 'Estamos em Monte Verde, distrito de Camanducaia (MG), na Serra da Mantiqueira. O centro fica a poucos minutos de carro.',
      finalTitulo: 'Sua próxima *pausa* na serra',
      depoimentosTitulo: 'Quem já passou por aqui',
      depoimentosLead: 'Relatos de hóspedes que se hospedaram no Chalé Master e nos chalés.'
    },

    acomodacoes: [
      {
        id: 'casa', status: 'ativo', nome: 'Chalé Master', tipo: 'Chalé para famílias e grupos', faixaSub: 'para 1 a 12 hóspedes',
        resumo: 'Três quartos, sala com lareira, cozinha completa e área de lazer com churrasqueira, para até 12 pessoas.',
        descricao: [
          'Casa ampla, cercada por jardins e árvores, com acomodação para até 12 pessoas e possibilidade de instalar mais um berço ou cama para crianças nos quartos de casal.',
          'A sala tem lareira, sofás e Smart TV com canais via satélite. A cozinha é completa para preparar as refeições do grupo, e a área de lazer reúne churrasqueira e ilha gourmet com pia.'
        ],
        destaques: [
          'Quarto com cama de casal Queen, banheiro com banheira de imersão e varanda',
          'Quarto para 4 hóspedes (cama de casal e bicama), com banheiro e varanda',
          'Quarto para 6 hóspedes (cama de casal e 2 beliches), com banheiro',
          'Cozinha completa, lavabo, ferro e tábua de passar',
          'Água quente por aquecedor central a gás'
        ],
        capMin: 1, capMax: 12, hospPadrao: 5, camaExtra: false,
        obsPreco: 'Valor da diária calculado para 5 pessoas; aceitamos de 1 a 12 hóspedes.',
        precos: { semana: 1200, fim: 1600, min: 2 },
        comodidades: [
          { ic: 'bed', t: '3 quartos', d: 'Até 12 pessoas, com banheiro em cada quarto.' },
          { ic: 'flame', t: 'Lareira e churrasqueira', d: 'Lareira na sala e churrasqueira na área de lazer.' },
          { ic: 'utensils', t: 'Cozinha completa', d: 'Fogão, forno, geladeira, micro-ondas e utensílios.' },
          { ic: 'coffee', t: 'Nespresso', d: 'Cafeteira de cápsulas na cozinha.' },
          { ic: 'wifi', t: 'Wi-Fi 100 Mbps', d: 'Internet rápida na casa toda.' },
          { ic: 'bath', t: 'Banheira', d: 'Banheira de imersão em um dos quartos.' },
          { ic: 'car', t: 'Estacionamento', d: 'Privativo para a casa.' },
          { ic: 'mountain', t: 'Vista para as montanhas', d: 'Varandas voltadas para a mata.' },
          { ic: 'shield', t: 'Segurança', d: 'Alarme, iluminação externa e câmeras no estacionamento.' }
        ],
        fotos: ph('casa', [
          ['01', 'Fachada da casa'], ['09', 'Quarto com banheira'], ['11', 'Quarto de casal'], ['10', 'Quarto com beliches'],
          ['12', 'Cozinha'], ['08', 'Lavabo'], ['02', 'Churrasqueira e ilha gourmet'], ['03', 'Área de lazer'],
          ['07', 'Varanda'], ['06', 'Jardim'], ['05', 'Gramado e araucárias'], ['04', 'Portão de entrada']
        ]),
        ocupado: ocupar([[5, 8], [19, 21], [33, 36], [47, 49]]), especial: {}
      },
      {
        id: 'cote-dazur', status: 'ativo', nome: 'Chalé Côte d\'Azur', tipo: 'Chalé para casais', faixaSub: 'para casais',
        resumo: 'Chalé com varanda, lareira e banheira de hidromassagem, entre as araucárias.',
        descricao: [
          'Chalé para casais com varanda, lareira, TV com canais via satélite e um amplo banheiro com banheira de hidromassagem, secador de cabelos e toalheiro elétrico.',
          'Mini-copa e cozinha com pia, frigobar, cafeteira Nespresso, micro-ondas e cooktop a gás. A pedido, instalamos mais um berço ou cama extra para crianças.'
        ],
        destaques: ['Banheira com hidromassagem', 'Lareira a lenha e lareira externa', 'Quintal privativo', 'Casa de um piso, sem escadas'],
        capMin: 2, capMax: 2, camaExtra: true,
        obsPreco: 'Valor para o casal. Cama ou berço extra para criança sob pedido.',
        precos: { semana: 380, fim: 520, min: 2 },
        comodidades: [
          { ic: 'bath', t: 'Hidromassagem', d: 'Banheira de hidromassagem no banheiro.' },
          { ic: 'flame', t: 'Lareira', d: 'Lareira interna a lenha e lareira externa.' },
          { ic: 'tv', t: 'TV via satélite', d: 'TV LED com canais por satélite.' },
          { ic: 'coffee', t: 'Nespresso', d: 'Cafeteira para cápsulas na cozinha.' },
          { ic: 'utensils', t: 'Cozinha', d: 'Cooktop, micro-ondas, frigobar e utensílios.' },
          { ic: 'wifi', t: 'Wi-Fi', d: 'Internet disponível no chalé.' },
          { ic: 'mountain', t: 'Vista para as montanhas', d: 'Varanda com vista panorâmica.' },
          { ic: 'car', t: 'Estacionamento', d: 'Gratuito no local.' }
        ],
        fotos: ph('chale-cote-dazur', [['01', 'Chalé entre as araucárias'], ['02', 'Lateral do chalé'], ['03', 'Sala com lareira'], ['05', 'Banheira de hidromassagem']]),
        ocupado: ocupar([[3, 5], [12, 14], [26, 28], [40, 43]]), especial: {}
      },
      {
        id: 'bordeaux', status: 'ativo', nome: 'Chalé Bordeaux', tipo: 'Chalé para casais', faixaSub: 'para casais',
        resumo: 'Chalé aconchegante com lareira, hidromassagem e cozinha, cercado de mata.',
        descricao: [
          'Chalé para casais com varanda, lareira, aquecedor de ambiente, TV com canais via satélite e banheiro amplo com banheira de hidromassagem, secador de cabelos e toalheiro elétrico.',
          'Cozinha com pia, frigobar, cafeteira Nespresso, micro-ondas e cooktop a gás. Há espaço de trabalho e, a pedido, cama ou berço extra.'
        ],
        destaques: ['Banheira com hidromassagem', 'Lareira que funciona muito bem (segundo os hóspedes)', 'Espaço de trabalho exclusivo', 'Cercado de árvores e jardim'],
        capMin: 2, capMax: 2, camaExtra: true,
        obsPreco: 'Valor para o casal. Cama ou berço extra para criança sob pedido.',
        precos: { semana: 400, fim: 540, min: 2 },
        comodidades: [
          { ic: 'bath', t: 'Hidromassagem', d: 'Banheira de hidromassagem com ducha.' },
          { ic: 'flame', t: 'Lareira e aquecedor', d: 'Lareira interna e aquecedor de ambiente.' },
          { ic: 'tv', t: 'TV via satélite', d: 'TV LED com canais por satélite.' },
          { ic: 'coffee', t: 'Nespresso', d: 'Cafeteira para cápsulas.' },
          { ic: 'utensils', t: 'Cozinha', d: 'Cooktop, micro-ondas, frigobar e utensílios.' },
          { ic: 'laptop', t: 'Espaço de trabalho', d: 'Wi-Fi e mesa para trabalhar.' },
          { ic: 'mountain', t: 'Vista para as montanhas', d: 'Vista panorâmica.' },
          { ic: 'car', t: 'Estacionamento', d: 'Gratuito no local.' }
        ],
        fotos: ph('chale-bordeaux', [['03', 'Chalé entre as araucárias'], ['01', 'Fachada do chalé'], ['05', 'Quarto'], ['06', 'Banheira de hidromassagem'], ['08', 'Cozinha e mesa'], ['07', 'Cozinha'], ['02', 'Jardim com fogueira']]),
        ocupado: ocupar([[8, 10], [22, 24], [31, 33], [55, 58]]), especial: {}
      },
      {
        id: 'paris', status: 'ativo', nome: 'Chalé Paris', tipo: 'Chalé para casais', faixaSub: 'para casais',
        resumo: 'Chalé de tijolinho e madeira, com lareira, perto do centro e com desconto para estadias longas.',
        descricao: [
          'Chalé para casais com varanda, lareira, aquecedor, TV com canais via satélite e amplo banheiro com secador de cabelos e toalheiro elétrico. O quarto tem paredes de tijolinho e teto de madeira aparente.',
          'Mini-copa e cozinha com pia, frigobar, cafeteira, micro-ondas e cooktop a gás. A pedido, instalamos mais um berço ou cama extra.'
        ],
        destaques: ['Lareira a lenha', 'Espaço de trabalho exclusivo', 'Descontos para estadias semanais e mensais', 'Aceita estadias de 28 dias ou mais'],
        capMin: 2, capMax: 2, camaExtra: true,
        obsPreco: 'Valor para o casal. Descontos para estadias semanais ou mensais.',
        precos: { semana: 360, fim: 480, min: 2 },
        comodidades: [
          { ic: 'flame', t: 'Lareira', d: 'Lareira interna a lenha e aquecedor portátil.' },
          { ic: 'tv', t: 'TV via satélite', d: 'TV LED com canais por satélite.' },
          { ic: 'utensils', t: 'Cozinha', d: 'Cooktop, micro-ondas, frigobar e utensílios.' },
          { ic: 'coffee', t: 'Cafeteira', d: 'Para o café da manhã que você trouxer.' },
          { ic: 'laptop', t: 'Espaço de trabalho', d: 'Wi-Fi e mesa exclusiva.' },
          { ic: 'mountain', t: 'Vista para as montanhas', d: 'Vista panorâmica.' },
          { ic: 'key', t: 'Estadias longas', d: 'Aceita 28 dias ou mais, com desconto.' },
          { ic: 'car', t: 'Estacionamento', d: 'Gratuito no local.' }
        ],
        fotos: ph('chale-paris', [['01', 'Fachada do chalé'], ['02', 'Quarto'], ['03', 'Sala e espaço de trabalho']]),
        ocupado: ocupar([[6, 7], [16, 18], [29, 31], [44, 46]]), especial: {}
      },
      {
        id: 'novo-1', status: 'embreve', faixaSub: '', nome: 'Novo chalé', tipo: 'Em construção',
        resumo: 'Mais um chalé para casais a caminho. Em breve, aqui.',
        descricao: [], destaques: [], capMin: 2, capMax: 2, camaExtra: true, obsPreco: '',
        precos: { semana: null, fim: null, min: 2 }, comodidades: [], fotos: [], ocupado: {}, especial: {}
      },
      {
        id: 'novo-2', status: 'embreve', faixaSub: '', nome: 'Novo chalé', tipo: 'Em construção',
        resumo: 'Mais um chalé para casais a caminho. Em breve, aqui.',
        descricao: [], destaques: [], capMin: 2, capMax: 2, camaExtra: true, obsPreco: '',
        precos: { semana: null, fim: null, min: 2 }, comodidades: [], fotos: [], ocupado: {}, especial: {}
      }
    ],

    guia: {
      titulo: 'Aproveite *Monte Verde*',
      lead: 'Sugestões de passeios, o calendário de eventos da cidade e o que vem por aí. Nossa equipe pode indicar roteiros e horários.',
      atracoes: [
        { cat: 'Natureza e trilhas', nome: 'Pedra Redonda', texto: 'Trilha curta até um mirante com vista panorâmica da Serra da Mantiqueira.', link: '' },
        { cat: 'Natureza e trilhas', nome: 'Pedra do Cachorro', texto: 'Mirante com vistas panorâmicas da região e trilhas em meio à natureza.', link: '' },
        { cat: 'Natureza e trilhas', nome: 'Cachoeira dos Pretos', texto: 'Uma das maiores cachoeiras da região, boa para banho e piquenique. Fica a cerca de 30 km do centro.', link: '' },
        { cat: 'Aventura', nome: 'Tirolesas, quadriciclos, jipes e cavalgadas', texto: 'Passeios de aventura e contato com a natureza para toda a família.', link: '' },
        { cat: 'Aventura', nome: 'Patinação no gelo e Ice Bar', texto: 'Atrações geladas no meio da serra: pista de patinação e um bar feito de gelo.', link: '' },
        { cat: 'Gastronomia', nome: 'Avenida Monte Verde', texto: 'O coração do distrito: restaurantes, cafeterias, chocolates quentes, fondue e lojinhas de artesanato.', link: '' },
        { cat: 'Gastronomia', nome: 'Cervejas artesanais', texto: 'Monte Verde tem cervejarias com visitação e degustação, como a Fritz.', link: '' },
        { cat: 'Compras e passeios', nome: 'Orquidário e lojas', texto: 'Orquidário com espécies raras e comércio de artesanato, malhas e produtos locais.', link: '' }
      ],
      eventos: [
        { ini: '2026-01-01', fim: '2026-02-02', nome: 'Natal nas Montanhas: Contando histórias do Advento / Tempo de Esperança', nota: 'Decoração natalina, apresentações artísticas e musicais' },
        { ini: '2026-01-09', fim: '2026-01-09', nome: 'Pedal Luz', nota: 'Passeio de bike noturno' },
        { ini: '2026-02-22', fim: '2026-02-22', nome: 'Esporte nas Montanhas', nota: 'Passeio de bike e corrida, adulto e kids' },
        { ini: '2026-03-01', fim: '2026-04-05', nome: 'Páscoa nas Montanhas', nota: 'Decoração temática e espaços instagramáveis' },
        { ini: '2026-04-11', fim: '2026-04-11', nome: '7 Picos: Corrida nas Montanhas', nota: 'Competição' },
        { ini: '2026-04-17', fim: '2026-04-17', nome: '1ª Etapa Copa Kids', nota: 'Trail Running e MTB' },
        { ini: '2026-04-26', fim: '2026-04-26', nome: 'Clássicos nas Montanhas 2026', nota: 'Exposição de carros antigos e shows' },
        { ini: '2026-05-14', fim: '2026-06-20', nome: 'Amor nas Montanhas', nota: 'Decoração temática' },
        { ini: '2026-06-27', fim: '2026-08-02', nome: 'Inverno nas Montanhas', nota: 'Apresentações artísticas' },
        { ini: '2026-08-23', fim: '2026-08-23', nome: 'Tour na Roça 2026', nota: 'Competição de bike' },
        { ini: '2026-08-28', fim: '2026-08-30', nome: 'Monte Verde Bike Fest 2026', nota: 'Encontro de motos com shows' },
        { ini: '2026-09-01', fim: '2026-09-27', nome: 'Gastronomia nas Montanhas', nota: 'Participantes do Prepara Gastronomia' },
        { ini: '2026-09-06', fim: '2026-09-06', nome: 'Corrida Bauer', nota: 'Competição' },
        { ini: '2026-09-12', fim: '2026-09-12', nome: '3ª edição Circuito Corrida Cervejeira', nota: 'Passeio' },
        { ini: '2026-09-25', fim: '2026-09-27', nome: 'Feira Gastronômica', nota: 'Stands, cozinha show e shows musicais' },
        { ini: '2026-09-27', fim: '2026-09-27', nome: '2ª Etapa Copa Kids', nota: 'Trail Running e MTB' },
        { ini: '2026-10-02', fim: '2026-10-11', nome: 'Semana Bauer', nota: 'Arte e cultura' },
        { ini: '2026-10-16', fim: '2026-10-18', nome: 'Monte Verde Fest Car', nota: 'Encontro de carros rebaixados' },
        { ini: '2026-10-18', fim: '2026-10-18', nome: '2º Pedal nas Montanhas', nota: 'Competição MTB' },
        { ini: '2026-11-08', fim: '2026-11-08', nome: '3ª Etapa Copa Kids', nota: 'Trail Running e MTB em Camanducaia' },
        { ini: '2026-11-13', fim: '2027-01-31', nome: 'Natal nas Montanhas: Contando histórias', nota: 'Decoração natalina, apresentações artísticas e musicais' },
        { ini: '2026-11-16', fim: '2026-11-18', nome: '2ª Feira Nacional dos Destinos Turísticos de Montanha e Inverno e 4º Seminário Move de Desenvolvimento Sustentável do Turismo de Monte Verde', nota: '' }
      ],
      eventosFonte: { texto: 'Fonte: calendário de eventos 2026 de Monte Verde (monteverde.org.br)', link: 'https://monteverde.org.br/wp-content/uploads/2026/01/CALENDARIO-MV-26.pdf' },
      futuras: [
        { nome: 'Park Pulso', texto: 'Futura atração em Monte Verde. Veja o vídeo.', link: 'https://www.tiktok.com/@parkpulso/video/7684355968251055380' }
      ]
    },

    depoimentos: [
      { nome: 'Lidiane', quando: 'agosto de 2026', estrelas: 5, chale: 'cote-dazur', texto: 'Dei de presente de aniversário para meu esposo um final de semana em Monte Verde e o chalé só acrescentou, e muito, na nossa experiência. Supera as expectativas do anúncio, o entorno da residência é uma delícia e todos foram extremamente gentis e atenciosos.' },
      { nome: 'Flávia', quando: '', estrelas: 5, chale: 'cote-dazur', texto: 'Estadia maravilhosa! O chalé é maravilhoso, aconchegante, o lugar onde ele fica então, sem defeitos. As instruções são completas e didáticas. Fui comemorar meu aniversário e foi um dos melhores que já tive!' },
      { nome: 'Ingrid', quando: 'julho de 2026', estrelas: 5, chale: 'cote-dazur', texto: 'Estive hospedada com meu esposo durante 4 dias, foi uma experiência incrível, lugar maravilhoso, muito tranquilo, fácil acesso, chalé muito aconchegante.' },
      { nome: 'Caroline', quando: 'setembro de 2026', estrelas: 5, chale: 'paris', texto: 'Excelente estadia. O chalé tem uma ótima localização e um ambiente muito agradável e aconchegante. Fomos muito bem atendidos e recebemos dicas que fizeram a diferença na viagem.' },
      { nome: 'Maycon', quando: 'maio de 2026', estrelas: 5, chale: 'paris', texto: 'Excelente acomodação, confortável, espaço super limpo, cama boa, banheiro espaçoso. O espaço tem mais chalés na chácara e nenhum interfere com o outro, o que torna a estadia ainda mais agradável. O centro é perto.' },
      { nome: 'Edna', quando: 'junho de 2026', estrelas: 5, chale: 'paris', texto: 'Adoramos o lugar. Local tranquilo, sem barulho, literalmente para quem procura descanso.' },
      { nome: 'Leonardo', quando: '', estrelas: 5, chale: 'bordeaux', texto: 'Tudo como descrito, impecável e a lareira sem palavras, uma das poucas que funciona de verdade.' },
      { nome: 'Maria Eduarda', quando: 'agosto de 2026', estrelas: 5, chale: 'bordeaux', texto: 'Ficamos 6 dias hospedados, experiência incrível, muito bem localizado, muitas árvores, a casa tinha tudo que eu precisava, fácil e prático. Com toda certeza voltaria mais vezes.' },
      { nome: 'João', quando: 'agosto de 2026', estrelas: 5, chale: 'bordeaux', texto: 'O lugar é muito aconchegante, tranquilo e perfeito para descansar e aproveitar o clima da cidade. Tudo estava bem organizado e o ambiente combina com a proposta de Monte Verde.' },
      { nome: 'Marta', quando: 'junho de 2026', estrelas: 5, chale: 'casa', texto: 'Local acolhedor, tudo limpo e perfeito, foi ótimo os dias que passamos. Estávamos em 7, mas a casa acomoda fácil umas 10 ou 11 pessoas.' },
      { nome: 'Alessandra', quando: 'dezembro de 2025', estrelas: 5, chale: 'casa', texto: 'Casa muito boa, maior do que parece pelas fotos. Cozinha bem equipada. Local lindo, todo arborizado. Ótimo custo-benefício.' },
      { nome: 'Ana Carolina', quando: 'setembro de 2026', estrelas: 5, chale: 'casa', texto: 'Casa ampla e aconchegante, correspondia à descrição. Fomos muito bem recebidos.' }
    ]
  };
};
