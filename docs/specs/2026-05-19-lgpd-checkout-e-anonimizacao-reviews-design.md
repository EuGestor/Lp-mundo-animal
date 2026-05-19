# LGPD no checkout + anonimização parcial de reviews + endurecimento da rede

**Data:** 2026-05-19
**Autor:** Claude (auditoria) + Vinícius (decisões)
**Status:** Aprovado

## Contexto

Auditoria de segurança/LGPD da LP `https://github.com/EuGestor/Lp-mundo-animal` identificou três frentes prioritárias:

1. Coleta de PII (nome + endereço) no `CheckoutModal` sem base legal LGPD nem aviso ao titular.
2. 12 testimonials com nomes completos hardcoded nos componentes `HeroReviews.tsx` e `GoogleReviews.tsx`, re-publicados em material de marketing sem consentimento explícito.
3. Preview do build (porta 8088) e segunda cópia do site (porta 9091) escutando em `0.0.0.0` no VPS — exposição desnecessária após a Vercel ir ao ar.

A LP foi publicada em GitHub e está sendo conectada à Vercel para deploy automático.

## Decisões

- **Controlador legal:** PET SHOP MUNDO ANIMAL, CNPJ 33.088.422/0001-10, Itabira/MG.
- **Página de privacidade:** `public/privacidade.html` (estática, sem React Router — a LP é SPA single-page sem roteamento, e uma página estática separada é indexável pelo Google e mais simples).
- **Base legal LGPD aplicável:** art. 7º, V (execução de contrato). Não há tratamento que exija consentimento explícito separado — o checkbox cumpre função de transparência e prova de ciência.
- **Retenção:** 5 anos (compatível com prazo de guarda fiscal e LGPD art. 16, I).
- **Canal de contato LGPD:** WhatsApp Business já usado pela loja (centraliza num único canal que o tutor já usa).
- **Padrão de anonimização:** primeiro nome + inicial do último sobrenome com ponto (ex.: "Alexandre A."). Trade-off conhecido: em Itabira (~115k hab.) ainda é parcialmente identificável; aceitável porque os reviews originais já são públicos no Google Maps e a abreviação é a convenção mais comum em sites de empresa no Brasil.

## Item 1 — Política de privacidade + checkbox no checkout

### Arquivos afetados
- `public/privacidade.html` (novo)
- `src/components/CheckoutModal.tsx` (modificado)

### Conteúdo da política (`public/privacidade.html`)
HTML estilizado com CSS inline mínimo (mesma paleta brand-green da LP), contendo:

1. Identificação do controlador: PET SHOP MUNDO ANIMAL, CNPJ 33.088.422/0001-10, Itabira/MG.
2. Dados coletados via formulário de checkout: nome, endereço de entrega, observações, itens do pedido.
3. Finalidade: processar e entregar o pedido.
4. Base legal: LGPD art. 7º, V (execução de contrato e procedimentos preliminares).
5. Compartilhamento: dados são enviados ao WhatsApp Business da loja (Meta Platforms); nenhum compartilhamento adicional, venda ou cessão a terceiros.
6. Retenção: 5 anos a partir do pedido.
7. Direitos do titular (LGPD art. 18): acesso, correção, exclusão, portabilidade, revogação de consentimento — exercitáveis via WhatsApp da loja.
8. Cookies: a LP não utiliza cookies de tracking; eventual armazenamento local restringe-se ao carrinho temporário.
9. Encarregado (DPO): contato via WhatsApp da loja.
10. Data de vigência.

Linguagem leiga, sem juridiquês excessivo, mantendo o tom de família da LP.

### Checkbox no CheckoutModal
- Posição: imediatamente acima do botão "Enviar pedido".
- Estado inicial: desmarcado.
- Texto: "Li e concordo com a [Política de Privacidade](/privacidade.html)" — link abre em nova aba (`target="_blank"`).
- Bloqueio do submit: `disabled` no botão até o checkbox ficar marcado. Botão fica visualmente apagado (opacity 50% + cursor `not-allowed`) sem mensagem de erro inicial.
- Sem persistência da escolha (cada novo checkout pede de novo — propositalmente, porque cada pedido é um ato novo).

