# Sincronização de preços via Google Sheets (Sheets → GitHub → Vercel)

**Data:** 2026-09-19
**Autor:** Claude (design) + Vinícius (decisões)
**Status:** Aguardando revisão

## Problema

Os 23 produtos da LP estão hardcoded como um array TypeScript dentro de `src/App.tsx`
(arquivo de 1.077 linhas). Qualquer alteração de preço exige um dev editando código e
fazendo commit. O cliente (Pet Shop Mundo Animal) não tem autonomia sobre os próprios
preços, e ofertas de curta duração — um pacote promocional que entra e sai no mesmo dia —
são inviáveis na prática.

## Objetivo

Dar ao cliente controle sobre os campos comerciais dos produtos a partir de uma planilha
Google, com dois gatilhos de publicação: automático de hora em hora e um botão para
forçar a atualização imediata. Latência aceita de ponta a ponta: 1 a 3 minutos.

## Fluxo

```
Google Sheets ──(Apps Script)──> GitHub repository_dispatch
                                      │
                       GitHub Action: valida → merge por id → commita
                                      │
                       Vercel detecta o push → build → no ar
```

O Apps Script lê a planilha com a própria autenticação e envia as linhas no
`client_payload` do dispatch. **A planilha nunca é publicada na web**, o que evita expor
abas de custo ou margem que venham a existir na mesma pasta de trabalho.

Gatilhos (ambos chamam a mesma função, um único caminho de código):

- **Automático:** trigger de tempo do Apps Script, de hora em hora.
- **Manual:** item de menu customizado na planilha ("Atualizar site agora").

O trigger de tempo do Apps Script foi escolhido em vez do `schedule` do GitHub Actions
porque o cron do Actions sofre atraso em horário de pico e é desativado automaticamente
após 60 dias sem atividade no repositório.

## Decisões

### D1 — A Action faz merge por `id`, nunca regenera a lista

A ordem do array `products` é curada à mão e é funcional: a sequência de ids renderizada
é `1, 2, 3, 4, 23, 5, 6...`, com o id 23 (Colosso Filhotes Carne 2kg) encaixado de
propósito ao lado do id 4 (o mesmo produto em 10,1kg). `filteredProducts.map()` renderiza
na ordem do array.

Se a Action montasse o JSON na ordem das linhas da planilha, o dia em que o cliente
ordenasse a planilha por preço ou nome a vitrine do site embaralharia sozinha.

**Regra:** a Action lê o `products.json` existente, sobrepõe apenas os campos comerciais
nos ids que casam, e regrava preservando a ordem do repositório. A ordem das linhas da
planilha é irrelevante — o cliente pode ordenar e filtrar à vontade. Não existe coluna de
ordenação na planilha.

**Contrato de merge quando os conjuntos divergem** (vai acontecer, e o comportamento não
pode ficar implícito):

| Situação | Comportamento |
| :--- | :--- |
| Id presente nos dois | sobrepõe os campos comerciais |
| Id no `products.json`, **sem linha na planilha** | **não toca no produto** — mantém os valores do repositório |
| Id na planilha, **ausente do `products.json`** | ignora a linha e reporta no alerta; **não aborta** |

O segundo caso é o dev que adicionou o produto 24 antes de rodar "puxar catálogo".
Ausência na planilha nunca pode significar "desativar" ou "limpar", ou produtos somem do
site silenciosamente.

O terceiro caso é linha órfã de um produto que o dev removeu. Abortar aqui deixaria uma
linha velha bloqueando *toda* atualização de preço — o cliente aperta o botão, recebe
erro e não consegue publicar nada. Por isso id desconhecido é ruído de sincronia, não
falha de integridade: pula e avisa. O aborta-tudo fica reservado para V2, V3 e V6.

### D2 — `ativo = NÃO` não remove o produto do JSON

O tipo `Product` ganha `active?: boolean`. O filtro acontece no `App.tsx`
(`products.filter(p => p.active !== false)`), não na Action.

