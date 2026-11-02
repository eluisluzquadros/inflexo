// Gera o pôster regional em SVG + prévia HTML. Uso: node packages/render/scripts/render-regiao.mjs <dados.json> <dir_saida>
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { renderRegiao } from '../src/regiao.mjs';

const [, , arq = 'pipeline/output/regiao_nordeste_2t_2026.json', saida = 'out/regiao'] = process.argv;
const dados = JSON.parse(readFileSync(arq, 'utf8'));
const nacional = JSON.parse(readFileSync('pipeline/output/curva_presidente_2t_2026_br.json', 'utf8'));
mkdirSync(saida, { recursive: true });
const FONTES = 'https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..700;1,6..96,400..700&family=IBM+Plex+Mono:wght@400;500&display=swap';
for (const tema of ['papel', 'tinta']) {
  const nome = `${dados.regiao.toLowerCase()}_a2_${tema}`;
  const svg = renderRegiao(dados, nacional, { formato: 'a2', tema });
  writeFileSync(join(saida, `${nome}.svg`), svg);
  writeFileSync(join(saida, `${nome}.html`), `<!doctype html><meta charset="utf-8"><link rel="stylesheet" href="${FONTES}"><style>html,body{margin:0;background:#888}svg{display:block;width:100vw;height:auto}</style>${svg.replace(/ width="[^"]+mm" height="[^"]+mm"/, '')}`);
  console.log(nome);
}
