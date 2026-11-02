import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Método', description: 'Como a INFLEXO reconstrói a curva da apuração a partir dos boletins de urna do TSE.' };

const conferencia = [
  ['Votos do eleito', '64.256.232', '64.256.232'],
  ['Votos do outro candidato', '59.826.041', '59.826.041'],
  ['Brancos', '1.430.496', '1.430.496'],
  ['Nulos', '2.723.305', '2.723.305'],
  ['Total de votos', '128.236.074', '128.236.074'],
];

export default function Metodo() {
  return (
    <div className="pagina"><article className="metodo">
      <h1>Como a curva foi reconstruída</h1>
      <p>A peça não copia nenhum gráfico. Ela é desenhada a partir dos boletins de urna do 2º turno de 25.10.2026, publicados pelo TSE no Portal de Dados Abertos, cada um com o horário em que chegou ao TSE.</p>

      <h2>O método</h2>
      <p>Lemos os 28 arquivos de boletins (27 estados e o exterior), conferimos o código de integridade (SHA-512) de cada um com o publicado pelo TSE e somamos os votos de presidente boletim a boletim, na ordem de chegada. Cada ponto da curva é a parte de cada candidato nos votos válidos naquele instante.</p>
      <p>Entre 17h07 e 19h03 nenhum boletim chegou: as linhas ficam paradas. Às 19h03 as urnas chegam em massa, as linhas se aproximam, se cruzam às 19h44 e de novo às 20h23, a troca definitiva. A forma impressa vai do último boletim antes da pausa (17h07) até a curva estabilizar no resultado final (21h07).</p>

      <h2>A conferência</h2>
      <div className="tabela">
        <table>
          <thead><tr><th scope="col">Item</th><th scope="col">Nossa soma</th><th scope="col">Resultado oficial</th></tr></thead>
          <tbody>
            {conferencia.map(([item, nosso, oficial]) => (
              <tr key={item}><td>{item}</td><td className="n">{nosso}</td><td className="n">{oficial}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>Diferença: zero voto em cada linha. Foram 499.205 boletins.</p>

      <h2>O que é estilo</h2>
      <p>Na Gravura, cada trajetória é a curva real em média móvel de 8 minutos, no relógio de 17h07 a 21h07, em escala linear. Os três filamentos, o tremor da tinta e a textura do papel são desenho. O ponto dourado fica no último cruzamento das linhas desenhadas, às 20h23: o mesmo minuto da virada medida. No estilo Fios, o traçado central é a curva com média móvel de 24 minutos; a abertura dos feixes e os pontos são desenho.</p>

      <h2>O que a peça não traz</h2>
      <p>Nenhum nome, número ou partido de candidato. Só a curva, o resultado e a data.</p>
    </article></div>
  );
}
