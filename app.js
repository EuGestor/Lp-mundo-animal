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

// Re-inject CONFIG for the newly-added loja section elements
injectConfig();

// --- CTA final + footer WhatsApp ---
const ctaFinalWa = document.getElementById('cta-final-wa');
const footerWa = document.getElementById('footer-wa');
if (ctaFinalWa) ctaFinalWa.href = waLink(CONFIG.promoMsgPadrao.duvida);
if (footerWa) footerWa.href = waLink(CONFIG.promoMsgPadrao.duvida);

const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Re-inject CONFIG for the newly added footer/cta elements
injectConfig();

// =====================================================
// CART STATE
// =====================================================
const Cart = (() => {
  const STORAGE_KEY = 'mundoanimal-cart-v1';
  let items = [];

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      items = raw ? JSON.parse(raw) : [];
    } catch (e) {
      items = [];
    }
  }
  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
  function add(productId) {
    const p = PRODUTOS.find(x => x.id === productId);
    if (!p) return;
    const existing = items.find(i => i.id === productId);
    if (existing) existing.qty += 1;
    else items.push({ id: productId, qty: 1 });
    save();
    render();
  }
  function setQty(productId, qty) {
    const it = items.find(i => i.id === productId);
    if (!it) return;
    if (qty <= 0) remove(productId);
    else { it.qty = qty; save(); render(); }
  }
  function remove(productId) {
    items = items.filter(i => i.id !== productId);
    save();
    render();
  }
  function clear() {
    items = [];
    save();
    render();
  }
  function getItems() {
    return items.map(i => {
      const p = PRODUTOS.find(x => x.id === i.id);
      return p ? { ...p, qty: i.qty } : null;
    }).filter(Boolean);
  }
  function totalQty() {
    return items.reduce((s, i) => s + i.qty, 0);
  }
  function subtotal() {
    return getItems().reduce((s, i) => s + i.preco * i.qty, 0);
  }

  function render() {
    const itemsList = getItems();
    const badge = document.getElementById('cart-badge');
    const empty = document.getElementById('cart-empty');
    const list = document.getElementById('cart-items');
    const sub = document.getElementById('cart-subtotal');
    const tot = document.getElementById('cart-total');

    const qty = totalQty();
    if (badge) {
      badge.textContent = qty;
      badge.hidden = qty === 0;
    }

    if (itemsList.length === 0) {
      if (empty) empty.hidden = false;
      if (list) list.innerHTML = '';
    } else {
      if (empty) empty.hidden = true;
      if (list) {
        list.innerHTML = itemsList.map(i => `
          <li class="cart-item" data-id="${i.id}">
            <img class="cart-item__img" src="${i.imagem}" alt="">
            <div>
              <div class="cart-item__nome">${i.nome}</div>
              <div class="cart-item__preco">${brl(i.preco)} × ${i.qty} = <strong>${brl(i.preco * i.qty)}</strong></div>
            </div>
            <div class="cart-item__controls">
              <div class="cart-item__qty">
                <button type="button" data-act="dec" aria-label="Diminuir">−</button>
                <span>${i.qty}</span>
                <button type="button" data-act="inc" aria-label="Aumentar">+</button>
              </div>
              <button type="button" class="cart-item__del" data-act="del" aria-label="Remover">🗑</button>
            </div>
          </li>
        `).join('');
      }
    }

    const s = subtotal();
    if (sub) sub.textContent = brl(s);
    if (tot) tot.textContent = brl(s); // frete grátis em Itabira

    // Atualiza estado dos botões "Adicionar" no catálogo
    document.querySelectorAll('.produto__add').forEach(btn => {
      const inCart = itemsList.find(i => i.id === btn.dataset.productId);
      btn.classList.toggle('is-added', !!inCart);
      btn.textContent = inCart ? `✓ Adicionado (${inCart.qty})` : '+ Adicionar';
    });
  }

  load();
  return { add, setQty, remove, clear, getItems, totalQty, subtotal, render };
})();

// =====================================================
// CART UI WIRING
// =====================================================
function openCart() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  if (!drawer || !overlay) return;
  drawer.hidden = false;
  overlay.hidden = false;
  // force reflow to enable the transition
  void drawer.offsetWidth;
  drawer.classList.add('is-open');
  overlay.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  if (!drawer || !overlay) return;
  drawer.classList.remove('is-open');
  overlay.classList.remove('is-open');
  setTimeout(() => { drawer.hidden = true; overlay.hidden = true; }, 250);
  document.body.style.overflow = '';
}

const openCartBtn = document.getElementById('open-cart');
const closeCartBtn = document.getElementById('close-cart');
const cartOverlay = document.getElementById('cart-overlay');
if (openCartBtn) openCartBtn.addEventListener('click', openCart);
if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
document.addEventListener('keydown', e => {
  const drawer = document.getElementById('cart-drawer');
  if (e.key === 'Escape' && drawer && !drawer.hidden) closeCart();
});

// Delegação: botão "+ Adicionar" nos cards do catálogo
const produtosGrid = document.getElementById('produtos-grid');
if (produtosGrid) {
  produtosGrid.addEventListener('click', e => {
    const btn = e.target.closest('.produto__add');
    if (!btn) return;
    Cart.add(btn.dataset.productId);
  });
}

