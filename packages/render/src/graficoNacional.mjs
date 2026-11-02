// Motor de render do gráfico nacional (2º turno de 2026).
// Funções puras: mesma curva + mesmas opções = mesmo SVG. Servem à prévia no navegador e ao arquivo de impressão.
// Não usam nome, número ou partido de candidato: só as cores do dado.
//
// Eixos (o mesmo dado):
//   'relogio' (padrão): horário de chegada dos boletins ao TSE. Com a janela 'forma' (padrão), vai do
//                       primeiro lote completo (17h07) até a curva estabilizar (~21h07).
//                       Com a janela 'completa', vai de 17h05 a 23h21.
//   'urnas':            percentual das urnas apuradas, 1% → 100%.
//
// Estilos:
//   renderGraficoNacional → 'galeria' (pôster e quadro: número, curva, data, legenda, fonte)
//   renderEstampaNacional → 'estampa' (camiseta e feed: número, curva, estrela, data)

export const TEMAS = {
  papel: { fundo: '#F1F1EE', tinta: '#111215', grafite: '#585A60', linha: '#C9C9C3', ouro: '#E2AE12', eleito: '#D3262B', outro: '#1F3FB8' },
  tinta: { fundo: '#111215', tinta: '#ECEBE6', grafite: '#9C9DA2', linha: '#3A3C42', ouro: '#F2C230', eleito: '#EF4448', outro: '#5B8DEF' },
  branco: { fundo: '#FFFFFF', tinta: '#111215', grafite: '#585A60', linha: '#D6D6D2', ouro: '#F0BE1A', eleito: '#E3262B', outro: '#1E3BB3' },
};

// Tamanhos em milímetros (o SVG usa mm como unidade do viewBox).
export const FORMATOS = {
  a3: { nome: 'A3', larguraMm: 297, alturaMm: 420 },
  a2: { nome: 'A2', larguraMm: 420, alturaMm: 594 },
  stories: { nome: 'Stories 9:16', larguraMm: 108, alturaMm: 192 },
  tela: { nome: 'Tela 16:9', larguraMm: 320, alturaMm: 180 },
  quadrado: { nome: 'Quadrado 1:1', larguraMm: 300, alturaMm: 300 },
};

const FONTE_DISPLAY = "'Bodoni Moda','Bodoni 72',Didot,Georgia,serif";
const FONTE_MONO = "'IBM Plex Mono',ui-monospace,Menlo,monospace";
const PAUSA_DEGRAU_S = 30; // acima disso, o valor fica parado até o próximo boletim (desenho em degrau)
const ESTABILIZA_PP = 0.05; // a curva "estabiliza" quando fica a menos disso do resultado final, até o fim
const PROPORCAO_FORMA = 4.5; // largura ÷ altura da faixa do gráfico no relógio

