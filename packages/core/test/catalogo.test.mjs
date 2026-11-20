import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { PRODUTOS, produto, escolher, renderPeca, temasDo, combinacoes, arquivoDigital, PREVIAS_VITRINE, previaPronta } from '../src/catalogo.mjs';

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

test('digital: cada combinação vendida tem um arquivo pronto próprio, e só elas', () => {
  const lista = combinacoes(produto('arquivo-digital'));
  assert.equal(lista.length, 9); // gravura papel/tinta + fios marfim, × stories/tela/a2
  for (const e of lista) assert.deepEqual(escolher(produto('arquivo-digital'), e), e, JSON.stringify(e));
  const caminhos = lista.map((e) => arquivoDigital(e).caminho);
  assert.equal(new Set(caminhos).size, lista.length);
  assert.deepEqual(arquivoDigital({ estilo: 'fios', tema: 'marfim', formato: 'a2' }),
    { nome: 'inflexo-fios-marfim-a2.png', caminho: 'catalogo/inflexo-fios-marfim-a2.png' });
});

test('vitrine: cada prévia tem imagem pronta, leve e de uma combinação vendida', () => {
  for (const e of PREVIAS_VITRINE) {
    const { src, largura, altura } = previaPronta(e);
    assert.ok(PRODUTOS.some((p) => p.estilos.includes(e.estilo) && temasDo(e.estilo, p).includes(e.tema) && p.formatos.includes(e.formato)), src);
    const arq = new URL(`../../../apps/web/public${src}`, import.meta.url);
    assert.ok(existsSync(arq), `falta ${src}: rodar node packages/render/scripts/previas-vitrine.mjs`);
    assert.ok(statSync(arq).size < 250 * 1024, `${src} acima de 250 KB`);
    assert.ok(largura === 900 && altura > 0);
  }
});

test('urnas apuradas saiu da vitrine: nenhum produto oferece o estilo', () => {
  for (const p of PRODUTOS) assert.ok(!p.estilos.includes('urnas'), p.slug);
});
