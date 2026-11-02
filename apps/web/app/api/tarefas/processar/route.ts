import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { processarTarefas } from '../../../../lib/tarefas';

// Varredura da fila, chamada pelo agendador do banco (pg_cron + pg_net, migração 0005) quando há tarefa
// vencida, e por quem tiver o segredo. O caminho normal é o webhook, que já processa logo depois de responder.
export const maxDuration = 120;

function autorizado(req: Request): boolean {
  const segredo = process.env.TAREFAS_SEGREDO;
  const veio = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? '';
  if (!segredo || segredo.length < 32) return false;
  const a = Buffer.from(veio), b = Buffer.from(segredo);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  if (!process.env.TAREFAS_SEGREDO) return NextResponse.json({ erro: 'fila sem segredo configurado' }, { status: 503 });
  if (!autorizado(req)) return NextResponse.json({ erro: 'não autorizado' }, { status: 401 });
  try {
    return NextResponse.json(await processarTarefas());
  } catch (erro) {
    console.error('tarefas: falha na varredura', erro instanceof Error ? erro.message : erro);
    return NextResponse.json({ erro: 'falha temporária' }, { status: 500 });
  }
}
