import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { Resvg } from '@resvg/resvg-js';
import { renderBambuCanonico, formaBambuCanonico, MARCO_BAMBU } from '../src/bambuCanonico.mjs';

const root=fileURLToPath(new URL('../../../',import.meta.url));
const out=path.join(root,'docs/mockups/bambu-canonico-v2');mkdirSync(out,{recursive:true});
const master=readFileSync(path.join(root,'apps/web/public/inflexoes/bambu-canonico-v1.webp'));
// Resvg não decodifica WebP: os arquivos autônomos incorporam o PNG mestre.
const imagemHref='data:image/png;base64,'+readFileSync(path.join(root,'docs/mockups/bambu-canonico-v1/00-desenho-mestre.png')).toString('base64');
const fonts=path.join(root,'packages/render/fontes');
const font={fontFiles:[...readdirSync(fonts).filter(f=>f.endsWith('.ttf')).map(f=>path.join(fonts,f)),'C:/Windows/Fonts/arial.ttf'],sansSerifFamily:'Arial',loadSystemFonts:false};
const artwork=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="42 119 276 263">${formaBambuCanonico(imagemHref)}</svg>`;
writeFileSync(path.join(out,'00-forma-canonica.svg'),artwork);
writeFileSync(path.join(out,'00-forma-canonica.png'),new Resvg(artwork,{fitTo:{mode:'width',value:1800}}).render().asPng());
const principal=renderBambuCanonico({imagemHref});
writeFileSync(path.join(out,'05-nos-no-tempo.svg'),principal);
writeFileSync(path.join(out,'05-nos-no-tempo.png'),new Resvg(principal,{font,fitTo:{mode:'width',value:1800}}).render().asPng());
const stories=[
 {nome:'01-origem',titulo:'Origem',marco:'O primeiro capítulo.'},
 {nome:'02-encontro',titulo:'Encontro',marco:'O instante em que os caminhos se encontram.'},
 {nome:'03-recomeco',titulo:'Recomeço',marco:'Uma história continua.'},
];
const posters=stories.map(({nome,...story},i)=>{
 const source=renderBambuCanonico({...story,id:`historia-${i}`,imagemHref,legenda:'SUA HISTÓRIA · SEU MARCO'});
 writeFileSync(path.join(out,nome+'.svg'),source);
 writeFileSync(path.join(out,nome+'.png'),new Resvg(source,{font,fitTo:{mode:'width',value:1800}}).render().asPng());
 return source;
});
const text=(x,y,s,size=24,fill='#252B24',family='Bodoni Moda',extra='')=>`<text x="${x}" y="${y}" font-family="${family}" font-size="${size}" fill="${fill}" ${extra}>${s}</text>`;
let body='<rect width="2400" height="1590" fill="#EAE5DA"/>';
body+=text(90,75,'INFLEXO / FORMA CANÔNICA / ESTUDO 01',16,'#6C7066','IBM Plex Mono','letter-spacing="2"');
body+=text(90,174,'Nós no tempo.',80);
body+=text(90,238,'A mesma forma reconhecível, contando histórias diferentes.',33,'#6C7066');
for(const [i,poster]of posters.entries()){
 const x=90+i*770;
 body+=`<rect x="${x+10}" y="370" width="680" height="952" fill="#BDB5A7" opacity=".35"/>`;
 body+=`<rect x="${x}" y="360" width="680" height="952" fill="#BC9663"/>`;
 body+=`<rect x="${x+13}" y="373" width="654" height="926" fill="#F7F3EA"/>`;
 body+=`<svg x="${x+42}" y="412" width="596" height="795" viewBox="0 0 360 480">${poster.replace(/^.*?<svg[^>]*>/s,'').replace(/<\/svg>\s*$/,'')}</svg>`;
 body+=text(x,1373,`0${i+1} / ${stories[i].titulo}`,18,'#6C7066','IBM Plex Mono');
}
body+=text(90,1475,'MESMA SILHUETA · MESMOS NÓS · MESMAS FOLHAS · MESMO PONTO DOURADO',15,'#6C7066','IBM Plex Mono','letter-spacing="1"');
body+=text(90,1522,'Composição simbólica autoral. O texto muda; o desenho-mestre permanece.',25,'#6C7066');
const board=`<svg xmlns="http://www.w3.org/2000/svg" width="2400" height="1590" viewBox="0 0 2400 1590">${body}</svg>`;
writeFileSync(path.join(out,'04-tres-historias.svg'),board);
writeFileSync(path.join(out,'04-tres-historias.png'),new Resvg(board,{font}).render().asPng());
const masterHashes=posters.map(source=>createHash('sha256').update(source.match(/<g data-forma="nos-no-tempo-v2">[\s\S]*?<\/g>/)[0]).digest('hex'));
if(new Set(masterHashes).size!==1)throw new Error('A forma divergiu entre as histórias');
writeFileSync(path.join(out,'manifesto.json'),JSON.stringify({desenho:'Nós no tempo / bambu v2',asset:'apps/web/public/inflexoes/bambu-canonico-v1.webp',sha256:createHash('sha256').update(master).digest('hex'),ponto:MARCO_BAMBU,formaIdenticaNasHistorias:true,origem:'Desenho-mestre v1 preservado; ponto vetorial ampliado no SVG, sem regenerar o bambu',historias:stories},null,2));
console.log(JSON.stringify({out,formaIdenticaNasHistorias:true,masterBytes:master.length},null,2));
