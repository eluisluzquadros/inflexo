// Catálogo da fase 1: só o gráfico nacional. Preço fica nulo até a cotação real (EXP-316, H2):
// a loja nunca mostra preço inventado.
import { renderGraficoNacional, renderEstampaNacional, renderFiosNacional, FORMATOS as FORMATOS_MM } from '../../render/src/graficoNacional.mjs';
import { renderGravuraNacional } from '../../render/src/gravura.mjs';

export const ESTILOS = {
  gravura: { nome: 'Gravura', descricao: 'A curva da noite em três filamentos de tinta sobre papel, das 17h07 às 21h07. O ponto dourado marca o último cruzamento.' },
  // relógio com degrau e estrela: fica no motor (testes e método), fora da vitrine
  forma: { nome: 'Relógio', descricao: 'A curva no relógio, das 17h07 às 21h07, em linhas firmes.' },
  fios: { nome: 'Fios', descricao: 'A mesma curva em feixes de fios finos sobre papel marfim.' },
  // urnas apuradas: descontinuado na vitrine em 02/11/2026; fica no motor e no catálogo para pedidos antigos
  urnas: { nome: 'Urnas apuradas', descricao: 'A curva de 1% a 100% das urnas, com o meio da apuração aberto.' },
  estampa: { nome: 'Estampa', descricao: 'Número, curva, estrela e data, com traço de giz.' },
};

export const TEMAS = {
  papel: 'Papel',
  tinta: 'Tinta',
  marfim: 'Marfim',
  branco: 'Branco',
};

export const FORMATOS = {
  a3: 'A3 (29,7 × 42 cm)',
  a2: 'A2 (42 × 59,4 cm)',
  stories: 'Stories 9:16',
  tela: 'Fundo de tela 16:9',
  quadrado: 'Estampa 30 × 30 cm',
};

export const PRODUTOS = [
  {
    slug: 'arquivo-digital', nome: 'Arquivo digital', tipo: 'digital',
    estilos: ['gravura', 'fios'], formatos: ['stories', 'tela', 'a2'],
    resumo: 'PNG em alta para stories, fundo de tela ou impressão própria.',
    entrega: 'Na hora, por link, depois do pagamento confirmado.', preco: null,
  },
  {
    slug: 'poster', nome: 'Pôster', tipo: 'fisico',
    estilos: ['gravura', 'fios'], formatos: ['a3', 'a2'],
    resumo: 'Impressão em papel fosco, enviada em tubo.',
    entrega: 'Prazo do fornecedor, informado antes do pagamento.', preco: null,
  },
  {
    slug: 'quadro', nome: 'Quadro', tipo: 'fisico',
    estilos: ['gravura', 'fios'], formatos: ['a3', 'a2'],
    resumo: 'Moldura de madeira com passe-partout, pronta para pendurar.',
    fotos: [{ src: '/casa/gravura.jpg', estilo: 'gravura' }, { src: '/mockups/quadro-fios.jpg', estilo: 'fios' }],
    entrega: 'Prazo do fornecedor, informado antes do pagamento.', preco: null,
  },
  {
    slug: 'camiseta', nome: 'Camiseta', tipo: 'fisico',
    estilos: ['gravura'], formatos: ['quadrado'],
    resumo: 'Algodão branco com a Gravura estampada.',
    fotos: [{ src: '/casa/camiseta.jpg', estilo: 'gravura' }],
    entrega: 'Prazo do fornecedor, informado antes do pagamento.', preco: null,
  },
];

/** Temas permitidos para um estilo: fios é sempre marfim; estampa e a camiseta, sempre branco. */
export function temasDo(estilo, p = null) {
  if (p && p.slug === 'camiseta') return ['branco'];
  if (estilo === 'fios') return ['marfim'];
  if (estilo === 'estampa') return ['branco'];
  return ['papel', 'tinta'];
}

export function produto(slug) {
  return PRODUTOS.find((p) => p.slug === slug) ?? null;
}

/** Normaliza a escolha do cliente: qualquer valor fora do permitido volta ao padrão do produto. */
export function escolher(p, pedido = {}) {
  const estilo = p.estilos.includes(pedido.estilo) ? pedido.estilo : p.estilos[0];
  const temas = temasDo(estilo, p);
  const tema = temas.includes(pedido.tema) ? pedido.tema : temas[0];
  const formato = p.formatos.includes(pedido.formato) ? pedido.formato : p.formatos.at(-1);
  return { estilo, tema, formato };
}

