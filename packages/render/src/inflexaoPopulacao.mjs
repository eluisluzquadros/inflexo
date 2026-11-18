// Inflexões · Nº 01, População humana (EXP-327). Mesma linguagem da Gravura: papel, três filamentos de tinta,
// tremor da mão, ponto dourado. O traçado é o dado da ONU (WPP 2024, variante média):
//   faixa de cima: a população, 1950–2100 (estimativa contínua até 2023; projeção tracejada, em grafite);
//   faixa de baixo: o aumento de cada ano, onde a inflexão aparece como o topo da onda.
// O ponto dourado fica no ano calculado pelo pipeline (maior aumento absoluto), nunca escolhido à mão.
// Funções puras e determinísticas.
import { FORMATOS } from './graficoNacional.mjs';
import { TEMAS_GRAVURA, filtrosGravura, papelGravura, abrirGravura, marcaDaguaGravura } from './gravura.mjs';

const r2 = (n) => Math.round(n * 100) / 100;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const num = (n, casas) => new Intl.NumberFormat('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas }).format(n);

export function aleatorio(semente) {
  let s = semente >>> 0;
  return () => { s = (s + 0x6D2B79F5) >>> 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

/** Três filamentos de tinta ao longo de pontos já em coordenadas da folha, com o tremor da Gravura. */
export function filamentos(pts, u, rnd) {
  const espaco = 0.42 * u;
  return [-1, 0, 1].map((kk) => {
    const fase = [rnd() * 6.28, rnd() * 6.28, rnd() * 6.28];
    const amp = 0.06 * u * (0.6 + rnd() * 0.6);
    return pts.map(([x, y], i) => {
      const t = i / Math.max(1, pts.length - 1);
      const tremor = amp * (Math.sin(t * 37 + fase[0]) * 0.5 + Math.sin(t * 91 + fase[1]) * 0.3 + Math.sin(t * 233 + fase[2]) * 0.2)
        + 0.12 * u * Math.sin(t * 7.5 + 1.1);
      return `${i ? 'L' : 'M'}${r2(x)} ${r2(y + kk * espaco + tremor)}`;
    }).join('');
  });
}

/** Interpola a série anual em passos de 1/4 de ano, para o traço não sair em degraus. */
function densa(serie, campo) {
  const out = [];
  for (let i = 0; i < serie.length - 1; i += 1) {
    const a = serie[i], b = serie[i + 1];
    for (let k = 0; k < 4; k += 1) out.push({ ano: a.ano + k / 4, v: a[campo] + (b[campo] - a[campo]) * (k / 4), projecao: a.projecao && b.projecao });
  }
  const z = serie.at(-1);
  out.push({ ano: z.ano, v: z[campo], projecao: z.projecao });
  return out;
}

/**
 * @param {object} dados pipeline/output/populacao_mundo_wpp2024.json
 * @param {object} op { formato, tema, marcaDagua, cssFontes }
 */
export function renderInflexaoPopulacao(dados, op = {}) {
  const o = { formato: 'a3', tema: 'papel', marcaDagua: false, cssFontes: '', ...op };
  const f = FORMATOS[o.formato];
  if (!f) throw new Error(`Formato desconhecido: ${o.formato}`);
  const c = TEMAS_GRAVURA[o.tema];
  if (!c) throw new Error(`Tema desconhecido: ${o.tema}`);
  const W = f.larguraMm, H = f.alturaMm;
  const u = Math.min(W, H) / 100;
  const id = `ifx-inflexao-pop-${o.tema}-${W}x${H}`;
  const S = dados.serie;
  const I = dados.inflexao;
  const pico = dados.pico_populacao_projetado;
  const ano0 = S[0].ano, ano1 = S.at(-1).ano;
  const x0 = W * 0.085, x1 = W * 0.915;
  const X = (ano) => x0 + ((ano - ano0) / (ano1 - ano0)) * (x1 - x0);
  // faixa da população: 2 a 11 bilhões
  const popTopo = H * 0.25, popBase = H * 0.55;
  const Yp = (mi) => popBase - ((mi - 2000) / (11000 - 2000)) * (popBase - popTopo);
  // faixa do aumento anual: 0 a 100 milhões
  const aumBase = H * 0.71, aumTopo = H * 0.615;
  const Ya = (mi) => aumBase - (mi / 100) * (aumBase - aumTopo);
  const rnd = aleatorio(19901231);

  const t = abrirGravura(W, H, `Inflexão Nº 01, população humana: o maior aumento anual foi em ${I.ano}, ${num(I.aumento_mi, 1)} milhões de pessoas.`, o.cssFontes);
  t.push(`<defs>${filtrosGravura(id, u)}</defs>`);
  t.push(papelGravura(W, H, id, c));

  const sw = r2(0.25 * u);
  const desenha = (pts, Yf, cor, tracejado) => {
    const linhas = filamentos(pts.map((p) => [X(p.ano), Yf(p.v)]), u, rnd);
    const dash = tracejado ? ` stroke-dasharray="${r2(1.1 * u)} ${r2(0.9 * u)}"` : '';
    return `<g stroke="${cor}"${dash}>${linhas.map((d) => `<path d="${d}"/>`).join('')}</g>`;
  };
  const pop = densa(S, 'populacao_mi');
  const aum = densa(S, 'aumento_mi');
  const corte = dados.ultimo_ano_estimado;
  t.push(`<g filter="url(#${id}-tinta)" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="${sw}">`);
  t.push(desenha(pop.filter((p) => p.ano <= corte), Yp, c.tinta, false));
  t.push(desenha(pop.filter((p) => p.ano >= corte), Yp, c.grafite, true));
  t.push(desenha(aum.filter((p) => p.ano <= corte), Ya, c.tinta, false));
  t.push(desenha(aum.filter((p) => p.ano >= corte), Ya, c.grafite, true));
  t.push('</g>');

  // linha de base do aumento e o fio que liga o topo da onda ao ponto dourado na curva da população
  const xi = X(I.ano);
  t.push(`<line x1="${r2(x0)}" y1="${r2(aumBase)}" x2="${r2(x1)}" y2="${r2(aumBase)}" stroke="${c.grafite}" stroke-width="${r2(0.08 * u)}" opacity="0.6"/>`);
  t.push(`<line x1="${r2(xi)}" y1="${r2(Yp(I.populacao_mi) + 1.6 * u)}" x2="${r2(xi)}" y2="${r2(Ya(I.aumento_mi) - 1.2 * u)}" stroke="${c.ouro}" stroke-width="${r2(0.1 * u)}" stroke-dasharray="${r2(0.4 * u)} ${r2(0.5 * u)}"/>`);
  t.push(`<circle cx="${r2(xi)}" cy="${r2(Yp(I.populacao_mi))}" r="${r2(1.15 * u)}" fill="${c.ouro}"/>`);
  t.push(`<circle cx="${r2(xi)}" cy="${r2(Ya(I.aumento_mi))}" r="${r2(0.55 * u)}" fill="${c.ouro}"/>`);

  // rótulos discretos, em mono
  const m = r2(1.55 * u);
  const rot = (x, y, txt, anc = 'middle', cor = c.grafite) => `<text class="ifx-m" x="${r2(x)}" y="${r2(y)}" font-size="${m}" fill="${cor}" text-anchor="${anc}">${esc(txt)}</text>`;
  t.push(rot(x0, Yp(S[0].populacao_mi) + 3.2 * u, `${ano0} · ${num(S[0].populacao_mi / 1000, 1)} bi`, 'start'));
  t.push(rot(X(pico.ano), Yp(pico.populacao_mi) - 2.4 * u, `${pico.ano} · ${num(pico.populacao_mi / 1000, 1)} bi · projeção`));
  const minAum = Math.min(...S.map((p) => p.aumento_mi));
  const yAnos = Math.max(Ya(0), Ya(minAum)) + 3.6 * u;
  t.push(rot(x1, yAnos, `${ano1}`, 'end'));
  t.push(rot(x0, yAnos, `${ano0}`, 'start'));
  t.push(rot(x0 - 1 * u, Ya(0) + 0.5 * u, '0', 'end'));
  t.push(rot(x1, aumTopo - 1.2 * u, 'pessoas a mais por ano', 'end'));

  // cabeçalho e data, como na Gravura
  t.push(`<text class="ifx-m" x="${r2(W / 2)}" y="${r2(H * 0.135)}" font-size="${r2(3.1 * u)}" fill="${c.tinta}" text-anchor="middle">${esc(`${num(I.aumento_mi, 1)} milhões a mais • ${I.ano}`)}</text>`);
  t.push(`<text class="ifx-d" x="${r2(W / 2)}" y="${r2(H * 0.8)}" font-size="${r2(3 * u)}" letter-spacing="${r2(0.3 * u)}" fill="${c.tinta}" text-anchor="middle">${esc(String(I.ano))}</text>`);
  const it = (y, s) => `<text class="ifx-d" x="${r2(W / 2)}" y="${r2(y)}" font-size="${r2(1.9 * u)}" font-style="italic" fill="${c.tinta}" text-anchor="middle">${esc(s)}</text>`;
  t.push(it(H * 0.835, 'O ano em que a humanidade mais cresceu.'));
  t.push(it(H * 0.835 + 2.8 * u, 'Depois dele, a curva segue subindo, cada vez mais devagar.'));
  t.push(`<text class="ifx-d" x="${r2(W / 2)}" y="${r2(H * 0.9)}" font-size="${r2(1.45 * u)}" letter-spacing="${r2(0.55 * u)}" fill="${c.tinta}" text-anchor="middle">INFLEXÃO Nº 01 · INFLEXO</text>`);
  const s2 = I.segundo_maior_fora_do_plato;
  const fs = r2(Math.max(0.78 * u, 0.0052 * H));
  const fonte = [
    `Fonte: ONU, World Population Prospects 2024, variante média. Estimativa até ${corte}; projeção tracejada.`,
    `Inflexão: o maior aumento anual da população. Em ${s2.ano} o aumento quase empatou (${num(s2.aumento_mi, 1)} milhões). O tremor das linhas é do desenho.`,
  ];
  fonte.forEach((s, i) => t.push(`<text class="ifx-m" x="${r2(W / 2)}" y="${r2(H * 0.95 + i * 1.5 * fs)}" font-size="${fs}" fill="${c.grafite}" text-anchor="middle">${esc(s)}</text>`));
  if (o.marcaDagua) t.push(marcaDaguaGravura(W, H, u, c));
  t.push('</svg>');
  return t.join('');
}
