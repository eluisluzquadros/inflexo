# Arquitetura da plataforma INFLEXO

## Princípios

1. **Um motor de render.** Uma função pura `(DesignSpec, dados) → SVG`, a mesma no navegador e no servidor. Prévia e produto final nunca divergem.
2. **Dinheiro só se move por webhook verificado.** O webhook dispara uma consulta ao provedor; o corpo da notificação não é confiável sozinho. Tudo é idempotente, e o pedido tem máquina de estados explícita.
3. **Fornecedores atrás de adaptadores** (pagamento, produção, nota fiscal, frete, e-mail). Trocar a Gelato por uma gráfica local é configuração, não reescrita.
4. **Dado público entra por pipeline versionado** e conferido contra o total oficial. A peça carrega a fonte e a data do recorte.
5. **"Momento" é a entidade central**, não "eleição". A coleção eleitoral é a primeira instância.

## Comparação com o benchmark (Memorável)

| Aspecto | Memorável (`skyvidya_bbmd_advogados/platform`) | INFLEXO | Por quê |
|---|---|---|---|
| Front | Vite + React, SPA com rotas em hash | Next.js (App Router) com renderização no servidor | Loja precisa de SEO, página por produto e imagem de compartilhamento por peça; rotas em hash não servem para isso |
| Back | Servidor Node próprio (`server/*.mjs`) | Rotas do Next + worker Node separado | Render e chamadas a fornecedores não podem travar a requisição do cliente |
| Banco | SQLite local, migrando para Supabase | Supabase Postgres desde o primeiro dia | Pedido é dinheiro: nada em localStorage ou arquivo local |
| Contas | Contas locais, papéis demonstrativos | Supabase Auth (link mágico) + compra como convidado | Convidado converte mais; conta serve para acompanhar pedido e cápsula |
| Filas | Rotinas no próprio processo | pg-boss (fila no próprio Postgres) | Retentativa e agendamento sem subir Redis |
| Arquivos | `.runtime` local | Cloudflare R2 | Sem custo de saída; links assinados; também hospeda os mapas (PMTiles) |
| Implantação | Render, 1 serviço, Virgínia | Render: web + worker, Supabase na mesma região | Mantém a operação que você já domina; app e banco juntos para não pagar latência entre regiões |
| Testes | `node --test` + scripts Playwright | Vitest (núcleo e render com gabarito de SVG) + Playwright (jornadas de compra) | Mesma filosofia de jornada verificada no navegador |
| Design | PRODUCT.md + DESIGN.md (impeccable) | Igual | O método funcionou |
| IA | OpenRouter/Anthropic; Higgsfield para mídia | Claude para legendas e moderação; Higgsfield para cenas | Mesmo provedor de mídia, já conectado |
| Segredos | `.env.example` + `render.yaml` com `sync:false` | Igual | Idem |

### Decisão: loja própria, não Shopify/Nuvemshop com app de personalização

Plataformas prontas resolvem checkout e nota fiscal por apps, mas a INFLEXO tem regras que elas tratam mal: toda peça é única (um arquivo por pedido), o digital vira crédito no upgrade para o físico, há tiragem numerada e ativação de tag. Manter um app de personalização dentro de plataforma de terceiros custa quase o mesmo que construir o núcleo, e prende as regras de negócio a outra empresa.

**Plano B:** se a fase 1 atrasar mais de duas semanas além da estimativa, vender o pôster por Nuvemshop + Mercado Pago + app de impressão sob demanda, sem estúdio, enquanto o núcleo fica pronto.

## Visão geral

```
Navegador ── Next.js (loja, estúdio, checkout, conta, admin) ── Supabase Postgres + Auth
   │ prévia SVG (mesmo motor)            │ enfileira trabalhos
   │                                     ▼
   │                              Worker (pg-boss) ──────────── Cloudflare R2 (PDF, PNG, PMTiles)
   │                                ├─ render final: Chromium → PDF vetorial; resvg → PNG
   │                                ├─ produção: Gelato / Dimona / ateliê (adaptadores)
   │                                ├─ nota fiscal: Focus NFe ou NFE.io
   │                                ├─ frete e etiqueta: Melhor Envio
   │                                └─ e-mail: Resend
Mercado Pago ── webhook ──► /api/webhooks/pagamentos  (assinatura + consulta + idempotência)
Pipeline Python 3.13 + DuckDB (TSE, IBGE, OSM) ──► Parquet/JSON por município ──► R2 + Postgres
```

