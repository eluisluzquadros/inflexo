// Prévia da Inflexão Nº 02 · CO₂ no ar (EXP-327, H3).
// Uso: node packages/render/scripts/render-inflexao-co2.mjs [formato=a3] [tema=papel]
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderInflexaoCo2 } from '../src/inflexaoCo2.mjs';
import { rasterizar } from '../src/rasterizar.mjs';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const [, , formato = 'a3', tema = 'papel'] = process.argv;
const dados = JSON.parse(readFileSync(join(raiz, 'pipeline', 'output', 'co2_ar.json'), 'utf8'));
const svg = renderInflexaoCo2(dados, { formato, tema });
const pasta = join(raiz, 'out', 'inflexoes');
mkdirSync(pasta, { recursive: true });
const base = join(pasta, `co2_${formato}_${tema}`);
writeFileSync(`${base}.svg`, svg);
const r = rasterizar(svg, formato);
writeFileSync(`${base}.png`, r.png);
console.log(`${base}.png`, r.largura, 'x', r.altura);
