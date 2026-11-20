// Coleção piloto: os nove objetos compartilham a mesma forma canônica.
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import { formaBambuCanonico, MARCO_BAMBU } from '../src/bambuCanonico.mjs';

const root=fileURLToPath(new URL('../../../',import.meta.url));
const out=path.join(root,'docs/mockups/piloto-nos-no-tempo-v1');
const publicOut=path.join(root,'apps/web/public/estudos/nos-no-tempo');
mkdirSync(out,{recursive:true});mkdirSync(publicOut,{recursive:true});
const fonts=path.join(root,'packages/render/fontes');
const font={fontFiles:[...readdirSync(fonts).filter(f=>f.endsWith('.ttf')).map(f=>path.join(fonts,f)),'C:/Windows/Fonts/arial.ttf'],sansSerifFamily:'Arial',loadSystemFonts:false};
const master=readFileSync(path.join(root,'docs/mockups/bambu-canonico-v1/00-desenho-mestre.png'));
const canonical=formaBambuCanonico('data:image/png;base64,'+master.toString('base64'));
// Só o emblema X + ponto é usado; a marca publicada não é modificada.
const brand=`<g fill="none" stroke="#283129"><path d="M12 7 C38 24 62 76 88 93" stroke-width="16"/><path d="M12 93 C38 76 62 24 88 7" stroke-width="3.2"/></g><circle cx="50" cy="50" r="7.5" fill="#AC7C20" stroke="#F7F3EA" stroke-width="3"/>`;
const stories=[
 {id:'origem',titulo:'Origem',pessoa:'AURORA',data:'11/01/2023',frase:'O dia em que o mundo ganhou você.',contexto:'Nascimento'},
 {id:'encontro',titulo:'Encontro',pessoa:'CLARA & MIGUEL',data:'21/09/2019',frase:'Dois caminhos. Uma história.',contexto:'Encontro'},
 {id:'recomeco',titulo:'Recomeço',pessoa:'HELENA',data:'06/02/2026',frase:'O dia em que escolhi um novo caminho.',contexto:'Recomeço'},
];
const kinds=[{id:'quadro',nome:'Quadro',linha:'Estudo com moldura de madeira e passe-partout.'},{id:'camiseta',nome:'Camiseta',linha:'Estudo de estampa frontal sobre malha clara.'},{id:'caderno',nome:'Caderno',linha:'Estudo de capa rígida clara, formato A5.'}];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const svg=(w,h,body,title)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img"><title>${esc(title)}</title>${body}</svg>`;
const text=(x,y,s,size=24,{fill='#283129',family='Bodoni Moda',anchor='middle',extra=''}={})=>`<text x="${x}" y="${y}" fill="${fill}" font-family="${family}" font-size="${size}" text-anchor="${anchor}" ${extra}>${esc(s)}</text>`;
const shape=(x,y,w,h)=>`<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="42 119 276 263" preserveAspectRatio="xMidYMid meet">${canonical}</svg>`;
const signature=(x,y,w=110)=>text(x+w/2,y+11,'INFLEXO',11,{extra:'letter-spacing="3"'})+`<svg x="${x+w/2-6}" y="${y-23}" width="12" height="12" viewBox="0 0 100 100">${brand}</svg>`;
function print(s){
 return `<rect width="594" height="840" fill="#F7F3EA"/>`+
 text(297,62,'NÓS NO TEMPO / INFLEXÕES',9,{family:'IBM Plex Mono',fill:'#717467',extra:'letter-spacing="2.1"'})+
 text(297,145,s.titulo,61)+text(297,187,s.pessoa,11,{family:'IBM Plex Mono',fill:'#717467',extra:'letter-spacing="2"'})+
 shape(42,218,510,400)+text(297,674,s.data,20,{family:'IBM Plex Mono'})+
 text(297,716,s.frase,16)+signature(242,782);
}
function definitions(id){return `<defs>
 <linearGradient id="${id}-wall" x2=".8" y2="1"><stop stop-color="#F0EBE2"/><stop offset="1" stop-color="#DED6C9"/></linearGradient>
 <linearGradient id="${id}-wood" x2="1" y2=".5"><stop stop-color="#D8BC91"/><stop offset=".32" stop-color="#BC9460"/><stop offset=".6" stop-color="#D7B888"/><stop offset="1" stop-color="#AE8755"/></linearGradient>
 <linearGradient id="${id}-cloth" x1="0" y1="0" x2="1" y2=".5"><stop stop-color="#D7D1C5"/><stop offset=".2" stop-color="#EEE9DE"/><stop offset=".55" stop-color="#F8F4EB"/><stop offset=".83" stop-color="#ECE6D9"/><stop offset="1" stop-color="#D7D0C2"/></linearGradient>
 <filter id="${id}-shadow" x="-.5" y="-.5" width="2" height="2"><feGaussianBlur stdDeviation="14"/></filter>
 <filter id="${id}-grain"><feTurbulence baseFrequency=".12 .6" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".09"/></feComponentTransfer></filter>
 </defs>`;}