A alternativa — a Action simplesmente não escrever os produtos desativados — quebra o
round-trip: sem o produto no JSON, a função "puxar catálogo" não consegue repor a linha
que o cliente desativou. O `products.json` permanece o catálogo completo.

### D3 — Divisão de responsabilidade por classe de campo

| Classe | Campos | Fonte da verdade |
| :--- | :--- | :--- |
| Travados | `name`, `image`, `category`, `weight`, `description`, `benefits` | repositório |
| Comerciais | `price`, `originalPrice`, `badge`, `active` | planilha, aba `PRODUTOS` |
| Vaga de promoção | acima + `name`, `description`, `weight`, `image` (por referência) | planilha, aba `PROMOCOES` |

Consequência aceita: **cadastrar produto novo continua sendo tarefa de dev**, porque
produto novo precisa de foto e copy. O cliente muda preço, risca preço "de/por", põe selo
e esconde produto esgotado.

### D4 — Vagas de promoção com imagem por referência

Três vagas fixas (ids `900`, `901`, `902`) existem no `products.json`, inativas por
padrão, para ofertas que não correspondem a nenhum produto do catálogo: combos, kits,
"leve 3 pague 2".

A foto não é upload: a coluna `imagem_de` recebe o id de um produto existente e a vaga
empresta a imagem dele. Um combo "3 sacos de PowerDog" reutilizando a foto do PowerDog é
o resultado correto, sem dev e sem armazenamento de arquivo.

As vagas caem na categoria `Promoções`, cuja pastilha de filtro só aparece quando há vaga
ativa — o que torna a correção C3 (pastilhas derivadas) uma **dependência** desta decisão,
não um item independente.

### D5 — Critério de qual aba usar

| A oferta é... | Onde vai |
| :--- | :--- |
| Produto que já tem card no site, com preço menor | `PRODUTOS`: mexe em `preco` / `preco_de` / `selo` |
| Algo que não existe como produto (combo, kit, cesta) | `PROMOCOES`: ocupa uma vaga |

Se o cliente criar uma vaga para um produto que continua ativo, o site mostra o item duas
vezes — uma na categoria original e outra em Promoções. Nenhuma validação automática pega
isso, porque uma vaga legitimamente usa a foto de um produto ativo (o combo). Mitigação:
a regra fica escrita como texto fixo acima do cabeçalho da aba `PROMOCOES`.

## Estrutura da planilha

### Aba `PRODUTOS`

