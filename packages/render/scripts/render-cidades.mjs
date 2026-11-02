// Gera os pôsteres das capitais. Uso: node packages/render/scripts/render-cidades.mjs <dir_cidades> <dir_saida>
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { renderCidade } from '../src/cidade.mjs';

const [, , dir = 'pipeline/output/cidades', saida = 'out/cidades'] = process.argv;
const nacional = JSON.parse(readFileSync('pipeline/output/curva_presidente_2t_2026_br.json', 'utf8'));
mkdirSync(saida, { recursive: true });
const FONTES = 'https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..700;1,6..96,400..700&family=IBM+Plex+Mono:wght@400;500&display=swap';
for (const arq of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
  const cidade = JSON.parse(readFileSync(join(dir, arq), 'utf8'));
  for (const tema of ['papel', 'tinta']) {
    const nome = `${cidade.slug}_a2_${tema}`;
    const svg = renderCidade(cidade, nacional, { formato: 'a2', tema });
    writeFileSync(join(saida, `${nome}.svg`), svg);
    writeFileSync(join(saida, `${nome}.html`), `<!doctype html><meta charset="utf-8"><link rel="stylesheet" href="${FONTES}"><style>html,body{margin:0;background:#888}svg{display:block;width:100vw;height:auto}</style>${svg.replace(/ width="[^"]+mm" height="[^"]+mm"/, '')}`);
  }
  console.log(cidade.slug);
}
