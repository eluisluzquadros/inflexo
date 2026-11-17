# Impressão sob demanda no Brasil: comparação (EXP-318)

Revisão de 03/11/2026, contra fonte primária (site, catálogo, central de ajuda, termos, página de app ou
documentação oficial do próprio fornecedor). Substitui a versão de 02/11, que tinha erros (lista no fim).
"Não verificado" quer dizer que a fonte primária não respondeu ou não trata do ponto; nunca é estimativa.

**Limite do método.** O Reclame Aqui bloqueia acesso automatizado (HTTP 403); a reputação vem de trechos de
busca restrita ao site, com datas incertas. Conferir ao vivo antes de contratar. Sites de Dimona e Dropsimples
respondem 429 (bloqueio antirrobô) e não foram contornados.

## Critérios (com o desvio de 03/11)

- **Eliminatórios** (por categoria): produz no Brasil; o INFLEXO é o vendedor (marca neutra, não marketplace);
  cobre a categoria.
- **Automação deixou de ser eliminatória** (decisão do dono, 03/11): o INFLEXO pode construir um intermediário
  com agentes que fazem o pedido no painel ou por e-mail. Vira peso: API oficial > app de loja > agente.
- **Pesos:** Reclame Aqui 25 %; qualidade e catálogo 20 %; custo A3/A2 com frete 20 %; automação 15 %;
  prazo até Porto Alegre e Nordeste 10 %; nota fiscal e embalagem neutra 10 %.

## Decoração (quadro e pôster), prioridade 1

### Finalistas

| | **3Print** | **Printile** | **YouDraw** | WePrint! | DropDecor | Quadrorama |
|---|---|---|---|---|---|---|
| Quem produz | Fábrica própria: SP (7.000 m², desde 1987) e S. J. do Rio Preto (1.500 m², desde 2018); fornece Leroy Merlin, Tok&Stok, Mobly, Westwing, Hilton, Accor | Barueri-SP (CNPJ 11.387.071/0001-05) | Parceiros em SP (YD Inc, CNPJ 52.316.786/0001-54) | Laboratório em Itu-SP (Leyda Photo) | Não publicado | SP; fábrica não informada |
| INFLEXO vendedor, marca neutra | Sim: "a marca 3Print não aparece no quadro nem na embalagem" | Sim: "white label", "embalagem neutra" | Marca do lojista; embalagem neutra não verificada | Não verificado (sem página para lojista) | Sim, "sem menção à DropDecor" | Sim, com a logo do lojista |
| Quadro | Moldura caixa 2 × 2 cm (preta, branca, natural, tabaco, freijó) ou filete; com ou sem vidro; canvas com ou sem moldura; duo e trio | Moldura caixa ou tradicional (pinus/eucalipto com filme PET), acrílico cristal 2 mm | Caixa, Filete, Tradicional; 5 tamanhos, 4 cores, com ou sem vidro (medidas e materiais não publicados) | Moldura de madeira 2 × 3 cm, vidro comum, antirreflexo ou museológico, passe-partout | Tradicional ou filete | Moldura de madeira |
| Papel | Fotográfico vinílico 255 g; canvas 340 g algodão; couché (só impressão) | Fosco 230 g, tinta mineral com UV | Não publicado | Canson Infinity (algodão) | Não publicado | Não publicado |
| A3 e A2 | Sob medida: "qualquer medida é aceita", preço pela área | **Sim, tamanhos-padrão** | Não publicado | Sim | Não publicado | Não publicado |
| Custo | Tabela pública (plano Básico): 40×60 caixa com vidro R$ 149, sem vidro R$ 126, só impressão R$ 65; 50×70 com vidro R$ 225. Plano Escala: −17 % | **Pôster A3 R$ 16, A2 R$ 50; quadro caixa com acrílico A3 R$ 73, A2 R$ 155** | "A partir de" R$ 28,60 (pôster) e R$ 45,05 (quadro), sem divisão por tamanho | Sob orçamento | Só no painel | Sob proposta |
| Prazo | Produção 3 a 5 dias úteis; entrega 3 a 12 dias úteis após postagem | Até 4 dias úteis + 1 para postar | Produção 2 a 5 dias úteis | Até 10 dias úteis com moldura | 2 a 4 dias úteis | "Postados em 24 horas" |
| Automação | **API pública v2 para loja própria**: chave da loja, pedido idempotente (`external_order_id`), simulação `/orders/preview`, cotação de frete, avisos de status com HMAC, rastreio, dados da NF-e. Também Nuvemshop, Shopify, Bling, marketplaces | App Nuvemshop (plano Plus R$ 59,90/mês) ou pedido manual | API comercial em beta, só por convite | Nenhuma | App Shopify; carteira pré-paga | Nenhuma |
| Nota fiscal | 3Print emite a de remessa; a de venda é do lojista | Não verificado | Não verificado | Não verificado | Não verificado | Não verificado |
| Avaria | Reenvio sem custo (quadro e frete); garantia de 90 dias | Não verificado | Não verificado | Não verificado | Não verificado | Não verificado |
| Mensalidade | R$ 99 (Básico), R$ 299 (Escala, −17 % no custo e integrações), R$ 990 (Turbo) | Plano Plus R$ 59,90 para a Nuvemshop | R$ 0 a 399 | — | R$ 49,90 a 99,90 | — |
| Reclame Aqui | Não encontrada | Sem reputação (< 10 avaliações; 1 queixa de defeito) | Sem reputação (3 queixas de lojistas: suporte, cobrança, preço) | 2 reclamações, nota 8,6 | Não encontrada | Sem reclamações |

