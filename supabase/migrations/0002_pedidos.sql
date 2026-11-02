-- Pedidos e eventos da Stripe. Só o servidor acessa (chave de serviço). RLS ligada e sem política.
-- Regra do projeto: o pedido muda de estado só por webhook verificado + consulta à Stripe, de forma idempotente.

create table if not exists public.inflexo_pedidos (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'aguardando_pagamento'
    check (status in ('aguardando_pagamento', 'pago', 'falhou', 'expirado', 'cancelado')),
  produto text not null,
  estilo text not null,
  tema text not null,
  formato text not null,
  quantidade int not null default 1 check (quantidade between 1 and 10),
  valor_centavos int not null check (valor_centavos > 0),   -- subtotal calculado no servidor
  frete_centavos int not null default 0 check (frete_centavos >= 0),
  moeda text not null default 'brl',
  email text,
  nome text,
  endereco jsonb,
  stripe_session_id text unique,
  stripe_payment_intent text,
  total_pago_centavos int,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  pago_em timestamptz
);
create index if not exists inflexo_pedidos_status on public.inflexo_pedidos (status, criado_em desc);

-- cada evento da Stripe é processado uma vez só (a Stripe pode reenviar o mesmo evento)
create table if not exists public.inflexo_eventos_stripe (
  id text primary key,
  tipo text not null,
  pedido_id uuid references public.inflexo_pedidos (id),
  recebido_em timestamptz not null default now()
);

alter table public.inflexo_pedidos enable row level security;
alter table public.inflexo_eventos_stripe enable row level security;
revoke all on public.inflexo_pedidos from anon, authenticated;
revoke all on public.inflexo_eventos_stripe from anon, authenticated;
comment on table public.inflexo_pedidos is 'Pedidos da loja. Dado pessoal (e-mail, nome, endereço): só o servidor acessa.';
