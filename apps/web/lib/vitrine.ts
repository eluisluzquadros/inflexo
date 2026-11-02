import 'server-only';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { previa, capitaisNordeste } from './loja';
import { TIRAGEM_FIOS } from './fila';

// Vitrine da loja: todas as peças, de todas as coleções, num formato só.
// Regras: preço só depois da cotação real (nulo = "Preço em definição"); selo só quando for verdade;
// imagem de vitrine é sempre prévia com marca d'água ou cena com a arte real aplicada.

export type Colecao = 'brasil' | 'nordeste' | 'regioes' | 'america' | 'momentos' | 'frases';
export type Suporte = 'quadro' | 'poster' | 'digital' | 'camiseta';
export type Tema = 'papel' | 'tinta' | 'marfim' | 'branco';

export type ItemVitrine = {
  slug: string;
  nome: string;
  linha: string;
  colecao: Colecao;
  suportes: Suporte[];
  formatos: string;
  temas: Tema[];
  arte: { svg: string } | { src: string; largura: number; altura: number } | { cartao: 'momentos' | 'frases' };
  foto?: string;
  /** foto de estúdio: capa do cartão; a arte da peça aparece ao passar o mouse */
  capa?: string;
  selo?: string;
  preco: number | null;
  href?: string;
  emPreparo?: boolean;
};

export const COLECOES: { id: Colecao; nome: string }[] = [
  { id: 'brasil', nome: 'Brasil' },
  { id: 'nordeste', nome: 'Nordeste' },
  { id: 'regioes', nome: 'Outras regiões' },
  { id: 'america', nome: 'América do Sul' },
  { id: 'momentos', nome: 'Momentos' },
  { id: 'frases', nome: 'Frases épicas' },
];
export const SUPORTES: { id: Suporte; nome: string }[] = [
  { id: 'quadro', nome: 'Quadro' },
  { id: 'poster', nome: 'Pôster' },
  { id: 'digital', nome: 'Digital' },
  { id: 'camiseta', nome: 'Camiseta' },
];

const SLUG_CAPITAL: Record<string, string> = {
  BA: 'salvador', PE: 'recife', CE: 'fortaleza', MA: 'sao_luis', PI: 'teresina',
  RN: 'natal', PB: 'joao_pessoa', AL: 'maceio', SE: 'aracaju',
};

type Uf = { nome: string; pct_eleito: number; boletins: number };
type Regiao = { regiao: string; total: { pct_eleito: number; boletins: number }; ufs: Record<string, Uf> };
const REGIOES: { slug: string; arquivo: string }[] = [
  { slug: 'norte', arquivo: 'norte' }, { slug: 'nordeste', arquivo: 'nordeste' }, { slug: 'centro-oeste', arquivo: 'centro_oeste' },
  { slug: 'sudeste', arquivo: 'sudeste' }, { slug: 'sul', arquivo: 'sul' },
];
const regiaoCache = new Map<string, Regiao>();
export function regiao(slug: string): Regiao | null {
  const r = REGIOES.find((x) => x.slug === slug);
  if (!r) return null;
  if (!regiaoCache.has(slug)) {
    const arq = path.join(process.cwd(), '..', '..', 'pipeline', 'output', `regiao_${r.arquivo}_2t_2026.json`);
    const d = JSON.parse(readFileSync(arq, 'utf8')) as Regiao;
    regiaoCache.set(slug, { regiao: d.regiao, total: d.total, ufs: d.ufs });
  }
  return regiaoCache.get(slug)!;
}
export const nordeste = () => regiao('nordeste')!;

/** Peças da Geografia da Virada fora do catálogo nacional: as cinco regiões e as nove capitais do Nordeste. */
export type PecaGeografia = { slug: string; nome: string; uf?: string; pct: number; boletins: number; tipo: 'regiao' | 'capital' | 'continente'; estados?: number; fotos?: { src: string; legenda: string }[] };
export function pecasGeografia(): PecaGeografia[] {
  const regioes = REGIOES.map(({ slug }) => { const r = regiao(slug)!; return { slug, nome: r.regiao, pct: r.total.pct_eleito, boletins: r.total.boletins, tipo: 'regiao' as const, estados: Object.keys(r.ufs).length }; });
  return [
    ...regioes,
    { slug: 'america-do-sul', nome: 'América do Sul', pct: 51.79, boletins: 499205, tipo: 'continente' as const,
      fotos: [
        { src: '/america/sala.jpg', legenda: 'Na sala, ao lado do aparador' }, { src: '/america/banco.jpg', legenda: 'No hall, sobre o banco' },
        { src: '/america/noite.jpg', legenda: 'À noite, com o Nordeste ao lado' }, { src: '/america/carvalho.jpg', legenda: 'Moldura de carvalho' },
        { src: '/america/preto.jpg', legenda: 'Moldura preta' }, { src: '/america/poster.jpg', legenda: 'Pôster com varão de madeira' },
        { src: '/america/celular.jpg', legenda: 'Arquivo digital' }] },
    ...capitaisNordeste().map((c) => ({ slug: SLUG_CAPITAL[c.uf], nome: c.nome, uf: c.uf, pct: c.pct_eleito, boletins: c.boletins, tipo: 'capital' as const })),
  ];
}
export function pecaGeografia(slug: string) {
  return pecasGeografia().find((p) => p.slug === slug) ?? null;
}

