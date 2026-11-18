# Coleção 02 "Inflexões" e linha espacial (EXP-327)

Análise de 17/11/2026 da conversa com o Gemini (`docs/mockups/gemini/gemini_Pa3aNgw3iRYl.pdf`, 42 páginas),
da ideia de ilustrar grandes viradas do universo, da Terra e da humanidade (na linha do "calendário cósmico") e
das referências de `docs/mockups/space/`.

## Decisão do dono (17/11/2026): a eleição sai da vitrine

A coleção eleitoral continua à venda, mas como "Coleção 01 · A Geografia da Virada", sem discurso político na
vitrine. Feito no site:

- Home: texto de abertura, prova e banner sem TSE, urna nem candidato; saem da home as capitais do Nordeste
  (que mostram o resultado local) e a citação de O Auto da Compadecida (obra protegida; vetada pela Reserva INK).
  Entra "Inflexões" em "Próximas coleções".
- Topo e menu: "Loja · Coleção · Método" (sai "Nordeste" e "A noite"). Aviso: "Nenhuma linha inventada".
  Rodapé: "Dados públicos, método aberto". Descrição do site sem a eleição.
- Continuam com a história completa: `/colecao/a-geografia-da-virada`, `/metodo`, `/geografia/*` e `/loja`.
  O rigor ("0 voto de diferença") é a prova de qualidade da marca e fica onde quem quer conferir procura.

## Regra da coleção

1. A forma vem da série pública. Nada de molde imposto ("Cânone do X" do Gemini, rejeitado): na eleição o X era
   real, as curvas se cruzaram.
2. O ponto de inflexão é **calculado** (máximo da taxa, troca de sinal da curvatura, cruzamento), e o método diz
   como.
3. A legenda só traz número que existe na fonte. Nada de "0 km² de divergência" ou "telemetria real" em curva
   decorativa.
4. A arte sai do motor de render (`packages/render`), igual na prévia e na impressão. Imagem de IA só para mockup.
5. Fora da INK: político, religioso e citação de obra de terceiros. Cosmologia, vida e ciência passam.
   O nome "Cosmos" e imagens da série não entram; a ideia do calendário cósmico, sim.

## Candidatas (fonte pública e inflexão calculável)

| Inflexão | Série | Situação |
|---|---|---|
| População humana | ONU WPP 2024 | prévia feita (Nº 01) |
| CO₂ na atmosfera | Gelo da Antártida, 800 mil anos (NOAA/NCEI) + Law Dome + Mauna Loa | prévia feita (Nº 02) |
| Extinções em massa | Paleobiology Database | a fazer |
| Formação de estrelas | Madau & Dickinson (2014) | a fazer |
| Apollo 11 | Trajetória publicada pela NASA | a fazer |
| Grande Oxigenação | Reconstruções de O₂ (faixa de incerteza obrigatória) | a fazer |

## H1, população: resultado parcial (17/11/2026)

Séries baixadas de Our World in Data em 17/11/2026: `population` (HYDE 2023, Gapminder 2022, ONU WPP 2024,
atualizada em 15/07/2024) e `population-growth-rates` (ONU WPP 2024, estimativas).

| Série | Ano de crescimento máximo | Taxa |
|---|---|---|
| ONU WPP 2024, taxa anual oficial | **1963** | 2,283 % ao ano |
| População OWID, diferença logarítmica anual | **1964** | 2,220 % ao ano |

- Diferença de 1 ano: dentro do critério (≤ 3 anos).
- **Mas as duas séries não são independentes:** a partir de 1950 a série do OWID é a própria ONU. A H1 só passa
  com uma segunda fonte (US Census Bureau, International Database; a API pede chave gratuita).
- **Correção de uma afirmação anterior:** o "pico em 1968, 2,1 %" que circula vem de revisões antigas da ONU.
  Na WPP 2024 o pico é 1963, logo depois do vale de 1959 a 1961 (1,58 % em 1960, a fome na China). A peça teria
  esse vale e o salto como parte do desenho, e a legenda diria a revisão da fonte.
- População: 3,02 bilhões em 1960; 8,09 bilhões em 2023.

### Revisão do conceito (17/11/2026, arquivo oficial WPP 2024, `WPP2024_Demographic_Indicators_Medium.csv.gz`)

O pico da **taxa** (%) não é o ponto de inflexão da curva. Inflexão, no sentido matemático e no nome da
marca, é onde a curva da população para de acelerar: o máximo do **aumento absoluto** por ano.

| Medida (ONU WPP 2024, mundo) | Ano a ano | Por período ou média de 5 anos |
|---|---|---|
| Pico da taxa de crescimento | 1963 (2,28 %; salto depois da fome na China, 1,58 % em 1960) | 1965–1970 (2,05 %), origem do "fim dos anos 1960" |
| **Ponto de inflexão** (maior aumento absoluto) | **1990: 93,7 milhões de pessoas a mais** | 1988 (média móvel de 5 anos: 92,4 milhões) |
| Pico da população (projeção, variante média) | 2084: 10,29 bilhões | — |

