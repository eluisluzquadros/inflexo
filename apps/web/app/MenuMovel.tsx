'use client';

import Link from 'next/link';
import { useRef } from 'react';

export function MenuMovel() {
  const menu = useRef<HTMLDetailsElement>(null);
  const fechar = () => menu.current?.removeAttribute('open');
  return (
    <details ref={menu} className="topo-menu" onKeyDown={(event) => {
      if (event.key === 'Escape') { fechar(); menu.current?.querySelector('summary')?.focus(); }
    }}>
      <summary><span className="sr-only">Menu</span><svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M3 6h14M3 10h14M3 14h14" /></svg></summary>
      <nav aria-label="Principal no celular" onClick={fechar}>
        <Link href="/loja">Loja</Link><Link href="/#colecoes">Coleções</Link><Link href="/#processo">Processo</Link>
      </nav>
    </details>
  );
}
