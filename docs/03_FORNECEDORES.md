# Fornecedores e serviços externos

Pesquisa de 31/10/2026. "A confirmar" significa que a informação não foi verificada numa fonte oficial e atual; não use esses valores para fixar preço.

## Recomendações

| Necessidade | Recomendação | Alternativa | Por quê | A confirmar |
|---|---|---|---|---|
| Pagamento | **Mercado Pago**, Checkout Transparente/API: Pix, cartão parcelado, boleto | **Pagar.me** (Stone) | Pix e parcelamento nativos; marca que o comprador brasileiro já conhece; sandbox e webhooks | Taxas de 2026 nas tabelas oficiais (um guia sem data cita Pix a 1,19 % no Pagar.me); prazo de recebimento e custo de antecipação |
| Pagamento internacional (fase 3+) | Stripe | — | Só se vender fora do Brasil. O Pix no Stripe é via EBANX, pensado para venda transfronteiriça | — |
| Parede: pôster, quadro, canvas | **Gelato**: API de catálogo, cotação e pedidos; anuncia produção local no Brasil | Gráfica fine art local em contrato de envio direto com a marca INFLEXO | Produzir no país evita imposto de importação e prazo internacional | Quais SKUs (moldura, principalmente) são feitos no Brasil; prazo; papel; embalagem sem a marca deles; quem emite a nota da remessa |
| Têxtil: ecobag, camiseta | **Dimona**: Brasil e EUA, API com token para pedidos, status e rastreio | Reserva INK | Impressão sob demanda têxtil brasileira com integração | Se há ecobag no catálogo; estampa (bordado não é padrão); custo |
| Ateliê: acrílico com LED, shadow box, tábua a laser, azulejo, shape | Parceiros locais com contrato, por lote ou pré-venda | — | Não existe impressão sob demanda para isso | Amostra, custo por lote, prazo, política de defeito e reposição |
| Nota fiscal | **Focus NFe** ou **NFE.io** (API REST de NF-e) | Bling, se quiser ERP com estoque e financeiro | Emissão automática pelo worker | Preço (a NFE.io mostra plano base de R$ 190/mês com 250 notas, em página sem data); suporte às notas técnicas da reforma tributária (a NFE.io informa mudanças em produção na SEFAZ em 03/11/2026) |
| Frete próprio | **Melhor Envio**: API gratuita, sandbox com saldo fictício, cotação, etiqueta e rastreio por webhook | Frenet | Para o que sai do ateliê ou do estoque | Coleta e seguro para quadro com vidro |
| Mapas | **OpenStreetMap** via Protomaps (PMTiles no R2) + MapLibre GL JS na prévia | — | Licença aberta (ODbL) permite peça impressa com atribuição; sem custo por mapa | Estilo próprio; atribuição na peça |
| Dados | **TSE**, Portal de Dados Abertos (boletins por seção, locais de votação com coordenadas); **IBGE** (malhas) | — | A fonte é o produto | Campo de horário de recebimento do boletim em 2026 (EXP-316) |
| NFC (**depois**, fora do escopo inicial) | NTAG213 nas peças comuns; NTAG 424 DNA na série numerada; gravador USB | QR impresso no verso | A 424 DNA autentica cada toque | Fornecedor no Brasil; adesivo antimetal se houver moldura metálica |
| Imagem de vitrine | **Higgsfield** (MCP já conectado, como no Memorável) para cenas; arte real composta por cima | Ensaio fotográfico das amostras | — | — |
| IA de texto | Claude via API ou OpenRouter, como no Memorável | — | Legendas e moderação | Regras de neutralidade no prompt |
| E-mail transacional | **Resend** | Cloudflare Email Service | Templates em React | Domínio com SPF, DKIM e DMARC |
| Infraestrutura | **Render** (web + worker), **Supabase** (Postgres, Auth), **Cloudflare** (DNS, CDN, R2, Turnstile) | Fly.io (região São Paulo) | Mesma operação do Memorável | App e banco na mesma região |
| Erros e funil | Sentry; PostHog | Plausible | — | Banner de consentimento |
| Atendimento | WhatsApp via Chatwoot (já montado no `skyvidya_gdr_agent`) | — | Fase 2 | — |
| Contábil e jurídico | Contador (CNAE, regime, nota fiscal) e advogado (termos, privacidade, marca no INPI) | — | — | — |

## Fora da lista, e por quê

- **Printful, Printify, Prodigi e fine art europeia (Posterflow, theprintspace):** produzem fora do Brasil. O comprador paga imposto de importação e espera semanas.
- **Stripe como gateway principal:** Pix só transfronteiriço e parcelamento limitado no Brasil.
- **Google Maps e Mapbox:** termos restritivos para impressão comercial.
- **Cerveja comemorativa:** licença de bebida alcoólica, rótulo registrado e verificação de idade.

## Perguntas obrigatórias aos fornecedores de produção

1. Este SKU é produzido no Brasil? De onde sai o envio?
2. Prazo de produção e de transporte por região.
3. **Nota fiscal:** quem emite para o consumidor final e como a mercadoria circula (remessa por conta e ordem?). Sem resposta clara, não assinar.
4. Embalagem neutra ou com a marca INFLEXO; dá para incluir um cartão?
5. Especificação de arquivo: PDF ou PNG, DPI, sangria, perfil de cor. Aceita PDF vetorial?
6. API: sandbox, pedido em rascunho, webhooks de status e rastreio, até quando dá para cancelar.
7. Reposição em caso de defeito ou avaria (quadro com vidro) e quem paga.
8. Amostra física de cada SKU antes de vender.

## Fontes

- Gelato, produção no Brasil: https://www.gelato.com/print-on-demand/brazil
- Gelato, Order Flow (API de pedidos e catálogo): https://www.gelato.com/order-flow
- Dimona via Order Desk: https://help.orderdesk.com/article/908-dimona-integration
- Mercado Pago, Checkout API com Pix: https://www.mercadopago.com.br/developers/en/docs/checkout-api-v2/payment-integration/pix
- Comparativo de gateways (iDinheiro, sem data): https://www.idinheiro.com.br/negocios/melhores-gateways-de-pagamento/
- Stripe + EBANX para Pix: https://business.ebanx.com/en/press-room/press-releases/stripe-users-can-now-accept-pix-in-brazil-via-ebanx
- Stripe, como habilitar Pix: https://support.stripe.com/questions/how-to-enable-pix-as-a-payment-method-in-brazil
- NFE.io, preços: https://nfe.io/precos/emissao-nfe
- NFE.io, notas técnicas de 2026: https://nfe.io/docs/legislacao/nts-2026-nfe-nfce/
- Focus NFe, API: https://focusnfe.com.br/?p=2393
- Melhor Envio, API: https://docs.melhorenvio.com.br/reference/introducao-api-melhor-envio.md
- Meta, anúncios sobre temas sociais, eleições ou política: https://transparency.meta.com/pt-br/policies/ad-standards/SIEP-advertising/SIEP/
- Meta, eleições de 2026 no Brasil: https://about.fb.com/br/news/2026/10/como-a-meta-esta-cumprindo-a-determinacao-do-tse-sobre-anuncios-eleitorais-no-brasil/
- TSE, boletins de urna e dados abertos: https://www.tse.jus.br/comunicacao/noticias/2026/Setembro/faltam-7-dias-veja-qual-e-o-caminho-do-voto-depois-de-encerrada-a-votacao
