// Gera as peças do gráfico nacional em SVG e uma página de prévia por peça (com as fontes do Google).
// Uso: node packages/render/scripts/render-nacional.mjs <curva.json> <dir_saida>
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { renderGraficoNacional, renderEstampaNacional } from '../src/graficoNacional.mjs';

const [, , arquivoCurva = 'pipeline/output/curva_presidente_2t_2026_br.json', saida = 'out/nacional'] = process.argv;
const curva = JSON.parse(readFileSync(arquivoCurva, 'utf8'));
mkdirSync(saida, { recursive: true });

const FONTES = 'https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..700;1,6..96,400..700&family=IBM+Plex+Mono:wght@400;500&display=swap';

function gravar(nome, svg) {
  writeFileSync(join(saida, `${nome}.svg`), svg);
  const html = `<!doctype html><meta charset="utf-8"><link rel="stylesheet" href="${FONTES}"><style>html,body{margin:0;background:#888}svg{display:block;width:100vw;height:auto}</style>${svg.replace(/ width="[^"]+mm" height="[^"]+mm"/, '')}`;
  writeFileSync(join(saida, `${nome}.html`), html);
  console.log(nome);
}

for (const tema of ['branco', 'papel', 'tinta']) gravar(`estampa_quadrado_${tema}`, renderEstampaNacional(curva, { tema }));
for (const eixo of ['relogio', 'urnas']) for (const formato of ['a2', 'stories', 'tela']) for (const tema of ['papel', 'tinta']) {
  gravar(`nacional_${eixo}_${formato}_${tema}`, renderGraficoNacional(curva, { formato, tema, eixo }));
}

import { renderFiosNacional } from '../src/graficoNacional.mjs';
for (const formato of ['a2', 'stories']) gravar(`fios_${formato}`, renderFiosNacional(curva, { formato }));
