// INFLEXO · Dobra temporal v1.
// Forma-assinatura simbólica. A geometria é fixa e independe de título, data e marco.
// Os fios não são séries observadas, linhagens biológicas ou uma escala temporal.
const r = n => Math.round(n * 1000) / 1000;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const DISPLAY = "'Bodoni Moda',Georgia,serif";
const MONO = "'IBM Plex Mono',monospace";
const TEMAS = {
  papel: { papel: '#F5F0E6', tinta: '#202922', secundario: '#6F7468', ouro: '#B48B32' },
  noite: { papel: '#16211E', tinta: '#EEE8DA', secundario: '#A3ADA0', ouro: '#C4A459' },
};
const SEGMENTOS = [
  [[66,646],[200,646],[266,716],[350,648]],
  [[350,648],[432,582],[419,454],[508,454]],
  [[508,454],[605,454],[626,490],[774,380]],
];
function bezier(p, t) {
  const a = 1 - t;
  return [0,1].map(k => a*a*a*p[0][k] + 3*a*a*t*p[1][k] + 3*a*t*t*p[2][k] + t*t*t*p[3][k]);
}
function eixo(t) {
  const j = t < .42 ? 0 : t < .66 ? 1 : 2;
  const inicio = [0,.42,.66][j], tamanho = [.42,.24,.34][j];
  return bezier(SEGMENTOS[j], Math.max(0, Math.min(1, (t-inicio)/tamanho)));
}
function ponto(t, camada) {
  const centro = eixo(t);
  const a = eixo(Math.max(0,t-.0001)), b = eixo(Math.min(1,t+.0001));
  const dx = b[0]-a[0], dy=b[1]-a[1], n=Math.hypot(dx,dy)||1;
  const largura = 42 + 22*Math.sin(Math.PI*t) - 48*Math.exp(-Math.pow((t-.66)/.15,2));
  const fio = camada*largura + .16*Math.sin(43*t+camada*3)*Math.sin(Math.PI*t);
  return { x:r(centro[0]-dy/n*fio), y:r(centro[1]+dx/n*fio) };
}

/** Mesmas coordenadas em TODAS as narrativas e temas. */
export function geometriaDobraTemporal() {
  const linhas = Array.from({length:64},(_,i)=>{
    const camada = -1 + 2*i/63;
    const d = Array.from({length:261},(_,j)=>{
      const p=ponto(j/260,camada);
      return `${j?'L':'M'}${p.x},${p.y}`;
    }).join(' ');
    return { d, indice:i, peso:r(.23+.11*(1-Math.abs(camada))), opacidade:r(.2+.54*(1-Math.abs(camada))) };
  });
  const pontos = [2,8,14,21,29,37,44,52,59].map((i,j)=>({
    ...ponto([.11,.23,.31,.42,.54,.73,.83,.9,.96][j],-1+2*i/63),
    r: j%3===0 ? 1.1 : .62,
  }));
  return { linhas, pontos, marco:{x:508,y:454,r:5.1} };
}

export function formaDobraTemporal({tema='papel'}={}) {
  const c=TEMAS[tema];
  if(!c) throw Error('Tema desconhecido');
  const g=geometriaDobraTemporal();
  return `<g data-canone="dobra-temporal-v1" fill="none" stroke-linecap="round" stroke-linejoin="round">${g.linhas.map(l=>`<path d="${l.d}" stroke="${c.tinta}" stroke-width="${l.peso}" opacity="${l.opacidade}"/>`).join('')}${[23,24].map(i=>`<path d="${g.linhas[i].d}" stroke="${c.ouro}" stroke-width=".34" opacity=".68"/>`).join('')}${g.pontos.map(p=>`<circle cx="${p.x}" cy="${p.y}" r="${p.r}" fill="${c.tinta}" stroke="none" opacity=".65"/>`).join('')}<circle cx="${g.marco.x}" cy="${g.marco.y}" r="${g.marco.r}" fill="${c.ouro}" stroke="none"/></g>`;
}

export function renderDobraTemporal({
  titulo='Dobra temporal', numero='01', subtitulo='O instante em que tudo muda.',
  marco='Um novo começo', fonte='Estudo de linguagem · INFLEXO', tema='papel',
}={}) {
  const c=TEMAS[tema]; if(!c)throw Error('Tema desconhecido');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 1188" role="img" aria-label="${esc(titulo)} — Dobra temporal, forma simbólica INFLEXO"><defs><filter id="papel-fibra"><feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter></defs><rect width="840" height="1188" fill="${c.papel}"/><rect width="840" height="1188" filter="url(#papel-fibra)" opacity=".027"/><g text-anchor="middle"><text x="420" y="104" font-family="${MONO}" font-size="10" letter-spacing="3" fill="${c.secundario}">INFLEXÕES / ${esc(numero)}</text><text x="420" y="198" font-family="${DISPLAY}" font-size="67" fill="${c.tinta}">${esc(titulo)}</text><text x="420" y="241" font-family="${DISPLAY}" font-style="italic" font-size="20" fill="${c.secundario}">${esc(subtitulo)}</text></g>${formaDobraTemporal({tema})}<g text-anchor="middle"><text x="420" y="931" font-family="${DISPLAY}" font-size="33" fill="${c.tinta}">${esc(marco)}</text><text x="420" y="979" font-family="${MONO}" font-size="8.4" letter-spacing=".25" fill="${c.secundario}">${esc(fonte)}</text><text x="420" y="1036" font-family="${MONO}" font-size="7.8" letter-spacing="1.1" fill="${c.secundario}">FORMA SIMBÓLICA · DATAS APROXIMADAS</text><text x="420" y="1122" font-family="${DISPLAY}" font-size="16" letter-spacing="7" fill="${c.tinta}">INFLEXO</text></g></svg>`;
}

export const EXEMPLOS_DOBRA = [
  {nome:'01-origem',numero:'01',titulo:'Origem',subtitulo:'A expansão do universo.',marco:'Há cerca de 13,8 bilhões de anos',fonte:'Fonte: NASA · idade estimada do universo',url:'https://science.nasa.gov/universe/overview/'},
  {nome:'02-planeta',numero:'02',titulo:'Planeta',subtitulo:'A formação da Terra.',marco:'Há cerca de 4,54 bilhões de anos',fonte:'Fonte: USGS · idade estimada da Terra',url:'https://pubs.usgs.gov/fs/2007/3004/pdf/FS07-3004_508.pdf'},
  {nome:'03-humanidade',numero:'03',titulo:'Humanidade',subtitulo:'O surgimento de Homo sapiens.',marco:'Há cerca de 300 mil anos',fonte:'Fonte: Smithsonian · Human Origins Program',url:'https://humanorigins.si.edu/evidence/human-fossils/species/homo-sapiens'},
];