- Entre 1986 e 1990 o aumento fica num platô (90,7 a 93,7 milhões); em 2012 quase empata (91,3 milhões).
  A peça mostra o platô e a legenda dá os dois números, em vez de vender um ano como exato.
- A história da peça fica: a humanidade cresceu cada vez mais rápido até 1990; desde então cresce cada vez
  mais devagar; a ONU projeta o pico em 2084. O ponto da inflexão é 1990, calculado, não escolhido.
- A estabilidade entre revisões da ONU (2019, 2022) ainda não foi testada: os arquivos antigos saíram dos
  endereços conhecidos do site da ONU (o site novo monta os links por JavaScript).

## Linha espacial "com cara de Skyvidya"

As imagens de `docs/mockups/space/` são ilustrações de terceiros (uma tem o selo do artista): servem de
referência de clima, não para estampar. O diferencial da Skyvidya é olhar a Terra do céu com dado real; daí
a linha entra na INFLEXO com o mesmo método:

- **O céu de uma data e um lugar**: posição das estrelas sobre uma cidade num dia, calculada pelas efemérides.
  Encaixa em "Momentos" (casamento, nascimento) do roadmap.
- Passagem da Estação Espacial sobre o Brasil, trajetória da Apollo 11, luzes noturnas do país por satélite.

## O que se aproveita da conversa com o Gemini

- Não misturar nichos dentro da INFLEXO.
- Três camadas de leitura: forma de longe, textura de dados de perto, legenda com fonte e número.
- Paleta restrita; estampa só na frente na Reserva INK; kit adulto + infantil (infantil a R$ 46).
- El Niño: boa ideia de dados, e a série ONI da NOAA já está tratada no projeto atma-clima. Cuidado com a
  enchente do RS de 2024: dizer "coincidiu", nunca "causou", e pesar se a marca deve tratar a tragédia.

## Prévia da Inflexão Nº 01 · População (17/11/2026)

- Dados: `py -I pipeline/scripts/populacao_mundo.py` baixa o arquivo da ONU (SHA-256 registrado no JSON),
  calcula inflexão, platô (anos com ≥ 97 % do máximo: 1987–1990 e 2012), pico da taxa e pico projetado, e grava
  `pipeline/output/populacao_mundo_wpp2024.json`.
- Peça: `node packages/render/scripts/render-inflexao-populacao.mjs a3 papel` gera
  `out/inflexoes/populacao_a3_papel.{svg,png}` (A3, 300 dpi), no módulo `packages/render/src/inflexaoPopulacao.mjs`,
  que reaproveita papel, tinta e tremor da Gravura.
- Composição: em cima, a população de 1950 a 2100 (estimativa em tinta até 2023, projeção tracejada em
  grafite); embaixo, o aumento de cada ano, com o topo da onda em 1990; um fio dourado liga os dois pontos.
  Aparecem sem retoque a queda de 1960 (fome na China), a de 2020–2021 (pandemia) e o aumento negativo depois
  de 2084. Cabeçalho "93,7 milhões a mais • 1990", data grande "1990", legenda com o quase empate de 2012.

## Inflexão Nº 02 · CO₂ no ar (17/11/2026, H3 sustentada)

A curva de Keeling ainda acelera: não tem inflexão matemática. A virada é o cruzamento de um limite: o
primeiro ano em que o CO₂ passa, para não voltar, do maior valor dos 800 mil anos anteriores a 1750.

| | Valor |
|---|---|
| Teto natural (registro composto de 800 mil anos) | 298,6 ppm, há ~335 mil anos (igual com corte em 1750 ou 950) |
| Mínimo natural | 173,7 ppm |
| Cruzamento, curva suavizada de Law Dome | **1908** |
| Cruzamento, amostras do gelo (220; datação ±5 anos) | **1913** (primeira passagem em 1909, volta abaixo em 1911) |
| Mauna Loa, 2025 | 427,35 ppm |

- A peça mostra **1908–1913**: dois métodos, um intervalo, nenhum ano escolhido.
- Dados: `py -I pipeline/scripts/co2_ar.py` (SHA-256 das três fontes no JSON). Peça:
  `node packages/render/scripts/render-inflexao-co2.mjs a3 papel` → `out/inflexoes/co2_a3_papel.{svg,png}`.
- **v1 (duas faixas) não foi entendida por um leigo** (o dono, 17/11/2026). **v2:** uma linha do tempo só,
  800 mil anos comprimidos à esquerda e os últimos 275 anos ampliados à direita, com a quebra de escala
  rotulada embaixo de cada trecho; linha do máximo de 800 mil anos; o trecho acima dela em vermelho; ponto
  dourado no cruzamento; título "Por 800 mil anos, o ar nunca passou desta linha."
- **Lição para a coleção:** o título diz o que olhar, em português simples, e cada peça tem uma leitura só.
  A Nº 01 (População) ainda usa duas faixas e um título numérico; precisa da mesma revisão.

## Próximo

1. Teste de leitura (H2) com 5 pessoas, usando as prévias.
2. Estabilidade entre revisões da ONU (2019, 2022) ou Census, se for preciso reforçar a H1.
3. CO₂ e extinções.