const r2 = (n) => Math.round(n * 100) / 100;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inteiro = (n) => new Intl.NumberFormat('pt-BR').format(n);
const decimal = (n, casas) => new Intl.NumberFormat('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas }).format(n);
const hora = (hms) => hms.slice(0, 5).replace(':', 'h');
const horaSeg = (s) => `${String(Math.floor(s / 3600)).padStart(2, '0')}h${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}`;
const seg = (hms) => hms.split(':').map(Number).reduce((a, b) => a * 60 + b, 0);
const dataBr = (iso) => iso.split('-').reverse().join('.');

/** Janela da forma: do último boletim antes da maior pausa até a curva estabilizar no resultado final. */
export function janelaDaForma(serie) {
  let maior = 0, iInicio = 0;
  for (let i = 1; i < serie.length; i += 1) {
    const d = serie[i][0] - serie[i - 1][0];
    if (d > maior) { maior = d; iInicio = i - 1; }
  }
  const vf = serie.at(-1)[1];
  let iFim = 0;
  for (let i = serie.length - 1; i >= 0; i -= 1) {
    if (Math.abs(serie[i][1] - vf) > ESTABILIZA_PP) { iFim = Math.min(i + 1, serie.length - 1); break; }
  }
  return { inicio: serie[iInicio][0], fim: serie[iFim][0], pausaS: maior };
}

/** Extrai do arquivo da curva os números que a peça imprime. */
export function fatos(curva, inicioPct = 1) {
  const nums = Object.keys(curva.candidatos);
  const eleito = nums.find((n) => curva.candidatos[n].eleito);
  const outro = nums.find((n) => n !== eleito);
  const validos = curva.verificacao.oficial.validos;
  const votos = curva.candidatos[eleito].votos;
  const pontos = curva.amostra.filter((p) => p.pct_secoes >= inicioPct);
  const virada = curva.viradas.filter((v) => v.novo_lider === eleito).at(-1);
  const relogio = curva.serie_relogio;
  const J = janelaDaForma(relogio);
  return {
    eleito, outro, pontos, virada,
    votosTexto: inteiro(votos),
    pctTexto: `${decimal((100 * votos) / validos, 2)}%`,
    viradaHora: hora(virada.t),
    viradaPctTexto: `${decimal(virada.pct_secoes, 1)}%`,
    inicio: pontos[0],
    fim: pontos.at(-1),
    primeiroBoletim: horaSeg(relogio[0][0]),
    ultimoBoletim: horaSeg(relogio.at(-1)[0]),
    janela: { inicio: horaSeg(J.inicio), fim: horaSeg(J.fim) },
    data: dataBr(curva.data),
  };
}

/** Pontos a desenhar, como {x, v}: x no domínio do eixo, v = % dos válidos do eleito (o outro é 100 − v). */
export function serieDesenho(curva, F, eixo, janela = 'forma') {
  if (eixo === 'urnas') return F.pontos.map((p) => ({ x: p.pct_secoes, v: p.pct_validos[F.eleito] }));
  const s = curva.serie_relogio;
  const J = janela === 'completa' ? { inicio: s[0][0], fim: s.at(-1)[0] } : janelaDaForma(s);
  const sel = s.filter((p) => p[0] >= J.inicio && p[0] <= J.fim);
  const out = [];
  for (let i = 0; i < sel.length; i += 1) {
    if (i > 0 && sel[i][0] - sel[i - 1][0] > PAUSA_DEGRAU_S) out.push({ x: sel[i][0], v: sel[i - 1][1] });
    out.push({ x: sel[i][0], v: sel[i][1] });
  }
  return out;
}

function escalas(P, box) {
  const xMin = P[0].x, xMax = P.at(-1).x;
  const desvio = Math.max(...P.map((p) => Math.abs(p.v - 50)));
  const meia = Math.ceil((desvio + 0.25) * 2) / 2; // meia-altura em pontos percentuais, arredondada para 0,5
  const X = (x) => box.x0 + ((x - xMin) / (xMax - xMin)) * (box.x1 - box.x0);
  const Y = (v) => (box.y0 + box.y1) / 2 - ((v - 50) / meia) * ((box.y1 - box.y0) / 2);
  return { X, Y, xMin, xMax, meia };
}

function caminho(P, S, lado) {
  return P.map((p, i) => `${i ? 'L' : 'M'}${r2(S.X(p.x))} ${r2(S.Y(lado === 'eleito' ? p.v : 100 - p.v))}`).join('');
}

function estrela(cx, cy, R, cor) {
  const pts = [];
  for (let k = 0; k < 10; k += 1) {
    const ang = (-90 + k * 36) * (Math.PI / 180);
    const r = k % 2 ? R * 0.42 : R;
    pts.push(`${r2(cx + r * Math.cos(ang))} ${r2(cy + r * Math.sin(ang))}`);
  }
  return `<path d="M${pts.join('L')}Z" fill="${cor}" stroke="${cor}" stroke-width="${r2(R * 0.12)}" stroke-linejoin="round"/>`;
}

function abrir(W, H, c, rotulo, cssFontes) {
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}mm" height="${H}mm" role="img" aria-label="${esc(rotulo)}">`,
    `<style>${cssFontes}.ifx-d{font-family:${FONTE_DISPLAY}}.ifx-m{font-family:${FONTE_MONO}}</style>`,
    `<rect width="${W}" height="${H}" fill="${c.fundo}"/>`,
  ];
}

