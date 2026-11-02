# Pós-pagamento automatizado (EXP-317)

Decisão do dono (02/11/2026): o mais automatizado possível desde o início. Nenhuma etapa depois do
pagamento depende de alguém digitar algo. Pagamento, pedido no fornecedor e nota fiscal são código
determinístico e idempotente (regra 1), nunca decisão de um modelo de linguagem.

## Fluxo

```
Stripe ── webhook verificado ──► pedido "pago"
                                   │  (gatilho no banco, mesma transação)
                                   ▼
                          inflexo_tarefas: processar_pago (uma por pedido)
                                   │  processada logo depois da resposta à Stripe (after())
                                   │  e, se falhar, pela varredura a cada minuto (pg_cron + pg_net)
                                   ▼
        digital ─► arquivo final (motor de render, sem marca d'água, PNG) ─► Storage privado
                ─► e-mail com o link do pedido (Resend) ─► download por link assinado de 10 min
        físico  ─► "bloqueada: sem fornecedor de produção configurado" (até existir o adaptador)
```

## Peças

| Peça | Onde | O que garante |
|---|---|---|
| Fila | `supabase/migrations/0004_tarefas.sql` | Tarefa criada pelo gatilho quando o pedido vira "pago"; uma por (tipo, pedido); reserva com `for update skip locked` e trava de 5 min (processo que morre não prende a tarefa) |
| Varredura | `supabase/migrations/0005_varredura.sql` | A cada minuto, só se houver tarefa vencida, o banco chama `POST /api/tarefas/processar` com o segredo guardado no Vault |
| Processador | `apps/web/lib/tarefas.ts` | Cada etapa grava o que fez antes da próxima (`arquivo_path`, `email_enviado_em`): repetir não refaz nem reenvia. Erro: nova tentativa em 2, 4, 8… min (até 6 h); depois de 8 tentativas, "falhou" |
| Arquivo final | `packages/render/src/rasterizar.mjs`, `packages/render/scripts/arquivo-final.mjs` | Mesmo SVG da prévia (regra 3), rasterizado com resvg e fontes estáticas do repositório; roda em processo filho |
| Armazenamento | `apps/web/lib/arquivos.ts` | Bucket privado `inflexo-arquivos`; só link assinado |
| E-mail | `apps/web/lib/email.ts` | Resend com chave de idempotência por pedido |
| Download | `apps/web/app/api/pedido/[id]/arquivo/route.ts` | Só com o pedido em "pago": reembolso e contestação cortam o acesso |

## Medições (02/11/2026)

- **Fidelidade (H2):** PNG do resvg contra captura do Chrome do mesmo SVG: 0,38 % a 0,86 % de pixels
  diferentes (limite pré-registrado: 2 %), só em bordas de traço e de letra. A Bodoni estática (tamanho
  óptico 28) fica um pouco mais leve que a variável do navegador em letra pequena.
- **Determinismo:** mesmo SVG, mesmos bytes.
- **Memória:** stories ~100 MB de pico; **A2 a 300 dpi com textura de papel ~600 MB**. Desenhar em faixas
  não serve: o filtro de deslocamento do resvg entra em pânico quando a faixa corta a região do filtro.

## Decisões pendentes do dono

1. **Memória do servidor.** O A2 a 300 dpi não cabe numa instância de 512 MB (Render free ou starter)
   junto com o site. Opções: (a) plano com 2 GB para o serviço web; (b) um worker separado só para gerar
   arquivo; (c) A2 digital a 200 dpi (~290 MB). Stories e fundo de tela cabem em qualquer plano.
2. **Domínio no Resend.** Sem `inflexo.com.br` verificado (registros DKIM, SPF e MX de retorno na
   Cloudflare), o e-mail só sai de `onboarding@resend.dev` e só chega à caixa do dono da conta.
3. **Fornecedor de decoração.** A Gelato produz pôster e quadro fora do Brasil (`docs/03_FORNECEDORES.md`).
   Peça física fica bloqueada na fila até existir um adaptador de fornecedor brasileiro com API.

## Adaptador de fornecedor (próxima etapa)

Interface única para cada fornecedor (regra 6): `cotar(itens, endereço)`, `criarPedido(pedido, arquivos)`,
`cancelar(id)`, `interpretarWebhook(req)` → status e rastreio. A fila ganha as tarefas `enviar_producao`
e `emitir_nfe`; a cotação substitui o frete fixo no checkout.

## Teste

`npm test` cobre o rasterizador e o processo filho. O teste de ponta a ponta (pedido real no Supabase,
rodado duas vezes: um objeto no armazenamento, um envio de e-mail; download 403 depois de reembolso)
roda depois das migrações 0004 e 0005.
