import 'server-only';
import { readFileSync } from 'node:fs';
import path from 'node:path';
// módulo JS puro, compartilhado com o pipeline e os testes (allowJs)
import * as catalogo from '../../../packages/core/src/catalogo.mjs';
import { renderRegiao } from '../../../packages/render/src/regiao.mjs';

export type Escolha = { estilo: string; tema: string; formato: string };
export type Produto = {
  slug: string; nome: string; tipo: 'digital' | 'fisico'; estilos: string[]; formatos: string[];
  resumo: string; entrega: string; preco: number | null;
  fotos?: { src: string; estilo: string }[];
};

let curvaCache: unknown = null;
export function curva() {
  if (!curvaCache) {
    const arquivo = path.join(process.cwd(), '..', '..', 'pipeline', 'output', 'curva_presidente_2t_2026_br.json');
    curvaCache = JSON.parse(readFileSync(arquivo, 'utf8'));
  }
  return curvaCache as { verificacao: { reconstruido: { boletins: number } } };
}

export const PRODUTOS = catalogo.PRODUTOS as Produto[];
export const ESTILOS = catalogo.ESTILOS as Record<string, { nome: string; descricao: string }>;
export const TEMAS = catalogo.TEMAS as Record<string, string>;
export const FORMATOS = catalogo.FORMATOS as Record<string, string>;
export const produto = catalogo.produto as (slug: string) => Produto | null;
export const escolher = catalogo.escolher as (p: Produto, pedido?: Partial<Escolha>) => Escolha;
export const temasDo = catalogo.temasDo as (estilo: string, p?: Produto | null) => string[];

/** SVG da prévia, sem o tamanho em mm (o CSS controla a largura). Sempre com marca d'água. */
export function previa(escolha: Escolha, extra: { tiragem?: number } = {}): string {
  const render = catalogo.renderPeca as (c: unknown, e: Escolha, o: object) => string;
  return render(curva(), escolha, { previa: true, ...extra }).replace(/ width="[^"]+mm" height="[^"]+mm"/, '');
}

// ---------- Geografia da Virada: região e capitais ----------

const lerSaida = (arquivo: string) => JSON.parse(readFileSync(path.join(process.cwd(), '..', '..', 'pipeline', 'output', arquivo), 'utf8'));

/** Pôster regional (A2, papel) com marca d'água, sem o tamanho em mm. */
export function previaRegiao(regiao: string): string {
  const render = renderRegiao as (d: unknown, n: unknown, o: object) => string;
  return render(lerSaida(`regiao_${regiao}_2t_2026.json`), curva(), { formato: 'a2', tema: 'papel', marcaDagua: true })
    .replace(/ width="[^"]+mm" height="[^"]+mm"/, '');
}

export type Capital = { uf: string; nome: string; pct_eleito: number; boletins: number; conferido_oficial: boolean };
/** As nove capitais do Nordeste, conferidas com o TSE, da maior para a menor fatia da curva vermelha. */
export function capitaisNordeste(): Capital[] {
  const d = lerSaida('capitais_nordeste_2t_2026.json') as Record<string, Omit<Capital, 'uf'>>;
  return Object.entries(d).map(([uf, c]) => ({ uf, ...c })).filter((c) => c.conferido_oficial).sort((a, b) => b.pct_eleito - a.pct_eleito);
}
