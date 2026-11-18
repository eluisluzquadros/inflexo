import Link from 'next/link';
import { EMPRESA } from '../lib/empresa';

/** Bloco de identificação do vendedor, repetido nas páginas legais. */
export function Identificacao() {
  return (
    <p className="legal-id">
      A {EMPRESA.marca} é uma marca da {EMPRESA.razaoSocial} (nome fantasia {EMPRESA.nomeFantasia}), CNPJ {EMPRESA.cnpj}
      {EMPRESA.endereco ? <>, com sede em {EMPRESA.endereco}</> : null}. Contato: <a href={`mailto:${EMPRESA.email}`}>{EMPRESA.email}</a>.
    </p>
  );
}

export function NavLegal() {
  return (
    <nav className="legal-nav" aria-label="Páginas legais">
      <Link href="/termos">Termos de uso e venda</Link>
      <Link href="/privacidade">Privacidade</Link>
      <Link href="/trocas">Trocas, devoluções e arrependimento</Link>
    </nav>
  );
}
