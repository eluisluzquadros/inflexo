# Análise crítica da proposta do Gemini 4 Argon

Fonte: [`doc/ideias_gemini_4argon.pdf`](../doc/ideias_gemini_4argon.pdf) (7 páginas: ideias de produto, a marca INFLEXO, o plano em 3 níveis e o prompt para o Lovable).
Data da análise: 31/10/2026 (seis dias depois do 2º turno).

**Veredito:** a tese de negócio é boa e vale ser aproveitada. O prompt, porém, descreve uma vitrine de protótipo e quebraria em produção em seis frentes: dinheiro, dado, impressão, imposto, privacidade e anúncio. Abaixo, o que entra, o que muda e o que faltava.

---

## 1. O que aproveitar

| Ideia do Gemini | Por que vale | Como entra na INFLEXO |
|---|---|---|
| Nome **INFLEXO**, ligado ao cruzamento das linhas | Conceito próprio, soa como estúdio e não como panfleto | Marca-mãe. O próprio X do nome vira o símbolo (ver [PRODUCT.md](../PRODUCT.md)) |
| "INFLEXO. A estética do movimento." sem exclamação | Sóbrio, de galeria | Assinatura única da marca |
| Hiperlocalização com dado real | É a barreira contra cópia: duas linhas qualquer um copia; a curva oficial sobre as ruas do bairro de quem compra, não | Pipeline de dados (TSE + IBGE + OpenStreetMap) e motor de render |
| Escada de valor: digital barato → físico com crédito do digital | O digital paga a aquisição e o físico dá margem | Regra de crédito no núcleo do checkout, não só um texto na tela |
| Objeto físico-digital (NFC) | Vira experiência e gera o vídeo espontâneo de quem recebe | Fase 2: QR em toda peça, NFC nas edições numeradas |
| Série numerada | Escassez real sustenta preço | Tiragem e numeração no banco, com autenticação na tag |
| Pivô para "momentos" (casais, corridas, empresas) | A eleição é a coleção 1, não a empresa | "Momento" é a entidade central do modelo de dados desde o início |
| Estúdio em duas colunas (prévia + controles) | Padrão que funciona em personalização | Mantido, desenhado primeiro para o celular |
| Três estilos: malha urbana, América Invertida, minimalista | Três leituras do mesmo dado | Três estilos no motor. A América Invertida entra como homenagem desenhada pela INFLEXO. A obra de Torres García (1943) está em domínio público no Brasil desde 2020 (autor morto em 1949; Lei 9.610, art. 41), mas um desenho próprio é mais nosso e mais seguro |

---

## 2. O que corrigir antes de construir

Cada item: o que o prompt pede → o que acontece em produção → como fica.

