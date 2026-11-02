// Pôster da cidade: ruas do OpenStreetMap em cinza, sobre papel, com a Gravura (a curva nacional da noite)
// atravessando o mapa e o resultado real do município escrito na peça. Função pura.
// Sem nome, número ou partido de candidato.
import { FORMATOS, fatos, serieSuave } from './graficoNacional.mjs';
import { TEMAS_GRAVURA, filtrosGravura, papelGravura, tracoGravura, marcaDaguaGravura, abrirGravura } from './gravura.mjs';

const r2 = (n) => Math.round(n * 100) / 100;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inteiro = (n) => new Intl.NumberFormat('pt-BR').format(n);
const pct = (n) => `${new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)}%`;

export function renderCidade(cidade, nacional, op = {}) {
  const o = { formato: 'a2', tema: 'papel', suavizarMin: 8, marcaDagua: false, cssFontes: '', ...op };
  const f = typeof o.formato === 'string' ? FORMATOS[o.formato] : o.formato;
  const c = TEMAS_GRAVURA[o.tema];
  if (!f || !c) throw new Error(`Formato ou tema desconhecido: ${o.formato}/${o.tema}`);
  const W = f.larguraMm, H = f.alturaMm;
  const u = Math.min(W, H * 0.72) / 100;
  const m = 9 * u;
  const escuro = o.tema === 'tinta';
  const id = `ifx-cidade-${cidade.slug}-${o.tema}-${W}`;

  // mapa quadrado
  const lado = W - 2 * m;
  const mx = m, my = H * 0.15;
  const k = lado / 1000;

  const F = fatos(nacional);
  const P = serieSuave(nacional, F, o.suavizarMin);
  const R = cidade.resultado;

  const t = abrirGravura(W, H, `A Geografia da Virada, ${cidade.cidade}: ${pct(R.pct_eleito)} no município`, o.cssFontes);
  t.push(`<defs>${filtrosGravura(id, u)}<clipPath id="${id}-mapa"><rect x="${r2(mx)}" y="${r2(my)}" width="${r2(lado)}" height="${r2(lado)}"/></clipPath></defs>`);
  t.push(papelGravura(W, H, id, c));

  // cabeçalho
  t.push(`<text class="ifx-d" x="${r2(W / 2)}" y="${r2(m + 4.6 * u)}" font-size="${r2(5 * u)}" letter-spacing="${r2(0.35 * u)}" fill="${c.tinta}" text-anchor="middle">A GEOGRAFIA DA VIRADA</text>`);
  t.push(`<text class="ifx-m" x="${r2(W / 2)}" y="${r2(m + 9.2 * u)}" font-size="${r2(2 * u)}" letter-spacing="${r2(0.5 * u)}" fill="${c.tinta}" text-anchor="middle">${esc(cidade.cidade.toUpperCase())} • ${cidade.uf}</text>`);

  // ruas em cinza: a cidade é o fundo, a curva é a figura
  const rua = c.rua;
  t.push(`<g clip-path="url(#${id}-mapa)"><g transform="translate(${r2(mx)} ${r2(my)}) scale(${r2(k * 1000) / 1000})" fill="none" stroke-linecap="round" stroke-linejoin="round">`);
  const C = cidade.caminhos;
  if (C.agua) t.push(`<path d="${C.agua}" fill="${escuro ? '#1D2025' : '#E6E0D3'}" stroke="none"/>`);
  if (C.rio) t.push(`<path d="${C.rio}" stroke="${escuro ? '#272A30' : '#D9D2C4'}" stroke-width="${r2(1.2 * u / k)}"/>`);
  if (C.menor) t.push(`<path d="${C.menor}" stroke="${rua}" stroke-opacity="${escuro ? 0.32 : 0.42}" stroke-width="${r2(0.075 * u / k)}"/>`);
  if (C.media) t.push(`<path d="${C.media}" stroke="${rua}" stroke-opacity="0.58" stroke-width="${r2(0.13 * u / k)}"/>`);
  if (C.maior) t.push(`<path d="${C.maior}" stroke="${rua}" stroke-opacity="0.72" stroke-width="${r2(0.22 * u / k)}"/>`);
  if (C.costa) t.push(`<path d="${C.costa}" stroke="${rua}" stroke-opacity="0.9" stroke-width="${r2(0.3 * u / k)}"/>`);
  t.push('</g></g>');
  t.push(`<rect x="${r2(mx)}" y="${r2(my)}" width="${r2(lado)}" height="${r2(lado)}" fill="none" stroke="${rua}" stroke-opacity="0.45" stroke-width="${r2(0.1 * u)}"/>`);

  // número nacional no alto do mapa, sobre papel
  const ny = my + lado * 0.11;
  t.push(`<text class="ifx-m" x="${r2(W / 2)}" y="${r2(ny)}" font-size="${r2(3.4 * u)}" fill="${c.tinta}" text-anchor="middle" style="paint-order:stroke" stroke="${c.fundo}" stroke-width="${r2(2.2 * u)}" stroke-linejoin="round">${esc(F.votosTexto)} • ${esc(F.pctTexto)}</text>`);

  // a Gravura atravessando a cidade, de borda a borda do mapa
  const traco = tracoGravura(P, { x0: mx + 2 * u, x1: mx + lado - 2 * u, yc: my + lado * 0.47, meiaAlt: lado * 0.072, u, c, id, halo: c.fundo });
  t.push(traco.svg);

  // linha de dados abaixo do mapa
  const by = my + lado + 6 * u;
  t.push(`<text class="ifx-m" x="${r2(mx)}" y="${r2(by)}" font-size="${r2(1.5 * u)}" fill="${c.tinta}">${esc(cidade.coordenadas)}</text>`);
  t.push(`<text class="ifx-m" x="${r2(mx)}" y="${r2(by + 2.4 * u)}" font-size="${r2(1.5 * u)}" fill="${c.grafite}">JANELA DE ${cidade.janela_km} KM</text>`);
  t.push(`<text class="ifx-d" x="${r2(W / 2)}" y="${r2(by + 1.6 * u)}" font-size="${r2(5 * u)}" letter-spacing="${r2(0.2 * u)}" fill="${c.tinta}" text-anchor="middle">${esc(F.data)}</text>`);
  t.push(`<text class="ifx-m" x="${r2(mx + lado)}" y="${r2(by)}" font-size="${r2(2 * u)}" fill="${c.tinta}" text-anchor="end">${esc(pct(R.pct_eleito))}</text>`);
  t.push(`<text class="ifx-m" x="${r2(mx + lado)}" y="${r2(by + 2.6 * u)}" font-size="${r2(1.4 * u)}" fill="${c.grafite}" text-anchor="end">NO MUNICÍPIO</text>`);

  // legenda e fonte
  t.push(`<text class="ifx-d" x="${r2(W / 2)}" y="${r2(by + 9 * u)}" font-size="${r2(2.1 * u)}" font-style="italic" fill="${c.tinta}" text-anchor="middle">${esc(`A virada nacional sobre ${cidade.cidade}: ${pct(R.pct_eleito)} dos votos válidos da cidade.`)}</text>`);
  const fs = r2(Math.max(1.05 * u, 0.0072 * H));
  const fy = r2(H - m * 0.55);
  t.push(`<text class="ifx-m" x="${r2(m)}" y="${r2(fy - 1.6 * fs)}" font-size="${fs}" fill="${c.grafite}">${esc(`Fonte: TSE, boletins de urna (${inteiro(R.boletins)} do município). Mapa ${cidade.fonte_mapa}.`)}</text>`);
  t.push(`<text class="ifx-m" x="${r2(m)}" y="${fy}" font-size="${fs}" fill="${c.grafite}">${esc(`Curva nacional pela chegada dos boletins, ${F.janela.inicio} às ${F.janela.fim}, em média móvel de ${o.suavizarMin} min.`)}</text>`);
  t.push(`<text class="ifx-d" x="${r2(W - m)}" y="${fy}" font-size="${r2(2.4 * u)}" letter-spacing="${r2(0.35 * u)}" fill="${c.tinta}" text-anchor="end">INFLEXO</text>`);
  if (o.marcaDagua) t.push(marcaDaguaGravura(W, H, u, c));
  t.push('</svg>');
  return t.join('');
}
