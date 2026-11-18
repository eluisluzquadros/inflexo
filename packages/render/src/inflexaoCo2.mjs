// Inflexões · Nº 02, CO₂ no ar (EXP-327, H3). Mesma gramática da Nº 01:
//   faixa de cima: 800 mil anos de gelo da Antártida, que nunca passaram do teto (linha tracejada), e na borda
//   direita a subida da era industrial;
//   faixa de baixo: 1750–2025 em escala anual (Law Dome suavizado até 1958, Mauna Loa depois), com o ponto
//   dourado no cruzamento do teto calculado pelo pipeline.
// A data mostra o intervalo entre os dois métodos (curva suavizada e amostras do gelo), não um ano único.
import { FORMATOS } from './graficoNacional.mjs';
import { TEMAS_GRAVURA, filtrosGravura, papelGravura, abrirGravura, marcaDaguaGravura } from './gravura.mjs';
import { aleatorio, filamentos } from './inflexaoPopulacao.mjs';

const r2 = (n) => Math.round(n * 100) / 100;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const num = (n, casas) => new Intl.NumberFormat('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas }).format(n);

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
  const x0 = W * 0.085, x1 = W * 0.915;
  const rnd = aleatorio(19081913);

  // série recente única: Law Dome suavizado até 1958, Mauna Loa de 1959 em diante
  const recente = [
    ...dados.law_dome_spline.filter((p) => p.ano < dados.mauna_loa[0].ano),
    ...dados.mauna_loa,
  ];

  // faixa de cima: 800 mil anos (idade em anos antes de 1950), mais a ponta industrial na borda direita
  const profundo = [
    ...dados.composto.map((p) => ({ t: -p.idade, v: p.ppm })).sort((a, b) => a.t - b.t),
    ...recente.filter((p) => p.ano >= 1750).map((p) => ({ t: p.ano - 1950, v: p.ppm })),
  ];
  const t0 = profundo[0].t, t1 = profundo.at(-1).t;
  const Xp = (t) => x0 + ((t - t0) / (t1 - t0)) * (x1 - x0);
  const altoP = H * 0.2, baixoP = H * 0.43;
  const Yp = (v) => baixoP - ((v - 160) / (440 - 160)) * (baixoP - altoP);

  // faixa de baixo: 1750–último ano
  const z = recente.filter((p) => p.ano >= 1750);
  const a0 = 1750, a1 = ultimo.ano;
  const Xz = (a) => x0 + ((a - a0) / (a1 - a0)) * (x1 - x0);
  const altoZ = H * 0.53, baixoZ = H * 0.72;
  const Yz = (v) => baixoZ - ((v - 270) / (440 - 270)) * (baixoZ - altoZ);

  const t = abrirGravura(W, H, `Inflexão Nº 02, CO₂ no ar: entre ${cruz.ano_spline} e ${cruz.ano_amostras_gelo} o ar passou do maior valor de 800 mil anos, ${num(teto, 1)} ppm.`, o.cssFontes);
  t.push(`<defs>${filtrosGravura(id, u)}</defs>`);
  t.push(papelGravura(W, H, id, c));

  const sw = r2(0.22 * u);
  const linha = (pts) => filamentos(pts, u, rnd).map((d) => `<path d="${d}"/>`).join('');
  // tetos tracejados (o limite dos 800 mil anos) nas duas faixas
  const tracejado = (y) => `<line x1="${r2(x0)}" y1="${r2(y)}" x2="${r2(x1)}" y2="${r2(y)}" stroke="${c.grafite}" stroke-width="${r2(0.1 * u)}" stroke-dasharray="${r2(0.6 * u)} ${r2(0.6 * u)}"/>`;
  t.push(tracejado(Yp(teto)));
  t.push(tracejado(Yz(teto)));
  t.push(`<g filter="url(#${id}-tinta)" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="${sw}" stroke="${c.tinta}">`);
  t.push(linha(profundo.map((p) => [Xp(p.t), Yp(p.v)])));
  t.push(linha(z.map((p) => [Xz(p.ano), Yz(p.ppm)])));
  t.push('</g>');

  // ponto dourado no cruzamento (curva suavizada) e marca do ano das amostras; fio até a borda da faixa de cima
  const xc = Xz(cruz.ano_spline), xa = Xz(cruz.ano_amostras_gelo);
  t.push(`<line x1="${r2(xc)}" y1="${r2(Yz(teto) + 1.6 * u)}" x2="${r2(xa)}" y2="${r2(Yz(teto) + 1.6 * u)}" stroke="${c.ouro}" stroke-width="${r2(0.35 * u)}" stroke-linecap="round"/>`);
  t.push(`<line x1="${r2(Xp(t1))}" y1="${r2(Yp(teto))}" x2="${r2(xc)}" y2="${r2(Yz(teto))}" stroke="${c.ouro}" stroke-width="${r2(0.1 * u)}" stroke-dasharray="${r2(0.4 * u)} ${r2(0.5 * u)}"/>`);
  t.push(`<circle cx="${r2(Xp(t1))}" cy="${r2(Yp(teto))}" r="${r2(0.55 * u)}" fill="${c.ouro}"/>`);
  t.push(`<circle cx="${r2(xc)}" cy="${r2(Yz(teto))}" r="${r2(1.15 * u)}" fill="${c.ouro}"/>`);

  // rótulos discretos
  const m = r2(1.55 * u);
  const rot = (x, y, txt, anc = 'middle') => `<text class="ifx-m" x="${r2(x)}" y="${r2(y)}" font-size="${m}" fill="${c.grafite}" text-anchor="${anc}">${esc(txt)}</text>`;
  t.push(rot(x0, baixoP + 3.6 * u, 'há 800 mil anos', 'start'));
  t.push(rot(x1, baixoP + 3.6 * u, 'hoje', 'end'));
  t.push(rot(x0, Yp(teto) - 1.2 * u, `teto de 800 mil anos · ${num(teto, 1)} ppm`, 'start'));
  t.push(rot(x0, baixoZ + 3.6 * u, '1750', 'start'));
  t.push(rot(x1, baixoZ + 3.6 * u, String(a1), 'end'));
  t.push(rot(x1, Yz(ultimo.ppm) - 1.6 * u, `${num(ultimo.ppm, 0)} ppm`, 'end'));

  // cabeçalho, data e legenda
  t.push(`<text class="ifx-m" x="${r2(W / 2)}" y="${r2(H * 0.11)}" font-size="${r2(3.1 * u)}" fill="${c.tinta}" text-anchor="middle">${esc(`${num(teto, 1)} ppm • 800 mil anos`)}</text>`);
  t.push(`<text class="ifx-d" x="${r2(W / 2)}" y="${r2(H * 0.8)}" font-size="${r2(3 * u)}" letter-spacing="${r2(0.3 * u)}" fill="${c.tinta}" text-anchor="middle">${esc(`${cruz.ano_spline}–${cruz.ano_amostras_gelo}`)}</text>`);
  const it = (y, s) => `<text class="ifx-d" x="${r2(W / 2)}" y="${r2(y)}" font-size="${r2(1.9 * u)}" font-style="italic" fill="${c.tinta}" text-anchor="middle">${esc(s)}</text>`;
  t.push(it(H * 0.835, 'Os anos em que o ar passou do teto de 800 mil anos.'));
  t.push(it(H * 0.835 + 2.8 * u, `Em ${ultimo.ano}, chegou a ${num(ultimo.ppm, 0)} ppm.`));
  t.push(`<text class="ifx-d" x="${r2(W / 2)}" y="${r2(H * 0.9)}" font-size="${r2(1.45 * u)}" letter-spacing="${r2(0.55 * u)}" fill="${c.tinta}" text-anchor="middle">INFLEXÃO Nº 02 · INFLEXO</text>`);
  const fs = r2(Math.max(0.78 * u, 0.0052 * H));
  const fonte = [
    'Fontes: NOAA/NCEI, gelo da Antártida, 800 mil anos (Bereiter et al. 2015) e Law Dome (MacFarling Meure et al. 2006); NOAA GML, Mauna Loa.',
    `${cruz.ano_spline}: curva suavizada de Law Dome. ${cruz.ano_amostras_gelo}: amostras do gelo, datação ±5 anos. Teto: maior valor antes de 1750. O tremor das linhas é do desenho.`,
  ];
  fonte.forEach((s, i) => t.push(`<text class="ifx-m" x="${r2(W / 2)}" y="${r2(H * 0.95 + i * 1.5 * fs)}" font-size="${fs}" fill="${c.grafite}" text-anchor="middle">${esc(s)}</text>`));
  if (o.marcaDagua) t.push(marcaDaguaGravura(W, H, u, c));
  t.push('</svg>');
  return t.join('');
}
