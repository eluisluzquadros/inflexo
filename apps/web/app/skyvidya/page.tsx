import type { Metadata } from 'next';
import '../inicio.css';
import './skyvidya.css';

// Página de escolha da camiseta da equipe Skyvidya: fora do menu e do Google (link compartilhado à mão).
export const metadata: Metadata = {
  title: 'Camiseta Skyvidya',
  description: 'Escolha a estampa da camiseta da equipe Skyvidya.',
  robots: { index: false, follow: false },
};

const MODELOS = [
  { id: 'masculina', rotulo: 'Masculina' },
  { id: 'feminina', rotulo: 'Feminina' },
  { id: 'masculina-2', rotulo: 'Masculina' },
];
const OPCOES = [
  { letra: 'A', id: 'centro', nome: 'Centro', detalhe: 'Símbolo e nome no centro do peito, 22 cm de largura.' },
  { letra: 'B', id: 'peito', nome: 'Peito', detalhe: 'Símbolo e nome no peito esquerdo, 10 cm de largura.' },
];

export default function CamisetaSkyvidya() {
  return (
    <div className="inicio">
      <section className="i-largura sk-topo">
        <p className="i-sobretitulo">Equipe Skyvidya</p>
        <h1>Qual estampa vai na nossa camiseta?</h1>
        <p>Malha preta de algodão, estampa branca impressa direto no tecido, modelos masculino e feminino. Olhe as duas opções e responda com a letra escolhida e o seu tamanho.</p>
      </section>

      {OPCOES.map((o) => (
        <section key={o.id} className="i-largura sk-opcao" aria-labelledby={`sk-${o.id}`}>
          <header>
            <span className="sk-letra">{o.letra}</span>
            <div><h2 id={`sk-${o.id}`}>{o.nome}</h2><p>{o.detalhe}</p></div>
          </header>
          <ul className="sk-fotos">
            {MODELOS.map((m) => (
              <li key={m.id}>
                <img src={`/skyvidya/${m.id}-${o.id}.jpg`} alt={`Opção ${o.letra}, ${o.nome.toLowerCase()}: camiseta preta ${m.rotulo.toLowerCase()} com o símbolo e o nome Skyvidya em branco`} width={900} height={1350} loading="lazy" />
                <span>{m.rotulo}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="i-largura sk-fim">
        <h2>Como responder</h2>
        <p>Mande para quem está organizando: <strong>a letra (A ou B), o modelo (masculino ou feminino) e o tamanho</strong> (PP, P, M, G, GG ou XG).</p>
        <p className="sk-nota">Fotos de modelos geradas por IA, com a estampa real aplicada no tamanho verdadeiro. A cor da tinta e o caimento podem variar um pouco na peça física.</p>
      </section>
    </div>
  );
}
