// Gera o arquivo final (PNG, sem marca d'água) de cada combinação vendida do arquivo digital e grava no
// bucket privado do Supabase Storage, em catalogo/<nome>. Roda na máquina do dono, nunca no servidor do site:
// o A2 a 300 dpi chega a ~600 MB de memória (docs/08_AUTOMACAO.md). A loja só aponta o pedido para o arquivo
// pronto (EXP-329). Regravar é seguro (upsert): rode de novo sempre que o motor ou a curva mudarem.
//
// Uso: node packages/render/scripts/publicar-catalogo-digital.mjs [--so-faltando] [--sem-enviar <pasta>]
//   --so-faltando        pula as combinações que já estão no Storage
//   --sem-enviar <pasta> só gera os PNGs na pasta, sem tocar no Storage
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { produto, combinacoes, arquivoDigital } from '../../core/src/catalogo.mjs';

const run = promisify(execFile);
const raiz = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const BUCKET = 'inflexo-arquivos';
const CURVA = path.join(raiz, 'pipeline', 'output', 'curva_presidente_2t_2026_br.json');

const args = process.argv.slice(2);
const soFaltando = args.includes('--so-faltando');
const iLocal = args.indexOf('--sem-enviar');
const pastaLocal = iLocal >= 0 ? args[iLocal + 1] : null;
if (iLocal >= 0 && !pastaLocal) { console.error('--sem-enviar precisa de uma pasta'); process.exit(2); }

try { process.loadEnvFile(path.join(raiz, '.env')); } catch { /* variáveis podem vir do ambiente */ }
const url = process.env.SUPABASE_URL?.replace(/\/$/, '');
const chave = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!pastaLocal && (!url || !chave)) { console.error('faltam SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env'); process.exit(2); }
const cabecalho = { Authorization: `Bearer ${chave}`, apikey: chave };
const objeto = (caminho) => `${url}/storage/v1/object/${BUCKET}/${caminho.split('/').map(encodeURIComponent).join('/')}`;

async function existe(caminho) {
  const r = await fetch(objeto(caminho).replace('/object/', '/object/info/authenticated/'), { headers: cabecalho });
  if (r.ok) return true;
  const corpo = await r.text();
  if (/NoSuchKey|not_found/.test(corpo)) return false;
  throw new Error(`Storage ${r.status}: ${corpo.slice(0, 200)}`);
}

async function enviar(caminho, png) {
  const r = await fetch(objeto(caminho), {
    method: 'POST',
    headers: { ...cabecalho, 'Content-Type': 'image/png', 'x-upsert': 'true', 'cache-control': 'private, max-age=0' },
    body: new Uint8Array(png),
  });
  if (!r.ok) throw new Error(`Storage ${r.status}: ${(await r.text()).slice(0, 200)}`);
}

const lista = combinacoes(produto('arquivo-digital'));
const temp = await mkdtemp(path.join(tmpdir(), 'inflexo-catalogo-'));
if (pastaLocal) await mkdir(pastaLocal, { recursive: true });
let falhas = 0;
try {
  for (const e of lista) {
    const { nome, caminho } = arquivoDigital(e);
    try {
      if (!pastaLocal && soFaltando && await existe(caminho)) { console.log(`= ${caminho} (já existe)`); continue; }
      const saida = path.join(pastaLocal ?? temp, nome);
      // processo separado por combinação: a memória do A2 volta ao sistema ao fim de cada uma
      const { stdout } = await run(process.execPath, [
        path.join(raiz, 'packages', 'render', 'scripts', 'arquivo-final.mjs'), CURVA, e.estilo, e.tema, e.formato, saida,
      ], { cwd: raiz, timeout: 300_000, maxBuffer: 1 << 20 });
      const info = JSON.parse(stdout.trim().split('\n').at(-1));
      const png = await readFile(saida);
      const hash = createHash('sha256').update(png).digest('hex').slice(0, 12);
      if (!pastaLocal) { await enviar(caminho, png); if (!(await existe(caminho))) throw new Error('enviado, mas não aparece no Storage'); }
      console.log(`✓ ${pastaLocal ? saida : caminho}  ${info.largura}×${info.altura}  ${(png.length / 1e6).toFixed(1)} MB  sha256:${hash}`);
    } catch (erro) {
      falhas += 1;
      console.error(`✗ ${caminho}: ${erro instanceof Error ? erro.message : erro}`);
    }
  }
} finally {
  await rm(temp, { recursive: true, force: true });
}
console.log(`${lista.length - falhas}/${lista.length} combinações ok`);
process.exit(falhas ? 1 : 0);