function resolver(op) {
  const f = typeof op.formato === 'string' ? FORMATOS[op.formato] : op.formato;
  if (!f) throw new Error(`Formato desconhecido: ${op.formato}`);
  const c = TEMAS[op.tema];
  if (!c) throw new Error(`Tema desconhecido: ${op.tema}`);
  return { f, c, W: f.larguraMm, H: f.alturaMm };
}

function marcaDagua(W, H, u, c) {
  const linhas = [];
  for (let y = -H; y < 2 * H; y += 14 * u) {
    linhas.push(`<text class="ifx-m" x="${r2(-W)}" y="${r2(y)}" font-size="${r2(2.6 * u)}" letter-spacing="${r2(1 * u)}">${'PRÉVIA INFLEXO   '.repeat(12)}</text>`);
  }
  return `<g fill="${c.tinta}" opacity="0.07" transform="rotate(-30 ${W / 2} ${H / 2})">${linhas.join('')}</g>`;
}

/**
 * Estilo galeria (pôster, quadro, digital).
 * @param {object} op { formato, tema, eixo: 'relogio'|'urnas', janela: 'forma'|'completa', marcaDagua, inicioPct, cssFontes }
 */
export function renderGraficoNacional(curva, op = {}) {
  const o = { formato: 'a2', tema: 'papel', eixo: 'relogio', janela: 'forma', marcaDagua: false, inicioPct: 1, cssFontes: '', ...op };
  if (o.eixo !== 'relogio' && o.eixo !== 'urnas') throw new Error(`Eixo desconhecido: ${o.eixo}`);
  const { c, W, H } = resolver(o);
  const u = Math.min(W, H * 0.72) / 100;
  const m = 9 * u;
  const F = fatos(curva, o.inicioPct);
  const P = serieDesenho(curva, F, o.eixo, o.janela);
  const relogio = o.eixo === 'relogio';

  const dy = H - m - 15 * u;
  const topoLivre = m + 10 * u;
  const baseLivre = dy - 8 * u;
  const livre = baseLivre - topoLivre;
  const box = { x0: m, x1: W - m };
  if (relogio) {
    const alt = Math.min(livre * 0.62, (box.x1 - box.x0) / PROPORCAO_FORMA);
    const centro = topoLivre + livre * 0.47;
    box.y0 = centro - alt / 2;
    box.y1 = centro + alt / 2;
  } else {
    box.y0 = topoLivre + 0.19 * livre;
    box.y1 = baseLivre - 0.18 * livre;
  }
  const S = escalas(P, box);
  const xVirada = relogio ? seg(F.virada.t) : F.virada.pct_secoes;
  const px = r2(S.X(xVirada));
  const py = r2(S.Y(50));
  const traco = r2((relogio ? 0.5 : 0.55) * u);
  const cx = W / 2;
  const fsRegua = r2(Math.max(1.3 * u, 0.0072 * H));
  const legenda = relogio
    ? `As linhas se cruzaram às ${F.viradaHora}.`
    : `As linhas se cruzaram às ${F.viradaHora}, com ${F.viradaPctTexto} das urnas apuradas.`;

  const t = abrir(W, H, c, `Curva da apuração de ${F.data}. ${legenda}`, o.cssFontes);
  t.push(`<text class="ifx-m" x="${cx}" y="${r2(m + 4.6 * u)}" font-size="${r2(4.4 * u)}" fill="${c.tinta}" text-anchor="middle">${esc(F.votosTexto)} • ${esc(F.pctTexto)}</text>`);
  t.push(`<text class="ifx-m" x="${cx}" y="${r2(m + 8.6 * u)}" font-size="${r2(1.45 * u)}" letter-spacing="${r2(0.45 * u)}" fill="${c.grafite}" text-anchor="middle">PRESIDENTE · 2º TURNO · BRASIL</text>`);

  if (!relogio) {
    t.push(`<line x1="${r2(box.x0)}" y1="${py}" x2="${r2(box.x1)}" y2="${py}" stroke="${c.linha}" stroke-width="${r2(0.14 * u)}" stroke-dasharray="${r2(0.6 * u)} ${r2(0.6 * u)}"/>`);
    t.push(`<text class="ifx-m" x="${r2(box.x1)}" y="${r2(py - 0.9 * u)}" font-size="${r2(1.3 * u)}" fill="${c.grafite}" text-anchor="end">50%</text>`);
  }

  t.push(`<path d="${caminho(P, S, 'outro')}" fill="none" stroke="${c.outro}" stroke-width="${traco}" stroke-linejoin="round" stroke-linecap="round"/>`);
  t.push(`<path d="${caminho(P, S, 'eleito')}" fill="none" stroke="${c.eleito}" stroke-width="${traco}" stroke-linejoin="round" stroke-linecap="round"/>`);

  const ry = r2(box.y1 + 4 * u);
  if (relogio) {
    t.push(`<circle cx="${px}" cy="${py}" r="${r2(0.75 * u)}" fill="${c.fundo}" stroke="${c.tinta}" stroke-width="${r2(0.2 * u)}"/>`);
    t.push(`<text class="ifx-m" x="${px}" y="${r2(Math.max(py, S.Y(P.find((p) => p.x >= xVirada).v)) + 3.6 * u)}" font-size="${r2(1.6 * u)}" fill="${c.tinta}" text-anchor="middle">${esc(F.viradaHora)}</text>`);
    const fim = P.at(-1);
    const ex = S.X(fim.x), ey = S.Y(fim.v);
    t.push(estrela(r2(ex + 0.2 * u), r2(ey - (box.y1 - box.y0) * 0.24), r2((box.x1 - box.x0) * 0.034), c.ouro));
    for (let h = Math.ceil(S.xMin / 3600); h * 3600 <= S.xMax; h += 1) {
      const hx = r2(S.X(h * 3600));
      t.push(`<line x1="${hx}" y1="${r2(box.y1 + 1 * u)}" x2="${hx}" y2="${r2(box.y1 + 2 * u)}" stroke="${c.grafite}" stroke-width="${r2(0.12 * u)}"/>`);
      t.push(`<text class="ifx-m" x="${hx}" y="${ry}" font-size="${fsRegua}" fill="${c.grafite}" text-anchor="middle">${h}h</text>`);
    }
  } else {
    t.push(`<circle cx="${px}" cy="${py}" r="${r2(1.05 * u)}" fill="${c.ouro}" stroke="${c.fundo}" stroke-width="${r2(0.35 * u)}"/>`);
    t.push(`<text class="ifx-m" x="${px}" y="${r2(py - 3.2 * u)}" font-size="${r2(1.9 * u)}" fill="${c.tinta}" text-anchor="middle">${esc(F.viradaHora)}</text>`);
    t.push(`<text class="ifx-m" x="${r2(box.x0)}" y="${ry}" font-size="${fsRegua}" fill="${c.grafite}">${esc(`${hora(F.inicio.t)} · ${decimal(o.inicioPct, 0)}% das urnas`)}</text>`);
    t.push(`<text class="ifx-m" x="${r2(box.x1)}" y="${ry}" font-size="${fsRegua}" fill="${c.grafite}" text-anchor="end">${esc(`${hora(F.fim.t)} · 100%`)}</text>`);
  }

  t.push(`<text class="ifx-d" x="${cx}" y="${r2(dy)}" font-size="${r2(7.6 * u)}" letter-spacing="${r2(0.3 * u)}" fill="${c.tinta}" text-anchor="middle">${esc(F.data)}</text>`);
  t.push(`<text class="ifx-d" x="${cx}" y="${r2(dy + 5.6 * u)}" font-size="${r2(2.25 * u)}" font-style="italic" fill="${c.tinta}" text-anchor="middle">${esc(legenda)}</text>`);

  const fy = r2(H - m * 0.55);
  const fonte = relogio
    ? `Fonte: TSE, boletins de urna do 2º turno pelo horário de chegada, das ${F.janela.inicio} às ${F.janela.fim}.`
    : 'Fonte: TSE, boletins de urna do 2º turno ordenados pelo horário de recebimento.';
  t.push(`<text class="ifx-m" x="${r2(m)}" y="${fy}" font-size="${r2(Math.max(1.05 * u, 0.0072 * H))}" fill="${c.grafite}">${esc(fonte)}</text>`);
  t.push(`<text class="ifx-d" x="${r2(W - m)}" y="${fy}" font-size="${r2(2.6 * u)}" letter-spacing="${r2(0.35 * u)}" fill="${c.tinta}" text-anchor="end">INFLEXO</text>`);
  if (o.marcaDagua) t.push(marcaDagua(W, H, u, c));
  t.push('</svg>');
  return t.join('');
}

