import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { renderGravuraNacional, ultimoCruzamento, cruzamentos } from '../src/gravura.mjs';
import { fatos, serieSuave } from '../src/graficoNacional.mjs';

const curva = JSON.parse(readFileSync(new URL('../../../pipeline/output/curva_presidente_2t_2026_br.json', import.meta.url), 'utf8'));

test('gravura é determinística', () => {
  assert.equal(renderGravuraNacional(curva, { formato: 'a2' }), renderGravuraNacional(curva, { formato: 'a2' }));
});

test('ponto dourado no último cruzamento, no mesmo minuto da virada medida', () => {
  const F = fatos(curva);
  const P = serieSuave(curva, F, 8);
  assert.equal(cruzamentos(P), 2);
  const x = ultimoCruzamento(P);
  const virada = F.virada.t.split(':').map(Number).reduce((a, b) => a * 60 + b, 0);
  assert.ok(Math.abs(x - virada) < 90, `cruzamento desenhado ${x}s × virada ${virada}s`);
});

test('gravura não tem estrela, tem três filamentos por lado e declara o que é desenho', () => {
  const svg = renderGravuraNacional(curva, { formato: 'a3' });
  assert.ok(!/L[\d.]+ [\d.]+Z" fill="#/.test(svg), 'sem estrela');
  assert.equal((svg.match(/<path d="M/g) || []).length, 6);
  assert.match(svg, /o tremor das linhas é do desenho/);
  assert.match(svg, /64\.256\.232 • 51,79%/);
});

test('prévia leva marca d’água', () => {
  assert.match(renderGravuraNacional(curva, { formato: 'a3', marcaDagua: true }), /PRÉVIA INFLEXO/);
});

test('cidade usa a Gravura: ponto dourado, sem estrela, ruas em cinza', async () => {
  const { renderCidade } = await import('../src/cidade.mjs');
  const cidade = JSON.parse(readFileSync(new URL('../../../pipeline/output/cidades/recife.json', import.meta.url), 'utf8'));
  const svg = renderCidade(cidade, curva);
  assert.match(svg, /#8F8A81/);
  assert.match(svg, /61,27%/);
  assert.equal(svg, renderCidade(cidade, curva));
});