const shirt='M420 156 Q600 228 780 156 L970 221 L1100 391 L969 484 L875 392 L853 1005 Q600 1042 347 1005 L325 392 L231 484 L100 391 L230 221 Z';
function mockup(s,k){
 const id=s.id+'-'+k;let body=definitions(id)+`<rect width="1200" height="1200" fill="url(#${id}-wall)"/>`;
 if(k==='quadro'){
  body+=`<rect x="302" y="164" width="637" height="904" fill="#4B3A22" opacity=".23" filter="url(#${id}-shadow)"/>
  <rect x="280" y="130" width="640" height="906" fill="url(#${id}-wood)"/>
  <path d="M287 138H911M288 143H908M289 1024H912M290 1029H912M289 142V1027M294 148V1021M907 146V1023M912 141V1028" stroke="#82613C" stroke-width="1" opacity=".2"/>
  <rect x="303" y="153" width="594" height="860" fill="#F2EEE5" stroke="#AA9E8D" stroke-width="2"/>
  <rect x="319" y="179" width="563" height="798" fill="#C8BFAA" opacity=".24"/>
  <svg x="320" y="180" width="560" height="792" viewBox="0 0 594 840">${print(s)}</svg>`;
 }else if(k==='camiseta'){
  body+=`<path d="${shirt}" transform="translate(12 22)" fill="#504735" opacity=".2" filter="url(#${id}-shadow)"/>
  <path d="${shirt}" fill="url(#${id}-cloth)" stroke="#CCC4B5" stroke-width="2"/>
  <clipPath id="${id}-clip"><path d="${shirt}"/></clipPath>
  <rect x="100" y="150" width="1000" height="900" clip-path="url(#${id}-clip)" filter="url(#${id}-grain)" opacity=".5"/>
  <path d="M423 158 Q600 300 777 158 Q748 255 600 265 Q452 255 423 158" fill="#C5BCAE"/>
  <path d="M429 162 Q600 288 771 162" fill="none" stroke="#E7E0D2" stroke-width="13"/>
  <path d="M340 390L360 990M860 390L840 990M117 381L235 464M1083 381L965 464M361 994Q600 1024 840 994" fill="none" stroke="#CEC6B8" stroke-width="2"/>
  <path d="M350 418Q385 670 357 960M849 431Q805 708 845 950" fill="none" stroke="#D0C8BA" stroke-width="7" opacity=".23"/>
  ${text(600,375,s.titulo,40)}${text(600,410,s.pessoa,13,{family:'IBM Plex Mono',fill:'#717467',extra:'letter-spacing="1.6"'})}
  ${shape(377,431,446,350)}${text(600,819,s.data,19,{family:'IBM Plex Mono'})}${text(600,854,s.frase,16)}${signature(545,909)}`;
 }else{
  body+=`<rect x="365" y="184" width="514" height="725" rx="8" fill="#514536" opacity=".22" filter="url(#${id}-shadow)"/>
  <rect x="355" y="163" width="510" height="721" rx="6" fill="#C5BBAA"/>
  <rect x="362" y="164" width="498" height="710" rx="3" fill="#FCFAF4"/>
  <path d="M366 862H857M366 866H857M366 870H857" stroke="#D3CABB"/>
  <rect x="344" y="150" width="511" height="715" rx="7" fill="#E8E1D3" stroke="#C6BBA8" stroke-width="2"/>
  <rect x="344" y="150" width="511" height="715" rx="7" filter="url(#${id}-grain)" opacity=".55"/>
  <path d="M366 158V854" stroke="#BEB19D" opacity=".5"/>
  <path d="M371 158V854" stroke="#FFFDF5" opacity=".5"/>
  <svg x="385" y="182" width="428" height="605" viewBox="0 0 594 840">${print(s).replace('<rect width="594" height="840" fill="#F7F3EA"/>','')}</svg>
  <path d="M811 855V908l-13-8-13 8v-53" fill="#8A927B"/>`;
 }
 return svg(1200,1200,body,`${s.titulo} — ${k}, estudo de aplicação INFLEXO`);
}

