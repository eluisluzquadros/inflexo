// Um único desenho-mestre: nenhum enredo altera os nós, folhas ou ponto dourado.
// A forma é uma composição simbólica autoral, não uma curva medida.
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
export const BAMBU_CANONICO='/inflexoes/bambu-canonico-v1.webp';
// Coordenadas do nó no desenho-mestre. O círculo vetorial cobre o ponto original
// e dá presença ao marco sem regenerar ou deslocar nenhum traço do bambu.
export const MARCO_BAMBU={x:166.0145,y:267.027,raio:5.6,cor:'#AC7C20'};

export function formaBambuCanonico(imagemHref=BAMBU_CANONICO){
  const p=MARCO_BAMBU;
  return `<g data-forma="nos-no-tempo-v2"><image data-canone="bambu-nos-no-tempo-v2" x="42" y="119" width="276" height="263" preserveAspectRatio="xMidYMid meet" href="${esc(imagemHref)}"/><circle data-marco="principal" cx="${p.x}" cy="${p.y}" r="${p.raio}" fill="${p.cor}" stroke="#F7F3EA" stroke-width="1.1"/></g>`;
}

export function renderBambuCanonico({
  id='bambu-canonico', titulo='Nós no tempo', legenda='COMPOSIÇÃO AUTORAL · FORMA CANÔNICA',
  marco='', imagemHref=BAMBU_CANONICO,
}={}){
  if(!/^[a-zA-Z][\w-]*$/.test(id))throw new Error('Identificador inválido');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 480" role="img" aria-labelledby="${id}-titulo ${id}-descricao">
<title id="${id}-titulo">${esc(titulo)} — Nós no tempo</title>
<desc id="${id}-descricao">Composição autoral inspirada no bambu. Um ramo de tinta com um único nó dourado; a mesma forma é preservada entre histórias. Não representa dados medidos.</desc>
<rect width="360" height="480" fill="#F7F3EA"/>
<text x="180" y="59" text-anchor="middle" fill="#787B6D" font-family="sans-serif" font-size="6.5" letter-spacing="2">INFLEXÕES / ESTUDO DE COMPOSIÇÃO</text>
<text x="180" y="103" text-anchor="middle" fill="#283129" font-family="'Bodoni Moda',Georgia,serif" font-size="29">${esc(titulo)}</text>
${formaBambuCanonico(imagemHref)}
${marco?`<text x="180" y="401" text-anchor="middle" fill="#283129" font-family="'Bodoni Moda',Georgia,serif" font-size="12.5">${esc(marco)}</text>`:''}
<text x="180" y="${marco?420:403}" text-anchor="middle" fill="#787B6D" font-family="sans-serif" font-size="5.8" letter-spacing=".65">${esc(legenda)}</text>
<text x="180" y="452" text-anchor="middle" fill="#283129" font-family="'Bodoni Moda',Georgia,serif" font-size="8" letter-spacing="3">INFLEXO</text>
</svg>`;
}
