import 'server-only';

// Acesso ao Supabase pelo servidor (REST/PostgREST) com a chave de serviço. Nunca usar no navegador.
export function bancoConfigurado(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function rest(caminho: string, init: RequestInit & { prefer?: string } = {}): Promise<Response> {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, ''), chave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !chave) throw new Error('Supabase não configurado (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)');
  const { prefer, ...resto } = init;
  const r = await fetch(`${url}/rest/v1/${caminho}`, {
    ...resto,
    cache: 'no-store',
    headers: { apikey: chave, Authorization: `Bearer ${chave}`, 'Content-Type': 'application/json', ...(prefer ? { Prefer: prefer } : {}), ...(resto.headers ?? {}) },
  });
  if (!r.ok) throw new Error(`Supabase ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return r;
}
