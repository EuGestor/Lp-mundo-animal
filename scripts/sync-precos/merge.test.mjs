import { describe, it, expect } from 'vitest';
import { merge, serializa, larguraSelo } from './merge.mjs';

const catalogo = () => [
  { id: 1, name: 'PowerDog Premium Carne', weight: '15kg', category: 'Cães',
    image: '/assets/powerdog.webp', price: 130, originalPrice: 145, active: true },
  { id: 2, name: 'PowerDog Premium Carne', weight: '25kg', category: 'Cães',
    image: '/assets/powerdog-25kg.webp', price: 190, originalPrice: 237.5,
    badge: 'Econômico', active: true },
  { id: 21, name: 'Colosso Roupinha de Lã', category: 'Acessórios',
    image: '/assets/colosso-roupinha.webp', quoteOnWhatsapp: true, active: true },
  { id: 900, name: '', image: '', category: 'Promoções', promoSlot: true, active: false },
];

const linha = (o) => ({ id: 1, preco: 130, preco_de: 145, selo: '', ativo: 'SIM', ...o });
const vaga = (o) => ({ id: 900, titulo: 'Combo 3x PowerDog', variacao: '3 sacos de 15kg',
  descricao: 'Leve tres e economize.', preco: 360, preco_de: 390, selo: 'Só esta semana',
  imagem_de: 1, ativo: 'SIM', ...o });

describe('merge por id', () => {
  it('sobrepoe apenas os campos comerciais', () => {
    const { produtos, erros } = merge(catalogo(), {
      produtos: [linha({ preco: 119.9, preco_de: 145, selo: 'Oferta' })],
    });
    expect(erros).toEqual([]);
    const p = produtos.find((x) => x.id === 1);
    expect(p.price).toBe(119.9);
    expect(p.badge).toBe('Oferta');
    // campos travados intactos
    expect(p.name).toBe('PowerDog Premium Carne');
    expect(p.image).toBe('/assets/powerdog.webp');
  });

  it('preserva a ordem do catalogo, nao a da planilha', () => {
    const { produtos } = merge(catalogo(), {
      produtos: [linha({ id: 2, preco: 190, preco_de: 237.5 }), linha({ id: 1 })],
    });
    expect(produtos.map((p) => p.id)).toEqual([1, 2, 21, 900]);
  });

  it('nao toca em produto ausente da planilha', () => {
    const { produtos, erros } = merge(catalogo(), { produtos: [linha({ id: 1 })] });
    expect(erros).toEqual([]);
    const p2 = produtos.find((x) => x.id === 2);
    expect(p2.price).toBe(190);
    expect(p2.active).toBe(true);
    expect(p2.badge).toBe('Econômico');
  });

  it('id desconhecido avisa mas nao aborta', () => {
    const { erros, avisos, produtos } = merge(catalogo(), {
      produtos: [linha({ id: 777 }), linha({ id: 1, preco: 99 })],
    });
    expect(erros).toEqual([]);
    expect(avisos.join()).toMatch(/777/);
    expect(produtos.find((p) => p.id === 1).price).toBe(99);
  });

  it('id duplicado aborta', () => {
    const { erros } = merge(catalogo(), { produtos: [linha({ id: 1 }), linha({ id: 1 })] });
    expect(erros.join()).toMatch(/mais de uma linha/);
  });
});

