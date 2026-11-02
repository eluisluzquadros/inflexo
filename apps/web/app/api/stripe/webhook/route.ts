import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { stripe } from '../../../../lib/stripe';
import { aplicarSessao, eventoNovo, type Status } from '../../../../lib/pedidos';

// Webhook da Stripe. Regra do projeto: o pedido muda de estado só por evento com assinatura verificada
// + consulta à Stripe, de forma idempotente. O que libera o pedido é este handler, nunca a página de sucesso.
// Com Pix, o checkout termina (completed) ainda sem pagamento; a confirmação vem em async_payment_succeeded.

const TRATADOS = new Set([
  'checkout.session.completed',
  'checkout.session.async_payment_succeeded',
  'checkout.session.async_payment_failed',
  'checkout.session.expired',
]);

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
  if (!TRATADOS.has(evento.type)) return NextResponse.json({ recebido: true });

  try {
    // não confia só no corpo do evento: consulta a sessão na Stripe
    const id = (evento.data.object as Stripe.Checkout.Session).id;
    const sessao = await stripe().checkout.sessions.retrieve(id);
    let status: Status | null = null;
    if (evento.type === 'checkout.session.completed' || evento.type === 'checkout.session.async_payment_succeeded') {
      status = sessao.payment_status === 'paid' || sessao.payment_status === 'no_payment_required' ? 'pago' : null; // Pix pendente: segue aguardando
    } else if (evento.type === 'checkout.session.async_payment_failed') {
      status = 'falhou';
    } else if (evento.type === 'checkout.session.expired') {
      status = 'expirado';
    }
    await aplicarSessao(sessao, status);          // idempotente: não rebaixa pedido pago
    await eventoNovo(evento.id, evento.type, sessao.client_reference_id); // registro (a Stripe reenvia eventos)
    return NextResponse.json({ recebido: true });
  } catch (erro) {
    console.error('webhook: falha', evento.type, erro instanceof Error ? erro.message : erro);
    return NextResponse.json({ erro: 'falha temporária' }, { status: 500 }); // a Stripe tenta de novo
  }
}
