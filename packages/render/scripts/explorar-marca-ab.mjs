// Comparação visual controlada: a marca publicada não é alterada.
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Resvg } from '@resvg/resvg-js';

const root=fileURLToPath(new URL('../../../',import.meta.url));
const out=path.join(root,'docs/mockups/marca-ab-v1');
const publicOut=path.join(root,'apps/web/public/estudos/marca-ab');
mkdirSync(out,{recursive:true});mkdirSync(publicOut,{recursive:true});
const fonts=path.join(root,'packages/render/fontes');
const glyphs=JSON.parse(execFileSync('py',['-I','-c',String.raw`
import sys,json
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
f=TTFont(sys.argv[1]); gs=f.getGlyphSet(); cmap=f.getBestCmap(); out={}
for c in 'INFLEXO':
 n=cmap[ord(c)]; pen=SVGPathPen(gs); gs[n].draw(pen)
 out[c]={'d':pen.getCommands(),'advance':f['hmtx'][n][0]}
print(json.dumps({'cap':f['OS/2'].sCapHeight,'glyphs':out}))
`,path.join(fonts,'BodoniModa-SemiBold.ttf')],{encoding:'utf8'}));
const palettes={paper:{bg:'#F4F0E8',ink:'#252B24',gold:'#B18A35',muted:'#6C7066',rule:'#D8D4C9'},night:{bg:'#252B24',ink:'#F4F0E8',gold:'#C7A354',muted:'#B4B8AD',rule:'#51574E'}};
const n=v=>Number(v.toFixed(3));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const svg=(w,h,body,title='INFLEXO — estudo de marca')=>`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img"><title>${esc(title)}</title>${body}</svg>`;
const text=(x,y,s,size=24,color=palettes.paper.ink,family='Bodoni Moda',extra='')=>`<text x="${x}" y="${y}" font-family="${family}" font-size="${size}" fill="${color}" ${extra}>${esc(s)}</text>`;
const label=(x,y,s,p=palettes.paper)=>text(x,y,s,16,p.muted,'IBM Plex Mono','letter-spacing="1.4"');
function glyph(c,x,fill,slot) {
 const g=glyphs.glyphs[c],s=100/glyphs.cap;
 const natural=g.advance*s;
 const fit=slot?Math.min(1,(slot-4)/natural):1;
 return `<path d="${g.d}" fill="${fill}" transform="translate(${n(x+(slot?(slot-natural*fit)/2:0))} 110) scale(${n(s*fit)} ${n(-s)})"/>`;
}
let prefixWidth=0;
for(const c of 'INFLE')prefixWidth+=glyphs.glyphs[c].advance*100/glyphs.cap+2.8;
const logoWidth=n(prefixWidth+188);