/** Traço de giz: ondulação leve + grão. Só textura; os pontos continuam sendo os do dado. */
function filtroGiz(id, u) {
  return `<defs><filter id="${id}" x="-5%" y="-30%" width="110%" height="160%">`
    + `<feTurbulence type="fractalNoise" baseFrequency="${r2(0.35 / u)}" numOctaves="2" seed="3" result="ondas"/>`
    + `<feDisplacementMap in="SourceGraphic" in2="ondas" scale="${r2(0.9 * u)}" xChannelSelector="R" yChannelSelector="G" result="torto"/>`
    + `<feTurbulence type="fractalNoise" baseFrequency="${r2(3 / u)}" numOctaves="1" seed="9" result="grao"/>`
    + '<feColorMatrix in="grao" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.5 1.55" result="mascara"/>'
    + '<feComposite in="torto" in2="mascara" operator="in"/></filter></defs>';
}

/**
 * Estilo estampa (camiseta, feed): número, curva, estrela e data.
 * @param {object} op { formato: 'quadrado'|..., tema: 'branco'|'papel'|'tinta', traco: 'giz'|'limpo', marcaDagua, cssFontes }
 */
export function renderEstampaNacional(curva, op = {}) {
  const o = { formato: 'quadrado', tema: 'branco', traco: 'giz', marcaDagua: false, cssFontes: '', ...op };
  const { c, W, H } = resolver(o);
  const u = Math.min(W, H) / 100;
  const F = fatos(curva);
  const P = serieDesenho(curva, F, 'relogio', 'forma');
  const box = { x0: W * 0.113, x1: W * 0.884 };
  const alt = (box.x1 - box.x0) / PROPORCAO_FORMA;
  const centro = H * 0.565;
  box.y0 = centro - alt / 2;
  box.y1 = centro + alt / 2;
  const S = escalas(P, box);
  const traco = r2(0.62 * u);
  const fim = P.at(-1);

  const t = abrir(W, H, c, `Curva da apuração de ${F.data}: ${F.votosTexto} votos, ${F.pctTexto}.`, o.cssFontes);
  t.push(`<text class="ifx-m" x="${r2(W / 2)}" y="${r2(H * 0.255)}" font-size="${r2(3.2 * u)}" fill="${c.tinta}" text-anchor="middle">${esc(F.votosTexto)} • ${esc(F.pctTexto)}</text>`);
  const giz = o.traco === 'giz';
  const idGiz = `ifx-giz-${W}x${H}-${o.tema}`;
  if (giz) t.push(filtroGiz(idGiz, u));
  t.push(giz ? `<g filter="url(#${idGiz})">` : '<g>');
  t.push(`<path d="${caminho(P, S, 'outro')}" fill="none" stroke="${c.outro}" stroke-width="${giz ? r2(0.8 * u) : traco}" stroke-linejoin="round" stroke-linecap="round"/>`);
  t.push(`<path d="${caminho(P, S, 'eleito')}" fill="none" stroke="${c.eleito}" stroke-width="${giz ? r2(0.8 * u) : traco}" stroke-linejoin="round" stroke-linecap="round"/>`);
  t.push(estrela(r2(S.X(fim.x) + 0.5 * u), r2(S.Y(fim.v) - alt * 0.27), r2((box.x1 - box.x0) * 0.036), c.ouro));
  t.push('</g>');
  t.push(`<text class="ifx-m" x="${r2(W / 2)}" y="${r2(H * 0.9)}" font-size="${r2(2.6 * u)}" fill="${c.tinta}" text-anchor="middle">${esc(F.data)}</text>`);
  t.push(`<text class="ifx-m" x="${r2(W / 2)}" y="${r2(H * 0.955)}" font-size="${r2(1.1 * u)}" fill="${c.grafite}" text-anchor="middle">INFLEXO · Fonte: TSE, boletins de urna, ${esc(F.janela.inicio)} às ${esc(F.janela.fim)}</text>`);
  if (o.marcaDagua) t.push(marcaDagua(W, H, u, c));
  t.push('</svg>');
  return t.join('');
}

