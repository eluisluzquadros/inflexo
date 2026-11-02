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

/** Endereço público do site para os retornos da Stripe. Atrás do proxy do Render, req.url traz o endereço interno. */
export function urlDoSite(req: Request): string {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, '');
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host');
  const proto = req.headers.get('x-forwarded-proto') ?? 'https';
  return host ? `${proto}://${host}` : new URL(req.url).origin;
}
