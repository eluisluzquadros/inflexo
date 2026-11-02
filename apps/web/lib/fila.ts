import 'server-only';
import { appendFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

// Fila de espera real. Toda escassez mostrada na loja sai daqui ou da tiragem: nada é inventado.
// Grava em .runtime/lista.jsonl até o Supabase entrar.
const DIR = path.join(process.cwd(), '..', '..', '.runtime');
const ARQ = path.join(DIR, 'lista.jsonl');

/** Contador público só a partir deste número de pessoas (abaixo disso, mostrar o número espanta). */
export const LIMIAR_CONTADOR = 100;
/** A fila compra antes: horas de acesso antecipado. */
export const HORAS_ANTES = 48;
/** Primeira tiragem numerada do quadro em fios. Compromisso comercial: confirmar antes de abrir a venda. */
export const TIRAGEM_FIOS = 500;

type Registro = { email: string; produto: string; escolha: string; consentimento: string; em: string };

function registros(): Registro[] {
  if (!existsSync(ARQ)) return [];
  return readFileSync(ARQ, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l) as Registro);
}

/** Pessoas únicas na fila, na ordem de chegada. */
export function fila(): string[] {
  const vistos = new Set<string>();
  const ordem: string[] = [];
  for (const r of registros()) if (!vistos.has(r.email)) { vistos.add(r.email); ordem.push(r.email); }
  return ordem;
}

export function tamanhoDaFila(): number {
  return fila().length;
}

/** Entra na fila (ou devolve a posição de quem já estava). Posição começa em 1. */
export function entrar(r: Omit<Registro, 'em'>): number {
  const atual = fila();
  const ja = atual.indexOf(r.email);
  mkdirSync(DIR, { recursive: true });
  appendFileSync(ARQ, JSON.stringify({ ...r, em: new Date().toISOString() }) + '\n');
  return ja >= 0 ? ja + 1 : atual.length + 1;
}
