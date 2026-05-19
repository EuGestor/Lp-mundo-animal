# Mundo Animal Pet Shop — Landing Page

LP de alta conversão para Mundo Animal Pet Shop / Clínica Veterinária Mundo Animal de Itabira/MG.
Stack: HTML + CSS + JS vanilla, sem build step, deploy na Vercel via GitHub.

## Editar conteúdo

### Trocar número do WhatsApp
Abra `app.js`, linha do `CONFIG.whatsapp` (topo do arquivo):

```js
const CONFIG = {
  whatsapp: 'https://wa.me/5531999999999', // ← trocar aqui
  ...
};
```

Comite e push — Vercel faz deploy em ~30 segundos.

### Adicionar/editar produto
Em `app.js`, array `PRODUTOS`. Cada item tem o formato:

```js
{
  id: 'kebab-case-unico',
  nome: 'Nome do Produto',
  categoria: 'Cães', // Cães | Gatos | Petiscos | Acessorios | Equinos
  peso: '15kg',
  preco: 145.90,
  precoOriginal: 169.90, // null se não tem desconto
  imagem: 'assets/produtos/arquivo.jpg',
  descricao: '...',
  destaque: 'MAIS_PEDIDO', // opcional
}
```

Coloque a imagem em `assets/produtos/`.

### Editar dados da loja
Em `app.js`, dentro de `CONFIG.loja`: endereço, telefone, horário, CNPJ, anos no mercado.

### Editar copy das seções
Direto em `index.html`. Estrutura comentada com `<!-- (N) Nome da seção -->`.

## Rodar localmente

```bash
cd /root/lp-mundo-animal
python3 -m http.server 8080
# Abrir http://localhost:8080
```

## Deploy

Push para `main` no GitHub. Vercel faz deploy automático.

## Estrutura de arquivos

- `index.html` — 13 seções + carrinho drawer + FAB
- `styles.css` — tokens (`:root`) + componentes + responsivo
- `app.js` — CONFIG + PRODUTOS + Cart state + render + WhatsApp builder
- `assets/` — imagens (logo, banners, 22 produtos, instagram, og-image)
- `robots.txt`, `sitemap.xml` — SEO

## Placeholders pendentes (a substituir quando cliente fornecer)

- `CONFIG.whatsapp` — atualmente shortlink SalesRoute provisório
- `CONFIG.loja.anosNoMercado` — atual: `'X'`
- `CONFIG.loja.cnpj`
- `CONFIG.loja.horario` — verificar com cliente
- Fotos do Vinícius/equipe em `assets/instagram/` — atualmente placeholders verdes (IG bloqueia raspagem; cliente deve enviar fotos)
