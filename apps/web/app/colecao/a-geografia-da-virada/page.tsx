import type { Metadata } from 'next';
import Link from 'next/link';
import { noite } from '../../../lib/noite';
import { previa } from '../../../lib/loja';
import { NoiteScroll } from '../../NoiteScroll';
import { LeiturasScroll } from '../../LeiturasScroll';

export const metadata: Metadata = { title: 'A Geografia da Virada', description: 'A história da noite de 25.10.2026, reconstruída dos boletins de urna do TSE e transformada em arte.' };

export default function HistoriaDaColecao() {
  const n = noite();
  return (
    <div className="home historia-colecao">
      <header className="historia-abertura">
        <p>A Geografia da Virada · Coleção de estreia</p>
        <h1>O instante em que<br />a noite virou.</h1>
        <p>{n.boletins.toLocaleString('pt-BR')} boletins de urna. Quatro horas de apuração. Uma história desenhada pelos próprios dados.</p>
        <Link className="botao-noite" href="/loja?colecao=nordeste">Explorar as peças ↗</Link>
        <a className="link-noite" href="#a-noite">Percorrer a noite ↓</a>
      </header>
      <div id="a-noite"><NoiteScroll n={n} /></div>
      <LeiturasScroll leituras={[
        { id: 'gravura', nome: 'Gravura', descricao: 'A curva da noite em três filamentos de tinta sobre papel, das 17h07 às 21h07. O ponto dourado marca o último cruzamento das linhas.', href: '/produto/quadro?estilo=gravura', svg: previa({ estilo: 'gravura', tema: 'papel', formato: 'a3' }) },
        { id: 'fios', nome: 'Fios', descricao: 'A mesma curva em feixes de fios finos sobre papel marfim. O ponto dourado marca a virada das 20h23.', href: '/produto/quadro?estilo=fios', svg: previa({ estilo: 'fios', tema: 'marfim', formato: 'a3' }) },
      ]} />
      <section className="historia-prova">
        <h2>O desenho vem do dado.</h2>
        <p>Cada ponto é a soma dos boletins na ordem em que chegaram ao TSE. No fim, a reconstrução confere com o resultado oficial, voto a voto.</p>
        <div><Link className="botao-noite" href="/loja">Encontrar minha peça ↗</Link><Link className="link-noite" href="/metodo">Conhecer o método</Link></div>
      </section>
    </div>
  );
}
