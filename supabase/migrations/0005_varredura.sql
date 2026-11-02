-- Varredura da fila (EXP-317). O caminho normal é o webhook processar logo depois de responder à Stripe;
-- isto cobre o resto: tarefa que falhou e espera nova tentativa, processo que morreu no meio, servidor
-- dormindo. A cada minuto, só se houver tarefa vencida, o banco chama POST /api/tarefas/processar.
-- O endereço e o segredo ficam no Vault do Supabase (nunca no Git), gravados à parte:
--   select vault.create_secret('<https://inflexo.com.br/api/tarefas/processar>', 'inflexo_tarefas_url');
--   select vault.create_secret('<TAREFAS_SEGREDO>', 'inflexo_tarefas_segredo');

create extension if not exists pg_net;
create extension if not exists pg_cron;

create or replace function public.inflexo_varrer_tarefas() returns void
language plpgsql security definer set search_path = public, extensions as $$
declare
  destino text;
  segredo text;
begin
  if not exists (
    select 1 from public.inflexo_tarefas
     where (estado = 'pendente' and proxima_em <= now()) or (estado = 'executando' and travada_ate < now())
  ) then
    return;
  end if;
  select decrypted_secret into destino from vault.decrypted_secrets where name = 'inflexo_tarefas_url';
  select decrypted_secret into segredo from vault.decrypted_secrets where name = 'inflexo_tarefas_segredo';
  if destino is null or segredo is null then
    return;
  end if;
  perform net.http_post(
    url := destino,
    headers := jsonb_build_object('Authorization', 'Bearer ' || segredo, 'Content-Type', 'application/json'),
    body := '{}'::jsonb,
    timeout_milliseconds := 90000
  );
end $$;
revoke execute on function public.inflexo_varrer_tarefas() from public, anon, authenticated;

-- agenda com nome: rodar de novo atualiza o mesmo job em vez de duplicar
select cron.schedule('inflexo-varrer-tarefas', '* * * * *', 'select public.inflexo_varrer_tarefas()');
