import type { Metadata } from 'next';
import { Personalizador } from './Personalizador';
import '../inicio.css';
import './personalizar.css';

// Fase 1 do personalizador: fora do menu e do Google até ter salvamento e pagamento.
export const metadata: Metadata = {
  title: 'Personalizar camiseta',
  description: 'Crie a estampa da sua camiseta ou da sua equipe: envie a arte, posicione e baixe o arquivo de impressão.',
  robots: { index: false, follow: false },
};

export default function Personalizar() {
  return (
    <div className="inicio">
      <section className="i-largura pz-topo">
        <p className="i-sobretitulo">Personalizar</p>
        <h1>Sua estampa, sua equipe.</h1>
        <p>Envie a arte ou escreva um texto, posicione na frente da camiseta e monte a grade de tamanhos. Estampa só na frente, impressão digital direta no tecido.</p>
      </section>
      <section className="i-largura"><Personalizador /></section>
    </div>
  );
}
