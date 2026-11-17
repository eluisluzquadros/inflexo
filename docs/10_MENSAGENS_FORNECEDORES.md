# Mensagens de cotação aos fornecedores (EXP-318)

Prontas para enviar. Base: perguntas obrigatórias de `03_FORNECEDORES.md` e lacunas de
`09_FORNECEDORES_POD.md`. Responder pelo e-mail `pedidos@inflexo.com.br` (encaminhado ao Gmail).
Antes de enviar, conferir o canal de contato no site de cada um.

Registrar cada resposta em `09_FORNECEDORES_POD.md` (com data) e no EXP-318. Nenhum fornecedor é escolhido
sem resposta escrita e amostra física aprovada.

Ordem de envio: 1 (3Print) primeiro; depois 3 (Printile) e 6 (Dimona).

---

## 1. 3Print (prioridade)

**Para:** WhatsApp (11) 97139-9163 (indicado no site para comercial e suporte da integração) ou
https://www.3print.com.br/contato
**Assunto:** INFLEXO: chave da API para loja própria, A3 e A2 sob medida

**Versão curta (WhatsApp)**

Olá! Sou Everton Quadros, da INFLEXO (inflexo.com.br), arte de dados vendida em loja própria (Next.js com
checkout próprio). Lemos a documentação da API de parceiros v2 e queremos integrar com a chave da loja.
Algumas perguntas antes de assinar:
1. Qual plano libera a chave da API (`ptk_`) e o cadastro da URL de callback?
2. Nossas peças são A3 (29,7 × 42) e A2 (42 × 59,4). Como fica o custo sob medida: R$/m² do tamanho menor da
   tabela ou +20 %? Podem simular A3 e A2 com moldura caixa preta, com e sem vidro?
3. Vocês são a "Três Print" que aparece entre os fornecedores da Montink?
4. Podemos comprar uma amostra de cada antes de abrir a venda?
Obrigado!

**Versão completa (e-mail ou formulário)**

Olá, equipe 3Print.

Sou Everton Quadros, da INFLEXO (inflexo.com.br), uma marca de arte de dados: peças feitas a partir de dados
públicos, como a curva da apuração eleitoral reconstruída dos boletins de urna do TSE. Vendemos pela nossa
loja, com checkout próprio, e cada pedido pago deve seguir para a produção sem intervenção manual.

Lemos o artigo "API de integração para parceiros" e o nosso caso é o da chave da loja, com
`auto_approve: true` e a arte em alta (PNG) em cada item. Antes de assinar:

1. Qual plano libera a chave da API e o cadastro da URL de callback? A tabela de custo da API segue o
   desconto do plano (−17 % no Escala)?
2. Medidas sob medida: A3 (29,7 × 42 cm) e A2 (42 × 59,4 cm). O custo é pela área com o R$/m² do tamanho de
   tabela imediatamente menor (como diz o artigo) ou com +20 % (como diz a página de produtos)?
3. Especificação de arquivo: formato aceito (PNG?), resolução mínima, perfil de cor e sangria para moldura
   caixa e filete. Nossas artes têm linhas finas; geramos PNG a 300 dpi em sRGB.
4. Papel: o fotográfico vinílico 255 g é fosco ou brilhante? Há opção de papel fine art (algodão)?
   Há passe-partout?
5. Com vidro: o vidro é comum ou antirreflexo? Como é a proteção no transporte para quadro com vidro?
6. Frete: valores típicos para Porto Alegre (90450-090), Recife (50060-004) e São Paulo (01310-100), A3 e A2.
7. Nota fiscal: entendemos que vocês emitem a de remessa e nós a de venda. A nota de remessa sai em nome de
   quem e com qual valor? Integração com o nosso emissor (fora do Bling) é possível pelos dados de
   `GET /orders/{id}/invoice`?
8. Pagamento à 3Print pelos pedidos da API: cartão, boleto, Pix ou fatura? Em que momento é cobrado?
9. Vocês aparecem como "Três Print" entre os fornecedores da Montink?
10. Podemos comprar uma amostra de cada tamanho e acabamento antes de abrir a venda?

