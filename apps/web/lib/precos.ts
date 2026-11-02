import 'server-only';

// Preços em centavos, calculados SEMPRE no servidor (o navegador nunca manda valor).
// PROVISÓRIOS: vêm da proposta em docs/07_PRECOS_PROPOSTA.md, ainda não aprovada nem cotada com os
// fornecedores. Só valem enquanto CHECKOUT_ATIVO estiver ligado em ambiente de teste.
const PRECO: Record<string, Record<string, number>> = {
  'arquivo-digital': { stories: 2900, tela: 2900, a2: 2900 },
  poster: { a3: 9900, a2: 14900 },
  quadro: { a3: 28900, a2: 44900 },
  camiseta: { quadrado: 13900 },
};
/** Acréscimo da tiragem numerada (Fios) nas peças físicas. */
const ACRESCIMO_FIOS = 5000;
/** Frete único provisório até a cotação real (Melhor Envio). */
export const FRETE_PROVISORIO = 2990;

export function precoDe(produto: string, estilo: string, formato: string): number | null {
  const base = PRECO[produto]?.[formato];
  if (!base) return null;
  return base + (estilo === 'fios' && produto !== 'arquivo-digital' ? ACRESCIMO_FIOS : 0);
}

export const reais = (centavos: number) => (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
