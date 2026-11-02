import 'server-only';
import type Stripe from 'stripe';
import { rest } from './supabase';

// Pedidos. Regra do projeto: o estado só muda por webhook verificado + consulta à Stripe, de forma idempotente.
// Cada transição só vale a partir dos estados permitidos (filtro no PATCH), então um evento reenviado ou
// fora de ordem não desfaz nada: um pedido pago nunca volta a "aguardando", um reembolsado nunca volta a "pago".
//   aguardando_pagamento → pago | falhou | expirado | cancelado
//   pago → reembolsado (total) · pago → em_disputa → pago (ganha) | disputa_perdida

export type Status = 'aguardando_pagamento' | 'pago' | 'falhou' | 'expirado' | 'cancelado' | 'reembolsado' | 'em_disputa' | 'disputa_perdida';
export type Pedido = {
  id: string; status: Status; produto: string; estilo: string; tema: string; formato: string;
  valor_centavos: number; frete_centavos: number; total_pago_centavos: number | null;
  email: string | null; criado_em: string; pago_em: string | null;
};

export async function criarPedido(p: { produto: string; estilo: string; tema: string; formato: string; valor_centavos: number; frete_centavos: number }): Promise<string> {
  const r = await rest('inflexo_pedidos?select=id', { method: 'POST', prefer: 'return=representation', body: JSON.stringify(p) });
  const [linha] = (await r.json()) as { id: string }[];
  return linha.id;
}

export async function ligarSessao(id: string, sessao: string): Promise<void> {
  await rest(`inflexo_pedidos?id=eq.${id}`, { method: 'PATCH', prefer: 'return=minimal', body: JSON.stringify({ stripe_session_id: sessao, atualizado_em: new Date().toISOString() }) });
}

export async function buscarPedido(id: string): Promise<Pedido | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const r = await rest(`inflexo_pedidos?id=eq.${id}&select=id,status,produto,estilo,tema,formato,valor_centavos,frete_centavos,total_pago_centavos,email,criado_em,pago_em&limit=1`);
  const [p] = (await r.json()) as Pedido[];
  return p ?? null;
}

/** Registra o evento; devolve false se ele já tinha sido processado (a Stripe reenvia eventos). */
export async function eventoNovo(id: string, tipo: string, pedidoId: string | null): Promise<boolean> {
  const r = await rest('inflexo_eventos_stripe?on_conflict=id', {
    method: 'POST', prefer: 'resolution=ignore-duplicates,return=representation',
    body: JSON.stringify({ id, tipo, pedido_id: pedidoId }),
  });
  return ((await r.json()) as unknown[]).length > 0;
}

/** Pedido que não chegou a ter sessão de pagamento (a criação na Stripe falhou). */
export async function cancelarSemSessao(id: string): Promise<void> {
  await rest(`inflexo_pedidos?id=eq.${id}&status=eq.aguardando_pagamento&stripe_session_id=is.null`, {
    method: 'PATCH', prefer: 'return=minimal', body: JSON.stringify({ status: 'cancelado', atualizado_em: new Date().toISOString() }),
  });
}

/** Aplica ao pedido o estado da sessão consultada na Stripe. Só mexe em pedido ainda aguardando pagamento. */
export async function aplicarSessao(sessao: Stripe.Checkout.Session, novoStatus: Status | null): Promise<void> {
  const id = sessao.client_reference_id;
  if (!id) return;
  const envio = sessao.collected_information?.shipping_details ?? null;
  const pi = typeof sessao.payment_intent === 'string' ? sessao.payment_intent : sessao.payment_intent?.id ?? null;
  const agora = new Date().toISOString();
  const dados: Record<string, unknown> = {
    atualizado_em: agora,
    email: sessao.customer_details?.email ?? null,
    nome: envio?.name ?? sessao.customer_details?.name ?? null,
    endereco: envio?.address ?? null,
    stripe_payment_intent: pi,
    total_pago_centavos: sessao.amount_total,
  };
  if (novoStatus) dados.status = novoStatus;
  if (novoStatus === 'pago') dados.pago_em = agora;
  await rest(`inflexo_pedidos?id=eq.${id}&status=eq.aguardando_pagamento`, { method: 'PATCH', prefer: 'return=minimal', body: JSON.stringify(dados) });
}

/** Pedido ligado a um PaymentIntent (gravado quando a sessão foi paga). */
async function pedidoDoPagamento(pi: string): Promise<string | null> {
  const r = await rest(`inflexo_pedidos?stripe_payment_intent=eq.${encodeURIComponent(pi)}&select=id&limit=1`);
  const [p] = (await r.json()) as { id: string }[];
  return p?.id ?? null;
}

const idDe = (x: string | { id: string } | null | undefined) => (typeof x === 'string' ? x : x?.id ?? null);

/**
 * Aplica um reembolso consultado na Stripe. Total: pago | em_disputa → reembolsado.
 * Parcial: só registra o valor devolvido. Devolve o id do pedido (ou null se não houver).
 */
export async function aplicarReembolso(cobranca: Stripe.Charge): Promise<string | null> {
  const pi = idDe(cobranca.payment_intent);
  const id = pi ? await pedidoDoPagamento(pi) : null;
  if (!id) return null;
  const agora = new Date().toISOString();
  const dados: Record<string, unknown> = { reembolsado_centavos: cobranca.amount_refunded, atualizado_em: agora };
  if (cobranca.refunded) Object.assign(dados, { status: 'reembolsado', reembolsado_em: agora });
  await rest(`inflexo_pedidos?id=eq.${id}&status=in.(pago,em_disputa,reembolsado)`, { method: 'PATCH', prefer: 'return=minimal', body: JSON.stringify(dados) });
  return id;
}

/**
 * Aplica uma contestação consultada na Stripe. Aberta: pago → em_disputa. Encerrada: ganha (ou só consulta
 * prévia, warning_closed) → pago; perdida → disputa_perdida. Devolve o id do pedido (ou null se não houver).
 */
export async function aplicarDisputa(disputa: Stripe.Dispute): Promise<string | null> {
  const pi = idDe(disputa.payment_intent);
  const id = pi ? await pedidoDoPagamento(pi) : null;
  if (!id) return null;
  const s = disputa.status;
  const [status, de] =
    s === 'lost' ? ['disputa_perdida', 'pago,em_disputa'] :
    s === 'won' || s === 'warning_closed' ? ['pago', 'em_disputa'] :
    ['em_disputa', 'pago,em_disputa'];
  await rest(`inflexo_pedidos?id=eq.${id}&status=in.(${de})`, {
    method: 'PATCH', prefer: 'return=minimal',
    body: JSON.stringify({ status, disputa_status: s, atualizado_em: new Date().toISOString() }),
  });
  return id;
}
