// Prévias da vitrine (/loja) como imagens prontas: WebP de 900 px, COM marca d'água, rasterizadas do mesmo
// SVG da peça (regra 3: um motor só) com resvg e as fontes do repositório. Substituem o SVG desenhado dentro
// da página, que pesava ~1,5 MB de HTML (EXP-331). Rodar de novo quando o motor, a curva ou a lista mudarem.
// Uso: node packages/render/scripts/previas-vitrine.mjs [pasta de saída = apps/web/public/previas]
// Precisa do Pillow no Python (py) para gravar WebP.
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync, readFileSync, statSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PREVIAS_VITRINE, LARGURA_PREVIA, previaPronta, renderPeca } from '../../core/src/catalogo.mjs';
import { rasterizar } from '../src/rasterizar.mjs';

const raiz = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const saida = path.resolve(process.argv[2] ?? path.join(raiz, 'apps', 'web', 'public', 'previas'));
const curva = JSON.parse(readFileSync(path.join(raiz, 'pipeline', 'output', 'curva_presidente_2t_2026_br.json'), 'utf8'));
mkdirSync(saida, { recursive: true });
const temp = mkdtempSync(path.join(tmpdir(), 'inflexo-previas-'));

const PARA_WEBP = `import sys
from PIL import Image
Image.open(sys.argv[1]).convert('RGB').save(sys.argv[2], 'WEBP', quality=82, method=6)`;

try {
  for (const e of PREVIAS_VITRINE) {
    const svg = renderPeca(curva, e, { previa: true });
    if (!svg.includes('PRÉVIA INFLEXO')) throw new Error(`prévia sem marca d'água: ${JSON.stringify(e)}`);
    const r = rasterizar(svg, e.formato, { largura: LARGURA_PREVIA });
    const alvo = previaPronta(e);
    if (r.largura !== alvo.largura || Math.abs(r.altura - alvo.altura) > 1) {
      throw new Error(`dimensões ${r.largura}×${r.altura}, esperado ${alvo.largura}×${alvo.altura}: ${alvo.src}`);
    }
    const png = path.join(temp, 'p.png');
    writeFileSync(png, r.png);
    const destino = path.join(saida, path.basename(alvo.src));
    execFileSync('py', ['-I', '-c', PARA_WEBP, png, destino], { stdio: 'inherit' });
    console.log(`✓ ${alvo.src}  ${r.largura}×${r.altura}  ${(statSync(destino).size / 1024).toFixed(0)} KB`);
  }
} finally {
  rmSync(temp, { recursive: true, force: true });
}
