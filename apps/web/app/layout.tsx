import type { Metadata } from 'next';
import Link from 'next/link';
import { Bodoni_Moda, IBM_Plex_Mono, Schibsted_Grotesk } from 'next/font/google';
import './globals.css';
import './topo.css';
import { Marca } from './Marca';
import { MenuMovel } from './MenuMovel';
import { EMPRESA } from '../lib/empresa';

const display = Bodoni_Moda({ subsets: ['latin'], variable: '--f-display', style: ['normal', 'italic'] });
const corpo = Schibsted_Grotesk({ subsets: ['latin'], variable: '--f-corpo' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--f-mono' });

export const metadata: Metadata = {
  metadataBase: new URL(EMPRESA.site),
  title: { default: 'INFLEXO · A estética do movimento.', template: '%s · INFLEXO' },
  description: 'Arte, ciência e memória. A INFLEXO transforma pontos de mudança em peças para vestir, habitar e guardar.',
  alternates: { canonical: './' },
  openGraph: {
    type: 'website', locale: 'pt_BR', siteName: 'INFLEXO',
    images: [{ url: '/hero/ambiente-premium-v2.webp', alt: 'Ambiente claro da INFLEXO. Arte, ciência e memória.' }],
  },
  twitter: { card: 'summary_large_image' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${corpo.variable} ${mono.variable}`}>
      <body>
        <div className="aviso-loja">
          <span><a href="/#fecho">Em breve · A estética do movimento.</a></span>
          <span>Arte, ciência e memória</span>
          <span><a href="/#fecho">Receba o aviso de lançamento</a></span>
        </div>
        <header className="topo topo-v2">
          <Link href="/" className="topo-marca" aria-label="INFLEXO, página inicial"><Marca /></Link>
          <nav className="topo-nav" aria-label="Principal">
            <Link href="/loja">Loja</Link>
            <Link href="/#colecoes">Coleções</Link>
            <Link href="/#processo">Processo</Link>
          </nav>
          <div className="topo-acoes">
            <Link href="/#fecho" className="topo-fila"><span className="topo-fila-desktop">Avise-me no lançamento</span><span className="topo-fila-mobile">Avise-me</span></Link>
            <MenuMovel />
          </div>
        </header>
        <main>{children}</main>
        <footer className="rodape">
          <span>INFLEXO. A estética do movimento.</span>
          <span>Arte, ciência e memória. <Link href="/#processo">Conheça o processo.</Link></span>
          <span className="rodape-legal">
            <Link href="/termos">Termos</Link> · <Link href="/privacidade">Privacidade</Link> · <Link href="/trocas">Trocas e devoluções</Link> · <a href={`mailto:${EMPRESA.email}`}>{EMPRESA.email}</a>
          </span>
          <span className="rodape-legal">{EMPRESA.razaoSocial} · CNPJ {EMPRESA.cnpj}</span>
        </footer>
      </body>
    </html>
  );
}