function ensoRibbon(){
 const pts=[];const steps=180;
 for(let i=0;i<=steps;i++){
  const t=i/steps,a=(-38+320*t)*Math.PI/180;
  const radius=39.3+.8*Math.sin(2*a+.7)+.3*Math.sin(5*a);
  const width=2.2+15*Math.pow(Math.sin(Math.PI*t),.72)*(.87+.13*Math.sin(a));
  pts.push({a,r:radius,w:width});
 }
 const edge=sign=>pts.map(p=>`${n(50+(p.r+sign*p.w/2)*Math.cos(p.a))} ${n(50+(p.r+sign*p.w/2)*Math.sin(p.a))}`);
 return 'M'+edge(1).join(' L')+' L'+edge(-1).reverse().join(' L')+' Z';
}
const enso=ensoRibbon();
function symbol(variant,p,mono=false){
 const gold=mono?p.ink:p.gold;
 return variant==='A'?`<g fill="none" stroke="${p.ink}"><path d="M12 7 C38 24 62 76 88 93" stroke-width="16"/><path d="M12 93 C38 76 62 24 88 7" stroke-width="3.2"/></g><circle cx="50" cy="50" r="7.5" fill="${gold}" stroke="${p.bg}" stroke-width="3"/>`:`<path d="${enso}" fill="${p.ink}"/><circle cx="71.2" cy="16.1" r="7.5" fill="${gold}"/>`;
}
function logo(variant,p,mono=false){
 let x=0,body='';for(const c of 'INFLE'){body+=glyph(c,x,p.ink);x+=glyphs.glyphs[c].advance*100/glyphs.cap+2.8;}
 if(variant==='A'){body+=`<g transform="translate(${n(x)} 10) scale(.9 1)">${symbol('A',p,mono)}</g>`;body+=glyph('O',x+96,p.ink,90);}
 else {body+=glyph('X',x,p.ink,90);body+=`<g transform="translate(${n(x+94)} -4) scale(.94 1.16)">${symbol('B',p,mono)}</g>`;}
 return body;
}
const placeLogo=(variant,x,y,w,p,mono=false)=>`<g transform="translate(${x} ${y}) scale(${w/logoWidth})">${logo(variant,p,mono)}</g>`;
const placeSymbol=(variant,x,y,size,p,mono=false)=>`<g transform="translate(${x} ${y}) scale(${size/100})">${symbol(variant,p,mono)}</g>`;
const png=(name,source)=>{writeFileSync(path.join(out,name+'.svg'),source);writeFileSync(path.join(out,name+'.png'),new Resvg(source,{font:{fontFiles:readdirSync(fonts).filter(f=>f.endsWith('.ttf')).map(f=>path.join(fonts,f)),loadSystemFonts:false}}).render().asPng());};
for(const variant of ['A','B'])for(const [theme,p]of Object.entries(palettes)){
 const source=svg(logoWidth,124,logo(variant,p),`INFLEXO ${variant} — ${theme}`);
 writeFileSync(path.join(out,`logo-${variant}-${theme}.svg`),source);writeFileSync(path.join(publicOut,`logo-${variant}-${theme}.svg`),source);
 const icon=svg(100,100,symbol(variant,p),`Símbolo ${variant}`);writeFileSync(path.join(out,`simbolo-${variant}-${theme}.svg`),icon);
 writeFileSync(path.join(publicOut,`simbolo-${variant}-${theme}.svg`),icon);
 writeFileSync(path.join(out,`logo-${variant}-${theme}.png`),new Resvg(source,{fitTo:{mode:'width',value:1800}}).render().asPng());
 for(const size of [16,24,32,64])writeFileSync(path.join(out,`icone-${variant}-${theme}-${size}.png`),new Resvg(icon,{fitTo:{mode:'width',value:size}}).render().asPng());
 writeFileSync(path.join(out,`logo-${variant}-${theme}-mono.svg`),svg(logoWidth,124,logo(variant,p,true)));
}

let board=`<rect width="2400" height="2000" fill="${palettes.paper.bg}"/>`;
board+=label(90,75,'INFLEXO / ESTUDO A–B / 01');
board+=text(90,177,'Dois sinais. Uma mesma marca.',76);
board+=text(90,232,'Mesmo lettering, proporção, paleta e assinatura. A mudança está no símbolo.',26,palettes.paper.muted);
board+=`<path d="M1200 310V1905" stroke="${palettes.paper.rule}"/>`;
for(const [i,v]of ['A','B'].entries()){
 const x=90+i*1200,p=palettes.paper;
 board+=label(x,330,v==='A'?'A / INTERSECÇÃO':'B / CICLO');
 board+=placeLogo(v,x+25,400,970,p);
 board+=text(x+25,655,'A estética do movimento.',33,p.ink,'Bodoni Moda','font-style="italic"');
 board+=`<path d="M${x} 708h1020" stroke="${p.rule}"/>`;
 board+=label(x,758,'SÍMBOLO ISOLADO');
 board+=placeSymbol(v,x+38,800,132,p);
 board+=`<rect x="${x+230}" y="790" width="170" height="170" rx="6" fill="${palettes.night.bg}"/>`+placeSymbol(v,x+250,810,130,palettes.night);
 board+=label(x+495,758,'REDUÇÃO / 16 · 24 · 32 · 48 PX');
 for(const [j,size]of [16,24,32,48].entries()){
  board+=placeSymbol(v,x+510+j*115,857-size/2,size,p);
  board+=text(x+510+j*115,920,String(size),15,p.muted,'IBM Plex Mono');
 }
 board+=label(x,1035,'NO CABEÇALHO');
 board+=`<rect x="${x}" y="1070" width="1020" height="135" fill="#FAF8F3" stroke="${p.rule}"/>`;
 board+=placeLogo(v,x+28,1110,235,p);
 board+=text(x+530,1145,'Loja',24)+text(x+640,1145,'Coleções',24)+text(x+820,1145,'Processo',24);
 board+=label(x,1280,'VERSÃO INVERSA');
 board+=`<rect x="${x}" y="1310" width="1020" height="270" fill="${palettes.night.bg}"/>`+placeLogo(v,x+135,1376,750,palettes.night);
 board+=label(x,1665,'UMA COR / SEM DEPENDER DO DOURADO');
 board+=placeLogo(v,x+25,1710,715,p,true)+placeSymbol(v,x+860,1705,105,p,true);
}
board+=label(90,1942,'EXPLORAÇÃO VISUAL. SEM ALTERAÇÃO DA MARCA PUBLICADA. SEM RESULTADOS DE PREFERÊNCIA SIMULADOS.');
png('01-comparacao-logo',svg(2400,2000,board));

