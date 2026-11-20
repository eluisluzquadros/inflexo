/** Estado editorial da loja. A abertura exige alterar esta fase e habilitar o checkout. */
export const LANCAMENTO_EM_BREVE = true;
export const STATUS_LOJA = 'Em breve';

export const COLECOES_MARCA = [
  { id: 'inflexoes', nome: 'Inflexões', linha: 'Os pontos de mudança na Terra e na humanidade.' },
  { id: 'orbitas', nome: 'Órbitas', linha: 'O tempo, os ciclos e o universo.' },
  { id: 'movimentos', nome: 'Movimentos', linha: 'O gesto, as ideias e as histórias que nos transformam.' },
] as const;

export const INTERESSES = [
  { id: 'home-inflexoes', nome: 'Todas as novidades' },
  ...COLECOES_MARCA.map((c) => ({ id: `home-colecao-${c.id}`, nome: c.nome })),
  { id: 'home-vestuario', nome: 'Moletons, bonés e camisetas' },
] as const;
