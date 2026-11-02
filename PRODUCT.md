# INFLEXO

**INFLEXO. A estética do movimento.**

Marca de arte de dados e objetos de memória. Transforma o instante em que uma curva muda de rumo (uma eleição, um encontro, uma linha de chegada, um marco de empresa) em peças de parede e objetos físico-digitais, desenhados a partir de dado público verdadeiro e do mapa do lugar de quem compra.

## Tese

- O produto é o dado verdadeiro do lugar de quem compra, desenhado como peça de galeria. Duas linhas numa camiseta qualquer um copia; a curva reconstruída dos boletins de urna sobre as ruas do bairro, não.
- A eleição de 25.10.2026 é a coleção de lançamento e o canal de aquisição. A empresa é o motor de "momentos" que continua depois dela.
- O digital paga a aquisição (entrega imediata, margem alta). O físico dá margem por pedido.
- Objetos físico-digitais (QR e NFC) ficam para depois: exigem fornecedor de tag, gravação e página própria.

## Primeiros produtos (decisão de 31/10/2026)

Só o **gráfico nacional** do 2º turno: a curva real da apuração, reconstruída dos boletins de urna do TSE ([docs/05_METODO_CURVA_NACIONAL.md](docs/05_METODO_CURVA_NACIONAL.md)).

| Produto | Formatos | Temas |
|---|---|---|
| Arquivo digital | PNG 4K, 9:16 (stories) e 16:9 (fundo de tela) | Papel, Tinta |
| Pôster | A3, A2 | Papel, Tinta |
| Quadro emoldurado | A3, A2 | Papel, Tinta |
| Camiseta | estampa quadrada, Gravura | algodão branco |

Estilos no digital, no pôster e no quadro: **Gravura** (padrão), **Fios** (feixes finos sobre papel marfim, ponto dourado na virada; entra já na primeira versão) e **Urnas apuradas**. A camiseta leva a Gravura em algodão branco. Preço só depois da cotação real; até lá a loja mostra "Preço em definição" e recolhe lista de espera. Nada relacionado a bebida alcoólica, em produto ou em mockup.

**Gravura (decisão de 01/11/2026).** O dono trouxe um estilo redesenhado a partir da curva original: três filamentos finos de tinta por trajetória, papel com textura, vermelho em cima e azul embaixo à esquerda, degrau suave, cruzamentos no terço direito, ponto dourado no último cruzamento, as duas trajetórias terminando no mesmo x, sem estrela. Regra do dono: se o dado real não chegasse perto dessa forma, valeria a forma estilizada. Chegou: o motor desenha a Gravura com a série real do relógio (17h07 a 21h07, média móvel de 8 min, escala linear); o ponto cai às 20h23, o mesmo minuto da virada medida. Filamentos, tremor e papel são desenho, e a peça diz isso no rodapé.

**Linguagem.** A plataforma não usa mais "a forma que circula" nem compara a peça com a imagem que circulou depois da eleição. O estilo antigo (relógio com degrau e estrela) fica no motor como "Relógio", fora da vitrine. A peça não escreve o que ela parece.

A peça é a mesma para todos. Sem personalização, sem texto do cliente (logo, sem moderação), sem tag. Recorte por estado e cidade vem depois; os dados por seção já estão processados.

## Coleções (decisão de 01/11/2026)

O escopo abriu em três coleções. "Feito é melhor que perfeito": a versão simples entra primeiro; a personalizada vem depois, com outro preço.

