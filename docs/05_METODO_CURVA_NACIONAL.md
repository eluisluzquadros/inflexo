# Método: a curva nacional da apuração (2º turno, 25/10/2026)

Como a INFLEXO reconstrói o gráfico da noite a partir de dado público, e como conferir. Este texto pode virar a página pública de método da loja.

## Fontes

| Fonte | O que é | Endereço |
|---|---|---|
| Boletins de urna (bweb), 2º turno | 28 arquivos (27 UFs + exterior), publicados em 26/10/2026 às 07:42; um registro por seção, votável e cargo, com o horário em que o boletim chegou ao TSE | `https://cdn.tse.jus.br/estatistica/sead/eleicoes/eleicoes2026/buweb/bweb_2t_<UF>_261020260742.zip` |
| Hash SHA-512 de cada arquivo | publicado pelo TSE ao lado de cada zip | mesmo endereço + `.sha512` |
| Resultado oficial (divulgação) | totais nacionais de Presidente, 2º turno (eleição 6258), divulgação final às 23:26:38 | `https://resultados.tse.jus.br/oficial/ele2026/6258/dados/br/br-c0001-e006258-u.json` |
| Fim da totalização por UF | usado para conferir o fuso dos horários | `https://resultados.tse.jus.br/oficial/ele2026/6258/dados/br/br-e006258-ab.json` |

O catálogo do portal (dadosabertos.tse.jus.br, conjunto `resultados-2026-boletim-de-urna`) tem um erro: o link do CSV de RR no 2º turno aponta para o arquivo `.sha512`. O zip correto segue o mesmo padrão de nome dos demais.

## Como a curva é feita

1. Ler cada zip sem extrair e manter só o cargo Presidente (`CD_CARGO_PERGUNTA = 1`).
2. Agrupar por boletim (UF, município, zona, seção). Cada boletim tem um único `DT_BU_RECEBIDO`; o script para se encontrar dois.
3. Ordenar os boletins pelo horário de chegada ao TSE e somar os votos na ordem.
4. A cada segundo com chegada, registrar: urnas apuradas (boletins recebidos ÷ 499.205) e a parte de cada candidato nos votos válidos.
5. A peça tem duas leituras do mesmo dado:
   - **Relógio (padrão):** eixo horizontal = hora de chegada, de 17h05 a 23h21, com todos os 4.846 instantes de chegada. Quando passa mais de 30 s sem boletim, a linha fica parada até o próximo (degrau), sem diagonal inventada.
   - **Urnas apuradas:** eixo horizontal = percentual de boletins recebidos, a partir de 1% (19h03). Antes disso, poucas dezenas de boletins fazem a curva oscilar de 41% a 58%.

## A janela da forma (padrão dos produtos)

A forma que circulou depois da eleição é a curva no relógio **recortada** do último boletim antes da pausa (17:07:27) até o instante em que a curva fica a menos de 0,05 ponto do resultado final e não sai mais disso (21:07:37). Os dois limites são calculados pelo próprio dado (`janelaDaForma` em `packages/render/src/graficoNacional.mjs`), não escolhidos a olho. Com eles, o degrau de 19h03 cai a 48,4% da largura, o mesmo ponto da imagem que circula. A faixa do gráfico tem proporção 4,5:1. A estrela no fim da linha do eleito é o único elemento que não vem do dado. O traço de giz da estampa é só textura (filtro SVG); os pontos são os do dado. Fica fora da janela a cauda das 21h07 às 23h21, em que os percentuais variam menos de 0,05 ponto. A janela completa (17h05–23h21) continua disponível como opção.

## A pausa e a forma da noite

Nenhum boletim chegou ao TSE entre **17:07:27 e 19:03:37** (1h56). No eixo de relógio isso aparece como duas linhas paradas e afastadas (55,5% × 44,5%). Depois vêm a chegada em massa, as duas trocas de liderança e uma cauda de 21h15 a 23h21 em que os percentuais quase não mudam (os últimos 0,2% das urnas). É essa sequência que dá à peça a silhueta que circulou na noite. A forma é do dado, não do desenho.

## Conferência (critério do EXP-316, H1)

| Item | Reconstruído | Oficial | Diferença |
|---|---|---|---|
| Votos do eleito | 64.256.232 | 64.256.232 | 0 |
| Votos do outro candidato | 59.826.041 | 59.826.041 | 0 |
| Brancos | 1.430.496 | 1.430.496 | 0 |
| Nulos | 2.723.305 | 2.723.305 | 0 |
| Total de votos | 128.236.074 | 128.236.074 | 0 |
| Seções | 499.205 boletins | 499.207 instaladas | −2 |

- Os 28 hashes SHA-512 conferem com os publicados pelo TSE.
- Duas seções instaladas não têm boletim de Presidente nos arquivos; não afetam nenhum total de votos.
- **Fuso:** `DT_BU_RECEBIDO` está na hora de Brasília em todas as UFs. O fim oficial por UF é publicado no fuso local: o último boletim do AC aparece 120 min depois do fim oficial, e os de AM, MS, MT, RO e RR, 60 min; nas UFs no fuso de Brasília, o último boletim chega segundos antes do fim oficial.

## O que a curva mostra

| Instante | Urnas apuradas | Eleito | Outro |
|---|---|---|---|
| 19:03:46 | 1,1% | 52,72% | 47,28% |
| 19:44:17 | 13,5% | 49,998% | 50,002% (troca de liderança) |
| 20:07:32 | 30,0% | 49,55% | 50,45% |
| **20:23:38** | **47,2%** | **50,002%** | **49,998% (troca definitiva)** |
| 21:09:39 | 99,0% | 51,75% | 48,25% |
| 23:21:40 | 100% | 51,79% | 48,21% |

- O primeiro boletim chegou às 17:05:10; SP e RJ só começam a chegar às 19:03, o que explica as primeiras horas lentas.
- O ponto de ouro da peça marca 20h23, a última troca de liderança.

## Limites

- A divulgação da noite saiu em lotes. A curva por horário de recebimento segue a mesma ordem, mas não reproduz cada lote exibido na TV ou no site do TSE.
- O eixo é "urnas apuradas" (boletins recebidos), como a contagem do TSE.

## Reproduzir

```
npm run dados:nacional    # lê os zips, confere com o oficial e escreve pipeline/output/
npm run render:nacional   # gera os SVGs em out/nacional/
npm test                  # confere totais, números impressos, determinismo e neutralidade
```

Os zips ficam em `pipeline/data/raw/` (fora do Git); baixar de novo com os endereços acima e conferir o `.sha512`.

Saídas:
- `pipeline/output/curva_presidente_2t_2026_br.json`: amostra para desenho (um ponto a cada 0,1% das urnas, mais as viradas), conferência, fontes e hashes.
- `pipeline/output/serie_completa_presidente_2t_2026_br.json.gz`: a série segundo a segundo.
- `pipeline/data/interim/boletins_presidente_2t_2026.csv.gz`: um registro por boletim, base para o recorte por estado e cidade.
