// Pôster regional, versão limpa: só o contorno da região (malha IBGE) em traço de tinta, a Gravura
// (a curva nacional da noite) atravessando o mapa e o resultado real da região escrito na peça.
// Os resultados por estado não vão para o desenho; ficam na página da peça. Função pura e determinística.
// Sem nome, número ou partido de candidato.
import { FORMATOS, fatos, serieSuave } from './graficoNacional.mjs';
import { TEMAS_GRAVURA, filtrosGravura, papelGravura, tracoGravura, marcaDaguaGravura, abrirGravura } from './gravura.mjs';

const r2 = (n) => Math.round(n * 100) / 100;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inteiro = (n) => new Intl.NumberFormat('pt-BR').format(n);
const pct = (n) => `${new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)}%`;

export function renderRegiao(dados, nacional, op = {}) {
  const o = { formato: 'a2', tema: 'papel', suavizarMin: 8, divisas: true, marcaDagua: false, cssFontes: '', ...op };
  const f = typeof o.formato === 'string' ? FORMATOS[o.formato] : o.formato;
  const c = TEMAS_GRAVURA[o.tema];
  if (!f || !c) throw new Error(`Formato ou tema desconhecido: ${o.formato}/${o.tema}`);
  const W = f.larguraMm, H = f.alturaMm;
  const u = Math.min(W, H * 0.72) / 100;
  const m = 9 * u;
  const id = `ifx-regiao-${dados.regiao.toLowerCase().replace(/\W/g, '')}-${o.tema}-${W}`;
  const titulo = (dados.titulo ?? dados.regiao).toUpperCase();
  const F = fatos(nacional);
  const P = serieSuave(nacional, F, o.suavizarMin);

  // caixa do mapa: o contorno ocupa o miolo da folha, centrado
  const caixa = { x0: m * 1.6, y0: H * 0.23, x1: W - m * 1.6, y1: H * 0.79 };
  const mapa = dados.mapa;
  const k = Math.min((caixa.x1 - caixa.x0) / mapa.largura, (caixa.y1 - caixa.y0) / mapa.altura);
  const ox = caixa.x0 + ((caixa.x1 - caixa.x0) - mapa.largura * k) / 2;
  const oy = caixa.y0 + ((caixa.y1 - caixa.y0) - mapa.altura * k) / 2;
  const ufs = Object.values(mapa.ufs);
  const todos = ufs.map((v) => v.d).join('');

  const t = abrirGravura(W, H, dados.continente ? `A América do Sul invertida e a curva da noite de ${F.data}` : `A Geografia da Virada, ${dados.regiao}: ${pct(dados.total.pct_eleito)} na região`, o.cssFontes);
  t.push(`<defs>${filtrosGravura(id, u)}`);
  // a mão que desenha o contorno: um tremor mais lento e mais largo que o da tinta das curvas
  t.push(`<filter id="${id}-mao" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.014" numOctaves="1" seed="5"/><feDisplacementMap in="SourceGraphic" scale="${r2(0.7 * u / k)}" xChannelSelector="R" yChannelSelector="G"/></filter>`);
  t.push('</defs>');
  t.push(papelGravura(W, H, id, c));

  // cabeçalho: o nome da região em destaque e o número nacional
  t.push(`<text class="ifx-d" x="${r2(W / 2)}" y="${r2(m + 9 * u)}" font-size="${r2(Math.min(10.5, 190 / Math.max(12, titulo.length)) * u)}" letter-spacing="${r2(0.1 * u)}" fill="${c.tinta}" text-anchor="middle">${esc(titulo)}</text>`);
  t.push(`<text class="ifx-m" x="${r2(W / 2)}" y="${r2(m + 14.6 * u)}" font-size="${r2(3.1 * u)}" fill="${c.tinta}" text-anchor="middle">${esc(F.votosTexto)} • ${esc(F.pctTexto)}</text>`);

  // contorno: traço grosso de todos os estados e, por cima, o preenchimento de papel. As divisas internas
  // somem (cada lado cobre metade do traço); fica só a borda de fora, como um desenho à mão.
  t.push(`<g transform="translate(${r2(ox)} ${r2(oy)}) scale(${r2(k * 1000) / 1000})">`);
  t.push(`<g filter="url(#${id}-mao)">`);
  t.push(`<path d="${todos}" fill="none" stroke="${c.tinta}" stroke-width="${r2(0.62 * u / k)}" stroke-linejoin="round" stroke-linecap="round"/>`);
  t.push(`<path d="${todos}" fill="${c.fundo}" stroke="none"/>`);
  if (o.divisas) t.push(`<path d="${todos}" fill="none" stroke="${c.tinta}" stroke-opacity="0.16" stroke-width="${r2(0.08 * u / k)}" stroke-dasharray="${r2(0.5 * u / k)} ${r2(0.45 * u / k)}"/>`);
  t.push('</g></g>');

  // a Gravura atravessando a região, um pouco além do contorno, como no desenho de referência
  const yc = oy + mapa.altura * k * 0.5;
  const traco = tracoGravura(P, { x0: m * 1.2, x1: W - m * 1.2, yc, meiaAlt: W * 0.06, u, c, id, halo: null });
  t.push(traco.svg);

  // a nota da região, escrita à mão no canto do mapa
  const nx = m * 1.6, ny = caixa.y1 - 4 * u;
  if (!dados.continente) {
  t.push(`<text class="ifx-m" x="${r2(nx)}" y="${r2(ny)}" font-size="${r2(2.1 * u)}" fill="${c.tinta}">${esc(`${dados.regiao.toUpperCase()}: ${pct(dados.total.pct_eleito)}`)}</text>`);
  t.push(`<text class="ifx-m" x="${r2(nx)}" y="${r2(ny + 2.7 * u)}" font-size="${r2(1.5 * u)}" fill="${c.grafite}">${esc(`${Object.keys(dados.ufs).length} ESTADOS · ${inteiro(dados.total.boletins)} BOLETINS`)}</text>`);
  }

  // rodapé
  t.push(`<text class="ifx-m" x="${r2(W / 2)}" y="${r2(H * 0.87)}" font-size="${r2(3 * u)}" letter-spacing="${r2(0.1 * u)}" fill="${c.tinta}" text-anchor="middle">${esc(F.data)}</text>`);
  t.push(`<text class="ifx-d" x="${r2(W / 2)}" y="${r2(H * 0.9)}" font-size="${r2(1.9 * u)}" fill="${c.tinta}" text-anchor="middle"><tspan font-weight="600" letter-spacing="${r2(0.2 * u)}">INFLEXO</tspan><tspan font-style="italic">. A estética do movimento.</tspan></text>`);
  const fs = r2(Math.max(1.0 * u, 0.0068 * H));
  t.push(`<text class="ifx-m" x="${r2(W / 2)}" y="${r2(H - m * 0.75 - 1.5 * fs)}" font-size="${fs}" fill="${c.grafite}" text-anchor="middle">${esc(dados.continente ? `Fonte: TSE, boletins de urna do 2º turno (${inteiro(dados.total.boletins)}, conferidos com o resultado oficial). Mapa: ${dados.mapa.fonte}.` : `Fonte: TSE, boletins de urna do 2º turno (${inteiro(dados.total.boletins)} na região, conferidos estado a estado). Malha: IBGE.`)}</text>`);
  t.push(`<text class="ifx-m" x="${r2(W / 2)}" y="${r2(H - m * 0.75)}" font-size="${fs}" fill="${c.grafite}" text-anchor="middle">${esc(`Curva nacional pela chegada dos boletins, ${F.janela.inicio} às ${F.janela.fim}, em média móvel de ${o.suavizarMin} min; o traço é do desenho.`)}</text>`);
  if (o.marcaDagua) t.push(marcaDaguaGravura(W, H, u, c));
  t.push('</svg>');
  return t.join('');
}
