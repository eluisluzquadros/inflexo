# Roadmap

Prazos são estimativas para uma pessoa construindo com Claude Code. Cada fase só termina quando o critério de saída é cumprido e verificado.

**Escopo inicial (decisão de 31/10/2026):** começar só com os produtos do gráfico nacional, sem recorte local e sem tag NFC.

## Decisões que ainda são suas

1. **CNPJ.** Vender por uma empresa que você já tem ou abrir uma nova. O MEI tem teto de faturamento e restringe atividades; o contador define CNAE e regime.
2. **Preço do digital.** Testar R$ 19 e R$ 29, ou fixar um.

## Fase 0: viabilidade (em andamento)

- [x] **Teste 1, dados (EXP-316 H1):** curva nacional reconstruída dos boletins do TSE, diferença de 0 voto para o oficial ([método](05_METODO_CURVA_NACIONAL.md)).
- [x] **Teste 3, render:** motor SVG (`packages/render`) com dois temas e três formatos, testado.
- [x] Registrar `inflexo.com.br` (31/10/2026).
- [ ] Busca de anterioridade no INPI.
- [ ] Contador e CNPJ. Contas em sandbox: Mercado Pago, Gelato, NFE.io ou Focus NFe.
- [ ] **Teste 2, conta da unidade (EXP-316 H2):** cotar pôster e quadro A3/A2 com endereço brasileiro; pedir uma amostra física de cada.
- [ ] PDF vetorial A2 em menos de 5 s no servidor (Chromium) e PNG 4K (resvg).

## Fase 1: primeira venda real do gráfico nacional (2 a 3 semanas)

Catálogo: arquivo digital (PNG 4K + 9:16), pôster A3/A2, quadro A3/A2, cada um em Papel ou Tinta. Sem estúdio de personalização: a página do produto só escolhe tema e tamanho.

Ordem de construção:

1. Monorepo (Next.js em `apps/web`, worker em `apps/worker`), CI, lint e testes.
2. `packages/core`: catálogo, preços, pedido (máquina de estados), crédito do digital no upgrade.
3. Página da coleção e do produto com prévia (mesmo motor, com marca d'água) e imagem de compartilhamento.
4. Checkout Mercado Pago em sandbox (Pix e cartão parcelado), webhooks, e-mails.
5. Worker: arquivo final depois do pagamento (PNG e PDF), link assinado.
6. Produção via Gelato (pedido em rascunho) e NF-e em homologação.
7. Admin mínimo; termos, privacidade e consentimento; Turnstile.
8. Página pública de método (a partir de `05_METODO_CURVA_NACIONAL.md`).
9. Playwright: compra digital, compra física, reembolso.
10. Produção: domínio, Render, Supabase, Sentry; um pedido real com o seu cartão.

**Critério de saída:** 10 pedidos reais pagos e entregues com NF-e; nenhuma diferença entre prévia e impressão; jornadas do Playwright passando; um reembolso feito de ponta a ponta.

## Fase 2: recorte por estado e cidade

- Mesma curva por UF e por município, a partir de `boletins_presidente_2t_2026.csv.gz` (já processado).
- Escolha do lugar na página do produto; mapa (OpenStreetMap) como estilo opcional.
- Ecobag e camiseta (Dimona), se a fase 1 vender.

## Depois

- Objetos físico-digitais: QR no verso, tag NFC, página da cápsula.
- Edições numeradas e peças de ateliê (acrílico com LED, shadow box).
- Momentos pessoais e empresas: Cruzamento de Vidas, Linha de Chegada, Virada de Jogo.
- Venda internacional (Stripe).

## Conta da unidade

```
preço mínimo = custos diretos por unidade ÷ (1 − taxa de pagamento − imposto − custo de aquisição − margem alvo)
custos diretos = produção + frete médio + embalagem
```

**Exemplo ilustrativo (não é cotação):** quadro a R$ 110 + frete R$ 30 + embalagem R$ 8 = R$ 148. Taxa de 4% + imposto de 6% + aquisição de 15% + margem de 35% = 60%. Preço mínimo = 148 ÷ 0,40 = **R$ 370**. O número que vale sai do Teste 2.
