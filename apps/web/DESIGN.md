# INFLEXO — design do site

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