🔒 = coluna protegida. Existe para orientação humana — os nomes se repetem (ids 1 e 2 são
ambos "PowerDog Premium Carne", ids 4 e 23 são ambos "Colosso Premium Filhotes Carne &
Arroz"), e o `id` é a única chave real.

| Col | Cabeçalho | Edita | Regra |
| :-- | :-- | :-- | :-- |
| A | `id` | 🔒 | número; precisa existir no `products.json` |
| B | `produto` | 🔒 | referência |
| C | `variacao` | 🔒 | referência (diferencia 15kg de 25kg) |
| D | `categoria` | 🔒 | referência |
| E | `preco` | ✅ | número > 0. Vazio = "Consulte valores no WhatsApp" |
| F | `preco_de` | ✅ | vazio = sem preço riscado; se preenchido, > `preco` |
| G | `selo` | ✅ | texto curto (ver V5); vazio = sem selo |
| H | `ativo` | ✅ | `SIM` / `NÃO` (lista suspensa) |

### Aba `PROMOCOES`

| Col | Cabeçalho | Edita | Regra |
| :-- | :-- | :-- | :-- |
| A | `id` | 🔒 | `900`, `901`, `902` |
| B | `titulo` | ✅ | nome da oferta; obrigatório se `ativo = SIM` |
| C | `variacao` | ✅ | ex.: "3 sacos de 15kg" |
| D | `descricao` | ✅ | texto curto exibido ao abrir o card |
| E | `preco` | ✅ | número > 0; obrigatório se `ativo = SIM` |
| F | `preco_de` | ✅ | vazio ou > `preco` |
| G | `selo` | ✅ | ex.: "Só esta semana" |
| H | `imagem_de` | ✅ | id de um produto da aba `PRODUTOS`; obrigatório se `ativo = SIM` |
| I | `ativo` | ✅ | `SIM` / `NÃO` |

## Validação

A Action valida o payload inteiro **antes** de escrever qualquer coisa. Qualquer violação
aborta o sync completo — nunca há sincronização parcial. O erro volta para o cliente como
alerta na planilha, nomeando a linha e o motivo.

| # | Regra | Motivo |
| :-- | :-- | :-- |
| V1 | `id` presente, numérico e único na planilha | nomes se repetem; casar por nome colide no primeiro dia. Id desconhecido pula e avisa (ver D1), duplicado aborta |
| V2 | `preco_de` > `preco` quando ambos preenchidos | `-{Math.round((1 - price/originalPrice) * 100)}%` renderiza `-0%` ou literalmente `--5%` quando `preco_de ≤ preco` |
| V3 | `preco_de` preenchido com `preco` vazio é rejeitado | o card esconde o selo de desconto quando não há preço e cai em "Consulte valores"; o preço riscado sumiria em silêncio e o cliente repreencheria sem entender |
| V4 | `preco` / `preco_de` chegam como número, não string | ver abaixo |
| V5 | `selo` acima de ~126px de largura renderizada gera **aviso**, não erro | o CSS já garante que não quebra o layout; o aviso só informa que vai truncar |
| V6 | Vaga com `ativo = SIM` exige `titulo`, `preco` e `imagem_de` válido | vaga meia-preenchida renderiza card quebrado |
| V7 | Nenhum commit quando o JSON resultante é idêntico ao atual | sem isso, 24 deploys idênticos por dia |

**Sobre V4 — não parsear string de locale.** As colunas E e F são formatadas como número
na planilha e o Apps Script lê com `getValues()`, que devolve um `number` de JavaScript
já resolvido. Nada de `getDisplayValues()` + parse de vírgula: isso reintroduz o risco
clássico de `130,00` virar `13000`. Célula que não chegar como número é rejeitada pela
validação, não é objeto de tentativa de parse.

O commit da Action é feito pelo `GITHUB_TOKEN`, que não re-dispara workflows mas dispara
a Vercel normalmente (ela observa o push). Não há risco de loop e não é preciso guarda.

## Correções necessárias

### C1 — Selos sobrepostos no mobile (bug já em produção)

Medido com o CSS compilado, renderizando o markup real do `ProductCard` nas larguras de
card efetivas (`grid-cols-2` + `gap-4` + `px-4` do container):

| Selo | chars | folga @360px | folga @390px | folga @414px |
| :-- | --: | --: | --: | --: |
| `Oferta` | 6 | 26px | 41px | 53px |
| `Economico` | 9 | **0px** | 15px | 27px |
| `3 por R$10` | 10 | 8px | 23px | 35px |
| `100% Natural` | 12 | **−16px** | **−1px** | 11px |
| `Black Friday` | 12 | **−10px** | 5px | 17px |
| `Versão pequena` | 14 | **−31px** | **−16px** | **−4px** |
| `Leve 3 pague 2` | 14 | **−17px** | **−2px** | 10px |
| `Últimas unidades` | 16 | **−38px** | **−23px** | **−11px** |

Valores negativos = os dois selos se sobrepõem. **Isso já acontece hoje no site:** o id 23
tem selo `Versão pequena` e desconto simultâneos (sobrepõe nos três tamanhos de tela), e
os ids 18 e 19 têm `100% Natural` com desconto (sobrepõe em 360 e 390px).

Contagem de caracteres é um proxy ruim — `3 por R$10` (10 chars, 81px) cabe onde
`Economico` (9 chars, 88px) não cabe, porque o selo é `uppercase` e a largura por
caractere varia.

**Correção, em duas camadas:**

1. **Layout:** mover o selo de desconto para o canto inferior direito da área da imagem,
   liberando a faixa superior inteira para o selo promocional. Espaço disponível passa de
   ~81px para ~130px a 360px, o que acomoda 16 caracteres (`Últimas unidades` = 127px).
   Sem isso, o limite de selo seria ~9 caracteres — curto demais para os textos
   promocionais que motivaram o projeto (`Leve 3 pague 2` tem 14).
2. **CSS defensivo:** `max-w-[calc(100%-24px)]` + `truncate` no selo promocional. Isso
   torna a sobreposição **impossível** por construção, qualquer que seja o texto.

Com a camada 2 no lugar, V5 vira aviso e não erro: não é preciso construir tabela de
largura por caractere dentro da Action para impedir um defeito que o CSS já impede. A
validação existe só para avisar o cliente de que o selo vai aparecer truncado.

### C2 — `active` não existe

`Product` (em `src/context/CartContext.tsx`) não tem o campo. Precisa nascer junto com o
JSON, mais o filtro no `App.tsx`. Pré-requisito de D2.

### C3 — Pastilhas de categoria são lista fixa

`src/App.tsx:432` tem `const categories = ['Todos', 'Cães', 'Gatos', 'Equinos',
'Petiscos', 'Acessorios']`, desacoplada dos produtos. Se o cliente desativar todos os
"Equinos", a pastilha permanece e leva ao estado vazio. Precisa ser derivada dos produtos
ativos. Dependência de D4 (a pastilha `Promoções` só existe quando há vaga ativa).

### C4 — Acentuação, com armadilha de lockstep

A categoria é `'Acessorios'` e o selo do id 2 é `'Economico'`. Várias descrições também
estão sem acento ("protecao", "reducao", "irresistivel", "padroes"), e o id 15 é
`'Purina Friskies Sache'`.

**Armadilha:** `Acessorios` aparece em dois lugares — no campo `category` dos produtos e
na lista `categories` da linha 432. Corrigir apenas um faz o filtro parar de casar e a
pastilha exibir o estado vazio. C3 elimina a duplicação de vez.

### C5 — Cosmético

`weight: 'Var.'` no id 18, abreviação solta entre pesos normais. O selo `'3 por R$10'` do
id 15 é uma oferta de combo fantasiada de selo — primeiro candidato natural a migrar para
uma vaga de promoção quando a aba `PROMOCOES` existir.

### Sem ação

O carrinho vive apenas em memória (`useState`, sem `localStorage`). Mudança de preço
durante uma visita não deixa carrinho com valor velho.

## Extração dos dados (passo zero)

Os 23 objetos saem de `src/App.tsx` para `src/data/products.json`, importado em build
time. Isto é pré-requisito de tudo: garante que a automação escreva apenas um arquivo de
dados, nunca código.

`products.json` em build time, não `public/` com fetch em runtime — uma LP de conversão
não deve ter estado de carregamento em cima do preço.

## Função "puxar catálogo"

Segunda função do Apps Script. Lê o `products.json` do GitHub e reescreve as colunas
travadas (A–D), acrescentando linhas para ids novos e preenchendo também os campos
comerciais com os valores atuais do repositório. Sem ela, quando um dev adiciona o produto
24 o cliente não tem linha para editá-lo.

## Segurança

- PAT de granularidade fina em Script Properties do Apps Script, escopo `Contents: Read
  and write`, restrito a este repositório.
- Planilha nunca publicada na web; o Apps Script lê com a própria autenticação.
- Se o build falhar, a Vercel mantém o deploy anterior no ar.

## Sequência de implementação

1. Extrair `products.json` + campo `active` + filtro no `App.tsx` (C2 + passo zero)
2. C1 (reposicionar selo de desconto), C3, C4, C5
3. Criar as 3 vagas de promoção desativadas (D4)
4. GitHub Action: merge por id + validações V1–V7
5. Apps Script: menu, trigger horário, "puxar catálogo"

Os passos 1–3 precisam estar no ar antes de a planilha poder ser validada contra qualquer
coisa.

## Pendência conhecida

A LP de um cliente pagante roda em plano Hobby da Vercel, o que é tecnicamente fora dos
termos de uso. Não bloqueia este projeto.
