import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

/** @type {import('next').NextConfig} */
export default {
  // o app importa o motor de render e o catálogo de packages/ (fora de apps/web)
  turbopack: { root: raiz },
  outputFileTracingRoot: raiz,
  outputFileTracingIncludes: { '/**': ['../../pipeline/output/curva_presidente_2t_2026_br.json'] },
};