Obrigado,
Everton Quadros
INFLEXO · pedidos@inflexo.com.br

---

## 2. YouDraw

**Para:** contato@youdraw.com.br (endereço do rodapé do site)
**Assunto:** INFLEXO: acesso à API comercial e cotação de quadros e pôsteres

Olá, equipe YouDraw.

Sou Everton Quadros, da INFLEXO (inflexo.com.br), uma marca de arte de dados: peças feitas a partir de dados
públicos, como a curva da apuração eleitoral reconstruída dos boletins de urna do TSE. Vendemos pelo nosso
próprio site, com checkout próprio, e queremos que cada pedido pago siga para a produção sem intervenção manual.

Lemos a documentação da API comercial (docs.youdraw.com.br) e ela cobre o que precisamos: pedido idempotente,
prévia, cotação de frete e webhooks de status e rastreio. Gostaríamos de:

1. Receber o convite para a API comercial em beta e, se possível, acesso ao sandbox.
2. Saber se o pagamento dos pedidos via API é só por Pix por pedido ou se há saldo pré-pago ou fatura.

E, para quadros e pôsteres:

3. Medidas exatas dos 5 tamanhos de quadro e de pôster. Há A3 (29,7 × 42 cm) e A2 (42 × 59,4 cm)?
4. Quadros Caixa, Filete e Tradicional: material da moldura, cores, proteção (vidro ou acrílico) e se há
   passe-partout.
5. Papel do pôster e do quadro (tipo, gramatura, fosco ou brilho) e tecnologia de impressão.
6. Custo de produção de quadro e pôster em A3 e A2 e frete para três CEPs: Porto Alegre (90450-090),
   Recife (50060-004) e São Paulo (01310-100).
7. Onde ficam a produção e a expedição, e o prazo de produção e de entrega por região.
8. Nota fiscal: quem emite para o consumidor final e por qual valor (custo ou venda)?
9. Embalagem: sai sem marca YouDraw? Dá para incluir um cartão nosso?
10. Especificação de arquivo: formato, resolução mínima, perfil de cor e sangria. Nossas artes têm linhas
    finas; mandamos PNG a 300 dpi em sRGB.
11. Política para defeito ou avaria no transporte (principalmente quadro): reposição e quem paga.
12. Podemos comprar uma amostra de cada tamanho e modelo antes de abrir a venda?

O volume inicial ainda está em formação (lançamento com lista de espera), então não temos pedido mínimo a
oferecer, mas a operação é recorrente.

Obrigado,
Everton Quadros
INFLEXO · pedidos@inflexo.com.br

---

## 3. Printile

**Para:** contato indicado em printile.com.br
**Assunto:** INFLEXO: revenda white-label de quadros e pôsteres fine art

Olá, equipe Printile.

Sou Everton Quadros, da INFLEXO (inflexo.com.br), uma marca de arte de dados: peças feitas a partir de dados
públicos, como a curva da apuração eleitoral reconstruída dos boletins de urna do TSE. Vendemos pelo nosso
próprio site e procuramos um parceiro de produção fine art com envio direto ao cliente e embalagem neutra.

Sobre integração:

1. Vocês têm API ou webhook para receber pedidos de uma loja própria, fora da Nuvemshop?
2. Se a integração for só pela Nuvemshop: o app processa pedidos criados pela API da Nuvemshop (não pelo
   carrinho), já marcados como pagos? O rastreio volta para o pedido da Nuvemshop?

Sobre produto e operação:

3. Quadros e pôsteres em A3 (29,7 × 42 cm) e A2 (42 × 59,4 cm): papéis disponíveis (tipo, gramatura),
   moldura (material, cores), proteção (vidro ou acrílico) e passe-partout.
4. Custo de produção em A3 e A2 e frete para Porto Alegre (90450-090), Recife (50060-004) e São Paulo
   (01310-100). Os valores de 30 × 40 (R$ 89) e 40 × 50 (R$ 129) do site são custo para o lojista ou preço
   ao consumidor?