1. **A Geografia da Virada.** A curva nacional sobre o mapa do Brasil, de uma região ou de uma capital, com o resultado real de cada lugar. Começa pelo **Nordeste**: o pôster da região (malha do IBGE, resultado por estado) e as **nove capitais** (ruas do OpenStreetMap, resultado do município). Cada total confere com o TSE, voto a voto, antes de virar peça. A curva desenhada é sempre a nacional; o número local vem escrito, nunca como curva inventada. Há também a **América do Sul invertida** (sul para cima, leste à direita), homenagem à ideia da América Invertida: só a orientação e o traço de tinta, sem copiar o desenho de ninguém; mapa de países em domínio público (Natural Earth) e a curva nacional, sem resultado por país. Desde 01/11/2026 as duas usam a Gravura: nas capitais, as ruas em cinza ao fundo; nas regiões, só o contorno em traço de tinta (versão limpa, inspirada no traço de mapas desenhados à mão), com o resultado por estado fora do desenho e dentro da página da peça.
2. **Momentos.** Data, hora e uma frase do cliente no desenho da casa. Na primeira versão a curva é **ornamento, não medição**, e a vitrine diz isso. Texto do cliente vai para impressão, logo passa por moderação (regra 7 do CLAUDE.md). A versão com dado próprio do cliente é outro produto, com outro preço.
3. **Frases épicas.** Falas de filmes, séries e figuras públicas compostas em tipografia, com o crédito da obra. Só o texto e a atribuição: nada de logotipo, personagem, fotograma ou marca registrada. **Decisão do dono (01/11/2026): usar as frases das obras originais assumindo o risco**; recomendação registrada de consultar advogado de propriedade intelectual antes de abrir a venda, porque frase curta pode ou não ter proteção autoral e título de obra pode ser marca. Fontes de pesquisa em `docs/mockups/frases_epicas/` (texto gerado por IA: conferir cada fala na obra antes de imprimir).

## Público

- **Coleção eleitoral:** quem viveu a noite de 25.10 como momento histórico e quer guardar o registro do próprio lugar (cidade, bairro, local de votação).
- **Coleções seguintes:** casais, corredores, empresas e equipes, quem decora com arte de dados.
- **Como compra:** pelo celular; Pix no digital, cartão parcelado no físico. Compartilha no Instagram, TikTok e WhatsApp.

## Arquitetura de marca

- **INFLEXO**, marca-mãe, com uma única assinatura: "A estética do movimento."
- **Momentos coletivos:** "A Geografia da Virada" (eleição de 2026). Lançamento, começando pelo gráfico nacional; estado e cidade depois.
- **Momentos pessoais:** "Cruzamento de Vidas" (casais), "Linha de Chegada" (corridas). Nomes de trabalho.
- **Empresas:** "Virada de Jogo" (marcos de negócio, B2B). Nome de trabalho.
- "Estética em movimento" não vira segundo slogan (proposta do Gemini): duas assinaturas quase iguais confundem. Uma linha urbana, se existir, ganha nome próprio.

## Verdade do produto

Regras que valem para o código, para a vitrine e para qualquer texto.

- Todo número impresso vem da fonte, com a data do recorte, e a peça diz a fonte ("Fonte: TSE, dados abertos"). Nenhum dado simulado é apresentado como real; amostra é marcada como amostra.
- A prévia é a peça: o mesmo motor gera a prévia e o arquivo de impressão.
- O mockup mostra o produto que será entregue. Cena gerada por IA só como fundo, com a arte real composta por cima; foto real assim que houver amostra.
- Escassez só quando verdadeira: tiragem e numeração vêm do banco.
  - **Fila de espera (decisão de 01/11/2026):** quem entra recebe a posição real na fila e compra 48 horas antes da abertura, por ordem de chegada. O contador público ("N pessoas na fila") conta e-mails únicos de verdade e só aparece a partir de 100 pessoas. Nunca escrever "alta demanda", "últimas unidades" ou número que não saia da fila ou da tiragem.
  - **Primeira tiragem numerada do quadro em fios:** 500 peças (proposta; confirmar antes de abrir a venda). O número sai impresso no rodapé do arquivo de cada pedido ("Nº 037/500"); a prévia mostra "Nº —/500".