const items=[];
for(const s of stories){
 const poster=svg(594,840,print(s),`${s.titulo} — estudo para impressão`);
 writeFileSync(path.join(out,`${s.id}-arte.svg`),poster);
 writeFileSync(path.join(out,`${s.id}-arte.png`),new Resvg(poster,{font,fitTo:{mode:'width',value:1782}}).render().asPng());
 for(const k of kinds){
  const source=mockup(s,k.id),name=s.id+'-'+k.id;
  const png=new Resvg(source,{font}).render().asPng();
  writeFileSync(path.join(out,name+'.svg'),source);writeFileSync(path.join(out,name+'.png'),png);
  await sharp(png).webp({quality:91,effort:5}).toFile(path.join(publicOut,name+'.webp'));
  writeFileSync(path.join(publicOut,name+'.svg'),source);
  items.push({id:name,historia:s.id,suporte:k.id,titulo:s.titulo,nome:k.nome,linha:k.linha,source});
 }
}
let board=`<rect width="3000" height="3350" fill="#F2EEE5"/>`;
board+=text(100,80,'INFLEXO / COLEÇÃO PILOTO / EM BREVE',18,{anchor:'start',family:'IBM Plex Mono',fill:'#6D7267',extra:'letter-spacing="2"'});
board+=text(100,186,'Nós no tempo.',90,{anchor:'start'});
board+=text(100,254,'Três histórias. Três suportes. A mesma forma.',34,{anchor:'start',fill:'#6D7267'});
for(const [i,s]of stories.entries()){
 const x=150+i*930;
 board+=text(x,334,s.contexto.toUpperCase(),17,{anchor:'start',family:'IBM Plex Mono',fill:'#6D7267',extra:'letter-spacing="1.5"'});
 for(const [j,k]of kinds.entries()){
  const y=370+j*940,item=items.find(it=>it.historia===s.id&&it.suporte===k.id);
  board+=`<svg x="${x}" y="${y}" width="840" height="840" viewBox="0 0 1200 1200">${item.source.replace(/^.*?<svg[^>]*>/s,'').replace(/<\/svg>\s*$/,'')}</svg>`;
  board+=text(x,y+885,`${s.titulo} / ${k.nome}`,22,{anchor:'start',fill:'#6D7267'});
 }
}
board+=text(100,3280,'ESTUDOS GRÁFICOS DE APLICAÇÃO · HISTÓRIAS EM ESTUDO · MATERIAIS A VALIDAR EM AMOSTRA',16,{anchor:'start',family:'IBM Plex Mono',fill:'#6D7267',extra:'letter-spacing=".8"'});
const boardSvg=svg(3000,3350,board,'Nós no tempo — coleção piloto em nove aplicações');
writeFileSync(path.join(out,'00-prancha-piloto.svg'),boardSvg);
writeFileSync(path.join(out,'00-prancha-piloto.png'),new Resvg(boardSvg,{font}).render().asPng());

