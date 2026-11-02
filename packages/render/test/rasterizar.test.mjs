import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { rasterizar, pixelsDoFormato } from '../src/rasterizar.mjs';
import { renderPeca } from '../../core/src/catalogo.mjs';

const CURVA = 'pipeline/output/curva_presidente_2t_2026_br.json';
const curva = JSON.parse(readFileSync(CURVA, 'utf8'));
const sha = (b) => createHash('sha256').update(b).digest('hex');

test('dimensões do arquivo final: telas no tamanho nativo, impressão a 300 dpi', () => {
  assert.deepEqual(pixelsDoFormato('stories'), [1080, 1920]);
  assert.deepEqual(pixelsDoFormato('tela'), [3840, 2160]);
  assert.deepEqual(pixelsDoFormato('a2'), [4961, 7016]);
  assert.deepEqual(pixelsDoFormato('a3'), [3508, 4961]);
});

test('stories: PNG nas dimensões certas, sem marca d’água e determinístico', () => {
  const svg = renderPeca(curva, { estilo: 'gravura', tema: 'papel', formato: 'stories' }, { previa: false });
  assert.ok(!/PRÉVIA/.test(svg));
  const a = rasterizar(svg, 'stories'), b = rasterizar(svg, 'stories');
  assert.equal(a.png.subarray(1, 4).toString(), 'PNG');
  assert.equal(a.largura, 1080); assert.equal(a.altura, 1920);
  assert.equal(sha(a.png), sha(b.png));
});

test('processo filho gera o arquivo e recusa combinação fora do catálogo', () => {
  const dir = mkdtempSync(join(tmpdir(), 'inflexo-'));
  try {
    const saida = join(dir, 'x.png');
    const out = execFileSync(process.execPath, ['packages/render/scripts/arquivo-final.mjs', CURVA, 'fios', 'marfim', 'stories', saida], { encoding: 'utf8' });
    assert.equal(JSON.parse(out).largura, 1080);
    assert.ok(existsSync(saida));
    const r = spawnSync(process.execPath, ['packages/render/scripts/arquivo-final.mjs', CURVA, 'urnas', 'papel', 'stories', join(dir, 'y.png')], { encoding: 'utf8' });
    assert.equal(r.status, 3);
    assert.ok(!existsSync(join(dir, 'y.png')));
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
