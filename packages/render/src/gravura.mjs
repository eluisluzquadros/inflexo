// Estilo "Gravura": a curva real da apuração em três filamentos finos de tinta por trajetória, sobre papel.
// O traçado é o dado (série do relógio, 17h07 → 21h07, em média móvel declarada na peça); os três filamentos,
// o tremor da tinta e a textura do papel são estilo. O ponto dourado fica no último cruzamento das linhas
// desenhadas. Sem estrela. As duas trajetórias terminam no mesmo x. Funções puras e determinísticas.
// As peças de região e cidade usam as mesmas partes (papel, traço, marca d'água).
import { FORMATOS, fatos, serieSuave } from './graficoNacional.mjs';

export const FONTE_DISPLAY = "'Bodoni Moda','Bodoni 72',Didot,Georgia,serif";
export const FONTE_MONO = "'IBM Plex Mono',ui-monospace,Menlo,monospace";
const r2 = (n) => Math.round(n * 100) / 100;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const TEMAS_GRAVURA = {
  papel: { fundo: '#F3EEE3', tinta: '#141414', grafite: '#7A756C', rua: '#8F8A81', eleito: '#D3202A', outro: '#1638B4', ouro: '#B88A1C', grao: 0.09 },
  tinta: { fundo: '#15171B', tinta: '#EEEAE2', grafite: '#9C988F', rua: '#8B877F', eleito: '#F0474B', outro: '#5F8CF0', ouro: '#D9A62A', grao: 0.05 },
  branco: { fundo: '#FFFFFF', tinta: '#141414', grafite: '#7A756C', rua: '#8F8A81', eleito: '#D2262D', outro: '#1C3DB0', ouro: '#B88A1C', grao: 0 },
};