5. Onde fica a fábrica e qual o prazo de produção e de entrega por região?
6. Nota fiscal: quem emite para o consumidor final e por qual valor?
7. A embalagem é neutra? Dá para incluir um cartão nosso?
8. Especificação de arquivo (formato, resolução, perfil de cor, sangria). Mandamos PNG a 300 dpi em sRGB.
9. Política para defeito ou avaria no transporte.
10. Podemos comprar uma amostra em A3 e A2 antes de abrir a venda?

Obrigado,
Everton Quadros
INFLEXO · pedidos@inflexo.com.br

---

## 4. WePrint! Fine Art

**Para:** contato indicado em weprint.com.br
**Assunto:** INFLEXO: impressão fine art com moldura e envio direto ao cliente

Olá, equipe WePrint!.

Sou Everton Quadros, da INFLEXO (inflexo.com.br), uma marca de arte de dados: peças feitas a partir de dados
públicos, como a curva da apuração eleitoral reconstruída dos boletins de urna do TSE. Procuramos um
laboratório fine art para uma linha premium, vendida pelo nosso próprio site.

1. Vocês produzem unidade a unidade e enviam direto ao nosso cliente, sem a marca WePrint! na embalagem?
2. Aceitam pedidos por e-mail ou por algum sistema automatizado (API, planilha, painel)? Como informam o
   código de rastreio?
3. Custo de impressão em papel 100 % algodão, fosco, em A3 (29,7 × 42 cm) e A2 (42 × 59,4 cm), com e sem
   moldura de madeira, com vidro antirreflexo e com passe-partout.
4. Frete e prazo para Porto Alegre (90450-090), Recife (50060-004) e São Paulo (01310-100).
5. Nota fiscal: quem emite para o consumidor final e por qual valor?
6. Especificação de arquivo (formato, resolução, perfil de cor). Mandamos PNG a 300 dpi em sRGB.
7. Política para defeito ou avaria no transporte.
8. Podemos comprar uma amostra antes de abrir a venda?

Obrigado,
Everton Quadros
INFLEXO · pedidos@inflexo.com.br

---

## 5. Montink

**Para:** contato indicado em montink.com (central de ajuda ou comercial)
**Assunto:** INFLEXO: quadros com moldura e integração com loja própria

Olá, equipe Montink.

Sou Everton Quadros, da INFLEXO (inflexo.com.br), uma marca de arte de dados: peças feitas a partir de dados
públicos, como a curva da apuração eleitoral reconstruída dos boletins de urna do TSE. Vendemos pelo nosso
próprio site e procuramos produção sob demanda de quadros e pôsteres com envio direto ao cliente.

Vimos o vídeo "Transforme Suas Estampas em QUADROS para Vender na Montink", mas no catálogo público só
encontramos o Pôster (papel fotográfico ou canvas, de A0 a A5).

1. Vocês produzem quadro com moldura? Se sim: material e cores da moldura, proteção (vidro ou acrílico),
   passe-partout e tamanhos (procuramos A3, 29,7 × 42 cm, e A2, 42 × 59,4 cm).
2. O "canvas com margem 4 cm" sai esticado em chassi, pronto para pendurar?
3. Custo de produção do quadro e do pôster em A3 e A2 e frete para Porto Alegre (90450-090),
   Recife (50060-004) e São Paulo (01310-100).
4. Integração: há API para criar pedidos a partir de uma loja própria? Se for só pelo app da Nuvemshop,
   ele processa pedidos criados pela API da Nuvemshop, já pagos? O rastreio volta para o pedido?
5. Como o pedido é pago (carteira, Pix, cobrança automática)?
6. Onde fica a produção e qual o prazo por região?
7. Nota fiscal: vocês emitem para o consumidor final e por qual valor?
8. Embalagem neutra? Dá para incluir um cartão nosso?
9. Especificação de arquivo. Mandamos PNG a 300 dpi em sRGB.
10. Política para defeito ou avaria no transporte.
11. Podemos comprar uma amostra antes de abrir a venda?

Obrigado,
Everton Quadros
INFLEXO · pedidos@inflexo.com.br

---

## 6. Dimona (decoração, acessórios e roupas)