// Nova hipótese: gesto contínuo, poucos nós e derivações. Não reutiliza as dobras v1/v2.
const canonical=`<g data-canone="nos-do-tempo-01" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
<path d="M78 326 C174 319 212 308 292 282 S424 249 470 221 S632 189 714 149 S818 113 857 109" stroke-width="2.1"/>
<path d="M83 331 C178 327 220 314 294 288 S427 257 473 226 S637 195 717 154 S819 117 857 109" stroke-width=".55" opacity=".6"/>
<path d="M116 324 C185 319 224 305 276 289 C300 278 327 276 349 271 C306 282 287 294 268 299 C212 316 167 323 116 324Z" fill="currentColor" stroke="none"/>
<path d="M343 269 C394 258 432 244 455 229 L473 219 C457 231 439 247 420 252 C397 259 366 266 343 269Z" fill="currentColor" stroke="none"/>
<path d="M507 209 C556 198 609 193 652 177 C669 172 688 163 705 155 C679 176 645 186 612 193 C574 201 538 204 507 209Z" fill="currentColor" stroke="none"/>
<path d="M294 279l3 13M469 215l7 17M716 145l5 14" stroke-width="1.5"/>
<path d="M294 285 C312 253 331 234 350 223 M350 223 C370 209 389 205 409 202" stroke-width=".8"/>
<path d="M473 224 C511 237 537 262 565 266 M565 266 C586 271 604 269 620 265" stroke-width=".8"/>
<path d="M718 152 C737 128 752 106 768 91" stroke-width=".8"/>
<circle cx="294" cy="285" r="2.8" fill="currentColor" stroke="none"/>
<circle cx="718" cy="152" r="2.8" fill="currentColor" stroke="none"/>
</g><circle data-marco="principal" cx="473" cy="224" r="7.5" fill="#B18A35"/>`;
writeFileSync(path.join(out,'forma-nos-do-tempo.svg'),svg(930,420,`<g color="${palettes.paper.ink}">${canonical}</g>`,'Nós do tempo — forma simbólica fixa'));
const stories=[['Origem','O primeiro capítulo.','Uma história começa.'],['Encontro','Dois caminhos se encontram.','Uma história ganha outro sentido.'],['Recomeço','O próximo capítulo.','Uma história continua.']];
let timeline=`<rect width="2400" height="1590" fill="${palettes.paper.bg}"/>`+label(90,72,'INFLEXO / NOVA HIPÓTESE DE FORMA / 02')+text(90,170,'Nós do tempo.',82)+text(90,225,'Uma forma reconhecível. Histórias diferentes.',35,palettes.paper.muted);
timeline+=text(90,277,'Continuidade, ritmo e bifurcações inspirados no bambu. Sem folhas ou representação botânica literal.',25,palettes.paper.muted);
for(const [i,[title,subtitle,foot]]of stories.entries()){
 const x=90+i*770;
 timeline+=`<rect x="${x}" y="360" width="680" height="1010" fill="#FAF8F1" stroke="${palettes.paper.rule}"/>`;
 timeline+=text(x+340,462,'INFLEXÕES / ESTUDO',13,palettes.paper.muted,'IBM Plex Mono','text-anchor="middle" letter-spacing="2"');
 timeline+=text(x+340,570,title,66,palettes.paper.ink,'Bodoni Moda','text-anchor="middle"');
 timeline+=text(x+340,626,subtitle,25,palettes.paper.muted,'Bodoni Moda','text-anchor="middle" font-style="italic"');
 timeline+=`<g transform="translate(${x+35} 720) scale(.6559)" color="${palettes.paper.ink}">${canonical}</g>`;
 timeline+=text(x+340,1132,foot,25,palettes.paper.ink,'Bodoni Moda','text-anchor="middle"');
 timeline+=text(x+340,1180,'SEU MARCO · SUA DATA',12,palettes.paper.muted,'IBM Plex Mono','text-anchor="middle" letter-spacing="1.5"');
 timeline+=text(x+340,1303,'INFLEXO',17,palettes.paper.ink,'Bodoni Moda','text-anchor="middle" letter-spacing="6"');
}
timeline+=label(90,1450,'A GEOMETRIA É IDÊNTICA NOS TRÊS QUADROS. MUDAM APENAS OS TEXTOS.');
timeline+=text(90,1502,'Interpretação simbólica autoral. Não é um gráfico medido nem uma escala cronológica.',23,palettes.paper.muted);
png('02-forma-historias',svg(2400,1590,timeline));

