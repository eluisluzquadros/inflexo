// Monta brand/prova-de-marca.html a partir do .src.html, trocando os marcadores pelo render real.
//   <!--SVG:eixo_formato_tema-->      estilo galeria, ex.: <!--SVG:relogio_a2_papel-->
//   <!--ESTAMPA:formato_tema-->        estilo estampa, ex.: <!--ESTAMPA:quadrado_branco-->
// Uso: node packages/render/scripts/build-prova.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { renderGraficoNacional, renderEstampaNacional, renderFiosNacional } from '../src/graficoNacional.mjs';

const curva = JSON.parse(readFileSync('pipeline/output/curva_presidente_2t_2026_br.json', 'utf8'));
const src = readFileSync('brand/prova-de-marca.src.html', 'utf8');
const semTamanho = (svg) => svg.replace(/ width="[^"]+mm" height="[^"]+mm"/, '');
let n = 0;
const html = src
  .replace(/<!--SVG:([a-z]+)_([a-z0-9]+)_([a-z]+)-->/g, (_, eixo, formato, tema) => {
    n += 1;
    return semTamanho(renderGraficoNacional(curva, { eixo, formato, tema }));
  })
  .replace(/<!--ESTAMPA:([a-z0-9]+)_([a-z]+)-->/g, (_, formato, tema) => {
    n += 1;
    return semTamanho(renderEstampaNacional(curva, { formato, tema }));
  })
  .replace(/<!--FIOS:([a-z0-9]+)-->/g, (_, formato) => {
    n += 1;
    return semTamanho(renderFiosNacional(curva, { formato }));
  });
writeFileSync('brand/prova-de-marca.html', html);
console.log(`brand/prova-de-marca.html: ${n} peças inseridas`);
