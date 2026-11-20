import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import { formaDobraTemporal, renderDobraTemporal, EXEMPLOS_DOBRA } from '../src/dobraTemporal.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const destino=path.join(root,'docs/mockups/dobra-temporal-v1');
fs.mkdirSync(destino,{recursive:true});
const fontes=fs.readdirSync(path.join(root,'packages/render/fontes')).filter(f=>f.endsWith('.ttf')).map(f=>path.join(root,'packages/render/fontes',f));
function salvar(nome,svg,largura) {
  fs.writeFileSync(path.join(destino,nome+'.svg'),svg);
  const img=new Resvg(svg,{fitTo:{mode:'width',value:largura},font:{fontFiles:fontes,loadSystemFonts:false,defaultFontFamily:'Bodoni Moda'}}).render();
  fs.writeFileSync(path.join(destino,nome+'.png'),img.asPng());
}
for(const e of EXEMPLOS_DOBRA) salvar(e.nome,renderDobraTemporal(e),1680);
salvar('04-origem-noite',renderDobraTemporal({...EXEMPLOS_DOBRA[0],tema:'noite'}),1680);

const poster=(e,x)=>`<g transform="translate(${x},645)"><rect x="-10" y="-10" width="700" height="982" fill="#242A25"/><rect width="680" height="962" fill="#FBF8F1"/><svg x="22" y="22" width="636" height="918" viewBox="0 0 840 1188">${renderDobraTemporal(e).replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'')}</svg></g>`;
const board=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2400 1800"><rect width="2400" height="1800" fill="#EAE6DC"/><g fill="#252D26"><text x="110" y="112" font-family="'Bodoni Moda'" font-size="48" letter-spacing="4">INFLEXO</text><text x="2290" y="106" text-anchor="end" font-family="'IBM Plex Mono'" font-size="14" letter-spacing="2">ESTUDO DE LINGUAGEM / 01</text><path d="M110 153H2290" stroke="#C9C9BB" stroke-width="1"/><text x="110" y="274" font-family="'Bodoni Moda'" font-size="84">Dobra temporal.</text><text x="114" y="334" font-family="'Bodoni Moda'" font-size="31" font-style="italic">A forma permanece. A história muda.</text><text x="114" y="414" font-family="'IBM Plex Mono'" font-size="14" fill="#70786A">64 fios / um fluxo / um marco dourado</text><text x="114" y="449" font-family="'IBM Plex Mono'" font-size="14" fill="#70786A">A mesma geometria nas três aplicações.</text></g><svg x="920" y="184" width="1340" height="348" viewBox="30 340 780 400">${formaDobraTemporal()}</svg>${EXEMPLOS_DOBRA.map((e,i)=>poster(e,110+i*750)).join('')}<text x="110" y="1713" fill="#687162" font-family="'IBM Plex Mono'" font-size="15">Forma-assinatura simbólica. As datas pertencem à legenda; os fios não representam medições.</text><text x="2290" y="1713" text-anchor="end" fill="#687162" font-family="'IBM Plex Mono'" font-size="15">INFLEXO / NOV. 2026</text></svg>`;
salvar('00-sistema-canonico',board,2400);
fs.writeFileSync(path.join(destino,'fontes.json'),JSON.stringify(EXEMPLOS_DOBRA.map(({titulo,marco,url})=>({titulo,marco,url})),null,2));
console.log(destino);

