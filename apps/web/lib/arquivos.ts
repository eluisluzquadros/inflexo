import 'server-only';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

// Arquivos finais: gerados num processo filho (o rasterizador pesa e pode entrar em pânico) e guardados no
// bucket privado "inflexo-arquivos" do Supabase Storage. O download sai só por link assinado de curta duração.
const BUCKET = 'inflexo-arquivos';
const raiz = () => path.join(process.cwd(), '..', '..');
const run = promisify(execFile);

function storage(): { url: string; chave: string } {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, ''), chave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !chave) throw new Error('Supabase não configurado (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)');
  return { url: `${url}/storage/v1`, chave };
}
const caminhoSeguro = (p: string) => p.split('/').map(encodeURIComponent).join('/');

/** Gera o PNG final de uma escolha do arquivo digital (sem marca d'água). */
export async function gerarArquivoFinal(e: { estilo: string; tema: string; formato: string }): Promise<Buffer> {
  const dir = await mkdtemp(path.join(tmpdir(), 'inflexo-'));
  try {
    const saida = path.join(dir, 'final.png');
    await run(process.execPath, [
      path.join(raiz(), 'packages', 'render', 'scripts', 'arquivo-final.mjs'),
      path.join(raiz(), 'pipeline', 'output', 'curva_presidente_2t_2026_br.json'),
      e.estilo, e.tema, e.formato, saida,
    ], { cwd: raiz(), timeout: 120_000, maxBuffer: 1 << 20 });
    return await readFile(saida);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

/** Grava (ou regrava, idempotente) um objeto no bucket privado. */
export async function guardarArquivo(caminho: string, dados: Buffer, tipo = 'image/png'): Promise<void> {
  const { url, chave } = storage();
  const r = await fetch(`${url}/object/${BUCKET}/${caminhoSeguro(caminho)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${chave}`, apikey: chave, 'Content-Type': tipo, 'x-upsert': 'true', 'cache-control': 'private, max-age=0' },
    body: new Uint8Array(dados),
  });
  if (!r.ok) throw new Error(`Storage ${r.status}: ${(await r.text()).slice(0, 200)}`);
}

/** Link assinado para baixar o objeto, válido por poucos minutos, com o nome de arquivo sugerido. */
export async function linkAssinado(caminho: string, nome: string, segundos = 600): Promise<string> {
  const { url, chave } = storage();
  const r = await fetch(`${url}/object/sign/${BUCKET}/${caminhoSeguro(caminho)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${chave}`, apikey: chave, 'Content-Type': 'application/json' },
    body: JSON.stringify({ expiresIn: segundos }),
  });
  if (!r.ok) throw new Error(`Storage ${r.status}: ${(await r.text()).slice(0, 200)}`);
  const { signedURL } = (await r.json()) as { signedURL: string };
  return `${url}${signedURL}&download=${encodeURIComponent(nome)}`;
}
