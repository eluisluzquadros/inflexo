import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PRODUTOS, produto, escolher, renderPeca, temasDo } from '../src/catalogo.mjs';

const curva = JSON.parse(readFileSync(new URL('../../../pipeline/output/curva_presidente_2t_2026_br.json', import.meta.url), 'utf8'));

test('nenhum preço inventado: todos nulos até a cotação', () => {
  for (const p of PRODUTOS) assert.equal(p.preco, null, p.slug);
});

test('a edição em fios entra no pôster, no quadro e no digital', () => {
  for (const slug of ['poster', 'quadro', 'arquivo-digital']) assert.ok(produto(slug).estilos.includes('fios'), slug);
  assert.deepEqual(temasDo('fios'), ['marfim']);
});

test('escolha fora do permitido volta ao padrão', () => {
  const e = escolher(produto('quadro'), { estilo: 'estampa', tema: 'neon', formato: 'a0' });
  assert.deepEqual(e, { estilo: 'gravura', tema: 'papel', formato: 'a2' });
  assert.equal(escolher(produto('camiseta')).tema, 'branco');
  assert.equal(escolher(produto('poster'), { estilo: 'fios', tema: 'tinta' }).tema, 'marfim');
});

test('toda combinação renderiza, e a prévia leva marca d’água', () => {
  for (const p of PRODUTOS) for (const estilo of p.estilos) for (const tema of temasDo(estilo, p)) for (const formato of p.formatos) {
    const svg = renderPeca(curva, { estilo, tema, formato });
    assert.ok(svg.startsWith('<svg') && svg.includes('PRÉVIA INFLEXO'), `${p.slug}/${estilo}/${tema}/${formato}`);
    assert.ok(!renderPeca(curva, { estilo, tema, formato }, { previa: false }).includes('PRÉVIA INFLEXO'));
  }
});

test('edição numerada: a prévia mostra o lugar do número, o arquivo final traz o número', () => {
  const previa = renderPeca(curva, { estilo: 'fios', tema: 'marfim', formato: 'a2' }, { tiragem: 500 });
  assert.ok(previa.includes('Nº —/500'));
  const final = renderPeca(curva, { estilo: 'fios', tema: 'marfim', formato: 'a2' }, { previa: false, tiragem: 500, numero: 37 });
  assert.ok(final.includes('Nº 037/500') && !final.includes('PRÉVIA'));
});

test('urnas apuradas saiu da vitrine: nenhum produto oferece o estilo', () => {
  for (const p of PRODUTOS) assert.ok(!p.estilos.includes('urnas'), p.slug);
});
