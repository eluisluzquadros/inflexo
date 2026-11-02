-- Fila de espera do INFLEXO. Um registro por e-mail (a posição é a ordem de chegada).
-- Só o servidor acessa (chave de serviço). RLS ligada e sem política: o navegador não lê nem grava.
create table if not exists public.inflexo_fila (
  id bigint generated always as identity primary key,
  email text not null,
  produto text not null,
  escolha text not null default '',
  consentimento text not null,
  criado_em timestamptz not null default now(),
  constraint inflexo_fila_email_formato check (email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$' and length(email) <= 200),
  constraint inflexo_fila_email_unico unique (email)
);
alter table public.inflexo_fila enable row level security;
revoke all on public.inflexo_fila from anon, authenticated;
comment on table public.inflexo_fila is 'Fila de espera da abertura da venda. Dado pessoal (e-mail + consentimento): apagar a pedido.';
