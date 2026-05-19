// Mundo Animal Pet Shop — app.js
// 1. CONFIG
// 2. PRODUTOS[]
// 3. State (Cart) — added in Task 16
// 4. Render — added in Task 8
// 5. WhatsApp builder — added in Task 17
'use strict';

const CONFIG = {
  whatsapp: 'https://wa.me/message/73CP3FMULQTAA1',
  whatsappNumeroDisplay: '(31) 99000-0000', // placeholder até cliente passar
  loja: {
    nome: 'Mundo Animal Pet Shop',
    enderecoCompleto: 'Av. João Pinheiro, 194 — Centro, Itabira/MG',
    tel: '(31) 3831-1702',
    telCall: 'tel:+553138311702',
    instagram: 'mundoanimalitabira',
    instagramUrl: 'https://instagram.com/mundoanimalitabira',
    googleMapsEmbed: 'https://www.google.com/maps?q=Av.+João+Pinheiro,+194,+Itabira,+MG&output=embed',
    googleMapsUrl: 'https://maps.app.goo.gl/?q=Av.+João+Pinheiro,+194,+Itabira',
    horario: 'Seg-Sex 8h-18h · Sáb 8h-13h', // placeholder
    avaliacaoGoogle: { nota: 4.5, total: 48 },
    anosNoMercado: 'X', // placeholder
    cnpj: '00.000.000/0001-00', // placeholder
  },
  freteGratisItabira: true,
  promoMsgPadrao: {
    banhoTosa: 'Olá! Quero agendar Banho & Tosa para meu pet com busca em casa.',
    vacinas:   'Olá! Quero agendar Vacinação para meu pet.',
    galinhas:  'Olá! Quero saber sobre galinhas Brahma.',
    duvida:    'Olá! Tenho uma dúvida sobre os produtos.',
  },
};