- Prazo informado = prazo do fornecedor + manuseio. Nunca "entrega rápida" genérico.
- **Neutralidade:** a INFLEXO registra o momento. Não usa nome, rosto, número ou sigla de candidato ou partido, nem slogans. As cores da peça são as do dado.
- **Privacidade:** a compra da coleção eleitoral pode revelar opinião política, dado sensível pela LGPD. Ela não vai para pixel de anúncio nem para público de remarketing. Nunca pedimos título de eleitor.

## Voz

- Registro, não panfleto. Sóbria, exata, um pouco poética. Sem ponto de exclamação.
- O título diz o momento ou o lugar ("25.10.2026. O dia em que as linhas se cruzaram."), não a técnica.
- Números exatos, formatados em pt-BR, sempre com a fonte por perto.
- pt-BR sempre: usuário, celular, arquivo, compartilhar, seção. Nunca utilizador, telemóvel, ficheiro, partilhar, secção.
- Não vender ausência de defeito nem urgência falsa ("últimas unidades" só quando for verdade).
- "Ponto de inflexão" é usado no sentido comum (virada). Não afirmar que o cruzamento de duas curvas é inflexão no sentido matemático.

| Escrevemos | Não escrevemos |
|---|---|
| 25.10.2026. O dia em que as linhas se cruzaram. | Comemore a vitória do seu candidato! |
| Fonte: TSE, dados abertos. | Dados exclusivos e precisos. |
| As linhas se cruzaram às 20h23, com 47,2% das urnas apuradas. | Reviva a emoção daquela noite histórica!!! |
| Arquivo digital na hora. Quadro no prazo que o fornecedor confirmar. | Entrega rápida |

## Identidade visual (direção a validar)

Prova visual: [`brand/prova-de-marca.html`](brand/prova-de-marca.html), gerada de `brand/prova-de-marca.src.html` por `npm run build:prova` (as peças vêm do motor de render real). O DESIGN.md e os tokens do site nascem no fluxo impeccable quando o front começar.

- **Símbolo:** o X do nome são duas trajetórias que se cruzam, uma grossa e uma fina, como o X de uma didone. O ponto dourado no cruzamento é a virada. Funciona sozinho como selo, favicon e gravação, com uma versão de traço engrossado para tamanhos pequenos.
- **Cores da marca:** Papel `#F1F1EE`, Tinta `#111215`, Grafite `#585A60`, Linha `#D3D3CE` e um único acento, Ouro `#C99A06`, usado só no ponto.
- **Cores de dado:** pertencem à coleção, não à marca. Na eleição: Carmim `#C42B2B` e Cobalto `#1F4FD1`.
- **Tipos (licença OFL, uso comercial e impresso liberados):** Bodoni Moda (marca e títulos), Schibsted Grotesk (texto e interface), IBM Plex Mono (números e dados).

## Nome, domínio e registro

- `inflexo.com.br`: **registrado em 31/10/2026.**
- `inflexo.com`: registrado desde 2012 (vence em 10/02/2027), sem site no ar. Não depender dele.
- **INPI:** busca de anterioridade antes de investir na marca e depósito nas classes 9 (imagens digitais para download), 16 (impressos e quadros), 20 (molduras), 35 (comércio varejista on-line) e 42 (plataforma). Depois, conforme o catálogo: 11 (luminárias), 18 (bolsas), 25 (vestuário), 27 (tapetes).
- Nenhuma empresa "Inflexo" apareceu numa busca rápida na web. Isso não substitui a busca no INPI.

## Documentos

- [docs/01_ANALISE_CRITICA_PROMPT_GEMINI.md](docs/01_ANALISE_CRITICA_PROMPT_GEMINI.md)
- [docs/02_ARQUITETURA.md](docs/02_ARQUITETURA.md)
- [docs/03_FORNECEDORES.md](docs/03_FORNECEDORES.md)
- [docs/04_ROADMAP.md](docs/04_ROADMAP.md)
- [docs/05_METODO_CURVA_NACIONAL.md](docs/05_METODO_CURVA_NACIONAL.md)
