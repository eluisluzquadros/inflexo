import 'server-only';
import { rest } from './supabase';
import { produto, ESTILOS, TEMAS, FORMATOS } from './loja';
import { gerarArquivoFinal, guardarArquivo } from './arquivos';
import { enviarEmail, emailEntregaDigital } from './email';

// Fila do pós-pagamento (EXP-317, docs/08_AUTOMACAO.md). O gatilho do banco cria a tarefa quando o pedido
// vira "pago"; aqui ela é reservada (sem que dois processos peguem a mesma) e executada. Cada etapa grava
// o que fez no pedido antes da seguinte, então repetir não refaz o arquivo nem reenvia o e-mail.

type Tarefa = { id: number; tipo: string; pedido_id: string; tentativas: number };
type PedidoEntrega = {
  id: string; status: string; produto: string; estilo: string; tema: string; formato: string;
  email: string | null; arquivo_path: string | null; email_enviado_em: string | null;
};
type Resultado = { estado: 'feita' | 'bloqueada'; nota?: string };

const MAX_TENTATIVAS = 8;
const site = () => (process.env.SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
export const nomeDoArquivo = (p: { estilo: string; tema: string; formato: string }) => `inflexo-${p.estilo}-${p.tema}-${p.formato}.png`;

async function pedido(id: string): Promise<PedidoEntrega | null> {
  const r = await rest(`inflexo_pedidos?id=eq.${id}&select=id,status,produto,estilo,tema,formato,email,arquivo_path,email_enviado_em&limit=1`);
  const [p] = (await r.json()) as PedidoEntrega[];
  return p ?? null;
}
const atualizar = (id: string, dados: Record<string, unknown>) =>
  rest(`inflexo_pedidos?id=eq.${id}`, { method: 'PATCH', prefer: 'return=minimal', body: JSON.stringify({ ...dados, atualizado_em: new Date().toISOString() }) });

async function processarPago(t: Tarefa): Promise<Resultado> {
  const p = await pedido(t.pedido_id);
  if (!p) return { estado: 'feita', nota: 'pedido não existe mais' };
  if (p.status !== 'pago') return { estado: 'feita', nota: `pedido em "${p.status}": nada a entregar` };
  const cat = produto(p.produto);
  if (cat?.tipo !== 'digital') {
    // peça física: espera o adaptador do fornecedor (docs/08_AUTOMACAO.md). Nada é simulado.
    return { estado: 'bloqueada', nota: 'peça física: sem fornecedor de produção configurado' };
  }

  // 1. arquivo final, uma vez só
  let arquivo = p.arquivo_path;
  if (!arquivo) {
    arquivo = `pedidos/${p.id}/${nomeDoArquivo(p)}`;
    await guardarArquivo(arquivo, await gerarArquivoFinal(p));
    await atualizar(p.id, { arquivo_path: arquivo, arquivo_pronto_em: new Date().toISOString() });
  }

  // 2. e-mail com o link do pedido, uma vez só
  if (!p.email_enviado_em) {
    if (!p.email) throw new Error('pedido pago sem e-mail');
    const m = emailEntregaDigital({
      codigo: p.id.slice(0, 8).toUpperCase(),
      peca: `${cat.nome} · ${ESTILOS[p.estilo]?.nome ?? p.estilo}`,
      detalhe: `${TEMAS[p.tema] ?? p.tema} · ${FORMATOS[p.formato] ?? p.formato}`,
      link: `${site()}/pedido/${p.id}`,
    });
    await enviarEmail({ ...m, para: p.email, idempotencia: `entrega-digital-${p.id}` });
    await atualizar(p.id, { email_enviado_em: new Date().toISOString() });
  }
  return { estado: 'feita' };
}

async function fechar(t: Tarefa, estado: string, erro: string | null, extra: Record<string, unknown> = {}) {
  await rest(`inflexo_tarefas?id=eq.${t.id}&estado=eq.executando`, {
    method: 'PATCH', prefer: 'return=minimal',
    body: JSON.stringify({ estado, erro, travada_ate: null, atualizado_em: new Date().toISOString(), ...extra }),
  });
}

/** Reserva e executa tarefas vencidas, uma de cada vez (a rasterização pesa). */
export async function processarTarefas(limite = 3) {
  const r = await rest('rpc/inflexo_reservar_tarefas', { method: 'POST', body: JSON.stringify({ n: limite }) });
  const lista = (await r.json()) as Tarefa[];
  const resumo = { reservadas: lista.length, feitas: 0, bloqueadas: 0, para_repetir: 0, falharam: 0 };
  for (const t of lista) {
    try {
      if (t.tipo !== 'processar_pago') throw new Error(`tipo de tarefa desconhecido: ${t.tipo}`);
      const res = await processarPago(t);
      await fechar(t, res.estado, res.nota ?? null);
      if (res.estado === 'feita') resumo.feitas += 1; else resumo.bloqueadas += 1;
    } catch (erro) {
      const msg = (erro instanceof Error ? erro.message : String(erro)).slice(0, 500);
      console.error('tarefa: falha', t.id, t.tipo, msg);
      if (t.tentativas >= MAX_TENTATIVAS) {
        await fechar(t, 'falhou', msg); resumo.falharam += 1;
      } else {
        const espera = Math.min(2 ** t.tentativas, 360) * 60_000; // 2, 4, 8 … min, no máximo 6 h
        await fechar(t, 'pendente', msg, { proxima_em: new Date(Date.now() + espera).toISOString() });
        resumo.para_repetir += 1;
      }
    }
  }
  return resumo;
}