## Repositório

```
inflexo/
  apps/web/                 Next.js: loja, estúdio, checkout, conta, cápsula, admin
  apps/worker/              trabalhos: render final, produção, NF-e, e-mail, rastreio
  packages/core/            domínio: catálogo, preços, créditos, pedidos (máquina de estados), tiragens
  packages/render/          motor SVG determinístico (estilos, formatos, tipografia)
  packages/integrations/    adaptadores: pagamento, produção, fiscal, frete, e-mail
  pipeline/                 Python + DuckDB: TSE, IBGE, OSM → dados das coleções
  brand/                    prova de marca e ativos
  docs/                     este conjunto
  PRODUCT.md  DESIGN.md  CLAUDE.md
```

Monorepo com pnpm workspaces, TypeScript estrito no app; Python 3.13 no pipeline.

## Modelo de dados (núcleo)

| Tabela | Campos principais | Observação |
|---|---|---|
| `momentos` | id, tipo (eleição, encontro, corrida, empresa), título, data, fonte, versão dos dados | A eleição de 2026 é um registro aqui |
| `colecoes` | id, momento_id, nome, cores de dado, estilos permitidos | "A Geografia da Virada" |
| `produtos` / `variantes` | sku, formato, tamanho, provedor de produção, sku do provedor, especificação de arquivo, custo, preço | Preço calculado pela conta da unidade |
| `designs` | id, colecao_id, spec (JSON), snapshot dos dados (hash), texto do cliente, status de moderação | Imutável depois de pago; edição cria versão nova |
| `renders` | design_id, tipo (prévia, pdf, png), tamanho, chave no R2, hash | Arquivos finais só depois do pagamento |
| `pedidos` / `itens` | estado, cliente, endereço, totais, crédito aplicado, consentimentos | Estado muda só pelo núcleo |
| `pagamentos` | provedor, id externo, método, valor, status, eventos brutos | Idempotência pelo id externo |
| `producoes` | item_id, provedor, id externo, status, rastreio | Uma por item físico |
| `notas_fiscais` | pedido_id, provedor, chave de acesso, status, XML/PDF | Emitida pelo worker |
| `creditos` | cliente, origem (pedido digital), valor, validade, usado_em | Upgrade digital → físico |
| `tiragens` | colecao_id, total, próximo número | Depois (edições numeradas) |
| `tags` | código curto, uid NFC, design_id, ativada_em, conteúdo da cápsula | Depois (QR e NFC) |
| `eventos` | entidade, de → para, ator, payload, quando | Linha do tempo de tudo |
| `consentimentos` | cliente, finalidade, base legal, quando, versão do texto | LGPD |

## Máquina de estados do pedido

```
rascunho → aguardando_pagamento → pago → gerando_arquivos
    digital: → entregue
    físico:  → em_revisao (janela para o cliente corrigir) → enviado_para_producao
             → em_producao → despachado → entregue
cancelado ← (qualquer estado até enviado_para_producao) → reembolsado
pago | entregue → em_disputa (contestação no cartão)
```

- Transições só pelo núcleo (`packages/core`), cada uma grava um evento.
- Item físico só vai para produção depois de pago, com arte aprovada e texto moderado.
- Pix expira (30 minutos sugeridos); pedido expirado volta a rascunho.

## Motor de render