### Leitura

1. **3Print** é a mais forte em decoração: a própria fábrica, que atende o grande varejo; a única com API
   pública para loja própria que já faz tudo que o adaptador precisa (cotar, criar pedido idempotente,
   simular, receber status e rastreio assinados); marca neutra e reenvio garantido por escrito. Pontos em
   aberto: qual plano libera a chave da API, preço exato de A3 e A2 sob medida (a tabela usa o R$/m² do tamanho
   menor; a página de produtos fala em +20 %), e reputação (não há registro no Reclame Aqui).
2. **Printile** tem o menor custo nos tamanhos exatos do INFLEXO (A3 e A2) e acrílico em vez de vidro (mais
   seguro no transporte), mas só automatiza pela Nuvemshop (loja-ponte) ou por agente no painel. Papel fosco
   230 g, sem algodão.
3. **YouDraw**: API em beta por convite; materiais e medidas não publicados.
4. **WePrint!**: linha premium (papel de algodão, vidro museológico, passe-partout), sem automação nem
   atendimento a lojista confirmado.
5. DropDecor e Quadrorama: pouca informação publicada.

**Montink** (ver abaixo) vende o mesmo quadro da 3Print com uma camada a mais; para o INFLEXO, ir direto à
3Print é mais barato e tem API.

**Custo estimado de um quadro** (estimativa, não cotação: área × R$/m² da tabela pública; frete a cotar):

| | 3Print Básico | 3Print Escala | Printile |
|---|---|---|---|
| A2 (42 × 59,4) com vidro ou acrílico | ~R$ 155 | ~R$ 129 | R$ 155 |
| A3 (29,7 × 42) com vidro ou acrílico | ~R$ 77 | ~R$ 64 | R$ 73 |

Com os preços provisórios de `apps/web/lib/precos.ts` (quadro A3 R$ 289, A2 R$ 449) a margem passa de 35 %
mesmo com frete de R$ 30 a 60 e a taxa da Stripe. A hipótese H2 do EXP-316 (quadro a ≤ R$ 249 com frete)
depende da cotação real de frete.

### A confirmar