**Para:** api@dimona.com.br (endereço da documentação da API) ou o comercial indicado em dimona.com.br
**Assunto:** INFLEXO: integração por API para quadros, pôsteres, canecas, ecobags e camisetas

Olá, equipe Dimona.

Sou Everton Quadros, da INFLEXO (inflexo.com.br), uma marca de arte de dados: peças feitas a partir de dados
públicos, como a curva da apuração eleitoral reconstruída dos boletins de urna do TSE. Vendemos pelo nosso
próprio site e queremos integrar pela API pública de vocês (api.camisadimona.com.br): criação de pedido,
cotação de frete, webhook de status e rastreio.

Nosso produto principal é decoração. Sabemos que a Montink produz na infraestrutura de vocês e divulga
quadros e pôsteres.

1. Quadros e pôsteres estão disponíveis pela API da Dimona, para loja própria? Quais SKUs?
2. Quadro: tem moldura (material, cores), proteção (vidro ou acrílico) e passe-partout? Tamanhos A3
   (29,7 × 42 cm) e A2 (42 × 59,4 cm)? O canvas sai esticado em chassi?
3. Pôster: papéis (tipo, gramatura, fosco) em A3 e A2.
4. Custo de quadro e pôster em A3 e A2, caneca branca de 11 oz, ecobag e camiseta branca de algodão
   (P a GG), e frete para Porto Alegre (90450-090), Recife (50060-004) e São Paulo (01310-100).
5. Como abrimos conta e recebemos a chave da API? Há ambiente de teste?
6. Como o pedido é pago: saldo pré-pago, cartão ou fatura?
7. Etiqueta interna e externa: podem sair sem a marca Dimona (campos `inner_label` e `outer_label`)?
   Embalagem neutra? Dá para incluir um cartão nosso?
8. Nota fiscal: vocês emitem para o consumidor final e por qual valor? Quando usamos o envio de NF-e pela
   API (`/nfe`), como funciona?
9. Especificação de arquivo. Mandamos PNG a 300 dpi em sRGB, com linhas finas.
10. Onde produzem e qual o prazo por região?
11. Política para defeito ou avaria no transporte (principalmente quadro).
12. Podemos comprar amostras antes de abrir a venda?

Obrigado,
Everton Quadros
INFLEXO · pedidos@inflexo.com.br

---

## 7. Reserva INK (roupas; decisão de 17/11/2026)

**Para:** api@reserva.ink (contato de integração indicado pela Nuvemshop) ou o chat do painel
**Assunto:** INFLEXO: criar pedidos externos pela API (loja de integração)

Olá, equipe Reserva INK.

Sou Everton Quadros, da INFLEXO (inflexo.com.br). Tenho loja na INK e vendo também pelo meu próprio site, com
checkout próprio. Quero que cada camiseta vendida no meu site vire automaticamente um pedido de integração na
INK, produzido e enviado ao meu cliente.

Já tenho a credencial da API pública e as leituras funcionam (`product_types`, `products`,
`external_orders`, `shipping_simulation`). A documentação (developers.reserva.ink) descreve a "loja de
integração" e os pedidos externos "empurrados via API", mas não traz o endpoint de criação. Podem me informar:

1. Como habilitar a minha loja como loja de integração, ou se preciso de uma loja separada para isso.
2. A documentação do endpoint que cria o pedido externo: formato dos itens (produto, cor, tamanho), endereço
   do cliente, arte de impressão (URL ou upload), identificador do pedido no meu sistema (`api_order_id`) e se
   há idempotência para reenvio.
3. Se a arte vai por pedido ou se preciso cadastrar o produto antes (`POST /v1/stores/products`) e mandar só
   o produto e a variante.
4. Como o custo de cada pedido é cobrado (saldo, pré-pagamento, cartão) e em que momento.
5. Se há ambiente de teste, ou como validar a integração sem gerar produção.
6. Especificação da arte para a área de 4200 × 4800 px: formato (PNG com transparência?), resolução e perfil
   de cor.
7. Quem emite a nota fiscal da venda nesse modelo e o que muda ao migrar a conta para CNPJ.

Obrigado,
Everton Quadros
INFLEXO · pedidos@inflexo.com.br
