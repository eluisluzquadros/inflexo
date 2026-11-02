// Prévias rasterizadas (JPG, com marca d'água) da região e das capitais para a vitrine da loja.
// Uso: node packages/render/scripts/previas-geografia.mjs <playwright_path> <dir_saida>
// O arquivo de impressão nunca sai daqui: só a prévia de 900 px com "PRÉVIA INFLEXO".
import { readFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { renderCidade } from '../src/cidade.mjs';
import { renderRegiao } from '../src/regiao.mjs';

const [, , pw, saida = 'apps/web/public/loja'] = process.argv;
const { chromium } = createRequire(import.meta.url)(pw);
const nacional = JSON.parse(readFileSync('pipeline/output/curva_presidente_2t_2026_br.json', 'utf8'));
const FONTES = 'https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..700;1,6..96,400..700&family=IBM+Plex+Mono:wght@400;500&display=swap';
mkdirSync(saida, { recursive: true });

const pecas = [];
for (const [slug, arq] of [['norte', 'norte'], ['nordeste', 'nordeste'], ['centro-oeste', 'centro_oeste'], ['sudeste', 'sudeste'], ['sul', 'sul']]) {
  pecas.push([slug, renderRegiao(JSON.parse(readFileSync(`pipeline/output/regiao_${arq}_2t_2026.json`, 'utf8')), nacional, { formato: 'a2', tema: 'papel', marcaDagua: true })]);
}
{
  const mapa = JSON.parse(readFileSync('pipeline/output/mapa_america_do_sul.json', 'utf8'));
  const dados = { regiao: 'América do Sul', titulo: 'América do Sul', continente: true, total: { pct_eleito: 51.79, boletins: 499205 }, ufs: mapa.ufs, mapa };
  pecas.push(['america-do-sul', renderRegiao(dados, nacional, { formato: 'a2', tema: 'papel', divisas: false, marcaDagua: true })]);
}
for (const f of readdirSync('pipeline/output/cidades').filter((x) => x.endsWith('.json')).sort()) {
  const c = JSON.parse(readFileSync(join('pipeline/output/cidades', f), 'utf8'));
  pecas.push([c.slug, renderCidade(c, nacional, { formato: 'a2', tema: 'papel', marcaDagua: true })]);
}

const b = await chromium.launch({ channel: 'chrome' });
const p = await b.newPage({ viewport: { width: 900, height: 1300 }, deviceScaleFactor: 1 });
for (const [nome, svg] of pecas) {
  await p.setContent(`<!doctype html><meta charset="utf-8"><link rel="stylesheet" href="${FONTES}"><style>html,body{margin:0}svg{display:block;width:900px;height:auto}</style>${svg.replace(/ width="[^"]+mm" height="[^"]+mm"/, '')}`, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await (await p.$('svg')).screenshot({ path: join(saida, `${nome}.jpg`), type: 'jpeg', quality: 84 });
  console.log(nome);
}
await b.close();
