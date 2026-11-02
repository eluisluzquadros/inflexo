import type { Metadata } from 'next';
import Link from 'next/link';
import { Bodoni_Moda, IBM_Plex_Mono, Schibsted_Grotesk } from 'next/font/google';
import './globals.css';
import './topo.css';
import { Marca } from './Marca';
import { MenuMovel } from './MenuMovel';
import { HORAS_ANTES } from '../lib/fila';

const display = Bodoni_Moda({ subsets: ['latin'], variable: '--f-display', style: ['normal', 'italic'] });
const corpo = Schibsted_Grotesk({ subsets: ['latin'], variable: '--f-corpo' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--f-mono' });

export const metadata: Metadata = {
  title: { default: 'INFLEXO · A estética do movimento.', template: '%s · INFLEXO' },
  description: 'Arte de dados a partir de dado público. A curva real da apuração de 25.10.2026, reconstruída dos boletins de urna do TSE.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${corpo.variable} ${mono.variable}`}>
      <body>
        <div className="aviso-loja">
          <span><a href="/#fecho">A venda abre em breve. A fila compra {HORAS_ANTES} horas antes.</a></span>
          <span>Primeira tiragem numerada</span>
          <span>Cada número conferido com o TSE</span>
        </div>
        <header className="topo topo-v2">
          <Link href="/" className="topo-marca" aria-label="INFLEXO, página inicial"><Marca /></Link>
          <nav className="topo-nav" aria-label="Principal">
            <Link href="/loja">Loja</Link>
            <Link href="/loja?colecao=nordeste">Nordeste</Link>
            <Link href="/colecao/a-geografia-da-virada">A noite</Link>
            <Link href="/metodo">Método</Link>
          </nav>
          <div className="topo-acoes">
            <Link href="/loja" className="topo-icone" aria-label="Procurar na loja">
              <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="9" cy="9" r="6" /><path d="M13.5 13.5 18 18" /></svg>
            </Link>
            <Link href="/#fecho" className="topo-fila"><span className="topo-fila-desktop">Entrar na fila</span><span className="topo-fila-mobile">Fila</span></Link>
            <MenuMovel />
          </div>
        </header>
        <main>{children}</main>
        <footer className="rodape">
          <span>INFLEXO. A estética do movimento.</span>
          <span>Fonte dos dados: TSE, boletins de urna do 2º turno de 2026.</span>
        </footer>
      </body>
    </html>
  );
}