- **Montink.** Corrigido: **vende quadro com moldura** (app na Nuvemshop: "pôsteres, quadros"; produto em
  papel fotográfico vinílico 255 g ou canvas 340 g, moldura caixa ou filete em branca, natural, preta, tabaco
  ou freijó, com ou sem vidro). Tamanhos 20×30, 40×60, 60×90 e 80×120 (sem A3 e A2). Embalagem neutra, envio de
  Duque de Caxias-RJ, produção em média 4 dias úteis; integra com Nuvemshop, Shopify, Yampi, iSet e Bling; sem
  API pública; custo do quadro não publicado. O painel mostra três fornecedores: Dimona, Casa da Gráfica e
  "Três Print". Os materiais e cores do quadro são os mesmos da 3Print, o que indica que o quadro da Montink é
  da 3Print (confirmar com ela). Reclame Aqui "Ótima" (nota 7,9 a 8,6).
- **Dimona.** Se faz quadro ou pôster para lojista: inconclusivo (site com bloqueio antirrobô). Pôster da
  Montink, que roda na Dimona, vai de A0 a A5.

### Eliminados

| Fornecedor | Motivo (verificado) |
|---|---|
| Gelato | Pôster, quadro e tela produzidos nos EUA ou na Alemanha (cotação real pela API, EXP-316) |
| Printful | Pela API do catálogo, nenhum pôster, pôster emoldurado ou canvas tem produção no Brasil (caneca e camisetas têm) |
| Printify | Nenhum fornecedor no Brasil na lista pública de 68 |
| Colab55 | Marketplace: o artista é o vendedor dentro da Colab55; não há envio para loja externa |
| Uma Penca | Sem quadro (só camiseta, caneca, ecobag, moletom, planner, polo) |
| Reserva INK | Só vestuário |
| Printi | Quadro só em A4, A3 e 30×30 (A2 descontinuado); a página de revenda é desconto para agências, sem envio neutro encontrado |
| Mioquadros | Só canvas; a parceria é de afiliados (20 % de comissão), não revenda |
| Fotoregistro | Só consumidor final; empresas vão para a Digipix (mesmo CNPJ), sem envio neutro encontrado |
| Urban Arts | Licenciamento com a marca Urban Arts, não white-label |

## Acessórios (caneca, bolsa) e roupas

| | Dimona | Montink | YouDraw | Reserva INK | Uma Penca |
|---|---|---|---|---|---|
| Caneca / ecobag / camiseta | Sim / sim / sim | Sim / sim / sim (pela Dimona) | Não / sim / 20 modelos | Não / não / sim | Sim / sim / sim |
| Automação | API pública (criar pedido, frete, webhook, rastreio, NF-e e etiqueta do lojista) | Apps de loja e Bling; sem API | API em beta | API só lê pedidos | Nenhuma |
| Reclame Aqui | "Boa", 7,4 a 7,5; 50 % voltariam | "Ótima", 7,9 a 8,6 | Sem reputação | "Regular", 6,2 | "Ótima", 8,5 |
| Custo indicativo | Caneca R$ 29,90; ecobag R$ 20,90 | Caneca R$ 30,60; ecobag R$ 24,99 (catálogo) | Camiseta a partir de R$ 30 | Camiseta R$ 49,90 a 64,90 | Não publicado |

Dimona segue à frente por ter API pública completa.

**Decisão do dono (17/11/2026): roupas pela Reserva INK**, apesar da reputação "Regular". Conta habilitada
(pessoa física, com sugestão de migrar para CNPJ) e chave da API no `.env` (`RESERVA_INK_API_KEY`).
Verificado com a chave, só leitura:

- A API pública responde (o plano inclui o recurso). A loja ainda não tem produtos; a leitura de pedidos
  externos (`GET /v1/stores/external_orders`) funciona e está vazia.
- **Criar pedido externo não está na documentação pública.** Ela descreve a "loja de integração", que recebe
  vendas de fora "empurradas via API" (já pagas, com avisos `external_order.created`, `.sent`,
  `.delivery_in_progress` e outros), mas não o endpoint de criação. Pedido à Reserva INK: mensagem 7 de
  `10_MENSAGENS_FORNECEDORES.md`.
- Área de impressão (de `GET /v1/stores/product_types`): **4200 × 4800 px** em Camiseta (9 cores, PP a 4G),
  Camiseta Algodão Peruano (4 cores), Camiseta Oversized (preta, off-white, areia) e Camiseta Infantil.