- **Primeira peça pronta:** `packages/render/src/graficoNacional.mjs`, `renderGraficoNacional(curva, { formato, tema })` → SVG em milímetros. Temas Papel e Tinta; formatos A3, A2 e stories 9:16. JavaScript puro, sem dependências, roda no navegador e no Node. Testes em `packages/render/test/` conferem totais, números impressos, determinismo e ausência de nome, número ou partido.
- `packages/render`: função pura `render(spec, dados) → SVG`. Mesma entrada, mesmo SVG, testado contra gabaritos.
- **Navegador:** prévia em SVG, leve e com marca d'água; nenhum arquivo para baixar.
- **Servidor:** PDF vetorial por Chromium headless (página no tamanho exato, sangria de 3 mm, fontes embutidas) e PNG por resvg (4K para o digital e 9:16 para stories). O Memorável já mede ~5 s por PDF com Chromium; meta aqui: A2 em menos de 5 s.
- O formato de saída de cada produto vem da especificação do fornecedor (tamanho, sangria, DPI, perfil de cor). Imprimir uma prova física de cada SKU antes de vender: vermelho e azul saturados mudam na conversão para CMYK.
- **Fontes:** só licenças que permitem uso comercial em impresso (OFL).
- **Mapa:** OpenStreetMap via Protomaps (PMTiles no R2). Prévia com MapLibre GL JS; na impressão, os vetores são extraídos e desenhados no SVG. Atribuição "© colaboradores do OpenStreetMap" na peça (licença ODbL). Google Maps e Mapbox ficam fora: os termos restringem impressão para venda.
- **Composição de mockup:** o render real é aplicado em perspectiva sobre cenas fixas (Higgsfield ou foto). Nenhuma IA redesenha a arte do cliente.

## Pipeline de dados (Python 3.13)

- **Pronto para o nacional:** `pipeline/scripts/curva_nacional.py`, só biblioteca padrão, lê os 28 zips do TSE sem extrair (~35 s) e só escreve se o total bater com o oficial. Método e conferência em [05_METODO_CURVA_NACIONAL.md](05_METODO_CURVA_NACIONAL.md). DuckDB entra quando o recorte por município pedir.
- **Fontes:** TSE (boletins de urna por seção do 2º turno; locais de votação com latitude e longitude), IBGE (malha municipal), OpenStreetMap.
- **Saídas:** curva por escopo (Brasil, UF, município: percentual apurado × percentual de cada lado), resultado por local de votação com o horário de entrada na contagem (se o campo existir), versão e hash.
- **Verificação obrigatória:** a soma bate com o total oficial de cada escopo; se não bater, não publica.
- Registrado como EXP-316 (H1).

## Pagamento

- Mercado Pago, Checkout Transparente (API): Pix (QR e copia-e-cola) e cartão parcelado.
- O webhook verifica a assinatura, consulta o pagamento na API antes de mudar o estado e usa o id do pagamento como chave de idempotência.
- O crédito do digital no upgrade é um registro em `creditos`, com validade, aplicado pelo núcleo. O texto da tela ("descontamos os R$ 29 que você já pagou") só aparece se o crédito existir.

## Fiscal, frete e produção

- A NF-e é emitida pelo worker depois de "pago", por API; o DANFE segue por e-mail.
- Antes de contratar qualquer fornecedor de produção, saber quem emite a nota da remessa ao consumidor (ver [03_FORNECEDORES.md](03_FORNECEDORES.md)).
- Frete: o fornecedor de impressão cota e envia o que produz; o Melhor Envio cuida do que sai do ateliê.
- Adaptador de produção: `cotar()`, `criarPedido()`, `consultar()`, `cancelar()` e webhook de rastreio.

## Físico-digital (depois; fora do escopo inicial)

- Toda peça física recebe um código curto (`inflexo.com.br/c/7K2Q`) em QR no verso.
- Edições numeradas recebem tag NFC: NTAG213 nas comuns; NTAG 424 DNA na série numerada, que gera uma mensagem autenticada diferente a cada toque e prova que a peça é original.
- Cápsula: página com a curva animada, a legenda e, se o comprador quiser, foto ou áudio (upload com consentimento e moderação).

## Segurança e privacidade

- Turnstile (Cloudflare) e limite de requisições no estúdio: render consome CPU.
- Links de download assinados e com validade.
- LGPD: base legal por finalidade; itens da coleção eleitoral fora de qualquer integração de anúncio; exclusão a pedido; contratos de tratamento de dados com Supabase, Mercado Pago e fornecedores de produção; cláusulas para transferência internacional (servidores fora do Brasil).
- Sentry para erros; PostHog para funil, sem enviar itens da coleção eleitoral a terceiros de anúncio.

## Admin

Pedidos com a linha do tempo de eventos, reprocessar trabalho, reembolsar, reenviar link, fila de moderação, tiragens, catálogo e preços.