const markSvg=v=>svg(logoWidth,124,logo(v,palettes.paper));
const iconSvg=v=>svg(100,100,symbol(v,palettes.paper));
const html=`<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>INFLEXO — comparação A/B da marca</title><style>
@font-face{font-family:Bodoni;src:url('/estudos/marca-ab/bodoni.ttf')}*{box-sizing:border-box}body{margin:0;background:#F4F0E8;color:#252B24;font-family:Arial,sans-serif}main{max-width:1440px;margin:auto;padding:40px 24px}h1,h2{font-family:Bodoni,serif;font-weight:400}h1{font-size:clamp(36px,5vw,70px);margin:16px 0}p{line-height:1.7;color:#6C7066}.eyebrow{letter-spacing:.13em;font-size:11px}nav{display:flex;gap:12px;align-items:center;flex-wrap:wrap;padding:20px 0;border-block:1px solid #D8D4C9}button{padding:12px 16px;border:1px solid #C4C0B4;background:none;color:inherit;cursor:pointer}button[aria-pressed=true]{background:#252B24;color:#F4F0E8}label{display:flex;gap:12px;align-items:center;font-size:13px}input{accent-color:#252B24}.grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin:32px 0}.option{min-width:0;border:1px solid #D8D4C9;padding:28px;overflow:hidden}.option>svg{display:block;width:min(var(--logo-width,500px),100%);height:auto;margin:75px auto 20px}.signature{text-align:center;font-family:Bodoni;font-style:italic;font-size:23px}.symbols{display:flex;align-items:center;justify-content:center;gap:32px;margin:60px 0}.symbols svg{width:72px;height:72px}.sizes{display:flex;align-items:center;justify-content:center;gap:36px}.sizes span{display:grid;justify-items:center;gap:16px;font-size:11px}.sizes svg{width:var(--size);height:var(--size)}.night .option{background:#252B24;color:#F4F0E8}.night .option path[fill="#252B24"],.night .option circle[fill="#252B24"]{fill:#F4F0E8}.night .option [stroke="#252B24"]{stroke:#F4F0E8}.night .option [stroke="#F4F0E8"]{stroke:#252B24}.mono .option [fill="#B18A35"]{fill:currentColor}body[data-view=A] .option[data-id=B],body[data-view=B] .option[data-id=A]{display:none}body:not([data-view=both]) .grid{grid-template-columns:1fr}.note{border-top:1px solid #D8D4C9;padding:20px 0}.timeline{width:100%;height:auto;display:block}.downloads{display:flex;flex-wrap:wrap;gap:20px;margin:20px 0}.downloads a{color:inherit;font-size:13px}@media(max-width:760px){.grid{grid-template-columns:1fr}.option{padding:20px}.option>svg{margin-top:45px}.sizes{gap:24px}}
</style><body data-view="both"><main><div class="eyebrow">INFLEXO / ESTUDO DE IDENTIDADE</div><h1>Dois sinais. Uma mesma marca.</h1><p>Compare a logo antes de escolher a forma da coleção. Lettering, paleta, proporção e assinatura são iguais nas duas opções.</p><nav aria-label="Controles da comparação"><button data-view="both" aria-pressed="true">Lado a lado</button><button data-view="A" aria-pressed="false">Só A · X</button><button data-view="B" aria-pressed="false">Só B · O</button><label><input type="checkbox" id="night">Fundo escuro</label><label><input type="checkbox" id="mono">Uma cor</label><label>Largura da logo <input id="size" type="range" min="144" max="560" value="500"><output id="value">500 px</output></label></nav><div class="grid">${['A','B'].map(v=>`<section class="option" data-id="${v}" aria-label="Versão ${v}"><div class="eyebrow">${v==='A'?'A / INTERSECÇÃO · X COM PONTO':'B / CICLO · O INSPIRADO NO ENSŌ'}</div>${markSvg(v)}<div class="signature">A estética do movimento.</div><div class="symbols">${iconSvg(v)}</div><div class="sizes">${[16,24,32,48].map(s=>`<span style="--size:${s}px">${iconSvg(v)}${s} px</span>`).join('')}</div><div class="downloads"><a href="logo-${v}-paper.svg" download>Baixar logo SVG</a><a href="simbolo-${v}-paper.svg" download>Baixar símbolo SVG</a></div></section>`).join('')}</div><p class="note">Exploração visual A/B. A marca publicada não foi alterada. Este estudo não mede preferência de público ou conversão.</p><h2>Uma nova hipótese para a forma canônica</h2><p>O bambu inspira continuidade, nós e derivações. A mesma geometria atravessa os três enredos abaixo; apenas o texto muda. Esta hipótese não reutiliza as dobras v1 e v2.</p><img class="timeline" src="forma-historias.png" alt="A mesma forma Nós do tempo aplicada a Origem, Encontro e Recomeço"><p class="note">Forma simbólica autoral, sem escala cronológica ou dados medidos. Logos vetoriais com letras convertidas em contornos.</p></main><script>
document.querySelectorAll('button[data-view]').forEach(b=>b.onclick=()=>{document.body.dataset.view=b.dataset.view;document.querySelectorAll('button[data-view]').forEach(el=>el.setAttribute('aria-pressed',String(el===b)))});document.querySelector('#night').onchange=e=>document.body.classList.toggle('night',e.target.checked);document.querySelector('#mono').onchange=e=>document.body.classList.toggle('mono',e.target.checked);document.querySelector('#size').oninput=e=>{document.documentElement.style.setProperty('--logo-width',e.target.value+'px');document.querySelector('#value').textContent=e.target.value+' px'};
</script></body></html>`;
writeFileSync(path.join(out,'index.html'),html);writeFileSync(path.join(publicOut,'index.html'),html);
writeFileSync(path.join(publicOut,'bodoni.ttf'),readFileSync(path.join(fonts,'BodoniModa-Regular.ttf')));
writeFileSync(path.join(publicOut,'OFL-BodoniModa.txt'),readFileSync(path.join(fonts,'OFL-BodoniModa.txt')));
writeFileSync(path.join(publicOut,'forma-historias.png'),readFileSync(path.join(out,'02-forma-historias.png')));
writeFileSync(path.join(out,'LEIA-ME.txt'),`INFLEXO — estudo A/B de marca\nA: X de trajetórias com ponto central. B: X tipográfico e O aberto com variação de espessura inspirado no ensō.\nLetras convertidas em contornos de Bodoni Moda SemiBold. A paleta, escala e assinatura são comuns.\nO círculo aberto é autoral, construído para este estudo; não é reprodução do selo japonês da referência.\nNós do tempo: forma fixa simbólica inspirada no ritmo e nos nós do bambu. Os três enredos usam exatamente o mesmo fragmento SVG.\nA forma não representa dados, medições ou evolução biológica.\nPreview: http://localhost:3123/estudos/marca-ab/index.html\nNenhuma mudança aplicada à marca da loja.\n`);
console.log(JSON.stringify({out,preview:'http://localhost:3123/estudos/marca-ab/index.html',logoWidth,files:readdirSync(out).length},null,2));