describe('validacao de precos', () => {
  it('V2: preco_de menor ou igual ao preco e rejeitado', () => {
    for (const preco_de of [130, 120]) {
      const { erros } = merge(catalogo(), { produtos: [linha({ preco: 130, preco_de })] });
      expect(erros.join()).toMatch(/MAIOR que/);
    }
  });

  it('V3: preco_de sem preco e rejeitado', () => {
    const { erros } = merge(catalogo(), { produtos: [linha({ preco: '', preco_de: 145 })] });
    expect(erros.join()).toMatch(/preco" vazio/);
  });

  it('V4: string em vez de numero e rejeitada, nunca parseada', () => {
    const { erros } = merge(catalogo(), { produtos: [linha({ preco: '130,00' })] });
    expect(erros.join()).toMatch(/precisa ser numero/);
  });

  it('preco vazio vira "consulte no WhatsApp"', () => {
    const { produtos, erros } = merge(catalogo(), {
      produtos: [linha({ id: 21, preco: '', preco_de: '' })],
    });
    expect(erros).toEqual([]);
    expect(produtos.find((p) => p.id === 21).price).toBeUndefined();
  });

  it('preco zero e rejeitado (celula vazia e o caminho certo)', () => {
    const { erros } = merge(catalogo(), { produtos: [linha({ preco: 0, preco_de: '' })] });
    expect(erros.join()).toMatch(/zero/);
  });

  it('selo vazio remove o selo existente', () => {
    const { produtos } = merge(catalogo(), { produtos: [linha({ id: 2, preco: 190, preco_de: 237.5, selo: '' })] });
    expect(produtos.find((p) => p.id === 2).badge).toBeUndefined();
  });

  it('selo longo avisa mas publica', () => {
    const { erros, avisos, produtos } = merge(catalogo(), {
      produtos: [linha({ selo: 'Promoção imperdível de verão' })],
    });
    expect(erros).toEqual([]);
    expect(avisos.join()).toMatch(/cortado/);
    expect(produtos.find((p) => p.id === 1).badge).toBe('Promoção imperdível de verão');
  });
});

describe('ativo', () => {
  it('NAO desativa sem remover do catalogo', () => {
    const { produtos } = merge(catalogo(), { produtos: [linha({ ativo: 'NÃO' })] });
    const p = produtos.find((x) => x.id === 1);
    expect(p.active).toBe(false);
    expect(p.name).toBe('PowerDog Premium Carne'); // continua no JSON p/ "puxar catalogo"
  });

  it('valor invalido aborta', () => {
    const { erros } = merge(catalogo(), { produtos: [linha({ ativo: 'talvez' })] });
    expect(erros.join()).toMatch(/SIM ou NÃO/);
  });
});

describe('vagas de promocao', () => {
  it('vaga ativa herda a foto do produto referenciado', () => {
    const { produtos, erros } = merge(catalogo(), { promocoes: [vaga()] });
    expect(erros).toEqual([]);
    const v = produtos.find((p) => p.id === 900);
    expect(v.image).toBe('/assets/powerdog.webp');
    expect(v.name).toBe('Combo 3x PowerDog');
    expect(v.price).toBe(360);
    expect(v.category).toBe('Promoções');
    expect(v.active).toBe(true);
  });

  it('V6: vaga ativa sem titulo, preco ou imagem_de aborta', () => {
    expect(merge(catalogo(), { promocoes: [vaga({ titulo: '' })] }).erros.join())
      .toMatch(/sem "titulo"/);
    expect(merge(catalogo(), { promocoes: [vaga({ preco: '', preco_de: '' })] }).erros.join())
      .toMatch(/sem "preco"/);
    expect(merge(catalogo(), { promocoes: [vaga({ imagem_de: 999 })] }).erros.join())
      .toMatch(/imagem_de/);
  });

  it('vaga desligada nao exige campo nenhum', () => {
    const { erros, produtos } = merge(catalogo(), {
      promocoes: [{ id: 900, ativo: 'NÃO' }],
    });
    expect(erros).toEqual([]);
    expect(produtos.find((p) => p.id === 900).active).toBe(false);
  });

  it('produto comum na aba de promocoes e rejeitado', () => {
    const { erros } = merge(catalogo(), { produtos: [linha({ id: 900 })] });
    expect(erros.join()).toMatch(/vaga de promocao/);
  });
});

describe('serializacao estavel (V7)', () => {
  it('mesmo payload gera o mesmo texto', () => {
    const a = merge(catalogo(), { produtos: [linha()] });
    const b = merge(catalogo(), { produtos: [linha()] });
    expect(serializa(a.produtos)).toBe(serializa(b.produtos));
  });

  it('payload sem mudanca reproduz o catalogo original', () => {
    const original = catalogo();
    const { produtos } = merge(original, {
      produtos: [linha({ id: 1, preco: 130, preco_de: 145, selo: '', ativo: 'SIM' })],
    });
    expect(serializa(produtos)).toBe(serializa(original));
  });
});

describe('larguraSelo', () => {
  it('cresce com o texto', () => {
    expect(larguraSelo('')).toBe(0);
    expect(larguraSelo('Oferta')).toBeLessThan(larguraSelo('Versão pequena'));
  });
});