1. **Dado simulado.** O prompt pede "coordenadas simuladas" e, no refinamento, "reproduzir fielmente o traçado da imagem de referência". → A loja venderia "dado real" sem ter dado real. E copiar o desenho de um gráfico de emissora ou portal pode infringir direito sobre a arte: o dado é livre, o desenho de terceiros não. → A curva é reconstruída dos boletins de urna do TSE ([EXP-316](#6-experimento-registrado), H1) e a peça imprime "Fonte: TSE, dados abertos".

2. **"A curva de como os votos viraram naquela seção" não existe.** Uma seção tem um único boletim de urna: é um ponto, não uma curva. → No nível do local de votação, a peça mostra o resultado daquela urna e **o momento em que ela entrou na contagem**, marcado sobre a curva do município, do estado ou do país. Depende de o horário de recebimento do boletim estar nos dados de 2026 (em 2022 havia a coluna `DT_BU_RECEBIDO`); é a primeira coisa a confirmar.

3. **Gerar e entregar o arquivo no navegador (html2canvas).**
   - Quem gera no navegador baixa sem pagar: "liberar depois do Pix" no cliente é contornável.
   - Um A2 a 300 dpi tem 4.961 × 7.016 px (≈ 34,8 milhões de pixels). O Safari do iPhone limita um canvas a ~16,7 milhões. No celular, onde está o público, o arquivo de impressão não sai.
   - html2canvas rasteriza e erra fontes.
   → O mesmo motor SVG roda no navegador (prévia leve, com marca d'água) e no servidor (PDF vetorial para impressão, PNG para o digital). O arquivo final só é gerado depois do webhook de pagamento e é entregue por link assinado que expira.

4. **Pix pelo Stripe.** O Pix no Stripe chega por parceria com a EBANX, pensada para venda transfronteiriça, e o parcelamento no cartão é limitado no Brasil. Parcelar é decisivo para tíquetes de R$ 169 a R$ 390. → Mercado Pago (Pix + cartão parcelado) como principal; Pagar.me como alternativa; Stripe só se houver venda internacional.

5. **Oito produtos, sete cadeias de produção.** Luminária de acrílico, shadow box, tapete tufting, tábua a laser, azulejo, shape de skate, ecobag bordada e cerveja têm fornecedores, prazos, embalagens e controles de qualidade diferentes. A cerveja exige ainda licença para bebida alcoólica, rótulo registrado e verificação de idade. → Fase 1 com três famílias: digital, parede (impressão sob demanda) e têxtil (impressão sob demanda). Peças de ateliê entram na fase 2 como pré-venda com prazo declarado. Cerveja fica fora. Bordado não é padrão em impressão sob demanda: a ecobag começa estampada.

6. **Preços sem custo.** Os preços (R$ 189 quadro + NFC, R$ 390 tapete) não partem de nenhuma cotação. O próprio texto alterna R$ 19,90 e R$ 29 para o digital, e a "margem de 98 %" ignora taxa do meio de pagamento, imposto e custo de aquisição. → Preço mínimo calculado a partir de cotação real ([04_ROADMAP.md](04_ROADMAP.md), seção "Conta da unidade"). Pela conta ilustrativa, um quadro que custe R$ 110 posto na casa do cliente precisa ser vendido perto de R$ 370 para manter 35 % de margem. R$ 189 só fecha se o custo real for bem menor.

7. **A marca nasce com cor partidária.** A paleta do prompt põe o vermelho e o azul do gráfico como cores da marca. → A marca usa papel, tinta e um único acento (o ouro do ponto de inflexão). Vermelho e azul são cores de dado da coleção eleitoral e ficam nela.

8. **Anúncio pago financiado pela isca.** Anúncio que "se refere a qualquer eleição" cai na política da Meta para temas sociais, eleições ou política: exige autorização do anunciante (documento e verificação em duas etapas), rótulo "Pago por" e fica na Biblioteca de Anúncios pública por sete anos. Sem o rótulo, é reprovado. → Canal principal: orgânico e o vídeo do próprio comprador. Se for anunciar a coleção eleitoral, fazer a autorização antes e separar essas campanhas do resto do catálogo.

9. **Dado sensível.** Comprar a peça de uma virada eleitoral revela opinião política, que a LGPD trata como dado pessoal sensível (art. 5º, II; tratamento no art. 11). → Itens da coleção eleitoral nunca vão para o Pixel ou a API de Conversões nem viram público de remarketing. Consentimento específico para marketing, retenção mínima. Nunca pedir título de eleitor: o local de votação é escolhido no mapa.

10. **Português de Portugal no prompt.** "utilizador", "telemóvel", "secção", "Painel de Controlo", "ficheiro", "partilhar". Para uma marca brasileira, é defeito de texto. → pt-BR em tudo: usuário, celular, seção, painel, arquivo, compartilhar.

11. **Mockup gerado por IA na loja.** As imagens do próprio PDF já mostram números e textos deformados (o rodapé do pôster cartográfico, os números do shape). Mockup diferente do produto é risco de publicidade enganosa (CDC, art. 37), e a Meta passou a rotular imagem fotorrealista gerada por IA. → Cena por IA (Higgsfield) só como fundo. A arte do cliente é aplicada por composição determinística, em perspectiva, a partir do render real. Fotos reais assim que houver amostras físicas.

12. **Texto livre que vai para o papel.** A dedicatória escrita pelo cliente ou gerada por IA é impressa e aparece na página do NFC. → Moderação antes da produção (lista de bloqueio, revisão por IA e fila humana para o que for marcado). O gerador nunca cita candidato, partido ou slogan.

13. **Escassez de texto.** "500 unidades numeradas" só vale se for verdade verificável. → Tiragem no banco, contador público, certificado na tag.

14. **"Ponto de inflexão" na matemática é outra coisa.** Na matemática, inflexão é a troca de concavidade de uma curva; o cruzamento de duas curvas é uma interseção. A marca usa o sentido comum (virada, momento decisivo). O texto não deve dizer que o cruzamento "é o ponto de inflexão" em sentido técnico, porque o público de dados percebe.

15. **O que o prompt não tem e uma loja real precisa:** nota fiscal (NF-e), frete e prazo, troca e direito de arrependimento (CDC, art. 49), termos de uso e privacidade (LGPD), conta do cliente e acompanhamento do pedido, painel de operação (reprocessar, reembolsar, reenviar), webhooks idempotentes, fila de trabalhos, observabilidade, antifraude, acessibilidade, SEO e imagem de compartilhamento por peça. O vetor viral é o link da peça com prévia própria no WhatsApp e no Instagram.

---

## 3. Sobre o tempo

O "nas próximas 48 horas" do Gemini já passou. Uma loja com pagamento, nota fiscal e impressão sob demanda integrados leva semanas. Tentar lançar tudo na onda obrigaria a cortar justamente os itens da seção 2.

Recomendação: separar **captura** de **construção**.

- **Captura (2 a 4 dias, em paralelo):** página da INFLEXO com a coleção, lista de espera (e-mail ou WhatsApp, sem cobrar) e peças-amostra das capitais geradas pelo pipeline do TSE, se os boletins de 2026 já estiverem publicados, para o orgânico. Mede demanda real (inscritos por cidade) sem vender o que ainda não existe. A página já nasce no código definitivo, não é descartável.
- **Construção (fase 1, 2 a 3 semanas, estimativa):** a loja real com o recorte da seção 1.

Se a demanda medida for baixa, perde-se pouco: o motor serve às coleções seguintes.

---

## 4. O que muda por construirmos com Claude Code, e não no Lovable

- O prompt era um pedido de tela. Aqui o trabalho começa pelo modelo de dados, pela máquina de estados do pedido e pelo motor de render, com testes. As telas vêm depois, com DESIGN.md no fluxo impeccable, como no Memorável.
- Os passos de "refinamento no Lovable" (ajustar o SVG pela imagem, subir fotos, html2canvas) são substituídos por: motor de render com testes de referência (o SVG gerado é comparado com um gabarito), pipeline de dados conferido contra o total oficial e composição de mockups a partir do render.

---

## 5. Pontos que estavam em aberto (resolvidos em 31/10/2026)

- "64.256.232 • 51,79%" confere com a divulgação oficial do TSE.
- O horário de recebimento (`DT_BU_RECEBIDO`) existe nos boletins de 2026, na hora de Brasília.
- A autoria do gráfico `image_0.png` deixou de importar: a curva foi reconstruída dos boletins, e o desenho é da INFLEXO ([05_METODO_CURVA_NACIONAL.md](05_METODO_CURVA_NACIONAL.md)).
- Escopo inicial reduzido pelo dono: só o gráfico nacional, sem recorte local e sem NFC.

## 6. Experimento registrado

EXP-316 no ledger compartilhado (`skyvidya-home/.claude/storage/EXPERIMENT_LEDGER.md`):
**H1**: a curva da apuração pode ser reconstruída por Brasil, UF e município a partir dos boletins do TSE.
**H2**: com cotação real no Brasil, o quadro emoldurado fecha margem de contribuição ≥ 35 % a até R$ 249 com frete incluso.

**Resultado de H1 (31/10/2026):** confirmada no nível nacional. 499.205 boletins, soma igual ao oficial com diferença de 0 voto; a troca definitiva de liderança foi às 20:23:38, com 47,2% das urnas apuradas. H2 segue pendente.
