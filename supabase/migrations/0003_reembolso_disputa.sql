-- Reembolso e contestação (chargeback). Estados da máquina em docs/02_ARQUITETURA.md:
--   pago → reembolsado (reembolso total) · pago → em_disputa → pago (ganha) | disputa_perdida (perdida)
-- Reembolso parcial não muda o estado; só registra o valor devolvido.

alter table public.inflexo_pedidos drop constraint if exists inflexo_pedidos_status_check;
alter table public.inflexo_pedidos add constraint inflexo_pedidos_status_check
  check (status in ('aguardando_pagamento', 'pago', 'falhou', 'expirado', 'cancelado',
                    'reembolsado', 'em_disputa', 'disputa_perdida'));

alter table public.inflexo_pedidos add column if not exists reembolsado_centavos int not null default 0
  check (reembolsado_centavos >= 0);
alter table public.inflexo_pedidos add column if not exists reembolsado_em timestamptz;
alter table public.inflexo_pedidos add column if not exists disputa_status text;

create index if not exists inflexo_pedidos_payment_intent on public.inflexo_pedidos (stripe_payment_intent);
