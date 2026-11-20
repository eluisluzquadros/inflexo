# INFLEXO — design do site

## Home e loja — atualização de 20/11/2026

A rota `/` usa `.inicio` e `app/inicio.css`. A direção atual é **arte, ciência e memória**, com a assinatura **A estética do movimento.** A home não exibe a narrativa, os números, a data ou as fotografias da coleção eleitoral.

- Abertura clara com o casal aprovado em primeiro plano, texto à esquerda e um quadro ao fundo. Ambiente, modelos e estudo visual são camadas independentes. O recorte aprovado é reaproveitado sem regenerar rostos; no celular, a cena vem depois do texto.
- Ambiente v2: `public/hero/ambiente-premium-v2.webp`, 1536 × 1024, 125.454 bytes. Edição com ImageGen integrado: retirados árvore, vaso e mesa lateral, reconstruindo parede e sofá. Parede livre atrás do quadro; modelos e arte continuam em suas camadas originais. O arquivo anterior foi preservado.
- Inflexões (pensamento crítico), Órbitas (pensamento complexo) e Movimentos (pensamento criativo) são apresentadas como coleções em pesquisa ou desenvolvimento, sem preços ou disponibilidade inventados.
- Estado geral: **Em breve**, definido em `lib/lancamento.ts`. A fase bloqueia a criação de novos checkouts mesmo que as variáveis de venda estejam habilitadas. Preços, materiais e condições finais serão apresentados no lançamento.
- Logo depois da abertura, estudos neutros em quatro suportes. O banner eleitoral e os produtos com dados eleitorais foram retirados da home. O acervo anterior permanece em suas rotas, identificado como acervo em estudo.
- Inflexões, Órbitas e Movimentos aparecem com os mesmos nomes na home e no topo da loja; os filtros geográficos pertencem ao acervo e não são apresentados como novas coleções.
- Galeria do produto: fotografia principal, miniaturas, ampliação em diálogo e prévia técnica expansível. No celular, a galeria precede o painel de opções e aviso de lançamento.
- O nome do estilo (Fios ou Gravura) é mantido na ficha; o suporte aparece na linha seguinte. O cadastro preserva a variante escolhida ao retornar à ficha.
- Inflexões usa **Nós no tempo**, desenho-mestre de bambu com um único nó dourado. A imagem de base (`public/inflexoes/bambu-canonico-v1.webp`) permanece idêntica. O ponto é ampliado no SVG para raio de 5,6 unidades, com ouro mais contrastante e filete de papel de 1,1 unidade. Sua posição na junção do ramo é fixa. A forma é uma composição simbólica autoral assistida por IA: conserva nós, folhas, silhueta e ponto em todos os enredos. O render em `packages/render/src/bambuCanonico.mjs` altera apenas título, legenda e marco. Não representa uma curva medida.
- Órbitas mantém a elipse idealizada de `packages/render/src/estudos.mjs`, identificada como estudo matemático. A antiga logística permanece no módulo para referência, fora das prévias de Inflexões.
- A marca principal permanece com o X e o ponto, conforme a escolha do usuário. O estudo A/B do O não é aplicado à loja.
- As aplicações atuais estão em `docs/mockups/bambu-canonico-v2/`, com forma isolada, quadro principal, três histórias e manifesto de integridade. Mestre e prompt originais foram preservados em `docs/mockups/bambu-canonico-v1/`. A exportação das três histórias usa o mesmo grupo SVG (imagem, transformação e ponto); muda somente o texto.
- Navegação: Loja, Coleções e Processo. O menu móvel mantém os mesmos destinos, fecha ao navegar e por Escape.
- O formulário mantém `/api/lista`, consentimento obrigatório e confirmação. A seleção de interesse distingue novidades gerais, cada coleção e vestuário, com pré-seleção a partir dos links de acompanhamento.
- `/loja`, produtos, método e a coleção anterior continuam em suas rotas. Esta atualização reformula a home e o cabeçalho compartilhado.
- A validação atual usa build, testes do projeto e verificação no navegador: home, loja, ficha, filtros, miniaturas, ampliação/Escape, interesse, menu e bloqueio de checkout. Nenhuma inscrição ou compra de teste é enviada.

O restante deste documento registra a direção anterior da loja, que continua como referência das páginas de catálogo.

### Prompt da edição do ambiente v2

Ferramenta: ImageGen integrado, edição da fotografia `public/hero/ambiente-premium.webp`.

```text
Use case: precise-object-edit.
Asset type: photographic background layer for the existing INFLEXO premium home-page hero.
Input image: edit target, the empty interior photograph attached by local reference.
Primary request: simplify ONLY the right edge of this room: completely remove the tall tree/plant, every branch and leaf, its ceramic vase, and the small round stone side table. Seamlessly reconstruct the warm ivory plaster wall, the right edge of the olive sofa, and the floor/rug where those objects were. Keep the room believable and architecturally coherent.
Preserve the existing camera position, landscape composition, warm ivory and muted olive palette, soft natural daylight from the left, realistic plaster texture, wood floor, neutral rug and sofa location. Keep the entire upper-right wall unobstructed with very subtle diffuse illumination, reserved for a separate framed artwork that will be added by website code. The room should feel quieter and refined, with generous negative space and fewer competing details. Keep left-hand wall and sunlight close to original. Sofa cushions and throw may remain understated; do not add anything.
IMPORTANT: output the background room alone, no people, no frame or artwork, no typography, no logos, no website UI, no added plant or decor. Do not include the screenshot; edit only the referenced room photograph. Full-bleed landscape image, no borders.
```

Direção aprovada em 01/11/2026: loja premium de arte e decoração. Referência principal: ambiente claro e acolhedor, catálogo fácil de explorar, obra real em destaque. A marca mantém a assinatura **A estética do movimento.**

