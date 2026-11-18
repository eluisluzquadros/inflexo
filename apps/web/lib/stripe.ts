import 'server-only';
import Stripe from 'stripe';

// Cliente da Stripe, só no servidor. A chave vem do ambiente; nunca vai para o navegador nem para o log.
// Recomendação da Stripe: trocar a chave secreta (sk_) por uma chave restrita (rk_) com só as permissões
// de Checkout Sessions (escrita) e leitura de eventos.
let cliente: Stripe | null = null;

export function stripe(): Stripe {
  const chave = process.env.STRIPE_SECRET_API_KEY ?? process.env.STRIPE_SECRET_KEY;
  if (!chave) throw new Error('Stripe não configurada (STRIPE_SECRET_API_KEY)');
  cliente ??= new Stripe(chave);
  return cliente;
}

/** A compra só aparece no site com a chave liga/desliga e com a Stripe configurada. Desligada, a loja fica só com a fila. */
export function checkoutAtivo(): boolean {
  return process.env.CHECKOUT_ATIVO === 'true' && Boolean(process.env.STRIPE_SECRET_API_KEY ?? process.env.STRIPE_SECRET_KEY);
}

/** Peças físicas (pôster, quadro, camiseta) só vendem com uma segunda chave: sem fornecedor ligado, o pedido
 *  ficaria parado na fila. Assim a venda pode abrir só com o arquivo digital. */
export function vendaFisicaAtiva(): boolean {
  return checkoutAtivo() && process.env.VENDA_FISICA_ATIVA === 'true';
}

/** O produto pode ser comprado agora? Digital: basta o checkout; físico: também a venda física. */
export function vendeProduto(tipo: string): boolean {
  return tipo === 'fisico' ? vendaFisicaAtiva() : checkoutAtivo();
}

/** Endereço público do site para os retornos da Stripe. Atrás do proxy do Render, req.url traz o endereço interno. */
export function urlDoSite(req: Request): string {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, '');
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host');
  const proto = req.headers.get('x-forwarded-proto') ?? 'https';
  return host ? `${proto}://${host}` : new URL(req.url).origin;
}
