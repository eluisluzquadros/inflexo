# INFLEXO — Dobra temporal, estudo 01

Direção explorada em 17/11/2026 a pedido do usuário: uma forma-assinatura fixa, independente da forma eleitoral, que possa receber diferentes histórias e marcos.

## O que permanece

- Silhueta assimétrica de um único feixe contínuo que muda de direção.
- 64 fios finos, dois deles em ouro discreto, e nove pontos secundários.
- Um único marco dourado na dobra, sempre na mesma posição.
- Proporções, desenho e posições dos detalhes iguais em todas as narrativas. O motor não recebe datas ou valores como parâmetros geométricos.
- Papel marfim e tinta escura; variante noturna com a mesma geometria.
- Bodoni Moda e IBM Plex Mono, usando as fontes locais do projeto.

## O que varia

Número da peça, título, subtítulo, marco temporal e fonte. A comparação mostra Origem, Planeta e Humanidade com a MESMA forma.

## Natureza da coleção

Este cânone é simbólico, como uma assinatura visual. Os fios não representam uma medição, genealogia, trajetória física ou escala de tempo. A informação histórica pertence à legenda, com aproximação e fonte identificadas.

Isso é uma direção distinta das peças de dados medidos: nessas, a forma continua vindo da série observada. Uma forma simbólica fixa não deve ser anunciada como telemetria ou curva empírica.

## Fontes das três aplicações

- Universo, cerca de 13,8 bilhões de anos: [NASA — Overview](https://science.nasa.gov/universe/overview/).
- Terra, cerca de 4,54 bilhões de anos: [USGS — Precambrian Time, FS 2007–3004](https://pubs.usgs.gov/fs/2007/3004/pdf/FS07-3004_508.pdf).
- Homo sapiens, cerca de 300 mil anos: [Smithsonian — Human Origins Program](https://humanorigins.si.edu/evidence/human-fossils/species/homo-sapiens).

As datas são estimativas científicas, não instantes exatos. Em particular, o surgimento de uma espécie é um processo, e o ponto da arte simboliza o marco editorial.

## Arquivos e reprodução

- Motor vetorial: `packages/render/src/dobraTemporal.mjs`.
- Gerador: `node packages/render/scripts/explorar-dobra-temporal.mjs`.
- Comparação: `docs/mockups/dobra-temporal-v1/00-sistema-canonico.png`.
- Três aplicações em SVG e PNG: `01-origem`, `02-planeta`, `03-humanidade`.
- Variante escura em SVG e PNG: `04-origem-noite`.
- Saídas individuais com 1680 × 2376 px; painel comparativo com 2400 × 1800 px. Os SVGs preservam as coordenadas para ampliação.
- Três testes verificam a permanência da forma, a identificação simbólica e o escape dos textos.

Esta é uma exploração de linguagem; não substitui automaticamente o hero nem as artes já existentes.