// ---------------------------------------------------------------------------------------------
// Estilo "fios" (edição galeria): a curva real no relógio, suavizada, desenhada como feixes de
// fios finos que se fecham no instante da virada e se abrem longe dela. O traçado central é o
// dado (média móvel); a abertura do feixe e os pontos são estilo.

function aleatorio(semente) {
  let s = semente >>> 0;
  return () => { s = (s + 0x6D2B79F5) >>> 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

/** Série suavizada: grade de 30 s + média móvel centrada (janela em minutos). */
export function serieSuave(curva, F, janelaMin = 10) {
  const P = serieDesenho(curva, F, 'relogio', 'forma');
  const passo = 30;
  const grade = [];
  let j = 0;
  for (let x = P[0].x; x <= P.at(-1).x; x += passo) {
    while (j + 1 < P.length && P[j + 1].x <= x) j += 1;
    grade.push({ x, v: P[j].v });
  }
  const meio = Math.round((janelaMin * 60) / passo / 2);
  const media = (g) => g.map((p, i) => {
    let soma = 0, n = 0;
    for (let k = Math.max(0, i - meio); k <= Math.min(g.length - 1, i + meio); k += 1) { soma += g[k].v; n += 1; }
    return { x: p.x, v: soma / n };
  });
  return media(media(grade)); // duas passadas: arredonda as quinas do degrau
}

export function renderFiosNacional(curva, op = {}) {
  const o = { formato: 'a2', tema: 'marfim', fios: 40, suavizarMin: 24, marcaDagua: false, cssFontes: '', ...op };
  const f = typeof o.formato === 'string' ? FORMATOS[o.formato] : o.formato;
  const W = f.larguraMm, H = f.alturaMm;
  const c = { fundo: '#F6F4EF', tinta: '#121212', grafite: '#77736B', ouro: '#B68A17' };
  const u = Math.min(W, H * 0.72) / 100;
  const F = fatos(curva);
  const P = serieSuave(curva, F, o.suavizarMin);
  const box = { x0: W * 0.06, x1: W * 0.94, y0: H * 0.24, y1: H * 0.66 };
  const S = escalas(P, box);
  const xv = seg(F.virada.t);
  const alcance = Math.max(xv - S.xMin, S.xMax - xv);
  const abertura = (box.y1 - box.y0) * 0.42;
  const rnd = aleatorio(20261025);
  const t = abrir(W, H, c, `Curva da apuração de ${F.data} em fios: as linhas se fecham às ${F.viradaHora}.`, o.cssFontes);
  const fios = [];
  const pontos = [];
  for (const lado of ['eleito', 'outro']) {
    for (let k = 0; k < o.fios; k += 1) {
      const pos = (k / (o.fios - 1)) * 2 - 1; // −1 … 1
      const peso = pos * (0.55 + 0.45 * rnd());
      const curv = 1.5 + rnd() * 1.2;
      const d = P.map((p, i) => {
        const dist = Math.pow((1 - Math.cos(Math.PI * Math.min(1, Math.abs(p.x - xv) / alcance))) / 2, curv / 2);
        const y = S.Y(lado === 'eleito' ? p.v : 100 - p.v) + peso * abertura * dist;
        return `${i ? 'L' : 'M'}${r2(S.X(p.x))} ${r2(y)}`;
      }).join('');
      fios.push(`<path d="${d}"/>`);
      if (rnd() < 0.45) {
        const p = P[Math.floor(rnd() * P.length)];
        const dist = Math.pow((1 - Math.cos(Math.PI * Math.min(1, Math.abs(p.x - xv) / alcance))) / 2, curv / 2);
        pontos.push(`<circle cx="${r2(S.X(p.x))}" cy="${r2(S.Y(lado === 'eleito' ? p.v : 100 - p.v) + peso * abertura * dist)}" r="${r2(0.16 * u + rnd() * 0.14 * u)}"/>`);
      }
    }
  }
  t.push(`<defs><clipPath id="ifx-fios-${W}x${H}"><rect x="${r2(W * 0.06)}" y="${r2(H * 0.06)}" width="${r2(W * 0.88)}" height="${r2(H * 0.78)}"/></clipPath></defs><g clip-path="url(#ifx-fios-${W}x${H})">`);
  t.push(`<g fill="none" stroke="${c.tinta}" stroke-opacity="0.22" stroke-width="${r2(0.09 * u)}" stroke-linecap="round">${fios.join('')}</g>`);
  for (const lado of ['eleito', 'outro']) {
    t.push(`<path d="${P.map((p, i) => `${i ? 'L' : 'M'}${r2(S.X(p.x))} ${r2(S.Y(lado === 'eleito' ? p.v : 100 - p.v))}`).join('')}" fill="none" stroke="${c.tinta}" stroke-opacity="0.75" stroke-width="${r2(0.16 * u)}"/>`);
  }
  t.push(`<g fill="${c.tinta}" fill-opacity="0.7">${pontos.join('')}</g>`);
  t.push("</g>");
  const q = 1.5 * u;
  t.push(`<circle cx="${r2(S.X(xv))}" cy="${r2(S.Y(50))}" r="${r2(q * 0.55)}" fill="${c.ouro}" stroke="${c.fundo}" stroke-width="${r2(0.25 * u)}"/>`);
  t.push(`<text class="ifx-d" x="${r2(W * 0.94)}" y="${r2(H * 0.9)}" font-size="${r2(2.6 * u)}" letter-spacing="${r2(0.15 * u)}" fill="${c.tinta}" text-anchor="end">${esc(F.data)}</text>`);
  t.push(`<text class="ifx-m" x="${r2(W * 0.06)}" y="${r2(H * 0.9)}" font-size="${r2(1.5 * u)}" fill="${c.tinta}">${esc(F.votosTexto)} • ${esc(F.pctTexto)}</text>`);
  t.push(`<text class="ifx-m" x="${r2(W * 0.06)}" y="${r2(H * 0.94)}" font-size="${r2(Math.max(1.0 * u, 0.0068 * H))}" fill="${c.grafite}">Fonte: TSE, boletins de urna, ${esc(F.janela.inicio)} às ${esc(F.janela.fim)}. Traçado em média móvel de ${o.suavizarMin} min (duas passadas); feixe e pontos são estilo.</text>`);
  if (o.tiragem) {
    const num = o.numero ? String(o.numero).padStart(String(o.tiragem).length, '0') : '—';
    t.push(`<text class="ifx-m" x="${r2(W * 0.94)}" y="${r2(H * 0.865)}" font-size="${r2(1.5 * u)}" fill="${c.tinta}" text-anchor="end">${esc(`Nº ${num}/${o.tiragem}`)}</text>`);
  }
  t.push(`<text class="ifx-d" x="${r2(W * 0.94)}" y="${r2(H * 0.94)}" font-size="${r2(2.4 * u)}" letter-spacing="${r2(0.35 * u)}" fill="${c.tinta}" text-anchor="end">INFLEXO</text>`);
  if (o.marcaDagua) t.push(marcaDagua(W, H, u, c));
  t.push('</svg>');
  return t.join('');
}
