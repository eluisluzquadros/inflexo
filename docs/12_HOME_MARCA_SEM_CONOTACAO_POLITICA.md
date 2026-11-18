# Home da marca — 17/11/2026

A home apresenta a INFLEXO como arte, ciência e memória. Mantém a assinatura “A estética do movimento.” e a paleta marfim, verde e ouro.

## Mudanças

- Sai o destaque eleitoral: título da coleção anterior, placar, data, apuração, certificado de conferência e fotografias com essas inscrições.
- Navegação compartilhada: Loja, Coleções e Processo. O menu móvel tem os mesmos destinos.
- Entram Inflexões (pensamento crítico), Órbitas (pensamento complexo) e Movimentos (pensamento criativo; antes "Momentos"), todas explicitamente em pesquisa ou desenvolvimento.
- Revisão de 18/11/2026: a home volta a vender. "Disponível agora" (categorias em texto e quatro peças da Coleção 01) e o banner escuro "Duas linhas, uma virada." entram logo depois da abertura; o botão principal passa a "Ver as peças".
- Os suportes são apresentados como estudos de aplicação: vestir, habitar e guardar. Não há preço, estoque ou lançamento anunciado para essas novas coleções.
- A lista existente continua em /api/lista, com consentimento obrigatório, contagem real e confirmação. O interesse desta home fica identificado como home-inflexoes.
- A coleção anterior, o catálogo, as páginas de produto e os arquivos de dados não foram apagados ou rebatizados.

## Imagens e rigor

O ambiente claro existente não contém uma obra incorporada. A moldura e o estudo são camadas independentes. O casal usa o PNG transparente aprovado, convertido para WebP sem regenerar rostos. A abertura foi ajustada para recuperar a composição preferida: casal em primeiro plano, quadro menor ao fundo e texto à esquerda. No celular, texto e cena se empilham.

Os SVGs da home saem de packages/render/src/estudos.mjs, de forma determinística. A logística é um modelo matemático com inflexão em t=0. A elipse é uma órbita idealizada. Ambos são identificados como estudos; não são anunciados como população, telemetria ou efemérides reais, nem como artes finais à venda.

Uma futura peça histórica requer série e revisão identificadas, método e cálculo próprios. Não é usado o pico de 1968 da análise antiga; a investigação atual em docs/11_INFLEXOES_E_ESPACO.md ainda tem validação pendente.

## Verificação realizada

- `npm run web:build`: passou, incluindo TypeScript e geração das páginas.
- `npm test`: 27 testes passaram, incluindo os três testes dos estudos matemáticos.
- Navegador Chromium em 1440 × 1000, 390 × 844 e 320 × 740: sem overflow horizontal, sem conteúdo cortado no cartão Momentos e com todas as imagens carregadas.
- 16 âncoras por viewport verificadas. Menu móvel: abrir, fechar por Escape, devolver foco e fechar ao navegar, em ambas as larguras.
- Validação nativa do e-mail e do consentimento, estado de confirmação e rejeição de posição numérica inválida na URL verificados. Nenhum POST de inscrição enviado.
- Nenhum erro de página ou requisição falha. `/loja` responde 200.
- Capturas e relatório local em `out/home-marca-verificacao/` (fora do Git).
