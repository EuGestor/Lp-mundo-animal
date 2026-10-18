// Números e contato exibidos em mais de um lugar do site. Uma fonte só evita
// que o hero, o texto e o rodapé contem histórias diferentes.
export const FACTS = {
  phoneDisplay: '(31) 3831-1702',
  instagramFollowers: 1620,
  storeItems: 500,
  googleRating: 4.5,
  googleReviews: 48,
  since: 1998,
} as const;

export const formatInt = (n: number) => new Intl.NumberFormat('pt-BR').format(n);
