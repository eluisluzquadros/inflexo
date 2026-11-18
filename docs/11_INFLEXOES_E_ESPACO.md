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
| População humana | ONU WPP 2024; HYDE/Gapminder (via Our World in Data) | H1 testada em parte (abaixo) |
| CO₂ na atmosfera | Keeling (Mauna Loa) + núcleos de gelo EPICA | a fazer |
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

## Próximo

1. Segunda fonte para a H1 (chave do Census IDB) e prévia da peça "População" no motor de render.
2. Teste de leitura (H2) com 5 pessoas.
3. CO₂ e extinções.