/** Todas as combinações (estilo, tema, formato) que um produto vende. */
export function combinacoes(p) {
  return p.estilos.flatMap((estilo) => temasDo(estilo, p).flatMap((tema) => p.formatos.map((formato) => ({ estilo, tema, formato }))));
}

/**
 * Arquivo final do digital: o mesmo para todo comprador da combinação (sem número de tiragem), gerado uma vez
 * fora do servidor por packages/render/scripts/publicar-catalogo-digital.mjs e guardado no Storage (EXP-329).
 */
export function arquivoDigital({ estilo, tema, formato }) {
  const nome = `inflexo-${estilo}-${tema}-${formato}.png`;
  return { nome, caminho: `catalogo/${nome}` };
}

/** Primeira tiragem numerada dos fios físicos (pôster e quadro). Compromisso comercial: confirmar antes de abrir a venda. */
export const TIRAGEM_FIOS = 500;

/** A peça sai numerada (Nº x/500) só nos fios físicos; o arquivo digital não tem tiragem. */
export function numerada(p, { estilo }) {
  return estilo === 'fios' && p.tipo === 'fisico';
}

/** Combinações que a vitrine (/loja) e a coleção mostram como prévia, além das páginas de produto. */
export const PREVIAS_VITRINE = [
  { estilo: 'fios', tema: 'marfim', formato: 'a3' },
  { estilo: 'gravura', tema: 'papel', formato: 'a3' },
  { estilo: 'gravura', tema: 'tinta', formato: 'a3' },
  { estilo: 'gravura', tema: 'papel', formato: 'stories' },
  { estilo: 'gravura', tema: 'branco', formato: 'quadrado' },
];
export const LARGURA_PREVIA = 1200;

/**
 * Prévia pronta de uma combinação: WebP com marca d'água, rasterizado do MESMO SVG da peça (regra 3) por
 * packages/render/scripts/previas-prontas.mjs. Desenhar o SVG dentro da página custava de 1,1 a 1,6 MB de HTML
 * e até ~200 ms de CPU por visita (EXP-330, EXP-331). `numerada` traz o "Nº —/500" dos fios físicos.
 */
export function previaPronta({ estilo, tema, formato }, { numerada = false } = {}) {
  const f = FORMATOS_MM[formato];
  if (!f) throw new Error(`formato desconhecido: ${formato}`);
  const nome = `${estilo}-${tema}-${formato}${numerada ? '-numerada' : ''}`;
  return { src: `/previas/${nome}.webp`, largura: LARGURA_PREVIA, altura: Math.round((LARGURA_PREVIA * f.alturaMm) / f.larguraMm) };
}

/** Todas as prévias que o site mostra: vitrine e cada combinação de cada produto. Sem repetição. */
export function previasProntas() {
  const lista = [
    ...PREVIAS_VITRINE.map((e) => ({ ...e, numerada: false })),
    ...PRODUTOS.flatMap((p) => combinacoes(p).map((e) => ({ ...e, numerada: numerada(p, e) }))),
  ];
  const vistas = new Set();
  return lista.filter((e) => { const k = previaPronta(e, e).src; return !vistas.has(k) && vistas.add(k); });
}

/** SVG da peça escolhida. Prévia sempre com marca d'água; o arquivo final sai só depois do pagamento. */
/** @param {{ previa?: boolean, tiragem?: number|null, numero?: number|null }} [op] */
export function renderPeca(curva, escolha, { previa = true, tiragem = null, numero = null } = {}) {
  const { estilo, tema, formato } = escolha;
  if (estilo === 'gravura') return renderGravuraNacional(curva, { formato, tema, marcaDagua: previa });
  if (estilo === 'estampa') return renderEstampaNacional(curva, { formato, tema, marcaDagua: previa });
  if (estilo === 'fios') return renderFiosNacional(curva, { formato, marcaDagua: previa, tiragem, numero });
  return renderGraficoNacional(curva, { formato, tema, eixo: estilo === 'urnas' ? 'urnas' : 'relogio', marcaDagua: previa });
}
