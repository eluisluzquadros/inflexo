import 'server-only';
import type Stripe from 'stripe';
import { rest } from './supabase';

// Pedidos. Regra do projeto: o estado só muda por webhook verificado + consulta à Stripe, de forma idempotente.
// Um pedido pago nunca volta para outro estado.

export type Status = 'aguardando_pagamento' | 'pago' | 'falhou' | 'expirado' | 'cancelado';
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

/** Aplica ao pedido o estado da sessão consultada na Stripe. Nunca rebaixa um pedido pago. */
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
  await rest(`inflexo_pedidos?id=eq.${id}&status=neq.pago`, { method: 'PATCH', prefer: 'return=minimal', body: JSON.stringify(dados) });
}
