// Prévia da Inflexão Nº 01 · População humana (EXP-327).
// Uso: node packages/render/scripts/render-inflexao-populacao.mjs [formato=a3] [tema=papel]
// Saída: out/inflexoes/populacao_<formato>_<tema>.svg e .png (300 dpi nos formatos de impressão).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderInflexaoPopulacao } from '../src/inflexaoPopulacao.mjs';
import { rasterizar } from '../src/rasterizar.mjs';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const [, , formato = 'a3', tema = 'papel'] = process.argv;
const dados = JSON.parse(readFileSync(join(raiz, 'pipeline', 'output', 'populacao_mundo_wpp2024.json'), 'utf8'));
const svg = renderInflexaoPopulacao(dados, { formato, tema });
const pasta = join(raiz, 'out', 'inflexoes');
mkdirSync(pasta, { recursive: true });
const base = join(pasta, `populacao_${formato}_${tema}`);
writeFileSync(`${base}.svg`, svg);
const r = rasterizar(svg, formato);
writeFileSync(`${base}.png`, r.png);
console.log(`${base}.png`, r.largura, 'x', r.altura);
