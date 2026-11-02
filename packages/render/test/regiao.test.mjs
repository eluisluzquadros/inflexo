import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { renderRegiao } from '../src/regiao.mjs';

const ler = (p) => JSON.parse(readFileSync(new URL(`../../../pipeline/output/${p}`, import.meta.url), 'utf8'));
const dados = ler('regiao_nordeste_2t_2026.json');
const nacional = ler('curva_presidente_2t_2026_br.json');

test('as 9 UFs do Nordeste batem com o oficial, voto a voto', () => {
  assert.equal(Object.keys(dados.ufs).length, 9);
  for (const d of Object.values(dados.verificacao.diferencas_por_uf)) for (const v of Object.values(d)) assert.equal(v, 0);
});

test('versão limpa: número nacional, total da região, data e fontes; sem rótulos por estado', () => {
  const svg = renderRegiao(dados, nacional);
  for (const s of ['64.256.232 • 51,79%', 'NORDESTE: 69,37%', '25.10.2026', 'IBGE', 'NORDESTE<']) assert.ok(svg.includes(s), s);
  for (const v of ['71,31%', '75,88%']) assert.ok(!svg.includes(v), `resultado por estado fora do desenho: ${v}`);
  assert.ok(!/>(BA|PE|CE|MA|PI|RN|PB|AL|SE)</.test(svg), 'sem siglas de estado no desenho');
});

test('determinística e sem nome, número ou partido', () => {
  const a = renderRegiao(dados, nacional, { tema: 'tinta' });
  assert.equal(a, renderRegiao(dados, nacional, { tema: 'tinta' }));
  const texto = a.replace(/<[^>]+>/g, ' ').toUpperCase();
  for (const p of ['LULA', 'BOLSONARO', ' PT ', ' PL ']) assert.ok(!texto.includes(p), p);
});
