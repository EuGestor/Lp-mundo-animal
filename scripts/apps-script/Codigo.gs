/**
 * Sincronizacao de precos: Google Sheets -> GitHub -> Vercel
 * LP Mundo Animal (github.com/EuGestor/Lp-mundo-animal)
 *
 * COMO INSTALAR
 * 1. Na planilha: Extensoes > Apps Script. Cole este arquivo inteiro.
 * 2. Configuracoes do projeto > Propriedades do script, adicione:
 *      GITHUB_TOKEN = <PAT de granularidade fina, escopo "Contents: Read and write",
 *                      restrito apenas ao repositorio Lp-mundo-animal>
 * 3. Rode `instalarGatilhoHorario()` uma vez (vai pedir autorizacao).
 * 4. Recarregue a planilha: o menu "Site" aparece na barra superior.
 *
 * A planilha NUNCA e publicada na web. Este script le com a propria autenticacao
 * e envia as linhas no corpo do dispatch, entao abas de custo/margem que existam
 * na mesma pasta de trabalho continuam privadas.
 */

var REPO = 'EuGestor/Lp-mundo-animal';
var ABA_PRODUTOS = 'PRODUTOS';
var ABA_PROMOCOES = 'PROMOCOES';

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Site')
    .addItem('Atualizar site agora', 'atualizarSiteAgora')
    .addSeparator()
    .addItem('Puxar catálogo do site', 'puxarCatalogo')
    .addToUi();
}

/** Botao do menu. Mesma funcao que o gatilho horario chama. */
function atualizarSiteAgora() {
  var r = sincronizar();
  var ui = SpreadsheetApp.getUi();
  if (r.ok) {
    ui.alert('Enviado!\n\nO site atualiza em 1 a 3 minutos. ' +
             'Pode fechar a planilha, o processo continua sozinho.');
  } else {
    ui.alert('Não enviei nada\n\n' + r.erro);
  }
}

/** Gatilho horario. Silencioso: nao existe UI para alertar. */
function sincronizarAutomatico() {
  var r = sincronizar();
  if (!r.ok) console.error('Sync automatico falhou: ' + r.erro);
}

function sincronizar() {
  var problemas = [];
  var produtos = lerAba(ABA_PRODUTOS, ['id', 'preco', 'preco_de', 'selo', 'ativo'], problemas);
  var promocoes = lerAba(ABA_PROMOCOES,
    ['id', 'titulo', 'variacao', 'descricao', 'preco', 'preco_de', 'selo', 'imagem_de', 'ativo'],
    problemas);

  if (problemas.length) return { ok: false, erro: problemas.join('\n') };
  if (!produtos.length && !promocoes.length) {
    return { ok: false, erro: 'Não achei nenhuma linha preenchida nas abas.' };
  }

  var token = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
  if (!token) {
    return { ok: false, erro: 'GITHUB_TOKEN não está nas Propriedades do script.' };
  }

  var resp = UrlFetchApp.fetch('https://api.github.com/repos/' + REPO + '/dispatches', {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json' },
    payload: JSON.stringify({
      event_type: 'sync-precos',
      client_payload: { produtos: produtos, promocoes: promocoes }
    }),
    muteHttpExceptions: true
  });

  var codigo = resp.getResponseCode();
  if (codigo !== 204) {
    return { ok: false, erro: 'GitHub respondeu ' + codigo + ': ' + resp.getContentText() };
  }
  return { ok: true };
}

/**
 * Le uma aba pelo cabecalho, nao por posicao de coluna: se alguem inserir uma
 * coluna no meio, nada quebra.
 *
 * Usa getValues() de proposito. getDisplayValues() devolveria "130,00" como
 * texto e obrigaria a parsear virgula de locale, que e como 130,00 vira 13000.
 */
function lerAba(nome, colunas, problemas) {
  var aba = SpreadsheetApp.getActive().getSheetByName(nome);
  if (!aba) {
    problemas.push('Aba "' + nome + '" não existe.');
    return [];
  }
  var dados = aba.getDataRange().getValues();
  if (dados.length < 2) return [];

  var cabecalho = dados[0].map(function (c) { return String(c).trim().toLowerCase(); });
  var indice = {};
  for (var i = 0; i < colunas.length; i++) {
    var pos = cabecalho.indexOf(colunas[i]);
    if (pos === -1) {
      problemas.push('Aba "' + nome + '": falta a coluna "' + colunas[i] + '".');
      return [];
    }
    indice[colunas[i]] = pos;
  }

  var linhas = [];
  for (var r = 1; r < dados.length; r++) {
    var id = dados[r][indice.id];
    if (id === '' || id === null) continue; // linha em branco no fim da aba
    var obj = {};
    for (var c = 0; c < colunas.length; c++) {
      var v = dados[r][indice[colunas[c]]];
      obj[colunas[c]] = (typeof v === 'string') ? v.trim() : v;
    }
    // A validacao de verdade mora na Action, versionada e testada. Aqui so
    // detectamos cedo o erro mais comum: valor digitado como texto.
    ['preco', 'preco_de'].forEach(function (campo) {
      var v = obj[campo];
      if (v !== '' && v !== null && v !== undefined && typeof v !== 'number') {
        problemas.push('Aba "' + nome + '", linha ' + (r + 1) + ': "' + campo +
          '" está como texto ("' + v + '"). Formate a célula como número — ' +
          'número alinha à direita sozinho, texto alinha à esquerda.');
      }
    });
    linhas.push(obj);
  }
  return linhas;
}

/**
 * Reescreve as colunas travadas a partir do que esta no site, acrescentando
 * linhas para produtos novos ja com os precos atuais preenchidos.
 * Rodar depois que um dev adiciona produto ao catalogo.
 */
function puxarCatalogo() {
  var ui = SpreadsheetApp.getUi();
  var url = 'https://raw.githubusercontent.com/' + REPO + '/main/src/data/products.json';
  var resp = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  if (resp.getResponseCode() !== 200) {
    ui.alert('Não consegui ler o catálogo do site (HTTP ' + resp.getResponseCode() + ').');
    return;
  }

  var catalogo = JSON.parse(resp.getContentText());
  var aba = SpreadsheetApp.getActive().getSheetByName(ABA_PRODUTOS);
  if (!aba) { ui.alert('Aba "' + ABA_PRODUTOS + '" não existe.'); return; }

  var produtos = catalogo.filter(function (p) { return !p.promoSlot; });
  var linhas = produtos.map(function (p) {
    return [p.id, p.name, p.weight || '', p.category,
            p.price === undefined ? '' : p.price,
            p.originalPrice === undefined ? '' : p.originalPrice,
            p.badge || '', p.active === false ? 'NÃO' : 'SIM'];
  });

  aba.getRange(1, 1, 1, 8).setValues([
    ['id', 'produto', 'variacao', 'categoria', 'preco', 'preco_de', 'selo', 'ativo']
  ]);
  if (aba.getMaxRows() > 1) {
    aba.getRange(2, 1, aba.getMaxRows() - 1, 8).clearContent();
  }
  aba.getRange(2, 1, linhas.length, 8).setValues(linhas);
  aba.getRange(2, 5, linhas.length, 2).setNumberFormat('#,##0.00');

  ui.alert('Catálogo atualizado: ' + linhas.length + ' produtos.\n\n' +
           'Os preços vieram do site. Ajuste o que precisar e use "Atualizar site agora".');
}

function instalarGatilhoHorario() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'sincronizarAutomatico') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('sincronizarAutomatico').timeBased().everyHours(1).create();
  SpreadsheetApp.getUi().alert('Pronto: o site passa a conferir a planilha de hora em hora.');
}
