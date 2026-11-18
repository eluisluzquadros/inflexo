// Inflexões · Nº 02, CO₂ no ar (EXP-327, H3). Versão 2, para leitura leiga (a v1 em duas faixas não foi entendida):
// uma linha do tempo só. À esquerda, 800 mil anos de gelo da Antártida; à direita, ampliados, 1750 até hoje,
// com a quebra de escala marcada na peça. Uma linha horizontal marca o máximo dos 800 mil anos; o trecho da
// curva acima dela sai em vermelho. O ponto dourado fica no cruzamento calculado pelo pipeline, e a data mostra
// o intervalo entre os dois métodos (curva suavizada e amostras do gelo), não um ano escolhido.
import { FORMATOS } from './graficoNacional.mjs';
import { TEMAS_GRAVURA, filtrosGravura, papelGravura, abrirGravura, marcaDaguaGravura } from './gravura.mjs';
import { aleatorio, filamentos } from './inflexaoPopulacao.mjs';

const r2 = (n) => Math.round(n * 100) / 100;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const num = (n, casas) => new Intl.NumberFormat('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas }).format(n);

/** Divide uma polilinha em trechos abaixo e acima de y = yLim (y cresce para baixo), com o ponto de corte. */
function partir(pts, yLim) {
  const trechos = [];
  let atual = [pts[0]], acima = pts[0][1] < yLim;
  for (let i = 1; i < pts.length; i += 1) {
    const [xa, ya] = pts[i - 1], [xb, yb] = pts[i];
    const agora = yb < yLim;
    if (agora !== acima) {
      const k = (yLim - ya) / (yb - ya);
      const corte = [xa + k * (xb - xa), yLim];
      atual.push(corte);
      trechos.push({ acima, pts: atual });
      atual = [corte];
      acima = agora;
    }
    atual.push(pts[i]);
  }
  trechos.push({ acima, pts: atual });
  return trechos;
}

/**
 * @param {object} dados pipeline/output/co2_ar.json
 * @param {object} op { formato, tema, marcaDagua, cssFontes }
 */
export function renderInflexaoCo2(dados, op = {}) {
  const o = { formato: 'a3', tema: 'papel', marcaDagua: false, cssFontes: '', ...op };
  const f = FORMATOS[o.formato];
  if (!f) throw new Error(`Formato desconhecido: ${o.formato}`);
  const c = TEMAS_GRAVURA[o.tema];
  if (!c) throw new Error(`Tema desconhecido: ${o.tema}`);
  const W = f.larguraMm, H = f.alturaMm;
  const u = Math.min(W, H) / 100;
  const id = `ifx-inflexao-co2-${o.tema}-${W}x${H}`;
  const teto = dados.maximo_natural.ppm;
  const cruz = dados.cruzamento;
  const ultimo = dados.mauna_loa_ultimo;
  const rnd = aleatorio(19081913);

  // eixo do tempo em dois segmentos: [xa0, xa1] = 800 mil anos até 1750; [xb0, xb1] = 1750 até hoje
  const xa0 = W * 0.085, xa1 = W * 0.6, xb0 = W * 0.64, xb1 = W * 0.915;
  const antigo = dados.composto.map((p) => ({ t: -p.idade, v: p.ppm })).sort((a, b) => a.t - b.t);
  const t0 = antigo[0].t, t1 = -200; // 1750 = 200 anos antes de 1950
  const Xa = (t) => xa0 + ((t - t0) / (t1 - t0)) * (xa1 - xa0);
  const recente = [
    ...dados.law_dome_spline.filter((p) => p.ano >= 1750 && p.ano < dados.mauna_loa[0].ano),
    ...dados.mauna_loa,
  ];
  const Xb = (a) => xb0 + ((a - 1750) / (ultimo.ano - 1750)) * (xb1 - xb0);
  const alto = H * 0.25, baixo = H * 0.66;
  const Y = (v) => baixo - ((v - 160) / (440 - 160)) * (baixo - alto);
  const yTeto = Y(teto);

  const t = abrirGravura(W, H, `Inflexão Nº 02, CO₂ no ar: por 800 mil anos o CO₂ nunca passou de ${num(teto, 0)} partes por milhão; passou entre ${cruz.ano_spline} e ${cruz.ano_amostras_gelo} e chegou a ${num(ultimo.ppm, 0)} em ${ultimo.ano}.`, o.cssFontes);
  t.push(`<defs>${filtrosGravura(id, u)}</defs>`);
  t.push(papelGravura(W, H, id, c));

  // a linha do máximo, de ponta a ponta
  t.push(`<line x1="${r2(xa0)}" y1="${r2(yTeto)}" x2="${r2(xb1)}" y2="${r2(yTeto)}" stroke="${c.grafite}" stroke-width="${r2(0.12 * u)}" stroke-dasharray="${r2(0.7 * u)} ${r2(0.6 * u)}"/>`);

  // curva: segmento antigo em tinta; segmento recente partido em abaixo (tinta) e acima do máximo (vermelho)
  const sw = r2(0.24 * u);
  const grupo = (pts, cor) => `<g stroke="${cor}">${filamentos(pts, u, rnd).map((d) => `<path d="${d}"/>`).join('')}</g>`;
  t.push(`<g filter="url(#${id}-tinta)" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="${sw}">`);
  t.push(grupo(antigo.map((p) => [Xa(p.t), Y(p.v)]), c.tinta));
  for (const tr of partir(recente.map((p) => [Xb(p.ano), Y(p.ppm)]), yTeto)) t.push(grupo(tr.pts, tr.acima ? c.eleito : c.tinta));
  t.push('</g>');
  // a quebra de escala: o fim do segmento antigo encontra o começo do recente por um traço pontilhado
  const ya = Y(antigo.at(-1).v), yb = Y(recente[0].ppm);
  t.push(`<line x1="${r2(xa1)}" y1="${r2(ya)}" x2="${r2(xb0)}" y2="${r2(yb)}" stroke="${c.grafite}" stroke-width="${r2(0.14 * u)}" stroke-dasharray="${r2(0.25 * u)} ${r2(0.45 * u)}"/>`);
  const xq = (xa1 + xb0) / 2;
  t.push(`<line x1="${r2(xq)}" y1="${r2(alto - 1 * u)}" x2="${r2(xq)}" y2="${r2(baixo + 1.5 * u)}" stroke="${c.grafite}" stroke-width="${r2(0.08 * u)}" opacity="0.7"/>`);

  // ponto dourado no cruzamento e barra até o ano das amostras
  const xc = Xb(cruz.ano_spline), xs = Xb(cruz.ano_amostras_gelo);
  t.push(`<line x1="${r2(xc)}" y1="${r2(yTeto + 1.7 * u)}" x2="${r2(xs)}" y2="${r2(yTeto + 1.7 * u)}" stroke="${c.ouro}" stroke-width="${r2(0.35 * u)}" stroke-linecap="round"/>`);
  t.push(`<circle cx="${r2(xc)}" cy="${r2(yTeto)}" r="${r2(1.15 * u)}" fill="${c.ouro}"/>`);

  // rótulos em português simples
  const m = r2(1.6 * u);
  const rot = (x, y, txt, anc = 'middle', cor = c.grafite, cls = 'ifx-m', tam = m) => `<text class="${cls}" x="${r2(x)}" y="${r2(y)}" font-size="${tam}" fill="${cor}" text-anchor="${anc}">${esc(txt)}</text>`;
  t.push(rot(xa0, yTeto - 1.3 * u, `o máximo em 800 mil anos: ${num(teto, 0)}`, 'start'));
  t.push(rot(xb1, Y(ultimo.ppm) - 1.8 * u, `${ultimo.ano}: ${num(ultimo.ppm, 0)}`, 'end', c.eleito));
  t.push(rot(xa0, baixo + 4 * u, 'há 800 mil anos', 'start'));
  t.push(rot(xa1, baixo + 4 * u, '1750', 'end'));
  t.push(rot(xb0, baixo + 4 * u, '1750', 'start'));
  t.push(rot(xb1, baixo + 4 * u, String(ultimo.ano), 'end'));
  t.push(rot((xa0 + xa1) / 2, baixo + 8 * u, '← 800 mil anos, comprimidos →', 'middle', c.tinta));
  t.push(rot((xb0 + xb1) / 2, baixo + 8 * u, `← os últimos ${ultimo.ano - 1750} anos →`, 'middle', c.tinta));

  // título em linguagem simples, data e legenda
  t.push(rot(W / 2, H * 0.12, 'Por 800 mil anos, o ar nunca passou desta linha.', 'middle', c.tinta, 'ifx-d', r2(3.3 * u)));
  t.push(rot(W / 2, H * 0.12 + 4.6 * u, 'Gás carbônico (CO₂) no ar, em partes por milhão', 'middle', c.grafite, 'ifx-m', r2(1.6 * u)));
  t.push(rot(W / 2, H * 0.8, `${cruz.ano_spline}–${cruz.ano_amostras_gelo}`, 'middle', c.tinta, 'ifx-d', r2(3 * u)));
  const it = (y, s) => `<text class="ifx-d" x="${r2(W / 2)}" y="${r2(y)}" font-size="${r2(1.9 * u)}" font-style="italic" fill="${c.tinta}" text-anchor="middle">${esc(s)}</text>`;
  t.push(it(H * 0.835, 'Quando passou. Nunca mais voltou.'));
  t.push(`<text class="ifx-d" x="${r2(W / 2)}" y="${r2(H * 0.9)}" font-size="${r2(1.45 * u)}" letter-spacing="${r2(0.55 * u)}" fill="${c.tinta}" text-anchor="middle">INFLEXÃO Nº 02 · INFLEXO</text>`);
  const fs = r2(Math.max(0.78 * u, 0.0052 * H));
  const fonte = [
    'Medido em bolhas de ar presas no gelo da Antártida e, desde 1959, no ar do Havaí. Fontes: NOAA/NCEI e NOAA GML.',
    `${cruz.ano_spline}: curva suavizada do gelo; ${cruz.ano_amostras_gelo}: amostras do gelo (datação ±5 anos). Máximo: maior valor antes de 1750. O tremor das linhas é do desenho.`,
  ];
  fonte.forEach((s, i) => t.push(`<text class="ifx-m" x="${r2(W / 2)}" y="${r2(H * 0.95 + i * 1.5 * fs)}" font-size="${fs}" fill="${c.grafite}" text-anchor="middle">${esc(s)}</text>`));
  if (o.marcaDagua) t.push(marcaDaguaGravura(W, H, u, c));
  t.push('</svg>');
  return t.join('');
}
