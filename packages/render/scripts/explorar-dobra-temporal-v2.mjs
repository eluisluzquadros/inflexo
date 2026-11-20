import { mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import { EXEMPLOS_DOBRA } from '../src/dobraTemporal.mjs';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const output = path.join(root, 'docs/mockups/dobra-temporal-v2');
const fontDirectory = path.join(root, 'packages/render/fontes');
const fontFiles = readdirSync(fontDirectory)
  .filter(name => name.endsWith('.ttf'))
  .map(name => path.join(fontDirectory, name));

const display = "'Bodoni Moda', Georgia, serif";
const mono = "'IBM Plex Mono', monospace";
const paper = { background: '#F5F0E6', ink: '#232C27', quiet: '#5D6459', rule: '#C7C4B7', gold: '#A57525' };
const night = { background: '#172520', ink: '#ECE6D9', quiet: '#BABEB0', rule: '#47554B', gold: '#D6A953' };
const pivot = 0.592;
const shapeWidth = 1000;
const shapeHeight = 560;
const mark = { x: 100 + 790 * pivot, y: 255 };
const round = value => Number(value.toFixed(2));
const escape = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
})[char]);

// The center trajectory has opposite curvature on each side of the same pivot.
// The individual threads are designed offsets with intentionally staggered ends.
const strands = Array.from({ length: 17 }, (_, index) => {
  const rank = index - 8;
  const edge = Math.abs(rank) / 8;
  const tStart = rank === 0 ? 0 : 0.012 + edge * 0.083 + (index % 3) * 0.012;
  const tEnd = rank === 0 ? 1 : 1 - edge * 0.09 - (index % 5) * 0.012;
  const d = Array.from({ length: 161 }, (_, step) => {
    const t = tStart + (tEnd - tStart) * step / 160;
    const relative = t - pivot;
    const center = 255 - 96 * Math.tanh(relative / 0.128) - 44 * relative;
    const outerSpacing = 8.8 + 8.5 * (1 - t) + 0.36 * rank;
    const spacing = 1.7 + (outerSpacing - 1.7) * (1 - Math.exp(-((relative / 0.17) ** 2)));
    const x = 100 + 790 * t;
    const y = center + rank * spacing;
    return `${step === 0 ? 'M' : 'L'}${round(x)} ${round(y)}`;
  }).join(' ');
  const weight = rank === 0 ? 2.7 : 1.15 - 0.37 * edge;
  const opacity = rank === 0 ? 1 : 0.77 - 0.32 * edge;
  return { d, weight: round(weight), opacity: round(opacity) };
});

function artwork(palette) {
  return `<g data-canon="dobra-temporal-v2" fill="none" stroke="${palette.ink}" stroke-linecap="round" stroke-linejoin="round">
${strands.map(({ d, weight, opacity }) => `  <path d="${d}" stroke-width="${weight}" opacity="${opacity}"/>`).join('\n')}
  <circle cx="${round(mark.x)}" cy="${mark.y}" r="8.2" fill="${palette.gold}" stroke="${palette.background}" stroke-width="1.6"/>
</g>`;
}

function svg(width, height, title, content) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img">
<title>${escape(title)}</title>
${content}
</svg>\n`;
}

function svgText(x, y, value, { size, fill, family = display, anchor = 'start', tracking = 0, italic = false }) {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${family}" font-size="${size}" fill="${fill}" letter-spacing="${tracking}"${italic ? ' font-style="italic"' : ''}>${escape(value)}</text>`;
}

function typography(palette) {
  return {
    label: { size: 13, family: mono, fill: palette.quiet, tracking: 2.4 },
    title: { size: 116, fill: palette.ink, tracking: -2 },
    caption: { size: 33, fill: palette.quiet, italic: true },
    date: { size: 50, fill: palette.ink, tracking: -0.45 },
    source: { size: 14, family: mono, fill: palette.quiet },
  };
}

function poster(story, palette) {
  const type = typography(palette);
  return `<rect width="1000" height="1414" fill="${palette.background}"/>
${svgText(86, 116, 'INFLEXÕES / ' + story.numero, type.label)}
${svgText(78, 252, story.titulo, type.title)}
${svgText(86, 319, story.subtitulo, type.caption)}
<g transform="translate(0 374)">${artwork(palette)}</g>
<path d="M86 961H914" stroke="${palette.rule}" stroke-width="1" fill="none"/>
${svgText(86, 1014, 'MARCO HISTÓRICO', type.label)}
${svgText(86, 1090, story.marco, type.date)}
<a href="${escape(story.url)}">${svgText(86, 1140, story.fonte, type.source)}</a>
${svgText(86, 1314, 'INFLEXO', { size: 29, fill: palette.ink, tracking: 6 })}
${svgText(914, 1314, 'TRAÇO SIMBÓLICO', { ...type.label, anchor: 'end' })}`;
}

function exportArt(name, document, width) {
  writeFileSync(path.join(output, name + '.svg'), document);
  const rendered = new Resvg(document, {
    fitTo: { mode: 'width', value: width },
    font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Bodoni Moda' },
  }).render();
  writeFileSync(path.join(output, name + '.png'), rendered.asPng());
}

mkdirSync(output, { recursive: true });
for (const story of EXEMPLOS_DOBRA) {
  exportArt(story.nome, svg(1000, 1414, story.titulo + ' · INFLEXO', poster(story, paper)), 2000);
}
exportArt('04-origem-noite', svg(1000, 1414, 'Origem · INFLEXO', poster(EXEMPLOS_DOBRA[0], night)), 2000);
exportArt('05-forma-canonica', svg(shapeWidth, shapeHeight, 'Dobra temporal · Forma canônica INFLEXO', artwork(paper)), 2000);

const triptych = EXEMPLOS_DOBRA.map((story, index) => {
  const x = 100 + index * 746;
  return `<g transform="translate(${x} 693)">
  <rect x="-8" y="-8" width="724" height="1017" rx="1" fill="#252B26"/>
  <rect width="708" height="1001.112" fill="#FAF6ED"/>
  <svg x="24" y="24" width="660" height="953.112" viewBox="0 0 1000 1414">
  ${poster(story, paper)}
  </svg>
</g>`;
}).join('\n');

const board = svg(2400, 1800, 'Dobra temporal v2 · Origem, Planeta e Humanidade', `
<rect width="2400" height="1800" fill="#E6E1D6"/>
<rect width="2400" height="607" fill="${night.background}"/>
${svgText(99, 115, 'INFLEXO', { size: 44, fill: night.ink, tracking: 5 })}
${svgText(2298, 110, 'INFLEXÕES / ESTUDO 02', { size: 17, fill: night.quiet, family: mono, tracking: 2.6, anchor: 'end' })}
<path d="M100 155H2300" stroke="${night.rule}" fill="none"/>
${svgText(94, 303, 'Dobra temporal', { size: 99, fill: night.ink, tracking: -3 })}
${svgText(104, 383, 'Um traço, diferentes histórias.', { size: 37, fill: night.quiet, italic: true })}
<svg x="880" y="166" width="1410" height="401" viewBox="80 70 865 480" preserveAspectRatio="xMidYMid meet">
  ${artwork(night)}
</svg>
${triptych}`);
exportArt('00-prancha', board, 2400);
console.log(output);