function aleatorio(semente) {
  let s = semente >>> 0;
  return () => { s = (s + 0x6D2B79F5) >>> 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

/** Último cruzamento das linhas desenhadas (v = 50), interpolado entre os dois pontos vizinhos. */
export function ultimoCruzamento(P) {
  for (let i = P.length - 1; i > 0; i -= 1) {
    const a = P[i - 1].v - 50, b = P[i].v - 50;
    if (a === 0) return P[i - 1].x;
    if (a * b < 0) return P[i - 1].x + (a / (a - b)) * (P[i].x - P[i - 1].x);
  }
  return null;
}

/** Quantas vezes as linhas desenhadas se cruzam. */
export function cruzamentos(P) {
  let n = 0;
  for (let i = 1; i < P.length; i += 1) if ((P[i - 1].v - 50) * (P[i].v - 50) < 0) n += 1;
  return n;
}

/** Filtros do papel (grão e manchas) e da tinta (borda que puxa na fibra). */
export function filtrosGravura(id, u) {
  return [
    `<filter id="${id}-grao" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="${r2(1.4 / u)}" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.31  0 0 0 0 0.25  0 0 0 1.6 -0.55"/></filter>`,
    `<filter id="${id}-manchas" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="${r2(0.05 / u)}" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.4  0 0 0 0 0.32  0 0 0 1.2 -0.45"/></filter>`,
    `<filter id="${id}-tinta" x="-2%" y="-20%" width="104%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="${r2(2.2 / u)}" numOctaves="2" seed="11"/><feDisplacementMap in="SourceGraphic" scale="${r2(0.14 * u)}" xChannelSelector="R" yChannelSelector="G"/></filter>`,
  ].join('');
}

/** Fundo de papel com textura (o grão só existe nos temas que pedem). */
export function papelGravura(W, H, id, c) {
  const t = [`<rect width="${W}" height="${H}" fill="${c.fundo}"/>`];
  if (c.grao) {
    t.push(`<rect width="${W}" height="${H}" filter="url(#${id}-manchas)" opacity="${c.grao * 0.9}"/>`);
    t.push(`<rect width="${W}" height="${H}" filter="url(#${id}-grao)" opacity="${c.grao}"/>`);
  }
  return t.join('');
}

/**
 * Traço da Gravura numa faixa: três filamentos por trajetória e o ponto dourado no último cruzamento.
 * @param {{x:number,v:number}[]} P série suavizada
 * @param {object} b { x0, x1, yc, meiaAlt, u, c, id, expoente=1, halo=null, semente }
 */
export function tracoGravura(P, b) {
  const { x0, x1, yc, meiaAlt, u, c, id } = b;
  const k = b.expoente ?? 1;
  const comp = (d) => Math.sign(d) * Math.pow(Math.abs(d), k);
  const desvio = Math.max(...P.map((p) => Math.abs(p.v - 50)));
  const meia = comp(desvio + 0.25);
  const X = (x) => x0 + ((x - P[0].x) / (P.at(-1).x - P[0].x)) * (x1 - x0);
  const Y = (v) => yc - (comp(v - 50) / meia) * meiaAlt;
  const rnd = aleatorio(b.semente ?? 20261025);
  const passo = Math.max(1, Math.floor(P.length / 420));
  const amostra = P.filter((_, i) => i % passo === 0 || i === P.length - 1);
  const espaco = 0.46 * u;
  const filamentos = (lado) => [-1, 0, 1].map((kk) => {
    const fase = [rnd() * 6.28, rnd() * 6.28, rnd() * 6.28, rnd() * 6.28];
    const amp = 0.07 * u * (0.6 + rnd() * 0.6);
    const ondaMao = 0.16 * u; // ondulação lenta, comum aos três filamentos: a mão que desenha, não o dado
    return amostra.map((p, i) => {
      const t = i / (amostra.length - 1);
      const tremor = amp * (Math.sin(t * 37 + fase[0]) * 0.5 + Math.sin(t * 91 + fase[1]) * 0.3 + Math.sin(t * 233 + fase[2]) * 0.2)
        + ondaMao * (Math.sin(t * 9.5 + (lado === 'eleito' ? 0.6 : 2.4)) * 0.7 + Math.sin(t * 21 + fase[3] * 0.1) * 0.3);
      const v = lado === 'eleito' ? p.v : 100 - p.v;
      return `${i ? 'L' : 'M'}${r2(X(p.x))} ${r2(Y(v) + kk * espaco + tremor)}`;
    }).join('');
  });
  const outro = filamentos('outro'), eleito = filamentos('eleito');
  const sw = r2(0.27 * u);
  const t = [];
  if (b.halo) {
    // fundo de papel sob o feixe, para a curva não se misturar com o que está embaixo (ruas, contornos)
    const centro = (lado) => amostra.map((p, i) => `${i ? 'L' : 'M'}${r2(X(p.x))} ${r2(Y(lado === 'eleito' ? p.v : 100 - p.v))}`).join('');
    t.push(`<g fill="none" stroke="${b.halo}" stroke-opacity="0.82" stroke-width="${r2(2.4 * u)}" stroke-linecap="round" stroke-linejoin="round"><path d="${centro('outro')}"/><path d="${centro('eleito')}"/></g>`);
  }
  t.push(`<g filter="url(#${id}-tinta)" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="${sw}">`);
  t.push(`<g stroke="${c.outro}" stroke-opacity="1">${outro.map((d) => `<path d="${d}"/>`).join('')}</g>`);
  t.push(`<g stroke="${c.eleito}" stroke-opacity="1">${eleito.map((d) => `<path d="${d}"/>`).join('')}</g>`);
  t.push(`</g>`);
  const xv = ultimoCruzamento(P);
  if (xv !== null) t.push(`<circle cx="${r2(X(xv))}" cy="${r2(Y(50))}" r="${r2(1.15 * u)}" fill="${c.ouro}"/>`);
  return { svg: t.join(''), X, Y, xv };
}

export function marcaDaguaGravura(W, H, u, c) {
  const linhas = [];
  for (let y = -H; y < 2 * H; y += 14 * u) linhas.push(`<text class="ifx-m" x="${r2(-W)}" y="${r2(y)}" font-size="${r2(2.6 * u)}" letter-spacing="${r2(u)}">${'PRÉVIA INFLEXO   '.repeat(12)}</text>`);
  return `<g fill="${c.tinta}" opacity="0.07" transform="rotate(-30 ${W / 2} ${H / 2})">${linhas.join('')}</g>`;
}

export function abrirGravura(W, H, rotulo, cssFontes) {
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}mm" height="${H}mm" role="img" aria-label="${esc(rotulo)}">`,
    `<style>${cssFontes}.ifx-d{font-family:${FONTE_DISPLAY}}.ifx-m{font-family:${FONTE_MONO}}</style>`,
  ];
}