## A loja e a história da coleção

- `/`: loja clara, classe `.shop`. Ambiente na abertura, categorias, seleção de quatro peças, coleção de estreia, apresentação da marca, coleções em preparação e fila de espera.
- `/loja`: catálogo com filtros reais por coleção e suporte.
- `/produto/[slug]` e `/geografia/[slug]`: ficha da peça, prévia, opções disponíveis e fila.
- `/colecao/a-geografia-da-virada`: narrativa escura da apuração, com `NoiteScroll`, `LeiturasScroll` e acesso ao catálogo e ao método. A rolagem longa fica nesta rota, fora da loja.
- `/metodo`: explicação das fontes e da reconstrução.

A loja apresenta primeiro o objeto na casa de quem compra. A coleção apresenta a história de onde ele veio. A navegação liga as duas experiências.

## Paleta

| Uso na loja | Cor |
|---|---|
| Marfim, fundo | `#F7F5F0` |
| Papel claro | `#FDFCF9` |
| Tinta, texto | `#252B24` |
| Texto secundário | `#64695F` |
| Linha | `#DEDED4` |
| Oliva, botão e aviso | `#303A2E` |
| Sálvia, fundo da fila | `#E4E8DF` |
| Ouro, ponto da marca | `#B98B18` |

Tokens claros são escopados a `body:has(.shop)`; a loja permanece clara com o sistema em modo escuro. As páginas internas conservam seus tokens originais e `prefers-color-scheme`. `.home` passa a identificar o mundo escuro da história da coleção.

Carmim e cobalto pertencem ao dado das peças. Ouro é o ponto, não o preenchimento de botões ou superfícies. O marcador da marca é circular.

## Tipografia

- **Bodoni Moda:** marca, títulos e nomes de peças. Peso 400 ou 500. Itálico em partes curtas de títulos. Não transformar cada seção em uma abertura gigante.
- **Schibsted Grotesk:** texto, navegação, rótulos, botões e formulário.
- **IBM Plex Mono:** datas, contagens e medidas das peças; não usar em frases ou navegação.

Voz pt-BR, sóbria e breve. Abertura: "O que importa merece ficar." A assinatura da marca continua única. Explicações técnicas pertencem ao método e à página da coleção.

## Composição

- Conteúdo central até 1440 px, com margens de 20 a 56 px. Abertura fotográfica até 1800 px.
- Faixa discreta com assinatura e acesso antecipado; cabeçalho com navegação à esquerda, marca ao centro e acesso à fila à direita.
- Abertura com texto à esquerda, ambiente claro e quadro real sobre a parede à direita. Nada de relógio gigante, personagem ou rolagem obrigatória antes do catálogo.
- Quatro formatos com miniaturas: quadros, pôsteres, arte digital e camisetas. Todos abrem filtros existentes.
- Seleção em quatro colunas; duas no celular. Nome, linha, temas e preço em definição. Foto de ambiente no hover/foco quando disponível.
- Coleção de estreia em duas colunas: texto sobre fundo mineral, foto com as artes reais. Acesso separado à coleção na loja e à sua história.
- Marca em texto curto. Coleções futuras claramente marcadas como em preparação.
- Fila em fundo sálvia, com e-mail, consentimento obrigatório e benefício de acesso antecipado.

Até 760 px, o cabeçalho usa menu expansível, com fechamento ao navegar e por Escape. Na abertura, o texto e as ações aparecem antes do ambiente. A coleção e o formulário empilham. Não há rolagem horizontal.

## Imagens e verdade do produto

- O novo ambiente está em `public/hero/ambiente-premium.webp`. É uma cena gerada com a ferramenta integrada ImageGen, convertida para WebP por `out/preparar-hero-premium.mjs`.
- O quadro é uma camada HTML/CSS independente sobre a fotografia. Seu SVG vem de `previa()`, com marca d'água e o mesmo motor de render da peça. A IA não redesenha a arte.
- A foto da coleção (`public/colecoes/capitais-nordeste.jpg`) e as fotos de produto existentes mostram artes reais aplicadas sobre cenas de IA.
- Crédito de ambiente ilustrativo junto às imagens. Fotos reais entram quando houver amostras.
- Prompt e origem do novo ambiente: `docs/06_DIRECAO_SHOP_PREMIUM.md`.

## Componentes e comportamento

- Botões de oliva, texto marfim, canto reto, altura mínima de 48 px. Hover sóbrio, sem brilho. Links de texto sublinhados ou com seta.
- Círculos reservados ao ponto, às amostras de tema e aos dados; sem arredondamento decorativo de todo contêiner.
- Sem carrinho, favoritos, conta ou busca de fachada. Os controles exibidos têm destinos e comportamentos existentes.
- Sem depoimentos, contadores, frete ou prazos inventados. Preço permanece em definição até a cotação real.
- Fila usa `/api/lista`; posição real, acesso de `HORAS_ANTES` e contador público apenas acima de `LIMIAR_CONTADOR`. Não inserir inscrições fictícias para testar.
- Foco visível, nomes acessíveis nos links de imagem, rótulos de formulário e consentimento obrigatório.
- Transições discretas de hover. Respeitar `prefers-reduced-motion`; a loja não exige movimento. A história conserva sua apresentação estática acessível.

## Verificação

Rodar `npm run web:build` e `npm test`. Conferir visualmente a abertura, a grade e o formulário no desktop e em telas de 390 e 320 px. Testar filtros de categoria, links das peças, menu do celular, rota da história e acesso à fila sem enviar inscrições de teste para a lista real.

Versão anterior preservada em `out/antes-shop-premium-2026-11-01/`.
