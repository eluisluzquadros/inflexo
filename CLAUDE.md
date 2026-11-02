# INFLEXO: instruções do projeto

Idioma: pt-BR em interface, textos e documentos (vocabulário brasileiro; ver PRODUCT.md, seção Voz).

## Leia antes de mudar algo

- `PRODUCT.md`: marca, voz e verdade do produto. As regras valem para código e texto.
- `docs/01_ANALISE_CRITICA_PROMPT_GEMINI.md`: o que foi aproveitado e descartado da proposta original.
- `docs/02_ARQUITETURA.md`: stack, modelo de dados, máquina de estados, motor de render.
- `docs/03_FORNECEDORES.md`: fornecedores e o que ainda falta confirmar.
- `docs/04_ROADMAP.md`: fases e critérios de saída.

## Regras que não se negociam

1. Pedido muda de estado só por webhook verificado + consulta ao provedor; tudo idempotente.
2. Arquivo final só é gerado e liberado depois do pagamento confirmado; prévia no navegador tem marca d'água.
3. Um único motor de render (`packages/render`); prévia e impressão usam a mesma função.
4. Nenhum dado simulado apresentado como real. O pipeline só publica se bater com o total oficial.
5. Itens da coleção eleitoral nunca vão para Pixel, API de Conversões ou públicos de anúncio (dado sensível, LGPD).
6. Fornecedores atrás de adaptadores. Chaves só em variáveis de ambiente; `.env` nunca no Git; `.env.example` documentado.
7. Texto livre que vai para impressão passa por moderação.

## Benchmark de método

`C:\Users\eluzq\workspace\skyvidya_bbmd_advogados\platform` (Memorável): PRODUCT.md e DESIGN.md no fluxo impeccable, `render.yaml` com `sync:false`, scripts Playwright de jornada. É referência de método, não de código.

## Experimentos

EXP-316 no ledger compartilhado (`C:\Users\eluzq\workspace\skyvidya-home\.claude\storage\EXPERIMENT_LEDGER.md`). Atualizar status e resultado ao concluir; novos experimentos seguem a numeração contínua.

## Runtime

- App: Node 22+ e pnpm.
- Pipeline: Python 3.13 (`py`).

## Escopo atual

Três coleções (PRODUCT.md, decisão de 01/11/2026): A Geografia da Virada (Brasil, Nordeste e as nove capitais do Nordeste, cada total conferido com o TSE), Momentos (versão simples, curva decorativa declarada, texto do cliente moderado) e Frases épicas (só texto e crédito da obra; risco de direito autoral assumido pelo dono). Sem NFC até decisão do dono.

## Publicação

- Produção: https://inflexo.com.br (Render, blueprint `render.yaml`, deploy a partir de `main`; plano free, que dorme sem visita).
- Código: https://github.com/eluisluzquadros/inflexo (privado). Segredos só no painel do Render (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) e no `.env` local.
- DNS: zona na Cloudflare (conta inflexobr@gmail.com), CNAME `@` e `www` → `inflexo.onrender.com`, DNS only. Domínio registrado na Hostinger; os registros antigos da Hostinger (A `@` 216.24.57.1, CNAME `www`) ficam como reserva para caches antigos e podem ser apagados depois de alguns dias.
- Banco: Supabase, tabela `public.inflexo_fila` (RLS ligada, sem política: só o servidor acessa).

## Comandos

- `npm run dados:nacional`: lê os boletins do TSE em `pipeline/data/raw/` (fora do Git), confere com o oficial e escreve `pipeline/output/`.
- `npm run render:nacional`: gera os SVGs e as prévias em `out/nacional/`.
- `npm run build:prova`: monta `brand/prova-de-marca.html` a partir do `.src.html` com as peças reais. Editar sempre o `.src.html`.
- `npm run dados:regiao` / `npm run render:regiao`: soma os boletins por UF da região, confere cada UF com o oficial e gera o pôster regional em `out/regiao/`.
- Capitais: `py -I pipeline/scripts/baixar_ruas.py pipeline/data/raw/osm` (OSM, sem e-mail no User-Agent) → `py -I pipeline/scripts/mapa_cidade.py pipeline/data/raw/osm pipeline/output/capitais_nordeste_2t_2026.json pipeline/output/cidades` → `node packages/render/scripts/render-cidades.mjs pipeline/output/cidades out/cidades`.
- `node packages/render/scripts/previas-geografia.mjs <caminho do playwright> apps/web/public/loja`: prévias JPG (900 px, com marca d'água) da região e das capitais para a vitrine `/loja`.
- Mockups: `py -I pipeline/scripts/compor_mockup.py <cena> <arte> <saida> x0 y0 x1 y1` aplica a arte real sobre a área do papel da cena gerada por IA.
- `npm test`: testes do motor de render e do catálogo (`packages/core`).
- `npm run web:dev` / `npm run web:build`: loja em Next.js (`apps/web`). A fila de espera grava no Supabase (`public.inflexo_fila`, RLS ligada, só o servidor acessa) quando `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` existem; sem elas, em `.runtime/lista.jsonl`. O `.env` fica na raiz (fora do Git; modelo em `.env.example`). Migrações em `supabase/migrations/`.
- Nada de bebida alcoólica em produto, cena ou mockup.

Python sempre com `py -I` (dados baixados são tratados como não confiáveis).