const PRODUTOS = [
  {
    id: "powerdog-premium-carne",
    nome: "PowerDog Premium Carne",
    categoria: "Cães",
    peso: "15kg",
    preco: 130,
    precoOriginal: 145,
    imagem: "assets/produtos/powerdog.jpg",
    descricao: "Ração Super Premium para cães adultos de todas as raças. Alimento de alta performance com sabor irresistivel de carne, formulado pela ProLine com niveis nutricionais que superam padroes AAFCO, FEDIAF e ABINPet."
  },
  {
    id: "powerdog-premium-carne-2",
    nome: "PowerDog Premium Carne",
    categoria: "Cães",
    peso: "25kg",
    preco: 190,
    precoOriginal: 237.5,
    imagem: "assets/produtos/powerdog.jpg",
    descricao: "Ração Super Premium para cães adultos de todas as raças. Alimento de alta performance com sabor irresistivel de carne, formulado pela ProLine com niveis nutricionais que superam padroes AAFCO, FEDIAF e ABINPet."
  },
  {
    id: "colosso-premium-filhotes-frango-arroz",
    nome: "Colosso Premium Filhotes Frango & Arroz",
    categoria: "Cães",
    peso: "10,1kg",
    preco: 130,
    precoOriginal: 145,
    imagem: "assets/produtos/colosso-filhotes.jpg",
    descricao: "Alimento completo para o desenvolvimento de filhotes de todas as raças. A nutrição certa pra primeira fase da vida do seu cachorro, sem corantes e aromatizantes artificiais."
  },
  {
    id: "colosso-premium-filhotes-carne-arroz",
    nome: "Colosso Premium Filhotes Carne & Arroz",
    categoria: "Cães",
    peso: "10,1kg",
    preco: 130,
    precoOriginal: 145,
    imagem: "assets/produtos/colosso-filhotes.jpg",
    descricao: "Alimento completo para o desenvolvimento de filhotes de todas as raças. A nutrição certa pra primeira fase da vida do seu cachorro, sem corantes e aromatizantes artificiais."
  },
  {
    id: "canismax-racao-premium-frango-arroz",
    nome: "CANISMAX Ração Premium Frango & Arroz",
    categoria: "Cães",
    peso: "15kg",
    preco: 90,
    precoOriginal: 99,
    imagem: "assets/produtos/canismax.jpg",
    descricao: "Alimento completo para cães adultos de todas as raças. A escolha equilibrada para o dia a dia do seu melhor amigo. Formulada com proteínas e carboidratos de qualidade, sem corantes nem aromatizantes artificiais.",
    destaque: "MAIS_PEDIDO"
  },
  {
    id: "purina-dog-chow-extralife",
    nome: "Purina Dog Chow ExtraLife",
    categoria: "Cães",
    peso: "15kg",
    preco: 200,
    precoOriginal: 220,
    imagem: "assets/produtos/purina-dog-chow.jpg",
    descricao: "Para cães adultos de raças mini e pequenas (Poodle, Shih Tzu, Yorkshire, Maltes, Pinscher, Lhasa). A linha que pode adicionar ate 1,8 anos a mais de vida saudável ao seu cao. 100% completa e balanceada, sem corantes artificiais.",
    destaque: "MAIS_PEDIDO"
  },
  {
    id: "guabi-natural-frango-arroz-integral",
    nome: "Guabi Natural Frango & Arroz Integral",
    categoria: "Cães",
    peso: "2,5kg",
    preco: 120,
    precoOriginal: 135,
    imagem: "assets/produtos/guabi-natural.jpg",
    descricao: "Super Premium Natural para cães adultos de raças mini e pequenas. Nutrição funcional com ingredientes naturais selecionados. Composicao: 60% origem animal + 35% cereais integrais + 5% vegetais e frutas."
  },
  {
    id: "colosso-premium-gatos-frango-arroz",
    nome: "Colosso Premium Gatos Frango & Arroz",
    categoria: "Gatos",
    peso: "10,1kg",
    preco: 130,
    precoOriginal: 145,
    imagem: "assets/produtos/colosso-gatos-premium.jpg",
    descricao: "Alimento completo para todas as fases da vida do seu gato. Nutrição equilibrada para gatas em gestação/lactação, filhotes e adultos de todas as raças. Sem corantes e aromatizantes artificiais."
  },
  {
    id: "colosso-premium-gatos-salmao-arroz",
    nome: "Colosso Premium Gatos Salmao & Arroz",
    categoria: "Gatos",
    peso: "10,1kg",
    preco: 130,
    precoOriginal: 145,
    imagem: "assets/produtos/colosso-gatos-premium.jpg",
    descricao: "Alimento completo para todas as fases da vida do seu gato. Nutrição equilibrada para gatas em gestação/lactação, filhotes e adultos de todas as raças. Com oleo de salmao. Sem corantes e aromatizantes artificiais."
  },
  {
    id: "colosso-premium-gatos-castrados-carne",
    nome: "Colosso Premium Gatos Castrados Carne",
    categoria: "Gatos",
    peso: "10,1kg",
    preco: 130,
    precoOriginal: 145,
    imagem: "assets/produtos/colosso-gatos-premium.jpg",
    descricao: "Formulaçao especifica para gatos adultos castrados. Apos a castraçao, o metabolismo muda. Essa formula e pensada para manter o peso ideal e proteger o trato urinário — pontos criticos pra essa fase."
  },
  {
    id: "colosso-premium-gatos-castrados-salmao",
    nome: "Colosso Premium Gatos Castrados Salmao",
    categoria: "Gatos",
    peso: "10,1kg",
    preco: 130,
    precoOriginal: 145,
    imagem: "assets/produtos/colosso-gatos-premium.jpg",
    descricao: "Formulaçao especifica para gatos adultos castrados. Apos a castraçao, o metabolismo muda. Essa formula e pensada para manter o peso ideal e proteger o trato urinário. Com sabor salmao."
  },
  {
    id: "colosso-premium-gatos-castrados-frango",
    nome: "Colosso Premium Gatos Castrados Frango",
    categoria: "Gatos",
    peso: "10,1kg",
    preco: 130,
    precoOriginal: 145,
    imagem: "assets/produtos/colosso-gatos-premium.jpg",
    descricao: "Formulaçao especifica para gatos adultos castrados. Formula balanceada com fibras e prebióticos que auxiliam no controle de peso e saúde urinária."
  },
  {
    id: "purina-cat-chow-adultos-defense-plus-carne",
    nome: "Purina Cat Chow Adultos Defense Plus Carne",
    categoria: "Gatos",
    peso: "10,1kg",
    preco: 180,
    precoOriginal: 195,
    imagem: "assets/produtos/purina-cat-chow-adultos.jpg",
    descricao: "Alimento Premium Especial para gatos adultos a partir de 1 ano. 100% completo e balanceado, sem corantes e sabores artificiais. Formulado pela Nestle Purina com tecnologia exclusiva Defense Plus."
  },
  {
    id: "purina-cat-chow-castrados-defense-plus-frango",
    nome: "Purina Cat Chow Castrados Defense Plus Frango",
    categoria: "Gatos",
    peso: "10,1kg",
    preco: 180,
    precoOriginal: 195,
    imagem: "assets/produtos/purina-cat-chow-castrados.jpg",
    descricao: "Alimento Premium Especial formulado para as necessidades de gatos castrados. Linha pensada pra quem quer o melhor da Nestle Purina pro gato apos a castraçao.",
    destaque: "MAIS_PEDIDO"
  },
  {
    id: "purina-friskies-sache",
    nome: "Purina Friskies Sache",
    categoria: "Gatos",
    peso: "85g",
    preco: 5,
    precoOriginal: null,
    imagem: "assets/produtos/purina-friskies.jpg",
    descricao: "Alimento Umido Premium Especial — 100% completo e balanceado. Pedaços macios e suculentos ao molho. Sabores: Carne, Frango, Atum, Salmao, Peixe Branco, Cordeiro e Peru. Promocao: 3 por R$ 10,00."
  },
  {
    id: "absorcat-colosso-granulado-higienico",
    nome: "AbsorCat Colosso Granulado Higiênico",
    categoria: "Gatos",
    peso: "2kg",
    preco: 45,
    precoOriginal: 52,
    imagem: "assets/produtos/absorcat.jpg",
    descricao: "Granulado ecológico para gatos — Linha Colosso. 100% madeira de pinus de reflorestamento — biodegradavel. Alta absorcao, nao toxico e nao inflamavel."
  },
  {
    id: "biscoitos-crockitos-colosso-original",
    nome: "Biscoitos Crockitos Colosso Original",
    categoria: "Petiscos",
    peso: "400g",
    preco: 18,
    precoOriginal: 22,
    imagem: "assets/produtos/crockitos.jpg",
    descricao: "Petisco crocante em formato de osso para cães. Embalagem com ziper para conservacao. Ideal pra recompensar, treinar ou simplesmente mimar."
  },
  {
    id: "snacks-naturais-desidratados-colosso",
    nome: "Snacks Naturais Desidratados Colosso",
    categoria: "Petiscos",
    peso: "Var.",
    preco: 16,
    precoOriginal: 19,
    imagem: "assets/produtos/colosso-snacks.jpg",
    descricao: "Petiscos 100% naturais — orelha, casco, chifre, traqueia, pe de galinha, rotula bovina, focinho suino e mix. Processo de desidratacao que preserva os nutrientes e concentra o sabor."
  },
  {
    id: "colosso-biscoitos-natural",
    nome: "Colosso Biscoitos Natural",
    categoria: "Petiscos",
    peso: "150g",
    preco: 12,
    precoOriginal: 15,
    imagem: "assets/produtos/colosso-biscoitos-natural.jpg",
    descricao: "Biscoitos integrais super premium 100% naturais. Sabores: Frutas Vermelhas (integral), Mel Aveia e Banana (integral), Cenoura e Ervilha (vegano)."
  },
  {
    id: "pipipet-kit-adestrador-sanitario",
    nome: "PipiPet Kit Adestrador Sanitario",
    categoria: "Acessorios",
    peso: "Kit",
    preco: 28,
    precoOriginal: 35,
    imagem: "assets/produtos/pipipet.jpg",
    descricao: "Kit completo para educar seu cao no local certo. A combinacao que funciona: um atrai para o lugar certo, o outro repele do lugar errado."
  },
  {
    id: "colosso-roupinha-de-la",
    nome: "Colosso Roupinha de La",
    categoria: "Acessorios",
    peso: "P/M/G",
    preco: 35,
    precoOriginal: 42,
    imagem: "assets/produtos/colosso-roupinha.jpg",
    descricao: "Conforto e protecao contra o frio para o seu pet. Roupinha em malha de la com gola canelada e acabamento em trico. Estampas listradas sortidas (verde, marrom/azul, lilas)."
  },
  {
    id: "cocheira-mel-racao-para-equinos",
    nome: "Cocheira Mel — Ração para Equinos",
    categoria: "Equinos",
    peso: "30kg",
    preco: 99.9,
    precoOriginal: 115,
    imagem: "assets/produtos/cocheira.png",
    descricao: "Ração premium para equinos, formulada com mel e ingredientes selecionados para nutrição completa e energia duradoura."
  },
];

