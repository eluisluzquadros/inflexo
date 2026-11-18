import { test } from 'node:test';
import assert from 'node:assert/strict';
import { logistica, curvaturaLogistica, renderEstudo } from '../src/estudos.mjs';

test('o ponto indicado é uma inflexão real do modelo logístico', () => {
  assert.equal(logistica(0), .5);
  assert.equal(curvaturaLogistica(0), 0);
  assert.ok(curvaturaLogistica(-1) > 0);
  assert.ok(curvaturaLogistica(1) < 0);
  const svg = renderEstudo('inflexao');
  assert.match(svg, /cx="180" cy="253" r="4.5"/);
});

test('os estudos declaram modelo e não anunciam séries históricas ou efemérides', () => {
  assert.match(renderEstudo('inflexao'), /Não representa uma série histórica/);
  assert.match(renderEstudo('orbita'), /Não representa uma missão ou posição real/);
  for (const tipo of ['inflexao', 'orbita']) {
    const svg = renderEstudo(tipo);
    assert.equal(svg, renderEstudo(tipo));
    assert.doesNotMatch(svg, /TSE|urna|2026|51,79|64\.256/);
  }
});

test('identificadores SVG independentes evitam colisões entre as prévias', () => {
  assert.match(renderEstudo('inflexao', { id: 'hero-01' }), /aria-labelledby="hero-01-titulo hero-01-descricao"/);
  assert.throws(() => renderEstudo('inflexao', { id: '"><script>' }), /Identificador inválido/);
  assert.throws(() => renderEstudo('desconhecido'), /Estudo desconhecido/);
});