export function vitrine(): ItemVitrine[] {
  const nacional: ItemVitrine[] = [
    { slug: 'quadro-fios', nome: 'Fios', linha: 'Quadro · Brasil', colecao: 'brasil', suportes: ['quadro'], formatos: 'A3 · A2', temas: ['marfim'],
      arte: { svg: previa({ estilo: 'fios', tema: 'marfim', formato: 'a3' }) }, foto: '/mockups/quadro-fios.jpg', selo: `Tiragem de ${TIRAGEM_FIOS}`, preco: null, href: '/produto/quadro?estilo=fios' },
    { slug: 'quadro-gravura', nome: 'Gravura', linha: 'Quadro · Brasil', colecao: 'brasil', suportes: ['quadro'], formatos: 'A3 · A2', temas: ['papel', 'tinta'],
      arte: { svg: previa({ estilo: 'gravura', tema: 'papel', formato: 'a3' }) }, foto: '/casa/gravura.jpg', preco: null, href: '/produto/quadro?estilo=gravura' },
    { slug: 'poster-urnas', nome: 'Urnas apuradas', linha: 'Pôster · Brasil', colecao: 'brasil', suportes: ['poster'], formatos: 'A3 · A2', temas: ['papel', 'tinta'],
      arte: { svg: previa({ estilo: 'urnas', tema: 'papel', formato: 'a3' }) }, preco: null, href: '/produto/poster?estilo=urnas' },
    { slug: 'poster-gravura-tinta', nome: 'Gravura, Tinta', linha: 'Pôster · Brasil', colecao: 'brasil', suportes: ['poster'], formatos: 'A3 · A2', temas: ['tinta', 'papel'],
      arte: { svg: previa({ estilo: 'gravura', tema: 'tinta', formato: 'a3' }) }, preco: null, href: '/produto/poster?estilo=gravura&tema=tinta' },
    { slug: 'arquivo-digital', nome: 'Arquivo digital', linha: 'Stories, fundo de tela e A2', colecao: 'brasil', suportes: ['digital'], formatos: '9:16 · 16:9 · A2', temas: ['papel', 'tinta'],
      arte: { svg: previa({ estilo: 'gravura', tema: 'papel', formato: 'stories' }) }, foto: '/casa/digital.jpg', preco: null, href: '/produto/arquivo-digital' },
    { slug: 'camiseta', nome: 'Camiseta', linha: 'A Gravura em algodão branco', colecao: 'brasil', suportes: ['camiseta'], formatos: 'Estampa 30 × 30 cm', temas: ['branco'],
      arte: { svg: previa({ estilo: 'gravura', tema: 'branco', formato: 'quadrado' }) }, foto: '/casa/camiseta.jpg', preco: null, href: '/produto/camiseta' },
  ];
  const geografia: ItemVitrine[] = pecasGeografia().map((g) => ({
    slug: g.slug, nome: g.nome, linha: g.tipo === 'continente' ? 'Pôster · o continente invertido' : g.tipo === 'regiao' ? `Pôster · ${g.estados} ${g.estados === 1 ? 'estado' : 'estados'}` : `Pôster · ${g.uf}`, colecao: g.tipo === 'continente' ? 'america' : g.tipo === 'regiao' && g.slug !== 'nordeste' ? 'regioes' : 'nordeste',
    suportes: ['poster', 'quadro'], formatos: 'A3 · A2', temas: ['papel', 'tinta'],
    arte: { src: `/loja/${g.slug}.jpg`, largura: 900, altura: 1273 },
    foto: g.fotos?.[0].src,
    preco: null, href: `/geografia/${g.slug}`,
  }));
  const breve: ItemVitrine[] = [
    { slug: 'momentos', nome: 'Momentos', linha: 'Sua data, sua hora, sua frase', colecao: 'momentos', suportes: ['poster', 'quadro', 'digital'], formatos: 'A3 · A2 · digital', temas: ['papel'],
      arte: { cartao: 'momentos' }, preco: null, emPreparo: true },
    { slug: 'frases', nome: 'Frases épicas', linha: 'Tipografia com o crédito da obra', colecao: 'frases', suportes: ['poster', 'quadro'], formatos: 'A3 · A2', temas: ['papel', 'tinta'],
      arte: { cartao: 'frases' }, preco: null, emPreparo: true },
  ];
  const CAPAS: Record<string, string> = {
    'quadro-fios': '/casa/fios.jpg', 'quadro-gravura': '/casa/gravura.jpg', 'poster-gravura-tinta': '/casa/poster-gravura.jpg',
    'arquivo-digital': '/casa/digital.jpg', camiseta: '/casa/camiseta.jpg', salvador: '/casa/salvador.jpg', recife: '/casa/recife.jpg',
    fortaleza: '/casa/fortaleza.jpg', nordeste: '/casa/nordeste.jpg', 'america-do-sul': '/america/carvalho.jpg',
  };
  return [...nacional, ...geografia, ...breve].map((i) => ({ ...i, capa: CAPAS[i.slug] }));
}