### Risco e mitigação
- **Risco:** usuário acha o checkbox chato e desiste. **Mitigação:** texto curto, sem pop-up, link discreto. UX padrão de e-commerce.
- **Risco:** texto da política contém erro factual (CNPJ digitado errado). **Mitigação:** revisar antes do commit; data de vigência permite ajuste posterior com novo commit.

## Item 2 — Abreviar nomes dos 12 reviews

### Arquivos afetados
- `src/components/HeroReviews.tsx`
- `src/components/GoogleReviews.tsx`

### Mapeamento
| Antes | Depois |
| --- | --- |
| Alexandre Ackel | Alexandre A. |
| Débora dos Santos / Débora dos Santos Dutra | Débora D. |
| Ramiro Ricarbene | Ramiro R. |
| Bruno Pimenta | Bruno P. |
| RODRIGO FERNANDO | Rodrigo F. |
| Davi M Silva | Davi S. |
| Guilherme Augusto | Guilherme A. |
| Luciana Citty | Luciana C. |
| Márcio Sabino | Márcio S. |
| Dario Oliveira | Dario O. |
| Nilson Edvs | Nilson E. |
| Dalylla Mayrya | Dalylla M. |

### Componente de avatar
Avatar redondo gerado por iniciais já existente — se o componente faz `name.split(' ').map(w => w[0])`, "Alexandre A." gera `AA` (ok). Se quebrar com nome curto, ajuste local no momento da edição.

## Item 3 — Desligar portas 8088 e 9091 (pós-Vercel)

### Pré-condições
1. Deploy da Vercel concluído com sucesso, retornando HTTP 200 na URL pública.
2. HTML da Vercel contém marcadores da versão atual (Roupinha "Consulte valores no WhatsApp", "PET SHOP MUNDO ANIMAL" nos textos, etc).
3. Vinícius confirma visualmente que a URL pública está correta.

### Execução
- Identificar PIDs em escuta nas portas 8088 e 9091 (`ss -tlnp` ou `lsof -iTCP:<port> -sTCP:LISTEN`).
- `kill <PID>` (não usar `-9` em primeiro tiro — preferir SIGTERM e só escalar se persistir).
- Verificar que `ss -tlnp` não mostra mais essas portas.

### Não-escopo
- **Não tocar** nas portas 3001 (docker-proxy), 7777 (EuGestor dashboard), 60500, 8765, 3500 (MCP). Cada uma serve outro propósito do user e exige decisão separada.
- **Não persistir** nada em `systemd` / `crontab` — se o user re-startar o servidor, ele decide se sobe a porta de novo.

### Rollback
```bash
cd /root/lp-mundo-animal/dist && nohup python3 -m http.server 8088 --bind 0.0.0.0 > /tmp/lp-server.log 2>&1 &
```

## Não-escopo (intencional)

- Cookie banner: a LP **não usa** cookies de tracking; não há necessidade legal de banner.
- Política de cookies separada: contemplada num parágrafo curto dentro de `/privacidade.html`.
- Termos de uso / contrato comercial: fora do escopo (este spec cobre apenas privacidade/LGPD do checkout).
- Solicitação automatizada de direitos do titular (portal de DSAR): fora do escopo; tratamento manual via WhatsApp é proporcional ao volume da loja.
- Auditoria dos outros buckets do Supabase (`fotos_marllon` etc): fora do escopo deste spec — vira issue separada.

## Sequência de execução

1. Commit deste design doc.
2. Implementar Item 1 (privacidade.html + checkbox).
3. Implementar Item 2 (rename nos reviews).
4. Build + commit + push.
5. Aguardar Vercel auto-deployar.
6. Vinícius confirma URL pública.
7. Executar Item 3 (kill ports).