// --- Header scroll state ---
(function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 80);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// --- Header WhatsApp link ---
const headerWa = document.getElementById('header-wa');
if (headerWa) {
  headerWa.href = `${CONFIG.whatsapp}?text=${encodeURIComponent(CONFIG.promoMsgPadrao.duvida)}`;
}

// --- Helper: build WhatsApp link with pre-filled text ---
function waLink(msg) {
  return `${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
}

// --- Hero CTA: Agendar Banho ---
const heroBanho = document.getElementById('hero-cta-banho');
if (heroBanho) heroBanho.href = waLink(CONFIG.promoMsgPadrao.banhoTosa);

// --- Catálogo: render + filtros ---
function brl(n) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
function calcDesconto(preco, precoOriginal) {
  if (!precoOriginal || precoOriginal <= preco) return null;
  return Math.round((1 - preco / precoOriginal) * 100);
}

function renderProduto(p) {
  const desc = calcDesconto(p.preco, p.precoOriginal);
  const badge = desc ? `<span class="produto__badge desc">-${desc}%</span>` : '';
  const topBadge = p.destaque === 'MAIS_PEDIDO' ? `<span class="produto__badge top">MAIS PEDIDO</span>` : '';
  const precoOriginal = p.precoOriginal
    ? `<span class="produto__preco-original">${brl(p.precoOriginal)}</span>`
    : '';

  return `
    <article class="produto" data-categoria="${p.categoria}" data-id="${p.id}">
      <div class="produto__imagem-wrap">
        ${badge}${topBadge}
        <img class="produto__imagem" src="${p.imagem}" alt="${p.nome}" loading="lazy">
      </div>
      <div class="produto__body">
        <div class="produto__meta">
          <span>${p.categoria}</span>
          <span>${p.peso || ''}</span>
        </div>
        <h3 class="produto__nome">${p.nome}</h3>
        <div class="produto__precos">
          <span class="produto__preco">${brl(p.preco)}</span>
          ${precoOriginal}
        </div>
        <button class="produto__add" data-event="add-to-cart" data-product-id="${p.id}">
          + Adicionar
        </button>
      </div>
    </article>
  `;
}

function ordenarProdutos(arr) {
  // Ânforas primeiro, depois com desconto, depois por categoria
  return [...arr].sort((a, b) => {
    if (a.destaque === 'MAIS_PEDIDO' && b.destaque !== 'MAIS_PEDIDO') return -1;
    if (b.destaque === 'MAIS_PEDIDO' && a.destaque !== 'MAIS_PEDIDO') return 1;
    if (a.precoOriginal && !b.precoOriginal) return -1;
    if (b.precoOriginal && !a.precoOriginal) return 1;
    return a.categoria.localeCompare(b.categoria);
  });
}

function renderCatalogo(categoriaFiltro = 'todos') {
  const grid = document.getElementById('produtos-grid');
  if (!grid) return;
  const lista = categoriaFiltro === 'todos'
    ? PRODUTOS
    : PRODUTOS.filter(p => p.categoria === categoriaFiltro);
  grid.innerHTML = ordenarProdutos(lista).map(renderProduto).join('');
}

// --- Wire filtros ---
document.querySelectorAll('.filtros .chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.filtros .chip').forEach(c => {
      c.classList.remove('is-active');
      c.setAttribute('aria-selected', 'false');
    });
    chip.classList.add('is-active');
    chip.setAttribute('aria-selected', 'true');
    renderCatalogo(chip.dataset.categoria);
  });
});

// Render inicial
renderCatalogo();

// --- Inject CONFIG into [data-config] and [data-config-href] elements ---
function injectConfig() {
  document.querySelectorAll('[data-config]').forEach(el => {
    if (el.dataset.configInjected) return;
    const path = el.dataset.config.split('.');
    let v = CONFIG.loja;
    for (const p of path) v = v?.[p];
    if (v != null) {
      el.textContent = v;
      el.dataset.configInjected = '1';
    }
  });
  document.querySelectorAll('[data-config-href]').forEach(el => {
    const path = el.dataset.configHref.split('.');
    let v = CONFIG.loja;
    for (const p of path) v = v?.[p];
    if (v != null) el.setAttribute('href', v);
  });
}
injectConfig();

// --- Serviços CTAs ---
const servCtas = {
  'serv-cta-banho': CONFIG.promoMsgPadrao.banhoTosa,
  'serv-cta-vacinas': CONFIG.promoMsgPadrao.vacinas,
  'serv-cta-brahma': CONFIG.promoMsgPadrao.galinhas,
};
Object.entries(servCtas).forEach(([id, msg]) => {
  const el = document.getElementById(id);
  if (el) el.href = waLink(msg);
});

// --- Brand CTAs ---
const brandVinicius = document.getElementById('brand-cta-vinicius');
const brandBanho = document.getElementById('brand-cta-banho');
if (brandVinicius) brandVinicius.href = waLink('Olá Vinícius! Tudo bem? Quero conversar sobre o atendimento.');
if (brandBanho) brandBanho.href = waLink(CONFIG.promoMsgPadrao.banhoTosa);
