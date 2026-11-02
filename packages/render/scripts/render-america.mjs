// Pôster "América do Sul invertida". Uso: node packages/render/scripts/render-america.mjs <mapa.json> <dir_saida>
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { renderRegiao } from '../src/regiao.mjs';

export function dadosAmerica(mapa) {
  return { regiao: 'América do Sul', titulo: 'América do Sul', continente: true, total: { pct_eleito: 51.79, boletins: 499205 }, ufs: mapa.ufs, mapa };
}
const [, , arq = 'pipeline/output/mapa_america_do_sul.json', saida = 'out/regiao'] = process.argv;
const mapa = JSON.parse(readFileSync(arq, 'utf8'));
const nacional = JSON.parse(readFileSync('pipeline/output/curva_presidente_2t_2026_br.json', 'utf8'));
mkdirSync(saida, { recursive: true });
for (const tema of ['papel', 'tinta']) {
  writeFileSync(join(saida, `america_do_sul_a2_${tema}.svg`), renderRegiao(dadosAmerica(mapa), nacional, { formato: 'a2', tema, divisas: false }));
}
console.log('america_do_sul');
