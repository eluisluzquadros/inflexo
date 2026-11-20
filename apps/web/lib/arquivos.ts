import 'server-only';

// Arquivos finais no bucket privado "inflexo-arquivos" do Supabase Storage. O site não gera imagem: o arquivo
// de cada combinação do digital é gerado uma vez, fora do servidor, por
// packages/render/scripts/publicar-catalogo-digital.mjs (EXP-329). Aqui só se confere, assina e serve.
const BUCKET = 'inflexo-arquivos';

function storage(): { url: string; chave: string } {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, ''), chave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !chave) throw new Error('Supabase não configurado (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)');
  return { url: `${url}/storage/v1`, chave };
}
const caminhoSeguro = (p: string) => p.split('/').map(encodeURIComponent).join('/');

/** O objeto existe no bucket? Erro de rede ou de permissão sobe como exceção (não vira "não existe"). */
export async function existeArquivo(caminho: string): Promise<boolean> {
  const { url, chave } = storage();
  const r = await fetch(`${url}/object/info/authenticated/${BUCKET}/${caminhoSeguro(caminho)}`, {
    headers: { Authorization: `Bearer ${chave}`, apikey: chave },
  });
  if (r.ok) return true;
  const corpo = await r.text();
  if (/NoSuchKey|not_found/.test(corpo)) return false;
  throw new Error(`Storage ${r.status}: ${corpo.slice(0, 200)}`);
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
