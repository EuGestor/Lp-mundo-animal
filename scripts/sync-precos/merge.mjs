/**
 * Logica pura de validacao e merge da planilha de precos.
 *
 * Sem I/O de proposito: tudo aqui e testavel sem GitHub, sem Google e sem rede.
 * Contrato completo em docs/specs/2026-09-19-sync-precos-google-sheets-design.md
 */

/** Selo acima disso e truncado pelo CSS do card (medido a 360px). */
export const SELO_LARGURA_MAX = 126;

/** Largura renderizada aproximada do selo, em px (uppercase 10px bold + padding). */
export function larguraSelo(texto) {
  if (!texto) return 0;
  // 6.8px por caractere e a media medida em ProductCard; 20px e o padding lateral.
  return Math.round(texto.length * 6.8) + 20;
}

const ehNumero = (v) => typeof v === 'number' && Number.isFinite(v);
const vazio = (v) => v === null || v === undefined || v === '';

/** `ativo` chega como SIM/NAO da planilha. Qualquer outra coisa e erro. */
function parseAtivo(valor, ref, erros) {
  const v = String(valor ?? '').trim().toUpperCase();
  if (v === 'SIM') return true;
  if (v === 'NAO' || v === 'NÃO') return false;
  erros.push(`${ref}: coluna "ativo" deve ser SIM ou NÃO (recebido: "${valor}")`);
  return null;
}

/**
 * Valida precos de uma linha. Retorna {preco, precoDe} ou null se invalido.
 * V2, V3 e V4 da spec.
 */
function parsePrecos(linha, ref, erros) {
  const { preco, preco_de: precoDe } = linha;

  // V4: a planilha formata as colunas como numero e o Apps Script le com
  // getValues(), entao aqui tem que chegar number. String vira erro, nunca parse.
  for (const [campo, valor] of [['preco', preco], ['preco_de', precoDe]]) {
    if (!vazio(valor) && !ehNumero(valor)) {
      erros.push(
        `${ref}: "${campo}" precisa ser numero, veio ${typeof valor} ("${valor}"). ` +
          `Formate a celula como numero (texto alinha a esquerda, numero a direita).`
      );
      return null;
    }
    if (ehNumero(valor) && valor < 0) {
      erros.push(`${ref}: "${campo}" nao pode ser negativo (${valor})`);
      return null;
    }
  }

  // V3: preco riscado sem preco atual sumiria em silencio no card.
  if (vazio(preco) && !vazio(precoDe)) {
    erros.push(
      `${ref}: "preco_de" preenchido (${precoDe}) com "preco" vazio. ` +
        `Sem preco o card vira "Consulte no WhatsApp" e o valor riscado nao aparece.`
    );
    return null;
  }

  if (ehNumero(preco) && preco === 0) {
    erros.push(`${ref}: "preco" zero. Deixe a celula VAZIA para "consulte no WhatsApp".`);
    return null;
  }

  // V2: o card calcula -(1 - preco/preco_de); invertido renderiza "-0%" ou "--5%".
  if (ehNumero(preco) && ehNumero(precoDe) && precoDe <= preco) {
    erros.push(
      `${ref}: "preco_de" (${precoDe}) precisa ser MAIOR que "preco" (${preco}). ` +
        `E o valor riscado, o de antes da promocao.`
    );
    return null;
  }

  return { preco: ehNumero(preco) ? preco : null, precoDe: ehNumero(precoDe) ? precoDe : null };
}

function checaSelo(selo, ref, avisos) {
  const t = String(selo ?? '').trim();
  if (t && larguraSelo(t) > SELO_LARGURA_MAX) {
    avisos.push(
      `${ref}: selo "${t}" e longo e vai aparecer cortado no celular. ` +
        `Cabe cerca de 15 caracteres.`
    );
  }
  return t;
}

/** Aplica os campos comerciais de uma linha sobre um produto do catalogo. */
function aplicaComercial(produto, precos, selo, ativo) {
  if (precos.preco === null) delete produto.price;
  else produto.price = precos.preco;

  if (precos.precoDe === null) delete produto.originalPrice;
  else produto.originalPrice = precos.precoDe;

  if (selo) produto.badge = selo;
  else delete produto.badge;

  produto.active = ativo;
}

