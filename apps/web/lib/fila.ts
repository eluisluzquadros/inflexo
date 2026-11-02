import 'server-only';
import { appendFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

// Fila de espera real. Toda escassez mostrada na loja sai daqui ou da tiragem: nada é inventado.
// Com SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY, grava na tabela public.inflexo_fila (só o servidor acessa, RLS ligada).
// Sem elas (desenvolvimento), grava em .runtime/lista.jsonl.

/** Contador público só a partir deste número de pessoas (abaixo disso, mostrar o número espanta). */
export const LIMIAR_CONTADOR = 100;
/** A fila compra antes: horas de acesso antecipado. */
export const HORAS_ANTES = 48;
/** Primeira tiragem numerada do quadro em fios. Compromisso comercial: confirmar antes de abrir a venda. */
export const TIRAGEM_FIOS = 500;

type Registro = { email: string; produto: string; escolha: string; consentimento: string; em: string };

const banco = () => {
  const url = process.env.SUPABASE_URL, chave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && chave ? { url: url.replace(/\/$/, ''), chave } : null;
};

async function rest(caminho: string, init: RequestInit & { prefer?: string } = {}) {
  const b = banco()!;
  const { prefer, ...resto } = init;
  const r = await fetch(`${b.url}/rest/v1/${caminho}`, {
    ...resto,
    cache: 'no-store',
    headers: { apikey: b.chave, Authorization: `Bearer ${b.chave}`, 'Content-Type': 'application/json', ...(prefer ? { Prefer: prefer } : {}), ...(resto.headers ?? {}) },
  });
  if (!r.ok) throw new Error(`Supabase ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return r;
}

// ---------- arquivo local (desenvolvimento) ----------
const DIR = path.join(process.cwd(), '..', '..', '.runtime');
const ARQ = path.join(DIR, 'lista.jsonl');

function registrosLocais(): Registro[] {
  if (!existsSync(ARQ)) return [];
  return readFileSync(ARQ, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l) as Registro);
}
function filaLocal(): string[] {
  const vistos = new Set<string>();
  const ordem: string[] = [];
  for (const r of registrosLocais()) if (!vistos.has(r.email)) { vistos.add(r.email); ordem.push(r.email); }
  return ordem;
}

/** Pessoas únicas na fila (e-mails únicos de verdade). Se o banco falhar, devolve 0: o contador some, não inventa número. */
export async function tamanhoDaFila(): Promise<number> {
  if (!banco()) return filaLocal().length;
  try {
    const r = await rest('inflexo_fila?select=id', { method: 'HEAD', prefer: 'count=exact' });
    const total = Number((r.headers.get('content-range') ?? '').split('/')[1]);
    return Number.isFinite(total) ? total : 0;
  } catch {
    return 0;
  }
}

/** Entra na fila (ou devolve a posição de quem já estava). Posição começa em 1: a ordem de chegada. */
export async function entrar(r: Omit<Registro, 'em'>): Promise<number> {
  if (!banco()) {
    const atual = filaLocal();
    const ja = atual.indexOf(r.email);
    mkdirSync(DIR, { recursive: true });
    appendFileSync(ARQ, JSON.stringify({ ...r, em: new Date().toISOString() }) + '\n');
    return ja >= 0 ? ja + 1 : atual.length + 1;
  }
  // o e-mail é único: quem já estava mantém o lugar (ignore-duplicates não altera a linha)
  await rest('inflexo_fila?on_conflict=email', {
    method: 'POST',
    prefer: 'resolution=ignore-duplicates,return=minimal',
    body: JSON.stringify({ email: r.email, produto: r.produto, escolha: r.escolha, consentimento: r.consentimento }),
  });
  const minha = await (await rest(`inflexo_fila?select=id&email=eq.${encodeURIComponent(r.email)}&limit=1`)).json() as { id: number }[];
  const id = minha[0]?.id;
  if (!id) throw new Error('Registro não encontrado depois de gravar');
  const antes = await rest(`inflexo_fila?select=id&id=lt.${id}`, { method: 'HEAD', prefer: 'count=exact' });
  return Number((antes.headers.get('content-range') ?? '').split('/')[1]) + 1;
}
