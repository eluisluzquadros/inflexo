-- Fila de tarefas do pós-pagamento (EXP-317). Desenho em docs/08_AUTOMACAO.md.
-- O gatilho cria a tarefa na mesma transação em que o pedido vira "pago": se o pagamento foi gravado,
-- a tarefa existe. Uma tarefa por (tipo, pedido); repetir não duplica. Só o servidor acessa.

create table if not exists public.inflexo_tarefas (
  id bigint generated always as identity primary key,
  tipo text not null check (tipo in ('processar_pago')),
  pedido_id uuid not null references public.inflexo_pedidos (id) on delete cascade,
  estado text not null default 'pendente' check (estado in ('pendente', 'executando', 'feita', 'bloqueada', 'falhou')),
  tentativas int not null default 0,
  proxima_em timestamptz not null default now(),
  travada_ate timestamptz,
  erro text,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  unique (tipo, pedido_id)
);
create index if not exists inflexo_tarefas_fila on public.inflexo_tarefas (estado, proxima_em);
alter table public.inflexo_tarefas enable row level security;
revoke all on public.inflexo_tarefas from anon, authenticated;

-- entrega do pedido
alter table public.inflexo_pedidos add column if not exists arquivo_path text;
alter table public.inflexo_pedidos add column if not exists arquivo_pronto_em timestamptz;
alter table public.inflexo_pedidos add column if not exists email_enviado_em timestamptz;

-- gatilho: pedido que vira "pago" ganha a tarefa (contestação ganha volta a "pago" e não duplica)
create or replace function public.inflexo_enfileirar_pago() returns trigger language plpgsql as $$
begin
  if new.status = 'pago' and old.status is distinct from 'pago' then
    insert into public.inflexo_tarefas (tipo, pedido_id) values ('processar_pago', new.id)
    on conflict (tipo, pedido_id) do nothing;
  end if;
  return new;
end $$;
drop trigger if exists inflexo_pedidos_pago on public.inflexo_pedidos;
create trigger inflexo_pedidos_pago after update of status on public.inflexo_pedidos
  for each row execute function public.inflexo_enfileirar_pago();

-- reserva: pega até n tarefas vencidas (ou travadas por um processo que morreu), sem que dois processos
-- peguem a mesma (for update skip locked). Cada reserva conta uma tentativa e trava por 5 minutos.
create or replace function public.inflexo_reservar_tarefas(n int default 5)
returns setof public.inflexo_tarefas language sql as $$
  update public.inflexo_tarefas t
     set estado = 'executando', tentativas = t.tentativas + 1, travada_ate = now() + interval '5 minutes', atualizado_em = now()
   where t.id in (
     select id from public.inflexo_tarefas
      where (estado = 'pendente' and proxima_em <= now()) or (estado = 'executando' and travada_ate < now())
      order by proxima_em
      limit greatest(1, least(n, 20))
      for update skip locked)
  returning t.*;
$$;
revoke execute on function public.inflexo_reservar_tarefas(int) from public, anon, authenticated;
revoke execute on function public.inflexo_enfileirar_pago() from public, anon, authenticated;
grant execute on function public.inflexo_reservar_tarefas(int) to service_role;

-- arquivos finais: bucket privado; o download sai só por link assinado de curta duração
insert into storage.buckets (id, name, public) values ('inflexo-arquivos', 'inflexo-arquivos', false)
on conflict (id) do nothing;