/**
 * Merge por id (D1 da spec).
 *
 * - id nos dois lados        -> sobrepoe campos comerciais
 * - id so no catalogo        -> NAO TOCA (dev adicionou produto antes de "puxar catalogo")
 * - id so na planilha        -> pula e avisa, nunca aborta
 *
 * A ordem do catalogo e sempre preservada: ela e curada a mao e define a vitrine.
 */
export function merge(catalogo, payload) {
  const erros = [];
  const avisos = [];
  const produtos = JSON.parse(JSON.stringify(catalogo));
  const porId = new Map(produtos.map((p) => [p.id, p]));

  const linhasProduto = payload?.produtos ?? [];
  const linhasPromo = payload?.promocoes ?? [];

  // V1: id duplicado e ambiguo, aborta.
  const vistos = new Set();
  for (const linha of [...linhasProduto, ...linhasPromo]) {
    const id = linha?.id;
    if (vazio(id)) {
      erros.push(`Linha sem "id" na planilha. O id e a unica chave: nomes se repetem.`);
      continue;
    }
    if (vistos.has(id)) erros.push(`id ${id} aparece em mais de uma linha.`);
    vistos.add(id);
  }

  for (const linha of linhasProduto) {
    if (vazio(linha?.id)) continue;
    const ref = `produto id ${linha.id}`;
    const alvo = porId.get(linha.id);
    if (!alvo) {
      avisos.push(`${ref}: nao existe mais no site, linha ignorada. Rode "Puxar catálogo".`);
      continue;
    }
    if (alvo.promoSlot) {
      erros.push(`${ref}: e uma vaga de promocao, precisa estar na aba PROMOCOES.`);
      continue;
    }
    const precos = parsePrecos(linha, ref, erros);
    const ativo = parseAtivo(linha.ativo, ref, erros);
    if (!precos || ativo === null) continue;
    aplicaComercial(alvo, precos, checaSelo(linha.selo, ref, avisos), ativo);
  }

  for (const linha of linhasPromo) {
    if (vazio(linha?.id)) continue;
    const ref = `promocao id ${linha.id}`;
    const vaga = porId.get(linha.id);
    if (!vaga || !vaga.promoSlot) {
      avisos.push(`${ref}: vaga de promocao inexistente, linha ignorada.`);
      continue;
    }
    const ativo = parseAtivo(linha.ativo, ref, erros);
    if (ativo === null) continue;

    if (!ativo) {
      vaga.active = false;
      continue;
    }

    // V6: vaga ligada pela metade renderiza card quebrado.
    const titulo = String(linha.titulo ?? '').trim();
    const precos = parsePrecos(linha, ref, erros);
    if (!titulo) erros.push(`${ref}: ativa sem "titulo".`);
    if (precos && precos.preco === null) {
      erros.push(`${ref}: ativa sem "preco". Vaga de promocao nao aceita "sob consulta".`);
    }

    const refImagem = linha.imagem_de;
    const origem = vazio(refImagem) ? null : porId.get(refImagem);
    if (!origem) {
      erros.push(
        `${ref}: "imagem_de" precisa apontar para o id de um produto existente ` +
          `(recebido: "${refImagem ?? ''}"). A vaga usa a foto desse produto.`
      );
    } else if (origem.promoSlot) {
      erros.push(`${ref}: "imagem_de" aponta para outra vaga de promocao (${refImagem}).`);
    }

    if (!precos || !titulo || !origem || origem.promoSlot || precos.preco === null) continue;

    vaga.name = titulo;
    vaga.weight = String(linha.variacao ?? '').trim();
    vaga.description = String(linha.descricao ?? '').trim();
    vaga.image = origem.image;
    vaga.category = 'Promoções';
    aplicaComercial(vaga, precos, checaSelo(linha.selo, ref, avisos), true);
  }

  return { produtos, erros, avisos };
}

/** Serializacao estavel: o mesmo conteudo gera sempre o mesmo texto (V7). */
export function serializa(produtos) {
  return JSON.stringify(produtos, null, 2) + '\n';
}
