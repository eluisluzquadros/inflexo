// Gera o arquivo final (PNG, sem marca d'água) de uma escolha do catálogo e grava em <saida>.
// Roda em processo separado da loja: um pânico do rasterizador ou falta de memória não derruba o site.
// Uso: node packages/render/scripts/arquivo-final.mjs <curva.json> <estilo> <tema> <formato> <saida.png>
// Escreve no stdout uma linha JSON com largura, altura e bytes.
import { readFileSync, writeFileSync } from 'node:fs';
import { renderPeca, produto, escolher } from '../../core/src/catalogo.mjs';
import { rasterizar } from '../src/rasterizar.mjs';

const [, , arquivoCurva, estilo, tema, formato, saida] = process.argv;
if (!saida) { console.error('uso: arquivo-final.mjs <curva.json> <estilo> <tema> <formato> <saida.png>'); process.exit(2); }

// a escolha passa pela mesma normalização da loja: só combinações que o catálogo oferece
const digital = produto('arquivo-digital');
const e = escolher(digital, { estilo, tema, formato });
if (e.estilo !== estilo || e.tema !== tema || e.formato !== formato) {
  console.error(`combinação fora do catálogo: ${estilo}/${tema}/${formato}`); process.exit(3);
}
const curva = JSON.parse(readFileSync(arquivoCurva, 'utf8'));
const r = rasterizar(renderPeca(curva, e, { previa: false }), e.formato);
writeFileSync(saida, r.png);
console.log(JSON.stringify({ largura: r.largura, altura: r.altura, bytes: r.png.length }));
