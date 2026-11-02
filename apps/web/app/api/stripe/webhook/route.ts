import { NextResponse, after } from 'next/server';
import type Stripe from 'stripe';
import { stripe } from '../../../../lib/stripe';
import { aplicarSessao, aplicarReembolso, aplicarDisputa, eventoNovo, type Status } from '../../../../lib/pedidos';
import { processarTarefas } from '../../../../lib/tarefas';

// Webhook da Stripe. Regra do projeto: o pedido muda de estado só por evento com assinatura verificada
// + consulta à Stripe, de forma idempotente. O que libera o pedido é este handler, nunca a página de sucesso.
// Com Pix, o checkout termina (completed) ainda sem pagamento; a confirmação vem em async_payment_succeeded.
// Reembolso e contestação tiram o pedido de "pago" (o arquivo digital deixa de valer; a peça não vai para a produção).

const SESSAO = new Set([
  'checkout.session.completed',
  'checkout.session.async_payment_succeeded',
  'checkout.session.async_payment_failed',
  'checkout.session.expired',
]);
const DISPUTA = new Set(['charge.dispute.created', 'charge.dispute.closed']);

export async function POST(req: Request) {
  const assinatura = req.headers.get('stripe-signature');
  const segredo = process.env.STRIPE_WEBHOOK_SECRET;
  if (!assinatura || !segredo) return NextResponse.json({ erro: 'sem assinatura' }, { status: 400 });

  let evento: Stripe.Event;
  try {
    evento = stripe().webhooks.constructEvent(await req.text(), assinatura, segredo);
  } catch {
    return NextResponse.json({ erro: 'assinatura inválida' }, { status: 400 });
  }

  try {
    // não confia só no corpo do evento: consulta o objeto na Stripe
    const objetoId = (evento.data.object as { id: string }).id;
    let pedidoId: string | null;

    if (SESSAO.has(evento.type)) {
      const sessao = await stripe().checkout.sessions.retrieve(objetoId);
      let status: Status | null = null;
      if (evento.type === 'checkout.session.completed' || evento.type === 'checkout.session.async_payment_succeeded') {
        status = sessao.payment_status === 'paid' || sessao.payment_status === 'no_payment_required' ? 'pago' : null; // Pix pendente: segue aguardando
      } else if (evento.type === 'checkout.session.async_payment_failed') {
        status = 'falhou';
      } else {
        status = 'expirado';
      }
      await aplicarSessao(sessao, status); // só mexe em pedido ainda aguardando pagamento
      pedidoId = sessao.client_reference_id;
      // pago: o gatilho do banco já criou a tarefa; processa logo depois de responder à Stripe.
      // Se falhar aqui, a varredura (pg_cron) tenta de novo.
      if (status === 'pago') after(() => processarTarefas().catch((e) => console.error('tarefas: após webhook', e instanceof Error ? e.message : e)));
    } else if (evento.type === 'charge.refunded') {
      pedidoId = await aplicarReembolso(await stripe().charges.retrieve(objetoId));
    } else if (DISPUTA.has(evento.type)) {
      pedidoId = await aplicarDisputa(await stripe().disputes.retrieve(objetoId));
    } else {
      return NextResponse.json({ recebido: true });
    }

    if (!pedidoId) console.warn('webhook: evento sem pedido da loja', evento.type, evento.id);
    await eventoNovo(evento.id, evento.type, pedidoId); // registro (a Stripe reenvia eventos)
    return NextResponse.json({ recebido: true });
  } catch (erro) {
    console.error('webhook: falha', evento.type, erro instanceof Error ? erro.message : erro);
    return NextResponse.json({ erro: 'falha temporária' }, { status: 500 }); // a Stripe tenta de novo
  }
}
