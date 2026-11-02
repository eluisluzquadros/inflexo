import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { renderGraficoNacional, renderEstampaNacional, fatos, serieDesenho, janelaDaForma } from '../src/graficoNacional.mjs';

const curva = JSON.parse(readFileSync(new URL('../../../pipeline/output/curva_presidente_2t_2026_br.json', import.meta.url), 'utf8'));
const seg = (hms) => hms.split(':').map(Number).reduce((a, b) => a * 60 + b, 0);

test('a curva reconstruída bate com o total oficial do TSE', () => {
  assert.equal(curva.verificacao.votos_conferem, true);
  for (const [k, v] of Object.entries(curva.verificacao.diferencas)) {
    if (k !== 'secoes_vs_instaladas') assert.equal(v, 0, k);
  }
});

test('a peça imprime os números do dado, nos dois eixos', () => {
  const f = fatos(curva);
  assert.equal(f.votosTexto, '64.256.232');
  assert.equal(f.pctTexto, '51,79%');
  assert.equal(f.viradaHora, '20h23');
  assert.equal(f.viradaPctTexto, '47,2%');
  assert.equal(f.primeiroBoletim, '17h05');
  assert.equal(f.ultimoBoletim, '23h21');
  assert.equal(f.data, '25.10.2026');
  const relogio = renderGraficoNacional(curva);
  for (const s of ['64.256.232 • 51,79%', '25.10.2026', 'As linhas se cruzaram às 20h23.', 'das 17h07 às 21h07', '>19h<']) assert.ok(relogio.includes(s), s);
  const estampa = renderEstampaNacional(curva);
  for (const s of ['64.256.232 • 51,79%', '25.10.2026', 'Fonte: TSE']) assert.ok(estampa.includes(s), s);
  const urnas = renderGraficoNacional(curva, { eixo: 'urnas' });
  assert.ok(urnas.includes('com 47,2% das urnas apuradas'));
});

test('no relógio, a pausa sem boletins é desenhada em degrau, sem diagonal inventada', () => {
  const F = fatos(curva);
  const P = serieDesenho(curva, F, 'relogio');
  const antes = curva.serie_relogio.find((p) => p[0] === seg('17:07:27'));
  const degrau = P.find((p) => p.x === seg('19:03:37') && p.v === antes[1]);
  assert.ok(degrau, 'o valor das 17h07 se mantém até o boletim das 19h03');
});

test('a janela da forma sai do dado: da pausa de 1h56 até a curva estabilizar', () => {
  const J = janelaDaForma(curva.serie_relogio);
  assert.equal(J.inicio, seg('17:07:27'));
  assert.equal(J.pausaS, seg('19:03:37') - seg('17:07:27'));
  const fimV = curva.serie_relogio.find((p) => p[0] === J.fim)[1];
  const final = curva.serie_relogio.at(-1)[1];
  for (const [t, v] of curva.serie_relogio) if (t >= J.fim) assert.ok(Math.abs(v - final) <= 0.05, `estável depois de ${J.fim}`);
  assert.ok(Math.abs(fimV - final) <= 0.05);
  // o degrau cai perto da metade da largura
  const fracao = (seg('19:03:37') - J.inicio) / (J.fim - J.inicio);
  assert.ok(fracao > 0.45 && fracao < 0.52, String(fracao));
});

test('mesma entrada, mesmo SVG', () => {
  assert.equal(renderEstampaNacional(curva), renderEstampaNacional(curva));
  for (const eixo of ['relogio', 'urnas']) for (const tema of ['papel', 'tinta']) {
    assert.equal(renderGraficoNacional(curva, { tema, eixo }), renderGraficoNacional(curva, { tema, eixo }));
  }
});

test('nenhum nome, número ou partido de candidato na peça', () => {
  const nomes = Object.keys(curva.candidatos);
  const pecas = [
    ...['relogio', 'urnas'].map((eixo) => renderGraficoNacional(curva, { formato: 'stories', tema: 'tinta', eixo, marcaDagua: true })),
    renderEstampaNacional(curva),
  ];
  for (const svg of pecas) {
    const texto = svg.replace(/<[^>]+>/g, ' ');
    for (const proibido of ['LULA', 'BOLSONARO', ' PT ', ' PL ', ...nomes.map((n) => ` ${n} `)]) {
      assert.ok(!texto.toUpperCase().includes(proibido), proibido);
    }
  }
});

test('estilo fios: determinístico, com fonte e sem nomes', async () => {
  const { renderFiosNacional } = await import('../src/graficoNacional.mjs');
  const a = renderFiosNacional(curva);
  assert.equal(a, renderFiosNacional(curva));
  for (const s of ['25.10.2026', '64.256.232 • 51,79%', 'Fonte: TSE', 'feixe e pontos são estilo']) assert.ok(a.includes(s), s);
  assert.ok(!a.toUpperCase().includes('LULA') && !a.toUpperCase().includes('BOLSONARO'));
});