- Frete (`GET /v1/stores/shipping_simulation?cep=90450-090`): J&T R$ 11,11 ou Total Express R$ 12,49,
  7 dias úteis, para camiseta de referência (300 g).

## O que estava errado na versão de 02/11

| Afirmação anterior | Correção |
|---|---|
| Montink não faz quadro | Faz (moldura caixa ou filete, com ou sem vidro), sem A3 e A2 |
| Montink produz tudo na Dimona | Tem pelo menos três fornecedores no painel; o quadro indica 3Print |
| Printile: R$ 89 e R$ 129 de custo | Eram preços de uma loja de exemplo; custo real A3/A2 na tabela acima |
| Colab55: a Colab55 é a vendedora; pôster "em recesso" | O artista é o vendedor; o aviso de recesso é um modelo escondido na página |
| Printi: sem programa de revenda | Tem página de revenda (desconto para agências), mas sem envio neutro |
| Mioquadros: mínimo de R$ 4.000 | Não encontrado; a parceria é de afiliados |
| Nenhum fornecedor de quadro tem API para loja própria | A 3Print tem API pública v2 |
| 3Print ausente | Fabricante e provável fornecedor do quadro da Montink |

## Próximo passo

Perguntas e amostra a 3Print (prioridade), Printile, YouDraw e Dimona (`10_MENSAGENS_FORNECEDORES.md`).
Nenhum fornecedor é escolhido sem resposta escrita e amostra física aprovada.

## Fontes

- 3Print: https://www.3print.com.br/ · /ajuda · /termos-de-uso · /products (tabela via `/proxy/public/production-costs/table`) · /planos · /producao-e-entrega · /integracoes · /clientes · https://www.3print.com.br/artigos/api-integracao-plataforma-propria · /artigos/nota-fiscal-dropshipping · /artigos/manual-integracao-bling
- Printile: https://printile.com.br/ (FAQ "Ver todas as 19 dúvidas") · https://www.reclameaqui.com.br/empresa/printile/
- YouDraw: https://youdraw.com.br/catalogo · /quanto-custa · /termos-de-producao · https://docs.youdraw.com.br · https://www.reclameaqui.com.br/empresa/yd-inc-comercio-e-servicos-ltda/
- Montink: https://www.nuvemshop.com.br/loja-aplicativos-nuvem/montink · https://montink.com/conexaodna/quadro-ideograma-japones-kanji-paz-8m43m · https://sou.montink.com/sobre-a-montink · https://sou.montink.com/casa-da-grafica · https://www.reclameaqui.com.br/empresa/montink_190944/ · vídeo https://www.youtube.com/watch?v=fqTXnqUFOqI (painel com fornecedores Dimona, Casa da Gráfica e Três Print)
- WePrint!: https://weprint.com.br/pages/servicos
- DropDecor: https://dropdecor.com.br/ · /duvidas-frequentes/ · /integracoes/ · /planos/
- Quadrorama: https://www.quadrorama.com.br/revenda/
- Dimona: https://api.camisadimona.com.br/ · https://www.reclameaqui.com.br/empresa/dimona/
- Colab55: https://colab55.zendesk.com (artigos 360059242471 e 201666099) · https://www.colab55.com/tos
- Printful: https://api.printful.com/products · https://www.printful.com/print-on-demand-brazil
- Printify: https://printify.com/app/print-providers
- Uma Penca: https://umapenca.com/produtos-personalizados
- Reserva INK: https://reserva.ink/site/produtos-fisicos · https://developers.reserva.ink/
- Printi: https://www.printi.com.br/quadro-decorativo/ · https://www.printi.com.br/grafica-revendedor/
- Mioquadros: https://mioquadros.com/perguntas-frequentes/
- Fotoregistro: https://www.fotoregistro.com.br/ (central de ajuda, "Como cadastrar meu CNPJ")
- Urban Arts: https://www.urbanarts.com.br/seja-um-revendedor-urban-arts · /licenciado
