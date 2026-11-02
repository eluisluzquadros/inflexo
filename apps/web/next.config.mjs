import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

// as variáveis ficam num .env na raiz do repositório (fora do Git); o Next só lê o de apps/web
try { process.loadEnvFile(path.join(raiz, '.env')); } catch { /* em produção as variáveis vêm do ambiente */ }

/** @type {import('next').NextConfig} */
export default {
  // o app importa o motor de render e o catálogo de packages/ (fora de apps/web)
  turbopack: { root: raiz },
  outputFileTracingRoot: raiz,
  outputFileTracingIncludes: { '/**': ['../../pipeline/output/curva_presidente_2t_2026_br.json'] },
};