/**
 * @param {object} curva arquivo da curva nacional (pipeline)
 * @param {object} op { formato, tema, suavizarMin, expoente, marcaDagua, comNumeros, cssFontes }
 */
export function renderGravuraNacional(curva, op = {}) {
  const o = { formato: 'a2', tema: 'papel', suavizarMin: 8, expoente: 1, marcaDagua: false, comNumeros: true, cssFontes: '', ...op };
  const f = typeof o.formato === 'string' ? FORMATOS[o.formato] : o.formato;
  if (!f) throw new Error(`Formato desconhecido: ${o.formato}`);
  const c = TEMAS_GRAVURA[o.tema];
  if (!c) throw new Error(`Tema desconhecido: ${o.tema}`);
  const W = f.larguraMm, H = f.alturaMm;
  const u = Math.min(W, H) / 100; // 1% do lado menor
  const F = fatos(curva);
  const P = serieSuave(curva, F, o.suavizarMin);
  const largo = W >= H * 1.2; // tela 16:9
  const id = `ifx-gravura-${o.tema}-${W}x${H}`;
  const traco = tracoGravura(P, { x0: W * 0.085, x1: W * 0.915, yc: H * (largo ? 0.52 : 0.5), meiaAlt: W * 0.06, u, c, id, expoente: o.expoente });

  const t = abrirGravura(W, H, `Gravura: a curva da apuração de ${F.data}, das 17h07 às 21h07, com o ponto dourado no último cruzamento das linhas.`, o.cssFontes);
  t.push(`<defs>${filtrosGravura(id, u)}</defs>`);
  t.push(papelGravura(W, H, id, c));
  t.push(traco.svg);

  const mono = r2((largo ? 2.6 : 3.1) * u);
  if (o.comNumeros) {
    t.push(`<text class="ifx-m" x="${r2(W / 2)}" y="${r2(H * (largo ? 0.2 : 0.235))}" font-size="${mono}" fill="${c.tinta}" text-anchor="middle">${esc(F.votosTexto)} • ${esc(F.pctTexto)}</text>`);
  }
  t.push(`<text class="ifx-d" x="${r2(W / 2)}" y="${r2(H * (largo ? 0.83 : 0.795))}" font-size="${r2((largo ? 2.6 : 3) * u)}" letter-spacing="${r2(0.3 * u)}" fill="${c.tinta}" text-anchor="middle">${esc(F.data)}</text>`);
  t.push(`<text class="ifx-d" x="${r2(W / 2)}" y="${r2(H * 0.925)}" font-size="${r2(1.45 * u)}" letter-spacing="${r2(0.55 * u)}" fill="${c.tinta}" text-anchor="middle">INFLEXO</text>`);
  t.push(`<text class="ifx-m" x="${r2(W / 2)}" y="${r2(H * 0.962)}" font-size="${r2(Math.max(0.78 * u, 0.0052 * H))}" fill="${c.grafite}" text-anchor="middle">${esc(`Fonte: TSE, boletins de urna do 2º turno, na ordem de chegada, ${F.janela.inicio} às ${F.janela.fim}. Média móvel de ${o.suavizarMin} min${o.expoente === 1 ? '' : `; altura em escala de potência ${String(o.expoente).replace('.', ',')}`}; o tremor das linhas é do desenho.`)}</text>`);
  if (o.marcaDagua) t.push(marcaDaguaGravura(W, H, u, c));
  t.push('</svg>');
  return t.join('');
}