const html=`<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Nós no tempo · Coleção piloto INFLEXO</title><style>
@font-face{font-family:Bodoni;src:url('bodoni.ttf')}*{box-sizing:border-box}body{margin:0;background:#F4F0E8;color:#283129;font-family:Arial,sans-serif}main{max-width:1500px;margin:auto;padding:44px 24px 70px}h1,h2,h3{font-family:Bodoni,serif;font-weight:400}h1{font-size:clamp(46px,7vw,88px);margin:18px 0}h2{font-size:32px;margin:36px 0 12px}.eyebrow{font-size:11px;letter-spacing:.15em;text-transform:uppercase}.intro{max-width:68ch;line-height:1.8;color:#6D7267}.filters{display:flex;flex-wrap:wrap;gap:16px;align-items:end;border-block:1px solid #D8D3C8;padding:20px 0;margin:30px 0}label{display:grid;gap:8px;font-size:12px}select{font:inherit;min-width:180px;padding:12px;background:#FCF9F3;color:inherit;border:1px solid #B9BDAF}.filters p{margin:0 0 13px auto;font-size:13px;color:#6D7267}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:32px 22px}.item{min-width:0}.item img{display:block;width:100%;height:auto}.image-button{padding:0;border:0;width:100%;background:none;cursor:zoom-in}.item h3{font-size:27px;margin:15px 0 6px}.item p{font-size:13px;line-height:1.6;color:#6D7267;margin:5px 0}.item a{color:inherit;font-size:12px;text-underline-offset:3px}.badge{font-size:10px;letter-spacing:.07em}.note{font-size:13px;line-height:1.8;color:#6D7267;max-width:85ch}.print-link{color:inherit;display:inline-block;margin-top:15px;font-size:14px;text-underline-offset:4px}dialog{width:min(95vw,1000px);padding:48px 12px 12px;border:0;background:#F4F0E8;max-height:95svh}dialog::backdrop{background:#172019BA}dialog img{width:100%;height:auto;max-height:80svh;object-fit:contain}dialog button{position:absolute;right:12px;top:10px;padding:9px 15px;border:0;background:#283129;color:#F4F0E8;cursor:pointer}[hidden]{display:none!important}footer{border-top:1px solid #D8D3C8;margin-top:50px;padding-top:25px}.questions{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;font-family:Bodoni;font-size:23px;line-height:1.4}.questions small{display:block;font:11px Arial,sans-serif;color:#6D7267;margin-bottom:10px}@media(max-width:850px){.grid{grid-template-columns:repeat(2,minmax(0,1fr))}.questions{grid-template-columns:1fr}.filters p{margin-left:0}}@media(max-width:480px){main{padding:28px 16px}.grid{grid-template-columns:1fr}.filters label{width:100%}select{width:100%}}
</style><body><main><div class="eyebrow">INFLEXO / COLEÇÃO PILOTO / EM BREVE</div><h1>Nós no tempo.</h1><p class="intro">O mesmo ramo, os mesmos nós e o mesmo ponto dourado. Três histórias para explorar como essa assinatura acompanha os momentos que queremos guardar.</p><div class="filters"><label for="story">História<select id="story" aria-label="História"><option value="all">Todas as histórias</option>${stories.map(s=>`<option value="${s.id}">${s.contexto} · ${s.titulo}</option>`).join('')}</select></label><label for="support">Suporte<select id="support" aria-label="Suporte"><option value="all">Todos os suportes</option>${kinds.map(k=>`<option value="${k.id}">${k.nome}</option>`).join('')}</select></label><p id="count" aria-live="polite">9 aplicações</p></div><div class="grid">${items.map(it=>{const s=stories.find(s=>s.id===it.historia);return `<article class="item" data-story="${it.historia}" data-support="${it.suporte}"><button class="image-button" type="button" aria-label="Ampliar ${it.titulo}, ${it.nome}" data-image="${it.id}.webp"><img src="${it.id}.webp" width="1200" height="1200" alt="Estudo gráfico de ${it.nome.toLowerCase()} com a composição ${it.titulo}, o bambu e o nó dourado" loading="lazy"></button><h3>${it.titulo} / ${it.nome}</h3><p class="badge">EM BREVE · ESTUDO DE APLICAÇÃO</p><p>${s.pessoa} · ${s.data}</p><p>${s.frase}</p><a href="${it.id}.svg" download>Baixar estudo SVG</a></article>`}).join('')}</div><footer><h2>Uma primeira prova de composição.</h2><p class="note">O PDF contém as três artes em páginas A3. Imprima uma página em tamanho real (100%), sem ajustar à folha, para avaliar proporção, leitura e presença do ponto. O dourado é simulado em cor. A imagem de tinta tem resolução efetiva aproximada de 184 dpi nesta aplicação: a prova avalia o layout, e o fechamento de produção depende da amostra e da especificação do fornecedor.</p><a class="print-link" href="prova-composicao-a3.pdf" download>Baixar prova A3 · três histórias</a><h2>Olhe antes de ler a explicação.</h2><div class="questions"><div><small>01</small>O que o desenho sugere para você?</div><div><small>02</small>O que conecta essas peças?</div><div><small>03</small>Qual você teria em casa ou usaria?</div></div><p class="note">A data de Aurora foi informada pelo usuário. Os demais nomes e datas são exemplos ilustrativos. Estas são representações gráficas de produto; não são fotografias de amostras fabricadas. Não há venda aberta nesta página.</p></footer><dialog aria-label="Aplicação ampliada"><button autofocus type="button">Fechar ×</button><img alt=""></dialog></main><script>
const story=document.querySelector('#story'),support=document.querySelector('#support');function filter(){let count=0;document.querySelectorAll('.item').forEach(el=>{el.hidden=!((story.value==='all'||el.dataset.story===story.value)&&(support.value==='all'||el.dataset.support===support.value));if(!el.hidden)count++});document.querySelector('#count').textContent=count+' '+(count===1?'aplicação':'aplicações')}story.onchange=support.onchange=filter;const dialog=document.querySelector('dialog');document.querySelectorAll('.image-button').forEach(b=>b.onclick=()=>{dialog.querySelector('img').src=b.dataset.image;dialog.querySelector('img').alt=b.getAttribute('aria-label');dialog.showModal()});dialog.querySelector('button').onclick=()=>dialog.close();dialog.onclick=e=>{if(e.target===dialog)dialog.close()};
</script></body></html>`;
writeFileSync(path.join(publicOut,'index.html'),html);writeFileSync(path.join(out,'index.html'),html);
writeFileSync(path.join(publicOut,'bodoni.ttf'),readFileSync(path.join(fonts,'BodoniModa-Regular.ttf')));
writeFileSync(path.join(publicOut,'OFL-BodoniModa.txt'),readFileSync(path.join(fonts,'OFL-BodoniModa.txt')));
const hashes=items.map(it=>createHash('sha256').update(it.source.match(/<g data-forma="nos-no-tempo-v2">[\s\S]*?<\/g>/)[0]).digest('hex'));
if(new Set(hashes).size!==1)throw new Error('A forma divergiu entre aplicações');
const manifest={colecao:'Nós no tempo',status:'Em breve',tipo:'Estudos gráficos de aplicação. Data de Aurora informada pelo usuário; demais nomes e datas ilustrativos.',masterSHA256:createHash('sha256').update(master).digest('hex'),formaIdentica:true,ponto:MARCO_BAMBU,historias:stories,suportes:kinds,artes:items.map(({source,...it})=>it),prova:{formato:'A3',dpiEfetivoAproximado:184,finalidade:'Prova de composição, não fechamento de produção'}};
writeFileSync(path.join(out,'manifesto.json'),JSON.stringify(manifest,null,2));
console.log(JSON.stringify({out,preview:'http://localhost:3123/estudos/nos-no-tempo/index.html',aplicacoes:items.length,formaIdentica:true},null,2));
