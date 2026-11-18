// Estudos determinísticos de composição para a home.
// São MODELOS matemáticos, não dados observados ou artes finais de coleções.
// A forma não usa a curva eleitoral nem força cruzamentos entre trajetórias.
const r = (n) => Math.round(n * 100) / 100;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const logistica = (t) => 1 / (1 + Math.exp(-t));
export function curvaturaLogistica(t) {
  const y = logistica(t);
  return y * (1 - y) * (1 - 2 * y);
}

/** SVG em unidades de composição. O ponto da logística é t=0, onde y'' troca de sinal. */
export function renderEstudo(tipo = 'inflexao', { id = 'estudo', escuro = false } = {}) {
  if (!['inflexao', 'orbita'].includes(tipo)) throw new Error('Estudo desconhecido');
  if (!/^[a-zA-Z][\w-]*$/.test(id)) throw new Error('Identificador inválido');
  const fundo = escuro ? '#202822' : '#F7F3EA';
  const tinta = escuro ? '#F3EEE3' : '#283129';
  const suave = escuro ? '#B7BDB0' : '#787B6D';
  const ouro = '#B18A35';
  const titulo = tipo === 'inflexao' ? 'Inflexões' : 'Órbitas';
  const descricao = tipo === 'inflexao'
    ? 'Estudo de uma curva logística, y = 1 / (1 + exp(-t)). O ponto em t = 0 indica a mudança de sinal da segunda derivada. Não representa uma série histórica.'
    : 'Estudo de uma elipse idealizada e seu foco. Não representa uma missão ou posição real de astros.';
  const desenhos = [];
  if (tipo === 'inflexao') {
    const caminho = Array.from({ length: 161 }, (_, i) => {
      const t = -5 + i / 16;
      return `${i ? 'L' : 'M'}${r(42 + i / 160 * 276)} ${r(323 - logistica(t) * 140)}`;
    }).join(' ');
    desenhos.push(`<path d="${caminho}" fill="none" stroke="${tinta}" stroke-width="1.5" stroke-linecap="round"/>`);
    desenhos.push(`<circle cx="180" cy="253" r="4.5" fill="${ouro}"/>`);
  } else {
    desenhos.push(`<g transform="rotate(-28 180 250)" fill="none" stroke="${tinta}"><ellipse cx="180" cy="250" rx="132" ry="65" stroke-width="1.2"/><ellipse cx="180" cy="250" rx="103" ry="105" stroke-width=".5" opacity=".25"/><ellipse cx="180" cy="250" rx="150" ry="28" stroke-width=".5" opacity=".25"/><circle cx="65" cy="250" r="4.5" fill="${ouro}" stroke="none"/></g>`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 480" role="img" aria-labelledby="${id}-titulo ${id}-descricao"><title id="${id}-titulo">${esc(titulo)} — estudo matemático</title><desc id="${id}-descricao">${esc(descricao)}</desc><rect width="360" height="480" fill="${fundo}"/><text x="180" y="72" text-anchor="middle" fill="${suave}" font-family="sans-serif" font-size="7" letter-spacing="2.2">ESTUDO DE COMPOSIÇÃO / ${tipo === 'inflexao' ? '01' : '02'}</text><text x="180" y="119" text-anchor="middle" fill="${tinta}" font-family="'Bodoni Moda',Georgia,serif" font-size="29">${titulo}</text>${desenhos.join('')}<text x="180" y="389" text-anchor="middle" fill="${suave}" font-family="sans-serif" font-size="7" letter-spacing=".8">${tipo === 'inflexao' ? 'CURVA LOGÍSTICA · MODELO MATEMÁTICO' : 'ÓRBITA ELÍPTICA · MODELO IDEALIZADO'}</text><text x="180" y="437" text-anchor="middle" fill="${tinta}" font-family="'Bodoni Moda',Georgia,serif" font-size="8" letter-spacing="3">INFLEXO</text></svg>`;
}