// Delegação: controles dentro do drawer
const cartItemsEl = document.getElementById('cart-items');
if (cartItemsEl) {
  cartItemsEl.addEventListener('click', e => {
    const btn = e.target.closest('button[data-act]');
    if (!btn) return;
    const li = btn.closest('.cart-item');
    if (!li) return;
    const id = li.dataset.id;
    const it = Cart.getItems().find(x => x.id === id);
    if (!it) return;
    if (btn.dataset.act === 'inc') Cart.setQty(id, it.qty + 1);
    else if (btn.dataset.act === 'dec') Cart.setQty(id, it.qty - 1);
    else if (btn.dataset.act === 'del') Cart.remove(id);
  });
}

// Toggle entrega/retira no formulário
document.querySelectorAll('input[name="entrega"]').forEach(r => {
  r.addEventListener('change', () => {
    const checked = document.querySelector('input[name="entrega"]:checked');
    const isEntrega = checked && checked.value === 'entrega';
    const wrap = document.getElementById('endereco-wrap');
    const frete = document.getElementById('cart-frete');
    if (wrap) wrap.style.display = isEntrega ? '' : 'none';
    if (frete) frete.textContent = isEntrega ? 'GRÁTIS (Itabira)' : 'Retira na loja';
  });
});

// Render inicial (badge, summary, button states)
Cart.render();

// =====================================================
// CHECKOUT — validação + WhatsApp message + copy fallback
// =====================================================
function maskPhone(v) {
  v = v.replace(/\D/g, '').slice(0, 11);
  if (v.length === 0) return '';
  if (v.length <= 2) return `(${v}`;
  if (v.length <= 7) return `(${v.slice(0,2)}) ${v.slice(2)}`;
  return `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
}

const telInput = document.getElementById('cart-tel');
if (telInput) {
  telInput.addEventListener('input', e => {
    e.target.value = maskPhone(e.target.value);
  });
}

function validarPedido(form) {
  const errors = {};
  const nome = form.nome.value.trim();
  const tel = form.telefone.value.replace(/\D/g, '');

  if (!nome) errors.nome = 'Por favor, informe seu nome.';
  if (!tel || tel.length < 10) errors.tel = 'Informe um telefone válido com DDD.';
  if (Cart.totalQty() === 0) errors.geral = 'Adicione produtos antes de enviar.';

  return errors;
}

function buildWhatsAppMessage(form) {
  const items = Cart.getItems();
  const nome = form.nome.value.trim();
  const tel = form.telefone.value.trim();
  const entrega = form.entrega.value;
  const endereco = form.endereco.value.trim();
  const obs = form.observacao.value.trim();

  const linhas = [
    '*🛒 NOVO PEDIDO — MUNDO ANIMAL PET SHOP*',
    '',
    `*Cliente:* ${nome}`,
    `*Telefone:* ${tel}`,
    '',
  ];

  if (entrega === 'entrega') {
    linhas.push(`*Entrega:* ${endereco || '(sem endereço informado — confirmar)'}`);
  } else {
    linhas.push('*Retira na loja*');
  }

  linhas.push('', '*PRODUTOS:*');
  items.forEach(i => {
    linhas.push(`• ${i.qty}x ${i.nome} — ${brl(i.preco * i.qty)}`);
  });

  const subt = Cart.subtotal();
  linhas.push(
    '',
    `*Subtotal:* ${brl(subt)}`,
    entrega === 'entrega' ? '*Frete:* GRÁTIS (Itabira)' : '*Retira na loja*',
    `*TOTAL: ${brl(subt)}*`,
  );

  if (obs) linhas.push('', `*Observação:* ${obs}`);
  linhas.push('', '_Pedido feito pela landing page Mundo Animal._');

  return linhas.join('\n');
}

function showErrors(errors) {
  ['nome', 'tel'].forEach(k => {
    const el = document.getElementById(`err-${k}`);
    if (!el) return;
    if (errors[k]) { el.hidden = false; el.textContent = errors[k]; }
    else el.hidden = true;
  });
  if (errors.geral) alert(errors.geral);
}

const cartForm = document.getElementById('cart-form');
if (cartForm) {
  cartForm.addEventListener('submit', e => {
    e.preventDefault();
    const form = e.target;
    const errors = validarPedido(form);
    if (Object.keys(errors).length > 0) {
      showErrors(errors);
      return;
    }
    showErrors({});
    const msg = buildWhatsAppMessage(form);
    const url = `${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener');
  });
}

// Copy fallback
const copyBtn = document.getElementById('cart-copy');
if (copyBtn) {
  copyBtn.addEventListener('click', async () => {
    const form = document.getElementById('cart-form');
    const errors = validarPedido(form);
    if (Object.keys(errors).length > 0) { showErrors(errors); return; }
    const msg = buildWhatsAppMessage(form);
    try {
      await navigator.clipboard.writeText(msg);
      const original = copyBtn.textContent;
      copyBtn.textContent = '✓ Copiado! Cole no WhatsApp.';
      setTimeout(() => { copyBtn.textContent = original; }, 2500);
    } catch (e) {
      alert('Não foi possível copiar automaticamente. Selecione e copie manualmente.');
    }
  });
}
