import { NextResponse } from 'next/server';
import { produto, escolher, ESTILOS, TEMAS, FORMATOS } from '../../../lib/loja';
import { stripe, checkoutAtivo, urlDoSite } from '../../../lib/stripe';
import { precoDe, FRETE_PROVISORIO } from '../../../lib/precos';
import { criarPedido, ligarSessao } from '../../../lib/pedidos';

// Cria o pedido no banco e a sessão de pagamento hospedada pela Stripe (Checkout Sessions).
// O preço sai do servidor. Os meios de pagamento não são fixados no código: aparecem os ativos no painel
// (cartão com parcelamento, Pix, Google Pay, Apple Pay, Link).
const IDENTIFICADOR = 'inflexo-loja-qtrvmkzp';

export async function POST(req: Request) {
  if (!checkoutAtivo()) return NextResponse.json({ erro: 'A venda ainda não abriu. Entre na fila para comprar primeiro.' }, { status: 403 });
  const form = await req.formData();
  const p = produto(String(form.get('produto') ?? ''));
  if (!p) return NextResponse.json({ erro: 'Produto não encontrado.' }, { status: 400 });
  const e = escolher(p, { estilo: String(form.get('estilo') ?? ''), tema: String(form.get('tema') ?? ''), formato: String(form.get('formato') ?? '') });
  const valor = precoDe(p.slug, e.estilo, e.formato);
  if (!valor) return NextResponse.json({ erro: 'Combinação sem preço.' }, { status: 400 });
  const fisico = p.tipo === 'fisico';
  const frete = fisico ? FRETE_PROVISORIO : 0;
  const base = urlDoSite(req);

  try {
    const id = await criarPedido({ produto: p.slug, estilo: e.estilo, tema: e.tema, formato: e.formato, valor_centavos: valor, frete_centavos: frete });
    const sessao = await stripe().checkout.sessions.create({
      mode: 'payment',
      locale: 'pt-BR',
      client_reference_id: id,
      metadata: { pedido_id: id, produto: p.slug, estilo: e.estilo, tema: e.tema, formato: e.formato },
      payment_intent_data: { metadata: { pedido_id: id } },
      line_items: [{
        quantity: 1,
        price_data: {
          currency: 'brl',
          unit_amount: valor,
          product_data: { name: `${p.nome} · ${ESTILOS[e.estilo].nome}`, description: `${TEMAS[e.tema]} · ${FORMATOS[e.formato]}` },
        },
      }],
      ...(fisico ? {
        shipping_address_collection: { allowed_countries: ['BR'] },
        phone_number_collection: { enabled: true },
        shipping_options: [{ shipping_rate_data: { type: 'fixed_amount', fixed_amount: { amount: frete, currency: 'brl' }, display_name: 'Envio para todo o Brasil' } }],
      } : {}),
      payment_method_options: { card: { installments: { enabled: true } } },
      integration_identifier: IDENTIFICADOR,
      success_url: `${base}/pedido/${id}?sessao={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/produto/${p.slug}?estilo=${e.estilo}&tema=${e.tema}&formato=${e.formato}`,
    }, { idempotencyKey: `checkout-${id}` });
    await ligarSessao(id, sessao.id);
    if (!sessao.url) throw new Error('Sessão sem URL');
    return new NextResponse(null, { status: 303, headers: { Location: sessao.url } });
  } catch (erro) {
    console.error('checkout: falha', erro instanceof Error ? erro.message : erro);
    return NextResponse.json({ erro: 'Não conseguimos abrir o pagamento agora. Tente de novo em instantes.' }, { status: 503 });
  }
}
