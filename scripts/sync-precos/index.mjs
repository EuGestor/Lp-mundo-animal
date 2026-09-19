/**
 * Entrypoint da Action de sincronizacao de precos.
 *
 * Le o client_payload do repository_dispatch, valida, faz merge por id e grava
 * src/data/products.json. Nao commita nada: quem commita e o workflow, e so
 * quando o arquivo muda de verdade (V7).
 *
 * Saidas para o workflow (GITHUB_OUTPUT):
 *   mudou=true|false   -> se ha o que commitar
 *   resumo=<texto>     -> mensagem de commit / retorno para a planilha
 */
import { readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import { merge, serializa } from './merge.mjs';

const ARQUIVO = 'src/data/products.json';

function saida(chave, valor) {
  const destino = process.env.GITHUB_OUTPUT;
  if (!destino) return;
  const delim = `ghadelim_${Math.random().toString(36).slice(2)}`;
  appendFileSync(destino, `${chave}<<${delim}\n${valor}\n${delim}\n`);
}

function main() {
  const bruto = process.env.PAYLOAD;
  if (!bruto) {
    console.error('PAYLOAD vazio. A Action precisa do client_payload do dispatch.');
    process.exit(1);
  }

  let payload;
  try {
    payload = typeof bruto === 'string' ? JSON.parse(bruto) : bruto;
  } catch (e) {
    console.error(`PAYLOAD nao e JSON valido: ${e.message}`);
    process.exit(1);
  }

  const catalogo = JSON.parse(readFileSync(ARQUIVO, 'utf8'));
  const { produtos, erros, avisos } = merge(catalogo, payload);

  for (const a of avisos) console.log(`aviso: ${a}`);

  // Qualquer erro aborta o sync inteiro: nunca ha sincronizacao parcial.
  if (erros.length) {
    console.error(`\n${erros.length} erro(s). Nada foi publicado:\n`);
    for (const e of erros) console.error(`  - ${e}`);
    saida('mudou', 'false');
    saida('resumo', erros.join('\n'));
    process.exit(1);
  }

  const antes = readFileSync(ARQUIVO, 'utf8');
  const depois = serializa(produtos);

  // V7: sem isso, o trigger horario gera 24 deploys identicos por dia.
  if (antes === depois) {
    console.log('Nada mudou. Nenhum commit, nenhum deploy.');
    saida('mudou', 'false');
    saida('resumo', 'nenhuma alteracao');
    return;
  }

  writeFileSync(ARQUIVO, depois);

  const mudancas = [];
  const porId = new Map(catalogo.map((p) => [p.id, p]));
  for (const p of produtos) {
    const old = porId.get(p.id);
    if (!old) continue;
    if (old.price !== p.price) mudancas.push(`${p.name || `vaga ${p.id}`}: ${old.price ?? '-'} -> ${p.price ?? '-'}`);
    else if (old.active !== p.active) mudancas.push(`${p.name || `vaga ${p.id}`}: ${p.active ? 'ativado' : 'desativado'}`);
    else if (old.badge !== p.badge) mudancas.push(`${p.name || `vaga ${p.id}`}: selo "${p.badge ?? '-'}"`);
  }

  const resumo = mudancas.length ? mudancas.join('\n') : 'ajustes de catalogo';
  console.log(`Alteracoes:\n${resumo}`);
  saida('mudou', 'true');
  saida('resumo', resumo);
}

main();
