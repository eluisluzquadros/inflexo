// Arquivo final em PNG, rasterizado sem navegador (resvg) com as fontes estáticas de packages/render/fontes.
// O SVG é o mesmo da prévia (regra 3: um único motor); só muda a marca d'água, que o arquivo final não tem.
// Determinístico: mesmo SVG e mesmo formato dão os mesmos bytes. Comparado com o Chrome em 02/11/2026
// (EXP-317, H2): 0,38 % a 0,86 % de pixels diferentes, só em bordas de traço e de letra.
//
// Memória (medida em 02/11/2026): stories ~100 MB de pico; A2 a 300 dpi com textura de papel ~600 MB.
// Desenhar em faixas não serve: o filtro de deslocamento do resvg entra em pânico quando a faixa corta a
// região do filtro. Por isso a loja chama isto num processo filho (scripts/arquivo-final.mjs): um pânico ou
// falta de memória derruba o filho, não o site.
import { readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import { FORMATOS } from './graficoNacional.mjs';

const PASTA_FONTES = join(dirname(fileURLToPath(import.meta.url)), '..', 'fontes');
const FONTES = readdirSync(PASTA_FONTES).filter((f) => f.endsWith('.ttf')).map((f) => join(PASTA_FONTES, f));

/** Formatos de tela saem no tamanho nativo do aparelho; os de impressão, a 300 dpi. */
const PIXELS_TELA = { stories: [1080, 1920], tela: [3840, 2160] };
const DPI_IMPRESSAO = 300;

/** Largura e altura em pixels do arquivo final de um formato. */
export function pixelsDoFormato(formato) {
  if (PIXELS_TELA[formato]) return PIXELS_TELA[formato];
  const f = FORMATOS[formato];
  if (!f) throw new Error(`formato desconhecido: ${formato}`);
  const px = (mm) => Math.round((mm / 25.4) * DPI_IMPRESSAO);
  return [px(f.larguraMm), px(f.alturaMm)];
}

/** Rasteriza o SVG na largura do formato. Devolve o PNG e as dimensões reais. */
export function rasterizar(svg, formato) {
  const [largura] = pixelsDoFormato(formato);
  const img = new Resvg(svg, {
    fitTo: { mode: 'width', value: largura },
    font: { fontFiles: FONTES, loadSystemFonts: false, defaultFontFamily: 'Bodoni Moda' },
    shapeRendering: 2, textRendering: 1, imageRendering: 0,
  }).render();
  return { png: Buffer.from(img.asPng()), largura: img.width, altura: img.height };
}
